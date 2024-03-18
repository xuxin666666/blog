/**
 * codePlugin
 * 添加混合代码块功能，代码添加复制按钮
 */

import { copyToBoard } from "@/utils/copyToBoard";
import type { BytemdPlugin } from "bytemd";
import './index.less'


export interface IcodePluginProps {
    onCopySuccess?: () => void
    onCopyError?: () => void
}

// const mixedCodeContainerClass = '_ft-mixed-code'
// const mixedCodeTagSel = '_ft-select'
// const mixedCodeNone = '_ft-none'
const mixedCopyBtn = 'ft-copy-btn'

export default function codePlugin(props: IcodePluginProps = {}): BytemdPlugin {
    // function isMixedCode(data: any) {
    //     if(data.type === 'code' && data.lang && data.lang.endsWith('[]')) return true
    //     return false
    // }

    // function isMixedHTMLAST(node: any) {
    //     return node.tagName === 'div' && Array.isArray(node.children) && node.children[node.children.length - 1].tagName === 'pre'
    // }

    // function handleMixedCode(rootNode: any, datas: any[]) {
    //     rootNode.properties.class = mixedCodeContainerClass

    //     let ul = {type: 'element', tagName: 'ul', children: []}
    //     // @ts-ignore
    //     rootNode.children.forEach((item, index) => {
    //         let title = datas[index].lang
    //         if(datas[index].meta) {
    //             let splited = datas[index].meta.split(' ')[0]
    //             if(splited) title = splited
    //         }
    //         let li = {type: 'element', tagName: 'li', children: [
    //             {type: 'text', value: title}
    //         ]};
    //         (ul.children as any).push(li)
    //     })

    //     rootNode.children.unshift(ul)
    // }

    function handleCodeAddCopy(rootNode: any, datas: any[]) {
        let idx = 0

        const createBtn = () => ({
            type: 'element',
            tagName: 'button',
            properties: {
                class: mixedCopyBtn,
                'data-code': datas[idx++].value
            },
            children: [
                {type: 'element', tagName: 'div'}
            ]
        })

        rootNode.children.forEach((item: any) => {
            // if(isMixedHTMLAST(item)) {
            //     // @ts-ignore
            //     item.children.forEach(ceil => {
            //         if(ceil.tagName === 'pre') {
            //             ceil.children.unshift(createBtn())
            //         }
            //     })
            // } else if(item.tagName === 'pre') {
            //     item.children.unshift(createBtn())
            // }
            if(item.tagName === 'pre') {
                item.children.unshift(createBtn())
            }
        })
    }

    // function handleMixedCodeElement(element: HTMLDivElement) {
    //     let lis: NodeListOf<HTMLLIElement> = element.querySelectorAll('ul > li')!, codeEles = element.querySelectorAll('pre')!
        
    //     lis[0].classList.add(mixedCodeTagSel)
    //     for(let i = 1; i < codeEles.length; i++) {
    //         codeEles[i].classList.add(mixedCodeNone)
    //     }
    //     lis.forEach((li, idx) => {
    //         li.onclick = function() {
    //             for(let i = 0; i < codeEles.length; i++) {
    //                 codeEles[i].classList.add(mixedCodeNone)
    //                 lis[i].classList.remove(mixedCodeTagSel)
    //             }
    //             lis[idx].classList.add(mixedCodeTagSel)
    //             codeEles[idx].classList.remove(mixedCodeNone)
    //         }
    //     })
    // }

    function handleCopyCode(root: HTMLElement) {
        const btns = root.querySelectorAll('button')
        btns.forEach(btn => {
            btn.onclick = function() {
                const val = btn.getAttribute('data-code')
                if(typeof val === 'string') copyToBoard(val).then(props.onCopySuccess).catch(props.onCopyError)
                else props.onCopyError?.()
            }
        })
    }

    /**
     * remark阶段：找到混合代码块的片段，修改对应的markdown ast并储存数据
     * rehype阶段：添加切换代码的标签，添加复制按钮
     * viewerEffect阶段：添加事件：代码切换的事件，复制代码事件
     */
    return {
        remark: (processor) => {
            processor.use<[]>(() => (node: any, file: any) => {
                // 找出混合代码块，添加到混合代码框框中，原地修改node
                
                if(!file.data.mixedCodes) file.data.mixedCodes = []
                if(!file.data.codes) file.data.codes = []

                for(let i = 0; i < node.children.length; i++) {
                    // if(isMixedCode(node.children[i])) {
                    //     let arr: any[] = [], j = i
                    //     file.data.mixedCodes[++index] = []
                    //     for(; j < node.children.length && isMixedCode(node.children[j]); j++) {
                    //         let child = node.children[j]
                    //         child.lang = child.lang.slice(0, child.lang.length - 2)
                    //         arr.push(node.children[j])
                    //         file.data.mixedCodes[index].push(node.children[j])
                    //         file.data.codes.push(node.children[j])
                    //     }
                    //     node.children.splice(i, j - i, {
                    //         type: 'mixedCodes',
                    //         children: arr,
                    //         position: {
                    //             start: arr[0].position.start,
                    //             end: arr[arr.length - 1].position.end
                    //         }
                    //     })
                    // } else if(node.children[i].type === 'code') {
                    //     file.data.codes.push(node.children[i])
                    // }
                    file.data.codes.push(node.children[i])
                }
            })
            return processor
        },
        rehype: (processor) => {
            processor.use<[]>(() => (node: any, file: any) => {
                // for(let i = 0, index = -1; i < node.children.length; i++) {
                //     let child = node.children[i]
                //     if(isMixedHTMLAST(child)) {
                //         handleMixedCode(child, file.data.mixedCodes[++index])
                //     }
                // }
                handleCodeAddCopy(node, file.data.codes)
            })
            return processor
        },
        viewerEffect({markdownBody}) {
            // let eles = markdownBody.querySelectorAll(`.${mixedCodeContainerClass}`)
            // eles.forEach((e) => handleMixedCodeElement(e as any))
            handleCopyCode(markdownBody)
        },
        actions: [
            {
                title: '???',
                icon: '',
                handler: {
                    type: 'action',
                    click: (ctx) => {
                        ctx.editor.getValue()
                        ctx.editor.focus()
                    }
                }
            }
        ]
    }
}