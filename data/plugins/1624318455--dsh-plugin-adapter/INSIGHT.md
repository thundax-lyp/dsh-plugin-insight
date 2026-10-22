# dsh-plugin-adapter

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3bbd05f](https://github.com/1624318455/dsh-plugin-adapter/tree/3bbd05f35cc47ccc24ac954d07fccc9cb587176f)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter)
<!-- END META -->

> **实现功能**：把匿名 Zen 模型通道接为 DSH 原生 LlmAdapter，附目录回退和可选 IP 池。

> **核心亮点**：在 DSH 提供原生 LlmAdapter、动态目录和流错误处理；沿用 OpenCode 通道及上游项目和 pi-ai，贡献重点是宿主接线与韧性修正。详见[Q02](#research-q02)。

> **风险与缺陷**：静态目录可在实时列表缺席时暴露模型，选择器可见不保证可用；伪装请求头及可选代理池还依赖上游准入和信任。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 用户需要怎样的模型入口，免费可用应如何验证？](#detail-section-11)
  - [Q02 · 现行 adapter 怎样把目录、DSH 与流式协议接起来，增量归谁？](#detail-section-12)
  - [Q03 · 目录、流和 IP 轮换有哪些运行边界？](#detail-section-13)
  - [Q04 · 安装与持续使用成本、发布状态和数据声明如何界定？](#detail-section-14)
  - [Q05 · 在可控场景怎么试用，哪种新设计假设值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望在模型选择器直接使用上游匿名通道；合格结果须当前可用且符合上游接入条件。

apply 默认分支立即注册 ZenAdapter，再后台启动目录刷新；目录取 Zen /v1/models，与 models.dev 价格/能力元数据及静态候选作判定，缓存可离线兜底。ZenAdapter 转换 DSH 上下文与 pi-ai 事件，为 Responses-only 模型选 /responses，其余走 chat completions，并提供思考档位。README 明说源自 FishBottle7/opencode2dsh 与 opencode2api；本 fork 可见增量包括 DSH host 注册、目录顺序修正、错误/空流看门狗和 IP 池接线，不将免费模型服务或 pi-ai 协议归作原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| zen-free adapter | DSH 流式选模 | 当前上游准入须另核 |
| 动态目录 | 列表和免费判定 | 静态回退可暴露失效模型 |
| 流 watchdog | 中断静默流 | 真实恢复率未测 |
| IP 池 | 可选出口调度 | 代理可信度与探测成本 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH LLM、Node>=20、pi-ai、undici | 原生注册和流 | 路由不可用 |
| opencode.ai/models.dev 与当前准入 | 目录和模型 | 静态列表可能可见但请求失败 |
| 可选可信代理 | IP 池 | 维持直连 |
| 本地目录写权限 | 缓存和健康快照 | 诊断/回退变弱 |

#### 启动步骤

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 核当前准入、固定包版本 | 许可与版本清晰 |
| 直连 | 看目录来源、发小规模请求 | 完整流与错误可解释 |
| 扩展 | 按需接可信出口池 | 记录额外请求和故障 |
| 恢复 | 分上游、目录和出口排障 | 不把选择器可见当可用 |

**效果与成本**

#### 成本

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 初次 | DSH/Node、网络与模型准入核验 | 兼容时间 |
| 持续 | 目录刷新、请求流、可选代理探测 | 配额、延迟、网络/代理成本 |
| 恢复 | 区分上游拒绝、模型失效、代理故障 | 人工工时与误路由 |

#### 效果

| 效果 | 源码证据 | 未证实 |
| --- | --- | --- |
| 选择器集成 | 立即注册 zen-free，目录后台更新 | 当前网关可用率 |
| 流错误处理 | 首事件/中途 watchdog、仅首内容前轮换 | 故障恢复成功率 |
| 免费候选 | 元数据及静态回退 | 当前免费额度与准入 |

> **思考**：静态目录可在实时列表缺席时暴露模型，选择器可见不保证可用；伪装请求头及可选代理池还依赖上游准入和信任。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在 DSH 提供原生 LlmAdapter、动态目录和流错误处理；沿用 OpenCode 通道及上游项目和 pi-ai，贡献重点是宿主接线与韧性修正。详见[Q02](#research-q02)。

在 DSH 提供原生 LlmAdapter、动态目录和流错误处理；沿用 OpenCode 通道及上游项目和 pi-ai，贡献重点是宿主接线与韧性修正。详见[Q02](#research-q02)。

adapter 分支无额外进程，sidecar 单独旧模式；目录缓存和健康快照确实写盘。流式前内容失败至多三次出口轮换，部分内容后不重放。可选代理池增加网络、信任与故障归因复杂性。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态目录可在实时列表缺席时暴露模型，选择器可见不保证可用；伪装请求头及可选代理池还依赖上游准入和信任。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

确认当前上游允许的接入和模型，固定版本先直连试用；只有可信代理和明确出口需求才开启池。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、packages/plugin/src/index.ts、packages/plugin/src/adapter/zen-adapter.ts、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/pool/dispatcher.ts、packages/plugin/src/pool/admission.ts、packages/plugin/package.json、packages/plugin/src/pool/pool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 0.3.9 的 README、包与现行 TS adapter/目录/IP 池核心源码，legacy Go 仅判定为可选旧模式；未运行目标插件、测试或外部模型请求。
- 下一步：进一步探讨应按本项缺口执行：分别用直连和可信代理故障矩阵测首内容前后、429/403/5xx及中途断流。；同一模型与提示记录成功率、首 token、网络用量和人工恢复。；若采用最新版本，另锁包哈希和源码再核。；故障注入加真实模型目录变更，比较可选但失败率、误归因和恢复成本。；隔离验收且核当前上游准入。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-adapter](https://github.com/1624318455/dsh-plugin-adapter)
- **版本号**：未声明（[固定提交 3bbd05f](https://github.com/1624318455/dsh-plugin-adapter/tree/3bbd05f35cc47ccc24ac954d07fccc9cb587176f)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把目录来源、模型请求结果和出口健康联成每模型可信度闸门；通过目录变更与故障注入对照误展示、误归因及成本，尚未实现。详见[Q05](#research-q05)。

进一步探讨应按本项缺口执行：分别用直连和可信代理故障矩阵测首内容前后、429/403/5xx及中途断流。；同一模型与提示记录成功率、首 token、网络用量和人工恢复。；若采用最新版本，另锁包哈希和源码再核。；故障注入加真实模型目录变更，比较可选但失败率、误归因和恢复成本。；隔离验收且核当前上游准入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2599 | — | — | 40693 |
| .ts | source | 29 | 7947 | 5590 | 1913 | — |
| .tsx | source | 1 | 1138 | 994 | 84 | — |
| .ts | test | 27 | 5196 | 4357 | 598 | — |
| .mts | test | 3 | 311 | 223 | 64 | — |
| .mjs | source | 1 | 21 | 10 | 9 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A01.065Z..2026-10-22T15%3A12%3A01.065Z)

暂未获取：Issue 未关闭、近30天关闭。

统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断现行原生模型适配器的实际运行路径、上游准入与可验证价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户需要怎样的模型入口，免费可用应如何验证？

**研究主题**：场景与需求

#### 完整回答

项目目标是在 DSH 模型选择器提供 zen-free 匿名模型路由，旧 opencode2dsh 仅保留分发别名。合格结果要能选到目前真实可用且政策允许的模型，成功流式完成请求并正确呈现失败。README 声称无需 Key、注册和 sidecar；这是作者对特定上游通道的声明，固定源码仅证明发送 public 字面量和 CLI 形状请求，不证明 OpenCode 当前准入、免费额度或稳定可用。直接使用官方客户端/获授权 API 是基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:25-45](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/README.zh-CN.md#L25-L45)

当前固定版本复核。作者用途和零凭据声称。

<details>
<summary>查看原文（21行）</summary>

```text
---

dsh-plugin-adapter 会向 DSH 注册一个原生的 `LlmAdapter`，直接流式对接
[OpenCode Zen](https://opencode.ai/zen) 的**匿名免费通道**——也就是
OpenCode 官方 CLI 无需登录即可使用的那批免费模型，它们会以 `zen-free`
这个常规 provider 出现在你的 DSH 模型选择器里（`opencode2dsh` 保留为
旧会话的兼容别名）。

插件发出的请求与 OpenCode CLI 的流量完全同形（相同的 User-Agent、相同的
关联请求头），模型目录通过三级回退链保持新鲜。不用登录任何账号，也不用
自己部署任何东西。

## 特性

- **零凭据、零配置**——匿名通道不需要任何 Key；装好、重启、开聊
- **原生 adapter，无 sidecar**——一个 npm 包，没有子进程、没有二进制、没有本地端口（旧版 Go sidecar 不随包发行，见 `legacy/`）
- **CLI 同形伪装**——请求携带 OpenCode CLI 的 User-Agent 和整套会话/请求/项目关联头，按会话派生
- **思考等级可选**——带推理的免费模型在 DSH 模型选择器里出现思考等级选项（模型声明档位的按声明展示，其余提供 Off/Minimal/Low/Medium/High）；Off 向上游发送 `reasoning_effort: "none"` 真正停思考，不选则保持上游默认
- **实时目录 + 三级回退**——上游实时列表 ∩ 免费判定（models.dev 价格为 0，或名字带 `-free` 由通道本身免费供应），断网时依次回退到磁盘缓存与已验证的静态名单
- **自愈能力**——启动期快速重试、周期刷新，并落盘健康快照便于排查
- **规范的错误呈现**——上游故障（限流、鉴权、超时、传输）以分类的 finish 原因送达 DSH，重试策略始终由 DSH 掌控
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:53-73](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/index.ts#L53-L73)

当前固定版本复核。默认 adapter 分支。

<details>
<summary>查看原文（21行）</summary>

```text

/** Cordis plugin id. Must match cordis.patch.yml (package + repository). */
export const name = 'dsh-plugin-adapter'
export const inject = ['llm', 'credentials', 'settings'] as const
export function apply(ctx: PluginContext, config: DshPluginAdapterConfig = {}): { ready: Promise<ReadyInfo> } {
  if (resolveConfig(config).mode === 'sidecar') return applySidecar(ctx, config)
  return applyAdapter(ctx, config)
}

/**
 * Adapter mode: catalog + LlmAdapter registration. The adapter registration
 * is disposed with the plugin fiber (registerAdapter uses ctx.effect
 * internally); we only own the catalog refresh loop here.
 */
function applyAdapter(ctx: PluginContext, config: DshPluginAdapterConfig): { ready: Promise<{ port: number; version: string }> } {
  const logger = ctx.logger
  const cfg = resolveConfig(config)
  const ready = Promise.resolve({ port: 0, version: 'adapter' })

  if (!ctx.llm || typeof ctx.llm.registerAdapter !== 'function') {
    logger.error('dsh-plugin-adapter: llm service unavailable; adapter mode cannot register')
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:246-258](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L246-L258)

当前固定版本复核。只展示 zen-free 组，保留旧别名。

<details>
<summary>查看原文（13行）</summary>

```text
 * on `POST /zen/v1/chat/completions` while `POST /zen/v1/responses` returns 200
 * (opencode #44659/#44847, DSH #3957). Route by model id; extend this list
 * if Zen moves more models (candidates: gpt-5.6-luna, grok-4.6).
 *
 * The list is a fast path, not the only guard: a model that is NOT listed but
 * refuses the chat protocol anyway is detected at runtime and switched to the
 * responses path (see {@link isProtocolUnsupported}).
 *
 * NOT in the list: `jev-1.13*` (measured 2026-10-22) — the lane refuses it
 * on BOTH protocols ("Model does not support this protocol"), so routing it
 * anywhere only burns a request.
 */
export function isResponsesModel(id: string): boolean {
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:500-535](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L500-L535)

当前固定版本复核。匿名 key 和请求头落在实际协议调用。

<details>
<summary>查看原文（36行）</summary>

```text
    // (x-session-affinity), so a dead instance fails the same conversation
    // over and over. One re-roll of the session id asks another instance.
    let sessionRerolled = false
    // Protocol-class self-heal: the lane refused the chat protocol for this
    // model, so the next attempt asks it on /responses. One switch per turn.
    let responsesSwitched = false
    for (let attempt = 0; ; attempt += 1) {
      // Responses models (muse-spark-*, jev-1.13*, and any model the lane
      // refuses on the chat protocol) stream chain-of-thought in bursts with
      // long mid-stream pauses (issue #7): give them a wider idle window so
      // slow reasoning is not misread as a dead tunnel. Chat models keep the
      // live-tuned default. Their FIRST event is a burst too, so the tiered
      // first-event window gets the same widening treatment.
      const responsesPath = this.#usesResponsesPath(options.model)
      const bodyIdleMs = responsesPath
        ? Math.max(this.#bodyIdleMs, 300_000)
        : this.#bodyIdleMs
      const firstEventWindowMs = responsesPath && !this.#firstEventPinned
        ? Math.max(firstEventMs, 120_000)
        : firstEventMs
      // The SDK-level request bound (pi-ai -> OpenAI SDK `timeout`). The SDK
      // clears its timer once the response HEAD arrives, so this only bounds
      // the header phase — exactly the phase our first-event watchdog owns.
      // Without it the SDK's own default (10 minutes) is the only backstop, and
      // a wedged upstream turns into a silent 10-minute hang reported as the
      // bare "Request timed out." The margin keeps the watchdog the first
      // speaker (it owns the diagnosis), the SDK only catches what escapes it.
      const sdkTimeoutMs = firstEventWindowMs + SDK_TIMEOUT_MARGIN_MS
      const events = routingContext.run(contextStore, () =>
        self.#eventsFor(options, context, ids, model, sdkTimeoutMs, requestMaxTokens),
      ) as AsyncIterable<PiEvent>
      let deliveredContent = false
      let preContentFailure: { message: string } | null = null
      const buffered: PiEvent[] = []
      const source = events[Symbol.asyncIterator]()
      // Peek events until the stream proves itself one way or the other:
```

</details>

#### 缺口

- 未核官方当前准入、条款和网关实测。
  **影响**：不能称所有列出的模型永久免费或可用。
  **进一步探讨**：采用前以官方文档和合法账户条件核对，再隔离做小额模型请求。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 现行 adapter 怎样把目录、DSH 与流式协议接起来，增量归谁？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply 默认分支立即注册 ZenAdapter，再后台启动目录刷新；目录取 Zen /v1/models，与 models.dev 价格/能力元数据及静态候选作判定，缓存可离线兜底。ZenAdapter 转换 DSH 上下文与 pi-ai 事件，为 Responses-only 模型选 /responses，其余走 chat completions，并提供思考档位。README 明说源自 FishBottle7/opencode2dsh 与 opencode2api；本 fork 可见增量包括 DSH host 注册、目录顺序修正、错误/空流看门狗和 IP 池接线，不将免费模型服务或 pi-ai 协议归作原创。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:66-140](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/index.ts#L66-L140)

当前固定版本复核。立即注册和后台目录生命周期。

<details>
<summary>查看原文（75行）</summary>

```text
 */
function applyAdapter(ctx: PluginContext, config: DshPluginAdapterConfig): { ready: Promise<{ port: number; version: string }> } {
  const logger = ctx.logger
  const cfg = resolveConfig(config)
  const ready = Promise.resolve({ port: 0, version: 'adapter' })

  if (!ctx.llm || typeof ctx.llm.registerAdapter !== 'function') {
    logger.error('dsh-plugin-adapter: llm service unavailable; adapter mode cannot register')
    return { ready }
  }

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the settings namespace
  // with live apply + the /status /probe bridge. Opt-in via settings page or
  // cordis.patch.yml; disabled keeps the process byte-for-byte on direct.
  // Lifecycle (assembly on first enable, live reconfigure, dispose) is owned
  // by applyIpPoolSettings through the plugin fiber.
  // 0.4.0 rename: the data directory moved from ~/.opencode2dsh to
  // ~/.dsh-plugin-adapter; the legacy directory is copied over and parked
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
    },
  })
  // Zen-lane transport hardening (adapter/transport.ts): the ambient proxy
  // dispatcher reuses CONNECT tunnels that Clash/v2rayN silently close, so
  // the next request dies with UND_ERR_SOCKET / ECONNRESET instead of
  // opening a fresh tunnel. The IP pool owns the dispatcher when it is
  // enabled (and already pins pipelining: 0), so the seam stays off then.
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
    logger.warn(`dsh-plugin-adapter: transport.proxyUrl "${cfg.transport.proxyUrl}" is not a usable http(s) proxy URI; Zen traffic keeps the ambient dispatcher`)
  }

  // Watchdog windows (config.watchdog): the first-event gate is a
  // time-to-first-token budget, tiered for reasoning models.
  const adapter = new ZenAdapter(catalog, {
    sessionOverride: cfg.gatewaySession,
    firstEventMs: cfg.watchdog?.firstEventMs,
    reasoningFirstEventMs: cfg.watchdog?.reasoningFirstEventMs,
    bodyIdleMs: cfg.watchdog?.bodyIdleMs,
    contextWindowCap: cfg.contextWindow,
    transport,
  })

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the settings namespace
  // with live apply + the /status /models /probe bridge. Opt-in via settings
  // page or cordis.patch.yml; disabled keeps the process byte-for-byte on
  // direct. Lifecycle (assembly on first enable, live reconfigure, dispose) is
  // owned by applyIpPoolSettings through the plugin fiber. The probe-model
  // dropdown rows include the live catalog, so this must run after the
  // catalog instance exists.
  applyIpPoolSettings(ctx, config, logger, { listLiveModels: () => catalog.list() })
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:96-114](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/catalog.ts#L96-L114)

当前固定版本复核。免费判定优先元数据。

<details>
<summary>查看原文（19行）</summary>

```text
}

/**
 * Bootstrap limits for the S3 static ids (+ the current default model), taken
 * from the models.dev `opencode` section snapshot 2026-09-20. These only fire
 * while live metadata cannot speak for the model (pending/uncached); ready
 * metadata always wins via ModelCatalog.modelLimits.
 */
export const staticModelLimits: Record<string, ModelLimits> = {
  'big-pickle': { contextWindow: 200000, maxTokens: 32000 },
  'mimo-v2.5-free': { contextWindow: 200000, maxTokens: 32000 },
  'ling-3.0-flash-fin-free': { contextWindow: 262144, maxTokens: 32768 },
  'nemotron-3.5-lightning-free': { contextWindow: 262144, maxTokens: 262144 },
  'nemotron-3-ultra-free': { contextWindow: 1000000, maxTokens: 128000 },
  'muse-spark-1.2-contributor-free': { contextWindow: 1048576, maxTokens: 131072 },
  'muse-spark-1.3-contributor-free': { contextWindow: 1048576, maxTokens: 131072 },
}

/** Decide (model_metadata.go Decide, ported with the deprecation fix).
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:280-378](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/catalog.ts#L280-L378)

当前固定版本复核。目录刷新及静态回退。

<details>
<summary>查看原文（99行）</summary>

```text
 *   1. ready metadata verdict — deprecated/paid deny, free cost allows; a
 *      "free" name overrides *missing* cost data but never a paid or
 *      deprecated verdict
 *   2. metadata cannot speak (pending/missing) — name fallback, or the
 *      compile-time verified S3 list for known-good ids
 */
export class ModelCatalog {
  #zen: Set<string> = new Set()
  #updatedAt = 0
  #prices: Map<string, ModelPrice> = new Map()
  #pricesReady = false
  #lastError = ''
  #refreshSeconds: number
  #cachePath?: string
  #zenBaseUrl: string
  #metadataUrl: string
  #fetch: typeof fetch
  #now: () => number
  #timer: NodeJS.Timeout | null = null
  #stopped = false
  #onRefresh?: (status: CatalogSnapshot, lastError: string) => void
  #startupRetryMs: number

  constructor(options: CatalogOptions = {}) {
    this.#refreshSeconds = options.refreshSeconds ?? 300
    this.#cachePath = options.cachePath
    this.#zenBaseUrl = options.zenBaseUrl ?? ZEN_BASE_URL
    this.#metadataUrl = options.metadataUrl ?? 'https://models.dev/api.json'
    this.#fetch = options.fetchImpl ?? fetch
    this.#now = options.now ?? Date.now
    this.#onRefresh = options.onRefresh
    this.#startupRetryMs = options.startupRetryMs ?? 15_000
  }

  /**
   * Start the refresh loop: immediate S1+S2, fast retries while the live
   * catalog is still empty (the first fetch often races the machine's network
   * coming up — VPN/TUN reconnect, DNS), then the normal cadence (S2 24h).
   */
  async start(): Promise<void> {
    await this.refreshOnce()
    let attempts = 0
    while (this.#zen.size === 0 && attempts < 4 && !this.#stopped) {
      attempts += 1
      await new Promise((resolve) => setTimeout(resolve, this.#startupRetryMs))
      if (this.#stopped) return
      await this.refreshOnce()
    }
    if (this.#stopped) return
    this.#timer = setInterval(() => {
      void this.refreshOnce()
    }, this.#refreshSeconds * 1000)
    this.#timer.unref?.()
  }

  stop(): void {
    this.#stopped = true
    if (this.#timer) {
      clearInterval(this.#timer)
      this.#timer = null
    }
  }

  async refreshOnce(): Promise<void> {
    await Promise.allSettled([this.refreshZen(), this.refreshMetadata()])
    if (this.#onRefresh) {
      try {
        this.#onRefresh(this.snapshot(), this.#lastError)
      } catch {
        // observers must never break the refresh loop
      }
    }
  }

  async refreshZen(): Promise<void> {
    try {
      const ids = await fetchZenModels(this.#zenBaseUrl, this.#fetch, opencodeUserAgent())
      this.#zen = new Set(ids)
      this.#updatedAt = this.#now()
      this.#lastError = ''
    } catch (err) {
      this.#lastError = err instanceof Error ? err.message : String(err)
    }
  }

  async refreshMetadata(): Promise<void> {
    try {
      const response = await withTimeout(this.#fetch(this.#metadataUrl, { headers: { accept: 'application/json' } }))
      if (!response.ok) throw new Error(`models.dev returned HTTP ${response.status}`)
      const data = (await response.json()) as unknown
      const prices = decodeModelsDev(data)
      if (prices.size === 0) throw new Error('models.dev contains no OpenCode model metadata')
      this.#prices = prices
      this.#pricesReady = true
      if (this.#cachePath) await saveMetadataCache(this.#cachePath, prices, this.#now())
    } catch (err) {
      // Network failure with a cached copy is not fatal: load the cache.
      if (this.#cachePath && !this.#pricesReady) {
        const cached = await loadMetadataCache(this.#cachePath).catch(() => null)
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:490-535](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L490-L535)

当前固定版本复核。Responses/chat 两条协议路径。

<details>
<summary>查看原文（46行）</summary>

```text
    // pi-ai event at all (not even `start`, which only arrives after
    // response headers). BODY_IDLE: content flowing, then a long gap (LLM
    // streams may pace slowly, but minutes of nothing mid-stream is a dead
    // tunnel, not pacing). The race fires the watchdog INTO the pending
    // next() — a background return() could never cancel one (it queues
    // behind the pending request), so timeout-promise racing is the only
    // mechanism that actually interrupts a hung stream.
    const firstEventMs = reasoning ? this.#reasoningFirstEventMs : this.#firstEventMs
    const rotateStory: string[] = []
    // Capacity-class self-heal: the gateway pins a model instance per session
    // (x-session-affinity), so a dead instance fails the same conversation
    // over and over. One re-roll of the session id asks another instance.
    let sessionRerolled = false
    // Protocol-class self-heal: the lane refused the chat protocol for this
    // model, so the next attempt asks it on /responses. One switch per turn.
    let responsesSwitched = false
    for (let attempt = 0; ; attempt += 1) {
      // Responses models (muse-spark-*, jev-1.13*, and any model the lane
      // refuses on the chat protocol) stream chain-of-thought in bursts with
      // long mid-stream pauses (issue #7): give them a wider idle window so
      // slow reasoning is not misread as a dead tunnel. Chat models keep the
      // live-tuned default. Their FIRST event is a burst too, so the tiered
      // first-event window gets the same widening treatment.
      const responsesPath = this.#usesResponsesPath(options.model)
      const bodyIdleMs = responsesPath
        ? Math.max(this.#bodyIdleMs, 300_000)
        : this.#bodyIdleMs
      const firstEventWindowMs = responsesPath && !this.#firstEventPinned
        ? Math.max(firstEventMs, 120_000)
        : firstEventMs
      // The SDK-level request bound (pi-ai -> OpenAI SDK `timeout`). The SDK
      // clears its timer once the response HEAD arrives, so this only bounds
      // the header phase — exactly the phase our first-event watchdog owns.
      // Without it the SDK's own default (10 minutes) is the only backstop, and
      // a wedged upstream turns into a silent 10-minute hang reported as the
      // bare "Request timed out." The margin keeps the watchdog the first
      // speaker (it owns the diagnosis), the SDK only catches what escapes it.
      const sdkTimeoutMs = firstEventWindowMs + SDK_TIMEOUT_MARGIN_MS
      const events = routingContext.run(contextStore, () =>
        self.#eventsFor(options, context, ids, model, sdkTimeoutMs, requestMaxTokens),
      ) as AsyncIterable<PiEvent>
      let deliveredContent = false
      let preContentFailure: { message: string } | null = null
      const buffered: PiEvent[] = []
      const source = events[Symbol.asyncIterator]()
      // Peek events until the stream proves itself one way or the other:
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:200-209](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/README.zh-CN.md#L200-L209)

当前固定版本复核。作者致谢上游。

<details>
<summary>查看原文（10行）</summary>

````text

- 不涉及任何机密：匿名通道的 Key 就是字面量 `public`；插件不存储任何东西，也没有任何遥测。
- 安装产物仅限 `lib/`；不执行任何依赖的构建脚本。
- 所有请求均从你的机器直连 `opencode.ai` / `models.dev`。

## 开发

```sh
git clone https://github.com/1624318455/dsh-plugin-adapter.git
cd dsh-plugin-adapter/packages/plugin
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目录、流和 IP 轮换有哪些运行边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

实时 Zen 列表尚空时 list() 直接给 staticFreeModels，因此模型出现在选择器不等于当前能请求。README 所称“无需额外进程”仅默认 adapter；sidecar 是单独旧模式。流式路径在首事件/中途静默设 watchdog，首内容前符合出口故障且池同意时最多旋转三次；已有任何内容就不重放，以免重复生成。IP 池 opt-in，并通过 AsyncLocalStorage 和 dispatcher 将特定上游域名分流；免费代理入池还做探测。它增加额外网络、信任和故障归因边界，代理引入额外出口、连接元数据与传输信任边界，正文保密还取决于 TLS 和代理配置。源码支持这些条件分支，但没有本轮真实网关故障/代理隐私验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:371-378](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/catalog.ts#L371-L378)

当前固定版本复核。静态列表可在 live 缺席时暴露。

```text
      if (prices.size === 0) throw new Error('models.dev contains no OpenCode model metadata')
      this.#prices = prices
      this.#pricesReady = true
      if (this.#cachePath) await saveMetadataCache(this.#cachePath, prices, this.#now())
    } catch (err) {
      // Network failure with a cached copy is not fatal: load the cache.
      if (this.#cachePath && !this.#pricesReady) {
        const cached = await loadMetadataCache(this.#cachePath).catch(() => null)
```

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:296-370](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L296-L370)

当前固定版本复核。首事件和 body idle watchdog、旋转条件。

<details>
<summary>查看原文（75行）</summary>

```text
  readonly #firstEventMs: number
  readonly #reasoningFirstEventMs: number
  readonly #bodyIdleMs: number
  /** True when the caller pinned the first-event window (no auto-widening). */
  readonly #firstEventPinned: boolean
  /** Optional cap for the advertised context window (config.contextWindow). */
  readonly #contextWindowCap?: number
  /** Optional transport seam (Zen-lane dispatcher hardening). */
  readonly #transport?: ZenTransport | null
  /** Models the lane refused on the chat protocol (runtime switch to /responses). */
  readonly #responsesOnlyModels = new Set<string>()

  constructor(catalog: CatalogLike, options: {
    zenBaseUrl?: string
    providerOverride?: unknown
    /** Responses-path provider seam (tests inject a scripted stream). */
    responsesProviderOverride?: unknown
    /** Fixed session id override (config.gatewaySession). */
    sessionOverride?: string
    /** Watchdog windows (tests inject short ones; defaults are live-tuned). */
    firstEventMs?: number
    /** First-event window for reasoning models (longer TTFT budget). */
    reasoningFirstEventMs?: number
    bodyIdleMs?: number
    /** Cap for the advertised context window (config.contextWindow). */
    contextWindowCap?: number
    /** Zen-lane transport hardening (see adapter/transport.ts). */
    transport?: ZenTransport | null
  } = {}) {
    this.#catalog = catalog
    this.#sessionOverride = options.sessionOverride?.trim() || undefined
    this.#firstEventMs = options.firstEventMs ?? DEFAULT_FIRST_EVENT_MS
    // One knob, one window: a caller that pins only `firstEventMs` (tests,
    // or a config that wants a single budget) gets that budget for the
    // reasoning tier too. Only an untouched adapter tiers the windows.
    this.#reasoningFirstEventMs = options.reasoningFirstEventMs ?? options.firstEventMs ?? DEFAULT_REASONING_FIRST_EVENT_MS
    this.#bodyIdleMs = options.bodyIdleMs ?? DEFAULT_BODY_IDLE_MS
    this.#firstEventPinned = options.firstEventMs !== undefined || options.reasoningFirstEventMs !== undefined
    this.#contextWindowCap = options.contextWindowCap
    this.#transport = options.transport ?? null
    if (options.providerOverride !== undefined) {
      this.#provider = options.providerOverride as never
      this.#responsesProvider = (options.responsesProviderOverride ?? null) as never
      return
    }
    const baseUrl = `${(options.zenBaseUrl ?? ZEN_BASE_URL).replace(/\/+$/, '')}/v1`
    const auth = {
      apiKey: {
        name: 'OpenCode Zen anonymous lane',
        resolve: async () => ({ auth: { apiKey: ANONYMOUS_KEY } }),
      },
    }
    this.#provider = createProvider<Api>({
      id: PROVIDER_ID,
      name: PROVIDER_ID,
      baseUrl,
      auth,
      models: [],
      api: openaiCompletions,
    })
    this.#responsesProvider = createProvider<Api>({
      id: PROVIDER_ID,
      name: PROVIDER_ID,
      baseUrl,
      auth,
      models: [],
      api: openaiResponses,
    })
  }

  providerInfo(provider: string): { id: string; name: string } {
    return { id: provider, name: PROVIDER_ID }
  }

  /**
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:403-487](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L403-L487)

当前固定版本复核。仅首内容前旋转，最多三次。

<details>
<summary>查看原文（85行）</summary>

```text
    if (provider !== PROVIDER_ID) return []
    const seen = new Set<string>()
    const models: Array<{ provider: string; id: string; name: string; inputModalities: string[] }> = []
    for (const id of this.#catalog.list()) {
      if (seen.has(id)) continue
      seen.add(id)
      models.push({ provider, id, name: id, inputModalities: ['text'] })
    }
    return models
  }

  resolveModel(provider: string, model: string): {
    provider: string
    id: string
    name: string
    inputModalities: string[]
    context: { contextWindow: number }
    defaultMaxTokens: number
    reasoning?: { efforts: ZenReasoningEffort[] }
  } {
    const limits = limitsFor(this.#catalog, model, this.#contextWindowCap)
    const resolved: ReturnType<ZenAdapter['resolveModel']> = {
      provider,
      id: model,
      name: model,
      inputModalities: ['text'],
      context: { contextWindow: limits.contextWindow },
      defaultMaxTokens: limits.maxTokens,
    }
    // The thinking-level picker: dsh-llm validates every selected id against
    // this list and echoes the choice back on GenerateOptions.reasoningEffort.
    const efforts = reasoningEfforts(this.#catalog.reasoningCapability(model))
    if (efforts) resolved.reasoning = { efforts }
    return resolved
  }

  async prepareCall(provider: string, model: string, _signal?: AbortSignal): Promise<{
    model: ReturnType<ZenAdapter['resolveModel']>
    stream: (options: HarnessGenerateOptions) => AsyncGenerator<HarnessChunk>
  }> {
    return {
      model: this.resolveModel(provider, model),
      stream: (options) => this.stream(options),
    }
  }

  /** Stream one Chat turn from the Zen anonymous lane.
   *
   * IP-7 rotate loop (docs/ip-pool.md §3.4 / §8.1): a stream that dies
   * BEFORE any content landed restarts on a fresh exit — the pool's health
   * marks already degraded the failed exit, so the restarted pick routes
   * elsewhere, and the host's retry budget never sees the intermediate
   * error. Once ANY content event has flowed, rotation stops (§3.4: a
   * partially delivered stream is never replayed). No pool running (or the
   * failure is not exit-shaped) = the original stream surface untouched.
   */
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    const context = toPiContext(options)
    const ids = deriveRequestIDs(options.messages)
    // Replica escape hatch (config.gatewaySession): a poisoned derived id
    // fails deterministically while fresh ones stream — override reroutes.
    if (this.#sessionOverride) ids.session = this.#sessionOverride
    // The reasoning flag drives BOTH the wire shape (pi-ai's effort branch)
    // and the watchdog tier: reasoning models compose longer before their
    // first token, so their first-event window is wider.
    const reasoning = this.#catalog.reasoningCapability(options.model)?.reasoning === true
    const limits = limitsFor(this.#catalog, options.model, this.#contextWindowCap)
    const model = toPiModel(options.model, reasoning, options.provider ?? PROVIDER_ID, limits)
    // The wire asks for at most what we advertise: the host's request
    // `maxTokens` is our advertised default, and the upstream charges the
    // requested output against the same window as the prompt. A host that
    // asks for more (a per-session override) must not widen the envelope the
    // host's own compaction math depends on.
    const requestMaxTokens = Math.max(1, Math.min(options.maxTokens ?? limits.maxTokens, limits.maxTokens))
    // The Zen lane's own dispatcher seam (adapter/transport.ts): install the
    // hardened fetch before the request leaves, so a hostile proxy that
    // silently closed the previous CONNECT tunnel cannot kill this turn.
    this.#transport?.ensure()
    // IP-pool routing context (docs/ip-pool.md 3.3): pi-ai builds the request
    // body and dispatches it on separate layers with no channel for "which
    // model is this fetch for", so the per-request context rides AsyncLocalStorage.
    const contextStore: RoutingContext = { model: options.model, session: ids.session }
    const self = this
    const MAX_ROTATES = 3
    // Watchdog windows (live-observed 2026-09-07): the OpenAI SDK timeout
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:76-115](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/index.ts#L76-L115)

当前固定版本复核。IP 池为可选接线。

<details>
<summary>查看原文（40行）</summary>

```text

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the settings namespace
  // with live apply + the /status /probe bridge. Opt-in via settings page or
  // cordis.patch.yml; disabled keeps the process byte-for-byte on direct.
  // Lifecycle (assembly on first enable, live reconfigure, dispose) is owned
  // by applyIpPoolSettings through the plugin fiber.
  // 0.4.0 rename: the data directory moved from ~/.opencode2dsh to
  // ~/.dsh-plugin-adapter; the legacy directory is copied over and parked
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
    },
  })
  // Zen-lane transport hardening (adapter/transport.ts): the ambient proxy
  // dispatcher reuses CONNECT tunnels that Clash/v2rayN silently close, so
  // the next request dies with UND_ERR_SOCKET / ECONNRESET instead of
  // opening a fresh tunnel. The IP pool owns the dispatcher when it is
  // enabled (and already pins pipelining: 0), so the seam stays off then.
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
    })
  if (transport) {
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/pool/dispatcher.ts:185-222](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/pool/dispatcher.ts#L185-L222)

当前固定版本复核。指定域名路由和直连回退。

<details>
<summary>查看原文（38行）</summary>

```text
      this.#logger?.warn(`dsh-plugin-adapter: failed to build proxy agent for ${exitId}: ${err instanceof Error ? err.message : String(err)}`)
      return null
    }
  }

  dispatch(options: Dispatcher.DispatchOptions, handler: Dispatcher.DispatchHandler): boolean {
    if (this.#closed) {
      handler.onResponseError?.({} as Dispatcher.DispatchController, new Error('dsh-plugin-adapter: routing dispatcher closed'))
      return false
    }
    const origin = String(options.origin ?? '')
    const host = normalizeHost(origin)
    if (isLoopback(host) || !this.#proxyHosts.has(host)) {
      return this.#direct.dispatch(options, handler)
    }
    const context = routingContext.getStore() ?? {}
    const model = context.model ?? 'default'
    const session = context.session ?? 'default'
    const exitId = this.#pool.pick(session, model)
    if (exitId === null) {
      // Pool unusable (empty / all cooling): direct, never fail closed (3.3).
      return this.#direct.dispatch(options, handler)
    }
    const agent = this.#agentFor(exitId)
    if (!agent) {
      return this.#direct.dispatch(options, handler)
    }
    return agent.dispatch(options, this.#observe(exitId, model, session, handler))
  }

  /**
   * Wrap the downstream handler with the passive-signal observer
   * (docs/ip-pool.md §4.2 rule table, §4.3 被动): the real request's own
   * outcome feeds the two-tier health — free liveness data no probe spends
   * quota on. Body bytes stream through untouched; only the response start
   * line and terminal transport errors are read.
   *
   * Forwarding discipline (measured against undici 8.10 on this host): the
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/pool/admission.ts:179-292](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/pool/admission.ts#L179-L292)

当前固定版本复核。候选代理入池探测。

<details>
<summary>查看原文（114行）</summary>

```text
export async function admitCandidate(
  deps: AdmissionDeps,
  candidate: { address: string; protocol: 'http' | 'socks5'; source: ExitNode['source'] },
  options: {
    relaxed?: boolean
    pinned?: boolean
    timeoutMs?: number
    /** Pre-screened echo facts (coarseScreen output): skips steps 1-2. */
    echoFacts?: EchoFacts
  } = {},
): Promise<AdmissionResult> {
  const zenBase = deps.zenBaseUrl ?? ZEN_BASE_URL
  const timeout = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const smokeModel = deps.smokeModel ?? 'big-pickle'
  // Live-observed 2026-09-09: zen now REJECTS anonymous-lane chat without
  // the CLI session headers (400 MissingSessionID "can only be used in
  // OpenCode") — the smoke request must carry the same disguise set the
  // adapter sends, or every candidate fails step 4 regardless of exit
  // quality (a full refill round admitted 0 of 701 tunnel-OK survivors).
  // Per-candidate ids: the upstream correlates sessions with exits, so a
  // probe session must not collide with real adapter sessions. The canonical
  // mapping (ids.ts) is mandatory here too — the old 24-hex probe sessions
  // drew 403 FreeTierError on the free lane like every other foreign shape.
  const probeHeaders = disguiseHeaders({
    session: canonicalSessionID(`admission:${candidate.address}`),
    request: randomID('req', 16),
    project: stableID('prj', 'dsh-plugin-adapter:default-project'),
    parentSession: '',
  })

  let agent: Dispatcher | null = null
  try {
    agent = new deps.undici.ProxyAgent({
      uri: candidate.protocol === 'socks5' ? `socks5://${candidate.address}` : `http://${candidate.address}`,
    })
  } catch (err) {
    return { admitted: false, reason: `agent-build: ${err instanceof Error ? err.message : String(err)}` }
  }

  const request = (url: string, init: { method?: string; headers?: Record<string, string>; body?: string } = {}) =>
    withTimeout(
      deps.undici.request(url, { dispatcher: agent!, ...init }),
      timeout,
      init.method === 'POST' ? 'smoke' : 'probe',
    )

  try {
    // Steps 1+2 run inline only when the caller has not pre-screened the
    // candidate (coarseScreen/batch output = echoFacts; the refill loop
    // always pre-screens free candidates at high fan-out).
    let facts: EchoFacts
    if (options.echoFacts) {
      facts = options.echoFacts
    } else {
      const verdict = await coarseScreen(deps, candidate, options)
      if ('rejected' in verdict) return { admitted: false, reason: verdict.rejected }
      facts = verdict
    }

    // Step 3: HTTPS tunnel to the real upstream (models list, Bearer public).
    const models = await request(`${zenBase.replace(/\/+$/, '')}/v1/models`, {
      headers: { authorization: 'Bearer public', 'user-agent': opencodeUserAgent(), 'x-opencode-client': 'cli', accept: 'application/json', ...probeHeaders },
    })
    if (models.statusCode !== 200) {
      return { admitted: false, reason: `zen models HTTP ${models.statusCode}` }
    }

    // Step 4: anonymous-lane smoke (streaming, 1 token). The free lane
    // rejects non-streaming bodies outright and wants the agent-shape gate
    // tools in the body (adapter/messages.ts, live-probed 2026-09-18) — a
    // bare 1-token probe 403s like every toolless chat.
    const smoke = await request(`${zenBase.replace(/\/+$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: 'Bearer public',
        'content-type': 'application/json',
        'user-agent': opencodeUserAgent(),
        'x-opencode-client': 'cli',
        ...probeHeaders,
      },
      body: JSON.stringify({
        model: smokeModel,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
        stream: true,
        stream_options: { include_usage: true },
        tools: FREE_LANE_GATE_TOOL_NAMES.map((name) => freeLaneGateTool(name)),
        tool_choice: 'none',
      }),
    })
    if (smoke.statusCode !== 200) {
      // 429 = the exit is good (alive + tunnel verified) but its anonymous
      // quota is currently consumed. Admit with limited: the caller cools it
      // and the periodic probe retries later (measured 2026-09-05: 429 is
      // the single largest smoke failure among tunnel-OK survivors).
      if (smoke.statusCode === 429) {
        return {
          admitted: true,
          limited: true,
          reason: `zen smoke HTTP 429`,
          node: {
            id: candidate.address,
            protocol: candidate.protocol,
            source: candidate.source,
            pinned: options.pinned ?? false,
            exitIP: facts.exitIP,
            exitLocation: facts.exitLocation,
            latencyMs: facts.latencyMs,
            quality: gradeOf(facts.latencyMs),
            addedAt: Date.now(),
          },
        }
      }
      return { admitted: false, reason: `zen smoke HTTP ${smoke.statusCode}` }
```

</details>

#### 缺口

- 未做真实上游流式及代理故障注入。
  **影响**：不能确认恢复率、隐私或失败类别是否稳定。
  **进一步探讨**：分别用直连和可信代理故障矩阵测首内容前后、429/403/5xx及中途断流。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与持续使用成本、发布状态和数据声明如何界定？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定提交包是 0.3.9、Node>=20，依赖 pi-ai、undici、yaml 和 DSH 宿主，要求能访问 opencode.ai/models.dev；npm 元信息单独显示查询时 latest 0.4.0，因此不可把固定提交结论扩展到最新包。目录每 300 秒刷新，元数据缓存与 adapter-status.json 写到本机；README “不存储任何东西”与这两个文件至少在字面上不一致，应区分不存凭据/会话与会写健康及缓存。IP 池一旦打开还带探测流量和代理信任成本。模型现金价格可能为零，但配额、网络、失败重试、人工排障及上游可用性都未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/package.json:1-75](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/package.json#L1-L75)

当前固定版本复核。固定提交版本、引擎与依赖。

<details>
<summary>查看原文（75行）</summary>

```text
{
  "name": "@memef1f1y/dsh-plugin-adapter",
  "version": "0.4.0",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./client": "./lib/client.js"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE",
    "tsdown.client.config.ts"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1624318455/dsh-plugin-adapter.git"
  },
  "homepage": "https://github.com/1624318455/dsh-plugin-adapter#readme",
  "bugs": "https://github.com/1624318455/dsh-plugin-adapter/issues",
  "author": "1624318455 (fork of FishBottle7/opencode2dsh)",
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "slots",
        "locale",
        "configForms"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsdown src/index.ts --format esm --dts --out-dir lib --no-clean",
    "prepack": "node -e \"require('fs').rmSync('lib',{recursive:true,force:true})\" && pnpm build && pnpm build:client && node ../../scripts/prepare-package.mjs",
    "typecheck": "tsc --noEmit",
    "test": "node --test \"test/*.test.ts\"",
    "build:client": "tsdown -c tsdown.client.config.ts"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "opencode",
    "opencode-zen",
    "cordis",
    "cordis-plugin",
    "llm-adapter",
    "llm-provider",
    "free-models",
    "free-llm",
    "llm",
    "ai-models",
    "typescript",
    "nodejs"
  ],
  "license": "MIT",
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "@earendil-works/pi-ai": "^0.82.1",
    "undici": "^8.10.1",
    "yaml": "^2.9.0"
  },
  "pnpm": {
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:73-99](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/README.zh-CN.md#L73-L99)

当前固定版本复核。作者部署和刷新说明。

<details>
<summary>查看原文（27行）</summary>

````text
**验证**：重启 `dsh web`，打开模型选择器，在 **zen-free** 分组里选模型即可。

需要带 web profile 的 DSH（DeepSeek Harness）；Node.js ≥ 20（DSH 能跑就满足）；
出站 HTTPS 需可达 `opencode.ai` 与 `models.dev`。

## 配置

默认配置开箱即用。需要覆盖时，编辑 profile 的 `cordis.patch.yml`：

```yaml
- id: dsh-plugin-adapter
  name: '@memef1f1y/dsh-plugin-adapter'
  config:
    mode: adapter        # adapter（默认）| sidecar
    providerId: zen-free
    refreshSeconds: 300  # 目录刷新周期（秒）
```

> **从 ≤ 0.3.x 升级**：0.4.0 起插件 id 从 `opencode2dsh` 改为 `dsh-plugin-adapter`。
> DSH 靠这个 id 把 config 挂到插件上，所以升级时要**同步**把线上
> `cordis.patch.yml` 的 `- id:` 行改掉，否则配置（例如钉住的 `gatewaySession`）
> 会被静默丢弃。数据目录也跟着搬了家（`~/.opencode2dsh` →
> `~/.dsh-plugin-adapter`）：插件首次启动会把旧目录复制过去，并把原目录改名为
> `~/.opencode2dsh.bak-<日期>` 保留，确认新配置可用后可以删掉。

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
````

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:180-184](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/README.zh-CN.md#L180-L184)

当前固定版本复核。作者无存储和遥测说法。

````text
}
```

| 现象 | 可能原因与处理 |
| --- | --- |
````

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:82-99](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/index.ts#L82-L99)

当前固定版本复核。本地健康快照写盘。

<details>
<summary>查看原文（18行）</summary>

```text
  // by applyIpPoolSettings through the plugin fiber.
  // 0.4.0 rename: the data directory moved from ~/.opencode2dsh to
  // ~/.dsh-plugin-adapter; the legacy directory is copied over and parked
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:295-353](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/catalog.ts#L295-L353)

当前固定版本复核。目录周期与元数据缓存。

<details>
<summary>查看原文（59行）</summary>

```text
  #metadataUrl: string
  #fetch: typeof fetch
  #now: () => number
  #timer: NodeJS.Timeout | null = null
  #stopped = false
  #onRefresh?: (status: CatalogSnapshot, lastError: string) => void
  #startupRetryMs: number

  constructor(options: CatalogOptions = {}) {
    this.#refreshSeconds = options.refreshSeconds ?? 300
    this.#cachePath = options.cachePath
    this.#zenBaseUrl = options.zenBaseUrl ?? ZEN_BASE_URL
    this.#metadataUrl = options.metadataUrl ?? 'https://models.dev/api.json'
    this.#fetch = options.fetchImpl ?? fetch
    this.#now = options.now ?? Date.now
    this.#onRefresh = options.onRefresh
    this.#startupRetryMs = options.startupRetryMs ?? 15_000
  }

  /**
   * Start the refresh loop: immediate S1+S2, fast retries while the live
   * catalog is still empty (the first fetch often races the machine's network
   * coming up — VPN/TUN reconnect, DNS), then the normal cadence (S2 24h).
   */
  async start(): Promise<void> {
    await this.refreshOnce()
    let attempts = 0
    while (this.#zen.size === 0 && attempts < 4 && !this.#stopped) {
      attempts += 1
      await new Promise((resolve) => setTimeout(resolve, this.#startupRetryMs))
      if (this.#stopped) return
      await this.refreshOnce()
    }
    if (this.#stopped) return
    this.#timer = setInterval(() => {
      void this.refreshOnce()
    }, this.#refreshSeconds * 1000)
    this.#timer.unref?.()
  }

  stop(): void {
    this.#stopped = true
    if (this.#timer) {
      clearInterval(this.#timer)
      this.#timer = null
    }
  }

  async refreshOnce(): Promise<void> {
    await Promise.allSettled([this.refreshZen(), this.refreshMetadata()])
    if (this.#onRefresh) {
      try {
        this.#onRefresh(this.snapshot(), this.#lastError)
      } catch {
        // observers must never break the refresh loop
      }
    }
  }

```

</details>

#### 缺口

- 未测真实额度、延迟、token 与人工恢复工时。
  **影响**：无法算单位成功请求成本。
  **进一步探讨**：同一模型与提示记录成功率、首 token、网络用量和人工恢复。
- 固定提交 0.3.9，npm 查询 latest 0.4.0。
  **影响**：最新包行为可能不同。
  **进一步探讨**：若采用最新版本，另锁包哈希和源码再核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在可控场景怎么试用，哪种新设计假设值得验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议先确认上游允许的接入方式，固定版本和模型，以默认直连 adapter 做小规模试用；只在确需出口调度且代理可信时打开 IP 池，观察目录真实来源、空流和错误。此 fork 的有价值假设是把“目录准入事实/请求结果/出口健康”绑定成每模型可信度，避免静态回退显示但不可用或错误地把模型拒绝判为出口失败。该跨层可靠性闸门尚未完整实现；可与现行目录+轮换对照模型选择后成功率、误报/漏报、额外探测流量及恢复时间。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:355-378](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/catalog.ts#L355-L378)

当前固定版本复核。目录决策与静态回退来源。

<details>
<summary>查看原文（24行）</summary>

```text
    try {
      const ids = await fetchZenModels(this.#zenBaseUrl, this.#fetch, opencodeUserAgent())
      this.#zen = new Set(ids)
      this.#updatedAt = this.#now()
      this.#lastError = ''
    } catch (err) {
      this.#lastError = err instanceof Error ? err.message : String(err)
    }
  }

  async refreshMetadata(): Promise<void> {
    try {
      const response = await withTimeout(this.#fetch(this.#metadataUrl, { headers: { accept: 'application/json' } }))
      if (!response.ok) throw new Error(`models.dev returned HTTP ${response.status}`)
      const data = (await response.json()) as unknown
      const prices = decodeModelsDev(data)
      if (prices.size === 0) throw new Error('models.dev contains no OpenCode model metadata')
      this.#prices = prices
      this.#pricesReady = true
      if (this.#cachePath) await saveMetadataCache(this.#cachePath, prices, this.#now())
    } catch (err) {
      // Network failure with a cached copy is not fatal: load the cache.
      if (this.#cachePath && !this.#pricesReady) {
        const cached = await loadMetadataCache(this.#cachePath).catch(() => null)
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/pool/pool.ts:287-322](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/pool/pool.ts#L287-L322)

当前固定版本复核。被动结果把 429、403 等影响健康。

<details>
<summary>查看原文（36行）</summary>

```text
   * applied to the two-tier health exactly like a probe would. Returns the
   * classification for diagnostics.
   */
  recordPassive(id: string, statusCode: number, model: string, regionBlocked = false): 'ok' | 'limited' | 'refused' | 'dead' {
    if (!this.#nodes.has(id)) return 'ok'
    if (statusCode >= 200 && statusCode < 300) {
      this.markOk(id, model)
      this.#countPassive(id, 'ok')
      return 'ok'
    }
    if (statusCode === 429) {
      this.markLimited(id)
      this.#countPassive(id, 'limited')
      return 'limited'
    }
    if (statusCode === 401 || statusCode === 403) {
      // RegionError bodies are deterministic region blocks — a second sample
      // adds nothing, so ban the (exit, model) pairing immediately (docs 4.2).
      if (regionBlocked) this.markModelBanned(id, model)
      else this.markModelSignal(id, model)
      this.#countPassive(id, 'refused')
      return 'refused'
    }
    // 5xx: count into the dead bucket for diagnostics, but DO NOT strike the
    // exit dead. Live-observed 2026-09-09: upstream 500s are often the MODEL
    // failing behind a healthy exit (muse without contributor access answers
    // 500 through every exit) — one strike used to mark the exit dead, the
    // single-exit pool then picked null, and ALL traffic silently fell back
    // direct while the pool looked enabled. Exit liveness stays the
    // transport layer's call (sentinel/onResponseError); recovery for a
    // 5xx-flapping exit is the adapter rotate loop (5xx is in its set).
    this.#countPassive(id, 'dead')
    return 'dead'
  }

  /** Transport-level failure of a real request (connection died mid-flight). */
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:454-487](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/adapter/zen-adapter.ts#L454-L487)

当前固定版本复核。首内容前旋转判据。

<details>
<summary>查看原文（34行）</summary>

```text
   * elsewhere, and the host's retry budget never sees the intermediate
   * error. Once ANY content event has flowed, rotation stops (§3.4: a
   * partially delivered stream is never replayed). No pool running (or the
   * failure is not exit-shaped) = the original stream surface untouched.
   */
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    const context = toPiContext(options)
    const ids = deriveRequestIDs(options.messages)
    // Replica escape hatch (config.gatewaySession): a poisoned derived id
    // fails deterministically while fresh ones stream — override reroutes.
    if (this.#sessionOverride) ids.session = this.#sessionOverride
    // The reasoning flag drives BOTH the wire shape (pi-ai's effort branch)
    // and the watchdog tier: reasoning models compose longer before their
    // first token, so their first-event window is wider.
    const reasoning = this.#catalog.reasoningCapability(options.model)?.reasoning === true
    const limits = limitsFor(this.#catalog, options.model, this.#contextWindowCap)
    const model = toPiModel(options.model, reasoning, options.provider ?? PROVIDER_ID, limits)
    // The wire asks for at most what we advertise: the host's request
    // `maxTokens` is our advertised default, and the upstream charges the
    // requested output against the same window as the prompt. A host that
    // asks for more (a per-session override) must not widen the envelope the
    // host's own compaction math depends on.
    const requestMaxTokens = Math.max(1, Math.min(options.maxTokens ?? limits.maxTokens, limits.maxTokens))
    // The Zen lane's own dispatcher seam (adapter/transport.ts): install the
    // hardened fetch before the request leaves, so a hostile proxy that
    // silently closed the previous CONNECT tunnel cannot kill this turn.
    this.#transport?.ensure()
    // IP-pool routing context (docs/ip-pool.md 3.3): pi-ai builds the request
    // body and dispatches it on separate layers with no channel for "which
    // model is this fetch for", so the per-request context rides AsyncLocalStorage.
    const contextStore: RoutingContext = { model: options.model, session: ids.session }
    const self = this
    const MAX_ROTATES = 3
    // Watchdog windows (live-observed 2026-09-07): the OpenAI SDK timeout
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:102-115](https://github.com/1624318455/dsh-plugin-adapter/blob/3bbd05f35cc47ccc24ac954d07fccc9cb587176f/packages/plugin/src/index.ts#L102-L115)

当前固定版本复核。池可选，默认 adapter 立即注册。

<details>
<summary>查看原文（14行）</summary>

```text
    },
  })
  // Zen-lane transport hardening (adapter/transport.ts): the ambient proxy
  // dispatcher reuses CONNECT tunnels that Clash/v2rayN silently close, so
  // the next request dies with UND_ERR_SOCKET / ECONNRESET instead of
  // opening a fresh tunnel. The IP pool owns the dispatcher when it is
  // enabled (and already pins pipelining: 0), so the seam stays off then.
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
    })
  if (transport) {
```

</details>

#### 缺口

- 跨目录、请求与出口的可信度闸门未形成对照。
  **影响**：不能当现行效果或创新分数。
  **进一步探讨**：故障注入加真实模型目录变更，比较可选但失败率、误归因和恢复成本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
