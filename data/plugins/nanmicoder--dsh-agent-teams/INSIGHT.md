# DSH AgentTeams

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4354b0f](https://github.com/NanmiCoder/dsh-agent-teams/tree/4354b0f6a793b75c1904c0ee85eef4043a37c733)

<!-- BEGIN META -->
[![GitHub ★ 2,903](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C903&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 61,277](https://img.shields.io/static/v1?label=npm+30d&message=61%2C277&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)
<!-- END META -->

> **功能**：为 DSH 提供队长与可续聊成员、依赖任务、持久邮箱、质量门禁和 Web 团队视图。

> **亮点**：把任务依赖、成员分工、attempt 和审阅字节放在同一流程，并适配新宿主的成员投递与定向停止。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

> **主要限制**：模型批准的非空字符串无法证明用户授权。Team 状态、工具过滤与审计各有边界；halt 落盘也可能早于实际停止。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 相比手工叫两个子 Agent 并记录清单，任务何时领取、投递和重新归属？](#detail-section-11)
  - [Q02 · 宿主更换子代理树后，新旧入口如何创建、送达和恢复成员？](#detail-section-12)
  - [Q03 · 成员已汇报后的宿主结算如何去重，停队会不会影响其他分支？](#detail-section-13)
  - [Q04 · 通过质量门禁能证明任务通过真实验收吗？](#detail-section-14)
  - [Q05 · 什么试用能区分任务编排收益和重新派发的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能拆分独立任务并承担整合的 DSH 负责人，希望复用成员会话并查清任务交接。

用原生子 Agent、共享任务清单与人工核对结果完成分工。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 依赖任务派发 | 组织并行成员 | 核对当前 attempt 与实际结果 |
| 审阅绑定 | 保存审阅范围及字节 | 命令执行仍须独立核对 |
| 定向停止 | 停成员及后代 | 持久 halted 和实际停净要分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 子代理 provider 与模型 | 必需 | 创建、送达与执行 | 成员启动或恢复失败 |
| 本地工作区和状态目录 | 必需 | 保存任务、邮件、审计与归档 | 需检查读取与权限 |
| Web 宿主及注册表 | Web 面板条件 | 观察活动及队长控制 | 保留工具路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 计划 | 负责人建暂存计划并确认依赖 | 明确用户批准后开始 |
| 派发 | 队长读取当前 attempt 和邮件 | 已入队与完成分别核对 |
| 验收 | 负责人检查真实命令与审阅字节 | 缺口或漂移时重新验证 |
| 退出 | 负责人停队并独立核宿主和工作区 | 确认残留后归档或人工接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Host 和模型资源按配置 | 拆分任务、权限和约束 | 兼容性未本地实测 |
| 持续 | 并行模型、邮箱和审计资源 | 核对结果及去重、完成整合 | 净节时未知 |
| 异常与退出 | 潜在重复模型和业务操作 | 核 drain、恢复工作区、检查归档 | 没有外部副作用回滚保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 依赖任务交接 | 持久归属和状态门 | 真实并行净收益 |
| 结算去重 | 按报告和成功状态去重 | 跨版本稳定性 |
| 审阅与停止 | 绑定字节、定向停止分支 | 独立业务验收和运行时停净 |

> **思考**：模型批准的非空字符串无法证明用户授权。Team 状态、工具过滤与审计各有边界；halt 落盘也可能早于实际停止。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把任务依赖、成员分工、attempt 和审阅字节放在同一流程，并适配新宿主的成员投递与定向停止。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

兼容层分别探测创建、投递和定向 drain，冷恢复前绑定成员配置。新 Host 内部 manager 形状改变仍可能失效。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

模型批准的非空字符串无法证明用户授权。Team 状态、工具过滤与审计各有边界；halt 落盘也可能早于实际停止。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在低权限工作区做两个只读成员试用，明确审批和成本上限。停队后独立核宿主与产物，未确认时不要重派写任务。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持任务与邮件追踪、审阅绑定、Host 兼容与定向停止。跨端实际可靠性、强审批、隔离和净收益尚待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/index.ts、src/tools.ts、src/harness-compat.ts、src/scheduler.ts、src/mailbox.ts、src/quality-gates.ts、src/client/index.tsx、src/members.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：对照两份固定源码的调度、质量门禁、邮箱、定向停止与兼容层。客户端业务重点为导航和状态入口，未执行真实 DSH、模型、测试或外部命令。
- 下一步：对照新旧宿主的投递、冷恢复、成员树停止与队长唤醒，并以人工对照核查命令、字节和费用。

**分析版本**

- **仓库**：[NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)
- **版本号**：0.1.30（[固定提交 4354b0f](https://github.com/NanmiCoder/dsh-agent-teams/tree/4354b0f6a793b75c1904c0ee85eef4043a37c733)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把实际路径操作权限绑定到成员及 attempt，转派时撤销旧权限，可能减少旧任务继续写入。[Q05](#research-q05)

对照新旧宿主的投递、冷恢复、成员树停止与队长唤醒，并以人工对照核查命令、字节和费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 74 | 20228 | 17877 | 1107 | — |
| .md | source | 219 | 30084 | — | — | 468887 |
| .md | example | 44 | 3998 | — | — | 39474 |
| .mjs | test | 43 | 6841 | 5943 | 442 | — |
| .mjs | example | 27 | 2165 | 2032 | 90 | — |
| .ts | example | 2 | 136 | 100 | 26 | — |
| .js | source | 40 | 18672 | 16218 | 2477 | — |
| .ts | source | 32 | 14862 | 11470 | 2616 | — |
| .tsx | source | 7 | 2671 | 2404 | 141 | — |

</details>

**活跃度**

[![Issue 未关闭 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=43&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 73](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=73&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 67](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=67&color=737b86&logo=github)](https://github.com/NanmiCoder/dsh-agent-teams/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：当两名成员并行处理有依赖的任务时，插件能否在宿主升级、重新派发和停止后保持任务归属、消息与验收可追？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比手工叫两个子 Agent 并记录清单，任务何时领取、投递和重新归属？

**研究主题**：场景与需求、贡献与相对优势、功能与机制、缺陷与关键质疑

#### 完整回答

适用对象是能拆分依赖、核对原件和整合结果的负责人。插件把依赖清单和成员分配变成可重读的持久状态。approval=required 能暂存计划，模型工具的执行路径仅检查非空 confirmation 和队长资格后批准，用户在新回合明确批准仍是操作者应遵守的边界。调度按状态和依赖找到任务并持锁分配 attempt，发送前再核当前队长、阶段、成员和 attempt。accepted 只说明调度投递返回成功；失败回滚要比对 attempt，冷恢复失败恢复原持久记录并停放，以免状态轮询无上限生成新尝试。状态归属限制工具提交，无法阻断已发给外部系统的副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:946-972](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L946-L972)

计划可选 required，默认兼容 automatic。

<details>
<summary>查看原文（27行）</summary>

```text
    description: 'Create a team. Use approval=required for a two-phase plan: members and tasks remain unspawned/unclaimed until the user reviews the Web plan and explicitly approves it. Optional profiles expand their configured roster; seed profiles also expand template tasks, while captain profiles leave the graph for the Captain to design. approval=automatic preserves the legacy immediate-execution path.',
    parameters: {
      name: { type: 'string', required: true, description: 'Name for the new team (used as its stable id).' },
      description: { type: 'string', description: 'Team purpose / the goal the team will work on.' },
      profile: { type: 'string', description: 'Optional configured profile name.' },
      plan: {
        type: 'object', additionalProperties: false,
        description: 'Optional complete ordinary-work roster and DAG in one atomic call, instead of separate add_member/create_task rounds. Mutually exclusive with profile. For quality gates use create_task with the explicit quality contract.',
        properties: {
          members: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
            name: { type: 'string', required: true }, role: { type: 'string' },
            provider: { type: 'string' }, model: { type: 'string' }, reasoning_effort: { type: 'string' },
            tool_policy: { type: 'string', description: 'Optional owner-declared tool-policy id for this member.' },
          } } },
          tasks: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
            id: { type: 'string', required: true, description: 'Local reference used by dependencies in this plan; the result maps it to a durable task id.' },
            subject: { type: 'string', required: true }, description: { type: 'string' }, assignee: { type: 'string' },
            dependencies: { type: 'array', items: { type: 'string' } },
          } } },
        },
      },
      approval: {
        type: 'string',
        enum: ['required', 'automatic'],
        description: 'required stages the plan for explicit user review; automatic starts immediately. Defaults to automatic for API compatibility.',
      },
    },
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:1280-1308](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L1280-L1308)

批准工具描述与实际执行检查不同。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'agent_teams_approve',
    description: 'Approve and start a staged team plan. Call this only in response to an explicit user approval in a new user turn; never call it during the turn that created or edited the plan. The Web Approve & Run button uses the same runtime directly.',
    parameters: {
      confirmation: { type: 'string', required: true, description: 'The user\'s explicit approval statement.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          status: { type: 'string', required: true },
          team_id: { type: 'string', required: true },
          members: { type: 'number', required: true },
          tasks: { type: 'number', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Team ${value.team_id} approved and running (${value.members} members, ${value.tasks} tasks).`,
      }],
    },
    async execute(args, exec) {
      if (args.confirmation.trim() === '') throw new Error('explicit user approval text is required')
      const captain = requireCaptain(exec)
      const workspace = workspaceOf(captain)
      const team = await requireCaptainTeam(ctx, workspace, config, captain)
      const approved = await approveStagedTeam(captain, team.id, exec.signal)
      return { status: 'running', team_id: approved.teamId, members: approved.members, tasks: approved.tasks }
```

</details>

**依据 3 · 源码核查**：[src/scheduler.ts:365-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/scheduler.ts#L365-L400)

调度生成 attempt，审查任务记录起始字节快照，并落盘。

<details>
<summary>查看原文（36行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:693-709](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L693-L709)

投递重查队长、阶段、成员和 attempt。

<details>
<summary>查看原文（17行）</summary>

```text
    try {
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
        orphan = undefined
        return true
```

</details>

**依据 5 · 源码核查**：[src/scheduler.ts:448-479](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/scheduler.ts#L448-L479)

accepted 与按原 attempt 进行失败回滚。

<details>
<summary>查看原文（32行）</summary>

```text
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
            task.status = ticket.previousStatus
            task.assignee = ticket.previousAssignee
            task.attempt = ticket.previousAttempt
            task.attemptId = ticket.previousAttemptId
            Object.assign(task, ticket.previousResult)
            parkedAttempts.set(ticket.memberId, ticket.previousAttemptId)
          } else {
            task.status = 'pending'
            task.assignee = ticket.previousAssignee
            task.attemptId = undefined
            parkedAttempts.delete(ticket.memberId)
          }
          task.handoffId = undefined
          task.reassigning = false
```

</details>

#### 缺口

- 未测并发批准、宿主崩溃和外部副作用
  **影响**：无法确认实际恢复时会否重发业务操作
  **进一步探讨**：用只读任务触发投递失败、转派、宿主中止和重启后核对记录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主更换子代理树后，新旧入口如何创建、送达和恢复成员？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

旧宿主可用 continuable/setup 等接口，现代宿主可用 startActivation，新树按 rootOf 与 prompt 探测后还要求 manager 的 deliverToMember、dispose 和 resident。队列和插话都走树的 deliverToMember，分别标注 queue 和 steer，送入前 authorize 再取 live caller 对应根，变化就拒绝。新 managed 创建请求不直接传旧 persona/toolFilter，而从模型选择和成员 setup 接回这些约束。旧宿主直接注册 setup，现代宿主在 agent ready 中同步装配并补挂已存在成员；非 vetoable 通知出错会增加 agent/request 拒绝钩子，避免默认模型继续。确切宿主版本及扩展接线仍需同版本验证，内部 manager 变化会触发不兼容。Web 面板的成员跳转另依赖会话和布局服务。

#### 证据与依据

**依据 1 · 源码核查**：[src/harness-compat.ts:82-122](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L82-L122)

识别 tree 形状，并在原生 inbox 接收前复核精确 live caller。

<details>
<summary>查看原文（41行）</summary>

```text
function treeBoundary(runtime: Context['subagents']): TreeBoundary | undefined {
  const tree = runtime as unknown as TreeBoundary & { prompt?: unknown }
  if (typeof tree.rootOf !== 'function' || typeof tree.prompt !== 'function') return undefined
  if (typeof tree.manager?.deliverToMember !== 'function' || typeof tree.manager.dispose !== 'function'
      || !(tree.manager.resident instanceof Map)) return unsupported('missing audited tree delivery manager')
  return tree
}

/** Track exact branch work before its first await so a targeted stop can join it. */
function trackTreeWork<T>(
  manager: TreeManager, root: Agent, branch: readonly SessionId[], signal: AbortSignal,
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const pending = treeWork.get(manager) ?? new Set<TreeWork>()
  treeWork.set(manager, pending)
  const controller = new AbortController()
  let finish!: () => void
  const settled = new Promise<void>(resolve => { finish = resolve })
  const work = { root, branch, controller, settled }
  pending.add(work)
  try {
    return operation(AbortSignal.any([signal, controller.signal])).finally(() => { pending.delete(work); finish() })
  } catch (error) {
    pending.delete(work)
    finish()
    throw error
  }
}

function deliverTreePrompt(
  runtime: Context['subagents'], tree: TreeBoundary, parent: Agent, childId: SessionId,
  content: ContentBlock[], source: MessageSource, signal: AbortSignal, delivery: 'queue' | 'steer',
): Promise<MessageId> {
  const root = tree.rootOf.call(runtime, parent)
  return tree.manager.deliverToMember.call(tree.manager, root, childId, content, {
    source, signal, delivery,
    // Recheck the exact live caller immediately before native inbox acceptance.
    authorize: () => {
      if (tree.rootOf.call(runtime, parent) !== root) throw new SubagentError('AgentTeams caller left its subagent tree', 'UNAUTHORIZED')
    },
  })
```

</details>

**依据 2 · 源码核查**：[src/harness-compat.ts:146-163](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L146-L163)

区分 managed startActivation 与旧 startContinuable。

<details>
<summary>查看原文（18行）</summary>

```text
export function usesManagedActivations(runtime: Context['subagents']): boolean {
  return typeof (runtime as unknown as CreationBoundary).startActivation === 'function'
}

export async function startMember(runtime: Context['subagents'], spec: MemberStartSpec): Promise<{ childId: SessionId }> {
  const host = runtime as unknown as CreationBoundary
  if (typeof host.startActivation === 'function') {
    const { persona: _persona, toolFilter: _filter, ...request } = spec.request
    const activation = await Reflect.apply(host.startActivation, runtime, [treeBoundary(runtime) === undefined
      ? { ...spec, request, delivery: 'parent' }
      : { provider: spec.provider, label: spec.label, ...request, signal: spec.signal, delivery: 'parent' }]) as { childId: SessionId; result: Promise<unknown> }
    // Preserve native settlement as the missing-report/error fallback on both
    // fresh and resumed activations. mailbox.ts deduplicates successful reports.
    void activation.result.catch(() => undefined)
    return activation
  }
  if (typeof host.startContinuable !== 'function') return unsupported('missing member creation API')
  return host.startContinuable.call(runtime, spec)
```

</details>

**依据 3 · 源码核查**：[src/harness-compat.ts:343-403](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L343-L403)

先装 setup、冷恢复补挂及请求拒绝。

<details>
<summary>查看原文（61行）</summary>

```text
export function installContinuableMemberSetup(ctx: Context, setup: Setup): void {
  const runtime = boundary(ctx.subagents)
  if (typeof runtime.registerContinuableSetup === 'function') {
    // Upstream owns this registration with this.ctx.effect. Cordis resolves
    // that ctx to the accessing plugin, so its disposal revokes installations
    // even while the subagents service and child Agents remain live.
    runtime.registerContinuableSetup.call(ctx.subagents, (childCtx) => {
      if (childCtx.agent === undefined) return unsupported('legacy setup lacks child Agent')
      return setup(childCtx, childCtx.agent)
    })
    return
  }
  if (treeBoundary(ctx.subagents) === undefined && ((typeof runtime[hostPromptQueue] !== 'function' && typeof runtime[hostPromptDeliver] !== 'function') || typeof runtime.sendMessage !== 'function')) {
    return unsupported('missing continuable setup and modern host queue')
  }
  const installed = new WeakSet<Agent>()
  const active = new Set<() => void>()
  ctx.effect(() => {
    const attach = (agent: Agent, vetoable: boolean): void => {
      if (installed.has(agent)) return
      // Deliberately synchronous: awaiting here loses the first-request race.
      let teardown: () => void
      try {
        teardown = setup(agent.ctx, agent)
      } catch (error: unknown) {
        if (vetoable) throw error
        // session-start is a notification: Harness logs a thrown listener and
        // still admits the first prompt. Reject request assembly explicitly so
        // a malformed saved route cannot silently execute on a default model.
        const failure = new Error(`agent-teams: member initialization failed: ${String(error)}`, { cause: error })
        ctx.logger.warn(failure.message)
        teardown = agent.ctx.on('agent/request', () => { throw failure })
      }
      installed.add(agent)
      let disposed = false
      const dispose = (): void => {
        if (disposed) return
        disposed = true
        active.delete(dispose)
        installed.delete(agent)
        teardown()
      }
      active.add(dispose)
      // Listeners contributed to agent.ctx already follow its lifetime. Also
      // release our bookkeeping and remove them if this plugin is reloaded.
      try {
        agent.ctx.effect(() => dispose, 'agent-teams: child compatibility setup')
      } catch (error) {
        dispose()
        throw error
      }
    }
    const stop = onAgentReady(ctx, attach)
    const cleanup = (): void => {
      stop()
      for (const dispose of [...active]) dispose()
    }
    try {
      // Reloads keep Agents alive but dispose the previous plugin's setup.
      // Subscribe first, then hydrate the live registry; attach is idempotent.
      for (const agent of ctx.agents.list()) attach(agent, false)
```

</details>

**依据 4 · 源码核查**：[src/harness-compat.ts:413-451](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L413-L451)

queue 和 steer 按能力选择实际宿主交付。

<details>
<summary>查看原文（39行）</summary>

```text
export async function queueMemberPrompt(
  runtime: Context['subagents'], parent: Agent, childId: SessionId,
  content: ContentBlock[], signal: AbortSignal,
): Promise<MessageId> {
  const host = boundary(runtime)
  const source = agentTeamsSource({ kind: 'agent-teams' }, observedSessionFormatVersion(parent))
  const tree = treeBoundary(runtime)
  if (tree !== undefined) return deliverTreePrompt(runtime, tree, parent, childId, content, source, signal, 'queue')
  if (typeof host.followup === 'function') {
    return host.followup.call(runtime, parent, childId, content, { source, signal })
  }
  const deliver = host[hostPromptDeliver]
  if (typeof deliver === 'function') return deliver.call(runtime, parent, childId, content, source, signal, 'queue')
  const queue = host[hostPromptQueue]
  if (typeof queue !== 'function') return unsupported('missing host FIFO delivery')
  return queue.call(runtime, parent, childId, content, source, signal)
}

/** Coordination joins the nearest step, including waking an idle/cold child. */
export async function steerMemberPrompt(
  runtime: Context['subagents'], parent: Agent, childId: SessionId,
  content: ContentBlock[], signal: AbortSignal, live?: Agent,
): Promise<MessageId> {
  const host = boundary(runtime)
  const source = agentTeamsSource({ kind: 'agent-teams' }, observedSessionFormatVersion(live ?? parent))
  const tree = treeBoundary(runtime)
  if (tree !== undefined) return deliverTreePrompt(runtime, tree, parent, childId, content, source, signal, 'steer')
  const deliver = host[hostPromptDeliver]
  if (typeof deliver === 'function') return deliver.call(runtime, parent, childId, content, source, signal, 'steer')
  if (typeof host.sendMessage === 'function') return host.sendMessage.call(runtime, parent, childId, content, { signal })
  if (typeof host.followup === 'function') {
    if (live === undefined) return queueMemberPrompt(runtime, parent, childId, content, signal)
    if (live.id !== childId || live.session.header.parentSession !== parent.id) throw new Error('invalid member steering authority')
    signal.throwIfAborted()
    const message = createUserMessage({ content, source })
    live.steer(message)
    return message.id
  }
  return unsupported('missing step-boundary message delivery')
```

</details>

**依据 5 · 源码核查**：[src/members.ts:1008-1058](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/members.ts#L1008-L1058)

检查 provider 能力并传入成员模型、角色与工具约束。

<details>
<summary>查看原文（51行）</summary>

```text
  const provider = ctx.subagents.getProvider(config.provider)
  if (provider === undefined) {
    throw new Error(
      `agent-teams: no subagent provider "${config.provider}" is registered (available: ${ctx.subagents.list().join(', ') || 'none'}) — `
      + 'check that the subagent provider row (e.g. subagent-spawn) is mounted in the composition',
    )
  }
  if (provider.prepareContinuable === undefined) {
    throw new Error(`agent-teams: provider "${config.provider}" does not support continuable members`)
  }
  const legacyCapabilities = provider.capabilities as unknown as { persona?: boolean; toolFilter?: boolean }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.persona) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot apply a member persona`)
  }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.toolFilter) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot restrict captain-only tools for members`)
  }
  const label = `${MEMBER_LABEL_PREFIX}${team.id}:${member.name}`
  // The legacy filter of a member without a configured tool policy: the
  // captain-only deny list plus the depth entries this host registers.
  const requestedFilter = resolvedFilter ?? memberToolFilter(config.maxDepth, restrictableToolNames(captain))
  // The lenient retry may drop names this host reports unknown; keep the exact
  // filter the host accepted for the durable member setup.
  let acceptedFilter = requestedFilter
  const start = await startMemberWithLenientFilter(
    toolFilter => {
      acceptedFilter = toolFilter
      const setup = { persona: memberPersona(team, member, stateDir, config.executionPrompt), toolFilter }
      return selections.withPending(captain.id, label, llmSelection, () => startMember(ctx.subagents, {
        provider: config.provider,
        label,
        request: {
          prompt: [{ type: 'text', text: initialPrompt ?? memberWelcome(team, member.name) }],
          parent: captain,
          persona: memberPersona(team, member, stateDir, config.executionPrompt),
          // Depth deny entries name host tools; resolve them against the
          // running host's registry so a renamed delegation tool cannot abort
          // the spawn (see memberToolFilter). Depth is still enforced by the
          // parent-chain guard installed at plugin mount. A filter the host
          // still rejects is retried without the names it reported.
          toolFilter,
          agentOptions: {
            provider: llmSelection.provider,
            model: llmSelection.model,
            ...llmSelection.reasoningEffort === undefined
              ? {}
              : { reasoningEffort: ReasoningEffortId(llmSelection.reasoningEffort) },
          },
          // Harness request.maxDepth caps the absolute depth of THIS creation;
          // it is not inherited by later delegations. The guard below enforces
          // the configured member-relative descendant budget instead.
```

</details>

**依据 6 · 源码核查**：[src/client/index.tsx:39-83](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/client/index.tsx#L39-L83)

客户端面板需宿主导航和会话服务。

<details>
<summary>查看原文（45行）</summary>

```text
/** Required services: conversation nodes, slots, sessions navigation, and locale. */
export const inject = ['uiConversation', 'slots', 'sessions', 'locale', 'modelDirectories', 'layout']

/** The host supplies this hook for the lifetime of a 0.1.5 root slot. */
interface PanelNavigationProps {
  usePanelInfo?: UsePanelInfo
}
const useLegacyPanelInfo: UsePanelInfo = select => select({ activePanelId: null })

/** The replayed user message is the canonical transcript entry. */
function HiddenAgentTeamsCommand(): null {
  return null
}

/**
 * Register the activity monitor in the shell's additive overlay and the
 * in-conversation team card. The card's activity button re-opens a folded
 * monitor via a window event — the recovery path for an old session.
 */
export function apply(ctx: ClientContext): void {
  const bridge = createWorkspaceBridge()
  const state = createWorkspaceState()
  ctx.effect(
    () => ctx.locale.register(AGENT_TEAMS_LOCALE_NAMESPACE, { zh, en }),
    'agent-teams: dictionaries',
  )
  const openMember = (parentId: SessionId, childId: SessionId): void => {
    void openAgentTeamMember(ctx.sessions, parentId, childId, ctx.layout as AgentTeamsLayoutNavigator, ctx.get('uiWorkspace') as AgentTeamsWorkspaceNavigator | undefined).catch((error: unknown) => {
      console.warn(`agent-teams: failed to open member transcript ${childId}: ${String(error)}`)
    })
  }
  const Panel = ({ t, usePanelInfo }: PropsLocale<'agentTeams'> & PanelNavigationProps) => {
    // A host's standard hook set is fixed for this mounted plugin instance.
    const usePanel = usePanelInfo ?? useLegacyPanelInfo
    const conversationVisible = usePanel(panel => panel.activePanelId === null)
    return (
    <ActivitySurface
      bridge={bridge}
      state={state}
      conversationVisible={conversationVisible}
      sessionsList={ctx.sessions.list}
      modelDirectories={ctx.modelDirectories}
      openMember={openMember}
      t={t}
    />
```

</details>

#### 缺口

- 未重跑固定宿主真实兼容矩阵
  **影响**：不能确认本地部署有匹配的私有 manager 合约和 Web 服务
  **进一步探讨**：两版宿主分别测试冷恢复、工具限制以及投递丢失

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 成员已汇报后的宿主结算如何去重，停队会不会影响其他分支？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

邮箱按当前 attempt 排除旧分配，状态损坏时保留 host 输入并将邮件留未 ack。新原生结算用 stopReason completed，旧端按原摘要匹配；只有没有活跃任务、最近任务完成并有已投递或已读报告，才压掉重复成功通知，其他失败或缺报告仍走宿主结算。定向停成员会取消选定分支的在途工作并等 settled，再遍历同一 root 且祖先匹配的成员及后代；失败汇总抛出，跳过无关兄弟。整体 halt 先落盘和取消队长，再尝试 drain；找不到活跃队长只告警，持久 halted 不说明实际停净。delete 移到归档，数据依然在盘，外部副作用需独立核。

#### 证据与依据

**依据 1 · 源码核查**：[src/mailbox.ts:11-18](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/mailbox.ts#L11-L18)

邮件关联当前尝试。

```text
export function isCurrentMail(team: TeamState, message: TeamMessage): boolean {
  if (message.discardedAt !== undefined) return false
  if (message.sourceAttemptId !== undefined && !team.tasks.some(task => task.id === message.sourceTaskId
    && task.attemptId === message.sourceAttemptId && task.assignee === message.from
    && (message.sourceTaskStatus === undefined || !['completed', 'failed', 'cancelled'].includes(task.status) || message.sourceTaskStatus === task.status))) return false
  if (message.attemptId === undefined) return true
  return team.tasks.some(task => task.id === message.taskId && task.attemptId === message.attemptId
    && task.assignee === message.to && (task.status === 'claimed' || task.status === 'in_progress'))
```

**依据 2 · 源码核查**：[src/mailbox.ts:89-110](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/mailbox.ts#L89-L110)

冗余成功结算需要最近 completed 与已递送报告，异常降级。

<details>
<summary>查看原文（22行）</summary>

```text
      try {
        const owned = await findTeamByCaptain(root, payload.agent.id, await leadIdentityOfAsync(ctx, payload.agent.session))
        if (owned !== undefined) await withTeamLock(`team:${root}:${owned.id}`, async () => {
          const team = await readTeam(root, owned.id)
          if (team === undefined || !(await sessionLeadsTeamAsync(ctx, team, payload.agent.id)) || team.halted) return
          const reports = await readMailbox(root, team.id, CAPTAIN_KEY)
          for (const member of team.members) {
            if (!successfulSettlements.has(member.id) || member.status === 'removed' || member.stopping) continue
            const tasks = team.tasks.filter(task => task.assignee === member.name)
            if (tasks.some(task => task.status === 'claimed' || task.status === 'in_progress')) continue
            const latest = tasks.filter(task => (task.attempt ?? 0) > 0 || task.status === 'completed').sort((a, b) => b.updatedAt - a.updatedAt)[0]
            if (latest?.status === 'completed' && reports.some(report => report.from === member.name && report.ts >= latest.updatedAt
              && report.discardedAt === undefined && (report.deliveredAt !== undefined || report.readAt !== undefined))) {
              redundantSettlements.add(member.id)
            }
          }
        })
      } catch (error: unknown) {
        // A corrupt AgentTeams state file (e.g. an invalid team.json) must never
        // hold the host's step admission hostage: degrade to plain admission.
        ctx.logger?.warn(`agent-teams: mailbox admission degraded to plain pass-through for agent ${payload.agent.id}: could not read team state under ${root} (a team.json may be corrupt or unreadable): ${String(error)}`)
        return decision
```

</details>

**依据 3 · 源码核查**：[src/harness-compat.ts:333-339](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L333-L339)

结构化 stopReason 和旧摘要回退。

```text
/** rc.2 summaries use tree names; the new structured reason owns the outcome. */
export function successfulSubagentSettlement(source: MessageSource | undefined): source is Extract<MessageSource, { kind: 'subagent-settled' }> {
  if (source?.kind !== 'subagent-settled') return false
  const current = source as typeof source & { stopReason?: string }
  return current.stopReason === undefined
    ? source.summary === `Background subagent ${source.senderSessionId} finished and will do no further work unless you send it more.`
    : current.stopReason === 'completed'
```

**依据 4 · 源码核查**：[src/mailbox.ts:127-166](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/mailbox.ts#L127-L166)

按 recipient、有效 attempt 和读标记重装消息，失败保持原输入。

<details>
<summary>查看原文（40行）</summary>

```text
      const { receipt } = batch
      try {
        await withTeamLock(`team:${root}:${receipt.teamId}`, async () => {
          const team = await readTeam(root, receipt.teamId)
          if (team === undefined) return
          // Captain mail is admitted for any lead session of the team: after a
          // fork the human reads it in the fork while members still address the
          // recorded captain. Acknowledging marks it read for both.
          const isCaptainRecipient = receipt.recipient === CAPTAIN_KEY
            && await sessionLeadsTeamAsync(ctx, team, payload.agent.id)
          const recipientId = receipt.recipient === CAPTAIN_KEY ? team.captainSessionId
            : team.members.find(member => member.name === receipt.recipient && member.status !== 'removed' && member.stopping !== true)?.id
          if (!isCaptainRecipient && recipientId !== payload.agent.id) return
          const selected = (await readMailbox(root, team.id, receipt.recipient)).filter(message => batch.ids.has(message.id))
          const current = selected.filter(message => message.readAt === undefined && isCurrentMail(team, message))
          await discardMailboxMessages(root, team.id, receipt.recipient, selected.filter(message => !isCurrentMail(team, message)).map(message => message.id))
          await acknowledgeMailbox(root, team.id, receipt.recipient, current.map(message => message.id))
          batch.current = new Map(current.map(message => [message.id, message]))
        })
      } catch (error: unknown) {
        // Narrow containment, per team: the messages of this batch are not
        // acked (the teamId/recipient above identify the unread mail), but the
        // receipt inputs still pass through untouched instead of holding the
        // host's step admission hostage.
        batch.failed = true
        ctx.logger?.warn(`agent-teams: mailbox admission degraded to plain pass-through for agent ${payload.agent.id}: could not read team "${receipt.teamId}" (state under ${root} may be corrupt or unreadable, recipient ${receipt.recipient} mail left unacked): ${String(error)}`)
      }
    }
    const admitted = []
    for (const { input, receipt, batch } of inputs) {
      if (successfulSubagentSettlement(input.source) && redundantSettlements.has(input.source.senderSessionId)) continue
      if (receipt === undefined || batch === undefined || batch.failed === true) { admitted.push(input); continue }
      const messages = []
      for (const id of receipt.ids) {
        const message = batch.current.get(id)
        if (message === undefined) continue
        batch.current.delete(id)
        messages.push(message)
      }
      if (messages.length > 0) admitted.push({ ...input, content: [{ type: 'text' as const, text: mailboxBody(receipt.recipient, messages) }] })
```

</details>

**依据 5 · 源码核查**：[src/harness-compat.ts:455-484](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L455-L484)

树投递对退役成员做共享检查，追踪在途分支。

<details>
<summary>查看原文（30行）</summary>

```text
export function guardSubagentDelivery(
  ctx: Context, isRetired: (sender: Agent, targetId: SessionId) => Promise<boolean>,
): void {
  const runtime = ctx.subagents
  const tree = treeBoundary(runtime)
  if (tree !== undefined) {
    const manager = tree.manager
    ctx.effect(() => {
      const original = manager.deliverToMember
      const descriptor = Object.getOwnPropertyDescriptor(manager, 'deliverToMember')
      let active = true
      const guarded: TreeDeliver = async (root, childId, content, options) => {
        if (!active) return original.call(manager, root, childId, content, options)
        const branch = [childId, ...manager.resident.get(childId)?.ancestors ?? []]
        return trackTreeWork(manager, root, branch, options.signal, async signal => {
          signal.throwIfAborted()
          if (await isRetired(root, childId)) {
            throw new SubagentError(`AgentTeams member "${childId}" was retired and cannot be resumed`, 'NOT_RESUMABLE')
          }
          signal.throwIfAborted()
          return original.call(manager, root, childId, content, { ...options, signal })
        })
      }
      manager.deliverToMember = guarded
      return () => {
        active = false
        if (Object.getOwnPropertyDescriptor(manager, 'deliverToMember')?.value !== guarded) return
        if (descriptor === undefined) Reflect.deleteProperty(manager, 'deliverToMember')
        else Object.defineProperty(manager, 'deliverToMember', descriptor)
      }
```

</details>

**依据 6 · 源码核查**：[src/harness-compat.ts:649-672](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L649-L672)

只等待及销毁目标分支，并报告销毁错误。

<details>
<summary>查看原文（24行）</summary>

```text
export async function drainMemberChildren(runtime: Context['subagents'], parent: Agent, ids: readonly SessionId[]): Promise<void> {
  const tree = treeBoundary(runtime)
  if (tree !== undefined) {
    const root = tree.rootOf.call(runtime, parent)
    const selected = new Set(ids)
    // The native tree-wide drain also stops unrelated siblings and permanently
    // closes the captain. Join only work in the selected creation branches.
    const pending = [...treeWork.get(tree.manager) ?? []].filter(work => work.root === root && work.branch.some(id => selected.has(id)))
    for (const work of pending) work.controller.abort()
    await Promise.all(pending.map(work => work.settled))
    const targets = [...tree.manager.resident.values()].filter(item => item.root === root
      && item.ancestors.includes(parent.id) && (selected.has(item.childId) || item.ancestors.some(id => selected.has(id))))
    const results = await Promise.allSettled(targets.map(item => tree.manager.dispose.call(tree.manager, item)))
    const failures = results.flatMap(result => result.status === 'rejected' ? [result.reason as unknown] : [])
    if (failures.length) throw new AggregateError(failures, 'AgentTeams member teardown failed')
    return
  }
  const host = runtime as unknown as {
    drainChildren?: (parent: Agent, ids: readonly SessionId[]) => Promise<void>
    drainContinuableChildren?: (parent: Agent, ids: readonly SessionId[]) => Promise<void>
  }
  const drain = host.drainChildren ?? host.drainContinuableChildren
  if (typeof drain !== 'function') return unsupported('missing targeted child drain')
  await drain.call(runtime, parent, ids)
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:575-625](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L575-L625)

halt 持久状态早于 drain，并可能找不到队长。

<details>
<summary>查看原文（51行）</summary>

```text
    const now = Date.now()
    let cancelledTasks = 0
    for (const task of fresh.tasks) {
      if (TERMINAL_TASK_STATUSES.includes(task.status)) continue
      cancelUnfinishedTask(task, 'Stopped from the captain chat.')
      cancelledTasks += 1
    }
    for (const member of fresh.members) {
      if (member.status === 'removed') continue
      member.status = 'idle'
    }
    fresh.halted = true
    fresh.haltedAt = now
    await writeTeam(input.stateRoot, fresh)
    appendTeamEvent(input.ctx, captainSessionOf(input.ctx, fresh.captainSessionId, input.captain.session), 'agent-teams/team-halted', {
      teamId: fresh.id,
      cancelledTasks,
    })
    return {
      teamName: fresh.name,
      captainSessionId: fresh.captainSessionId,
      cancelledTasks,
      alreadyHalted: false,
      members: fresh.members.filter((member) => member.id !== '' && member.status !== 'removed').map((member) => ({ ...member })),
    }
  })
  // Persist the stop boundary first, then abort the Captain before draining
  // children. Otherwise its current model turn can observe `halted`, call
  // resume, and race the still-running HTTP stop request.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
  // Members are children of the recorded captain session, so the parent-bound
  // drain must run as that session when a fork requested the stop.
  const haltAnchor = input.captain.id === halted.captainSessionId
    ? input.captain
    : input.ctx.agents.get(halted.captainSessionId as SessionId)
  if (haltAnchor === undefined) {
    input.ctx.logger.warn(`agent-teams: captain session ${halted.captainSessionId} is not live; member activations of "${halted.teamName}" were not drained from this session`)
  } else {
    await stopTeamMemberActivations(input.ctx, haltAnchor, halted.members, input.signal)
  }
  // Interrupting a child emits a trailing subagent-settled notification. That
  // notification can start a fresh Captain turn after the first cancellation,
  // so close the stop boundary again once every child activation has drained.
  // Queued user input is preserved both times; only runtime-generated work is
  // prevented from silently resuming the halted team.
  input.captain.cancel({ kind: 'user' }, { keepInbox: true })
  return {
    teamName: halted.teamName,
    captainSessionId: halted.captainSessionId,
    cancelledTasks: halted.cancelledTasks,
    alreadyHalted: halted.alreadyHalted,
```

</details>

**依据 8 · 源码核查**：[src/tools.ts:2541-2561](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L2541-L2561)

退役并将活跃团队归档。

<details>
<summary>查看原文（21行）</summary>

```text
          await discardMailboxMessages(stateRoot, fresh.id, member.name, (await readUnreadMailbox(stateRoot, fresh.id, member.name)).map(message => message.id))
          if (member.status === 'removed') continue
          member.status = 'removed'
          for (const task of fresh.tasks) {
            if (task.assignee === member.name && !TERMINAL_TASK_STATUSES.includes(task.status)) invalidateTaskAttempt(task)
          }
        }
        await writeTeam(stateRoot, fresh)
        return roster
      })
      await recordRetiredMemberIds(stateRoot, members.map(member => member.id))
      await stopTeamMemberActivations(ctx, await memberOperationParent(ctx, team, captain), members, exec.signal)
      await withTeamLock(teamLockKey(stateRoot, team.id), async () => {
        const fresh = await requireFreshCaptainTeam(ctx, stateRoot, team.id, captain.id)
        appendTeamEvent(ctx, captainSessionOf(ctx, fresh.captainSessionId, captain.session), 'agent-teams/team-deleted', {
          teamId: fresh.id,
        })
        // Archive, not delete: tasks (with their dependency graph) and the
        // mailboxes stay on disk for later review and dependency rebuilds.
        await archiveTeamDir(stateRoot, fresh.id)
      })
```

</details>

#### 缺口

- 未测重复结算、宿主停队和进程残留
  **影响**：对已运行成员及外部任务不可从状态推断停净
  **进一步探讨**：测试三个分支只停止一个，同时注入失败和缺回执并比对宿主事件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 通过质量门禁能证明任务通过真实验收吗？

**研究主题**：贡献与相对优势、缺陷与关键质疑、采用判断

#### 完整回答

质量任务需要成员填入验证与结论字段。审阅开始记录范围快照，完成时重新读当前字节、记录漂移和缺口，再把 verdict 绑定到任务与 attempt。当前交付检查会拒绝缺通过审阅、声明路径越界以及审计范围读取不全，能阻止以旧审阅替代变化后的文件。命令字段是成员提交的材料，核验判据仍要由负责人独立执行或查看真实原件。文件快照及工具过滤约束各自路径，不能替代系统级写入隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/scheduler.ts:385-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/scheduler.ts#L385-L400)

生成 review attempt 时记录起始快照。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:190-213](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L190-L213)

结论完成绑定审阅字节、范围与漂移。

<details>
<summary>查看原文（24行）</summary>

```text
function bindClosingVerdict(workspace: string, team: TeamState, task: TeamTask): void {
  if (task.status !== 'completed') return
  const kind = taskKindOf(task)
  if (kind !== 'review' && kind !== 'requirements' && kind !== 'verification') return
  if ((kind === 'review' || kind === 'requirements') && task.verdict !== 'pass') return
  const scope = verdictScopePatterns(team, task)
  if (scope.length === 0) return
  const read = readArtifactScope(workspace, scope)
  const duringDrift = task.verdictStartSnapshot === undefined
    ? []
    : artifactDrift(task.verdictStartSnapshot.artifacts, read.artifacts)
  const bound = bindReviewToRevision(team, task, {
    artifacts: read.artifacts,
    gaps: read.gaps,
    scope,
    duringDrift,
  })
  task.reviewedTaskId = bound.reviewedTaskId
  task.reviewedAttempt = bound.reviewedAttempt
  task.reviewedArtifacts = bound.reviewedArtifacts
  task.reviewedGaps = bound.reviewedGaps
  task.reviewedScope = bound.reviewedScope
  task.reviewedDuringDrift = bound.reviewedDuringDrift
  task.verdictStartSnapshot = undefined
```

</details>

**依据 3 · 源码核查**：[src/scheduler.ts:256-266](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/scheduler.ts#L256-L266)

调度提示要求成员提交验证命令与结果。

<details>
<summary>查看原文（11行）</summary>

```text
Completed dependency results:
${formatDependencyOutputs(ticket.dependencyOutputs)}

Task: ${ticket.taskId}${seed} — ${ticket.subject}${description}
${staleWorkOrder}${contract === '' ? '' : `\nContract:\n${contract}\n`}
${structuredCompletion}
Attempt: ${ticket.attempt}
Attempt id: ${ticket.attemptId}

Call agent_teams_claim_task for ${ticket.taskId}; it will return this same attempt_id. Include attempt_id=${ticket.attemptId} in every agent_teams_update_task call. If it is rejected as stale, stop work because the task was reassigned. claimed cannot jump to completed. Mark in_progress first, then completed or failed. Include attempt_id on every update. Then send_message to captain with source_task_id and source_attempt_id and become idle.
When finishing: use status=completed only when the task's success criteria are satisfied; use status=failed when blocking findings or validation failures mean downstream work must not proceed; include a concise output in either case. Quality kinds must submit structured fields: review/requirements need verdict=pass to complete (needs_revision/reject must fail with findings); implementation/repair/verification/integration need acceptanceResults and commandsRun, while implementation/repair also need in-scope changedPaths. Use status values "passed" or "failed" inside those arrays. After the work and verification finish, call agent_teams_update_task immediately; do not wait for captain confirmation and do not continue exploring. Do not approve your own implementation. Mail is not a formal next review. Completed work must not be repeated to attach late evidence: call update_task on the original task with its attempt_id and acceptanceResults/commandsRun/evidence_note; supplements are append-only and cannot change its verdict. Treat the dependency results above as source material. Do not ignore them. Work only this task and only its in-scope paths in this turn.
```

</details>

**依据 4 · 源码核查**：[src/quality-gates.ts:1655-1684](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/quality-gates.ts#L1655-L1684)

交付依据审阅、范围、绑定和审计缺口形成 blocker。

<details>
<summary>查看原文（30行）</summary>

```text
  if (implementations.some((item) => item.status === 'completed') && !reviews.some((item) => item.status === 'completed' && item.verdict === 'pass')) {
    if (!blockers.some((item) => item.includes('review'))) {
      blockers.push('completed implementation has no passing review')
    }
  }

  for (const item of implementations) {
    for (const path of item.changedPaths ?? []) {
      if (classifyChangedPath(path, item.inScope ?? [], item.outOfScope ?? []) !== 'in_scope') {
        blockers.push(`${item.id} has unaudited path ${path}`)
      }
    }
  }

  const binding = verdictBindingIssues(team, audit)
  blockers.push(...binding.blockers)
  warnings.push(...binding.warnings)
  if (audit.artifacts !== undefined) {
    warnings.push(...workOrderWarnings(team, audit.artifacts).map((warning) => warning.message))
  }
  // An incomplete audit is not evidence: a scope that outgrew its cap, or a
  // path that cannot be read, must block instead of passing as a clean read.
  const auditGaps = audit.gaps ?? []
  if (auditGaps.length > 0 && (quality.length > 0 || blockers.length > 0 || audit.artifacts !== undefined)) {
    const shown = auditGaps.slice(0, 3).map((gap) => `${gap.pattern}: ${gap.reason}`)
    const more = auditGaps.length > shown.length ? ` (+${auditGaps.length - shown.length} more)` : ''
    blockers.push(`the current workspace audit is incomplete (${shown.join('; ')}${more}); no recorded verdict can be confirmed over partially enumerated or unreadable artifacts`)
  }

  return { ok: blockers.length === 0, blockers, warnings }
```

</details>

#### 缺口

- 未独立执行任务命令和文件并发恢复
  **影响**：无法确认真实交付质量及并行净收益
  **进一步探讨**：隔离仓库记录实际命令输出、内容哈希与审查前后差异

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么试用能区分任务编排收益和重新派发的风险？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

以两个低权限成员执行可独立核对的只读任务，先显式暂存计划并让用户确认，然后按任务和 attempt 观察邮箱、结果与审阅原件。比较手工子 Agent 清单，在同等质量下记录模型调用、等待、人工整合、冷恢复和停队时间。发现没有可核原件、宿主仍运行、重复修改或费用超出时，停队并查宿主和工作区，不立刻重新派发写入。可检验一种新设计：转派撤销旧 attempt 在宿主的实际路径能力，看看能否比已有团队状态及工具过滤更早拒绝越界；若宿主无法限制工具外的写入，或独立工作区达到同等效果且代价更低，则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:693-709](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/tools.ts#L693-L709)

已有投递阶段与 attempt 校验为对照。

<details>
<summary>查看原文（17行）</summary>

```text
    try {
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
        orphan = undefined
        return true
```

</details>

**依据 2 · 源码核查**：[src/harness-compat.ts:649-663](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/harness-compat.ts#L649-L663)

定向停队路径提供可复核回执。

<details>
<summary>查看原文（15行）</summary>

```text
export async function drainMemberChildren(runtime: Context['subagents'], parent: Agent, ids: readonly SessionId[]): Promise<void> {
  const tree = treeBoundary(runtime)
  if (tree !== undefined) {
    const root = tree.rootOf.call(runtime, parent)
    const selected = new Set(ids)
    // The native tree-wide drain also stops unrelated siblings and permanently
    // closes the captain. Join only work in the selected creation branches.
    const pending = [...treeWork.get(tree.manager) ?? []].filter(work => work.root === root && work.branch.some(id => selected.has(id)))
    for (const work of pending) work.controller.abort()
    await Promise.all(pending.map(work => work.settled))
    const targets = [...tree.manager.resident.values()].filter(item => item.root === root
      && item.ancestors.includes(parent.id) && (selected.has(item.childId) || item.ancestors.some(id => selected.has(id))))
    const results = await Promise.allSettled(targets.map(item => tree.manager.dispose.call(tree.manager, item)))
    const failures = results.flatMap(result => result.status === 'rejected' ? [result.reason as unknown] : [])
    if (failures.length) throw new AggregateError(failures, 'AgentTeams member teardown failed')
```

</details>

**依据 3 · 源码核查**：[src/members.ts:1018-1058](https://github.com/NanmiCoder/dsh-agent-teams/blob/4354b0f6a793b75c1904c0ee85eef4043a37c733/src/members.ts#L1018-L1058)

工具过滤依赖宿主 provider 和准备链。

<details>
<summary>查看原文（41行）</summary>

```text
  const legacyCapabilities = provider.capabilities as unknown as { persona?: boolean; toolFilter?: boolean }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.persona) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot apply a member persona`)
  }
  if (!usesManagedActivations(ctx.subagents) && !legacyCapabilities.toolFilter) {
    throw new Error(`agent-teams: provider "${config.provider}" cannot restrict captain-only tools for members`)
  }
  const label = `${MEMBER_LABEL_PREFIX}${team.id}:${member.name}`
  // The legacy filter of a member without a configured tool policy: the
  // captain-only deny list plus the depth entries this host registers.
  const requestedFilter = resolvedFilter ?? memberToolFilter(config.maxDepth, restrictableToolNames(captain))
  // The lenient retry may drop names this host reports unknown; keep the exact
  // filter the host accepted for the durable member setup.
  let acceptedFilter = requestedFilter
  const start = await startMemberWithLenientFilter(
    toolFilter => {
      acceptedFilter = toolFilter
      const setup = { persona: memberPersona(team, member, stateDir, config.executionPrompt), toolFilter }
      return selections.withPending(captain.id, label, llmSelection, () => startMember(ctx.subagents, {
        provider: config.provider,
        label,
        request: {
          prompt: [{ type: 'text', text: initialPrompt ?? memberWelcome(team, member.name) }],
          parent: captain,
          persona: memberPersona(team, member, stateDir, config.executionPrompt),
          // Depth deny entries name host tools; resolve them against the
          // running host's registry so a renamed delegation tool cannot abort
          // the spawn (see memberToolFilter). Depth is still enforced by the
          // parent-chain guard installed at plugin mount. A filter the host
          // still rejects is retried without the names it reported.
          toolFilter,
          agentOptions: {
            provider: llmSelection.provider,
            model: llmSelection.model,
            ...llmSelection.reasoningEffort === undefined
              ? {}
              : { reasoningEffort: ReasoningEffortId(llmSelection.reasoningEffort) },
          },
          // Harness request.maxDepth caps the absolute depth of THIS creation;
          // it is not inherited by later delegations. The guard below enforces
          // the configured member-relative descendant budget instead.
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
