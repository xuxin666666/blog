import React, { useState, useRef } from "react";

// import { MDViewer } from "@/components/markdown";
import { MdPreview, MdCatalog, MdEditor } from 'md-editor-rt'
import { CatalogProps } from 'md-editor-rt/lib/types/MdCatalog'
import 'md-editor-rt/lib/style.css';
import '@/styles/channing-cyan.less'



const str = `# 😲 md-editor-rt

## 😲 md-editor-rt

Markdown 编辑器，React 版本，使用 jsx 和 typescript 语法开发，支持切换主题、prettier 美化文本等。

### 🤖 基本演示

**加粗**，<u>下划线</u>，_斜体_，~~删除线~~，上标<sup>26</sup>，下标<sub>[1]</sub>，\`inline code\`，[超链接](https://github.com/imzbf)

> 引用：《I Have a Dream》

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

--------------

- [ ] 周五
- [ ] 周六
- [x] 周天

![图片](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif "yes, that's right!")

## 🤗 代码演示

\`\`\`js
import { defineComponent, ref } from 'vue';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default defineComponent({
  name: 'MdEditor',
  setup() {
    const text = ref('');
    return () => (
      <MdEditor modelValue={text.value} onChange={(v: string) => (text.value = v)} />
    );
  }
});
\`\`\`

## 🖨 文本演示

依照普朗克长度这项单位，目前可观测的宇宙的直径估计值（直径约 930 亿光年，即 8.8 × 10<sup>26</sup> 米）即为 5.4 × 10<sup>61</sup>倍普朗克长度。而可观测宇宙体积则为 8.4 × 10<sup>184</sup>立方普朗克长度（普朗克体积）。

## 📈 表格演示

| 昵称 | 来自      |
| ---- | --------- |
| 之间 | 中国-重庆 |

## 📏 公式

行内：$x+y^{2x}$

$$
\\sqrt[3]{x}
$$

## 🧬 图表

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

## 🪄 提示

!!! note 支持的类型

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

## ☘️ 占个坑@！
`


const Article: React.FC = () => {
    const id = 'preview-only'
    const [text, setText] = useState(str)
    const div = useRef<HTMLDivElement>(null)

    const catalogClick: CatalogProps['onClick'] = (e, t) => {
        console.log(e, t)
        // t.active = true
    }

    const onActive: CatalogProps['onActive'] = (heading) => {
        console.log(heading)
    }

    return (
        <div style={{ display: "flex" }}>
            <MdEditor modelValue={text} onChange={setText} />
            <MdPreview editorId={id} modelValue={text} previewTheme="channing-cyan" codeStyleReverseList={['channing-cyan', 'default']} showCodeRowNumber />
            <div>
                <div style={{ position: 'sticky', top: '10px' }} ref={div}>
                    <MdCatalog editorId={id} onClick={catalogClick} onActive={onActive} scrollElement={document.documentElement} />
                </div>
            </div>
        </div>
    )
}

export default Article