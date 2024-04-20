import { useEventListener, useMount } from "ahooks";
import { useRef } from "react";


interface Options {
    delay?: number
    runAtStart?: boolean
}

/**
 * 
 * @param callback 回调函数，runAtStart为true时没有参数
 * @param options.delay 延迟，默认200，单位ms
 * @param options.runAtStart 是否一开始就执行一次，默认false
 */
export const useScrollEndEventListener = (callback: (e?: Event) => void, options?: Options) => {
    const {delay = 200, runAtStart = false} = options || {}

    const timer = useRef<NodeJS.Timer>()

    useEventListener('scroll', e => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            callback(e)
        }, delay)
    })
    useMount(() => {
        if(runAtStart) callback()
    })
}