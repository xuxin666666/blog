import { useEffect, useState } from 'react'
import { Button, ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import classNames from 'classnames'
import { MDEditor, MDViewer } from './components/markdown'

import useTheme from './hooks/useTheme'
import Welcome from '@/pages/index'
import Counter from './pages/Counter'
import { CounterProvider } from './pages/useCounterStore'
import { copyToBoardEvent } from './utils/copyToBoard'
import Header from './components/Layout/Header'
import { headerTitles } from './utils/constants'
import style from './app.module.less'
import './App.css'



function App() {
    const [value, setValue] = useState('')
    const [theme, changeTheme] = useTheme()

    // console.log(import.meta.env.VITE_SOME_KEY)
    useEffect(() => {
        const ret = copyToBoardEvent()

        return () => ret()
    })

    return (
        <BrowserRouter>
            <ConfigProvider theme={theme.antd}>
                <Header items={headerTitles} />
                <div className={classNames(style.body)}>
                    <MDEditor style={{ height: 400 }} value={value} onChange={val => setValue(val)} />
                    <MDViewer style={{ height: 400 }} value={value} />
                    <Welcome />
                    <CounterProvider>
                        <Counter />
                    </CounterProvider>
                    <span>123123嗨</span>
                    <Button onClick={() => changeTheme('cyan')}>cyan</Button>
                    <Button onClick={() => changeTheme('purple')}>purple</Button>
                </div>

            </ConfigProvider>
        </BrowserRouter>
    )
}

export default App
