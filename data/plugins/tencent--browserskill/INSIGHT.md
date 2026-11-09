# BrowserSkill

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[9084a36](https://github.com/Tencent/BrowserSkill/tree/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65)

<!-- BEGIN META -->
[![GitHub ★ 10,163](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C163&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill)
<!-- END META -->

> **功能**：把可调用 bsk 的 Agent 接入 Chrome 或 Edge 的任务窗口，支持网页观察、交互和人工协作。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示根项目把跨宿主 CLI、本机 IPC 和现有浏览器窗口接成一条可观察的操作路径，用户可在当前 profile 中核查任务。独立 DSH 插件负责把这条能力接入宿主工具层。

> **主要限制**：[Q03](#research-q03) 本机未配对连接在默认 Warn 下仍能使用，连接状态不能单独作为设备身份证明。已配对流程能绑定设备，但业务流量和同账号进程仍有独立边界。取消仅能说明本地等待或对端控制器状态，网页动作需另行核对。

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
  - [Q01 · 复用已有浏览器 profile 对网页任务有什么实际增量？](#detail-section-11)
  - [Q02 · 一条命令怎样进入 daemon、转发到选定浏览器并返回结果？](#detail-section-12)
  - [Q03 · 本机配对是否默认强制、绑定到哪里，取消能说明什么？](#detail-section-13)
  - [Q04 · 本机试用需哪些组件和连接，持续与故障恢复成本如何？](#detail-section-14)
  - [Q05 · 如何验证拒绝未知连接后仍可安全完成只读任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Chromium 账号且反复查网页资料的操作者，希望让 Agent 在指定 profile 中执行可观察的任务，并在结果不明时人工接手。[Q01](#research-q01)

人工能在已登录浏览器读取资料并保留截图。独立自动化 profile 则需单独维护账号和连接。BrowserSkill 的差异是用 CLI 驱动已配置浏览器中的独立任务窗口。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Agent Window | 为任务创建可见浏览器窗口 | 普通窗口依附所选 profile，复用账号状态 |
| 页面观察 | 把指定会话的网页状态送给 CLI 调用方 | 取决于扩展连接、目标与观察预算 |
| 本机设备配对 | 验证连接双方并绑定浏览器实例 | 默认 Warn 兼容未配对设备，强制策略需单独设置 |
| 取消与撤销 | 停止等待、通知扩展或撤销连接授权 | 已发出的网页副作用另行核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| bsk CLI 和可达的 daemon | 必需 | 本机 IPC 与会话路由 | 检查 CLI 与实际运行服务的版本 |
| 支持的 Chromium 浏览器和扩展 | 必需 | 创建窗口并执行页面工具 | 检查实际扩展连接与协议 |
| 能调用 CLI 的 Agent 与指令 | Agent 使用时需要 | 将用户任务变成明确工具调用 | 先人工核对 CLI 和目标 |
| 已验证配对与独立测试账号 | 本轮隔离试用前提 | 约束对端身份和页面权限 | 未验证时暂停自动化 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置并诊断 | 操作者安装匹配组件，设置独立 profile 和 home | 诊断后单独确认 Agent 可见命令和扩展 |
| 配对并核对 | 操作者核对预期 daemon 与扩展，验证未知连接被拒 | 确认已验证状态，失败时保留防护并查端口和身份 |
| 明确窗口读取 | Agent 指定测试实例，打开只读页并读状态 | 页面标记与账号范围符合预期 |
| 中断或退出 | 操作者核对结果、窗口与导出文件 | 有未完成动作先停，改人工观察 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器、进程与模型运行环境 | 安装组件、配置权限和配对 | 当前实际环境未测 |
| 持续 | 模型、浏览器、IPC 和可选记录资源 | 核对 profile、权限、页面结果 | 单位任务的耗时和资源未知 |
| 失败恢复 | 重连、重试和可能的重复网站操作 | 先查页面与连接状态，再决定是否续做 | 取消结果与网页状态需独立核对 |
| 退出 | 保留的截图、JSON 或视频资源 | 检查退出与清理已导出副本 | 应用关闭与文件删除分别完成 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 指定浏览器任务 | 会话选择浏览器、扩展处理代表性观察 | 实际兼容和网页交付成功率 |
| 配对身份 | 双向证明和注册身份绑定 | 真实组合的拒绝、撤销及恢复效果 |
| 可复核的取消 | 排队与已转发分开处理 | 未收到网站回执时动作是否生效 |

> **思考**：[Q03](#research-q03) 本机未配对连接在默认 Warn 下仍能使用，连接状态不能单独作为设备身份证明。已配对流程能绑定设备，但业务流量和同账号进程仍有独立边界。取消仅能说明本地等待或对端控制器状态，网页动作需另行核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示根项目把跨宿主 CLI、本机 IPC 和现有浏览器窗口接成一条可观察的操作路径，用户可在当前 profile 中核查任务。独立 DSH 插件负责把这条能力接入宿主工具层。

[Q02](#research-q02) 以会话绑定目标浏览器，将尚未发送和已向扩展转发的工作分开处理。已配对时还在注册和业务消息处校验授权，迁移时要同时保留绑定、转发状态和结果未知语义。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本机未配对连接在默认 Warn 下仍能使用，连接状态不能单独作为设备身份证明。已配对流程能绑定设备，但业务流量和同账号进程仍有独立边界。取消仅能说明本地等待或对端控制器状态，网页动作需另行核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用独立 home 和测试 profile 验证配对后再读取只读页面，给测试页加独有标记以识别错窗。检查撤销后能否拒绝旧对端，取消后回读实际页面，无法判定时交回人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查本机命令转发、观察、可选配对及代表性取消路径。设备准入流程的收益待验证。未取得同条件运行或攻击实验。

- 已检查：作者 README、包清单、源码路径 README.md、apps/extension/src/tools/dispatcher.ts、apps/extension/src/session-manager/agent-window.ts、crates/bsk-cli/src/cli/observe.rs、crates/bsk-cli/src/cli/business_rpc.rs、crates/bsk-cli/src/daemon/ipc.rs、crates/bsk-cli/src/daemon/queue.rs、crates/bsk-cli/src/daemon/ws.rs、crates/bsk-cli/src/daemon/local_auth/mod.rs、apps/extension/src/transport/local-auth.ts、apps/extension/src/transport/ws-transport.ts、crates/bsk-cli/src/daemon/local_auth/handshake.rs、crates/bsk-cli/src/daemon/peer_authorization.rs、docs/local-pairing.md、Cargo.toml、crates/bsk-cli/src/daemon/local_auth/lifecycle.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的根组件源码核查，覆盖本机 IPC、WebSocket、配对、观察、队列和代表性取消；未审计全部浏览器动作、远程模式或 DSH 子包。Rust workspace 版本在 Cargo.toml 声明，根包未声明 npm 版本。inventory 的统计不含 Rust。
- 下一步：按 [Q05](#research-q05) 对照默认和强制配对，用非敏感页面模拟未知实例、撤销与断流，并记录两端身份状态和页面结果。

**分析版本**

- **仓库**：[Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)
- **版本号**：未声明（[固定提交 9084a36](https://github.com/Tencent/BrowserSkill/tree/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将已有 Required 模式、已验证设备和只读页面回读纳入统一试用验收。对照默认 Warn 流程，检查能否减少误接纳，同时量化正确设备恢复时间及人工配置负担。

按 [Q05](#research-q05) 对照默认和强制配对，用非敏感页面模拟未知实例、撤销与断流，并记录两端身份状态和页面结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 80 | 10758 | — | — | 127018 |
| .ts | test | 258 | 98389 | 92329 | 2224 | — |
| .ts | source | 304 | 72627 | 64462 | 4638 | — |
| .tsx | test | 26 | 6310 | 5762 | 99 | — |
| .tsx | source | 45 | 9870 | 9404 | 131 | — |
| .md | example | 3 | 645 | — | — | 5426 |
| .mjs | source | 53 | 10193 | 9594 | 309 | — |
| .mjs | example | 8 | 202 | 191 | 0 | — |
| .mjs | test | 11 | 1537 | 1455 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 86](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=86&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 79](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=79&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 Chromium 登录态的 Agent 使用者能否以明确的设备和身份边界观察或控制任务窗口，哪些传输、配对和取消条件会改变采用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 复用已有浏览器 profile 对网页任务有什么实际增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有浏览器账号和重复查询任务的人，可以让能调用 shell 的 Agent 操作同一浏览器 profile 中独立可见的任务窗口。以从有权限的测试工作台读取列表为例，合格交付需要确认命中的账号和页面、保留准确的页面证据，并在不明时可由人接手。与人工打开浏览器后回贴片段相比，项目把浏览器查询和证据取得接到 Agent；与为每次工作另起自动化 profile 相比，作者定位可复用浏览器登录态，扩展在指定浏览器创建默认普通窗口。使用无痕需要允许扩展在无痕中运行，普通任务窗口也有原账号权限，采用时需按任务选择 profile。底层实现提供操作路径，无法从复用状态推断登录安全、节时或无人值守的正确率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-31](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L31-L31)

作者定位已有浏览器、登录态和可见任务窗口。

```text
**BrowserSkill connects your AI agent to Chrome or Microsoft Edge, using your existing logins.** Give it a task to read, click, fill, or investigate. Work stays visible in a separate **Agent Window**, and you can take over when needed. Existing tabs can be explicitly borrowed and returned when the task ends.
```

**依据 2 · 作者声明**：[README.md:64-72](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L64-L72)

CLI 可被能执行 shell 的宿主使用，DSH 插件另有入口。

```text
These and other agents that can run shell commands use the same **`bsk` CLI**. **[DeepSeek Harness](#deepseek-harness-plugin)** has a dedicated plugin with native browser tools and task previews. You choose the agent and model; BrowserSkill connects it to your browser.

## What you can do

| Your goal | What BrowserSkill provides |
| --- | --- |
| **Work where you are already signed in** | Read documents, search internal sites, and complete web workflows with the browser's existing login state. |
| **Turn instructions into browser actions** | Read page text and controls, click, type, fill forms, drag items, select ranges, and manage tabs. Capture viewport or full-page screenshots; upload and download files in local mode. |
| **Stay in control of the task** | Work alongside the agent with shared control, pause it while you edit, and let it reconcile your changes before continuing. Tasks remain visible in their own window; existing tabs can be explicitly borrowed. |
```

**依据 3 · 源码核查**：[apps/extension/src/tools/dispatcher.ts:821-825](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/tools/dispatcher.ts#L821-L825)

扩展收到会话创建调用后走会话处理。

```text
      case "tool.session_start":
        return handleSessionStart(this.sessions, req.params as SessionStartParams, {
          signal,
          preferences: this.interactionPreferences,
        });
```

**依据 4 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:44-64](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/session-manager/agent-window.ts#L44-L64)

任务窗口由浏览器扩展创建，默认普通窗口和后台焦点。

<details>
<summary>查看原文（21行）</summary>

```text
export const chromeAgentWindowApi: AgentWindowApi = {
  async create(url: string, opts: AgentWindowCreateOptions = {}): Promise<AgentWindowCreation> {
    if (opts.incognito && !(await chrome.extension.isAllowedIncognitoAccess())) {
      throw new Error(
        "Incognito access is disabled. Open chrome://extensions → BrowserSkill → Details → Allow in incognito, then retry.",
      );
    }
    const win = await chrome.windows.create({
      type: "normal",
      focused: opts.focused ?? false,
      incognito: opts.incognito ?? false,
      url,
      ...(opts.size ? { width: opts.size.width, height: opts.size.height } : {}),
    });
    if (typeof win?.id !== "number") {
      throw new Error("[bh] chrome.windows.create returned no window id");
    }
    return {
      windowId: win.id,
      incognito: win.incognito,
      initialTabIds: (win.tabs ?? []).flatMap((tab) =>
```

</details>

**依据 5 · 作者声明**：[README.md:273-286](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L273-L286)

作者明确同 profile 登录态、人工协作和浏览器设置限制。

<details>
<summary>查看原文（14行）</summary>

```text
## Browser control and privacy

By default, an Agent Window shares the selected profile's login state; **it is not a separate account or security sandbox**. Agents can act with the permissions of the signed-in websites, so choose the tasks and agent you trust.

New tasks enable shared control automatically. BrowserSkill observes page changes and supported manual activity in controlled tabs so the agent can yield while you edit and synchronize before acting again. This coordination works even when debugging, audit and video recording are off. Use the task's manual hold and resume controls to keep control while you work. [Shared-control guide](crates/bsk-cli/skill/references/cooperation.md)

The extension has two independent **Automation settings**, both enabled by default:

| Setting | What it controls |
| --- | --- |
| **Confirm before borrowing tabs** | Ask before an agent takes control of one of your existing tabs. Turning it off permits borrowing without that prompt. |
| **Allow requests for human help** | Let the agent ask you to handle login, verification, or another step that needs your participation. |

These browser settings apply to existing and new sessions. Legacy `--unattended`, `tab borrow --no-confirm`, and `BSK_REQUEST_HELP=off` inputs cannot override them. Disabling human help does not mean the requested step was completed. Close the Agent Window to stop its tasks.
```

</details>

#### 缺口

- 缺针对相同测试工作台的人机耗时和核对记录。
  **影响**：无法确认复用 profile 后的净收益是否超过账号与观察管理。
  **进一步探讨**：对照人工和 Agent 读取同样列表，记录账号正确性、失败和人工复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一条命令怎样进入 daemon、转发到选定浏览器并返回结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

以带会话 ID 的 `observe` 为例，CLI 先发现或准备 daemon，再构造会话、标签页和观察预算参数，以 ToolObserve 方法经本机 IPC 调用。daemon 由通用工具 dispatch 处理，普通 observe 走会话队列，个别控制和对话框动作有独立调度。队列先检查取消和会话存在，再按该会话的 browser_id 选已连接扩展，登记转发并等待结果。WebSocket 写出业务消息前再次检查授权状态。扩展 dispatcher 对 observe 转向真实处理器，并在调用前检查取消，主动 hover 探测只有参数明确启用时才使用且可能被现有锁定状态抑制。CLI 可把响应打印成 JSON；人读输出的观察为空或被裁剪也有提示。该链路把已存在的浏览器状态投影给 Agent，浏览器和网站实际行为还需按 profile、权限和版本验证。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/cli/observe.rs:47-79](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/cli/observe.rs#L47-L79)

CLI 发起带会话和预算的观察并投影结构化输出。

<details>
<summary>查看原文（33行）</summary>

```text
pub fn dispatch(args: ObserveArgs, format: Format) -> Result<(), CliError> {
    let info = ensure_daemon().context("ensure daemon is running")?;
    run(info.sock_path, args, format)
}

fn run(sock: PathBuf, args: ObserveArgs, format: Format) -> Result<(), CliError> {
    let params = ObserveParams {
        cursor: args.cursor,
        session_id: args.session.clone(),
        tab_id: args.tab_id,
        max_depth: args.max_depth,
        max_tokens: args.max_tokens,
        debug_surfaces: args.debug_surfaces,
        probe_hover: args.probe_hover,
    };
    let reply: ObserveResult = call(sock, params)?;
    match format {
        Format::Json => {
            let json = serde_json::to_string_pretty(&reply)
                .map_err(|e| CliError::Local(anyhow::anyhow!(e)))?;
            println!("{json}");
        }
        Format::Human => {
            if reply.text.is_empty() {
                println!("(empty observation — page may still be loading)");
            } else {
                println!("{}", reply.text);
            }
            if reply.truncated && reply.next_cursor.is_none() {
                eprintln!(
                    "warning: observation truncated (refs={}, tab={}). Increase --max-depth / --max-tokens if needed.",
                    reply.ref_count, reply.tab_id
                );
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/cli/observe.rs:87-94](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/cli/observe.rs#L87-L94)

请求方法确为 ToolObserve。

```text
fn call(sock: PathBuf, params: ObserveParams) -> Result<ObserveResult, CliError> {
    crate::cli::business_rpc::call::<ObserveParams, ObserveResult>(
        sock,
        "observe",
        Method::ToolObserve,
        Some(params),
        TOOL_IPC_TIMEOUT,
    )
```

**依据 3 · 源码核查**：[crates/bsk-cli/src/cli/business_rpc.rs:202-210](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/cli/business_rpc.rs#L202-L210)

固定调用经带 ID 的 IPC 客户端。

```text
    let mut client = IpcClient::connect(sock.clone()).await?;
    let rpc_id_for_call = rpc_id.clone();
    let rpc_id_for_cancel = rpc_id.clone();

    let main_fut = async move {
        client
            .call_with_id::<serde_json::Value, R>(rpc_id_for_call, method, params, call_timeout)
            .await
    };
```

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/ipc.rs:313-351](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ipc.rs#L313-L351)

实际工具入口把观察等方法交给业务 dispatch。

<details>
<summary>查看原文（39行）</summary>

```text
                | Method::ToolSnapshot
                | Method::ToolObserve
                | Method::ToolCooperate
                | Method::ToolGetHtml
                | Method::ToolRead
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
                | Method::ToolUpload
                | Method::ToolDownload
                | Method::ToolEvaluate
                | Method::ToolWaitForNavigation
                | Method::ToolWaitForElement
                | Method::ToolRequestHelp
                | Method::ToolRecordStart
                | Method::ToolRecordStop
                | Method::ToolRecordAwait
                | Method::ToolDialogStatus
                | Method::ToolDialogAccept
                | Method::ToolDialogDismiss => {
                    handle_dialog_aware_dispatch(
                        Arc::clone(&state),
                        rpc_id,
                        method,
                        params,
                        ticket.take(),
                    )
```

</details>

**依据 5 · 源码核查**：[crates/bsk-cli/src/daemon/ipc.rs:813-832](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ipc.rs#L813-L832)

按方法选择不加锁的控制路径或正常会话队列。

<details>
<summary>查看原文（20行）</summary>

```text
    let independent_control = method == Method::ToolCooperate
        && params.get("action").and_then(Value::as_str) != Some("enable");
    let outcome = if independent_control
        || matches!(
            method,
            Method::ToolRecordStop
                | Method::ToolDialogStatus
                | Method::ToolDialogAccept
                | Method::ToolDialogDismiss
        ) {
        state
            .tool_queues
            .dispatch_unlocked(&session_id, method.clone(), params, timeout, Some(entry))
            .await
    } else {
        state
            .tool_queues
            .dispatch(&session_id, method.clone(), params, timeout, Some(entry))
            .await
    };
```

</details>

**依据 6 · 源码核查**：[crates/bsk-cli/src/daemon/queue.rs:639-672](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/queue.rs#L639-L672)

工作项在发送前核对取消、会话和所属浏览器。

<details>
<summary>查看原文（34行）</summary>

```text
) -> Result<Value, RpcError> {
    // Pre-flight: a cancel that landed while this job was still in
    // the per-session channel must short-circuit before any session
    // / browser resolution work, and before any WS frame leaves the
    // daemon (review C2). We keep the `tokio::select!` later so
    // cancels arriving mid-WS-hop also unblock the worker.
    if job
        .inflight
        .as_ref()
        .is_some_and(|entry| entry.is_cancelled())
        || job
            .lifecycle_cancel
            .as_ref()
            .is_some_and(AbortToken::is_cancelled)
    {
        return Err(cancelled_error(
            job.inflight.as_deref(),
            "tool dispatch cancelled before forwarding",
        ));
    }
    let Some(session) = sessions.get(sid) else {
        return Err(RpcError {
            code: ErrorCode::NotFound,
            message: format!("session {sid} no longer exists"),
            data: None,
        });
    };
    let Some(client) = browsers.get(&session.browser_id) else {
        return Err(RpcError {
            code: ErrorCode::NotFound,
            message: "owning browser is no longer connected".into(),
            data: None,
        });
    };
```

</details>

**依据 7 · 源码核查**：[crates/bsk-cli/src/daemon/queue.rs:698-717](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/queue.rs#L698-L717)

业务调用与转发状态共同推进，取消和发送失败有独立出口。

<details>
<summary>查看原文（20行）</summary>

```text
    let mut dispatched = None;
    let cancel_token = match job.inflight.as_ref() {
        Some(entry) => {
            let outcome =
                entry.promote_to_forwarded_with(session.browser_id.clone(), rpc_id.clone(), || {
                    let result = client.dispatch(request);
                    let sent = result.is_ok();
                    dispatched = Some(result);
                    sent
                });
            match outcome {
                PromoteOutcome::Promoted => Some(entry.cancel_token()),
                PromoteOutcome::Cancelled => {
                    return Err(cancelled_error(
                        Some(entry),
                        "tool dispatch cancelled before forwarding",
                    ));
                }
                PromoteOutcome::SendFailed => return Err(not_dispatched_error(dispatched)),
            }
```

</details>

**依据 8 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:422-436](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ws.rs#L422-L436)

出站和入站处理均检查授权仍有效。

<details>
<summary>查看原文（15行）</summary>

```text
        loop {
            tokio::select! {
                outbound = rx.recv() => {
                    if !authorization.active() { break; }
                    match outbound {
                        Some(frame) => {
                            let json = serde_json::to_string(&frame)?;
                            writer.send(Message::Text(json)).await?;
                        }
                        None => break,
                    }
                }
                msg = reader.next() => {
                    if !authorization.active() { break; }
                    match msg {
```

</details>

**依据 9 · 源码核查**：[apps/extension/src/tools/dispatcher.ts:956-981](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/tools/dispatcher.ts#L956-L981)

扩展侧真实接线处理观察及可选主动探测。

<details>
<summary>查看原文（26行）</summary>

```text
      case "tool.observe": {
        const params = req.params as ObserveParams;
        const hoverScope = await this.resolveHoverLatchScope(params);
        throwIfDispatchAborted(signal);
        return this.withHoverReassert(
          params,
          () =>
            handleObserve(
              this.sessions,
              params,
              cdp
                ? {
                    cdp,
                    tabsApi: chromeTabsCaptureApi,
                    // Active hover probing is opt-in. A held hover latch still
                    // suppresses it, because probing would move the cursor off
                    // the element the caller is deliberately holding.
                    conditionalSurfaceProbe:
                      params.probe_hover === true && !this.hasHoverLatchForScope(hoverScope),
                    hoverProbeBypassOverlay: bypassOverlay,
                  }
                : undefined,
              signal,
            ),
          {},
          signal,
```

</details>

#### 缺口

- 缺当前宿主的会话转发、实际动态页面观察和多 profile 对照。
  **影响**：无法给出错误目标率、浏览器时延或观察完整性。
  **进一步探讨**：以同标题但不同标记的两个测试窗口调用观察，核对响应和目标标识并记录延迟。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机配对是否默认强制、绑定到哪里，取消能说明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

本机配对默认可选。daemon 默认 Warn，初次未配对的扩展会报告未验证并可按旧握手运行。WebSocket Origin 只匹配 chrome-extension 地址和标识形状，单看它无法认证具体扩展。已配对的路径以双方随机数、daemon 与设备身份、浏览器实例、密钥代数和 Origin 组成转录，双方验证基于同一密钥的证明。浏览器注册再核对凭据绑定的实例身份。常规 Warn 下已绑定实例不能由 legacy peer 声称，TrustLocal 是明确例外。已有或候选配对验证失败时，扩展认证函数继续抛错，传输层关闭当前连接。Required 单独关闭 legacy。局部配对证明没有给后续 WebSocket 业务流量加密，也不约束能读取本机配对资料的进程。

daemon 收到取消时区分排队和已转发。尚未发出的工作可在队列预检查退出，已转发时按浏览器及 RPC ID 传递取消。扩展确认只表示找到匹配的取消控制器并请求中止，远端页面可能早已接受操作。CLI 在取消等待超时可自行返回取消错误，缺回执时要查网站实际状态再决定，避免盲目重做。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/mod.rs:12-34](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/mod.rs#L12-L34)

Warn 为缺省，Required 拒绝 legacy。

<details>
<summary>查看原文（23行）</summary>

```text
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LocalAuthMode {
    #[default]
    Warn,
    Required,
    TrustLocal,
}
impl LocalAuthMode {
    pub fn accepts_legacy(self) -> bool {
        self != Self::Required
    }
}

#[derive(Default, Serialize, Deserialize)]
struct Settings {
    local_auth: Option<LocalAuthMode>,
    #[serde(flatten)]
    other: std::collections::BTreeMap<String, serde_json::Value>,
}
pub fn read_mode(home: &Path) -> Result<LocalAuthMode> {
    let settings: Settings = super::json_store::read(&home.join("settings.json"))?;
    Ok(settings.local_auth.unwrap_or_default())
```

</details>

**依据 2 · 源码核查**：[apps/extension/src/transport/local-auth.ts:206-240](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/transport/local-auth.ts#L206-L240)

未配对或显式跳过可报告未验证，已有配对失败向上传递。

<details>
<summary>查看原文（35行）</summary>

```text
  return async (socket: WebSocket, signal: AbortSignal): Promise<void> => {
    const { credentials, policy } = await readLocalState();
    if (signal.aborted) throw new LocalAuthError({ state: "server_unverified" });
    // An unused link is not a pairing. A saved candidate may already have
    // committed on the daemon, so recovery must authenticate just like an
    // active pairing; errors never select an unverified connection.
    const offers = credentials.filter(
      (credential) => credential.role === "active" || credential.pending,
    );
    if (policy.skip || !offers.length) {
      options.status({ state: "unverified_local", reason: policy.skip ? "skip" : "unpaired" });
      return;
    }
    options.status({ state: "verifying" });
    try {
      // Keep probes bounded even after multiple interrupted attempts. Prefer
      // the current endpoint, active records, then newer offers. The daemon
      // still selects a committed key before an unactivated link.
      const priority = (credential: LocalCredential) =>
        Number(credential.endpoint === socket.url) * 2 + Number(credential.role === "active");
      offers.reverse().sort((a, b) => priority(b) - priority(a));
      const status = await authenticateLocal(
        socket,
        signal,
        offers.slice(0, MAX_AUTH_CREDENTIALS),
        await options.instanceId(),
        options.origin,
      );
      options.status(status);
    } catch (error) {
      if (signal.aborted) throw error;
      options.status(
        error instanceof LocalAuthError ? error.status : { state: "server_unverified" },
      );
      throw error;
```

</details>

**依据 3 · 源码核查**：[apps/extension/src/transport/ws-transport.ts:220-244](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/transport/ws-transport.ts#L220-L244)

认证失败关闭本次连接，不发起业务通信。

<details>
<summary>查看原文（25行）</summary>

```text
      const failed = (error: unknown) => {
        if (!this.isCurrentSocket(socket, generation)) return;
        this.onAuthenticationError?.();
        this.authBackoffUntil = Date.now() + Math.min(30_000 * 2 ** this.authFailures++, 300_000);
        this.endAuthentication();
        const reject = this.rejectConnect;
        this.resolveConnect = null;
        this.rejectConnect = null;
        this.connectingPromise = null;
        reject?.(error instanceof Error ? error : new Error("Local authentication failed"));
        socket.close();
        this.handleClose(socket, generation, {});
      };
      if (!this.authenticate) {
        connected();
        return;
      }
      const abort = new AbortController();
      this.authentication = abort;
      this.authenticationTimer = setTimeout(
        () => failed(new Error("Local authentication timed out")),
        5_000,
      );
      try {
        Promise.resolve(this.authenticate(socket, abort.signal)).then(connected, failed);
```

</details>

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:39-47](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ws.rs#L39-L47)

Origin 仅有格式检查。

```text
pub(super) fn origin_allowed(origin: &str) -> bool {
    // MV3 extension ids are 32 a–p characters per Chrome spec.
    let prefix = "chrome-extension://";
    if let Some(rest) = origin.strip_prefix(prefix) {
        if rest.len() == 32 && rest.bytes().all(|b| (b'a'..=b'p').contains(&b)) {
            return true;
        }
    }
    false
```

**依据 5 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/handshake.rs:117-154](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/handshake.rs#L117-L154)

服务端生成转录与证明，再验证客户端证明。

<details>
<summary>查看原文（38行）</summary>

```text
        .ok_or_else(|| anyhow!("local authorization changed"))?;
    let server_nonce = random();
    let daemon_id = local.store.daemon_id();
    let transcript = Transcript {
        daemon_id: &daemon_id,
        device_id: &selected.device_id,
        r#gen: selected.r#gen,
        instance_id: &hello.instance_id,
        origin,
        client_nonce: &hello.client_nonce,
        server_nonce: &server_nonce,
    }
    .encode();
    challenge(
        ws,
        &probe.id,
        ChallengeResponse::Challenge {
            daemon_id,
            device_id: selected.device_id,
            r#gen: selected.r#gen,
            server_nonce,
            server_proof: prove(&selected.key, Purpose::Server, &transcript, None),
        },
    )
    .await?;
    let AuthMessage::Prove { client_proof, .. } = AuthMessage::parse(&text(ws).await?)? else {
        bail!("expected client proof");
    };
    ensure!(
        verify(
            &selected.key,
            Purpose::Client,
            &transcript,
            None,
            &client_proof
        ),
        "local client proof rejected"
    );
```

</details>

**依据 6 · 源码核查**：[apps/extension/src/transport/local-auth.ts:140-151](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/transport/local-auth.ts#L140-L151)

扩展先核对服务器证明，再发送客户端证明。

<details>
<summary>查看原文（12行）</summary>

```text
    let credential = credentials.find(
      (c) =>
        c.daemonId === challenge.daemon_id &&
        c.deviceId === challenge.device_id &&
        (c.gen === challenge.gen || c.pending?.gen === challenge.gen),
    );
    if (!credential) throw new LocalAuthError({ state: "server_unverified" });
    const key = credential.pending?.gen === challenge.gen ? credential.pending.key : credential.key;
    const t = transcript({ ...challenge, instance_id: instanceId, origin, client_nonce: nonce });
    if (!(await verify(key, "server", t, challenge.server_proof)))
      throw new LocalAuthError({ state: "server_unverified" });
    channel.send({ type: "local.auth.prove", v: 1, client_proof: await prove(key, "client", t) });
```

</details>

**依据 7 · 源码核查**：[crates/bsk-cli/src/daemon/peer_authorization.rs:20-45](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/peer_authorization.rs#L20-L45)

服务端绑定浏览器身份并限制 legacy 声称已配对 ID。

<details>
<summary>查看原文（26行）</summary>

```text
    pub fn browser_id<'a>(&'a self, claimed: &'a str) -> &'a str {
        match self {
            Self::Legacy { .. } => claimed,
            Self::Local(peer) => &peer.browser_id,
            Self::Remote(peer) => &peer.device.browser_id,
        }
    }
    pub fn active(&self) -> bool {
        match self {
            Self::Legacy { local, instance } => {
                let mode = local.mode();
                mode.accepts_legacy()
                    && (mode == LocalAuthMode::TrustLocal
                        || instance
                            .as_deref()
                            .is_none_or(|id| !local.store.has_paired_browser(id)))
            }
            Self::Local(peer) => {
                peer.lease.active()
                    && peer.local.store.device(&peer.device_id).is_some_and(|d| {
                        d.status == DeviceStatus::Active
                            && d.browser_id.as_deref() == Some(&peer.browser_id)
                    })
            }
            Self::Remote(peer) => peer.active(),
        }
```

</details>

**依据 8 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:340-351](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ws.rs#L340-L351)

实际注册前校验绑定和授权。

<details>
<summary>查看原文（12行）</summary>

```text
    // Register browser & build outbound sink. Each registration gets a
    // fresh `generation` so a reconnect under the same `instance_id`
    // can be told apart from the previous BrowserClient — the old
    // socket's cleanup path uses `remove_if_generation_matches` to
    // avoid clobbering the newer entry (review M4/M5 round 2 #1).
    let registration = authorization.registration_guard().await;
    if !authorization.bind_instance(&params.instance_id) || !authorization.authorized().await {
        return Err(anyhow!(
            "device authorization ended or browser identity mismatch"
        ));
    }
    let browser_id = BrowserId(authorization.browser_id(&params.instance_id).to_owned());
```

</details>

**依据 9 · 作者声明**：[docs/local-pairing.md:136-146](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/docs/local-pairing.md#L136-L146)

作者明确同账号、明文数据和配对链接边界。

<details>
<summary>查看原文（11行）</summary>

```text
Local pairing protects the connection, not the OS account or websites. It does
not defend against a process that can read the user's browser profile or bsk
home, or against an explicitly trusted server. Local and remote credentials are
not interchangeable; remote deployments still require TLS and device isolation.

The v1 handshake does not encrypt subsequent loopback traffic or prevent a
transparent relay from reading or changing it. An attacker with both the original
pairing link and its first handshake transcript can derive the next key. A stolen
unused link can also be activated first by someone else. Keep links private and
use them promptly; these limitations require a separately reviewed encrypted
record protocol and key exchange to address.
```

</details>

**依据 10 · 源码核查**：[crates/bsk-cli/src/daemon/ipc.rs:1074-1095](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ipc.rs#L1074-L1095)

只向已转发的浏览器请求发送取消。

<details>
<summary>查看原文（22行）</summary>

```text
    let local = state.abort_registry.cancel(&params.rpc_id);
    let mut cancelled = local;
    if !local && let Some(snap) = state.tool_inflight.cancel(&params.rpc_id) {
        cancelled = true;
        // Forward the WS-side cancel only when the worker has
        // already promoted the entry to "forwarded"; queued entries
        // short-circuit on their own pre-flight without ever
        // touching the extension.
        if let (Some(browser_id), Some(ws_rpc_id)) = (snap.browser_id, snap.ws_rpc_id)
            && let Err(err) =
                super::cancel_forward::forward_cancel_to_browser(state, &browser_id, &ws_rpc_id)
        {
            warn!(
                cli_rpc_id = %params.rpc_id,
                browser = %browser_id,
                ws_rpc_id = %ws_rpc_id,
                %err,
                "failed to forward cancel to extension"
            );
        }
    }
    ResponseBody::Ok(serde_json::to_value(CancelResult { cancelled }).unwrap_or(Value::Null))
```

</details>

**依据 11 · 源码核查**：[apps/extension/src/tools/dispatcher.ts:371-394](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/apps/extension/src/tools/dispatcher.ts#L371-L394)

取消回执反映是否找到控制器。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 12 · 源码核查**：[crates/bsk-cli/src/cli/business_rpc.rs:216-247](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/cli/business_rpc.rs#L216-L247)

等待期超时可合成取消，不能由此反推未执行。

<details>
<summary>查看原文（32行）</summary>

```text
        sig = wait_for_cancel(parent_cancel) => {
            sig.context("wait for cancellation").map_err(CliError::Local)?;
            CANCEL_REQUESTED.store(true, Ordering::Relaxed);
            debug!(rpc_id = %rpc_id_for_cancel, "forwarding cancel to daemon");
            // Separate IPC connections can deliver cancel before the business
            // request is registered. Keep polling that request while confirming
            // cancellation, including any write that has not completed yet.
            let deadline = Instant::now() + CANCEL_RESPONSE_GRACE;
            let settle = async {
                tokio::select! {
                    biased;
                    res = &mut main_fut => return res,
                    result = send_cancel(&sock, &rpc_id_for_cancel, deadline) => {
                        if let Err(err) = result {
                            debug!(rpc_id = %rpc_id_for_cancel, %err, "cancel was not confirmed");
                        }
                    },
                }
                main_fut.await
            };
            match timeout_at(deadline, settle).await {
                Ok(res) => res?,
                Err(_) => {
                    debug!(
                        rpc_id = %rpc_id_for_cancel,
                        "cancel grace elapsed; synthesising cancelled error"
                    );
                    return Err(CliError::from_rpc(RpcError {
                        code: ErrorCode::Cancelled,
                        message: "rpc did not respond within cancel grace window".into(),
                        data: None,
                    }));
```

</details>

#### 缺口

- 未验证跨版本认证、撤销竞态和取消前后的真实浏览器状态。
  **影响**：不能把固定源码的身份检查和取消请求当成端到端隔离或网页副作用回滚。
  **进一步探讨**：在独立临时 home 和 profile 测试伪造实例、失效凭据、断线和操作前后中止，保留 daemon、浏览器与网站三份结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本机试用需哪些组件和连接，持续与故障恢复成本如何？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

本机路径需要 bsk CLI、可在同环境通过 IPC 访问的 daemon、目标 Chrome 或 Edge 及其扩展。作者列 Chromium 125 起的支持范围，Agent 使用另需可执行 CLI 和能加载指令的宿主。daemon 握手按协议而非只看应用名拒绝不兼容组件，旧端可能可连接却不支持新控制功能。作者的诊断步骤要求分别查 doctor、扩展连接和 Skill 发现。需要本机身份验证时，另外准备独立 bsk home、配对链接和目标 profile。Rust workspace 声明 0.4.2，不能以根 npm 私有工作区确认商店版或外部安装版本。

首次投入包括安装组件、配置 profile 和权限以及配对正反例；持续使用需模型、浏览器、进程与可能的截图或本地记录。配对撤销会先变更持久记录并断开已登记连接，等待关闭有时限。对端或页面状态需要操作者独立检查，已完成动作没有由配对撤销自动反转的机制。作者说明主动导出的完整 JSON 或视频副本需要另管，结束浏览器任务并不等于删除它们。以完成一次正确页面检查且能核对证据为单位，分别计模型和机器资源、人工配置和复核、失败重试与退出成本，当前未有真实金额或耗时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-88](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L81-L88)

作者提供本机组件和平台要求。

```text
## Quick Start

For local automation, you need **an AI agent + the `bsk` CLI + the browser extension**. The CLI includes the background daemon. The skill teaches your agent how to use it.

| Component | Supported environments |
| --- | --- |
| CLI / daemon | macOS: Apple Silicon and Intel · Linux: x64 and ARM64 · Windows: x64 |
| Extension | Chrome and Microsoft Edge, based on Chromium 125 or later. Other Chromium browsers may work; compatibility is not guaranteed. |
```

**依据 2 · 作者声明**：[README.md:153-159](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L153-L159)

作者区分 doctor、扩展连接和 Skill 可发现性。

````text
#### 4. Check the connection

```sh
bsk doctor
```

Resolve any failed checks and confirm that the extension shows **Connected**. Start a new agent session and check that it can discover `browser-skill`; a successful doctor check alone does not confirm skill discovery.
````

**依据 3 · 源码核查**：[Cargo.toml:9-14](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/Cargo.toml#L9-L14)

固定 Rust workspace 版本。

```text
[workspace.package]
version = "0.4.2"
edition = "2024"
rust-version = "1.85"
license = "MIT"
repository = "https://github.com/Tencent/BrowserSkill"
```

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/ws.rs:294-327](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/ws.rs#L294-L327)

真实握手按协议版本决定拒绝或兼容。

<details>
<summary>查看原文（34行）</summary>

```text
    // Version compatibility (design §10, M10.4): protocol_version only.
    let our_app_version: Version = env!("CARGO_PKG_VERSION")
        .parse()
        .expect("CARGO_PKG_VERSION must be a valid semver");
    let legacy_min_peer: Version = LEGACY_MIN_COMPATIBLE_PEER
        .parse()
        .expect("LEGACY_MIN_COMPATIBLE_PEER must be a valid semver");
    let compat = evaluate_handshake_compat(
        &params.protocol_version,
        params.min_compatible_protocol.as_deref(),
        PROTOCOL_VERSION,
        MIN_COMPATIBLE_PROTOCOL,
    );
    let version_skew = match compat {
        HandshakeCompat::Reject { reason } => {
            let resp = ResponseFrame {
                id: request.id.clone(),
                body: ResponseBody::Err(RpcError {
                    code: bsk_protocol::ErrorCode::VersionTooOld,
                    message: reason.clone(),
                    data: Some(serde_json::json!({
                        "peer_protocol_version": params.protocol_version,
                        "peer_version": params.version.to_string(),
                        "daemon_protocol_version": PROTOCOL_VERSION,
                        "daemon_version": our_app_version.to_string(),
                        "min_compatible_protocol": MIN_COMPATIBLE_PROTOCOL,
                    })),
                }),
            };
            let _ = writer
                .send(Message::Text(serde_json::to_string(&resp)?))
                .await;
            return Err(anyhow!("kicked: {reason}"));
        }
```

</details>

**依据 5 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/lifecycle.rs:89-110](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/lifecycle.rs#L89-L110)

撤销后的连接关闭有状态确认和超时。

<details>
<summary>查看原文（22行）</summary>

```text
        let mut connections = state.local_auth.lifecycle.connections.lock().unwrap();
        for id in ids {
            if let Some(connection) = connections.remove(id) {
                connection.active.store(false, Ordering::Release);
                if let Some(browser) = connection.browser.upgrade() {
                    remove_browser(state, &browser);
                }
                closing.push(connection.closed);
            }
        }
    }
    state.local_auth.lifecycle.notify();
    for mut closed in closing {
        tokio::time::timeout(Duration::from_secs(2), async {
            while !*closed.borrow_and_update() {
                if closed.changed().await.is_err() {
                    break;
                }
            }
        })
        .await
        .map_err(|_| anyhow::anyhow!("authorization revoked; connection shutdown timed out"))?;
```

</details>

**依据 6 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/lifecycle.rs:141-159](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/lifecycle.rs#L141-L159)

先持久撤销再断开登记连接。

<details>
<summary>查看原文（19行）</summary>

```text
    let mut guards = Vec::new();
    for id in &ids {
        guards.push(state.local_auth.device_gate(id).lock_owned().await);
    }
    // Also covers a newly issued record that appeared after the --all snapshot:
    // no final check/insert may cross the durable revocation of all records.
    let registry = state
        .local_auth
        .lifecycle
        .registry_gate
        .clone()
        .lock_owned()
        .await;
    let local = state.local_auth.clone();
    let revoked = tokio::task::spawn_blocking(move || local.store.revoke(id.as_deref())).await??;
    disconnect(&state, &revoked).await?;
    drop(registry);
    drop(guards);
    Ok(())
```

</details>

**依据 7 · 作者声明**：[README.md:290-295](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/README.md#L290-L295)

作者说明按类型保存及导出副本的保留条件。

```text
| Optional history and recordings | Where it is saved | What to know |
| --- | --- | --- |
| **Website debugging** | The current browser profile, including in remote mode | Retains captured evidence, including available bodies and field values. Stopped records expire after 30 days, with a 50-record / 50 MiB retention budget and earlier eviction when necessary. Stop capture before deleting a record. |
| **Operation audit** | The daemon's host, under `BSK_HOME/audit` | Off by default. Records task and operation metadata, excluding input values, page bodies, screenshots, and file contents. Ended tasks expire after 30 days. |
| **Task video** | The current browser profile; exported copies at the chosen destination | Opt-in, silent capture of one authorized tab, limited to 10 minutes / 256 MiB per video. Recordings expire 24 hours after creation; the temporary video budget is 1 GiB. The library supports preview, export and deletion. |
| **Saved observations and step results** | An explicitly chosen JSON path on the CLI machine, including a remote server | `--save-full` / DSH `saveFull` saves the complete reply before display filtering. Files have no automatic expiry; delete them on that machine. `view` reads historical evidence without refreshing the browser state. |
```

#### 缺口

- 缺平台上的组件组合、页面运行资源和恢复工时。
  **影响**：不能估计部署成本或从协议声明得出目标浏览器可运行。
  **进一步探讨**：在指定版本试一次只读工作负载，记录冷启动、稳态、重连和退出的资源与耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证拒绝未知连接后仍可安全完成只读任务？

**研究主题**：新假设与验证、采用判断

#### 完整回答

使用可销毁的浏览器测试 profile 和独立 daemon home 试做只读查询，指定正确浏览器实例，核对页面独有标记后记录结果。对在敏感登录态使用的场景，先核对扩展显示已验证，再对无配对的连接做拒绝验证。Required 是现有可选模式。待验证的是将该模式、已验证设备和只读页面验收组合成一份部署准入步骤，能否减少误把连接成功当成身份正确，同时保留正常重连和人工恢复。它增加一次显式配置和设备核对，并不改变协议本身。

在同样两个测试 profile 下，对照 Warn 的默认流程与上述准入，分别尝试已配对重连、陌生实例、撤销及取消后的再观察。记录误接纳、正确设备误拒、恢复时长和页面结果。若强制设置后仍有未验证实例可接手，或正确设备恢复阻塞无法接受，停止 Agent 自动化并改用测试浏览器人工检查。保持配对验证，先查 home、端口和版本，再处理有权限的重配。

#### 证据与依据

**依据 1 · 作者声明**：[docs/local-pairing.md:122-139](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/docs/local-pairing.md#L122-L139)

作者说明 Warn、Required 和两边认证的适用范围。

<details>
<summary>查看原文（18行）</summary>

```text
The CLI defaults to **Warn**: unpaired local connections remain available without
an authentication probe. The extension uses the same rule for fresh installs and
upgrades. Eligibility flags, previous versions and compatibility deadlines do not
control whether an unpaired browser can connect.

After activation, an unverified connection cannot claim that paired browser's
identity, including after its key is revoked. This does not force unrelated old
extensions to pair. Explicit TrustLocal mode bypasses this protection; the daemon
and extension both retain their separately confirmed bypass controls.

Users who want to reject every unpaired connection can explicitly run
`bsk daemon trust-local off`, which selects **Required**. Neither installing nor
pairing a browser automatically enables that policy for other browsers.

Local pairing protects the connection, not the OS account or websites. It does
not defend against a process that can read the user's browser profile or bsk
home, or against an explicitly trusted server. Local and remote credentials are
not interchangeable; remote deployments still require TLS and device isolation.
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/mod.rs:12-34](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/mod.rs#L12-L34)

可配置策略与 legacy 选择条件提供对照基线。

<details>
<summary>查看原文（23行）</summary>

```text
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LocalAuthMode {
    #[default]
    Warn,
    Required,
    TrustLocal,
}
impl LocalAuthMode {
    pub fn accepts_legacy(self) -> bool {
        self != Self::Required
    }
}

#[derive(Default, Serialize, Deserialize)]
struct Settings {
    local_auth: Option<LocalAuthMode>,
    #[serde(flatten)]
    other: std::collections::BTreeMap<String, serde_json::Value>,
}
pub fn read_mode(home: &Path) -> Result<LocalAuthMode> {
    let settings: Settings = super::json_store::read(&home.join("settings.json"))?;
    Ok(settings.local_auth.unwrap_or_default())
```

</details>

**依据 3 · 源码核查**：[crates/bsk-cli/src/daemon/peer_authorization.rs:27-45](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/peer_authorization.rs#L27-L45)

已绑定设备与 legacy peer 的具体校验差异。

<details>
<summary>查看原文（19行）</summary>

```text
    pub fn active(&self) -> bool {
        match self {
            Self::Legacy { local, instance } => {
                let mode = local.mode();
                mode.accepts_legacy()
                    && (mode == LocalAuthMode::TrustLocal
                        || instance
                            .as_deref()
                            .is_none_or(|id| !local.store.has_paired_browser(id)))
            }
            Self::Local(peer) => {
                peer.lease.active()
                    && peer.local.store.device(&peer.device_id).is_some_and(|d| {
                        d.status == DeviceStatus::Active
                            && d.browser_id.as_deref() == Some(&peer.browser_id)
                    })
            }
            Self::Remote(peer) => peer.active(),
        }
```

</details>

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/local_auth/lifecycle.rs:141-159](https://github.com/Tencent/BrowserSkill/blob/9084a36e138ee0c2c0d78fa9b4e64bff9d397c65/crates/bsk-cli/src/daemon/local_auth/lifecycle.rs#L141-L159)

撤销可作为重连验证的一种处理条件。

<details>
<summary>查看原文（19行）</summary>

```text
    let mut guards = Vec::new();
    for id in &ids {
        guards.push(state.local_auth.device_gate(id).lock_owned().await);
    }
    // Also covers a newly issued record that appeared after the --all snapshot:
    // no final check/insert may cross the durable revocation of all records.
    let registry = state
        .local_auth
        .lifecycle
        .registry_gate
        .clone()
        .lock_owned()
        .await;
    let local = state.local_auth.clone();
    let revoked = tokio::task::spawn_blocking(move || local.store.revoke(id.as_deref())).await??;
    disconnect(&state, &revoked).await?;
    drop(registry);
    drop(guards);
    Ok(())
```

</details>

#### 缺口

- 无准入流程的接受、拒绝和恢复时间数据。
  **影响**：无法证明操作收益或兼容边界。
  **进一步探讨**：事先定义误接受与可接受恢复时间，按固定版本记录配对、撤销和重连结果。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
