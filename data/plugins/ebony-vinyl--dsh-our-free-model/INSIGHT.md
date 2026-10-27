# Our Free Model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[f3ecb7a](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97)

<!-- BEGIN META -->
[![GitHub ★ 40,083](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C083&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)
<!-- END META -->

> **实现功能**：为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。

> **核心亮点**：多车道目录与虚拟组合模型减少手工接线，视觉和窗口等元信息按成员约束。

> **风险与缺陷**：部分免费是作者对上游的声明；真实渠道、供给、成本和数据处理规则仍需分别核对。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
  - [1.6 启动与流程](#detail-section-7)
  - [1.7 启动与依赖](#detail-section-8)
  - [1.8 启动步骤](#detail-section-9)
  - [1.9 效果与成本](#detail-section-10)
  - [1.10 成本](#detail-section-11)
  - [1.11 效果](#detail-section-12)
  - [1.12 主要限制](#detail-section-13)
- [2 未来设计假设（未验证）](#detail-section-14)
- [3 辅助信息](#detail-section-15)
- [4 研究问题与完整回答](#detail-section-16)
  - [Q01 · 多车道模型接入对谁有价值，免费承诺的边界是什么？](#detail-section-17)
  - [Q02 · 模型目录、宿主注册与降级如何连接？](#detail-section-18)
  - [Q03 · 分发、凭据与网络边界如何影响核心承诺？](#detail-section-19)
  - [Q04 · 免费车道能否代表一次合格任务零成本？](#detail-section-20)
  - [Q05 · 能否让降级决策遵守任务与数据策略？](#detail-section-21)
  - [Q06 · 什么用户可以试用，什么条件下应暂缓？](#detail-section-22)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为DSH用户统一多渠道模型选择、兼容网关与失败切换。

合格结果应同时包括任务办结与真实渠道可核对；切换成功并不足以证明成本和数据规则符合预期。参照与贡献详见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多车道目录 | 在宿主选择模型 | 上游可用性和凭据各异 |
| 组合模型 | 定义降级或轮换链 | 能力按成员交集公布 |
| 本地转发 | 兼容客户端复用模型 | 本地监听及鉴权，LAN另配置 |
| 用量管理 | 查看本机调用情况 | 不等于供应商账单或质量验证 |
| 自更新 | 下载校验与回滚 | self模式，文件系统失败仍可能阻止恢复 |

> **思考**：部分免费是作者对上游的声明；真实渠道、供给、成本和数据处理规则仍需分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：多车道目录与虚拟组合模型减少手工接线，视觉和窗口等元信息按成员约束。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持的贡献是将多车道目录、DSH模型选择和兼容网关统一，并用组合模型表达降级及共同能力边界。它降低手工接线负担，不能把上游模型能力或免费政策算作插件原创。

值得借鉴的是宿主服务最小硬依赖、可选网页fiber与独立核心运行时，以及combo能力交集。复用需要承担上游协议适配、凭据边界和流式失败语义维护。自更新签名与每文件哈希承担不同职责，不把哈希误认为可信发布者证明。

<a id="detail-section-5"></a>

### 1.4 使用建议

[Q06](#research-q06) 建议从单车道脱敏试用开始，核对来源、监听、凭据与失败切换；有稳定供给或严格数据要求时先补足专项证据。

**补充建议**

使用可信完整分发，从单车道脱敏任务开始，并核对监听、凭据和实际尝试链。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查根入口、package、runtime、combo、forward、updater及安装声明。
- 未执行目标代码、渠道登录、模型请求、自更新或当前宿主；未全面审计vendor与每家供应商。

- 研究范围：根DSH插件入口、共享runtime、combo、forward与updater重点源码；不将独立服务、第三方vendor或全部账号渠道当已全面验证。


- **仓库**：[Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model)
- **版本号**：2.5.9（[固定提交 f3ecb7a](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 1.6 启动与流程

<a id="detail-section-8"></a>

### 1.7 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24及DSH llm | 必需 | 插件与模型adapter | 无法运行 |
| 上游网络与渠道凭据 | 按车道必需 | 实际生成 | 配额、出口和认证影响可用性 |
| Web服务 | 可选 | 设置与看板 | 模型lane可独立接线 |
| 完整可信分发 | 必需 | adapter与vendor加载 | 不完整包可能缺能力 |

<a id="detail-section-9"></a>

### 1.8 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对完整来源和版本 | 不使用作者否认的同名npm |
| 加载 | 宿主注册llm adapter | 单车道模型可发现 |
| 验收 | 用户执行脱敏工具任务 | 结果和真实渠道可核对 |
| 扩展 | 用户再配置组合/中继 | 边界与失败可追溯 |
| 退出 | 用户停用并处理配置 | 不再接收请求和更新 |

目录重建、宿主adapter及组合模型字段的具体实现见 [Q02](#research-q02)；各字段并非全部采用同一交集规则。

<a id="detail-section-10"></a>

### 1.9 效果与成本

<a id="detail-section-11"></a>

### 1.10 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 机器、网络和付费渠道费用未知 | 核对分发、配置和凭据耗时未知 | 不应从同名npm安装 |
| 持续使用 | 各车道配额和价格未知 | 质量复核与策略维护未知 | 匿名免费不代表全车道免费 |
| 失败恢复 | 多次尝试可能增加调用费 | 渠道定位、回滚核对耗时未知 | 回滚受文件系统条件限制 |

<a id="detail-section-12"></a>

### 1.11 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一模型接入 | 目录和adapter注册 | 全车道当前可用性 |
| 降级 | combo链和共同能力元信息 | 任务正确率与费用净收益 |
| 自更新 | 签名清单、校验与备份设计 | 文件系统失败后的实际恢复 |

<a id="detail-section-13"></a>

### 1.12 主要限制

[Q03](#research-q03) 的关键质疑是统一入口会不会隐藏真实渠道、成本和数据处理差异。能力交集是有力支持，但它只约束部分元信息；应以实际尝试链和同任务结果检验降级是否仍符合用户预期。

<a id="detail-section-14"></a>

## 2 未来设计假设（未验证）

[Q05](#research-q05) 提出未验证的任务级渠道策略与尝试链交付记录，发请求前约束数据规则和费用，以越界请求、合格率与复核时间证伪。

<a id="detail-section-15"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

<details>
<summary>查看辅助统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 78 | 27452 | 18726 | 7523 | — |
| .md | source | 66 | 6239 | — | — | 117922 |
| .mjs | source | 153 | 94254 | 81336 | 11668 | — |
| .tsx | source | 10 | 1053 | 1000 | 11 | — |
| .ts | source | 1 | 83 | 83 | 0 | — |

</details>

</details>

**活跃度**

[![Issue 未关闭 270](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=270&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 394](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=394&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 124](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=124&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-16"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多模型聚合与降级是否提供可控的 DSH 模型接入，免费承诺与分发边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-17"></a>

### Q01 · 多车道模型接入对谁有价值，免费承诺的边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是希望在DSH统一选择多个模型、遇到配额或路由失败时有替代路径的用户。合格结果是按预期模型完成工具任务，并能追踪实际渠道与费用。相对手工配置多个端点，本组件把匿名、Kilo、EAC与自带Key等车道放进统一目录和选择器，也提供本地兼容网关。免费不限量是README作者对部分上游的声明，不能覆盖账号渠道、自带Key或未来政策；模型可用性由出口、认证、配额与上游变化决定，插件没有提供可持续供给担保。不能把模型名称当模型真实性或质量的独立证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-39](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L26-L39)

开箱免费是作者声明，不能升级为独立供给保证。

<details>
<summary>查看原文（14行）</summary>

```text
> *All you do is install this plugin in dsh: no login, no sign-up, no API key, nothing
> else. The frontier models are just there — DeepSeek V4.1 Flash, Kimi K3 and the rest.
> Free, with no usage cap.*
>
> 模型清单跟随上游刷新，可用性由**你自己这台机器的网络出口**实测得出，
> 思考强度下发的是真实预算而不是提示词，另附一个 OpenAI 兼容的本地转发端口。
>
> 纯插件挂载：不改内核、无构建步骤、零依赖。

</div>

---

## 交流群
```

</details>

**依据 2 · 源码核查**：[src/core/runtime.js:95-134](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/core/runtime.js#L95-L134)

目录由多个车道合并而成。

<details>
<summary>查看原文（40行）</summary>

```text
  const rebuildCatalog = () => {
    const seen = new Set()
    const merged = []
    for (const entry of [...freeCatalog, ...sealedCatalog, ...kiloCatalog, ...aggregateCatalog]) {
      if (entry === null || entry === undefined || seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    const combos = normalizeCombos(settings.get().combos)
    comboCatalog = buildComboCatalog(combos, merged)
    pruneRotation(combos)
    for (const entry of comboCatalog) {
      if (seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    catalog = merged
  }
  const mergeCatalogs = () => {
    aggregateCatalog = buildAggregateCatalog(settings.get().aggregate ?? {})
    rebuildCatalog()
  }
  mergeCatalogs()
  const state = () => ({
    catalog,
    membership: computeMembership(catalog, availability.get(), settings.get()),
    settings: settings.get(),
    attributionUserAgent,
  })
  const emitTopology = () => { if (!disposed) onTopology() }
  const adapter = new FreeModelAdapter({
    state,
    resolveImage,
    sealedCredential,
    recordUsage: record => {
      if (disposed) return
      recordUsage(stats, record)
      stats.edit(value => pruneDays(value, 120))
    },
    recordTurn: record => { if (!disposed) recordTurn(stats, record) },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-18"></a>

### Q02 · 模型目录、宿主注册与降级如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主入口仅硬依赖llm，创建持久化stores和共享runtime，再把adapter注册到两个provider路由；网页与其他服务为独立可选接线。核心runtime先形成免费、密封、Kilo与聚合目录，再重建combo虚拟模型；重建而非只追加可移除已停用车道。组合链根据成员交集公布视觉与窗口，避免首选模型较强而后备模型无法处理同一输入。其工程贡献是把目录、能力元信息与多渠道运行时统一，代价是每种协议和上游行为都需要持续适配；本轮没有验证全部厂商和渠道。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:82-110](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/index.js#L82-L110)

llm硬依赖与网页分离的接线边界。

<details>
<summary>查看原文（29行）</summary>

```text
// after a failed reload must not pick up the new package.json still on disk.
export const version = readPackageVersion()

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

/** Where the plugin's own announcement copy lives; bump it to re-announce. */
export const ANNOUNCEMENT_VERSION = '2026-10-17.3'
```

</details>

**依据 2 · 源码核查**：[index.js:418-435](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/index.js#L418-L435)

adapter和模型发现注册。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 3 · 源码核查**：[src/core/runtime.js:95-134](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/core/runtime.js#L95-L134)

目录重建与combo装配。

<details>
<summary>查看原文（40行）</summary>

```text
  const rebuildCatalog = () => {
    const seen = new Set()
    const merged = []
    for (const entry of [...freeCatalog, ...sealedCatalog, ...kiloCatalog, ...aggregateCatalog]) {
      if (entry === null || entry === undefined || seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    const combos = normalizeCombos(settings.get().combos)
    comboCatalog = buildComboCatalog(combos, merged)
    pruneRotation(combos)
    for (const entry of comboCatalog) {
      if (seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    catalog = merged
  }
  const mergeCatalogs = () => {
    aggregateCatalog = buildAggregateCatalog(settings.get().aggregate ?? {})
    rebuildCatalog()
  }
  mergeCatalogs()
  const state = () => ({
    catalog,
    membership: computeMembership(catalog, availability.get(), settings.get()),
    settings: settings.get(),
    attributionUserAgent,
  })
  const emitTopology = () => { if (!disposed) onTopology() }
  const adapter = new FreeModelAdapter({
    state,
    resolveImage,
    sealedCredential,
    recordUsage: record => {
      if (disposed) return
      recordUsage(stats, record)
      stats.edit(value => pruneDays(value, 120))
    },
    recordTurn: record => { if (!disposed) recordTurn(stats, record) },
```

</details>

**依据 4 · 源码核查**：[src/combos.js:107-136](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/combos.js#L107-L136)

组合链按成员交集公布能力。

<details>
<summary>查看原文（30行）</summary>

```text
  const byId = new Map()
  for (const entry of catalog) if (!isComboEntry(entry)) byId.set(entry.id, entry)
  const out = []
  for (const combo of combos) {
    if (combo.enabled === false) continue
    const members = combo.models.map(id => byId.get(id)).filter(entry => entry !== undefined)
    if (members.length === 0) continue
    out.push({
      id: combo.id,
      name: combo.name,
      channel: COMBO_CHANNEL,
      combo: members.map(entry => entry.id),
      strategy: combo.strategy,
      stickyLimit: combo.stickyLimit,
      // Intersection, not union — see the module header.
      vision: members.every(entry => entry.vision === true),
      reasoning: members.some(entry => entry.reasoning === true),
      contextWindow: Math.min(...members.map(entry => number(entry.contextWindow) ?? 131072)),
      maxOutput: Math.min(...members.map(entry => number(entry.maxOutput) ?? 32768)),
      canDisableThinking: members.every(entry => entry.canDisableThinking !== false),
      regionSensitive: false,
      wire: 'chat',
      /** Which lanes this chain can reach, for the detail line. */
      lanes: [...new Set(members.map(entry => entry.channel ?? 'free'))],
    })
  }
  return out
}

function number(value) {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-19"></a>

### Q03 · 分发、凭据与网络边界如何影响核心承诺？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

package是private，README明确同名npm包不是本仓库官方发布，不能从包名或npm指标推断已核实分发。应使用仓库Release或审核过的完整源码包，保留adapter、src、locale与vendor渠道包。托管安装须使用managed模式，让包管理器拥有更新字节；自更新从固定来源获取带签名manifest、校验文件、备份及回滚，但文件系统失败仍可能阻止回滚，源码注释已明确此边界。网络请求会交给各上游，局部token看板留本机不代表生成内容不出机。forward对地址和鉴权有检查，局域网中继另有边界，不能由代码存在宣称完整安全审计通过。最关键质疑是统一目录与降级能否保持真实渠道语义和可追溯性，模型名称相同不等于能力、成本及数据处理规则相同。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:118-123](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L118-L123)

作者明确否认同名npm包由本仓库发布，要求使用仓库Release或源码。

```text
> **⚠️ 不要通过 npm 安装本插件。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
```

**依据 2 · 作者声明**：[README.md:130-168](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L130-L168)

作者说明完整分发、安装与managed模式条件。

<details>
<summary>查看原文（39行）</summary>

````text
```
dsh plugin --profile web add /绝对路径/dsh-our-free-model
```

安装完成后重启应用一次。`--profile` 填写实际使用的 profile 名称。

**DSHEAC AIO / 桌面端：请先阅读本节**

部分 DSHEAC AIO / 旧版桌面整合包在启动 web 服务之前会执行 profile 闸门，
限制 profile 中的符号链接或目录 junction。若当前宿主包含该检查，可能报错：

```
PROFILE_UPGRADE_REQUIRED: offline dependency migration is not yet available
```

遇到该闸门时，不要使用 `link:` 依赖或 junction；使用应用内插件管理器，
或下方的本地 tarball 安装。不同宿主的限制以自身日志和安装机制为准。

以真实目录手工安装时，使用可信源码打出的本地 tarball：

1. 创建 `<DSH_HOME>/profiles/<profile>/vendor/`，在审核过的本仓库目录运行 `npm pack --ignore-scripts --pack-destination "<DSH_HOME>/profiles/<profile>/vendor"`，或将本仓库正式发布的同版本 tarball 放入该目录。本地打包不执行 npm 发布。
2. 在 profile 的 `package.json` 的 dependencies 中加入 `"dsh-our-free-model": "file:./vendor/dsh-our-free-model-2.5.9.tgz"`。文件名版本跟随仓库 `package.json`，不要改成同名 npm 注册表版本；再通过宿主的安装流程解析依赖。
3. 在 dsh.profile.bundles 末尾追加 `"dsh-our-free-model"`。

包管理器拥有这份安装的字节时，同时将 bundle config 或插件 `settings.json` 的 `distribution` 设为 `managed`，由包管理器统一更新；应用内升级、公告 feed 与热重载会停用，模型功能保留。以后更新时替换可信 tarball 并同步依赖路径，避免包管理器按旧锁文件恢复旧版本。

若手工复制发布文件，必须复制完整包，包括 `adapter/`、`src/`、`locale/` 和 `vendor/channel-pack/` 下的 `pack.js`、WASM、LICENSE、NOTICE；只复制入口脚本会导致渠道加载失败。

不要再向 cordis.patch.yml 添加条目。被 dsh.profile.bundles 引用的包，其自带的
patch 层会自动生效；两处同时注册将报错 duplicate loader entry id: our-free-model。

**整合包（托管安装）**

插件由整合包（EAC 整合包、Mojobox 等）安装时，更新时机与文件字节由安装方控制：
安装时将 bundle config 设为 distribution: 'managed'（或向 settings.json 写入
同一字段），插件的应用内升级、公告 feed 与热重载即全部停用——两个写入方同时操作
同一安装目录只会导致目录损坏；模型 lane 不受影响。相关验收见
scripts/offline-test.mjs；目录就绪记录（manifest 0.15 / 出处 / 许可 / 完整性）
位于 catalog/ 下。
````

</details>

**依据 3 · 源码核查**：[package.json:1-15](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/package.json#L1-L15)

private与版本、入口声明。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-our-free-model",
  "version": "2.5.9",
  "private": true,
  "type": "module",
  "description": "Our Free Model — 在 dsh 里装上这个插件即可，无需登录、注册或填 API Key，就能使用包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型，桌面端另有 EAC 协付渠道；2.0 起接入 LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax、ZCode、Gemini 十个账号渠道（原有匿名免费通道保留）（登录、账号池、积分领取、本地 OpenAI 网关与局域网转发、数据看板与运行日志），六页毛玻璃界面统一呈现。",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "scripts": {
    "pack:standalone": "node scripts/pack-standalone.mjs",
```

</details>

**依据 4 · 源码核查**：[src/updater.js:1-27](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/updater.js#L1-L27)

升级事务和回滚失败边界。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * In-app plugin upgrade.
 *
 * The plugin updates itself from the same place the owner publishes it: a
 * manifest in the repository listing every file of the release with its size
 * and SHA-256. Applying an update is download → verify → stage → backup →
 * replace → verify → reload. Filesystem access failures can also prevent
 * rollback; in that case the verified backup is retained and the incomplete
 * transaction is reported explicitly:
 *
 * - downloads land in a staging directory under the plugin's data dir and are
 *   hash-checked before anything on the installed copy is touched;
 * - the running process keeps executing from its in-memory module graph, so
 *   replacing files on disk cannot disturb a live request;
 * - the installed package is backed up first, a failed verification restores
 *   it, and a failed reload also restores the disk from that same backup;
 * - replacements are written as `<file>.ofm-new` beside their target and
 *   renamed over it, so a crash mid-swap cannot truncate a file that the next
 *   boot will import (transient Windows EPERM from indexers is retried).
 *
 * The EAC profile gate forbids symlinks and junctions under the profile; this
 * module only ever copies plain files inside the plugin's own directory and
 * data dir, which keeps the gate's answer unchanged.
 *
 * @module src/updater.js
 */

```

</details>

**依据 5 · 源码核查**：[src/forward.js:169-198](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/forward.js#L169-L198)

本地转发强制解析为loopback。

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

#### 缺口

- 多渠道真实模型、供给与数据处理条件未独立核验
  **影响**：不能保证免费持续可用或全车道等价
  **进一步探讨**：对拟使用渠道核对当前官方条款并用脱敏任务记录实际端点、模型响应和账单

<a id="research-q04"></a>

<a id="detail-section-20"></a>

### Q04 · 免费车道能否代表一次合格任务零成本？

**研究主题**：效果与总成本

#### 完整回答

不能。匿名模型可能免直接调用费，但仍有网络、机器、失败重试与人工复核；账号渠道和自带Key有自己的配额及价格。降级可能让同一任务消费多个尝试，压缩工具输出也可能丢掉完成任务需要的信息。因此应以合格工具任务为单位，分别统计各车道请求、现金、等待时间、人工修正与正确性。README展示节省字节的作者实验，无法直接外推节省token、费用或保持任务质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-84](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L63-L84)

多车道、token压缩与降级声明具有不同成立条件。

<details>
<summary>查看原文（22行）</summary>

```text
- **用量看板，数据全部留在本机**——Token 热力图、总量曲线（支持总计与单模型视图）、输出速度与首字延迟逐次采样。不上传任何数据。
- **OpenAI 兼容转发端口**——本机其它工具通过 base URL 与 Key 即可调用这些模型。Chat 历史中 assistant 的字符串 `reasoning_content` 会随工具后续请求保留，包括显式空字符串；缺失字段不会被补造。
- **EAC 渠道（桌面端专属）**——在 DeepSeek Harness 桌面端与 DSHEAC AIO 桌面端中自动解锁一条协付通道，模型以 EAC 前缀显示（如 EAC DeepSeek V4.1 Flash）；凭据加密密封，由宿主指纹闸门把守；该渠道在服务器侧校验 GitHub 授权（登录并 star 本仓库）后才放行对话；在命令行及其它宿主中该通道完全不存在。详见「EAC 渠道」。
- **Kilo 渠道（免密免费池）**——内置 Kilo AI 公共网关的免费模型池（`isFree` 清单实时拉取，含 `kilo-auto/free` 自动路由），无需任何账号或 Key；模型卡带 Kilo 徽章。思考强度与 EAC 渠道同款：模型自身的档位菜单（Off / Low / Medium / High，默认 High），经网关统一的 `reasoning` 参数真实下发——Off 已逐家族实测将思考归零（nemotron、ling、dots、poolside、apodex、cohere）；stepfun 与 liquid 端点强制思考（对关闭请求返回 400）、两个自动路由不透传关闭，这些模型的菜单不含 Off 档。该池由上游免费提供，上游会在其模型卡中声明 prompt 可能被记录用于改进服务——请勿发送敏感内容，详见「免责声明」。
- **聚合渠道，自带 Key**——设置页新增一页，把第三方端点接进同一条模型清单：注册表内置 76 家提供商（NVIDIA NIM、OpenRouter、Groq、Cerebras、SambaNova、Gemini、DeepSeek、Mistral、Together、Fireworks、SiliconFlow、Nebius、Chutes、Hugging Face、Cloudflare、Z.ai、Kimi、MiniMax、QwenCloud/Alibaba、Bedrock、Vertex、Vercel AI Gateway、Azure OpenAI、FleetRelay Gateway，以及无需账号的 Ollama、LM Studio、llama.cpp），写入 Key（本机免账号的提供商不需要）后其模型即以 `provider/model` 出现在选择器里，也可经本地网关调用。Key 只写入本机 0600 的 settings.json，API 只回显 `hasKey` 与 `…abcd` 指纹；每家可单独启停、测试（列表探测，不花一次生成）、发现模型、覆盖 Base URL 与模型清单。OAuth 与 ADC 认证的提供商照常列出，但标注为不可驱动。
- **省 Token**——三件事：工具输出压缩（RTK）在请求发出前就地重写 `tool_result`（git diff / status / log、grep、find、ls、tree、构建日志、编号转储、搜索清单、重复日志行），实测 40 KB 的 `git diff` 移除 90% 的字节且模型仍能就它作答；提示词瘦身有 caveman 与 ponytail 两族、默认全关；另有五个不占用上游请求的本地应答。设置页用与用量图表同一批统计行显示压缩前后字节、节省比例、压缩块数与统计调用数。
- **路由（降级链）**——把任意车道的模型串成一条命名链，以 `combo:<name>` 作为虚拟模型出现在选择器与网关上；`fallback` 固定从链首开始，`round-robin` 轮换起点并连续 N 轮粘滞。链接在输出任何正文之前失败会被整段丢弃，切换对调用方不可见；思考增量不算正文，因此「想了很久才撞上配额墙」正是降级最有价值的场景。
- **本地网关原生说 Anthropic**——新增 `POST /v1/messages`（流式与非流式，含 thinking / tool_use 块、真实 stop_reason 与流内 error 事件）与 `POST /v1/messages/count_tokens`（本地估算）；`/v1/models` 广播全部车道，含聚合行与链路。网关页新增「接入客户端」分区，按实际绑定的端口与真实要求的密钥生成 Claude Code、Codex、OpenAI SDK、Anthropic SDK、curl 与局域网的可复制配方。
- **接口具备鉴权围栏**——插件 HTTP 路由优先级高于内核 `/api`，因此内置与内核一致的信任检查（优先复用 composition 的 connection 服务，缺失时退回结构化围栏）。
- **十个账号渠道，一体接入**——LobsterAI（有道）、Qoder / Qoder 中国版（阿里系）、TRAE（字节）、Cline、Loomy（讯飞）、Raccoon（商汤）、MiniMax Code、ZCode（智谱）、Gemini（Google Code Assist）十个账号渠道开箱即用，外加 Kilo 免费车道与原匿名免费通道；OpenCode 账号渠道在本插件中默认停用。各渠道的登录流程、账号池、每日积分领取、模型黑名单与其本地 OpenAI 网关（Chat Completions + Responses，默认 `127.0.0.1:8326`）原样挂载与运行；凭据只写入宿主凭据库，浏览器永远拿不到明文。
- **视觉特效按需开启**——设置页顶部“视觉特效”开关默认关闭，鱼缸和业务功能始终保留；开启后恢复背景光晕、毛玻璃与装饰动画，选择仅保存在当前浏览器。
- **十一页毛玻璃界面**——设置页顶部导航扩为十一个页面：原有六页（**免费模型**（鱼缸水位 = 可用模型占比）、**EAC 模型**（鱼缸水位 = 协付池压力）、**白嫖模型接入**（十张渠道卡：登录、账号、模型开关、一键领取积分）、**数据看板**（今日/全部 Token 消耗、平均生成速度、缓存命中率、成功率，账号透视与模型性能表、最近请求总览）、**运行日志**（逐请求明细：结果、耗时、首字、速度、Token 细分，失败原因悬停可见）与**网关设置**（网关开关/端点/密钥；局域网转发中继：监听地址、端口与独立中继密钥）），新增**聚合渠道**（提供商注册表、Key、测试、发现模型、Base URL 与模型清单覆盖）、**省 Token**（压缩开关、两族提示词档位、五个本地应答与节省统计）、**路由**（降级链编辑器）、**插件升级**（版本检查、一键升级与热重载）与**推荐项目**（EAC-Desktop / EAC-Pack / EAC-design-world 三张卡片：简介、直达链接与 Star 按钮，Star / Fork / 最近提交数实时取自 GitHub，取不到就整块不显示）五页；网关设置页另增「接入客户端」分区。页面切换与卡片入场为 150–250 ms 短动效，`prefers-reduced-motion` 下整体关闭。每页都有直达 GitHub 仓库的 Star 按钮。
- **局域网转发中继**——渠道网关本身只监听本机（上游的安全选择）；本插件提供自己的转发门：调用方用插件签发与轮换的中继密钥，转发跳由宿主换用网关凭据（凭据不出宿主进程），仅放行 `/v1/*` 模型接口并带环路保护。

## 你会看到什么

**输入框的模型选择器**

| 分组 | 内容 |
| --- | --- |
| Our Free Model | 当前网络出口可直接使用的模型 |
| Our Free Model · region-limited | 上游对该地区不放行的模型，保留可见但单独隔离 |
```

</details>

**依据 2 · 源码核查**：[src/combos.js:1-32](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/combos.js#L1-L32)

链式尝试及能力交集的取舍。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * Combos: one model name that is really an ordered chain.
 *
 * The failure this exists for is not exotic. A quota wall, a region refusal, an
 * expired credential or a 5xx from one upstream all arrive as "your turn died",
 * even though three other lanes on this machine were idle and would have
 * answered. A combo turns that into a retry the user never sees: the chain is
 * walked in order, and the first candidate that produces output wins.
 *
 * A combo is a *virtual catalog entry*. It carries `channel: 'combo'` and a
 * `combo` list of real model ids, so the picker advertises it beside the real
 * models and the forward gateway dials it by name. `combo:` is the prefix, and
 * it is deliberately not a valid provider id — `parseProviderModelId` refuses
 * it, so an aggregate row can never be mistaken for a combo.
 *
 * Two strategies:
 *
 * - `fallback` — always start at the head of the list. Predictable, and the
 *   right choice when the list is a quality ladder.
 * - `round-robin` — start at the next candidate each turn (sticky for
 *   `stickyLimit` consecutive turns), so a chain of equivalent models spreads
 *   its load. The rotation cursor lives in memory: a restart losing it costs
 *   nothing but a different starting point.
 *
 * Capacities are the *intersection*, not the union. A chain that advertises
 * vision because its head supports it hands a fallback an image it cannot read;
 * a chain that advertises a 1M window because its head has one overruns a
 * fallback at 128K. The honest numbers are the ones every candidate can honour.
 *
 * @module src/combos.js
 */

```

</details>

#### 缺口

- 缺少同预算任务的费用、合格率和压缩影响对照
  **影响**：无法证明端到端比直接付费单模型更便宜
  **进一步探讨**：以固定模型/任务比较直连、降级与压缩，计入失败尝试和人工纠错

<a id="research-q05"></a>

<a id="detail-section-21"></a>

### Q05 · 能否让降级决策遵守任务与数据策略？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在组合链的能力交集之外，增加任务级渠道允许集合、现金上限和数据处理要求，并把实际尝试链附在交付记录。推导来自现有多车道目录和组合虚拟模型，同一个模型选择器已能触达不同凭据和上游；统一入口减少操作但也容易掩盖政策差异。新机制应在发请求前过滤候选，并在无合规候选时停止而非静默切换。最小实验用模拟的地区拒绝、配额失败、敏感数据标签与付费候选，对照普通链，观察越界请求数、任务合格率和人工定位时间。如果不能减少越界，或降低的成功率大于可接受阈值，则否定该方案。当前插件是否已有覆盖所有车道的同等策略未核实，此处仅提出研究假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.js:107-136](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/combos.js#L107-L136)

现有combo目录的能力约束提供扩展点。

<details>
<summary>查看原文（30行）</summary>

```text
  const byId = new Map()
  for (const entry of catalog) if (!isComboEntry(entry)) byId.set(entry.id, entry)
  const out = []
  for (const combo of combos) {
    if (combo.enabled === false) continue
    const members = combo.models.map(id => byId.get(id)).filter(entry => entry !== undefined)
    if (members.length === 0) continue
    out.push({
      id: combo.id,
      name: combo.name,
      channel: COMBO_CHANNEL,
      combo: members.map(entry => entry.id),
      strategy: combo.strategy,
      stickyLimit: combo.stickyLimit,
      // Intersection, not union — see the module header.
      vision: members.every(entry => entry.vision === true),
      reasoning: members.some(entry => entry.reasoning === true),
      contextWindow: Math.min(...members.map(entry => number(entry.contextWindow) ?? 131072)),
      maxOutput: Math.min(...members.map(entry => number(entry.maxOutput) ?? 32768)),
      canDisableThinking: members.every(entry => entry.canDisableThinking !== false),
      regionSensitive: false,
      wire: 'chat',
      /** Which lanes this chain can reach, for the detail line. */
      lanes: [...new Set(members.map(entry => entry.channel ?? 'free'))],
    })
  }
  return out
}

function number(value) {
```

</details>

**依据 2 · 源码核查**：[src/core/runtime.js:95-134](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/core/runtime.js#L95-L134)

多车道合并形成策略需求。

<details>
<summary>查看原文（40行）</summary>

```text
  const rebuildCatalog = () => {
    const seen = new Set()
    const merged = []
    for (const entry of [...freeCatalog, ...sealedCatalog, ...kiloCatalog, ...aggregateCatalog]) {
      if (entry === null || entry === undefined || seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    const combos = normalizeCombos(settings.get().combos)
    comboCatalog = buildComboCatalog(combos, merged)
    pruneRotation(combos)
    for (const entry of comboCatalog) {
      if (seen.has(entry.id)) continue
      seen.add(entry.id)
      merged.push(entry)
    }
    catalog = merged
  }
  const mergeCatalogs = () => {
    aggregateCatalog = buildAggregateCatalog(settings.get().aggregate ?? {})
    rebuildCatalog()
  }
  mergeCatalogs()
  const state = () => ({
    catalog,
    membership: computeMembership(catalog, availability.get(), settings.get()),
    settings: settings.get(),
    attributionUserAgent,
  })
  const emitTopology = () => { if (!disposed) onTopology() }
  const adapter = new FreeModelAdapter({
    state,
    resolveImage,
    sealedCredential,
    recordUsage: record => {
      if (disposed) return
      recordUsage(stats, record)
      stats.edit(value => pruneDays(value, 120))
    },
    recordTurn: record => { if (!disposed) recordTurn(stats, record) },
```

</details>

<a id="research-q06"></a>

<a id="detail-section-22"></a>

### Q06 · 什么用户可以试用，什么条件下应暂缓？

**研究主题**：采用判断

#### 完整回答

建议使用脱敏任务、了解上游差异且愿意核对真实渠道的DSH用户试用，先从单个匿名车道或自有Key开始，不把所有账号池与局域网中继同时打开。应固定可信分发版本，确认managed/self所有权、监听范围、凭据位置，验收一次普通生成、工具调用、失败切换、停用与配置退出。若业务依赖稳定SLA、不能接受内容交给不确定上游，或无法复核分发来源，应暂缓。作者的功能列表和测试脚本不能代替当前宿主实测，因此仅建议可控试用，不建议持续安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:118-123](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L118-L123)

作者明确否认同名npm包由本仓库发布，要求使用仓库Release或源码。

```text
> **⚠️ 不要通过 npm 安装本插件。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
```

**依据 2 · 作者声明**：[README.md:130-168](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/README.md#L130-L168)

作者说明完整分发、安装与managed模式条件。

<details>
<summary>查看原文（39行）</summary>

````text
```
dsh plugin --profile web add /绝对路径/dsh-our-free-model
```

安装完成后重启应用一次。`--profile` 填写实际使用的 profile 名称。

**DSHEAC AIO / 桌面端：请先阅读本节**

部分 DSHEAC AIO / 旧版桌面整合包在启动 web 服务之前会执行 profile 闸门，
限制 profile 中的符号链接或目录 junction。若当前宿主包含该检查，可能报错：

```
PROFILE_UPGRADE_REQUIRED: offline dependency migration is not yet available
```

遇到该闸门时，不要使用 `link:` 依赖或 junction；使用应用内插件管理器，
或下方的本地 tarball 安装。不同宿主的限制以自身日志和安装机制为准。

以真实目录手工安装时，使用可信源码打出的本地 tarball：

1. 创建 `<DSH_HOME>/profiles/<profile>/vendor/`，在审核过的本仓库目录运行 `npm pack --ignore-scripts --pack-destination "<DSH_HOME>/profiles/<profile>/vendor"`，或将本仓库正式发布的同版本 tarball 放入该目录。本地打包不执行 npm 发布。
2. 在 profile 的 `package.json` 的 dependencies 中加入 `"dsh-our-free-model": "file:./vendor/dsh-our-free-model-2.5.9.tgz"`。文件名版本跟随仓库 `package.json`，不要改成同名 npm 注册表版本；再通过宿主的安装流程解析依赖。
3. 在 dsh.profile.bundles 末尾追加 `"dsh-our-free-model"`。

包管理器拥有这份安装的字节时，同时将 bundle config 或插件 `settings.json` 的 `distribution` 设为 `managed`，由包管理器统一更新；应用内升级、公告 feed 与热重载会停用，模型功能保留。以后更新时替换可信 tarball 并同步依赖路径，避免包管理器按旧锁文件恢复旧版本。

若手工复制发布文件，必须复制完整包，包括 `adapter/`、`src/`、`locale/` 和 `vendor/channel-pack/` 下的 `pack.js`、WASM、LICENSE、NOTICE；只复制入口脚本会导致渠道加载失败。

不要再向 cordis.patch.yml 添加条目。被 dsh.profile.bundles 引用的包，其自带的
patch 层会自动生效；两处同时注册将报错 duplicate loader entry id: our-free-model。

**整合包（托管安装）**

插件由整合包（EAC 整合包、Mojobox 等）安装时，更新时机与文件字节由安装方控制：
安装时将 bundle config 设为 distribution: 'managed'（或向 settings.json 写入
同一字段），插件的应用内升级、公告 feed 与热重载即全部停用——两个写入方同时操作
同一安装目录只会导致目录损坏；模型 lane 不受影响。相关验收见
scripts/offline-test.mjs；目录就绪记录（manifest 0.15 / 出处 / 许可 / 完整性）
位于 catalog/ 下。
````

</details>

**依据 3 · 源码核查**：[index.js:112-134](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/index.js#L112-L134)

更新所有权与managed模式限制。

<details>
<summary>查看原文（23行）</summary>

```text
/**
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
 */
const MANAGED_MESSAGE = 'this installation is managed; updates are handled by the pack that installed it'

/** Effective distribution mode: config override first, then the settings file. */
function distributionOf(config, settings) {
  if (config?.distribution === 'managed' || settings.get().distribution === 'managed') return 'managed'
  return 'self'
}

```

</details>

**依据 4 · 源码核查**：[src/forward.js:169-198](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/f3ecb7abcf5a0351645cfcbd638b9c7fbbcb3e97/src/forward.js#L169-L198)

监听地址可以作为试用验收边界。

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

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
