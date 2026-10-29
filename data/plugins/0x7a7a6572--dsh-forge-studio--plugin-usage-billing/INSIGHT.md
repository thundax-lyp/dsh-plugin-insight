# Usage Billing

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,937](https://img.shields.io/static/v1?label=npm+30d&message=1%2C937&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)
<!-- END META -->

> **功能**：从 DSH 会话日志聚合 token 用量，以价格与汇率快照估算费用并显示历史回填、预算和未计价状态。

> **亮点**：usage、snapshot、backfilled与priced分开并以稳定ID分片，方便解释历史估算和unknown，见 [Q01](#research-q01)。

> **主要限制**：全局峰谷/跨provider同名兜底可能错价，当前alias重折可覆盖旧ID费用，写时快照不等历史不可变，见 [Q02](#research-q02)。

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
  - [Q01 · 账本输入、使用者与真实增量是什么？](#detail-section-11)
  - [Q02 · 提供商计价、同名兜底和旧行锁价是否可靠？](#detail-section-12)
  - [Q03 · 采用与恢复负担是什么，下一步计价契约如何证伪？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者可看会话/项目/模型的日志用量与费用估算，合格结果需可解释计量和价差，见 [Q01](#research-q01)。

服务商原始usage/账单与人工表；插件增加日志聚合和来源解释，不生成独立收款事实或预算强制执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| usage聚合 | 会话/项目/模型可见 | 依赖上游usage，缺失不出费行 |
| 快照估价 | 解释历史与unknown | 全局倍率/同名兜底不是合同 |
| 分片账本 | 稳定ID及重折 | 当前alias可改变旧行 |
| 预算视图 | 本地进度提示 | 非硬调用上限/账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH storageDomain/sessionQuery | 核心必需 | 账本与真实日志 | revision不能代真实读取 |
| sessionPersistence revision | 可选 | 跳过未变日志 | 缺失重读I/O增加 |
| 价格/FX/计量桶约定 | 金额必需 | 日志到估价 | unknown或错匹配须人工核 |
| 网络元数据/UI remote | 刷新/展示 | 目录/汇率及视图 | 降级非实时合同证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核usage/schema和价目 | provider合同单独确认 |
| 回填 | Host读历史、分片记行 | snapshot/backfilled/unknown可解释 |
| 持续 | 变化重折与刷新 | 比对旧行及alias含义 |
| 异常 | 核片/水位/旧快照 | 不把显示总额当账单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 冷读/分片/存储未知 | 计量、价格、FX核对 | 安装前是估算 |
| 持续使用 | 重折/索引/网络未知 | unknown/alias/预算复核 | 无新增模型调用不等零开销 |
| 失败恢复 | 重读/重建资源未知 | 查旧价、重复、残留和水位 | 多片非全局事务 |
| 退出 | 历史快照存储未知 | 导出并保留口径 | 卸载不代对账 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量可见 | 有usage事件和seq稳定ID | 失败/漏usage覆盖 |
| 费用解释 | 快照/FX/unknown | 合同正确、同名/峰谷错价 |
| 历史记录 | 分片与backfilled | 普通重折后金额不变 |

> **思考**：全局峰谷/跨provider同名兜底可能错价，当前alias重折可覆盖旧ID费用，写时快照不等历史不可变，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：usage、snapshot、backfilled与priced分开并以稳定ID分片，方便解释历史估算和unknown，见 [Q01](#research-q01)。

[Q01](#research-q01) 来源分离与幂等ID有价值；[Q02](#research-q02) 行覆盖和多片失败不能由storage名称推导事务，计价契约需按provider限定。

<a id="detail-section-5"></a>

### 1.4 主要限制

全局峰谷/跨provider同名兜底可能错价，当前alias重折可覆盖旧ID费用，写时快照不等历史不可变，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并用合成夹具核规则和锁价，不用于结算/硬预算；对账不一致保留旧账本回provider原始记录，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核心计量/计价/重折代表链已核，建议观察；未读真实会话、取当前价或运行。未来契约无效果证据。

- 已检查：作者 README、包清单、源码路径 packages/plugin-usage-billing/package.json、packages/plugin-usage-billing/src/aggregate.ts、packages/plugin-usage-billing/src/fold.ts、packages/plugin-usage-billing/src/index.ts、packages/plugin-usage-billing/src/ledger-store.ts、packages/plugin-usage-billing/src/pricing/cost.ts、packages/plugin-usage-billing/src/pricing/tiers.ts、packages/plugin-usage-billing/src/service.ts 及固定范围 inventory；组件：packages/plugin-usage-billing。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧六题/11findings及自code依赖复核，完整组件inventory；当前读入口、fold/aggregate、cost/tiers与ledger/service代表链，未审全部Client/主题/远端价格。
- 下一步：同名异价/缺usage-cache/alias变化/跨日/第N片失败夹具，对照原始usage与授权匿名账单；计量、价目、FX、人工负担分开。本轮无运行。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：1.3.1（[固定提交 9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

提供商计量/合同/FX的不可变行收据，普通重折保旧、重估显式修订，以新夹具和授权对账证伪，见 [Q03](#research-q03)。

同名异价/缺usage-cache/alias变化/跨日/第N片失败夹具，对照原始usage与授权匿名账单；计量、价目、FX、人工负担分开。本轮无运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 47 | — | — | 994 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 73 | 7518 | 5263 | 1571 | — |
| .tsx | source | 39 | 3186 | 2612 | 459 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：日志计量、价格/FX与历史重折的边界是否支持可解释账本，何时不能当真实账单？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账本输入、使用者与真实增量是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@zzerx/dsh-plugin-usage-billing 1.3.1是依赖DSH的原生计费显示插件，面向查看会话/项目/模型token及估价的维护者。输入来自持久日志assistant/message usage及request/context/header的provider/model；只有有usage才出费用行，缺usage的消息只计calls，不能覆盖所有失败请求或提供商漏报。日志usage是上游报告，不是插件独立计量，费用更不是服务商扣款。

入口强注入storageDomain，sessionQuery真正读会话、sessionPersistence提供变化revision，缺revision会重读；fold按session+seq形成稳定ID、事件时间选价格/FX快照，保存priced、snapshotId与安装前backfilled。相较手工算总token或一个总金额，贡献是原始usage与估价来源、历史估算/未计价分开，提供可解释聚合。需要核计量桶互斥口径、价格匹配和预算提示，合格结果是能解释差异，不是UI数字更完整。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/package.json:2-4](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/package.json#L2-L4)

版本和自述。

```text
  "name": "@zzerx/dsh-plugin-usage-billing",
  "version": "1.3.1",
  "description": "计费显示：从既有会话日志聚合真实 token 用量，按事件时刻价格写时锁定费用；侧栏 / 输入框下方入口 + 点击弹层 + 设置页用量视图。",
```

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:31-38](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/index.ts#L31-L38)

storageDomain落地。

```text
  const domainService = ctx.get('storageDomain')
  if (domainService === undefined) {
    ctx.logger.warn('[plugin-usage-billing] storageDomain 未装配，计费聚合不可用（插件已降级）')
    return
  }

  const domain = await domainService.open(usageBillingDomain)
  ctx.effect(() => () => { void domain.close() })
```

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:63-83](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/index.ts#L63-L83)

真实sessionQuery与网络价格接线。

<details>
<summary>查看原文（21行）</summary>

```text
      const q = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (q === undefined) return []
      return (await q.listSessions()).map((r) => ({ header: r.header, stamp: null }))
    },
    readSession: async (id: string) => {
      const q = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (q === undefined) throw new Error('sessionQuery unavailable')
      const snap = await q.readSession(id as never)
      return { session: snap.session, events: [...snap.events] }
    },
  }

  const service = new UsageBillingService(ctx, {
    domain,
    settings,
    installAt,
    source,
    fetchPricing: async ({ force, ttlHours }) => {
      const web = ctx.get('web')
      if (web === undefined) return { ok: false, reason: 'web 服务未装配' }
      return await fetchPricingFromNetwork({ web, snapshots, now: () => Date.now() }, force, ttlHours)
```

</details>

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:53-108](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/fold.ts#L53-L108)

usage门、稳定ID与快照/估算字段。

<details>
<summary>查看原文（56行）</summary>

```text
  for (const event of events) {
    if (event.seq > lastSeq) lastSeq = event.seq
    if (event.time > lastTime) lastTime = event.time

    if (event.type === 'request/context') {
      const d = event.data as { provider?: unknown; model?: unknown }
      if (typeof d.provider === 'string' && typeof d.model === 'string') {
        fromContext = { provider: d.provider, model: d.model }
      }
      continue
    }
    if (event.type === 'request/header') {
      const cfg = (event.data as { header?: { config?: { provider?: unknown; model?: unknown } } }).header?.config
      if (typeof cfg?.provider === 'string' && typeof cfg.model === 'string') {
        fromHeader = { provider: cfg.provider, model: cfg.model }
      }
      continue
    }
    if (event.type !== 'assistant/message') continue

    calls += 1
    const usage = (event.data as { usage?: import('@deepseek-ai/dsh-llm').TokenUsage }).usage
    if (usage === undefined) continue

    const who = fromContext ?? fromHeader ?? UNKNOWN
    const alias = ctx.aliases.get(aliasId(who.provider, who.model))
    const table = ctx.resolvePrice(event.time)
    const keys = priceKeyCandidates(who.provider, who.model, alias)
    const { tier, factor } = tierAndFactorAt(event.time, isCnHoliday)
    const priced = priceUsage(usage, table.entries, keys, table.usdToCny, factor)
    const modelLabel = `${who.provider}/${who.model}`
    if (!priced.priced) unpricedModels.add(modelLabel)

    rows.push({
      id: ledgerKey(ctx.session.id, event.seq),
      sessionId: ctx.session.id,
      seq: event.seq,
      time: event.time,
      provider: who.provider,
      model: who.model,
      day: dayKey(event.time),
      ...(ctx.session.cwd === undefined ? {} : { cwd: ctx.session.cwd }),
      isSubagent: ctx.session.origin === 'subagent',
      ...(ctx.session.delegationDepth === undefined ? {} : { delegationDepth: ctx.session.delegationDepth }),
      input: usage.inputTokens,
      cacheRead: usage.cacheReadTokens ?? 0,
      cacheWrite: usage.cacheWriteTokens ?? 0,
      output: usage.outputTokens,
      reasoning: usage.reasoningTokens ?? 0,
      costCny: priced.costCny,
      currency: priced.currency,
      priced: priced.priced,
      snapshotId: table.snapshotId,
      ...(tier === null ? {} : { tier }),
      backfilled: event.time < ctx.installAt,
    })
```

</details>

#### 缺口

- provider usage完整性、宿主实际读写和账单对照未验证。
  **影响**：不把日志估价或写时快照当真实账单与硬预算保障。
  **进一步探讨**：先用合成日志核计量桶、缺usage和seq去重，再经授权用匿名已知账单逐层对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提供商计价、同名兜底和旧行锁价是否可靠？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

关键限制仍在计价契约。fold按时间tierAndFactorAt求倍率，再将factor传priceUsage，未按provider选择规则；tiers有全局空闲倍率0.5，不能推广为所有提供商合同。priceUsage又可按模型名跨provider选表内首条同名价格，确定性不代表合同同价；cache字段缺失按0，reasoning已归output的口径也依赖宿主统一约定。缺价格/无有效USD汇率标priced:false有助揭示unknown，但命中错误同名价会是priced:true，未知提示不能覆盖这种错价。

写时锁价不等普通重折永久不变：aggregate遇revision变化会用当前alias全量fold，再对同ID不同row执行putMany。旧费用可被当前alias/新推导覆盖，即使专用repricing只补未计价行；快照存在不证明所有配置变化下金额含义稳定。分片upsert与水位先后降低重复写，但多片写/水位不是本包能保证的全局事务，失败需核实际分片与重复/残留。故金额用于结算、对外承诺或预算硬约束缺少核心依据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:77-82](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/fold.ts#L77-L82)

当前alias及未限定provider倍率。

```text
    const who = fromContext ?? fromHeader ?? UNKNOWN
    const alias = ctx.aliases.get(aliasId(who.provider, who.model))
    const table = ctx.resolvePrice(event.time)
    const keys = priceKeyCandidates(who.provider, who.model, alias)
    const { tier, factor } = tierAndFactorAt(event.time, isCnHoliday)
    const priced = priceUsage(usage, table.entries, keys, table.usdToCny, factor)
```

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/pricing/tiers.ts:25-35](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/pricing/tiers.ts#L25-L35)

全局时间/倍率规则。

<details>
<summary>查看原文（11行）</summary>

```text
const PEAK_WINDOWS = [[540, 720], [840, 1080]] as const

/** 起点取参考实现记录的政策变更点（北京 2026-08-17，官网未标日期）。 */
export const TIER_RULES: readonly TierRule[] = [
  {
    since: Date.UTC(2026, 7, 16, 16),
    peakWindows: PEAK_WINDOWS,
    weekdaysOnly: true,
    holidays: 'CN',
    offPeakRatio: 0.5,
  },
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:40-65](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/pricing/cost.ts#L40-L65)

跨provider同名索引。

<details>
<summary>查看原文（26行）</summary>

```text
/** 同名兜底候选的前缀：首段 `*` + 斜杠 + 模型名 = 「任何 provider 下叫这个名字的价」。 */
const NAME_FALLBACK_PREFIX = `${WILDCARD}/`

/**
 * 表内「模型名 → 命中键」索引（延迟构建，按表的键**插入顺序**取第一条）。
 *
 * 插入顺序即优先级来源：内置目录在安装时就写进基准快照，网络刷新只会往后追加 delta，
 * 所以同一个模型名有多个 provider 时先出现的（目录里的官方 provider）胜出 —— 确定性、可解释。
 *
 * 用 WeakMap 挂在价目表本身上：快照表是不可变对象，按表缓存不会串味，也不会泄漏。
 */
const nameIndexCache = new WeakMap<object, Map<string, string>>()

/** 表内同名条目键；没有则 undefined。 */
function sameNameEntryKey(table: Readonly<Record<string, PriceEntry>>, name: string): string | undefined {
  let index = nameIndexCache.get(table)
  if (index === undefined) {
    index = new Map<string, string>()
    for (const key of Object.keys(table)) {
      const slash = key.indexOf('/')
      if (slash <= 0) continue
      const modelPart = key.slice(slash + 1)
      // `<provider>/*` 与 `*/*` 是兜底价，不是「某个模型的同名价」。
      if (modelPart === WILDCARD) continue
      const normalized = normalizeModelId(modelPart)
      if (normalized !== '' && !index.has(normalized)) index.set(normalized, key)
```

</details>

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:77-117](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/pricing/cost.ts#L77-L117)

兜底命中、unknown和实际费用式。

<details>
<summary>查看原文（41行）</summary>

```text
function entryFor(table: Readonly<Record<string, PriceEntry>>, key: string): PriceEntry | undefined {
  const direct = table[key]
  if (direct !== undefined) return direct
  if (!key.startsWith(NAME_FALLBACK_PREFIX)) return undefined
  const hit = sameNameEntryKey(table, key.slice(NAME_FALLBACK_PREFIX.length))
  return hit === undefined ? undefined : table[hit]
}

/**
 * 按 keys 顺序查价并计价（首段为 `*` 的候选 = 同名兜底，见 `priceKeyCandidates`）。
 * @param priceFactor - 档位系数：空闲档传规则倍率（官方 0.5），高峰档省略。
 */
export function priceUsage(
  usage: TokenUsage,
  table: Readonly<Record<string, PriceEntry>>,
  keys: readonly string[],
  usdToCny: number,
  priceFactor = 1,
): PriceResult {
  for (let rank = 0; rank < keys.length; rank++) {
    const key = keys[rank]!
    const entry = entryFor(table, key)
    if (entry === undefined) continue
    if (entry.currency === 'USD' && !(usdToCny > 0)) {
      // 汇率不可用：宁可标成「不可计价」也不锁一个 0 进账本。
      // matchedKey 非 null 是它与「未收录」（matchedKey === null）的区别。
      return { costCny: 0, currency: entry.currency, priced: false, matchedKey: key, matchRank: rank }
    }
    const s = splitUsage(usage)
    const native = (s.input * entry.input + s.cacheRead * entry.cacheRead
      + s.cacheWrite * entry.cacheWrite + s.output * entry.output) / 1_000_000 * priceFactor
    const costCny = entry.currency === 'USD' ? native * usdToCny : native
    return {
      costCny: Math.max(0, costCny),
      currency: entry.currency,
      priced: true,
      matchedKey: key,
      matchRank: rank,
    }
  }
  return { costCny: 0, currency: 'CNY', priced: false, matchedKey: null, matchRank: -1 }
```

</details>

**依据 5 · 源码核查**：[packages/plugin-usage-billing/src/aggregate.ts:95-125](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/aggregate.ts#L95-L125)

当前alias重折与覆盖旧ID、水位次序。

<details>
<summary>查看原文（31行）</summary>

```text
    try {
      const wm = deps.folds.get(foldKey(header.id))
      // 戳相同 = 这份日志自上次折叠以来没变过；headerCreatedAt 只是 id 复用时的兜底。
      // `rebuild` 那一趟**故意不看水位**：账本换容器后水位对应的是旧容器，必须整语料重折一遍。
      if (!opts.rebuild && wm !== undefined && stamp !== null && wm.stamp === stamp && wm.headerCreatedAt === header.createdAt) {
        skipped += 1
        continue
      }
      const snap = await deps.source.readSession(header.id)
      const result = foldEvents(snap.events, {
        session: snap.session,
        installAt: deps.installAt,
        aliases: aliasMap,
        resolvePrice: (at) => resolveSnapshotAt(at, snapshots),
      })
      // 一个会话一轮只写一次：它的行落在同一片（跨天最多两片）上，逐行写会把整片重写几十遍。
      // 只有内容真的变了才落盘：正在写的会话每轮都会被重折，绝大多数行是上一轮的旧行。
      const changed = result.rows.filter((row) => {
        const previous = deps.ledger.get(row.id)
        return previous === undefined || !sameRow(previous, row)
      })
      await deps.ledger.putMany(changed)
      await deps.folds.put(foldKey(header.id), {
        sessionId: header.id,
        // 戳为 null 时不写这个字段：下一轮继续整会话重读，等后端能给出戳为止。
        ...(stamp === null ? {} : { stamp }),
        foldedThroughSeq: result.lastSeq,
        lastTime: result.lastTime,
        headerCreatedAt: header.createdAt,
        lastSnapshotId: resolveSnapshotAt(result.lastTime, snapshots).snapshotId,
      })
```

</details>

**依据 6 · 源码核查**：[packages/plugin-usage-billing/src/ledger-store.ts:108-115](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/ledger-store.ts#L108-L115)

多片写与内存更新。

```text
      const merged = mergeShardRows(kept, [...patch.incoming.values()])
      if (merged.rows.length === 0) {
        // 摘空即删键：不留空壳，否则每次冷启动都白读一个文件。
        if (current !== undefined) await this.table.delete(key)
      } else if (merged.changed || patch.outgoing.size > 0) {
        await this.table.put(key, emptyShard(patch.sessionId, patch.day, merged.rows))
      }
      for (const id of patch.outgoing) this.rowsById.delete(id)
```

#### 缺口

- alias变更的旧价漂移、多provider合同差异和第N片失败后恢复未复现。
  **影响**：不把日志估价或写时快照当真实账单与硬预算保障。
  **进一步探讨**：用同名异价/缺缓存/alias变化/跨日及写片失败夹具核金额、旧快照和水位；保留旧账本，任何无解释漂移停止信金额。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用与恢复负担是什么，下一步计价契约如何证伪？

**研究主题**：效果与总成本、采用判断、工程质量与复用、新假设与验证

#### 完整回答

建议观察，不把显示费用当账单或硬预算。先用无真实会话的夹具核provider专属规则、unknown与历史锁价，再经明确授权对照少量真实账单；账本不能解释差异时回服务商原始usage/人工表。首次冷回填读日志建分片并校价格/FX口径，持续有变动重读、网络刷新、分片/索引维护，故障要查片/水位及历史金额；不额外发模型请求不等零CPU/I/O。现金、人工和恢复时间未知，退出须保留快照/账本解释口径，不能只卸载就丢掉历史来源。

可借鉴原始usage/快照/估算标记分离、稳定ID分片、变动跳过与失败不推进水位。未验证假设为每条行绑定provider计量schema、合同/折扣、FX和不可变费用收据，普通重折保留旧行，重估必须显式新修订，跨provider同名仅候选待确认。代价是规则维护、迁移和账单隐私；用当前/契约方案对照同名异价、别名变化和部分失败，测误价、历史漂移、重复和恢复人时。若仍静默套错折扣或改旧价，或维护负担超过人工对账，否定；不把未来方案算已实现。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/aggregate.ts:95-134](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/aggregate.ts#L95-L134)

变化跳过、分片后水位、失败重试。

<details>
<summary>查看原文（40行）</summary>

```text
    try {
      const wm = deps.folds.get(foldKey(header.id))
      // 戳相同 = 这份日志自上次折叠以来没变过；headerCreatedAt 只是 id 复用时的兜底。
      // `rebuild` 那一趟**故意不看水位**：账本换容器后水位对应的是旧容器，必须整语料重折一遍。
      if (!opts.rebuild && wm !== undefined && stamp !== null && wm.stamp === stamp && wm.headerCreatedAt === header.createdAt) {
        skipped += 1
        continue
      }
      const snap = await deps.source.readSession(header.id)
      const result = foldEvents(snap.events, {
        session: snap.session,
        installAt: deps.installAt,
        aliases: aliasMap,
        resolvePrice: (at) => resolveSnapshotAt(at, snapshots),
      })
      // 一个会话一轮只写一次：它的行落在同一片（跨天最多两片）上，逐行写会把整片重写几十遍。
      // 只有内容真的变了才落盘：正在写的会话每轮都会被重折，绝大多数行是上一轮的旧行。
      const changed = result.rows.filter((row) => {
        const previous = deps.ledger.get(row.id)
        return previous === undefined || !sameRow(previous, row)
      })
      await deps.ledger.putMany(changed)
      await deps.folds.put(foldKey(header.id), {
        sessionId: header.id,
        // 戳为 null 时不写这个字段：下一轮继续整会话重读，等后端能给出戳为止。
        ...(stamp === null ? {} : { stamp }),
        foldedThroughSeq: result.lastSeq,
        lastTime: result.lastTime,
        headerCreatedAt: header.createdAt,
        lastSnapshotId: resolveSnapshotAt(result.lastTime, snapshots).snapshotId,
      })
      for (const m of result.unpricedModels) unpriced.add(m)
      folded += 1
      rows += result.rows.length
    } catch (error) {
      failures += 1
      // 诊断写入本身还可能失败（storage 抖了），而它是唯一的副作用：让它自己兜住，
      // 否则一个坏会话会把其余会话一起带走。header 也可能缺失，先本地取值再拼内容。
      // 键稳定于 (sessionId, kind)：同一个坏会话重试多少次都只 upsert 同一条，
      // 不推进水位意味着它下轮还会被重试 —— 但重试只累加计数，不会再涨存储。
```

</details>

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/service.ts:121-134](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/service.ts#L121-L134)

重建成功标记与失败边界。

<details>
<summary>查看原文（14行）</summary>

```text
  /** 忽略水位，全部会话重折一遍，成功后落标记。 */
  async rebuildLedger(): Promise<AggregateStats> {
    this.rebuilding = true
    try {
      const stats = await this.aggregatePass(true)
      if (stats.failures === 0) {
        await this.config.domain.global.set({
          rebuiltAt: this.now(), rebuiltRows: this.ledger.size, rebuiltShards: this.ledger.shardCount,
        })
      }
      return stats
    } finally {
      this.rebuilding = false
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:40-65](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/pricing/cost.ts#L40-L65)

明确提供商收据需求。

<details>
<summary>查看原文（26行）</summary>

```text
/** 同名兜底候选的前缀：首段 `*` + 斜杠 + 模型名 = 「任何 provider 下叫这个名字的价」。 */
const NAME_FALLBACK_PREFIX = `${WILDCARD}/`

/**
 * 表内「模型名 → 命中键」索引（延迟构建，按表的键**插入顺序**取第一条）。
 *
 * 插入顺序即优先级来源：内置目录在安装时就写进基准快照，网络刷新只会往后追加 delta，
 * 所以同一个模型名有多个 provider 时先出现的（目录里的官方 provider）胜出 —— 确定性、可解释。
 *
 * 用 WeakMap 挂在价目表本身上：快照表是不可变对象，按表缓存不会串味，也不会泄漏。
 */
const nameIndexCache = new WeakMap<object, Map<string, string>>()

/** 表内同名条目键；没有则 undefined。 */
function sameNameEntryKey(table: Readonly<Record<string, PriceEntry>>, name: string): string | undefined {
  let index = nameIndexCache.get(table)
  if (index === undefined) {
    index = new Map<string, string>()
    for (const key of Object.keys(table)) {
      const slash = key.indexOf('/')
      if (slash <= 0) continue
      const modelPart = key.slice(slash + 1)
      // `<provider>/*` 与 `*/*` 是兜底价，不是「某个模型的同名价」。
      if (modelPart === WILDCARD) continue
      const normalized = normalizeModelId(modelPart)
      if (normalized !== '' && !index.has(normalized)) index.set(normalized, key)
```

</details>

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:102-107](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-usage-billing/src/fold.ts#L102-L107)

现有快照与backfilled可扩展。

```text
      costCny: priced.costCny,
      currency: priced.currency,
      priced: priced.priced,
      snapshotId: table.snapshotId,
      ...(tier === null ? {} : { tier }),
      backfilled: event.time < ctx.installAt,
```

#### 缺口

- 没有真实计费准确率、CPU/I/O、对账时间或新契约实验。
  **影响**：不把日志估价或写时快照当真实账单与硬预算保障。
  **进一步探讨**：合成新样本后做授权匿名对账，分别算计量、价格、FX和人工修正，不以旧夹具通过代新收益。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
