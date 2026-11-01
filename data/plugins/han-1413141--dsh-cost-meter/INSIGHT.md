# DSH Cost Meter

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2b682d9](https://github.com/Han-1413141/dsh-cost-meter/tree/2b682d92e4cf736b31f893f02303d56736cb74cf)

<!-- BEGIN META -->
[![GitHub ★ 589](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=589&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Han-1413141/dsh-cost-meter) [![npm 30d 117,828](https://img.shields.io/static/v1?label=npm+30d&message=117%2C828&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-meter)
<!-- END META -->

> **功能**：统计 DSH 会话模型用量及估算费用，并提供预算、历史与额度信息。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将流用量按会话聚合并将 API 金额与 Plan 等值区分，补充账号余额无法提供的任务视角；它不能取代供应商结算。

> **主要限制**：[Q03](#research-q03) 显示缺 usage 不入普通账、未知价格按零计价且相同包装流可能误合并；显示为零不证明没有支出，必须对账。

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
  - [Q01 · 谁需要会话级费用估算，供应商账单是否足够？](#detail-section-11)
  - [Q02 · 流用量如何进入账本，取消和落盘如何处理？](#detail-section-12)
  - [Q03 · 缺 usage、值去重及未知价格如何影响结果？](#detail-section-13)
  - [Q04 · Plan 等值、API 现金和预算是否相同？](#detail-section-14)
  - [Q05 · 存储、凭据、网络和构建有哪些条件？](#detail-section-15)
  - [Q06 · 哪些用户值得试用、何时停止依赖？](#detail-section-16)
  - [Q07 · 可否用调用收据区分转发与等量独立请求？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要按 DSH 会话和模型查看用量的用户；供应商账单仍是账号实际结算的主要核对基线。

供应商账单提供实际结算和账户余额，本组件提供宿主内会话归因与估算；两者覆盖和口径未必一致。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型流计量 | 捕获会话 usage 并估算费用 | 缺 usage 不入该观察链，未知价格不证明免费 |
| 历史与预算 | 查看用量聚合与预算进度 | 不能视为所有调用的硬限额 |
| 自定义余额 | 查询用户配置的供应商端点 | 需凭据、网络和可信端点 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 usage 数据 | 流计量需要 | 获取用量及会话身份 | 没有 usage 时该观察链不入账 |
| 价格表 | 金额估算需要 | 按模型计算金额 | 未定价时金额为零，不表示免费 |
| 本地账本目录 | 持久化需要 | 保存聚合与配置 | 写入失败或锁竞争需要处理 |
| 凭据与网络 | 可选余额／额度查询需要 | 访问供应商接口 | 查询可能失败，实际账单仍需外部核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主与模型价格并备份账本 | 价格及计费类别可解释 |
| 采集 | 宿主发出流并提供 usage | 账本显示对应会话与五桶 |
| 核对 | 用户与供应商记录对照 | 缺项或金额不符时停止依赖估算 |
| 恢复 | 用户检查账本写入和日志 | 保全记录并重新对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 存储及校准调用成本未知 | 核对模型价格和类别，时间未知 | 需要宿主 usage |
| 持续使用 | 账本存储和可选网络查询成本未知 | 更新价格、核对供应商，时间未知 | 价格和接口会变化 |
| 失败恢复 | 备份及重试资源未知 | 排查账本、锁和缺失调用 | 掉电恢复未经实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话归因 | 流监听将 sessionId 与五桶写入账本 | 与实际账单的一致率 |
| 包装流去重 | 五桶窗口排除匹配项 | 等量独立调用的漏记比例 |
| 预算显示 | 作者说明进度及告警 | 是否约束所有调用，不能视为硬限额 |

> **思考**：[Q03](#research-q03) 显示缺 usage 不入普通账、未知价格按零计价且相同包装流可能误合并；显示为零不证明没有支出，必须对账。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将流用量按会话聚合并将 API 金额与 Plan 等值区分，补充账号余额无法提供的任务视角；它不能取代供应商结算。

[Q02](#research-q02) 的取消传播与后台写入收据针对具体失败，但仅源码支持；[Q03](#research-q03) 的按值去重存在等量误合并条件，不能把复杂性视为可靠性证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示缺 usage 不入普通账、未知价格按零计价且相同包装流可能误合并；显示为零不证明没有支出，必须对账。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 建议先对照少量已知调用，遇到缺记录或未知价格即停止将本地金额作为费用依据，回看供应商账单。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码机制已按固定版本检查；金额准确性、宿主执行与未来设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/billing-stream.js、lib/usage-dedup.js、lib/store.js、lib/custom-balance.js、scripts/build.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的入口、用量捕获、去重、账本、价格、凭据和构建片段；未执行插件、目标测试、供应商请求或宿主验收，其他供应商集成未逐项核查。
- 下一步：在隔离宿主固定模型和价格，比较正常、取消、无 usage、等量包装流及中断写入；以供应商账单为基线记录漏记、重复和恢复结果。

**分析版本**

- **仓库**：[Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter)
- **版本号**：1.9.47（[固定提交 2b682d9](https://github.com/Han-1413141/dsh-cost-meter/tree/2b682d92e4cf736b31f893f02303d56736cb74cf)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提出保留稳定调用 ID 与缺失状态的未验证收据；若跨包装层无法传递或维护成本超过收益，应放弃。

在隔离宿主固定模型和价格，比较正常、取消、无 usage、等量包装流及中断写入；以供应商账单为基线记录漏记、重复和恢复结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 305 | 15194 | — | — | 364511 |
| .js | source | 144 | 41117 | 35379 | 5230 | — |
| .mjs | source | 10 | 878 | 722 | 141 | — |
| .mjs | test | 237 | 39166 | 36021 | 2333 | — |
| .mjs | example | 6 | 263 | 230 | 28 | — |
| .md | example | 1 | 21 | — | — | 175 |
| .js | example | 1 | 3 | 3 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 99](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=99&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 99](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=99&color=737b86&logo=github)](https://github.com/Han-1413141/dsh-cost-meter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查会话用量和费用估算的来源、去重及价格边界，以及对账采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话级费用估算，供应商账单是否足够？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该插件面向需要按 DSH 会话和模型追踪 token 与费用的用户；供应商账单或余额可核对账号层面的实际支出，但不一定按 DSH 会话拆分。README.md:7、30 和 75-85 是作者对会话、日汇总、预算及历史的功能主张；lib/index.js:3813-3833 接收 sessionId 并交账本记录，无 sessionId 的辅助调用按代码注释进入总计。与单看余额相比，增量是对 DSH 内部请求的会话归因与估算；范围外调用、无 usage 和价格缺失意味着它不能代替供应商正式账单。实际需求频率、账单覆盖和用户节省的对账时间未知，需按同一调用集对照账单和日志。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-85](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/README.md#L75-L85)

作者描述会话、预算和历史。

<details>
<summary>查看原文（11行）</summary>

```text
| Today's cost | Sidebar bottom (above the settings button) | “Today ¥x”, hover for call count and token details |
| Budget box | Sidebar bottom (between the balance row and the settings button) | Rounded-square frame: budget, used %, progress bar, today's cost & share of budget, used/limit; ≥80% warning, ≥100% over-budget |
| Summary cards | Settings page | Today / this month / cumulative cost and call counts |
| External usage | Settings → Cost | [Read-only snapshots](docs/external-usage.md#english) from other processes on the same account; per-source tokens/calls/cost and recent days, plus DSH + external daily/monthly/all-time totals. Fresh external cost for today joins official balance reconciliation. |
| Token usage stats | Settings page (Cost section) | All-time token totals (input/cache/output/calls) + a Codex-style 26-week daily usage heat grid that fills the settings width; hover a cell for that day's detail |
| Token Plan usage stats | Settings page (Usage) | Per enabled coding plan (incl. Go): per-1% quota and full-window token / equivalent-cost estimates for the current windows (sample delta / live ratio), plus daily/weekly/monthly usage curves; plan-channel amounts are equivalent-only and never touch real money (issue #64) |
| Today's sessions | Settings page | Per-session call count, input/cache/output tokens and cost |
| History | Settings page | Per-day totals; retention days configurable (default 180) |
| Pre-install history import | Automatic on first launch | After install/upgrade, the first launch automatically replays all host session logs to import conversations from before the plugin was installed (missing dates are rebuilt whole; existing dates only gain previously unknown sessions; idempotent and never double-counts live metering; costs priced at per-event historical rates); a manual re-run entry remains in Settings |
| Budget settings | Settings page, top | Limit, period (today / month / cumulative / custom date range), used % |
| Price table | Settings page | Per-model off-peak / peak prices (input/output shorthand supported; cache prices derived automatically); fully editable |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3812-3833](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/index.js#L3812-L3833)

会话标识及五桶用量进入账本。

<details>
<summary>查看原文（22行）</summary>

```text
  const usageDeduper = createUsageDeduper()
  // 记忆插件等可创建隔离的 llm 服务；账本是全局观察者，须跨服务作用域接收用量。
  // 子会话仍按自己的 sessionId 入账；无 sessionId 的后台调用只进入日/月总计。
  const billionContext = installBillionContextBilling(ctx, ledger)
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

#### 缺口

- 没有同条件账单对照
  **影响**：归因覆盖及人工对账收益未知
  **进一步探讨**：使用相同调用集比较供应商账单和本地记录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 流用量如何进入账本，取消和落盘如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

lib/index.js:3676-3687 打开账本，3812-3833 全局注册 llm/stream 并把 usage 的输入、输出、缓存读写、推理五桶映射为 ledger.account。lib/billing-stream.js:40-68 逐块透传并保留 usage，76-93 在非正常完成时请求下游 iterator.return，只有捕获 usage 且 bridge 未覆盖时调用 account。lib/store.js:2400-2449 将价格、分类和时间写成 call，应用内存聚合后追加 pending 并调度写入；2610-2651 将快照与 pending 送后台事务，异常时检查事务收据或回退处理。代码展示去重和恢复意图，但异步入账与排队并不证明每次异常、掉电或多进程场景均不丢失；未执行目标测试和宿主流。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3673-3687](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/index.js#L3673-L3687)

入口打开账本。

<details>
<summary>查看原文（15行）</summary>

```text
 * 挂载账本、llm/stream 计费包裹、会话投影与 costMeter 服务。
 * @param ctx - 宿主插件上下文。
 */
export function apply(ctx) {
  const release = installBillionAuto()
  ctx.effect(() => release, 'cost-meter: original billion-context startup')
  try { return applyCore(ctx) }
  catch (error) { release(); throw error }
}

function applyCore(ctx) {
  const ledger = Ledger.open()
  // 会话存储记录源(T3):JSONL 模式仍枚举会话文件,SQLite(session-rdb)模式改走
  // 数据库;创建本身是惰性的(首次回填/导入/修复时才真正探测)。
  const sessionSource = createSessionRecordSource(ctx, join(resolveDshHome(), 'sessions'))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3812-3833](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/index.js#L3812-L3833)

注册监听并调用账本。

<details>
<summary>查看原文（22行）</summary>

```text
  const usageDeduper = createUsageDeduper()
  // 记忆插件等可创建隔离的 llm 服务；账本是全局观察者，须跨服务作用域接收用量。
  // 子会话仍按自己的 sessionId 入账；无 sessionId 的后台调用只进入日/月总计。
  const billionContext = installBillionContextBilling(ctx, ledger)
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

**依据 3 · 源码核查**：[lib/billing-stream.js:40-68](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/billing-stream.js#L40-L68)

透传并捕获 usage。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/billing-stream.js:76-93](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/billing-stream.js#L76-L93)

取消时请求下游 return，并条件性入账。

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

**依据 5 · 源码核查**：[lib/store.js:2440-2450](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2440-L2450)

加入 pending 并调度写入。

<details>
<summary>查看原文（11行）</summary>

```text
    const call = {
      ...(meter ? { meter } : {}),
      date: localDayKey(atMs), sessionId, atMs, recordedAt: Date.now(), planId,
      providerKey: `${typeof provider === 'string' && provider.length > 0 ? provider : 'deepseek'}:${String(modelId ?? 'default')}`,
      values: { ...buckets, calls: 1, cost, apiCost, ...frozenAmounts(cost, apiCost, pricing) },
    }
    if (!applyAccount(this, call)) return false
    this.pendingAccounts.push(call)
    this.prune()
    this.scheduleWrite()
    return true
```

</details>

**依据 6 · 源码核查**：[lib/store.js:2610-2651](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2610-L2651)

后台事务、收据和错误处理。

<details>
<summary>查看原文（42行）</summary>

```text
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
          }
        }
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
      })
```

</details>

#### 缺口

- 未运行掉电、恢复或并发场景
  **影响**：不能保证所有已消费用量都持久化
  **进一步探讨**：隔离宿主复现中断及多进程写入并核对供应商记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缺 usage、值去重及未知价格如何影响结果？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

lib/billing-stream.js:63-68、86-90 显示没有 usage 则此流观察链不入账，这不表示供应商免费；lib/usage-dedup.js:26-42、92-111 依据会话、归一化 provider、模型和五桶数值在默认十秒窗口判断包装流，普通流只与改挂包装样本互斥。源码注释 19-21 明确两次独立但五桶全同的包装调用在窗口内可被合并，存在少计取舍。lib/store.js:2403-2419 对找不到价格的模型按 0 形成金额，而非证明其零费；usage 缺桶也会归零。价格匹配、外部费用和实际账单仍需用户复核，不能用零额作免费证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/billing-stream.js:63-68](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/billing-stream.js#L63-L68)

只捕获出现的 usage。

```text
          const chunk = result.value
          if (chunk !== null && chunk !== undefined && chunk.type === 'usage' && chunk.usage != null) {
            usage = chunk.usage
            proxy?.observe(usage)
          }
          yield chunk
```

**依据 2 · 源码核查**：[lib/billing-stream.js:85-90](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/billing-stream.js#L85-L90)

只有捕获 usage 且未被 bridge 覆盖才调用 account。

```text
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
```

**依据 3 · 源码核查**：[lib/usage-dedup.js:19-27](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/usage-dedup.js#L19-L27)

十秒窗口及等量包装调用的取舍。

```text
 * 代价:同会话同模型五桶逐位相同、间隔小于窗口的两次包装链调用会被合并为
 * 一次(流式 usage 含缓存读数,逐位相同概率可忽略;#48/#70 的观察也证实
 * 转发对恰是逐位相同)。窗口过期后照常入账。
 */

import { isWrapperProviderId, wrapperUpstreamProvider } from './pricing.js'

/** 与投影折叠(lib/index.js)/历史回放(lib/backfill.js)共用的窗口宽度。 */
export const USAGE_DEDUP_WINDOW_MS = 10_000
```

**依据 4 · 源码核查**：[lib/usage-dedup.js:92-111](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/usage-dedup.js#L92-L111)

按会话、provider、模型和五桶判定。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/store.js:2403-2419](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2403-L2419)

未定价情况下的价格处理。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 供应商计费来源与本地观察之间的缺口未量化
  **影响**：零额或空记录不能证明免费
  **进一步探讨**：比较无 usage、未知模型和等量独立请求与供应商账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Plan 等值、API 现金和预算是否相同？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

lib/store.js:2418-2425 根据价格形成 cost，再将分类为 API 的金额记入 apiCost，而 Plan 调用的 cost 为等值、apiCost 为零；分类依赖当前配置与模型/供应商映射，不是供应商结算证明。README.md:75-85 把预算描述为使用进度及告警；本轮所查的流监听链只观察并入账，未见以预算条件拒绝调用，不能把界面达到 100% 当硬限额保证。尚未逐个审查所有可选集成或实际账单，持续采用应以供应商额度和账单为核对依据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.js:2418-2425](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2418-L2425)

不同计费分类的 cost 与 apiCost。

```text
    const priced = requestFee ? requestFee.requests * requestFee.rateCny : resolved.priced ? costOf(tokens, entry, atMs, peak) : 0
    const cost = usdFromCost(priced, requestFee ? 'CNY' : resolved.currency, fxRatesOf(pricing).CNY)
    // Plan/API 双轨分类(issue #64):plan 类调用金额只记等值(cost),apiCost 记真金白银部分;
    // Plan 类调用同时进入 provider×小时聚合桶(供 5 小时滚动窗本地量聚合)。
    const planBilling = this.config.planBilling
    const enabledPlans = enabledPlanSetOf(this.config)
    const cls = requestFee ? 'api' : billingClassOf(provider, modelId, planBilling, enabledPlans, this.config.prices)
    const apiCost = cls === 'api' ? cost : 0
```

**依据 2 · 作者声明**：[README.md:75-85](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/README.md#L75-L85)

作者描述预算进度和历史。

<details>
<summary>查看原文（11行）</summary>

```text
| Today's cost | Sidebar bottom (above the settings button) | “Today ¥x”, hover for call count and token details |
| Budget box | Sidebar bottom (between the balance row and the settings button) | Rounded-square frame: budget, used %, progress bar, today's cost & share of budget, used/limit; ≥80% warning, ≥100% over-budget |
| Summary cards | Settings page | Today / this month / cumulative cost and call counts |
| External usage | Settings → Cost | [Read-only snapshots](docs/external-usage.md#english) from other processes on the same account; per-source tokens/calls/cost and recent days, plus DSH + external daily/monthly/all-time totals. Fresh external cost for today joins official balance reconciliation. |
| Token usage stats | Settings page (Cost section) | All-time token totals (input/cache/output/calls) + a Codex-style 26-week daily usage heat grid that fills the settings width; hover a cell for that day's detail |
| Token Plan usage stats | Settings page (Usage) | Per enabled coding plan (incl. Go): per-1% quota and full-window token / equivalent-cost estimates for the current windows (sample delta / live ratio), plus daily/weekly/monthly usage curves; plan-channel amounts are equivalent-only and never touch real money (issue #64) |
| Today's sessions | Settings page | Per-session call count, input/cache/output tokens and cost |
| History | Settings page | Per-day totals; retention days configurable (default 180) |
| Pre-install history import | Automatic on first launch | After install/upgrade, the first launch automatically replays all host session logs to import conversations from before the plugin was installed (missing dates are rebuilt whole; existing dates only gain previously unknown sessions; idempotent and never double-counts live metering; costs priced at per-event historical rates); a manual re-run entry remains in Settings |
| Budget settings | Settings page, top | Limit, period (today / month / cumulative / custom date range), used % |
| Price table | Settings page | Per-model off-peak / peak prices (input/output shorthand supported; cache prices derived automatically); fully editable |
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3816-3833](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/index.js#L3816-L3833)

所查流观察链记录用量，不以预算门禁检查。

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

#### 缺口

- 未全面审计所有可选集成和供应商账单
  **影响**：不能保证限额或财务准确性
  **进一步探讨**：按实际 Plan 和 API 账单对照分类与额度。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 存储、凭据、网络和构建有哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

package.json:1-25 声明包入口和 web 客户端，兼容范围见 26-39；实际可用依赖宿主与其 LLM 流能提供 usage。lib/store.js:2274-2275 在 DSH_HOME 下打开本地 ledger.json，lib/store.js:2610-2651 的写入任务可出现排队、锁竞争和回退。自定义余额为可选联网功能，lib/custom-balance.js:63-81 优先从宿主凭据服务解析 header 占位符，失败时从环境变量回退；这不证明外部端点安全或供应商接口可用。价格配置、账本备份、密钥权限、网络访问和供应商变更均带来维护负担；实际金额、人时及恢复成功率未知。

材料索引的客户端解析错误不能直接当成程序语法失败：scripts/build.mjs:2-8、41-62 明确将按顺序排列的片段连接后构建。测试文件的其他解析错误仍需单独定位，本轮不运行目标代码或构建。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/package.json#L1-L25)

包入口与客户端声明。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-cost-meter",
  "version": "1.9.47",
  "description": "DeepSeek Harness 会话费用统计插件:本会话成本、当日费用、历史记录与官方价格同步,支持多厂商多模型价格计费(内置 170+ 模型 ID 价格目录与自动匹配)、主流 Coding Plan 订阅额度查询与显示(16 家,含 WorkBuddy 官方积分、OpenDesign 工作区查询、含小米 MiMo Token Plan 控制台 Cookie 查询、SCNet Token Plan 本地 Credits 计量与火山方舟 Volcano Ark Coding Plan AK/SK 签名查询)、自定义 Provider 余额查询(可配任意 HTTP 端点)与余额进度条、峰谷计价时段显示与切换前弹窗/系统通知提醒(位置/提前量/类型可配),界面中英双语。Session cost tracking plugin for DeepSeek Harness: per-conversation cost, daily totals, history and official price sync, with multi-vendor model pricing (built-in 170+ model-ID catalog with auto-matching), Coding Plan quota queries & display for 16 vendors (incl. WorkBuddy official credits, OpenDesign workspace queries, Xiaomi MiMo Token Plan via console cookie, local credits metering for the SCNet Token Plan and Volcano Ark Coding Plan via AK/SK signature), plan/API dual-track billing with per-1% & full-window Token Plan usage estimates, custom provider balance lookup (configurable HTTP endpoint) and balance progress bar, plus peak/off-peak pricing display with pre-switch popup & system-notification alerts (position / lead time / type configurable), in a bilingual (Chinese/English) UI.",
  "type": "module",
  "main": "lib/bootstrap.js",
  "bin": {
    "dsh-cost-meter": "./lib/billing-storage-cli.js",
    "dsh-cost-meter-repair-sessions": "./lib/repair-sessions-cli.js"
  },
  "exports": {
    ".": {
      "default": "./lib/bootstrap.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./typert": {
      "default": "./lib/typert.host.js"
    },
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "dsh": {
    "bundle": {
```

</details>

**依据 2 · 源码核查**：[lib/store.js:2274-2275](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2274-L2275)

本地账本路径。

```text
    const root = join(resolveDshHome(), 'storages', 'cost-meter')
    const path = join(root, 'ledger.json')
```

**依据 3 · 源码核查**：[lib/store.js:2610-2631](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2610-L2631)

后台写入与失败处理。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/custom-balance.js:63-81](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/custom-balance.js#L63-L81)

凭据解析与环境变量回退。

<details>
<summary>查看原文（19行）</summary>

```text
async function resolveTemplateString(value, ctx) {
  const pattern = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g
  let out = value
  const names = [...value.matchAll(pattern)].map(match => match[1])
  for (const name of names) {
    let resolved = ''
    const credentials = ctx.get('credentials')
    if (credentials !== undefined) {
      try {
        const hit = await credentials.resolve(credentialRef(name))
        if (typeof hit?.value === 'string' && hit.value.length > 0) resolved = hit.value
      } catch {
        // fall through to env
      }
    }
    if (resolved.length === 0) resolved = String(process.env[name] ?? '').trim()
    // 函数替换而非字符串替换:resolved 是凭据/密钥,若含 $$、$&、$' 等
    // String.replace 特殊模式会被错误展开,密钥内容被破坏。
    out = out.replace(new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g'), () => resolved)
```

</details>

**依据 5 · 源码核查**：[scripts/build.mjs:2-8](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/scripts/build.mjs#L2-L8)

客户端片段拼接设计。

```text
// Build src/client/*.js -> lib/client.js (minified) for DSH STORE byte bounds.
//
// The browser client is a single __ModuleLoader__ factory closure, so it cannot be
// split into real ES modules: the human-readable source lives in src/client/ as
// ordered fragments whose filename sort order is program order (01 -> 02 -> 03).
// This script concatenates them and minifies the whole program with esbuild;
// lib/client.js stays the bounded runtime artifact committed to git. Reproducible
```

**依据 6 · 源码核查**：[scripts/build.mjs:41-62](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/scripts/build.mjs#L41-L62)

排序与拼接实现。

<details>
<summary>查看原文（22行）</summary>

```text
const ORDERED_FRAGMENT = /^\d{2}-[a-z0-9-]*\.js$/
const clientDir = resolve(projectRoot, 'src/client')
const fragments = readdirSync(clientDir).filter(name => name.endsWith('.js')).sort()
if (fragments.length === 0) {
  console.error('✗ src/client/ contains no .js source fragments')
  process.exit(1)
}
const unexpected = fragments.filter(name => !ORDERED_FRAGMENT.test(name))
if (unexpected.length > 0) {
  console.error(`✗ unexpected file(s) in src/client/ (must match NN-name.js so sort order stays program order): ${unexpected.join(', ')}`)
  process.exit(1)
}
for (const name of fragments) {
  // 与 DSH STORE 审核同口径:UTF-8 字节,中文文案算多字节。
  const bytes = Buffer.byteLength(readFileSync(resolve(clientDir, name), 'utf8'), 'utf8')
  if (bytes > 262144) {
    console.error(`✗ src/client/${name} exceeds 262144 bytes (${bytes}) — split the fragment`)
    process.exit(1)
  }
}

let src = fragments.map(name => readFileSync(resolve(clientDir, name), 'utf8')).join('')
```

</details>

#### 缺口

- 其他解析错误及实际供应商配置未全部核查
  **影响**：材料解析失败不能直接等同构建失败，也不能声称全部兼容
  **进一步探讨**：定向检查剩余解析位置，在授权隔离宿主验证构建和依赖。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户值得试用、何时停止依赖？

**研究主题**：采用判断、贡献与相对优势

#### 完整回答

需要比较多会话用量、并愿意定期与供应商账单核对的 DSH 用户，可先用几笔已知价格与 usage 的调用比较本地记录，另测取消、无 usage、相同五桶包装调用及未知模型。若记录明显少于供应商账单、价格无法确认或分类不符，应停止以该总额作费用依据，保留账本并回到供应商账单和宿主日志。该建议是源码支持的有限试用，不声称真实准确率或节省金额。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3816-3833](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/index.js#L3816-L3833)

会话归因接线。

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

**依据 2 · 源码核查**：[lib/usage-dedup.js:92-111](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/usage-dedup.js#L92-L111)

值去重条件。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/store.js:2403-2425](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/store.js#L2403-L2425)

未知价格及现金与订阅区分。

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

#### 缺口

- 真实账单对照与采集完整性未知
  **影响**：无法承诺账单准确或节省费用
  **进一步探讨**：先核对几笔调用、取消及缺价格记录，发现偏差回退供应商账单。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可否用调用收据区分转发与等量独立请求？

**研究主题**：新假设与验证

#### 完整回答

基于 lib/usage-dedup.js:92-111 的五桶值窗口与 lib/billing-stream.js:86-89 的缺 usage 分支，可以提出未验证假设：沿包装层保留上游稳定 request ID、父子调用关系与尝试号，并显式标识缺 usage／未知价格，可区分等量独立调用和同一请求的转发。它要求供应商和宿主可靠传递 ID，可能增加存储与集成成本。用等量独立调用、重复转发、取消、重试、缺 usage 五类数据比较当前方法与收据法的漏记、重复及人工对账时间；若 ID 不稳定、映射不能跨包装层传递或成本大于收益，应放弃。尚无原型和试验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage-dedup.js:92-111](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/usage-dedup.js#L92-L111)

按数值和时间窗口去重。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/billing-stream.js:85-90](https://github.com/Han-1413141/dsh-cost-meter/blob/2b682d92e4cf736b31f893f02303d56736cb74cf/lib/billing-stream.js#L85-L90)

缺 usage 无普通入账。

```text
        release?.()
        const covered = proxy ? await proxy.finish(usage) : false
        if (usage !== null && !covered) {
          try {
            account(usage, options?.model, options?.sessionId, startedAtMs, options?.provider)
          } catch (error) {
```

#### 缺口

- 缺少稳定 ID 与原型试验
  **影响**：假设未验证
  **进一步探讨**：按独立调用、转发、缺 usage 和重试对比漏计和人工工作。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
