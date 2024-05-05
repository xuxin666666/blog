// import axios from "axios"
import { defaultServer } from "../config"



export interface IGetArticleListProps {
    pageSize: number
    page: number
    tags?: string[]
    q: string
}
export interface IGetArticleListReturn {
    list: {
        id: string,
        title: string
        content: string
        tags: string[]
        image?: string
        views: number
        likes: number
        createTime: number
        updateTime?: number
    }[],
    total: number
}
export const getArticleList = (props: IGetArticleListProps) => defaultServer.get('/article/list', { params: props }).then<IGetArticleListReturn>(res => res.data)



export interface ITag {
    tagName: string
    color: string
}
export interface IArticleTag extends ITag {
    pageNum: number
}
export const getArticleTags = () => defaultServer.get('/article/tags').then<IArticleTag[]>(res => res.data)

export const createArticleTags = (tags: ITag[]) => defaultServer.post('/article/tags', {tags}).then<void>(res => res.data)


export interface IGetArticleStatisticsReturn {
    views: number
    words: number
    pages: number
    likes: number
}
export const getArticleStatistics = () => defaultServer.get('/article/statistics').then<IGetArticleStatisticsReturn>(res => res.data)



export interface IGetArticleDetailReturn {
    id: string,
    title: string
    content: string
    tags: string[]
    views: number
    likes: number
    createTime: number
    updateTime?: number
    words: number
}
export const getArticleDetail = (id: string) => defaultServer.get(`/article/${id}`).then<IGetArticleDetailReturn>(res => res.data)



export const setArticleLike = (id: string, like = false) => defaultServer.post(`/article/${id}/like`, { like }).then<void>(res => res.data)



interface IPublishArticleProps {
    id?: string
    title: string
    content: string
    abstract: string
    tags: string[]
    words: number
    imgs?: {name: string, data: File}[]
}
export const publishArticle = async (props: IPublishArticleProps) => {
    const form = new FormData()
    // let key: keyof IPublishArticleProps
    for(const [key, val] of Object.entries(props)) {
        if(key === 'imgs') {
            for(const img of val) {
                form.append(key, img.data, img.name)
            }
        }
        else form.append(key, val)
    }
    const res = await defaultServer.post('/article', form)
    // const res = await axios.post('http://localhost:8000/article', form)
    const result: string = res.data
    return result
}