# DSH Taskboard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0fa3f97](https://github.com/shengsheng90/DSH-taskboard/tree/0fa3f97ed7f2266e173d6643819921b9f3963aa8)

<!-- BEGIN META -->
[![GitHub ★ 323](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=323&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,310](https://img.shields.io/static/v1?label=npm+30d&message=1%2C310&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)
<!-- END META -->

> **功能**：以 SQLite 权威任务状态连接 DSH Agent 执行、排他认领、自动化和人工验收入口。

> **亮点**：把权威任务状态、原生Agent工具循环、排他认领与人工review入口接在一起，并区分设计节点和可执行provider。见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：human actor是入口信任约定，CLI/DB本地能力仍可由持权者调用；Goal Completed和非空verification不证明成果已验证。SQLite事务不包Agent与外部写入。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要任务板，比聊天任务和普通看板多什么？](#detail-section-11)
  - [Q02 · 状态、并发版本和人工done门禁如何落地？](#detail-section-12)
  - [Q03 · 执行、Goal和自动化如何处理失败，工作流都能执行吗？](#detail-section-13)
  - [Q04 · 依赖、授权和使用怎样形成闭环？](#detail-section-14)
  - [Q05 · 全周期成本与效果有什么依据？](#detail-section-15)
  - [Q06 · 谁可试用，什么方向值得进一步验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH项目操作者用持久看板管理多会话工作，合格结果是成果、owner和验收有据。见[Q01](#research-q01)。

普通看板+原生聊天更轻但需手工同步，插件增加排他认领、结果和状态联接；是否减少遗漏和返工未有项目对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：读任务/版本、claim、提交review、block与release，不含accept。
- **后台**：原生Agent worker、Goal回写和有限并发自动化。
- **界面**：原生看板由作者说明，本轮未全审GUI。
- **Host 路由**：专用认证mutation及附件票传输。
- **Skill**：随包manage-taskboard由作者声明，本轮未全审skill内容。

**流程与依赖**

同库路径、Node SQLite、host服务/模型/preset和Web认证是实际门槛；peer*不替代版本验收。依赖及操作表见[Q04](#research-q04)。

先人工小任务核claim/version/review，再低并发自动化；人审真实产物不按Completed接受。步骤与失败动作见[Q04](#research-q04)。

**效果与成本**

成本重点在Agent执行与人工核验、故障状态对账，worker限额不等于费用预算。分阶段成本与效果表见[Q05](#research-q05)。

持久owner和活动可能减少聊天中遗失任务，但只有正确验收的成果才算价值；项目对照和停用条件见[Q06](#research-q06)。

> **思考**：human actor是入口信任约定，CLI/DB本地能力仍可由持权者调用；Goal Completed和非空verification不证明成果已验证。SQLite事务不包Agent与外部写入。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把权威任务状态、原生Agent工具循环、排他认领与人工review入口接在一起，并区分设计节点和可执行provider。见[Q01](#research-q01)至[Q03](#research-q03)。

事务版本与认领有实际实现；外部Agent/文件非共同事务，人类actor语义不替代本地权限。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

human actor是入口信任约定，CLI/DB本地能力仍可由持权者调用；Goal Completed和非空verification不证明成果已验证。SQLite事务不包Agent与外部写入。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试独立测试库和可丢弃目录，先手动后自动，额外控制CLI/DB及模型工具权限。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持事务版本、owner和窄工具边界、真实Agent worker及review回写；本地CLI信任、成果质量、故障恢复和全节点执行未验证。成果证据包为未来假设。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、src/automation/index.ts、src/cli.ts、src/domain/policy.ts、src/execution/index.ts、src/index.ts、src/service/attachments.ts、src/service/index.ts、src/sqlite/provider.ts、src/tool/index.ts、src/workflow/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审原生注册、SQLite状态/claim/review/版本事务、worker/Goal、自动并发、workflow registry、Web mutation与CLI权威、附件票契约；未全审GUI、附件全过程、全部节点provider或宿主实现。
- 下一步：未运行目标；固定环境核并发冲突、owner/CLI边界、Goal假完成、启动失败与孤儿恢复、人工退修及成果验证，记录总费用和返工。见[Q04](#research-q04)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[shengsheng90/DSH-taskboard](https://github.com/shengsheng90/DSH-taskboard)
- **版本号**：0.1.10（[固定提交 0fa3f97](https://github.com/shengsheng90/DSH-taskboard/tree/0fa3f97ed7f2266e173d6643819921b9f3963aa8)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把任务revision、产物摘要与真实验证结果绑定为可复核验收包，验证是否降低误接受且不增加过多审核成本。见[Q06](#research-q06)。

未运行目标；固定环境核并发冲突、owner/CLI边界、Goal假完成、启动失败与孤儿恢复、人工退修及成果验证，记录总费用和返工。见[Q04](#research-q04)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1528 | — | — | 19597 |
| .mjs | example | 1 | 47 | 44 | 0 | — |
| .js | source | 29 | 16751 | 16166 | 1255 | — |
| .mjs | source | 6 | 358 | 303 | 33 | — |
| .ts | source | 23 | 6413 | 5648 | 302 | — |
| .tsx | source | 2 | 1771 | 1645 | 62 | — |
| .ts | test | 16 | 3858 | 3488 | 101 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：持久任务状态与真实Agent执行/人工验收能否减少遗漏，权限和失败边界是否足够明确？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要任务板，比聊天任务和普通看板多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

持续在DSH管理本地项目、需要把待办分派给Agent并保留人工验收的人，是直接对象。普通看板只记录状态，聊天任务容易把执行结果散在会话；Taskboard用SQLite统一项目/任务/关系/评论/认领与活动，连接宿主Agent Session、Goal、Workspace和原生页面。合格结果是同一任务有明确所有者、执行依据、可追踪结果和人工验收，而非仅卡片变绿。

host注册窄taskboard_*工具，并在宿主agents/goals/workspace/presets/model服务就绪后绑定真实worker和自动化。worker会创建或恢复Agent、装preset、设置模型、发任务消息并让其继续执行；有原生工具循环，不能只按工作流画布把它看成静态编排。模型和工具能力仍由宿主提供，任务板贡献是共享状态、排他认领、回写与复核接线。

只做短任务或不需要多会话追踪时，原生聊天+简单待办更轻。README也明确安装/加载检查不等于GUI及模型执行验收，本轮同样不从文档测试声明推真实业务成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-29](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/README.zh.md#L5-L29)

作者定位、状态与人工验收约定。

<details>
<summary>查看原文（25行）</summary>

```text
这是 DeepSeek Harness 的原生本地项目任务板插件。SQLite 是任务共享状态的唯一权威；Agent Session、Goal、Workspace、工具、权限和对话历史仍由 Harness 管理。

本文同时写给操作者和**其他大模型**：按顺序执行「安装到 DeepSeek Harness」即可完成探测、打包、安装、组成验证、重启激活，无需猜测命令。

**包名：** `@shengsheng/dsh-taskboard`  
**仓库：** https://github.com/shengsheng90/DSH-taskboard  
**许可证：** Apache-2.0  
**Host 版本策略：** DSH 运行时 peer 为 `*`，不按版本号拦截安装。已验证 `0.1.6-alpha.1`、`0.1.7-rc.1/rc.2` 和 `0.2.0-rc.1/rc.2` 的安装与加载。这些检查覆盖安装和模块加载；升级 Host 后仍需核对 GUI 操作和模型执行。

![原生任务板的看板、任务详情和工作流视图](docs/assets/taskboard-demo.gif)

若你是负责安装的代理，直接从 [安装到 DeepSeek Harness](#安装到-deepseek-harness) 按步执行。Git、npm 和 release tarball 均携带已构建的 Host/Client 产物，安装时无需 TypeScript 编译或 Harness 源码 checkout。

## 安装后会得到什么

安装成功后，Harness 会增加：

- 侧栏 **任务板** 按钮和原生 overlay 页面（不是 iframe，也不建立第二套聊天运行时）
- 本地 SQLite 项目、任务、评论、关系、附件、工作流和自动化
- 稳定可读编号（如 `DSH-42`）、不透明 id，以及乐观版本
- 七种状态：`backlog` → `todo` → `in_progress` → `in_review` → `done`，另有 `blocked`、`canceled`
- 进程内 Agent 工具 `taskboard_*`（不含验收，也不含通用改状态）
- 无头 JSON CLI `dsh-taskboard`
- 随包 Skill `manage-taskboard`

```

</details>

**依据 2 · 源码核查**：[src/index.ts:65-89](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/index.ts#L65-L89)

真实工具与宿主worker/自动化生命周期注册。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const service = new TaskboardService(ctx, config)
  ctx.inject(['tools'], (toolCtx) => { registerTaskboardTools(toolCtx, service) })
  ctx.inject(['agents', 'goals', 'workspaceRegistry', 'agentPresets', 'agentDefaultModel'], (nativeCtx) => {
    const worker = new HarnessTaskboardWorker(nativeCtx, service)
    const automation = new TaskboardAutomationCoordinator(service, worker)
    service.bindAutomation(automation)
    nativeCtx.effect(() => {
      let stopping = false
      // Orphan reconciliation is best effort. Binding the scheduler to its success meant one
      // transient failure (agents service not ready, SQLite momentarily locked) left this Host
      // process with no automation timer at all until a restart.
      void worker.reconcile().then(
        () => { if (!stopping) automation.start() },
        error => {
          nativeCtx.logger.warn(`taskboard startup reconciliation failed: ${String(error)}`)
          if (!stopping) automation.start()
        },
      )
      return async () => {
        stopping = true
        await automation.stop()
        await worker.stop()
      }
    }, 'taskboard: Agent execution and automation lifecycle')
```

</details>

**依据 3 · 源码核查**：[src/execution/index.ts:239-264](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L239-L264)

创建/恢复Agent、Goal和followup。

<details>
<summary>查看原文（26行）</summary>

```text
      handle = resume
        ? await this.ctx.agents.resume({
          resumeSessionId: SessionId(initialClaim.sessionId),
          agentOptions,
          setup,
        })
        : await this.ctx.agents.create({
          sessionId: SessionId(initialClaim.sessionId),
          meta: { ...(cwd === undefined ? {} : { cwd }), agentPreset: rule.config.agentPreset },
          agentOptions,
          setup,
        })
      this.handles.set(initialClaim.sessionId, handle)
      if (workspace !== undefined) await workspace.attachSession(SessionId(initialClaim.sessionId))
      const claim = resume
        ? this.taskboard.provider.reclaimOrphanedClaim(task.id, this.taskboard.provider.getTask(task.id).version, owner).claim
        : initialClaim
      if (this.ctx.goals.get(handle.agent) === undefined) {
        this.ctx.goals.create(handle.agent, { objective: `Complete and verify ${task.identifier}: ${task.title}` })
      }
      const current = this.taskboard.provider.getTask(task.id)
      handle.agent.followup(createUserMessage({
        content: [{ type: 'text', text: renderTaskInstruction(this.taskboard, task.id, claim) }],
        source: { kind: 'taskboard', taskId: task.id, claimId: claim.id, claimedRevision: current.version },
      }))
      await handle.agent.whenIdle()
```

</details>

#### 缺口

- 无独立项目全周期执行/验收对照。
  **影响**：不能证明比原生聊天+待办更少遗漏或更快交付。
  **进一步探讨**：用同类项目比较任务遗漏、重复执行、验收返工和总费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态、并发版本和人工done门禁如何落地？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

claim在SQLite事务里按expectedVersion核任务，检查未完成依赖与排他所有权，插入session/agent/automation认领，将任务改in_progress并写活动/全局revision。submitReview只允许持有认领的agent/automation，要求非空verification与结果评论，事务内把claim置submitted和任务置in_review。accept要求actor.kind=human且来自in_review才进done。

SQLite事务用BEGIN IMMEDIATE/COMMIT，失败rollback；状态UPDATE以id+version为条件并检查changes，避免陈旧卡片静默覆盖。活动订阅在提交后发布，观察者抛错不回滚已提交状态。这些是可见原子状态设计，不把外部Agent、Goal或文件也算进同一事务。

模型专用工具不含accept或通用改状态，actor从真实exec.agent.id生成；Web写经过connection.requestRejection后构造human:web-client，而非信任模型工具参数。不过requireHuman只检查actor.kind，本地CLI直接打开同库并默认human:cli，可自传actor标识。因此“人类验收”是这些入口的权限约定，不能证明有shell/数据库写权限的Agent无法经CLI或直接改库完成done；该部署信任边界应由操作者控制，本轮没有越权运行。

此外人类moveStatus是通用状态拖动入口，不能把accept专用入口in_review前置条件扩为每一条人类改状态都必须走同一审阅程序。done最终仍是被授予本地权威者的判断，不是任务成果自动证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/sqlite/provider.ts:565-604](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L565-L604)

事务认领、依赖、插入与活动。

<details>
<summary>查看原文（40行）</summary>

```text
  claim(taskId: TaskboardTaskId, request: ClaimTaskRequest, actor: TaskboardActor): { task: TaskboardTask; claim: TaskboardClaim } {
    if (actor.kind === 'human') throw new TaskboardError('a task claim requires an Agent or automation owner', 'TASK_INVALID_INPUT')
    if (actor.sessionId !== request.sessionId || actor.agentId !== request.agentId) {
      throw new TaskboardError('claim owner does not match the acting Agent', 'TASK_FOREIGN_CLAIM')
    }
    return this.transaction(() => {
      const current = this.mutableTask(taskId, request.expectedVersion)
      requireStatus(current.status, ['todo'], 'claim')
      if (this.activeClaimRow(taskId) !== undefined) {
        throw new TaskboardError('task already has an active claim', 'TASK_ALREADY_CLAIMED', { taskId })
      }
      this.assertDevelopmentContextFree(taskId, current.developmentContext)
      const dependency = this.sql(`
        SELECT dependency.identifier, dependency.status
        FROM task_relations relation
        JOIN tasks dependency ON dependency.id = relation.source_task_id
        WHERE relation.kind = 'blocks' AND relation.target_task_id = ? AND dependency.status <> 'done'
        ORDER BY dependency.identifier LIMIT 1
      `).get(taskId) as Row | undefined
      if (dependency !== undefined) {
        throw new TaskboardError(
          `task is blocked by unfinished dependency ${String(dependency['identifier'])}`,
          'TASK_DEPENDENCY_INCOMPLETE',
          { dependency: dependency['identifier'], status: dependency['status'] },
        )
      }
      const timestamp = now()
      const claimId = ClaimId(id('claim'))
      this.sql(`
        INSERT INTO task_claims(id, task_id, session_id, agent_id, automation_id, expected_task_version, state, development_context_json, claimed_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
      `).run(
        claimId, taskId, request.sessionId, request.agentId, actor.kind === 'automation' ? actor.automationId : null, request.expectedVersion,
        current.developmentContext === undefined ? null : json(current.developmentContext), timestamp, timestamp,
      )
      this.writeStatus(taskId, request.expectedVersion, 'in_progress', timestamp)
      const task = this.getTask(taskId)
      this.activity(taskId, 'task.claimed', actor, { status: current.status }, { status: task.status, claimId }, timestamp)
      this.bumpRevision()
      return { task, claim: mapClaim(this.claimById(claimId)) }
```

</details>

**依据 2 · 源码核查**：[src/sqlite/provider.ts:634-653](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L634-L653)

所有者审阅提交及非空文本。

<details>
<summary>查看原文（20行）</summary>

```text
  submitReview(taskId: TaskboardTaskId, expectedVersion: number, verification: string, resultComment: string, actor: TaskboardActor): TaskboardTask {
    if (actor.kind === 'human') throw new TaskboardError('review submission requires the owning Agent', 'TASK_FOREIGN_CLAIM')
    const verificationText = requiredText(verification, 'verification')
    const commentText = requiredText(resultComment, 'result comment')
    return this.transaction(() => {
      const current = this.mutableTask(taskId, expectedVersion)
      requireStatus(current.status, ['in_progress'], 'submit for review')
      const claim = this.assertOwningClaim(taskId, actor)
      const timestamp = now()
      this.insertComment(
        taskId,
        verificationText === 'Completed' ? commentText : `${commentText}\n\nVerification: ${verificationText}`,
        actor,
        timestamp,
      )
      this.sql("UPDATE task_claims SET state = 'submitted', updated_at = ? WHERE id = ?").run(timestamp, claim.id)
      this.writeStatus(taskId, expectedVersion, 'in_review', timestamp)
      this.activity(taskId, 'task.review-submitted', actor, { status: current.status }, { status: 'in_review', claimId: claim.id }, timestamp)
      this.bumpRevision()
      return this.getTask(taskId)
```

</details>

**依据 3 · 源码核查**：[src/sqlite/provider.ts:688-710](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L688-L710)

accept门禁及人类通用moveStatus。

<details>
<summary>查看原文（23行）</summary>

```text
  accept(taskId: TaskboardTaskId, expectedVersion: number, actor: TaskboardActor): TaskboardTask {
    requireHuman(actor, 'accept')
    return this.transition(taskId, expectedVersion, ['in_review'], 'done', 'task.accepted', actor)
  }

  /** Human board/detail status move; releases an in-progress claim when leaving that column. */
  moveStatus(
    taskId: TaskboardTaskId,
    expectedVersion: number,
    status: TaskStatus,
    actor: TaskboardActor,
    sortOrder?: number,
  ): TaskboardTask {
    requireHuman(actor, 'move status')
    const target = parseTaskStatus(status)
    if (sortOrder !== undefined && !Number.isFinite(sortOrder)) {
      throw new TaskboardError('sort order must be a finite number', 'TASK_INVALID_INPUT')
    }
    return this.transaction(() => {
      const current = this.mutableTask(taskId, expectedVersion)
      if (current.status === target && sortOrder === undefined) {
        throw new TaskboardError('task update contains no fields', 'TASK_INVALID_INPUT')
      }
```

</details>

**依据 4 · 源码核查**：[src/sqlite/provider.ts:720-728](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L720-L728)

版本条件写入与changes判定。

```text
      }
      const result = sortOrder === undefined
        ? this.sql('UPDATE tasks SET status = ?, version = version + 1, updated_at = ? WHERE id = ? AND version = ?')
          .run(target, timestamp, taskId, expectedVersion)
        : this.sql('UPDATE tasks SET status = ?, sort_order = ?, version = version + 1, updated_at = ? WHERE id = ? AND version = ?')
          .run(target, sortOrder, timestamp, taskId, expectedVersion)
      if (result.changes !== 1) throw new TaskboardError('task version changed during transition', 'TASK_STALE_VERSION')
      this.activity(taskId, 'task.status-moved', actor, { status: current.status }, { status: target }, timestamp)
      this.bumpRevision()
```

**依据 5 · 源码核查**：[src/sqlite/provider.ts:1759-1771](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L1759-L1771)

事务begin/commit/rollback。

<details>
<summary>查看原文（13行）</summary>

```text
  private transaction<T>(operation: () => T): T {
    const revisionBefore = this.globalRevision()
    const activities: NonNullable<SqliteTaskboardProvider['transactionActivities']> = []
    this.transactionActivities = activities
    this.db.exec('BEGIN IMMEDIATE')
    let result: T
    try {
      result = operation()
      this.db.exec('COMMIT')
    } catch (error) {
      this.transactionActivities = undefined
      this.rollback()
      throw error
```

</details>

**依据 6 · 源码核查**：[src/sqlite/provider.ts:1795-1798](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L1795-L1798)

观察者失败不撤回提交。

```text
  private publish(event: TaskboardChangeEvent): void {
    for (const listener of [...this.changeListeners]) {
      try { listener(event) } catch (_subscriberFailure) { /* committed state cannot be rolled back by observers */ }
    }
```

**依据 7 · 源码核查**：[src/tool/index.ts:14-19](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/tool/index.ts#L14-L19)

模型actor由运行Agent身份派生。

```text

function actor(exec: ToolRunContext): AgentActor {
  const agent = exec.agent
  if (agent === undefined) throw new TaskboardError('Taskboard tools require a live root Agent', 'TASK_FOREIGN_CLAIM')
  const owner = String(agent.id)
  return { kind: 'agent', actorId: owner, sessionId: owner, agentId: owner }
```

**依据 8 · 源码核查**：[src/domain/policy.ts:18-22](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/domain/policy.ts#L18-L22)

requireHuman只判actor.kind。

```text
export function requireHuman(actor: TaskboardActor, operation: string): asserts actor is Extract<TaskboardActor, { kind: 'human' }> {
  if (actor.kind !== 'human') {
    throw new TaskboardError(`${operation} requires human authority`, 'TASK_HUMAN_AUTHORITY_REQUIRED', { operation })
  }
}
```

**依据 9 · 源码核查**：[src/service/index.ts:290-295](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/index.ts#L290-L295)

Web mutation包装human actor。

```text
    ctx.inject(['connection', 'webServer'], (channelCtx) => {
      const handler: TaskboardRpcHandler = (endpoint, payload) => endpoint === 'automation.run-now'
        ? this.dispatchAutomationRunNow(payload)
        : Promise.resolve(this.dispatchHumanRpc(endpoint, payload, human('human:web-client')))
      const connection = channelCtx.connection as unknown as {
        requestRejection(request: { headers: IncomingMessage['headers'] }): number | undefined
```

**依据 10 · 源码核查**：[src/cli.ts:88-90](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/cli.ts#L88-L90)

本地CLI默认human标签。

```text
function human(options: ReadonlyMap<string, string>): HumanActor {
  return { kind: 'human', actorId: options.get('actor') ?? 'human:cli' }
}
```

**依据 11 · 源码核查**：[src/cli.ts:152-172](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/cli.ts#L152-L172)

CLI直接打开provider后构造human。

<details>
<summary>查看原文（21行）</summary>

```text
  let provider: SqliteTaskboardProvider
  try {
    provider = new SqliteTaskboardProvider(layout.database.path, {
      root: layout.attachments.path,
      maxAttachmentBytes: positiveInteger(options, 'max-attachment-bytes', 25 * 1024 * 1024),
      maxTaskAttachmentBytes: positiveInteger(options, 'max-task-attachment-bytes', 100 * 1024 * 1024),
      allowedContentTypes: (options.get('allowed-content-types')
        ?? process.env['DSH_TASKBOARD_ALLOWED_CONTENT_TYPES']
        ?? 'application/json,application/octet-stream,application/pdf,application/zip,image/gif,image/jpeg,image/png,image/webp,text/markdown,text/plain')
        .split(',').map(value => value.trim()).filter(Boolean),
    })
  } catch (error) {
    io.stderr(errorOutput(error))
    return CLI_EXIT_UNAVAILABLE
  }
  // Only after the store is open: the report has to describe what exists, not what was intended.
  emitStorageDiagnostics(io, layout)
  writeTaskboardStorageIgnore(layout)
  try {
    const actor = human(options)
    const workflowNodes = new WorkflowNodeRegistry()
```

</details>

**依据 12 · 源码核查**：[src/cli.ts:226-227](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/cli.ts#L226-L227)

CLI accept实际使用该actor。

```text
    } else if (group === 'task' && command === 'accept') {
      value = provider.accept(TaskId(required(options, 'task')), version(options), actor)
```

#### 缺口

- 多进程并发、CLI/DB部署隔离与人类验收操作未运行。
  **影响**：源码门禁不能替代操作系统权限或证明真正人类参与。
  **进一步探讨**：分权限环境核工具拒绝、陈旧版本冲突、CLI本地权威和审阅流程，记录实际可达入口。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 执行、Goal和自动化如何处理失败，工作流都能执行吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

automation start先claim再launch。launch解析task worktree或Workspace路径、模型路由与preset，创建/恢复宿主Agent、绑定workspace，创建Goal并followup任务内容。whenIdle后仅释放无认领handle，源码明确idle不代表finished；启动失败会尝试释放claim，但外部Agent创建、workspace绑定、Goal和SQLite并非共同事务，故障后应看claim/session状态，不盲再启动。

Goal complete事件把仍in_progress的owned任务submitReview，verification传固定“Completed”、结果来自已有评论。provider只核非空，且此特殊值不追加Verification段落，因此它不是已运行测试的证据。Goal blocked则写明确reason或fallback“Harness Goal blocked”式原因；最终仍须人工看成果与真实验证材料，不能把Goal宣告完成等同需求正确。

自动化有全局、项目和rule并发额度，默认全局4/项目2，并记录worker失败；这些限制并行worker数量，不限制单个Agent的token、运行时或工具副作用。自动化须配置模型/preset及开发上下文，取消/重启/重试应核真实宿主和claim，而不是只看规则开关。

工作流画布有issue/rss/api/mcp/git/tests/deployment等目录，但registry仅在provider存在execute时标executable，否则design-only。本轮核到service初始化空registry，不能把目录条目或可编辑节点称已具备RSS/API/部署执行集成。实际自动任务worker与画布每种节点执行是两件不同能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/index.ts:176-185](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L176-L185)

先claim再launch。

<details>
<summary>查看原文（10行）</summary>

```text
  start(rule: AutomationRule, task: TaskboardTask): Promise<void> {
    const sessionId = SessionId(`taskboard-${randomUUID()}`)
    const owner: AutomationActor = {
      kind: 'automation', actorId: `automation:${rule.id}`, automationId: rule.id,
      sessionId, agentId: sessionId,
    }
    const claimed = this.taskboard.provider.claim(task.id, {
      expectedVersion: task.version, sessionId, agentId: sessionId,
    }, owner)
    return this.launch(rule, claimed.task, claimed.claim, false)
```

</details>

**依据 2 · 源码核查**：[src/execution/index.ts:223-269](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L223-L269)

实际路由/preset/Agent/Goal/followup与idle边界。

<details>
<summary>查看原文（47行）</summary>

```text
  private async launch(rule: AutomationRule, task: TaskboardTask, initialClaim: TaskboardClaim, resume: boolean): Promise<void> {
    const owner = actor(rule, initialClaim)
    let handle: AgentHandle | undefined
    try {
      const project = this.taskboard.provider.getProject(task.projectId)
      const workspace = project.workspaceId === undefined
        ? undefined
        : this.ctx.workspaceRegistry.get(WorkspaceId(project.workspaceId))
      const cwd = task.developmentContext?.kind === 'worktree' ? task.developmentContext.path : workspace?.path
      const selection = resolveAutomationModel(this.ctx, rule)
      const agentOptions = { provider: selection.provider, model: selection.model }
      const setup = async (agentCtx: Context): Promise<void> => {
        const selected: ModelSelectionRef = { current: selection, assembled: undefined }
        agentCtx.effect(() => installModelSelection(agentCtx, selected), 'taskboard: automation model route')
        await this.ctx.agentPresets.mount(agentCtx, rule.config.agentPreset)
      }
      handle = resume
        ? await this.ctx.agents.resume({
          resumeSessionId: SessionId(initialClaim.sessionId),
          agentOptions,
          setup,
        })
        : await this.ctx.agents.create({
          sessionId: SessionId(initialClaim.sessionId),
          meta: { ...(cwd === undefined ? {} : { cwd }), agentPreset: rule.config.agentPreset },
          agentOptions,
          setup,
        })
      this.handles.set(initialClaim.sessionId, handle)
      if (workspace !== undefined) await workspace.attachSession(SessionId(initialClaim.sessionId))
      const claim = resume
        ? this.taskboard.provider.reclaimOrphanedClaim(task.id, this.taskboard.provider.getTask(task.id).version, owner).claim
        : initialClaim
      if (this.ctx.goals.get(handle.agent) === undefined) {
        this.ctx.goals.create(handle.agent, { objective: `Complete and verify ${task.identifier}: ${task.title}` })
      }
      const current = this.taskboard.provider.getTask(task.id)
      handle.agent.followup(createUserMessage({
        content: [{ type: 'text', text: renderTaskInstruction(this.taskboard, task.id, claim) }],
        source: { kind: 'taskboard', taskId: task.id, claimId: claim.id, claimedRevision: current.version },
      }))
      await handle.agent.whenIdle()
      // Idle does not mean finished: while the claim is still active, onTaskChanged must be able
      // to push committed human edits into this Session, so the handle stays. Once the claim is
      // gone the handle is dead weight -- keeping those was what grew one handle per completed
      // task for the lifetime of the Host.
      await this.releaseUnclaimed(initialClaim.sessionId)
```

</details>

**依据 3 · 源码核查**：[src/execution/index.ts:270-307](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L270-L307)

启动失败释放和Goal事件审阅提交。

<details>
<summary>查看原文（38行）</summary>

```text
    } catch (error) {
      if (handle !== undefined) await this.release(initialClaim.sessionId)
      const latest = this.taskboard.provider.getTask(task.id)
      if (latest.status === 'in_progress') {
        try { this.taskboard.provider.releaseClaim(latest.id, latest.version, `worker startup failed: ${String(error)}`, owner) } catch (_preserveOriginal) { /* authoritative state remains inspectable */ }
      }
      throw error
    }
  }

  private onGoalChanged(changedAgent: Agent, goal: GoalView): void {
    const claim = this.taskboard.provider.listClaims(['active'])
      .find(item => item.sessionId === changedAgent.id && item.agentId === changedAgent.id)
    if (claim === undefined) return
    const task = this.taskboard.provider.getTask(claim.taskId)
    if (task.status !== 'in_progress') return
    let rule: AutomationRule | undefined
    const owner: AutomationActor | AgentActor = claim.automationId === undefined
      ? { kind: 'agent', actorId: claim.agentId, sessionId: claim.sessionId, agentId: claim.agentId }
      : actor(rule = this.taskboard.provider.getAutomation(claim.automationId), claim)
    if (goal.phase !== 'complete' && goal.phase !== 'blocked') return
    try {
      if (goal.phase === 'complete') {
        this.taskboard.provider.submitReview(
          task.id, task.version,
          'Completed',
          completionResultComment(this.taskboard.provider.getTaskDetail(task.id).comments),
          owner,
        )
      } else {
        // A Goal can report a blank reason, and an empty blocker used to throw TASK_INVALID_INPUT
        // straight out of the Host's event dispatch.
        const reason = goal.blockedReason?.message?.trim() ?? ''
        this.taskboard.provider.block(task.id, task.version, reason === '' ? 'Harness Goal blocked' : reason, owner)
      }
    } catch (error) {
      // The Goal is over but the authoritative task disagrees. Leave it observable instead of
      // throwing into the listener chain, and still let go of the Session below.
```

</details>

**依据 4 · 源码核查**：[src/sqlite/provider.ts:634-649](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L634-L649)

Completed特殊文本并不构成验证执行。

<details>
<summary>查看原文（16行）</summary>

```text
  submitReview(taskId: TaskboardTaskId, expectedVersion: number, verification: string, resultComment: string, actor: TaskboardActor): TaskboardTask {
    if (actor.kind === 'human') throw new TaskboardError('review submission requires the owning Agent', 'TASK_FOREIGN_CLAIM')
    const verificationText = requiredText(verification, 'verification')
    const commentText = requiredText(resultComment, 'result comment')
    return this.transaction(() => {
      const current = this.mutableTask(taskId, expectedVersion)
      requireStatus(current.status, ['in_progress'], 'submit for review')
      const claim = this.assertOwningClaim(taskId, actor)
      const timestamp = now()
      this.insertComment(
        taskId,
        verificationText === 'Completed' ? commentText : `${commentText}\n\nVerification: ${verificationText}`,
        actor,
        timestamp,
      )
      this.sql("UPDATE task_claims SET state = 'submitted', updated_at = ? WHERE id = ?").run(timestamp, claim.id)
```

</details>

**依据 5 · 源码核查**：[src/automation/index.ts:248-259](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/automation/index.ts#L248-L259)

三个维度并发额度。

<details>
<summary>查看原文（12行）</summary>

```text
  private availableSlots(rule: AutomationRule): number {
    const globalAvailable = Math.max(0, this.taskboard.config.maxGlobalWorkers - this.inFlight.size)
    const projectRunning = this.runningByProject.get(rule.projectId) ?? 0
    const projectAvailable = Math.max(0, this.taskboard.config.maxProjectWorkers - projectRunning)
    // The rule's own limit counts the rule's own workers. Measuring it against the project total
    // let a sibling rule in the same project silently consume this rule's budget.
    const ruleAvailable = Math.max(0, rule.config.concurrencyLimit - this.ruleInFlight(String(rule.id)).size)
    return Math.min(globalAvailable, projectAvailable, ruleAvailable)
  }

  private ruleInFlight(ruleId: string): Set<Promise<void>> {
    const existing = this.inFlightByRule.get(ruleId)
```

</details>

**依据 6 · 源码核查**：[src/index.ts:53-55](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/index.ts#L53-L55)

默认全局和项目worker数。

```text
  minAutomationIntervalMs: z.natural().min(1_000).default(30_000),
  maxProjectWorkers: z.natural().min(1).default(2),
  maxGlobalWorkers: z.natural().min(1).default(4),
```

**依据 7 · 源码核查**：[src/automation/index.ts:272-288](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/automation/index.ts#L272-L288)

worker失败记录。

<details>
<summary>查看原文（17行）</summary>

```text
      run = this.worker.start(rule, task)
    } catch (error) {
      this.decrement(projectId)
      throw error
    }
    const ruleTracking = this.ruleInFlight(ruleId)
    const tracked = run.catch((error: unknown) => {
      try {
        const latest = this.taskboard.provider.getAutomation(rule.id)
        if (latest.state === 'enabled') {
          this.record(ruleId, {
            kind: 'error', taskId: task.id, message: error instanceof Error ? error.message : String(error), at: Date.now(),
          }, latest.nextEligibleAt)
        }
      } catch (_bookkeepingFailed) {
        // `drain()` awaits this promise. Letting the error log's own failure reject it turned one
        // worker launch failure into a dead round for the whole rule.
```

</details>

**依据 8 · 源码核查**：[src/workflow/index.ts:29-47](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/workflow/index.ts#L29-L47)

provider决定executable/design-only。

<details>
<summary>查看原文（19行）</summary>

```text
/** Provider registry separating editable catalog nodes from executable capabilities. */
export class WorkflowNodeRegistry {
  private readonly providers = new Map<string, WorkflowNodeProvider>()

  register(provider: WorkflowNodeProvider): () => void {
    if (this.providers.has(provider.kind)) throw new Error(`workflow node provider ${provider.kind} is already registered`)
    this.providers.set(provider.kind, provider)
    return () => { this.providers.delete(provider.kind) }
  }

  get(kind: string): WorkflowNodeProvider | undefined {
    return this.providers.get(kind)
  }

  catalog(): WorkflowCatalogEntry[] {
    return WORKFLOW_PARITY_CATALOG.map(entry => ({
      ...entry,
      execution: this.providers.get(entry.kind)?.execute === undefined ? 'design-only' : 'executable',
    }))
```

</details>

**依据 9 · 源码核查**：[src/service/index.ts:237-237](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/index.ts#L237-L237)

service实际空registry起点。

```text
  readonly workflowNodes: WorkflowNodeRegistry = new WorkflowNodeRegistry()
```

#### 缺口

- 真实模型工具执行、Goal回写失败、孤儿恢复和各节点provider部署未知。
  **影响**：不能从原生loop接线推出任务成功、无限集成或故障自动恢复。
  **进一步探讨**：一次性任务核启动故障、Goal complete但测试失败、重启orphan、人工修改后版本冲突和真实节点能力。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、授权和使用怎样形成闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

固定package0.1.10、Apache-2.0，Node要求^22.19.0或>=24，使用node:sqlite。DSH运行peer为*是不拦安装的策略，不是任意版本兼容保证。宿主工具/Agent/Goal/Workspace/preset/model提供真实执行面，插件自己不重建聊天运行时；GUI、CLI与自动任务必须指向同一database和attachmentRoot。

| 条件 | 作用/门槛 | 失败边界 |
|---|---|---|
| 可追溯host/client制品 | 原生插件、overlay、CLI和skill | 安装/加载通过不证明GUI或Agent执行 |
| SQLite与可写存储 | 权威版本、认领、活动和任务 | DB事务不包宿主/文件；先备份再迁移 |
| 宿主preset/model/tools/workspace | Agent执行和权限 | 独立控制模型工具，任务板不自动收紧shell/DB能力 |
| connection/WebServer | 专用POST mutation通道 | Web鉴权沿用宿主，不应以actor字符串作身份凭证 |
| 附件根与短期ticket | 认证RPC铸票、单用字节传输 | 票/文件和DB失败需核状态，本轮未全审附件提交 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 操作者核路径和备份 | Web/CLI同库、版本一致 | 先修配置，不创建第二份似是而非任务状态 |
| 人创建小项目/任务 | 标准、依赖、开发上下文明确 | 不把模糊标题直接自动排队 |
| Agent读版本并claim | 唯一owner、前置依赖已done | 冲突读回当前状态，不覆盖 |
| Agent执行并提交 | 真实产物、测试记录和in_review | blocked/release留具体原因，未知结果先核session |
| 人检查并accept或退修 | 依据成果和可复核验证 | 缺证据不按Completed接受 |
| 操作者恢复/退出 | claim/session/数据均可解释 | 停自动规则、保留库和历史，不直接重排重复任务 |

Web mutation实际先宿主requestRejection、限POST和包体，再dispatchHumanRpc；Typert载体只读拒写。CLI是本地权威入口，需通过运行账户和工具政策控制它，不能把认证网页与CLI赋human标签当同一保证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-15](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/package.json#L2-L15)

包版本、许可、Node、主入口与CLI。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "@shengsheng/dsh-taskboard",
  "version": "0.1.10",
  "description": "Native local project taskboard bundle for DeepSeek Harness",
  "type": "module",
  "packageManager": "pnpm@11.15.1",
  "license": "Apache-2.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
    "dsh-taskboard": "./lib/cli.js"
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:42-61](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/index.ts#L42-L61)

存储配置、额度与默认preset。

<details>
<summary>查看原文（20行）</summary>

```text
export const Config: z<Config> = z.object({
  databasePath: z.string().required(),
  attachmentRoot: z.string().required(),
  pageSize: z.natural().min(1).max(2_000).default(100),
  snapshotTaskLimit: z.natural().min(1).max(2_000).default(1_000),
  maxAttachmentBytes: z.natural().min(1).default(25 * 1024 * 1024),
  maxTaskAttachmentBytes: z.natural().min(1).default(100 * 1024 * 1024),
  allowedAttachmentTypes: z.array(z.string()).default([
    'application/json', 'application/octet-stream', 'application/pdf', 'application/zip',
    'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'text/markdown', 'text/plain',
  ]),
  minAutomationIntervalMs: z.natural().min(1_000).default(30_000),
  maxProjectWorkers: z.natural().min(1).default(2),
  maxGlobalWorkers: z.natural().min(1).default(4),
  allowSharedWorktrees: z.boolean().default(false),
  clientRefreshIntervalMs: z.natural().min(1_000).max(300_000).default(15_000),
  maxChangeWaiters: z.natural().min(1).max(1_024).default(128),
  maxChangeWatchMs: z.natural().min(1_000).max(60_000).default(30_000),
  defaultAgentPreset: z.string().default('standard'),
  defaultModelRoute: z.string(),
```

</details>

**依据 3 · 源码核查**：[src/service/index.ts:290-295](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/index.ts#L290-L295)

专用写通道在鉴权后包装human actor。

```text
    ctx.inject(['connection', 'webServer'], (channelCtx) => {
      const handler: TaskboardRpcHandler = (endpoint, payload) => endpoint === 'automation.run-now'
        ? this.dispatchAutomationRunNow(payload)
        : Promise.resolve(this.dispatchHumanRpc(endpoint, payload, human('human:web-client')))
      const connection = channelCtx.connection as unknown as {
        requestRejection(request: { headers: IncomingMessage['headers'] }): number | undefined
```

**依据 4 · 源码核查**：[src/service/index.ts:331-343](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/index.ts#L331-L343)

实际requestRejection与POST限制。

<details>
<summary>查看原文（13行）</summary>

```text
      channelCtx.effect(() => webServer.register({
        kind: 'prefix',
        path: '/taskboard',
        handler: async (req, res) => {
          const rejection = connection.requestRejection(req)
          if (rejection !== undefined) {
            res.writeHead(rejection)
            res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
            return
          }
          const pathname = (req.url ?? '').split('?')[0] ?? ''
          if (req.method !== 'POST' || !pathname.startsWith('/taskboard/')) {
            send(res, 404, { error: 'not found' })
```

</details>

**依据 5 · 源码核查**：[src/service/index.ts:551-559](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/index.ts#L551-L559)

Typert载体拒绝mutation。

```text
    // Typert Remotes are reachable through any authenticated browser transport. Keep this
    // carrier read-only: every human mutation, attachment ticket, and immediate automation
    // run must cross the dedicated `/taskboard` Connection RPC channel above. Connection
    // owns browserAuth / trustedHosts; this plugin no longer passes a per-channel authority.
    return {
      ok: false,
      errorCode: 'loopback-required',
      errorMessage: `Taskboard endpoint ${request.endpoint} requires a loopback connection`,
    }
```

**依据 6 · 源码核查**：[src/service/attachments.ts:10-30](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/service/attachments.ts#L10-L30)

带actor和过期时间的上传/下载票契约。

<details>
<summary>查看原文（21行）</summary>

```text
interface UploadTicket {
  readonly kind: 'upload'
  readonly taskId: string
  readonly expectedVersion: number
  readonly filename: string
  readonly contentType: string
  readonly commentId?: string
  readonly actor: HumanActor
  readonly expiresAt: number
}

interface DownloadTicket {
  readonly kind: 'download'
  readonly attachmentId: string
  readonly disposition: 'attachment' | 'inline'
  readonly expiresAt: number
}

type Ticket = UploadTicket | DownloadTicket

/** Dedicated byte transport guarded by short-lived capabilities minted over authenticated RPC. */
```

</details>

**依据 7 · 作者声明**：[README.zh.md:11-16](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/README.zh.md#L11-L16)

作者区分安装加载和GUI模型验收。

```text
**许可证：** Apache-2.0  
**Host 版本策略：** DSH 运行时 peer 为 `*`，不按版本号拦截安装。已验证 `0.1.6-alpha.1`、`0.1.7-rc.1/rc.2` 和 `0.2.0-rc.1/rc.2` 的安装与加载。这些检查覆盖安装和模块加载；升级 Host 后仍需核对 GUI 操作和模型执行。

![原生任务板的看板、任务详情和工作流视图](docs/assets/taskboard-demo.gif)

若你是负责安装的代理，直接从 [安装到 DeepSeek Harness](#安装到-deepseek-harness) 按步执行。Git、npm 和 release tarball 均携带已构建的 Host/Client 产物，安装时无需 TypeScript 编译或 Harness 源码 checkout。
```

#### 缺口

- 目标宿主制品、附件全过程、备份恢复及工具政策未验收。
  **影响**：不能按peer*、有CLI或凭据存在推生产安全可用。
  **进一步探讨**：固定环境试UI/CLI/Agent共享状态、认证拒绝、附件失败恢复和停用自动任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本与效果有什么依据？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前边界 |
|---|---|---|
| 启用 | 安装、同库路径、权限、项目/依赖/验收标准与备份 | 多于普通待办初始设置 |
| 执行 | 真实Agent模型、工具、工作目录、并发与等待 | worker数限额不是token/费用/工时预算 |
| 核对 | 产物与测试、人类accept/退修、版本冲突 | Goal Completed不减少人工事实核验 |
| 维护 | DSH服务/客户端、schema、工作流provider、存储和附件 | peer*不承诺升级无维护 |
| 故障/退出 | SQLite备份、orphan claim、已创建Session/Goal与副作用核对 | DB事务不撤销模型工具外部写入 |

#### 效果

| 效果 | 源码支持 | 未知 |
|---|---|---|
| 协作追踪 | 权威状态、版本、owner、活动与评论 | 遗漏/重复工作是否下降 |
| Agent执行 | 创建/恢复、preset/model、followup与Goal回写 | 真实任务质量、权限和费用 |
| 人工验收 | 窄工具无done、专用人类入口 | 本地CLI权威与实际审核质量 |
| 工作流 | 设计目录与provider执行标记 | 未装provider的节点仍design-only |

收益需以被正确验收的任务计量，包含排队、执行、人工返工与恢复费用。不能把自动化启动数、任务转done数量或SQLite状态一致当业务产出，也不把worker并发上限当节费结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:53-61](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/index.ts#L53-L61)

并发与默认路由参数。

```text
  minAutomationIntervalMs: z.natural().min(1_000).default(30_000),
  maxProjectWorkers: z.natural().min(1).default(2),
  maxGlobalWorkers: z.natural().min(1).default(4),
  allowSharedWorktrees: z.boolean().default(false),
  clientRefreshIntervalMs: z.natural().min(1_000).max(300_000).default(15_000),
  maxChangeWaiters: z.natural().min(1).max(1_024).default(128),
  maxChangeWatchMs: z.natural().min(1_000).max(60_000).default(30_000),
  defaultAgentPreset: z.string().default('standard'),
  defaultModelRoute: z.string(),
```

**依据 2 · 源码核查**：[src/execution/index.ts:239-264](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L239-L264)

真实Agent调用路径。

<details>
<summary>查看原文（26行）</summary>

```text
      handle = resume
        ? await this.ctx.agents.resume({
          resumeSessionId: SessionId(initialClaim.sessionId),
          agentOptions,
          setup,
        })
        : await this.ctx.agents.create({
          sessionId: SessionId(initialClaim.sessionId),
          meta: { ...(cwd === undefined ? {} : { cwd }), agentPreset: rule.config.agentPreset },
          agentOptions,
          setup,
        })
      this.handles.set(initialClaim.sessionId, handle)
      if (workspace !== undefined) await workspace.attachSession(SessionId(initialClaim.sessionId))
      const claim = resume
        ? this.taskboard.provider.reclaimOrphanedClaim(task.id, this.taskboard.provider.getTask(task.id).version, owner).claim
        : initialClaim
      if (this.ctx.goals.get(handle.agent) === undefined) {
        this.ctx.goals.create(handle.agent, { objective: `Complete and verify ${task.identifier}: ${task.title}` })
      }
      const current = this.taskboard.provider.getTask(task.id)
      handle.agent.followup(createUserMessage({
        content: [{ type: 'text', text: renderTaskInstruction(this.taskboard, task.id, claim) }],
        source: { kind: 'taskboard', taskId: task.id, claimId: claim.id, claimedRevision: current.version },
      }))
      await handle.agent.whenIdle()
```

</details>

**依据 3 · 源码核查**：[src/sqlite/provider.ts:634-653](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L634-L653)

审阅提交状态与证据文本边界。

<details>
<summary>查看原文（20行）</summary>

```text
  submitReview(taskId: TaskboardTaskId, expectedVersion: number, verification: string, resultComment: string, actor: TaskboardActor): TaskboardTask {
    if (actor.kind === 'human') throw new TaskboardError('review submission requires the owning Agent', 'TASK_FOREIGN_CLAIM')
    const verificationText = requiredText(verification, 'verification')
    const commentText = requiredText(resultComment, 'result comment')
    return this.transaction(() => {
      const current = this.mutableTask(taskId, expectedVersion)
      requireStatus(current.status, ['in_progress'], 'submit for review')
      const claim = this.assertOwningClaim(taskId, actor)
      const timestamp = now()
      this.insertComment(
        taskId,
        verificationText === 'Completed' ? commentText : `${commentText}\n\nVerification: ${verificationText}`,
        actor,
        timestamp,
      )
      this.sql("UPDATE task_claims SET state = 'submitted', updated_at = ? WHERE id = ?").run(timestamp, claim.id)
      this.writeStatus(taskId, expectedVersion, 'in_review', timestamp)
      this.activity(taskId, 'task.review-submitted', actor, { status: current.status }, { status: 'in_review', claimId: claim.id }, timestamp)
      this.bumpRevision()
      return this.getTask(taskId)
```

</details>

**依据 4 · 源码核查**：[src/workflow/index.ts:43-47](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/workflow/index.ts#L43-L47)

设计/可执行区分。

```text
  catalog(): WorkflowCatalogEntry[] {
    return WORKFLOW_PARITY_CATALOG.map(entry => ({
      ...entry,
      execution: this.providers.get(entry.kind)?.execute === undefined ? 'design-only' : 'executable',
    }))
```

#### 缺口

- 无同项目对照、接受质量、总费用和故障恢复工时。
  **影响**：无法量化净生产率或经济优势。
  **进一步探讨**：对同类型任务记录遗漏、重复、返工、人审时间、token/费用和恢复，并核真实产物。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，什么方向值得进一步验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

需要跨会话任务追踪并能人工审核的本地DSH操作者，可先用独立测试库和可丢弃工作目录试一条任务链。先只启用手动任务/认领，验旧version拒绝、owner限制、submitReview和人类accept，再启低并发自动规则；单独核preset权限、CLI/DB可达范围和真实工作成果。

保留条件是减少遗漏或重复执行、审阅可追踪且总维护不超过手工看板。若只有状态自动变化、验证材料空泛、Agent可用本地权威绕过既定验收、或恢复造成重复执行，应停自动化并保留DB/session证据，回手动列表和直接会话审阅。暂停规则后仍核在途Agent，不能假定规则停用撤销外部工具副作用。

未来可验证“成果证据绑定的验收包”假设：submitReview关联固定任务revision、产物摘要、真实验证命令及结果，而不是仅非空verification或Goal Completed；人工accept查看这份快照及后续变更提示。相对现有文本评论，它可能降低陈旧/空泛验证被接受，代价是证据存储、敏感日志治理和审核负担。

用有失败测试、产物后改、任务标准变更、重启及重复提交的任务对照当前方案与证据包，测误接受、拒绝正确任务、审阅时间和总成本。若证据只被模型自报而不可复核，或增加负担却不降错误，应推翻或仅用于高影响任务；当前代码不提供完整事实证明链。

#### 证据与依据

**依据 1 · 源码核查**：[src/sqlite/provider.ts:634-650](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L634-L650)

现有verification仅非空/Completed特例。

<details>
<summary>查看原文（17行）</summary>

```text
  submitReview(taskId: TaskboardTaskId, expectedVersion: number, verification: string, resultComment: string, actor: TaskboardActor): TaskboardTask {
    if (actor.kind === 'human') throw new TaskboardError('review submission requires the owning Agent', 'TASK_FOREIGN_CLAIM')
    const verificationText = requiredText(verification, 'verification')
    const commentText = requiredText(resultComment, 'result comment')
    return this.transaction(() => {
      const current = this.mutableTask(taskId, expectedVersion)
      requireStatus(current.status, ['in_progress'], 'submit for review')
      const claim = this.assertOwningClaim(taskId, actor)
      const timestamp = now()
      this.insertComment(
        taskId,
        verificationText === 'Completed' ? commentText : `${commentText}\n\nVerification: ${verificationText}`,
        actor,
        timestamp,
      )
      this.sql("UPDATE task_claims SET state = 'submitted', updated_at = ? WHERE id = ?").run(timestamp, claim.id)
      this.writeStatus(taskId, expectedVersion, 'in_review', timestamp)
```

</details>

**依据 2 · 源码核查**：[src/execution/index.ts:292-298](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/execution/index.ts#L292-L298)

Goal complete提交固定文本。

```text
      if (goal.phase === 'complete') {
        this.taskboard.provider.submitReview(
          task.id, task.version,
          'Completed',
          completionResultComment(this.taskboard.provider.getTaskDetail(task.id).comments),
          owner,
        )
```

**依据 3 · 源码核查**：[src/sqlite/provider.ts:688-690](https://github.com/shengsheng90/DSH-taskboard/blob/0fa3f97ed7f2266e173d6643819921b9f3963aa8/src/sqlite/provider.ts#L688-L690)

人类accept入口作为验收包承载参照。

```text
  accept(taskId: TaskboardTaskId, expectedVersion: number, actor: TaskboardActor): TaskboardTask {
    requireHuman(actor, 'accept')
    return this.transition(taskId, expectedVersion, ['in_review'], 'done', 'task.accepted', actor)
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
