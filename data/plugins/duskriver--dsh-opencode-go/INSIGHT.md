# dsh-opencode-go

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4e411b2](https://github.com/Duskriver/dsh-opencode-go/tree/4e411b2521c0f769551f2a6b6751643fe273ef6f)

<!-- BEGIN META -->
[![GitHub ★ 244](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=244&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Duskriver/dsh-opencode-go) [![npm 30d 6,010](https://img.shields.io/static/v1?label=npm+30d&message=6%2C010&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-go) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-go)
<!-- END META -->

> **功能**：为 DSH 接入 OpenCode Go 与 Free 模型，提供多账号管理、额度显示和本地用量估算。

> **亮点**：[Q01](#research-q01) 将两套模型来源放入独立路由，[Q02](#research-q02) 将部分凭据和额度拒绝的重试从手工配置移到请求开始阶段。

> **主要限制**：[Q02](#research-q02) 切换条件依赖已收到的块和用量，实际额度与可见输出不总是同步。[Q03](#research-q03) 本地费用估算还受历史记录和当前价格覆盖限制。

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
  - [Q01 · 双目录和请求头改变了哪些操作？](#detail-section-11)
  - [Q02 · 何时换号，何时必须停止？](#detail-section-12)
  - [Q03 · 本地看板的费用能解释什么？](#detail-section-13)
  - [Q04 · 如何低成本验证接入和退出？](#detail-section-14)
  - [Q05 · 如何帮助区分切换成功与额度代价？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 OpenCode Go 帐户，在 DSH 中重复进行多轮开发任务且希望管理额度的开发者。

使用原生接入、单账号与供应商页面查看额度，遇到限流后由用户判断是否手动切换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Go 与 Free 目录 | 按来源选择模型 | Go 需可用账号，Free 支持 public 回退 |
| 账号切换 | 在特定失败下继续尝试 | 尚未出块、尚未收到正用量，且有候选 |
| 额度与本地统计 | 观察使用量和估算开销 | 估算受宿主记录和目录价格限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 启动必需 | 宿主与客户端服务 | 保留原生路由 |
| 可用 Go 帐户 | 订阅路由必需 | 网关认证 | 不启用 Go 或查凭据 |
| 获授权备用账号 | 自动换号必需 | 处理可识别拒绝 | 保持单账号 |
| sessionQuery | 本地统计必需 | 读取历史记录 | 以供应商数据核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份配置并创建隔离 profile | 能恢复原路由 |
| 接入 | 操作者配测试账号、核对双目录 | 验证启停及密钥引用 |
| 演练 | 操作者模拟额度拒绝和出块后中断 | 只有符合条件的故障换号 |
| 复核 | 用户对照网关记录和界面 | 有异常时停用切换并恢复配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主及账户成本未知 | 版本、账号和配置核对 | 未实测接入时间 |
| 持续 | 模型调用及额度轮询 | 追踪切换和配置 | 实际账单未核对 |
| 失败恢复 | 备用请求可能产生费用 | 核查请求和密钥状态 | 补偿可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 双路由 | 宿主分别挂载与发现 | 网关模型实时可用性 |
| 有限自动切换 | 仅对指定错误且符合输出边界 | 不可见用量与账单 |
| 用量看板 | 缺价、截断与未扫描提示 | 历史实际费用与误差 |

> **思考**：[Q02](#research-q02) 切换条件依赖已收到的块和用量，实际额度与可见输出不总是同步。[Q03](#research-q03) 本地费用估算还受历史记录和当前价格覆盖限制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将两套模型来源放入独立路由，[Q02](#research-q02) 将部分凭据和额度拒绝的重试从手工配置移到请求开始阶段。

[Q02](#research-q02) 用代际与序号保护异步扶正，并按网关区分近期拒绝。[Q03](#research-q03) 统计将估算与覆盖诊断分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 切换条件依赖已收到的块和用量，实际额度与可见输出不总是同步。[Q03](#research-q03) 本地费用估算还受历史记录和当前价格覆盖限制。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在独立 profile 配置可撤销测试凭据。用固定文本任务核对 [Q02](#research-q02) 的换号边界及原生路由退出，再决定是否扩大使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖关键接线及代表失败分支。没有运行结果、真实账单、网关缓存收益或对照试验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/accounts.ts、src/adapter.ts、src/analytics.ts、src/client/index.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，抽读包声明、README、宿主入口、账号、请求、统计和客户端槽位。未运行安装、目标代码、网关或模型。
- 下一步：在获授权环境以固定请求对比正常、额度拒绝、已出块失败和凭据写入失败，检查账单与还原。

**分析版本**

- **仓库**：[Duskriver/dsh-opencode-go](https://github.com/Duskriver/dsh-opencode-go)
- **版本号**：0.2.0（[固定提交 4e411b2](https://github.com/Duskriver/dsh-opencode-go/tree/4e411b2521c0f769551f2a6b6751643fe273ef6f)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在换号提示上区分备选响应、完成及此前尝试费用未知，通过对照故障验证用户是否更能判断下一步。

在获授权环境以固定请求对比正常、额度拒绝、已出块失败和凭据写入失败，检查账单与还原。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1027 | — | — | 14956 |
| .js | source | 2 | 59446 | 54632 | 5298 | — |
| .mjs | source | 4 | 408 | 298 | 103 | — |
| .ts | source | 16 | 7032 | 5742 | 804 | — |
| .tsx | source | 3 | 2326 | 2012 | 243 | — |
| .tsx | test | 4 | 3442 | 2998 | 160 | — |
| .ts | test | 16 | 6463 | 5907 | 173 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/Duskriver/dsh-opencode-go/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：相对单账号手动选择，OpenCode Go 的多账号、目录和本地估算改变哪些宿主操作，又有哪些失败边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 双目录和请求头改变了哪些操作？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

已有 Go 帐户、常在 DSH 切换订阅与免费模型的开发者，可在宿主用独立目录选择服务来源。作者将 DSH 原生接入作为基本对话的替代。入口分别创建 Go 和 Free 适配器并为配置面注册发现。启用时 Free 可先挂载，Go 依赖至少一个可解析的密钥。Free 无可用候选凭据时可以使用 public 作为请求令牌。请求把会话标识同时送到 SDK 和 x-opencode-session。可直接用于头部的普通标识保留原值，其余经散列，无 ID 时按调用生成 UUID。这支持稳定的线路标识，但并不独立证明网关分流、缓存命中率或延迟变化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-27](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/README.md#L14-L27)

作者说明原生接入对照和双目录定位

<details>
<summary>查看原文（14行）</summary>

```text
为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 量身打造的 **OpenCode Go 专属接入与多账号管理插件**。

DSH 原生支持接入 OpenCode Go，但原生模式无法满足复杂的生产与日常开发需求（如多账号无感容灾、会话级 Prompt 缓存绑定、会话内实时额度透视等）。本插件基于 Cordis 微内核架构，在提供完整模型协议转换的同时，带来了流畅的客户端 UI 与企业级容灾体验。

---

## ✨ 核心特性

- 🆓 **双路由动态模型目录**：Go 与平台免费模型分别从各自网关的 `/models` 发现，保留同名模型；Free 无 Key 时可使用公共访问，两套模型开关与容量设置独立。
- 🛡️ **多账号无感容灾**：支持最多 20 个账号集中管理与拖拽排序。当主账号额度耗尽或 Key 失效时，**在输出前自动尝试备用账号**，成功后自动扶正，告别“聊到一半额度没了”的打断感。
- ⚡ **会话级 Prompt 缓存绑定**：严格遵循网关协议注入专有 `x-opencode-session` 路由头，稳定复用网关上下文缓存，显著降低响应首字延迟。
- 📊 **会话内额度实时透视**：在聊天输入框旁常驻“用量胶囊”，直观展示 5 小时滚动、每周、每月的额度百分比及重置时间倒计时；支持休眠节能与静默刷新。
- 💰 **本地用量看板**：在本地扫描会话历史，按模型与峰谷时段统计 Token 消耗与估算开销，不上传统计所用的会话内容；模型和价格元数据从 OpenCode /models 联网刷新。
- 🎛️ **模型与热配置**：无需重启 DSH！随时在线调整模型上下文窗口、最大输出上限、思考预算（Thinking Budget），并支持 HTTP/HTTPS/SOCKS5 代理。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:160-174](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/index.ts#L160-L174)

两套目录与两套适配器分开

<details>
<summary>查看原文（15行）</summary>

```text
  const adapter = new OpencodeGoAdapter({ ...adapterOptions, catalog: config => catalogs.forConfig(config) })
  const freeAdapter = new OpencodeGoAdapter({ ...adapterOptions, source: 'free', catalog: config => catalogs.forConfig(config, 'free') })
  ctx.plugin(GoModelsService, {
    catalog: () => catalogs.forConfig(current()),
    freeCatalog: () => catalogs.forConfig(current(), 'free'),
    onRefresh: refreshPickers,
  })
  const sessionQueryOf = (): AnalyticsSessionQuery | undefined =>
    (ctx as unknown as { get(name: string): unknown }).get('sessionQuery') as AnalyticsSessionQuery | undefined
  ctx.plugin(GoAnalyticsService, {
    query: sessionQueryOf,
    pricing: async () => analyticsPriceBook(...await Promise.all([
      catalogs.forConfig(current()).snapshot(), catalogs.forConfig(current(), 'free').snapshot(),
    ])),
  })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:219-257](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/index.ts#L219-L257)

Free 启用和 Go 凭据门控

<details>
<summary>查看原文（39行）</summary>

```text
    const refs = accountsOf(config).map(account => account.apiKeyEnv)
    // Free is available immediately, including while credential storage is resolving.
    if (!config.enabled) { applyRoute(false); return }
    if (!freeRegistration) {
      try { freeRegistration = ctx.llm.registerAdapter([FREE_PROVIDER_ID], freeAdapter) }
      catch (error) { ctx.logger.error(`llm-opencode-go: not registering the "${FREE_PROVIDER_ID}" route (${String(error)})`) }
    }
    if (credentials === undefined) {
      applyRoute(refs.some(ref => {
        const value = launchEnvironmentOf(ctx).get(ref)?.value
        if (!value) return false
        try { return Boolean(assertUsableApiKey(value, name, ref)) } catch { return false }
      }))
      return
    }
    const checkCredential = async (ref: string): Promise<boolean> => {
      const info = await credentials.describe(credentialRef(ref))
      if (!info.configured) return false
      try { return Boolean(await resolveApiKey({ ...config, apiKeyEnv: ref })) }
      catch (error) {
        if (error instanceof LlmError && ['MISSING_CREDENTIAL', 'INVALID_CREDENTIAL'].includes(error.code)) return false
        throw error
      }
    }
    // One pending/unreadable account must not prevent another usable key from
    // activating Go. Only a completed, successful check of every account can
    // establish that no key is configured.
    let remaining = refs.length, usable = false, failed = false
    if (remaining === 0) applyRoute(false)
    for (const ref of refs) void checkCredential(ref).then(configured => {
      if (check !== routeCheck) return
      usable ||= configured
      if (usable) applyRoute(true)
    }).catch((error: unknown) => {
      failed = true
      if (check === routeCheck) ctx.logger.error(`llm-opencode-go: credential check failed; keeping the previous route state (${String(error)})`)
    }).finally(() => {
      remaining--
      if (remaining === 0 && check === routeCheck && !usable && !failed) applyRoute(false)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:260-273](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/index.ts#L260-L273)

宿主配置发现选用对应目录

<details>
<summary>查看原文（14行）</summary>

```text
  syncRoute()
  let undiscover: () => void = () => {}
  try {
    undiscover = ctx.llm.registerModelDiscovery(name, async (request: LlmModelDiscoveryRequest) => {
      if (request.provider !== PROVIDER_ID && request.provider !== FREE_PROVIDER_ID
        && !isOfficialEndpoint(request.baseURL)) {
        throw new LlmError(
          'llm-opencode-go discovers only OpenCode Go and Free endpoints; enter this provider\'s models by hand',
          'DISCOVERY_UNSUPPORTED',
        )
      }
      const source = request.provider === FREE_PROVIDER_ID || request.provider !== PROVIDER_ID
        && request.baseURL !== undefined && !new URL(request.baseURL).pathname.includes('/go/') ? 'free' : 'go'
      return discoverCatalogModels(catalogs.forConfig(current(), source))
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:542-547](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L542-L547)

无可用候选的 Free 路径

```text
    const candidates = this.accountCandidates(snapshot.config, ordered, usable, options.signal)
    let candidate = await candidates.next()
    if (candidate.done) {
      if (this.source === 'free') yield* this.requestExecutor.stream(options, { config: snapshot.config, model: snapshot.model,
        provider: snapshot.catalog.provider, sessionId: snapshot.sessionId, apiKey: 'public' })
      return
```

**依据 6 · 源码核查**：[src/adapter.ts:183-203](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L183-L203)

会话头实际发给协议 SDK

<details>
<summary>查看原文（21行）</summary>

```text
      const reasoningOptions = reasoningRequest(reasoningIntent(model, reasoning))
      const events = provider.streamSimple(model, normalizeContext(context), {
        apiKey,
        fetch: diagnostics.fetch,
        ...reasoningOptions,
        ...options.temperature === undefined ? {} : { temperature: options.temperature },
        ...maxTokens === undefined ? {} : { maxTokens },
        sessionId,
        signal: watchdog.signal,
        // Harness-owned request identity: the gateway refuses requests without
        // `x-opencode-session` and profiles clients by User-Agent, and
        // attribution merges last in pi-ai's client.
        headers: {
          'x-opencode-session': sessionId,
          ...model.source === 'free' ? { authorization: `Bearer ${apiKey}` } : {},
          ...attributionHeaders(),
        },
        // The agent recovery layer owns visible attempts; one adapter call is
        // one SDK attempt.
        maxRetries: 0,
      })
```

</details>

**依据 7 · 源码核查**：[src/adapter.ts:341-350](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L341-L350)

标识原样、散列或随机的条件

<details>
<summary>查看原文（10行）</summary>

```text
 * other non-empty string without trimming or Unicode normalization, so special
 * IDs survive HTTP serialization without merging distinct conversations.
 * UTF-16LE preserves lone surrogates too; base64url keeps the result under the
 * SDK's 64-character prompt-cache-key limit. Missing IDs get a per-call UUID.
 */
function opencodeSessionValue(sessionId: string | undefined): string {
  if (sessionId === undefined || sessionId.length === 0) return randomUUID()
  if (!/[^\x21-\x7e]/.test(sessionId) && !sessionId.startsWith(SESSION_HEADER_PREFIX)) return sessionId
  return SESSION_HEADER_PREFIX + createHash('sha256').update(sessionId, 'utf16le').digest('base64url')
}
```

</details>

#### 缺口

- 网关未实际调用，DSH 原生接入没有逐项对照
  **影响**：只能说明插件自身路径与作者给出的基线，不能评估缓存收益
  **进一步探讨**：在授权账户比较相同模型与对话的首包时间、缓存用量和任务完成

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 何时换号，何时必须停止？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

同一逻辑调用复用会话 ID，并受整个请求的截止时间约束。启用自动换号且还有候选时，适配器只在尚未向上交付非用量块、没收到正总 token 用量、未取消时，对凭据、限流及额度错误尝试下一账号。它缓冲用量块，因此用量可以先阻止切换再交付。对已拒绝的键按网关跳过冷却，但 Go 全在冷却时仍会回到原候选。备选一旦产生非用量块或符合终止类型即可通知结算，通知并不保证最后完成任务。账号管理器另用序列和配置代际确认仍可扶正，设置写入也可能失败。网关可能已经收到或计费而未返回用量，源码的防重边界基于本地可观察状态，不能推导账单恰好一次。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:492-512](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L492-L512)

同一截止时间与会话标识覆盖账号尝试

<details>
<summary>查看原文（21行）</summary>

```text
  private async *dispatch(options: GenerateOptions, seq: number, prepared?: OpencodeGoCallSnapshot): AsyncIterable<StreamChunk> {
    const captured = prepared ?? { generation: this.options.accountGeneration?.() ?? 0, config: structuredClone(this.options.config()) }
    const sessionId = opencodeSessionValue(options.sessionId === undefined ? undefined : String(options.sessionId))
    using whole = deadline(options.signal, captured.config.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS, 'LLM_REQUEST_TIMEOUT')
    try {
      const snapshot = prepared ?? {
        generation: captured.generation,
        ...await this.modelSnapshot(options.model, whole.signal, captured.config),
      }
      for await (const chunk of this.streamAccounts({ ...options, signal: whole.signal }, { ...snapshot, sessionId }, seq)) {
        yield chunk
      }
    } catch (error) {
      if (timeoutOf(whole.signal, 'LLM_REQUEST_TIMEOUT')) {
        throw new LlmError('opencode-go whole request timeout', 'TIMEOUT', { cause: error })
      }
      if (options.signal?.aborted) {
        yield { type: 'finish', reason: { kind: 'aborted', failure: { code: 'ABORTED', message: 'opencode-go request aborted by caller' } } }
        return
      }
      throw error
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:53-68](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/accounts.ts#L53-L68)

可重试分类与禁止条件

<details>
<summary>查看原文（16行）</summary>

```text
/** Switching accounts must never replay output or already charged work. */
export function accountFallback(outcome: AttemptOutcome): GoAccountSwitch['reason'] | undefined {
  if (outcome.emitted || outcome.totalTokens > 0 || outcome.aborted || !outcome.hasNext) return undefined
  switch (outcome.failure?.code) {
    case 'RATE_LIMIT':
    case 'QUOTA': return 'quota'
    case 'AUTH':
    case 'MISSING_CREDENTIAL':
    case 'INVALID_CREDENTIAL': return 'credential'
    default: return undefined
  }
}

/** Gateway credential, rate and quota failures cool down this account for five minutes. */
export function isGatewayKeyRejection(failure: { code: string }): boolean {
  return ['INVALID_CREDENTIAL', 'AUTH', 'RATE_LIMIT', 'QUOTA'].includes(failure.code)
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:516-540](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L516-L540)

按网关筛选及配置决定候选

<details>
<summary>查看原文（25行）</summary>

```text
  private async *streamAccounts(options: GenerateOptions, snapshot: OpencodeGoDispatchSnapshot, seq: number): AsyncIterable<StreamChunk> {
    const accounts = accountsOf(snapshot.config)
    if (this.source === 'go' && accounts.length === 0) throw new LlmError('OpenCode Go has no accounts', 'MISSING_CREDENTIAL')
    // The preferred reference resolves through accountRefOf: an empty string
    // keeps the default reference's semantics rather than naming no account.
    const preferred = accountRefOf(snapshot.config)
    const ordered = this.source === 'free' ? accounts.map(account => account.apiKeyEnv)
      : snapshot.config.autoSwitch ? [...new Set([preferred, ...accounts.map(account => account.apiKeyEnv)])] : [preferred]
    // Keys the gateway rejected lately are skipped for a bounded window:
    // re-sending a full transcript to a rejected key is pure waste. If every
    // candidate is in that window the original order stands, so the gateway's
    // own error — not a synthetic local one — reaches the caller.
    const now = Date.now()
    const gateway = assertBaseURL(this.source === 'go' ? snapshot.config.baseURL : snapshot.config.freeBaseURL,
      this.source === 'go' ? 'baseURL' : 'freeBaseURL')
    const usable = ordered.filter(ref => {
      const rejected = this.rejectedKeys.get(ref)
      const until = rejected?.get(gateway)
      if (until === undefined) return true
      if (now >= until) {
        rejected!.delete(gateway)
        if (rejected!.size === 0) this.rejectedKeys.delete(ref)
        return true
      }
      return false
```

</details>

**依据 4 · 源码核查**：[src/adapter.ts:552-604](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L552-L604)

缓冲用量、换号与首次响应通知

<details>
<summary>查看原文（53行）</summary>

```text
      const { ref, apiKey, credentialVersion, skippedRef } = candidate.value
      let emitted = false
      let usage: Extract<StreamChunk, { type: 'usage' }> | undefined
      let retry = false
      const retryFailure = async (failure: { code: string } | undefined): Promise<boolean> => {
        const reason = accountFallback({ failure, emitted, totalTokens: usage?.usage.totalTokens ?? 0,
          aborted: options.signal?.aborted === true, hasNext: snapshot.config.autoSwitch === true })
        if (!emitted && !options.signal?.aborted && !usage?.usage.totalTokens && failure && isGatewayKeyRejection(failure)
          && credentialVersion === (this.credentialVersions.get(ref) ?? 0)) this.rememberRejectedKey(ref, gateway)
        if (!reason || !failure) return false
        const next = await candidates.next()
        if (next.done) return false
        switchReason ??= reason
        failedRef ??= ref
        candidate = next
        return true
      }
      const announce = (): void => {
        if (emitted) return
        const serving = ref
        const replaced = failedRef ?? skippedRef ?? preferred
        const notice: GoAccountSwitch | undefined = serving === preferred ? undefined : {
          // The notice names the account the journey left: the first one that
          // failed this request, else the first one skipped for a remembered
          // rejection.
          fromRef: replaced,
          toRef: serving,
          reason: switchReason ?? 'credential',
          at: Date.now(),
        }
        this.options.onAccountSettled?.({ seq, generation: snapshot.generation, config: snapshot.config, ref: serving, notice })
        this.options.onAccountSwitch?.(notice, snapshot.config, seq)
      }
      try {
        for await (const chunk of this.requestExecutor.stream(options, {
          config: { ...snapshot.config, apiKeyEnv: ref },
          model: snapshot.model, provider: snapshot.catalog.provider, sessionId: snapshot.sessionId,
          ...apiKey === undefined ? {} : { apiKey },
        })) {
          if (chunk.type === 'usage') { usage = chunk; continue }
          if (chunk.type === 'finish') {
            const failure = chunk.reason.kind === 'error' ? chunk.reason.failure : undefined
            if (await retryFailure(failure)) { retry = true; break }
            if (chunk.reason.kind === 'stop' || chunk.reason.kind === 'tool-calls' || chunk.reason.kind === 'max-tokens') announce()
            if (usage) yield usage
            yield chunk
            return
          }
          announce()
          emitted = true
          yield chunk
        }
        if (!retry) return
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:611-617](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L611-L617)

Go 冷却全部命中时回退原序

```text
  /** Resolve Free keys only when selecting an account or retrying a failed attempt. */
  private async *accountCandidates(config: OpencodeGoConfig, ordered: readonly string[], usable: readonly string[], signal?: AbortSignal): AsyncGenerator<AccountCandidate> {
    if (this.source === 'go') {
      const refs = usable.length > 0 ? usable : ordered
      const skippedRef = ordered.find(ref => !refs.includes(ref))
      for (const ref of refs) yield { ref, skippedRef, credentialVersion: this.credentialVersions.get(ref) ?? 0 }
      return
```

**依据 6 · 源码核查**：[src/accounts.ts:240-253](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/accounts.ts#L240-L253)

防过期状态写回及写失败路径

<details>
<summary>查看原文（14行）</summary>

```text
    this.latestSeq = event.seq
    this.notice = event.notice
    if (!event.notice || !event.config.enabled || !event.config.autoSwitch) return
    void this.enqueue(async () => {
      const connection = this.connection
      if (!connection || event.generation !== this.capture() || event.seq !== this.latestSeq) return
      try {
        const accounts = [...moveAccountFirst(accountsOf(this.read(connection).value), event.ref)]
        await this.write(connection, { accounts, apiKeyEnv: event.ref })
        this.capture()
        if (this.connection === connection && event.seq === this.latestSeq && accountRefOf(this.config()) === event.ref) this.notice = event.notice
      } catch {
        this.logger.warn(`llm-opencode-go: could not make "${event.ref}" the current account`)
      }
```

</details>

#### 缺口

- 未观测账单、重试同时发生或传输在提交后失败的实际结果
  **影响**：不能保证无重复额度消耗或服务不间断
  **进一步探讨**：在可控网关注入 429、输出后故障、用量后失败及并发换号，核对请求次数、前端提示与账号顺序

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地看板的费用能解释什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

统计依赖宿主的 sessionQuery，通过两份模型目录取价格。会话材料折叠时，Go、Free 及指定截止前的旧路由按规则归属。已经存在用量且目录有价的请求才贡献估算，缺用量与缺价单列，汇总提供失败、截断和未扫描会话。由此可查一段会话范围内的模型用量分布和估算成本，但目前目录价格可能不同于历史生效价格，截断会漏掉记录。作者称会话内容不为统计上传，关键接线将本地查询与模型目录定价拆开，实际网络和宿主读取权限仍待验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-96](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/README.md#L91-L96)

作者说明本地统计及联网目录价格

```text
### 3. 用量与开销看板（Analytics）

点击用量面板底部的 **用量统计**，或进入 **设置 → OpenCode Go → 用量统计** 即可唤出看板：

- **本地扫描与缓存**：直接调用 DSH 宿主 `sessionQuery` 扫描本地历史会话，统计本插件产生的 Token 消耗，不会为统计上传会话内容。模型和价格元数据会从 OpenCode /models 联网刷新。会话折叠结果仅在内存中最多复用 5 秒，重启后重新扫描，不写入磁盘缓存。
- **峰谷电价式开销估算**：使用两个网关目录的文本及上下文阶梯价格，动态计算 `cost.multipliers` 声明的 UTC 工作日、时段或日期倍率；Go 与 Free 的同名模型分别统计。
```

**依据 2 · 源码核查**：[src/index.ts:167-174](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/index.ts#L167-L174)

sessionQuery 与两目录价格接线

```text
  const sessionQueryOf = (): AnalyticsSessionQuery | undefined =>
    (ctx as unknown as { get(name: string): unknown }).get('sessionQuery') as AnalyticsSessionQuery | undefined
  ctx.plugin(GoAnalyticsService, {
    query: sessionQueryOf,
    pricing: async () => analyticsPriceBook(...await Promise.all([
      catalogs.forConfig(current()).snapshot(), catalogs.forConfig(current(), 'free').snapshot(),
    ])),
  })
```

**依据 3 · 源码核查**：[src/analytics.ts:247-250](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/analytics.ts#L247-L250)

路由归属

```text
export function isPluginRoute(provider: unknown, at: number, cutoff = LEGACY_ROUTE_CUTOFF_MS): boolean {
  return provider === PROVIDER_ID || provider === FREE_PROVIDER_ID || provider === LEGACY_PROVIDER_ID && at < cutoff
}

```

**依据 4 · 源码核查**：[src/analytics.ts:982-1012](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/analytics.ts#L982-L1012)

缺用量、缺价与有价估算分开

<details>
<summary>查看原文（31行）</summary>

```text
        if (fact.legacy) legacyRequests++
        let tokens = 0
        let micro = 0
        if (fact.missingUsage) {
          totals.missingUsage++
          row.missingUsage++
        } else {
          tokens = fact.input + fact.output + fact.cacheRead + fact.cacheWrite
          totals.inputTokens += fact.input
          totals.outputTokens += fact.output
          totals.cacheReadTokens += fact.cacheRead
          totals.cacheWriteTokens += fact.cacheWrite
          row.inputTokens += fact.input
          row.outputTokens += fact.output
          row.cacheReadTokens += fact.cacheRead
          row.cacheWriteTokens += fact.cacheWrite
          const cost = priceBook?.models.get(model)?.cost
          if (cost === undefined) {
            totals.unpricedRequests++
            row.unpricedRequests++
            // P15: the models that actually appeared belong in the list even
            // when the whole table was unavailable — an empty list next to
            // unpricedRequests > 0 must mean "everything was priced or free".
            unpriced.add(model)
          } else {
            micro = priceUsage(model, factUsage(fact), cost, fact.at)
            totals.estimatedMicroUsd += micro
            totals.pricedRequests++
            row.estimatedMicroUsd += micro
            row.pricedRequests++
          }
```

</details>

**依据 5 · 源码核查**：[src/analytics.ts:1082-1109](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/analytics.ts#L1082-L1109)

覆盖诊断与价格来源

<details>
<summary>查看原文（28行）</summary>

```text
        matchedSessions,
        failedSessions: failed,
        eventsScanned: events,
        summaries: totals.summaries,
        legacyRequests,
        missingUsage: totals.missingUsage,
        truncated,
        ...(truncation === undefined ? {} : { truncation }),
        scanMs,
        ...(zone.fallback ? { timeZoneFallback: true as const } : {}),
        // P16/P18/M1: sessions listed but never scanned — the slice cap or a
        // budget stopped first. Observability only: this never implies the
        // range was covered.
        unreadSessions: Math.max(0, listed.length - scanned),
        // P3/S1: entries the end-of-run trim dropped; they were counted in
        // this report from run-local results, but the next run re-reads them.
        evictedSessions,
        // P12: unattributed model calls in range, counted for visibility only.
        unattributedRequests,
        // S6: segmented timing (list / scan / pricing).
        listMs,
        pricingMs,
      },
      pricing: {
        source: 'OpenCode /models',
        ...(priceBook?.updatedAt === undefined ? {} : { updatedAt: priceBook.updatedAt }),
        ...(pricingUnavailable ? { unavailable: true as const } : {}),
        unpricedModels: [...unpriced].sort().slice(0, 64),
```

</details>

#### 缺口

- 未用已知会话和供应商账单校准覆盖和估算
  **影响**：无法计算误差、扫描时长或真实账单
  **进一步探讨**：以带旧价格与缺失用量的固定记录核对展示，对照获授权账单解释偏差

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低成本验证接入和退出？

**研究主题**：依赖、兼容与流程、采用判断、效果与总成本

#### 完整回答

包声明 Node 22.19 起的 22 系列或 24 及以上，DSH 下限 0.2.1-rc.5，分发主入口、浏览器入口和组合补丁。账号写入依赖宿主 settings 与 credentials，额度和设置通过插件远端服务接入。添加先写密钥再写账号元数据，失败时尝试清理，删除失败则在特定条件下尝试恢复旧值，两条补偿均可失败并记录警告。故应先在隔离配置用可撤销的测试账号确认密钥引用和停止切换的退路，再进行带限额的真实请求。退出时恢复原生路由，检查残留的配置和专用测试密钥，遇到未知结果先读回状态。费用与耗时无法从包声明量化。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:16-31](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/package.json#L16-L31)

版本下限与主、客户端入口

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.5"
  },
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:41-53](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/package.json#L41-L53)

宿主组合和浏览器依赖

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-model-selection"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:105-119](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/index.ts#L105-L119)

设置、凭据及额度服务接线

<details>
<summary>查看原文（15行）</summary>

```text
  const accountManager = new GoAccountManager(current, ctx.logger)
  ctx.plugin(GoAccountsService, { manager: accountManager })
  ctx.inject(['settings', 'credentials'], ready => {
    ready.effect(() => accountManager.connect(ready.settings, ready.credentials))
  })
  const transport = new ProxyTransport()
  ctx.effect(() => () => transport.dispose())
  ctx.plugin(GoUsageService, {
    baseURL: () => current().baseURL,
    proxyURL: () => current().proxyURL,
    transport,
    resolveApiKey: (ref?: string) => resolveApiKey({ ...current(), apiKeyEnv: ref ?? current().apiKeyEnv }),
    activeRef: () => accountRefOf(current()),
    accountRefs: () => accountsOf(current()).map(account => account.apiKeyEnv),
    lastSwitch: () => accountManager.lastSwitch(),
```

</details>

**依据 4 · 源码核查**：[src/accounts.ts:145-174](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/accounts.ts#L145-L174)

新增凭据与元数据的补偿顺序

<details>
<summary>查看原文（30行）</summary>

```text
    let value = this.read(connection).value
    if (command.kind === 'auto-switch') return this.write(connection, { autoSwitch: command.value })
    if (command.kind === 'add') {
      const ref = ACCOUNT_REF_PREFIX + command.id.toUpperCase()
      if (value.accounts?.some(account => account.id === command.id && account.apiKeyEnv === ref)) return 'applied'
      const previousRef = accountRefOf(value)
      let accounts = [...accountsOf(value)]
      const configured = await Promise.all(accounts.map(account => credentials.describe(credentialRef(account.apiKeyEnv))))
      // The implicit environment reference remains usable for existing profiles.
      // Do not create an empty row for it when adding the first real account.
      if (value.accounts == null) accounts = accounts.filter((account, index) => account.name || configured[index]?.configured)
      if (accounts.length >= MAX_ACCOUNTS || accounts.some(account => account.id === command.id || account.apiKeyEnv === ref)) return 'rejected'
      await credentials.set(credentialRef(ref), command.key.trim())
      try {
        value = this.read(connection).value
        const retained = accountsOf(value).filter(account => value.accounts != null || account.name || accounts.some(saved => saved.apiKeyEnv === account.apiKeyEnv))
        if (retained.length >= MAX_ACCOUNTS || retained.some(account => account.id === command.id || account.apiKeyEnv === ref)) {
          throw new Error('Account list changed while storing the credential')
        }
        const added = { id: command.id, name: command.name.trim(), apiKeyEnv: ref }
        const selected = accountRefOf(value) === previousRef && configured.every(info => !info.configured) ? ref : accountRefOf(value)
        const next = [...moveAccountFirst([...retained, added], selected)]
        return await this.write(connection, { accounts: next, apiKeyEnv: next[0]!.apiKeyEnv })
      } catch (error) {
        // A refused metadata write must not leave the new secret behind.
        await credentials.unset(credentialRef(ref)).catch(() => {
          this.logger.warn('llm-opencode-go: could not clean up an unused account credential')
        })
        throw error
      }
```

</details>

**依据 5 · 源码核查**：[src/accounts.ts:185-203](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/accounts.ts#L185-L203)

删除失败时按条件恢复

<details>
<summary>查看原文（19行）</summary>

```text
    if (command.kind === 'remove') {
      let previous: Awaited<ReturnType<AccountCredentials['resolve']>>
      if (ownsAccountCredential(account)) {
        const info = await credentials.describe(credentialRef(command.ref))
        if (info.configured && !info.writable) return 'rejected'
        previous = await credentials.resolve(credentialRef(command.ref))
        if (!accountsOf(this.read(connection).value).some(entry => entry.id === account.id && entry.apiKeyEnv === command.ref)) return 'rejected'
        if (info.configured) await credentials.unset(credentialRef(command.ref))
      }
      try {
        value = this.read(connection).value
        const accounts = accountsOf(value).filter(entry => entry.apiKeyEnv !== command.ref)
        return await this.write(connection, { accounts: [...accounts], apiKeyEnv: accounts[0]?.apiKeyEnv ?? accountRefOf(value) })
      } catch (error) {
        if (previous && this.connection === connection && accountsOf(this.read(connection).value).some(entry => entry.id === account.id && entry.apiKeyEnv === command.ref)) await credentials.set(credentialRef(command.ref), previous.value).catch(() => {
          this.logger.warn('llm-opencode-go: could not restore an account credential after a refused removal')
        })
        throw error
      }
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:140-171](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/client/index.ts#L140-L171)

用量胶囊的客户端槽位挂载

<details>
<summary>查看原文（32行）</summary>

```text
export function registerUsagePill(ctx: Context, settings: ConfigForm<OpencodeGoSettings>, selectAccount?: (ref: string) => Promise<boolean>): void {
  ctx.inject(['modelDirectories', 'sessions', 'remote.session'], scope => {
    scope.inject(['remote.opencodeGoUsage'], ready => {
      const credentialChanges = createSnapshotStore(0)
      ready.effect(() => ready.remote.$on('credentials/reference-updated', ref => {
        if (accountsOf(settings.getSnapshot().value ?? {}).some(account => account.apiKeyEnv === ref)) {
          credentialChanges.set(credentialChanges.getSnapshot() + 1)
        }
      }))
      const readUsage = async () => {
        const result = await ready.remote.opencodeGoUsage.read()
        if (!result.ok) throw result.error
        return result.value
      }
      // Keep the quota pill available while the analytics namespace activates.
      // Cancellation is injected by the descriptor, outside the wire arguments.
      let analytics: ((query: AnalyticsQuery, signal?: AbortSignal) => Promise<AnalyticsReport>) | undefined
      scope.inject(['remote.opencodeGoAnalytics'], withAnalytics => {
        analytics = async (query, signal) => {
          const result = await withAnalytics.remote.opencodeGoAnalytics.read(query, signal)
          if (!result.ok) throw result.error
          return result.value
        }
      })
      const readAnalytics = async (query: AnalyticsQuery, signal?: AbortSignal): Promise<AnalyticsReport> => {
        if (analytics === undefined) throw Object.assign(new Error('OpenCode Go analytics is unavailable in this session'), {
          code: 'opencode-go/analytics-unavailable', details: { reason: 'no-session-query', retryable: false },
        })
        return analytics(query, signal)
      }
      const translate = ready.locale.bind('settings.opencode-go')
      ready.slots.inject('conversation.input.right', () => ready.slots.register({
```

</details>

#### 缺口

- 本轮未验证目标宿主启动、写入失败恢复或禁用
  **影响**：真实负担、残留和配置兼容性未知
  **进一步探讨**：独立 profile 先验证读回、故障恢复与禁用，确认后再核对真实额度

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助区分切换成功与额度代价？

**研究主题**：新假设与验证

#### 完整回答

现有额度读接口已经返回最近一次切换，统计也识别无可见消息的尝试，但两者未在所检路径中给出一次请求的备选尝试覆盖和计费确定性。可以在切换提示中区分备用账号已开始响应、该请求已完成、此前尝试费用未知，按请求状态显示而非累计隐藏。提示不展示凭据和会话内容。用同一组人对照现有提示与扩展提示，模拟额度拒绝、备用先出块后中断、服务端消耗而未返回用量。若用户对是否重试或停止的正确决策没有增加，或者信息噪声造成误判，则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:569-603](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/adapter.ts#L569-L603)

通知与后续结束边界

<details>
<summary>查看原文（35行）</summary>

```text
      const announce = (): void => {
        if (emitted) return
        const serving = ref
        const replaced = failedRef ?? skippedRef ?? preferred
        const notice: GoAccountSwitch | undefined = serving === preferred ? undefined : {
          // The notice names the account the journey left: the first one that
          // failed this request, else the first one skipped for a remembered
          // rejection.
          fromRef: replaced,
          toRef: serving,
          reason: switchReason ?? 'credential',
          at: Date.now(),
        }
        this.options.onAccountSettled?.({ seq, generation: snapshot.generation, config: snapshot.config, ref: serving, notice })
        this.options.onAccountSwitch?.(notice, snapshot.config, seq)
      }
      try {
        for await (const chunk of this.requestExecutor.stream(options, {
          config: { ...snapshot.config, apiKeyEnv: ref },
          model: snapshot.model, provider: snapshot.catalog.provider, sessionId: snapshot.sessionId,
          ...apiKey === undefined ? {} : { apiKey },
        })) {
          if (chunk.type === 'usage') { usage = chunk; continue }
          if (chunk.type === 'finish') {
            const failure = chunk.reason.kind === 'error' ? chunk.reason.failure : undefined
            if (await retryFailure(failure)) { retry = true; break }
            if (chunk.reason.kind === 'stop' || chunk.reason.kind === 'tool-calls' || chunk.reason.kind === 'max-tokens') announce()
            if (usage) yield usage
            yield chunk
            return
          }
          announce()
          emitted = true
          yield chunk
        }
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:293-304](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/accounts.ts#L293-L304)

用量读已附最近切换状态

<details>
<summary>查看原文（12行）</summary>

```text
  async read(): Promise<GoUsage> {
    try {
      const usage = await this.readRef(this.options.activeRef?.())
      const lastSwitch = this.options.lastSwitch?.()
      return lastSwitch ? { ...usage, lastSwitch } : usage
    } catch (error) {
      const lastSwitch = this.options.lastSwitch?.()
      if (lastSwitch && error instanceof RemoteError && error.code === 'opencode-go/usage-unavailable') {
        throw new RemoteError('opencode-go/usage-unavailable', error.message,
          { ...error.details as { retryable: boolean; retainPrevious: boolean; source?: string }, lastSwitch }, { cause: error })
      }
      throw error
```

</details>

**依据 3 · 源码核查**：[src/analytics.ts:343-362](https://github.com/Duskriver/dsh-opencode-go/blob/4e411b2521c0f769551f2a6b6751643fe273ef6f/src/analytics.ts#L343-L362)

统计中已有未提交可见消息的尝试类别

<details>
<summary>查看原文（20行）</summary>

```text
    if (event.type === 'assistant/attempt') {
      // Contract: the host defines assistant/attempt as one model attempt that
      // "committed no surface message" (dsh-session lib/types/types.d.ts:318-327;
      // shape {turn, step, stream} — no usage, no message), so every settled
      // model call surfaces as either an assistant/message or an
      // assistant/attempt, never both. We collect unconditionally and do not
      // de-duplicate against facts: a double count would require the host to
      // violate its own contract, and silently dropping one side would hide
      // exactly that violation.
      const at = stepStarts.get(stepKey(data) ?? '') ?? lastStart ?? eventTime
      if (at === undefined) continue
      // A headless attempt cannot be attributed to a route, but it must not
      // vanish without a trace (review U14 / P12 scan half): record its time
      // as unattributed instead of an attempt.
      if (header === undefined) { unattributed.push(at); continue }
      if (isPluginRoute(header.provider, at, cutoff)) attempts.push(at)
    }
  }

  return { facts, attempts, unattributed, events: ownEvents }
```

</details>

#### 缺口

- 未穷尽客户端展示且未做用户对照
  **影响**：不能确认增量界面的需求及收益
  **进一步探讨**：先复核现有提示，再随机对照计量正确决策、误判率和处理时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
