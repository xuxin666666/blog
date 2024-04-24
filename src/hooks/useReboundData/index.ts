import { useMount } from "ahooks";
import { useRef, useState } from "react";


export const useReboundData = <T>(initialVal: T, delay = 500) => {
    const ref = useRef(initialVal)
    const timer = useRef(-1)
    const val = useRef(initialVal)

    useMount(() => {
        Object.defineProperty(ref, 'current', {
            set(v) {
                if(v === ref.current) return

                clearTimeout(timer.current)
                timer.current = window.setTimeout(() => {
                    ref.current = initialVal
                }, delay)
                val.current = v
                return v
            },
            get() {
                return val.current
            },
        })
    })

    return ref
}

export const useReboundState = <T>(initialVal: T, delay = 500) => {
    const [state, setState] = useState(initialVal)
    const timer = useRef(-1)

    const set = (newVal: T) => {
        if(newVal === initialVal) return

        clearTimeout(timer.current)
        setState(newVal)
        timer.current = window.setTimeout(() => {
            setState(initialVal)
        }, delay)
    }

    return [state, set] as [T, typeof set]
}