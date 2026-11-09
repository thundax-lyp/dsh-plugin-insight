# Desktop CC GUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1c2888f](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/1c2888ff7ff74951643fa20a15054ed69e1fe584)

<!-- BEGIN META -->
[![GitHub ★ 4,582](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C582&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
<!-- END META -->

> **功能**：多引擎 AI 编码桌面客户端，接入 DSH 原生宿主会话和结构化事件流。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比逐个切换原生入口，桌面界面将多个引擎的项目与会话放在同一处。DSH 使用独立宿主传输，原生 ID 和结构化事件接进客户端记录。

> **主要限制**：[Q03](#research-q03) 普通 DSH 工具审批自动回 allowed-once。计划模式的 active 回读及 typed 评审是另一层控制，批准送达只进入 Starting，当前工作区实际权限取决于宿主。

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
  - [Q01 · 谁会在多引擎桌面使用 DSH，有何增量？](#detail-section-11)
  - [Q02 · 发送一条 DSH 消息如何接上宿主、会话与输出？](#detail-section-12)
  - [Q03 · 普通工具审批、计划评审与执行限制分别是什么？](#detail-section-13)
  - [Q04 · 谁提供引擎、模型、凭据和恢复能力？](#detail-section-14)
  - [Q05 · 怎样比较能力显示与原生入口并决定试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时使用多种编码引擎的开发者希望从一个桌面界面访问同一项目，确认每次发送的引擎、会话、工具结果和结束状态。[Q01](#research-q01)

只用 DSH 的开发者可从原生宿主查看权限、工具和会话。多引擎开发者若分别使用原生入口，需要切换项目和会话界面。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多引擎桌面界面 | 按项目选择编码引擎 | 本轮只核对 DSH 代表路径 |
| DSH 宿主会话 | 接入原生 ID、工具和流 | 依赖可用本地宿主，断流先核对 |
| 计划评审 | 读取计划并回应宿主 | 需宿主确认，普通审批仍自动 |
| 本地宿主管理 | 采用已有宿主或启动自己的进程 | 停止只处理自身子进程 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 系统相符的 Tauri 应用 | 桌面使用必需 | 项目、会话、结果界面 | 使用原生入口 |
| 兼容 DSH CLI 和 host、DSH 模型配置 | DSH 会话必需 | 工作区和会话执行 | 检查端口、版本和模型 |
| plan-mode 命令与确认 | 计划评审必需 | 进入 active 并送审 | 拒绝发送计划请求 |
| 低权限本地宿主与可销毁目录 | 本轮试用需要 | 限定工具影响 | 先使用具备相应授权的原生环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者确认 DSH 宿主、模型、权限和本地目录 | 记录版本和预期限制 |
| 会话 | 发送一次非敏感读取，记录原生会话 ID | 核对引擎、工具和宿主终态 |
| 比较 | 选做受控缺失事件或计划能力的对照 | 记录 prompt 是否已发、审批是否独立 |
| 退出 | 核对未知效果与原生状态 | 停止发新请求，按权限回到原生环境 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 桌面、宿主和各引擎环境 | 配置版本、模型和权限 | 安装时间未测 |
| 持续 | 模型、工具、日志与本地状态 | 校验引擎、用量和审批 | 节约未对照 |
| 失败恢复 | 保留日志和状态，重试可能追加调用 | 核对宿主结果及待审请求 | 断流或重启恢复未测 |
| 退出 | 原生 DSH 及必要备份 | 核对会话、应用记录和凭据 | 本地与原生记录的迁移完整性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同一界面使用 DSH | 宿主接入、会话 ID 与结构化流 | 多平台与真实切换节省 |
| 计划评审 | 宿主命令检查、active 确认和原生回应 | 实际工具执行和重启恢复 |
| 普通工具审批 | 事件到达后客户端自动允许一次 | 宿主各权限设置与工具的实际隔离 |

> **思考**：[Q03](#research-q03) 普通 DSH 工具审批自动回 allowed-once。计划模式的 active 回读及 typed 评审是另一层控制，批准送达只进入 Starting，当前工作区实际权限取决于宿主。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比逐个切换原生入口，桌面界面将多个引擎的项目与会话放在同一处。DSH 使用独立宿主传输，原生 ID 和结构化事件接进客户端记录。

[Q02](#research-q02) 宿主管理、会话寻址和双流事件转换分层，普通请求对流未就绪采用有限等待。[Q03](#research-q03) 计划另需宿主 active，批准与执行终态分开记录。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 普通 DSH 工具审批自动回 allowed-once。计划模式的 active 回读及 typed 评审是另一层控制，批准送达只进入 Starting，当前工作区实际权限取决于宿主。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 仅用低权限宿主和本地可销毁工作区试一次非敏感读取。出现逐工具人工审批要求、流中断或未知副作用时，停发并查原生记录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定客户端源码支持 DSH 宿主、会话、有限等待及评审通路。客户端 Done、计划批准和宿主工具效果需要分别核对。没有运行客户端或宿主，计划能力分项的收益待测。

- 已检查：作者 README、包清单、源码路径 README.md、src-tauri/tauri.conf.json、src-tauri/src/engine/dsh.rs、src-tauri/src/engine/mod.rs、src-tauri/src/engine/dsh_session.rs、src-tauri/src/lib.rs、src-tauri/src/dsh_host.rs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 1.2.2 根客户端和 DSH 文本会话代表路径，含计划和普通审批。未运行目标、实测全部 OS 或审计其他引擎。
- 下一步：[Q05](#research-q05) 对照相同请求在 CC GUI 与原生 DSH 的会话 ID、工具和结束状态，并受控验证事件丢失、缺 plan 及重启。

**分析版本**

- **仓库**：[zhukunpenglinyutong/desktop-cc-gui](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
- **版本号**：1.2.2（[固定提交 1c2888f](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/1c2888ff7ff74951643fa20a15054ed69e1fe584)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 分开展示普通审批、计划确认和宿主实际限制，并标示探测时效或未知，可能减少开发者把评审当执行隔离的情况。比较权限误判及错误重发。

[Q05](#research-q05) 对照相同请求在 CC GUI 与原生 DSH 的会话 ID、工具和结束状态，并受控验证事件丢失、缺 plan 及重启。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 276 | 70837 | — | — | 577303 |
| .mjs | source | 4 | 563 | 464 | 52 | — |
| .js | source | 10 | 2966 | 2608 | 184 | — |
| .ts | source | 334 | 61107 | 48519 | 9208 | — |
| .tsx | source | 262 | 59792 | 51321 | 5988 | — |
| .ts | test | 177 | 26971 | 23174 | 1241 | — |
| .tsx | test | 175 | 36317 | 30872 | 1813 | — |
| .md | test | 1 | 368 | — | — | 3820 |
| .jsx | test | 1 | 53 | 52 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/zhukunpenglinyutong/desktop-cc-gui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者怎样用独立桌面客户端切换编码引擎并可靠使用 DSH 会话，哪些事件流、普通权限和计划评审边界会改变试用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会在多引擎桌面使用 DSH，有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在同一项目跨 Claude Code、Codex CLI、DSH 等引擎工作并需要统一查看会话与输出的开发者，可用 CC GUI 做引擎选择、项目导航及结构化记录。合格结果要能确认当前引擎、原生会话 ID、工具和回合结束状态。原生 DSH 客户端仍是只用单引擎时可直接比较的基线。作者列举多引擎和桌面平台。本次证据只确认 DSH 独立适配器使用自己的宿主传输，以结构化消息对接，根组件是独立 Tauri 桌面客户端。权限语义需逐引擎核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-20](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/README.md#L16-L20)

作者定位多引擎桌面、流和本地设置。

```text
**ccgui** is an open-source **multi-engine AI coding desktop client**. In plain words: it brings command-line AI coding runtimes — **Claude Code**, **Codex CLI**, **Kimi CLI**, **Grok CLI**, **Pi CLI**, **OMP CLI**, **DeepSeek Harness (DSH)**, **Antigravity**, **OpenCode**, **Qoder**, and **MiniMax Code** — into one graphical interface.

No more staring at a black terminal. Open ccgui, pick a project, and chat with AI to write code, fix bugs, and commit to Git. Streaming output, thinking traces, and tool calls are visible as they happen; token usage appears when the engine reports it.

The app is built with **Tauri 2 + React 18 + TypeScript + Rust** and runs on macOS, Windows, and Linux. Settings and state are persisted locally. Content sent to an AI provider follows the boundary of the channel you configured for that CLI.
```

**依据 2 · 源码核查**：[src-tauri/tauri.conf.json:2-8](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/tauri.conf.json#L2-L8)

Tauri 产品与版本声明。

```text
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "CC GUI",
  "version": "1.2.2",
  "identifier": "com.zhukunpenglinyutong.ccgui",
  "build": {
    "beforeDevCommand": "node scripts/dev-frontend.mjs",
    "devUrl": "http://localhost:1420",
```

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh.rs:14-26](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh.rs#L14-L26)

DSH 使用自己的 host session 传输。

<details>
<summary>查看原文（13行）</summary>

```text
impl Engine for DshEngine {
    fn id(&self) -> &'static str {
        "dsh"
    }

    fn drives_own_transport(&self) -> bool {
        true
    }

    /// Never invoked on the virtual path (`send_host_stream` branches before
    /// the process spawn); a stub keeps the trait contract honest.
    fn build_command(&self, _req: &SendRequest, _bin: &str) -> Result<BuiltCommand, String> {
        Err("dsh runs as a host session; no child process to build".to_string())
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/engine/mod.rs:1424-1433](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1424-L1433)

实际调度 DSH 运行。

<details>
<summary>查看原文（10行）</summary>

```text
    };
    let resume_session_id = launch.req.session_id.clone();
    let task = match engine.as_str() {
        "dsh" => tokio::spawn(dsh_session::run_host_turn(
            core,
            launch.req,
            state.dsh_host.clone(),
            killed,
            pid,
        )),
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:501-511](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L501-L511)

解析 follow 与 assistant stream 为客户端事件。

<details>
<summary>查看原文（11行）</summary>

```text
fn handle_follow(core: &TurnCore, state: &mut TurnState, view: &mut TurnView, value: &Value) {
    match value.get("type").and_then(Value::as_str) {
        Some("snapshot") => {} // history replay: codemoss renders its own log
        Some("event") => {
            let event = value.get("event").cloned().unwrap_or(Value::Null);
            let event_type = event.get("type").and_then(Value::as_str).unwrap_or("");
            let data = event.get("data").cloned().unwrap_or(Value::Null);
            handle_session_event(core, state, view, event_type, &data);
        }
        Some("assistant-stream") => handle_assistant_stream(core, state, view, value),
        _ => {}
```

</details>

#### 缺口

- 多引擎的切换效率与实际用户收益未知。
  **影响**：单引擎可能无足够增量，跨引擎一致性未测。
  **进一步探讨**：对同一项目在客户端和原生入口记录重新定位会话和核对工具的时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发送一条 DSH 消息如何接上宿主、会话与输出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Tauri 注册 `send_message`，DSH 适配器用自己的传输，虚拟运行任务调用 `run_host_turn`。发送时先串行保证宿主可用，探测到可接入的既有服务就采用，端口冲突返回错误，必要时启动 `dsh web`。再以路径获取工作区，以原生会话 ID 创建或继续会话，并回传 ID。可选模型切换失败只警告，继续用现有模型。WebSocket 打开 follow 和 `$events`，有限等待快照和 clientId；缺 clientId 会警告，普通 prompt 仍可入 queue。收到对应帧后客户端映射工具事件及流式回复。已提交后的断流会报错，取消对宿主是尽力调用，不能推定宿主没有执行。客户端生成 Done 时也可能代表中断时的部分输出或非 completed 的宿主结束，需对照结束原因与警告。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/lib.rs:478-485](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/lib.rs#L478-L485)

实际注册 send_message Tauri 命令。

```text
            plugins::market::plugin_install_from_marketplace,
            plugins::market::plugin_check_updates,
            // engine
            engine::send_message,
            engine::interrupt_session,
            engine::live_runs,
            engine::answer_question,
            engine::respond_plan_review,
```

**依据 2 · 源码核查**：[src-tauri/src/engine/mod.rs:734-746](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L734-L746)

Tauri 命令接收引擎、项目、会话和权限。

<details>
<summary>查看原文（13行）</summary>

```text
#[tauri::command]
pub async fn send_message(
    state: tauri::State<'_, crate::AppState>,
    engine: String,
    workspace_path: String,
    session_id: Option<String>,
    prompt: String,
    prompt_contributions: Vec<PromptContribution>,
    native_compact: Option<bool>,
    image_paths: Option<Vec<String>>,
    model: Option<String>,
    effort: Option<String>,
    permission: Option<String>,
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/engine/mod.rs:1157-1168](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1157-L1168)

虚拟传输实际分支，WSL 等本机不支持路径拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
    {
        // 本机驱动没有远端路径:远程工作区显式拒绝(与旧行为一致),而不是
        // 静默起一个连不上远端工作区的本地会话。codex/grok 在上面退回 child。
        if wsl_tp.is_some() {
            return Err(format!("引擎 {engine} 不支持远程工作区(WSL)"));
        }
        // The child path resolves codex's provider credentials further down;
        // the app-server driver owns its own process, so it needs them here.
        if engine == "codex" && !codex_read_only::requested(&launch.req) {
            codex_provider_env::apply(&mut launch.built.command).await;
        }
        return send_host_stream(state, launch, engine, run_id, killed, reader_abort).await;
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/engine/mod.rs:1424-1433](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1424-L1433)

分派到 DSH 运行。

<details>
<summary>查看原文（10行）</summary>

```text
    };
    let resume_session_id = launch.req.session_id.clone();
    let task = match engine.as_str() {
        "dsh" => tokio::spawn(dsh_session::run_host_turn(
            core,
            launch.req,
            state.dsh_host.clone(),
            killed,
            pid,
        )),
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/dsh_host.rs:965-995](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/dsh_host.rs#L965-L995)

串行探测、采用或启动宿主。

<details>
<summary>查看原文（31行）</summary>

```text
pub(crate) async fn ensure_host(
    host_state: &DshHostState,
    settings: &AppSettings,
) -> Result<(), String> {
    let _serialize = host_state.ensure.lock().await;
    let cfg = HostConfig::from(settings);

    host_state.reap_exited();
    let ours = host_state.spawned_origin().as_deref() == Some(cfg.origin.as_str());
    match ensure_action(&probe_describe(&cfg.origin).await, ours) {
        EnsureAction::Adopt => return Ok(()),
        EnsureAction::Occupied(detail) => return Err(occupied_message(cfg.port, &detail)),
        EnsureAction::RestartOwn => {
            host_state.kill_spawned();
            sleep(Duration::from_millis(600)).await;
        }
        EnsureAction::Spawn => {}
    }

    let bin = dsh_bin(settings);
    let mut command = command_for_binary(&bin);
    command
        .arg("web")
        .arg("--host")
        .arg(&cfg.host)
        .arg("--port")
        .arg(cfg.port.to_string())
        // The GUI talks to the host over HTTP itself; opening a browser tab
        // on every app launch is pure noise.
        .arg("--no-open");
    command
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:195-226](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L195-L226)

确保宿主、注册 workspace、创建或继续会话，发出原生 ID。

<details>
<summary>查看原文（32行）</summary>

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
    core.dispatch_event(state, EngineEvent::SessionId(session_id.clone()));
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:235-255](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L235-L255)

切换模型失败时警告并使用已有模型。

<details>
<summary>查看原文（21行）</summary>

```text
    // Model: the picker's ids are `provider/model` selector ids (models.rs).
    if let Some(model) = req.model.as_deref().filter(|m| m.contains('/')) {
        let (provider, model) = model.split_once('/').unwrap_or(("", model));
        if !provider.is_empty() && !model.is_empty() {
            let mut select_args = json!({ "request": { "sessionId": session_id, "provider": provider, "model": model } });
            if let Some(effort) = req
                .effort
                .as_deref()
                .map(str::trim)
                .filter(|e| !e.is_empty())
            {
                select_args["request"]["effort"] = json!(effort);
                select_args["request"]["reasoningEffort"] = json!(effort);
            }
            let selected = host_call(&origin, "session/selectModel", select_args).await;
            if selected.is_err() {
                core.dispatch_event(
                    state,
                    EngineEvent::Warn(format!("模型切换未生效，继续使用会话当前模型：{model}")),
                );
            }
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:1084-1115](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L1084-L1115)

打开 follow 与事件流。

<details>
<summary>查看原文（32行）</summary>

```text
async fn ws_open_and_wait(ws: &mut Ws, session_id: &str) -> StreamsOpened {
    let opened = async {
        ws_send(
            ws,
            json!({
                "type": "open",
                "streamId": STREAM_FOLLOW,
                "endpoint": "session/follow",
                "payload": { "args": { "request": {
                    "address": { "kind": "session", "sessionId": session_id },
                    "maxMessages": FOLLOW_MAX_MESSAGES,
                    "assistantStream": true,
                } } },
            }),
        )
        .await?;
        ws_send(
            ws,
            json!({
                "type": "open",
                "streamId": STREAM_EVENTS,
                "endpoint": "$events",
                "payload": { "args": {} },
            }),
        )
        .await
    };
    if let Err(error) = opened.await {
        eprintln!("[dsh] mux stream open failed: {error}");
        return StreamsOpened {
            events_client_id: None,
            plan_active: false,
```

</details>

**依据 9 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:1118-1162](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L1118-L1162)

有限等待两个流信号，缺失时仍返回状态。

<details>
<summary>查看原文（45行）</summary>

```text
    let mut follow_ready = false;
    let mut events_client_id: Option<String> = None;
    let mut plan_active = false;
    let started = tokio::time::Instant::now();
    while started.elapsed() < FOLLOW_READY_TIMEOUT && !(follow_ready && events_client_id.is_some())
    {
        let next = tokio::time::timeout(FOLLOW_READY_TIMEOUT - started.elapsed(), ws.next()).await;
        match next {
            Ok(Some(Ok(Message::Text(text)))) => {
                let Ok(value) = serde_json::from_str::<Value>(text.as_str()) else {
                    continue;
                };
                if value.get("type").and_then(Value::as_str) != Some("item") {
                    continue;
                }
                match value.get("streamId").and_then(Value::as_str) {
                    Some(STREAM_FOLLOW)
                        if value.pointer("/value/type").and_then(Value::as_str)
                            == Some("snapshot") =>
                    {
                        follow_ready = true;
                        // plan 投影的裁剪视图 {active, pending}（dsh-plan-mode
                        // planProjectionDefinition wire）；缺失即未注册插件。
                        plan_active = value
                            .pointer("/value/projections/values/plan/active")
                            .and_then(Value::as_bool)
                            .unwrap_or(false);
                    }
                    Some(STREAM_EVENTS)
                        if value.pointer("/value/type").and_then(Value::as_str)
                            == Some("ready") =>
                    {
                        events_client_id = value
                            .pointer("/value/clientId")
                            .and_then(Value::as_str)
                            .map(str::to_string);
                    }
                    _ => {}
                }
            }
            Ok(Some(Ok(_))) | Ok(Some(Err(_))) | Ok(None) | Err(_) => break,
        }
    }
    StreamsOpened {
        events_client_id,
```

</details>

**依据 10 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:275-321](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L275-L321)

缺 clientId 警告；prompt 入队，调用错误显式返回。

<details>
<summary>查看原文（47行）</summary>

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
        "content": dsh_images::build_prompt_content(&req.prompt, &prompt_images),
        "clientTimeZone": client_time_zone(),
    });
    if let Some(effort) = req
        .effort
        .as_deref()
        .map(str::trim)
        .filter(|e| !e.is_empty())
    {
        prompt_request["effort"] = json!(effort);
        prompt_request["reasoningEffort"] = json!(effort);
    }
    let prompt = crate::dsh_host::host_call_rpc(
        &origin,
        "session/prompt",
        json!({ "request": prompt_request }),
    )
    .await;
    if let Err(error) = prompt {
        let _ = ws.close(None).await;
        return Err(format!(
            "任务下发失败：{}",
            dsh_images::format_prompt_refusal(&error)
        ));
```

</details>

**依据 11 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:328-374](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L328-L374)

分发帧、断流返回错误、尽力取消。

<details>
<summary>查看原文（47行）</summary>

```text
        tokio::select! {
            frame = read.next() => match frame {
                Some(Ok(Message::Text(text))) => {
                    let Ok(parsed) = serde_json::from_str::<Value>(text.as_str()) else {
                        continue;
                    };
                    if parsed.get("type").and_then(Value::as_str) != Some("item") {
                        continue;
                    }
                    let stream_id = parsed.get("streamId").and_then(Value::as_str).unwrap_or("");
                    let value = parsed.get("value").cloned().unwrap_or(Value::Null);
                    match stream_id {
                        STREAM_FOLLOW => handle_follow(core, state, view, &value),
                        STREAM_EVENTS => {
                            handle_events_frame(core, state, view, &value, &origin).await;
                        }
                        _ => {}
                    }
                    if view.turn_ended {
                        break;
                    }
                }
                Some(Ok(_)) => {} // ping/pong/binary: keep the loop going
                Some(Err(error)) => {
                    if killed.load(Ordering::SeqCst) || view.turn_ended {
                        break;
                    }
                    return Err(format!("dsh 会话流中断：{error}"));
                }
                None => {
                    if killed.load(Ordering::SeqCst) || view.turn_ended {
                        break;
                    }
                    return Err("dsh 会话流已关闭".to_string());
                }
            },
            _ = kill_poll.tick() => {
                if killed.load(Ordering::SeqCst) {
                    // Best-effort server-side cancel; if this races the
                    // turn's completion the host simply ignores it.
                    let _ = host_call(
                        &origin,
                        "session/cancel",
                        json!({ "request": { "sessionId": session_id } }),
                    )
                    .await;
                    break;
```

</details>

**依据 12 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:579-595](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L579-L595)

非 completed 结束带警告。

<details>
<summary>查看原文（17行）</summary>

```text
                let text = message_text(data);
                if !text.is_empty() {
                    core.dispatch_event(state, EngineEvent::Delta(format!("{text}\n\n")));
                }
            }
            view.attempt_streamed_text = false;
        }
        "turn/end" => {
            view.turn_ended = true;
            let kind = data
                .pointer("/reason/kind")
                .and_then(Value::as_str)
                .unwrap_or("completed");
            if kind != "completed" {
                core.dispatch_event(state, EngineEvent::Warn(format!("本轮结束（{kind}）")));
            }
        }
```

</details>

**依据 13 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:151-172](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L151-L172)

退出清理并在特定条件发 Done，可能是部分输出。

<details>
<summary>查看原文（22行）</summary>

```text
        // 停住的计划审批随运行消亡即过期（P1 收尾义务，PRD §8 防线 3）。
        super::reader::expire_parked_plans(&core, &mut state, &key);
    }
    if let Err(error) = result {
        core.dispatch_event(&mut state, EngineEvent::Error(error));
    }
    // An interrupted run commits its partial output as a normal turn end —
    // the same contract as the SIGKILL'd process path.
    if !state.saw_done && !state.saw_error {
        let usage = if killed.load(Ordering::SeqCst) {
            None
        } else {
            // 没有 usage 分片但 host 通告过窗口时，done 也要把窗口带上，
            // 否则回合结束前端又掉回 200k 假定值。
            view.last_usage
                .clone()
                .or_else(|| view.context_window.map(|window| json!({ "contextWindow": window })))
                .map(|usage| attach_context_window(usage, view.context_window))
        };
        let session_id = state.native_session_id.clone();
        core.dispatch_event(&mut state, EngineEvent::Done { session_id, usage });
    }
```

</details>

#### 缺口

- 目标平台及真实宿主的断流、恢复与取消未运行。
  **影响**：客户端事件和服务端工具效果可能不同步。
  **进一步探讨**：记录请求 ID、原生会话和宿主终态，断流先核对再决定重发。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 普通工具审批、计划评审与执行限制分别是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

DSH 的权限入口列 auto、plan。事件 clientId 存在时，普通 approval/request 直接回 `allowed-once`，没有人工确认；clientId 缺失时交互会跳过，应答错误提示回合可能阻塞。选 plan 会先检查宿主 `commands/list` 是否真的有 plan，执行 `/plan` 后要求已激活快照或等 active 事件，未确认则不发 prompt。指定 `intent.kind=plan-review` 的问题进入类型化评审，缺正文、批准标签或问题 ID 会拒绝。客户端基于当前 revision 抢占决策并验证挂起上下文，DSH 回应走 `$events/result`；回执成功将批准进入 Starting，执行结果仍靠后续事件。适配器记录执行权限 auto，文档注释明确 plan 只引导行为，待审请求需活跃宿主运行。丢失评审上下文、网络错误或宿主重启时，应先核对原生会话和实际副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh.rs:46-56](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh.rs#L46-L56)

DSH 声明 typed 计划、auto 和 plan，明确软约束及重启边界。

<details>
<summary>查看原文（11行）</summary>

```text
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
    }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:670-714](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L670-L714)

普通审批自动回 allowed-once，交互缺 clientId 跳过。

<details>
<summary>查看原文（45行）</summary>

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
                        "error": { "code": "cancelled", "message": "the user cancelled ask_user_question" },
                    }),
                    Some("已取消一个未识别的交互请求".to_string()),
                )
            };
            let answered = host_call(
                origin,
                "$events/result",
                json!({ "clientId": client_id, "eventId": event_id, "outcome": outcome }),
            )
            .await;
            match (answered, notice) {
                (Err(_), _) => core.dispatch_event(
                    state,
                    EngineEvent::Warn("审批/提问应答失败，本轮可能被阻塞".to_string()),
                ),
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:385-397](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L385-L397)

缺 plan 命令则发送前拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
/// 前置探测（PRD §5-DSH.1/2）：commands/list 确认 plan 命令存在。缺插件
/// （列表无 plan）或探测失败都受控报错，不降级 auto。
async fn ensure_plan_command(origin: &str, session_id: &str) -> Result<(), String> {
    let listed = host_call(origin, "commands/list", json!({ "agentId": session_id }))
        .await
        .map_err(|error| format!("无法确认 host 的 plan 命令（commands/list 失败）：{error}"))?;
    if !plan_command_listed(&listed) {
        return Err(
            "当前 dsh host 未组合 plan-mode 插件（commands/list 无 plan 命令），无法进入计划审批模式；不会降级为 auto 执行"
                .to_string(),
        );
    }
    Ok(())
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:435-458](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L435-L458)

命令执行成功后读取已有 active 或等待事件。

<details>
<summary>查看原文（24行）</summary>

```text
async fn enter_plan_mode(
    origin: &str,
    session_id: &str,
    ws: &mut Ws,
    already_active: bool,
) -> Result<(), String> {
    let result = host_call(
        origin,
        "commands/execute",
        json!({
            "agentId": session_id,
            "line": "/plan",
            "submittedAttachments": [],
        }),
    )
    .await
    .map_err(|error| format!("进入 plan 模式失败（commands/execute /plan）：{error}"))?;
    plan_execute_outcome(&result)?;
    if already_active {
        // 快照投影已显示 plan.active：本次 /plan 是 noop，不会再追加
        // plan/mode 事件，无需等待回读。
        return Ok(());
    }
    await_plan_mode_active(ws).await
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:465-494](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L465-L494)

只有 active 确认才放行，无信号超时拒绝。

<details>
<summary>查看原文（30行）</summary>

```text
async fn await_plan_mode_active(ws: &mut Ws) -> Result<(), String> {
    let started = tokio::time::Instant::now();
    while started.elapsed() < PLAN_MODE_CONFIRM_TIMEOUT {
        let remaining = PLAN_MODE_CONFIRM_TIMEOUT - started.elapsed();
        match tokio::time::timeout(remaining, ws.next()).await {
            Ok(Some(Ok(Message::Text(text)))) => {
                let Ok(value) = serde_json::from_str::<Value>(text.as_str()) else {
                    continue;
                };
                if value.get("type").and_then(Value::as_str) != Some("item")
                    || value.get("streamId").and_then(Value::as_str) != Some(STREAM_FOLLOW)
                {
                    continue;
                }
                if value.pointer("/value/event/type").and_then(Value::as_str)
                    == Some("plan/mode")
                    && value.pointer("/value/event/data/active").and_then(Value::as_bool)
                        == Some(true)
                {
                    return Ok(());
                }
            }
            Ok(Some(Ok(_))) => {} // ping/pong/binary: keep waiting
            _ => break,
        }
    }
    Err(
        "等待 plan/mode active 确认超时：host 未确认进入 plan 模式，已中止发送（不降级 auto）"
            .to_string(),
    )
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:814-825](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L814-L825)

通过类型化 intent 识别计划评审。

<details>
<summary>查看原文（12行）</summary>

```text
/// plan-review intent 识别（PRD §5-DSH.6：仅以 intent.kind=="plan-review"
/// 识别计划；P0 取证的结构里它是 questions[0]）。
fn plan_review_question(request: &Value) -> Option<Value> {
    request
        .get("questions")?
        .as_array()?
        .first()
        .filter(|question| {
            question.pointer("/intent/kind").and_then(Value::as_str) == Some("plan-review")
        })
        .cloned()
}
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:860-884](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L860-L884)

缺字段拒绝原生请求。

<details>
<summary>查看原文（25行）</summary>

```text
    let content = question
        .get("detail")
        .and_then(Value::as_str)
        .filter(|detail| !detail.trim().is_empty());
    let approve = question
        .pointer("/intent/approve")
        .and_then(Value::as_str)
        .filter(|label| !label.is_empty());
    let question_id = question
        .get("id")
        .and_then(Value::as_str)
        .filter(|id| !id.is_empty());
    let (Some(content), Some(approve), Some(question_id)) = (content, approve, question_id)
    else {
        // fail-closed：正文/批准标签/问题 id 缺一都无法构造忠实于原生语义
        // 的审批——拒绝该 waterfall 让 host 解除阻塞并警告，绝不降级为普通
        // 问题卡（那会丢失审批语义）。
        reject_waterfall(origin, client_id, event_id, "malformed plan-review request").await;
        core.dispatch_event(
            state,
            EngineEvent::Warn(
                "收到残缺的计划评审请求（缺正文/批准标签/问题 id），已拒绝".to_string(),
            ),
        );
        return;
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:905-943](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L905-L943)

计划记录执行权限 auto，实际挂起原生 HTTP 回复。

<details>
<summary>查看原文（39行）</summary>

```text
    let now = super::plan_review::now_ms();
    let record = super::plan_review::PlanReview {
        plan_id: format!("dsh-plan-{event_id}"),
        engine: core.engine_id.clone(),
        session_id: state.native_session_id.clone().unwrap_or_default(),
        workspace_path: view.workspace.clone(),
        run_id: Some(core.run_id.clone()),
        revision: 0, // dispatch 落盘时赋 revision，适配器不自带
        title,
        content: content.to_string(),
        content_hash: content_hash.clone(),
        complete: true,
        review_kind: super::plan_review::PlanReviewKind::NativeRequest,
        native_plan_id: Some(question_id.to_string()),
        // plan 是软行为引导：批准后 plan mode 退出，工具调用回到 host 会话
        // 既有策略（v1 auto-allow），审批本身不改变执行权限。
        exec_permission: "auto".to_string(),
        status: super::plan_review::PlanStatus::AwaitingReview,
        execution: super::plan_review::PlanExecution::NotStarted,
        decision: None,
        decision_intent_at: None,
        applied_at: None,
        created_at: now,
        updated_at: now,
        superseded_by: None,
    };
    // 停车上下文（respond_plan_review 的读取约定）：route/origin/path/
    // contentHash/frames 顶层平铺；revision 键由 dispatch 注入，适配器不占。
    let context = json!({
        "route": "http",
        "origin": origin,
        "path": "$events/result",
        "contentHash": content_hash,
        "frames": { "approve": approve_frame, "changes": changes_frame },
    });
    core.dispatch_event(
        state,
        EngineEvent::PlanReviewReady {
            record: Box::new(record),
```

</details>

**依据 9 · 源码核查**：[src-tauri/src/engine/mod.rs:1786-1804](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1786-L1804)

按 revision 抢占决策，确定冲突分支。

<details>
<summary>查看原文（19行）</summary>

```text
    let claimed = match plan_review::submit_decision(
        &state.db,
        &plan_id,
        expected_revision,
        decision,
        feedback.as_deref(),
    )? {
        plan_review::SubmitOutcome::Conflict(review) => {
            return Ok(PlanRespondOutcome::Conflict { review: *review });
        }
        plan_review::SubmitOutcome::Claimed { previous } => previous,
    };
    let fail = |message: String| -> Result<PlanRespondOutcome, String> {
        // 提交权已抢占但路由/写入失败:退回待审,决策意图留存待恢复。
        plan_review::revert_submission(&state.db, &plan_id, expected_revision, claimed)?;
        Err(message)
    };
    let review = plan_review::get_review(&state.db, &plan_id, expected_revision)?
        .ok_or_else(|| "plan review vanished mid-decision".to_string())?;
```

</details>

**依据 10 · 源码核查**：[src-tauri/src/engine/mod.rs:1850-1875](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1850-L1875)

执行时要求活跃请求并检查 revision 与内容摘要。

<details>
<summary>查看原文（26行）</summary>

```text
    let entry = state
        .processes
        .get(&session_key)
        .or_else(|| state.processes.get(&review.session_id))
        .ok_or_else(|| "no running session holds this plan's native request".to_string());
    let entry = match entry {
        Ok(entry) => entry,
        Err(message) => return fail(message),
    };
    let parked = entry
        .plans
        .lock()
        .map_err(|_| "plan state is poisoned".to_string())
        .ok()
        .and_then(|plans| plans.get(&plan_id).cloned());
    let Some(parked) = parked else {
        return fail("the native plan request is no longer parked for this session".to_string());
    };
    if parked.get("revision").and_then(Value::as_i64) != Some(expected_revision) {
        return fail("the parked native request belongs to a different plan revision".to_string());
    }
    if let Some(hash) = parked.get("contentHash").and_then(Value::as_str) {
        if hash != review.content_hash {
            // 正文在审批期间变化:不能让已抢占版本带着旧正文继续执行——
            // 先失效,要求重新审阅(PR §4.2 末条)。
            let _ = plan_review::expire_reviews(&state.db, &[(plan_id.clone(), expected_revision)]);
```

</details>

**依据 11 · 源码核查**：[src-tauri/src/engine/mod.rs:1897-1925](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1897-L1925)

送达后批准仅标 Starting，执行结果留给后续。

<details>
<summary>查看原文（29行）</summary>

```text
    let frame = substitute_plan_feedback(frame, feedback.as_deref());

    let written = match parked.get("route").and_then(Value::as_str) {
        Some("stdin") => state.processes.write_line(&session_key, frame_to_line(&frame)).await,
        Some("http") => {
            let origin = parked.get("origin").and_then(Value::as_str).unwrap_or("");
            let path = parked.get("path").and_then(Value::as_str).unwrap_or("");
            if origin.is_empty() || path.is_empty() {
                Err("the parked native context is missing its http origin/path".to_string())
            } else {
                crate::dsh_host::host_call(origin, path, frame).await.map(|_| ())
            }
        }
        _ => Err("the parked native context does not declare a reply route".to_string()),
    };
    if let Err(message) = written {
        return fail(format!("plan decision was NOT delivered: {message}"));
    }

    plan_review::mark_applied(&state.db, &plan_id, expected_revision, decision)?;
    if decision == plan_review::PlanDecision::Approve {
        // 原生确认已收到,实施开始;approved ≠ 执行成功,完成/失败由后续
        // 运行事件推进。
        plan_review::mark_execution(
            &state.db,
            &plan_id,
            expected_revision,
            plan_review::PlanExecution::Starting,
        )?;
```

</details>

#### 缺口

- 未运行真实工具、受限目录或重启恢复。
  **影响**：不能从计划卡片推断普通审批或宿主执行隔离。
  **进一步探讨**：使用低权限宿主和无价值项目，分别测普通审批、计划确认、越目录请求与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁提供引擎、模型、凭据和恢复能力？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定前端和 Tauri 清单均为 1.2.2。独立客户端需匹配系统发行物和 DSH CLI/宿主，作者要求在 DSH 配模型与 API 密钥。应用自己启动的宿主仍有独立 BrowserAuth cookie 和启动 token，代码按 origin 存在应用目录，并只从被信任的 origin 加载 cookie。停止动作仅终止自己的子进程。因引擎和模型配置在宿主，客户端可退回已配置的原生入口；需另核对应用本地对话记录、评审和恢复需求。模型账单、各平台部署和运行日志成本依真实环境，当前没有测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/package.json#L1-L7)

前端包版本 1.2.2。

```text
{
  "name": "ccgui-next",
  "private": true,
  "version": "1.2.2",
  "type": "module",
  "packageManager": "pnpm@10.29.3",
  "scripts": {
```

**依据 2 · 源码核查**：[src-tauri/tauri.conf.json:2-8](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/tauri.conf.json#L2-L8)

Tauri 产品版本及标识。

```text
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "CC GUI",
  "version": "1.2.2",
  "identifier": "com.zhukunpenglinyutong.ccgui",
  "build": {
    "beforeDevCommand": "node scripts/dev-frontend.mjs",
    "devUrl": "http://localhost:1420",
```

**依据 3 · 作者声明**：[README.md:137-142](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/README.md#L137-L142)

作者区分 DSH 自己配置模型与 GUI 使用宿主。

```text
### Using DeepSeek Harness (DSH)

1. Install the DSH CLI on your machine and configure its models and API keys in DSH itself — not as a separate vendor preset inside ccgui.
2. In Settings → DeepSeek Harness, ccgui can adopt a running local `dsh web` host or auto-start one.
3. Select **DeepSeek Harness** in the composer engine picker. Chat runs through DSH's headless profile; models and credentials stay in DSH.
4. Image attachments (paste, pick, or drop) are supported. For custom providers added in DSH (`llm-pi-ai` routes), ccgui declares image input on the route before sending — no manual DSH settings edit needed; official adapters report their own capabilities.
```

**依据 4 · 源码核查**：[src-tauri/src/dsh_host.rs:271-296](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/dsh_host.rs#L271-L296)

应用按 origin 保存宿主认证资料。

<details>
<summary>查看原文（26行）</summary>

```text
/// Per-origin credential file: `{"<origin>": {"cookie", "launchToken"}}`.
/// Keyed by origin because the cookie's BrowserAuth signature is bound to
/// the host:port authority — an origin change invalidates it by construction.
fn credentials_path() -> PathBuf {
    crate::paths::app_home().join("dsh-host-credentials.json")
}

fn load_credentials(origin: &str) -> Option<HostCredentials> {
    let text = std::fs::read_to_string(credentials_path()).ok()?;
    let map: BTreeMap<String, HostCredentials> = serde_json::from_str(&text).ok()?;
    map.get(origin).cloned()
}

fn store_credentials(origin: &str, credentials: HostCredentials) {
    let mut map: BTreeMap<String, HostCredentials> = std::fs::read_to_string(credentials_path())
        .ok()
        .and_then(|text| serde_json::from_str(&text).ok())
        .unwrap_or_default();
    map.insert(origin.to_string(), credentials);
    match serde_json::to_string_pretty(&map) {
        Ok(content) => {
            if let Err(error) = crate::settings::atomic_write(&credentials_path(), &content) {
                eprintln!("[dsh] persisting host credentials failed: {error}");
            }
        }
        Err(error) => eprintln!("[dsh] serializing host credentials failed: {error}"),
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/dsh_host.rs:481-489](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/dsh_host.rs#L481-L489)

仅被信任 origin 可加载 cookie。

```text
/// The persisted BrowserAuth cookie for `origin`, when this app holds one.
/// Host-session RPC (chat turns) rides the same credential chain as the
/// probes: cookie captured from the launch token, keyed by origin.
pub(crate) fn host_cookie(origin: &str) -> Option<String> {
    if !origin_trusted(origin) {
        return None;
    }
    load_credentials(origin).map(|credentials| credentials.cookie)
}
```

**依据 6 · 源码核查**：[src-tauri/src/dsh_host.rs:1226-1237](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/dsh_host.rs#L1226-L1237)

只停止本应用启动的宿主。

<details>
<summary>查看原文（12行）</summary>

```text
#[tauri::command]
pub async fn dsh_host_stop(state: tauri::State<'_, crate::AppState>) -> Result<OkResult, String> {
    let settings = crate::settings::read_settings().unwrap_or_default();
    let cfg = HostConfig::from(&settings);
    // Only our own child is ever stopped. Whatever else answers on the port
    // (a host the user started, another app) is reported, never killed.
    let had_child = state.dsh_host.kill_spawned();
    for _ in 0..STOP_SETTLE_ATTEMPTS {
        if matches!(probe_describe(&cfg.origin).await, ProbeOutcome::Down(_)) {
            return Ok(OkResult { ok: true });
        }
        sleep(STOP_SETTLE_INTERVAL).await;
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/engine/mod.rs:1157-1168](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1157-L1168)

本机宿主传输拒绝 WSL 远端工作区。

<details>
<summary>查看原文（12行）</summary>

```text
    {
        // 本机驱动没有远端路径:远程工作区显式拒绝(与旧行为一致),而不是
        // 静默起一个连不上远端工作区的本地会话。codex/grok 在上面退回 child。
        if wsl_tp.is_some() {
            return Err(format!("引擎 {engine} 不支持远程工作区(WSL)"));
        }
        // The child path resolves codex's provider credentials further down;
        // the app-server driver owns its own process, so it needs them here.
        if engine == "codex" && !codex_read_only::requested(&launch.req) {
            codex_provider_env::apply(&mut launch.built.command).await;
        }
        return send_host_stream(state, launch, engine, run_id, killed, reader_abort).await;
```

</details>

#### 缺口

- 实际二进制、宿主版本兼容和模型用量未验证。
  **影响**：安装支持、价格、恢复耗时需要按环境验证。
  **进一步探讨**：固定 OS、宿主和模型版本，记录首次启动、连接恢复和原生会话回退。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样比较能力显示与原生入口并决定试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

在可销毁的本地目录分别用原生 DSH 和 CC GUI 跑一轮非敏感读取，记录会话 ID、工具调用、结束状态和核对时间。受控模拟事件未就绪、宿主没有 `/plan`、评审中断。再比较通用计划徽标与拆分显示实际工具审批策略、计划确认及宿主执行限制的界面，记录权限误判率和错误重发次数；探测失败或过期需显示未知。要求人工逐工具审批、发现 host 与 GUI 状态不同或确认不到工具副作用时，停止发新请求，回到具备所需权限的原生环境核对。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:275-292](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L275-L292)

普通通道有限等待与计划确认可分别验收。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:328-374](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh_session.rs#L328-L374)

断流、取消与宿主结果需要对照。

<details>
<summary>查看原文（47行）</summary>

```text
        tokio::select! {
            frame = read.next() => match frame {
                Some(Ok(Message::Text(text))) => {
                    let Ok(parsed) = serde_json::from_str::<Value>(text.as_str()) else {
                        continue;
                    };
                    if parsed.get("type").and_then(Value::as_str) != Some("item") {
                        continue;
                    }
                    let stream_id = parsed.get("streamId").and_then(Value::as_str).unwrap_or("");
                    let value = parsed.get("value").cloned().unwrap_or(Value::Null);
                    match stream_id {
                        STREAM_FOLLOW => handle_follow(core, state, view, &value),
                        STREAM_EVENTS => {
                            handle_events_frame(core, state, view, &value, &origin).await;
                        }
                        _ => {}
                    }
                    if view.turn_ended {
                        break;
                    }
                }
                Some(Ok(_)) => {} // ping/pong/binary: keep the loop going
                Some(Err(error)) => {
                    if killed.load(Ordering::SeqCst) || view.turn_ended {
                        break;
                    }
                    return Err(format!("dsh 会话流中断：{error}"));
                }
                None => {
                    if killed.load(Ordering::SeqCst) || view.turn_ended {
                        break;
                    }
                    return Err("dsh 会话流已关闭".to_string());
                }
            },
            _ = kill_poll.tick() => {
                if killed.load(Ordering::SeqCst) {
                    // Best-effort server-side cancel; if this races the
                    // turn's completion the host simply ignores it.
                    let _ = host_call(
                        &origin,
                        "session/cancel",
                        json!({ "request": { "sessionId": session_id } }),
                    )
                    .await;
                    break;
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/engine/dsh.rs:46-56](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/dsh.rs#L46-L56)

适配器声明计划与权限语义。

<details>
<summary>查看原文（11行）</summary>

```text
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
    }
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/engine/mod.rs:1907-1925](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/1c2888ff7ff74951643fa20a15054ed69e1fe584/src-tauri/src/engine/mod.rs#L1907-L1925)

计划答复送达和执行启动可分开观察。

<details>
<summary>查看原文（19行）</summary>

```text
                crate::dsh_host::host_call(origin, path, frame).await.map(|_| ())
            }
        }
        _ => Err("the parked native context does not declare a reply route".to_string()),
    };
    if let Err(message) = written {
        return fail(format!("plan decision was NOT delivered: {message}"));
    }

    plan_review::mark_applied(&state.db, &plan_id, expected_revision, decision)?;
    if decision == plan_review::PlanDecision::Approve {
        // 原生确认已收到,实施开始;approved ≠ 执行成功,完成/失败由后续
        // 运行事件推进。
        plan_review::mark_execution(
            &state.db,
            &plan_id,
            expected_revision,
            plan_review::PlanExecution::Starting,
        )?;
```

</details>

#### 缺口

- 能力分项展示的假设尚未实现或试验。
  **影响**：能力状态过期可能反而造成误判。
  **进一步探讨**：固定宿主和样本，盲测权限判断与失败处理，同时测过期信息。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
