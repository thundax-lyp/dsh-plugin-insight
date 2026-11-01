# dsh-cost

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e579772](https://github.com/Arun1016/dsh-cost/tree/e579772856f1d7973031842ce4a992befb2afcc7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arun1016/dsh-cost) [![npm 30d 806](https://img.shields.io/static/v1?label=npm+30d&message=806&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-pill) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cost-pill)
<!-- END META -->

> **功能**：在 DSH 显示余额和按会话日志估算的模型与网页调用费用。

> **亮点**：将会话分项成本与余额放到宿主界面，支持子代理汇总。[Q01](#research-q01)

> **主要限制**：不可读子会话会被跳过，默认模型及静态价格可能使总额偏离账单。[Q03](#research-q03)

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
  - [Q01 · 费用胶囊适合谁，相比账单页面有何区别？](#detail-section-11)
  - [Q02 · 网页请求如何计价和避免重复结果？](#detail-section-12)
  - [Q03 · 子代理数量和总额是否保证完整？](#detail-section-13)
  - [Q04 · 余额与估算需要什么，怎样验证？](#detail-section-14)
  - [Q05 · 已有子代理数量之外，如何让用户判断估算覆盖率？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在会话旁观察费用的 DSH 用户；基线是手工查供应商账单与日志。[Q01](#research-q01)

登录供应商账单页面并手工比较会话用量。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 费用 | 会话及子代理估算 | 日志可能缺失 |
| 网页 | 统计成功搜索与抓取 | 依赖日志内容 |
| 余额 | 查询账户余额 | 需要凭据和网络 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH webServer 与会话日志 | 估算必需 | 记录与界面 | 查供应商账单 |
| API 凭据和网络 | 余额需要 | 查询账户 | 余额未知 |
| 当前费率和假日 | 准确估算需要 | 成本折算 | 对照账单 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对插件版本和费率 | 过期则不依赖估算 |
| 试用 | 运行小额会话并观察分项 | 缺日志或余额标未知 |
| 对账 | 比较供应商账单及子会话 | 金额不一致回账单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及可能的 API 请求 | 配置并核对费率 | 账单口径未测 |
| 持续 | 会话与网页调用本身收费 | 监控并对账 | 实际金额未知 |
| 恢复 | 无额外费用保证 | 补查子会话 | 日志可能不可读 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 估算 | 日志折叠与子会话尝试 | 完整账单准确度 |
| 余额 | 凭据查询路径 | 实时账号可用性 |

> **思考**：不可读子会话会被跳过，默认模型及静态价格可能使总额偏离账单。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将会话分项成本与余额放到宿主界面，支持子代理汇总。[Q01](#research-q01)

网页调用关联首个结果去重；子会话不可读时跳过且无可用模型使用默认费率。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

不可读子会话会被跳过，默认模型及静态价格可能使总额偏离账单。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用小额已知样例核对分项和供应商账单，遗漏或费率过期时回到账单。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持日志折叠和缺失子会话处理；未对照账户账单。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 15 文件、5 排除、零解析错误；静态核查日志和费用口径，未运行云账号。
- 下一步：固定插件、宿主和计费表，对照完整及缺失子会话的实际账单。

**分析版本**

- **仓库**：[Arun1016/dsh-cost](https://github.com/Arun1016/dsh-cost)
- **版本号**：1.3.1（[固定提交 e579772](https://github.com/Arun1016/dsh-cost/tree/e579772856f1d7973031842ce4a992befb2afcc7)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：展示成功计价、不可读及默认费率的覆盖情况可减少把估算当完整账单的误判。[Q05](#research-q05)

固定插件、宿主和计费表，对照完整及缺失子会话的实际账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1616 | 1341 | 323 | — |
| .md | source | 3 | 336 | — | — | 5953 |
| .tsx | source | 1 | 433 | 330 | 86 | — |
| .ts | source | 4 | 1211 | 696 | 429 | — |
| .ts | test | 1 | 571 | 489 | 39 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arun1016/dsh-cost/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Arun1016/dsh-cost/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话费用如何根据日志估算，余额、子会话遗漏与账单有哪些区别？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 费用胶囊适合谁，相比账单页面有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 会话中观察用量和余额的用户可查看按 token 桶、模型与网页调用分解的估算；作者称也合并派生子代理。相对事后查账户账单，它贴近会话，但内置费率、日志覆盖及计量口径可能与账单不同，不能代替对账或预算控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-5](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/README.zh.md#L1-L5)

作者描述胶囊和余额凭据。

```text
# dsh-cost

DeepSeek Harness 的**账户余额及费用统计**胶囊。它在会话输入框下方的官方统计行右侧新增一枚胶囊，集成三样信息：计费时段（高峰 / 低谷，用颜色区分）、账户余额、本次会话费用；点击展开可查看本次会话的详细费用统计——缓存命中输入、缓存未命中输入、输出三项金额，按模型拆分的花费，本会话网页搜索与网页抓取的成功调用次数和调用费（2026-11-01 起按次计费），以及由本会话派生的子代理会话（含多级）的 token 与网页调用费用。费用部分不需要任何凭据；余额部分需要一个 DeepSeek API key。

> 社区插件，与 DeepSeek 官方无隶属关系，也不由官方随包分发。
```

**依据 2 · 作者声明**：[README.zh.md:15-20](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/README.zh.md#L15-L20)

作者描述分项、子代理及内置费率。

```text
- **统计行最右侧的胶囊**：以 `order: 2` 注册到 `conversation.composer.dock`，排在官方两颗统计胶囊（`activity` = 0、`usage` = 1）之后。时段显示为「高峰」或「低谷」，并用红 / 绿圆点区分。
- **明细弹窗**：显示计费时段、账户余额、本次会话费用，以及按三项拆分的金额——缓存命中输入、缓存未命中输入（含缓存写入）、输出；宿主能按模型折算时，还会列出各模型的费用；会话发生过网页搜索 / 抓取时，再列出两者的成功调用次数与调用费。子代理费用不单列，直接并入上述所有金额；有子代理时“本会话费用”标注为“（含子代理）”，下方另有一行小字注明含几个子代理会话。
- **子代理费用并入本会话**：按会话头部的 `origin: subagent` 血缘找到本会话派生的全部后代子代理（含子代理再派生的子代理），把它们的 token 用量与网页调用费分别并入既有统计字段（总额、三项 token 拆分、网页调用行、按模型拆分）；用户手动 fork 出来的会话是独立对话，不计入。仍在运行的子代理直接读内存日志，已结束的通过会话查询服务读持久化日志（带缓存）。
- **与官方一致的计费口径**：内置 2026-09-10 降价与 pro→flash 路由。会话处于挂载状态时逐请求折算，跨越降价、路由切换或高峰边界的用量各自沿用当时的价目表，不会混用两套费率。网页搜索 / 抓取的调用费按官方 2026-10-17 公告计入：每 1,000 次成功请求 5 元（每次 0.005 元），失败、无结果、超时不收费，自北京时间 2026-11-01 00:00 起对 DeepSeek Harness 的服务端工具调用计费；插件按调用落地时刻折算，免费期内的调用显示为「免费」。
- **高峰 / 低谷判定**：工作日 `9:00–12:00`、`14:00–18:00` 为高峰；其余时间、周末与法定节假日全天为低谷（含调休成为工作日的周末）。内建的 2026 年法定节假日表可通过 `Config.holidays` 替换。
- **费率跟随官方调价**：费率表内置于插件，随插件版本更新以跟随官方调价。
```

#### 缺口

- 未运行 DSH、账户余额或供应商账单对照
  **影响**：不能证明费率现行、金额完整或余额可用
  **进一步探讨**：固定版本与账号，对照官方账单、跨费率及不可读子会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 网页请求如何计价和避免重复结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

日志按 callId 收集搜索与抓取调用及首个结果，后续结果替换忽略；无结果或错误不计，搜索按解析出的查询数计算，抓取按一次计算，并按结果时点选择内置价格。这依赖日志文本和语义与服务商口径一致，不是实时账单；缺失调用或结果也不会被计入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:403-415](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L403-L415)

折叠规则及首个结果设计。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Fold the successful Search and Fetch requests in one session log. One
 * `web_search` tool call issues one Search API request per distinct query; a
 * search that returned no results produced no billable request, and a failed
 * tool call bills nothing. One `web_fetch` call issues one Fetch API request
 * and bills when the page came back. Each request is priced at its own result
 * moment, so a session spanning the 2026-11-01 billing start bills only its
 * later calls.
 *
 * The log is append-only and may carry several results for one call when the
 * tool-result pruner replaces content later; the first result carries the
 * request's real outcome and moment, so every call is counted at most once and
 * a replacement never adds a fee.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:419-466](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L419-L466)

调用、结果关联和成功计费。

<details>
<summary>查看原文（48行）</summary>

```text
function foldWebCostEvents(events: readonly WebLogEvent[]): SessionWebCost {
  const search: SessionWebApiCost = { calls: 0, amount: 0 }
  const fetch: SessionWebApiCost = { calls: 0, amount: 0 }
  const calls = new Map<string, WebToolCall>()
  const results = new Map<string, { message: { toolCallId: string; isError?: unknown; content?: unknown }; time: number }>()
  for (const event of events) {
    if (event.type === 'tool/call') {
      const data = event.data as { name?: unknown; callId?: unknown; arguments?: unknown }
      if (typeof data.name !== 'string' || typeof data.callId !== 'string') continue
      if (data.name !== WEB_SEARCH_TOOL && data.name !== WEB_FETCH_TOOL) continue
      calls.set(data.callId, {
        name: data.name,
        queries: data.name === WEB_SEARCH_TOOL ? webSearchQueries(data.arguments) : [],
      })
      continue
    }
    if (event.type !== 'tool/result') continue
    const message = (event.data as {
      message?: { toolCallId?: unknown; isError?: unknown; content?: unknown }
    }).message
    if (message === undefined || typeof message.toolCallId !== 'string') continue
    // A later replacement is content pruning, not a second request: keep the
    // first result's outcome and moment and ignore every replacement.
    if (results.has(message.toolCallId)) continue
    results.set(message.toolCallId, {
      message: message as { toolCallId: string; isError?: unknown; content?: unknown },
      time: event.time,
    })
  }
  for (const [callId, call] of calls) {
    const result = results.get(callId)
    if (result === undefined) continue
    // A failed tool call billed nothing: the provider dispatch failed, or the
    // call was cancelled before the request settled.
    if (result.message.isError === true) continue
    const price = webCallPriceYuan(result.time)
    if (call.name === WEB_FETCH_TOOL) {
      fetch.calls += 1
      fetch.amount += price
      continue
    }
    // The Search API bills only requests whose `results` array is non-empty;
    // the tool renders that case as the literal "No results found." marker.
    if (toolResultText(result.message).includes('No results found.')) continue
    const requests = call.queries.length
    if (requests === 0) continue
    search.calls += requests
    search.amount += requests * price
```

</details>

#### 缺口

- 未运行 DSH、账户余额或供应商账单对照
  **影响**：不能证明费率现行、金额完整或余额可用
  **进一步探讨**：固定版本与账号，对照官方账单、跨费率及不可读子会话

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 子代理数量和总额是否保证完整？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不保证。代码收集后代，读取活跃会话或缓存/持久日志，缺 query 或读取失败会跳过；计数是发现的后代，不能等同成功计价的数量。没有可用模型时使用 Flash 兜底，内置假日和费率还需后续更新，因此金额可能低估或套错价格；请以供应商账单为准。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:108-112](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L108-L112)

缺模型时兜底。

```text
/** The model id the official docs now use for the whole flash family. */
const FLASH_MODEL = 'deepseek-flash'

/** The model id whose rates price a session that reports no usable model. */
const FALLBACK_MODEL = FLASH_MODEL
```

**依据 2 · 源码核查**：[src/index.ts:972-1016](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L972-L1016)

后代读取及跳过不可用日志。

<details>
<summary>查看原文（45行）</summary>

```text
/**
 * Fold the cost of every descendant subagent session. Live sessions are read
 * from the store; closed ones through the session-query service, with a small
 * cache because a closed log never changes. One unreadable child log is
 * skipped rather than failing the whole pill.
 * @param ctx - host context.
 * @param root - the session whose pill is being priced.
 * @param holidays - statutory-holiday date keys billed off-peak all day.
 * @returns the priced children and how many descendant sessions were found.
 */
async function subagentCosts(
  ctx: Context,
  root: Session,
  holidays: ReadonlySet<string>,
): Promise<{ costs: SessionCost[]; sessions: number }> {
  const records = await subagentRecords(ctx, root)
  const store = sessionStore(ctx)
  const query = sessionQuery(ctx)
  const costs: SessionCost[] = []
  for (const record of records) {
    if (record.live && store !== undefined) {
      const live = store.get(record.id as never)
      if (live !== undefined) {
        const cost = foldSessionCost(live, holidays)
        if (cost !== undefined) {
          rememberSubagentCost(record.id, cost)
          costs.push(cost)
        }
        continue
      }
    }
    const cached = subagentCostCache.get(record.id)
    if (cached !== undefined) {
      costs.push(cached)
      continue
    }
    if (query === undefined) continue
    try {
      const log = await query.readSession(record.id as never)
      const cost = foldSessionLogCost({ events: log.events, inheritedEventCount: log.inheritedEventCount }, holidays)
      if (cost !== undefined) {
        rememberSubagentCost(record.id, cost)
        costs.push(cost)
      }
    } catch {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:32-40](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L32-L40)

年度节假日配置与维护。

```text
/**
 * Statutory-holiday dates (Beijing local calendar, `YYYY-MM-DD`) that bill at
 * off-peak rates for the whole day. The official rule makes every statutory
 * holiday and every weekend off-peak regardless of the clock, including a
 * weekend that holiday adjustment turns into a workday. Dates come from the
 * State Council's annual notice (国办发明电〔2025〕7号 for 2026); a deployment
 * overrides them through Config when the next year is published.
 */
const DEFAULT_HOLIDAYS = [
```

#### 缺口

- 未运行 DSH、账户余额或供应商账单对照
  **影响**：不能证明费率现行、金额完整或余额可用
  **进一步探讨**：固定版本与账号，对照官方账单、跨费率及不可读子会话

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 余额与估算需要什么，怎样验证？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

宿主 webServer 和会话用量/日志支持费用估算，余额还需凭据和网络；作者说明无 key 仍可看费用。先固定插件与宿主、核对价格表和时区，以小样例比较单会话、子代理和网页调用与真实账单；凭据不可用或记录缺失时标为未知，不把零当无消费。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:27-30](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L27-L30)

Host webServer 依赖。

```text
export const name = 'cost-stats'

/** Services required before the balance route can register. */
export const inject = ['webServer']
```

**依据 2 · 源码核查**：[src/index.ts:826-831](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L826-L831)

凭据服务解析。

```text
/** Resolve the DeepSeek API key through the credentials seam, or the environment. */
async function resolveApiKey(ctx: Context): Promise<string | undefined> {
  const ref = credentialRef(API_KEY_ENV)
  const credentials = ctx.get('credentials')
  if (credentials !== undefined) {
    const hit = await credentials.resolve(ref)
```

**依据 3 · 作者声明**：[README.zh.md:18-22](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/README.zh.md#L18-L22)

作者描述费率更新与余额依赖。

```text
- **与官方一致的计费口径**：内置 2026-09-10 降价与 pro→flash 路由。会话处于挂载状态时逐请求折算，跨越降价、路由切换或高峰边界的用量各自沿用当时的价目表，不会混用两套费率。网页搜索 / 抓取的调用费按官方 2026-10-17 公告计入：每 1,000 次成功请求 5 元（每次 0.005 元），失败、无结果、超时不收费，自北京时间 2026-11-01 00:00 起对 DeepSeek Harness 的服务端工具调用计费；插件按调用落地时刻折算，免费期内的调用显示为「免费」。
- **高峰 / 低谷判定**：工作日 `9:00–12:00`、`14:00–18:00` 为高峰；其余时间、周末与法定节假日全天为低谷（含调休成为工作日的周末）。内建的 2026 年法定节假日表可通过 `Config.holidays` 替换。
- **费率跟随官方调价**：费率表内置于插件，随插件版本更新以跟随官方调价。
- **没有 API key 也能用**：只用 DeepSeek 账户登录的用户照样能看到计费时段与会话费用，只是不显示余额。
- **不保存凭据**：API key 通过 dsh 的凭据服务（credentials seam）解析，只在进程内使用，不写入磁盘。
```

**依据 4 · 源码核查**：[src/index.ts:972-1016](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L972-L1016)

子会话日志不可用可跳过。

<details>
<summary>查看原文（45行）</summary>

```text
/**
 * Fold the cost of every descendant subagent session. Live sessions are read
 * from the store; closed ones through the session-query service, with a small
 * cache because a closed log never changes. One unreadable child log is
 * skipped rather than failing the whole pill.
 * @param ctx - host context.
 * @param root - the session whose pill is being priced.
 * @param holidays - statutory-holiday date keys billed off-peak all day.
 * @returns the priced children and how many descendant sessions were found.
 */
async function subagentCosts(
  ctx: Context,
  root: Session,
  holidays: ReadonlySet<string>,
): Promise<{ costs: SessionCost[]; sessions: number }> {
  const records = await subagentRecords(ctx, root)
  const store = sessionStore(ctx)
  const query = sessionQuery(ctx)
  const costs: SessionCost[] = []
  for (const record of records) {
    if (record.live && store !== undefined) {
      const live = store.get(record.id as never)
      if (live !== undefined) {
        const cost = foldSessionCost(live, holidays)
        if (cost !== undefined) {
          rememberSubagentCost(record.id, cost)
          costs.push(cost)
        }
        continue
      }
    }
    const cached = subagentCostCache.get(record.id)
    if (cached !== undefined) {
      costs.push(cached)
      continue
    }
    if (query === undefined) continue
    try {
      const log = await query.readSession(record.id as never)
      const cost = foldSessionLogCost({ events: log.events, inheritedEventCount: log.inheritedEventCount }, holidays)
      if (cost !== undefined) {
        rememberSubagentCost(record.id, cost)
        costs.push(cost)
      }
    } catch {
```

</details>

#### 缺口

- 未运行 DSH、账户余额或供应商账单对照
  **影响**：不能证明费率现行、金额完整或余额可用
  **进一步探讨**：固定版本与账号，对照官方账单、跨费率及不可读子会话

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有子代理数量之外，如何让用户判断估算覆盖率？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：显示发现、成功计价、不可读和使用默认模型费率的数量，并把总额标记为不完整，可能减少用户将低估值当账单。当前已发现后代数、跳过不可读日志并按默认模型计价，不能把子代理支持当新功能；未穷尽其他等价提示。以完整、缺日志及未知模型样本对照实际账单，测低估识别率、误报和额外开销；无改善或误导增加则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:108-112](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L108-L112)

已有模型默认费率。

```text
/** The model id the official docs now use for the whole flash family. */
const FLASH_MODEL = 'deepseek-flash'

/** The model id whose rates price a session that reports no usable model. */
const FALLBACK_MODEL = FLASH_MODEL
```

**依据 2 · 源码核查**：[src/index.ts:972-1016](https://github.com/Arun1016/dsh-cost/blob/e579772856f1d7973031842ce4a992befb2afcc7/src/index.ts#L972-L1016)

已有后代发现及跳过。

<details>
<summary>查看原文（45行）</summary>

```text
/**
 * Fold the cost of every descendant subagent session. Live sessions are read
 * from the store; closed ones through the session-query service, with a small
 * cache because a closed log never changes. One unreadable child log is
 * skipped rather than failing the whole pill.
 * @param ctx - host context.
 * @param root - the session whose pill is being priced.
 * @param holidays - statutory-holiday date keys billed off-peak all day.
 * @returns the priced children and how many descendant sessions were found.
 */
async function subagentCosts(
  ctx: Context,
  root: Session,
  holidays: ReadonlySet<string>,
): Promise<{ costs: SessionCost[]; sessions: number }> {
  const records = await subagentRecords(ctx, root)
  const store = sessionStore(ctx)
  const query = sessionQuery(ctx)
  const costs: SessionCost[] = []
  for (const record of records) {
    if (record.live && store !== undefined) {
      const live = store.get(record.id as never)
      if (live !== undefined) {
        const cost = foldSessionCost(live, holidays)
        if (cost !== undefined) {
          rememberSubagentCost(record.id, cost)
          costs.push(cost)
        }
        continue
      }
    }
    const cached = subagentCostCache.get(record.id)
    if (cached !== undefined) {
      costs.push(cached)
      continue
    }
    if (query === undefined) continue
    try {
      const log = await query.readSession(record.id as never)
      const cost = foldSessionLogCost({ events: log.events, inheritedEventCount: log.inheritedEventCount }, holidays)
      if (cost !== undefined) {
        rememberSubagentCost(record.id, cost)
        costs.push(cost)
      }
    } catch {
```

</details>

#### 缺口

- 未运行 DSH、账户余额或供应商账单对照
  **影响**：不能证明费率现行、金额完整或余额可用
  **进一步探讨**：固定版本与账号，对照官方账单、跨费率及不可读子会话

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
