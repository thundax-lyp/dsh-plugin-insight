# dsh-composer-expand

> 为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 1011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/commits)
<!-- END META -->

## 版本

固定提交 [e816461115436f1cb084f868398e610396d00679](https://github.com/13071301808/dsh-composer-expand/tree/e816461115436f1cb084f868398e610396d00679)

## 用途与采用点评

- **用途**：经常编辑长提示词的用户需要在发送前查看和修改更多草稿内容。
- **亮点**：客户端插槽按钮切换 CSS class 并保存浏览器偏好，DOM observer 修复重建后的样式，捕获普通 Enter 避免发送。
- **思考**：可逆且范围小的界面增量容易评估；收益取决于长文本频率，不应夸大为通用生产力提升。
- **建议**：先以长草稿测试中文输入法、斜杠菜单和 Ctrl/Cmd+Enter，确认关闭后恢复原生行为。

## 场景与替代办法

经常编辑长提示词的用户需要在发送前查看和修改更多草稿内容。

外部编辑器更适合复杂文本；此插件减少小范围长草稿的来回复制。

## 依赖与流程

依赖 Web DOM、React 与输入框插槽，状态按浏览器而非每会话保存。

点击展开、编辑并按适合的发送快捷键提交，再收起；异常时关闭插件恢复并核查 DOM。

## 成本与效果

无需模型或外部服务，主要成本是界面兼容和快捷键习惯适应，未测编辑效率。

可逆且范围小的界面增量容易评估；收益取决于长文本频率，不应夸大为通用生产力提升。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a8d700ddc185a768eb5b40aec6379e30be2a3782cb88632e879430d765e1229d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 521 | 318 | 186 | — |
| .md | source | 1 | 94 | — | — | 1330 |
| .mjs | source | 1 | 74 | 53 | 16 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：输入框展开、回车处理与本地偏好。

## 工程亮点

不依赖构建哈希、状态持久化与 observer 清理可借鉴；DOM 属性稳定性仍是宿主义务。

## 分发与兼容

版本 0.1.5，纯客户端实现，依赖 slots、locale 和宿主稳定 DOM 属性。

## 历史对照

前次代码指纹为 e816461115436f1cb084f868398e610396d00679；本轮固定为 e816461115436f1cb084f868398e610396d00679。外部编辑器更适合复杂文本；此插件减少小范围长草稿的来回复制。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证 Lexical、输入法和多输入区下的实际交互；作者兼容声明不等同安装启动卸载证据。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试中文组合输入、菜单候选、切会话、DOM 重建、禁用恢复和隐私浏览存储失败。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+created%3A2026-09-20T02%3A57%3A50.572Z..2026-10-20T02%3A57%3A50.572Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A57%3A50.572Z..2026-10-20T02%3A57%3A50.572Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A57%3A50.572Z..2026-10-20T02%3A57%3A50.572Z)

统计日期：2026-10-20。
