# BrowserSkill 浏览器连接工具

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[1b395fd](https://github.com/Tencent/BrowserSkill/tree/1b395fd07a047e378840285c25c4a24716aee19f)

<!-- BEGIN META -->
[![GitHub ★ 9,857](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C857&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill)
<!-- END META -->

> **功能**：通过 bsk CLI、daemon 和浏览器扩展，让 Agent 操作已有登录态的 Chrome 或 Edge。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明根工具把登录态、可见窗口和跨宿主 CLI 接到浏览器；未测净节时和业务正确性。

> **主要限制**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示停止不会回滚网页动作，本地来源检查不绑定具体扩展身份，且登录态和保存副本有各自边界。

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
  - [Q01 · BrowserSkill 根工具面向谁，与现有办法相比增加什么？](#detail-section-11)
  - [Q02 · 根 CLI、daemon 和浏览器扩展如何接线？](#detail-section-12)
  - [Q03 · 取消和停止是否撤销网页效果？](#detail-section-13)
  - [Q04 · 连接、登录态和保存数据的信任边界是什么？](#detail-section-14)
  - [Q05 · 什么条件下试用，成本和退出方式是什么？](#detail-section-15)
  - [Q06 · 限制本地允许的扩展身份是否值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要使用既有网页登录态，并能观察和核对动作的 Agent 用户。

人工浏览器、网站 API 和独立自动化脚本均可完成网页任务；复用现有 profile 与人机接管形成额外组织方式，但并非账户隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| CLI 与 daemon | 为多个 Agent 路由浏览器任务 | 需要对应版本和浏览器扩展 |
| 代理窗口 | 操作现有登录态并支持人工接管 | 不隔离账户，不撤销网页副作用 |
| 历史与视频 | 保存或检查任务证据 | 内容可能敏感，导出副本需另管 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Chromium 浏览器与扩展 | 必需 | 操作所选 profile | 无法控制浏览器 |
| 匹配 CLI 和 daemon | 必需 | 命令、会话与路由 | 无法接入或协议不匹配 |
| 可调用 shell 的 Agent | 使用 Agent 时必需 | 发出浏览器任务 | 无模型入口 |
| 网站权限和用户授权 | 登录任务必需 | 浏览与操作 | 不可访问或不应继续 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查测试账号、扩展和版本 | 保留人工接管 |
| 执行 | Agent 使用独立窗口执行只读任务 | 用户检查回执与网页 |
| 完成 | 停止会话并核对网站状态 | 中断时不盲目重放 |
| 清理 | 用户处理历史和导出文件 | 按实际保存位置确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 多组件资源及网站费用未知 | 配对、版本与账号核对 | doctor 不证明 Skill 已载入 |
| 使用 | 模型和网络开销未知 | 观察网页和授权动作 | 收益未对照 |
| 故障 | 重试或外部操作可能产生费用 | 检查实际网页状态 | 取消不保证撤销 |
| 退出 | 已保存文件和远端副本需管理 | 停止会话并检查保留 | 导出文件不自动删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连接 | 作者架构与根 daemon/扩展代表路径 | 目标宿主和浏览器可运行 |
| 控制 | 有窗口、回执和人工接管设计 | 网页任务正确率与净节时 |
| 数据保护 | 有来源格式、远程配置和保留说明 | 本机认证与全面脱敏 |

> **思考**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示停止不会回滚网页动作，本地来源检查不绑定具体扩展身份，且登录态和保存副本有各自边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明根工具把登录态、可见窗口和跨宿主 CLI 接到浏览器；未测净节时和业务正确性。

[Q02](#research-q02) 将宿主无关 CLI、daemon 和扩展分层，[Q03](#research-q03) 的会话队列区分未派发任务取消与扩展已接收请求；操作是否生效须回读。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 与 [Q04](#research-q04) 显示停止不会回滚网页动作，本地来源检查不绑定具体扩展身份，且登录态和保存副本有各自边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在测试账号先做只读任务，确认组件版本和回执；状态不明时停止并人工核对网页及已保存副本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码和作者文档支持代表性路径与边界；未执行浏览器、DSH、远程连接或威胁实验。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、package.json、docs/architecture.md、apps/extension/src/browser-driver/command-deadline.ts、crates/bsk-cli/src/daemon/ws.rs、crates/bsk-cli/src/daemon/remote/mod.rs、crates/bsk-cli/src/daemon/ipc.rs、crates/bsk-cli/src/daemon/queue.rs、apps/extension/src/tools/dispatcher.ts、crates/bsk-cli/skill/references/step-and-cache.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查根 README、架构、daemon IPC 与队列、本地来源检查、远程 URL 条件和扩展取消路径；未全面审计 Rust、浏览器扩展、所有命令或攻击面。inventory 仅统计 Markdown 与指定 JS/TS，Rust 不纳入代码规模。
- 下一步：固定浏览器、daemon、Agent 与测试账号，在隔离网站测试只读操作、取消、人工接管、记录删除和多组件升级；[Q06](#research-q06) 的身份绑定需另做伪造连接与误拒对照。

**分析版本**

- **仓库**：[Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)
- **版本号**：未声明（[固定提交 1b395fd](https://github.com/Tencent/BrowserSkill/tree/1b395fd07a047e378840285c25c4a24716aee19f)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 探索可撤销的本地连接方身份绑定；不能只 pin 可伪造的 Origin，安全收益、兼容及操作负担尚未测试。

固定浏览器、daemon、Agent 与测试账号，在隔离网站测试只读操作、取消、人工接管、记录删除和多组件升级；[Q06](#research-q06) 的身份绑定需另做伪造连接与误拒对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 8076 | — | — | 87443 |
| .ts | test | 243 | 88410 | 82832 | 2077 | — |
| .ts | source | 285 | 67830 | 59996 | 4418 | — |
| .tsx | test | 26 | 6088 | 5545 | 96 | — |
| .tsx | source | 44 | 9403 | 8928 | 133 | — |
| .md | example | 3 | 645 | — | — | 5426 |
| .mjs | source | 44 | 7718 | 7226 | 236 | — |
| .mjs | example | 8 | 202 | 191 | 0 | — |
| .mjs | test | 8 | 1016 | 953 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 59](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=59&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 46](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=46&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 BrowserSkill 根 CLI、daemon 与扩展的路径、数据边界及采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · BrowserSkill 根工具面向谁，与现有办法相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

BrowserSkill 根项目面向需要 Agent 操作既有登录浏览器的用户；合格结果是用户可检查页面动作、必要时接手，并核对网站最终状态。根目录 package.json 是 private 工作区，根产品由 Rust bsk CLI/daemon、Chromium 扩展和多宿主 Skill 构成，DSH 是作者列出的可选入口之一。人工浏览器、网站 API 和独立自动化脚本是基线；复用 profile 与可见窗口组织是具体增量，但不证明减少人工、业务准确性或账号隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:30-31](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L30-L31)

作者描述复用登录态与代理窗口。

```text

**BrowserSkill 把你的 AI Agent 连接到 Chrome 或 Microsoft Edge，直接使用你已有的登录状态。** 交给它读取、点击、填表或排查问题。任务在独立、可见的 **Agent Window（代理窗口）** 中运行，需要时由你接手；也可以显式借用已有标签页，任务结束后归还。
```

**依据 2 · 作者声明**：[README.zh-CN.md:64-78](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L64-L78)

作者说明跨宿主 CLI 及任务能力。

<details>
<summary>查看原文（15行）</summary>

```text
这些 Agent，以及其他能调用 Shell 的 Agent，都可以通过同一套 **`bsk` CLI** 使用。**[DeepSeek Harness](#deepseek-harness-插件)** 还提供专用插件，直接使用浏览器工具并查看任务预览。Agent 和模型由你选择，BrowserSkill 负责连接浏览器。

## 能做什么

| 你想完成的事 | BrowserSkill 如何帮忙 |
| --- | --- |
| **用已有账号，做网站任务** | 复用浏览器登录态，读取文档、搜索内部网站，完成需要登录的网页流程。 |
| **一句指令，落实到操作** | 读取页面文本和控件，点击、输入、填写表单、拖拽元素、选择范围、管理标签页；截取可见区域或完整页面，在本地模式上传和下载文件。 |
| **Agent 操作，你来掌控** | 共享控制让你与 Agent 协作；编辑时暂停 Agent，让它核对你的改动后继续。任务在独立窗口中可见运行，也可显式借用已有标签页。 |
| **网页表格，导出即用** | 将已加载的表格和列表导出为 JSON/CSV，保留列名、页面/frame 来源、合并单元格信息和完整性标记。[结构化提取](docs/structured-extraction.md) |
| **操作出错，找到线索** | 关联操作、请求、响应正文、控制台和页面变化，检查性能、慢接口与疑似重复请求；用明确配置的 HTTP 规则或请求重放验证判断。[网站调试](docs/website-debugging.md) |
| **录下过程，随时回看** | 将一个已授权的任务标签页录制为无声 MP4，在扩展中预览、保存或删除。[任务视频录制](docs/video-recording.md) |
| **页面就绪，再做下一步** | 设置明确的超时，等待目标元素满足指定条件后再继续操作。[元素等待](docs/wait-for-element.md) |
| **已经观察，按需复用** | 用 `step` 执行一个已决定的动作并同步状态；明确保存完整观察结果，再用 `view` 搜索或分段阅读，无需重新采集页面。[步骤与观察结果保存](crates/bsk-cli/skill/references/step-and-cache.md) |
| **浏览器与账号，选对再开工** | 为浏览器实例命名，让任务绑定指定 Profile；也可以让服务器上的 Agent 连接你电脑上的浏览器。[浏览器 Profile](docs/browser-profiles.md) |
```

</details>

**依据 3 · 源码核查**：[package.json:1-4](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/package.json#L1-L4)

根 package 是私有工作区。

```text
{
  "name": "browser-skill",
  "private": true,
  "packageManager": "pnpm@10.17.0",
```

#### 缺口

- 用户需求频率和同任务成功率未经对照
  **影响**：不能推断节省时间或比其他自动化更可靠
  **进一步探讨**：固定网页、账户和任务，比较人工与 CLI/插件并核对最终状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根 CLI、daemon 和浏览器扩展如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

作者架构说明 Agent 调用 bsk CLI，经本机 IPC 到 daemon，再以 WebSocket 路由至扩展，扩展调用浏览器驱动并返回；远程模式则扩展经鉴权 WSS 连接服务器 daemon，CLI 到 daemon 仍在服务器本地。固定源码中 daemon 的 IPC 路由区分 session start/stop 与多种 tool 方法，会话队列向拥有该会话的扩展按序转发请求；扩展 dispatcher 接受取消帧并通过 AbortController 请求停止。根项目可由 shell 型 Agent 使用，不依赖 DSH。以上为作者架构与根源码的代表性静态链，未核查每个 CLI 参数、全部扩展命令或运行浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[docs/architecture.md:8-28](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/docs/architecture.md#L8-L28)

作者绘制本地与远程组件关系。

<details>
<summary>查看原文（21行）</summary>

````text
The diagram shows the default local setup. In [remote mode](remote-extension-connection.md),
the CLI and daemon run on a server; the extension connects from the user's browser
over authenticated WSS. CLI-to-daemon communication remains local IPC on the server.

```mermaid
flowchart TB
  subgraph harness [Agent harness]
    Agent[Claude Code / Cursor / Codex]
  end

  subgraph host [Developer machine]
  Agent -->|shell: bsk ...| CLI[bsk CLI]
  CLI <-->|JSON Lines / UDS| Daemon[bsk daemon]
  Daemon <-->|WebSocket JSON| Ext[bsk extension MV3]
  end

  subgraph browser [Chromium]
  Ext -->|CDP + WebExt| Tabs[User tabs + Agent Windows]
  end

  Skill[SKILL.md] -.->|documents workflow| Agent
````

</details>

**依据 2 · 作者声明**：[docs/architecture.md:87-103](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/docs/architecture.md#L87-L103)

作者描述命令、daemon、扩展与响应链。

<details>
<summary>查看原文（17行）</summary>

```text
## Typical tool call

1. Agent runs `bsk click @e1 --tab-id 42 --session ab12`.
2. CLI ensures daemon is running, opens UDS, sends one JSON request line.
3. Daemon resolves session `ab12` → browser client → forwards `tool.click` over WS.
4. Extension dispatcher validates sandbox rules, invokes CDP via `BrowserDriver`.
5. Response travels CLI ← daemon ← extension; CLI prints result and exits.

The [scroll-to primitive reference](scroll-to.md) documents `tool.scroll_to`,
including its CLI/plugin mappings, visible-bounds contract and cancellation
behavior. It follows the same routing path and is classified as a browser
mutation for session queueing and user-interruption gating.

Structured extraction follows the same routing path as a passive read. The
extension gathers bounded DOM facts and normalizes tables/lists; the CLI owns
CSV encoding and file output. Discovery handles are scoped to session, tab,
attachment and frame document. See [structured extraction](structured-extraction.md).
```

</details>

**依据 3 · 源码核查**：[crates/bsk-cli/src/daemon/ipc.rs:234-255](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ipc.rs#L234-L255)

daemon IPC 分派会话启动和停止。

<details>
<summary>查看原文（22行）</summary>

```text
            let body = match method {
                Method::SystemPing => {
                    let result = PingResult { pong: true };
                    ResponseBody::Ok(serde_json::to_value(result).unwrap_or(Value::Null))
                }
                Method::SystemStatus => match handle_status(&status, &state, params).await {
                    Ok(v) => ResponseBody::Ok(v),
                    Err(e) => ResponseBody::Err(e),
                },
                Method::SessionStartTracked => {
                    super::session_requests::start(&state, rpc_id, params).await
                }
                Method::SessionRequest => super::session_requests::operate(&state, params).await,
                Method::SessionStart => {
                    match handle_session_start(&state, rpc_id, params, false).await {
                        Ok(v) => ResponseBody::Ok(v),
                        Err(e) => ResponseBody::Err(e),
                    }
                }
                Method::SessionStop => match handle_session_stop(&state, rpc_id, params).await {
                    Ok(v) => ResponseBody::Ok(v),
                    Err(e) => ResponseBody::Err(e),
```

</details>

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/ipc.rs:270-305](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ipc.rs#L270-L305)

daemon IPC 列举工具方法。

<details>
<summary>查看原文（36行）</summary>

```text
                Method::TransferRelease => handle_transfer_release(&state, params),
                Method::ToolVideo => handle_video(&state, rpc_id, params).await,
                Method::ToolTabList
                | Method::ToolTabCreate
                | Method::ToolTabClose
                | Method::ToolTabSelect
                | Method::ToolTabBorrow
                | Method::ToolTabReturn
                | Method::ToolWindowResize
                | Method::ToolEmulate
                | Method::ToolScreenshot
                | Method::ToolScreenshotFullPage
                | Method::ToolScreenshotRead
                | Method::ToolScreenshotRelease
                | Method::ToolConsole
                | Method::ToolDebug
                | Method::ToolNetwork
                | Method::ToolSnapshot
                | Method::ToolObserve
                | Method::ToolCooperate
                | Method::ToolGetHtml
                | Method::ToolExtract
                | Method::ToolNavigate
                | Method::ToolNavigateBack
                | Method::ToolNavigateForward
                | Method::ToolReload
                | Method::ToolClick
                | Method::ToolHover
                | Method::ToolDrag
                | Method::ToolWheel
                | Method::ToolScrollTo
                | Method::ToolFocus
                | Method::ToolBlur
                | Method::ToolFill
                | Method::ToolPress
                | Method::ToolSelect
```

</details>

**依据 5 · 源码核查**：[crates/bsk-cli/src/daemon/queue.rs:1-21](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/queue.rs#L1-L21)

会话队列按序向所属扩展转发。

<details>
<summary>查看原文（21行）</summary>

```text
//! Per-session serial dispatch queue for `tool.*` RPCs (design §5,
//! plan M6.5).
//!
//! Every active session owns one [`SessionQueue`] backed by an
//! `mpsc::channel(QUEUE_CAPACITY)` and a worker task. The worker pulls
//! one job at a time, forwards it to the owning extension over WS,
//! awaits the response, and only then handles the next job. This keeps
//! the extension-side ref-store / debugger session from racing under
//! concurrent agent tool calls.
//!
//! Lifecycle:
//! * [`ToolQueueRegistry::spawn`] is called from `start_session`
//!   after the daemon and extension agree on a fresh session id.
//! * [`ToolQueueRegistry::remove`] is called from `stop_session` /
//!   `purge_browser` / `forget_session`. Dropping the sender closes
//!   the channel and the worker exits cleanly.
//! * Cancel is wired through
//!   [`super::inflight::ToolInflightRegistry::cancel_session`] (see
//!   the "Session-wide cancel and queued jobs" section below); the
//!   worker's pre-flight check in `forward_one` short-circuits any
//!   already-cancelled job without a WS round-trip.
```

</details>

**依据 6 · 源码核查**：[apps/extension/src/tools/dispatcher.ts:333-364](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/apps/extension/src/tools/dispatcher.ts#L333-L364)

扩展按 RPC ID 处理取消并回复。

<details>
<summary>查看原文（32行）</summary>

```text
  private async dispatch(msg: ProtocolFrame): Promise<void> {
    if (!isRequestFrame(msg)) return;
    const req = msg as RequestFrame;

    // Cancel frames take a fast path: trip the matching controller
    // (if any), reply with `{cancelled}` so the daemon can answer
    // its own peer, and skip the regular tool dispatch.
    if (req.method === "cancel") {
      const params = (req.params as { rpc_id?: string } | undefined) ?? {};
      const target = typeof params.rpc_id === "string" ? params.rpc_id : "";
      const ac = target ? this.inflightAbortControllers.get(target) : undefined;
      if (ac) {
        const active = [...this.activeDialogOperations.values()].find(
          (item) => item.request.id === target,
        );
        try {
          ac.abort();
        } catch (err) {
          console.warn("[bsk dispatcher] AbortController.abort() threw", err);
        }
        if (active) this.dismissOperationDialogs(active.request);
      }
      const reply: ResponseFrame = {
        id: req.id,
        result: { cancelled: ac !== undefined },
      };
      try {
        this.transport.send(reply);
      } catch (sendErr) {
        console.warn("[bsk dispatcher] failed to ack cancel", sendErr);
      }
      return;
```

</details>

#### 缺口

- 没有固定版本浏览器、daemon 与 DSH 宿主运行证据
  **影响**：架构与源码不证明多组件成功接通
  **进一步探讨**：隔离测试会话，记录 CLI、daemon、扩展和宿主版本及一次只读回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消和停止是否撤销网页效果？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

daemon 为每个浏览器会话建立串行队列，取消后尚未派发的任务会在进入扩展前短路；对已转发请求，它等待扩展响应或有限清理超时。扩展 dispatcher 收到 cancel 时触发匹配的 AbortController 并回复是否找到控制器，但这个回执不证明网站的既有副作用被撤销。扩展代码指出已派发的 chrome.debugger 读取无法取消，其超时只结束等待；这条注释只指 renderer 读取，不能推断所有 mutation 的具体语义。根 Skill 建议 step 只执行一次，后续同步或等待失败不能直接重复动作；关闭窗口或停止会话也不能回滚已提交的网站动作。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/daemon/queue.rs:1-31](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/queue.rs#L1-L31)

会话队列与尚未派发任务取消。

<details>
<summary>查看原文（31行）</summary>

```text
//! Per-session serial dispatch queue for `tool.*` RPCs (design §5,
//! plan M6.5).
//!
//! Every active session owns one [`SessionQueue`] backed by an
//! `mpsc::channel(QUEUE_CAPACITY)` and a worker task. The worker pulls
//! one job at a time, forwards it to the owning extension over WS,
//! awaits the response, and only then handles the next job. This keeps
//! the extension-side ref-store / debugger session from racing under
//! concurrent agent tool calls.
//!
//! Lifecycle:
//! * [`ToolQueueRegistry::spawn`] is called from `start_session`
//!   after the daemon and extension agree on a fresh session id.
//! * [`ToolQueueRegistry::remove`] is called from `stop_session` /
//!   `purge_browser` / `forget_session`. Dropping the sender closes
//!   the channel and the worker exits cleanly.
//! * Cancel is wired through
//!   [`super::inflight::ToolInflightRegistry::cancel_session`] (see
//!   the "Session-wide cancel and queued jobs" section below); the
//!   worker's pre-flight check in `forward_one` short-circuits any
//!   already-cancelled job without a WS round-trip.
//!
//! ## Session-wide cancel and queued jobs
//!
//! [`super::inflight::ToolInflightRegistry::cancel_session`] flips the
//! cancel flag on every inflight entry for a session in O(N). Queued
//! [`ToolJob`]s whose `inflight` entry is now cancelled remain in the
//! worker's mpsc channel until pulled, but the worker's pre-flight
//! check in `forward_one` short-circuits them with `UserAborted` (or
//! `Cancelled`, depending on the recorded `CancelReason`) without any
//! WS round-trip. Per-session [`QUEUE_CAPACITY`] is 64 so the worst-case
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/queue.rs:65-84](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/queue.rs#L65-L84)

转发后等待有限清理的边界。

<details>
<summary>查看原文（20行）</summary>

```text
/// Once a forwarded request is cancelled, keep the session queue busy while
/// the extension finishes handler-side compensation. This is deliberately
/// bounded so a wedged extension cannot pin the session forever.
pub const CANCEL_CLEANUP_TIMEOUT: Duration = Duration::from_secs(2);

/// Job submitted into a session queue. Carries everything the worker
/// needs to forward one RPC and one oneshot to deliver the answer.
pub struct ToolJob {
    pub method: Method,
    pub params: Value,
    pub timeout: Duration,
    pub respond: oneshot::Sender<Result<Value, RpcError>>,
    /// Inflight handle pre-registered by the IPC handler before the
    /// job entered the queue (review C2). Holds the cancel token plus
    /// the queued/forwarded state machine; the worker checks it on
    /// pre-flight (so a cancel arriving while the job was still
    /// queued short-circuits without ever touching the extension)
    /// and observes `cancel.cancelled()` while awaiting the WS response.
    /// A forwarded cancel keeps the worker busy until the extension's
    /// final response arrives or the bounded cleanup timeout expires.
```

</details>

**依据 3 · 源码核查**：[apps/extension/src/tools/dispatcher.ts:333-364](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/apps/extension/src/tools/dispatcher.ts#L333-L364)

扩展取消只表示已找到匹配控制器。

<details>
<summary>查看原文（32行）</summary>

```text
  private async dispatch(msg: ProtocolFrame): Promise<void> {
    if (!isRequestFrame(msg)) return;
    const req = msg as RequestFrame;

    // Cancel frames take a fast path: trip the matching controller
    // (if any), reply with `{cancelled}` so the daemon can answer
    // its own peer, and skip the regular tool dispatch.
    if (req.method === "cancel") {
      const params = (req.params as { rpc_id?: string } | undefined) ?? {};
      const target = typeof params.rpc_id === "string" ? params.rpc_id : "";
      const ac = target ? this.inflightAbortControllers.get(target) : undefined;
      if (ac) {
        const active = [...this.activeDialogOperations.values()].find(
          (item) => item.request.id === target,
        );
        try {
          ac.abort();
        } catch (err) {
          console.warn("[bsk dispatcher] AbortController.abort() threw", err);
        }
        if (active) this.dismissOperationDialogs(active.request);
      }
      const reply: ResponseFrame = {
        id: req.id,
        result: { cancelled: ac !== undefined },
      };
      try {
        this.transport.send(reply);
      } catch (sendErr) {
        console.warn("[bsk dispatcher] failed to ack cancel", sendErr);
      }
      return;
```

</details>

**依据 4 · 源码核查**：[apps/extension/src/browser-driver/command-deadline.ts:1-9](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/apps/extension/src/browser-driver/command-deadline.ts#L1-L9)

已派发 renderer 读取不能取消。

```text
import type { RpcErrorData, RpcErrorReason } from "@/transport/types";
import type { CdpDebuggee } from "./chromium-cdp";

// Renderer reads and cleanup that observation issues on the agent's behalf. A command that
// chrome.debugger has already dispatched cannot be cancelled: the deadline
// only ends the caller's wait, ignores the late reply and lets the capture
// pipeline stop instead of issuing fallback reads against the same
// unresponsive page. Mutations, screenshots and user-requested waits keep
// their own limits.
```

**依据 5 · 作者声明**：[crates/bsk-cli/skill/references/step-and-cache.md:1-6](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/skill/references/step-and-cache.md#L1-L6)

根 Skill 描述一次 action 及后续等待同步。

```text
# One action and a reusable observation

Use `step` when one action is already decided from current evidence. It invokes
that action exactly once, optionally waits for a known main-document selector to
be visible, then synchronizes. All operations use the existing guard and protocol;
this CLI orchestration does not require an extension upgrade.
```

#### 缺口

- 没有真实网页提交、中断、网络断连和弹窗实验
  **影响**：无法保证操作是否发生或恢复行为
  **进一步探讨**：用无副作用测试页面核对操作 ID、取消回执及服务端状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连接、登录态和保存数据的信任边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

作者明确代理窗口共享所选浏览器 profile 登录态，不是安全沙箱；借用既有标签的确认可由用户关闭。固定版本本地 daemon 的 Origin 检查接受任何符合 chrome-extension:// 加 32 个 a-p 字符格式的来源，源码注释承认侧载扩展可通过，allow_any 更会跳过该检查；这不是具体扩展 ID 身份绑定或完整认证证明。远程模式另有配对/续期/撤销，公开 URL 要求 WSS、仅 loopback 可用 WS；它不是本地 Origin 检查的自动替代。作者指出调试历史、视频和 saveFull 文件可能保留敏感数据，结束会话不会删除导出或其他系统副本；过滤不保证完全脱敏。未做攻击或部署验证，不能由上述静态路径断言实际入侵。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:264-288](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L264-L288)

作者说明共享控制、登录态、用户确认和历史保留。

<details>
<summary>查看原文（25行）</summary>

```text
## 浏览器控制与隐私

新任务默认启用共享控制。BrowserSkill 会观察受控标签页中的页面变化和受支持的手动活动，让 Agent 在你编辑时让出控制权，并在再次操作前同步状态。即使调试、审计和视频录制均关闭，这种协调仍会进行。你可以通过任务的手动接管与恢复功能决定何时继续。[共享控制指南](crates/bsk-cli/skill/references/cooperation.md)

代理窗口共享所选 Profile 的登录态，**它不是独立账号，也不是安全沙盒**。Agent 可以使用已登录网站授予的权限执行操作，请选择你信任的 Agent 和任务。

扩展提供两个默认开启、相互独立的**自动化设置**：

| 设置 | 控制什么 |
| --- | --- |
| **借用标签页前确认** | Agent 接管你已有的标签页之前，先请求确认。关闭后允许免确认借用。 |
| **允许请求人工协助** | 允许 Agent 请你处理登录、验证或其他需要本人参与的步骤。 |

浏览器中保存的设置对已有和新建会话生效。旧的 `--unattended`、`tab borrow --no-confirm`、`BSK_REQUEST_HELP=off` 不能覆盖这些设置。关闭人工协助不代表待处理步骤已经完成。关闭代理窗口可以停止其中的任务。

BrowserSkill 没有必须使用的云服务，也不收集产品遥测。自动化结果交给你选定的 daemon 或网关，以及使用它的 Agent；对应 Agent 或服务可能按自身政策处理或保留数据。扩展不会自行调用 AI 提供商。

| 可选历史与视频记录 | 保存位置 | 需要知道的事 |
| --- | --- | --- |
| **网站调试** | 当前浏览器配置中，远程模式也一样 | 保存采集到的数据，包括可获取的正文和字段值。已停止记录 30 天后过期，保留预算为 50 条／50 MiB，达到限制时可能提前清理。删除记录前需先停止采集。 |
| **操作审计** | daemon 所在主机的 `BSK_HOME/audit` | 默认关闭。记录任务与操作元数据，不记录输入值、页面正文、截图或文件内容。已结束任务 30 天后过期。 |
| **任务视频** | 当前浏览器配置；导出副本保存在指定位置 | 主动开启后，录制一个已授权标签页的无声视频；单个视频上限为 10 分钟／256 MiB，创建 24 小时后过期，临时视频预算为 1 GiB。视频库支持预览、导出和删除。 |
| **观察结果及 step 响应** | CLI 所在计算机上明确指定的 JSON 路径，也可能是远程服务器 | `--save-full`／DSH `saveFull` 会在显示过滤前保存完整响应。文件不会自动过期，需要在该计算机上删除；`view` 读取历史数据，不会刷新浏览器状态。 |

这些功能均支持导出和删除。结束任务或断开连接不会删除保留的历史或视频，过期数据会在访问或清理时处理。导出的文件、Agent 或网关已经收到的副本需要另行管理。调试数据会过滤已知敏感信息，但不能保证完全脱敏。视频画面不会自动脱敏，分享前请检查可见内容。
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:37-57](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ws.rs#L37-L57)

本地 Origin 仅验证扩展来源格式及 allow_any。

<details>
<summary>查看原文（21行）</summary>

```text
/// Result of the optional Origin allow-list check.
///
/// TODO(M10/M12): pair v0.1 GA with an actual extension-id allow-list
/// (`DaemonConfig::allowed_extension_ids: HashSet<String>`) populated
/// from a config file / pairing flow, rather than accepting any
/// extension-shaped origin. Review M4/M5 I8 — acceptable defense-in-
/// depth gap for now because pairing happens through the popup, but
/// a side-loaded extension on the same machine currently passes the
/// gate.
pub(super) fn origin_allowed(origin: &str, allow_any: bool) -> bool {
    if allow_any {
        return true;
    }
    // MV3 extension ids are 32 a–p characters per Chrome spec.
    let prefix = "chrome-extension://";
    if let Some(rest) = origin.strip_prefix(prefix) {
        if rest.len() == 32 && rest.bytes().all(|b| (b'a'..=b'p').contains(&b)) {
            return true;
        }
    }
    false
```

</details>

**依据 3 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:145-170](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ws.rs#L145-L170)

握手依据配置检查来源。

<details>
<summary>查看原文（26行）</summary>

```text
async fn handle_connection(
    state: Arc<DaemonState>,
    stream: TcpStream,
    peer: SocketAddr,
) -> anyhow::Result<()> {
    let allow_any = state.config.allow_any_origin;
    let captured_origin: std::sync::Arc<std::sync::Mutex<Option<String>>> =
        std::sync::Arc::new(std::sync::Mutex::new(None));
    let captured_origin_for_cb = std::sync::Arc::clone(&captured_origin);
    #[allow(clippy::result_large_err)]
    let callback = move |req: &Request, response: Response| {
        let origin = req
            .headers()
            .get("Origin")
            .and_then(|v| v.to_str().ok())
            .unwrap_or_default()
            .to_string();
        if !origin_allowed(&origin, allow_any) {
            warn!(?origin, "rejecting WS upgrade with disallowed origin");
            let mut err = ErrorResponse::new(Some(
                "Origin not in chrome-extension allow-list".to_string(),
            ));
            *err.status_mut() = StatusCode::FORBIDDEN;
            return Err(err);
        }
        *captured_origin_for_cb.lock().unwrap() = Some(origin);
```

</details>

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/remote/mod.rs:75-89](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/remote/mod.rs#L75-L89)

公开 URL 与 loopback 的协议限制。

<details>
<summary>查看原文（15行）</summary>

```text
pub fn validate_endpoint(input: &str) -> Result<Url> {
    let url = Url::parse(input)?;
    let loopback = matches!(url.host_str(), Some("localhost" | "127.0.0.1" | "[::1]"));
    ensure!(
        url.scheme() == "wss" || (url.scheme() == "ws" && loopback),
        "public URL requires WSS (WS is allowed only on loopback)"
    );
    ensure!(
        url.host_str().is_some()
            && url.username().is_empty()
            && url.password().is_none()
            && url.query().is_none()
            && url.fragment().is_none(),
        "public URL must not contain credentials, query parameters or fragments"
    );
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:258-262](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L258-L262)

作者说明远程配对与文件传输限制。

```text
### Agent 在服务器，浏览器在本机

保留本机浏览器和登录态，让 Agent、CLI 与 daemon 在服务器运行。扩展通过经过鉴权的 WSS 与服务器配对，由浏览器主动建立连接，本机无需开放入站端口。

内置服务端支持设备配对、续期和撤销授权。`bsk upload` 和 `bsk download` 文件传输命令仍仅支持本地模式。经过授权的视频导出可以写入 CLI 所在计算机，包括远程服务器；扩展中的“另存为 MP4”写入浏览器所在计算机。详见[远程连接指南](docs/remote-extension-connection.md)。
```

#### 缺口

- 未验证本地恶意客户端、部署认证或浏览器行为
  **影响**：不能证明实际可利用性或整体安全
  **进一步探讨**：隔离环境检查连接方、配对凭据、浏览器权限和历史文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下试用，成本和退出方式是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需有受支持 Chromium 浏览器、扩展、匹配版本的 CLI/daemon 和可调用 shell 的 Agent；doctor 成功不能证明 Skill 已加载。作者说明升级时需要更新 CLI、重启运行中的 daemon，再更新扩展；网站调试请求重放可能产生服务端写入，历史及导出须另管。首次成本是安装、配对和确认账户；持续成本是观察动作、模型推理和网站服务费用；错误恢复需要核对网站实际状态与历史文件，金额、净节时和失败率未知。可在测试账号执行只读任务，若账户权限、连接来源、操作回执或目标状态不明则停止、人工核对并断开连接；退出不会自动清除已保存副本或撤销服务端操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:81-89](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L81-L89)

作者列出组件和支持环境。

```text
## 快速开始

本地自动化需要 **AI Agent + `bsk` CLI + 浏览器扩展**。CLI 自带后台守护进程（daemon），skill 则负责告诉 Agent 如何使用这些工具。

| 组件 | 支持环境 |
| --- | --- |
| CLI / daemon | macOS：Apple Silicon、Intel；Linux：x64、ARM64；Windows：x64 |
| 浏览器扩展 | 基于 Chromium 125 或更新版本的 Chrome、Microsoft Edge。其他 Chromium 浏览器可能可用，但不保证兼容。 |
| Agent 接入 | 能调用 Shell 的 Agent 配合 BrowserSkill skill，或 DeepSeek Harness 配合 [DSH 插件](#deepseek-harness-插件)。 |
```

**依据 2 · 作者声明**：[README.zh-CN.md:149-155](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L149-L155)

doctor 与 Skill 加载不等价。

````text
#### 4. 验证连接

```sh
bsk doctor
```

解决失败项，确认扩展显示**已连接**。再开启一个新的 Agent 会话，确认能发现 `browser-skill`；doctor 通过并不代表 Agent 已加载 skill。
````

**依据 3 · 作者声明**：[README.zh-CN.md:227-231](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L227-L231)

作者说明请求重放可能改变服务端数据。

````text
```

也可以在扩展中打开**快捷功能 → 网站调试**，对已有任务启动采集。调试页将操作时间线、请求、控制台、页面状态、性能和 API 分析放在一起。任务结束后，即使没有连接 daemon，仍可打开历史查看记录；新的 Agent 任务需要你提供导出的文件，才能分析已结束任务的历史。

请求重放会使用页面当前会话发送一次新请求，可能改变服务端数据。采集和脱敏均有限制，保存的证据仍可能包含敏感信息。完整流程、CLI 示例及限制见[网站调试指南](docs/website-debugging.md)。
````

**依据 4 · 作者声明**：[README.zh-CN.md:281-288](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L281-L288)

作者说明历史和导出文件保留。

```text
| 可选历史与视频记录 | 保存位置 | 需要知道的事 |
| --- | --- | --- |
| **网站调试** | 当前浏览器配置中，远程模式也一样 | 保存采集到的数据，包括可获取的正文和字段值。已停止记录 30 天后过期，保留预算为 50 条／50 MiB，达到限制时可能提前清理。删除记录前需先停止采集。 |
| **操作审计** | daemon 所在主机的 `BSK_HOME/audit` | 默认关闭。记录任务与操作元数据，不记录输入值、页面正文、截图或文件内容。已结束任务 30 天后过期。 |
| **任务视频** | 当前浏览器配置；导出副本保存在指定位置 | 主动开启后，录制一个已授权标签页的无声视频；单个视频上限为 10 分钟／256 MiB，创建 24 小时后过期，临时视频预算为 1 GiB。视频库支持预览、导出和删除。 |
| **观察结果及 step 响应** | CLI 所在计算机上明确指定的 JSON 路径，也可能是远程服务器 | `--save-full`／DSH `saveFull` 会在显示过滤前保存完整响应。文件不会自动过期，需要在该计算机上删除；`view` 读取历史数据，不会刷新浏览器状态。 |

这些功能均支持导出和删除。结束任务或断开连接不会删除保留的历史或视频，过期数据会在访问或清理时处理。导出的文件、Agent 或网关已经收到的副本需要另行管理。调试数据会过滤已知敏感信息，但不能保证完全脱敏。视频画面不会自动脱敏，分享前请检查可见内容。
```

**依据 5 · 作者声明**：[README.zh-CN.md:292-294](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L292-L294)

作者说明版本升级和 daemon 重启。

```text
## 升级

**升级到 0.4.0 时，先更新 CLI 并重启正在运行的 daemon，再更新扩展，最后更新 DSH。** 新扩展要求 daemon 协议至少为 1.6，而 CLI/daemon 0.3.3 使用 1.3。仅替换二进制不会更新通过前台或外部进程管理器运行的旧 daemon，仍需在所属宿主中重启。使用新功能时请配套使用 0.4.0 组件。
```

#### 缺口

- 目标环境未安装、版本兼容与费用未知
  **影响**：无法建议直接把真实账户交给自动化
  **进一步探讨**：测试账号以只读任务检查连接、退出和数据处理。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 限制本地允许的扩展身份是否值得验证？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有本地 Origin 校验已阻挡不符合扩展格式的来源，远程服务已有设备配对与授权，不能把“增加任意校验”当作新能力；源码同时明确本地尚接受任意符合格式的扩展 ID。未验证方案是在本地引入显式用户批准的扩展 ID 与连接身份绑定，并在重连、扩展更新、撤销时有可恢复流程；Origin 文本可由非浏览器客户端伪造，单独 pin ID 不能证明连接方身份，也不能取代本机进程/IPC 保护。以原本地模式、ID 限制和具独立可信认证的绑定方案对照，测试正常更新、多 profile、仿冒来源、撤销及恢复，记录误拒和人工负担；若无法可靠认证、影响正常升级或无法降低未授权接入，则否定或退回更简单的可信本机隔离。方案未实现，实际威胁与收益未实测。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:37-57](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ws.rs#L37-L57)

源码指出本地仅检查扩展形状，具体 allowlist 为 TODO。

<details>
<summary>查看原文（21行）</summary>

```text
/// Result of the optional Origin allow-list check.
///
/// TODO(M10/M12): pair v0.1 GA with an actual extension-id allow-list
/// (`DaemonConfig::allowed_extension_ids: HashSet<String>`) populated
/// from a config file / pairing flow, rather than accepting any
/// extension-shaped origin. Review M4/M5 I8 — acceptable defense-in-
/// depth gap for now because pairing happens through the popup, but
/// a side-loaded extension on the same machine currently passes the
/// gate.
pub(super) fn origin_allowed(origin: &str, allow_any: bool) -> bool {
    if allow_any {
        return true;
    }
    // MV3 extension ids are 32 a–p characters per Chrome spec.
    let prefix = "chrome-extension://";
    if let Some(rest) = origin.strip_prefix(prefix) {
        if rest.len() == 32 && rest.bytes().all(|b| (b'a'..=b'p').contains(&b)) {
            return true;
        }
    }
    false
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:145-170](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/crates/bsk-cli/src/daemon/ws.rs#L145-L170)

握手使用来源检查。

<details>
<summary>查看原文（26行）</summary>

```text
async fn handle_connection(
    state: Arc<DaemonState>,
    stream: TcpStream,
    peer: SocketAddr,
) -> anyhow::Result<()> {
    let allow_any = state.config.allow_any_origin;
    let captured_origin: std::sync::Arc<std::sync::Mutex<Option<String>>> =
        std::sync::Arc::new(std::sync::Mutex::new(None));
    let captured_origin_for_cb = std::sync::Arc::clone(&captured_origin);
    #[allow(clippy::result_large_err)]
    let callback = move |req: &Request, response: Response| {
        let origin = req
            .headers()
            .get("Origin")
            .and_then(|v| v.to_str().ok())
            .unwrap_or_default()
            .to_string();
        if !origin_allowed(&origin, allow_any) {
            warn!(?origin, "rejecting WS upgrade with disallowed origin");
            let mut err = ErrorResponse::new(Some(
                "Origin not in chrome-extension allow-list".to_string(),
            ));
            *err.status_mut() = StatusCode::FORBIDDEN;
            return Err(err);
        }
        *captured_origin_for_cb.lock().unwrap() = Some(origin);
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:258-262](https://github.com/Tencent/BrowserSkill/blob/1b395fd07a047e378840285c25c4a24716aee19f/README.zh-CN.md#L258-L262)

作者说明远程已有设备配对与撤销。

```text
### Agent 在服务器，浏览器在本机

保留本机浏览器和登录态，让 Agent、CLI 与 daemon 在服务器运行。扩展通过经过鉴权的 WSS 与服务器配对，由浏览器主动建立连接，本机无需开放入站端口。

内置服务端支持设备配对、续期和撤销授权。`bsk upload` 和 `bsk download` 文件传输命令仍仅支持本地模式。经过授权的视频导出可以写入 CLI 所在计算机，包括远程服务器；扩展中的“另存为 MP4”写入浏览器所在计算机。详见[远程连接指南](docs/remote-extension-connection.md)。
```

#### 缺口

- 未实现本地可信身份绑定或攻击实验
  **影响**：不能确认其有效性、兼容或成本
  **进一步探讨**：对照本地与远程边界，在隔离环境验证伪造来源、重连和撤销。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
