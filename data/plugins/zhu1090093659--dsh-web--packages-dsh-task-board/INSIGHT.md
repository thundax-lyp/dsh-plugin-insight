# DSH Task Board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 120,209](https://img.shields.io/static/v1?label=npm+30d&message=120%2C209&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)
<!-- END META -->

> **功能**：在 DSH 中组织任务卡片、调度宿主会话，并提供执行记录与可选验收。

> **亮点**：[Q02](#research-q02) 显示任务、持久台账和宿主会话的连接；[Q03](#research-q03) 对启用验收的完成声明增加通过记录要求。相对人工看板是可回查流程，不证明业务结果一定合格。

> **主要限制**：[Q03](#research-q03) 显示手工 Done、普通单轮与通过验收的 goal 运行并不相同；把卡片列当完成证据会掩盖未执行或未验收。

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
  - [Q01 · 谁需要任务板及后台会话，人工看板能否替代？](#detail-section-11)
  - [Q02 · 卡片如何持久化并启动真实会话？](#detail-section-12)
  - [Q03 · 完成 gate 是否覆盖手动列及所有执行？](#detail-section-13)
  - [Q04 · 依赖、权限和失败恢复成本是什么？](#detail-section-14)
  - [Q05 · 什么条件值得试用，何时停止？](#detail-section-15)
  - [Q06 · 明确区分状态能否减少完成误信？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要组织周期性巡检或代码任务的 DSH 维护者可按卡片查看执行与结果；仍需对业务结果负责。

人工看板配合普通 DSH 会话可记录任务；该组件增加宿主侧调度、会话绑定与可选验收，不代表已证实节省人时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 卡片与台账 | 组织任务并保存状态 | 手工移动列不等于执行 |
| 宿主执行 | 将卡片任务发送到会话 | 需工作区、模型及权限 |
| 目标验收 | 适用 goal 完成前检查记录 | 双开关和适用性决定是否启用，裁判可能误判 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与网关、工作区 | 启动和执行需要 | 挂载台账及会话 | 缺工作区时拒绝创建会话 |
| 模型服务 | Agent 执行和裁判需要 | 生成工作与可选验收 | 不可用时运行或验收无法正常完成 |
| Host 持续运行 | 后台调度需要 | 启动和追踪执行 | 机器休眠或断电时效果未验证 |
| 文件与网络权限 | 对应任务需要 | 工作区和外部操作 | 影响按实际权限及任务判断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选工作区和权限 | 可恢复且范围明确 |
| 启动 | Host 打开 execution 并向会话发送任务 | session 与 execution 绑定 |
| 结算 | Host 检查会话，适用时检查验收记录 | 无通过记录时不能认作已验收成功 |
| 复核 | 用户检查产物和外部副作用 | 状态或副作用不明时停止重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与模型资源未知 | 配置工作区和权限，时间未知 | 需要兼容版本 |
| 持续 | 会话、裁判和后台调度成本未知 | 复核任务与验收，时间未知 | 可选 goal 和裁判消耗资源 |
| 失败恢复 | 重试和存储成本未知 | 检查状态、日志及外部副作用 | 中断恢复未经实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主执行 | 卡片绑定会话并持久化记录 | 长期调度和恢复成功率 |
| 完成门槛 | 适用 goal 执行要求匹配通过记录 | 裁判误判及真实业务合格率 |
| 手工状态 | 无执行时可移动卡片 | 读者能否正确辨识验收状态 |

> **思考**：[Q03](#research-q03) 显示手工 Done、普通单轮与通过验收的 goal 运行并不相同；把卡片列当完成证据会掩盖未执行或未验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 显示任务、持久台账和宿主会话的连接；[Q03](#research-q03) 对启用验收的完成声明增加通过记录要求。相对人工看板是可回查流程，不证明业务结果一定合格。

[Q02](#research-q02) 的 execution 绑定和 ledger 临时写入、fsync、rename 可支持恢复设计；[Q03](#research-q03) 的契约冻结和匹配验收约束有明确适用范围，不能外推到手工列。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示手工 Done、普通单轮与通过验收的 goal 运行并不相同；把卡片列当完成证据会掩盖未执行或未验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议可审查结果的维护者先在临时工作区运行无外部副作用的单卡；终态或副作用不明时停止自动重跑并人工检查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持所查状态与执行机制；裁判准确率、长期恢复和业务效果未经验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/README.md、packages/dsh-task-board/package.json、packages/dsh-task-board/src/index.ts、packages/dsh-task-board/src/host-ledger.ts、packages/dsh-task-board/src/host-service.ts、packages/dsh-task-board/src/host-runner.ts、packages/dsh-task-board/src/host/verification-gate.ts、packages/dsh-task-board/src/core/tasks.ts、packages/dsh-task-board/src/host-routes.ts 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定子包的宿主台账、会话启动、目标验收和请求准入；未运行插件、宿主、裁判或真实调度，也未全面检查 GitHub 扩展和团队路径。
- 下一步：在隔离宿主固定版本，分别测试手工 Done、普通单轮、goal 启用且通过／失败／无记录，以及断连重启；核对会话、报告、文件与模型费用。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出同时展示手工声明、执行、证据及副作用的未验证假设；若固定卡片理解实验未减少误信则不推广。

在隔离宿主固定版本，分别测试手工 Done、普通单轮、goal 启用且通过／失败／无记录，以及断连重启；核对会话、报告、文件与模型费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 541 | — | — | 31968 |
| .ts | source | 77 | 23658 | 14277 | 8084 | — |
| .tsx | source | 24 | 7546 | 5842 | 1426 | — |
| .ts | test | 88 | 25317 | 18241 | 4388 | — |
| .tsx | test | 32 | 8491 | 6067 | 1413 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查任务卡片如何持久化、调度会话及限制完成声明，并区分手工状态和验收结果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要任务板及后台会话，人工看板能否替代？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户可把巡检或代码任务以卡片组织、启动宿主会话并查看结果。子包 README.md:14-23 的后台调度和独立裁判是作者主张；相对人工任务板和普通对话，源码接入实际会话、记录执行以及可选验收，有可追踪的流程增量。合格结果仍取决于任务目标和外部验收，图形列不等于业务完成。未获取同任务的人时、合格率或用户反馈，不能从功能数量推断减少成本。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:14-23](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/README.md#L14-L23)

作者描述任务板、调度与验收。

<details>
<summary>查看原文（10行）</summary>

```text
  <strong>Autonomous Kanban Task Board & Cron Scheduling for DeepSeek Harness (DSH)</strong><br>
  <em>Host-Authoritative Ledger · Parent-Card Subtask Dispatch · Double-Blind Verification · Sleep Inhibition · GitHub Issue-to-PR</em>
</p>

A hot-pluggable DeepSeek Harness (DSH) Web GUI and official desktop client task automation plugin with a Host-authoritative task ledger, real DSH agent session execution, cron background scheduling, cross-platform idle-sleep protection, parent-card subtask dispatch, and automated verification quality gates. It executes unattended background workflows including automated code reviews, routine health checks, and scheduled pipelines without requiring an open browser window. It mounts cleanly via `cordis.patch.yml` and profiles without modifying DSH core code.

- Host-authoritative architecture and offline background execution: The browser is merely an asynchronous view; closing tabs or dropping connections will not interrupt Host scheduling, session execution, or atomic ledger settlement. Built-in cross-platform sleep inhibition (macOS, Windows, Linux) allows screens to power down while preventing system idle sleep for reliable unattended automation.
- Parent-card dispatch over subtask trees: a task can carry subtasks, one to three levels deep as the deployment allows. Running a card opens one session, that card's own: the Host opens nothing for its subtasks, and that session reads them with `task_board_get`, dispatches them with `subagent` in dependency order, and writes their conclusions back with `task_board_manage` before it finishes. A card whose subtasks are still unfinished runs under the liangshen dispatcher preset.
- Double-blind adversarial judge quality gates (No False Completion): Intercepts false agent completion claims; requires verification by an independent Judge Model using strict coding criteria, a 0.65 threshold, two-round A/B position swapping, and validation against real workspace filesystem diffs, returning actionable diagnostics for self-repair.
- Automated GitHub loop, freeze handover, and agent tool surface: Real-time bidirectional GitHub Issues sync automates agent bug fixing and PR creation; supports `<<<FREEZE` session context snapshots with handover packages; exposes 8 native model tools for autonomous planning and external execution registration.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/index.ts:713-742](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/index.ts#L713-L742)

宿主服务与调度启动。

<details>
<summary>查看原文（30行）</summary>

```text
  // The 0.2.1 gateway requires every request to name the peer it speaks for:
  // the board calls as the host-local owner, so its peer is minted on this
  // fiber and aborts with it (see createOwnerPeer).
  const ownerPeer = createOwnerPeer(ctx)
  const host = new TaskBoardHostService(ctx.typertGateway, {
    workspaceRegistry: ctx.workspaceRegistry,
    ownerPeer,
    sessionDefaultPermission,
    maxSubtaskDepth: maxSubtaskDepth(),
    goalRunEnabled,
    runLaunchWidth,
    spendBudgetTokens,
    cardDefaults,
    verificationSettings,
    verificationCatalog,
    attachments: () => resolveAttachmentStore(ctx),
    modelInfo: () => resolveModelInfoReader(ctx),
    timers: resolveHostTimers(ctx),
    commandDispatcher: {
      async execute(sessionId, line, signal) {
        const agent = await resolveExecutionAgent(ctx, sessionId)
        return (await ctx.commands.execute(agent, line, [], signal))?.result
      },
    },
  })
  hostForCatalog = host
  // Configuration before start(): a disabled row must not take the first
  // scheduler tick, which would roll schedules the board is not running.
  host.setConfiguration(enabled(), preventIdleSleep(), sessionPollSeconds())
  host.start()
```

</details>

#### 缺口

- 没有同任务用户对照
  **影响**：不能推断节时及需求强度
  **进一步探讨**：对比同批卡片的人工看板与宿主执行的人工投入和合格率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 卡片如何持久化并启动真实会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/index.ts:713-742 创建 Host 服务并启动调度；src/host-ledger.ts:1420-1432 对任务创建 execution 并提交 ledger。src/host-service.ts:815-861 在启动前冻结配置，调用 runner.launch 并在会话提示前将 sessionId 与 execution 绑定。src/host-runner.ts:581-596 在没有 workspace 时拒绝，否则调用 session.create，然后 pinAndPrompt；783-792 将任务内容排入 session.prompt，随后尝试启用 goal。ledger.ts:1852-1869 通过临时文件、fsync 和 rename 保存。结果轮询后按 execution 状态结算；写入和恢复实现的存在不证明机器断电、休眠或外部副作用都能完整恢复。代码未在目标宿主运行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1420-1432](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-ledger.ts#L1420-L1432)

打开 execution 并提交台账。

<details>
<summary>查看原文（13行）</summary>

```text
  private startRun(root: TaskRecord, now: number, initiator?: string, rerun = false, progress?: ScheduleProgress, rework?: ExecutionRework): OpenedRun[] {
    const before = this.document.tasks
    const [participant] = cascadeTargets(before, root.id)
    if (participant === undefined || participant.archivedAt !== undefined) return []
    if (hasOpenExecution(participant)) return []
    const groupId = crypto.randomUUID()
    const base = rerun ? withStatus(participant, 'todo', now) : participant
    const opened = startExecution(base, now, crypto.randomUUID(), initiator, groupId, rework)
    let tasks: readonly TaskRecord[] = before.map(task => task.id === participant.id ? opened.task : task)
    if (progress !== undefined) tasks = applyScheduleProgress(tasks, root.id, progress, now)
    this.document.tasks = [...tasks]
    this.commit()
    return [{ task: resolveExecutionTargets(opened.task, before, this.maxSubtaskDepth), execution: opened.execution }]
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1852-1869](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-ledger.ts#L1852-L1869)

临时文件、fsync 与 rename。

<details>
<summary>查看原文（18行）</summary>

```text
  private commit(bumpRevision = true): void {
    if (bumpRevision) this.document.revision += 1
    mkdirSync(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp-${process.pid}`
    let fd: number | undefined
    try {
      fd = openSync(tmp, 'w', 0o600)
      writeFileSync(fd, JSON.stringify(this.document, null, 2), { encoding: 'utf8' })
      fsyncSync(fd)
      closeSync(fd)
      fd = undefined
      try { chmodSync(tmp, 0o600) } catch { /* Windows ACLs own access */ }
      renameSync(tmp, this.file)
      try {
        const dirFd = openSync(dirname(this.file), 'r')
        try { fsyncSync(dirFd) } finally { closeSync(dirFd) }
      } catch {
        // Windows does not permit fsync on a directory handle; rename remains atomic.
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:815-861](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-service.ts#L815-L861)

冻结契约、调用 runner、绑定 session。

<details>
<summary>查看原文（47行）</summary>

```text
      const { settings, globalGoalEnabled, catalog } = await (freezeContract ?? (() => this.freezeRunContract()))()
      // The GLOBAL native-/goal switch is read ONCE per run group and carried by
      // value for the whole execution: a settings edit after this point can only
      // affect executions that start later.
      // The card must ASK for the goal run: the option is off by default, so an
      // absent value is a plain turn exactly like an explicit false.
      const goalEnabled = globalGoalEnabled && opened.task.goalRun === true
      // The card's opt-out is a DISTINCT reason, not the board switch: the
      // report must be able to say which of the two turned the gate off.
      const skippedBy: ExecutionVerification['applicability'] = opened.task.skipVerification === true ? 'skipped' : 'disabled'
      const contract = resolveContract(
        { ...settings, enabled: settings.enabled && opened.task.skipVerification !== true },
        catalog,
      )
      // An execution that will not become a goal run can never fire the
      // completion gate, so it is marked with the reason that actually applied:
      // the global switch being off is its OWN reason, distinct from this run
      // simply not becoming a goal run (the card never opted in, or a refused or
      // unavailable /goal command), and it must never read as an accepted run.
      // The reason names which switch withheld the goal: the GLOBAL master
      // switch (this board never arms /goal) is a different fact from the card's
      // own goal option staying off — which is the default, so it is what an
      // untouched card gets.
      const notArmed: ExecutionVerification['applicability'] = globalGoalEnabled ? 'goal-unavailable' : 'goal-disabled'
      const initial: ExecutionVerification = {
        contract,
        attempts: [],
        applicability: !contract.enabled ? skippedBy : notArmed,
      }
      this.ledger.setVerification(opened.task.id, opened.execution.id, initial)
      const sessionId = await this.runner.launch(opened.task, {
        ...(reuseSessionId === undefined ? {} : { reuseSessionId }),
        ...(forcedPreset === undefined ? {} : { agentPreset: forcedPreset }),
        ...(promptContext === undefined ? {} : { promptContext }),
        // The frozen global switch travels with the launch, so the runner's
        // arming decision is exactly the one made above.
        goalEnabled,
        // The same catalog snapshot the acceptance contract was frozen from.
        catalog,
        // Bind the session to the execution before the prompt is queued, so the
        // completion gate can never observe the agent without its binding.
        onSession: (id) => {
          attached = id
          this.ledger.attachSession(opened.task.id, opened.execution.id, id)
        },
        onGoalArmed: (armed) => {
          this.setApplicability(opened.task.id, opened.execution.id, !contract.enabled ? skippedBy : armed ? 'enforced' : notArmed)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:581-596](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-runner.ts#L581-L596)

检查工作区并创建会话。

<details>
<summary>查看原文（16行）</summary>

```text
    // Nothing names a workspace and the deployment has none to resolve to, so
    // there is no place this run may legitimately start: `session.create` would
    // quietly land it in the Host process working directory (the desktop app's
    // profile directory). Refuse before the session exists, with the reason the
    // board settles the card with and the browser renders in the user's
    // language, so the fix (pick a workspace on the card) is what the user reads.
    if (workspaceId === undefined) throw new Error(MISSING_WORKSPACE_REASON)
    const created = await this.invoke('session', 'create', {
      workspaceId,
      ...(mode === undefined ? {} : { agentPreset: mode }),
    }) as { sessionId: ExecutionSessionId }
    const sessionId = created.sessionId
    options.onSession?.(sessionId)
    try {
      await this.invoke('session', 'rename', { sessionId, title: task.title })
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.onGoalArmed, options.goalEnabled === true, options.catalog)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:778-793](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-runner.ts#L778-L793)

排入 prompt 并尝试启动 goal。

<details>
<summary>查看原文（16行）</summary>

```text
    // The attachments are resolved AFTER the preflight and BEFORE the prompt:
    // an image becomes an image part of the prompt (after the text part), and
    // a file becomes a readable path in a preamble section of its own.
    const resolved = await this.resolveAttachments(attachments)
    const promptContext: PromptContext = resolved.files.length === 0 ? context : { ...context, files: resolved.files }
    await this.invoke('session', 'prompt', {
      sessionId,
      requestId: 'task-board-' + crypto.randomUUID(),
      mode: 'queue' as const,
      content: [
        { type: 'text' as const, text: promptText(task, promptContext) },
        ...resolved.images,
      ],
    })
    const armed = await this.armGoal(sessionId, task, promptContext, goalEnabled)
    onGoalArmed?.(armed)
```

</details>

#### 缺口

- 未执行断电和多进程恢复
  **影响**：不能推断持久性涵盖全部中断
  **进一步探讨**：隔离宿主验证调度、会话重启与外部副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成 gate 是否覆盖手动列及所有执行？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

src/index.ts:815-850 将 gate 接到 tools/pre-execute；host/verification-gate.ts:391-404 只对能绑定本板 execution、契约启用且 applicability 为 enforced 的对象工作，450-465 只拦 update_goal(action=complete) 并在 gate 异常时拒绝该完成声明。host-service.ts:1063-1088 对需要验收的成功结果要求匹配 pass，否则按不同原因标记失败；这比仅检查最终文本更严格，但裁判正确率没有验证。host-runner.ts:830-875 要全局 goal 与卡片 goalRun 两开关，缺命令或拒绝时继续普通单轮；跳过和非 goal 执行不应被称为通过了相同验收。host-ledger.ts:1152-1161 允许没有 open execution 的卡片手工改列，core/tasks.ts:706、729-740 的合法目标含 done；手动 Done 不等于执行或通过。README.md:27 说明客户端会区分列与最新执行不一致。需实际对照卡片、执行及验收记录，而不是只看列。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/index.ts:815-850](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/index.ts#L815-L850)

注册 pre-execute gate。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.effect(() => {
    const disposers: Array<() => void> = []
    try {
      // The goal acceptance gate: the OFFICIAL tool pre-execution lifecycle,
      // installed before the tool body runs, so a completion claim cannot take
      // effect without a matching acceptance pass record.
      const gate = createGoalVerificationGate({
        ledger: host.ledger,
        llm: () => resolveLlmRuntime(ctx),
        goals: () => {
          try {
            return ctx.get('goals') as GoalFace | undefined
          } catch {
            return undefined
          }
        },
        // The host's own observation of what a turn changed on disk, when this
        // deployment records it; the acceptance degrades to the trajectory alone
        // when it does not.
        workspaceChanges: () => probeWorkspaceChanges(ctx),
        callTimeoutMs: verificationCallTimeoutMsLive,
        budgetMs: verificationBudgetMsLive,
        logger: {
          warn: (message: string, ...rest: unknown[]) => {
            const logger = (ctx as { logger?: { warn?: (...args: unknown[]) => void } }).logger
            if (typeof logger?.warn === 'function') logger.warn(message, ...rest)
            else console.warn(message, ...rest)
          },
        },
      })
      // A capture-only context may implement no listener registry (it returns
      // no disposer), so the handle is pushed only when it really is one.
      const offGate = ctx.on('tools/pre-execute', async (exec, next) => {
        const decision = await gate({ name: exec.name, arguments: exec.arguments, agent: exec.agent, signal: exec.signal })
        return decision ?? next()
      })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:391-404](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host/verification-gate.ts#L391-L404)

限定本板 execution 和验收适用性。

<details>
<summary>查看原文（14行）</summary>

```text
  /** Evaluate one tool call; undefined means "not this gate's business". */
  const evaluate = async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    const binding = (() => {
      const agent = exec.agent as { id?: unknown } | undefined
      const sessionId = agent?.id === undefined ? '' : String(agent.id)
      return sessionId === '' ? undefined : deps.ledger.findOpenExecutionBySession(sessionId)
    })()
    if (binding === undefined) return undefined
    const verification = binding.execution.verification
    if (verification === undefined || verification.contract.enabled === false) return undefined
    // Only a goal run of the board's own execution is gated: a teammate
    // execution is certified through its Lead's aggregated evidence.
    if (verification.applicability !== 'enforced') return undefined
    if (passedAttempt(verification) !== undefined) return { kind: 'allow' }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:450-465](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host/verification-gate.ts#L450-L465)

只拦目标完成调用且异常拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
  return async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    if (exec.name !== 'update_goal') return undefined
    if (actionOf(exec.arguments) !== 'complete') return undefined
    if (exec.agent === undefined) return undefined
    // A call the caller already cancelled is not a policy refusal: let the host
    // produce its own cancellation result.
    if (exec.signal.aborted) return undefined
    try {
      return await evaluate(exec)
    } catch (error) {
      deps.logger.warn('[dsh-task-board] goal acceptance gate failed; the completion claim is refused (fail closed)', error)
      return deny(
        bounded('[任务看板 · 验收异常] 验收流程自身出错，本次完成声明已被拒绝：' + (error instanceof Error ? error.message : String(error))),
        'TASK_BOARD_VERIFICATION_ANOMALY',
        error instanceof Error ? error.message : String(error),
      )
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1063-1088](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-service.ts#L1063-L1088)

需要验收的成功结果须有匹配 pass。

<details>
<summary>查看原文（26行）</summary>

```text
        // Forced acceptance: the old fallback paths — a completed turn, a
        // paused goal, an unreadable projection, a manual settle — must never
        // be mistaken for a verified success. Only a matching pass record
        // settles this execution as succeeded.
        if (result.outcome === 'succeeded' && verificationRequired(verification) && passedAttempt(verification) === undefined) {
          // Two different failures share this branch, and they send the reader
          // in opposite directions: attempts on record mean the judge ran and
          // the work did not pass, while zero attempts mean the gate never
          // opened at all (issue #1837) — the session narrated completion
          // instead of calling `update_goal(action: complete)`.
          this.settleAndNotify(
            execution.taskId,
            execution.executionId,
            'failed',
            verificationNeverInvoked(verification)
              ? NEVER_INVOKED_VERIFICATION_REASON
              : verificationOnlyInvalid(verification)
                ? INVALID_ONLY_VERIFICATION_REASON
                : NO_MATCHING_PASS_VERIFICATION_REASON,
            result.summary,
          )
          continue
        }
        // The run's closing text rides whichever verdict it earned: a failed
        // execution still leaves what it managed to say.
        this.settleAndNotify(execution.taskId, execution.executionId, result.outcome, 'error' in result ? result.error : undefined, result.summary)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:830-875](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-runner.ts#L830-L875)

双开关及普通轮退化。

<details>
<summary>查看原文（46行）</summary>

```text
   * Arm dsh's built-in goal on the session. The task prompt is queued FIRST, so
   * the session's first turn carries the instruction verbatim; `/goal
   * <objective>` then turns the same text into a persistent objective, and
   * dsh's goal-round driver keeps starting continuation rounds until the agent
   * marks it complete (see {@link goalVerdict} for how the run settles).
   *
   * Two switches gate the arming, and BOTH must ask for it:
   * - the GLOBAL native-/goal switch (`goalEnabled`, default OFF), frozen when
   *   this execution started; and
   * - the task's own `goalRun` (absent means off, only an explicit true opts
   *   the card into a goal run).
   *
   * A refusal (no command dispatcher, no `/goal` command in this cohort, an
   * objective the command rejects) is reported and the run continues as a plain
   * turn: the task was asked to run, and a missing goal mode must not lose the
   * work.
   * @param sessionId - the session to arm in.
   * @param task - the task being run.
   * @param context - the run's prompt context.
   * @param goalEnabled - the GLOBAL switch, frozen for this execution.
   * @returns whether `/goal` was really armed.
   */
  private async armGoal(sessionId: ExecutionSessionId, task: TaskRecord, context: PromptContext, goalEnabled: boolean): Promise<boolean> {
    if (!goalEnabled) return false
    if (task.goalRun !== true) return false
    if (this.commands === undefined) {
      console.warn('[dsh-task-board] no command dispatcher is available; task ' + task.id + ' runs without /goal')
      return false
    }
    try {
      const command = await this.commands.execute(
        sessionId,
        '/goal ' + goalObjective(promptText(task, context)),
        AbortSignal.timeout(30_000),
      )
      if (command === undefined) {
        console.warn('[dsh-task-board] /goal was not acknowledged for session ' + sessionId + '; the run continues as a plain turn')
        return false
      }
      if (command.kind !== 'success') {
        console.warn('[dsh-task-board] /goal was refused for session ' + sessionId + ': ' + (command.text ?? 'no reason reported') + '; the run continues as a plain turn')
        return false
      }
      return true
    } catch (error) {
      console.warn('[dsh-task-board] could not arm /goal on session ' + sessionId + '; the run continues as a plain turn', error)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1152-1161](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-ledger.ts#L1152-L1161)

无执行时人工移动。

<details>
<summary>查看原文（10行）</summary>

```text
      case 'move': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        // The lock belongs to an open execution, not to the column: a card
        // parked in 'running' by hand has no session and stays movable, while
        // a card the runner is executing cannot be moved out from under it.
        if (hasOpenExecution(task)) throw new Error('running task cannot be moved')
        if (!canMoveManually(task.status, action.status)) throw new Error('invalid manual status')
        this.document.tasks = this.document.tasks.map(item => item.id === action.taskId ? withStatus(item, action.status, now) : item)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/core/tasks.ts:706-706](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/core/tasks.ts#L706-L706)

人工合法列包含 done。

```text
export const MANUAL_STATUSES: readonly TaskStatus[] = ['backlog', 'todo', 'running', 'done', 'failed']
```

#### 缺口

- 未测裁判误判和所有宿主异常
  **影响**：验收并不证明业务合格
  **进一步探讨**：对同一卡片分别核对手工、执行及验收记录并采用独立测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、权限和失败恢复成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:1-42 声明 DSH >=0.2.1-rc.3、Host 和 web 客户端；index.ts:57 注入系统提示、网关、工作区、webServer、agents 和 commands。host-routes.ts:227-240 优先使用宿主 connection 准入，随后有浏览器同源与回环等回退条件，不能将之解释为任何部署均安全。任务需要可用 workspace、模型和实际权限，host-runner.ts:581-591 在无 workspace 时拒绝启动。裁判模型、会话、轮询和可选休眠抑制会消耗资源；安装与持续使用要复核调度、权限和结果，失败后还须检查外部动作与 ledger。现金金额、时间、断电恢复和长期无人值守效果均未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/package.json:1-42](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/package.json#L1-L42)

包与 DSH 版本声明。

<details>
<summary>查看原文（42行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-task-board",
  "description": "Host-authoritative task board for the DSH Web GUI with real session execution, Host cron scheduling, and optional cross-platform idle-sleep protection; mounted without DSH source changes.",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/index.ts:57-57](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/index.ts#L57-L57)

宿主服务注入。

```text
export const inject = ['systemPrompt', 'typertGateway', 'workspaceRegistry', 'webServer', 'agents', 'commands']
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:227-240](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-routes.ts#L227-L240)

宿主准入和回退判定。

<details>
<summary>查看原文（14行）</summary>

```text
export function isTrustedTaskBoardRequest(req: IncomingMessage, access: ResolvedRouteAccess): boolean {
  const connection = access.connection?.()
  if (connection !== undefined && connection.requestRejection(req) === undefined) return true
  if (!browserSameOriginMarker(req)) return false
  if (isLoopbackRequest(req)) return true
  // The tunnel makes the socket and the Host describe the proxy, so the
  // origin-equality check of the direct fence has nothing to compare on this
  // path; the explicit cross-site marker is then the one signal that separates
  // the operator's own page from a third-party page posting through the tunnel,
  // and it is refused instead of being read as a mere tripwire.
  if (access.trustForwardedProxy()
    && req.headers['sec-fetch-site'] !== 'cross-site'
    && isForwardedLoopbackRequest(req)) return true
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:581-591](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-runner.ts#L581-L591)

缺 workspace 拒绝创建。

<details>
<summary>查看原文（11行）</summary>

```text
    // Nothing names a workspace and the deployment has none to resolve to, so
    // there is no place this run may legitimately start: `session.create` would
    // quietly land it in the Host process working directory (the desktop app's
    // profile directory). Refuse before the session exists, with the reason the
    // board settles the card with and the browser renders in the user's
    // language, so the fix (pick a workspace on the card) is what the user reads.
    if (workspaceId === undefined) throw new Error(MISSING_WORKSPACE_REASON)
    const created = await this.invoke('session', 'create', {
      workspaceId,
      ...(mode === undefined ? {} : { agentPreset: mode }),
    }) as { sessionId: ExecutionSessionId }
```

</details>

#### 缺口

- 费用、时间及长期中断恢复未经测量
  **影响**：不能推断资源成本或无人值守效果
  **进一步探讨**：在隔离环境记录模型消耗、权限和恢复结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件值得试用，何时停止？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

能够检查会话和代码的维护者可在临时工作区先运行一张无外部副作用的卡片，将手工列、execution 终态和验收报告分开检查。相对人工看板，此组件将任务挂到宿主会话并记录状态，goal 运行还可拦完成声明；它没有证明模型裁判的业务合格率，也不保证所有任务启用验收。若 workspace、执行终态或真实副作用不清楚，应停止自动重跑并回到人工检查。模型费用、额外裁判调用与人工复核是否低于原流程未经测量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:815-861](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-service.ts#L815-L861)

执行绑定及验收契约。

<details>
<summary>查看原文（47行）</summary>

```text
      const { settings, globalGoalEnabled, catalog } = await (freezeContract ?? (() => this.freezeRunContract()))()
      // The GLOBAL native-/goal switch is read ONCE per run group and carried by
      // value for the whole execution: a settings edit after this point can only
      // affect executions that start later.
      // The card must ASK for the goal run: the option is off by default, so an
      // absent value is a plain turn exactly like an explicit false.
      const goalEnabled = globalGoalEnabled && opened.task.goalRun === true
      // The card's opt-out is a DISTINCT reason, not the board switch: the
      // report must be able to say which of the two turned the gate off.
      const skippedBy: ExecutionVerification['applicability'] = opened.task.skipVerification === true ? 'skipped' : 'disabled'
      const contract = resolveContract(
        { ...settings, enabled: settings.enabled && opened.task.skipVerification !== true },
        catalog,
      )
      // An execution that will not become a goal run can never fire the
      // completion gate, so it is marked with the reason that actually applied:
      // the global switch being off is its OWN reason, distinct from this run
      // simply not becoming a goal run (the card never opted in, or a refused or
      // unavailable /goal command), and it must never read as an accepted run.
      // The reason names which switch withheld the goal: the GLOBAL master
      // switch (this board never arms /goal) is a different fact from the card's
      // own goal option staying off — which is the default, so it is what an
      // untouched card gets.
      const notArmed: ExecutionVerification['applicability'] = globalGoalEnabled ? 'goal-unavailable' : 'goal-disabled'
      const initial: ExecutionVerification = {
        contract,
        attempts: [],
        applicability: !contract.enabled ? skippedBy : notArmed,
      }
      this.ledger.setVerification(opened.task.id, opened.execution.id, initial)
      const sessionId = await this.runner.launch(opened.task, {
        ...(reuseSessionId === undefined ? {} : { reuseSessionId }),
        ...(forcedPreset === undefined ? {} : { agentPreset: forcedPreset }),
        ...(promptContext === undefined ? {} : { promptContext }),
        // The frozen global switch travels with the launch, so the runner's
        // arming decision is exactly the one made above.
        goalEnabled,
        // The same catalog snapshot the acceptance contract was frozen from.
        catalog,
        // Bind the session to the execution before the prompt is queued, so the
        // completion gate can never observe the agent without its binding.
        onSession: (id) => {
          attached = id
          this.ledger.attachSession(opened.task.id, opened.execution.id, id)
        },
        onGoalArmed: (armed) => {
          this.setApplicability(opened.task.id, opened.execution.id, !contract.enabled ? skippedBy : armed ? 'enforced' : notArmed)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:830-875](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-runner.ts#L830-L875)

goal 实际启用及回退。

<details>
<summary>查看原文（46行）</summary>

```text
   * Arm dsh's built-in goal on the session. The task prompt is queued FIRST, so
   * the session's first turn carries the instruction verbatim; `/goal
   * <objective>` then turns the same text into a persistent objective, and
   * dsh's goal-round driver keeps starting continuation rounds until the agent
   * marks it complete (see {@link goalVerdict} for how the run settles).
   *
   * Two switches gate the arming, and BOTH must ask for it:
   * - the GLOBAL native-/goal switch (`goalEnabled`, default OFF), frozen when
   *   this execution started; and
   * - the task's own `goalRun` (absent means off, only an explicit true opts
   *   the card into a goal run).
   *
   * A refusal (no command dispatcher, no `/goal` command in this cohort, an
   * objective the command rejects) is reported and the run continues as a plain
   * turn: the task was asked to run, and a missing goal mode must not lose the
   * work.
   * @param sessionId - the session to arm in.
   * @param task - the task being run.
   * @param context - the run's prompt context.
   * @param goalEnabled - the GLOBAL switch, frozen for this execution.
   * @returns whether `/goal` was really armed.
   */
  private async armGoal(sessionId: ExecutionSessionId, task: TaskRecord, context: PromptContext, goalEnabled: boolean): Promise<boolean> {
    if (!goalEnabled) return false
    if (task.goalRun !== true) return false
    if (this.commands === undefined) {
      console.warn('[dsh-task-board] no command dispatcher is available; task ' + task.id + ' runs without /goal')
      return false
    }
    try {
      const command = await this.commands.execute(
        sessionId,
        '/goal ' + goalObjective(promptText(task, context)),
        AbortSignal.timeout(30_000),
      )
      if (command === undefined) {
        console.warn('[dsh-task-board] /goal was not acknowledged for session ' + sessionId + '; the run continues as a plain turn')
        return false
      }
      if (command.kind !== 'success') {
        console.warn('[dsh-task-board] /goal was refused for session ' + sessionId + ': ' + (command.text ?? 'no reason reported') + '; the run continues as a plain turn')
        return false
      }
      return true
    } catch (error) {
      console.warn('[dsh-task-board] could not arm /goal on session ' + sessionId + '; the run continues as a plain turn', error)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1152-1161](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-ledger.ts#L1152-L1161)

人工列与执行独立。

<details>
<summary>查看原文（10行）</summary>

```text
      case 'move': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        // The lock belongs to an open execution, not to the column: a card
        // parked in 'running' by hand has no session and stays movable, while
        // a card the runner is executing cannot be moved out from under it.
        if (hasOpenExecution(task)) throw new Error('running task cannot be moved')
        if (!canMoveManually(task.status, action.status)) throw new Error('invalid manual status')
        this.document.tasks = this.document.tasks.map(item => item.id === action.taskId ? withStatus(item, action.status, now) : item)
```

</details>

#### 缺口

- 真实业务结果与裁判正确率未知
  **影响**：不能将试用升级为持续无人值守
  **进一步探讨**：用一张无外部副作用的卡片核对三类状态并人工验收。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 明确区分状态能否减少完成误信？

**研究主题**：新假设与验证

#### 完整回答

基于手动列、执行记录和 gate 的不同作用，可提出未验证假设：将“手工声明”“宿主执行结果”“证据验收”以及外部副作用状态默认并排展示，能降低维护者把 Done 当作已验收的误判。源码 README.md:27 已有列与最新执行不一致提示，因此新意仅是扩展到证据和副作用的明确呈现，不能宣称整套状态展示尚不存在。对照当前 UI 与新展示给维护者看固定卡片集，测完成状态识别、误信和阅读时间；若没有减少误信或阅读负担上升，则不推广。尚无原型和验证数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1152-1161](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-ledger.ts#L1152-L1161)

手工移动卡片。

<details>
<summary>查看原文（10行）</summary>

```text
      case 'move': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        // The lock belongs to an open execution, not to the column: a card
        // parked in 'running' by hand has no session and stays movable, while
        // a card the runner is executing cannot be moved out from under it.
        if (hasOpenExecution(task)) throw new Error('running task cannot be moved')
        if (!canMoveManually(task.status, action.status)) throw new Error('invalid manual status')
        this.document.tasks = this.document.tasks.map(item => item.id === action.taskId ? withStatus(item, action.status, now) : item)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1063-1088](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/src/host-service.ts#L1063-L1088)

需要验收的执行结算。

<details>
<summary>查看原文（26行）</summary>

```text
        // Forced acceptance: the old fallback paths — a completed turn, a
        // paused goal, an unreadable projection, a manual settle — must never
        // be mistaken for a verified success. Only a matching pass record
        // settles this execution as succeeded.
        if (result.outcome === 'succeeded' && verificationRequired(verification) && passedAttempt(verification) === undefined) {
          // Two different failures share this branch, and they send the reader
          // in opposite directions: attempts on record mean the judge ran and
          // the work did not pass, while zero attempts mean the gate never
          // opened at all (issue #1837) — the session narrated completion
          // instead of calling `update_goal(action: complete)`.
          this.settleAndNotify(
            execution.taskId,
            execution.executionId,
            'failed',
            verificationNeverInvoked(verification)
              ? NEVER_INVOKED_VERIFICATION_REASON
              : verificationOnlyInvalid(verification)
                ? INVALID_ONLY_VERIFICATION_REASON
                : NO_MATCHING_PASS_VERIFICATION_REASON,
            result.summary,
          )
          continue
        }
        // The run's closing text rides whichever verdict it earned: a failed
        // execution still leaves what it managed to say.
        this.settleAndNotify(execution.taskId, execution.executionId, result.outcome, 'error' in result ? result.error : undefined, result.summary)
```

</details>

**依据 3 · 作者声明**：[packages/dsh-task-board/README.md:25-27](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-task-board/README.md#L25-L27)

作者说明列与最新执行不一致标签。

```text
## Features

Cards keep multi-line title and description previews with visible metadata. Previews strip Markdown formatting; task details render description and prompt as safe Markdown without raw HTML or automatic remote images, and content taller than about eight rendered lines is clamped to a fixed height with a fade hint and a "Show more" toggle that expands and collapses it, while shorter content renders untouched with no toggle. Stored task text is unchanged. A bracketed title prefix such as `[Bug]:` renders as a type badge, and the description preview skips issue-form boilerplate (checkbox lists, section headings, empty-field placeholders), preferring a summary section when one exists. A left stripe shows the latest run (running, succeeded, failed, cancelled); a card whose column disagrees with that run is labelled as set by hand. Each column shows the time its cards differ by — created in Backlog/To Do, started while running, settled in Done/Failed — read in the Host time zone. The latest execution session opens straight from the card. Every column header toggles compact single-line cards (Done starts compact, the choice is stored in the browser). All five columns and the archive first group cards by provider source — full `owner/repository` labels for GitHub — with unclaimed cards in Local tasks; source groups sort by label and their fold choices persist per browser. Done source groups start collapsed while the other columns and the archive start expanded, and search always reveals matching groups. Done, Failed and the archive nest Today / Last 7 days / Earlier within each source group and fold the oldest group once that source holds more than 30 cards, unless a search is active.
```

#### 缺口

- 新呈现尚无原型或用户实验
  **影响**：不能声称降低误信
  **进一步探讨**：对照当前界面测固定卡片的识别正确率和阅读负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
