import { createStore } from "hox";
import { useState, useRef } from "react";
import { useDebounceFn } from "ahooks";
import store from "store";

import { setArticleLike } from "@/api/article";



const thumbUpKey = '__thumbUpKey_article'

export const [useThumpupStore, ThumpupStoreProvider] = createStore(() => {
    const [thumpUp, setThumpUp] = useState(() => new Set(store.get(thumbUpKey, [])))
    const thumpChanged = useRef(new Map())

    const { run: storeThumpupData } = useDebounceFn(() => {
        // 存储到本地
        store.set(thumbUpKey, [...thumpUp])
        // 发送请求
        thumpChanged.current.forEach((val, id) => {
            if (val === -1) setArticleLike(id, false)
            else setArticleLike(id, true)
        })
        thumpChanged.current.clear()
    }, { wait: 5000 })

    const Thumpup = (id: string) => {
        setThumpUp(prev => {
            prev.add(id)
            return new Set(prev)
        })
        if (thumpChanged.current.get(id) === -1) thumpChanged.current.delete(id)
        else thumpChanged.current.set(id, 1)
        storeThumpupData()
    }

    const cancleThump = (id: string) => {
        setThumpUp(prev => {
            prev.delete(id)
            return new Set(prev)
        })
        if (thumpChanged.current.get(id) === 1) thumpChanged.current.delete(id)
        else thumpChanged.current.set(id, -1)
        storeThumpupData()
    }

    const toggleThumpup = (id: string) => {
        if (thumpUp.has(id)) cancleThump(id)
        else Thumpup(id)
    }

    const isThumpuped = (id: string) => thumpUp.has(id)

    return {
        isThumpuped,
        cancleThump,
        setThumpup: Thumpup,
        toggleThumpup
    }
})