import store from "store"
import { defaultServer, defaultSetToken, reLoginServer, reLoginSetToken } from "../config"
import { SHA256 } from "@/utils/crypto"



export interface ILoginProps {
    email: string
    password: string
}

export interface ILoginReturns {
    username: string
    email: string
    headPic: string
}

export interface IChangePasswordProps {
    newPassword: string
    captcha?: string
    oldPassword?: string
}

// 对密码进行hash处理
// 1. 攻击者嵌入脚本监测用户输入没用（似乎根本不需要这么麻烦）
// 2. 被截取了也只是这个账号密码泄露了，不会影响到用户的其他账号密码（应该很多用户都喜欢不同网站用同一个账号密码）
async function encPwd(obj: Record<string, any>, ...keys: string[]) {
    if(keys.length === 0) keys.push('password')

    for(const key of keys) if(Object.hasOwn(obj, key)) obj[key] = SHA256(obj[key])
    return obj
}


export const autoLogin = () => reLoginServer.post('user/auto').then<ILoginReturns>(res => {
    const accessToken = res.data.accessToken
    store.set('accessToken', accessToken)
    defaultSetToken(accessToken)
    return res.data.userInfo
})

export const login = (props: ILoginProps) => encPwd(props).then(props => defaultServer.post('user/login', props).then<ILoginReturns>(res => {
    const refreshToken = res.data.refreshToken
    const accessToken = res.data.accessToken
    store.set('refreshToken', refreshToken)
    store.set('accessToken', accessToken)
    reLoginSetToken(refreshToken)
    defaultSetToken(accessToken)
    return res.data.userInfo
}))

export const changePassword = (props: IChangePasswordProps) => encPwd(props, 'newPassword', 'oldPassword').then(props => defaultServer.post('user/changePassword', props)).then<void>(res => res.data)