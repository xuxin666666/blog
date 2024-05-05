import axios from "axios";
import store from "store";

import { baseURL } from "@/utils/constants";
import { autoLogin } from "./user";
import { getUserStore } from "@/globalStore/user";



const status = {
    isRefreshing: false,
    isSuccessed: false
}
const requests: any[] = []



const getToken = (token: string) => 'Bearer ' + token

export const reLoginServer = axios.create({
    baseURL,
    headers: {
        Authorization: getToken(store.get('refreshToken'))
    }
})
reLoginServer.interceptors.response.use(
    response => response,
    error => {
        if(error.response.status === 401) {
            store.remove('refreshToken')
            store.remove('accessToken')
        }
        getUserStore()?.logout()
        return Promise.reject(error)
    }
)

export const defaultServer = axios.create({
    baseURL,
    headers: {
        Authorization: getToken(store.get('accessToken'))
    }
})
defaultServer.interceptors.request.use(config => {
    return config
})
defaultServer.interceptors.response.use(
    response => response,
    error => {
        if(error.response.status === 401 && store.get('refreshToken')) {
            if(!status.isRefreshing) {
                status.isRefreshing = true
                status.isSuccessed = false

                autoLogin().then(() => {
                    status.isSuccessed = true
                }).finally(() => {
                    status.isRefreshing = false
                    requests.forEach(cb => cb())
                    requests.length = 0
                })
            }

            return new Promise((resolve, reject) => {
                requests.push(() => {
                    if(status.isSuccessed) {
                        const token = getToken(store.get('accessToken'))
                        error.config.headers.Authorization = token
                        resolve(defaultServer(error.config))
                    }
                    else reject(error)
                })
            })
        } else {
            return Promise.reject(error)
        }
    }
)


export const reLoginSetToken = (token?: string) => {
    reLoginServer.defaults.headers.Authorization = 'Bearer ' + token || store.get('refreshToken')
}

export const defaultSetToken = (token?: string) => {
    defaultServer.defaults.headers.Authorization = 'Bearer ' + token || store.get('refreshToken')
}
