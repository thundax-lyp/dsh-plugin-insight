# dsh-sandbox-escalation-fix

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8760b89](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/tree/8760b89076b45ea3f60e3c6a598f91e59a1f7387)

<!-- BEGIN META -->
[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix) [![npm 30d 341](https://img.shields.io/static/v1?label=npm+30d&message=341&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sandbox-escalation-fix) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sandbox-escalation-fix)
<!-- END META -->

> **功能**：按 DSH 会话沙箱和审批策略调整工具升级参数、归一无效请求并过滤不适用提示。

> **亮点**：会话级schema/参数/提示一致性修复，保留原delegate；不增加权限或替代沙箱。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：官方已缓解使必要性待测，补丁又依赖具体工具契约；运行中不兼容可仅日志停包装，启动成功不证所有目标持续生效。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 插件怎样按会话权限投影升级参数，真正执行由谁负责？](#detail-section-11)
  - [Q02 · 审批、失败提示、工具变更和卸载边界是否明确？](#detail-section-12)
  - [Q03 · 官方已改善后还有何增量，采用负担由谁承担？](#detail-section-13)
  - [Q04 · 当前谁值得采用，怎样判断是否应继续维护？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：受支持旧DSH上第三方模型反复发送无效升级参数时的局部修复。见 [Q01](#research-q01)。

官方工具据报错纠正参数，尤其作者说明0.1.6-alpha.2已缓解；未测当前残余频率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| schema投影 | 只显示可升级目标 | 依赖当前policy/approval |
| 参数归一 | 去同级/多余文件升级 | 原工具仍决定执行 |
| 提示过滤 | 去不可行升级建议 | 保留错误，非放行 |
| 协作wrapper | 与原delegate共存 | 契约不符拒绝/停包装 |
| 生命周期 | 跟工具/preset与卸载 | 清理失败有日志 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 明确支持的DSH契约 | 必需 | 包装原工具 | 最新白名单0.1.6-alpha.2，混版/不兼容拒绝 |
| agents/tools/sandboxPolicy/approval | 必需 | 会话策略与执行 | 无法完整接线 |
| Node ^22.19或>=24 | 必需 | Host运行 | 不在声明环境 |
| 可复现原生残余错误 | 采用前提 | 证明补丁必要性 | 原生已够就不增加包装 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 原生对照 | 用户记录Host/模型/权限与错误 | 先判断是否需补丁 |
| 加载 | 兼容门与Supervisor装wrapper | 核目标实际状态非启动日志 |
| 调用 | 模型schema→归一→原delegate | 正常调用与应拒绝都核 |
| 退出 | 停插件回官方工具 | 冲突/不兼容不扩大权限 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型测试费用未知 | 版本/原生错误核验 | 先官方对照 |
| 持续使用 | 重试token变化未知 | 跟Host契约/日志 | 未测净收益 |
| 失败恢复 | 无效调用未知 | 冲突与动态工具排错 | 停用回原生 |
| 退出 | 既有副作用保留 | 卸载自身layer | 不回滚已执行命令 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 参数一致 | 每会话schema与归一 | 残余错误减少幅度 |
| 权限保持 | 委派原工具/策略 | 全部宿主组合一致性 |
| 动态适配 | 监听preset/tools变化 | 不兼容仅日志时体验 |
| 总收益 | 避免无效升级的机制 | 费用/时延/维护优于原生 |

> **思考**：官方已缓解使必要性待测，补丁又依赖具体工具契约；运行中不兼容可仅日志停包装，启动成功不证所有目标持续生效。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：会话级schema/参数/提示一致性修复，保留原delegate；不增加权限或替代沙箱。见 [Q01](#research-q01)、[Q03](#research-q03)。

动态会话投影、委托保留timeout及协作layer可借鉴；版本失败与运行期停包装要分清。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

官方已缓解使必要性待测，补丁又依赖具体工具契约；运行中不兼容可仅日志停包装，启动成功不证所有目标持续生效。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先测官方是否仍反复失败，再隔离profile核正常/越界/升级矩阵；不兼容或冲突就回原生。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码修复机制已核；原生残余问题、兼容效果及未来宿主方案未实测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/argument-normalization.ts、src/compatibility.ts、src/index.ts、src/policy.ts、src/schema-projection.ts、src/supervisor.ts、src/wrapper.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查Host/兼容门、policy、schema、参数路径归一、Supervisor动态/退出、wrapper委派及结果过滤。未全审原生工具、全部PTC/其他插件组合，未执行目标。
- 下一步：固定支持Host以同一模型对比原生/插件的权限矩阵、无效请求、正确拒绝和总成本；未来原生方案另测，未执行。

**分析版本**

- **仓库**：[HakureiMonika/dsh-sandbox-escalation-fix](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix)
- **版本号**：0.1.6-alpha2-win-linux（[固定提交 8760b89](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/tree/8760b89076b45ea3f60e3c6a598f91e59a1f7387)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把会话权限投影与执行回执迁入原生宿主，比较无效调用和错误放行；官方已等效或陈旧schema更差即推翻。见 [Q04](#research-q04)。

固定支持Host以同一模型对比原生/插件的权限矩阵、无效请求、正确拒绝和总成本；未来原生方案另测，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 676 | 644 | 33 | — |
| .md | source | 4 | 1433 | — | — | 15313 |
| .ts | source | 12 | 945 | 852 | 14 | — |
| .ts | test | 3 | 1046 | 947 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话参数修复怎样减少无效升级且保留原生执行和拒绝边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件怎样按会话权限投影升级参数，真正执行由谁负责？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它针对第三方模型在已有足够权限时仍发送不合适sandbox_permissions/justification、导致工具反复报错的局部兼容问题。原办法是让模型按原生错误修正参数，或升级官方版本；合格结果是同一权限下减少无效升级请求，而不是让原本禁止的操作直接成功。

入口先验证DSH兼容，再启动Supervisor。它监听现有/新Agent、preset切换和工具变化，为bash/pwsh/write/edit取得当前可见delegate，在Agent子上下文注册包装，或通过协作wrapper协议贡献自身layer。参数getter按当前会话sandboxPolicy和approval读可行更宽模式；approval=never或已经全访问则删除升级字段，否则只展示更宽目标。

执行layer重新读实际callAgent策略，归一无意义同级升级；workspace-write下write/edit的目标路径经词法及真实路径检查仍在工作区时，可去掉不必要的全访问请求。然后调用原delegate.execute，仍让原工具执行文件/命令、沙箱和审批逻辑。包装保留timeout、输出/呈现等钩子，而非另造工具执行器。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-37](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/index.ts#L18-L37)

真实启动与硬依赖。

<details>
<summary>查看原文（20行）</summary>

```text
export const name = 'sandbox-escalation-fix'
export const inject = ['agents', 'tools', 'sandboxPolicy', 'approval']

export function startPlugin(
  ctx: Context,
  config: Config = {},
  compatibility: DshRuntimeCompatibility = validateDshRuntime(),
): void {
  if (compatibility.mode === 'structural') {
    ctx.logger.warn('dsh-sandbox-escalation-fix: DSH package manifests are hidden by the host; using strict runtime tool-contract validation')
  }
  const supervisor = new Supervisor(ctx)
  ctx.effect(() => supervisor.start(), 'sandbox-escalation-fix.lifecycle()')
  if ((config.logLevel ?? 'info') !== 'silent') {
    ctx.logger.info('sandbox-escalation-fix: session-aware tool wrappers enabled')
  }
}

export function apply(ctx: Context, config: Config = {}): void {
  startPlugin(ctx, config)
```

</details>

**依据 2 · 源码核查**：[src/policy.ts:14-30](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/policy.ts#L14-L30)

更宽模式与approval策略。

<details>
<summary>查看原文（17行）</summary>

```text
  effectiveMode: SandboxMode,
  approvalPolicy: ApprovalPolicy,
): readonly SandboxMode[] {
  return approvalPolicy === 'never' ? [] : WIDER_MODES[effectiveMode] ?? []
}

export function escalationPolicyFor(ctx: Context, agent: Agent): EscalationPolicyView {
  const effectiveMode = ctx.sandboxPolicy.resolve({ session: agent.session }).mode
  const approvalPolicy = ctx.approval.overrideOf(agent.session)
    ?? ctx.approval.config.policy
    ?? 'ask'
  return {
    effectiveMode,
    approvalPolicy,
    viableTargets: viableEscalationTargets(effectiveMode, approvalPolicy),
  }
}
```

</details>

**依据 3 · 源码核查**：[src/schema-projection.ts:13-52](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/schema-projection.ts#L13-L52)

按目标投影参数。

<details>
<summary>查看原文（40行）</summary>

```text
export function projectEscalationParameters(
  parameters: Record<string, unknown>,
  targets: readonly SandboxMode[],
): Record<string, unknown> {
  const projected = structuredClone(parameters)
  const root = objectRecord(projected, 'tool parameters')
  if (root.type !== 'object') {
    throw new Error('dsh-sandbox-escalation-fix: tool parameters root must have type "object"')
  }
  const properties = objectRecord(root.properties, 'tool parameters.properties')
  const permissions = properties[SANDBOX_PERMISSIONS]
  const justification = properties[JUSTIFICATION]
  if (permissions === undefined && justification === undefined) return projected
  if (permissions === undefined || justification === undefined) {
    throw new Error('dsh-sandbox-escalation-fix: escalation schema must declare sandbox_permissions and justification together')
  }
  const permissionsSchema = objectRecord(permissions, 'sandbox_permissions schema')
  const justificationSchema = objectRecord(justification, 'justification schema')
  if (permissionsSchema.type !== 'string' || !Array.isArray(permissionsSchema.enum)
    || !permissionsSchema.enum.every(value => typeof value === 'string')) {
    throw new Error('dsh-sandbox-escalation-fix: sandbox_permissions must be a string enum')
  }
  if (justificationSchema.type !== 'string') {
    throw new Error('dsh-sandbox-escalation-fix: justification must be a string')
  }
  if (targets.length === 0) {
    delete properties[SANDBOX_PERMISSIONS]
    delete properties[JUSTIFICATION]
    if (Array.isArray(root.required)) {
      const required = root.required.filter(
        value => value !== SANDBOX_PERMISSIONS && value !== JUSTIFICATION,
      )
      if (required.length === 0) delete root.required
      else root.required = required
    }
    return projected
  }
  permissionsSchema.enum = [...targets]
  return projected
}
```

</details>

**依据 4 · 源码核查**：[src/supervisor.ts:50-69](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L50-L69)

执行时再读策略后委派。

<details>
<summary>查看原文（20行）</summary>

```text
function ownLayer(ctx: Context, agent: Agent, toolName: TargetToolName): WrapperLayer {
  return {
    owner: PLUGIN_OWNER,
    priority: 100,
    projectDescription(value: string): string {
      const policy = escalationPolicyFor(ctx, agent)
      return projectEscalationDescription(value, policy.viableTargets.length > 0)
    },
    projectParameters(value: Record<string, unknown>): Record<string, unknown> {
      return projectEscalationParameters(value, escalationPolicyFor(ctx, agent).viableTargets)
    },
    execute(args: unknown, exec: Parameters<ToolDefinition['execute']>[1], next: (args: unknown) => Promise<unknown>): Promise<unknown> {
      const callAgent = exec.agent ?? agent
      const policy = ctx.sandboxPolicy.resolve({ session: callAgent.session })
      return next(normalizeEscalationArguments(args, policy.mode, {
        toolName,
        workspaceRoot: policy.workspaceRoot,
      }))
    },
  }
```

</details>

**依据 5 · 源码核查**：[src/supervisor.ts:256-290](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L256-L290)

Agent局部或协作包装。

<details>
<summary>查看原文（35行）</summary>

```text
  private reconcileTarget(agent: Agent, target: TargetState): void {
    this.detachTarget(target)
    const delegate = visibleDelegate(this.ctx, agent, target.name)
    if (delegate === undefined) {
      delete target.lastReportedError
      return
    }
    try {
      validateTargetTool(delegate)
      const protocol = protocolOf(delegate)
      if (protocol !== undefined) {
        target.attachment = {
          kind: 'cooperative',
          release: protocol.contribute(ownLayer(this.ctx, agent, target.name)),
        }
      } else {
        const binding = target.binding
          ?? createWrapperBinding(delegate, ownLayer(this.ctx, agent, target.name))
        if (target.binding === undefined) {
          target.binding = binding
        } else {
          binding.updateDelegate(delegate)
        }
        const registrationCtx = agent.ctx.extend({ fiber: this.ctx.fiber })
        target.attachment = {
          kind: 'owned',
          unregister: this.mutateTools(
            () => registrationCtx.tools.register(binding.definition),
          ),
        }
      }
      delete target.lastReportedError
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      target.attachment = { kind: 'incompatible', reason }
```

</details>

**依据 6 · 源码核查**：[src/argument-normalization.ts:60-73](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/argument-normalization.ts#L60-L73)

同级及工作区文件归一。

<details>
<summary>查看原文（14行）</summary>

```text
  if (!Object.hasOwn(record, 'sandbox_permissions') || !Object.hasOwn(record, 'justification')) {
    return args
  }
  if (record.sandbox_permissions === effectiveMode) return withoutEscalation(record)
  if (
    effectiveMode === 'workspace-write'
    && record.sandbox_permissions === 'danger-full-access'
    && (context.toolName === 'write' || context.toolName === 'edit')
    && isWorkspaceFilePath(record.file_path, context.workspaceRoot)
  ) {
    return withoutEscalation(record)
  }
  return args
}
```

</details>

**依据 7 · 源码核查**：[src/wrapper.ts:51-73](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/wrapper.ts#L51-L73)

最终执行原delegate及next一次约束。

<details>
<summary>查看原文（23行）</summary>

```text
    },
    execute(args: unknown, exec: ToolRunContext): Promise<unknown> {
      const currentDelegate = delegate()
      const active = sortedLayers(layers).filter(
        (layer): layer is WrapperLayer & Required<Pick<WrapperLayer, 'execute'>> => layer.execute !== undefined,
      )
      const dispatch = (index: number, current: unknown): Promise<unknown> => {
        const layer = active[index]
        if (layer === undefined) {
          return Reflect.apply(currentDelegate.execute, currentDelegate, [current, exec]) as Promise<unknown>
        }
        let called = false
        return layer.execute(current, exec, (nextArgs) => {
          if (called) throw new Error(`dsh-sandbox-escalation-fix: wrapper "${layer.owner}" called next() more than once`)
          called = true
          return dispatch(index + 1, nextArgs)
        })
      }
      return dispatch(0, args)
    },
    [TOOL_WRAPPER_PROTOCOL]: {
      version: 1,
      owner: PLUGIN_OWNER,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批、失败提示、工具变更和卸载边界是否明确？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本插件不授予新权限；它移除无效升级参数并收窄广告面，真正严格扩大与审批仍依赖原工具/宿主。路径归一只限write/edit且目标在工作区的既存真实祖先内，不替代原生文件检查；检查与实际执行之间仍由原工具承担路径竞争防护。不能把删除参数等同于所有请求无需批准。

结果过滤有明确影响：无可行升级目标时，FS_SANDBOX_DENIED错误只去掉不适用升级提示，保留isError；命令/job_output结果也可能去掉升级提示。若其他插件已经改写同一结果，会block要求停用冲突插件，而非悄悄双重改写。用户排障时因此要区分原生错误、过滤后的提示和结果重写冲突，不能据“提示没了”断言命令被允许。

兼容门检查同一候选root的完整包版本，混版/部分可读/不支持版本拒绝；所有manifest都隐藏才转结构校验。工具参数/输出不符不会猜着包装。初始化严格失败回滚自身状态；运行中工具变更的非严格reconcile失败则记日志并将该目标标incompatible，不能把“wrappers enabled”启动日志当每个工具始终已保护。卸载解除监听和自身layer，清理失败会警告，不声称所有冲突环境恢复已实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/argument-normalization.ts:22-57](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/argument-normalization.ts#L22-L57)

真实祖先与工作区检查。

<details>
<summary>查看原文（36行）</summary>

```text

function nearestExistingPath(path: string): string | undefined {
  let current = path
  while (true) {
    try {
      return realpathSync.native(current)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && code !== 'ENOTDIR') return undefined
      const parent = dirname(current)
      if (parent === current) return undefined
      current = parent
    }
  }
}

function isWorkspaceFilePath(filePath: unknown, workspaceRoot: string | undefined): boolean {
  if (typeof filePath !== 'string' || filePath.trim().length === 0 || workspaceRoot === undefined) return false
  const resolvedRoot = resolve(workspaceRoot)
  const target = resolve(resolvedRoot, filePath)
  if (!isWithin(resolvedRoot, target)) return false
  let canonicalRoot: string
  try {
    canonicalRoot = realpathSync.native(resolvedRoot)
  } catch {
    return false
  }
  const canonicalTarget = nearestExistingPath(target)
  return canonicalTarget !== undefined && isWithin(canonicalRoot, canonicalTarget)
}

export function normalizeEscalationArguments(
  args: unknown,
  effectiveMode: SandboxMode,
  context: EscalationNormalizationContext = {},
): unknown {
```

</details>

**依据 2 · 源码核查**：[src/supervisor.ts:72-119](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L72-L119)

错误仍是错误、结果冲突block。

<details>
<summary>查看原文（48行）</summary>

```text
function rewriteFsFailure(
  ctx: Context,
  agent: Agent,
  result: ToolExecutionResult,
): ToolExecutionResult {
  if (!result.isError || result.error.info?.code !== 'FS_SANDBOX_DENIED') return result
  const policy = escalationPolicyFor(ctx, agent)
  if (policy.viableTargets.length > 0) return result
  const denial = sandboxDenialMarker(policy.effectiveMode)
  const hint = escalationHintMarker('operation')
  const message = removeEscalationHint(result.error.message, denial, hint)
  if (message === result.error.message) return result
  return {
    ...result,
    error: { ...result.error, message },
    content: [{ type: 'text', text: `Error: ${message}` }],
  }
}

function rewriteSuccessfulDecision(
  ctx: Context,
  agent: Agent,
  name: string,
  result: ToolExecutionResult,
  decision: PostToolDecision,
): PostToolDecision {
  if (decision.kind === 'block' || result.isError) return decision
  const policy = escalationPolicyFor(ctx, agent)
  if (policy.viableTargets.length > 0) return decision
  const denial = sandboxDenialMarker(policy.effectiveMode)
  const hint = escalationHintMarker('command')
  if (name === 'job_output') {
    if (Object.hasOwn(decision, 'value') || decision.content !== undefined) {
      return {
        kind: 'block',
        feedback: [{ type: 'text', text: 'Conflicting plugins both attempted to rewrite job_output. Disable one result-rewriting plugin.' }],
      }
    }
    const value = result.value as unknown
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return decision
    const record = value as Record<string, unknown>
    if (typeof record.text !== 'string') return decision
    const text = removeEscalationHint(record.text, denial, hint)
    return text === record.text ? decision : { kind: 'accept', value: { ...record, text } }
  }
  if (name !== 'bash' && name !== 'pwsh') return decision
  if (Object.hasOwn(decision, 'value')) {
    return {
```

</details>

**依据 3 · 源码核查**：[src/compatibility.ts:63-116](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/compatibility.ts#L63-L116)

版本与结构模式的拒绝边界。

<details>
<summary>查看原文（54行）</summary>

```text
  versions: Readonly<Record<string, string>>,
): void {
  const unique = new Set(Object.values(versions))
  if (unique.size !== 1) {
    const detail = Object.entries(versions)
      .map(([name, version]) => `${name}@${version}`)
      .join(', ')
    throw new Error(`dsh-sandbox-escalation-fix: mixed DSH package versions are unsupported: ${detail}`)
  }
  const version = unique.values().next().value
  if (version === undefined || !SUPPORTED_DSH_VERSIONS.includes(version as typeof SUPPORTED_DSH_VERSIONS[number])) {
    throw new Error(`dsh-sandbox-escalation-fix: unsupported DSH version "${version ?? 'unknown'}"; supported versions: ${SUPPORTED_DSH_VERSIONS.join(', ')}`)
  }
}

export function validateDshRuntimeFromSources(
  sources: readonly ManifestSource[],
): DshRuntimeCompatibility {
  for (const source of sources) {
    const versions: Record<string, string> = {}
    const unavailablePackages: string[] = []

    for (const name of DSH_PACKAGES) {
      let manifest: unknown
      try {
        manifest = source.read(name)
      } catch (error) {
        if (isMissingModuleError(error)) {
          unavailablePackages.push(name)
          continue
        }
        throw new Error(`dsh-sandbox-escalation-fix: cannot read ${name}/package.json from ${source.label}`, { cause: error })
      }
      if (typeof manifest !== 'object' || manifest === null
        || !('version' in manifest) || typeof manifest.version !== 'string') {
        throw new Error(`dsh-sandbox-escalation-fix: ${name}/package.json has no string version at ${source.label}`)
      }
      versions[name] = manifest.version
    }

    if (unavailablePackages.length === 0) {
      validateDshVersionSet(versions)
      return { mode: 'versioned', unavailablePackages }
    }

    // 同一解析根只出现部分 DSH 包，说明静态 import 可能已经从该根加载了部分运行时。
    // 此时继续尝试后续根会掩盖双运行时或跨目录混装，因此必须立即拒绝启动。
    if (unavailablePackages.length < DSH_PACKAGES.length) {
      throw new Error(`dsh-sandbox-escalation-fix: only some DSH package manifests are readable from ${source.label}; unavailable packages: ${unavailablePackages.join(', ')}`)
    }
  }

  // 所有候选根都完全看不到清单时，保留 Desktop 2.0.3 所需的严格结构校验回退。
  return { mode: 'structural', unavailablePackages: [...DSH_PACKAGES] }
```

</details>

**依据 4 · 源码核查**：[src/supervisor.ts:184-217](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L184-L217)

初始化回滚。

<details>
<summary>查看原文（34行）</summary>

```text
  private install(agent: Agent): void {
    if (this.states.has(agent)) return
    const targets = new Map<TargetToolName, TargetState>(
      TARGET_TOOLS.map(name => [name, {
        name,
        attachment: { kind: 'dormant' },
      }]),
    )
    const disposers: Array<() => unknown> = []
    const state: AgentState = {
      agent,
      targets,
      disposers,
      disposed: false,
    }
    this.states.set(agent, state)
    try {
      this.coordinate(() => this.reconcileState(state, true))
      disposers.push(this.ctx.on('tools/execute', async (exec, next): Promise<ToolExecutionResult> => {
        const result = await next()
        return exec.agent === agent && (exec.name === 'write' || exec.name === 'edit')
          ? rewriteFsFailure(this.ctx, agent, result)
          : result
      }, { prepend: true }))
      disposers.push(this.ctx.on('tools/post-execute', async (exec, result, next): Promise<PostToolDecision> => {
        const decision = await next()
        return exec.agent === agent
          ? rewriteSuccessfulDecision(this.ctx, agent, exec.name, result, decision)
          : decision
      }, { prepend: true }))
    } catch (error) {
      this.states.delete(agent)
      this.coordinate(() => this.disposeState(state))
      throw error
```

</details>

**依据 5 · 源码核查**：[src/supervisor.ts:244-290](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L244-L290)

运行期失败记日志/标记不兼容。

<details>
<summary>查看原文（47行）</summary>

```text
  private reconcileState(state: AgentState, strict: boolean): void {
    if (state.disposed) return
    for (const target of state.targets.values()) {
      try {
        this.reconcileTarget(state.agent, target)
      } catch (error) {
        if (strict) throw error
        this.reportFailure(state.agent, target, error)
      }
    }
  }

  private reconcileTarget(agent: Agent, target: TargetState): void {
    this.detachTarget(target)
    const delegate = visibleDelegate(this.ctx, agent, target.name)
    if (delegate === undefined) {
      delete target.lastReportedError
      return
    }
    try {
      validateTargetTool(delegate)
      const protocol = protocolOf(delegate)
      if (protocol !== undefined) {
        target.attachment = {
          kind: 'cooperative',
          release: protocol.contribute(ownLayer(this.ctx, agent, target.name)),
        }
      } else {
        const binding = target.binding
          ?? createWrapperBinding(delegate, ownLayer(this.ctx, agent, target.name))
        if (target.binding === undefined) {
          target.binding = binding
        } else {
          binding.updateDelegate(delegate)
        }
        const registrationCtx = agent.ctx.extend({ fiber: this.ctx.fiber })
        target.attachment = {
          kind: 'owned',
          unregister: this.mutateTools(
            () => registrationCtx.tools.register(binding.definition),
          ),
        }
      }
      delete target.lastReportedError
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      target.attachment = { kind: 'incompatible', reason }
```

</details>

**依据 6 · 源码核查**：[src/supervisor.ts:139-181](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L139-L181)

生命周期解除与警告。

<details>
<summary>查看原文（43行）</summary>

```text
  start(): () => Promise<void> {
    const stopCreated = this.ctx.on('agent/created', ({ agent }) => {
      this.install(agent)
    })
    const stopDisposed = this.ctx.on('agent/disposed', ({ agent }) => {
      try {
        this.remove(agent)
      } catch (error) {
        this.ctx.logger.warn(`dsh-sandbox-escalation-fix: agent "${agent.id}" cleanup failed: ${String(error)}`)
      }
    })
    const stopPreset = this.ctx.on('agent-preset/selected', (sessionId) => {
      const agent = this.ctx.agents.get(sessionId)
      if (agent !== undefined) this.reconcileAgent(agent)
    })
    const stopTools = this.ctx.on('tools/change', () => {
      if (this.expectedToolChanges > 0) {
        this.expectedToolChanges -= 1
        return
      }
      if (this.reconciling > 0) {
        this.reconcilePending = true
        return
      }
      this.reconcileAll()
    })
    for (const agent of this.ctx.agents.list()) this.install(agent)
    return () => {
      stopTools()
      stopPreset()
      stopDisposed()
      stopCreated()
      const states = [...this.states.values()]
      this.states.clear()
      for (const state of states) {
        try {
          this.coordinate(() => this.disposeState(state))
        } catch (error) {
          this.ctx.logger.warn(`dsh-sandbox-escalation-fix: agent "${state.agent.id}" cleanup failed: ${String(error)}`)
        }
      }
      return Promise.resolve()
    }
```

</details>

#### 缺口

- 未核固定宿主全部原工具路径竞争/审批实现，也未验证其他wrapper组合与卸载。
  **影响**：不能承诺所有权限行为不变或所有动态工具持续兼容。
  **进一步探讨**：固定支持宿主对同级、真正升级、越界、preset切换及冲突插件做参数/审批对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 官方已改善后还有何增量，采用负担由谁承担？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

作者README自己说明0.1.6-alpha.2已显著缓解，模型通常能据错误调整，建议先尝试官方行为；因此不能把旧错误示例当所有现版用户必需安装的证据。可归因增量是按会话政策改变广告schema、执行前归一和无效提示过滤，减少特定旧兼容路径的误导。它不实现更强沙箱，不代表关掉隔离，也没有测出当前残余重试频率。

硬依赖agents/tools/sandboxPolicy/approval和相应DSH工具契约；源码白名单最新0.1.6-alpha.2，包要求Node ^22.19或>=24。结构模式只是manifest不可见时用工具形状核验，不是任意新DSH版本通行证。已有其他工具包装/结果重写插件会增加组合负担。

首次应记录真实Host版本、原生错误和权限模式，持续要跟官方升级、检查包装日志及重复调用。现金方面可能少失败模型调用但总token/时延/修复工时未知；参数纠正属于同一执行资源的效率便利，相对原生修正未识别资源池化、计价或服务模式结构变化，不作为经济创新。恢复时先停插件回原生工具，保留报错与模型请求；卸载不回滚此前工具副作用。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-18](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/README.md#L5-L18)

官方缓解及先用原生的作者边界。

<details>
<summary>查看原文（14行）</summary>

```text
> [!IMPORTANT]
> This is an independent community plugin. It is not published, maintained, or endorsed by DeepSeek, and it does not modify DeepSeek Harness core packages.

> [!CAUTION]
> DSH `0.1.6-alpha.2` has significantly mitigated the issue addressed by this plugin. In testing, a model may still fail its first tool call because of unsuitable sandbox-escalation arguments, but it will usually adjust those arguments after receiving the error and eventually complete the call successfully. Escalation schemas remain registry-global and are still not narrowed according to each Session's current permissions, so the underlying cause has not been fully removed. However, users who can tolerate a small number of retries and some additional token usage may now find the official behavior acceptable. **Users should try the official behavior first and install this plugin only when the remaining retries, overhead, or instability are unacceptable.**
>
> **Given the current effectiveness of the official improvements, this plugin may stop being maintained after the next official release. If you still need this plugin to be maintained at that time, please proactively open an issue, and the developer will respond as soon as possible.**

> Currently supported:<br>
> Latest supported DSH version: `0.1.6-alpha.2` (full list in [Compatibility](#compatibility))<br>
> Desktop version: `2.0.3`<br>
> OS: `Windows` & `Linux`  & `macOS` (theoretically supported, not yet tested)
>  
>  If there is any platform that has not yet been adapted and needs compatibility, please submit an issue.<br>
```

</details>

**依据 2 · 源码核查**：[src/compatibility.ts:5-18](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/compatibility.ts#L5-L18)

明确版本/工具集合。

<details>
<summary>查看原文（14行）</summary>

```text
// 仅列入已完成真实包测试或标签源码契约审计的 DSH 版本，避免仅凭 semver 范围放行未知契约。
export const SUPPORTED_DSH_VERSIONS = ['0.1.0-rc.5', '0.1.0-rc.6', '0.1.0-rc.7', '0.1.0-rc.8', '0.1.1-rc.1', '0.1.1-rc.2', '0.1.2-alpha.1', '0.1.2-alpha.2', '0.1.2-alpha.3', '0.1.2-alpha.4', '0.1.2-alpha.5', '0.1.2-rc.1', '0.1.3-alpha.1', '0.1.3-alpha.2', '0.1.5-alpha.1', '0.1.5-alpha.2', '0.1.5-rc.1', '0.1.5-rc.2', '0.1.6-alpha.1', '0.1.6-alpha.2'] as const

const DSH_PACKAGES = [
  '@deepseek-ai/dsh-agent',
  '@deepseek-ai/dsh-llm',
  '@deepseek-ai/dsh-sandbox',
  '@deepseek-ai/dsh-sandbox-policy',
  '@deepseek-ai/dsh-scope',
  '@deepseek-ai/dsh-session',
  '@deepseek-ai/dsh-tools',
  '@deepseek-ai/dsh-user-approval',
] as const
const TARGET_NAMES = new Set(['bash', 'pwsh', 'write', 'edit'])
```

</details>

**依据 3 · 源码核查**：[src/index.ts:18-37](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/index.ts#L18-L37)

所需服务。

<details>
<summary>查看原文（20行）</summary>

```text
export const name = 'sandbox-escalation-fix'
export const inject = ['agents', 'tools', 'sandboxPolicy', 'approval']

export function startPlugin(
  ctx: Context,
  config: Config = {},
  compatibility: DshRuntimeCompatibility = validateDshRuntime(),
): void {
  if (compatibility.mode === 'structural') {
    ctx.logger.warn('dsh-sandbox-escalation-fix: DSH package manifests are hidden by the host; using strict runtime tool-contract validation')
  }
  const supervisor = new Supervisor(ctx)
  ctx.effect(() => supervisor.start(), 'sandbox-escalation-fix.lifecycle()')
  if ((config.logLevel ?? 'info') !== 'silent') {
    ctx.logger.info('sandbox-escalation-fix: session-aware tool wrappers enabled')
  }
}

export function apply(ctx: Context, config: Config = {}): void {
  startPlugin(ctx, config)
```

</details>

**依据 4 · 源码核查**：[package.json:56-68](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/package.json#L56-L68)

发布与Node声明。

<details>
<summary>查看原文（13行）</summary>

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.5 <0.1.0-rc.9 || 0.1.1-rc.1 || 0.1.1-rc.2 || 0.1.2-alpha.1 || 0.1.2-alpha.2 || 0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5 || 0.1.2-rc.1 || 0.1.3-alpha.1 || 0.1.3-alpha.2 || 0.1.5-alpha.1 || 0.1.5-alpha.2 || 0.1.5-rc.1 || 0.1.5-rc.2 || 0.1.6-alpha.1 || 0.1.6-alpha.2",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.5 <0.1.0-rc.9 || 0.1.1-rc.1 || 0.1.1-rc.2 || 0.1.2-alpha.1 || 0.1.2-alpha.2 || 0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5 || 0.1.2-rc.1 || 0.1.3-alpha.1 || 0.1.3-alpha.2 || 0.1.5-alpha.1 || 0.1.5-alpha.2 || 0.1.5-rc.1 || 0.1.5-rc.2 || 0.1.6-alpha.1 || 0.1.6-alpha.2",
    "@deepseek-ai/dsh-sandbox": ">=0.1.0-rc.5 <0.1.0-rc.9 || 0.1.1-rc.1 || 0.1.1-rc.2 || 0.1.2-alpha.1 || 0.1.2-alpha.2 || 0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5 || 0.1.2-rc.1 || 0.1.3-alpha.1 || 0.1.3-alpha.2 || 0.1.5-alpha.1 || 0.1.5-alpha.2 || 0.1.5-rc.1 || 0.1.5-rc.2 || 0.1.6-alpha.1 || 0.1.6-alpha.2",
    "@deepseek-ai/dsh-sandbox-policy": ">=0.1.0-rc.5 <0.1.0-rc.9 || 0.1.1-rc.1 || 0.1.1-rc.2 || 0.1.2-alpha.1 || 0.1.2-alpha.2 || 0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5 || 0.1.2-rc.1 || 0.1.3-alpha.1 || 0.1.3-alpha.2 || 0.1.5-alpha.1 || 0.1.5-alpha.2 || 0.1.5-rc.1 || 0.1.5-rc.2 || 0.1.6-alpha.1 || 0.1.6-alpha.2",
```

</details>

**依据 5 · 源码核查**：[src/supervisor.ts:139-181](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L139-L181)

退出只解除自身钩子。

<details>
<summary>查看原文（43行）</summary>

```text
  start(): () => Promise<void> {
    const stopCreated = this.ctx.on('agent/created', ({ agent }) => {
      this.install(agent)
    })
    const stopDisposed = this.ctx.on('agent/disposed', ({ agent }) => {
      try {
        this.remove(agent)
      } catch (error) {
        this.ctx.logger.warn(`dsh-sandbox-escalation-fix: agent "${agent.id}" cleanup failed: ${String(error)}`)
      }
    })
    const stopPreset = this.ctx.on('agent-preset/selected', (sessionId) => {
      const agent = this.ctx.agents.get(sessionId)
      if (agent !== undefined) this.reconcileAgent(agent)
    })
    const stopTools = this.ctx.on('tools/change', () => {
      if (this.expectedToolChanges > 0) {
        this.expectedToolChanges -= 1
        return
      }
      if (this.reconciling > 0) {
        this.reconcilePending = true
        return
      }
      this.reconcileAll()
    })
    for (const agent of this.ctx.agents.list()) this.install(agent)
    return () => {
      stopTools()
      stopPreset()
      stopDisposed()
      stopCreated()
      const states = [...this.states.values()]
      this.states.clear()
      for (const state of states) {
        try {
          this.coordinate(() => this.disposeState(state))
        } catch (error) {
          this.ctx.logger.warn(`dsh-sandbox-escalation-fix: agent "${state.agent.id}" cleanup failed: ${String(error)}`)
        }
      }
      return Promise.resolve()
    }
```

</details>

#### 缺口

- 受支持宿主中原生残余错误频率及插件净改善未测。
  **影响**：无法判断增加wrapper是否比少数重试更值得。
  **进一步探讨**：相同模型/权限/已知命令对比原生与插件，记无效请求、正确拒绝、总token和维护时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前谁值得采用，怎样判断是否应继续维护？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前先观察官方行为。只有用户固定在支持版本、可重复遇到同级/多余升级错误且开销确实不可接受时，再在隔离profile做对照；同时测试必须拒绝的越界/真正升级，确保没有以减少错误换掉审批。若原生只需少量可接受修正、兼容门拒绝或结果重写冲突，移除插件回官方工具，不为了消除提示扩大权限。

值得验证的方向是将会话权限投影作为宿主原生schema能力，并提供“模型看到的可升级目标/实际执行模式/审批结果”回执。依据是当前wrapper在每个Agent重复适配全局schema，必须追随工具变更；宿主若原生接入可减少兼容补丁。最小实验用相同权限矩阵比较原生现状、插件和原生投影原型的无效请求、错误放行、token与维护面；若官方后续已提供等效机制，或投影造成缓存陈旧而增加错误，新增方案或插件维护必要性被推翻。

#### 证据与依据

**依据 1 · 源码核查**：[src/policy.ts:14-30](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/policy.ts#L14-L30)

每会话可升级目标依据。

<details>
<summary>查看原文（17行）</summary>

```text
  effectiveMode: SandboxMode,
  approvalPolicy: ApprovalPolicy,
): readonly SandboxMode[] {
  return approvalPolicy === 'never' ? [] : WIDER_MODES[effectiveMode] ?? []
}

export function escalationPolicyFor(ctx: Context, agent: Agent): EscalationPolicyView {
  const effectiveMode = ctx.sandboxPolicy.resolve({ session: agent.session }).mode
  const approvalPolicy = ctx.approval.overrideOf(agent.session)
    ?? ctx.approval.config.policy
    ?? 'ask'
  return {
    effectiveMode,
    approvalPolicy,
    viableTargets: viableEscalationTargets(effectiveMode, approvalPolicy),
  }
}
```

</details>

**依据 2 · 源码核查**：[src/supervisor.ts:139-165](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/src/supervisor.ts#L139-L165)

工具变化反复适配动因。

<details>
<summary>查看原文（27行）</summary>

```text
  start(): () => Promise<void> {
    const stopCreated = this.ctx.on('agent/created', ({ agent }) => {
      this.install(agent)
    })
    const stopDisposed = this.ctx.on('agent/disposed', ({ agent }) => {
      try {
        this.remove(agent)
      } catch (error) {
        this.ctx.logger.warn(`dsh-sandbox-escalation-fix: agent "${agent.id}" cleanup failed: ${String(error)}`)
      }
    })
    const stopPreset = this.ctx.on('agent-preset/selected', (sessionId) => {
      const agent = this.ctx.agents.get(sessionId)
      if (agent !== undefined) this.reconcileAgent(agent)
    })
    const stopTools = this.ctx.on('tools/change', () => {
      if (this.expectedToolChanges > 0) {
        this.expectedToolChanges -= 1
        return
      }
      if (this.reconciling > 0) {
        this.reconcilePending = true
        return
      }
      this.reconcileAll()
    })
    for (const agent of this.ctx.agents.list()) this.install(agent)
```

</details>

**依据 3 · 源码核查**：[README.md:7-12](https://github.com/HakureiMonika/dsh-sandbox-escalation-fix/blob/8760b89076b45ea3f60e3c6a598f91e59a1f7387/README.md#L7-L12)

官方改善与维护必要性边界。

```text

> [!CAUTION]
> DSH `0.1.6-alpha.2` has significantly mitigated the issue addressed by this plugin. In testing, a model may still fail its first tool call because of unsuitable sandbox-escalation arguments, but it will usually adjust those arguments after receiving the error and eventually complete the call successfully. Escalation schemas remain registry-global and are still not narrowed according to each Session's current permissions, so the underlying cause has not been fully removed. However, users who can tolerate a small number of retries and some additional token usage may now find the official behavior acceptable. **Users should try the official behavior first and install this plugin only when the remaining retries, overhead, or instability are unacceptable.**
>
> **Given the current effectiveness of the official improvements, this plugin may stop being maintained after the next official release. If you still need this plugin to be maintained at that time, please proactively open an issue, and the developer will respond as soon as possible.**

```

#### 缺口

- 原生投影对照未执行，后续官方实现未在本次版本范围核验。
  **影响**：不声称必须继续维护或方案一定更好。
  **进一步探讨**：先测残余问题，再查目标官方版本是否已等效解决。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
