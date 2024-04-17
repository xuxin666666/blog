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
export const getArticleList = (props: IGetArticleListProps) => defaultServer.get('/article/list', {params: props}).then<IGetArticleListReturn>(res => res.data)



export interface IGetArticleTagsReturn {
    tags: {
        tagName: string
        pageNum: number
    }[]
}
export const getArticleTags = () => defaultServer.get('/article/tags').then<IGetArticleTagsReturn>(res => res.data)



export interface IGetArticleStatisticsReturn {
    views: number
    words: number
    pages: number
    likes: number
}
export const getArticleStatistics = () => defaultServer.get('/article/statistics').then<IGetArticleStatisticsReturn>(res => res.data)