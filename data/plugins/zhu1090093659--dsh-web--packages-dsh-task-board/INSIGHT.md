# DSH Task Board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 10,442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 125,421](https://img.shields.io/static/v1?label=npm+30d&message=125%2C421&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)
<!-- END META -->

> **功能**：在 DSH Web 管理任务卡、真实会话、宿主定时与执行记录。

> **亮点**：[Q01](#research-q01) 将任务卡、宿主定时与实际会话记录接成一个可回查的工作流。[Q02](#research-q02) 权限回执和工作区选择是独立于卡片字段的执行前检查。

> **主要限制**：[Q03](#research-q03) 停机期间错过的计划会记跳过；子卡也可能只有父卡继承。验收必须回到真实会话或明确能支持其结论的原件。

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
  - [Q01 · 什么任务适合用定时看板而非手工发会话？](#detail-section-11)
  - [Q02 · 运行前如何固定工作区与权限？](#detail-section-12)
  - [Q03 · 何时是计划漏跑，何时只是继承父卡结论？](#detail-section-13)
  - [Q04 · 如何在鉴权边界内试用、停排期并退出？](#detail-section-14)
  - [Q05 · 怎样证明显式来源能降低从完成列误验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在同一 DSH 工作区反复做只读仓库检查、希望由同一张卡发起并回查会话的用户。

[Q01](#research-q01) 手工在日程、会话与任务记录间对齐也可完成任务。看板的增量是集中执行上下文与真实输出的回查入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 任务卡与执行 | 固定提示、工作区、权限并启动会话 | 失败必须检查真实回执 |
| 宿主排程 | 到时触发或记录错过 | 宿主不在线的时点会被跳过 |
| 子卡结算 | 从父卡统一传递结果 | 继承不含子卡独立会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.3 与 Web 插槽、会话服务 | 必需 | 注册面板并通过宿主运行 | 核对实际装载与注入 |
| 有效工作区、可用预设与权限 | 执行必需 | 锁定授权范围和模型上下文 | 运行器或账本会拒绝 |
| 持续运行的宿主 | 定时任务必需 | 保存计时及账本 | 错过或过迟可能被跳过 |
| 宿主连接认证或受控代理 | 远端使用按需 | 访问看板 | 查实际受理分支与凭据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选临时工作区和只读检查，约束执行权限 | 目标工作区、预设和权限可核对 |
| 运行 | 先手动一次，再设一次性近时触发 | 宿主记录实际开始与会话标识 |
| 验收 | 从运行打开会话，核对具体输出 | 继承记录或跳过需另查依据 |
| 退出 | 取消计划并移除试用挂载 | 确认没有开放执行，保留需要的结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 环境及模型费用未知 | 建卡、配置和测权限 | 固定宿主兼容待验 |
| 持续使用 | 模型与保持宿主运行的资源未测 | 查看输出、异常和确认 | 只比较核查合格的任务 |
| 失败恢复 | 重跑和等待费用未知 | 查看漏跑与权限回执，必要时手动执行 | 错过计划不会补跑 |
| 退出 | 落盘状态保留量未知 | 取消排程和处理开放会话 | 热卸载未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 调度 | 宿主设置计时并显式跳过漏跑 | 真机休眠与唤醒下的成功率 |
| 可追溯性 | 执行、独立会话和继承来源有数据区分 | 用户识别和复核耗时 |
| 权限 | 固定工作区、验证预设与实际命令回执 | 真实权限环境的行为 |

> **思考**：[Q03](#research-q03) 停机期间错过的计划会记跳过；子卡也可能只有父卡继承。验收必须回到真实会话或明确能支持其结论的原件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将任务卡、宿主定时与实际会话记录接成一个可回查的工作流。[Q02](#research-q02) 权限回执和工作区选择是独立于卡片字段的执行前检查。

[Q02](#research-q02) 放行前验证工作区、预设和权限回执。[Q03](#research-q03) 调度跳过、会话结算和父卡结论分别记账，允许针对不同失败回查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 停机期间错过的计划会记跳过；子卡也可能只有父卡继承。验收必须回到真实会话或明确能支持其结论的原件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用临时工作区试一张只读单次卡。检查权限、定时与实际会话输出，之后取消排期并确认无开放任务。若只有跳过或不能定位输出，恢复手动执行。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Host 调度、真实会话绑定和继承记录。宿主实机、代理、输出质量与采用收益仍待核查。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/README.md、packages/dsh-task-board/src/host-service.ts、packages/dsh-task-board/src/host-runner.ts、packages/dsh-task-board/src/host-ledger.ts、packages/dsh-task-board/package.json、packages/dsh-task-board/cordis.patch.yml、packages/dsh-task-board/src/index.ts、packages/dsh-task-board/src/host-routes.ts、packages/dsh-task-board/src/client/index.ts、packages/dsh-task-board/src/client/telemetry.ts 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查 DSH Web、宿主连接桥、运行器和定时账本、子卡结算。未运行真实代理、宿主、扩展、模型或发布包。
- 下一步：[Q05](#research-q05) 按准点、宿主不在线和父卡继承三种情况记录实际证据，再检查同任务的回查时间。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 若直接展示卡状态来自独立会话、父卡判断或调度跳过，用户可能更少误把列状态当已运行。该设计须对照用户回查成效。

[Q05](#research-q05) 按准点、宿主不在线和父卡继承三种情况记录实际证据，再检查同任务的回查时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 501 | — | — | 27136 |
| .ts | source | 72 | 19690 | 11801 | 6777 | — |
| .tsx | source | 23 | 6927 | 5326 | 1337 | — |
| .ts | test | 80 | 21692 | 15752 | 3686 | — |
| .tsx | test | 31 | 7928 | 5672 | 1309 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 152](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=152&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何使用看板完成一次可回溯的只读宿主任务，并区分计划、真实执行和继承状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务适合用定时看板而非手工发会话？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面对会重复发生的只读仓库检查，开发者可以事先把工作区、提示和时间纳入一张卡，到时从记录打开对应会话核对输出。替代是在人手表中记时间、手动打开会话，或用官方自动化的定时提醒，同时另维护一份任务状态。作者将自动化页和任务看板视为各有用途；本插件实质增量是将卡、宿主触发和执行记录连接起来。宿主的调度不依赖浏览器页面保存计时器，仍依赖宿主进程和实际工作区。若任务需要离线后必补跑或仅根据完成列收货，则与本次查到的机制不合。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:18-29](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/README.md#L18-L29)

作者说明看板与官方自动化的边界。

<details>
<summary>查看原文（12行）</summary>

```text
A hot-pluggable DeepSeek Harness (DSH) Web GUI and official desktop client task automation plugin with a Host-authoritative task ledger, real DSH agent session execution, cron background scheduling, cross-platform idle-sleep protection, and parent-card subtask dispatch. It executes unattended background workflows including automated code reviews, routine health checks, and scheduled pipelines without requiring an open browser window. It mounts cleanly via `cordis.patch.yml` and profiles without modifying DSH core code.

- Host-authoritative architecture and offline background execution: The browser is merely an asynchronous view; closing tabs or dropping connections will not interrupt Host scheduling, session execution, or atomic ledger settlement. Built-in cross-platform sleep inhibition (macOS, Windows, Linux) allows screens to power down while preventing system idle sleep for reliable unattended automation.
- Parent-card dispatch over subtask trees: a task can carry subtasks, one to three levels deep as the deployment allows. Running a card opens one session, that card's own: the Host opens nothing for its subtasks, and that session reads them with `task_board_get`, dispatches them with `subagent` in dependency order, and writes their conclusions back with `task_board_manage` before it finishes. A card whose subtasks are still unfinished runs under the liangshen dispatcher preset.
- Automated GitHub loop, freeze handover, and agent tool surface: Real-time bidirectional GitHub Issues sync automates agent bug fixing and PR creation; supports `<<<FREEZE` session context snapshots with handover packages; exposes 8 native model tools for autonomous planning and external execution registration.

## Features

Cards keep multi-line title and description previews with visible metadata. Previews strip Markdown formatting; task details render description and prompt as safe Markdown without raw HTML or automatic remote images, and content taller than about eight rendered lines is clamped to a fixed height with a fade hint and a "Show more" toggle that expands and collapses it, while shorter content renders untouched with no toggle. Stored task text is unchanged. A bracketed title prefix such as `[Bug]:` renders as a type badge, and the description preview skips issue-form boilerplate (checkbox lists, section headings, empty-field placeholders), preferring a summary section when one exists. A left stripe shows the latest run (running, succeeded, failed, cancelled); a card whose column disagrees with that run is labelled as set by hand. Each column shows the time its cards differ by — created in Backlog/To Do, started while running, settled in Done/Failed — read in the Host time zone. The latest execution session opens straight from the card. Every column header toggles compact single-line cards (Done starts compact, the choice is stored in the browser). All five columns and the archive first group cards by provider source — full `owner/repository` labels for GitHub — with unclaimed cards in Local tasks; source groups sort by label and their fold choices persist per browser. Done source groups start collapsed while the other columns and the archive start expanded, and search always reveals matching groups. Done, Failed and the archive nest Today / Last 7 days / Earlier within each source group and fold the oldest group once that source holds more than 30 cards, unless a search is active.

- **Task board UI**: the board is the shell's own center-column panel — like the desktop application's Plugins page, it contributes a row to the shell's official sidebar panel list and a page to the layout's center-column seat, so row geometry, the active highlight, the collapsed rail, the label, and language switching are the shell's to own; the board provides five kanban columns, search, task details, archive/restore, execution history, and links to execution transcripts. Every column is reachable by hand, by dragging a card or from the detail view's move menu: the move writes the column and no execution record, so Done or Failed declares work that finished (or failed) outside a tracked run and Running parks work that is under way without a session, while a card the runner is actually executing refuses every move until it settles. Archived tasks are read-only except for restore, delete, and transcript viewing, and cannot run manually or on schedule until restored.
- **Two complementary automation entries**: the shell's official *Automation tasks* page manages reminders and timed prompts in the Host Schedule service, while *Task board* manages cards, subtasks, real Session execution, cron, and execution history. Both entries stay available so the user can choose the task shape; the board neither hides nor takes over the official page.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1043-1095](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-service.ts#L1043-L1095)

宿主原生计时选择并提交到执行层。

<details>
<summary>查看原文（53行）</summary>

```text
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
          timeZone: schedule.timeZone,
          mode: schedule.mode,
          ...(schedule.cron === undefined ? {} : { cron: schedule.cron }),
        },
      )
    }
    this.emitStatusChanges(before)
    // The launched run (or the rolled-forward target) moved every due schedule,
    // so the next nearest target has to be recomputed from the ledger.
    this.armSchedule()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:566-585](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-runner.ts#L566-L585)

实际会话建立和提示。

<details>
<summary>查看原文（20行）</summary>

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
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
```

</details>

#### 缺口

- 尚无同样任务下的人工耗时与用户频率。
  **影响**：无法量化净收益。
  **进一步探讨**：以一次例行检查对比手动与自动配置工作量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 运行前如何固定工作区与权限？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

所选工作区由 handover 优先，其次卡绑定，再用最近工作区。注册表中不存在或最终无法选择时分别返回错误，避免落到宿主进程目录。指定预设会重新查询，不存在、标损坏或强制子任务调度条件无法满足时失败。新会话用打开时的工作区、预设建立，再命名并施加执行参数。对于显式权限，命令分发必须回成功才继续；缺分发器或回执失败直接退出。提示前也重新解析附件，缺文件或不可用不默默略过。账本里确认权限绑定与运行器实际派发权限指令分别承担确认和执行职责；运行被受理与完成输出也需要分开核对。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:501-529](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-runner.ts#L501-L529)

handover、workspace 与预设验证。

<details>
<summary>查看原文（29行）</summary>

```text
    // A handover bundle overrides the legacy pin fields: the bundle is the
    // authoritative execution triplet for a continuation card (issue #5). A
    // card that pins nothing is resolved to the deployment's most recently used
    // workspace instead of being left to `session.create`, whose own fallback is
    // the Host process working directory (the desktop app's profile directory) —
    // never the project the user was in when the card was written. A deployment
    // with no workspace to offer gets a refusal below, not that fallback.
    const workspaceId = task.handover?.workspaceId ?? task.workspaceId ?? this.recentWorkspaceId()
    const mode = options.agentPreset ?? task.handover?.mode ?? task.mode
    const permission = task.handover?.permission ?? task.permission

    if (workspaceId !== undefined && this.workspaceRegistry !== undefined) {
      if (!this.workspaceRegistry.list().some(item => item.id === workspaceId)) {
        throw new Error('workspace not found: ' + workspaceId)
      }
    }
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:566-585](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-runner.ts#L566-L585)

缺工作区拒绝，随后真正创建会话及提示。

<details>
<summary>查看原文（20行）</summary>

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
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:690-719](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-runner.ts#L690-L719)

权限回执和附件的执行前重核。

<details>
<summary>查看原文（30行）</summary>

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
    const requestedEffort = normalizeReasoningEffort(task.reasoningEffort)
    const pinned = HostExecutionRunner.pinnedRoute(task.model)
    // The card's attachments, resolved afresh for THIS execution: the
    // recorded metadata is never trusted on its own, and a file whose host
    // path is missing or unreadable fails the run instead of being silently
    // dropped.
    const attachments = task.attachments ?? []
    const carriesImages = attachments.some(attachment => attachment.kind === 'image')
    // The route the execution runs at: the card's own pin, or the session's
    // current selection. It is needed for the effort decision AND for the
    // image preflight, which must judge the route the run really uses — a
    // reused session is judged by its CURRENT route, not by the card's pin.
    const route = pinned ?? (requestedEffort === undefined && !carriesImages ? undefined : await this.sessionRoute(sessionId, catalog))
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1260-1278](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-ledger.ts#L1260-L1278)

有效权限绑定的确认检查。

<details>
<summary>查看原文（19行）</summary>

```text
        // A rework asks for a second attempt at work this card's own conversation
        // already holds; the ledger alone decides whether that conversation
        // exists, so the run can never be opened with instructions no session
        // ever saw.
        const rework = action.kind === 'rework' ? this.reworkInput(task, action.instructions) : undefined
        // The confirmation gate judges the RESOLVED binding: a subtask that
        // inherits an elevated permission from its parent is exactly as
        // unconfirmed as the parent would be without its own stamp.
        const refusal = this.bindingRefusal(task)
        if (refusal !== undefined) throw new Error(bindingRefusalMessage(refusal, this.sessionDefaultPermission, 'run'))
        runs = this.startRun(task, now, initiator, action.kind !== 'run', undefined, rework)
        break
      }
      default: {
        // Defence in depth. Every kind above is reachable only through
        // TaskBoardHostService.apply(), which validates the kind first; this
        // default exists so a future call path that reaches the ledger directly
        // fails loudly instead of falling through to the commit below — which is
        // exactly what an unknown kind did while the switch had no default:
```

</details>

#### 缺口

- 没有真实宿主的权限或附件反例。
  **影响**：仍需确认目标版本能落对工作区与权限。
  **进一步探讨**：在隔离仓库用有效、消失和未确认绑定跑最小任务。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时是计划漏跑，何时只是继承父卡结论？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 启动和长时间晚到走恢复路径，撤销旧计时并在账本记录错过的时间，再只为未来最近触发设置计时。正常准点触发才会按规则打开运行，单次和预算由账本控制。关闭浏览器只要宿主还活着仍有该计时；宿主停机与浏览器关闭是两个场景。父卡结束成功或失败时，账本会为同一组中未实际运行、没有开放执行且未被更新结果覆盖的后代补一条外部继承。它带 parent-run 来源和解释，sessionId 为空，取消则不继承。看板状态因此要与独立运行会话、主持判定或遗漏计划交叉阅读。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1027-1060](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-service.ts#L1027-L1060)

启动恢复跳过错过计划，计时器重设。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1063-1095](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-service.ts#L1063-L1095)

触发落后时回到恢复分支。

<details>
<summary>查看原文（33行）</summary>

```text
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
          timeZone: schedule.timeZone,
          mode: schedule.mode,
          ...(schedule.cron === undefined ? {} : { cron: schedule.cron }),
        },
      )
    }
    this.emitStatusChanges(before)
    // The launched run (or the rolled-forward target) moved every due schedule,
    // so the next nearest target has to be recomputed from the ledger.
    this.armSchedule()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:979-998](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-service.ts#L979-L998)

结算实际调用账本并发送变化。

<details>
<summary>查看原文（20行）</summary>

```text
  private settleAndNotify(taskId: string, executionId: string, outcome: ExecutionOutcome, error?: string, summary?: ExecutionSummary): void {
    const before = this.ledger.getTask(taskId)
    if (before?.executions.find(entry => entry.id === executionId)?.endedAt !== undefined) {
      // Already settled: the ledger would no-op, and re-emitting would report
      // the same settlement twice.
      this.ledger.settle(taskId, executionId, outcome, error, summary)
      return
    }
    // One settlement can move more than the settled card: a run whose own card
    // is terminal also writes the inherited verdict onto the subtasks it never
    // dispatched. Compare the whole board so the provider events cover those too.
    const statuses = this.statusMap()
    this.ledger.settle(taskId, executionId, outcome, error, summary)
    this.emitStatusChanges(statuses)
    this.extensions.emitExecutionSettled({
      taskId,
      executionId,
      outcome,
      ...(error === undefined ? {} : { error }),
    })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:983-1023](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-ledger.ts#L983-L1023)

继承过滤、来源和无独立会话的记录。

<details>
<summary>查看原文（41行）</summary>

```text
  private inheritVerdictForDescendants(taskId: string, executionId: string, groupId: string, now: number): boolean {
    const root = this.document.tasks.find(item => item.id === taskId)
    if (root === undefined) return false
    const execution = root.executions.find(entry => entry.id === executionId)
    if (execution?.endedAt === undefined || execution.result === undefined) return false
    if (execution.result !== 'succeeded' && execution.result !== 'failed') return false
    const verdict: ExecutionOutcome = execution.result
    // Only the card this run opened settles a tree it did not run itself: a
    // member of a historical multi-member group must not hand its own verdict
    // down to its siblings.
    if (ancestorChain(this.document.tasks, root).some(ancestor =>
      ancestor.executions.some(entry => entry.runGroupId === groupId))) return false
    const descendants = new Set(lineageOutstandingDescendants(this.document.tasks, root.id, this.maxSubtaskDepth).map(task => task.id))
    if (descendants.size === 0) return false
    const note = `本次执行由父卡「${root.title}」统一判定，本卡未单独开会话执行；结论继承自父卡运行`
    let changed = false
    this.document.tasks = this.document.tasks.map(task => {
      if (!descendants.has(task.id)) return task
      if (task.executions.some(entry => entry.runGroupId === groupId)) return task
      if (task.executions.some(entry => entry.endedAt === undefined)) return task
      if (task.executions.some(entry => entry.endedAt !== undefined && entry.startedAt >= execution.startedAt)) return task
      changed = true
      const inherited: ExecutionRecord = {
        id: crypto.randomUUID(),
        sessionId: undefined,
        startedAt: now,
        endedAt: now,
        result: verdict,
        error: note,
        initiatedBy: PARENT_RUN_INITIATOR_PREFIX + root.id,
        external: true,
        runGroupId: groupId,
      }
      return {
        ...task,
        status: settledStatus(task, verdict),
        updatedAt: now,
        executions: retainRecentExecutions([...task.executions, inherited]),
      }
    })
    return changed
```

</details>

#### 缺口

- 未重演进程停机和子卡实际任务。
  **影响**：继承卡结果可能不能当独立产物验收。
  **进一步探讨**：分别造准点、停机和未打开子卡样例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在鉴权边界内试用、停排期并退出？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

补丁加载宿主与 Web。清单声明 rc.3，下游需提供会话等服务。新版通过可选 scope 注入 connection 和 connection.authentication，路由认可明确的 peer；相容接口的 requestRejection 可通过。如果宿主不同意或抛错，路由继续检查同源标志、回环或所配置代理。转发回环要显式开启，另一代理路径检查准确 Host 和凭据；浏览器无某路径的信号仍可走适用的其他准入。客户端 apply 先尝试市场心跳，与设置和去重挂载过程分开。只在已有兼容 Web 且接受其网络行为的环境用临时工作区试一次无外部副作用的单次卡。核对会话和真实输出，再关排程并确认没有开放执行；卸载释放路由与工具，已有报告和落盘状态要单独看。首次配置、模型、维护、宿主唤醒与人工时长都没有实测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/package.json:9-42](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/package.json#L9-L42)

发布入口、补丁和 Web 依赖。

<details>
<summary>查看原文（34行）</summary>

```text
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
      "dsh": ">=0.2.2-rc.3"
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

**依据 2 · 源码核查**：[packages/dsh-task-board/cordis.patch.yml:10-12](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/cordis.patch.yml#L10-L12)

插入本包。

```text
- insert:
    - id: ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/index.ts:729-768](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/index.ts#L729-L768)

实际可选连接 scope、注册和释放。

<details>
<summary>查看原文（40行）</summary>

```text
  let admittedConnection: TaskBoardConnectionTrust | undefined
  const scopedInjectConnection = (ctx as { inject?: (names: readonly string[], callback: (scoped: Context) => unknown) => unknown }).inject
  if (typeof scopedInjectConnection === 'function') {
    scopedInjectConnection.call(ctx, ['connection', 'connection.authentication'], (scoped: Context) => {
      scoped.effect(() => {
        admittedConnection = resolveConnectionTrust(scoped)
        return () => {
          admittedConnection = undefined
        }
      }, 'task-board: connection trust')
    })
  }

  ctx.effect(() => {
    const disposers: Array<() => void> = []
    try {
      const routes = makeTaskBoardRoutes(host, {
        ...resolveProxyAccess(config),
        connection: () => admittedConnection ?? resolveConnectionTrust(ctx),
      }, {
        attachments: () => resolveAttachmentStore(ctx),
        parseTask: async (request, signal) => {
          const llm = resolveLlmRuntime(ctx)
          if (llm === undefined) throw new TaskParseError('no-model', 'this deployment serves no llm service')
          return await parseTaskDraft(llm, request, signal)
        },
      })
      for (const route of routes) disposers.push(ctx.webServer.register(route))
    } catch (error) {
      // A failed mount must not leave the agent tools bound to a disposed
      // host: the effect cleanup never runs when this body throws.
      setToolsEnabled(false)
      for (const dispose of disposers) dispose()
      host.dispose()
      throw error
    }
    return () => {
      setToolsEnabled(false)
      for (const dispose of disposers) dispose()
      host.dispose()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:231-268](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-routes.ts#L231-L268)

真实认证和原有代理分支。

<details>
<summary>查看原文（38行）</summary>

```text
export function isTrustedTaskBoardRequest(req: IncomingMessage, access: ResolvedRouteAccess): boolean {
  const connection = access.connection?.()
  if (connection !== undefined) {
    // The Host connection service is a cross-cohort bridge: the npm 0.2.2-rc.3
    // shape answers `requestRejection`, the post-#8266 shape answers `admit`,
    // and `admit` reaches into `connection.authentication`, which throws when
    // the calling fiber does not inject it. A bridge that cannot answer is not
    // an admission decision: it must keep the fence below instead of escaping
    // as a handler error (the Host answers a throwing handler with a bare 400,
    // which the panel can only render as an unreadable response).
    try {
      if (typeof connection.admit === 'function') {
        const admission = connection.admit(req)
        if (admission.rejection === undefined && 'peer' in admission && admission.peer !== undefined) return true
      } else if (typeof connection.requestRejection === 'function' && connection.requestRejection(req) === undefined) {
        return true
      }
    } catch {
      // Fall through to the pre-existing loopback / proxy fence.
    }
  }
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

**依据 5 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:151-164](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/client/index.ts#L151-L164)

实际 heart beat 在重复装载检查之前。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-task-board' }])

  // A duplicated client injection (module factory executed twice in one page
  // lifetime) would otherwise mount a second sidebar entry and board view.
  // First application wins; later calls become no-ops (see apply-guard.ts).
  if (!claimTaskboardApply()) return

  // Release the claim when this fiber unloads (the loader supports plugin
  // unloads / hot-reloads), so a rebuilt bundle can claim again in the same
  // page instead of being silently dropped.
  ctx.effect(() => releaseTaskboardApply, 'task-board: apply claim')
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/client/telemetry.ts:119-150](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/client/telemetry.ts#L119-L150)

外部请求、存储与自动化跳过。

<details>
<summary>查看原文（32行）</summary>

```text
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:399-410](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/client/index.ts#L399-L410)

布局面板注册。

<details>
<summary>查看原文（12行）</summary>

```text
    // Native panel surfaces: one sidebar row and one center-column page, both
    // through the official slot seats the shell itself renders. The layout's
    // panel selection is reconciled back into the controller so the board's own
    // view state follows the user clicking another panel row.
    try {
      disposers.push(registerTaskBoardPanel(ctx, controller))
      const layoutFace = ctx.get('layout') as { panelInfo?: { subscribe(listener: () => void): () => void; getSnapshot(): { activePanelId: unknown } } } | undefined
      if (layoutFace?.panelInfo !== undefined) {
        const sync = (): void => {
          const active = layoutFace.panelInfo!.getSnapshot().activePanelId
          controller.syncPanelSelection(active === TASK_BOARD_PANEL_ID ? TASK_BOARD_PANEL_ID : null)
        }
```

</details>

#### 缺口

- 缺真实兼容性、代理、遥测及模型开销记录。
  **影响**：建议限于单次、可撤回的只读卡。
  **进一步探讨**：在隔离宿主同时观察会话、路由与网络再计划。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证明显式来源能降低从完成列误验收？

**研究主题**：新假设与验证

#### 完整回答

假设把实际运行证据、父卡继承及停机跳过并排呈现，用户对独立输出的核对率会提高。设置三张同名或相似标题的卡，一张真实执行、一张仅继承，一张因宿主停机跳过，代理与模型预算保持相同。两组使用现有状态和额外来源提示，要求为每张找到对应会话与产物，缺证据时标未知。记录将继承视为独立完成的误报、时间和遗漏。若误接收无改善或核查负担明显增加，不支持该设计。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:995-1023](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-ledger.ts#L995-L1023)

继承记录可被清楚识别。

<details>
<summary>查看原文（29行）</summary>

```text
    const descendants = new Set(lineageOutstandingDescendants(this.document.tasks, root.id, this.maxSubtaskDepth).map(task => task.id))
    if (descendants.size === 0) return false
    const note = `本次执行由父卡「${root.title}」统一判定，本卡未单独开会话执行；结论继承自父卡运行`
    let changed = false
    this.document.tasks = this.document.tasks.map(task => {
      if (!descendants.has(task.id)) return task
      if (task.executions.some(entry => entry.runGroupId === groupId)) return task
      if (task.executions.some(entry => entry.endedAt === undefined)) return task
      if (task.executions.some(entry => entry.endedAt !== undefined && entry.startedAt >= execution.startedAt)) return task
      changed = true
      const inherited: ExecutionRecord = {
        id: crypto.randomUUID(),
        sessionId: undefined,
        startedAt: now,
        endedAt: now,
        result: verdict,
        error: note,
        initiatedBy: PARENT_RUN_INITIATOR_PREFIX + root.id,
        external: true,
        runGroupId: groupId,
      }
      return {
        ...task,
        status: settledStatus(task, verdict),
        updatedAt: now,
        executions: retainRecentExecutions([...task.executions, inherited]),
      }
    })
    return changed
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1034-1040](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-task-board/src/host-service.ts#L1034-L1040)

跳过来自独立调度分支。

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

- 没有用户对照。
  **影响**：这是待验证的界面和验收假设。
  **进一步探讨**：用三类真实记录做盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
