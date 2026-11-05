# DSH Multi Subscription Hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[34dae26](https://github.com/Aa728848/dsh-chatgpt-subscription/tree/34dae2603ad2c2f7ace196722122a5d098345dcd)

<!-- BEGIN META -->
[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aa728848/dsh-chatgpt-subscription) [![npm 30d 23,131](https://img.shields.io/static/v1?label=npm+30d&message=23%2C131&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eddyskywalker/dsh-chatgpt-subscription) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eddyskywalker/dsh-chatgpt-subscription)
<!-- END META -->

> **功能**：集中订阅线路、账号池和模型运行配置

> **亮点**：[Q01](#research-q01) 集中管理与按调用目录绑定账号请求。

> **主要限制**：[Q03](#research-q03) 根包面积大，Linux明文与多存储留存需核对，授权依线路。

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
  - [Q01 · 根包的范围和实际增量是什么？](#detail-section-11)
  - [Q02 · Codex账号池如何进入请求？](#detail-section-12)
  - [Q03 · 存储与授权有哪些具体限制？](#detail-section-13)
  - [Q04 · 怎样限制试用与退出成本？](#detail-section-14)
  - [Q05 · 怎样验证统一管理有净收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多订阅用户希望统一模型和账号管理。

独立供应商配置和手工切账号。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 统一线路设置 | 集中账号与模型选择 | 各线路需独立验收 |
| Codex账号池 | 401刷新和429冷却切换 | 未证明流中断无重复 |
| 存储选择 | 显式keyring或credentials | 切换不清理另一存储 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH及provider接缝 | 必需 | 注册模型和工具 | 广泛兼容仅作者声明 |
| 允许使用的订阅账号 | 必需 | 供应商授权与配额 | 各线路条件独立 |
| 系统keyring或credentials | 按模式 | 保存账号池 | Linux单凭据非加密 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 只选一条线路，记录profile和存储 | 核对官方许可条件 |
| 验证 | 无敏任务模拟401/429和取消 | 记录实际账号、请求及输出 |
| 退出 | logout并核对两种pool与单凭据 | 恢复原provider和web选择 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号与部署资源未知 | keyring代理及版本核对耗时未知 | 本次未登录 |
| 持续 | 多模型及维护资源未知 | 额度、适配和附加工具管理耗时未知 | 单位任务成本未知 |
| 恢复 | 恢复资源未知 | 逐存储清理与profile恢复耗时未知 | 移除包不等于撤销授权 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 账号切换 | Codex代码存在刷新冷却循环 | 真实成功率未知 |
| 目录一致 | prepareCall绑定同快照 | 上游目录准确性未知 |
| 存储边界 | 两模式及Linux非加密可见 | 真实清理和权限未验 |

> **思考**：[Q03](#research-q03) 根包面积大，Linux明文与多存储留存需核对，授权依线路。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中管理与按调用目录绑定账号请求。

Codex并发槽、401刷新和429冷却链路可追踪。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 根包面积大，Linux明文与多存储留存需核对，授权依线路。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只观察已允许线路，隔离账号及原profile快照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的核对一条订阅线路的账号切换及安全退出。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/host/adapter.ts、src/host/responses-client.ts、src/host/common/pool-storage.ts、src/host/platform-token-store.ts、src/host/token-store-linux.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的核对一条订阅线路的账号切换及安全退出。未执行目标代码或实际宿主验证。
- 下一步：保留请求标识、存储清单和恢复前后配置。

**分析版本**

- **仓库**：[Aa728848/dsh-chatgpt-subscription](https://github.com/Aa728848/dsh-chatgpt-subscription)
- **版本号**：0.58.0（[固定提交 34dae26](https://github.com/Aa728848/dsh-chatgpt-subscription/tree/34dae2603ad2c2f7ace196722122a5d098345dcd)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 单线路管理可减少切换摩擦，净收益待测。

保留请求标识、存储清单和恢复前后配置。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 66 | 14216 | — | — | 298220 |
| .mjs | source | 3 | 408 | 322 | 48 | — |
| .ts | source | 414 | 181975 | 113136 | 57550 | — |
| .tsx | source | 54 | 17981 | 13818 | 3395 | — |
| .ts | test | 319 | 113712 | 89756 | 13902 | — |
| .tsx | test | 47 | 13417 | 10492 | 1738 | — |
| .js | source | 1 | 1102 | 857 | 136 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Aa728848/dsh-chatgpt-subscription/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对一条订阅线路的账号切换及安全退出

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根包的范围和实际增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包整合多条供应线路、账号界面以及额外运行时工具，作者还声明随包dispatch预设。相对分别安装供应商插件，增量是统一配置和账号池策略。为使采用主张可核查，本次深入Codex请求链和共享存储，其他线路只确认根入口的模块装配，不据此声称每条授权、图像或视频工具可用。合格结果是一条已允许使用的线路能正确选账号、报错和退出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/README.md#L3-L9)

作者说明根包范围

```text
面向 **DeepSeek Harness（DSH）** 的多平台订阅接入与智能体运行时增强插件包。

插件最初为接入 ChatGPT Plus / Pro / Business 订阅的 Codex 模型而建，现已演进为统一的**多订阅服务中枢（Subscription Hub）与编码 Agent 增强套件**：在单一插件包内同时提供 **13 条独立模型供应线路**、跨平台加密多账号池、多模态生图/视频工具链、前缀缓存零漂移保护，以及随包分发的 `dispatch` 多子代理编排预设。

- **跨平台支持**：Windows、macOS、Linux（含无桌面密钥环的远程服务器部署模式）
- **跨代际兼容**：单一代码库兼容 `@deepseek-ai/dsh` **0.1.2-alpha.5 至 0.2.2-rc.1** 全系列版本
- **全栈多语言**：Web 设置中心与宿主侧提示/报错完整支持 **简体中文（`zh`）/ English（`en`）/ Русский（`ru`）**
```

**依据 2 · 源码核查**：[src/index.ts:16-40](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L16-L40)

根入口Codex依赖

<details>
<summary>查看原文（25行）</summary>

```text
import { CodexChatGptAdapter, PROVIDER_ID } from './host/adapter.ts'
import { loadCodexCatalog } from './host/codex-catalog.ts'
import { CodexAccountPool, codexAccountQuota } from './host/codex-account-pool.ts'
import { createCodexFetchProvider } from './host/codex-fetch.ts'
import { resolveFetchConfiguration, DEFAULT_FETCH_MAX_BODY_CHARS, DEFAULT_FETCH_MAX_RESPONSE_BYTES } from './host/fetch-configuration.ts'
import { MAX_TIMER_DELAY_MS } from '@deepseek-ai/dsh-timeout'
import { DEFAULT_STREAM_IDLE_TIMEOUT_MS } from './host/common/idle-watchdog.ts'
import { HostLocaleRuntime, installHostLocale } from './host/common/i18n/index.ts'
import { webServerOrigin } from './host/common/webserver-compat.ts'
import { createCodexImageTool } from './host/codex-images.ts'
import { createAntigravityImageTool } from './host/antigravity/image-tool.ts'
import { createCodexSearchProvider } from './host/codex-search.ts'
import { OAuthService } from './host/oauth-service.ts'
import { ProxyManager } from './host/proxy-manager.ts'
import { CONTROLLED_PROVIDERS, createControlledModelFetch, readModelRequestLimits, type ControlledProvider } from './host/common/model-request-control.ts'
import { claimProviderRoute } from './host/common/provider-route.ts'
import { catalogTotal } from './host/common/catalog-snapshot.ts'
import { createDiagnosticFetch } from './host/common/request-diagnostics.ts'
import { registerPreferenceStore } from './host/preferences.ts'
import { ResponsesClient } from './host/responses-client.ts'
import { registerHubOverviewRoutes, type HubSummarySource } from './host/hub-overview.ts'
import { registerUpdateRoutes } from './host/update-check.ts'
import { registerRoutes } from './host/routes.ts'
import { CODEX_MODEL_CATALOG } from './shared/model-catalog.ts'
import { createPlatformTokenStore } from './host/platform-token-store.ts'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1779-1787](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L1779-L1787)

实际模型及工具注册

```text
    const disposeUpdateRoutes = registerUpdateRoutes(ctx, { fetchFn: proxyFetch })
    const disposeAdapter = ctx.llm.registerAdapter([PROVIDER_ID], adapter)
    const disposeImageTool = ctx.tools.register(createCodexImageTool(oauth, ctx.attachments, { fetchFn: proxyFetch }))
    // gemini-3.1-flash-image is served as a tool, not a chat model: the harness
    // accepts text-only assistant output, so only a tool result can carry the image.
    const disposeAntigravityImageTool = ctx.tools.register(createAntigravityImageTool(
      antigravityAccountPool,
      antigravityStore,
      ctx.attachments,
```

#### 缺口

- 其他供应商具体协议、配额与授权行为未逐条运行核查。
  **影响**：不能把Codex链路结论外推到整个多线路根包。
  **进一步探讨**：后续每次只选一条线路做完整闭环。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Codex账号池如何进入请求？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根入口构造CodexAccountPool并用UsageService提供已耗尽窗口筛除，创建adapter时把live catalog loader绑定到OAuth凭据。prepareCall将同一目录快照用于模型解析和wire能力。responses-client每次选择未试账号并获取并发槽，401做一次刷新，刷新失败可换账号，429设冷却并释放槽再换账号。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1321-1329](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L1321-L1329)

账号池和quota检查接线

```text
    // The ChatGPT account pool. Its mirror store is the same platform store the
    // plugin used before the pool existed, so a pre-pool sign-in is projected as
    // the primary account and nothing has to be migrated up front.
    const codexAccountPool = new CodexAccountPool({ store })
    const oauth = new OAuthService(store, { fetchFn: proxyFetch, logger: ctx.logger, pool: codexAccountPool })
    const usage = new UsageService(oauth, { fetchFn: proxyFetch })
    // A pooled account whose last known Codex window is spent is skipped before
    // a request is spent on it, instead of rediscovering the same 429 each time.
    codexAccountPool.setQuotaBlockedUntil((account, now) => usage.blockedUntilFor(account.id, account.credentials, now))
```

**依据 2 · 源码核查**：[src/index.ts:1422-1428](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L1422-L1428)

实际adapter构造

```text
    // The live listing is the authority on what this plan serves; without a
    // credential the loader reports none and the shipped table stands in.
    const adapter = new CodexChatGptAdapter(responses, preferences, (options) => (
      oauth.credentials(undefined, { purpose: 'tool' })
        .then((credentials) => loadCodexCatalog(credentials, { fetchFn: proxyFetch, signal: options?.signal }))
        .catch(() => [])
    ))
```

**依据 3 · 源码核查**：[src/host/adapter.ts:70-88](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/adapter.ts#L70-L88)

单调用目录绑定及流调用

<details>
<summary>查看原文（19行）</summary>

```text
  async prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall> {
    // ONE listing for this call, bound to it. The model the picker shows and
    // the protocol the request speaks have to come from the same listing: a
    // fallback model resolved against a listing the request never saw is a
    // request whose shape was decided by a catalog that is no longer current.
    const catalog = await this.catalog(signal)
    return {
      model: resolveCodexModel(model, this.preferences, catalog),
      // The resolver takes the model, because a 404 fallback moves the request
      // to another one that may speak another protocol.
      stream: (options) => this.client.stream(options, (id) => resolveCodexWireCapabilities(id, catalog)),
    }
  }

  stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // The direct path cannot bind a listing to the call, so it uses the one
    // already held: no network call on the hot path, and the live listing
    // still outranks the shipped table.
    return this.client.stream(options, (id) => resolveCodexWireCapabilities(id, getCachedCatalog()))
```

</details>

**依据 4 · 源码核查**：[src/host/responses-client.ts:287-340](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/responses-client.ts#L287-L340)

账号选择、并发、401和429

<details>
<summary>查看原文（54行）</summary>

```text
  private async sendWithPool(
    payload: Record<string, unknown>,
    sessionId: string,
    turnKey: string,
    signal?: AbortSignal,
    useResponsesLite: boolean = false,
  ): Promise<{ response: Response; release: () => void }> {
    const pool = this.accountPool!
    const tried = new Set<string>()
    while (true) {
      const selected = await pool.getEffectiveAccount(tried, this.fetchFn)
      const account = selected.account
      let credentials = selected.credentials
      tried.add(account.id)
      // One slot per in-flight request on this account. A subagent fan-out is what
      // reaches a plan's concurrency bound, so the cap is held here, before the
      // request goes out, and released when the turn ends rather than when the
      // headers arrive: a stream still running is still work the account is doing.
      const release = await chatGPTConcurrency().acquire(account.id, signal)
      let held = true
      const free = (): void => {
        if (!held) return
        held = false
        release()
      }
      try {
        let response = await this.request(payload, credentials, sessionId, turnKey, signal, useResponsesLite)
        if (response.status === 401) {
          await response.body?.cancel().catch(() => undefined)
          try {
            credentials = await pool.refreshAccountNow(account.id)
            response = await this.request(payload, credentials, sessionId, turnKey, signal, useResponsesLite)
          } catch (error) {
            await pool.markAuthFailed(
              account.id,
              error instanceof Error ? error.message : 'ChatGPT sign-in expired.',
            ).catch(() => undefined)
            free()
            if (await pool.hasAnotherAvailableAccount(tried)) continue
            throw new LlmError('ChatGPT sign-in has expired. Sign in again.', 'AUTH', { status: 401, cause: error })
          }
        }
        if (response.status === 429) {
          const after = retryAfterMs(response.headers)
          await response.body?.cancel().catch(() => undefined)
          // Generic 429 cannot distinguish concurrency from RPM/TPM/quota.
          // Honour cooldown without inventing a persistent concurrency limit.
          await pool.markCooldown(account.id, after ?? DEFAULT_POOL_COOLDOWN_MS, 'Codex 429').catch(() => undefined)
          free()
          if (await pool.hasAnotherAvailableAccount(tried)) continue
          throw new LlmError('Codex rate limit reached.', 'RATE_LIMIT', {
            status: 429,
            ...(after === undefined ? {} : { providerRetryAfterMs: after }),
          })
```

</details>

#### 缺口

- 取消和流中断时槽释放、部分输出重试未完整验证。
  **影响**：可能增加等待或误用账号，不能由错误码恢复分支推定无重复效果。
  **进一步探讨**：模拟响应与半截流，记录账号及请求次数。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 存储与授权有哪些具体限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

账号池存储可显式选择keyring或宿主credentials，源码明确不自动猜测并说明切换后另一存储仍留账号。单凭据Linux实现是0600权限文件且encrypted:false，不能泛称全平台加密。作者对某些订阅线路提示未获供应商授权及封号风险，这是固定版本作者声明，当前服务条件需另核。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/common/pool-storage.ts:11-25](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/common/pool-storage.ts#L11-L25)

存储选择及遗留账号

<details>
<summary>查看原文（15行）</summary>

```text
 * So the store becomes a choice with exactly two values:
 *
 * - `keyring` (default) — the platform store: DPAPI on Windows, the Keychain on
 *   macOS, the Secret Service on Linux. Every existing install has this, and
 *   nobody who never touches the setting sees a change.
 * - `credentials` — DSH's own credential store, through `ctx.credentials`. The
 *   option a server install should use: no external daemon, one store for every
 *   secret the host holds.
 *
 * There is deliberately NO automatic mode. An `auto` that picks by probing would
 * let one pool move between two stores depending on whether a daemon happened to
 * answer, and a pool that moves looks exactly like a pool whose accounts were
 * lost. A wrong choice is reported instead — the card names the store in use, says
 * why the configured one is unusable and offers the switch — and the accounts that
 * stayed behind in the other store are still there.
```

</details>

**依据 2 · 源码核查**：[src/host/platform-token-store.ts:6-10](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/platform-token-store.ts#L6-L10)

平台选择

```text
export function createPlatformTokenStore(platform: NodeJS.Platform = process.platform): TokenStore {
  if (platform === 'win32') return new WindowsDpapiTokenStore()
  if (platform === 'darwin') return new MacKeychainTokenStore()
  if (platform === 'linux') return new LinuxFileTokenStore()
  throw new Error(`Unsupported platform ${platform}; dsh-chatgpt-subscription supports Windows, macOS, and Linux.`)
```

**依据 3 · 源码核查**：[src/host/token-store-linux.ts:17-24](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/token-store-linux.ts#L17-L24)

Linux文件非加密

```text
/**
 * Linux credential storage protected by owner-only filesystem permissions.
 * The payload is not encrypted at rest, so callers must report that distinction
 * instead of presenting this store as equivalent to Windows DPAPI.
 */
export class LinuxFileTokenStore implements TokenStore {
  readonly storage = { kind: 'linux-file', encrypted: false } as const
  private readonly noFollow = constants.O_NOFOLLOW
```

**依据 4 · 作者声明**：[README.md:49-50](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/README.md#L49-L50)

作者对特定线路合规风险提示

```text
> **合规与风险提示**：
> - `claude-subscription` 通过订阅 OAuth 凭据模拟官方 CLI 身份转发请求，与 Anthropic 现行服务条款存在冲突，未获官方授权，存在账号被限制或封禁的风险。
```

#### 缺口

- 实际keyring、文件权限和当前供应商许可未验。
  **影响**：可能在错误假设下保存可用令牌或选择不允许的服务方式。
  **进一步探讨**：限定隔离账号，核查目标线路官方条件及两种存储。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限制试用与退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先固定宿主和包版本，仅启用一条已核对授权条件的线路，保留原provider、模型与web选择。首次成本是账号、密钥环和代理配置，持续是配额、更新、多账号和模型兼容；退出需logout所有测试账号，分别检查单凭据、pool两种存储、宿主引用和额外工具，不能只移除包。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-62](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/README.md#L62-L62)

作者存储模式说明

```text
- **桌面与无头服务器双存储模式**：默认使用系统加密密钥环（`keyring`：Windows DPAPI / macOS Keychain / Linux Secret Service）；无桌面环境的 Linux 服务器可一键切换至 DSH 标准凭据库（`credentials`：`$DSH_HOME/.credentials.yaml`，强制 `0600` 权限），告别安装 `gnome-keyring` 的繁琐配置。
```

**依据 2 · 源码核查**：[src/index.ts:534-568](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L534-L568)

存储配置与hydrate

<details>
<summary>查看原文（35行）</summary>

```text
  poolStorage: z.union([z.const('keyring'), z.const('credentials')]).default('keyring')
    .description('号池存储后端：keyring（默认，桌面平台的系统密钥环）或 credentials（DSH 凭据库，服务器推荐）。'),
})

export const inject = ['webServer', 'llm', 'attachments', 'tools', 'settings', 'loader']

export function apply(ctx: Context, pluginConfig: Config = {}): void {
  // The language every Host-side composer answers in. Created once per apply and
  // published to the module-level slot, because thirteen adapters and the route
  // table all speak without sharing a constructor: they read the language at the
  // moment they compose a sentence, and the client mirrors the browser's resolved
  // locale into it through POST /i18n/locale. Detached on dispose so a reload
  // cannot leave a stale runtime behind.
  const localeRuntime = new HostLocaleRuntime()
  installHostLocale(localeRuntime)
  ctx.effect(() => () => installHostLocale(undefined), 'dsh-chatgpt-subscription: host locale')
  const fetchConfiguration = resolveFetchConfiguration(pluginConfig)
  // Where every line's account pool lives. Read here, once, because the choice is
  // one per deployment: the eleven pools are built below from that one value.
  //
  // Two sources, in this order: the settings card's own document (written by
  // `POST /storage`, remembered across restarts) and the profile's `poolStorage`.
  // The getter is a function rather than a captured value because the card may
  // change it while the host runs — `PoolStorageSettings.update` bumps the
  // revision every pool checks before using its cached backend.
  //
  // The credential store is OPTIONAL and read through `get`: harnesses before 0.2
  // have no such service, and declaring it in `inject` would make the whole plugin
  // fail to mount on those hosts — turning "your pools go somewhere else here"
  // into "this plugin does not load".
  const poolStorageSettings = new PoolStorageSettings()
  void poolStorageSettings.hydrate().catch(() => undefined)
  configurePoolStorage({
    mode: () => poolStorageSettings.effective(pluginConfig.poolStorage),
    ready: () => poolStorageSettings.hydrate().catch(() => undefined),
```

</details>

**依据 3 · 源码核查**：[src/host/common/pool-storage.ts:20-25](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/common/pool-storage.ts#L20-L25)

另一个存储不自动删除

```text
 * There is deliberately NO automatic mode. An `auto` that picks by probing would
 * let one pool move between two stores depending on whether a daemon happened to
 * answer, and a pool that moves looks exactly like a pool whose accounts were
 * lost. A wrong choice is reported instead — the card names the store in use, says
 * why the configured one is unusable and offers the switch — and the accounts that
 * stayed behind in the other store are still there.
```

**依据 4 · 源码核查**：[src/index.ts:1779-1787](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/index.ts#L1779-L1787)

额外模型和工具接线

```text
    const disposeUpdateRoutes = registerUpdateRoutes(ctx, { fetchFn: proxyFetch })
    const disposeAdapter = ctx.llm.registerAdapter([PROVIDER_ID], adapter)
    const disposeImageTool = ctx.tools.register(createCodexImageTool(oauth, ctx.attachments, { fetchFn: proxyFetch }))
    // gemini-3.1-flash-image is served as a tool, not a chat model: the harness
    // accepts text-only assistant output, so only a tool result can carry the image.
    const disposeAntigravityImageTool = ctx.tools.register(createAntigravityImageTool(
      antigravityAccountPool,
      antigravityStore,
      ctx.attachments,
```

#### 缺口

- 整包卸载清理、代理恢复及全部预设留存未测。
  **影响**：广泛运行时改动会增加恢复核对和维护。
  **进一步探讨**：从原profile快照回验，未核清则不转日常环境。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证统一管理有净收益？

**研究主题**：新假设与验证

#### 完整回答

同一无副作用任务对照单账号直连、单线路池和整合根包，记录正确模型、账号选择、401/429恢复、总请求和退出后授权。注入存储不可用、切换存储、过期token与半截流。若旧存储令牌被遗漏、退出后仍可调用，或额外维护超过切换便利，则缩回独立单线路。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/responses-client.ts:287-340](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/responses-client.ts#L287-L340)

可测试账号与错误分支

<details>
<summary>查看原文（54行）</summary>

```text
  private async sendWithPool(
    payload: Record<string, unknown>,
    sessionId: string,
    turnKey: string,
    signal?: AbortSignal,
    useResponsesLite: boolean = false,
  ): Promise<{ response: Response; release: () => void }> {
    const pool = this.accountPool!
    const tried = new Set<string>()
    while (true) {
      const selected = await pool.getEffectiveAccount(tried, this.fetchFn)
      const account = selected.account
      let credentials = selected.credentials
      tried.add(account.id)
      // One slot per in-flight request on this account. A subagent fan-out is what
      // reaches a plan's concurrency bound, so the cap is held here, before the
      // request goes out, and released when the turn ends rather than when the
      // headers arrive: a stream still running is still work the account is doing.
      const release = await chatGPTConcurrency().acquire(account.id, signal)
      let held = true
      const free = (): void => {
        if (!held) return
        held = false
        release()
      }
      try {
        let response = await this.request(payload, credentials, sessionId, turnKey, signal, useResponsesLite)
        if (response.status === 401) {
          await response.body?.cancel().catch(() => undefined)
          try {
            credentials = await pool.refreshAccountNow(account.id)
            response = await this.request(payload, credentials, sessionId, turnKey, signal, useResponsesLite)
          } catch (error) {
            await pool.markAuthFailed(
              account.id,
              error instanceof Error ? error.message : 'ChatGPT sign-in expired.',
            ).catch(() => undefined)
            free()
            if (await pool.hasAnotherAvailableAccount(tried)) continue
            throw new LlmError('ChatGPT sign-in has expired. Sign in again.', 'AUTH', { status: 401, cause: error })
          }
        }
        if (response.status === 429) {
          const after = retryAfterMs(response.headers)
          await response.body?.cancel().catch(() => undefined)
          // Generic 429 cannot distinguish concurrency from RPM/TPM/quota.
          // Honour cooldown without inventing a persistent concurrency limit.
          await pool.markCooldown(account.id, after ?? DEFAULT_POOL_COOLDOWN_MS, 'Codex 429').catch(() => undefined)
          free()
          if (await pool.hasAnotherAvailableAccount(tried)) continue
          throw new LlmError('Codex rate limit reached.', 'RATE_LIMIT', {
            status: 429,
            ...(after === undefined ? {} : { providerRetryAfterMs: after }),
          })
```

</details>

**依据 2 · 源码核查**：[src/host/common/pool-storage.ts:20-25](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/common/pool-storage.ts#L20-L25)

存储留存可测试

```text
 * There is deliberately NO automatic mode. An `auto` that picks by probing would
 * let one pool move between two stores depending on whether a daemon happened to
 * answer, and a pool that moves looks exactly like a pool whose accounts were
 * lost. A wrong choice is reported instead — the card names the store in use, says
 * why the configured one is unusable and offers the switch — and the accounts that
 * stayed behind in the other store are still there.
```

**依据 3 · 源码核查**：[src/host/adapter.ts:70-88](https://github.com/Aa728848/dsh-chatgpt-subscription/blob/34dae2603ad2c2f7ace196722122a5d098345dcd/src/host/adapter.ts#L70-L88)

模型目录绑定可对照

<details>
<summary>查看原文（19行）</summary>

```text
  async prepareCall(provider: string, model: string, signal?: AbortSignal): Promise<PreparedAdapterCall> {
    // ONE listing for this call, bound to it. The model the picker shows and
    // the protocol the request speaks have to come from the same listing: a
    // fallback model resolved against a listing the request never saw is a
    // request whose shape was decided by a catalog that is no longer current.
    const catalog = await this.catalog(signal)
    return {
      model: resolveCodexModel(model, this.preferences, catalog),
      // The resolver takes the model, because a 404 fallback moves the request
      // to another one that may speak another protocol.
      stream: (options) => this.client.stream(options, (id) => resolveCodexWireCapabilities(id, catalog)),
    }
  }

  stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // The direct path cannot bind a listing to the call, so it uses the one
    // already held: no network call on the hot path, and the live listing
    // still outranks the shipped table.
    return this.client.stream(options, (id) => resolveCodexWireCapabilities(id, getCachedCatalog()))
```

</details>

#### 缺口

- 本轮没有订阅登录、网络调用或存储实验。
  **影响**：无法支持整体可用率、节省费用或跨代兼容结论。
  **进一步探讨**：保留请求标识、存储清单和恢复前后配置。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
