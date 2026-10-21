# dsh-chat-width

> 为旧版DSH网页添加可拖拽并记忆的聊天内容宽度控制，在内置同功能版本上自动让位。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[5d61f65](https://github.com/764475881/dsh-chat-width/tree/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/764475881/dsh-chat-width) [![npm 30d 99](https://img.shields.io/static/v1?label=npm+30d&message=99&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-chat-width) [![首次发布 2026-08-13](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-chat-width)
<!-- END META -->

**使用建议**：新版DSH优先使用内置把手。仍用旧版且需要宽列时可在一个浏览器先检查拖动、重载记忆和禁用清理，再考虑保留。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：旧版DSH的大屏用户需要调整聊天列宽，合格结果是宽度随拖动持久保存且不产生重复控件；当前内置宽度功能的宿主没有必要为此安装。

- **建议**：由主动退让机制推导，可把界面补丁做成宿主能力声明驱动的短期扩展：存在官方能力时同时迁移旧偏好并停用观察器。相比DOM启发式可减少重复控件与长期维护；未验证。跨旧/新宿主和不同主题测试偏好保留及误判率，若不优于当前探测则无需引入额外协议。

新版DSH优先使用内置把手。仍用旧版且需要宽列时可在一个浏览器先检查拖动、重载记忆和禁用清理，再考虑保留。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

原生DSH宽度把手可满足新版需求；旧版手动CSS也能调宽但缺少持久且可发现的操作。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：居中列边缘跟手调整并记忆宽度。 检测官方宽度把手后撤下自身样式与把手。

**流程与依赖**

依赖浏览器localStorage、CSS变量、pointer事件、DSH ModuleLoader与会话DOM；无服务器权限或账号要求。

用户拖动把手，CSS即时更新，松开写localStorage；双击恢复默认，原生把手出现后移除自身控件，禁用时清理observer与样式。

**效果与成本**

无模型或外部服务成本；首次与升级需核对DOM适配，持续成本是MutationObserver与样式冲突排查，未测浏览器开销。

改善大屏阅读空间取舍；宽列也可能降低长段落可读性，未有阅读效率对照。

- **思考**：原生功能探测是否足够稳健？检测依赖data-width-handle、哈希类名与CSS变量层级；主题或宿主DOM变动可能误判。README已说明0.1.7+内置，而源码仍观察整棵DOM，因此安装便利不能自动等于现代宿主上的增益。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对控制台手写CSS，增量是可发现的拖拽入口与本地偏好记忆；更值得借鉴的是原生功能出现后主动退让，而非继续竞争样式。它没有改变模型交付能力，贡献限于旧宿主的阅读交互。

相对控制台手写CSS，增量是可发现的拖拽入口与本地偏好记忆；更值得借鉴的是原生功能出现后主动退让，而非继续竞争样式。它没有改变模型交付能力，贡献限于旧宿主的阅读交互。

2倍位移映射把居中布局的几何关系写清楚，pointer capture与effect清理完整可读。DOM哈希选择器和全局观察器是迁移成本来源；复用时应提供稳定宿主钩子。 源码依据：[lib/client.js](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js)、[package.json](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/package.json)。

<a id="detail-section-5"></a>

### 主要限制

原生功能探测是否足够稳健？检测依赖data-width-handle、哈希类名与CSS变量层级；主题或宿主DOM变动可能误判。README已说明0.1.7+内置，而源码仍观察整棵DOM，因此安装便利不能自动等于现代宿主上的增益。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[764475881/dsh-chat-width](https://github.com/764475881/dsh-chat-width)
- **版本号**：0.1.2（[固定提交 5d61f652](https://github.com/764475881/dsh-chat-width/tree/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：旧新版宿主分别检查拖动边缘跟手、重载、窄屏、主题切换、原生控件晚挂载和禁用后DOM清理。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由主动退让机制推导，可把界面补丁做成宿主能力声明驱动的短期扩展：存在官方能力时同时迁移旧偏好并停用观察器。相比DOM启发式可减少重复控件与长期维护；未验证。跨旧/新宿主和不同主题测试偏好保留及误判率，若不优于当前探测则无需引入额外协议。

旧新版宿主分别检查拖动边缘跟手、重载、窄屏、主题切换、原生控件晚挂载和禁用后DOM清理。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：893f5ed97ceb86dd8fb8d73fc6a783e6a0a779542b929409914755529b9f567f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 153 | — | — | 1776 |
| .js | source | 2 | 292 | 228 | 46 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/764475881/dsh-chat-width/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
