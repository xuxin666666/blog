
export const debounce = (fn: (...args: any[]) => void, wait: number) => {
    let timer: NodeJS.Timer
    console.log(Date.now())
    const f = (...args: any[]) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
            console.log(Date.now())
        }, wait)
    }
    return f
}




