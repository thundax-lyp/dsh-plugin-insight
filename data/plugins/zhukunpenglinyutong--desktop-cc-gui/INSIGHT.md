# Desktop CC GUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3974809](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/39748094764434fd1836c84a1b5d9a803e37fce4)

<!-- BEGIN META -->
[![GitHub ★ 4,553](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C553&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
<!-- END META -->

> **功能**：以独立桌面界面接入 DSH 和多种编码引擎。

> **亮点**：持久 host session 与结构化流接入多引擎桌面，而非终端截屏或 DSH 原生插件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：普通 DSH 工具审批自动 allowed-once；计划评审是独立流程且软约束，不是只读沙箱。[Q03](#research-q03)

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
  - [Q01 · 谁需要这个客户端，与 DSH 原生入口有何区别？](#detail-section-11)
  - [Q02 · DSH 会话怎样连接、恢复并接收流？](#detail-section-12)
  - [Q03 · 普通工具审批与计划审批是否相同？](#detail-section-13)
  - [Q04 · 采用和恢复需要哪些条件？](#detail-section-14)
  - [Q05 · 如何减少统一界面隐藏各引擎权限差异？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时使用多种编码引擎并希望统一项目、会话和输出的开发者；单引擎可比较原生入口。[Q01](#research-q01)

多个 CLI 终端或 DSH 原生 Web；客户端增加统一入口也增加一层维护。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH host 会话 | 项目和结构化输出 | 需兼容 host |
| 计划评审 | typed plan review | 需 plan 插件，非只读沙箱 |
| 工具审批 | 响应 host 请求 | 普通审批自动允许一次 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Tauri 桌面客户端 | 必需 | 统一界面 | 无法使用 |
| 兼容 DSH CLI 与 host | DSH 必需 | 会话与工具 | 启动失败 |
| plan-mode 插件 | 计划评审必需 | typed 评审 | 拒绝进入 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 配置 | 固定客户端和 DSH 版本 | 核对模型与 host |
| 会话 | 在隔离工作区建立及恢复 | 核对输出与 session |
| 权限 | 核对当前模式及工具动作 | 不满足人工授权要求则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 应用和 host 环境 | 各引擎认证与配置 | 宿主兼容性未测 |
| 持续 | 模型与工具费用未知 | 检查结果及权限 | 节约未对照 |
| 恢复 | 日志和 host 资源 | 处理凭据及悬挂评审 | host 重启会失去悬挂评审 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话接入 | host session 与结构化流 | 实际恢复可靠性 |
| 计划评审 | typed 路径和命令探测 | 通用工具人工审批 |

> **思考**：普通 DSH 工具审批自动 allowed-once；计划评审是独立流程且软约束，不是只读沙箱。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：持久 host session 与结构化流接入多引擎桌面，而非终端截屏或 DSH 原生插件。[Q01](#research-q01) [Q02](#research-q02)

尽力等待流就绪，事件 client 缺失时警告并可能继续 prompt；计划模式探测命令并等待回读，普通工具审批另走自动允许路径。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

普通 DSH 工具审批自动 allowed-once；计划评审是独立流程且软约束，不是只读沙箱。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

固定 host 和客户端，在隔离工作区验证会话与权限；不满足权限要求时回退原生入口。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码显示 host session 与普通审批和 typed plan-review 路径；未运行客户端、host、模型或工具。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、package.json、src-tauri/src/dsh_host.rs、src-tauri/src/engine/dsh.rs、src-tauri/src/engine/dsh_session.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 1211 个指定扩展名文件、排除 3、解析错误 0；静态核查 DSH 代表路径，不覆盖所有引擎和宿主运行。
- 下一步：隔离环境验证 host、会话恢复、普通审批、plan review、重启和外部工具行为。

**分析版本**

- **仓库**：[zhukunpenglinyutong/desktop-cc-gui](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
- **版本号**：1.2.1（[固定提交 3974809](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/39748094764434fd1836c84a1b5d9a803e37fce4)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：发送前按引擎与实测 host 能力分别展示工具审批、计划评审与沙箱状态，可降低误解；须验证过期和误导。[Q05](#research-q05)

隔离环境验证 host、会话恢复、普通审批、plan review、重启和外部工具行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 273 | 69802 | — | — | 548886 |
| .mjs | source | 3 | 515 | 432 | 41 | — |
| .js | source | 10 | 2966 | 2608 | 184 | — |
| .ts | source | 329 | 59997 | 47741 | 8936 | — |
| .tsx | source | 258 | 58885 | 50646 | 5776 | — |
| .ts | test | 168 | 25785 | 22213 | 1150 | — |
| .tsx | test | 168 | 35067 | 29828 | 1738 | — |
| .md | test | 1 | 368 | — | — | 3820 |
| .jsx | test | 1 | 53 | 52 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 331](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=331&color=737b86&logo=github)](https://github.com/zhukunpenglinyutong/desktop-cc-gui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/zhukunpenglinyutong/desktop-cc-gui/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhukunpenglinyutong/desktop-cc-gui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面客户端如何接入 DSH host，其普通工具审批与计划评审边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个客户端，与 DSH 原生入口有何区别？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Desktop CC GUI 是独立 Tauri 应用，面向同时使用多个编码引擎、想统一项目、会话与工具输出的开发者；不是通过 DSH plugin add 安装的原生插件。相比多个终端或 DSH Web，统一界面可能减少切换，但额外承担客户端、各 CLI、模型认证及版本兼容的维护；只用一个引擎时原生入口可能更简单。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh-CN.md:135-140](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/README.zh-CN.md#L135-L140)

DSH 的安装、host 和模型归属。

```text
### 使用 DeepSeek Harness（DSH）

1. 在本机安装 DSH CLI，并在 DSH 自身中配置模型与 API key——不要把它当成 ccgui 里的另一套 vendor preset。
2. 在设置 → DeepSeek Harness 中，ccgui 可以接管本机已运行的 `dsh web` host，也可以自动拉起一个。
3. 在输入框引擎选择器中选中 **DeepSeek Harness**。对话走 DSH 的 headless profile；模型与凭证仍归 DSH 管理。
4. 支持图片附件（粘贴、选择或拖入）。对于在 DSH 中添加的自定义供应商（`llm-pi-ai` 路由），ccgui 会在发送前自动为该路由声明图片输入能力——无需手动修改 DSH 设置；官方适配器会自行上报能力。
```

**依据 2 · 源码核查**：[README.zh-CN.md:202-202](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/README.zh-CN.md#L202-L202)

Tauri 与 Rust 后端。

```text
| 桌面框架 | Tauri 2（Rust 后端：git2、rusqlite、portable-pty、axum） |
```

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh.rs:1-7](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh.rs#L1-L7)

DSH host-session 接入。

```text
//! DeepSeek Harness (dsh) engine — host-session variant.
//!
//! 0.1.2's durable streaming lives on the host (`/api/remote.mux` follow
//! stream with the `assistantStream` opt-in), so the engine drives its own
//! transport ([`Engine::drives_own_transport`]) instead of spawning a child
//! process: the turn runs as a host session (create → prompt → deltas),
//! projected in [`super::dsh_session::run_host_turn`]. The host itself is
```

#### 缺口

- 本轮未运行 Tauri、DSH host 或模型
  **影响**：无法证明桌面交互、恢复、权限和实际工具执行
  **进一步探讨**：固定宿主和客户端版本，用隔离工作区验证会话与审批

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 会话怎样连接、恢复并接收流？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端先确保 host 存在，按路径创建 workspace，再传可选 native session ID 创建或恢复 session；先打开并等待 follow 快照及事件通道就绪；事件 client ID 未取得时仅警告，仍可继续发送 prompt，提问请求可能被跳过。host 管理代码说明能接管或拉起服务并为 origin 保存认证 cookie；此为源码路径，不证明断线重连、真实会话一致性或各宿主版本兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:195-225](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L195-L225)

host、workspace、session 创建。

<details>
<summary>查看原文（31行）</summary>

```text
    // The host must be up before anything else: ensure adopts or spawns it
    // (serialized internally, so a chat send racing autostart is safe).
    let settings = crate::settings::read_settings().unwrap_or_default();
    let origin = crate::dsh_host::configured_origin(&settings);
    crate::dsh_host::ensure_host(host, &settings).await?;
    let cookie = crate::dsh_host::host_cookie(&origin);

    // Workspace: registered by path so resumed sessions keep their identity.
    let workspace = host_call(
        &origin,
        "workspace/create",
        json!({ "request": { "path": req.workspace.to_string_lossy() } }),
    )
    .await?
    .pointer("/workspace/workspaceId")
    .and_then(Value::as_str)
    .map(str::to_string)
    .ok_or("workspace/create 未返回 workspaceId")?;

    // Session continuity: codemoss passes back the native id it received via
    // the "session" event; a fresh id comes back for a new conversation.
    let mut create_args = json!({ "request": { "workspaceId": workspace } });
    if let Some(session_id) = req.session_id.as_deref() {
        create_args["request"]["sessionId"] = Value::String(session_id.to_string());
    }
    let session_id = host_call(&origin, "session/create", create_args)
        .await?
        .pointer("/sessionId")
        .and_then(Value::as_str)
        .map(str::to_string)
        .ok_or("session/create 未返回 sessionId")?;
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:275-297](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L275-L297)

尝试等待流后发起，事件通道未就绪仅警告。

<details>
<summary>查看原文（23行）</summary>

```text
    // Streams must be live before the prompt so no turn event races the
    // subscription: the follow snapshot proves the follow subscription landed,
    // and the $events ready frame carries the clientId every question answer
    // needs. Waiting for both kills the race where a waterfall frame arrived
    // before the ready frame and the question was skipped as "未就绪".
    let opened = ws_open_and_wait(&mut ws, &session_id).await;
    view.events_client_id = opened.events_client_id;
    if view.events_client_id.is_none() {
        core.dispatch_event(
            state,
            EngineEvent::Warn("提问通道未就绪，本轮中的提问请求将被跳过".to_string()),
        );
    }
    if plan_mode {
        // 进入 plan 模式：commands/execute "/plan"，并等 follow 流回读
        // plan/mode{active:true} 提交后才允许下发 prompt（事件回读确认）。
        enter_plan_mode(&origin, &session_id, &mut ws, opened.plan_active).await?;
    }

    let mut prompt_request = json!({
        "requestId": format!("codemoss-{}", uuid::Uuid::new_v4()),
        "sessionId": session_id,
        "mode": "queue",
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/dsh_host.rs:1-21](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/dsh_host.rs#L1-L21)

host 接管、凭据及进程归属。

<details>
<summary>查看原文（21行）</summary>

```text
//! DeepSeek Harness (DSH) local-host maintenance: probe/adopt/spawn/stop the
//! `dsh web` server. CLI version/update lives in [`crate::cli_lifecycle`].
//!
//! Wire protocol (0.1.2+ typert gateway, verified against tmd-cli's cli-dsh):
//! `POST {origin}/api/<namespace>/<method>` with
//! `{type:"client-request",rpcId,method,payload:{args}}` →
//! `{type:"server-response",rpcId,result:{ok:true,value}|{ok:false,error}}`.
//!
//! BrowserAuth (0.1.2+): every RPC requires the signed `dsh-auth-*` cookie.
//! Credential chain: the spawned host prints a one-time launch token
//! (`dsh web: http://…/?token=…`) on its output; we capture it, exchange it
//! via `GET /?token=…` (303 + set-cookie, no redirects), and persist the
//! cookie per-origin in `~/.ccgui-next/dsh-host-credentials.json`. A host
//! that answers with 401 is alive but credential-locked: local listeners are
//! stopped so we can respawn with our own token chain (credentials are ours
//! to manage), remote origins can't be adopted.
//!
//! Ownership rule: only hosts we spawned are tracked in [`DshHostState`] and
//! killed (app exit / dsh_host_stop). A pre-existing host answering describe
//! is adopted and never killed — except via dsh_host_stop's local-listener
//! termination, which only ever targets loopback addresses.
```

</details>

#### 缺口

- 本轮未运行 Tauri、DSH host 或模型
  **影响**：无法证明桌面交互、恢复、权限和实际工具执行
  **进一步探讨**：固定宿主和客户端版本，用隔离工作区验证会话与审批

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 普通工具审批与计划审批是否相同？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

固定版本中，普通 approval/request 在事件 client 就绪时自动回答 allowed-once；用户提问停放等待卡片回应。与此同时新增的 plan 模式是单独 typed plan-review 流：先探测 host 的 plan 命令、进入并等状态回读，失败不降级 auto；其声明仍是软行为引导，不是只读沙箱，host 重启悬挂评审丢失。旧正式研究仅强调自动审批，不能因此遗漏当前版的计划评审，也不能把计划评审当一般工具人工授权。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:670-698](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L670-L698)

问题停放与普通审批自动 allowed-once。

<details>
<summary>查看原文（29行）</summary>

```text
        Some("waterfall") => {
            let Some(event_id) = value.get("eventId").and_then(Value::as_str) else {
                return;
            };
            let kind = value.get("event").and_then(Value::as_str).unwrap_or("");
            let Some(client_id) = view.events_client_id.clone() else {
                core.dispatch_event(
                    state,
                    EngineEvent::Warn("收到审批/提问请求但事件通道未就绪，已跳过".to_string()),
                );
                return;
            };
            // Questions park host-side until the user answers from the card
            // (answer_question posts the outcome); approvals keep the v1
            // auto-allow policy; unknown waterfall kinds reject as before.
            if kind == "user-questions/request" {
                park_question(core, state, view, value, origin, &client_id, event_id).await;
                return;
            }
            // v1 policy: approvals auto-allow — API-created sessions already
            // run tools without a permission flow (the headless engine had
            // the same implicit behavior), and codemoss has no approval UI
            // for host sessions yet.
            let (outcome, notice) = if kind == "approval/request" {
                (json!({ "kind": "result", "value": "allowed-once" }), None)
            } else {
                (
                    json!({
                        "kind": "rejected",
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:227-232](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L227-L232)

plan 命令缺失受控拒绝。

```text
    // 计划审批模式（PRD §5-DSH.2）：先经 commands/list 探测 host 是否组合了
    // plan-mode 插件，缺失即受控报错——HTTP 200 不等于命令存在，绝不降级
    // auto 执行。
    let plan_mode = req.permission.as_deref() == Some("plan");
    if plan_mode {
        ensure_plan_command(&origin, &session_id).await?;
```

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:288-291](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L288-L291)

进入 plan 等状态回读。

```text
    if plan_mode {
        // 进入 plan 模式：commands/execute "/plan"，并等 follow 流回读
        // plan/mode{active:true} 提交后才允许下发 prompt（事件回读确认）。
        enter_plan_mode(&origin, &session_id, &mut ws, opened.plan_active).await?;
```

**依据 4 · 源码核查**：[src-tauri/src/engine/dsh.rs:43-55](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh.rs#L43-L55)

typed plan review 及非只读限制。

<details>
<summary>查看原文（13行）</summary>

```text
    /// DSH 的人工计划审批经 commands/execute "/plan" 进入、plan-review
    /// presentation intent 等待（0.1.5-rc.1 源码已证实完整协议，适配器见
    /// dsh_session::park_plan_review / enter_plan_mode）。
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
```

</details>

#### 缺口

- 本轮未运行 Tauri、DSH host 或模型
  **影响**：无法证明桌面交互、恢复、权限和实际工具执行
  **进一步探讨**：固定宿主和客户端版本，用隔离工作区验证会话与审批

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和恢复需要哪些条件？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需安装 Tauri 客户端和兼容 DSH CLI/host，模型与凭证在 DSH 配置；客户端可能接管已有 host 或启动本机 host。plan 依赖组合 plan-mode，host 重启会失去悬挂评审；凭据持久化与日志、进程所有权也需运维。先固定版本和独立工作区核对会话、权限及工具结果；需要逐工具人工审批、出现错绑或无法验证副作用时停止，回到原生入口。未实测时间、成本或恢复行为。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh-CN.md:135-140](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/README.zh-CN.md#L135-L140)

DSH 依赖与模型配置。

```text
### 使用 DeepSeek Harness（DSH）

1. 在本机安装 DSH CLI，并在 DSH 自身中配置模型与 API key——不要把它当成 ccgui 里的另一套 vendor preset。
2. 在设置 → DeepSeek Harness 中，ccgui 可以接管本机已运行的 `dsh web` host，也可以自动拉起一个。
3. 在输入框引擎选择器中选中 **DeepSeek Harness**。对话走 DSH 的 headless profile；模型与凭证仍归 DSH 管理。
4. 支持图片附件（粘贴、选择或拖入）。对于在 DSH 中添加的自定义供应商（`llm-pi-ai` 路由），ccgui 会在发送前自动为该路由声明图片输入能力——无需手动修改 DSH 设置；官方适配器会自行上报能力。
```

**依据 2 · 源码核查**：[src-tauri/src/dsh_host.rs:9-21](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/dsh_host.rs#L9-L21)

cookie 与 host 生命周期。

<details>
<summary>查看原文（13行）</summary>

```text
//! BrowserAuth (0.1.2+): every RPC requires the signed `dsh-auth-*` cookie.
//! Credential chain: the spawned host prints a one-time launch token
//! (`dsh web: http://…/?token=…`) on its output; we capture it, exchange it
//! via `GET /?token=…` (303 + set-cookie, no redirects), and persist the
//! cookie per-origin in `~/.ccgui-next/dsh-host-credentials.json`. A host
//! that answers with 401 is alive but credential-locked: local listeners are
//! stopped so we can respawn with our own token chain (credentials are ours
//! to manage), remote origins can't be adopted.
//!
//! Ownership rule: only hosts we spawned are tracked in [`DshHostState`] and
//! killed (app exit / dsh_host_stop). A pre-existing host answering describe
//! is adopted and never killed — except via dsh_host_stop's local-listener
//! termination, which only ever targets loopback addresses.
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh.rs:43-55](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh.rs#L43-L55)

plan-mode 依赖及重启限制。

<details>
<summary>查看原文（13行）</summary>

```text
    /// DSH 的人工计划审批经 commands/execute "/plan" 进入、plan-review
    /// presentation intent 等待（0.1.5-rc.1 源码已证实完整协议，适配器见
    /// dsh_session::park_plan_review / enter_plan_mode）。
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
```

</details>

#### 缺口

- 本轮未运行 Tauri、DSH host 或模型
  **影响**：无法证明桌面交互、恢复、权限和实际工具执行
  **进一步探讨**：固定宿主和客户端版本，用隔离工作区验证会话与审批

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少统一界面隐藏各引擎权限差异？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：在发送前依据当前引擎与 host 实测能力显示“工具自动允许、计划评审、软模式/沙箱”等独立标签，可能减少用户误认；已有 typed plan-review、命令探测及事件警告是反证，不应说完全没有信息。显示可能过期或将推断误称保证；对照现有界面，以 host 缺 plan、普通审批、重启及并发会话场景测权限误判、过期率、执行偏差和人工负担；若无改进或误导率高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh.rs:43-55](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh.rs#L43-L55)

已有 plan 类型与限制。

<details>
<summary>查看原文（13行）</summary>

```text
    /// DSH 的人工计划审批经 commands/execute "/plan" 进入、plan-review
    /// presentation intent 等待（0.1.5-rc.1 源码已证实完整协议，适配器见
    /// dsh_session::park_plan_review / enter_plan_mode）。
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:670-698](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L670-L698)

普通审批策略和事件未就绪警告。

<details>
<summary>查看原文（29行）</summary>

```text
        Some("waterfall") => {
            let Some(event_id) = value.get("eventId").and_then(Value::as_str) else {
                return;
            };
            let kind = value.get("event").and_then(Value::as_str).unwrap_or("");
            let Some(client_id) = view.events_client_id.clone() else {
                core.dispatch_event(
                    state,
                    EngineEvent::Warn("收到审批/提问请求但事件通道未就绪，已跳过".to_string()),
                );
                return;
            };
            // Questions park host-side until the user answers from the card
            // (answer_question posts the outcome); approvals keep the v1
            // auto-allow policy; unknown waterfall kinds reject as before.
            if kind == "user-questions/request" {
                park_question(core, state, view, value, origin, &client_id, event_id).await;
                return;
            }
            // v1 policy: approvals auto-allow — API-created sessions already
            // run tools without a permission flow (the headless engine had
            // the same implicit behavior), and codemoss has no approval UI
            // for host sessions yet.
            let (outcome, notice) = if kind == "approval/request" {
                (json!({ "kind": "result", "value": "allowed-once" }), None)
            } else {
                (
                    json!({
                        "kind": "rejected",
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:227-232](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/39748094764434fd1836c84a1b5d9a803e37fce4/src-tauri/src/engine/dsh_session.rs#L227-L232)

现有 plan 命令探测。

```text
    // 计划审批模式（PRD §5-DSH.2）：先经 commands/list 探测 host 是否组合了
    // plan-mode 插件，缺失即受控报错——HTTP 200 不等于命令存在，绝不降级
    // auto 执行。
    let plan_mode = req.permission.as_deref() == Some("plan");
    if plan_mode {
        ensure_plan_command(&origin, &session_id).await?;
```

#### 缺口

- 本轮未运行 Tauri、DSH host 或模型
  **影响**：无法证明桌面交互、恢复、权限和实际工具执行
  **进一步探讨**：固定宿主和客户端版本，用隔离工作区验证会话与审批

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
