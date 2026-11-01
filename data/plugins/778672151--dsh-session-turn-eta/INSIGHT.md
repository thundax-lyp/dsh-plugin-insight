# dsh-session-turn-eta

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9fd24ff](https://github.com/778672151/dsh-session-turn-eta/tree/9fd24ffe8867c1882728672e8b05607d231efa34)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/778672151/dsh-session-turn-eta)
<!-- END META -->

> **功能**：根据会话事件估计当前轮次剩余时间并展示进度。

> **亮点**：[Q02](#research-q02) 提供基于历史和当前轮次的动态等待提示。

> **主要限制**：[Q03](#research-q03) 终态 100% 不等于成功，预测耗尽也不保证马上结束。

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
  - [Q01 · 预计剩余时间能帮助用户做什么？](#detail-section-11)
  - [Q02 · 如何从轮次事件估算进度？](#detail-section-12)
  - [Q03 · 100% 或时间耗尽是否表示任务成功？](#detail-section-13)
  - [Q04 · 使用该估计有哪些条件？](#detail-section-14)
  - [Q05 · 如何辅助用户判断继续等待还是检查任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：等待 DSH 当前轮次结果的用户。

宿主运行状态、时钟及用户自行检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| ETA | 帮助等待决策 | 历史估计并非承诺 |
| 进度 | 展示估算百分比 | 终态 100% 不保证成功 |
| 数据不足 | 避免无样本猜测 | 用户理解未测 |
| finishing | 避免显示 0 秒 | 仍可能继续运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 投影及客户端 | 必需 | 折叠与呈现 | 不可用 |
| 可用 step 历史 | 有效估计需要 | 推断时长 | 数据不足时不显示数字 |
| 原始结果与日志 | 任务验收必需 | 判断成功与否 | ETA 不可代替结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户启用兼容投影与客户端 | 槽位正常显示 |
| 等待 | 系统折叠事件并估算 | 无数据时不猜测 |
| 判断 | 用户按提示选择等待或查看状态 | 不把 ETA 当承诺 |
| 验收 | 用户检查最终结果和终态 | 失败或停滞回宿主排查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件和计算费用未知 | 安装兼容配置时间未知 | 需投影和 UI 槽位 |
| 持续使用 | 投影与客户端计算消耗未知 | 检查预测与结果时间未知 | 精度受样本分布影响 |
| 失败恢复 | 资源费用未知 | 核查事件与插件时间未知 | 运行和性能未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 进度估计 | 源码根据历史与当前步骤计算 | 真实误差及校准 |
| 冷启动 | 提供 insufficient-data | 用户是否理解 |
| 终态 | 结束时 100%，标签区分成功失败 | 误读频率 |

> **思考**：[Q03](#research-q03) 终态 100% 不等于成功，预测耗尽也不保证马上结束。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 提供基于历史和当前轮次的动态等待提示。

[Q02](#research-q02) 历史和实时估计，数据不足不猜；[Q03](#research-q03) 100% 不是成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 终态 100% 不等于成功，预测耗尽也不保证马上结束。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅作等待提示，最终检查宿主结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行目标、预测回放或用户实验。

- 已检查：作者 README、包清单、源码路径 README.md、src/predict.ts、src/projection.ts、src/client/chat/TurnProgress.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态核查；未运行宿主或模型。
- 下一步：时间顺序回放任务并分布评估误差、区间覆盖及终态理解。

**分析版本**

- **仓库**：[778672151/dsh-session-turn-eta](https://github.com/778672151/dsh-session-turn-eta)
- **版本号**：0.4.1（[固定提交 9fd24ff](https://github.com/778672151/dsh-session-turn-eta/tree/9fd24ffe8867c1882728672e8b05607d231efa34)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有不确定与 finishing 显示验证可信范围提示。

时间顺序回放任务并分布评估误差、区间覆盖及终态理解。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 78 | 72 | 0 | — |
| .md | source | 7 | 687 | — | — | 5738 |
| .js | source | 2 | 884 | 602 | 294 | — |
| .ts | source | 9 | 1126 | 693 | 352 | — |
| .tsx | source | 1 | 162 | 101 | 48 | — |
| .mjs | test | 6 | 695 | 605 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/778672151/dsh-session-turn-eta/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查轮次样本、估计和终态展示的误解边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 预计剩余时间能帮助用户做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户在等待本轮结果时可用进度提示决定是否继续等待或转做别事；已有加载状态和时钟也能提示运行中。估计并非服务承诺或模型完成保证，节省等待时间及准确率未在本次测量。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-12](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/README.md#L1-L12)

作者描述进度和剩余时间。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-session-turn-eta

Live remaining-time prediction for the current DeepSeek Harness turn, shown as a
progress bar with a live percentage under the composer.

- **Running** — a bar whose width follows elapsed time over the predicted total,
  with a percentage and a humanised time left (`~12m 34s left` / `约剩 12 分 34 秒`).
  The percentage ticks locally while the turn is open. The filled track ends in
  a leading dot and carries a slow shimmer.
- **Finishing** — once a turn outruns its own estimate the bar fills and pulses
  with a "finishing" label, instead of a misleading "0s left".
- **Completed** — 100%, with a short one-shot burst at the tip.
```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:100-116](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L100-L116)

界面读取投影并展示剩余时间。

<details>
<summary>查看原文（17行）</summary>

```text
export function TurnProgress({ useProjection, t, skin: skinProp }: TurnProgressProps) {
  const eta = useProjection('turnEta')
  const skin = resolveTurnEtaSkin(skinProp)
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
```

</details>

#### 缺口

- 无用户和基线对照
  **影响**：无法证明体验改善
  **进一步探讨**：对同任务比较无 ETA 和 ETA 的等待决策。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从轮次事件估算进度？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

projection 收集轮次 step/end 时长和结束轮次步数；etaCore 使用历史步长速率及当前轮次信息估计总时长，数据不足返回 insufficient-data。客户端用当前时间除估计总时长计算进度，运行状态设上限，估计耗尽时标 finishing 而非保证马上完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/projection.ts:172-205](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/projection.ts#L172-L205)

收集 step 和轮次数据。

<details>
<summary>查看原文（34行）</summary>

```text
      case 'step/end': {
        const open = state.open
        if (open === undefined || open.turn !== event.data.turn) return state
        const stepDurations = open.openStepStart === undefined
          ? open.stepDurations
          : [...open.stepDurations, Math.max(0, event.time - open.openStepStart)]
        const stepSamples = open.openStepStart === undefined
          ? state.stepSamples
          : withSample(state.stepSamples, Math.max(0, event.time - open.openStepStart))
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

**依据 2 · 源码核查**：[src/predict.ts:286-303](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/predict.ts#L286-L303)

估算和数据不足。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Derive one remaining-time core from the open turn's facts.
 *
 * The estimate is a robust per-step rate times the anchored expected step count.
 * The rate blends the live turn's own observed rate (elapsed over completed
 * steps, so it includes per-turn overhead) with the historical median step
 * duration. The published total is held while it still outruns the turn and
 * re-anchored to the live estimate once the turn runs past it, so the estimate
 * stays meaningful for arbitrarily long turns without reacting to every noisy
 * sample. `insufficient-data` omits every numeric field rather than guessing.
 * @param input - open-turn anchors and observed step samples.
 * @returns the shared prediction core.
 */
export function etaCore(input: EtaPredictionInput): EtaCore {
  const completedSteps = input.stepDurations.length
  const elapsedMs = Math.max(0, input.asOf - input.startTime)
  const historyRate = input.stepSamples.length === 0 ? undefined : rateProfile(input.stepSamples).historyRate
  const base: EtaCore = { elapsedMs, completedSteps, method: 'insufficient-data' }
```

</details>

**依据 3 · 源码核查**：[src/client/chat/TurnProgress.tsx:59-75](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L59-L75)

百分比计算。

<details>
<summary>查看原文（17行）</summary>

```text
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
  return undefined
```

</details>

**依据 4 · 源码核查**：[src/client/chat/TurnProgress.tsx:112-125](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L112-L125)

耗尽及终态显示。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行历史重放及真实模型
  **影响**：无法量化误差和覆盖率
  **进一步探讨**：固定不同任务和 provider 的历史做时间顺序回放。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 100% 或时间耗尽是否表示任务成功？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

客户端关闭状态将已完成与失败均显示 100% 进度，但 label 按 completed 和 failed 区分；因此 100% 代表结束而非成功。运行中预测超时后显示 finishing，仍可能继续很久；样本来自会话事件，任务分布变化或终止轮次污染可能影响估计。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/chat/TurnProgress.tsx:45-55](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L45-L55)

完成与失败状态区分。

<details>
<summary>查看原文（11行）</summary>

```text
}

/**
 * Terminal or live status of the projected turn.
 * @param eta - the current `turnEta` value.
 * @returns undefined before the session's first turn.
 */
export function turnProgressStatus(eta: TurnEtaProjection): TurnProgressStatus | undefined {
  if (eta.open) return 'running'
  if (eta.completed === true) return 'completed'
  if (eta.completed === false) return 'failed'
```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:67-75](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L67-L75)

终态均返回 100%。

```text
export function turnProgressPercent(eta: TurnEtaProjection, now: number): number | undefined {
  if (!eta.open) return eta.completed === undefined ? undefined : 100
  if (eta.predictedTotalMs !== undefined && eta.predictedTotalMs > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent((now - eta.startTime) / eta.predictedTotalMs * 100))
  }
  if (eta.expectedSteps !== undefined && eta.expectedSteps > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent(eta.completedSteps / eta.expectedSteps * 100))
  }
  return undefined
```

**依据 3 · 源码核查**：[src/client/chat/TurnProgress.tsx:112-125](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L112-L125)

finishing 与终态标签。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/projection.ts:191-205](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/projection.ts#L191-L205)

轮次结束时记录步数并单独标记完成。

<details>
<summary>查看原文（15行）</summary>

```text
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

#### 缺口

- 未测不同任务、失败轮次和终态样本偏差
  **影响**：不能证明百分比校准或剩余时间准确
  **进一步探讨**：按完成和失败原因分组评估误差与错误理解。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用该估计有哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH sessionProjections 和客户端槽位，估计取决于可用历史 step 事件。将其视为等待提示，不用于超时承诺或任务验收；状态异常或预测不准时回宿主日志和结果核查。性能、数据存储和用户打断成本未在本次测量。

#### 证据与依据

**依据 1 · 源码核查**：[src/projection.ts:145-154](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/projection.ts#L145-L154)

投影注册和初始状态。

<details>
<summary>查看原文（10行）</summary>

```text
/** The \`turnEta\` unit registered on \`ctx.sessionProjections\` (exported for the unit spec). */
export const turnEtaProjectionDefinition = {
  key: 'turnEta',
  stateVersion: 2,
  stateSchema,
  // The contract hands both the Session header and the fork-inherited prefix
  // length; this fold keeps nothing header-derived, so they are accepted and
  // ignored rather than dropped, which keeps the signature honest.
  init: (_header, _inheritedEventCount) => emptyTurnEtaState(),
  apply: (state, event) => {
```

</details>

**依据 2 · 源码核查**：[src/predict.ts:286-303](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/predict.ts#L286-L303)

样本与数据不足。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Derive one remaining-time core from the open turn's facts.
 *
 * The estimate is a robust per-step rate times the anchored expected step count.
 * The rate blends the live turn's own observed rate (elapsed over completed
 * steps, so it includes per-turn overhead) with the historical median step
 * duration. The published total is held while it still outruns the turn and
 * re-anchored to the live estimate once the turn runs past it, so the estimate
 * stays meaningful for arbitrarily long turns without reacting to every noisy
 * sample. `insufficient-data` omits every numeric field rather than guessing.
 * @param input - open-turn anchors and observed step samples.
 * @returns the shared prediction core.
 */
export function etaCore(input: EtaPredictionInput): EtaCore {
  const completedSteps = input.stepDurations.length
  const elapsedMs = Math.max(0, input.asOf - input.startTime)
  const historyRate = input.stepSamples.length === 0 ? undefined : rateProfile(input.stepSamples).historyRate
  const base: EtaCore = { elapsedMs, completedSteps, method: 'insufficient-data' }
```

</details>

**依据 3 · 源码核查**：[src/client/chat/TurnProgress.tsx:100-116](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L100-L116)

客户端读投影。

<details>
<summary>查看原文（17行）</summary>

```text
export function TurnProgress({ useProjection, t, skin: skinProp }: TurnProgressProps) {
  const eta = useProjection('turnEta')
  const skin = resolveTurnEtaSkin(skinProp)
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
```

</details>

#### 缺口

- 未跑宿主、性能或兼容测试
  **影响**：实际延迟与准确率未知
  **进一步探讨**：固定 session 事件回放并测误差与资源消耗。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何辅助用户判断继续等待还是检查任务？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

当前已有 insufficient-data、运行百分比上限和 finishing 提示，是直接反证；假设增加基于历史误差的粗粒度可信范围与样本量，帮助用户决定继续等待或检查任务。对照现有进度，在冷启动、短长任务混合、工具长阻塞和失败场景比较错误等待/提前检查、误差区间覆盖、决策时间和提示负担；覆盖不足、决策无改善或误导/成本抵消收益则否定。未穷尽其他客户端信息。

#### 证据与依据

**依据 1 · 源码核查**：[src/predict.ts:286-303](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/predict.ts#L286-L303)

已有数据不足状态。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Derive one remaining-time core from the open turn's facts.
 *
 * The estimate is a robust per-step rate times the anchored expected step count.
 * The rate blends the live turn's own observed rate (elapsed over completed
 * steps, so it includes per-turn overhead) with the historical median step
 * duration. The published total is held while it still outruns the turn and
 * re-anchored to the live estimate once the turn runs past it, so the estimate
 * stays meaningful for arbitrarily long turns without reacting to every noisy
 * sample. `insufficient-data` omits every numeric field rather than guessing.
 * @param input - open-turn anchors and observed step samples.
 * @returns the shared prediction core.
 */
export function etaCore(input: EtaPredictionInput): EtaCore {
  const completedSteps = input.stepDurations.length
  const elapsedMs = Math.max(0, input.asOf - input.startTime)
  const historyRate = input.stepSamples.length === 0 ? undefined : rateProfile(input.stepSamples).historyRate
  const base: EtaCore = { elapsedMs, completedSteps, method: 'insufficient-data' }
```

</details>

**依据 2 · 源码核查**：[src/client/chat/TurnProgress.tsx:67-75](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L67-L75)

已有运行上限。

```text
export function turnProgressPercent(eta: TurnEtaProjection, now: number): number | undefined {
  if (!eta.open) return eta.completed === undefined ? undefined : 100
  if (eta.predictedTotalMs !== undefined && eta.predictedTotalMs > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent((now - eta.startTime) / eta.predictedTotalMs * 100))
  }
  if (eta.expectedSteps !== undefined && eta.expectedSteps > 0) {
    return Math.min(MAX_OPEN_PERCENT, clampPercent(eta.completedSteps / eta.expectedSteps * 100))
  }
  return undefined
```

**依据 3 · 源码核查**：[src/client/chat/TurnProgress.tsx:117-125](https://github.com/778672151/dsh-session-turn-eta/blob/9fd24ffe8867c1882728672e8b05607d231efa34/src/client/chat/TurnProgress.tsx#L117-L125)

已有 finishing 标签。

```text
  // The published total never rises, so a turn that outlives its estimate keeps
  // a zero remainder. Report that as "finishing" rather than a misleading "0s left".
  const exhausted = status === 'running' && remainingMs === 0
  const label = status === 'completed'
    ? t('turnProgress.completed')
    : status === 'failed'
      ? t('turnProgress.failed')
      : exhausted
        ? t('turnProgress.finishing')
```

#### 缺口

- 未评估已有 interval 的展示及历史误差
  **影响**：不能认定新信息缺失或准确
  **进一步探讨**：按时间分割历史，比较校准与用户决策。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
