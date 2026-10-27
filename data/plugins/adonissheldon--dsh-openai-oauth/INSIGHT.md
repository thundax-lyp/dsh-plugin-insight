# dsh-openai-oauth

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ba29660](https://github.com/AdonisSheldon/dsh-openai-oauth/tree/ba29660530fe05779b06f129a0c0ed5c2237b73f)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth)
<!-- END META -->

> **功能**：为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

> **亮点**：在DSH原生LLM路由内整合双方式OAuth、本机凭据与流/replay适配，不启动外部Agent；派生Harness转换归属上游，不是新OAuth协议。详见[Q01](#research-q01)。

> **主要限制**：静态模型表/零cost不证明资格或免费；明文凭据与本机账户信任、退出/持久化交错、无总deadline和非法参数退{}限制无损/可靠性主张。详见[Q03](#research-q03)。

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
  - [Q01 · 适合谁，和CLI/API Key方案相比交付什么？](#detail-section-11)
  - [Q02 · 登录与本机控制面有哪些真正防护和限制？](#detail-section-12)
  - [Q03 · 凭据落盘、刷新、退出和消息转换的边界是什么？](#detail-section-13)
  - [Q04 · 接入、持续使用和失败恢复成本怎样算？](#detail-section-14)
  - [Q05 · 是否推荐，继续探讨哪里最有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望继续使用DSH会话、工具及审批而把模型路由接到ChatGPT OAuth的本机用户。原有办法是单独Codex CLI/外部Agent或常规API Key适配；当前在DSH LLM注册openai-codex adapter，提供浏览器PKCE和设备代码两种显式登录、设置页与headless命令，不启动Codex App Server或外部Agent进程。交付是同DSH模型消息/工具调用及可恢复历史，不是获得额外账号权益或绕过额度。

贡献主要是自持OAuth/凭据生命周期与Host消息/流/replay适配。第三方声明说明部分转换与回调/标识源于MIT DeepSeek Harness，应归属上游，不叫全新OAuth协议。工具执行/权限仍由Host承担，adapter只返回调用块，不由插件重新实现DSH权限引擎。固定版本有七项静态模型目录，listModels未探账号实时资格，不能说登录即全部可用。

常规API Key适配或独立CLI/外部Agent；当前交付仍DSH消息/工具结果，新增登录及模型路由接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| PKCE/设备码 | 账号登录 | 人亲自授权，资格另核 |
| 原生LLM adapter | 模型/工具流与replay | 静态七项目录非实时发现 |
| 本机凭据 | 锁内刷新/原子替换 | 未加密owner-only文件 |
| Web设置/CLI | 双端控制登录 | Web仅127.0.0.1支持 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node ^22.19或>=24、DSH rc.8相关服务 | LLM/CLI/Web适配 | peer标optional不等无服务也有功能 |
| 合资格ChatGPT账号/可信OpenAI登录页面 | OAuth和模型请求 | 非官方社区适配，资格/协议独立变化 |
| 本机127.0.0.1 Host或本机CLI | Web设置或headless登录 | 远程/反代/Windows不在作者0.1支持范围 |
| 可写owner-only DSH_HOME与proper-lockfile | 凭据/刷新 | 明文存储需保护/备份策略 |
| 可选attachments | 图片输入 | 图片会发模型服务 |



#### 使用流程

| 步骤 | 行为 | 判据 |
| --- | --- | --- |
| 固定部署 | 审版本/peer/包来源，保留原provider | 不执行远端main安装指引作固定版本事实 |
| 登录 | 人亲自选PKCE或设备码 | 只在可信页面授权，controller connected后才用 |
| 使用 | 选静态目录候选并核账号实际响应 | 模型可列出不等有资格 |
| 恢复/退出 | 取消明确attempt，核旧连接/在途请求，再删本地凭据 | 不盲重发部分工具任务，不把删除当撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号权益、Node/DSH/依赖与凭据存储 | 核平台/peer、亲自登录与本机权限 | 账号资格/价格/配置工时未知 |
| 持续使用 | 上下文/图片传输、流输出与账号额度 | 核模型支持与任务/工具效果 | 源码cost=0是占位，非免费；延时/额度未知 |
| 失败恢复 | 重新授权/传输/重复上下文、可能旧在途请求 | 核是否已执行工具及凭据状态，恢复provider | 无总deadline/退出全取消，恢复时间未知 |



#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 统一工作区 | DSH直接provider路由 | 不增加账号权益 |
| 凭据管理 | 双方式、锁内刷新/原子落盘 | 明文/本机账户信任 |
| 历史延续 | 签名/replay与工具流转换 | 有参数/角色转换限制 |

源码自带check为typecheck/build，没有把真实账号/业务验收列为已完成证据；也不能用构建通过推出协议持续可用。

> **思考**：静态模型表/零cost不证明资格或免费；明文凭据与本机账户信任、退出/持久化交错、无总deadline和非法参数退{}限制无损/可靠性主张。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在DSH原生LLM路由内整合双方式OAuth、本机凭据与流/replay适配，不启动外部Agent；派生Harness转换归属上游，不是新OAuth协议。详见[Q01](#research-q01)。

凭据以未加密JSON保存于DSH_HOME/plugins/dsh-openai-oauth，文件0600/目录0700、lstat拒绝最终目录/文件符号链接，严格envelope/字段，proper-lockfile串行写删；临时wx文件、fsync、rename再目录sync降低半写风险。刷新先读快路径，临近60秒过期在锁内重读，避免两个刷新直接争同一旧token。并非密钥库加密，DSH_HOME上级/同账户竞态或恶意进程不被这些操作完全隔离。read不取锁但rename保证通常读旧或新完整文件，不声称所有路径TOCTOU已解决。

run把winner设complete后才await modify；logout不走exclusive，winner已complete则不等done，直接delete。若持久化与delete获取锁顺序反转，有迟到保存可能；现源码缺logout epoch/完成栅栏，本轮未执行该交错，不宣称稳定复现/远程攻击。退出删除本地凭据，不调用远端token撤销；已取得credential的在途模型请求不会由logout自动取消。

上下文兼容并非完全无损。options.system进instructions，但messages里的system转user；原顺序把一个用户消息普通内容放前、tool-result放后。未知内容明确报错，图片依赖attachments读后Base64发服务方。replay会核provider/model/block类型数量并保存reasoning/text签名，这是积极边界；可是当前/历史工具参数JSON无效或非对象都退{}，不是协议拒绝，若Host工具允许空对象默认行为可与模型原意不同，执行危险取决Host参数/审批，不能直接认定任意工具越权。

静态模型/思考映射可随上游失效，stop/maxTokens明确不支持。SSE有16Mi字符未分帧buffer上限和读cancel，非整次内容总量上限，output累积仍可增长；无终结事件会报STREAM_CLOSED而非假成功，maxRetries=0不自动重放，部分delta已交Host的恢复仍需调用方处置。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态模型表/零cost不证明资格或免费；明文凭据与本机账户信任、退出/持久化交错、无总deadline和非法参数退{}限制无损/可靠性主张。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见[Q05](#research-q05)。

贡献主要是自持OAuth/凭据生命周期与Host消息/流/replay适配。第三方声明说明部分转换与回调/标识源于MIT DeepSeek Harness，应归属上游，不叫全新OAuth协议。工具执行/权限仍由Host承担，adapter只返回调用块，不由插件重新实现DSH权限引擎。固定版本有七项静态模型目录，listModels未探账号实时资格，不能说登录即全部可用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。本机OAuth/provider适配贡献明确，账号实时能力、退出全取消与消息无损不由当前源码完全保证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、SECURITY.md、THIRD_PARTY_NOTICES.md、package.json、src/index.ts、src/models.ts、src/adapter.ts、src/openai-oauth.ts、src/auth-controller.ts、src/credential-store.ts、src/oauth-http.ts、src/context.ts、src/replay.ts、src/stream.ts、src/codex-models.ts、src/login.ts、src/client/index.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取认证/store/OAuth/http/adapter/codex-models/context/replay/stream/index/login主链，模型静态目录、UI请求/轮询及README/安全/第三方声明；不全审UI样式/构建产物与外部Host/服务，不登录/执行网络协议或读真实凭据。
- 下一步：可继续假依赖验证generation/退出/刷新/断流与非法参数矩阵，原型未实现。

**分析版本**

- **仓库**：[AdonisSheldon/dsh-openai-oauth](https://github.com/AdonisSheldon/dsh-openai-oauth)
- **版本号**：0.1.0（[固定提交 ba29660](https://github.com/AdonisSheldon/dsh-openai-oauth/tree/ba29660530fe05779b06f129a0c0ed5c2237b73f)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索认证世代与持久化退出栅栏、合并signal总预算和严格工具JSON，按假依赖交错矩阵证伪；未实现。详见[Q05](#research-q05)。

可继续假依赖验证generation/退出/刷新/断流与非法参数矩阵，原型未实现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 309 | — | — | 2366 |
| .js | source | 4 | 3022 | 2907 | 171 | — |
| .ts | source | 18 | 2937 | 2635 | 104 | — |
| .tsx | source | 1 | 297 | 274 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AdonisSheldon/dsh-openai-oauth/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AdonisSheldon/dsh-openai-oauth/issues?q=is%3Aissue+created%3A2026-09-22T10%3A42%3A48.046Z..2026-10-22T10%3A42%3A48.046Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AdonisSheldon/dsh-openai-oauth/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A42%3A48.046Z..2026-10-22T10%3A42%3A48.046Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核OAuth/本机控制面、凭据刷新退出、消息流/replay兼容、真实成本及世代栅栏假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，和CLI/API Key方案相比交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合希望继续使用DSH会话、工具及审批而把模型路由接到ChatGPT OAuth的本机用户。原有办法是单独Codex CLI/外部Agent或常规API Key适配；当前在DSH LLM注册openai-codex adapter，提供浏览器PKCE和设备代码两种显式登录、设置页与headless命令，不启动Codex App Server或外部Agent进程。交付是同DSH模型消息/工具调用及可恢复历史，不是获得额外账号权益或绕过额度。

贡献主要是自持OAuth/凭据生命周期与Host消息/流/replay适配。第三方声明说明部分转换与回调/标识源于MIT DeepSeek Harness，应归属上游，不叫全新OAuth协议。工具执行/权限仍由Host承担，adapter只返回调用块，不由插件重新实现DSH权限引擎。固定版本有七项静态模型目录，listModels未探账号实时资格，不能说登录即全部可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:25-76](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/index.ts#L25-L76)

注册/构造/可选Host。

<details>
<summary>查看原文（52行）</summary>

```text
/** The LLM registry is required; Web and attachments are optional profile capabilities. */
export const inject = ['llm']

export interface PluginRuntime {
  credentials: SecureCredentialStore
  models: CodexModels
  controller: AuthController
  adapter: OpenAiCodexAdapter
}

export interface CreatePluginRuntimeOptions {
  dshHome?: string
  /** Test or embedding override for the plugin-owned OAuth operation. */
  login?: (interaction: AuthInteraction) => Promise<OAuthCredential>
  attachments?: () => import('@deepseek-ai/dsh-attachment').AttachmentStore | undefined
}

/** Construct the shared credential, OAuth, model, and adapter runtime. */
export function createPluginRuntime(options: CreatePluginRuntimeOptions = {}): PluginRuntime {
  const credentials = new SecureCredentialStore(resolveDshHome(options.dshHome))
  const oauth = createOpenAiOAuth()
  const models = new CodexModels(credentials, { refresh: (credential, signal) => oauth.refresh(credential, signal) })
  const login = options.login ?? (interaction => oauth.login(interaction))
  const controller = new AuthController(credentials, { login })
  const adapter = new OpenAiCodexAdapter(models, {
    ...options.attachments === undefined ? {} : { attachments: options.attachments },
  })
  return { credentials, models, controller, adapter }
}

/** Refuse the unsupported remotely reachable Web posture at plugin load. */
export function assertLocalWebHost(host: WebServer['host']): void {
  if (host !== '127.0.0.1') {
    throw new Error('dsh-openai-oauth: Web OAuth supports only a loopback Host bound to 127.0.0.1')
  }
}

/** Register the direct adapter and activate the local route whenever a Web Host is present. */
export function apply(ctx: Context): void {
  const runtime = createPluginRuntime({ attachments: () => ctx.get('attachments') })
  ctx.effect(() => {
    const disposeAdapter = ctx.llm.registerAdapter([OPENAI_CODEX_PROVIDER], runtime.adapter)
    return async () => {
      disposeAdapter()
      await runtime.controller.dispose()
    }
  }, 'dsh-openai-oauth: adapter and controller')
  ctx.inject(['webServer'], (routeCtx) => {
    assertLocalWebHost(routeCtx.webServer.host)
    return routeCtx.webServer.register(oauthRoute(runtime.controller))
  })
}
```

</details>

**依据 2 · 源码核查**：[src/models.ts:132-172](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/models.ts#L132-L172)

版本目录。

<details>
<summary>查看原文（41行）</summary>

```text
const BASE_MODEL = {
  api: 'openai-codex-responses' as const,
  provider: 'openai-codex',
  baseUrl: 'https://chatgpt.com/backend-api',
  reasoning: true,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  maxTokens: 128_000,
}

/** Versioned model catalog shipped with this plugin release. */
export const OPENAI_CODEX_MODELS: readonly Model<'openai-codex-responses'>[] = [
  {
    ...BASE_MODEL, id: 'gpt-5.3-codex-spark', name: 'GPT-5.3 Codex Spark',
    input: ['text'], contextWindow: 128_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.4', name: 'GPT-5.4', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.4-mini', name: 'GPT-5.4 mini', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.5', name: 'GPT-5.5', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: 'max' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: 'max' },
  },
  {
    ...BASE_MODEL, id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra', input: ['text', 'image'], contextWindow: 272_000,
    thinkingLevelMap: { minimal: 'low', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: 'max' },
  },
]
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:103-135](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/adapter.ts#L103-L135)

模型与选项。

<details>
<summary>查看原文（33行）</summary>

```text
    assertProvider(provider)
    return { id: provider, name: 'OpenAI Codex (ChatGPT OAuth)' }
  }

  override listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return Promise.resolve().then(() => {
      assertProvider(provider)
      return this.models.getModels(provider).map(modelInfo)
    })
  }

  override resolveModel(provider: string, id: string): Promise<LlmResolvedModelInfo> {
    return Promise.resolve().then(() => {
      assertProvider(provider)
      const model = this.models.getModel(provider, id)
      if (model === undefined) throw new LlmError(`OpenAI Codex has no model "${id}"`, 'UNKNOWN_MODEL')
      const levels = reasoningLevels(model)
      return {
        ...modelInfo(model),
        context: { contextWindow: model.contextWindow },
        ...levels.length === 0 ? {} : {
          reasoning: {
            efforts: levels.map(level => ({ id: ReasoningEffortId(level), name: reasoningName(level) })),
          },
        },
      }
    })
  }

  async * stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    assertProvider(options.provider)
    if (options.stop !== undefined) {
      throw new LlmError('OpenAI Codex does not support Harness stop sequences.', 'UNSUPPORTED_OPTION')
```

</details>

**依据 4 · 源码核查**：[THIRD_PARTY_NOTICES.md:1-5](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/THIRD_PARTY_NOTICES.md#L1-L5)

派生归属。

```text
# Third-party notices

This project uses `proper-lockfile`, licensed under the MIT License.

The Harness message and stream conversion and the OAuth callback and README wordmarks include portions derived from MIT-licensed DeepSeek Harness source code, copyright (c) 2026 DeepSeek. See <https://github.com/deepseek-ai/deepseek-harness>. The MIT terms are reproduced in this package's `LICENSE`.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 登录与本机控制面有哪些真正防护和限制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器流程生成32字节verifier及S256 challenge、16字节state，在127.0.0.1:1455等匹配state的/auth/callback；错误state/空code不完成尝试。成功回调页先展示，随后才token exchange及存储，所以页面“complete”不等凭据已持久化，最终应看controller connected。设备码显式选取，不默默回退，最多按15分钟循环/slow_down退让；但循环deadline不截断挂起fetch/sleep，浏览器回调也无自身总超时，只有外部abort能结束相关等待。

AuthController按attemptId区分旧取消，start/cancel串行，取消winner先置且abort，迟到login返回不落盘；public status只投影链接/用户码/状态，不返access/refresh。URL限定https auth.openai.com且无userinfo，错误大多固定脱敏，优于透传原始凭据/上游响应。

Web启动必须Host.host严格127.0.0.1，route又核socket真实loopback及本机Host。POST要sec-fetch-site same-origin与精确Origin，JSON/精确字段/4KiB限制，无任意跨站代登录控制。它不防同OS账户恶意进程，反代/远程/容器转发在作者支持范围之外；不能扩大为多用户认证隔离。设置页只pending时轮询，预开空白窗口脱opener并二次核授权URL，headless非TTY需明确方式，均值得借鉴。

#### 证据与依据

**依据 1 · 源码核查**：[src/openai-oauth.ts:167-212](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/openai-oauth.ts#L167-L212)

state回调/页面顺序。

<details>
<summary>查看原文（46行）</summary>

```text
  return new Promise((resolve, reject) => {
    let settled = false
    const settle = (operation: () => void): void => {
      if (settled) return
      settled = true
      signal?.removeEventListener('abort', abort)
      server.close()
      operation()
    }
    const abort = (): void => { settle(() => { reject(new Error('Login cancelled')) }) }
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost')
      response.setHeader('content-type', 'text/html; charset=utf-8')
      response.setHeader('cache-control', 'no-store')
      if (url.pathname !== '/auth/callback') {
        response.statusCode = 404
        response.end(errorPage('Callback route not found.'))
        return
      }
      if (url.searchParams.get('state') !== state) {
        response.statusCode = 400
        response.end(errorPage('State mismatch.'))
        return
      }
      const code = url.searchParams.get('code')
      if (code === null || code.length === 0) {
        response.statusCode = 400
        response.end(errorPage('Missing authorization code.'))
        return
      }
      response.statusCode = 200
      response.end(successPage())
      settle(() => { resolve(code) })
    })
    server.once('error', error => { settle(() => { reject(error) }) })
    server.listen(CALLBACK_PORT, CALLBACK_HOST)
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
  })
}

async function exchange(
  fetch: OAuthFetch,
  code: string,
  verifier: string,
  redirectUri: string,
```

</details>

**依据 2 · 源码核查**：[src/openai-oauth.ts:237-319](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/openai-oauth.ts#L237-L319)

PKCE与设备循环。

<details>
<summary>查看原文（83行）</summary>

```text
  const browser = async (interaction: AuthInteraction): Promise<OAuthCredential> => {
    const verifier = Buffer.from(randomBytes(32)).toString('base64url')
    const challenge = createHash('sha256').update(verifier).digest('base64url')
    const state = Buffer.from(randomBytes(16)).toString('hex')
    const authorization = new URL(AUTHORIZE_URL)
    authorization.search = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: BROWSER_REDIRECT_URI,
      scope: SCOPE,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
      id_token_add_organizations: 'true',
      codex_cli_simplified_flow: 'true',
      originator: 'deepseek-harness',
    }).toString()
    const callback = waitForCallback(state, interaction.signal)
    interaction.notify({
      type: 'auth_url',
      url: authorization.toString(),
      instructions: 'Complete OpenAI sign-in in the browser.',
    })
    return exchange(fetch, await callback, verifier, BROWSER_REDIRECT_URI, now, interaction.signal)
  }

  const device = async (interaction: AuthInteraction): Promise<OAuthCredential> => {
    cancelled(interaction.signal)
    const start = await fetch(DEVICE_USER_CODE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID }),
      ...interaction.signal === undefined ? {} : { signal: interaction.signal },
    })
    const value = await readJson(start, 'device-code request')
    const deviceAuthId = value['device_auth_id']
    const userCode = value['user_code']
    const rawInterval = value['interval']
    const intervalSeconds = typeof rawInterval === 'string' ? Number(rawInterval) : rawInterval
    if (typeof deviceAuthId !== 'string' || deviceAuthId.length === 0
      || typeof userCode !== 'string' || userCode.length === 0
      || typeof intervalSeconds !== 'number' || !Number.isFinite(intervalSeconds) || intervalSeconds < 0) {
      throw new Error('OpenAI OAuth device-code response is invalid.')
    }
    interaction.notify({
      type: 'device_code', userCode, verificationUri: DEVICE_VERIFICATION_URI,
      intervalSeconds, expiresInSeconds: DEVICE_TIMEOUT_SECONDS,
    })

    const deadline = now() + DEVICE_TIMEOUT_SECONDS * 1000
    let pollDelay = Math.max(1_000, intervalSeconds * 1000)
    while (now() <= deadline) {
      await sleep(pollDelay, interaction.signal)
      cancelled(interaction.signal)
      const response = await fetch(DEVICE_TOKEN_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ device_auth_id: deviceAuthId, user_code: userCode }),
        ...interaction.signal === undefined ? {} : { signal: interaction.signal },
      })
      if (response.ok) {
        const token = await readJson(response, 'device authorization')
        const code = token['authorization_code']
        const verifier = token['code_verifier']
        if (typeof code !== 'string' || code.length === 0
          || typeof verifier !== 'string' || verifier.length === 0) {
          throw new Error('OpenAI OAuth device authorization response is invalid.')
        }
        return exchange(fetch, code, verifier, DEVICE_REDIRECT_URI, now, interaction.signal)
      }
      if (response.status === 403 || response.status === 404) continue
      const pending: unknown = await response.json().catch(() => undefined)
      const error = isRecord(pending) ? pending['error'] : undefined
      const code = typeof error === 'string' ? error : isRecord(error) ? error['code'] : undefined
      if (code === 'deviceauth_authorization_pending') continue
      if (code === 'slow_down') {
        pollDelay += 5_000
        continue
      }
      throw new Error(`OpenAI OAuth device authorization failed with status ${response.status}.`)
    }
    throw new Error('OpenAI OAuth device code expired.')
  }
```

</details>

**依据 3 · 源码核查**：[src/auth-controller.ts:248-274](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L248-L274)

取消winner/落盘。

<details>
<summary>查看原文（27行）</summary>

```text
          const signal = prompt.signal === undefined
            ? attempt.abort.signal
            : AbortSignal.any([attempt.abort.signal, prompt.signal])
          return waitForAbort(signal)
        }
        throw new AuthControllerError('OAUTH_PROTOCOL_ERROR', 'OpenAI sign-in requested an unsupported prompt.')
      },
      notify: (event) => {
        const status = this.pendingFromEvent(attempt, event)
        if (status === undefined || attempt.winner !== undefined || this.active !== attempt) return
        attempt.publicStatus = status
        this.statusValue = status
        this.settleReady(attempt, status)
      },
    }
  }

  private async run(attempt: Attempt): Promise<void> {
    try {
      const credential = await this.options.login(this.interaction(attempt))
      if (attempt.winner !== undefined) return
      attempt.winner = 'complete'
      await this.credentials.modify(OPENAI_CODEX_PROVIDER, async () => credential)
      if (this.active === attempt) {
        this.active = undefined
        this.statusValue = { state: 'connected' }
      }
```

</details>

**依据 4 · 源码核查**：[src/auth-controller.ts:300-365](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L300-L365)

尝试与串行取消。

<details>
<summary>查看原文（66行）</summary>

```text
  /** Start exactly the selected flow, returning once its public instructions exist. */
  async start(method: LoginMethod): Promise<PendingStatus> {
    const pending = await this.exclusive(async () => {
      if (this.disposed) throw new AuthControllerError('AUTH_DISPOSED', 'OpenAI sign-in is unavailable because the plugin is stopping.')
      if (method !== 'browser' && method !== 'device_code') {
        throw new AuthControllerError('INVALID_LOGIN_METHOD', 'Login method must be browser or device_code.')
      }
      if (this.active !== undefined) {
        if (this.active.method !== method) {
          throw new AuthControllerError('AUTH_IN_PROGRESS', 'Another OpenAI login method is already in progress; cancel it first.')
        }
        return { ready: this.active.ready }
      }

      const connectedBefore = await this.credentials.read(OPENAI_CODEX_PROVIDER) !== undefined
      let resolveReady!: (status: PendingStatus) => void
      let rejectReady!: (error: AuthControllerError) => void
      const ready = new Promise<PendingStatus>((resolve, reject) => {
        resolveReady = resolve
        rejectReady = reject
      })
      const attempt: Attempt = {
        id: randomUUID(),
        method,
        connectedBefore,
        abort: new AbortController(),
        ready,
        resolveReady,
        rejectReady,
        readySettled: false,
        done: Promise.resolve(),
      }
      this.active = attempt
      this.latest = attempt
      attempt.done = this.run(attempt)
      return { ready }
    })
    return pending.ready
  }

  /** Await completion of the latest named attempt for a direct headless caller. */
  async waitForAttempt(attemptId: string): Promise<AuthStatus> {
    const attempt = this.latest
    if (attempt === undefined || attempt.id !== attemptId) {
      throw new AuthControllerError('STALE_ATTEMPT', 'The OpenAI login attempt is no longer current.')
    }
    await attempt.done
    return this.snapshot()
  }

  /** Cancel only the named current attempt and await provider cleanup. */
  async cancel(attemptId: string): Promise<AuthStatus> {
    const done = await this.exclusive(async () => {
      const attempt = this.active
      if (attempt === undefined || attempt.id !== attemptId || attempt.winner !== undefined) {
        throw new AuthControllerError('STALE_ATTEMPT', 'The OpenAI login attempt is no longer active.')
      }
      attempt.winner = 'cancel'
      attempt.abort.abort('OpenAI sign-in cancelled')
      this.active = undefined
      this.statusValue = attempt.connectedBefore ? { state: 'connected' } : { state: 'disconnected' }
      return attempt.done
    })
    await done
    return this.snapshot()
  }
```

</details>

**依据 5 · 源码核查**：[src/oauth-http.ts:27-62](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/oauth-http.ts#L27-L62)

socket/同源。

<details>
<summary>查看原文（36行）</summary>

```text
/** Return true only for literal IPv4, mapped IPv4, or IPv6 loopback addresses. */
export function isLoopbackAddress(address: string | undefined): boolean {
  if (address === undefined) return false
  if (address === '::1') return true
  const ipv4 = address.startsWith('::ffff:') ? address.slice(7) : address
  return isIP(ipv4) === 4 && ipv4.startsWith('127.')
}

function localHostname(hostname: string): boolean {
  const plain = hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname
  return plain === 'localhost' || isLoopbackAddress(plain)
}

function authority(req: IncomingMessage): URL | undefined {
  if (!isLoopbackAddress(req.socket.remoteAddress)) return undefined
  const host = req.headers.host
  if (host === undefined) return undefined
  try {
    const value = new URL(`http://${host}`)
    if (!localHostname(value.hostname) || value.username.length > 0 || value.password.length > 0) return undefined
    return value
  } catch {
    return undefined
  }
}

function mutationTrusted(req: IncomingMessage, host: URL): boolean {
  if (req.headers['sec-fetch-site'] !== 'same-origin') return false
  const origin = req.headers.origin
  if (origin === undefined) return false
  try {
    return new URL(origin).origin === host.origin
  } catch {
    return false
  }
}
```

</details>

**依据 6 · 源码核查**：[src/oauth-http.ts:102-134](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/oauth-http.ts#L102-L134)

体积/JSON。

<details>
<summary>查看原文（33行）</summary>

```text
  if (!contentTypeIsJson(req)) {
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'OAuth mutations require application/json.')
  }
  const declared = req.headers['content-length']
  if (declared !== undefined) {
    const bytes = Number(declared)
    if (!Number.isSafeInteger(bytes) || bytes < 0) throw new HttpError(400, 'INVALID_BODY', 'Invalid JSON request body.')
    if (bytes > MAX_BODY_BYTES) throw new HttpError(413, 'BODY_TOO_LARGE', 'OAuth request body is too large.')
  }
  const chunks: Buffer[] = []
  let bytes = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    bytes += buffer.byteLength
    if (bytes > MAX_BODY_BYTES) {
      req.resume()
      throw new HttpError(413, 'BODY_TOO_LARGE', 'OAuth request body is too large.')
    }
    chunks.push(buffer)
  }
  let value: unknown
  try {
    value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new HttpError(400, 'INVALID_BODY', 'Invalid JSON request body.')
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new HttpError(400, 'INVALID_BODY', 'JSON request body must be an object.')
  }
  return value as Record<string, unknown>
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
```

</details>

**依据 7 · 源码核查**：[src/client/index.tsx:94-128](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/client/index.tsx#L94-L128)

UI轮询/窗口。

<details>
<summary>查看原文（35行）</summary>

```text
  const refresh = useCallback(async (): Promise<void> => {
    try {
      setStatus(await hostRequest<AuthStatus>('/status'))
      setError(undefined)
    } catch {
      setError(t('requestFailed'))
    }
  }, [t])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => {
    if (status?.state !== 'pending') return
    const timer = window.setTimeout(() => { void refresh() }, 1000)
    return () => { window.clearTimeout(timer) }
  }, [refresh, status])

  const start = async (): Promise<void> => {
    const popup = (method === 'browser' ? window.open('about:blank', '_blank') : null) ?? null
    if (popup !== null) popup.opener = null
    setBusy(true)
    setError(undefined)
    try {
      const pending = await hostRequest<PendingStatus>('/start', { method })
      setStatus(pending)
      if (pending.method === 'browser') {
        const url = trustedAuthorizationUrl(pending.browser.authorizationUrl)
        if (url === undefined) throw new Error(t('requestFailed'))
        if (popup !== null) popup.location.href = url
      }
    } catch (reason) {
      popup?.close()
      setError(reason instanceof Error ? reason.message : t('requestFailed'))
    } finally {
      setBusy(false)
    }
```

</details>

**依据 8 · 源码核查**：[src/login.ts:104-115](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/login.ts#L104-L115)

非交互显式方式。

<details>
<summary>查看原文（12行）</summary>

```text
    'Choose OpenAI login method:\n  1. Browser (recommended)\n  2. Device Code\nChoice [1]: ',
  )).trim().toLowerCase()
  if (answer === '' || answer === '1' || answer === 'browser') return 'browser'
  if (answer === '2' || answer === 'device-code' || answer === 'device_code') return 'device_code'
  throw new LoginUsageError('Choose 1 for Browser or 2 for Device Code.')
}

function printPending(status: PendingStatus, io: LoginIo): void {
  if (status.method === 'browser') {
    io.write(`Open this URL in your browser:\n${status.browser.authorizationUrl}\n\n`)
    io.write('Waiting for the one-time loopback callback on 127.0.0.1:1455…\n')
    return
```

</details>

**依据 9 · 源码核查**：[src/login.ts:98-108](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/login.ts#L98-L108)

非TTY必须显式选方式

<details>
<summary>查看原文（11行）</summary>

```text
async function selectMethod(options: LoginOptions, io: LoginIo): Promise<LoginMethod> {
  if (options.method !== undefined) return options.method
  if (!io.terminal) {
    throw new LoginUsageError('No interactive terminal. Pass --browser or --device-code.')
  }
  const answer = (await io.question(
    'Choose OpenAI login method:\n  1. Browser (recommended)\n  2. Device Code\nChoice [1]: ',
  )).trim().toLowerCase()
  if (answer === '' || answer === '1' || answer === 'browser') return 'browser'
  if (answer === '2' || answer === 'device-code' || answer === 'device_code') return 'device_code'
  throw new LoginUsageError('Choose 1 for Browser or 2 for Device Code.')
```

</details>

**依据 10 · 源码核查**：[src/auth-controller.ts:104-117](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L104-L117)

授权URL限定https auth.openai.com/无userinfo

<details>
<summary>查看原文（14行）</summary>

```text
function trustedOpenAiUrl(raw: string): URL | undefined {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'auth.openai.com'
      || url.username.length > 0 || url.password.length > 0) return undefined
    return url
  } catch {
    return undefined
  }
}

function waitForAbort(signal: AbortSignal): Promise<never> {
  return new Promise<never>((_resolve, reject) => {
    const abort = (): void => {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据落盘、刷新、退出和消息转换的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

凭据以未加密JSON保存于DSH_HOME/plugins/dsh-openai-oauth，文件0600/目录0700、lstat拒绝最终目录/文件符号链接，严格envelope/字段，proper-lockfile串行写删；临时wx文件、fsync、rename再目录sync降低半写风险。刷新先读快路径，临近60秒过期在锁内重读，避免两个刷新直接争同一旧token。并非密钥库加密，DSH_HOME上级/同账户竞态或恶意进程不被这些操作完全隔离。read不取锁但rename保证通常读旧或新完整文件，不声称所有路径TOCTOU已解决。

run把winner设complete后才await modify；logout不走exclusive，winner已complete则不等done，直接delete。若持久化与delete获取锁顺序反转，有迟到保存可能；现源码缺logout epoch/完成栅栏，本轮未执行该交错，不宣称稳定复现/远程攻击。退出删除本地凭据，不调用远端token撤销；已取得credential的在途模型请求不会由logout自动取消。

上下文兼容并非完全无损。options.system进instructions，但messages里的system转user；原顺序把一个用户消息普通内容放前、tool-result放后。未知内容明确报错，图片依赖attachments读后Base64发服务方。replay会核provider/model/block类型数量并保存reasoning/text签名，这是积极边界；可是当前/历史工具参数JSON无效或非对象都退{}，不是协议拒绝，若Host工具允许空对象默认行为可与模型原意不同，执行危险取决Host参数/审批，不能直接认定任意工具越权。

静态模型/思考映射可随上游失效，stop/maxTokens明确不支持。SSE有16Mi字符未分帧buffer上限和读cancel，非整次内容总量上限，output累积仍可增长；无终结事件会报STREAM_CLOSED而非假成功，maxRetries=0不自动重放，部分delta已交Host的恢复仍需调用方处置。

#### 证据与依据

**依据 1 · 源码核查**：[src/credential-store.ts:122-220](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/credential-store.ts#L122-L220)

权限/锁/原子替换。

<details>
<summary>查看原文（99行）</summary>

```text
  /** Plugin-owned state directory. */
  readonly stateDirectory: string
  /** Versioned credential envelope path. */
  readonly credentialFile: string

  /**
   * @param dshHome - resolved Harness home directory.
   */
  constructor(private readonly dshHome: string) {
    this.stateDirectory = resolve(dshHome, 'plugins', STATE_DIRECTORY_NAME)
    this.credentialFile = join(this.stateDirectory, CREDENTIAL_FILE_NAME)
  }

  private async assertDirectory(path: string, create: boolean): Promise<void> {
    let info
    try {
      info = await lstat(path)
    } catch (error) {
      if (!isMissing(error) || !create) throw error
      await mkdir(path, { recursive: true, mode: 0o700 })
      info = await lstat(path)
    }
    if (info.isSymbolicLink() || !info.isDirectory()) throw unsafePath()
    await chmod(path, 0o700)
  }

  private async ensureStateDirectory(): Promise<void> {
    await mkdir(this.dshHome, { recursive: true, mode: 0o700 })
    const plugins = resolve(this.dshHome, 'plugins')
    await this.assertDirectory(plugins, true)
    await this.assertDirectory(this.stateDirectory, true)
  }

  private async readEnvelope(): Promise<CredentialEnvelope | undefined> {
    let info
    try {
      info = await lstat(this.credentialFile)
    } catch (error) {
      if (isMissing(error)) return undefined
      throw error
    }
    if (info.isSymbolicLink() || !info.isFile()) throw unsafePath()
    if ((info.mode & 0o077) !== 0) {
      throw new CredentialStoreError(
        'UNSAFE_CREDENTIAL_PERMISSIONS',
        'OpenAI Codex credential file permissions are unsafe; restrict the file to its owner and retry.',
      )
    }
    return parseEnvelope(await readFile(this.credentialFile, 'utf8'))
  }

  private async withLock<T>(operation: () => Promise<T>): Promise<T> {
    await this.ensureStateDirectory()
    const release = await lockfile.lock(this.stateDirectory, {
      realpath: false,
      stale: 30_000,
      update: 10_000,
      retries: { retries: 80, factor: 1.15, minTimeout: 10, maxTimeout: 150 },
    })
    try {
      return await operation()
    } finally {
      await release()
    }
  }

  private async writeCredential(credential: OAuthCredential): Promise<void> {
    const envelope: CredentialEnvelope = {
      version: ENVELOPE_VERSION,
      credentials: { [OPENAI_CODEX_PROVIDER]: cloneCredential(credential) },
    }
    const temporary = join(this.stateDirectory, `.${CREDENTIAL_FILE_NAME}.${randomUUID()}.tmp`)
    let handle
    try {
      handle = await open(temporary, 'wx', 0o600)
      await handle.writeFile(`${JSON.stringify(envelope, null, 2)}\n`, 'utf8')
      await handle.sync()
      await handle.close()
      handle = undefined
      await rename(temporary, this.credentialFile)
      await chmod(this.credentialFile, 0o600)
      if (process.platform !== 'win32') {
        const directory = await open(this.stateDirectory, 'r')
        try {
          await directory.sync()
        } finally {
          await directory.close()
        }
      }
    } finally {
      await handle?.close()
      try {
        await unlink(temporary)
      } catch (error) {
        if (!isMissing(error)) throw error
      }
    }
  }

```

</details>

**依据 2 · 源码核查**：[src/codex-models.ts:283-315](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/codex-models.ts#L283-L315)

锁内重读刷新。

<details>
<summary>查看原文（33行）</summary>

```text
    if (current === undefined) {
      throw new LlmError('OpenAI Codex is not signed in. Sign in with Browser or Device Code.', 'MISSING_CREDENTIAL')
    }
    if (current.expires > this.now() + REFRESH_SKEW_MS) return current
    const refreshed = await this.credentials.modify(OPENAI_CODEX_PROVIDER, async latest => {
      if (latest === undefined) {
        throw new LlmError('OpenAI Codex is not signed in. Sign in with Browser or Device Code.', 'MISSING_CREDENTIAL')
      }
      if (latest.expires > this.now() + REFRESH_SKEW_MS) return latest
      try {
        return await this.options.refresh(latest, signal)
      } catch {
        if (signal?.aborted) throw new LlmError('OpenAI Codex request was aborted.', 'ABORTED')
        throw new LlmError('OpenAI Codex authentication failed. Sign in again.', 'AUTH')
      }
    })
    if (refreshed === undefined) {
      throw new LlmError('OpenAI Codex is not signed in. Sign in with Browser or Device Code.', 'MISSING_CREDENTIAL')
    }
    return refreshed
  }

  /** Stream one request through the ChatGPT Codex Responses endpoint. */
  async * streamSimple(
    model: Model,
    context: CodexContext,
    options: ModelsSimpleStreamOptions = {},
  ): AsyncGenerator<AssistantMessageEvent> {
    const credential = await this.credential(options.signal)
    const response = await this.fetch(`${model.baseUrl.replace(/\/$/, '')}${RESPONSES_PATH}`, {
      method: 'POST', headers: requestHeaders(credential, options),
      body: JSON.stringify(requestBody(model, context, options)),
      ...options.signal === undefined ? {} : { signal: options.signal },
```

</details>

**依据 3 · 源码核查**：[src/auth-controller.ts:265-274](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L265-L274)

complete在持久化前。

<details>
<summary>查看原文（10行）</summary>

```text
  private async run(attempt: Attempt): Promise<void> {
    try {
      const credential = await this.options.login(this.interaction(attempt))
      if (attempt.winner !== undefined) return
      attempt.winner = 'complete'
      await this.credentials.modify(OPENAI_CODEX_PROVIDER, async () => credential)
      if (this.active === attempt) {
        this.active = undefined
        this.statusValue = { state: 'connected' }
      }
```

</details>

**依据 4 · 源码核查**：[src/auth-controller.ts:367-385](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L367-L385)

logout/dispose边界。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Abort any attempt, then remove only the plugin-owned credential. */
  async logout(): Promise<AuthStatus> {
    const attempt = this.active
    if (attempt !== undefined && attempt.winner === undefined) await this.cancel(attempt.id)
    await this.credentials.delete(OPENAI_CODEX_PROVIDER)
    this.statusValue = { state: 'disconnected' }
    return this.snapshot()
  }

  /** Abort and settle active provider work before plugin effects unwind. */
  async dispose(): Promise<void> {
    this.disposed = true
    await this.mutation
    const attempt = this.active
    if (attempt !== undefined && attempt.winner === undefined) {
      await this.cancel(attempt.id)
    } else if (attempt !== undefined) {
      await attempt.done
    }
```

</details>

**依据 5 · 源码核查**：[src/context.ts:74-114](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/context.ts#L74-L114)

system/结果重排。

<details>
<summary>查看原文（41行）</summary>

```text
    if (message.role === 'system') {
      if (message.content.some(block => block.type !== 'text')) unsupported('non-text', 'system')
      messages.push({
        role: 'user',
        content: message.content.map(block => block.type === 'text' ? block.text : '').join(''),
        timestamp: 0,
      })
      continue
    }
    if (message.role === 'assistant') {
      const assistant = toCodexAssistant(message)
      for (const block of assistant.content) {
        if (block.type === 'toolCall') toolNames.set(CallId(block.id), block.name)
      }
      messages.push(assistant)
      continue
    }
    const regular = message.content.filter(block => block.type !== 'tool-result')
    const content = await userContent(regular, attachments, options.signal)
    const results = message.content.filter(block => block.type === 'tool-result')
    if ((typeof content === 'string' ? content.length > 0 : content.length > 0) || results.length === 0) {
      messages.push({ role: 'user', content, timestamp: 0 })
    }
    for (const result of results) {
      const resultContent = await userContent(result.content, attachments, options.signal)
      messages.push({
        role: 'toolResult',
        toolCallId: result.toolCallId,
        toolName: toolNames.get(result.toolCallId) ?? 'unknown',
        content: typeof resultContent === 'string'
          ? [{ type: 'text', text: resultContent || '(no output)' }]
          : resultContent,
        isError: result.isError ?? false,
        timestamp: 0,
      })
    }
  }
  const tools = toolsOf(options)
  return {
    ...options.system === undefined ? {} : { systemPrompt: options.system },
    messages,
```

</details>

**依据 6 · 源码核查**：[src/codex-models.ts:54-62](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/codex-models.ts#L54-L62)

当前参数退空对象。

```text
}

function parseObject(value: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value)
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
```

**依据 7 · 源码核查**：[src/replay.ts:28-39](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/replay.ts#L28-L39)

历史参数退空对象。

<details>
<summary>查看原文（12行）</summary>

```text
function parseArguments(raw: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as Record<string, unknown>
    }
  } catch {
    // A malformed historical model call remains representable as an empty object.
  }
  return {}
}

```

</details>

**依据 8 · 源码核查**：[src/replay.ts:149-194](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/replay.ts#L149-L194)

replay匹配。

<details>
<summary>查看原文（46行）</summary>

```text

function replayedAssistant(message: Message, source: ModelMessageSource, raw: unknown): AssistantMessage {
  const state = readReplayState(raw)
  if (state.response.provider !== source.provider || state.response.model !== source.model) return invalidReplay('provider or model does not match source')
  if (state.blocks.length !== message.content.length) return invalidReplay('block count does not match content')
  const content: AssistantMessage['content'] = message.content.map((block, index) => {
    const replay = state.blocks[index]
    if (replay === undefined || replay.type !== block.type) return invalidReplay(`block ${index} does not match content`)
    switch (block.type) {
      case 'text': return {
        type: 'text', text: block.text,
        ...replay.type === 'text' && replay.textSignature !== undefined ? { textSignature: replay.textSignature } : {},
      }
      case 'reasoning': return {
        type: 'thinking', thinking: block.text,
        ...replay.type === 'reasoning' && replay.thinkingSignature !== undefined ? { thinkingSignature: replay.thinkingSignature } : {},
        ...replay.type === 'reasoning' && replay.redacted !== undefined ? { redacted: replay.redacted } : {},
      }
      case 'tool-call': return {
        type: 'toolCall', id: block.id, name: block.name, arguments: parseArguments(block.arguments),
        ...replay.type === 'tool-call' && replay.thoughtSignature !== undefined ? { thoughtSignature: replay.thoughtSignature } : {},
      }
      default: return invalidReplay(`block ${index} has unsupported content`)
    }
  })
  return {
    role: 'assistant',
    content,
    api: state.response.api,
    provider: state.response.provider,
    model: state.response.model,
    ...state.response.responseModel === undefined ? {} : { responseModel: state.response.responseModel },
    ...state.response.responseId === undefined ? {} : { responseId: state.response.responseId },
    usage: emptyUsage(),
    stopReason: state.response.stopReason,
    timestamp: 0,
  }
}

/** Reconstruct one Codex assistant history message from Harness content. */
export function toCodexAssistant(message: Message): AssistantMessage {
  const source = message.source
  return source.kind === 'model' && source.replayState !== undefined
    ? replayedAssistant(message, source, source.replayState)
    : foreignAssistant(message)
}
```

</details>

**依据 9 · 源码核查**：[src/codex-models.ts:195-234](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/codex-models.ts#L195-L234)

SSE缓冲/cancel。

<details>
<summary>查看原文（40行）</summary>

```text
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const abort = (): void => { void reader.cancel().catch(() => undefined) }
  signal?.addEventListener('abort', abort, { once: true })
  try {
    while (true) {
      if (signal?.aborted) throw new LlmError('OpenAI Codex request was aborted.', 'ABORTED')
      const chunk = await reader.read()
      if (chunk.done) break
      buffer += decoder.decode(chunk.value, { stream: true })
      if (buffer.length > MAX_SSE_BUFFER_CHARS) {
        throw new LlmError('OpenAI Codex returned an oversized streaming event.', 'PROTOCOL_ERROR')
      }
      let separator = /\r?\n\r?\n/.exec(buffer)
      while (separator !== null) {
        const frame = buffer.slice(0, separator.index)
        buffer = buffer.slice(separator.index + separator[0].length)
        const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).trimStart()).join('\n').trim()
        if (data.length > 0 && data !== '[DONE]') {
          let parsed: unknown
          try {
            parsed = JSON.parse(data)
          } catch {
            throw new LlmError('OpenAI Codex returned invalid streaming data.', 'PROTOCOL_ERROR')
          }
          if (!isRecord(parsed)) throw new LlmError('OpenAI Codex returned invalid streaming data.', 'PROTOCOL_ERROR')
          yield parsed
        }
        separator = /\r?\n\r?\n/.exec(buffer)
      }
    }
  } finally {
    signal?.removeEventListener('abort', abort)
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}

```

</details>

**依据 10 · 源码核查**：[src/stream.ts:111-125](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/stream.ts#L111-L125)

终结/无终结错误。

<details>
<summary>查看原文（15行）</summary>

```text
          arguments: JSON.stringify(event.toolCall.arguments),
        },
      }; break
      case 'done':
        yield { type: 'usage', usage: mapUsage(event.message.usage) }
        yield { type: 'finish', reason: stopReason(event.message, contextWindow), replayState: toCodexReplayState(event.message) }
        return
      case 'error':
        yield { type: 'usage', usage: mapUsage(event.error.usage) }
        yield { type: 'finish', reason: stopReason(event.error, contextWindow) }
        return
    }
  }
  throw new LlmError('OpenAI Codex event stream closed without a terminal event.', 'STREAM_CLOSED')
}
```

</details>

**依据 11 · 源码核查**：[src/credential-store.ts:221-261](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/credential-store.ts#L221-L261)

实际无锁读与锁内modify/delete

<details>
<summary>查看原文（41行）</summary>

```text
  async read(providerId: string): Promise<OAuthCredential | undefined> {
    if (providerId !== OPENAI_CODEX_PROVIDER) return undefined
    await this.ensureStateDirectory()
    const stored = (await this.readEnvelope())?.credentials[OPENAI_CODEX_PROVIDER]
    return stored === undefined ? undefined : cloneCredential(stored)
  }

  async list(): Promise<readonly CredentialInfo[]> {
    const credential = await this.read(OPENAI_CODEX_PROVIDER)
    return credential === undefined ? [] : [{ providerId: OPENAI_CODEX_PROVIDER, type: credential.type }]
  }

  async modify(
    providerId: string,
    fn: (current: OAuthCredential | undefined) => Promise<OAuthCredential | undefined>,
  ): Promise<OAuthCredential | undefined> {
    if (providerId !== OPENAI_CODEX_PROVIDER) {
      throw new CredentialStoreError('UNSUPPORTED_PROVIDER', 'This credential store accepts only openai-codex.')
    }
    return this.withLock(async () => {
      const current = (await this.readEnvelope())?.credentials[OPENAI_CODEX_PROVIDER]
      const replacement = await fn(current === undefined ? undefined : cloneCredential(current))
      if (replacement === undefined) return current === undefined ? undefined : cloneCredential(current)
      const validated = parseCredential(replacement)
      await this.writeCredential(validated)
      return cloneCredential(validated)
    })
  }

  async delete(providerId: string): Promise<void> {
    if (providerId !== OPENAI_CODEX_PROVIDER) return
    await this.withLock(async () => {
      const info = await lstat(this.credentialFile).catch((error: unknown) => {
        if (isMissing(error)) return undefined
        throw error
      })
      if (info === undefined) return
      if (info.isSymbolicLink() || !info.isFile()) throw unsafePath()
      await unlink(this.credentialFile)
    })
  }
```

</details>

**依据 12 · 源码核查**：[src/codex-models.ts:393-398](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/codex-models.ts#L393-L398)

当前流完成的参数parseObject调用

```text
        } else if (slot?.kind === 'toolCall' && block?.type === 'toolCall') {
          const argumentsText = stringOf(item['arguments']) ?? (slot.arguments || '{}')
          block.id = `${stringOf(item['call_id']) ?? block.id.split('|', 1)[0]}|${stringOf(item['id']) ?? ''}`
          block.name = stringOf(item['name']) ?? block.name
          block.arguments = parseObject(argumentsText)
          yield { type: 'toolcall_end', contentIndex: slot.contentIndex, toolCall: block, partial: output }
```

#### 缺口

- logout与complete写入/在途请求的具体交错后果尚未独立验证。
  **影响**：不把本地退出等同远端撤销或所有在途工作停止。
  **进一步探讨**：用假凭据store的可控锁/延迟，枚举logout前后complete与持久化顺序并核最终磁盘/状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入、持续使用和失败恢复成本怎样算？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node ^22.19或>=24、DSH rc.8相关服务 | LLM/CLI/Web适配 | peer标optional不等无服务也有功能 |
| 合资格ChatGPT账号/可信OpenAI登录页面 | OAuth和模型请求 | 非官方社区适配，资格/协议独立变化 |
| 本机127.0.0.1 Host或本机CLI | Web设置或headless登录 | 远程/反代/Windows不在作者0.1支持范围 |
| 可写owner-only DSH_HOME与proper-lockfile | 凭据/刷新 | 明文存储需保护/备份策略 |
| 可选attachments | 图片输入 | 图片会发模型服务 |

#### 使用流程

| 步骤 | 行为 | 判据 |
| --- | --- | --- |
| 固定部署 | 审版本/peer/包来源，保留原provider | 不执行远端main安装指引作固定版本事实 |
| 登录 | 人亲自选PKCE或设备码 | 只在可信页面授权，controller connected后才用 |
| 使用 | 选静态目录候选并核账号实际响应 | 模型可列出不等有资格 |
| 恢复/退出 | 取消明确attempt，核旧连接/在途请求，再删本地凭据 | 不盲重发部分工具任务，不把删除当撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号权益、Node/DSH/依赖与凭据存储 | 核平台/peer、亲自登录与本机权限 | 账号资格/价格/配置工时未知 |
| 持续使用 | 上下文/图片传输、流输出与账号额度 | 核模型支持与任务/工具效果 | 源码cost=0是占位，非免费；延时/额度未知 |
| 失败恢复 | 重新授权/传输/重复上下文、可能旧在途请求 | 核是否已执行工具及凭据状态，恢复provider | 无总deadline/退出全取消，恢复时间未知 |

#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 统一工作区 | DSH直接provider路由 | 不增加账号权益 |
| 凭据管理 | 双方式、锁内刷新/原子落盘 | 明文/本机账户信任 |
| 历史延续 | 签名/replay与工具流转换 | 有参数/角色转换限制 |

源码自带check为typecheck/build，没有把真实账号/业务验收列为已完成证据；也不能用构建通过推出协议持续可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:54-95](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/package.json#L54-L95)

检查/依赖版本。

<details>
<summary>查看原文（42行）</summary>

```text
  },
  "scripts": {
    "build": "tsdown",
    "check": "pnpm run typecheck && pnpm run build",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "openai",
    "codex",
    "oauth"
  ],
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "dependencies": {
    "proper-lockfile": "4.1.2"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-attachment": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.8 <0.2.0-0",
    "@deepseek-ai/dsh-timeout": ">=0.1.0-rc.8 <0.2.0-0",
    "react": "^18.3.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-attachment": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-locale": {
```

</details>

**依据 2 · 源码核查**：[README.zh.md:19-28](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/README.zh.md#L19-L28)

作者支持平台。

<details>
<summary>查看原文（10行）</summary>

```text
- 凭据保存在本机 Harness 主目录

## 准备 DSH

- DeepSeek Harness `0.1.0-rc.8`
- Node.js `^22.19.0` 或 `>=24.0.0`
- `pnpm` 已加入 `PATH`
- 当前具有 Codex 使用资格的 ChatGPT 账号

`0.1.0` 支持 macOS 和 Linux，暂不支持 Windows。
```

</details>

**依据 3 · 源码核查**：[README.zh.md:86-101](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/README.zh.md#L86-L101)

明文/资格/卸载。

<details>
<summary>查看原文（16行）</summary>

```text
安装、更新或卸载插件后需要重启 DSH。登录、退出登录和 token 刷新不需要重启。

如果还要删除保存的凭据，请在卸载前前往**设置 → OpenAI OAuth**退出登录；否则卸载会保留凭据。

## 说明

- 本插件把 ChatGPT 账号连接到 Codex 模型提供方，不会生成 OpenAI API Key。
- Web 集成只支持绑定到 `127.0.0.1` 的本地 DSH Host。
- 凭据以未加密文件保存在 `$DSH_HOME/plugins/dsh-openai-oauth/credentials.json`。
- 可用模型和额度取决于已登录的账号。
- OpenAI 可能独立修改 Codex OAuth 协议。
- 本项目为非官方社区项目，与 OpenAI、DeepSeek AI 无隶属或背书关系。

安全问题和部署说明见 [SECURITY.md](SECURITY.md)。

[MIT](LICENSE)
```

</details>

**依据 4 · 源码核查**：[src/models.ts:132-145](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/models.ts#L132-L145)

零cost占位。

<details>
<summary>查看原文（14行）</summary>

```text
const BASE_MODEL = {
  api: 'openai-codex-responses' as const,
  provider: 'openai-codex',
  baseUrl: 'https://chatgpt.com/backend-api',
  reasoning: true,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  maxTokens: 128_000,
}

/** Versioned model catalog shipped with this plugin release. */
export const OPENAI_CODEX_MODELS: readonly Model<'openai-codex-responses'>[] = [
  {
    ...BASE_MODEL, id: 'gpt-5.3-codex-spark', name: 'GPT-5.3 Codex Spark',
    input: ['text'], contextWindow: 128_000,
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:135-190](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/adapter.ts#L135-L190)

取消与无重试适配。

<details>
<summary>查看原文（56行）</summary>

```text
      throw new LlmError('OpenAI Codex does not support Harness stop sequences.', 'UNSUPPORTED_OPTION')
    }
    if (options.maxTokens !== undefined) {
      throw new LlmError('OpenAI Codex does not expose a per-request maxTokens option.', 'UNSUPPORTED_OPTION')
    }
    const model = this.models.getModel(options.provider, options.model)
    if (model === undefined) throw new LlmError(`OpenAI Codex has no model "${options.model}"`, 'UNKNOWN_MODEL')
    const reasoning = resolveReasoning(model, options.reasoningEffort)
    const containsImage = options.messages.some(message => contentHasImage(message.content))
    if (containsImage && !model.input.includes('image')) {
      throw new LlmError(`OpenAI Codex model "${model.id}" does not support image input.`, 'UNSUPPORTED_CONTENT')
    }
    if (options.signal?.aborted) throw new LlmError('OpenAI Codex request was aborted by the caller.', 'ABORTED')

    const consumer = new AbortController()
    const signal = options.signal === undefined
      ? consumer.signal
      : AbortSignal.any([options.signal, consumer.signal])
    let iterator: AsyncIterator<StreamChunk> | undefined
    let exhausted = false
    try {
      const context = await toCodexContext(options, containsImage ? this.options.attachments?.() : undefined)
      const events = this.models.streamSimple(model, context, {
        ...reasoning === undefined ? {} : { reasoning },
        ...options.temperature === undefined ? {} : { temperature: options.temperature },
        ...options.sessionId === undefined ? {} : { sessionId: String(options.sessionId) },
        signal,
        maxRetries: 0,
        transformHeaders,
      })
      iterator = toStreamChunks(events, model.contextWindow)[Symbol.asyncIterator]()
      while (true) {
        const next = await iterator.next()
        if (next.done) {
          exhausted = true
          return
        }
        yield next.value
      }
    } catch (error) {
      if (error instanceof LlmError) throw error
      if (options.signal?.aborted) throw new LlmError('OpenAI Codex request was aborted by the caller.', 'ABORTED')
      throw redactedCodexError(error)
    } finally {
      if (!exhausted) {
        consumer.abort('OpenAI Codex stream consumer stopped')
        try {
          await iterator?.return?.()
        } catch {
          // The stable abort signal already owns teardown; return adds no outcome.
        }
      }
      consumer.abort('OpenAI Codex stream consumer stopped')
    }
  }
}
```

</details>

#### 缺口

- 固定任务相对API Key/独立CLI的费用、额度、延时与工具恢复正确率未知。
  **影响**：不能宣称更便宜或自动省成本。
  **进一步探讨**：比较同任务/图片/工具链的完成率、额外上下文与人员恢复，不读取真实凭据作研究材料。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否推荐，继续探讨哪里最有价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可试用为本机DSH的独立OAuth provider，保留替代路由并明确本地明文凭据、账号资格和社区协议风险。局部认证/存储/流边界有实质实现，适合能审本机权限与转换契约的维护者；不扩为远程多用户部署，不以静态目录/零cost宣称额度或免费，关键工具仍按Host真实授权。

从异步退出持久化边界、挂起fetch和参数退{}可推导“认证世代与严格协议状态”。logout推进generation并与完成持久化共用串行栅栏，过期generation不能写回/发新请求，已发请求单独标在途；每流程设合并signal的总预算；非法工具JSON保留协议错误，不补可执行默认对象。

尚未实现。对照当前版与原型，用假OAuth/凭据锁/流事件枚举complete-write-logout顺序、刷新轮换、挂起fetch、断流、畸形参数及同账号重新登录；检查退出后无旧代凭据回写、明确terminal/unknown、不生成被修补为{}的调用，正常replay工具链保持。反例是过严截止打断合法慢登录、强取消不能撤回已经执行工具、generation不足以撤销远端token；单列未知效果交人工，不造恰好一次。若仍旧代回写或非法参数变可执行对象，或正常流程大量误拒绝，假设被反证。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth-controller.ts:265-274](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L265-L274)

世代持久化推导。

<details>
<summary>查看原文（10行）</summary>

```text
  private async run(attempt: Attempt): Promise<void> {
    try {
      const credential = await this.options.login(this.interaction(attempt))
      if (attempt.winner !== undefined) return
      attempt.winner = 'complete'
      await this.credentials.modify(OPENAI_CODEX_PROVIDER, async () => credential)
      if (this.active === attempt) {
        this.active = undefined
        this.statusValue = { state: 'connected' }
      }
```

</details>

**依据 2 · 源码核查**：[src/auth-controller.ts:367-385](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts#L367-L385)

退出栅栏推导。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Abort any attempt, then remove only the plugin-owned credential. */
  async logout(): Promise<AuthStatus> {
    const attempt = this.active
    if (attempt !== undefined && attempt.winner === undefined) await this.cancel(attempt.id)
    await this.credentials.delete(OPENAI_CODEX_PROVIDER)
    this.statusValue = { state: 'disconnected' }
    return this.snapshot()
  }

  /** Abort and settle active provider work before plugin effects unwind. */
  async dispose(): Promise<void> {
    this.disposed = true
    await this.mutation
    const attempt = this.active
    if (attempt !== undefined && attempt.winner === undefined) {
      await this.cancel(attempt.id)
    } else if (attempt !== undefined) {
      await attempt.done
    }
```

</details>

**依据 3 · 源码核查**：[src/openai-oauth.ts:275-319](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/openai-oauth.ts#L275-L319)

流程预算推导。

<details>
<summary>查看原文（45行）</summary>

```text
    const intervalSeconds = typeof rawInterval === 'string' ? Number(rawInterval) : rawInterval
    if (typeof deviceAuthId !== 'string' || deviceAuthId.length === 0
      || typeof userCode !== 'string' || userCode.length === 0
      || typeof intervalSeconds !== 'number' || !Number.isFinite(intervalSeconds) || intervalSeconds < 0) {
      throw new Error('OpenAI OAuth device-code response is invalid.')
    }
    interaction.notify({
      type: 'device_code', userCode, verificationUri: DEVICE_VERIFICATION_URI,
      intervalSeconds, expiresInSeconds: DEVICE_TIMEOUT_SECONDS,
    })

    const deadline = now() + DEVICE_TIMEOUT_SECONDS * 1000
    let pollDelay = Math.max(1_000, intervalSeconds * 1000)
    while (now() <= deadline) {
      await sleep(pollDelay, interaction.signal)
      cancelled(interaction.signal)
      const response = await fetch(DEVICE_TOKEN_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ device_auth_id: deviceAuthId, user_code: userCode }),
        ...interaction.signal === undefined ? {} : { signal: interaction.signal },
      })
      if (response.ok) {
        const token = await readJson(response, 'device authorization')
        const code = token['authorization_code']
        const verifier = token['code_verifier']
        if (typeof code !== 'string' || code.length === 0
          || typeof verifier !== 'string' || verifier.length === 0) {
          throw new Error('OpenAI OAuth device authorization response is invalid.')
        }
        return exchange(fetch, code, verifier, DEVICE_REDIRECT_URI, now, interaction.signal)
      }
      if (response.status === 403 || response.status === 404) continue
      const pending: unknown = await response.json().catch(() => undefined)
      const error = isRecord(pending) ? pending['error'] : undefined
      const code = typeof error === 'string' ? error : isRecord(error) ? error['code'] : undefined
      if (code === 'deviceauth_authorization_pending') continue
      if (code === 'slow_down') {
        pollDelay += 5_000
        continue
      }
      throw new Error(`OpenAI OAuth device authorization failed with status ${response.status}.`)
    }
    throw new Error('OpenAI OAuth device code expired.')
  }
```

</details>

**依据 4 · 源码核查**：[src/codex-models.ts:54-62](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/codex-models.ts#L54-L62)

严格参数推导。

```text
}

function parseObject(value: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value)
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
```

#### 缺口

- 认证generation/总预算/严格工具参数原型未实现。
  **影响**：不是当前已有退出撤销或恰好一次保证。
  **进一步探讨**：先运行设计层假依赖交错矩阵，核最终状态/调用生成与正常误拒绝成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
