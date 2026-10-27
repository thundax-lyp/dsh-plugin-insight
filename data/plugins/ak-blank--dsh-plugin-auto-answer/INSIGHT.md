# dsh-plugin-auto-answer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0147e9b](https://github.com/AK-blank/dsh-plugin-auto-answer/tree/0147e9b83cd100b4532024f8907799741ce87429)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：无人值守时为 DSH 用户问题设倒计时，超时由 Host 代选推荐项或默认项。

> **核心亮点**：在不改 Client 的 Host 插件中代理问答，并处理迟到拒绝、取消和重新 apply。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **风险与缺陷**：默认首项/空选项自动回答可能跨越真实用户决策边界，plan-review 保护只覆盖显式 intent；卡片状态可能滞后。详见[Q02](#research-q02)、[Q04](#research-q04)。

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
  - [Q01 · 无人值守时插件怎样代理用户问答，人在窗口内回答会怎样？](#detail-section-11)
  - [Q02 · 所谓“推荐答案”缺失时会自动作什么决定？](#detail-section-12)
  - [Q03 · 计时、取消、插件热重载是否避免竞态与悬挂？](#detail-section-13)
  - [Q04 · 自动应答后浏览器卡片状态会同步吗？](#detail-section-14)
  - [Q05 · 什么配置可避免把无人值守便利变成擅自批准？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长时 DSH 任务因 ask_user_question 无人回答而停住。

原始 ask_user_question 会等待 UI 或返回 pending；插件加计时自动应答。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 作用 | 边界 |
| --- | --- | --- |
| 事件监听 | 人答优先 | 宿主事件兼容 |
| 后台 | 超时选择 | 不等于用户授权 |

**流程与依赖**

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| user-questions/request | 问答代理 | 版本兼容 |
| 选项标签/intent | 自动选择 | 意图覆盖 |
| Client | 人答和卡片 | 无结算广播 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 分级 | 只放低影响问题 | 无审批选择 |
| 配置 | 禁首项/跳过默认 | 不擅自猜测 |
| 验证 | 人答/超时/取消/页面 | 状态一致 |

**效果与成本**

| 项目 | 代价/边界 |
| --- | --- |
| 等待 | 默认120秒/题 |
| 决策 | 无推荐取首项，自由文本跳过 |
| 页面 | 问题卡残留需人工清理 |

| 路径 | 源码状态 |
| --- | --- |
| 人答 | 原样透传 |
| 超时 | 自动选择 |
| 取消 | 不代答 |
| Client | 卡片可能残留 |

> **思考**：默认首项/空选项自动回答可能跨越真实用户决策边界，plan-review 保护只覆盖显式 intent；卡片状态可能滞后。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在不改 Client 的 Host 插件中代理问答，并处理迟到拒绝、取消和重新 apply。详见[Q01](#research-q01)、[Q03](#research-q03)。

在不改 Client 的 Host 插件中代理问答，并处理迟到拒绝、取消和重新 apply。详见[Q01](#research-q01)、[Q03](#research-q03)。

global/prepend 事件注册，Promise.race 处理下游/计时/abort/停机，Symbol 防重复监听。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认首项/空选项自动回答可能跨越真实用户决策边界，plan-review 保护只覆盖显式 intent；卡片状态可能滞后。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离低影响任务试用，配置 fallback:none/freeText:block/planReview:ignore，核 timed 工具窗口。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持计时代理，但默认无标记取首项、无选项跳过；仅 plan-review 默认不答，且 Client 卡片可能残留。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README.zh-CN、package 和 Host 源码；未执行 selftest 或 DSH。
- 下一步：固定 SHA 隔离 profile 覆盖人答、无提供者、取消、计划审批、普通高影响问题和卡片状态。

**分析版本**

- **仓库**：[AK-blank/dsh-plugin-auto-answer](https://github.com/AK-blank/dsh-plugin-auto-answer)
- **版本号**：1.0.0（[固定提交 0147e9b](https://github.com/AK-blank/dsh-plugin-auto-answer/tree/0147e9b83cd100b4532024f8907799741ce87429)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按 intent allowlist 自动回答且向 Client 广播结算，可降低擅自选择和残留卡片；尚未实现。详见[Q05](#research-q05)。

固定 SHA 隔离 profile 覆盖人答、无提供者、取消、计划审批、普通高影响问题和卡片状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 541 | 310 | 181 | — |
| .md | source | 2 | 335 | — | — | 3001 |
| .mjs | source | 1 | 743 | 591 | 79 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-auto-answer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-auto-answer/issues?q=is%3Aissue+created%3A2026-09-22T06%3A24%3A41.516Z..2026-10-22T06%3A24%3A41.516Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-auto-answer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A24%3A41.516Z..2026-10-22T06%3A24%3A41.516Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核自动回答的授权边界、竞态和浏览器状态。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 无人值守时插件怎样代理用户问答，人在窗口内回答会怎样？

**研究主题**：场景与需求、功能与机制

#### 完整回答

插件以 global/prepend 监听 user-questions/request waterfall，预先算整批答案，再让下游 UI 先处理；人的答案在120秒默认窗口内返回则原样透传。若无人回答、下游 NO_PROVIDER/传输失败或工具 ASK_TIMED_OUT，它在窗口截止时提交预先选项；取消轮次和 ASK_ABORTED 仍抛出，不自动回答。它不是读取用户偏好的自主决策器。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:31-48](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L31-L48)

作者流程说明。

<details>
<summary>查看原文（18行）</summary>

```text
## 它怎么工作

`ask_user_question` 以 `user-questions/request` waterfall 分发：浏览器 UI 用一张问题卡片来回答，
headless 运行则根本没人应答。

本插件**站在**这条链路**最前面**（`prepend`）并调用 `next()` —— 它是代理，不是否决：

| 情况 | 结果 |
|---|---|
| 人在窗口内回答 | 用人的答案，原样透传 |
| 到点没人回答 | 提交推荐选项 |
| 下一环直接失败（没有页面导致 `NO_PROVIDER`、传输中断） | 窗口继续跑，到点提交推荐选项 |
| 工具自己的 timed 窗口先到（`ASK_TIMED_OUT`） | 立刻提交推荐选项，而不是返回 `pending` |
| 本轮被取消（`ASK_ABORTED`、signal abort） | 原样抛出 —— 被取消的轮次绝不去答 |

监听用 `{ global: true, prepend: true }` 注册。`global` 不是可选项：Agent 事件按"监听器注册时
所在上下文的 scope"过滤，而通过插件管理器安装的插件是在某个 Agent 的 scope 里被 apply 的 ——
少了它，插件只会答安装它的那个会话。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:319-393](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L319-L393)

竞速、错误与取消分支。

<details>
<summary>查看原文（75行）</summary>

```text
  async function wait(request, next, plan) {
    const signal = request?.signal
    const identity = describeRequest(request)

    const entry = { stop: undefined }
    const stopped = new Promise((resolve) => {
      entry.stop = (reason) => resolve({ kind: 'stopped', reason })
    })
    pending.add(entry)

    let timer
    let removeAbort
    const timeout = new Promise((resolve) => {
      timer = setTimer(() => resolve({ kind: 'timeout' }), timeoutMs)
      timer?.unref?.()
    })
    const aborted = new Promise((resolve) => {
      if (signal === undefined) return
      if (signal.aborted) {
        resolve({ kind: 'aborted', reason: signal.reason })
        return
      }
      const listener = () => resolve({ kind: 'aborted', reason: signal.reason })
      signal.addEventListener('abort', listener, { once: true })
      removeAbort = () => signal.removeEventListener('abort', listener)
    })

    const delegated = delegate(next).then(
      (value) => ({ kind: 'answer', value }),
      (error) => ({ kind: 'error', error }),
    )

    try {
      let outcome = await Promise.race([delegated, timeout, aborted, stopped])

      if (outcome.kind === 'error') {
        const error = outcome.error
        const code = error?.code
        // A cancelled turn is not an unanswered question: never answer it.
        if (signal?.aborted || code === 'ASK_ABORTED') throw error

        emit({ event: 'delegate_error', ...identity, code, message: String(error?.message ?? error) })
        if (code === 'ASK_TIMED_OUT') {
          // The tool's own foreground window already elapsed (timed mode with a
          // Client attached). Submitting an answer beats returning `pending`.
          outcome = { kind: 'timeout', reason: 'tool-timeout' }
        } else {
          // `NO_PROVIDER` (no UI attached) or a transport failure: the question
          // is still askable, so keep the window running and answer it here.
          outcome = await Promise.race([timeout, aborted, stopped])
        }
      }

      if (outcome.kind === 'stopped') {
        throw outcome.reason ?? new Error('auto-answer: the plugin stopped while a question was pending')
      }
      if (outcome.kind === 'aborted') {
        throw outcome.reason ?? new Error('auto-answer: the question request was aborted')
      }
      if (outcome.kind === 'answer') {
        state.delegated += 1
        emit({ event: 'delegated', ...identity, outcome: 'answered-by-ui' })
        return outcome.value
      }

      state.answered += 1
      emit({
        event: 'answered',
        ...identity,
        reason: outcome.reason ?? 'window-elapsed',
        timeoutMs,
        picks: plan.answers.map((answer) => ({ id: answer.id, selected: answer.selected })),
      })
      logger?.debug?.(`[auto-answer] answered a pending question after ${config.timeoutSeconds}s`)
      return plan
```

</details>

**依据 3 · 源码核查**：[lib/index.js:494-516](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L494-L516)

全局前置事件注册。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config) {
  // A re-applied row (config edit, toggle) must not leave the previous listener
  // counting down beside this one.
  const previous = globalThis[ACTIVE]
  if (previous !== undefined) {
    try {
      previous.dispose()
    } catch {
      /* ignore */
    }
    delete globalThis[ACTIVE]
  }

  const logger = safeLogger(ctx)
  const runtime = createRuntime({ config, env: process.env, logger })
  const disposers = []

  if (runtime.config.enabled) {
    try {
      const dispose = ctx.on(QUESTION_EVENT, runtime.handler, { prepend: true, global: true })
      if (typeof dispose === 'function') disposers.push(dispose)
    } catch (error) {
      logger.warn(`could not subscribe ${QUESTION_EVENT}: ${error?.message ?? error}`)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 所谓“推荐答案”缺失时会自动作什么决定？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

标记只靠选项标签后缀匹配；多选时选所有标记。无标记时默认取第一项，无选项的自由文本问题默认提交空数组表示跳过；只对 intent.kind=plan-review 默认不自动答。这意味着其他高影响选择如果没有 plan-review 元数据，也可能被第一项自动提交；不能把“Recommended”或第一项视为用户授权。整批必须每题均可自动决定才提交。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:61-85](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L61-L85)

默认值与标记正则。

<details>
<summary>查看原文（25行）</summary>

```text
/** Defaults; a row's `config` overrides them through {@link normalizeConfig}. */
export const DEFAULTS = Object.freeze({
  /** Master switch. `false` also skips the listener registration. */
  enabled: true,
  /** How long the question stays open before the recommended option is chosen. */
  timeoutSeconds: 120,
  /** Option chosen when no option is marked recommended: `first` | `last` | `none`. */
  fallback: 'first',
  /** Question with no options at all: `skip` (submits an empty answer) | `block`. */
  freeText: 'skip',
  /** `plan-review` intent questions: `ignore` | `approve` | `decline`. */
  planReview: 'ignore',
})

const TIMEOUT_MIN_SECONDS = 5
const TIMEOUT_MAX_SECONDS = 86_400
const FALLBACK_VALUES = new Set(['first', 'last', 'none'])
const FREE_TEXT_VALUES = new Set(['skip', 'block'])
const PLAN_REVIEW_VALUES = new Set(['ignore', 'approve', 'decline'])

/**
 * The convention the tool description teaches the model: `Label (Recommended)`,
 * and the same marker in Chinese with either bracket width.
 */
const RECOMMENDED_SUFFIX = /\s*(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)\s*$/i
```

</details>

**依据 2 · 源码核查**：[lib/index.js:144-176](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L144-L176)

普通问题的推荐、首项与空选项分支。

<details>
<summary>查看原文（33行）</summary>

```text
export function decideQuestion(question, config) {
  if (question === null || typeof question !== 'object') return undefined
  const id = typeof question.id === 'string' ? question.id : undefined
  if (id === undefined) return undefined

  const options = Array.isArray(question.options)
    ? question.options.filter(
        (option) =>
          option !== null &&
          typeof option === 'object' &&
          typeof option.label === 'string' &&
          option.label !== '',
      )
    : []

  if (question.intent?.kind === 'plan-review') return decidePlanReview(id, question, options, config)

  if (options.length === 0) {
    // Nothing to choose. An empty `selected` is the protocol's "skipped" answer,
    // which is honest and unblocks the caller; `block` leaves it to a human.
    return config.freeText === 'skip' ? { id, selected: [] } : undefined
  }

  const marked = options.filter((option) => isRecommendedLabel(option.label))
  if (marked.length > 0) {
    const labels = question.multiSelect === true ? marked.map((option) => option.label) : [marked[0].label]
    return { id, selected: labels }
  }

  if (config.fallback === 'none') return undefined
  const pick = config.fallback === 'last' ? options[options.length - 1] : options[0]
  return { id, selected: [pick.label] }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:188-226](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L188-L226)

计划审批与整批全有或全无。

<details>
<summary>查看原文（39行）</summary>

```text
function decidePlanReview(id, question, options, config) {
  const mode = config.planReview
  if (mode === 'ignore' || options.length === 0) return undefined
  const approve = typeof question.intent?.approve === 'string' ? question.intent.approve : undefined

  if (mode === 'approve') {
    const match = options.find((option) => option.label === approve)
    return match === undefined ? undefined : { id, selected: [match.label] }
  }

  // `decline`: the first option that is not the declared approval. Without a
  // usable approve label every option could be the approval, so refuse.
  if (approve === undefined) return undefined
  const other = options.find((option) => option.label !== approve)
  return other === undefined ? undefined : { id, selected: [other.label] }
}

/**
 * Decide whether a whole request can be answered automatically.
 *
 * All or nothing: a request is answered only when every one of its questions
 * has a defensible pick. A partial batch would violate the answer contract
 * (one item per question) and hide a decision the human must make.
 *
 * @param request - the `user-questions/request` payload.
 * @param config - a normalized config.
 * @returns `{ answers }` to claim the request, or undefined to delegate only.
 */
export function planRequest(request, config) {
  const questions = Array.isArray(request?.questions) ? request.questions : []
  if (questions.length === 0) return undefined

  const answers = []
  for (const question of questions) {
    const answer = decideQuestion(question, config)
    if (answer === undefined) return undefined
    answers.push(answer)
  }
  return { answers }
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:50-62](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L50-L62)

作者使用说明。

<details>
<summary>查看原文（13行）</summary>

```text
## 什么算"推荐选项"

- 标签以 `(Recommended)`、`（推荐）`、`(推荐)`、`（Recommended）` 结尾，大小写不敏感；
  **不要求在第一项**。
- 标签原样提交：标记会留在答案里，因为它就是提问者给出的那个值。
- 多选问题：所有带标记的选项一起选。
- 没有任何标记时由 `fallback` 决定：`first`（默认）、`last`、`none`（永不自动回答，留给人）。
- 没有选项的问题无从选择：`freeText: skip` 提交空选择（协议里本来就有的"跳过"语义），
  `block` 则留给人类。
- `plan-review`（计划审批）**默认 ignore**：批准一个计划是有后果的决定。
  `planReview: approve` / `decline` 才是显式选择。
- 一批问题只有在**每一题**都能自动回答时才整批作答；答案契约要求一题一条，部分作答
  等于把真正需要人决定的题藏起来。
```

</details>

#### 缺口

- 未审所有宿主问题 intent 生产者。
  **影响**：高影响提问是否带 plan-review 不明。
  **进一步探讨**：抽样真实工具问题并核 intent/选项。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计时、取消、插件热重载是否避免竞态与悬挂？

**研究主题**：贡献与相对优势、工程质量与复用

#### 完整回答

delegate(next) 只调用一次并吞掉迟到拒绝的 unhandled rejection；wait 在 delegated、timeout、abort、dispose 间竞速，finally 清定时器与 abort listener。新 apply 通过全局 Symbol 停旧实例，防双监听。源码结构支持这些防护，README 称自检39项及真实20秒/人工24秒端到端，但本轮没有运行或复核测试。旧实例停止时待处理工具会失败，属有意的可用性代价。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:298-309](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L298-L309)

下游只调用一次并处理迟到拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
  const delegate = (next) => {
    let result
    try {
      result = next()
    } catch (error) {
      result = Promise.reject(error)
    }
    const promise = Promise.resolve(result)
    // The request may already have been answered by the countdown; a late
    // rejection from the UI chain must not become an unhandled rejection.
    promise.catch(() => {})
    return promise
```

</details>

**依据 2 · 源码核查**：[lib/index.js:319-403](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L319-L403)

竞速及清理。

<details>
<summary>查看原文（85行）</summary>

```text
  async function wait(request, next, plan) {
    const signal = request?.signal
    const identity = describeRequest(request)

    const entry = { stop: undefined }
    const stopped = new Promise((resolve) => {
      entry.stop = (reason) => resolve({ kind: 'stopped', reason })
    })
    pending.add(entry)

    let timer
    let removeAbort
    const timeout = new Promise((resolve) => {
      timer = setTimer(() => resolve({ kind: 'timeout' }), timeoutMs)
      timer?.unref?.()
    })
    const aborted = new Promise((resolve) => {
      if (signal === undefined) return
      if (signal.aborted) {
        resolve({ kind: 'aborted', reason: signal.reason })
        return
      }
      const listener = () => resolve({ kind: 'aborted', reason: signal.reason })
      signal.addEventListener('abort', listener, { once: true })
      removeAbort = () => signal.removeEventListener('abort', listener)
    })

    const delegated = delegate(next).then(
      (value) => ({ kind: 'answer', value }),
      (error) => ({ kind: 'error', error }),
    )

    try {
      let outcome = await Promise.race([delegated, timeout, aborted, stopped])

      if (outcome.kind === 'error') {
        const error = outcome.error
        const code = error?.code
        // A cancelled turn is not an unanswered question: never answer it.
        if (signal?.aborted || code === 'ASK_ABORTED') throw error

        emit({ event: 'delegate_error', ...identity, code, message: String(error?.message ?? error) })
        if (code === 'ASK_TIMED_OUT') {
          // The tool's own foreground window already elapsed (timed mode with a
          // Client attached). Submitting an answer beats returning `pending`.
          outcome = { kind: 'timeout', reason: 'tool-timeout' }
        } else {
          // `NO_PROVIDER` (no UI attached) or a transport failure: the question
          // is still askable, so keep the window running and answer it here.
          outcome = await Promise.race([timeout, aborted, stopped])
        }
      }

      if (outcome.kind === 'stopped') {
        throw outcome.reason ?? new Error('auto-answer: the plugin stopped while a question was pending')
      }
      if (outcome.kind === 'aborted') {
        throw outcome.reason ?? new Error('auto-answer: the question request was aborted')
      }
      if (outcome.kind === 'answer') {
        state.delegated += 1
        emit({ event: 'delegated', ...identity, outcome: 'answered-by-ui' })
        return outcome.value
      }

      state.answered += 1
      emit({
        event: 'answered',
        ...identity,
        reason: outcome.reason ?? 'window-elapsed',
        timeoutMs,
        picks: plan.answers.map((answer) => ({ id: answer.id, selected: answer.selected })),
      })
      logger?.debug?.(`[auto-answer] answered a pending question after ${config.timeoutSeconds}s`)
      return plan
    } catch (error) {
      state.failed += 1
      emit({ event: 'failed', ...identity, message: String(error?.message ?? error) })
      throw error
    } finally {
      if (timer !== undefined) clearTimer(timer)
      removeAbort?.()
      pending.delete(entry)
    }
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:440-455](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L440-L455)

dispose 停待处理。

<details>
<summary>查看原文（16行）</summary>

```text
  /** End every live wait; pending tool calls fail instead of hanging forever. */
  function dispose() {
    state.stopped = true
    const reason = new Error('auto-answer: the plugin stopped while a question was pending')
    for (const entry of [...pending]) {
      try {
        entry.stop?.(reason)
      } catch {
        /* ignore */
      }
    }
    pending.clear()
  }

  return { handler, state, config, timeoutMs, dispose }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:494-516](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L494-L516)

重启旧实例。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config) {
  // A re-applied row (config edit, toggle) must not leave the previous listener
  // counting down beside this one.
  const previous = globalThis[ACTIVE]
  if (previous !== undefined) {
    try {
      previous.dispose()
    } catch {
      /* ignore */
    }
    delete globalThis[ACTIVE]
  }

  const logger = safeLogger(ctx)
  const runtime = createRuntime({ config, env: process.env, logger })
  const disposers = []

  if (runtime.config.enabled) {
    try {
      const dispose = ctx.on(QUESTION_EVENT, runtime.handler, { prepend: true, global: true })
      if (typeof dispose === 'function') disposers.push(dispose)
    } catch (error) {
      logger.warn(`could not subscribe ${QUESTION_EVENT}: ${error?.message ?? error}`)
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:104-117](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L104-L117)

作者自述测试及端到端。

<details>
<summary>查看原文（14行）</summary>

```text
## 已验证的行为

离线自检（`node selftest.mjs`）—— 39 项：打包契约、配置归一化、推荐判定、注册参数、
计时竞态，以及"没有未处理拒绝 / 没有泄漏的定时器"。

真实安装路径：装进一个一次性 profile（`dsh plugin add`），在 `dsh --profile … --dump-config`
里确认了 bundle 层与插件行，并在 GUI「插件」页的「已安装」里看到「无人值守自动应答」。

真实端到端（默认阻塞式工具）：

- **无人值守**：20 秒窗口，问题一直没人答 —— 轨迹是 `armed` → **20.003 秒后** `answered`，
  选的是推荐项；整轮 22 秒结束，模型回复 *"你最终选择了蓝色（Recommended）。"*
- **有人在**：60 秒窗口，第 24 秒人工选了**非**推荐项 —— 轨迹是 `armed` → `delegated
  (answered-by-ui)`，整轮以 *"你最终选了香蕉。"* 结束，卡片正常收成 `1/1 已回答`。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动应答后浏览器卡片状态会同步吗？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

纯 Host 包无 Client 改动；作者明确说明宿主已返回答案、会话继续，但浏览器问题卡可能仍显示并占输入区、会话列表显示等待，需人工提交/跳过或刷新。源码注释也承认没有通知 Client 收卡的消息。对长期无人值守流程，后续人工回来可能看到误导 UI；真实状态应以会话/工具结果核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:9-13](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L9-L13)

纯 Host 与已知 UI 残留。

```text
纯 Host bundle：页面里没有任何渲染，没有浏览器半边，零依赖。

> **已知 UI 行为（设计如此，不是 bug）**：浏览器页面开着时，自动应答之后那张问题卡片会留在屏幕上，
> 直到你点「提交」/「跳过」或刷新页面。答案早已落库、这一轮也早已继续；详见下方
> *「自动答完后问题卡片还留在屏幕上 —— 这不是 bug」*。
```

**依据 2 · 作者声明**：[README.zh-CN.md:119-137](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L119-L137)

作者对卡片残留的详细说明。

<details>
<summary>查看原文（19行）</summary>

```text
## 自动答完后问题卡片还留在屏幕上 —— 这不是 bug

**这是设计内的预期行为，请不要为它开 issue。**

`ask_user_question` 是通过 waterfall 被应答的：浏览器那边的 Client 渲染出问题卡片、等人类提交，
宿主这边等的是"谁来接这个请求"。本插件是在**宿主侧**到点作答的，而宿主没有一条消息去通知 Client
"你的问题已经在别处被结掉了"。于是那张卡片会停在原地：

- 它留在对话记录里，仍然占着输入区；
- 会话列表可能还显示「等待回答」。

其余一切正常：`ask_user_question` 的结果里已经带着被选中的答案，这一轮照常继续、正常结束，
落库的会话数据是准确的 —— 那张滞留的卡片是**浏览器端的状态，不是会话状态**。

处理办法：点卡片上的「提交」或「跳过」，或者刷新页面。提交一张过期卡片是无害的：请求早就结掉了，
不会补注入一条迟到的答案，也不会报错（已实测）。刷新页面同时会让会话列表那一行恢复正常。

宿主侧插件没法自己收掉它：卡片属于 Client 自己的那次请求，只有 Client 能结算它。若要让它在
未来自动关闭，需要 Client 侧的改动。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:32-38](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L32-L38)

源码注释列出限制。

```text
 * - Claiming the request here does NOT close a question card the Client is
 *   already showing: the card belongs to the Client's own request, and the Host
 *   has no message that settles it. The card therefore stays on screen (and
 *   keeps the composer) until the page submits, skips, or reloads. That is
 *   expected behaviour — documented in the README as "not a bug" — because the
 *   tool result and the session data are already correct; only the browser
 *   keeps a card it was never told to drop.
```

**依据 4 · 源码核查**：[package.json:1-55](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/package.json#L1-L55)

包入口与依赖。

<details>
<summary>查看原文（55行）</summary>

```text
{
  "name": "dsh-plugin-auto-answer",
  "version": "1.0.0",
  "description": "Answers ask_user_question with the recommended option when nobody replies in time, so an unattended DSH session keeps working",
  "icon": "./icon.svg",
  "type": "module",
  "license": "MIT",
  "author": "AK-blank",
  "homepage": "https://github.com/AK-blank/dsh-plugin-auto-answer#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AK-blank/dsh-plugin-auto-answer.git"
  },
  "bugs": {
    "url": "https://github.com/AK-blank/dsh-plugin-auto-answer/issues"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg",
    "selftest.mjs",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "cordis-plugin",
    "host-plugin",
    "unattended",
    "auto-answer",
    "ask-user-question"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node selftest.mjs",
    "selftest": "node selftest.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

</details>

#### 缺口

- 未复现具体 DSH 页面。
  **影响**：卡片残留随 Client 版本可能变化。
  **进一步探讨**：隔离 Web 客户端做问答超时后检查。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么配置可避免把无人值守便利变成擅自批准？

**研究主题**：采用判断、新假设与验证

#### 完整回答

默认 enabled:true、120秒、fallback:first、freeText:skip；用于有外部后果的自动化时应至少设 fallback:none 与 freeText:block、保留 planReview:ignore，并确保高影响提问由调用方标记需人工决策。更稳妥的设计是按问题 intent 明确 allowlist 而非仅按标签决定，并向 Client 广播已结算；这两项只是改进设想。还要让 timeoutSeconds 小于 timed 工具超时，否则插件可能来不及作答。

fallback:none 只禁无标记首/末项，不会阻止带 Recommended 标签的普通问题被自动选择。若不能预先限定问题都是低影响，需禁用该插件或由调用方强制人工意图，不把这一组配置称为完全关闭自动批准。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:64-86](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L64-L86)

配置默认及 timed 约束。

<details>
<summary>查看原文（23行）</summary>

````text
## 配置

所有键都可省略，行的 `config` 覆盖默认值。

| 键 | 默认 | 含义 |
|---|---|---|
| `enabled` | `true` | 总开关；`false` 时连监听都不注册 |
| `timeoutSeconds` | `120` | 自动作答前的等待窗口（5 – 86400） |
| `fallback` | `first` | 没有标记时选 `first` \| `last` \| `none` |
| `freeText` | `skip` | 无选项的问题：`skip` \| `block` |
| `planReview` | `ignore` | 计划审批：`ignore` \| `approve` \| `decline` |

```yaml
# profile 的 cordis.patch.yml，位于所有 bundle 层之后
- id: auto-answer
  name: 'dsh-plugin-auto-answer'
  config:
    timeoutSeconds: 90
    fallback: first
```

**如果 `tool-ask-user` 跑在 timed 模式**：`timeoutSeconds` 必须小于工具的 `timeout`，
否则工具先返回 `pending`，本插件的答案就没机会生效。默认的阻塞式工具没有这个约束。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:61-73](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L61-L73)

实际默认值。

<details>
<summary>查看原文（13行）</summary>

```text
/** Defaults; a row's `config` overrides them through {@link normalizeConfig}. */
export const DEFAULTS = Object.freeze({
  /** Master switch. `false` also skips the listener registration. */
  enabled: true,
  /** How long the question stays open before the recommended option is chosen. */
  timeoutSeconds: 120,
  /** Option chosen when no option is marked recommended: `first` | `last` | `none`. */
  fallback: 'first',
  /** Question with no options at all: `skip` (submits an empty answer) | `block`. */
  freeText: 'skip',
  /** `plan-review` intent questions: `ignore` | `approve` | `decline`. */
  planReview: 'ignore',
})
```

</details>

**依据 3 · 源码核查**：[lib/index.js:159-175](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/lib/index.js#L159-L175)

普通问题选择规则。

<details>
<summary>查看原文（17行）</summary>

```text
  if (question.intent?.kind === 'plan-review') return decidePlanReview(id, question, options, config)

  if (options.length === 0) {
    // Nothing to choose. An empty `selected` is the protocol's "skipped" answer,
    // which is honest and unblocks the caller; `block` leaves it to a human.
    return config.freeText === 'skip' ? { id, selected: [] } : undefined
  }

  const marked = options.filter((option) => isRecommendedLabel(option.label))
  if (marked.length > 0) {
    const labels = question.multiSelect === true ? marked.map((option) => option.label) : [marked[0].label]
    return { id, selected: labels }
  }

  if (config.fallback === 'none') return undefined
  const pick = config.fallback === 'last' ? options[options.length - 1] : options[0]
  return { id, selected: [pick.label] }
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:119-137](https://github.com/AK-blank/dsh-plugin-auto-answer/blob/0147e9b83cd100b4532024f8907799741ce87429/README.zh-CN.md#L119-L137)

Client 收卡缺口。

<details>
<summary>查看原文（19行）</summary>

```text
## 自动答完后问题卡片还留在屏幕上 —— 这不是 bug

**这是设计内的预期行为，请不要为它开 issue。**

`ask_user_question` 是通过 waterfall 被应答的：浏览器那边的 Client 渲染出问题卡片、等人类提交，
宿主这边等的是"谁来接这个请求"。本插件是在**宿主侧**到点作答的，而宿主没有一条消息去通知 Client
"你的问题已经在别处被结掉了"。于是那张卡片会停在原地：

- 它留在对话记录里，仍然占着输入区；
- 会话列表可能还显示「等待回答」。

其余一切正常：`ask_user_question` 的结果里已经带着被选中的答案，这一轮照常继续、正常结束，
落库的会话数据是准确的 —— 那张滞留的卡片是**浏览器端的状态，不是会话状态**。

处理办法：点卡片上的「提交」或「跳过」，或者刷新页面。提交一张过期卡片是无害的：请求早就结掉了，
不会补注入一条迟到的答案，也不会报错（已实测）。刷新页面同时会让会话列表那一行恢复正常。

宿主侧插件没法自己收掉它：卡片属于 Client 自己的那次请求，只有 Client 能结算它。若要让它在
未来自动关闭，需要 Client 侧的改动。
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
