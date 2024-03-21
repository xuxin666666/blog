import React, { useState, useRef, useEffect } from "react";
import { useUpdateEffect, useDebounce } from "ahooks";

import './index.less'


interface ISliderProps {
    defaultValue?: number
    onChange?: (value: number) => void
}

const Slider: React.FC<ISliderProps> = ({ defaultValue = 0, onChange }) => {
    const [value, setValue] = useState(defaultValue)
    const changeProps = useDebounce(value, {wait: 200})

    const slider = useRef<HTMLDivElement>(null)
    const dot = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let trigger = false

        const dotNode = dot.current
        const mousedown = () => trigger = true
        const mouseup = () => trigger = false
        const mousemove = (e: MouseEvent | TouchEvent) => {
            if (!trigger) return
            const { left, width } = slider.current?.getBoundingClientRect() || { left: 0, width: 0 }
            let mouseX
            if(e instanceof TouchEvent) {
                mouseX = e.touches[0].clientX
            } else {
                mouseX = e.clientX
            }
            if (mouseX < left || mouseX > left + width) return
            setValue(Math.round((mouseX - left) / width * 100))
        }
        dotNode?.addEventListener('mousedown', mousedown)
        window.addEventListener('mousemove', mousemove)
        window.addEventListener('mouseup', mouseup)
        dotNode?.addEventListener('touchstart', mousedown)
        window.addEventListener('touchmove', mousemove)
        window.addEventListener('touchend', mouseup)
        return () => {
            dotNode?.removeEventListener('mousedown', mousedown)
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('mouseup', mouseup)
            dotNode?.addEventListener('touchstart', mousedown)
            window.addEventListener('touchmove', mousemove)
            window.addEventListener('touchend', mouseup)
        }
    }, [])

    useUpdateEffect(() => {
        onChange?.(changeProps)
    }, [changeProps, onChange])

    return (
        <div className='c-slider' ref={slider}>
            <div className='c-track' style={{ width: value + '%' }}></div>
            <div className='c-dot' ref={dot} style={{ left: value + '%' }}></div>
        </div>
    )
}

export default Slider