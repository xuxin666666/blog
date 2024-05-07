import { createStore } from "hox";

import { useSWRRequest, clearCache } from "@/hooks/useSWRRequest";
import { ITag, createArticleTag, getArticleTags } from "@/api/article";


const articleTagCache = '_article_tag_'

export const [useTagStore, TagStoreProvider] = createStore(() => {
    const { data: d, mutate: mutateTags, runAsync, loading } = useSWRRequest(getArticleTags, {
        cacheKey: articleTagCache,
        staleTime: 120000
    })
    const data = d || []

    const addTag = async (newTag: ITag) => {
        await createArticleTag(newTag)
        mutateTags([{ ...newTag, pageNum: 0 }, ...data])
    }

    const hasTag = (tagName: string) => {
        return data.some(tag => tag.tagName === tagName)
    }

    const reduceTagCount = (...tagNames: string[]) => {
        // tagNames.forEach(name => tags)
        data.forEach(tag => {
            if (tagNames.includes(tag.tagName)) tag.pageNum--
        })
        mutateTags([...data])
    }

    const deleteTag = (tagName: string) => {
        // await deleteArticleTag()
        mutateTags(data.filter(tag => tag.tagName !== tagName))
    }

    const refreshForce = () => {
        if (loading) return
        clearCache(articleTagCache)
        runAsync()
    }

    return {
        data,
        addTag,
        hasTag,
        reduceTagCount,
        deleteTag,
        refreshForce
    }
})