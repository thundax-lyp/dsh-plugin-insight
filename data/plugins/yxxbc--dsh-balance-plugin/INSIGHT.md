# dsh-balance-plugin（yxxbc）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d65fba4](https://github.com/yxxbc/dsh-balance-plugin/tree/d65fba4d7b468ec92a90375f9f2a2780113e4052)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yxxbc/dsh-balance-plugin)
<!-- END META -->

> **功能**：在 DSH 中查询 DeepSeek 多账户余额、显示低余额提醒和本机会话用量，并提供插件管理入口。

> **亮点**：余额查询、低余额阈值和DSH用量上下文集中在一个工作界面，相对切换供应商页面有具体便利；用量页面归属明确借鉴Miyu，节时效果未测。[Q01](#research-q01)

> **主要限制**：明文key写入配置且写错静默，插件管理参数拼接shell与删除后安装又扩大副作用；这使只想看余额的用户承担额外凭据与恢复负担。[Q03](#research-q03)

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
  - [Q01 · 余额与用量放在DSH界面增加什么？](#detail-section-11)
  - [Q02 · 自动凭据、轮询和界面查询如何接通？](#detail-section-12)
  - [Q03 · 配置、统计和插件管理有哪些会影响采用的边界？](#detail-section-13)
  - [Q04 · 是否值得采用，什么改进可被检验？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DeepSeek API用户可在DSH内查看多账户币种余额和阈值提醒，仍以供应商页面为账单依据。[Q01](#research-q01)

供应商官方余额页无需本地插件保存账号配置；本组件增加就地查看和阈值，但引入轮询及额外管理权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 余额与低余额提示 | 读取每账户币种余额 | 需DeepSeek凭据和接口；不控制支出 |
| query_api_quota | 在会话中取余额摘要 | 并发轮询时可能返回旧结果 |
| 本机用量视图 | 按事件字段汇总token与性能 | 历史扫描范围有限，不等于账单 |
| 配置保存 | 重启恢复账户和阈值 | key明文写插件目录，写错被吞 |
| 插件管理 | 调用dsh安装/卸载/更新 | shell参数边界与恢复未核清 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| timer/webServer/clientModules/credentials | 声明必需 | 轮询、路由与凭据 | 不能假定加载 |
| DeepSeek API凭据和网络 | 余额查询必需 | GET余额 | 返回逐账户错误 |
| sessionQuery与会话事件 | 完整本机统计条件 | 历史和实时用量 | 历史缺失或范围受限 |
| shell服务与dsh命令 | 管理操作必需 | 安装卸载和更新 | 不应给纯余额任务默认授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定GitHub来源并核对配置权限 | 避免同名npm包，保护备份 |
| 加载 | 宿主加载配置并启动interval | 核查实际服务、插槽和工具 |
| 查询 | 插件轮询账户并展示币种与时间 | 错误/旧结果须可辨认 |
| 恢复 | 用户遇异常回官方页面核对 | 管理更新失败人工恢复，不盲目重复删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载和宿主资源未知 | 来源及文件权限核对 | 无兼容版本范围保证 |
| 持续使用 | 轮询网络、统计与模型费用未知 | 管理key、查看时间和覆盖 | 用量不等于账单 |
| 失败恢复 | 重试API或安装资源未知 | 修复配置、恢复删除后安装失败 | 写盘错误静默，无事务回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 余额监控 | 固定URL和币种阈值逻辑 | 在线可用及实时准确性 |
| 用量汇总 | 事件字段累计与历史扫描 | 跨会话完整性和账单一致性 |
| 插件管理 | shell安装卸载链路 | 访问保护与更新恢复 |

> **思考**：明文key写入配置且写错静默，插件管理参数拼接shell与删除后安装又扩大副作用；这使只想看余额的用户承担额外凭据与恢复负担。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：余额查询、低余额阈值和DSH用量上下文集中在一个工作界面，相对切换供应商页面有具体便利；用量页面归属明确借鉴Miyu，节时效果未测。[Q01](#research-q01)

轮询互斥和逐账户错误能避免并行重复轮询并保留失败边界；但外部signal覆盖局部超时、明文保存、历史覆盖与附带shell管理需要定向复核。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

明文key写入配置且写错静默，插件管理参数拼接shell与删除后安装又扩大副作用；这使只想看余额的用户承担额外凭据与恢复负担。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并核清凭据文件和HTTP管理权限，保持官方页面及原生管理为退路；不要用本地统计作为账单。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

余额轮询和事件汇总有源码依据；在线服务、宿主兼容与保护边界未验证，不把余额显示当消费控制；分权设计为假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定Host与Client入口、余额链、配置写入、历史扫描与管理路由；未运行目标或外部API，不声称安全审计或账单准确。
- 下一步：固定宿主核对路由认证、文件权限和客户端接线，再比较官方余额与带时间的结果；更新失败恢复须单独演练。

**分析版本**

- **仓库**：[yxxbc/dsh-balance-plugin](https://github.com/yxxbc/dsh-balance-plugin)
- **版本号**：1.3.0（[固定提交 d65fba4](https://github.com/yxxbc/dsh-balance-plugin/tree/d65fba4d7b468ec92a90375f9f2a2780113e4052)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把只读监控与包管理分权、保存凭据引用可能降低采用负担，但要以相同配置恢复任务核对权限和人工时间；这是未实现假设。[Q04](#research-q04)

固定宿主核对路由认证、文件权限和客户端接线，再比较官方余额与带时间的结果；更新失败恢复须单独演练。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 533 | — | — | 4040 |
| .js | source | 2 | 1966 | 1886 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yxxbc/dsh-balance-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/yxxbc/dsh-balance-plugin/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yxxbc/dsh-balance-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：余额监控的集成便利能否覆盖凭据持久化、统计范围和附带管理权限的负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 余额与用量放在DSH界面增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向使用DeepSeek API、需要在连续工作中留意不同币种余额的人。合格结果是看到每账户最近查询时间、币种余额、错误和低余额提示；不是自动控制消费或与账单精确对账。相对打开供应商页面，本组件把查询和阈值提醒放到DSH中，并从宿主事件汇总模型用量。README说明用量界面借鉴Miyu，不能把该界面设计归为原创。余额来自远端接口，用量来自本机事件，两者不是同一账本，不能用token汇总直接推断余额变化原因。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-29](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/README.md#L19-L29)

作者功能范围与Miyu归属。

<details>
<summary>查看原文（11行）</summary>

```text
| 模块 | 能力 |
| --- | --- |
| **余额监控** | 监控 DeepSeek API 余额（CNY / USD 双余额池），支持多账户并行查询；自动读取 DSH 凭据 `DEEPSEEK_API_KEY`，**无需手动填写** |
| **低余额告警** | CNY / USD 独立阈值（默认 ¥10 / $2，可配置），低于阈值时余额条标红提醒 |
| **一键充值** | 直达 DeepSeek 官方充值页 `platform.deepseek.com/top_up`，另有用量明细页入口 |
| **用量统计** | 1:1 复刻 [Miyu WebUI 用量页](https://github.com/SHORiN-KiWATA/Miyu/tree/main/web)：统计瓦片 / GitHub 贡献图风格用量日历 / 三段堆叠趋势柱状图 / 模型消耗环形图与明细表 / 最近 50 条调用记录 |
| **性能指标** | 轮次 · 步数 · LLM 时长 · 工具调用时长 · 首 token 平均延迟 · tok/s · 缓存命中率 |
| **三方插件管理** | 非官方（非 `@deepseek-ai`）Web 插件清单：包名 / 本地路径 / Bundle rev / 依赖，一键「打开目录」定位源码 |
| **模型工具** | 注册 `query_api_quota` 工具，直接问"DeepSeek 余额还剩多少"即可得到余额摘要 |
| **设置持久化** | 配置自动保存到插件目录 `config.json`，重启后自动恢复 |
| **一键更新** | 在 DSH 插件面板内直接检查更新并一键更新，无需手动操作 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:166-213](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L166-L213)

余额接口和币种阈值计算。

<details>
<summary>查看原文（48行）</summary>

```text
  async function fetchAccount(account, signal) {
    const base = { id: account.id, name: account.name }
    const auth = authHeaderFor(account.key)
    if (!auth.ok) return Object.assign({}, base, { ok: false, error: auth.error, balances: [], low: [] })
    let text = ''
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(BALANCE_URL, {
        method: 'GET',
        headers: { 'Authorization': auth.header, 'Accept': 'application/json' },
        signal: signal || controller.signal,
      })
      clearTimeout(timer)
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        const detail = body.slice(0, 300)
        return Object.assign({}, base, { ok: false, error: detail || 'HTTP ' + res.status, balances: [], low: [] })
      }
      text = await res.text()
    } catch (err) {
      return Object.assign({}, base, { ok: false, error: String(err && err.message || err).slice(0, 300), balances: [], low: [] })
    }
    let body = null
    try { body = JSON.parse(text) } catch (e) { /* fallthrough */ }
    if (!body || typeof body !== 'object') {
      return Object.assign({}, base, { ok: false, error: (text || '').slice(0, 300) || '无法解析响应', balances: [], low: [] })
    }
    const infos = Array.isArray(body.balance_infos) ? body.balance_infos : []
    if (!infos.length) {
      const message = parseErrorBody(text)
      return Object.assign({}, base, { ok: false, error: message || '响应中无余额信息', balances: [], low: [] })
    }
    const balances = infos.map((info) => ({
      currency: String(info.currency || ''),
      total: String(info.total_balance !== undefined && info.total_balance !== null ? info.total_balance : ''),
      granted: String(info.granted_balance !== undefined && info.granted_balance !== null ? info.granted_balance : ''),
      toppedUp: String(info.topped_up_balance !== undefined && info.topped_up_balance !== null ? info.topped_up_balance : ''),
    }))
    const low = []
    for (const balance of balances) {
      const total = parseFloat(balance.total)
      const threshold = balance.currency === 'CNY' ? state.thresholdCny : state.thresholdUsd
      if (Number.isFinite(total) && total < threshold) {
        low.push({ currency: balance.currency, total: balance.total, threshold: threshold })
      }
    }
    return Object.assign({}, base, { ok: true, error: null, balances: balances, low: low })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:340-368](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L340-L368)

用量来自assistant/message事件。

<details>
<summary>查看原文（29行）</summary>

```text
  function ingestEvent(sessionId, event) {
    const time = event.time
    const data = event.data || {}
    const live = usage.live
    if (event.type === 'assistant/message') {
      const usageInfo = data.usage
      if (usageInfo) {
        const model = data.message && data.message.source ? String(data.message.source.model || 'unknown') : 'unknown'
        const day = dayKeyOf(time)
        const agg = {
          requests: 1,
          input: usageInfo.inputTokens || 0,
          output: usageInfo.outputTokens || 0,
          cacheRead: usageInfo.cacheReadTokens || 0,
          tools: 0,
          turns: 0,
          steps: 0,
        }
        const dayAgg = usage.perDay.get(day) || emptyAgg()
        mergeAgg(dayAgg, agg)
        usage.perDay.set(day, dayAgg)
        let modelMap = usage.perModel.get(model)
        if (!modelMap) { modelMap = new Map(); usage.perModel.set(model, modelMap) }
        const modelAgg = modelMap.get(day) || emptyAgg()
        mergeAgg(modelAgg, agg)
        modelMap.set(day, modelAgg)
        live.outputTokens += usageInfo.outputTokens || 0
        usage.records.unshift({ time: time, sessionId: String(sessionId).slice(0, 8), model: model, input: agg.input + agg.cacheRead, output: agg.output, cacheRead: agg.cacheRead })
        if (usage.records.length > 50) usage.records.length = 50
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动凭据、轮询和界面查询如何接通？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply注入timer、webServer、clientModules、credentials，并软取可选shell、sessionQuery、tools。启动加载config后创建interval并立即pollAll；每次轮询先重新解析自动账户凭据，手工key账户不覆盖。configured账户并行请求固定DeepSeek余额URL，认证和HTTP错误变成逐账户错误；正常响应按币种提取余额并比较阈值。工具query_api_quota触发pollAll后读state.last，界面经/bmon/api路由读写配置。polling为真时pollAll直接返回，因此同时请求的工具可能读到上一轮结果，不能承诺每次都是新查询。服务可用性、限流及实际宿主注册尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5-17](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L5-L17)

必需服务和固定接口。

<details>
<summary>查看原文（13行）</summary>

```text
export const inject = ['timer', 'webServer', 'clientModules', 'credentials']

export function apply(ctx) {
  const shell = ctx.get('shell')
  const webServer = ctx.webServer
  const credentials = ctx.get('credentials')
  const clientModules = ctx.get('clientModules')
  const sessionQuery = ctx.get('sessionQuery')
  const tools = ctx.get('tools')

  const BALANCE_URL = 'https://api.deepseek.com/user/balance'
  const RECHARGE_URL = 'https://platform.deepseek.com/top_up'
  const USAGE_URL = 'https://platform.deepseek.com/usage'
```

</details>

**依据 2 · 源码核查**：[lib/index.js:216-246](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L216-L246)

凭据更新、轮询互斥和并行请求。

<details>
<summary>查看原文（31行）</summary>

```text
  // 每次轮询前重新解析自动账户的凭据：更换 DEEPSEEK_API_KEY 后无需重启。
  // 用户手动设置过 key 的账户（autoKey=false）不会被凭据文件覆盖。
  async function refreshAutoKeys() {
    if (!credentials) return
    for (const account of state.accounts) {
      if (!account.autoKey) continue
      try {
        const resolved = await credentials.resolve('DEEPSEEK_API_KEY')
        if (resolved && resolved.value && resolved.value !== account.key) {
          account.key = resolved.value
          account.autoSource = resolved.source || 'credentials'
          console.log('[余额监控] DEEPSEEK_API_KEY 已更新（来源：' + (resolved.source || 'credentials') + '）')
        }
      } catch (e) { /* 读取失败则保持上次的值 */ }
    }
  }

  async function pollAll(signal) {
    if (state.polling) return
    state.polling = true
    bump()
    try {
      await refreshAutoKeys()
      const configured = state.accounts.filter((account) => String(account.key || '').trim())
      if (!configured.length) {
        state.last = null
        state.pollError = null
        bump()
        return
      }
      const results = await Promise.all(configured.map((account) => fetchAccount(account, signal)))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:898-932](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L898-L932)

启动interval与工具查询。

<details>
<summary>查看原文（35行）</summary>

```text
  let stopInterval = null
  function restartInterval() {
    if (stopInterval) { stopInterval(); stopInterval = null }
    stopInterval = ctx.interval(() => { pollAll() }, state.intervalMs)
  }

  // 启动时加载持久化配置和插件版本号
  Promise.all([loadConfig(), loadPluginVersion()]).then(() => {
    restartInterval()
    // 加载配置后触发一次轮询
    pollAll().catch(() => {})
  }).catch(() => {
    restartInterval()
  })

  // ===== 模型工具：query_api_quota（tools 注册）=====
  if (tools) {
    tools.register({
      name: 'query_api_quota',
      description: '查询已配置的 DeepSeek API 账户余额（CNY/USD 双余额池），返回各账户总余额与低余额提醒，并提示官方充值入口。',
      parameters: {
        type: 'object',
        properties: {
          account: { type: 'string', description: '可选：账户名称，省略则查询全部账户。' },
        },
      },
      output: {
        schema: { type: 'object', additionalProperties: false, required: ['content'], properties: { content: { type: 'string' } } },
        render: (_args, value) => [{ type: 'text', text: String(value && value.content || '') }],
      },
      timeoutMs: 60000,
      async execute(args) {
        const selected = args && typeof args.account === 'string' ? args.account.trim() : ''
        await pollAll()
        if (!state.last) {
```

</details>

**依据 4 · 源码核查**：[lib/client.js:10-20](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/client.js#L10-L20)

客户端RPC请求。

<details>
<summary>查看原文（11行）</summary>

```text
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    var React = require('react');

    async function apiCall(name, args) {
      const res = await fetch('/bmon/api/' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args || {}),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return await res.json()
```

</details>

#### 缺口

- 宿主事件与客户端插槽实际兼容未运行核实。
  **影响**：界面和工具可能无法按预期注册。
  **进一步探讨**：固定目标宿主核对服务和插槽，并检查错误显示及最近更新时间。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置、统计和插件管理有哪些会影响采用的边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

saveConfig将每账户key直接写入插件目录config.json，异常被忽略；界面掩码不改变磁盘明文事实，自动凭据也可能随下一次保存被复制，需按本地凭据文件管理。历史扫描只读最多60个成功计数的会话，单会话失败跳过；实时事件与历史seq合并方式可能影响覆盖，不能当全账户账单。插件安装和卸载路由把pkg字符串直接拼进shell命令，缺少本地包名白名单或参数边界；HTTP层鉴权与shell策略由宿主承担，未核查。更新先rm再add，第二步失败没有回滚实现。以上是固定代码可见边界，不声称已利用或导致实际损失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:109-130](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L109-L130)

key明文序列化且写错被忽略。

<details>
<summary>查看原文（22行）</summary>

```text
  async function saveConfig() {
    const configPath = await getConfigPath()
    if (!configPath) return
    try {
      const fs = await import('fs')
      const data = {
        accounts: state.accounts.map((a) => ({
          id: a.id,
          name: a.name,
          key: a.key,
          auto: a.auto,
          autoKey: a.autoKey,
          autoSource: a.autoSource,
        })),
        thresholdCny: state.thresholdCny,
        thresholdUsd: state.thresholdUsd,
        intervalMs: state.intervalMs,
        showDock: state.showDock,
        nextAccountId: state.nextAccountId,
      }
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) { /* ignore */ }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:446-476](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L446-L476)

历史扫描边界和失败跳过。

<details>
<summary>查看原文（31行）</summary>

```text
  async function scanHistory() {
    if (!sessionQuery) {
      usage.ready = true
      bumpUsage()
      return
    }
    try {
      const sessions = await sessionQuery.listSessions()
      const cut = Date.now() - USAGE_KEEP_MS
      let scanned = 0
      for (const record of sessions) {
        if (!record || !record.header) continue
        const id = String(record.header.id || '')
        if (!id) continue
        try {
          const snapshot = await sessionQuery.readSession(id)
          const events = snapshot && Array.isArray(snapshot.events) ? snapshot.events : []
          const maxSeq = liveSeqs.get(id) || 0
          for (const event of events) {
            if (!event || typeof event.time !== 'number' || event.time < cut) continue
            if (typeof event.seq === 'number' && event.seq <= maxSeq) continue
            ingestEvent(id, event)
          }
          scanned += 1
        } catch (e) { /* 单会话读取失败则跳过 */ }
        if (scanned >= 60) break
      }
    } catch (e) {
      usage.error = String(e && e.message || e).slice(0, 300)
    }
    usage.ready = true
```

</details>

**依据 3 · 源码核查**：[lib/index.js:703-749](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L703-L749)

原始参数拼命令与删除后安装。

<details>
<summary>查看原文（47行）</summary>

```text
  registerRoute('install-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    try {
      const cmd = 'dsh plugin --profile ' + profile + ' add ' + pkg
      const spec = shell.resolve({ command: cmd, timeoutMs: 120000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '安装失败').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500) }
    } catch (e) {
      return { ok: false, error: String(e && e.message || e).slice(0, 300) }
    }
  })
  registerRoute('uninstall-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    try {
      const cmd = 'dsh plugin --profile ' + profile + ' rm ' + pkg
      const spec = shell.resolve({ command: cmd, timeoutMs: 60000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '卸载失败').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500) }
    } catch (e) {
      return { ok: false, error: String(e && e.message || e).slice(0, 300) }
    }
  })
  registerRoute('update-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    const githubSrc = 'github:yxxbc/dsh-balance-plugin'
    try {
      const rmCmd = 'dsh plugin --profile ' + profile + ' rm ' + pkg + ' 2>/dev/null || true'
      const rmResult = await shell.run(shell.resolve({ command: rmCmd, timeoutMs: 30000 }))
      const addCmd = 'UPDATE=1 dsh plugin --profile ' + profile + ' add ' + githubSrc
      const spec = shell.resolve({ command: addCmd, timeoutMs: 120000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '更新失败').slice(0, 500), output: (out || err || '').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500), error: '' }
```

</details>

#### 缺口

- HTTP宿主鉴权、shell执行策略和插件目录权限未核查。
  **影响**：不能确认管理路由的访问边界及明文配置保护程度。
  **进一步探讨**：固定部署检查路由权限与文件ACL，在没有保护证明前不启用重要凭据或管理操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 是否值得采用，什么改进可被检验？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

余额API轮询、通知上下文和统计图有网络/CPU成本，模型本身仍按所用服务计费，金额与耗时未知。用户首次需核对GitHub来源，因为README明确npm同名包属于他人；持续需管理明文配置、核对统计覆盖和过期结果，更新失败需手工恢复。当前建议观察，用供应商官方页面作为余额与账单退路，未核清管理路由和凭据保护前不建议投入真实重要账号。由Q03可提出把余额只读监控与包管理权限分离、使用凭据引用而非复制key的未验证假设；对比权限、意外外发面和配置恢复任务，若维护增加却不降低风险则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:102-106](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/README.md#L102-L106)

作者提示同名npm身份冲突。

```text
**Q：Key 会泄露吗？**
A：不会。Key 只保存在本机插件目录 `config.json` 中，界面仅显示掩码；源码与 README 中不含任何密钥。

**Q：为什么不用 `dsh plugin add dsh-balance-plugin`？**
A：npm 上存在他人同名包（`dsh-balance-plugin@0.1.0`），裸包名会装错。请使用一键脚本或 `github:` 源。
```

**依据 2 · 源码核查**：[lib/index.js:109-130](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L109-L130)

凭据落盘。

<details>
<summary>查看原文（22行）</summary>

```text
  async function saveConfig() {
    const configPath = await getConfigPath()
    if (!configPath) return
    try {
      const fs = await import('fs')
      const data = {
        accounts: state.accounts.map((a) => ({
          id: a.id,
          name: a.name,
          key: a.key,
          auto: a.auto,
          autoKey: a.autoKey,
          autoSource: a.autoSource,
        })),
        thresholdCny: state.thresholdCny,
        thresholdUsd: state.thresholdUsd,
        intervalMs: state.intervalMs,
        showDock: state.showDock,
        nextAccountId: state.nextAccountId,
      }
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) { /* ignore */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:703-749](https://github.com/yxxbc/dsh-balance-plugin/blob/d65fba4d7b468ec92a90375f9f2a2780113e4052/lib/index.js#L703-L749)

监控之外的包管理副作用。

<details>
<summary>查看原文（47行）</summary>

```text
  registerRoute('install-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    try {
      const cmd = 'dsh plugin --profile ' + profile + ' add ' + pkg
      const spec = shell.resolve({ command: cmd, timeoutMs: 120000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '安装失败').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500) }
    } catch (e) {
      return { ok: false, error: String(e && e.message || e).slice(0, 300) }
    }
  })
  registerRoute('uninstall-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    try {
      const cmd = 'dsh plugin --profile ' + profile + ' rm ' + pkg
      const spec = shell.resolve({ command: cmd, timeoutMs: 60000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '卸载失败').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500) }
    } catch (e) {
      return { ok: false, error: String(e && e.message || e).slice(0, 300) }
    }
  })
  registerRoute('update-plugin', async (args) => {
    const pkg = args && typeof args.pkg === 'string' ? args.pkg.trim() : ''
    if (!shell || !pkg) return { ok: false, error: '缺少包名' }
    const profile = process.env.DSH_PROFILE || 'web'
    const githubSrc = 'github:yxxbc/dsh-balance-plugin'
    try {
      const rmCmd = 'dsh plugin --profile ' + profile + ' rm ' + pkg + ' 2>/dev/null || true'
      const rmResult = await shell.run(shell.resolve({ command: rmCmd, timeoutMs: 30000 }))
      const addCmd = 'UPDATE=1 dsh plugin --profile ' + profile + ' add ' + githubSrc
      const spec = shell.resolve({ command: addCmd, timeoutMs: 120000 })
      const result = await shell.run(spec)
      const out = (result.stdout.text || '').trim()
      const err = (result.stderr.text || '').trim()
      if (result.exitCode !== 0) return { ok: false, error: (err || out || '更新失败').slice(0, 500), output: (out || err || '').slice(0, 500) }
      return { ok: true, output: out.slice(0, 500), error: '' }
```

</details>

#### 缺口

- 分权与凭据引用方案尚未实现，也没有采用成本测量。
  **影响**：不能计入现有安全或节省收益。
  **进一步探讨**：独立原型比较最少权限、恢复完整性和人工配置时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
