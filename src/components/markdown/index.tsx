import React from 'react'
import { Editor, Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import math from '@bytemd/plugin-math'
import highlight from '@bytemd/plugin-highlight'
import frontmatter  from '@bytemd/plugin-frontmatter'
import codePlugin from './plugins/codePlugin'
import type { BytemdPlugin } from 'bytemd'
import type {EditorProps, ViewerProps} from '@bytemd/react'
import type { IcodePluginProps } from './plugins/codePlugin'

import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'
import styled from './index.module.less'


interface IMarkDownEditorProps extends EditorProps, IcodePluginProps {
    className?: string
    style?: React.CSSProperties
}

interface IMarkDownViewerProps extends ViewerProps, IcodePluginProps {
    className?: string
    style?: React.CSSProperties
}

const plugins: BytemdPlugin[] = [
    gfm(),
    math(),
    highlight(),
    frontmatter(),
    // themesPlugin(),
    codePlugin()
]

export const MDEditor: React.FC<IMarkDownEditorProps> = (props) => {

    return (
        <div className={[styled['md-container'], props.className].join(' ')} style={props.style}>
            <Editor
                mode='split'
                locale={zhHans}
                previewDebounce={500}
                plugins={plugins}
                editorConfig={{
                    cursorScrollMargin: 100
                }}
                // uploadImages={}
                {...props}
            />
            
        </div>
    )
}

export const MDViewer: React.FC<IMarkDownViewerProps> = (props) => {
    return (
        <div className={[styled.mdContainer, props.className].join(' ')} style={props.style}>
            <Viewer
                plugins={plugins}
                {...props}
            />
            
        </div>
    )
}