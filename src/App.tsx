import React, { lazy, Suspense } from 'react'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import './App.css'


const Loading = (<div>Loading...</div>)
const lazyLoad = (path: string, fallback: React.ReactNode) => {
    const Page = lazy(() => import(path))

    return (
        <Suspense fallback={fallback}>
            <Page />
        </Suspense>
    )
}


const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/articles',
        element: lazyLoad('./pages/Article', Loading)
    },
    {
        path: '*',
        element: <Navigate to='/' />
    }
])


function App() {


    return (
        <RouterProvider router={router} />
    )
}

export default App
