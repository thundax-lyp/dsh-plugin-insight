# dsh-vercel

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[21b3c73](https://github.com/AdenXie/dsh-vercel/tree/21b3c7372284ab53d10e61f2c717d44f752d9567)

<!-- BEGIN META -->
[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)
<!-- END META -->

> **实现功能**：通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。

> **核心亮点**：把OAuth、Agent工具面预算与结果分页接合，减少整目录上下文和接线。详见[Q01](#research-q01)。

> **风险与缺陷**：单机全profile共享token，整份保存无CAS，clear未阻止已在途exchange后commit，投影可能截断单项。详见[Q04](#research-q04)。

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
  - [Q01 · Vercel连接给谁用，核心贡献是什么？](#detail-section-11)
  - [Q02 · OAuth与本地路由如何运作？](#detail-section-12)
  - [Q03 · 按需工具、scope兼容和结果分页怎样避免越权扩面？](#detail-section-13)
  - [Q04 · 当前凭据生命周期与大结果还有哪些具体缺口？](#detail-section-14)
  - [Q05 · 工程证据和分阶段成本如何判断？](#detail-section-15)
  - [Q06 · 怎样采用，进一步探讨哪里？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户管理Vercel项目/部署，希望少手工配置MCP。详见[Q01](#research-q01)。

手工接Vercel MCP/CLI并全量工具schema，按需接线不等新部署协议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| OAuth/MCP | 连接项目能力 | 共享token/官方服务 |
| 按需工具 | 控制上下文 | 不替代宿主审批 |
| 结果/指南读取 | 分页理解操作 | 缓存/文档版本 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 兼容DSH/Node | 工具/设置ABI | 精确候选依赖 |
| Vercel官方MCP/OAuth | 远端目录和操作 | 账号/网络服务约束 |
| HOME凭据文件 | token刷新 | 单机多profile共享 |
| 宿主tools policy | 真实调用审批 | 插件加载不等授权 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 单profile授权 | 用户 | 账户/团队清楚 |
| 搜索加载只读工具 | 模型 | Agent预算与父scope |
| 分页核结果 | 模型/用户 | 不把预览当全部 |
| 写后核官方状态 | 用户 | 未知结果不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主/OAuth账户 | 核团队与按需加载 | OAuth团队/宿主与搜索加载学习成本未知 |
| 持续使用 | 模型上下文/MCP/Vercel | 节约无对照，动作费用依服务 | MCP/模型上下文及Vercel真实动作费用依服务；节约无对照 |
| 失败恢复 | 原授权/官方部署状态 | 清在途、重登、核未知写结果 | 先查官方部署避免重复写；重登/缓存驱逐/在途恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 少工具上下文 | search/load预算 | 加载非动作授权 |
| 账户scope兼容 | list_projects归属核验 | 不改写写操作 |
| 大结果可读 | Agent分页/字段投影 | 单项截断与预算非总内存 |

> **思考**：单机全profile共享token，整份保存无CAS，clear未阻止已在途exchange后commit，投影可能截断单项。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把OAuth、Agent工具面预算与结果分页接合，减少整目录上下文和接线。详见[Q01](#research-q01)。

把OAuth、Agent工具面预算与结果分页接合，减少整目录上下文和接线。详见[Q01](#research-q01)。

作用域mask/guard与generation、PKCE保旧和窄scope重试可借鉴，需凭据epoch/CAS。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

单机全profile共享token，整份保存无CAS，clear未阻止已在途exchange后commit，投影可能截断单项。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信单profile从只读工具试用，写操作核官方结果。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

按需工具/窄scope验证和OAuth保旧流程可查；共享明文store与clear在途交换、结果完整性需明确。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/mcp.ts、src/oauth.ts、src/store.ts、src/routes.ts、src/scope.ts、src/result-cache.ts、tests/oauth-lifecycle.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定TypeScript授权/存储/路由、按需工具/祖先限制、scope兼容、结果cache和Skill路径关键链，OAuth mock定向检查；未重建核lib源一致。
- 下一步：进一步从clear晚返回/双profile、长字段及部署未知结果研究epoch与收据。

**分析版本**

- **仓库**：[AdenXie/dsh-vercel](https://github.com/AdenXie/dsh-vercel)
- **版本号**：0.4.0（[固定提交 21b3c73](https://github.com/AdenXie/dsh-vercel/tree/21b3c7372284ab53d10e61f2c717d44f752d9567)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究凭据epoch/CAS与profile分区、截断继续标识和远端写幂等回执，比较token复活/误重试。当前未验证。详见[Q06](#research-q06)。

进一步从clear晚返回/双profile、长字段及部署未知结果研究epoch与收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 163 | 22022 | — | — | 130212 |
| .js | source | 2 | 3078 | 2873 | 250 | — |
| .ts | source | 13 | 3281 | 2608 | 448 | — |
| .tsx | source | 1 | 196 | 164 | 12 | — |
| .mjs | test | 7 | 1218 | 1137 | 56 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdenXie/dsh-vercel/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AdenXie/dsh-vercel/issues?q=is%3Aissue+created%3A2026-09-22T06%3A34%3A23.654Z..2026-10-22T06%3A34%3A23.654Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdenXie/dsh-vercel/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A34%3A23.654Z..2026-10-22T06%3A34%3A23.654Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Vercel OAuth/MCP按需工具怎样维护作用域和凭据生命周期，是否适合日常项目操作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Vercel连接给谁用，核心贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有Vercel项目的DSH用户，在设置页完成OAuth后让模型查项目、部署与团队，并按需读随包Vercel指南。相较手动搭远端MCP和把全部工具schema塞上下文，它统一授权、连接生命周期、工具搜索/加载、长结果分页与Skill读取，减少重复接线。实际远端操作能力取决官方MCP目录/账号权限，插件不是自己的部署执行器，也不能保证所有指南与平台永远同步。

本地按Agent限制工具面是实质贡献，但模型加载工具不等用户授权每个部署/删除动作；实际审批仍靠宿主tools policy与Vercel服务权限。成功需要正确账户/项目、操作结果可查与错误不伪装成功，不能只看已连接或工具数。作者README验证徽章属于作者报告，本轮不转换为独立实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-35](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/README.md#L17-L35)

作者定位与验证声称。

<details>
<summary>查看原文（19行）</summary>

```text
  <a href="docs/VALIDATION-0.4.0.zh.md"><img src="https://img.shields.io/badge/status-verified-0f766e" alt="Verified in Desktop and an isolated Host profile"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@adenxie/dsh-vercel"><img src="https://img.shields.io/badge/Install_from_npm-CB3837?style=for-the-badge&amp;logo=npm" alt="Install from npm"></a>
  <a href="https://github.com/AdenXie/dsh-vercel/releases/download/v0.4.0/adenxie-dsh-vercel-0.4.0.tgz"><img src="https://img.shields.io/badge/Download_tgz-111827?style=for-the-badge&amp;logo=github" alt="Download the 0.4.0 tarball"></a>
  <a href="#install"><img src="https://img.shields.io/badge/Quick_start-111827?style=for-the-badge" alt="Quick start"></a>
  <a href="#vercel-skills"><img src="https://img.shields.io/badge/Skills-111827?style=for-the-badge" alt="Skill guide"></a>
  <a href="docs/VERCEL_PARITY_AUDIT.zh.md"><img src="https://img.shields.io/badge/Feature_comparison-111827?style=for-the-badge" alt="Feature comparison"></a>
  <a href="#development"><img src="https://img.shields.io/badge/Development-111827?style=for-the-badge" alt="Local development"></a>
</p>

<p align="center">English · <a href="README.zh.md">简体中文</a></p>

`@adenxie/dsh-vercel` connects DeepSeek Harness to Vercel's official MCP server. After you sign in to Vercel once, the model can look up your projects, deployments, and teams, and read any of the 34 bundled Vercel skill guides when it needs them. The current version is 0.4.0.

## Install

You need DeepSeek Harness `0.2.1-rc.2` through `0.2.x` and Node.js `^22.19.0 || >=24.0.0`. Desktop and Web use separate profiles, so install into the one that actually runs the plugin.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:45-48](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/index.ts#L45-L48)

按需工具与指南公告。

```text
export const VERCEL_MCP_GUIDANCE =
  'Vercel（@adenxie/dsh-vercel）：用 adenxie_vercel_mcp_search_tools 搜索、adenxie_vercel_mcp_load_tools 加载，本回合下一步即可调用 mcp__adenxie_vercel__* 工具，不要等用户或重复加载；' +
  '如果工具列表里看不到已加载的工具，改用 adenxie_vercel_mcp_call 传 name 和 arguments。已加载的工具尽量保留，卸载会使提示缓存失效。' +
  '参数标注“已折叠”时用 adenxie_vercel_mcp_describe_tool。未连接时用 adenxie_vercel_mcp_account 的 login。技能用 adenxie_vercel_skill 读取，只作指导。' +
```

**依据 3 · 源码核查**：[src/mcp.ts:243-272](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/mcp.ts#L243-L272)

Agent工具guard/mask。

<details>
<summary>查看原文（30行）</summary>

```text
  function refreshAgentRestriction(agent: Agent, access: AgentToolAccess): void {
    const deny = catalog
      .map((entry) => entry.publicName)
      .filter((name) => !access.loaded.has(name))
    // Install first, then release the old restriction. The synchronous overlap
    // keeps the transition fail-closed without accumulating intersections.
    const next = deny.length === 0 ? undefined : agent.ctx.tools.restrict({ deny })
    const previous = access.disposeRestriction
    access.disposeRestriction = next
    previous?.()
  }

  function ensureAgentAccess(agent: Agent): AgentToolAccess {
    const existing = agentAccess.get(agent)
    if (existing !== undefined) return existing
    const access: AgentToolAccess = { loaded: new Set(), disposeGuard: () => {} }
    access.disposeGuard = agent.ctx.tools.guard((exec) => {
      if (!exec.name.startsWith(PUBLIC_PREFIX)) return undefined
      if (access.loaded.has(exec.name) && catalog.some((entry) => entry.publicName === exec.name)) return undefined
      return 'This Vercel MCP tool is not loaded in this agent session.'
    })
    agentAccess.set(agent, access)
    try {
      refreshAgentRestriction(agent, access)
    } catch (error) {
      access.disposeGuard()
      agentAccess.delete(agent)
      throw error
    }
    return access
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth与本地路由如何运作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

官方MCP URL固定，SDK做discovery/动态客户端注册与PKCE；pending记录state和期限，complete必须匹配一次性pending并用codeVerifier交换。重授权阶段先隔离新注册，旧凭据继续供现有连接使用，交换成功才一起commit，失败保旧授权；resource metadata origin核对服务器origin。令牌/客户端/discovery存HOME下单一JSON，随机tmp wx mode0600后rename，公共view只返回mask和有无token。

HTTP普通路由核实际loopback peer、loopback Host、Sec-Fetch-Site及可选Origin host；callback允许跨站返回但仍核loopback与OAuth state。缺Origin允许可信本地程序，并非多用户登录认证；反代远程使用不在直接支持边界。宿主Node^22.19或>=24、DSH0.2.1rc2至0.2.x与MCP SDK/官方服务需匹配，OAuth端点/SDK真实契约仍外部依赖。0600是POSIX模式请求，不等Windows ACL加密保险库。

#### 证据与依据

**依据 1 · 源码核查**：[src/oauth.ts:327-345](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts#L327-L345)

pending一次性与abort。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Settle a pending flow (call after the callback or manual code arrives). */
  settlePending(state: string, code: string): PendingFlow | null {
    const pending = this.pendingFlow
    if (pending === null || pending.state !== state) return null
    pending.code = code
    this.pending = null
    return pending
  }

  /** Abort any pending flow (rejects a waiting begin() with an error). */
  settlePendingAbort(): void {
    const pending = this.pending
    this.pending = null
    this.codeVerifierValue = null
    this.discardClientInformationStage()
    if (pending !== null) {
      pending.rejectAuthorizeUrl(new Error('授权流程已被取消。'))
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/oauth.ts:382-418](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts#L382-L418)

新授权阶段。

<details>
<summary>查看原文（37行）</summary>

```text
  async begin(callbackUrl: string): Promise<{ authorizeUrl: string; state: string }> {
    const provider = this.getProvider(callbackUrl)

    // Allow restarting an authorization even when a prior pending flow is
    // still in the TTL window (e.g. the user closed the authorize page and
    // clicks 开始授权 again). Aborting the stale slot is a no-op once its
    // authorize URL was already captured, so the new flow always wins.
    provider.settlePendingAbort()
    provider.beginClientInformationStage()

    const state = await provider.state()
    const pending = provider.beginPending(state)

    // Phase 1 runs in the background: discovery → DCR → PKCE → capture URL.
    // Hide old tokens/client registration from this phase-one authorization
    // attempt only. The live transport keeps using the persisted credentials
    // until the user completes and the replacement is committed.
    const phaseOneProvider = new Proxy(provider, {
      get(target, property) {
        if (property === 'tokens') return async () => undefined
        if (property === 'clientInformation') return async () => undefined
        const value = Reflect.get(target, property, target) as unknown
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
    const authorize = this.hooks.authorize ?? ((value, options) => auth(value, options))
    const run = authorize(phaseOneProvider, { serverUrl: this.serverUrl, scope: VERCEL_OAUTH_SCOPE })
    run.catch((error) => {
      pending.rejectAuthorizeUrl(error)
    })

    try {
      const authorizeUrl = await provider.waitForAuthorizationUrl(AUTHORIZE_URL_TIMEOUT_MS)
      return { authorizeUrl, state }
    } catch (error) {
      provider.settlePendingAbort()
      throw error
```

</details>

**依据 3 · 源码核查**：[src/oauth.ts:427-466](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts#L427-L466)

交换和resource检查。

<details>
<summary>查看原文（40行）</summary>

```text
  async complete(code: string, state: string | null): Promise<{ ok: boolean; message: string }> {
    const provider = this.provider
    if (provider === null) {
      return { ok: false, message: '没有待完成的授权流程：请先点击「开始授权」。' }
    }
    const pending = provider.settlePending(state ?? '', code)
    if (pending === null) {
      return { ok: false, message: 'state 校验未通过（授权流程可能已过期或重复）。请重新点击「开始授权」。' }
    }
    let clientInformation: OAuthClientInformationMixed | undefined
    let discovery: OAuthDiscoveryState | undefined
    try {
      clientInformation = await provider.pendingClientInformation()
      discovery = await provider.discoveryState()
      if (clientInformation === undefined || discovery?.authorizationServerUrl === undefined) {
        provider.discardClientInformationStage()
        return { ok: false, message: '授权信息不完整；现有凭据已保留，请重新开始授权。' }
      }
      let resource: URL | undefined
      const resourceValue = discovery.resourceMetadata?.resource
      if (resourceValue !== undefined) {
        const parsed = new URL(resourceValue)
        if (parsed.origin !== new URL(this.serverUrl).origin) throw new Error('resource metadata origin mismatch')
        resource = parsed
      }
      const exchange = this.hooks.exchange ?? exchangeAuthorization
      const tokens = await exchange(discovery.authorizationServerUrl, {
        metadata: discovery.authorizationServerMetadata,
        clientInformation,
        authorizationCode: code,
        codeVerifier: await provider.codeVerifier(),
        redirectUri: provider.redirectUrl,
        resource,
      })
      await provider.commitAuthorization(tokens)
    } catch (error) {
      provider.discardClientInformationStage()
      return { ok: false, message: '令牌交换失败；现有授权凭据已保留。' }
    }
    return { ok: true, message: '授权成功：Vercel MCP 令牌已保存，MCP 工具已就绪。' }
```

</details>

**依据 4 · 源码核查**：[src/store.ts:15-31](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts#L15-L31)

全机路径与MCP URL。

<details>
<summary>查看原文（17行）</summary>

```text
/** Default machine-wide config location (mode 0600). */
export const DEFAULT_CONFIG_FILE = path.join(homedir(), '.dsh', 'adenxie-dsh-vercel.json')
/** Legacy config is copied once when the new location is absent; never modified or deleted. */
export const LEGACY_CONFIG_FILE = path.join(homedir(), '.dsh', 'dsh-vercel.json')

function isMissingFile(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}

/** Test override for the config location. */
export function configPath(): string {
  const override = process.env.DSH_VERCEL_CONFIG
  return override !== undefined && override !== '' ? override : DEFAULT_CONFIG_FILE
}

/** The Vercel MCP endpoint. */
export const MCP_URL = 'https://mcp.vercel.com'
```

</details>

**依据 5 · 源码核查**：[src/store.ts:178-203](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts#L178-L203)

随机tmp和view。

<details>
<summary>查看原文（26行）</summary>

```text
  async save(next: VercelMcpCredentials): Promise<void> {
    const target = this.filePath
    await mkdir(path.dirname(target), { recursive: true })
    const temporary = `${target}.${randomUUID()}.tmp`
    try {
      await writeFile(temporary, JSON.stringify(next, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
      await rename(temporary, target)
      this.config = next
    } finally {
      await rm(temporary, { force: true }).catch(() => {})
    }
  }

  /** Public, secret-free view. */
  async view(callbackUrl: string): Promise<VercelMcpConfigView> {
    const cfg = await this.load()
    return {
      configured: cfg.clientInformation !== null || cfg.tokens !== null,
      authorized: cfg.tokens !== null && cfg.tokens.access_token.trim() !== '',
      refreshTokenAvailable: cfg.tokens?.refresh_token !== undefined && cfg.tokens.refresh_token !== '',
      tokenUpdatedAt: cfg.tokenUpdatedAt,
      clientIdMasked: cfg.clientInformation !== null ? mask(cfg.clientInformation.client_id) : '',
      callbackUrl,
      mcpUrl: MCP_URL,
      configPath: this.filePath,
    }
```

</details>

**依据 6 · 源码核查**：[src/routes.ts:32-67](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/routes.ts#L32-L67)

真实peer与Host/Origin。

<details>
<summary>查看原文（36行）</summary>

```text
/** Strict loopback fence for the non-callback routes. */
function isLoopbackRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL(`http://${host}`)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}

/** Callback route fence: loopback client + host header, any origin (cross-site navigation from the OAuth provider is expected). */
function isLoopbackCallbackRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  try {
    const hostUrl = new URL(`http://${host}`)
    return hostUrl.hostname === '127.0.0.1' || hostUrl.hostname === 'localhost' || hostUrl.hostname === '[::1]'
  } catch {
    return false
  }
}
```

</details>

**依据 7 · 源码核查**：[package.json:47-72](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/package.json#L47-L72)

版本依赖。

<details>
<summary>查看原文（26行）</summary>

```text
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json && tsdown",
    "bundle": "tsdown",
    "watch": "tsdown --watch",
    "typecheck": "tsc --noEmit",
    "test": "node tests/smoke.mjs && node tests/store-migration.mjs && node tests/oauth-lifecycle.mjs && node tests/project-scope.mjs && node tests/result-cache.mjs && node tests/surface.mjs && node tests/mcp-bridge.mjs"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": "^0.2.1-rc.2",
    "@deepseek-ai/dsh-system-prompt": "^0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": "^0.2.1-rc.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 按需工具、scope兼容和结果分页怎样避免越权扩面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

supervisor注册远端目录并按Agent loaded集合安mask+guard，先装新限制再释放旧的避免中间放开；加载限制工具数/schema字符，子Agent须父级已加载，无法突破宿主祖先隐藏。备用call helper解析已加载名称后经ctx.tools.execute走完整宿主策略，不直接绕到网络。断连/重连generation检查避免旧client返回当前结果，保MCP isError语义。

list_projects只在明确teamId重认证错误、未给slug时试服务默认scope，必须每个返回project.accountId等请求teamId，空/混合/缺证据失败关闭，不改写写操作或slug。这是窄兼容，不是普遍团队推断。长结果按Agent对象WeakMap缓存随机ID，每Agent最多8项/100万文本字符，前12k/JSON4k预览后可分页/字段投影；缓存丢失会报继续不可用，不可把预览当完整结果。Skill read限制包内Markdown并realpath防链接外逃。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp.ts:243-281](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/mcp.ts#L243-L281)

mask/guard和释放。

<details>
<summary>查看原文（39行）</summary>

```text
  function refreshAgentRestriction(agent: Agent, access: AgentToolAccess): void {
    const deny = catalog
      .map((entry) => entry.publicName)
      .filter((name) => !access.loaded.has(name))
    // Install first, then release the old restriction. The synchronous overlap
    // keeps the transition fail-closed without accumulating intersections.
    const next = deny.length === 0 ? undefined : agent.ctx.tools.restrict({ deny })
    const previous = access.disposeRestriction
    access.disposeRestriction = next
    previous?.()
  }

  function ensureAgentAccess(agent: Agent): AgentToolAccess {
    const existing = agentAccess.get(agent)
    if (existing !== undefined) return existing
    const access: AgentToolAccess = { loaded: new Set(), disposeGuard: () => {} }
    access.disposeGuard = agent.ctx.tools.guard((exec) => {
      if (!exec.name.startsWith(PUBLIC_PREFIX)) return undefined
      if (access.loaded.has(exec.name) && catalog.some((entry) => entry.publicName === exec.name)) return undefined
      return 'This Vercel MCP tool is not loaded in this agent session.'
    })
    agentAccess.set(agent, access)
    try {
      refreshAgentRestriction(agent, access)
    } catch (error) {
      access.disposeGuard()
      agentAccess.delete(agent)
      throw error
    }
    return access
  }

  function releaseAgentAccess(agent: Agent): void {
    resultCache.clear(agent)
    const access = agentAccess.get(agent)
    if (access === undefined) return
    access.disposeRestriction?.()
    access.disposeGuard()
    agentAccess.delete(agent)
```

</details>

**依据 2 · 源码核查**：[src/mcp.ts:670-701](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/mcp.ts#L670-L701)

预算与祖先限制。

<details>
<summary>查看原文（32行）</summary>

```text
      const requested = [...new Set(names.map((name) => resolvePublicName(name, available)))]
      if (requested.length > MAX_SESSION_TOOLS) throw new Error(`At most ${MAX_SESSION_TOOLS} Vercel MCP tools may be loaded in one session.`)
      const unknown = requested.filter((name) => !available.has(name))
      if (unknown.length > 0) throw new Error(`Unknown or unavailable Vercel MCP tool: ${unknown.slice(0, MAX_SESSION_TOOLS).join(', ')}`)
      const next = replace ? new Set<string>() : new Set(access.loaded)
      for (const name of requested) next.add(name)
      if (next.size > MAX_SESSION_TOOLS) throw new Error(`At most ${MAX_SESSION_TOOLS} Vercel MCP tools may be loaded in one session.`)
      const schemaCharacters = catalog.reduce((total, entry) => total + (next.has(entry.publicName) ? modelSchemaCharacters(entry) : 0), 0)
      if (schemaCharacters > MAX_SESSION_SCHEMA_CHARS) {
        throw new Error(`Loaded Vercel MCP schemas would use ${schemaCharacters} characters; the per-session budget is ${MAX_SESSION_SCHEMA_CHARS}. Use replace or unload first.`)
      }
      for (const parent of parentAgents(agent!)) {
        const parentAccess = agentAccess.get(parent)
        const parentLoaded = parentAccess?.loaded ?? new Set<string>()
        const deniedByParent = requested.filter((name) => !parentLoaded.has(name))
        if (deniedByParent.length > 0) {
          throw new Error(`The parent Agent must load these Vercel MCP tools first: ${deniedByParent.slice(0, MAX_SESSION_TOOLS).join(', ')}`)
        }
      }
      const previous = access.loaded
      access.loaded = next
      try { refreshAgentRestriction(agent!, access) }
      catch (error) { access.loaded = previous; throw error }
      // Install the candidate mask before checking inherited restrictions. This
      // exposes at most the bounded requested set, never the full MCP catalog.
      const hiddenByAncestor = requested.filter((name) => agent!.ctx.tools.get(name, agent) === undefined)
      if (hiddenByAncestor.length > 0) {
        access.loaded = previous
        try { refreshAgentRestriction(agent!, access) }
        catch (error) { throw new Error(`Unable to restore this session's Vercel MCP restriction: ${String(error instanceof Error ? error.message : error)}`) }
        throw new Error(`Host or parent scope restrictions hide these Vercel MCP tools; this session cannot grant them: ${hiddenByAncestor.slice(0, MAX_SESSION_TOOLS).join(', ')}`)
      }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:418-434](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/index.ts#L418-L434)

备用调用经宿主pipeline。

<details>
<summary>查看原文（17行）</summary>

```text
    async execute(args: { name: string; arguments?: Record<string, unknown> }, exec: ToolRunContext): Promise<Record<string, string | boolean | Array<Record<string, string>>>> {
      let name: string | undefined
      try { name = ctx.supervisor.resolveLoadedTool(exec.agent, args.name) }
      catch (error) { return { ok: false, message: errorMessage(error) } }
      if (name === undefined) return { ok: false, message: `${args.name} 尚未在当前 Agent 加载；请先调用 adenxie_vercel_mcp_load_tools。` }
      const result = await ctx.tools.execute({
        // Same-process sub-dispatch: the id is a plain string at runtime; the brand is type-only.
        callId: `${exec.callId}:vercel` as ToolRunContext['callId'],
        rootCallId: exec.rootCallId,
        name,
        arguments: typeof args.arguments === 'object' && args.arguments !== null && !Array.isArray(args.arguments) ? args.arguments : {},
        ...(exec.agent === undefined ? {} : { agent: exec.agent }),
        parent: exec.token,
        signal: exec.signal,
      })
      const content = result.content.filter((block) => block.type === 'text').map((block) => ({ type: 'text', text: (block as { text: string }).text }))
      if (result.isError) return { ok: false, tool: name, message: result.error.message, content }
```

</details>

**依据 4 · 源码核查**：[src/scope.ts:45-82](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/scope.ts#L45-L82)

窄scope重试。

<details>
<summary>查看原文（38行）</summary>

```text
  signal?.throwIfAborted()
  // The discovered list_projects schema declares limit as a string. Native
  // model calls can nevertheless supply an integer; preserve its value while
  // preventing the server from choosing its incompatible numeric-limit path.
  const request = rawName === 'list_projects' && typeof args.limit === 'number' && Number.isSafeInteger(args.limit) && args.limit > 0
    ? { ...args, limit: String(args.limit) }
    : args
  const first = await invoke(request)
  signal?.throwIfAborted()
  if (rawName !== 'list_projects' || typeof request.teamId !== 'string' || request.teamId.trim() === '' || request.slug !== undefined || !isExplicitScopeReauthenticationError(first)) return first
  const { teamId, ...defaultArgs } = request
  let fallback: McpResult
  try { fallback = await invoke(defaultArgs) } catch (error) {
    if (signal?.aborted) throw error
    return first
  }
  signal?.throwIfAborted()
  if (fallback.isError === true) return first
  const arrays = projectArrays(fallback)
  if (arrays.length === 0 || arrays.some(projects => projects.length === 0 || projects.some(project => !record(project) || project.accountId !== teamId))) return first
  const meta = record(fallback._meta) ? fallback._meta : {}
  return {
    ...fallback,
    _meta: {
      ...meta,
      [PROJECT_SCOPE_META_KEY]: {
        operation: 'list_projects',
        requestedTeamId: teamId,
        effectiveScope: 'server-default',
        ownerVerified: true,
        originalScopeError: 'forbidden_reauthentication',
      },
    },
    content: [
      ...(Array.isArray(fallback.content) ? fallback.content : []),
      { type: 'text', text: 'Scope compatibility: the server rejected explicit teamId. This read used the server-default scope only after verifying every returned project belongs to the requested accountId.' },
    ],
  }
```

</details>

**依据 5 · 源码核查**：[src/result-cache.ts:99-126](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/result-cache.ts#L99-L126)

按Agent结果缓存。

<details>
<summary>查看原文（28行）</summary>

```text
export class AgentResultCache {
  private owners = new WeakMap<object, Map<string, CachedResult>>()

  /** Keep the complete rendered text (and parsed JSON) when it fits; evict oldest entries to retain a fixed budget. */
  put(owner: object, text: string, json?: unknown): string | undefined {
    if (text.length > MAX_CACHED_RESULT_CHARACTERS) return undefined
    const entries = this.owners.get(owner) ?? new Map<string, CachedResult>()
    this.owners.set(owner, entries)
    let total = [...entries.values()].reduce((sum, value) => sum + value.text.length, 0)
    while (entries.size >= MAX_CACHED_RESULTS || total + text.length > MAX_CACHED_RESULT_CHARACTERS) {
      const oldest = entries.keys().next().value
      if (oldest === undefined) break
      total -= entries.get(oldest)!.text.length
      entries.delete(oldest)
    }
    const id = randomUUID()
    entries.set(id, json === undefined ? { text } : { text, json })
    return id
  }

  /** Bounds are JS string characters, consistent with the schema/output budgets. */
  read(owner: object, resultId: string, offset = 0, limit = MODEL_RESULT_CHARACTERS): ResultPage | undefined {
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > MODEL_RESULT_CHARACTERS) throw new Error('Result page offset/limit is outside the supported range.')
    const text = this.owners.get(owner)?.get(resultId)?.text
    if (text === undefined) return undefined
    if (offset > text.length) throw new Error('Result page offset exceeds the stored text length.')
    const end = Math.min(text.length, offset + limit)
    return { resultId, text: text.slice(offset, end), offset, nextOffset: end < text.length ? end : null, totalCharacters: text.length }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:220-231](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/index.ts#L220-L231)

Skill真实路径。

<details>
<summary>查看原文（12行）</summary>

```text
export async function readVercelSkill(relativePath: string): Promise<string> {
  if (typeof relativePath !== 'string' || relativePath.trim() === '' || path.isAbsolute(relativePath)) {
    throw new Error('技能路径必须是包内相对路径。')
  }
  if (relativePath.split(/[\\/]/).includes('..')) throw new Error('技能路径不能包含目录回退段。')
  const root = await verifiedSkillsRoot()
  const candidate = path.resolve(root, relativePath)
  if (!isWithin(root, candidate) || candidate === root) throw new Error('拒绝访问技能目录之外的路径。')
  const actual = await realpath(candidate)
  if (!isWithin(root, actual)) throw new Error('拒绝通过符号链接访问技能目录之外的路径。')
  if (!actual.toLowerCase().endsWith('.md')) throw new Error('只允许读取 Markdown 技能和引用文件。')
  return readFile(actual, 'utf8')
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前凭据生命周期与大结果还有哪些具体缺口？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认store是HOME单文件，不按DSH profile/Agent分账号，多profile都读同一授权；save随机tmp可避免临时文件撞名，但懒加载config后整份写无跨进程锁/CAS，外部更新/同时刷新可能最后写覆盖。clearAll写空结构，OAuthFlow.abort只清pending/verifier，已进入complete并在await exchange中的请求没有取消/epoch检查；若清空后旧exchange才完成，仍可能commitAuthorization把token写回，这是可复核的异步时序风险，未执行复现，不能把清除成功当所有在途授权已撤销。

结果预算只统计text.length，不含解析JSON对象开销，也不限制所有Agent总和；JSON单项投影超过12k会切文本但按item前进，nextOffset只表示下一项，长字段完整性需回原字符分页/更细fields，不能把投影片段当完整JSON。远端工具isError保留不证明部署最终状态，写操作超时仍可能已生效，不能仅凭工具错误自动重试。授权与tool加载只控制访问面，远端数据、指南内容是未可信输入，审批语义最终依宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.ts:141-188](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts#L141-L188)

缓存与整份save。

<details>
<summary>查看原文（48行）</summary>

```text
  async load(): Promise<VercelMcpCredentials> {
    if (this.config !== null) return this.config
    try {
      // Any existing new path wins, including an empty or malformed file.
      const raw = await readFile(this.filePath, 'utf8')
      this.config = parse(JSON.parse(raw))
      return this.config
    } catch {
      try {
        await readFile(this.filePath)
        this.config = empty()
        return this.config
      } catch (error) {
        if (!isMissingFile(error) || this.legacyFilePath === null) {
          this.config = empty()
          return this.config
        }
      }
    }
    if (this.legacyFilePath !== null) {
      try {
        const legacy = parse(JSON.parse(await readFile(this.legacyFilePath, 'utf8')))
        this.config = legacy
        if (legacy.clientInformation !== null || legacy.tokens !== null || legacy.discoveryState !== null) {
          await this.save(legacy)
        }
        return this.config
      } catch {
        // Keep readable legacy credentials in memory if the safe copy fails;
        // never mutate or remove the source file.
        if (this.config !== null) return this.config
      }
    }
    this.config = empty()
    return this.config
  }

  async save(next: VercelMcpCredentials): Promise<void> {
    const target = this.filePath
    await mkdir(path.dirname(target), { recursive: true })
    const temporary = `${target}.${randomUUID()}.tmp`
    try {
      await writeFile(temporary, JSON.stringify(next, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
      await rename(temporary, target)
      this.config = next
    } finally {
      await rm(temporary, { force: true }).catch(() => {})
    }
```

</details>

**依据 2 · 源码核查**：[src/store.ts:206-220](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts#L206-L220)

清空语义。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Clear every credential (tokens, client registration, discovery state). */
  async clearAll(): Promise<void> {
    await this.save(empty())
  }

  /** Clear only tokens (keeps the client registration and discovery state). */
  async clearTokens(): Promise<void> {
    const cfg = await this.load()
    await this.save({ ...cfg, tokens: null, tokenUpdatedAt: '' })
  }

  /** Clear the client registration (forces dynamic re-registration next auth). */
  async clearClientInformation(): Promise<void> {
    const cfg = await this.load()
    await this.save({ ...cfg, clientInformation: null })
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:294-302](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/routes.ts#L294-L302)

clear时序。

```text
    {
      kind: 'exact' as const,
      path: VERCEL_MCP_API.clear,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        flow.abort()
        await supervisor.dispose()
        await store.clearAll()
        writeJson(res, 200, { ok: true, message: '已清除 Vercel MCP 的令牌与客户端注册。', view: await statusView() })
```

**依据 4 · 源码核查**：[src/oauth.ts:427-473](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts#L427-L473)

exchange后commit无generation。

<details>
<summary>查看原文（47行）</summary>

```text
  async complete(code: string, state: string | null): Promise<{ ok: boolean; message: string }> {
    const provider = this.provider
    if (provider === null) {
      return { ok: false, message: '没有待完成的授权流程：请先点击「开始授权」。' }
    }
    const pending = provider.settlePending(state ?? '', code)
    if (pending === null) {
      return { ok: false, message: 'state 校验未通过（授权流程可能已过期或重复）。请重新点击「开始授权」。' }
    }
    let clientInformation: OAuthClientInformationMixed | undefined
    let discovery: OAuthDiscoveryState | undefined
    try {
      clientInformation = await provider.pendingClientInformation()
      discovery = await provider.discoveryState()
      if (clientInformation === undefined || discovery?.authorizationServerUrl === undefined) {
        provider.discardClientInformationStage()
        return { ok: false, message: '授权信息不完整；现有凭据已保留，请重新开始授权。' }
      }
      let resource: URL | undefined
      const resourceValue = discovery.resourceMetadata?.resource
      if (resourceValue !== undefined) {
        const parsed = new URL(resourceValue)
        if (parsed.origin !== new URL(this.serverUrl).origin) throw new Error('resource metadata origin mismatch')
        resource = parsed
      }
      const exchange = this.hooks.exchange ?? exchangeAuthorization
      const tokens = await exchange(discovery.authorizationServerUrl, {
        metadata: discovery.authorizationServerMetadata,
        clientInformation,
        authorizationCode: code,
        codeVerifier: await provider.codeVerifier(),
        redirectUri: provider.redirectUrl,
        resource,
      })
      await provider.commitAuthorization(tokens)
    } catch (error) {
      provider.discardClientInformationStage()
      return { ok: false, message: '令牌交换失败；现有授权凭据已保留。' }
    }
    return { ok: true, message: '授权成功：Vercel MCP 令牌已保存，MCP 工具已就绪。' }
  }

  /** Drop any pending flow (used by clear/reset). */
  abort(): void {
    if (this.provider !== null) {
      this.provider.settlePendingAbort()
    }
```

</details>

**依据 5 · 源码核查**：[src/result-cache.ts:103-116](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/result-cache.ts#L103-L116)

仅文本预算。

<details>
<summary>查看原文（14行）</summary>

```text
  put(owner: object, text: string, json?: unknown): string | undefined {
    if (text.length > MAX_CACHED_RESULT_CHARACTERS) return undefined
    const entries = this.owners.get(owner) ?? new Map<string, CachedResult>()
    this.owners.set(owner, entries)
    let total = [...entries.values()].reduce((sum, value) => sum + value.text.length, 0)
    while (entries.size >= MAX_CACHED_RESULTS || total + text.length > MAX_CACHED_RESULT_CHARACTERS) {
      const oldest = entries.keys().next().value
      if (oldest === undefined) break
      total -= entries.get(oldest)!.text.length
      entries.delete(oldest)
    }
    const id = randomUUID()
    entries.set(id, json === undefined ? { text } : { text, json })
    return id
```

</details>

**依据 6 · 源码核查**：[src/result-cache.ts:134-159](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/result-cache.ts#L134-L159)

投影截断与item进度。

<details>
<summary>查看原文（26行）</summary>

```text
  project(owner: object, resultId: string, options: { path?: string; fields?: string[]; offset?: number; limit?: number }): ProjectedPage | undefined {
    const cached = this.owners.get(owner)?.get(resultId)
    if (cached === undefined) return undefined
    if (cached.json === undefined) throw new Error('This result is not JSON; page it by characters without path/fields.')
    const offset = options.offset ?? 0
    const limit = options.limit ?? 50
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PROJECTED_ITEMS) throw new Error(`Item offset/limit is outside the supported range (limit 1-${MAX_PROJECTED_ITEMS}).`)
    const fields = (options.fields ?? []).filter((field) => typeof field === 'string' && field.trim() !== '').slice(0, 32)
    const path = options.path ?? defaultArrayPath(cached.json) ?? ''
    const target = valueAtPath(cached.json, path)
    if (target === undefined) throw new Error(`No value at path "${path}".`)
    if (!Array.isArray(target)) {
      const text = JSON.stringify(pick(target, fields))
      return { resultId, path, text: text.slice(0, MODEL_RESULT_CHARACTERS), offset: 0, nextOffset: null, totalItems: 1 }
    }
    if (offset > target.length) throw new Error('Item offset exceeds the array length.')
    const lines: string[] = []
    let used = 0
    let index = offset
    for (; index < Math.min(target.length, offset + limit); index++) {
      const line = JSON.stringify(pick(target[index], fields))
      if (lines.length > 0 && used + line.length + 1 > MODEL_RESULT_CHARACTERS) break
      lines.push(line.slice(0, MODEL_RESULT_CHARACTERS))
      used += line.length + 1
    }
    return { resultId, path, text: lines.join('\n'), offset, nextOffset: index < target.length ? index : null, totalItems: target.length }
```

</details>

#### 缺口

- 清空/重新授权与在途token交换或刷新同时发生时的最终凭据版本
  **影响**：可能恢复本已清空的授权，影响用户对撤销状态的判断
  **进一步探讨**：受控mock让exchange延迟到clear后返回，检查旧epoch拒commit并对照多profile并发写

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程证据和分阶段成本如何判断？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

源码按store/oauth/MCP/scope/cache/schema分开，OAuth测试注入伪authorize/exchange检查旧token保留和PKCE参数，scope/cache/surface测试覆盖设计分支，适合维护宿主适配。本次只读测试片段未运行，也未把作者验证记录当当前目标效果。发布lib是构建产物，本轮主要读TypeScript关键链，未重新构建证明源/包字节一致。

首次成本为匹配版本、OAuth账户/团队核对与学习搜索-加载；持续远端MCP调用/模型上下文和Vercel资源费用依真实动作，插件没有统一计价。按需schema和结果分页可能减少上下文，但没有同任务token/时延对照。持久token需备份和撤销策略、多个profile共享文件需人工协调；失败恢复包括state过期、刷新invalid_grant、generation断线、结果缓存被驱逐与未知写结果，先查官方项目/部署状态再重试。

#### 证据与依据

**依据 1 · 源码核查**：[tests/oauth-lifecycle.mjs:19-45](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/tests/oauth-lifecycle.mjs#L19-L45)

mock OAuth链。

<details>
<summary>查看原文（27行）</summary>

```text
  const flow = new OAuthFlow(store, {
    serverUrl: 'https://mcp.example.test',
    authorize: async (provider, options) => {
      assert.equal(options.scope, 'openid offline_access')
      assert.equal(provider.clientMetadata.scope, 'openid offline_access')
      assert.equal(await provider.tokens(), undefined, 'phase one must leave old tokens available only to the live transport')
      await provider.saveDiscoveryState({
        authorizationServerUrl: 'https://auth.example.test',
        authorizationServerMetadata: { token_endpoint: 'https://auth.example.test/token', token_endpoint_auth_methods_supported: ['none'] },
        resourceMetadata: { resource: 'https://mcp.example.test' },
      })
      await provider.saveClientInformation({ client_id: 'new-client', redirect_uris: ['http://127.0.0.1:2/callback'] })
      await provider.saveCodeVerifier('test-verifier')
      await provider.redirectToAuthorization(new URL('https://auth.example.test/authorize'))
      return 'REDIRECT'
    },
    exchange: async (_server, options) => {
      assert.equal(options.authorizationCode, 'test-code')
      assert.equal(options.codeVerifier, 'test-verifier')
      assert.equal(options.redirectUri, 'http://127.0.0.1:2/callback')
      return { access_token: 'new-access', refresh_token: 'new-refresh', scope: VERCEL_OAUTH_SCOPE, token_type: 'Bearer' }
    },
  })
  const pending = await flow.begin('http://127.0.0.1:2/callback')
  assert.match(pending.authorizeUrl, /authorize/)
  let credentials = await store.load()
  assert.equal(credentials.tokens.access_token, 'old-access')
```

</details>

**依据 2 · 源码核查**：[src/mcp.ts:394-426](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/mcp.ts#L394-L426)

调用与大结果页。

<details>
<summary>查看原文（33行）</summary>

```text
            timeoutMs: TOOL_CALL_TIMEOUT_MS,
            execute: async (args: unknown, exec: { signal: AbortSignal; agent?: Agent }): Promise<unknown> => {
              if (!isCurrent(generation)) throw new Error('Vercel MCP tool is no longer connected')
              const cleanArgs = isRecord(args) ? jsonCopy(args) : {}
              const result = jsonCopy(await withVerifiedProjectScope(
                tool.name,
                cleanArgs,
                (scopedArgs) => callTool(generation, tool.name, scopedArgs, exec.signal),
                exec.signal,
              ))
              exec.signal.throwIfAborted()
              if (!isCurrent(generation)) throw new Error('Vercel MCP tool is no longer connected')
              if (!isRecord(result)) return result
              const rendered = renderedMcpText(result.content, result.structuredContent)
              if (rendered.length <= MODEL_RESULT_CHARACTERS) return result
              // JSON results get a short preview plus an outline, so the model can project fields instead of paging raw text.
              const json = isRecord(result.structuredContent) ? result.structuredContent : parseJsonText(rendered)
              const resultId = exec.agent === undefined || !agentAccess.has(exec.agent)
                ? undefined
                : resultCache.put(exec.agent, rendered, json)
              const existingMeta = isRecord(result._meta) ? result._meta : {}
              result._meta = {
                ...existingMeta,
                [RESULT_PAGE_META_KEY]: {
                  totalCharacters: rendered.length,
                  nextOffset: json === undefined ? MODEL_RESULT_CHARACTERS : JSON_PREVIEW_CHARACTERS,
                  ...(json === undefined ? {} : { outline: outlineJson(json) }),
                  ...(resultId === undefined
                    ? { continuationUnavailable: true }
                    : { resultId }),
                },
              }
              return result
```

</details>

**依据 3 · 源码核查**：[src/result-cache.ts:103-126](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/result-cache.ts#L103-L126)

缓存驱逐。

<details>
<summary>查看原文（24行）</summary>

```text
  put(owner: object, text: string, json?: unknown): string | undefined {
    if (text.length > MAX_CACHED_RESULT_CHARACTERS) return undefined
    const entries = this.owners.get(owner) ?? new Map<string, CachedResult>()
    this.owners.set(owner, entries)
    let total = [...entries.values()].reduce((sum, value) => sum + value.text.length, 0)
    while (entries.size >= MAX_CACHED_RESULTS || total + text.length > MAX_CACHED_RESULT_CHARACTERS) {
      const oldest = entries.keys().next().value
      if (oldest === undefined) break
      total -= entries.get(oldest)!.text.length
      entries.delete(oldest)
    }
    const id = randomUUID()
    entries.set(id, json === undefined ? { text } : { text, json })
    return id
  }

  /** Bounds are JS string characters, consistent with the schema/output budgets. */
  read(owner: object, resultId: string, offset = 0, limit = MODEL_RESULT_CHARACTERS): ResultPage | undefined {
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > MODEL_RESULT_CHARACTERS) throw new Error('Result page offset/limit is outside the supported range.')
    const text = this.owners.get(owner)?.get(resultId)?.text
    if (text === undefined) return undefined
    if (offset > text.length) throw new Error('Result page offset exceeds the stored text length.')
    const end = Math.min(text.length, offset + limit)
    return { resultId, text: text.slice(offset, end), offset, nextOffset: end < text.length ? end : null, totalCharacters: text.length }
```

</details>

**依据 4 · 作者声明**：[README.md:31-35](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/README.md#L31-L35)

安装profile/版本。

```text
`@adenxie/dsh-vercel` connects DeepSeek Harness to Vercel's official MCP server. After you sign in to Vercel once, the model can look up your projects, deployments, and teams, and read any of the 34 bundled Vercel skill guides when it needs them. The current version is 0.4.0.

## Install

You need DeepSeek Harness `0.2.1-rc.2` through `0.2.x` and Node.js `^22.19.0 || >=24.0.0`. Desktop and Web use separate profiles, so install into the one that actually runs the plugin.
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样采用，进一步探讨哪里？

**研究主题**：新假设与验证、采用判断

#### 完整回答

有Vercel账户且宿主匹配者可试用，先可信本地单profile授权、加载只读项目工具并核team/accountId，再逐步使用写操作；读写审批沿宿主策略，重要部署最终回官方控制台核对。多账号隔离、跨profile并发、强撤销语义或未知写结果自动重试的需求需先补契约。清空凭据后确认没有进行中的交换/刷新及实际服务端授权，不把mask状态当彻底撤销。

继续可研究凭据epoch+CAS、clear取消在途授权且旧epoch不commit、profile/账户分区与加密凭据服务；结果分页标注每项截断并提供稳定字段继续标识，远端写动作带幂等键/结果查证。基线为当前单文件/异步commit与按item截文本，反例是clear后旧exchange返回、双profile刷新、换账户缓存、超长单JSON字段与部署响应丢失。比较token复活、错账户、误重试、上下文token和恢复工时，当前未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/oauth.ts:427-473](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts#L427-L473)

授权commit基线。

<details>
<summary>查看原文（47行）</summary>

```text
  async complete(code: string, state: string | null): Promise<{ ok: boolean; message: string }> {
    const provider = this.provider
    if (provider === null) {
      return { ok: false, message: '没有待完成的授权流程：请先点击「开始授权」。' }
    }
    const pending = provider.settlePending(state ?? '', code)
    if (pending === null) {
      return { ok: false, message: 'state 校验未通过（授权流程可能已过期或重复）。请重新点击「开始授权」。' }
    }
    let clientInformation: OAuthClientInformationMixed | undefined
    let discovery: OAuthDiscoveryState | undefined
    try {
      clientInformation = await provider.pendingClientInformation()
      discovery = await provider.discoveryState()
      if (clientInformation === undefined || discovery?.authorizationServerUrl === undefined) {
        provider.discardClientInformationStage()
        return { ok: false, message: '授权信息不完整；现有凭据已保留，请重新开始授权。' }
      }
      let resource: URL | undefined
      const resourceValue = discovery.resourceMetadata?.resource
      if (resourceValue !== undefined) {
        const parsed = new URL(resourceValue)
        if (parsed.origin !== new URL(this.serverUrl).origin) throw new Error('resource metadata origin mismatch')
        resource = parsed
      }
      const exchange = this.hooks.exchange ?? exchangeAuthorization
      const tokens = await exchange(discovery.authorizationServerUrl, {
        metadata: discovery.authorizationServerMetadata,
        clientInformation,
        authorizationCode: code,
        codeVerifier: await provider.codeVerifier(),
        redirectUri: provider.redirectUrl,
        resource,
      })
      await provider.commitAuthorization(tokens)
    } catch (error) {
      provider.discardClientInformationStage()
      return { ok: false, message: '令牌交换失败；现有授权凭据已保留。' }
    }
    return { ok: true, message: '授权成功：Vercel MCP 令牌已保存，MCP 工具已就绪。' }
  }

  /** Drop any pending flow (used by clear/reset). */
  abort(): void {
    if (this.provider !== null) {
      this.provider.settlePendingAbort()
    }
```

</details>

**依据 2 · 源码核查**：[src/store.ts:141-188](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts#L141-L188)

单文件保存基线。

<details>
<summary>查看原文（48行）</summary>

```text
  async load(): Promise<VercelMcpCredentials> {
    if (this.config !== null) return this.config
    try {
      // Any existing new path wins, including an empty or malformed file.
      const raw = await readFile(this.filePath, 'utf8')
      this.config = parse(JSON.parse(raw))
      return this.config
    } catch {
      try {
        await readFile(this.filePath)
        this.config = empty()
        return this.config
      } catch (error) {
        if (!isMissingFile(error) || this.legacyFilePath === null) {
          this.config = empty()
          return this.config
        }
      }
    }
    if (this.legacyFilePath !== null) {
      try {
        const legacy = parse(JSON.parse(await readFile(this.legacyFilePath, 'utf8')))
        this.config = legacy
        if (legacy.clientInformation !== null || legacy.tokens !== null || legacy.discoveryState !== null) {
          await this.save(legacy)
        }
        return this.config
      } catch {
        // Keep readable legacy credentials in memory if the safe copy fails;
        // never mutate or remove the source file.
        if (this.config !== null) return this.config
      }
    }
    this.config = empty()
    return this.config
  }

  async save(next: VercelMcpCredentials): Promise<void> {
    const target = this.filePath
    await mkdir(path.dirname(target), { recursive: true })
    const temporary = `${target}.${randomUUID()}.tmp`
    try {
      await writeFile(temporary, JSON.stringify(next, null, 2), { encoding: 'utf8', flag: 'wx', mode: 0o600 })
      await rename(temporary, target)
      this.config = next
    } finally {
      await rm(temporary, { force: true }).catch(() => {})
    }
```

</details>

**依据 3 · 源码核查**：[src/result-cache.ts:134-159](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/result-cache.ts#L134-L159)

大项投影基线。

<details>
<summary>查看原文（26行）</summary>

```text
  project(owner: object, resultId: string, options: { path?: string; fields?: string[]; offset?: number; limit?: number }): ProjectedPage | undefined {
    const cached = this.owners.get(owner)?.get(resultId)
    if (cached === undefined) return undefined
    if (cached.json === undefined) throw new Error('This result is not JSON; page it by characters without path/fields.')
    const offset = options.offset ?? 0
    const limit = options.limit ?? 50
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PROJECTED_ITEMS) throw new Error(`Item offset/limit is outside the supported range (limit 1-${MAX_PROJECTED_ITEMS}).`)
    const fields = (options.fields ?? []).filter((field) => typeof field === 'string' && field.trim() !== '').slice(0, 32)
    const path = options.path ?? defaultArrayPath(cached.json) ?? ''
    const target = valueAtPath(cached.json, path)
    if (target === undefined) throw new Error(`No value at path "${path}".`)
    if (!Array.isArray(target)) {
      const text = JSON.stringify(pick(target, fields))
      return { resultId, path, text: text.slice(0, MODEL_RESULT_CHARACTERS), offset: 0, nextOffset: null, totalItems: 1 }
    }
    if (offset > target.length) throw new Error('Item offset exceeds the array length.')
    const lines: string[] = []
    let used = 0
    let index = offset
    for (; index < Math.min(target.length, offset + limit); index++) {
      const line = JSON.stringify(pick(target[index], fields))
      if (lines.length > 0 && used + line.length + 1 > MODEL_RESULT_CHARACTERS) break
      lines.push(line.slice(0, MODEL_RESULT_CHARACTERS))
      used += line.length + 1
    }
    return { resultId, path, text: lines.join('\n'), offset, nextOffset: index < target.length ? index : null, totalItems: target.length }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
