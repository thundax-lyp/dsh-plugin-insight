# DSH WorkBuddy Bridge

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a9d9b9c](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/tree/a9d9b9c669649445ef14fddf8c74367b23ef7d9c)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge) [![npm 30d 7,670](https://img.shields.io/static/v1?label=npm+30d&message=7%2C670&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbuddy-bridge) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbuddy-bridge)
<!-- END META -->

> **功能**：将已登录的 WorkBuddy 桌面模型接入 DSH，并展示模型能力检测和积分。

> **亮点**：把两种 WorkBuddy 产品的登录态、模型目录和回环适配接到 DSH，并尝试将上游实际积分关联到消息。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：桌面登录与插件刷新副本都能影响实际凭据。上游协议及积分回执变化会影响可用性和账户判断。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · DSH 选中模型后怎样使用 WorkBuddy？](#detail-section-11)
  - [Q02 · 桌面登录、缓存刷新和账号切换如何区分？](#detail-section-12)
  - [Q03 · 手动检测与单消息积分能够证明什么？](#detail-section-13)
  - [Q04 · 怎样决定是否在日常工作里采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本人 WorkBuddy 登录、希望继续在 DSH 会话使用相应模型的个人。见 [Q01](#research-q01)。

直接在 WorkBuddy 使用原生客户端可沿其自身登录和费用显示。桥接允许保留 DSH 的会话和选择流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| WorkBuddy 模型接入 | 在 DSH 选择并调用模型 | 依赖已登录的对应账户 |
| 模型档位探测 | 核上游是否接收指定参数 | 需明确确认，可能消耗积分 |
| 消息积分显示 | 关联上游结果与宿主消息 | 需要有效响应 ID 和积分事件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、LLM 适配服务 | 接入需要 | 提供模型目录及会话 | 核适配器与宿主版本 |
| 本人已登录 WorkBuddy 桌面端 | 调用需要 | 取得该产品凭据 | 回桌面端登录或核路径 |
| 上游协议和网络 | 响应需要 | 发送请求与接收积分 | 遇拒绝停止，检查原客户端 |
| 明确的单模型探测确认 | 可选探测时 | 验证接口接受档位 | 不发送探测请求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离 DSH 核产品区域和本人账户 | 模型目录来自期望账户 |
| 观察 | 发送一条非敏感短消息 | 回复和积分状态可核对 |
| 退出 | 停用插件并核实际账户和额度 | 区域或余额异常时回原客户端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账户及短测试请求 | 核配置、区域、应用 | 接入时间未测 |
| 持续 | 上游积分和可选探测 | 检查登录和模型变更 | 扣减未测 |
| 恢复 | 可能需要重新登录或清理副本 | 核账号和实际扣减 | 退出后有效凭据未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型接入 | DSH 适配、回环桥及上游请求 | 真实服务和工具调用 |
| 账号保护 | 桌面身份优先、区域限制 | 真实退出及并发切换 |
| 积分与检测 | 上游事件和请求结果 | 对账完整性与档位效果 |

以同一账号一条合格消息核对输出、积分和人工时间。

> **思考**：桌面登录与插件刷新副本都能影响实际凭据。上游协议及积分回执变化会影响可用性和账户判断。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把两种 WorkBuddy 产品的登录态、模型目录和回环适配接到 DSH，并尝试将上游实际积分关联到消息。见 [Q01](#research-q01)、[Q03](#research-q03)。

本机共享令牌与上游令牌分开。目录按身份切换作废，探测及展示偏好按账号读取，积分依赖响应 ID。

<a id="detail-section-5"></a>

### 1.4 主要限制

桌面登录与插件刷新副本都能影响实际凭据。上游协议及积分回执变化会影响可用性和账户判断。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察本人隔离账号的一条短消息。身份、协议或积分异常时关闭桥接并回原客户端核验。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主注册、账号优先与回环路由。真实账户、积分和上游协议未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、tsdown.config.ts、cordis.patch.yml、src/index.ts、src/llm/adapter.ts、src/llm/shim.ts、src/protocol/client.ts、src/credential/store.ts、src/web/probe-route.ts、src/probe/service.ts、src/llm/credit-log.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定源码的适配器、回环请求、凭据选取与刷新、探测和积分。未执行目标或读真实凭据，未验证上游政策或当前服务。
- 下一步：获得用户许可后用隔离账号核模型、区域、单次调用和退出。真实探测另核请求数和扣减。

**分析版本**

- **仓库**：[dsh-plugin-lab/dsh-workbuddy-bridge](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge)
- **版本号**：0.5.7（[固定提交 a9d9b9c](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/tree/a9d9b9c669649445ef14fddf8c74367b23ef7d9c)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将调用归属、目录来源与积分证据合并为一次可回读记录。若对照仍无法识别错账号和错扣减，则回原客户端。见 [Q04](#research-q04)。

获得用户许可后用隔离账号核模型、区域、单次调用和退出。真实探测另核请求数和扣减。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 68 | 4888 | — | — | 78483 |
| .mjs | source | 10 | 2527 | 1748 | 628 | — |
| .ts | source | 36 | 12208 | 7277 | 4319 | — |
| .tsx | source | 10 | 2562 | 1533 | 971 | — |
| .ts | test | 41 | 14069 | 10986 | 2090 | — |
| .md | test | 4 | 109 | — | — | 1503 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桥接如何让 DSH 使用本机 WorkBuddy 登录态、模型和积分，错误账号、协议变化与探测费用有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 选中模型后怎样使用 WorkBuddy？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用场景是已有 WorkBuddy 桌面登录、仍想在 DSH 当前会话使用其模型的个人。直接用 WorkBuddy 可保持原生账号和产品能力，但需在另一客户端交互。该桥通过 Cordis 挂载，宿主实际注册各产品适配器。适配器复用宿主 OpenAI 格式接口，目录映射到本机随机端口的 /v1。发往回环服务的 bearer 是本进程共享密钥，桥核 Host、Origin 和 bearer 后才读真正的 WorkBuddy 凭据、重写请求并发往区域上游。插件卸载时注销适配器并关 shim。相对另开客户端，增量是让 DSH 在其会话、模型选择和工具接口下调用，不能据此推断 WorkBuddy 的所有原生能力和工具合同一致。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:4-6](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/cordis.patch.yml#L4-L6)

固定挂载根包。

```text
- insert:
    - id: llm-workbuddy
      name: dsh-workbuddy-bridge
```

**依据 2 · 源码核查**：[src/index.ts:693-718](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/index.ts#L693-L718)

真实注册适配器及回收。

<details>
<summary>查看原文（26行）</summary>

```text
    // Only the adapter registers. The plugin deliberately contributes NO
    // `registerConfigurableProviders` directory entry: the Models settings page
    // builds its rows from that registration, so
    // omitting it keeps the WorkBuddy providers off that page (its editor has
    // no fields to offer them) while the adapter keeps serving models and the
    // sections keep serving `settings.yaml` and the TUI. A live route with no
    // directory entry joins with an empty `settingsNs`, which every page reads
    // as unconfigured and does not render. Nothing else consumes the
    // directory: the model picker's group headings come from the adapter's own
    // provider metadata and catalog, and `/model` resolves through the
    // adapter, so both are unaffected.
    const releaseAdapter = ctx.llm.registerAdapter([variant.id], workbuddy.adapter)
    try {
      ctx.effect(() => () => {
        releaseAdapter()
        void shim.close()
      })
    } catch {
      // `ctx.effect` throws when the context is already disposed, so the
      // disposer it would have registered never runs: release this variant's
      // own registration (and its shim) here instead.
      releaseAdapter()
      void shim.close()
    }
    runtime.registered = true
    return true
```

</details>

**依据 3 · 源码核查**：[src/llm/adapter.ts:252-275](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/adapter.ts#L252-L275)

目录映射和复用 OpenAI 适配。

<details>
<summary>查看原文（24行）</summary>

```text
  const buildModels = (): Model<Api>[] => {
    // The OpenAI SDK pi-ai drives appends `/chat/completions` to baseURL,
    // so the shim's routes line up with the `/v1` prefix in place.
    const baseUrl = `${shim.baseUrl()}/v1`
    return catalog.current().map((info) => toPiModel(info, baseUrl, observe?.(info.id), providerId))
  }

  const base = createProvider({
    id: providerId,
    name: displayName,
    auth: {
      apiKey: {
        name: 'WorkBuddy OAuth bearer token',
        async resolve({ credential }) {
          const apiKey = credential?.key
          return apiKey === undefined || apiKey.length === 0
            ? undefined
            : { auth: { apiKey }, source: 'WorkBuddy' }
        },
      },
    },
    models: buildModels(),
    api: openAICompletionsApi(),
  })
```

</details>

**依据 4 · 源码核查**：[src/llm/adapter.ts:298-310](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/adapter.ts#L298-L310)

本机共享令牌与上游凭据分离。

<details>
<summary>查看原文（13行）</summary>

```text
    catalog,
    hidden ?? (() => []),
    observe ?? (() => undefined),
    {
      profiles: () => profiles,
      auth: INERT_AUTH,
      // Resolve the shim's per-process shared secret as the OpenAI apiKey so
      // pi-ai sends it as `Authorization: Bearer <shared-secret>`. The shim
      // validates this before forwarding and resolves the real WorkBuddy token
      // itself via the store, so the secret never reaches upstream.
      resolveApiKey: async () => shim.token(),
      ...(resolveAttachments === undefined ? {} : { resolveAttachments }),
    },
```

</details>

**依据 5 · 源码核查**：[src/llm/shim.ts:314-359](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/shim.ts#L314-L359)

回环请求门禁和路由。

<details>
<summary>查看原文（46行）</summary>

```text
  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      // Inbound hardening: every request must name the loopback host, and
      // browser-sent origins must be loopback too. The plugin's own client
      // always satisfies both; DNS-rebinding pages and cross-origin POSTs
      // do not.
      if (!hostIsLoopback(req.headers.host)) {
        writeOpenAIError(
          res,
          403,
          'host_not_allowed',
          'Host header must name the loopback interface',
        )
        return
      }
      if (!originIsLoopback(req.headers.origin)) {
        writeOpenAIError(res, 403, 'origin_not_allowed', 'Origin must be a loopback origin')
        return
      }
      if (!bearerOk(req)) {
        writeOpenAIError(res, 401, 'unauthorized', 'missing or invalid Authorization bearer')
        return
      }
      const url = req.url ?? '/'
      if (req.method === 'GET' && (url === '/healthz' || url === '/healthz/')) {
        writeJson(res, 200, { ok: true })
        return
      }
      if (req.method === 'GET' && (url === '/v1/models' || url === '/v1/models/')) {
        writeJson(res, 200, {
          object: 'list',
          data: catalog.current().map((model) => ({
            id: model.id,
            object: 'model',
            created: 0,
            owned_by: 'workbuddy',
          })),
        })
        return
      }
      if (
        req.method === 'POST' &&
        (url === '/v1/chat/completions' || url === '/v1/chat/completions/')
      ) {
        await chatCompletions(req, res)
        return
```

</details>

**依据 6 · 源码核查**：[src/llm/shim.ts:371-400](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/shim.ts#L371-L400)

读登录凭据、调用上游和输出流。

<details>
<summary>查看原文（30行）</summary>

```text
  async function chatCompletions(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!isJsonContentType(req)) {
      writeOpenAIError(res, 415, 'unsupported_media_type', 'Content-Type must be application/json')
      return
    }
    let credential
    try {
      credential = await store.resolve()
    } catch (error: unknown) {
      writeOpenAIError(res, 401, 'not_signed_in', String(error))
      return
    }

    const raw = (await readBody(req)).toString('utf8')
    const prepared = prepareChatBody(raw)

    const controller = new AbortController()
    req.on('close', () => controller.abort())
    const result = await client.chatStream(credential, prepared, controller.signal)

    if (!result.ok) {
      writeOpenAIError(res, KIND_STATUS[result.kind], result.kind, failureMessage(result))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
```

</details>

**依据 7 · 源码核查**：[src/protocol/client.ts:1003-1044](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/protocol/client.ts#L1003-L1044)

区域、请求转换和真正的上游 bearer。

<details>
<summary>查看原文（42行）</summary>

```text
  async chatStream(
    credential: WorkBuddyCredential,
    bodyJson: string,
    signal?: AbortSignal,
  ): Promise<WorkBuddyChatResult> {
    const region = regionOf(credential.domain)
    // Identity resolution must never block a message: any failure — a thrown
    // resolver included — degrades to the desktop fallback form (built-in
    // version, no CLI segment), never to the legacy CLI UA.
    let userAgent: string
    try {
      userAgent = chatUserAgent(await this.resolveChatIdentity(region), region)
    } catch {
      userAgent = chatUserAgent(fallbackChatIdentity(region), region)
    }
    const body =
      region === 'global' ? prepareInternationalChatBody(bodyJson) : prepareChatBody(bodyJson)
    const url = `${chatBase(credential)}/v2/chat/completions`
    const headers: Record<string, string> = {
      ...chatHeaders(credential, userAgent),
      Authorization: `Bearer ${credential.accessToken}`,
    }
    // The hook runs after headers and body are final and before the fetch, so a
    // capture is what the upstream receives — not what the caller intended.
    try {
      this.onChatRequest?.({ url, headers, body })
    } catch {
      // An observer must never fail the request it observes.
    }
    let response: Response
    let attempt = 0
    /** The last refusal, kept for the report once the retry budget is spent. */
    let refusal: { status: number; text: string } | undefined
    for (;;) {
      attempt++
      try {
        response = await fetch(url, {
          method: 'POST',
          headers,
          body,
          ...(signal === undefined ? {} : { signal }),
        })
```

</details>

#### 缺口

- 没有独立复现当前协议和 DSH 工具调用。
  **影响**：不能保证目标模型实际可用。
  **进一步探讨**：在用户许可的隔离账号核目录、模型及简单文本回复，再比较工具路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面登录、缓存刷新和账号切换如何区分？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

存储同时读桌面文件和插件自有刷新副本。产品区域不符直接拒绝。桌面文件的用户或企业 ID 与副本不同时，桌面优先，即使旧副本到期更晚。同一身份才比较有效期。缺桌面记录可回退插件副本，因此移除桌面文件不一定等同插件即时清除旧登录。存在但不可解析或加密格式无法识别的文件应报错，不能悄悄选上一版本目录。刷新按当前凭据及需要合并，新的令牌写到插件拥有的路径，使用文件锁、原子写和受限权限。不是重新进行用户授权。

账号改变时目录 generation 加一、中止进行中的获取，探测和可见性按账号读取，减少旧账号状态污染。它依赖实际文件能被解析与身份信息正确，也没有证明并发对话中任意瞬间都能统一切换账号。出现区域、格式或身份异常时应停用该路由并回原客户端检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/credential/store.ts:470-527](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/credential/store.ts#L470-L527)

区域、桌面权威、有效期与刷新共享。

<details>
<summary>查看原文（58行）</summary>

```text
  async current(): Promise<WorkBuddyCredential | undefined> {
    const [desktop, own] = await Promise.all([this.readDesktop(), this.readOwn()])
    // A credential belonging to the other product is refused rather than used:
    // the two apps share one auth directory and differ only by filename, so a
    // misconfigured `authFile` / env var is a realistic mistake, and sending one
    // region's token to the other's endpoint would leak it across products.
    // Naming the file and the expected region is what makes it fixable.
    if (this.variant !== undefined) {
      for (const [label, credential] of [
        ['desktop file', desktop],
        ['plugin copy', own],
      ] as const) {
        if (credential === undefined) continue
        const region = regionOf(credential.domain)
        if (region !== this.variant.region) {
          throw new WorkBuddyElectronPathError(
            'credential-region-mismatch',
            `${this.variant.displayName} received a ${region === 'cn' ? 'WorkBuddy (CN)' : 'WorkBuddy AI'} credential` +
              ` in its ${label} (domain ${JSON.stringify(credential.domain)});` +
              ` point ${this.variant.env} at the ${this.variant.appName} sign-in, or remove the mismatched file`,
          )
        }
      }
    }
    if (desktop === undefined) return own
    if (own === undefined) return desktop
    // Identity beats expiry. The plugin's own copy is written by its own
    // refreshes, so after the user switches accounts in the desktop app the copy
    // still belongs to the *previous* account — and may well expire later,
    // because the plugin refreshed it. Preferring it by expiry would send the old
    // account's uid in `X-User-Id` and answer as the wrong user. The desktop
    // file is the authority on who is signed in now; a differing identity means
    // the copy is stale regardless of its timestamp.
    if (desktop.uid !== own.uid || desktop.enterpriseId !== own.enterpriseId) return desktop
    return own.expiresAtMs > desktop.expiresAtMs ? own : desktop
  }

  /**
   * The credential to send upstream: {@link current}, refreshed on demand.
   * Single-flight, so parallel requests share one refresh.
   */
  async resolve(): Promise<WorkBuddyCredential> {
    const credential = await this.current()
    if (credential === undefined) {
      const candidates = this.resolveDesktopCandidates()
      const desktop =
        candidates.length > 0 ? candidates.join(' or ') : '(no desktop path on this platform)'
      const app = this.variant?.appName ?? 'WorkBuddy'
      throw new Error(
        `workbuddy: no signed-in ${app} account found; sign in once in the ${app} desktop app` +
          ` (expected ${desktop} or ${this.variant?.env ?? WORKBUDDY_AUTH_FILE_ENV}), or refresh an existing session`,
      )
    }
    if (!this.needsRefresh(credential)) return credential
    this.inflight ??= this.refreshNow(credential).finally(() => {
      this.inflight = undefined
    })
    return this.inflight
```

</details>

**依据 2 · 源码核查**：[src/credential/store.ts:582-621](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/credential/store.ts#L582-L621)

刷新错误和自有副本权限。

<details>
<summary>查看原文（40行）</summary>

```text
  private async refreshNow(credential: WorkBuddyCredential): Promise<WorkBuddyCredential> {
    if (credential.refreshToken === '') {
      if (credential.expiresAtMs > Date.now() + 30_000) return credential
      throw new Error(
        'workbuddy: access token expired and no refresh token is stored; sign in again in the WorkBuddy desktop app',
      )
    }
    try {
      const outcome = await this.refresh(credential)
      const refreshed: WorkBuddyCredential = {
        ...credential,
        accessToken: outcome.accessToken,
        ...(outcome.refreshToken === undefined ? {} : { refreshToken: outcome.refreshToken }),
        expiresAtMs:
          outcome.expiresInSec !== undefined
            ? Date.now() + outcome.expiresInSec * 1000
            : credential.expiresAtMs,
        ...(outcome.domain === undefined || outcome.domain === ''
          ? {}
          : { domain: outcome.domain }),
        source: 'dsh',
      }
      await this.saveOwn(refreshed)
      return refreshed
    } catch (error: unknown) {
      if (credential.expiresAtMs > Date.now() + 30_000) return credential
      throw new Error(
        `workbuddy: token refresh failed and the access token is expired (${String(error)});` +
          ' open the WorkBuddy desktop app once to sign in again',
        { cause: error },
      )
    }
  }

  private async saveOwn(credential: WorkBuddyCredential): Promise<void> {
    await withFileLock(this.ownPath, async () => {
      await writeFileAtomic(this.ownPath, `${JSON.stringify(ownDocument(credential), null, 2)}\n`, {
        mode: 0o600,
        dirMode: 0o700,
      })
```

</details>

**依据 3 · 源码核查**：[src/credential/store.ts:625-639](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/credential/store.ts#L625-L639)

可解析文件及回退限制。

<details>
<summary>查看原文（15行）</summary>

```text
  /**
   * Read the first desktop candidate that exists. Only an absent file
   * (ENOENT) falls through to the next candidate; a file that is present
   * but unparsable is authoritative for its slot, so a stale older-version
   * file never silently wins over a broken newer one.
   *
   * Since WorkBuddy 5.6 the token fields may arrive in at-rest envelopes, so
   * the text is classified before the regular parser sees it. An encrypted
   * document must be *opened*, never skipped; an unrecognized one must fail
   * loudly. The desktop file, as long as it exists, is the identity
   * authority — a document this plugin cannot read must surface as a
   * diagnosis rather than be papered over by the plugin-owned copy, which
   * belongs to whatever account was signed in when it was last refreshed.
   * Only an absent (or empty) file lets the probe continue.
   */
```

</details>

**依据 4 · 源码核查**：[src/index.ts:795-836](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/index.ts#L795-L836)

账号切换、目录失效和独立探测。

<details>
<summary>查看原文（42行）</summary>

```text
   * makes an in-flight request from before the change refuse to write back.
   *
   * Probe observations are kept across an account change: the store nests them
   * per account, so the departing account's records simply stop being served
   * (every read is account-scoped) and are found intact if that account
   * returns. The "signed out, then in as someone else" sequence that used to
   * look like a first sighting is still safe — a record only ever answers for
   * the account stamped on it, so the new account inherits nothing. Visibility
   * preferences are kept for the same reason, and read through the new
   * account's key immediately: the picker re-lists after the invalidate below
   * and a returning account finds its own hidden list back in force.
   *
   * @param identity - the account now in effect, or `undefined` when signed out.
   * @param account - the visibility key for that same credential (`undefined`
   * also when the credential carries no uid); stored alongside the identity so
   * preference reads never guess it from the identity string.
   */
  const adoptIdentity = (
    runtime: VariantRuntime,
    identity: string | undefined,
    account: string | undefined,
  ): void => {
    const id = runtime.variant.id
    const known = lastIdentities.get(id)
    if (known === identity) return
    const hadCredential = known !== undefined
    if (identity === undefined) lastIdentities.delete(id)
    else lastIdentities.set(id, identity)
    if (account === undefined) lastAccounts.delete(id)
    else lastAccounts.set(id, account)
    // Any change of identity invalidates in-flight work and the catalog it was
    // serving; recorded probe answers stay on disk, keyed by account and
    // re-judged on every read.
    runtime.catalogGeneration += 1
    runtime.inflightFetch?.controller.abort()
    runtime.inflightFetch = undefined
    if (hadCredential && known !== identity) {
      runtime.invalidate()
    }
    if (identity === undefined) {
      // Signed out: hide the group, and drop the models so they are not left
      // registered-but-invisible if visibility ever flips back. The signed-out
```

</details>

#### 缺口

- 同账号刷新、登出及跨平台加密格式未验。
  **影响**：不能保证安全退出和账号隔离在真实机器上成立。
  **进一步探讨**：用授权测试账号检查切换、旧副本、退出及错误区域。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 手动检测与单消息积分能够证明什么？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

上游已声明档位的模型使用声明值。缺明确档位时，手动请求在可信本机入口、探测 key 和可解析动作之后发起。服务检查模型、账号及授权条件，同账号同模型请求可合并。探测会发送真实请求，按账号和模型指纹记结果。作者明确它只能说明当前接口接受档位，不能说明推理行为改变。没有账号或已有声明则跳过。

积分来自上游 SSE 的用量字段，桥记录合法响应 ID 与积分，再尝试与宿主 assistant/message 事件中的响应 ID 关联。缺 ID 或上游不提供 credit 时无法归因，等待匹配不是自动估价。面板余额和每条消息的观测也不构成正式账单。首次应核模型请求数、返回和账户扣减，另计探测可能消耗。

#### 证据与依据

**依据 1 · 源码核查**：[src/web/probe-route.ts:154-179](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/web/probe-route.ts#L154-L179)

手动请求门禁和输入限制。

<details>
<summary>查看原文（26行）</summary>

```text
export function workBuddyProbeHandler(
  deps: WorkBuddyProbeRouteOptions,
  key: string,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    if (req.method !== 'POST') {
      json(res, 405, { error: 'method not allowed' })
      return
    }
    if (!hostIsLoopback(req.headers.host) || !originIsLoopback(req.headers.origin)) {
      json(res, 403, { error: 'request-not-trusted' })
      return
    }
    if (!keyMatches(key, req.headers['x-workbuddy-probe-key'] as string | undefined)) {
      json(res, 403, { error: 'invalid-probe-key' })
      return
    }
    const body = await readBody(req)
    if (body === undefined) {
      json(res, 413, { error: 'body too large' })
      return
    }
    const action = parseAction(body)
    if (action === undefined) {
      json(res, 400, { error: 'invalid action' })
      return
```

</details>

**依据 2 · 源码核查**：[src/index.ts:918-930](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/index.ts#L918-L930)

手动路由调用探测服务并刷新目录。

<details>
<summary>查看原文（13行）</summary>

```text
      registerWorkBuddyProbeRoute(
        webCtx,
        {
          path: runtime.variant.probePath,
          probe: async (modelId) => {
            // The authenticated manual endpoint is called only after per-model confirmation.
            const result = await runtime.probeService.probe(modelId, true)
            if (result.state === 'ok') runtime.invalidate()
            return result
          },
          clear: () => {
            runtime.probeStore.clear()
            runtime.invalidate()
```

</details>

**依据 3 · 源码核查**：[src/probe/service.ts:85-138](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/probe/service.ts#L85-L138)

声明优先、账号键及共享。

<details>
<summary>查看原文（54行）</summary>

```text
  recordFor(modelId: string): WorkBuddyProbeRecord | undefined {
    const info = this.options.catalog.current().find((model) => model.id === modelId)
    if (info === undefined) return undefined
    if (
      info.reasoning?.supportedEfforts !== undefined &&
      info.reasoning.supportedEfforts.length > 0
    ) {
      return undefined
    }
    const account = this.options.account()
    // Signed out: there is no account to attribute an observation to, so none
    // is served (a previous account's record must not answer here).
    if (account === undefined) return undefined
    return this.options.store.get(modelId, fingerprintModel(info), account)
  }

  /**
   * Probe one model, serially.
   *
   * The authenticated manual route supplies one-request consent after UI
   * confirmation. Other callers must pass the configured consent gate.
   * Manual consent never changes the automatic-probing configuration.
   * Explicit requests bypass historical results, but share an ongoing run.
   */
  async probe(modelId: string, manualConsent = false): Promise<WorkBuddyProbeStatus> {
    if (!manualConsent && !this.options.consent()) {
      return { state: 'unavailable', reason: 'probing is not authorized' }
    }
    const info = this.options.catalog.current().find((model) => model.id === modelId)
    if (info === undefined) return { state: 'unavailable', reason: `unknown model: ${modelId}` }
    const account = this.options.account()
    if (account === undefined) return { state: 'unavailable', reason: 'no WorkBuddy credential' }
    const pendingKey = JSON.stringify([account, modelId])
    const pending = this.pending.get(pendingKey)
    if (pending !== undefined) return pending

    const run = this.queue.then(async (): Promise<WorkBuddyProbeStatus> => {
      // Re-read inside the queue: an earlier sweep may have changed the catalog
      // or already answered this model.
      const current = this.options.catalog.current().find((model) => model.id === modelId)
      if (current === undefined)
        return { state: 'unavailable', reason: `unknown model: ${modelId}` }
      if (!manualConsent && !this.options.consent()) {
        return { state: 'unavailable', reason: 'probing is not authorized' }
      }
      if (
        current.reasoning?.supports !== true ||
        (current.reasoning.supportedEfforts?.length ?? 0) > 0
      ) {
        return { state: 'unavailable', reason: 'model does not need detection' }
      }
      const cached = this.recordFor(modelId)
      if (!manualConsent && cached !== undefined && cached.validation !== 'unknown') {
        return { state: 'ok', validation: cached.validation, efforts: cached.efforts, requests: 0 }
```

</details>

**依据 4 · 源码核查**：[src/probe/service.ts:141-165](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/probe/service.ts#L141-L165)

探测时选择实际账户与请求。

<details>
<summary>查看原文（25行）</summary>

```text
      // The account this sweep is being run for. Captured before the requests
      // and re-checked before the write-back: a probe can outlive the account
      // it started under (a switch, or a manual refresh, clears records while
      // the sweep is still talking to the upstream), and storing the result
      // afterwards would resurrect the previous account's answer.
      const activeAccount = this.options.account()
      if (activeAccount !== account)
        return { state: 'unavailable', reason: 'account changed before detection' }
      const credential = await this.options.credentials.current()
      if (credential === undefined)
        return { state: 'unavailable', reason: 'no WorkBuddy credential' }

      const send =
        this.options.send === undefined
          ? (effort: string | undefined, signal: AbortSignal) =>
              this.options.client.probeEffort(credential, modelId, effort, signal)
          : this.options.send(modelId)

      this.running = true
      try {
        const outcome = await probeModel({
          send,
          ...(this.options.sentinel === undefined ? {} : { sentinel: this.options.sentinel }),
        })
        // The account may have changed while the requests were in flight. Drop
```

</details>

**依据 5 · 源码核查**：[src/llm/shim.ts:90-107](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/shim.ts#L90-L107)

提取实际 credit。

<details>
<summary>查看原文（18行）</summary>

```text
export function readCreditFrame(payload: string): { id: string; credit: number } | undefined {
  if (payload === '' || payload.startsWith('[DONE]')) return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(payload)
  } catch {
    // A partial or non-JSON frame is ordinary mid-stream; nothing to report.
    return undefined
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return undefined
  const frame = parsed as Record<string, unknown>
  const id = typeof frame['id'] === 'string' ? frame['id'] : ''
  if (id === '') return undefined
  const usage = frame['usage']
  if (typeof usage !== 'object' || usage === null || Array.isArray(usage)) return undefined
  const credit = (usage as Record<string, unknown>)['credit']
  if (typeof credit !== 'number' || !Number.isFinite(credit) || credit < 0) return undefined
  return { id, credit }
```

</details>

**依据 6 · 源码核查**：[src/llm/credit-log.ts:210-232](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/credit-log.ts#L210-L232)

响应 ID 与消息积分关联。

<details>
<summary>查看原文（23行）</summary>

```text
export function attributeCredit(
  log: WorkBuddyCreditLog,
  index: WorkBuddySessionCreditIndex,
  sessionId: string,
  data: AssistantMessageEventData,
): boolean {
  const message = data.message
  const messageId = message?.id
  if (typeof messageId !== 'string' || messageId === '') return false
  const responseId = responseIdOf(message?.source?.replayState)
  if (responseId === undefined) return false
  const known = log.lookup(responseId)
  if (known !== undefined) {
    index.set(sessionId, messageId, known)
    return true
  }
  // Not observed yet: wait for the shim's final frame to supply it. The
  // canceller is dropped deliberately -- the waiter is one-shot and holds only
  // a number, and the cost may legitimately arrive after this returns.
  log.await(responseId, (credit) => {
    index.set(sessionId, messageId, credit)
  })
  return true
```

</details>

**依据 7 · 作者声明**：[README.md:116-120](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/README.md#L116-L120)

作者说明探测只能验证接收档位。

```text
## 为什么是手动检测

WorkBuddy 接口不保证档位信息可靠——有的模型**接受** `reasoning_effort` 却忽略未知值。
所以插件不猜：按需对单个模型发少量真实请求确认；结果只表示**上游当前接受该档位**，
不承诺它改变推理行为。已声明档位的模型跳过这一步，直接用声明值。
```

#### 缺口

- 无真实试用的积分对账或不同档位效果。
  **影响**：不能以标签宣称费用完整或推理提高。
  **进一步探讨**：核一次文本消息与一次可选探测的账户积分和回执。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样决定是否在日常工作里采用？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

建议观察。已有本人 WorkBuddy 登录且要在 DSH 里用相同模型的个人，可先用非敏感短消息观察目录、账号与实际返回。作者定位个人学习研究且声明与上游没有授权关系，不能据此认定当前协议稳定或服务允许任何用法。前期需核宿主、应用、产品区域和数据去向，持续还要维护登录刷新、模型目录和积分追踪。出现账号错误、协议拒绝、费用归因缺失或额度异常时停止调用，回 WorkBuddy 客户端核验。可试验把当前账号、目录来源和积分可追溯状态连在一次调用记录里，与现有界面和原生客户端比选错账号、错判积分和查阅耗时。若增加确认仍不能识别异常，维持原生客户端。

#### 证据与依据

**依据 1 · 源码核查**：[src/credential/store.ts:470-504](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/credential/store.ts#L470-L504)

账号及区域依赖。

<details>
<summary>查看原文（35行）</summary>

```text
  async current(): Promise<WorkBuddyCredential | undefined> {
    const [desktop, own] = await Promise.all([this.readDesktop(), this.readOwn()])
    // A credential belonging to the other product is refused rather than used:
    // the two apps share one auth directory and differ only by filename, so a
    // misconfigured `authFile` / env var is a realistic mistake, and sending one
    // region's token to the other's endpoint would leak it across products.
    // Naming the file and the expected region is what makes it fixable.
    if (this.variant !== undefined) {
      for (const [label, credential] of [
        ['desktop file', desktop],
        ['plugin copy', own],
      ] as const) {
        if (credential === undefined) continue
        const region = regionOf(credential.domain)
        if (region !== this.variant.region) {
          throw new WorkBuddyElectronPathError(
            'credential-region-mismatch',
            `${this.variant.displayName} received a ${region === 'cn' ? 'WorkBuddy (CN)' : 'WorkBuddy AI'} credential` +
              ` in its ${label} (domain ${JSON.stringify(credential.domain)});` +
              ` point ${this.variant.env} at the ${this.variant.appName} sign-in, or remove the mismatched file`,
          )
        }
      }
    }
    if (desktop === undefined) return own
    if (own === undefined) return desktop
    // Identity beats expiry. The plugin's own copy is written by its own
    // refreshes, so after the user switches accounts in the desktop app the copy
    // still belongs to the *previous* account — and may well expire later,
    // because the plugin refreshed it. Preferring it by expiry would send the old
    // account's uid in `X-User-Id` and answer as the wrong user. The desktop
    // file is the authority on who is signed in now; a differing identity means
    // the copy is stale regardless of its timestamp.
    if (desktop.uid !== own.uid || desktop.enterpriseId !== own.enterpriseId) return desktop
    return own.expiresAtMs > desktop.expiresAtMs ? own : desktop
```

</details>

**依据 2 · 源码核查**：[src/llm/credit-log.ts:210-232](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/src/llm/credit-log.ts#L210-L232)

积分依赖同一响应 ID。

<details>
<summary>查看原文（23行）</summary>

```text
export function attributeCredit(
  log: WorkBuddyCreditLog,
  index: WorkBuddySessionCreditIndex,
  sessionId: string,
  data: AssistantMessageEventData,
): boolean {
  const message = data.message
  const messageId = message?.id
  if (typeof messageId !== 'string' || messageId === '') return false
  const responseId = responseIdOf(message?.source?.replayState)
  if (responseId === undefined) return false
  const known = log.lookup(responseId)
  if (known !== undefined) {
    index.set(sessionId, messageId, known)
    return true
  }
  // Not observed yet: wait for the shim's final frame to supply it. The
  // canceller is dropped deliberately -- the waiter is one-shot and holds only
  // a number, and the cost may legitimately arrive after this returns.
  log.await(responseId, (credit) => {
    index.set(sessionId, messageId, credit)
  })
  return true
```

</details>

**依据 3 · 作者声明**：[README.md:129-145](https://github.com/dsh-plugin-lab/dsh-workbuddy-bridge/blob/a9d9b9c669649445ef14fddf8c74367b23ef7d9c/README.md#L129-L145)

作者范围和上游协议参照。

<details>
<summary>查看原文（17行）</summary>

```text
## 兼容与限制

无凭据的分组不显示。宿主版本下限、平台支持、模型清单从哪来与已知缺口
→ [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md)。

设计取舍 → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)；发版流程 → [docs/PUBLISHING.md](docs/PUBLISHING.md)；
维护者文档地图 → [AGENTS.md](AGENTS.md)。

## 免责声明

- 本项目**仅供个人学习和研究使用**，仅驱动使用者自己的 WorkBuddy 账号在本机调用，请勿用于商业用途。
- 使用者需遵守 WorkBuddy 的服务条款；因使用本项目产生的任何后果，由使用者自行承担。
- 本项目与腾讯、WorkBuddy、DeepSeek 均无关联，未获其授权或认可；文中出现的名称仅用于描述兼容关系，其商标权利归各自所有。

## 致谢

- [Sliverkiss/workbuddy2api](https://github.com/Sliverkiss/workbuddy2api)（MIT）— WorkBuddy 上游协议的参照实现。
```

</details>

#### 缺口

- 未核实际账户授权、上游协议可用性、试用时间和扣减。
  **影响**：不支持生产或持续采用判断。
  **进一步探讨**：用户许可后仅用隔离账号对照短消息，不自动探测。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
