import React from 'react'
import Icon from '@ant-design/icons'


export interface IconOutlined {
    className?: string
    onClick?: React.MouseEventHandler
    [key: string]: any
}

const createIcon = (svg: JSX.Element): React.FC<IconOutlined> => {
    const ele = React.cloneElement(svg, {width: '1em', height: '1em', fill: 'currentColor'})
    return (props) => (
        <Icon
            component={() => ele}
            {...props}
        />
    )
}

export default createIcon