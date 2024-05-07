import React from 'react'
import { Image as Img } from 'antd'

import { imageUrl } from '@/utils/constants'


/**
 * 
 * @param param.prefix 是否添加图片的url前缀
 * @param param.preview 图片是否可点击预览
 * @returns 
 */
const Image: React.FC<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
    className?: string
    preview?: boolean
    prefix?: boolean
    raw?: boolean
    [key: string]: any
}> = ({ src, alt = 'img', width, height, className, preview = false, prefix = false, raw = false, ...other }) => {

    if (raw) return (
        <img
            src={prefix ? new URL(src, imageUrl).toString() : src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={e => {
                e.currentTarget.src = '/images/404.png'
            }}
            {...other}
        />
    )
    return (
        <Img
            src={prefix ? new URL(src, imageUrl).toString() : src}
            fallback='/images/404.png'
            preview={preview}
            alt={alt}
            width={width}
            height={height}
            rootClassName={className}
            {...other}
        />
    )
}

export default Image