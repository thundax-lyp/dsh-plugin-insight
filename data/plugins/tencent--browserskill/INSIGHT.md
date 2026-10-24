# BrowserSkill

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[b63f551](https://github.com/Tencent/BrowserSkill/tree/b63f551209caba4d7debfc12215b2b7c118bad49)

<!-- BEGIN META -->
[![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill)
<!-- END META -->

> **实现功能**：通过 CLI 和浏览器扩展，让智能体使用现有 Chrome 或 Edge 登录状态执行网页任务。

> **核心亮点**：根产品将现有 profile 的网页操作变成带会话所有权、可见任务窗口与归还语义的跨宿主连接层，增量是人机交接与资源组织；DSH 工具呈现属于可选适配层。[Q01](#research-q01) [Q03](#research-q03)

> **风险与缺陷**：Agent Window 共享普通 profile 的权限，不能视为账号沙箱；原生弹窗仍可激活，取消不回滚已发生的网页业务写入。[Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)
- [4 研究问题与完整回答](#detail-section-9)
  - [Q01 · 已有网页登录状态为何构成独立价值，根产品交付什么？](#detail-section-10)
  - [Q02 · CLI、daemon 与扩展如何建立任务会话？](#detail-section-11)
  - [Q03 · 可见任务窗口较普通自动化新增什么，哪些隔离主张不能成立？](#detail-section-12)
  - [Q04 · 哪些工作值得试用，首用、持续和失败成本如何衡量？](#detail-section-13)
  - [Q05 · 哪些资源所有权设计值得迁移，怎样检验任务窗口能否降低干扰？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面对只有网页界面或已有登录态的办公系统，用户要让任意 shell 型智能体读取资料、填表或调查请求，同时保留人工接管。

面对只有网页界面或已有登录态的办公系统，用户要让任意 shell 型智能体读取资料、填表或调查请求，同时保留人工接管。合格结果不是仅能打开浏览器，而是在指定 profile 中完成任务并留下可检查的页面或导出结果。简单替代是人手操作或另启隔离浏览器脚本；后者往往需要重新登录。根产品提供 Rust bsk CLI、daemon 和 Chrome/Edge 扩展，DSH 子包只是可选原生集成，私有根工作区并不是 npm 插件包。复用普通 profile 也复用了账号权限，Agent Window 是工作组织边界，不是账号沙箱。

替代基线是手工网页操作、独立自动化 profile 或站点 API。BrowserSkill 的主要差异是复用已有登录态并显式管理人机共享窗口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| bsk session | 创建、列出和停止浏览器任务会话 | 需 daemon 与已连接扩展，普通模式共享账号状态 |
| bsk navigate / observe | 导航并取得页面可操作状态 | 需明确浏览器实例和有效 session_id |
| bsk click / fill / press | 按目标执行页面交互 | 登录权限来自目标 profile，业务写入不能靠取消撤销 |
| bsk screenshot | 取得浏览器画面用于结果复核 | 需会话与输出路径，截图不证明业务成功 |
| Agent Window | 独立显示任务并支持人工接管 | 默认后台；公共浏览器 API 不保证完全不抢焦点 |
| 会话退出与借用归还 | 归还用户标签页并释放自有窗口 | 归还失败显式返回，仍有用户页时窗口释放给用户 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| bsk CLI/daemon | 必需 | 分发命令和路由浏览器实例 | 无法建立会话 |
| Chrome/Edge 及扩展 | 必需 | 执行页面与窗口操作 | 浏览器未连接则任务失败 |
| shell 智能体与技能 | Agent 场景需要 | 规划调用与遵守交接协议 | CLI 可独立使用但无模型规划 |
| 无痕扩展权限 | 无痕任务需要 | 建立无痕任务窗口 | 被显式拒绝，不能借用普通页 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户安装 bsk、Chrome/Edge 扩展与目标宿主技能 | 核对 CLI 可见性及扩展连接 |
| 检查 | 用户执行 bsk doctor 并核对技能发现 | doctor 通过仍需新会话确认技能可用 |
| 启动 | 模型 bsk session start --json 并指定目标 browser | 保存 session_id，不能换到不明 profile |
| 执行 | 模型 navigate、observe 后按任务读取或操作 | 遇登录或验证码请求人工接管 |
| 退出 | 模型 bsk session stop，用户检查借用页归还 | 失败后仍停止并复核已发生的业务动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI、扩展与浏览器；金额未知 | 连接验证、技能发现、profile 选择；耗时未知 | doctor 不证明技能已被宿主发现 |
| 持续使用 | 模型与浏览器资源；金额未知 | 页面变化适配和结果复核；频率未知 | 普通窗口共享账号权限 |
| 失败恢复 | 重试和残留会话资源；金额未知 | 归还借用页、停止会话并检查业务副作用；耗时未知 | 归还失败须保留并重试，不能误报关闭成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 账号复用 | 作者声明及普通窗口创建支持既有 profile 工作流 | 具体站点登录兼容与收益未测 |
| 任务资源管理 | daemon 预留 ID，扩展记录并使用自有标签页 | 断连与崩溃下端到端恢复未执行 |
| 低干扰 | 默认 focused=false，任务和普通窗口分离 | 原生弹窗可能激活，未测干扰频率 |

> **思考**：Agent Window 共享普通 profile 的权限，不能视为账号沙箱；原生弹窗仍可激活，取消不回滚已发生的网页业务写入。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：根产品将现有 profile 的网页操作变成带会话所有权、可见任务窗口与归还语义的跨宿主连接层，增量是人机交接与资源组织；DSH 工具呈现属于可选适配层。[Q01](#research-q01) [Q03](#research-q03)

窗口创建结果立即记录 windowId 和 initialTabIds，ensureActiveTab 只复用自己创建时取得的标签页，避免把初始化期间用户新开的页面误认成自有资源。daemon 的锁内 ID 预留是并发资源分配可复用机制，但移植需要明确事务完成、失败撤销和残留资源诊断。由默认后台窗口及显式归还推导

<a id="detail-section-5"></a>

### 1.4 使用建议

需要利用既有网页登录态的用户可先在专用 profile 做读取任务，确认会话停止和借用页归还，再考虑有写入的工作；已有可靠 API 时先比较 API 路径。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查源码，固定提交 [b63f5512](https://github.com/Tencent/BrowserSkill/tree/b63f551209caba4d7debfc12215b2b7c118bad49)；研究范围为根项目的入口和本文列出的关键机制。
- 未安装、未运行目标代码或测试，未完成真实宿主与模型任务验收。
- 固定提交的源码级研究，覆盖上述核心入口与机制；不是全项目所有功能的穷尽核查。
- 根项目工程统计按工具现有规则记录 JS/TS 与 Markdown，Go/Rust 后端语义来自列出的人工源码核查，不把这些统计当作全语言 LOC。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

未验证假设是会话窗口与明确归还能减少干扰且保留接管能力，通过焦点变化、误关标签页和接管时间与普通窗口对照检验。[Q05](#research-q05)

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 55 | 6961 | — | — | 74201 |
| .ts | test | 216 | 77561 | 72550 | 1898 | — |
| .ts | source | 274 | 63472 | 56145 | 4046 | — |
| .tsx | test | 24 | 5419 | 4930 | 83 | — |
| .tsx | source | 41 | 9249 | 8794 | 118 | — |
| .md | example | 3 | 645 | — | — | 5426 |
| .mjs | source | 37 | 5484 | 5051 | 191 | — |
| .mjs | example | 8 | 202 | 191 | 0 | — |
| .mjs | test | 6 | 714 | 660 | 4 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Tencent/BrowserSkill/issues) 查看。

<a id="detail-section-9"></a>

## 4 研究问题与完整回答

**插件研究总目标**：BrowserSkill 如何在明确边界内形成可采用能力，且贡献与依赖如何区分？

<a id="research-q01"></a>

<a id="detail-section-10"></a>

### Q01 · 已有网页登录状态为何构成独立价值，根产品交付什么？

**研究主题**：场景与需求

#### 完整回答

面对只有网页界面或已有登录态的办公系统，用户要让任意 shell 型智能体读取资料、填表或调查请求，同时保留人工接管。合格结果不是仅能打开浏览器，而是在指定 profile 中完成任务并留下可检查的页面或导出结果。简单替代是人手操作或另启隔离浏览器脚本；后者往往需要重新登录。根产品提供 Rust bsk CLI、daemon 和 Chrome/Edge 扩展，DSH 子包只是可选原生集成，私有根工作区并不是 npm 插件包。复用普通 profile 也复用了账号权限，Agent Window 是工作组织边界，不是账号沙箱。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-39](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/README.md#L23-L39)

作者说明现有登录态、任务窗口与跨宿主 CLI。

<details>
<summary>查看原文（17行）</summary>

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
| **Review what happened** | Reopen browser-local debugging history, export evidence as JSON, or enable a separate operation audit to review task activity. |
| **Extract structured data** | Export loaded tables and lists as JSON/CSV with column names, page/frame sources, merged-cell metadata and explicit coverage. See [structured extraction](docs/structured-extraction.md). |
| **Record a task as video** | Ask the agent to record one authorized tab as a silent MP4, then preview, save or delete the video from the extension. See [task video recording](docs/video-recording.md). |
| **Wait for page conditions** | Wait for a requested element condition with an explicit timeout before continuing a workflow. See [element waits](docs/wait-for-element.md). |
```

</details>

**依据 2 · 源码核查**：[package.json:1-8](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/package.json#L1-L8)

根工作区为 private。

```text
{
  "name": "browser-skill",
  "private": true,
  "packageManager": "pnpm@10.17.0",
  "scripts": {
    "cli:build": "cargo run -p bsk-protocol --bin dump-schema --locked && pnpm -r build",
    "eval:browser": "node evals/browser/cli.mjs",
    "eval:browser:check": "node evals/browser/cli.mjs validate && node --test evals/browser/tests/*.test.mjs",
```

<a id="research-q02"></a>

<a id="detail-section-11"></a>

### Q02 · CLI、daemon 与扩展如何建立任务会话？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

main 解析 CLI 后将命令分发到 session、navigate、observe、interaction 等处理器，并传入共享观察上下文。daemon 中 SessionRegistry 维护会话到浏览器实例和 Agent Window 的映射，创建前在锁内预留随机 ID，成功后提交、失败后撤销，避免碰撞覆盖既有会话。扩展 handleSessionStart 调用 manager.start，底层 chrome.windows.create 建立独立窗口，默认不抢焦点并以 about:blank 启动。需要 CLI/daemon、可用扩展及受支持浏览器；普通模式使用现有 profile，无痕模式另需扩展权限且不能借用普通标签页。

#### 证据与依据

**依据 1 · 源码核查**：[crates/bsk-cli/src/main.rs:36-112](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/crates/bsk-cli/src/main.rs#L36-L112)

CLI 实际命令入口。

<details>
<summary>查看原文（77行）</summary>

```text
fn dispatch(cli: Cli, format: Format) -> Result<(), CliError> {
    cli::business_rpc::set_context(cli.flags.context.clone());
    cli::business_rpc::set_dependencies(cli.flags.depends_on.clone());
    match cli.command {
        Command::Cooperate(args) => cli::cooperate::dispatch(args, format),
        Command::Daemon(cmd) => cli::daemon::dispatch(cmd).map_err(CliError::Local),
        Command::Status => {
            let output = if cli.flags.json {
                Output::Json
            } else {
                Output::Human
            };
            cli::status::run(output).map(|_| ())
        }
        Command::Doctor => {
            let output = if cli.flags.json {
                Output::Json
            } else {
                Output::Human
            };
            let checks = cli::doctor::run(output).map_err(CliError::Local)?;
            if cli::doctor::has_failures(&checks) {
                Err(CliError::RenderedExit { exit_code: 1 })
            } else {
                Ok(())
            }
        }
        Command::InstallSkill(args) => {
            let output = if cli.flags.json {
                Output::Json
            } else {
                Output::Human
            };
            cli::install_skill::dispatch(args, output)
        }
        Command::Update(args) => cli::update::dispatch(args, format),
        Command::Logs(cmd) => cli::logs::run(cli::logs::LogsArgs {
            follow: cmd.follow,
            lines: cmd.lines,
        })
        .map_err(CliError::Local),
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
        Command::Wheel(args) => cli::wheel::dispatch(args, format),
        Command::ScrollTo(args) => cli::scroll::dispatch(args, format),
        Command::Focus(args) => cli::interaction::dispatch_focus(args, format),
        Command::Blur(args) => cli::interaction::dispatch_blur(args, format),
        Command::Fill(args) => cli::interaction::dispatch_fill(args, format),
        Command::Press(args) => cli::interaction::dispatch_press(args, format),
        Command::Select(args) => cli::interaction::dispatch_select(args, format),
        Command::Upload(args) => cli::upload::dispatch(args, format),
        Command::Download(args) => cli::download::dispatch(args, format),
        Command::Evaluate(args) => cli::evaluate::dispatch(args, format),
        Command::WaitForNavigation(args) => cli::waits::dispatch_wait_for_navigation(args, format),
        Command::WaitForElement(args) => cli::waits::dispatch_wait_for_element(args, format),
        Command::WaitMs(args) => cli::waits::dispatch_wait_ms(args, format),
        Command::RequestHelp(args) => cli::human_loop::dispatch(args, format),
        Command::Record(cmd) => cli::record::dispatch(cmd, format),
        Command::Video(cmd) => cli::video::dispatch(cmd, format),
    }
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/sessions.rs:144-202](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/crates/bsk-cli/src/daemon/sessions.rs#L144-L202)

会话 ID 预留和提交。

<details>
<summary>查看原文（59行）</summary>

```text
    /// a deterministic error instead of looping forever.
    ///
    /// The 4-letter id space is `26^4 = 456_976`; with even a small
    /// number of live sessions the birthday probability of a collision
    /// is not negligible. Without this reservation the subsequent
    /// `insert` would silently overwrite a live session, leaking its
    /// `agent_window_id` and dropping its CLI mapping (review M4/M5 C1).
    ///
    /// Pair every successful reservation with [`SessionRegistry::commit_reservation`]
    /// or [`SessionRegistry::cancel_reservation`] so placeholders never
    /// leak when the extension round-trip fails.
    pub fn reserve_id(
        &self,
        browser_id: BrowserId,
        max_attempts: u32,
        now_ms_fn: impl Fn() -> i64,
    ) -> Option<SessionId> {
        let mut guard = self.inner.lock().expect("session registry poisoned");
        for _ in 0..max_attempts {
            let candidate = SessionId::random();
            if guard.contains_key(&candidate) {
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
        }
        None
    }

    /// Replace a previously [`reserve_id`](Self::reserve_id) placeholder
    /// with the real `agent_window_id` returned by the extension.
    /// Returns the resulting [`Session`] for callers that want to echo
    /// it back.
    pub fn commit_reservation(
        &self,
        session_id: &SessionId,
        agent_window_id: Option<i64>,
    ) -> Option<Session> {
        let mut guard = self.inner.lock().expect("session registry poisoned");
        let session = guard.get_mut(session_id)?;
        session.agent_window_id = agent_window_id;
        let session = session.clone();
        self.starting.lock().unwrap().remove(session_id);
        drop(guard);
        if let Some(audit) = &self.audit {
            audit.session_started(&session);
```

</details>

**依据 3 · 源码核查**：[apps/extension/src/tools/session.ts:137-163](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/apps/extension/src/tools/session.ts#L137-L163)

扩展接收并创建会话。

<details>
<summary>查看原文（27行）</summary>

```text
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
    };
  } catch (err) {
    if (err instanceof SessionStartCleanupError) {
      return rpcError("protocol_error", "cleanup_failed", err.message, {
        resource_type: "agent_window",
        resource_id: err.windowId,
      });
    }
    if (
      typeof err === "object" &&
```

</details>

**依据 4 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:44-72](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/apps/extension/src/session-manager/agent-window.ts#L44-L72)

窗口创建和无痕权限。

<details>
<summary>查看原文（29行）</summary>

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
        typeof tab.id === "number" ? [tab.id] : [],
      ),
    };
  },
  async remove(windowId: number): Promise<void> {
    // Callers decide whether a missing/failed removal is benign. In
    // particular, transactional session-start cleanup must be able to
    // surface a window it could not remove instead of reporting a false
```

</details>

<a id="research-q03"></a>

<a id="detail-section-12"></a>

### Q03 · 可见任务窗口较普通自动化新增什么，哪些隔离主张不能成立？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是将智能体任务组织为可见且可归还的浏览器会话，结合原有账号，降低跨应用任务的登录交接负担，而非发明新的点击算法。SessionStopResult 显式区分归还标签页成功、失败和将仍含用户页的窗口释放给用户，说明资源退出考虑了共同工作场景。反例是平台弹窗仍可能抢焦点，Chrome 公共 API 不能保证零瞬时激活；普通窗口也共享账号状态，不能据独立窗口推断权限隔离。已登录任务可产生真实业务写入，协议取消只终止后续动作，不能撤销已提交表单。

#### 证据与依据

**依据 1 · 源码核查**：[apps/extension/src/tools/session.ts:89-108](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/apps/extension/src/tools/session.ts#L89-L108)

归还失败及窗口释放属于显式结果。

<details>
<summary>查看原文（20行）</summary>

```text
  return_failures?: Array<{ tab_id: number; code: string; message: string }>;
  /**
   * True when the Agent Window was *released* to the user (instead of being
   * closed) because it still contained user-created tabs after the agent's own
   * tabs were closed. Single-session scope.
   */
  window_released?: boolean;
}

export interface SessionStopDeps {
  signal?: AbortSignal;
  cdp?: Pick<CdpRunner, "releaseSessionTab"> & {
    detachSession(sessionId: string): Promise<void>;
  };
  /**
   * Tab management deps forwarded to `returnBorrowedTab`. Defaults to
   * the production `chrome.tabs` / `chrome.windows` wrappers, but
   * tests can inject fakes so the auto-return path is unit-tested
   * without a real browser.
   */
```

</details>

**依据 2 · 作者声明**：[README.md:131-133](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/README.md#L131-L133)

作者明确焦点恢复限制。

```text
The agent opens its own window in the background, reads the page, returns the summary, and stops its task. External links or manually created tabs that land in the task window are moved to your most recently used normal window; a user window is created if none remain. Routing happens after tab creation, so a tab may briefly appear in the task window. Page-opened tabs and human assistance or recording are preserved. Harnesses that support skill slash commands can also use `/browser-skill`.

Chrome can still activate a window when a page opens a native popup. For observed task popups, the extension restores the previous Chrome window or minimized state if you have not switched windows. Chrome's public extension APIs cannot guarantee zero transient activation or restore focus to another application.
```

**依据 3 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:52-57](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/apps/extension/src/session-manager/agent-window.ts#L52-L57)

普通与无痕窗口是不同选项。

```text
      type: "normal",
      focused: opts.focused ?? false,
      incognito: opts.incognito ?? false,
      url,
      ...(opts.size ? { width: opts.size.width, height: opts.size.height } : {}),
    });
```

<a id="research-q04"></a>

<a id="detail-section-13"></a>

### Q04 · 哪些工作值得试用，首用、持续和失败成本如何衡量？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合有重复网页读取、内部资料整理和测试环境表单任务的用户，在专用 profile 和明确目标下试用。若站点有可靠 API，直接 API 集成通常更容易约束权限并复现，浏览器连接的价值主要在界面与登录状态不可替代时。首次投入是 CLI、扩展、技能与连接检查，持续投入是模型操作回合、浏览器占用及人工验证，失败恢复要检查并归还借用页、停止会话并复核已发生的业务动作。金额、耗时、成功率均没有本轮实测；不能把复用登录态直接换算为节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-54](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/README.md#L45-L54)

三组件和平台要求。

<details>
<summary>查看原文（10行）</summary>

```text
## Quick Start

For local automation, you need **an AI agent + the `bsk` CLI + the browser extension**. The CLI includes the background daemon. The skill teaches your agent how to use it.

| Component | Supported environments |
| --- | --- |
| CLI / daemon | macOS: Apple Silicon and Intel · Linux: x64 and ARM64 · Windows: x64 |
| Extension | Chrome and Microsoft Edge, based on Chromium 125 or later. Other Chromium browsers may work; compatibility is not guaranteed. |
| Agent integration | A shell-capable agent with the BrowserSkill skill, or DeepSeek Harness with the [DSH plugin](#deepseek-harness-plugin). |

```

</details>

**依据 2 · 作者声明**：[README.md:116-155](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/README.md#L116-L155)

doctor、任务流程、结束会话与主机后台限制。

<details>
<summary>查看原文（40行）</summary>

````text
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

Chrome can still activate a window when a page opens a native popup. For observed task popups, the extension restores the previous Chrome window or minimized state if you have not switched windows. Chrome's public extension APIs cannot guarantee zero transient activation or restore focus to another application.

<details>
<summary><b>Try the CLI directly</b></summary>

Start a session and keep the returned `session_id`:

```sh
bsk session start --json
```

Replace `<id>` with that value in each command below. With multiple connected browsers, select one using `--browser <instance-id-or-name>` when starting the session. Background creation is the default; `--no-focus` remains supported, and `--focus` explicitly brings the new window forward. Requests for human help and interactive recording still bring the relevant window forward.

```sh
bsk navigate https://example.com --session <id>
bsk observe --session <id>
bsk screenshot --session <id> --out example.png
bsk session stop <id>
```

Use `bsk --help` or `bsk <command> --help` for command options. Always stop your session when finished, including after a failed task; borrowed tabs are returned to their original window.

</details>
````

</details>

#### 缺口

- 缺少同站点、同任务的人工/API/浏览器三组效果。
  **影响**：无法量化 UI 自动化相对于简单替代的收益和复核负担。
  **进一步探讨**：选择读取与写入两类固定任务，测合格产出、接管、重试和总耗时。

<a id="research-q05"></a>

<a id="detail-section-14"></a>

### Q05 · 哪些资源所有权设计值得迁移，怎样检验任务窗口能否降低干扰？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

窗口创建结果立即记录 windowId 和 initialTabIds，ensureActiveTab 只复用自己创建时取得的标签页，避免把初始化期间用户新开的页面误认成自有资源。daemon 的锁内 ID 预留是并发资源分配可复用机制，但移植需要明确事务完成、失败撤销和残留资源诊断。由默认后台窗口及显式归还推导未验证假设：任务窗口加受控接管能减少用户干扰且保留失败恢复能力。最小试验比较普通自动化窗口与会话窗口，记录焦点变化、误关用户页、任务完成与接管时间；原生弹窗较多的站点可能推翻低干扰优势。

#### 证据与依据

**依据 1 · 源码核查**：[apps/extension/src/session-manager/agent-window.ts:77-97](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/apps/extension/src/session-manager/agent-window.ts#L77-L97)

只复用已拥有标签页。

<details>
<summary>查看原文（21行）</summary>

```text
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
  },
};
```

</details>

**依据 2 · 源码核查**：[crates/bsk-cli/src/daemon/sessions.rs:144-184](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/crates/bsk-cli/src/daemon/sessions.rs#L144-L184)

资源 ID 并发预留。

<details>
<summary>查看原文（41行）</summary>

```text
    /// a deterministic error instead of looping forever.
    ///
    /// The 4-letter id space is `26^4 = 456_976`; with even a small
    /// number of live sessions the birthday probability of a collision
    /// is not negligible. Without this reservation the subsequent
    /// `insert` would silently overwrite a live session, leaking its
    /// `agent_window_id` and dropping its CLI mapping (review M4/M5 C1).
    ///
    /// Pair every successful reservation with [`SessionRegistry::commit_reservation`]
    /// or [`SessionRegistry::cancel_reservation`] so placeholders never
    /// leak when the extension round-trip fails.
    pub fn reserve_id(
        &self,
        browser_id: BrowserId,
        max_attempts: u32,
        now_ms_fn: impl Fn() -> i64,
    ) -> Option<SessionId> {
        let mut guard = self.inner.lock().expect("session registry poisoned");
        for _ in 0..max_attempts {
            let candidate = SessionId::random();
            if guard.contains_key(&candidate) {
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
        }
        None
    }
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
