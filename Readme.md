

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