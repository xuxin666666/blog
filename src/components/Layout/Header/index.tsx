import React, { useState } from "react";
import { createPortal } from "react-dom";
import classnames from 'classnames'
import { useEventListener } from "ahooks";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Modal, Space } from "antd";
import { HomeOutlined, BgColorsOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons'
import { ManageOutlined, NotificationOutlined } from "@/components/Icons";
import FlyingFish from "@/components/FlyingFish";
import Image from "@/components/Image";
import { UserRoleWeight } from "@/api/user";
import { useUserStore } from "@/globalStore/user";
import OutLink from "@/components/OutLink";
import Login from "./login";
import type { MenuProps } from 'antd';

import style from './index.module.less'



export interface IHeaderTitles {
    path: string
    text?: string
    icon?: React.ReactNode
    out?: boolean
}

const Header: React.FC<{
    items: IHeaderTitles[]
}> = ({ items }) => {
    const navigate = useNavigate()
    const { userInfo, isLogin, logout } = useUserStore()

    const [navShow, setNavShow] = useState(true)
    const [loginModalVis, setLoginModalVis] = useState(false)

    useEventListener(
        'wheel',
        event => {
            event = event || window.event;
            if (event.altKey || event.shiftKey || event.ctrlKey) return
            setNavShow(event.deltaY < 0);
        },
        { target: document.body }
    );

    const toPersonalCenter = () => {
        navigate('/user')
    }

    const userChangeTheme = () => {
        console.log('changeTheme')
    }

    const onLogin = () => {
        setLoginModalVis(true)
    }

    const avatar = (
        <Image className={classnames(style['user-avatar'])} src={userInfo.avatar} />
    )

    const preson = (
        <Space className={style.user} size={30}>
            {avatar}
            {userInfo.username}
        </Space>
    )

    const userMenus: MenuProps['items'] = [
        { key: 0, label: preson },
        { type: 'divider' },
        { key: 1, label: '个人中心', icon: <UserOutlined />, onClick: toPersonalCenter },
        { key: 2, label: '更改主题', icon: <BgColorsOutlined />, onClick: userChangeTheme },
        { key: 3, label: '退出登录', icon: <LogoutOutlined />, onClick: logout }
    ]

    return (
        <>
            <header className={classnames(style.header, { [style.hiddenHeader]: !navShow })}>
                <nav>
                    <Space direction='horizontal' size='middle'>
                        <Link to='/'>
                            <HomeOutlined className={style['header-item']} />
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
                    <Space direction='horizontal' size='middle'>
                        {
                            UserRoleWeight[userInfo.role] > UserRoleWeight.normal && (
                                <Link to='/admin'>
                                    <ManageOutlined className={classnames(style['header-item'], style['header-icons'])} />
                                </Link>
                            )
                        }
                        <NotificationOutlined className={classnames(style['header-icons'], style['header-item'])} />
                        {isLogin ? (
                            <Dropdown trigger={['click']} menu={{ items: userMenus }} placement='bottomRight'>
                                {avatar}
                            </Dropdown>
                        ) : (
                            <LoginOutlined className={classnames(style['header-icons'], style['header-item'])} onClick={onLogin} />
                        )}
                    </Space>
                </nav>
            </header>
            <Modal open={loginModalVis} onCancel={() => setLoginModalVis(false)} footer={false} closable={false}>
                <Login callback={() => setLoginModalVis(false)} />
            </Modal>
            {createPortal(
                <FlyingFish className={classnames(style.fish, { [style['fish-hid']]: !loginModalVis })} />,
                document.body
            )}
        </>
    )
}

export default Header