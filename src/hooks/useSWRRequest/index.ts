import { useMemoizedFn } from "ahooks"
import { useEffect, useMemo, useState } from "react"


type StoreData = {
    [key: string]: {
        data: any
        timer?: number
    }
}

class Store {
    private data: StoreData

    constructor() {
        this.data = {}
    }

    get(prop: string, defaultVal?: any) {
        if (!this.data[prop]) return defaultVal
        return this.data[prop].data
    }
    set(prop: string, val: any, expiredIn?: number) {
        clearTimeout(this.data[prop]?.timer)

        this.data[prop] = { data: val }
        if(expiredIn) {
            if(expiredIn < 0) expiredIn = 0
            this.data[prop].timer = window.setTimeout(() => {
                Reflect.deleteProperty(this.data, prop)
            }, expiredIn)
        }
    }
    delete(prop: string) {
        Reflect.deleteProperty(this.data, prop)
    }
    has(prop: string) {
        if(!Object.prototype.hasOwnProperty.call(this.data, prop)) return false
        return true
    }
}

const store = new Store()


const transform = (data: any): any => {
    if(Array.isArray(data)) return data.map(d => transform(d))
    if(typeof data === 'object' && data !== null) {
        const keys = Reflect.ownKeys(data).sort(), newData: any = {}
        for(const key of keys) newData[key] = transform(data[key])
        return newData
    }
    return data
}


interface IOptions<T extends (...args: any) => any> {
    cacheKey: string
    staleTime?: number
    params?: Parameters<T>
    manual?: boolean
}

const recordCacheTime = '__internal_record_cache_time__'

/**
 * 根据cacheKey和params来缓存数据，初始param不必须，可后续调用函数时再传入param
 * @param params 传递给函数的参数，只能为基本类型、数组、简单对象的组合，manual为false时，每次param变化都会发送新的请求
 * @param staleTime 在这个时间内，返回缓存的数据
 * @param manual 手动操作，不再自动请求
 * @returns 
 */
export const useSWRRequest = <T extends (...args: any[]) => Promise<any>>(
    service: T, 
    {cacheKey, staleTime = 0, params, manual = false}: IOptions<T>
) => {   
    const paramsString = useMemo<string>(() => JSON.stringify(transform(params)), [params])

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<PromiseType<ReturnType<T>>>()

    const func = async (...params: Parameters<T>) => {
        let pstr = paramsString
        if(params.length) {
            pstr = JSON.stringify(transform(params))
        }
        if(store.has(cacheKey)) {
            const map: Store = store.get(cacheKey)
            if(map.has(pstr)) {
                setData(map.get(pstr))
                return map.get(pstr)
            }
        }
        return service(...(params || [])).then(data => {
            if(!store.has(cacheKey)) store.set(cacheKey, new Store())

            const map: Store = store.get(cacheKey)
            // 记录最晚过期时间
            map.set(recordCacheTime, Math.max(map.get(recordCacheTime, 0), staleTime + Date.now()))
            map.set(pstr, data, staleTime)
            store.set(cacheKey, map, map.get(recordCacheTime) - Date.now())

            setData(data)
            return data
        })
    }

    const runAsync = useMemoizedFn(async (...params: Parameters<T>): Promise<PromiseType<ReturnType<T>>> => {
        setLoading(true)
        return func(...params).then(res => {
            setLoading(false)
            return res
        }).catch(err => {
            setLoading(false)
            return Promise.reject(err)
        })
    })

    useEffect(() => {
        if(manual) return
        if(params) runAsync(...params)
        else runAsync(...[] as any)
    }, [params, manual, runAsync])

    return {
        data,
        loading,
        mutate: setData,
        runAsync
    }
}

export const clearCache = (...cacheKey: string[]) => {
    cacheKey.forEach(key => store.delete(key))
}