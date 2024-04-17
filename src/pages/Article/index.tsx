import React from "react";
import { Outlet } from "react-router-dom";
import { FloatButton } from "antd";

import Header from "@/components/Layout/Header";
import ArticleList from "./ArticleList";
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
            <Outlet />
            <FloatButton.BackTop />
        </div>
    )
}


export {
    ArticleList
}

// const Article: React.FC = () => {
//     const id = 'preview-only'
//     const [text, setText] = useState(str)
//     const div = useRef<HTMLDivElement>(null)

//     const catalogClick: CatalogProps['onClick'] = (e, t) => {
//         console.log(e, t)
//         // t.active = true
//     }

//     const onActive: CatalogProps['onActive'] = (heading) => {
//         console.log(heading)
//     }

//     return (
//         <div style={{ display: "flex" }}>
//             <MdEditor modelValue={text} onChange={setText} />
//             <MdPreview editorId={id} modelValue={text} previewTheme="channing-cyan" codeStyleReverseList={['channing-cyan', 'default']} showCodeRowNumber />
//             <div>
//                 <div style={{ position: 'sticky', top: '10px' }} ref={div}>
//                     <MdCatalog editorId={id} onClick={catalogClick} onActive={onActive} scrollElement={document.documentElement} />
//                 </div>
//             </div>
//         </div>
//     )
// }
