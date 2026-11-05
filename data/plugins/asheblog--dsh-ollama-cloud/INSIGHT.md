# dsh-ollama-cloud

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d26c5fa](https://github.com/Asheblog/dsh-ollama-cloud/tree/d26c5fac1a66090f8de1dbd552e867287fa3eb5b)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asheblog/dsh-ollama-cloud)
<!-- END META -->

> **功能**：为 DSH 接入 Ollama Cloud，提供模型发现、推理档位、额度视图及搜索和抓取。

> **亮点**：[Q01](#research-q01) 把端点原生目录变成宿主可选模型，[Q02](#research-q02) 解释暂态保留和退役剔除的分工。[Q03](#research-q03) 的包级检查让宿主发布号变更有明确的静态判据。

> **主要限制**：[Q03](#research-q03) 逐包相同只能支持所覆盖契约。[Q04](#research-q04) 和 [Q01](#research-q01) 的发现接口均将可覆盖目标地址与宿主凭据回退组合，需要分别核对调用权限和目的地限制。

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
  - [Q01 · 对接官方适配器时，这个插件实际多承担什么？](#detail-section-11)
  - [Q02 · 从离线到恢复时，目录和推理级别如何变化？](#detail-section-12)
  - [Q03 · 兼容性声明能支持多强的宿主采用结论？](#detail-section-13)
  - [Q04 · 额度 UI 与联网工具改变了哪些操作和成本？](#detail-section-14)
  - [Q05 · 如何让用户更准确判断模型选择失败的原因？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Ollama Cloud 帐户且需要在 DSH 中选用多种云模型的开发者。

手配 OpenAI 兼容端点和模型列表可覆盖基本聊天，模型属性和额度需要自行核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型路由 | 选用 Ollama Cloud 模型 | 聊天依赖官方适配器及端点认证 |
| 目录 | 读取模型与推理元信息 | 失败时可保留缓存或随包快照 |
| 额度 | 在宿主查看窗口用量 | 需 connection，调用权限与目的地待验证 |
| 搜索与抓取 | 使用 Ollama Web 能力 | 需宿主 Web 选择、密钥及可达端点 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 llm | 聊天必需 | 挂载模型路由 | 停止并恢复原宿主配置 |
| Ollama 凭据 | Cloud 调用必需 | 授权聊天与 Web | 返回凭据错误或服务拒绝 |
| connection 与组合补丁 | 额度界面必需 | 挂载额度 RPC | 检查启动日志并退出试用 |
| Web 服务与部署选择 | 联网能力必需 | 启用搜索或抓取 | 保持现有 Web 提供方 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份配置并查重路由 | 遇到冲突先使用独立配置 |
| 检查 | 操作者验证声明的宿主版本及通道 | 启动异常恢复原配置 |
| 验收 | 用虚拟密钥核查目的端点、候选和失败提示 | 目标不符时停止接入 |
| 试用 | 权限清楚后对照同一任务的模型和响应 | 不符合预期即切回原路由 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主资源与帐户成本未知 | 配置、重启和权限检查 | 安装及恢复耗时未测 |
| 持续 | 模型、额度轮询与目录发现消耗未知 | 跟踪宿主契约和元数据变化 | 无实际账单 |
| 失败恢复 | 重试可能增加网络请求 | 看诊断并恢复路由 | 失败频率与排障时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型配置 | 发现阶段只复制有描述的候选 | 任务实际成功率 |
| 升级核查 | 包文件及清单有明确比较判据 | 目标组成下的启动与流 |
| 额度查看 | 有宿主 RPC 与窗口解码 | 读数准确性、调用者边界和费用 |

> **思考**：[Q03](#research-q03) 逐包相同只能支持所覆盖契约。[Q04](#research-q04) 和 [Q01](#research-q01) 的发现接口均将可覆盖目标地址与宿主凭据回退组合，需要分别核对调用权限和目的地限制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把端点原生目录变成宿主可选模型，[Q02](#research-q02) 解释暂态保留和退役剔除的分工。[Q03](#research-q03) 的包级检查让宿主发布号变更有明确的静态判据。

[Q01](#research-q01) 连接选项与适配器实例绑定。[Q02](#research-q02) 将目录成员与详情可信度分开。[Q03](#research-q03) 用发布物比较补充组合配置维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 逐包相同只能支持所覆盖契约。[Q04](#research-q04) 和 [Q01](#research-q01) 的发现接口均将可覆盖目标地址与宿主凭据回退组合，需要分别核对调用权限和目的地限制。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先保留可恢复的宿主配置并锁定已声明版本。[Q04](#research-q04) 用受控端点和虚拟密钥分别核对模型发现和用量 RPC 的权限、密钥回退及目的地，通过后才评估使用真实帐户。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码支持路由、目录、兼容检查和额度通道机制。界面假设及宿主、权限和服务效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/adr/0009-harness-release-admission.zh.md、package.json、scripts/compare-harness-contract.mjs、src/adapter.ts、src/config.ts、src/discovery.ts、src/index.ts、src/live-catalog.ts、src/rpc.ts、src/usage.ts、src/web.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交根组件，抽查包清单、README、ADR、路由、目录、RPC 和 Web 的关键源码。研究期间没有安装、执行目标代码、测试真实宿主或调用真实模型。
- 下一步：在隔离配置中核对启动、路由冲突、模型选择、取消、目录刷新与模型发现与用量 RPC 的角色、草稿目标与实际出站边界。

**分析版本**

- **仓库**：[Asheblog/dsh-ollama-cloud](https://github.com/Asheblog/dsh-ollama-cloud)
- **版本号**：0.5.1（[固定提交 d26c5fa](https://github.com/Asheblog/dsh-ollama-cloud/tree/d26c5fac1a66090f8de1dbd552e867287fa3eb5b)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在选择模型时区分目录来源、详情状态与凭据配置，检验能否减少错误重试和配置改动。

在隔离配置中核对启动、路由冲突、模型选择、取消、目录刷新与模型发现与用量 RPC 的角色、草稿目标与实际出站边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 21 | 2009 | — | — | 26942 |
| .js | source | 17 | 4563 | 3102 | 1384 | — |
| .mjs | source | 5 | 566 | 370 | 141 | — |
| .ts | source | 16 | 3784 | 2158 | 1360 | — |
| .ts | test | 21 | 3725 | 3024 | 375 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Asheblog/dsh-ollama-cloud/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Asheblog/dsh-ollama-cloud/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Asheblog/dsh-ollama-cloud/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本上，已有 Ollama Cloud 帐户的 DSH 用户能获得哪些宿主集成，如何判断候选宿主上的采用风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对接官方适配器时，这个插件实际多承担什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

已有 Ollama Cloud 帐户、在 DSH 中反复切换云模型的用户，需要让宿主选中的模型和推理档与端点一致。手工维护兼容聊天端点和模型配置可以覆盖基本对话。这里新增的是模型发现、供应商连接事实与宿主选择器的接线。入口以同一路由注册配置、适配器和发现，聊天委托官方 PiAiAdapter。准备调用时捕获当前适配器，模型解析与流使用同一份连接配置，避免这条调用路径在中途重新读取配置。作者同时指出旧 dsh-llm-ollama 占同一路由，试用前需移除冲突项。发现接口允许配置草稿端点；若没有显式给草稿密钥，则从当前路由引用解析保存密钥，再将它用于草稿目标的 tags/show。nativeBaseFrom 仅按空值回退，非空值交给 URL 形态归一化，不绑定凭据所属来源。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:242-275](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/index.ts#L242-L275)

注册路由和草稿发现，独立选取 URL 与凭据

<details>
<summary>查看原文（34行）</summary>

```text
  const resolveApiKey = createRouteApiKeyResolver(resolveCredential)

  const adapter = new OllamaCloudAdapter({
    options: connection,
    resolveApiKey,
    resolveAttachments: () => ctx.get('attachments'),
  })

  ctx.llm.registerConfigurableProviders([{
    provider: PROVIDER,
    displayName: DISPLAY_NAME,
    settingsNs,
    settingsPath: [],
  }])
  ctx.llm.registerAdapter([PROVIDER], adapter)

  /**
   * Interrogate one endpoint for its model catalog. A configuration surface
   * may pass the draft endpoint and a one-shot key; otherwise the configured
   * route's endpoint and stored credential answer, and the public cloud
   * metadata endpoints need no credential at all.
   */
  ctx.llm.registerModelDiscovery(settingsNs, async (request: LlmModelDiscoveryRequest, signal) => {
    const facts = connection()
    const baseURL = nativeBaseFrom(request.baseURL, facts.nativeBaseURL)
    const apiKey = request.apiKey ?? await storedKey(facts)
    const discovered: readonly LlmDiscoveredModel[] = await discoverModels(
      {
        baseURL,
        ...apiKey === undefined ? {} : { apiKey },
        requestTimeoutMs: facts.requestTimeoutMs,
      },
      { fetch, attribution: attributionHeaders },
      signal,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:195-203](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/index.ts#L195-L203)

已保存密钥按当前路由凭据引用解析

```text

  const settingsNs = ctx.fiber.entry?.options.id ?? DEFAULT_SETTINGS_NAMESPACE
  const resolveCredential = createCredentialResolver(ctx, name)

  /** The configured key, or `undefined` when nothing usable is set. */
  const storedKey = async (facts: ConnectionOptions): Promise<string | undefined> => {
    const reference = facts.apiKeyEnv
    return reference === undefined ? undefined : resolveCredential(reference)
  }
```

**依据 3 · 源码核查**：[src/discovery.ts:35-48](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L35-L48)

非空草稿端点交给路径归一化

<details>
<summary>查看原文（14行）</summary>

```text
 * A draft profile carries the endpoint the way a user typed it — a bare host,
 * an OpenAI-compatible `/v1` base, or the native `/api` base — so the draft is
 * run through the same normalization the plugin's own configuration uses
 * ({@link nativeAPIBaseURL}), and an absent draft falls back to the configured
 * route's base.
 *
 * @param baseURL - draft endpoint from a configuration surface, when any.
 * @param fallback - the configured route's native base.
 * @returns the native base URL to interrogate.
 */
export function nativeBaseFrom(baseURL: string | undefined, fallback: string): string {
  const trimmed = baseURL?.trim() ?? ''
  return trimmed.length === 0 ? fallback : nativeAPIBaseURL(trimmed)
}
```

</details>

**依据 4 · 源码核查**：[src/config.ts:225-247](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/config.ts#L225-L247)

归一化保留端点来源，没有同源限制

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Normalize a configured endpoint into the native Ollama API base.
 *
 * The documented value is the native base (`https://ollama.com/api`), but a
 * bare host is the shape users type first, so it gains `/api`; a `/v1` base
 * (the OpenAI-compatible spelling) maps back to `/api`; an explicit custom
 * path is kept, because only the deployment knows its own layout.
 *
 * @param baseURL - configured endpoint.
 * @returns the native API base.
 */
export function nativeAPIBaseURL(baseURL: string): string {
  const normalized = baseURL.replace(/\/+$/, '')
  if (normalized.endsWith('/api')) return normalized
  if (normalized.endsWith('/v1')) return `${normalized.slice(0, -'/v1'.length)}/api`
  try {
    const url = new URL(normalized)
    if (url.pathname === '/' || url.pathname === '') return `${normalized}/api`
  } catch {
    // Not a URL at all: assertBaseURL rejects it with a better message.
  }
  return normalized
}
```

</details>

**依据 5 · 源码核查**：[src/discovery.ts:280-306](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L280-L306)

对选定目标发 tags/show 并携带已解析 Bearer

<details>
<summary>查看原文（27行）</summary>

```text
  const base = target.baseURL.replace(/\/+$/, '')
  const timeoutMs = target.requestTimeoutMs ?? DEFAULT_DISCOVERY_TIMEOUT_MS
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...deps.attribution?.() ?? {},
    ...target.apiKey === undefined ? {} : { authorization: `Bearer ${target.apiKey}` },
  }

  const listing = await deps.fetch(`${base}/tags`, {
    headers,
    redirect: 'error',
    signal: attemptSignal(signal, timeoutMs),
  })
  if (!listing.ok) {
    await listing.body?.cancel()
    throw new Error(`ollama-cloud discovery: ${base}/tags answered ${listing.status}`)
  }
  const ids = decodeTagsResponse(await listing.json())

  const entries: OllamaModelEntry[] = []
  const described: string[] = []
  for (let start = 0; start < ids.length; start += DETAIL_CONCURRENCY) {
    const batch = ids.slice(start, start + DETAIL_CONCURRENCY)
    const details: DetailResult[] = await Promise.all(
      batch.map(async (id): Promise<DetailResult> => {
        try {
          const answer = await postJson(`${base}/show`, { model: id }, headers, deps, signal, timeoutMs)
```

</details>

**依据 6 · 源码核查**：[src/adapter.ts:97-115](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/adapter.ts#L97-L115)

以当前选项创建官方适配器

<details>
<summary>查看原文（19行）</summary>

```text
  /** The delegated adapter for the current connection facts. */
  private current(): AdapterSnapshot {
    const options = this.config.options()
    if (this.snapshot !== undefined && this.snapshot.options === options) return this.snapshot
    const profile = createPiAiProfile(options)
    const profiles = new Map([[options.provider, profile]])
    const adapter = new PiAiAdapter({
      profiles: () => profiles,
      resolveApiKey: () => this.config.resolveApiKey(options),
      auth: this.auth,
      ...this.config.resolveAttachments === undefined
        ? {}
        : { resolveAttachments: this.config.resolveAttachments },
      ...this.config.onReplayDegrade === undefined
        ? {}
        : { onReplayDegrade: this.config.onReplayDegrade },
    })
    this.snapshot = { options, adapter }
    return this.snapshot
```

</details>

**依据 7 · 源码核查**：[src/adapter.ts:144-155](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/adapter.ts#L144-L155)

同一适配器准备模型及流

<details>
<summary>查看原文（12行）</summary>

```text
  /** @returns model metadata and a stream bound to the same adapter generation. */
  override async prepareCall(
    provider: string,
    model: string,
    signal?: AbortSignal,
  ): Promise<PreparedAdapterCall> {
    const snapshot = this.current()
    const prepared = await snapshot.adapter.prepareCall(provider, model, signal)
    return {
      model: withDefaultEffort(prepared.model, model, snapshot.options),
      stream: (options: GenerateOptions) => prepared.stream(options),
    }
```

</details>

**依据 8 · 作者声明**：[README.md:22-36](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/README.md#L22-L36)

作者说明凭据、冲突与模型选择

<details>
<summary>查看原文（15行）</summary>

````text
Restart the harness, then give Ollama Cloud an API key in **Settings → Models** (stored write-only through the credentials service), or export one:

```sh
export OLLAMA_API_KEY=...        # Linux / macOS
$env:OLLAMA_API_KEY = "..."      # Windows PowerShell
```

Keys come from <https://ollama.com/settings/keys>. The catalog and metadata endpoints are anonymous, so **the model list appears before any key exists** — only chat fails, with `MISSING_CREDENTIAL`.

> **Pick one of this plugin or `dsh-llm-ollama`.** Both register the `ollama-cloud` route, and installing both fails at mount time (`DUPLICATE_ADAPTER`). Remove `dsh-llm-ollama` from the profile's bundles first.

## Usage

1. Pick an `ollama-cloud` model in the composer's model menu (or `/model`).
2. Pick an **effort** in the same menu. The offered levels depend on the model, and the default comes from Ollama's own model metadata.
````

</details>

#### 缺口

- 未运行同一聊天、工具与取消任务，未验证哪些宿主角色能调用草稿发现
  **影响**：无法评价实际兼容性、节约时间和草稿发现的可触发范围
  **进一步探讨**：先以受控端点和虚拟密钥核对发现授权与目的地，再对照手配端点运行固定文本及可丢弃工具任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从离线到恢复时，目录和推理级别如何变化？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

目录按端点使用已保存快照，首次无匹配缓存则回退随包目录。启用自动刷新后挂载不等待网络，定时器重读开关。刷新先请求 tags，再分批请求 show。详情 404 或 410 会被剔除，其他失败可保留只有 ID 的成员。配置发现只呈现得到详情的候选。空列表不替换上次目录。推理档优先取 thinking 元数据，服务端只声明 thinking 能力时可回退通用档，默认档仍须由元数据提供。列表中的成员或档位属于当时可读的目录信息，具体任务能否成功仍取决于调用凭据及端点行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:329-361](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/index.ts#L329-L361)

启动日志及刷新调度

<details>
<summary>查看原文（33行）</summary>

```text
  const cached = catalog.cached()
  ctx.logger.info(
    cached === undefined
      ? 'llm-ollama-cloud: no cached catalog yet; serving the shipped snapshot until the endpoint answers'
      : `llm-ollama-cloud: serving the cached catalog of ${cached.endpoint}`
        + ` (${cached.models} models, fetched ${new Date(cached.fetchedAt).toISOString()})`,
  )

  if (config.autoRefresh.get()) {
    // Deliberately not awaited: a slow endpoint must not hold up the boot, and
    // the model list is already correct from the cache (or the snapshot).
    void refreshCatalog('mount')
  }

  // The scheduler re-reads the live configuration twice per pass — once to
  // decide how long to wait, once when the timer fires to decide what that
  // pass does — so a change never has to survive a whole interval, and
  // switching the refresh off takes effect at the next tick instead of
  // requiring a reload. While it is off (or mount-only) the chain keeps
  // ticking on the idle cadence without touching the network, which is what
  // makes switching it back on work the same way.
  ctx.effect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined
    /** Minutes to schedule: `0` means this pass must not fetch. */
    const intervalMinutes = (): number => (config.autoRefresh.get() ? config.refreshMinutes.get() : 0)
    const arm = (): void => {
      if (stopped) return
      const scheduled = intervalMinutes()
      timer = setTimeout(() => {
        if (intervalMinutes() > 0) void refreshCatalog('interval')
        arm()
      }, scheduled > 0 ? scheduled * 60_000 : IDLE_REFRESH_WATCH_MS)
```

</details>

**依据 2 · 作者声明**：[README.md:45-54](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/README.md#L45-L54)

作者描述随包目录的回退用途

<details>
<summary>查看原文（10行）</summary>

```text
| Your `models` configuration | per-id overrides, additions, and `enabled: false` retirements |
| The endpoint, just fetched | which models exist, and every capability each one declares |
| The cache of the last fetch | the same answer, read from disk before the network answers |
| The shipped snapshot | display names, and the fallback until some fetch has succeeded |

Two consequences worth knowing:

- **A retired model leaves by itself.** A model the endpoint stops listing disappears, and one its listing still names but answers `404`/`410` for is dropped too — that answer is the endpoint saying its own listing is stale. A detail request that merely *fails* (timeout, 5xx, 429) keeps the model with what the listing said: a slow `/api/show` must not hide a real model for a whole refresh interval.
- **New models arrive with their own levels.** A model the snapshot never shipped keeps its id as the display name until a release gives it a prettier one; its thinking levels are still whatever `/api/show` reports.

```

</details>

**依据 3 · 源码核查**：[src/live-catalog.ts:97-133](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/live-catalog.ts#L97-L133)

匹配端点与拒绝空目录的缓存逻辑

<details>
<summary>查看原文（37行）</summary>

```text
export function createLiveCatalog(options: LiveCatalogOptions): LiveCatalog {
  const cachePath = options.cachePath ?? defaultCatalogCachePath()
  let snapshot: CatalogCacheSnapshot | undefined = readCatalogCache(cachePath)
  let effective: readonly OllamaModelEntry[] | undefined = snapshot === undefined
    ? undefined
    : mergeLiveCatalog(snapshot.models)
  let revision = 0

  return {
    revision: () => revision,
    modelsFor: (nativeBaseURL) => (snapshot?.endpoint === nativeBaseURL ? effective : undefined),
    cached: () => snapshot === undefined
      ? undefined
      : { endpoint: snapshot.endpoint, fetchedAt: snapshot.fetchedAt, models: snapshot.models.length },
    async refresh(target, signal) {
      const { entries, described } = await discoverCatalog(target, options.deps, signal)
      const endpoint = target.baseURL.replace(/\/+$/, '')
      // An empty listing is a hiccup, not a catalog: adopting it would blank
      // the model picker with nothing to recover from, so the previous catalog
      // keeps serving and the next pass can succeed.
      if (entries.length === 0) {
        throw new Error(`ollama-cloud: ${endpoint} listed no models`)
      }

      const next = mergeLiveCatalog(entries)
      const changed = JSON.stringify(next) !== JSON.stringify(effective)
      snapshot = { endpoint, fetchedAt: Date.now(), models: entries }
      effective = next
      // The revision is the catalog's identity, not the fetch's: a pass that
      // confirmed the catalog must not rebuild every adapter for nothing.
      if (changed) revision += 1
      return {
        models: entries.length,
        described: described.length,
        changed,
        cache: writeCatalogCache(cachePath, snapshot),
      }
```

</details>

**依据 4 · 源码核查**：[src/discovery.ts:280-325](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L280-L325)

发现链区分成员、详情与退役

<details>
<summary>查看原文（46行）</summary>

```text
  const base = target.baseURL.replace(/\/+$/, '')
  const timeoutMs = target.requestTimeoutMs ?? DEFAULT_DISCOVERY_TIMEOUT_MS
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...deps.attribution?.() ?? {},
    ...target.apiKey === undefined ? {} : { authorization: `Bearer ${target.apiKey}` },
  }

  const listing = await deps.fetch(`${base}/tags`, {
    headers,
    redirect: 'error',
    signal: attemptSignal(signal, timeoutMs),
  })
  if (!listing.ok) {
    await listing.body?.cancel()
    throw new Error(`ollama-cloud discovery: ${base}/tags answered ${listing.status}`)
  }
  const ids = decodeTagsResponse(await listing.json())

  const entries: OllamaModelEntry[] = []
  const described: string[] = []
  for (let start = 0; start < ids.length; start += DETAIL_CONCURRENCY) {
    const batch = ids.slice(start, start + DETAIL_CONCURRENCY)
    const details: DetailResult[] = await Promise.all(
      batch.map(async (id): Promise<DetailResult> => {
        try {
          const answer = await postJson(`${base}/show`, { model: id }, headers, deps, signal, timeoutMs)
          if (!answer.ok) return { id, missing: MISSING_STATUSES.has(answer.status) }
          return { id, entry: decodeShowResponse(id, answer.body), missing: false }
        } catch (error) {
          if (signal?.aborted === true) throw error
          return { id, missing: false }
        }
      }),
    )
    for (const detail of details) {
      if (detail.missing) continue
      if (detail.entry === undefined) {
        // No answer yet: the listing still says the model exists, so it is
        // served with only what the listing said.
        entries.push({ id: detail.id })
        continue
      }
      described.push(detail.id)
      entries.push(detail.entry)
    }
```

</details>

**依据 5 · 源码核查**：[src/discovery.ts:345-355](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L345-L355)

发现候选过滤

<details>
<summary>查看原文（11行）</summary>

```text
export async function discoverModels(
  target: DiscoveryTarget,
  deps: DiscoveryDeps,
  signal?: AbortSignal,
): Promise<LlmDiscoveredModel[]> {
  const catalog = await discoverCatalog(target, deps, signal)
  const described = new Set(catalog.described)
  return catalog.entries
    .filter((entry) => described.has(entry.id))
    .map((entry) => toDiscoveredModel(entry, entry.id))
}
```

</details>

**依据 6 · 源码核查**：[src/discovery.ts:123-142](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L123-L142)

思考档位和通用回退

<details>
<summary>查看原文（20行）</summary>

```text
export function decodeShowResponse(id: string, body: unknown): OllamaModelEntry {
  const record = (body ?? {}) as Record<string, unknown>
  const capabilities = readCapabilities(record)
  const contextWindow = readContextWindow(record)
  const policy = policyFromThinking(record.thinking)
  // The endpoint may name the thinking capability without a ladder: the
  // standard names apply, and no default is claimed because none was declared.
  let efforts: Partial<Record<ThinkingLevel, string>> | false | undefined
  if (policy !== undefined) efforts = offeredEffortMap(policy.efforts)
  else if (capabilities === undefined) efforts = undefined
  else efforts = capabilities.includes('thinking') ? GENERIC_EFFORTS : false
  const defaultEffort = policy?.defaultEffort

  return {
    id,
    ...contextWindow === undefined ? {} : { contextWindow },
    ...capabilities === undefined ? {} : { vision: capabilities.includes('vision') },
    ...efforts === undefined ? {} : { reasoningEfforts: efforts },
    ...defaultEffort === undefined ? {} : { defaultEffort },
  }
```

</details>

#### 缺口

- 未观测特定服务端的退役、超时与 thinking 实际响应
  **影响**：无法保证目录回退时每个候选可用或档位生效
  **进一步探讨**：对固定测试端点模拟空列表、详情超时、410 和仅声明 thinking，再检查选择器与请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容性声明能支持多强的宿主采用结论？

**研究主题**：工程质量与复用、依赖、兼容与流程、采用判断

#### 完整回答

0.5.1 的逐版本声明接纳 0.2.1-rc.1 到 rc.5，并将两个 0.2.0 候选标为不兼容。发布检查从开发及对等依赖筛出 @deepseek-ai/dsh-*，对比 tarball 文件集合、非清单字节及归一化发布号后的清单，还拒绝同一实际版本冒充两侧。相比只放宽版本区间，它可揭示组合补丁和清单依赖漂移。ADR 报告 rc.3 到 rc.4、rc.5 的比较通过，但该方法没有跑桌面启动、解析整个依赖树或进行真实模型调用。脚本以同步 npm pack 拉取，命令失败可直接抛错，所以不能依赖后续缺包提示区分不存在与仓库故障。对现有使用者，可锁一个声明版本在可恢复的独立配置里验证。启动、连接通道或取消不符时恢复原配置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:54-76](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/package.json#L54-L76)

包声明 web 插件、组合补丁和发布矩阵

<details>
<summary>查看原文（23行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    },
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.1": "incompatible",
        "0.2.0-rc.2": "incompatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "compatible",
        "0.2.1-rc.5": "compatible"
      }
    }
```

</details>

**依据 2 · 源码核查**：[scripts/compare-harness-contract.mjs:57-85](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/scripts/compare-harness-contract.mjs#L57-L85)

检查范围和拉取方式

<details>
<summary>查看原文（29行）</summary>

```text
/** Every `@deepseek-ai/dsh-*` package this plugin declares, from either list. */
const candidates = [...new Set([
  ...Object.keys(own.devDependencies ?? {}),
  ...Object.keys(own.peerDependencies ?? {}),
])].filter((name) => name.startsWith('@deepseek-ai/dsh-')).sort()

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const shell = process.platform === 'win32'
const work = mkdtempSync(join(tmpdir(), 'dsh-harness-contract-'))

/** Pack one package at one version, extract it, and return its `package/` root. */
function fetchPackage(name, version) {
  const slug = name.replace(/^@[^/]+\//u, '')
  const dest = join(work, `${slug}-${version}`)
  const extracted = join(dest, 'package')
  if (existsSync(extracted)) return extracted

  execFileSync(npm, ['pack', `${name}@${version}`, '--pack-destination', work], {
    encoding: 'utf8', shell, stdio: ['ignore', 'pipe', 'ignore'],
  })

  // npm names the tarball after the package; the scope separator becomes `-`.
  const expected = `${name.replace(/^@/u, '').replace('/', '-')}-${version}.tgz`
  const tarball = join(work, expected)
  if (!existsSync(tarball)) return undefined

  mkdirSync(dest, { recursive: true })
  execFileSync('tar', ['-xzf', tarball, '-C', dest], { stdio: 'ignore' })
  return existsSync(extracted) ? extracted : undefined
```

</details>

**依据 3 · 源码核查**：[scripts/compare-harness-contract.mjs:123-168](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/scripts/compare-harness-contract.mjs#L123-L168)

字节、文件集合及清单的比较判据

<details>
<summary>查看原文（46行）</summary>

```text
function compare(before, after) {
  const filesBefore = files(before)
  const filesAfter = files(after)
  const findings = []

  const onlyBefore = filesBefore.filter((file) => !filesAfter.includes(file))
  const onlyAfter = filesAfter.filter((file) => !filesBefore.includes(file))
  if (onlyBefore.length > 0) findings.push(`shipped only in ${from}: ${onlyBefore.join(', ')}`)
  if (onlyAfter.length > 0) findings.push(`shipped only in ${to}: ${onlyAfter.join(', ')}`)

  const changed = filesBefore
    .filter((file) => filesAfter.includes(file))
    .filter((file) => !readFileSync(join(before, file)).equals(readFileSync(join(after, file))))

  const content = changed.filter((file) => file !== 'package.json')
  if (content.length > 0) findings.push(`content changed: ${content.join(', ')}`)

  if (changed.includes('package.json')) {
    const manifestBefore = normalize(JSON.parse(readFileSync(join(before, 'package.json'), 'utf8')))
    const manifestAfter = normalize(JSON.parse(readFileSync(join(after, 'package.json'), 'utf8')))
    for (const key of new Set([...Object.keys(manifestBefore), ...Object.keys(manifestAfter)])) {
      const a = manifestBefore[key]
      const b = manifestAfter[key]
      if (JSON.stringify(a) === JSON.stringify(b)) continue

      // A dependency table is the common case and its one-line JSON is unreadable:
      // name the entries that moved instead of dumping both objects.
      if (isTable(a) && isTable(b)) {
        const entries = new Set([...Object.keys(a), ...Object.keys(b)])
        const moved = [...entries]
          .filter((entry) => a[entry] !== b[entry])
          .map((entry) => `${entry}: ${a[entry] ?? '(absent)'} -> ${b[entry] ?? '(absent)'}`)
        if (moved.length > 0) {
          findings.push(`manifest.${key} moved:\n       ${moved.join('\n       ')}`)
          continue
        }
      }
      findings.push(`manifest.${key} differs beyond the release token: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`)
    }
  }

  // A package pinned at the same version on both sides would pass the checks
  // above while proving nothing about `to`, so it is a finding, not a pass.
  if (stamp(before) === stamp(after)) findings.push(`both sides are ${stamp(before)}; nothing was compared`)

  return findings
```

</details>

**依据 4 · 源码核查**：[scripts/compare-harness-contract.mjs:175-205](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/scripts/compare-harness-contract.mjs#L175-L205)

缺失路径与最小覆盖门槛

<details>
<summary>查看原文（31行）</summary>

```text
for (const name of candidates) {
  const before = fetchPackage(name, from)
  if (before === undefined) {
    skipped.push(`${name} (not published at ${from})`)
    continue
  }
  const after = fetchPackage(name, to)
  if (after === undefined) {
    drifted.push(`${name}: published at ${from} but not at ${to}`)
    continue
  }

  checked += 1
  const findings = compare(before, after)
  if (findings.length === 0) {
    console.log(`ok   ${name}`)
  } else {
    console.log(`FAIL ${name}`)
    for (const finding of findings) console.log(`     ${finding}`)
    drifted.push(`${name}: ${findings.length} finding(s)`)
  }
}

if (keep) console.log(`\nsources kept in ${work}`)
else rmSync(work, { recursive: true, force: true })

for (const entry of skipped) console.log(`skip ${entry}`)

if (checked === 0) {
  console.error(`\ncompare-harness-contract: nothing to compare between ${from} and ${to}`)
  process.exit(1)
```

</details>

**依据 5 · 作者声明**：[docs/adr/0009-harness-release-admission.zh.md:46-55](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/docs/adr/0009-harness-release-admission.zh.md#L46-L55)

作者的通过与历史失败报告

<details>
<summary>查看原文（10行）</summary>

```text
## 影响

- 每个版本一条命令，需要网络与 `tar`，因此不进 `pnpm check`——那条门必须能离线且确定。
- 离线守卫不变且互补：`tests/composition.test.ts` 把 bundle patch 对照已装
  composition、把发布矩阵对照已装版本，`check:pi-ai` 对照两侧 pi-ai 区间。它们覆盖
  「本构建被钉在什么上」，比较器覆盖「即将被钉在什么上」。
- 判据是可执行的，下一次抬版无法再把它重新推导成另一个样子。
- 本次在线的两侧都验证过：`rc.3 → rc.5` 与 `rc.3 → rc.4` 通过，而
  `0.2.0-rc.2 → 0.2.1-rc.5` 在 `dsh-web-app` 的 `cordis.patch.yml`、新增的 `locale/`
  载荷与 peer 表上失败——正是当年打断 `0.4.0` 的那次移动。
```

</details>

**依据 6 · 作者声明**：[README.md:195-201](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/README.md#L195-L201)

作者说明组合启动服务、pi-ai 与浏览器通道依赖

```text
## Compatibility

- Verified against DSH `0.2.1-rc.1` through `0.2.1-rc.5`. `engines.dsh` is `>=0.2.1-rc.1` — the first release whose `connection` row injects `webStartup` — so the `0.2.0` line is outside this release (next bullet). The per-release verdicts live in `dsh.compatibility.dshReleases`, and a future regression is recorded in `dsh.compatibility.blocklist`.
- **The bundle patch follows the composition's `connection` row.** `connection.rpc.handle()` mounts a channel through that row's own `webServer` — a caller that injects `webServer` on its own row still throws `cannot get property "webServer" without inject` — so this bundle restates the row's `inject` list with `webServer` added. That list also carries the row's startup dependency, and that one is the composition's to change: the `0.2.0` line injects `webRuntime`, `0.2.1-rc.1` injects `webStartup`. A stale name there does not fail a request; it makes a required row wait forever and fails the whole boot, which is why `pnpm test` compares this patch with the installed `@deepseek-ai/dsh-web-app` composition (`tests/composition.test.ts`) and `engines.dsh` admits only the releases whose row injects `webStartup`. Rationale and rejected alternatives: [ADR 0008](docs/adr/0008-composition-patch-follows-the-startup-service.md).
- Runtime dependency: `@earendil-works/pi-ai`, declared at the generation the installed harness speaks (`^1.1.0` for harness `0.2.1-rc.5`; the lockfile resolves `1.4.0`, a later minor that range admits). pi-ai is **not** a host-shared package, so this copy and the harness's own only agree while their generations do. The route normalizes the request context at its own boundary, which is the contract that changed between harness generations, so a `0.2.1` host drives it natively and the shim still absorbs a pre-0.87 context from an older one; `pnpm check` and the scheduled `pi-ai-drift` workflow fail when the two declared ranges admit no common version, and the plugin logs one mount-time warning when it can reach the installed harness's declaration and this build falls outside it (best-effort: a host that hides its manifest reads as silence, and CI is the reliable signal). Rationale: [ADR 0004](docs/adr/0004-pi-ai-generation-alignment.md).
- Protocol translation, streaming, replay, and tool calls are delegated wholesale to the official `@deepseek-ai/dsh-llm-pi-ai` `PiAiAdapter`; this plugin contributes Ollama-specific connection facts, the model catalog, and level metadata. Rationale: [ADR 0001](docs/adr/0001-delegate-chat-to-official-pi-ai-adapter.md).
- The browser half renders only in host slots (`settings.models.provider-card`, `sidebar.footer.action`) with host theme tokens, declares `connection` in its `inject`, and requires no other client package: the usage channel (`/ollama-cloud` + `usage/read`) is the plugin's own, so no provider-UI shell has to exist for the card to work.
```

#### 缺口

- 未复跑发布比较器，未安装固定包或启动相应宿主
  **影响**：无法独立确认作者报告及本机组成方式下的兼容性
  **进一步探讨**：先核对可信安装包和声明宿主，再用空白配置验证启动、聊天、取消、用量通道及退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 额度 UI 与联网工具改变了哪些操作和成本？

**研究主题**：场景与需求、效果与总成本、缺陷与关键质疑

#### 完整回答

有宿主 connection 通道的用户可在 DSH 内读取 Ollama 用量，避免为核对使用比例而切回服务端页面。RPC 用量链把 /balance 的剩余百分比映射为已用比例，404 转为不支持，401 或 403 提示凭据问题。Web 注入存在时可注册搜索和抓取，须按部署策略选择该提供方。Web 请求要求密钥并拒绝重定向，超时或传输错误有一次重试，HTTP 错误单独处理。用量 RPC 存在一条需要确认授权的路径：请求可带 baseURL，无请求密钥时回退宿主保存的凭据，随后向这个端点发送 Bearer。拒绝重定向只约束后续跳转。若不受信任的客户端能调用该通道且没有目的地限制，这一路径可能把保存的密钥发送给其指定端点。模型发现也有独立的同类路径，见 Q01。两条入口的宿主调用者权限和目标限制均待检查。初始配置及恢复由操作者负责，持续费用含模型与端点请求，尚无同任务账单或时间数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:280-323](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/index.ts#L280-L323)

RPC 与 Web 服务独立挂载

<details>
<summary>查看原文（44行）</summary>

```text
  // Optional surface: a headless composition has no browser session, so the
  // usage channel simply never mounts there and everything else keeps working.
  ctx.inject(['connection'], (connectionCtx) => {
    const handler = createUsageRpcHandler({
      connection,
      resolveCredential,
      credentials: () => ctx.get('credentials'),
      fetch,
      attribution: attributionHeaders,
    })
    connectionCtx.effect(() => {
      try {
        return connectionCtx.connection.rpc.handle(USAGE_RPC_CHANNEL, handler)
      } catch (error) {
        // Loud instead of silent: the browser card then reports a restart hint,
        // and this line names the composition change that fixes it.
        ctx.logger.warn(
          'llm-ollama-cloud: the usage channel could not mount on the connection service;'
          + ` the connection row must inject ${USAGE_CHANNEL_ROW_INJECT.join(' + ')}`
          + ' (this bundle patch restates that list — re-check it against the composition'
          + ' after a harness upgrade)',
        )
        ctx.logger.warn(error)
        return () => {}
      }
    }, 'llm-ollama-cloud: usage RPC channel')
  })

  // Optional capability: a headless composition without the web seam simply
  // has no search/fetch to offer, and everything else keeps working.
  ctx.inject(['web'], (webCtx) => {
    const options = {
      baseURL: () => connection().nativeBaseURL,
      resolveApiKey: () => storedKey(connection()),
      requestTimeoutMs: () => connection().requestTimeoutMs,
    }
    webCtx.effect(() => {
      const disposeSearch = webCtx.web.registerSearchProvider(new OllamaWebSearchProvider(options))
      const disposeFetch = webCtx.web.registerFetchProvider(new OllamaWebFetchProvider(options))
      return () => {
        disposeFetch()
        disposeSearch()
      }
    }, 'llm-ollama-cloud: web providers')
```

</details>

**依据 2 · 源码核查**：[src/rpc.ts:195-220](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/rpc.ts#L195-L220)

用量请求组合调用方 URL 与凭据回退

<details>
<summary>查看原文（26行）</summary>

```text
async function readUsageReply(
  options: UsageRpcOptions,
  payload: unknown,
  signal: AbortSignal | undefined,
): Promise<RpcReply<UsageReadValue>> {
  const request = decodeUsageRequest(payload)
  if (request === undefined) return failure('invalid-request', 'invalid Ollama Cloud usage request')
  const facts = options.connection()
  const apiKey = request.apiKey
    ?? (facts.apiKeyEnv === undefined ? undefined : await options.resolveCredential(facts.apiKeyEnv))
  try {
    const usage = await readUsage(
      {
        baseURL: nativeBaseFrom(request.baseURL, facts.nativeBaseURL),
        ...apiKey === undefined ? {} : { apiKey },
        requestTimeoutMs: facts.requestTimeoutMs,
      },
      { fetch: options.fetch, attribution: options.attribution },
      signal,
    )
    return { ok: true, value: { status: 'ok', usage: toWireUsage(usage) } }
  } catch (error) {
    if (error instanceof UsageError && error.code === USAGE_UNSUPPORTED) {
      return { ok: true, value: { status: 'unsupported' } }
    }
    if (error instanceof UsageError) return failure(error.code, error.message)
```

</details>

**依据 3 · 源码核查**：[src/usage.ts:155-162](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/usage.ts#L155-L162)

窗口解码调用已用比例转换

```text
  const remaining = value.remaining_percent
  if (typeof remaining !== 'number' || !Number.isFinite(remaining)) return undefined
  const resetsAt = readResetInstant(value)
  return {
    id,
    usedFraction: consumedFraction(remaining),
    ...resetsAt === undefined ? {} : { resetsAt },
  }
```

**依据 4 · 源码核查**：[src/usage.ts:238-258](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/usage.ts#L238-L258)

请求目的地址与 Bearer 绑定，拒绝重定向

<details>
<summary>查看原文（21行）</summary>

```text
async function readUsageAttempt(
  target: UsageTarget,
  deps: UsageDeps,
  signal?: AbortSignal,
): Promise<OllamaUsageSnapshot> {
  const base = target.baseURL.trim().replace(/\/+$/, '')
  const url = `${base}${BALANCE_PATH}`
  const attempt = attemptSignal(signal, target.requestTimeoutMs ?? DEFAULT_USAGE_TIMEOUT_MS)

  let response: Response
  try {
    response = await deps.fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...deps.attribution?.() ?? {},
        ...target.apiKey === undefined ? {} : { authorization: `Bearer ${target.apiKey}` },
      },
      redirect: 'error',
      signal: attempt.signal,
    })
```

</details>

**依据 5 · 源码核查**：[src/usage.ts:277-288](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/usage.ts#L277-L288)

HTTP 拒绝与不支持区分

<details>
<summary>查看原文（12行）</summary>

```text
  if (!response.ok) {
    await response.body?.cancel()
    if (response.status === 404) {
      throw new UsageError('this Ollama endpoint does not report cloud usage', USAGE_UNSUPPORTED)
    }
    if (response.status === 401 || response.status === 403) {
      throw new UsageError(`${url} answered ${response.status}; check the API key`, 'INVALID_CREDENTIAL')
    }
    throw new UsageError(`${url} answered ${response.status}`, USAGE_FAILED, {
      retryable: isTransientStatus(response.status),
    })
  }
```

</details>

**依据 6 · 源码核查**：[src/web.ts:110-132](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/web.ts#L110-L132)

Web 凭据必需及重试边界

<details>
<summary>查看原文（23行）</summary>

```text
/** POST one credentialed JSON call and decode the reply, retrying one transient failure. */
async function postJson(
  options: OllamaWebProviderOptions,
  suffix: string,
  payload: unknown,
  signal: AbortSignal | undefined,
): Promise<{ status: number; body: unknown }> {
  const url = `${options.baseURL().replace(/\/+$/, '')}${suffix}`
  const apiKey = await options.resolveApiKey()
  if (apiKey === undefined) {
    throw new WebError(
      'ollama-cloud web capabilities need an API key; configure the credential reference through plugin settings',
      OLLAMA_WEB_MISSING_CREDENTIAL,
    )
  }
  try {
    return await postJsonAttempt(options, url, apiKey, payload, signal)
  } catch (error) {
    const retryable = error instanceof WebError
      && (error.code === OLLAMA_WEB_TIMEOUT || error.code === OLLAMA_WEB_TRANSPORT)
    if (!retryable || signal?.aborted === true) throw error
  }
  return postJsonAttempt(options, url, apiKey, payload, signal)
```

</details>

**依据 7 · 源码核查**：[src/web.ts:148-179](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/web.ts#L148-L179)

Web 跳转拒绝、错误分类

<details>
<summary>查看原文（32行）</summary>

```text
  let response: Response
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
        ...(options.attribution ?? attributionHeaders)(),
      },
      body: JSON.stringify(payload),
      redirect: 'error',
      signal,
    })
  } catch (error) {
    if (callerSignal?.aborted === true) {
      throw new WebError('ollama-cloud web request aborted by caller', 'ABORTED', { cause: error })
    }
    if (attempt.timedOut()) {
      throw new WebError(`ollama-cloud web request timed out after ${timeoutMs}ms`, OLLAMA_WEB_TIMEOUT, { cause: error })
    }
    if (isRedirectFailure(error)) {
      throw new WebError(`${url} attempted a redirect`, 'WEB_PROVIDER_ERROR', { cause: error })
    }
    const detail = error instanceof Error && error.message.length > 0 ? `: ${error.message}` : ''
    throw new WebError(`could not reach ${url}${detail}`, OLLAMA_WEB_TRANSPORT, { cause: error })
  }

  if (!response.ok) {
    await response.body?.cancel()
    const hint = response.status === 401 || response.status === 403 ? '; check the API key' : ''
    throw new WebError(`${url} answered ${response.status}${hint}`, 'WEB_PROVIDER_ERROR')
```

</details>

**依据 8 · 作者声明**：[README.md:184-193](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/README.md#L184-L193)

作者提供部署选择配置

<details>
<summary>查看原文（10行）</summary>

````text
The plugin registers Ollama's `/api/web_search` and `/api/web_fetch` as `ctx.web` providers — registering changes no deployment policy. To use them:

```yaml
- id: web
  config:
    searchProvider: ollama-cloud
    fetchProvider: ollama-cloud
```

Both share the route's credential reference and `baseURL`. Requests carry the credential, so **redirects fail closed**; each attempt has a 15-second budget and one retry on a transient pre-response transport failure.
````

</details>

#### 缺口

- 未检查目标部署的 connection RPC 与模型发现授权、隔离及出站限制，也未测用量数据和收费
  **影响**：无法判断谁可触发凭据发送或估算全周期费用
  **进一步探讨**：只用虚拟密钥与受控接收端验证不同角色及 URL，对模型发现的 tags/show 和用量 RPC 的 balance 分别核实草稿覆盖、显式密钥与回退、直接出站及重定向路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让用户更准确判断模型选择失败的原因？

**研究主题**：新假设与验证

#### 完整回答

可以把目录状态和凭据配置状态并列，但不能用一个健康标记合并。现在启动日志已有缓存来源和时间，RPC 也已提供 configured 与 writable，保留这些信息作为对照。新增假设是在模型选择时区分随包、缓存和本次发现状态，并对已列出但详情未读的模型解释原因。这样用户可分别决定是重刷目录、检查授权还是切换模型。用同一批用户随机比较当前界面与增量提示，注入过期缓存、详情超时、凭据缺失、有效配置但拒绝认证四种故障。记录首个正确动作、误配置及诊断时间。若错误动作和耗时无改善，或用户把已配置误当作已授权的比例升高，则不采用。该设计尚未实现或验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:326-340](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/index.ts#L326-L340)

已有启动端目录来源与时间提示

<details>
<summary>查看原文（15行）</summary>

```text
  // Say which catalog this session starts from. The cache is what makes the
  // first model list already the endpoint's last answer, so a failure to reach
  // the endpoint at mount is a delay, not a regression.
  const cached = catalog.cached()
  ctx.logger.info(
    cached === undefined
      ? 'llm-ollama-cloud: no cached catalog yet; serving the shipped snapshot until the endpoint answers'
      : `llm-ollama-cloud: serving the cached catalog of ${cached.endpoint}`
        + ` (${cached.models} models, fetched ${new Date(cached.fetchedAt).toISOString()})`,
  )

  if (config.autoRefresh.get()) {
    // Deliberately not awaited: a slow endpoint must not hold up the boot, and
    // the model list is already correct from the cache (or the snapshot).
    void refreshCatalog('mount')
```

</details>

**依据 2 · 源码核查**：[src/discovery.ts:301-325](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/discovery.ts#L301-L325)

目录有成员但详情缺失时仍保留 ID

<details>
<summary>查看原文（25行）</summary>

```text
  for (let start = 0; start < ids.length; start += DETAIL_CONCURRENCY) {
    const batch = ids.slice(start, start + DETAIL_CONCURRENCY)
    const details: DetailResult[] = await Promise.all(
      batch.map(async (id): Promise<DetailResult> => {
        try {
          const answer = await postJson(`${base}/show`, { model: id }, headers, deps, signal, timeoutMs)
          if (!answer.ok) return { id, missing: MISSING_STATUSES.has(answer.status) }
          return { id, entry: decodeShowResponse(id, answer.body), missing: false }
        } catch (error) {
          if (signal?.aborted === true) throw error
          return { id, missing: false }
        }
      }),
    )
    for (const detail of details) {
      if (detail.missing) continue
      if (detail.entry === undefined) {
        // No answer yet: the listing still says the model exists, so it is
        // served with only what the listing said.
        entries.push({ id: detail.id })
        continue
      }
      described.push(detail.id)
      entries.push(detail.entry)
    }
```

</details>

**依据 3 · 源码核查**：[src/rpc.ts:225-246](https://github.com/Asheblog/dsh-ollama-cloud/blob/d26c5fac1a66090f8de1dbd552e867287fa3eb5b/src/rpc.ts#L225-L246)

已配置、可写状态不同于端点授权

<details>
<summary>查看原文（22行）</summary>

```text
/** Answer `credential/status` for the configured route. */
async function credentialStatusReply(options: UsageRpcOptions): Promise<RpcSuccess<CredentialStatusValue>>
{
  const facts = options.connection()
  const reference = facts.apiKeyEnv
  let configured = false
  let writable = false
  const credentials = options.credentials()
  if (reference !== undefined && credentials !== undefined) {
    try {
      const info = await credentials.describe(credentialRef(reference))
      configured = info.configured === true
      writable = info.writable === true
    } catch {
      // A store that cannot answer leaves both facts false; the environment
      // check below still reports a configured value.
    }
  }
  if (!configured && reference !== undefined) {
    configured = (await options.resolveCredential(credentialRef(reference))) !== undefined
  }
  return { ok: true, value: { reference, configured, writable } }
```

</details>

#### 缺口

- 未对现有选择器做完整交互走查或用户对照
  **影响**：无法确定提示缺口是否已在其他宿主界面解决或是否降低误判
  **进一步探讨**：先复核宿主显示，再按故障矩阵随机对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
