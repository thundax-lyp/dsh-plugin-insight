# dsh-plugin-notes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[acb136c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)
<!-- END META -->

> **实现功能**：把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。

> **核心亮点**：将便签编辑、任务 AI 执行和日程以及远端备份整合为 DSH 用户工作流。详见[Q01](#research-q01)。

> **风险与缺陷**：删除后远端快照不更新是明确的判定缺口；恢复和任务派发有部分副作用，需故障验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人记录、待办和可派发 Agent 任务的统一面板；需要明确自动执行与备份恢复成本。详见[Q01](#research-q01)。

一般便签板与任务管理可分别完成记录和计划；本插件的区别是同一便签直接派发 Agent 会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 便签 | 记录 | UI 未测 |
| 任务 | AI 派发 | 失败残留会话 |
| 备份 | 远端快照 | 删除可漏备 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH storageDomain | 必需 | 持久便签 | 插件不可用 |
| 任务 runtime | 执行时必需 | 新会话 | 只能记便签 |
| WebDAV | 备份时必需 | 远端快照 | 无远端备份 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 记录 | 便签编辑 | 核自动保存 |
| 任务 | 设工作区/执行 | 核新会话/租约 |
| 备份 | WebDAV 手动/自动 | 核快照 |
| 恢复 | 先安全备份再覆盖 | 隔离环境验 |

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

> **思考**：删除后远端快照不更新是明确的判定缺口；恢复和任务派发有部分副作用，需故障验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将便签编辑、任务 AI 执行和日程以及远端备份整合为 DSH 用户工作流。详见[Q01](#research-q01)。

将便签编辑、任务 AI 执行和日程以及远端备份整合为 DSH 用户工作流。详见[Q01](#research-q01)。

租约限定 Agent 任务工具会话、独立 userQuestions 同意；WebDAV 删除水位与恢复事务、会话失败清理需改进。详见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

删除后远端快照不更新是明确的判定缺口；恢复和任务派发有部分副作用，需故障验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核功能与批准守卫；删除不会推动 maxUpdatedAt 水位，自动备份可遗漏删除；派发失败可能留空会话，恢复非事务。目标宿主未测。

- 已检查：作者 README、包清单、源码路径 packages/plugin-notes/README.md、packages/plugin-notes/src/service.ts、packages/plugin-notes/src/agent/tools.ts、packages/plugin-notes/src/scheduler.ts、packages/plugin-notes/src/schedule.ts、packages/plugin-notes/src/webdav-core.ts、packages/plugin-notes/src/webdav-backup.ts、packages/plugin-notes/src/domain.ts 及固定范围 inventory；组件：packages/plugin-notes。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 packages/plugin-notes 范围 README、service、agent/tools、scheduler、schedule、webdav；未执行目标 DSH 或 WebDAV。旧 META 复用。
- 下一步：目标 DSH 验用户提问、租约撤销、模型选择失败、删除后自动备份、恢复中断与超时任务。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.4.3（[固定提交 acb136c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

改进可用持久变更序号/墓碑判备份、事务恢复、派发失败清理会话。详见[Q03](#research-q03)和[Q05](#research-q05)。

目标 DSH 验用户提问、租约撤销、模型选择失败、删除后自动备份、恢复中断与超时任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 97 | — | — | 1847 |
| .mjs | source | 2 | 101 | 67 | 23 | — |
| .ts | source | 48 | 7623 | 5660 | 1343 | — |
| .tsx | source | 31 | 5650 | 4905 | 554 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：便签到任务、Agent 写入和 WebDAV 备份在失败与删除情形下是否可靠？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 便签板从记录到 AI 任务覆盖哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者给四处入口、纸卡/列表/泳道、Markdown 与自动保存；便签转任务后必须选绝对工作区，用户可手动或按 once/interval/daily/weekly/monthly 日程派发到新会话。固定源码可见存储 domain、任务执行、调度与八个 agent 工具；界面体验只据作者 README/图片，未在 DSH 操作验证。此插件既是个人便签，也会触发新 Agent 会话，采用前须按任务执行权限评估。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:19-44](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/README.md#L19-L44)

作者入口与功能

<details>
<summary>查看原文（26行）</summary>

```text
## 入口

便签板本体在**中间列**（侧栏那个字形就是它的开关），也能开在**右侧栏**（导引页那张卡片）。以下入口都能在 **dsh 设置 → 便签 → 入口** 里单独开关，默认全开：

| 入口 | 在哪 |
|---|---|
| 侧栏顶部入口 | 侧栏顶部那一整行，点行打开便签板，点 (＋) 只开快捷新建；关掉即整行消失 |
| 输入栏入口 | 输入框左下角那一个字形，点开是三行菜单：新增便签 \| 便签板 \| 任务泳道（待办数挂在「任务泳道」那一行，点它开板并直接落到泳道页签） |
| 存成便签 | 每条助手回复下方的按钮，把该条回答**带进快捷新建浮层**（预填标题与正文） |
| 右侧栏导引卡片 | 右侧栏导引页里的便签卡片，点一下就在右侧栏以标签页打开便签板 |

「打开方式」决定便签板开在**中间列**还是**右侧栏**（宿主没装右侧栏时自动回退中间列）。四个入口至少会留一个：全关掉就没有打开便签板的地方了，设置页会锁住最后一个开着的入口。

## 能做什么

- **三种显示模式**：纸卡墙 / 行式列表 / 任务泳道，随时切换，选择会被记住。
- **六色纸卡 + 置顶**：配色与 Win11 便签一致，置顶优先；颜色可多选筛选。
- **搜索与归档**：标题 + 正文实时搜索；归档便签收进列表底部折叠区，可恢复 / 编辑 / 删除。
- **Markdown 正文**：格式工具栏（加粗 / 标题 / 列表 / 任务清单 / 引用 / 代码 / 链接 / 表格 / 撤销重做）；任务清单 `- [ ]` 在纸卡与列表上显示完成度徽标（如 `2/5`，全勾变 ✓）。
- **粘贴图片**：编辑器里 `Ctrl+V` 直接把剪贴板里的图片内联进正文。
- **便签变任务**：写入泳道状态即成为任务，五列看板（待规划 → 待办 → 进行中 → 已完成 → 已失败）拖拽换状态；普通便签不进泳道。编辑器底部是一块**折纸式可折叠面板**——合上只占一行摘要（状态 · 工作区 · 模型 · 预设），点「设置」才折出全部字段。
- **交给 AI 执行**：任务卡 hover「执行」→ 按该任务的工作区**新开一个会话**跑，便签板所在会话不被占用；完成后摘要回到卡片首行，全文进编辑器的「任务与结果」区（已完成/已失败的任务打开编辑器即展开）。跑太久可「重置为待办」。
- **执行目标可选**：任务折纸面板里能选**模型**与 **agent 预设**（留空 = 宿主默认），只影响该任务派发出来的新会话。
- **定时执行**：一次性 / 间隔 N 分钟 / 每天 / 每周（可多选星期）/ 每月；卡片显示「周期 · 下次时刻」，编辑器显示「下次 / 上次」。宿主停机期间错过的时点**超 2 小时不补跑**（循环型顺延到下一周期，一次性停用并写明原因），2 小时以内的补跑一次；上一轮未结束则本轮跳过。
- **自动保存**：编辑既有便签时停顿约 1 秒落盘，页脚有保存指示灯。
- **关闭前先问一句**：X /「取消」/ `Esc` / 点弹窗外，只要还有没保存的改动就弹「便签有改动」——保存并关闭（回车即选）、放弃改动、继续编辑三选一；没改动直接关。新建便签写一半就关也不会再丢。
```

</details>

**依据 2 · 作者声明**：[packages/plugin-notes/README.md:61-86](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/README.md#L61-L86)

工作区/备份/工具

<details>
<summary>查看原文（26行）</summary>

```text
## 工作区（执行目录）

任务便签必须带一个**工作区**（绝对路径），决定交给 AI 执行时在哪个目录跑：编辑器折纸面板里从下拉框选（候选 = 最近会话用过的目录，只选不手填）。**没有默认值也没有兜底**——没选工作区就存不成任务（摘要行变红、保存被挡下），泳道里没设工作区的任务卡显红字「未设工作区」且「执行」按钮禁用。

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/service.ts:424-470](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/service.ts#L424-L470)

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

**依据 4 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:63-110](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/scheduler.ts#L63-L110)

定时执行

<details>
<summary>查看原文（48行）</summary>

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
            if (!isNoteScheduleDue(note, now)) continue
            const schedule = note.schedule
            if (schedule === undefined) continue
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

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:424-470](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/service.ts#L424-L470)

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

**依据 2 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:201-222](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/agent/tools.ts#L201-L222)

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

**依据 3 · 作者声明**：[packages/plugin-notes/README.md:39-42](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/README.md#L39-L42)

作者任务功能

```text
- **便签变任务**：写入泳道状态即成为任务，五列看板（待规划 → 待办 → 进行中 → 已完成 → 已失败）拖拽换状态；普通便签不进泳道。编辑器底部是一块**折纸式可折叠面板**——合上只占一行摘要（状态 · 工作区 · 模型 · 预设），点「设置」才折出全部字段。
- **交给 AI 执行**：任务卡 hover「执行」→ 按该任务的工作区**新开一个会话**跑，便签板所在会话不被占用；完成后摘要回到卡片首行，全文进编辑器的「任务与结果」区（已完成/已失败的任务打开编辑器即展开）。跑太久可「重置为待办」。
- **执行目标可选**：任务折纸面板里能选**模型**与 **agent 预设**（留空 = 宿主默认），只影响该任务派发出来的新会话。
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

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:69-71](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/README.md#L69-L71)

作者仅变更时上传主张

```text
## 备份（WebDAV）

填服务器地址、远端目录、账号与**应用密码**（凭据只存本机设置，建议用服务商提供的应用密码而非主密码）。按**检查间隔**定时比对，**只在便签有变更时**上传快照，远端只留最近**保留份数**份。想立刻验证连通可以点「保存并立即备份」；恢复前会先自动备份当前状态，选中的那份**整体覆盖**现有便签。
```

**依据 2 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/webdav-core.ts#L87-L102)

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:233-245](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/webdav-backup.ts#L233-L245)

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

**依据 4 · 源码核查**：[packages/plugin-notes/src/service.ts:315-319](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/service.ts#L315-L319)

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

**依据 1 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:262-301](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/webdav-backup.ts#L262-L301)

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

**依据 2 · 源码核查**：[packages/plugin-notes/src/service.ts:546-551](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/service.ts#L546-L551)

非事务 replaceAll

```text
  /** 清空便签与租约两表后按 payload 逐条写入，只给 host 的 WebDAV 恢复流程用。 */
  async replaceAll(notes: readonly NoteRecord[]): Promise<void> {
    for (const [id] of this.table.entries()) await this.table.delete(id)
    for (const [leaseId] of this.leases.entries()) await this.leases.delete(leaseId)
    for (const note of notes) await this.table.put(note.id, note)
    this.broadcastChanged()
```

**依据 3 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:23-33](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/scheduler.ts#L23-L33)

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

**依据 4 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:73-106](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/scheduler.ts#L73-L106)

过期与派发

<details>
<summary>查看原文（34行）</summary>

```text
        for (const note of deps.list()) {
          try {
            // 超时兜底先跑：卡住的定时 run 由 host 收尾（否则这张便签会永久「进行中」）。
            if (isRunTimeout(note, now)) {
              await deps.settle(note.id, RUN_TIMEOUT_SUMMARY)
              continue
            }
            if (!isNoteScheduleDue(note, now)) continue
            const schedule = note.schedule
            if (schedule === undefined) continue
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

**依据 1 · 作者声明**：[packages/plugin-notes/README.md:73-86](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/README.md#L73-L86)

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

**依据 2 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:50-78](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/agent/tools.ts#L50-L78)

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:310-388](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/agent/tools.ts#L310-L388)

update/pin/delete 不同路径

<details>
<summary>查看原文（79行）</summary>

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

**依据 4 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:201-222](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/agent/tools.ts#L201-L222)

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

**依据 5 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/webdav-core.ts#L87-L102)

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

**依据 6 · 源码核查**：[packages/plugin-notes/src/service.ts:424-470](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-notes/src/service.ts#L424-L470)

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
