# dsh-ntr

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cb622ae](https://github.com/GDWhisper/dsh-ntr/tree/cb622aebdb5323923f46905a54e1703acc99e147)

<!-- BEGIN META -->
[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GDWhisper/dsh-ntr) [![npm 30d 5,424](https://img.shields.io/static/v1?label=npm+30d&message=5%2C424&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ntr) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ntr)
<!-- END META -->

> **功能**：把独立 ACP Agent 的会话、工具活动和权限交互接入 DSH 界面。

> **亮点**：[Q01](#research-q01) 统一操作界面并保留 Agent 的执行选择。

> **主要限制**：[Q02](#research-q02) auto 优先长期放行，取消本地收尾不证明外部停止。

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
  - [Q01 · DSH 如何使用外部 ACP Agent？](#detail-section-11)
  - [Q02 · 权限超时与取消是否保证外部操作停止？](#detail-section-12)
  - [Q03 · 怎么判断统一界面是否有收益？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望沿用 DSH 会话界面操作其他 Agent。

直接使用目标 Agent CLI 或自身界面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| ACP 桥 | 运行外部 Agent | 权限由目标实现 |
| 审批 | 选择 Agent 声明选项 | auto 可扩大授权 |
| 取消 | 发送通知并本地收尾 | 远端停止另验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 ACP Agent | 必需 | 协商并运行任务 | 各 Agent 行为不同 |
| 目标 Agent 凭据和权限 | 按目标需要 | 模型和工具执行 | DSH UI 不提供系统隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离工作区及单 Agent | 保留 wait |
| 交互 | 文本与工具请求对照 | 验证拒绝及文件 |
| 取消 | 观察进程和结果 | 未知先回原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置 Agent 和兼容 | 逐实现验收 |
| 持续 | 费用未知 | Agent 与 Host 双版本维护 | 记录事件差异 |
| 失败 | 恢复工时未知 | 检查进程、文件和迟到回包 | 不盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一界面 | 接入 ACP 会话和权限 | 事件完整度和实际节时 |

> **思考**：[Q02](#research-q02) auto 优先长期放行，取消本地收尾不证明外部停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一操作界面并保留 Agent 的执行选择。

[Q02](#research-q02) 取消兜底仅收尾本地 turn，外部效果需验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) auto 优先长期放行，取消本地收尾不证明外部停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 保持 wait，逐 Agent 单独对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持协商与权限路径，未执行 Agent。

- 已检查：作者 README、包清单、源码路径 README.md、src/bridge.ts、src/index.ts、src/impl.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 注册、ACP 进程和权限取消源码；未执行目标。
- 下一步：单 Agent 文本、拒绝、迟到、重连和停止。

**分析版本**

- **仓库**：[GDWhisper/dsh-ntr](https://github.com/GDWhisper/dsh-ntr)
- **版本号**：0.3.7（[固定提交 cb622ae](https://github.com/GDWhisper/dsh-ntr/tree/cb622aebdb5323923f46905a54e1703acc99e147)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照目标 CLI 的事件完整度和恢复。

单 Agent 文本、拒绝、迟到、重连和停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 28 | 5164 | — | — | 131689 |
| .mjs | source | 2 | 354 | 169 | 168 | — |
| .ts | source | 13 | 22351 | 13189 | 8172 | — |
| .tsx | source | 15 | 9125 | 5992 | 2776 | — |
| .ts | test | 17 | 24770 | 19158 | 3829 | — |
| .tsx | test | 3 | 765 | 629 | 46 | — |
| .mjs | test | 1 | 1348 | 873 | 433 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/GDWhisper/dsh-ntr/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否在 DSH 界面操作外部 ACP Agent 并理解权限和停止边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 如何使用外部 ACP Agent？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件启动独立进程并协商 ACP，挂会话事件、权限请求和文件读写，向 DSH 注册 acp 模型适配和 RPC。用户沿 DSH 界面选择目标 Agent，它自己的模型与工具策略参与执行。相对切换到另一个 CLI，保留会话和界面操作，但不能把 DSH 的策略理解为外部进程的系统隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/README.md#L5-L19)

作者对界面和执行权的边界。

<details>
<summary>查看原文（15行）</summary>

```text
在 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness) 的网页/桌面端里，用你习惯的界面，直接和任意一个 **ACP agent**（CodeBuddy、Pi、Oh My Pi、Claude Code、OpenCode、Qoder 等）对话。

**DSH 提供界面，agent 提供能力。** 会话列表、输入框、侧栏、消息展示全部来自 DSH；推理、工具执行、文件读写、权限判断全部由你自己配置的那个 agent 完成，它跑在独立进程里，完全自治。这个插件只做一件事：把两边接通，并把 agent 的输出原样画到 DSH 的界面上。

> 模型选择、思考等级、工作模式都是 **agent 自己的概念**，不是 DSH 的模型目录。插件不替你换模型，也不会把 agent 的选择写进 DSH 的全局设置。

![dsh-ntr：在 DSH 里用 NTR 模式与 ACP agent 对话，模型、思考等级与工具活动都留在原生界面里](./docs/images/ntr-session.png)

---

## NTR 是什么

**NTR = Negotiated Target Routing（协商式目标路由）**。

一句话：你的宿主 Agent 作为 ACP 客户端，和目标 Agent 协商能力与权限，把这一轮任务交给它执行。
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:1346-1363](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L1346-L1363)

独立进程和环境。

<details>
<summary>查看原文（18行）</summary>

```text
    // there is nothing to reap; just refuse to create the process.
    if (this.teardownEpoch !== epoch) return
    const cwd = safeSpawnCwd(this.def, this.wantedSpawnCwd)
    this.spawnCwd = cwd
    const launch = windowsShimLaunch(command, perSessionLaunchArgs(this.def.args ?? [], this.def.id))
    const child = spawn(launch.command, launch.args, {
      cwd,
      env: perSessionLaunchEnv(childEnv(process.env, this.def.env ?? {}), this.def.id),
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
      shell: false,
      // A console child of a GUI host (the desktop app) would otherwise pop a
      // console window on every spawn.
      windowsHide: true,
      ...(launch.verbatim ? { windowsVerbatimArguments: true } : {}),
    })
    this.child = child
    trackAgentChild(child)
```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:1390-1420](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L1390-L1420)

权限和文件协商。

<details>
<summary>查看原文（31行）</summary>

```text
    const app = client({ name: 'dsh-ntr' })
      .onNotification(methods.client.session.update, ctx => {
        this.handleSessionUpdate(ctx.params)
      })
      .onRequest(methods.client.session.requestPermission, async ctx => {
        return this.handlePermissionRequest(ctx.params.sessionId, ctx.params.toolCall, ctx.params.options, ctx.signal)
      })
      .onRequest(methods.client.fs.readTextFile, async ctx => this.handleFsRead(ctx.params))
      .onRequest(methods.client.fs.writeTextFile, async ctx => this.handleFsWrite(ctx.params))
    const conn = app.connect(stream)
    this.conn = conn
    void conn.closed.then(() => {
      if (this.conn === conn && (this.state === 'ready')) {
        this.onConnectionLost(this, 'ACP connection closed')
      }
    })
    const init = await this.withStartupTimeout(
      conn.agent.request(methods.agent.initialize, {
        protocolVersion: PROTOCOL_VERSION,
        // The fs handlers are implemented below behind the same workspace
        // sandbox that gates session cwds; terminal is not implemented.
        // `session.configOptions.boolean` advertises the toggle form of
        // `configOptions`; agents that gate `type: "boolean"` entries on it
        // would otherwise never publish them.
        clientCapabilities: {
          fs: { readTextFile: true, writeTextFile: true },
          terminal: false,
          session: { configOptions: { boolean: {} } },
        },
        clientInfo: { name: 'dsh-ntr', title: 'DSH NTR', version: PLUGIN_VERSION },
      }),
```

</details>

**依据 4 · 源码核查**：[src/index.ts:406-431](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/index.ts#L406-L431)

adapter 注册。

<details>
<summary>查看原文（26行）</summary>

```text
    registerAdapter(providers: string[], adapter: unknown): LlmAdapterHandle
  }

  const registerLlm = (llmHandle: LlmService): void => {
    ctx.effect(
      () => {
        // The route exists so the host's driver can reach this adapter at all:
        // `adapter.stream()` is the ONLY path by which anything lands in DSH's
        // session log, and the log is what the native chat plane renders from
        // (see docs/acp-convergence.md §1.2-1.3). It deliberately advertises no
        // models — nothing here is selectable in DSH's model catalog, and no
        // surface in this bundle writes a `model/selection` for it.
        const handle = llmHandle.registerAdapter(['acp'], adapter)
        return () => { handle() }
      },
      'dsh-ntr: acp llm adapter',
    )
  }

  const llmService = (typeof ctx.get === 'function' ? ctx.get('llm') : (ctx as unknown as { llm?: LlmService }).llm) as LlmService | undefined
  if (llmService && typeof llmService.registerAdapter === 'function') {
    registerLlm(llmService)
  } else if (typeof ctx.inject === 'function') {
    ctx.inject(['llm'], (innerCtx: Context) => {
      const innerLlm = (typeof innerCtx.get === 'function' ? innerCtx.get('llm') : (innerCtx as unknown as { llm?: LlmService }).llm) as LlmService | undefined
      if (innerLlm && typeof innerLlm.registerAdapter === 'function') {
```

</details>

#### 缺口

- 未运行任何 ACP 实现
  **影响**：不同 Agent 能力差异未知
  **进一步探讨**：选单 Agent 隔离验收文本、工具和文件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 权限超时与取消是否保证外部操作停止？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认等待模式保留人工选择，auto 可在期限后挑选 Agent 提供的选项。pickAutoOption 优先 allow_always 再 allow_once，开启自动推进会扩大确认授权。cancel 发送通知并清待审批，随后强制结束本地 turn 的兜底定时器按 generation 防误伤，但原 session/prompt 仍可能迟到；不能据 UI idle 判定进程副作用停了。

#### 证据与依据

**依据 1 · 源码核查**：[src/impl.ts:207-229](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/impl.ts#L207-L229)

auto 选项优先级。

<details>
<summary>查看原文（23行）</summary>

```text
 * The option an expired deadline answers with in `auto` mode.
 *
 * The pick is by the option's KIND, because that is what the agent declared
 * about the choice it is offering: `allow_always` first (one grant covers the
 * rest of the run), then `allow_once` (the smaller grant), then the reject
 * kinds (refuse but let the agent continue), and finally the first option
 * whatever it is — an agent may offer only a custom kind, and refusing to
 * answer at all would hang the turn.
 *
 * `undefined` means NO option could be read (no options, or none with a usable
 * id). The caller then degrades to `abort`: guessing an option is worse than
 * refusing, and hanging is worse than either. OmniTerm dev picks the same way
 * (`pick_auto_option`, `src/acp/permission.rs`).
 */
export function pickAutoOption(options: readonly PermissionOptionView[]): PermissionOptionView | undefined {
  const usable = (option: PermissionOptionView): PermissionOptionView | undefined =>
    option.optionId === '' ? undefined : option
  for (const kind of AUTO_OPTION_KIND_PRIORITY) {
    const hit = options.find(option => option.kind === kind)
    const picked = hit === undefined ? undefined : usable(hit)
    if (picked !== undefined) return picked
  }
  return options.length === 0 ? undefined : usable(options[0] as PermissionOptionView)
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:710-712](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L710-L712)

默认超时模式。

```text
  permissionTimeoutMs: 300_000,
  permissionTimeoutMode: 'wait',
  cancelFallbackMs: 15_000,
```

**依据 3 · 源码核查**：[src/bridge.ts:1792-1833](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L1792-L1833)

取消与本地收尾。

<details>
<summary>查看原文（42行）</summary>

```text
  async cancel(session: LiveSession): Promise<void> {
    if (this.conn === undefined) return
    this.touch()
    // Name the generation this cancel belongs to, so `runPrompt` can tell a
    // real cancel apart from a stale one and the fallback timer can tell its
    // own turn apart from a later one.
    session.cancelRequestedAtTurn = session.turnSeq
    await this.conn.agent.notify(methods.agent.session.cancel, { sessionId: session.acpSessionId }).catch(() => { /* best effort */ })
    // The ACP spec's counterpart to the notification we just sent: a client that
    // cancels MUST answer every pending `session/request_permission` with
    // `cancelled`. Leaving them open would hold the agent's tool call blocked on
    // an answer that can no longer arrive — the turn is over, the human's
    // decision is "stop". OmniTerm does the same from `AcpClient::cancel`
    // (`PermissionManager::cancel_all`).
    this.settlePermissions(session)
    this.armCancelFallback(session)
  }

  /**
   * An agent that ignores the `session/cancel` notification must not wedge the
   * session in `running` forever (every later prompt would fail with
   * `turn_in_flight`), nor leave the adapter turn's settle gate hanging (every
   * later prompt would fail with `unsettled`). Force-finalize the turn after
   * the grace period; the real `session/prompt` response may still arrive
   * later and is folded in by the manager as usual.
   *
   * The timer is generation-guarded: it belongs to the turn `cancel` was
   * called for. If that turn already ended and a LATER turn is on air (the
   * agent settled late, the user moved on), firing would murder the innocent
   * successor — so a moved-on {@link LiveSession.turnSeq} disarms it.
   */
  private armCancelFallback(session: LiveSession): void {
    if (this.cancelFallbackMs <= 0) return
    const turnGen = session.turnSeq
    const timer = setTimeout(() => {
      this.finalizeTurn(
        session,
        turnGen,
        `agent "${this.def.id}" did not respond to the cancel request within ${String(Math.round(this.cancelFallbackMs / 1000))}s; the turn was force-finalized`,
      )
    }, this.cancelFallbackMs)
    timer.unref?.()
```

</details>

**依据 4 · 源码核查**：[src/bridge.ts:2338-2358](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L2338-L2358)

按请求冻结模式和 deadline。

<details>
<summary>查看原文（21行）</summary>

```text
  private async handlePermissionRequest(acpSessionId: string, toolCall: unknown, options: PermissionOption[], signal?: AbortSignal): Promise<RequestPermissionResponse> {
    const session = this.acpIndex.get(acpSessionId)
    if (session === undefined || session.closed) return { outcome: { outcome: 'cancelled' } }
    // An ask is the agent speaking, not silence: the stall watchdog measures
    // from here, and the pending ask exempts the session anyway.
    session.lastAgentActivityAt = Date.now()
    // The deadline and the mode are read ONCE, here: an ask that started under
    // one pair keeps it, even if the settings page rewrites them mid-flight.
    const mode = this.permissionTimeoutMode
    const timeoutMs = this.permissionTimeoutMs
    // 不等待（0）只属自动推进：请求到达即按那一档收场，不建 ledger 条目、不发卡
    // ——问都来不及问。超时中止没有这一档（它会立刻拒绝每一问，agent 在每个门口
    // 都停住），它的窗口最短是真实等待。
    if (mode === 'auto' && timeoutMs === 0) {
      return this.settleExpiredAsk(session, mode, toolCall, options, 0)
    }
    const optionViews = options.map((o): PermissionOptionView => ({ optionId: o.optionId, name: o.name, kind: o.kind }))
    const reason = permissionAskReason(toolCall)
    // Computed once, at ask creation: the frame, the chat line and the timer
    // all describe the same instant, and a slow reader cannot stretch it.
    const deadlineAt = timeoutMs > 0 && mode !== 'wait' ? Date.now() + timeoutMs : undefined
```

</details>

#### 缺口

- 没有 Agent 忽略取消与迟到结果实测
  **影响**：停止后状态和重复任务可能有歧义
  **进一步探讨**：模拟迟到回复与无响应 Agent，检查子进程和文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎么判断统一界面是否有收益？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

用测试工作区和单 Agent，保持 wait 权限模式，比对原 CLI 与 DSH 的同一短任务，包括工具请求、拒绝、重连和取消。记录任务完成率、交互时间和遗漏事件。若外部 Agent 行为无法解释或取消不确定，就回目标 Agent 自身界面核查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/README.md#L5-L9)

产品使用边界。

```text
在 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness) 的网页/桌面端里，用你习惯的界面，直接和任意一个 **ACP agent**（CodeBuddy、Pi、Oh My Pi、Claude Code、OpenCode、Qoder 等）对话。

**DSH 提供界面，agent 提供能力。** 会话列表、输入框、侧栏、消息展示全部来自 DSH；推理、工具执行、文件读写、权限判断全部由你自己配置的那个 agent 完成，它跑在独立进程里，完全自治。这个插件只做一件事：把两边接通，并把 agent 的输出原样画到 DSH 的界面上。

> 模型选择、思考等级、工作模式都是 **agent 自己的概念**，不是 DSH 的模型目录。插件不替你换模型，也不会把 agent 的选择写进 DSH 的全局设置。
```

**依据 2 · 源码核查**：[src/bridge.ts:1390-1420](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L1390-L1420)

协商和回调验收点。

<details>
<summary>查看原文（31行）</summary>

```text
    const app = client({ name: 'dsh-ntr' })
      .onNotification(methods.client.session.update, ctx => {
        this.handleSessionUpdate(ctx.params)
      })
      .onRequest(methods.client.session.requestPermission, async ctx => {
        return this.handlePermissionRequest(ctx.params.sessionId, ctx.params.toolCall, ctx.params.options, ctx.signal)
      })
      .onRequest(methods.client.fs.readTextFile, async ctx => this.handleFsRead(ctx.params))
      .onRequest(methods.client.fs.writeTextFile, async ctx => this.handleFsWrite(ctx.params))
    const conn = app.connect(stream)
    this.conn = conn
    void conn.closed.then(() => {
      if (this.conn === conn && (this.state === 'ready')) {
        this.onConnectionLost(this, 'ACP connection closed')
      }
    })
    const init = await this.withStartupTimeout(
      conn.agent.request(methods.agent.initialize, {
        protocolVersion: PROTOCOL_VERSION,
        // The fs handlers are implemented below behind the same workspace
        // sandbox that gates session cwds; terminal is not implemented.
        // `session.configOptions.boolean` advertises the toggle form of
        // `configOptions`; agents that gate `type: "boolean"` entries on it
        // would otherwise never publish them.
        clientCapabilities: {
          fs: { readTextFile: true, writeTextFile: true },
          terminal: false,
          session: { configOptions: { boolean: {} } },
        },
        clientInfo: { name: 'dsh-ntr', title: 'DSH NTR', version: PLUGIN_VERSION },
      }),
```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:1792-1833](https://github.com/GDWhisper/dsh-ntr/blob/cb622aebdb5323923f46905a54e1703acc99e147/src/bridge.ts#L1792-L1833)

取消需独立核对。

<details>
<summary>查看原文（42行）</summary>

```text
  async cancel(session: LiveSession): Promise<void> {
    if (this.conn === undefined) return
    this.touch()
    // Name the generation this cancel belongs to, so `runPrompt` can tell a
    // real cancel apart from a stale one and the fallback timer can tell its
    // own turn apart from a later one.
    session.cancelRequestedAtTurn = session.turnSeq
    await this.conn.agent.notify(methods.agent.session.cancel, { sessionId: session.acpSessionId }).catch(() => { /* best effort */ })
    // The ACP spec's counterpart to the notification we just sent: a client that
    // cancels MUST answer every pending `session/request_permission` with
    // `cancelled`. Leaving them open would hold the agent's tool call blocked on
    // an answer that can no longer arrive — the turn is over, the human's
    // decision is "stop". OmniTerm does the same from `AcpClient::cancel`
    // (`PermissionManager::cancel_all`).
    this.settlePermissions(session)
    this.armCancelFallback(session)
  }

  /**
   * An agent that ignores the `session/cancel` notification must not wedge the
   * session in `running` forever (every later prompt would fail with
   * `turn_in_flight`), nor leave the adapter turn's settle gate hanging (every
   * later prompt would fail with `unsettled`). Force-finalize the turn after
   * the grace period; the real `session/prompt` response may still arrive
   * later and is folded in by the manager as usual.
   *
   * The timer is generation-guarded: it belongs to the turn `cancel` was
   * called for. If that turn already ended and a LATER turn is on air (the
   * agent settled late, the user moved on), firing would murder the innocent
   * successor — so a moved-on {@link LiveSession.turnSeq} disarms it.
   */
  private armCancelFallback(session: LiveSession): void {
    if (this.cancelFallbackMs <= 0) return
    const turnGen = session.turnSeq
    const timer = setTimeout(() => {
      this.finalizeTurn(
        session,
        turnGen,
        `agent "${this.def.id}" did not respond to the cancel request within ${String(Math.round(this.cancelFallbackMs / 1000))}s; the turn was force-finalized`,
      )
    }, this.cancelFallbackMs)
    timer.unref?.()
```

</details>

#### 缺口

- 真实 Agent 费用和恢复体验未知
  **影响**：不能估计统一界面净收益
  **进一步探讨**：每种 Agent 独立对照，禁用自动推进测试先行

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
