# Jev 决策插件

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[93ed435](https://github.com/luobosibing2/dsh-jev-plugin/tree/93ed43565cf6b01159dc7351865060012e7a1d97)

<!-- BEGIN META -->
[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/luobosibing2/dsh-jev-plugin)
<!-- END META -->

> **功能**：在 DSH 扩展点调用 Jev 或 Luna Decisions，支持按需监督、筛选、导航和单次审批辅助。

> **亮点**：[Q01](#research-q01) 把报告审阅接到宿主生命周期，并为同轮有限补充保留可追溯记录。

> **主要限制**：[Q03](#research-q03) 复核没有读工件；独立的提权功能确实可能给出单次授权。

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
  - [Q01 · 普通轮次完成检查补充了什么？](#detail-section-11)
  - [Q02 · 补充预算和旧结论如何处理？](#detail-section-12)
  - [Q03 · 打开完成检查会不会替代宿主权限？](#detail-section-13)
  - [Q04 · 哪种评估最能隔离额外代价？](#detail-section-14)
  - [Q05 · 怎样验证完成报告更好是否意味着交付更好？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 输出前检查本轮要求的人，可以为使用 Todo 的任务评估第二判断路径。

主模型自检几乎无需接线，人工检查工件能核实实际结果但有时间负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 完成复核 | 检查报告与本轮要求 | 不验证真实工件 |
| 有限补充 | 在原轮次处理一个问题 | 受额度和新鲜度约束 |
| 单次审批 | 代答特定原生提权 | 独立开关，模型判断仍可能有误 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH profile | 必需 | 接收原生生命周期 | 挂载或特定功能不可用 |
| 判断模型连接 | 启用判断必需 | 返回选择结果 | 保留主回答或人工处理 |
| 本轮 Todo 和要求 | 普通完成核查必需 | 生成复核材料 | 未用 Todo 跳过，缺原始要求报未完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 核对版本和判断端点 | 只开完成检查 |
| 评估 | 使用有独立验收的合成任务 | 观察额外轮次和真实工件 |
| 退出 | 关闭该功能 | 继续人工验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型与接入费用未知 | 配置和策略确认耗时未知 | 端点、凭据、版本均需核对 |
| 持续 | 额外判断与主模型补充费用未知 | 审阅和等待未知 | 补充次数有额度 |
| 恢复 | 重试费用未知 | 排查过期和未确认操作耗时未知 | 保留主回答或人工退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 报告检查 | 两类选择和输入引用受约束 | 独立工件结果 |
| 补充限制 | 预留与额度在采用前核对 | 中断组合实测 |

> **思考**：[Q03](#research-q03) 复核没有读工件；独立的提权功能确实可能给出单次授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把报告审阅接到宿主生命周期，并为同轮有限补充保留可追溯记录。

输入预算、状态新鲜度和预留记录分别约束远端判断及采用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 复核没有读工件；独立的提权功能确实可能给出单次授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单独启用完成检查，用受控文本与独立验收判断收益，保留审批人工路径。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查普通完成检查与独立审批代表路径；未复现作者运行、正确率或成本。

- 已检查：作者 README、包清单、源码路径 README.md、packages/jev/src/completion-report.ts、packages/jev/src/supervision.ts、packages/jev/src/workspace-approval.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库完成检查和单次提权代表源码。未执行模型、宿主和工具。
- 下一步：用合成任务统计错误接受、补充和延迟，另查中断后的状态。

**分析版本**

- **仓库**：[luobosibing2/dsh-jev-plugin](https://github.com/luobosibing2/dsh-jev-plugin)
- **版本号**：0.1.0（[固定提交 93ed435](https://github.com/luobosibing2/dsh-jev-plugin/tree/93ed43565cf6b01159dc7351865060012e7a1d97)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用独立工件验收验证额外判断是否减少任务遗漏。

用合成任务统计错误接受、补充和延迟，另查中断后的状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 85 | 6131 | — | — | 182638 |
| .mjs | source | 35 | 3134 | 2963 | 74 | — |
| .ts | source | 35 | 6291 | 5669 | 260 | — |
| .tsx | source | 3 | 1267 | 1155 | 19 | — |
| .ts | test | 28 | 9141 | 8659 | 63 | — |
| .tsx | test | 2 | 949 | 875 | 30 | — |
| .mjs | example | 11 | 1033 | 963 | 36 | — |
| .ts | example | 2 | 145 | 139 | 3 | — |
| .md | example | 1 | 31 | — | — | 609 |
| .md | test | 1 | 63 | — | — | 2408 |
| .js | source | 51 | 36493 | 35568 | 1818 | — |
| .mjs | test | 4 | 244 | 224 | 3 | — |

</details>

**活跃度**

[![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/luobosibing2/dsh-jev-plugin/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/luobosibing2/dsh-jev-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查普通轮次完成检查的输入、补充生命周期和独立的提权边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 普通轮次完成检查补充了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在交付前再核对当前要求的人，可以为使用过 Todo 的普通轮次启用复核。构建器读取本轮用户要求、最新 Todo 和最终文本，再用判断与引用两个有界问题聚焦一个问题。相较只让主模型结束，它加入独立判定入口；相较人工检查真实产物，它缺少工具结果和工件，因此完整结论只评价所给报告。未使用 Todo 的普通轮次跳过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-70](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/README.md#L60-L70)

作者说明触发、字段及补充范围

<details>
<summary>查看原文（11行）</summary>

```text
## Completion checks

An enabled ordinary root turn is checked at its normal stopping point only if it used Todo during that turn. Pending items and a later empty list still qualify. A turn without Todo skips the check, and a Todo update during execution does not start a check. Native Goal turns retain their own supervision.

The judgment receives the current turn's original user request and later adjustments, the complete latest Todo, and the latest final answer. It excludes raw tool results, reasoning and earlier turns. A new turn saying only “continue” does not automatically import the previous task. While the feature is enabled, a short model instruction asks for actual actions, paths, commands and observed results in existing Todo content; it adds no Todo fields or requirement to create a list for a simple task.

One judgment request asks two Choice questions: `assessment` chooses `complete`, `omission`, `contradiction`, `needs-user` or `unknown`; `focus` selects an existing requirement, Todo item or final-answer reference. `complete` means the supplied report appears to meet the requirements. It does not independently verify code, artifacts or execution facts. Each check identifies only the most important issue.

`omission`, `contradiction` and valid `unknown` share the profile's **Maximum automatic supplement rounds** setting (`maxSupplementRounds`), default 3. The initial check is separate: a limit of N permits at most N automatic supplements and N+1 normal checks; the default permits 3 supplements and 4 normal checks. `complete` ends normally, `needs-user` stops for the user's decision, and an unresolved result at the limit ends with that last conclusion. Supplements stay in the same turn and retain existing authorization.

The full input is checked against the existing character budget before dispatch. Oversized input is neither cropped nor automatically summarized. Missing original requirements, budget rejection, transport errors or invalid answers show that the completion check did not finish and wait for **Retry / Cancel**, while retaining the main answer. Retry reads current materials and saved settings. Technical retries do not count toward N+1 normal checks and neither consume nor reset supplement rounds already used. Cancel ends the check without declaring the task successful or failed. See the [package reference](packages/jev/README.md#ordinary-completion-checks) for result meanings, records and lifecycle details.
```

</details>

**依据 2 · 源码核查**：[packages/jev/src/completion-report.ts:26-54](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/completion-report.ts#L26-L54)

构造当前轮材料和选项

<details>
<summary>查看原文（29行）</summary>

```text
export function completionReport(agent: Agent, requestId: string, supplements: number, maximum: number, budget: number): JevRequest | undefined {
  const events = agent.session.snapshotEvents()
  const start = events.findLastIndex(event => event.type === 'turn/start')
  const turn = events.slice(Math.max(0, start))
  const todo = turn.findLast(event => event.type === 'todo/write')
  if (todo?.type !== 'todo/write') return undefined
  const requirements = turn.flatMap(event => event.type === 'user/message' && event.data.source.kind === 'user'
    ? [{ id: event.data.id, content: event.data.content }] : [])
  const originalAvailable = start >= 0 && requirements.some(message => message.id === requestId)
  const final = turn.findLast(event => event.type === 'assistant/message')
  const finalText = final?.type === 'assistant/message'
    ? final.data.message.content.filter(block => block.type === 'text').map(block => block.text).join('\n') : ''
  const options = [
    ...requirements.map((message, index) => ({ id: `requirement-${index + 1}`, description: JSON.stringify(message.content) })),
    ...todo.data.todos.map((item, index) => ({ id: `todo-${index + 1}`, description: `[${item.status}] ${item.content}` })),
    { id: 'final-answer', description: finalText || '最终正文为空 / Empty final answer' },
    { id: 'overall', description: '整体材料 / The complete supplied material' },
    { id: 'none', description: '未发现问题 / No issue identified (complete only)' },
  ]
  const state: Json = {
    mode: 'completion', reviewPoint: String(final?.seq ?? todo.seq), evidenceScope: 'current turn requirements, latest Todo and latest final answer only',
    requirements: requirements.map(message => ({ id: message.id, content: JSON.parse(JSON.stringify(message.content)) as Json })),
    todos: todo.data.todos.map(item => ({ content: item.content, status: item.status })), finalAnswer: finalText,
    originalRequirementsAvailable: originalAvailable, supplementsUsed: supplements, maxSupplementRounds: maximum, evidenceCharacterBudget: budget,
    rules: 'Review the supplied report only. The original requirements and subsequent adjustments are in chronological order; later explicit adjustments apply. Todo may contain historical work, but it does not replace the current-turn user requirements. Do not infer an earlier task from a new request saying continue. Empty Todo and empty final text are valid material. Select only the single most important issue; this is not an exhaustive review. Do not infer actual tool execution or artifact correctness from self-reported completion. Tests need to pass only if the user required that condition: running and truthfully reporting failed tests can satisfy a run-and-report request; a fix-and-pass request remains unmet while those tests fail. Todo pending status alone does not establish failure. Supplements stay within existing authorization, including read-only restrictions, and must not redo unrelated completed work, fabricate results, or force completed status. Unknown calls for truthful supporting information or an explanation of what remains unverified. Plugin notices are neither new user requirements nor new authorization.',
  }
  return { state, questions: [
    { id: 'assessment', kind: 'choice', prompt: 'Assess the current-turn report using the supplied rules.', options: Object.entries(assessments).map(([id, description]) => ({ id, description })) },
    { id: 'focus', kind: 'choice', prompt: 'Choose the most important existing requirement, Todo entry, or final answer. Use overall for material-wide uncertainty; none is permitted only for complete.', options },
```

</details>

**依据 3 · 源码核查**：[packages/jev/src/supervision.ts:389-416](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/supervision.ts#L389-L416)

在宿主轮次停止阶段调用

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.on('agent/turn-stopping', async ({ agent, signal }) => {
    if (!live(agent) || signal.aborted || agent.inbox.nextStep.length > 0) return
    const state = stateFor(agent)
    const goal = ctx.goals.get(agent)
    if (goal?.phase === 'active') {
      if (!await enabled('goal-supervision')) return
      const revision = goalIdentity(goal)
      if (state.goalRevision !== revision) { state.goalRevision = revision; state.stalled = 0; state.lastRound = -1 }
      if (goal.roundsStarted === 0 || state.lastRound === goal.roundsStarted) return
      const result = await judge(agent, state, 'progress', signal)
      if (result.kind !== 'ok') return
      const assessment = assessments.get(result.operationId)!
    assessments.delete(result.operationId)
      state.lastRound = goal.roundsStarted
      if (assessment.value === 'progress') state.stalled = 0
      else if (assessment.value === 'no-progress') state.stalled++
      if (assessment.value === 'needs-user' || state.stalled >= config.noProgressRounds.get()) {
        pause(agent)
        agent.session.append('user/message', notice(state, result.operationId, 'goal-paused', 'Jev 已暂停目标 / Goal paused: ' + assessment.reason), { surfaceOp: 'append' })
        await receipt(result.operationId, 'goal-paused', 'executed', assessment.reason)
      } else await receipt(result.operationId, 'progress-checked', 'observed', assessment.reason)
      return
    }
    if (state.ownsGoalTurn || !await enabled('completion-check') || !state.requestId
      || agent.inbox.nextTurn.some(message => message.source.kind === 'user')) return
    if (!state.active || state.completionChecking) return
    state.completionChecking = true
    try { await checkReport(agent, state, signal) }
```

</details>

#### 缺口

- 独立判断的质量收益未测
  **影响**：无法判断是否比单模型更少遗漏
  **进一步探讨**：对照同一组可验收任务的报告与实际工件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 补充预算和旧结论如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

复核从持久记录统计已用和未确认补充。遇到未确认操作会写提示并返回，避免直接重放。判定前按最新材料刷新，验证输入预算和回答引用，采用前再查轮次身份及等待中的用户消息。完整或需要用户时结束，额度耗尽也结束；否则先记录补充预留，随后再检查状态并 steer 同一轮。这种先预留的方式能减少不确定执行后重复注入，代价是未确认记录可能需要人介入。

#### 证据与依据

**依据 1 · 源码核查**：[packages/jev/src/completion-report.ts:62-82](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/completion-report.ts#L62-L82)

缺原始要求和超预算拒绝，限制有效引用

<details>
<summary>查看原文（21行）</summary>

```text
export function completionPreflight(request: JevRequest, budget: number): void {
  if (typeof request.state !== 'object' || request.state === null || Array.isArray(request.state) || !('originalRequirementsAvailable' in request.state) || request.state.originalRequirementsAvailable !== true) {
    throw new JevError('COMPLETION_INPUT_MISSING', '本轮原始要求缺失，本次完成核查未完成 / Original current-turn requirements are unavailable; completion review did not finish')
  }
  if (JSON.stringify(request).length > budget) {
    throw new JevError('COMPLETION_BUDGET', '核查材料超出预算，本次完成核查未完成 / Review material exceeds the character budget; completion review did not finish')
  }
}

/** Validate both bounded answers; valid unknown is a business conclusion.
 * @param response - normalized provider answer.
 * @param request - actual input defining all permitted references.
 * @returns the assessment and its exact selected quotation, or no verdict for invalid answers.
 */
export function completionVerdict(response: JevResponse, request: JevRequest): CompletionVerdict | undefined {
  const assessment = response.answers.find(answer => answer.id === 'assessment')
  const focus = response.answers.find(answer => answer.id === 'focus')
  if (response.answers.length !== 2 || assessment?.kind !== 'choice' || focus?.kind !== 'choice' || !Object.hasOwn(assessments, assessment.optionId)) return undefined
  const question = request.questions.find(question => question.id === 'focus')
  const selected = question?.kind === 'choice' ? question.options.find(option => option.id === focus.optionId) : undefined
  if (selected === undefined || (selected.id === 'none' && assessment.optionId !== 'complete')) return undefined
```

</details>

**依据 2 · 源码核查**：[packages/jev/src/supervision.ts:238-272](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/supervision.ts#L238-L272)

未确认补充停止，刷新和采用防陈旧

<details>
<summary>查看原文（35行）</summary>

```text
  async function checkReport(agent: Agent, state: State, signal: AbortSignal): Promise<void> {
    const initial = completionReport(agent, state.completionRequestId, 0, config.maxSupplementRounds.get(), config.evidenceChars.get())
    if (initial === undefined) return
    const reviewPoint = typeof initial.state === 'object' && initial.state !== null && 'reviewPoint' in initial.state ? String(initial.state.reviewPoint) : ''
    const usage = await supplementUsage(agent, state.completionRequestId)
    if (usage.unconfirmedOperationId !== undefined) {
      if (agent.session.snapshotEvents().some(event => event.type === 'user/message' && event.data.source.kind === 'jev-supervision'
        && event.data.source.operationId === usage.unconfirmedOperationId && event.data.source.action === 'supplement-unconfirmed')) return
      await receipt(usage.unconfirmedOperationId, 'supplement-unconfirmed', 'observed', 'Previous supplement has an unknown action status; do not repeat it')
      agent.session.append('user/message', notice(state, usage.unconfirmedOperationId, 'supplement-unconfirmed', '上次补充状态未确认，本次完成核查未完成 / Previous supplement remains unconfirmed; completion review did not finish'), { surfaceOp: 'append' })
      return
    }
    if (usage.processedStops.has(reviewPoint)) return
    let identity = ''
    let request: JevRequest
    const result = await ctx.jev.judge({
      featureId: 'completion-check', agent, signal, link: { sessionId: agent.session.id, inputVersion: state.completionRequestId, stepId: reviewPoint },
      refresh: () => {
        identity = completionIdentity(agent)
        const input = completionReport(agent, state.completionRequestId, usage.used, config.maxSupplementRounds.get(), config.evidenceChars.get())
        if (input === undefined) throw new Error('Current turn changed during completion review')
        request = input
        return request
      },
      preflight: input => completionPreflight(input, config.evidenceChars.get()),
      failureDetail: failure => `本次完成核查未完成 / Completion review did not finish: ${failure.message}. 请调整配置后重试，或取消本次核查 / Retry with current input and settings, or cancel this review.`,
      interpret: response => completionVerdict(response, request) !== undefined ? { usable: true }
        : { usable: false, reason: '完成核查响应或材料引用无效 / Invalid completion assessment or material reference' },
      canAdopt: () => completionCurrent(agent, state, identity) || 'Current-turn requirements or execution changed',
    })
    if (result.kind !== 'ok') return
    const assessment = completionVerdict(result.response, request!)!
    if (!completionCurrent(agent, state, identity)) {
      await receipt(result.operationId, 'completion-stale', 'not-adopted', 'Current turn changed before action')
      return
```

</details>

**依据 3 · 源码核查**：[packages/jev/src/supervision.ts:274-293](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/supervision.ts#L274-L293)

停止判定与预留后注入

<details>
<summary>查看原文（20行）</summary>

```text
    const stop = async (reason: string) => {
      await receipt(result.operationId, 'completion-stopped', 'observed', JSON.stringify({ assessment: assessment.value, supplementsUsed: usage.used, endingReason: reason }))
      agent.session.append('user/message', notice(state, result.operationId, 'completion-stopped', 'Jev 停止自动补充 / No further automatic work: ' + assessment.reason + '\n' + reason), { surfaceOp: 'append' })
    }
    if (assessment.value === 'complete') {
      await receipt(result.operationId, 'completion-checked', 'observed', JSON.stringify({ assessment: 'complete', supplementsUsed: usage.used, endingReason: 'Report satisfies current-turn requirements; not independent verification' }))
      agent.session.append('user/message', notice(state, result.operationId, 'completion-checked', assessment.reason), { surfaceOp: 'append' })
      return
    }
    if (assessment.value === 'needs-user') { await stop('需要用户选择或授权 / User choice or authorization required'); return }
    if (usage.used >= config.maxSupplementRounds.get()) { await stop('自动补充额度耗尽 / Supplemental round limit reached'); return }
    await receipt(result.operationId, 'supplement-reserved', 'observed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement reserved before enqueue' }))
    if (!completionCurrent(agent, state, identity) || signal.aborted) {
      await receipt(result.operationId, 'supplement-stale', 'not-adopted', 'Requirements changed after reservation'); return
    }
    agent.steer(notice(state, result.operationId, 'supplement', 'Jev 按本轮报告请求补充 / Supplement the current-turn report: ' + assessment.reason
      + '\n仅处理最关键问题，在原授权内补做或更正报告；更新相关 Todo，保留失败、未完成和未验证事实，不重做无关完成项，不新增权限或编造结果 / Address this single issue within existing authorization, update the related Todo truthfully, preserve failures and unverified work, and do not redo unrelated completed work or invent results.'))
    await receipt(result.operationId, 'supplement-queued', 'executed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement queued in the same turn; report remains unchecked' })).catch(error => {
      ctx.logger.warn('Jev supplement is already queued; its action receipt remains unconfirmed: ' + String(error))
    })
```

</details>

#### 缺口

- 没有本轮中断与恢复实验
  **影响**：不能证明重启和异常组合全部正确
  **进一步探讨**：注入中断并对照 receipt 与主轮次数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 打开完成检查会不会替代宿主权限？

**研究主题**：缺陷与关键质疑

#### 完整回答

完成检查只在原轮次中投递补充提示，并明确不新增授权。单次提权是另外一个独立可选路径，要求 workspace-write 和 ask 模式，匹配活跃工具调用以及审批事件。模型答复肯定后仍要核对政策、任务和脚本快照，再回 allowed-once；非肯定会回退到宿主答复路径。它确实可能代替人给单次许可，指纹新鲜度不能证明模型选择合理，工具的结果也另行记录。

#### 证据与依据

**依据 1 · 源码核查**：[packages/jev/src/supervision.ts:283-291](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/supervision.ts#L283-L291)

补充保持原授权

```text
    if (assessment.value === 'needs-user') { await stop('需要用户选择或授权 / User choice or authorization required'); return }
    if (usage.used >= config.maxSupplementRounds.get()) { await stop('自动补充额度耗尽 / Supplemental round limit reached'); return }
    await receipt(result.operationId, 'supplement-reserved', 'observed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement reserved before enqueue' }))
    if (!completionCurrent(agent, state, identity) || signal.aborted) {
      await receipt(result.operationId, 'supplement-stale', 'not-adopted', 'Requirements changed after reservation'); return
    }
    agent.steer(notice(state, result.operationId, 'supplement', 'Jev 按本轮报告请求补充 / Supplement the current-turn report: ' + assessment.reason
      + '\n仅处理最关键问题，在原授权内补做或更正报告；更新相关 Todo，保留失败、未完成和未验证事实，不重做无关完成项，不新增权限或编造结果 / Address this single issue within existing authorization, update the related Todo truthfully, preserve failures and unverified work, and do not redo unrelated completed work or invent results.'))
    await receipt(result.operationId, 'supplement-queued', 'executed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement queued in the same turn; report remains unchecked' })).catch(error => {
```

**依据 2 · 源码核查**：[packages/jev/src/workspace-approval.ts:191-218](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/workspace-approval.ts#L191-L218)

门槛和原生调用匹配

<details>
<summary>查看原文（28行）</summary>

```text
  const eligible = (agent: Agent, signal?: AbortSignal): boolean => !stopped && !signal?.aborted
    && ctx.agents.get(agent.id) === agent
    && ctx.jev.isFeatureEnabled(FEATURE) && ctx.sandboxPolicy.resolve({ session: agent.session }).mode === 'workspace-write'
    && (ctx.approval.overrideOf(agent.session) ?? ctx.approval.config.policy ?? 'ask') === 'ask'
  const handoff = (req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>, leave: () => void, signal: AbortSignal): Promise<ApprovalOutcome> => {
    leave()
    if (stopped || signal.aborted || ctx.agents.get(req.agent.id) !== req.agent) return Promise.resolve('cancelled')
    if ((ctx.approval.overrideOf(req.agent.session) ?? ctx.approval.config.policy ?? 'ask') !== 'ask') return Promise.resolve('rejected')
    return next()
  }

  ctx.on('session/event', (session, event) => {
    if (event.type === 'approval/asked') {
      const matched: Entry[] = []
      for (const [agent, calls] of active) {
        if (agent.session !== session) continue
        for (const entry of event.data.callId === undefined ? [] : calls.get(event.data.callId) ?? []) {
          if (entry.exec.name === event.data.toolName
            && event.data.reason === `escalate sandbox to ${TARGET}: ${entry.args.justification}`) matched.push(entry)
        }
      }
      if (matched.length !== 1) return
      const entry = matched[0]!
      const ids = askedByEntry.get(entry) ?? new Set<ApprovalRequestId>()
      ids.add(event.data.id)
      askedByEntry.set(entry, ids)
      askedEntries.set(event.data.id, entry)
    } else if (event.type === 'approval/decided') {
```

</details>

**依据 3 · 源码核查**：[packages/jev/src/workspace-approval.ts:247-275](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/workspace-approval.ts#L247-L275)

判断及非肯定交还

<details>
<summary>查看原文（29行）</summary>

```text
  const answer = async (req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>, leave: () => void): Promise<ApprovalOutcome> => {
    const entries = req.callId === undefined ? undefined : active.get(req.agent)?.get(req.callId)
    if (entries?.size !== 1) { leave(); return next() }
    const entry = [...entries][0]!
    if (!matches(entry, req) || !eligible(req.agent, req.signal)) { leave(); return next() }
    const asked = askedByEntry.get(entry)
    if (asked?.size !== 1) { leave(); return next() }
    entry.claimed = true
    entry.approvalId = [...asked][0]!
    const cancellation = AbortSignal.any([entry.exec.signal, req.signal!, lifetime.signal])
    let basis: Snapshot | undefined
    let judged: Awaited<ReturnType<typeof ctx.jev.judge>>
    try {
      judged = await ctx.jev.judge({ featureId: FEATURE, agent: req.agent, signal: cancellation,
        link: { sessionId: req.agent.session.id, runId: String(entry.exec.callId), stepId: String(entry.exec.rootCallId) },
        refresh: async signal => { basis = await snapshot(ctx, fs, entry, req, () => epoch, () => config.maxScriptBytes.get(), signal); return basis.request },
        canAdopt: async (_response, signal) => {
          if (!eligible(req.agent, cancellation) || !entries.has(entry)) return 'Approval request is no longer current'
          const current = await snapshot(ctx, fs, entry, req, () => epoch, () => config.maxScriptBytes.get(), signal)
          return current.fingerprint === basis?.fingerprint ? true : 'Task, policy, operation, or script changed during judgment'
        },
      })
    } catch { return cancellation.aborted ? 'cancelled' : 'unavailable' }
    if (judged.kind === 'cancelled' || cancellation.aborted) return 'cancelled'
    if (judged.kind === 'not-adopted' || !eligible(req.agent, cancellation) || !entries.has(entry)) return handoff(req, next, leave, cancellation)
    const choice = decision(judged.response)
    if (choice !== 'approve') {
      await track(ctx.jev.writeReceipt(judged.operationId, { id: 'approval-routing', status: 'observed', reason: `${choice}: delegated to native answerer`, at: new Date().toISOString() })).catch(() => {})
      return handoff(req, next, leave, cancellation)
```

</details>

**依据 4 · 源码核查**：[packages/jev/src/workspace-approval.ts:277-314](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/workspace-approval.ts#L277-L314)

最终指纹和单次结果

<details>
<summary>查看原文（38行）</summary>

```text
    try {
      await track(ctx.jev.writeReceipt(judged.operationId, { id: 'approval-routing', status: 'observed', reason: 'Jev answered approve; final freshness check pending', at: new Date().toISOString() }))
    } catch { return handoff(req, next, leave, cancellation) }
    const finalHandoff = async (reason: string): Promise<ApprovalOutcome> => {
      await track(ctx.jev.writeReceipt(judged.operationId, { id: 'final-adoption', status: 'not-adopted', reason, at: new Date().toISOString() })).catch(() => {})
      return handoff(req, next, leave, cancellation)
    }
    if (!eligible(req.agent, cancellation) || !entries.has(entry)) return finalHandoff('Approval conditions changed before the final check')
    try {
      const final = await snapshot(ctx, fs, entry, req, () => epoch, () => config.maxScriptBytes.get(), cancellation)
      if (final.fingerprint !== basis?.fingerprint) return finalHandoff('Task, policy, operation, or script changed before grant')
    } catch { return finalHandoff('Final approval information could not be refreshed') }
    if (!eligible(req.agent, cancellation) || !entries.has(entry)) return finalHandoff('Approval conditions changed before grant')
    entry.approved = judged.operationId
    return 'allowed-once'
  }
  ctx.on('approval/request', (req, next) => {
    const owned = Promise.withResolvers<void>()
    decisions.add(owned.promise)
    let left = false
    const leave = () => { if (!left) { left = true; decisions.delete(owned.promise); owned.resolve() } }
    return answer(req, next, leave).finally(leave)
  }, { prepend: true })

  ctx.on('tools/result', (exec, result) => {
    const grant = approved.get(exec.token)
    if (grant === undefined) return
    approved.delete(exec.token)
    const { operationId } = grant
    if (grant.nativeOutcome !== 'allowed-once') {
      void track(ctx.jev.writeReceipt(operationId, { id: 'native-audit', status: 'not-adopted',
        reason: 'Native approval did not record an allowed-once outcome', at: new Date().toISOString() })).catch(() => {})
      return
    }
    void track((async () => {
      await ctx.jev.writeReceipt(operationId, { id: 'grant-issued', status: 'observed', reason: 'Jev allowed-once was issued to the native approval request', at: new Date().toISOString() })
      await ctx.jev.writeReceipt(operationId, { id: 'tool-result', status: result.isError ? 'execution-failed' : 'executed',
        reason: result.isError ? 'Native tool returned an error' : 'Native tool completed; see native result for operation outcome', at: new Date().toISOString() })
```

</details>

#### 缺口

- 未核查外部模型对恶意输入与敏感内容的判断
  **影响**：不能给出提权安全或正确率保证
  **进一步探讨**：用隔离工作区和无敏感命令检查权限路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪种评估最能隔离额外代价？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者列出具体宿主兼容范围，安装包和启用功能分开。若团队需要检查完成报告，可先在支持的 profile 只开完成检查，保持单次审批关闭，配置明确可用的判断端点。用可公开的任务文本和同一验收材料观察调用次数、补充次数、延迟及缺失原始材料的回退。当前轮用户要求、Todo 和最终答复作为判断材料，选择外部连接前要确认发送条件。结果不稳定时停用功能，回人工验收。当前成本和准确率不能从作者历史测试外推。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-27](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/README.md#L21-L27)

历史作者报告环境不同

```text
`main` supports Jev and Luna Decisions through OpenRouter or OpenAI, with three separate saved connections per profile. The [2026-10-07 public report](docs/testing/2026-10-07-luna-decisions/README.md) separates fixed protocol/installation checks, controlled live samples, and real DeepSeek Flash tasks. Official OpenAI calls succeeded in these limited samples; the only live OpenRouter diagnostic returned a provider-access HTTP 403 and was stopped. These results do not establish general judgment accuracy or stable task benefit.

The [2026-10-09–10 Harness compatibility report](docs/testing/2026-10-09-harness-compatibility/README.md) records the upgrade from DSH 0.1.7-rc.2 to 0.2.1-alpha.2, official installation and Web checks, and new real DeepSeek Flash / Jev tasks. The original package was rejected by the new installer's version checks; this revision updates the dependencies and affected public APIs. The report separates real tasks, seeded completion diagnostics, fixed lifecycle tests, and untested provider channels.

The [2026-10-11 version compatibility report](docs/testing/2026-10-11-harness-version-compatibility/README.md) checks the current plugin on four older DSH releases and 0.2.1-alpha.2. It records official installation, nine Host components, native tools and local deterministic judgment flows, plus browser checks on the oldest release, 0.2.0-rc.2 and 0.2.1-alpha.2. These checks establish version integration in the tested environment, not judgment-model quality.

The [2026-10-21 Harness compatibility report](docs/testing/2026-10-21-harness-compatibility/README.md) covers the DSH **0.2.1-rc.2** upgrade. This run checks the official package, Host components and Web integration with deterministic local model replies; no live model service is called. Earlier reports retain their original versions and experiment conditions.
```

**依据 2 · 作者声明**：[README.md:84-103](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/README.md#L84-L103)

兼容和功能独立开关

<details>
<summary>查看原文（20行）</summary>

````text
## Install through the Web UI (recommended)

The package declares `>=0.1.7-rc.1 <=0.2.0-rc.2 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-rc.2 || 0.2.1-rc.5 || 0.2.2-alpha.2`. The compatibility reports cover the eight earlier released runtimes, including 0.2.1-rc.2 and 0.2.1-rc.5. The exact 0.2.2-alpha.2 entry additionally permits the locally validated source Host; it does not make the unpatched published release capable of response interruption. Other versions, including 0.2.1-alpha.1, remain outside this declaration. Install directly from the GitHub repository URL. No source checkout, manual packaging, or npm login is required.

1. Open **Plugins in the sidebar → Add plugin**.
2. Paste the GitHub URL below into **Package name or address**, then click **Install**.
3. Click **Enable now** after installation. Restart the current profile only if DSH says it will load on the next start.
4. Select **View @dsh-jev/plugin** in the installed plugin list to open its Jev page. Configure the endpoint, model, and API key, then enable the individual features you need.

```text
https://github.com/luobosibing2/deepseek-harness-jev
```

![DSH Add plugin dialog with the deepseek-harness-jev GitHub repository URL entered](docs/images/install-from-github.jpg)

*Paste the repository URL into “Package name or address”, then click Install.*

**Enabling the package does not enable its 12 Jev features; they remain off by default.** Installation applies to the Host profile serving the current Web UI. The Host needs pnpm and access to GitHub. The repository includes the plugin entry and prebuilt files, so installation does not compile source on the user's machine or require an npm registry publication.

The GitHub entry provides the `main` features, not experimental branches. The older [v0.1.0 release](https://github.com/luobosibing2/deepseek-harness-jev/releases/tag/v0.1.0) does not include the newly integrated log filters. Build from source below only when changing or building the code yourself.
````

</details>

**依据 3 · 源码核查**：[packages/jev/src/completion-report.ts:32-54](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/completion-report.ts#L32-L54)

发送给判断层的字段

<details>
<summary>查看原文（23行）</summary>

```text
  const requirements = turn.flatMap(event => event.type === 'user/message' && event.data.source.kind === 'user'
    ? [{ id: event.data.id, content: event.data.content }] : [])
  const originalAvailable = start >= 0 && requirements.some(message => message.id === requestId)
  const final = turn.findLast(event => event.type === 'assistant/message')
  const finalText = final?.type === 'assistant/message'
    ? final.data.message.content.filter(block => block.type === 'text').map(block => block.text).join('\n') : ''
  const options = [
    ...requirements.map((message, index) => ({ id: `requirement-${index + 1}`, description: JSON.stringify(message.content) })),
    ...todo.data.todos.map((item, index) => ({ id: `todo-${index + 1}`, description: `[${item.status}] ${item.content}` })),
    { id: 'final-answer', description: finalText || '最终正文为空 / Empty final answer' },
    { id: 'overall', description: '整体材料 / The complete supplied material' },
    { id: 'none', description: '未发现问题 / No issue identified (complete only)' },
  ]
  const state: Json = {
    mode: 'completion', reviewPoint: String(final?.seq ?? todo.seq), evidenceScope: 'current turn requirements, latest Todo and latest final answer only',
    requirements: requirements.map(message => ({ id: message.id, content: JSON.parse(JSON.stringify(message.content)) as Json })),
    todos: todo.data.todos.map(item => ({ content: item.content, status: item.status })), finalAnswer: finalText,
    originalRequirementsAvailable: originalAvailable, supplementsUsed: supplements, maxSupplementRounds: maximum, evidenceCharacterBudget: budget,
    rules: 'Review the supplied report only. The original requirements and subsequent adjustments are in chronological order; later explicit adjustments apply. Todo may contain historical work, but it does not replace the current-turn user requirements. Do not infer an earlier task from a new request saying continue. Empty Todo and empty final text are valid material. Select only the single most important issue; this is not an exhaustive review. Do not infer actual tool execution or artifact correctness from self-reported completion. Tests need to pass only if the user required that condition: running and truthfully reporting failed tests can satisfy a run-and-report request; a fix-and-pass request remains unmet while those tests fail. Todo pending status alone does not establish failure. Supplements stay within existing authorization, including read-only restrictions, and must not redo unrelated completed work, fabricate results, or force completed status. Unknown calls for truthful supporting information or an explanation of what remains unverified. Plugin notices are neither new user requirements nor new authorization.',
  }
  return { state, questions: [
    { id: 'assessment', kind: 'choice', prompt: 'Assess the current-turn report using the supplied rules.', options: Object.entries(assessments).map(([id, description]) => ({ id, description })) },
    { id: 'focus', kind: 'choice', prompt: 'Choose the most important existing requirement, Todo entry, or final answer. Use overall for material-wide uncertainty; none is permitted only for complete.', options },
```

</details>

#### 缺口

- 未执行目标宿主和模型
  **影响**：不知道该环境的速度、费用和结果质量
  **进一步探讨**：在隔离 profile 做最小特性对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证完成报告更好是否意味着交付更好？

**研究主题**：新假设与验证

#### 完整回答

同一批有明确验收的合成任务分别运行关闭与开启完成复核的配置，用独立工件检查作盲评。加入一部分报告自述完成但工件实际缺失的样本，观察错误接受、补充轮次和延迟。报告输入能提示缺描述，却不足以查证伪造的成功，所以改进假设是减少遗漏而非证明正确。如果独立验收不提高或增加大量无效补充，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/jev/src/completion-report.ts:45-54](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/completion-report.ts#L45-L54)

材料范围和判断限制

<details>
<summary>查看原文（10行）</summary>

```text
  const state: Json = {
    mode: 'completion', reviewPoint: String(final?.seq ?? todo.seq), evidenceScope: 'current turn requirements, latest Todo and latest final answer only',
    requirements: requirements.map(message => ({ id: message.id, content: JSON.parse(JSON.stringify(message.content)) as Json })),
    todos: todo.data.todos.map(item => ({ content: item.content, status: item.status })), finalAnswer: finalText,
    originalRequirementsAvailable: originalAvailable, supplementsUsed: supplements, maxSupplementRounds: maximum, evidenceCharacterBudget: budget,
    rules: 'Review the supplied report only. The original requirements and subsequent adjustments are in chronological order; later explicit adjustments apply. Todo may contain historical work, but it does not replace the current-turn user requirements. Do not infer an earlier task from a new request saying continue. Empty Todo and empty final text are valid material. Select only the single most important issue; this is not an exhaustive review. Do not infer actual tool execution or artifact correctness from self-reported completion. Tests need to pass only if the user required that condition: running and truthfully reporting failed tests can satisfy a run-and-report request; a fix-and-pass request remains unmet while those tests fail. Todo pending status alone does not establish failure. Supplements stay within existing authorization, including read-only restrictions, and must not redo unrelated completed work, fabricate results, or force completed status. Unknown calls for truthful supporting information or an explanation of what remains unverified. Plugin notices are neither new user requirements nor new authorization.',
  }
  return { state, questions: [
    { id: 'assessment', kind: 'choice', prompt: 'Assess the current-turn report using the supplied rules.', options: Object.entries(assessments).map(([id, description]) => ({ id, description })) },
    { id: 'focus', kind: 'choice', prompt: 'Choose the most important existing requirement, Todo entry, or final answer. Use overall for material-wide uncertainty; none is permitted only for complete.', options },
```

</details>

**依据 2 · 源码核查**：[packages/jev/src/supervision.ts:278-291](https://github.com/luobosibing2/dsh-jev-plugin/blob/93ed43565cf6b01159dc7351865060012e7a1d97/packages/jev/src/supervision.ts#L278-L291)

报告达成与额外轮次分别记录

<details>
<summary>查看原文（14行）</summary>

```text
    if (assessment.value === 'complete') {
      await receipt(result.operationId, 'completion-checked', 'observed', JSON.stringify({ assessment: 'complete', supplementsUsed: usage.used, endingReason: 'Report satisfies current-turn requirements; not independent verification' }))
      agent.session.append('user/message', notice(state, result.operationId, 'completion-checked', assessment.reason), { surfaceOp: 'append' })
      return
    }
    if (assessment.value === 'needs-user') { await stop('需要用户选择或授权 / User choice or authorization required'); return }
    if (usage.used >= config.maxSupplementRounds.get()) { await stop('自动补充额度耗尽 / Supplemental round limit reached'); return }
    await receipt(result.operationId, 'supplement-reserved', 'observed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement reserved before enqueue' }))
    if (!completionCurrent(agent, state, identity) || signal.aborted) {
      await receipt(result.operationId, 'supplement-stale', 'not-adopted', 'Requirements changed after reservation'); return
    }
    agent.steer(notice(state, result.operationId, 'supplement', 'Jev 按本轮报告请求补充 / Supplement the current-turn report: ' + assessment.reason
      + '\n仅处理最关键问题，在原授权内补做或更正报告；更新相关 Todo，保留失败、未完成和未验证事实，不重做无关完成项，不新增权限或编造结果 / Address this single issue within existing authorization, update the related Todo truthfully, preserve failures and unverified work, and do not redo unrelated completed work or invent results.'))
    await receipt(result.operationId, 'supplement-queued', 'executed', JSON.stringify({ supplementsUsed: usage.used + 1, assessment: assessment.value, endingReason: 'Supplement queued in the same turn; report remains unchecked' })).catch(error => {
```

</details>

#### 缺口

- 没有独立工件对照
  **影响**：不能推断生产任务收益
  **进一步探讨**：固定预算和可执行验收做盲评

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
