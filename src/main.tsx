// import React from 'react'
import 'antd/dist/reset.css'    // 先引入antd的样式，防止他后面覆盖自己的样式
import './styles/global.less'
import './utils/global'
import './utils/config'
import ReactDOM from 'react-dom/client'
import { HoxRoot } from 'hox'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './pages/HomePage'



const router = createBrowserRouter([{
    path: '/',
    element: (
        <HoxRoot>
            <App />
        </HoxRoot>
    ),
    children: [
        {
            index: true,
            element: <HomePage />
        },
        {
            path: '/article',
            async lazy() {
                const { Article } = await import('./pages/Article/index.tsx')
                return { element: <Article /> }
            },
            children: [
                {
                    index: true,
                    async lazy() {
                        const { ArticleList } = await import('./pages/Article/index.tsx')
                        return { element: <ArticleList /> }
                    }
                },
                {
                    path: '/article/tag/:tagName',
                    async lazy() {
                        const { ArticleList } = await import('./pages/Article/index.tsx')
                        return { element: <ArticleList /> }
                    }
                },
                {
                    path: '/article/:id',
                    async lazy() {
                        const [{ ArticleDetail }, { articleDetailLoader }] = await Promise.all([
                            import('./pages/Article/index.tsx'),
                            import('./pages/Article/loader.ts')
                        ])
                        return {
                            element: <ArticleDetail />,
                            loader: articleDetailLoader
                        }
                    }
                },
                {
                    path: '/article/write',
                    async lazy() {
                        const { default: ArticleWrite } = await import('./pages/Article/ArticleWrite.tsx')
                        return { element: <ArticleWrite /> }
                    }
                }
            ]
        },
        {
            path: '/music',
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
    ]
}])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <RouterProvider router={router} />
    // </React.StrictMode>,
)
