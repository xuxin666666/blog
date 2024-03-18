import axios from "axios";
import store from "store";
import { baseURL } from "@/utils/constants";



const defaultServer = axios.create({
    baseURL,
    headers: {
        Authorization: 'Bearer ' + store.get('token')
    }
})
defaultServer.interceptors.request.use(config => {
    return config
})
defaultServer.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error)
    }
)


export {
    defaultServer
}

