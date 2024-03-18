import React from "react"
import classNames from "classnames"
import { LinkToNewBlankOutlined } from "../Icons"

import style from './index.module.less'


const OutLink: React.FC<{
    children: React.ReactNode
    href: string
    useIcon?: boolean
    className?: string
}> = ({ children, href, className, useIcon = true }) => (
    <a href={href} target='_blank' className={classNames(style['out-link'], className)} rel='noreferrer'>
        <span>{children}</span>
        {useIcon && <LinkToNewBlankOutlined />}
    </a>
)

export default OutLink