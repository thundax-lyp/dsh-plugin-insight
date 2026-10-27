# dsh-session-turn-eta

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b5cdc8e](https://github.com/778672151/dsh-session-turn-eta/tree/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/778672151/dsh-session-turn-eta)
<!-- END META -->

> **实现功能**：按会话步长历史估计回合剩余时间，在输入框下显示时间型进度和中断状态。

> **核心亮点**：可重放事件预测与输入框时间提示接合，改善等待可见性。详见[Q01](#research-q01)。

> **风险与缺陷**：finishing只是估计耗尽，事件空档/时钟/任务变化可偏差，interval未校准，全历史反复排序。详见[Q03](#research-q03)。

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
  - [Q01 · 进度条表达的是完成量还是时间猜测？](#detail-section-11)
  - [Q02 · 预测数学与事件来源具体是什么？](#detail-section-12)
  - [Q03 · 实时重锚、误差区间和长期负担有哪些限制？](#detail-section-13)
  - [Q04 · 工程证据和成本怎样判断？](#detail-section-14)
  - [Q05 · 适合采用吗，继续探讨什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长回合等待时了解估计耗时与运行状态。详见[Q01](#research-q01)。

spinner/最近时长估计，等待提示不改变任务执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| ETA projection | 历史估计 | 无精度保证 |
| 时间进度 | 等待可见 | 非工作完成比例 |
| 末尾状态 | 完成/中断 | 条满须看标签 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| sessionProjections/events | 历史折叠 | 依事件顺序/时间 |
| zod | state/view契约 | 运行依赖 |
| Web dock/locale | 展示 | 宿主ABI匹配 |
| 本地时钟 | 倒计时 | 服务时钟差偏移 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装匹配宿主 | 用户 | projection/slot可用 |
| 首回合积样本 | 系统 | 无数据不定 |
| 查看估计与活动 | 用户 | 不将百分比当交付 |
| 末尾看结果 | 用户 | 中断不同完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有宿主及zod依赖、历史重放；未见额外模型或远程请求 | 核对projection、dock与locale接口，理解ETA口径；耗时未知 | 宿主本身费用依环境，不能由无额外请求推为整套免费 |
| 持续使用 | 两路样本数组与排序、projection缓存、250ms UI更新及日志 | 复核跨任务预测偏差和长会话负担；频率未知 | 历史无窗口上限，CPU/内存增长没有量测 |
| 失败恢复 | 停用组件、必要时由宿主重建投影缓存的计算资源 | 区分任务失败与估计偏差，核对事件和缓存；工时未知 | 不改原会话日志；具体缓存管理依宿主，不承诺一键修复 |

#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 可视等待 | 估计时间/本地tick | 非真实完成量 |
| 避免活100% | clamp99/余量 | 可回退/Finishing久等 |
| 稳健历史 | P40/范围 | 非精度/覆盖率证明 |

> **思考**：finishing只是估计耗尽，事件空档/时钟/任务变化可偏差，interval未校准，全历史反复排序。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可重放事件预测与输入框时间提示接合，改善等待可见性。详见[Q01](#research-q01)。

可重放事件预测与输入框时间提示接合，改善等待可见性。详见[Q01](#research-q01)。

共享纯核心/严格projection与生产lib测试可复用，需真实回测和有界历史。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

finishing只是估计耗尽，事件空档/时钟/任务变化可偏差，interval未校准，全历史反复排序。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为等待提示试用，不据百分比承诺交付。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

预测/重锚/发布链可核，ETA非任务完成比例，未校准且全历史累积有长会话成本。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/eta.ts、src/predict.ts、src/projection.ts、src/client/index.ts、src/client/chat/TurnProgress.tsx、test/predict.mjs、test/smoke.mjs、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整预测/模型/projection/host入口和client组件，读生产predict/smoke测试及发布关键链，不运行目标。
- 下一步：固定时间切分回测与长工具/切模型/旧会话反例对照。

**分析版本**

- **仓库**：[778672151/dsh-session-turn-eta](https://github.com/778672151/dsh-session-turn-eta)
- **版本号**：0.2.0（[固定提交 b5cdc8e](https://github.com/778672151/dsh-session-turn-eta/tree/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究分组有界历史/删失信息和误差校准，对照错估与内存，尚未验证。详见[Q05](#research-q05)。

固定时间切分回测与长工具/切模型/旧会话反例对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 283 | — | — | 1713 |
| .js | source | 2 | 676 | 526 | 156 | — |
| .tsx | source | 1 | 148 | 92 | 43 | — |
| .ts | source | 8 | 895 | 633 | 202 | — |
| .mjs | test | 3 | 299 | 268 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+created%3A2026-09-22T07%3A23%3A41.551Z..2026-10-22T07%3A23%3A41.551Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A23%3A41.551Z..2026-10-22T07%3A23%3A41.551Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：回合ETA怎样从可重放事件估计，进度/剩余/完成保证如何区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 进度条表达的是完成量还是时间猜测？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向长回合等待的DSH Web用户，在输入框下显示估计剩余时间和百分比，帮助安排注意力。百分比按已过墙钟时间/预测总时长，不是任务清单完成比例，也不读取目标质量。正常turn/end完成才显示完成；失败/中断红色状态虽数值100，也标中断。超估计则保持运行最多99%并显示“即将完成”，这只是旧估计耗尽而非语义上已接近成功。

贡献是把可重放事件折叠、简单稳健预测和轻量展示接合，优于固定旋转图对等待的可见性；不能承诺真实剩余时长准确或任务加速。基线是无ETA/最近平均时长，预测价值须用实际回合误差和读者等待判断衡量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/README.md#L3-L13)

作者行为主张。

<details>
<summary>查看原文（11行）</summary>

```text
Live remaining-time prediction for the current DeepSeek Harness turn, shown as a
progress bar with a live percentage under the composer.

- **Running** — a bar whose width follows elapsed time over the predicted total,
  with a percentage and a humanised time left (`~12m 34s left` / `约剩 12 分 34 秒`).
  The percentage ticks locally while the turn is open.
- **Finishing** — once a turn outruns its own estimate the bar fills and pulses
  with a "finishing" label, instead of a misleading "0s left".
- **Completed** — 100%.
- **Failed or interrupted** — the bar turns red and reads "progress interrupted".

```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:43-67](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/client/chat/TurnProgress.tsx#L43-L67)

状态/百分比。

<details>
<summary>查看原文（25行）</summary>

```text
 * @returns undefined before the session's first turn.
 */
export function turnProgressStatus(eta: TurnEtaProjection): TurnProgressStatus | undefined {
  if (eta.open) return 'running'
  if (eta.completed === true) return 'completed'
  if (eta.completed === false) return 'failed'
  return undefined
}

/**
 * Percentage for the projected turn: elapsed over the predicted total while
 * open, the observed step fraction when no total is available, and 100 once
 * the turn reaches a terminal state.
 * @param eta - the current `turnEta` value.
 * @param now - the locally observed epoch ms used for the live tick.
 * @returns the percentage, or undefined when the projection carries no total.
 */
export function turnProgressPercent(eta: TurnEtaProjection, now: number): number | undefined {
  if (!eta.open) return eta.completed === undefined ? undefined : 100
  if (eta.predictedTotalMs !== undefined && eta.predictedTotalMs > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent((now - eta.startTime) / eta.predictedTotalMs * 100))
  }
  if (eta.expectedSteps !== undefined && eta.expectedSteps > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent(eta.completedSteps / eta.expectedSteps * 100))
  }
```

</details>

**依据 3 · 源码核查**：[src/client/chat/TurnProgress.tsx:98-121](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/client/chat/TurnProgress.tsx#L98-L121)

耗尽标签。

<details>
<summary>查看原文（24行）</summary>

```text
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [status])

  if (eta === undefined || status === undefined) return null
  const percent = status === 'running' ? turnProgressPercent(eta, now) : 100
  const remainingMs = status === 'running' && eta.predictedTotalMs !== undefined
    ? Math.max(0, eta.predictedTotalMs - Math.max(0, now - eta.startTime))
    : undefined
  // The published total never rises, so a turn that outlives its estimate keeps
  // a zero remainder. Report that as "finishing" rather than a misleading "0s left".
  const exhausted = status === 'running' && remainingMs === 0
  const label = status === 'completed'
    ? t('turnProgress.completed')
    : status === 'failed'
      ? t('turnProgress.failed')
      : exhausted
        ? t('turnProgress.finishing')
        : percent === undefined
          ? t('turnProgress.indeterminate')
          : t('turnProgress.running', { percent })
  const remaining = remainingMs === undefined || exhausted ? undefined : remainingLabel(t, remainingMs)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预测数学与事件来源具体是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host注册turnEta projection并另建TurnEtaModel监听session/event，发update/complete而不改session。模型首次observe按seq只重放当前事件之前历史，重放不发旧记录；按turn/start、step/start/end和turn/end计时，助手/工具事件只刷新预测。projection另用纯状态折叠供client，wire用WeakMap缓存同state引用，两路共享etaCore但不共享累积状态。

核心每次排序全部stepSamples取0.4分位数，不是README字面历史median；偶数步数median取上中位，不平均。将elapsed/completedSteps的live rate与一历史先验步混合，并限制到历史率0.25至4倍。总步数按已完成回合中至少当前长的条件上中位，超所有历史则加至少2步/25%余量，最初先验10步；无正的step样本时不预测，第一回合完成一步可借自身样本启动。失败/中断回合有完成步也进历史，无结果类型/模型/工具类别分层。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:52-75](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/index.ts#L52-L75)

双路注册与事件。

<details>
<summary>查看原文（24行）</summary>

```text
 * @param ctx - context whose session event feed is observed and registry receives the unit.
 */
export function apply(ctx: Context): void {
  ctx.sessionProjections.register(turnEtaProjectionDefinition)
  const model = new TurnEtaModel()
  ctx.on('session/event', (session, event) => {
    const emission = model.observe(session, event)
    if (emission.prediction !== undefined) {
      ctx.logger.debug(
        `turn-eta: session "${String(session.id)}" turn ${emission.prediction.turn} `
        + `${emission.prediction.method} remaining=${String(emission.prediction.remainingMs)}ms`,
      )
      ctx.emit('turn-eta/update', emission.prediction)
    }
    if (emission.record !== undefined) {
      ctx.logger.info(
        `turn-eta: session "${String(session.id)}" turn ${emission.record.turn} `
        + `duration=${emission.record.durationMs}ms steps=${emission.record.stepCount} `
        + `reason=${emission.record.reason} completed=${String(emission.record.completed)}`,
      )
      ctx.emit('turn-eta/complete', emission.record)
    }
  })
}
```

</details>

**依据 2 · 源码核查**：[src/eta.ts:57-70](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/eta.ts#L57-L70)

首次重放。

<details>
<summary>查看原文（14行）</summary>

```text
   * resumed session can predict from turns recorded before this model existed.
   * Seeding applies prior events for their state only; their predictions and
   * records are not re-emitted.
   * @param session - session that owns the event.
   * @param event - the appended event.
   * @returns the prediction and/or record this event produced.
   */
  observe(session: Session, event: SessionEvent): TurnEtaEmission {
    const state = this.state(session)
    if (!state.seeded) {
      state.seeded = true
      for (const prior of session.snapshotEvents()) {
        if (prior.seq >= event.seq) break
        this.apply(session, prior)
```

</details>

**依据 3 · 源码核查**：[src/eta.ts:85-144](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/eta.ts#L85-L144)

事件折叠。

<details>
<summary>查看原文（60行）</summary>

```text
    switch (event.type) {
      case 'turn/start': {
        const open: OpenTurn = {
          turn: event.data.turn,
          startTime: event.time,
          stepDurations: [],
          openStepStart: undefined,
          lastStep: 0,
          lastTotalMs: undefined,
        }
        state.open = open
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'step/start': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        open.openStepStart = event.time
        open.lastStep = event.data.step
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'step/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        if (open.openStepStart !== undefined) {
          const duration = Math.max(0, event.time - open.openStepStart)
          open.stepDurations.push(duration)
          state.stepSamples.push(duration)
        }
        open.openStepStart = undefined
        open.lastStep = event.data.step
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'assistant/message':
      case 'tool/call':
      case 'tool/result': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'turn/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        state.open = undefined
        const record: TurnEtaRecord = {
          sessionId: session.id,
          turn: open.turn,
          durationMs: Math.max(0, event.time - open.startTime),
          stepCount: open.stepDurations.length,
          completed: event.data.reason.kind === 'completed',
          reason: event.data.reason.kind,
        }
        // Anchor on how long turns run, whatever closed them: an aborted or
        // errored turn is still evidence of a turn's step count.
        if (record.stepCount >= 1) state.completedTurnSteps.push(record.stepCount)
        return { record }
      }
      default:
        return {}
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/predict.ts:48-118](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/predict.ts#L48-L118)

分位数与步数。

<details>
<summary>查看原文（71行）</summary>

```text
const HISTORY_PRIOR_STEPS = 1

/**
 * Percentile of the step-duration history used as the central per-step rate.
 * The distribution is right-skewed, so a lower quantile minimises relative error
 * and resists one very long step.
 */
const RATE_PERCENTILE = 0.4

/** Safe bound on the blended per-step estimate relative to the historical median. */
const RATE_FLOOR = 0.25
const RATE_CEILING = 4

/** Runway kept when the turn already outran every finished turn in the session. */
const OUTRUN_GROWTH = 0.25
const OUTRUN_MINIMUM = 2

/**
 * Expected step count assumed before the session has any finished turn, so the
 * very first turn still gets a live estimate instead of an endless indeterminate
 * bar. Every later turn replaces it with the session's own median.
 */
const BOOTSTRAP_EXPECTED_STEPS = 10

/** Median of a non-empty ascending numeric list, or undefined for an empty list. */
function median(values: readonly number[]): number | undefined {
  if (values.length === 0) return undefined
  return values[Math.floor(values.length / 2)] as number
}

/** Linear-interpolated quantile of an already ascending list. */
function quantile(sorted: readonly number[], fraction: number): number {
  if (sorted.length === 0) return 0
  if (sorted.length === 1) return sorted[0] as number
  const position = fraction * (sorted.length - 1)
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  if (lower === upper) return sorted[lower] as number
  const weight = position - lower
  return (sorted[lower] as number) * (1 - weight) + (sorted[upper] as number) * weight
}

/** Ascending copy of a numeric list. */
function ascending(values: readonly number[]): number[] {
  return [...values].sort((left, right) => left - right)
}

/**
 * Expected total step count for a turn that has already completed \`completedSteps\`.
 *
 * The anchor is the median of the completed turns that were at least this long:
 * a turn that has already outlived the typical turn is expected to outlive it
 * further, but no faster than the observed distribution suggests. When no
 * completed turn was this long, grow the observed count by a fixed runway.
 * @param completedTurnSteps - step counts of this session's completed turns.
 * @param completedSteps - steps completed in the open turn.
 * @returns the expected total step count, or undefined without history.
 */
function expectedTotalSteps(
  completedTurnSteps: readonly number[],
  completedSteps: number,
): number | undefined {
  const base = median(ascending(completedTurnSteps)) ?? BOOTSTRAP_EXPECTED_STEPS
  if (completedSteps <= 0) return base
  const longer = completedTurnSteps.filter((count) => count >= completedSteps)
  if (longer.length > 0) return Math.max(base, median(ascending(longer)) as number)
  return Math.max(base, completedSteps + Math.max(OUTRUN_MINIMUM, Math.ceil(completedSteps * OUTRUN_GROWTH)))
}

/**
 * Derive one remaining-time core from the open turn's facts.
```

</details>

**依据 5 · 源码核查**：[src/predict.ts:135-177](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/predict.ts#L135-L177)

混合/范围。

<details>
<summary>查看原文（43行）</summary>

```text
  const base: EtaCore = { elapsedMs, completedSteps, method: 'insufficient-data' }
  if (historyRate === undefined || historyRate <= 0) return base
  const expectedSteps = expectedTotalSteps(input.completedTurnSteps, completedSteps)
  if (expectedSteps === undefined || expectedSteps < 1) return base

  const currentRate = completedSteps >= 1 ? elapsedMs / completedSteps : undefined
  const blended = currentRate === undefined
    ? historyRate
    : (completedSteps * currentRate + HISTORY_PRIOR_STEPS * historyRate)
      / (completedSteps + HISTORY_PRIOR_STEPS)
  const meanStepMs = Math.min(
    Math.max(blended, RATE_FLOOR * historyRate),
    RATE_CEILING * historyRate,
  )
  const rawTotalMs = meanStepMs * expectedSteps
  const previousTotalMs = input.previousTotalMs
  let predictedTotalMs = previousTotalMs === undefined
    ? rawTotalMs
    : rawTotalMs > previousTotalMs && elapsedMs >= previousTotalMs
      ? rawTotalMs
      : Math.min(rawTotalMs, previousTotalMs)
  // Keep at least one step of runway while the turn is open, so the estimate
  // cannot report completion before the turn actually ends.
  if (predictedTotalMs <= elapsedMs) {
    predictedTotalMs = Math.max(rawTotalMs, elapsedMs + Math.max(meanStepMs, 1))
  }
  const remainingMs = Math.max(0, predictedTotalMs - elapsedMs)
  const lowRate = quantile(samples, 0.25)
  const highRate = quantile(samples, 0.75)
  const interval: TurnEtaInterval = {
    lowMs: Math.max(0, Math.min(lowRate * expectedSteps, predictedTotalMs) - elapsedMs),
    highMs: Math.max(0, highRate * expectedSteps - elapsedMs),
  }
  return {
    ...base,
    expectedSteps,
    meanStepMs,
    predictedTotalMs,
    remainingMs,
    interval,
    method: 'step-mean',
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实时重锚、误差区间和长期负担有哪些限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

总量未耗尽时可向下调整但不随新样本噪声向上；一旦event时已过估计才允许重锚，并至少留一步余量。无新事件的长工具调用期间host不更新，client250ms只按旧总量和本地Date.now倒计时，耗尽变finishing，待新事件可能退回更低百分比。这个行为避免活回合100%，不保证百分比单调或剩余时间校准；本地/服务器时钟差也可偏移显示。

interval只按历史步长25/75分位乘预期步数，并非统计覆盖率已校准的置信区间；当前UI不展示它。不同任务/模型/网络与中断混为同session历史可系统偏差，长工具首步未结束也没有新样本；没有任务特征或用户纠正机制。stepSamples/completedTurnSteps未设窗口上限，host模型和projection各保一份，etaCore在相关事件反复复制排序；projection还在更新和wire计算重复调用，长会话会增CPU/缓存成本。

只按事件契约折叠，未全局seq去重，依赖宿主事件有序一致；turn/end后open清空可防同一末尾再次记记录，但不等任意乱序/重复turn/start都有exactly-once保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/predict.ts:150-177](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/predict.ts#L150-L177)

重锚和区间。

<details>
<summary>查看原文（28行）</summary>

```text
  const previousTotalMs = input.previousTotalMs
  let predictedTotalMs = previousTotalMs === undefined
    ? rawTotalMs
    : rawTotalMs > previousTotalMs && elapsedMs >= previousTotalMs
      ? rawTotalMs
      : Math.min(rawTotalMs, previousTotalMs)
  // Keep at least one step of runway while the turn is open, so the estimate
  // cannot report completion before the turn actually ends.
  if (predictedTotalMs <= elapsedMs) {
    predictedTotalMs = Math.max(rawTotalMs, elapsedMs + Math.max(meanStepMs, 1))
  }
  const remainingMs = Math.max(0, predictedTotalMs - elapsedMs)
  const lowRate = quantile(samples, 0.25)
  const highRate = quantile(samples, 0.75)
  const interval: TurnEtaInterval = {
    lowMs: Math.max(0, Math.min(lowRate * expectedSteps, predictedTotalMs) - elapsedMs),
    highMs: Math.max(0, highRate * expectedSteps - elapsedMs),
  }
  return {
    ...base,
    expectedSteps,
    meanStepMs,
    predictedTotalMs,
    remainingMs,
    interval,
    method: 'step-mean',
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:94-121](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/client/chat/TurnProgress.tsx#L94-L121)

本地时钟/过期标签。

<details>
<summary>查看原文（28行）</summary>

```text
  const eta = useProjection('turnEta')
  const status = eta === undefined ? undefined : turnProgressStatus(eta)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [status])

  if (eta === undefined || status === undefined) return null
  const percent = status === 'running' ? turnProgressPercent(eta, now) : 100
  const remainingMs = status === 'running' && eta.predictedTotalMs !== undefined
    ? Math.max(0, eta.predictedTotalMs - Math.max(0, now - eta.startTime))
    : undefined
  // The published total never rises, so a turn that outlives its estimate keeps
  // a zero remainder. Report that as "finishing" rather than a misleading "0s left".
  const exhausted = status === 'running' && remainingMs === 0
  const label = status === 'completed'
    ? t('turnProgress.completed')
    : status === 'failed'
      ? t('turnProgress.failed')
      : exhausted
        ? t('turnProgress.finishing')
        : percent === undefined
          ? t('turnProgress.indeterminate')
          : t('turnProgress.running', { percent })
  const remaining = remainingMs === undefined || exhausted ? undefined : remainingLabel(t, remainingMs)
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:60-99](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/projection.ts#L60-L99)

两次core计算。

<details>
<summary>查看原文（40行）</summary>

```text

/**
 * Advance the open turn to \`asOf\` with a patch, refreshing the monotonic total
 * anchor so the next view reads the same total the estimator just published.
 */
function advanceOpen(
  state: TurnEtaState,
  open: OpenTurnState,
  asOf: number,
  patch: Partial<OpenTurnState>,
): OpenTurnState {
  const next: OpenTurnState = { ...open, ...patch, asOf }
  const core = etaCore({
    startTime: next.startTime,
    stepDurations: next.stepDurations,
    completedTurnSteps: state.completedTurnSteps,
    stepSamples: state.stepSamples,
    asOf,
    previousTotalMs: next.lastTotalMs,
  })
  if (core.predictedTotalMs === undefined) return next
  return { ...next, lastTotalMs: core.predictedTotalMs }
}

function computeView(state: TurnEtaState): TurnEtaProjection {
  const open = state.open
  if (open !== undefined) {
    const core = etaCore({
      startTime: open.startTime,
      stepDurations: open.stepDurations,
      completedTurnSteps: state.completedTurnSteps,
      stepSamples: state.stepSamples,
      asOf: open.asOf,
      previousTotalMs: open.lastTotalMs,
    })
    return { turn: open.turn, step: open.lastStep, open: true, startTime: open.startTime, ...core }
  }
  const last = state.last
  if (last !== undefined) {
    return {
```

</details>

**依据 4 · 源码核查**：[src/projection.ts:143-180](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/projection.ts#L143-L180)

数组累积。

<details>
<summary>查看原文（38行）</summary>

```text
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return state
        return { ...state, open: advanceOpen(state, open, event.time, { openStepStart: event.time, lastStep: event.data.step }) }
      }
      case 'step/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return state
        const stepDurations = open.openStepStart === undefined
          ? open.stepDurations
          : [...open.stepDurations, Math.max(0, event.time - open.openStepStart)]
        const stepSamples = open.openStepStart === undefined
          ? state.stepSamples
          : [...state.stepSamples, Math.max(0, event.time - open.openStepStart)]
        const next = { ...state, stepSamples }
        return { ...next, open: advanceOpen(next, open, event.time, { stepDurations, openStepStart: undefined, lastStep: event.data.step }) }
      }
      case 'assistant/message':
      case 'tool/call':
      case 'tool/result': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return state
        return { ...state, open: advanceOpen(state, open, event.time, { lastStep: event.data.step }) }
      }
      case 'turn/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return state
        const completed = event.data.reason.kind === 'completed'
        const stepCount = open.stepDurations.length
        return {
          // Anchor on how long turns run, whatever closed them.
          completedTurnSteps: stepCount >= 1
            ? [...state.completedTurnSteps, stepCount]
            : state.completedTurnSteps,
          stepSamples: state.stepSamples,
          last: {
            turn: open.turn,
            durationMs: Math.max(0, event.time - open.startTime),
            stepCount: open.stepDurations.length,
```

</details>

**依据 5 · 源码核查**：[src/eta.ts:108-143](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/eta.ts#L108-L143)

样本/末尾状态。

<details>
<summary>查看原文（36行）</summary>

```text
        if (open.openStepStart !== undefined) {
          const duration = Math.max(0, event.time - open.openStepStart)
          open.stepDurations.push(duration)
          state.stepSamples.push(duration)
        }
        open.openStepStart = undefined
        open.lastStep = event.data.step
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'assistant/message':
      case 'tool/call':
      case 'tool/result': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        return { prediction: this.predict(session, open, event.time) }
      }
      case 'turn/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return {}
        state.open = undefined
        const record: TurnEtaRecord = {
          sessionId: session.id,
          turn: open.turn,
          durationMs: Math.max(0, event.time - open.startTime),
          stepCount: open.stepDurations.length,
          completed: event.data.reason.kind === 'completed',
          reason: event.data.reason.kind,
        }
        // Anchor on how long turns run, whatever closed them: an aborted or
        // errored turn is still evidence of a turn's step count.
        if (record.stepCount >= 1) state.completedTurnSteps.push(record.stepCount)
        return { record }
      }
      default:
        return {}
    }
```

</details>

#### 缺口

- 真实不同任务/模型/中断分布上的ETA误差和interval覆盖率
  **影响**：不能将约剩时间或finishing当可靠调度承诺
  **进一步探讨**：固定历史按时间切分回测并分任务/模型/长工具分组，报告MAE/分位误差与覆盖率

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程证据和成本怎样判断？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

生产lib测试直接导入TurnEtaModel，以确定时间检查首轮无数据/一步bootstrap、中断历史、9小时离群值及长回合重锚；client smoke加载真实bundle但用简化React/slots和Date.now测试状态，不是真浏览器时序。核心共享、严格Zod state/view和projection状态版本2、wire引用缓存都是可复用工程细节。关键TS与发布lib中P40、重锚、样本累积和250ms/99%对照可查，本次不运行目标测试。

首次匹配sessionProjections、durable event与Web dock/locale ABI；package有zod运行依赖，作者称在0.1.5rc1核过但peer范围更宽不自动证明全部版本。持续本地折叠/排序、projection缓存、250ms渲染和日志，插件无额外LLM/网络调用；日志含session id、时长、步数/原因，非对话正文。失败恢复停用不改原session，缓存可由宿主重算；历史数组大或预测偏差需核缓存与重放成本，不应为UI估计误差改变真实会话数据。无量化性能/误差对照。

成本按阶段区分。首次需核projection、dock和locale接口并理解估计口径，既有宿主及依赖有资源负担，具体费用和工时未知。持续运行承担双路历史、重复排序、缓存、250ms渲染和日志，人工需复核任务变化后误差，未有增长量测。失败恢复由用户区分真实任务失败和估计不准，可停用并核查事件与宿主投影缓存；缓存重建资源和工时未知，插件不改原会话日志，也未提供可据此保证的一键修复。

#### 证据与依据

**依据 1 · 源码核查**：[test/predict.mjs:1-109](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/test/predict.mjs#L1-L109)

生产模型数学反例测试。

<details>
<summary>查看原文（109行）</summary>

```text
// Host-side invariants for the turn-eta estimator, driven through the built
// event-emitting model (which shares etaCore with the projection fold).
import assert from 'node:assert/strict'
import { TurnEtaModel } from '../lib/index.js'

let failures = 0
const check = (name, fn) => {
  try { fn(); console.log('PASS ' + name) }
  catch (e) { failures++; console.log('FAIL ' + name + ' :: ' + e.message) }
}

const session = () => ({ id: 's', snapshotEvents: () => [] })
let seq = 0
const ev = (type, time, data) => ({ type, time, data, seq: seq++ })

function completedTurn(model, sess, turn, start, durations, reason = 'completed') {
  let t = start
  model.apply(sess, ev('turn/start', t, { turn }))
  for (let i = 0; i < durations.length; i++) {
    model.apply(sess, ev('step/start', t, { turn, step: i + 1 }))
    t += durations[i]
    model.apply(sess, ev('step/end', t, { turn, step: i + 1 }))
  }
  model.apply(sess, ev('turn/end', t, { turn, reason: { kind: reason } }))
  return t
}

check('insufficient data before any rate sample exists', () => {
  const m = new TurnEtaModel(); const s = session()
  const r = m.apply(s, ev('turn/start', 0, { turn: 1 }))
  assert.equal(r.prediction.method, 'insufficient-data')
  assert.equal(r.prediction.predictedTotalMs, undefined)
})

check('the first turn gets a bootstrap estimate once it has a step', () => {
  const m = new TurnEtaModel(); const s = session()
  m.apply(s, ev('turn/start', 0, { turn: 1 }))
  m.apply(s, ev('step/start', 0, { turn: 1, step: 1 }))
  const r = m.apply(s, ev('step/end', 5000, { turn: 1, step: 1 })).prediction
  assert.equal(r.method, 'step-mean')
  assert.ok(r.predictedTotalMs > 0, 'expected a bootstrap total, got ' + r.predictedTotalMs)
  assert.ok(r.expectedSteps >= 10, 'expected the bootstrap step count, got ' + r.expectedSteps)
})

check('a non-completed turn still anchors the next turn', () => {
  const m = new TurnEtaModel(); const s = session()
  const start2 = completedTurn(m, s, 1, 0, [1000, 1000, 1000], 'aborted')
  const r = m.apply(s, ev('turn/start', start2, { turn: 2 })).prediction
  assert.equal(r.method, 'step-mean')
  assert.equal(r.expectedSteps, 3)
})

check('predicts a total from history once a turn completed', () => {
  const m = new TurnEtaModel(); const s = session()
  const end = completedTurn(m, s, 1, 0, [1000, 1000, 1000, 1000, 1000])
  const r = m.apply(s, ev('turn/start', end, { turn: 2 }))
  assert.equal(r.prediction.method, 'step-mean')
  assert.equal(r.prediction.expectedSteps, 5)
  assert.ok(r.prediction.predictedTotalMs >= 4000 && r.prediction.predictedTotalMs <= 6000, 'total ~5000, got ' + r.prediction.predictedTotalMs)
})

check('a 9-hour outlier step does not blow up the estimate', () => {
  const m = new TurnEtaModel(); const s = session()
  let t = completedTurn(m, s, 1, 0, [1000, 1000, 1000, 1000, 1000])
  t = completedTurn(m, s, 2, t, [32_000_000])
  const r = m.apply(s, ev('turn/start', t, { turn: 3 }))
  assert.ok(r.prediction.predictedTotalMs < 100_000, 'expected a robust total, got ' + r.prediction.predictedTotalMs)
})

check('re-anchors instead of saturating on a long turn', () => {
  const m = new TurnEtaModel(); const s = session()
  const start2 = completedTurn(m, s, 1, 0, [2000, 2000, 2000])
  let t = start2
  m.apply(s, ev('turn/start', t, { turn: 2 }))
  let prevTotal
  let reAnchors = 0
  let lastRemaining = 0
  for (let i = 0; i < 15; i++) {
    m.apply(s, ev('step/start', t, { turn: 2, step: i + 1 }))
    t += 1000
    const p = m.apply(s, ev('step/end', t, { turn: 2, step: i + 1 })).prediction
    if (prevTotal !== undefined && p.predictedTotalMs > prevTotal) reAnchors++
    prevTotal = p.predictedTotalMs
    lastRemaining = p.remainingMs
    // The bar must never be able to show completion while the turn is open.
    assert.ok(p.remainingMs > 0, 'remaining must stay positive at step ' + (i + 1) + ', got ' + p.remainingMs)
    assert.ok(p.predictedTotalMs > t - start2, 'the total must cover the elapsed time at step ' + (i + 1))
  }
  assert.ok(reAnchors > 0, 'expected at least one re-anchor on a turn past history')
  assert.ok(lastRemaining > 0, 'the estimate should stay live, got remaining ' + lastRemaining)
})

check('the expected step count grows once the turn outlives history', () => {
  const m = new TurnEtaModel(); const s = session()
  const start2 = completedTurn(m, s, 1, 0, [1000, 1000, 1000])
  let t = start2
  m.apply(s, ev('turn/start', t, { turn: 2 }))
  let atSix = 0
  for (let i = 0; i < 6; i++) {
    m.apply(s, ev('step/start', t, { turn: 2, step: i + 1 }))
    t += 1000
    const p = m.apply(s, ev('step/end', t, { turn: 2, step: i + 1 })).prediction
    if (i === 5) atSix = p.expectedSteps
  }
  assert.ok(atSix > 3, 'expected the anchor to grow past history, got ' + atSix)
})

console.log(failures === 0 ? 'ALL PASS' : failures + ' FAILED')
process.exit(failures === 0 ? 0 : 1)
```

</details>

**依据 2 · 源码核查**：[test/smoke.mjs:1-124](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/test/smoke.mjs#L1-L124)

真实bundle与假React状态。

<details>
<summary>查看原文（124行）</summary>

```text
// Smoke test for the built plugin: loads lib/index.js and lib/client.js and
// asserts registration + rendered progress states. No browser required.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import assert from 'node:assert/strict'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0
const check = (name, fn) => {
  try { fn(); console.log('PASS ' + name) }
  catch (e) { failures++; console.log('FAIL ' + name + ' :: ' + e.message) }
}

const host = await import('file://' + join(root, 'lib/index.js'))
check('host exports name/inject/apply', () => {
  assert.equal(host.name, 'session-turn-eta')
  assert.deepEqual(host.inject, ['sessionProjections'])
  assert.equal(typeof host.apply, 'function')
  assert.equal(typeof host.TurnEtaModel, 'function')
})

const code = readFileSync(join(root, 'lib/client.js'), 'utf8')
let captured
new Function('window', code)({ __ModuleLoader__: { load: (m) => { captured = m } } })
check('client bundle registers under its id', () => {
  assert.ok(captured, 'window.__ModuleLoader__.load was not called')
  assert.equal(captured.id, '@dsh-external/dsh-session-turn-eta')
  assert.equal(typeof captured.factory, 'function')
})

const element = (type, props) => ({ type, props: props || {} })
const react = {
  memo: (f) => f,
  createElement: (type, props, ...children) => element(type, {
    ...(props || {}),
    children: children.length === 0 ? (props && props.children) : (children.length === 1 ? children[0] : children),
  }),
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  Fragment: Symbol('Fragment'),
}
const jsxRuntime = {
  jsx: (type, props) => element(type, props),
  jsxs: (type, props) => element(type, props),
  Fragment: react.Fragment,
}
const req = (id) => {
  if (id === 'react') return react
  if (id === 'react/jsx-runtime') return jsxRuntime
  throw new Error('unexpected require: ' + id)
}
const mod = captured.factory(req)
check('client exports apply/inject', () => {
  assert.equal(typeof mod.apply, 'function')
  assert.deepEqual(mod.inject, ['slots', 'locale'])
})

const registered = []
const localeCalls = []
const ctx = {
  effect: (fn, label) => { fn(); return label },
  locale: { register: (ns, d) => { localeCalls.push(ns); return d } },
  slots: { inject: (n, fn) => fn(), register: (o, c) => { registered.push({ o, c }); return () => {} } },
}
check('apply registers a conversation.composer.dock entry', () => {
  mod.apply(ctx)
  assert.equal(registered.length, 1)
  assert.equal(registered[0].o.name, 'conversation.composer.dock')
  assert.equal(registered[0].o.id, 'dsh-session-turn-eta')
  assert.equal(registered[0].o.order, -1)
  assert.equal(registered[0].o.locale, 'dsh-session-turn-eta')
  assert.ok(localeCalls.includes('dsh-session-turn-eta'), 'locale namespace not registered')
})

const Comp = registered[0].c
const t = (k, p) => k + (p ? JSON.stringify(p) : '')
const render = (eta) => Comp({ useProjection: () => eta, t })
const find = (node, pred) => {
  if (node === null || node === undefined || typeof node !== 'object') return null
  if (pred(node)) return node
  const kids = node.props ? node.props.children : node.children
  const list = Array.isArray(kids) ? kids : (kids === undefined ? [] : [kids])
  for (const c of list) { const hit = find(c, pred); if (hit) return hit }
  return null
}
const bar = (node) => find(node, (n) => n.props && n.props.role === 'progressbar')

check('no projection -> renders nothing', () => { assert.equal(render(undefined), null) })
check('running -> bar ~50%', () => {
  const now = Date.now()
  const tree = render({ open: true, startTime: now - 50000, completedSteps: 2, predictedTotalMs: 100000 })
  assert.ok(tree && tree.props['data-turn-progress'], 'no progress root')
  assert.equal(tree.props['data-status'], 'running')
  const b = bar(tree)
  const v = Number(b.props['aria-valuenow'])
  assert.ok(v >= 49 && v <= 51, 'expected ~50, got ' + v)
  assert.ok(String(b.props['aria-valuetext']).includes('turnProgress.etaSeconds'), 'missing eta text')
})
check('completed -> 100%', () => {
  const tree = render({ open: false, startTime: 0, completedSteps: 3, completed: true })
  assert.equal(tree.props['data-status'], 'completed')
  assert.equal(bar(tree).props['aria-valuenow'], 100)
})
check('failed -> interrupted status', () => {
  const tree = render({ open: false, startTime: 0, completedSteps: 3, completed: false })
  assert.equal(tree.props['data-status'], 'failed')
  assert.equal(bar(tree).props['aria-valuenow'], 100)
})
check('running past its total never reports 100', () => {
  const now = Date.now()
  const tree = render({ open: true, startTime: now - 200000, completedSteps: 5, predictedTotalMs: 100000 })
  assert.equal(tree.props['data-status'], 'running')
  const v = Number(bar(tree).props['aria-valuenow'])
  assert.ok(v <= 99, 'an open turn must never reach 100, got ' + v)
})
check('running without a total -> indeterminate', () => {
  const tree = render({ open: true, startTime: Date.now(), completedSteps: 1 })
  assert.equal(tree.props['data-status'], 'running')
  assert.equal(bar(tree).props['aria-valuenow'], undefined)
})

console.log(failures === 0 ? 'ALL PASS' : failures + ' FAILED')
process.exit(failures === 0 ? 0 : 1)
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:15-53](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/projection.ts#L15-L53)

严格schema。

<details>
<summary>查看原文（39行）</summary>

```text
const openTurnSchema = z.object({
  turn: z.number().int().nonnegative(),
  startTime: z.number().nonnegative(),
  asOf: z.number().nonnegative(),
  stepDurations: z.array(z.number().nonnegative()),
  openStepStart: z.number().nonnegative().optional(),
  lastStep: z.number().int().nonnegative(),
  lastTotalMs: z.number().nonnegative().optional(),
}).strict()

const stateSchema: z.ZodType<TurnEtaState> = z.object({
  open: openTurnSchema.optional(),
  completedTurnSteps: z.array(z.number().int().nonnegative()),
  stepSamples: z.array(z.number().nonnegative()),
  last: z.object({
    turn: z.number().int().nonnegative(),
    durationMs: z.number().nonnegative(),
    stepCount: z.number().int().nonnegative(),
    completed: z.boolean(),
    reason: z.string(),
  }).strict().optional(),
}).strict()

const viewSchema: z.ZodType<TurnEtaProjection> = z.object({
  turn: z.number().int().nonnegative(),
  step: z.number().int().nonnegative(),
  open: z.boolean(),
  startTime: z.number().nonnegative(),
  elapsedMs: z.number().nonnegative(),
  completedSteps: z.number().int().nonnegative(),
  expectedSteps: z.number().nonnegative().optional(),
  meanStepMs: z.number().nonnegative().optional(),
  predictedTotalMs: z.number().nonnegative().optional(),
  remainingMs: z.number().nonnegative().optional(),
  interval: z.object({ lowMs: z.number().nonnegative(), highMs: z.number().nonnegative() }).strict().optional(),
  method: z.enum(['step-mean', 'insufficient-data']),
  completed: z.boolean().optional(),
  reason: z.string().optional(),
  durationMs: z.number().nonnegative().optional(),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:75-110](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/lib/index.js#L75-L110)

发布数学链。

<details>
<summary>查看原文（36行）</summary>

```text
	const completedSteps = input.stepDurations.length;
	const elapsedMs = Math.max(0, input.asOf - input.startTime);
	const samples = ascending(input.stepSamples);
	const historyRate = samples.length === 0 ? void 0 : quantile(samples, RATE_PERCENTILE);
	const base = {
		elapsedMs,
		completedSteps,
		method: "insufficient-data"
	};
	if (historyRate === void 0 || historyRate <= 0) return base;
	const expectedSteps = expectedTotalSteps(input.completedTurnSteps, completedSteps);
	if (expectedSteps === void 0 || expectedSteps < 1) return base;
	const currentRate = completedSteps >= 1 ? elapsedMs / completedSteps : void 0;
	const blended = currentRate === void 0 ? historyRate : (completedSteps * currentRate + HISTORY_PRIOR_STEPS * historyRate) / (completedSteps + HISTORY_PRIOR_STEPS);
	const meanStepMs = Math.min(Math.max(blended, RATE_FLOOR * historyRate), RATE_CEILING * historyRate);
	const rawTotalMs = meanStepMs * expectedSteps;
	const previousTotalMs = input.previousTotalMs;
	let predictedTotalMs = previousTotalMs === void 0 ? rawTotalMs : rawTotalMs > previousTotalMs && elapsedMs >= previousTotalMs ? rawTotalMs : Math.min(rawTotalMs, previousTotalMs);
	if (predictedTotalMs <= elapsedMs) predictedTotalMs = Math.max(rawTotalMs, elapsedMs + Math.max(meanStepMs, 1));
	const remainingMs = Math.max(0, predictedTotalMs - elapsedMs);
	const lowRate = quantile(samples, .25);
	const highRate = quantile(samples, .75);
	const interval = {
		lowMs: Math.max(0, Math.min(lowRate * expectedSteps, predictedTotalMs) - elapsedMs),
		highMs: Math.max(0, highRate * expectedSteps - elapsedMs)
	};
	return {
		...base,
		expectedSteps,
		meanStepMs,
		predictedTotalMs,
		remainingMs,
		interval,
		method: "step-mean"
	};
}
```

</details>

**依据 5 · 源码核查**：[lib/client.js:33-35](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/lib/client.js#L33-L35)

发布tick/clamp。

```text
		const TICK_MS = 250;
		/** Ceiling for an open turn, so the bar never claims completion before the turn ends. */
		const MAX_OPEN_PERCENT = 99;
```

**依据 6 · 源码核查**：[package.json:21-32](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/package.json#L21-L32)

peer/zod。

<details>
<summary>查看原文（12行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.0-rc <5",
    "@deepseek-ai/dsh-session": ">=0.0.1-rc <2",
    "@deepseek-ai/dsh-session-projection": ">=0.0.1-rc <2"
  },
  "dependencies": {
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "tsdown": "^0.22.14",
    "typescript": "^5.9.0"
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合采用吗，继续探讨什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

想改善等待可见性的匹配宿主用户可试用，把ETA当提示，不拿99%/即将完成承诺交付时间；长调用看真实活动/工具状态，失败标签优先于条满。首回合无数据显示不定是诚实边界，连续换任务/模型后应预期历史偏差，巨大老session留意排序/投影负担。

继续可研究有界/衰减分组历史和长工具“尚未完成”的删失信息，时间基准校正与明确“估计已超时”文案；把数学区间经过回测校准再展示。基线为当前全历史P40+条件步数，最小反例包括短任务转长任务、换慢模型、被中断短回合、一个长首步、无事件长等待、时钟差和百万步历史。对照最后一轮/稳健分组/本方法的误差、Finishing提前量、UI回退次数和耗时内存，方向未验证。

这是假设而非插件已实现收益。推导来自Q02的同会话混合历史和Q03无界数组、长工具无新事件两个反例，将历史按模型/任务分组并设有界衰减可能兼顾漂移适应与资源上限；但分组会稀疏，删失信息依可靠事件和时间基准，还需额外维护与校准。可支持的判据是在同一固定日志时间切分上，预先声明的分组策略降低MAE和长尾误差、减少提前finishing，且内存有界；若冷启动分组误差增大、覆盖率仍不校准或吞吐负担抵消收益，则推翻该组合优势。比较时保持日志和评价窗口一致，不能因百分比更平滑就认定预测更准。

#### 证据与依据

**依据 1 · 源码核查**：[src/predict.ts:48-118](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/predict.ts#L48-L118)

全历史分位/步数基线。

<details>
<summary>查看原文（71行）</summary>

```text
const HISTORY_PRIOR_STEPS = 1

/**
 * Percentile of the step-duration history used as the central per-step rate.
 * The distribution is right-skewed, so a lower quantile minimises relative error
 * and resists one very long step.
 */
const RATE_PERCENTILE = 0.4

/** Safe bound on the blended per-step estimate relative to the historical median. */
const RATE_FLOOR = 0.25
const RATE_CEILING = 4

/** Runway kept when the turn already outran every finished turn in the session. */
const OUTRUN_GROWTH = 0.25
const OUTRUN_MINIMUM = 2

/**
 * Expected step count assumed before the session has any finished turn, so the
 * very first turn still gets a live estimate instead of an endless indeterminate
 * bar. Every later turn replaces it with the session's own median.
 */
const BOOTSTRAP_EXPECTED_STEPS = 10

/** Median of a non-empty ascending numeric list, or undefined for an empty list. */
function median(values: readonly number[]): number | undefined {
  if (values.length === 0) return undefined
  return values[Math.floor(values.length / 2)] as number
}

/** Linear-interpolated quantile of an already ascending list. */
function quantile(sorted: readonly number[], fraction: number): number {
  if (sorted.length === 0) return 0
  if (sorted.length === 1) return sorted[0] as number
  const position = fraction * (sorted.length - 1)
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  if (lower === upper) return sorted[lower] as number
  const weight = position - lower
  return (sorted[lower] as number) * (1 - weight) + (sorted[upper] as number) * weight
}

/** Ascending copy of a numeric list. */
function ascending(values: readonly number[]): number[] {
  return [...values].sort((left, right) => left - right)
}

/**
 * Expected total step count for a turn that has already completed \`completedSteps\`.
 *
 * The anchor is the median of the completed turns that were at least this long:
 * a turn that has already outlived the typical turn is expected to outlive it
 * further, but no faster than the observed distribution suggests. When no
 * completed turn was this long, grow the observed count by a fixed runway.
 * @param completedTurnSteps - step counts of this session's completed turns.
 * @param completedSteps - steps completed in the open turn.
 * @returns the expected total step count, or undefined without history.
 */
function expectedTotalSteps(
  completedTurnSteps: readonly number[],
  completedSteps: number,
): number | undefined {
  const base = median(ascending(completedTurnSteps)) ?? BOOTSTRAP_EXPECTED_STEPS
  if (completedSteps <= 0) return base
  const longer = completedTurnSteps.filter((count) => count >= completedSteps)
  if (longer.length > 0) return Math.max(base, median(ascending(longer)) as number)
  return Math.max(base, completedSteps + Math.max(OUTRUN_MINIMUM, Math.ceil(completedSteps * OUTRUN_GROWTH)))
}

/**
 * Derive one remaining-time core from the open turn's facts.
```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:98-121](https://github.com/778672151/dsh-session-turn-eta/blob/b5cdc8ec7f51a3c882598fc7bc073f7c629f4a11/src/client/chat/TurnProgress.tsx#L98-L121)

耗尽文案基线。

<details>
<summary>查看原文（24行）</summary>

```text
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [status])

  if (eta === undefined || status === undefined) return null
  const percent = status === 'running' ? turnProgressPercent(eta, now) : 100
  const remainingMs = status === 'running' && eta.predictedTotalMs !== undefined
    ? Math.max(0, eta.predictedTotalMs - Math.max(0, now - eta.startTime))
    : undefined
  // The published total never rises, so a turn that outlives its estimate keeps
  // a zero remainder. Report that as "finishing" rather than a misleading "0s left".
  const exhausted = status === 'running' && remainingMs === 0
  const label = status === 'completed'
    ? t('turnProgress.completed')
    : status === 'failed'
      ? t('turnProgress.failed')
      : exhausted
        ? t('turnProgress.finishing')
        : percent === undefined
          ? t('turnProgress.indeterminate')
          : t('turnProgress.running', { percent })
  const remaining = remainingMs === undefined || exhausted ? undefined : remainingLabel(t, remainingMs)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
