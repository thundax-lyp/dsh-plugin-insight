# Codex Connect

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[674af26](https://github.com/franksong2702/dsh-codex-connect/tree/674af2699af2755619e130081e26dd8b3d37f371)

<!-- BEGIN META -->
[![GitHub ★ 179](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=179&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/franksong2702/dsh-codex-connect) [![npm 30d 7,739](https://img.shields.io/static/v1?label=npm+30d&message=7%2C739&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-connect) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-connect)
<!-- END META -->

> **功能**：为 DSH 增加 ChatGPT OAuth 授权的 Codex 模型路由及可选辅助能力。

> **亮点**：[Q01](#research-q01) 将 OAuth 模型纳入既有宿主模型选择和 Agent 流程。[Q02](#research-q02) 任务守卫单独限制指定宿主的自动化。

> **主要限制**：[Q02](#research-q02) 精确宿主矩阵、旧任务恢复和真实账号权限是三个验收范围。

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
  - [Q01 · 模型调用与宿主 Agent 怎样分工？](#detail-section-11)
  - [Q02 · 兼容是否等于任务自动化可用？](#detail-section-12)
  - [Q03 · 怎样控制接入及退出成本？](#detail-section-13)
  - [Q04 · 能否减少模型可用性误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 会话中使用 Codex 模型并保留宿主工具流程的开发者。

沿用现有 DSH 模型，或在独立 Codex 客户端处理并手工搬运任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型路由 | 在 DSH 选用 Codex | 依赖精确宿主与实际账号 |
| 凭据管理 | 授权模型请求 | 卸载后需按需注销 |
| 旧任务恢复 | 保留查看、停止和接管出口 | 指定宿主为恢复模式 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 一致的 DSH 包组 | 挂载必需 | 注册宿主模型 | 诊断后恢复原配置 |
| 获授权 ChatGPT 账号 | 真实模型必需 | 提供 OAuth | 仅保留本地核查 |
| 无同名 provider | 挂载必需 | 避免冲突 | 保留原路由 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 诊断 | 用户确认包及 profile | 未知时暂停 |
| 授权 | 用户在浏览器亲自确认 | 失败时保护已有凭据 |
| 试用 | 用户提交固定任务 | 核对工具和取消 |
| 退出 | 用户切回原路由，按需注销 | 确认凭据处理结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账号及宿主费用未知 | 核对版本和授权 | 未测试 |
| 持续 | 额度消耗未知 | 维护版本和错误诊断 | 取决于实际账号 |
| 失败恢复 | 重试及恢复成本未知 | 处理冲突、退出和凭据 | 未运行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接入 | 适配器在宿主注册 | 账号及效果 |
| 任务恢复 | 指定版本有独立守卫 | 历史任务迁移 |
| 账户退出 | 独立存储与备份 | 本机残留 |

> **思考**：[Q02](#research-q02) 精确宿主矩阵、旧任务恢复和真实账号权限是三个验收范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 OAuth 模型纳入既有宿主模型选择和 Agent 流程。[Q02](#research-q02) 任务守卫单独限制指定宿主的自动化。

[Q02](#research-q02) 包元数据与能力判据分开，混配宿主拒绝任务自动化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 精确宿主矩阵、旧任务恢复和真实账号权限是三个验收范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先做无钥匙诊断再决定是否授权。[Q02](#research-q02) 指定恢复宿主的旧任务按只读、停止或手动接管流程单独验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码与作者兼容报告分开记录。未运行安装、OAuth、模型或 Desktop。

- 已检查：作者 README、包清单、源码路径 README.md、src/adapter.ts、src/adaptive-task-control-runtime.ts、src/adaptive-task-host-policy.ts、src/index.ts、src/store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交代表接线、认证及恢复策略。未验证发布物、实时服务、真实宿主或模型。
- 下一步：在隔离 profile 验证实际包组、路由冲突、普通请求、停止和注销。

**分析版本**

- **仓库**：[franksong2702/dsh-codex-connect](https://github.com/franksong2702/dsh-codex-connect)
- **版本号**：0.2.0-alpha.12（[固定提交 674af26](https://github.com/franksong2702/dsh-codex-connect/tree/674af2699af2755619e130081e26dd8b3d37f371)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将目录、包兼容与账户权限分开显示并验证是否减少误判。

在隔离 profile 验证实际包组、路由冲突、普通请求、停止和注销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 182 | 8326 | — | — | 169127 |
| .mjs | source | 84 | 9969 | 9344 | 334 | — |
| .js | source | 7 | 33963 | 31603 | 3137 | — |
| .tsx | source | 15 | 3717 | 3409 | 120 | — |
| .ts | source | 114 | 18517 | 16218 | 1277 | — |
| .mjs | test | 8 | 570 | 543 | 13 | — |
| .tsx | test | 30 | 6931 | 6445 | 135 | — |
| .ts | test | 166 | 22840 | 21314 | 412 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/franksong2702/dsh-codex-connect/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=24&color=737b86&logo=github)](https://github.com/franksong2702/dsh-codex-connect/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/franksong2702/dsh-codex-connect/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在保留 DSH Agent 流程的前提下，插件实际接入哪些 Codex 能力，如何确认边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型调用与宿主 Agent 怎样分工？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在 DSH 的工具与会话流程内选用 Codex 模型的人，可通过额外的 openai-codex 路由让现有宿主发出模型请求。相对另开 Codex 客户端再手工搬运上下文，这个入口将模型纳入同一选择流程。代码检查已注册的同名 provider，再创建认证和适配器，注册到 ctx.llm。适配器用当前 credential 提供 OAuth key，把模型上下文和选项送入 provider streamSimple，能走诊断 fetch 和配置代理。开发者仍须亲自完成授权并以实际模型可用性作为验收，目录中的条目不能替代账户权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-15](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L13-L15)

作者界定模型路由与宿主职责

```text
Community Alpha — not affiliated with or endorsed by OpenAI, ChatGPT, Codex, DeepSeek, or DeepSeek Harness.

Codex Connect adds the `openai-codex` model provider to the normal Harness agent loop. Harness continues to manage tools, permissions, approvals, attachments, session persistence, compaction, and recovery. Installing the plugin does not change your default model or search route, and it does not turn a ChatGPT subscription into an OpenAI Platform API key.
```

**依据 2 · 源码核查**：[src/index.ts:475-510](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/index.ts#L475-L510)

冲突检查和 LLM 路由接线

<details>
<summary>查看原文（36行）</summary>

```text
  }
  assertNoOpenAICodexProviderConflict(ctx.llm.listProviders().map(provider => provider.id))
  new OpenAICodexTransport(
    ctx,
    credentials,
    proxyManager,
    resolveProviderProxyUrl,
    () => resolveOpenAICodexSettings(current()).imageModelHint,
    backendRequests,
  )
  registerOpenAICodexAutoReview(
    ctx,
    credentials,
    proxyManager,
    resolveProviderProxyUrl,
    () => resolveOpenAICodexSettings(current()).enableAutoReview,
    backendRequests,
  )
  const adapter = createOpenAICodexAdapter(
    credentials,
    () => ctx.get('attachments'),
    fastMode,
    () => resolveOpenAICodexSettings(current()).models,
    proxyManager,
    resolveProviderProxyUrl,
    () => resolveOpenAICodexSettings(current()).contextWindowOverrides,
    undefined, // Inert retired slot; no Reserve object or authority is created.
    () => resolveOpenAICodexSettings(current()).enableNativeCompaction,
    backendRequests,
    taskRuntime,
    () => resolveOpenAICodexSettings(current()).enableImageGeneration,
    config.preflightActivity,
    config.retryPolicy,
    () => resolveOpenAICodexSettings(current()).reasoningEffort,
  )
  ctx.llm.registerAdapter([OPENAI_CODEX_PROVIDER], adapter)
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:114-138](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/adapter.ts#L114-L138)

流与 OAuth 认证进入供应商适配器

<details>
<summary>查看原文（25行）</summary>

```text
    ...configured,
    streamSimple(model, context: PiContext, options?: SimpleStreamOptions) {
      const operation = (actualProxyOrigin: string | undefined) => {
        const diagnosticOptions = withCodexDiagnosticFetch(options, backendRequests)
        const requestOptions = preflight === undefined ? diagnosticOptions : preflight.wrap(diagnosticOptions, actualProxyOrigin)
        return streamSimple.call(configured, model, codexProviderContext(context), codexRequestOptions(provider.id, model, requestOptions))
      }
      if (backendRequests !== undefined) return backendRequests.runStream(operation)
      const proxyUrl = resolveProxyUrl?.()
      return proxyManager?.runStream(proxyUrl, () => operation(proxyUrl)) ?? operation(undefined)
    },
    auth: {
      ...provider.auth,
      apiKey: {
        name: 'OpenAI Codex OAuth bearer token',
        async resolve({ credential, signal }) {
          const apiKey = credential?.key
          if (apiKey !== undefined && apiKey.length > 0) preflight?.activate(signal)
          return apiKey === undefined || apiKey.length === 0
            ? undefined
            : { auth: { apiKey }, source: 'OAuth' }
        },
      },
    },
  }
```

</details>

**依据 4 · 作者声明**：[README.md:65-69](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L65-L69)

交互授权要求

```text
### 2. Authorize and select a model

Open **Settings → Models → Openai-Codex → Authorize**, then complete approval yourself in the browser. If an embedded window is blocked, select **Open ChatGPT sign-in page**. Choose an `openai-codex` model in the normal Harness model picker.

Never paste an authorization URL, code, token, or account identifier into an issue, log, chat, or configuration file. For a browser on another device, the optional manual callback form can complete the pending login without forwarding the localhost callback port; follow [Remote browser authorization](docs/reference.md#remote-browser-authorization).
```

#### 缺口

- 未执行 OAuth 和模型请求，也未对照独立客户端
  **影响**：无法确定模型可用性、工具恢复和效率
  **进一步探讨**：在获授权的隔离 DSH 会话中用固定文本、工具与取消任务对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 兼容是否等于任务自动化可用？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

固定文档列出插件 alpha.12 的一组精确宿主版本，作者报告无钥匙安装及运行回归。它是宿主构造的证据，不能代替 OAuth 或 Desktop 真实接受。任务策略读取 agent、agent-loop、tools 的包版本。只要其中出现 0.2.2-alpha.3 而其余不全相同就报版本不匹配，全相同进入仅恢复模式。对其他宿主，自动化守卫还看 Tools.prototype.presentAs。这个限制的范围是任务自动化，普通模型路由的存在与旧任务可读都不提供自动激活依据。测试范围内也应区分版本矩阵与实际安装包解析。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-30](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L23-L30)

精确版本声明和账号条件

```text
This guide recommends Codex Connect `0.2.0-alpha.12` / DSH `0.2.1-rc.5`; the other exact supported hosts are listed below. Check `dsh --version` first and use `doctor --json` for local diagnostics; the CLI version alone does not prove which model-runtime packages are installed, and missing metadata is reported as unknown. For other versions, use [Installation and upgrades](INSTALL.md). A moving npm tag such as `alpha` is not a compatibility guarantee.

| Requirement | Verified pairing |
|---|---|
| Codex Connect | `0.2.0-alpha.12` |
| DeepSeek Harness | `0.1.7-rc.1`, `0.1.7-rc.2`, `0.2.0-rc.1`, `0.2.0-rc.2`, `0.2.1-alpha.1`, `0.2.1-alpha.2`, `0.2.1-alpha.3`, `0.2.1-alpha.4`, `0.2.1-alpha.5`, `0.2.1-rc.1`, `0.2.1-rc.2`, `0.2.1-rc.3`, `0.2.1-rc.4`, `0.2.1-rc.5` or `0.2.2-alpha.3` (consistent package set) |
| Node.js | `^22.19.0 \|\| >=24.0.0` |
| Account | ChatGPT OAuth with access to the requested Codex model; availability is decided by OpenAI |
```

**依据 2 · 作者声明**：[README.md:48-54](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L48-L54)

作者报告的无钥匙验证与真实环境缺口

```text
Historical release [`0.2.0-alpha.1`](docs/release-notes/0.2.0-alpha.1.md) adds `gpt-6.1-sol` through a model-catalog fallback and begins the shorter independent plugin numbering. The four supported DSH versions are unchanged; no host upgrade is required.

It retains Alpha 4.54's handling of initial system instructions and tool definitions on DSH 0.2.0-rc.2, diagnostics for differing host/plugin provider libraries, and Canary's normal-request checks, along with Alpha 4.53's core maintenance changes, existing-task recovery and safety, and 4.52's [opt-in local request metrics](docs/request-metrics.md). Collection stays off until a private directory is configured; unknown usage is not zero. No Task reopening or model-library/OAuth upgrade is included.

The package passed keyless installation/runtime regression on all fifteen exact DSH versions above. Task controls remain paused: activation is rejected and existing current-host browser regressions show no controls in fresh Sessions. These checks do not establish live OAuth, real-account image editing, authenticated browser acceptance on the new host, or full user acceptance; migration of earlier Task grants across a Harness upgrade is not verified. Older supported pairings and their task behavior are documented in [Installation and upgrades](INSTALL.md).

Historically, on 2026-10-10 the maintainer reported successful login and normal use on Desktop `0.2.0-rc.2` with the identified local adaptation build. Only the historical `0.2.0-alpha.3` client was compared with that local adaptation and found to differ only by the package-version string. This comparison does not establish `0.2.0-alpha.4` Desktop or live-account acceptance, nor acceptance of later npm artifacts; no new real Desktop acceptance was performed. See the [Desktop acceptance record](INSTALL.md#official-desktop).
```

**依据 3 · 源码核查**：[src/adaptive-task-host-policy.ts:7-31](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/adaptive-task-host-policy.ts#L7-L31)

精确宿主元数据、混配拒绝及自动化守卫

<details>
<summary>查看原文（25行）</summary>

```text
export const TASK_HOST_RECOVERY_ONLY = 'TASK_HOST_RECOVERY_ONLY'
const require = createRequire(import.meta.url)
const packages = ['@deepseek-ai/dsh-agent', '@deepseek-ai/dsh-agent-loop', '@deepseek-ai/dsh-tools'] as const

/** Read package metadata only; alpha.3's existing records retain safety exits, never automation. */
export function taskHostRecoveryOnly(): boolean {
  const versions = packages.map(name => {
    try {
      const metadata: unknown = JSON.parse(readFileSync(require.resolve(name + '/package.json'), 'utf8'))
      if (metadata !== null && typeof metadata === 'object' && 'name' in metadata && metadata.name === name
        && 'version' in metadata && typeof metadata.version === 'string') return metadata.version
    } catch { /* Missing metadata cannot manufacture an alpha.3 match. */ }
    return undefined
  })
  if (!versions.includes('0.2.2-alpha.3')) return false
  if (!versions.every(version => version === '0.2.2-alpha.3')) taskFailure('TASK_HOST_VERSION_MISMATCH')
  return true
}

export function assertTaskHostAutomation(): void {
  if (taskHostRecoveryOnly()) taskFailure(TASK_HOST_RECOVERY_ONLY)
  // Unknown/new executor-only runtimes must not regain automation merely because
  // their package metadata is unavailable. Recovery exits do not use this guard.
  if (typeof Reflect.get(Tools.prototype, 'presentAs') !== 'function') taskFailure('TASK_HOST_AUTOMATION_UNVERIFIED')
}
```

</details>

**依据 4 · 源码核查**：[src/adaptive-task-control-runtime.ts:124-138](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/adaptive-task-control-runtime.ts#L124-L138)

控制状态反映仅恢复限制

<details>
<summary>查看原文（15行）</summary>

```text
    const doc = await this.ledger.read(this.identity(parent, principal)) as TaskLedgerDocument
    const grant = doc.delegation.grant
    const manifest = grant === null ? undefined : TaskEvidenceManifest.restore(await this.options.artifacts(doc).get(grant.sourceManifest), grant.sourceManifest)
    const config = parent.session.requestHeader()?.config
    const current = config?.provider === 'openai-codex' && config.reasoningEffort !== undefined
      ? { model: config.model, effort: String(config.reasoningEffort) } : undefined
    return { revision: doc.revision, mode: doc.mode, reserved: doc.reserved, maximumRequests: doc.maximumRequests,
      capabilities: doc.capabilities, canStart: false, eligibility: 'not-probed', ...(current === undefined ? {} : { current }),
      ...(['auto', 'interrupted'].includes(doc.mode) ? { requested: doc.route } : {}),
      ...(doc.mode === 'stopped' && parent.status !== 'idle' ? { unavailable: 'TASK_STOPPING' }
        : taskHostRecoveryOnly() ? { unavailable: TASK_HOST_RECOVERY_ONLY } : {}),
      delegation: { version: 2, idle: parent.status === 'idle', enabled: grant !== null,
        canDowngrade: doc.mode === 'manual' && grant === null && parent.status === 'idle'
          && doc.delegation.runs.every(run => !childUnresolved(run) && run.delivery === 'recorded'),
        files: manifest?.sources().map(source => source.path) ?? [], routes: grant?.routes ?? [],
```

</details>

#### 缺口

- 没有独立复跑版本矩阵或验证跨版本旧任务
  **影响**：无法确认实际部署包解析与迁移结果
  **进一步探讨**：分开验收模型路由和现有任务可读、可停与手动接管

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样控制接入及退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

采用须固定插件和宿主的实际包组合，验证目标 profile 没有同名路由，并亲自完成授权。凭据由独立存储管理，当前写入使用原子文件及 0600 模式，旧版迁移可保存匹配的备份。作者明确卸载不会注销，并说明何时主动注销。初次可只做无钥匙诊断，随后在获授权情况下做少量模型调用；代理和账户条件不同会增加持续排障成本。遇到重复 provider、实际包版本未知或账号请求被拒，恢复既有模型配置，按需要单独处理凭据。费用及耗时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:56-78](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L56-L78)

精确安装、授权与本地诊断

<details>
<summary>查看原文（23行）</summary>

````text
### 1. Install

```sh
dsh plugin --profile web add dsh-codex-connect@0.2.0-alpha.12
dsh web
```

Replace `web` with your existing profile name; use that same profile when starting Harness. From a DSH source checkout, prefix commands with `pnpm`. See [INSTALL.md](INSTALL.md) for other profiles and installation checks.

### 2. Authorize and select a model

Open **Settings → Models → Openai-Codex → Authorize**, then complete approval yourself in the browser. If an embedded window is blocked, select **Open ChatGPT sign-in page**. Choose an `openai-codex` model in the normal Harness model picker.

Never paste an authorization URL, code, token, or account identifier into an issue, log, chat, or configuration file. For a browser on another device, the optional manual callback form can complete the pending login without forwarding the localhost callback port; follow [Remote browser authorization](docs/reference.md#remote-browser-authorization).

### 3. Check the installation

For a package-manager-free diagnostic, run the already installed bin directly (replace these independently identified paths):

```sh
node /absolute/profile/node_modules/dsh-codex-connect/lib/bin.js doctor --json \
  --install-anchor /absolute/dsh/node_modules/@deepseek-ai/dsh/package.json
```
````

</details>

**依据 2 · 源码核查**：[src/store.ts:246-260](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/store.ts#L246-L260)

凭据写入及旧版本备份

<details>
<summary>查看原文（15行）</summary>

```text
  private async writeDocument(document: AuthDocumentV2, previous?: AuthDocument): Promise<void> {
    const text = serializeDocument(document)
    if (previous?.version === 1) {
      const existingBackup = await this.readDocumentAt(this.version1BackupFilename)
      if (existingBackup === undefined) {
        await writeFileAtomic(this.version1BackupFilename, serializeDocument(previous), {
          mode: 0o600,
          dirMode: 0o700,
        })
      } else if (existingBackup.version !== 1
        || serializeDocument(existingBackup) !== serializeDocument(previous)) {
        throw new Error(`openai-codex: ${this.version1BackupFilename} rollback copy does not match the current version 1 credential`)
      }
    }
    await writeFileAtomic(this.filename, text, { mode: 0o600, dirMode: 0o700 })
```

</details>

**依据 3 · 作者声明**：[README.md:126-144](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L126-L144)

卸载、账户选择与访问限制

<details>
<summary>查看原文（19行）</summary>

```text
## FAQ and important limits

### Where are my credentials stored?

OAuth credentials are stored on the host running DSH and used there to authenticate and send requests to OpenAI. Normal browser account responses return account summaries, not raw tokens. A remote browser device is not necessarily the DSH host.

### Does uninstalling sign me out?

No. OAuth state is stored separately at `$DSH_HOME/.openai-codex-auth.json` (`~/.dsh` by default). The plugin does not copy or modify `~/.codex/auth.json`. Use **Sign out all accounts**, or `logout` before uninstalling, only when deleting credentials is intentional.

### Can I switch accounts for different conversations?

Subsequent Codex requests use the selected active account; conversations do not bind their own accounts. Fast Mode is conversation-scoped. Cancelling a new authorization preserves existing accounts; an explicit revoked-refresh response asks for reauthorization, while temporary failures preserve the account for retry. See [Account behavior](docs/reference.md#accounts-models-and-quota).

### Why does a listed model fail?

Model HTTP/SSE failures include bounded, request-local diagnostic metadata after the existing error message. An `overloaded` message alone does not establish an account block. See [persistent-error diagnostics](docs/experiments/issue-219-diagnostics.md) for scope and reproduction.

Account permissions, plugin/host compatibility, and network conditions all affect availability. Access on another client does not guarantee this integration will work. OpenAI controls model access, quota, context capacity, and service behavior; catalog entries are not proof of entitlement.
```

</details>

**依据 4 · 作者声明**：[README.md:150-156](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L150-L156)

重复 provider 和诊断范围

```text
### Can I keep the original `dsh-codex` plugin installed?

Not in the same effective configuration: both register `openai-codex`. Follow [MIGRATION.md](MIGRATION.md); remove only the confirmed conflicting entry, not credentials or unrelated providers.

### What do diagnostics prove?

`doctor` is local. Capability and reviewer probes may make network requests and consume quota when their preconditions are met. `auto-review-probe` checks only the reviewer route and structured response, not the full Harness approval integration or execution of the reviewed action. Commands, limits, and exit codes are in the [diagnostics reference](docs/reference.md#capability-probes).
```

#### 缺口

- 未检查安装包、文件权限在本机的最终效果及退出
  **影响**：无法确认状态遗留与真实采用成本
  **进一步探讨**：以隔离 profile 验证包标识、授权、切回原路由和主动注销

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否减少模型可用性误判？

**研究主题**：新假设与验证

#### 完整回答

本地 doctor 已能提供包身份线索，模型请求已有有限的错误诊断。可在选择器旁把声明可见、宿主已核实、账户权限未验证分开，直到该账户在当次真实调用成功才更新观测状态。避免把目录可见或临时 overload 当成账号可用或被封。用相同故障脚本对照当前流程与分层提示，注入兼容包未知、授权撤销、模型不可用和暂时拥塞，比较用户正确排障首步与无效重试。若没有改善或导致多余真实请求，撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-30](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L23-L30)

版本诊断和账号条件已分开

```text
This guide recommends Codex Connect `0.2.0-alpha.12` / DSH `0.2.1-rc.5`; the other exact supported hosts are listed below. Check `dsh --version` first and use `doctor --json` for local diagnostics; the CLI version alone does not prove which model-runtime packages are installed, and missing metadata is reported as unknown. For other versions, use [Installation and upgrades](INSTALL.md). A moving npm tag such as `alpha` is not a compatibility guarantee.

| Requirement | Verified pairing |
|---|---|
| Codex Connect | `0.2.0-alpha.12` |
| DeepSeek Harness | `0.1.7-rc.1`, `0.1.7-rc.2`, `0.2.0-rc.1`, `0.2.0-rc.2`, `0.2.1-alpha.1`, `0.2.1-alpha.2`, `0.2.1-alpha.3`, `0.2.1-alpha.4`, `0.2.1-alpha.5`, `0.2.1-rc.1`, `0.2.1-rc.2`, `0.2.1-rc.3`, `0.2.1-rc.4`, `0.2.1-rc.5` or `0.2.2-alpha.3` (consistent package set) |
| Node.js | `^22.19.0 \|\| >=24.0.0` |
| Account | ChatGPT OAuth with access to the requested Codex model; availability is decided by OpenAI |
```

**依据 2 · 作者声明**：[README.md:140-148](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/README.md#L140-L148)

模型错误与归因边界

```text
### Why does a listed model fail?

Model HTTP/SSE failures include bounded, request-local diagnostic metadata after the existing error message. An `overloaded` message alone does not establish an account block. See [persistent-error diagnostics](docs/experiments/issue-219-diagnostics.md) for scope and reproduction.

Account permissions, plugin/host compatibility, and network conditions all affect availability. Access on another client does not guarantee this integration will work. OpenAI controls model access, quota, context capacity, and service behavior; catalog entries are not proof of entitlement.

### Does changing client headers prevent persistent authorization failures?

No such guarantee is established. Codex Connect is a third-party integration; it does not impersonate Codex Desktop or fabricate installation/attestation headers. The pi-ai model/OAuth route and auxiliary routes currently identify themselves differently. OpenAI's [App Server documentation](https://developers.openai.com/codex/app-server/) asks integrations to identify their own client with `clientInfo`; it does not establish acceptance rules for this plugin's direct backend calls. An `overloaded` message is not proof of a block. Capture the bounded error metadata and compare successful and failed windows before attributing the cause; share request IDs privately, never tokens or full session archives.
```

**依据 3 · 源码核查**：[src/adapter.ts:114-134](https://github.com/franksong2702/dsh-codex-connect/blob/674af2699af2755619e130081e26dd8b3d37f371/src/adapter.ts#L114-L134)

实际请求诊断和认证

<details>
<summary>查看原文（21行）</summary>

```text
    ...configured,
    streamSimple(model, context: PiContext, options?: SimpleStreamOptions) {
      const operation = (actualProxyOrigin: string | undefined) => {
        const diagnosticOptions = withCodexDiagnosticFetch(options, backendRequests)
        const requestOptions = preflight === undefined ? diagnosticOptions : preflight.wrap(diagnosticOptions, actualProxyOrigin)
        return streamSimple.call(configured, model, codexProviderContext(context), codexRequestOptions(provider.id, model, requestOptions))
      }
      if (backendRequests !== undefined) return backendRequests.runStream(operation)
      const proxyUrl = resolveProxyUrl?.()
      return proxyManager?.runStream(proxyUrl, () => operation(proxyUrl)) ?? operation(undefined)
    },
    auth: {
      ...provider.auth,
      apiKey: {
        name: 'OpenAI Codex OAuth bearer token',
        async resolve({ credential, signal }) {
          const apiKey = credential?.key
          if (apiKey !== undefined && apiKey.length > 0) preflight?.activate(signal)
          return apiKey === undefined || apiKey.length === 0
            ? undefined
            : { auth: { apiKey }, source: 'OAuth' }
```

</details>

#### 缺口

- 未比较客户端现有提示和用户判断
  **影响**：无法证明增加提示有价值
  **进一步探讨**：先核对客户端状态，再以固定错误对照测量

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
