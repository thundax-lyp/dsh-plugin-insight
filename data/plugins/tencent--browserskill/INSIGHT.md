# BrowserSkill 浏览器连接工具

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[6469c47](https://github.com/Tencent/BrowserSkill/tree/6469c474423abbac1b6f70a5e2af6daaf9b1e0af)

<!-- BEGIN META -->
[![GitHub ★ 9,680](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C680&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill)
<!-- END META -->

> **功能**：通过 bsk CLI 与扩展让 Agent 操作已登录的 Chrome 或 Edge

> **亮点**：把现有profile操作组织成有会话所有权、可见窗口和显式归还的跨宿主连接层，资源预留与自有tab身份约束使人机交接可解释。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：窗口组织不等于账号隔离，低干扰不是无弹窗，归还失败需要保留窗口并由用户继续收敛；停止不回滚网页业务副作用。[Q03](#research-q03)

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
  - [Q01 · 复用已登录浏览器能改变哪些实际工作交接？](#detail-section-11)
  - [Q02 · 任务窗口怎样从命令进入浏览器并获得资源所有权？](#detail-section-12)
  - [Q03 · 低干扰、无痕和结束会话分别保证到哪里？](#detail-section-13)
  - [Q04 · 怎样限定试用，并检验会话窗口是否确有净价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要既有网页登录态的用户，让 shell 型 Agent 在可见任务窗口中读网页、填表并交给人接管。

人工网页操作、隔离浏览器脚本或已有API；根产品的增量是登录复用和人机资源交接，不将DSH子包原生呈现计入根CLI效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| bsk浏览器命令 | 读页面、操作和调试 | CLI/扩展与明确profile |
| AgentWindow与借还 | 可见任务和人工接管 | 共享账号权限，失败需收敛 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| bsk CLI/daemon | 必需 | 命令与会话路由 | Agent环境需能找到二进制 |
| 浏览器与连接扩展 | 必需 | 真实页面执行 | CLI存在不等于浏览器已连接 |
| 技能发现 | shell Agent必需 | 正确调用与恢复指导 | doctor不验证此项 |
| 无痕扩展许可 | 无痕任务必需 | 共享无痕会话 | 不满足则拒绝创建 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并选择专用profile | CLI、扩展连接和技能均就绪 |
| 开始 | Agent保留session_id | 窗口和会话绑定明确 |
| 工作 | Agent观察与操作，人工接管 | 原页面结果可检查 |
| 结束 | 归还借用页后停止 | return_failures时保留并重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/扩展/浏览器资源未知 | PATH、profile和连接配置未知 | 无实际安装验收 |
| 持续使用 | 模型回合与浏览器资源未知 | 站点变动适配和复核未知 | 账号权限随profile复用 |
| 失败恢复 | 重试和残留会话资源未知 | 归还、停止、核对业务副作用 | 不提供业务回滚 |
| 退出 | 清理资源未知 | 释放会话并撤销扩展授权 | 保存输出另行管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 登录复用 | 普通profile与任务窗口 | 站点兼容及准备节省 |
| 资源归属 | ID预留和自建tab身份 | 崩溃下整体正确性 |
| 人工接管 | 可见窗口和归还失败保留 | 干扰频率和总接管成本 |

> **思考**：窗口组织不等于账号隔离，低干扰不是无弹窗，归还失败需要保留窗口并由用户继续收敛；停止不回滚网页业务副作用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把现有profile操作组织成有会话所有权、可见窗口和显式归还的跨宿主连接层，资源预留与自有tab身份约束使人机交接可解释。[Q01](#research-q01) [Q02](#research-q02)

锁内预留ID、外部调用后提交/撤销、从创建结果记录资源身份具有可复用价值；移植需维护取消、残留与用户自建资源的边界。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

窗口组织不等于账号隔离，低干扰不是无弹窗，归还失败需要保留窗口并由用户继续收敛；停止不回滚网页业务副作用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

从专用profile的只读任务试用，验收窗口、借还与停止。已有可靠API时比较API；归还失败先保留会话重试，业务状态不明时不重复动作。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

命令、会话资源与归还失败边界有源码支持；真实站点效果和低干扰收益未测，窗口策略的净价值为待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、apps/extension/src/session-manager/agent-window.ts、crates/bsk-cli/src/main.rs、crates/bsk-cli/src/daemon/sessions.rs、apps/extension/src/tools/session.ts、apps/extension/src/session-manager/manager.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根产品聚焦Rust CLI分派和daemon会话资源、扩展窗口创建与归还，README安装边界；未穷尽所有网页操作。Rust源码由固定Git blob读取。
- 下一步：未安装或执行目标代码，未运行浏览器、测试或真实站点；不将源码窗口默认参数当焦点实测。

**分析版本**

- **仓库**：[Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)
- **版本号**：未声明（[固定提交 6469c47](https://github.com/Tencent/BrowserSkill/tree/6469c474423abbac1b6f70a5e2af6daaf9b1e0af)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是会话窗口与明确归还较普通自动化窗口降低干扰同时保留恢复能力；同站点同任务比较焦点变化、误关用户页、合格率和接管/清理时间，若弹窗或清理负担抵消收益则推翻。[Q04](#research-q04)

未安装或执行目标代码，未运行浏览器、测试或真实站点；不将源码窗口默认参数当焦点实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 59 | 7269 | — | — | 77135 |
| .ts | test | 225 | 81615 | 76325 | 2004 | — |
| .ts | source | 279 | 65575 | 57920 | 4301 | — |
| .tsx | test | 24 | 5484 | 4990 | 85 | — |
| .tsx | source | 41 | 9285 | 8814 | 132 | — |
| .md | example | 3 | 645 | — | — | 5426 |
| .mjs | source | 39 | 6847 | 6388 | 206 | — |
| .mjs | example | 8 | 202 | 191 | 0 | — |
| .mjs | test | 6 | 714 | 660 | 4 | — |

</details>

**活跃度**

[![近30天新建 47](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=47&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 33](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=33&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：复用已登录浏览器能改变哪些实际工作交接？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 复用已登录浏览器能改变哪些实际工作交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户面对只有网页界面、现有登录态和人工验证的办公系统，要让shell型Agent读资料、填表或排查请求，同时保留人工接管。基线是手工操作或另启隔离浏览器脚本；后者可能需要重新登录。合格交付是在明确profile与任务会话内完成可核对的页面结果，而不是仅打开一个窗口。根产品由Rust bsk CLI、daemon和Chrome/Edge扩展组成，提供跨宿主浏览器连接、可见Agent Window和显式借还标签页；DSH原生工具是独立子包。复用登录态是便利也是权限复用，工作窗口不等于账号沙箱。已有稳定API的任务应先比较API路径，避免把网页自动化当唯一办法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-35](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/README.md#L23-L35)

作者定位已登录浏览器、AgentWindow及跨宿主CLI。

<details>
<summary>查看原文（13行）</summary>

```text
**BrowserSkill connects your AI agent to Chrome or Microsoft Edge, using the accounts you are already signed into.** Ask it to read pages, fill forms, work through a website, capture a long screenshot, or investigate a failing request. Tasks run in a separate, visible **Agent Window**; an existing tab can be explicitly borrowed and returned when the task ends.

Use the `bsk` CLI with Cursor, Claude Code, Codex, OpenClaw, CodeBuddy, WorkBuddy, Pi, Hermes Agent, or another shell-capable agent. **DeepSeek Harness** has a dedicated plugin with native browser tools and task previews. You choose the agent and model; BrowserSkill provides the browser connection.

## What you can do

| Capability | What it gives you |
| --- | --- |
| **Work with your existing accounts** | Use the browser's current login state to read documents, search internal sites, fill forms, and complete web workflows. |
| **Keep browser tasks visible** | Give the agent its own window, borrow an existing tab when needed, and take over for login, verification, or other human-only steps. |
| **Read, interact, and capture** | Inspect page text and controls, click and type, manage tabs, capture viewport or full-page screenshots, and upload or download files in local mode. |
| **Debug websites with evidence** | Connect actions to requests, response bodies, console messages, and page changes. Inspect performance, slow APIs, and suspected duplicate requests; use explicit HTTP rules or request replay to test a hypothesis. |
| **Choose the right browser** | Name browser instances, bind a task to a specific profile, or pair an agent running on a server with a browser on your computer. |
```

</details>

**依据 2 · 作者声明**：[README.md:47-53](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/README.md#L47-L53)

本地自动化需要Agent、CLI与扩展。

```text
For local automation, you need **an AI agent + the `bsk` CLI + the browser extension**. The CLI includes the background daemon. The skill teaches your agent how to use it.

| Component | Supported environments |
| --- | --- |
| CLI / daemon | macOS: Apple Silicon and Intel · Linux: x64 and ARM64 · Windows: x64 |
| Extension | Chrome and Microsoft Edge, based on Chromium 125 or later. Other Chromium browsers may work; compatibility is not guaranteed. |
| Agent integration | A shell-capable agent with the BrowserSkill skill, or DeepSeek Harness with the [DSH plugin](#deepseek-harness-plugin). |
```

**依据 3 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:44-55](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/session-manager/agent-window.ts#L44-L55)

普通profile新窗口默认，不新建账号容器。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

#### 缺口

- 具体站点相对API和人工流程的收益尚未实测
  **影响**：无法认定登录复用必然降低总成本
  **进一步探讨**：选择真实重复任务比较登录准备、交接、合格率与人工接管时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务窗口怎样从命令进入浏览器并获得资源所有权？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI main 解析命令、设置观察上下文和依赖区域，分派session/navigation/interaction等处理器。daemon在锁内随机预留session ID，将占位映射到浏览器实例，发 ToolSessionStart 并等待响应；连接发送失败会撤销预留。扩展handleSessionStart校验参数后调用manager.start，后者创建Agent Window并立即记录初始tab身份，再保证只复用自己的tab，避免把初始化时用户新开的页误归为Agent所有。窗口默认about:blank、focused=false，显示任务边界而不抢焦点。预留→外部资源→提交/撤销是可复用的并发设计；它只管理资源生命周期，不能代替网页业务结果确认。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/main.rs:36-40](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/crates/bsk-cli/src/main.rs#L36-L40)

上下文与依赖区域在分派前设置。

```text
fn dispatch(cli: Cli, format: Format) -> Result<(), CliError> {
    cli::business_rpc::set_context(cli.flags.context.clone());
    cli::business_rpc::set_dependencies(cli.flags.depends_on.clone());
    match cli.command {
        Command::Cooperate(args) => cli::cooperate::dispatch(args, format),
```

**依据 2 · 源码核查**：[crates/bsk-cli/src/main.rs:77-95](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/crates/bsk-cli/src/main.rs#L77-L95)

实际命令分派。

<details>
<summary>查看原文（19行）</summary>

```text
        Command::Session(cmd) => cli::session::dispatch(cmd, format),
        Command::Browsers => cli::browsers::dispatch(format),
        Command::Tab(cmd) => cli::tab::dispatch(cmd, format),
        Command::Window(cmd) => cli::window::dispatch(cmd, format),
        Command::Emulate(args) => cli::emulate::dispatch(args, format),
        Command::Screenshot(args) => cli::screenshot::dispatch(args, format),
        Command::Snapshot(args) => cli::snapshot::dispatch(args, format),
        Command::Observe(args) => cli::observe::dispatch(args, format),
        Command::Console(args) => cli::console::dispatch(args, format),
        Command::Debug(args) => cli::debug::dispatch(*args, format),
        Command::Network(args) => cli::network::dispatch(args, format),
        Command::GetHtml(args) => cli::get_html::dispatch(args, format),
        Command::Extract(args) => cli::extract::dispatch(args, format),
        Command::Navigate(args) => cli::navigate::dispatch_navigate_command(args, format),
        Command::NavigateBack(args) => cli::navigate::dispatch_navigate_back(args, format),
        Command::NavigateForward(args) => cli::navigate::dispatch_navigate_forward(args, format),
        Command::Reload(args) => cli::navigate::dispatch_reload(args, format),
        Command::Click(args) => cli::interaction::dispatch_click(args, format),
        Command::Hover(args) => cli::interaction::dispatch_hover(args, format),
```

</details>

**依据 3 · 源码核查**：[crates/bsk-cli/src/daemon/sessions.rs:180-215](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/crates/bsk-cli/src/daemon/sessions.rs#L180-L215)

锁内预留避免ID碰撞。

<details>
<summary>查看原文（36行）</summary>

```text
    pub fn reserve_id(
        &self,
        browser_id: BrowserId,
        max_attempts: u32,
        now_ms_fn: impl Fn() -> i64,
    ) -> Option<SessionId> {
        let mut guard = self.inner.lock().expect("session registry poisoned");
        for _ in 0..max_attempts {
            let candidate = SessionId::random();
            // A tombstoned id still means "recently ended": reusing it
            // would immediately look like a crash/stop to clients that
            // dispatch against the old id (see `SessionEnd`).
            if guard.contains_key(&candidate)
                || self
                    .ended
                    .lock()
                    .expect("session end registry poisoned")
                    .contains_key(&candidate)
            {
                continue;
            }
            guard.insert(
                candidate.clone(),
                Session {
                    interaction: None,
                    id: candidate.clone(),
                    browser_id: browser_id.clone(),
                    agent_window_id: None,
                    created_at_ms: now_ms_fn(),
                },
            );
            self.last_activity
                .lock()
                .expect("session activity registry poisoned")
                .insert(candidate.clone(), SessionActivity::default());
            return Some(candidate);
```

</details>

**依据 4 · 源码核查**：[crates/bsk-cli/src/daemon/sessions.rs:681-719](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/crates/bsk-cli/src/daemon/sessions.rs#L681-L719)

发扩展请求与失败撤销。

<details>
<summary>查看原文（39行）</summary>

```text
    let session_id = sessions
        .reserve_id(client.id.clone(), SESSION_ID_MAX_RESERVE_ATTEMPTS, now_ms)
        .ok_or(StartSessionError::IdExhausted)?;
    if preserve_cleanup {
        sessions.starting.lock().unwrap().insert(session_id.clone());
    }
    let params = SessionStartParams {
        incognito: window.incognito,
        session_id: session_id.0.clone(),
        browser_instance_id: Some(client.id.0.clone()),
        width: window.size.map(|(width, _)| width),
        height: window.size.map(|(_, height)| height),
        focused: window.focused,
        unattended: false,
    };
    let rpc_id = next_rpc_id("sess-start");
    let request = RequestFrame {
        id: rpc_id.clone(),
        method: bsk_protocol::Method::ToolSessionStart,
        params: Some(serde_json::to_value(&params).unwrap()),
    };
    if cancel.as_ref().is_some_and(AbortToken::is_cancelled) {
        sessions.cancel_reservation(&session_id);
        return Err(StartSessionError::Cancelled);
    }
    // Registering the waiter and sending share the socket's pending lock,
    // so a browser that reconnects here either loses the race (the start
    // is refused before anything is sent) or wins it (the waiter settles
    // at once with the reconnect error) — never both.
    let mut waiter = match client.dispatch(request) {
        Ok(waiter) => waiter,
        Err(err) => {
            sessions.cancel_reservation(&session_id);
            return Err(match err {
                super::browsers::SendError::Terminated(cause) => {
                    StartSessionError::ExtensionError(cause)
                }
                super::browsers::SendError::SinkClosed => StartSessionError::TransportClosed,
            });
```

</details>

**依据 5 · 源码核查**：[apps/extension/src/tools/session.ts:124-153](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/tools/session.ts#L124-L153)

扩展实际调用manager.start。

<details>
<summary>查看原文（30行）</summary>

```text
export async function handleSessionStart(
  manager: SessionManager,
  params: SessionStartParams,
  deps: SessionStartDeps = {},
): Promise<SessionStartResult | RpcError> {
  if (!params?.session_id) {
    return {
      code: "invalid_params",
      message: "session.start requires session_id",
    };
  }
  if (params.unattended !== undefined && typeof params.unattended !== "boolean") {
    return { code: "invalid_params", message: "unattended must be a boolean" };
  }
  if (params.incognito !== undefined && typeof params.incognito !== "boolean") {
    return { code: "invalid_params", message: "incognito must be a boolean" };
  }
  const sizeOrErr = validateWindowSize(params.width, params.height);
  if (isRpcError(sizeOrErr)) return sizeOrErr;
  try {
    await deps.preferences?.readyOrFallback();
    const ctx = await manager.start(params.session_id, {
      incognito: params.incognito,
      size: sizeOrErr,
      focused: params.focused,
      signal: deps.signal,
    });
    return {
      agent_window_id: ctx.agentWindowId,
      interaction: interactionPolicy(deps.preferences?.get() ?? DEFAULT_INTERACTION_PREFERENCES),
```

</details>

**依据 6 · 源码核查**：[apps/extension/src/session-manager/manager.ts:254-278](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/session-manager/manager.ts#L254-L278)

记录窗口与自建tab身份。

<details>
<summary>查看原文（25行）</summary>

```text
  async start(sessionId: string, opts: SessionStartOptions = {}): Promise<SessionContext> {
    if (this.sessions.has(sessionId)) {
      throw new Error(`[bh] session ${sessionId} already exists`);
    }
    throwIfSessionStartAborted(opts.signal);

    let windowId: number | null = null;
    const agentCreatedTabs = new Set<number>();
    try {
      const { signal: _signal, ...createOptions } = opts;
      const created = await this.agentWindow.create(AGENT_WINDOW_HOME, createOptions);
      windowId = created.windowId;
      for (const tabId of created.initialTabIds) agentCreatedTabs.add(tabId);
      if (opts.incognito && !created.incognito) {
        throw new Error(
          "The browser did not create an incognito Agent Window; session start refused.",
        );
      }
      throwIfSessionStartAborted(opts.signal);
      const homeTabId = await this.agentWindow.ensureActiveTab(
        windowId,
        AGENT_WINDOW_HOME,
        agentCreatedTabs,
      );
      agentCreatedTabs.add(homeTabId);
```

</details>

**依据 7 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:76-95](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/session-manager/agent-window.ts#L76-L95)

仅复用自有tab。

<details>
<summary>查看原文（20行）</summary>

```text
  async ensureActiveTab(
    windowId: number,
    url: string,
    ownedTabIds: ReadonlySet<number>,
  ): Promise<number> {
    const tabs = await chrome.tabs.query({ windowId });
    // A user may have opened a tab while window initialization was pending.
    // Reuse only a tab whose identity came from our creation result.
    const first = tabs.find((t) => t.id !== undefined && ownedTabIds.has(t.id));
    if (first?.id !== undefined) {
      if (!first.active) {
        await chrome.tabs.update(first.id, { active: true });
      }
      return first.id;
    }
    const created = await chrome.tabs.create({ windowId, url, active: true });
    if (typeof created?.id !== "number") {
      throw new Error("[bh] chrome.tabs.create returned no tab id");
    }
    return created.id;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 低干扰、无痕和结束会话分别保证到哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

后台窗口默认不聚焦只约束创建阶段，人工帮助、原生弹窗及站点行为仍可能改变焦点，不能推断完全无干扰。普通profile共享账号权限；无痕模式要扩展明确许可，而且是浏览器共享无痕会话，不是每个Agent独立账号沙箱。结束会话会先归还借用页：若移动失败，借用记录和窗口保持活跃并返回return_failures，用户可重试stop或单独return，而不是误报成功并关闭用户页。该设计优先保留用户资源，但增加异常收敛责任。取消或窗口关闭都不回滚已经提交的表单、下载或其他网页业务副作用，采用时需要任务级结果核对。

#### 证据与依据

**依据 1 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:31-55](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/session-manager/agent-window.ts#L31-L55)

focus与共享无痕语义和权限检查。

<details>
<summary>查看原文（25行）</summary>

```text
/** Creation hints for a new Agent Window. */
export interface AgentWindowCreateOptions {
  /** Optional outer size in CSS pixels. */
  size?: { width: number; height: number };
  /** Background by default; explicit viewing and human help may take focus. */
  focused?: boolean;
  /** Use Chrome's shared incognito browsing session. */
  incognito?: boolean;
}

/** Initial tab URL for every new session's Agent Window. */
export const AGENT_WINDOW_HOME = "about:blank";

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
```

</details>

**依据 2 · 源码核查**：[apps/extension/src/tools/session.ts:84-95](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/tools/session.ts#L84-L95)

返回失败与窗口释放结果。

<details>
<summary>查看原文（12行）</summary>

```text
export interface SessionStopResult {
  /** Tab ids that were returned to their original (or fallback) window. */
  returned_tab_ids?: number[];
  /** Tab ids whose return path failed; those entries remain borrowed so
   *  shutdown can be retried without closing the Agent Window. */
  return_failures?: Array<{ tab_id: number; code: string; message: string }>;
  /**
   * True when the Agent Window was *released* to the user (instead of being
   * closed) because it still contained user-created tabs after the agent's own
   * tabs were closed. Single-session scope.
   */
  window_released?: boolean;
```

</details>

**依据 3 · 源码核查**：[apps/extension/src/tools/session.ts:279-305](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/tools/session.ts#L279-L305)

归还失败保留活跃会话以重试。

<details>
<summary>查看原文（27行）</summary>

```text
  // A previously failed tab may have closed during a later return. Only
  // confirmed close events remove borrows; ordinary move failures stay retryable.
  const pendingReturnFailures = returnFailures.filter((failure) =>
    ctx.borrowedTabs.has(failure.tab_id),
  );
  if (deps.signal?.aborted) {
    const nonCancelFailures = pendingReturnFailures.filter(
      (failure) => failure.code !== "cancelled",
    );
    if (nonCancelFailures && nonCancelFailures.length > 0) {
      return {
        ...(returnedTabIds.length > 0 ? { returned_tab_ids: returnedTabIds } : {}),
        return_failures: nonCancelFailures,
      };
    }
    return { code: "cancelled", message: "session_stop aborted during tab return" };
  }

  const result: SessionStopResult = {};
  if (returnedTabIds.length > 0) result.returned_tab_ids = returnedTabIds;
  if (pendingReturnFailures.length > 0) {
    result.return_failures = pendingReturnFailures;
    // A failed return means at least one borrowed user tab may still be
    // inside the Agent Window. Keep the session/window alive so the user
    // can retry `bsk session stop` or explicitly `bsk tab return` after the
    // underlying Chrome issue is resolved.
    return result;
```

</details>

#### 缺口

- 未执行断连、崩溃、弹窗与归还失败的端到端对照
  **影响**：不能保证全部失败自动恢复或无干扰
  **进一步探讨**：在专用profile注入这些情形，确认用户页保留、停止结果和业务状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定试用，并检验会话窗口是否确有净价值？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需bsk CLI/daemon、受支持浏览器、已连接扩展和宿主能发现的技能；doctor成功不证明技能发现，需在实际Agent环境检查PATH并开启新会话。首次负担是安装、profile选择和授权，持续负担是页面变化适配、模型回合与结果复核，失败要归还借用页、停止会话并核对业务副作用，金额和工时未知。建议先在专用profile做只读资料任务，验收结束归还和人工接管，再考虑可撤回的测试表单；已存在可靠API则先比较其路径。未验证假设是“会话所有权+可见窗口+明确归还”比普通自动化窗口减少干扰而不增加恢复负担。固定站点任务对照两组，记录焦点变化、误关用户页、合格率和接管/清理时间；原生弹窗多或清理耗时抵消收益即推翻。该假设不把窗口存在当成效果证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:85-91](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/README.md#L85-L91)

实际Agent环境的PATH与重启条件。

````text
By default, the binary is installed under `~/.local/bin`. Check it in the terminal or agent environment that will use it:

```sh
bsk --version
```

If an already-running agent cannot find `bsk`, restart it to pick up the new PATH, or configure the installed binary's absolute path.
````

**依据 2 · 作者声明**：[README.md:115-131](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/README.md#L115-L131)

doctor不证明技能发现与任务窗口工作方式。

<details>
<summary>查看原文（17行）</summary>

````text
```sh
bsk doctor
```

Resolve any failed checks and confirm that the extension shows **Connected**. Start a new agent session and check that it can discover `browser-skill`; a successful doctor check alone does not confirm skill discovery.

</details>

### Try your first task

Once connected, ask your agent:

```text
Use browser-skill to open https://example.com, summarize the page, and end the browser session when finished.
```

The agent opens its own window in the background, reads the page, returns the summary, and stops its task. External links or manually created tabs that land in the task window are moved to your most recently used normal window; a user window is created if none remain. Routing happens after tab creation, so a tab may briefly appear in the task window. Page-opened tabs and human assistance or recording are preserved. Harnesses that support skill slash commands can also use `/browser-skill`.
````

</details>

**依据 3 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:69-74](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/session-manager/agent-window.ts#L69-L74)

清理失败不能假报成功。

```text
  async remove(windowId: number): Promise<void> {
    // Callers decide whether a missing/failed removal is benign. In
    // particular, transactional session-start cleanup must be able to
    // surface a window it could not remove instead of reporting a false
    // cancellation success while the Agent Window remains open.
    await chrome.windows.remove(windowId);
```

**依据 4 · 源码核查**：[apps/extension/src/tools/session.ts:299-305](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/apps/extension/src/tools/session.ts#L299-L305)

失败归还的用户恢复路径。

```text
  if (pendingReturnFailures.length > 0) {
    result.return_failures = pendingReturnFailures;
    // A failed return means at least one borrowed user tab may still be
    // inside the Agent Window. Keep the session/window alive so the user
    // can retry `bsk session stop` or explicitly `bsk tab return` after the
    // underlying Chrome issue is resolved.
    return result;
```

#### 缺口

- 没有真实任务的焦点干扰、总人工与站点兼容对照
  **影响**：只能受控试用，不构成生产任务保证
  **进一步探讨**：用非敏感专用profile完成对照并计入所有异常清理时间。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
