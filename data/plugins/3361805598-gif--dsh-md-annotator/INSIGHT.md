# Markdown 批注器

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[75f7f4d](https://github.com/3361805598-gif/dsh-md-annotator/tree/75f7f4d7c7cad205ed7cda7b687774e0db8a4254)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)
<!-- END META -->

> **实现功能**：在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。

> **核心亮点**：相对复制段落到聊天，贡献在于把批注位置、类型和原文绑定，并整理为当前文件所属会话草稿；多视图共用文档避免各自编辑。主工作台与文件路由归Better Sidebar，批注重锚定和报告是本组件增量。

> **风险与缺陷**：核心问题是重生成后引用是否仍指向正确原文。重复段落、结构变化和非完整Markdown子集会削弱锚定；插件不持久化批注，刷新/重启可能丢审阅劳动。报告进入草稿也不等于修改已执行或被验收。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：审阅AI生成Markdown的作者，按段落或选区给修改要求；交付带引用的批注报告与保存后的源码，发送前由人确认。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照复制原文加聊天意见与普通Markdown编辑器；Better Sidebar提供容器，未将其能力计作本组件创新。

Better Sidebar viewer承载预览/源码；批注引用含块内容与邻接上下文，重生成后重新锚定。宿主save路由使用会话fs及ifVersion条件；客户端共享文档模型保留未保存草稿。


DSH web 0.1.5-rc.1+ 与 dsh-better-sidebar>=0.19.1 <0.20.0；optional peer避免重复实例，但未装时viewer不激活。源码构建需Node>=20及pnpm>=10；文件完整读取上限2MiB。

从侧栏打开文件→选块/文字批注→检查报告→写入输入框草稿→人工发送；源码保存经官方fs版本条件，冲突不覆盖。结束前保存正文并导出批注JSON。

初装需本地打包和版本匹配；持续成本是批注整理、复杂Markdown校对、刷新前导出，未测节省人时。无额外模型调用直到用户发送草稿。

把指令从笼统“修改这里”变成定位清楚的报告；质量收益依赖锚定准确和人工确认，未实测下游修复合格率。

**能力**

- **界面**：Markdown预览、源码编辑、块与选区批注。
- **Host 路由**：通过会话fs和版本条件保存文件。

> **思考**：核心问题是重生成后引用是否仍指向正确原文。重复段落、结构变化和非完整Markdown子集会削弱锚定；插件不持久化批注，刷新/重启可能丢审阅劳动。报告进入草稿也不等于修改已执行或被验收。

<a id="detail-section-4"></a>

### 1.3 工程贡献

使用内容子树计算选区偏移以避开按钮文本污染；save错误把冲突/权限/结果不确定区分，可借鉴到其他文档编辑器。移植需文档版本和会话fs契约。

0.9.0无作者预设下载地址，README指导本地tgz；非完整GFM、无批注导入和自动发送。

固定源码依据：[lib/index.js L20–94](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/index.js#L20-L94)；[lib/src/selection.js L17–49](https://github.com/3361805598-gif/dsh-md-annotator/blob/75f7f4d7c7cad205ed7cda7b687774e0db8a4254/lib/src/selection.js#L17-L49)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：相对复制段落到聊天，贡献在于把批注位置、类型和原文绑定，并整理为当前文件所属会话草稿；多视图共用文档避免各自编辑。主工作台与文件路由归Better Sidebar，批注重锚定和报告是本组件增量。

<a id="detail-section-5"></a>

### 1.4 使用建议

适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[3361805598-gif/dsh-md-annotator](https://github.com/3361805598-gif/dsh-md-annotator)；固定提交：[75f7f4d7](https://github.com/3361805598-gif/dsh-md-annotator/tree/75f7f4d7c7cad205ed7cda7b687774e0db8a4254)；版本号：0.9.0；版本日期：2026-09-13（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：抽读宿主保存与批注/选区/文档/文件模块，未在浏览器操作，不把所有解析行为视为完整CommonMark。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：把批注导出与文件版本摘要绑定，恢复时先显示匹配/冲突再导入，可延伸现有引用策略并降低重启损失。依据是当前已有版本和JSON导出而无导入/持久批注；新增复杂性是迁移与冲突处理。

最小验证与否定条件：构造重复段落、列表重排、外部编辑和多视图并行修改，对照手工引用；要求批注不静默错挂、version冲突保留草稿、报告不自动发送。若不能区分失配原文或重启损失显著，则不适合长期审阅。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 272 | — | — | 4193 |
| .js | source | 14 | 4297 | 3863 | 296 | — |
| .mjs | source | 1 | 68 | 43 | 21 | — |
| .mjs | test | 6 | 600 | 543 | 31 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
