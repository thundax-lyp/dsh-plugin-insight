# DSH 订阅模型适配插件

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7639ed9](https://github.com/V1ki/dsh-plugin-subscriptions/tree/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d)

<!-- BEGIN META -->
[![GitHub ★ 517](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=517&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/V1ki/dsh-plugin-subscriptions) [![npm 30d 10,488](https://img.shields.io/static/v1?label=npm+30d&message=10%2C488&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions)
<!-- END META -->

> **功能**：将 ChatGPT、Claude、Grok、Copilot 与 Antigravity 订阅接为 DSH 模型供应商

> **亮点**：把多账号认证刷新、宿主流转换和成员绑定replay统一在适配层，并区分首输出前后及媒体请求的重试边界，减少自行编写协议桥接的工程负担。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：目录可见与OAuth登录不证明推理权益，首输出前可切换不代表远端未处理；凭据为0600 JSON而非加密保险箱，服务和宿主变化仍需验收。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 订阅适配层为已有订阅的 DSH 用户改变什么？](#detail-section-11)
  - [Q02 · 认证、模型请求和刷新如何实际接线？](#detail-section-12)
  - [Q03 · 多账号故障转移能否保证请求不重复、历史不串账号？](#detail-section-13)
  - [Q04 · 凭据、兼容和退出成本是否可控？](#detail-section-14)
  - [Q05 · 如何把故障转移的技术边界变成用户可理解的保证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有模型订阅且使用 DSH 的用户，把账号认证和模型调用接到统一宿主工作流。

供应商原生客户端或DSH官方API凭据路径；适配层复用订阅入口，不新增模型能力或证明订阅调用许可/额度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 订阅LLM适配 | 统一宿主模型工作流 | 账号权益、网络和宿主版本 |
| 登录与多账号 | 刷新、目录与条件转移 | 不能保证远端恰好一次 |
| 额外搜索/媒体 | 可选供应商工具 | 权益和重试语义另验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH版本与llm契约 | 必需 | Adapter和消息/工具语义 | peer范围与语义都要验收 |
| 账号权益与网络 | 必需 | 实际供应商调用 | 登录成功仍可能拒绝模型 |
| 本地token文件权限 | 必需 | 自动刷新与持久登录 | 0600不等于加密 |
| connection/Web UI | 交互登录必需 | 认证与设置路由 | headless没有同样登录入口 |
| 多账号池/媒体工具 | 可选 | 调度与额外生成 | 先关闭以限定试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主/插件并选单provider | 账号权益与网络明确 |
| 登录 | 用户授权并核对实际账号 | 不只看目录可见 |
| 验收 | 非敏感流式和工具回合 | 输出、历史和额度一致 |
| 退出 | logout并按供应商撤销授权 | 核对本地token及生成文件留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 订阅/网络资源未知 | 登录、版本和路由验收未知 | 无APIkey不代表免费 |
| 持续使用 | 订阅额度与附加工具资源未知 | 目录/协议/账号维护未知 | 未测净费用下降 |
| 失败恢复 | 可能已处理请求与重试资源未知 | 重登及结果核对未知 | 无输出不等于未消耗 |
| 退出 | 媒体/凭据留存资源未知 | 撤销授权和清理文件 | 原子写不替代留存治理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生模型接入 | llm注册与Codex实际请求链 | 当前账号/所有wire可用性 |
| 账号调度 | 首输出边界与replay成员绑定 | 服务错误体覆盖和重复消耗 |
| 登录维护 | 并发刷新与新登录保护 | 多进程/真实撤销体验 |

> **思考**：目录可见与OAuth登录不证明推理权益，首输出前可切换不代表远端未处理；凭据为0600 JSON而非加密保险箱，服务和宿主变化仍需验收。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多账号认证刷新、宿主流转换和成员绑定replay统一在适配层，并区分首输出前后及媒体请求的重试边界，减少自行编写协议桥接的工程负担。[Q02](#research-q02) [Q03](#research-q03)

账号级刷新合并、保护期间的新登录、replay绑定和首内容前后切换边界值得协议适配借鉴；跨供应商目录、预发布宿主和私有wire带来持续兼容成本。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

目录可见与OAuth登录不证明推理权益，首输出前可切换不代表远端未处理；凭据为0600 JSON而非加密保险箱，服务和宿主变化仍需验收。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先单账号单供应商、关闭池和额外媒体工具，非敏感任务核对流式、工具、额度与logout。账号不符、授权异常或重复消耗时停用，回原生客户端或API路径。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

认证、Codex请求及共享池边界有源码支持；其他供应商wire、本次真实权益与宿主运行未验收，账本为设计假设。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、src/providers/codex.ts、src/providers/common.ts、src/auth/rpc.ts、src/providers/pool.ts、src/providers/replay.ts、src/providers/image-pool.ts、src/auth/store.ts、src/providers/accounts.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根插件源码重点Codex端到端Adapter、共享token/account/pool/replay、认证存储与路由；其他四provider声明与注册范围不等同于逐wire完整检查。
- 下一步：未安装、运行目标代码或测试，未登录任何账号；没有调用真实供应商，不把作者兼容声明当本次通过结果。

**分析版本**

- **仓库**：[V1ki/dsh-plugin-subscriptions](https://github.com/V1ki/dsh-plugin-subscriptions)
- **版本号**：0.9.11（[固定提交 7639ed9](https://github.com/V1ki/dsh-plugin-subscriptions/tree/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是最小请求账本公开实际成员、重试原因和结果未知状态可减少误重放；对比401/配额/超时/断流的误重放率、诊断时间与敏感暴露，若无改善或新增泄露则推翻。[Q05](#research-q05)

未安装、运行目标代码或测试，未登录任何账号；没有调用真实供应商，不把作者兼容声明当本次通过结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 957 | — | — | 17328 |
| .mjs | source | 2 | 352 | 296 | 54 | — |
| .ts | source | 60 | 17503 | 12625 | 3978 | — |
| .tsx | source | 9 | 3323 | 2634 | 510 | — |
| .tsx | test | 2 | 90 | 87 | 0 | — |
| .mjs | test | 2 | 356 | 346 | 10 | — |
| .ts | test | 55 | 13886 | 12075 | 935 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/V1ki/dsh-plugin-subscriptions/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：订阅适配层为已有订阅的 DSH 用户改变什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 订阅适配层为已有订阅的 DSH 用户改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已拥有某供应商订阅、希望在DSH继续使用同一模型工作流的用户；基线为供应商原生客户端，或用官方API凭据另行配置DSH。合格结果是在明确账号、模型和权限下完成文本/工具回合，额度和失败可解释，退出后凭据可撤销。包声明五个订阅供应商与网页登录，原生入口inject llm并注册Adapter；它是宿主协议与认证适配，既不新增模型智能，也不能由“无API key”推断免费、额度无限或所有订阅都接受这些调用。具体服务可用性与当前许可未在本次固定源码研究中核实，用户需按自己账号实际授权和服务能力判断。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-8](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/package.json#L1-L8)

作者定义五供应商订阅适配包。

```text
{
  "name": "dsh-plugin-subscriptions",
  "version": "0.9.11",
  "description": "Use ChatGPT (Codex), Claude, Grok (X Premium), GitHub Copilot, and Google Antigravity subscriptions as DeepSeek Harness LLM providers, with OAuth login from the web Settings page",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/V1ki/dsh-plugin-subscriptions.git"
```

**依据 2 · 源码核查**：[src/index.ts:150-151](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/index.ts#L150-L151)

原生插件与llm注入。

```text
export const name = 'dsh-plugin-subscriptions'
export const inject = ['llm']
```

**依据 3 · 源码核查**：[src/index.ts:816-822](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/index.ts#L816-L822)

通过AccountPreferencesAdapter注册宿主Adapter。

```text
  const register = (provider: ProviderId, adapter: AccountAwareAdapter): AdapterRegistrationHandle => {
    const route = new AccountPreferencesAdapter({
      provider, adapter, settings: preferences, pool: () => poolAdapter,
      accounts: async () => (await accountTokens.get(provider)?.list() ?? []).map(({ key, session }) => ({ key, label: accountOf(provider, session) ?? key })),
    })
    memberAdapters.set(provider, route.poolMember())
    return ctx.llm.registerAdapter([provider], route)
```

#### 缺口

- 没有真实订阅账号与原生客户端/API同任务对照
  **影响**：当前只能解释适配价值，不能证明配额可用或净费用下降
  **进一步探讨**：用自有获准账号和非敏感短任务比较结果、额度和退出流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 认证、模型请求和刷新如何实际接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply为provider建立AccountTokenManager，Codex分支绑定refresh、永久错误识别和usage，再建立CodexAdapter并注册。streamCore先取得可用token发请求，401只强制刷新一次，再把SSE转换为宿主StreamChunk；请求使用所选消息/图片转换、account-id和确定性session-id。TokenManager以inflight合并同账号并发刷新，永久错误删除对应登录，但若期间新登录已写入不同refresh token则保留新会话；暂时刷新失败且旧token未过期可继续使用。认证管理通过可选connection的/api精确路由挂载，headless没有交互入口仍可加载。此处核查Codex完整请求链与共享认证机制，不将其他四条wire都声称已端到端检查或实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:824-858](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/index.ts#L824-L858)

Codex账户管理与Adapter构建。

<details>
<summary>查看原文（35行）</summary>

```text
  for (const provider of providers) {
    switch (provider) {
      case 'codex': {
        const tokens = new AccountTokenManager<CodexSession>({
          provider: 'codex',
          displayName: 'ChatGPT (Codex)',
          makeOptions: () => ({
            preemptMs: CODEX_PREEMPT_MS,
            refresh: refreshCodex,
            isPermanent: isCodexPermanentRefreshError,
          }),
          onAccountRemoved: account => { authChanged('codex', account) },
        })
        codexTokens = tokens
        accountTokens.set('codex', tokens as AccountTokenManager<StoredSession>)
        usageFetchers.codex = async (account, signal) => {
          const session = await tokens.session(account)
          const usage = await fetchCodexUsage(session, proxiedFetch, signal)
          try {
            const resetCredits = await fetchCodexResetCredits(session, proxiedFetch, signal)
            return { ...usage, resetCredits }
          } catch (error) {
            // Reset credits are an optional private endpoint; preserve ordinary usage.
            const message = error instanceof Error ? error.message : String(error)
            return { ...usage, resetCreditsError: message }
          }
        }
        let adapter!: CodexAdapter
        adapter = new CodexAdapter({
          ...config.codexClientVersion === undefined ? {} : { clientVersion: config.codexClientVersion },
          resolveClientVersion: () => codexVersion.resolve(),
          models: catalog.codex,
          streamIdleTimeoutMs,
          rateLimit,
          tokens,
```

</details>

**依据 2 · 源码核查**：[src/providers/codex.ts:1067-1091](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/codex.ts#L1067-L1091)

取token、401单次刷新、SSE与错误转换。

<details>
<summary>查看原文（25行）</summary>

```text
  private async *streamCore(options: GenerateOptions, account?: string): AsyncIterable<StreamChunk> {
    const watchdog = idleWatchdog(options.signal, this.options.streamIdleTimeoutMs)
    try {
      let session = await this.options.tokens.session(account)
      let response = await this.request(options, session, watchdog.signal)
      if (response.status === 401) {
        // One forced refresh + retry on an unexpired-but-rejected token.
        session = await this.options.tokens.session(account, true)
        response = await this.request(options, session, watchdog.signal)
      }
      if (!response.ok) {
        throw await httpLlmError(response, 'codex API', {
          rateLimitReset: codexRateLimitReset,
          ...this.options.onWarn === undefined ? {} : { onWarn: this.options.onWarn },
        })
      }
      if (response.body === null) {
        throw new LlmError('codex API returned no response body', EMPTY_RESPONSE_CODE)
      }
      yield* streamResponses(response.body, () => { watchdog.pulse() })
    } catch (error: unknown) {
      throw mapFetchFailure('codex API', error, watchdog, options.signal)
    } finally {
      watchdog.stop()
    }
```

</details>

**依据 3 · 源码核查**：[src/providers/codex.ts:1094-1112](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/codex.ts#L1094-L1112)

实际POST与账号/session标识。

<details>
<summary>查看原文（19行）</summary>

```text
  private async request(options: GenerateOptions, session: CodexSession, signal: AbortSignal): Promise<Response> {
    const messages = await resolveImages(projectCodexMessages(options.messages), this.options.resolveAttachments?.(), signal)
    const fast = this.options.speedFor !== undefined
      && await this.options.speedFor(options.sessionId, options.model)
    const body = codexRequestBody(options, toResponsesInput(messages, options.system), fast)
    return proxiedFetch(CODEX_API_URL, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${session.accessToken}`,
        'chatgpt-account-id': session.accountId,
        'originator': 'codex_cli_rs',
        'session-id': deterministicSessionId(options.sessionId),
        'accept': 'text/event-stream',
        'content-type': 'application/json',
        ...attributionHeaders(),
      },
      body: JSON.stringify(body),
      signal,
    })
```

</details>

**依据 4 · 源码核查**：[src/providers/common.ts:386-427](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/common.ts#L386-L427)

并发刷新及新登录保护。

<details>
<summary>查看原文（42行）</summary>

```text
  async session(forceRefresh = false): Promise<S> {
    const session = await this.options.load()
    if (session === undefined) {
      throw new LlmError(
        `dsh-plugin-subscriptions: not logged in to ${this.options.displayName}; `
        + 'log in via Settings → Subscriptions in the dsh web app',
        'MISSING_CREDENTIAL',
      )
    }
    if (!forceRefresh && session.expiresAt - Date.now() > this.options.preemptMs) {
      return session
    }
    this.inflight ??= this.doRefresh(session).finally(() => {
      this.inflight = undefined
    })
    try {
      return await this.inflight
    } catch (error) {
      if (this.options.isPermanent(error)) {
        // A re-login may have landed while this refresh was failing: its
        // session carries a different refresh token, and deleting it would
        // log out an account that just signed in. Serve it instead.
        const attempted = this.attempted
        const stored = await this.options.load()
        if (stored !== undefined && attempted !== undefined && stored.refreshToken !== attempted.refreshToken) {
          return stored
        }
        await this.options.remove()
        this.options.onRemoved?.()
        throw new LlmError(
          `${this.options.displayName} login expired or was revoked; log in again via Settings → Subscriptions`,
          'INVALID_CREDENTIAL',
          { cause: error },
        )
      }
      if (!forceRefresh && session.expiresAt > Date.now()) {
        // Transient refresh failure with a still-valid token: use it.
        return session
      }
      throw error instanceof LlmError
        ? error
        : new LlmError(`${this.options.displayName} token refresh failed`, 'AUTH', { cause: error })
```

</details>

**依据 5 · 源码核查**：[src/auth/rpc.ts:638-665](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/auth/rpc.ts#L638-L665)

可选connection下的/api路由。

<details>
<summary>查看原文（28行）</summary>

```text
  // `connection` is not in this plugin's inject list (headless compositions
  // lack it), so its startup order is unconstrained: defer registration until
  // the service exists instead of probing once at apply time.
  //
  // Exact Fetch routes under `/api` rather than a dedicated `rpc.handle`
  // channel: since dsh 0.1.5 the connection plugin no longer injects
  // `webServer` itself, and `rpc.handle` resolves `webServer` through the
  // connection plugin's own fiber, so every dedicated channel registration
  // throws `cannot get property "webServer" without inject`. The `/api`
  // route is mounted by the connection plugin (with its own webServer scope)
  // and applies the same trust fence and browser authentication, so exact
  // routes below it work on both dsh lines.
  ctx.inject(['connection'], (ctx) => {
    const connection = ctx.get('connection') as HostConnectionHandle
    const handler: SubscriptionsRpcHandler = async (endpoint, payload, signal) => {
      try {
        return await dispatch(controller, speed, proxy, modelDefaults, endpoint, payload, signal, providerSettings)
      } catch (error) {
        return failure(error)
      }
    }
    const register = connection.fetch.register as unknown as FetchRegisterCompat
    for (const endpoint of SUBSCRIPTIONS_AUTH_ENDPOINTS) {
      ctx.effect(
        () => register(fetchRouteFor(endpoint, handler)),
        `dsh-plugin-subscriptions: /api/${SUBSCRIPTIONS_AUTH_PREFIX}${endpoint} route`,
      )
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多账号故障转移能否保证请求不重复、历史不串账号？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

池先选择候选账号并读到第一条非usage内容前才决定切换；空流和首个finish:error可分类失败并冷却，配额失败还使usage缓存失效。首个内容已送出后不再切换，后续失败原样交给调用者，避免拼接两个模型答案。这是输出边界控制，不是服务端恰好一次保证：没有收到输出不代表远端未处理请求。Replay将opaque状态绑定provider/account/model哈希，切换成员时去除不匹配状态，避免把前账号内部状态递给后账号；文本历史仍需要按目标wire转换。图像池明确只在确定认证/配额/权益拒绝时切换，超时/5xx等不自动重送，体现不同操作应有不同重试语义。真实供应商错误体、流中断和模型目录变更仍可能改变行为，不能用池机制代替验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/pool.ts:261-317](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/pool.ts#L261-L317)

首内容前失败分类与usage失效。

<details>
<summary>查看原文（57行）</summary>

```text
  private async *streamMembers(options: GenerateOptions, members: ConcretePoolMember[]): AsyncIterable<StreamChunk> {
    const candidates = await withAbortSignal(() => this.select(options.model, members, options.sessionId), options.signal)
    if (candidates.length === 0) throw this.exhausted(options.model, members)
    let lastFailure: MemberFailure | undefined
    let tried = 0
    for (const member of candidates) {
      options.signal?.throwIfAborted()
      const adapter = this.options.adapters[member.provider]
      if (adapter === undefined) continue
      tried += 1
      const iterator = streamAccountWithReplay(
        adapter, { ...options, provider: member.provider }, member.account, member.model,
      )[Symbol.asyncIterator]()
      let first: IteratorResult<StreamChunk>
      const leadingUsage: StreamChunk[] = []
      try {
        first = await iterator.next()
        // Usage is metadata, not delivered model content. Empty completions
        // commonly send usage before their terminal failure.
        while (!first.done && first.value.type === 'usage') {
          leadingUsage.push(first.value)
          first = await iterator.next()
        }
        if (first.done === true) {
          throw new LlmError(`${memberLabel(member)} returned an empty stream`, EMPTY_RESPONSE_CODE)
        }
        if (first.value.type === 'finish' && first.value.reason.kind === 'error') {
          const failure = first.value.reason.failure
          throw new LlmError(failure.message, failure.code, failure)
        }
      } catch (error: unknown) {
        try { await iterator.return?.() } catch { /* preserve the attempt failure */ }
        options.signal?.throwIfAborted()
        const classification = classifyPoolFailure(error, member.provider)
        if (classification.action === 'throw') throw error
        if ('cooldownMs' in classification) {
          this.options.health.markUnavailable(
            classification.scope === 'account'
              ? accountKey(member.provider, member.account)
              : memberKey(member.provider, member.account, member.model),
            classification.cooldownMs,
            classification.reason,
          )
          // A quota failure invalidates the cached usage snapshot so the NEXT
          // selection re-polls instead of trusting minutes-old percentages.
          // Transient/auth failures say nothing about quota — keep the cache.
          if (classification.reason === QUOTA_EXCEEDED_CODE || classification.reason === 'RATE_LIMIT') {
            this.options.usage.invalidate(member.provider, member.account)
          }
        }
        this.options.onWarn(
          `pool "${options.model}": ${memberLabel(member)} failed before any output`
          + ` (${describeFailure(error)}); trying the next member`,
        )
        lastFailure = { member, error }
        continue
      }
```

</details>

**依据 2 · 源码核查**：[src/providers/pool.ts:318-338](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/pool.ts#L318-L338)

输出后不切换并关闭流。

<details>
<summary>查看原文（21行）</summary>

```text
      this.remember(options.model, options.sessionId, member)
      // Past the first content chunk there is no clean attempt boundary: whatever
      // the member does next (including failing) reaches the caller as-is.
      // The finally closes the member stream when the CALLER walks away
      // early (break / .return()) — manual iteration does not propagate
      // closure the way `yield*` would, and a half-consumed member stream
      // must not linger holding its connection.
      try {
        yield* leadingUsage
        yield first.value
        for (let next = await iterator.next(); next.done !== true; next = await iterator.next()) {
          yield next.value
        }
      } finally {
        try {
          await iterator.return?.()
        } catch {
          // Closing a half-consumed member stream must not mask the outcome.
        }
      }
      return
```

</details>

**依据 3 · 源码核查**：[src/providers/replay.ts:7-39](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/replay.ts#L7-L39)

回放状态绑定实际成员。

<details>
<summary>查看原文（33行）</summary>

```text
/** Bind opaque provider replay to the concrete account/model behind a public route alias. */
export async function* streamAccountWithReplay(
  adapter: AccountAwareAdapter,
  options: GenerateOptions,
  account: string,
  model = options.model,
): AsyncIterable<StreamChunk> {
  const key = createHash('sha256').update(JSON.stringify([options.provider, account, model])).digest('hex')
  const messages = options.messages.map(message => {
    if (message.role !== 'assistant' || message.source?.replayState === undefined) return message
    const source = message.source
    if (source.replayState === null || typeof source.replayState !== 'object' || !('response' in source.replayState)) return message
    const replay = source.replayState as ReplayEnvelope
    const response = replay.response
    if (response !== null && typeof response === 'object' && 'kind' in response && response.kind === REPLAY_KIND) {
      if ('version' in response && response.version === 1 && 'key' in response && response.key === key && 'state' in response) {
        return { ...message, source: { ...source, provider: options.provider, model, replayState: { ...replay, response: response.state } } }
      }
      const { replayState: _discarded, ...withoutReplay } = source
      return { ...message, source: withoutReplay }
    }
    // Unwrapped older histories retain their existing direct-route behavior.
    // An alias alone cannot identify which concrete member produced old replay.
    if (source.provider === options.provider && source.model === model) return message
    const { replayState: _discarded, ...withoutReplay } = source
    return { ...message, source: withoutReplay }
  })
  for await (const chunk of adapter.streamAccount({ ...options, model, messages }, account)) {
    if (chunk.type === 'finish' && chunk.replayState !== undefined) {
      yield { ...chunk, replayState: { ...chunk.replayState, response: {
        kind: REPLAY_KIND, version: 1, key, state: chunk.replayState.response,
      } } }
    } else yield chunk
```

</details>

**依据 4 · 源码核查**：[src/providers/image-pool.ts:53-77](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/image-pool.ts#L53-L77)

图像只在确定拒绝后重试。

<details>
<summary>查看原文（25行）</summary>

```text
      try {
        let session = await tokens.session(account)
        signal.throwIfAborted()
        let response = await send(session)
        // Only a definitive unauthorized rejection permits retrying this account.
        if (response.status === 401) {
          await response.body?.cancel()
          session = await tokens.session(account, true)
          signal.throwIfAborted()
          response = await send(session)
        }
        signal.throwIfAborted()
        if (response.ok) {
          if (pooling && owner !== undefined) {
            let affinity = this.sticky.get(owner)
            if (affinity === undefined) { affinity = new Map(); this.sticky.set(owner, affinity) }
            affinity.set(provider, account)
          }
          return response
        }
        // Images can be produced despite timeouts/server failures. Switch only on
        // explicit auth/quota/entitlement rejection, never ambiguous transport/5xx.
        failure = await httpLlmError(response, 'image_generate', { rateLimitReset })
        if (![401, 402, 403, 404, 429].includes(response.status)) throw failure
      } catch (error) {
```

</details>

#### 缺口

- 未执行当前服务端故障体、流中断与跨账号工具历史验收
  **影响**：不能承诺无重复消耗或全部供应商兼容
  **进一步探讨**：用mock故障与获准非敏感真实短请求分别覆盖首内容前后、401和配额拒绝，核对账单与历史。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、兼容和退出成本是否可控？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要有实际权益的账号、供应商网络与可能的代理、精确匹配的DSH预发布版本及支持消息/工具契约。token以JSON持久化在用户目录，tmp+rename并设0600；这是文件访问限制和原子写，不是系统钥匙串加密。用户要承担本机账号与备份留存边界，logout/撤销授权和删除本地状态需按实际配置核对。多个账号可见目录合并、缓存和usage都增加运维复杂性；“模型可列出”不保证当前账号能推理或生成图片。首次成本包括登录、路由和兼容验收，持续成本包括订阅额度、附加工具和调试，失败成本包括重登、未确认请求和目录失效，金额与时间未知。先启单一供应商单账号、关闭池和额外媒体工具，用非敏感任务验收流式、工具结果和logout；出现账号路由不符、重复消耗或授权异常时停用并回原生客户端/API路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth/store.ts:427-438](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/auth/store.ts#L427-L438)

JSON0600临时文件与rename。

<details>
<summary>查看原文（12行）</summary>

```text
async function writeStore(store: SessionMap, path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  const tmp = `${path}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`
  try {
    await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 })
    // An existing destination keeps its old mode through rename on some
    // filesystems; enforce 0600 on the source before the swap.
    await chmod(tmp, 0o600)
    await rename(tmp, path)
  } catch (error) {
    await rm(tmp, { force: true })
    throw error
```

</details>

**依据 2 · 源码核查**：[src/providers/accounts.ts:83-104](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/accounts.ts#L83-L104)

账号目录失败被隔离，目录不等于调用成功。

<details>
<summary>查看原文（22行）</summary>

```text
export async function unionAccountCatalogs(
  accounts: readonly string[],
  listOne: (account: string, signal?: AbortSignal) => Promise<readonly LlmModelInfo[]>,
  options?: UnionAccountCatalogsOptions,
): Promise<LlmModelInfo[]> {
  const timeoutMs = options?.timeoutMs
  const caller = options?.signal
  const catalogs = await Promise.all(accounts.map(async account => {
    try {
      if (timeoutMs === undefined) return await listOne(account, caller)
      const models = await withTimeout(
        timeoutSignal => listOne(
          account,
          caller === undefined ? timeoutSignal : AbortSignal.any([timeoutSignal, caller]),
        ),
        timeoutMs,
      )
      return models ?? []
    } catch (error: unknown) {
      // One expired or failing account must not hide models the others list.
      if (caller?.aborted === true) throw error
      return []
```

</details>

**依据 3 · 作者声明**：[README.md:87-95](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/README.md#L87-L95)

作者明确版本与peer兼容限制。

```text
## Install

### DSH compatibility

Version `0.9.7` added support for DSH `0.2.0-rc.2`; DSH `0.2.1-alpha.2`, `0.2.1-alpha.3`, `0.2.1-rc.2` and `0.2.1-rc.3` are supported as well, with development dependencies pinned to `0.2.1-rc.2`. It handles request-only messages, first-class tool results, preparing tool views, and offloaded image placeholders while retaining legacy history translation. `0.2.1-rc.2` additionally requires tool arguments on every call head and takes the web runtime's provider overrides as `Volatile` refs. Other `0.2` prereleases are not implicitly allowed.

In DSH `0.2.1-rc.2`, the load-time check uses `engines.dsh` when declared; otherwise, every `@deepseek-ai/dsh` and `@deepseek-ai/dsh-*` peer must match the running DSH version. Prereleases participate in this check. This plugin does not declare `engines.dsh`, so its DSH peer ranges determine whether it can load. The `@deepseek-ai/cordis` and `@deepseek-ai/schemastery` peers affect package-manager dependency resolution, not this load-time check. They keep their `^4.0.1` / `^3.18.1` floors and also list the `4.0.5-alpha` / `3.18.5-alpha` builds bundled with DSH `0.2.1-alpha.2` and `0.2.1-alpha.3`, because those caret ranges exclude these prereleases under npm's default semver rules.

The current release supports the published DSH `0.1.1-rc.2`, `0.1.2-alpha`/`rc`, `0.1.3-alpha`, `0.1.5-alpha`/`rc`, and `0.1.7-rc` lines, including `0.1.5-rc.2` and `0.1.7-rc.2`. The `0.1.5-alpha.1` peer-range anchor intentionally covers the later `0.1.5-alpha`, `0.1.5-rc`, and stable `0.1.5` builds under npm semver rules; the `0.1.7-rc.1` anchor likewise covers the later `0.1.7-rc` and stable `0.1.7` builds. DSH `0.1.6-alpha` and `0.1.7-alpha` are not included until they have been separately verified.
```

**依据 4 · 源码核查**：[src/index.ts:1111-1121](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/index.ts#L1111-L1121)

池默认策略和账号选择。

<details>
<summary>查看原文（11行）</summary>

```text
    poolAdapter = new PoolAdapter({
      adapters: Object.fromEntries(memberAdapters),
      health: poolHealth,
      usage: poolUsage,
      strategy: poolConfig?.strategy ?? 'quota_aware',
      switchMargin: poolConfig?.switchMargin ?? 2,
      defaultAccount: provider => accountTokens.get(provider)?.defaultAccount() ?? Promise.resolve(undefined),
      resolveAccount: (provider, account) => accountTokens.get(provider)?.resolveAccount(account) ?? Promise.resolve(account),
      families,
      tiers: poolConfig?.tiers ?? {},
      onWarn,
```

</details>

#### 缺口

- 当前DSH版本、账号授权及退出清理未运行验证
  **影响**：只支持限定试用，不能保证生产可用或订阅节费
  **进一步探讨**：固定宿主与包版本，记录登录/流式/工具/额度/退出及所有留存文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把故障转移的技术边界变成用户可理解的保证？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将每次请求的实际供应商、账号别名、重试原因和“未确认远端结果”状态以最小事件账本呈现，能降低用户把首输出前故障转移误认为无成本重试的风险。现有池有警告与usage失效，replay有成员绑定，新增方向是把它们关联到同一请求并展示，不是再做一个账号池。最小验证对比现有日志与事件账本，让用户判断模拟401、配额拒绝、超时及输出后断流是否可重试，测误重放率、诊断时间与敏感信息暴露。若未减少误操作、泄露账号细节或维护负担超过收益，则否定。该设计尚未实现，也不能从多账号机制推断用户需要更多账号或愿意付费。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/pool.ts:304-320](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/pool.ts#L304-L320)

现有警告、usage失效与输出边界。

<details>
<summary>查看原文（17行）</summary>

```text
          // A quota failure invalidates the cached usage snapshot so the NEXT
          // selection re-polls instead of trusting minutes-old percentages.
          // Transient/auth failures say nothing about quota — keep the cache.
          if (classification.reason === QUOTA_EXCEEDED_CODE || classification.reason === 'RATE_LIMIT') {
            this.options.usage.invalidate(member.provider, member.account)
          }
        }
        this.options.onWarn(
          `pool "${options.model}": ${memberLabel(member)} failed before any output`
          + ` (${describeFailure(error)}); trying the next member`,
        )
        lastFailure = { member, error }
        continue
      }
      this.remember(options.model, options.sessionId, member)
      // Past the first content chunk there is no clean attempt boundary: whatever
      // the member does next (including failing) reaches the caller as-is.
```

</details>

**依据 2 · 源码核查**：[src/providers/replay.ts:14-26](https://github.com/V1ki/dsh-plugin-subscriptions/blob/7639ed9958a9a1c4159faa1f4e6e15e9ede60b7d/src/providers/replay.ts#L14-L26)

实际成员状态已有内部标识基础。

<details>
<summary>查看原文（13行）</summary>

```text
  const key = createHash('sha256').update(JSON.stringify([options.provider, account, model])).digest('hex')
  const messages = options.messages.map(message => {
    if (message.role !== 'assistant' || message.source?.replayState === undefined) return message
    const source = message.source
    if (source.replayState === null || typeof source.replayState !== 'object' || !('response' in source.replayState)) return message
    const replay = source.replayState as ReplayEnvelope
    const response = replay.response
    if (response !== null && typeof response === 'object' && 'kind' in response && response.kind === REPLAY_KIND) {
      if ('version' in response && response.version === 1 && 'key' in response && response.key === key && 'state' in response) {
        return { ...message, source: { ...source, provider: options.provider, model, replayState: { ...replay, response: response.state } } }
      }
      const { replayState: _discarded, ...withoutReplay } = source
      return { ...message, source: withoutReplay }
```

</details>

#### 缺口

- 请求账本需求、隐私约束和使用收益未验证
  **影响**：只能作为诊断设计假设
  **进一步探讨**：先收集匿名失败案例，再用合成故障对照误重放和信息泄露。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
