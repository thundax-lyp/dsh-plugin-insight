# DSH Damage Pulse

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d51989d](https://github.com/wssfk12138/dsh-damage-pulse/tree/d51989d7ee378db9d2da9aef43f5161c34680dee)

<!-- BEGIN META -->
[![GitHub ★ 278](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=278&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wssfk12138/dsh-damage-pulse) [![npm 30d 8,852](https://img.shields.io/static/v1?label=npm+30d&message=8%2C852&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-damage-pulse) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-damage-pulse)
<!-- END META -->

> **功能**：在 DSH 中记录 Token 用量与本地估价，查询供应商余额，并以明细、提醒和鲸鱼桌宠呈现消费变化。

> **亮点**：固定计费快照、原始用量与选装估价分离，加上受限余额描述符及凭据轮换后的旧结果抑制，把个人成本观察集中到宿主中；这是集成贡献，未证明节省费用，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：看见扣费动画不代表该记录耐久保存或与供应商实际扣账相等。账本先更新内存再写JSONL，失败仅警告仍触发后续回调；金额还依赖本地规则及来源覆盖，见 [Q03](#research-q03)。

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
  - [Q01 · 收费用量如何从宿主事件进入账本和可视化？](#detail-section-11)
  - [Q02 · 自定义余额适配怎样处理凭据、网络和过期结果？](#detail-section-12)
  - [Q03 · 模块卸载、历史与失败恢复如何影响总负担？](#detail-section-13)
  - [Q04 · 什么人值得试，如何验证价值及新方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在DSH查看个人用量的用户可把请求分量与估价放在对话旁观察，不宜作为财务对账，见 [Q01](#research-q01)。

参照供应商控制台、宿主原用量和人工整理日志。本地估价、余额快照和真实扣账是不同材料，桌宠动画没有提供节费因果证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原始用量采集 | 保存Token与缓存分量 | 依赖live model usage，不含所有未知请求 |
| 本地估价 | 用冻结规则生成金额分量 | 规则需核对，不等于供应商扣账 |
| 余额查询 | 取得provider账户快照 | Host私有凭据、批准目标和网络约束 |
| 脚本适配 | 描述请求并解析JSON | QuickJS限时限内存，不直接持key |
| 模块管理 | 启停与移除选装功能 | tombstone/pending需核对，不自动等于删完 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH服务与完整打包runtime | 启动必需 | Host、Client和模块加载 | 未构建源码缺manifest会拒绝启动 |
| 宿主model usage事件 | 用量采集必需 | 记录请求Token分量 | 无usage不产生同类记录，不能算完整账单 |
| billing模块和已核对规则 | 估价必需 | 本地金额计算 | 可仅保留unpriced原始用量 |
| 供应商身份与批准请求 | 对应余额查询必需 | Host带凭据访问endpoint | 未批准/无身份暂停，不能猜用别的key |
| 可写本地存储 | 历史必需 | usage.jsonl与配置 | 写盘失败可只剩内存观测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主并装完整发布包 | 模块清单与Host/Client正常加载 |
| 核对 | 用户核对provider、规则及显示状态 | usage、估价和真实余额分开解释 |
| 使用 | core采集，billing估价，界面观察 | 抽样对照供应商，不把动画当扣账凭证 |
| 扩展 | 用户确有需要才配置余额脚本/批准目标 | 受控请求和身份轮换结果可解释 |
| 退出 | 用户选择保留数据并检查模块pending | 等待停止/清理完成，保留必要账本副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/存储等资源金额未知 | 发布包、规则、模块核对耗时未知 | 非只加载根源码即可 |
| 持续使用 | 日志、轮询、动画资源未知 | 规则/账单抽样复核 | 没有节费测量 |
| 故障恢复 | 缺失记录与重试资源未知 | 检查写盘、身份、pending和外部状态 | fail-soft不等于耐久成功 |
| 退出升级 | 备份与包文件资源未知 | 选择数据保留、核对清理 | 不删除宿主凭据/会话的范围需保持 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量观察 | live usage与缓存分量记录 | 覆盖完整性与持久化完整性 |
| 余额查询 | 描述符、批准、Host网络及旧结果抑制 | 所有供应商语义与实际可用性 |
| 成本反馈 | 本地规则估价及charge事件 | 真实扣账一致、预算行为和节费 |

> **思考**：看见扣费动画不代表该记录耐久保存或与供应商实际扣账相等。账本先更新内存再写JSONL，失败仅警告仍触发后续回调；金额还依赖本地规则及来源覆盖，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：固定计费快照、原始用量与选装估价分离，加上受限余额描述符及凭据轮换后的旧结果抑制，把个人成本观察集中到宿主中；这是集成贡献，未证明节省费用，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) 将脚本限制为无key请求描述符、Host掌握网络和凭据，以及迟到结果复核，值得复用；[Q03](#research-q03) 先落tombstone再停服务可解释模块退出。移植需要匹配宿主生命周期/凭据和文件锁，账本fail-soft必须在产品中保留缺口而非声称精确持久账。

<a id="detail-section-5"></a>

### 1.4 主要限制

看见扣费动画不代表该记录耐久保存或与供应商实际扣账相等。账本先更新内存再写JSONL，失败仅警告仍触发后续回调；金额还依赖本地规则及来源覆盖，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只开个人用量明细与可视化，用几条明确请求核对来源、规则和账单；需要时才启用自定义脚本或通知。未定价、落盘或身份异常时停用相关功能并回供应商记录，不据动画结算费用，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定版本的实际collector-core、估价、余额脚本/网络与模块生命周期源码。建议个人用量观察的有限试用，不作财务账单；未执行插件、余额请求、通知或故障实验，未来状态标志未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、plugins/dsh-token-monitor/src/balance-api.ts、plugins/dsh-token-monitor/src/balance-config.ts、plugins/dsh-token-monitor/src/balance-network.ts、plugins/dsh-token-monitor/src/balance-registry.ts、plugins/dsh-token-monitor/src/balance-script.ts、plugins/dsh-token-monitor/src/collector-core.ts、plugins/dsh-token-monitor/src/features/billing.ts、plugins/dsh-token-monitor/src/index.ts、plugins/dsh-token-monitor/src/module-bootstrap.ts、plugins/dsh-token-monitor/src/module-manager.ts、plugins/dsh-token-monitor/src/pricing.ts、plugins/dsh-token-monitor/src/runtime-core.ts、plugins/dsh-token-monitor/src/runtime-host.ts、plugins/dsh-token-monitor/src/storage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根组件inventory为统计范围，人工抽读实际core接线、collector-core、估价、余额脚本/网络/registry、模块退出与存储；未完整审计UI动画、微信投递、发布更新全链路及全部内置供应商适配。
- 下一步：后续在独立profile核对同批usage、规则快照、供应商账单和写盘状态，注入脚本变更/凭据轮换/迟到响应与卸载中断；再比较用户误判和人工复核成本。本轮未执行目标、测试或网络查询。

**分析版本**

- **仓库**：[wssfk12138/dsh-damage-pulse](https://github.com/wssfk12138/dsh-damage-pulse)
- **版本号**：4.3.0（[固定提交 d51989d](https://github.com/wssfk12138/dsh-damage-pulse/tree/d51989d7ee378db9d2da9aef43f5161c34680dee)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索在charge和汇总中显示报告来源、估价状态、耐久保存状态及余额时间，减少把界面金额当完整账单的误读。该方案未实现，模拟缺口任务若不改善识别或只增加干扰则否定，见 [Q04](#research-q04)。

后续在独立profile核对同批usage、规则快照、供应商账单和写盘状态，注入脚本变更/凭据轮换/迟到响应与卸载中断；再比较用户误判和人工复核成本。本轮未执行目标、测试或网络查询。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1638 | — | — | 30452 |
| .js | source | 2 | 72221 | 62612 | 10538 | — |
| .ts | source | 125 | 14608 | 11700 | 1919 | — |
| .tsx | source | 20 | 5575 | 4864 | 454 | — |
| .tsx | test | 25 | 5035 | 4429 | 211 | — |
| .ts | test | 99 | 10351 | 9333 | 301 | — |
| .mjs | source | 5 | 547 | 498 | 44 | — |
| .ts | example | 2 | 105 | 102 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/wssfk12138/dsh-damage-pulse/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：余额与Token可视化如何区分用量、估价和账户余额，自定义请求与生命周期有什么可核查边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 收费用量如何从宿主事件进入账本和可视化？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Damage Pulse是原生DSH bundle，面向想在对话时看用量、估价和账户余额的用户。相较切换供应商控制台或自己整理日志，它把请求用量、缓存命中分量、历史和鲸鱼动画放入宿主界面；合格结果应是来源与缺失可辨、估价能追溯规则，而不是动画像账单。组合patch加载Host，根入口bootModules启动模块和常驻core，core实际使用collector-core而非旧collector。

collector-core在stream start冻结计费快照，监听新的assistant/message且只接受model来源和usage，已有历史事件不重记；记录先为unpriced，选装billing模块priceRecord用规则或本地价表估计，成功后标priced并发出charge。billing模块未装仍可采原始用量。缓存未命中输入和cacheWrite与缓存读取区别处理，为可视反馈提供数据，但不是供应商实际扣账证明；余额另走查询。根组件包含多个工作区包，不能把每个模块都说成独立已运行插件。历史打开不按今天规则重算有助于解释过去，但内置价格版本是否吻合今天供应商价目未外部核验，本文不把具体价当当前官方事实。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/cordis.patch.yml#L1-L5)

原生Host组合。

```text
# Standard DSH profile bundle. The patch loads the Host half; package.json's
# dsh.client declaration makes DSH discover lib/client.js for the Web UI.
- insert:
    - id: dsh-token-monitor
      name: dsh-damage-pulse
```

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/index.ts:16-34](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/index.ts#L16-L34)

入口到模块boot。

<details>
<summary>查看原文（19行）</summary>

```text
export const name = 'dsh-token-monitor'
export { Config } from './config-base.ts'
export const inject = ['sessions', 'credentials', 'settings']

/** Start the installed release; a whole-plugin tombstone leaves this loader inert.
 * @param ctx Host-owned plugin lifetime.
 */
export async function apply(ctx: Context, config: TokenMonitorUserConfig): Promise<void> {
  registerUserSettings(ctx, config)
  const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  // Source checkouts keep the browser bundle beside the workspace package. A
  // packed install has no workspace tree, so prefer the installed runtime/client
  // payload and fall back to the monolithic package lib directory.
  const sourceClient = resolve(pluginRoot, '../../packages/client/ui-token-monitor/lib')
  const runtimeClient = resolve(pluginRoot, 'runtime/client')
  const packagedClient = resolve(pluginRoot, 'lib')
  const isSourceTree = pluginRoot.replaceAll('\\', '/').endsWith('/plugins/dsh-token-monitor')
  const clientRoot = existsSync(runtimeClient) ? runtimeClient : isSourceTree ? sourceClient : packagedClient
  await bootModules(ctx, pluginRoot, clientRoot)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/runtime-core.ts:50-70](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/runtime-core.ts#L50-L70)

实际接线collector-core与billing回调。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, services: ModuleServices, installed: (id: string) => boolean): { drainSettings(): Promise<void> } {
  ctx.inject(['sessionProjections'], projection => {
    projection.effect(() => projection.sessionProjections.register(createTokenCostProjectionDefinition(services.priceTable())), 'token-monitor: usage projection')
  })
  ctx.inject(['sessionProjections', 'sessionProjectionCache', 'sessionPersistence'], migrateMissingTokenCost)
  const work = new ModuleWork()
  ctx.effect(() => () => work.stop(), 'token-monitor: settings writes')
  // 宿主未确认会落盘 ignorable 标记时不写会话用量行：没有标记的未知事件会让整份
  // 会话日志被读取端拒绝解释（issue #24），停写后金额仍由插件账本与兜底路由提供。
  const sessionRecords = new SessionRecordWriter({
    onStop: status => ctx.logger.warn(`token-monitor: ${status.detail}`),
  })
  if (!sessionRecords.enabled()) {
    const status = sessionRecords.status()
    ctx.logger.warn(`token-monitor: 已停写会话用量记录（capability=${status.capability}）：${status.detail}`)
  }
  attachUsageCollector(ctx, services.storage, {
    readBilling: () => services.billing?.readSnapshot(),
    priceRecord: (record, frozen) => services.billing?.priceRecord(record, frozen) ?? record,
    onPersistedRecord: (record, kind) => { services.billing?.onPersistedRecord(record, kind); services.observeRecord?.(record, kind) },
    appendUsageRecord: (session, record) => { sessionRecords.append(session, record) },
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/collector-core.ts:18-50](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/collector-core.ts#L18-L50)

live usage、冻结快照与unpriced。

<details>
<summary>查看原文（33行）</summary>

```text
export function attachUsageCollector(ctx: Context, storage: UsageStorage, options: UsageCollectorOptions): void {
  const requests = new WeakMap<Session, { turn: number; step: number; billing: BillingSnapshot }>()
  let active = true
  ctx.effect(() => () => { active = false }, 'token-monitor: usage capture lifetime')
  ctx.on('agent/assistant-stream', ({ agent, frame }) => {
    if (frame.type === 'start') {
      const billing = options.readBilling?.()
      if (billing !== undefined) requests.set(agent.session, { turn: frame.turn, step: frame.step, billing: structuredClone(billing) })
    } else if (frame.type === 'end') requests.delete(agent.session)
  })
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    if (!active || event.type !== 'assistant/message') return
    if (typeof session.firstLiveSeq === 'number' && event.seq < session.firstLiveSeq) return
    const usage = event.data.usage, source = event.data.message.source
    if (usage === undefined || source.kind !== 'model') return
    const raw: UsageRecord = {
      sessionId: session.id, turn: event.data.turn, step: event.data.step, sourceEventSeq: event.seq,
      timestamp: event.time, provider: source.provider, model: source.model, inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens, cacheReadTokens: usage.cacheReadTokens ?? 0, cacheWriteTokens: usage.cacheWriteTokens ?? 0,
      reasoningTokens: usage.reasoningTokens ?? 0, cost: 0, costInput: 0, costOutput: 0, costCache: 0, costCacheRead: 0,
      costCacheWrite: 0, peak: false, billingStatus: 'unpriced',
    }
    if (!isValidUsageRecord(raw)) return
    const request = requests.get(session)
    const frozen = request?.turn === raw.turn && request.step === raw.step ? request.billing : options.readBilling?.()
    const record = options.priceRecord?.(raw, frozen) ?? raw
    if (!isValidUsageRecord(record) || storage.add(record) === undefined) return
    const kind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? 'miss' : 'normal'
    options.onPersistedRecord?.(record, kind)
    queueMicrotask(() => {
      if (!active) return
      options.appendUsageRecord?.(session, record)
    })
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-token-monitor/src/features/billing.ts:22-42](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/features/billing.ts#L22-L42)

估价和charge事件的真实接线。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, services: ModuleServices): void {
  const billing: NonNullable<ModuleServices['billing']> = {
    readSnapshot: () => readBillingSnapshot(services.store, services.settings),
    priceRecord: (record, frozen) => {
      const { inputTokens, cacheReadTokens, cacheWriteTokens, outputTokens } = record
      const decision = frozen ? billUsage(frozen, { inputTokens, cacheReadTokens, cacheWriteTokens, outputTokens }, record.provider, record.model, record.timestamp) : undefined
      const cost = decision ?? priceUsage(record.inputTokens, record.cacheReadTokens, record.cacheWriteTokens, record.outputTokens, record.provider, record.model, record.timestamp, services.priceTable())
      return cost ? { ...record, ...cost, billingStatus: 'priced', ...decision } : record
    },
    onPersistedRecord: (record, kind) => {
      if (record.billingStatus !== 'priced') return
      recordCharge(record.cost, record.timestamp, kind, {
        cacheHit: { tokens: record.cacheReadTokens, cost: record.costCacheRead },
        cacheMiss: { tokens: record.inputTokens + record.cacheWriteTokens, cost: record.costInput + record.costCacheWrite },
        output: { tokens: record.outputTokens, cost: record.costOutput },
      }, { sessionId: record.sessionId, sourceEventSeq: record.sourceEventSeq!, provider: record.provider, model: record.model })
    },
  }
  ctx.effect(() => {
    services.billing = billing
    return () => { if (services.billing === billing) delete services.billing; resetCharges() }
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-token-monitor/src/pricing.ts:101-106](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/pricing.ts#L101-L106)

固定代码按历史时间选价表。

```text
/** 默认价格按历史生效时间选择；显式自定义表保留原覆盖行为。 */
export function selectPriceTable(ts: number, table: PricingTable = PRICE_TABLE): PricingTable {
  if (ts < PEAK_PRICING_START) return LEGACY_PRICE_TABLE
  if (table !== PRICE_TABLE) return table
  if (ts < FLASH_PRICING_START) return PRE_FLASH_PRICE_TABLE
  return table
```

**依据 7 · 作者声明**：[README.md:68-73](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/README.md#L68-L73)

余额校准和界面用途为作者说明。

```text
- 查询 DeepSeek 官方余额并每 60 秒校准；扣费事件到达时先逐笔更新显示余额，充值后以绿色反馈恢复金额。
- 余额查询失败或缺少 API Key 时显示明确状态；本地账本统计的今日消费不依赖余额接口成功。
- 使用 TUN / Fake-IP 代理时无需任何额外设置：代理把域名解析到 `198.18.0.0/15` 时，插件照常查询余额，并在核对该地址的 TLS 证书身份后才发送密钥。代理通过 IPv6 或 IPv4-mapped 形式返回的 Fake-IP 答复暂不支持，表现与查询失败相同——卡片回到无余额显示，不出现错误码或错误文案。
- 峰谷标识每 30 秒刷新，峰时使用红色、谷时使用绿色提示。
- 悬浮卡支持鼠标拖动、键盘移动、视口边界限制和位置记忆；右键可隐藏鲸鱼娘或打开详细设置。
- 右键菜单提供「显示鲸鱼娘」「显示用量概览」「用量明细」「通知设置」「计费规则」和「卸载与更新」六个入口。
```

#### 缺口

- 没有供应商账单和宿主用量对照。
  **影响**：不能确定估价误差、覆盖率或节费效果。
  **进一步探讨**：选明确provider/model逐条核对usage、规则版本、账单与余额变化，单列未定价及缺usage请求。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自定义余额适配怎样处理凭据、网络和过期结果？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

该功能不是让脚本直接持有API key并任意fetch。billing模块把脚本配置、凭据身份解析和Host网络函数接到BalanceRegistry；脚本在QuickJS运行，只输出request描述符或解析响应，限制32KiB源码、8MiB内存、100ms及输出大小，不支持异步。Host验证相对path、方法和auth类型，再用私有endpoint和当前key发请求；自定义请求与批准endpoint不匹配会停在unapproved，UI端有单独批准入口。这里确认的是接线和限制，不是把QuickJS名称当安全证明。

网络要求精确HTTPS来源、禁止异常端口/认证URL，DNS全部答案须是允许的公网或限定Fake-IP，实际连接固定检查后的地址且保持TLS域名，10秒时限、256KiB响应上限，非2xx不跟随重定向；解析结果还要验证。registry在返回缓存前核对脚本和凭据身份，新key或脚本revision会invalidate；异步结果结束再核对两者，避免旧凭据余额回流。DeepSeek账号源单独处理，不落到无关API key。仍需用户确认endpoint确实是只读余额语义，POST本身不是只读保证，审批是授权目标不是远端业务效果验证；也未逐个测试供应商返回语义。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/features/billing.ts:48-61](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/features/billing.ts#L48-L61)

脚本、身份和网络的真实组合。

<details>
<summary>查看原文（14行）</summary>

```text
    settingsCtx.inject(['llm'], balanceCtx => {
      const scripts = new BalanceScriptConfig(services.store, async provider => {
        if (provider === 'deepseek-account') return undefined
        const identity = await resolveBalanceIdentity(balanceCtx, provider, services.store.get().balanceProviders?.[provider])
        return identity === undefined ? undefined : builtInBalanceAdapter(identity.baseURL)
      })
      const registry = new BalanceRegistry({ readScript: provider => scripts.read(provider),
        resolveIdentity: provider => resolveBalanceIdentity(balanceCtx, provider, services.store.get().balanceProviders?.[provider]), request: requestBalanceJson,
        // Fixed-message diagnostics only; host, path, address and credentials never reach the log.
        warn: message => balanceCtx.logger.warn(message) })
      attachAccountBalance(balanceCtx, source => registry.setAccountSource(source))
      balanceCtx.effect(() => () => registry.stop(), 'token-monitor: balance requests')
      balanceCtx.inject(['webServer', 'connection'], web => registerBalanceApi(web, scripts, registry))
      balanceCtx.inject(['tools'], tools => registerBalanceTools(tools, scripts, registry))
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/balance-script.ts:74-103](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-script.ts#L74-L103)

QuickJS资源限制与无异步。

<details>
<summary>查看原文（30行）</summary>

```text
export async function evaluateBalanceScript(script: string, response?: unknown): Promise<unknown> {
  if (Buffer.byteLength(script, 'utf8') > MAX_BALANCE_SCRIPT_BYTES) throw new Error('Balance script exceeds 32 KiB')
  const quickjs = await getQuickJS()
  const runtime = quickjs.newRuntime()
  runtime.setMemoryLimit(8 * 1024 * 1024)
  runtime.setMaxStackSize(256 * 1024)
  const deadline = Date.now() + 100
  runtime.setInterruptHandler(() => Date.now() >= deadline)
  const vm = runtime.newContext()
  try {
    const responseJson = response === undefined ? undefined : JSON.stringify(response)
    if (responseJson !== undefined && Buffer.byteLength(responseJson) > MAX_BALANCE_RESPONSE_BYTES) throw new Error('Balance response exceeds 256 KiB')
    const value = vm.evalCode(`"use strict"; (() => {
      const adapter = (${script}\n);
      if (!adapter || typeof adapter.parse !== 'function') throw new Error('Expected request and parse(response)');
      const result = ${responseJson === undefined ? 'adapter.request' : `adapter.parse(${responseJson})`};
      if (result && typeof result.then === 'function') throw new Error('Async adapters are unsupported');
      return JSON.stringify(result);
    })()`, 'balance-adapter.js')
    if (value.error) {
      // Do not dump untrusted error messages, which may contain response secrets.
      value.error.dispose()
      throw new Error('Balance script failed validation or exceeded execution limits')
    }
    try {
      const json = vm.getString(value.value)
      if (Buffer.byteLength(json) > MAX_BALANCE_RESPONSE_BYTES) throw new Error('Balance script output is too large')
      return JSON.parse(json) as unknown
    } finally { value.value.dispose() }
  } finally { vm.dispose(); runtime.dispose() }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/balance-script.ts:110-117](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-script.ts#L110-L117)

请求描述符验证。

```text
export function validateBalanceRequest(value: unknown): BalanceRequest {
  const item = object(value)
  if (Object.keys(item).some(key => !['path', 'method', 'auth', 'body'].includes(key))) throw new Error('Unsupported balance request field')
  const path = validateBalancePath(item.path)
  if (item.method !== 'GET' && item.method !== 'POST') throw new Error('Balance request must use GET or POST')
  if (item.auth !== 'bearer' && item.auth !== 'x-api-key') throw new Error('Unsupported balance authentication')
  if (item.body !== undefined && (typeof item.body !== 'string' || Buffer.byteLength(item.body) > 8192 || item.method !== 'POST')) throw new Error('Invalid balance request body')
  return { path, method: item.method, auth: item.auth, ...(item.body === undefined ? {} : { body: item.body as string }) }
```

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/balance-config.ts:74-99](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-config.ts#L74-L99)

批准目标与脚本状态决定查询资格。

<details>
<summary>查看原文（26行）</summary>

```text
  private async readScript(provider: string): Promise<BalanceScriptSnapshot> {
    const saved = this.store.get().balanceScripts?.[provider]
    // A saved script is the owner's explicit choice and always wins; only a
    // provider that never saved one can fall back to a Host-shipped adapter.
    const adapter = saved === undefined ? await this.resolveAdapter(provider) : undefined
    const entry = saved ?? { revision: 0, script: adapter?.script ?? (isOfficialProvider(provider) ? OFFICIAL_BALANCE_SCRIPT : '') }
    const key = adapter === undefined ? 'saved' : 'built-in'
    const cached = this.validations.get(provider)
    if (cached?.key === key && cached.script === entry.script) {
      return { ...(await cached.value), revision: entry.revision }
    }
    const value = (async (): Promise<BalanceScriptSnapshot> => {
      if (!entry.script.trim()) return { provider, ...entry, status: 'unconfigured' }
      const refused = refuseScriptLiteral(entry.script)
      // Refused source is hidden rather than returned, so a pasted secret cannot
      // ride an editor response or a model tool result.
      if (refused !== undefined) return { provider, revision: entry.revision, script: '', status: 'invalid', error: refusedError(refused) }
      try {
        const request = validateBalanceRequest(await evaluateBalanceScript(entry.script))
        if (!this.approvedEndpoints(provider, adapter).some(endpoint => endpointKey(endpoint) === endpointKey(request))) {
          return { provider, ...entry, status: 'unapproved', request, error: UNAPPROVED_SCRIPT_ERROR }
        }
        return {
          provider, ...entry, status: 'valid', request,
          ...(adapter === undefined ? {} : { source: 'built-in' as const, adapter: adapter.label }),
        }
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-token-monitor/src/balance-api.ts:89-111](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-api.ts#L89-L111)

独立endpoint批准路由。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: '/api/token-monitor/balance-endpoint', handler: async (req, res) => {
    if (!guard(req, res)) return
    if (req.method !== 'PUT') { send(res, 405, { error: { code: 'METHOD_NOT_ALLOWED' } }); return }
    if (req.headers['content-type']?.split(';')[0]?.trim() !== 'application/json') { send(res, 415, { error: { code: 'UNSUPPORTED_MEDIA_TYPE' } }); return }
    const provider = new URL(req.url ?? '/', 'http://localhost').searchParams.get('provider') ?? ''
    try { assertProvider(ctx, provider) } catch { send(res, 400, { error: { code: 'UNKNOWN_PROVIDER' } }); return }
    let endpoint: unknown
    try {
      const chunks: Buffer[] = []; let size = 0
      for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        size += buffer.length
        if (size > 4_096) { req.resume(); send(res, 413, { error: { code: 'PAYLOAD_TOO_LARGE' } }); return }
        chunks.push(buffer)
      }
      endpoint = validateBalanceEndpoint(JSON.parse(Buffer.concat(chunks).toString('utf8')))
    } catch { send(res, 400, { error: { code: 'INVALID_REQUEST' } }); return }
    try {
      send(res, 200, await scripts.approve(provider, endpoint))
      registry.invalidate(provider)
    } catch (error) {
      const mismatch = error instanceof BalanceEndpointMismatchError
      send(res, mismatch ? 400 : 500, { error: { code: mismatch ? 'ENDPOINT_NOT_REQUESTED' : 'WRITE_FAILED' } })
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-token-monitor/src/balance-network.ts:79-142](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-network.ts#L79-L142)

HTTPS、DNS固定、认证与响应约束。

<details>
<summary>查看原文（64行）</summary>

```text
export async function requestBalanceJson(descriptor: BalanceRequest, baseURL: string, apiKey: string, signal: AbortSignal): Promise<unknown> {
  const allowed = validateBalanceRequest(descriptor)
  const base = new URL(baseURL)
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash
    || (base.port !== '' && base.port !== '443') || base.hostname.endsWith('.')) {
    throw new Error('Balance provider endpoint must be exact HTTPS')
  }
  const url = new URL(allowed.path, base.origin)
  // Fake-IP substitution applies only to a domain target; literal addresses keep the original rule.
  const domainTarget = !ipaddr.isValid(url.hostname.replace(/^\[|\]$/g, ''))
  const boundedSignal = AbortSignal.any([signal, AbortSignal.timeout(10_000)])
  let cancelLookup: (() => void) | undefined
  const records = await Promise.race([lookup(url.hostname.replace(/^\[|\]$/g, ''), { all: true, verbatim: true }),
    new Promise<never>((_, reject) => {
      cancelLookup = () => reject(new Error('Balance request cancelled'))
      if (boundedSignal.aborted) cancelLookup()
      else boundedSignal.addEventListener('abort', cancelLookup, { once: true })
    })]).finally(() => { if (cancelLookup) boundedSignal.removeEventListener('abort', cancelLookup) })
  boundedSignal.throwIfAborted()
  // A TUN proxy answers ordinary domains with its Fake-IP range; any other non-public answer stays refused.
  const acceptable = (address: string): boolean => publicBalanceAddress(address)
    || (domainTarget && fakeIpBalanceAddress(address))
  if (records.length === 0 || records.some(record => !acceptable(record.address))) throw new BalanceNetworkError('blocked', 'Balance destination must resolve to public or supported Fake-IP addresses')
  const pinned = records[0]!
  return new Promise((resolve, reject) => {
    const req = httpsRequest(url, {
      method: allowed.method, agent: false, signal: boundedSignal,
      // Keep original hostname for TLS validation; the socket uses this exact checked address.
      lookup: (_hostname, options, callback) => {
        // Answer on a later tick on purpose: node starts connecting inside this callback, and a
        // connect errno raised there destroys the socket before the request has attached its
        // listeners. That error then reaches the process as an unhandled 'error' event and ends
        // the host, so the pinned answer is never handed over in node's own connect stack.
        setImmediate(() => {
          if (options.all) callback(null, [pinned])
          else callback(null, pinned.address, pinned.family)
        })
      },
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity',
        ...(allowed.auth === 'bearer' ? { Authorization: `Bearer ${apiKey}` } : { 'x-api-key': apiKey }),
        ...(allowed.body === undefined ? {} : { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(allowed.body) }) },
    }, res => {
      const status = res.statusCode ?? 0
      if (status < 200 || status >= 300) {
        res.destroy()
        // A 429 keeps the provider's own wait so the query never polls harder than requested.
        const wait = status === 429 ? retryAfterMs(res.headers) : undefined
        reject(wait === undefined ? new BalanceHttpError(status) : new BalanceNetworkError('rate-limited', `Balance HTTP ${status}`, wait))
        return
      }
      if (res.headers['content-encoding'] && res.headers['content-encoding'] !== 'identity') {
        res.destroy(); reject(new Error('Compressed balance responses are unsupported')); return
      }
      let size = 0
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => {
        size += chunk.length
        if (size > MAX_BALANCE_RESPONSE_BYTES) { res.destroy(); reject(new Error('Balance response exceeds 256 KiB')); return }
        chunks.push(chunk)
      })
      res.on('error', () => reject(new Error('Balance response interrupted')))
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown) }
        catch { reject(new Error('Balance response is not JSON')) }
```

</details>

**依据 7 · 源码核查**：[plugins/dsh-token-monitor/src/balance-registry.ts:75-104](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-registry.ts#L75-L104)

身份变更和旧结果抑制。

<details>
<summary>查看原文（30行）</summary>

```text
  private async prepare(provider: string): Promise<{ result?: ProviderBalance | Promise<ProviderBalance | undefined> }> {
    if (this.stopped) return {}
    const generation = this.generations.get(provider) ?? 0
    const [script, identity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
    if (this.stopped || generation !== (this.generations.get(provider) ?? 0)) return {}
    if (script.status !== 'valid' || !script.request || !identity) { this.invalidate(provider); return {} }
    let entry = this.entries.get(provider)
    if (!entry || entry.revision !== script.revision || entry.identity.apiKey !== identity.apiKey || entry.identity.baseURL !== identity.baseURL) {
      this.invalidate(provider)
      entry = { identity, revision: script.revision, generation: randomUUID(), controller: new AbortController(), nextAttempt: 0, failures: 0 }
      this.entries.set(provider, entry)
    }
    if (entry.pending) return { result: entry.pending }
    const now = this.dependencies.now ?? Date.now
    if (now() < entry.nextAttempt || this.active >= 4) return entry.value ? { result: entry.value } : {}
    const current = entry
    this.active++
    current.pending = (async () => {
      try {
        const raw = await this.dependencies.request(script.request!, identity.baseURL, identity.apiKey, current.controller.signal)
        const balance = validateScriptBalance(await evaluateBalanceScript(script.script, raw))
        const [latestScript, latestIdentity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
        if (this.stopped || current.controller.signal.aborted || this.entries.get(provider) !== current) return undefined
        if (latestScript.revision !== current.revision || latestScript.status !== 'valid'
          || latestIdentity?.apiKey !== identity.apiKey || latestIdentity.baseURL !== identity.baseURL) { this.invalidate(provider); return undefined }
        current.value = { ...balance, updatedAt: now(), provider, scriptRevision: script.revision, credentialGeneration: current.generation }
        current.failures = 0
        current.lastFailure = undefined
        current.nextAttempt = now() + 15_000
        return current.value
```

</details>

#### 缺口

- 供应商余额接口、DNS/TLS防护及脚本逃逸未运行验证。
  **影响**：不能承诺任意自定义接口安全或正确。
  **进一步探讨**：先用受控接口与测试凭据验证路径审批、凭据轮换、迟到响应和非公开地址拒绝。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模块卸载、历史与失败恢复如何影响总负担？

**研究主题**：工程质量与复用、效果与总成本、依赖、兼容与流程

#### 完整回答

模块化退出有比“隐藏动画”更具体的实现。runtime为每个feature创建Cordis子生命周期并等待启动，stop先排空设置写入再dispose。uninstall在停止服务和删除前持久化tombstone，保存expectedRevision并把pending及cleanupErrors带回快照；全插件移除先停采集core，单模块移除按选项清配置或历史，并保留已移除状态防自动复装。这些设计支持中断后继续清理，但pending-delete不是已经删除成功。发布包runtime清单由打包生成，未构建源码安装可能根本没有payload，入口会明确要求改用发布包；因此仓库有lib不等于安装完整。

历史可靠性也有边界。UsageStorage.add先更新内存，再appendFileSync，写盘失败只warn仍返回成功；core回调名叫onPersistedRecord却不意味着该事件已耐久落盘。UI和动画可能当时看到用量，重启后JSONL缺失；加载历史对损坏行fail-soft跳过，不能把显示总额当完整审计账。持续成本是日志增长、余额轮询、更新模块和校验规则，现金/人工量未知。退出前应保留所需历史、确认pending清理结束，并用供应商账单作为最终依据；不能把删本插件数据当删宿主凭据或会话。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/runtime-host.ts:42-68](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/runtime-host.ts#L42-L68)

生命周期等待、排空设置和停止。

<details>
<summary>查看原文（27行）</summary>

```text
  const lifecycle: ModuleLifecycle = {
    async start(id) {
      if (children.has(id)) return
      const feature: RuntimeFeature = options.loadFeature ? await options.loadFeature(id) : await import(pathToFileURL(resolve(roots.host, `${id}.mjs`)).href + `?v=${manifest.version}`)
      const child = ctx.plugin({ name: `token-monitor-${id}`, apply: (scope: Context) => feature.apply(scope, services) })
      children.set(id, child)
      try { await child.await() } catch (error) { await child.dispose(); children.delete(id); throw error }
    },
    async stop(id) {
      await coreRuntime?.drainSettings()
      const child = children.get(id)
      if (child) { await child.dispose(); children.delete(id) }
    },
    async startCore() {
      if (coreChild) return
      coreChild = ctx.plugin({ name: 'token-monitor-background-core', apply(scope: Context) { coreRuntime = core.apply(scope, services, id => manager.isInstalled(id)) } })
      await coreChild.await()
    },
    async stopCore() {
      if (coreChild) { await coreChild.dispose(); coreChild = undefined; coreRuntime = undefined }
    },
    async eraseData(id, selection = { configuration: true, history: true }) {
      const resume = !!coreChild && id !== 'plugin'
      if (selection.history) await lifecycle.stopCore()
      try { await core.eraseData(ctx, services, id, selection) }
      finally { if (selection.history && resume) await lifecycle.startCore() }
    },
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/module-manager.ts:145-193](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/module-manager.ts#L145-L193)

先写tombstone、停止、选择清理与pending。

<details>
<summary>查看原文（49行）</summary>

```text
  async uninstall(request: ModuleUninstallRequest): Promise<ModuleSnapshot> {
    return this.exclusive(request.expectedRevision, async () => {
      if (this.state.wholePlugin && !request.wholePlugin) throw new ModuleOperationError('PLUGIN_REMOVED')
      if (this.state.restartRequired) throw new ModuleOperationError('PLUGIN_RESTART_REQUIRED')
      if (typeof request.preserveData !== 'boolean' || [request.preserveConfig, request.preserveHistory, request.wholePlugin].some(value => value !== undefined && typeof value !== 'boolean') || !Array.isArray(request.ids) || request.ids.length > 64
        || request.ids.some(id => !this.manifest.modules.some(m => m.id === id)) || (!request.wholePlugin && !request.ids.length)) throw new ModuleOperationError('INVALID_MODULE_REQUEST', 400)
      const ids = request.wholePlugin ? this.manifest.modules.map(m => m.id) : [...new Set(request.ids)]
      if (!request.wholePlugin && ids.some(id => this.state.removed[id] && !this.state.removed[id]!.pending)) throw new ModuleOperationError('MODULE_ALREADY_REMOVED')
      // Persist tombstones BEFORE teardown so a crash can never enable the module again.
      const previous = structuredClone(this.state)
      const record = { preserveData: request.preserveData, preserveConfig: request.preserveConfig ?? request.preserveData, preserveHistory: request.preserveHistory ?? request.preserveData, pending: true }
      for (const id of ids) this.state.removed[id] ??= { ...record }
      if (request.wholePlugin) this.state.wholePlugin ??= { ...record }
      this.state.revision++
      try { await this.save() } catch (error) { this.state = previous; throw error }
      if (request.wholePlugin) {
        try { await this.lifecycle.stopCore() }
        catch { this.cleanupErrors.set('plugin', 'PLUGIN_STOP_FAILED'); return this.snapshot() }
      }
      for (const id of ids) await this.finishRemoval(id)
      if (request.wholePlugin) await this.finishRemoval('plugin')
      return this.snapshot()
    })
  }

  private async finishRemoval(id: string): Promise<void> {
    const record = id === 'plugin' ? this.state.wholePlugin : this.state.removed[id]
    if (!record) return
    // Completed whole removal is one-shot; keep newly installed bytes available for recovery.
    if (this.state.wholePlugin && !record.pending) return
    const files = id === 'plugin' ? this.manifest.core : this.manifest.modules.find(m => m.id === id)?.files ?? []
    record.pending = true
    this.cleanupErrors.delete(id)
    try {
      if (id === 'plugin' && Object.values(this.state.removed).some(item => item.pending)) return
      // Whole removal stops capture before reaching any feature or core files.
      if (id !== 'plugin') await this.lifecycle.stop(id)
      const configuration = !(record.preserveConfig ?? record.preserveData), history = !(record.preserveHistory ?? record.preserveData)
      if (!record.erased) {
        if (configuration || history) await this.lifecycle.eraseData(id, { configuration, history })
        record.erased = true
        await this.save()
      }
      let failed = false
      for (const file of files) { try { await removeArtifact(this.roots, file) } catch { failed = true } }
      if (failed) this.cleanupErrors.set(id, `${id.toUpperCase()}_FILE_DELETE_PENDING`)
      record.pending = failed
    } catch { this.cleanupErrors.set(id, `${id.toUpperCase()}_CLEANUP_PENDING`) }
    await this.save()
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/module-bootstrap.ts:16-35](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/module-bootstrap.ts#L16-L35)

未打包源码缺payload的实际拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * runtime/ is generated by the packaging step and is not tracked, so a source
 * install that never ran it ships no payload. Check it before anything else so
 * the loader reports the remedy instead of a bare ENOENT on the manifest path,
 * and name the source-address case plus the uninstall-then-reinstall step that
 * actually clears it (a same-version reinstall is refused while the broken copy
 * is still listed as installed).
 */
async function assertInstalledPayload(runtime: string): Promise<void> {
  try { await access(resolve(runtime, 'manifest.json')) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    throw new Error('dsh-damage-pulse: the installed payload is incomplete: runtime/manifest.json is '
      + 'missing, so the plugin cannot start. The most common cause is installing from a source address '
      + '(a repository URL, a `github:` spec, a source archive, or an unpacked source tree that was never '
      + 'built), which ships no payload because only the packaging step generates it; a damaged or partly '
      + 'extracted install looks the same. Install the published package for the profile you actually use: '
      + '`dsh plugin --profile <profile> add dsh-damage-pulse`, or the .tgz from the GitHub Release. If the '
      + 'target profile still lists a broken copy of the same version, uninstall it first and install '
      + 'again; unbuilt source can build the payload before mounting it.')
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:140-155](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/storage.ts#L140-L155)

内存先更新、append失败仍返回成功。

<details>
<summary>查看原文（16行）</summary>

```text
  add(record: UsageRecord): SessionSummary | undefined {
    if (!isValidUsageRecord(record)) return undefined
    if (this.isDuplicateSourceEvent(record)) return undefined
    const next = this.fold(record)
    this.summaries.set(record.sessionId, next)

    // 明细：内存缓存 + JSONL 追加（fail-soft，落盘失败不影响运行时）。
    this.records.push(record)
    this.addToDailySpend(record)
    try {
      appendFileSync(join(this.dataDir, 'usage.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
    } catch (error) {
      console.warn(`[dsh-token-monitor] 明细落盘失败: ${String(error)}`)
    }

    return next
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:65-93](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/storage.ts#L65-L93)

历史加载容错和排除边界。

<details>
<summary>查看原文（29行）</summary>

```text
  /** 冷启动回读历史明细（fail-soft：文件缺失/损坏行静默跳过）。 */
  private loadHistory(): void {
    try {
      const text = readFileSync(join(this.dataDir, 'usage.jsonl'), 'utf8')
      let excluded = 0
      for (const line of text.split('\n')) {
        const trimmed = line.trim()
        if (trimmed === '') continue
        try {
          const record = normalizeUsageRecord(JSON.parse(trimmed))
          if (record !== undefined && isValidUsageRecord(record)) {
            if (this.isDuplicateSourceEvent(record)) continue
            this.records.push(record)
            this.summaries.set(record.sessionId, this.fold(record))
            this.addToDailySpend(record)
          }
          else excluded++
        } catch {
          // 跳过损坏的行
        }
      }
      if (this.records.length > 0) {
        console.log(`[dsh-token-monitor] 已加载 ${this.records.length} 条历史明细`)
      }
      if (excluded > 0) {
        console.log(`[dsh-token-monitor] 已从运行时汇总排除 ${excluded} 条不合格历史明细（原始 JSONL 未修改）`)
      }
    } catch {
      // 首次运行无文件，静默
```

</details>

#### 缺口

- 没有模块升级、删除中断及落盘失败的运行记录。
  **影响**：不能断言退出和账本恢复均已通过。
  **进一步探讨**：用独立profile注入只读存储及中途退出，核对tombstone、pending、文件、运行服务和重启历史。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么人值得试，如何验证价值及新方向？

**研究主题**：采用判断、新假设与验证、贡献与相对优势、效果与总成本

#### 完整回答

建议经常查看DSH用量、能接受本地估价而非财务账单的个人用户先试基础用量与界面，不急于添加自定义余额脚本或微信通知。相较反复打开控制台，它把缓存分量和当前任务用量放到对话旁，提供观察机会；是否改变预算行为或减少成本没有用户实验。团队财务核算、付款对账或需要证明每笔持久化的场景不宜依赖本地动画和汇总。

首次要固定宿主、完整发布包、模型/供应商规则与所需模块；持续检查规则、磁盘、余额状态和权限，选装通知会增加配置和外部数据流。失败恢复需对账本缺口、provider迟到结果和模块pending分别核对，不能用重新安装一笔带过；未记录金额与耗时。可推导未验证方向是为每条charge附带“供应商报告、估价、已耐久保存、仅内存、余额采集时间”的可见标志，并在汇总处显示覆盖，而非只给总数。它可能减少把动画/估价当已扣账的误读，增加UI负担；用模拟落盘失败和规则未知的任务比较用户能否识别缺口、纠错时间与干扰。若识别率不提高或打断更多而无决策改善，就停止该方向。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/collector-core.ts:33-46](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/collector-core.ts#L33-L46)

用量与估价状态可分层。

<details>
<summary>查看原文（14行）</summary>

```text
    const raw: UsageRecord = {
      sessionId: session.id, turn: event.data.turn, step: event.data.step, sourceEventSeq: event.seq,
      timestamp: event.time, provider: source.provider, model: source.model, inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens, cacheReadTokens: usage.cacheReadTokens ?? 0, cacheWriteTokens: usage.cacheWriteTokens ?? 0,
      reasoningTokens: usage.reasoningTokens ?? 0, cost: 0, costInput: 0, costOutput: 0, costCache: 0, costCacheRead: 0,
      costCacheWrite: 0, peak: false, billingStatus: 'unpriced',
    }
    if (!isValidUsageRecord(raw)) return
    const request = requests.get(session)
    const frozen = request?.turn === raw.turn && request.step === raw.step ? request.billing : options.readBilling?.()
    const record = options.priceRecord?.(raw, frozen) ?? raw
    if (!isValidUsageRecord(record) || storage.add(record) === undefined) return
    const kind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? 'miss' : 'normal'
    options.onPersistedRecord?.(record, kind)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:140-155](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/storage.ts#L140-L155)

耐久保存状态是新假设的具体缺口。

<details>
<summary>查看原文（16行）</summary>

```text
  add(record: UsageRecord): SessionSummary | undefined {
    if (!isValidUsageRecord(record)) return undefined
    if (this.isDuplicateSourceEvent(record)) return undefined
    const next = this.fold(record)
    this.summaries.set(record.sessionId, next)

    // 明细：内存缓存 + JSONL 追加（fail-soft，落盘失败不影响运行时）。
    this.records.push(record)
    this.addToDailySpend(record)
    try {
      appendFileSync(join(this.dataDir, 'usage.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
    } catch (error) {
      console.warn(`[dsh-token-monitor] 明细落盘失败: ${String(error)}`)
    }

    return next
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/balance-registry.ts:94-104](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/plugins/dsh-token-monitor/src/balance-registry.ts#L94-L104)

余额有独立更新时间和身份。

<details>
<summary>查看原文（11行）</summary>

```text
        const raw = await this.dependencies.request(script.request!, identity.baseURL, identity.apiKey, current.controller.signal)
        const balance = validateScriptBalance(await evaluateBalanceScript(script.script, raw))
        const [latestScript, latestIdentity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
        if (this.stopped || current.controller.signal.aborted || this.entries.get(provider) !== current) return undefined
        if (latestScript.revision !== current.revision || latestScript.status !== 'valid'
          || latestIdentity?.apiKey !== identity.apiKey || latestIdentity.baseURL !== identity.baseURL) { this.invalidate(provider); return undefined }
        current.value = { ...balance, updatedAt: now(), provider, scriptRevision: script.revision, credentialGeneration: current.generation }
        current.failures = 0
        current.lastFailure = undefined
        current.nextAttempt = now() + 15_000
        return current.value
```

</details>

**依据 4 · 作者声明**：[README.md:87-94](https://github.com/wssfk12138/dsh-damage-pulse/blob/d51989d7ee378db9d2da9aef43f5161c34680dee/README.md#L87-L94)

作者模块配置与退出说明。

```text
## 模块化管理

插件把能力拆成五个可以单独卸载的功能模块：**桌宠功能区**（鲸鱼娘动画、拖动与桌宠资源）、**数据概览功能区**（数据概览、用量明细与历史查询）、**通知功能区**（预算、异常、峰谷提醒与桌宠气泡）、**计费规则功能区**（官方/第三方计费规则、余额查询与扣费动画）、**微信通知渠道**（微信登录、连接、测试消息与投递）。

- 在「卸载与更新」面板可以看到当前插件版本、每个模块的安装状态，单独卸载某个模块，或者一次性卸载整个插件。
- 已卸载的模块会记住状态并禁止自动重装。卸载默认勾选保留配置与历史数据；取消对应选项会清除该插件或模块拥有的配置、用量账本与历史，不会清除宿主凭据。
- 「检查更新」读取项目主页的 GitHub Release，比较版本后提供「安装更新」；安装前会校验版本、资产名称、下载来源与 SHA-256，只有识别到可安装的 profile 时才执行安装。
- 用量采集属于常驻基础能力：卸载整个插件时会一并停止采集，重启仍保持卸载状态。恢复时，在桌面版「插件」页移除仍列出的插件，再添加完整的发布包或打包后的 `.tgz`，重启当前 profile；新包的全部文件通过校验后恢复。缺失或损坏的包不会自动恢复，启动日志会提示重新安装。
```

#### 缺口

- 没有预算行为、误读与使用干扰的用户对照。
  **影响**：不能宣称桌宠导致节费或新状态标志更好。
  **进一步探讨**：用同一批带缺口记录让用户分别解释总额，记录误判和修复时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
