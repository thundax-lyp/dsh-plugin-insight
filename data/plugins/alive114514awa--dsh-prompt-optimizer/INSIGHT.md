# dsh-prompt-optimizer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0f6d8d4](https://github.com/ALIve114514awa/dsh-prompt-optimizer/tree/0f6d8d42bc3418c78153ad56968117f9c38c3d42)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer) [![npm 30d 1,527](https://img.shields.io/static/v1?label=npm+30d&message=1%2C527&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer)
<!-- END META -->

> **实现功能**：先澄清需求再用Harness或Codex生成可编辑预览，确认后填入草稿并由读者自己发送。

> **核心亮点**：将问答/生成/预览/取消与Web草稿CAS接成显式流程，增量在用户控制与接线而非新改写算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：Codex继承provider权限不等Harness无工具只读，TUI无接收ACK/同等CAS；生成成功不证明最终任务更好。详见[Q02](#research-q02)。

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
  - [Q01 · 适合谁，两种后端到草稿主链是什么？](#detail-section-11)
  - [Q02 · 相对手工改写贡献与最重要边界是什么？](#detail-section-12)
  - [Q03 · 依赖、上下文外发与退出怎样组织？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本效果如何判断？](#detail-section-14)
  - [Q05 · 工程可复用点和受限改写收据假设怎么检验？](#detail-section-15)
  - [Q06 · 当前推荐、继续研究入口和停止条件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：发送复杂需求前审阅并改写，保留事实/约束及旧稿，需确认后端和context范围。

直接原稿或普通对话手工改写可替代；插件集中澄清和落稿保护，也增加模型阶段/审阅开销。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 澄清/改写 | 问答/扩写/精简 | 需明确生成，质量人工审 |
| Harness/Codex | 双后端 | 权限/费用不同，Codex非保证只读 |
| Web应用 | 草稿CAS | 引用/版本变化阻止旧覆 |
| TUI应用 | 双确认追加 | 无接收ACK，不自动重试 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH llm/会话/Connection契约 | Host必需 | 恢复当前agent、请求与取消 | Host/Client版本须分别核对 |
| 当前Harness模型/凭据 | Harness后端必需 | 无工具文本生成 | 不可用明确报错 |
| 官方Codex subagent provider及登录 | Codex后端可选 | 原生一次性生成 | 不提供CLI fallback，权限继承provider |
| Web输入CAS/Client或匹配TUI | 应用草稿必需 | 审阅后写草稿 | Web与TUI保证不同，TUI无接收回执 |
| 上一完整轮上下文授权 | 可选 | 补充改写语境 | 默认关闭，不自动附工作区/附件 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定发行包/宿主，选后端并备份原稿 | Codex权限和额外上下文范围明确 |
| 澄清 | 输入需求，可答/跳最多3问 | 不补未知事实，问题后仍需明确生成 |
| 生成 | 预览编辑并核对意图/约束 | 改写不是下游效果证明 |
| 应用/退出 | Web经CAS填草稿后人工发送；TUI追加后回看 | 未确认结果不自动重试，关闭取消请求 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配宿主/模型，Codex可选，金额未知 | 发行包/版本与原稿/权限核对 | Web/TUI分包勿重复装同profile |
| 持续使用 | 澄清/生成/重写的模型调用与可选上下文tokens | 回答问题、编辑预览、审核保真 | 比直接原稿多一个模型阶段 |
| 失败恢复 | 取消/超时、重生成与草稿核对 | 区分未生成、生成未应用、写出未知 | TUI无回执不可盲重复追加 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 意图澄清 | 问题/回答/预览/人工应用链 | 是否减少歧义或改善最终任务 |
| 原稿保护 | Web会话/引用/rev和CAS约束 | TUI原稿保留与接收确认 |
| 后端选择 | Harness无tools、Codex官方provider | Codex真实工具/沙箱能力及费用 |

> **思考**：Codex继承provider权限不等Harness无工具只读，TUI无接收ACK/同等CAS；生成成功不证明最终任务更好。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将问答/生成/预览/取消与Web草稿CAS接成显式流程，增量在用户控制与接线而非新改写算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

将问答/生成/预览/取消与Web草稿CAS接成显式流程，增量在用户控制与接线而非新改写算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是生成/应用分离、session+draftRev CAS、引用保护、取消早到记录与迟到结果丢弃、Host终止类型校验和Codex原生provider不自建CLI后门。请求错误不直接泄出原生诊断全文也是清晰边界。TUI与Codex公开接口限制应持续如实说明。

<a id="detail-section-5"></a>

### 1.4 主要限制

Codex继承provider权限不等Harness无工具只读，TUI无接收ACK/同等CAS；生成成功不证明最终任务更好。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

兼容Web/桌面Harness无工具路径可试用，Codex/TUI先核权限/回执，人工审稿并自己发送。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持澄清、双后端预览和Web草稿CAS集成；Codex继承权限不等Harness无工具，TUI写出没有同等CAS/接收回执，改写不证明任务更好。受限改写与应用收据尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/server/index.ts、src/server/codex.ts、src/client/PromptOptimizer.tsx、src/tui/draft.ts、docs/validation.md、src/server/requests.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host请求/上下文/两后端与取消、Web应用CAS和TUI追加、作者validation边界；未运行生成/应用，不全面审计全部UI和provider。
- 下一步：进一步探讨可用旧稿/引用/会话变化、取消迟到、丢ACK与工具请求夹具，再盲评保真和最终任务总成本。

**分析版本**

- **仓库**：[ALIve114514awa/dsh-prompt-optimizer](https://github.com/ALIve114514awa/dsh-prompt-optimizer)
- **版本号**：0.1.3（[固定提交 0f6d8d4](https://github.com/ALIve114514awa/dsh-prompt-optimizer/tree/0f6d8d42bc3418c78153ad56968117f9c38c3d42)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨受限改写与应用收据，绑定原稿/context/provider能力并回读目标版本/hash；公开接口/隐私维护成本未验证。详见[Q05](#research-q05)。

进一步探讨可用旧稿/引用/会话变化、取消迟到、丢ACK与工具请求夹具，再盲评保真和最终任务总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 244 | — | — | 3295 |
| .mjs | source | 7 | 468 | 436 | 17 | — |
| .ts | source | 14 | 1809 | 1662 | 47 | — |
| .tsx | source | 2 | 205 | 187 | 2 | — |
| .ts | test | 8 | 784 | 733 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer/issues?q=is%3Aissue+created%3A2026-09-22T06%3A17%3A56.997Z..2026-10-22T06%3A17%3A56.997Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A17%3A56.997Z..2026-10-22T06%3A17%3A56.997Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查澄清/双后端改写、预览与草稿应用协议及完整任务成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，两种后端到草稿主链是什么？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合在发送复杂需求前想先澄清/扩写/精简并亲自审稿的人。输入需求、最多三个问题的回答和可选上一完整轮上下文，输出可编辑预览，读者再明确应用到草稿并自己发送。合格结果需保留事实/约束、不引入未知，且不覆盖新草稿；不是把提示变长或生成成功当下游任务成功。

Host恢复当前agent、校验request/session并纳入RequestRegistry。Harness流用当前模型、固定system、tools:[]和输出上限；Codex走官方subagents一次性provider。预览JSON解析后返回，Client按origin session/draft/rev/引用检查，insertText带draftRev CAS；TUI通过公开socket追加接口写出。两个应用机制不能等同。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-17](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/README.md#L3-L17)

作者用途/预览/上下文边界。

<details>
<summary>查看原文（15行）</summary>

```text
**版本 0.1.3**。将模糊需求改写为清晰的提示词，支持 Harness 当前模型与 Codex，可先提问澄清，再预览和编辑结果。

Web UI 和桌面端的入口位于**左侧边栏底部、“上下文洞察”上方**；TUI 使用 `/prompt-optimize`。结果由用户确认后填入当前对话的草稿，聊天消息始终由用户自行发送。

实际验收范围与未验证事项见 [验收记录](docs/validation.md)。

## 使用

1. 选择一个聊天会话，打开“优化提示词”。在独立页面填写需求，或点击“带入输入框草稿”。
2. 选择 Harness AI / Codex，以及智能优化、扩写或精简。
3. 点击“澄清需求”，回答或跳过最多三个问题，再明确点击生成；也可以直接生成。
4. 在预览中编辑或复制结果，点击“应用到输入框”填回当前对话，再自行发送。

上下文默认关闭。手动开启后，只附带最近一轮**已结束**的用户输入和 AI 回复，不使用正在生成的回合，也不自动附带工作区文件或附件。

```

</details>

**依据 2 · 源码核查**：[src/server/index.ts:123-149](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L123-L149)

Harness无工具生成与终止校验。

<details>
<summary>查看原文（27行）</summary>

```text
async function generateWithHarness(ctx: Context, route: Route, sessionId: string, input: string, config: Config, signal: AbortSignal): Promise<string> {
  const assembler = new BlockAssembler()
  for await (const chunk of ctx.llm.stream({
    provider: route.provider, model: route.model, reasoningEffort: route.reasoningEffort,
    messages: [{ role: 'user', content: [{ type: 'text', text: input }] }],
    system: OPTIMIZER_SYSTEM, tools: [], maxTokens: config.maxOutputTokens,
    sessionId: sessionId as SessionId, signal,
  })) {
    signal.throwIfAborted()
    assembler.push(chunk)
  }
  signal.throwIfAborted()
  const finish = assembler.finish
  if (finish.kind === 'aborted') throw new OptimizerError('cancelled', '优化已取消。')
  if (finish.kind === 'error') {
    const messages: Record<string, string> = {
      AUTH: 'Harness 模型认证失败，请检查登录或 API 配置。',
      MISSING_CREDENTIAL: '当前模型缺少凭据，请在 Harness 设置中配置。',
      RATE_LIMIT: '模型请求达到限额，请稍后重试。',
      NO_ADAPTER: '当前模型提供方不可用，请切换模型。',
    }
    throw new OptimizerError(finish.failure.code, messages[finish.failure.code] ?? 'Harness 模型调用失败，请检查模型配置或稍后重试。')
  }
  if (finish.kind !== 'stop') throw new OptimizerError('invalid-result', finish.kind === 'max-tokens' ? '优化结果达到长度上限，请选择精简模式或增加输出上限。' : 'AI 返回了工具调用，未接受此结果，请重新生成。')
  const blocks = assembler.blocks()
  if (blocks.some(block => block.type === 'tool-call')) throw new OptimizerError('invalid-result', 'AI 返回了工具调用，未接受此结果。')
  return blocks.filter(block => block.type === 'text').map(block => block.text).join('')
```

</details>

**依据 3 · 源码核查**：[src/server/index.ts:157-170](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L157-L170)

可选context与两后端。

<details>
<summary>查看原文（14行）</summary>

```text
  async function optimize(request: OptimizeRequest, signal: AbortSignal, options?: OptimizerCallOptions): Promise<OptimizeResult> {
    const agent = await resolveAgent(ctx, request.sessionId, signal, options?.parent)
    signal.throwIfAborted()
    const context = request.includeContext ? readContext(agent, config.maxContextChars) : []
    const input = buildOptimizerInput(request, context)
    const route = request.backend === 'harness' ? selectedRoute(ctx, agent, config, options?.routeSource === 'agent-options') : undefined
    // Private optimization must not add plugin events to the durable chat log.
    // Released Session.append has no public ignorable-event writer; unknown
    // required events would prevent the official persistence reader restoring it.
    const text = request.backend === 'harness'
      ? await withCancellation(generateWithHarness(ctx, route!, request.sessionId, input, config, signal), signal)
      : await generateWithCodex(ctx, { sessionId: request.sessionId, parent: agent, prompt: `${OPTIMIZER_SYSTEM}\n\n待改写的数据：\n${input}` }, signal, config.codexProviderName)
    signal.throwIfAborted()
    const result: OptimizeResult = { ...parseOptimization(text, 30000, request.action), backend: request.backend, ...(route ? { model: route.model } : {}) }
```

</details>

**依据 4 · 源码核查**：[src/server/codex.ts:109-118](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/codex.ts#L109-L118)

官方subagent启动。

<details>
<summary>查看原文（10行）</summary>

```text
  // Await publication without racing it: before publication the provider owns
  // cancellation and cleanup; afterward this function owns the returned run.
  let run: SubagentRun
  try {
    run = await subagents.start(providerName, {
      label: '提示词优化',
      parent: resolved.agent,
      prompt: [{ type: 'text', text: request.prompt }],
      signal,
    })
```

</details>

**依据 5 · 源码核查**：[src/client/PromptOptimizer.tsx:27-54](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/PromptOptimizer.tsx#L27-L54)

Web目标/版本/引用CAS。

<details>
<summary>查看原文（28行）</summary>

```text
  const captureOrigin = (): ComposerOrigin => ({
    sessionId, draft: input.draft, draftRev: inputActions.captureInsertion().draftRev, hasReferences: input.occurrences.length > 0,
  })

  function applyBlockReason() {
    const origin = state.origin
    if (!origin) return ''
    if (sessionId !== origin.sessionId) return t('sessionChanged')
    if (origin.hasReferences || input.occurrences.length > 0) return t('referenceWarning')
    if (input.draftRev !== origin.draftRev || input.draft !== origin.draft) return t('draftChanged')
    if (input.phase !== 'plain') return t('inputLocked')
    return ''
  }
  const blocked = applyBlockReason()

  const apply = () => {
    const origin = state.origin
    if (!origin || busy || !state.output.trim()) return
    const reason = applyBlockReason()
    if (reason || inputActions.captureInsertion().draftRev !== origin.draftRev) {
      actions.showError(reason || t('draftChanged'))
      return
    }
    if (!inputActions.insertText(state.output, { start: 0, end: origin.draft.length, draftRev: origin.draftRev })) {
      actions.showError(t('applyFailed'))
      return
    }
    actions.applied()
```

</details>

**依据 6 · 源码核查**：[src/tui/draft.ts:59-72](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/tui/draft.ts#L59-L72)

TUI写出而非回执。

<details>
<summary>查看原文（14行）</summary>

```text
    socket.once('connect', () => {
      if (options.signal.aborted) return onAbort()
      if (!options.stillCurrent()) return fail(new OptimizerError('session-changed', '聊天已切换，未追加优化结果。'))
      socket.end(`${JSON.stringify({ type: 'prompt.append', text })}\n`)
    })
    socket.once('finish', () => {
      finished = true
    })
    socket.once('close', () => {
      if (settled) return
      if (!finished) return fail(new OptimizerError('draft-unavailable', 'TUI 草稿接口提前关闭，请保留预览后重试。'))
      settled = true
      cleanup()
      resolve()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对手工改写贡献与最重要边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把澄清、后端选择、预览/编辑、取消和草稿版本保护接成显式流程，避免改写结果自动发主聊天。Web用官方insertText CAS而不是随意操作textarea，是具体工程价值。模型改写能力来自上游，流程存在不证明最终需求更清晰或任务更成功。

关键边界是后端能力不对称。Harness明确tools:[]，Codex仅把改写提示交官方provider并继承parent，没有逐次限制工具/沙箱参数；提示只改写不等真实只读权限。可选context/需求会发给所选provider，需读者理解数据范围。

TUI成功是socket本地finish+close，没有目标输入接收ACK，也没有Web同等draftRev CAS；作者validation明确原稿保留尚未完成可靠验收，不应把Web保护推广至TUI。取消/超时释放UI不自动证明provider已停止全部副作用，Codex清理由provider/run负责。作者把桌面服务/部分窗口操作/未完成场景区分得较好，这仍是作者记录而非本轮独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/index.ts:123-129](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L123-L129)

Harness无工具。

```text
async function generateWithHarness(ctx: Context, route: Route, sessionId: string, input: string, config: Config, signal: AbortSignal): Promise<string> {
  const assembler = new BlockAssembler()
  for await (const chunk of ctx.llm.stream({
    provider: route.provider, model: route.model, reasoningEffort: route.reasoningEffort,
    messages: [{ role: 'user', content: [{ type: 'text', text: input }] }],
    system: OPTIMIZER_SYSTEM, tools: [], maxTokens: config.maxOutputTokens,
    sessionId: sessionId as SessionId, signal,
```

**依据 2 · 源码核查**：[src/server/codex.ts:109-118](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/codex.ts#L109-L118)

Codex继承parent与provider，无每次工具限制。

<details>
<summary>查看原文（10行）</summary>

```text
  // Await publication without racing it: before publication the provider owns
  // cancellation and cleanup; afterward this function owns the returned run.
  let run: SubagentRun
  try {
    run = await subagents.start(providerName, {
      label: '提示词优化',
      parent: resolved.agent,
      prompt: [{ type: 'text', text: request.prompt }],
      signal,
    })
```

</details>

**依据 3 · 源码核查**：[src/tui/draft.ts:59-72](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/tui/draft.ts#L59-L72)

追加写出无接收ACK。

<details>
<summary>查看原文（14行）</summary>

```text
    socket.once('connect', () => {
      if (options.signal.aborted) return onAbort()
      if (!options.stillCurrent()) return fail(new OptimizerError('session-changed', '聊天已切换，未追加优化结果。'))
      socket.end(`${JSON.stringify({ type: 'prompt.append', text })}\n`)
    })
    socket.once('finish', () => {
      finished = true
    })
    socket.once('close', () => {
      if (settled) return
      if (!finished) return fail(new OptimizerError('draft-unavailable', 'TUI 草稿接口提前关闭，请保留预览后重试。'))
      settled = true
      cleanup()
      resolve()
```

</details>

**依据 4 · 作者声明**：[docs/validation.md:38-45](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/docs/validation.md#L38-L45)

作者明确TUI/窗口/Codex边界。

```text
## 未完成事项与已知限制

- **原生桌面窗口完整交互**：截图与坐标操作工具超时，未完成逐项点击验收。已确认入口可见、实际 Host 双后端生成成功；这些不能代替完整窗口操作。
- **独立 Web Profile 全流程**：0.1.3 的安装及有效配置已检查，但本轮没有重新启动独立 Web 服务完成全部交互。
- **TUI 已有原稿保留**：尚未完成可靠的实际验收。宿主在优化场景中卸载主输入组件，直接预置草稿不足以验证保留行为，需要通过受支持的输入流程继续检查。
- **TUI 追加回执**：公开追加接口没有接收确认；请求写出后仍须检查主输入框。插件不自动重复追加。
- **Codex 权限与沙箱**：继承官方 provider 配置，没有逐次禁用工具的公开参数。优化指令要求仅改写，不能据此保证 Codex 全程只读。
- **TUI 原生诊断输出**：Codex 的 stderr WARN 可能短暂影响少量终端区域；已验收的预览和 footer 仍可用。
```

**依据 5 · 源码核查**：[src/client/PromptOptimizer.tsx:31-51](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/PromptOptimizer.tsx#L31-L51)

Web更强保护。

<details>
<summary>查看原文（21行）</summary>

```text
  function applyBlockReason() {
    const origin = state.origin
    if (!origin) return ''
    if (sessionId !== origin.sessionId) return t('sessionChanged')
    if (origin.hasReferences || input.occurrences.length > 0) return t('referenceWarning')
    if (input.draftRev !== origin.draftRev || input.draft !== origin.draft) return t('draftChanged')
    if (input.phase !== 'plain') return t('inputLocked')
    return ''
  }
  const blocked = applyBlockReason()

  const apply = () => {
    const origin = state.origin
    if (!origin || busy || !state.output.trim()) return
    const reason = applyBlockReason()
    if (reason || inputActions.captureInsertion().draftRev !== origin.draftRev) {
      actions.showError(reason || t('draftChanged'))
      return
    }
    if (!inputActions.insertText(state.output, { start: 0, end: origin.draft.length, draftRev: origin.draftRev })) {
      actions.showError(t('applyFailed'))
```

</details>

#### 缺口

- 固定Codex provider实际工具、沙箱与取消后副作用边界未确定。
  **影响：**不能把所有后端统一称只读文本改写。
  **进一步探讨：**可先固定provider版本与配置，核其权限/停止协议，再用无真实工作区的受控材料研究。
- TUI旧稿保留、接收确认和重试安全未完全确定。
  **影响：**不能把请求写出成功当主输入已收到且无重复。
  **进一步探讨：**可从支持的真实输入流程和可回读接口入手，补ACK或明确未知，失败保留预览不盲重发。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、上下文外发与退出怎样组织？

**研究主题：**依赖、兼容与流程

#### 完整回答

包0.1.3提供Host/Client/TUI，README要求Web/桌面与TUI分别选发行包、匹配CLI/profile，不能混装。Host硬依赖llm，sessionController/agents和Connection按界面提供；Codex provider缺失会明确不可用，不降级私有CLI。上下文默认关闭，只读最新已结束轮次的人类/助手文本，附件/工作区不自动补入。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH llm/会话/Connection契约 | Host必需 | 恢复当前agent、请求与取消 | Host/Client版本须分别核对 |
| 当前Harness模型/凭据 | Harness后端必需 | 无工具文本生成 | 不可用明确报错 |
| 官方Codex subagent provider及登录 | Codex后端可选 | 原生一次性生成 | 不提供CLI fallback，权限继承provider |
| Web输入CAS/Client或匹配TUI | 应用草稿必需 | 审阅后写草稿 | Web与TUI保证不同，TUI无接收回执 |
| 上一完整轮上下文授权 | 可选 | 补充改写语境 | 默认关闭，不自动附工作区/附件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定发行包/宿主，选后端并备份原稿 | Codex权限和额外上下文范围明确 |
| 澄清 | 输入需求，可答/跳最多3问 | 不补未知事实，问题后仍需明确生成 |
| 生成 | 预览编辑并核对意图/约束 | 改写不是下游效果证明 |
| 应用/退出 | Web经CAS填草稿后人工发送；TUI追加后回看 | 未确认结果不自动重试，关闭取消请求 |

RequestRegistry上限4并发、超时、取消早到记录、session绑定取消及dispose abort有清楚机制；保存预览与关闭请求属于UI，不等外部数据被撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-48](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/README.md#L35-L48)

版本与发行包约束。

<details>
<summary>查看原文（14行）</summary>

```text
## 兼容版本

| 部分 | 目标版本 |
| --- | --- |
| Web UI / 桌面端 | DeepSeek Harness `0.2.0-rc.2` |
| Host API | `0.1.7-rc.2` 或 `0.2.0-rc.2` |
| TUI | `@deepseek-harness-tui/dsh-tui@0.11.1` |
| Cordis / Web React | `4.0.4` / `18.3.1` |
| Node.js | 22 或更新版本 |

Web/桌面端安装 `dsh-prompt-optimizer`，TUI 安装 `dsh-prompt-optimizer-tui`。同一个 Profile 选择一个发行包，避免重复注册服务。TUI 包移除了浏览器依赖，以兼容旧版 CLI 的 peer 检查，并使用宿主提供的 React。

Profile 应由版本匹配的 CLI 管理。桌面应用的内置 runtime 可能与全局 `dsh` 不同，请先检查版本和实际依赖。

```

</details>

**依据 2 · 源码核查**：[src/server/index.ts:79-104](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L79-L104)

agent和完整轮上下文。

<details>
<summary>查看原文（26行）</summary>

```text
async function resolveAgent(ctx: Context, sessionId: string, signal: AbortSignal, parent?: Agent): Promise<Agent> {
  signal.throwIfAborted()
  if (parent) {
    const agents = ctx.get('agents')
    if (parent.session.id !== sessionId || (agents && agents.get(sessionId as SessionId) !== parent)) {
      throw new OptimizerError('session-unavailable', '当前聊天已失效，请在当前聊天重新打开提示词优化。')
    }
    return parent
  }
  const controller = ctx.get('sessionController')
  if (!controller) throw new OptimizerError('session-unavailable', '当前界面没有聊天恢复服务，请从聊天的提示词优化入口重新打开。')
  const resolved = await withCancellation(controller.resolveAgent(sessionId as SessionId), signal)
  if ('error' in resolved) throw new OptimizerError('session-unavailable', '无法打开当前聊天，请在普通会话中重试。')
  return resolved.agent
}

function readContext(agent: Agent, maxChars: number): ContextMessage[] {
  const messages: ContextMessage[] = []
  for (const event of latestCompletedTurn(agent.session.snapshotEvents())) {
    if (event.type === 'user/message') {
      // Context means committed human messages, not tool output or plugin injections.
      if (event.data.source.kind !== 'user') continue
      const text = event.data.content.filter(block => block.type === 'text').map(block => block.text).join('\n')
      if (text.trim()) messages.push({ role: 'user', text })
    } else if (event.type === 'assistant/message') {
      const text = joinAssistantStreamText(event.data.stream)
```

</details>

**依据 3 · 源码核查**：[src/server/codex.ts:26-34](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/codex.ts#L26-L34)

provider明确可用性。

```text
export function getCodexAvailability(ctx: Context, providerName = 'codex'): { available: boolean; reason?: string } {
  const subagents = ctx.get('subagents')
  if (!subagents?.getProvider(providerName)) {
    return {
      available: false,
      reason: '当前 Harness 未加载所配置的 Codex provider。请安装与 Harness 匹配的 dsh-subagent-codex 插件，并检查 provider 名称。',
    }
  }
  return { available: true }
```

**依据 4 · 源码核查**：[src/server/requests.ts:9-29](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/requests.ts#L9-L29)

并发/超时/清理。

<details>
<summary>查看原文（21行）</summary>

```text
  async run<T>(requestId: string, sessionId: string, parentSignal: AbortSignal, operation: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const cancellationKey = `${sessionId}\0${requestId}`
    this.pruneCancellations()
    if (this.disposed || this.cancelledBeforeStart.delete(cancellationKey)) throw new OptimizerError('cancelled', '已取消优化。')
    if (this.running.has(requestId)) throw new OptimizerError('duplicate-request', '该优化请求正在处理，请等待结果。')
    if (this.running.size >= 4) throw new OptimizerError('busy', '同时处理的优化请求过多，请稍后重试。')
    const controller = new AbortController()
    this.running.set(requestId, { sessionId, controller })
    const forwardAbort = () => controller.abort(parentSignal.reason ?? new OptimizerError('cancelled', '已取消优化。'))
    parentSignal.addEventListener('abort', forwardAbort, { once: true })
    if (parentSignal.aborted) forwardAbort()
    const timer = setTimeout(() => controller.abort(new OptimizerError('timeout', '优化超时，请稍后重试或切换 AI 来源。')), this.timeoutMs)
    try {
      controller.signal.throwIfAborted()
      const result = await operation(controller.signal)
      controller.signal.throwIfAborted()
      return result
    } finally {
      clearTimeout(timer)
      parentSignal.removeEventListener('abort', forwardAbort)
      this.running.delete(requestId)
```

</details>

**依据 5 · 源码核查**：[src/server/requests.ts:33-50](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/requests.ts#L33-L50)

session取消/早到/卸载。

<details>
<summary>查看原文（18行）</summary>

```text
  cancel(requestId: string, sessionId: string): boolean {
    const current = this.running.get(requestId)
    if (!current) {
      // A separate cancel HTTP request can arrive before the optimize body.
      this.pruneCancellations()
      if (this.cancelledBeforeStart.size >= 128) this.cancelledBeforeStart.delete(this.cancelledBeforeStart.keys().next().value!)
      this.cancelledBeforeStart.set(`${sessionId}\0${requestId}`, Date.now() + this.timeoutMs)
      return false
    }
    if (current.sessionId !== sessionId) return false
    current.controller.abort(new OptimizerError('cancelled', '已取消优化。'))
    return true
  }

  dispose(): void {
    this.disposed = true
    this.cancelledBeforeStart.clear()
    for (const request of this.running.values()) request.controller.abort(new OptimizerError('cancelled', '插件已卸载，优化已取消。'))
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本效果如何判断？

**研究主题：**效果与总成本

#### 完整回答

共同任务应比较相同需求直接发送与先优化后完成的最终正确率/返工，而不是改写长度或模型评价。问答与生成可能多轮调用，Codex与Harness可能走不同计费，附上下文增加tokens；本轮无价格/用量结果，不能填免费或固定节省。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配宿主/模型，Codex可选，金额未知 | 发行包/版本与原稿/权限核对 | Web/TUI分包勿重复装同profile |
| 持续使用 | 澄清/生成/重写的模型调用与可选上下文tokens | 回答问题、编辑预览、审核保真 | 比直接原稿多一个模型阶段 |
| 失败恢复 | 取消/超时、重生成与草稿核对 | 区分未生成、生成未应用、写出未知 | TUI无回执不可盲重复追加 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 意图澄清 | 问题/回答/预览/人工应用链 | 是否减少歧义或改善最终任务 |
| 原稿保护 | Web会话/引用/rev和CAS约束 | TUI原稿保留与接收确认 |
| 后端选择 | Harness无tools、Codex官方provider | Codex真实工具/沙箱能力及费用 |

作者验收支持其具体版本/场景的生成和部分草稿行为，未有原始需求到最终产物的盲评效果对照；两者应分开。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/index.ts:157-170](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L157-L170)

每次生成与可选上下文。

<details>
<summary>查看原文（14行）</summary>

```text
  async function optimize(request: OptimizeRequest, signal: AbortSignal, options?: OptimizerCallOptions): Promise<OptimizeResult> {
    const agent = await resolveAgent(ctx, request.sessionId, signal, options?.parent)
    signal.throwIfAborted()
    const context = request.includeContext ? readContext(agent, config.maxContextChars) : []
    const input = buildOptimizerInput(request, context)
    const route = request.backend === 'harness' ? selectedRoute(ctx, agent, config, options?.routeSource === 'agent-options') : undefined
    // Private optimization must not add plugin events to the durable chat log.
    // Released Session.append has no public ignorable-event writer; unknown
    // required events would prevent the official persistence reader restoring it.
    const text = request.backend === 'harness'
      ? await withCancellation(generateWithHarness(ctx, route!, request.sessionId, input, config, signal), signal)
      : await generateWithCodex(ctx, { sessionId: request.sessionId, parent: agent, prompt: `${OPTIMIZER_SYSTEM}\n\n待改写的数据：\n${input}` }, signal, config.codexProviderName)
    signal.throwIfAborted()
    const result: OptimizeResult = { ...parseOptimization(text, 30000, request.action), backend: request.backend, ...(route ? { model: route.model } : {}) }
```

</details>

**依据 2 · 源码核查**：[src/server/requests.ts:9-29](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/requests.ts#L9-L29)

并发和timeout。

<details>
<summary>查看原文（21行）</summary>

```text
  async run<T>(requestId: string, sessionId: string, parentSignal: AbortSignal, operation: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const cancellationKey = `${sessionId}\0${requestId}`
    this.pruneCancellations()
    if (this.disposed || this.cancelledBeforeStart.delete(cancellationKey)) throw new OptimizerError('cancelled', '已取消优化。')
    if (this.running.has(requestId)) throw new OptimizerError('duplicate-request', '该优化请求正在处理，请等待结果。')
    if (this.running.size >= 4) throw new OptimizerError('busy', '同时处理的优化请求过多，请稍后重试。')
    const controller = new AbortController()
    this.running.set(requestId, { sessionId, controller })
    const forwardAbort = () => controller.abort(parentSignal.reason ?? new OptimizerError('cancelled', '已取消优化。'))
    parentSignal.addEventListener('abort', forwardAbort, { once: true })
    if (parentSignal.aborted) forwardAbort()
    const timer = setTimeout(() => controller.abort(new OptimizerError('timeout', '优化超时，请稍后重试或切换 AI 来源。')), this.timeoutMs)
    try {
      controller.signal.throwIfAborted()
      const result = await operation(controller.signal)
      controller.signal.throwIfAborted()
      return result
    } finally {
      clearTimeout(timer)
      parentSignal.removeEventListener('abort', forwardAbort)
      this.running.delete(requestId)
```

</details>

**依据 3 · 作者声明**：[docs/validation.md:7-21](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/docs/validation.md#L7-L21)

作者分项验证及版本范围。

<details>
<summary>查看原文（15行）</summary>

```text
| 场景 | 结果 | 范围 |
| --- | --- | --- |
| 桌面 Harness / Codex 真实生成 | 通过 | 在实际运行的 Electron 桌面 Host 中，通过公开插件服务分别成功生成预览；Codex 使用专用官方 native provider |
| 不自动发送主聊天 | 通过 | 桌面自检前后人工消息、助手消息与聊天轮次均未增加；TUI 真实生成及填入测试也未提交聊天 |
| 左侧边栏入口 | 已实际确认 | 原生窗口可访问性树中，“优化提示词”位于“上下文洞察”上方，没有输入框快捷入口 |
| 浏览器澄清、三种改写、编辑、复制和应用 | 已实际操作 | 在桌面 Host 的兼容网页、插件 0.1.2 中完成；0.1.3 的相关客户端实现未再次修改，未把该证据视为完整原生窗口点击验收 |
| 草稿变化后防止旧预览覆盖 | 已实际操作 | 修改主草稿后，旧预览保留但应用被禁用，仍可复制；另有组件行为测试覆盖 |
| TUI 澄清与明确生成 | 通过 | 0.1.3 的真实终端完成最多三问、回答与明确生成；小高度终端的动作和快捷键 footer 可见 |
| TUI Harness 编辑及双次确认填入 | 通过 | 编辑后的预览通过两次确认填入实际主输入框，主聊天消息和轮次未增加 |
| TUI Codex 直接生成 | 通过 | 0.1.3 的真实终端使用专用 native provider 成功生成，保留输入事实和不补充未知信息的要求 |
| 官方冷恢复 | 通过 | 测试会话分别由官方 persistence 0.2.0-rc.2 和 0.1.7-rc.2 冷读并重放；实际桌面 Host 也恢复成功 |
| 新优化不追加私有聊天事件 | 通过 | 桌面和 TUI 真实测试没有新增私有优化事件；Host 仍可能记录正常元数据，不能宣称所有事件完全不变 |

上述桌面服务验证使用临时本地 Cordis 自检插件，复用现有 Host，没有启动第二个桌面服务。自检结束后已移除临时配置。它证明后端生成与事件边界，不替代窗口交互测试。

```

</details>

#### 缺口

- 没有同需求、同执行模型的最终任务质量、总tokens/人时及返工对照。
  **影响：**不能承诺优化提示就提升任务效果或省成本。
  **进一步探讨：**可盲评保真/未知新增并比较最终产物，计澄清、改写、审稿及下游所有重做。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程可复用点和受限改写收据假设怎么检验？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是生成/应用分离、session+draftRev CAS、引用保护、取消早到记录与迟到结果丢弃、Host终止类型校验和Codex原生provider不自建CLI后门。请求错误不直接泄出原生诊断全文也是清晰边界。TUI与Codex公开接口限制应持续如实说明。

可探讨未验证的“受限改写与应用收据”。后端显式声明工具/文件/网络能力，纯改写优先无工具隔离；每个结果绑定原稿hash/版本、实际发送context与provider。应用端统一返回接收稿版本/hash，未知不自动重试；TUI无官方ACK就保留未知状态。相对现有Web CAS加TUI写出，它使后端副作用和落稿可核查。代价是provider适配、隐私元数据和宿主接口依赖。可用旧稿变化、引用新增、会话切换、取消迟到、丢ACK与Codex工具请求夹具比较错覆/重复/越权，若仍凭提示当只读或写出当收到，应修协议。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/PromptOptimizer.tsx:27-54](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/PromptOptimizer.tsx#L27-L54)

CAS与引用保护。

<details>
<summary>查看原文（28行）</summary>

```text
  const captureOrigin = (): ComposerOrigin => ({
    sessionId, draft: input.draft, draftRev: inputActions.captureInsertion().draftRev, hasReferences: input.occurrences.length > 0,
  })

  function applyBlockReason() {
    const origin = state.origin
    if (!origin) return ''
    if (sessionId !== origin.sessionId) return t('sessionChanged')
    if (origin.hasReferences || input.occurrences.length > 0) return t('referenceWarning')
    if (input.draftRev !== origin.draftRev || input.draft !== origin.draft) return t('draftChanged')
    if (input.phase !== 'plain') return t('inputLocked')
    return ''
  }
  const blocked = applyBlockReason()

  const apply = () => {
    const origin = state.origin
    if (!origin || busy || !state.output.trim()) return
    const reason = applyBlockReason()
    if (reason || inputActions.captureInsertion().draftRev !== origin.draftRev) {
      actions.showError(reason || t('draftChanged'))
      return
    }
    if (!inputActions.insertText(state.output, { start: 0, end: origin.draft.length, draftRev: origin.draftRev })) {
      actions.showError(t('applyFailed'))
      return
    }
    actions.applied()
```

</details>

**依据 2 · 源码核查**：[src/server/requests.ts:33-50](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/requests.ts#L33-L50)

取消早到与dispose。

<details>
<summary>查看原文（18行）</summary>

```text
  cancel(requestId: string, sessionId: string): boolean {
    const current = this.running.get(requestId)
    if (!current) {
      // A separate cancel HTTP request can arrive before the optimize body.
      this.pruneCancellations()
      if (this.cancelledBeforeStart.size >= 128) this.cancelledBeforeStart.delete(this.cancelledBeforeStart.keys().next().value!)
      this.cancelledBeforeStart.set(`${sessionId}\0${requestId}`, Date.now() + this.timeoutMs)
      return false
    }
    if (current.sessionId !== sessionId) return false
    current.controller.abort(new OptimizerError('cancelled', '已取消优化。'))
    return true
  }

  dispose(): void {
    this.disposed = true
    this.cancelledBeforeStart.clear()
    for (const request of this.running.values()) request.controller.abort(new OptimizerError('cancelled', '插件已卸载，优化已取消。'))
```

</details>

**依据 3 · 源码核查**：[src/server/codex.ts:135-152](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/codex.ts#L135-L152)

分类错误与结果校验。

<details>
<summary>查看原文（18行）</summary>

```text
    if (result.stopReason !== 'completed') {
      // Only map fixed provider categories; never expose raw native diagnostics.
      const category = result.diagnostic?.match(/category: (limit|access-policy|service|transport|product-error)(?:;|\))/)?.[1]
      const reasons: Record<string, string> = {
        limit: 'Codex 账号用量已达限制，请等待额度恢复或切换 Harness 模型。',
        'access-policy': 'Codex 访问被拒绝，请检查原生登录和模型权限。',
        service: 'Codex 服务暂时不可用，请稍后重试。',
        transport: 'Codex 连接失败，请检查原生连接配置后重试。',
        'product-error': '原生 Codex 拒绝了请求。请检查官方 Codex provider 的原生模型配置与账号支持情况，然后重试或切换 Harness 模型。',
      }
      throw new CodexGenerationError('codex-failed', category ? reasons[category]! : `Codex 优化未完成（${result.stopReason}）。`)
    }
    const text = result.output
      .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim()
    if (!text) throw new CodexGenerationError('invalid-result', 'Codex 未返回可用的优化结果。')
```

</details>

**依据 4 · 源码核查**：[src/tui/draft.ts:59-72](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/tui/draft.ts#L59-L72)

应用收据假设起点。

<details>
<summary>查看原文（14行）</summary>

```text
    socket.once('connect', () => {
      if (options.signal.aborted) return onAbort()
      if (!options.stillCurrent()) return fail(new OptimizerError('session-changed', '聊天已切换，未追加优化结果。'))
      socket.end(`${JSON.stringify({ type: 'prompt.append', text })}\n`)
    })
    socket.once('finish', () => {
      finished = true
    })
    socket.once('close', () => {
      if (settled) return
      if (!finished) return fail(new OptimizerError('draft-unavailable', 'TUI 草稿接口提前关闭，请保留预览后重试。'))
      settled = true
      cleanup()
      resolve()
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前推荐、继续研究入口和停止条件？

**研究主题：**采用判断

#### 完整回答

推荐trial，优先固定兼容Web/桌面并使用Harness无工具路径，人工审预览、保留原稿且自己发送。Codex需先确认provider权限；TUI应视为另一条保证较弱的应用链，写出后回看不重复追加。不能因作者自动测试或真实生成通过推断最终提示质量。

继续探讨可先用无敏感需求比较保真与未知新增，核Web旧稿/引用变更，再按明确范围研究TUI回执和Codex能力。出现新增虚构约束/事实、旧结果可覆盖新稿、上下文越界、取消后仍有不可解释动作、TUI接收未知或后端权限不清时应停止应用并复制保留结果。Q02/Q04结果决定是否扩展，本轮不生成或应用任何草稿。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/index.ts:123-149](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts#L123-L149)

优先无工具路径。

<details>
<summary>查看原文（27行）</summary>

```text
async function generateWithHarness(ctx: Context, route: Route, sessionId: string, input: string, config: Config, signal: AbortSignal): Promise<string> {
  const assembler = new BlockAssembler()
  for await (const chunk of ctx.llm.stream({
    provider: route.provider, model: route.model, reasoningEffort: route.reasoningEffort,
    messages: [{ role: 'user', content: [{ type: 'text', text: input }] }],
    system: OPTIMIZER_SYSTEM, tools: [], maxTokens: config.maxOutputTokens,
    sessionId: sessionId as SessionId, signal,
  })) {
    signal.throwIfAborted()
    assembler.push(chunk)
  }
  signal.throwIfAborted()
  const finish = assembler.finish
  if (finish.kind === 'aborted') throw new OptimizerError('cancelled', '优化已取消。')
  if (finish.kind === 'error') {
    const messages: Record<string, string> = {
      AUTH: 'Harness 模型认证失败，请检查登录或 API 配置。',
      MISSING_CREDENTIAL: '当前模型缺少凭据，请在 Harness 设置中配置。',
      RATE_LIMIT: '模型请求达到限额，请稍后重试。',
      NO_ADAPTER: '当前模型提供方不可用，请切换模型。',
    }
    throw new OptimizerError(finish.failure.code, messages[finish.failure.code] ?? 'Harness 模型调用失败，请检查模型配置或稍后重试。')
  }
  if (finish.kind !== 'stop') throw new OptimizerError('invalid-result', finish.kind === 'max-tokens' ? '优化结果达到长度上限，请选择精简模式或增加输出上限。' : 'AI 返回了工具调用，未接受此结果，请重新生成。')
  const blocks = assembler.blocks()
  if (blocks.some(block => block.type === 'tool-call')) throw new OptimizerError('invalid-result', 'AI 返回了工具调用，未接受此结果。')
  return blocks.filter(block => block.type === 'text').map(block => block.text).join('')
```

</details>

**依据 2 · 源码核查**：[src/client/PromptOptimizer.tsx:31-51](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/PromptOptimizer.tsx#L31-L51)

Web保护。

<details>
<summary>查看原文（21行）</summary>

```text
  function applyBlockReason() {
    const origin = state.origin
    if (!origin) return ''
    if (sessionId !== origin.sessionId) return t('sessionChanged')
    if (origin.hasReferences || input.occurrences.length > 0) return t('referenceWarning')
    if (input.draftRev !== origin.draftRev || input.draft !== origin.draft) return t('draftChanged')
    if (input.phase !== 'plain') return t('inputLocked')
    return ''
  }
  const blocked = applyBlockReason()

  const apply = () => {
    const origin = state.origin
    if (!origin || busy || !state.output.trim()) return
    const reason = applyBlockReason()
    if (reason || inputActions.captureInsertion().draftRev !== origin.draftRev) {
      actions.showError(reason || t('draftChanged'))
      return
    }
    if (!inputActions.insertText(state.output, { start: 0, end: origin.draft.length, draftRev: origin.draftRev })) {
      actions.showError(t('applyFailed'))
```

</details>

**依据 3 · 作者声明**：[docs/validation.md:38-45](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/docs/validation.md#L38-L45)

作者边界。

```text
## 未完成事项与已知限制

- **原生桌面窗口完整交互**：截图与坐标操作工具超时，未完成逐项点击验收。已确认入口可见、实际 Host 双后端生成成功；这些不能代替完整窗口操作。
- **独立 Web Profile 全流程**：0.1.3 的安装及有效配置已检查，但本轮没有重新启动独立 Web 服务完成全部交互。
- **TUI 已有原稿保留**：尚未完成可靠的实际验收。宿主在优化场景中卸载主输入组件，直接预置草稿不足以验证保留行为，需要通过受支持的输入流程继续检查。
- **TUI 追加回执**：公开追加接口没有接收确认；请求写出后仍须检查主输入框。插件不自动重复追加。
- **Codex 权限与沙箱**：继承官方 provider 配置，没有逐次禁用工具的公开参数。优化指令要求仅改写，不能据此保证 Codex 全程只读。
- **TUI 原生诊断输出**：Codex 的 stderr WARN 可能短暂影响少量终端区域；已验收的预览和 footer 仍可用。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
