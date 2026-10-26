# dsh-harness-chat-control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a6aee9c](https://github.com/1985899182/dsh-harness-chat-control/tree/a6aee9c6107d6e7438a449e31393d6a12fde563f)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)
<!-- END META -->

> **实现功能**：为 DSH 对话提供原生引用胶囊、侧栏追问、原位编辑和侧栏标签批量关闭。

> **核心亮点**：相对手工复制，它把原生注释、用户确认发送、带历史的独立侧栏和 surface 替换放进同一交互，并复用宿主模型、停止与权限 UI。增量主要是会话与界面接线，不是新的模型推理能力；标签批量关闭改善多支线收尾，但不撤销已经发生的工具副作用。 参见[Q03](#research-q03)。

> **风险与缺陷**：最关键前提是“侧栏独立”容易被误解为权限或数据隔离。源码仍复制父历史、cwd 与 options，自然语言边界不能限制工具；多条 Host 路由对目标身份的核验若不一致，知道会话 ID 的请求可能越过预期父子关系。内置 Sidebar 和多个内部 slot 还把兼容性绑定在精确宿主版本。 参见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 引用、侧栏追问和原位编辑解决什么重复任务？](#detail-section-11)
  - [Q02 · 当前版本如何把引用、侧会话与宿主会话能力接起来？](#detail-section-12)
  - [Q03 · dsh-harness-chat-control 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 上下文继承、身份校验和内部接口耦合会怎样削弱价值？](#detail-section-14)
  - [Q05 · dsh-harness-chat-control 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 减少复制操作是否足以抵消侧会话上下文和维护成本？](#detail-section-16)
  - [Q07 · 失败封闭、意图绑定和资源清理是否可靠？](#detail-section-17)
  - [Q08 · 怎样用能力句柄和显式继承选择降低误操作风险？](#detail-section-18)
  - [Q09 · dsh-harness-chat-control 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH Desktop 长对话里频繁引用局部回答、另开支线追问或修正已发问题的用户。输入是选中文本、整条回答或待编辑消息；合格结果是引用仍为可删除胶囊、侧栏标签互不串线、发送由用户确认、编辑只改变目标可见分支。简单替代是复制文本到主对话或新会话，但要人工补上下文并管理窗口。

参见[Q01](#research-q01)。

基线是复制文本到主对话或新会话并手工补上下文；它更透明但操作多，且没有原生胶囊、分支 surface 与批量标签管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主对话引用 | 把片段或整回答加入原生注释胶囊 | 插入失败不降级为普通标记 |
| 侧栏追问 | 创建带父历史的独立侧会话 | 继承上下文与权限，不是沙箱 |
| 原位编辑 | 在同会话 surface 替换可见分支 | 不删除历史事件或撤销副作用 |
| 标签批量关闭 | 关闭左侧、右侧或其他侧栏标签 | 只清界面实例 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Desktop 0.12.1 / Harness 0.2.1-rc.2 | 必需 | 提供内部 slot、会话和路由服务 | 版本漂移可能导致入口或状态链失效 |
| Better Sidebar 0.28.0 内置实现 | 必需 | 提供侧栏布局与转录 | 内置版本需随宿主升级复核 |
| 模型、权限与父会话历史 | 特定操作必需 | 完成侧栏追问并继承上下文 | 缺失时只能保留引用或空会话 |
| 用户核对目标与继承范围 | 效果必需 | 避免错标签和敏感历史扩散 | 插件未提供硬权限隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 退出 Desktop，固定版本安装并重启 | 引用与侧栏入口出现；否则核 profile 与 bundle |
| 引用 | 用户选片段或整回答，选择主对话或侧栏 | 胶囊可见且可删除，未确认前不发送 |
| 追问/编辑 | 选择模型后发送，或编辑原消息重发 | 响应落到目标标签/分支；错目标立即停止 |
| 收尾 | 检查副作用后关闭单个或批量标签 | 标签清理不等于撤销工具动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 固定宿主、Sidebar 和多 peer 依赖；金额未知 | 安装、重启并核 slot/路由；耗时未知 | 精确兼容范围窄 |
| 持续使用 | 继承历史 token、模型与工具调用；金额未知 | 管理引用、模型和多个标签 | 只选片段仍可能携带父历史 |
| 失败恢复 | 外部工具副作用可能已发生 | 核对会话、surface、注册恢复并人工补救 | 关闭标签不能回滚副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少复制与找消息 | 原生胶囊和主/侧入口已接线 | 未测端到端节时 |
| 并行支线阅读 | 多实例侧栏与批量标签关闭可见 | 不等于权限或数据隔离 |
| 原位修正 | surface 替换保留来源链 | 并发同文消息错配率未知 |

> **思考**：最关键前提是“侧栏独立”容易被误解为权限或数据隔离。源码仍复制父历史、cwd 与 options，自然语言边界不能限制工具；多条 Host 路由对目标身份的核验若不一致，知道会话 ID 的请求可能越过预期父子关系。内置 Sidebar 和多个内部 slot 还把兼容性绑定在精确宿主版本。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工复制，它把原生注释、用户确认发送、带历史的独立侧栏和 surface 替换放进同一交互，并复用宿主模型、停止与权限 UI。增量主要是会话与界面接线，不是新的模型推理能力；标签批量关闭改善多支线收尾，但不撤销已经发生的工具副作用。 参见[Q03](#research-q03)。

相对手工复制，它把原生注释、用户确认发送、带历史的独立侧栏和 surface 替换放进同一交互，并复用宿主模型、停止与权限 UI。增量主要是会话与界面接线，不是新的模型推理能力；标签批量关闭改善多支线收尾，但不撤销已经发生的工具副作用。 参见[Q03](#research-q03)。

Host 在路由注册失败时逐项清理，客户端 wrapper 只在仍由自己持有时恢复，体现了失败封闭。编辑链会校验 seq/文本并重算 surfaceRange，但关联仍缺贯穿 UI 意图与发送的 nonce；共享 definition.multiple 与内置私有实现增加升级维护面。可借鉴的是引用插入失败不降级成污染正文的 token，以及先建空侧会话、等用户确认再发送。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键前提是“侧栏独立”容易被误解为权限或数据隔离。源码仍复制父历史、cwd 与 options，自然语言边界不能限制工具；多条 Host 路由对目标身份的核验若不一致，知道会话 ID 的请求可能越过预期父子关系。内置 Sidebar 和多个内部 slot 还把兼容性绑定在精确宿主版本。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。长对话引用价值明确，但应先在无敏感工具的固定版本环境核对所有路由的父子身份、继承范围与编辑并发；若出现错目标、继承内容超预期或宿主升级后 slot 失配就停止。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已支持引用胶囊、侧会话路由、原位编辑和标签管理的接线判断；父子会话身份一致性、继承 token 与错编辑恢复尚未在 Desktop/Harness 实测，能力句柄假设仍待证伪，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、package、Host/Client 关键路由、引用、编辑、Sidebar 接线与清理分支；不做全量 vendored Sidebar 审计。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：用两个父会话、三个侧栏标签和同文消息构造交叉矩阵，逐项记录路由拒绝、引用完整率、token、错目标、标签清理与工具副作用；任一跨父请求被接受或错编辑即否定安全采用。

**分析版本**

- **仓库**：[1985899182/dsh-harness-chat-control](https://github.com/1985899182/dsh-harness-chat-control)
- **版本号**：0.3.5（[固定提交 a6aee9c](https://github.com/1985899182/dsh-harness-chat-control/tree/a6aee9c6107d6e7438a449e31393d6a12fde563f)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索给每个父子会话发放带父 ID、能力范围和过期时间的句柄，同时让用户显式选择继承“片段／本轮／全部历史”；编辑再携带意图 nonce 与预期 surface 版本。它可能同时降低越界请求、上下文泄露和错编辑，但会增加一次选择和兼容层。 参见[Q08](#research-q08)。

用两个父会话、三个侧栏标签和同文消息构造交叉矩阵，逐项记录路由拒绝、引用完整率、token、错目标、标签清理与工具副作用；任一跨父请求被接受或错编辑即否定安全采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 6377 | 5168 | 1024 | — |
| .md | source | 5 | 477 | — | — | 7121 |
| .mjs | source | 2 | 1373 | 1251 | 71 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control/issues?q=is%3Aissue+created%3A2026-09-22T16%3A02%3A08.519Z..2026-10-22T16%3A02%3A08.519Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A02%3A08.519Z..2026-10-22T16%3A02%3A08.519Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 a6aee9c6107d6e7438a449e31393d6a12fde563f 上判断 dsh-harness-chat-control 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 引用、侧栏追问和原位编辑解决什么重复任务？

**研究主题**：场景与需求

#### 完整回答

面向在 DSH Desktop 长对话里频繁引用局部回答、另开支线追问或修正已发问题的用户。输入是选中文本、整条回答或待编辑消息；合格结果是引用仍为可删除胶囊、侧栏标签互不串线、发送由用户确认、编辑只改变目标可见分支。简单替代是复制文本到主对话或新会话，但要人工补上下文并管理窗口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前版本如何把引用、侧会话与宿主会话能力接起来？

**研究主题**：功能与机制

#### 完整回答

客户端在回答动作、输入 dock、侧栏入口、标签菜单和 overlay 注册界面；Host 注册侧会话创建、历史、模型、发送/取消和编辑路由。创建侧会话会复制父会话历史与配置，首轮把引用边界作为注入内容，再由用户问题触发 follow-up。当前版本内置 Better Sidebar 0.28.0，并增加左右/其他标签批量关闭。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1469-1472](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/index.js#L1469-L1472)

Host 入口取得服务并注册路由。

```text
export function apply(ctx) {
  const registerRoute = () => {
    const webServer = ctx?.webServer || getService(ctx, 'webServer')
    if (typeof webServer?.register !== 'function') {
```

**依据 2 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-harness-chat-control 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工复制，它把原生注释、用户确认发送、带历史的独立侧栏和 surface 替换放进同一交互，并复用宿主模型、停止与权限 UI。增量主要是会话与界面接线，不是新的模型推理能力；标签批量关闭改善多支线收尾，但不撤销已经发生的工具副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1469-1472](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/index.js#L1469-L1472)

Host 入口取得服务并注册路由。

```text
export function apply(ctx) {
  const registerRoute = () => {
    const webServer = ctx?.webServer || getService(ctx, 'webServer')
    if (typeof webServer?.register !== 'function') {
```

**依据 2 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 上下文继承、身份校验和内部接口耦合会怎样削弱价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键前提是“侧栏独立”容易被误解为权限或数据隔离。源码仍复制父历史、cwd 与 options，自然语言边界不能限制工具；多条 Host 路由对目标身份的核验若不一致，知道会话 ID 的请求可能越过预期父子关系。内置 Sidebar 和多个内部 slot 还把兼容性绑定在精确宿主版本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

#### 缺口

- 所有侧会话路由是否在真实 Host 中执行一致的父子身份与授权校验
  **影响**：若不一致，侧栏的独立展示不能支撑安全隔离或可信编辑
  **进一步探讨**：在两个父会话与三个侧栏标签间交叉使用创建、history、model、prompt、cancel 和 edit，记录错误 ID、跨父 ID 与并发编辑的拒绝矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-harness-chat-control 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 DSH Desktop 0.12.1、Harness 0.2.1-rc.2、固定 Sidebar 0.28.0、多项客户端服务与重启；使用价值依赖用户理解继承范围、宿主授权和模型选择。失败恢复要检查错标签、目标会话、编辑 surface 及共享注册恢复，关闭标签只能清 UI，不能回滚外部动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1469-1472](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/index.js#L1469-L1472)

Host 入口取得服务并注册路由。

```text
export function apply(ctx) {
  const registerRoute = () => {
    const webServer = ctx?.webServer || getService(ctx, 'webServer')
    if (typeof webServer?.register !== 'function') {
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 减少复制操作是否足以抵消侧会话上下文和维护成本？

**研究主题**：效果与总成本

#### 完整回答

合格任务可定义为一次引用追问落到正确会话且无串线。首次要固定 Desktop/Harness/Sidebar 并核对 slot；持续成本包括继承历史的 token、并行侧会话模型调用和标签管理；失败恢复要核对主侧会话、已发生工具动作及编辑目标。源码没有同任务复制基线的耗时、token 或错误率对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

**依据 2 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

#### 缺口

- 同长度对话下复制基线与插件路径的端到端耗时、继承 token、错目标率和人工恢复时间
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：固定十组引用任务，分别走手工复制与插件路径，统计正确会话完成率、总 token、点击数、恢复分钟数和已发生副作用

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 失败封闭、意图绑定和资源清理是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

Host 在路由注册失败时逐项清理，客户端 wrapper 只在仍由自己持有时恢复，体现了失败封闭。编辑链会校验 seq/文本并重算 surfaceRange，但关联仍缺贯穿 UI 意图与发送的 nonce；共享 definition.multiple 与内置私有实现增加升级维护面。可借鉴的是引用插入失败不降级成污染正文的 token，以及先建空侧会话、等用户确认再发送。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1469-1472](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/index.js#L1469-L1472)

Host 入口取得服务并注册路由。

```text
export function apply(ctx) {
  const registerRoute = () => {
    const webServer = ctx?.webServer || getService(ctx, 'webServer')
    if (typeof webServer?.register !== 'function') {
```

**依据 2 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样用能力句柄和显式继承选择降低误操作风险？

**研究主题**：新假设与验证

#### 完整回答

可探索给每个父子会话发放带父 ID、能力范围和过期时间的句柄，同时让用户显式选择继承“片段／本轮／全部历史”；编辑再携带意图 nonce 与预期 surface 版本。它可能同时降低越界请求、上下文泄露和错编辑，但会增加一次选择和兼容层。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

**依据 2 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

#### 缺口

- 能力句柄、分级历史继承和编辑 nonce 的组合是否值得额外交互
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：做只含片段/本轮/全部历史三档的原型，要求跨父会话请求全部拒绝、错编辑为零，且中位操作时间不比现状增加 20%

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-harness-chat-control 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。长对话引用价值明确，但应先在无敏感工具的固定版本环境核对所有路由的父子身份、继承范围与编辑并发；若出现错目标、继承内容超预期或宿主升级后 slot 失配就停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/README.md#L26-L29)

作者列出引用、侧栏、编辑与停止能力。

```text
## 功能

- **主对话引用**：引用整条回答或选中的片段；不会把 Markdown 标记（如 `>`、`---`）污染到正文。
- **原生注释胶囊**：引用在输入框中显示为 `1 条注释` 胶囊，用户可先编辑问题、移除引用，再决定是否发送。
```

**依据 2 · 源码核查**：[lib/client.js:3139-3142](https://github.com/1985899182/dsh-harness-chat-control/blob/a6aee9c6107d6e7438a449e31393d6a12fde563f/lib/client.js#L3139-L3142)

客户端注册侧栏标签菜单等界面入口。

```text
     * `sidebar.right.tab.menu.item` list, so these batch entries land right
     * below it.  The slot receives no ordered tab list, so the strip's DOM is
     * the source of truth: `data-dockkit-tab` elements sit in the order the
     * user sees, which is exactly what "left" and "right" mean here.
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
