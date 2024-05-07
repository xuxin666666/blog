import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FloatButton } from "antd";

import Header from "@/components/Layout/Header";
import ArticleList from "./ArticleList";
import { ArticleDetail } from "./ArticleDetail";
import { useUserStore } from "@/globalStore/user";
import { ArticleStoreProvider, StatisticsStoreProvider, TagStoreProvider, ThumpupStoreProvider } from "./store";
// import styles from './less/index.module.less'



export const Article: React.FC = () => {
    const { isLogin } = useUserStore()

    return (
        <StatisticsStoreProvider>
            <TagStoreProvider>
                <ThumpupStoreProvider>
                    <ArticleStoreProvider>
                        <Header items={[{ path: '/', text: 'hai' }]}>
                            {isLogin && (<>
                                <Link to='/article'>文章首页</Link>
                                <Link to='/article/write'>写文章</Link>
                            </>)}
                        </Header>
                        <div>
                            <Outlet />
                        </div>
                        <FloatButton.BackTop />
                    </ArticleStoreProvider>
                </ThumpupStoreProvider>
            </TagStoreProvider>
        </StatisticsStoreProvider>
    )
}


export {
    ArticleList,
    ArticleDetail
}