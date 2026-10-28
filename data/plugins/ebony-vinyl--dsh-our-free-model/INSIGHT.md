# Our Free Model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[38648bf](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/38648bf0ebecc63563e2e3324fbed4d323a442ac)

<!-- BEGIN META -->
[![GitHub ★ 46,878](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46%2C878&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)
<!-- END META -->

> **功能**：在 DSH 中统一多渠道模型目录、组合降级与本地兼容网关的插件

> **亮点**：把目录、DSH模型选择、兼容网关与组合链统一；容量保守汇总、回答commit后不切换和分级恢复有具体机制价值，不能把免费供给或模型能力算原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：统一模型名可能遮蔽真实渠道、数据和费用差异；capacity元信息与commit边界只能约束部分行为，不能证明后备等质或任务合格。更新回滚也可能进入需恢复状态。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 模型统一入口实际增加什么？](#detail-section-11)
  - [Q02 · combo容量与流式失败如何避免不诚实降级？](#detail-section-12)
  - [Q03 · 本地与LAN访问有什么真实边界？](#detail-section-13)
  - [Q04 · 可信分发和自更新是否保证总能回滚？](#detail-section-14)
  - [Q05 · 总成本及当前采用路径是什么？](#detail-section-15)
  - [Q06 · 任务级渠道策略与尝试链收据值得验证吗？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿管理渠道并核真实模型/费用的数据敏感度适中个人开发者，期望减少手工endpoint接线。

逐个官方endpoint和手工fallback；模型质量、匿名政策和账号配额来自外部，不归插件贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型目录与combo | 汇集车道与故障切换 | 外部配额/数据规则不同，不保证免费无限 |
| 本地/LAN网关 | 兼容API入口 | 独立key，LAN默认关 |
| 自更新/热重载 | 安装可信新字节 | pin签名+hash，回滚失败需恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm与兼容接口 | 启动必需 | adapter注册 | web等缺失只降级对应功能 |
| 出口/上游模型与账号或key | 对应车道必需 | 真正生成 | 免费匿名不覆盖全部渠道，政策未知 |
| 可信Release/审核源码 | 分发必需 | 正确安装字节 | 同名npm不是作者版本 |
| 本地/LAN独立key | 网关必需 | 限制调用者 | 默认LAN关闭，泄露需轮换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定可信源码/Release及安装字节所有者 | managed不允许双写更新 |
| 2 | 用户从单车道脱敏任务开始，LAN关闭 | 实际endpoint/key/模型与预期一致 |
| 3 | 用户再配combo并注入首输出前后失败 | 无混答/重复副作用，所有尝试费用可核 |
| 4 | 用户单独验隔离更新/恢复 | recovery-required不继续升级，先核备份和runtime |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络、机器、账号/key费用未知 | 核分发、出口、监听和凭据 | 同名npm不作为官方来源 |
| 持续使用 | 各车道配额/尝试费用未知 | 质量与策略维护、兼容排障 | 匿名免费不等全渠道零费 |
| 失败恢复 | 多次模型/网络及备份存储未知 | 核commit、副作用、费用和恢复状态 | 回滚可失败，不能无损保证 |
| 退出 | 凭据/数据迁移未知 | 关网关、轮换key、恢复单endpoint | 各账号残留需独立核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一接入 | runtime到双provider注册 | 全车道当前可用/真实模型质量 |
| combo降级 | vision/窗口保守汇总、commit后不换 | 任务合格率、工具语义和净成本 |
| 自更新 | 签名、每文件hash、备份与分级恢复 | 目标文件系统故障后恢复 |

> **思考**：统一模型名可能遮蔽真实渠道、数据和费用差异；capacity元信息与commit边界只能约束部分行为，不能证明后备等质或任务合格。更新回滚也可能进入需恢复状态。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把目录、DSH模型选择、兼容网关与组合链统一；容量保守汇总、回答commit后不切换和分级恢复有具体机制价值，不能把免费供给或模型能力算原创。[Q01](#research-q01) [Q02](#research-q02)

最小llm硬依赖、可选web、combo循环检测/容量汇总、流输出commit和managed单写所有者值得借鉴；代价是上游协议、账号/数据规则、Host认证和更新FS状态维护。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

统一模型名可能遮蔽真实渠道、数据和费用差异；capacity元信息与commit边界只能约束部分行为，不能证明后备等质或任务合格。更新回滚也可能进入需恢复状态。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

愿管理渠道的个人开发者在可信源码环境先单车道脱敏试用，保持LAN关闭；真实渠道/数据规则不清、重复副作用或恢复状态不明时停止并回已知官方endpoint。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核心注册、combo/流边界、trust与更新状态为源码支持；免费/不限量是作者上游声明，未独立验证。未运行服务，任务策略为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、src/core/runtime.js、src/combos.js、src/adapter.js、src/trust.js、src/forward.js、src/updater.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根388个tracked文件统计，仅深审Host/core注册、combo/流commit、trust/forward与updater。未审全部账号/订阅/magpie/desktop链，不运行模型、网络服务、更新或故障测试。
- 下一步：固定脱敏工具任务，对照单官方endpoint，注入首输出前后失败与禁止/昂贵后备，记录实际目的地/模型、commit、所有费用、副作用和人工分钟；隔离FS单独验更新失败恢复。

**分析版本**

- **仓库**：[Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model)
- **版本号**：2.7.2（[固定提交 38648bf](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/38648bf0ebecc63563e2e3324fbed4d323a442ac)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证任务级渠道策略与逐尝试收据，在发送前限制目的地/费用/能力，记录commit和实际渠道；用禁止后备、视觉不足和流后故障检验越界/重复/合格率与复核时间，出现禁止请求即否定。[Q06](#research-q06)

固定脱敏工具任务，对照单官方endpoint，注入首输出前后失败与禁止/昂贵后备，记录实际目的地/模型、commit、所有费用、副作用和人工分钟；隔离FS单独验更新失败恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 87 | 33474 | 24198 | 7965 | — |
| .md | source | 83 | 7463 | — | — | 139752 |
| .mjs | source | 195 | 106030 | 92663 | 12027 | — |
| .tsx | source | 18 | 2278 | 2175 | 31 | — |
| .ts | source | 2 | 148 | 144 | 0 | — |
| .md | example | 1 | 8 | — | — | 159 |
| .mjs | example | 2 | 1551 | 1126 | 358 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多车道统一与combo是否保留能力/渠道/费用边界，自更新如何恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型统一入口实际增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向希望在DSH选择多个模型、渠道失败时有替代路径且愿核真实渠道的用户；合格结果是工具任务按预期能力完成、尝试和费用/数据去向能解释。Host只硬依赖llm，创建共享runtime，把adapter注册主/地区两provider；可选web/附件缺失只降级对应功能。runtime还接订阅等可选运行时，故“免费”不能覆盖所有车道；匿名模型名称、供给与免key政策由上游决定，不是插件承诺。相对手工多个endpoint，本包将目录、能力元信息、选择器和兼容网关统一；贡献是接线和可观测运行时，不是模型质量或永久免费供给。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:91-113](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/index.js#L91-L113)

最小硬依赖与可选服务降级。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * `llm` is what the plugin exists for, so it is the only hard requirement of the
 * plugin itself.
 *
 * Cordis withholds from a context any service its fiber does not name in
 * `inject`, and keeps that fiber PENDING while a named one is absent — which is
 * how v1.2.1 stayed permanently inactive on a composition with no HTTP server,
 * the surface issue #4 reported. So nothing else may be named here: a headless
 * composition would rather serve models without a settings page than serve
 * nothing.
 *
 * What that costs and what still works:
 * - `webServer` — the in-app dashboard and the SSE push channel. Reached through
 *   a nested `ctx.inject` fiber (see the browser-facing API section), which pends
 *   on its own and never blocks the lane above.
 * - `timer` (`ctx.interval`) — nothing. The background loops are plain unref'd
 *   timers (see `every`), because reading a mixin off an undeclared service
 *   throws rather than answering `undefined`.
 * - `connection`, `attachments` — one feature each: the fence falls back to its
 *   structural replica, image blocks to the text projection. Both are read with
 *   `ctx.get()`, which is the opportunistic lookup that answers `undefined`.
 */
export const inject = ['llm']
```

</details>

**依据 2 · 源码核查**：[index.js:426-458](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/index.js#L426-L458)

共享runtime到真实adapter注册和发现。

<details>
<summary>查看原文（33行）</summary>

```text
    // A broken private sidecar must not disable the anonymous model lane.
    subscriptions = undefined
    logger.warn?.('our-free-model: private subscription storage is unavailable')
  }
  subscriptionRuntime = combineSubscriptionRuntimes(magpieModels, subscriptionRuntime)
  const modelRuntime = createModelRuntime({
    ...stores,
    logger,
    subscriptionRuntime,
    attributionUserAgent: 'deepseek-harness',
    resolveImage: imageResolver(ctx, logger),
    sealedCredential: sealedCredentialOf,
    onSealedUnavailable: () => logger.warn?.('our-free-model: the sealed lane is not available in this composition (no recognized host profile); its models stay hidden'),
    onTopology: () => emitTopology(),
  })
  const { state, adapter, refreshCatalog, refreshAvailability, watchEgress, fetchListing, publicModelRows, syncAggregateCatalog } = modelRuntime
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
  ])

  // Advertise a probe endpoint for the in-app "detect models" button. It offers
  // what the picker itself advertises — a model the gateway refuses to route at
  // all must not be addable to a profile just because it still appears in the
  // upstream listing. Automatic availability probing is disabled by owner
  // policy, so discovery refreshes the listing only.
  ctx.llm.registerModelDiscovery?.(ctx.fiber?.entry?.options?.id ?? name, async () => {
    await refreshCatalog({ probe: false, force: true })
    const advertised = new Set(Object.values(state().membership).flat())
```

</details>

**依据 3 · 源码核查**：[README.md:26-33](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/README.md#L26-L33)

作者免费/不限量声明，不能据此验证上游。

```text
> *All you do is install this plugin in dsh: no login, no sign-up, no API key, nothing
> else. The frontier models are just there — DeepSeek V4.1 Flash, Kimi K3 and the rest.
> Free, with no usage cap.*
>
> 模型清单跟随上游刷新，可用性由**你自己这台机器的网络出口**实测得出，
> 思考强度下发的是真实预算而不是提示词，另附一个 OpenAI 兼容的本地转发端口。
>
> 纯插件挂载：不改内核、无构建步骤、零依赖。
```

**依据 4 · 源码核查**：[package.json:1-7](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/package.json#L1-L7)

private2.7.2与多账号范围自述。

```text
{
  "name": "dsh-our-free-model",
  "version": "2.7.2",
  "private": true,
  "type": "module",
  "description": "Our Free Model — 在 dsh 里装上这个插件即可，无需登录、注册或填 API Key，就能使用包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型，桌面端另有 EAC 协付渠道；2.0 起接入 LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax、ZCode、Gemini 十个账号渠道（原有匿名免费通道保留）（登录、账号池、积分领取、本地 OpenAI 网关与局域网转发、数据看板与运行日志），六页毛玻璃界面统一呈现。",
  "main": "./index.js",
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · combo容量与流式失败如何避免不诚实降级？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

buildComboCatalog递归解析成员，拒循环/无成员，用所有成员vision交集、最小contextWindow/maxOutput表达后备也能处理的输入；reasoning是some，故不是所有能力均严格交集，不能把一个布尔量当等质模型保证。runCombo在候选输出未commit前持有chunk，实际answer一旦commit就释放并不再切换候选，避免把两个模型回答混为一个；取消或非候选故障不假装换模型能救。它可改善空响应/上游故障的可解释处理，但后备质量、工具语义、费用和数据规则仍可能不同；同名组合不是同一基础模型，fallback成功不等原任务合格。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.js:106-149](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/combos.js#L106-L149)

循环检测与逐项能力汇总。

<details>
<summary>查看原文（44行）</summary>

```text
export function buildComboCatalog(combos, catalog) {
  const byId = new Map()
  for (const entry of catalog) if (!isComboEntry(entry)) byId.set(entry.id, entry)
  const definitions = new Map(combos.map(combo => [combo.id, combo]))
  const visits = new Map()
  const invalid = new Set()
  const cycle = id => {
    if (visits.get(id) === 1) return true
    if (visits.get(id) === 2) return invalid.has(id)
    const row = definitions.get(id)
    if (!row || row.enabled === false) return false
    visits.set(id, 1)
    const bad = row.models.filter(model => definitions.has(model)).some(model => cycle(model))
    visits.set(id, 2)
    if (bad) invalid.add(id)
    return bad
  }
  for (const combo of combos) cycle(combo.id)
  const built = new Map()
  const resolve = (combo, path = new Set()) => {
    if (built.has(combo.id)) return built.get(combo.id)
    if (combo.enabled === false || invalid.has(combo.id) || path.has(combo.id)) return null
    const branch = new Set([...path, combo.id])
    let cycle = false
    const members = combo.models.map(id => {
      if (byId.has(id)) return byId.get(id)
      const nested = definitions.get(id)
      if (!nested) return null
      if (branch.has(id)) { cycle = true; return null }
      const child = resolve(nested, branch)
      if (child === null && nested.enabled !== false && nested.models.some(model => branch.has(model))) cycle = true
      return child
    }).filter(Boolean)
    if (cycle || members.length === 0) return null
    const entry = {
      id: combo.id, name: combo.name, channel: COMBO_CHANNEL,
      combo: members.map(member => member.id), strategy: combo.strategy, stickyLimit: combo.stickyLimit,
      vision: members.every(member => member.vision === true),
      reasoning: members.some(member => member.reasoning === true),
      contextWindow: Math.min(...members.map(member => number(member.contextWindow) ?? 131072)),
      maxOutput: Math.min(...members.map(member => number(member.maxOutput) ?? 32768)),
      canDisableThinking: members.every(member => member.canDisableThinking !== false),
      regionSensitive: false, wire: 'chat',
      lanes: [...new Set(members.flatMap(member => member.lanes ?? [member.channel ?? 'free']))],
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:240-279](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/adapter.js#L240-L279)

持有未commit输出，commit后不再advance，保真实结尾。

<details>
<summary>查看原文（40行）</summary>

```text
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = await iterator.next()
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
```

</details>

#### 缺口

- 多车道工具调用、流中断和后备输出的同任务合格率未测试。
  **影响**：不能声称无缝等质降级或更高可靠性。
  **进一步探讨**：用固定工具任务注入首token前/后断流，核无混答/重副作用并比较最终正确率和全部尝试费用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地与LAN访问有什么真实边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Host API通过rejectionFor复用connection.admit或旧requestRejection；服务抛错503，缺服务才用结构性loopback/同源fence。该helper按同步返回读取rejection，精确宿主合约仍需匹配，不能独立视作所有版本认证证明。独立forward监听器不是Host路由，需自发key常量时间比较并约束解析后的本机IP；LAN中继是额外开关/独立key，启用会把额度交给网络上持key的人。Host账号凭据、用户自带key与匿名车道的数据规则不相同，不能因UI统一就互相替代。默认保持LAN关闭，在脱敏输入上检查实际endpoint、认证和监听，再扩任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/trust.js:87-117](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/trust.js#L87-L117)

真实host与结构性fallback，错误503。

<details>
<summary>查看原文（31行）</summary>

```text
export function rejectionFor(req, connection, onRejection) {
  let decision
  try {
    // Hosts before dsh 0.1.7 publish the same decision under the older name
    // `requestRejection` (issue #89): `admit` is undefined there, and the
    // service *exists*, so an empty read must fall through to that method —
    // treating it as a fault turned every request into 503 admission
    // unavailable. The return value is a bare status on that spelling and an
    // `{rejection}` envelope on `admit`.
    const admit = connection?.admit
    if (typeof admit === 'function') {
      const admission = admit.call(connection, req)
      const status = admission && typeof admission === 'object' ? admission.rejection : undefined
      if (status === undefined) return undefined
      decision = { status, source: 'connection', reason: 'host-rejected' }
    } else {
      const reject = connection?.requestRejection
      if (typeof reject === 'function') {
        const status = reject.call(connection, req)
        if (status === undefined) return undefined
        decision = { status, source: 'connection', reason: 'host-rejected' }
      }
    }
  } catch {
    // Never bypass browser authentication when a mounted Host service fails.
    decision = { status: 503, source: 'connection', reason: 'admission-error' }
  }
  if (decision === undefined) {
    const reason = structuralReason(req)
    if (reason === undefined) return undefined
    decision = { status: 403, source: 'structural', reason }
```

</details>

**依据 2 · 源码核查**：[src/forward.js:100-117](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/forward.js#L100-L117)

独立key及bearer提取。

<details>
<summary>查看原文（18行）</summary>

```text
/** Mint a forward-proxy key. Not derived from anything user-visible. */
export function generateKey() {
  return `ofm-${crypto.randomBytes(24).toString('base64url')}`
}

/** Constant-time comparison of a bearer token against the issued key. */
export function keyMatches(presented, expected) {
  if (typeof presented !== 'string' || typeof expected !== 'string') return false
  const a = crypto.createHash('sha256').update(presented).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

function bearerOf(req) {
  const header = String(req.headers.authorization ?? '')
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim()
  const key = req.headers['x-api-key']
  return typeof key === 'string' ? key.trim() : ''
```

</details>

**依据 3 · 源码核查**：[src/forward.js:170-199](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/forward.js#L170-L199)

本机监听解析后IP边界。

<details>
<summary>查看原文（30行）</summary>

```text
 * Resolve the bind address for the listener.
 *
 * A hostname — `localhost` above all — must be resolved and *every* answer must
 * be a loopback address before `listen` sees anything: `localhost` is otherwise
 * matched as a string here and resolved as a name by the OS, and a hosts file
 * or enterprise DNS that points it at a routable interface would hand the
 *免密 lane's quota to the whole subnet while the check kept passing (issue #19).
 * The listener binds a resolved IP, never the original spelling.
 *
 * @returns {Promise<string>} the address to pass to `server.listen`
 */
export async function resolveLoopbackBind(host) {
  const value = String(host ?? '').trim() || '127.0.0.1'
  const literal = value.replace(/^\[|\]$/g, '')
  if (net.isIP(literal)) {
    if (!isLoopbackIp(literal)) throw new Error(`the forward listener binds a loopback address only (got ${value})`)
    return literal
  }
  let addresses
  try {
    addresses = await dns.promises.lookup(literal, { all: true, verbatim: true })
  } catch (error) {
    throw new Error(`could not resolve the forward bind host "${value}" (${error?.message ?? error})`)
  }
  if (!Array.isArray(addresses) || addresses.length === 0) {
    throw new Error(`the forward bind host "${value}" resolved to no address`)
  }
  const routable = addresses.find(address => !isLoopbackIp(address.address))
  if (routable !== undefined) {
    throw new Error(`the forward listener binds a loopback address only — "${value}" resolves to ${routable.address}`)
```

</details>

**依据 4 · 源码核查**：[README.md:289-289](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/README.md#L289-L289)

作者LAN独立key、默认关闭与共享额度边界。

```text
**供同一网络中的其它设备使用**：同一面板下方还提供"局域网访问"。该功能默认关闭；启用后中继绑定一个可路由地址（默认 0.0.0.0），并要求使用独立的局域网 Key——与上述本机 Key 互不通用，因此任一泄露只需轮换对应一侧，本机已配置的工具不受影响。中继将请求原样转发至本机监听，模型清单、流式行为与错误语义与本机完全一致。端口填 0 表示自动分配（本机 18899 常已被占用或被端口代理占用），启用后面板会显示实际端口与局域网地址。**局域网地址按本机网卡实时读取**：面板在开启期间每 15 秒重读一次，切换到别的网络后不必重开面板。同一台机器常同时持有多张网卡上的私网地址——路由器分配的 `192.168.x.y`，以及虚拟交换机（WSL/Hyper-V/Docker）、VPN 或隧道适配器上的地址——面板把物理网卡的地址排在前面并作为可直接复制的那一条，其余地址列在其下；中继绑定的是所有接口，但某个地址能否被同网段的另一台机器拨通，取决于该地址所属的那张网卡。启用期间，任何能够访问该主机的用户均可使用此 Key 消耗本机的免费额度，因此请仅在可信网络中启用，必要时通过防火墙限制来源网段。
```

#### 缺口

- 精确Host身份接口、所有账号/订阅凭据链与实际网络出站未全量验证。
  **影响**：不能保证全部车道同一隐私/可用性或远程部署可接受。
  **进一步探讨**：逐车道核真实endpoint、请求元信息、未登录/错key和LAN可达范围；敏感任务先用官方自配端点。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可信分发和自更新是否保证总能回滚？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

package private且README明确同名npm非作者发布，只按可信Release或审核源码；不能给出npm install作为官方入口。自更新downloadManifest拒redirect并验pin公钥Ed25519签名，stage再核每文件SHA；签名证明发布者授权、哈希证明字节，两者不同。更新先备份并持久install intent，再替换/验installed/activate核版本；失败回滚分别记录diskRestored/runtimeRestored，恢复失败进入recovery-required并保留备份，不声称已恢复。managed分发停止自更新/公告/热重载，防包管理器和插件双写。可借鉴单一字节所有者和恢复状态；文件权限/占用仍能使回滚失败，本轮没有故障注入，不把代码保证当运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/package.json#L1-L7)

真实private版本。

```text
{
  "name": "dsh-our-free-model",
  "version": "2.7.2",
  "private": true,
  "type": "module",
  "description": "Our Free Model — 在 dsh 里装上这个插件即可，无需登录、注册或填 API Key，就能使用包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型，桌面端另有 EAC 协付渠道；2.0 起接入 LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax、ZCode、Gemini 十个账号渠道（原有匿名免费通道保留）（登录、账号池、积分领取、本地 OpenAI 网关与局域网转发、数据看板与运行日志），六页毛玻璃界面统一呈现。",
  "main": "./index.js",
```

**依据 2 · 源码核查**：[README.md:118-125](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/README.md#L118-L125)

官方明确排除同名npm。

```text
> **⚠️ 不要通过 npm 安装本插件。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
>
> 请只按本文档下方的方式安装：使用本仓库的 Release 发布包，或本地源码目录。
```

**依据 3 · 源码核查**：[index.js:119-131](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/index.js#L119-L131)

managed分发单写所有者。

<details>
<summary>查看原文（13行）</summary>

```text
 * Who owns the plugin's bytes — the distribution mode:
 *
 * - `self` (default): the plugin updates itself from its repository, publishes
 *   its announcement feed, and hot-reloads, exactly as before.
 * - `managed`: the plugin arrived through a distribution pack (an EAC
 *   integration pack, a Mojobox install). The pack manager owns the bytes now,
 *   so the in-app updater, the announcement channel and the hot reload stand
 *   down — two writers to one installed directory is a corrupted install. The
 *   model lane is untouched; this is about who ships the code, not what it does.
 *
 * `config.distribution` (what a pack's bundle patch passes) outranks the
 * settings file, and the settings API never accepts the field back, so an
 * install that shipped managed stays managed.
```

</details>

**依据 4 · 源码核查**：[src/updater.js:407-433](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/updater.js#L407-L433)

远端manifest签名检查。

<details>
<summary>查看原文（27行）</summary>

```text
export async function downloadManifest(sources, { timeoutMs = 15000, fetchImpl = fetch, verifyKey = PINNED_MANIFEST_PUBLIC_KEY } = {}) {
  const failures = []
  const revisions = new Map()
  for (const source of sources) {
    try {
      // One deadline covers resolution, manifest headers and body for this leg.
      const signal = AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined
      const snapshot = await snapshotManifestSource(source, fetchImpl, signal, revisions, Math.max(1, Math.min(3000, Math.floor(timeoutMs / 4))))
      const response = await fetchImpl(bustCdnCache(snapshot), {
        redirect: 'error',
        headers: { accept: 'application/json' },
        signal,
      })
      if (!response.ok) { failures.push(`${source} -> HTTP ${response.status}`); continue }
      const text = await response.text()
      if (text.length > MAX_MANIFEST_BYTES) { failures.push(`${source} -> manifest too large`); continue }
      const manifest = parseManifest(JSON.parse(text))
      if (!verifyManifestSignature(manifest, verifyKey)) {
        failures.push(`${source} -> manifest signature missing or not made with the release key`)
        continue
      }
      return { manifest, source: snapshot, signed: true }
    } catch (error) {
      failures.push(`${source} -> ${error?.message ?? error}`)
    }
  }
  throw new Error(`no manifest source answered (${failures.join('; ')})`)
```

</details>

**依据 5 · 源码核查**：[src/updater.js:1030-1075](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/updater.js#L1030-L1075)

备份、意图、activation版本与恢复分级。

<details>
<summary>查看原文（46行）</summary>

```text
      const staged = await stageRelease({
        manifest, manifestUrl: this.manifestUrl ?? this.sources()[0], stageDir: this.stageDir,
        fetchImpl: this.deps.fetchImpl, onProgress,
      })
      verifyStaged(this.stageDir, manifest)

      onProgress({ phase: 'install' })
      const backedUp = await backupPackage(this.deps.pkgDir, this.backupDir)
      state = { from: previous, to: manifest.version, at: Date.now(), phase: 'installing' }
      // Persist the intent before the first installed byte changes.
      this.saveUpgradeState(state)
      const result = { version: manifest.version, previous, files: manifest.files.length, bytes: staged.bytes }
      try {
        installed = true
        await installStaged(this.stageDir, this.deps.pkgDir, manifest.files.map(file => file.path))
        verifyInstalled(this.deps.pkgDir, manifest)
        if (activate !== undefined) {
          state = { ...state, phase: 'activating' }
          this.saveUpgradeState(state)
          onProgress({ phase: 'reload' })
          const activation = await activate(result)
          if (activation?.ok !== true) {
            throw Object.assign(new Error(activation?.error ?? 'hot reload did not confirm activation'), { runtimeRestored: activation?.restored === true })
          }
          if (activation.version !== manifest.version) {
            throw new Error(`activation version mismatch: expected ${manifest.version}, got ${String(activation.version ?? '(missing)')}`)
          }
          activated = true
        }
      } catch (error) {
        // The installed copy is now in an unknown state: put the old one back
        // before surfacing the failure, so the next boot still works. A failed
        // restore must not mask the install failure that caused it, and the
        // "previous version restored" claim is only true when it succeeded.
        let restoreError = null
        try { restoreBackup(this.backupDir, this.deps.pkgDir) } catch (rollbackError) { restoreError = rollbackError }
        state = {
          ...state,
          phase: restoreError !== null || (state.phase === 'activating' && error.runtimeRestored !== true) ? 'recovery-required' : 'rolled-back',
          diskRestored: restoreError === null,
          runtimeRestored: state.phase !== 'activating' || error.runtimeRestored === true,
        }
        if (restoreError !== null) {
          throw new Error(`upgrade failed (${error?.message ?? error}); rollback also failed (${restoreError?.message ?? restoreError})`)
        }
        throw new Error(`upgrade failed, previous files restored (${error?.message ?? error})`)
```

</details>

#### 缺口

- 目标文件系统下更新/热重载/回滚实测未执行。
  **影响**：不能向日常工作环境承诺升级自动无损。
  **进一步探讨**：隔离安装注入stage/rename/activation失败，核备份与disk/runtime状态；recovery-required先恢复再更新。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 总成本及当前采用路径是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次要核可信源码/Release、Host版本、出口和所需key；从一条匿名或自配车道和脱敏工具任务开始，先不启LAN/自动更新/未知账号导入。持续支出包括各上游配额/费用、探测/尝试、兼容更新与人工质量复核，匿名免费声明不覆盖全部车道。失败恢复涉及确认哪条车道已输出、是否发生工具副作用、是否可重试以及更新备份；成功一次不能证明任务级可靠。适合愿管理渠道的个人开发者条件试用；需要稳定SLA、严格数据处理或无需维护者不宜把统一目录当供给担保，应优先已知官方endpoint。停止条件是实际渠道/数据规则不明、重复工具副作用、失败账单超预算或更新恢复不清。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:426-458](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/index.js#L426-L458)

多个渠道共用注册且可选发现并非生成可用性。

<details>
<summary>查看原文（33行）</summary>

```text
    // A broken private sidecar must not disable the anonymous model lane.
    subscriptions = undefined
    logger.warn?.('our-free-model: private subscription storage is unavailable')
  }
  subscriptionRuntime = combineSubscriptionRuntimes(magpieModels, subscriptionRuntime)
  const modelRuntime = createModelRuntime({
    ...stores,
    logger,
    subscriptionRuntime,
    attributionUserAgent: 'deepseek-harness',
    resolveImage: imageResolver(ctx, logger),
    sealedCredential: sealedCredentialOf,
    onSealedUnavailable: () => logger.warn?.('our-free-model: the sealed lane is not available in this composition (no recognized host profile); its models stay hidden'),
    onTopology: () => emitTopology(),
  })
  const { state, adapter, refreshCatalog, refreshAvailability, watchEgress, fetchListing, publicModelRows, syncAggregateCatalog } = modelRuntime
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
  ])

  // Advertise a probe endpoint for the in-app "detect models" button. It offers
  // what the picker itself advertises — a model the gateway refuses to route at
  // all must not be addable to a profile just because it still appears in the
  // upstream listing. Automatic availability probing is disabled by owner
  // policy, so discovery refreshes the listing only.
  ctx.llm.registerModelDiscovery?.(ctx.fiber?.entry?.options?.id ?? name, async () => {
    await refreshCatalog({ probe: false, force: true })
    const advertised = new Set(Object.values(state().membership).flat())
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:265-279](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/adapter.js#L265-L279)

commit后不重试及真实失败保留。

<details>
<summary>查看原文（15行）</summary>

```text
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
```

</details>

**依据 3 · 源码核查**：[README.md:118-125](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/README.md#L118-L125)

采用前必须核分发来源。

```text
> **⚠️ 不要通过 npm 安装本插件。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
>
> 请只按本文档下方的方式安装：使用本仓库的 Release 发布包，或本地源码目录。
```

#### 缺口

- 实际配额/价格、任务合格率及首次配置/持续排障时间未知。
  **影响**：不能算单位合格任务成本或无上限供给收益。
  **进一步探讨**：固定模型/输入/预算记录所有尝试、实际渠道、费用、任务正确与人工分钟，同单官方端点比较。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 任务级渠道策略与尝试链收据值得验证吗？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是请求前按任务约束允许数据目的地、最大费用、视觉/工具能力和可接受降级，返回逐候选尝试、commit点、真实模型/渠道与费用收据；它比单一combo名更能让用户判断有没有接受后备差异。实现必须在发送前执行规则，事后UI提示不能撤回已发数据，也不能仅用模型名称担保真实性。最小验证注入禁止渠道、昂贵后备、视觉能力不足和流后失败，比较当前combo与策略版的越界请求、工具重复、合格率和人工复核时间；任何禁止请求发出即否定，若只是增加配置而没有收益则不扩独立产品。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.js:140-149](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/combos.js#L140-L149)

能力摘要不涵盖费用/数据政策。

<details>
<summary>查看原文（10行）</summary>

```text
    const entry = {
      id: combo.id, name: combo.name, channel: COMBO_CHANNEL,
      combo: members.map(member => member.id), strategy: combo.strategy, stickyLimit: combo.stickyLimit,
      vision: members.every(member => member.vision === true),
      reasoning: members.some(member => member.reasoning === true),
      contextWindow: Math.min(...members.map(member => number(member.contextWindow) ?? 131072)),
      maxOutput: Math.min(...members.map(member => number(member.maxOutput) ?? 32768)),
      canDisableThinking: members.every(member => member.canDisableThinking !== false),
      regionSensitive: false, wire: 'chat',
      lanes: [...new Set(members.flatMap(member => member.lanes ?? [member.channel ?? 'free']))],
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:243-279](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/src/adapter.js#L243-L279)

候选链与commit提供策略执行点。

<details>
<summary>查看原文（37行）</summary>

```text
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = await iterator.next()
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
```

</details>

**依据 3 · 源码核查**：[index.js:119-131](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/38648bf0ebecc63563e2e3324fbed4d323a442ac/index.js#L119-L131)

单字节所有者可作为策略配置归属参照。

<details>
<summary>查看原文（13行）</summary>

```text
 * Who owns the plugin's bytes — the distribution mode:
 *
 * - `self` (default): the plugin updates itself from its repository, publishes
 *   its announcement feed, and hot-reloads, exactly as before.
 * - `managed`: the plugin arrived through a distribution pack (an EAC
 *   integration pack, a Mojobox install). The pack manager owns the bytes now,
 *   so the in-app updater, the announcement channel and the hot reload stand
 *   down — two writers to one installed directory is a corrupted install. The
 *   model lane is untouched; this is about who ships the code, not what it does.
 *
 * `config.distribution` (what a pack's bundle patch passes) outranks the
 * settings file, and the settings API never accepts the field back, so an
 * install that shipped managed stays managed.
```

</details>

#### 缺口

- 真实用户对任务规则配置的负担与愿用程度未知。
  **影响**：假设不是已确认市场需求。
  **进一步探讨**：先用真实脱敏任务和小范围用户比较，越界零容忍且总复核下降才继续。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
