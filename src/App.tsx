import { useRef, useState, } from 'react'
import { createPortal } from 'react-dom'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { Modal} from 'antd'
import { useEventListener, useMount } from 'ahooks'
import classnames from 'classnames'

import HomePage from './pages/HomePage'
import FlyingFish from "@/components/FlyingFish";
import Login from '@/components/Login'
import { useUserStore } from '@/globalStore/user'
import { isMobile } from './utils/constants.ts'
import styles from './App.module.less'



const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/articles',
        async lazy() {
            const { Article } = await import('./pages/Article/index.tsx')
            return { element: <Article /> }
        },
        children: [
            {
                index: true,
                async lazy() {
                    const { ArticleList } = await import('./pages/Article/index.tsx')
                    return {element: <ArticleList />}
                }
            },
            {
                path: '/articles/tag/:tagName',
                async lazy() {
                    const { ArticleList } = await import('./pages/Article/index.tsx')
                    return {element: <ArticleList />}
                }
            }
        ]
    },
    {
        path: '/musics',
        async lazy() {
            const { Music } = await import('./pages/Music/index.tsx')
            return { element: <Music /> }
        },
    },
    {
        path: '/meaningless',
        async lazy() {
            const { MeaningLess } = await import('./pages/MeaningLess/index.tsx')
            return { element: <MeaningLess /> }
        },
    },
    {
        path: '*',
        element: <Navigate to='/' />
    }
])


function App() {
    const { isLogin } = useUserStore()

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
        <>
            <RouterProvider router={router} />
            <Modal open={loginModalVis} onCancel={() => setLoginModalVis(false)} footer={false} closable={false}>
                <Login callback={() => setLoginModalVis(false)} />
            </Modal>
            {createPortal(
                <FlyingFish className={classnames(styles.fish, { [styles['fish-hid']]: !loginModalVis })} />,
                document.body
            )}
        </>
    )
}

export default App
