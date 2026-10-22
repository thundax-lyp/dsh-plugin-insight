# dock-git

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[961c203](https://github.com/AKS1st/dock-git/tree/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-git) [![npm 30d 849](https://img.shields.io/static/v1?label=npm+30d&message=849&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-git) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-git)
<!-- END META -->

> **实现功能**：把Git图谱、差异与仓库写操作接入Dock。

> **核心亮点**：把图谱、差异与受控参数的仓库操作组织进会话工作台，移除GIT_DIR/GIT_WORK_TREE避免环境改指仓库，读输出有部分容量限制。没有新版本控制协议。

> **风险与缺陷**：buildCommitArgs明确--no-verify，merge也跳过验证，可能绕过团队期待的提交钩子；这与终端默认提交不等价。runGit没有通用超时且stderr累计不设同等上限，远端卡住与异常输出需验；argv隔离不等于Git hooks/凭据副作用被隔离。

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

> **用途**：在聊天旁查看会话仓库并执行暂存、提交和分支操作。

参照Git CLI与图形Git客户端；本项目的增量是Dock仓库视图与固定参数操作接线，Git算法和传输归系统git。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：Git图谱、差异和操作视图
- **Host 路由**：/wb-git读写仓库操作

**流程与依赖**

主机/wb-git解析会话仓库并校验路径/ref，git-ops直接spawn git argv；客户端注册侧栏和编辑视图。

Dock workbench、宿主sessions/webServer/webRuntime及PATH中的Git；远端凭据和网络另需。

解析仓库→读取状态/日志/差异→用户选操作→调用git→刷新视图；commit/push/reset均是真实副作用。

**效果与成本**

需维护Git版本/输出解析及远端凭据，网络与大仓库查询有延迟；无插件自有模型调用。

可减少上下文切换，但无操作错误率或提交效率数据。

> **思考**：buildCommitArgs明确--no-verify，merge也跳过验证，可能绕过团队期待的提交钩子；这与终端默认提交不等价。runGit没有通用超时且stderr累计不设同等上限，远端卡住与异常输出需验；argv隔离不等于Git hooks/凭据副作用被隔离。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把图谱、差异与受控参数的仓库操作组织进会话工作台，移除GIT_DIR/GIT_WORK_TREE避免环境改指仓库，读输出有部分容量限制。没有新版本控制协议。

把图谱、差异与受控参数的仓库操作组织进会话工作台，移除GIT_DIR/GIT_WORK_TREE避免环境改指仓库，读输出有部分容量限制。没有新版本控制协议。

直接argv、环境去重定向与固定分隔符解析可复用；部分stdout上限不是完整进程资源治理。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts)、[src/git-ops.ts](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/client/index.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

buildCommitArgs明确--no-verify，merge也跳过验证，可能绕过团队期待的提交钩子；这与终端默认提交不等价。runGit没有通用超时且stderr累计不设同等上限，远端卡住与异常输出需验；argv隔离不等于Git hooks/凭据副作用被隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在临时仓库核对hook与破坏操作，重要仓库保留团队既有检查。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AKS1st/dock-git](https://github.com/AKS1st/dock-git)
- **版本号**：0.3.4（[固定提交 961c203d](https://github.com/AKS1st/dock-git/tree/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/git-ops.ts、src/client/index.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：隔离仓库核钩子行为、超时取消、输出上限和破坏操作确认；不向真实远端写入。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：把操作将跳过哪些钩子、待影响ref与破坏性变更摘要列入确认，并支持默认遵守钩子，可减少流程偏差。以失败hook、远端卡住、hard reset样例测误接受和恢复耗时。

隔离仓库核钩子行为、超时取消、输出上限和破坏操作确认；不向真实远端写入。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c4eecf3288dd34f73f00bc0c89cfc872ed36931613b61850efcbd9dd8f17edd2。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 6046 | 5381 | 656 | — |
| .md | source | 2 | 132 | — | — | 1485 |
| .mjs | source | 6 | 2405 | 2107 | 218 | — |
| .tsx | source | 5 | 2539 | 2105 | 270 | — |
| .ts | source | 13 | 4600 | 3290 | 1027 | — |

排除 18 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-git/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-git/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-git/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
