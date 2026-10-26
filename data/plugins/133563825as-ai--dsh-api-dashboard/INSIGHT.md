# dsh-api-dashboard

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b57f953](https://github.com/133563825as-ai/dsh-api-dashboard/tree/b57f9535c55aa39026931813e09834fa9f4f4d82)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)
<!-- END META -->

> **实现功能**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。

> **核心亮点**：把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](#research-q01)。

> **风险与缺陷**：部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](#research-q03)。

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
  - [Q01 · 余额和会话成本看板分别帮助什么决策？](#detail-section-11)
  - [Q02 · 平台余额和会话估算如何获取？](#detail-section-12)
  - [Q03 · 估算和平台字段有哪些精度边界？](#detail-section-13)
  - [Q04 · 凭据、HTTP入口和自更新各有什么边界？](#detail-section-14)
  - [Q05 · 维护、轮询和恢复成本如何判断？](#detail-section-15)
  - [Q06 · 什么范围值得试用，读者可继续从哪探讨？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多API平台用户希望在DSH工作流内看到余额线索和会话成本量级。详见[Q01](#research-q01)。

平台控制台账单、宿主token统计和人工价格表是替代，插件集中显示但没有独立账单真值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 平台余额/额度 | 运行中观察 | 依接口字段与新鲜度 |
| 成本投影 | 会话/子代理估算 | 参考价/默认价 |
| 配置/更新 | GUI维护 | Key信任和恢复事务 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| DSH web/connection/投影 | GUI与鉴权/成本 | 私有契约需匹配 |
| 凭据与平台接口 | 余额 | 读取账户权限需最小 |
| 可信自定义端点 | 自定义映射 | 会接收Bearer |
| 本地状态/更新备份 | 持久化/恢复 | Key明文/删拷非事务 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 限定平台/可信端点 | 用户 | Key不发未知方 |
| 配价格与刷新预算 | 用户 | 不拿默认作账单 |
| 看余额时间/估算币种 | 用户 | stale/额度可区分 |
| 与真实账单对照维护 | 用户 | 差异可解释并能恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容DSH/平台凭据 | 审阅端点/价格与本地权限 | 平台凭据/端点/价格需确认；初配金额和时间未知 |
| 持续使用 | 平台轮询/投影/GUI | 价格和账单核对，节费未知 | 平台数与刷新频率放大请求；可见账单不证明节费 |
| 失败恢复 | 状态和tar备份/重启 | 认证/旧缓存/更新失败核查 | 升级tar恢复和认证/缓存纠错工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 余额观察 | 多平台查询和stale | 接口/配额语义需核 |
| 会话估算 | usage/重试/子代理分组 | 参考价不等合同账单 |
| 维护反馈 | 告警/更新确认 | Key与代码写入需管理 |

> **思考**：部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](#research-q01)。

把多平台余额、usage/子代理成本与GUI提示联结，减少控制台切换和人工汇算。详见[Q01](#research-q01)。

缺字段守卫、轮询generation和HTTP fail-closed值得借鉴；需拆分大入口并完善价格来源/端点预算/更新事务。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

部分价格未核官方、未知模型走默认价；自定义端点携Key、状态明文存Key与删拷自更新扩大信任和恢复面。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

余额和估算联结有源码支持；参考价/默认价非账单、自定义端点和更新权限需控制，版本化收据为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、client/client.js、test/test-balance-guards.mjs、test/test-poll-lifecycle.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交关键服务器取数/凭据/估算/鉴权/更新链，README及余额守卫、客户端轮询mock；未穷尽4042行入口和全部GUI/通知路径，不执行目标。
- 下一步：进一步从调价/未知模型/长上下文、失败重试与子代理、旧余额及更新回滚探讨版本化估算收据。

**分析版本**

- **仓库**：[133563825as-ai/dsh-api-dashboard](https://github.com/133563825as-ai/dsh-api-dashboard)
- **版本号**：1.7.0（[固定提交 b57f953](https://github.com/133563825as-ai/dsh-api-dashboard/tree/b57f9535c55aa39026931813e09834fa9f4f4d82)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究绑定价格版本/档位/usage来源的估算收据与明确缺价，让余额/配额/成本单位分离并按账单对照。当前未验证。详见[Q06](#research-q06)。

进一步从调价/未知模型/长上下文、失败重试与子代理、旧余额及更新回滚探讨版本化估算收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1783 | — | — | 41793 |
| .js | source | 3 | 7736 | 5617 | 2095 | — |
| .mjs | test | 35 | 4043 | 3098 | 782 | — |
| .mjs | source | 2 | 356 | 263 | 65 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard/issues?q=is%3Aissue+created%3A2026-09-22T05%3A37%3A41.058Z..2026-10-22T05%3A37%3A41.058Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A37%3A41.058Z..2026-10-22T05%3A37%3A41.058Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本余额/会话估算如何取数，价格语义、凭据端点、自更新与生命周期怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 余额和会话成本看板分别帮助什么决策？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH使用多个API平台、想在工作过程中看到充值余额与当前会话消耗量级的用户。合格显示必须区分平台余额/套餐剩余额度、会话token估算、不同币种和旧缓存，不能把估算等同官方账单或余额差额。README把条带、详情、子代理和自定义中转接到同一Web界面，这减少切换平台控制台与手工计算。

简单替代是平台账单、宿主token统计或电子表格按合同价格计算。贡献是余额轮询与事件usage/子代理成本投影、币种分组及状态提示的联结，不是新的计费标准或准确财务账本。源码有多层守卫避免缺字段当0，仍要按各平台实际返回语义解释，不把所有“平台支持”理解为都可查询现金余额。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-57](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/README.md#L34-L57)

余额、估算、未开放接口的作者范围。

<details>
<summary>查看原文（24行）</summary>

```text
## 功能

- **三层 UI**：状态条（输入框下方）→ 看板抽屉（点状态条）→ 平台详情（点卡片 ⓘ）
- **峰谷趣味计费**：DeepSeek 工作日 9:00-12:00 / 14:00-18:00 显示 ☀️ 梁文峰，其余时间与周末 🌙 梁文谷（半价）
- **三色阈值灯**：绿 / 黄 / 红，阈值可自定义；余额首次跌破预警线自动推送通知
- **一键去充值**：平台详情里直接打开该平台的开放平台 / 充值页。手机版走宿主桥调系统浏览器
  （GUI 在 webview 里，`window.open` 开不出外部浏览器），桌面 / 浏览器回退新标签页
- **会话消耗估算**：按模型单价折算；混合币种两段显示 `~¥3.40+$12.50`，**不做汇率折算合并**
- **子代理消耗**：子代理单独成行、可横滑，单击查看分行详情；关闭胶囊后移到看板分区
- **大肥鱼挂件**（可选）：屏幕边缘一只可拖拽的互动挂件，纯娱乐，不显示任何金额
- **自定义接入**：中转站自动探测余额接口；自建接口支持点分路径手动映射
- **配置持久化**：阈值 / 币种 / 刷新间隔（1~60 秒）/ 自定义条目都存本地状态文件，重启不丢
- **一键自更新**：设置面板内检查并安装新版本（下载 → 校验 → 备份 → 替换 → 失败回滚）

## 支持平台

| 分组 | 平台 |
|---|---|
| 国内 | DeepSeek、智谱 GLM、Kimi、阶跃星辰、硅基流动、MiniMax |
| 海外 | OpenRouter、Novita AI、xAI Grok |
| 其他 | 自定义中转站（自动探测余额接口）、自定义模型（手动映射） |

> OpenAI / Claude / Gemini / Groq / Mistral / Together 等**未开放余额查询接口**，面板会如实显示「未开放」，
> **不会伪造数字**。智谱按量付费账户同样没有公开余额接口（显示中性「未开放」，不标红）。
```

</details>

**依据 2 · 源码核查**：[src/index.js:2675-2723](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2675-L2723)

子代理own成本与waiting。

<details>
<summary>查看原文（49行）</summary>

```text
  /** 取常驻会话对象。任何异常一律当成"取不到"(宿主服务在极端情况下可能抛)。 */
  const getSession = (id) => {
    try { return sessions?.get?.(id) ?? null } catch { return null }
  }

  /** 某会话的直接子会话(按创建顺序): 热路径优先, 空则回落到缓存文件。 */
  const childrenOf = (sessionId) => {
    const s = getSession(sessionId)
    if (s !== null && projections !== null) {
      try {
        const list = projections.snapshot(s, ['subagentCatalog'])?.values?.subagentCatalog
        if (Array.isArray(list) && list.length > 0) return list
      } catch { /* 落到冷路径 */ }
    }
    return cachedCatalog(sessionId)
  }

  /** 某会话的消耗投影状态: 热路径优先(更新鲜), 无数据则回落到缓存文件。 */
  const costStateOf = (sessionId) => {
    const s = getSession(sessionId)
    if (s !== null && projections !== null) {
      try {
        const st = projections.stateOf(s, 'queryBalanceCost')
        if (st !== null && st !== undefined) return st
      } catch { /* 落到冷路径 */ }
    }
    return cachedCostState(sessionId)
  }

  for (const entry of childrenOf(rootSessionId)) {
    if (out.length >= SUBAGENT_MAX_ROWS) break
    if (Array.isArray(ownChildIds) && !ownChildIds.includes(entry.id)) continue
    const st = costStateOf(entry.id)
    const ready = st?.ownBoundaryKnown === true && st?.own && Array.isArray(st.own.modelOrder)
    const waiting = !ready || st.own.modelOrder.length === 0
    const s = ready ? summarize(st.own) : emptySummary()
    out.push({
      id: String(entry.id),
      label: typeof entry.label === 'string' && entry.label !== '' ? entry.label : String(entry.id).slice(0, 12),
      mode: entry.mode === 'continuable' ? 'continuable' : 'one-shot',
      createdAt: typeof entry.createdAt === 'number' ? entry.createdAt : 0,
      cost: waiting ? -1 : s.cost,
      waiting,
      costByCurrency: s.costByCurrency,
      currencyByModel: s.currencyByModel,
      mixedCurrency: s.mixedCurrency,
      tokens: s.tokens,
      models: s.models,
    })
```

</details>

**依据 3 · 源码核查**：[test/test-balance-guards.mjs:7-44](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/test/test-balance-guards.mjs#L7-L44)

余额/额度及缺字段测试关注。

<details>
<summary>查看原文（38行）</summary>

```text
// ===== ① Kimi: limit 是**窗口上限**, 不是余额 =====
// 旧代码 `total: limit` → 客户端状态条/卡片/详情都取 total(从不看 available) → 配额耗尽也显示满额 + 绿灯。
{
  const r = m.parseResponse('kimi', { usage: { limit: 1000, remaining: 0 } })
  a('K1 剩余为 0 时 total = 0 (旧代码给的是上限 1000)', r !== null && r.total === 0)
  a('K1 但上限仍可在 note 里看到', r.note.includes('1000'))
  const r2 = m.parseResponse('kimi', { usage: { limit: 1000, remaining: 990 } })
  a('K2 有剩余时 total = 剩余量 990', r2.total === 990)
  a('K2 available 与 total 一致', r2.available === 990)
  a('K3 缺字段仍返回 null', m.parseResponse('kimi', { usage: {} }) === null)
}

// ===== ② 智谱: 只有 percentage 时**不能**当余额下发 =====
// percentage 是「已用/填充度」(100=用完), 方向还是反的。旧代码把它当 total → 88 分被判「绿灯余额充足」。
{
  a('G1 只有 percentage → null (不再冒充余额)', m.parseResponse('glm', { data: { limits: [{ unit: 5, percentage: 88 }] } }) === null)
  a('G2 没有 limits → null', m.parseResponse('glm', { data: {} }) === null)
  // 回归: 正常 Coding Plan 套餐路径必须**不受影响**
  const plan = m.parseResponse('glm', { data: { limits: [
    { unit: 3, remaining: 2000, percentage: 0 },
    { unit: 6, remaining: 0, percentage: 100, nextResetTime: '2026-09-08T00:00:00Z' },
  ] } })
  a('G3 套餐路径仍返回剩余积分 (2000)', plan !== null && plan.total === 2000)
  a('G3 用完的周配额在 note 里提示', plan.note.includes('周配额'))
  const usedUp = m.parseResponse('glm', { data: { limits: [{ unit: 3, remaining: 0, percentage: 100 }] } })
  a('G4 全部用尽 → total 0 且 note 说明', usedUp !== null && usedUp.total === 0 && usedUp.note.includes('已用完'))
}

// ===== ③ OpenRouter: 缺任一关键字段 → null, 绝不伪造负数余额 =====
// 旧守卫是 `&&`(两个都缺才放弃), 只缺 total_credits 时 toAmount(null)=0 → total = 0 - usage = 负数。
{
  const r = m.parseResponse('openrouter', { data: { total_usage: 100 } })
  a('O1 只缺 total_credits → null (旧代码算出 -100 的假负数)', r === null)
  const r2 = m.parseResponse('openrouter', { data: { total_credits: 50 } })
  a('O2 只缺 total_usage → null', r2 === null)
  const ok = m.parseResponse('openrouter', { data: { total_credits: 50, total_usage: 10 } })
  a('O3 字段齐全仍正常计算 (50-10=40)', ok !== null && ok.total === 40)
  a('O4 两字段都缺 → null', m.parseResponse('openrouter', { data: {} }) === null)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 平台余额和会话估算如何获取？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主定时refreshAll发现预设、手填relay和DSH provider，合并去重后Promise.allSettled查询；inflight复用避免同实例重叠。失败非认证时可保留last-known-good并加staleNote，/balances支持冷启动等待、旧缓存后台刷新和ETag。客户端按订阅/可见性轮询，余额数据并非每帧实时账单。

另以queryBalanceCost投影读取assistant/message或attempt的最后usage，按request header/context跟踪模型/供应商，retry-started关闭替换槽保留失败尝试，按event.time分峰谷再按内置/自填价格折算；子会话优先热投影否则读持久缓存。凭据优先环境，再credentials，再直接读凭据YAML回退。需要匹配DSH客户端、webServer、connection.requestRejection和投影事件契约，peer兼容范围不是逐环境验收结论；README实际作者验收集中0.2.0-rc.2 Android，桌面/旧线不扩大保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3350-3387](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3350-L3387)

轮询inflight/扇出/stale。

<details>
<summary>查看原文（38行）</summary>

```text
  let cache = { balances: [], fetchedAt: 0, error: null }
  let inflight = null

  const refreshAll = async () => {
    if (!loopActive) return
    if (inflight !== null) return inflight
    inflight = (async () => {
      const presetList = PLATFORM_PRESETS.filter(p => runtimeConfig.presets.includes(p.id))
      // v1.4.0「真自动」: 手填的 customRelays + 从 settings.yaml 自动发现的 DSH provider。
      // 手填优先 —— 同 id 或同 baseUrl 时不重复查一遍 (用户手填的那条口径由他自己定)。
      const manualRelays = runtimeConfig.customRelays
      const dshRelays = await listDshProviderRelays()
      const manualIds = new Set(manualRelays.map(r => String(r.id)))
      const manualUrls = new Set(manualRelays.map(r => String(r.baseUrl || '').replace(/\/+$/, '')))
      const relayList = [
        ...manualRelays,
        ...dshRelays.filter(r => !manualIds.has(r.id) && !manualUrls.has(r.baseUrl)),
      ]
      const modelList = runtimeConfig.customModels
      const tasks = [
        ...presetList.map(async (p) => queryPreset(p, await resolvePresetKey(p), runtimeConfig)),
        ...relayList.map(async (r) => queryCustomRelay(r, runtimeConfig)),
        ...modelList.map(async (m) => queryCustomModel(m, runtimeConfig)),
      ]
      const results = await Promise.allSettled(tasks)
      if (!loopActive) return // 卸载后的在飞结果不能再写告警/缓存。
      // v0.5.7: last-known-good 兜底 — 平台瞬时网络故障(超时/DNS抖动)不冲掉上次成功数据,
      // 避免看板红闪「异常」; 标注 stale 提示用户这是暂存值
      const prevBalances = Array.isArray(cache.balances) ? cache.balances : []
      const prevOf = new Map(prevBalances.map((b) => [b.platform, b]))
      const balances = results.map((r) => {
        const cur = r.status === 'fulfilled' ? r.value : { platform: 'unknown', name: '未知', icon: 'relay', color: '#64748B', category: '中转站', status: 'error', error: '查询失败', noBalance: true }
        if (cur && cur.status === 'error' && !String(cur.error || '').includes('认证')) {
          const old = prevOf.get(cur.platform)
          if (old && old.status === 'ok') {
            return { ...old, fetchedAt: old.fetchedAt, staleNote: '暂用上次数据(本次查询失败)', error: undefined }
          }
        }
```

</details>

**依据 2 · 源码核查**：[src/index.js:3513-3545](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3513-L3545)

HTTP余额取数策略。

<details>
<summary>查看原文（33行）</summary>

```text
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'exact', path: '/api-dashboard/balances',
      async handler(req, res) {
        if (!allowRequest(req, res)) return
        if (!['GET', 'HEAD', 'POST'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD, POST' }); res.end(); return }
        const params = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams
        const force = req.method === 'POST' || params.get('force') === '1'
        /**
         * v1.4.0 `?stale=1` = stale-while-revalidate:
         * 「把手上有的先给我」。应用切回前台 / 页面重载时用它打首屏。
         * 为什么需要它: `force=1` 是**阻塞**的 —— 底下 `await refreshAll()` 要等最慢的那个
         * 端点(最长 timeoutMs=8s)。首屏卡这么久, 用户看到的就是「插件加载很慢」。
         * 有缓存时改成「立刻回旧数据 + 后台刷新」, 由下一次轮询把新数据带上来。
         * 没有缓存(服务端刚重启)时仍然只能等 —— 那时确实没有东西可显示。
         */
        const peek = params.get('stale') === '1'
        const plan = planBalancesFetch({
          force, peek,
          hasData: cache.balances.length > 0,
          age: Date.now() - cache.fetchedAt,
          intervalMs: runtimeConfig.refreshIntervalMs,
        })
        if (plan === 'wait') await refreshAll()                    // 冷启动/显式强刷: 等新数据
        else if (plan === 'background') refreshAll().catch(() => {}) // 有缓存: 立刻回旧的, 刷新丢后台
        // v0.5.0: ETag 协商缓存 — 轮询期间数据没变就 304 空响应, 省 JSON 序列化与流量
        const etag = cache.etag || '"' + Number(cache.fetchedAt || 0).toString(36) + '"'
        if (req.method === 'HEAD') { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ETag: etag }); res.end(); return }
        if (!force && req.headers['if-none-match'] === etag && cache.balances.length > 0) {
          res.writeHead(304, { ETag: etag })
          res.end()
          return
        }
        const body = JSON.stringify({ ok: true, balances: cache.balances, fetchedAt: cache.fetchedAt, config: cache.config, loading: cache.balances.length === 0 })
```

</details>

**依据 3 · 源码核查**：[src/index.js:2848-2867](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2848-L2867)

usage提取。

<details>
<summary>查看原文（20行）</summary>

```text
  const lastUsageFromStream = (stream) => {
    if (!Array.isArray(stream)) return undefined
    for (let i = stream.length - 1; i >= 0; i -= 1) {
      const rec = stream[i]
      if (rec !== null && typeof rec === 'object' && rec.type === 'chunk' && rec.chunk?.type === 'usage') return rec.chunk.usage
    }
    return undefined
  }

  /**
   * v1.4.0: 一个事件所携带的用量样本。对齐 dsh-token-meter 的 usage-projection:
   *   - `assistant/message` 优先用自带 `usage`, 没有则回落到 stream 里的 usage chunk;
   *   - `assistant/attempt`(失败/重试/取消/流错误、没有产出可见消息的尝试) 从 stream 里取。
   * ⚠️ 旧代码读的是 `assistant/chunk` —— 该事件名**不在**框架 `KNOWN_SESSION_EVENT_TYPES` 里, 是死分支,
   *    导致上面两种真实事件里 `assistant/attempt` 的 token 被整段漏计。
   */
  const usageOfEvent = (event) => {
    if (event.type === 'assistant/message' && event.data.usage !== undefined) return event.data.usage
    if (event.type !== 'assistant/message' && event.type !== 'assistant/attempt') return undefined
    return lastUsageFromStream(event.data.stream)
```

</details>

**依据 4 · 源码核查**：[src/index.js:2960-2999](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2960-L2999)

retry/model/时间计价。

<details>
<summary>查看原文（40行）</summary>

```text
  const foldUsage = (state, event) => {
      // v1.4.0: `llm/retry-started` 关闭「替换槽位」—— 被重试的那次 attempt 的用量要**留在总量里**,
      // 下一次 attempt 是**新增**而不是替换。与 dsh-token-meter 的 usage-projection 对齐。
      if (event.type === 'llm/retry-started') {
        const turn = event.data?.turn
        const step = event.data?.step
        return state.last !== null && state.last.turn === turn && state.last.step === step
          ? { ...state, last: null }
          : state
      }
      let nextModel = state.currentModel
      let nextProvider = state.currentProvider
      if (event.type === 'request/header') {
        const model = event.data.header?.config?.model
        if (typeof model === 'string' && model !== '') nextModel = model
        const prov = event.data.header?.config?.provider
        if (typeof prov === 'string' && prov !== '') nextProvider = prov
      } else if (event.type === 'request/context') {
        const model = event.data.model
        if (typeof model === 'string' && model !== '') nextModel = model
        const prov = event.data.provider
        if (typeof prov === 'string' && prov !== '') nextProvider = prov
      }
      let usage = null, turn = 0, step = 0
      const sample = usageOfEvent(event)
      if (sample !== undefined && sample !== null) {
        turn = event.data.turn
        step = event.data.step
        usage = sample
      }
      const unchanged = nextModel === state.currentModel && nextProvider === state.currentProvider
      if (usage === null) return unchanged ? state : { ...state, currentModel: nextModel, currentProvider: nextProvider }
      const model = nextModel ?? 'unknown'
      const buckets = bucketsOf(usage)
      // v1.5.0: 按**事件发生时刻**(event.time)判定峰谷, 而不是等 summarize 时用 Date.now()。
      //   后者会把整段历史消耗都按"打开面板那一刻"的时段计价 —— DeepSeek 峰谷价差 2 倍,
      //   谷时跑的量在峰时查看会被翻倍, 反之漏掉一半。事件无 time 时回退当前时刻。
      const eventTime = Number.isFinite(event?.time) ? event.time : Date.now()
      const phase = phaseOfModel(model, eventTime)
      const day = dayKeyOf(eventTime)
```

</details>

**依据 5 · 源码核查**：[src/index.js:3270-3281](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3270-L3281)

凭据三层回退。

<details>
<summary>查看原文（12行）</summary>

```text
  const resolveApiKeyRef = async (ref) => {
    const name = typeof ref === 'string' ? ref.trim() : ''
    if (name === '') return ''
    if (process.env[name]) return process.env[name]
    const creds = ctx.get('credentials')
    if (creds !== undefined) {
      try {
        const hit = await creds.resolve(name)
        if (hit !== undefined) return hit.value
      } catch { /* 忽略 */ }
    }
    return readCredentialRefs([name])
```

</details>

**依据 6 · 作者声明**：[README.md:16-19](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/README.md#L16-L19)

作者范围说明。

```text
**兼容说明：**本轮实际验收为 DSH `0.2.0-rc.2`、Node 24、Android DSHA Web；保留 `0.1.x` 声明范围，但旧宿主、各桌面系统未做本轮完整真机验收。电脑端这里指 Web GUI 的响应式布局，不能等同官方 Desktop profile 已完整验证。

> ⚠️ **安装或维护本插件之前，请先读 [`AGENTS.md`](AGENTS.md)** —— 数据准确性红线、踩过的坑、安装姿势对照都在那里。
> 本插件深度绑定 DeepSeek Harness 的客户端与宿主 API，**只能在 DSH 里运行**（手机版 DSHA 与桌面版同框架）。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 估算和平台字段有哪些精度边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

价格表是固定提交的参考数据，部分新模型条目明确未核官方原文，仅第三方目录交叉；长上下文、优先级、Batch等不在基础表覆盖。未知模型会落defaultPrices并换显示币种，不是“不知道就不算”，所以数值完整不等价格适用。用户需要用实际合同/模型档位设置覆盖，报告不引用任何具体金额为当前官方价格。历史token桶后续summarize可用当前getConfig价格，若价格被修改，历史估值也可能重算，不能当不可变账单。

平台接口字段映射与total/used含义各异。自定义手动映射把totalPath数值作为total，另以used计算available，设置者必须确认它表示余额还是配额；自动relay探测失败最后统一为“未开放”，混合网络/认证/不支持不能据该文字断言平台事实。stale旧余额保持原fetchedAt是良好区分，但不能用当前全轮fetchedAt当每个平台新鲜度。计费usage还受事件覆盖、model映射、继承和重试语义影响，固定测试不证明账单一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1272-1276](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L1272-L1276)

参考价格及未覆盖档。

```text
  // ⚠️ 参考价，未核实官方原文（OpenAI 页面403，Anthropic 文档不可达）。单位 USD / 1M tokens。
  // 来源 https://github.com/sst/models.dev/tree/dev/providers/openai/models
  //      https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json
  // 这里只采用 Standard 基础档；GPT-6/6.1 >272K、Haiku5.5 >100K 及 priority/ultrafast/Batch 不在本表覆盖。
  // 使用长上下文/快档应手动覆盖价格，不能把这些参考基础价当平台实际扣费。
```

**依据 2 · 源码核查**：[src/index.js:1580-1612](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L1580-L1612)

自定义优先/默认价格。

<details>
<summary>查看原文（33行）</summary>

```text
export const resolveModelPrice = (configOrGetter, model, timestamp = Date.now(), phase = null) => {
  const config = typeof configOrGetter === 'function' ? configOrGetter() : configOrGetter
  const peak = isPeakTime(timestamp)
  const display = currencyForModel(config, model)

  // 自定义价格优先 (用户自填, 币种由用户自己把握, 不做换算)
  if (typeof model === 'string' && config?.prices && Object.prototype.hasOwnProperty.call(config.prices, model) && config.prices[model]) {
    return config.prices[model]
  }

  // v0.5.3 修复: 原 startsWith('deepseek') 会把 deepseek-chat/reasoner 劫持进 V4 峰谷表,
  // 导致其按 v4-flash 价格计费 (output 虚高至 4.5 倍)。仅匹配现役 v4 系列 + 收敛后的 deepseek-flash。
  // v1.3.4: 官方收敛模型名后, deepseek-flash 与旧名 deepseek-v4-flash / -vision-exp 同档
  //   (旧名仍可调用, 由 V4.1-Flash 服务并按 Flash 价计费) → 一律映射到 flash 档位。
  // DeepSeek v4 走 V4_RATES 峰谷表 (自带 CNY/USD 两套, 按显示币种选表)
  if (typeof model === 'string' && (model.startsWith('deepseek-v4') || model.startsWith('deepseek-flash'))) {
    const table = V4_RATES[display] ?? V4_RATES.CNY
    const key = model.startsWith('deepseek-v4-pro') ? 'deepseek-v4-pro' : 'deepseek-flash'
    // v1.5.0 峰谷分相: phase 显式给出时以它为准(历史上的每笔消耗按各自发生时刻计价),
    //   为 null 才回退到「按 timestamp 判定」的老行为 —— 默认参数保持向后兼容。
    const usePeak = phase === 'peak' ? true : phase === 'offPeak' ? false : peak
    const hit = (usePeak ? table.peak[key] : table.offPeak[key])
    if (hit) return { ...hit }
  }

  // 查通用表 (精确名 → 安全后缀前缀兜底)。条目按原生币种存储, 换算到显示币种。
  if (typeof model === 'string' && model !== '') {
    const entry = matchModelPrice(model)
    if (entry) return convertPrice(entry, nativeCurrencyOf(model), display)
  }

  // 都未命中: 落 defaultPrices。⚠️ defaultPrices 的单位是 **USD** (与 v1.2.x 一致, 未随 v1.4.0 改动)。
  return convertPrice(config?.defaultPrices ?? { cacheHit: 0.1, cacheMiss: 1, output: 2 }, 'USD', display)
```

</details>

**依据 3 · 源码核查**：[src/index.js:2388-2415](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2388-L2415)

自定义total/available语义。

<details>
<summary>查看原文（28行）</summary>

```text
export async function queryCustomModel(model, config) {
  const { id, name, apiUrl, apiKey, queryType, totalPath, usedPath, currency } = model
  const base = { platform: id, name: name || '自定义模型', icon: 'relay', color: '#8B5CF6', category: '自定义' }
  if (!apiUrl) {
    return { ...base, status: 'no-key', error: '未配置接口 URL', noBalance: true }
  }
  const headers = { Accept: 'application/json' }
  if (apiKey) headers['Authorization'] = apiKey.trim().startsWith('Bearer') ? apiKey.trim() : `Bearer ${apiKey.trim()}`
  try {
    const res = await fetchWithTimeout(apiUrl, headers, config.timeoutMs || 8000, 'GET')
    if (!res.ok) {
      const isAuth = res.status === 401 || res.status === 403
      return { ...base, status: isAuth ? 'auth-error' : 'error', error: `HTTP ${res.status}${isAuth ? ' (认证失败)' : ''}`, noBalance: true }
    }
    const text = await res.text()
    let json
    try { json = JSON.parse(text) } catch { json = null }

    // 1) 手动映射优先 (totalPath 点分路径, 如 data.balance)
    if (totalPath) {
      const raw = dotGet(json, totalPath)
      const total = toAmount(raw)
      if (raw != null && Number.isFinite(Number(raw))) {
        const used = usedPath ? toAmount(dotGet(json, usedPath)) : null
        return {
          ...base, status: 'ok', total, currency: currency || 'CNY',
          available: used != null && used >= 0 ? total - used : total, used,
          note: '自定义映射', percent: null, noBalance: false, queryType: 'custom', fetchedAt: Date.now(),
```

</details>

**依据 4 · 源码核查**：[src/index.js:2347-2375](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2347-L2375)

探测失败统一no-balance-api。

<details>
<summary>查看原文（29行）</summary>

```text
  for (const cand of candidates) {
    const headers = { Accept: 'application/json', Authorization: `Bearer ${apiKey}` }
    const method = cand.type === 'quota' ? 'POST' : 'GET'
    try {
      const res = await fetchWithTimeout(base + cand.path, headers, config.timeoutMs || 8000, method)
      if (!res.ok) continue
      const text = await res.text()
      let json
      try { json = JSON.parse(text) } catch { continue }
      const parsed = parseResponse(cand.type, json, config?.currency)
      if (parsed) {
        // A: 记住这次命中的端点（变了才落盘, 避免每次刷新都写状态文件）
        if (relayEndpointHints.get(id) !== cand.type) {
          relayEndpointHints.set(id, cand.type)
          try { savePersistedState({ relayEndpoints: Object.fromEntries(relayEndpointHints) }) } catch { /* 落盘失败不影响本次结果 */ }
        }
        return {
          platform: id, name: name || '中转站', icon: 'relay', color: '#64748B', category: '中转站',
          status: 'ok', total: parsed.total, currency: parsed.currency, available: parsed.available,
          used: parsed.used, note: parsed.note || cand.type, percent: parsed.percent,
          noBalance: false, queryType: cand.type, fetchedAt: Date.now(), fromDsh,
        }
      }
    } catch { /* 尝试下一个 */ }
  }

  return {
    platform: id, name: name || '中转站', icon: 'relay', color: '#64748B', category: '中转站',
    status: 'no-balance-api', error: '该平台未开放余额查询', noBalance: true, fromDsh,
```

</details>

**依据 5 · 源码核查**：[src/index.js:3376-3399](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3376-L3399)

旧平台时间与全轮时间。

<details>
<summary>查看原文（24行）</summary>

```text
      // v0.5.7: last-known-good 兜底 — 平台瞬时网络故障(超时/DNS抖动)不冲掉上次成功数据,
      // 避免看板红闪「异常」; 标注 stale 提示用户这是暂存值
      const prevBalances = Array.isArray(cache.balances) ? cache.balances : []
      const prevOf = new Map(prevBalances.map((b) => [b.platform, b]))
      const balances = results.map((r) => {
        const cur = r.status === 'fulfilled' ? r.value : { platform: 'unknown', name: '未知', icon: 'relay', color: '#64748B', category: '中转站', status: 'error', error: '查询失败', noBalance: true }
        if (cur && cur.status === 'error' && !String(cur.error || '').includes('认证')) {
          const old = prevOf.get(cur.platform)
          if (old && old.status === 'ok') {
            return { ...old, fetchedAt: old.fetchedAt, staleNote: '暂用上次数据(本次查询失败)', error: undefined }
          }
        }
        return cur
      })
      // v1.6.0: 给每个平台挂上「去充值」地址, 客户端卡片直接读 —— 省掉再拉一次 /platforms。
      // 地址**只**来自服务端预设表; 自定义中转站没有"开放平台"可言, 查不到就不挂字段,
      // 卡片上自然不出现按钮 (宁缺毋滥, 不给一个点了会 404 的入口)。
      const consoleUrlOf = new Map(PLATFORM_PRESETS.filter(p => p.consoleUrl).map(p => [p.id, p.consoleUrl]))
      for (const b of balances) {
        const u = consoleUrlOf.get(b.platform)
        if (u) b.consoleUrl = u
      }
      cache = {
        balances, fetchedAt: Date.now(), error: null,
```

</details>

#### 缺口

- 平台真实返回/合同价格/当前模型usage口径没有本轮账号材料
  **影响**：不能给估算相对官方账单的误差或采用收益
  **进一步探讨**：读者以自己的平台账单和固定请求usage逐项核对，保留未知价而非默认放行

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、HTTP入口和自更新各有什么边界？

**研究主题**：工程质量与复用

#### 完整回答

HTTP路由统一allowRequest，connection服务未就绪或异常503拒绝，按requestRejection做宿主cookie/来源判定，不能因exact route就旧式推断绕过鉴权。状态文件写临时+rename，显式0600并chmod修复旧文件，但含自定义API Key明文，依赖本地账号/目录边界；直接读credentials文件回退也扩大插件能接触秘密的面。自定义apiUrl/baseUrl会携Bearer发请求，此调用链无HTTPS/私网拒绝校验，必须由设置者决定信任接收方，不自动发现就等于可信。

自更新是实质代码写入能力。POST需确认版本和64hex token，下载后检查包名/版本/manifest摘要、兼容及语法，备份再删除复制，拒绝符号链接目标且保留.git/node_modules；这是可查防错机制，不是发布包全代码签名。宿主锁只探测未持锁，交换是删拷而非原子切换，多目录回滚best effort，远程下载整体arrayBuffer也没在此限体积。运行进程不自动重载，新代码需重启；无需为了看余额频繁使用这条路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3495-3510](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3495-L3510)

连接缺失/异常拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
    let connectionSvc = null
    ctx.inject(['connection'], (c) => {
      connectionSvc = c.connection
      return () => { connectionSvc = null }
    })
    const allowRequest = (req, res) => {
      const conn = connectionSvc
      // 依赖尚未就绪/已卸载/校验异常时拒绝，不能把加载竞态变成鉴权绕过。
      let rejection = 503
      if (conn && typeof conn.requestRejection === 'function') {
        try { rejection = conn.requestRejection(req) } catch { rejection = 503 }
      }
      if (rejection === undefined) return true
      res.writeHead(rejection, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
      res.end(rejection === 401 ? 'dsh web authentication required; reopen the URL printed by dsh web.\n' : 'forbidden\n')
      return false
```

</details>

**依据 2 · 源码核查**：[src/index.js:590-600](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L590-L600)

含明文key文件0600。

<details>
<summary>查看原文（11行）</summary>

```text
const savePersistedState = (state) => {
  try {
    const merged = { ...loadPersistedState(), ...state }
    // H-4c (v1.4.1): 以前这里从不建父目录, 且吞掉所有异常 → ~/.dsh 不存在时
    // 接口照样回 ok:true, 用户配置"保存成功"却没落盘, 重启即丢。现在先建目录。
    mkdirSync(dirname(STATE_FILE), { recursive: true })
    // mode 0o600: 状态文件含自定义中转站/模型的 API Key 明文, 必须限定本用户可读
    // (不能依赖 umask —— 默认 umask 0022 的桌面机会落成 0644); chmod 兜底修正旧文件
    writeFileSync(STATE_FILE + '.tmp', JSON.stringify(merged, null, 2), { encoding: 'utf8', mode: 0o600 })
    renameSync(STATE_FILE + '.tmp', STATE_FILE)
    try { chmodSync(STATE_FILE, 0o600) } catch { /* 平台不支持或已是 0600, 忽略 */ }
```

</details>

**依据 3 · 源码核查**：[src/index.js:2347-2353](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2347-L2353)

relay带key向配置端点请求。

```text
  for (const cand of candidates) {
    const headers = { Accept: 'application/json', Authorization: `Bearer ${apiKey}` }
    const method = cand.type === 'quota' ? 'POST' : 'GET'
    try {
      const res = await fetchWithTimeout(base + cand.path, headers, config.timeoutMs || 8000, method)
      if (!res.ok) continue
      const text = await res.text()
```

**依据 4 · 源码核查**：[src/index.js:2388-2397](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2388-L2397)

自定义任意apiUrl带key。

<details>
<summary>查看原文（10行）</summary>

```text
export async function queryCustomModel(model, config) {
  const { id, name, apiUrl, apiKey, queryType, totalPath, usedPath, currency } = model
  const base = { platform: id, name: name || '自定义模型', icon: 'relay', color: '#8B5CF6', category: '自定义' }
  if (!apiUrl) {
    return { ...base, status: 'no-key', error: '未配置接口 URL', noBalance: true }
  }
  const headers = { Accept: 'application/json' }
  if (apiKey) headers['Authorization'] = apiKey.trim().startsWith('Bearer') ? apiKey.trim() : `Bearer ${apiKey.trim()}`
  try {
    const res = await fetchWithTimeout(apiUrl, headers, config.timeoutMs || 8000, 'GET')
```

</details>

**依据 5 · 源码核查**：[src/index.js:3608-3628](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3608-L3628)

POST确认与错误。

<details>
<summary>查看原文（21行）</summary>

```text
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'exact', path: '/api-dashboard/update/install',
      async handler(req, res) {
        if (!allowRequest(req, res)) return
        if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST' }); res.end(); return }
        try {
          let payload
          try { payload = JSON.parse(await readBody(req)) } catch { return sendJson(res, 400, { ok: false, error: 'invalid-confirmation' }) }
          if (typeof payload?.expectedVersion !== 'string' || !semver.valid(payload.expectedVersion)
              || !/^[a-f0-9]{64}$/.test(payload?.confirmationToken ?? '')) return sendJson(res, 400, { ok: false, error: 'invalid-confirmation' })
          const result = await applyUpdate({ expectedVersion: payload.expectedVersion, confirmationToken: payload.confirmationToken })
          updateCache = { checkedAt: Date.now(), result: { ok: true, current: result.installed, remote: result.installed, hasUpdate: false, checkedAt: Date.now() } }
          sendJson(res, 200, { ok: true, installed: result.installed, targets: result.targets, backup: result.backup, needRestart: true })
        } catch (err) {
          if (['update-incompatible', 'update-unknown', 'update-changed', 'update-busy', 'update-dependencies'].includes(err?.code)) {
            return sendJson(res, 409, { ok: false, error: err.code })
          }
          const msg = /already up to date/.test(String(err?.message)) ? `already up to date`
            : /GitHub API|download|remote version/.test(String(err?.message)) ? 'network failed'
            : 'update failed'
          const code = /already up to date/.test(String(err?.message)) ? 200 : 500
```

</details>

**依据 6 · 源码核查**：[src/index.js:339-362](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L339-L362)

符号链接拒绝和下载。

<details>
<summary>查看原文（24行）</summary>

```text
  for (const dir of dirs) {
    let st = null
    try { st = lstatSync(dir) } catch { st = null }
    if (st && st.isSymbolicLink()) {
      throw new Error(`refusing to update a symbolic-link target: ${dir} (use its real path instead)`)
    }
  }
  // 报告 §2.6: 与宿主插件管理器抢同一个目录时的互斥 —— **尽力而为**, 见 assertHostLockFree 的说明。
  assertHostLockFree()

  // 1) 下载 tarball 到临时文件
  const tmpBase = join(tmpdir(), `dshadb-update-${Date.now()}`)
  mkdirSync(tmpBase, { recursive: true })
  const tgzPath = join(tmpBase, 'pkg.tar.gz')
  const extractDir = join(tmpBase, 'extract')
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  let swapped = false
  try {
    if (localTarball) {
      cpSync(localTarball, tgzPath)
    } else {
      const res = await fetch(remote.tarballUrl, { signal: AbortSignal.timeout(timeoutMs) })
      if (!res.ok) throw new Error(`download ${res.status}`)
      writeFileSync(tgzPath, Buffer.from(await res.arrayBuffer()))
```

</details>

**依据 7 · 源码核查**：[src/index.js:367-426](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L367-L426)

校验/备份/删拷/回滚。

<details>
<summary>查看原文（60行）</summary>

```text
    // 3) 校验: 版本号匹配预期 + 关键文件齐全 + 包名一致 (装坏了宁可拒绝, 保住回滚机会)
    if (readVersionAt(extractDir) !== wantVersion) throw new Error('extracted version mismatch')
    const extractedManifest = JSON.parse(readFileSync(join(extractDir, 'package.json'), 'utf8'))
    if (extractedManifest.name !== 'dsh-api-dashboard') throw new Error('extracted package name mismatch')
    const extractedCompatibility = evaluateUpdateCompatibility(extractedManifest, await runtimeDshVersion())
    if (extractedCompatibility.status !== 'compatible') throw updateError('update-' + extractedCompatibility.status)
    if (remote && manifestDigest(extractedManifest) !== manifestDigest(remote.manifest)) throw updateError('update-changed')
    // 原地更新不会安装新增依赖：必须确认现有依赖能满足目标声明。
    for (const [dependency, range] of Object.entries(extractedManifest.dependencies ?? {})) {
      let installedVersion = null
      try {
        const dependencyPkg = await resolvePeer(dependency + '/package.json')
        installedVersion = (dependencyPkg.default ?? dependencyPkg).version
      } catch { /* 未安装或无法核验 → 交给宿主管理器安装 */ }
      if (!semver.valid(installedVersion) || !semver.validRange(range)
          || !semver.satisfies(installedVersion, range, { includePrerelease: true })) throw updateError('update-dependencies')
    }
    for (const rel of ['src/index.js', 'client/client.js']) {
      execFileSync(process.execPath, ['--check', join(extractDir, rel)], { timeout: 10000, stdio: 'ignore' })
    }
    // 提交前重新检查；这是尽力而为的宿主锁探测，不宣称持锁互斥。
    assertHostLockFree()
    if (readVersionAt(SELF_ROOT) !== currentVersion) throw updateError('update-changed')
    for (const rel of ['src/index.js', 'client/client.js', 'cordis.patch.yml']) {
      if (!existsSync(join(extractDir, rel))) throw new Error(`missing file after extract: ${rel}`)
    }
    // 4) 备份每个目标目录 (tar 包存于其父目录旁, 不放包内避免自我包含)
    for (const dir of dirs) {
      execFileSync('tar', ['czf', `${dir}.preupdate-${stamp}.tar.gz`, '-C', dirname(dir), basename(dir)], { timeout: 20000 })
    }
    // 5) 交换: 删旧内容 → 拷新内容 (node_modules 保留, 避免重装依赖)
    for (const dir of dirs) {
      swapped = true
      // H-2 (v1.4.1): 必须保留 .git —— codeload 的 tarball 里没有它(实测),
      // 删掉就等于把用户的 git 历史抹了, 且没有任何恢复途径。
      const keep = new Set(['node_modules', '.git'])
      for (const entry of readdirSafe(dir)) {
        if (!keep.has(entry)) rmSync(join(dir, entry), { recursive: true, force: true })
      }
      cpSync(extractDir, dir, { recursive: true })
      if (readVersionAt(dir) !== wantVersion) throw new Error(`verify failed at ${dir}`)
    }
    return { installed: wantVersion, targets: dirs, backup: `${dirs[0]}.preupdate-${stamp}.tar.gz` }
  } catch (err) {
    // 回滚: 仅在已开始交换后才需要; 从本次备份整目录还原
    if (swapped) {
      for (const dir of dirs) {
        try {
          const bakTar = `${dir}.preupdate-${stamp}.tar.gz`
          if (!existsSync(bakTar)) continue
          rmSync(dir, { recursive: true, force: true })
          mkdirSync(dir, { recursive: true })
          execFileSync('tar', ['xzf', bakTar, '-C', dirname(dir)], { timeout: 20000 })
        } catch { /* 回滚自身失败时保留备份 tar 供手动恢复 */ }
      }
    }
    throw err
  } finally {
    // 临时区无论成败都清掉 (备份 tar 在 targets 旁边, 不受影响)
    rmSync(tmpBase, { recursive: true, force: true })
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 维护、轮询和恢复成本如何判断？

**研究主题**：效果与总成本

#### 完整回答

首次要对齐宿主/客户端并确定只读取哪些平台、凭据和自定义端点；默认/设置可到秒级刷新，平台数和自动探测候选共同放大请求数，可能触发平台限额。插件不为展示本身调用LLM，但API请求、网络、会话投影回放/聚合和GUI轮询占资源，告警还依赖可用宿主桥；实际节费未知，看到成本不等减少成本。

refresh loop有generation/active控制，卸载清定时器，已发网络请求并未共享主动取消，但allSettled结束后会检查active避免回写告警/缓存。客户端mock lifecycle测试检查最后订阅离开、后台暂停和重新订阅，不替代真实设备。恢复包含保存原配置/凭据、核对stale/未知模型、重建投影，升级失败手工从tar备份恢复；同目录由宿主管理器更新可能冲突，应以已有宿主更新流程为主要选择。长文件单入口逾四千行增加版本定位负担，本轮只选关键链不宣称完整审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3353-3375](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3353-L3375)

在飞复用与卸载后不写。

<details>
<summary>查看原文（23行）</summary>

```text
  const refreshAll = async () => {
    if (!loopActive) return
    if (inflight !== null) return inflight
    inflight = (async () => {
      const presetList = PLATFORM_PRESETS.filter(p => runtimeConfig.presets.includes(p.id))
      // v1.4.0「真自动」: 手填的 customRelays + 从 settings.yaml 自动发现的 DSH provider。
      // 手填优先 —— 同 id 或同 baseUrl 时不重复查一遍 (用户手填的那条口径由他自己定)。
      const manualRelays = runtimeConfig.customRelays
      const dshRelays = await listDshProviderRelays()
      const manualIds = new Set(manualRelays.map(r => String(r.id)))
      const manualUrls = new Set(manualRelays.map(r => String(r.baseUrl || '').replace(/\/+$/, '')))
      const relayList = [
        ...manualRelays,
        ...dshRelays.filter(r => !manualIds.has(r.id) && !manualUrls.has(r.baseUrl)),
      ]
      const modelList = runtimeConfig.customModels
      const tasks = [
        ...presetList.map(async (p) => queryPreset(p, await resolvePresetKey(p), runtimeConfig)),
        ...relayList.map(async (r) => queryCustomRelay(r, runtimeConfig)),
        ...modelList.map(async (m) => queryCustomModel(m, runtimeConfig)),
      ]
      const results = await Promise.allSettled(tasks)
      if (!loopActive) return // 卸载后的在飞结果不能再写告警/缓存。
```

</details>

**依据 2 · 源码核查**：[src/index.js:3435-3457](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3435-L3457)

loop生命周期。

<details>
<summary>查看原文（23行）</summary>

```text
  let loopTimer = null, loopGeneration = 0, loopActive = false
  const resetLoop = () => {
    const generation = ++loopGeneration
    if (loopTimer !== null) { clearTimeout(loopTimer); loopTimer = null }
    if (!loopActive) return
    const run = () => {
      loopTimer = null
      if (!loopActive || generation !== loopGeneration) return
      refreshAll().catch(() => {}).finally(() => {
        if (loopActive && generation === loopGeneration) loopTimer = setTimeout(run, runtimeConfig.refreshIntervalMs)
      })
    }
    loopTimer = setTimeout(run, 0)
  }

  ctx.effect(() => {
    loopActive = true
    resetLoop()
    return () => {
      loopActive = false; ++loopGeneration
      if (loopTimer !== null) { clearTimeout(loopTimer); loopTimer = null }
    }
  }, 'dsh-api-dashboard: refresh loop')
```

</details>

**依据 3 · 源码核查**：[test/test-poll-lifecycle.mjs:19-34](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/test/test-poll-lifecycle.mjs#L19-L34)

客户端mock轮询断言。

<details>
<summary>查看原文（16行）</summary>

```text
const { store, schedule } = captured.__test
let dispose = store.subscribe(() => {})
assert.equal(requests, 1)
dispose(); resolves.shift()(); await flush()
assert.equal(timers.size, 0, '最后订阅离开后在飞请求不能复活定时器')
schedule(); assert.equal(timers.size, 0)
dispose = store.subscribe(() => {})
assert.equal(requests, 2, '重新订阅仍能恢复')
resolves.shift()(); await flush()
assert.equal(timers.size, 1)
const tick = timers.values().next().value; timers.clear(); tick()
assert.equal(requests, 3)
document.hidden = true; resolves.shift()(); await flush()
assert.equal(timers.size, 0, '后台不再调度')
document.hidden = false; schedule(); assert.equal(timers.size, 1)
dispose(); assert.equal(timers.size, 0)
```

</details>

**依据 4 · 源码核查**：[src/index.js:410-426](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L410-L426)

升级回滚保留备份。

<details>
<summary>查看原文（17行）</summary>

```text
  } catch (err) {
    // 回滚: 仅在已开始交换后才需要; 从本次备份整目录还原
    if (swapped) {
      for (const dir of dirs) {
        try {
          const bakTar = `${dir}.preupdate-${stamp}.tar.gz`
          if (!existsSync(bakTar)) continue
          rmSync(dir, { recursive: true, force: true })
          mkdirSync(dir, { recursive: true })
          execFileSync('tar', ['xzf', bakTar, '-C', dirname(dir)], { timeout: 20000 })
        } catch { /* 回滚自身失败时保留备份 tar 供手动恢复 */ }
      }
    }
    throw err
  } finally {
    // 临时区无论成败都清掉 (备份 tar 在 targets 旁边, 不受影响)
    rmSync(tmpBase, { recursive: true, force: true })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么范围值得试用，读者可继续从哪探讨？

**研究主题**：新假设与验证、采用判断

#### 完整回答

有条件试用，面向单用户可信本地Web、限定官方/已审阅自定义端点，关闭不必要秒级轮询，明确看板只是估算和余额线索；用自己的账单校验模型价格，未知模型不自动套默认价做预算决策。明文Key文件应留在本地账号权限边界，避免分享看板状态文件；普通使用优先宿主管理器更新，保留自更新备份和版本信息。停止条件包括stale被当实时、配额冒充余额、默认价格误匹配、Key发往非预期端点或更新后目录无法恢复。

值得继续探讨带数据来源/价格版本/计费档位的估算收据，让未知模型明确缺价、历史桶绑定当时价格版本，并把余额、额度、估算分成不同单位；自定义端点加明确受信策略和请求预算。基线是当前按模型表/默认价格折算及人工账单，固定对照含新模型、调价、长上下文、重试和子代理继承、失效接口/旧余额；衡量账单误差、误提示与核对工时。它是未验证方向，不宣称当前已对账或能安全自动管理资金。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1580-1612](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L1580-L1612)

当前计价fallback。

<details>
<summary>查看原文（33行）</summary>

```text
export const resolveModelPrice = (configOrGetter, model, timestamp = Date.now(), phase = null) => {
  const config = typeof configOrGetter === 'function' ? configOrGetter() : configOrGetter
  const peak = isPeakTime(timestamp)
  const display = currencyForModel(config, model)

  // 自定义价格优先 (用户自填, 币种由用户自己把握, 不做换算)
  if (typeof model === 'string' && config?.prices && Object.prototype.hasOwnProperty.call(config.prices, model) && config.prices[model]) {
    return config.prices[model]
  }

  // v0.5.3 修复: 原 startsWith('deepseek') 会把 deepseek-chat/reasoner 劫持进 V4 峰谷表,
  // 导致其按 v4-flash 价格计费 (output 虚高至 4.5 倍)。仅匹配现役 v4 系列 + 收敛后的 deepseek-flash。
  // v1.3.4: 官方收敛模型名后, deepseek-flash 与旧名 deepseek-v4-flash / -vision-exp 同档
  //   (旧名仍可调用, 由 V4.1-Flash 服务并按 Flash 价计费) → 一律映射到 flash 档位。
  // DeepSeek v4 走 V4_RATES 峰谷表 (自带 CNY/USD 两套, 按显示币种选表)
  if (typeof model === 'string' && (model.startsWith('deepseek-v4') || model.startsWith('deepseek-flash'))) {
    const table = V4_RATES[display] ?? V4_RATES.CNY
    const key = model.startsWith('deepseek-v4-pro') ? 'deepseek-v4-pro' : 'deepseek-flash'
    // v1.5.0 峰谷分相: phase 显式给出时以它为准(历史上的每笔消耗按各自发生时刻计价),
    //   为 null 才回退到「按 timestamp 判定」的老行为 —— 默认参数保持向后兼容。
    const usePeak = phase === 'peak' ? true : phase === 'offPeak' ? false : peak
    const hit = (usePeak ? table.peak[key] : table.offPeak[key])
    if (hit) return { ...hit }
  }

  // 查通用表 (精确名 → 安全后缀前缀兜底)。条目按原生币种存储, 换算到显示币种。
  if (typeof model === 'string' && model !== '') {
    const entry = matchModelPrice(model)
    if (entry) return convertPrice(entry, nativeCurrencyOf(model), display)
  }

  // 都未命中: 落 defaultPrices。⚠️ defaultPrices 的单位是 **USD** (与 v1.2.x 一致, 未随 v1.4.0 改动)。
  return convertPrice(config?.defaultPrices ?? { cacheHit: 0.1, cacheMiss: 1, output: 2 }, 'USD', display)
```

</details>

**依据 2 · 源码核查**：[src/index.js:2848-2867](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L2848-L2867)

当前usage来源。

<details>
<summary>查看原文（20行）</summary>

```text
  const lastUsageFromStream = (stream) => {
    if (!Array.isArray(stream)) return undefined
    for (let i = stream.length - 1; i >= 0; i -= 1) {
      const rec = stream[i]
      if (rec !== null && typeof rec === 'object' && rec.type === 'chunk' && rec.chunk?.type === 'usage') return rec.chunk.usage
    }
    return undefined
  }

  /**
   * v1.4.0: 一个事件所携带的用量样本。对齐 dsh-token-meter 的 usage-projection:
   *   - `assistant/message` 优先用自带 `usage`, 没有则回落到 stream 里的 usage chunk;
   *   - `assistant/attempt`(失败/重试/取消/流错误、没有产出可见消息的尝试) 从 stream 里取。
   * ⚠️ 旧代码读的是 `assistant/chunk` —— 该事件名**不在**框架 `KNOWN_SESSION_EVENT_TYPES` 里, 是死分支,
   *    导致上面两种真实事件里 `assistant/attempt` 的 token 被整段漏计。
   */
  const usageOfEvent = (event) => {
    if (event.type === 'assistant/message' && event.data.usage !== undefined) return event.data.usage
    if (event.type !== 'assistant/message' && event.type !== 'assistant/attempt') return undefined
    return lastUsageFromStream(event.data.stream)
```

</details>

**依据 3 · 源码核查**：[src/index.js:3376-3387](https://github.com/133563825as-ai/dsh-api-dashboard/blob/b57f9535c55aa39026931813e09834fa9f4f4d82/src/index.js#L3376-L3387)

旧余额策略。

<details>
<summary>查看原文（12行）</summary>

```text
      // v0.5.7: last-known-good 兜底 — 平台瞬时网络故障(超时/DNS抖动)不冲掉上次成功数据,
      // 避免看板红闪「异常」; 标注 stale 提示用户这是暂存值
      const prevBalances = Array.isArray(cache.balances) ? cache.balances : []
      const prevOf = new Map(prevBalances.map((b) => [b.platform, b]))
      const balances = results.map((r) => {
        const cur = r.status === 'fulfilled' ? r.value : { platform: 'unknown', name: '未知', icon: 'relay', color: '#64748B', category: '中转站', status: 'error', error: '查询失败', noBalance: true }
        if (cur && cur.status === 'error' && !String(cur.error || '').includes('认证')) {
          const old = prevOf.get(cur.platform)
          if (old && old.status === 'ok') {
            return { ...old, fetchedAt: old.fetchedAt, staleNote: '暂用上次数据(本次查询失败)', error: undefined }
          }
        }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
