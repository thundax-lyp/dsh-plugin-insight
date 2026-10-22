# dsh-discord-richpresence

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bf8d34b](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence)
<!-- END META -->

> **实现功能**：将 DSH 粗粒度活动经本地 Discord IPC 发布为 Rich Presence，丰富模式可附步骤/tokens/思考时长。

> **核心亮点**：把 DSH 生命周期映射到可自定义的 Discord 状态，减少手工更新资料。详见[Q01](#research-q01)。

> **风险与缺陷**：richMode 关只取消标量，不取消基础 Presence；全局 workflow/start 与未设活跃会话时工具事件可能让阶段文案不精确。详见[Q02](#research-q02)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 它向 Discord 显示哪些 DSH 状态？](#detail-section-11)
  - [Q02 · 默认公开与丰富模式的同意边界是什么？](#detail-section-12)
  - [Q03 · 本地 IPC 和卸载如何影响采用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 Discord 个人资料显示自己正在使用 DSH 的个人用户。

手动设置 Discord 状态或不公开 DSH 活动；插件自动发布模糊阶段。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 基础状态 | 社交展示 | 默认即公开 |
| 丰富模式 | 实时标量 | 当前会话准确性待验 |
| IPC | 本地发布 | 依赖 Discord 桌面 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH 事件/设置 | 阶段与 richMode | 降级 |
| Discord Desktop IPC | 发布状态 | 轮询重连 |
| 用户隐私设置 | 公开范围 | 展示未知 |

#### 验证

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 基础 | 安装冷启动 | 仅模糊文案 |
| 丰富 | 开/关 | 标量按当前会话 |
| 退出 | 卸载/断连 | socket 停止、残留可知 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 启用 | Discord 桌面在线 | 基础状态即公开 |
| 运行 | 常驻 IPC/重连 | 可见范围由账号控制 |
| 卸载 | 设置残留清理 | 未实测 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 模糊状态 | 阶段文案 | 误报频率 |
| 丰富标量 | 当前会话筛选 | 宿主事件准确性 |
| IPC | 握手/重连 | Discord 实机展示 |

> **思考**：richMode 关只取消标量，不取消基础 Presence；全局 workflow/start 与未设活跃会话时工具事件可能让阶段文案不精确。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 DSH 生命周期映射到可自定义的 Discord 状态，减少手工更新资料。详见[Q01](#research-q01)。

把 DSH 生命周期映射到可自定义的 Discord 状态，减少手工更新资料。详见[Q01](#research-q01)。

Host 事件监听、定时去抖/重连、Rich Presence 帧；客户端设置只开关 richMode。

<a id="detail-section-5"></a>

### 1.4 主要限制

richMode 关只取消标量，不取消基础 Presence；全局 workflow/start 与未设活跃会话时工具事件可能让阶段文案不精确。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用隔离 Discord 账号核状态可见范围与断连行为，再决定是否配置文案/丰富模式；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代码支持模糊文案和可选丰富标量；安装启用后基础 Presence 即启动，仍会公开正在使用 DSH，早期/全局阶段不全受活跃会话过滤。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/discord-rpc.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README、Host 事件映射、RPC 和 client 设置；未连接 Discord。
- 下一步：隔离账号检查冷启动默认状态、多会话/子代理阶段、richMode 标量、断连重连与卸载残留。

**分析版本**

- **仓库**：[0QwQ0/dsh-discord-richpresence](https://github.com/0QwQ0/dsh-discord-richpresence)
- **版本号**：0.3.1（[固定提交 bf8d34b](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

添加独立的基础 Presence 启用开关与严格会话过滤，可改进隐私和准确性；待实际客户端验证。详见[Q03](#research-q03)。

隔离账号检查冷启动默认状态、多会话/子代理阶段、richMode 标量、断连重连与卸载残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 518 | — | — | 4632 |
| .js | source | 3 | 1305 | 940 | 270 | — |
| .mjs | test | 7 | 762 | 608 | 81 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+created%3A2026-09-22T06%3A13%3A27.089Z..2026-10-22T06%3A13%3A27.089Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A13%3A27.089Z..2026-10-22T06%3A13%3A27.089Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实 Discord Rich Presence 的事件到状态映射、默认公开范围和本地 IPC 可靠性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它向 Discord 显示哪些 DSH 状态？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

宿主监听用户输入、Agent 状态、工具执行、会话创建和工作流事件，将阶段映射为配置的模糊文案，经本地 Discord RPC 发布到个人资料。可选 richMode 把当前会话的步骤、tokens 和思考时间等标量填入模板。代码读取事件对象中的 source.kind、agent/session 身份及 tokenMeter，未看到将消息正文、标题、文件路径或工具输入/输出塞进 activity；但配置的 status/details 字符串由用户决定，若自行写入敏感内容仍会公开。服务对象是愿意向 Discord 联系人展示工作状态的个人。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-49](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/README.md#L1-L49)

作者说明模糊/丰富状态与隐私。

<details>
<summary>查看原文（49行）</summary>

```text
# dsh-discord-richpresence

> **English**: [README.en.md](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，将你与 dsh 的交互状态**实时**镜像到**本地 Discord 客户端**的 Rich Presence 上——而且只会推送**模糊的、可自定义的状态文案**。

这是一个宿主侧后台插件：无托盘图标、无界面、无窗口。安装后即注入到 dsh 的启动流程中，随 dsh 一起常驻运行。

## 它能做什么

插件监听运行中 dsh 的粗粒度活动信号：

| dsh 信号 | 状态示例（默认） |
| --- | --- |
| 用户消息进入 agent 收件箱 | 正在指挥大肥鱼干活 / 正在给大肥鱼喂 token |
| agent 正在运行（思考 / 流式输出） | 正在与大肥鱼一起 Brainstorming / 正在听大肥鱼讲解 Project |
| 模型工具正在执行 | 正在提交改动意见 |
| 创建了新会话 / 分支（分支对话） | 正在创建大肥鱼记忆切片 |
| 无活动 | 大肥鱼待命 |

上面每一行都是插件配置（`statuses`）中**可直接编辑的列表**。插件只会把这些字符串原样发给 Discord。

## 丰富模式（可选）

默认情况下，插件只推送上面的模糊状态。在**设置 → 通用设置 → Rich Presence 丰富状态**里可以打开**丰富模式**。开启后，插件改为推送更智能、带实时数据的状态行：

| 实时数据 | 状态示例 |
| --- | --- |
| 你刚发送了消息 | 正在指导大肥鱼 |
| agent 正在思考 | 大肥鱼正在思考 6/195 |
| 总输入 tokens | 大肥鱼正在记笔记 38.7M |
| LLM 已思考时长 | 大肥鱼已经思考了 30m46s |

丰富模式的状态是**智能随机**地从当前实时数据中挑选的——并不绑定某个特定时刻——并且**每个状态在 Discord 上至少展示 8 秒**。

**数据始终关联你当前正在交互的会话**：插件会跟踪你最后一条真实输入（`source.kind === 'user'`）所在的会话，思考步数、token 数、思考时长都只从那个会话采集——子代理、后台会话、其他工作区的数据不会被混入。当你切换会话继续交互时，推送的数据会自动跟着切换。该开关运行时持久化在 `discord-richpresence` 设置命名空间中，无需在 patch 里配置。

## 隐私

**插件绝不读取你的工作区内容。** 它不会查看会话标题、消息正文、文件路径、工具输入输出或任何其他内容，只响应粗粒度的生命周期信号（`agent/inbox/inserted`、`agent/status`、`agent/pre-step`、`tools/pre-execute`、`session/created`、`workflow/start`），然后推送配置好的状态字符串（或上面那些只填入标量数据的丰富模板——不含任何内容）。即使保持默认列表，Discord 上也只会出现"正在指挥大肥鱼干活"这样的模糊状态。

## 环境要求

- 本机运行着 **Discord 桌面客户端**（Rich Presence 走本地 Discord IPC 端点——Windows 上是命名管道，macOS/Linux 上是 unix socket，或回环 TCP）。
- **DeepSeek Harness 0.1.1-rc.1 及以上**（已适配当前 npm `latest` 稳定版 `0.1.5-rc.2` 以及预览版 `0.1.6-alpha.2`，同时兼容更早的 `0.1.1-rc.2`）。

### 兼容的 Harness 版本

插件在运行时探测 Harness 提供的能力，无需按版本切换：
```

</details>

**依据 2 · 源码核查**：[lib/index.js:270-324](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L270-L324)

activity 用阶段文案与 details 构造。

<details>
<summary>查看原文（55行）</summary>

```text
    if (base === currentPhase && !decay) return
    currentPhase = base
    if (decay || TRANSIENT_PHASES.has(base)) {
      transientUntil = now() + TRANSIENT_MS
    } else {
      transientUntil = 0
    }
    schedulePush()
  }

  /** Debounced push of the current status line. */
  let pushTimer
  function schedulePush() {
    if (pushTimer) return
    pushTimer = safeTimeout(() => {
      pushTimer = undefined
      pushNow()
    }, 250)
  }

  function pushLine(line) {
    const nowMs = now()
    if (line === lastPushedPhase && nowMs - lastPushedAt < minIntervalMs) return
    lastPushedPhase = line
    lastPushedAt = nowMs
    const activity = buildActivity({
      state: line,
      details,
      startTime: rpcStartedAt,
      largeImage,
    })
    rpc.setActivity(activity).then((ok) => {
      if (ok) connected = true
    }).catch(() => {
      connected = false
    })
  }

  function pushNow() {
    const phase = currentPhase
    const line = lineFor(phase)
    if (!line) return
    const nowMs = now()
    if (phase === lastPushedPhase && nowMs - lastPushedAt < minIntervalMs) return
    lastPushedPhase = phase
    lastPushedAt = nowMs
    advance(phase)
    const activity = buildActivity({
      state: line,
      details,
      startTime: rpcStartedAt,
      largeImage,
    })
    rpc.setActivity(activity).then((ok) => {
      if (ok) connected = true
```

</details>

**依据 3 · 源码核查**：[lib/index.js:477-582](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L477-L582)

监听事件、筛当前会话并提取标量。

<details>
<summary>查看原文（106行）</summary>

```text
  // A user message entered the agent's inbox -> that agent is the session the
  // user is interacting with; "commanding / feeding tokens" only for it.
  ctx.on('agent/inbox/inserted', (payload) => {
    const message = payload?.message
    const agent = payload?.agent
    // Only real user input (source.kind === 'user') selects the active
    // session — subagent relays/receipts must not steal it.
    if (message?.source?.kind === 'user' && agent) {
      activeSessionId = agent.id
      lastUserInputAt = now()
      requestPhase('userInput', { decay: true })
      ensureConnected()
    } else if (activeSessionId === undefined && agent) {
      adoptTopLevelIfNeeded(agent)
    }
  }, { global: true })

  // A top-level agent was created -> adopt it if no active session exists yet
  // (e.g. dsh restarted while a session was open). Subagents never qualify.
  ctx.on('agent/created', (payload) => {
    adoptTopLevelIfNeeded(payload?.agent)
  }, { global: true })

  // Agent toggled idle/running -> "brainstorming / explaining".
  // Only the ACTIVE session's status drives the rich-mode facts and phases.
  ctx.on('agent/status', (payload) => {
    const agent = payload?.agent
    // Before any session is active, only top-level agents may drive phases.
    if (activeSessionId === undefined) {
      if (!agent || !isTopLevelAgent(agent)) return
      activeSessionId = agent.id
    }
    if (agent?.id !== activeSessionId) return
    const status = payload?.status
    if (status === 'running') {
      if (!thinkingStartedAt) thinkingStartedAt = now()
      requestPhase('agentWorking')
      ensureConnected()
    } else if (status === 'idle') {
      if (thinkingStartedAt) {
        accumulatedThinkingMs += now() - thinkingStartedAt
        thinkingStartedAt = 0
      }
      requestPhase('idle')
    }
  }, { global: true })

  // A model step begins -> record turn/step and current token pressure.
  // Only the ACTIVE session's steps count; subagent steps are ignored.
  ctx.on('agent/pre-step', (payload, next) => {
    const agent = payload?.agent
    if (activeSessionId === undefined) {
      adoptTopLevelIfNeeded(agent)
    }
    if (activeSessionId === undefined || agent?.id !== activeSessionId) {
      return next()
    }
    if (payload) {
      latestTurn = Number.isFinite(payload.turn) ? payload.turn : latestTurn
      latestStep = Number.isFinite(payload.step) ? payload.step : latestStep
      if (agent?.session) {
        const tokenMeter = ctx.get('tokenMeter')
        if (tokenMeter !== undefined) {
          try {
            latestTokens = tokenMeter.measure(agent.session)?.totalTokens ?? latestTokens
          } catch {
            // measurement failure keeps the previous value
          }
        }
      }
    }
    return next()
  }, { global: true })

  // A model tool is about to dispatch -> "submitting change suggestions".
  // Only tools dispatched by the ACTIVE session count; subagent tools ignore.
  ctx.on('tools/pre-execute', (exec, next) => {
    const agent = exec?.agent
    if (activeSessionId !== undefined && agent?.id !== activeSessionId) {
      return next()
    }
    requestPhase('tools', { decay: true })
    ensureConnected()
    return next()
  }, { global: true })

  // A new session / fork was created -> "creating a memory slice".
  // Only top-level forks count; a new root session also becomes the active one
  // when nothing is tracked yet.
  ctx.on('session/created', (session) => {
    const header = session?.header ?? session?.meta
    const isTopLevel = header?.origin !== 'subagent'
      && (header?.delegationDepth === undefined || header.delegationDepth === 0)
    if (isTopLevel) {
      if (activeSessionId === undefined && session?.id !== undefined) {
        activeSessionId = session.id
      }
      requestPhase('forking', { decay: true })
      ensureConnected()
    }
  }, { global: true })

  // A workflow run started -> agent is orchestrating children.
  ctx.on('workflow/start', () => {
    requestPhase('agentWorking')
    ensureConnected()
```

</details>

**依据 4 · 源码核查**：[lib/discord-rpc.js:365-381](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/discord-rpc.js#L365-L381)

Rich Presence payload 字段。

<details>
<summary>查看原文（17行）</summary>

```text
 * @param {string} options.state - short status line shown on Discord.
 * @param {string} [options.details] - optional second line.
 * @param {number} [options.startTime] - epoch ms; presence shows elapsed time.
 * @param {string} [options.largeImage] - asset key configured in the Discord app.
 */
export function buildActivity({ state, details, startTime, largeImage }) {
  const activity = {
    state,
    type: 0, // Playing
  }
  if (details) activity.details = details
  if (startTime) activity.timestamps = { start: startTime }
  if (largeImage) {
    activity.assets = { large_image: largeImage }
  }
  return activity
}
```

</details>

#### 缺口

- 未接真实 Discord 桌面客户端观察状态。
  **影响：**无法确认客户端展示、可见范围和所有 DSH 版本事件形状。
  **进一步探讨：**隔离 Discord 账号验证资料展示、断连恢复和无正文/标题泄露。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 默认公开与丰富模式的同意边界是什么？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

richMode 默认关闭，且在 DSH 设置命名空间持久化；但整个插件启动时立即 ensureConnected，连接成功后推送默认模糊状态，即安装启用即公开“正在使用 DSH”及时间戳。这与“默认只推送模糊状态”一致，不能理解为默认完全静默。丰富模式用最后一条真实 user 输入定位活跃会话，过滤子代理；但 tools/pre-execute 在 activeSessionId 尚未设定时可触发阶段，workflow/start 全局触发工作阶段，故早期/全局阶段文案并非严格只属于当前用户会话。丰富标量与状态文案的语义需要独立宿主验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:162-208](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L162-L208)

丰富模式默认与配置参数。

<details>
<summary>查看原文（47行）</summary>

```text
 * - `richMode: false` (default): vague, user-configured status lines only.
 * - `richMode: true`: smarter, data-driven status lines (thinking turn/step,
 *   total input tokens, LLM elapsed time) picked intelligently and randomly,
 *   each staying on screen for at least 8 seconds.
 *
 * The mode is exposed as the `discordRichPresence` settings namespace, so the
 * web General-settings page can toggle it at runtime.
 *
 * The plugin only emits status strings from the configured lists/templates.
 * It never reads message text, session titles, file paths, or tool output, so
 * nothing about the user's workspace content can leak to Discord.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {object} config
 * @param {string} [config.clientId] - Discord Application ID (pre-configured in the bundle patch).
 * @param {string} [config.details] - optional second line, e.g. 'DeepSeek Harness'.
 * @param {string} [config.largeImage] - optional Discord asset key for the large image.
 * @param {Record<string, string[]>} [config.statuses] - per-phase status lists.
 * @param {boolean} [config.randomize] - pick statuses at random instead of rotating.
 * @param {number} [config.minIntervalMs] - minimum delay between pushes.
 * @param {number} [config.reconnectMs] - IPC reconnect polling interval.
 * @returns {() => void} disposer that closes the RPC transport and clears timers.
 */
export function apply(ctx, config = {}) {
  const clientId = config.clientId
  if (!clientId) {
    // Defensive fallback only; the shipped bundle patch always provides one.
    console.warn(`[${name}] no clientId configured — Discord Rich Presence disabled`)
    return
  }

  const statuses = {
    userInput: config.statuses?.userInput ?? DEFAULT_STATUSES.userInput,
    agentWorking: config.statuses?.agentWorking ?? DEFAULT_STATUSES.agentWorking,
    tools: config.statuses?.tools ?? DEFAULT_STATUSES.tools,
    forking: config.statuses?.forking ?? DEFAULT_STATUSES.forking,
    idle: config.statuses?.idle ?? DEFAULT_STATUSES.idle,
  }

  const details = config.details ?? 'DeepSeek Harness'
  const largeImage = config.largeImage
  const minIntervalMs = config.minIntervalMs ?? 5000
  const reconnectMs = config.reconnectMs ?? 15000
  const randomize = config.randomize ?? false
  // Rich loop bounds: 8s floor by design; tests may shrink them.
  const richMinIntervalMs = config.richMinIntervalMs ?? RICH_MIN_INTERVAL_MS
  const richJitterMs = config.richJitterMs ?? RICH_JITTER_MS
```

</details>

**依据 2 · 源码核查**：[lib/index.js:360-408](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L360-L408)

运行时 richMode 开关。

<details>
<summary>查看原文（49行）</summary>

```text
  // --- Settings: richMode toggle (web General settings -> discordRichPresence) ---

  /** Current resolved value of the settings namespace. */
  let richMode = false
  /** Latest live facts gathered from activity events. */
  let latestTurn = 0
  let latestStep = 0
  let latestTokens = undefined
  let thinkingStartedAt = 0
  let accumulatedThinkingMs = 0
  let lastUserInputAt = 0
  /**
   * The session the user is currently interacting with. Rich-mode facts
   * (turn/step/tokens/thinking time) are only collected from THIS agent —
   * never from subagents or unrelated sessions, so the Discord status always
   * reflects the conversation the user is actually working on.
   */
  let activeSessionId = undefined
  /** Rich-mode smart random loop timer (undefined while rich mode is off). */
  let richLoopTimer = undefined

  /** Read the current settings value (kept current by setSource). */
  let richModeSource = () => ({ richMode: false })
  /** Sync our mode from the settings namespace and react to transitions. */
  function syncRichMode() {
    const next = Boolean(richModeSource().richMode)
    if (next === richMode) return
    richMode = next
    if (richMode) {
      if (!richLoopTimer) scheduleRichNext()
      pushRichNow()
    } else if (richLoopTimer) {
      clearTimeout(richLoopTimer)
      richLoopTimer = undefined
    }
  }

  /** Register the settings namespace; the client settings row writes it. */
  installRichModeSection(ctx, z.object({
    richMode: z.boolean().default(false),
  }), { richMode: false }, {
    setSource: (get) => {
      richModeSource = get
      syncRichMode()
    },
    onChange: () => {
      syncRichMode()
    },
  })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:552-593](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L552-L593)

工具/工作流事件和启动连接。

<details>
<summary>查看原文（42行）</summary>

```text
  // Only tools dispatched by the ACTIVE session count; subagent tools ignore.
  ctx.on('tools/pre-execute', (exec, next) => {
    const agent = exec?.agent
    if (activeSessionId !== undefined && agent?.id !== activeSessionId) {
      return next()
    }
    requestPhase('tools', { decay: true })
    ensureConnected()
    return next()
  }, { global: true })

  // A new session / fork was created -> "creating a memory slice".
  // Only top-level forks count; a new root session also becomes the active one
  // when nothing is tracked yet.
  ctx.on('session/created', (session) => {
    const header = session?.header ?? session?.meta
    const isTopLevel = header?.origin !== 'subagent'
      && (header?.delegationDepth === undefined || header.delegationDepth === 0)
    if (isTopLevel) {
      if (activeSessionId === undefined && session?.id !== undefined) {
        activeSessionId = session.id
      }
      requestPhase('forking', { decay: true })
      ensureConnected()
    }
  }, { global: true })

  // A workflow run started -> agent is orchestrating children.
  ctx.on('workflow/start', () => {
    requestPhase('agentWorking')
    ensureConnected()
  }, { global: true })

  // Transient-phase decay loop: userInput/forking fall back to agentWorking.
  safeInterval(() => {
    if (TRANSIENT_PHASES.has(currentPhase) && now() >= transientUntil) {
      requestPhase('agentWorking')
    }
  }, 5000)

  // Initial connection attempt.
  ensureConnected()
```

</details>

**依据 4 · 作者声明**：[README.md:25-48](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/README.md#L25-L48)

作者称丰富模式可选、默认模糊状态。

<details>
<summary>查看原文（24行）</summary>

```text
默认情况下，插件只推送上面的模糊状态。在**设置 → 通用设置 → Rich Presence 丰富状态**里可以打开**丰富模式**。开启后，插件改为推送更智能、带实时数据的状态行：

| 实时数据 | 状态示例 |
| --- | --- |
| 你刚发送了消息 | 正在指导大肥鱼 |
| agent 正在思考 | 大肥鱼正在思考 6/195 |
| 总输入 tokens | 大肥鱼正在记笔记 38.7M |
| LLM 已思考时长 | 大肥鱼已经思考了 30m46s |

丰富模式的状态是**智能随机**地从当前实时数据中挑选的——并不绑定某个特定时刻——并且**每个状态在 Discord 上至少展示 8 秒**。

**数据始终关联你当前正在交互的会话**：插件会跟踪你最后一条真实输入（`source.kind === 'user'`）所在的会话，思考步数、token 数、思考时长都只从那个会话采集——子代理、后台会话、其他工作区的数据不会被混入。当你切换会话继续交互时，推送的数据会自动跟着切换。该开关运行时持久化在 `discord-richpresence` 设置命名空间中，无需在 patch 里配置。

## 隐私

**插件绝不读取你的工作区内容。** 它不会查看会话标题、消息正文、文件路径、工具输入输出或任何其他内容，只响应粗粒度的生命周期信号（`agent/inbox/inserted`、`agent/status`、`agent/pre-step`、`tools/pre-execute`、`session/created`、`workflow/start`），然后推送配置好的状态字符串（或上面那些只填入标量数据的丰富模板——不含任何内容）。即使保持默认列表，Discord 上也只会出现"正在指挥大肥鱼干活"这样的模糊状态。

## 环境要求

- 本机运行着 **Discord 桌面客户端**（Rich Presence 走本地 Discord IPC 端点——Windows 上是命名管道，macOS/Linux 上是 unix socket，或回环 TCP）。
- **DeepSeek Harness 0.1.1-rc.1 及以上**（已适配当前 npm `latest` 稳定版 `0.1.5-rc.2` 以及预览版 `0.1.6-alpha.2`，同时兼容更早的 `0.1.1-rc.2`）。

### 兼容的 Harness 版本

```

</details>

#### 缺口

- 未复现实机早期/全局事件顺序。
  **影响：**文案是否错误反映当前会话的实际概率未知。
  **进一步探讨：**冷启动和多会话/子代理事件矩阵检查阶段及丰富标量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地 IPC 和卸载如何影响采用？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

RPC 在本机 Discord IPC 端点握手，用 SET_ACTIVITY 更新；端点断开后轮询重连，纤维卸载会清定时器并关闭 socket。需要 Discord 桌面客户端在线，状态可见性与 Discord 设置有关。README 指出卸载后 settings.yaml 中 richMode 设置仍留存、link 安装可能剩空 junction，故需要清理残留才算完全恢复。适合愿意公开模糊工作状态者先核可见范围；建议增加独立的“启用 Presence”默认关闭开关，把基本公开与 richMode 分开，并让早期全局事件避免误报。

#### 证据与依据

**依据 1 · 源码核查**：[lib/discord-rpc.js:114-175](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/discord-rpc.js#L114-L175)

本地 IPC 连接和握手。

<details>
<summary>查看原文（62行）</summary>

```text
   * Try each endpoint until one connects and completes the handshake.
   */
  connect() {
    if (this.closed) throw new Error('DiscordRpc is closed')
    const endpoints = candidateEndpoints()
    return this.#tryEndpoints(endpoints, 0)
  }

  async #tryEndpoints(endpoints, index) {
    if (index >= endpoints.length) {
      throw new Error('no Discord IPC endpoint available (is Discord running?)')
    }
    const endpoint = endpoints[index]
    try {
      await this.#connectOne(endpoint)
      return
    } catch (error) {
      // A reachable-but-wrong endpoint (e.g. stale pipe) is worth one retry;
      // otherwise move on to the next candidate.
      if (this.closed) throw error
      return this.#tryEndpoints(endpoints, index + 1)
    }
  }

  /** Connect to one endpoint and perform the handshake. */
  #connectOne(endpoint) {
    return new Promise((resolve, reject) => {
      const socket = endpoint.startsWith('tcp://')
        ? connect({ host: '127.0.0.1', port: Number(endpoint.slice('tcp://'.length).split(':')[1]) })
        : connect(endpoint)
      this.socket = socket

      let settled = false
      const fail = (error) => {
        if (settled) return
        settled = true
        socket.destroy()
        this.socket = undefined
        reject(error)
      }
      const succeed = () => {
        if (settled) return
        settled = true
        this.connected = true
        resolve()
      }

      socket.setTimeout(this.connectTimeoutMs)
      socket.once('timeout', () => fail(new Error(`connect timeout: ${endpoint}`)))
      socket.once('error', (error) => fail(error))
      socket.once('close', () => {
        if (!settled) fail(new Error(`closed before handshake: ${endpoint}`))
        else this.#handleClose()
      })

      socket.on('data', (chunk) => this.#onData(chunk))

      // Handshake: opcode 0, { v, client_id }.
      this.#write(OP_HANDSHAKE, {
        v: 1,
        client_id: this.clientId,
      })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:324-357](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L324-L357)

连接/重连与关闭路径。

<details>
<summary>查看原文（34行）</summary>

```text
      if (ok) connected = true
    }).catch(() => {
      connected = false
    })
  }

  /** Ensure a connected transport, retrying on a timer when Discord is absent. */
  let connectTimer
  function ensureConnected() {
    if (rpc.isConnected() || connectTimer) return
    rpc.connect().then(() => {
      connected = true
      connectTimer = undefined
      if (richMode) pushRichNow()
      else pushNow()
    }).catch(() => {
      connected = false
      connectTimer = undefined
      scheduleReconnect()
    })
  }

  function scheduleReconnect() {
    if (connectTimer) return
    connectTimer = safeTimeout(() => {
      connectTimer = undefined
      ensureConnected()
    }, reconnectMs)
  }

  // Reconnect when Discord disappears.
  rpc.onDisconnect(() => {
    connected = false
    scheduleReconnect()
```

</details>

**依据 3 · 源码核查**：[lib/index.js:586-604](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L586-L604)

启动连接与卸载清理。

<details>
<summary>查看原文（19行）</summary>

```text
  safeInterval(() => {
    if (TRANSIENT_PHASES.has(currentPhase) && now() >= transientUntil) {
      requestPhase('agentWorking')
    }
  }, 5000)

  // Initial connection attempt.
  ensureConnected()

  // Disposer: closes the transport and clears every timer on fiber unload.
  return () => {
    clearAllTimers()
    try {
      rpc.close()
    } catch {
      // ignore
    }
  }
}
```

</details>

**依据 4 · 作者声明**：[README.md:104-139](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/README.md#L104-L139)

作者列卸载残留和安装依赖。

<details>
<summary>查看原文（36行）</summary>

````text

- `statuses` — 每个阶段都是一个列表；插件按顺序轮流选取（`randomize: true` 时随机）。可以自由增删、改写。
- Discord 反映状态变化可能有几秒延迟；`minIntervalMs` 用于限制推送频率。
- 丰富模式开关**不属于 patch**——它在设置 → 通用设置中，运行时持久化。

## 卸载

```sh
dsh plugin --profile web remove dsh-discord-richpresence
```

### 卸载能恢复到安装前的状态吗？

**基本可以，但有一处已知残留**：

| 项目 | 卸载后的状态 |
| --- | --- |
| `dsh.profile.bundles` 条目 | ✅ 自动移除 |
| `dependencies`（package.json） | ✅ 自动移除 |
| 宿主插件（事件监听、Discord RPC） | ✅ 停止（重启 dsh 后完全退出） |
| 浏览器设置开关（client bundle） | ✅ 移除（刷新页面后消失） |
| `node_modules` 中的链接 | ⚠️ 可能残留一个空 junction（pnpm link 安装时的物理文件，不影响运行，可手动删除） |
| `settings.yaml` 中的 `discord-richpresence:` 段 | ⚠️ **残留**（settings 服务只注销命名空间注册，不删除用户设置文档） |

**唯一需要手动处理的是 `settings.yaml`**。如果希望彻底恢复安装前的状态，编辑 `$DSH_HOME/settings.yaml`，删除这段：

```yaml
discord-richpresence:
  richMode: true
```

删除后该设置不会再影响任何东西（插件已卸载，没有消费者读取它）；留着也无害——重装插件时会重新读取。

## 升级（老版本 → 新版本）

插件同包名覆盖安装即可升级，**不需要先卸载**：
````

</details>

#### 缺口

- 未验证 Discord 多账号/隐私设置及卸载实际残留。
  **影响：**社交可见性和维护负担未量化。
  **进一步探讨：**用隔离账号检查状态可见对象、断网重连、卸载后 profile 与设置残留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
