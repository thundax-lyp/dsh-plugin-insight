# dsh-auto-mode

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[907d663](https://github.com/NanmiCoder/dsh-auto-mode/tree/907d663b7d65e3fcd9f328c598dee03772cac18b)

<!-- BEGIN META -->
[![GitHub ★ 161](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=161&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-auto-mode) [![npm 30d 1,588](https://img.shields.io/static/v1?label=npm+30d&message=1%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-auto-mode) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-auto-mode)
<!-- END META -->

> **功能**：在 DSH 的 workspace-write 中为部分工具提供确定性与语义审批策略。

> **亮点**：[Q01](#research-q01) 在原沙箱模式内将常规和语义审核分流。

> **主要限制**：[Q02](#research-q02) 第三方工具与分类器有独立风险边界。[Q03](#research-q03) 项目已经停维。

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
  - [Q01 · 常规工具怎样走自动策略？](#detail-section-11)
  - [Q02 · 分类器能改变哪些许可？](#detail-section-12)
  - [Q03 · 如何退出旧模式？](#detail-section-13)
  - [Q04 · 怎样核对非标准工具风险？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要减少日常工具审批并保留工作区边界的旧版 DSH 用户。

使用宿主内建手工权限模式逐项批准。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具审批 | 在兼容宿主分流风险 | 只覆盖目标策略与权限边界 |
| 分类 | 处理适合语义审查的请求 | 受配置与披露约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容旧宿主 | 必需 | 提供工具及审批事件 | 使用宿主手工模式 |
| 分类模型或端点 | 语义路径需要 | 返回判断 | 拒绝或人工核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核对 | 用户保存历史并确认当前预设 | 避免手改事件 |
| 切换 | 用户选合适手工模式 | 用惰性调用核验 |
| 退出 | 禁用插件并检查新会话 | 核对实际权限 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主和测试费用未知 | 验证精确版本与策略 | 未执行 |
| 持续 | 分类请求和等待 | 核对误判 | 项目无后续维护 |
| 恢复 | 迁移成本未知 | 保留日志并切换 | 真实兼容待测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 规则分流 | 工作区内确定性判断 | 实际误放与误拦 |
| 单次扩权 | 审批事件中决定 | 真实权限和代价 |

> **思考**：[Q02](#research-q02) 第三方工具与分类器有独立风险边界。[Q03](#research-q03) 项目已经停维。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在原沙箱模式内将常规和语义审核分流。

[Q02](#research-q02) 规则、语义判定及实际批准是不同环节。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 第三方工具与分类器有独立风险边界。[Q03](#research-q03) 项目已经停维。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 新配置使用适合任务的宿主手工模式，旧会话先备份后退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定历史源码支持审批分层，未进行宿主或安全验收。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/policy.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定历史宿主策略路径，未执行目标。
- 下一步：在旧兼容隔离 profile 核对策略、数据披露与退出。

**分析版本**

- **仓库**：[NanmiCoder/dsh-auto-mode](https://github.com/NanmiCoder/dsh-auto-mode)
- **版本号**：0.2.0（[固定提交 907d663](https://github.com/NanmiCoder/dsh-auto-mode/tree/907d663b7d65e3fcd9f328c598dee03772cac18b)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 检验未知工具的副作用声明能否减少误放。

在旧兼容隔离 profile 核对策略、数据披露与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 70 | 8262 | — | — | 112182 |
| .js | source | 15 | 3762 | 3549 | 220 | — |
| .mjs | source | 34 | 6008 | 5241 | 369 | — |
| .mjs | example | 5 | 215 | 194 | 7 | — |
| .mjs | test | 7 | 720 | 652 | 10 | — |
| .md | example | 22 | 1999 | — | — | 19737 |
| .ts | example | 1 | 68 | 50 | 13 | — |
| .ts | source | 16 | 3482 | 2997 | 226 | — |
| .ts | test | 22 | 3650 | 3300 | 64 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-auto-mode/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-auto-mode/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-auto-mode/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：停维的 Sandbox Auto 如何实现工具审批和退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 常规工具怎样走自动策略？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在工作区内减少重复审批的开发者，传统做法是手工查看每个动作。插件加载前要求支持宿主及 workspace-write 加 ask 预设。工具 guard 与 pre-execute 在目标模式及相关子代理路径检查孤立授权和硬拒绝。通过确定规则的调用仍进入宿主流程。带有扩权参数或需语义审核的动作走另一分支，普通沙箱不会因选择模式自动扩大。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-33](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/README.md#L22-L33)

作者场景、独立模式与版本

<details>
<summary>查看原文（12行）</summary>

```text
## Sandbox Auto

`dsh-auto-mode` keeps routine work inside Harness's `workspace-write` sandbox and reviews semantic risks or exact one-shot requests for wider access. The plugin's **Sandbox Auto** mode uses the independent key `sandbox-auto`; it does not replace the official, unsandboxed **Auto review** mode.

> [!IMPORTANT]
> Plugin **0.2.0** is the stable npm `latest` release for the official Harness **0.2.0-rc.2** release (`dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`). Plugin and host version numbers are independent. Harness itself still labels this release RC; install the exact supported host rather than assuming its npm `latest` points to it.

| Harness host | Plugin support |
| --- | --- |
| `0.2.0-rc.2` | Recommended for plugin `0.2.0` |
| `0.1.7-rc.2`, `0.1.5-rc.2`, `0.1.5-rc.1`, `0.1.2-rc.1`, `0.1.2-alpha.5`, `0.1.2-alpha.3`, `0.1.2-alpha.2` | Retained exact compatibility; product-entry matrix required for release |
| Other unlisted hosts, including `0.2.0-rc.1` and `0.1.6-alpha.*` | Not declared supported |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:272-303](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L272-L303)

挂载、预设条件与权威解析

<details>
<summary>查看原文（32行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  assertHarnessCompatibility()
  const artifacts = new ArtifactRegistry()
  const grants = new AutoApprovalGrants()
  const classifierFailures = new WeakMap<object, number>()
  const recoveryPresentations = new WeakMap<object, Set<string>>()
  const classifier = classifierFrom(ctx, config)
  const presetName = config.presetName ?? AUTO_PERMISSION_PRESET
  // Prepend before the permission owner's restore admission; appended identity
  // uses the normal Session publication/persistence path, never edits old rows.
  const target = ctx.permissionPresets.resolve(presetName)
  if (target.sandbox !== 'workspace-write' || target.approval !== 'ask') {
    throw new Error('Auto Mode requires a workspace-write + ask permission preset')
  }
  ctx.inject(['sessions'], scope => {
    scope.on('session/created', session => { migrateLegacyAutoSession(session, presetName) }, { prepend: true })
    for (const session of scope.sessions.list()) migrateLegacyAutoSession(session, presetName)
  })
  const rootOptions: RootOptions = {
    ...(config.workspaceRoot === undefined ? {} : { workspaceRoot: config.workspaceRoot }),
    ...(config.dshHome === undefined ? {} : { dshHome: config.dshHome }),
    ...(config.tempRoots === undefined ? {} : { tempRoots: config.tempRoots }),
  }
  const rootsFor = (exec: Readonly<ToolExecution>) => resolveRoots(exec.agent?.session.header.cwd, rootOptions)
  const parentAgent: ParentAgentLookup = sessionId => ctx.get('agents')?.get(sessionId)
  const currentPreset: CurrentPermissionPreset = session => ctx.permissionPresets.current(session)
  const authorityFor = (exec: Readonly<ToolExecution>): ToolExecution['agent'] | undefined => autoPermissionAuthority(
    exec, parentAgent, currentPreset, presetName,
  )
  const isAutoExecution = (exec: Readonly<ToolExecution>): boolean => isAutoOrDelegatedPermissionExecution(
    exec, parentAgent, currentPreset, presetName,
  )
```

</details>

**依据 3 · 源码核查**：[src/index.ts:348-387](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L348-L387)

硬拒绝、扩权和常规分流

<details>
<summary>查看原文（40行）</summary>

```text
  ctx.tools.guard((exec) => isAutoExecution(exec) ? orphanDenial(exec) ?? hardDenyReason(exec, rootsFor(exec)) : undefined)
  ctx.on('tools/pre-execute', async (exec, next): Promise<PreToolDecision> => {
    if (!isAutoExecution(exec)) return next()
    const orphan = orphanDenial(exec)
    if (orphan !== undefined) return { kind: 'deny', reason: orphan }
    const roots = rootsFor(exec)
    const hard = hardDenyReason(exec, roots)
    if (hard !== undefined) return { kind: 'deny', reason: `[auto-mode hard deny] ${hard}` }
    const assessment = assessTool(exec, roots, artifacts)
    if (assessment.decision === 'deny') return { kind: 'deny', reason: `[auto-mode deterministic deny] ${assessment.reason}` }
    // A third-party patch tool has no audited official escalation seam.
    // Supplying sandbox fields must never turn its manual review into Auto.
    if (exec.name === 'apply_patch') return { kind: 'ask', reason: `[auto-mode approval required] ${assessment.reason}` }
    const sandbox = sandboxRequestState(exec.arguments)
    if (sandbox.kind === 'redundant-standing') {
      armRecoveryPresentation(exec)
      return { kind: 'deny', reason: AUTO_MODE_REDUNDANT_SANDBOX_REASON }
    }
    if (sandbox.kind === 'invalid') {
      return { kind: 'deny', reason: '[auto-mode invalid sandbox request] only an exact one-shot danger-full-access escalation is supported' }
    }
    const planArtifacts = () => {
      if (assessment.plannedCreates !== undefined) artifacts.plan(exec, assessment.plannedCreates, roots)
    }
    const widening = sandbox.kind === 'widening' ? sandbox.request : undefined
    if (widening !== undefined) {
      if (widening.justification.trim() === '') {
        return { kind: 'deny', reason: '[auto-mode invalid sandbox request] sandbox_permissions requires a non-empty justification' }
      }
      if (exec.agent?.session.header.origin === 'subagent' || authorityFor(exec) !== exec.agent) {
        return { kind: 'deny', reason: '[auto-mode delegated escalation denied] a subagent cannot widen the parent workspace sandbox; report the blocked action to the parent' }
      }
    } else if (assessment.decision === 'allow') {
      planArtifacts()
      artifacts.discoverShellCreates(exec, roots)
      return next()
    }
    if (widening === undefined && !assessment.classifierEligible) {
      return { kind: 'ask', reason: `[auto-mode approval required] ${assessment.reason}` }
    }
```

</details>

#### 缺口

- 未跑真实宿主工具和默认拒绝
  **影响**：无法确认各工具实际触发与减少的审批
  **进一步探讨**：在固定旧宿主用惰性工具对照手动模式

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分类器能改变哪些许可？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

扩权需要精确单次请求及非空理由，委派子代理不能扩大父沙箱。分类器允许时为扩权规划许可，实际由 approval 请求进入 grants 决定。可发出已处理的参数、用户消息、工作区路径及文件效果，路径不能安全披露则回手工。分类器失败通常拒绝，连续失败达到阈值时可提示手工。未命中风险规则的普通注册插件工具有允许分支，不能由此推断每个第三方工具的副作用受语义审查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:372-394](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L372-L394)

扩权和披露判据

<details>
<summary>查看原文（23行）</summary>

```text
    const widening = sandbox.kind === 'widening' ? sandbox.request : undefined
    if (widening !== undefined) {
      if (widening.justification.trim() === '') {
        return { kind: 'deny', reason: '[auto-mode invalid sandbox request] sandbox_permissions requires a non-empty justification' }
      }
      if (exec.agent?.session.header.origin === 'subagent' || authorityFor(exec) !== exec.agent) {
        return { kind: 'deny', reason: '[auto-mode delegated escalation denied] a subagent cannot widen the parent workspace sandbox; report the blocked action to the parent' }
      }
    } else if (assessment.decision === 'allow') {
      planArtifacts()
      artifacts.discoverShellCreates(exec, roots)
      return next()
    }
    if (widening === undefined && !assessment.classifierEligible) {
      return { kind: 'ask', reason: `[auto-mode approval required] ${assessment.reason}` }
    }
    const authority = authorityFor(exec)
    const failureOwner = authority?.session
    // Sanitization must cover metadata too. Redacted/truncated paths cannot
    // establish exact-target authority, so keep those calls local for review.
    if (sanitizeClassifierText(roots.workspace) !== roots.workspace
      || assessment.filesystemEffects?.some(effect => sanitizeClassifierText(effect.path) !== effect.path)) {
      return { kind: 'ask', reason: '[auto-mode approval required] the exact filesystem target cannot be safely disclosed to the classifier' }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:396-444](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L396-L444)

分类器入参、许可和失败

<details>
<summary>查看原文（49行）</summary>

```text
    try {
      const route = modelRoute(exec.agent) ?? modelRoute(authority)
      const decision = await classifier.classify({
        toolName: exec.name,
        arguments: sanitizeClassifierArguments(exec.arguments),
        workspaceRoot: roots.workspace,
        policyReason: sanitizeClassifierText(widening === undefined
          ? assessment.reason
          : `exact one-shot sandbox escalation requested; underlying action: ${assessment.reason}`),
        trustedUserMessages: trustedUserMessages(authority),
        ...(assessment.filesystemEffects === undefined ? {} : { filesystemEffects: assessment.filesystemEffects }),
        ...(widening === undefined ? {} : {
          sandboxRequest: {
            currentMode: 'workspace-write' as const,
            requestedMode: widening.requestedMode,
            justification: sanitizeClassifierText(widening.justification),
            platform: process.platform,
          },
        }),
        ...(route === undefined ? {} : { route }),
      }, exec.signal)
      if (failureOwner !== undefined) classifierFailures.delete(failureOwner)
      if (decision.decision === 'allow') {
        planArtifacts()
        if (widening !== undefined) grants.plan(exec, widening)
        else artifacts.discoverShellCreates(exec, roots)
        return next()
      }
      if (decision.decision === 'deny') return { kind: 'deny', reason: `[auto-mode classifier deny] ${decision.reason}` }
      // A sandbox escalation already owns one exact approval request inside
      // the official tool body. Let it ask there instead of producing two UI
      // prompts (one from tools/pre-execute and another from ctx.approval).
      if (widening !== undefined) {
        planArtifacts()
        return next()
      }
      return { kind: 'ask', reason: `[auto-mode classifier asks] ${decision.reason}` }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      if (!exec.signal.aborted && failureOwner !== undefined) {
        const failures = (classifierFailures.get(failureOwner) ?? 0) + 1
        if (failures >= 3) {
          classifierFailures.delete(failureOwner)
          return { kind: 'ask', reason: `[auto-mode classifier unavailable after ${failures} attempts; manual approval required] ${message}` }
        }
        classifierFailures.set(failureOwner, failures)
      }
      return { kind: 'deny', reason: `[auto-mode classifier unavailable; action denied] ${message}` }
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:454-457](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L454-L457)

宿主审批挂接

```text
  ctx.on('approval/request', (request, next) => {
    const outcome = grants.decide(request)
    return outcome === undefined ? next() : Promise.resolve(outcome)
  }, { prepend: true })
```

**依据 4 · 源码核查**：[src/policy.ts:332-345](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/policy.ts#L332-L345)

已知外部写及普通注册默认

<details>
<summary>查看原文（14行）</summary>

```text
  if (['web_search', 'web_fetch', 'time', 'weather'].includes(exec.name)) {
    return { decision: 'allow', reason: 'read-only external information lookup', classifierEligible: false }
  }
  if (['subagent', 'workflow', 'ralph', 'spawn_agent', 'send_message', 'wait_agent', 'list_agents', 'interrupt_agent', 'read_thread', 'wait_threads'].includes(exec.name)) {
    return { decision: 'allow', reason: 'orchestration call; child tool actions remain independently checked', classifierEligible: false }
  }
  if (['git_push', 'deploy', 'publish', 'send_email', 'create_issue', 'create_pull_request'].includes(exec.name)) {
    return { decision: 'ask', reason: `external write requires specific user authorization: ${exec.name}`, classifierEligible: true }
  }
  const riskyReason = riskyPluginToolReason(exec.name)
  if (riskyReason !== undefined) {
    return { decision: 'ask', reason: riskyReason, classifierEligible: true }
  }
  return { decision: 'allow', reason: `ordinary registered plugin tool: ${exec.name}`, classifierEligible: false }
```

</details>

#### 缺口

- 未核对真实分类器发送内容、批准和第三方工具隔离
  **影响**：不能建立部署安全保证
  **进一步探讨**：使用虚拟凭据和惰性工具验证披露、许可绑定与兜底

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何退出旧模式？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者声明 2026-09-29 结束维护，兼容表属于历史证据。已有安装应先切换到合适的手工宿主模式，再禁用或卸载，热重载失败则完整重启，并保留会话记录。插件会对特定旧 auto 会话追加新预设事件，不应手工改身份。分类器本身需要可用模型或端点，可能增加请求与等待。新采用面临无维护和权限变更风险。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-6](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/README.md#L1-L6)

停维和迁移步骤

```text
> [!WARNING]
> **Maintenance ended on 2026-09-29.** This repository is being archived. DeepSeek Harness now includes built-in Auto review; this plugin will receive no further fixes or host compatibility updates. Existing releases remain available for historical use.
>
> **Migration:** in a working session, select a built-in manual permission mode (for example, Workspace write) before disabling or uninstalling `@nanmicoder/dsh-auto-mode` in the application's plugin manager. If live reload fails, fully quit and reopen Harness. Start a new session and select the built-in mode you intend to use. Preserve old sessions; do not rewrite their permission identities or delete their logs.
>
> **The policies are not equivalent:** this plugin defaults to `workspace-write` sandboxing. In the audited Harness 0.2.0-rc.2 implementation, built-in Auto review uses `danger-full-access`. Review the current official permission description before enabling it. See the [official Harness source](https://github.com/deepseek-ai/deepseek-harness). The installation and compatibility details below are historical, not ongoing support promises.
```

**依据 2 · 作者声明**：[README.md:26-35](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/README.md#L26-L35)

历史兼容声明

<details>
<summary>查看原文（10行）</summary>

```text
> [!IMPORTANT]
> Plugin **0.2.0** is the stable npm `latest` release for the official Harness **0.2.0-rc.2** release (`dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`). Plugin and host version numbers are independent. Harness itself still labels this release RC; install the exact supported host rather than assuming its npm `latest` points to it.

| Harness host | Plugin support |
| --- | --- |
| `0.2.0-rc.2` | Recommended for plugin `0.2.0` |
| `0.1.7-rc.2`, `0.1.5-rc.2`, `0.1.5-rc.1`, `0.1.2-rc.1`, `0.1.2-alpha.5`, `0.1.2-alpha.3`, `0.1.2-alpha.2` | Retained exact compatibility; product-entry matrix required for release |
| Other unlisted hosts, including `0.2.0-rc.1` and `0.1.6-alpha.*` | Not declared supported |

See [compatibility.json](./compatibility.json), [release acceptance](./validation/0.2.0), and [the release adaptation record](./docs/harness-020-rc2.md). Historical preview evidence remains in [desktop preparation](./docs/desktop-020-preparation.md).
```

</details>

**依据 3 · 源码核查**：[src/index.ts:280-289](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L280-L289)

历史会话迁移接线

<details>
<summary>查看原文（10行）</summary>

```text
  // Prepend before the permission owner's restore admission; appended identity
  // uses the normal Session publication/persistence path, never edits old rows.
  const target = ctx.permissionPresets.resolve(presetName)
  if (target.sandbox !== 'workspace-write' || target.approval !== 'ask') {
    throw new Error('Auto Mode requires a workspace-write + ask permission preset')
  }
  ctx.inject(['sessions'], scope => {
    scope.on('session/created', session => { migrateLegacyAutoSession(session, presetName) }, { prepend: true })
    for (const session of scope.sessions.list()) migrateLegacyAutoSession(session, presetName)
  })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:167-194](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L167-L194)

分类器配置约束

<details>
<summary>查看原文（28行）</summary>

```text
function classifierFrom(ctx: Context, config: Config): SafetyClassifier {
  const timeoutMs = config.classifierTimeoutMs ?? 30_000
  if (!Number.isFinite(timeoutMs) || timeoutMs < 100 || timeoutMs > 60_000) {
    throw new Error('classifierTimeoutMs must be between 100 and 60000')
  }
  const maxOutputTokens = config.classifierMaxOutputTokens ?? 1_024
  if (!Number.isInteger(maxOutputTokens) || maxOutputTokens < 64 || maxOutputTokens > 4_096) {
    throw new Error('classifierMaxOutputTokens must be an integer between 64 and 4096')
  }
  if (config.classifierEndpoint === undefined || config.classifierEndpoint.trim() === '') {
    return createDshClassifier(ctx.llm, {
      timeoutMs,
      maxOutputTokens,
      ...(config.classifierProvider === undefined ? {} : { provider: config.classifierProvider }),
      ...(config.classifierModel === undefined ? {} : { model: config.classifierModel }),
    })
  }
  const endpoint = new URL(config.classifierEndpoint)
  const loopback = ['localhost', '127.0.0.1', '::1'].includes(endpoint.hostname)
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && loopback)) {
    throw new Error('classifierEndpoint must use HTTPS (HTTP is accepted only for a loopback test service)')
  }
  const envName = config.classifierApiKeyEnv ?? 'DEEPSEEK_API_KEY'
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(envName)) throw new Error('classifierApiKeyEnv must be an environment-variable name')
  const apiKey = process.env[envName]
  return createHttpClassifier({
    endpoint: endpoint.href,
    model: config.classifierModel ?? 'deepseek-chat',
```

</details>

#### 缺口

- 未验证迁移与目标宿主的可用手工模式
  **影响**：无法给出真实切换兼容或用量成本
  **进一步探讨**：在独立旧宿主配置保留日志并演练切换、禁用、恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样核对非标准工具风险？

**研究主题**：新假设与验证

#### 完整回答

对当前按名称和类别推断的策略，可在未知第三方工具进入时要求可信副作用声明，缺失时显示手工审查原因。用恶意仿普通名称、惰性工具和宿主内置动作对照，测错误放行和审批负担。若误放未减或常用无害工具审批显著增加，就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/policy.ts:332-345](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/policy.ts#L332-L345)

当前分类与默认允许

<details>
<summary>查看原文（14行）</summary>

```text
  if (['web_search', 'web_fetch', 'time', 'weather'].includes(exec.name)) {
    return { decision: 'allow', reason: 'read-only external information lookup', classifierEligible: false }
  }
  if (['subagent', 'workflow', 'ralph', 'spawn_agent', 'send_message', 'wait_agent', 'list_agents', 'interrupt_agent', 'read_thread', 'wait_threads'].includes(exec.name)) {
    return { decision: 'allow', reason: 'orchestration call; child tool actions remain independently checked', classifierEligible: false }
  }
  if (['git_push', 'deploy', 'publish', 'send_email', 'create_issue', 'create_pull_request'].includes(exec.name)) {
    return { decision: 'ask', reason: `external write requires specific user authorization: ${exec.name}`, classifierEligible: true }
  }
  const riskyReason = riskyPluginToolReason(exec.name)
  if (riskyReason !== undefined) {
    return { decision: 'ask', reason: riskyReason, classifierEligible: true }
  }
  return { decision: 'allow', reason: `ordinary registered plugin tool: ${exec.name}`, classifierEligible: false }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:348-387](https://github.com/NanmiCoder/dsh-auto-mode/blob/907d663b7d65e3fcd9f328c598dee03772cac18b/src/index.ts#L348-L387)

允许与确认的入口

<details>
<summary>查看原文（40行）</summary>

```text
  ctx.tools.guard((exec) => isAutoExecution(exec) ? orphanDenial(exec) ?? hardDenyReason(exec, rootsFor(exec)) : undefined)
  ctx.on('tools/pre-execute', async (exec, next): Promise<PreToolDecision> => {
    if (!isAutoExecution(exec)) return next()
    const orphan = orphanDenial(exec)
    if (orphan !== undefined) return { kind: 'deny', reason: orphan }
    const roots = rootsFor(exec)
    const hard = hardDenyReason(exec, roots)
    if (hard !== undefined) return { kind: 'deny', reason: `[auto-mode hard deny] ${hard}` }
    const assessment = assessTool(exec, roots, artifacts)
    if (assessment.decision === 'deny') return { kind: 'deny', reason: `[auto-mode deterministic deny] ${assessment.reason}` }
    // A third-party patch tool has no audited official escalation seam.
    // Supplying sandbox fields must never turn its manual review into Auto.
    if (exec.name === 'apply_patch') return { kind: 'ask', reason: `[auto-mode approval required] ${assessment.reason}` }
    const sandbox = sandboxRequestState(exec.arguments)
    if (sandbox.kind === 'redundant-standing') {
      armRecoveryPresentation(exec)
      return { kind: 'deny', reason: AUTO_MODE_REDUNDANT_SANDBOX_REASON }
    }
    if (sandbox.kind === 'invalid') {
      return { kind: 'deny', reason: '[auto-mode invalid sandbox request] only an exact one-shot danger-full-access escalation is supported' }
    }
    const planArtifacts = () => {
      if (assessment.plannedCreates !== undefined) artifacts.plan(exec, assessment.plannedCreates, roots)
    }
    const widening = sandbox.kind === 'widening' ? sandbox.request : undefined
    if (widening !== undefined) {
      if (widening.justification.trim() === '') {
        return { kind: 'deny', reason: '[auto-mode invalid sandbox request] sandbox_permissions requires a non-empty justification' }
      }
      if (exec.agent?.session.header.origin === 'subagent' || authorityFor(exec) !== exec.agent) {
        return { kind: 'deny', reason: '[auto-mode delegated escalation denied] a subagent cannot widen the parent workspace sandbox; report the blocked action to the parent' }
      }
    } else if (assessment.decision === 'allow') {
      planArtifacts()
      artifacts.discoverShellCreates(exec, roots)
      return next()
    }
    if (widening === undefined && !assessment.classifierEligible) {
      return { kind: 'ask', reason: `[auto-mode approval required] ${assessment.reason}` }
    }
```

</details>

#### 缺口

- 没有实际工具行为对照
  **影响**：不能评估声明可信性与阻断代价
  **进一步探讨**：先做惰性模拟并收集误判

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
