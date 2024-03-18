import type { IHeaderTitles } from "@/components/Layout/Header"


export const baseURL = "http://localhost:3000/api"
export const imageUrl = "http://localhost:3000/api/static/"
export const ioUrl = "http://localhost:3000/api"



export const headerTitles: IHeaderTitles[] = [
    {path: '/page1', text: '页面1'},
    {path: '/page2', text: '页面2'},
    {path: 'https://leetcode.cn/problemset/all/', text: 'lk', out: true}
]