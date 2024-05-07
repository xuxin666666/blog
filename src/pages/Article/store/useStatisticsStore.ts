import { createStore } from "hox";

import { getArticleStatistics } from "@/api/article";
import { clearCache, useSWRRequest } from "@/hooks/useSWRRequest";
import { useMemoizedFn } from "ahooks";




const articleStatisticsCache = '_article_statistics_'

export const [useStatisticsStore, StatisticsStoreProvider] = createStore(() => {
    const { data, loading, runAsync } = useSWRRequest(getArticleStatistics, {
        cacheKey: articleStatisticsCache,
        staleTime: 120000
    })

    const refreshForce = useMemoizedFn(() => {
        if (loading) return
        clearCache(articleStatisticsCache)
        runAsync()
    })

    return {
        data,
        loading,
        refreshForce
    }
})