# dsh-commandcode-provider

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d08ede5](https://github.com/Mars-Sea/dsh-commandcode-provider/tree/d08ede5874e4bee2827cf438c971d3649f23d7c0)

<!-- BEGIN META -->
[![GitHub ★ 441](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=441&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mars-Sea/dsh-commandcode-provider) [![npm 30d 13,618](https://img.shields.io/static/v1?label=npm+30d&message=13%2C618&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mars-sea/dsh-commandcode-provider)
<!-- END META -->

> **功能**：将 Command Code 模型、账户和配额信息接入 DSH 的非官方供应商插件

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 在上游移植基础上组合DSH账户路由和有界错误处理，增量是集成而非新模型。

> **主要限制**：[Q03](#research-q03) 有界重试只限制部分失败，逆向协议依赖外部稳定性，ZDR请求和估计成本不能证明服务端留存或账单。

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
  - [Q01 · 谁需要它，已有能力与新增贡献怎样区分？](#detail-section-11)
  - [Q02 · 注册如何连到换账号和流式结果？](#detail-section-12)
  - [Q03 · 有界重试能保证什么，哪些承诺不能推出？](#detail-section-13)
  - [Q04 · 什么人可试用，怎样验证恢复值得复杂性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有Command Code账户的DSH用户，把供应商模型与账户信息接入当前profile。

Command Code官方客户端或手工供应商适配；模型质量与套餐能力不归插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 供应商接入 | 使用已有Command Code账户 | 非官方协议；需要自有账户与网络 |
| 账户轮换 | 恢复流前账户拒绝 | 不是流中无缝恢复保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配的DSH profile | 必需 | 注册供应商 | 先核准入范围，版本外暂停 |
| 自有Command Code账户与密钥 | 必需 | 鉴权/套餐模型 | 不发送请求，回官方客户端 |
| 可达API与网络 | 必需 | 连接和流式返回 | 预算耗尽后人工排查 |
| 多个账户 | 可选 | 流前轮换 | 单账户仍可使用，但无轮换收益 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核宿主版本并装独立profile | 模型卡和路由出现 |
| 2 | 用户配置自有密钥并发小额对话 | 实际模型/账户/结果可核对 |
| 3 | 用户验证取消和拒绝恢复 | 无重复无效切key；异常停用路由 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账户与本地环境 | 凭据/网络/宿主配置 | 当前套餐金额未查询 |
| 持续 | 供应商模型费用 | 核对配额和请求 | 估计不等于账单 |
| 失败恢复 | 重试可能产生请求成本 | 等待、切模型/账户及排障 | 总尝试成本未测 |
| 退出 | 原账户继续由用户管理 | 移除路由与清理凭据 | 官方客户端可作退路 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH接入 | adapter注册与流式链路 | 当前服务/宿主实机可用 |
| 恢复边界 | 流前tried集合和传输预算 | 任务成功率、总费用与时间 |

> **思考**：[Q03](#research-q03) 有界重试只限制部分失败，逆向协议依赖外部稳定性，ZDR请求和估计成本不能证明服务端留存或账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 在上游移植基础上组合DSH账户路由和有界错误处理，增量是集成而非新模型。

[Q02](#research-q02)、[Q03](#research-q03) 将模型级失效、账户级拒绝与传输预算区分，值得借鉴；外部逆向协议需持续维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 有界重试只限制部分失败，逆向协议依赖外部稳定性，ZDR请求和估计成本不能证明服务端留存或账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有账户者可在独立profile先做小额对话与取消测试；失败归属不清或费用异常时停止自动重试并回官方客户端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

供应商注册和部分故障分支有源码支持；服务可用、账单、留存及诊断收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/adapter.ts、src/transport-retry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根说明、供应商入口、adapter连接/轮换/收束接线及重试预算；未全面审计账户池、UI、隐私或服务端。
- 下一步：同模型和账户任务对比单账户手工切换与插件路径，注入断连/取消/拒绝，核对定位时间、总尝试和实际费用；收益不足即否定诊断假设。

**分析版本**

- **仓库**：[Mars-Sea/dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider)
- **版本号**：0.15.5（[固定提交 d08ede5](https://github.com/Mars-Sea/dsh-commandcode-provider/tree/d08ede5874e4bee2827cf438c971d3649f23d7c0)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 从分层拒绝机制推导失败归属/剩余预算可见性假设，对照定位时间、无效切key和总尝试；无改善或成本升高则推翻。

同模型和账户任务对比单账户手工切换与插件路径，注入断连/取消/拒绝，核对定位时间、总尝试和实际费用；收益不足即否定诊断假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 6184 | — | — | 219968 |
| .mjs | source | 18 | 4547 | 3368 | 986 | — |
| .mjs | test | 3 | 200 | 140 | 38 | — |
| .js | source | 2 | 23650 | 18982 | 5371 | — |
| .ts | source | 71 | 23255 | 14142 | 7960 | — |
| .tsx | source | 6 | 3909 | 3017 | 765 | — |
| .ts | test | 50 | 23749 | 19171 | 3091 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Mars-Sea/dsh-commandcode-provider/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：非官方供应商适配如何兼顾账户切换和有界故障恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要它，已有能力与新增贡献怎样区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已有Command Code账户、希望在DSH profile内使用对应模型的人。README明确非官方集成，移植自MIT许可pi-commandcode-provider；模型能力、套餐和服务可用性归供应商。相较切换到Command Code客户端或自行写适配，本插件把模型路由、账户状态与宿主设置组合进DSH，贡献在集成与故障处理。合格任务应完成同一模型对话/工具调用且能解释实际使用账户，不能把模型数量当业务收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-40](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/README.md#L13-L40)

上游归属、账户前提及目标功能

<details>
<summary>查看原文（28行）</summary>

```text
Unofficial [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) LLM provider plugin for **Command Code**, ported from [pi-commandcode-provider](https://github.com/patlux/pi-commandcode-provider) (MIT).

> Community integration. You need your own Command Code account, API key or subscription, and Command Code's terms apply. Not affiliated with Command Code, Inc.

## Quick start

| | |
|---|---|
| Verified engines | dsh `>=0.2.1-rc.2 <0.2.2-0` (every `0.2.1` RC from `0.2.1-rc.2` on) |
| Install — web | `dsh plugin --profile web add @mars-sea/dsh-commandcode-provider@latest` |
| Install — terminal | `dsh plugin --profile dsh-tui add @mars-sea/dsh-commandcode-provider@latest` |
| Config file | `$DSH_HOME/settings.yaml` → `llm-commandcode:` |
| API key env | `COMMANDCODE_API_KEY` |
| Usage dashboard | `/commandcode` |

## Features

- **Plugin bundle** — one `dsh plugin add` installs a `commandcode` provider route with the live model catalog.
- **Settings page** — accounts (keys, browser sign-in, live quota, dedicated models), model visibility, privacy switches, connection options.
- **Annotated catalog** — plan tier, deal/`FREE` badge, peak/off-peak, image support and context window in the picker; free models first.
- **Multi-account rotation** — an exhausted account hands over to the next one; pin a preferred account or route models to dedicated ones.
- **Browser sign-in** — run the official authorization flow from the settings page; the approved key lands in the local credential store.
- **Plans & quota panel** — optional sidebar card with the serving account's plan, 5-hour and weekly windows, balances and reset times.
- **Session cost estimate** — published-rate estimates (`≈`) beside the composer token counter, priced per request from durable session history.
- **Model analysis** — tokens, estimated cost, response timing and failures by session or date range. [Scope](docs/模型成本与性能分析.md).
- **Web search** — the dsh `web_search` tool is served by Command Code (`/alpha/web-search`) with the same key and endpoint as chat.
- **Zero data retention** — optional ZDR routing (`x-cmd-zdr: 1`), off by default.
- **Context & output limits** — override the metered context window globally or per model, and cap or omit the per-turn `max_tokens`.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注册如何连到换账号和流式结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index构造adapter时提供resolveApiKey和rotateApiKey，再注册为commandcode供应商。拒绝原因按账户健康或模型暂不可用区分，tried集合避免同一key反复轮换。adapter把请求序列化后connectGenerate，未流式输出前的账户拒绝才考虑换key；连接成功后交给settleStreamResponse处理流、取消与清理。实现支持模型级失效与密钥级失效分开，不应把某个模型无额度永久视作整把key无效。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:577-625](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/index.ts#L577-L625)

账户/模型分层标记及tried集合

<details>
<summary>查看原文（49行）</summary>

```text
  const adapter: CommandCodeAdapter<HostCommandCodeOptions> = new CommandCodeAdapter({
    options,
    resolveApiKey,
    // Pre-stream account-scoped rejection: mark the rejected key when the
    // reason warrants it and hand the adapter the next account's key. When
    // every account is unusable the pool's own RATE_LIMIT / INVALID_CREDENTIAL
    // error is what the caller sees, not the raw provider rejection.
    rotateApiKey: async (
      rejectedKey: string,
      rejection: AccountRotationReason,
      connection: HostCommandCodeOptions,
      model?: string,
      rotation?: { tried: readonly string[]; resetAtMs?: number },
    ): Promise<string | undefined> => {
      // Only the two account-health reasons become account marks: an
      // `unavailable` rejection (no credits, a model outside this account's
      // plan) says nothing durable about the KEY — a `:free` model is still
      // served by a credits-empty account. It does say something about this
      // account ON THIS MODEL, though, and forgetting that made every later
      // request pick the same doomed account first (issue #51's remaining
      // half). It therefore lands as a model-scoped, short-lived PREFERENCE
      // demotion: the same model skips the account for a few minutes, while
      // other models and `:free` models keep serving it. `rate-limit` and
      // `throttled` both mark but with different causes, so the pool's own
      // diagnosis never reports a plain throttle as an exhausted usage window
      // (issue #54).
      const accounts = scopedPool(connection)
      if (rejection !== 'unavailable') {
        accounts.markRejected(rejectedKey, rejection, rotation?.resetAtMs)
      } else if (model !== undefined) {
        accounts.markModelUnavailable(rejectedKey, model)
      }
      // The whole tried set, not just the rejected key, reaches the pool: a
      // rejection that does not mark the key would otherwise be re-offered on
      // every attempt and a four-account pool could never reach the accounts
      // behind it. The model rides along so model-routing rules pick the next
      // account for the same model. An EMPTY set must not be forwarded — the
      // pool reads it as "nothing was tried" and drops the filter this set
      // exists for.
      const tried = rotation?.tried?.length ? rotation.tried : [rejectedKey]
      const resolved = await accounts.resolveKey(
        model === undefined ? { tried } : { tried, model },
      )
      // Normalize like the initial resolution does: the pool keys its state
      // by the resolved key, so the adapter must send (and report back) the
      // same normalized form or the marks would miss.
      return resolved === undefined
        ? undefined
        : assertUsableApiKey(resolved.key, 'llm-commandcode', resolved.slot.ref ?? `${resolved.slot.label} (config.apiKey)`)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:644-647](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/index.ts#L644-L647)

真实供应商注册

```text
  ctx.llm.registerConfigurableProviders([
    { provider: PROVIDER, displayName: 'Command Code', settingsNs: NS, settingsPath: [] },
  ])
  ctx.llm.registerAdapter([PROVIDER], adapter)
```

**依据 3 · 源码核查**：[src/adapter.ts:3557-3563](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/adapter.ts#L3557-L3563)

轮换明确限制在流前

```text
    // Account rotation loop: the first attempt uses the pool's active key; a
    // pre-stream 429/401 rotates to the next account (at most one attempt per
    // distinct key, hard-capped so a misbehaving hook cannot loop forever).
    // requestTimeoutMs bounds the headers wait of EACH attempt (see
    // connectGenerate); the body is account-independent, nothing has
    // streamed yet, so the switch is invisible to the caller.
    const tried = new Set<string>()
```

**依据 4 · 源码核查**：[src/adapter.ts:3616-3626](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/adapter.ts#L3616-L3626)

序列化与连接

<details>
<summary>查看原文（11行）</summary>

```text
          try {
            serialized = JSON.stringify(body, (_key, value: unknown) => sanitizeSurrogates(value))
          } finally { finishSerialization() }
          serializedBodies.set(body, serialized)
        }
        const attempt = await connectGenerate(connectDeps, apiKey, protocol, serialized)
        if ('response' in attempt) {
          connected = attempt
          break
        }
        const providerError = parseProviderError(attempt.errText)
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:3681-3703](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/adapter.ts#L3681-L3703)

拒绝分类、取消及换账号

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[src/adapter.ts:3772-3777](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/adapter.ts#L3772-L3777)

连接后交给流式收束

```text
    const { response, cleanup } = connected
    yield* settleStreamResponse(response, {
      protocol, signal: options.signal, maxTokens,
      apiBase: connection.apiBase, streamIdleTimeoutMs: connection.streamIdleTimeoutMs,
      cleanup, trace, timing, responseMetadata,
    })
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有界重试能保证什么，哪些承诺不能推出？

**研究主题**：缺陷与关键质疑

#### 完整回答

TRANSPORT失败计数按逻辑请求限制，取消先于预算处理，耗尽抛出诊断；服务明确要求重试的窗口与普通传输错误采用不同规则。这能限制特定连接失败长时间挂住，但不能保证供应商成功，也不能将流前换账号扩展为流中无缝恢复。adapter说明协议来自逆向核对，外部通道变化会带来持续适配负担。ZDR是可选路由请求，README声明默认关闭；本轮不能验证服务端留存行为或真实账单。 预算并非仅由弱映射天然按请求隔离：index监听session/event，transportResetAction把step/start映射为reset后清计数；idle亦清理。该接线是“每逻辑请求预算”的源码依据，真实宿主是否按此时序发事件仍未执行验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:677-697](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/index.ts#L677-L697)

取消、瞬态与传输预算的实际分支

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

**依据 2 · 源码核查**：[src/transport-retry.ts:22-55](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/transport-retry.ts#L22-L55)

默认预算和计数

<details>
<summary>查看原文（34行）</summary>

```text
export const TRANSPORT_FAILURE_CODE = 'TRANSPORT'

/** Transport failures to absorb before the failure surfaces (default 5: ~15 s of blip cover on the route cadence). */
export const DEFAULT_TRANSPORT_MAX_RETRIES = 5

/** Ceiling for the setting above (plausibility bound, not a recommendation; mirrored in `Config`'s schema and pinned by tests). */
export const MAX_TRANSPORT_MAX_RETRIES = 50

/** Why {@link absorbTransportFailure} answered the way it did. */
export type TransportRetryDecision = 'retry' | 'exhausted' | 'ignored'

/** One agent's live transport-failure count, keyed weakly so a dropped agent cannot leak. */
const counts = new WeakMap<object, number>()

/**
 * Count one attempt's outcome against the transport budget.
 *
 * @param agent - the identity the budget is scoped to (the agent object).
 * @param failureCode - the failed attempt's `LlmFailure.code`.
 * @param maxRetries - transport retries to absorb before the failure surfaces.
 * @returns `'ignored'` for any non-transport code (the route policy decides
 *   those, unchanged), `'retry'` while the budget has room, `'exhausted'` once
 *   it does not.
 */
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

**依据 3 · 源码核查**：[src/adapter.ts:4-18](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/adapter.ts#L4-L18)

移植及逆向协议边界

<details>
<summary>查看原文（15行）</summary>

```text
 * Ported from pi-commandcode-provider@0.5.1 (MIT). This is an unofficial,
 * community-maintained integration; you need your own Command Code account
 * and API key or subscription, and Command Code's terms apply.
 *
 * Owns the three chat transports (`/alpha/generate`, `/provider/v1/chat/completions`,
 * `/provider/v1/messages`),
 * message conversion and the pre-stream account rotation loop. 目录、发布与
 * 上限事实由 ./gateway-facts.ts 持有，本适配器只消费单次调用的独立快照。 已连接响应的读取与收束由 ./stream-response.ts 负责。
 * The wire protocol is
 * reverse-engineered (command-code@1.28.4, re-verified through 1.73.0);
 * docs/agent-reference/adapter-protocol.md holds the full protocol record.
 *
 * The adapter is deliberately free of cordis/schemastery: it receives a
 * per-request options thunk and an API-key resolver from the plugin entry
 * (src/index.ts), so a settings change reaches the very next request.
```

</details>

**依据 4 · 作者声明**：[README.md:35-40](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/README.md#L35-L40)

费用估计和可选ZDR的作者声明

```text
- **Plans & quota panel** — optional sidebar card with the serving account's plan, 5-hour and weekly windows, balances and reset times.
- **Session cost estimate** — published-rate estimates (`≈`) beside the composer token counter, priced per request from durable session history.
- **Model analysis** — tokens, estimated cost, response timing and failures by session or date range. [Scope](docs/模型成本与性能分析.md).
- **Web search** — the dsh `web_search` tool is served by Command Code (`/alpha/web-search`) with the same key and endpoint as chat.
- **Zero data retention** — optional ZDR routing (`x-cmd-zdr: 1`), off by default.
- **Context & output limits** — override the metered context window globally or per model, and cap or omit the per-turn `max_tokens`.
```

**依据 5 · 源码核查**：[src/index.ts:699-728](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/index.ts#L699-L728)

真实session/event监听按reset动作清除当前agent预算，idle另清理。

<details>
<summary>查看原文（30行）</summary>

```text
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
    if (action === 'forget') {
      sessionAgents.delete(session)
      return
    }
    if (action !== 'reset') return
    const agent = sessionAgents.get(session)
    if (agent !== undefined) {
      resetTransportFailures(agent)
      resetTransientFailures(agent)
    }
  })
  ctx.on('agent/status', ({ agent, status }) => {
    if (status === 'idle') {
      resetTransportFailures(agent)
      resetTransientFailures(agent)
    }
```

</details>

**依据 6 · 源码核查**：[src/transport-retry.ts:59-82](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/transport-retry.ts#L59-L82)

重置映射明确step/start清计数；只看WeakMap计数函数不足以推出按请求重置。

<details>
<summary>查看原文（24行）</summary>

```text
export function resetTransportFailures(agent: object): void {
  counts.delete(agent)
}

/**
 * What one session event means for the transport budget.
 *
 * Pure and exported on purpose: the choice of event is the part of this design
 * that is easy to get plausibly wrong (see the module comment), so it is stated
 * once, where a test can pin it.
 *
 * @param type - the appended session event's type.
 * @returns `'reset'` for a new step, `'forget'` when the turn ended (the
 *   session → agent mapping is no longer needed), otherwise `'none'`.
 */
export function transportResetAction(type: string): 'reset' | 'forget' | 'none' {
  if (type === 'step/start') return 'reset'
  if (type === 'turn/end') return 'forget'
  return 'none'
}

/**
 * The diagnosis a capped turn ends with. Bilingual, because the harness renders
 * a failed turn's message verbatim and this plugin's other user-facing failures
```

</details>

#### 缺口

- 实际供应商协议、留存和计费行为未独立核验
  **影响**：不能将请求选项/估计当隐私保证或真实成本
  **进一步探讨**：用获授权账户核对返回、账单和服务条件，记录固定环境

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么人可试用，怎样验证恢复值得复杂性？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

可供已有账户且能接受非官方协议适配的用户在单独profile试用，先核宿主范围与凭据，再做小额对话及取消/拒绝路径。首次配置账户和网络，持续支付服务与模型费用，失败还需等待/切换并核对请求是否产生费用；退出改回原供应商或官方客户端。由模型级拒绝标记与tried集合推导未验证假设：呈现每次失败归属和剩余预算，比仅显示最终错误更能减少错误更换密钥。相同拒绝/断连任务对比人工定位时间、无效换key和总尝试；若诊断没有改善或额外重试提高成本，则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-25](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/README.md#L21-L25)

宿主范围、profile和凭据前提

```text
| Verified engines | dsh `>=0.2.1-rc.2 <0.2.2-0` (every `0.2.1` RC from `0.2.1-rc.2` on) |
| Install — web | `dsh plugin --profile web add @mars-sea/dsh-commandcode-provider@latest` |
| Install — terminal | `dsh plugin --profile dsh-tui add @mars-sea/dsh-commandcode-provider@latest` |
| Config file | `$DSH_HOME/settings.yaml` → `llm-commandcode:` |
| API key env | `COMMANDCODE_API_KEY` |
```

**依据 2 · 作者声明**：[README.md:64-68](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/README.md#L64-L68)

准入与已验证边界分开

```text
This build admits **dsh `>=0.2.1-rc.2 <0.2.2-0`** — every RC of the `0.2.1` channel from `0.2.1-rc.2` onward. `0.2.1-rc.2` is what npm `latest` runs and `0.2.1-rc.4` ships on `next`; `0.2.1-rc.2`, `0.2.1-rc.3` and `0.2.1-rc.4` are all covered by the full engine matrix (`npm run test:engine`, `npm run test:install`). A later `0.2.1-rc.5` is admitted without a plugin update, but stays unverified until a record is added to `dsh.compatibility.dshReleases`. The next minor is deliberately excluded, `0.2.2-rc.*` included — the upper bound is written `<0.2.2-0` for exactly that reason. A profile on `0.2.0-rc.2`, `0.2.1-alpha.5` or older must upgrade its engine first. Compatibility details — the `engines.dsh` admission rule, package pairings, evidence — live in [engine compatibility](docs/agent-reference/engine-compatibility.md).

**Older dsh releases** are no longer supported: the last plugin release for dsh 0.1.7 is `0.11.17`, for 0.1.2–0.1.6 it is `0.11.11`, and for the 0.5.0-era line `0.9.1` — all installed by exact version, none maintained.

> **pnpm 11 holds back new releases.** `minimumReleaseAge` defaults to 1440 minutes, so a version published less than a day ago is skipped and `@latest` resolves to the *previous* release — silently, with a success exit code. To install a release from the last 24 hours, name it exactly: `@mars-sea/dsh-commandcode-provider@0.11.15`. This applies to every profile, including the terminal UI below.
```

**依据 3 · 源码核查**：[src/index.ts:591-625](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/index.ts#L591-L625)

模型级/账户级拒绝依据

<details>
<summary>查看原文（35行）</summary>

```text
      // Only the two account-health reasons become account marks: an
      // `unavailable` rejection (no credits, a model outside this account's
      // plan) says nothing durable about the KEY — a `:free` model is still
      // served by a credits-empty account. It does say something about this
      // account ON THIS MODEL, though, and forgetting that made every later
      // request pick the same doomed account first (issue #51's remaining
      // half). It therefore lands as a model-scoped, short-lived PREFERENCE
      // demotion: the same model skips the account for a few minutes, while
      // other models and `:free` models keep serving it. `rate-limit` and
      // `throttled` both mark but with different causes, so the pool's own
      // diagnosis never reports a plain throttle as an exhausted usage window
      // (issue #54).
      const accounts = scopedPool(connection)
      if (rejection !== 'unavailable') {
        accounts.markRejected(rejectedKey, rejection, rotation?.resetAtMs)
      } else if (model !== undefined) {
        accounts.markModelUnavailable(rejectedKey, model)
      }
      // The whole tried set, not just the rejected key, reaches the pool: a
      // rejection that does not mark the key would otherwise be re-offered on
      // every attempt and a four-account pool could never reach the accounts
      // behind it. The model rides along so model-routing rules pick the next
      // account for the same model. An EMPTY set must not be forwarded — the
      // pool reads it as "nothing was tried" and drops the filter this set
      // exists for.
      const tried = rotation?.tried?.length ? rotation.tried : [rejectedKey]
      const resolved = await accounts.resolveKey(
        model === undefined ? { tried } : { tried, model },
      )
      // Normalize like the initial resolution does: the pool keys its state
      // by the resolved key, so the adapter must send (and report back) the
      // same normalized form or the marks would miss.
      return resolved === undefined
        ? undefined
        : assertUsableApiKey(resolved.key, 'llm-commandcode', resolved.slot.ref ?? `${resolved.slot.label} (config.apiKey)`)
```

</details>

**依据 4 · 源码核查**：[src/transport-retry.ts:86-98](https://github.com/Mars-Sea/dsh-commandcode-provider/blob/d08ede5874e4bee2827cf438c971d3649f23d7c0/src/transport-retry.ts#L86-L98)

预算耗尽诊断

<details>
<summary>查看原文（13行）</summary>

```text
export function transportBudgetMessage(failureMessage: string, maxRetries: number): string {
  return `${failureMessage}`
    + '；Command Code API 连接在连续重试后仍失败——已停止重试以免整轮卡死。'
    + `插件已自动重试 ${maxRetries} 次。通常说明当前网络到 api.commandcode.ai 的连接不通，`
    + '常见原因是代理未生效：DSH 只读取环境变量 HTTPS_PROXY/HTTP_PROXY（系统代理/PAC 不会被读取），'
    + '请确认启动 DSH 的终端里已导出代理，或先关闭代理直连后重试。网络恢复后直接重发即可'
    + ` — Command Code API transport still failed after ${maxRetries} automatic retries, which were`
    + ' stopped so the turn could not stall for minutes. This is a connectivity problem between this'
    + ' machine and api.commandcode.ai, not a context-window or request-size rejection. Common cause:'
    + ' the proxy is not reaching the harness — DSH reads HTTPS_PROXY/HTTP_PROXY from the environment'
    + ' only (a Windows system proxy/PAC setting is not consulted), so export it in the launching'
    + ' shell, or turn the proxy off and retry. Resend when the network recovers; the budget is per'
    + ' request and has been reset'
```

</details>

#### 缺口

- 同任务恢复时间、总尝试费用和诊断效果未测
  **影响**：无法证明多账户机制改善端到端成本
  **进一步探讨**：比较单账户手动切换与插件路径，含取消、断连、拒绝和账单核对

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
