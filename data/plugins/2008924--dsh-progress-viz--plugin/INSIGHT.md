# dsh-progress-viz (plugin)

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7369098](https://github.com/2008924/dsh-progress-viz/tree/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：把 DSH 语义会话事件即时投影成进度 JSON，供独立 Python 看板读取。

> **核心亮点**：插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](#research-q01)。

> **风险与缺陷**：空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](#research-q02)和[Q03](#research-q03)。

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
  - [Q01 · 插件版与独立看板各承担哪段工作？](#detail-section-11)
  - [Q02 · 语义事件、阶段和成本估算如何产生？](#detail-section-12)
  - [Q03 · 空闲完成与恢复会话能否保持进度连续？](#detail-section-13)
  - [Q04 · 落盘和运维费用分布在首次、持续及故障恢复哪些环节？](#detail-section-14)
  - [Q05 · 怎样证伪“插件进度比独立解析更及时且可信”的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：headless 长任务需要了解阶段与最近动作，插件向同目录看板提供事件投影。详见[Q01](#research-q01)。

独立版看板轮询并解析 zstd 会话日志；插件直听事件，写已过滤进度 JSON。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 事件过滤 | 进度时间线 | 非完整会话日志 |
| 阶段/成本 | 看板字段 | 位置式百分比/固定估价 |
| 文件输出 | 看板消费 | 双写/终态锁死 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH session 事件 | 必需 | 推进状态 | 无进度 |
| 本地文件写权限 | 必需 | progress JSON | 看板回退/旧值 |
| 独立 Python 看板 | 展示可选 | 消费 JSON | 仅文件输出 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | 挂到任务 profile | 会话 JSON 生成 |
| 展示 | 看板同 DSH_HOME | 对照会话真相 |
| 故障 | 核日志/空闲恢复/账单 | 切回独立解析 |

**效果与成本**

#### 成本

| 阶段 | 插件具体动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 构建、挂执行 profile、对齐 DSH_HOME/progress 和看板 | Node/pnpm 与本地磁盘；购买价未见，未知 | 安装/联机验证工时未知 | 兼容/路径失败需重挂载排查 |
| 持续 | 每语义事件写会话 JSON，默认再写 current.json | 双份同步磁盘 IO，文件保留；实际开销/外部现金未知 | 检阶段/估价误判工时未知 | 长暂停恢复和日志累积频率未知 |
| 失败恢复 | 处理权限/磁盘写失败和错误终态 | 重写/重解析会增加 IO；金额未知 | 查 Host 日志、比对会话真相、重启/清理；工时未知 | 最后一写失败可能无重试事件 |

#### 效果

| 效果项 | 固定源码支持 | 未证实 |
| --- | --- | --- |
| 实时投影 | 语义事件直写 | 相对 zstd 延迟优势 |
| 时间线 | 过滤噪音/最近 N 条 | 实际监控准确率 |
| 估价 | usage×固定常量 | 真实账单一致性 |

> **思考**：空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](#research-q01)。

插件把噪音过滤前移到 DSH 事件源，减少看板直接读会话文件的依赖。详见[Q01](#research-q01)。

事件白名单和原子替换利于读取；内存状态 finished 锁死与每事件双写是主要可靠性/资源边界。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

空闲 finished 状态不可恢复，末项未完成时也显示 100%，费用字段有重复口径风险。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先把 JSON 当辅助状态并对照会话真相，修复/规避空闲恢复和估价问题后再作为运行监控依据。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认事件写盘链；同一会话空闲超时后继续被忽略，阶段 100% 是最后位置而非完成，cost_est 非账单。目标 Host/看板未运行。

- 已检查：作者 README、包清单、源码路径 plugin/README.md、plugin/src/index.ts、plugin/src/types.ts、plugin/package.json、README.md 及固定范围 inventory；组件：plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 plugin/README.md、plugin/src/index.ts、plugin/src/types.ts、plugin/package.json，并将根 README/独立看板用作边界背景；未运行插件或 Python 看板。旧 META 复用。
- 下一步：隔离 profile 联合看板做同步对照：长暂停/恢复、todo 未完末项、usage 双字段、并发、写失败、时延/IO。

**分析版本**

- **仓库**：[2008924/dsh-progress-viz](https://github.com/2008924/dsh-progress-viz)
- **版本号**：0.1.0（[固定提交 7369098](https://github.com/2008924/dsh-progress-viz/tree/736909845ac33cf5ac671e1a4b6beecc814d983f)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

与独立 zstd 解析并行对照延迟、资源和终态准确率，若会话恢复误判或误导超过收益则收窄或修正直写增量。详见[Q05](#research-q05)。

隔离 profile 联合看板做同步对照：长暂停/恢复、todo 未完末项、usage 双字段、并发、写失败、时延/IO。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 432 | 358 | 79 | — |
| .md | source | 1 | 93 | — | — | 716 |
| .ts | source | 2 | 565 | 411 | 124 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/2008924/dsh-progress-viz/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：事件直写进度是否比独立解析及时可信，空闲恢复与估价有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件版与独立看板各承担哪段工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件挂到执行任务的 DSH profile，订阅 session/created、session/event、session/disposed，把语义事件写进 progress/<session-id>.json 与 current.json；独立 Python 看板优先读这个输出，缺失时回退原本的会话 zstd 解析。研究对象是 plugin/ 组件，不把根仓库的 Python 看板或 ETA/飞书功能算成插件本身。插件输出的 eta_* 在看板对接中为空，不能把独立版 ETA 归功于插件。目标联机组合未在本轮运行。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/README.md:1-9](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/README.md#L1-L9)

插件/看板边界

```text
# dsh-progress-viz-plugin

[![DSH Market 收录徽章](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-zh.svg)](https://dsh.market/)

dsh 进度可视化插件：实时监听会话事件（`ctx.on('session/event')`），只保留
「语义事件」推进进度状态，并原子重写 `<DSH_HOME>/progress/<session-id>.json`
（及 `current.json`），供 [dsh-progress-viz 看板](../dashboard.py) 实时消费。
与「独立版」（看板直接 zstd 解析会话文件）的关系：插件版输出**已过滤噪音**的
实时进度 JSON，看板优先读取插件输出，缺失时回退独立版 zstd 解析。
```

**依据 2 · 作者声明**：[README.md:120-133](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/README.md#L120-L133)

独立版回退与 ETA

<details>
<summary>查看原文（14行）</summary>

```text
## 插件版（dsh-progress-viz-plugin）

除了「独立版」（看板直接 zstd 解析会话文件），本工具提供 **cordis 插件版**：
插件挂载到 dsh profile（任务执行的地方，如 headless），**实时监听会话事件**，
只保留语义事件（`todo/write`、`step/start`、`step/end`、`tool/call`、
`tool/result`、`assistant/message`、`turn/start`、`turn/end`、`session/title`、
`session`），过滤 chunk 等中间态噪音（`assistant/chunk`、`reasoning-chunks`、
`tool-call-chunks`、`text-chunks`、`request/*` 等），原子重写
`<DSH_HOME>/progress/<session-id>.json`（及 `current.json`）供看板消费。

**与独立版的关系**：看板新增数据源，**优先读插件输出**（实时、已过滤噪音）；
`<DSH_HOME>/progress/` 缺失或没有文件时，**自动回退**现有 zstd 解析路径
（行为不变，新增优先级不影响回退）。`/api/live` 字段语义不变（插件任务
`eta_*` 为 `None`、`tail` 由 `timeline` 派生）。
```

</details>

**依据 3 · 源码核查**：[plugin/src/index.ts:407-465](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L407-L465)

实际事件注册与文件写入

<details>
<summary>查看原文（59行）</summary>

```text
/**
 * 挂载插件：订阅会话生命周期与事件流，输出进度 JSON。
 * @param ctx - Cordis 上下文（会话事件源）。
 * @param config - 插件配置（可选字段带默认值）。
 */
export function apply(ctx: Context, config: ProgressVizConfig): void {
  const logger: { warn: (message: string) => void } = { warn: (message) => ctx.logger.warn(message) }
  const cfg: ResolvedConfig = {
    outDir: config.outDir?.trim() || defaultOutDir(),
    idleTimeoutMs: config.idleTimeoutMs ?? 15000,
    timelineMax: config.timelineMax ?? 50,
    writeCurrent: config.writeCurrent ?? true,
  }
  const states = new Map<string, SessionProgressState>()

  const write = (state: SessionProgressState): void => {
    const json = buildProgressJson(state, cfg.timelineMax)
    writeJsonAtomic(state.filePath, json, logger)
    if (cfg.writeCurrent) {
      writeJsonAtomic(join(cfg.outDir, 'current.json'), json, logger)
    }
  }

  const ensureState = (session: Session): SessionProgressState => {
    const id = String(session.header.id)
    let state = states.get(id)
    if (state === undefined) {
      state = createState(session, cfg.outDir)
      states.set(id, state)
    }
    return state
  }

  // 新会话开始 → 重置状态并创建进度文件
  ctx.on('session/created', (session) => {
    write(ensureState(session))
  })

  // 语义事件 → 推进状态并原子重写进度文件（chunk 噪音在此过滤）
  ctx.on('session/event', (session, event) => {
    const state = ensureState(session)
    handleEvent(state, event, cfg, write)
  })

  // 会话终态（进程退出/树销毁前触发）→ 标记 finished 并保留文件
  ctx.on('session/disposed', (session) => {
    const id = String(session.header.id)
    const state = states.get(id)
    if (state === undefined) return
    if (state.idleTimer !== undefined) {
      clearTimeout(state.idleTimer)
      state.idleTimer = undefined
    }
    if (!state.finished) {
      state.finished = true
      write(state)
    }
    states.delete(id) // 内存态释放；进度文件保留供看板读取
  })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义事件、阶段和成本估算如何产生？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

白名单保留 todo/write、step、tool、assistant/message、turn、session 等事件，其余过滤；todo 优先取首个 status 非 completed 项，无 todo 时 step/start 计数。阶段百分比用 idx/total，最后一项即使仍未完成也显示 100%，因此是位置指标，不是已完成比例。usage 同时累加 camelCase 和 snake_case 输入/输出字段；若一条事件同时带两种同义字段，会重复计数。缓存读取 tokens 另加价，但是否已包含在输入 tokens 内未判定。PRICES 固定常量仅对特定 DeepSeek 价格作估算，未见 usage 则 null；不等于实际账单。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/src/index.ts:44-64](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L44-L64)

价格与事件白名单

<details>
<summary>查看原文（21行）</summary>

```text
// DeepSeek 官方定价常量（元/百万 tokens，与 dashboard.py 的 PRICES 一致）：
//   输入（缓存未命中）¥2、输出 ¥8、缓存命中 ¥0.5 —— deepseek-chat 价近似。
//   本机会话模型为 deepseek-v4-flash，按 deepseek-chat 价估算（字段 cost_est 标注）。
const PRICES = { input: 2.0, output: 8.0, cache_read: 0.5 } as const

/**
 * 语义事件白名单：只把这些事件写入进度状态；其余（chunk 等中间态）一律
 * 过滤，避免看板时间线被刷屏。session 事件（会话 header）防御性保留。
 */
const SEMANTIC_TYPES = new Set<string>([
  'todo/write', 'step/start', 'step/end', 'tool/call', 'tool/result',
  'assistant/message', 'turn/start', 'turn/end', 'session/title', 'session',
])

/** 插件配置（全部可选带默认值：零配置即可挂载）。 */
export const Config: Schema<ProgressVizConfig> = Schema.object({
  outDir: Schema.string().default(''),
  idleTimeoutMs: Schema.number().default(15000),
  timelineMax: Schema.number().default(50),
  writeCurrent: Schema.boolean().default(true),
})
```

</details>

**依据 2 · 源码核查**：[plugin/src/index.ts:162-205](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L162-L205)

阶段算法

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * 从任务清单选当前阶段项 → [1-based idx, total]（与 session_progress 一致）：
 * 有 status 字段 → 第一个未完成项（completed 跳过）；全部完成取最后一项；
 * 无 status 字段 → 清单第 (已写次数-1) 项（越界钳制到 [1, total]）。
 */
function pickTodoStage(items: unknown[], todoCount: number): [number, number] {
  const total = items.length
  const hasStatus = items.some(it => it !== null && typeof it === 'object'
    && 'status' in (it as Record<string, unknown>))
  if (hasStatus) {
    for (let i = 0; i < total; i++) {
      const it = items[i]
      const status = it !== null && typeof it === 'object'
        ? (it as Record<string, unknown>).status : undefined
      if (status !== 'completed') return [i + 1, total]
    }
    return [total, total]
  }
  const pos = Math.max(1, Math.min(todoCount - 1, total))
  return [pos, total]
}

/** 清单项 → 标题文本（兼容 content/title 两种字段名）。 */
function itemText(it: unknown): string {
  if (it !== null && typeof it === 'object') {
    const rec = it as Record<string, unknown>
    return String(rec.content ?? rec.title ?? '')
  }
  return String(it)
}

/** 从状态计算当前阶段（todo 优先，step/start 兜底）。 */
function computeStage(state: SessionProgressState): {
  stage: string | null; idx: number; total: number
} {
  if (state.todos !== null && state.todos.length > 0) {
    const [idx, total] = pickTodoStage(state.todos, state.todoCount)
    return { stage: itemText(state.todos[idx - 1]) || null, idx, total }
  }
  if (state.stepCount > 0) {
    return { stage: `步骤${state.stepCount}`, idx: state.stepCount, total: 0 }
  }
  return { stage: null, idx: 0, total: 0 }
}
```

</details>

**依据 3 · 源码核查**：[plugin/src/index.ts:207-229](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L207-L229)

usage 累计与估价

<details>
<summary>查看原文（23行）</summary>

```text
/** 累计 assistant/message 的 usage tokens（camelCase 主，snake_case 兼容）。 */
function accumulateUsage(state: SessionProgressState, data: Record<string, unknown>): void {
  const u = data.usage
  if (u === null || typeof u !== 'object') return
  const rec = u as Record<string, unknown>
  const num = (key: string): number => {
    const v = rec[key]
    return typeof v === 'number' && Number.isFinite(v) ? v : 0
  }
  state.inputTokens += num('inputTokens') + num('prompt_tokens')
  state.outputTokens += num('outputTokens') + num('completion_tokens')
  state.cacheReadTokens += num('cacheReadTokens')
  state.usageSeen = true
}

/** 按 DeepSeek 定价常量估算成本（元）；未见 usage → null（禁止硬编假数据）。 */
function estimateCost(state: SessionProgressState): number | null {
  if (!state.usageSeen) return null
  const yuan = state.inputTokens * PRICES.input
    + state.outputTokens * PRICES.output
    + state.cacheReadTokens * PRICES.cache_read
  return yuan / 1_000_000.0
}
```

</details>

**依据 4 · 源码核查**：[plugin/src/index.ts:317-335](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L317-L335)

阶段百分比与 cost_est

<details>
<summary>查看原文（19行）</summary>

```text
/** 状态 → 进度 JSON（字段与看板 /api/live 任务字段对齐）。 */
function buildProgressJson(state: SessionProgressState, timelineMax: number): ProgressJson {
  const { stage, idx, total } = computeStage(state)
  const now = Date.now()
  return {
    session_id: state.sessionId,
    title: state.title,
    cwd: state.cwd,
    stage,
    stage_idx: idx,
    stage_total: total,
    stage_pct: total > 0 ? Math.round((idx / total) * 100) : 0,
    action: state.action,
    cost_est: estimateCost(state),
    elapsed_s: Math.max(0, Math.floor((now - state.startedAt) / 1000)),
    updated_at: new Date(now).toISOString(),
    finished: state.finished,
    timeline: state.timeline.slice(-timelineMax),
  }
```

</details>

#### 缺口

- 目标 usage 字段共存及缓存 token 口径未知
  **影响**：可能高估或重复计费
  **进一步探讨**：采集匿名目标事件与真实账单核口径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 空闲完成与恢复会话能否保持进度连续？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

turn/end 启动默认 15 秒空闲定时器，超时把 state.finished 设 true 并写盘；随后 handleEvent 对 finished 状态直接 return。除 session/disposed 删除内存 map、或插件重挂载之外，代码未在同一 session 后续事件到达时重开，故暂停超过阈值再继续的同会话在当前内存生命周期内会长期停在 finished。新创建/后续 event 都通过 ensureState 返回同一 finished state。进度 JSON 是启发式仪表而非会话终态真相。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/README.md:29-45](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/README.md#L29-L45)

作者结束语义

<details>
<summary>查看原文（17行）</summary>

```text
## 配置

全部可选（零配置即可挂载，见 `cordis.patch.yml`）：

| 键 | 默认 | 说明 |
|---|---|---|
| `outDir` | `<DSH_HOME>/progress` | 进度 JSON 输出目录 |
| `idleTimeoutMs` | `15000` | turn/end 后多久无新语义事件即标记 finished |
| `timelineMax` | `50` | 时间线条目上限（取最近 N 条） |
| `writeCurrent` | `true` | 是否同时写 `current.json`（指向最新会话） |

## 输出格式

每个会话一个文件：`<outDir>/<session-id>.json`（原子写：临时文件 + rename），
每次语义事件更新重写；会话结束（`session/disposed` 或空闲超时）后标记
`finished: true` 并保留文件；新会话开始（`session/created`）时重置状态。

```

</details>

**依据 2 · 源码核查**：[plugin/src/index.ts:338-349](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L338-L349)

finished 状态拒绝后续事件

<details>
<summary>查看原文（12行）</summary>

```text
/** 处理一个语义事件：推进状态 + 追加时间线 + 触发写入。 */
function handleEvent(
  state: SessionProgressState,
  event: SessionEvent,
  cfg: ResolvedConfig,
  write: (state: SessionProgressState) => void,
): void {
  if (state.finished) return // 已结束的会话不再更新（文件保留）
  const type = event.type as string
  if (!SEMANTIC_TYPES.has(type)) return // 过滤 chunk 等中间态噪音
  const data = (event as unknown as { data?: unknown }).data as Record<string, unknown> | undefined
  // 任何语义事件都说明会话仍活跃：取消之前的空闲定时器（turn/end 会重新启动）
```

</details>

**依据 3 · 源码核查**：[plugin/src/index.ts:392-405](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L392-L405)

空闲定时器置终态

<details>
<summary>查看原文（14行）</summary>

```text
/** turn/end 后启动空闲定时器：超时无新事件 → 标记 finished 并保留文件。 */
function armIdleTimer(
  state: SessionProgressState,
  cfg: ResolvedConfig,
  write: (state: SessionProgressState) => void,
): void {
  if (state.idleTimer !== undefined) clearTimeout(state.idleTimer)
  state.idleTimer = setTimeout(() => {
    state.idleTimer = undefined
    if (state.finished) return
    state.finished = true
    write(state)
  }, cfg.idleTimeoutMs)
}
```

</details>

**依据 4 · 源码核查**：[plugin/src/index.ts:430-465](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L430-L465)

内存 map 生命周期

<details>
<summary>查看原文（36行）</summary>

```text
  const ensureState = (session: Session): SessionProgressState => {
    const id = String(session.header.id)
    let state = states.get(id)
    if (state === undefined) {
      state = createState(session, cfg.outDir)
      states.set(id, state)
    }
    return state
  }

  // 新会话开始 → 重置状态并创建进度文件
  ctx.on('session/created', (session) => {
    write(ensureState(session))
  })

  // 语义事件 → 推进状态并原子重写进度文件（chunk 噪音在此过滤）
  ctx.on('session/event', (session, event) => {
    const state = ensureState(session)
    handleEvent(state, event, cfg, write)
  })

  // 会话终态（进程退出/树销毁前触发）→ 标记 finished 并保留文件
  ctx.on('session/disposed', (session) => {
    const id = String(session.header.id)
    const state = states.get(id)
    if (state === undefined) return
    if (state.idleTimer !== undefined) {
      clearTimeout(state.idleTimer)
      state.idleTimer = undefined
    }
    if (!state.finished) {
      state.finished = true
      write(state)
    }
    states.delete(id) // 内存态释放；进度文件保留供看板读取
  })
```

</details>

#### 缺口

- 目标 Host 是否在暂停时先 dispose 会话未知
  **影响**：决定恢复后是否触发该分支
  **进一步探讨**：同一 session 超过阈值继续发语义事件并检查 JSON

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 落盘和运维费用分布在首次、持续及故障恢复哪些环节？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

首次需构建并挂载 plugin/、配置与看板共用 DSH_HOME/progress，人工安装/核目录工时和现金费用未给。持续期间每个语义事件都同步将每会话 JSON 和默认 current.json 各写临时文件再 rename；这是原子替换防半文件，但高频事件仍有双份磁盘 IO，文件不在 finished 后自动删除。写失败只 warn，内存状态继续推进，下次语义事件才可能再写；若最后一次写失败，盘上终态会滞后。故障恢复要查权限/磁盘/目录/版本、重新触发事件或重启并比对会话真相，资源与工时均未知。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/src/index.ts:272-314](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L272-L314)

写盘/文件路径

<details>
<summary>查看原文（43行）</summary>

```text
/** 原子写：先写 <file>.tmp 再 rename（看板轮询永远读不到半截文件）。 */
function writeJsonAtomic(
  filePath: string,
  json: ProgressJson,
  logger: { warn: (message: string) => void },
): void {
  try {
    mkdirSync(dirname(filePath), { recursive: true })
    const tmp = `${filePath}.tmp`
    writeFileSync(tmp, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
    renameSync(tmp, filePath)
  } catch (error) {
    logger.warn(`progress-viz: 写入进度文件失败 ${filePath}: ${String(error)}`)
  }
}

/** 会话 id 安全化（文件名用；默认 session-xxx 已安全，防御性替换）。 */
function safeId(id: string): string {
  return id.replace(/[^A-Za-z0-9._-]/g, '_')
}

/** 新建会话状态（文件路径 = <outDir>/<session-id>.json）。 */
function createState(session: Session, outDir: string): SessionProgressState {
  const sessionId = String(session.header.id)
  return {
    sessionId,
    title: null,
    cwd: session.header.cwd ?? null,
    startedAt: session.header.createdAt,
    lastEventAt: session.header.createdAt,
    todos: null,
    todoCount: 0,
    stepCount: 0,
    action: null,
    timeline: [],
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    usageSeen: false,
    finished: false,
    idleTimer: undefined,
    filePath: join(outDir, `${safeId(sessionId)}.json`),
  }
```

</details>

**依据 2 · 源码核查**：[plugin/src/index.ts:412-465](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L412-L465)

双写及生命周期

<details>
<summary>查看原文（54行）</summary>

```text
export function apply(ctx: Context, config: ProgressVizConfig): void {
  const logger: { warn: (message: string) => void } = { warn: (message) => ctx.logger.warn(message) }
  const cfg: ResolvedConfig = {
    outDir: config.outDir?.trim() || defaultOutDir(),
    idleTimeoutMs: config.idleTimeoutMs ?? 15000,
    timelineMax: config.timelineMax ?? 50,
    writeCurrent: config.writeCurrent ?? true,
  }
  const states = new Map<string, SessionProgressState>()

  const write = (state: SessionProgressState): void => {
    const json = buildProgressJson(state, cfg.timelineMax)
    writeJsonAtomic(state.filePath, json, logger)
    if (cfg.writeCurrent) {
      writeJsonAtomic(join(cfg.outDir, 'current.json'), json, logger)
    }
  }

  const ensureState = (session: Session): SessionProgressState => {
    const id = String(session.header.id)
    let state = states.get(id)
    if (state === undefined) {
      state = createState(session, cfg.outDir)
      states.set(id, state)
    }
    return state
  }

  // 新会话开始 → 重置状态并创建进度文件
  ctx.on('session/created', (session) => {
    write(ensureState(session))
  })

  // 语义事件 → 推进状态并原子重写进度文件（chunk 噪音在此过滤）
  ctx.on('session/event', (session, event) => {
    const state = ensureState(session)
    handleEvent(state, event, cfg, write)
  })

  // 会话终态（进程退出/树销毁前触发）→ 标记 finished 并保留文件
  ctx.on('session/disposed', (session) => {
    const id = String(session.header.id)
    const state = states.get(id)
    if (state === undefined) return
    if (state.idleTimer !== undefined) {
      clearTimeout(state.idleTimer)
      state.idleTimer = undefined
    }
    if (!state.finished) {
      state.finished = true
      write(state)
    }
    states.delete(id) // 内存态释放；进度文件保留供看板读取
  })
```

</details>

**依据 3 · 作者声明**：[plugin/README.md:11-45](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/README.md#L11-L45)

安装和输出说明

<details>
<summary>查看原文（35行）</summary>

````text
## 安装

插件作为 cordis 插件挂载到目标 profile（任务执行的地方，如 headless）：

```bash
# 在 plugin/ 目录执行（registry 用国内 npmmirror）
cd publish/dsh-progress-viz/plugin
pnpm install --registry https://registry.npmmirror.com
pnpm build
dsh plugin --profile headless add <本插件目录绝对路径>
# 验证：dsh --profile headless --dump-config 输出应包含 progress-viz
```

> 说明：`dsh plugin add` 会执行 `pnpm add <路径>` 并把本包加入
> `dsh.profile.bundles`（本包声明了 `dsh.bundle.patch`）。若环境不支持
> `dsh plugin`，可手动把插件加入 profile 的 `package.json` 的
> `dependencies` 与 `dsh.profile.bundles` 数组后执行 `pnpm install`。

## 配置

全部可选（零配置即可挂载，见 `cordis.patch.yml`）：

| 键 | 默认 | 说明 |
|---|---|---|
| `outDir` | `<DSH_HOME>/progress` | 进度 JSON 输出目录 |
| `idleTimeoutMs` | `15000` | turn/end 后多久无新语义事件即标记 finished |
| `timelineMax` | `50` | 时间线条目上限（取最近 N 条） |
| `writeCurrent` | `true` | 是否同时写 `current.json`（指向最新会话） |

## 输出格式

每个会话一个文件：`<outDir>/<session-id>.json`（原子写：临时文件 + rename），
每次语义事件更新重写；会话结束（`session/disposed` 或空闲超时）后标记
`finished: true` 并保留文件；新会话开始（`session/created`）时重置状态。

````

</details>

#### 缺口

- 磁盘吞吐/会话数与失败频率未知
  **影响**：长期进度文件和双写可能累积资源
  **进一步探讨**：固定规模任务量测写盘次数/字节并注入写失败

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪“插件进度比独立解析更及时且可信”的增量？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已知独立看板按 zstd 轮询解析，插件监听 Host 事件并过滤噪音，但当前源码存在 15 秒空闲锁死、位置式 100% 与估价口径不确定。相对独立解析的创新假设是：事件直写可降低 UI 显示延迟和解析资源，同时不增加错误终态与阶段误导。条件是看板能读同一目录、Host 事件次序稳定、暂停后续跑能恢复。用相同受控会话同时驱动插件 JSON 和独立版 zstd，覆盖短/长暂停、最后一项进行中、usage 双字段、并发会话、写入失败；逐时间点比较阶段/finished/cost_est 与原事件真相、刷新延迟和 IO。若恢复会话被锁 finished 或错误率/资源不优于原路，假设被证伪；可先将 idle 标为暂时 inactive、恢复事件重开，并分开“当前位置”与“完成比例”指标。此为推导方案，固定版未实现也未执行对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-39](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/README.md#L19-L39)

独立版输入和轮询

<details>
<summary>查看原文（21行）</summary>

````text
## 原理

dsh 会把每次任务的完整事件流实时追加写入本地会话文件：

```
~/.dsh/sessions/<cwd编码>/<session-id>/session.jsonl.zstd
```

（zstd 压缩的 JSONL，每行一个事件，`type` 字段区分类型。）

本工具关心的事件（v1.1 扩展后）：

| 事件类型 | 含义 | 用途 |
| --- | --- | --- |
| `todo/write` | 模型写入任务清单（`data.todos`，每项有 `content` + `status`） | **阶段数据源**：取第一个未完成项为当前阶段 |
| `step/start` | 步骤边界 | 无 todo 时的兜底计数 |
| `tool/call` | 工具调用（`data.name` + `data.arguments`） | 最近动作 + 事件流/时间线 |
| `session/title` | dsh 自动生成的任务标题（`data.title`） | **任务标题**（卡片优先显示，无标题回退 cwd basename） |
| `assistant/message` | 模型消息（`data.usage` 含 token 统计） | **成本估算**：累计 tokens × DeepSeek 定价常量 |

解压必须用 zstandard 的 `stream_reader` 全量流式解压（`decompressobj` 只能解第一个 frame 是已知的坑）。看板每 4 秒轮询一次（重新扫描最近任务列表并逐任务解析），页面每 5 秒自动刷新。
````

</details>

**依据 2 · 作者声明**：[README.md:120-133](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/README.md#L120-L133)

看板优先插件/回退

<details>
<summary>查看原文（14行）</summary>

```text
## 插件版（dsh-progress-viz-plugin）

除了「独立版」（看板直接 zstd 解析会话文件），本工具提供 **cordis 插件版**：
插件挂载到 dsh profile（任务执行的地方，如 headless），**实时监听会话事件**，
只保留语义事件（`todo/write`、`step/start`、`step/end`、`tool/call`、
`tool/result`、`assistant/message`、`turn/start`、`turn/end`、`session/title`、
`session`），过滤 chunk 等中间态噪音（`assistant/chunk`、`reasoning-chunks`、
`tool-call-chunks`、`text-chunks`、`request/*` 等），原子重写
`<DSH_HOME>/progress/<session-id>.json`（及 `current.json`）供看板消费。

**与独立版的关系**：看板新增数据源，**优先读插件输出**（实时、已过滤噪音）；
`<DSH_HOME>/progress/` 缺失或没有文件时，**自动回退**现有 zstd 解析路径
（行为不变，新增优先级不影响回退）。`/api/live` 字段语义不变（插件任务
`eta_*` 为 `None`、`tail` 由 `timeline` 派生）。
```

</details>

**依据 3 · 源码核查**：[plugin/src/index.ts:338-405](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L338-L405)

过滤、阶段与空闲状态

<details>
<summary>查看原文（68行）</summary>

```text
/** 处理一个语义事件：推进状态 + 追加时间线 + 触发写入。 */
function handleEvent(
  state: SessionProgressState,
  event: SessionEvent,
  cfg: ResolvedConfig,
  write: (state: SessionProgressState) => void,
): void {
  if (state.finished) return // 已结束的会话不再更新（文件保留）
  const type = event.type as string
  if (!SEMANTIC_TYPES.has(type)) return // 过滤 chunk 等中间态噪音
  const data = (event as unknown as { data?: unknown }).data as Record<string, unknown> | undefined
  // 任何语义事件都说明会话仍活跃：取消之前的空闲定时器（turn/end 会重新启动）
  if (state.idleTimer !== undefined) {
    clearTimeout(state.idleTimer)
    state.idleTimer = undefined
  }
  state.lastEventAt = event.time
  switch (type) {
    case 'todo/write': {
      const items = todoItems(data)
      if (items.length > 0) state.todos = items
      state.todoCount += 1
      break
    }
    case 'step/start':
      state.stepCount += 1
      break
    case 'tool/call': {
      const action = formatAction(data ?? {})
      if (action !== null) state.action = action
      break
    }
    case 'assistant/message':
      accumulateUsage(state, data ?? {})
      break
    case 'turn/end':
      armIdleTimer(state, cfg, write)
      break
    case 'session/title': {
      const title = (data ?? {}).title
      if (typeof title === 'string' && title.trim().length > 0) state.title = title.trim()
      break
    }
    default:
      break // step/end、tool/result、turn/start、session：仅记时间线
  }
  const item: TimelineItem = { t: formatTime(event.time), type, desc: timelineDesc(type, data, state) }
  state.timeline.push(item)
  if (state.timeline.length > cfg.timelineMax) {
    state.timeline.splice(0, state.timeline.length - cfg.timelineMax) // 只留最近 N 条
  }
  write(state)
}

/** turn/end 后启动空闲定时器：超时无新事件 → 标记 finished 并保留文件。 */
function armIdleTimer(
  state: SessionProgressState,
  cfg: ResolvedConfig,
  write: (state: SessionProgressState) => void,
): void {
  if (state.idleTimer !== undefined) clearTimeout(state.idleTimer)
  state.idleTimer = setTimeout(() => {
    state.idleTimer = undefined
    if (state.finished) return
    state.finished = true
    write(state)
  }, cfg.idleTimeoutMs)
}
```

</details>

**依据 4 · 源码核查**：[plugin/src/index.ts:422-465](https://github.com/2008924/dsh-progress-viz/blob/736909845ac33cf5ac671e1a4b6beecc814d983f/plugin/src/index.ts#L422-L465)

写盘与会话生命周期

<details>
<summary>查看原文（44行）</summary>

```text
  const write = (state: SessionProgressState): void => {
    const json = buildProgressJson(state, cfg.timelineMax)
    writeJsonAtomic(state.filePath, json, logger)
    if (cfg.writeCurrent) {
      writeJsonAtomic(join(cfg.outDir, 'current.json'), json, logger)
    }
  }

  const ensureState = (session: Session): SessionProgressState => {
    const id = String(session.header.id)
    let state = states.get(id)
    if (state === undefined) {
      state = createState(session, cfg.outDir)
      states.set(id, state)
    }
    return state
  }

  // 新会话开始 → 重置状态并创建进度文件
  ctx.on('session/created', (session) => {
    write(ensureState(session))
  })

  // 语义事件 → 推进状态并原子重写进度文件（chunk 噪音在此过滤）
  ctx.on('session/event', (session, event) => {
    const state = ensureState(session)
    handleEvent(state, event, cfg, write)
  })

  // 会话终态（进程退出/树销毁前触发）→ 标记 finished 并保留文件
  ctx.on('session/disposed', (session) => {
    const id = String(session.header.id)
    const state = states.get(id)
    if (state === undefined) return
    if (state.idleTimer !== undefined) {
      clearTimeout(state.idleTimer)
      state.idleTimer = undefined
    }
    if (!state.finished) {
      state.finished = true
      write(state)
    }
    states.delete(id) // 内存态释放；进度文件保留供看板读取
  })
```

</details>

#### 缺口

- 看板延迟和准确性相对增量未知
  **影响**：不能仅凭架构声称更可靠
  **进一步探讨**：按上述受控会话对照计时/误差

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
