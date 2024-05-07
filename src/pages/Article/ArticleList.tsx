import React, { memo, useEffect, useRef } from "react"
import { useMemoizedFn, useUpdateEffect } from "ahooks"
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams, useNavigate, Link } from "react-router-dom"
import { Tag, Divider } from "antd"
import { EyeOutlined, LikeOutlined, ClockCircleOutlined, LineChartOutlined, TagOutlined } from "@ant-design/icons"
import classnames from 'classnames'
import dayjs from "dayjs"

import SearchBox from "@/components/SearchBox"
import { useStatisticsStore, useArticleStore, useTagStore } from "./store"
import styles from './less/articleList.module.less'





const TagsCard: React.FC<{
    className?: string
}> = memo(({ className }) => {
    const navigate = useNavigate()

    const { data } = useTagStore()

    const tagClick = (tagName: string) => {
        if (window.location.pathname.includes('/article/tag')) navigate(`/article/tag/${tagName}`, { replace: true })
        else navigate(`/article/tag/${tagName}`)
    }

    if (!data.length) return null
    return (
        <div className={className}>
            <div className={styles.title}>
                <TagOutlined className={styles.tag} />
                标签({data.length})
            </div>
            <div className={styles.content}>
                {data.map(tag => (
                    <Tag key={tag.tagName} onClick={() => tagClick(tag.tagName)}>
                        {tag.tagName} {tag.pageNum}
                    </Tag>
                ))}
            </div>
        </div>
    )
})


const StatisticsCard: React.FC<{
    className?: string
}> = memo(({ className }) => {
    const { data, loading } = useStatisticsStore()

    if (loading || !data) return null
    return (
        <div className={className}>
            <div className={styles.title}>
                <LineChartOutlined className={styles.tag} />
                文章统计数据
            </div>
            <div className={styles.content}>
                <div>
                    <span>总篇数：</span>
                    <span>{data.pages}</span>
                </div>
                <div>
                    <span>总字数：</span>
                    <span>{data.words}</span>
                </div>
                <div>
                    <span>总访问量：</span>
                    <span>{data.views}</span>
                </div>
                <div>
                    <span>总点赞数：</span>
                    <span>{data.likes}</span>
                </div>
            </div>
        </div>
    )
})


const ArticleList: React.FC = () => {
    const { tagName } = useParams()

    const contentContainer = useRef<HTMLDivElement>(null)
    const { data, getNewData, appendData } = useArticleStore()

    const getNewDataWithTag = useMemoizedFn((...args: Parameters<typeof getNewData>) => {
        if (tagName) {
            return getNewData({ tags: [tagName], ...args })
        } else {
            return getNewData(...args)
        }
    })

    useEffect(() => {
        getNewDataWithTag()
    }, [tagName, getNewDataWithTag])

    useUpdateEffect(() => {
        if (!contentContainer.current) return
        window.scrollTo({ top: contentContainer.current.offsetTop - 100, behavior: 'smooth' })
    }, [tagName])

    const search = (val: string) => {
        getNewDataWithTag({ q: val })
    }

    return (
        <>
            <div className={styles['search-container']}>
                <SearchBox className={styles.input} onSearch={search} />
            </div>

            <div className={styles['content-container']} ref={contentContainer}>
                {/* 'rc-virtual-list方案，滚动不平滑 */}
                {/* <VirtualList 
                    data={data.list} 
                    itemKey='id' 
                    onScroll={listScroll} 
                    itemHeight={140} 
                    className={classnames(styles['virtual-list'])} 
                    height={clientHeight} 
                    styles={{verticalScrollBarThumb: {backgroundColor: 'rgba(0, 0, 0, .35)'}}}
                >
                    {(item: InferArray<IGetArticleListReturn['list']>) => (
                        <div key={item.id} className={classnames(styles.item)}>
                            <div className={classnames(styles['item-content'])}>
                                <div className={classnames(styles.content)}>
                                    <div className={classnames(styles.title)}>{item.title}</div>
                                    <ClipText className={classnames(styles.text)} line={3}>
                                        {item.content}
                                    </ClipText>
                                </div>
                                <img src={item.image} alt={item.image} className={classnames(styles.img)} />
                            </div>
                            <div className={classnames(styles.actions)}>
                                <div className={classnames(styles.left)}></div>
                                <div className={classnames(styles.right)}>
                                    {item.tags.map(tag => (
                                        <Tag key={tag}>{tag}</Tag>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </VirtualList> */}

                {/* ahooks useVirtualList方案，滚动闪烁回退问题 */}
                {/* <div ref={containerRef} className={classnames(styles['virtual-list'])} onScroll={listScroll} style={{ height: clientHeight + 'px' }}>
                <div ref={wrapperRef}>
                    {list.map(({ data: item }) => (
                        <div key={item.id} className={classnames(styles.item)} style={{ height: '144px' }}>
                            <div className={classnames(styles['item-content'])}>
                                <div className={classnames(styles.content)}>
                                    <div className={classnames(styles.title)}>{item.title}</div>
                                    <ClipText className={classnames(styles.text)} line={3}>
                                        {item.content}
                                    </ClipText>
                                </div>
                                <img src={item.image} alt={item.image} className={classnames(styles.img)} />
                            </div>
                            <div className={classnames(styles.actions)}>
                                <div className={classnames(styles.left)}></div>
                                <div className={classnames(styles.right)}>
                                    {item.tags.map(tag => (
                                        <Tag key={tag}>{tag}</Tag>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}

                {/* 不采用虚拟列表 */}
                <InfiniteScroll
                    next={appendData}
                    dataLength={data.list.length}
                    hasMore={data.list.length < data.total}
                    loader={<div>loading...</div>}
                    endMessage={<Divider plain>在哪里跌倒，就在哪里躺下</Divider>}
                    scrollableTarget='articleScrollList'
                    className={classnames(styles['virtual-list'])}
                >
                    {data.list.map(item => (
                        <Link key={item.id} className={classnames(styles.item)} to={`/article/${item.id}`}>
                            <div className={classnames(styles['item-content'])}>
                                <div className={classnames(styles.content)}>
                                    <div className={classnames(styles.title)}>{item.title}</div>
                                    <div className={styles.tags}>
                                        {item.tags.map(tag => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                    </div>
                                    {/* <ClipText className={classnames(styles.text)} line={3}>
                                        {item.content}
                                    </ClipText> */}
                                    <div className={classnames(styles.text)}>{item.content}</div>

                                </div>
                                {item.image && (
                                    <img src={item.image} alt={item.image} className={classnames(styles.img)} />
                                )}
                            </div>
                            <div className={classnames(styles.actions)}>
                                <div>
                                    <EyeOutlined />
                                    {item.views}
                                </div>
                                <div>
                                    <LikeOutlined />
                                    {item.likes}
                                </div>
                                <div>
                                    <ClockCircleOutlined />
                                    {dayjs(item.updateTime || item.createTime).format('YYYY-MM-DD')}
                                </div>
                            </div>
                        </Link>
                    ))}
                </InfiniteScroll>

                <div className={styles.slider}>
                    <StatisticsCard className={classnames(styles.card, styles.statistics)} />
                    <TagsCard className={classnames(styles.card, styles['all-tags'])} />
                </div>
            </div>
        </>
    )
}

export default ArticleList