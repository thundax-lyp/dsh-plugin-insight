# DSH Live Stats

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui) [![npm 30d 632](https://img.shields.io/static/v1?label=npm+30d&message=632&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-live-stats) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-live-stats)
<!-- END META -->

> **功能**：为 DSH Web 提供流式输入输出用量估计和生成速度显示。

> **亮点**：把未结束的粗估及输出速率接进当前 DSH 会话，且保留实际用量优先规则，见 [Q02](#research-q02)。

> **主要限制**：旧速率也可显示为当前一行，且不含首 token 等待。估计不适合当成本凭据，见 [Q02](#research-q02)。

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
  - [Q01 · 它补上了怎样的等待反馈？](#detail-section-11)
  - [Q02 · 估计、实际 usage 和速度怎样变化？](#detail-section-12)
  - [Q03 · 何时值得用这条统计，何时退回原工具？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要在长生成过程区别已有输出与最终用量的 DSH Web 用户，见 [Q01](#research-q01)。

以宿主原有最终 token 用量与可回读的实际耗时为对照，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话用量 | 显示流式粗估 | 供应商 usage 到达时可替换 |
| TPS | 观察最近输出速度 | 可能是上一段，不含首 token 等待 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH sessionProjections | 宿主需 | 注册可回放会话投影 | 没有数据 |
| Web 槽及运行时 | 显示需 | 绑定设置和 TPS 行 | 可能无显示 |
| 供应商 usage | 精确替换需 | 覆盖字符估计 | 保留粗估 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选脱敏长片段及最终用量 | 保存原始基线 |
| 运行 | 比对生成中和结束后数字 | 能区分粗估和实际 |
| 退出 | 停用并复核原用量 | 恢复宿主状态行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主环境 | 核投影和槽 | 配置时间未知 |
| 持续 | 事件折叠和 UI 渲染 | 校对估计及旧速率 | CPU 和耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 生成反馈 | 估计并推送可见速率 | 实际误判改善 |
| 用量区分 | provider usage 替换估计 | 不同模型误差 |

> **思考**：旧速率也可显示为当前一行，且不含首 token 等待。估计不适合当成本凭据，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把未结束的粗估及输出速率接进当前 DSH 会话，且保留实际用量优先规则，见 [Q02](#research-q02)。

宿主事件重放与 Web 展示解耦。实时估计、精确事件和最近速率应分别解释，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

旧速率也可显示为当前一行，且不含首 token 等待。估计不适合当成本凭据，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用中文、代码和一个故障回合作隔离对照，观察实时速率与实际时间。不一致时回到最终用量与日志，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持流式估计及挂载，未验证浏览器与供应商实际事件。

- 已检查：作者 README、包清单、源码路径 packages/dsh-live-stats/package.json、packages/dsh-live-stats/tsdown.config.ts、packages/dsh-live-stats/cordis.patch.yml、packages/dsh-live-stats/README.md、packages/dsh-live-stats/src/estimator.ts、packages/dsh-live-stats/src/index.ts、packages/dsh-live-stats/src/client/index.ts、packages/dsh-live-stats/src/projection.ts、packages/dsh-live-stats/src/client/TpsLine.tsx 及固定范围 inventory；组件：packages/dsh-live-stats。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核固定子包的宿主、估计与客户端。未运行浏览器、任务、tokenizer 或计费对照。
- 下一步：检查同版本 Web 槽、真实 usage 回替和取消前后，用原始时间换算，见 [Q03](#research-q03)。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

标记上一段速率并展示首 token 等待，测量用户是否更少误判卡住，见 [Q03](#research-q03)。

检查同版本 Web 槽、真实 usage 回替和取消前后，用原始时间换算，见 [Q03](#research-q03)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 166 | — | — | 1477 |
| .ts | source | 10 | 1356 | 932 | 320 | — |
| .tsx | source | 3 | 538 | 420 | 95 | — |
| .tsx | test | 3 | 170 | 138 | 18 | — |
| .ts | test | 2 | 751 | 659 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：生成过程中的即时估计和 TPS 是否能帮助诊断等待，并清楚区分历史速度和供应商实际用量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它补上了怎样的等待反馈？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

当用户刚启动一个长回答时，供应商使用量还未到，原生最终用量无法说明正在生成还是停止。该插件将当前快照的估计和最新测得的速率接到会话投影，可供输入区域读。默认按字符密度 4 和块、角色开销估算，中文、代码、结构化输出都可能偏差。对照最终账目，实时行用于判断进展，结果必须事后与供应商 usage 核对。README 写客户端不挂内容，实际固定源码已经注册设置卡和 composer dock TPS，须以代码为准。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-live-stats/README.md:5-16](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/README.md#L5-L16)

作者描述估计和旧客户端说法。

<details>
<summary>查看原文（12行）</summary>

````text
Live input/output token estimates and generation throughput for DSH Web. It feeds the built-in session status row: input and output token totals update while a response streams, and the generation throughput group (`TPS 31.4 tok/s`) renders right after the step counts, ahead of the billing groups:

```text
1 turns · 3 steps TPS 31.4 tok/s Input ~7.9K tok · Output ~12 tok
```

`~` marks a heuristic estimate. Provider usage replaces the estimate when it arrives; exact cache accounting continues to come from DSH's durable token-usage projection. A retry replaces the prior estimate for that step, and an aborted turn removes its unsettled estimate.

## What it does

- **Host half**: registers the replayable `liveTokenUsage` session projection (`ctx.sessionProjections`). The fold estimates input tokens from the surface log plus header/tool framing, estimates output tokens from streaming chunks, and replaces estimates with provider usage as soon as a `usage` chunk or final message lands. TPS is derived from output tokens over wall-clock time of the active step, and the rate is resident: once any step measured one, the projection keeps reporting it (falling back to the last measured value while a new step has not produced output yet, or after a rate-less step), so the row never flickers out.
- **Client half**: kept for roster compatibility only. The TPS group lives inside the conversation stats line — ui-conversation reads the `liveTokenUsage` projection directly — so the client mounts nothing.
````

</details>

**依据 2 · 源码核查**：[packages/dsh-live-stats/src/estimator.ts:25-52](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/estimator.ts#L25-L52)

估计配置与字符换算。

<details>
<summary>查看原文（28行）</summary>

```text
export function resolveEstimatorConfig(config: EstimatorConfig): EstimatorSpec {
  const known = new Set(['charsPerToken', 'blockOverhead', 'roleOverhead'])
  for (const key of Object.keys(config)) {
    if (!known.has(key)) throw new Error(`live-stats: unknown config key "${key}"`)
  }
  const spec = {
    charsPerToken: config.charsPerToken ?? 4,
    blockOverhead: config.blockOverhead ?? 4,
    roleOverhead: config.roleOverhead ?? 4,
  }
  if (!Number.isFinite(spec.charsPerToken) || spec.charsPerToken <= 0) {
    throw new Error('live-stats: charsPerToken must be a positive finite number')
  }
  for (const key of ['blockOverhead', 'roleOverhead'] as const) {
    if (!Number.isInteger(spec[key]) || spec[key] < 0) {
      throw new Error(`live-stats: ${key} must be a non-negative integer`)
    }
  }
  return spec
}

/** Estimate one text-like block from its accumulated character count.
 * @param characters - accumulated character count of the block.
 * @param spec - resolved estimator settings.
 * @returns the estimated token count.
 */
export function estimateTextBlockTokens(characters: number, spec: EstimatorSpec): number {
  return Math.ceil(characters / spec.charsPerToken) + spec.blockOverhead
```

</details>

**依据 3 · 源码核查**：[packages/dsh-live-stats/src/index.ts:45-71](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/index.ts#L45-L71)

设置变更注销并重建投影。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  // The authoritative estimation source: the settings scope once the web
  // settings surface serves the namespace, the composition entry otherwise
  // (installSettingsSection swaps it on attach and detach).
  let current: () => Config = () => config ?? {}
  let disposeProjection: (() => void) | undefined

  const rebuild = (): void => {
    if (disposeProjection !== undefined) {
      disposeProjection()
      disposeProjection = undefined
    }
    if ((current().enabled ?? true) === false) return
    const source = current()
    const spec = resolveEstimatorConfig({
      ...(source.charsPerToken === undefined ? {} : { charsPerToken: source.charsPerToken }),
      ...(source.blockOverhead === undefined ? {} : { blockOverhead: source.blockOverhead }),
      ...(source.roleOverhead === undefined ? {} : { roleOverhead: source.roleOverhead }),
    })
    disposeProjection = ctx.sessionProjections.register(createLiveTokenUsageProjectionDefinition(spec))
  }

  installSettingsSection(ctx, LIVE_STATS_SETTINGS_NAMESPACE, Config, config ?? {}, {
    setSource: (source) => { current = source },
    onChange: rebuild,
  })
  rebuild()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-live-stats/src/client/index.ts:67-93](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/client/index.ts#L67-L93)

客户端真实注册卡和输入 dock。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'live-stats: dictionaries')

  // Plugin configuration card: one staged form over the `live-stats` settings
  // namespace, contributed to the plugin-configuration section.
  const binder = ctx.get('webUiSettings') ?? ctx.settingsScope
  const liveStatsSettings = new LiveStatsSettingsCardController(
    binder.bind<LiveStatsSettings>({ namespace: LIVE_STATS_NS }),
  )
  ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
    name: 'web-ui.plugin.item',
    id: 'live-stats',
    order: 110,
    locale: NS,
    inject: () => liveStatsSettings.inject(),
  }, LiveStatsSettingsCard))

  // The live TPS row mounts on the composer dock (the shipped stats-line
  // seat). Its session standard kit supplies `useProjection`, which reads the
  // host's `liveTokenUsage` projection. Previously TpsLine was only exported
  // for shell integration and never actually mounted on rc.6 (issue #56).
  ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'live-stats',
    order: 100,
    inject: () => ({}),
  }, TpsLineDockEntry))
```

</details>

#### 缺口

- 未确认实际宿主是否同时显示自身 TPS
  **影响**：可能出现重复展示或槽缺失
  **进一步探讨**：对目标 Web 桌面分别检查设置卡、输入行和原 UI

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 估计、实际 usage 和速度怎样变化？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

投影在 step/start 按请求头和可见消息起始，不停从输出块增加估计。usage chunk 和最终消息 usage 进入 exactStep，重置块估计；结算按相同 turn+step 替换旧桶。非 completed turn 若最后同回合步骤仍是估计，可从汇总移除这个最后步骤。此条件不足以认为任意失败历史都全部撤销。TPS 使用 outputTokens 与首个、最新输出事件时间差，最后 usage 或消息亦可更新最新时点。它排除了首 token 前等待，并会在新步骤无速率时延用上一个测速。显示没标 active 或历史，因此空闲看到数值不能断言当前仍在生成。依赖宿主的可回放事件、sessionProjections 以及 Web 槽，配置变动会触发重注册。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-live-stats/src/projection.ts:215-262](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/projection.ts#L215-L262)

TPS 公式及历史回退。

<details>
<summary>查看原文（48行）</summary>

```text
function rateOf(step: ActiveStep): number | undefined {
  if (step.firstOutputTime === undefined || step.latestOutputTime === undefined) return
  const elapsedMs = step.latestOutputTime - step.firstOutputTime
  if (elapsedMs <= 0 || step.buckets.outputTokens <= 0) return
  return step.buckets.outputTokens * 1_000 / elapsedMs
}

function exactStep(step: ActiveStep, usage: TokenUsage, time: number): ActiveStep {
  return {
    ...step,
    buckets: bucketsFrom(usage),
    exact: true,
    // The exact usage supersedes every block priced from streamed deltas;
    // retain only the exact buckets so later deltas cannot re-estimate.
    blocks: [],
    pricedTokens: 0,
    pricedBlocks: 0,
    ...(usage.outputTokens > 0
      ? { firstOutputTime: step.firstOutputTime ?? time, latestOutputTime: time }
      : {}),
  }
}

function view(state: State): LiveTokenUsageProjection {
  const active = state.active
  const previous = active !== null
    && state.last?.turn === active.turn
    && state.last.step === active.step
    ? state.last
    : undefined
  const buckets = active === null
    ? state.settled
    : addReplacing(state.settled, previous?.buckets, active.buckets)
  const estimates = state.settledEstimates
    - (previous?.estimated === true ? 1 : 0)
    + (active !== null && !active.exact ? 1 : 0)
  // Resident throughput: once any step measured a rate, keep reporting it.
  // Without the fallback the row drops out between output bursts (an active
  // step before its first chunk) and after a rate-less step settles — the
  // stats band must not flicker while the other groups stay put.
  const rate = active === null
    ? state.last?.tokensPerSecond
    : rateOf(active) ?? state.last?.tokensPerSecond
  return {
    ...buckets,
    estimated: estimates > 0,
    ...(rate === undefined ? {} : { tokensPerSecond: rate }),
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-live-stats/src/projection.ts:284-342](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/projection.ts#L284-L342)

步骤和模型 usage 替代估计。

<details>
<summary>查看原文（59行）</summary>

```text
    apply: (state, event: SessionEvent) => {
      let next = state
      if (event.type === 'step/start') {
        next = {
          ...next,
          active: {
            ...event.data,
            buckets: {
              ...zeroBuckets(),
              uncachedInputTokens: estimateHeaderTokens(state.header, spec) + state.surfaceTokens,
            },
            exact: false,
            blocks: [],
            pricedTokens: 0,
            pricedBlocks: 0,
          },
        }
      } else if (event.type === 'request/header') {
        next = {
          ...next,
          header: event.data.header,
          ...(next.active === null ? {} : {
            active: {
              ...next.active,
              buckets: {
                ...next.active.buckets,
                uncachedInputTokens: estimateHeaderTokens(event.data.header, spec) + state.surfaceTokens,
              },
            },
          }),
        }
      } else if (event.type === 'assistant/chunk' && next.active !== null) {
        const { chunk } = event.data
        if (chunk.type === 'usage') {
          next = { ...next, active: exactStep(next.active, chunk.usage, event.time) }
        } else if (!next.active.exact) {
          // Reuse the active step in place instead of rebuilding a fresh
          // object (and copying buckets) on every streamed delta: only the
          // mutated fields change, and the blocks buffer is untouched between
          // steps. The settle/usage paths still build a fresh active step.
          const active = next.active
          if (applyOutputChunk(active, chunk, spec)) {
            const tokens = active.pricedBlocks === 0 ? 0 : active.pricedTokens + spec.roleOverhead
            active.buckets = { ...active.buckets, outputTokens: tokens }
            if (tokens > 0) {
              if (active.firstOutputTime === undefined) active.firstOutputTime = event.time
              active.latestOutputTime = event.time
            }
          }
        }
      } else if (event.type === 'assistant/message' && next.active !== null) {
        next = {
          ...next,
          active: event.data.usage === undefined
            ? {
              ...next.active,
              ...(next.active.buckets.outputTokens > 0 ? { latestOutputTime: event.time } : {}),
            }
            : exactStep(next.active, event.data.usage, event.time),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-live-stats/src/projection.ts:344-379](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/projection.ts#L344-L379)

结算替换与取消的限定撤除。

<details>
<summary>查看原文（36行）</summary>

```text
      } else if (event.type === 'step/end' && next.active !== null) {
        const active = next.active
        const rate = rateOf(active)
        const previous = next.last?.turn === active.turn && next.last.step === active.step
          ? next.last
          : undefined
        next = {
          ...next,
          settled: addReplacing(next.settled, previous?.buckets, active.buckets),
          settledEstimates: next.settledEstimates
          - (previous?.estimated === true ? 1 : 0)
          + (!active.exact ? 1 : 0),
          last: {
            turn: active.turn,
            step: active.step,
            buckets: active.buckets,
            estimated: !active.exact,
            // Carry the last measured rate across a rate-less step instead of
            // clobbering it: the row stays resident (see view()).
            tokensPerSecond: rate ?? state.last?.tokensPerSecond,
          },
          active: null,
        }
      } else if (event.type === 'turn/end'
      && event.data.reason.kind !== 'completed'
      && next.last?.turn === event.data.turn
      && next.last.estimated) {
        next = {
          ...next,
          settled: addReplacing(next.settled, next.last.buckets, zeroBuckets()),
          settledEstimates: next.settledEstimates - 1,
          last: null,
        }
      }

      if (isSurfaceEvent(event)) next = { ...next, ...applySurface(next, event, spec) }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-live-stats/src/client/TpsLine.tsx:34-50](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/client/TpsLine.tsx#L34-L50)

Web 只显示数字，不标测速有效期。

<details>
<summary>查看原文（17行）</summary>

```text
/** Second composer-status line for active or latest response throughput. */
export const TpsLine = memo(function TpsLine({ useProjection }: TpsLineProps) {
  const rate = useProjection('liveTokenUsage')?.tokensPerSecond
  if (rate === undefined) return null
  return <div style={STYLE}>TPS {formatTokensPerSecond(rate)} tok/s</div>
})

/**
 * Composer-dock entry: adapts the session-scoped `conversation.composer.dock`
 * runtime share to the TPS line. The dock is the shipped stats-line seat, and
 * its standard kit supplies `useProjection` (the fifth framework hook seat),
 * which reads the host's `liveTokenUsage` projection. Registering here makes
 * the live TPS row actually mount — previously the TpsLine was only exported
 * and never mounted on rc.6 (issue #56).
 */
export const TpsLineDockEntry = memo(function TpsLineDockEntry(props: PropsRuntime<'conversation.composer.dock'>) {
  return <TpsLine useProjection={props.useProjection} />
```

</details>

**依据 5 · 源码核查**：[packages/dsh-live-stats/src/index.ts:9-31](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/index.ts#L9-L31)

注册依赖和设置默认。

<details>
<summary>查看原文（23行）</summary>

```text
/** Services required by the host projection plugin. */
export const inject = ['sessionProjections']

/**
 * Settings namespace of the live-stats capability — the section the web
 * settings surface edits. Spelled here rather than imported so the browser
 * half can spell the same value without depending on a Host package.
 */
export const LIVE_STATS_SETTINGS_NAMESPACE = settingsNamespace('live-stats')

/** Plugin configuration for provider-independent token estimation. */
export interface Config extends EstimatorConfig {
  /** Master switch for the plugin (browser half + host projection). */
  enabled?: boolean
}

/** Runtime schema for {@link Config}. */
export const Config: z<Config> = z.object({
  charsPerToken: z.number().min(0.01).default(4),
  blockOverhead: z.number().step(1).min(0).default(4),
  roleOverhead: z.number().step(1).min(0).default(4),
  enabled: z.boolean().default(true),
})
```

</details>

#### 缺口

- 未验证跨供应商事件时间及取消语义
  **影响**：不能替代供应商账单或端到端延迟
  **进一步探讨**：用双会话回放实际模型重试、取消和缺 usage

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得用这条统计，何时退回原工具？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

将其用于单会话的流式反馈，不用它比较供应商全程延迟或费用。先用脱敏中文和代码各一段观察第一个 token 的等待、事件 TPS 与最终返回用量，记录设置调整时是否出现短暂无数据。投入包括固定宿主接线、估计参数校对和更改设置后的会话重放成本，收益及 CPU 尚未知。可为旧速率标“上一段”，并同时显示首 token 等待，衡量能否减少用户把迟缓当作高 TPS 的误判。若调整参数仍偏离过大或速度保留引起误判，停用并看最终用量与原始耗时。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-live-stats/src/projection.ts:215-219](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/projection.ts#L215-L219)

测速不含首个输出前等待。

```text
function rateOf(step: ActiveStep): number | undefined {
  if (step.firstOutputTime === undefined || step.latestOutputTime === undefined) return
  const elapsedMs = step.latestOutputTime - step.firstOutputTime
  if (elapsedMs <= 0 || step.buckets.outputTokens <= 0) return
  return step.buckets.outputTokens * 1_000 / elapsedMs
```

**依据 2 · 源码核查**：[packages/dsh-live-stats/src/projection.ts:248-261](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/projection.ts#L248-L261)

存在历史速率回退。

<details>
<summary>查看原文（14行）</summary>

```text
  const estimates = state.settledEstimates
    - (previous?.estimated === true ? 1 : 0)
    + (active !== null && !active.exact ? 1 : 0)
  // Resident throughput: once any step measured a rate, keep reporting it.
  // Without the fallback the row drops out between output bursts (an active
  // step before its first chunk) and after a rate-less step settles — the
  // stats band must not flicker while the other groups stay put.
  const rate = active === null
    ? state.last?.tokensPerSecond
    : rateOf(active) ?? state.last?.tokensPerSecond
  return {
    ...buckets,
    estimated: estimates > 0,
    ...(rate === undefined ? {} : { tokensPerSecond: rate }),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-live-stats/src/index.ts:45-71](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-live-stats/src/index.ts#L45-L71)

配置变化重建投影。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  // The authoritative estimation source: the settings scope once the web
  // settings surface serves the namespace, the composition entry otherwise
  // (installSettingsSection swaps it on attach and detach).
  let current: () => Config = () => config ?? {}
  let disposeProjection: (() => void) | undefined

  const rebuild = (): void => {
    if (disposeProjection !== undefined) {
      disposeProjection()
      disposeProjection = undefined
    }
    if ((current().enabled ?? true) === false) return
    const source = current()
    const spec = resolveEstimatorConfig({
      ...(source.charsPerToken === undefined ? {} : { charsPerToken: source.charsPerToken }),
      ...(source.blockOverhead === undefined ? {} : { blockOverhead: source.blockOverhead }),
      ...(source.roleOverhead === undefined ? {} : { roleOverhead: source.roleOverhead }),
    })
    disposeProjection = ctx.sessionProjections.register(createLiveTokenUsageProjectionDefinition(spec))
  }

  installSettingsSection(ctx, LIVE_STATS_SETTINGS_NAMESPACE, Config, config ?? {}, {
    setSource: (source) => { current = source },
    onChange: rebuild,
  })
  rebuild()
```

</details>

#### 缺口

- 缺同版本耗时、CPU 与用户理解数据
  **影响**：采用仅限受控界面试用
  **进一步探讨**：同会话比较显示与日志并记录误判

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
