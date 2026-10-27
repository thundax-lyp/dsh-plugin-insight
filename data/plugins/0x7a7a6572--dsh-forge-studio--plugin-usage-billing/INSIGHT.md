# plugin-usage-billing

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,475](https://img.shields.io/static/v1?label=npm+30d&message=1%2C475&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)
<!-- END META -->

> **实现功能**：从DSH会话usage建立按日/模型/项目的估价账本，展示预算、价目来源与未计价状态。

> **核心亮点**：把usage、价格快照、历史估算与unknown分开并提供分维度视图，增量在可解释聚合而非生成真实provider账单。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：峰谷倍率无provider限定、同名价可跨provider兜底，当前alias重折可覆盖旧ID费用；写时锁价不等所有配置变化下历史不可变。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要计费视图，usage到费用账本怎样运行？](#detail-section-11)
  - [Q02 · 锁价与unknown的贡献成立到哪里，价格口径有哪些限制？](#detail-section-12)
  - [Q03 · 存储、网络与退出依赖什么？](#detail-section-13)
  - [Q04 · 三阶段成本与效果如何判断？](#detail-section-14)
  - [Q05 · 哪些机制可复用，提供商计价契约假设如何证伪？](#detail-section-15)
  - [Q06 · 目前建议及停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者核对模型用量和费用估算，要求计量、提供商价格、历史与unknown可解释。

直接基线是人工用 provider 原始 usage 和合同价表计算同批事件。插件增加会话与工作区视图，但合同、模型别名和缓存 token 桶口径仍需人核；用同一批调用对比缺失、错价、历史重折漂移和恢复人时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| usage聚合 | 按事件账本 | 缺usage不产生费用行 |
| 价格快照 | 历史/当前估算 | provider/峰谷匹配待核 |
| unknown | 缺价/FX不静默计0 | 显示总额仍不等完整账单 |
| 预算与趋势 | 消耗提醒/分析 | 非调用硬上限，勿用于结算 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH storageDomain及sessionQuery | 主聚合必需 | 账本表/价格快照与会话读取 | storage缺失降级，query缺失无法真实读会话 |
| sessionPersistence revision | 优化可选 | 跳过未变日志 | 缺失每轮全会话重读 |
| Host web服务/网络 | 联网价表可选 | models.dev和汇率刷新 | 降级内置/默认口径需可见 |
| Client/设置/Typert契约 | 展示/改价必需 | 卡片、趋势、自定义价 | 内部rc版本需核对 |
| 本地账本/快照存储 | 持久必需 | 分片、别名和口径 | 卸载不等删除敏感会话元数据 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包，盘点模型usage与真实定价条款 | 把显示金额当估算，先核provider/峰谷范围 |
| 加载 | 安装profile并核对历史回填标记 | 区分真实usage、估价、未计价 |
| 使用 | 对照少量已知事件和账单核对 | 预算提醒不等阻止进一步调用 |
| 退出/恢复 | 备份账本/快照，检查自定义价与alias变化 | 不盲重建/重计价覆盖历史解释 |

本地账本包含sessionId、cwd、model、tokens/费用，虽不是完整会话正文仍有隐私留存责任；UI/remote共享宿主授权边界需另核。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 历史日志全量读取、账本分片与UI，金额未知 | 定价/汇率/usage桶口径核对 | 安装前金额标估算 |
| 持续使用 | 变动日志重折、分片写、价表/汇率网络刷新 | 处理未计价、alias和预算提示 | 不新增模型工具/提示，不等0 CPU/I/O |
| 失败恢复 | 价表降级、日志错误、分片/水位重建 | 检查重复/残留和历史金额漂移 | 网络刷新占写队列，恢复时长未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量可见 | 从有usage的assistant事件折叠并按seq去重 | provider usage是否完整及失败调用覆盖 |
| 费用展示 | 价格/汇率/峰谷计算与unknown状态 | 是否等真实合同/折扣/收款账单 |
| 历史解释 | snapshot/backfilled与分片ID | 别名/重折后金额是否保持既有含义 |

> **思考**：峰谷倍率无provider限定、同名价可跨provider兜底，当前alias重折可覆盖旧ID费用；写时锁价不等所有配置变化下历史不可变。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把usage、价格快照、历史估算与unknown分开并提供分维度视图，增量在可解释聚合而非生成真实provider账单。详见[Q01](#research-q01)与[Q02](#research-q02)。

把usage、价格快照、历史估算与unknown分开并提供分维度视图，增量在可解释聚合而非生成真实provider账单。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是原始usage/价格快照/估算标志分离、ID幂等分片、变化跳过、失败不中断串行队列，以及Host/Client remote方法名单单一真相源。分片减少每事件文件和重复写，但同ID覆盖/跨片移动仍需处理多片失败；storage宿主保证不能从本包推断。

<a id="detail-section-5"></a>

### 1.4 主要限制

峰谷倍率无provider限定、同名价可跨provider兜底，当前alias重折可覆盖旧ID费用；写时锁价不等所有配置变化下历史不可变。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先核provider口径与锁价，日志估价不用于结算/硬预算，保留快照再对账。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持按会话usage、价表/汇率规则组织用量账目的集成；provider口径、统一峰谷系数与历史锁价行为仍有缺口，不等真实账单。provider计价契约和锁价修订收据尚未验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin-usage-billing/src/index.ts、packages/plugin-usage-billing/src/fold.ts、packages/plugin-usage-billing/src/aggregate.ts、packages/plugin-usage-billing/src/ledger-store.ts、packages/plugin-usage-billing/src/pricing/cost.ts、packages/plugin-usage-billing/src/pricing/tiers.ts、packages/plugin-usage-billing/src/shard-merge.ts、packages/plugin-usage-billing/src/service.ts、packages/plugin-usage-billing/src/pricing/fetch.ts、packages/plugin-usage-billing/src/remote-methods.ts、packages/plugin-usage-billing/README.md、packages/plugin-usage-billing/package.json 及固定范围 inventory；组件：packages/plugin-usage-billing。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件index/service/aggregate/fold、价格/峰谷/同名与分片merge/store、remote方法主链；未全面审计主题编译/所有Client，不读真实会话或价格。
- 下一步：按 [Q05](#research-q05) 设计两 provider 同 model 异价、alias 变化、缺 usage 和分片失败夹具，先验证收费解释与历史稳定，再由明确授权对少量账单核对；本轮无实际日志或价格请求。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：1.3.0（[固定提交 be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨provider计价契约和锁价收据，绑定usage schema/规则/FX，旧行普通重折保留，重估明确修订；维护和迁移成本未验证。详见[Q05](#research-q05)。

按 [Q05](#research-q05) 设计两 provider 同 model 异价、alias 变化、缺 usage 和分片失败夹具，先验证收费解释与历史稳定，再由明确授权对少量账单核对；本轮无实际日志或价格请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 47 | — | — | 994 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 72 | 7441 | 5221 | 1539 | — |
| .tsx | source | 39 | 3186 | 2612 | 459 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查会话usage到费用账本、价格口径/锁价与采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要计费视图，usage到费用账本怎样运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合想在DSH里查看会话/项目token消耗和估算费用的个人维护者。输入为持久会话日志中的assistant/message usage、provider/model上下文与价格/汇率快照，输出会话/日/模型账本和预算进度。合格结果需usage计量桶、价格来源和估算/未计价明确，不能用金额显示推断provider实际扣费。

Host打开storageDomain，记录install快照，通过sessionPersistence revision跳过未变日志，缺revision则重读。fold跟踪request context/header，遇assistant/message有usage才形成行，以sessionId+seq作稳定ID，按事件时间找快照并算费用，按会话/日分片upsert。UI/remote方法读统计和自定义价，后台web抓目录/汇率；不注册模型工具/系统prompt。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:30-38](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/index.ts#L30-L38)

storageDomain是主依赖。

```text
export async function apply(ctx: Context, config: Config): Promise<void> {
  const domainService = ctx.get('storageDomain')
  if (domainService === undefined) {
    ctx.logger.warn('[plugin-usage-billing] storageDomain 未装配，计费聚合不可用（插件已降级）')
    return
  }

  const domain = await domainService.open(usageBillingDomain)
  ctx.effect(() => () => { void domain.close() })
```

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:55-88](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/index.ts#L55-L88)

revision/日志源与install快照。

<details>
<summary>查看原文（34行）</summary>

```text
  const source: SessionSource = {
    listSessions: async () => {
      const persistence = ctx.get('sessionPersistence') as SessionPersistenceLike | undefined
      if (persistence !== undefined) {
        const listed = await persistence.list()
        return listed.map((s) => ({ header: s.header, stamp: String(s.revision) }))
      }
      // 退化：stamp 为 null，该轮每个会话整会话重读。
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
    },
  })

  // 同时充当「安装前历史」的回填口径。
  await service.ensureBaseSnapshot({ ...BUILTIN_CATALOG }, DEFAULT_USD_TO_CNY, 'default')
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:53-107](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L53-L107)

模型归属、usage与事件时刻费用。

<details>
<summary>查看原文（55行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/aggregate.ts:94-119](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/aggregate.ts#L94-L119)

变化日志折叠与水位。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const { header, stamp } of sessions) {
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
```

</details>

**依据 5 · 源码核查**：[packages/plugin-usage-billing/src/ledger-store.ts:66-116](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/ledger-store.ts#L66-L116)

分片串行upsert。

<details>
<summary>查看原文（51行）</summary>

```text
  putMany(rows: readonly LedgerRow[]): Promise<void> {
    if (rows.length === 0) return Promise.resolve()
    const run = this.chain.then(() => this.applyRows(rows))
    this.chain = run.then(() => undefined, () => undefined)
    return run
  }

  /** 链内执行：把一批行落到它们各自的分片上，每片至多一次读写。 */
  private async applyRows(batch: readonly LedgerRow[]): Promise<void> {
    const patches = new Map<string, ShardPatch>()
    const patchAt = (key: string, sessionId: string, day: string): ShardPatch => {
      let patch = patches.get(key)
      if (patch === undefined) {
        patch = { sessionId, day, outgoing: new Set(), incoming: new Map() }
        patches.set(key, patch)
      }
      return patch
    }

    for (const row of batch) {
      const previous = this.rowsById.get(row.id)
      if (previous !== undefined) {
        const oldKey = ledgerShardKey(previous.sessionId, previous.day)
        const newKey = ledgerShardKey(row.sessionId, row.day)
        if (oldKey === newKey) {
          // 同片且内容未变：整片不写。正在写的会话每轮都会被重折，绝大多数行是旧行。
          if (sameRow(previous, row)) continue
        } else {
          // 换了分片（会话日志被改写导致 day 变了）：先从旧片摘掉，否则同一个 seq
          // 会在两片里各留一份，等于重复计费。
          patchAt(oldKey, previous.sessionId, previous.day).outgoing.add(row.id)
        }
      }
      const target = patchAt(ledgerShardKey(row.sessionId, row.day), row.sessionId, row.day)
      target.incoming.set(row.id, row)
    }

    for (const [key, patch] of patches) {
      const current = this.table.get(key)
      const kept = current === undefined
        ? []
        : current.rows.filter((candidate) => !patch.outgoing.has(candidate.id))
      const merged = mergeShardRows(kept, [...patch.incoming.values()])
      if (merged.rows.length === 0) {
        // 摘空即删键：不留空壳，否则每次冷启动都白读一个文件。
        if (current !== undefined) await this.table.delete(key)
      } else if (merged.changed || patch.outgoing.size > 0) {
        await this.table.put(key, emptyShard(patch.sessionId, patch.day, merged.rows))
      }
      for (const id of patch.outgoing) this.rowsById.delete(id)
      for (const row of patch.incoming.values()) this.rowsById.set(row.id, row)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 锁价与unknown的贡献成立到哪里，价格口径有哪些限制？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把真实日志usage与价格快照分开、保留snapshot/backfilled，并对缺模型/汇率保留priced:false而不静默当0，提供分维度解释而非只加一个总数。价格目录/汇率和usage本身来自上游，插件不产生独立账单或独立测得模型token。

最关键口径限制是峰谷系数按时间统一求，fold和repricing都无provider条件传给priceUsage；代码把0.5空闲倍率应用到所有匹配价。不能把一个时间规则推广为所有提供商合同。sameNameEntryKey还可按模型名跨provider取首条价格，确定性不代表同名服务同价；自定义通配也需读者明确。

写时锁价也不等永久不可变。会话stamp变化后全量fold采用当前alias，aggregate对同ID不同row写入，mergeShardRows后写覆盖；所以别名变化后再重折可能改变旧seq费用，即使repricing入口自身跳过priced行。历史快照有帮助，但当前推导不能被称任意配置变化都不动历史。没有usage的消息只计calls不出费用行；预算只是提示/进度，不是调用硬上限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:96-117](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/pricing/cost.ts#L96-L117)

未知价/汇率显式priced:false及费用计算。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:77-82](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L77-L82)

无provider限定的时间系数。

```text
    const who = fromContext ?? fromHeader ?? UNKNOWN
    const alias = ctx.aliases.get(aliasId(who.provider, who.model))
    const table = ctx.resolvePrice(event.time)
    const keys = priceKeyCandidates(who.provider, who.model, alias)
    const { tier, factor } = tierAndFactorAt(event.time, isCnHoliday)
    const priced = priceUsage(usage, table.entries, keys, table.usdToCny, factor)
```

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/pricing/tiers.ts:27-37](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/pricing/tiers.ts#L27-L37)

固定空闲倍率0.5。

<details>
<summary>查看原文（11行）</summary>

```text
/** 起点取参考实现记录的政策变更点（北京 2026-08-17，官网未标日期）。 */
export const TIER_RULES: readonly TierRule[] = [
  {
    since: Date.UTC(2026, 7, 16, 16),
    peakWindows: PEAK_WINDOWS,
    weekdaysOnly: true,
    holidays: 'CN',
    offPeakRatio: 0.5,
  },
]

```

</details>

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:53-82](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/pricing/cost.ts#L53-L82)

同名跨provider首项兜底。

<details>
<summary>查看原文（30行）</summary>

```text
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
    }
    nameIndexCache.set(table, index)
  }
  return index.get(normalizeModelId(name))
}

/**
 * 解析一个候选键：先按字面命中；首段为 `*` 的候选再走同名兜底。
 * @param table - 该时刻解析出的价目表（`<provider>/<model>` → 单价）。
 * @param key - 候选键，见 `priceKeyCandidates`。
 */
function entryFor(table: Readonly<Record<string, PriceEntry>>, key: string): PriceEntry | undefined {
  const direct = table[key]
  if (direct !== undefined) return direct
  if (!key.startsWith(NAME_FALLBACK_PREFIX)) return undefined
  const hit = sameNameEntryKey(table, key.slice(NAME_FALLBACK_PREFIX.length))
  return hit === undefined ? undefined : table[hit]
```

</details>

**依据 5 · 源码核查**：[packages/plugin-usage-billing/src/aggregate.ts:94-119](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/aggregate.ts#L94-L119)

变动日志全量重折并写不同row。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const { header, stamp } of sessions) {
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
```

</details>

**依据 6 · 源码核查**：[packages/plugin-usage-billing/src/shard-merge.ts:34-53](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/shard-merge.ts#L34-L53)

同ID后写覆盖。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * 把一批行并入分片：身份是 `row.id`（= `<sessionId>__<seq>`），后写覆盖，按 seq 升序归一。
 *
 * 三条不变量（测试钉住）：同批重复并入 → `changed: false` 且内容不变（幂等）；同 id 再次
 * 并入 → 覆盖而不是追加；批内顺序不影响结果（字节稳定，落盘文件可直接比对）。
 */
export function mergeShardRows(current: readonly LedgerRow[], batch: readonly LedgerRow[]): ShardMerge {
  const byId = new Map<string, LedgerRow>()
  for (const row of current) byId.set(row.id, row)
  let changed = false
  for (const row of batch) {
    const previous = byId.get(row.id)
    if (previous !== undefined && sameRow(previous, row)) continue
    byId.set(row.id, row)
    changed = true
  }
  // 未变时原样返回：调用方据此整片跳过 put，不必先写再比。
  if (!changed) return { rows: current as LedgerRow[], changed: false }
  const rows = [...byId.values()].sort((a, b) => a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return { rows, changed: true }
```

</details>

**依据 7 · 源码核查**：[packages/plugin-usage-billing/src/service.ts:317-339](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/service.ts#L317-L339)

repricing跳过已定价不等其他重折路径保留。

<details>
<summary>查看原文（23行）</summary>

```text
  async repricing(): Promise<{ changed: number }> {
    const all = [...this.snapshots.entries()].map(([, s]) => s)
    const aliases = new Map(this.listAliases().map((a) => [a.id, a]))
    let changed = 0
    const patched: LedgerRow[] = []
    for (const row of this.ledger.all()) {
      if (row.priced) continue
      const table = resolveSnapshotAt(row.time, all)
      const alias = aliases.get(aliasId(row.provider, row.model))
      // 按行自己的时刻判档，不能用 now。
      const { tier, factor } = tierAndFactorAt(row.time, isCnHoliday)
      const result = priceUsage(
        { inputTokens: row.input, outputTokens: row.output, cacheReadTokens: row.cacheRead, cacheWriteTokens: row.cacheWrite },
        table.entries, priceKeyCandidates(row.provider, row.model, alias), table.usdToCny, factor,
      )
      if (!result.priced) continue
      patched.push({
        ...row,
        costCny: result.costCny,
        currency: result.currency,
        priced: true,
        snapshotId: table.snapshotId,
        ...(tier === null ? {} : { tier }),
```

</details>

**依据 8 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:71-75](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L71-L75)

缺usage跳过费用行。

```text
    if (event.type !== 'assistant/message') continue

    calls += 1
    const usage = (event.data as { usage?: import('@deepseek-ai/dsh-llm').TokenUsage }).usage
    if (usage === undefined) continue
```

#### 缺口

- 固定price规则与实际provider合同/usage桶语义未逐项核对。
  **影响**：只能作日志估算，不能称真实收款或统一折扣准确。
  **进一步探讨**：可从provider专属计价规则、cache桶含义和已知账单事件逐行对照入手，不用统一时间倍率代替合同。
- alias变更、历史重折及已定价行变化未做运行对照。
  **影响**：不能承诺任意改价/别名后历史金额绝不漂移。
  **进一步探讨**：可用固定旧事件、改alias再追加新事件的夹具比较旧row与snapshot解释，明确锁价不变量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 存储、网络与退出依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

storageDomain是强注入，缺失降级。sessionQuery决定会话真正可读，sessionPersistence只是省I/O的revision来源。联网从models.dev和open.er-api抓元数据，未见为计算而发送会话正文；本轮只读代码、不取真实价格。失网有内置与默认汇率口径，应按来源说明而非实时价格解释。



启动顺序决定可见性。storageDomain 先打开，sessionPersistence 只提供变化戳，真实消息仍经 sessionQuery 读入；缺后者不能用缓存戳冒充读取。网络价格失败应保留默认口径，不把当前模型目录当历史真实合同。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:30-38](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/index.ts#L30-L38)

缺storage降级。

```text
export async function apply(ctx: Context, config: Config): Promise<void> {
  const domainService = ctx.get('storageDomain')
  if (domainService === undefined) {
    ctx.logger.warn('[plugin-usage-billing] storageDomain 未装配，计费聚合不可用（插件已降级）')
    return
  }

  const domain = await domainService.open(usageBillingDomain)
  ctx.effect(() => () => { void domain.close() })
```

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:55-83](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/index.ts#L55-L83)

query/revision/web服务。

<details>
<summary>查看原文（29行）</summary>

```text
  const source: SessionSource = {
    listSessions: async () => {
      const persistence = ctx.get('sessionPersistence') as SessionPersistenceLike | undefined
      if (persistence !== undefined) {
        const listed = await persistence.list()
        return listed.map((s) => ({ header: s.header, stamp: String(s.revision) }))
      }
      // 退化：stamp 为 null，该轮每个会话整会话重读。
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

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/pricing/fetch.ts:15-16](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/pricing/fetch.ts#L15-L16)

两个元数据URL。

```text
export const MODELS_DEV_URL = 'https://models.dev/api.json'
export const FX_URL = 'https://open.er-api.com/v6/latest/USD'
```

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:86-107](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L86-L107)

持久行会话/目录字段。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[packages/plugin-usage-billing/src/remote-methods.ts:20-32](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/remote-methods.ts#L20-L32)

读取和改价远程面。

<details>
<summary>查看原文（13行）</summary>

```text
export const USAGE_BILLING_REMOTE_METHODS = Object.freeze([
  { method: 'overview', params: ['rangeKind', 'includeSubagents'] },
  { method: 'daily', params: ['rangeKind', 'includeSubagents'] },
  { method: 'byModel', params: ['rangeKind', 'includeSubagents'] },
  { method: 'byWorkspace', params: ['rangeKind', 'includeSubagents'] },
  { method: 'pricing', params: [] },
  { method: 'setCustomPrice', params: ['entry'] },
  { method: 'removeCustomPrice', params: ['key'] },
  { method: 'refreshPricing', params: ['force'] },
  { method: 'setAlias', params: ['input'] },
  { method: 'aliasList', params: [] },
  { method: 'repricing', params: [] },
  { method: 'status', params: [] },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本与效果如何判断？

**研究主题**：效果与总成本

#### 完整回答

完整任务是正确解释同一组调用的用量与估价，并发现无法计价/不一致，不是UI数字更完整。插件不额外调用模型，但冷回填、变化日志重折、表索引与分片/网络仍有成本。模型费用是被观察对象，不应和插件自身开销混成一个“免费”。



首次冷回填需要遍历历史日志并建立分片；持续开销取决于会话变化戳和改价刷新；失败时要核分片写入与折叠水位是否一致。应记录 CPU/I/O、网络和人工对账，现金与时间分开。

未知实际费用、恢复时长和错误率，不能从不调用模型推出零成本。对照 provider 原始 usage/收款与人工表格时，应分别验证计量正确、价目匹配、折扣/汇率与显示分组，并计修正/重建人时。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/index.ts:55-71](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/index.ts#L55-L71)

缺revision退化全日志。

<details>
<summary>查看原文（17行）</summary>

```text
  const source: SessionSource = {
    listSessions: async () => {
      const persistence = ctx.get('sessionPersistence') as SessionPersistenceLike | undefined
      if (persistence !== undefined) {
        const listed = await persistence.list()
        return listed.map((s) => ({ header: s.header, stamp: String(s.revision) }))
      }
      // 退化：stamp 为 null，该轮每个会话整会话重读。
      const q = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (q === undefined) return []
      return (await q.listSessions()).map((r) => ({ header: r.header, stamp: null }))
    },
    readSession: async (id: string) => {
      const q = ctx.get('sessionQuery') as SessionQueryLike | undefined
      if (q === undefined) throw new Error('sessionQuery unavailable')
      const snap = await q.readSession(id as never)
      return { session: snap.session, events: [...snap.events] }
```

</details>

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/aggregate.ts:94-119](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/aggregate.ts#L94-L119)

变动会话重折。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const { header, stamp } of sessions) {
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
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/ledger-store.ts:47-62](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/ledger-store.ts#L47-L62)

启动把所有账本行建内存索引。

<details>
<summary>查看原文（16行）</summary>

```text
  constructor(table: KvTable<string, LedgerShard>) {
    this.table = table
    for (const [, shard] of table.entries()) {
      for (const row of shard.rows) this.rowsById.set(row.id, row)
    }
  }

  get size(): number { return this.rowsById.size }

  /** 分片记录数（诊断/验收用：这就是冷启动要打开的文件数）。 */
  get shardCount(): number { return this.table.size }

  get(id: string): LedgerRow | undefined { return this.rowsById.get(id) }

  /** 全量快照（视图层按窗口过滤，不在这里裁剪）。 */
  all(): LedgerRow[] { return [...this.rowsById.values()] }
```

</details>

**依据 4 · 作者声明**：[packages/plugin-usage-billing/README.md:33-36](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/README.md#L33-L36)

作者网络刷新占写锁等边界。

```text
- 目录刷新（含它的网络请求）期间会占用写锁，此时改自定义价要等它结束。
- 改了刷新间隔要等当前缓存过期才生效。
- 会话维度的数据由「按工作区」的分组结果带回，在明细页展开工作区时才看得到。
- 热力图的单格明细只在悬停 / 触摸提示里；键盘用户读到的是上方的活跃天数与区间合计。
```

#### 缺口

- 缺少同调用集的计量/估价误差、大历史资源与人工核对成本对照。
  **影响**：不能量化对账准确或净节省。
  **进一步探讨**：可先用已知usage和专属价格夹具逐行比较，再按明确授权对照真实账单；记录未计价与恢复而非只总额。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制可复用，提供商计价契约假设如何证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是原始usage/价格快照/估算标志分离、ID幂等分片、变化跳过、失败不中断串行队列，以及Host/Client remote方法名单单一真相源。分片减少每事件文件和重复写，但同ID覆盖/跨片移动仍需处理多片失败；storage宿主保证不能从本包推断。

可以探讨未验证的“提供商计价契约与锁价收据”。每条费用记录绑定usage schema、明确provider计价/折扣规则及snapshot/FX来源，默认不对无明确合同提供商套峰谷；同名兜底标估算并由读者确认。旧行价格在普通重折保留，修订必须新版本/明确重估收据，不静默替换。代价是维护更多provider协议、旧行迁移和对账数据隐私。可用两provider同model异价、缺usage/cache字段、alias变化、跨日和第N分片失败夹具，比较误价、重复、历史漂移与恢复人时；若仍可静默改历史或套错折扣，应否定当前契约。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/ledger-store.ts:66-116](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/ledger-store.ts#L66-L116)

分片串行与跨片迁移。

<details>
<summary>查看原文（51行）</summary>

```text
  putMany(rows: readonly LedgerRow[]): Promise<void> {
    if (rows.length === 0) return Promise.resolve()
    const run = this.chain.then(() => this.applyRows(rows))
    this.chain = run.then(() => undefined, () => undefined)
    return run
  }

  /** 链内执行：把一批行落到它们各自的分片上，每片至多一次读写。 */
  private async applyRows(batch: readonly LedgerRow[]): Promise<void> {
    const patches = new Map<string, ShardPatch>()
    const patchAt = (key: string, sessionId: string, day: string): ShardPatch => {
      let patch = patches.get(key)
      if (patch === undefined) {
        patch = { sessionId, day, outgoing: new Set(), incoming: new Map() }
        patches.set(key, patch)
      }
      return patch
    }

    for (const row of batch) {
      const previous = this.rowsById.get(row.id)
      if (previous !== undefined) {
        const oldKey = ledgerShardKey(previous.sessionId, previous.day)
        const newKey = ledgerShardKey(row.sessionId, row.day)
        if (oldKey === newKey) {
          // 同片且内容未变：整片不写。正在写的会话每轮都会被重折，绝大多数行是旧行。
          if (sameRow(previous, row)) continue
        } else {
          // 换了分片（会话日志被改写导致 day 变了）：先从旧片摘掉，否则同一个 seq
          // 会在两片里各留一份，等于重复计费。
          patchAt(oldKey, previous.sessionId, previous.day).outgoing.add(row.id)
        }
      }
      const target = patchAt(ledgerShardKey(row.sessionId, row.day), row.sessionId, row.day)
      target.incoming.set(row.id, row)
    }

    for (const [key, patch] of patches) {
      const current = this.table.get(key)
      const kept = current === undefined
        ? []
        : current.rows.filter((candidate) => !patch.outgoing.has(candidate.id))
      const merged = mergeShardRows(kept, [...patch.incoming.values()])
      if (merged.rows.length === 0) {
        // 摘空即删键：不留空壳，否则每次冷启动都白读一个文件。
        if (current !== undefined) await this.table.delete(key)
      } else if (merged.changed || patch.outgoing.size > 0) {
        await this.table.put(key, emptyShard(patch.sessionId, patch.day, merged.rows))
      }
      for (const id of patch.outgoing) this.rowsById.delete(id)
      for (const row of patch.incoming.values()) this.rowsById.set(row.id, row)
```

</details>

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/service.ts:80-91](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/service.ts#L80-L91)

失败后继续队列与安装快照。

<details>
<summary>查看原文（12行）</summary>

```text
  /** 前一次失败不让链条卡死。 */
  private serialize<T>(work: () => Promise<T>): Promise<T> {
    const run = this.chain.then(work)
    this.chain = run.then(() => undefined, () => undefined)
    return run
  }

  async ensureBaseSnapshot(entries: Record<string, PriceEntry>, usdToCny: number, usdToCnySource: 'live' | 'default'): Promise<void> {
    return this.serialize(async () => {
      if ([...this.snapshots.entries()].some(([, s]) => s.reason === 'install')) return
      const snap = planSnapshot(undefined, { entries, usdToCny, usdToCnySource },
        { id: SNAPSHOT_INSTALL_ID, at: this.config.installAt, reason: 'install' })
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/remote-methods.ts:1-6](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/remote-methods.ts#L1-L6)

remote名单防漂移动机。

```text
/**
 * Remote 方法的**唯一来源**：host 的 markRemoteMethods 与 client 的 descriptors 都读这里。
 *
 * 存在的理由（spec 承重事实 12）：client 的参数个数是硬契约，声明几个就必须传几个，
 * 少传会在运行时抛 `expected N argument(s), got M`。两侧各写一份必然漂移，
 * 所以名单只写一次，并用 tests/service-remote.test.ts 钉住。
```

**依据 4 · 源码核查**：[packages/plugin-usage-billing/src/remote-methods.ts:20-32](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/remote-methods.ts#L20-L32)

唯一方法契约。

<details>
<summary>查看原文（13行）</summary>

```text
export const USAGE_BILLING_REMOTE_METHODS = Object.freeze([
  { method: 'overview', params: ['rangeKind', 'includeSubagents'] },
  { method: 'daily', params: ['rangeKind', 'includeSubagents'] },
  { method: 'byModel', params: ['rangeKind', 'includeSubagents'] },
  { method: 'byWorkspace', params: ['rangeKind', 'includeSubagents'] },
  { method: 'pricing', params: [] },
  { method: 'setCustomPrice', params: ['entry'] },
  { method: 'removeCustomPrice', params: ['key'] },
  { method: 'refreshPricing', params: ['force'] },
  { method: 'setAlias', params: ['input'] },
  { method: 'aliasList', params: [] },
  { method: 'repricing', params: [] },
  { method: 'status', params: [] },
```

</details>

**依据 5 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:77-107](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L77-L107)

假设计价/收据绑定起点。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 目前建议及停止条件是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。日志聚合、unknown与历史估算标记有价值，但所有provider统一峰谷、跨provider同名兜底和重折可能修改历史价格，对计费工具的核心可信度影响大。暂不把显示金额用于结算、预算强约束或对外承诺。

继续探讨可先用无真实日志的计量/价格夹具核查provider专属规则和锁价，再按明确授权与少量已知账单对照。缺usage被忽略、不同provider同名错价、无合同折扣、alias后旧价漂移或水位/分片不一致应停止依赖金额，保留旧账本/快照盘点。Q02口径与Q04完整任务结果明确后再评估trial，本轮未触碰用户会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-usage-billing/src/fold.ts:71-82](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/fold.ts#L71-L82)

usage缺失/统一factor。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/plugin-usage-billing/src/pricing/cost.ts:53-82](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/pricing/cost.ts#L53-L82)

同名价格兜底。

<details>
<summary>查看原文（30行）</summary>

```text
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
    }
    nameIndexCache.set(table, index)
  }
  return index.get(normalizeModelId(name))
}

/**
 * 解析一个候选键：先按字面命中；首段为 `*` 的候选再走同名兜底。
 * @param table - 该时刻解析出的价目表（`<provider>/<model>` → 单价）。
 * @param key - 候选键，见 `priceKeyCandidates`。
 */
function entryFor(table: Readonly<Record<string, PriceEntry>>, key: string): PriceEntry | undefined {
  const direct = table[key]
  if (direct !== undefined) return direct
  if (!key.startsWith(NAME_FALLBACK_PREFIX)) return undefined
  const hit = sameNameEntryKey(table, key.slice(NAME_FALLBACK_PREFIX.length))
  return hit === undefined ? undefined : table[hit]
```

</details>

**依据 3 · 源码核查**：[packages/plugin-usage-billing/src/shard-merge.ts:34-53](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-usage-billing/src/shard-merge.ts#L34-L53)

后写覆盖旧ID。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * 把一批行并入分片：身份是 `row.id`（= `<sessionId>__<seq>`），后写覆盖，按 seq 升序归一。
 *
 * 三条不变量（测试钉住）：同批重复并入 → `changed: false` 且内容不变（幂等）；同 id 再次
 * 并入 → 覆盖而不是追加；批内顺序不影响结果（字节稳定，落盘文件可直接比对）。
 */
export function mergeShardRows(current: readonly LedgerRow[], batch: readonly LedgerRow[]): ShardMerge {
  const byId = new Map<string, LedgerRow>()
  for (const row of current) byId.set(row.id, row)
  let changed = false
  for (const row of batch) {
    const previous = byId.get(row.id)
    if (previous !== undefined && sameRow(previous, row)) continue
    byId.set(row.id, row)
    changed = true
  }
  // 未变时原样返回：调用方据此整片跳过 put，不必先写再比。
  if (!changed) return { rows: current as LedgerRow[], changed: false }
  const rows = [...byId.values()].sort((a, b) => a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return { rows, changed: true }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
