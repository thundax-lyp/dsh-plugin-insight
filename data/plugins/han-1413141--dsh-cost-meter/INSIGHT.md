# dsh-cost-meter

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[aa41d94](https://github.com/Han-1413141/dsh-cost-meter/tree/aa41d946c475b9e37ee11362e0e130df816d52b0)

<!-- BEGIN META -->
[![GitHub ★ 539](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=539&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 112,534](https://img.shields.io/static/v1?label=npm+30d&message=112%2C534&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)
<!-- END META -->

> **功能**：为 DSH 提供按会话和模型的用量、费用、预算与账户额度展示

> **亮点**：[Q01](#research-q01) 按会话聚合五桶用量，并将Plan等值与API现金分开。[Q02](#research-q02) 处理包装流重复计费和取消传播，贡献在可观察性集成与归因。

> **主要限制**：[Q03](#research-q03) 同量包装调用可能在窗口内合并，价格未知可显示零，缺usage不证明免费；高并发worker总账不能只凭这条观察链验收。

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
  - [Q01 · 相比看供应商余额，本地账本增加什么任务能力？](#detail-section-11)
  - [Q02 · usage如何进入账本，取消及嵌套流如何处理？](#detail-section-12)
  - [Q03 · 去重何时可能把合法请求合并，预算是否硬阻断？](#detail-section-13)
  - [Q04 · 首次、持续与恢复成本是什么，哪些人能有限试用？](#detail-section-14)
  - [Q05 · 能否用调用身份替代token指纹，作为多worker研究计量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多会话、多模型的DSH用户希望按任务定位消耗，而不是只看账户剩余余额。

供应商账单与DSH原始usage日志配合手工会话归因；本地估值用于观察，不代替最终现金对账。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 用量归因 | 按会话模型观察消耗 | 缺usage或去重误合并可能漏计 |
| 双轨估值 | 分开Plan等值与API现金 | 价格与分类需要校准 |
| 账本worker | 日常持久化与退出处理 | 锁和崩溃恢复仍需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH与模型usage事件 | 必需 | 接收会话用量 | 缺usage不能判零消费 |
| 正确价格、汇率和Plan分类 | 估值必需 | 区分现金与等值 | 未匹配0金额须回账单核查 |
| 可写账本目录 | 持久化必需 | 保存调用和聚合 | 保留备份处理锁与失败 |
| 外部余额凭据与网络 | 查询才需 | 取供应商账户数据 | 本轮未核所有提供商 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份账本并匹配宿主 | 原日志可独立查询 |
| 校准 | 用户用已知调用核对桶与价格 | API现金和Plan等值区分 |
| 观察 | 插件捕获usage并按会话归因 | 同量与取消样例对账无误 |
| 异常 | 用户保留账本回供应商记录 | 不用预算条当硬阻断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地存储和少量校准调用，金额未知 | 价格、模型和Plan分类核对 | 未安装实测 |
| 持续使用 | 日志存储与查询网络 | 维护价格与供应商接口 | 无节省金额证明 |
| 失败恢复 | 可能重放日志与修复账本 | 备份、锁排查、供应商对账 | worker恢复未执行验收 |
| 退出 | 账本保留资源 | 禁用展示并保全历史 | 供应商账单仍为复核依据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话归因 | 五桶与session/provider记录 | 真实账单完整覆盖 |
| 去重 | 包装转发对可被合并 | 同量独立包装调用可能漏记 |
| 预算 | 观察进度与警告 | 不构成本轮所查链的硬阻断 |
| 费用 | API现金与Plan等值分开 | 无价格时0不表示免费 |

> **思考**：[Q03](#research-q03) 同量包装调用可能在窗口内合并，价格未知可显示零，缺usage不证明免费；高并发worker总账不能只凭这条观察链验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 按会话聚合五桶用量，并将Plan等值与API现金分开。[Q02](#research-q02) 处理包装流重复计费和取消传播，贡献在可观察性集成与归因。

[Q02](#research-q02)取消传播、finally记录和独立写worker处理具体故障；[Q03](#research-q03)去重按值而非身份的取舍需要明确。本轮检查已跟入口使用的lib文件，不能把静态候选和测试脚本当运行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 同量包装调用可能在窗口内合并，价格未知可显示零，缺usage不证明免费；高并发worker总账不能只凭这条观察链验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 有限试用以几笔可核对调用、取消和未知价格为验收；显示金额与供应商记录不符时停止依赖，保全账本回原日志。

最小对照用正常独立调用、同量并发、重复转发、取消缺usage和重试五类记录，比当前指纹计量与调用ID收据的漏计、重复计数及人工对账时间。必须确认供应商ID在每层可传递；若SDK不暴露稳定ID、边界映射成本超过收益，或无法把缺失准确标明，则不宣称总成本完整。没有运行数据，不能预告省多少token。 见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地计费主链、分类与去重边界有固定源码支持；全部供应商、持久化恢复和实际省钱未验证。任务调用收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/bootstrap.js、lib/index.js、lib/billing-stream.js、lib/store.js、lib/usage-dedup.js、lib/ledger-writer.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定aa41d946c475b9e37ee11362e0e130df816d52b0，检查README、包、全局billing接线、流、账本account、去重及worker主路径；不涵盖所有额度供应商与客户端界面。
- 下一步：源码级检查；未加载插件、执行目标测试、调用供应商或对账。不能证明省钱、完整多worker计量或所有后端兼容。

**分析版本**

- **仓库**：[Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter)
- **版本号**：1.9.41（[固定提交 aa41d94](https://github.com/Han-1413141/dsh-cost-meter/tree/aa41d946c475b9e37ee11362e0e130df816d52b0)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以推导未验证的任务计量收据，优先使用服务端request_id、父任务ID、worker实例和尝试号做身份，usage只是计量值而非去重身份。对子调用和包装转发显式记录父子关系，缺失usage或未知价格保存unknown状态；按通过验收的报告聚合全部父端、worker、失败与补查成本。相对同量指纹，增量是可区别两个等量的真实调用，并解释主端下降是否只是转移到worker。

最小对照用正常独立调用、同量并发、重复转发、取消缺usage和重试五类记录，比当前指纹计量与调用ID收据的漏计、重复计数及人工对账时间。必须确认供应商ID在每层可传递；若SDK不暴露稳定ID、边界映射成本超过收益，或无法把缺失准确标明，则不宣称总成本完整。没有运行数据，不能预告省多少token。 见 [Q05](#research-q05)。

源码级检查；未加载插件、执行目标测试、调用供应商或对账。不能证明省钱、完整多worker计量或所有后端兼容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 289 | 14546 | — | — | 349004 |
| .js | source | 135 | 40174 | 34469 | 5174 | — |
| .mjs | source | 10 | 873 | 716 | 140 | — |
| .mjs | test | 217 | 37346 | 34293 | 2263 | — |
| .mjs | example | 6 | 263 | 230 | 28 | — |
| .md | example | 1 | 21 | — | — | 175 |
| .js | example | 1 | 3 | 3 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 106](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=106&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 104](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=104&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地用量账本能否支持跨模型费用复核，且不误当供应商最终扣款？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比看供应商余额，本地账本增加什么任务能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在多个DSH会话和模型间切换、需要知道哪项任务消耗资源的用户。供应商余额只能回答账户剩余，难以按DSH会话归因；插件在模型流上捕获usage，按model/provider/session与请求时间计入账本，再提供会话和时间范围展示。这是观察与归因贡献，不等于决定哪个任务值得花钱，也不自动优化模型或减少调用。

Plan调用金额可作为等值参考，与实际API现金分开记录，因此不能把面板总cost当成供应商已扣款。价格匹配、汇率、历史时点和账本范围都影响金额；没有供应商逐调用对账时，它更适合发现异常和做比较线索，不是报销、审计或准确现金余额的唯一依据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3830-3853](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/index.js#L3830-L3853)

全局模型流到五桶、去重、账本与会话投影的接线。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.on('llm/stream', createLlmStreamBilling({
    activity: contextActivity(ctx),
    bridge: billionContext,
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
    },
  }), { global: true })

  // costUsage 投影:向会话历史页/推送帧提供 token 桶(客户端计价)。
  installNativeSearchBilling(ctx, ledger)

  ctx.inject(['sessionProjections'], (projectionCtx) => {
    projectionCtx.sessionProjections.register(makeCostUsageProjection(ledger))
```

</details>

**依据 2 · 源码核查**：[lib/store.js:2381-2427](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/store.js#L2381-L2427)

请求时点价格匹配，Plan等值与apiCost分离。

<details>
<summary>查看原文（47行）</summary>

```text
  account(tokens, modelId, sessionId, atMs, provider, meter, requestFee) {
    if (this.closed) return
    if (requestFee !== undefined && (!validRequestFee(requestFee, atMs) || provider !== 'deepseek-official' || !matchesRequestFeeModel(modelId, requestFee))) throw new Error('Invalid official web request fee')
    const pricing = pricingConfigAt(this.config, atMs, sessionId, `${provider || 'deepseek'}:${modelId}`)
    const resolved = providerPriceEntryFor(provider, modelId, pricing.prices, {
      mode: pricing.priceMatch === 'exact' ? 'exact' : 'auto',
      overrides: pricing.priceOverrides,
    })
    const entry = resolved.entry ?? { cacheHit: 0, cacheMiss: 0, output: 0 }
    const peak = {
      enabled: ['deepseek-peak', 'utc-peak'].includes(resolved.billingMode) && pricing.peakEnabled === true,
      effectiveAtMs: Date.parse(pricing.peakEffectiveAt),
      windows: pricing.peakWindows,
      holidays: pricing.peakHolidays,
    }
    // 官方价格币种为人民币(issue #47)时,DeepSeek 主表(峰谷计费,含 default
    // 兜底与跨厂商兑底命中)计出的成本为人民币,按展示汇率折算为美元入账;
    // 第三方 flat 恒为美元价,直接入账。
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
    // 归一化各桶 token 数:非有限/负数一律按 0 处理,防止污染账本聚合。
    const num = value => {
      const n = Number(value)
      return Number.isFinite(n) && n > 0 ? n : 0
    }
    const buckets = {
      input: num(tokens?.input),
      output: num(tokens?.output),
      cacheRead: num(tokens?.cacheRead),
      cacheWrite: num(tokens?.cacheWrite),
      reasoning: num(tokens?.reasoning),
    }
    const planId = cls === 'plan' ? (planProviderIdOf(provider, planBilling, modelId)
      ?? (isRoutedThirdPartyCall(provider, modelId, this.config.prices) ? 'go' : null)) : null
    const call = {
      ...(meter ? { meter } : {}),
      date: localDayKey(atMs), sessionId, atMs, recordedAt: Date.now(), planId,
      providerKey: `${typeof provider === 'string' && provider.length > 0 ? provider : 'deepseek'}:${String(modelId ?? 'default')}`,
      values: { ...buckets, calls: 1, cost, apiCost, ...frozenAmounts(cost, apiCost, pricing) },
    }
    if (!applyAccount(this, call)) return false
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · usage如何进入账本，取消及嵌套流如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口通过全局llm/stream监听器创建计费流，读取下游usage块但继续透传所有chunk。结束或异常退出进入finally，若已捕获usage且bridge未覆盖才调用account；消费方提前结束时显式调用下游iterator.return，避免继续消耗却无人读取。没有usage时这里不凭空估算已用量，所以缺失记录不能被读成真实零支出。

AsyncLocalStorage给当前消费链标记，防止单条包装路由对同一上游流重复计费；另有指纹窗口处理急切分发的包装转发对。账本将五桶计数与当时价格形成call并加入pendingAccounts，写入worker负责序列化并设置超时。源码体现了并发和退出处理，但本轮未运行持久化恢复，不能将存在worker与锁等同任何崩溃时都不丢账。

#### 证据与依据

**依据 1 · 源码核查**：[lib/billing-stream.js:40-94](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/billing-stream.js#L40-L94)

usage捕获、透传、取消return与finally记账。

<details>
<summary>查看原文（55行）</summary>

```text
export function createLlmStreamBilling({ account, now = Date.now, bridge, activity }) {
  return (options, next) => {
    const downstream = next()
    // 嵌套内层(包装路由在上层计费流的消费上下文中再发起的 llm/stream):
    // 外层已记账,透传下游流,不再包裹。
    if (llmStreamDepth.getStore() !== undefined) return downstream
    // 峰谷档位按「请求发起」时刻判定:一次流式调用可能跨峰谷边界整点,
    // 按完成时刻归档会把数分钟前发起的请求算进另一个峰位(官方口径为
    // 请求侧计时;实测跨点分歧可达分毛级)。瀑布分发即请求发起时刻。
    const startedAtMs = now()
    const proxy = bridge?.createScope(options, startedAtMs)
    return (async function* costMeterStream() {
      let usage = null
      const release = activity?.enter(options?.sessionId)
      let iterator
      let completed = false
      try {
        iterator = downstream[Symbol.asyncIterator]()
        for (;;) {
          // 在深度标记内拉取下游:下游适配器(modlens 等)体内再发起的
          // ctx.llm.stream() 同步瀑布分发继承 depth=1,其监听器判定为嵌套。
          const result = await llmStreamDepth.run(1, () => proxy ? proxy.run(() => iterator.next()) : iterator.next())
          if (result.done) break
          const chunk = result.value
          if (chunk !== null && chunk !== undefined && chunk.type === 'usage' && chunk.usage != null) {
            usage = chunk.usage
            proxy?.observe(usage)
          }
          yield chunk
        }
        completed = true
      } catch (error) {
        // Names only: messages, headers and request contents may contain secrets.
        const name = /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(error?.name) ? error.name : 'Error'
        console.warn(`[dsh-cost-meter] stream interrupted (${name}); context measurement deferred during generation`)
        throw error
      } finally {
        // 手写 for(;;) 不具备 for-await 的自动关闭语义:消费方提前中断(break/
        // return/throw)时必须显式向下游传播 return(),否则上游 HTTP 流会继续
        // 跑完(供应商照常计满 token,usage 块却无人读取),socket 悬挂泄漏。
        if (!completed) {
          try {
            await iterator?.return?.()
          } catch {}
        }
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
            console.warn(`[dsh-cost-meter] 计费失败: ${String(error)}`)
          }
        }
      }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3830-3847](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/index.js#L3830-L3847)

五桶及去重后实际调用ledger.account。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.on('llm/stream', createLlmStreamBilling({
    activity: contextActivity(ctx),
    bridge: billionContext,
    account: (usage, model, sessionId, atMs, provider) => {
      const buckets = {
        input: usage.inputTokens ?? 0,
        output: usage.outputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        reasoning: usage.reasoningTokens ?? 0,
      }
      // 非字符串 provider(个别路由 header 配置异常,日志渲染为 [object Object])
      // 在去重器内归一为空串,由账本按缺省渠道处理,避免脏键。
      const effective = usageDeduper.admit(sessionId, model, provider, buckets, atMs)
      if (effective === null) return
      ledger.account(buckets, model, sessionId, atMs, effective)
    },
  }), { global: true })
```

</details>

**依据 3 · 源码核查**：[lib/store.js:2421-2428](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/store.js#L2421-L2428)

call记录与pendingAccounts接线。

```text
    const call = {
      ...(meter ? { meter } : {}),
      date: localDayKey(atMs), sessionId, atMs, recordedAt: Date.now(), planId,
      providerKey: `${typeof provider === 'string' && provider.length > 0 ? provider : 'deepseek'}:${String(modelId ?? 'default')}`,
      values: { ...buckets, calls: 1, cost, apiCost, ...frozenAmounts(cost, apiCost, pricing) },
    }
    if (!applyAccount(this, call)) return false
    this.pendingAccounts.push(call)
```

**依据 4 · 源码核查**：[lib/ledger-writer.js:7-38](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/ledger-writer.js#L7-L38)

worker写入、超时终止和唯一锁owner清理。

<details>
<summary>查看原文（32行）</summary>

```text
export function startLedgerWrite(payload, receive, { timeoutMs = 15000, workerUrl = new URL('./ledger-writer-worker.js', import.meta.url) } = {}) {
  const { port1, port2 } = new MessageChannel()
  const signal = new Int32Array(new SharedArrayBuffer(4))
  let finished = false, resolve, timeoutError, workerError
  const lockId = randomUUID()
  const promise = new Promise(done => { resolve = done })
  const worker = new Worker(workerUrl, {
    workerData: { ...payload, signal, port: port2, lockId }, transferList: [port2], execArgv: [],
  })
  const finish = message => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    try { receive(message) }
    finally { port1.close(); void worker.terminate(); resolve() }
  }
  // A stalled worker must settle so disposal cannot hold the reload queue.
  // Terminate it before reporting failure; the caller can then safely retry.
  const timer = setTimeout(() => {
    timeoutError = { error: { message: 'Ledger worker timed out', code: 'ETIMEDOUT' } }
    void worker.terminate().then(() => finish(timeoutError))
  }, timeoutMs)
  timer.unref?.()
  port1.on('message', finish)
  worker.on('error', error => { workerError = { error: { message: error.message, code: error.code } } })
  worker.on('exit', code => {
    if (finished) return
    // A terminated thread shares our PID, so ordinary dead-process recovery
    // cannot release its lock. Remove only this worker's unique owner, after exit.
    try { unlinkSync(join(`${payload.path}.lock`, `${process.pid}-${lockId}`)); rmdirSync(`${payload.path}.lock`) } catch {}
    finish(receiveMessageOnPort(port1)?.message ?? timeoutError ?? workerError ?? { error: { message: `Ledger worker exited (${code})` } })
  })
```

</details>

#### 缺口

- 异常中止后无usage或落盘前退出的实际账本完整性未实测。
  **影响**：不能据本地小额或零金额判断供应商没有收费。
  **进一步探讨**：对正常、取消、失败和进程终止样例逐个对照服务端usage及重启账本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 去重何时可能把合法请求合并，预算是否硬阻断？

**研究主题**：缺陷与关键质疑

#### 完整回答

usage指纹由provider/model和五桶组成，按session保存，包装样本在十秒窗口内与普通或包装样本相同就拒绝入账；普通样本之间不会因此互相合并。所以不同真实包装调用在同会话、同模型、同量且时间接近时可能被误认成重复转发。AsyncLocalStorage的恒定嵌套标记也适用于单次包装上游；若同一消费上下文扇出多个独立流，不能据它保证每条都计入。

另外account在价格未匹配时取0成本，同时保留tokens，金额0可能只是价格未知，不是免费。README的预算功能描述为进度和警告；本次检查的计费监听只是透传并在结束后记录，没有在该链实施调用前硬额度阻断。因此用户不能用预算显示承诺绝不超支。其他模块是否另有策略未全面审计，结论仅针对所查观察计费路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage-dedup.js:33-42](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/usage-dedup.js#L33-L42)

指纹没有服务端调用ID。

<details>
<summary>查看原文（10行）</summary>

```text
export function usageFingerprint(model, buckets, provider) {
  return JSON.stringify([
    String(provider ?? '').trim().toLowerCase().replace(/^llm-/, ''),
    String(model ?? ''),
    buckets?.input ?? 0,
    buckets?.output ?? 0,
    buckets?.cacheRead ?? 0,
    buckets?.cacheWrite ?? 0,
    buckets?.reasoning ?? 0,
  ])
```

</details>

**依据 2 · 源码核查**：[lib/usage-dedup.js:92-113](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/usage-dedup.js#L92-L113)

按session及包装身份判重的实际条件。

<details>
<summary>查看原文（22行）</summary>

```text
    admit(sessionId, model, provider, buckets, atMs) {
      const prov = typeof provider === 'string' ? provider : ''
      const wrapped = isWrapperProviderId(prov)
      const effective = wrapped ? (wrapperUpstreamProvider(prov) ?? prov) : prov
      const key = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : ''
      const t = Number.isFinite(atMs) && atMs > 0 ? atMs : now()
      const clock = now()
      const fp = usageFingerprint(model, buckets, effective)
      let entry = sessions.get(key)
      if (entry === undefined) {
        entry = { plain: new Map(), remapped: new Map() }
        sessions.set(key, entry)
      }
      sweep(entry.plain, clock)
      sweep(entry.remapped, clock)
      const book = wrapped ? entry.remapped : entry.plain
      // 包装样本与普通样本、改挂样本都互斥;普通样本只与改挂样本互斥。
      const matches = source => source.get(fp)?.some(row => Math.abs(t - row.at) <= windowMs) === true
      if (wrapped ? (matches(entry.plain) || matches(entry.remapped)) : matches(entry.remapped)) {
        return null
      }
      book.set(fp, [...(book.get(fp) ?? []), { at: t, seen: clock }].slice(-maxEntries))
```

</details>

**依据 3 · 源码核查**：[lib/billing-stream.js:23-27](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/billing-stream.js#L23-L27)

恒定标记对扇出路由的设计边界。

```text
 * 设计边界(R-7):恒定深度标记会把「外层 pull 的异步上下文内同步分发瀑布时」
 * 发起的任何 ctx.llm.stream() 一律判定为已记账的嵌套调用。单层包装链
 * (issue #48 目标:适配器在自己 stream() 体内恰好发起一次上游调用)语义正确;
 * 若未来出现扇出型路由——单次 pull 内派生 >1 条上游流——第二条及之后的上游
 * 将被误判为嵌套而漏记。出现此类路由时需改用按流实例区分的标记身份。
```

**依据 4 · 源码核查**：[lib/store.js:2384-2406](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/store.js#L2384-L2406)

未匹配价格成本为0，Plan现金分开。

<details>
<summary>查看原文（23行）</summary>

```text
    const pricing = pricingConfigAt(this.config, atMs, sessionId, `${provider || 'deepseek'}:${modelId}`)
    const resolved = providerPriceEntryFor(provider, modelId, pricing.prices, {
      mode: pricing.priceMatch === 'exact' ? 'exact' : 'auto',
      overrides: pricing.priceOverrides,
    })
    const entry = resolved.entry ?? { cacheHit: 0, cacheMiss: 0, output: 0 }
    const peak = {
      enabled: ['deepseek-peak', 'utc-peak'].includes(resolved.billingMode) && pricing.peakEnabled === true,
      effectiveAtMs: Date.parse(pricing.peakEffectiveAt),
      windows: pricing.peakWindows,
      holidays: pricing.peakHolidays,
    }
    // 官方价格币种为人民币(issue #47)时,DeepSeek 主表(峰谷计费,含 default
    // 兜底与跨厂商兑底命中)计出的成本为人民币,按展示汇率折算为美元入账;
    // 第三方 flat 恒为美元价,直接入账。
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
```

</details>

**依据 5 · 源码核查**：[README.md:75-76](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/README.md#L75-L76)

预算被描述为进度与警告。

```text
| Today's cost | Sidebar bottom (above the settings button) | “Today ¥x”, hover for call count and token details |
| Budget box | Sidebar bottom (between the balance row and the settings button) | Rounded-square frame: budget, used %, progress bar, today's cost & share of budget, used/limit; ≥80% warning, ≥100% over-budget |
```

#### 缺口

- 目标路由实际是否生成同量独立包装调用，以及供应商调用ID可用性。
  **影响**：高并发多worker研究不能直接把此账本当完整总量。
  **进一步探讨**：在匹配宿主中制造两个独立同量调用与一对重复转发，按服务端ID对账并检查漏记。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与恢复成本是什么，哪些人能有限试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要匹配DSH客户端和模型流事件、可写账本目录、正确价格和Plan/API分类；外部余额或额度查询另需对应凭据和网络服务。本轮只检查本地计费主链，不声称支持列表里的全部供应商已可用。初次需要核对已知调用、取消调用和价格未知状态，持续需要维护价格、汇率与分类，失败后需要账本与供应商记录双向复核。

建议多会话、多模型的个人DSH用户有限试用，先用几笔可核对的调用检查token、现金和Plan等值分开，再扩大到日常观察。相比手工抄余额，它增加按会话归因，但没有合格任务质量和账单对照，就不能证明省钱。若包装调用漏记、未知价格显示零却没有被识别，或账本锁阻止加载，应停止依赖金额做决策，保留账本备份并回供应商账单及原生日志。不要把预算指示作为消费硬上限。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-42](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/package.json#L25-L42)

DSH版本范围与Web入口声明。

<details>
<summary>查看原文（18行）</summary>

```text
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "compatibility": {
      "dsh": ">=0.2.0-rc.1 <0.3.0-0",
      "dshReleases": {
        "0.2.0-rc.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-alpha.5": "compatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible"
      }
    }
  },
  "dshhub": {
```

</details>

**依据 2 · 源码核查**：[lib/store.js:2381-2427](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/store.js#L2381-L2427)

计价与分类依赖。

<details>
<summary>查看原文（47行）</summary>

```text
  account(tokens, modelId, sessionId, atMs, provider, meter, requestFee) {
    if (this.closed) return
    if (requestFee !== undefined && (!validRequestFee(requestFee, atMs) || provider !== 'deepseek-official' || !matchesRequestFeeModel(modelId, requestFee))) throw new Error('Invalid official web request fee')
    const pricing = pricingConfigAt(this.config, atMs, sessionId, `${provider || 'deepseek'}:${modelId}`)
    const resolved = providerPriceEntryFor(provider, modelId, pricing.prices, {
      mode: pricing.priceMatch === 'exact' ? 'exact' : 'auto',
      overrides: pricing.priceOverrides,
    })
    const entry = resolved.entry ?? { cacheHit: 0, cacheMiss: 0, output: 0 }
    const peak = {
      enabled: ['deepseek-peak', 'utc-peak'].includes(resolved.billingMode) && pricing.peakEnabled === true,
      effectiveAtMs: Date.parse(pricing.peakEffectiveAt),
      windows: pricing.peakWindows,
      holidays: pricing.peakHolidays,
    }
    // 官方价格币种为人民币(issue #47)时,DeepSeek 主表(峰谷计费,含 default
    // 兜底与跨厂商兑底命中)计出的成本为人民币,按展示汇率折算为美元入账;
    // 第三方 flat 恒为美元价,直接入账。
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
    // 归一化各桶 token 数:非有限/负数一律按 0 处理,防止污染账本聚合。
    const num = value => {
      const n = Number(value)
      return Number.isFinite(n) && n > 0 ? n : 0
    }
    const buckets = {
      input: num(tokens?.input),
      output: num(tokens?.output),
      cacheRead: num(tokens?.cacheRead),
      cacheWrite: num(tokens?.cacheWrite),
      reasoning: num(tokens?.reasoning),
    }
    const planId = cls === 'plan' ? (planProviderIdOf(provider, planBilling, modelId)
      ?? (isRoutedThirdPartyCall(provider, modelId, this.config.prices) ? 'go' : null)) : null
    const call = {
      ...(meter ? { meter } : {}),
      date: localDayKey(atMs), sessionId, atMs, recordedAt: Date.now(), planId,
      providerKey: `${typeof provider === 'string' && provider.length > 0 ? provider : 'deepseek'}:${String(modelId ?? 'default')}`,
      values: { ...buckets, calls: 1, cost, apiCost, ...frozenAmounts(cost, apiCost, pricing) },
    }
    if (!applyAccount(this, call)) return false
```

</details>

**依据 3 · 源码核查**：[lib/ledger-writer.js:23-38](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/ledger-writer.js#L23-L38)

超时worker及锁处理影响恢复。

<details>
<summary>查看原文（16行）</summary>

```text
  // A stalled worker must settle so disposal cannot hold the reload queue.
  // Terminate it before reporting failure; the caller can then safely retry.
  const timer = setTimeout(() => {
    timeoutError = { error: { message: 'Ledger worker timed out', code: 'ETIMEDOUT' } }
    void worker.terminate().then(() => finish(timeoutError))
  }, timeoutMs)
  timer.unref?.()
  port1.on('message', finish)
  worker.on('error', error => { workerError = { error: { message: error.message, code: error.code } } })
  worker.on('exit', code => {
    if (finished) return
    // A terminated thread shares our PID, so ordinary dead-process recovery
    // cannot release its lock. Remove only this worker's unique owner, after exit.
    try { unlinkSync(join(`${payload.path}.lock`, `${process.pid}-${lockId}`)); rmdirSync(`${payload.path}.lock`) } catch {}
    finish(receiveMessageOnPort(port1)?.message ?? timeoutError ?? workerError ?? { error: { message: `Ledger worker exited (${code})` } })
  })
```

</details>

#### 缺口

- 未实测当前DSH加载、账本恢复或全部额度供应商。
  **影响**：只能形成受限试用建议，不支持持续安装和账单准确性保证。
  **进一步探讨**：选实际一个provider和一个Plan分类完成正常、取消和未知价格验收，再比对供应商记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用调用身份替代token指纹，作为多worker研究计量？

**研究主题**：新假设与验证

#### 完整回答

可以推导未验证的任务计量收据，优先使用服务端request_id、父任务ID、worker实例和尝试号做身份，usage只是计量值而非去重身份。对子调用和包装转发显式记录父子关系，缺失usage或未知价格保存unknown状态；按通过验收的报告聚合全部父端、worker、失败与补查成本。相对同量指纹，增量是可区别两个等量的真实调用，并解释主端下降是否只是转移到worker。

最小对照用正常独立调用、同量并发、重复转发、取消缺usage和重试五类记录，比当前指纹计量与调用ID收据的漏计、重复计数及人工对账时间。必须确认供应商ID在每层可传递；若SDK不暴露稳定ID、边界映射成本超过收益，或无法把缺失准确标明，则不宣称总成本完整。没有运行数据，不能预告省多少token。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage-dedup.js:33-42](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/usage-dedup.js#L33-L42)

现有身份由用量值构造，支持考虑调用身份。

<details>
<summary>查看原文（10行）</summary>

```text
export function usageFingerprint(model, buckets, provider) {
  return JSON.stringify([
    String(provider ?? '').trim().toLowerCase().replace(/^llm-/, ''),
    String(model ?? ''),
    buckets?.input ?? 0,
    buckets?.output ?? 0,
    buckets?.cacheRead ?? 0,
    buckets?.cacheWrite ?? 0,
    buckets?.reasoning ?? 0,
  ])
```

</details>

**依据 2 · 源码核查**：[lib/billing-stream.js:86-93](https://github.com/Han-1413141/dsh-cost-meter/blob/aa41d946c475b9e37ee11362e0e130df816d52b0/lib/billing-stream.js#L86-L93)

缺usage不记账，需显式表示未知。

```text
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
            console.warn(`[dsh-cost-meter] 计费失败: ${String(error)}`)
          }
        }
```

#### 缺口

- 各worker供应商是否返回稳定可传递调用ID及完整usage。
  **影响**：新收据也可能产生无法归因的空洞。
  **进一步探讨**：先对一个实际模型链确认ID、usage与账单完整，再扩到多worker。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
