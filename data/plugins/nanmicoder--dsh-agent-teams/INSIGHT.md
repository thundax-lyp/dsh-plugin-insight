# DSH AgentTeams

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3331b90](https://github.com/NanmiCoder/dsh-agent-teams/tree/3331b903f0e954d59ac69be1a75fd4fd7e1de20e)

<!-- BEGIN META -->
[![GitHub ★ 2,619](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C619&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 48,673](https://img.shields.io/static/v1?label=npm+30d&message=48%2C673&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)
<!-- END META -->

> **功能**：为 DSH 提供持久多成员任务、依赖调度与协作。

> **亮点**：[Q02](#research-q02) 为可续聊子 Agent 增加持久任务图、归属与自动调度，相比手工跟踪减少协调步骤。

> **主要限制**：[Q03](#research-q03) attempt 只限制团队任务更新，不能撤销已发生的文件或外部副作用；范围门禁是完成时审计。

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
  - [Q01 · 面向谁和依赖什么？](#detail-section-11)
  - [Q02 · 从建队到任务执行与恢复如何接线？](#detail-section-12)
  - [Q03 · 并发、恢复与保护边界是什么？](#detail-section-13)
  - [Q04 · 成本和改进假设是什么？](#detail-section-14)
  - [Q05 · 怎样试用并在何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 能拆分工作并复核整合的 DSH 用户希望让多个成员按依赖协作。

负责人手动创建子 Agent、记录依赖、核查状态并整合结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 团队任务调度 | 按依赖唤醒成员完成工作 | 需可用宿主与 provider；不能保证外部副作用恰好一次 |
| 任务 attempt | 拒绝旧归属的任务更新 | 不阻止旧成员已经产生的文件修改 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与子 Agent provider | 必需 | 启动和续跑成员 | 不能派发成员工作 |
| 本地团队状态目录 | 必需 | 保存任务与归属 | 恢复或更新可能失败 |
| 模型服务和令牌 | 执行成员任务必需 | 完成各成员轮次 | 成员无法产出或增加费用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 制定 | 负责人设定成员、任务及依赖 | 职责与验收可检查 |
| 执行 | 批准后调度空闲成员 | 正确 attempt 获得结果 |
| 复核 | 负责人核查结果和共享文件 | 人工整合与验证 |
| 异常 | 暂停并检查工作区 | 回退串行，避免重复动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主和模型服务 | 规划角色及依赖 | 耗时未知 |
| 持续使用 | 多成员模型调用和状态存储 | 复核协调和整合 | 总费用未测 |
| 失败恢复 | 重跑与排查资源 | 识别重复副作用 | 损失未知 |
| 退出 | 本地状态和文件检查 | 停止成员并人工接手 | 已产生修改不会自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 依赖调度 | 就绪检查和领取代码 | 实际加速与任务质量 |
| 归属保护 | 旧 attempt 更新被拒绝 | 外部副作用不会重复 |

> **思考**：[Q03](#research-q03) attempt 只限制团队任务更新，不能撤销已发生的文件或外部副作用；范围门禁是完成时审计。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 为可续聊子 Agent 增加持久任务图、归属与自动调度，相比手工跟踪减少协调步骤。

[Q02](#research-q02) 使用锁和 attempt 管理任务，[Q03](#research-q03) 此控制不等于文件写入屏障。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) attempt 只限制团队任务更新，不能撤销已发生的文件或外部副作用；范围门禁是完成时审计。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用两成员只读任务试用并检查共享工作区，出现重复或成本超预算时暂停。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持任务依赖、attempt 和恢复接线；真实宿主下的执行、副作用与节时未验证。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、README_ZH.md、src/scheduler.ts、src/state.ts、src/tools.ts、src/quality-gates.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查主调度、attempt 与恢复边界，未运行 DSH、模型或故障实验。
- 下一步：在隔离 DSH 用只读任务核对依赖、恢复、attempt 与模型费用，人工检查结果。

**分析版本**

- **仓库**：[NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)
- **版本号**：0.1.28（[固定提交 3331b90](https://github.com/NanmiCoder/dsh-agent-teams/tree/3331b903f0e954d59ac69be1a75fd4fd7e1de20e)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设在宿主实际写入前核对成员 attempt 与声明范围并阻止越界，可能减少未声明文件并行修改；现有实现已在建任务时拒绝部分已声明范围重叠，不能把该检查当成新增功能。需对照冲突、误拦与延迟。

在隔离 DSH 用只读任务核对依赖、恢复、attempt 与模型费用，人工检查结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 73 | 19884 | 17556 | 1101 | — |
| .md | source | 215 | 29876 | — | — | 466013 |
| .md | example | 44 | 3998 | — | — | 39474 |
| .mjs | test | 42 | 6088 | 5227 | 437 | — |
| .mjs | example | 25 | 1950 | 1831 | 78 | — |
| .ts | example | 2 | 136 | 100 | 26 | — |
| .js | source | 38 | 17923 | 15539 | 2403 | — |
| .ts | source | 30 | 14115 | 10846 | 2535 | — |
| .tsx | source | 7 | 2670 | 2403 | 141 | — |

</details>

**活跃度**

[![Issue 未关闭 47](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=47&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 78](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=78&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 68](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=68&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查团队任务如何分派、更新和冷恢复，以及并发副作用与成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁和依赖什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

DSH AgentTeams 面向能拆分独立任务、管理协作并承担合并复核的负责人。可接受的结果是依赖顺序正确、各成员提交可核对的结果，负责人整合且没有覆盖他人工作。插件使用 DSH tools、子 Agent provider 和本地状态；包声明 Node 版本和 DSH 最低版本。Web 面板为可选观察入口，实际兼容和模型服务仍须环境验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-8](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/package.json#L2-L8)

包身份与定位。

```text
  "name": "@nanmicoder/dsh-agent-teams",
  "version": "0.1.28",
  "description": "AgentTeams for DeepSeek Harness: multi-agent team collaboration (captain, members, tasks with dependencies, messaging) driven by natural language, with a tree monitor in the web GUI",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
```

**依据 2 · 源码核查**：[package.json:55-60](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/package.json#L55-L60)

运行时版本声明。

```text
    "subagent",
    "ai-agent",
    "llm"
  ],
  "engines": {
    "node": "^22.19.0 || >=24",
```

**依据 3 · 源码核查**：[src/index.ts:194-216](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/index.ts#L194-L216)

默认配置与工具注册。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved: ToolsConfig = {
    stateDir: config.stateDir ?? '.agent-teams',
    memberProvider: config.memberProvider ?? 'spawn',
    memberModel: config.memberModel,
    memberLlmProvider: config.memberLlmProvider,
    executionPrompt: config.executionPrompt,
    fallback: config.fallback,
    memberMaxDepth: config.memberMaxDepth ?? 0,
    maxMembers: config.maxMembers ?? 8,
    profiles: config.profiles ?? {},
    // Owner configuration is validated once, at mount: an empty or malformed
    // policy must never reach a member creation path.
    toolPolicies: parseToolPolicies(config.toolPolicies),
  }

  // Provider registration is a sibling plugin's effect (`subagent-spawn` /
  // `subagent-fork` rows), which can land after this mount under the Loader's
  // concurrent activation — so capability validation happens at the first
  // member spawn (`spawnMember`), the earliest point the provider list is
  // settled, rather than here.

  const agentTeamsRuntime = registerAgentTeamsTools(ctx, resolved)
```

</details>

**依据 4 · 作者声明**：[README_ZH.md:41-51](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/README_ZH.md#L41-L51)

作者描述团队与任务能力。

<details>
<summary>查看原文（11行）</summary>

```text
## 为什么需要 AgentTeams？

| 能力 | 带来的变化 |
| --- | --- |
| **队长式委派** | 当前会话负责建队、分配角色并汇总最终结果。 |
| **可续聊成员** | 成员是可持续唤醒的 DSH 子 Agent，可以继续执行聚焦的后续轮次。 |
| **带依赖的任务** | 任务有明确状态；依赖未完成时不能领取。 |
| **自动续领与安全接管** | 成员空闲后自动领取下一项就绪任务；转派会撤销旧 attempt，冷恢复会重试遗留任务，迟到结果无法覆盖。 |
| **成员直达消息** | 成员通过持久化邮箱直接联系队友或队长，不需要队长中转。 |
| **实时活动面板** | Web UI 用分段进度、可折叠成员树和可交互 DAG 展示实时工作；运行中的子任务会标出使用的模型，团队结束后仍保留完整成员与任务历史。 |
| **质量门禁** | 人只提供目标和约束。默认任务顺序是需求 → 实现 → 验证 → 审查 → 集成，失败后自动修复/复审，恢复团队必须显式 resume。第一版范围控制是完成时审计，不是 host 写入拦截。详见 [docs/quality-gates.md](./docs/quality-gates.md)。 |
```

</details>

#### 缺口

- 目标 Host 与 provider 是否兼容可用
  **影响**：影响成员能否启动
  **进一步探讨**：在隔离配置检查版本和 provider

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从建队到任务执行与恢复如何接线？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host apply 注册团队工具和 capability；队长建立团队、成员和带依赖的任务，经批准后由调度器在成员空闲及图变化时尝试领取。就绪判断检查前置任务；锁内为任务生成 attempt、设为 claimed 并持久化，再按成员状态投递或启动子 Agent。成员更新时身份与 attempt_id 必须匹配，旧 attempt 被拒绝；冷恢复可轮换遗留 attempt，调度失败有恢复分支。相较手工创建子 Agent，多了持久任务依赖、归属和可续执行接线；不能由此断言外部副作用恰好一次。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:194-223](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/index.ts#L194-L223)

Host 注册工具和 capability。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved: ToolsConfig = {
    stateDir: config.stateDir ?? '.agent-teams',
    memberProvider: config.memberProvider ?? 'spawn',
    memberModel: config.memberModel,
    memberLlmProvider: config.memberLlmProvider,
    executionPrompt: config.executionPrompt,
    fallback: config.fallback,
    memberMaxDepth: config.memberMaxDepth ?? 0,
    maxMembers: config.maxMembers ?? 8,
    profiles: config.profiles ?? {},
    // Owner configuration is validated once, at mount: an empty or malformed
    // policy must never reach a member creation path.
    toolPolicies: parseToolPolicies(config.toolPolicies),
  }

  // Provider registration is a sibling plugin's effect (`subagent-spawn` /
  // `subagent-fork` rows), which can land after this mount under the Loader's
  // concurrent activation — so capability validation happens at the first
  // member spawn (`spawnMember`), the earliest point the provider list is
  // settled, rather than here.

  const agentTeamsRuntime = registerAgentTeamsTools(ctx, resolved)
  installTeamCapabilities(ctx, {
    stateDir: resolved.stateDir,
    isPendingMember: agentTeamsRuntime.isPendingMember,
    order: config.promptSectionOrder,
    // Keep the bounded profile directory available without extra tool calls.
    // installTeamCapabilities snapshots this once; no business state rewrites it.
    captainPrompt: () => usageSectionText(TEAM_TOOL_NAMES.join(', '), formatProfilesForPrompt(config.profiles)),
```

</details>

**依据 2 · 源码核查**：[src/scheduler.ts:1-11](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L1-L11)

事件驱动和冷恢复约束。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Event-driven shared task scheduler.
 *
 * Claude Code teammates keep polling the shared task list after a turn. DSH
 * continuable agents instead expose explicit idle/running edges, so this
 * scheduler closes the same loop without keeping a polling turn alive: every
 * idle edge and every task-graph mutation attempts one atomic claim and wakes
 * the selected durable member. A resident member that becomes idle while it
 * still owns an open attempt is parked: only an explicit captain reassignment
 * may rotate that capability. Automatic retry is reserved for cold recovery,
 * when this process has not observed the durable owner settle its open attempt.
```

</details>

**依据 3 · 源码核查**：[src/scheduler.ts:195-205](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L195-L205)

就绪任务检查依赖。

<details>
<summary>查看原文（11行）</summary>

```text
}

function ownedOpenTask(tasks: readonly TeamTask[], memberName: string): TeamTask | undefined {
  return tasks.find(task => task.assignee === memberName
    && (task.status === 'claimed' || task.status === 'in_progress'))
}

function nextReadyTask(tasks: readonly TeamTask[], memberName: string): TeamTask | undefined {
  const ready = tasks.filter(task => task.status === 'pending'
    && task.reassigning !== true
    && unsatisfiedDependencies([...tasks], task.dependencies).length === 0)
```

</details>

**依据 4 · 源码核查**：[src/scheduler.ts:353-410](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L353-L410)

锁内认领和恢复票据。

<details>
<summary>查看原文（58行）</summary>

```text
        const ticket = await withTeamLock(teamLockKey(stateRoot, team.id), async (): Promise<DispatchTicket | undefined> => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined || fresh.halted === true || fresh.phase === 'staged') return undefined
          const currentMember = fresh.members.find(candidate => candidate.name === memberName && candidate.status !== 'removed')
          if (currentMember === undefined || !isMemberAvailable(ctx, currentMember)) return undefined
          const owned = ownedOpenTask(fresh.tasks, currentMember.name)
          // An idle edge observed by this scheduler parks the exact open
          // capability. Harness may dispose its AgentHandle after settlement,
          // so registry absence is not evidence that the owner was lost. Keep
          // the marker sticky across later kicks; only a durable attempt that
          // this process has not observed is eligible for one cold recovery.
          const parkedAttemptId = parkedAttempts.get(currentMember.id)
          const recoverOwned = owned !== undefined
            && (owned.attemptId === undefined || owned.attemptId !== parkedAttemptId)
          const task = recoverOwned ? owned : owned === undefined
            ? nextReadyTask(fresh.tasks, currentMember.name)
            : undefined
          if (task === undefined) {
            if (currentMember.status !== 'idle') {
              currentMember.status = 'idle'
              await writeTeam(stateRoot, fresh)
            }
            return undefined
          }
          const previousAssignee = task.assignee
          const previousStatus = recoverOwned ? task.status as 'claimed' | 'in_progress' : undefined
          const previousAttempt = recoverOwned ? task.attempt : undefined
          const previousAttemptId = recoverOwned ? task.attemptId : undefined
          const previousResult = recoverOwned ? {
            output: task.output, verdict: task.verdict, findings: task.findings,
            changedPaths: task.changedPaths, acceptanceResults: task.acceptanceResults, commandsRun: task.commandsRun,
          } : undefined
          const attemptId = beginTaskAttempt(task, currentMember.name)
          // A verdict must be able to say which revision was on disk when it
          // started, so a review that runs while someone else edits the tree
          // cannot later claim to have judged stable bytes (issue #161).
          if (isVerdictKind(taskKindOf(task))) {
            const scope = verdictScopePatterns(fresh, task)
            if (scope.length > 0) task.verdictStartSnapshot = snapshotWorkspacePaths(workspace, scope)
          }
          // A recovered generation is parked before delivery. This makes each
          // (member, attempt) recovery idempotent even if every status poll
          // sees a disposed handle. Fresh pending work remains unparked so a
          // genuinely lost first delivery can be recovered once.
          if (recoverOwned) parkedAttempts.set(currentMember.id, attemptId)
          else parkedAttempts.delete(currentMember.id)
          currentMember.status = 'working'
          await writeTeam(stateRoot, fresh)
          const profileSeedId = taskProfileSeedId(task)
          const protocol = teamProfileProtocol(fresh)
          return {
            taskId: task.id,
            memberName: currentMember.name,
            memberId: currentMember.id,
            attempt: task.attempt ?? 1,
            attemptId,
            previousAssignee,
            recoveredOwned: recoverOwned,
```

</details>

**依据 5 · 源码核查**：[src/scheduler.ts:442-465](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L442-L465)

调度及失败恢复。

<details>
<summary>查看原文（24行）</summary>

```text
        const workOrderStale = taskForWarning?.contractSnapshot === undefined
          ? []
          : contractStaleness(
            taskForWarning,
            digestWorkspacePaths(workspace, taskForWarning.contractSnapshot.artifacts.map((artifact) => artifact.path)),
          )
        const prompt = assignmentPrompt(ticket, config.stateDir, team.id, workOrderStale)
        const signal = new AbortController().signal
        const accepted = config.dispatch === undefined
          ? await deliverToMember(ctx, captain, ticket.memberId, prompt, signal)
          : await config.dispatch(captain, team.id, ticket.memberName, prompt, signal, 'queue', ticket.attemptId)
        if (accepted) return

        // Roll back only our exact failed dispatch. A concurrent captain
        // handoff has already changed the capability and wins.
        await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
          const fresh = await readTeam(stateRoot, team!.id)
          if (fresh === undefined) return
          const task = fresh.tasks.find(candidate => candidate.id === ticket.taskId)
          if (task?.attemptId !== ticket.attemptId) return
          if (ticket.recoveredOwned && ticket.previousStatus !== undefined && ticket.previousAttemptId !== undefined) {
            // Recovery delivery failed. Restore the durable generation instead
            // of returning it to pending, then keep it parked so later status
            // kicks cannot spend an unbounded sequence of fresh attempts.
```

</details>

**依据 6 · 源码核查**：[src/state.ts:171-197](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/state.ts#L171-L197)

新 attempt 清理结果并生成 ID。

<details>
<summary>查看原文（27行）</summary>

```text
/** Execution results belong to one attempt; a retry must produce its own evidence. */
function clearAttemptResult(task: TeamTask): void {
  task.output = undefined
  task.verdict = undefined
  task.findings = undefined
  task.changedPaths = undefined
  task.acceptanceResults = undefined
  task.commandsRun = undefined
}

/** Activate the task's current generation for one owner and return its capability id. */
export function activateTaskAttempt(task: TeamTask, assignee: string): string {
  const attemptId = randomUUID()
  task.status = 'claimed'
  task.assignee = assignee
  task.attemptId = attemptId
  task.handoffId = undefined
  task.reassigning = false
  clearAttemptResult(task)
  task.updatedAt = Date.now()
  return attemptId
}

/** Start a fresh task generation for one owner. */
export function beginTaskAttempt(task: TeamTask, assignee: string): string {
  task.attempt = (task.attempt ?? 0) + 1
  return activateTaskAttempt(task, assignee)
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:691-704](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L691-L704)

验证当前 attempt 并交付或启动成员。

<details>
<summary>查看原文（14行）</summary>

```text
      return await withTeamLock(teamLockKey(root, teamId), async () => {
        const team = await readTeam(root, teamId)
        if (team === undefined || !(await sessionLeadsTeamAsync(ctx, team, captain.id)) || team.halted === true || team.phase === 'staged') return false
        const member = team.members.find(item => item.name === memberName && item.status !== 'removed')
        if (member === undefined || member.stopping === true || team.tasks.some(task => task.reassigning === true && task.assignee === memberName)) return false
        if (attemptId !== undefined && !team.tasks.some(task => task.attemptId === attemptId && task.assignee === memberName && (task.status === 'claimed' || task.status === 'in_progress'))) return false
        if (member.id !== '') return deliverToMember(ctx, captain, member.id, text, signal, mode)
        const selection = await resolveMemberLlmSelection(ctx, captain, {
          provider: member.provider, model: member.model, reasoningEffort: member.reasoningEffort, fallback: member.fallback,
        }, signal)
        await spawnMember(ctx, memberRuntime(config), memberSelections, selection, captain, team, member, config.stateDir, signal, text, member.toolFilter, memberRelaxableDeny(config, member))
        orphan = { ...member }
        delete member.spawnError
        await writeTeam(root, team)
```

</details>

**依据 8 · 源码核查**：[src/tools.ts:1960-1981](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L1960-L1981)

成员身份与 attempt 检查。

<details>
<summary>查看原文（22行）</summary>

```text
      let followUpMessage: import('./types.ts').TeamMessage | undefined
      const updated = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const { team: fresh, identity } = await requireFreshParticipant(ctx, stateRoot, team.id, caller.id)
        const task = requireTask(fresh, args.task_id)
        if (identity.kind === 'captain'
          && task.assignee !== undefined
          && task.assignee !== CAPTAIN_KEY
          && !TERMINAL_TASK_STATUSES.includes(task.status)
          && !(args.status === 'cancelled' && task.status === 'pending' && (task.attempt ?? 0) === 0 && task.reassigning !== true)) {
          throw new Error(`task ${task.id} is owned by member "${task.assignee}"; call agent_teams_reassign_task with assignee="captain" before takeover`)
        }
        if (identity.kind === 'member') {
          if (task.assignee !== identity.name) {
            throw new Error(`task ${task.id} is assigned to "${task.assignee ?? 'nobody'}", not you`)
          }
          if (task.attemptId !== undefined && (args.attempt_id === undefined || args.attempt_id.trim() === '')) {
            throw new Error(`missing attempt_id for task ${task.id}. Retry this update with attempt_id="${task.attemptId}" from your current assignment. This is a missing parameter, not a revoked attempt; do not restart the work or request reassignment.`)
          }
          if (task.attemptId !== undefined && args.attempt_id !== task.attemptId) {
            throw new Error(`stale attempt for task ${task.id}: expected the current attempt_id; stop work and request fresh assignment`)
          }
        }
```

</details>

**依据 9 · 作者声明**：[README_ZH.md:137-144](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/README_ZH.md#L137-L144)

作者描述批准后调度及接管流程。

```text
## 工作方式

1. 当前会话创建团队并成为队长。
2. 队长按角色添加由可续聊子 Agent 驱动的成员。
3. 目标被拆成有负责人和显式依赖的任务。
4. 共享调度器依据真实 `running / idle / ready` 状态，为每个空闲成员原子领取一项就绪任务并唤醒它；驻留成员被中断时会停驻当前 attempt，可通过直接消息继续而不丢 capability；只有冷进程重启后的遗留任务才会生成新 attempt 恢复。
5. 成员携带当前 `attempt_id` 更新任务；转派或队长接管会先撤销旧 attempt、等待原成员安静，再启动新 attempt。
6. 队长汇总结果，随后归档完整团队记录。
```

#### 缺口

- 在目标 DSH 的真实启动、重启和副作用表现
  **影响**：决定端到端恢复可靠性
  **进一步探讨**：使用只读任务在隔离环境验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 并发、恢复与保护边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

attempt 校验可防止旧成员用团队工具覆盖当前任务结果，却不等于撤销成员已产生的文件修改或外部动作。冷恢复可能重新执行工作，需要幂等操作与人工复核；驻留成员有未结束 attempt 时停驻，需显式转派。作者明确质量门禁的第一版范围控制是完成时审计而非宿主写入拦截；多个成员共享工作区时仍需避免编辑冲突。队长和用户还要核对成员结果，任务显示完成不证明代码质量。

#### 证据与依据

**依据 1 · 源码核查**：[src/scheduler.ts:1-11](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L1-L11)

驻留停驻与冷恢复策略。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Event-driven shared task scheduler.
 *
 * Claude Code teammates keep polling the shared task list after a turn. DSH
 * continuable agents instead expose explicit idle/running edges, so this
 * scheduler closes the same loop without keeping a polling turn alive: every
 * idle edge and every task-graph mutation attempts one atomic claim and wakes
 * the selected durable member. A resident member that becomes idle while it
 * still owns an open attempt is parked: only an explicit captain reassignment
 * may rotate that capability. Automatic retry is reserved for cold recovery,
 * when this process has not observed the durable owner settle its open attempt.
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:1971-1981](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L1971-L1981)

旧 attempt 更新拒绝范围。

<details>
<summary>查看原文（11行）</summary>

```text
        if (identity.kind === 'member') {
          if (task.assignee !== identity.name) {
            throw new Error(`task ${task.id} is assigned to "${task.assignee ?? 'nobody'}", not you`)
          }
          if (task.attemptId !== undefined && (args.attempt_id === undefined || args.attempt_id.trim() === '')) {
            throw new Error(`missing attempt_id for task ${task.id}. Retry this update with attempt_id="${task.attemptId}" from your current assignment. This is a missing parameter, not a revoked attempt; do not restart the work or request reassignment.`)
          }
          if (task.attemptId !== undefined && args.attempt_id !== task.attemptId) {
            throw new Error(`stale attempt for task ${task.id}: expected the current attempt_id; stop work and request fresh assignment`)
          }
        }
```

</details>

**依据 3 · 作者声明**：[README_ZH.md:45-51](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/README_ZH.md#L45-L51)

作者声明质量门禁是完成时审计。

```text
| **队长式委派** | 当前会话负责建队、分配角色并汇总最终结果。 |
| **可续聊成员** | 成员是可持续唤醒的 DSH 子 Agent，可以继续执行聚焦的后续轮次。 |
| **带依赖的任务** | 任务有明确状态；依赖未完成时不能领取。 |
| **自动续领与安全接管** | 成员空闲后自动领取下一项就绪任务；转派会撤销旧 attempt，冷恢复会重试遗留任务，迟到结果无法覆盖。 |
| **成员直达消息** | 成员通过持久化邮箱直接联系队友或队长，不需要队长中转。 |
| **实时活动面板** | Web UI 用分段进度、可折叠成员树和可交互 DAG 展示实时工作；运行中的子任务会标出使用的模型，团队结束后仍保留完整成员与任务历史。 |
| **质量门禁** | 人只提供目标和约束。默认任务顺序是需求 → 实现 → 验证 → 审查 → 集成，失败后自动修复/复审，恢复团队必须显式 resume。第一版范围控制是完成时审计，不是 host 写入拦截。详见 [docs/quality-gates.md](./docs/quality-gates.md)。 |
```

#### 缺口

- 进程故障期间成员实际文件或外部副作用
  **影响**：影响重复操作和冲突
  **进一步探讨**：只用只读任务测试恢复并人工检查工作区

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和改进假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

并行成员增加模型调用与上下文成本，队长须拆分任务、管理依赖并复核整合；状态存储和恢复也有成本。已有反证：validateCreateTask 对 implementation 和 repair 与其他 pending、claimed、in_progress 写任务的已声明 inScope 做重叠检查，检测到冲突时要求串行或拆分；该检查在 create_task 和非 staged 计划更新调用，不等于检查所有普通 work 或运行中实际文件写入。现有范围控制为完成时审计。未验证假设：对支持拦截的宿主，在成员实际写入前核对当前 attempt 与声明范围，并在越界时阻止或要求人工处理，可减少未声明文件被并行修改；这需要宿主级接线，可能误拦正常工作并增加延迟。用隔离任务对照未声明写入次数、误拦率与耗时，若未减少冲突或误拦超阈值则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/quality-gates.ts:38-39](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/quality-gates.ts#L38-L39)

写任务类型和开放状态范围。

```text
const WRITE_KINDS: readonly TaskKind[] = ['implementation', 'repair']
const OPEN_STATUSES: readonly TaskStatus[] = ['pending', 'claimed', 'in_progress']
```

**依据 2 · 源码核查**：[src/quality-gates.ts:347-360](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/quality-gates.ts#L347-L360)

声明范围双向路径匹配重叠。

<details>
<summary>查看原文（14行）</summary>

```text
export function inScopeOverlap(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): string[] {
  if (left === undefined || right === undefined) return []
  const hits: string[] = []
  for (const a of left) {
    for (const b of right) {
      if (pathMatchesScope(a, b) || pathMatchesScope(b, a) || a === b) {
        if (!hits.includes(a)) hits.push(a)
      }
    }
  }
  return hits
```

</details>

**依据 3 · 源码核查**：[src/quality-gates.ts:389-390](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/quality-gates.ts#L389-L390)

未指定 kind 默认为普通 work。

```text
export function validateCreateTask(team: TeamState, input: CreateTaskInput): ValidateCreateTaskResult {
  const kind = input.kind ?? 'work'
```

**依据 4 · 源码核查**：[src/quality-gates.ts:451-464](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/quality-gates.ts#L451-L464)

创建时拒绝未串行的开放写任务声明范围重叠。

<details>
<summary>查看原文（14行）</summary>

```text
  if (WRITE_KINDS.includes(kind) && nonemptyStringList(input.inScope)) {
    for (const other of team.tasks) {
      if (!WRITE_KINDS.includes(taskKindOf(other))) continue
      if (!OPEN_STATUSES.includes(other.status)) continue
      if (dependencies.includes(other.id) || other.dependencies.includes('pending-new')) continue
      if (dependencies.includes(other.id)) continue
      const overlap = inScopeOverlap(input.inScope, other.inScope)
      if (overlap.length > 0) {
        return {
          ok: false,
          error: `inScope overlaps ${other.id} at ${overlap.join(', ')}; serialize these tasks or split the paths`,
        }
      }
    }
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:803-812](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L803-L812)

非 staged 的任务更新复核合约。

<details>
<summary>查看原文（10行）</summary>

```text
      }
      validateStagedGraph(fresh, false)
      if (!staged) {
        for (const mutation of mutations) {
          if (mutation.action !== 'update_task') continue
          const task = requireTask(fresh, mutation.taskId)
          const validation = validateCreateTask({ ...fresh, tasks: fresh.tasks.filter(item => item.id !== task.id) }, task)
          if (!validation.ok) throw new Error(validation.error ?? 'edited task violates the quality contract')
        }
      } else fresh.planReviewState = 'awaiting_review'
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:1528-1549](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L1528-L1549)

create_task 入口调用验证。

<details>
<summary>查看原文（22行）</summary>

```text
      // validation so a blank value can neither be rejected spuriously nor be
      // persisted into team.json, where it would brick the team on reload.
      const input = normalizeBlankOptionalTaskFields(args)
      const created = await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        const gate = validateCreateTask(fresh, {
          subject: input.subject,
          description: input.description,
          dependencies: input.dependencies,
          assignee: input.assignee,
          kind: input.kind as TaskKind | undefined,
          round: input.round,
          objective: input.objective,
          inScope: input.inScope,
          outOfScope: input.outOfScope,
          acceptance: input.acceptance,
          verify: input.verify,
          deliverables: input.deliverables,
          nonGoals: input.nonGoals,
          reviewedTaskId: input.reviewedTaskId,
          sourceTaskId: input.sourceTaskId,
          sourceFindingIds: input.sourceFindingIds,
```

</details>

**依据 7 · 作者声明**：[README_ZH.md:45-51](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/README_ZH.md#L45-L51)

作者说明第一版范围控制是完成时审计而非宿主写入拦截。

```text
| **队长式委派** | 当前会话负责建队、分配角色并汇总最终结果。 |
| **可续聊成员** | 成员是可持续唤醒的 DSH 子 Agent，可以继续执行聚焦的后续轮次。 |
| **带依赖的任务** | 任务有明确状态；依赖未完成时不能领取。 |
| **自动续领与安全接管** | 成员空闲后自动领取下一项就绪任务；转派会撤销旧 attempt，冷恢复会重试遗留任务，迟到结果无法覆盖。 |
| **成员直达消息** | 成员通过持久化邮箱直接联系队友或队长，不需要队长中转。 |
| **实时活动面板** | Web UI 用分段进度、可折叠成员树和可交互 DAG 展示实时工作；运行中的子任务会标出使用的模型，团队结束后仍保留完整成员与任务历史。 |
| **质量门禁** | 人只提供目标和约束。默认任务顺序是需求 → 实现 → 验证 → 审查 → 集成，失败后自动修复/复审，恢复团队必须显式 resume。第一版范围控制是完成时审计，不是 host 写入拦截。详见 [docs/quality-gates.md](./docs/quality-gates.md)。 |
```

#### 缺口

- 并行收益、模型费用和冲突率
  **影响**：不能量化相对串行优势
  **进一步探讨**：相同任务比较双成员和单 Agent 并记录耗时费用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用并在何时退出？

**研究主题**：采用判断

#### 完整回答

能拆分独立任务并承担人工汇总的 DSH 用户可先在隔离工作区用两名成员做只读评审，明确依赖与完成证据，观察调度和恢复。相对手动建子 Agent，它提供任务归属与续跑机制，节时尚未测。若发现恢复重复执行、旧成员继续修改文件或费用超过预算，暂停团队，回到单 Agent 串行与人工整合；先核对已产生的工作区变更。

#### 证据与依据

**依据 1 · 源码核查**：[src/scheduler.ts:1-11](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/scheduler.ts#L1-L11)

成员调度与恢复边界。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Event-driven shared task scheduler.
 *
 * Claude Code teammates keep polling the shared task list after a turn. DSH
 * continuable agents instead expose explicit idle/running edges, so this
 * scheduler closes the same loop without keeping a polling turn alive: every
 * idle edge and every task-graph mutation attempts one atomic claim and wakes
 * the selected durable member. A resident member that becomes idle while it
 * still owns an open attempt is parked: only an explicit captain reassignment
 * may rotate that capability. Automatic retry is reserved for cold recovery,
 * when this process has not observed the durable owner settle its open attempt.
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:1971-1981](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/src/tools.ts#L1971-L1981)

任务更新的 attempt 检查。

<details>
<summary>查看原文（11行）</summary>

```text
        if (identity.kind === 'member') {
          if (task.assignee !== identity.name) {
            throw new Error(`task ${task.id} is assigned to "${task.assignee ?? 'nobody'}", not you`)
          }
          if (task.attemptId !== undefined && (args.attempt_id === undefined || args.attempt_id.trim() === '')) {
            throw new Error(`missing attempt_id for task ${task.id}. Retry this update with attempt_id="${task.attemptId}" from your current assignment. This is a missing parameter, not a revoked attempt; do not restart the work or request reassignment.`)
          }
          if (task.attemptId !== undefined && args.attempt_id !== task.attemptId) {
            throw new Error(`stale attempt for task ${task.id}: expected the current attempt_id; stop work and request fresh assignment`)
          }
        }
```

</details>

**依据 3 · 作者声明**：[README_ZH.md:45-51](https://github.com/NanmiCoder/dsh-agent-teams/blob/3331b903f0e954d59ac69be1a75fd4fd7e1de20e/README_ZH.md#L45-L51)

作者说明范围审计边界。

```text
| **队长式委派** | 当前会话负责建队、分配角色并汇总最终结果。 |
| **可续聊成员** | 成员是可持续唤醒的 DSH 子 Agent，可以继续执行聚焦的后续轮次。 |
| **带依赖的任务** | 任务有明确状态；依赖未完成时不能领取。 |
| **自动续领与安全接管** | 成员空闲后自动领取下一项就绪任务；转派会撤销旧 attempt，冷恢复会重试遗留任务，迟到结果无法覆盖。 |
| **成员直达消息** | 成员通过持久化邮箱直接联系队友或队长，不需要队长中转。 |
| **实时活动面板** | Web UI 用分段进度、可折叠成员树和可交互 DAG 展示实时工作；运行中的子任务会标出使用的模型，团队结束后仍保留完整成员与任务历史。 |
| **质量门禁** | 人只提供目标和约束。默认任务顺序是需求 → 实现 → 验证 → 审查 → 集成，失败后自动修复/复审，恢复团队必须显式 resume。第一版范围控制是完成时审计，不是 host 写入拦截。详见 [docs/quality-gates.md](./docs/quality-gates.md)。 |
```

#### 缺口

- 宿主恢复能力及实际工作区状态
  **影响**：决定团队运行安全与可用性
  **进一步探讨**：使用只读任务验证并检查状态和工作区

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
