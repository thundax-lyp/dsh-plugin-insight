# DSH Command Code Provider

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5c5a0db](https://github.com/Mars-Sea/dsh-commandcode-provider/tree/5c5a0db24d5797d8a40cd873133ef7814ca2540a)

<!-- BEGIN META -->
[![GitHub ★ 447](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=447&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mars-Sea/dsh-commandcode-provider) [![npm 30d 13,208](https://img.shields.io/static/v1?label=npm+30d&message=13%2C208&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中接入 Command Code 模型与账户。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将上游模型和账户整合到 DSH；模型质量与可用性属于上游。

> **主要限制**：[Q03](#research-q03) 分层重试不能证明远端未执行，[Q04](#research-q04) 本地 ZDR 请求头与价格估算不能证明留存政策或账单。

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
  - [Q01 · 哪类已有账户用户通过插件做什么，与直接使用服务或原生模型供应商相比有何增量？](#detail-section-11)
  - [Q02 · 请求如何选择账户、建立流并转成宿主消息？](#detail-section-12)
  - [Q03 · 失败重试何时切账户，哪些请求或费用可能重复？](#detail-section-13)
  - [Q04 · 凭据、上下文和费用边界是什么？](#detail-section-14)
  - [Q05 · 用户需要什么依赖、如何试用并回退？](#detail-section-15)
  - [Q06 · 能否让用户准确识别失败层次和不可知费用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Command Code 账户的 DSH 用户希望在当前宿主调用其模型。

可直接使用 Command Code 或切回 DSH 已有供应商；模型能力由上游提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型供应商 | 在 DSH 路由聊天请求 | 需要账户、密钥和服务 |
| 账户轮换 | 处理特定前流拒绝 | 不保证上游未处理请求 |
| 传输预算 | 限制特定 transport 重试 | 其他层还有独立分支 |
| ZDR 请求选项 | 请求零留存路由 | 默认关闭，实际承诺需向上游核验 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| Node >=24.9 与兼容 DSH | 插件需要 | 装载 provider 和客户端 | 启动或兼容失败 |
| Command Code 账户与密钥 | 模型调用需要 | 身份认证 | 请求被拒 |
| 外部服务和网络 | 请求需要 | 接收模型流 | 失败并受预算约束 |
| 多账户 | 可选 | 特定拒绝时切换 | 无替代账户时直接失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核实账户、宿主及允许发送的内容 | 数据不允许外发时停止 |
| 配置 | 提供凭据并选择模型与隐私选项 | 密钥不出现在报告中 |
| 调用 | 先发单个非敏感请求 | 检查流是否完整 |
| 恢复 | 核查错误、请求历史和账单 | 状态未知时暂停重发并切回原供应商 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账户、网络费用未知 | 配置密钥和宿主 | 版本兼容未测 |
| 持续 | 模型实际计费未知 | 核对输出和账户用量 | ZDR 与目录价可能不同 |
| 恢复 | 重试可能产生未知费用 | 核查错误与账单 | 是否收到上游请求未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接入 | provider 注册与请求构造 | 服务可用与质量 |
| 账户轮换 | 特定前流拒绝切换候选 | 远端恰好一次 |
| 隐私选项 | 按配置发送 ZDR 头 | 上游真实留存和训练策略 |

> **思考**：[Q03](#research-q03) 分层重试不能证明远端未执行，[Q04](#research-q04) 本地 ZDR 请求头与价格估算不能证明留存政策或账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将上游模型和账户整合到 DSH；模型质量与可用性属于上游。

[Q02](#research-q02) 请求按账户和协议发送，[Q03](#research-q03) 的 transport 与账户轮换预算分层，不能当统一幂等保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 分层重试不能证明远端未执行，[Q04](#research-q04) 本地 ZDR 请求头与价格估算不能证明留存政策或账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 已有账户的用户可先用非敏感单轮核对模型输出与账单；目标、留存或请求结果不明时暂停并退回原供应商。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本供应商注册、请求与部分错误分支已查；未运行宿主或外部服务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/adapter.ts、src/transport-retry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交 README、清单、provider 入口、adapter、账户轮换、传输重试及隐私请求代表分支；未运行宿主、模型、上游或网络，未穷尽 UI、账户池和所有搜索路径。
- 下一步：用假服务区分请求前、响应丢失、账户拒绝及流中断；按 [Q06](#research-q06) 核对收据、实际尝试及服务商账单。

**分析版本**

- **仓库**：[Mars-Sea/dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider)
- **版本号**：0.16.3（[固定提交 5c5a0db](https://github.com/Mars-Sea/dsh-commandcode-provider/tree/5c5a0db24d5797d8a40cd873133ef7814ca2540a)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设脱敏逐次收据和未知状态可改善失败与费用判断；尚未实现或验证。

用假服务区分请求前、响应丢失、账户拒绝及流中断；按 [Q06](#research-q06) 核对收据、实际尝试及服务商账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 6367 | — | — | 236175 |
| .mjs | source | 18 | 4664 | 3457 | 1010 | — |
| .mjs | test | 3 | 214 | 152 | 39 | — |
| .js | source | 2 | 24017 | 19215 | 5534 | — |
| .ts | source | 72 | 23533 | 14261 | 8110 | — |
| .tsx | source | 6 | 3988 | 3081 | 781 | — |
| .ts | test | 52 | 24139 | 19462 | 3152 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Mars-Sea/dsh-commandcode-provider/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=24&color=737b86&logo=github)](https://github.com/Mars-Sea/dsh-commandcode-provider/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/Mars-Sea/dsh-commandcode-provider/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查账户模型路由、重试、数据及费用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类已有账户用户通过插件做什么，与直接使用服务或原生模型供应商相比有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:13-15 将本项描述为社区维护的非官方 Command Code 供应商移植，需要用户自己的账户和密钥；package.json:1-4 声明 DSH 模型卡和动态模型目录。index.ts:642-647 将 provider 与 adapter 注册到宿主。与直接使用 Command Code 或 DSH 已有供应商相比，具体增量是把既有服务接到 DSH 模型选择、消息协议和账户设置；模型能力、价格与服务可用性属于上游，不能以适配层推断其质量或净收益。未做同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-15](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L13-L15)

作者说明移植、身份和账户要求。

```text
Unofficial [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) LLM provider plugin for **Command Code**, ported from [pi-commandcode-provider](https://github.com/patlux/pi-commandcode-provider) (MIT).

> Community integration. You need your own Command Code account, API key or subscription, and Command Code's terms apply. Not affiliated with Command Code, Inc.
```

**依据 2 · 源码核查**：[package.json:1-4](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/package.json#L1-L4)

包的功能描述与版本。

```text
{
  "name": "@mars-sea/dsh-commandcode-provider",
  "version": "0.16.3",
  "description": "Unofficial DeepSeek Harness LLM provider plugin for Command Code, ported from pi-commandcode-provider (MIT). Registers the 'commandcode' provider route with a Models-page card and live model catalog.",
```

**依据 3 · 源码核查**：[src/index.ts:642-647](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L642-L647)

宿主注册 provider 与 adapter。

```text
  // The Models page card. An empty `settingsPath` means the whole
  // `llm-commandcode` section configures this provider.
  ctx.llm.registerConfigurableProviders([
    { provider: PROVIDER, displayName: 'Command Code', settingsNs: NS, settingsPath: [] },
  ])
  ctx.llm.registerAdapter([PROVIDER], adapter)
```

#### 缺口

- 无直接 API、其他宿主供应商和真实任务对照
  **影响**：无法量化质量、成本或节时
  **进一步探讨**：固定模型、提示和预算对照服务直连与 DSH 路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求如何选择账户、建立流并转成宿主消息？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index.ts:642-647 注册 adapter；adapter.ts:1580-1604 的依赖契约描述按连接配置和模型解析密钥，前流阶段的账户拒绝可询问下一个账户，已尝试集合防止重复提供。2357-2394 将序列化消息和 Bearer 密钥通过选定协议 POST；2422-2437 把非成功响应转为状态、错误和可选 retry-after。adapter.ts:3784-3798 将成功 response 交给流收束器；实际模型目录、格式转换和服务器是否正确处理需另测。源码中的账户范围判定不证明供应商端尚未处理或计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:642-647](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L642-L647)

注册宿主供应商。

```text
  // The Models page card. An empty `settingsPath` means the whole
  // `llm-commandcode` section configures this provider.
  ctx.llm.registerConfigurableProviders([
    { provider: PROVIDER, displayName: 'Command Code', settingsNs: NS, settingsPath: [] },
  ])
  ctx.llm.registerAdapter([PROVIDER], adapter)
```

**依据 2 · 源码核查**：[src/adapter.ts:1580-1604](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L1580-L1604)

密钥解析与前流切换契约。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Resolve the current connection facts (fresh per request, settings-aware). */
  options: () => C
  /**
   * Resolve a usable API key for the given connection facts and the request's
   * model id, or throw `MISSING_CREDENTIAL`. The model is optional: hosts
   * without model-aware routing ignore it.
   */
  resolveApiKey: (connection: C, model?: string) => Promise<string>
  /**
   * Multi-account rotation hook: the request sent with `rejectedKey` was
   * refused before any response body streamed, for an account-scoped reason
   * (see {@link AccountRotationReason}). The host marks that key when the
   * reason warrants it and returns the next account's key to retry with, or
   * `undefined` to surface the failure. Only pre-stream rejections rotate — a
   * mid-stream failure never replays a partially consumed generation against
   * another account.
   *
   * `rotation.tried` lists every key this request has already used (the
   * just-rejected one included). The host must not offer one of them again:
   * with several accounts a rejection that does not mark the key (a plan or
   * balance rejection is model-specific, not account-fatal) would otherwise
   * re-offer the same account on every attempt and the pool could never reach
   * the accounts behind it. `rotation.resetAtMs` carries the provider's own
   * reset time when the rejection body published one, so the host can hold the
   * key out until then instead of waiting for a billing probe to learn the
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:2357-2394](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L2357-L2394)

请求头、正文与 POST。

<details>
<summary>查看原文（38行）</summary>

```text
  let response: Response
  // Enforce ZDR on every chat request when selected. The provider is the
  // routing authority: an unsupported model (or unavailable ZDR capacity)
  // fails with 422 rather than sending the prompt through a retaining upstream.
  // Never omit the header based on a client-side capability snapshot.
  const zdr = connection.zdr === true
  const sharedHeaders = {
    'Content-Type': 'application/json',
    ...IDENTITY_ENCODING_HEADER,
    Authorization: `Bearer ${key}`,
    ...(zdr ? { 'x-cmd-zdr': '1' } : {}),
    ...attributionHeaders(),
  }
  const headers = protocol === 'cli'
    ? {
        ...sharedHeaders,
        'x-command-code-version': COMMAND_CODE_CLI_VERSION,
        'x-cli-environment': 'production',
        'x-project-slug': projectSlugFromPath(connection.workingDir),
        'x-taste-learning': 'false',
        'x-co-flag': 'false',
      }
    : {
        ...sharedHeaders,
        Accept: 'text/event-stream',
        // Deliberately no x-command-code-version / x-cli-environment on either
        // documented Provider API surface: those identify the CLI transport,
        // not a public API client. ZDR is the one business header both share.
      }
  // 请求体由调用层缓存，同协议换账号只替换请求头，不重复序列化历史。
  const finishHeaders = deps.timing.attempt(protocol, Buffer.byteLength(serializedBody))
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers,
      body: serializedBody,
      signal: connectAbort.signal,
    })
```

</details>

**依据 4 · 源码核查**：[src/adapter.ts:2422-2437](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L2422-L2437)

拒绝响应与 retry-after。

<details>
<summary>查看原文（16行）</summary>

```text
  deps.onResponse(response)
  if (!response.ok) {
    let errText: string
    try {
      errText = await readGenerateErrorBody(response, connectAbort, connection.requestTimeoutMs)
      if (options.signal?.aborted) throw options.signal.reason ?? new DOMException('已取消请求', 'AbortError')
    } finally {
      cleanup()
    }
    const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'))
    // exactOptionalPropertyTypes: the key must be absent, not undefined.
    return retryAfterMs === undefined
      ? { status: response.status, errText }
      : { status: response.status, errText, retryAfterMs }
  }
  return { response, cleanup }
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:3784-3798](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L3784-L3798)

成功响应交由流处理。

<details>
<summary>查看原文（15行）</summary>

```text
      )
    }
    if (connected === undefined) {
      // Unreachable: the loop only exits via `break` or `throw`. The guard
      // keeps the narrowing explicit.
      throw new LlmError('Command Code API connection failed without a response', 'TRANSPORT')
    }
    const { response, cleanup } = connected
    yield* settleStreamResponse(response, {
      protocol, signal: options.signal, maxTokens,
      apiBase: connection.apiBase, streamIdleTimeoutMs: connection.streamIdleTimeoutMs,
      cleanup, trace, timing, responseMetadata,
    })
  }
}
```

</details>

#### 缺口

- 未运行账户、消息格式、流解析或上游服务
  **影响**：无法证明真实兼容、输出质量及账单
  **进一步探讨**：以隔离测试账户和假服务覆盖成功、拒绝与中断。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败重试何时切账户，哪些请求或费用可能重复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

adapter.ts:3700-3730 只对分类为账户级的前流拒绝，在未取消、未超账户轮换上限且存在新账户时重试；1589-1595 明确已开始的流不会为切换账户而重放。与此同时，index.ts:649-664、677-697 为 transport 错误配置独立预算，transport-retry.ts:21-28、46-55 默认最多 5 次、上限 50；step/start 重置预算。不同层还可能因协议转换或 413 处理有其他请求，故单个切账户规则不能推出每个逻辑请求恰好一次。响应丢失或 transport 失败时不能据此断定远端未收到或没有费用，实际请求及计费未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:1589-1604](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L1589-L1604)

流中不因账户切换重放。

<details>
<summary>查看原文（16行）</summary>

```text
   * Multi-account rotation hook: the request sent with `rejectedKey` was
   * refused before any response body streamed, for an account-scoped reason
   * (see {@link AccountRotationReason}). The host marks that key when the
   * reason warrants it and returns the next account's key to retry with, or
   * `undefined` to surface the failure. Only pre-stream rejections rotate — a
   * mid-stream failure never replays a partially consumed generation against
   * another account.
   *
   * `rotation.tried` lists every key this request has already used (the
   * just-rejected one included). The host must not offer one of them again:
   * with several accounts a rejection that does not mark the key (a plan or
   * balance rejection is model-specific, not account-fatal) would otherwise
   * re-offer the same account on every attempt and the pool could never reach
   * the accounts behind it. `rotation.resetAtMs` carries the provider's own
   * reset time when the rejection body published one, so the host can hold the
   * key out until then instead of waiting for a billing probe to learn the
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:3700-3730](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L3700-L3730)

账户拒绝、轮换与去重。

<details>
<summary>查看原文（31行）</summary>

```text
        const rotate = this.deps.rotateApiKey
        // Account-scoped rejection (429/RATE_LIMITED, 401, or "this account
        // cannot serve"): retry the same body with another account when the host
        // has one. The tried set travels along so a rejection that does not mark
        // the key cannot make the pool re-offer it forever.
        const rejection = classifyAccountRejection(attempt.status, attempt.errText, providerError)
        if (
          rejection !== undefined
          && rotate !== undefined
          && options.signal?.aborted !== true
          && tried.size < MAX_ACCOUNT_ROTATIONS
        ) {
          const next = await rotate(apiKey, rejection.reason, connection, options.model, {
            tried: [...tried],
            ...(rejection.resetAtMs !== undefined && { resetAtMs: rejection.resetAtMs }),
          })
          if (next !== undefined && !tried.has(next)) {
            apiKey = next
            // 降级只描述上一账号；新账号必须按自己的套餐/缓存重新选择通道。
            // 权限拒绝同理：它属于刚被换下的那把密钥，不能跟着新账号继续报。
            messagesPermissionRejection = undefined
            const nextProtocol = this.resolveProtocol(connection, apiKey, options.model, modelEntry)
            if (nextProtocol !== protocol) {
              protocol = nextProtocol
              requestOptions = withSurfaceOffload(
                options, this.surfaceOffload, REQUEST_IMAGE_BUDGETS[0]!,
                connection.offloadSeenImagesForCache === true && protocol === 'cli' ? options.model : undefined,
              )
              body = await buildBody(protocol)
            }
            continue
```

</details>

**依据 3 · 源码核查**：[src/transport-retry.ts:21-28](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/transport-retry.ts#L21-L28)

transport 默认及最大预算。

```text
/** Failure code this budget covers. */
export const TRANSPORT_FAILURE_CODE = 'TRANSPORT'

/** Transport failures to absorb before the failure surfaces (default 5: ~15 s of blip cover on the route cadence). */
export const DEFAULT_TRANSPORT_MAX_RETRIES = 5

/** Ceiling for the setting above (plausibility bound, not a recommendation; mirrored in `Config`'s schema and pinned by tests). */
export const MAX_TRANSPORT_MAX_RETRIES = 50
```

**依据 4 · 源码核查**：[src/transport-retry.ts:46-55](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/transport-retry.ts#L46-L55)

只对目标错误计数。

<details>
<summary>查看原文（10行）</summary>

```text
export function absorbTransportFailure(
  agent: object,
  failureCode: string,
  maxRetries: number,
): TransportRetryDecision {
  if (failureCode !== TRANSPORT_FAILURE_CODE) return 'ignored'
  const used = counts.get(agent) ?? 0
  if (used >= maxRetries) return 'exhausted'
  counts.set(agent, used + 1)
  return 'retry'
```

</details>

**依据 5 · 源码核查**：[src/index.ts:649-664](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L649-L664)

独立 transport 预算及等待责任。

<details>
<summary>查看原文（16行）</summary>

```text
  // Bounded retry for TRANSPORT failures (issue #39). The route policy allows
  // long recovery for a confirmed usage window; ordinary 520s now have their
  // own three-retry cap. A connection that cannot be established needs its
  // separate budget, or the shared cadence
  // turned a 10-second connect timeout into an ~8-minute stall, so the first
  // few transport failures are absorbed here and the rest surface with a
  // diagnosis. `dsh-llm-retry` still owns the wait between allowed attempts.
  //
  // The failure is surfaced by THROWING out of the waterfall: the agent loop
  // wraps the rejection into the turn's error, so the retry chain stops here.
  // The failure's own message is carried in the thrown message, and the
  // diagnostic also goes to the log, which nothing can rewrite.
  const transportMaxRetries = (): number => {
    const value = current().transportMaxRetries
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return DEFAULT_TRANSPORT_MAX_RETRIES
    return Math.min(Math.trunc(value), MAX_TRANSPORT_MAX_RETRIES)
```

</details>

**依据 6 · 源码核查**：[src/index.ts:677-697](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L677-L697)

失败预算和停止。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('agent/request-error', async ({ agent, provider, failure, signal }, next) => {
    // Checked BEFORE the budget: a cancelled turn is the user's own stop, so it
    // must neither be answered with a retry nor consume the slot a later live
    // failure needs.
    if (signal.aborted || provider !== PROVIDER) return next()
    const session: unknown = Reflect.get(agent, 'session')
    if (typeof session === 'object' && session !== null) sessionAgents.set(session, agent)
    const transient = absorbTransientFailure(agent, failure.code)
    if (transient === 'exhausted') throw new Error(transientBudgetMessage(failure.code, failure.message))
    // 只约束次数；仍由官方重试器决定退避和 Retry-After，避免即时重发。
    if (transient === 'retry') return next()
    const decision = absorbTransportFailure(agent, failure.code, transportMaxRetries())
    if (decision === 'ignored') return next()
    // The literal is spelled as the event's own decision type; the union this
    // handler returns (`RequestErrorAction | Promise<RequestErrorAction>`) is
    // what the waterfall accepts, and `{ kind: 'retry' }` alone widens to
    // `string` and stops matching it.
    if (decision === 'retry') return { kind: 'retry' } satisfies RequestErrorAction
    const message = transportBudgetMessage(failure.message, transportMaxRetries())
    ctx.logger.warn(`llm-commandcode: transport retry budget exhausted for ${PROVIDER} (${TRANSPORT_FAILURE_CODE})`)
    throw new Error(message)
```

</details>

**依据 7 · 源码核查**：[src/index.ts:698-712](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L698-L712)

预算 reset 作用域。

<details>
<summary>查看原文（15行）</summary>

```text
  })
  // Reset the budget at each new STEP — one step is exactly one model request
  // (`step/start` is appended immediately before the call), so this is what
  // makes the cap "per logical request" and gives the next step of the same
  // turn its own grace. `agent/status` → `idle` is deliberately NOT the reset
  // signal: `setPhase` emits it only on a status CHANGE, and a turn's steps run
  // inside one `running` phase, so it never fires between them — a budget reset
  // only there would be per-turn, and a network outage would fail every later
  // step of that turn instantly instead of retrying each. `assistant/attempt`
  // is wrong for the opposite reason: the loop appends it for the FAILED
  // attempt before dispatching `agent/request-error`, so resetting on it would
  // clear the budget on every failure. `idle` still clears the agent's count,
  // and the WeakMap drops a finished session on its own.
  ctx.on('session/event', (session, event) => {
    const action = transportResetAction(event.type)
```

</details>

**依据 8 · 源码核查**：[src/adapter.ts:3670-3698](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L3670-L3698)

协议与 413 的独立处理。

<details>
<summary>查看原文（29行）</summary>

```text
        ) {
          const wasMessages = protocol === 'messages'
          if (messagesPermissionDenied) {
            messagesPermissionRejection = providerError.code ?? providerError.type
          }
          protocol = 'cli'
          if (!wasMessages) this.rememberProtocol(connection.apiBase, apiKey, 'cli')
          requestOptions = withSurfaceOffload(
            options, this.surfaceOffload, REQUEST_IMAGE_BUDGETS[0]!,
            connection.offloadSeenImagesForCache === true ? options.model : undefined,
          )
          body = await buildBody('cli')
          continue
        }
        // Request too large (issue #37): the standing budget is only an
        // estimate — the cap also covers text and tool bytes — so one 413 steps
        // the image budget down and asks for another offload, as a durable
        // surface mutation rather than a local edit, so the extra omissions
        // survive the retry. Zero missing means the images are already gone and
        // the body is simply too big: fall through to the 413 diagnosis instead
        // of asking for an offload that cannot happen, which is also what keeps
        // the branch from looping.
        if (attempt.status === 413 && REQUEST_IMAGE_BUDGETS.length > 1) {
          const missing = this.surfaceOffload.requiredImageOffload(
            requestOptions.messages,
            coreBudget(REQUEST_IMAGE_BUDGETS[1]!),
            imageVersionBytes,
          )
          if (missing > 0) throw imageOffloadRequired(missing)
```

</details>

#### 缺口

- 未测服务收到请求后丢响应、各层重试和账单
  **影响**：不能断言上游一次执行或费用为零
  **进一步探讨**：假服务计数并让真实隔离账户按服务商账单对账。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、上下文和费用边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

index.ts:397-399 默认 zdr=false；adapter.ts:2357-2394 在配置开启时将 x-cmd-zdr: 1 连同 Bearer 密钥及序列化消息发给服务。README:221-229 称该选项要求零留存上游，不满足会 422，并指出 ZDR 实际价格可能不同于普通目录估算；这是作者对外部服务及计费的说明，源码只能证明本地发送头，不能证明上游真实留存、训练或账单。README:239-246 还称卸载保留凭据，清理必须另行核对。发送模型上下文前应确认配置、授权与目的地；本次未审计所有账户和搜索链路。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:397-399](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L397-L399)

ZDR 默认关闭。

```text
  // Off by default: turning it on changes which upstream serves the request
  // (and usually what it costs), so nobody gets ZDR routing by accident.
  zdr: z.boolean().default(false),
```

**依据 2 · 源码核查**：[src/adapter.ts:2357-2394](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L2357-L2394)

鉴权、可选 ZDR 头和请求正文。

<details>
<summary>查看原文（38行）</summary>

```text
  let response: Response
  // Enforce ZDR on every chat request when selected. The provider is the
  // routing authority: an unsupported model (or unavailable ZDR capacity)
  // fails with 422 rather than sending the prompt through a retaining upstream.
  // Never omit the header based on a client-side capability snapshot.
  const zdr = connection.zdr === true
  const sharedHeaders = {
    'Content-Type': 'application/json',
    ...IDENTITY_ENCODING_HEADER,
    Authorization: `Bearer ${key}`,
    ...(zdr ? { 'x-cmd-zdr': '1' } : {}),
    ...attributionHeaders(),
  }
  const headers = protocol === 'cli'
    ? {
        ...sharedHeaders,
        'x-command-code-version': COMMAND_CODE_CLI_VERSION,
        'x-cli-environment': 'production',
        'x-project-slug': projectSlugFromPath(connection.workingDir),
        'x-taste-learning': 'false',
        'x-co-flag': 'false',
      }
    : {
        ...sharedHeaders,
        Accept: 'text/event-stream',
        // Deliberately no x-command-code-version / x-cli-environment on either
        // documented Provider API surface: those identify the CLI transport,
        // not a public API client. ZDR is the one business header both share.
      }
  // 请求体由调用层缓存，同协议换账号只替换请求头，不重复序列化历史。
  const finishHeaders = deps.timing.attempt(protocol, Buffer.byteLength(serializedBody))
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers,
      body: serializedBody,
      signal: connectAbort.signal,
    })
```

</details>

**依据 3 · 作者声明**：[README.md:221-229](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L221-L229)

作者描述服务端 ZDR 与价格条件。

```text
## Zero data retention (ZDR)

Command Code can serve a request only through upstreams that retain no prompts or completions and never train on them — the same opt-in the official CLI exposes as `CMD_ZDR=1`, and the `x-cmd-zdr: 1` header on the Provider API ([official docs](https://commandcode.ai/docs/resources/zdr)).

**Off by default.** Turn it on with the *"Zero data retention (ZDR)"* toggle (`zdr`) in the Privacy & security card, or in your profile config.

- The header is sent on **every chat request** while ZDR is on. A model without an available ZDR upstream fails with `422 cmd_zdr_no_providers`; the request is never retried without the header.
- If a refusal still happens (coverage churn, or no spare ZDR capacity at that moment), the error names the cause and how to turn ZDR off instead of surfacing as a bare HTTP 422.
- **ZDR usually costs more**: capacity is limited and billed at each upstream's pass-through rates, and which upstream serves a request can change per request. The session-cost readout keeps quoting the ordinary catalog rates; the real per-request price shows in Command Code's Studio usage page.
```

**依据 4 · 作者声明**：[README.md:239-246](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L239-L246)

作者描述网络、凭据及卸载。

```text
## Permissions & privacy

The plugin only communicates between your local dsh profile and your Command Code account: locally it touches only the credential store and the models cache (plus `~/.commandcode/auth.json` as a last-resort fallback); on the network it calls only the Command Code API. No telemetry. With **zero data retention** on, chat requests require a ZDR upstream; models without one fail instead of running without the protection.

## Disabling / uninstalling

- **Disable** without removing: edit your profile's `cordis.patch.yml` and comment out (or remove) the `llm-commandcode` row, or set `disabled: true`, then restart.
- **Uninstall** completely: `dsh plugin --profile web remove @mars-sea/dsh-commandcode-provider`. Your API key in the dsh credential store and `~/.commandcode/auth.json` are left untouched.
```

#### 缺口

- 未独立验证服务端数据政策、搜索、账单和凭据删除
  **影响**：不能保证零留存或估算等于实付
  **进一步探讨**：合成数据检查请求与关闭方式，按上游账单及协议独立核验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 用户需要什么依赖、如何试用并回退？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:1-4、24-32、65-67 声明插件 0.16.3、Node >=24.9 和 DSH 精确范围；README:13-15 指用户需 Command Code 账户和密钥。这些声明不是当前宿主验收，套餐、服务网络和认证故障均影响效果。首次需配置凭据和宿主，持续需支付上游实际费用并核使用量，失败时查账户拒绝、传输预算和流结果；退出可停用插件切回既有模型路由，卸载后凭据仍需单独处理。API 实际价格、人工排障时间和故障重试费用未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/package.json#L1-L4)

包名与版本。

```text
{
  "name": "@mars-sea/dsh-commandcode-provider",
  "version": "0.16.3",
  "description": "Unofficial DeepSeek Harness LLM provider plugin for Command Code, ported from pi-commandcode-provider (MIT). Registers the 'commandcode' provider route with a Models-page card and live model catalog.",
```

**依据 2 · 源码核查**：[package.json:24-32](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/package.json#L24-L32)

DSH 兼容声明。

```text
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "compatible",
        "0.2.1-rc.5": "compatible",
        "0.2.2-alpha.2": "compatible"
      },
      "dsh": ">=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-alpha.2 <0.2.3-0"
```

**依据 3 · 源码核查**：[package.json:65-67](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/package.json#L65-L67)

Node 与 DSH 引擎声明。

```text
  "engines": {
    "node": ">=24.9",
    "dsh": ">=0.2.1-rc.2 <0.2.2-0 || >=0.2.2-alpha.2 <0.2.3-0"
```

**依据 4 · 作者声明**：[README.md:13-15](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L13-L15)

作者要求账户与密钥。

```text
Unofficial [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) LLM provider plugin for **Command Code**, ported from [pi-commandcode-provider](https://github.com/patlux/pi-commandcode-provider) (MIT).

> Community integration. You need your own Command Code account, API key or subscription, and Command Code's terms apply. Not affiliated with Command Code, Inc.
```

**依据 5 · 作者声明**：[README.md:243-246](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L243-L246)

作者说明停用及凭据保留。

```text
## Disabling / uninstalling

- **Disable** without removing: edit your profile's `cordis.patch.yml` and comment out (or remove) the `llm-commandcode` row, or set `disabled: true`, then restart.
- **Uninstall** completely: `dsh plugin --profile web remove @mars-sea/dsh-commandcode-provider`. Your API key in the dsh credential store and `~/.commandcode/auth.json` are left untouched.
```

**依据 6 · 源码核查**：[src/index.ts:677-697](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L677-L697)

错误预算与失败路径。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('agent/request-error', async ({ agent, provider, failure, signal }, next) => {
    // Checked BEFORE the budget: a cancelled turn is the user's own stop, so it
    // must neither be answered with a retry nor consume the slot a later live
    // failure needs.
    if (signal.aborted || provider !== PROVIDER) return next()
    const session: unknown = Reflect.get(agent, 'session')
    if (typeof session === 'object' && session !== null) sessionAgents.set(session, agent)
    const transient = absorbTransientFailure(agent, failure.code)
    if (transient === 'exhausted') throw new Error(transientBudgetMessage(failure.code, failure.message))
    // 只约束次数；仍由官方重试器决定退避和 Retry-After，避免即时重发。
    if (transient === 'retry') return next()
    const decision = absorbTransportFailure(agent, failure.code, transportMaxRetries())
    if (decision === 'ignored') return next()
    // The literal is spelled as the event's own decision type; the union this
    // handler returns (`RequestErrorAction | Promise<RequestErrorAction>`) is
    // what the waterfall accepts, and `{ kind: 'retry' }` alone widens to
    // `string` and stops matching it.
    if (decision === 'retry') return { kind: 'retry' } satisfies RequestErrorAction
    const message = transportBudgetMessage(failure.message, transportMaxRetries())
    ctx.logger.warn(`llm-commandcode: transport retry budget exhausted for ${PROVIDER} (${TRANSPORT_FAILURE_CODE})`)
    throw new Error(message)
```

</details>

#### 缺口

- 未核实固定宿主、账号与实际账单
  **影响**：不能保证兼容、低成本或恢复时间
  **进一步探讨**：非敏感单回合试用，核对输出、状态和账单。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否让用户准确识别失败层次和不可知费用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有实现已有账户拒绝分类、已尝试集合、transport 重试预算与诊断，adapter.ts:2386-2395 还记录请求尝试计时，因此再加泛用错误日志不构成增量。未验证设想是在用户可见的单次任务收据中汇总每次尝试的脱敏账户别名、协议、失败层次、共享/分层剩余预算和仅本地拒绝/交给 transport/未知的证据状态；收费仅列服务端确认的金额，否则为 unknown，不保存密钥或提示内容。以现有错误/诊断为对照，构造无效密钥、账户额度拒绝、429、建连前失败、请求已发但响应丢失、流中断和取消，比较错误切换账户、重复发出次数、未知误判、恢复时间与隐私泄露。若把未知写成未发送或零费用、暴露敏感数据、误切账户不降或新增成本过高则否定；需宿主及客户端暴露可靠边界，尚未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:3700-3730](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L3700-L3730)

现有账户分类与已试集合。

<details>
<summary>查看原文（31行）</summary>

```text
        const rotate = this.deps.rotateApiKey
        // Account-scoped rejection (429/RATE_LIMITED, 401, or "this account
        // cannot serve"): retry the same body with another account when the host
        // has one. The tried set travels along so a rejection that does not mark
        // the key cannot make the pool re-offer it forever.
        const rejection = classifyAccountRejection(attempt.status, attempt.errText, providerError)
        if (
          rejection !== undefined
          && rotate !== undefined
          && options.signal?.aborted !== true
          && tried.size < MAX_ACCOUNT_ROTATIONS
        ) {
          const next = await rotate(apiKey, rejection.reason, connection, options.model, {
            tried: [...tried],
            ...(rejection.resetAtMs !== undefined && { resetAtMs: rejection.resetAtMs }),
          })
          if (next !== undefined && !tried.has(next)) {
            apiKey = next
            // 降级只描述上一账号；新账号必须按自己的套餐/缓存重新选择通道。
            // 权限拒绝同理：它属于刚被换下的那把密钥，不能跟着新账号继续报。
            messagesPermissionRejection = undefined
            const nextProtocol = this.resolveProtocol(connection, apiKey, options.model, modelEntry)
            if (nextProtocol !== protocol) {
              protocol = nextProtocol
              requestOptions = withSurfaceOffload(
                options, this.surfaceOffload, REQUEST_IMAGE_BUDGETS[0]!,
                connection.offloadSeenImagesForCache === true && protocol === 'cli' ? options.model : undefined,
              )
              body = await buildBody(protocol)
            }
            continue
```

</details>

**依据 2 · 源码核查**：[src/index.ts:677-697](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/index.ts#L677-L697)

现有传输预算和诊断。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('agent/request-error', async ({ agent, provider, failure, signal }, next) => {
    // Checked BEFORE the budget: a cancelled turn is the user's own stop, so it
    // must neither be answered with a retry nor consume the slot a later live
    // failure needs.
    if (signal.aborted || provider !== PROVIDER) return next()
    const session: unknown = Reflect.get(agent, 'session')
    if (typeof session === 'object' && session !== null) sessionAgents.set(session, agent)
    const transient = absorbTransientFailure(agent, failure.code)
    if (transient === 'exhausted') throw new Error(transientBudgetMessage(failure.code, failure.message))
    // 只约束次数；仍由官方重试器决定退避和 Retry-After，避免即时重发。
    if (transient === 'retry') return next()
    const decision = absorbTransportFailure(agent, failure.code, transportMaxRetries())
    if (decision === 'ignored') return next()
    // The literal is spelled as the event's own decision type; the union this
    // handler returns (`RequestErrorAction | Promise<RequestErrorAction>`) is
    // what the waterfall accepts, and `{ kind: 'retry' }` alone widens to
    // `string` and stops matching it.
    if (decision === 'retry') return { kind: 'retry' } satisfies RequestErrorAction
    const message = transportBudgetMessage(failure.message, transportMaxRetries())
    ctx.logger.warn(`llm-commandcode: transport retry budget exhausted for ${PROVIDER} (${TRANSPORT_FAILURE_CODE})`)
    throw new Error(message)
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:2386-2395](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/src/adapter.ts#L2386-L2395)

现有传输尝试计时。

<details>
<summary>查看原文（10行）</summary>

```text
  // 请求体由调用层缓存，同协议换账号只替换请求头，不重复序列化历史。
  const finishHeaders = deps.timing.attempt(protocol, Buffer.byteLength(serializedBody))
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers,
      body: serializedBody,
      signal: connectAbort.signal,
    })
    finishHeaders(response.status)
```

</details>

**依据 4 · 作者声明**：[README.md:227-229](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/5c5a0db24d5797d8a40cd873133ef7814ca2540a/README.md#L227-L229)

作者说明 ZDR 与估算账单限制。

```text
- The header is sent on **every chat request** while ZDR is on. A model without an available ZDR upstream fails with `422 cmd_zdr_no_providers`; the request is never retried without the header.
- If a refusal still happens (coverage churn, or no spare ZDR capacity at that moment), the error names the cause and how to turn ZDR off instead of surfacing as a bare HTTP 422.
- **ZDR usually costs more**: capacity is limited and billed at each upstream's pass-through rates, and which upstream serves a request can change per request. The session-cost readout keeps quoting the ordinary catalog rates; the real per-request price shows in Command Code's Studio usage page.
```

#### 缺口

- 没有用户收据原型、可信发送边界或对账结果
  **影响**：无法证明降低错误重试和成本误判
  **进一步探讨**：以假服务逐阶段计数并对账隔离账户。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
