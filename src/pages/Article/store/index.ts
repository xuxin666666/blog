import { createStore } from 'hox'
import { useRequest } from 'ahooks'

import { getArticleTags, createArticleTags, ITag } from '@/api/article'



export const [useArticleStore, ArticleStoreProvider] = createStore(() => {
    const { data, mutate: mutateTags } = useRequest(getArticleTags)
    const tags = data || []

    const addTags = async (newTags: ITag[]) => {
        await createArticleTags(newTags)
        mutateTags([...newTags.map(tag => ({...tag, pageNum: 0})), ...tags])
    }

    const hasTag = (tagName: string) => {
        return tags.some(tag => tag.tagName === tagName)
    }

    return {
        tags,
        addTags,
        hasTag
    }
})


export type {
    ITag
}