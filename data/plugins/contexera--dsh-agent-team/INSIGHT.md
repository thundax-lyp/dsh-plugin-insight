# DSH Agent Team

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[08c3e4b](https://github.com/Contexera/dsh-agent-team/tree/08c3e4b6ec41382941236e461cde4ffede234ffd)

<!-- BEGIN META -->
[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Contexera/dsh-agent-team) [![npm 30d 3,210](https://img.shields.io/static/v1?label=npm+30d&message=3%2C210&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@contexera/dsh-agent-team) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@contexera/dsh-agent-team)
<!-- END META -->

> **功能**：以持久成员、任务账本和验收角色组织多Agent协作

> **亮点**：[Q01](#research-q01) 将交接、负责人与验收规则持久建模。

> **主要限制**：[Q03](#research-q03) managed agent全访问且只声明单Human，评审规则不等于安全隔离。

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
  - [Q01 · 解决哪种协作摩擦？](#detail-section-11)
  - [Q02 · 角色规则是否只靠提示？](#detail-section-12)
  - [Q03 · 隔离和自主行动边界？](#detail-section-13)
  - [Q04 · 怎样采用与退出？](#detail-section-14)
  - [Q05 · 怎样区分流程改进和额外复杂度？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：单个人需要协调多条开发工作与复核。

人工转派多个普通会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 任务账本 | 保存负责人与状态 | 需宿主持久存储 |
| 验收门禁 | 拒绝实现者Agent自行验收 | 不保证评审质量 |
| 持久成员 | 事件唤醒和上下文恢复 | 无时钟驱动或停机执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH rc.2编译CLI | 作者前置 | 加载隔离preset与服务 | 源码启动可能重复scope |
| 可信Workspace | 必需 | Agent全访问执行 | 不适合不可信共享文件 |
| 模型与持久存储 | 必需 | 多成员推理及ledger | 配额与恢复需测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 无凭据repo及两个任务分工 | 记录角色和基准 |
| 运行 | 领取、提交review、由未实现owner验收 | 检查实际服务拒绝 |
| 退出 | 停止成员并备份账本和会话 | 确认无新唤醒及普通会话可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 多成员部署资源未知 | 角色、workspace和宿主准备耗时未知 | 需要可信环境 |
| 持续 | 多模型与账本资源未知 | 评审、任务协调和状态维护耗时未知 | 净工时收益未知 |
| 恢复 | 状态迁移资源未知 | 停用、备份和恢复核对耗时未知 | 记忆与会话均需保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 角色限制 | 服务端拒绝self-accept并要求review | 评审正确性未知 |
| 持久任务 | operations表与状态规则可查 | 崩溃恢复和多进程未知 |
| 协作收益 | 源码支持交接机制 | 人工介入与模型净成本未知 |

> **思考**：[Q03](#research-q03) managed agent全访问且只声明单Human，评审规则不等于安全隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将交接、负责人与验收规则持久建模。

requestId检查与进程串行，服务端拒绝self-accept。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) managed agent全访问且只声明单Human，评审规则不等于安全隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 无凭据测试repo观察，外部发布仍人工控制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少人类转派并核对任务验收与执行者分离。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/agent-team/src/ledger.ts、packages/agent-team/src/index.ts、cordis.patch.yml、packages/agent-team/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少人类转派并核对任务验收与执行者分离。未执行目标代码或实际宿主验证。
- 下一步：保留账本、调用结果与独立验收表。

**分析版本**

- **仓库**：[Contexera/dsh-agent-team](https://github.com/Contexera/dsh-agent-team)
- **版本号**：0.2.6（[固定提交 08c3e4b](https://github.com/Contexera/dsh-agent-team/tree/08c3e4b6ec41382941236e461cde4ffede234ffd)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少人工转派同时保持角色验收可追溯。

保留账本、调用结果与独立验收表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 505 | 45537 | — | — | 803308 |
| .mjs | source | 42 | 4722 | 3712 | 705 | — |
| .mts | source | 5 | 592 | 513 | 34 | — |
| .ts | source | 105 | 33404 | 26540 | 4565 | — |
| .ts | test | 128 | 30217 | 24628 | 3034 | — |
| .ts | example | 3 | 98 | 50 | 44 | — |
| .mjs | test | 1 | 21 | 19 | 0 | — |
| .tsx | source | 34 | 5690 | 5026 | 429 | — |
| .tsx | test | 26 | 7333 | 5795 | 1041 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Contexera/dsh-agent-team/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少人类转派并核对任务验收与执行者分离

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决哪种协作摩擦？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一人管理多条开发任务时，常要分派、转述进展和提醒复核。团队把成员、Project、Thread、Claim和任务状态放入共同记录，成员按事件唤醒。作者举内部开发案例，但它是自述，不能证明一般项目更高效。合格结果是每项任务有负责人与可追踪交接，且实现者不能自行验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-32](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/README.md#L22-L32)

作者案例及协作目标

<details>
<summary>查看原文（11行）</summary>

```text
This repository is built by its own team: one Human and a group of Agents, split across Projects for development, bug fixing, UI, review, evaluation, and release. In one bug-fix line, an Agent owner found a defect while checking the live Web UI, scoped it, handed it to another Agent, re-ran every gate itself, and accepted the result. The Human never had to post in that Thread.

![A Main stream in the DSH Web UI: one Human message followed by five Task cards the Agent owner opened](assets/readme/one-sentence-five-tasks.png)

## Why you can step back

- **Members persist.** Each agent is a named Member with its own memory, notes, and skills. It is the same Member after its session ends, its context is compacted or replaced, or DSH restarts, so you brief it once.
- **Every outcome has one owner.** Projects have named owners, and every Task has one accountable owner, Human or Agent, who drives it to acceptance.
- **Whoever builds does not verify.** An Agent may accept a Task only once it is in review, and only if it never held a Claim on it. Close, reopen, and transfer stay with the accountable owner and with you.
- **The room is built for agents.** Agents pull from their own Inbox instead of being pushed every message, and a reply written against a Thread that has moved on is refused and handed back with what changed, so the agent decides again before it speaks.
- **Everything is on the record.** The Main stream, Threads, and Tasks live on one append-only ledger. The task board and your Inbox are views of it, so you read where the work stands instead of asking.
```

</details>

**依据 2 · 源码核查**：[packages/agent-team/src/ledger.ts:1610-1640](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/ledger.ts#L1610-L1640)

实际任务授权和验收门槛

<details>
<summary>查看原文（31行）</summary>

```text
  changeTask(request: AgentTeamAuthorizedTaskRequest): Promise<AgentTeamLedgerResult<AgentTeamTaskResult>> {
    return this.enqueue(async () => {
      const existing = this.state.byRequest.get(request.requestId)
      if (existing !== undefined) {
        this.assertSameTask(existing, request)
        return this.resolved(this.taskResult(existing))
      }
      this.assertActorForWorkspace(request.actor, request.workspaceId)
      const { task, thread } = this.threadForActor(request.actor, request.workspaceId, request.taskRef)
      if (request.actor.kind === 'member') {
        const member = this.requireMember(request.actor.memberId)
        if (member.state !== 'enabled') throw new Error(`Agent Member '${member.handle}' is ${member.state}`)
        if (request.action === 'accept') {
          if (!this.isProjectOwnerFrom(this.state, task.projectRef, request.actor.memberId)) throw new Error(`Only a Project owner can accept this Task (project_owner_required) — ${recoveryFor('project_owner_required').sentence({ projectRef: task.projectRef })}`)
          if (this.heldTaskClaimFrom(this.state, task.taskRef, request.actor.memberId)) throw new Error(`An Agent who held any Claim cannot accept this Task (self_acceptance_forbidden) — ${recoveryFor('self_acceptance_forbidden').sentence({ taskRef: task.taskRef })}`)
        } else if (task.accountable !== request.actor.memberId) {
          throw new Error(`Only the accountable owner can ${request.action} this Task (accountable_owner_required) — ${recoveryFor('accountable_owner_required').sentence({ taskRef: task.taskRef })}`)
        }
      }
      if (request.action === 'reopen' && !this.accountableIsValidFrom(this.state, task)) throw new Error(`The previous accountable is no longer a Project owner (accountable_target_invalid) — ${recoveryFor('accountable_target_invalid').sentence({ taskRef: task.taskRef })}`)
      const deferred = this.deferredThreadWrite(request.actor.memberId, task, thread, request.baseRevision)
      if (deferred !== undefined) return this.resolved(deferred)
      if (request.action === 'accept' && task.resolution !== 'open') throw new Error(`Task '${task.taskRef}' is already ${task.resolution}`)
      if (request.action === 'close' && task.resolution === 'closed') throw new Error(`Task '${task.taskRef}' is already closed`)
      // Acceptance normally waits for every Claim to finish (in_review);
      // a Human may also accept early while work is in progress, which then
      // completes the still-active Claims inside the same atomic operation.
      // A never-claimed todo Task may be accepted directly as well: work
      // finished outside the ledger is declared complete by the Human.
      if (request.action === 'accept' && request.actor.kind === 'member' && task.status !== 'in_review') {
        throw new Error(`An Agent may accept only an in_review Task; current status is '${task.status}' (accept_requires_in_review) — ${recoveryFor('accept_requires_in_review').sentence({ taskRef: task.taskRef })}`)
```

</details>

#### 缺口

- 真实跨任务交接与人类工时没有本次对照。
  **影响**：可能把人工协调变成更多Agent通信和返工。
  **进一步探讨**：用两个可复现小任务对比单Agent。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 角色规则是否只靠提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

ledger.changeTask串行处理，先做requestId重放匹配和工作区actor检查。Agent验收需项目owner、从未持有该任务Claim且任务in_review；人类具有提前验收分支。这些属于服务端状态规则，强于提示约定。根服务用operations表构建ledger，普通会话preset通过patch隔离，不能把Team规则泛化到所有宿主会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/agent-team/src/ledger.ts:1610-1640](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/ledger.ts#L1610-L1640)

idempotency、actor及角色检查

<details>
<summary>查看原文（31行）</summary>

```text
  changeTask(request: AgentTeamAuthorizedTaskRequest): Promise<AgentTeamLedgerResult<AgentTeamTaskResult>> {
    return this.enqueue(async () => {
      const existing = this.state.byRequest.get(request.requestId)
      if (existing !== undefined) {
        this.assertSameTask(existing, request)
        return this.resolved(this.taskResult(existing))
      }
      this.assertActorForWorkspace(request.actor, request.workspaceId)
      const { task, thread } = this.threadForActor(request.actor, request.workspaceId, request.taskRef)
      if (request.actor.kind === 'member') {
        const member = this.requireMember(request.actor.memberId)
        if (member.state !== 'enabled') throw new Error(`Agent Member '${member.handle}' is ${member.state}`)
        if (request.action === 'accept') {
          if (!this.isProjectOwnerFrom(this.state, task.projectRef, request.actor.memberId)) throw new Error(`Only a Project owner can accept this Task (project_owner_required) — ${recoveryFor('project_owner_required').sentence({ projectRef: task.projectRef })}`)
          if (this.heldTaskClaimFrom(this.state, task.taskRef, request.actor.memberId)) throw new Error(`An Agent who held any Claim cannot accept this Task (self_acceptance_forbidden) — ${recoveryFor('self_acceptance_forbidden').sentence({ taskRef: task.taskRef })}`)
        } else if (task.accountable !== request.actor.memberId) {
          throw new Error(`Only the accountable owner can ${request.action} this Task (accountable_owner_required) — ${recoveryFor('accountable_owner_required').sentence({ taskRef: task.taskRef })}`)
        }
      }
      if (request.action === 'reopen' && !this.accountableIsValidFrom(this.state, task)) throw new Error(`The previous accountable is no longer a Project owner (accountable_target_invalid) — ${recoveryFor('accountable_target_invalid').sentence({ taskRef: task.taskRef })}`)
      const deferred = this.deferredThreadWrite(request.actor.memberId, task, thread, request.baseRevision)
      if (deferred !== undefined) return this.resolved(deferred)
      if (request.action === 'accept' && task.resolution !== 'open') throw new Error(`Task '${task.taskRef}' is already ${task.resolution}`)
      if (request.action === 'close' && task.resolution === 'closed') throw new Error(`Task '${task.taskRef}' is already closed`)
      // Acceptance normally waits for every Claim to finish (in_review);
      // a Human may also accept early while work is in progress, which then
      // completes the still-active Claims inside the same atomic operation.
      // A never-claimed todo Task may be accepted directly as well: work
      // finished outside the ledger is declared complete by the Human.
      if (request.action === 'accept' && request.actor.kind === 'member' && task.status !== 'in_review') {
        throw new Error(`An Agent may accept only an in_review Task; current status is '${task.status}' (accept_requires_in_review) — ${recoveryFor('accept_requires_in_review').sentence({ taskRef: task.taskRef })}`)
```

</details>

**依据 2 · 源码核查**：[packages/agent-team/src/ledger.ts:6655-6658](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/ledger.ts#L6655-L6658)

进程内操作串行

```text
  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationTail.then(operation)
    this.operationTail = result.then(() => {}, () => {})
    return result
```

**依据 3 · 源码核查**：[packages/agent-team/src/index.ts:838-848](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/index.ts#L838-L848)

实际持久表构建ledger

<details>
<summary>查看原文（11行）</summary>

```text
      await domain.close()
      await this.backend?.close()
    }, 'agentTeam.dispose')
    this.domain = domain
    const ledger = new AgentTeamLedger(domain.table('operations'), {
      areFactsVisible: surfaceVisibilityProbe(memberId => this.handles.get(memberId)?.agent),
      areMainEntriesVisible: (memberId, entries, projectRef) => {
        const agent = this.handles.get(memberId)?.agent
        if (agent === undefined) return false
        const surface = visibleTeamSurface(agent)
        return entries.every(entry => isMainEntryOnSurface(surface, entry, projectRef))
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-18](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/cordis.patch.yml#L1-L18)

Team preset registry隔离

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: contexera-agent-team-scope
      name: cordis:group
      group: true
      isolate:
        agentPresets: true
      config:
        # A registry instance private to this group: `isolate` above keeps it
        # invisible to ordinary sessions, which keep composing the host's
        # default `standard` preset. `default` here therefore names what an
        # unnamed session inside this group composes — never what the host
        # composes. Members always pass their explicit `presetId` on mount;
        # a missing definition fails loudly (`agent-preset/not-found`)
        # instead of silently degrading.
        - id: contexera-agent-team-preset-registry
          name: '@deepseek-ai/dsh-agent-preset-registry'
          config:
            default: team-member
```

</details>

#### 缺口

- 重启和跨进程同时写入的实际一致性未验。
  **影响**：服务端规则存在不证明崩溃或多主场景安全。
  **进一步探讨**：重放相同requestId并在提交边界重启。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隔离和自主行动边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

实际managed session接线把sandbox mode设为danger-full-access，作者限定单机、一个Human，并说明无定时器和离线不运行。私有记忆目录只是成员上下文组织，不构成恶意Agent间文件隔离。无self-accept不保证评审独立思考，也不能阻止共享权限下读写他人成果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/agent-team/src/index.ts:2458-2469](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/index.ts#L2458-L2469)

实际设置全访问

<details>
<summary>查看原文（12行）</summary>

```text
          // this driver already claimed it; requeueing can reorder later input.
          return this.retiringAgents.has(agent) ? { kind: 'reject' as const } : next()
        })
        return {
          commit: () => {
            // The member scope composes no sandbox-policy service, so read the last logged mode from the session log (`sandbox/mode` is log-only).
            // Re-appending only when the effective mode differs keeps resumed members from growing redundant events.
            const logged = agent.session.ownEvents().toReversed().find(event => event.type === 'sandbox/mode')
            if (logged?.data.mode !== 'danger-full-access') setSandboxMode(agent.session, 'danger-full-access')
          },
        }
      }
```

</details>

**依据 2 · 作者声明**：[README.md:53-57](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/README.md#L53-L57)

作者单机和唤醒边界

```text
## Where it stands today

- **One machine.** One DSH server, one Human, and as many Agents as you create. Several Humans sharing one Team is not supported yet.
- **Agents wake on Team events.** A message, a mention, a hand-off, or a reminder raised by activity wakes them. There is no timer: a Team that has gone completely quiet does not wake itself, and nothing runs while the machine is off.
- **Agents work with full access.** Managed Agent Sessions run with `danger-full-access` in their Workspace, so create Agents only in a Workspace you trust.
```

**依据 3 · 作者声明**：[packages/agent-team/README.md:31-31](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/README.md#L31-L31)

记忆目录与生命周期说明

```text
Every team-managed session records `danger-full-access`. Session cwd remains the Workspace path, while private memory lives under `$DSH_HOME/agent-team/members/<memberId>/`. An untitled Member session is named with its handle through the session-title service, so the ordinary Session list shows the Member identity; an explicit rename or any earlier title always wins. The isolated `team-member` preset also provides coding tools including model-facing web search, Workspace instruction discovery, and Team protocol guidance. The host owns the shared Web service and provider; the preset mounts only the model-facing web tool. Its lowercase `memory.md` is a bounded 16 KiB reference index: missing context receives the full index, while later file edits produce a short stale-copy notice with current usage, not another full copy. Identity, ownership, and Workspace participation update separately; [Member context injection](../../docs/team-collaboration/memory-and-context.md#member-context-injection) defines recovery. `notes/` stays on-demand through filesystem tools. Over-budget indexes receive a maintenance warning, not silent truncation. Ordinary sessions and forks receive no Team identity or private-memory context. At Host startup every enabled Member's private memory is provisioned and an `inactive` Member's is removed with its Session archived; directories the replayed ledger does not reference are never pruned, so leftovers from a discarded ledger stay on disk for the operator. Both that removal and the activation-time migration of a pre-fix colon directory act only on paths inside the running process's own `$DSH_HOME/agent-team/members/`: a recorded path naming a different DSH home (an isolated test home, a second instance) is refused with a warning rather than renamed or deleted, because acting on it would take a Member's real private memory out of its home.
```

#### 缺口

- 破坏性工具权限、共享workspace竞争及长期恢复未测。
  **影响**：不能按多用户安全团队或无人值守生产执行采用。
  **进一步探讨**：限定无凭据测试repo，人工持有外部发布。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按作者明确rc.2和0.2.6包组合，使用编译CLI启动，避免源码重复scope模块。首次需可信Workspace和成员分工，持续成本为多模型会话、账本、评审与协调。退出先停止成员活动并备份Team账本和宿主会话、私有记忆，检查停用后无继续唤醒，原普通会话可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-89](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/README.md#L63-L89)

作者版本安装及启动限制

<details>
<summary>查看原文（27行）</summary>

````text
### 1. Check DSH

This release is certified against DSH `0.2.1-rc.2`. Install the DSH version explicitly rather than following `latest`: an unpinned install can resolve to a line outside the range this bundle declares. On DSH `0.1.7-rc.2`, stay on `@wowyuarm/dsh-agent-team` `0.1.15`. On DSH `0.2.0-rc.2`, stay on `@contexera/dsh-agent-team` `0.2.3`. On DSH `0.2.0-rc.1`, stay on `@wowyuarm/dsh-agent-team` `0.2.0`.

```sh
npx @deepseek-ai/dsh@0.2.1-rc.2 web
```

Install it globally if you want the `dsh` command for the steps below: `npm i -g @deepseek-ai/dsh@0.2.1-rc.2`.

Stop it, then install Agent Team into the `web` profile:

```sh
dsh plugin --profile web add @contexera/dsh-agent-team@0.2.6
```

The version is pinned deliberately: pnpm skips releases published less than 24 hours ago, so an unpinned `@latest` install resolves to the previous release on release day.

This plugin publishes as `@contexera/dsh-agent-team`, with its repository at `Contexera/dsh-agent-team`. The former `@wowyuarm/dsh-agent-team` stays at 0.2.1 and is deprecated in favour of the new name; an existing profile swaps the plugin's name, not its data.

### 2. Start the Web UI

```sh
dsh web
```

Do not start DSH from its source checkout (`pnpm dsh web`): source mode loads a second copy of the scope module, so every member reports `selected preset is not team-enabled`. Always start the compiled CLI.
````

</details>

**依据 2 · 作者声明**：[README.md:55-57](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/README.md#L55-L57)

运行前提

```text
- **One machine.** One DSH server, one Human, and as many Agents as you create. Several Humans sharing one Team is not supported yet.
- **Agents wake on Team events.** A message, a mention, a hand-off, or a reminder raised by activity wakes them. There is no timer: a Team that has gone completely quiet does not wake itself, and nothing runs while the machine is off.
- **Agents work with full access.** Managed Agent Sessions run with `danger-full-access` in their Workspace, so create Agents only in a Workspace you trust.
```

**依据 3 · 作者声明**：[packages/agent-team/README.md:31-31](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/README.md#L31-L31)

记忆保留和清理说明

```text
Every team-managed session records `danger-full-access`. Session cwd remains the Workspace path, while private memory lives under `$DSH_HOME/agent-team/members/<memberId>/`. An untitled Member session is named with its handle through the session-title service, so the ordinary Session list shows the Member identity; an explicit rename or any earlier title always wins. The isolated `team-member` preset also provides coding tools including model-facing web search, Workspace instruction discovery, and Team protocol guidance. The host owns the shared Web service and provider; the preset mounts only the model-facing web tool. Its lowercase `memory.md` is a bounded 16 KiB reference index: missing context receives the full index, while later file edits produce a short stale-copy notice with current usage, not another full copy. Identity, ownership, and Workspace participation update separately; [Member context injection](../../docs/team-collaboration/memory-and-context.md#member-context-injection) defines recovery. `notes/` stays on-demand through filesystem tools. Over-budget indexes receive a maintenance warning, not silent truncation. Ordinary sessions and forks receive no Team identity or private-memory context. At Host startup every enabled Member's private memory is provisioned and an `inactive` Member's is removed with its Session archived; directories the replayed ledger does not reference are never pruned, so leftovers from a discarded ledger stay on disk for the operator. Both that removal and the activation-time migration of a pre-fix colon directory act only on paths inside the running process's own `$DSH_HOME/agent-team/members/`: a recorded path naming a different DSH home (an isolated test home, a second instance) is refused with a warning rather than renamed or deleted, because acting on it would take a Member's real private memory out of its home.
```

#### 缺口

- 停用、历史恢复及多次重启成本无本次结果。
  **影响**：持久成员可能积累状态，不能仅移包后放弃核对。
  **进一步探讨**：记录活动成员与待办，测试停用和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样区分流程改进和额外复杂度？

**研究主题**：新假设与验证

#### 完整回答

相同代码任务对比人工协调多会话和Team，记录合格交付、验收独立性、人类介入、总模型用量、耗时和重开次数。注入过期revision、重复request、实现者验收、取消和重启。若角色门禁可绕过、任务丢交接或用量增长不能抵消人工节省，则收窄到可观察实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/agent-team/src/ledger.ts:1610-1640](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/packages/agent-team/src/ledger.ts#L1610-L1640)

可测试状态和验收规则

<details>
<summary>查看原文（31行）</summary>

```text
  changeTask(request: AgentTeamAuthorizedTaskRequest): Promise<AgentTeamLedgerResult<AgentTeamTaskResult>> {
    return this.enqueue(async () => {
      const existing = this.state.byRequest.get(request.requestId)
      if (existing !== undefined) {
        this.assertSameTask(existing, request)
        return this.resolved(this.taskResult(existing))
      }
      this.assertActorForWorkspace(request.actor, request.workspaceId)
      const { task, thread } = this.threadForActor(request.actor, request.workspaceId, request.taskRef)
      if (request.actor.kind === 'member') {
        const member = this.requireMember(request.actor.memberId)
        if (member.state !== 'enabled') throw new Error(`Agent Member '${member.handle}' is ${member.state}`)
        if (request.action === 'accept') {
          if (!this.isProjectOwnerFrom(this.state, task.projectRef, request.actor.memberId)) throw new Error(`Only a Project owner can accept this Task (project_owner_required) — ${recoveryFor('project_owner_required').sentence({ projectRef: task.projectRef })}`)
          if (this.heldTaskClaimFrom(this.state, task.taskRef, request.actor.memberId)) throw new Error(`An Agent who held any Claim cannot accept this Task (self_acceptance_forbidden) — ${recoveryFor('self_acceptance_forbidden').sentence({ taskRef: task.taskRef })}`)
        } else if (task.accountable !== request.actor.memberId) {
          throw new Error(`Only the accountable owner can ${request.action} this Task (accountable_owner_required) — ${recoveryFor('accountable_owner_required').sentence({ taskRef: task.taskRef })}`)
        }
      }
      if (request.action === 'reopen' && !this.accountableIsValidFrom(this.state, task)) throw new Error(`The previous accountable is no longer a Project owner (accountable_target_invalid) — ${recoveryFor('accountable_target_invalid').sentence({ taskRef: task.taskRef })}`)
      const deferred = this.deferredThreadWrite(request.actor.memberId, task, thread, request.baseRevision)
      if (deferred !== undefined) return this.resolved(deferred)
      if (request.action === 'accept' && task.resolution !== 'open') throw new Error(`Task '${task.taskRef}' is already ${task.resolution}`)
      if (request.action === 'close' && task.resolution === 'closed') throw new Error(`Task '${task.taskRef}' is already closed`)
      // Acceptance normally waits for every Claim to finish (in_review);
      // a Human may also accept early while work is in progress, which then
      // completes the still-active Claims inside the same atomic operation.
      // A never-claimed todo Task may be accepted directly as well: work
      // finished outside the ledger is declared complete by the Human.
      if (request.action === 'accept' && request.actor.kind === 'member' && task.status !== 'in_review') {
        throw new Error(`An Agent may accept only an in_review Task; current status is '${task.status}' (accept_requires_in_review) — ${recoveryFor('accept_requires_in_review').sentence({ taskRef: task.taskRef })}`)
```

</details>

**依据 2 · 作者声明**：[README.md:28-32](https://github.com/Contexera/dsh-agent-team/blob/08c3e4b6ec41382941236e461cde4ffede234ffd/README.md#L28-L32)

作者提出持久与交接目标

```text
- **Members persist.** Each agent is a named Member with its own memory, notes, and skills. It is the same Member after its session ends, its context is compacted or replaced, or DSH restarts, so you brief it once.
- **Every outcome has one owner.** Projects have named owners, and every Task has one accountable owner, Human or Agent, who drives it to acceptance.
- **Whoever builds does not verify.** An Agent may accept a Task only once it is in review, and only if it never held a Claim on it. Close, reopen, and transfer stay with the accountable owner and with you.
- **The room is built for agents.** Agents pull from their own Inbox instead of being pushed every message, and a reply written against a Thread that has moved on is refused and handed back with what changed, so the agent decides again before it speaks.
- **Everything is on the record.** The Main stream, Threads, and Tasks live on one append-only ledger. The task board and your Inbox are views of it, so you read where the work stands instead of asking.
```

#### 缺口

- 没有同任务真实Team运行。
  **影响**：当前无法确认端到端自治收益和恢复成熟度。
  **进一步探讨**：保留账本、调用结果与独立验收表。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
