# opencode2dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[37d3ea2](https://github.com/FishBottle7/opencode2dsh/tree/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin)

<!-- BEGIN META -->
[![GitHub ★ 388](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=388&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FishBottle7/opencode2dsh) [![npm 30d 14,534](https://img.shields.io/static/v1?label=npm+30d&message=14%2C534&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 OpenCode Zen 模型适配与可选的本地 OpenCode 委派。

> **亮点**：把 OpenCode Zen 的模型目录和两类流协议接入 DSH，并在兼容范围内处理无内容中断及纯推理耗尽场景。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：目录探测通过仍可能遇到 429 或实际调用拒绝，且无内容中断不证明请求未被远端接收。委派还会留下独立凭据副本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 为什么有 DSH 会话的用户可能需要这项适配，它如何进入模型选择器？](#detail-section-11)
  - [Q02 · 模型出现在目录，是否意味着这个部署的实际请求一定会通过？](#detail-section-12)
  - [Q03 · 传输中断何时会自动重放，怎样判断一次任务是否可以安全地重试？](#detail-section-13)
  - [Q04 · 可选本地委派启用后增加哪些信任和恢复成本，是否值得采用？](#detail-section-14)
  - [Q05 · 把探测通过、实际请求通过和结果未知分开展示，会改善采用决策吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 会话的开发者希望在同一工具和对话界面选择 OpenCode Zen 模型。[Q01](#research-q01)

使用已有且获授权的 DSH provider，或在上游支持的客户端直接访问服务。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Zen 模型适配 | 在 DSH 选择器读取模型并转换生成流 | 需要宿主接口和上游批准的访问 |
| 目录探测与失败恢复 | 提供候选状态和部分中断处理 | 目录通过不代表有额度，部分输出后须核对状态 |
| 可选本地委派 | 通过 OpenCode 子进程获取回应 | 默认关闭，增加凭据副本及运行时信任 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Cordis / DSH 适配器接口 | 默认模式必需 | 注册模型 provider | 无法注册 |
| 获准的 Zen 访问 | 真实调用必需 | 模型生成 | 停止尝试并转受支持入口 |
| OpenCode 子进程和已有凭据 | 委派才需要 | 可选本地转发 | 保持委派关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 用户确认目标宿主和上游支持条件 | 上游条件不明时维持观察 |
| 检查 | 在受控端验证选择器、输出和错误 | 区分探测结果与真实请求 |
| 退出 | 用户停用适配器并回原 provider | 委派若曾启用需单独核对凭据副本和进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 依赖安装和服务成本未知 | 核对版本和上游资格 | 匿名配置不能保证准入 |
| 持续使用 | 请求、退避与子进程资源未实测 | 核查目录、错误和出口 | 发送次数与单位任务节省未知 |
| 失败恢复 | 额外调用或数据保留成本未知 | 对账并审查凭据留存 | 停用无法判定远端是否处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同会话模型选择 | 注册目录及流适配 | 目标用户实际可用性 |
| 故障恢复 | 按内容状态及类别分流 | 上游计量和工具副作用状态 |
| 可选委派 | 权限中介和独立配置 | 平台和目标运行时的实际隔离 |

> **思考**：目录探测通过仍可能遇到 429 或实际调用拒绝，且无内容中断不证明请求未被远端接收。委派还会留下独立凭据副本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 OpenCode Zen 的模型目录和两类流协议接入 DSH，并在兼容范围内处理无内容中断及纯推理耗尽场景。[Q01](#research-q01) [Q03](#research-q03)

先挂默认适配器再挂可选设置。前后内容守卫与宿主退避分层，委派用权限询问、拒绝及事后扫描形成多层检查，故障后仍需独立对账。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

目录探测通过仍可能遇到 429 或实际调用拒绝，且无内容中断不证明请求未被远端接收。委派还会留下独立凭据副本。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

有资格和兼容证据前维持观察。遇到客户端准入拒绝时回到受支持的客户端或已授权的模型服务。用模拟后端做技术核查时，将目录、真实调用与中断分别验收。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持原生接线、目录与流式转换、重试和凭据副本路径。实际授权、可用性和本地运行防护尚未验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin/package.json、packages/plugin/cordis.patch.yml、packages/plugin/src/config.ts、packages/plugin/src/index.ts、packages/plugin/src/adapter/zen-adapter.ts、README.md、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/adapter/ids.ts、packages/plugin/src/pool/admission.ts、packages/plugin/src/pool/dispatcher.ts、packages/plugin/src/adapter/delegate.ts、docs/delegation.md 及固定范围 inventory；组件：packages/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查子包固定源码、根作者说明及委派设计。聚焦模型目录、传输恢复和凭据，未覆盖所有代理来源及侧车实现。
- 下一步：固定源码只读核查。未安装插件、执行宿主、访问模型、使用真实账户或测试代理。模拟验证方案见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[FishBottle7/opencode2dsh](https://github.com/FishBottle7/opencode2dsh)
- **版本号**：0.3.14（[固定提交 37d3ea2](https://github.com/FishBottle7/opencode2dsh/tree/37d3ea202187767d6576ef72798e270c12da9b4e)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是分开展示探测结果、真实请求状态和中断后的未知结果，观察能否降低误重试及漏查副作用。[Q05](#research-q05)

固定源码只读核查。未安装插件、执行宿主、访问模型、使用真实账户或测试代理。模拟验证方案见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 37 | 11725 | 7458 | 3632 | — |
| .tsx | source | 1 | 1082 | 923 | 112 | — |
| .ts | test | 39 | 10816 | 8739 | 1434 | — |
| .ts | example | 1 | 5 | 4 | 1 | — |
| .mjs | example | 3 | 168 | 111 | 46 | — |
| .mts | test | 5 | 505 | 380 | 84 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/FishBottle7/opencode2dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户通过本组件访问 OpenCode Zen 时，目录、流式恢复和可选本地委派各提供什么价值，哪些条件决定是否采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么有 DSH 会话的用户可能需要这项适配，它如何进入模型选择器？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标人群是已有 DSH 工作流、希望保留会话和模型选择器以切换到 OpenCode Zen 的开发者。包以增量 patch 挂入 Cordis。默认 adapter 模式需要宿主 llm.registerAdapter，把 ZenAdapter 注册成一个 provider，并把可选代理设置放在注册之后处理，后者失败不会阻止主适配器注册。选择器读取会有界等待目录预热，再去重模型并投影输入模态。实际生成走 pi-ai 的流式传输，按模型选择 Chat Completions 或 Responses，插件加工请求与上下文，模型能力和客户端访问资格由上游决定。与在独立 OpenCode 客户端重新开始对话相比，增量是原 DSH 会话的接线与事件桥；已有合规 DSH provider 可完成任务时，单为增加一个选择项没有明显必要。作者将匿名通道描述为免密钥，并明确请求使用 OpenCode 客户端特征；该描述和源码不能证明第三方 DSH 调用已获许可。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/package.json:1-12](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/package.json#L1-L12)

子包正式入口及浏览器导出。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@opencode2dsh/dsh-plugin",
  "version": "0.3.14",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./client": "./lib/client.js"
  },
```

</details>

**依据 2 · 源码核查**：[packages/plugin/cordis.patch.yml:6-9](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/cordis.patch.yml#L6-L9)

Cordis 插入包行。

```text
- insert:
    - id: opencode2dsh
      name: '@opencode2dsh/dsh-plugin'
      config: {}
```

**依据 3 · 源码核查**：[packages/plugin/src/config.ts:188-200](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/config.ts#L188-L200)

默认 adapter，旧 sidecar 另需二进制。

<details>
<summary>查看原文（13行）</summary>

```text
export const Config = Schema.object({
  /** Integration mode; `adapter` (default) is the shipped shape. */
  mode: Schema.union(['adapter', 'sidecar']).default('adapter'),
  /** Path to the agent binary (sidecar mode only; not bundled). */
  agentPath: Schema.string(),
  /** Extra CLI args forwarded to the agent (after --config). */
  agentArgs: Schema.array(Schema.string()).default([]),
  /** Provider route name registered into llm-pi-ai settings (sidecar mode). */
  providerId: Schema.string().default(defaults.providerId),
  /** Credential reference (env var name) holding the local agent token. */
  apiKeyEnv: Schema.string().default(defaults.apiKeyEnv),
  /** Model list refresh interval in seconds. */
  refreshSeconds: Schema.number().step(1).min(1).default(defaults.refreshSeconds),
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:82-113](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/index.ts#L82-L113)

宿主入口选择路径，缺适配器接口时停止注册。

<details>
<summary>查看原文（32行）</summary>

```text
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
  // Strip the volatile reference before the plain config resolution: it is an
  // ordinary-fields consumer, and `{ ...defaults, ...config }` would otherwise
  // hand `startIpPool` the reference object where it expects values.
  const ordinary = ordinaryConfig(config)
  const cfg = resolveConfig(ordinary)
  const ready = Promise.resolve({ port: 0, version: 'adapter' })

  if (!ctx.llm || typeof ctx.llm.registerAdapter !== 'function') {
    logger.error('opencode2dsh: llm service unavailable; adapter mode cannot register')
    return { ready }
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/index.ts:172-195](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/index.ts#L172-L195)

先注册 provider，额外出口配置晚挂且失败隔离。

<details>
<summary>查看原文（24行）</summary>

```text
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
  // fiber. The probe-model dropdown rows include the live catalog, so this
  // must run after the catalog instance exists — and it is fenced, because the
  // route above is already live and must survive anything this layer throws.
  try {
    applyIpPoolSettings(ctx, ordinary, readIpPool, logger, { listLiveModels: () => catalog.list() })
  } catch (err) {
    logger.error(`opencode2dsh: ip-pool settings wiring failed; the provider route stays direct: ${err instanceof Error ? err.message : String(err)}`)
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:471-487](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L471-L487)

选择器从预热后目录去重并输出输入模态。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Advisory catalog for the DSH model picker (deduped; dsh-llm rejects
   * duplicates). Async on purpose (issue #45): the host awaits this call and
   * caches its answer per host generation, so the first read waits —
   * bounded, inside the catalog — for the live Zen fetch instead of handing
   * the host the staticFreeModels bootstrap list it would then keep showing.
   */
  async listModels(provider: string): Promise<Array<{ provider: string; id: string; name: string; inputModalities: string[] }>> {
    await this.#catalog.warm?.()
    const seen = new Set<string>()
    const models: Array<{ provider: string; id: string; name: string; inputModalities: string[] }> = []
    for (const id of this.#catalog.list()) {
      if (seen.has(id)) continue
      seen.add(id)
      models.push({ provider, id, name: id, inputModalities: this.#inputModalities(id) })
    }
    return models
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:898-910](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L898-L910)

传输按模型协议分流并使用宿主取消信号。

<details>
<summary>查看原文（13行）</summary>

```text
    // Responses-only models (muse-spark-*) must hit /responses, not /chat/completions.
    // Each branch is the Models-wrapped transport (#77); unit tests inject a
    // scripted raw provider through the same override seam.
    const transport = isResponsesModel(model.id) && this.#responsesProvider
      ? this.#responsesProvider
      : this.#provider
    return transport.streamSimple(requestModel, context as unknown as Context, {
      apiKey: ANONYMOUS_KEY,
      sessionId: ids.session,
      headers: disguiseHeaders(ids),
      onPayload,
      signal: options.signal,
      maxRetries: 0,
```

</details>

**依据 8 · 作者声明**：[README.md:20-38](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/README.md#L20-L38)

作者描述通道定位与客户端特征。

<details>
<summary>查看原文（19行）</summary>

```text
opencode2dsh registers a native DSH `LlmAdapter` that streams directly from
[OpenCode Zen](https://opencode.ai/zen)'s **anonymous free lane** — the same
models OpenCode's own CLI uses without an account, served to your DSH model
picker as a regular provider called `opencode2dsh`.

Requests leave your machine looking exactly like traffic from the OpenCode
CLI (same user agent, same correlation headers), and the model catalog stays
fresh through a three-tier fallback chain. There is nothing to log into and
nothing to host.

## Highlights

- **Zero credential, zero setup** — the anonymous lane needs no key; install, restart, chat
- **Native adapter, no sidecar** — one npm package, no child process, no binary, no local port (the legacy Go sidecar is not part of the published package; see `legacy/`)
- **CLI-identical disguise** — requests carry the OpenCode CLI user agent and its session/request/project header set, derived per conversation
- **Selectable thinking levels** — reasoning-capable free models expose an effort picker in DSH's model selector (declared ladders where the model metadata provides them, Off/Minimal/Low/Medium/High otherwise); Responses-only `muse-spark-*` models expose only upstream-supported effort levels, and no selection keeps the provider default
- **Image input where it is declared** — image attachments are accepted for every model whose [models.dev](https://models.dev) entry lists `image` in `modalities.input`, and refused for the ones that declare `text` only; models.dev being silent falls back to the live-verified vision family
- **Live catalog with a fallback chain** — live upstream list ∩ free-by-metadata, falling back to offline cache and a verified static list
- **Self-healing** — fast startup retries, periodic refresh, and a written health snapshot for diagnostics
```

</details>

#### 缺口

- 没有针对当前用户、部署区域和该客户端身份的上游授权或真实可用性证据。
  **影响**：无法据代码确认能把这一选择器条目用于持续任务。
  **进一步探讨**：核实上游支持的客户端或获得明确授权，端到端验证则用隔离环境和受控模拟端。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型出现在目录，是否意味着这个部署的实际请求一定会通过？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

目录和请求使用不同判据。目录组合实时模型清单与资格决策，热启动前可能暂用静态列表；目录获取失败时对应分支可返回空。目录探测发送极短的流式探针，只尝试读一点响应便取消。源码把 200 和 429 都记为 pass，区分记录到的拒绝及其他错误。因而目录可见只能说明筛选状态，无法推断成功生成、配额或服务稳定。固定提交对目录探测和代理准入探测分别新建会话身份，辅助函数不使用真实会话的记忆表，作者解释这样避免诊断挤在同一会话桶内。改变身份对上游如何计量、单次诊断是否消耗配额，仍没有本轮证据。实际 stream 在出站前只把用户 allowedModels 当成硬性拒绝条件；探测待定或目录屏蔽并不等于主动请求被本地阻拦。用户遇到目录里模型不可用时，应该根据上游真实拒绝原因判断，而不能从目录成功倒推出账号、地域或额度条件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:548-570](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/catalog.ts#L548-L570)

目录筛选会在已有资格判断上进一步按用户白名单收窄。

<details>
<summary>查看原文（23行）</summary>

```text
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

  /** The #83 gate: an unset/empty whitelist allows everything, a set one is
   * exact-match by model id. */
  #whitelistAllows(model: string): boolean {
    return this.#allowedModels === null || this.#allowedModels.has(model)
  }
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:572-591](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/catalog.ts#L572-L591)

目录和服务入口不同，展示可使用静态列表。

<details>
<summary>查看原文（20行）</summary>

```text
  /**
   * The #83 whitelist as a serving gate for the adapter: zen-adapter consults
   * this BEFORE any wire traffic, so a direct call to an excluded id fails
   * fast instead of spending anonymous-lane quota on a model the picker would
   * never offer. Deliberately NOT the full decision() chain — only the
   * whitelist gates serving; probe-pending/blocklisted ids keep today's
   * serving behavior (the upstream answers for itself), a question the
   * maintainer may revisit separately.
   */
  whitelistAllows(model: string): boolean {
    return this.#whitelistAllows(model)
  }

  /** ids exposed to DSH: S1 ∩ allowed, or S3 while the live catalog is pending. */
  list(): string[] {
    if (this.#zen.size === 0) return this.#zenFailed ? [] : staticFreeModels.filter((model) => this.decision(model).allowed)
    const out: string[] = []
    for (const model of this.#zen) {
      if (this.decision(model).allowed) out.push(model)
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:799-811](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/catalog.ts#L799-L811)

目录探测产生独立会话身份。

<details>
<summary>查看原文（13行）</summary>

```text
  return async (model, api) => {
    // FRESH identity per probe attempt (2026-11-03, borrowed from
    // jasonxu114514/opencode2api #162): this used to derive from a pinned
    // "probe" signal, so every probe everywhere shared ONE (session, egress)
    // bucket — once a busy egress drained it, every probe answered 429 and
    // the model was cached as unavailable while real conversations on the
    // same egress still worked. A probe is not a conversation.
    const ids = {
      session: mintProbeSessionID(),
      request: randomID('req', 16),
      project: stableID('prj', 'opencode2dsh:default-project'),
      parentSession: '',
    }
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/ids.ts:173-193](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/ids.ts#L173-L193)

新探测身份不经过真实会话记忆表。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * A FRESH canonical session per call, for probes — never memoized, never
 * derived from a stable signal.
 *
 * The free tier meters per session(+project) id and egress IP: a probe path
 * presenting one pinned identity charges a single shared bucket, and once a
 * busy exit has drained that bucket every further probe answers 429
 * FreeUsageLimitError while real conversations on the same process and egress
 * still succeed — the probe then records the model/exit as unavailable for
 * the next probe interval (observed and fixed in jasonxu114514/opencode2api
 * #162, 2026-10-29; NeeYoonc's #112 lane doc independently notes the
 * per-egress daily quota that "diagnostic traffic drains"). A probe is not a
 * conversation, so it must not present one: each attempt mints its own id.
 *
 * Shape stays canonical (real clock, counter 1 — the #62 gate rules), and it
 * bypasses the conversation memo both ways: probes never evict live
 * conversations, and two probes never collide on one bucket.
 */
export function mintProbeSessionID(): string {
  return mintSession(BigInt('0x' + randomBytes(10).toString('hex')), Date.now())
}
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/pool/admission.ts:288-302](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/pool/admission.ts#L288-L302)

代理准入探测也使用独立探测身份。

<details>
<summary>查看原文（15行）</summary>

```text
  // FRESH identity per attempt (2026-11-03, borrowed from
  // jasonxu114514/opencode2api #162): the free tier meters per session id
  // and egress IP, and the upstream correlates sessions with exits — a probe
  // session pinned per candidate (the previous shape) charged ONE bucket per
  // exit across every admission/re-probe/verify attempt, so a busy exit's
  // bucket drained and every later smoke read 429 as "exit dead". A probe is
  // not a conversation; each attempt mints its own canonical id (the #62
  // shape rules still apply — the old 24-hex probe sessions drew 403
  // FreeTierError like every other foreign shape).
  const probeHeaders = disguiseHeaders({
    session: mintProbeSessionID(),
    request: randomID('req', 16),
    project: stableID('prj', 'opencode2dsh:default-project'),
    parentSession: '',
  })
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:839-865](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/catalog.ts#L839-L865)

短流读取后按 HTTP 状态映射目录探测结果。

<details>
<summary>查看原文（27行）</summary>

```text
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      // Drain a little of the body so the upstream sees a real stream
      // consumer, then discard: a probe must not charge quota or hold sockets.
      if (response.body) {
        const reader = response.body.getReader()
        try {
          await reader.read()
        } finally {
          reader.cancel().catch(() => {})
        }
      }
      if (response.status === 200 || response.status === 429) return 'pass'
      if (response.status === 403 || response.status === 400 || response.status === 410) return 'refused'
      return 'error'
    } catch {
      return 'error'
    } finally {
      clearTimeout(timer)
    }
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:538-546](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L538-L546)

真实流调用只在白名单排除时本地拒绝。

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
```

#### 缺口

- 当前上游的探测与真实聊天判定、身份和配额关系未独立检查。
  **影响**：无法把作者所述旧现象或固定探测状态推广到真实流量。
  **进一步探讨**：用受控端点模拟 200 短流、429、403 和同模型正常长流，检查目录标签、网络次数与用户看到的错误。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 传输中断何时会自动重放，怎样判断一次任务是否可以安全地重试？

**研究主题**：工程质量与复用、效果与总成本、缺陷与关键质疑

#### 完整回答

请求内有多层重试。pi-ai 调用显式禁用 SDK 重试，适配器把可重试类别和退避参数交给宿主，限流和传输故障可多等多次，累计等待不等于请求总耗时。适配器内部在未交付内容时暂存 start 等事件，按拒绝或出口状态决定是否继续尝试。首内容开始后流进入转发分支，body idle 或迭代错误会形成终止错误和出口故障报告，内层不回放已输出流。另有独立的思考恢复机制，只在首次纯推理消耗完输出预算、模型支持 Off、没有答案与工具事件且未取消时，关闭思考重试一次，重新编排块索引并合并使用量。即使未见客户端内容，服务可能已经接收了请求。也不能据本插件的内层规则保证宿主工具调用恰好一次。启用出口池还会改变数据路径，无可用出口或者代理实例不能创建时会转直连。其用途是尽量恢复请求，若部署要求出站只能经过指定代理，这种回退便不满足约束。遇到中断应先按宿主记录核对工具、实际副作用和是否收到终止状态，再决定下一步。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:159-174](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L159-L174)

交给宿主的重试码和退避配置。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:904-910](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L904-L910)

SDK 层禁用自动重试，保留取消。

```text
    return transport.streamSimple(requestModel, context as unknown as Context, {
      apiKey: ANONYMOUS_KEY,
      sessionId: ids.session,
      headers: disguiseHeaders(ids),
      onPayload,
      signal: options.signal,
      maxRetries: 0,
```

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:745-783](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L745-L783)

起流前事件暂存及交付条件。

<details>
<summary>查看原文（39行）</summary>

```text
      // Peek phase (pre-content): pull with the first-event deadline armed.
      for (;;) {
        let next: IteratorResult<PiEvent>
        try {
          next = await Promise.race([source.next(), raceDeadline()])
        } catch (err) {
          // pre-content silence: synthesize the terminal error pi-ai never
          // delivered so the rotate decision sees a transport failure
          preContentFailure = { message: err instanceof Error ? err.message : String(err) }
          buffered.push(terminalErrorEvent(preContentFailure.message, model))
          break
        }
        if (next.done) break
        const event = next.value as PiEvent
        lastEventAt = Date.now()
        sawAnyEvent = true
        if (event.type === 'error') {
          onTerminal?.(event.error)
          preContentFailure = { message: event.error.errorMessage ?? 'pi-ai stream error' }
          // the event still flows to the consumer unless we rotate
          buffered.push(event)
          break
        }
        if (event.type === 'done') {
          onTerminal?.(event.message)
          // pi-ai can also deliver the failure on done (stopReason: error)
          if (event.message.stopReason === 'error' && !deliveredContent) {
            preContentFailure = { message: event.message.errorMessage ?? 'pi-ai stream error' }
          }
          buffered.push(event)
          break
        }
        buffered.push(event)
        if (event.type !== 'start') deliveredContent = true
        if (deliveredContent) {
          // first content event: flush everything buffered and go live
          flushed = true
          break
        }
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:709-728](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L709-L728)

内容后的 watchdog 只报终止和出口故障。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:798-823](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L798-L823)

起流前失败分类、切换与委派判断。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:572-605](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L572-L605)

内容与工具事件阻止思考恢复，重试合并使用量。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/pool/dispatcher.ts:266-302](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/pool/dispatcher.ts#L266-L302)

代理目标的路由与无可用出口时直连。

<details>
<summary>查看原文（37行）</summary>

```text
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
      // Pool unusable (empty / all cooling / all dead): direct, never fail
      // closed (3.3). Say so, throttled (issue #106): a proxied host silently
      // switching to a direct connection is indistinguishable in the user's
      // chat from "every exit is broken", and it is the one state the pool can
      // do nothing about — the report in #106 was exactly this, read as
      // "proxies are marked dead and nothing verifies them".
      const at = Date.now()
      if (at - this.#lastDirectWarnAt >= DIRECT_FALLBACK_WARN_MS) {
        this.#lastDirectWarnAt = at
        this.#logger?.warn(
          `opencode2dsh: no usable exit for ${host} — request goes DIRECT (pool empty, all dead, cooling or banned)`,
        )
      }
      // A NON-empty pool here means every exit is dead/banned/cooling — the
      // collapse case issue #106 reported: real traffic strikes each exit
      // dead one by one (a shared cause: tunnel crash, local outage), then
      // sits on the direct fallback until the 30-min dead-retry gate opens.
      // Hand the runtime the starvation signal so recovery probing starts on
      // its own; an empty pool has nothing to recover and stays silent.
      if (this.#pool.list().length > 0) this.#onStarved?.()
      return this.#direct.dispatch(options, handler)
    }
    const agent = this.#agentFor(exitId)
    if (!agent) {
      return this.#direct.dispatch(options, handler)
    }
    return agent.dispatch(options, this.#observe(exitId, model, session, handler))
```

</details>

#### 缺口

- 未运行宿主重试插件，也没有远端接收回执或本地工具执行记录。
  **影响**：无法保证重放次数、费用或最终操作状态。
  **进一步探讨**：对受控端注入首事件无响应、内容后中断和工具事件后中断，分别比较宿主、适配器和服务端观察。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可选本地委派启用后增加哪些信任和恢复成本，是否值得采用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

默认关闭委派。适配器可在本轮重试收尾时，以至少发生一次额外尝试且最终匹配免费通道拒绝为条件调用委派。代码中该判断检查最终错误而没有独立地重核第一次也是同一拒绝。委派将既有 OpenCode auth 中单个提供方条目复制到独立 XDG 目录，新文件指定 0600，已有副本直接复用。子进程在独立目录用少量转发环境、环回绑定和随机服务密码启动，禁用外部配置来源并使用会询问或拒绝的权限策略。运行中权限请求会被轮询拒绝，返回后还扫描意外工具活动。XDG、环境限制与事后检查不能证明有 OS 级文件隔离，返回被拒也不证明底层已发生的动作可以撤销。异常路径尽力终止会话与删除服务端记录。停用代码只停子进程和计时器，没有删除凭据副本，原 CLI 登出也不自动同步。首次负担包括验证宿主接口和上游资格，委派又引入可执行文件、额外账户与状态。持续负担包括服务限流、较长回退和凭据管理，恢复还要核对数据和副作用。由于核心访问资格没有本轮证据，采用判断为观察。上游拒绝时停止在该通道尝试，继续用支持的客户端或已获授权的模型服务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/config.ts:234-242](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/config.ts#L234-L242)

委派默认关闭且需额外运行时。

```text
  delegation: Schema.object({
    /** Master switch; default false keeps the plugin a stateless anonymous client. */
    enabled: Schema.boolean().default(false),
    /** Explicit opencode binary path (skips managed/global/npm resolution). */
    opencodePath: Schema.string().default(''),
    /** Lowest opencode version the delegate will use (free-tier floor). */
    minVersion: Schema.string().default(MIN_OPENCODE_VERSION),
    /** GOMEMLIMIT injected into the child (Go heap soft cap). */
    memLimit: Schema.string().default(DEFAULT_MEM_LIMIT),
```

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:811-823](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L811-L823)

委派实际使用尝试次数与最终错误条件。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:245-265](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L245-L265)

已有副本复用，单个提供方条目新建到受控权限路径。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:485-529](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L485-L529)

独立 XDG、环回服务、密码与权限配置。

<details>
<summary>查看原文（45行）</summary>

```text
  const root = join(options.dataDir, 'opencode')
  for (const dir of XDG_ROOTS) {
    await mkdir(join(root, dir), { recursive: true, mode: 0o700 })
  }

  const childEnv: NodeJS.ProcessEnv = {}
  for (const key of FORWARDED_ENV) {
    if (env[key]) childEnv[key] = env[key]
  }
  for (const dir of XDG_ROOTS) {
    childEnv[`XDG_${dir.toUpperCase()}_HOME`] = join(root, dir)
  }
  Object.assign(childEnv, {
    GOMEMLIMIT: options.memLimit ?? DEFAULT_MEM_LIMIT,
    GOGC: String(options.gcPercent ?? DEFAULT_GC_PERCENT),
    OPENCODE_SERVER_PASSWORD: randomBytes(24).toString('hex'),
    OPENCODE_SERVER_USERNAME: 'opencode',
    OPENCODE_DISABLE_AUTOUPDATE: 'true',
    OPENCODE_DISABLE_PROJECT_CONFIG: 'true',
    OPENCODE_DISABLE_CLAUDE_CODE: 'true',
    OPENCODE_DISABLE_EXTERNAL_SKILLS: 'true',
    OPENCODE_CONFIG_CONTENT: JSON.stringify({
      permission: DELEGATE_PERMISSION_POLICY,
      autoupdate: false,
      share: 'disabled',
      agent: {
        [DELEGATE_CHAT_AGENT]: {
          mode: 'primary',
          description: 'Text-only external conversation',
          prompt: DELEGATE_CHAT_AGENT_PROMPT,
          permission: DELEGATE_PERMISSION_POLICY,
        },
      },
    }),
  })

  const projectDir = join(root, 'project')
  await mkdir(projectDir, { recursive: true })
  const port = await freePort()

  const child = spawn(binary, ['serve', '--pure', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: projectDir,
    env: childEnv,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:679-705](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L679-L705)

权限请求轮询拒绝，失败时仍不批准。

<details>
<summary>查看原文（27行）</summary>

```text
    const monitor = (async (): Promise<void> => {
      while (!guardSignal.aborted && rejectedCount < MAX_REJECTED_PERMISSIONS_PER_TURN) {
        let pending: Array<{ id?: string; tool?: { callID?: string } }>
        try {
          const listed = await this.request('/permission', 'GET', undefined, guardSignal, 5000)
          if (!Array.isArray(listed)) continue
          pending = listed as Array<{ id?: string; tool?: { callID?: string } }>
        } catch {
          continue // a failed poll never grants approval; native actions stay waiting
        }
        for (const permission of pending) {
          if (guardSignal.aborted || rejectedCount >= MAX_REJECTED_PERMISSIONS_PER_TURN) break
          if (typeof permission.id !== 'string' || permission.id.length === 0) continue
          const callID = permission.tool?.callID
          if (callID !== undefined && rejectedCallIds.has(callID)) continue
          if (callID !== undefined) rejectedCallIds.add(callID)
          rejectedCount += 1
          await this.request(
            `/permission/${encodeURIComponent(permission.id)}/reply`,
            'POST',
            { reply: 'reject', message: 'Native tools are not available in this session. Reply in plain text only.' },
            guardSignal,
            5000,
          ).catch(() => {})
        }
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:715-734](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L715-L734)

HTTP 成功仍要检查业务错误与工具活动。

<details>
<summary>查看原文（20行）</summary>

```text
      // The HTTP-200 gotcha: judge by info.error presence, never by text parts.
      if (response.info?.error) {
        const error = response.info.error
        throw new DelegateError(
          error.data?.message ?? error.message ?? error.name ?? 'opencode model request failed',
          'model_error',
        )
      }

      const parts = Array.isArray(response.parts) ? response.parts : []
      // Scan for unexpected tool activity. A tool part is acceptable ONLY when it
      // is a call we rejected and the runtime recorded it as errored; anything
      // else means a native action got past the ask-then-reject gate.
      const unexpectedTool = parts.find((part) => part.type === 'tool'
        && !(typeof part.callID === 'string'
          && rejectedCallIds.has(part.callID)
          && (part.state as { status?: string } | undefined)?.status === 'error'))
      if (unexpectedTool !== undefined) {
        throw new DelegateError('opencode attempted a native tool action; the turn was refused', 'native_tool_activity')
      }
```

</details>

**依据 7 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:767-777](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L767-L777)

退出会话的 abort 和 DELETE 都尽力执行。

<details>
<summary>查看原文（11行）</summary>

```text
    } finally {
      guard.abort()
      await monitor.catch(() => {})
      // Cancellation/Failure must stop backend work, not merely disconnect: abort
      // an unfinished turn, then remove the session. Both are best-effort.
      if (!completed) {
        await this.request(`${route}/abort`, 'POST', undefined, undefined, 5000).catch(() => {})
      }
      await this.request(route, 'DELETE', undefined, undefined, 5000).catch((error) => {
        this.#log(`[delegate] session cleanup failed: ${error instanceof Error ? error.message : String(error)}`)
      })
```

</details>

**依据 8 · 源码核查**：[packages/plugin/src/adapter/delegate.ts:918-926](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/delegate.ts#L918-L926)

停用停止子进程和计时器，未删凭据。

```text
  /** Stop the child and timers. */
  async dispose(): Promise<void> {
    if (this.#trimmerTimer) {
      clearInterval(this.#trimmerTimer)
      this.#trimmerTimer = null
    }
    const runtime = this.#runtime
    this.#runtime = null
    if (runtime) await runtime.stop().catch(() => {})
```

**依据 9 · 作者声明**：[docs/delegation.md:91-97](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/docs/delegation.md#L91-L97)

作者说明非增量委派、凭据刷新及上游验证边界。

```text
## 7. 已知限制

- **非增量流式**：一回合用同步 `POST /message` 拿完整结果再翻译成 chunk 流（参考实现的同一条主路径）。用户要等整回合结束才看到文本；token 级增量流式（消费 `/event` SSE）是后续增强。
- **reasoning effort 不穿透**：委托回合不传 `variant`，用运行时默认推理档位（插件 catalog 不暴露 variants 元数据）。
- **MEMORY/GOGC 与 EmptyWorkingSet 是尽力而为**：GOMEMLIMIT 是软上限，极端负载下物理占用仍可能冲高；内存回收只在 Windows 生效。
- **凭据刷新语义**：种子的 `auth.json` 是用户登录时的快照；opencode CLI 侧刷新/登出不会自动同步（删 `<dataDir>/delegate/opencode/data/opencode/auth.json` 可强制重种）。
- **协议形状来自参考实现**：本机出口 IP 被 opencode 生成接口全拒（2026-10-19 起），无法对 live 服务器做形状验证；所有端到端验证走本地 mock `opencode serve`。若上游协议漂移，以参考实现（reisen-ww/opengate）为准。
```

#### 缺口

- 未验证运行时实际权限拦截、账户资格、平台权限语义或清理效果。
  **影响**：不适合把委派视为可持续且安全的默认入口。
  **进一步探讨**：若有正式授权，仅在隔离测试机用模拟凭据、假 OpenCode 进程和无副作用任务验收权限及退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把探测通过、实际请求通过和结果未知分开展示，会改善采用决策吗？

**研究主题**：新假设与验证

#### 完整回答

现有目录探测已经区分通过、拒绝和错误，终端失败可写入尝试轨迹。它还没有在同一用户决策界面把探测身份、实际会话状态与未知远端结果同时说明。可用受控假端点测试一个更窄的改动，目录注明仅探测可达，真实任务另外显示已开始、已产出、拒绝或中断后结果未知。对同一批模拟限流、拒绝和流中断，比较旧显示与新显示下用户能否正确停止重试、识别中断时的副作用核对需要，以及处理耗时。用合成数据和可计数的假工具即可，避免拿真实第三方配额或凭据做实验。如果状态标签不能降低错误重试或让排障变慢，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:858-865](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/catalog.ts#L858-L865)

当前探测只产生粗粒度资格结果。

```text
      if (response.status === 200 || response.status === 429) return 'pass'
      if (response.status === 403 || response.status === 400 || response.status === 410) return 'refused'
      return 'error'
    } catch {
      return 'error'
    } finally {
      clearTimeout(timer)
    }
```

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:825-844](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L825-L844)

请求失败可输出已有尝试轨迹。

<details>
<summary>查看原文（20行）</summary>

```text
        // last resort: rewrite the terminal error to tell the whole story
        // (the user saw minutes of silence — the surfaced error must say
        // what was tried, not just the last attempt's failure)
        for (let i = 0; i < buffered.length; i += 1) {
          const e = buffered[i] as PiEvent & { error?: { errorMessage?: string }; message?: { errorMessage?: string; stopReason?: string } }
          if (e.type === 'error' && e.error) {
            e.error.errorMessage = rotateStory.length > 1
              ? `${e.error.errorMessage} (opencode2dsh 轮换 ${rotateStory.length - 1} 次后放弃: ${rotateStory.join(' -> ')})`
              : e.error.errorMessage
            break
          }
          if (e.type === 'done' && e.message?.stopReason === 'error') {
            e.message.errorMessage = rotateStory.length > 1
              ? `${e.message.errorMessage} (opencode2dsh 轮换 ${rotateStory.length - 1} 次后放弃: ${rotateStory.join(' -> ')})`
              : e.message.errorMessage!
            break
          }
        }
        yield* toStreamChunks((async function* pumped() { for (const e of buffered) yield e })(), GATE_TOOL_ALIASES)
        return
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:715-728](https://github.com/FishBottle7/opencode2dsh/blob/37d3ea202187767d6576ef72798e270c12da9b4e/packages/plugin/src/adapter/zen-adapter.ts#L715-L728)

交付内容后中断是一类可独立呈现的边界。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

#### 缺口

- 没有状态原型或操作者对照。
  **影响**：无法断定显示改动比现有日志更有价值。
  **进一步探讨**：用同一故障剧本做交叉顺序试验，统计误重试、漏核对和操作耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
