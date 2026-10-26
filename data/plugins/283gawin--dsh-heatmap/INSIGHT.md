# dsh-heatmap

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4ba131d](https://github.com/283Gawin/dsh-heatmap/tree/4ba131df0980c8c8af72901ca9fa0f31accb9a6d)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap)
<!-- END META -->

> **实现功能**：从全部DSH会话usage和工作区Git历史生成侧栏热力图、今日token/cache及模型费用估值。

> **核心亮点**：统一usage/model、Git和常驻趋势入口，纯聚合可核，增量在可见性/接线而非计费或生产力算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：未知模型默认估价且后缀override可能失效，失败/重复仓库缺覆盖说明；enabled不停止路由/扫描，估值非账单。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，统计到热力图如何走？](#detail-section-11)
  - [Q02 · 增量和估价/完整性/关闭的关键边界是什么？](#detail-section-12)
  - [Q03 · 依赖、隐私和读者步骤是什么？](#detail-section-13)
  - [Q04 · 三阶段成本效果如何评估？](#detail-section-14)
  - [Q05 · 工程复用、覆盖收据假设和采用结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人观察使用/提交趋势，需明确统计范围和估价，不能当产出或账单证明。

原始provider用量/账单与git log可替代；插件集中趋势，也增加价格/覆盖和Host补丁维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| usage趋势 | 全会话按日token/cache | 缺失/重试口径需核 |
| 估价 | 当前模型表乘分量 | 默认未知价/历史重估非账单 |
| Git趋势 | 仓库日提交 | 非个人贡献，根去重/截断需核 |
| 面板 | 91天UI/365天Host | enabled非停止采集开关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH persistence/webServer/subprocess/systemPrompt | Host必需 | 读全部会话/跑git/统计路由 | 版本/权限不满足影响统计完整性 |
| Web slots/settingsScope/React与DOM侧栏 | 客户端必需 | 设置卡/自愈挂载 | DOM/样式/设置命名空间需匹配 |
| Git及目标仓库读取权限 | 提交维度必需 | git log | 错误可静默缺数，非确认为0 |
| 价格覆盖/模型usage口径核对 | 费用解读必需 | 非账单估值 | 未知fallback/历史重估需标明 |
| 宿主设置白名单修改 | 作者文档所述条件 | 暴露activity-heatmap设置 | 升级覆盖需重补，额外维护 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/制品，确认全会话统计可见范围 | 先副本核usage和Git样本，不改正式宿主 |
| 核数 | 对照一组已知请求/模型/仓库 | 重试/未知模型/多工作树/缺日志分开 |
| 展示 | 只当趋势看热力图，费用明确估算 | 不用颜色/提交次数代表质量/生产力 |
| 恢复 | 失败核覆盖范围/缓存/设置而非直接补0 | 停用需核实际路由/轮询，不仅enabled |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 读全部日志/缓存样本与Git扫描 | 核模型口径、价格、仓库和宿主补丁 | 不新增LLM调用但非零CPU/内存 |
| 持续使用 | 每60秒请求，变更会话从0读/最多64根串行Git | 价格/路径/兼容维护 | 增量为文件签名重读，不是事件增量 |
| 失败恢复 | 重读/重启/重建缓存 | 核缺失与估价漂移，保留原始账单 | 扫描错误与0值当前不充分区分 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 活动趋势 | 按本地日聚合usage/Git日期 | 完整覆盖/个人归属和工作质量 |
| 费用估算 | 四token分量乘当前表 | 实际provider账单、历史价/促销/未知模型 |
| 低打扰展示 | TTL合流/四路读/侧栏 | 大历史资源和禁用/卸载行为 |

> **思考**：未知模型默认估价且后缀override可能失效，失败/重复仓库缺覆盖说明；enabled不停止路由/扫描，估值非账单。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一usage/model、Git和常驻趋势入口，纯聚合可核，增量在可见性/接线而非计费或生产力算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

统一usage/model、Git和常驻趋势入口，纯聚合可核，增量在可见性/接线而非计费或生产力算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯fold和price函数、SDK seam、TTL在途合流、四路读取、删除会话状态清理、HTTP错误通用化及Client定时/监听清理值得复用；它们不弥补统计口径/缺失和路由生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

未知模型默认估价且后缀override可能失效，失败/重复仓库缺覆盖说明；enabled不停止路由/扫描，估值非账单。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先核usage/价格/缺数和禁用授权再评估趋势面板，不能作精确支出核算。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持durable usage与Git活动的本地聚合和侧栏展示；默认估价、后缀覆盖、缺数/重复仓库及禁用语义限制解释，不能作精确账单或个人产出。覆盖与价格版本收据尚未验证。

- 已检查：作者 README、包清单、源码路径 src/host/stats-service.ts、src/core/aggregate.ts、src/client/heatmap.ts、src/core/types.ts、src/core/pricing.ts、src/index.ts、src/host/routes.ts、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host扫描/缓存/路由/注册、usage/价格核心和Client窗口/轮询；未核provider账单口径、当前价格或制品字节/全部UI。
- 下一步：进一步探讨从固定脱敏usage/重试/未知模型/后缀覆盖/重复repo/失败/禁用夹具核覆盖，再测大历史资源。

**分析版本**

- **仓库**：[283Gawin/dsh-heatmap](https://github.com/283Gawin/dsh-heatmap)
- **版本号**：0.1.0（[固定提交 4ba131d](https://github.com/283Gawin/dsh-heatmap/tree/4ba131df0980c8c8af72901ca9fa0f31accb9a6d)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨覆盖/价格版本收据，规范化仓库和模型/计费时间、未知分级及明确禁用/清理，维护成本未验证。详见[Q05](#research-q05)。

进一步探讨从固定脱敏usage/重试/未知模型/后缀覆盖/重复repo/失败/禁用夹具核覆盖，再测大历史资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2198 | 2040 | 205 | — |
| .md | source | 1 | 164 | — | — | 1507 |
| .ts | source | 14 | 1878 | 1318 | 410 | — |
| .tsx | source | 2 | 62 | 58 | 0 | — |
| .ts | test | 1 | 190 | 166 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap/issues?q=is%3Aissue+created%3A2026-09-22T07%3A00%3A58.231Z..2026-10-22T07%3A00%3A58.231Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A00%3A58.231Z..2026-10-22T07%3A00%3A58.231Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核全会话usage/Git趋势和模型估价，区分缺失、默认估价与账单及禁用/可见范围。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，统计到热力图如何走？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向想在DSH Web查看调用/提交活动趋势的个人用户。输入本地全部会话durable日志、会话cwd仓库及可选额外仓库/价格覆盖，输出逐日本地日桶、今日token/cache和估价。成功需清楚口径和覆盖，不能把提交次数当个人贡献或把估价当实付账单。

Host list全部会话，对日志size+mtime签名缓存，变更从0 readFrom后fold；usage来自assistant/message，最近request/header/context模型归属，同turn:step保留最后样本。最多四路读，Host日桶365天；Git最多64根逐个log、默认排merge，按输出日期计次。60秒TTL/在途合流后GET统计，Client60秒轮询，UI取最近91天，与README“近90天”略有差别。侧栏DOM自愈+设置卡，提示仅公告不是模型工具。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/stats-service.ts:31-38](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L31-L38)

TTL/并发/窗口。

```text
/** Snapshot freshness window; a scan runs at most once per window. */
const TTL_MS = 60_000
/** Concurrency cap while scanning session logs. */
const SESSION_CONCURRENCY = 4
/** Days the heatmap covers. */
const WINDOW_DAYS = 365
/** Git log output cap (a year of short dates is tiny; 1 MiB is generous). */
const GIT_OUTPUT_CAP = 1 << 20
```

**依据 2 · 源码核查**：[src/host/stats-service.ts:102-150](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L102-L150)

快照/Git与聚合。

<details>
<summary>查看原文（49行）</summary>

```text
  /** Snapshot with TTL caching; concurrent callers share one scan. */
  async snapshot(): Promise<HeatmapPayload> {
    const cached = this.cache
    if (cached !== undefined && Date.now() - cached.at < TTL_MS) return cached.payload
    if (this.inflight !== undefined) return this.inflight
    this.inflight = this.scan()
      .then((payload) => {
        this.cache = { payload, at: Date.now() }
        return payload
      })
      .finally(() => {
        this.inflight = undefined
      })
    return this.inflight
  }

  /** Drop the cache (settings changed); the next snapshot rescans. */
  invalidate(): void {
    this.cache = undefined
  }

  /** Full incremental scan: changed sessions re-read, new sessions added, git rescanned. */
  private async scan(): Promise<HeatmapPayload> {
    const now = Date.now()
    const days = emptyBuckets(WINDOW_DAYS, now)
    const samples = await this.scanSessions()
    const table = this.table()
    foldSamplesInto(days, samples, table)

    const roots = await this.collectRepos()
    const commitDates: string[] = []
    const since = dateKey(now - (WINDOW_DAYS - 1) * 86_400_000)
    for (const root of roots) {
      const argv = ['log', '--since=' + since + ' 00:00:00', '--date=short', '--pretty=format:%ad']
      if (!(this.config().includeMerges ?? false)) argv.push('--no-merges')
      try {
        const result = await this.git.run(argv, root)
        if (result.exitCode === 0) {
          commitDates.push(...parseGitLogDates(result.stdout))
        }
        // Non-zero (not a repository / no commits) is a normal absence.
      } catch {
        // A failed git run must not take the whole snapshot down.
      }
    }
    foldCommitsInto(days, commitDates)

    const todaySamples = samples.filter((sample) => dateKey(sample.time) === dateKey(now))
    return assemblePayload(days, todaySamples, table, now, this.config().usdCnyRate ?? 0)
```

</details>

**依据 3 · 源码核查**：[src/host/stats-service.ts:154-201](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L154-L201)

签名和变更重读。

<details>
<summary>查看原文（48行）</summary>

```text
  private async scanSessions() {
    const headers = await this.persistence.list()
    const all: ReturnType<typeof foldSessionUsages> = []

    // Discover repo roots from headers and refresh per-session signatures.
    const pending: { id: SessionId; signature: string }[] = []
    for (const header of headers) {
      if (typeof header.cwd === 'string' && header.cwd !== '') this.repoRoots.add(header.cwd)
      let signature = ''
      const location = this.persistence.locate(header)
      if (location !== undefined) {
        try {
          const info = await stat(location.path)
          signature = info.size + ':' + info.mtimeMs
        } catch {
          // The log may not be materialized yet; treat as new next round.
        }
      }
      const state = this.sessionStates.get(header.id)
      if (state !== undefined && state.signature === signature) {
        all.push(...state.samples)
        continue
      }
      pending.push({ id: header.id, signature })
    }

    let cursor = 0
    const workers = Array.from({ length: Math.min(SESSION_CONCURRENCY, Math.max(1, pending.length)) }, async () => {
      while (cursor < pending.length) {
        const item = pending[cursor]
        cursor += 1
        try {
          const { events } = await this.persistence.readFrom(item.id, 0)
          const samples = foldSessionUsages(events)
          this.sessionStates.set(item.id, { signature: item.signature, samples })
          all.push(...samples)
        } catch (error) {
          logError('session scan failed for ' + item.id + ': ' + String(error))
        }
      }
    })
    await Promise.all(workers)

    // Drop states for sessions that disappeared.
    const live = new Set(headers.map((header) => String(header.id)))
    for (const id of [...this.sessionStates.keys()]) {
      if (!live.has(id)) this.sessionStates.delete(id)
    }
```

</details>

**依据 4 · 源码核查**：[src/core/aggregate.ts:47-83](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L47-L83)

usage/model/step处理。

<details>
<summary>查看原文（37行）</summary>

```text
export function foldSessionUsages(events: readonly SessionEvent[]): UsageSample[] {
  let model = UNKNOWN_MODEL
  const latest = new Map<string, UsageSample>()
  for (const event of events) {
    switch (event.type) {
      case 'request/header': {
        const config = event.data.header?.config
        if (config !== undefined && typeof config.model === 'string' && config.model !== '') {
          model = config.model
        }
        break
      }
      case 'request/context': {
        if (typeof event.data.model === 'string' && event.data.model !== '') {
          model = event.data.model
        }
        break
      }
      case 'assistant/message': {
        const usage: TokenUsage | undefined = event.data.usage
        if (usage === undefined) break
        const key = `${event.data.turn}:${event.data.step}`
        latest.set(key, {
          time: event.time,
          inputTokens: usage.inputTokens ?? 0,
          cacheReadTokens: usage.cacheReadTokens ?? 0,
          cacheWriteTokens: usage.cacheWriteTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
          model,
        })
        break
      }
      default:
        break
    }
  }
  return [...latest.values()]
```

</details>

**依据 5 · 源码核查**：[src/client/heatmap.ts:68-69](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/client/heatmap.ts#L68-L69)

UI窗口。

```text
function windowDays(payload: HeatmapPayload): DayUsage[] {
  return payload.days.slice(Math.max(0, payload.days.length - HEATMAP_DAYS))
```

**依据 6 · 源码核查**：[src/core/types.ts:57-57](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/types.ts#L57-L57)

91天常量。

```text
export const HEATMAP_DAYS = 91
```

**依据 7 · 源码核查**：[src/client/heatmap.ts:214-225](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/client/heatmap.ts#L214-L225)

轮询/清理。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Begin polling and attach the visibility listener. */
  start(): void {
    void this.refresh()
    this.timer = window.setInterval(() => { void this.refresh() }, POLL_MS)
    document.addEventListener('visibilitychange', this.onVis)
  }

  dispose(): void {
    this.disposed = true
    if (this.timer !== undefined) clearInterval(this.timer)
    document.removeEventListener('visibilitychange', this.onVis)
    this.element.remove()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量和估价/完整性/关闭的关键边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献在统一SDK日志读取、usage/model归属、Git与持久面板，提供随时可见趋势；纯聚合可审计，比只猜字符量更有依据。但它不测任务成果，也不是账单计费引擎。

同turn:step只保最后usage是否正确依宿主重试日志语义，若多次实际付费则可能少计；缺usage默认没有样本、字段缺失补0。inputTokens被视为cache-miss后再加cacheRead/cacheWrite，需确认provider统一口径互斥。未知模型按固定默认价格估值而无unknown/覆盖比例，历史事件用本次当前价格重算。同一模型名不同provider/计价时段未保留。尤其table只包含内置/覆盖精确键，fold遇日期后缀样本缺精确键会priceFor(model,undefined)，前缀覆盖可能被忽略；纯priceFor支持override不等实际fold使用正确覆盖。

会话失败仅日志，Git非零/异常跳过，API仍成功、无缺数收据；仓库仅按cwd字符串去重，同一Git库多子目录/工作树可能重复算，历史repoRoots只加不清且只取前64，extra可能被截。Git是仓库全部可达历史作者日期，不代表当前用户或当前会话产出。

enabledfalse只使sync不注册公告，route已先注册、Stats和Client轮询仍可用；不是停止收集的总开关。Host获得disposeRoutes但未纳入effect返回/调用，源码未明确清理，热卸载还需宿主约定。GET只校验方法/path，不另做身份/Origin/会话范围；全部会话聚合可见性依宿主外层控制，不能以same-origin称已授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/aggregate.ts:65-76](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L65-L76)

step最后usage/缺字段0。

<details>
<summary>查看原文（12行）</summary>

```text
      case 'assistant/message': {
        const usage: TokenUsage | undefined = event.data.usage
        if (usage === undefined) break
        const key = `${event.data.turn}:${event.data.step}`
        latest.set(key, {
          time: event.time,
          inputTokens: usage.inputTokens ?? 0,
          cacheReadTokens: usage.cacheReadTokens ?? 0,
          cacheWriteTokens: usage.cacheWriteTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
          model,
        })
```

</details>

**依据 2 · 源码核查**：[src/core/aggregate.ts:96-98](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L96-L98)

分量合计。

```text
/** Billed token total for one day (all four components). */
export function billedFor(day: DayUsage): number {
  return day.inputTokens + day.cacheReadTokens + day.cacheWriteTokens + day.outputTokens
```

**依据 3 · 源码核查**：[src/core/pricing.ts:31-32](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/pricing.ts#L31-L32)

默认估价。

```text
/** Fallback price applied to models absent from the table. */
const DEFAULT_PRICE: ModelPrice = { inputPerM: 0.27, cacheReadPerM: 0.07, cacheWritePerM: 0, outputPerM: 1.1 }
```

**依据 4 · 源码核查**：[src/core/aggregate.ts:139-143](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L139-L143)

缺精确价格不传override。

```text
  const index = indexBuckets(days)
  for (const sample of samples) {
    const day = index.get(dateKey(sample.time))
    if (day === undefined) continue // older than the window: ignore
    mergeSample(day, sample, table[sample.model] ?? priceFor(sample.model, undefined))
```

**依据 5 · 源码核查**：[src/core/pricing.ts:281-289](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/pricing.ts#L281-L289)

只枚举精确键。

```text
export function resolvePriceTable(
  overrides: Record<string, { inputPerM?: number; cacheReadPerM?: number; cacheWritePerM?: number; outputPerM?: number }> | undefined,
): Record<string, ModelPrice> {
  const table: Record<string, ModelPrice> = {}
  const keys = new Set([...Object.keys(DEFAULT_MODEL_PRICES), ...Object.keys(overrides ?? {})])
  for (const model of keys) {
    table[model] = resolveRow(model, overrides, DEFAULT_MODEL_PRICES)
  }
  return table
```

**依据 6 · 源码核查**：[src/host/stats-service.ts:134-145](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L134-L145)

Git失败跳过。

<details>
<summary>查看原文（12行）</summary>

```text
    for (const root of roots) {
      const argv = ['log', '--since=' + since + ' 00:00:00', '--date=short', '--pretty=format:%ad']
      if (!(this.config().includeMerges ?? false)) argv.push('--no-merges')
      try {
        const result = await this.git.run(argv, root)
        if (result.exitCode === 0) {
          commitDates.push(...parseGitLogDates(result.stdout))
        }
        // Non-zero (not a repository / no commits) is a normal absence.
      } catch {
        // A failed git run must not take the whole snapshot down.
      }
```

</details>

**依据 7 · 源码核查**：[src/host/stats-service.ts:185-201](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L185-L201)

会话失败日志。

<details>
<summary>查看原文（17行）</summary>

```text
        try {
          const { events } = await this.persistence.readFrom(item.id, 0)
          const samples = foldSessionUsages(events)
          this.sessionStates.set(item.id, { signature: item.signature, samples })
          all.push(...samples)
        } catch (error) {
          logError('session scan failed for ' + item.id + ': ' + String(error))
        }
      }
    })
    await Promise.all(workers)

    // Drop states for sessions that disappeared.
    const live = new Set(headers.map((header) => String(header.id)))
    for (const id of [...this.sessionStates.keys()]) {
      if (!live.has(id)) this.sessionStates.delete(id)
    }
```

</details>

**依据 8 · 源码核查**：[src/host/stats-service.ts:205-211](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L205-L211)

根/64限制。

```text
  /** Repo roots: session cwds (deduped, up to a sane cap) plus configured extras. */
  private async collectRepos(): Promise<string[]> {
    const roots = [...this.repoRoots]
    for (const extra of this.config().extraRepos ?? []) {
      if (extra !== '' && !roots.includes(extra)) roots.push(extra)
    }
    return roots.slice(0, 64)
```

**依据 9 · 源码核查**：[src/index.ts:46-67](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/index.ts#L46-L67)

enabled/路由与dispose变量。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: Context, config?: HeatmapConfig): void {
  let current: () => HeatmapConfig = () => config ?? {}
  const stats = new StatsService(ctx, current)
  const disposeRoutes = registerStatsRoutes(ctx, stats)
  let disposeSection: (() => void) | undefined

  const sync = (): void => {
    if (disposeSection !== undefined) { disposeSection(); disposeSection = undefined }
    if ((current().enabled ?? true) === false) return
    disposeSection = ctx.systemPrompt.section({
      name: 'plugin:activity-heatmap',
      order: SECTION_ORDER,
      text: ACTIVITY_HEATMAP_GUIDANCE,
    })
    stats.invalidate()
  }

  installSettingsSection(ctx, HEATMAP_NS, Config, config ?? {}, {
    setSource: (source) => { current = source },
    onChange: sync,
  })
  sync()
```

</details>

**依据 10 · 源码核查**：[src/host/routes.ts:24-41](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/routes.ts#L24-L41)

HTTP仅方法/path。

<details>
<summary>查看原文（18行）</summary>

```text
  const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const url = new URL(req.url ?? '/', 'http://x')
    if (req.method !== 'GET' || url.pathname !== '/activity-heatmap/stats') {
      res.writeHead(405)
      res.end()
      return
    }
    try {
      const payload = await stats.snapshot()
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ ok: true, value: payload } satisfies StatsEnvelope<HeatmapPayload>))
    } catch (error) {
      ctx.logger.warn('[dsh-activity-heatmap] stats snapshot failed: ' + String(error))
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ ok: false, error: SCAN_ERROR } satisfies StatsEnvelope<never>))
    }
  }

```

</details>

#### 缺口

- 宿主重试usage累计/覆盖语义、provider缓存token归一化与实际账单价未确定。
  **影响**：不能把金额/总token作精确支出核算。
  **进一步探讨**：可固定SDK/模型provider和一组原始调用收据，逐分量核对后标估价/未知覆盖。
- 外层访问授权、Host路由卸载和统计缺失范围未由插件完整表达。
  **影响**：禁用/卸载和全会话聚合保密范围不能只看UI。
  **进一步探讨**：可从宿主exact路由生命周期/认证、enabled含义和缺数收据入手。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、隐私和读者步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包@linxin666/dsh-client-ui-activity-heatmap0.1.0依多项DSH rc.6服务和React，宿主硬注入persistence/webServer/subprocess/systemPrompt。README明确设置namespace需修改宿主白名单、升级后重补，不能称完全零宿主改动。库源码和发布lib同在仓库，本轮分析src不等核对制品字节。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH persistence/webServer/subprocess/systemPrompt | Host必需 | 读全部会话/跑git/统计路由 | 版本/权限不满足影响统计完整性 |
| Web slots/settingsScope/React与DOM侧栏 | 客户端必需 | 设置卡/自愈挂载 | DOM/样式/设置命名空间需匹配 |
| Git及目标仓库读取权限 | 提交维度必需 | git log | 错误可静默缺数，非确认为0 |
| 价格覆盖/模型usage口径核对 | 费用解读必需 | 非账单估值 | 未知fallback/历史重估需标明 |
| 宿主设置白名单修改 | 作者文档所述条件 | 暴露activity-heatmap设置 | 升级覆盖需重补，额外维护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/制品，确认全会话统计可见范围 | 先副本核usage和Git样本，不改正式宿主 |
| 核数 | 对照一组已知请求/模型/仓库 | 重试/未知模型/多工作树/缺日志分开 |
| 展示 | 只当趋势看热力图，费用明确估算 | 不用颜色/提交次数代表质量/生产力 |
| 恢复 | 失败核覆盖范围/缓存/设置而非直接补0 | 停用需核实际路由/轮询，不仅enabled |

读取全会话而非当前profile/工作区过滤，HTTP输出是聚合而非原文，但模型名/使用时间/费用仍可能敏感。设置覆盖会重估历史，应保留原始provider账单独立对照，本文不提供当前价表或采信作者价格声明为现行事实。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/package.json#L1-L5)

版本/包身份。

```text
{
  "name": "@linxin666/dsh-client-ui-activity-heatmap",
  "description": "Activity heatmap for the dsh web GUI sidebar: a persistent GitHub-style year grid switching between daily commits / token usage / estimated spend, plus a today line with all-session token totals, cache hit rate, and per-model auto-priced cost. Data is aggregated host-side from the durable session logs (provider usage) and the workspace git repositories, served at /activity-heatmap/stats. Hot-pluggable - mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes. Pricing table follows the xiufengsun/TokenTracker curated rates.",
  "version": "0.1.0",
  "type": "module",
```

**依据 2 · 源码核查**：[src/index.ts:39-49](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/index.ts#L39-L49)

硬服务/路由。

<details>
<summary>查看原文（11行）</summary>

```text
export const inject = ['sessionPersistence', 'webServer', 'subprocess', 'systemPrompt']

/**
 * Apply the host half.
 * @param ctx - context carrying sessionPersistence, webServer, subprocess, systemPrompt.
 * @param config - resolved plugin config (schema defaults applied by the loader).
 */
export function apply(ctx: Context, config?: HeatmapConfig): void {
  let current: () => HeatmapConfig = () => config ?? {}
  const stats = new StatsService(ctx, current)
  const disposeRoutes = registerStatsRoutes(ctx, stats)
```

</details>

**依据 3 · 作者声明**：[README.md:59-65](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/README.md#L59-L65)

作者白名单补丁条件。

```text
> 白名单（`dsh-host-apiproxy` 的 `WEB_SETTINGS_NAMESPACES`，官方包内
> hardcode）。新插件必须把它的 namespace 加进该白名单，否则设置页卡片显示
> "Settings not available for this plugin."。本插件需要把
> `"activity-heatmap"` 追加到该数组；**升级 dsh 后该修改会被覆盖，需重新
> 打补丁**。修改后重启 dsh web 生效。

## 配置
```

**依据 4 · 源码核查**：[src/host/stats-service.ts:154-161](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L154-L161)

全部会话。

```text
  private async scanSessions() {
    const headers = await this.persistence.list()
    const all: ReturnType<typeof foldSessionUsages> = []

    // Discover repo roots from headers and refresh per-session signatures.
    const pending: { id: SessionId; signature: string }[] = []
    for (const header of headers) {
      if (typeof header.cwd === 'string' && header.cwd !== '') this.repoRoots.add(header.cwd)
```

**依据 5 · 作者声明**：[src/core/pricing.ts:34-42](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/pricing.ts#L34-L42)

作者冻结表日期声明。

```text
/** Built-in price rows for the models DSH commonly routes to.
 * Rates follow the xiufengsun/TokenTracker curated price overrides
 * (verified against vendor pages 2026-06/07) plus vendor list pages.
 * Units: USD per 1M tokens. */
export const DEFAULT_MODEL_PRICES: Record<string, ModelPrice> = {
  // ---- DeepSeek (official api-docs.deepseek.com, verified 2026-06-10) ----
  // V4 series: current flat pricing (before the 2026-08-16 peak/off-peak switch).
  'deepseek-v4-flash': { inputPerM: 0.14, cacheReadPerM: 0.0028, cacheWritePerM: 0.14, outputPerM: 0.28 },
  'deepseek-v4-pro': { inputPerM: 0.435, cacheReadPerM: 0.003625, cacheWritePerM: 0.435, outputPerM: 0.87 },
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本效果如何评估？

**研究主题**：效果与总成本

#### 完整回答

首次读全日志，持续变更会话也从0读并缓存所有样本，窗口365并不限制源读取历史长度。四路/TTL/签名降低重复负担，但每周期仍stat会话、Git串行最多64根；subprocessgraceMs不是明确总执行timeout。相同size+mtime变化可能漏检，失败未表达在payload时容易误读为低活动。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 读全部日志/缓存样本与Git扫描 | 核模型口径、价格、仓库和宿主补丁 | 不新增LLM调用但非零CPU/内存 |
| 持续使用 | 每60秒请求，变更会话从0读/最多64根串行Git | 价格/路径/兼容维护 | 增量为文件签名重读，不是事件增量 |
| 失败恢复 | 重读/重启/重建缓存 | 核缺失与估价漂移，保留原始账单 | 扫描错误与0值当前不充分区分 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 活动趋势 | 按本地日聚合usage/Git日期 | 完整覆盖/个人归属和工作质量 |
| 费用估算 | 四token分量乘当前表 | 实际provider账单、历史价/促销/未知模型 |
| 低打扰展示 | TTL合流/四路读/侧栏 | 大历史资源和禁用/卸载行为 |

无额外模型调用不等零上下文成本，公告段每次进入提示也有资源；实际token支出仍由使用行为与provider决定。效果对照应测缺数/估价误差、扫描资源和用户决策帮助，不用颜色深或提交多来评价生产力。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/stats-service.ts:53-71](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L53-L71)

Git spawn/输出cap/grace。

<details>
<summary>查看原文（19行）</summary>

```text
export function subprocessGitRunner(ctx: Context): GitRunner {
  return {
    async run(argv, cwd) {
      const handle = ctx.subprocess.spawn({
        argv: ['git', ...argv],
        cwd,
        stdio: {
          stdin: 'ignore',
          stdout: { maxBytes: GIT_OUTPUT_CAP },
          stderr: { maxBytes: GIT_OUTPUT_CAP },
        },
        graceMs: 15_000,
      })
      const outcome = await handle.done
      return {
        exitCode: outcome.exitCode,
        stdout: handle.collected.stdout?.readFrom(0).text ?? '',
        stderr: handle.collected.stderr?.readFrom(0).text ?? '',
      }
```

</details>

**依据 2 · 源码核查**：[src/host/stats-service.ts:154-188](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L154-L188)

签名与全量重读。

<details>
<summary>查看原文（35行）</summary>

```text
  private async scanSessions() {
    const headers = await this.persistence.list()
    const all: ReturnType<typeof foldSessionUsages> = []

    // Discover repo roots from headers and refresh per-session signatures.
    const pending: { id: SessionId; signature: string }[] = []
    for (const header of headers) {
      if (typeof header.cwd === 'string' && header.cwd !== '') this.repoRoots.add(header.cwd)
      let signature = ''
      const location = this.persistence.locate(header)
      if (location !== undefined) {
        try {
          const info = await stat(location.path)
          signature = info.size + ':' + info.mtimeMs
        } catch {
          // The log may not be materialized yet; treat as new next round.
        }
      }
      const state = this.sessionStates.get(header.id)
      if (state !== undefined && state.signature === signature) {
        all.push(...state.samples)
        continue
      }
      pending.push({ id: header.id, signature })
    }

    let cursor = 0
    const workers = Array.from({ length: Math.min(SESSION_CONCURRENCY, Math.max(1, pending.length)) }, async () => {
      while (cursor < pending.length) {
        const item = pending[cursor]
        cursor += 1
        try {
          const { events } = await this.persistence.readFrom(item.id, 0)
          const samples = foldSessionUsages(events)
          this.sessionStates.set(item.id, { signature: item.signature, samples })
```

</details>

**依据 3 · 源码核查**：[src/host/stats-service.ts:205-211](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L205-L211)

仓库上限。

```text
  /** Repo roots: session cwds (deduped, up to a sane cap) plus configured extras. */
  private async collectRepos(): Promise<string[]> {
    const roots = [...this.repoRoots]
    for (const extra of this.config().extraRepos ?? []) {
      if (extra !== '' && !roots.includes(extra)) roots.push(extra)
    }
    return roots.slice(0, 64)
```

**依据 4 · 源码核查**：[src/index.ts:52-60](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/index.ts#L52-L60)

公告资源。

```text
  const sync = (): void => {
    if (disposeSection !== undefined) { disposeSection(); disposeSection = undefined }
    if ((current().enabled ?? true) === false) return
    disposeSection = ctx.systemPrompt.section({
      name: 'plugin:activity-heatmap',
      order: SECTION_ORDER,
      text: ACTIVITY_HEATMAP_GUIDANCE,
    })
    stats.invalidate()
```

#### 缺口

- 无大历史扫描CPU/内存/延迟、覆盖误差及趋势决策收益对照。
  **影响**：不能承诺低开销或精确财务结果。
  **进一步探讨**：可用固定脱敏日志和规范化Git库对照原始计数/账单，计所有扫描与维护资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用、覆盖收据假设和采用结论？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯fold和price函数、SDK seam、TTL在途合流、四路读取、删除会话状态清理、HTTP错误通用化及Client定时/监听清理值得复用；它们不弥补统计口径/缺失和路由生命周期。

可探讨未验证的“覆盖/价格版本收据”。每次payload附会话成功/失败/缺usage、仓库规范common-dir去重/截断、时间窗口和模型价命中来源；未知价不默默默认，保存实际provider/模型/计费时间以及价格版本，显示估值与账单差。对日期后缀统一同一resolve逻辑并让禁用停止路由/轮询、dispose明确释放。在已有趋势上可避免把不完整/重估值当真实变化。代价是数据隐私/历史价维护和更多元数据。可用相同步重试、缺usage、后缀override、重复repo、多于64根、读取失败/禁用卸载夹具研究。

推荐observe，先作为有缺口的活动趋势研究，不直接用于实付核算或个人产出评价。继续从usage/价格命中/覆盖收据、禁用与授权范围入手，再评估小范围面板试用。发现未知被补确定价格、失败当0、重复计数、禁用仍读/暴露或统计与已知样本不符时，应停止据此决策，保留原始账单/日志对照。本轮无真实会话扫描。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/stats-service.ts:102-121](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L102-L121)

TTL/inflight。

<details>
<summary>查看原文（20行）</summary>

```text
  /** Snapshot with TTL caching; concurrent callers share one scan. */
  async snapshot(): Promise<HeatmapPayload> {
    const cached = this.cache
    if (cached !== undefined && Date.now() - cached.at < TTL_MS) return cached.payload
    if (this.inflight !== undefined) return this.inflight
    this.inflight = this.scan()
      .then((payload) => {
        this.cache = { payload, at: Date.now() }
        return payload
      })
      .finally(() => {
        this.inflight = undefined
      })
    return this.inflight
  }

  /** Drop the cache (settings changed); the next snapshot rescans. */
  invalidate(): void {
    this.cache = undefined
  }
```

</details>

**依据 2 · 源码核查**：[src/host/stats-service.ts:180-201](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L180-L201)

并发和清理。

<details>
<summary>查看原文（22行）</summary>

```text
    let cursor = 0
    const workers = Array.from({ length: Math.min(SESSION_CONCURRENCY, Math.max(1, pending.length)) }, async () => {
      while (cursor < pending.length) {
        const item = pending[cursor]
        cursor += 1
        try {
          const { events } = await this.persistence.readFrom(item.id, 0)
          const samples = foldSessionUsages(events)
          this.sessionStates.set(item.id, { signature: item.signature, samples })
          all.push(...samples)
        } catch (error) {
          logError('session scan failed for ' + item.id + ': ' + String(error))
        }
      }
    })
    await Promise.all(workers)

    // Drop states for sessions that disappeared.
    const live = new Set(headers.map((header) => String(header.id)))
    for (const id of [...this.sessionStates.keys()]) {
      if (!live.has(id)) this.sessionStates.delete(id)
    }
```

</details>

**依据 3 · 源码核查**：[src/core/aggregate.ts:139-143](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L139-L143)

价格命中收据起点。

```text
  const index = indexBuckets(days)
  for (const sample of samples) {
    const day = index.get(dateKey(sample.time))
    if (day === undefined) continue // older than the window: ignore
    mergeSample(day, sample, table[sample.model] ?? priceFor(sample.model, undefined))
```

**依据 4 · 源码核查**：[src/index.ts:46-67](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/index.ts#L46-L67)

禁用/卸载起点。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: Context, config?: HeatmapConfig): void {
  let current: () => HeatmapConfig = () => config ?? {}
  const stats = new StatsService(ctx, current)
  const disposeRoutes = registerStatsRoutes(ctx, stats)
  let disposeSection: (() => void) | undefined

  const sync = (): void => {
    if (disposeSection !== undefined) { disposeSection(); disposeSection = undefined }
    if ((current().enabled ?? true) === false) return
    disposeSection = ctx.systemPrompt.section({
      name: 'plugin:activity-heatmap',
      order: SECTION_ORDER,
      text: ACTIVITY_HEATMAP_GUIDANCE,
    })
    stats.invalidate()
  }

  installSettingsSection(ctx, HEATMAP_NS, Config, config ?? {}, {
    setSource: (source) => { current = source },
    onChange: sync,
  })
  sync()
```

</details>

**依据 5 · 源码核查**：[src/client/heatmap.ts:221-225](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/client/heatmap.ts#L221-L225)

客户端清理。

```text
  dispose(): void {
    this.disposed = true
    if (this.timer !== undefined) clearInterval(this.timer)
    document.removeEventListener('visibilitychange', this.onVis)
    this.element.remove()
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
