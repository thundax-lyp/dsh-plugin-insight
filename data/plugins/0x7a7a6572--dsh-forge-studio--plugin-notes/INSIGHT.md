# dsh-plugin-notes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,783](https://img.shields.io/static/v1?label=npm+30d&message=1%2C783&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)
<!-- END META -->

> **功能**：提供纸卡、看板和日历便签，支持截止日期、AI任务派发、有效期日程和WebDAV备份。

> **亮点**：把个人记录、时间安排与 AI 新会话执行回写组合为一个工作流，并用租约限定任务结果写回；截止日历提高可见性，日程有效期限制后续派发。[Q01](#research-q01)、[Q06](#research-q06)

> **主要限制**：备份以存活便签的最大 updatedAt 判变，删除不一定触发远端新快照；派发与恢复存在多步骤部分副作用。dueAt 是展示属性，endAt 也不取消已运行会话。[Q02](#research-q02)、[Q03](#research-q03)、[Q06](#research-q06)

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
  - [Q01 · 便签板从记录到 AI 任务覆盖哪些步骤？](#detail-section-11)
  - [Q02 · 任务会话的授权与失败边界是什么？](#detail-section-12)
  - [Q03 · WebDAV 只在有变更时自动备份是否包括删除？](#detail-section-13)
  - [Q04 · 恢复与调度有哪些不可忽略的副作用？](#detail-section-14)
  - [Q05 · Agent 对手写便签的修改和定时任务应如何治理？](#detail-section-15)
  - [Q06 · 截止日期和日程有效期是否都能约束任务执行？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人记录、待办和可派发 Agent 任务的统一面板；需要明确自动执行与备份恢复成本。详见[Q01](#research-q01)。

Markdown 待办或普通便签加人工创建会话是直接替代。比较同一任务的交接次数、结果可追溯性、孤儿会话与恢复人工；日历视图本身不证明任务更准时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 纸卡/看板/日历 | 记录、分类和时间查看 | 截止显示不保证任务按时终止 |
| AI任务与租约 | 新会话执行及结果回写 | 必须有工作区，部分派发失败需清会话 |
| 定时与有效期 | 控未来派发 | 不取消已运行任务 |
| WebDAV快照 | 远端恢复 | 删除未必触发自动备份，恢复整体覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH storageDomain、设置和UI | 核心必需 | 便签/租约持久化与编辑 | 匹配接口后才可使用 |
| 会话派发和模型 | AI任务必需 | 独立工作区执行 | 无 dispatch 则拒任务 |
| 绝对工作区 | 任务必需 | 选择执行目录 | 缺失拒执行，不自动兜底 |
| WebDAV和应用密码 | 远端备份可选 | 快照上传和恢复 | 不配置则需自管本地备份 |
| userQuestions | 修改手写便签必需 | 明确同意 | 无通道拒绝相应工具写操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 记录 | 用户建测试便签，选视图和截止日 | 核保存和日期含义 |
| 派发 | 用户先选隔离工作区、模型和预设 | 新会话与租约对应，结果回写可核 |
| 日程 | 用户设置频率及 endAt | 核下一触发与到期停用，不将 dueAt 当截止执行 |
| 备份 | 用户配置应用密码并手动备份 | 删除后另手动备份并查看远端 |
| 恢复 | 用户确认整体覆盖并先留安全副本 | 失败核表和租约，避免盲目再派发 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 安装、建便签存储/工作区、配置 WebDAV 与审批边界 | DSH/远端存储资源；包价/订阅金额未知 | 选绝对工作区、权限/备份验证工时未知 | 不兼容需回退便签/配置 |
| 持续 | 自动保存、定时扫描、新 Agent 会话与 WebDAV 上传 | 模型 token/会话、存储/网络；金额和频次未知 | 监控租约、执行结果与删除后备份，工时未知 | 定时过期/模型失败率未知 |
| 失败恢复 | 清孤儿会话、从安全快照恢复、核删除遗漏 | 额外会话/重试模型与快照存储，现金影响未知 | 查 session/lease、手动备份/恢复、重做任务，工时未知 | replaceAll 非事务、长任务状态不保停止 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 便签/任务 | 存储与派发 | UI 体验/完成率 |
| 自动日程 | 30秒扫描 | 长任务停止 |
| WebDAV | 快照与恢复 | 删除同步/故障原子性 |

> **思考**：备份以存活便签的最大 updatedAt 判变，删除不一定触发远端新快照；派发与恢复存在多步骤部分副作用。dueAt 是展示属性，endAt 也不取消已运行会话。[Q02](#research-q02)、[Q03](#research-q03)、[Q06](#research-q06)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把个人记录、时间安排与 AI 新会话执行回写组合为一个工作流，并用租约限定任务结果写回；截止日历提高可见性，日程有效期限制后续派发。[Q01](#research-q01)、[Q06](#research-q06)

租约限定 Agent 任务工具会话、独立 userQuestions 同意；WebDAV 删除水位与恢复事务、会话失败清理需改进。详见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

备份以存活便签的最大 updatedAt 判变，删除不一定触发远端新快照；派发与恢复存在多步骤部分副作用。dueAt 是展示属性，endAt 也不取消已运行会话。[Q02](#research-q02)、[Q03](#research-q03)、[Q06](#research-q06)

<a id="detail-section-6"></a>

### 1.5 使用建议

先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核功能与批准守卫；删除不会推动 maxUpdatedAt 水位，自动备份可遗漏删除；派发失败可能留空会话，恢复非事务。目标宿主未测。

- 已检查：作者 README、包清单、源码路径 packages/plugin-notes/README.md、packages/plugin-notes/src/service.ts、packages/plugin-notes/src/agent/tools.ts、packages/plugin-notes/src/scheduler.ts、packages/plugin-notes/src/schedule.ts、packages/plugin-notes/src/webdav-core.ts、packages/plugin-notes/src/webdav-backup.ts、packages/plugin-notes/src/domain.ts、packages/plugin-notes/src/client/views/notes-board/components/CalendarBoard.tsx 及固定范围 inventory；组件：packages/plugin-notes。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件入口、service、agent tools、scheduler/schedule、domain、WebDAV和日历视图接线；未运行目标代码、UI或WebDAV，不是全部客户端审计。
- 下一步：按 [Q05](#research-q05) 的删除、恢复半失败和派发失败样本核统一 revision/操作收据；另用 [Q06](#research-q06) 的 endAt 三边界样本检查预览、调度与已运行会话。假设未实现，未在宿主运行。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.5.0（[固定提交 be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

改进可用持久变更序号/墓碑判备份、事务恢复、派发失败清理会话。详见[Q03](#research-q03)和[Q05](#research-q05)。

按 [Q05](#research-q05) 的删除、恢复半失败和派发失败样本核统一 revision/操作收据；另用 [Q06](#research-q06) 的 endAt 三边界样本检查预览、调度与已运行会话。假设未实现，未在宿主运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 98 | — | — | 1904 |
| .mjs | source | 2 | 101 | 67 | 23 | — |
| .ts | source | 51 | 7964 | 5933 | 1377 | — |
| .tsx | source | 32 | 6015 | 5267 | 518 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：便签到任务、Agent 写入和 WebDAV 备份在失败与删除情形下是否可靠？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 便签板从记录到 AI 任务覆盖哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向同时记录个人事项和把明确任务交给 DSH 的用户。当前固定版提供纸卡墙、看板、日历三种视图，不再据旧文描述为列表。普通便签可搜索、归档、Markdown编辑；任务需选择绝对工作区，可选模型和 Agent 预设，派发到新会话并回写结果。截止日期在日历显示，定时触发另有日程。合格交付应为可复查便签或真实任务结果，而非仅卡片变成已完成。

主要增量是把记录、调度和执行回写接成同一工作流。简单替代是 Markdown 待办加手工开启会话；插件减少重复交接，但增加自动执行、备份和租约恢复责任。UI显示方式可由源码接线和作者说明核对，本轮没有操作宿主。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:32-44](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/README.md#L32-L44)

作者入口与功能

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

- **三种显示模式**：纸卡墙 / 看板 / 日历，随时切换，选择会被记住。
- **六色纸卡 + 置顶**：配色与 Win11 便签一致，置顶优先；颜色可多选筛选。
- **搜索与归档**：标题 + 正文实时搜索；归档便签收进纸卡墙底部折叠区，可恢复 / 编辑 / 删除。
- **截止日期与日历**：看板卡片上点「截止」即选日期，逾期标红；日历按月排格，截止（蓝点）与定时触发（绿点）分色，点事项进编辑器。
- **Markdown 正文**：格式工具栏（加粗 / 标题 / 列表 / 任务清单 / 引用 / 代码 / 链接 / 表格 / 撤销重做）；任务清单 `- [ ]` 在纸卡上显示完成度徽标（如 `2/5`，全勾变 ✓）。
- **粘贴图片**：编辑器里 `Ctrl+V` 直接把剪贴板里的图片内联进正文。
- **便签变任务**：写入泳道状态即成为任务，五列看板（待规划 → 待办 → 进行中 → 已完成 → 已失败）拖拽换状态；普通便签不进看板。编辑器底部只留一行任务摘要（状态 · 工作区 · 模型 · 预设），点「设置」会从纸条右侧**抽出一张附表**（固定主题表面、随明暗主题），点「收起」塞回纸后。
- **交给 AI 执行**：任务卡 hover「执行」→ 按该任务的工作区**新开一个会话**跑，便签板所在会话不被占用；完成后摘要回到卡片首行，全文进编辑器的「任务与结果」区（已完成/已失败的任务打开编辑器即展开）。跑太久可「重置为待办」。
- **执行目标可选**：右侧任务附表里能选**模型**与 **Agent 预设**（留空 = 宿主默认），只影响该任务派发出来的新会话。
- **定时执行**：一次性 / 间隔 N 分钟 / 每天 / 每周（可多选星期）/ 每月；卡片显示「周期 · 下次时刻」，编辑器显示「下次 / 上次」。宿主停机期间错过的时点**超 2 小时不补跑**（循环型顺延到下一周期，一次性停用并写明原因），2 小时以内的补跑一次；上一轮未结束则本轮跳过。
- **自动保存**：编辑既有便签时停顿约 1 秒落盘，页脚有保存指示灯。
```

</details>

**依据 2 · 作者声明**：[packages/plugin-notes/README.md:62-87](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/README.md#L62-L87)

工作区/备份/工具

<details>
<summary>查看原文（26行）</summary>

```text
## 工作区（执行目录）

任务便签必须带一个**工作区**（绝对路径），决定交给 AI 执行时在哪个目录跑：编辑器右侧任务附表里从下拉框选（候选 = 最近会话用过的目录，只选不手填）。**没有默认值也没有兜底**——没选工作区就存不成任务（摘要行变红、保存被挡下），泳道里没设工作区的任务卡显红字「未设工作区」且「执行」按钮禁用。

## 设置

设置界面是 **dsh 设置面板里的一级「便签」分区**，分三个 tab：**基础**（默认标题）、**入口**（打开方式 + 各入口开关）、**备份**（WebDAV）。

## 备份（WebDAV）

填服务器地址、远端目录、账号与**应用密码**（凭据只存本机设置，建议用服务商提供的应用密码而非主密码）。按**检查间隔**定时比对，**只在便签有变更时**上传快照，远端只留最近**保留份数**份。想立刻验证连通可以点「保存并立即备份」；恢复前会先自动备份当前状态，选中的那份**整体覆盖**现有便签。

## agent 工具

宿主装配了 `tools` 服务时注册 8 个工具（纯 UI 宿主不注册，照常使用）：

| 工具 | 用途 |
|---|---|
| `notes_list` / `notes_get` | 列摘要 / 读全文 |
| `notes_create` / `notes_update` / `notes_set_pinned` / `notes_delete` | 新建、修改、置顶、删除 |
| `notes_task_set_status` / `notes_task_report` | 任务置状态 / 收尾写结果 |

- 新建便签、置顶 / 归档**不问**——agent 新建的便签恒为它自己的。
- 改或删**你手写的便签**时，工具会向你发起一次「同意 / 拒绝」（与提问通道同一套，与权限模式无关），同意才落笔。
- 宿主没有审批通道时，agent 只能删它自己创建的便签。
- 任务工具只在「执行」授权的那次会话内可用；你手动改状态或取消任务即收回授权。
```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/service.ts:428-474](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L428-L474)

实际任务派发

<details>
<summary>查看原文（47行）</summary>

```text
  private async runTaskExecute(id: NoteId, by: 'user' | 'schedule'): Promise<TaskExecuteResult> {
    const current = this.table.get(id)
    if (!current) return { ok: false, reason: 'missing' }
    // 归档便签不得执行。
    if (current.archived || !current.lane || this.leases.get(id)) {
      return { ok: false, reason: 'busy' }
    }
    // 先于工作区解析判定：没有运行时就该报 no-dispatch。
    if (this.task === undefined) return { ok: false, reason: 'no-dispatch' }
    const workspace = (current.workspace ?? '').trim()
    if (workspace === '') return { ok: false, reason: 'missing-workspace' }
    const snapshot = current

    let sessionId: string
    try {
      sessionId = await this.task.createSession({
        workspace,
        ...(current.lane.agentPreset !== undefined ? { agentPreset: current.lane.agentPreset } : {}),
      })
    } catch {
      return { ok: false, reason: 'dispatch-failed' }
    }

    // 必须在投递前选好，第一个 turn 才用得上。
    if (current.lane.model !== undefined) {
      try {
        await this.task.selectModel({ sessionId, model: current.lane.model })
      } catch {
        return { ok: false, reason: 'dispatch-failed' }
      }
    }

    const granted = await this.grantTaskLease(id, sessionId, by)
    if (granted !== 'granted') {
      return { ok: false, reason: granted === 'missing' ? 'missing' : 'busy' }
    }

    try {
      await this.task.prompt({ noteId: id, title: current.title, sessionId, workspace })
    } catch {
      await this.rollbackTaskExecute(id, snapshot)
      return { ok: false, reason: 'dispatch-failed' }
    }

    const fresh = this.table.get(id)
    if (!fresh) return { ok: false, reason: 'missing' }
    return { ok: true, note: fresh }
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:65-117](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/scheduler.ts#L65-L117)

定时执行

<details>
<summary>查看原文（53行）</summary>

```text
/** 装配调度执行器（纯依赖注入，无定时器；定时器见 installNotesScheduler）。 */
export function createScheduleRunner(deps: ScheduleRunnerDeps): ScheduleRunner {
  /** 在途标记：tick 重入直接跳过（派发是异步的，30s 可能不够）。 */
  let running = false
  return {
    async run(now: number = Date.now()): Promise<readonly NoteId[]> {
      if (running) return []
      running = true
      const fired: NoteId[] = []
      try {
        for (const note of deps.list()) {
          try {
            // 超时兜底先跑：卡住的定时 run 由 host 收尾（否则这张便签会永久「进行中」）。
            if (isRunTimeout(note, now)) {
              await deps.settle(note.id, RUN_TIMEOUT_SUMMARY)
              continue
            }
            const schedule = note.schedule
            if (schedule === undefined) continue
            // 有效期到期：只对 enabled 生效（停用态不重写，避免每轮空写），直接停用收尾。
            if (schedule.enabled && isScheduleExpired(schedule, now)) {
              await deps.write(note.id, applyScheduleExpired(schedule))
              continue
            }
            if (!isNoteScheduleDue(note, now)) continue
            // 过期太久（宿主停机超过 2 小时）：不补跑，once 停用、循环型顺延。
            // 先于状态闸门——否则躺在「待规划」里的过期 once 日程永远不会被收掉。
            if (isScheduleOverdue(schedule, now)) {
              await deps.write(note.id, applyScheduleOverdue(schedule, now))
              continue
            }
            // 状态闸门（软）：待规划 / 已完成 / 已失败不自动派发——只顺延并记下原因，
            // 日程保持 enabled，用户把卡片拖回「待办」即自动恢复。
            const blocked = scheduleBlockReason(note)
            if (blocked !== undefined) {
              const skipped = applyScheduleSkip(schedule, blocked, now)
              if (skipped !== undefined) await deps.write(note.id, skipped)
              continue
            }
            const result = await deps.execute(note.id)
            if (result.ok) {
              await deps.write(note.id, applyScheduleDispatch(schedule, 'dispatched', now))
              fired.push(note.id)
              continue
            }
            // 便签已被删：无对象可写回，静默跳过。
            if (result.reason === 'missing') continue
            const outcome: ScheduleDispatchOutcome = result.reason
            await deps.write(note.id, applyScheduleDispatch(schedule, outcome, now))
          } catch (error) {
            // 单张便签出错（写回失败等）只丢该张：不让一张坏日程卡住整轮派发。
            deps.warn(`[plugin-notes] schedule tick failed for note ${note.id}:`, error)
          }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务会话的授权与失败边界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

runTaskExecute 拒归档、无 lane、已有租约、无工作区；创建新 session 后先选模型、再授予 lease、最后投递 prompt。notes_task_* 要求 exec.agent.id 等于租约 sessionId，手工改状态会撤销授权。若 createSession 成功但 selectModel 失败，代码直接返回 dispatch-failed，没有关闭新 session；若授租约失败也一样，可能留下空会话。prompt 失败则回滚便签 lane/lease，但新 session 仍存在。需把新会话副作用纳入恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:428-474](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L428-L474)

创建会话/模型/租约/投递顺序

<details>
<summary>查看原文（47行）</summary>

```text
  private async runTaskExecute(id: NoteId, by: 'user' | 'schedule'): Promise<TaskExecuteResult> {
    const current = this.table.get(id)
    if (!current) return { ok: false, reason: 'missing' }
    // 归档便签不得执行。
    if (current.archived || !current.lane || this.leases.get(id)) {
      return { ok: false, reason: 'busy' }
    }
    // 先于工作区解析判定：没有运行时就该报 no-dispatch。
    if (this.task === undefined) return { ok: false, reason: 'no-dispatch' }
    const workspace = (current.workspace ?? '').trim()
    if (workspace === '') return { ok: false, reason: 'missing-workspace' }
    const snapshot = current

    let sessionId: string
    try {
      sessionId = await this.task.createSession({
        workspace,
        ...(current.lane.agentPreset !== undefined ? { agentPreset: current.lane.agentPreset } : {}),
      })
    } catch {
      return { ok: false, reason: 'dispatch-failed' }
    }

    // 必须在投递前选好，第一个 turn 才用得上。
    if (current.lane.model !== undefined) {
      try {
        await this.task.selectModel({ sessionId, model: current.lane.model })
      } catch {
        return { ok: false, reason: 'dispatch-failed' }
      }
    }

    const granted = await this.grantTaskLease(id, sessionId, by)
    if (granted !== 'granted') {
      return { ok: false, reason: granted === 'missing' ? 'missing' : 'busy' }
    }

    try {
      await this.task.prompt({ noteId: id, title: current.title, sessionId, workspace })
    } catch {
      await this.rollbackTaskExecute(id, snapshot)
      return { ok: false, reason: 'dispatch-failed' }
    }

    const fresh = this.table.get(id)
    if (!fresh) return { ok: false, reason: 'missing' }
    return { ok: true, note: fresh }
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:203-224](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/agent/tools.ts#L203-L224)

任务工具按会话 lease

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 租约归属按 exec.agent.id 与会话比对（fail-closed：agent 缺省即拒）。
 * 便签不存在 / 无 lane / 无租约 / 会话不符都拒绝。
 */
export function notesTaskGuard(ctx: Context, exec: ToolExecution): string | undefined {
  if (!isNotesTaskTool(exec.name)) return undefined
  const args = exec.arguments as { note_id?: unknown } | undefined
  const id = args?.note_id
  if (typeof id !== 'string') return undefined
  const note = ctx.notes.list().find((n) => n.id === id)
  if (note === undefined) return `任务便签 ${id} 不存在`
  if (note.lane === undefined) return `便签 ${id} 不是任务（无 lane），notes_task_* 只能操作任务便签`
  const lease = ctx.notes.getTaskLease(id as NoteId)
  if (lease === undefined) {
    return `便签 ${id} 无有效执行租约：任务可能已被手动接管或已收尾，如需继续请重新执行`
  }
  const caller = exec.agent?.id
  if (caller !== lease.sessionId) {
    return `便签 ${id} 的执行租约属于会话 ${lease.sessionId}，与当前调用会话不符`
  }
  return undefined
}
```

</details>

**依据 3 · 作者声明**：[packages/plugin-notes/README.md:40-43](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/README.md#L40-L43)

作者任务功能

```text
- **便签变任务**：写入泳道状态即成为任务，五列看板（待规划 → 待办 → 进行中 → 已完成 → 已失败）拖拽换状态；普通便签不进看板。编辑器底部只留一行任务摘要（状态 · 工作区 · 模型 · 预设），点「设置」会从纸条右侧**抽出一张附表**（固定主题表面、随明暗主题），点「收起」塞回纸后。
- **交给 AI 执行**：任务卡 hover「执行」→ 按该任务的工作区**新开一个会话**跑，便签板所在会话不被占用；完成后摘要回到卡片首行，全文进编辑器的「任务与结果」区（已完成/已失败的任务打开编辑器即展开）。跑太久可「重置为待办」。
- **执行目标可选**：右侧任务附表里能选**模型**与 **Agent 预设**（留空 = 宿主默认），只影响该任务派发出来的新会话。
- **定时执行**：一次性 / 间隔 N 分钟 / 每天 / 每周（可多选星期）/ 每月；卡片显示「周期 · 下次时刻」，编辑器显示「下次 / 上次」。宿主停机期间错过的时点**超 2 小时不补跑**（循环型顺延到下一周期，一次性停用并写明原因），2 小时以内的补跑一次；上一轮未结束则本轮跳过。
```

#### 缺口

- 目标 host session 清理行为未知
  **影响**：失败后可能留下孤儿会话
  **进一步探讨**：模拟模型选择/授租约/prompt 失败检查会话

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · WebDAV 只在有变更时自动备份是否包括删除？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

自动检查用 maxUpdatedAt(当前存活便签) > watermark 判定。删除便签只是从表删去，不会更新剩余便签 updatedAt；若删的不是最新修改项，最大时间不变；删唯一便签时最大值归 0，也不会大于水位。因而删除操作可以一直不触发自动快照，远端保留已删除内容；README 的“只在便签有变更时上传”对删除不成立。手动 backupNow 会上传，恢复前也会先备份当前。需改用变更序号/删除墓碑或内容摘要。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:70-72](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/README.md#L70-L72)

作者仅变更时上传主张

```text
## 备份（WebDAV）

填服务器地址、远端目录、账号与**应用密码**（凭据只存本机设置，建议用服务商提供的应用密码而非主密码）。按**检查间隔**定时比对，**只在便签有变更时**上传快照，远端只留最近**保留份数**份。想立刻验证连通可以点「保存并立即备份」；恢复前会先自动备份当前状态，选中的那份**整体覆盖**现有便签。
```

**依据 2 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/webdav-core.ts#L87-L102)

只比较存活便签 maxUpdatedAt

<details>
<summary>查看原文（16行）</summary>

```text
/** 便签中最大的 updatedAt；无便签返回 0（用于 watermark 判断）。 */
export function maxUpdatedAt(notes: readonly NoteRecord[]): number {
  let max = 0
  for (const note of notes) {
    if (note.updatedAt > max) max = note.updatedAt
  }
  return max
}

/**
 * 是否需要上推：最新便签 updatedAt 高于已传水位才传（无便签或未变化跳过，
 * 省 WebDAV 流量）。watermark 为 null（从未传过）视作 0。
 */
export function shouldUpload(latest: number, watermark: number | null): boolean {
  return latest > (watermark ?? 0)
}
```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:233-245](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/webdav-backup.ts#L233-L245)

自动判定

<details>
<summary>查看原文（13行）</summary>

```text
  /** 定时自动检查：启用 + 到期（距上次成功 ≥ intervalMin）+ 确有变更才传。 */
  async function checkAutomatic(): Promise<void> {
    const webdav = await currentConfig()
    if (webdav === null || configError(webdav) !== null) return
    const meta = await metaGet()
    const now = Date.now()
    const due =
      meta.lastBackupAt === null ||
      now - meta.lastBackupAt >= Math.max(1, webdav.intervalMin) * 60_000
    if (!due) return
    const notes = options.listNotes()
    if (!shouldUpload(maxUpdatedAt(notes), meta.watermark)) return
    await backupNow()
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/service.ts:319-323](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L319-L323)

删除直接删表

```text
  async delete(id: NoteId): Promise<boolean> {
    await this.revokeTaskLease(id)
    const deleted = await this.table.delete(id)
    if (deleted) this.broadcastChanged()
    return deleted
```

#### 缺口

- 目标 WebDAV 定时路径未运行
  **影响**：删除后远端备份可过期
  **进一步探讨**：删除最后一条便签后等待检查并核远端

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 恢复与调度有哪些不可忽略的副作用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

恢复先解析目标、再上传当前安全副本、下载校验后 replaceAll；replaceAll 逐条删除所有旧便签及租约，再逐条写入，非事务式替换，若存储写入中断，局部状态可能残留，虽远端安全副本可再次恢复。调度每 30 秒扫描，过期超过 2 小时不补跑，定时 run 30 分钟未收尾按失败处理；这是失败状态记账，不保证底层 Agent 实际停止。运行前需知悉 WebDAV 凭据、恢复覆盖与长任务超时策略。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:262-301](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/webdav-backup.ts#L262-L301)

恢复前备份和整体覆盖

<details>
<summary>查看原文（40行）</summary>

```text
  /** 恢复：先自动备份当前 → 拉取校验 → 全量重建。target='latest' 取最新一份。 */
  async function restore(target: string): Promise<WebdavRestoreResult> {
    const webdav = await currentConfig()
    if (webdav === null) return { ok: false, reason: '无法读取 WebDAV 配置（settings 服务不可用）' }
    const invalid = configError(webdav)
    if (invalid !== null) return { ok: false, reason: invalid }
    try {
      // 先解析目标文件名，再做安全备份：'latest' 取的是「恢复动作发生前」的
      // 最近一份——若先备份再解析，latest 会指向刚生成的安全副本（=当前状态）。
      const files = await remoteSnapshotNames(webdav)
      if (files.length === 0) return { ok: false, reason: '远端没有可用快照' }
      const name = target === 'latest' ? files[0]! : files.find((f) => f === target)
      if (name === undefined) return { ok: false, reason: `找不到快照 ${target}` }

      // 保险：先把当前便签推一份，失败即中止（避免覆盖后无备份）。
      const safety = await backupNow()
      if (!safety.ok) return { ok: false, reason: `恢复前自动备份失败：${safety.reason}` }

      const dir = normalizeDir(webdav.path)
      const res = await dav(webdav, 'GET', dir + name)
      if (!res.ok) throw new Error(`下载快照失败（HTTP ${res.status}）`)
      const raw = JSON.parse(await res.text()) as unknown
      const payload = validateBackupPayload(raw)
      const restoredNotes = payload.notes
      await options.replaceAll(restoredNotes)

      const meta = await metaGet()
      await metaPut({
        ...meta,
        lastRestoreAt: Date.now(),
        lastRestoreName: name,
        lastRestoreOk: true,
        watermark: maxUpdatedAt(restoredNotes),
      })
      return { ok: true, restored: restoredNotes.length, from: name }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const meta = await metaGet()
      await metaPut({ ...meta, lastRestoreAt: Date.now(), lastRestoreName: null, lastRestoreOk: false })
      return { ok: false, reason: message }
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/service.ts:550-555](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L550-L555)

非事务 replaceAll

```text
  /** 清空便签与租约两表后按 payload 逐条写入，只给 host 的 WebDAV 恢复流程用。 */
  async replaceAll(notes: readonly NoteRecord[]): Promise<void> {
    for (const [id] of this.table.entries()) await this.table.delete(id)
    for (const [leaseId] of this.leases.entries()) await this.leases.delete(leaseId)
    for (const note of notes) await this.table.put(note.id, note)
    this.broadcastChanged()
```

**依据 3 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:25-35](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/scheduler.ts#L25-L35)

扫描/超时

<details>
<summary>查看原文（11行）</summary>

```text
export const SCHEDULE_TICK_MS = 30_000

/** 超时兜底写进 run.summary / 日程失败原因的中文说明。 */
export const RUN_TIMEOUT_SUMMARY = '超时未收尾'

/** 该便签的 run 是否已超时（只认定时发起的、尚未收尾的 run）。 */
export function isRunTimeout(note: NoteRecord, now: number): boolean {
  if (note.lane?.status !== 'running') return false
  const run = note.lane.run
  if (run === undefined || run.finishedAt !== undefined || run.by !== 'schedule') return false
  return now - run.startedAt >= SCHEDULE_RUN_TIMEOUT_MS
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:75-113](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/scheduler.ts#L75-L113)

过期与派发

<details>
<summary>查看原文（39行）</summary>

```text
        for (const note of deps.list()) {
          try {
            // 超时兜底先跑：卡住的定时 run 由 host 收尾（否则这张便签会永久「进行中」）。
            if (isRunTimeout(note, now)) {
              await deps.settle(note.id, RUN_TIMEOUT_SUMMARY)
              continue
            }
            const schedule = note.schedule
            if (schedule === undefined) continue
            // 有效期到期：只对 enabled 生效（停用态不重写，避免每轮空写），直接停用收尾。
            if (schedule.enabled && isScheduleExpired(schedule, now)) {
              await deps.write(note.id, applyScheduleExpired(schedule))
              continue
            }
            if (!isNoteScheduleDue(note, now)) continue
            // 过期太久（宿主停机超过 2 小时）：不补跑，once 停用、循环型顺延。
            // 先于状态闸门——否则躺在「待规划」里的过期 once 日程永远不会被收掉。
            if (isScheduleOverdue(schedule, now)) {
              await deps.write(note.id, applyScheduleOverdue(schedule, now))
              continue
            }
            // 状态闸门（软）：待规划 / 已完成 / 已失败不自动派发——只顺延并记下原因，
            // 日程保持 enabled，用户把卡片拖回「待办」即自动恢复。
            const blocked = scheduleBlockReason(note)
            if (blocked !== undefined) {
              const skipped = applyScheduleSkip(schedule, blocked, now)
              if (skipped !== undefined) await deps.write(note.id, skipped)
              continue
            }
            const result = await deps.execute(note.id)
            if (result.ok) {
              await deps.write(note.id, applyScheduleDispatch(schedule, 'dispatched', now))
              fired.push(note.id)
              continue
            }
            // 便签已被删：无对象可写回，静默跳过。
            if (result.reason === 'missing') continue
            const outcome: ScheduleDispatchOutcome = result.reason
            await deps.write(note.id, applyScheduleDispatch(schedule, outcome, now))
```

</details>

#### 缺口

- 宿主停止/写入原子性未测
  **影响**：恢复失败或超时可能产生状态不一致
  **进一步探讨**：隔离副本故障注入与长任务核查

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Agent 对手写便签的修改和定时任务应如何治理？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

notes_update/delete 对 origin=user 经 userQuestions 询问；无提问通道时删除拒绝。notes_set_pinned 单独直接调用 service，不询问，符合 README 对置顶不问的声明；归档可经 update 路径，手写便签仍询问。任务工具按租约限派发会话。适合个人知识/待办融合试用，先确认工作区和 WebDAV 备份，关键自动执行应设外部监控；改进方向是显式标识 side-effect 会话、删除也触发备份。未知任务成功率和成本不能凭静态源码量化。 假设的来源是自动备份只比较存活便签最大 updatedAt、删除可不推动水位，同时任务派发在 createSession 后多个后续失败分支可能留孤儿会话。相对固定版，给所有便签增/改/删统一持久递增 revision（含删除墓碑），备份以 revision/内容摘要判变更；任务派发把新会话 ID 与租约结果写 durable operation record，在模型选择/投递失败后作幂等清理或显式恢复。条件是 storageDomain 支持原子 revision/操作记录和宿主可安全关闭会话；代价是迁移、墓碑保留与故障恢复逻辑。最小对照用仅一条便签删除、删非最新便签、备份中断、replaceAll 中断、selectModel/prompt 失败，比较固定版与原型的远端快照一致性、孤儿会话数、重复执行数和恢复工时。若删除后远端仍留旧记录、派发失败仍无可追踪/可回收会话，或迁移破坏原便签，假设被证伪。现有源码没有此事务或统一 revision。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:74-87](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/README.md#L74-L87)

作者 agent 工具与批准边界

<details>
<summary>查看原文（14行）</summary>

```text
## agent 工具

宿主装配了 `tools` 服务时注册 8 个工具（纯 UI 宿主不注册，照常使用）：

| 工具 | 用途 |
|---|---|
| `notes_list` / `notes_get` | 列摘要 / 读全文 |
| `notes_create` / `notes_update` / `notes_set_pinned` / `notes_delete` | 新建、修改、置顶、删除 |
| `notes_task_set_status` / `notes_task_report` | 任务置状态 / 收尾写结果 |

- 新建便签、置顶 / 归档**不问**——agent 新建的便签恒为它自己的。
- 改或删**你手写的便签**时，工具会向你发起一次「同意 / 拒绝」（与提问通道同一套，与权限模式无关），同意才落笔。
- 宿主没有审批通道时，agent 只能删它自己创建的便签。
- 任务工具只在「执行」授权的那次会话内可用；你手动改状态或取消任务即收回授权。
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:50-78](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/agent/tools.ts#L50-L78)

提问授权

<details>
<summary>查看原文（29行）</summary>

```text
const CONSENT_DENY = '不要'

/**
 * 由工具自身走 user-questions 问一次同意，不经 approval seam，
 * 故与会话审批策略无关；没有该 seam 或未选中「允许一次」一律抛错。
 */
export async function requestNoteConsent(ctx: Context, exec: ToolExecution, action: string): Promise<void> {
  const questions = ctx.get('userQuestions')
  if (questions === undefined) {
    throw new Error(`cannot ${action}: this host has no way to ask you for consent`)
  }
  let answer: Awaited<ReturnType<typeof questions.ask>>
  try {
    answer = await questions.ask({
      questions: [{
        id: 'notes-consent',
        question: `The agent wants to ${action}. Allow?`,
        options: [{ label: CONSENT_ALLOW }, { label: CONSENT_DENY }],
      }],
      ...exec.agent !== undefined ? { agent: exec.agent } : {},
      ...exec.signal !== undefined ? { signal: exec.signal } : {},
    })
  } catch (error) {
    throw new Error(`cannot ${action}: the confirmation could not be shown`, { cause: error })
  }
  const selected = answer.answers.find(a => a.id === 'notes-consent')?.selected ?? []
  if (selected.includes(CONSENT_ALLOW)) return
  throw new Error(`cannot ${action}: not allowed`)
}
```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:314-394](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/agent/tools.ts#L314-L394)

update/pin/delete 不同路径

<details>
<summary>查看原文（81行）</summary>

```text

  ctx.tools.register(defineTool({
    name: TOOL_UPDATE,
    description: 'Update an existing sticky note (title / text / color / pinned / archived). Only fields provided are changed; origin can never be changed. Updating a note the user wrote themselves asks them for confirmation first.',
    parameters: {
      note_id: { type: 'string', required: true, description: 'The note id from notes_list.' },
      title: { type: 'string', description: 'New title.' },
      text: { type: 'string', description: 'New body.' },
      color: { type: 'string', enum: [...NOTE_COLORS], description: 'New color.' },
      pinned: { type: 'boolean', description: 'Pin or unpin.' },
      archived: { type: 'boolean', description: 'Archive or restore.' },
      dueAt: { type: 'number', description: 'Due date as epoch milliseconds (local midnight). Pass 0 to clear it.' },
    },
    output: {
      schema: NOTE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: noteText(value as NoteRecord) }],
    },
    async execute(args, exec) {
      const id = args.note_id as NoteId
      const target = noteById(ctx, id)
      if (target?.origin === 'user') await requestNoteConsent(ctx, exec, `update your note "${noteLabel(target)}"`)
      const note = await notes.update(id, {
        ...args.title !== undefined ? { title: args.title } : {},
        ...args.text !== undefined ? { text: args.text } : {},
        ...args.color !== undefined ? { color: args.color as NoteRecord['color'] } : {},
        ...args.pinned !== undefined ? { pinned: args.pinned } : {},
        ...args.archived !== undefined ? { archived: args.archived } : {},
        ...args.dueAt !== undefined ? { dueAt: args.dueAt > 0 ? args.dueAt : null } : {},
      })
      if (note === undefined) throw new Error(`note ${id} not found`)
      return note
    },
  }))

  ctx.tools.register(defineTool({
    name: TOOL_SET_PINNED,
    description: 'Pin or unpin one sticky note (equivalent to notes_update with only the pinned field).',
    parameters: {
      note_id: { type: 'string', required: true, description: 'The note id from notes_list.' },
      pinned: { type: 'boolean', required: true, description: 'true pins, false unpins.' },
    },
    output: {
      schema: NOTE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: noteText(value as NoteRecord) }],
    },
    async execute(args, _exec) {
      const id = args.note_id as NoteId
      const note = await notes.setPinned(id, args.pinned)
      if (note === undefined) throw new Error(`note ${id} not found`)
      return note
    },
  }))

  ctx.tools.register(defineTool({
    name: TOOL_DELETE,
    description: 'Delete one sticky note. Deleting a note the user wrote themselves asks them for confirmation first; without an approval channel only the agent\'s own notes can be deleted.',
    parameters: {
      note_id: { type: 'string', required: true, description: 'The note id from notes_list.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          deleted: { type: 'boolean', required: true },
          id: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.deleted ? `note ${value.id} deleted` : `note ${value.id} not found`,
      }],
    },
    async execute(args, exec) {
      const id = args.note_id as NoteId
      const target = noteById(ctx, id)
      if (target?.origin === 'user') await requestNoteConsent(ctx, exec, `delete your note "${noteLabel(target)}"`)
      const deleted = await notes.delete(id)
      return { deleted, id }
    },
  }))
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:203-224](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/agent/tools.ts#L203-L224)

任务租约守卫

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 租约归属按 exec.agent.id 与会话比对（fail-closed：agent 缺省即拒）。
 * 便签不存在 / 无 lane / 无租约 / 会话不符都拒绝。
 */
export function notesTaskGuard(ctx: Context, exec: ToolExecution): string | undefined {
  if (!isNotesTaskTool(exec.name)) return undefined
  const args = exec.arguments as { note_id?: unknown } | undefined
  const id = args?.note_id
  if (typeof id !== 'string') return undefined
  const note = ctx.notes.list().find((n) => n.id === id)
  if (note === undefined) return `任务便签 ${id} 不存在`
  if (note.lane === undefined) return `便签 ${id} 不是任务（无 lane），notes_task_* 只能操作任务便签`
  const lease = ctx.notes.getTaskLease(id as NoteId)
  if (lease === undefined) {
    return `便签 ${id} 无有效执行租约：任务可能已被手动接管或已收尾，如需继续请重新执行`
  }
  const caller = exec.agent?.id
  if (caller !== lease.sessionId) {
    return `便签 ${id} 的执行租约属于会话 ${lease.sessionId}，与当前调用会话不符`
  }
  return undefined
}
```

</details>

**依据 5 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/webdav-core.ts#L87-L102)

当前备份水位只看存活便签

<details>
<summary>查看原文（16行）</summary>

```text
/** 便签中最大的 updatedAt；无便签返回 0（用于 watermark 判断）。 */
export function maxUpdatedAt(notes: readonly NoteRecord[]): number {
  let max = 0
  for (const note of notes) {
    if (note.updatedAt > max) max = note.updatedAt
  }
  return max
}

/**
 * 是否需要上推：最新便签 updatedAt 高于已传水位才传（无便签或未变化跳过，
 * 省 WebDAV 流量）。watermark 为 null（从未传过）视作 0。
 */
export function shouldUpload(latest: number, watermark: number | null): boolean {
  return latest > (watermark ?? 0)
}
```

</details>

**依据 6 · 源码核查**：[packages/plugin-notes/src/service.ts:428-474](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L428-L474)

会话创建后模型/租约/投递失败分支

<details>
<summary>查看原文（47行）</summary>

```text
  private async runTaskExecute(id: NoteId, by: 'user' | 'schedule'): Promise<TaskExecuteResult> {
    const current = this.table.get(id)
    if (!current) return { ok: false, reason: 'missing' }
    // 归档便签不得执行。
    if (current.archived || !current.lane || this.leases.get(id)) {
      return { ok: false, reason: 'busy' }
    }
    // 先于工作区解析判定：没有运行时就该报 no-dispatch。
    if (this.task === undefined) return { ok: false, reason: 'no-dispatch' }
    const workspace = (current.workspace ?? '').trim()
    if (workspace === '') return { ok: false, reason: 'missing-workspace' }
    const snapshot = current

    let sessionId: string
    try {
      sessionId = await this.task.createSession({
        workspace,
        ...(current.lane.agentPreset !== undefined ? { agentPreset: current.lane.agentPreset } : {}),
      })
    } catch {
      return { ok: false, reason: 'dispatch-failed' }
    }

    // 必须在投递前选好，第一个 turn 才用得上。
    if (current.lane.model !== undefined) {
      try {
        await this.task.selectModel({ sessionId, model: current.lane.model })
      } catch {
        return { ok: false, reason: 'dispatch-failed' }
      }
    }

    const granted = await this.grantTaskLease(id, sessionId, by)
    if (granted !== 'granted') {
      return { ok: false, reason: granted === 'missing' ? 'missing' : 'busy' }
    }

    try {
      await this.task.prompt({ noteId: id, title: current.title, sessionId, workspace })
    } catch {
      await this.rollbackTaskExecute(id, snapshot)
      return { ok: false, reason: 'dispatch-failed' }
    }

    const fresh = this.table.get(id)
    if (!fresh) return { ok: false, reason: 'missing' }
    return { ok: true, note: fresh }
```

</details>

#### 缺口

- 真实提问/用户授权流程未测
  **影响**：agent 写入与定时执行需用户可追踪
  **进一步探讨**：目标宿主按来源和租约逐动作验证

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 截止日期和日程有效期是否都能约束任务执行？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不能混为同一种执行控制。dueAt 是便签可选截止时刻，service.create/update 持久化它，工具 notes_update 用 0 清除，日历把它与 schedule.nextAt 作为不同类型事项。调度器执行依赖 schedule，而非 dueAt；因此逾期标红不保证停止或拒绝派发。

endAt 则属于日程有效期。调度器先处理运行超时，再检查 enabled 且 now>=endAt 的日程，写 enabled:false 后跳过派发；previewNextAt 会隐藏 endAt 后的候选。这个设计约束未来调度，不会取消已经在跑的新会话，也不是任务完成截止保证。有限日程降低忘关循环的风险，但仍须按任务副作用另设监控。

源代码里 preview 用 next>endAt 而到期谓词用 now>=endAt，恰好在 endAt 的预览可能仍显示但实际 tick 已停用。应以边界时刻夹具核对产品含义，不从静态差异断言用户已遭故障。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:271-289](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/service.ts#L271-L289)

dueAt 与 lane/schedule 独立保存，不承担调度拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
      schedule = armed
    }
    if (lane === undefined) schedule = undefined
    const dueAt: number | undefined =
      patch.dueAt === undefined ? current.dueAt : (patch.dueAt ?? undefined)
    const { lane: _currentLane, schedule: _currentSchedule, workspace: _currentWorkspace, dueAt: _currentDueAt, ...currentWithoutLane } = current
    const next: NoteRecord = {
      ...currentWithoutLane,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.text !== undefined ? { text: patch.text } : {}),
      ...(patch.pinned !== undefined ? { pinned: patch.pinned } : {}),
      archived: patch.archived ?? current.archived ?? false,
      color: patch.color ?? current.color ?? DEFAULT_NOTE_COLOR,
      // origin 一经创建不可改写。
      origin: current.origin ?? 'user',
      updatedAt: now,
      ...(workspace !== undefined ? { workspace } : {}),
      ...(dueAt !== undefined ? { dueAt } : {}),
      ...(lane !== undefined ? { lane } : {}),
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:75-89](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/scheduler.ts#L75-L89)

运行超时先处理，到期只禁后续调度。

<details>
<summary>查看原文（15行）</summary>

```text
        for (const note of deps.list()) {
          try {
            // 超时兜底先跑：卡住的定时 run 由 host 收尾（否则这张便签会永久「进行中」）。
            if (isRunTimeout(note, now)) {
              await deps.settle(note.id, RUN_TIMEOUT_SUMMARY)
              continue
            }
            const schedule = note.schedule
            if (schedule === undefined) continue
            // 有效期到期：只对 enabled 生效（停用态不重写，避免每轮空写），直接停用收尾。
            if (schedule.enabled && isScheduleExpired(schedule, now)) {
              await deps.write(note.id, applyScheduleExpired(schedule))
              continue
            }
            if (!isNoteScheduleDue(note, now)) continue
```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/schedule.ts:237-245](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/schedule.ts#L237-L245)

预览候选严格大于 endAt 才隐藏。

```text
/** 已有权威 nextAt 就用它，否则按 now 试算；endAt 之后不会再触发。 */
export function previewNextAt(schedule: NoteScheduleInput, now: number = Date.now()): number | undefined {
  if (!schedule.enabled) return undefined
  const next =
    schedule.nextAt !== undefined && Number.isFinite(schedule.nextAt) && schedule.nextAt > 0
      ? schedule.nextAt
      : nextFireAt({ ...schedule, nextAt: 0 } as NoteSchedule, now)
  if (next === undefined) return undefined
  return schedule.endAt !== undefined && next > schedule.endAt ? undefined : next
```

**依据 4 · 源码核查**：[packages/plugin-notes/src/schedule.ts:330-337](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/schedule.ts#L330-L337)

实际到期判定含等号。

```text
export function isScheduleExpired(schedule: NoteSchedule, now: number): boolean {
  const endAt = schedule.endAt
  return endAt !== undefined && Number.isFinite(endAt) && endAt > 0 && now >= endAt
}

export function applyScheduleExpired(schedule: NoteSchedule): NoteSchedule {
  return { ...schedule, enabled: false, lastResult: '已到有效期，自动停用' }
}
```

**依据 5 · 源码核查**：[packages/plugin-notes/src/client/views/notes-board/components/CalendarBoard.tsx:1-12](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-notes/src/client/views/notes-board/components/CalendarBoard.tsx#L1-L12)

日历区分截止与触发，显示不等执行控制。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * 日历视图：月网格（周一起始）+ 选中日事项列表。
 * 事项两类：截止（蓝点，`dueAt`）与定时触发（绿点，`schedule.nextAt`）。
 * 点格子选日，点事项进编辑器；月份用 ‹ › 翻，右上「今天」回到当月当日。
 * 布局只有几何在 JSX，hover/选中态在 styles/notes-board.module.css。
 */

import type { NoteRecord } from '../../../../types.ts'
import { fmtMonthDay } from '../../../core/due-date.ts'
import { t } from '../../../core/theme-tokens.ts'
import { useCalendarBoard } from './useCalendarBoard.ts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
```

</details>

#### 缺口

- endAt 边界显示与实际派发是否符合用户理解没有场景测试。
  **影响**：可能误把日历截止或预览当执行保障。
  **进一步探讨**：对 endAt 前、相等、后的 tick 与预览作对照，分别观察已运行会话与后续派发。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
