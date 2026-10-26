# dsh-llm-balance

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b35aa1e](https://github.com/AlienGene/dsh-llm-balance-siderbar/tree/b35aa1e8501051ab3541cea2f43f0609b214f9a1)

<!-- BEGIN META -->
[![npm 30d 847](https://img.shields.io/static/v1?label=npm+30d&message=847&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)
<!-- END META -->

> **实现功能**：在DSH常驻卡片显示DeepSeek/Moonshot余额与Kimi/OpenCode订阅窗口，按源缓存并保留失败旧值。

> **核心亮点**：将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](#research-q01)。

> **风险与缺陷**：同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](#research-q03)。

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
  - [Q01 · 余额卡片服务什么使用场景？](#detail-section-11)
  - [Q02 · route、凭据与缓存如何工作？](#detail-section-12)
  - [Q03 · 只读声明与身份/缓存有哪些边界？](#detail-section-13)
  - [Q04 · 容错、测试和运行成本有什么证据？](#detail-section-14)
  - [Q05 · 采用条件和继续探讨方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多LLM账号用户希望少切控制台并清楚余额/套餐剩余。详见[Q01](#research-q01)。

平台控制台和已有余额面板是替代，常驻显示便利不等账号/权限正确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| provider探测 | 已接入账号余额/套餐 | 同类首route身份 |
| 卡片/容错缓存 | 少切控制台 | 旧值与账号需核 |
| Kimi续期 | 延长读取登录态 | 默认写CLI凭据 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| webServer/llm/settings/credentials | route与账号定位 | 结构ABI需匹配 |
| 上游余额/套餐接口 | 真实数字 | schema/网络变化 |
| Kimi CLI登录态可选 | OAuth续期 | 默认可能写回 |
| GUI slots/React | 卡片和偏好 | 版本/localStorage限制 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 限定单账号来源 | 用户 | 首route不误标 |
| 审阅端点与续期 | 用户 | 写token意图明确 |
| 看源时间/stale/错误 | 用户 | 不作实时账单 |
| 切账号清理核对 | 用户 | 不复用旧主体缓存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 已配账号与可信端点 | 路由归属/OAuth写回核对 | 路由主体/可信端点/OAuth写回先核；初配工时未知 |
| 持续使用 | 查询/轮询，无LLM调用 | stale和主体核查，节时未知 | 无插件LLM调用；查询/轮询依服务、节时与费用未量化 |
| 失败恢复 | 原token/配置备份 | 重新登录/缓存账号纠错 | stale/错主体/token轮换需区分；重新登录/配置纠正工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 余额/额度可读 | 金额与窗口不同语义 | 非账单 |
| 故障不丢旧数 | 每源stale/TTL | 类别缓存非账号 |
| 少手工认证 | Kimi续期 | CLI token写副作用 |

> **思考**：同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](#research-q01)。

将余额/配额语义分开并接入逐源缓存和常驻GUI，减少控制台切换。详见[Q01](#research-q01)。

provider和纯format/state分离、inFlight容错可借鉴；需账号cache、请求准入与真正版本守卫续期。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

同类route共用首账号和probe缓存；Kimi默认刷新写CLI token、读比较rename非原子CAS，HTTP handler未本地认证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；可信个人单账号route对照，限定sources并明确OAuth写回，默认先禁token持久化。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

显示和容错源码可查；账号粒度、route准入依赖和OAuth副作用限制只读主张，账号分区/显式续期为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/route.ts、src/state.ts、src/http.ts、src/config.ts、src/format.ts、src/providers/deepseek.ts、src/providers/kimi-code.ts、src/providers/index.ts、client/client.js、test/state.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host/state/route/http、DeepSeek与Kimi凭据关键链、config、format、客户端轮询和state测试；未穷尽全部provider/GUI，不执行目标。
- 下一步：进一步从双账号、TTL换key、CLI并发续期、匿名route和慢body探讨分区缓存与显式更新。

**分析版本**

- **仓库**：[AlienGene/dsh-llm-balance-siderbar](https://github.com/AlienGene/dsh-llm-balance-siderbar)
- **版本号**：0.7.1（[固定提交 b35aa1e](https://github.com/AlienGene/dsh-llm-balance-siderbar/tree/b35aa1e8501051ab3541cea2f43f0609b214f9a1)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究账号/端点/revision缓存和显式续期能力，逐route归属与CLI统一版本写，比较错账号及恢复工时。当前未验证。详见[Q05](#research-q05)。

进一步从双账号、TTL换key、CLI并发续期、匿名route和慢body探讨分区缓存与显式更新。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 3532 | 2908 | 668 | — |
| .md | source | 3 | 194 | — | — | 2188 |
| .mjs | source | 2 | 230 | 189 | 24 | — |
| .ts | source | 18 | 3033 | 2089 | 712 | — |
| .tsx | source | 2 | 835 | 714 | 62 | — |
| .mjs | test | 7 | 1624 | 1417 | 92 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+created%3A2026-09-22T05%3A50%3A43.862Z..2026-10-22T05%3A50%3A43.862Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A50%3A43.862Z..2026-10-22T05%3A50%3A43.862Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本余额/订阅卡片如何选账号与缓存，OAuth写回/准入和使用成本如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 余额卡片服务什么使用场景？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已在DSH接入多个账号的用户，在常驻卡片查看充值余额或订阅窗口剩余额度，减少逐平台控制台查询。合格结果需区分货币金额、已用/剩余百分比、reset时间、旧快照与错误；不提供会话价格估算，也不是账单/付款能力。充值金额没有分母所以不硬造百分比，quota显示已用但颜色看剩余，这一语义分离有实际可读性价值。

简单替代是官方余额/订阅页面或已有用量面板。贡献是四类provider探测、逐源容错缓存和GUI模式/定位的组合，不是新计量协议。自动模式只看已注册route，显式sources可越过该筛选；README“不会读其他凭证”需结合Kimi CLI回退路径理解，不能只凭卡片只读推出插件无凭据写入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-22](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/README.md#L9-L22)

充值/套餐和显示范围。

<details>
<summary>查看原文（14行）</summary>

```text
## 它显示什么

- **充值的账号**（DeepSeek、Moonshot）→ 一行**余额金额**，不硬凑百分比
- **订阅 / 套餐账号**（Kimi For Coding、OpenCode Go）→ 每个窗口一行**已用百分比**和**多久后重置**，比如 `频限（47%） 3d0h0m重置`
- **颜色替你判断**：剩余不足 **20% 变红**、不足 **40% 变黄**，其余蓝色；当前正在用的那个提供商带一个**绿点**

| 服务商 | 类型 | 显示 |
|---|---|---|
| DeepSeek | 充值 | 余额 |
| Moonshot（Kimi 开放平台） | 充值 | 余额 |
| Kimi For Coding | 订阅 | 频限 + 周窗口 |
| OpenCode Go | 订阅 | 频限 / 周 / 月 |

只接入其中几个，就只显示这几个；全部接入，就全部显示，不会莫名少一个。
```

</details>

**依据 2 · 源码核查**：[src/format.ts:32-53](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/format.ts#L32-L53)

剩余阈值。

<details>
<summary>查看原文（22行）</summary>

```text
export function levelOf(
  remainingPercent: number | null | undefined,
  thresholds: Thresholds = DEFAULT_THRESHOLDS,
): Level {
  if (remainingPercent === null || remainingPercent === undefined) return 'normal'
  if (!Number.isFinite(remainingPercent)) return 'normal'
  if (remainingPercent < thresholds.error) return 'error'
  if (remainingPercent < thresholds.warn) return 'warn'
  return 'normal'
}

/** The most severe tier among the given ones (error > warn > normal). */
export function worstLevel(levels: readonly Level[]): Level {
  if (levels.includes('error')) return 'error'
  if (levels.includes('warn')) return 'warn'
  return 'normal'
}

/** Remaining share of one window in percent, or `null` for a degenerate limit. */
export function remainingPercentOf(remaining: number, limit: number): number | null {
  if (!Number.isFinite(remaining) || !Number.isFinite(limit) || limit <= 0) return null
  return clampPercent((remaining / limit) * 100)
```

</details>

**依据 3 · 源码核查**：[src/format.ts:90-95](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/format.ts#L90-L95)

显示已用与颜色分离。

```text
/** The share a row prints, honouring `percentMode`; colour always uses the remaining share. */
export function displayPercent(window: QuotaWindow, mode: PercentMode): number | null {
  if (mode === 'used') {
    return window.limit > 0 ? clampPercent((window.used / window.limit) * 100) : null
  }
  return window.remainingPercent
```

**依据 4 · 源码核查**：[src/state.ts:114-122](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L114-L122)

auto与explicit sources。

```text
  function enabledProbes(): Probe[] {
    const explicit = input.config.explicitSources
    if (explicit !== null) {
      const wanted = new Set(explicit)
      return input.probes.filter((probe) => wanted.has(probe.id))
    }
    const routes = input.listRoutes?.() ?? []
    if (routes.length === 0) return []
    return input.probes.filter((probe) => routes.some((route) => probe.match(route.id)))
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · route、凭据与缓存如何工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口等webServer就绪后创建aggregator并挂单state GET/HEAD路由；浏览器同源轮询，host每源独立snapshot/error/inFlight/nextAttemptAt，due时并行刷新并等全部，失败留上次快照标stale。凭据先宿主credentials.resolve再环境，llm-pi-ai key引用每次读取；自动probe按route名match挑选，hostFor取第一个匹配route的credential reference，同一source对所有匹配route回报该snapshot。

DeepSeek向配置/adapter/环境baseURL的user/balance携Bearer查询，Kimi可从API key或CLI OAuth文件路径读取/续期，Moonshot/OpenCode各独立adapter。结构接口不导入宿主runtime减少重复依赖，但仍需要兼容webServer/llm/settings/credentials和React客户端slots；settings读取只支持get形状，声明无bare依赖不等跨所有新版宿主接口。节点需支持fetch与AbortSignal.any/timeout，package没有明确Node engines，安装前需对齐实际宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:41-64](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/index.ts#L41-L64)

装配。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx: HostContext, rawConfig?: unknown): void {
  const config = normalizeConfig(rawConfig)
  const warn = (message: string): void => ctx.logger?.warn?.(`[dsh-llm-balance] ${message}`)
  for (const warning of config.warnings) warn(warning)

  ctx.inject(['webServer'], (host) => {
    host.effect(() => {
      const webServer = host.get<WebServerLike>('webServer')
      if (webServer?.register === undefined) {
        warn('webServer is not available; the balance route was not mounted')
        return () => {}
      }
      const aggregator = createAggregator({
        config,
        probes: PROBES,
        resolveSecret: (envName) => resolveSecret(host, envName, warn),
        listRoutes: () => listRoutes(host),
        llmDeepseek: () => llmDeepseekFacts(host),
        piAiApiKeyEnv: piAiApiKeyEnv(host),
        defaultSelection: () => defaultSelection(host),
        warn,
      })
      return registerStateRoute(webServer, aggregator)
    }, 'dsh-llm-balance: state route')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:72-92](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/index.ts#L72-L92)

凭据解析。

<details>
<summary>查看原文（21行）</summary>

```text
async function resolveSecret(
  ctx: HostContext,
  envName: string,
  warn: (message: string) => void,
): Promise<string | null> {
  if (!CREDENTIAL_REF.test(envName)) {
    warn(`ignoring credential reference ${JSON.stringify(envName)}: not an environment-variable name`)
    return null
  }
  const credentials = ctx.get<{ resolve?(ref: string): Promise<unknown> }>('credentials')
  if (credentials?.resolve !== undefined) {
    try {
      const resolved = (await credentials.resolve(envName)) as { value?: unknown } | undefined
      const value = resolved?.value
      if (typeof value === 'string' && value.length > 0) return value
    } catch (error) {
      warn(`credential lookup for ${envName} failed: ${String(error)}`)
    }
  }
  const fromEnv = process.env[envName]
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : null
```

</details>

**依据 3 · 源码核查**：[src/index.ts:139-149](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/index.ts#L139-L149)

live引用。

<details>
<summary>查看原文（11行）</summary>

```text
export function piAiApiKeyEnv(ctx: HostContext): (routeId: string) => string | undefined {
  return (routeId) => {
    const settings = ctx.get<{ get?(namespace: string): unknown }>('settings')
    const section = settings?.get?.('llm-pi-ai')
    if (typeof section !== 'object' || section === null) return undefined
    const providers = (section as Record<string, unknown>)['providers']
    if (typeof providers !== 'object' || providers === null) return undefined
    const entry = (providers as Record<string, unknown>)[routeId]
    if (typeof entry !== 'object' || entry === null) return undefined
    const value = (entry as Record<string, unknown>)['apiKeyEnv']
    return typeof value === 'string' && value.length > 0 ? value : undefined
```

</details>

**依据 4 · 源码核查**：[src/state.ts:125-162](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L125-L162)

首route与cache TTL。

<details>
<summary>查看原文（38行）</summary>

```text
  function hostFor(probe: Probe, routes: readonly string[]): ProbeHost {
    const override = input.config.sourceOverrides[probe.id]
    // The first registered route this source answers for: the credential the
    // routed adapter would use belongs to that route, not to the plugin.
    const route = routes.find((candidate) => probe.match(candidate))
    const routeApiKeyEnv = route === undefined ? undefined : input.piAiApiKeyEnv?.(route)
    return {
      config: input.config,
      timeoutMs: input.config.timeoutMs,
      fetchImpl,
      ...(route === undefined ? {} : { routeId: route }),
      ...(routeApiKeyEnv === undefined ? {} : { routeApiKeyEnv }),
      ...(input.llmDeepseek === undefined ? {} : { llmDeepseek: input.llmDeepseek() }),
      now,
      resolveSecret: input.resolveSecret,
      warn,
    }
  }

  async function refresh(probe: Probe, routes: readonly string[], signal: AbortSignal | undefined): Promise<void> {
    const cache = cacheFor(probe.id)
    const current = now()
    if (cache.inFlight !== null) return cache.inFlight

    const fresh = cache.fetchedAt !== null && cache.error === null && current < cache.fetchedAt + input.config.refreshMs
    // `nextAttemptAt` carries both cadences: the TTL after a success, the shorter
    // retry delay after a failure or a skip.
    if (fresh || current < cache.nextAttemptAt) return

    cache.inFlight = (async () => {
      try {
        const snapshot = await probe.probe(hostFor(probe, routes), signal ?? new AbortController().signal)
        cache.snapshot = snapshot
        cache.fetchedAt = now()
        cache.error = null
        cache.skipped = false
        cache.skipDetail = null
        cache.nextAttemptAt = cache.fetchedAt + input.config.refreshMs
```

</details>

**依据 5 · 源码核查**：[src/state.ts:187-209](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L187-L209)

并行与每源输出。

<details>
<summary>查看原文（23行）</summary>

```text
    async state(signal) {
      const probes = enabledProbes()
      const routes = input.listRoutes?.() ?? []
      await Promise.all(probes.map((probe) => refresh(probe, routes.map((route) => route.id), signal)))
      const at = now()
      const sources: SourceState[] = []

      for (const probe of probes) {
        const cache = cacheFor(probe.id)
        if (cache.skipped || (cache.snapshot === null && cache.error === null)) continue
        const override = input.config.sourceOverrides[probe.id]
        const providers = routes.filter((route) => probe.match(route.id)).map((route) => route.id)
        sources.push({
          id: probe.id,
          label: override?.label ?? probe.label,
          ok: cache.error === null && cache.snapshot !== null,
          providers,
          ...(cache.fetchedAt === null
            ? {}
            : { fetchedAt: cache.fetchedAt, ageMs: Math.max(0, at - cache.fetchedAt) }),
          ...(cache.error !== null && cache.snapshot !== null ? { stale: true } : {}),
          ...(cache.snapshot === null ? {} : { snapshot: cache.snapshot }),
          ...(cache.error === null ? {} : { error: cache.error }),
```

</details>

**依据 6 · 源码核查**：[src/providers/deepseek.ts:53-85](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/deepseek.ts#L53-L85)

endpoint与Bearer。

<details>
<summary>查看原文（33行）</summary>

```text
export function deepseekBaseURL(host: ProbeHost): string {
  const configured = host.config.deepseek.baseURL ?? host.llmDeepseek?.baseURL ?? process.env['DEEPSEEK_BASE_URL'] ?? null
  return (configured ?? 'https://api.deepseek.com').replace(/\/+$/, '')
}

/**
 * Resolve the credential reference the routed adapter would use: the route's own
 * configured reference first, then the `llm-deepseek` settings section, then the
 * plugin's default.
 */
export function deepseekApiKeyEnv(host: ProbeHost): string {
  if (host.routeApiKeyEnv !== undefined) return host.routeApiKeyEnv
  return host.config.deepseek.apiKeyEnv === 'DEEPSEEK_API_KEY' && host.llmDeepseek?.apiKeyEnv !== undefined
    ? host.llmDeepseek.apiKeyEnv
    : host.config.deepseek.apiKeyEnv
}

/** DeepSeek balance probe. */
export const deepseekProbe: Probe = {
  id: DEEPSEEK_SOURCE_ID,
  label: 'DeepSeek',
  match: (routeId) => /^deepseek/i.test(routeId),
  async probe(host, signal) {
    const envName = deepseekApiKeyEnv(host)
    const secret = await host.resolveSecret(envName)
    if (secret === null) throw new SkipSource('NO_CREDENTIAL', `${envName} is not configured`)

    const payload = await fetchJson({
      url: `${deepseekBaseURL(host)}/user/balance`,
      headers: { authorization: `Bearer ${secret}` },
      timeoutMs: host.timeoutMs,
      signal,
      fetchImpl: host.fetchImpl,
```

</details>

**依据 7 · 源码核查**：[src/http.ts:45-55](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/http.ts#L45-L55)

运行API要求。

<details>
<summary>查看原文（11行）</summary>

```text
export async function fetchJson(request: JsonRequest): Promise<unknown> {
  const timeout = AbortSignal.timeout(request.timeoutMs)
  const signal = request.signal === undefined ? timeout : AbortSignal.any([request.signal, timeout])
  let response: Response
  try {
    response = await request.fetchImpl(request.url, {
      method: request.method ?? 'GET',
      headers: { accept: 'application/json', ...(request.headers ?? {}) },
      ...(request.body === undefined ? {} : { body: request.body }),
      signal,
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读声明与身份/缓存有哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

HTTP handler只检查GET/HEAD后aggregator.state，没有调用宿主connection admission或独立身份校验；浏览器带same-origin cookie不代表服务器验证了cookie，具体远程访问面需由匹配宿主/反代闭合。即使接口不改配置，查询可触发上游请求和OAuth刷新，不能将GET当无副作用。Kimi按候选.kimi-code/.kimi文件读登录态，token过期POST刷新，persistRefreshedToken默认true会tmp+rename写CLI凭据。它读取前后比较raw可避免已发生的外部改变，但比较与rename间无文件版本锁，不是原子CAS，CLI并发刷新仍有覆盖窗口。

缓存键仅probe.id，不含route/credential主体/endpoint，hostFor又取首匹配route；同类多个账号会被合并标给多个providers，TTL内切账号/密钥仍可能显示旧账号余额。HTTP no-store只是浏览器缓存策略，源码确有host内存缓存，与README“接口不缓存”需区别。旧snapshot携错误和fetchedAt可见是良好设计，但不能据此恢复账号归属；Key发往可配置baseURL/oauthHost，设置者须确认接收方。错误响应正文最多显示160字符，并不自动保证第三方echo的秘密被脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[src/route.ts:44-62](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/route.ts#L44-L62)

route无本地准入。

<details>
<summary>查看原文（19行）</summary>

```text
export function registerStateRoute(webServer: WebServerLike, aggregator: Aggregator): () => void {
  return webServer.register({
    kind: 'exact',
    path: STATE_ROUTE_PATH,
    handler: async (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      try {
        sendJson(response, 200, await aggregator.state())
      } catch (error) {
        // `state()` is written not to reject; this is the belt to that suspenders,
        // because an unhandled rejection here would leave the socket hanging.
        sendJson(response, 500, {
          ok: false,
          error: { code: 'NETWORK', message: error instanceof Error ? error.message : String(error) },
        })
```

</details>

**依据 2 · 源码核查**：[src/providers/kimi-code.ts:142-155](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/kimi-code.ts#L142-L155)

CLI文件候选读取。

<details>
<summary>查看原文（14行）</summary>

```text
/** First existing credential candidate. */
async function existingTokenFile(host: ProbeHost): Promise<string | null> {
  const candidates = [
    ...(host.config.kimiCode.tokenFile === null ? [] : [host.config.kimiCode.tokenFile]),
    ...host.config.kimiCode.tokenFileFallbacks,
  ]
  for (const candidate of candidates) {
    try {
      const text = await readFile(candidate, 'utf8')
      if (text.trim().length > 0) return candidate
    } catch {
      /* try the next candidate */
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/config.ts:225-232](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/config.ts#L225-L232)

默认写回开。

```text
    kimiCode: {
      apiKeyEnv: asString(kimi['apiKeyEnv']) ?? 'KIMI_API_KEY',
      tokenFile: tokenFile ?? (candidates[0] ?? null),
      tokenFileFallbacks: candidates.filter((candidate) => candidate !== tokenFile),
      oauthHost: asString(kimi['oauthHost']) ?? 'https://auth.kimi.com',
      baseURL: asString(kimi['baseURL']) ?? 'https://api.kimi.com/coding/v1',
      clientId: asString(kimi['clientId']) ?? KIMI_CLIENT_ID,
      persistRefreshedToken: asBoolean(kimi['persistRefreshedToken'], true),
```

**依据 4 · 源码核查**：[src/providers/kimi-code.ts:166-208](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/kimi-code.ts#L166-L208)

刷新POST。

<details>
<summary>查看原文（43行）</summary>

```text
async function refreshTokens(
  host: ProbeHost,
  file: string,
  rawBefore: string,
  previous: KimiTokens,
  signal: AbortSignal,
): Promise<RefreshOutcome> {
  if (previous.refreshToken === null) {
    throw new HttpFailure('TOKEN_EXPIRED', 'the Kimi credential has no refresh token')
  }
  const body = new URLSearchParams({
    client_id: host.config.kimiCode.clientId,
    grant_type: 'refresh_token',
    refresh_token: previous.refreshToken,
  })
  let payload: unknown
  try {
    payload = await fetchJson({
      url: `${host.config.kimiCode.oauthHost.replace(/\/+$/, '')}/api/oauth/token`,
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      timeoutMs: host.timeoutMs,
      signal,
      fetchImpl: host.fetchImpl,
    })
  } catch (error) {
    if (error instanceof HttpFailure && (error.status === 401 || error.status === 403)) {
      throw new HttpFailure('TOKEN_EXPIRED', 'the Kimi refresh token was rejected')
    }
    throw error
  }
  const record = recordOf(payload)
  const accessToken = typeof record['access_token'] === 'string' ? record['access_token'] : null
  if (accessToken === null) throw new HttpFailure('BAD_RESPONSE', 'the refresh response carried no access_token')
  const expiresIn = numberOf(record['expires_in'])
  const tokens: KimiTokens = {
    accessToken,
    refreshToken: typeof record['refresh_token'] === 'string' ? record['refresh_token'] : previous.refreshToken,
    expiresAtMs: expiresIn === null ? null : Date.now() + expiresIn * 1000,
  }
  const persisted = await persistRefreshed(host, file, rawBefore, tokens, record)
  return { tokens, persisted }
```

</details>

**依据 5 · 源码核查**：[src/providers/kimi-code.ts:226-257](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/kimi-code.ts#L226-L257)

读比较与rename分离。

<details>
<summary>查看原文（32行）</summary>

```text
  if (!host.config.kimiCode.persistRefreshedToken) return false
  let current: string | null = null
  try {
    current = await readFile(file, 'utf8')
  } catch {
    current = null
  }
  if (current === null || current !== rawBefore) {
    host.warn('kimi credential changed while refreshing; the new token stays in memory')
    return false
  }
  let document: Record<string, unknown>
  try {
    document = recordOf(JSON.parse(current) as unknown)
  } catch {
    document = {}
  }
  const expiresIn = numberOf(response['expires_in'])
  const merged: Record<string, unknown> = {
    ...document,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    scope: typeof document['scope'] === 'string' ? document['scope'] : 'kimi-code',
    token_type: typeof document['token_type'] === 'string' ? document['token_type'] : 'Bearer',
    expires_at: Math.floor((tokens.expiresAtMs ?? Date.now() + 900_000) / 1000),
  }
  if (expiresIn !== null) merged['expires_in'] = expiresIn
  const temporary = `${file}.tmp-${process.pid}`
  try {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(temporary, `${JSON.stringify(merged, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    await rename(temporary, file)
```

</details>

**依据 6 · 源码核查**：[src/state.ts:87-101](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L87-L101)

cache仅id。

<details>
<summary>查看原文（15行）</summary>

```text
  const caches = new Map<string, SourceCache>()

  function cacheFor(id: string): SourceCache {
    const existing = caches.get(id)
    if (existing !== undefined) return existing
    const created: SourceCache = {
      snapshot: null,
      fetchedAt: null,
      error: null,
      skipped: false,
      skipDetail: null,
      nextAttemptAt: 0,
      inFlight: null,
    }
    caches.set(id, created)
```

</details>

**依据 7 · 源码核查**：[src/state.ts:125-136](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L125-L136)

首route身份。

<details>
<summary>查看原文（12行）</summary>

```text
  function hostFor(probe: Probe, routes: readonly string[]): ProbeHost {
    const override = input.config.sourceOverrides[probe.id]
    // The first registered route this source answers for: the credential the
    // routed adapter would use belongs to that route, not to the plugin.
    const route = routes.find((candidate) => probe.match(candidate))
    const routeApiKeyEnv = route === undefined ? undefined : input.piAiApiKeyEnv?.(route)
    return {
      config: input.config,
      timeoutMs: input.config.timeoutMs,
      fetchImpl,
      ...(route === undefined ? {} : { routeId: route }),
      ...(routeApiKeyEnv === undefined ? {} : { routeApiKeyEnv }),
```

</details>

**依据 8 · 源码核查**：[src/http.ts:75-79](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/http.ts#L75-L79)

原始错误片段。

```text
async function readErrorDetail(response: Response): Promise<string> {
  try {
    const text = await response.text()
    const trimmed = text.trim().replace(/\s+/g, ' ')
    return trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed
```

#### 缺口

- 宿主对exact route的真实准入和多用户账号隔离未由目标组件闭合
  **影响**：不能把同源cookie或只读看板解释为用户认证/账户隔离
  **进一步探讨**：阅读部署宿主dispatch和credential作用域，先只用可信单用户环境

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 容错、测试和运行成本有什么证据？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

provider/state/http/format/modes分离，单源inFlight和TTL避免重复网络，SkipSource可隐藏并给未支持route占位原因，错误不抹旧数据；state mock使用脚本probe和时钟，能检查TTL与失败隔离，不证明真实服务持续返回相同字段。本次只读测试，没有执行。fetchJson超时signal覆盖取body，但成功response.json和失败response.text均无专门字节上限，畸形响应可能耗内存。

首次要核对账号到route、配置端点和Kimi OAuth写回意图。持续卡片不调用LLM，付出上游查询、浏览器轮询与本地状态计算；客户端setInterval即使页面hidden仍运行，只在变visible时额外刷新，卸载清timer但未取消正在load的fetch，也无前端inFlight去重，慢请求可重叠而服务器按源合并。恢复要区分stale、账号映射错误和token续期失败，若CLI凭据轮换冲突可能需重新登录；GUI位置/模式在localStorage，不等账号数据被落浏览器。节省控制台时间与服务费用没有同任务量化。

#### 证据与依据

**依据 1 · 源码核查**：[test/state.test.mjs:13-60](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/test/state.test.mjs#L13-L60)

脚本probe和TTL测试。

<details>
<summary>查看原文（48行）</summary>

```text
/** A scripted probe: each call consumes the next step, and it answers for its own id. */
function scriptedProbe(id, steps, { match = (route) => route === id } = {}) {
  const state = { calls: 0 }
  return {
    state,
    probe: {
      id,
      label: id,
      match,
      async probe() {
        const step = steps[Math.min(state.calls, steps.length - 1)]
        state.calls += 1
        if (typeof step === 'function') return step()
        if (step instanceof Error) throw step
        return step
      },
    },
  }
}

const BALANCE = { kind: 'balance', entries: [{ currency: 'CNY', total: 50 }] }

function makeAggregator({ probes, listRoutes, now = () => 1_000_000, defaultSelection }) {
  return createAggregator({
    config: CONFIG,
    probes,
    fetchImpl: async () => new Response('{}'),
    now,
    resolveSecret: async () => null,
    // Auto mode is gated on registered routes, so every scripted probe is
    // registered unless a test says otherwise.
    listRoutes: listRoutes ?? (() => probes.map((probe) => ({ id: probe.id, name: probe.id }))),
    ...(defaultSelection === undefined ? {} : { defaultSelection }),
    warn: () => {},
  })
}

test('a fresh source is not refetched inside the TTL', async () => {
  let clock = 1_000_000
  const scripted = scriptedProbe('a', [BALANCE])
  const aggregator = makeAggregator({ probes: [scripted.probe], now: () => clock })
  await aggregator.state()
  clock += 30_000
  await aggregator.state()
  assert.equal(scripted.state.calls, 1)

  clock += 31_000
  await aggregator.state()
```

</details>

**依据 2 · 源码核查**：[src/state.ts:164-178](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L164-L178)

skip/error重试分支。

<details>
<summary>查看原文（15行）</summary>

```text
        if (error instanceof SkipSource) {
          // A skip is silent by design, but it must still be explainable:
          // log it once per distinct reason and keep it for the placeholder.
          if (cache.skipDetail !== error.message) warn(`${probe.id}: skipped — ${error.message}`)
          cache.skipped = true
          cache.skipDetail = error.message
          cache.nextAttemptAt = now() + RETRY_MS
          return
        }
        const failure = toFailure(error)
        cache.error = failure
        cache.skipped = false
        cache.skipDetail = null
        cache.nextAttemptAt = now() + Math.min(input.config.refreshMs, RETRY_MS)
        warn(`${probe.id}: ${failure.code} ${failure.message}`)
```

</details>

**依据 3 · 源码核查**：[src/http.ts:62-79](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/http.ts#L62-L79)

body读取未限字节。

<details>
<summary>查看原文（18行）</summary>

```text
  if (!response.ok) {
    const detail = await readErrorDetail(response)
    throw new HttpFailure(mapStatus(response.status), detail, response.status)
  }

  try {
    return (await response.json()) as unknown
  } catch (error) {
    throw new HttpFailure('BAD_RESPONSE', `not JSON: ${error instanceof Error ? error.message : String(error)}`, response.status)
  }
}

/** Preview a failed response body without ever echoing more than a line. */
async function readErrorDetail(response: Response): Promise<string> {
  try {
    const text = await response.text()
    const trimmed = text.trim().replace(/\s+/g, ' ')
    return trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed
```

</details>

**依据 4 · 源码核查**：[client/client.js:946-975](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/client/client.js#L946-L975)

load与interval生命周期。

<details>
<summary>查看原文（30行）</summary>

```text
			const useSessions = props.useSessions;
			const currentProvider = useSessions === void 0 ? null : useSessions(selectCurrentProvider);
			const load = (0, react.useCallback)(async () => {
				try {
					const next = await fetchState();
					setLoaded({
						response: next,
						at: Date.now()
					});
					setFailure(null);
					setNow(Date.now());
				} catch (error) {
					setFailure(error instanceof Error ? error.message : String(error));
				}
			}, []);
			(0, react.useEffect)(() => {
				let cancelled = false;
				const run = () => {
					if (!cancelled) load();
				};
				run();
				const timer = window.setInterval(run, refreshMs);
				const onVisible = () => {
					if (document.visibilityState === "visible") run();
				};
				document.addEventListener("visibilitychange", onVisible);
				return () => {
					cancelled = true;
					window.clearInterval(timer);
					document.removeEventListener("visibilitychange", onVisible);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件和继续探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，主要是route认证依赖、source按类别而非账号分区、Kimi默认写回登录态及非原子CAS，实际权限面大于“只读余额”。可信单用户、单route对应单账号且明确接受OAuth续期的隔离环境可做对照；可先禁Kimi写回、限定sources和可信端点，不把旧余额用于自动财务决策。出现切账号仍旧值、共享route标错、token文件被意外改变或未授权能取数时停用并保留原凭据备份。

值得进一步研究账号指纹与endpoint/revision分区cache，多个同类route分别取数并显式标主体；读取接口与OAuth续期拆成需确认的能力，真正跨进程版本守卫写或交CLI服务统一刷新。基线为当前probe-id缓存与读比较rename，反例包含两个同类账号、TTL内换key、CLI同步刷新、slow body/重叠轮询和匿名route访问，比较错账号、覆盖、恢复工时与请求量。当前未验证，不把源码guard当已经端到端安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:87-101](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L87-L101)

缓存粒度。

<details>
<summary>查看原文（15行）</summary>

```text
  const caches = new Map<string, SourceCache>()

  function cacheFor(id: string): SourceCache {
    const existing = caches.get(id)
    if (existing !== undefined) return existing
    const created: SourceCache = {
      snapshot: null,
      fetchedAt: null,
      error: null,
      skipped: false,
      skipDetail: null,
      nextAttemptAt: 0,
      inFlight: null,
    }
    caches.set(id, created)
```

</details>

**依据 2 · 源码核查**：[src/state.ts:125-136](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L125-L136)

主体选择。

<details>
<summary>查看原文（12行）</summary>

```text
  function hostFor(probe: Probe, routes: readonly string[]): ProbeHost {
    const override = input.config.sourceOverrides[probe.id]
    // The first registered route this source answers for: the credential the
    // routed adapter would use belongs to that route, not to the plugin.
    const route = routes.find((candidate) => probe.match(candidate))
    const routeApiKeyEnv = route === undefined ? undefined : input.piAiApiKeyEnv?.(route)
    return {
      config: input.config,
      timeoutMs: input.config.timeoutMs,
      fetchImpl,
      ...(route === undefined ? {} : { routeId: route }),
      ...(routeApiKeyEnv === undefined ? {} : { routeApiKeyEnv }),
```

</details>

**依据 3 · 源码核查**：[src/providers/kimi-code.ts:226-257](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/kimi-code.ts#L226-L257)

续期写回窗口。

<details>
<summary>查看原文（32行）</summary>

```text
  if (!host.config.kimiCode.persistRefreshedToken) return false
  let current: string | null = null
  try {
    current = await readFile(file, 'utf8')
  } catch {
    current = null
  }
  if (current === null || current !== rawBefore) {
    host.warn('kimi credential changed while refreshing; the new token stays in memory')
    return false
  }
  let document: Record<string, unknown>
  try {
    document = recordOf(JSON.parse(current) as unknown)
  } catch {
    document = {}
  }
  const expiresIn = numberOf(response['expires_in'])
  const merged: Record<string, unknown> = {
    ...document,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    scope: typeof document['scope'] === 'string' ? document['scope'] : 'kimi-code',
    token_type: typeof document['token_type'] === 'string' ? document['token_type'] : 'Bearer',
    expires_at: Math.floor((tokens.expiresAtMs ?? Date.now() + 900_000) / 1000),
  }
  if (expiresIn !== null) merged['expires_in'] = expiresIn
  const temporary = `${file}.tmp-${process.pid}`
  try {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(temporary, `${JSON.stringify(merged, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    await rename(temporary, file)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
