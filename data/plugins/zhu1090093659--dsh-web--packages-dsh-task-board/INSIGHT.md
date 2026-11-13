# DSH Task Board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 132,402](https://img.shields.io/static/v1?label=npm+30d&message=132%2C402&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)
<!-- END META -->

> **功能**：在 DSH Web 管理任务卡、真实会话执行和宿主定时计划。

> **亮点**：把工作区、会话执行与定时记录归在一张卡，并让宿主继续运行任务，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：子卡可能只继承父会话结果。停机触发点也会跳过，应分别核对运行和计划记录，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 定时卡片相比原生自动化页面有什么任务增量？](#detail-section-11)
  - [Q02 · 手动和定时启动怎样绑定权限与宿主运行条件？](#detail-section-12)
  - [Q03 · 有未完成子卡时，父卡成功能证明每个子任务执行吗？](#detail-section-13)
  - [Q04 · 怎样验证浏览器关闭后的一次任务，失败时如何退出？](#detail-section-14)
  - [Q05 · 突出子卡结论来源能否减少把继承结果当独立验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合要反复做仓库检查、希望用同一张卡管理会话与运行记录的 DSH 用户，见 [Q01](#research-q01)。

简单提醒用宿主自动化，稳定的脚本仍可用 CI，人工推理任务则用原会话和检查清单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 看板 | 维护卡片及执行记录 | 须有宿主服务 |
| 宿主定时 | 单次或周期触发 | 停机错过跳过 |
| 父卡派发 | 用父会话安排未完成子卡 | 需要调度预设 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 和宿主会话服务 | 必需 | 管理卡与创建会话 | 无法启动任务 |
| 有效工作区、预设和权限 | 执行时 | 绑定实际运行条件 | 失败或待确认 |
| liangshen 预设 | 有未完成子卡时 | 让父会话调度 | 缺失则拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 创建只读测试卡 | 已确认工作区 |
| 触发 | 安排一次并保留宿主在线 | 确认实际创建会话 |
| 收尾 | 检查输出或停用规则 | 无独立输出则人工重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和模型环境 | 设置工作区及权限 | 未知工时 |
| 持续 | 常驻主机与模型请求 | 复核卡片输出 | 每份合格结果费用未知 |
| 失败恢复 | 可能再次产生模型费用 | 核对错过或未开始的记录 | 停机不会补跑 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定时执行 | 宿主账本与计时器 | 实机稳定性 |
| 子卡 | 父会话调度与继承记录 | 独立完成率 |

> **思考**：子卡可能只继承父会话结果。停机触发点也会跳过，应分别核对运行和计划记录，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把工作区、会话执行与定时记录归在一张卡，并让宿主继续运行任务，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

运行器显式拒绝没有工作区或权限未确认的情况，定时恢复不补跑停机触发。继承结论应作为不同证据来源处理，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

子卡可能只继承父会话结果。停机触发点也会跳过，应分别核对运行和计划记录，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先开一次只读卡，确认关闭浏览器后宿主能触发并保留实际会话输出。出现跳过或输出无法核验时停止排期，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主执行与计划恢复策略；任务合格率、主机兼容及长期费用尚无实测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/README.md、packages/dsh-task-board/cordis.patch.yml、packages/dsh-task-board/src/index.ts、packages/dsh-task-board/src/client/index.ts、packages/dsh-task-board/src/host-runner.ts、packages/dsh-task-board/src/host-service.ts、packages/dsh-task-board/src/host-ledger.ts、packages/dsh-task-board/src/host/agent-tools.ts、packages/dsh-task-board/src/host-routes.ts 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对本机看板的挂载、权限、定时、子卡和代表性访问路径；未安装，未核宿主兼容矩阵、跨机器执行或独立 GitHub 扩展。
- 下一步：安排一次低权限试触发，分别模拟关浏览器和停宿主，核对卡片、计划和会话输出。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在子卡状态旁展示独立运行和继承结论的来源，盲评能否减少误验收，见 [Q05](#research-q05)。

安排一次低权限试触发，分别模拟关浏览器和停宿主，核对卡片、计划和会话输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 501 | — | — | 27136 |
| .ts | source | 72 | 19637 | 11772 | 6754 | — |
| .tsx | source | 23 | 6928 | 5327 | 1337 | — |
| .ts | test | 80 | 21622 | 15699 | 3674 | — |
| .tsx | test | 31 | 7929 | 5673 | 1309 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：验证卡片怎样在宿主触发真实会话，以及权限、失期和子卡结算对采用的限制。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 定时卡片相比原生自动化页面有什么任务增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用场景是反复运行仓库检查并希望把工作区、提示词和结果留在一张卡片上的开发者。作者说明官方自动化仍承担提醒或定时提示。固定源码中，这个扩展挂载独立看板并由宿主建立账本服务，执行器会实际创建、命名会话并提示。已用 CI 稳定执行的机械命令仍适合留在 CI。看板更适合需要会话推理和核对运行记录的检查，合格结果是会话输出满足任务规则并可追溯。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:24-32](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/README.md#L24-L32)

作者解释官方自动化与看板的职责。

```text
## Features

Cards keep multi-line title and description previews with visible metadata. Previews strip Markdown formatting; task details render description and prompt as safe Markdown without raw HTML or automatic remote images, and content taller than about eight rendered lines is clamped to a fixed height with a fade hint and a "Show more" toggle that expands and collapses it, while shorter content renders untouched with no toggle. Stored task text is unchanged. A bracketed title prefix such as `[Bug]:` renders as a type badge, and the description preview skips issue-form boilerplate (checkbox lists, section headings, empty-field placeholders), preferring a summary section when one exists. A left stripe shows the latest run (running, succeeded, failed, cancelled); a card whose column disagrees with that run is labelled as set by hand. Each column shows the time its cards differ by — created in Backlog/To Do, started while running, settled in Done/Failed — read in the Host time zone. The latest execution session opens straight from the card. Every column header toggles compact single-line cards (Done starts compact, the choice is stored in the browser). All five columns and the archive first group cards by provider source — full `owner/repository` labels for GitHub — with unclaimed cards in Local tasks; source groups sort by label and their fold choices persist per browser. Done source groups start collapsed while the other columns and the archive start expanded, and search always reveals matching groups. Done, Failed and the archive nest Today / Last 7 days / Earlier within each source group and fold the oldest group once that source holds more than 30 cards, unless a search is active.

- **Task board UI**: the board is the shell's own center-column panel — like the desktop application's Plugins page, it contributes a row to the shell's official sidebar panel list and a page to the layout's center-column seat, so row geometry, the active highlight, the collapsed rail, the label, and language switching are the shell's to own; the board provides five kanban columns, search, task details, archive/restore, execution history, and links to execution transcripts. Every column is reachable by hand, by dragging a card or from the detail view's move menu: the move writes the column and no execution record, so Done or Failed declares work that finished (or failed) outside a tracked run and Running parks work that is under way without a session, while a card the runner is actually executing refuses every move until it settles. Archived tasks are read-only except for restore, delete, and transcript viewing, and cannot run manually or on schedule until restored.
- **Two complementary automation entries**: the shell's official *Automation tasks* page manages reminders and timed prompts in the Host Schedule service, while *Task board* manages cards, subtasks, real Session execution, cron, and execution history. Both entries stay available so the user can choose the task shape; the board neither hides nor takes over the official page.
- **Detail layout and folds**: the task detail is two columns on a wide viewport — the left holds the task itself (description, execution prompt, labels, subtasks, frozen snapshot, handover bundle) and the right holds how this run will run (execution settings, scheduled runs, execution history, status); a narrow viewport falls back to one column in the same order. Workspace, agent preset, permission, model, and reasoning effort stay visible, while session reuse (continue in the same conversation) folds into one "Run Mode" row that echoes whether it is enabled while closed, so the card's shape is readable without expanding it. Scheduled runs and execution history each take one fold row: the schedule row says whether a rule is armed and when it next fires, the history row says how many runs there are and what the latest one did, and the list itself shows the five most recent runs until it is expanded. The permission gate and the current status never fold. The view uses three type sizes (title, body, meta), status and result badges share one filled slot scale, and every fold row and button carries a hit target of at least 44 pixels.
- **Continuation cards (data plane)**: a new task may paste a `<<<FREEZE ... >>>FREEZE` block from a session; it parses into a goal/progress/next snapshot persisted with the task (ledger v3). Cards carry a frozen badge, the detail view shows the full snapshot and freeze time, search covers snapshot text, and archive/restore matches plain tasks. The snapshot reuses the freeze security gate at the protocol layer: sensitive patterns become `[REDACTED]` with a marker, slash-prefixed command lines reject the whole snapshot, and each field is capped at 8 KiB.
- **Handover bundles and the permission confirmation gate**: a continuation card may attach a handover bundle — the pinned execution triplet (workspace / agent preset / permission) plus doc/script references. The bundle's triplet overrides the plain pin fields at execution, and the references ride the prompt as a handover preamble. A binding whose effective permission is above the deployment's permission baseline — the Host's own default permission preset unless the profile pins `sessionDefaultPermission` — is unconfirmed: manual run refuses, cron skips the card and rolls to the next occurrence, and the confirm button in the task detail resolves the binding; any later permission or bundle change re-arms the gate.
```

**依据 2 · 源码核查**：[packages/dsh-task-board/cordis.patch.yml:6-12](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/cordis.patch.yml#L6-L12)

宿主和浏览器实际挂载。

```text
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (the system-prompt announcement section), and the
# `dsh.client` declaration in package.json makes the browser half
# (exports "./client", served at /plugins/<id>/client.js) load in the web GUI.
- insert:
    - id: ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/index.ts:619-635](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/index.ts#L619-L635)

构造 Host 看板服务和依赖。

<details>
<summary>查看原文（17行）</summary>

```text
  const host = new TaskBoardHostService(ctx.typertGateway, {
    workspaceRegistry: ctx.workspaceRegistry,
    ownerPeer,
    sessionDefaultPermission,
    maxSubtaskDepth: maxSubtaskDepth(),
    runLaunchWidth,
    spendBudgetTokens,
    cardDefaults,
    modelCatalog,
    attachments: () => resolveAttachmentStore(ctx),
    modelInfo: () => resolveModelInfoReader(ctx),
    legacyAgentTeams,
    timers: resolveHostTimers(ctx),
    commandDispatcher: {
      async execute(sessionId, line, signal) {
        const agent = await resolveExecutionAgent(ctx, sessionId)
        return (await ctx.commands.execute(agent, line, [], signal))?.result
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:401-408](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/client/index.ts#L401-L408)

注册面板。

```text
    // panel selection is reconciled back into the controller so the board's own
    // view state follows the user clicking another panel row.
    try {
      disposers.push(registerTaskBoardPanel(ctx, controller))
      const layoutFace = ctx.get('layout') as { panelInfo?: { subscribe(listener: () => void): () => void; getSnapshot(): { activePanelId: unknown } } } | undefined
      if (layoutFace?.panelInfo !== undefined) {
        const sync = (): void => {
          const active = layoutFace.panelInfo!.getSnapshot().activePanelId
```

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:565-585](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-runner.ts#L565-L585)

为卡片实际开会话并提示。

<details>
<summary>查看原文（21行）</summary>

```text
    }
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
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
```

</details>

#### 缺口

- 未比较已有 CI 或宿主任务的长期维护量
  **影响**：无法估算迁移收益
  **进一步探讨**：以同一仓库巡检比较结果追溯和人工介入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 手动和定时启动怎样绑定权限与宿主运行条件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主用最近到期规则决定单个定时器，恢复时跳过停机期间的旧触发点。迟到超过容差也会走恢复，故关浏览器和关宿主结果不同。触发通过账本申请运行，运行器检查工作区后创建会话，权限命令必须确认成功才继续。仓库卡绑定超过默认权限时账本进入待确认条件。模型工具能显示此条件，确认仍需通过 UI 的人工流程。已启动的模型请求和插件关闭后的最终状态仍应核对运行记录，代码不能证明宿主之外的工作恰好一次完成。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1027-1085](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-service.ts#L1027-L1085)

到期、迟到和跳过规则。

<details>
<summary>查看原文（59行）</summary>

```text
   * Boot / resume recovery: skip every occurrence that came due while the
   * board was not running and roll each schedule to its next future target,
   * then arm the timer for the nearest one. Rendering the occurrence is
   * deliberately not attempted: the ACL of a card that fired hours ago is
   * stale, and the board's own recovery contract is "missed triggers are
   * skipped, never replayed".
   */
  private recoverSchedule(): void {
    if (this.disposed) return
    this.clearScheduleTimer()
    const now = this.now()
    this.ledger.setScheduler({ lastTickAt: now })
    this.ledger.skipMissed(now)
    this.armSchedule()
  }

  /**
   * Arm the native timer at the nearest armed future trigger. One timer serves
   * every schedule: the ledger's next target is the only instant the Host has
   * to wake for. A target beyond the platform's timer ceiling re-arms in
   * segments, and a target already past (the wall clock jumped, or the process
   * was suspended) is handled immediately as a recovery.
   */
  private armSchedule(): void {
    if (this.disposed || !this.active) return
    this.clearScheduleTimer()
    const target = this.ledger.nextArmedRunAt(this.now())
    if (target === undefined) return
    this.scheduleTarget = target
    const delay = Math.max(0, Math.min(target - this.now(), MAX_TIMER_DELAY_MS))
    this.scheduleTimer = this.timers.timeout(() => {
      this.scheduleTimer = undefined
      this.onScheduleFire(target)
    }, delay)
  }

  /**
   * One armed target became due. A fire landing well past its target is a
   * resume (suspend, throttle, forward clock jump) rather than a normal
   * occurrence, so it takes the recovery path instead of launching a run for a
   * long-stale instant.
   */
  private onScheduleFire(target: number): void {
    if (this.disposed || !this.active) return
    const now = this.now()
    this.scheduleTarget = undefined
    this.ledger.setScheduler({ lastTickAt: now })
    if (now - target > RECOVERY_TOLERANCE_MS) {
      this.recoverSchedule()
      return
    }
    const before = this.statusMap()
    for (const schedule of this.ledger.dueSchedules(now)) {
      // The ledger owns both the budget gate and the next target: it refuses a
      // rule that already spent its runs and stops a one-shot as it fires.
      this.dispatchRuns(
        this.ledger.openScheduled(schedule.taskId, now),
        {
          triggeredAt: now,
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:565-585](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-runner.ts#L565-L585)

找不到工作区则拒绝创建。

<details>
<summary>查看原文（21行）</summary>

```text
    }
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
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:690-706](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-runner.ts#L690-L706)

权限命令缺失、未确认及失败均中止。

<details>
<summary>查看原文（17行）</summary>

```text
  private async pinAndPrompt(
    sessionId: ExecutionSessionId,
    task: TaskRecord,
    permission: TaskPermission | undefined,
    context: PromptContext = {},
    catalog?: ModelCatalogView,
  ): Promise<void> {
    if (permission !== undefined) {
      if (this.commands === undefined) throw new Error('permission command dispatcher is unavailable')
      const command = await this.commands.execute(sessionId, '/permission ' + permission, AbortSignal.timeout(30_000))
      if (command === undefined) throw new Error('permission command was not acknowledged')
      if (command.kind !== 'success') throw new Error(command.text ?? 'permission command failed')
    }
    // The effort is bound to the model route the execution runs at. A card that
    // pins no model of its own runs at the session's route, so that route is
    // resolved first — and only when there is an effort to place: a card that
    // never chose one must not gain a model-selection call it did not have.
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1323-1333](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-ledger.ts#L1323-L1333)

账本检查权限确认条件。

<details>
<summary>查看原文（11行）</summary>

```text
   */
  private bindingRefusal(root: TaskRecord): { kind: 'root' | 'inherited'; title: string } | undefined {
    const resolved = resolveExecutionTargets(root, this.document.tasks, this.maxSubtaskDepth)
    if (!requiresPermissionConfirmation(resolved, this.sessionDefaultPermission)) return undefined
    return { kind: root.parentId === undefined ? 'root' : 'inherited', title: root.title }
  }

  /**
   * The rework block a rework request opens its execution with, or the refusal
   * that names why there is nothing to rework.
   *
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host/agent-tools.ts:175-183](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host/agent-tools.ts#L175-L183)

模型工具反映待确认状态。

```text
    ...(task.schedule === undefined ? {} : { schedule: scheduleView(task.schedule) }),
    ...(task.freeze === undefined ? {} : { continuationCard: true }),
    ...(task.permissionConfirmedAt === undefined ? {} : { permissionConfirmedAt: task.permissionConfirmedAt }),
    // Whether this card may run at all: an elevated binding still needs a
    // human confirmation, and only a human can give it.
    ...(requiresPermissionConfirmation(task, sessionDefault ?? DEFAULT_SESSION_PERMISSION)
      ? { permissionPending: true }
      : {}),
    executionCount: task.executions.length,
```

#### 缺口

- 断电、系统休眠和权限状态变化同时发生时的结算未实测
  **影响**：无法把无人值守当作可用性承诺
  **进一步探讨**：停宿主错过一次后再启动，核对计划和实际会话数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有未完成子卡时，父卡成功能证明每个子任务执行吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

启动父卡只开父卡自己的会话。存在未完成子卡时，宿主临时强制使用 liangshen 调度预设，并将子卡概要放进提示，原卡预设不改写。缺预设或旧 Agent Teams 冲突时在创建会话前拒绝。最终子卡可以有模型写回的独立记录，未记录且没有活跃执行的子卡也可能继承父卡的成功或失败。这类记录能够交代归因，却不足以证明子卡分别执行。子卡会改变试用的前置依赖和验收规则，需检查独立结果或原始会话，取消的父卡不会贡献决定性结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:711-745](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-service.ts#L711-L745)

单会话、强制预设与子卡提示。

<details>
<summary>查看原文（35行）</summary>

```text
  private async launch(opened: OpenedRun, schedule?: ScheduledRunContext, freezeCatalog?: RunCatalogFreezer): Promise<void> {
    /** The session this launch attached to the execution, once it exists. */
    let attached: string | undefined
    try {
      // One run opens ONE session: the card's own. Its unfinished subtasks are
      // dispatched from inside that session, so a card that carries them is
      // forced under the dispatcher preset and told which cards to pick up. The
      // force is applied here, per execution; the card's stored `mode` is
      // never rewritten by it.
      const forcedPreset = this.ledger.hasOutstandingDescendants(opened.task.id) ? LIANGSHEN_PRESET_ID : undefined
      const descendants = forcedPreset === undefined ? [] : this.ledger.outstandingDescendants(opened.task.id)
      // The rework this execution carries, when it carries one: it decides both
      // the session this run continues in and the section the prompt states.
      const rework = opened.execution.rework
      // A forced preset is not the card's own composition, so continuing a
      // session composed from another preset would be refused anyway: mint a
      // fresh one and run the tree the way this execution requires. A rework
      // has no such freedom — its whole point is the conversation the reviewer
      // read — so it fails instead of quietly opening a new one.
      let reuseSessionId: string | undefined
      if (rework === undefined) {
        reuseSessionId = forcedPreset === undefined ? await this.reuseSessionFor(opened.task) : undefined
      } else {
        if (forcedPreset !== undefined) throw new Error(REWORK_SESSION_REASON)
        reuseSessionId = await this.reworkSessionFor(opened.task)
      }
      // A cron-triggered run additionally states its own firing instant and
      // rule zone, so a scheduled job can resolve "today" without guessing.
      const contextParts = {
        ...(descendants.length === 0 ? {} : {
          descendants: descendants.map(descendant => ({
            id: descendant.id,
            title: descendant.title,
            status: descendant.status,
          })),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:517-539](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-runner.ts#L517-L539)

缺预设或旧 Teams 拒绝。

<details>
<summary>查看原文（23行）</summary>

```text
    if (mode !== undefined) {
      const presets = await this.invoke('agentPresets', 'list', {}) as { presets?: readonly { id: string; broken?: string }[] }
      const preset = presets.presets?.find(item => item.id === mode)
      // A forced preset is the run's shape, not a stored preference: a
      // deployment that does not serve it (the `liangshen` dispatcher preset is
      // shipped by packages/dsh-liangshen) cannot run this card the way its tree
      // requires, so the run fails closed with the reason readable on the card.
      if (preset === undefined && options.agentPreset !== undefined) {
        throw new Error('agent preset not found: ' + mode + ' (a card with unfinished subtasks runs under the '
          + LIANGSHEN_PRESET_ID + ' preset, which this deployment does not serve)')
      }
      if (preset === undefined) throw new Error('agent preset not found: ' + mode)
      if (preset.broken !== undefined) throw new Error('agent preset is unavailable: ' + preset.broken)
      // A forced preset is the run's shape, so the deployment must also be
      // able to orchestrate under it: the dispatcher preset's own compatibility
      // gate judges the tool surface at session start and, when the legacy
      // Agent Teams runtime shadows the coordination tools, stops and waits for
      // a human reply. A card with unfinished subtasks may be launched by a
      // schedule, so that reply never comes and the card would sit in running
      // forever (issue #2031). Refuse here instead, with the reason readable on
      // the card, rather than minting a session that can only deadlock.
      if (options.agentPreset !== undefined && this.faces.legacyAgentTeams?.() === true) {
        throw new Error(LEGACY_AGENT_TEAMS_REASON)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:967-990](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-ledger.ts#L967-L990)

说明并实现只继承决定性结果的前置条件。

<details>
<summary>查看原文（24行）</summary>

```text
   * execution reached a decisive terminal record, every outstanding descendant
   * this run opened no execution for inherits that verdict as an external
   * record.
   *
   * Idempotent by construction: a card that already carries an execution in
   * this run group (the fold owns it), an open execution (it is running on its
   * own), or a terminal record stamped after this run started (the dispatching
   * agent's own backfill, or an earlier pass of this one) is left alone. Only a
   * decisive verdict is inherited: a cancelled run judged nothing about the
   * subtasks, and a subtask already in the done column has nothing left to
   * inherit.
   * @param taskId - the card whose execution just settled.
   * @param executionId - that execution.
   * @param groupId - its run group.
   * @param now - clock instant (ms epoch).
   * @returns whether the document changed.
   */
  private inheritVerdictForDescendants(taskId: string, executionId: string, groupId: string, now: number): boolean {
    const root = this.document.tasks.find(item => item.id === taskId)
    if (root === undefined) return false
    const execution = root.executions.find(entry => entry.id === executionId)
    if (execution?.endedAt === undefined || execution.result === undefined) return false
    if (execution.result !== 'succeeded' && execution.result !== 'failed') return false
    const verdict: ExecutionOutcome = execution.result
```

</details>

**依据 4 · 作者声明**：[packages/dsh-task-board/README.md:36-37](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/README.md#L36-L37)

作者描述父卡运行、派发及回填。

```text
- **Subtasks and parent-card dispatch**: a task can be given subtasks, either by creating one from its detail view (the form starts from the parent's workspace, preset, permission, and model, and each stays overridable) or by linking an existing task that has no parent yet; a subtask can be detached again once it is not running. The lineage gate lives in the Host: the parent must exist and be on board, a task can never be attached under one of its own descendants, and a tree may not exceed the configured `maxSubtaskDepth` (1 by default, 3 maximum). Running a card opens one session for that card and none for its subtasks, and running a subtask directly is the same operation: that card is the root of the run even when it carries a parent and subtasks of its own, and nothing under it is expanded. A subtask already in the done column is outside the run's dispatch set, so finishing subtasks one by one and then running the parent costs one session instead of a repeat of the tree; move it back to the todo column to have it dispatched again. The board marks parent and subtask cards, the detail view lists the direct subtasks and says what one run will do, and the header offers a one-click hide-subtasks filter.
- **Parent-card dispatch and subtask accounting**: clicking a card that carries unfinished subtasks opens that card's own session and nothing else. The run is forced under the `liangshen` dispatcher preset shipped by `packages/dsh-liangshen`, the card's stored agent preset is never rewritten, and session reuse is skipped so the run mints a fresh session; a deployment that registers no `liangshen` preset fails the run closed, with that missing preset as the reason on the card, and so does a deployment running the legacy Agent Teams runtime, where that preset cannot orchestrate and would stop to await a reply an unattended run never gets: the run is refused before any session exists, and the card carries the reason naming the exit. The prompt names every unfinished subtask with its title, task id, and status, states that no session is opened for them, and asks the session to read each card with `task_board_get`, dispatch it with `subagent` in dependency order (independent ones may run together), and write each conclusion back with `task_board_manage({action:'record-external-outcome'})` before it finishes. A conclusion the session never wrote back is supplied by the Host when the card's own run ends: every still-unrecorded unfinished subtask inherits that verdict as an external record whose initiator reads `parent-run:<card id>` and whose reason says the card ran no session of its own and inherited the parent run's conclusion. The backfill is idempotent, and a cancelled parent writes nothing. A card with no unfinished subtask is unaffected.
```

#### 缺口

- 调度模型能否完整分解并回填各子卡未知
  **影响**：父卡成功可能造成子卡完成误判
  **进一步探讨**：用一个故意无独立输出的子卡验证结果来源和验收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证浏览器关闭后的一次任务，失败时如何退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有 DSH Web profile、需要在本机宿主仍在线时周期性检查仓库的开发者。先建一个只读任务卡，固定工作区、普通权限和一次近期触发，关浏览器但保留宿主，回看时间、会话输出和检查报告。对照用同提示手动开一个会话，按合格检查报告记录模型请求费用、复核时间和持续运行资源。没有本轮账单或节时数据。代理访问受宿主 connection 判断及自有回环、令牌策略影响，试用宜使用已知 profile。停机错过、需要提权或子卡只继承父卡结果时，停止增加规则，停用计划并回到手动执行。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:42-49](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/README.md#L42-L49)

作者描述存储、执行及 cron。

```text
- **Host-authoritative ledger**: tasks, schedules, and execution records live in `$DSH_HOME/task-board/ledger-v2.json`; browser actions become confirmed Host transactions.
- **Bounded execution history**: each task keeps the most recent 20 execution records; the oldest runs are trimmed when a new run starts, so ledger size and write cost stay bounded regardless of how often a task has run.
- **Real execution**: manual and scheduled runs use the same Host runner, which by default creates a fresh session, renames it, applies the agent preset and `/permission <id>`, queues the task prompt as a plain single-turn run, and settles the execution from that turn's result.
- **Task reasoning effort**: the task model picker exposes a reasoning-effort selector when the selected model declares supported levels in the Host model catalog. Leaving it blank inherits the model/Host default; only that model's declared levels are offered. The task stores its choice and applies it when selecting the execution model, including a reused session.
- **Optional session reuse**: a task can opt into continuing in its previous execution's session (issue #1419). Reuse happens only when that session is idle and still present in the runtime roster — the Host then re-applies the pinned permission and model on it and queues the prompt, keeping the conversation title and history; otherwise the run mints a fresh session as before, so an unknown roster or a busy session never blocks a scheduled run. The roster read is taken for the launch itself, so a board that has been idle reuses a session that has been idle all along instead of refusing it.
- **Idle-aware session polling (issue #1821)**: the Host reads the DSH session roster only while the board has something that roster can decide — an execution to inspect, or a card parked in the running column whose verdict may arrive from a settle this process never saw. An empty board with no running card, no open execution and no enabled schedule polls nothing at all, so an idle Host no longer rebuilds every persisted session row (string conversion, object allocation, one stat per record) on a fixed heartbeat. The cadence that governs a busy board is the `sessionPollSeconds` setting, and a roster read that fails or stays unknown backs off on a doubling delay up to one minute, so a session tree that is down is not hammered at the poll interval.
- **Fail-closed pins**: a missing workspace, missing or broken preset, or rejected permission command fails before the task prompt is sent.
- **Host scheduler**: 5-field cron supports `*`, `*/n`, ranges, comma lists, and Sunday `0/7`. Each rule carries its own IANA time zone (the Host's zone by default), and day-of-month/day-of-week follow Vixie semantics: both fields restricted means OR, any other combination means AND. Wall-clock gaps at a daylight-saving transition are skipped, and an ambiguous repeated time fires once, at the earlier instant. A rule is either a recurring cron rule — optionally capped by a run limit (unlimited, 1, 2, or any positive whole number) — or a one-shot pinned to a single future instant; the Host counts the executions it actually opens, and a rule that reaches its cap or fires its one-shot stops itself in the ledger rather than waiting for the executed work to disarm it.
```

**依据 2 · 作者声明**：[packages/dsh-task-board/README.md:86-101](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/README.md#L86-L101)

作者的安装渠道。

<details>
<summary>查看原文（16行）</summary>

````text
## Install

Install the aggregate package or this package alone, then restart `dsh web`:

```sh
dsh plugin --profile web add @linxin666/dsh-client-ui-task-board@latest
```

For local development:

```sh
git clone https://github.com/zhu1090093659/dsh-web.git
cd dsh-web
pnpm install
pnpm build
dsh plugin --profile web add link:$(pwd)/packages/dsh-task-board
````

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:227-246](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-routes.ts#L227-L246)

连接与代理准入判断。

<details>
<summary>查看原文（20行）</summary>

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
  const host = req.headers.host
  if (typeof host !== 'string') return false
  const parsed = parseAuthority(host)
  if (parsed === undefined || parsed.canonical !== host.toLowerCase()) return false
  if (!access.trustedProxyHosts.has(parsed.canonical) || !sameAuthority(req, parsed.url)) return false
  return matchesToken(req.headers[TASK_BOARD_PROXY_TOKEN_HEADER], access.proxyToken)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1034-1040](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-service.ts#L1034-L1040)

停机恢复的跳过操作。

```text
  private recoverSchedule(): void {
    if (this.disposed) return
    this.clearScheduleTimer()
    const now = this.now()
    this.ledger.setScheduler({ lastTickAt: now })
    this.ledger.skipMissed(now)
    this.armSchedule()
```

#### 缺口

- 合格报告的净成本与宿主开机维护量未知
  **影响**：无法决定周期性采用划算与否
  **进一步探讨**：同时记录会话账单、主机资源、失败排查和人工复核

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 突出子卡结论来源能否减少把继承结果当独立验收？

**研究主题**：新假设与验证

#### 完整回答

可在子卡状态旁直接显示独立运行、外部回填或继承父卡，并给继承成功增加核对输出入口。现有账本已有继承规则，新增的是审阅时清晰呈现来源。在父会话完整派发和漏一条独立输出两种记录上做盲评，统计审阅者误判及复核时间。若现有明细已经足够，新增提示未减少误判或让正常任务大量返工，则停止采用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:967-990](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/src/host-ledger.ts#L967-L990)

区分自己的执行和继承结论。

<details>
<summary>查看原文（24行）</summary>

```text
   * execution reached a decisive terminal record, every outstanding descendant
   * this run opened no execution for inherits that verdict as an external
   * record.
   *
   * Idempotent by construction: a card that already carries an execution in
   * this run group (the fold owns it), an open execution (it is running on its
   * own), or a terminal record stamped after this run started (the dispatching
   * agent's own backfill, or an earlier pass of this one) is left alone. Only a
   * decisive verdict is inherited: a cancelled run judged nothing about the
   * subtasks, and a subtask already in the done column has nothing left to
   * inherit.
   * @param taskId - the card whose execution just settled.
   * @param executionId - that execution.
   * @param groupId - its run group.
   * @param now - clock instant (ms epoch).
   * @returns whether the document changed.
   */
  private inheritVerdictForDescendants(taskId: string, executionId: string, groupId: string, now: number): boolean {
    const root = this.document.tasks.find(item => item.id === taskId)
    if (root === undefined) return false
    const execution = root.executions.find(entry => entry.id === executionId)
    if (execution?.endedAt === undefined || execution.result === undefined) return false
    if (execution.result !== 'succeeded' && execution.result !== 'failed') return false
    const verdict: ExecutionOutcome = execution.result
```

</details>

**依据 2 · 作者声明**：[packages/dsh-task-board/README.md:36-37](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-task-board/README.md#L36-L37)

作者说明回填语义。

```text
- **Subtasks and parent-card dispatch**: a task can be given subtasks, either by creating one from its detail view (the form starts from the parent's workspace, preset, permission, and model, and each stays overridable) or by linking an existing task that has no parent yet; a subtask can be detached again once it is not running. The lineage gate lives in the Host: the parent must exist and be on board, a task can never be attached under one of its own descendants, and a tree may not exceed the configured `maxSubtaskDepth` (1 by default, 3 maximum). Running a card opens one session for that card and none for its subtasks, and running a subtask directly is the same operation: that card is the root of the run even when it carries a parent and subtasks of its own, and nothing under it is expanded. A subtask already in the done column is outside the run's dispatch set, so finishing subtasks one by one and then running the parent costs one session instead of a repeat of the tree; move it back to the todo column to have it dispatched again. The board marks parent and subtask cards, the detail view lists the direct subtasks and says what one run will do, and the header offers a one-click hide-subtasks filter.
- **Parent-card dispatch and subtask accounting**: clicking a card that carries unfinished subtasks opens that card's own session and nothing else. The run is forced under the `liangshen` dispatcher preset shipped by `packages/dsh-liangshen`, the card's stored agent preset is never rewritten, and session reuse is skipped so the run mints a fresh session; a deployment that registers no `liangshen` preset fails the run closed, with that missing preset as the reason on the card, and so does a deployment running the legacy Agent Teams runtime, where that preset cannot orchestrate and would stop to await a reply an unattended run never gets: the run is refused before any session exists, and the card carries the reason naming the exit. The prompt names every unfinished subtask with its title, task id, and status, states that no session is opened for them, and asks the session to read each card with `task_board_get`, dispatch it with `subagent` in dependency order (independent ones may run together), and write each conclusion back with `task_board_manage({action:'record-external-outcome'})` before it finishes. A conclusion the session never wrote back is supplied by the Host when the card's own run ends: every still-unrecorded unfinished subtask inherits that verdict as an external record whose initiator reads `parent-run:<card id>` and whose reason says the card ran no session of its own and inherited the parent run's conclusion. The backfill is idempotent, and a cancelled parent writes nothing. A card with no unfinished subtask is unaffected.
```

#### 缺口

- 现有 UI 的继承信息是否易于识别未实测
  **影响**：无法推断额外提示的收益
  **进一步探讨**：分别对现有详情与突出来源版本做盲评

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
