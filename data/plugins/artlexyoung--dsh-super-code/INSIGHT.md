# dsh-super-code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cf793e2](https://github.com/ArtlexYoung/dsh-super-code/tree/cf793e267bbe081717945891e133de1b4f615f03)

<!-- BEGIN META -->
[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 2,783](https://img.shields.io/static/v1?label=npm+30d&message=2%2C783&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code)
<!-- END META -->

> **功能**：提供编码 Agent 预设、需求绑定任务台账、分层记忆与本机 MCP 委派连接。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的主要增量在需求来源可核查、任务修订绑定与分层上下文，而执行loop和spawn继承宿主。它改善协作材料的可审查性，不能把reviewable直接当补丁正确。 [Q06](#research-q06) 的本机 MCP 以请求去重、目录白名单和可观测会话把 DSH 接为外部执行 worker；这增加跨客户端交接路径，模型执行仍归宿主。

> **主要限制**：[Q03](#research-q03) 指出成员checks与cost仍可自报，结构一致不证明完成验收；历史冻结候选评测亦不能直接套到固定0.3.8和新宿主。默认宽松删除提示不是全面删除防线。 [Q06](#research-q06) 进一步说明服务级 Bearer 不是多用户隔离，finished 不是报告验收，单工作树排他也限制并发。

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
  - [Q01 · 分层编程预设服务什么任务？](#detail-section-11)
  - [Q02 · 预设、任务来源与成员结果如何联接？](#detail-section-12)
  - [Q03 · 结构验收和公开评测能证明多大收益？](#detail-section-13)
  - [Q04 · 多agent与记忆负担是否支持采用？](#detail-section-14)
  - [Q05 · 可否用任务证据而非模型自报驱动预算？](#detail-section-15)
  - [Q06 · 外部 MCP 委派是否已接到真实 DSH 会话，断线和并发边界是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要跨多文件调查、实现和验证的DSH开发任务，合格交付仍是满足用户需求且通过项目验收的补丁，任务台账和Agent树只是辅助。普通宿主agent也有工具和子agent，此插件增加按需方法、带来源需求的台账、版本绑定成员交接及工作区长期经验。它明确不另建agent loop，模型、权限、持久化和子agent执行归宿主；贡献应归于任务组织与证据交接而非声称新模型或自动正确性。 外部 MCP 客户端还可把明确工作目录的任务交给 DSH，但这不是预置 INSIGHT 报告服务。

参照宿主普通编码预设和已有子agent；历史作者评测仅说明特定候选/宿主/模型组合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Agent/Preset**：提供Super Code编码预设并复用宿主spawn
- **模型工具**：super_code_method与super_code_task用于方法读取和任务台账
- **后台**：注册任务、反馈和用量投影及长期记忆

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt/sessions/projections | 预设必需 | 工具与上下文 | 预设能力不全 |
| 宿主模型/权限/subagent | 执行必需 | 真正代码任务 | 插件不另建loop |
| storageDomain | 长期记忆必需 | topic持久库 | 降级任务记忆 |
| approval通道 | strict删除确认必需 | 单次放行 | strict识别命令拒绝执行 |
| 项目验收 | 交付必需 | 判补丁正确 | 结构可审查不代替验收 |
| 持久化 profile 与 sessionController/query/subagents | MCP 必需 | 真实委派和任务树观测 | 连接服务不启动或返回 unavailable |
| 本机端口、Bearer 与目录授权 | MCP 必需 | 连接认证与工作目录范围 | 拒绝请求；同一 token 不提供多用户隔离 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户加载并选Super Code | 预设版本和所有权明确 |
| 定义 | 用户发需求，模型建任务 | 来源quote可定位 |
| 委派 | 模型按需分工 | owner/attempt/binding一致 |
| 回收 | 模型读结果，用户/测试验收 | 不以自报completed代替测试 |
| 恢复 | 检查pending或旧任务 | 重新确认现行代码和需求 |
| 外部委派 | 用户启用连接并授权目录，客户端先查 dsh_sessions 再明确复用或新建 | 保留 requestId，等待后按真实文件验收；断线不重派 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 已有宿主与模型资源 | 确认预设所有权、预算与权限 | 配置耗时未知 |
| 持续使用 | 父子调用、压缩、存储 | 委派回收、真实测试和经验清理 | 总账单需含失败 |
| 失败恢复 | 重试和旧任务读取 | pending持久化、过期binding排查 | 不盲重放写操作 |
| 外部 MCP 接入 | DSH 模型与原调用方验收的双边用量 | 客户端配置、token 管理、目录授权和产物回读 | 不可只统计 Codex 侧 token；同一工作树排他 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 来源一致 | 用户事件quote核对 | 需求理解是否充分 |
| 交接防陈旧 | binding含修订版本 | 子任务正确性 |
| 分层记忆 | 工作区topic读取 | 长期增效和费用 |
| 作者评测 | 有条件和修正规则文档 | 当前提交同条件效果 |
| 跨客户端执行 | 本机六工具接真实宿主会话 | 尚未证明指定研究协议、报告质量或全链 token 节省 |

> **思考**：[Q03](#research-q03) 指出成员checks与cost仍可自报，结构一致不证明完成验收；历史冻结候选评测亦不能直接套到固定0.3.8和新宿主。默认宽松删除提示不是全面删除防线。 [Q06](#research-q06) 进一步说明服务级 Bearer 不是多用户隔离，finished 不是报告验收，单工作树排他也限制并发。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的主要增量在需求来源可核查、任务修订绑定与分层上下文，而执行loop和spawn继承宿主。它改善协作材料的可审查性，不能把reviewable直接当补丁正确。 [Q06](#research-q06) 的本机 MCP 以请求去重、目录白名单和可观测会话把 DSH 接为外部执行 worker；这增加跨客户端交接路径，模型执行仍归宿主。

将execution归宿主、任务binding和源码引用验证写成独立模块是可借鉴点。安装器先存意图与所有权检查减少重启反复写风险；预算bridge依赖宿主compaction契约，升级需专项核查。 [Q06](#research-q06) 可借鉴先持久化派发意图、稳定请求去重、rpcId 对应观测以及执行结束与验收分离；移植须重建宿主事件适配与权限范围。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指出成员checks与cost仍可自报，结构一致不证明完成验收；历史冻结候选评测亦不能直接套到固定0.3.8和新宿主。默认宽松删除提示不是全面删除防线。 [Q06](#research-q06) 进一步说明服务级 Bearer 不是多用户隔离，finished 不是报告验收，单工作树排他也限制并发。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉DSH且已有代码验收流程的开发者可在独立分支试用。首次加载预设并确认安装所有权冲突、模型权限与删除模式；持续成本包括父子模型调用、上下文、压缩、检查和长期记忆维护，不能只看调用次数。可选storageDomain不可用会保留任务记忆但失去长期记忆。失败后检查pending持久化和旧binding，不盲重放写工具；以项目原测试、需求对照、总费用与人工时间共同验收。简单任务不应强建台账，未测到收益或出现未经确认的范围扩展就退回宿主原预设。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

需求来源、交接绑定和本机 MCP 到宿主会话的接线有源码支持；当前版本效果、外部客户端兼容与完整计费未执行验收；证据驱动预算仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/EvaluationResults.md、src/index.ts、src/dsh/index.ts、src/dsh/super-code.ts、src/core/delegation.ts、src/dsh/preset-installation.ts、src/dsh/deletion-protection.ts、src/dsh/official-budgets.ts、src/dsh/budgets.ts、presets/super-code/agent.cordis.yml、src/connection/http.ts、src/connection/tasks.ts、src/dsh/connection-host.ts、src/dsh/connection.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口、预设composition、任务来源及delegation、预算安装和删除模式；评测文档作为作者材料。 新增核查本机 MCP 工具、HTTP 鉴权、任务排他与会话控制，不执行目标代码或客户端连接。
- 下一步：- 已检查固定源码、composition和作者评测口径。
- 未执行插件、benchmark、测试或宿主安装。
- 当前版本效益、完整计费及用户仓库验收未知。 对 MCP 单独验证连接、批准目录、同 requestId 重试、等待断线和重启；真实结束后仍比对需求、证据与工作区改动。

**分析版本**

- **仓库**：[ArtlexYoung/dsh-super-code](https://github.com/ArtlexYoung/dsh-super-code)
- **版本号**：0.3.8（[固定提交 cf793e2](https://github.com/ArtlexYoung/dsh-super-code/tree/cf793e267bbe081717945891e133de1b4f615f03)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出宿主事件按任务attempt归因、按合格结果反馈预算，尚未验证；必须同时看完整账单和补丁质量，漏记或降质会推翻优势。

- 已检查固定源码、composition和作者评测口径。
- 未执行插件、benchmark、测试或宿主安装。
- 当前版本效益、完整计费及用户仓库验收未知。 对 MCP 单独验证连接、批准目录、同 requestId 重试、等待断线和重启；真实结束后仍比对需求、证据与工作区改动。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 44 | 8806 | 8444 | 300 | — |
| .md | source | 12 | 1577 | — | — | 46668 |
| .mjs | source | 12 | 1292 | 1187 | 38 | — |
| .ts | source | 44 | 5401 | 4916 | 221 | — |
| .ts | test | 31 | 5760 | 5440 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分层编程预设能否以受控委派和证据反馈提高复杂代码任务交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分层编程预设服务什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要跨多文件调查、实现和验证的DSH开发任务，合格交付仍是满足用户需求且通过项目验收的补丁，任务台账和Agent树只是辅助。普通宿主agent也有工具和子agent，此插件增加按需方法、带来源需求的台账、版本绑定成员交接及工作区长期经验。它明确不另建agent loop，模型、权限、持久化和子agent执行归宿主；贡献应归于任务组织与证据交接而非声称新模型或自动正确性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-109](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/README.md#L89-L109)

预设使用与UI只读边界。

<details>
<summary>查看原文（21行）</summary>

```text
## 2.2 选中预设 · Select the Preset

打开 **设置 → Agent 预设**，选择 **Super Code 模式**（默认标识符 `super-code`）。

Open **Settings → Agent Presets** and choose **Super Code** (default identifier: `super-code`).

## 2.3 开始对话 · Start a Conversation

新建会话，描述你要完成的编码任务。模型、推理等级、权限和工具沿用 Harness 的设置；子 Agent 默认继承父 Agent 的模型，不用另配模型池。

Open a new session and describe the task. Models, reasoning effort, permissions, and tools come from Harness; child Agents inherit the parent's model by default.

没看到预设？在“设置”→ **Super Code** 查看状态；旧插件版本的入口在“插件配置”中。[安装与排查](docs/UsageGuide.md)

Can't find the preset? Open “Settings” → **Super Code**. Older plugin versions place this under “Plugin configuration”. [Setup and troubleshooting](docs/UsageGuide.md)

[![Super Code 配置入口 · Super Code settings](docs/images/preset-settings-preview.png)](docs/images/preset-settings.png)

右侧 **Super Code** 页面依次展示任务状态、协作执行和记忆库，默认展开任务状态，点击标题切换。任务、步骤和已加载动作直接展开，虚拟滚动保持长列表流畅；保留圆圈 Agent 执行树及记忆的查看、新增、编辑和删除。任务状态只读取现有记录，不改变提示词或模型行为。[界面与记忆说明](docs/UsageGuide.md)

The **Super Code** sidebar contains Task status, Agent execution, and Memory library, with Task status open by default. Tasks, steps, and loaded activity stay expanded in a virtualized list. The circular Agent graph and memory browsing, creation, editing, and deletion remain available. Task status reads existing records without changing prompts or model behavior. [Interface and memory guide](docs/UsageGuide.md)
```

</details>

**依据 2 · 源码核查**：[src/dsh/super-code.ts:76-94](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/super-code.ts#L76-L94)

插件装工具与提示，非新agent loop。

<details>
<summary>查看原文（19行）</summary>

```text
/** Installs no agent loop and starts no model calls. */
export function apply(ctx: Context, config: Config = {}): void {
  validateConfiguration({ maxTasks: config.maxTasks, maxContextBytes: config.maxContextBytes })
  const resources = new WeakMap<Agent, { memory: TaskMemoryStore; maxTasks: number; maxContextBytes: number }>()
  const resourcesFor = (agent: Agent) => {
    let value = resources.get(agent)
    if (!value) {
      const inherited = configurationOf(ctx, agent)
      const maxTasks = config.maxTasks ?? inherited.maxTasks ?? 32
      const maxContextBytes = config.maxContextBytes ?? inherited.maxContextBytes ?? 32768
      value = { memory: new TaskMemoryStore(ctx, maxContextBytes), maxTasks, maxContextBytes }
      resources.set(agent, value)
    }
    return value
  }
  applyPtcBudget(ctx, agent => configurationOf(ctx, agent).budgets ?? {})
  const selectGuidance = createGuidanceSelector(config.guidedRoutes)
  ctx.sessionProjections.register(taskMemoryProjection)
  ctx.systemPrompt.section({ name: PERSONA_PREFIX_SECTION, order: ctx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_PREFIX'), text: SUPER_CODE_INSTRUCTIONS })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设、任务来源与成员结果如何联接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

包根动态载入dsh适配入口，注册预算、删除策略、预设安装、投影和storageDomain长期记忆；真正模型工具在选中的super-code预设作用域注册。任务创建要求source.seq指向当前会话直接user/message，quote必须出现在原文。委派brief用任务、需求修订、工作区、版本、owner和attempt哈希绑定；结果匹配当前binding后才可reviewable。长期记忆按workspace和topic读，pending任务检查点时停止依赖不确定状态。子agent仍使用宿主spawn，maxDepth=1。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/index.ts:34-48](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/index.ts#L34-L48)

宿主注册及长期记忆装配。

<details>
<summary>查看原文（15行）</summary>

```text

export async function apply(ctx: Context, config: Configuration = {}): Promise<void> {
  applyBudgetSettings(ctx, config)
  applyOfficialBudgets(ctx)
  applyDeletionProtection(ctx)
  applyPresetInstallation(ctx)
  applyConnection(ctx)
  ctx.inject(['superCodeLongMemory', 'sessions'], owner => {
    new SuperCodeMemory(owner, owner.get('superCodeLongMemory') as LongMemoryStore)
  })
  ctx.inject(['sessionProjections'], projectionCtx => {
    projectionCtx.sessionProjections.register(superAgentUsageProjectionDefinition)
    projectionCtx.sessionProjections.register(taskMemoryProjection)
    projectionCtx.sessionProjections.register(taskFeedbackProjection)
    projectionCtx.sessionProjections.register(memoryUsageProjection)
```

</details>

**依据 2 · 源码核查**：[src/dsh/super-code.ts:39-43](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/super-code.ts#L39-L43)

需求来源验证。

```text
function assertSource(session: Session, source: TaskSource): void {
  const event = session.eventAt(SessionSeq(source.seq))
  if (event?.type !== 'user/message' || event.data.source.kind !== 'user') throw new Error('Requirement source must reference a direct user message in this session')
  const original = event.data.content.filter(block => block.type === 'text').map(block => block.text).join('\n')
  if (!original.includes(source.quote)) throw new Error('Requirement quote is not present in its original user message')
```

**依据 3 · 源码核查**：[src/core/delegation.ts:28-55](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/core/delegation.ts#L28-L55)

交接绑定与可审查判据。

<details>
<summary>查看原文（28行）</summary>

```text
export function createMemberBrief(task: TaskMemory, sessionId: string, input: MemberAssignment): MemberBrief {
  const assignment = assignmentSchema.parse(input)
  if (sessionId.trim() === '') throw new Error('sessionId is required')
  if (task.status !== 'active') throw new Error('Only active tasks may delegate work')
  const fields = { ...assignment, sessionId, taskId: task.id, createdAtSeq: task.createdAtSeq, requirementsRevision: task.requirementsRevision,
    delegationRevision: task.delegationRevision, taskGoal: task.goal, taskAcceptance: [...task.acceptance],
    workspace: task.workspace, sourceVersion: task.sourceVersion, constraints: task.requirements.map(item => item.text) }
  return { ...fields, binding: createHash('sha256').update(JSON.stringify(fields)).digest('hex') }
}

/** Version matching is necessary for review, not proof that the work is correct. */
export function validateMemberResult(task: TaskMemory, sessionId: string, assignment: MemberAssignment, input: MemberResult): MemberReview {
  assignment = assignmentSchema.parse(assignment)
  const result = resultSchema.parse(input)
  const reasons: string[] = []
  if (task.status !== 'active') reasons.push('parent task is not active')
  else {
    const current = createMemberBrief(task, sessionId, assignment)
    if (result.binding !== current.binding) reasons.push('stale task, requirements, workspace, source or assignment')
  }
  if (result.owner !== assignment.owner || result.attemptId !== assignment.attemptId) reasons.push('owner or attempt differs')
  if (result.outcome !== 'completed') reasons.push(result.outcome)
  const cost = result.cost
  const accounting: MemberAccounting = cost === undefined ? { kind: 'unavailable', budget: 'unknown' }
    : { kind: 'model-reported', budget: 'unknown', reportedBudget:
      cost.cachedTokens > cost.inputTokens || !Number.isSafeInteger(cost.inputTokens + cost.outputTokens) ? 'invalid'
        : !cost.complete ? 'incomplete' : cost.inputTokens + cost.outputTokens > assignment.maxTokens ? 'exceeded' : 'within' }
  return { reviewable: reasons.length === 0, reasons, accounting, result }
```

</details>

**依据 4 · 源码核查**：[presets/super-code/agent.cordis.yml:40-48](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/presets/super-code/agent.cordis.yml#L40-L48)

实际子agent由宿主提供。

```text
- id: tool-subagent-control
  name: '@deepseek-ai/dsh-tool-subagent-control'
- id: tool-subagent
  name: '@deepseek-ai/dsh-tool-subagent'
  config:
    provider: spawn
    toolName: subagent
    backgroundMode: continuable
    maxDepth: 1
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结构验收和公开评测能证明多大收益？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

validateMemberResult只证明绑定、owner、attempt和completed状态匹配，artifacts/checks仍可为模型自报，代码注释明确reviewable不是工作正确。maxTokens预算同样不认证真实账单。默认删除为relaxed提示，只有strict在bash/pwsh且识别到命令时请求确认，不能称全面阻止任意永久删除。作者评测有丰富口径和修正材料，但主要对应历史冻结候选和其他插件版本；不同宿主、模型及预算改变结果，固定0.3.8源码不能继承56%或节费结论。源码设计可借鉴，效果需在本地任务验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/delegation.ts:38-55](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/core/delegation.ts#L38-L55)

reviewable和模型自报账单边界。

<details>
<summary>查看原文（18行）</summary>

```text
/** Version matching is necessary for review, not proof that the work is correct. */
export function validateMemberResult(task: TaskMemory, sessionId: string, assignment: MemberAssignment, input: MemberResult): MemberReview {
  assignment = assignmentSchema.parse(assignment)
  const result = resultSchema.parse(input)
  const reasons: string[] = []
  if (task.status !== 'active') reasons.push('parent task is not active')
  else {
    const current = createMemberBrief(task, sessionId, assignment)
    if (result.binding !== current.binding) reasons.push('stale task, requirements, workspace, source or assignment')
  }
  if (result.owner !== assignment.owner || result.attemptId !== assignment.attemptId) reasons.push('owner or attempt differs')
  if (result.outcome !== 'completed') reasons.push(result.outcome)
  const cost = result.cost
  const accounting: MemberAccounting = cost === undefined ? { kind: 'unavailable', budget: 'unknown' }
    : { kind: 'model-reported', budget: 'unknown', reportedBudget:
      cost.cachedTokens > cost.inputTokens || !Number.isSafeInteger(cost.inputTokens + cost.outputTokens) ? 'invalid'
        : !cost.complete ? 'incomplete' : cost.inputTokens + cost.outputTokens > assignment.maxTokens ? 'exceeded' : 'within' }
  return { reviewable: reasons.length === 0, reasons, accounting, result }
```

</details>

**依据 2 · 源码核查**：[src/dsh/deletion-protection.ts:58-71](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/deletion-protection.ts#L58-L71)

严格模式仅对应命令门。

<details>
<summary>查看原文（14行）</summary>

```text
    owner.on('tools/execute', async (exec, next) => {
      if (modeFor(exec.agent) !== 'strict' || !['bash', 'pwsh'].includes(exec.name)) return next()
      const args = exec.arguments as { command?: unknown; workdir?: unknown } | null
      if (typeof args?.command !== 'string' || !deletionCommand(args.command, exec.name === 'pwsh')) return next()
      exec.signal.throwIfAborted()
      const approval = owner.get('approval') as Approver | undefined
      if (!approval || !exec.agent) throw new Error(corrective + '\n当前宿主无可用确认渠道，命令未执行。 No approval channel is available; nothing ran.')
      const reason = `删除保护：建议改用 trash。仅在本次操作是临时文件或构建产物清理时，确认以下命令的永久删除；其他文件请选择拒绝。\nDeletion protection: prefer trash. Approve permanent deletion only for temporary files or build artifacts in this exact call; reject other deletions.\n${typeof args.workdir === 'string' ? `工作目录 / Workdir: ${args.workdir}\n` : ''}${args.command}`
      let outcome: string
      try { outcome = await approval.request({ agent: exec.agent, toolName: exec.name, callId: exec.callId, reason, signal: exec.signal }) }
      catch { throw new Error(corrective + '\n确认渠道不可用，命令未执行。 Approval failed; nothing ran.') }
      exec.signal.throwIfAborted()
      if (outcome !== 'allowed-once') throw new Error(corrective + `\n确认结果 / Approval: ${outcome}`)
      return next()
```

</details>

**依据 3 · 作者声明**：[docs/EvaluationResults.md:64-70](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/docs/EvaluationResults.md#L64-L70)

作者明确净耗时、缺usage和历史基线限制。

```text
净耗时扣除最终有效作答中的失败请求和重试等待；两种耗时均不含官方评分。调用次数排除已记录的失败请求。总 token = 缓存输入 + 非缓存输入 + 输出，输出含思考 token。复评分保留原作答的用量和耗时；有效题目范围变化时，均值会随之变化。未返回的用量不估算，数字不等于完整账单。

Net time excludes failed requests and retry waits in the final valid answer; both time measures exclude grading. Call counts exclude logged failed requests. Total tokens = cached input + uncached input + output, including reasoning. Regrading preserves each answer's original usage and timing; means change when the valid subset changes. Missing usage is not estimated, so these figures are not a complete bill.

创造保留官方预设与工具定义；评测隔离禁止 `cordis_run` 在宿主上执行动态代码，只读检查仍可使用。极简 + high 复用历史基线，宿主修订与本轮不同，不能把差异完全归因于思考等级。

Creative retains the official preset and tools; evaluation isolation blocks host-side dynamic execution through `cordis_run`, while read-only inspection remains available. Minimal + high reuses a historical baseline with different Harness revisions, so the results do not isolate reasoning effort.
```

#### 缺口

- 固定0.3.8与用户宿主模型组合的任务质量和全费用未知。
  **影响**：不能把旧候选评测百分比或结构通过当当前收益。
  **进一步探讨**：固定当前版本、宿主、模型和预算，对同项目任务盲验补丁与完整账单，含失败和人工复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多agent与记忆负担是否支持采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

熟悉DSH且已有代码验收流程的开发者可在独立分支试用。首次加载预设并确认安装所有权冲突、模型权限与删除模式；持续成本包括父子模型调用、上下文、压缩、检查和长期记忆维护，不能只看调用次数。可选storageDomain不可用会保留任务记忆但失去长期记忆。失败后检查pending持久化和旧binding，不盲重放写工具；以项目原测试、需求对照、总费用与人工时间共同验收。简单任务不应强建台账，未测到收益或出现未经确认的范围扩展就退回宿主原预设。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/index.ts:20-30](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/index.ts#L20-L30)

长期存储失败降级。

<details>
<summary>查看原文（11行）</summary>

```text

async function installLongMemory(ctx: Context): Promise<void> {
  await ctx.inject(['storageDomain'], async owner => {
    try {
      const facility = owner.get('storageDomain') as DomainFacility
      const domain = await facility.open(longMemoryDomainSpec)
      owner.effect(() => () => domain.close())
      const remove = ctx.provide('superCodeLongMemory', new LongMemoryStore(domain.table('topics')))
      owner.effect(() => remove)
    } catch {
      owner.logger.warn('Super Code long memory storage is unavailable; task memory remains available.')
```

</details>

**依据 2 · 源码核查**：[src/dsh/super-code.ts:102-121](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/super-code.ts#L102-L121)

pending检查点与工作区记忆门。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.systemPrompt.context({ name: 'super-code:tasks', order: 80, text: ({ agent }) => {
    if (agent === undefined) return ''
    const { memory, maxContextBytes } = resourcesFor(agent)
    if (memory.isPending(agent.session)) return 'The last task-memory checkpoint is unconfirmed. Use super_code_task read to retry persistence before relying on it.'
    return taskMemoryContext(memory.current(agent.session), maxContextBytes)
  } })
  ctx.systemPrompt.context({ name: 'super-code:project-memory', order: 81, text: ({ agent }) => {
    if (!agent) return ''
    const { memory } = resourcesFor(agent)
    if (memory.isPending(agent.session)) return ''
    const state = memory.current(agent.session)
    const task = state.focus.kind === 'task' ? state.tasks[state.focus.id] : undefined
    if (!task?.topic) return ''
    const longMemory = ctx.get('superCodeLongMemory') as LongMemoryStore | undefined
    if (!longMemory) return 'Long memory is unavailable; current task memory remains available.'
    let workspace: string
    try { workspace = memoryWorkspace(agent.session) }
    catch { return 'Long memory cannot read this workspace; verify its path before relying on it.' }
    const found = longMemory.read(workspace, task.topic)
    return found.kind === 'found' ? longMemoryContext(found.value, 2048, task.sourceVersion) : ''
```

</details>

**依据 3 · 源码核查**：[src/dsh/preset-installation.ts:78-85](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/preset-installation.ts#L78-L85)

安装意图先持久化、避免反复写。

```text
  async initialize(): Promise<void> {
    await this.enqueue(async () => {
      if (this.settings.get().checked) return
      const status = await this.status()
      // Persist intent first: a failure or subsequent user deletion must not
      // trigger a new filesystem write on every host restart.
      await this.settings.update({ checked: true })
      if (status.state === 'missing' && status.authorable) await this.installNow('super-code')
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否用任务证据而非模型自报驱动预算？

**研究主题**：新假设与验证

#### 完整回答

现有任务binding能拒绝过期交接，但实际预算仍非认证用量。未验证方向是把宿主tool和LLM事件按任务/attempt记账，并以验收是否完成而不是子agent自报调整下次委派大小。这样可能把失败与重复调查成本反馈进任务拆分，但需要可靠事件归属、跨压缩恢复和隐私控制。最小对照在同项目重复任务中比较固定预算与证据驱动预算，测合格补丁率、全部调用账单和人工核对时间；若事件归因漏记或预算优化牺牲质量，就否定优势。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/delegation.ts:16-20](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/core/delegation.ts#L16-L20)

当前账目为非认证模型自报。

```text
  /** Optional self-report, never authenticated usage or budget enforcement. */
  cost?: { inputTokens: number; outputTokens: number; cachedTokens: number; toolCalls: number; complete: boolean }
}
export type MemberAccounting = { kind: 'unavailable'; budget: 'unknown' }
  | { kind: 'model-reported'; budget: 'unknown'; reportedBudget: 'within' | 'exceeded' | 'incomplete' | 'invalid' }
```

**依据 2 · 源码核查**：[src/core/delegation.ts:28-35](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/core/delegation.ts#L28-L35)

任务与attempt绑定可作为归属基础。

```text
export function createMemberBrief(task: TaskMemory, sessionId: string, input: MemberAssignment): MemberBrief {
  const assignment = assignmentSchema.parse(input)
  if (sessionId.trim() === '') throw new Error('sessionId is required')
  if (task.status !== 'active') throw new Error('Only active tasks may delegate work')
  const fields = { ...assignment, sessionId, taskId: task.id, createdAtSeq: task.createdAtSeq, requirementsRevision: task.requirementsRevision,
    delegationRevision: task.delegationRevision, taskGoal: task.goal, taskAcceptance: [...task.acceptance],
    workspace: task.workspace, sourceVersion: task.sourceVersion, constraints: task.requirements.map(item => item.text) }
  return { ...fields, binding: createHash('sha256').update(JSON.stringify(fields)).digest('hex') }
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 外部 MCP 委派是否已接到真实 DSH 会话，断线和并发边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑、效果与总成本、工程质量与复用、采用判断

#### 完整回答

固定源码已提供默认关闭的本机 Streamable HTTP MCP：dsh_sessions 查询允许目录的服务管理会话，dsh_run 可复用明确 taskId 或新建根会话，dsh_wait 按游标读取，dsh_send 显式续问，dsh_cancel 请求取消，dsh_request_directory 提交待用户批准的目录申请。HTTP 仅监听 127.0.0.1，先检查 Host、Origin、Bearer token，再解析请求；凭据是服务级共享授权，连接 ID 用于关联而不是每用户权限隔离，不能视作多租户服务。任务层 canonical realpath 验目录白名单，稳定 requestId 与输入指纹防同请求重复派发；同目录、父子目录和同 Git 工作树冲突会被拒绝，连接容量不等于能在同一仓库并行写入。真实执行通过 sessionController.create/prompt，观测当前 rpcId 对应的 user/message 与 turn/end，并检查托管后代；finished 只说明执行结束，acceptance 固定为 not-verified。重启把活跃记录标为 interrupted，不自动重放；MCP 等待超时和断线不取消任务，取消也不能撤销已发生的外部副作用。该链可作为另一模型的执行入口，但不是现成接受仓库并产出指定 META/报告的 INSIGHT 协议，调用方仍须给研究约束、读取完整产物并独立语义验收，且调用方沙箱不会自动传递给 DSH。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-55](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/README.md#L49-L55)

作者说明启用、目录授权及对话复用流程。

```text
支持 Harness `0.1.5-alpha.1` 至 `0.2.1-rc.2`，按所用客户端选择安装方式；[各版本与客户端的验证范围](docs/Compatibility.md)。

Supports Harness `0.1.5-alpha.1` through `0.2.1-rc.2`. Choose the installation method for your client; see [validation coverage by version and client](docs/Compatibility.md).

正式版提供默认关闭的 **MCP 连接**：首页集中显示预设、保护、连接及在线/历史对话数量，客户端与关联会话详情在“连接”页；在“连接”中勾选工作目录并启用，通过连接 Prompt 配置 MCP 客户端。连接后先用 `dsh_sessions` 查看目录最近对话和连接额度，由调用方选择复用或新建，避免无意创建过多会话。外部会话新增目录需在 DSH 弹窗中同意，委派沿用宿主模型与权限。[连接配置、工具和恢复说明](docs/UsageGuide.md#mcp-连接--mcp-connection)

The release provides an opt-in **MCP connection** with a Home overview for presets, protection, connections and connected/past conversation counts; client and linked-session details are in Connection. Select directories and enable it under Connection, then configure an MCP client using the connection prompt. After connecting, call `dsh_sessions` to see recent conversations and connection capacity, then explicitly choose reuse or a new root. Additional directories require consent in a DSH dialog. Delegation uses the host model and permissions. [Setup, tools and recovery](docs/UsageGuide.md#mcp-连接--mcp-connection)
```

**依据 2 · 源码核查**：[src/connection/http.ts:26-55](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/connection/http.ts#L26-L55)

六工具实际注册及 finished、断线、权限语义。

<details>
<summary>查看原文（30行）</summary>

```text
  server.registerTool('dsh_sessions', { description: 'List recent DSH conversations for an allowed working directory before choosing dsh_run. Each entry includes taskId, status, reuse availability and linked connection count; the response also includes current/max/available MCP connections and active/available task slots. Pass a listed taskId to dsh_run to reuse that conversation, or set newConversation=true to create a new root.',
    inputSchema: z.object({ cwd: z.string().min(1).max(4096), limit: z.number().int().min(1).max(25).default(10) }).strict(),
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  }, input => result(() => tasks.sessions(input.cwd, input.limit, connectionStatus())))
  server.registerTool('dsh_run', { description: 'Delegate to DSH Super Code. Call dsh_sessions first and let the user choose a history entry. Pass taskId to reuse an exact conversation, or set newConversation=true to explicitly create a new root session. If neither is provided, a new root is created for backward compatibility. Use a stable requestId for retries; conflicts do not dispatch. DSH permissions apply independently of the caller sandbox. A finished turn is not verified acceptance.',
    inputSchema: z.object({ requestId: identity, cwd: z.string().min(1).max(4096), prompt, client: z.string().min(1).max(80).optional(), taskId: identity.optional(), newConversation: z.boolean().optional() }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
  }, input => result(() => {
    if (input.taskId) {
      if (input.newConversation) throw new ConnectionError('conflicting-session-options')
      return tasks.send({ taskId: input.taskId, requestId: input.requestId, cwd: input.cwd, prompt: input.prompt, connectionId })
    }
    return tasks.run({ requestId: input.requestId, cwd: input.cwd, prompt: input.prompt, client: input.client ?? clientName(), connectionId })
  }))
  server.registerTool('dsh_wait', { description: 'Omit taskId to list service-owned tasks (cursor is a list offset). With taskId, read bounded output, workspace observations and events after cursor. Long-poll up to 30 seconds; timeout/disconnect never cancels execution. waiting_confirmation must be resolved in DSH. finished means execution ended, not acceptance verified.',
    inputSchema: z.object({ taskId: identity.optional(), cursor, waitMs }).strict(),
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  }, (input, extra) => result(() => input.taskId ? tasks.wait(input.taskId, input.cursor, input.waitMs, signal(extra.requestId)) : tasks.list(input.cursor)))
  server.registerTool('dsh_send', { description: 'Explicitly queue a follow-up in a service-owned root session, including after an interruption. Use a new stable requestId for each follow-up. An ambiguous admission is never automatically resent. Does not approve host permissions.',
    inputSchema: z.object({ taskId: identity, requestId: identity, prompt }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
  }, input => result(() => tasks.send({ ...input, connectionId })))
  server.registerTool('dsh_cancel', { description: 'Request cancellation of a service-owned root and its managed descendants. Check the returned status; cancelling/unavailable do not confirm that all execution stopped. Already accepted external side effects cannot be undone.',
    inputSchema: z.object({ taskId: identity }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, input => result(() => tasks.cancel(input.taskId)))
  server.registerTool('dsh_request_directory', { description: 'Request access to an existing absolute directory (including its descendants). DSH displays a consent dialog; only the user can approve. Repeat the same requestId, path and reason to poll. Pending requests expire after 5 minutes and are discarded on host restart. Rejection is final for that requestId. Never assume access before approved.',
    inputSchema: z.object({ requestId: identity, path: z.string().min(1).max(4096), reason: z.string().trim().min(1).max(1000) }).strict(),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, input => result(() => { if (!requestDirectory) throw new ConnectionError('unavailable'); return requestDirectory(input) }))
```

</details>

**依据 3 · 源码核查**：[src/connection/http.ts:92-129](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/connection/http.ts#L92-L129)

本机监听与请求鉴权先于解析；MCP 会话连接上限。

<details>
<summary>查看原文（38行）</summary>

```text
  async start(port: number, token: string, maxConnections = 3): Promise<void> {
    if (this.server) throw new ConnectionError('already-listening')
    const server = createServer((req, res) => { void this.handle(req, res, port, token, maxConnections).catch(() => { if (!res.headersSent) reply(res, 500, 'Request failed'); else res.end() }) })
    server.requestTimeout = 15000; server.headersTimeout = 10000; server.keepAliveTimeout = 1000
    server.maxHeadersCount = 40
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(port, '127.0.0.1', () => { server.removeListener('error', reject); resolve() })
    }).catch(() => { server.close(); throw new ConnectionError('port-unavailable') })
    this.server = server
    this.timer = setInterval(() => { void this.prune().catch(() => {}) }, 5000); this.timer.unref()
  }
  private async admit(body: unknown, maxConnections: number): Promise<ClientConnection | false> {
    if (!body || typeof body !== 'object' || (body as { method?: string }).method !== 'initialize') return false
    await this.prune()
    if (this.clients.size >= maxConnections) throw new ConnectionError('connection-limit')
    const id = randomUUID(), now = Date.now(), lifetime = new AbortController(), calls = new Map<string | number, AbortController>()
    const mcp = delegationMcpServer(this.tasks, requestId => calls.get(requestId)?.signal ?? lifetime.signal, id,
      input => { if (!this.requestDirectory) throw new ConnectionError('unavailable'); return this.requestDirectory(input, this.clients.get(id)?.name ?? 'MCP client') },
      () => this.clients.get(id)?.name ?? 'mcp',
      () => ({ connections: this.clients.size, maxConnections, ids: [...this.clients.keys()] }))
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => id, enableJsonResponse: true,
      onsessionclosed: () => { void this.disconnect(id) } })
    const client: ClientConnection = { id, name: 'MCP client', version: '', connectedAt: now, lastSeen: now, mcp, transport, lifetime, calls, active: 0 }
    this.clients.set(id, client)
    mcp.server.oninitialized = () => {
      const info = mcp.server.getClientVersion()
      client.name = (info?.name ?? 'MCP client').slice(0, 80); client.version = (info?.version ?? '').slice(0, 80)
    }
    try { await mcp.connect(transport) } catch (error) { await this.disconnect(id); throw error }
    return client
  }
  private async handle(req: IncomingMessage, res: ServerResponse, port: number, token: string, maxConnections: number): Promise<void> {
    const address = '127.0.0.1:' + port
    if (req.headers.host !== address && req.headers.host !== 'localhost:' + port) { reply(res, 403, 'Invalid Host'); return }
    if (req.headers.origin !== undefined) { reply(res, 403, 'Origin not allowed'); return }
    if (req.url !== '/mcp') { reply(res, 404, 'Not found'); return }
    if (!authorized(req, token)) { res.setHeader('WWW-Authenticate', 'Bearer'); reply(res, 401, 'Bearer token required'); return }
```

</details>

**依据 4 · 源码核查**：[src/connection/tasks.ts:45-87](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/connection/tasks.ts#L45-L87)

规范化白名单、同工作树排他、请求去重及派发意图持久化。

<details>
<summary>查看原文（43行）</summary>

```text
  private async directory(cwd: string): Promise<string> {
    if (!isAbsolute(cwd)) throw new ConnectionError('absolute-directory-required')
    let canonical: string
    try { canonical = await realpath(cwd); if (!(await stat(canonical)).isDirectory()) throw new Error() }
    catch { throw new ConnectionError('directory-unavailable') }
    const roots = await Promise.all(this.configuration().allowedDirectories.map(path => realpath(path)))
    if (!roots.some(root => withinDirectory(root, canonical))) throw new ConnectionError('directory-not-allowed')
    return canonical
  }
  private async capacity(cwd: string, except = ''): Promise<void> {
    const pending = this.records.filter(row => row.id !== except && (activeTask(row.status) || row.status === 'interrupted'))
    if (pending.length >= this.configuration().maxConnections) throw new ConnectionError('concurrency-limit')
    const root = await gitWorktreeRoot(cwd)
    const roots = await Promise.all(pending.map(row => gitWorktreeRoot(row.cwd)))
    if (pending.some((row, index) => withinDirectory(row.cwd, cwd) || withinDirectory(cwd, row.cwd)
      || root !== false && root === roots[index])) throw new ConnectionError('workspace-busy')
  }
  async run(input: { requestId: string; cwd: string; prompt: string; client?: string; connectionId?: string }): Promise<TaskView> {
    const task = await this.exclusive(async () => {
      this.enabled()
      const cwd = await this.directory(input.cwd)
      const fingerprint = digest({ cwd, prompt: input.prompt, client: input.client ?? 'mcp' })
      const prior = this.records.find(row => row.requestId === input.requestId)
      if (prior) {
        if (prior.fingerprint !== fingerprint) throw new ConnectionError('request-conflict')
        if (input.connectionId && prior.connectionId !== input.connectionId) { prior.connectionId = input.connectionId; await this.persist() }
        return prior
      }
      if (this.records.length >= 200) throw new ConnectionError('task-history-full')
      await this.capacity(cwd)
      const preset = await this.host.preset(), id = `sc-${randomUUID()}`, now = Date.now()
      const row: DelegatedTask = { id, sessionId: id, requestId: input.requestId, fingerprint, cwd, preset,
        client: input.client ?? 'mcp', status: 'starting', cancellationRequested: false, createdAt: now, updatedAt: now, currentRequest: randomUUID(),
        output: '', sequence: 0, events: [], operations: {}, baseline: await gitSnapshot(cwd), ...(input.connectionId ? { connectionId: input.connectionId } : {}) }
      this.event(row, 'starting', 'Dispatch intent saved. A DSH turn ending does not verify task acceptance.')
      this.records.push(row); await this.persist()
      try { await this.host.create(row.sessionId, cwd, preset) }
      catch { this.event(row, 'failed', 'Session creation failed. No prompt was sent.'); await this.persist(); return row }
      try {
        await this.host.prompt(row.sessionId, row.currentRequest, input.prompt)
        this.event(row, 'running', 'Prompt accepted by DSH.')
      } catch { this.event(row, 'interrupted', 'Prompt admission could not be confirmed. No automatic retry; inspect the DSH session before continuing.') }
      await this.persist()
```

</details>

**依据 5 · 源码核查**：[src/connection/tasks.ts:158-164](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/connection/tasks.ts#L158-L164)

返回验收状态恒为 not-verified，不能自动 stage。

```text
  async view(id: string, cursor: number): Promise<TaskView> {
    const task = await this.exclusive(async () => { const row = this.owned(id); await this.refresh(row); return structuredClone(row) })
    return { taskId: task.id, sessionId: task.sessionId, cwd: task.cwd, preset: task.preset, client: task.client,
      status: task.status, createdAt: task.createdAt, updatedAt: task.updatedAt, output: task.output,
      events: task.events.filter(event => event.cursor > cursor), cursor: task.sequence,
      eventsTruncated: cursor < (task.events[0]?.cursor ?? 1) - 1, acceptance: 'not-verified',
      workspace: await workspaceChanges(task.cwd, task.baseline) }
```

**依据 6 · 源码核查**：[src/dsh/connection-host.ts:24-51](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/connection-host.ts#L24-L51)

通过本次请求和结束原因判断执行结果，并非只看 idle。

<details>
<summary>查看原文（28行）</summary>

```text
export function connectionSessionFacts(events: readonly SessionEvent[], agentStatus: string, requestId: string, cancelling = false): SessionFacts {
  let admitted = requestId === '', requestSeq = -1, endSeq = -1, reason = '', output = ''
  const approvals = new Set<string>(), external = new Set<string>()
  for (const event of events) {
    const data = record(event.data), type: string = event.type
    if (type === 'user/message' && data.source?.rpcId === requestId) { admitted = true; requestSeq = event.seq; output = '' }
    if (type === 'turn/start') { reason = ''; approvals.clear() }
    if (type === 'turn/end') { endSeq = event.seq; reason = data.reason?.kind ?? ''; approvals.clear() }
    if (type === 'approval/asked' && typeof data.id === 'string') approvals.add(data.id)
    if (type === 'approval/decided') approvals.delete(data.id)
    if (type === 'subagent/start' && data.runId) external.add(data.runId)
    if (type === 'subagent/end') external.delete(data.runId)
    if (type === 'assistant/message' && admitted && event.seq > requestSeq) {
      const content = data.message?.content ?? data.content
      if (Array.isArray(content)) {
        const text = content.filter(block => block?.type === 'text' && typeof block.text === 'string').map(block => block.text).join('\n')
        if (text) output = text.slice(-12000)
      }
    }
  }
  if (approvals.size) return { status: 'waiting_confirmation', output }
  if (agentStatus === 'running' || external.size) return { status: agentStatus === 'missing' ? 'unavailable' : 'running', output }
  if (cancelling && agentStatus === 'idle') return { status: 'interrupted', output }
  if (!admitted || endSeq <= requestSeq || !reason) return { status: agentStatus === 'missing' ? 'unavailable' : 'running', output }
  if (reason === 'error' || reason === 'max-tokens') return { status: 'failed', output }
  if (['aborted', 'interrupted', 'forked'].includes(reason)) return { status: 'interrupted', output }
  if (reason === 'blocked') return { status: 'waiting_confirmation', output }
  return { status: reason === 'completed' ? 'finished' : 'unavailable', output }
```

</details>

**依据 7 · 源码核查**：[src/dsh/connection-host.ts:60-87](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/connection-host.ts#L60-L87)

真实会话创建、队列 prompt 与后代观测接线。

<details>
<summary>查看原文（28行）</summary>

```text
  async create(sessionId: string, cwd: string, preset: string): Promise<void> {
    const created = await this.services.controller.create({ sessionId, cwd, agentPreset: preset })
    if (created.sessionId !== sessionId || created.agentPreset !== undefined && created.agentPreset !== preset) throw new ConnectionError('session-identity-mismatch')
  }
  async prompt(sessionId: string, requestId: string, prompt: string): Promise<void> {
    await this.services.controller.prompt({ sessionId, requestId, mode: 'queue', content: [{ type: 'text', text: prompt }] }, new AbortController().signal)
  }
  private async facts(id: string, requestId: string, cancelling = false): Promise<SessionFacts> {
    const cut = await this.services.query.observeSession(id, { projectionMode: 'none', signal: AbortSignal.timeout(5000) })
    try { return connectionSessionFacts(cut.events.slice(cut.inheritedEventCount), this.services.agents.get(id)?.status ?? 'missing', requestId, cancelling) }
    finally { cut[Symbol.dispose]() }
  }
  async observe(sessionId: string, requestId: string, cancelling = false): Promise<HostObservation> {
    try {
      const root = await this.facts(sessionId, requestId, cancelling)
      const children = await this.services.subagents.listDescendants(sessionId, AbortSignal.timeout(5000))
      let status = root.status
      for (const child of children) {
        if (child.kind === 'diagnostic') { status = 'unavailable'; break }
        if (child.mode === 'external') continue // Root start/end run facts track these activations.
        const facts = await this.facts(child.id, '', cancelling)
        if (facts.status === 'waiting_confirmation') { status = 'waiting_confirmation'; break }
        if (facts.status === 'unavailable') { status = 'unavailable'; break }
        if (facts.status === 'running' && status !== 'waiting_confirmation') status = 'running'
      }
      return { status, output: root.output, detail: status === 'finished' ? 'Root and managed descendants settled. Acceptance has not been verified.'
        : status === 'waiting_confirmation' ? 'Resolve the pending permission or blocked turn in DSH.' : `DSH task tree: ${status}.` }
    } catch { return { status: 'unavailable', output: '', detail: 'Could not observe the complete DSH task tree. No request was replayed.' } }
```

</details>

**依据 8 · 源码核查**：[src/dsh/connection.ts:79-102](https://github.com/ArtlexYoung/dsh-super-code/blob/cf793e267bbe081717945891e133de1b4f615f03/src/dsh/connection.ts#L79-L102)

连接依赖持久宿主 profile、controller/query/subagents 等，缺失则不启动端点。

<details>
<summary>查看原文（24行）</summary>

```text
  const profileServices = 'profileContext' in ctx ? ['profileContext'] : []
  ctx.inject([...profileServices, 'sessionController', 'agents', 'sessionQuery', 'subagents', 'superCodePresets'], async owner => {
    let directory: string
    try {
      if (profileServices.length) {
        const profile = owner.get('profileContext') as { patchPath: string }
        directory = dirname(profile.patchPath)
      } else {
        // Early hosts expose the profile only as the boot context base URL. Verify its manifest.
        const baseUrl = owner.root.baseUrl
        if (!baseUrl) throw new Error('Profile base URL unavailable')
        directory = fileURLToPath(baseUrl)
        const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'))
        if (!Array.isArray(manifest.dsh?.profile?.bundles)) throw new Error('Not a profile')
      }
    } catch { owner.logger.warn('Super Code connection requires a persistent host profile.'); return }
    const host = new ConnectionHost({ presets: owner.get('superCodePresets'), controller: owner.get('sessionController'),
      agents: owner.get('agents'), query: owner.get('sessionQuery'), subagents: owner.get('subagents') } as ConnectionHostServices)
    const connection = new ConnectionService(new ConnectionStore(join(directory, 'super-code-connection')), host)
    try {
      await connection.initialize()
      service = connection
      owner.effect(() => () => { service = false; return connection.close() })
    } catch { owner.logger.warn('Super Code connection storage is unavailable or already owned by another host. No endpoint was started.') }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
