
import bayiyonglin from '@/assets/images/homePage/bayiyonglin.avif'
import bayunzi from '@/assets/images/homePage/bayunzi.avif'
import leimiliya from '@/assets/images/homePage/leimiliya.avif'
// import lingmeng from '@/assets/images/homePage/lingmeng.avif'
// import lumiya from '@/assets/images/homePage/lumiya.avif'
// import paqiuli from '@/assets/images/homePage/paqiuli.avif'
import qilunuo from '@/assets/images/homePage/qilunuo.avif'
import type { IHeaderTitles } from "@/components/Layout/Header"



export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const baseURL = "/api"
export const imageUrl = "/api/static/"
export const ioUrl = "/api"



export const headerTitles: IHeaderTitles[] = [
    { path: '/page1', text: '页面1' },
    { path: '/page2', text: '页面2' },
    { path: 'https://leetcode.cn/problemset/all/', text: 'lk', out: true }
]


interface IHomePageList {
    image: string
    title: string
    to: string
    // 主题色，内部会自动生成
    primary?: string
    subtitle?: string
}
export const homePageList: IHomePageList[] = [
    { image: qilunuo, title: '文章', subtitle: '遨游于知识的海洋', to: '/articles' },
    { image: leimiliya, title: '闲杂话语', subtitle: '没事发发牢骚', to: '/meaningless' },
    { image: bayiyonglin, title: '找歌', subtitle: '寻一处心灵寄托', to: '/musics' },
    { image: bayunzi, title: '未完待续', subtitle: '啊嘞，这就没了……', to: '' }
]
