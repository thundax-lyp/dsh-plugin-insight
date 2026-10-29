# DSH Codex Subscription

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3afece2](https://github.com/WSL043/dsh-codex-subscription/tree/3afece2715009b8adcb4ae3cecdc4b456a75e9d0)

<!-- BEGIN META -->
[![GitHub ★ 297](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=297&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/dsh-codex-subscription) [![npm 30d 28,753](https://img.shields.io/static/v1?label=npm+30d&message=28%2C753&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription)
<!-- END META -->

> **功能**：以托管 OAuth 将订阅 Codex 模型接入 DSH，并提供额度恢复和可选跨模型工具能力。

> **亮点**：把订阅认证和模型请求接入DSH已有工具循环，并按连接器模式及显式远控开关划分能力，减少另开入口的潜在步骤。模型/应用本身不算原创。见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：适配主provider不保证当前账号权益或全部附加功能；连接器分类依赖上游，write免逐次确认，未知远端写结果需核对。review特例重试不等于所有半流无损恢复。见[Q02](#research-q02)至[Q05](#research-q05)。

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
  - [Q01 · 谁需要订阅适配，比API连接或单独Codex入口多什么？](#detail-section-11)
  - [Q02 · OAuth、模型请求与失败恢复怎样接线？](#detail-section-12)
  - [Q03 · 跨模型连接器、生图和子任务如何授权？](#detail-section-13)
  - [Q04 · 移动远控与依赖、实际使用怎样闭环？](#detail-section-14)
  - [Q05 · 全周期成本和效果有什么证据？](#detail-section-15)
  - [Q06 · 谁可试用，未来方向如何检验？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有合格账号、想沿用DSH会话/工具的人可减少切换入口，是否值得以任务正确与维护负担衡量。见[Q01](#research-q01)。

DSH API provider或单独Codex入口是直接替代；插件增加订阅和DSH接线、跨模型工具，代价是协议/身份/权限维护，不保证权益或净费用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：可选连接器search/describe/call和生图编辑，按模式和账号能力。
- **后台**：托管OAuth、模型adapter与额度等待/特例重试。
- **Host 路由**：认证/api RPC与本地native voice额外门禁。
- **Agent/Preset**：可选Codex子任务provider，继承sandbox并禁部分features。
- **界面**：作者有额度/图片/手机入口，本轮未全审客户端。

**流程与依赖**

账号实际资格、明确peer版本、托管凭据与网络层是主门槛，连接器/图片/子任务/手机独立验收。依赖和流程表见[Q04](#research-q04)。

保留原provider，先登录/目录/小任务，再按需分别开放只读、图片和写能力，未知写结果先核对。步骤和失败动作见[Q04](#research-q04)。

**效果与成本**

经济性取决于实际额度占用、额外调用与维护等待，已有订阅不等于零成本。分阶段成本和效果表见[Q05](#research-q05)。

DSH工作流复用可能减少切换，但扩展数据方和工具权限也增加审核负担；保留/停止条件及可证伪方向见[Q06](#research-q06)。

> **思考**：适配主provider不保证当前账号权益或全部附加功能；连接器分类依赖上游，write免逐次确认，未知远端写结果需核对。review特例重试不等于所有半流无损恢复。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把订阅认证和模型请求接入DSH已有工具循环，并按连接器模式及显式远控开关划分能力，减少另开入口的潜在步骤。模型/应用本身不算原创。见[Q01](#research-q01)至[Q03](#research-q03)。

同快照token/账号、托管record、保守readOnlyHint和有限恢复有具体实现；宿主加密、远端幂等、全部runtime/协议仍未知。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

适配主provider不保证当前账号权益或全部附加功能；连接器分类依赖上游，write免逐次确认，未知远端写结果需核对。review特例重试不等于所有半流无损恢复。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试主provider非敏感任务，连接器默认off/read、远控关闭，写用ask；分别验证再扩。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持托管OAuth、adapter、有限review重试/额度等待、连接器门禁和可选能力接线；账号资格、实际模型/工具/远控结果未登录运行验证。授权结果账为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/account-vault.js、src/codex-images.js、src/connectors.js、src/credential-store.js、src/index.js、src/pi-ai-runtime.js、src/quota-retry.js、src/remote-control-dsh.js、src/settings-contract.js、src/subagent-backend.js、src/subscription-credentials.js、src/subscription-transport.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审主provider/凭据vault、OAuth和普通/review事件流、额度恢复、连接器读写、图片请求/保存、子任务策略及远控默认/RPC门禁；未全审voice、sketch、远控协议/加密、全部搜索/compaction/账户管理或外部依赖实现。
- 下一步：未登录、读真实凭据或运行目标；后续固定账号/宿主核请求、半流、额度取消/切账号、应用审批与未知结果、生图落盘和可选面退出，记录正确交付与修正。见[Q04](#research-q04)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[WSL043/dsh-codex-subscription](https://github.com/WSL043/dsh-codex-subscription)
- **版本号**：3.2.1（[固定提交 3afece2](https://github.com/WSL043/dsh-codex-subscription/tree/3afece2715009b8adcb4ae3cecdc4b456a75e9d0)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

逐能力记录模型/账号/数据方/权限和实际或未知结果，验证能否减少越意图数据流与误重放而保持可接受审核成本。见[Q06](#research-q06)。

未登录、读真实凭据或运行目标；后续固定账号/宿主核请求、半流、额度取消/切账号、应用审批与未知结果、生图落盘和可选面退出，记录正确交付与修正。见[Q04](#research-q04)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 28 | 2340 | 2074 | 146 | — |
| .md | source | 41 | 3505 | — | — | 62940 |
| .js | source | 167 | 58344 | 54808 | 4094 | — |
| .jsx | source | 47 | 5817 | 5576 | 103 | — |
| .mjs | test | 163 | 23289 | 21282 | 580 | — |
| .md | example | 1 | 12 | — | — | 106 |
| .mjs | example | 1 | 96 | 88 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 42](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=42&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 42](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=42&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：订阅模型和工具循环在DSH的适配能否带来正确交付，凭据/权限/恢复与可选能力边界是否可管理？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要订阅适配，比API连接或单独Codex入口多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有具备相应Codex资格的ChatGPT账号、希望继续在DSH使用原有会话和工具的人，是直接对象。原办法是在DSH配API provider，或到单独Codex入口做任务再搬运结果；插件把订阅OAuth、模型目录/额度及DSH adapter接起来，并可把搜索、生图与已连接应用供其他DSH模型调用。合格结果是授权账号下正确模型执行任务，额度、工具权限和失败可解释，而非只登录成功。

固定包3.2.1是原生host/client插件。核心依赖pi-ai的openai-codex provider，叠加DSH设置、模型目录、认证、推理/压缩桥、观察和重试，真正注册ctx.llm adapter。插件贡献是协议和宿主能力接线；模型智能、订阅权益、ChatGPT应用以及DSH原生工具并非其原创。

README的Plus/Pro、GPT-6和兼容范围是作者说明，本轮未登录确认当前账号开放模型、资格或上游长期允许性。API和订阅的计量/功能边界不同，不能说接入即替代所有API用途。只需要稳定单一官方入口或不愿管理第三方适配者，新增层可能不值得。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-11](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/README.md#L9-L11)

作者订阅和模型用途声明。

```text
**把 ChatGPT / Codex 订阅直接接入 DeepSeek Harness**

用 ChatGPT Plus / Pro 订阅登录，即可在 DSH 中使用 GPT-6 等 Codex 模型、查额度、联网搜索和生图。无需 OpenAI API Key，也不依赖 Codex CLI。
```

**依据 2 · 作者声明**：[README.md:24-34](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/README.md#L24-L34)

作者功能与账号返回为准说明。

<details>
<summary>查看原文（11行）</summary>

```text

## 核心功能

| 你想做什么 | 插件提供什么 |
| --- | --- |
| **聊天与搜索** | 用订阅登录，选择账号开放的 Codex 模型、推理档位和速度档位，使用订阅联网搜索。 |
| **管理账号与额度** | 切换账号，查看短周期与每周额度、Credits 和重置时间；在输入框看额度、接收提醒，查看历史用量。 |
| **生成与编辑图片** | 用订阅出图、圈选区域继续修改，或在可编辑草图画板上自己画、让 Agent 画。[查看实例 →](#图片与草图) |
| **在手机上继续操作** | 用 ChatGPT 手机 App 配对电脑上的 DSH，DeepSeek 等其他模型也能用。[Beta，默认关闭 →](#手机远程控制beta) |
| **使用已连接的应用** | 让 DSH 模型使用 ChatGPT 中已连接的 GitHub、Gmail、云端硬盘、日历等；写操作默认逐次询问。 |

```

</details>

**依据 3 · 源码核查**：[package.json:2-12](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/package.json#L2-L12)

实际版本与原生exports。

<details>
<summary>查看原文（11行）</summary>

```text
  "name": "dsh-codex-subscription",
  "version": "3.2.1",
  "packageManager": "pnpm@11.26.0",
  "description": "Use ChatGPT and Codex subscriptions in DeepSeek Harness with OAuth, quota, safe resets, web search, images and Fast mode, and control DSH from the ChatGPT mobile app (Beta)",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
```

</details>

**依据 4 · 源码核查**：[src/pi-ai-runtime.js:7-7](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/pi-ai-runtime.js#L7-L7)

主provider复用pi-ai实现。

```text
import { openaiCodexProvider as createOpenAICodexProvider } from '@earendil-works/pi-ai/providers/openai-codex'
```

**依据 5 · 源码核查**：[src/index.js:470-480](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L470-L480)

实际包裹并registerAdapter。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => {
    const lifetime = new AbortController()
    const defaults = withDefaultReasoningEffort(ultra.wrapAdapter(observeAdapter(reasoning.wrapAdapter(compaction.wrapAdapter(provider.wrapRetryAdapter(adapter))), provider)), {
      preference: () => settings.get()[DEFAULT_REASONING_EFFORT_FIELD],
      modelDefault: id => modelCatalog.metadata(id)?.defaultReasoningEffort,
    })
    const readyAdapter = withModelCatalogReady(hiddenDirectory.wrap(defaults), modelCatalog, { signal: lifetime.signal })
    const disposeAdapter = ctx.llm.registerAdapter([PROVIDER], readyAdapter)
    // Defer credential work until the synchronous apply() has installed resolveAuth.
    void Promise.resolve().then(() => modelCatalog.refresh({ signal: lifetime.signal }))
      .catch(error => { if (!lifetime.signal.aborted) ctx.logger?.debug?.('could not refresh Codex model catalog (%s)', error?.code ?? error?.name ?? 'unknown error') })
```

</details>

#### 缺口

- 账号资格、当前模型、真实任务质量与同任务对照未验证。
  **影响**：不能把OAuth可接线等同订阅权益保证或API全面替代。
  **进一步探讨**：用自有测试账号核模型/额度后，与原办法同任务比较正确结果、搬运和维护工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth、模型请求与失败恢复怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DshOAuthCredentialStore把DSH字符串凭据服务适配成typed OAuth store，校验access/refresh/expiry；按provider Promise链串行read/refresh/login相关操作，避免同实例旧刷新覆盖新token。多账号vault要求宿主readRecord/modifyRecord，自己也有串行尾链，旧单账号reference作为回退来源。源码依赖托管凭据，不足据此断言宿主如何加密、跨进程锁或本机所有账户隔离。

login委托models.login(openai-codex,oauth)，多账号先用pending store取得完整凭据，再加入vault。执行侧readSubscriptionCredentials先getAuth刷新，再读同一vault快照，最多两次校验access与auth apiKey相同，避免切账号时混用token和accountId；不匹配返回不可用，而非拼凑身份。实际登录网络及OAuth授权页由外部provider/网络层处理，本轮未操作。

普通模型调用由pi-ai provider产生迭代事件，插件包裹payload偏好、连接/压缩等桥和错误归一，记录prepare/request/payload/stream阶段。Auto review有特例：完整缓存一次尝试事件，遇匹配的瞬态错误最多重试2次，只有最后结果yield，减少失败半段污染review解析。这不等于所有聊天/工具流都完整缓存或无损重放；普通流仍可能先输出再失败，业务副作用由宿主工具另管。

额度恢复只在指定provider、识别为Codex限流且开关启用时强制读usage；所有耗尽的主codex窗口都在有限等待上界内才安排。发布llm/retry可见事件，允许取消/配置变化/切账号唤醒，切账号先等新目录就绪，再返回retry请求。它不能制造额度，重置后也不保证下一请求或任务成功，未确认工具结果不应盲重放。

#### 证据与依据

**依据 1 · 源码核查**：[src/credential-store.js:35-72](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/credential-store.js#L35-L72)

托管store与同实例串行队列。

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * Adapt DSH's managed string credential service to pi-ai's typed OAuth store.
 * Refresh/login/logout operations are serialized so an older refresh response
 * cannot overwrite a newer rotated token.
 */
export class DshOAuthCredentialStore {
  #chains = new Map()

  constructor(credentials, ref, legacyRefs = [], options = {}) {
    if (credentials === undefined || credentials === null) {
      throw new Error('Codex OAuth requires the DSH credentials service')
    }
    const expirySkewMs = options.expirySkewMs ?? 0
    if (!Number.isFinite(expirySkewMs) || expirySkewMs < 0) {
      throw new Error('Codex OAuth expiry skew must be a non-negative finite number')
    }
    this.credentials = credentials
    this.ref = ref
    this.legacyRefs = Object.freeze([...legacyRefs])
    this.expirySkewMs = expirySkewMs
    this.vault = options.vault
  }

  #enqueue(providerId, operation, options) {
    assertProvider(providerId)
    const previous = this.#chains.get(providerId) ?? Promise.resolve()
    const current = previous
      .catch(() => undefined)
      .then(async () => {
        abortIfNeeded(options)
        return operation()
      })
    const tail = current.catch(() => undefined)
    this.#chains.set(providerId, tail)
    void tail.finally(() => {
      if (this.#chains.get(providerId) === tail) this.#chains.delete(providerId)
    })
    return current
```

</details>

**依据 2 · 源码核查**：[src/account-vault.js:135-160](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/account-vault.js#L135-L160)

atomic record依赖与多账号串行。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Multi-account owner state stored in DSH's atomic plugin credential record.
 * The old single-account reference remains as a rollback source and is kept in
 * sync whenever that imported account rotates its refresh token.
 */
export class DshOAuthAccountVault {
  #tail = Promise.resolve()

  constructor(credentials, options) {
    if (credentials === undefined || credentials === null
      || typeof credentials.readRecord !== 'function'
      || typeof credentials.modifyRecord !== 'function') {
      throw new Error('Codex multi-account requires DSH credential records')
    }
    this.credentials = credentials
    this.key = options.key
    this.legacyRef = options.legacyRef
    this.legacyRefs = Object.freeze([...(options.legacyRefs ?? [])])
    this.createId = options.createId ?? randomUUID
    this.onLegacySyncFailure = options.onLegacySyncFailure ?? (() => {})
  }

  #enqueue(operation) {
    const current = this.#tail.catch(() => undefined).then(operation)
    this.#tail = current.catch(() => undefined)
    return current
```

</details>

**依据 3 · 源码核查**：[src/credential-store.js:171-183](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/credential-store.js#L171-L183)

真实models.login和pending提交。

<details>
<summary>查看原文（13行）</summary>

```text
    login(interaction, input = {}) {
      if (input.label !== undefined) {
        if (accountVault === undefined || createLoginModels === undefined) throw new Error('Codex multi-account is unavailable')
        return runLogin(async () => {
          const pending = createPendingStore()
          const loginModels = createLoginModels(pending)
          await loginModels.login(PROVIDER, 'oauth', interaction)
          const credential = pending.credential()
          if (credential === undefined) throw new Error('Codex login did not return credentials')
          await accountVault.add(input.label, credential)
        })
      }
      return runLogin(() => models.login(PROVIDER, 'oauth', interaction))
```

</details>

**依据 4 · 源码核查**：[src/subscription-credentials.js:10-23](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/subscription-credentials.js#L10-L23)

刷新后token/account同快照匹配。

<details>
<summary>查看原文（14行）</summary>

```text
// Refresh first, then take token and account ID from the same vault snapshot.
// A switch between the awaits must never combine two different accounts.
export async function readSubscriptionCredentials(getAuth, readCredential, signal) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const auth = await getAuth({ signal })
    signal?.throwIfAborted()
    if (typeof auth?.auth?.apiKey !== 'string' || !auth.auth.apiKey) break
    const credential = await readCredential({ signal })
    signal?.throwIfAborted()
    if (credential?.type !== 'oauth') break
    if (credential.access === auth.auth.apiKey) return { access: credential.access, accountId: credential.accountId }
  }
  return { access: undefined, accountId: undefined }
}
```

</details>

**依据 5 · 源码核查**：[src/pi-ai-runtime.js:237-263](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/pi-ai-runtime.js#L237-L263)

Auto review缓存重试范围。

<details>
<summary>查看原文（27行）</summary>

```text
  // DSH Auto review asks once and blocks the tool on any failure. A review
  // that drops before producing its answer is replayed, buffered so a failed
  // attempt never leaks partial output to the reviewer's parser.
  const reviewIterable = create => {
    let replay
    const run = async function* () {
      for (let attempt = 0; ; attempt += 1) {
        const events = []
        let failure
        let thrown
        try {
          for await (const event of create()) {
            events.push(event)
            if (event?.type === 'error') failure = event.error?.errorMessage
          }
        } catch (error) {
          thrown = error
          failure = error?.message
        }
        if (failure !== undefined && attempt < REVIEW_RETRIES && TRANSIENT_REVIEW_FAILURE.test(failure)) {
          review.retries += 1
          continue
        }
        if (thrown !== undefined && events.length === 0) throw thrown
        yield* events
        if (thrown !== undefined) throw thrown
        return
```

</details>

**依据 6 · 源码核查**：[src/pi-ai-runtime.js:272-288](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/pi-ai-runtime.js#L272-L288)

普通事件迭代、阶段和错误归一。

<details>
<summary>查看原文（17行）</summary>

```text
    const retryHint = direct ? undefined : retryBridge.current()
    const step = async (method, value) => { try {
      // Review calls are one-shot: no WebSocket continuation or cloud compaction.
      const request = await (prepared ??= (direct ? undefined : connection?.prepare(options)) ?? Promise.resolve({ options }))
      if (stage === 'prepare') stage = 'request'
      const result = await runNetwork('model', () => {
        const next = direct ? request.options : compaction?.requestOptions(request.options) ?? request.options
        iterator ??= factory({ ...next, async onResponse(info, requestModel) { retryHint?.onResponse(info); return next.onResponse?.(info, requestModel) }, async onPayload(payload, requestModel) { stage = 'payload'; return next.onPayload?.(payload, requestModel) } })[Symbol.asyncIterator]()
        return iterator[method]?.(value) ?? (method === 'throw' ? Promise.reject(value) : Promise.resolve({ done: true, value }))
      }, direct ? request.network : compaction?.networkOptions(request.network) ?? request.network)
      if (!result.done) {
        retryHint?.observe(result.value, request.options?.signal)
        if (result.value?.type === 'error' && !request.options?.signal?.aborted) noteStreamFailure(stage, undefined, source)
        else if (stage === 'payload') stage = 'stream'
      }
      return result.done ? result : { ...result, value: normalizeTransportEvent(result.value, request.options?.signal) }
    } catch (error) { noteStreamFailure(stage, error, source); throw error } }
```

</details>

**依据 7 · 源码核查**：[src/pi-ai-runtime.js:69-71](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/pi-ai-runtime.js#L69-L71)

review最大2次重试及匹配错误。

```text
const REVIEW_RETRIES = 2
// Transient stream/transport drops only; never policy, auth or quota errors.
const TRANSIENT_REVIEW_FAILURE = /stream ended (?:before|without)|\b(?:network|connection|socket)\b|\bECONN[A-Z]+\b|other side closed|premature close|\bterminated\b|WebSocket closed (?:1006|1011|1012|1013)/iu
```

**依据 8 · 源码核查**：[src/quota-retry.js:58-82](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/quota-retry.js#L58-L82)

所有主额度窗口和等待上界判定。

<details>
<summary>查看原文（25行）</summary>

```text
function shortResetDelay(usage, nowMs, maxWaitMs, resetMarginMs) {
  // A workspace spend cap does not end when a usage window resets, so waiting for one would not help.
  // Depleted workspace credits only mean usage cannot continue past an exhausted window; the
  // exhausted-window checks below still decide whether a reset is close enough to wait for.
  if (typeof usage?.rateLimitReachedType === 'string' && /^workspace_[a-z_]*usage_limit_reached$/u.test(usage.rateLimitReachedType)) return undefined
  let latestDelayMs
  for (const limit of usage?.rateLimits ?? []) {
    // The usage response also contains feature-specific and code-review limits.
    // A model request cannot identify those meters, so only the main Codex limit
    // is authoritative for recovery of an openai-codex model failure.
    if (limit?.id !== 'codex') continue
    for (const window of limit?.windows ?? []) {
      if (!Number.isFinite(window?.usedPercent) || window.usedPercent < EXHAUSTED_PERCENT) continue
      // Every exhausted primary window must be recoverable within the cap. If a
      // weekly or malformed meter also blocks the request, retrying after only
      // the short window resets would wake the turn too early.
      if (!Number.isFinite(window?.windowSeconds) || window.windowSeconds * 1_000 > maxWaitMs) return undefined
      if (!Number.isFinite(window?.resetsAt)) return undefined
      const delayMs = window.resetsAt * 1_000 - nowMs
      if (delayMs <= 0 || delayMs + resetMarginMs > maxWaitMs) return undefined
      latestDelayMs = Math.max(latestDelayMs ?? 0, delayMs)
    }
  }
  return latestDelayMs
}
```

</details>

**依据 9 · 源码核查**：[src/quota-retry.js:201-219](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/quota-retry.js#L201-L219)

限流/开关/强制读usage入口。

<details>
<summary>查看原文（19行）</summary>

```text
  const handler = async ({ agent, turn, step, provider: requestProvider, failure, signal }, next) => {
    if (requestProvider !== provider || !isCodexRateLimit(failure) || !enabled()) return next()
    if (signal?.aborted) return undefined
    let wakeRevision = wakeSignal.revision()

    let usage
    try {
      usage = await usageReader.read({ force: true, signal })
    } catch {
      if (signal?.aborted) return undefined
      return next()
    }
    if (signal?.aborted) return undefined
    if (!enabled()) return next()

    const observedAtMs = now()
    let resetDelayMs = shortResetDelay(usage, observedAtMs, maxWaitMs, resetMarginMs)
    if (resetDelayMs === undefined) return next()
    const scheduled = publishScheduledRetry(
```

</details>

**依据 10 · 源码核查**：[src/quota-retry.js:232-252](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/quota-retry.js#L232-L252)

账号/配置唤醒和返回retry。

<details>
<summary>查看原文（21行）</summary>

```text
      )
      if (reason === 'cancelled' || signal?.aborted) return undefined
      if (!enabled()) return next()
      if (reason === 'account') {
        // Switching accounts empties the model catalog until the new account's
        // catalog loads; retrying before then fails as an unknown model.
        const ready = await modelsReadyOrCancelled(modelsReady, signal)
        if (ready === 'cancelled' || signal?.aborted) return undefined
        if (!ready) return next()
        break
      }
      if (reason !== 'configuration') break
      wakeRevision = wakeSignal.revision()
      resetDelayMs = shortResetDelay(usage, now(), maxWaitMs, resetMarginMs)
      if (resetDelayMs === undefined) return next()
    }

    await clearCache()
    if (signal?.aborted) return undefined
    if (!publishRetryStarted(agent, scheduled)) return next()
    return { kind: 'retry' }
```

</details>

#### 缺口

- 登录刷新、普通半流、额度等候取消与跨进程凭据行为未运行。
  **影响**：不能按队列/重试代码推出无丢失、无重复或始终可用。
  **进一步探讨**：受控核token轮换、切账号、半流与额度恢复，追实际调用、工具结果和最终任务状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨模型连接器、生图和子任务如何授权？

**研究主题**：缺陷与关键质疑

#### 完整回答

连接器默认mode=off，开启后注册search/describe/call，读每次实时设置与当前模型是否允许订阅能力。工具只在上游annotations.readOnlyHint===true时视作只读，缺标签保守按可能写处理；但真实副作用分类仍依赖上游描述，不是插件自行理解工具实现。

call找确切工具、取arguments对象，read模式拒潜在写；ask向宿主approval.request说明工具与参数摘要，只接受allowed-once，审批服务缺失不运行；write设置则不逐次询问。search→describe→call是说明中的推荐顺序，call执行没有强制验证先describe，传参schema也主要交远端工具处理。结果提示第三方内容非指令有帮助，但不是提示注入隔离证明。

client.callTool走订阅JSON-RPC并以当前账号发请求，失败/超时只返回错误并不证明远端没有写入。本轮未核服务端幂等/查询契约，因此未知结果应先对账，不反复调用发送/删除等动作。切换到其他DSH模型使用应用还意味着应用数据进入那个模型上下文，关闭otherModels总开关可限制跨模型服务，但不改变Codex模型自身能力。实际servesCurrentModel在识别不到当前provider时仍允许，因此不是未知身份即拒绝的硬边界。

生图编辑工具读取匹配账号凭据、校验图片/参数并请求chatgpt backend，响应后存本地原始PNG及附件；它会外发prompt/参考图片并消耗账号对应能力，不能从其他模型能调用推为免费或不限量。远端成功到本地保存/附件之间有状态边界，超时或附件失败需核已有结果再重试。

可选订阅子任务单独加载DSH Codex子代理runtime，不继承父上下文；子选项只允provider/model/effort，继承宿主sandbox mode，approvalPolicy固定never，并关闭apps/plugins/browser/computer等features以收窄到工作区工具。never不是自动更高权限证明，也不能把主provider无需CLI说成子任务无需外部runtime；实际runtime/策略仍需独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/settings-contract.js:56-58](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/settings-contract.js#L56-L58)

连接器默认off及read/ask/write集合。

```text
export const CONNECTORS_FIELD = 'connectors'
export const CONNECTOR_MODES = Object.freeze(['off', 'read', 'ask', 'write'])
export const DEFAULT_CONNECTOR_MODE = 'off'
```

**依据 2 · 源码核查**：[src/index.js:406-426](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L406-L426)

按实时设置注册/注销工具。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.effect(() => {
    let disposers = []
    const sync = () => {
      const on = normalizeConnectorMode(settings.get()[CONNECTORS_FIELD]) !== 'off'
      if (on && disposers.length === 0) {
        disposers = createConnectorTools({
          client: connectorsClient,
          getMode: () => normalizeConnectorMode(settings.get()[CONNECTORS_FIELD]),
          allowed: () => servesCurrentModel(),
          getApproval: () => ctx.get?.('approval'),
        }).map(tool => ctx.tools.register(tool))
      } else if (!on && disposers.length > 0) {
        for (const dispose of disposers) dispose()
        disposers = []
        connectorsClient.clear()
      }
    }
    sync()
    const unwatch = settings.watch(sync)
    return () => { unwatch(); for (const dispose of disposers) dispose(); disposers = [] }
  }, 'codex-subscription: ChatGPT connectors')
```

</details>

**依据 3 · 源码核查**：[src/connectors.js:24-36](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/connectors.js#L24-L36)

readOnly仅来自明确上游hint。

<details>
<summary>查看原文（13行）</summary>

```text
export function parseTools(result) {
  if (!record(result) || !Array.isArray(result.tools)) throw new Error('ChatGPT returned a malformed connector list')
  const tools = []
  for (const raw of result.tools) {
    if (!record(raw) || typeof raw.name !== 'string' || raw.name.length === 0 || raw.name.length > 128) continue
    if (BLOCKED_PREFIXES.some(prefix => raw.name.startsWith(prefix))) continue
    const meta = record(raw._meta) ? raw._meta : {}
    tools.push({
      name: raw.name,
      connector: clip(oneLine(meta.connector_name) || raw.name.split('.')[0], 80),
      description: clip(oneLine(raw.description), 600),
      readOnly: record(raw.annotations) && raw.annotations.readOnlyHint === true,
      inputSchema: record(raw.inputSchema) ? raw.inputSchema : { type: 'object' },
```

</details>

**依据 4 · 源码核查**：[src/connectors.js:218-231](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/connectors.js#L218-L231)

实际写门禁、approval和远端调用。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      guard()
      const mode = getMode()
      if (mode !== 'read' && mode !== 'ask' && mode !== 'write') throw new Error('ChatGPT connectors are turned off in the plugin settings')
      const tool = await find(args.name, exec.signal)
      const input = record(args.arguments) ? args.arguments : {}
      if (!tool.readOnly && mode !== 'write') {
        if (mode !== 'ask') throw new Error(`${tool.name} changes data and connectors are set to read-only; ask the user to allow writes in the plugin settings`)
        const approval = getApproval?.()
        if (typeof approval?.request !== 'function') throw new Error('Approval is unavailable, so this connector action was not run')
        const outcome = await approval.request({ agent: exec.agent, toolName: tool.name, callId: exec.callId, reason: `${tool.connector}: ${clip(oneLine(tool.description), 160)} Arguments: ${clip(JSON.stringify(input), 400)}`, signal: exec.signal })
        if (outcome !== 'allowed-once') throw new Error('The user did not approve this connector action')
      }
      return resultOf(await client.callTool(tool.name, input, exec.signal))
```

</details>

**依据 5 · 源码核查**：[src/connectors.js:100-107](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/connectors.js#L100-L107)

工具缓存和tools/call，无此链服务器幂等证明。

```text
    async listTools({ signal, force = false } = {}) {
      if (!force && cache !== undefined && now() - cache.at < LIST_TTL_MS) return cache.tools
      inFlight ??= load(signal).then(value => { cache = value; return value }).finally(() => { inFlight = undefined })
      return (await inFlight).tools
    },
    async callTool(name, args, signal) {
      const { result } = await rpc('tools/call', { name, arguments: args }, signal, CALL_TIMEOUT_MS)
      return result
```

**依据 6 · 源码核查**：[src/index.js:520-524](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L520-L524)

otherModels关闭时仍允许无法识别当前provider的上下文。

```text
  // With "other models" switched off, subscription search, images and connectors serve conversations on this plugin's own models only.
  const servesCurrentModel = () => {
    if (settings.get().otherModels !== 'off') return true
    const provider = currentAgent()?.session.requestContext?.()?.provider
    return provider === undefined || provider === PROVIDER
```

**依据 7 · 源码核查**：[src/codex-images.js:436-450](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/codex-images.js#L436-L450)

生图授权/参数/匹配账号凭据。

<details>
<summary>查看原文（15行）</summary>

```text
    async execute(args, exec) {
      if (options.allowed?.() === false) throw new Error('Codex image generation is turned off for conversations on other models (Settings → Codex subscription → Web & tools → "DeepSeek and other models can use subscription features")')
      if (Array.isArray(args.referenceImages) && args.referenceImages.length === 0) {
        const { referenceImages: _empty, ...rest } = args
        args = rest
      }
      assertImageOperation(options.getFeatures?.(), args.referenceImages !== undefined)
      const defaults = readImageDefaults(options.getFeatures?.())
      args = { ...args, model: args.model ?? defaults.imageModel, quality: args.quality ?? defaults.imageQuality }
      const prompt = nonEmpty(args.prompt)
      if (prompt === undefined) throw new Error('prompt must be a non-empty string')
      const imageOptions = normalizeImageOptions(args)
      const { access, accountId } = await readSubscriptionCredentials(options.getAuth, options.readCredential, exec.signal)
      if (typeof access !== 'string' || access.length === 0
        || typeof accountId !== 'string' || accountId.length === 0) {
```

</details>

**依据 8 · 源码核查**：[src/codex-images.js:480-524](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/codex-images.js#L480-L524)

远端请求、拒绝、解码、本地原图与附件。

<details>
<summary>查看原文（45行）</summary>

```text
            'user-agent': USER_AGENT,
          },
          body: JSON.stringify({
            ...(images === undefined ? {} : { images }),
            prompt,
            background: imageOptions.background,
            model: resolveImageModel(args.model),
            quality: imageOptions.quality,
            size: imageOptions.size,
          }),
          signal: exec.signal,
        })
      } catch (error) {
        if (exec.signal.aborted) throw exec.signal.reason
        throw new Error(`Codex image ${editing ? 'edit' : 'generation'} request failed${requestFailureReason(error)}`, { cause: error })
      }
      if (!response.ok) {
        const authFailure = await authFailureMessage(response)
        const requestId = supportId(response)
        // A 403 the ChatGPT backend itself sends is a refusal for this account (plan, workspace or region), not an
        // expired sign-in: signing in again changes nothing, so say so instead of asking for it (#173).
        if (response.status === 403 && authFailure === SIGN_IN_RENEW) throw new Error(`${await refusalMessage(response, editing)}${requestId}`)
        if (authFailure !== undefined) throw new Error(authFailure)
        if (response.status === 429) throw new Error(`${await limitMessage(response)}${requestId}`)
        throw new Error(`Codex image ${editing ? 'edit' : 'generation'} failed (HTTP ${response.status})${requestId}`)
      }
      const value = await readJsonWithin(
        response,
        encodedLimit(maximumBytes) + RESPONSE_ENVELOPE_BYTES,
      )
      const metadata = responseMetadata(value)
      const data = decodeCodexPng(metadata.encoded, maximumBytes)
      const sessionId = exec.agent?.id
      if (sessionId === undefined) throw new Error('Codex image generation requires a session-owned tool call')
      const original = await options.originalImages.save(String(sessionId), data)
      let ref
      try {
        ref = await attachments.saveImage({
          data,
          mediaType: 'image/png',
          name: 'codex-generated.png',
        })
      } catch (error) {
        await options.originalImages.remove(original)
        throw error
```

</details>

**依据 9 · 源码核查**：[src/subagent-backend.js:9-35](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/subagent-backend.js#L9-L35)

子任务选项、sandbox/never和禁用features。

<details>
<summary>查看原文（27行）</summary>

```text
export function subagentThreadPolicy(parent, policy, requested = {}) {
  if (!MODES.has(policy?.mode)) throw new Error('DSH subagent sandbox policy is unavailable')
  const selected = parent.session.requestHeader?.()?.config ?? parent.options ?? {}
  for (const key of Object.keys(requested)) {
    if (!['provider', 'model', 'reasoningEffort'].includes(key)) throw new Error('Unsupported Codex child option: ' + key)
  }
  if (requested.provider !== undefined && requested.provider !== 'openai-codex') throw new Error('Codex subtasks require the openai-codex provider')
  const model = requested.model ?? (selected.provider === 'openai-codex' ? selected.model : undefined)
  if (typeof model !== 'string' || !model.trim()) throw new Error('Select an openai-codex model for this subtask; the parent model cannot be inherited')
  const effort = requested.reasoningEffort ?? (requested.model === undefined ? selected.reasoningEffort : undefined)
  if (effort !== undefined && !['none','minimal','low','medium','high','xhigh','max','ultra'].includes(effort)) throw new Error('Unsupported Codex reasoning effort')
  return {
    model,
    modelProvider: 'openai',
    approvalPolicy: 'never',
    sandbox: policy.mode,
    config: { ...CHILD_FEATURES_OFF, ...(effort === undefined ? {} : { model_reasoning_effort: effort }) },
  }
}

/**
 * A ChatGPT-authenticated Codex child would otherwise expose the account's
 * connected apps (calendar, site deploys, ...) and plugin installs, all
 * auto-approved. A DSH subtask gets the workspace tools only.
 */
const CHILD_FEATURES_OFF = Object.freeze({
  features: Object.freeze(Object.fromEntries(['apps', 'plugins', 'plugin_sharing', 'remote_plugin', 'tool_suggest', 'browser_use', 'browser_use_external', 'browser_use_full_cdp_access', 'computer_use', 'in_app_browser'].map(name => [name, false]))),
```

</details>

**依据 10 · 源码核查**：[src/subagent-backend.js:46-70](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/subagent-backend.js#L46-L70)

无父上下文、加载runtime与宿主provider接线。

<details>
<summary>查看原文（25行）</summary>

```text
    capabilities: { agentOptions: true, outputSchema: false, depthLimit: false, toolFilter: false, persona: false },
    inheritsParentContext: false,
    async start(request) {
      if (disposed) throw new Error('Codex subagent is unavailable')
      if (maintenance()) throw new Error('Codex subtask component is being changed; restart DSH after completion')
      const controller = new AbortController()
      active.add(controller)
      const signal = AbortSignal.any([request.signal, controller.signal])
      let run
      try {
        const thread = subagentThreadPolicy(request.parent, ctx.sandboxPolicy.resolve({ session: request.parent.session }), request.agentOptions)
        const getTokens = await createSubagentTokens({ resolveAuth, store, refresh, signal })
        const { official, Transport } = await load()
        const proxy = await resolveCodexOAuthProxy({ target: new URL('https://chatgpt.com/') })
        signal.throwIfAborted()
        await mkdir(nativeHome, { recursive: true })
        const env = { CODEX_HOME: nativeHome, ...(proxy ? { HTTPS_PROXY: proxy, HTTP_PROXY: proxy, ALL_PROXY: proxy } : {}) }
        let delegate
        official.apply({
          subagents: { registerProvider(value) { delegate = value } },
          subprocess: { spawn: spec => authenticatedSubagentChild(ctx.subprocess.spawn({ ...spec, env: { ...spec.env, ...env } }), {
            Transport, getTokens, thread, signal,
          }) },
          logger: { warn: () => ctx.logger?.warn?.('Codex subscription subtask failed') },
        }, { model: thread.model, env, permissionMode: 'never', disposeGraceMs: 1000 })
```

</details>

#### 缺口

- 连接器上游分类/幂等、实际生图和子任务工具策略未端到端核验。
  **影响**：不能保证任意应用写入安全、图片送达或子任务权限完全受控。
  **进一步探讨**：先read与非敏感数据，测试一次明确写审批、超时对账、图片落盘和只读子任务；分别验收，默认不开write。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 移动远控与依赖、实际使用怎样闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

移动远控是独立可选面：settings.remoteControl==='on'才enable，默认保持关闭，停用/销毁disable。bridge还会接管相应会话approval和user question事件，使手机参与真实任务，不只是查看额度。它支持部分协议方法且明确拒绝任意宿主命令；本轮没有配对、连接手机或全审协议/加密/权限映射，不能由主provider成功推出远控安全可用。

| 条件 | 真实门槛 | 验收边界 |
|---|---|---|
| DSH/Node与peer版本 | 原生llm、credentials、connection、tools和UI | 包列明确版本集合，作者兼容声明不是所有GUI/模型行为证明 |
| 自有符合资格账号 | OAuth、实际模型目录和额度 | 未登录核资格，不保证任何套餐一直可用 |
| pi-ai及网络层 | Codex协议、刷新、流和请求偏好 | 外部接口/依赖变化有维护成本 |
| 可选连接器/图片 | 已连接应用、账号能力和宿主approval/attachments | 各能力单独授权验收，数据可外发 |
| 可选子任务/远控 | 子runtime、sandbox/进程、远控配对/桥 | 主provider不依赖这些可选面，不整体放行 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 用户核制品和宿主 | 版本、凭据存储策略、默认开关明确 | 先保留原provider，不用升级标签替验收 |
| 用户OAuth登录 | 正确账号/模型/额度可见 | 失败不导出token，核状态再重登 |
| 用户跑已知小任务 | 模型/工具与结果正确，半流失败可解释 | 回原连接，不重复未知工具副作用 |
| 用户另开read连接器/图片 | 数据方与权限明确，成果可读 | 拒绝或未知结果先对账 |
| 用户分别评估写/子任务/远控 | 审批、sandbox、手机scope符合意图 | 保持关闭，不因主聊天通过全部启用 |
| 用户退出 | 取消等待、停远控、退出账号/残留凭据可解释 | 保留必要诊断但不泄token，回原provider |

认证RPC经宿主/api connection注册并验证JSON/envelope，native voice额外限制local origin；该入口核查不等于整仓远程控制和录音能力已完成安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:661-673](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L661-L673)

远控独立显式开启和停用。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.effect(() => {
    // Remote Control stays off until the user switches it on; then it follows the setting.
    let wanted = false
    const follow = value => {
      const next = value.remoteControl === 'on'
      if (next === wanted) return
      wanted = next
      void (next ? remoteControl.enable() : remoteControl.disable()).catch(error => ctx.logger?.debug?.('Remote Control: %s', error?.code ?? error?.message))
    }
    follow(settings.get())
    const unwatch = settings.watch(follow)
    return () => { unwatch(); void remoteControl.disable().catch(() => {}) }
  }, 'codex-subscription: Remote Control host')
```

</details>

**依据 2 · 源码核查**：[src/index.js:656-660](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L656-L660)

实际接审批和用户问题事件。

```text
  ctx.on('agent/assistant-stream', ({ agent, frame }) => { try { remoteBridge.onStream(agent?.session, frame) } catch { /* the phone view must never disturb the session */ } })
  ctx.on('session/event', (session, event) => { try { remoteBridge.onSessionEvent(session, event) } catch { /* the phone view must never disturb the session */ } })
  // Prepended: the DSH window answers these too and would otherwise claim them before the phone sees them.
  ctx.on('approval/request', (request, next) => { try { return remoteBridge.onApproval(request, next) } catch { return next() } }, true)
  ctx.on('user-questions/request', (request, next) => { try { return remoteBridge.onQuestion(request, next) } catch { return next() } }, true)
```

**依据 3 · 源码核查**：[src/remote-control-dsh.js:881-898](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/remote-control-dsh.js#L881-L898)

拒绝任意宿主命令的边界。

<details>
<summary>查看原文（18行）</summary>

```text
    // Arbitrary host commands bypass DSH's sandbox and approvals, so they stay off.
    // Only read-only git inside a conversation folder, for the phone's changes view; nothing else runs.
    'command/exec': async (params, { notify, signal }) => {
      const command = Array.isArray(params?.command) ? params.command.filter(part => typeof part === 'string') : []
      const executable = command[0]?.replaceAll('\\', '/').split('/').at(-1) ?? ''
      phoneLog('command request classified', {
        type: /^(?:git|powershell|pwsh|bash|sh)(?:\.exe)?$/iu.test(executable) ? executable.toLowerCase().replace(/\.exe$/u, '') : 'other',
        items: command.length,
        // Feature indicators only; never record shell contents or filenames.
        images: command.some(part => /ReadAllBytes|ToBase64String|\bbase64\b/iu.test(part)) ? 1 : 0,
      })
      const home = homeFolderAnswer(params?.command)
      if (home !== undefined) return home
      const folders = await conversationFolders()
      try { return phoneGitProbe(params?.command) ? await runPhoneGitProbe(params, { folders, notify, signal }) : await runGit(params, { folders }) } catch (error) {
        phoneLog('command request refused', { code: error?.code ?? error?.name }, 'warn')
        trace({ method: 'command/exec:refused', reason: String(error?.message).slice(0, 80), command: Array.isArray(params?.command) ? params.command.slice(0, 3).map(part => String(part).slice(0, 40)) : null })
        throw new RpcError(-32600, error?.code === 'not-allowed' ? `Not available on a DSH host: ${error.message}` : 'Could not run the command')
```

</details>

**依据 4 · 源码核查**：[package.json:84-108](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/package.json#L84-L108)

Node及明确peer版本集合。

<details>
<summary>查看原文（25行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4 || 4.0.5-alpha.1 || 4.0.5-alpha.2 || 4.0.5 || 4.0.6-alpha.1",
    "@deepseek-ai/dsh-api-remotes": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-connection": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-locale": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-model-selection": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-tool": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-credentials": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-llm": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-llm-pi-ai": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-settings": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-subagent-codex": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-tools": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/dsh-web": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.2-alpha.2",
    "@deepseek-ai/schemastery": "3.18.1 || ^3.18.2 || 3.18.6-alpha.1",
    "@earendil-works/pi-ai": "0.85.1 || 0.87.1 || 1.1.0 || 1.2.0 || 1.3.0 || 1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 5 · 源码核查**：[src/subscription-transport.js:18-43](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/subscription-transport.js#L18-L43)

认证/api注册、native本地门禁和RPC校验。

<details>
<summary>查看原文（26行）</summary>

```text
/** Exact routes stay inside DSH's authenticated /api bridge and body limit. */
export function registerSubscriptionTransport(connection, handler) {
  const disposers = []
  try {
    for (const endpoint of RPC_ENDPOINTS) {
      const method = `codex-subscription/${endpoint}`
      disposers.push(connection.fetch.register({
        path: `/api/${method}`, methods: ['POST'], requestBody: 'buffered',
        async fetch(request) {
          // Native capture uses the host's devices, so remote web clients must
          // never acquire it through the otherwise shared authenticated bridge.
          if (endpoint.startsWith('voice/native/') && !localNativeRequest(request)) return new Response('native voice requires the local desktop', { status: 403 })
          if (request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() !== 'application/json') {
            return new Response('content type must be application/json', { status: 415 })
          }
          let body
          try { body = await request.json() } catch { return new Response('invalid JSON', { status: 400 }) }
          const envelope = clientRequestSchema.safeParse(body)
          if (!envelope.success || envelope.data.method !== method) return new Response('invalid RPC envelope', { status: 400 })
          let result
          try {
            request.signal.throwIfAborted()
            result = await handler(endpoint, envelope.data.payload, request.signal)
          } catch {
            result = { ok: false, error: { code: 'internal', message: 'Subscription request failed', details: { issues: [] } } }
          }
```

</details>

**依据 6 · 作者声明**：[README.md:50-56](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/README.md#L50-L56)

作者宿主兼容和账号资格说明。

```text
已验证兼容 DSH `0.2.1-rc.4`（`next` 通道），继续支持 `0.2.1-rc.3` 和 `0.2.1-rc.2`，最低支持 `0.1.7-rc.2`；更早的 DSH 请先升级。

另支持预览宿主 `0.2.2-alpha.2`；范围与验收边界见[兼容性记录](docs/dsh-022-alpha2-compatibility.md)。

本插件支持软件包元数据中记录的最新版 DeepSeek Harness，并需要一个当前具有 Codex 使用资格的 ChatGPT 账户。

<details>
```

#### 缺口

- 目标宿主、制品对应、移动配对/认证、voice和所有可选面未运行审计。
  **影响**：不能给生产远控或完整客户端兼容保证。
  **进一步探讨**：固定环境逐面验收，特别是关闭远控、取消等待、审批归属与退出残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和效果有什么证据？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前边界 |
|---|---|---|
| 启用 | 资格、登录、版本/peer、托管凭据及默认模型核验 | 已有订阅也有机会成本和维护成本 |
| 日常 | 账号配额、推理/速度档、搜索/图片与连接器调用 | 额度面板不是统一现金账单或不限量保证 |
| 失败恢复 | 网络/模型重试、review缓存重试、额度等待/换账号 | 等待有取消路径，不等于恢复成功或无重复工作 |
| 核对 | 实际工具成果、外发数据、审批、图片文件和上下文 | 多能力增加人工核验面 |
| 维护 | 上游协议、pi-ai与DSH版本集合、token轮换、可选runtime | 组件多不代表升级免维护 |
| 退出 | 取消在途、远控/子任务、凭据与诊断文件清理 | 注销UI不自动证明所有副本与远端会话撤销 |

#### 效果

| 效果 | 当前支持 | 未知 |
|---|---|---|
| 订阅入DSH | 托管OAuth、provider与模型目录桥 | 当前账号/地区/计划实际资格和任务质量 |
| 跨模型工具 | 明确连接器模式/审批、图片请求及保存 | 每种应用真实语义/幂等和净生产率 |
| 失败可见 | 阶段诊断、特例review重试、可取消额度等待 | 完整恢复率、重复副作用和净费用 |
| 远控/子任务 | 显式开关、协议/runtime接线 | 端到端安全与长期稳定性 |

不把Credits、窗口百分比或成功登录换算成节省金额；应比较同任务正确完成、配额占用、等待和人工修正。模型档位/速度和实际扣额由上游返回决定，本轮没有价格或账单验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/pi-ai-runtime.js:237-263](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/pi-ai-runtime.js#L237-L263)

review可能新增最多两次重试。

<details>
<summary>查看原文（27行）</summary>

```text
  // DSH Auto review asks once and blocks the tool on any failure. A review
  // that drops before producing its answer is replayed, buffered so a failed
  // attempt never leaks partial output to the reviewer's parser.
  const reviewIterable = create => {
    let replay
    const run = async function* () {
      for (let attempt = 0; ; attempt += 1) {
        const events = []
        let failure
        let thrown
        try {
          for await (const event of create()) {
            events.push(event)
            if (event?.type === 'error') failure = event.error?.errorMessage
          }
        } catch (error) {
          thrown = error
          failure = error?.message
        }
        if (failure !== undefined && attempt < REVIEW_RETRIES && TRANSIENT_REVIEW_FAILURE.test(failure)) {
          review.retries += 1
          continue
        }
        if (thrown !== undefined && events.length === 0) throw thrown
        yield* events
        if (thrown !== undefined) throw thrown
        return
```

</details>

**依据 2 · 源码核查**：[src/quota-retry.js:201-219](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/quota-retry.js#L201-L219)

额度等待依赖强制读usage。

<details>
<summary>查看原文（19行）</summary>

```text
  const handler = async ({ agent, turn, step, provider: requestProvider, failure, signal }, next) => {
    if (requestProvider !== provider || !isCodexRateLimit(failure) || !enabled()) return next()
    if (signal?.aborted) return undefined
    let wakeRevision = wakeSignal.revision()

    let usage
    try {
      usage = await usageReader.read({ force: true, signal })
    } catch {
      if (signal?.aborted) return undefined
      return next()
    }
    if (signal?.aborted) return undefined
    if (!enabled()) return next()

    const observedAtMs = now()
    let resetDelayMs = shortResetDelay(usage, observedAtMs, maxWaitMs, resetMarginMs)
    if (resetDelayMs === undefined) return next()
    const scheduled = publishScheduledRetry(
```

</details>

**依据 3 · 源码核查**：[src/quota-retry.js:232-252](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/quota-retry.js#L232-L252)

切账号/配置、目录就绪与retry。

<details>
<summary>查看原文（21行）</summary>

```text
      )
      if (reason === 'cancelled' || signal?.aborted) return undefined
      if (!enabled()) return next()
      if (reason === 'account') {
        // Switching accounts empties the model catalog until the new account's
        // catalog loads; retrying before then fails as an unknown model.
        const ready = await modelsReadyOrCancelled(modelsReady, signal)
        if (ready === 'cancelled' || signal?.aborted) return undefined
        if (!ready) return next()
        break
      }
      if (reason !== 'configuration') break
      wakeRevision = wakeSignal.revision()
      resetDelayMs = shortResetDelay(usage, now(), maxWaitMs, resetMarginMs)
      if (resetDelayMs === undefined) return next()
    }

    await clearCache()
    if (signal?.aborted) return undefined
    if (!publishRetryStarted(agent, scheduled)) return next()
    return { kind: 'retry' }
```

</details>

**依据 4 · 源码核查**：[src/connectors.js:224-231](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/connectors.js#L224-L231)

写审批与实际应用调用。

```text
      if (!tool.readOnly && mode !== 'write') {
        if (mode !== 'ask') throw new Error(`${tool.name} changes data and connectors are set to read-only; ask the user to allow writes in the plugin settings`)
        const approval = getApproval?.()
        if (typeof approval?.request !== 'function') throw new Error('Approval is unavailable, so this connector action was not run')
        const outcome = await approval.request({ agent: exec.agent, toolName: tool.name, callId: exec.callId, reason: `${tool.connector}: ${clip(oneLine(tool.description), 160)} Arguments: ${clip(JSON.stringify(input), 400)}`, signal: exec.signal })
        if (outcome !== 'allowed-once') throw new Error('The user did not approve this connector action')
      }
      return resultOf(await client.callTool(tool.name, input, exec.signal))
```

#### 缺口

- 无同任务正确率、配额/费用、等待和人工修正对照。
  **影响**：不能量化订阅复用经济性或称所有能力划算。
  **进一步探讨**：记录原办法/插件的任务结果、主/附加调用、额度变化、等待、审批与恢复时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，未来方向如何检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有符合资格账号、愿意承担适配维护且需要DSH工作流的人，可先只试主provider和非敏感已知任务。保留原provider，连接器维持off或read，远控关闭，图片/子任务另测；需要写应用时先ask逐次审批，不直接升级write。主聊天无CLI依赖不等于其他模块都无外部依赖。

保留条件是任务正确、账号/额度/工具结果明确，维护和等待低于搬运到其他入口。资格/目录不符、反复半流、未知写结果、审批归属不清或远控退出残留时停相关面并回原办法，先核远端状态而不是重新发送写操作。账号切换与重试成功仅是请求恢复，不是业务验收。

未来可验证“跨模型能力授权与结果账”假设：每个被开放的订阅能力明确当前模型、账号、数据去向、读写模式和实际结果/未知状态；未知写结果提供可审阅核对入口，避免仅凭工具错误决定重放。相对一个otherModels总开关加各模式，它可能减少用户低估数据跨模型/跨应用边界，代价是更多配置和审批负担。

最小实验用只读、明确写、审批取消、远端写成但响应中断、换账号和跨模型的固定任务，对照当前界面与逐能力结果账，测越意图数据流、误重放、错误阻断、人工时间和总调用。若新增界面不降错误且负担更大，就推翻或限定高影响写能力；该账并非当前完整实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:520-524](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/index.js#L520-L524)

当前跨模型总开关参照。

```text
  // With "other models" switched off, subscription search, images and connectors serve conversations on this plugin's own models only.
  const servesCurrentModel = () => {
    if (settings.get().otherModels !== 'off') return true
    const provider = currentAgent()?.session.requestContext?.()?.provider
    return provider === undefined || provider === PROVIDER
```

**依据 2 · 源码核查**：[src/connectors.js:218-231](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/connectors.js#L218-L231)

当前逐模式授权/远端结果参照。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      guard()
      const mode = getMode()
      if (mode !== 'read' && mode !== 'ask' && mode !== 'write') throw new Error('ChatGPT connectors are turned off in the plugin settings')
      const tool = await find(args.name, exec.signal)
      const input = record(args.arguments) ? args.arguments : {}
      if (!tool.readOnly && mode !== 'write') {
        if (mode !== 'ask') throw new Error(`${tool.name} changes data and connectors are set to read-only; ask the user to allow writes in the plugin settings`)
        const approval = getApproval?.()
        if (typeof approval?.request !== 'function') throw new Error('Approval is unavailable, so this connector action was not run')
        const outcome = await approval.request({ agent: exec.agent, toolName: tool.name, callId: exec.callId, reason: `${tool.connector}: ${clip(oneLine(tool.description), 160)} Arguments: ${clip(JSON.stringify(input), 400)}`, signal: exec.signal })
        if (outcome !== 'allowed-once') throw new Error('The user did not approve this connector action')
      }
      return resultOf(await client.callTool(tool.name, input, exec.signal))
```

</details>

**依据 3 · 源码核查**：[src/subscription-credentials.js:12-23](https://github.com/WSL043/dsh-codex-subscription/blob/3afece2715009b8adcb4ae3cecdc4b456a75e9d0/src/subscription-credentials.js#L12-L23)

当前账号一致性门禁可作为账的身份来源。

<details>
<summary>查看原文（12行）</summary>

```text
export async function readSubscriptionCredentials(getAuth, readCredential, signal) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const auth = await getAuth({ signal })
    signal?.throwIfAborted()
    if (typeof auth?.auth?.apiKey !== 'string' || !auth.auth.apiKey) break
    const credential = await readCredential({ signal })
    signal?.throwIfAborted()
    if (credential?.type !== 'oauth') break
    if (credential.access === auth.auth.apiKey) return { access: credential.access, accountId: credential.accountId }
  }
  return { access: undefined, accountId: undefined }
}
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
