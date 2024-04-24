import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDebounceFn } from "ahooks";
import { MdEditor, ExposeParam, ToolbarNames, UploadImgEvent, SaveEvent } from "md-editor-rt";
import { Modal, App, List, Popconfirm, Input, Button, Space, Select, Form, ColorPicker } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import store from "store";
import dayjs from "dayjs";
import classnames from 'classnames'
import type { Color } from 'antd/lib/color-picker'

import { db } from "./db";
import { useArticleStore } from "./store";
import { publishArticle } from "@/api/article";
import { generateUUID } from "@/utils/crypto";
import { useReboundState } from "@/hooks";
import styles from './less/articleWrite.module.less'
import 'md-editor-rt/lib/style.css';
import '@/styles/channing-cyan.less'



interface IArticleStoreContent {
    title: string
    content: string
    timestamp: number
}

interface IArticleStore {
    key: string
    val: IArticleStoreContent
}

interface IPublishForm {
    tags: string[]
    abstract: string
}


const toolbars: ToolbarNames[] = [
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    '-',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    '=',
    'prettier',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
    'catalog',
    'github'
];
const prefix = '_article_'
// 匹配图片链接：![xxx](__imgs_xxx "xxx")，第一个匹配项是图片链接中的地址
const reg1 = /!\[.*?\]\((__imgs_[^ ()'"]*).*?\)/g
// 匹配图片链接：<!-- xxx -->\n![xxx](blob:xxx "xxx")，第一个匹配项是注释中的内容，第二个是图片链接中的地址
const reg2 = /<!-- (.*?) -->\n!\[.*?\]\((blob:[^ ()'"]*).*?\)/g

const generateDraftID = () => prefix + generateUUID()
const getDrafts = () => store.filter<IArticleStoreContent>(key => key.startsWith(prefix)).sort((a, b) => b.val.timestamp - a.val.timestamp)


const DraftBox: React.FC<{
    open: boolean
    close: () => void
    onSelect: (data: IArticleStore) => void
}> = ({ open, close, onSelect }) => {
    const [drafts, setDrafts] = useState(getDrafts)

    const { message } = App.useApp()

    useEffect(() => {
        if (open) {
            setDrafts(getDrafts())
        }
    }, [open])

    const deleteDraft = (data: IArticleStore) => {
        store.remove(data.key)
        setDrafts([...drafts.filter(({ key }) => key !== data.key)])
        message.success('删除成功')
    }

    return (
        <Modal open={open} onCancel={close} closable={false} footer={false} className={styles.modal}>
            <Button onClick={() => onSelect({ key: generateDraftID(), val: { title: '', timestamp: 0, content: '' } })} className={styles.button} type='primary'>
                写新文章
            </Button>
            <List
                className={styles.list}
                dataSource={drafts}
                renderItem={(data) => {
                    const { val: item } = data
                    return (
                        <List.Item className={styles['list-item']} actions={[
                            <EditOutlined onClick={() => onSelect(data)} className={classnames(styles.icon, styles.edit)} />,
                            <Popconfirm title='确认删除此草稿？' okText='确定' cancelText='取消' onConfirm={() => deleteDraft(data)}>
                                <DeleteOutlined className={classnames(styles.delete, styles.icon)} />
                            </Popconfirm>
                        ]}>
                            <List.Item.Meta
                                title={item.title || '暂无标题'}
                                description={dayjs(item.timestamp).format('YYYY-MM-DD HH:mm')}
                            />
                        </List.Item>
                    )
                }}
            />
        </Modal>
    )
}

const CreateTagBox: React.FC<{
    open: boolean
    close: () => void
    onCreate: () => void
}> = ({ open, close, onCreate }) => {
    const [form] = Form.useForm<{ tagName: string, color: Color}>()
    const {addTags, hasTag} = useArticleStore()

    useEffect(() => {
        if (open) form.resetFields()
    }, [open, form])

    const onFinish = ({tagName, color}: { tagName: string, color: Color | string}) => {
        if(typeof color !== 'string') color = color.toHexString()
        addTags([{tagName, color}]).then(() => {
            onCreate()
        })
    }

    return (
        <Modal open={open} onCancel={close} closable={false} okText='创建' onOk={() => form.submit()}>
            <Form form={form} onFinish={onFinish} initialValues={{ tagName: '', color: '#1677ff' }}>
                <Form.Item name='tagName' label='标签名称' tooltip='中文占2字，不要输入emoji'
                    rules={[
                        { required: true, message: '请输入标签名称' },
                        { validator(_rule, value: string) {
                            let len = 0
                            for(const c of value) {
                                if(c.match(/[\u4e00-\u9fcb]/)) len += 2
                                else len++
                            }
                            if(len > 12) return Promise.reject('标签名称应12字以内')
                            return Promise.resolve()
                        }},
                        {validator(_rule, value) {
                            if(hasTag(value)) return Promise.reject('已存在该标签')
                            return Promise.resolve()
                        }}
                    ]}
                >
                    <Input placeholder="请输入标签名称，1-12字" />
                </Form.Item>
                <Form.Item name='color' label='颜色' required>
                    <ColorPicker showText />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const PublishBox: React.FC<{
    open: boolean
    close: () => void
    onPublish: (tags: string[], abstract: string) => void
    textContent?: string
}> = ({ open, close, onPublish, textContent = '' }) => {
    const [createTagVis, setCreateTagVis] = useState(false)

    const [form] = Form.useForm<IPublishForm>()
    const tags = Form.useWatch('tags', form) || []

    useEffect(() => {
        if (open) form.resetFields()
    }, [open, form])

    const { tags: allTags } = useArticleStore()

    const options = useMemo(() => {
        return allTags.map(tag => ({
            label: tag.tagName,
            value: tag.tagName
        }))
    }, [allTags])

    const onFinish = (val: IPublishForm) => {
        onPublish(val.tags, val.abstract)
    }

    const closeCreateTagBox = () => {
        setCreateTagVis(false)
    }

    return (
        <>
            <Modal open={open} onCancel={close} closable={false} okText='发布' className={styles.modal} onOk={() => form.submit()}>
                <Form form={form} initialValues={{ tags: [], abstract: textContent }} onFinish={onFinish}>
                    <Form.Item label='标签' required>
                        <Form.Item name='tags' rules={[{ required: true, type: 'array', message: '至少一个标签' }]} noStyle>
                            <Select
                                mode='multiple'
                                allowClear
                                options={options}
                                className={styles.select} maxCount={3}
                                suffixIcon={<>
                                    <span>
                                        {tags.length} / 3
                                    </span>
                                    <DownOutlined />
                                </>}
                            />
                        </Form.Item>
                        没有想要的标签？<Button type='link' style={{ padding: 0 }} onClick={() => setCreateTagVis(true)}>点此创建</Button>
                    </Form.Item>
                    <Form.Item label='摘要' name='abstract' rules={[{ required: true, message: '内容不能为空' }]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <CreateTagBox open={createTagVis} close={closeCreateTagBox} onCreate={closeCreateTagBox} />
        </>
    )
}

const ArticleWrite: React.FC = () => {
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [textContent, setTextContent] = useState('')
    const [saveTextVis, setSaveTextVis] = useReboundState(false, 2000)
    const [draftBoxVis, setDraftBoxVis] = useState(false)
    const [publishBox, setPublishBox] = useState(false)

    const id = useRef('')
    if (!id.current) id.current = generateDraftID()

    const changed = useRef({ content: 0, title: 0 })
    const shouldReplaceImgs = useRef(false)
    const objectUrls = useRef<{ name: string, data: File, url: string }[]>([])
    const div = useRef(document.createElement('div'))
    const editorRef = useRef<ExposeParam>()
    const { message } = App.useApp()
    const navigate = useNavigate()

    const textContentWithoutBlank = useMemo(() => {
        return textContent.replace(/[ \n]+/g, '')
    }, [textContent])

    useEffect(() => {
        db.open()
        return () => db.close()
    }, [])

    const save: SaveEvent = (val) => {
        if (!title && !val) return
        if (changed.current.content < 1 && changed.current.title < 1) return

        store.set(id.current, {
            title: title,
            timestamp: Date.now(),
            content: val
        })
        setSaveTextVis(true)
    }

    const { run: debounceSave } = useDebounceFn(editorRef.current?.triggerSave || (() => { }), { wait: 5000 })

    const replaceNewImgs = async (val: string) => {
        const keys: string[] = [], map: Record<string, string> = {};

        [...val.matchAll(reg1)].forEach(item => keys.push(item[1]))

        if (keys.length) {
            const data = await db.getImgs({ names: keys })
            data.forEach(item => {
                const url = URL.createObjectURL(item.data)
                objectUrls.current.push({ name: item.name, data: item.data, url })
                map[item.name] = url
            })

            val = val.replace(reg1, (sub, g1) => {
                // sub：整个匹配到的内容，g1：keyname
                return `<!-- ${g1} -->\n${sub.replace(g1, map[g1])}`
            })
        }

        shouldReplaceImgs.current = false
        return val
    }

    const replaceOldImgs = async (val: string) => {
        const keys: string[] = [], map: Record<string, string> = {};

        [...val.matchAll(reg2)].forEach(item => keys.push(item[1]))

        if (keys.length) {
            const data = await db.getImgs({ names: keys })
            data.forEach(item => {
                const url = URL.createObjectURL(item.data)
                objectUrls.current.push({ name: item.name, data: item.data, url })
                map[item.name] = url
            })

            val = val.replace(reg2, (sub, g1, g2) => {
                // sub：整个匹配到的内容，g1：keyname，g2：blob地址
                return sub.replace(g2, map[g1])
            })
        }

        shouldReplaceImgs.current = false
        return val
    }

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        changed.current.title++
        debounceSave()
    }

    const onContentChange = async (val: string) => {
        if (shouldReplaceImgs.current) val = await replaceNewImgs(val)

        setValue(val)
        changed.current.content++
        debounceSave()
    }

    const onHtmlChanged = (val: string) => {
        div.current.innerHTML = val
        setTextContent(div.current.textContent?.replace(/[\n ]+/g, ' ') || '')
    }

    const uploadImg: UploadImgEvent = async (files, callback) => {
        const names = await db.addImgs(files, id.current)
        shouldReplaceImgs.current = true
        callback(names)
    }

    const openDraftBox = () => {
        editorRef.current?.triggerSave()
        setDraftBoxVis(true)
    }

    const onSelect = async (data: IArticleStore) => {
        // 设置文章id
        id.current = data.key
        // 清空图片缓存，毕竟后面用不到了
        objectUrls.current.forEach(item => URL.revokeObjectURL(item.url))
        objectUrls.current.length = 0
        // 设置为-1，因为替换内容时也会改变一次
        changed.current.content = -1
        // input手动设置值时不会触发onChange
        changed.current.title = 0

        setTitle(data.val.title)
        const content = await replaceOldImgs(data.val.content)
        setValue(content)
        setDraftBoxVis(false)
        message.success('成功加载该内容')
    }

    const publish = (tags: string[], abstract: string) => {
        if(!title || !value) {
            setPublishBox(false)
            return message.warning('请先完成文章内容')
        }
        publishArticle({
            tags, 
            abstract, 
            title, 
            content: value, 
            imgs: objectUrls.current.map(item => ({name: item.name, data: item.data}))
        }).then(async (newPageId) => {
            // 删除数据库缓存的图片
            await db.deleteImgs({articleID: id.current})
            // 删除浏览器缓存的blob图片
            objectUrls.current.forEach(item => URL.revokeObjectURL(item.url))
            // 清除该草稿
            store.remove(id.current)
            // 跳转新页面
            navigate(`/article/${newPageId}`, {replace: true})
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Input variant='borderless' value={title} onChange={onTitleChange} placeholder='请输入标题...' maxLength={30} showCount className={styles.input} />
                <Space className={styles.right}>
                    <span className={styles['save-text']} style={{ visibility: saveTextVis ? 'visible' : 'hidden' }}>
                        已保存至草稿箱
                    </span>
                    <Button type='primary' onClick={openDraftBox}>草稿箱</Button>
                    <Button type='primary' onClick={() => editorRef.current?.triggerSave()}>保存</Button>
                    <Button type='primary' onClick={() => setPublishBox(true)}>发布</Button>
                </Space>
            </div>
            <MdEditor
                modelValue={value}
                onChange={onContentChange}
                onHtmlChanged={onHtmlChanged}
                onSave={save}
                className={styles.editor}
                previewTheme="channing-cyan"
                codeStyleReverseList={['channing-cyan']}
                showCodeRowNumber
                ref={editorRef}
                toolbars={toolbars}
                tabWidth={4}
                placeholder="写点什么吧..."
                onUploadImg={uploadImg}
                defFooters={[
                    <div key='content-total' className="md-editor-footer-item">
                        <label className="md-editor-footer-label">正文字数：</label>
                        <span>{textContentWithoutBlank.length}</span>
                    </div>
                ]}
                footers={['markdownTotal', 0, '=', 'scrollSwitch']}
            />
            <DraftBox open={draftBoxVis} close={() => setDraftBoxVis(false)} onSelect={onSelect} />
            <PublishBox open={publishBox} close={() => setPublishBox(false)} textContent={textContent} onPublish={publish} />
        </div>
    )
}

export default ArticleWrite