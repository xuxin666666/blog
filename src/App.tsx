import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, FloatButton } from 'antd'
import { BrowserRouter, Link } from 'react-router-dom'
import bgImg from './assets/images/bgImg.jpg'

import { CounterProvider } from './pages/useCountModel'
import Welcome from '@/pages/index'
import Page2 from './pages/page2'
import testVideo from '@videos/testVideo.mp4'
import './App.css'
import './app.less'
import './app.scss'
import style from '@/app.module.less'
import 'antd/dist/reset.css'


function App() {
    const [count, setCount] = useState(0)

    // console.log(import.meta.env.VITE_SOME_KEY)

    return (
        <BrowserRouter>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
                <Link to='/a'>To a</Link>
            </div>
            <h1>Vite + <span>React</span></h1>
            <div className="card">
                <button className={style.btn} onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs postcss-test">
                Click on the Vite and React logos to learn more
            </p>
            <Welcome />
            <Button>btn</Button>
            <FloatButton.BackTop></FloatButton.BackTop>
            <img src={bgImg} alt="bgImg" width={400} />
            <button className={style.btn} onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <CounterProvider>
                <Button>{count}</Button>
                <Page2 />
            </CounterProvider>
            <video src={testVideo} width={400} controls></video>
        </BrowserRouter>
    )
}

export default App
