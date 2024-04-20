import { useMount } from "ahooks";
import { useRef } from "react";


export const useReboundData = <T>(initialVal: T, delay = 200) => {
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