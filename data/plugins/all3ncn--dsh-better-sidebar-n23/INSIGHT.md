# dsh-better-sidebar-N23

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ca9694b](https://github.com/All3nCN/dsh-better-sidebar-N23/tree/ca9694b4d232ff47eefec07e395b23eef0766831)

<!-- BEGIN META -->
[![npm 30d 1,143](https://img.shields.io/static/v1?label=npm+30d&message=1%2C143&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)
<!-- END META -->

> **实现功能**：提供文件编辑预览、Git、终端和可扩展页签的会话工作台。

> **核心亮点**：fork在成熟工作台上将拖动中对中心布局的重排推迟至释放，并补新模块服务兼容，属于局部性能/兼容增量；不把继承工具数量当作新机制。

> **风险与缺陷**：UPSTREAM明确src领先健壮性、lib领先外壳，runtime以lib为准。实际lib fs.write只校验绝对路径并写临时rename，没有工作区containment；sessionCwd还接受clientCwd后备，因此“按会话布局/终端归属”不能推导文件能力隔离。信任fence也声明非身份认证。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在DSH旁操作项目文件和持续终端，扩展作者挂自定义Tab/viewer。

明确fork自omdsh-dev dsh-better-sidebar0.12.3；整体工作台、PTY和注册服务归上游，fork重点为拖动重排/外壳及模块加载兼容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：可选terminal_create/send/read/wait等持续终端工具
- **Host 路由**：/sidebar文件/Git/任务及终端WebSocket
- **界面**：双面板工作台与扩展Tab/viewer
- **后台**：会话PTY生命周期与客户端betterSidebar服务

**流程与依赖**

运行入口为lib/index.js和lib/client.js，主机/sidebar路由、WebSocket与可选terminal_*工具，客户端betterSidebar服务注册内置/第三方Tab和viewer；模型终端按exec.agent.session.id归属。

作者验证DSH0.1.1-rc.2且peer<0.2.0、Node20+、ws/node-pty及Git；CodeMirror/xterm延迟chunk，Office等部分能力依赖额外viewer扩展。

会话选择→工作台tab→读取/编辑/Git或PTY→操作后人工验收；终端断线保留缓冲并宽限重连，显式关闭杀进程；拖动释放后提交布局。

**效果与成本**

多库/原生PTY和宿主DOM兼容维护，完整Shell继承环境并可联网/写文件；布局本地会话化不构成OS隔离，模型终端另有token/执行成本。

完整工作台能力有运行bundle源码支持；作者验收不转为本轮验证，没有重排性能或任务工时对照。

> **思考**：UPSTREAM明确src领先健壮性、lib领先外壳，runtime以lib为准。实际lib fs.write只校验绝对路径并写临时rename，没有工作区containment；sessionCwd还接受clientCwd后备，因此“按会话布局/终端归属”不能推导文件能力隔离。信任fence也声明非身份认证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：fork在成熟工作台上将拖动中对中心布局的重排推迟至释放，并补新模块服务兼容，属于局部性能/兼容增量；不把继承工具数量当作新机制。

fork在成熟工作台上将拖动中对中心布局的重排推迟至释放，并补新模块服务兼容，属于局部性能/兼容增量；不把继承工具数量当作新机制。

动态Tab/viewer、模型PTY归属及chunk缓存/失败重试值得借鉴；本forksrc/lib分轨，后续重建可能丢外壳或改变行为。

源码依据：[lib/index.js](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js)、[lib/client.js](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/client.js)、[src/index.ts](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/src/index.ts)、[src/tools.ts](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/src/tools.ts)、[src/trust-fence.ts](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/src/trust-fence.ts)、[src/client/chunk-loader.ts](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/src/client/chunk-loader.ts)、[UPSTREAM.md](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/UPSTREAM.md)。

<a id="detail-section-5"></a>

### 1.4 主要限制

UPSTREAM明确src领先健壮性、lib领先外壳，runtime以lib为准。实际lib fs.write只校验绝对路径并写临时rename，没有工作区containment；sessionCwd还接受clientCwd后备，因此“按会话布局/终端归属”不能推导文件能力隔离。信任fence也声明非身份认证。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在匹配宿主和隔离项目核实际lib、文件写权限与PTY清理；别仅用较新的src安全修复判断运行版本。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[All3nCN/dsh-better-sidebar-N23](https://github.com/All3nCN/dsh-better-sidebar-N23)
- **版本号**：0.1.0（[固定提交 ca9694b4](https://github.com/All3nCN/dsh-better-sidebar-N23/tree/ca9694b4d232ff47eefec07e395b23eef0766831)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/client.js、src/index.ts、src/tools.ts、src/trust-fence.ts、src/client/chunk-loader.ts、UPSTREAM.md、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离宿主核lib实际行为、拖动帧成本、文件范围与PTY重连/关闭；本轮未运行构建、终端或操作文件。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：重建可追溯src/lib单一产物，并把所有文件副作用绑定规范会话根和显式外部读写能力，可减少版本错认与越范围操作。对源/产物注册、跨工作区/软链和两会话PTY做矩阵；无法一致重建时限制发布承诺。

未来隔离宿主核lib实际行为、拖动帧成本、文件范围与PTY重连/关闭；本轮未运行构建、终端或操作文件。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d4b0b0a9228e26c59c22986af1458a165de7b1432903dc056ddb74152cbe0013。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 508 | — | — | 3034 |
| .js | source | 6 | 63962 | 54830 | 10686 | — |
| .mjs | source | 1 | 143 | 99 | 31 | — |
| .ts | source | 48 | 9125 | 5747 | 2916 | — |
| .tsx | source | 27 | 7036 | 5328 | 1458 | — |
| .mjs | test | 2 | 56 | 46 | 1 | — |

排除 76 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
