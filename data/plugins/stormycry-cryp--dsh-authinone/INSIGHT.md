# dsh-AuthInOne

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[190ecc2](https://github.com/Stormycry-cryp/dsh-AuthInOne/tree/190ecc2d834ba06da008522684e689324a9c2706)

<!-- BEGIN META -->
[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Stormycry-cryp/dsh-AuthInOne)
<!-- END META -->

> **功能**：在 DSH 原生模型与用量设置增加账号接入、模型切换和费用分析。

> **亮点**：[Q01](#research-q01) 把账号状态与模型使用放进同一界面。

> **主要限制**：[Q02](#research-q02) 精确 Host 依赖和提供商确认边界限制真实可用性。

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
  - [Q01 · 账号接入在何处变成模型选择？](#detail-section-11)
  - [Q02 · 凭据刷新和兼容绑定如何限制采用？](#detail-section-12)
  - [Q03 · 怎样先测账号面板的实际价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户管理多种模型账号与 API Provider，需要集中查看。

原生 API Provider 设置加单独账户与日志核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 账号 | 启动与管理授权 | 提供商许可独立 |
| 用量 | 聚合模型统计 | 费用为计算结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 精确兼容 DSH 构建 | 必需 | 注册原生页面及凭据 | 未知指纹拒绝引导安装 |
| 提供商合法账号或 API | 按路径需要 | 调用模型 | 外部许可和配额独立 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对 Host 与测试 profile | 保存当前状态 |
| 接入 | 单 Provider 授权或配置 | 分别验收调用 |
| 核账 | 比较 Usage 与实际服务 | 缺价不推断账单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 费用未知 | 匹配构建并配置账号 | 可能替换 Host |
| 持续 | 调用费用未知 | 维护路由、协议和价格 | 逐提供商差异 |
| 失败 | 恢复工时未知 | 恢复原 API 路由 | 核对退出和凭据状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型管理 | 集中状态、切换和使用量 | 真实账号调用及账单精度 |

> **思考**：[Q02](#research-q02) 精确 Host 依赖和提供商确认边界限制真实可用性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把账号状态与模型使用放进同一界面。

[Q02](#research-q02) 刷新 single flight 为实例内，兼容流程要独立验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 精确 Host 依赖和提供商确认边界限制真实可用性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先现有 API Provider，再单账号授权验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对协调和刷新，真实 OAuth 完成与用量未复验。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/auth.ts、src/host/index.ts、src/host/auth-store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 登录协调、刷新和模型状态，未读取凭据或授权。
- 下一步：匹配构建验证登录、调用、刷新、退出及模型统计。

**分析版本**

- **仓库**：[Stormycry-cryp/dsh-AuthInOne](https://github.com/Stormycry-cryp/dsh-AuthInOne)
- **版本号**：0.2.0-alpha.4（[固定提交 190ecc2](https://github.com/Stormycry-cryp/dsh-AuthInOne/tree/190ecc2d834ba06da008522684e689324a9c2706)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 单 Provider 对照配置和核账工时。

匹配构建验证登录、调用、刷新、退出及模型统计。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 1035 | — | — | 17284 |
| .js | source | 10 | 240781 | 232942 | 8337 | — |
| .ts | source | 37 | 8835 | 8161 | 304 | — |
| .tsx | source | 8 | 1545 | 1463 | 14 | — |
| .ts | test | 17 | 2231 | 2060 | 69 | — |
| .tsx | test | 1 | 548 | 509 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Stormycry-cryp/dsh-AuthInOne/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否在原生设置管理账号模型并核对使用量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账号接入在何处变成模型选择？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件在原生 Models 与 Usage 中提供服务，登录协调器经历 starting、pending 和 connected，并保存 Host 凭据，再提供模型状态。它复用 DSH 的 Provider 和自定义兼容接口，新增账号流程与分析显示。作者实测只到用户确认边界，不能据此声称订阅调用已端到端完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-11](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/README.md#L7-L11)

范围及实测边界。

```text
dsh-AuthInOne is a DeepSeek Harness plugin for Provider login, API and custom OpenAI-compatible Provider setup, model switching, optional vision fallback for text-only models, token usage analytics, and cost tracking inside DSH's native **Models** and **Usage** settings.

OpenAI Codex uses browser OAuth with state, S256 PKCE, and a loopback callback. Kimi Code opens the Provider's complete authorization link backed by an RFC 8628 device flow; the link carries the short code, so the user normally only signs in and confirms. xAI Grok, Anthropic, GitHub Copilot, Command Code, Cursor, Google Antigravity, and Kiro are explicitly marked **Experimental compatibility**. Installed-Host validation reached each Provider's authorization boundary and stopped before user consent; mock/fixture tests cover exchange or polling, refresh rotation, denial, timeout, cancellation, logout, route activation, and secret redaction.

> **Alpha `v0.2.0-alpha.4`** · exact compatibility target: official DSH `47f9438` · the self-contained bootstrap uses the official DSH plugin CLI and returns Web on its original port · [release notes](docs/releases/v0.2.0-alpha.4.md) · MIT · community-maintained and not a DeepSeek or OpenAI product.
```

**依据 2 · 源码核查**：[src/host/auth.ts:202-250](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/src/host/auth.ts#L202-L250)

登录状态与凭据成功路径。

<details>
<summary>查看原文（49行）</summary>

```text
    if (this.state.status === 'connected') return this.snapshot()
    if (this.attempt !== undefined) return this.snapshot()
    const attempt: PendingAttempt = { id: randomUUID(), controller: new AbortController(), cancelled: false }
    this.attempt = attempt
    this.state = this.view('starting', { attemptId: attempt.id })

    let resolveReady!: (view: AuthProviderView) => void
    let rejectReady!: (error: unknown) => void
    let readySettled = false
    const ready = new Promise<AuthProviderView>((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })
    void this.engine.login(attempt.controller.signal, ready => {
      if (this.attempt !== attempt) return
      this.state = this.view('pending', {
        authorizationUrl: ready.authorizationUrl,
        verificationUrl: ready.verificationUrl ?? null,
        userCode: ready.userCode ?? null,
        inputPrompt: ready.inputPrompt === undefined ? null : {
          kind: ready.inputPrompt.kind,
          label: ready.inputPrompt.label,
          placeholder: ready.inputPrompt.placeholder ?? null,
        },
        attemptId: attempt.id,
        expiresAt: ready.expiresAt,
      })
      if (!readySettled) {
        readySettled = true
        resolveReady(this.snapshot())
      }
    }).then(accountLabel => {
      if (this.attempt !== attempt) return
      this.attempt = undefined
      if (attempt.cancelled) return
      this.onConnected()
      this.state = this.view('connected', { accountLabel })
      if (!readySettled) {
        readySettled = true
        resolveReady(this.snapshot())
      }
    }, error => {
      if (this.attempt !== attempt) return
      this.attempt = undefined
      const failure = this.failure(error)
      const status = attempt.cancelled || failure.category === 'cancelled'
        ? 'cancelled'
        : failure.category === 'expired' ? 'expired' : 'error'
      this.state = this.view(status, { errorCategory: failure.category, error: failure.message })
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:275-304](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/src/host/index.ts#L275-L304)

模型状态入口。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Read provider routes, connection state, models, and the future-Agent default. */
  @Remote('providers')
  async providers(): Promise<ProviderHubView> {
    await this.authReady
    await Promise.all(this.authRuntimes.map(runtime => runtime.coordinator.synchronize()))
    const active = new Map(this.ctx.llm.listProviders().map(provider => [provider.id, provider]))
    const configurable = new Map(this.ctx.llm.listConfigurableProviders().map(provider => [provider.provider, provider]))
    const authInstances = this.authRuntimes
      .map(runtime => runtime.coordinator.snapshot())
      .filter(auth => isAuthProviderInstance(auth.status))
    const ids = [...new Set([
      ...configurable.keys(),
      ...active.keys(),
      ...authInstances.map(auth => auth.id),
    ])]
    const descriptors = this.descriptors()
    const candidates = await Promise.all(ids.map(async (id): Promise<ProviderConnectionView | null> => {
      const live = active.get(id)
      const entry = configurable.get(id)
      const descriptor = entry === undefined ? undefined : descriptors.get(entry.settingsNs)
      const profile = entry === undefined ? undefined : getPath(descriptor?.value, entry.settingsPath)
      const runtime = this.authRuntime(id)
      const authCatalog = runtime?.coordinator.snapshot()
      const auth = authCatalog !== undefined && isAuthProviderInstance(authCatalog.status) ? authCatalog : undefined
      if (!shouldProjectProviderConnection({
        provider: id,
        hasLiveRoute: live !== undefined,
        hasProfile: profile !== undefined,
        authStatus: auth?.status ?? null,
      })) return null
```

</details>

#### 缺口

- 当前真实账号授权与模型输出未知
  **影响**：无法保证提供商政策和订阅可用
  **进一步探讨**：用户授权下单独验收 consent、模型调用与刷新

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据刷新和兼容绑定如何限制采用？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

凭据存储将同一 Provider 的 refreshFlight 合并，观察到拒绝会要求重新授权。按 generation 处理竞争，但这只覆盖同服务实例，跨 Host 还需验收。固定候选要求精确官方构建，bootstrap 会校验 Host 并替换同端口服务。实验兼容渠道必须分别验证提供商允许的调用和撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/auth-store.ts:55-65](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/src/host/auth-store.ts#L55-L65)

实例级刷新控制。

<details>
<summary>查看原文（11行）</summary>

```text
/** Serializes DSH credential writes and deduplicates refresh for one Provider. */
export class DshOAuthCredentialStore {
  private mutation = Promise.resolve<unknown>(undefined)
  private refreshFlight: Promise<StoredOAuthCredential> | undefined
  private readonly ref

  constructor(private readonly ctx: Context, name = 'DSH_AUTH_IN_ONE_OPENAI_CODEX_OAUTH') {
    this.ref = name === 'DSH_AUTH_IN_ONE_OPENAI_CODEX_OAUTH'
      ? OPENAI_CODEX_CREDENTIAL_REF
      : credentialRef(name)
  }
```

</details>

**依据 2 · 源码核查**：[src/host/auth-store.ts:97-132](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/src/host/auth-store.ts#L97-L132)

刷新、拒绝和 single flight。

<details>
<summary>查看原文（36行）</summary>

```text
  /** Return a fresh access token, rotating the stored refresh token at most once per generation. */
  async accessToken(adapter: AuthProviderAdapter, signal?: AbortSignal): Promise<string> {
    const current = await this.read()
    if (current === undefined || current.needsReauth === true) throw new AuthProtocolError('refresh-rejected')
    if (current.expiresAt > Date.now() + REFRESH_EARLY_MS) return current.accessToken
    if (this.refreshFlight !== undefined) return (await this.refreshFlight).accessToken
    const startedGeneration = credentialGeneration(current)
    const refresh = (async (): Promise<StoredOAuthCredential> => {
      let fresh: StoredOAuthCredential
      try {
        fresh = await adapter.refresh(current, signal)
      } catch (error) {
        if (error instanceof AuthProtocolError && error.category === 'refresh-rejected') {
          await this.enqueue(async () => {
            const stored = await this.read()
            if (stored === undefined || credentialGeneration(stored) !== startedGeneration) return
            await this.ctx.credentials.set(this.ref, JSON.stringify({ ...stored, needsReauth: true }))
          })
        }
        throw error
      }
      return this.enqueue(async () => {
        const stored = await this.read()
        if (stored === undefined) throw new AuthProtocolError('cancelled')
        if (credentialGeneration(stored) !== startedGeneration) {
          if (stored.needsReauth !== true && stored.expiresAt > Date.now() + REFRESH_EARLY_MS) return stored
          throw new AuthProtocolError('refresh-rejected')
        }
        await this.ctx.credentials.set(this.ref, JSON.stringify(fresh))
        return fresh
      })
    })().finally(() => {
      if (this.refreshFlight === refresh) this.refreshFlight = undefined
    })
    this.refreshFlight = refresh
    return (await refresh).accessToken
```

</details>

**依据 3 · 作者声明**：[README.md:43-70](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/README.md#L43-L70)

各账号稳定性与注销边界。

<details>
<summary>查看原文（28行）</summary>

```text
| OpenAI Codex browser account authorization | **Verified to user-confirmation boundary** | Real navigation reached `auth.openai.com`; mock issuer covers callback, state/PKCE, exchange, refresh, denial, expiry, cancellation, logout, revocation, and redaction | Official DSH `47f9438` with the bundled compat owner |
| Kimi Code authorization connection | **Experimental; verified to user-confirmation boundary** | Installed Host returned the complete Kimi authorization link without returning the Host-only device code; the UI does not ask users to re-enter a short code already embedded in that link | Official DSH `47f9438` with bundled compat owner |
| Seven compatibility account flows | **Experimental; verified to user-confirmation boundary** | xAI, Anthropic, GitHub Copilot, Command Code, Cursor, Antigravity, and Kiro each reached their expected authorization boundary; mocked completion registers and later disposes the corresponding model route | Official DSH `47f9438` with bundled compat owner |
| Provider subscription quota | **Best effort where upstream data exists** | Codex, Kimi, xAI, Anthropic, Cursor, and Antigravity have token-free Remote projections; the Models page omits the quota block when the upstream response is missing, incomplete, unsupported, or cannot yield a reliable percentage | Official DSH `47f9438` with bundled compat owner |
| Plan/API presets | **Available with vendor limits shown** | OpenAI, xAI, Gemini, Anthropic, Kimi Code, GLM Coding Plan, and ModelStudio/Qwen presets write credentials through DSH; GLM and Qwen usage restrictions remain visible | Official DSH `47f9438` with bundled compat owner |
| DeepSeek API-key Provider and live model call | **API-key only** | Native Provider remained connected; a real DeepSeek call populated Usage without exposing the key | DSH `0.1.0-rc.6` |
| Custom OpenAI-compatible Base URL, headers, model mapping | **Native DSH capability** | AuthInOne preserves the native Models cards and reads their public Provider projection | DSH `0.1.0-rc.6` |
| Future-session default model and connection test | **Verified** | Models contribution and Host/Remote route exercised in the installed Web profile | Official DSH `47f9438` with bundled compat owner |
| Vision fallback for text-only main models | **Verified** | PNG/JPEG/WebP/GIF use DSH `ImageBlock` references; multi-image, native multimodal pass-through, disabled fallback, failure, resume, and fork paths have keyless coverage | Official DSH `47f9438` with bundled compat owner |
| Cross-session Usage and cost analytics | **Verified** | Real DSH session logs rebuilt 26,383 Token into KPI, heatmap, model, Provider, bucket, and cost projections | DSH `0.1.0-rc.6` |
| Usage navigation icon | **Verified** | The bundled generic owner projects a keyed icon seat; AuthInOne contributes a 16 px three-bar `currentColor` icon and unknown sections retain the native fallback | Official DSH `47f9438` with the bundled compat owner |

### Account-login support matrix

| Provider | Flow | Stability | Authorization boundary verified | Refresh/logout/model route | Quota |
| --- | --- | --- | --- | --- | --- |
| OpenAI Codex | Browser OAuth, state + S256 PKCE + loopback | Stable | `auth.openai.com` | Yes / Yes / Yes | Primary and secondary windows, best effort |
| Kimi Code | Complete authorization link backed by RFC 8628 | Experimental | `www.kimi.com` | Yes / local logout / Yes | Best effort |
| xAI Grok | Device login | Experimental | `accounts.x.ai` | Yes / Yes / Yes | Weekly or monthly, best effort |
| Anthropic | Browser/manual compatibility login | Experimental compatibility | `claude.ai` | Yes / local logout / Yes | Best effort |
| GitHub Copilot | Device login | Experimental compatibility | `github.com` | Yes / local logout / Yes | Not exposed |
| Command Code | Browser loopback compatibility login | Experimental compatibility | `commandcode.ai` | Refresh via returned account credential / local logout / Yes | Not exposed |
| Cursor | Browser PKCE compatibility login | Experimental compatibility | `cursor.com` | Yes / local logout / Yes | Best effort |
| Google Antigravity | Browser PKCE compatibility login | Experimental compatibility | `accounts.google.com` | Yes / local logout / Yes | Best effort |
| Kiro | Builder ID device login | Experimental compatibility | `view.awsapps.com` | Yes / local logout / Yes | Not exposed |
| Qwen account OAuth | Discontinued | Unsupported | No start action | No | No |

“Local logout” means the plugin deletes its DSH credential and unregisters the model route when the observed compatibility protocol exposes no reviewed revoke endpoint. The browser never receives the stored credential. Stability labels describe implementation risk; they do not imply Provider sponsorship or certification.
```

</details>

**依据 4 · 作者声明**：[README.md:74-80](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/README.md#L74-L80)

引导安装和 Host 替换。

````text
Install or upgrade the immutable tag with the package-owned bootstrap:

```sh
pnpm dlx github:Stormycry-cryp/dsh-AuthInOne#v0.2.0-alpha.4 install --profile web
```

The bootstrap discovers the single listener at `http://127.0.0.1:3080/`, verifies that it is a standard DSH Host, checks the exact supported DSH owner artifacts, invokes the official DSH plugin add command, and schedules a detached same-port replacement. The install command returns before the old Host stops; the browser may disconnect briefly, then the same URL must return.
````

#### 缺口

- 真实凭据轮转和多进程未测
  **影响**：无法保证竞争刷新或第三方协议长期成立
  **进一步探讨**：隔离授权测试并发刷新、拒绝、取消与注销

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样先测账号面板的实际价值？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在匹配 Host 的测试 profile 使用现有 API Provider 查看状态和 Usage，比较手工设置和日志统计。账号流程在用户授权后单渠道验收登录、调用、刷新和退出。若只有到达授权页、费用缺价或路由不稳定，就维持原生 Provider 与账单核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-31](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/README.md#L25-L31)

具体采用场景。

```text
## Use this plugin when

- you want OpenAI Codex or Kimi Code login inside DSH, or knowingly opt into a labeled compatibility flow;
- you manage API-key or custom OpenAI-compatible Providers in DSH's native Models page;
- you switch the future-session default model without replacing DSH's per-session selector;
- you want a separately configured vision model to describe images only when the selected main model explicitly declares text-only input;
- you need reconstructable Provider/model/tool token usage and auditable calculated cost.
```

**依据 2 · 作者声明**：[README.md:43-52](https://github.com/Stormycry-cryp/dsh-AuthInOne/blob/190ecc2d834ba06da008522684e689324a9c2706/README.md#L43-L52)

原生、真实与 fixture 分列。

<details>
<summary>查看原文（10行）</summary>

```text
| OpenAI Codex browser account authorization | **Verified to user-confirmation boundary** | Real navigation reached `auth.openai.com`; mock issuer covers callback, state/PKCE, exchange, refresh, denial, expiry, cancellation, logout, revocation, and redaction | Official DSH `47f9438` with the bundled compat owner |
| Kimi Code authorization connection | **Experimental; verified to user-confirmation boundary** | Installed Host returned the complete Kimi authorization link without returning the Host-only device code; the UI does not ask users to re-enter a short code already embedded in that link | Official DSH `47f9438` with bundled compat owner |
| Seven compatibility account flows | **Experimental; verified to user-confirmation boundary** | xAI, Anthropic, GitHub Copilot, Command Code, Cursor, Antigravity, and Kiro each reached their expected authorization boundary; mocked completion registers and later disposes the corresponding model route | Official DSH `47f9438` with bundled compat owner |
| Provider subscription quota | **Best effort where upstream data exists** | Codex, Kimi, xAI, Anthropic, Cursor, and Antigravity have token-free Remote projections; the Models page omits the quota block when the upstream response is missing, incomplete, unsupported, or cannot yield a reliable percentage | Official DSH `47f9438` with bundled compat owner |
| Plan/API presets | **Available with vendor limits shown** | OpenAI, xAI, Gemini, Anthropic, Kimi Code, GLM Coding Plan, and ModelStudio/Qwen presets write credentials through DSH; GLM and Qwen usage restrictions remain visible | Official DSH `47f9438` with bundled compat owner |
| DeepSeek API-key Provider and live model call | **API-key only** | Native Provider remained connected; a real DeepSeek call populated Usage without exposing the key | DSH `0.1.0-rc.6` |
| Custom OpenAI-compatible Base URL, headers, model mapping | **Native DSH capability** | AuthInOne preserves the native Models cards and reads their public Provider projection | DSH `0.1.0-rc.6` |
| Future-session default model and connection test | **Verified** | Models contribution and Host/Remote route exercised in the installed Web profile | Official DSH `47f9438` with bundled compat owner |
| Vision fallback for text-only main models | **Verified** | PNG/JPEG/WebP/GIF use DSH `ImageBlock` references; multi-image, native multimodal pass-through, disabled fallback, failure, resume, and fork paths have keyless coverage | Official DSH `47f9438` with bundled compat owner |
| Cross-session Usage and cost analytics | **Verified** | Real DSH session logs rebuilt 26,383 Token into KPI, heatmap, model, Provider, bucket, and cost projections | DSH `0.1.0-rc.6` |
```

</details>

#### 缺口

- 实际授权成本和节时未知
  **影响**：不能估计账号方案收益
  **进一步探讨**：对照真实单 Provider 四步验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
