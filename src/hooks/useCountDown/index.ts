/**
 * 借鉴了ahooks中的useCountDown，添加了暂停功能
 * 
 * 思路还是不一样的，那个是根据剩余时间算出到期时间，然后不断计时，即使中间有些许偏差也能保证结果正确。
 * 这个是剩余时间不断减少，并记录时间戳以补偿误差
 * 
 * 都有误差，一个计时间隔内的误差
 */

import { useState, useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import store from "store";
import { useLatest, useMemoizedFn } from 'ahooks'
import type { ConfigType } from 'dayjs'

type TDate = ConfigType;


export interface Options {
    /**
     * 优先级更高，单位：毫秒（ms）
     */
    remainTime?: number;
    targetDate?: ConfigType;
    /**
     * @default 1000
     */
    interval?: number;
    onEnd?: () => void;
}

export interface LocalOptions extends Options {
    key: string
}

export interface FormattedRes {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}


const calcLeft = (target?: ConfigType) => {
    if (!target) {
        return 0;
    }
    const left = dayjs(target).valueOf() - Date.now();
    return left < 0 ? 0 : left;
};

const parseMs = (milliseconds: number): FormattedRes => {
    return {
        days: Math.floor(milliseconds / 86400000),
        hours: Math.floor(milliseconds / 3600000) % 24,
        minutes: Math.floor(milliseconds / 60000) % 60,
        seconds: Math.floor(milliseconds / 1000) % 60,
        milliseconds: Math.floor(milliseconds) % 1000,
    };
};

/**
 * 倒计时
 * 
 * 手动设置剩余时间为0时(`remainTime, targetDate`)，不会调用onEnd函数
 * @param options 
 * @returns `[remainTime, formattedRes, toggleStatus]`
 *          - `toggleStatus`： 暂停或继续，切换状态或传入参数手动控制
 * 
 * @default options.interval = 1000
 */
const useCountDown = (options: Options = {}): [number, FormattedRes, (pause?: boolean) => void] => {
    const { remainTime: leftTime, targetDate, interval = 1000, onEnd } = options;

    const memoLeftTime = useMemo<TDate>(() => {
        return (typeof leftTime === 'number' && leftTime > 0) ? Date.now() + leftTime : undefined;
    }, [leftTime]);

    const target = 'remainTime' in options ? memoLeftTime : targetDate
    const targetRef = useRef(target)
    const [remainTime, setRemainTime] = useState(() => calcLeft(target));
    const [stop, setStop] = useState(false)

    const onEndRef = useLatest(onEnd)
    const snapshot = useRef(0)  // 记录剩余时间,用来清除副作用时准确的设置剩余时间

    useEffect(() => {
        targetRef.current = target
    }, [target])

    useEffect(() => {
        if (stop) return
        if (!targetRef.current) {
            setRemainTime(0)
            return
        }

        setRemainTime(calcLeft(targetRef.current))
        const timer = setInterval(() => {
            const targetLeft = calcLeft(targetRef.current);
            setRemainTime(targetLeft);
            if (targetLeft === 0) {
                clearInterval(timer);
                onEndRef.current?.();
            }
        }, interval)

        return () => {
            clearInterval(timer)
        }
    }, [stop, interval, onEndRef])

    const toggleStatus = useMemoizedFn((pause?: boolean) => {
        if ((stop && pause) || (!stop && pause === false)) return
        // pause为接下来的状态，stop为当前状态
        const paused = typeof pause === 'boolean' ? pause : !stop

        if (paused) {
            const calced = calcLeft(targetRef.current)
            snapshot.current = calced
            setStop(true)
        } else {
            setStop(false)
            targetRef.current = snapshot.current + Date.now()
        }
    })

    const formattedRes = useMemo(() => parseMs(remainTime), [remainTime]);

    return [remainTime, formattedRes, toggleStatus]
}

/**
 * 将剩余时间储存在localStorage，防止页面刷新后重新计时，不会根据props中途改变计时
 * @param options 
 * @returns 
 */
const useCountDownLocal = (options: LocalOptions): [number, FormattedRes, (pause?: boolean) => void] => {
    const { key, remainTime, targetDate, ...opts } = options

    const calcRT = useMemo(() => {
        if(store.get(key)) return store.get(key) - Date.now()
        if(typeof remainTime === 'number' && remainTime > 0) return remainTime
        return calcLeft(targetDate)
    }, [remainTime, targetDate, key])

    const targetRef = useRef(calcRT + Date.now())

    useEffect(() => {
        const deadline = store.get(key) || targetRef.current

        const befUnload = (e: BeforeUnloadEvent) => {
            // @ts-ignore
            store.set(key, deadline, deadline)
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', befUnload)
        return () => {
            // @ts-ignore
            store.set(key, deadline, deadline)
            window.removeEventListener('beforeunload', befUnload)
        }
    }, [key])

    return useCountDown({ remainTime: calcRT, ...opts })
}

export {
    useCountDown,
    useCountDownLocal
}