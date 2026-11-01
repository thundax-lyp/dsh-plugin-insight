# DSH 订阅模型适配插件

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b802311](https://github.com/V1ki/dsh-plugin-subscriptions/tree/b8023110864494acefc6f5963c2a197d85dda20c)

<!-- BEGIN META -->
[![GitHub ★ 541](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=541&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/V1ki/dsh-plugin-subscriptions) [![npm 30d 11,004](https://img.shields.io/static/v1?label=npm+30d&message=11%2C004&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-subscriptions)
<!-- END META -->

> **功能**：将多个订阅 provider 的账号与可选候选池接入 DSH。

> **亮点**：[Q02](#research-q02) 接入多 provider 身份与账号管理，[Q03](#research-q03) 支持有限流式回退；并不创造模型或订阅权益。

> **主要限制**：[Q03](#research-q03) 首包前回退仍可能让多个账号处理输入，不能保证 exactly-once 或状态隔离。

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
  - [Q01 · 谁使用多订阅适配，相比原生客户端有何变化？](#detail-section-11)
  - [Q02 · 凭据和账号如何接入宿主？](#detail-section-12)
  - [Q03 · 账号池何时回退，能否保证不重复和不串身份？](#detail-section-13)
  - [Q04 · 账号、凭据和退出的成本如何？](#detail-section-14)
  - [Q05 · 怎样让回退边界更易审阅？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有适用订阅且希望在 DSH 会话中管理多账号的用户。

供应商客户端和 DSH 原生 API provider 已能调用模型；插件统一入口，但增加身份、配额和信任范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| provider 接入 | 统一 DSH 入口 | 需适用账号 |
| 账号管理 | 保存及刷新凭据 | 进程内串行不代表跨进程锁 |
| 候选池 | 首内容前回退 | 不保证 exactly-once |
| 设置界面 | 配置账号和模型 | 真实宿主未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 注册 provider | 无法接入 |
| 适用订阅与网络 | 必需 | 模型调用 | 无可用账号 |
| 安全凭据目录 | 必需 | 保存登录 | 停止配置 |
| 额外账号 | 可选 | 候选池回退 | 单账号使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认账号和数据范围 | 使用隔离 profile |
| 登录 | 用户授权 provider | 核对账号身份 |
| 调用 | Agent 发受控请求 | 核对候选和结果 |
| 退出 | 用户停池、撤权并处理文件 | 分别确认状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 订阅与宿主 | 登录配置 | 权益未知 |
| 持续 | 配额、网络和潜在重复计费 | 维护账号 | 净成本未测 |
| 失败 | 回退与请求资源 | 核对输出和身份 | 首包前上游可能处理 |
| 退出 | 凭据与服务状态 | 本地清理及远端撤权 | 各自确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| provider | 宿主注册账号路由 | 真实账号兼容 |
| 回退 | 首内容前分类处理 | 端到端 exactly-once |
| 存储 | 权限及进程内串行 | 跨进程安全 |

> **思考**：[Q03](#research-q03) 首包前回退仍可能让多个账号处理输入，不能保证 exactly-once 或状态隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 接入多 provider 身份与账号管理，[Q03](#research-q03) 支持有限流式回退；并不创造模型或订阅权益。

[Q02](#research-q02) 临时文件和进程内写链；[Q03](#research-q03) 输出前回退不保证供应商未处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 首包前回退仍可能让多个账号处理输入，不能保证 exactly-once 或状态隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先限定候选可接收数据范围，状态不明则停池回直连。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查代表账号、存储和池路由；未运行真实账号或宿主。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、src/auth/store.ts、src/providers/accounts.ts、src/providers/pool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查代表性 provider 注册、凭据存储及池流；未运行真实账号、宿主或各上游协议。
- 下一步：隔离模拟账号测试首块前后失败、取消、并发写和退出撤权。

**分析版本**

- **仓库**：[V1ki/dsh-plugin-subscriptions](https://github.com/V1ki/dsh-plugin-subscriptions)
- **版本号**：0.9.12（[固定提交 b802311](https://github.com/V1ki/dsh-plugin-subscriptions/tree/b8023110864494acefc6f5963c2a197d85dda20c)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议展示潜在接收账号及脱敏尝试状态，须以用户理解和泄漏对照。

隔离模拟账号测试首块前后失败、取消、并发写和退出撤权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 961 | — | — | 17293 |
| .mjs | source | 2 | 352 | 296 | 54 | — |
| .ts | source | 61 | 17526 | 12643 | 3982 | — |
| .tsx | source | 9 | 3330 | 2640 | 511 | — |
| .tsx | test | 3 | 127 | 123 | 0 | — |
| .mjs | test | 3 | 418 | 407 | 11 | — |
| .ts | test | 57 | 14039 | 12206 | 943 | — |

</details>

**活跃度**

[![Issue 未关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/V1ki/dsh-plugin-subscriptions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/V1ki/dsh-plugin-subscriptions/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/V1ki/dsh-plugin-subscriptions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查订阅账号接入、池回退和凭据范围。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用多订阅适配，相比原生客户端有何变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有适用模型订阅、希望在 DSH 切换 provider 或账号的用户。供应方原生客户端与 DSH API provider 已可调用模型；本插件将 OAuth、账号及 provider 映射到同一宿主选择器，可选账号池组织候选，不创造订阅权益或保证额度。支持名称是包的声明，具体账号、地区和模型可用性未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/package.json#L1-L8)

插件身份及声明的订阅。

```text
{
  "name": "dsh-plugin-subscriptions",
  "version": "0.9.12",
  "description": "Use ChatGPT (Codex), Claude, Grok (X Premium), GitHub Copilot, and Google Antigravity subscriptions as DeepSeek Harness LLM providers, with OAuth login from the web Settings page",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/V1ki/dsh-plugin-subscriptions.git"
```

**依据 2 · 源码核查**：[src/index.ts:811-823](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/index.ts#L811-L823)

注册 provider 及账号路由。

<details>
<summary>查看原文（13行）</summary>

```text
  let codexAdapter: CodexAdapter | undefined
  // Dropped on every copilot auth transition so replay state (captured
  // reasoning) never survives an account switch in memory.
  let copilotAdapter: CopilotAdapter | undefined
  const memberAdapters = new Map<ProviderId, AccountAwareAdapter>()
  const register = (provider: ProviderId, adapter: AccountAwareAdapter): AdapterRegistrationHandle => {
    const route = new AccountPreferencesAdapter({
      provider, adapter, settings: preferences, pool: () => poolAdapter,
      accounts: async () => (await accountTokens.get(provider)?.list() ?? []).map(({ key, session }) => ({ key, label: accountOf(provider, session) ?? key })),
    })
    memberAdapters.set(provider, route.poolMember())
    return ctx.llm.registerAdapter([provider], route)
  }
```

</details>

**依据 3 · 源码核查**：[src/providers/pool.ts:1-8](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L1-L8)

账号池定位和回退边界。

```text
/**
 * The pool adapter: same-subscription account routing, plus optional
 * configured tier extras. The picker is the union of every account's
 * catalog. A model listed by several accounts failovers; a model listed by
 * one account is pinned to it. Tiers are extra picker rows. Member
 * selection is sticky per session (so prompt caches survive) and optionally
 * quota-aware; failures fail over to the next member as long as no stream
 * content chunk has been emitted (leading usage remains buffered).
```

#### 缺口

- 无真实账号和任务对照
  **影响**：不能证明兼容或净收益
  **进一步探讨**：隔离 profile 使用授权账号比较直连与插件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据和账号如何接入宿主？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index.ts 为 provider 构造 AccountPreferencesAdapter，并经 ctx.llm.registerAdapter 注册；账号令牌管理按账号维护刷新实例。凭据文件写入临时文件，chmod 0600 后 rename；写操作通过进程内每路径 promise chain 串行，但不能由此推断磁盘加密、跨进程锁或上游授权安全。账号变更时清理相关状态，不能据此保证所有宿主与网络身份边界已验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:766-777](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/index.ts#L766-L777)

认证变化清除部分状态。

<details>
<summary>查看原文（12行）</summary>

```text
  const catalogChanged = (): void => {
    poolAdapter?.invalidate()
    for (const [route, handle] of handles) handle.replace([route])
  }
  const authChanged = (provider: ProviderId, account?: string): void => {
    if (provider === 'codex' || provider === 'grok') imagePool.clear(provider, account)
    // Login, logout, and credential death all pass through here; a copilot
    // auth transition also drops the adapter's captured reasoning replay
    // state (isolation is already account-scoped — this is memory hygiene).
    if (provider === 'copilot') copilotAdapter?.clearReplayState()
    adapters.get(provider)?.clearAccountCatalog(account)
    poolHealth?.clear(provider, account)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:811-823](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/index.ts#L811-L823)

provider 注册和账号路由。

<details>
<summary>查看原文（13行）</summary>

```text
  let codexAdapter: CodexAdapter | undefined
  // Dropped on every copilot auth transition so replay state (captured
  // reasoning) never survives an account switch in memory.
  let copilotAdapter: CopilotAdapter | undefined
  const memberAdapters = new Map<ProviderId, AccountAwareAdapter>()
  const register = (provider: ProviderId, adapter: AccountAwareAdapter): AdapterRegistrationHandle => {
    const route = new AccountPreferencesAdapter({
      provider, adapter, settings: preferences, pool: () => poolAdapter,
      accounts: async () => (await accountTokens.get(provider)?.list() ?? []).map(({ key, session }) => ({ key, label: accountOf(provider, session) ?? key })),
    })
    memberAdapters.set(provider, route.poolMember())
    return ctx.llm.registerAdapter([provider], route)
  }
```

</details>

**依据 3 · 源码核查**：[src/providers/accounts.ts:1-9](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/accounts.ts#L1-L9)

按账号的刷新管理。

```text
/**
 * Multi-account token plumbing: one {@link AccountTokenManager} per provider
 * owns a lazily-built {@link TokenManager} per account, so refresh coalescing
 * (`inflight`) and permanent-failure removal stay scoped to ONE account —
 * a revoked account deletes itself without touching its siblings.
 *
 * {@link AccountAwareAdapter} is the internal interface the pool uses to
 * stream through a specific account. A catalog model listed by several
 * accounts failovers; one listed by a single account is pinned to it.
```

**依据 4 · 源码核查**：[src/auth/store.ts:428-435](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/auth/store.ts#L428-L435)

临时写、权限和 rename。

```text
  await mkdir(dirname(path), { recursive: true })
  const tmp = `${path}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`
  try {
    await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 })
    // An existing destination keeps its old mode through rename on some
    // filesystems; enforce 0600 on the source before the swap.
    await chmod(tmp, 0o600)
    await rename(tmp, path)
```

**依据 5 · 源码核查**：[src/auth/store.ts:443-470](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/auth/store.ts#L443-L470)

进程内按路径串行。

<details>
<summary>查看原文（28行）</summary>

```text
 * One write chain per store path. Every mutation is a read-modify-write of a
 * single JSON file, and the plugin has several independent writers — a login,
 * a logout, and one token refresh per provider account, each on its own
 * schedule. Overlapping them unserialized costs whichever account read the
 * store first its entry.
 *
 * A chain is dropped once nothing is queued behind it, so the map holds an
 * entry only while writes are in flight.
 */
const writeChains = new Map<string, Promise<unknown>>()

/**
 * Run one read-modify-write of a store path after every write already queued
 * for it. Callers join the chain synchronously, so call order is write order.
 * @param path - the store file being mutated.
 * @param action - the read-modify-write to run.
 * @returns whatever `action` returns.
 */
async function serialize<T>(path: string, action: () => Promise<T>): Promise<T> {
  const previous = writeChains.get(path) ?? Promise.resolve()
  // Both handlers: a failed write must not strand everything queued behind it.
  const next = previous.then(action, action)
  const tail = next.then(() => undefined, () => undefined)
  writeChains.set(path, tail)
  try {
    return await next
  } finally {
    if (writeChains.get(path) === tail) writeChains.delete(path)
```

</details>

#### 缺口

- 未运行 OAuth、权限和多进程
  **影响**：无法证明所有平台凭据保护和刷新可靠
  **进一步探讨**：隔离账号测试权限、切换、刷新和并发写。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账号池何时回退，能否保证不重复和不串身份？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码按会话 sticky 选择候选并可按额度排序；请求尚未输出首个内容时缓冲 usage，若发生可分类失败可换候选，调用方取消会抛出。首个内容已交付后继续消费原流而非从这里再次选择，因此不是任意中断都可透明回退。回退仍可能把同一输入发送给多个获配置账号，首包之前上游是否已处理或计费未知；内容输出边界不证明端到端 exactly-once，也不自动证明供应商状态跨账号隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/pool.ts:1-8](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L1-L8)

sticky、候选和首内容前回退意图。

```text
/**
 * The pool adapter: same-subscription account routing, plus optional
 * configured tier extras. The picker is the union of every account's
 * catalog. A model listed by several accounts failovers; a model listed by
 * one account is pinned to it. Tiers are extra picker rows. Member
 * selection is sticky per session (so prompt caches survive) and optionally
 * quota-aware; failures fail over to the next member as long as no stream
 * content chunk has been emitted (leading usage remains buffered).
```

**依据 2 · 源码核查**：[src/providers/pool.ts:254-294](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L254-L294)

选择、缓冲 usage 和首块前失败。

<details>
<summary>查看原文（41行）</summary>

```text
  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const definition = (await withAbortSignal(() => this.pools(), options.signal)).get(poolKey(options.provider, options.model))
    if (definition === undefined) throw new LlmError(`unknown pool model "${options.model}"`, 'NO_ADAPTER')
    const members = await withAbortSignal(() => this.concrete(definition.members), options.signal)
    yield* this.streamMembers(options, members)
  }

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
```

</details>

**依据 3 · 源码核查**：[src/providers/pool.ts:291-335](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L291-L335)

分类、继续与交付后原流。

<details>
<summary>查看原文（45行）</summary>

```text
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
```

</details>

#### 缺口

- 未使用真实 provider 或模拟隐式副作用
  **影响**：不能证明不重复计费或历史隔离
  **进一步探讨**：受控服务测试首包前后故障、取消及账户转换。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 账号、凭据和退出的成本如何？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、适用账号和上游服务，多个账号需要分别授权与维护。凭据路径下文件权限受源码约束但仍是敏感数据，转发或回退可能扩大输入接收范围并增加计费；任何账号绑定与平台权益需用户自行核查。首次配置、持续刷新和额度、失败时确认在途请求、退出时分别撤销授权与清理本地文件均有人工成本；文件清理和远端撤权不是同一件事。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth/store.ts:428-435](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/auth/store.ts#L428-L435)

权限与文件写入。

```text
  await mkdir(dirname(path), { recursive: true })
  const tmp = `${path}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`
  try {
    await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 })
    // An existing destination keeps its old mode through rename on some
    // filesystems; enforce 0600 on the source before the swap.
    await chmod(tmp, 0o600)
    await rename(tmp, path)
```

**依据 2 · 源码核查**：[src/providers/pool.ts:254-294](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L254-L294)

请求按候选发送。

<details>
<summary>查看原文（41行）</summary>

```text
  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const definition = (await withAbortSignal(() => this.pools(), options.signal)).get(poolKey(options.provider, options.model))
    if (definition === undefined) throw new LlmError(`unknown pool model "${options.model}"`, 'NO_ADAPTER')
    const members = await withAbortSignal(() => this.concrete(definition.members), options.signal)
    yield* this.streamMembers(options, members)
  }

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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:811-823](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/index.ts#L811-L823)

宿主依赖和路由注册。

<details>
<summary>查看原文（13行）</summary>

```text
  let codexAdapter: CodexAdapter | undefined
  // Dropped on every copilot auth transition so replay state (captured
  // reasoning) never survives an account switch in memory.
  let copilotAdapter: CopilotAdapter | undefined
  const memberAdapters = new Map<ProviderId, AccountAwareAdapter>()
  const register = (provider: ProviderId, adapter: AccountAwareAdapter): AdapterRegistrationHandle => {
    const route = new AccountPreferencesAdapter({
      provider, adapter, settings: preferences, pool: () => poolAdapter,
      accounts: async () => (await accountTokens.get(provider)?.list() ?? []).map(({ key, session }) => ({ key, label: accountOf(provider, session) ?? key })),
    })
    memberAdapters.set(provider, route.poolMember())
    return ctx.llm.registerAdapter([provider], route)
  }
```

</details>

#### 缺口

- 未实测网络、费用和卸载
  **影响**：不能保证删除令牌即撤销服务授权
  **进一步探讨**：隔离测试并分别核对宿主文件、服务授权和在途请求。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让回退边界更易审阅？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有按会话 sticky、首内容前才回退和健康分类；单加失败重试或账号列表不构成新机制。未验证方案是在提交含敏感内容的首个可回退请求前显示可能接收输入的账号范围，并在发生切换后保留不含内容的来源和尝试状态；用户仍需决定该范围是否可接受。对照现有 UI 测误解率、额外交互和日志泄漏；如不能降低误解或成本不可接受则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/providers/pool.ts:1-8](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L1-L8)

已有首内容前回退。

```text
/**
 * The pool adapter: same-subscription account routing, plus optional
 * configured tier extras. The picker is the union of every account's
 * catalog. A model listed by several accounts failovers; a model listed by
 * one account is pinned to it. Tiers are extra picker rows. Member
 * selection is sticky per session (so prompt caches survive) and optionally
 * quota-aware; failures fail over to the next member as long as no stream
 * content chunk has been emitted (leading usage remains buffered).
```

**依据 2 · 源码核查**：[src/providers/pool.ts:261-294](https://github.com/V1ki/dsh-plugin-subscriptions/blob/b8023110864494acefc6f5963c2a197d85dda20c/src/providers/pool.ts#L261-L294)

具体尝试与取消。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

#### 缺口

- 方案未实现、无用户评测
  **影响**：不能声称降低隐私风险
  **进一步探讨**：以模拟账号和脱敏请求对照用户理解及日志内容。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
