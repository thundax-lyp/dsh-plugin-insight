# dsh-cost-meter

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c876735](https://github.com/Han-1413141/dsh-cost-meter/tree/c876735d80760fc89d88fa99c19c90c56e984c23)

<!-- BEGIN META -->
[![GitHub ★ 678](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=678&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 155,790](https://img.shields.io/static/v1?label=npm+30d&message=155%2C790&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)
<!-- END META -->

> **功能**：在 DSH 会话查看模型用量、估计费用、历史记录和订阅额度。

> **亮点**：[Q01](#research-q01) 将宿主流的用量与会话、渠道和请求时段关联，提供可解释的本地归因。[Q02](#research-q02) 把包装模型 ID 的渠道前缀转为计价线索，并保留显式覆盖。[Q03](#research-q03) 的账本回执使丢失工作线程回报时可重读提交状态。

> **主要限制**：[Q01](#research-q01) 的断流可能缺量，普通指纹也可能混同等量包装请求。[Q02](#research-q02) 的参考等价成本随定价设置变化。[Q04](#research-q04) 的余额与授权会访问外部服务及写入凭据，需和本地账本分开核查。 [Q06](#research-q06) 的自动桥还会改动匹配子进程的启动与加载，退出需另核既有代理。

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
  - [Q01 · 账本能按会话归因到哪些调用，何时会漏记或重复？](#detail-section-11)
  - [Q02 · Magpie 路由计价、订阅额度和本地节省能否合为真实消费？](#detail-section-12)
  - [Q03 · 账本工作线程和会话读缓存怎样处理失联、重试和关闭？](#detail-section-13)
  - [Q04 · 官方余额、设备授权和自定义余额会读写哪些外部状态？](#detail-section-14)
  - [Q05 · 如何以可逆的小范围对账决定继续试用？](#detail-section-15)
  - [Q06 · 自动接入 Billion Context 会改变哪些进程和源码状态？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在多模型会话中开发并需要任务级对账的用户，可以查看本地用量估计，再把账单差额定位到会话、模型渠道或价格规则。

供应商账单提供结算，宿主事件日志提供会话来源。原办法是人工联结两者，插件添加本地归因及查价，仍需账单核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 流用量归因 | 关联调用和会话 | 依赖实际捕获的 usage 和渠道价格 |
| 账本及历史 | 查同一会话用量并对账 | 需核对写入及历史版本 |
| 额度与余额 | 查看特定账号的可用额度 | 需单独验证凭据、端点和权限 |
| 本地参考估计 | 按选定参考单价折算 | 表示 API 等价成本，不计本地资源 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明范围内的 DSH Host 和 Web | 是 | 挂接流、投影及界面 | 范围外效果未知 |
| 真实 usage、价表和币种 | 本地计价需要 | 按任务归因估价 | 缺量和无价需要单列 |
| 供应商账单 | 对账需要 | 作为结算基准 | 只可观察本地值 |
| 可信凭据与端点 | 可选额度功能需要 | 读取余额及设备授权 | 试用先关闭 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 固定基准 | 用户 | 记录渠道、时间、币种和价表并备份 | 条件不全则先保留账单 |
| 对照小调用集 | 用户及插件 | 匹配五桶、模型 ID 和会话费用 | 遇漏记或错价停止依据金额 |
| 重启核对 | 用户 | 重启后读回账本及会话投影 | 保存证据后使用原日志 |
| 退出 | 用户 | 禁用并保留账单与必要历史 | 若启用授权，核对测试凭据清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 少量对照调用和存储 | 固定价格、币种和渠道 | 资源和分钟均未测 |
| 持续 | 工作线程、账本和可选网络 | 核对变化和异常差额 | 真实节约未测 |
| 失败恢复 | 备份、日志及再次查询 | 区分持久化和供应商差额 | 关闭竞争未实测 |
| 退出 | 保留必要账单及历史 | 禁用和清理可选凭据 | 具体退出成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本地归因 | 会话、渠道、实际捕获的用量 | 真实收费调用覆盖 |
| 定价 | 固定路由匹配及参考折算 | 实际支付与净节约 |
| 持久化 | 工作线程事务和收据检查 | 故障下完整性 |
| 额度和余额 | 独立来源、缓存失效与失败状态 | 真实端点及凭据权限 |

> **思考**：[Q01](#research-q01) 的断流可能缺量，普通指纹也可能混同等量包装请求。[Q02](#research-q02) 的参考等价成本随定价设置变化。[Q04](#research-q04) 的余额与授权会访问外部服务及写入凭据，需和本地账本分开核查。 [Q06](#research-q06) 的自动桥还会改动匹配子进程的启动与加载，退出需另核既有代理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将宿主流的用量与会话、渠道和请求时段关联，提供可解释的本地归因。[Q02](#research-q02) 把包装模型 ID 的渠道前缀转为计价线索，并保留显式覆盖。[Q03](#research-q03) 的账本回执使丢失工作线程回报时可重读提交状态。

[Q01](#research-q01) 的取消传播、[Q03](#research-q03) 的收据回读与可取消读取隔离分别针对三类故障。[Q04](#research-q04) 的凭据引用变化清除余额基准，避免把多个钱包差值当消费。 [Q06](#research-q06) 区分只改内存源码的 loader 与宿主启动观察器的释放。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 的断流可能缺量，普通指纹也可能混同等量包装请求。[Q02](#research-q02) 的参考等价成本随定价设置变化。[Q04](#research-q04) 的余额与授权会访问外部服务及写入凭据，需和本地账本分开核查。 [Q06](#research-q06) 的自动桥还会改动匹配子进程的启动与加载，退出需另核既有代理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 固定模型和价表，用小批调用查本地、重启回读及供应商账单。先关闭不需要的余额和授权，出现 [Q01](#research-q01) 的缺量或 [Q03](#research-q03) 的持久性异常就停止采用金额。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地用量归因、估价和余额查询的各自机制。真正结算的覆盖和差额需同集对账，可信调用 ID 是待验证设计。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、cordis.patch.yml、lib/backfill.js、lib/billing-stream.js、lib/billion-context-auto.js、lib/billion-context-history.js、lib/billion-context-loader.js、lib/billion-context-preload.js、lib/custom-balance.js、lib/gateway-quota-adapters.js、lib/index.js、lib/local-savings.js、lib/pricing.js、lib/store.js、lib/turn-cost.js、lib/usage-dedup.js、package.json、scripts/build.mjs、src/bootstrap.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定根包流和宿主入口、价格路由、账本及历史重算与清空、自动代理桥、余额凭据和代表性设备码授权。未穷尽全部供应商、桥覆盖或宿主凭据服务。
- 下一步：在隔离环境以已知输入核对账单差额，模拟线程回报丢失和流中断；可选外部能力先用模拟凭据端点再另行验证真实授权。

**分析版本**

- **仓库**：[Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter)
- **版本号**：1.9.64（[固定提交 c876735](https://github.com/Han-1413141/dsh-cost-meter/tree/c876735d80760fc89d88fa99c19c90c56e984c23)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q01](#research-q01) 提出让宿主传递可信调用 ID 和包装父关系，并明确区分缺用量及无价状态。用等量独立调用、包装和断流样本比较漏重和排查成本。

在隔离环境以已知输入核对账单差额，模拟线程回报丢失和流中断；可选外部能力先用模拟凭据端点再另行验证真实授权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 344 | 16283 | — | — | 378940 |
| .js | source | 153 | 42442 | 36482 | 5416 | — |
| .mjs | source | 11 | 904 | 740 | 148 | — |
| .mjs | test | 254 | 42120 | 38754 | 2491 | — |
| .mjs | example | 6 | 263 | 230 | 28 | — |
| .md | example | 1 | 21 | — | — | 175 |
| .js | example | 1 | 3 | 3 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 107](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=107&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)

暂未获取：近30天新建。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在多模型 DSH 会话中，何时可以用插件解释用量和账单差异，如何辨别归因、价格、凭据及持久化的缺口？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账本能按会话归因到哪些调用，何时会漏记或重复？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑、新假设与验证

#### 完整回答

在多模型和多会话中开发的 DSH 用户，可以用账本定位一次具体任务里的用量。供应商账单给出真正结算，通常缺少 DSH 会话标识，手动拼接日志才能按任务追溯。插件在宿主 LLM 流捕获最后一个 usage 块，传入发起时刻、会话、模型与供应商，因而能解释一次本地归因和请求时段。消费中断时尝试向下游传播 return，仍只有实际读取到 usage 才可能写账。没有用量块的远端收费不会从本地结果自动补全。

同步嵌套在深度标记下透传，另外的十秒五桶指纹用于处理包装层重复。指纹相同只说明供应商、模型和数量匹配。遇到包装与原始观测数量相同而实际属于不同请求时，存在误去重风险。Billion Context 专链用 streamId 与 sourceSeqs 关联替换已报告用量，覆盖特定来源，普通流仍没有同等来源标识。一个待验证方案是让宿主在普通流透传可信 attempt ID 和包装父关系，分别标记未收到 usage 与有量但无价。对照现有窗口去重，测同量独立请求、转发和中断样本的漏重及额外成本，若追踪 ID 不稳定或误差不减就保留原有方式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4055-4078](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L4055-L4078)

宿主挂接流计费与会话投影。

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

**依据 2 · 源码核查**：[lib/billing-stream.js:40-66](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billing-stream.js#L40-L66)

深度、发起时刻、实际用量块。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/billing-stream.js:76-93](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billing-stream.js#L76-L93)

中断传播、专桥覆盖判断和入账。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/usage-dedup.js:27-42](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/usage-dedup.js#L27-L42)

窗口与五桶指纹。

<details>
<summary>查看原文（16行）</summary>

```text
export const USAGE_DEDUP_WINDOW_MS = 10_000

/**
 * (上游 provider, model, 五桶) 指纹:逐位精确比较。包装转发的双份 usage 实测逐位相同
 * (issue #48 报告「同 token 逐位相同 ×3」),无需模糊。
 */
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

**依据 5 · 源码核查**：[lib/billion-context-history.js:270-293](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-history.js#L270-L293)

专链流身份、来源序列及替换消费。

<details>
<summary>查看原文（24行）</summary>

```text
  for (const stream of streams.values()) {
    const coverage = checkedBillionCoverage(stream, stream.coverage ?? coverageResult(stream, counts.get(stream.streamId) ?? coverageCounts()))
    const host = coverage.mode === 'host' ? billionHostRecord(stream, coverage) : null
    if (host) records.push(host)
    if ((stream.covered || stream.hostSuppressed || coverage.mode === 'host' || coverage.mode === 'unresolved') && validUsage(stream.reported)) records.push({ type: BILLION_REPLACEMENT_EVENT, data: {
      streamId: stream.streamId, sourceSeqs: stream.sourceSeqs ?? [], turn: stream.turn ?? null, step: stream.step ?? null, usage: stream.reported,
      ...(unverifiedBillionHost(coverage) ? { exactUsageOnly: true } : {}),
      provider: stream.provider, model: stream.model } })
  }
  return records
}
export function excludeBillionReportedUsage(records) {
  const replacements = records.filter(row => row.type === BILLION_REPLACEMENT_EVENT).map(row => row.data)
  if (!replacements.length) return records
  return records.filter(row => {
    const usage = row.type === 'assistant/message' || row.type === 'compaction/summary' ? row.data?.usage
      : row.type === 'assistant/chunk' && row.data?.chunk?.type === 'usage' ? row.data.chunk.usage : null
    if (!usage) return true
    return !replacements.some(replacement => (!replacement.exactUsageOnly || usageSignature(usage) === usageSignature(replacement.usage))
      && (replacement.sourceSeqs.includes(row.seq) || (replacement.step != null && replacement.turn != null
      && row.data?.turn === replacement.turn && row.data?.step === replacement.step && (row.type === 'assistant/chunk' || usageSignature(usage) === usageSignature(replacement.usage))
      && (!row.data?.message?.source?.model || row.data.message.source.model === replacement.model))))
  })
}
```

</details>

#### 缺口

- 真实收费流的 usage 覆盖、漏重比例和宿主可用身份未验。
  **影响**：会话金额不能直接替代供应商账单。
  **进一步探讨**：在同一小集标记独立调用、包装层和断流，逐条比对结算与本地归因。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Magpie 路由计价、订阅额度和本地节省能否合为真实消费？

**研究主题**：功能与机制、效果与总成本、缺陷与关键质疑

#### 完整回答

这些字段服务不同判断。Magpie 路由模型 ID 的首段可用于重定向价格查找，函数避开 exact 模式、已知免费与本地规则、手动覆盖及原渠道精确价格，未知免费路由也有单独保护。解析再进入目标渠道的价格和峰谷处理，减少渠道名前缀导致的无价，但映射仍由已有价格目录和别名决定。连续换模型应核对每条调用原 ID、命中渠道和金额，作者所述回归没有在本轮执行。

订阅额度采样按供应商和窗口计算用量差分，解释本地量与窗口变化，不能折成该次 API 实付。本地节省卡默认未开启，以当前选定参考模型和固定价格档位折算保留账本中匹配前缀的渠道，汇总日、周、月与累计值。按日汇总不能还原单请求长上下文门槛，历史日也用当前参考档位；本地硬件、人工时间、真实替代模型效果没有参与。因此卡片表达参考 API 等价成本，可用来估算替代情景，无法直接作省钱结论。

账本在价格解析返回 priced=false 时仍可保存用量，金额分支取 0；Plan 分类还会将 apiCost 设为 0。显式免费规则则返回 priced=true 的零单价。回合明细保留 priced 并可将有量无价标为 unpriced，因此零额要结合用量、价格状态和计费类别核对。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:3-11](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/CHANGELOG.md#L3-L11)

作者声明价格前缀与连续切换覆盖。

```text
## [1.9.64] - 2026-11-10

- 适配 Magpie 自带接入、dsh-magpie-connect、dsh-magpie-connector 和 @zhiqiangme/dsh-magpie，按模型 ID 中的来源前缀自动匹配价格。
- 切换模型后使用对应单价，保留手动定价、渠道专属价格、免费模型及本地模型规则。
- 同步前后端价格解析，补充实际连接插件目录和连续模型切换回归。

- Match account-prefixed model IDs from Magpie and the dsh-magpie-connect, dsh-magpie-connector and @zhiqiangme/dsh-magpie integrations.
- Select the corresponding price after model switches while preserving manual assignments, source-specific rates, free variants and local-model rules.
- Keep host and client matching consistent and cover published connector catalogs and consecutive model switches.
```

**依据 2 · 源码核查**：[lib/pricing.js:1152-1189](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/pricing.js#L1152-L1189)

路由前缀、显式价格和免费规则的优先级。

<details>
<summary>查看原文（38行）</summary>

```text
function magpiePriceTarget(provider, modelId, prices, mode, overrides) {
  const override = overrides?.[(provider || 'deepseek') + ':' + modelId]
  if (!provider || mode === 'exact' || typeof modelId !== 'string'
    || isLocalOriginProviderOrModel(provider, modelId) || ['our-free-model', 'our-free-model-region'].includes(provider)
    || typeof override === 'string' && override.length > 0
    || Object.hasOwn(prices?.providers?.[provider]?.models ?? {}, modelId)) return null
  const separator = modelId.indexOf('/')
  if (separator <= 0 || separator === modelId.length - 1) return null
  const route = modelId.slice(0, separator).toLowerCase()
  const model = modelId.slice(separator + 1)
  const aliases = { codex: 'openai', claude: 'anthropic', gemini: 'google', 'ollama-cloud': 'ollama-cloud', volcengine: 'volcengine', ark: 'ark' }
  const magpie = /^(?:dsh-)?magpie(?:$|-)/.test(provider)
  const knownRoute = Object.hasOwn(aliases, route) || SCOPED_PRICE_PROVIDERS.has(route)
    || ['workbuddy', 'workbuddy-ai', 'qoder', 'qoder-cn', 'trae-cn', 'trae-global', 'zcode', 'mimo-app', 'commandcode-plan', 'cline', 'copilot', 'vercel'].includes(route)
  if (!magpie && (!knownRoute || Object.hasOwn(MODEL_VENDOR_PREFIXES, provider) || SCOPED_PRICE_PROVIDERS.has(provider))) return null
  // An unknown free-only route must not inherit a paid reference price.
  if (/(?:^|-)free$/.test(route) && !Object.hasOwn(prices?.providers ?? {}, route)) return null
  const upstream = aliases[route] ?? route
  if (upstream === 'deepseek' && priceModelHit(model, prices?.models ?? {}, 'deepseek', 'auto', prices) === null) return null
  return {
    provider: Object.hasOwn(aliases, route) || SCOPED_PRICE_PROVIDERS.has(upstream)
      || Object.hasOwn(MODEL_VENDOR_PREFIXES, upstream) || Object.hasOwn(prices?.providers ?? {}, upstream)
      || isLocalOriginProviderOrModel(upstream, model) ? upstream : provider,
    model,
  }
}

export function providerPriceEntryFor(provider, modelId, prices, options) {
  const rawProvider = typeof provider === 'string' ? provider.trim().toLowerCase() : ''
  let normalized = rawProvider.startsWith('llm-') ? rawProvider.slice(4) : rawProvider
  const route = magpiePriceTarget(normalized, modelId, prices, options?.mode, options?.overrides)
  if (route) {
    normalized = route.provider
    modelId = route.model
    options = { ...options, overrides: {} }
  }
  if (['our-free-model', 'our-free-model-region'].includes(normalized) && options?.overrides?.[normalized + ':*'] === '__free__') return { entry: { cacheHit: 0, cacheMiss: 0, cacheWrite: 0, output: 0, reasoning: 0 }, currency: 'USD', priced: true, billingMode: 'flat' }
  const result = withProviderPeakSchedule(resolveProviderPriceEntry(normalized, modelId, prices, options), normalized, prices)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1851-1858](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L1851-L1858)

按供应商与窗口记录额度采样。

```text
  // 额度刷新成功后的百分比采样(issue #64):每 provider×window 记录
  // {t,p,lt,lc,r,s},相邻样本差分推算每 1% 与满窗用量;本地累计按各窗口周期起点聚合。
  const recordQuotaSamples = (providerId, windows) => {
    const now = Date.now()
    const enabled = enabledPlanSetOf(ledger.config)
    ledger.planSamples = recordSamples(ledger.planSamples, providerId, windows, {
      forWindow: (wk, win) => aggregateUsageSince(
        ledger.days ?? {},
```

**依据 4 · 源码核查**：[lib/local-savings.js:45-62](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/local-savings.js#L45-L62)

可选折算与当前固定档位。

<details>
<summary>查看原文（18行）</summary>

```text
export function buildLocalSavings(days, config, now = Date.now()) {
  if (config?.localSavings?.enabled !== true) return undefined
  const settings = normalizeLocalSavings(config.localSavings)
  const prefix = providerId(settings.providerPrefix)
  const today = new Date(now), todayKey = dayKey(today), monthKey = todayKey.slice(0, 7)
  const monday = new Date(now)
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7)
  const weekStart = dayKey(monday)
  const table = config.prices?.models
  const entry = object(table) && Object.hasOwn(table, settings.referenceModel) ? normalizePrice(table[settings.referenceModel]) : null
  const current = entry && entry.unpriced !== true ? priceAt(entry, now) : null
  const priceTier = current && settings.priceTier !== 'base' && !current[settings.priceTier] ? 'base' : settings.priceTier
  const selected = current ? multipliedTier(priceTier === 'base' ? current : current[priceTier], current, priceTier) : null
  // Daily totals cannot recover per-request long-context thresholds. Use only the fixed tier's unit rates.
  const rates = selected ? Object.fromEntries(['cacheHit', 'cacheMiss', 'cacheWrite', 'output', 'reasoning']
    .filter(key => selected[key] !== undefined).map(key => [key, selected[key]])) : null
  const exchangeRate = fxRatesOf(config).CNY
  const result = {
```

</details>

**依据 5 · 源码核查**：[lib/local-savings.js:71-92](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/local-savings.js#L71-L92)

渠道前缀和分日期金额汇总。

<details>
<summary>查看原文（22行）</summary>

```text
  const models = new Map()
  for (const [date, day] of Object.entries(object(days) ? days : {})) {
    if (date > todayKey || !validDay(date)) continue
    if (!result.retainedFrom || date < result.retainedFrom) result.retainedFrom = date
    if (!object(day?.byProviderModel)) continue
    for (const [key, bucket] of Object.entries(day.byProviderModel)) {
      const separator = key.indexOf(':')
      if (separator < 1 || !object(bucket) || !providerId(key.slice(0, separator)).startsWith(prefix)) continue
      const tokens = tokenFields.reduce((sum, field) => sum + amount(bucket[field]), 0)
      const cost = rates ? usdFromCost(costOf(bucket, rates), config.prices?.currency, exchangeRate) : 0
      result.total += cost
      if (date === todayKey) result.today += cost
      if (date >= weekStart) result.week += cost
      if (date.startsWith(monthKey)) result.month += cost
      const model = models.get(key) ?? { key, tokens: 0, cost: 0 }
      model.tokens += tokens
      model.cost += cost
      models.set(key, model)
    }
  }
  result.matchedModels = models.size
  result.models = [...models.values()].sort((a, b) => b.cost - a.cost || a.key.localeCompare(b.key)).slice(0, 100)
```

</details>

**依据 6 · 源码核查**：[lib/store.js:2431-2452](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2431-L2452)

有量无价的金额分支取零，Plan 类也有独立零 API 金额。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[lib/pricing.js:1179-1189](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/pricing.js#L1179-L1189)

显式免费给出零单价并返回 priced=true。

<details>
<summary>查看原文（11行）</summary>

```text
export function providerPriceEntryFor(provider, modelId, prices, options) {
  const rawProvider = typeof provider === 'string' ? provider.trim().toLowerCase() : ''
  let normalized = rawProvider.startsWith('llm-') ? rawProvider.slice(4) : rawProvider
  const route = magpiePriceTarget(normalized, modelId, prices, options?.mode, options?.overrides)
  if (route) {
    normalized = route.provider
    modelId = route.model
    options = { ...options, overrides: {} }
  }
  if (['our-free-model', 'our-free-model-region'].includes(normalized) && options?.overrides?.[normalized + ':*'] === '__free__') return { entry: { cacheHit: 0, cacheMiss: 0, cacheWrite: 0, output: 0, reasoning: 0 }, currency: 'USD', priced: true, billingMode: 'flat' }
  const result = withProviderPeakSchedule(resolveProviderPriceEntry(normalized, modelId, prices, options), normalized, prices)
```

</details>

**依据 8 · 源码核查**：[lib/turn-cost.js:51-73](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/turn-cost.js#L51-L73)

回合明细保留 priced 状态并按状态计算费率。

<details>
<summary>查看原文（23行）</summary>

```text
    let tier = tierFor(sample.resolved.entry, sample.pricedAtMs ?? sample.atMs, sample.peak)
    const longContext = !!tier.longContext && sample.buckets.input + sample.buckets.cacheRead + sample.buckets.cacheWrite > tier.longContext.aboveInputTokens
    if (longContext) tier = tier.longContext
    const call = { sessionId: sample.sessionId ?? '', kind: sample.kind, turn: sample.turn ?? null, step: sample.step ?? null, provider: sample.provider, model: sample.model, atMs: sample.atMs, cost: sample.cost, apiCost: sample.apiCost, plan: sample.plan, priced: sample.resolved.priced, longContext, rows: [] }
    if (sample.webSource) call.webSource = sample.webSource
    if (sample.webSelection) call.webSelection = sample.webSelection
    if (sample.metering) call.metering = sample.metering
    if (sample.requestFee) {
      const { requests, rateCny, kind } = sample.requestFee
      const rate = usdFromCost(rateCny, 'CNY', sample.exchangeRate) * (sample.displayFactor ?? 1)
      const bucket = kind + 'Requests', key = JSON.stringify([sample.provider, sample.model, bucket, rate])
      call.rows.push({ provider: sample.provider, model: sample.model, bucket, tokens: 0, requests, rate, cost: sample.cost, priced: true, plan: false })
      const row = parts.get(key) ?? { ...call.rows[0], requests: 0, cost: 0 }
      row.requests += requests; row.cost += sample.cost; parts.set(key, row)
    }
    for (const [bucket, priceKey] of Object.entries(fields)) {
      const tokens = sample.buckets[bucket]
      if (!tokens) continue
      const rate = sample.resolved.priced ? usdFromCost(tier[priceKey] ?? (bucket === 'cacheWrite' ? tier.cacheHit : 0), sample.resolved.currency, sample.exchangeRate ?? config.exchangeRate) * (sample.displayFactor ?? 1) : 0
      const plan = sample.plan
      call.rows.push({ provider: sample.provider, model: sample.model, bucket, tokens, rate, cost: tokens * rate / 1e6, priced: sample.resolved.priced, plan })
      const key = JSON.stringify([sample.provider, sample.model, bucket, rate, plan, sample.resolved.priced])
      const row = parts.get(key) ?? { provider: sample.provider, model: sample.model, bucket, tokens: 0, rate, cost: 0, priced: sample.resolved.priced, plan }
```

</details>

**依据 9 · 源码核查**：[lib/turn-cost.js:230-243](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/turn-cost.js#L230-L243)

明细聚合将无价标为 unpriced。

<details>
<summary>查看原文（14行）</summary>

```text
  const detail = costFromSamples(selected, ledger.config)
  // Rank against the full filtered history, before transporting a call page.
  // Seven individual calls plus one remainder keep the chart and payload bounded.
  const callShares = detail.calls.map((call, index) => ({ index, cost: call.cost, apiCost: call.apiCost, call,
    tokens: call.rows.reduce((sum, row) => sum + (row.bucket === 'reasoning' ? 0 : row.tokens), 0), calls: 1, other: false,
    unpriced: !call.priced && (query.basis === 'total' || (query.basis === 'plan' ? call.plan : !call.plan)) }))
  const callValue = row => query.basis === 'total' ? row.cost : query.basis === 'plan' ? Math.max(0, row.cost - row.apiCost) : row.apiCost
  callShares.sort((a, b) => callValue(b) - callValue(a) || a.index - b.index)
  if (callShares.length > 7) {
    const rest = { index: -1, cost: 0, apiCost: 0, tokens: 0, calls: 0, other: true, unpriced: false, call: null }
    for (const row of callShares.splice(7)) {
      for (const key of ['cost', 'apiCost', 'tokens', 'calls']) rest[key] += row[key]
      rest.unpriced ||= row.unpriced
    }
```

</details>

#### 缺口

- 未核对任何实时供应商价、渠道实际折扣、币种或订阅收费。
  **影响**：仅能验证固定源码的估计语义。
  **进一步探讨**：以两个测试模型、一个免费分支和一条手动覆盖检查解析，再对照已获授权的账单。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账本工作线程和会话读缓存怎样处理失联、重试和关闭？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

账本同步路径在跨进程锁内读取磁盘基线、合并待写差异并替换文件。后台事务绑定 transactionId；回报失败时先重读文件收据，匹配才接受已提交结果。暂时锁冲突安排再写，其他错误进入同步退路。合并保留事务发起后新增的待写对象，因此 UI 看到本地值、后台收到响应和盘上可回读提交是三种状态。当前路径的收据可以防止已写未回报时简单重放，但不能据此证明盘坏、退出超时或收据不可读后仍无漏重。

读取侧，Billion Context 会话明细按账本路径、会话和文件修订指纹复用无取消信号的读取，显式可取消调用独立执行，过大或失败结果从缓存移出。指纹结合归档文件名、大小和时间，以及流目录状态；不对每个流文件逐字比对。并发切换可减少重复读取的设计有依据，是否能捕获所有就地改写和实际延迟仍需实验。关闭时先等已存在后台任务，再尝试限时提交；显示成功不能替代文件回读。

历史操作仍有三条不同的实际路径。安装前历史导入通过宿主会话源回放，空结果按 RDB 或 JSONL 分别提示。手动重算必须明确确认，先以独占创建方式保存原账本，再从会话源回放；期间清空历史或价格变化会中止。只有账本中已有的完整会话日行才被改价，源记录或计量不一致会保留旧金额。重算保存失败会保留备份并提示。清空只重置账本中的日期、Plan 采样和小时桶、对账基准及待写项，并计划保存重置标记。它不擦除宿主原会话、此前创建的重算备份或外部源。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:2586-2603](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2586-L2603)

同步路径锁与读改写。

<details>
<summary>查看原文（18行）</summary>

```text
  flush(waitMs = 0) {
    if (this.backgroundWrite && !this.backgroundWrite.wait(Math.max(8000, waitMs))) return
    if (!this.pendingWrite || this.closed) return
    try {
      withLedgerLock(this.path, () => {
        advancePricingHistory(this.pricingHistory, this.config)
        const disk = this.readDiskSnapshot()
        const local = this.snapshot()
        const repaired = repairDailySessionTotals(local.days)
        if (repaired.includes(local.balanceRef?.date)) local.balanceRef = null
        const ownDisk = (disk === null || disk === this.writeBase) && !this.pendingPlanHourRepairs.length && !repaired.length
        const merged = ownDisk ? local : mergeLedger(this.writeBase, local, disk, this.pendingAccounts, Date.now(), this.pendingPlanHourRepairs, { ownLocal: true })
        // Keep runtime-only secret fallbacks in memory, never in the file or baseline.
        writeLedger(this.path, merged, this.legacyPricingHistory)
        this.legacyPricingHistory = false
        if (!ownDisk) this.adoptSnapshot(merged)
        // local is already detached; the common path needs no second clone or re-sanitize.
        this.writeBase = ownDisk ? merged : this.snapshot()
```

</details>

**依据 2 · 源码核查**：[lib/store.js:2624-2647](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2624-L2647)

后台事务与失去回报的收据查询。

<details>
<summary>查看原文（24行）</summary>

```text
  /** Background transactions share the same exclusive lock and atomic replacement. */
  flushAsync() {
    if (this.backgroundWrite) return this.backgroundWrite.promise
    if (this.closed || !this.pendingWrite) return Promise.resolve()
    if (this.backgroundWriteDisabled) { this.flush(); return Promise.resolve() }
    advancePricingHistory(this.pricingHistory, this.config)
    const local = this.snapshot(), accounts = this.pendingAccounts, accountCount = accounts.length
    const repairs = this.pendingPlanHourRepairs, repairCount = repairs.length, generation = this.writeGeneration
    const transactionId = randomUUID()
    try {
      this.backgroundWrite = this.startWrite({ path: this.path, base: this.writeBase, local, transactionId, now: Date.now(),
        pending: accounts.slice(), repairs: repairs.slice(), revision: this.diskRevision, backupHistory: this.legacyPricingHistory }, result => {
        this.backgroundWrite = null
        if (result.error) {
          // A worker may commit successfully and exit before its acknowledgement.
          // The receipt is part of the same atomic file, so replay cannot double-charge.
          let committed
          try { committed = this.readDiskSnapshot() } catch {}
          if (cleanWriteReceipts(committed?.writeReceipts).includes(transactionId)) result = { merged: committed, revision: diskRevisionOf(this.path) }
          else {
            // Another host holding the lock is temporary contention, not a broken worker.
            if (result.error.code === 'EBUSY') { if (!this.closed) this.scheduleWrite() }
            else this.fallbackWrite(result.error)
            return
```

</details>

**依据 3 · 源码核查**：[lib/store.js:2650-2666](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2650-L2666)

合并期间新增待写与再次调度。

<details>
<summary>查看原文（17行）</summary>

```text
        const remaining = this.pendingAccounts === accounts ? accounts.slice(accountCount) : this.pendingAccounts
        const remainingRepairs = this.pendingPlanHourRepairs === repairs ? repairs.slice(repairCount) : this.pendingPlanHourRepairs
        if (result.ownDisk) {
          this.writeReceipts = cleanWriteReceipts(result.writeReceipts)
          local.writeReceipts = this.writeReceipts.slice()
          this.writeBase = local
        }
        else {
          const current = mergeLedger(local, this.snapshot(), result.merged, remaining, Date.now(), remainingRepairs, { ownLocal: true })
          this.adoptSnapshot(current)
          this.writeBase = result.merged
        }
        this.pendingAccounts = remaining; this.pendingPlanHourRepairs = remainingRepairs
        this.pendingWrite = generation !== this.writeGeneration || remaining.length > 0 || remainingRepairs.length > 0
        this.legacyPricingHistory = false
        this.diskRevision = result.revision
        if (this.pendingWrite && !this.closed) this.scheduleWrite()
```

</details>

**依据 4 · 源码核查**：[lib/store.js:2673-2690](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2673-L2690)

关闭顺序和等待边界。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  /** 停止后续写入并最终落盘(插件卸载/进程退出)。 */
  close() {
    // Keep the main loop running so worker completion/error events can reach
    // Cordis while it awaits disposal. A synchronous join blocks those events.
    if (this.backgroundWrite) return this.backgroundWrite.promise.then(() => this.close())
    this.flush(5000)              // 退出时保留同步最终提交；日常写入遇锁立即让出并重试。
    this.closed = true
    if (this.writeTimer !== null) { clearTimeout(this.writeTimer); this.writeTimer = null }
  }

  /** 聚合某前缀(如 '2026-08')的全部天。 */
  sumDays(prefix) {
    const total = zeroDay(prefix === undefined ? 'total' : prefix)
    for (const [date, day] of Object.entries(this.days)) {
      if (prefix !== undefined && !date.startsWith(prefix)) continue
      total.input += day.input ?? 0
```

</details>

**依据 5 · 源码核查**：[lib/billion-context-history.js:202-240](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-history.js#L202-L240)

指纹、共享读取、失败与取消隔离。

<details>
<summary>查看原文（39行）</summary>

```text
function billionRecordsFingerprint(ledgerPath, sessionId) {
  const root = billionRoot(ledgerPath), key = billionSessionKey(sessionId)
  const fileRevision = dir => directories(dir).filter(entry => entry.isFile())
    .map(entry => {
      try { const stat = statSync(join(dir, entry.name)); return entry.name + ':' + stat.size + ':' + stat.mtimeMs } catch { return entry.name + ':-' }
    })
    .sort().join(',')
  const calls = fileRevision(join(root, 'calls', key))
  const archives = fileRevision(join(root, 'stream-archives', key))
  const streamDir = join(root, 'streams', key)
  let streams = '-'
  try { const stat = statSync(streamDir); streams = stat.size + ':' + stat.mtimeMs + ':' + directories(streamDir).length } catch {}
  return calls + '|' + streams + '|' + archives
}

/**
 * 会话级记忆化:一次切换会话会并发发起多条回合费用查询,而本函数的结果只取决于
 * 该会话的代理计费文件,与 turn 区间无关,因此并发调用共享同一次读取。
 * 可取消的回填独立读取,避免取消一个调用时中断其他调用,或忽略后来调用的取消信号。
 * 共享读取失败后移除缓存。
 */
export function billionRecordsFor(ledgerPath, sessionId, signal) {
  if (signal) return computeBillionRecordsFor(ledgerPath, sessionId, signal)
  if (!ledgerPath) return Promise.resolve([])
  const memoKey = ledgerPath + '\u0000' + sessionId
  const fingerprint = billionRecordsFingerprint(ledgerPath, sessionId)
  const cached = billionMemo.get(memoKey)
  if (cached && cached.fingerprint === fingerprint) {
    billionMemo.delete(memoKey); billionMemo.set(memoKey, cached)
    return cached.pending
  }
  const entry = { fingerprint, pending: computeBillionRecordsFor(ledgerPath, sessionId) }
  billionMemo.set(memoKey, entry)
  while (billionMemo.size > BILLION_MEMO_LIMIT) billionMemo.delete(billionMemo.keys().next().value)
  entry.pending.then(records => {
    // 明细过大的会话不常驻内存,下次查询直接重算。
    if (records.length > BILLION_MEMO_MAX_RECORDS && billionMemo.get(memoKey) === entry) billionMemo.delete(memoKey)
  }).catch(() => { if (billionMemo.get(memoKey) === entry) billionMemo.delete(memoKey) })
  return entry.pending
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2666-2693](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L2666-L2693)

显式确认、备份、重算及写失败提示。

<details>
<summary>查看原文（28行）</summary>

```text
    async repriceModelHistory(confirmed, model) {
      if (typeof model !== 'string' || !model.length) throw new Error('Select a channel/model to recalculate')
      return service.repriceHistory(confirmed, model)
    },

    async repriceHistory(confirmed, model = '') {
      if (confirmed !== true) throw new Error('Explicit confirmation is required')
      if (typeof model !== 'string' || model.length > 2048 || /[\r\n]/.test(model)
        || (model && (model.indexOf(':') <= 0 || model.endsWith(':')))) throw new Error('Invalid channel/model')
      if (repricing) throw new Error('Historical recalculation is already running')
      repricing = true
      const at = Date.now(), en = localeOf(ledger.config, ctx) === 'en'
      try {
        ledger.refresh()
        if (model && !Object.values(ledger.days).some(day => Object.hasOwn(day.byProviderModel ?? {}, model))) throw new Error(en ? 'This channel/model has no retained history' : '此渠道模型没有保留的历史记录')
        const sessions = model ? new Set(Object.values(ledger.days).flatMap(day => (day.sessions ?? [])
          .filter(row => Object.hasOwn(row.byProviderModel ?? {}, model)).map(row => row.id))) : null
        const backup = `${ledger.path}.before-reprice-${at}.json`
        fs.writeFileSync(backup, JSON.stringify(ledger.snapshot()), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
        const stats = await recomputeLedgerPricingBasis(ledger, join(resolveDshHome(), 'sessions'), undefined, sessions, true, model, sessionSource)
        ledger.pricingHistory.runs[String(at)] = { at, before: stats.before, after: stats.after, days: stats.recostedDays, sessions: stats.recostedSessions, skipped: stats.skippedSessions,
          ...(model ? { model, beforeCny: stats.beforeCny, afterCny: stats.afterCny, beforeEur: stats.beforeEur, afterEur: stats.afterEur } : {}) }
        ledger.scheduleWrite()
        ledger.flush()
        if (ledger.pendingWrite) throw new Error(en ? 'Could not save recalculation; original ledger backup retained.' : '重算结果未能写入，已保留原账本备份。')
        schedulePlanHourRepair()
        return { ok: true, message: en
          ? `${model ? model + ': ' : ''}Recalculated ${stats.recostedSessions} session/day records; kept ${stats.skippedSessions} incomplete records. Original amounts retained.`
```

</details>

**依据 7 · 源码核查**：[lib/backfill.js:1120-1159](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/backfill.js#L1120-L1159)

回放、版本及重置校验和仅处理已有记录。

<details>
<summary>查看原文（40行）</summary>

```text
  const reset = JSON.stringify(ledger.historyReset ?? null)
  const startedAt = Date.now()
  const bySession = new Map()
  for await (const records of sessionBillingRecords(ledger, sessionsRoot, onlySessionIds, sessionSource)) {
    if ((result.scanned += 1) % 8 === 0) await new Promise(resolve => setImmediate(resolve))
    let replayed
    try {
      if (records === null) continue
      replayed = replaySessionRecords(records, pricingConfig, null)
    } catch {
      continue // 单文件损坏(含解压预算超限)不阻断整体重算。
    }
    if (replayed.sessionId.length === 0) continue
    const existing = bySession.get(replayed.sessionId)
    if (existing === undefined) {
      bySession.set(replayed.sessionId, replayed.days)
      continue
    }
    mergeDayMaps(existing, replayed.days)
  }
  const touchedDates = new Set()
  if (explicit) ledger.refresh?.()
  if (explicit && (ledger.closed || JSON.stringify(ledger.historyReset ?? null) !== reset
    || JSON.stringify(pricingSnapshot(ledger.config)) !== originalPricing || pricingHistoryFingerprint(ledger.config) !== originalHistory)) {
    throw new Error('价格或历史记录已在读取期间改变，本次未重算。请重新确认。')
  }
  const amount = day => model ? Number(day.byProviderModel?.[model]?.cost) || 0 : day.cost
  if (explicit) result.before = Object.values(ledger.days).reduce((sum, day) => sum + amount(day), 0)
  if (explicit && model) for (const [unit, field] of [['Cny', 'costCny'], ['Eur', 'costEur']]) result['before' + unit] = Object.values(ledger.days).reduce((sum, day) => sum + (Number(day.byProviderModel?.[model]?.[field]) || 0), 0)
  const tokenFields = ['input', 'output', 'cacheRead', 'cacheWrite', 'reasoning', 'calls']
  for (const [sessionId, days] of bySession) {
    for (const [date, pm] of Object.entries(days)) {
      const day = ledger.days?.[date]
      const row = day === undefined ? undefined : (Array.isArray(day.sessions) ? day.sessions : []).find(s => s?.id === sessionId)
      if (row === undefined) continue // 账本无此会话行:不新增(与实时计费互斥)。
      const oldPm = row.byProviderModel !== null && typeof row.byProviderModel === 'object' ? row.byProviderModel : {}
      if (model && !Object.hasOwn(oldPm, model)) continue
      const newKeys = Object.keys(pm)
      const dayPm = day.byProviderModel !== null && typeof day.byProviderModel === 'object' ? day.byProviderModel : {}
      // 前置校验(全部通过才动账):键集合一致、逐键 token/calls 相等、日期聚合
```

</details>

**依据 8 · 源码核查**：[lib/index.js:3122-3146](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L3122-L3146)

清空与导入分离，区别 RDB 空结果。

<details>
<summary>查看原文（25行）</summary>

```text
    async resetHistory() {
      // 清空全部历史:除 days 外,Plan 百分比采样/小时桶与余额对账基准一并
      // 重置,否则残留样本仍会推算出 planStats、对账基准继续引用旧日合计,
      // 与「清空全部历史」语义不一致。
      ledger.resetHistory()
      return build(false)
    },

    // 导入安装前历史(issue #27):回放宿主全部会话日志,为账本缺失的日期
    // 重建费用条目(幂等:已有日期只追加未知会话,绝不与实时计费重复)。
    async importLegacyHistory() {
      const locale = localeOf(ledger.config, ctx)
      try {
        const stats = await importLegacyHistory(ledger, join(resolveDshHome(), 'sessions'), sessionSource)
        if (stats.days || stats.sessions) schedulePlanHourRepair()
        // 空结果要区分「SQLite 后端扫描 0 条(可能尚未持久化/数据库未就绪)」与
        // 「确实没有安装前历史」,避免 JSONL 文案误导 better-session 用户。
        const backendIsRdb = !isJsonlSessionBackend(sessionSource)
        const message = stats.days === 0 && stats.sessions === 0
          ? (backendIsRdb
            ? tmsg(locale, 'legacyImportNoneRdb', { scanned: stats.scanned })
            : tmsg(locale, 'legacyImportNone', { scanned: stats.scanned }))
          : tmsg(locale, 'legacyImportDone', stats)
        return {
          ok: true,
```

</details>

**依据 9 · 源码核查**：[lib/store.js:2508-2517](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2508-L2517)

清空的持久状态范围。

<details>
<summary>查看原文（10行）</summary>

```text
  resetHistory() {
    this.days = {}
    this.planSamples = {}
    this.planHourBuckets = {}
    this.balanceRef = null
    this.pendingAccounts = []
    this.pendingPlanHourRepairs = []
    this.historyReset = { id: randomUUID(), at: Date.now() }
    this.scheduleWrite()
  }
```

</details>

#### 缺口

- 未做跨进程抢锁、提交后失回报、进程关闭和等大小文件改写实验。
  **影响**：不能承诺所有平台持久化和缓存新鲜度。
  **进一步探讨**：在隔离账本注入失回报和关闭，核对收据、重启后总量，再做归档修订与取消对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 官方余额、设备授权和自定义余额会读写哪些外部状态？

**研究主题**：依赖、兼容与流程、功能与机制、缺陷与关键质疑

#### 完整回答

官方余额有手动账号、专用余额凭据及模型路由来源，默认且未使用专用凭据时跟踪模型路由。模型密钥引用、服务地址或可用性改变会失效余额缓存及对账基准，避免把两个钱包的差值当消费。Antigravity 的额度适配器列出 consumer daily 优先端点，作者说明存在异常时回退；这属于查询设计，未核验实际额度时效。

OpenDesign 设备码流程以发起账号、工作区和配置构建 job 指纹，检查仍匹配再写对应凭据槽，通过后即先存控制面密钥，工作区查询或配额刷新可随后失败。短时授权材料写宿主日志，成功回执要结合额度状态，撤销前需检查所选凭据。自定义查询可携带凭据请求任意配置 HTTPS 端点。非本地 HTTP 需要显式开关及精确白名单，识别为敏感的头在有效非空名单下才做名单拒绝，未配置名单只是告警。重定向拒绝，POST 仍经过重试封装，请求体可重传不意味着对端动作没有副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1745-1788](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L1745-L1788)

模型路由和凭据引用切换失效余额及基准。

<details>
<summary>查看原文（44行）</summary>

```text
  // 余额差对账提示(drift 时 ok=false 携带文案,其余静默)。
  let reconcileNotice = { ok: true, message: '' }
  let balanceAccountService = accountServiceIdentity(ctx?.get?.('deepseekAccount'))
  let balanceRoute = balanceModelRoute(ctx)
  let balanceRouteReadAt = Date.now(), readingBalanceRoute = false
  let balanceSource = null
  const usesModelBalanceRoute = () => selectedQueryAccount(ledger.config, 'balance') === 'default' && balanceSource !== 'dedicated'
  const invalidateAccountBalance = () => {
    if (!active) return
    resetQueryCache('balance')
    balanceSource = null
    reconcileNotice = { ok: true, message: '' }
    if (ledger.balanceRef !== null) {
      ledger.balanceRef = null
      ledger.scheduleWrite()
    }
  }
  const syncBalanceModelRoute = (force = false) => {
    // Modern describe() can emit document-updated synchronously; cache only this route.
    if (readingBalanceRoute || !force && !balanceRoute.legacy && Date.now() - balanceRouteReadAt < 1000) return
    readingBalanceRoute = true
    try {
      const route = balanceModelRoute(ctx, balanceRoute)
      const changed = route.apiKeyEnv !== balanceRoute.apiKeyEnv || route.baseURL !== balanceRoute.baseURL || route.available !== balanceRoute.available
      balanceRoute = route
      balanceRouteReadAt = Date.now()
      if (changed && usesModelBalanceRoute()) invalidateAccountBalance()
    } finally { readingBalanceRoute = false }
  }
  const syncBalanceSource = () => {
    syncBalanceModelRoute()
    const account = accountServiceIdentity(ctx?.get?.('deepseekAccount'))
    if (account === balanceAccountService) return
    balanceAccountService = account
    invalidateAccountBalance()
  }
  // 只观察公开生命周期事件,不读取 grant 或 getPlatformSession 中的 token。
  ctx.on('credentials/reference-updated', ref => {
    const selected = queryAccountTarget(ledger.config, 'balance', secretRefOf)
    if (ref === selected?.ref || usesModelBalanceRoute() && ref === balanceRoute.apiKeyEnv) invalidateAccountBalance()
  })
  ctx.on('settings/document-updated', ns => {
    if (ns === balanceRoute.settingsNs || ns === 'llm-deepseek' || ns === 'llm-deepseek-api-key') syncBalanceModelRoute(true)
  })
```

</details>

**依据 2 · 源码核查**：[lib/gateway-quota-adapters.js:155-169](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/gateway-quota-adapters.js#L155-L169)

Antigravity 查询端点优先顺序。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Consumer 账号优先使用 daily 端点(PR #492)，避免 production 返回滞后的额度。
 * 摘要无效或缺少 Gemini 时继续后续端点；已取得的窗口优先保留，后续只补缺项。
 * 有效摘要已包含 Gemini 时停止回退；摘要端点仍未提供 Gemini 时再查模型额度。
 */
export const ANTIGRAVITY_QUOTA_URLS = [
  'https://daily-cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary',
  'https://cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary',
  'https://daily-cloudcode-pa.sandbox.googleapis.com/v1internal:retrieveUserQuotaSummary',
]

export const ANTIGRAVITY_MODELS_URLS = [
  'https://daily-cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels',
  'https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels',
]
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2869-2898](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L2869-L2898)

OpenDesign 账号绑定、取消和授权材料日志。

<details>
<summary>查看原文（30行）</summary>

```text
      if (!active) return { ok: false, message: tmsg(locale, 'openDesignLoginCancelled') }
      const target = queryAccountTarget(ledger.config, 'codingPlans.opendesign', secretRefOf)
      if (target === null) return { ok: false, message: tmsg(locale, 'openDesignLoginFailed') }
      // 授权始终属于发起时的账号和工作区设置，包括其他宿主刷新进来的变更。
      const loginSettings = () => {
        const entry = ledger.config?.codingPlans?.opendesign ?? {}
        return [entry.enabled === true, entry.display ?? 'settings', entry.showInComposer === true, entry.refreshMinutes ?? 15,
          queryAccountTarget(ledger.config, 'codingPlans.opendesign', secretRefOf)?.ref, entry.workspaceId ?? '']
      }
      const fingerprint = JSON.stringify([loginSettings(), locale])
      if (openDesignLogin?.fingerprint === fingerprint && !openDesignLogin.controller.signal.aborted) return openDesignLogin.promise
      openDesignLogin?.controller.abort()
      // job 只承载「这次授权属于哪份配置」与取消信号:配置变了或插件卸载即作废。
      const job = { fingerprint, credentialRef: target.ref, controller: new AbortController() }
      openDesignLogin = job
      const current = () => {
        if (!active || openDesignLogin !== job || job.controller.signal.aborted) return false
        ledger.refresh()
        return JSON.stringify([loginSettings(), localeOf(ledger.config, ctx)]) === job.fingerprint
      }
      // 登录与后台额度查询打同一批端点,先让位。
      codingPlanCaches.opendesign?.controller?.abort()
      job.promise = (async () => {
        await codingPlanCaches.opendesign?.inFlight
        job.controller.signal.throwIfAborted()
        if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
        const device = await startOpenDesignDeviceAuthorization(locale, { signal: job.controller.signal })
        if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
        // 授权页只写入宿主日志:一次性材料不进快照、不进历史记录。
        ctx.logger?.info?.(`[cost-meter] OpenDesign device authorization: ${device.url} code ${device.userCode}`)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2899-2940](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L2899-L2940)

凭据先写与查询失败区分。

<details>
<summary>查看原文（42行）</summary>

```text
        openAuthorizationPage(device.url)
        const approved = await waitOpenDesignDeviceAuthorization(device, locale, { signal: job.controller.signal })
        job.controller.signal.throwIfAborted()
        if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
        // 先落一次性的控制面密钥:设备码批准只能消费一次,不能因为后面的工作区读取失败而报废。
        // 命名账号(selectedQueryAccount ≠ default)写入该账号自己的槽位,与解析器同源;
        // 目标解析为 null 说明该账号已不存在,此时宁可失败也不能覆盖默认账号的凭据。
        await writeCredential(target.ref, async () => {
          if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
          await credentials.set(credentialRef(target.ref), approved.controlKey)
        })
        // 工作区 ID 只是补充信息:读不到就沿用配置里已有的值(可为空,由查询端读取当前工作区)。
        let workspaceNote = ''
        try {
          const workspaceId = await resolveOpenDesignWorkspace(approved.controlKey, locale, { signal: job.controller.signal })
          if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
          if (ledger.config?.codingPlans?.opendesign?.workspaceId !== workspaceId) {
            const { config: next, errors } = applyConfigPatch(ledger.config, { codingPlans: { opendesign: { workspaceId } } })
            if (errors.length === 0) {
              ledger.config = next
              job.fingerprint = JSON.stringify([loginSettings(), localeOf(ledger.config, ctx)])
              ledger.scheduleWrite()
            }
          }
        } catch (error) {
          job.controller.signal.throwIfAborted()
          if (!current()) throw error
          workspaceNote = tmsg(locale, 'openDesignLoginWorkspaceFailed')
          ctx.logger?.warn?.(`[cost-meter] OpenDesign workspace lookup failed after approval: ${String(error?.message ?? error)}`)
        }
        // 登录自己刚写了凭据与工作区,失效缓存时不能顺手取消自己(keepLogin)。
        if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
        resetQueryCache('codingPlans.opendesign', { keepLogin: true })
        await ensureCodingPlan('opendesign', true)
        if (!current()) throw Object.assign(new Error('cancelled'), { code: 'cancelled' })
        const value = codingPlanCaches.opendesign?.value ?? emptyCodingPlan()
        return {
          ok: true,
          // 授权与凭据都已落地;工作区读取失败只是附注,不改变成功语义。
          message: (value.status === 'ok' ? tmsg(locale, 'openDesignLoginSuccess') : tmsg(locale, 'openDesignLoginQuotaFailed', { message: value.message }))
            + (workspaceNote.length > 0 ? ' ' + workspaceNote : ''),
          state: await buildCurrentState(),
```

</details>

**依据 5 · 源码核查**：[lib/custom-balance.js:123-151](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/custom-balance.js#L123-L151)

协议与名单边界。

<details>
<summary>查看原文（29行）</summary>

```text
  const parsedUrl = resolveCustomBalanceUrl(request.url, ctx)
  const loopbackTarget = isLoopbackHost(parsedUrl.hostname)
  const host = parsedUrl.host.toLowerCase()
  const allowed = Array.isArray(custom.allowedHosts)
    ? custom.allowedHosts.filter(h => typeof h === 'string' && h.trim()).map(h => h.trim().toLowerCase()) : null
  // #309: non-loopback HTTP requires both an explicit switch and the exact host:port.
  if (parsedUrl.protocol !== 'https:' && !(parsedUrl.protocol === 'http:'
    && (loopbackTarget || custom.allowInsecureHttp === true && allowed?.includes(host)))) {
    throw new Error('customBalance.request.url must use https; non-loopback HTTP requires allowInsecureHttp and an exact allowedHosts entry (host:port)')
  }
  // 凭据外带防护(v1.6.8 → v1.7.6 扩展,issue #86):请求头里**解析出了真实凭据**
  // ({{VAR}} 占位符)或**值本身疑似明文密钥**(Authorization / X-Api-Key / Bearer /
  // sk- 等启发式,与 store.js 脱敏同一判定)时,把本次出站主机名与
  // customBalance.allowedHosts(用户显式配置的白名单)比对——
  //   · 配置了白名单 → 不在名单内直接拒绝(防导入他人配置导致密钥外带);
  //   · 未配置白名单 → 放行但打一次警告,提示可配置 allowedHosts 收紧。
  // 兼容取舍:硬性要求所有存量用户补 allowedHosts 会直接打断现有配置,故默认仅警告。
  // v1.6.8 只认 {{VAR}} 占位符,明文 key(Bearer sk-xxx)完全绕过校验——而明文恰是
  // 更常见、也更容易被「导入他人配置」带往任意主机的场景,v1.7.6 一并纳入。
  const rawHeaders = request.headers ?? {}
  const usesCredentials = Object.entries(rawHeaders).some(([name, value]) =>
    hasCredentialPlaceholder(value) || looksLikeSecretHeaderValue(name, value))
  if (usesCredentials) {
    if (allowed !== null && allowed.length > 0 && !allowed.includes(host)) {
      throw new Error(`customBalance request host "${host}" is not in customBalance.allowedHosts; refusing to send credentials there (add it explicitly to allow)`)
    }
    if (allowed === null && !warnedHosts.has(host)) {
      warnedHosts.add(host)
      console.warn(`[dsh-cost-meter] 自定义余额请求携带凭据发往 ${host}:建议在 customBalance.allowedHosts 中显式列出该主机,防止导入他人配置导致密钥外带`)
```

</details>

**依据 6 · 源码核查**：[lib/custom-balance.js:154-169](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/custom-balance.js#L154-L169)

POST、重试、拒绝重定向。

<details>
<summary>查看原文（16行）</summary>

```text
  const method = typeof request.method === 'string' ? request.method.toUpperCase() : 'GET'
  const headers = await resolveHeaders(rawHeaders, ctx)
  const init = { method, headers, redirect: 'manual', signal }
  if (method !== 'GET' && method !== 'HEAD' && request.body !== undefined) {
    init.body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    if (!Object.keys(headers).some(name => name.toLowerCase() === 'content-type')) {
      init.headers = { ...headers, 'content-type': 'application/json' }
    }
  }
  // 瞬时网络错误自动重试(issue #28 同一封装;body 为字符串可安全重放)。
  // redirect: 'manual'(v1.6.8):禁止自动跟随重定向——凭据头会被原样带到 3xx 的
  // 目标主机,一次跨源重定向就足以把密钥发去别处;遇到重定向直接报错。
  const response = await fetchWithRetry(parsedUrl.href, init, { timeoutMs: 15000 })
  if (response.status >= 300 && response.status < 400) {
    try { await response.body?.cancel?.() } catch {}
    throw new Error(`custom balance endpoint redirected (HTTP ${String(response.status)}); redirects are refused to avoid forwarding credentials to another host`)
```

</details>

#### 缺口

- 未核查真实凭据后端、对端权限、网络副作用和跨 Host 竞争。
  **影响**：可选网络能力须先单独核验，不能用余额卡状态代替凭据验收。
  **进一步探讨**：先用无真实凭据的 fixture 验证错误目的地、重复请求及取消前后写入，再核授权端点。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何以可逆的小范围对账决定继续试用？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议需要核对任务成本、已有独立账单的 DSH 用户先用隔离 profile 观察小批固定调用。先记录宿主、插件、模型渠道、请求时间和定价配置，关闭暂不需要的余额及授权功能。选择一个固定价模型和一个不同路由的模型，比较调用计数、五桶、币种和价表来源。先在 UI 查会话聚合，再重启回读账本，缺量、无价和估算明确留在差额里。合格结果是每笔差异可定位到具体调用、定价或账单规则。对账前单独保留存储副本，后台收据和缓存更新均须实际核对。

相较手动把供应商汇总和 DSH 日志拼成任务表，插件可以先提供归因和价格估计，有机会省去部分记录，但核价、权限维护、失败补核及退出仍需用户处理。现金开销与人工时间均未测，不从本地节省卡推断净收益。如果账本丢记、模型错价、重启后记录不一致或外部凭据来源无法确认，停止用显示金额决策，保留账单和旧账本并禁用相应功能。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-41](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/package.json#L24-L41)

声明宿主兼容范围。

<details>
<summary>查看原文（18行）</summary>

```text
  "dsh": {
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
        "0.2.1-rc.2": "compatible",
        "0.2.2-alpha.3": "compatible"
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/billing-stream.js:85-93](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billing-stream.js#L85-L93)

只有捕获用量才入账。

```text
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
            console.warn(`[dsh-cost-meter] 计费失败: ${String(error)}`)
          }
        }
```

**依据 3 · 源码核查**：[lib/pricing.js:1152-1189](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/pricing.js#L1152-L1189)

渠道价格和手动覆盖的核查点。

<details>
<summary>查看原文（38行）</summary>

```text
function magpiePriceTarget(provider, modelId, prices, mode, overrides) {
  const override = overrides?.[(provider || 'deepseek') + ':' + modelId]
  if (!provider || mode === 'exact' || typeof modelId !== 'string'
    || isLocalOriginProviderOrModel(provider, modelId) || ['our-free-model', 'our-free-model-region'].includes(provider)
    || typeof override === 'string' && override.length > 0
    || Object.hasOwn(prices?.providers?.[provider]?.models ?? {}, modelId)) return null
  const separator = modelId.indexOf('/')
  if (separator <= 0 || separator === modelId.length - 1) return null
  const route = modelId.slice(0, separator).toLowerCase()
  const model = modelId.slice(separator + 1)
  const aliases = { codex: 'openai', claude: 'anthropic', gemini: 'google', 'ollama-cloud': 'ollama-cloud', volcengine: 'volcengine', ark: 'ark' }
  const magpie = /^(?:dsh-)?magpie(?:$|-)/.test(provider)
  const knownRoute = Object.hasOwn(aliases, route) || SCOPED_PRICE_PROVIDERS.has(route)
    || ['workbuddy', 'workbuddy-ai', 'qoder', 'qoder-cn', 'trae-cn', 'trae-global', 'zcode', 'mimo-app', 'commandcode-plan', 'cline', 'copilot', 'vercel'].includes(route)
  if (!magpie && (!knownRoute || Object.hasOwn(MODEL_VENDOR_PREFIXES, provider) || SCOPED_PRICE_PROVIDERS.has(provider))) return null
  // An unknown free-only route must not inherit a paid reference price.
  if (/(?:^|-)free$/.test(route) && !Object.hasOwn(prices?.providers ?? {}, route)) return null
  const upstream = aliases[route] ?? route
  if (upstream === 'deepseek' && priceModelHit(model, prices?.models ?? {}, 'deepseek', 'auto', prices) === null) return null
  return {
    provider: Object.hasOwn(aliases, route) || SCOPED_PRICE_PROVIDERS.has(upstream)
      || Object.hasOwn(MODEL_VENDOR_PREFIXES, upstream) || Object.hasOwn(prices?.providers ?? {}, upstream)
      || isLocalOriginProviderOrModel(upstream, model) ? upstream : provider,
    model,
  }
}

export function providerPriceEntryFor(provider, modelId, prices, options) {
  const rawProvider = typeof provider === 'string' ? provider.trim().toLowerCase() : ''
  let normalized = rawProvider.startsWith('llm-') ? rawProvider.slice(4) : rawProvider
  const route = magpiePriceTarget(normalized, modelId, prices, options?.mode, options?.overrides)
  if (route) {
    normalized = route.provider
    modelId = route.model
    options = { ...options, overrides: {} }
  }
  if (['our-free-model', 'our-free-model-region'].includes(normalized) && options?.overrides?.[normalized + ':*'] === '__free__') return { entry: { cacheHit: 0, cacheMiss: 0, cacheWrite: 0, output: 0, reasoning: 0 }, currency: 'USD', priced: true, billingMode: 'flat' }
  const result = withProviderPeakSchedule(resolveProviderPriceEntry(normalized, modelId, prices, options), normalized, prices)
```

</details>

**依据 4 · 源码核查**：[lib/store.js:2632-2648](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/store.js#L2632-L2648)

后台收据与失败退路。

<details>
<summary>查看原文（17行）</summary>

```text
    const transactionId = randomUUID()
    try {
      this.backgroundWrite = this.startWrite({ path: this.path, base: this.writeBase, local, transactionId, now: Date.now(),
        pending: accounts.slice(), repairs: repairs.slice(), revision: this.diskRevision, backupHistory: this.legacyPricingHistory }, result => {
        this.backgroundWrite = null
        if (result.error) {
          // A worker may commit successfully and exit before its acknowledgement.
          // The receipt is part of the same atomic file, so replay cannot double-charge.
          let committed
          try { committed = this.readDiskSnapshot() } catch {}
          if (cleanWriteReceipts(committed?.writeReceipts).includes(transactionId)) result = { merged: committed, revision: diskRevisionOf(this.path) }
          else {
            // Another host holding the lock is temporary contention, not a broken worker.
            if (result.error.code === 'EBUSY') { if (!this.closed) this.scheduleWrite() }
            else this.fallbackWrite(result.error)
            return
          }
```

</details>

**依据 5 · 源码核查**：[lib/custom-balance.js:133-151](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/custom-balance.js#L133-L151)

关闭可选授权的理由。

<details>
<summary>查看原文（19行）</summary>

```text
  // 凭据外带防护(v1.6.8 → v1.7.6 扩展,issue #86):请求头里**解析出了真实凭据**
  // ({{VAR}} 占位符)或**值本身疑似明文密钥**(Authorization / X-Api-Key / Bearer /
  // sk- 等启发式,与 store.js 脱敏同一判定)时,把本次出站主机名与
  // customBalance.allowedHosts(用户显式配置的白名单)比对——
  //   · 配置了白名单 → 不在名单内直接拒绝(防导入他人配置导致密钥外带);
  //   · 未配置白名单 → 放行但打一次警告,提示可配置 allowedHosts 收紧。
  // 兼容取舍:硬性要求所有存量用户补 allowedHosts 会直接打断现有配置,故默认仅警告。
  // v1.6.8 只认 {{VAR}} 占位符,明文 key(Bearer sk-xxx)完全绕过校验——而明文恰是
  // 更常见、也更容易被「导入他人配置」带往任意主机的场景,v1.7.6 一并纳入。
  const rawHeaders = request.headers ?? {}
  const usesCredentials = Object.entries(rawHeaders).some(([name, value]) =>
    hasCredentialPlaceholder(value) || looksLikeSecretHeaderValue(name, value))
  if (usesCredentials) {
    if (allowed !== null && allowed.length > 0 && !allowed.includes(host)) {
      throw new Error(`customBalance request host "${host}" is not in customBalance.allowedHosts; refusing to send credentials there (add it explicitly to allow)`)
    }
    if (allowed === null && !warnedHosts.has(host)) {
      warnedHosts.add(host)
      console.warn(`[dsh-cost-meter] 自定义余额请求携带凭据发往 ${host}:建议在 customBalance.allowedHosts 中显式列出该主机,防止导入他人配置导致密钥外带`)
```

</details>

#### 缺口

- 插件、宿主、供应商的同版本实际对账效果及净时间收益均未测。
  **影响**：当前建议仅覆盖小范围验证。
  **进一步探讨**：记录每个合格对账任务的漏重、错价、人工时间与写入异常，再决定是否持续采用。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 自动接入 Billion Context 会改变哪些进程和源码状态？

**研究主题**：依赖、兼容与流程、功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

根入口在实际插件加载前安装自动观察，实际 apply 持有自己的生命周期引用。自动桥给宿主 ChildProcess.prototype.spawn 装包装，也订阅 undici 请求事件。它根据真实路径、包名、受支持版本、Node loader 能力及两份运行文件的补丁探测识别目标。只有匹配的 Node 或 Electron Node 子进程会添加 --import preload 和带目标脚本指纹的启动环境变量，探测失败仍走原启动。

子进程 preload 消费并删除该环境变量，注册 loader。loader 仅在目标 URL、ESM 格式和 SHA-256 都匹配时返回内存改写的源码，失败回退原模块。这个兼容层不覆盖磁盘中的原包，但会改变所匹配进程的启动参数和运行时加载。最后一个宿主引用退出时取消诊断订阅并在仍持有包装身份时还原 spawn；release 本身没有关闭已启动子进程。退出时需要单独确认长驻代理状态；专链来源标识仍只覆盖实际接入的代理。

#### 证据与依据

**依据 1 · 源码核查**：[src/bootstrap.js:1-18](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/src/bootstrap.js#L1-L18)

预加载观察并向正式生命周期移交。

<details>
<summary>查看原文（18行）</summary>

```text
/** Keep startup in one module so parallel plugin imports cannot delay the hook behind UI dependencies. */
import { installBillionAuto } from '../lib/billion-context-auto.js'

// Hold the launch observer while dependencies load. The real plugin owns the
// applied lifetime, including tools that reload lib/index.js directly.
const releaseLoading = installBillionAuto()
let plugin
try { plugin = await import('./index.js') }
catch (error) { releaseLoading(); throw error }
const loadingTimer = setTimeout(releaseLoading, 0)
loadingTimer.unref?.()

export const name = 'cost-meter'
export function apply(ctx) {
  clearTimeout(loadingTimer)
  try { return plugin.apply(ctx) }
  finally { releaseLoading() }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3893-3901](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/index.js#L3893-L3901)

实际 apply 获取自动观察引用。

```text
export function apply(ctx) {
  const release = installBillionAuto()
  ctx.effect(() => release, 'cost-meter: original billion-context startup')
  try { return applyCore(ctx) }
  catch (error) { release(); throw error }
}

function applyCore(ctx) {
  const ledger = Ledger.open()
```

**依据 3 · 源码核查**：[lib/billion-context-auto.js:36-59](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-auto.js#L36-L59)

目标识别、版本与两份源码探测。

<details>
<summary>查看原文（24行）</summary>

```text
export function inspectBillionLaunch(args, options = {}, cache = new Map()) {
  if (!Array.isArray(args) || typeof args[0] !== 'string' || args[0].startsWith('-')) return null
  let script
  try { script = realpathSync(resolve(options.cwd ?? process.cwd(), args[0])) } catch { return null }
  if (basename(script) !== 'index.js' || basename(dirname(script)) !== 'dist') return null
  const root = dirname(dirname(script))
  let pkg
  try { pkg = JSON.parse(readSource(join(root, 'package.json'))) } catch { return null }
  if (pkg.name !== 'billion-context' || pkg.dshCostMeterCompatibility) return null
  if (billionVersionSupported(pkg.version) !== true) return { version: pkg.version, reason: 'needs_update' }
  if (typeof module.register !== 'function') return { version: pkg.version, reason: 'bridge_missing' }
  try {
    const native = join(root, 'dist/agent/dsh-native.js')
    const infos = [statSync(script), statSync(native)]
    const revision = script + ':' + infos.map(info => [info.size, info.mtimeMs, info.ctimeMs].join(':')).join(':')
    if (cache.has(revision)) return cache.get(revision)
    const source = readSource(script)
    patchBillionRuntime(source, 'proxy')
    patchBillionRuntime(readSource(native), 'native')
    const result = { script, version: pkg.version, fingerprint: createHash('sha256').update(source).digest('hex') }
    cache.set(revision, result)
    if (cache.size > 8) cache.delete(cache.keys().next().value)
    return result
  } catch { return { version: pkg.version, reason: 'changed' } }
```

</details>

**依据 4 · 源码核查**：[lib/billion-context-auto.js:61-105](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-auto.js#L61-L105)

全局 spawn 包装、启动参数和诊断订阅。

<details>
<summary>查看原文（45行）</summary>

```text
export function installBillionAuto() {
  let released = false
  const cleanup = state => () => { if (released) return; released = true; release(state) }
  let state = globalThis[key]
  if (state) {
    state.references++
    if (state.issue) globalThis[bridgeKey]?.adapterStatus?.(state.issue.version, state.issue.reason)
    return cleanup(state)
  }
  const prototype = childProcess.ChildProcess.prototype, original = prototype.spawn
  const cache = new Map(), requests = new WeakMap(), children = new Map()
  // Keep only local handshake metadata across a cost-meter hot reload. No active hook survives disposal.
  const origins = globalThis[peersKey] ??= new Map()
  state = { references: 1, original, subscriptions: [], children, prototype }
  const bridge = () => globalThis[bridgeKey]
  // Native bili captures `spawn` before its asynchronous bootstrap completes.
  // Its captured function still calls this prototype method at launch time.
  const wrapped = function (options) {
    if (state.references <= 0 || !options || !Array.isArray(options.args) || !Array.isArray(options.envPairs)) return original.apply(this, arguments)
    const command = options.file, args = options.args.slice(1)
    if (typeof command !== 'string' || !['node', 'node.exe', 'nodejs'].includes(basename(command).toLowerCase()) && !options.envPairs.includes('ELECTRON_RUN_AS_NODE=1')) return original.apply(this, arguments)
    let launch
    try { launch = inspectBillionLaunch(args, options, cache) } catch {}
    try { if (launch?.reason) { state.issue = launch; bridge()?.adapterStatus?.(launch.version, launch.reason) } } catch {}
    if (!launch || launch.reason) return original.apply(this, arguments)
    state.issue = undefined
    const envPairs = options.envPairs.filter(pair => !pair.startsWith('DSH_COST_METER_BILLION_LOADER='))
    envPairs.push('DSH_COST_METER_BILLION_LOADER=' + JSON.stringify({ script: launch.script, fingerprint: launch.fingerprint }))
    const result = original.call(this, { ...options, args: [options.args[0], '--import', preload, ...args], envPairs })
    const child = this
    children.set(child.pid, child)
    const done = () => {
      children.delete(child.pid)
      for (const [origin, peer] of origins) if (peer.pid === child.pid) origins.delete(origin)
    }
    child.once('exit', done); child.once('error', done)
    return result
  }
  state.wrapped = wrapped
  prototype.spawn = wrapped
  const subscribe = (name, listener) => {
    const safe = message => { try { listener(message) } catch {} }
    const events = channel(name); events.subscribe(safe); state.subscriptions.push(() => events.unsubscribe(safe))
  }
  subscribe('undici:request:create', ({ request }) => {
```

</details>

**依据 5 · 源码核查**：[lib/billion-context-preload.js:5-14](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-preload.js#L5-L14)

删除环境变量并注册 loader。

<details>
<summary>查看原文（10行）</summary>

```text
const raw = process.env.DSH_COST_METER_BILLION_LOADER
delete process.env.DSH_COST_METER_BILLION_LOADER
try {
  const data = JSON.parse(raw ?? 'null')
  if (data && typeof module.register === 'function' && typeof data.script === 'string' && /^[a-f\d]{64}$/.test(data.fingerprint)) {
    module.register(new URL('./billion-context-loader.js', import.meta.url), {
      parentURL: import.meta.url, data: { target: pathToFileURL(data.script).href, fingerprint: data.fingerprint },
    })
  }
} catch {} // Older runtimes retain normal billion-context operation and host billing.
```

</details>

**依据 6 · 源码核查**：[lib/billion-context-loader.js:7-17](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-loader.js#L7-L17)

只有固定目标和指纹才改写加载源码。

<details>
<summary>查看原文（11行）</summary>

```text
export function initialize(data) { target = data.target; fingerprint = data.fingerprint }
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context)
  if (url !== target || result.format !== 'module') return result
  try {
    const source = result.source == null ? readFileSync(new URL(url), 'utf8') : Buffer.from(result.source).toString('utf8')
    if (createHash('sha256').update(source).digest('hex') !== fingerprint) return result
    const patched = patchBillionRuntime(source, 'proxy', { proxy: new URL('./billion-context-proxy.js', import.meta.url).href })
    return { ...result, source: patched.source }
  } catch { return result } // A collection failure must never stop the original proxy.
}
```

</details>

**依据 7 · 源码核查**：[lib/billion-context-auto.js:144-152](https://github.com/Han-1413141/dsh-cost-meter/blob/c876735d80760fc89d88fa99c19c90c56e984c23/lib/billion-context-auto.js#L144-L152)

引用数归零时解除宿主 hook，没有关闭子进程逻辑。

```text
  globalThis[key] = state
  return cleanup(state)
}
function release(state) {
  if (--state.references > 0 || globalThis[key] !== state) return
  for (const dispose of state.subscriptions) dispose()
  if (state.prototype.spawn === state.wrapped) state.prototype.spawn = state.original
  delete globalThis[key]
}
```

#### 缺口

- 未实测与其他启动诊断插件的重载顺序和已运行代理退出。
  **影响**：不能以宿主 hook 释放证明相关代理状态已恢复。
  **进一步探讨**：用测试子进程对照受支持和变更过的指纹，比较卸载前后新启动及存量进程。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
