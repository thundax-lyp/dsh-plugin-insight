# dsh-advisor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5901731](https://github.com/omdsh-dev/dsh-advisor/tree/59017312b6a8110ba1e2dba3c9d584cacd273f75)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-advisor) [![npm 30d 5,247](https://img.shields.io/static/v1?label=npm+30d&message=5%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-advisor) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-advisor)
<!-- END META -->

> **功能**：让独立模型评阅 DeepSeek Harness 会话，注入分级建议并为 Web 提供后续提示。

> **亮点**：[Q01](#research-q01) 将独立评阅和按严重度回送接入会话，同时保留主代理审批流程。

> **主要限制**：[Q02](#research-q02) 的变化段进入配置模型，输出短不代表费用低，失败和积压也可让一些轮次没有建议。

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
  - [Q01 · 主会话的变化如何触发独立评阅及交付？](#detail-section-11)
  - [Q02 · 独立评阅会读取什么，超时和失败时是否仍值得依赖？](#detail-section-12)
  - [Q03 · 如何做可控观察，什么方案能让建议更容易核对？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：监督多轮 DSH 工作的开发者，可以观察评阅模型对公开会话的建议。

在本地核对日志，或把经筛选的少量上下文交给另一个模型人工复核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 独立评阅 | 提供分级建议 | 会话变化会送到模型 |
| 提示与回送 | 建议回到会话或输入区 | 需要兼容宿主并独立验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 会话、Agent 与 LLM 服务 | 是 | 监听事件和提交评阅 | 手工复核 |
| 可接受正文的配置模型 | 是 | 执行评阅 | 关闭该会话 |
| 兼容 Web 客户端 | 预测提示需要 | 展示可点击提示 | 保留原输入区 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离 profile 选择模型 | 只提交公开任务 |
| 观察 | 跑多轮任务并对照建议 | 核对建议与实际证据 |
| 退出 | 关闭评阅并复查调用 | 恢复人工检查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型与宿主，费用未知 | 配置可信供应商和隔离任务 | 兼容待验 |
| 持续 | 额外请求及模型用量未知 | 核对建议和干预 | 单位合格审阅成本未知 |
| 失败恢复 | 可重试调用，费用未知 | 从原日志补复核 | 队列丢弃及禁用影响待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 独立建议 | 源码有独立模型请求和注入路径 | 准确率与节时 |
| 严重度回送 | 按冷却注入或唤起 | 实际干预效果 |
| 提示预测 | 会话变化进入独立分支 | Web 真实可用性 |

> **思考**：[Q02](#research-q02) 的变化段进入配置模型，输出短不代表费用低，失败和积压也可让一些轮次没有建议。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将独立评阅和按严重度回送接入会话，同时保留主代理审批流程。

[Q02](#research-q02) 的期限与积压界定前台等待，外发正文与建议质量需要独立观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的变化段进入配置模型，输出短不代表费用低，失败和积压也可让一些轮次没有建议。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 隔离观察公开会话，按 [Q02](#research-q02) 确认数据和费用，无法核对时回到人工复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持评阅、路由及配置。建议准确率、适配器数据边界和真实成本待验。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/delivery.ts、src/advisor-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 src 的宿主事件、评阅、调用与交付；未构建、安装、访问模型或运行宿主。
- 下一步：以公开合成任务比较建议质量、数据边界、积压及失败时序，禁用后核对实际调用。

**分析版本**

- **仓库**：[omdsh-dev/dsh-advisor](https://github.com/omdsh-dev/dsh-advisor)
- **版本号**：0.7.1（[固定提交 5901731](https://github.com/omdsh-dev/dsh-advisor/tree/59017312b6a8110ba1e2dba3c9d584cacd273f75)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 建议尝试正文筛除和事件范围回执，比较召回、外发标记和干预频率。

以公开合成任务比较建议质量、数据边界、积压及失败时序，禁用后核对实际调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 3075 | — | — | 58438 |
| .mjs | source | 2 | 495 | 268 | 203 | — |
| .ts | source | 20 | 9022 | 4170 | 4450 | — |
| .tsx | source | 3 | 1273 | 767 | 497 | — |
| .ts | test | 29 | 15686 | 11242 | 3024 | — |
| .tsx | test | 3 | 2941 | 2205 | 525 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-advisor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-advisor/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-advisor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 让独立模型观察主会话时，什么时候能得到可用建议，怎样控制信息边界与多余干预？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主会话的变化如何触发独立评阅及交付？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常监督多轮编码工作的用户可以用单独配置的模型复核主会话的变化。插件全局订阅 session/event，将快照事件交给 transcript observer；变化段进入对应会话的 runtime，只有有效配置开启时才构造模型调用。返回可用 note 后由 delivery 路由：轻量建议或冷却中的高严重级建议注入，下一个 pre-step 可读；冷却之外的高严重级可通过 steer 唤起。预测下一提示复用同一变化输入，通过独立 suggestions 分支准备。与人工复制内容到另一模型相比，增量在宿主事件和回送策略；建议不会代替主代理或用户的审批。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-18](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/README.md#L14-L18)

作者说明独立模型和建议用途。

```text
A standalone dsh (DeepSeek Harness) plugin bundle porting the omp "advisor" subsystem: a per-session independent reviewer model that observes the primary transcript, reviews each stepped turn with an explicitly configured model (provider + model are required), and injects severity-ranked advice (nit / concern / blocker) back into the session. After each completed turn it can also predict your likely next prompt and show it as a one-click suggestion tip below the web composer (web GUI only). Neither surface pollutes or recursively reviews itself.

**Advisory only.** The advisor never approves or rejects the primary agent's actions, and never issues commands as if it were the primary agent. Every delivered message is self-described advisory content, and a misbehaving reviewer is bounded end to end (emission guard, immuneTurns cooldown, failure policy) so it can never stall or pollute the primary loop.

Works in both dsh front ends: the **web** profile (sidebar → Plugins → dsh-advisor → Advisor card) and the **dsh-tui** terminal profile (`/advisor` + `/advisor config`).
```

**依据 2 · 源码核查**：[src/index.ts:499-538](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/index.ts#L499-L538)

门槛、模型和接收 note。

<details>
<summary>查看原文（40行）</summary>

```text
    let runtime = runtimes.get(sessionId)
    if (runtime !== undefined) return runtime
    const effective = effectiveConfig(sessionId)
    // The re-resolved config guarantees provider + model when enabled — the
    // runtime is only constructed behind the gate.
    if (!effective.enabled) return undefined
    // The global runtime-construction constants — the same global resolved
    // read as systemPrompt (KD-I4/KD-I6, issue #102). Optional in the resolved
    // contract (T1 review F-2): when absent, the runtime applies its own
    // defaults (false / automatic), which runtimeSignature normalizes with to
    // stay in sync. No maxTokens is threaded anymore (2026-10-18 ruling — no
    // model-side budget). The effort is the EXCEPTION (GitHub issue #142): the
    // session pin wins, else the global value — the same source the signature
    // reads, so an effort-only pin rebuilds exactly here.
    const globalResolved = safeResolved()
    runtime = new AdvisorRuntime({
      provider: effective.provider!,
      model: effective.model!,
      // The owning conversation's id (runtime keys are plain strings; the
      // request option is the host's branded SessionId). Providers that route
      // per conversation on a header need it on every advisor call.
      sessionId: sessionId as SessionId,
      systemPrompt: globalResolved.systemPrompt || DEFAULT_ADVISOR_SYSTEM_PROMPT,
      proseFallback: globalResolved.proseFallback,
      // Plan dsh-advisor-reasoning-effort (RD-1/RD-2): absent/empty = the
      // smallest effort the resolved model declares.
      reasoningEffort: effectiveReasoningEffort(sessionId),
      llm: appRootLlm(),
      onNote: (note: AdviceNote) => {
        // Accepted notes only — the runtime's emission guard (T5) already
        // filtered suppressed ones. T6 routes the accepted note to the primary
        // agent (inject/steer); delivery throws stay contained in the runtime
        // path (T4 F1), so a failing agent can only drop its own advice.
        const channel = delivery.route(sessionId, note)
        ctx.logger('advisor').debug('advice note delivered', {
          sessionId,
          severity: note.severity,
          channel,
        })
      },
```

</details>

**依据 3 · 源码核查**：[src/index.ts:633-656](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/index.ts#L633-L656)

预测和评阅分流。

<details>
<summary>查看原文（24行）</summary>

```text
    onCompletedTurnEnd: (sessionId: string) => {
      // One completed primary turn — arm the next-prompt slot (plan
      // dsh-advisor-next-prompt-n12, T1). Gated inside the manager (resolver
      // SSOT); a closed gate arms nothing.
      suggestions.onCompletedTurnEnd(sessionId)
    },
    onUserTurnStart: (sessionId: string) => {
      // The user started typing — the fence supersedes any in-flight
      // prediction and clears the stored suggestion immediately (plan
      // dsh-advisor-next-prompt-n12, T1). The delivered-advice tip is the
      // same kind of idle notification: it belongs to the turn that just
      // ended, so a new human turn clears it too.
      suggestions.onUserTurnStart(sessionId)
      delivery.clearLastNote(sessionId)
    },
    onDelta: (sessionId: string, delta: Delta) => {
      // Lazy creation fallback covers agents that existed before this plugin
      // loaded (their `agent/created` was never observed); `agent/created`
      // below creates eagerly for the common path. The runtime gate drops the
      // delta for sessions that are disabled or S4-gate-blocked (T7).
      ensureRuntime(sessionId)?.enqueue(delta)
      // The same delta is the next-prompt prediction context (T1). Ordering
      // vs the review enqueue is free; the review enqueue stays first.
      suggestions.onDelta(sessionId, delta)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:675-683](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/index.ts#L675-L683)

宿主订阅。

```text
  // F4): a scoped fiber that observes out-of-scope sessions via the global
  // session/event listener would otherwise create per-session state —
  // renderers, runtimes, cooldowns, overrides — whose dispose events are
  // filtered out, a per-session leak for the host's lifetime. Create/dispose
  // symmetry restored; both dispose listeners are documented idempotent
  // (a runtime is disposed at most once, whichever signal lands first).
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    observer.handleEvent(session.id, session.snapshotEvents(), event)
  }, { global: true })
```

**依据 5 · 源码核查**：[src/delivery.ts:239-262](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/delivery.ts#L239-L262)

严重度路由和冷却。

<details>
<summary>查看原文（24行）</summary>

```text
  route(sessionId: string, note: AdviceNote): DeliveryChannel | undefined {
    const agent = this.agents.get(sessionId) ?? this.lookupAgent(sessionId)
    if (agent === undefined) {
      this.logger.warn('advisor: note dropped — no agent for session', {
        sessionId,
        severity: note.severity,
      })
      return undefined
    }
    const message = buildAdvisorMessage(note)
    const cooldown = this.cooldown.get(sessionId) ?? 0
    if (isInterrupting(note.severity) && cooldown <= 0) {
      // A real steer delivery arms the fence (spec §6). Armed before the call:
      // a failed steer delivery still counts as an attempted interrupt, keeping
      // a throwing agent out of the noise loop — and a downgraded or dropped
      // note never reaches this branch, so the fence never arms on one.
      if (this.immuneTurns > 0) this.cooldown.set(sessionId, this.immuneTurns)
      agent.steer(message)
      this.lastNotes.set(sessionId, { severity: note.severity, note: note.note, deliveryId: ++nextDeliveryId })
      return 'steer'
    }
    agent.inject(message)
    this.lastNotes.set(sessionId, { severity: note.severity, note: note.note, deliveryId: ++nextDeliveryId })
    return 'inject'
```

</details>

#### 缺口

- 真实宿主注入时序和建议准确率
  **影响**：决定自动送回是否有用
  **进一步探讨**：同一公开任务对照关闭与打开时的人为返工和漏报

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立评阅会读取什么，超时和失败时是否仍值得依赖？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

模型请求将 delta.markdown 直接作为 user 内容，并携带拥有会话的 ID、配置的模型和系统提示。读取的调用路径没有在这一步抹去正文中的秘密。启用前应确认该供应商允许接收此类会话数据。单次调用有期限，积压满时丢弃新项，长期出错也可清除队列，不能假定每轮都被评阅。只在提取 note 时裁长短，没有给适配器传 maxTokens，因此不能把短建议等同于低费用。对高严重度提示，冷却是在调用 steer 前设置的，若 steer 抛错仍会暂时压低后续提示的交付方式。

#### 证据与依据

**依据 1 · 源码核查**：[src/advisor-runtime.ts:931-966](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/advisor-runtime.ts#L931-L966)

会话 ID、正文原样进入请求及无 maxTokens。

<details>
<summary>查看原文（36行）</summary>

```text
  private buildOptions(delta: Delta, signal: AbortSignal, reasoningEffort: ReasoningEffortId | undefined): GenerateOptions {
    return {
      provider: this.provider,
      model: this.model,
      system: this.systemPrompt,
      // The conversation this review belongs to. Providers that route per
      // conversation on a request header — OpenCode Go's `x-opencode-session`
      // — refuse a request without it, so the advisor call carries the owning
      // session id.
      sessionId: this.sessionId,
      messages: [createUserMessage({
        content: [{ type: 'text', text: delta.markdown }],
        source: { kind: 'user' },
      })],
      // Reasoning effort (plan dsh-advisor-reasoning-effort RD-1/RD-2): the
      // advisor's job is a short structured note, so the SMALLEST thinking
      // weight the resolved model declares is the default — reasoning-heavy
      // replies starve the JSON frame (n4 root-cause: deepseek-v4-flash is a
      // reasoning model and with the default 256-token budget its reasoning
      // stream consumed everything, the text output came back EMPTY
      // (finish: max-tokens), and KD-2 dropped every reply).
      // `resolveReasoningEffort` capability-gates the value (qc2 W-1 / qc1 W-1
      // / qc3 F-3): the configured id when the model declares it, else the
      // smallest declared effort, else nothing at all — never an effort the
      // model does not declare (the dsh LlmRuntime would reject it with
      // UNSUPPORTED_REASONING_EFFORT, silently killing the advisor for
      // non-deepseek models — pre-n4 these worked because no effort was sent).
      ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
      // NO `maxTokens` (2026-10-18 user ruling, superseding the KD-I1 chain):
      // on OpenAI-compatible APIs max_tokens caps reasoning + content
      // TOGETHER, so with thinking models a budget intermittently starved
      // the final content (empty reply → EMPTY_RESPONSE → silent drops).
      // The adapter/model default applies; the only output bound is the
      // extraction-side cap ADVISOR_NOTE_MAX_CHARS, and latency stays
      // bounded by the call deadline.
      signal,
```

</details>

**依据 2 · 源码核查**：[src/advisor-runtime.ts:595-611](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/advisor-runtime.ts#L595-L611)

队列满则丢弃新项。

<details>
<summary>查看原文（17行）</summary>

```text
  enqueue(delta: Delta): void {
    if (this.disposed) {
      this.logger.debug('advisor: enqueue ignored — runtime disposed')
      return
    }
    if (this.state === 'halted') {
      this.logger.debug('advisor: enqueue ignored — advisor halted')
      return
    }
    if (this.queue.length >= this.maxQueued) {
      // simplify: FIFO queue with drop-newest when full. A full queue means the
      // advisor is far behind; the newest delta is the most redundant. A
      // coalescing batch (omp-style) would be the upgrade path.
      this.logger.debug('advisor: enqueue dropped — backlog full', { maxQueued: this.maxQueued })
      return
    }
    this.queue.push(delta)
```

</details>

**依据 3 · 源码核查**：[src/advisor-runtime.ts:771-798](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/advisor-runtime.ts#L771-L798)

期限及适配器流回读。

<details>
<summary>查看原文（28行）</summary>

```text
    // (AbortSignal honored) AND raced per chunk below, so a hung stream cannot
    // wedge the drain even when the provider ignores the signal. A timeout is
    // a transient failure — KD-5 retry(1) → drop (qc2 W-4 / qc3 W-1).
    using deadlineHandle = deadline(this.controller.signal, this.callTimeoutMs, ADVISOR_CALL_TIMEOUT)
    const deadlineSignal = deadlineHandle.signal
    try {
      // Capability-gate `reasoningEffort` (qc2 W-1 / qc1 W-1 / qc3 F-3):
      // resolve the model's declared efforts ONCE per (provider, model) and
      // send the configured id when the model declares it, else the smallest
      // declared effort; never fail the call on a resolution error (the
      // option is simply omitted). The resolution is bounded by the call
      // deadline (n4 QC N-5): the fused signal is threaded through, so a hung
      // adapter capability lookup that honors cancellation aborts with the
      // call instead of wedging the drain ahead of the deadline-guarded
      // stream loop.
      const reasoningEffort = await this.resolveReasoningEffort(deadlineSignal)
      const stream = this.llm.stream(this.buildOptions(delta, deadlineSignal, reasoningEffort))
      const iterator = stream[Symbol.asyncIterator]()
      for (;;) {
        const next = await raceIteratorNext(iterator, deadlineSignal)
        if (next === 'aborted') {
          // Best-effort teardown of a provider that may still be mid-flight;
          // never await a hung teardown (it may never settle).
          iterator.return?.().catch(() => {})
          if (timeoutOf(deadlineSignal, ADVISOR_CALL_TIMEOUT) !== undefined) {
            return {
              kind: 'failure',
              failure: { message: `advisor call timed out after ${this.callTimeoutMs}ms`, code: 'TIMEOUT' },
```

</details>

**依据 4 · 源码核查**：[src/delivery.ts:248-262](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/delivery.ts#L248-L262)

先设置冷却再调用 steer。

<details>
<summary>查看原文（15行）</summary>

```text
    const message = buildAdvisorMessage(note)
    const cooldown = this.cooldown.get(sessionId) ?? 0
    if (isInterrupting(note.severity) && cooldown <= 0) {
      // A real steer delivery arms the fence (spec §6). Armed before the call:
      // a failed steer delivery still counts as an attempted interrupt, keeping
      // a throwing agent out of the noise loop — and a downgraded or dropped
      // note never reaches this branch, so the fence never arms on one.
      if (this.immuneTurns > 0) this.cooldown.set(sessionId, this.immuneTurns)
      agent.steer(message)
      this.lastNotes.set(sessionId, { severity: note.severity, note: note.note, deliveryId: ++nextDeliveryId })
      return 'steer'
    }
    agent.inject(message)
    this.lastNotes.set(sessionId, { severity: note.severity, note: note.note, deliveryId: ++nextDeliveryId })
    return 'inject'
```

</details>

**依据 5 · 作者声明**：[README.md:127-138](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/README.md#L127-L138)

作者明示不遮蔽、积压及模型工具边界。

<details>
<summary>查看原文（12行）</summary>

```text
## Limitations & roadmap

The MVP deliberately drops full omp parity. Accepted gaps (tracked in the harness iteration roadmap):

- **Single advisor per session** — no parallel advisor roster or WATCHDOG-style file discovery (next iteration).
- **No advisor tools** — the reviewer is an independent model call only; it cannot verify claims itself (next-next iteration).
- **No in-session advisor panel** — advice surfaces only as tagged injected messages; the web Advisor card is a config surface, not a session view (next-next iteration).
- **No transcript persistence or cost stats** — no resumable advisor history or cost observability (next-next iteration).
- **No secret obfuscation of delta content** — secrets present in the transcript can reach the advisor model; mitigate by configuring a trusted reviewer model.
- **No quarantine of unsafe advisor output** — a misbehaving note can carry directive text; the JSON frame + validation + advisory-only framing are the only mitigation, and the note is delivered as-is (roadmap).
- **No `syncBacklog` catch-up wait** — a far-behind advisor does not wait for the primary loop; its backlog is bounded and dropped, so notes may arrive after the next primary turn started (roadmap: context-maintenance batch).
- **Bounded advisor context** — long-session full replays are truncated (`maxDeltaMessages`), so the advisor may lose early context after compaction (roadmap: next-next iteration).
```

</details>

#### 缺口

- 模型平台的数据留存、同任务费用及实际失败率
  **影响**：决定是否可用于常用会话
  **进一步探讨**：按目标供应商合同和实际记录核对输入，使用合成测试验证超时

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何做可控观察，什么方案能让建议更容易核对？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先选择可接受会话数据的供应商，使用隔离 profile 和公开任务开启单会话评阅。对照无 advisor 的原任务，记录提示是否指出真实问题、何时出现、是否需要额外模型和人工回读。建议仅作参考，仍使用日志和原始任务验收。若重复干预、费用或正文外传无法核对，关闭会话评阅或禁用插件。一个可检验的改进是给 delta 做策略化筛除并在回执标明对应事件范围，检查对真实问题的召回、带标记数据的外发和错误建议率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-64](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/README.md#L49-L64)

模型必填及未传 token 上限。

<details>
<summary>查看原文（16行）</summary>

````text
    provider: deepseek-official  # REQUIRED (non-empty) for the advisor to run
    model: deepseek-flash        # REQUIRED (non-empty); fallback: deepseek-v4-flash (or another V4 id) until the gateway enables the V41 route
    systemPrompt: ""             # optional; "" = built-in reviewer prompt
    immuneTurns: 3               # int ≥ 0, default 3 — cooldown after a delivered steer
    maxDeltaMessages: 60         # int ≥ 0, default 60 — delta window; 0 = unbounded
    proseFallback: false         # boolean, default false — deliver a frame-less prose reply as a nit note (opt-in)
    reasoningEffort: ""          # optional; absent/"" = automatic — the smallest thinking effort the selected model declares (values: that model's declared effort ids)
    nextPrompt: true             # boolean, default true — predict the next prompt and show it as a tip below the web composer (web GUI only)
    defaultEnabled: true         # boolean, default true — new sessions start enabled; false = opt-in per session (enable with /advisor on)
```

`provider` and `model` are **mandatory**: either missing or empty is a hard gate — the advisor never starts a model call and reports a disabled-with-reason status; unknown config keys are rejected.

There is **no model-side token budget** (2026-10-18 user ruling): on OpenAI-compatible APIs `max_tokens` caps reasoning + content together, so with thinking models the old `maxTokens` budget intermittently starved the final content (empty reply → `EMPTY_RESPONSE` → silent delta drops). The advisor call sends no `maxTokens` at all; output is bounded at extraction by `ADVISOR_NOTE_MAX_CHARS` (768 chars) and latency by the 60 s call deadline. A `maxTokens:` line still present in a stored profile is tolerated and silently dropped, like the removed `enabled` key.

If the advisor is enabled and its runtime looks healthy but it never speaks, check `/advisor status`: a non-zero `Dropped:` line names the class — `empty` replies mean the model returned a completed response with no content, `unparsed` replies mean prose without a JSON frame is being dropped (enable `proseFallback`, which delivers the cleaned prose as a low-severity note; JSON frames stay primary). Details → [docs/configuration.md](docs/configuration.md).
````

</details>

**依据 2 · 作者声明**：[README.md:104-117](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/README.md#L104-L117)

会话控制和建议投递范围。

<details>
<summary>查看原文（14行）</summary>

````text
## Features

- **Independent reviewer per session**: a separate model call observes the primary transcript and reviews each stepped primary turn; advisor messages are excluded from later deltas, so the advisor does not read its own advice back. The exclusion recognizes the advisor's current producer kind (`advisor`) AND both historical shapes a still-openable log can carry: the prehistoric direct `{ kind: 'advisor' }` note and the 0.1.6-era note as the V3→V4 in-memory migration rewrote it (`kind: 'plugin:advisor'`) — no generation of persisted notes is orphaned by the identity migration.
- **Severity-ranked advice with inject/steer semantics**: at most one note per review — **nit** (a minor style, clarity, or quality suggestion; delivered via non-waking `agent.inject`, consumed at the next pre-step boundary), **concern** (a material risk or clearly better direction to weigh before continuing; delivered via waking `agent.steer`, subject to the `immuneTurns` cooldown), **blocker** (continuing clearly wastes work — contradicts an explicit user instruction, going in circles, fundamentally unsound; delivered via `agent.steer`). Delivered messages carry the `[advisor:{severity}]` prefix and are self-described advisory content:

  ```
  [advisor:concern] extract the helper into a module and unit-test it
  ```

- **Explicit model gate**: a missing `provider` + `model` never starts a model call — status reports disabled-with-reason. The gate applies to the *effective* route after session resolution: a complete per-session override pair satisfies it for that session; a malformed global config cannot be bypassed. Unknown config keys are rejected — the removed `enabled` key is the one legacy exception (silently ignored; the plugin-row toggle is the switch).
- **Zero-tool minimal start**: the reviewer is an independent model call only — no advisor tools, nothing it can do to the session besides advisory messages.
- **No-stall failure policy**: a failing or quota-limited advisor only drops its own bounded backlog — it can never park or pollute the primary loop.
- **Session-scoped controls**: `/advisor on|off|status|config|model` work per session; the toggles and the per-session model pin are ephemeral overrides, never persisted config — `/advisor config` always reports the global defaults. On the web, the session header's **Advisor action** drives the same per-session pin through dedicated session endpoints (see [Verify](#verify)).
- **Next-prompt suggestion (web only)**: after each completed turn the advisor makes one best-effort prediction of the user's likely next prompt and shows it as a suggestion tip below the web composer — click the tip (or press → with an empty input box) to accept it. Web GUI only (no TUI equivalent); predictions are best-effort and silent on failure. Config: `nextPrompt` (boolean, default on); the off switch is the checkbox on the Advisor config card (web Plugins page).
````

</details>

**依据 3 · 源码核查**：[src/index.ts:639-656](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/index.ts#L639-L656)

新用户轮次与变化段。

<details>
<summary>查看原文（18行）</summary>

```text
    onUserTurnStart: (sessionId: string) => {
      // The user started typing — the fence supersedes any in-flight
      // prediction and clears the stored suggestion immediately (plan
      // dsh-advisor-next-prompt-n12, T1). The delivered-advice tip is the
      // same kind of idle notification: it belongs to the turn that just
      // ended, so a new human turn clears it too.
      suggestions.onUserTurnStart(sessionId)
      delivery.clearLastNote(sessionId)
    },
    onDelta: (sessionId: string, delta: Delta) => {
      // Lazy creation fallback covers agents that existed before this plugin
      // loaded (their `agent/created` was never observed); `agent/created`
      // below creates eagerly for the common path. The runtime gate drops the
      // delta for sessions that are disabled or S4-gate-blocked (T7).
      ensureRuntime(sessionId)?.enqueue(delta)
      // The same delta is the next-prompt prediction context (T1). Ordering
      // vs the review enqueue is free; the review enqueue stays first.
      suggestions.onDelta(sessionId, delta)
```

</details>

**依据 4 · 源码核查**：[src/advisor-runtime.ts:931-944](https://github.com/omdsh-dev/dsh-advisor/blob/59017312b6a8110ba1e2dba3c9d584cacd273f75/src/advisor-runtime.ts#L931-L944)

可复核外发的位置。

<details>
<summary>查看原文（14行）</summary>

```text
  private buildOptions(delta: Delta, signal: AbortSignal, reasoningEffort: ReasoningEffortId | undefined): GenerateOptions {
    return {
      provider: this.provider,
      model: this.model,
      system: this.systemPrompt,
      // The conversation this review belongs to. Providers that route per
      // conversation on a request header — OpenCode Go's `x-opencode-session`
      // — refuse a request without it, so the advisor call carries the owning
      // session id.
      sessionId: this.sessionId,
      messages: [createUserMessage({
        content: [{ type: 'text', text: delta.markdown }],
        source: { kind: 'user' },
      })],
```

</details>

#### 缺口

- 实际多轮成本和插件禁用后的历史影响
  **影响**：限制长期采用
  **进一步探讨**：关闭隔离会话评阅后核对调用、历史建议与常规流程

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
