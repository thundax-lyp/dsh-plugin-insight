# DSH AgentTeams

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c059636](https://github.com/NanmiCoder/dsh-agent-teams/tree/c059636e541f9af644bded8a5e46cca0420c7451)

<!-- BEGIN META -->
[![GitHub ★ 2,455](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C455&color=yellow&logo=github&style=flat)](https://github.com/NanmiCoder/dsh-agent-teams) [![npm 30d 46,019](https://img.shields.io/static/v1?label=npm+30d&message=46%2C019&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nanmicoder/dsh-agent-teams)
<!-- END META -->

> **实现功能**：让当前DSH会话组织持久子Agent团队、依赖任务、消息和协作界面。

> **核心亮点**：[Q02](#research-q02)、[Q03](#research-q03) 可靠性增量在持久任务图、attempt归属与区分idle/冷恢复的调度，而非角色数量；清空旧结果避免重试直接继承已失效证据。

> **风险与缺陷**：[Q03](#research-q03) 旧attempt状态更新被撤销不代表外部文件副作用已撤销，质量gate是完成审计而非写入拦截；调度记录不能替代产物与验证的独立复核。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 什么任务值得引入持久团队？](#detail-section-15)
  - [Q02 · 宿主、任务DAG和冷恢复如何接起来？](#detail-section-16)
  - [Q03 · 撤销attempt和完成审计是否能保证没有过期写入？](#detail-section-17)
  - [Q04 · 成本和失败恢复如何决定试用边界？](#detail-section-18)
  - [Q05 · 把工作产物绑定attempt是否能降低过期结果混入？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能拆分任务和验收的负责人在当前会话分派独立工作并汇总为同一目标交付。

简单替代是单Agent串行或手工子Agent分派；本轮比较协调机制，未证明并行带来速度或质量优势。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 依赖任务调度 | 分派可就绪工作 | 不证明任务拆分合理 |
| attempt归属与恢复 | 阻止旧状态结果继承 | 不自动回滚外部文件副作用 |
| 质量完成审计 | 核对验收、命令与路径 | 仍需验证材料真实性 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 失败与退路 |
|---|---|---|
| 匹配DSH与子Agent provider | 创建并继续成员 | 先核对兼容和能力 |
| 可写.agent-teams状态目录 | 保存团队及attempt | 保留原状态再排障 |
| 模型预算与清晰验收 | 执行及合并 | 超预算或边界不清先暂停 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与成功判据 | 失败处理 |
|---|---|---|
| 安装匹配版本 | 用户确认工具与命令可见 | 不盲目升级宿主 |
| 拟定两成员DAG | captain列独立范围和验收 | 用户先修计划 |
| 审批执行并核对attempt | 用户/负责人确认状态与产物 | 重派后核对旧副作用 |
| 汇总独立验证 | captain提交合格结果 | 不以completed替代正确性 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | DSH与模型路由资源，未知 | 配对版本、拆DAG和验收，未知 |
| 持续 | 每成员上下文与模型调用，未知 | captain协调、合并与复核，未知 |
| 失败恢复 | 新attempt重试与额外模型调用，未知 | 核对旧副作用、重派与重验，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 合格任务 | 源码支持 | 未验证部分 |
|---|---|---|
| 持久分派与恢复 | attempt、锁和parked恢复 | 中断后真实成员与状态一致性 |
| 质量交接 | 验收项、命令与路径完成审计 | 命令真实性、产物正确性及总成本 |

> **思考**：[Q03](#research-q03) 旧attempt状态更新被撤销不代表外部文件副作用已撤销，质量gate是完成审计而非写入拦截；调度记录不能替代产物与验证的独立复核。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 可靠性增量在持久任务图、attempt归属与区分idle/冷恢复的调度，而非角色数量；清空旧结果避免重试直接继承已失效证据。

[Q02](#research-q02)、[Q03](#research-q03) 可靠性增量在持久任务图、attempt归属与区分idle/冷恢复的调度，而非角色数量；清空旧结果避免重试直接继承已失效证据。

可借鉴任务代数、每次尝试结果清空和锁内重读；移植需对齐宿主空闲/销毁生命周期和持久化语义，不能将状态锁当工作区写隔离。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 旧attempt状态更新被撤销不代表外部文件副作用已撤销，质量gate是完成审计而非写入拦截；调度记录不能替代产物与验证的独立复核。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q01](#research-q01)、[Q04](#research-q04) 先用两成员只读任务确认依赖、消息、停止与恢复，再考虑互不重叠写任务；没有可分任务或复核人时继续单Agent。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查工具接线、attempt与调度核心及质量完成条件；没有目标运行，产物隔离为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/scheduler.ts、src/state.ts、src/quality-gates.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核心调度与状态链抽读；未安装运行、未验证发布包lib与源码全量一致，也未做多Agent收益基准。
- 下一步：隔离只读任务先验证派发与停止，再注入中断和冷重启核对attempt与单次交付；记录模型费、恢复分钟与过期产物污染。尚未执行。

**分析版本**

- **仓库**：[NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)
- **版本号**：0.1.27（[固定提交 c059636](https://github.com/NanmiCoder/dsh-agent-teams/tree/c059636e541f9af644bded8a5e46cca0420c7451)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是按attempt隔离工作区并只接纳当前快照，以中断重派对照过期产物污染与恢复成本；收益不足或迁移成本更高即停止。

隔离只读任务先验证派发与停止，再注入中断和冷重启核对attempt与单次交付；记录模型费、恢复分钟与过期产物污染。尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 73 | 19827 | 17522 | 1083 | — |
| .md | source | 214 | 29817 | — | — | 464555 |
| .md | example | 44 | 3998 | — | — | 39474 |
| .mjs | test | 42 | 5986 | 5139 | 429 | — |
| .mjs | example | 25 | 1950 | 1831 | 78 | — |
| .ts | example | 2 | 136 | 100 | 26 | — |
| .js | source | 38 | 17923 | 15539 | 2403 | — |
| .ts | source | 30 | 14115 | 10846 | 2535 | — |
| .tsx | source | 7 | 2670 | 2403 | 141 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/NanmiCoder/dsh-agent-teams/issues) 查看。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查持久多Agent任务调度、attempt归属与实际交付边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 什么任务值得引入持久团队？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合已经能拆分独立任务、明确依赖与合格交付的开发或研究负责人，在一个DSH会话中由captain分派并汇总。原办法是手工创建子Agent、传递上下文与追踪任务，简单串行任务则直接由单Agent完成。合格结果是同一目标的可验收产物以及任务、尝试、复核的对应记录，不能按成员数量和完成状态计成功。作者提供先计划再Approve & Run的流程，适合在模型调用发生前检查分工；并行收益仍依赖任务独立、需求稳定与最终汇总成本，不把可创建团队当作节时证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-33](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/README.md#L28-L33)

作者定位当前会话captain与持久团队。

```text

`dsh-agent-teams` turns the current DeepSeek Harness session into a captain that can assemble durable sub-agents, split a goal into dependency-aware tasks, and coordinate work through direct messages.

Ask in natural language. The plugin provides the team protocol, 14 coordination tools, persistent state, an automatic shared-task scheduler, and a live Web UI—without requiring a separate workflow engine.

<p align="center">
```

**依据 2 · 作者声明**：[README.md:44-55](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/README.md#L44-L55)

作者列任务依赖、接管及先审批后执行，区分声明。

<details>
<summary>查看原文（12行）</summary>

```text
| --- | --- |
| **Captain-led delegation** | The current session creates the team, assigns roles, and consolidates the final result. |
| **Durable members** | Members are continuable DSH sub-agents that can be woken for focused follow-up turns. |
| **Dependency-aware tasks** | Tasks move through explicit states and cannot be claimed before their dependencies finish. |
| **Automatic reuse and safe takeover** | Idle members claim the next ready task; reassignment revokes stale attempts before new work starts, and cold recovery retries stranded open attempts. |
| **Direct messaging** | Members send durable mailbox messages directly to teammates or the captain—no relay required. |
| **Live activity panel** | The Web UI combines segmented progress, a collapsible roster, and an interactive task DAG; running tasks show the member's model, and completed archives retain their full member and task history. |
| **Plan before execution** | Normal `/agent-teams` runs stage an unspawned roster and DAG first. The Web panel uses the host model catalog for member routes. Returning to chat stops the planning turn, asks what should change, and revises the same draft; discarding archives the draft, aborts the turn, and explicitly prevents automatic recreation. Only **Approve & Run** enables scheduling; each member starts with its first ready task. |
| **Quality gates** | Opt-in quality tasks support requirements → implementation → verification → review → integration contracts, automatic repair/re-review, and explicit resume. Scope control is a completion-time audit, not host write interception. See [docs/quality-gates.md](./docs/quality-gates.md). |

The conversation card and activity panel use Harness's official locale service. They follow live language changes between English and Simplified Chinese—including status labels, dynamic summaries, controls, archive markers, and accessibility text—without a page reload or a separate plugin setting.

```

</details>

#### 缺口

- 没有同条件单Agent对照和真实任务结果
  **影响**：不能确认整体节时与质量优势
  **进一步探讨**：同模型预算比较三类可拆任务的合格率、总调用和汇总分钟

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 宿主、任务DAG和冷恢复如何接起来？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply固定stateDir默认.agent-teams、成员provider、最大成员和工具策略，然后注册团队工具和固定协议。调度器在withTeamLock内重新读取持久队伍，halted或staged不派发，查找成员与已有open任务；普通空闲领取下一ready任务，冷恢复则为未被本进程park记录识别的持久open任务开启新attempt。beginTaskAttempt递增代数并生成UUID，清除上一尝试的output、verdict与命令证据，再落盘。这样恢复不会直接把旧尝试的结果冒充新执行。它需要宿主可继续子Agent、模型路由、文件持久化和匹配版本；模型与文件写入仍是外部副作用，状态锁不是所有工具调用的分布式事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:194-224](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/index.ts#L194-L224)

配置、工具注册与协议入口。

<details>
<summary>查看原文（31行）</summary>

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
  })
```

</details>

**依据 2 · 源码核查**：[src/scheduler.ts:353-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/scheduler.ts#L353-L400)

锁内持久状态、staged、parked与冷恢复轮换。

<details>
<summary>查看原文（48行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/state.ts:171-197](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/state.ts#L171-L197)

每个attempt拥有独立结果，代数和UUID生成。

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

#### 缺口

- 没有重启时真实子Agent与持久状态一致性执行记录
  **影响**：源码意图不能当恢复成功
  **进一步探讨**：隔离工作区中断任务后冷重启，核对新attempt、旧结果清空与只派发一次

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 撤销attempt和完成审计是否能保证没有过期写入？

**研究主题**：贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

相对纯提示词编排，任务代数与attempt capability把状态更新归属具体执行尝试，invalidate会撤销旧ID、设置handoff并清空结果；锁内领取和parked区分避免把普通idle误当丢失任务，是具体的可靠性增量。质量规则要求完成任务有覆盖全部验收项的passed结果与verify命令，implementation还需changedPaths均在inScope。最关键边界是这些是状态更新和完成时审计，并非拦截每次文件写入；被撤销的Agent在外部工具中造成的副作用不能单靠清空ID撤回。显式路径与结果也是执行者提交的材料，不能由字段存在推断测试真实运行。需要独立检查工作区变化及验证证据，不能把调度正确性外推为软件正确性。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:215-226](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/state.ts#L215-L226)

撤销capability并清空上一尝试结果。

<details>
<summary>查看原文（12行）</summary>

```text
export function invalidateTaskAttempt(
  task: TeamTask,
  nextAssignee?: string,
  reassigning = false,
): void {
  task.attemptId = undefined
  task.handoffId = randomUUID()
  task.status = 'pending'
  task.assignee = nextAssignee
  task.reassigning = reassigning
  clearAttemptResult(task)
  task.updatedAt = Date.now()
```

</details>

**依据 2 · 源码核查**：[src/quality-gates.ts:578-603](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/quality-gates.ts#L578-L603)

完成条件核对结果和路径，是审计接口。

<details>
<summary>查看原文（26行）</summary>

```text
  if (kind === 'implementation' || kind === 'repair' || kind === 'verification' || kind === 'integration') {
    const commands = update.commandsRun ?? task.commandsRun
    if (commands?.some((item) => item.status === 'failed') === true) {
      if (nextStatus === 'completed') {
        return { ok: false, error: 'verify failure must fail the task', requiredStatus: 'failed' }
      }
    }
    if (nextStatus !== 'completed') return { ok: true }
    const acceptanceResults = update.acceptanceResults ?? task.acceptanceResults
    if (acceptanceResults === undefined || !acceptanceCovered(task.acceptance, acceptanceResults)) {
      return { ok: false, error: `${kind} completion requires passed acceptanceResults for every acceptance item` }
    }
    if (commands === undefined || !verifyCovered(task.verify, commands)) {
      return { ok: false, error: `${kind} completion requires a passed commandsRun entry for every verify command` }
    }
    if (kind === 'implementation' || kind === 'repair') {
      const changed = update.changedPaths ?? task.changedPaths
      if (changed === undefined) {
        return { ok: false, error: `${kind} completion requires changedPaths` }
      }
      for (const path of changed) {
        const classification = classifyChangedPath(path, task.inScope ?? [], task.outOfScope ?? [])
        if (classification !== 'in_scope') {
          return { ok: false, error: `${kind} cannot complete: ${path} is ${classification}` }
        }
      }
```

</details>

**依据 3 · 作者声明**：[README.md:51-52](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/README.md#L51-L52)

作者明确scope控制为完成审计而非写入拦截。

```text
| **Plan before execution** | Normal `/agent-teams` runs stage an unspawned roster and DAG first. The Web panel uses the host model catalog for member routes. Returning to chat stops the planning turn, asks what should change, and revises the same draft; discarding archives the draft, aborts the turn, and explicitly prevents automatic recreation. Only **Approve & Run** enables scheduling; each member starts with its first ready task. |
| **Quality gates** | Opt-in quality tasks support requirements → implementation → verification → review → integration contracts, automatic repair/re-review, and explicit resume. Scope control is a completion-time audit, not host write interception. See [docs/quality-gates.md](./docs/quality-gates.md). |
```

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 成本和失败恢复如何决定试用边界？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

首次需匹配DSH版本与子Agent provider，明确可写工作区和模型路由，准备DAG、验收和权限；持续成本是每个成员上下文、工具与模型调用、captain汇总和review/repair往返。失败恢复会新开attempt并重新验证，旧尝试的外部副作用还须人工核对；取消状态不等于回滚文件。包内默认最多8成员是容量配置，不是推荐预算，也不能保证并行一定更快。可复用的是attempt结果清空、锁内重新读与不把idle等同lost的状态机，但迁移必须对齐宿主生命周期、持久锁及工具副作用。适合先两成员只读评审，再扩展互不重叠写任务；依赖卡住、旧Agent仍写或费用超预算时暂停，回单Agent串行并人工合并。现金和人工均未实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:194-214](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/index.ts#L194-L214)

默认成员上限、provider和延迟能力验证。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/scheduler.ts:353-400](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/scheduler.ts#L353-L400)

恢复会开启新尝试，需计入重复成本。

<details>
<summary>查看原文（48行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/state.ts:171-197](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/state.ts#L171-L197)

旧结果不会作为新attempt证据继承。

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

#### 缺口

- 缺少多成员真实费用、合并耗时与停止后副作用记录
  **影响**：不能判断全周期成本低或安全持续采用
  **进一步探讨**：先两成员只读，记录完整调用费与汇总分钟，再做隔离写入中断实验

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 把工作产物绑定attempt是否能降低过期结果混入？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是让每个attempt在独占临时工作区输出产物摘要，captain只接纳当前attempt对应的快照，重新分派后旧工作区转只读待人工对账，可比只拒绝状态更新更有效隔离过期写入。推导来自Q02的capability轮换与Q03的外部副作用边界，新增负担是工作区创建、产物迁移与冲突协调，不应直接替换现有工作区策略。最小验证用三组可重现中断/重派任务，对比共享工作区和attempt工作区，观察过期写入进入交付的次数、恢复分钟与资源支出。若无污染减少或迁移负担超过收益，停止；此构想未实现且不是已有插件贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:215-226](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/state.ts#L215-L226)

状态归属能撤销，提供产物归属扩展的推导点。

<details>
<summary>查看原文（12行）</summary>

```text
export function invalidateTaskAttempt(
  task: TeamTask,
  nextAssignee?: string,
  reassigning = false,
): void {
  task.attemptId = undefined
  task.handoffId = randomUUID()
  task.status = 'pending'
  task.assignee = nextAssignee
  task.reassigning = reassigning
  clearAttemptResult(task)
  task.updatedAt = Date.now()
```

</details>

**依据 2 · 源码核查**：[src/quality-gates.ts:593-603](https://github.com/NanmiCoder/dsh-agent-teams/blob/c059636e541f9af644bded8a5e46cca0420c7451/src/quality-gates.ts#L593-L603)

changedPaths审计显示产物边界仍需要独立验证。

<details>
<summary>查看原文（11行）</summary>

```text
    if (kind === 'implementation' || kind === 'repair') {
      const changed = update.changedPaths ?? task.changedPaths
      if (changed === undefined) {
        return { ok: false, error: `${kind} completion requires changedPaths` }
      }
      for (const path of changed) {
        const classification = classifyChangedPath(path, task.inScope ?? [], task.outOfScope ?? [])
        if (classification !== 'in_scope') {
          return { ok: false, error: `${kind} cannot complete: ${path} is ${classification}` }
        }
      }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
