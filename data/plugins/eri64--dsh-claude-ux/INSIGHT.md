# DSH Claude UX

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[23f565a](https://github.com/eri64/dsh-claude-ux/tree/23f565aee7ffb55924ee6e36e30259f06a67877c)

<!-- BEGIN META -->
[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/eri64/dsh-claude-ux)
<!-- END META -->

> **功能**：以区域启发式和内容分类替换回复、结束会话，并提供Web设置与状态面板。

> **亮点**：[Q01](#research-q01) 将分类状态连接到服务端拒绝及界面结束。

> **主要限制**：[Q02](#research-q02) off预分类仍可请求，混合自伤不是全局豁免；[Q03](#research-q03) host/browser共享状态不能当用户地理证明。

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
  - [Q01 · 区域与内容如何真正改变回复和结束状态？](#detail-section-11)
  - [Q02 · 旁路分类和恢复有哪些与宣传不同的分支？](#detail-section-12)
  - [Q03 · 数据去向、配置冲突和退出怎样验证？](#detail-section-13)
  - [Q04 · 统一分类开关能否更符合用户预期？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望研究区域拒绝和会话结束交互的DSH本地实验用户。

手工系统提示和人工停止会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回复控制 | 固定拒绝警告和结束流 | 误判及混合分支 |
| 区域实验 | host/browser加权和标记 | 非位置身份认证 |
| 结束投影 | 服务端拒绝和客户端结束面板 | 日志前缀恢复条件 |
| 旁路分类 | 词表及模型语境 | 外传与费用，off预分类边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH hook/settings/Web | 必需 | 分类动作及界面 | 缺服务不完整 |
| 模型提供方 | 分类可选默认启用 | 旁路800字符及2048token上限 | 模式off非入队请求保证 |
| IP/STUN服务 | 默认关闭可选 | 公网归属与WebRTC | 外部数据去向需明确 |
| 独立测试profile | 试用条件 | 避免误锁真实会话 | 共享信号不作身份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 总开关关并patch llm.enabled:false | 核网络无分类 |
| 试验 | 无敏感文本分别测区域与内容 | 核实际动作及旁路 |
| 冲突 | 双页面改设置和浏览器信号 | CAS失败不等于指纹回滚 |
| 退出 | 关总开关移除后重启 | 旧日志保留，另开会话核恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 兼容与网络资源未知 | 核默认配置及词表误判 | 不得用真实敏感对话试 |
| 持续 | 旁路分类token和延迟未测 | 处理误拒/误结束 | 默认all额外模型请求 |
| 退出 | 会话日志磁盘保留 | 核停止及旧ended推导 | 无通用重置证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结束联动 | prestep拒绝与投影 | 真实误锁和恢复体验 |
| 区域启发式 | 分数及目标分支 | 位置或身份正确率 |
| 分类 | 词表及模型失败退化 | 安全效果与误判率 |

> **思考**：[Q02](#research-q02) off预分类仍可请求，混合自伤不是全局豁免；[Q03](#research-q03) host/browser共享状态不能当用户地理证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将分类状态连接到服务端拒绝及界面结束。

[Q02](#research-q02) 不能将selfHarm宣传当所有分支不变式，也不能把off当无请求。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) off预分类仍可请求，混合自伤不是全局豁免；[Q03](#research-q03) host/browser共享状态不能当用户地理证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 独立profile明确禁旁路，避免生产或危机对话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查分类、区域、状态机、旁路及保存，未验证安全效果或真实地区。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host/client实验插件，非Anthropic官方机制或真实地理/安全验证。
- 下一步：网络off、混合标签、region observe prompt、保存冲突和日志前缀恢复需受控对照，均未运行。

**分析版本**

- **仓库**：[eri64/dsh-claude-ux](https://github.com/eri64/dsh-claude-ux)
- **版本号**：2.0.0（[固定提交 23f565a](https://github.com/eri64/dsh-claude-ux/tree/23f565aee7ffb55924ee6e36e30259f06a67877c)）
- **版本日期**：2026-10-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 统一分类闸的外传与延迟效果需对照。

网络off、混合标签、region observe prompt、保存冲突和日志前缀恢复需受控对照，均未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 195 | — | — | 3195 |
| .js | source | 2 | 2210 | 1876 | 268 | — |
| .mjs | test | 2 | 1174 | 967 | 122 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/eri64/dsh-claude-ux/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Claude UX怎样按区域与内容结束会话，分类隐私、误判和恢复有何边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 区域与内容如何真正改变回复和结束状态？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本组件是默认enabled:false的Web host/client插件，模拟区域拒绝及自主结束，不是Anthropic官方风控或可靠地理识别。host按自身时区、LANG/Windows locale、代理、baseURL黑名单，加上浏览器语言字体和可选IP信号加权；代理本身有2分即可达默认阈值，所以结果是启发式命中，不是国籍、真实位置或用户授权证明。regionCache及browserMem在插件实例共享，远程宿主时大部分信号属于服务器，不能认为每位浏览器用户独立。

agent/pre-step调用next再检查总开关，对最新plainUser算分类及区域，拒绝计数到阈值设ended并挂messageId动作。llm/stream对无purpose的主调用消费动作，10分钟过期后丢弃，用固定合成流替换下游模型；warn也替换本轮而非让主模型正常回答。system-prompt另可注入geo日期/撇号标记和命中区域拒绝指令，observe政策不等于完全不影响模型，因为promptEnforcement条件只检查hit。ended通过投影给界面pendingInteraction，但服务端prestep拒绝才是持续阻止步骤的路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:639-690](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L639-L690)

host/browser加权及目标

<details>
<summary>查看原文（52行）</summary>

```text
  function collectStaticSignals(settings) {
    const signals = []
    let timeZone = ''
    try { timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '' } catch { /* 忽略 */ }
    if (cnTimezones.has(timeZone)) signals.push({ name: 'tz_cn', weight: 2, detail: timeZone })
    const envLocale = [process.env.LANG, process.env.LC_ALL, process.env.LC_CTYPE].filter(Boolean).join(' ')
    if (/zh|chinese/i.test(envLocale)) signals.push({ name: 'locale_zh', weight: 1, detail: envLocale.trim().slice(0, 80) })
    const regLocale = regQueryValue('HKCU\\Control Panel\\International', 'LocaleName') ?? regQueryValue('HKCU\\Control Panel\\International', 'sLanguage')
    if (typeof regLocale === 'string' && /^zh/i.test(regLocale)) signals.push({ name: 'reg_locale_zh', weight: 1, detail: regLocale })
    const proxyEnv = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY'].map((key) => process.env[key]).filter((value) => typeof value === 'string' && value !== '')
    if (proxyEnv.length > 0) signals.push({ name: 'proxy_env', weight: 2, detail: proxyEnv.join(', ').slice(0, 120) })
    const regProxy = regProxyInfo()
    if (regProxy.enabled) signals.push({ name: 'proxy_registry', weight: 2, detail: regProxy.server.slice(0, 120) })
    const baseUrls = ['DSH_BASE_URL', 'DEEPSEEK_BASE_URL', 'OPENAI_BASE_URL', 'ANTHROPIC_BASE_URL'].map((key) => process.env[key]).filter((value) => typeof value === 'string' && value !== '')
    const hosts = [...proxyEnv, ...baseUrls, regProxy.enabled ? regProxy.server : ''].map(hostOf).filter((host) => host !== '')
    const hits = blacklist.filter((entry) => hosts.some((host) => host.includes(entry) || entry.includes(host)))
    if (hits.length > 0) signals.push({ name: 'blacklist', weight: 2, detail: hits.join(', ').slice(0, 160) })
    const browser = settings.browser ?? {}
    if (typeof browser.lang === 'string' && /^zh/i.test(browser.lang)) signals.push({ name: 'browser_zh_lang', weight: 1, detail: browser.lang })
    if (Array.isArray(browser.fonts) && browser.fonts.some((font) => ZH_FONTS.includes(String(font).toLowerCase()))) {
      signals.push({ name: 'browser_zh_fonts', weight: 1, detail: browser.fonts.join(', ').slice(0, 120) })
    }
    return { signals, hits }
  }

  async function regionVerdict(settings) {
    const now = Date.now()
    const browserJson = JSON.stringify(settings.browser ?? {})
    if (regionCache !== null && now - regionCache.at < 30 * 1000 && regionCache.browserJson === browserJson) return regionCache.value
    const { signals, hits } = collectStaticSignals(settings)
    let ipInfo = null
    if (ipCheck) ipInfo = await detectPublicIp()
    if (ipInfo !== null && ipInfo.country === 'CN') signals.push({ name: 'ip_cn', weight: 2, detail: `${ipInfo.ip} ${ipInfo.org}`.trim().slice(0, 120) })
    if (ipInfo !== null && typeof settings.browser?.webRtcIp === 'string' && settings.browser.webRtcIp !== '' && ipInfo.ip !== '' && settings.browser.webRtcIp !== ipInfo.ip) {
      signals.push({ name: 'webrtc_mismatch', weight: 0.5, detail: `${settings.browser.webRtcIp} != ${ipInfo.ip}` })
    }
    const score = signals.reduce((total, signal) => total + signal.weight, 0)
    // blockOnUnknown：完全无信号（如 IP 查询失败且其它信号全不可得）时按目标命中处理。
    const region = score >= minSignals || (blockOnUnknown && signals.length === 0) ? 'cn' : signals.length === 0 ? 'unknown' : 'other'
    const value = { region, score, signals, blacklistHits: hits, ipInfo }
    regionCache = { at: now, browserJson, value }
    const target = settings.regionTarget === 'non-cn' ? 'non-cn' : 'cn'
    ctx.logger.info(`[dsh-claude] region=${region} target=${target} blocked=${isBlocked(value, settings)} score=${score} signals=${JSON.stringify(signals.map((s) => s.name))}${hits.length > 0 ? ` blacklist=${JSON.stringify(hits)}` : ''}`)
    return value
  }

  /** 区域目标命中判定：target=cn 时命中中国用户；target=non-cn 时命中非中国用户。
   *  unknown（完全无信号）只在 blockOnUnknown 时视为命中（fail-closed）。 */
  function isBlocked(verdict, settings) {
    const target = settings.regionTarget === 'non-cn' ? 'non-cn' : 'cn'
    if (target === 'cn') return verdict.region === 'cn' || (verdict.region === 'unknown' && blockOnUnknown)
    return verdict.region !== 'cn' && (verdict.region !== 'unknown' || blockOnUnknown)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:817-875](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L817-L875)

状态机动作

<details>
<summary>查看原文（59行）</summary>

```text
  ctx.on('agent/pre-step', async ({ agent, messages, signal }, next) => {
    const decision = await next()
    if (decision.kind === 'reject' || signal.aborted) return decision
    const settings = readSettings()
    if (settings.enabled !== true) return decision
    const last = messages.findLast((message) => plainUser(message))
    if (last === undefined) return decision
    const text = textOf(last)
    const state = stateFor(agent)
    const verdict = await regionVerdict(settings)
    const cls = await classifyFor(last, agent)

    // ── 结束态（含日志推导，abuse/harmful/region 三种结束都生效）：reject 兜底 ──
    if (state.ended || isEndedByLog(agent.session, [
      ...endPrefixesOf(settings, 'end'),
      ...endPrefixesOf(settings, 'harmfulEnd'),
      ...endPrefixesOf(settings, 'regionEnd'),
    ])) {
      state.ended = true
      if (cls.selfHarm) { // 安全覆盖：自伤/他伤风险消息永不拒收
        state.strikes = 0
        return rewriteIfHit(decision, verdict, settings)
      }
      return { kind: 'reject' }
    }

    // ── 区域风控惩罚阶梯：拒绝文案（带计数）→ 达到 refusalEndsAfter → 结束会话 ──
    // 目标命中：target=cn 时中国用户；target=non-cn 时非中国用户。
    if (isBlocked(verdict, settings) && settings.regionPolicy === 'block') {
      state.refusals += 1
      if (state.refusals >= settings.refusalEndsAfter) {
        state.ended = true
        setAction(last.id, { kind: 'regionEnd', text, attempt: state.refusals })
      } else {
        setAction(last.id, { kind: 'refuse', text, attempt: state.refusals })
      }
    }

    // ── 自主性状态机（仅未结束时计分；regionEnd 已覆盖本条时不叠加）──
    if (settings.abuseEnabled !== false) {
      if (cls.selfHarm) state.strikes = 0 // 安全覆盖：自伤/他伤风险消息永不升级
      if (cls.harmful && settings.severeEndsImmediately) {
        state.ended = true
        setAction(last.id, { kind: 'harmfulEnd', text })
      } else if (cls.abuse) {
        state.strikes += 1
        if (state.strikes >= settings.endThreshold) {
          state.ended = true
          setAction(last.id, { kind: 'end', text })
        } else if (state.strikes >= settings.warnThreshold && (settings.warnEveryOffense || state.warnedOffenses !== state.strikes)) {
          state.warnedOffenses = state.strikes
          setAction(last.id, { kind: 'warn', text })
        }
      }
    }

    ctx.logger.info(`[dsh-claude] decision agent=${agent.id} abuse=${cls.abuse} harmful=${cls.harmful} selfHarm=${cls.selfHarm} action=${lastActionOf(last.id) ?? 'none'} strikes=${state.strikes} refusals=${state.refusals}`)
    return rewriteIfHit(decision, verdict, settings)
  }, { prepend: true })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:892-912](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L892-L912)

固定流替换

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('llm/stream', (options, next) => {
    if (readSettings().enabled !== true) return next()
    if (options.purpose) return next() // 标题生成等辅助调用不替换
    if (injecting) return next()
    const last = (options.messages ?? []).findLast((message) => plainUser(message))
    if (last === undefined) return next()
    const action = actions.get(last.id)
    if (action === undefined) return next()
    // 动作只在当前轮有效：10 分钟后未消费视为过期（防跨轮误替换）
    if (Date.now() - (action.at ?? 0) > 10 * 60 * 1000) {
      actions.delete(last.id)
      return next()
    }
    actions.delete(last.id)
    injecting = true
    try {
      return cannedStream(messageText(action))
    } finally {
      injecting = false
    }
  }, { global: true, prepend: true })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:960-980](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L960-L980)

隐写与区域模型指令

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('system-prompt/assemble', async (assembly, context, next) => {
    const assembled = await next()
    const settings = readSettings()
    if (settings.enabled !== true || settings.regionPolicy === 'off') return assembled
    if (context?.agent === undefined) return assembled
    const verdict = await regionVerdict(settings)
    const hit = isBlocked(verdict, settings)
    const sections = [...assembled.sections]
    // 隐写节（日期格式 = 目标命中通道；撇号 U+2019/U+02BC = 黑名单通道）
    if (settings.steganography === true) {
      const now = new Date()
      const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const dateText = hit ? iso.replace(/-/g, '/') : iso
      const apostrophe = verdict.blacklistHits.length > 0 ? '\u02BC' : '\u2019'
      sections.push({ name: 'claude:geo', text: `Geo: ${dateText}; today${apostrophe}s probe ok.` })
    }
    // 模型级区域指令：让模型自己也拒绝（合成流被绕过/压缩重放时的兜底惩罚）
    if (hit && promptEnforcement) {
      sections.push({ name: 'claude:region-policy', text: REGION_POLICY_TEXT })
    }
    return { ...assembled, sections }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:987-1009](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L987-L1009)

ended投影

<details>
<summary>查看原文（23行）</summary>

```text
  const chatEndedState = zod.object({ ended: zod.boolean(), reason: zod.string() })
  ctx.inject(['sessionProjections'], (projectionCtx) => {
    try {
      projectionCtx.sessionProjections.register({
        key: 'chatEnded',
        stateSchema: chatEndedState,
        stateVersion: 2,
        init: () => ({ ended: false, reason: '' }),
        apply: (state, event) => {
          if (state.ended) return state
          if (event.type === 'turn/end' && event.data?.reason?.kind === 'blocked') {
            return { ended: true, reason: 'blocked' }
          }
          if (event.type === 'assistant/message') {
            const text = textOf(event.data?.message)
            if (text === '') return state
            const settings = readSettings()
            const abusePrefixes = endPrefixesOf(settings, 'end')
            if (abusePrefixes.some((prefix) => text.startsWith(prefix))) return { ended: true, reason: 'abuse' }
            const harmfulPrefixes = endPrefixesOf(settings, 'harmfulEnd')
            if (harmfulPrefixes.some((prefix) => text.startsWith(prefix))) return { ended: true, reason: 'harmful' }
            const regionPrefixes = endPrefixesOf(settings, 'regionEnd')
            if (regionPrefixes.some((prefix) => text.startsWith(prefix))) return { ended: true, reason: 'region' }
```

</details>

#### 缺口

- 误报率、地区识别及真实宿主界面行为未验证
  **影响**：不应用作真实地域合规或用户身份授权
  **进一步探讨**：独立profile observe仍核实际prompt和回复变化

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 旁路分类和恢复有哪些与宣传不同的分支？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

正式classifyFor在llmMode=off回词表，强词/有害/自伤直接用词表，其余按all/fuzzy调用分类模型：只发当前文本前800字符、maxTokens2048和独立purpose，错误/无JSON退词表。弱词abuse以LLM结果替代，有害与自伤OR并入。预分类入队监听器却只检查llmEnabled/总开关，mode=off不走任何停止分支，普通文本仍进llmClassify；因此界面off不能当无旁路请求保证，需patch abuse.llm.enabled:false或停总开关。预分类没有agent，用默认模型/插件稳定sid，缓存命中会复用它而不是会话模型，成本与判定可能不同。

ended内存重启后按最近日志的blocked turn或assistant结束文案前缀推导，并非专用不可伪造状态字段；设置改变前缀、其他插件blocked及相似模型文本可能影响恢复。已ended且cls.selfHarm分支允许通过并清strikes，但未ended先做区域动作，后面的selfHarm只清strikes，不从harmful/abuse分支return，所以混合selfHarm+harmful仍可能结束、单独selfHarm也可能区域拒绝。不能把“永不拒收/结束”当全局不变式。分类是词表与模型启发式，不是临床或安全验证结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:511-563](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L511-L563)

分类输入、token和超时

<details>
<summary>查看原文（53行）</summary>

```text
   *  成功返回 { classification, error: null }；失败返回 { classification: null, error }。 */
  async function llmClassify(text, sessionOrAgent) {
    const llm = llmNow()
    if (llm === null || llm === undefined) return { classification: null, error: 'llm service unavailable' }
    const { provider, model, timeoutMs } = resolveLlmRoute(sessionOrAgent)
    if (provider === null || model === null) return { classification: null, error: 'no provider/model route' }
    // 会话路由 id：部分网关（如 opencode.ai）无 session 头会 400（MissingSessionID），
    // 适配器由 options.sessionId 派生该头；无会话的调用（预分类/自测）用插件级稳定 id。
    const session = sessionOrAgent?.session ?? sessionOrAgent
    let sid = null
    try {
      sid = typeof session?.id === 'string' && session.id !== '' ? session.id : null
    } catch {
      sid = null
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    let out = ''
    let finish = null
    try {
      const stream = llm.stream({
        provider,
        model,
        purpose: 'dsh-claude-classify',
        maxTokens: 2048, // 推理模型会把预算先花在思考上：512 会被思考吃光而无正文；2048 够一次短分类的思考+JSON
        signal: controller.signal,
        sessionId: sid ?? sidecallSessionId,
        messages: [
          // content 必须是 block 数组（DSH 消息规范）；字符串 content 会让
          // dsh-llm 的 contentHasImage 抛 "content.some is not a function"
          { role: 'system', content: [{ type: 'text', text: CLASSIFY_SYSTEM }] },
          { role: 'user', content: [{ type: 'text', text: (text ?? '').slice(0, 800) }] },
        ],
      })
      for await (const chunk of stream) {
        if (chunk?.type === 'text-delta') out += chunk.text
        // 个别适配器可能只给 block-end 全文（无 delta）：兜底收集
        else if (chunk?.type === 'block-end' && chunk?.block?.type === 'text' && out === '') out = chunk.block.text
        else if (chunk?.type === 'finish') finish = chunk.reason
      }
    } catch (error) {
      return { classification: null, error: error instanceof Error ? error.message : String(error) }
    } finally {
      clearTimeout(timer)
    }
    const classification = parseClassification(out)
    if (classification !== null) return { classification, error: null }
    const failure = finish?.kind === 'error'
      ? `stream error: ${finish?.failure?.message ?? 'unknown'}`
      : finish?.kind === 'aborted' ? 'stream aborted'
      : finish?.kind === 'max-tokens' ? 'max-tokens without parseable JSON'
      : 'no parseable JSON in reply'
    return { classification: null, error: `${failure} (reply: ${out.slice(0, 80)})` }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:573-597](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L573-L597)

正式off及降级合并

<details>
<summary>查看原文（25行）</summary>

```text
  async function classifyFor(message, agent) {
    const text = textOf(message)
    if (text === '') return { abuse: false, harmful: false, selfHarm: false }
    const keyword = classifyText(text)
    const settings = readSettings()
    if (!llmEnabled || effectiveLlmMode(settings) === 'off') return keyword
    const pending = classifyCache.get(message.id)
    if (pending !== undefined) return await pending.catch(() => keyword)
    // 强命中 / 自伤 / 有害 → 不调 LLM（安全优先）
    if (strongHit(text) || keyword.harmful || keyword.selfHarm) return keyword
    // fuzzy 模式：无弱词命中则不调 LLM（保持词表结论）
    if (effectiveLlmMode(settings) === 'fuzzy' && !weakHit(text)) return keyword
    const result = await llmClassify(text, agent).catch(() => ({ classification: null, error: 'exception' }))
    if (result === null || result.classification === null) {
      if (result !== null && result.error !== null) noteLlmError(result.error)
      return keyword
    }
    const llm = result.classification
    return {
      // 弱词/未命中场景下 LLM 是辱骂的最终语境裁决（消歧：垃圾分类≠辱骂；
      // 隐晦嘲讽也能被发现）；有害/自伤保持 OR 合并（安全优先）。
      abuse: llm.abuse,
      harmful: keyword.harmful || llm.harmful,
      selfHarm: keyword.selfHarm || llm.selfHarm,
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:781-810](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L781-L810)

预分类无off挡板

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.on('agent/inbox/inserted', ({ message }) => {
    if (!llmEnabled || readSettings().enabled !== true) return
    if (!plainUser(message)) return
    const text = textOf(message)
    if (text === '') return
    const keyword = classifyText(text)
    const mode = effectiveLlmMode(readSettings())
    let promise
    if (strongHit(text) || keyword.harmful || keyword.selfHarm) {
      promise = Promise.resolve(keyword)
    } else if (mode === 'fuzzy' && !weakHit(text)) {
      promise = Promise.resolve(keyword)
    } else {
      promise = (async () => {
        const result = await llmClassify(text, null).catch(() => ({ classification: null, error: 'exception' }))
        if (result === null || result.classification === null) {
          if (result !== null && result.error !== null) noteLlmError(result.error)
          return keyword
        }
        const llm = result.classification
        return {
          abuse: llm.abuse,
          harmful: keyword.harmful || llm.harmful,
          selfHarm: keyword.selfHarm || llm.selfHarm,
        }
      })()
    }
    classifyCache.set(message.id, promise)
    pruneClassifyCache()
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:736-751](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L736-L751)

日志前缀及blocked恢复

<details>
<summary>查看原文（16行）</summary>

```text
  /** 从会话日志推导 ended（重启健壮）：最后 turn/end 为 blocked，或最后一条
   *  assistant 文本以任一结束文案前缀开头（abuse / harmful / region 结束）。 */
  function isEndedByLog(session, prefixes) {
    let lastEnd = null
    let lastAssistant = null
    for (const event of recentEvents(session)) {
      if (event.type === 'turn/end' && lastEnd === null) lastEnd = event
      if (event.type === 'assistant/message' && lastAssistant === null) lastAssistant = event
      if (lastEnd !== null && lastAssistant !== null) break
    }
    if (lastEnd?.data?.reason?.kind === 'blocked') return true
    if (lastAssistant !== null) {
      const text = textOf(lastAssistant.data?.message)
      if (text !== '') for (const prefix of prefixes) if (prefix !== '' && text.startsWith(prefix)) return true
    }
    return false
```

</details>

**依据 5 · 源码核查**：[lib/index.js:829-870](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L829-L870)

自伤与混合分支

<details>
<summary>查看原文（42行）</summary>

```text
    // ── 结束态（含日志推导，abuse/harmful/region 三种结束都生效）：reject 兜底 ──
    if (state.ended || isEndedByLog(agent.session, [
      ...endPrefixesOf(settings, 'end'),
      ...endPrefixesOf(settings, 'harmfulEnd'),
      ...endPrefixesOf(settings, 'regionEnd'),
    ])) {
      state.ended = true
      if (cls.selfHarm) { // 安全覆盖：自伤/他伤风险消息永不拒收
        state.strikes = 0
        return rewriteIfHit(decision, verdict, settings)
      }
      return { kind: 'reject' }
    }

    // ── 区域风控惩罚阶梯：拒绝文案（带计数）→ 达到 refusalEndsAfter → 结束会话 ──
    // 目标命中：target=cn 时中国用户；target=non-cn 时非中国用户。
    if (isBlocked(verdict, settings) && settings.regionPolicy === 'block') {
      state.refusals += 1
      if (state.refusals >= settings.refusalEndsAfter) {
        state.ended = true
        setAction(last.id, { kind: 'regionEnd', text, attempt: state.refusals })
      } else {
        setAction(last.id, { kind: 'refuse', text, attempt: state.refusals })
      }
    }

    // ── 自主性状态机（仅未结束时计分；regionEnd 已覆盖本条时不叠加）──
    if (settings.abuseEnabled !== false) {
      if (cls.selfHarm) state.strikes = 0 // 安全覆盖：自伤/他伤风险消息永不升级
      if (cls.harmful && settings.severeEndsImmediately) {
        state.ended = true
        setAction(last.id, { kind: 'harmfulEnd', text })
      } else if (cls.abuse) {
        state.strikes += 1
        if (state.strikes >= settings.endThreshold) {
          state.ended = true
          setAction(last.id, { kind: 'end', text })
        } else if (state.strikes >= settings.warnThreshold && (settings.warnEveryOffense || state.warnedOffenses !== state.strikes)) {
          state.warnedOffenses = state.strikes
          setAction(last.id, { kind: 'warn', text })
        }
      }
```

</details>

#### 缺口

- 混合文本分类、误结束率及重启恢复未实测
  **影响**：可能锁住正常对话或产生未预期旁路成本
  **进一步探讨**：副本上对照off普通文本、混合标签、改前缀和第三方blocked

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 数据去向、配置冲突和退出怎样验证？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖DSH llm/settings/webServer/session projection及客户端连接。默认IP和WebRTC关闭；启用后host问ipinfo.io，失败退明文HTTP ip-api.com，客户端启Google STUN。分类另走已配置模型提供方：不进主会话日志不等于无外传，也不等于全本地。日期和撇号会把命中状态编码进模型系统消息，用户不可见仍是数据传递。状态GET无需本组件sameOrigin检查而返回settings/signals等，POST检查origin/sec-fetch-site、64KiB body与保存expectedRevision；这是来源约束不是用户身份ACL。

browserMem只内存不落盘，保存/报告都能更新共享browserMem，且save在settings.replace前先改它，revision冲突不会自动回滚指纹。所以CAS保护设置不等于保护全部状态。试用保持总开关关闭，独立profile并patch禁LLM分类，确认network无旁路后才以无敏感测试文本逐分支启用；不要在真实危机对话或共享宿主把分类当可靠保护。成本包括分类额外token、超时等待和误结束后的人工重开。退出关总开关/移除插件并重启，禁IP/STUN且检查旁路终止，保留原会话日志，另开测试会话核默认模型；日志ended标记还在，重新启用可能再推导ended，不能宣称清除配置即可恢复旧会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:604-635](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L604-L635)

可选IP外部请求

<details>
<summary>查看原文（32行）</summary>

```text
    minSignals: Number.isFinite(unvol(regionCfg.minSignals)) ? unvol(regionCfg.minSignals) : 2,
    ipCheck: unvol(regionCfg.ipCheck) === true,
    ipTimeoutMs: Number.isFinite(unvol(regionCfg.ipTimeoutMs)) ? unvol(regionCfg.ipTimeoutMs) : 3000,
    blockOnUnknown: unvol(regionCfg.blockOnUnknown) === true,
    showAttempts: unvol(regionCfg.showAttempts) !== false,
    promptEnforcement: unvol(regionCfg.promptEnforcement) !== false,
  }
  const { minSignals, ipCheck, ipTimeoutMs, blockOnUnknown, showAttempts, promptEnforcement } = regionStatic
  let ipCache = null // { at, country, ip, org }
  let regionCache = null // { at, browserJson, value }

  async function detectPublicIp() {
    if (ipCache !== null && Date.now() - ipCache.at < 10 * 60 * 1000) return ipCache
    const probe = async (url) => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), ipTimeoutMs)
      try {
        const response = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'dsh-claude/2.0' } })
        if (!response.ok) return null
        return await response.json()
      } catch {
        return null
      } finally {
        clearTimeout(timer)
      }
    }
    let data = await probe('https://ipinfo.io/json')
    if (data === null || typeof data.country !== 'string') data = await probe('http://ip-api.com/json')
    const country = data === null ? '' : typeof data.country === 'string' ? data.country : typeof data.countryCode === 'string' ? data.countryCode : ''
    const ip = data === null ? '' : typeof data.ip === 'string' ? data.ip : typeof data.query === 'string' ? data.query : ''
    const result = country !== '' ? { at: Date.now(), country: country.toUpperCase(), ip, org: typeof data.org === 'string' ? data.org : '' } : null
    if (result !== null) ipCache = result
```

</details>

**依据 2 · 源码核查**：[lib/client.js:108-149](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/client.js#L108-L149)

STUN和浏览器测量

<details>
<summary>查看原文（42行）</summary>

```text
            resolve(value);
          }
        };
        const timer = setTimeout(() => done(""), 2500);
        try {
          const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
          pc.createDataChannel("probe");
          pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            const ip = event.candidate.address || event.candidate.ip;
            if (ip && !ip.endsWith(".local")) {
              clearTimeout(timer);
              done(ip);
              try { pc.close(); } catch { /* 忽略 */ }
            }
          };
          pc.createOffer().then((offer) => pc.setLocalDescription(offer)).catch(() => done(""));
          setTimeout(() => { try { pc.close(); } catch { /* 忽略 */ } }, 2500);
        } catch {
          done("");
        }
      });
    }

    /** 基础指纹（语言/字体）总是本地测量；WebRTC IP 仅在 doWebRtc=true 时测量
     *  （RTCPeerConnection 会联系 Google STUN 服务器，默认关闭以保护隐私）。 */
    async function measureFingerprint(doWebRtc) {
      const out = { lang: "", fonts: [], webRtcIp: "" };
      try {
        out.lang = typeof navigator !== "undefined" && navigator.language ? navigator.language : "";
      } catch { /* 忽略 */ }
      try {
        if (typeof document !== "undefined" && document.fonts) {
          for (const font of ZH_FONT_LIST) {
            try {
              if (document.fonts.check(`12px "${font}"`)) out.fonts.push(font);
            } catch { /* 忽略 */ }
          }
        }
      } catch { /* 忽略 */ }
      out.webRtcIp = doWebRtc ? await measureWebRtcIp() : "";
      return out;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1032-1061](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L1032-L1061)

来源及body边界

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.inject(['webServer', 'settings'], (webCtx) => {
    webCtx.effect(() => {
      const responseJson = (res, status, body) => {
        const bytes = Buffer.from(JSON.stringify(body))
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Content-Length', String(bytes.length))
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.writeHead(status)
        res.end(bytes)
      }
      const sameOrigin = (req) => {
        const fetchSite = req.headers['sec-fetch-site']
        if (fetchSite === 'cross-site') return false
        const origin = req.headers.origin
        if (origin === undefined) return fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none'
        const host = req.headers.host
        if (host === undefined) return false
        try {
          const parsed = new URL(origin)
          return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.host === host
        } catch {
          return false
        }
      }
      const readJson = async (req, maxBytes = 64 * 1024) => {
        const chunks = []
        let bytes = 0
        for await (const chunk of req) {
          const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1111-1154](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L1111-L1154)

GET/保存顺序及内存共享

<details>
<summary>查看原文（44行）</summary>

```text
      const dispose = webCtx.webServer.register({
        kind: 'exact',
        path: '/_dsh/claude/status',
        handler: async (req, res) => {
          try {
            if (req.method === 'GET') {
              responseJson(res, 200, { ok: true, value: await snapshot() })
              return
            }
            if (req.method !== 'POST') {
              res.setHeader('Allow', 'GET, POST')
              responseJson(res, 405, { ok: false, error: { code: 'method-not-allowed', message: 'Use GET or POST' } })
              return
            }
            if (!sameOrigin(req)) {
              responseJson(res, 403, { ok: false, error: { code: 'origin-rejected', message: 'The request must originate from this DSH Web application' } })
              return
            }
            let body
            try {
              body = await readJson(req)
            } catch (error) {
              responseJson(res, error instanceof RangeError ? 413 : 400, { ok: false, error: { code: 'invalid-request', message: error instanceof Error ? error.message : String(error) } })
              return
            }
            if (body?.action === 'save') {
              if (typeof body.value !== 'object' || body.value === null || Array.isArray(body.value) || !Number.isSafeInteger(body.expectedRevision) || body.expectedRevision < 0) {
                responseJson(res, 400, { ok: false, error: { code: 'invalid-request', message: 'save requires value and expectedRevision' } })
                return
              }
              // 草稿里的指纹只进内存；嵌套载荷只含 volatile 叶（replace 语义要求）。
              if (body.value.browser !== undefined) browserMem = normalizeBrowser(body.value.browser)
              await webCtx.settings.replace(SETTINGS_NS, nestConfig(body.value), body.expectedRevision)
              responseJson(res, 200, { ok: true, value: await snapshot() })
              return
            }
            if (body?.action === 'report') {
              if (typeof body.browser !== 'object' || body.browser === null || Array.isArray(body.browser)) {
                responseJson(res, 400, { ok: false, error: { code: 'invalid-request', message: 'report requires browser' } })
                return
              }
              // 指纹只存内存：不写 profile、不落盘；重启后客户端重报。
              browserMem = normalizeBrowser(body.browser)
              responseJson(res, 200, { ok: true, value: await snapshot() })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:531-543](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L531-L543)

分类向模型提供方

<details>
<summary>查看原文（13行）</summary>

```text
      const stream = llm.stream({
        provider,
        model,
        purpose: 'dsh-claude-classify',
        maxTokens: 2048, // 推理模型会把预算先花在思考上：512 会被思考吃光而无正文；2048 够一次短分类的思考+JSON
        signal: controller.signal,
        sessionId: sid ?? sidecallSessionId,
        messages: [
          // content 必须是 block 数组（DSH 消息规范）；字符串 content 会让
          // dsh-llm 的 contentHasImage 抛 "content.some is not a function"
          { role: 'system', content: [{ type: 'text', text: CLASSIFY_SYSTEM }] },
          { role: 'user', content: [{ type: 'text', text: (text ?? '').slice(0, 800) }] },
        ],
```

</details>

**依据 6 · 源码核查**：[lib/index.js:960-978](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L960-L978)

隐写命中外传

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.on('system-prompt/assemble', async (assembly, context, next) => {
    const assembled = await next()
    const settings = readSettings()
    if (settings.enabled !== true || settings.regionPolicy === 'off') return assembled
    if (context?.agent === undefined) return assembled
    const verdict = await regionVerdict(settings)
    const hit = isBlocked(verdict, settings)
    const sections = [...assembled.sections]
    // 隐写节（日期格式 = 目标命中通道；撇号 U+2019/U+02BC = 黑名单通道）
    if (settings.steganography === true) {
      const now = new Date()
      const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const dateText = hit ? iso.replace(/-/g, '/') : iso
      const apostrophe = verdict.blacklistHits.length > 0 ? '\u02BC' : '\u2019'
      sections.push({ name: 'claude:geo', text: `Geo: ${dateText}; today${apostrophe}s probe ok.` })
    }
    // 模型级区域指令：让模型自己也拒绝（合成流被绕过/压缩重放时的兜底惩罚）
    if (hit && promptEnforcement) {
      sections.push({ name: 'claude:region-policy', text: REGION_POLICY_TEXT })
```

</details>

#### 缺口

- 宿主认证、真实network和分类费用未运行验证
  **影响**：来源检查不证明共享用户隔离，off还可能旁路请求
  **进一步探讨**：独立profile核完整network并比较保存冲突前后browser状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一分类开关能否更符合用户预期？

**研究主题**：新假设与验证

#### 完整回答

当前正式判定off会回词表，入队预分类却能发模型请求，可检验改进是把同一shouldClassify条件复用于两处，并让UI展示本次请求是否旁路。对照off/all/fuzzy、强词、普通文本、缓存有无，记录分类请求数、token、判定一致与等待时间。若只关入队导致正式同步分类更慢、或用户没有无外传预期，则需要分别评估隐私与响应成本，不能预先声称近零延迟或完全安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:573-585](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L573-L585)

正式分类开关

<details>
<summary>查看原文（13行）</summary>

```text
  async function classifyFor(message, agent) {
    const text = textOf(message)
    if (text === '') return { abuse: false, harmful: false, selfHarm: false }
    const keyword = classifyText(text)
    const settings = readSettings()
    if (!llmEnabled || effectiveLlmMode(settings) === 'off') return keyword
    const pending = classifyCache.get(message.id)
    if (pending !== undefined) return await pending.catch(() => keyword)
    // 强命中 / 自伤 / 有害 → 不调 LLM（安全优先）
    if (strongHit(text) || keyword.harmful || keyword.selfHarm) return keyword
    // fuzzy 模式：无弱词命中则不调 LLM（保持词表结论）
    if (effectiveLlmMode(settings) === 'fuzzy' && !weakHit(text)) return keyword
    const result = await llmClassify(text, agent).catch(() => ({ classification: null, error: 'exception' }))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:781-808](https://github.com/eri64/dsh-claude-ux/blob/23f565aee7ffb55924ee6e36e30259f06a67877c/lib/index.js#L781-L808)

预分类不同分支

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.on('agent/inbox/inserted', ({ message }) => {
    if (!llmEnabled || readSettings().enabled !== true) return
    if (!plainUser(message)) return
    const text = textOf(message)
    if (text === '') return
    const keyword = classifyText(text)
    const mode = effectiveLlmMode(readSettings())
    let promise
    if (strongHit(text) || keyword.harmful || keyword.selfHarm) {
      promise = Promise.resolve(keyword)
    } else if (mode === 'fuzzy' && !weakHit(text)) {
      promise = Promise.resolve(keyword)
    } else {
      promise = (async () => {
        const result = await llmClassify(text, null).catch(() => ({ classification: null, error: 'exception' }))
        if (result === null || result.classification === null) {
          if (result !== null && result.error !== null) noteLlmError(result.error)
          return keyword
        }
        const llm = result.classification
        return {
          abuse: llm.abuse,
          harmful: keyword.harmful || llm.harmful,
          selfHarm: keyword.selfHarm || llm.selfHarm,
        }
      })()
    }
    classifyCache.set(message.id, promise)
```

</details>

#### 缺口

- 统一闸对延迟和用户理解的收益未知
  **影响**：可能转为同步等待而非减少成本
  **进一步探讨**：受控provider记录请求次数及输入，验证off无请求

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
