# opencode2dsh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[89f7c42](https://github.com/FishBottle7/opencode2dsh/tree/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin)

<!-- BEGIN META -->
[![GitHub ★ 367](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=367&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FishBottle7/opencode2dsh) [![npm 30d 12,915](https://img.shields.io/static/v1?label=npm+30d&message=12%2C915&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin)
<!-- END META -->

> **功能**：把 OpenCode Zen 模型注册为 DSH 原生供应商，提供目录刷新、流式适配和可选网络及本机委派。

> **亮点**：它让 Zen 的模型目录和流式消息进入 DSH 原生供应商路径，并以内容交付边界区分恢复条件；可减少分散接线，未证明持续免费供给或任务质量。见[Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：目录允许和匿名请求形态不能保证当前服务资格；持续拒绝的本机退路还可能引入认证副本、运行时下载与进程，不能把默认免账号免进程概括到所有模式。见[Q02](#research-q02)、[Q04](#research-q04)。

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
  - [Q01 · 原生入口与贡献是什么，是否必然免账号免进程？](#detail-section-11)
  - [Q02 · 目录、白名单和实际服务资格是否同一保证？](#detail-section-12)
  - [Q03 · 流式故障恢复怎样避免重复工具调用？](#detail-section-13)
  - [Q04 · 可选代理池与本地委派的依赖、状态和成本是什么？](#detail-section-14)
  - [Q05 · 什么人值得采用，如何证伪稳定供给假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 DSH、希望减少兼容代理维护的操作者，可观察原生 Zen 供应商适配；任务仍需容忍供给中断和人工退路。见[Q01](#research-q01)。

基线是维护单独兼容代理、独立 OpenCode，或继续使用正式配置的供应商；增量在宿主接线与恢复组织，不是新模型推理能力。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Zen 模型适配器 | 在 DSH 供应商选择中提供模型 | 外部资格和网络仍由上游决定 |
| 目录刷新与允许列表 | 控制模型曝光和指定集合 | 空白名单不限制；目录隐藏不等于全部服务入口硬拒绝 |
| 流式看门狗与恢复 | 结束静默流并有限重试 | 内容交付前后采取不同策略，宿主幂等性需另验 |
| 思考耗尽恢复 | 无答案或工具时关闭思考重试一次 | 模型需支持 off，使用量累计 |
| 可选 IP pool 设置 | 管理请求网络出口 | 默认关闭，启用增加代理与运行时依赖 |
| 可选本机委派 | 匿名资格持续拒绝后使用 OpenCode | 默认关闭，涉及已有认证副本与本机进程 |

**流程与依赖**

默认只需 llm 服务及外部模型资格，代理与委派各自增加网络、凭据和进程依赖；完整条件表见[Q04](#research-q04)。

先核对模式和开关，再检查目录与实际任务，异常时及时退回已有供应商；详细步骤及退出数据见[Q04](#research-q04)。

**效果与成本**

首装、探测、流恢复、缓存与认证副本维护均有负担，金额与时长未知；四阶段成本表见[Q04](#research-q04)。

已实现适配和有界恢复机制，持续供给与同任务效率没有实测；效果表见[Q04](#research-q04)。

> **思考**：目录允许和匿名请求形态不能保证当前服务资格；持续拒绝的本机退路还可能引入认证副本、运行时下载与进程，不能把默认免账号免进程概括到所有模式。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它让 Zen 的模型目录和流式消息进入 DSH 原生供应商路径，并以内容交付边界区分恢复条件；可减少分散接线，未证明持续免费供给或任务质量。见[Q01](#research-q01)、[Q03](#research-q03)。

内容前缓冲与内容后终止、累计恢复用量、目录刷新去重值得借鉴；外部 SDK/宿主协议和目录政策需要持续适配。同名 providerId 清理及认证副本应纳入退出核对。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

目录允许和匿名请求形态不能保证当前服务资格；持续拒绝的本机退路还可能引入认证副本、运行时下载与进程，不能把默认免账号免进程概括到所有模式。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。后续只在明确允许模型、代理与委派关闭的非关键任务核对资格和错误；持续拒绝、中途断流或工具重复时停用，回已有可用模型供应商。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生注册、目录和流恢复有固定源码依据；外部匿名资格、目标宿主及任务收益未验证。可选模式改变权限范围，采用观察，未来假设仍未验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin/package.json、packages/plugin/cordis.patch.yml、packages/plugin/src/index.ts、packages/plugin/src/config.ts、packages/plugin/src/provider.ts、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/adapter/zen-adapter.ts、packages/plugin/src/adapter/stream-truncation.ts、packages/plugin/src/adapter/delegate.ts、packages/plugin/src/ip-pool-settings/apply.ts、packages/plugin/src/client/index.ts 及固定范围 inventory；组件：packages/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 packages/plugin 组件定向阅读入口、配置、目录、流适配、截断分类、认证委派及IP池设置生命周期；未审计全部代理下载、转换与客户端实现，未执行目标代码或外部模型探测。
- 下一步：后续在固定宿主核对目录资格、白名单、内容前故障、工具参数途中和内容后故障，分别记录最终状态、模型请求及工具副作用；及时报错与恢复应同任务比较。

**分析版本**

- **仓库**：[FishBottle7/opencode2dsh](https://github.com/FishBottle7/opencode2dsh)
- **版本号**：0.3.14（[固定提交 89f7c42](https://github.com/FishBottle7/opencode2dsh/tree/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把目录、网络资格和任务成功分层记录，并对明确资格拒绝可见暂停，可能比加长重试更省等待；与及时报错对照合格率、耗时和切回投入，简单方案同样好就放弃。见[Q05](#research-q05)。

后续在固定宿主核对目录资格、白名单、内容前故障、工具参数途中和内容后故障，分别记录最终状态、模型请求及工具副作用；及时报错与恢复应同任务比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 36 | 11164 | 7239 | 3314 | — |
| .tsx | source | 1 | 1018 | 876 | 93 | — |
| .ts | test | 38 | 10214 | 8284 | 1327 | — |
| .ts | example | 1 | 5 | 4 | 1 | — |
| .mjs | example | 3 | 168 | 111 | 46 | — |
| .mts | test | 5 | 505 | 380 | 84 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/FishBottle7/opencode2dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生模型适配器在什么资格、恢复与权限条件下能够服务 DSH？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生入口与贡献是什么，是否必然免账号免进程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是一个真正导出 Config、inject 和 apply 的 DSH 模型供应商插件。package main 指向编译后的 lib/index.js，bundle patch 插入 @opencode2dsh/dsh-plugin；apply 默认选择 adapter，向 llm.registerAdapter 注册 opencode2dsh。因此默认路径不需要用户维护一个 OpenAI 兼容反向代理服务，模型作为宿主供应商出现。这不同于只提供一份提示词或把 MCP 取数包装成模型。

目标人群是希望在 DSH 内使用 Zen 可访问模型、愿意接受外部供给波动并能判断模型资格的操作者。基线是使用正式配置的模型供应商，或独立 OpenCode 运行再搬运结果。插件具体增加了目录、消息/事件和流式请求的宿主适配，核心推理由上游模型与 pi-ai 提供；没有将适配层视为新的模型能力或已证明的质量提升。

“免账号、无额外进程”只适用于默认匿名 adapter 路径的设计目标，不能概括全部配置。config 同时保留 legacy sidecar 方式，另有默认关闭的本地 OpenCode delegate。后者在匿名请求持续收到 FreeTierError 后，可能读取已有 OpenCode 认证、准备托管运行时并启动本机服务。默认 IP 池也关闭，启用后增加网络出口和可选转换进程。因此采用前必须确认实际 mode 与两个开关，而不是只读 README 顶部概述。

匿名常量 public、请求形态和目录静态条目只能证明请求如何构造，不能证明外部服务现在允许这个账户、位置或流量。源码自己包含匿名资格拒绝及退路逻辑，足以说明“永久免账号且稳定可用”不是本插件能够保证的交付。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:80-103](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/index.ts#L80-L103)

默认 adapter 和分支选择。

<details>
<summary>查看原文（24行）</summary>

```text
 * `ctx.inject` instead.
 */
export const inject = ['llm'] as const
export function apply(ctx: PluginContext, config: ResolvedPluginConfig | Opencode2dshConfig = {}): void {
  // A host that predates the `Config` export hands over the raw patch object
  // (no volatile reference); readVolatile copes with both spellings.
  const resolved = config as ResolvedPluginConfig
  const mode = resolveConfig(config as Opencode2dshConfig).mode
  // Cordis accepts disposal effects; readiness objects are invalid effects.
  if (mode === 'sidecar') applySidecar(ctx, config as Opencode2dshConfig)
  else applyAdapter(ctx, resolved, () => readVolatile<IpPoolSettings>(resolved.ipPool))
}

/**
 * Adapter mode: catalog + LlmAdapter registration. The adapter registration
 * is disposed with the plugin fiber (registerAdapter uses ctx.effect
 * internally); we only own the catalog refresh loop here.
 */
function applyAdapter(
  ctx: PluginContext,
  config: ResolvedPluginConfig,
  readIpPool: () => Partial<IpPoolSettings> | undefined,
): { ready: Promise<{ port: number; version: string }> } {
  const logger = ctx.logger
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:170-188](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/index.ts#L170-L188)

实际注册宿主适配器。

<details>
<summary>查看原文（19行）</summary>

```text
  })

  // Register FIRST: the provider must appear in the selector right away. The
  // host awaits listModels and caches its answer per host generation, so the
  // registration-time read warms the catalog (bounded, issue #45) instead of
  // handing the picker the staticFreeModels bootstrap list. Registration
  // deliberately precedes every optional layer below — a throw anywhere in
  // the ip-pool wiring, the stale-route sweep, or the refresh loop must never
  // cost the deployment its only free provider.
  publishedCatalog = catalogSignature()
  registration = ctx.llm.registerAdapter([PROVIDER_ID], adapter)
  logger.info(`opencode2dsh: adapter registered for "${PROVIDER_ID}" (catalog warms up in background)`)

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the volatile `ipPool`
  // settings field with live apply + the /status /models /probe bridge. Opt-in
  // via settings page or cordis.patch.yml; disabled keeps the process
  // byte-for-byte on direct. Lifecycle (assembly on first enable, live
  // reconfigure, dispose) is owned by applyIpPoolSettings through the plugin
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/config.ts:86-111](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/config.ts#L86-L111)

可选委派需要已有凭据，且默认关闭。

<details>
<summary>查看原文（26行）</summary>

```text
 */
export interface DelegationConfig {
  /**
   * Master switch. Default false: the plugin stays a stateless anonymous
   * client and never touches the user's credential. Enabling makes the plugin a
   * credential custodian — read docs/delegation.md first.
   */
  enabled?: boolean
  /**
   * Explicit path to an opencode binary. When set, the managed/global/npm
   * resolution is skipped and this binary is used (still version-checked).
   */
  opencodePath?: string
  /** Lowest opencode version the delegate will use (default 1.18.0, the free-tier floor). */
  minVersion?: string
  /** GOMEMLIMIT injected into the child (Go heap soft cap). Default 96MiB. */
  memLimit?: string
  /** GOGC injected into the child. Default 30. */
  gcPercent?: number
  /** EmptyWorkingSet memory-trim interval ms; 0 disables trimming. Default 60000. */
  trimIntervalMs?: number
  /** Health-wait budget for the spawned server, ms. Default 60000. */
  startTimeoutMs?: number
}

/** docs/ip-pool.md section 5.1 schema (subset owned by config today). */
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:156-174](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L156-L174)

匿名 key 和宿主重试策略是请求设计。

<details>
<summary>查看原文（19行）</summary>

```text
/** Anonymous credential: the literal upstream accepts for the free lane. */
const ANONYMOUS_KEY = 'public'

/**
 * Retry policy the host (dsh-llm-retry) runs for this provider. Resolved
 * shape is FLAT (backoff fields at top level — see ResolvedNormalRetryPolicy,
 * dsh-llm index.js:1867 consumes the adapter value verbatim). Retryable codes
 * mirror the host default set so behavior differs only in patience, not in
 * which failures qualify. Cumulative worst case per step:
 * 1+2+4+8+16+20+20+20 ≈ 91s of silent retries before the error surfaces.
 */
export const FREE_LANE_RETRY_POLICY = Object.freeze({
  mode: 'normal' as const,
  maxRetries: 8,
  retryableCodes: Object.freeze(['EMPTY_RESPONSE', 'RATE_LIMIT', 'SERVER', 'TIMEOUT', 'TRANSPORT']),
  initialDelayMs: 1_000,
  maxDelayMs: 20_000,
  jitterRatio: 0.2,
})
```

</details>

**依据 5 · 源码核查**：[packages/plugin/cordis.patch.yml:6-9](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/cordis.patch.yml#L6-L9)

bundle 实际插入插件。

```text
- insert:
    - id: opencode2dsh
      name: '@opencode2dsh/dsh-plugin'
      config: {}
```

#### 缺口

- 上游当前匿名资格和供给未查询或实测
  **影响**：不能把免账号声明写成确认当前可用
  **进一步探讨**：后续在明确目标环境核对服务资格与失败消息，再决定是否启用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、白名单和实际服务资格是否同一保证？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

目录管理器合并在线 Zen 模型列表、models.dev 元数据、磁盘缓存和编译时静态列表，并定期刷新与探测部分受限模型。refreshZen 失败记录错误且保留已有集合，warm 只等待一个有界时间，避免模型选择器长期阻塞。模型显示是从当前目录按 decision 过滤，用户 allowedModels 在末尾进一步收窄；空数组归一化为 null，意为不限制，不是拒绝全部。

decision 首先拒绝本地 blocklist，探测集必须取得 pass；随后看元数据。当元数据缺失或 deprecated 且 ID 在静态列表时，静态依据仍可允许。代码注释中“deprecated 始终不被白名单复活”描述的是白名单层，不等于前面的静态条目永不覆盖 deprecated 元数据。这里是作者维护静态可用判断与第三方元数据冲突时的取舍，需要把 known/source 保留下来。

关键边界是“选择器显示资格”和“直接服务调用门槛”不同。stream 只对用户 whitelist 执行失败前硬拒绝，明确注明 probe_pending/blocklisted 的直接调用仍交给上游判断。因此目录隐藏某模型不能等同于插件在所有入口绝不向它发请求。允许列表适合限制操作者有意选中的模型集合，但并不是实时免费资格证书。模型返回的收费、地区、凭据或废弃状态最终由外部服务决定，目录回退无法替代服务资格。

对依赖确定模型名称的工作流，目录变化会影响可见模型和能力元数据；可使用明确允许列表收窄，并保留实际错误，但不能靠静态列表保证服务持续性。本次没有调用外部目录或模型探测，未将作者的 static_verified 标签当成本轮独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:320-345](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/catalog.ts#L320-L345)

空白名单为无限制及目录决策设计。

<details>
<summary>查看原文（26行）</summary>

```text

/**
 * Normalize the #83 whitelist: trim and dedupe ids, drop blanks; undefined,
 * an empty list, or only blanks = `null` = no gate. Every consumer (the
 * decision tail, the probe skip, the startup warn) reads through this, so
 * "empty means everything" has one source of truth.
 */
export function normalizeAllowedModels(ids: unknown): ReadonlySet<string> | null {
  if (!Array.isArray(ids)) return null
  const set = new Set<string>()
  for (const id of ids) {
    if (typeof id === 'string' && id.trim().length > 0) set.add(id.trim())
  }
  return set.size > 0 ? set : null
}

/**
 * Live model directory with the S1/S2/S3 fallback chain and the timer-driven
 * refresh loop. All state is in-memory; only the models.dev cache persists.
 *
 * Decision chain (design.md 4.1/4.2, with the deprecation-first fix):
 *   1. ready metadata verdict — deprecated/paid deny, free cost allows; a
 *      "free" name never overrides a negative metadata verdict
 *   2. metadata cannot speak (pending/missing) — name fallback, or the
 *      compile-time verified S3 list for known-good ids
 *   3. the issue #83 allowedModels whitelist — narrowing only and always
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:455-469](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/catalog.ts#L455-L469)

在线刷新失败保留集合并记录错误。

<details>
<summary>查看原文（15行）</summary>

```text
    try {
      const ids = await fetchZenModels(this.#zenBaseUrl, this.#fetch, opencodeUserAgent())
      this.#zen = new Set(ids)
      this.#zenFailed = false
      this.#updatedAt = this.#now()
      this.#lastError = ''
    } catch (err) {
      this.#zenFailed = true
      this.#lastError = err instanceof Error ? err.message : String(err)
    }
  }

  async refreshMetadata(): Promise<void> {
    // Stale-while-revalidate (issue #55): on a cold boot a slow-but-healthy
    // models.dev (23s observed) outlives warm()'s window and never touches the
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:515-565](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/catalog.ts#L515-L565)

warm 有界等待、blocklist/probe/元数据与静态规则。

<details>
<summary>查看原文（51行）</summary>

```text
   */
  async warm(ms = 4_000): Promise<void> {
    if (this.#zen.size > 0 || this.#stopped) return
    let timer: NodeJS.Timeout | undefined
    const timeout = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, ms)
      timer.unref?.()
    })
    try {
      await Promise.race([this.refreshOnce().catch(() => {}), timeout])
    } finally {
      clearTimeout(timer)
    }
  }

  decision(model: string): AnonymousDecision {
    // Issue #56: the live chat lane can never serve a blocklisted id (410
    // delisted / 400 unavailable / 403 region) — deny before any metadata or
    // S3 vouch, so a stale cache or the bootstrap list cannot resurrect it.
    if (FREE_LANE_BLOCKLIST.has(model)) return { allowed: false, source: 'local_blocklist', known: true }
    // Vantage-point blocklist entries (FREE_LANE_PROBE_SET): hidden until this
    // host's own probe answers pass. Before the first probe round completes
    // the seeded default is 'refused' (issue #56's verdict) — conservative,
    // never worse than the shipped blocklist.
    if (FREE_LANE_PROBE_SET.has(model) && this.#probeVerdicts.get(model) !== 'pass') {
      return { allowed: false, source: 'probe_pending', known: false }
    }
    const metadata = decide(model, this.#prices, this.#pricesReady)
    // The S3 vouch only covers ids metadata cannot speak for. A metadata
    // verdict of deprecated is Known, but S3 entries are compile-time verified
    // against the live lane, so an S3 id stays vouched even when stale
    // metadata claims deprecation (hy3-free case: works after models.dev
    // flags it, dies only when it leaves the Zen catalog).
    let verdict = metadata
    if (!metadata.allowed && (metadata.source === 'metadata_deprecated' || !metadata.known) && staticFreeModels.includes(model)) {
      verdict = { allowed: true, source: 'static_verified', known: false }
    }
    // Issue #83: the user's allowedModels whitelist sits at the very END of
    // the chain and only NARROWS. Every verdict above stays authoritative — a
    // whitelisted id that is paid/deprecated/blocklisted/probe-refused keeps
    // its real denial source — while an otherwise-exposed id the whitelist
    // omits gets a distinct, actionable denial (`not_in_whitelisted`) instead
    // of silently vanishing into the metadata vocabulary. list() and the
    // bootstrap path both filter through this decision, so one gate covers
    // picker exposure and direct calls alike. Unset/empty = no gate at all.
    if (verdict.allowed && !this.#whitelistAllows(model)) {
      return { allowed: false, source: 'not_in_whitelisted', known: true }
    }
    return verdict
  }

```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:538-545](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L538-L545)

服务门槛只统一硬限制用户白名单。

```text
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
    const selectedEffort = options.reasoningEffort ?? options.reasoning
    const canDisableThinking = selectedEffort !== 'off' && selectedEffort !== 'none'
```

#### 缺口

- 目录静态判断与当前服务实际资格没有同条件验证
  **影响**：不能把可见模型数当当前可用供给
  **进一步探讨**：逐个核对目标允许模型的实际请求和资格，不用目录条目数量验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 流式故障恢复怎样避免重复工具调用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

适配器把上游流转换成宿主 chunks，并分开处理“尚未交付内容”和“已经开始交付内容”。#streamAttempt 在最初阶段缓冲事件，如果内容前发生可分类的出口失败，可以按次数限制换出口或进行 sibling 请求尝试；一旦内容已交付，后续 watchdog 超时就产出终止错误并停止，不在该层重播半段内容。这个边界比在任何错误后都透明重试更适合含工具调用的 Agent，因为部分工具调用可能已经被宿主处理。

流式看门狗分别约束首事件等待和后续 body 空闲，逐 pull 只留一个计时器，避免 token 流累积计时器；中途静默会给调用方明确错误而不是永远等待。错误分类还把若干上游截断消息归为传输类，配合 adapter 提供的宿主 maxRetries=8 重试策略。适配器局部“部分输出不重播”不能直接推成宿主所有重试层都端到端幂等，宿主行为仍需目标版本检查。

外层还有一次独立的“思考耗尽”恢复。仅在第一次尝试出现 reasoning、没有答案或工具内容、以 max-tokens 结束、且模型支持 off 时，才关闭思考重发；使用量累计两次。它不是任意截断自动续写，也不保证第二次答案质量等同第一次意图。若已有答案或工具输出，就不走该分支。

本地 delegate 在持续匿名资格拒绝、明确启用且凭据就绪时尝试，输出先全部缓冲，失败返回 null 后交回匿名错误。这减少半段委派输出泄露到前端后又换轨的问题，却增加首结果等待与内存占用。没有运行样本就不能断言恢复成功率或用量下降。最值得借鉴的是将内容交付边界作为重试条件，并保持真实失败可见；移植要匹配宿主工具执行和结束事件协议。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:670-738](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L670-L738)

内容前缓冲、看门狗及内容后错误停止。

<details>
<summary>查看原文（69行）</summary>

```text
    const rotateStory: string[] = []
    for (let attempt = 0; ; attempt += 1) {
      const events = routingContext.run(contextStore, () =>
        self.#eventsFor(options, context, ids, model, attempt),
      ) as AsyncIterable<PiEvent>
      let deliveredContent = false
      let preContentFailure: { message: string } | null = null
      const buffered: PiEvent[] = []
      const source = events[Symbol.asyncIterator]()
      // Peek events until the stream proves itself one way or the other:
      // content -> flush and stream through; error before content -> maybe
      // rotate. Content flushes IMMEDIATELY (only the pre-content events are
      // buffered): holding every token hostage to a failure that may never
      // come would also kill streaming for the UI.
      let flushed = false
      let sawAnyEvent = false
      let lastEventAt = Date.now()
      // One deadline timer at a time, re-armed per pull (a timer per pull
      // would accumulate thousands over a long token stream). While no event
      // has arrived at all, the FIRST-EVENT window applies (stricter — the
      // tunnel/connect stage should answer within seconds); once ANY event
      // has landed (start, or content directly), the looser BODY-IDLE
      // window applies so slow TTFT pacing on healthy exits is not misread
      // as a dead tunnel.
      let deadlineTimer: NodeJS.Timeout | undefined
      const raceDeadline = (): Promise<never> => {
        clearTimeout(deadlineTimer)
        const idleWindow = sawAnyEvent ? bodyIdleMs : firstEventMs
        const message = sawAnyEvent ? WATCHDOG_IDLE_MESSAGE : WATCHDOG_FIRST_MESSAGE
        const ms = Math.max(0, idleWindow - (Date.now() - lastEventAt))
        return new Promise<never>((_, reject) => {
          deadlineTimer = setTimeout(() => reject(new Error(message)), ms)
          deadlineTimer.unref?.()
        })
      }
      // The pump the consumer sees after flush: buffered events first, then
      // the live rest of the stream, through ONE toStreamChunks pass so the
      // done/error terminator is never missing (the pre-fix flush fed it a
      // terminator-less slice and threw "ended without done/error").
      const pumpLive = async function* (): AsyncGenerator<PiEvent> {
        for (const e of buffered) yield e
        for (;;) {
          let next: IteratorResult<PiEvent>
          try {
            next = await Promise.race([source.next(), raceDeadline()])
          } catch (err) {
            // watchdog or foreign teardown tore the stream down mid-content:
            // the consumer already saw partial content, so surface the
            // terminal error honestly and stop — never a hang, never a replay.
            // The dispatcher's sentinel is already disarmed this late (headers
            // landed long ago), so nothing else would ever tell the pool the
            // exit died: without this report it kept its `ok` mark and its low
            // latency, i.e. the front of the next pick, and the same exit could
            // tear down the next stream too. Reuse the pool's transport
            // verdict; no rotation — content already went out (§3.4 never
            // replays a partial stream).
            reportStreamFailure(ids.session, options.model)
            yield terminalErrorEvent(err instanceof Error ? err.message : String(err), model)
            return
          }
          if (next.done) {
            clearTimeout(deadlineTimer)
            return
          }
          const event = next.value as PiEvent
          lastEventAt = Date.now()
          if (event.type === 'error' || event.type === 'done') {
            clearTimeout(deadlineTimer)
            onTerminal?.(event.type === 'done' ? event.message : event.error)
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:538-607](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L538-L607)

仅思考无答案或工具时一次恢复并累计用量。

<details>
<summary>查看原文（70行）</summary>

```text
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
    const selectedEffort = options.reasoningEffort ?? options.reasoning
    const canDisableThinking = selectedEffort !== 'off' && selectedEffort !== 'none'
      && this.resolveModel(options.provider, options.model).reasoning?.efforts.some((effort) => effort.id === 'off') === true
    let request = options
    let indexOffset = 0
    let nextIndex = 0
    let priorUsage: Extract<HarnessChunk, { type: 'usage' }>['usage'] | undefined

    for (let attempt = 0; attempt < 2; attempt += 1) {
      let sawReasoning = false
      let sawAnswerOrTool = false
      let usage: Extract<HarnessChunk, { type: 'usage' }> | undefined
      let finish: Extract<HarnessChunk, { type: 'finish' }> | undefined

      for await (const chunk of this.#streamAttempt(request, (message) => {
        for (const block of message.content) {
          if (block.type === 'thinking' && typeof block.thinking === 'string' && block.thinking.length > 0) sawReasoning = true
          if (block.type !== 'thinking' && (block.type !== 'text' || (typeof block.text === 'string' && block.text.length > 0))) sawAnswerOrTool = true
        }
      })) {
        if (chunk.type === 'usage') {
          usage = chunk
          continue
        }
        if (chunk.type === 'finish') {
          finish = chunk
          continue
        }
        if (chunk.type === 'reasoning-delta' && chunk.text.length > 0) sawReasoning = true
        if (chunk.type === 'text-delta' && chunk.text.length > 0) sawAnswerOrTool = true
        if ((chunk.type === 'block-start' && chunk.blockType === 'tool-call') || chunk.type === 'tool-call-delta') sawAnswerOrTool = true
        if (chunk.type === 'block-end') {
          if (chunk.block.type === 'reasoning' && chunk.block.text.length > 0) sawReasoning = true
          if (chunk.block.type === 'tool-call' || (chunk.block.type === 'text' && chunk.block.text.length > 0)) sawAnswerOrTool = true
        }
        if (typeof chunk.index === 'number') nextIndex = Math.max(nextIndex, chunk.index + indexOffset + 1)
        yield indexOffset === 0 ? chunk : { ...chunk, index: chunk.index + indexOffset }
      }

      const recover = attempt === 0 && canDisableThinking && sawReasoning && !sawAnswerOrTool
        && finish?.reason.kind === 'max-tokens' && !options.signal?.aborted
      if (recover) {
        priorUsage = usage?.usage
        indexOffset = nextIndex
        request = { ...options, reasoningEffort: 'off', reasoning: 'off' }
        continue
      }
      if (usage || priorUsage) {
        const current = usage?.usage
        const cacheReadTokens = (priorUsage?.cacheReadTokens ?? 0) + (current?.cacheReadTokens ?? 0)
        const cacheWriteTokens = (priorUsage?.cacheWriteTokens ?? 0) + (current?.cacheWriteTokens ?? 0)
        yield priorUsage === undefined ? usage! : {
          type: 'usage',
          usage: {
            inputTokens: priorUsage.inputTokens + (current?.inputTokens ?? 0),
            outputTokens: priorUsage.outputTokens + (current?.outputTokens ?? 0),
            ...(cacheReadTokens > 0 ? { cacheReadTokens } : {}),
            ...(cacheWriteTokens > 0 ? { cacheWriteTokens } : {}),
          },
        }
      }
      if (finish) yield finish
      return
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:790-826](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L790-L826)

有限换出口与持续资格拒绝才进入委派。

<details>
<summary>查看原文（37行）</summary>

```text
        return
      }
      if (preContentFailure === null && !deliveredContent) {
        // stream ended cleanly with no content and no error: pass through
        // (pi-ai's empty-response classification owns this case)
        yield* toStreamChunks((async function* pumped() { for (const e of buffered) yield e })(), GATE_TOOL_ALIASES)
        return
      }
      // Exit-shaped failure before content: ask the pool whether rotating is
      // worth another attempt; otherwise surface the buffered events as-is.
      const failureMessage = (preContentFailure as { message: string }).message
      const failure = classifyStreamFailure(failureMessage)
      const deterministic = isRegionBlocked(failureMessage)
      // One pool-less replay on the sibling host when the lane refuses before any
      // content has reached the user; the pool delegate is otherwise the only thing
      // that can make this true.
      const rotate = failure !== null
        && attempt < MAX_ROTATES
        && (shouldRotate(failure, options.model, ids.session, attempt + 1, deterministic)
          || (failure === 'refused' && attempt < 1))
      rotateStory.push(`#${attempt + 1} ${failure ?? 'unknown'}: ${failureMessage.slice(0, 80)}`)
      if (!rotate) {
        // Persistent anonymous-lane refusal (issue #76): when the direct attempt
        // AND the sibling replay both 403'd with the FreeTierError credential
        // gate, and the user opted into delegation, run the turn through the
        // local opencode runtime instead of surfacing the error. Any other
        // failure class, a disabled delegate, a missing credential, or a failed
        // delegation all fall through to the honest error below.
        if (this.#delegate !== null && attempt >= 1 && isFreeTierRefusal(failureMessage)) {
          const delegated = await this.#runDelegation(options, context)
          if (delegated !== null) {
            for (const chunk of delegated) yield chunk
            return
          }
        }
        // last resort: rewrite the terminal error to tell the whole story
        // (the user saw minutes of silence — the surfaced error must say
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:610-631](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L610-L631)

委派全缓冲及失败归还。

<details>
<summary>查看原文（22行）</summary>

```text
  /**
   * Run the turn through the local-opencode delegate, all-or-nothing. Returns
   * the complete chunk stream on success, or null when the delegate is not
   * usable (no credential), declines, or fails — in which case the caller falls
   * back to the anonymous lane's honest error. The result is buffered before
   * returning so a partial delegate stream can never leak to the caller.
   */
  async #runDelegation(options: HarnessGenerateOptions, context: PiContext): Promise<HarnessChunk[] | null> {
    const delegate = this.#delegate
    if (!delegate) return null
    try {
      if (!(await delegate.ready())) return null
      const chunks: HarnessChunk[] = []
      for await (const chunk of delegate.stream(options, context)) chunks.push(chunk)
      return chunks
    } catch {
      // The delegate logs its own progress/errors via its log sink; from the
      // adapter's perspective a failed delegation simply means "fall back".
      return null
    }
  }

```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/stream-truncation.ts:55-71](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/stream-truncation.ts#L55-L71)

有限枚举识别流截断，不是任意错误字符串都重试。

<details>
<summary>查看原文（17行）</summary>

```text
  'stream ended without finish_reason',
  'anthropic stream ended before message_stop',
  'stream ended before a terminal response event',
  'stream ended without a terminal event',
  'websocket closed',
  'websocket stream closed before response.completed',
  'other side closed',
  'http2 request did not get a response',
  'stream ended without a stop reason',
  'stream ended without a finish reason',
]

/** True when the (any-case) error text names a transport-grade truncation. */
export function isStreamTruncation(text: string): boolean {
  const lowered = text.toLowerCase()
  return STREAM_TRUNCATION_FRAGMENTS.some((fragment) => lowered.includes(fragment))
}
```

</details>

#### 缺口

- 宿主重试与工具执行边界未在同版本真实会话验证
  **影响**：不能宣称恢复机制保证零重复工具副作用
  **进一步探讨**：记录内容前、工具参数途中和内容后故障，核对宿主最终执行与请求次数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可选代理池与本地委派的依赖、状态和成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

默认 adapter 注册只依赖 llm 服务，catalog 刷新和健康快照在 ~/.opencode2dsh 下留数据。IP pool 设置通过 Loader volatile 配置变更热应用，只有 enabled 后才装配；停用和插件销毁会调用 runtime.dispose 并撤销桥接路由。该层会影响请求出口，所填代理和订阅决定网络信任边界，不能将免费代理当可靠基础设施；本次没有启用、下载或探测任何出口。

可选本地 delegate 是另一类权限。seedDelegateAuth 只复制原认证文件中的 opencode 条目到隔离 XDG 数据目录，用 0600 写新文件；已有目标认证文件直接保留，故更换上游原凭据不会自动覆盖旧副本。运行时选择可使用显式路径、已托管版本、用户安装，找不到还会下载官方 npm 平台包并校验。源码有清理子进程的生命周期，但不等于卸载会删除认证副本、模型目录缓存或已下载二进制。退出应单独核对这些本地数据。

adapter 启动还有一次设置副作用。它异步从 llm-pi-ai.providers 中移除同 providerId 的条目，旨在清掉旧 sidecar 路由；removeProviderRoute 以键存在为判断，不逐项证明它就是失效 sidecar。复用自定义 providerId 的环境须先备份对应配置，不能把“原生适配器”理解为完全不写宿主设置。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=20 和 DSH llm.registerAdapter | 默认路径必需 | 加载供应商与模型事件 | 不注册或宿主不兼容 |
| Zen 资格、网络与能力元数据 | 实际推理必需 | 目录和请求 | 回退目录不保证推理可用 |
| 允许模型配置与任务验收 | 可控使用必需 | 限制模型并核查交付 | 空列表不限制，质量仍需用户判断 |
| 代理地址、订阅和可选转换运行时 | 启用 IP pool 才需 | 网络出口 | 配置、信任及维护负担增加 |
| 已有 OpenCode 认证与本机运行时 | 启用 delegate 才需 | 持续资格拒绝后的本地执行 | 缺认证回真实错误；可能下载运行时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对 adapter mode，备份同名 llm-pi-ai 配置 | 明确不开代理与委派时的边界 |
| 加载 | 宿主加载 bundle 并注册 provider | 模型出现只证明目录，仍要检查资格 |
| 执行 | 用户从允许模型开始非关键任务 | 核对答案、工具与最终状态 |
| 恢复 | adapter 分别处理内容前失败与内容后终止 | 出现资格拒绝不反复扩大出口试探，保留错误 |
| 退出 | 用户停用插件并检查本地数据与宿主路由 | 进程已结束，所需配置还原，认证副本按需处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络和本地资源，金额未知 | 核对宿主、模型与允许列表 | 免费 lane 不保证资格 |
| 持续使用 | 请求、探测和恢复用量未知 | 质量验收、目录变化与资格排查 | 模型质量和服务政策不由插件保证 |
| 失败恢复 | 有限重试、缓冲和可选运行时资源 | 判断断流、凭据、出口或模型问题 | 多层重试总耗时未知 |
| 升级退出 | 二进制、缓存与认证副本占用未知 | 停进程、清开关并核对宿主设置 | 卸载不等于删除持久数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生供应商 | adapter 注册与目录刷新 | 目标 DSH 实际兼容 |
| 内容前恢复 | 有界尝试与真实错误退路 | 真实成功率和等待总成本 |
| 工具重复保护 | adapter 在内容后不透明重播 | 宿主其他重试层的幂等性 |
| 免费模型供给 | 构造匿名请求与目录判断 | 当前资格、持续供给和质量 |


#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:120-139](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/index.ts#L120-L139)

注册默认服务与本地状态路径。

<details>
<summary>查看原文（20行）</summary>

```text
  // Lifecycle (assembly on first enable, live reconfigure, dispose) is owned
  // by applyIpPoolSettings through the plugin fiber.
  const dataDir = join(homedir(), '.opencode2dsh')
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  let disposed = false
  let registration: unknown
  let publishedCatalog = ''
  const catalogSignature = (): string => JSON.stringify(catalog.list().sort().map((id) => [
    id, catalog.limits(id), catalog.modalities(id), catalog.reasoningCapability(id),
  ]))
  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:205-237](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/index.ts#L205-L237)

同名旧路由清理及卸载停止目录和委派。

<details>
<summary>查看原文（33行）</summary>

```text
  //
  // The `settings` seam is requested rather than assumed: 0.1.7's SettingsForms
  // is absent from a headless composition, and its read face is `describe()`
  // (the 0.1.1 `get(ns)` is gone), so both the read and the write go through
  // the same resolve-as-available path the sidecar uses.
  if (typeof ctx.inject === 'function') {
    void Promise.resolve(ctx.inject(['settings'], (sctx: PluginContext) => {
      if (!sctx.settings) return
      void removeProviderRoute({ settings: sctx.settings }, cfg.providerId)
        .then((removed) => {
          if (removed) logger.info(`opencode2dsh: removed stale sidecar route for "${cfg.providerId}" from llm-pi-ai settings`)
        })
        .catch((err) => {
          logger.warn(`opencode2dsh: stale route cleanup failed: ${err instanceof Error ? err.message : String(err)}`)
        })
      // Issue #83: one advisory warn when the whitelist hides the model the
      // host saved as its default — see warnHiddenDefaultModel.
      warnHiddenDefaultModel(sctx.settings, cfg.allowedModels, logger)
    })) as unknown as Promise<unknown>
  }

  const maybeEffect = (ctx as { effect?: PluginContext['effect'] }).effect
  if (typeof maybeEffect === 'function') {
    maybeEffect.call(ctx, () => () => {
      disposed = true
      catalog.stop()
      // Reap the delegated opencode child (no-op when delegation never armed).
      void delegate?.dispose()
    })
  }
  return { ready }
}

```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/provider.ts:45-53](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/provider.ts#L45-L53)

只按providerId存在就删除路由。

```text
export async function removeProviderRoute(
  seams: Pick<DshSeams, 'settings'>,
  providerId: string,
): Promise<boolean> {
  const namespace = readNamespace(seams.settings, 'llm-pi-ai') as { providers?: Record<string, unknown> } | undefined
  if (!namespace?.providers || !(providerId in namespace.providers)) return false
  if (typeof seams.settings.mutate !== 'function') return false
  await seams.settings.mutate('llm-pi-ai', [{ op: 'unset', path: ['providers', providerId] }])
  return true
```

**依据 4 · 源码核查**：[packages/plugin/src/ip-pool-settings/apply.ts:83-103](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/ip-pool-settings/apply.ts#L83-L103)

开关和热配置运行时。

<details>
<summary>查看原文（21行）</summary>

```text
  const applyCommitted = (value: IpPoolSettings): void => {
    if (disposed) return
    const rt = controller.runtime
    if (value.enabled && rt === null) {
      void ensureRuntime()
        .then(() => controller.runtime?.reconfigure(controller.asConfig(controller.settings())))
        .catch((err) => {
          logger.warn(`opencode2dsh: ip pool start failed: ${err instanceof Error ? err.message : String(err)}`)
        })
      return
    }
    if (rt !== null) {
      void rt.reconfigure(controller.asConfig(value)).catch((err) => {
        logger.warn(`opencode2dsh: ip pool live re-apply failed: ${err instanceof Error ? err.message : String(err)}`)
      })
    }
  }

  // Boot: apply the resolved value. Then every commit the Loader announces
  // takes the same path — one code path for boot and live, as before.
  applyCommitted(controller.settings())
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/ip-pool-settings/apply.ts:171-180](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/ip-pool-settings/apply.ts#L171-L180)

销毁可选网络运行时。

<details>
<summary>查看原文（10行）</summary>

```text
  logger.info(`opencode2dsh: settings namespace "${IP_POOL_NAMESPACE}" served from the plugin's volatile Config — live apply via 设置 → 插件 → IP 池`)
  const maybeEffect = (ctx as { effect?: PluginContext['effect'] }).effect
  if (typeof maybeEffect === 'function') {
    maybeEffect.call(ctx, () => () => {
      disposed = true
      void controller.runtime?.dispose()
      controller.runtime = null
    })
  }
  return controller
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:234-265](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/delegate.ts#L234-L265)

隔离复制单一认证及已有目标不覆盖。

<details>
<summary>查看原文（32行）</summary>

```text
export async function seedDelegateAuth(options: {
  dataDir: string
  home?: string
  env?: NodeJS.ProcessEnv
  log?: (message: string) => void
}): Promise<DelegateAuthState> {
  const env = options.env ?? process.env
  const home = options.home ?? homedir()
  const log = options.log ?? (() => {})
  // startOpencodeServe points XDG_DATA_HOME at <dataDir>/opencode/data, so the
  // runtime reads its credential from <dataDir>/opencode/data/opencode/auth.json.
  const target = join(options.dataDir, 'opencode', 'data', 'opencode', 'auth.json')
  if (existsSync(target)) return 'present'

  const source = authCandidates(env, home).find((candidate) => existsSync(candidate))
  if (!source) {
    log('[delegate] no opencode auth.json found; the Zen free tier will refuse (run `opencode` once to log in)')
    return 'missing'
  }

  try {
    const raw = JSON.parse(await readFile(source, 'utf8')) as { opencode?: unknown }
    const opencode = raw?.opencode
    if (!opencode) {
      log(`[delegate] ${source} has no "opencode" credential; the Zen free tier will refuse`)
      return 'missing'
    }
    await mkdir(dirname(target), { recursive: true })
    // Only the opencode entry — never the whole file, never other providers.
    await writeFile(target, JSON.stringify({ opencode }), { mode: 0o600 })
    log(`[delegate] seeded Zen credential into the isolated runtime (from ${source})`)
    return 'seeded'
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:301-307](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/delegate.ts#L301-L307)

运行时查找及下载顺序。

```text
 *   2. a previously managed install under `<dataDir>/runtime/<version>/`,
 *   3. the user's own install (explicit env, `~/.opencode/bin`, npm global tree,
 *      PATH lookup) — copied into the managed tree so the runtime is self-contained,
 *   4. an official download from the vendor's npm package (sha512-verified).
 *
 * Every candidate is version-probed; anything below `minVersion` is skipped so
 * the delegate never selects a runtime that fails every request.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人值得采用，如何证伪稳定供给假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合观察它的人是已能使用 DSH、希望减少维护兼容代理的操作者，且任务可以中断并退回正式模型供应商。当前可解释的增量是原生注册、目录管理和按流交付边界恢复，而不是保证匿名上游有稳定资格。关键外部资格与宿主重试效果都没在本轮验证，且可选委派会引入认证托管和进程，所以本次采用结论为观察，不直接推荐依赖它持续办结任务。

后续可从默认 adapter、IP pool 和 delegation 都关闭、明确允许列表的非关键任务开始；先核对模型资格、断流时错误是否结束和工具副作用，再判断是否值得继续。连续资格拒绝、回复中途反复断流、工具重复或需要改变原定信任范围才能维持服务时停止，退回已经配置并验证的模型供应商。不能把开启更多恢复路径作为永远继续重试的理由。

由目录曝光与直接请求门槛不同、模型资格可能变化推导一个未验证假设：将“已列出、元数据允许、当前网络资格已测、当前任务成功”分开保存，并把明确资格拒绝作为可见暂停条件，可能比静态免费目录加长重试更能减少用户等待和错误期待。它不同于本版现有探测，因为要求在用户真正采用的模型和请求条件下形成可解释的资格与任务结果关联。

最小验证固定目标模型和合格任务集，对比当前策略、直接失败交回和显式资格暂停三种处理；记录合格任务数、资格拒绝次数、工具重复、端到端等待与人工切回时间。仅当等待减少且合格率不降、额外探测和状态维护负担可接受时继续。若多数失败仍只能靠用户换正式供应商解决，或简单及时报错同样好，则放弃复杂状态层。这个方案未实现、未验证，也不证明匿名模型市场需求或商业机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:531-565](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/catalog.ts#L531-L565)

目录资格规则与多种source。

<details>
<summary>查看原文（35行）</summary>

```text
    // Issue #56: the live chat lane can never serve a blocklisted id (410
    // delisted / 400 unavailable / 403 region) — deny before any metadata or
    // S3 vouch, so a stale cache or the bootstrap list cannot resurrect it.
    if (FREE_LANE_BLOCKLIST.has(model)) return { allowed: false, source: 'local_blocklist', known: true }
    // Vantage-point blocklist entries (FREE_LANE_PROBE_SET): hidden until this
    // host's own probe answers pass. Before the first probe round completes
    // the seeded default is 'refused' (issue #56's verdict) — conservative,
    // never worse than the shipped blocklist.
    if (FREE_LANE_PROBE_SET.has(model) && this.#probeVerdicts.get(model) !== 'pass') {
      return { allowed: false, source: 'probe_pending', known: false }
    }
    const metadata = decide(model, this.#prices, this.#pricesReady)
    // The S3 vouch only covers ids metadata cannot speak for. A metadata
    // verdict of deprecated is Known, but S3 entries are compile-time verified
    // against the live lane, so an S3 id stays vouched even when stale
    // metadata claims deprecation (hy3-free case: works after models.dev
    // flags it, dies only when it leaves the Zen catalog).
    let verdict = metadata
    if (!metadata.allowed && (metadata.source === 'metadata_deprecated' || !metadata.known) && staticFreeModels.includes(model)) {
      verdict = { allowed: true, source: 'static_verified', known: false }
    }
    // Issue #83: the user's allowedModels whitelist sits at the very END of
    // the chain and only NARROWS. Every verdict above stays authoritative — a
    // whitelisted id that is paid/deprecated/blocklisted/probe-refused keeps
    // its real denial source — while an otherwise-exposed id the whitelist
    // omits gets a distinct, actionable denial (`not_in_whitelisted`) instead
    // of silently vanishing into the metadata vocabulary. list() and the
    // bootstrap path both filter through this decision, so one gate covers
    // picker exposure and direct calls alike. Unset/empty = no gate at all.
    if (verdict.allowed && !this.#whitelistAllows(model)) {
      return { allowed: false, source: 'not_in_whitelisted', known: true }
    }
    return verdict
  }

```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:538-545](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L538-L545)

直接服务门槛范围。

```text
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
    const selectedEffort = options.reasoningEffort ?? options.reasoning
    const canDisableThinking = selectedEffort !== 'off' && selectedEffort !== 'none'
```

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:790-826](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/adapter/zen-adapter.ts#L790-L826)

持续拒绝与有限恢复的终点。

<details>
<summary>查看原文（37行）</summary>

```text
        return
      }
      if (preContentFailure === null && !deliveredContent) {
        // stream ended cleanly with no content and no error: pass through
        // (pi-ai's empty-response classification owns this case)
        yield* toStreamChunks((async function* pumped() { for (const e of buffered) yield e })(), GATE_TOOL_ALIASES)
        return
      }
      // Exit-shaped failure before content: ask the pool whether rotating is
      // worth another attempt; otherwise surface the buffered events as-is.
      const failureMessage = (preContentFailure as { message: string }).message
      const failure = classifyStreamFailure(failureMessage)
      const deterministic = isRegionBlocked(failureMessage)
      // One pool-less replay on the sibling host when the lane refuses before any
      // content has reached the user; the pool delegate is otherwise the only thing
      // that can make this true.
      const rotate = failure !== null
        && attempt < MAX_ROTATES
        && (shouldRotate(failure, options.model, ids.session, attempt + 1, deterministic)
          || (failure === 'refused' && attempt < 1))
      rotateStory.push(`#${attempt + 1} ${failure ?? 'unknown'}: ${failureMessage.slice(0, 80)}`)
      if (!rotate) {
        // Persistent anonymous-lane refusal (issue #76): when the direct attempt
        // AND the sibling replay both 403'd with the FreeTierError credential
        // gate, and the user opted into delegation, run the turn through the
        // local opencode runtime instead of surfacing the error. Any other
        // failure class, a disabled delegate, a missing credential, or a failed
        // delegation all fall through to the honest error below.
        if (this.#delegate !== null && attempt >= 1 && isFreeTierRefusal(failureMessage)) {
          const delegated = await this.#runDelegation(options, context)
          if (delegated !== null) {
            for (const chunk of delegated) yield chunk
            return
          }
        }
        // last resort: rewrite the terminal error to tell the whole story
        // (the user saw minutes of silence — the surfaced error must say
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/config.ts:96-111](https://github.com/FishBottle7/opencode2dsh/blob/89f7c420c9132efdfc6657c2bcea5dc4c6b69ad5/packages/plugin/src/config.ts#L96-L111)

委派的身份与权限变化。

<details>
<summary>查看原文（16行）</summary>

```text
   * resolution is skipped and this binary is used (still version-checked).
   */
  opencodePath?: string
  /** Lowest opencode version the delegate will use (default 1.18.0, the free-tier floor). */
  minVersion?: string
  /** GOMEMLIMIT injected into the child (Go heap soft cap). Default 96MiB. */
  memLimit?: string
  /** GOGC injected into the child. Default 30. */
  gcPercent?: number
  /** EmptyWorkingSet memory-trim interval ms; 0 disables trimming. Default 60000. */
  trimIntervalMs?: number
  /** Health-wait budget for the spawned server, ms. Default 60000. */
  startTimeoutMs?: number
}

/** docs/ip-pool.md section 5.1 schema (subset owned by config today). */
```

</details>

#### 缺口

- 没有真实合格任务与恢复等待对照
  **影响**：不能把错误吸收机制当可用性收益
  **进一步探讨**：先比较及时报错与有限恢复，再决定是否维护资格状态。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
