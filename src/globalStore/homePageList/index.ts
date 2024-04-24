import { useState, useEffect } from 'react'
import { createGlobalStore } from 'hox'
import { homePageList } from '@/utils/constants'
import { getPrimaryColor } from '@/utils/ImageColor'



export const [useHomePageListStore, getHomePageListStore] = createGlobalStore(() => {
    const [list, setList] = useState(homePageList)

    useEffect(() => {
        const datas = [...homePageList]
        const promises = datas.map(({ image }) => getPrimaryColor(image))
        Promise.all(promises).then((reses) => {
            reses.forEach((res, i) => {
                datas[i].primary = res
            })
            setList(datas)
        })
    }, [])


    return {
        list
    }
})