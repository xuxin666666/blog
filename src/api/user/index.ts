import store from "store"
import { defaultServer } from "../config"
import { SHA256 } from "@/utils/crypto"


export enum UserRoleWeight {
    normal,
    admin
}

export type UserRole = keyof typeof UserRoleWeight

export interface IUserInfo {
    username: string
    avatar: string
    email: string
    uid: number,
    role: UserRole
}

export interface ILoginProps {
    email: string
    password: string
}

export interface IRegisterProps {
    email: string
    username: string
    password: string
    code: string
}


// 对密码进行hash处理
// 1. 攻击者嵌入脚本监测用户输入没用（似乎根本不需要这么麻烦）
// 2. 被截取了也只是这个账号密码泄露了，不会影响到用户的其他账号密码（应该很多用户都喜欢不同网站用同一个账号密码）
async function encPwd(obj: Record<string, any> & {password: string}) {
    if(obj.password) {
        return {...obj, password: await SHA256(obj.password)}
    }
    return obj
}


export const autoLogin = () => defaultServer.get('user/auto').then<IUserInfo>(res => res.data)

export const login = (props: ILoginProps) => encPwd(props).then(props => defaultServer.post('user', props).then<IUserInfo>(res => {
    const token = res.data.token
    store.set('token', token)
    return res.data.data
}))

export const register = (props: IRegisterProps) => encPwd(props).then(props => defaultServer.post('user/register', props).then<void>(res => res.data))