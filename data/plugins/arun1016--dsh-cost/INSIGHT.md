# dsh-cost

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[20be220](https://github.com/Arun1016/dsh-cost/tree/20be220d554feb5df6c2c71f8b59d8a198e17c8f)

<!-- BEGIN META -->
[![npm 30d 378](https://img.shields.io/static/v1?label=npm+30d&message=378&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-pill) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-pill)
<!-- END META -->

> **功能**：在会话输入框旁显示账户余额、计费时段及按模型拆分的会话费用。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明增量在会话内将余额和逐请求费用联系起来，按事件时间选价格而不是只用总token乘当下费率。价格本身继承外部计费规则，没有识别新计费方法。

> **主要限制**：[Q03](#research-q03) 的关键是读者是否把估算当实际账单。非北京时区、未知模型与缺usage都可改变结果，余额存在也不能证明本地费用准确。

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
  - [Q01 · 为什么需要在会话中同时看余额和费用？](#detail-section-11)
  - [Q02 · 会话费用与余额分别怎样产生？](#detail-section-12)
  - [Q03 · 哪些条件让显示值偏离真实账单？](#detail-section-13)
  - [Q04 · 观察费用值是否值得引入配置与维护负担？](#detail-section-14)
  - [Q05 · 来源标签和误差对账能否让估算更可用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁使用DeepSeek会话的用户可在输入框旁观察账户余额、缓存与非缓存输入及输出费用，替代切换供应商后台并手算token。合格结果是能解释本会话消耗的构成及账户余量，两者不能混为同一数据源。插件的增量是本地会话归因与账户读数的组合，未改变模型计费或降低实际请求费用。它只适合该费率模型覆盖的人群，不应作为跨供应商统一财务账。

参照供应商余额页和手工token估算；未查本轮实时价目，不复述为当前官方价格。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话费用分桶 | 看缓存、未缓存输入和输出 | 依赖usage和内置价格 |
| 模型费用分组 | 查活会话主要消耗 | 缺model source会跳过 |
| 余额读取 | 看账户剩余金额 | 需key联网，失败和30秒缓存会滞后 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web与webServer | 必需 | 路由和面板 | 无显示链路 |
| model source及usage | 计价必需 | 归因和分桶 | 事件跳过 |
| DeepSeek key及联网 | 余额必需 | 官方余额 | 费用仍可计算，余额缺失 |
| 价目和北京时区 | 准确性必需 | 选计价规则 | 金额可能偏离账单 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本时区价目 | 不符合先用供应商后台 |
| 加载 | 宿主注册路由，用户可选配key | 显示费用与可选余额 |
| 核算 | 用户用已知usage任务比较 | 解释每桶及账单差额 |
| 故障 | 用户等待缓存或查后台 | 不把空读数当零费用 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主资源，费用未知 | 插件配置、可选key；耗时未知 | 已有DSH Web |
| 持续使用 | 余额网络请求、事件折叠 | 调价日历维护和账单核对 | 无模型额外调用不代表零成本 |
| 失败恢复 | 重试网络、资源未知 | 回后台核对并暂停使用估算 | 错误可能无余额而不明显 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话归因 | usage按事件时间分桶 | 与供应商账单误差 |
| 余额读数 | 官方API及30秒缓存 | API失败时用户辨识 |
| 节省操作 | 同处展示 | 节时与预算改善未测 |

> **思考**：[Q03](#research-q03) 的关键是读者是否把估算当实际账单。非北京时区、未知模型与缺usage都可改变结果，余额存在也不能证明本地费用准确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明增量在会话内将余额和逐请求费用联系起来，按事件时间选价格而不是只用总token乘当下费率。价格本身继承外部计费规则，没有识别新计费方法。

纯函数化时段、价格与usage累积方便检查和移植；关键维护点是供应商规则、宿主事件结构与响应失败语义。不能据测试文件存在声称验证通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的关键是读者是否把估算当实际账单。非北京时区、未知模型与缺usage都可改变结果，余额存在也不能证明本地费用准确。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合要解释DSH DeepSeek调用构成、接受估算性质的用户小范围试用。首次加载Web插件，可选提供key看余额；持续需要维护节假日与调价版本，失败时回供应商后台核对。面板本身未额外调用模型，但有定时余额网络请求和事件折叠资源；金额和耗时未测，不能称零成本。试用取一段已知usage的会话分别跨峰谷和缓存命中核算，若币种、模型或冷会话估计误导即停止把它用于决策。没有账单对照时建议仅观察，不能正式采用为核算真相。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

面板数据管线与本地折叠可核查；当前官方价目与账单精度尚未验证；来源对账设计为假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README、src/index.ts的计价、凭据、路由和错误边界。
- 下一步：- 已检查源码及作者声明。
- 未执行插件、测试或账单请求。
- 真实价目、时区误差及费用效果待核对。

**分析版本**

- **仓库**：[Arun1016/dsh-cost](https://github.com/Arun1016/dsh-cost)
- **版本号**：1.0.2（[固定提交 20be220](https://github.com/Arun1016/dsh-cost/tree/20be220d554feb5df6c2c71f8b59d8a198e17c8f)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出带来源、价目版本和偏差对账的未验证设计；以误判减少及定位偏差时间为验收，不以额外显示信息即视为增效。

- 已检查源码及作者声明。
- 未执行插件、测试或账单请求。
- 真实价目、时区误差及费用效果待核对。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1560 | 1084 | 509 | — |
| .md | source | 3 | 300 | — | — | 4035 |
| .tsx | source | 1 | 340 | 261 | 62 | — |
| .ts | source | 4 | 698 | 393 | 250 | — |
| .ts | test | 1 | 306 | 248 | 28 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Arun1016/dsh-cost/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：余额和费用面板能否帮助用户分清实际账单与本地估算？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么需要在会话中同时看余额和费用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

频繁使用DeepSeek会话的用户可在输入框旁观察账户余额、缓存与非缓存输入及输出费用，替代切换供应商后台并手算token。合格结果是能解释本会话消耗的构成及账户余量，两者不能混为同一数据源。插件的增量是本地会话归因与账户读数的组合，未改变模型计费或降低实际请求费用。它只适合该费率模型覆盖的人群，不应作为跨供应商统一财务账。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-24](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/README.zh.md#L3-L24)

作者列明面板三项用途与费用不需要key。

<details>
<summary>查看原文（22行）</summary>

```text
DeepSeek Harness 的**账户余额及费用统计**胶囊。它在会话输入框下方的官方统计行右侧新增一枚胶囊，集成三样信息：计费时段（高峰 / 低谷，用颜色区分）、账户余额、本次会话费用；点击展开可查看本次会话的详细费用统计——缓存命中输入、缓存未命中输入、输出三项金额，以及按模型拆分的花费。费用部分不需要任何凭据；余额部分需要一个 DeepSeek API key。

> 社区插件，与 DeepSeek 官方无隶属关系，也不由官方随包分发。

## 截图

![输入框下方统计行最右侧的费用胶囊](assets/screenshots/pill-101c.png)

![点击胶囊展开的明细弹窗](assets/screenshots/dialog-101c.png)

## 功能

- **统计行最右侧的胶囊**：以 `order: 2` 注册到 `conversation.composer.dock`，排在官方两颗统计胶囊（`activity` = 0、`usage` = 1）之后。时段显示为「高峰」或「低谷」，并用红 / 绿圆点区分。
- **明细弹窗**：显示计费时段、账户余额、本次会话费用，以及按三项拆分的金额——缓存命中输入、缓存未命中输入（含缓存写入）、输出；宿主能按模型折算时，还会列出各模型的费用。
- **与官方一致的计费口径**：内置 2026-09-10 降价与 pro→flash 路由。会话处于挂载状态时逐请求折算，跨越降价、路由切换或高峰边界的用量各自沿用当时的价目表，不会混用两套费率。
- **高峰 / 低谷判定**：工作日 `9:00–12:00`、`14:00–18:00` 为高峰；其余时间、周末与法定节假日全天为低谷（含调休成为工作日的周末）。内建的 2026 年法定节假日表可通过 `Config.holidays` 替换。
- **费率跟随官方调价**：费率表内置于插件，随插件版本更新以跟随官方调价。
- **没有 API key 也能用**：只用 DeepSeek 账户登录的用户照样能看到计费时段与会话费用，只是不显示余额。
- **不保存凭据**：API key 通过 dsh 的凭据服务（credentials seam）解析，只在进程内使用，不写入磁盘。
- **中英双语**：`cost-stats` 命名空间下 14 条词条，中文与英文各一套，随应用语言切换。
- **只读宿主路由**：浏览器端只请求宿主的 `/api/dsh-balance`（每个会话步一次，另有 60 秒轮询），不访问任何第三方接口。
- **无本地状态**：不持久化任何数据，卸载后无残留。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话费用与余额分别怎样产生？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

余额通过宿主credentials解析DEEPSEEK_API_KEY，只在凭据服务不存在时回退环境变量；宿主请求官方balance接口并按key缓存30秒。费用是本地事件折叠，读取assistant/message的model source及usage，按event.time选价格表后累计三种桶和模型分组。没有usage或model source的事件跳过。浏览器读/api/dsh-balance并展示。余额是真实API读数，费用是源于本地用量与内置价目的计算；供应商原始账单未参与折叠。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:343-390](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L343-L390)

逐事件定价及缺字段跳过。

<details>
<summary>查看原文（48行）</summary>

```text
 * @param session - the live session whose log is folded.
 * @param holidays - statutory-holiday date keys billed off-peak all day.
 * @returns the summed cost with its bucket and per-model splits, the number of
 *   usage-carrying steps, and the last model seen — or undefined when no step
 *   reported usage.
 */
export function foldSessionCost(session: Session, holidays: ReadonlySet<string> = DEFAULT_HOLIDAY_SET): SessionCost | undefined {
  const byModel = new Map<string, ModelAccumulator>()
  let lastModel: string | undefined
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'assistant/message') continue
    const source = event.data.message?.source
    if (source === undefined || source.kind !== 'model') continue
    if (event.data.usage === undefined) continue
    // Group by canonical name: the flash aliases bill identically and must not
    // split one model into two rows when a session spans the rename.
    const model = canonicalModel(source.model)
    let acc = byModel.get(model)
    if (acc === undefined) {
      acc = {
        uncachedInputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        outputTokens: 0,
        requests: 0,
        total: 0,
        buckets: { cacheRead: 0, uncachedInput: 0, output: 0 },
      }
      byModel.set(model, acc)
    }
    accumulateUsage(event.data.usage, acc, pricesAt(model, event.time, holidays))
    lastModel = model
  }
  if (byModel.size === 0) return undefined
  let total = 0
  let requests = 0
  const buckets: SessionCostBuckets = { cacheRead: 0, uncachedInput: 0, output: 0 }
  const models: SessionModelCost[] = []
  for (const [model, acc] of byModel) {
    total += acc.total
    requests += acc.requests
    buckets.cacheRead += acc.buckets.cacheRead
    buckets.uncachedInput += acc.buckets.uncachedInput
    buckets.output += acc.buckets.output
    models.push({ model, total: acc.total, requests: acc.requests })
  }
  // Expensive model first: the popover lists the session's cost drivers up top.
  models.sort((a, b) => b.total - a.total)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:509-528](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L509-L528)

key缓存与凭据优先。

<details>
<summary>查看原文（20行）</summary>

```text
async function cachedBalance(apiKey: string): Promise<BalanceInfo | undefined> {
  const now = Date.now()
  if (balanceCache !== undefined && balanceCache.key === apiKey && now - balanceCache.at < BALANCE_CACHE_MS) {
    return balanceCache.value
  }
  const value = await fetchBalance(apiKey)
  balanceCache = { at: now, key: apiKey, value }
  return value
}

/** Resolve the DeepSeek API key through the credentials seam, or the environment. */
async function resolveApiKey(ctx: Context): Promise<string | undefined> {
  const ref = credentialRef(API_KEY_ENV)
  const credentials = ctx.get('credentials')
  if (credentials !== undefined) {
    const hit = await credentials.resolve(ref)
    if (hit !== undefined) return hit.value
    return undefined
  }
  return process.env[API_KEY_ENV]?.trim() || undefined
```

</details>

**依据 3 · 源码核查**：[src/index.ts:537-575](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L537-L575)

路由整合两条数据链。

<details>
<summary>查看原文（39行）</summary>

```text
export function apply(ctx: Context, config: Config = { holidays: DEFAULT_HOLIDAYS }): void {
  const holidays: ReadonlySet<string> = new Set(config.holidays)
  ctx.inject(['webServer'], webCtx => webCtx.effect(() => webCtx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-balance',
    handler: async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      const respond = (body: BalanceResponse, status = 200): void => {
        const payload = JSON.stringify(body)
        res.writeHead(status, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(payload)
      }
      let sessionId: string | undefined
      try {
        sessionId = new URL(req.url ?? '/', 'http://localhost').searchParams.get('sessionId') ?? undefined
      } catch {
        sessionId = undefined
      }

      const apiKey = await resolveApiKey(webCtx)
      const balance = apiKey === undefined ? undefined : await cachedBalance(apiKey)

      const session = liveSession(webCtx, sessionId)
      // The client's own estimator reads these: the rates in effect right now
      // for the model the deployment ships.
      const prices = pricesAt(FALLBACK_MODEL, Date.now(), holidays)
      const response: BalanceResponse = {
        prices,
        ...(balance !== undefined ? { balance_infos: [balance] } : {}),
      }
      // Exact per-request fold over the live log first; fall back to the
      // durable projection at today's rates when the session is not attached
      // (a cold session is priced by the client from its own read anyway).
      if (session !== undefined) {
        const folded = foldSessionCost(session, holidays)
        if (folded !== undefined) {
          response.sessionCost = folded
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些条件让显示值偏离真实账单？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

价格与切换时间是代码常量，不认识的模型走Flash，时段函数使用主机本地getHours/getDay，因此非北京时区不满足作者的计价假设。逐请求折叠是优于当前价目乘聚合用量的设计，但缺usage会漏计；无活跃会话时不具备同样时间归因。余额API失败返回undefined且也缓存，用户可能只能看到不完整读数。代码结构把定价、解析和折叠分成函数便于借鉴，但这种透明估算不等于账单正确性证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:194-219](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L194-L219)

时段读取本机日历与低谷折半。

<details>
<summary>查看原文（26行）</summary>

```text
export function isPeakPeriod(now: Date, holidays: ReadonlySet<string> = DEFAULT_HOLIDAY_SET): boolean {
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  if (holidays.has(localDateKey(now))) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  return (minutes >= 9 * 60 && minutes < 12 * 60)
    || (minutes >= 14 * 60 && minutes < 18 * 60)
}

/**
 * The billing prices for one period: peak figures when `isPeakPeriod`,
 * exactly half of them otherwise (official rule).
 * @param modelPrices - the model's peak rates.
 * @param period - the current billing period.
 * @returns the per-million-token prices to bill with.
 */
export function pricesFor(
  modelPrices: ModelPrices,
  period: 'peak' | 'off-peak',
): { input: number; cacheRead: number; output: number } {
  const factor = period === 'peak' ? 1 : 0.5
  return {
    input: modelPrices.input * factor,
    cacheRead: modelPrices.cacheRead * factor,
    output: modelPrices.output * factor,
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:250-255](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L250-L255)

非pro模型回退flash。

```text
export function peakPricesAt(model: string, timeMs: number): ModelPrices {
  const flash = timeMs < FLASH_CUT_MS ? FLASH_PRICES_BEFORE_CUT : FLASH_PRICES_AFTER_CUT
  if (model === 'deepseek-v4-pro') {
    return timeMs < PRO_ROUTED_TO_FLASH_MS ? PRO_PRICES : flash
  }
  return flash
```

**依据 3 · 源码核查**：[src/index.ts:413-440](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L413-L440)

请求异常转换为空余额。

<details>
<summary>查看原文（28行）</summary>

```text
export function fetchBalance(apiKey: string): Promise<BalanceInfo | undefined> {
  return new Promise((resolve) => {
    const req = httpsRequest(BALANCE_URL, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + apiKey,
        accept: 'application/json',
      },
      timeout: 15_000,
    }, (res: IncomingMessage) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk: string) => { body += chunk })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve(undefined)
          return
        }
        try {
          resolve(parseBalanceInfo(JSON.parse(body)))
        } catch {
          resolve(undefined)
        }
      })
    })
    req.on('timeout', () => { req.destroy() })
    req.on('error', () => { resolve(undefined) })
    req.end()
```

</details>

#### 缺口

- 内置价目与本轮官方实际计价的一致性及同任务账单差额未知。
  **影响**：不能用于结算或预算强制止损。
  **进一步探讨**：核对带时间的供应商价目，按请求账单对齐时区、模型与缓存字段。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 观察费用值是否值得引入配置与维护负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合要解释DSH DeepSeek调用构成、接受估算性质的用户小范围试用。首次加载Web插件，可选提供key看余额；持续需要维护节假日与调价版本，失败时回供应商后台核对。面板本身未额外调用模型，但有定时余额网络请求和事件折叠资源；金额和耗时未测，不能称零成本。试用取一段已知usage的会话分别跨峰谷和缓存命中核算，若币种、模型或冷会话估计误导即停止把它用于决策。没有账单对照时建议仅观察，不能正式采用为核算真相。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:78-94](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/README.zh.md#L78-L94)

已知限制与独立构建负担。

<details>
<summary>查看原文（17行）</summary>

```text
## 已知限制

- **会话挂载时**，宿主按请求逐一折算，跨越降价、路由切换或高峰边界的用量各自保留当时价目；**未挂载的会话**由宿主按当下 Flash 价目对聚合用量一次性计价，且不带估算标记；浏览器端自己的兜底估算同样使用当下价目，中文标 `(估)`、英文标 `(est)`。
- 各段读数都是条件渲染：没有余额时只隐藏余额段；费用恰好为 `¥0.00` 时隐藏费用段；**宿主路由缺失或报错时，整颗胶囊静默消失**，没有占位也没有错误提示，失败后不再按步重试，只保留 60 秒轮询。
- 金额一律以 `¥` 前缀显示，不随接口返回的账户币种变化。余额固定 2 位小数；费用为 2 位小数，低于 `¥0.01` 时改用 4 位。
- 逐模型明细只在宿主能按模型折算时出现；模型名会归一化（例如 `deepseek-v4-flash` 与 `deepseek-v4-flash-vision-exp` 都显示为 `deepseek-flash`）。
- 余额失败是静默的：未配置 key、key 无效、网络错误、15 秒超时，都会返回 `200` 且不含 `balance_infos` 字段，而这个空结果同样会被缓存 30 秒。
- 余额缓存是进程级、跨会话共享的，只有换了 key 才失效，因此刚充值后最多滞后 30 秒才会反映出来。
- 插件不认识的模型 id 一律按 Flash 价目计价。
- 按请求累加，与账户账单之间可能存在分位舍入差。
- 事件里缺少 model source 或 usage 时，跳过计价。
- 弹窗没有高度上限，也不与官方胶囊共享互斥开合状态，可能和另一个弹窗同时开着。
- 内建节假日表只覆盖 2026 年。

## 开发

源码在 `src/`（宿主端 `index.ts`，浏览器端 `client/`）。它沿用官方 dsh monorepo 工具链构建：`tsconfig.*.json` 与 `tsdown.config.ts` 通过相对路径引用 monorepo（`../../../tsconfig.base.json`、`../../client/tsdown.client.ts`），因此构建时需要把这个包放回那棵目录树，**仓库本身无法独立构建**。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:498-515](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L498-L515)

缓存及轮询成本的一部分。

<details>
<summary>查看原文（18行）</summary>

```text
const BALANCE_CACHE_MS = 30_000

/** 最近一次余额查询的结果、键与时间。 */
let balanceCache: { at: number; key: string; value: BalanceInfo | undefined } | undefined

/**
 * Balance with the cache window above applied. The cache is keyed by the resolved
 * API key, so switching credentials never reuses another account's balance.
 * @param apiKey - the resolved DeepSeek API key.
 * @returns the parsed balance row, or undefined when the API denied.
 */
async function cachedBalance(apiKey: string): Promise<BalanceInfo | undefined> {
  const now = Date.now()
  if (balanceCache !== undefined && balanceCache.key === apiKey && now - balanceCache.at < BALANCE_CACHE_MS) {
    return balanceCache.value
  }
  const value = await fetchBalance(apiKey)
  balanceCache = { at: now, key: apiKey, value }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 来源标签和误差对账能否让估算更可用？

**研究主题**：新假设与验证

#### 完整回答

现有实现可区分余额API、逐请求事件与聚合用量，推导未验证方案是每个金额携带价格表版本、时区、漏usage数及数据来源，并在用户提供供应商账单时显示偏差。相对单一金额，它让用户知道何时只能估算，代价是更多UI信息和对账输入。最小实验给相同使用者展示现版与带来源版的混合模型、跨时区样本，观察误判账单准确值的次数及定位偏差时间。若信息负担更高却不改善判断，或偏差无法解释，便否定其优势。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:343-390](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L343-L390)

计价链已有逐事件与跳过分支。

<details>
<summary>查看原文（48行）</summary>

```text
 * @param session - the live session whose log is folded.
 * @param holidays - statutory-holiday date keys billed off-peak all day.
 * @returns the summed cost with its bucket and per-model splits, the number of
 *   usage-carrying steps, and the last model seen — or undefined when no step
 *   reported usage.
 */
export function foldSessionCost(session: Session, holidays: ReadonlySet<string> = DEFAULT_HOLIDAY_SET): SessionCost | undefined {
  const byModel = new Map<string, ModelAccumulator>()
  let lastModel: string | undefined
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'assistant/message') continue
    const source = event.data.message?.source
    if (source === undefined || source.kind !== 'model') continue
    if (event.data.usage === undefined) continue
    // Group by canonical name: the flash aliases bill identically and must not
    // split one model into two rows when a session spans the rename.
    const model = canonicalModel(source.model)
    let acc = byModel.get(model)
    if (acc === undefined) {
      acc = {
        uncachedInputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        outputTokens: 0,
        requests: 0,
        total: 0,
        buckets: { cacheRead: 0, uncachedInput: 0, output: 0 },
      }
      byModel.set(model, acc)
    }
    accumulateUsage(event.data.usage, acc, pricesAt(model, event.time, holidays))
    lastModel = model
  }
  if (byModel.size === 0) return undefined
  let total = 0
  let requests = 0
  const buckets: SessionCostBuckets = { cacheRead: 0, uncachedInput: 0, output: 0 }
  const models: SessionModelCost[] = []
  for (const [model, acc] of byModel) {
    total += acc.total
    requests += acc.requests
    buckets.cacheRead += acc.buckets.cacheRead
    buckets.uncachedInput += acc.buckets.uncachedInput
    buckets.output += acc.buckets.output
    models.push({ model, total: acc.total, requests: acc.requests })
  }
  // Expensive model first: the popover lists the session's cost drivers up top.
  models.sort((a, b) => b.total - a.total)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:444-453](https://github.com/Arun1016/dsh-cost/blob/20be220d554feb5df6c2c71f8b59d8a198e17c8f/src/index.ts#L444-L453)

响应目前只提供价格与可选金额。

<details>
<summary>查看原文（10行）</summary>

```text
/** The complete JSON body served by `/api/dsh-balance`. */
export interface BalanceResponse {
  /** Non-empty on any failure; the client then hides the balance/cost segment whole. */
  error?: string
  /** Official account rows; absent when no key is configured, so the client shows prices without balance. */
  balance_infos?: BalanceInfo[]
  /** The billing prices in effect right now. */
  prices: BalancePrices
  /** Accumulated session cost; absent when the session has no token usage. */
  sessionCost?: SessionCost
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
