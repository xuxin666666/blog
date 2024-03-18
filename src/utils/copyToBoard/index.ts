/**
 * 控制页面的复制功能
 */

/**
 * 添加额外信息
 */
const extraData = () => `

作者：FATAL ERROR
链接：${window.location.href}
来源：神秘来源
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
`

/**
 * 将文字复制到粘贴板中
 * @param txt 
 * @param addExtra 
 * @returns 
 */
export const copyToBoard = (txt: string, addExtra?: boolean) => {
    if (addExtra) txt += extraData()
    return window.navigator.clipboard.writeText(txt)
}

/**
 * 获取页面选中内容
 * @returns 
 */
export const getSelected = () => {
    return window.getSelection()?.toString() || ''
}

/**
 * 监听复制事件，并添加额外内容
 * @param ele 
 * @returns 
 */
export const copyToBoardEvent = (ele: Window | Document | Element = window) => {
    function copyHandle(e: Event) {
        asserts(e instanceof ClipboardEvent)
        e.preventDefault()
        const selected = getSelected()
        if(!selected.trim()) return

        e.clipboardData?.setData('text/plain', selected + extraData())
    }

    ele.addEventListener('copy', copyHandle)

    return function () {
        ele.removeEventListener('copy', copyHandle)
    }
}
