import React, { useMemo, memo, useState, Fragment, useRef, useEffect } from "react";
import { useMemoizedFn } from "ahooks";
import type { HeadList as HL, MdHeadingId } from "md-editor-rt";
import classnames from 'classnames'

import { useScrollEndEventListener } from "@/hooks";
import styles from './index.module.less'



type HeadList = Omit<HL, 'active'>
interface ITocItem extends HeadList {
    children: ITocItem[]
    index: number
    id: string
}


const defaultMdHeadingId: MdHeadingId = (txt, _level, idx) => `heading-${txt}-${idx}`
const getIdFromHash = (hash: string) => decodeURIComponent(hash).slice(1)


const MenuItem: React.FC<{
    itemClassName?: string
    activeClassName?: string
    items: ITocItem[]
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    active: string
}> = memo(({ items, onClick, itemClassName, activeClassName = '', active }) => {
    const eles = useRef<HTMLAnchorElement[]>([])

    useEffect(() => {
        eles.current.forEach((el) => {
            if (el.getAttribute('data-id') === active) {
                // 滚动过程中会中断
                // 暂未查明原因，可能是滑动过程中碰上了原生事件监听导致中断
                // el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

                // 递归搜索来滚动
                let scrollTop = 0, element: HTMLElement | null = el
                while (element) {
                    if (element.scrollHeight > element.offsetHeight) break
                    // position为static的话，offsetTop指的是同一个元素，无需重复加
                    if(element.style.position !== 'static') scrollTop += element.offsetTop
                    element = element.parentElement
                }
                element?.scrollTo({ top: scrollTop - element.offsetHeight / 2, behavior: 'smooth' })
            }
        })
    }, [active])

    return (<div className={itemClassName}>
        {items.map(({ index, text, id, children }, idx) => {
            return (
                <Fragment key={index}>
                    <a
                        href={'#' + id}
                        className={classnames({ [activeClassName]: active === id })}
                        onClick={onClick}
                        ref={(node) => node && (eles.current[idx] = node)}
                        data-id={id}
                    >{text}</a>
                    {!!children.length && (
                        <MenuItem items={children} onClick={onClick} itemClassName={itemClassName} activeClassName={activeClassName} active={active} />
                    )}
                </Fragment>
            )
        })}
    </div>)
})

/**
 * 
 * @param checkPos 检测元素出现的位置，在视口中 checkPos(px) 位置时会触发检测，默认值100
 * @param mdHeadingId 生成id，对应目录要滚动至的元素的id，默认 (txt, _level, idx) => `heading-${txt}-${idx}`
 * @returns 
 */
const Catalog: React.FC<{
    className?: string
    itemClassName?: string
    activeItemClassName?: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    catalog: HeadList[]
    mdHeadingId?: MdHeadingId
    checkPos?: number
}> = ({ className, itemClassName, onClick, catalog, activeItemClassName, mdHeadingId = defaultMdHeadingId, checkPos = 100 }) => {
    const locatedEles = useMemo(() => {
        const elements: HTMLElement[] = []
        catalog.forEach(({ text, level }, index) => {
            const ele = document.getElementById(mdHeadingId(text, level, index + 1))
            if (ele) elements.push(ele)
        })
        return elements
    }, [catalog, mdHeadingId])

    const menu = useMemo(() => {
        const ans: ITocItem[] = [], stack: ITocItem[] = []
        catalog.forEach(({ text, level }, index) => {
            while (stack.length && stack[stack.length - 1].level >= level) stack.pop()

            index++
            const item = { text, level, index, children: [], id: mdHeadingId(text, level, index) }

            if (!stack.length) {
                ans.push(item)
                stack.push(item)
            } else {
                stack[stack.length - 1].children.push(item)
                stack.push(item)
            }
        })
        return ans
    }, [catalog, mdHeadingId])

    const [activeItem, setActiveItem] = useState(() => getIdFromHash(window.location.hash))

    useScrollEndEventListener(() => {
        if (!locatedEles.length) return

        let el: HTMLElement | undefined
        for (const ele of locatedEles) {
            const { top } = ele.getBoundingClientRect()
            if (top <= checkPos + 5) {
                el = ele
            } else break
        }
        if (!el) el = locatedEles[0]
        setActiveItem(el.id)
    }, {delay: 100})

    const onItemClick = useMemoizedFn((e: React.MouseEvent<HTMLAnchorElement>) => {
        const id = getIdFromHash(new URL(e.currentTarget.href).hash)
        if (id === activeItem) {
            // active没变时，阻止默认事件，防止组件又diff一遍，虽然几乎没什么变化，但是diff的过程完全没必要
            e.preventDefault()
        } else {
            setActiveItem(id)
        }

        onClick?.(e)
    })

    if (!catalog.length) return null
    return (
        <div className={classnames(className, styles.container)} >
            <MenuItem
                items={menu}
                onClick={onItemClick}
                itemClassName={itemClassName}
                activeClassName={activeItemClassName}
                active={activeItem}
            />
        </div>
    )
}

export default Catalog