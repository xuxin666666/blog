

### commmitlint 
> `git commit -m <type>[optional scope]: <description>` // 注意冒号后面有空格
> - type：提交的改动类型（如新增、修改、更新等）
> - optional scope：标识此次提交主要涉及到代码中哪个模块
> - description：一句话描述此次提交的主要内容

|type  |描述   |
|----|----|
|feat|	新增功能|
|fix|	bug 修复|
|style|	不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)|
|refactor|	重构代码(既没有新增功能，也没有修复 bug)|
|docs|	文档更新|
|test|	增加测试|
|chore|	构建过程或辅助工具的变动|
|revert| 还原 |
|ci     |       |
|perf   |       |

示例：
```shell
git commit -m 'feat: 增加 xxx 功能'
git commit -m 'bug(blog): 修复 xxx 功能'
```

### stylelint
[修改规则](https://stylelint.io/user-guide/rules)

### 测试工具 vitest

[指南](https://cn.vitest.dev/guide/)

### 状态管理库 - hox

[指南](https://hox.js.org/zh/guide/quick-start)

0学习成本，用起来就像使用hooks一样，业务逻辑共享

（已解决）
v2.1.0 感觉较为严重的bug：[Provider内部的children不受外部state的影响](https://github.com/umijs/hox/issues/97)
回复中有解决方案，但是是修改源码的，且不知道改动后性能怎么样
规避：先用全局store替代吧

### 组件样式库 antd

常用的react组件样式库

问题：老问题了，`<React.StrictMode>`下各种报错，其他的可以去看看[issue](https://github.com/ant-design/ant-design/issues)

### TODO

- [ ] 开发主界面
    - [ ] 主界面展示（pc端图片待定）
    - [x] 主界面各入口
    - [ ] (pending) 设置默认主页，将其他页面设置成主页面
- [ ] 文章搜索页
    - [x] 文章列表展示
    - [x] 文章搜索功能
    - [x] (extra) 标签分类功能
    - [x] 文章内容展示
        - [x] 基本内容展示 + 目录展示
        - [x] 提供快速修改功能
        - [ ] (extra) 文章内容分块，内容右侧再分出一块空间，选中内容某部分可将其固定至此，方便浏览
        - [ ] (pending) 开启评论功能
    - [x] 发布文章
    - [ ] 文章管理页面，方便管理大量文章
    - [ ] (extra) 文章合集
- [ ] 音乐搜索/下载
    - [ ] 本服务器音乐搜索 / 下载
    - [ ] 展示搜索结果，提供在线试听功能
        - [ ] (extra) 展示封面、歌词等
    - [ ] 下载音乐时，嵌入封面 / 歌词 / 翻译歌词 / 罗马音歌词（如果有的话）
        - [ ] 下载设置，默认只嵌入封面 / 歌词
    - [ ] (pending) 第三方音乐搜索 / 下载，如wyy
        - [ ] 避免ip被封，限制访问次数？？？（本人不限，所有游客总计1次/秒）
        - [ ] 提供更多的第三方，限制次数独立计算
        - [ ] 多种音质下载
    - [ ] 音乐上传（本人）
- [ ] 牢骚闲话（本人才能看）
    - [ ] 竖排时间线卡片展示，从新到旧
    - [ ] 搜索功能，日期 / 内容
    - [ ] 发表新内容
    - [ ] 给内容标记，方便快速筛选
        - [ ] (extra) 多种标记多种筛选
    - [ ] (pending) 内容储存在本地，不上传到服务器
- [ ] (pending) 网站分享
    - [ ] 分享一些觉得有趣 / 有用的网站
    - [ ] (extra) 进行分类
- [ ] ......

    