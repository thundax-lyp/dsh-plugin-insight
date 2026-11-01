# DSH Super Code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c9d5091](https://github.com/ArtlexYoung/dsh-super-code/tree/c9d50912df1e6624543481cb0d724ff3e18ef509)

<!-- BEGIN META -->
[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 3,311](https://img.shields.io/static/v1?label=npm+30d&message=3%2C311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code)
<!-- END META -->

> **功能**：为 DSH 编码任务提供专家委派、分层记忆与删除保护。

> **亮点**：把任务记忆、专家分工与版本绑定结果组织进编码流程。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：reviewable 不证明代码正确或硬预算受控，严格删除保护也仅覆盖识别的工具命令。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要 Super Code，较普通编码代理多什么？](#detail-section-11)
  - [Q02 · 成员任务如何绑定，返回可审查是否意味着正确？](#detail-section-12)
  - [Q03 · 严格删除保护是否覆盖一切删除及持久记忆？](#detail-section-13)
  - [Q04 · 如何选择小范围试用及恢复？](#detail-section-14)
  - [Q05 · 已有版本绑定之外如何辅助用户验证成员交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有多步骤编码或需要多个专家的 DSH 用户；基线是单代理加人工任务管理。[Q01](#research-q01)

单代理完成修改并由用户人工追踪和验收。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 委派 | 绑定任务和返回结果 | 不证明代码正确 |
| 记忆 | 保留任务状态 | 依赖持久 checkpoint |
| 删除保护 | 审批匹配命令 | 非全路径沙箱 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与任务服务 | 必需 | 任务和预设 | 回单代理 |
| 子代理与模型 | 委派需要 | 成员执行 | 人工处理 |
| 宿主持久化 | 任务持久化需要 | 保存记忆 | 抛错 |
| 审批服务 | 严格删除需要 | 单次确认 | 拒绝命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户选隔离仓库、明确范围和预算 | 环境与验收可核验 |
| 2 | 分派小任务并检查版本绑定 | 过期或失败则不接收 |
| 3 | 独立检查 diff 和测试 | 审批或验证异常停止合入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与模型 | 配置角色和任务 | 兼容需验证 |
| 持续 | 多模型调用 | 独立审查 | 自报预算非账单 |
| 恢复 | 重新执行可能计费 | 恢复持久任务 | flush 失败抛错 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 委派 | 绑定及结果身份校验 | 代码正确性 |
| 删除保护 | 匹配 strict 命令时审批 | 所有删除路径覆盖 |

> **思考**：reviewable 不证明代码正确或硬预算受控，严格删除保护也仅覆盖识别的工具命令。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把任务记忆、专家分工与版本绑定结果组织进编码流程。[Q01](#research-q01) [Q02](#research-q02)

成员结果绑定任务与源码版本；自报成本不构成硬预算，严格保护只拦截匹配命令。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

reviewable 不证明代码正确或硬预算受控，严格删除保护也仅覆盖识别的工具命令。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离试用、限定分工并独立检查 diff 和测试；审批或版本异常即停止。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持版本绑定及严格审批分支；未运行宿主或评测。

- 已检查：作者 README、包清单、源码路径 README.md、src/core/delegation.ts、src/dsh/deletion-protection.ts、src/task-memory-store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 165 文件、49 排除、零解析错误；静态核查关键委派、审批和存储路径。
- 下一步：固定宿主和隔离仓库，验证过期结果、审批缺失、持久化及独立测试。

**分析版本**

- **仓库**：[ArtlexYoung/dsh-super-code](https://github.com/ArtlexYoung/dsh-super-code)
- **版本号**：0.3.9（[固定提交 c9d5091](https://github.com/ArtlexYoung/dsh-super-code/tree/c9d50912df1e6624543481cb0d724ff3e18ef509)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：成员自报与独立验证结果并列可降低误接收，须对照现有 binding 和 checks 字段。[Q05](#research-q05)

固定宿主和隔离仓库，验证过期结果、审批缺失、持久化及独立测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 50 | 9686 | 9280 | 345 | — |
| .md | source | 19 | 2540 | — | — | 37241 |
| .mjs | source | 12 | 1360 | 1253 | 39 | — |
| .ts | source | 50 | 5912 | 5404 | 240 | — |
| .ts | test | 34 | 6639 | 6278 | 47 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArtlexYoung/dsh-super-code/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编码委派和任务记忆如何约束，删除保护与验证有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Super Code，较普通编码代理多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

处理多步骤编码、需要子代理分工与任务记忆的 DSH 用户可使用预设、任务状态和专家团队。相对普通单代理，它提供版本绑定的成员委派和分层记忆，但增加协调、核验和模型调用；简单修改可直接完成。作者给出评测方法，不等于本轮复跑及所有项目均提效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-82](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/README.md#L73-L82)

作者描述批量工具、记忆和保护。

<details>
<summary>查看原文（10行）</summary>

```text
## 功能

| 功能 | 说明 |
|---|---|
| 批量工具调用 | 在一次模型调用中并行读取多个文件，减少往返次数 |
| 分层记忆 | 当前任务、项目经验和全局偏好分别存储，每条记录均标注来源 |
| 运行预算 | 默认使用效果更好的旧压缩预算，可在设置中调整 |
| 删除保护 | 默认引导 Agent 使用可恢复的 `trash`，可切换为严格确认 |
| MCP 连接 | 允许外部 MCP 客户端将任务委派给 DSH 执行，默认关闭 |
| 前端 Skill | 开发页面时按需加载，检查对齐、点击区域和浏览器表现 |
```

</details>

**依据 2 · 作者声明**：[README.md:96-103](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/README.md#L96-L103)

作者描述评测方法。

```text
## 评测

### 评测方法

- **题集**：SWE-bench Pro hard-100，使用官方评分器。调优仅使用 SWE-bench dev 中筛选的 33 道困难题；hard-100 只用于评测冻结后的候选版本和排查问题，不参与调优，以避免对评测题过拟合。
- **对照**：官方标准预设，而非 minimal。旧宿主实测中，标准 + high 通过 51 题，minimal + high 通过 46 题，且标准每题 token 少 23.5%。与更强的对照比较，结论更严格。
- **控制变量**：同一宿主、同一模型、同一思考等级、同一预算，仅替换 Agent 预设。
- **指标**：通过数、每题净耗时（扣除失败请求和重试等待）、每题 token、每题模型调用次数。
```

**依据 3 · 源码核查**：[src/core/delegation.ts:5-17](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L5-L17)

委派输入和结果结构。

<details>
<summary>查看原文（13行）</summary>

```text
export interface MemberAssignment {
  owner: string; attemptId: string; objective: string; ownedPaths: string[]; acceptance: string[]; maxTokens: number
}
export interface MemberBrief extends MemberAssignment {
  binding: string; sessionId: string; taskId: string; createdAtSeq: number; requirementsRevision: number; delegationRevision: number
  workspace: string; sourceVersion: string; constraints: string[]; taskGoal: string; taskAcceptance: string[]
}
export interface MemberResult {
  binding: string; owner: string; attemptId: string
  outcome: 'completed' | 'failed' | 'cancelled' | 'stop_unknown'
  summary: string; artifacts: string[]; checks: string[]; unknowns: string[]
  /** Optional self-report, never authenticated usage or budget enforcement. */
  cost?: { inputTokens: number; outputTokens: number; cachedTokens: number; toolCalls: number; complete: boolean }
```

</details>

#### 缺口

- 未运行 DSH、模型、MCP 或基准测试
  **影响**：不能确认效率、权限覆盖和实际账单
  **进一步探讨**：固定宿主与任务，在隔离工作区验证委派、恢复及审批

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 成员任务如何绑定，返回可审查是否意味着正确？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

只有 active 任务可生成 brief，摘要覆盖任务、需求和委派版本、源版本、工作区与分工；返回时重算绑定、比对 owner/attempt 与 completed 状态。reviewable 只表示这些前提满足，不验证实际改动、测试或路径归属。成员自报 cost 被标记 model-reported，预算仍为 unknown。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/delegation.ts:27-35](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L27-L35)

active 校验和摘要绑定。

```text
/** Compact, version-bound inputs for the existing host subagent provider. */
export function createMemberBrief(task: TaskMemory, sessionId: string, input: MemberAssignment): MemberBrief {
  const assignment = assignmentSchema.parse(input)
  if (sessionId.trim() === '') throw new Error('sessionId is required')
  if (task.status !== 'active') throw new Error('Only active tasks may delegate work')
  const fields = { ...assignment, sessionId, taskId: task.id, createdAtSeq: task.createdAtSeq, requirementsRevision: task.requirementsRevision,
    delegationRevision: task.delegationRevision, taskGoal: task.goal, taskAcceptance: [...task.acceptance],
    workspace: task.workspace, sourceVersion: task.sourceVersion, constraints: task.requirements.map(item => item.text) }
  return { ...fields, binding: createHash('sha256').update(JSON.stringify(fields)).digest('hex') }
```

**依据 2 · 源码核查**：[src/core/delegation.ts:38-55](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L38-L55)

返回身份、状态及自报成本检查。

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

#### 缺口

- 未运行 DSH、模型、MCP 或基准测试
  **影响**：不能确认效率、权限覆盖和实际账单
  **进一步探讨**：固定宿主与任务，在隔离工作区验证委派、恢复及审批

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 严格删除保护是否覆盖一切删除及持久记忆？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。拦截器仅在 strict 模式且工具为 bash 或 pwsh 且命令被识别为删除时申请单次批准；审批服务或代理缺失、异常或非 allowed-once 则拒绝。其他模式和未匹配执行路径不能因此视为被保护。任务记忆依赖宿主 session flush 成功才声称持久；两者均非本轮运行证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/deletion-protection.ts:58-71](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/dsh/deletion-protection.ts#L58-L71)

strict 工具、命令匹配和审批失败关闭。

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

**依据 2 · 源码核查**：[src/task-memory-store.ts:17-29](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/task-memory-store.ts#L17-L29)

持久 checkpoint 失败抛错。

<details>
<summary>查看原文（13行）</summary>

```text
  constructor(private readonly ctx: Context, private readonly maxContextBytes: number) {}

  isPending(session: Session): boolean { return this.pending.has(session) }

  current(session: Session): TaskMemoryState {
    const state = this.ctx.sessionProjections.stateOf(session, 'superCodeTasks')
    if (state === undefined) throw new Error('super-code task projection is unavailable')
    return state
  }

  private async checkpoint(session: Session): Promise<void> {
    if (!await this.ctx.sessions.flush(session)) throw new Error('No host persistence checkpoint is configured; task memory is not durable')
    this.pending.delete(session)
```

</details>

#### 缺口

- 未运行 DSH、模型、MCP 或基准测试
  **影响**：不能确认效率、权限覆盖和实际账单
  **进一步探讨**：固定宿主与任务，在隔离工作区验证委派、恢复及审批

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何选择小范围试用及恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、子代理和持久化服务，复杂任务会产生额外模型和人工审查成本；MCP 对外连接作者称默认关闭。先在隔离仓库给每个成员明确范围及验收，人工检查 diff、运行适当测试并核对实际成本；删除保护应核实模式和宿主审批，缺通道时停止。报告内自报 token 不能当硬预算。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-82](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/README.md#L73-L82)

作者说明默认删除模式与 MCP。

<details>
<summary>查看原文（10行）</summary>

```text
## 功能

| 功能 | 说明 |
|---|---|
| 批量工具调用 | 在一次模型调用中并行读取多个文件，减少往返次数 |
| 分层记忆 | 当前任务、项目经验和全局偏好分别存储，每条记录均标注来源 |
| 运行预算 | 默认使用效果更好的旧压缩预算，可在设置中调整 |
| 删除保护 | 默认引导 Agent 使用可恢复的 `trash`，可切换为严格确认 |
| MCP 连接 | 允许外部 MCP 客户端将任务委派给 DSH 执行，默认关闭 |
| 前端 Skill | 开发页面时按需加载，检查对齐、点击区域和浏览器表现 |
```

</details>

**依据 2 · 源码核查**：[src/core/delegation.ts:38-55](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L38-L55)

版本/身份核验和预算未知。

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

**依据 3 · 源码核查**：[src/dsh/deletion-protection.ts:58-71](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/dsh/deletion-protection.ts#L58-L71)

严格确认失败时停止。

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

#### 缺口

- 未运行 DSH、模型、MCP 或基准测试
  **影响**：不能确认效率、权限覆盖和实际账单
  **进一步探讨**：固定宿主与任务，在隔离工作区验证委派、恢复及审批

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有版本绑定之外如何辅助用户验证成员交付？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：将成员报告中的 artifacts、checks 与实际文件版本及独立验证结果并列，要求审查者逐项确认，可能减少把自报完成误当验收。反证是已有 binding、owner/attempt、outcome 和 checks 字段，但这些仅是身份和自报，不证明测试真实通过；其他等价流程未穷尽。对照当前审查流程，以过期代码、虚假通过和正常任务测误接收率、审查时间与误拒；无改善或负担过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/delegation.ts:12-17](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L12-L17)

已有 artifacts、checks 和成本自报。

```text
export interface MemberResult {
  binding: string; owner: string; attemptId: string
  outcome: 'completed' | 'failed' | 'cancelled' | 'stop_unknown'
  summary: string; artifacts: string[]; checks: string[]; unknowns: string[]
  /** Optional self-report, never authenticated usage or budget enforcement. */
  cost?: { inputTokens: number; outputTokens: number; cachedTokens: number; toolCalls: number; complete: boolean }
```

**依据 2 · 源码核查**：[src/core/delegation.ts:38-55](https://github.com/ArtlexYoung/dsh-super-code/blob/c9d50912df1e6624543481cb0d724ff3e18ef509/src/core/delegation.ts#L38-L55)

已有绑定和状态审查。

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

#### 缺口

- 未运行 DSH、模型、MCP 或基准测试
  **影响**：不能确认效率、权限覆盖和实际账单
  **进一步探讨**：固定宿主与任务，在隔离工作区验证委派、恢复及审批

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
