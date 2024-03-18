// import React from 'react'
import 'antd/dist/reset.css'    // 先引入antd的样式，防止他后面覆盖自己的样式
import './styles/global.less'
import './utils/global'
import './utils/config'
import ReactDOM from 'react-dom/client'
import { HoxRoot } from 'hox'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <HoxRoot>
        <App />
    </HoxRoot>
    // </React.StrictMode>,
)
