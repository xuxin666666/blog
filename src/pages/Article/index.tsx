import React from "react";
import { Outlet } from "react-router-dom";
import { FloatButton } from "antd";

import Header from "@/components/Layout/Header";
import ArticleList from "./ArticleList";
import { ArticleDetail } from "./ArticleDetail";
import { useUserStore } from "@/globalStore/user";
// import styles from './less/index.module.less'
import 'md-editor-rt/lib/style.css';
import '@/styles/channing-cyan.less'




export const Article: React.FC = () => {
    const { isLogin } = useUserStore()

    return (
        <div>
            <Header items={[{ path: '/', text: 'hai' }]}>
                {isLogin && (<span>写文章</span>)}
            </Header>
            <div>
                <Outlet />
            </div>
            <FloatButton.BackTop />
        </div>
    )
}


export {
    ArticleList,
    ArticleDetail
}