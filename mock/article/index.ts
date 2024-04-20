import { MockMethod } from "vite-plugin-mock";
import Mock from 'mockjs'
import { handleRoutes } from "..";



const articleContent = `# 😲 md-editor-rt

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

# 🤖 基本演示 x 2

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

# h1-1

## h2-2

### h3-3

## h2-4

## h2-5

### h3-6

# h1-7

# h1-1

## h2-2

### h3-3

### h3-4

### h3-5

### h3-6

# h1-7
`

const routes: MockMethod[] = [
    {
        url: '/api/article/list',
        method: 'get',
        statusCode: 200,
        // 响应数据，json
        response({ query: { pagesize = 10, page = 1, 'tags[]': tags = [] } }) {
            if (!Array.isArray(tags)) tags = [tags]

            let data = Mock.mock({
                [`list|${pagesize}`]: [{
                    title: '@ctitle(5, 15)',
                    content: '@cparagraph',
                    'tags|1-3': ['@cword(2, 5)'],
                    image: '@image',
                    id: '@guid',
                    'views|0-1000': 0,
                    'likes|0-100': 0,
                    createTime: '@datetime(T)',
                    updateTime: '@datetime(T)'
                }],
                'total|30-60': 0
            })
            data.list.forEach((item: any) => {
                item.createTime = parseInt(item.createTime)
                item.updateTime = parseInt(item.updateTime)
                if (tags.length) {
                    for (let i = 0; i < tags.length && i < item.tags.length; i++) {
                        item.tags[i] = tags[i]
                    }
                }
            })
            return data
        },
    },
    {
        url: '/api/article/tags',
        method: 'get',
        statusCode: 200,
        response() {
            return Mock.mock({
                'tags|10-30': [{
                    tagName: '@cword(2, 5)',
                    'pageNum|5-30': 0
                }]
            })
        }
    },
    {
        url: '/api/article/statistics',
        method: 'get',
        statusCode: 200,
        response() {
            return Mock.mock({
                'views|20-10000': 0,
                'likes|10-500': 0,
                'words|1000-100000': 0,
                'pages|10-200': 0
            })
        },
    },
    {
        url: '/api/article/:id',
        method: 'get',
        statusCode: 200,
        response({ query: { id } }) {
            let data = Mock.mock({
                content: articleContent,
                'views|5-1000': 0,
                'likes|0-50': 0,
                'words|1000-10000': 0,
                'tags|1-3': ['@cword(2, 5)'],
                title: '@ctitle(5, 15)',
                createTime: '@datetime(T)',
                updateTime: '@datetime(T)',
                id
            })
            data.createTime = parseInt(data.createTime)
            data.updateTime = parseInt(data.updateTime)
            return data
        }
    },
    {
        url: '/api/article/:id',
        method: 'post',
        response({body: {like = false}}) {
            return
        },
    }
]


export default handleRoutes(routes)