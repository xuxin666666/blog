import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { MdPreview, HeadList, MdHeadingId } from 'md-editor-rt'
import { Tag, Drawer, Space, App } from "antd";
import { EyeOutlined, ClockCircleOutlined, MenuFoldOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import classnames from 'classnames'

import { UpdateTimeOutlined, WordCountOutlined } from "@/components/Icons";
import Catalog from "@/components/Catalog";
import { IGetArticleDetailReturn } from "@/api/article";
import { useUserStore } from "@/globalStore/user";
import { useArticleStore, useThumpupStore } from "./store";
import styles from './less/articleDetail.module.less'
import 'md-editor-rt/lib/preview.css';
import '@/styles/channing-cyan.less'






const id = 'preview-only'
const mdHeadingId: MdHeadingId = (txt, _level, idx) => `heading-${txt}-${idx}`


const ThumbUp: React.FC<{
    likes: number
    id: string
}> = ({ likes, id }) => {
    const { isThumpuped, toggleThumpup } = useThumpupStore()
    const [liked, setLiked] = useState(() => isThumpuped(id))

    const click = () => {
        toggleThumpup(id)
        setLiked(!liked)
    }

    return (
        <div className={styles['like-container']}>
            <div className={classnames(styles.like, { [styles.active]: liked })}>
                <div onClick={click}></div>
            </div>
            <span>{likes + (liked ? 1 : 0)}</span>
        </div>
    )
}

export const ArticleDetail: React.FC = () => {
    const data = useLoaderData() as IGetArticleDetailReturn
    const { modal, message } = App.useApp()
    const navigate = useNavigate()

    const { isLogin } = useUserStore()
    const { deleteArticle } = useArticleStore(data => [data.deleteArticle])

    const [catalog, setCatalog] = useState<HeadList[]>([])
    const [open, setOpen] = useState(false)

    const onDelete = () => {
        modal.confirm({
            title: '确定删除该文章？',
            onOk: async () => {
                await deleteArticle(data.id)
                message.success('成功删除，可在管理页找回')
                navigate('/article', { replace: true })
            }
        })
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.head}>
                        <h1>{data.title}</h1>
                        {isLogin && (<Space size='large'>
                            <Link to={`/article/write/${data.id}`}>
                                <EditOutlined className={styles.edit} />
                            </Link>
                            <DeleteOutlined className={styles.delete} onClick={onDelete} />
                        </Space>)}
                    </div>
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
                    {
                        !!data.updateTime
                        && (Math.abs(data.updateTime - data.createTime)) > 5000
                        && (<div className={styles.actions}>
                            <div>
                                <UpdateTimeOutlined />
                                更新于 {dayjs(data.updateTime).format('YYYY-MM-DD')}
                            </div>
                        </div>)
                    }
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
                        {!!catalog.length && (
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
                        )}
                    </div>
                </div>
                {!!catalog.length && (
                    <div className={styles['mobile-menu']} onClick={() => setOpen(true)}>
                        <MenuFoldOutlined className={styles.button} />
                    </div>
                )}
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