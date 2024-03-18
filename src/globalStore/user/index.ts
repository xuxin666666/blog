import { useState, useEffect } from 'react'
import { createGlobalStore } from 'hox'
import { useRequest } from 'ahooks'
import { login, register, autoLogin } from '@/api/user'
import store from 'store'
import type { ILoginProps, IRegisterProps, IUserInfo } from '@/api/user'



const defaultUserInfo: IUserInfo = {
    username: '',
    avatar: '',
    email: '',
    uid: 100000000,
    role: 'normal'
}

export const [useUserStore, getUserStore] = createGlobalStore(() => {
    const [isLogin, setIsLogin] = useState(false)

    const { data, mutate } = useRequest(autoLogin)
    const { runAsync: mLogin, loading: loginLoading } = useRequest(login, { manual: true })
    const { runAsync: mRegister, loading: registerLoading } = useRequest(register, { manual: true })

    useEffect(() => {
        if (data) setIsLogin(true)
        else setIsLogin(false)
    }, [data])

    const logout = () => {
        mutate(undefined)
        store.remove('token')
    }

    const cLogin = (props: ILoginProps, callback: (data: IUserInfo) => void) => {
        mLogin(props).then((data) => {
            mutate(data)
            callback(data)
        }).catch(err => {
            console.log(err)
        })
    }

    const cRegister = (props: IRegisterProps, callback: () => void) => {
        mRegister(props).then(() => {
            callback()
        }).catch(err => {
            console.log(err)
        })
    }


    return {
        userInfo: data || defaultUserInfo,
        login: cLogin,
        loginLoading,
        register: cRegister,
        registerLoading,
        logout,
        isLogin
    }
})