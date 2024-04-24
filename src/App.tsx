import { useRef, useState, } from 'react'
import { createPortal } from 'react-dom'
import { Outlet } from 'react-router-dom'
import { ConfigProvider, Modal, App as AntdApp } from 'antd'
import { useEventListener, useMount } from 'ahooks'
import classnames from 'classnames'
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';


import FlyingFish from "@/components/FlyingFish";
import Login from '@/components/Login'
import { useUserStore } from '@/globalStore/user'
import { useThemeStore } from '@/globalStore/useTheme'
import { isMobile } from './utils/constants.ts'
import styles from './App.module.less'




function App() {
    const { isLogin } = useUserStore()
    const { theme } = useThemeStore()

    const [loginModalVis, setLoginModalVis] = useState(false)

    const clickCount = useRef(0)

    const addClickCount = () => {
        if (isLogin) return

        clickCount.current++
        if (clickCount.current === 5) setLoginModalVis(true)
        setTimeout(() => clickCount.current = 0, 1000)
    }

    useEventListener('click', addClickCount)

    useMount(() => {
        if (isMobile) {
            document.body.classList.add('mobile')
        }
    })

    return (
        <ConfigProvider theme={theme} locale={zhCN}>
            <AntdApp>
                <Outlet />
            </AntdApp>
            <Modal open={loginModalVis} onCancel={() => setLoginModalVis(false)} footer={false} closable={false}>
                <Login callback={() => setLoginModalVis(false)} />
            </Modal>
            {createPortal(
                <FlyingFish className={classnames(styles.fish, { [styles['fish-hid']]: !loginModalVis })} />,
                document.body
            )}
        </ConfigProvider>
    )
}

export default App
