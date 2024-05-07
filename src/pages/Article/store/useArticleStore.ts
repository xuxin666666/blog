import { createStore } from "hox";
import { useMemoizedFn } from "ahooks";
import { useState, useRef } from "react";

import { clearCache, useSWRRequest } from "@/hooks/useSWRRequest";
import { getArticleList, IGetArticleListProps, IGetArticleListReturn, deleteArticle as delA } from "@/api/article";
import { useStatisticsStore, useTagStore } from ".";




export const articleListCache = '_article_list_'

const defaultProps: IGetArticleListProps = { page: 1, pagesize: 10, q: '', tags: [] }
const defaultData = { list: [], total: 0 }

export const [useArticleStore, ArticleStoreProvider] = createStore(() => {
    const { refreshForce: refreshTag } = useTagStore(data => [data.refreshForce])
    const { refreshForce: refreshStatistics } = useStatisticsStore(data => [data.refreshForce])

    const { loading, runAsync: getListAsync } = useSWRRequest(getArticleList, {
        cacheKey: articleListCache,
        manual: true,
        staleTime: 120000
    })
    const [data, setData] = useState<IGetArticleListReturn>(defaultData)
    const params = useRef<IGetArticleListProps>(defaultProps)

    const appendData = useMemoizedFn(() => {
        if (loading) return
        params.current.page++
        
        setData({...data, list: data.list.slice(0, data.list.length - 1)})
        return getListAsync(params.current).then(newData => {
            setData({
                list: [...data.list, ...newData.list],
                total: newData.total
            })
        }).catch(err => {
            params.current.page--
            return Promise.reject(err)
        })
    })

    const getNewData = useMemoizedFn((props?: Partial<IGetArticleListProps>) => {
        if (loading) return
        params.current = { ...defaultProps, ...props }

        return getListAsync(params.current).then(newData => {
            setData(newData)
        })
    })

    const refreshForceAll = () => {
        refreshTag()
        refreshStatistics()
        clearCache(articleListCache)
    }

    const deleteArticle = async (id: string) => {
        await delA(id)
        refreshForceAll()
    }



    return {
        data,
        loading,
        appendData,
        getNewData,
        deleteArticle,
        refreshForceAll
    }
})