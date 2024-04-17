import React, { useEffect, useRef } from "react";
import classnames from 'classnames'
import { useEventListener, useDebounceFn } from "ahooks";

import styles from './index.module.less'



// children为ReactNode的话，一直都会变，难以监听内容是否真的改变，因此改为string
const ClipText: React.FC<{
    children: string
    className?: string,
    line?: number
}> = ({ children, className, line = 1 }) => {
    const ele = useRef<HTMLDivElement>(null)

    // 保留html标签，但因为children为ReactNode的话，一直都会变，因此暂时放弃了，此外，也没做内容过滤
    // const clip = useCallback(() => {
    //     const container = ele.current
    //     if(!container) return
    //     // 正则表达式匹配html标签
    //     const htmlTagReg = /(<[^>]+?>)/;
    //     // 获取行高和字体大小，用于设置container的高度
    //     const lineHeight = window.getComputedStyle(container).getPropertyValue('line-height'),
    //         fontSize = window.getComputedStyle(container).getPropertyValue('font-size').slice(0, -2)

    //     // 去掉container.innerHTML多余的空格，并按照html标签分割，tags存储暂未闭合的标签
    //     const text = container.innerHTML.replace(/ +/g, ' ').split(htmlTagReg), tags: string[] = []
    //     // 暂存最终的innerHTML
    //     let innerHTML: string[] = []

    //     container.innerHTML = ''
    //     // normal的话lineHeight约为1.2
    //     if(lineHeight === 'normal') container.style.height = line * parseInt(fontSize) * 1.2 + 'px'
    //     else container.style.height = line * parseInt(lineHeight.slice(0, -2)) + 'px'

    //     for(let t of text) {
    //         if(htmlTagReg.test(t)) {
    //             innerHTML.push(t)
    //             if(t[1] !== '/') {
    //                 // 不是结束标签
    //                 tags.push(t)
    //             } else {
    //                 tags.pop()
    //             }
    //             continue
    //         } 
    //         container.innerHTML = innerHTML.join('') + t

    //         if(container.clientHeight >= container.scrollHeight) {
    //             // 没超出范围
    //             innerHTML.push(t)
    //         } else {
    //             // 超了，二分查找极限值
    //             let l = 0, r = t.length - 1
    //             while(l < r) {
    //                 let middle = Math.ceil((l + r) / 2)
    //                 container.innerHTML = innerHTML.join('') + t.slice(0, middle)
    //                 if(container.clientHeight >= container.scrollHeight) {
    //                     l = middle
    //                 } else r = middle - 1
    //             }
    //             if(l > 1) {
    //                 innerHTML.push(t.slice(0, l - 2), '...')
    //             } else {
    //                 // t长度不够，从上个文本开始删除
    //                 let cutNum = 2
    //                 for(let i = innerHTML.length - 1; i >= 0; i--) {
    //                     if(!innerHTML[i] || htmlTagReg.test(innerHTML[i])) continue
    //                     cutNum -= innerHTML[i].length
    //                     innerHTML[i] = innerHTML[i].slice(0, -cutNum)
    //                     if(cutNum <= 0) break
    //                 }
    //                 innerHTML.push('...')
    //             }
    //             break
    //         }
    //     }
    //     // 添加剩余标签使之闭合
    //     while(tags.length) innerHTML.push(`</${/(?<=<).+?(?= |>)/.exec(tags.pop()!)![0]}>`)
    //     container.innerHTML = innerHTML.join('')
    // }, [line])

    const clip = () => {
        const container = ele.current
        if (!container) return

        // 获取行高和字体大小，用于设置container的高度
        const lineHeight = window.getComputedStyle(container).getPropertyValue('line-height'),
            fontSize = window.getComputedStyle(container).getPropertyValue('font-size').slice(0, -2)

        // 去掉children多余的空格，去掉html标签
        const text = children.replace(/<[^>]+?>/g, '').replace(/ +/g, ' ')
        // 暂存最终的innerHTML
        let innerHTML = ''

        container.innerHTML = ''
        // normal的话lineHeight约为1.2
        if (lineHeight === 'normal') container.style.height = line * parseInt(fontSize) * 1.2 + 'px'
        else container.style.height = line * parseInt(lineHeight.slice(0, -2)) + 'px'

        container.innerHTML = innerHTML + text
        if (container.clientHeight >= container.scrollHeight) {
            // 没超出范围
            innerHTML += text
        } else {
            // 超了，二分查找极限值
            let l = 0, r = text.length - 1
            while (l < r) {
                const middle = Math.ceil((l + r) / 2)
                container.innerHTML = innerHTML + text.slice(0, middle)
                if (container.clientHeight >= container.scrollHeight) {
                    l = middle
                } else r = middle - 1
            }
            innerHTML += text.slice(0, l - 2) + '...'
        }
        container.innerHTML = innerHTML
    }

    const {run: dClip} = useDebounceFn(clip, { wait: 300 })

    useEffect(() => {
        dClip()
    }, [dClip])

    useEventListener('resize', () => {
        dClip()
    })

    return (
        <div className={classnames(styles.line, className)} ref={ele}>
            {children}
        </div>
    )
}

export default ClipText