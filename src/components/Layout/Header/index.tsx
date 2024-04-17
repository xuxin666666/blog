import React, { useState, useRef, useEffect } from "react";
import classnames from 'classnames'
import { useEventListener } from "ahooks";
import { Link, useLocation } from "react-router-dom";
import { Modal, Space, message } from "antd";
import { LogoutOutlined } from '@ant-design/icons'

import { HomeOutlined } from "@/components/Icons";
import { useUserStore } from "@/globalStore/user";
import OutLink from "@/components/OutLink";

import style from './index.module.less'
import { useHomePageListStore } from "@/globalStore/homePageList";



export interface IHeaderTitles {
    path: string
    text?: string
    icon?: React.ReactNode
    out?: boolean
}

const Header: React.FC<{
    items?: IHeaderTitles[],
    children?: React.ReactNode
    className?: string
}> = ({ items = [], children, className }) => {
    const { isLogin, logout } = useUserStore()
    const { list: homePageList } = useHomePageListStore()
    const location = useLocation()

    const [navShow, setNavShow] = useState(true)
    const header = useRef<HTMLHeadElement>(null)
    const touchDeltaY = useRef({ lastPos: 0, deltaY: 0 })

    useEventListener('wheel', event => {
        event = event || window.event;
        if (event.altKey || event.shiftKey || event.ctrlKey) return
        setNavShow(event.deltaY < 0);
    }, { target: document.body })

    useEventListener('touchstart', event => {
        touchDeltaY.current.lastPos = event.targetTouches[0].clientY
        touchDeltaY.current.deltaY = 0
    }, { target: document.body })

    useEventListener('touchmove', event => {
        if (event.targetTouches[0]) {
            const clientY = event.targetTouches[0].clientY
            let { lastPos, deltaY } = touchDeltaY.current
            if ((clientY > lastPos && deltaY < 0) || (clientY < lastPos && deltaY > 0)) deltaY = 0

            deltaY += clientY - lastPos
            lastPos = clientY
            if (Math.abs(deltaY) > 50) setNavShow(deltaY > 0)
            touchDeltaY.current.lastPos = lastPos
            touchDeltaY.current.deltaY = deltaY
            // console.log(touchDeltaY.current)
        }
    }, { target: document.body })

    useEffect(() => {
        if(!header.current) return

        let ans = '', primary = ''
        for(const item of homePageList) {
            if(location.pathname.startsWith(item.to) && item.to.length > ans.length) {
                ans = item.to
                if(item.primary) primary = item.primary
            }
        }
        header.current.style.backgroundColor = primary ? primary + 'df' : '#043978'
    }, [location.pathname, homePageList])

    const onLogout = () => {
        Modal.confirm({
            title: '确定退出登录？',
            okText: '确定',
            cancelText: '取消',
            maskClosable: true,
            onOk() {
                logout()
                message.success('已退出登录')
            }
        })
    }

    return (
        <header className={classnames(className, style.header, { [style['hidden-header']]: !navShow })} ref={header}>
            <nav>
                <Space direction='horizontal' size='middle'>
                    <Link to='/'>
                        <HomeOutlined className={classnames(style['header-item'])} />
                    </Link>
                </Space>
                <Space direction='horizontal' size='middle'>
                    {items.map(item => {
                        let Comp: React.FC<any>
                        if (item.out) Comp = OutLink
                        else Comp = Link

                        return (
                            <Comp href={item.path} className={style.tags} key={item.path}>
                                <Space>
                                    {item.icon}
                                    {item.text}
                                </Space>
                            </Comp>
                        )
                    })}
                </Space>
                <Space direction='horizontal' size='middle' className={classnames(style['header-right'])}>
                    {children}
                    {
                        isLogin && (
                            <LogoutOutlined className={classnames(style['header-item'])} onClick={onLogout} />
                        )
                    }
                </Space>
            </nav>
        </header>
    )
}

export default Header