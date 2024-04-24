import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { MdPreview, HeadList, MdHeadingId } from 'md-editor-rt'
import { Tag, Drawer } from "antd";
import store from "store";
import { useMount, useUnmount, useRequest } from "ahooks";
import { EyeOutlined, ClockCircleOutlined, MenuFoldOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { UpdateTimeOutlined, WordCountOutlined } from "@/components/Icons";
import Catalog from "@/components/Catalog";
import { IGetArticleDetailReturn, setArticleLike } from "@/api/article";
import styles from './less/articleDetail.module.less'
import 'md-editor-rt/lib/preview.css';
import '@/styles/channing-cyan.less'




const id = 'preview-only'
const mdHeadingId: MdHeadingId = (txt, _level, idx) => `heading-${txt}-${idx}`


const ThumbUp: React.FC<{
    likes: number
    id: string
}> = ({ likes, id }) => {
    const [liked, setLiked] = useState(false)
    const { run } = useRequest(setArticleLike, { debounceWait: 3000, manual: true })

    const click = (e: React.MouseEvent) => {
        const res = !liked
        if (res) e.currentTarget.parentElement?.classList.add(styles.active)
        else e.currentTarget.parentElement?.classList.remove(styles.active)

        setLiked(res)
        run(id, res)
    }

    useMount(() => {
        setLiked(store.get(id, false))
    })

    useUnmount(() => {
        store.set(id, liked)
    })

    return (
        <div className={styles['like-container']}>
            <div className={styles.like}>
                <div onClick={click}></div>
            </div>
            <span>{likes + (liked ? 1 : 0)}</span>
        </div>
    )
}

export const ArticleDetail: React.FC = () => {
    const data = useLoaderData() as IGetArticleDetailReturn

    const [catalog, setCatalog] = useState<HeadList[]>([])
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>{data.title}</h1>
                    <div className={styles.tags}>
                        {data.tags.map(item => (<Tag key={item}>{item}</Tag>))}
                    </div>
                    <div className={styles.actions}>
                        <div>
                            <EyeOutlined />
                            {data.views}
                        </div>
                        <div>
                            <WordCountOutlined />
                            {data.words}字
                        </div>
                        <div>
                            <ClockCircleOutlined />
                            {dayjs(data.createTime).format('YYYY-MM-DD')}
                        </div>
                    </div>
                    {!!data.updateTime && (<div className={styles.actions}>
                        <div>
                            <UpdateTimeOutlined />
                            更新于 {dayjs(data.updateTime).format('YYYY-MM-DD')}
                        </div>
                    </div>)}
                    <MdPreview
                        modelValue={data.content}
                        previewTheme="channing-cyan"
                        codeStyleReverseList={['channing-cyan']}
                        showCodeRowNumber
                        editorId={id}
                        mdHeadingId={mdHeadingId}
                        onGetCatalog={(list) => setCatalog(list)}
                    />
                    <div className={styles['content-end']}>
                        <ThumbUp likes={data.likes} id={data.id} />
                    </div>
                </div>
                <div className={styles.slider}>
                    <div>
                        <div className={styles['menu-container']}>
                            <div className={styles.title}>目录</div>
                            <Catalog
                                catalog={catalog}
                                activeItemClassName={styles.active}
                                itemClassName={styles['menu-item']}
                                className={styles.menu}
                                checkPos={200}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['mobile-menu']} onClick={() => setOpen(true)}>
                    <MenuFoldOutlined className={styles.button} />
                </div>
            </div>
            <Drawer onClose={() => setOpen(false)} open={open} closable={false} width={250}>
                <div className={styles['menu-container']}>
                    <div className={styles.title}>目录</div>
                    <Catalog
                        catalog={catalog}
                        activeItemClassName={styles.active}
                        itemClassName={styles['menu-item']}
                        className={styles.menu}
                        checkPos={200}
                        onClick={() => setOpen(false)}
                    />
                </div>
            </Drawer>
        </>
    )
}