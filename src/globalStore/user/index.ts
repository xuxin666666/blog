import { useState, useEffect } from 'react'
import { createGlobalStore } from 'hox'
import { useRequest } from 'ahooks'
import { login, autoLogin } from '@/api/user'
import store from 'store'
import type { ILoginProps } from '@/api/user'



// 用户登录，目前设计就我一个用户，其他皆为游客，因此不需要过多内容
export const [useUserStore, getUserStore] = createGlobalStore(() => {
    const [isLogin, setIsLogin] = useState(true)

    const { data, mutate } = useRequest(autoLogin)
    const { runAsync: mLogin, loading: loginLoading } = useRequest(login, { manual: true })

    useEffect(() => {
        if (data) setIsLogin(true)
        else setIsLogin(false)
    }, [data])

    const logout = () => {
        mutate(undefined)
        store.remove('token')
    }

    const cLogin = async (props: ILoginProps) => {
        const data = await mLogin(props)
        mutate(data)
        return data
    }


    return {
        login: cLogin,
        loginLoading,
        logout,
        isLogin
    }
})