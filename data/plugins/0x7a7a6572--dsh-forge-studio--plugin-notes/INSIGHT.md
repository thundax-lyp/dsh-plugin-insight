# DSH Forge Notes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,312](https://img.shields.io/static/v1?label=npm+30d&message=2%2C312&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)
<!-- END META -->

> **功能**：提供便签板和 Markdown 编辑，将便签派发为指定工作区的 AI 任务并支持日程与 WebDAV 备份。

> **亮点**：把记录、指定工作区派发、lease回写和时间视图接成工作流，降低重复交接有机制依据，结果与节时未测。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：派发失败可留新session；超时/到期不取消已跑Agent；WebDAV存活时间水位漏删除且不含附件，replaceAll非事务。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 谁把便签变任务，实际入口与原生基线？](#detail-section-11)
  - [Q02 · 派发、租约、用户修改和任务完成怎样接线？](#detail-section-12)
  - [Q03 · 日程/截止/超时能保证什么执行结果？](#detail-section-13)
  - [Q04 · WebDAV删除/附件/覆盖恢复有哪些边界？](#detail-section-14)
  - [Q05 · 成本、采用和下一步设计验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为在 DSH 整理个人事项和交接 AI 任务的用户，提供便签、工作区派发、结果回写与时间视图。见[Q01](#research-q01)。

普通Markdown待办/便签加手动开会话和记结果，模型执行继承DSH，不是新Agent引擎。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 便签/附件 | 记录、编辑与引用本地文件 | 资产在notes-assets，备份另管 |
| 任务派发 | 指定工作区新session及lease回写 | 会话失败不全撤，summary需验收 |
| 日程/截止 | 未来派发和时间展示 | dueAt非执行闸门，超时不保停止 |
| WebDAV | JSON快照与恢复前安全副本 | 漏删除水位、无附件、replaceAll非事务 |

**流程与依赖**

宿主存储/Web为底座，任务需会话/模型/工作区，WebDAV及assets备份按操作需要；表见[Q05](#research-q05)。

普通记录先回读，再隔离任务验产物，日程/备份逐项开启并核真实状态；步骤见[Q05](#research-q05)。

**效果与成本**

模型/会话/存储、授权/日程监控和多状态恢复成本未知；表见[Q05](#research-q05)。

减少交接有接线依据，summary/卡片/快照不等业务或完整恢复成功；效果见[Q05](#research-q05)。

> **思考**：派发失败可留新session；超时/到期不取消已跑Agent；WebDAV存活时间水位漏删除且不含附件，replaceAll非事务。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把记录、指定工作区派发、lease回写和时间视图接成工作流，降低重复交接有机制依据，结果与节时未测。见[Q01](#research-q01)、[Q02](#research-q02)。

服务就绪装配、身份lease与用户同意分开值得迁移；会话副作用、删除水位、附件外置和逐删恢复需要独立恢复设计。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

派发失败可留新session；超时/到期不取消已跑Agent；WebDAV存活时间水位漏删除且不含附件，replaceAll非事务。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人记录和隔离可幂等小任务可备份后有限试用，WebDAV另保assets；失败仍跑、重复、远端删除未更新或附件丢失时停自动链，先核会话/文件并从独立副本恢复。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持记录/派发/租约/日程与JSON备份；关键失败和附件边界已收窄。限个人记录及隔离小任务试用，未运行，事务/统一变更序号是假设。

- 已检查：作者 README、包清单、源码路径 packages/plugin-notes/package.json、packages/plugin-notes/README.md、packages/plugin-notes/cordis.patch.yml、packages/plugin-notes/src/index.ts、packages/plugin-notes/src/client/index.ts、packages/plugin-notes/src/service.ts、packages/plugin-notes/src/agent/tools.ts、packages/plugin-notes/src/agent/task-dispatch.ts、packages/plugin-notes/src/scheduler.ts、packages/plugin-notes/src/schedule.ts、packages/plugin-notes/src/webdav-backup.ts、packages/plugin-notes/src/webdav-core.ts、packages/plugin-notes/src/note-asset-store.ts、packages/plugin-notes/src/client/core/calendar-month.ts 及固定范围 inventory；组件：packages/plugin-notes。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧六题/全部findings/证据与自身依赖；本轮核Host/client入口、service/工具lease与派发、scheduler/schedule、WebDAV/core/资产存储和README附件边界。未全审所有UI/富文本/远端或执行目标。
- 下一步：后续临时工作区及非敏感WebDAV故障矩阵核session/lease/产物、日程边界、删除后远端与缺assets恢复；普通宿主验证另授权。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.6.0（[固定提交 9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是删除墓碑/持久revision判全部变更，以及session/lease操作记录恢复；故障矩阵比远端一致/孤儿/重复与人工，迁移破坏或负担更大即否定。见[Q05](#research-q05)。

后续临时工作区及非敏感WebDAV故障矩阵核session/lease/产物、日程边界、删除后远端与缺assets恢复；普通宿主验证另授权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 100 | — | — | 2051 |
| .mjs | source | 2 | 101 | 67 | 23 | — |
| .ts | source | 59 | 9025 | 6889 | 1380 | — |
| .tsx | source | 34 | 6197 | 5479 | 481 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：便签到AI任务/日程/备份的完成与失败恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁把便签变任务，实际入口与原生基线？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件是@zzerx/dsh-plugin-notes原生DSH插件，Host打开storageDomain提供NotesService，按可用服务挂工具、任务运行时和调度；client挂remote.notes再注册看板、侧栏/输入区入口和设置。它不是另一个Agent引擎，实际会话、模型选择和工具权限复用DSH。任务运行时/附件存储装配失败可降级，纸卡显示不代表执行和备份都可用。

目标是同时记个人事项、把清晰任务交给AI并想在同一记录看结果的人。基线是Markdown待办/普通便签，加手工开DSH会话、选工作区/模型、复制任务和记结果。增量是从便签泳道和日程直连新会话，租约回写结果，日历展示时间事项；不是仅新增一个文本框。

合格交付分为能回读的个人记录、可核对的实际任务结果和可恢复的数据副本。卡片变done只是工具报告的状态，定时dispatched是已投递，备份成功也不等于全部附件已保存。便签、截止日、周期执行与无人值守可靠性分别评估，不能由统一UI推出已完成业务自动化。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/package.json:1-5](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/package.json#L1-L5)

组件身份及作者描述。

```text
{
  "name": "@zzerx/dsh-plugin-notes",
  "version": "0.6.0",
  "description": "dsh 便签插件：纸卡墙便签板 + Markdown 编辑器，便签能变任务——拖进泳道、交给 AI 在指定工作区执行、按日程定时跑；支持 WebDAV 备份与 agent 工具读写。",
  "keywords": [
```

**依据 2 · 源码核查**：[packages/plugin-notes/src/index.ts:20-77](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/index.ts#L20-L77)

Host存储与可选运行时/附件降级、调度。

<details>
<summary>查看原文（58行）</summary>

```text
export const name = '@zzerx/dsh-plugin-notes'
export const inject = ['storageDomain']
/** settings 表单的命名空间就是本条目 id。 */
export { Config } from './settings.ts'

// ctx.inject 返回 fiber，不能从 async apply 里 return：cordis 会把 thenable 当 effect 收集并抛。
export async function apply(ctx: Context, config: Config): Promise<void> {
  const domain = await ctx.storageDomain.open(notesDomain)
  const metaDomain = await ctx.storageDomain.open(webdavMetaDomain)
  try {
    ctx.effect(() => () => { void domain.close() })
    ctx.effect(() => () => { void metaDomain.close() })
    // 闭包引用稍后构造的 NotesService：回调运行期才触发，避免循环构造。
    let notesService: NotesService | undefined
    const webdav = createWebdavEngine(ctx, {
      listNotes: () => notesService?.list() ?? [],
      replaceAll: async (notes) => {
        if (!notesService) throw new Error('notes 服务未就绪')
        await notesService.replaceAll(notes)
      },
      metaTable: metaDomain.table('meta'),
      // 每次现取：设置热更新不重挂插件。
      readConfig: () => webdavConfigOf(config),
    })
    // 任务执行运行时是可选增强：装配失败只降级，绝不拖垮 NotesService 注册。
    // 用 `new NotesService(ctx, …)` 而非 `ctx.plugin`：前者把 `notes` 服务 provide 在本 fiber 上，
    // 之后的子 fiber 才能沿祖先链读到 `ctx.notes`（`ctx.plugin` 挂到兄弟 fiber，祖先链读不到）。
    const assets = await createAssetStoreSafely(ctx)
    notesService = new NotesService(ctx, {
      domain,
      task: installTaskRuntimeSafely(ctx),
      webdav,
      ...(assets !== undefined ? { assets } : {}),
    })
    try {
      const migrated = await notesService.migrateInlineImages()
      if (migrated.migrated > 0) ctx.logger.info('[plugin-notes] migrated inline images:', migrated)
    } catch (error) {
      ctx.logger.warn('[plugin-notes] image migration failed:', error)
    }
    configureNotesSettingsPage(ctx)
    // 每 60s 判断「到期 + 确有变更」才上推；失败静默跳过。
    const timer = setInterval(() => {
      void webdav.checkAutomatic().catch((error) => {
        ctx.logger.warn('[plugin-notes] webdav automatic check failed:', error)
      })
    }, 60_000)
    ctx.effect(() => () => { clearInterval(timer) })
    // 每 30s 扫到期日程 → taskExecuteScheduled；装配失败只降级（定时不生效）。
    installNotesSchedulerSafely(ctx, notesService)
    installNotesAgentBridgeWhenReady(ctx)
  } catch (error) {
    void domain.close()
    void metaDomain.close()
    throw error
  }
}

```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/client/index.ts:43-70](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/client/index.ts#L43-L70)

真实client依赖与remote挂载。

<details>
<summary>查看原文（28行）</summary>

```text

export const name = '@zzerx/dsh-plugin-notes/client'
/** `layout` 必须声明：读服务（ctx.layout）在 cordis 里要求先 inject。 */
export const inject = ['slots', 'configForms', 'remote', 'typert', 'layout']

/** 入口排序位：排在多数官方条目之后。 */
const ORDER = 60

/** 右侧栏 tab 类型 id：同时是 body/title 座位的 key。 */
const NOTES_TAB_ID = '@zzerx/dsh-plugin-notes'

/** 右侧栏 tab 的 kind：与主面板 id 同字，但属另一套命名空间。 */
const NOTES_TAB_KIND = 'notes'

export function apply(ctx: Context): void {
  ctx.inject(['slots', 'configForms', 'remote', 'typert', 'layout'], async (ctx) => {
    await mountNotesRemote(ctx)
    // remote.notes 就绪后才能读：cordis 要求读服务先声明在 inject 里。
    ctx.inject(['remote.notes', 'remote', 'slots', 'configForms', 'layout'], (ctx) => {
      const notes = notesOf(ctx)
      // 命名空间 = host 侧 profile 条目 id；值来自 Config 的 volatile 字段。
      const scope = ctx.configForms.get<NotesConfig>(NOTES_NAMESPACE)

      const readEntry = (key: keyof NotesEntryConfig): boolean =>
        scope.getSnapshot().value?.entry?.[key] ?? DEFAULT_NOTES_ENTRY_CONFIG[key]

      /** 非法值由 notesOpenMode 回退成中间列。 */
      const readOpenMode = (): NoteOpenMode => notesOpenMode(scope.getSnapshot().value)
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/agent/task-dispatch.ts:88-123](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/task-dispatch.ts#L88-L123)

调用宿主create/model/prompt。

<details>
<summary>查看原文（36行）</summary>

```text
  }

  return {
    /** 优先 workspaceId（会话才归组）；本层不碰文件系统，路径由宿主解析。 */
    async createSession(input) {
      const workspaceId = await resolveWorkspaceId(input.workspace)
      const request: SessionCreateRequest = {
        ...(workspaceId !== undefined
          ? { workspaceId: workspaceId as NonNullable<SessionCreateRequest['workspaceId']> }
          : { cwd: input.workspace }),
        ...(input.agentPreset !== undefined ? { agentPreset: input.agentPreset } : {}),
      }
      const created = await controller().create(request)
      return String(created.sessionId)
    },
    /** 必须在 prompt 之前调用：模型对第一个 turn 生效。 */
    async selectModel(input) {
      const request: SessionSelectModelRequest = {
        sessionId: input.sessionId as SessionSelectModelRequest['sessionId'],
        provider: input.model.provider,
        model: input.model.model,
        ...(input.model.reasoningEffort !== undefined
          ? { reasoningEffort: input.model.reasoningEffort }
          : {}),
      }
      await controller().selectModel(request)
    },
    /** queue：不打断会话里正在跑的 turn。 */
    async prompt(input) {
      const request: SessionPromptRequest = {
        requestId: randomUUID() as SessionRequestId,
        sessionId: input.sessionId as SessionPromptRequest['sessionId'],
        mode: 'queue',
        content: [{ type: 'text', text: buildTaskDispatchMessage({ noteId: input.noteId, title: input.title }) }],
      }
      await controller().prompt(request, new AbortController().signal)
```

</details>

#### 缺口

- 从待办到合格任务的净交接时间、完成率和真实需求未对照
  **影响**：工作流增量有据但不能称可靠自动化或节时已实现
  **进一步探讨**：固定任务对比手工开会话与便签派发，核最终文件/报告及人工纠错时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 派发、租约、用户修改和任务完成怎样接线？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

runTaskExecute拒缺便签、归档/无lane/已有lease、无运行时或无工作区；随后createSession、可选selectModel、grantTaskLease、prompt，顺序保证首轮模型先选好。prompt通过宿主queue投递，返回ok意味着此流程调用成功，不是最终产物验收。

租约将noteId绑定新sessionId，notesTaskGuard要求exec.agent.id相同，否则拒notes_task_*；缺caller也不放行。手工接管taskReset撤lease并把卡片todo，report/settle补finishedAt、summary和ok、撤lease，循环任务落回todo供下轮。它限制便签任务回写身份，不是对该会话其它shell/网络/文件工具的独立沙箱，也不证明Agent自报ok符合用户验收。

失败链存在多步骤副作用。createSession成功后selectModel失败直接dispatch-failed；grant失败同样返回，均未关新session。prompt失败revoke lease并回写旧便签快照，但会话还在，若投递已部分发生也没有此处取消。方法注释称执行事务，实际不是会话+便签+租约的原子事务；异常后卡片恢复不等于新会话消失/没有真实动作。需要把新sessionId与真实运行状态一并核对，不能盲重新派发。

普通Agent更新/删除origin=user会调用userQuestions独立同意，无通道或没允许就拒；置顶工具独立直接setPinned不问，这是具体设计例外，不能概括所有写都二次授权。授权租约与用户同意解决不同对象的问题，不替代备份/外部结果确认。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:508-554](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L508-L554)

实际派发顺序与错误返回。

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

**依据 2 · 源码核查**：[packages/plugin-notes/src/agent/task-dispatch.ts:92-123](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/task-dispatch.ts#L92-L123)

宿主会话和queue调用，无close链。

<details>
<summary>查看原文（32行）</summary>

```text
    async createSession(input) {
      const workspaceId = await resolveWorkspaceId(input.workspace)
      const request: SessionCreateRequest = {
        ...(workspaceId !== undefined
          ? { workspaceId: workspaceId as NonNullable<SessionCreateRequest['workspaceId']> }
          : { cwd: input.workspace }),
        ...(input.agentPreset !== undefined ? { agentPreset: input.agentPreset } : {}),
      }
      const created = await controller().create(request)
      return String(created.sessionId)
    },
    /** 必须在 prompt 之前调用：模型对第一个 turn 生效。 */
    async selectModel(input) {
      const request: SessionSelectModelRequest = {
        sessionId: input.sessionId as SessionSelectModelRequest['sessionId'],
        provider: input.model.provider,
        model: input.model.model,
        ...(input.model.reasoningEffort !== undefined
          ? { reasoningEffort: input.model.reasoningEffort }
          : {}),
      }
      await controller().selectModel(request)
    },
    /** queue：不打断会话里正在跑的 turn。 */
    async prompt(input) {
      const request: SessionPromptRequest = {
        requestId: randomUUID() as SessionRequestId,
        sessionId: input.sessionId as SessionPromptRequest['sessionId'],
        mode: 'queue',
        content: [{ type: 'text', text: buildTaskDispatchMessage({ noteId: input.noteId, title: input.title }) }],
      }
      await controller().prompt(request, new AbortController().signal)
```

</details>

**依据 3 · 源码核查**：[packages/plugin-notes/src/service.ts:410-423](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L410-L423)

lease写入与lane running。

<details>
<summary>查看原文（14行）</summary>

```text
  async grantTaskLease(
    id: NoteId,
    sessionId: string,
    by: 'user' | 'schedule' = 'user',
  ): Promise<'granted' | 'missing' | 'busy'> {
    const note = this.table.get(id)
    if (!note) return 'missing'
    if (!note.lane || this.leases.get(id)) return 'busy'
    const now = Date.now()
    await this.leases.put(id, { noteId: id, sessionId, grantedAt: now })
    // run.by 供 host 超时兜底认领定时发起的那些。
    await this.table.put(id, { ...note, lane: beginRun(note.lane, now, by), updatedAt: now })
    this.broadcastChanged()
    return 'granted'
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:206-225](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/tools.ts#L206-L225)

caller按租约session校验。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/plugin-notes/src/service.ts:467-491](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L467-L491)

settle自报结果、循环todo。

<details>
<summary>查看原文（25行）</summary>

```text

  /**
   * agent 工具专用：settleRun 补 finishedAt/ok/summary，status 置 done/failed，撤销 lease。
   * 循环日程例外：状态落回 'todo'，等下一周期再派发。
   */
  async settleTaskRun(id: NoteId, ok: boolean, summary: string): Promise<NoteRecord | undefined> {
    const current = this.table.get(id)
    if (!current?.lane) return undefined
    const now = Date.now()
    const looping = current.schedule?.enabled === true && current.schedule.mode !== 'once'
    const status: TaskStatus = looping ? 'todo' : ok ? 'done' : 'failed'
    const lane: NoteLane = withRunHistory({ ...settleRun(current.lane, ok, summary, now), status })
    await this.revokeTaskLease(id)
    // 成败写回日程的失败连击：成功清零、失败累加，到上限自动停用。
    const schedule = current.schedule !== undefined ? applyRunResult(current.schedule, ok, now) : undefined
    const next: NoteRecord = {
      ...current,
      lane,
      ...(schedule !== undefined ? { schedule } : {}),
      updatedAt: now,
    }
    await this.table.put(id, next)
    this.broadcastChanged()
    return next
  }
```

</details>

**依据 6 · 源码核查**：[packages/plugin-notes/src/service.ts:577-595](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L577-L595)

手工接管/回滚只改便签租约。

<details>
<summary>查看原文（19行）</summary>

```text
  /** 手动接管：撤销租约 + settleRun(false) + 状态置 'todo'，直写不经 update。 */
  async taskReset(id: NoteId): Promise<{ ok: true; note: NoteRecord } | { ok: false }> {
    const current = this.table.get(id)
    if (!current?.lane) return { ok: false }
    await this.revokeTaskLease(id)
    const now = Date.now()
    const lane: NoteLane = withRunHistory({ ...settleRun(current.lane, false, '用户手动接管', now), status: 'todo' })
    const next: NoteRecord = { ...current, lane, updatedAt: now }
    await this.table.put(id, next)
    this.broadcastChanged()
    return { ok: true, note: next }
  }

  /** 删 lease 行 + 直写恢复 grant 前的整张便签。 */
  private async rollbackTaskExecute(id: NoteId, snapshot: NoteRecord): Promise<void> {
    await this.revokeTaskLease(id)
    await this.table.put(id, snapshot)
    this.broadcastChanged()
  }
```

</details>

**依据 7 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:46-77](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/tools.ts#L46-L77)

手写记录独立同意。

<details>
<summary>查看原文（32行）</summary>

```text
/** 只为 Context 声明合并，让 ctx.get('userQuestions') 的类型成立（type-only）。 */
import type {} from '@deepseek-ai/dsh-user-questions'

const CONSENT_ALLOW = '允许一次'
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
```

</details>

**依据 8 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:348-364](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/tools.ts#L348-L364)

置顶直接写例外。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 9 · 源码核查**：[packages/plugin-notes/src/agent/tools.ts:386-393](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/agent/tools.ts#L386-L393)

删除用户便签先同意。

```text
    },
    async execute(args, exec) {
      const id = args.note_id as NoteId
      const target = noteById(ctx, id)
      if (target?.origin === 'user') await requestNoteConsent(ctx, exec, `delete your note "${noteLabel(target)}"`)
      const deleted = await notes.delete(id)
      return { deleted, id }
    },
```

#### 缺口

- 派发中断后的新会话/真实动作与回写一致性没有故障对照
  **影响**：可能留下孤儿/未知执行，自动重试与无人值守建议受限
  **进一步探讨**：临时工作区在create/model/lease/prompt各阶段失败后核sessionId、实际文件和便签，测可回收性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 日程/截止/超时能保证什么执行结果？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

dueAt是便签截止展示属性，服务持久化它，调度实际判断schedule而非dueAt。卡片逾期不等于拒绝派发、停止Agent或保证截止交付。日程endAt到期则停enabled并跳未来派发，也不取消已运行会话；previewNextAt用next>endAt隐藏，而实际expired用now>=endAt，到边界预览与执行含义需单独核对。

调度每30秒扫描，有在途running防tick重入；先处理已超时的定时run，再日程有效期/到期/超过2小时未补跑、lane状态闸门。once过期不补跑，循环顺延；待规划/已完成/失败等状态阻止自动派发但日程可能仍enabled，用户拖回todo会恢复。它是轮询调度，不是严格时刻或关机补偿保证。

30分钟超时只认run.by=schedule且卡片running未finished，调用notes.settleTaskRun(false,“超时未收尾”)，撤lease/记失败，没有controller stop/cancel。真实Agent可能继续执行，只是不能再按旧lease写回notes_task；循环日程随后可能再次排队，因此卡片失败不等于底层动作已结束，需外部监控和幂等任务设计。手动发起的长任务也不受这条30分钟兜底同等处理。

调度期间单张写入失败只warn继续，不让坏便签阻全轮；这保证可继续扫描，却不是执行/日程记账单次原子。关键任务先确认运行产物、停机/重复策略，不能从一次“已派发”或日历可见推准点完成。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:354-368](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L354-L368)

dueAt持久但非调度闸门。

<details>
<summary>查看原文（15行）</summary>

```text
    const dueAt: number | undefined =
      patch.dueAt === undefined ? current.dueAt : (patch.dueAt ?? undefined)
    const { lane: _currentLane, schedule: _currentSchedule, workspace: _currentWorkspace, dueAt: _currentDueAt, ...currentWithoutLane } = current
    const next: NoteRecord = {
      ...currentWithoutLane,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(nextText !== undefined ? { text: nextText } : {}),
      ...(patch.pinned !== undefined ? { pinned: patch.pinned } : {}),
      archived: patch.archived ?? current.archived ?? false,
      color: patch.color ?? current.color ?? DEFAULT_NOTE_COLOR,
      // origin 一经创建不可改写。
      origin: current.origin ?? 'user',
      updatedAt: now,
      ...(workspace !== undefined ? { workspace } : {}),
      ...(dueAt !== undefined ? { dueAt } : {}),
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:25-35](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/scheduler.ts#L25-L35)

30秒tick与仅定时run超时。

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:67-122](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/scheduler.ts#L67-L122)

扫描顺序、过期、状态、派发/写回和错误。

<details>
<summary>查看原文（56行）</summary>

```text
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
        }
      } finally {
        running = false
      }
      return fired
```

</details>

**依据 4 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:135-149](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/scheduler.ts#L135-L149)

settle只调用NotesService，不停止会话。

<details>
<summary>查看原文（15行）</summary>

```text
    // 与用户手点「执行」在超时兜底/审计上区分开。
    execute: (id) => notes.taskExecuteScheduled(id),
    write: async (id, schedule) => {
      await notes.setSchedule(id, schedule)
    },
    settle: async (id, summary) => {
      await notes.settleTaskRun(id, false, summary)
    },
    warn: (message, error) => ctx.logger.warn(message, error),
  })
  const timer = setInterval(() => {
    void runner.run()
  }, SCHEDULE_TICK_MS)
  ctx.effect(() => () => { clearInterval(timer) })
  return runner
```

</details>

**依据 5 · 源码核查**：[packages/plugin-notes/src/schedule.ts:22-22](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/schedule.ts#L22-L22)

30分钟超时常量。

```text
export const SCHEDULE_RUN_TIMEOUT_MS = 30 * 60 * 1000
```

**依据 6 · 源码核查**：[packages/plugin-notes/src/schedule.ts:237-246](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/schedule.ts#L237-L246)

预览endAt边界。

<details>
<summary>查看原文（10行）</summary>

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
}
```

</details>

**依据 7 · 源码核查**：[packages/plugin-notes/src/schedule.ts:330-333](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/schedule.ts#L330-L333)

运行时到期谓词。

```text
export function isScheduleExpired(schedule: NoteSchedule, now: number): boolean {
  const endAt = schedule.endAt
  return endAt !== undefined && Number.isFinite(endAt) && endAt > 0 && now >= endAt
}
```

**依据 8 · 源码核查**：[packages/plugin-notes/src/client/core/calendar-month.ts:90-106](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/client/core/calendar-month.ts#L90-L106)

dueAt转日历due事件，与日程触发分开。

<details>
<summary>查看原文（17行）</summary>

```text
}

/** 一张便签可产生多条事项（截止、下一次 / 未来重复触发、历史执行）。 */
export function collectEvents(notes: readonly NoteRecord[]): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const horizon = Date.now() + PROJECTION_DAYS * DAY_MS
  for (const note of notes) {
    if (note.archived) continue
    if (note.dueAt !== undefined) events.push({ note, kind: 'due', at: note.dueAt })
    const schedule = note.schedule
    if (schedule?.enabled === true) {
      const nextAt = schedule.nextAt
      if (nextAt !== undefined && nextAt > 0) {
        events.push({ note, kind: 'schedule', at: nextAt })
        if (schedule.mode !== 'interval') {
          let cursor = Math.max(nextAt, Date.now())
          for (let i = 0; i < PROJECTION_MAX; i += 1) {
```

</details>

#### 缺口

- 边界时刻、重复循环和超时Agent仍运行的任务后果未对照
  **影响**：日程不能当准时/单次业务执行保证
  **进一步探讨**：用可丢弃计数任务测endAt前后、停机>2小时、30分钟超时及真实session是否停止。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · WebDAV删除/附件/覆盖恢复有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

自动备份每60秒检查配置/间隔，再用maxUpdatedAt(存活便签)>watermark判变。delete只是删记录/lease并广播，不更新其余便签时间；删除非最新项最大值不变，删唯一项归0，都可能不上传新快照。因此“有变更才备份”不涵盖所有删除，远端旧内容可继续保留；删除后手动backupNow再验证远端，是当前可操作补救，不等于自动已解决。

0.6.0附件/图片写本地notes-assets，正文只留notes-asset/notes-file引用；WebDAV payload只有schema/version/exportedAt/notes，putSnapshot仅JSON，没有附件打包。README明确承认不上传图片/附件，属于设计边界而非藏着的承诺。换机只还文字/引用，缺相应本地文件会失效；完整备份必须另保assets，不能把snapshot成功当所有记录内容可恢复。

restore先固定要恢复的远端名字，再backupNow保存当前，失败中止覆盖，避免latest选中刚上传安全副本；下载校验后replaceAll。replaceAll逐条删旧notes/leases，再逐条put及迁移inline image，不是事务交换，途中失败可留下部分恢复。远端安全副本增加退路，但还需再次手工恢复/核附件，元信息成功不代表本地全量原子完成。

WebDAV依用户服务器/应用密码，代码Basic认证接受http或https，敏感内容应使用可信HTTPS和应用密码，不能从本地密码存储推断端到端加密。dav计时器覆盖fetch返回，body读取在外层后续进行；本轮未测慢body/异常服务，不声称所有请求完整体有硬超时。现金/存储/传输与人工恢复时间均未知；自动任务另有模型/工作区副作用成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/index.ts:65-74](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/index.ts#L65-L74)

60秒自动检查。

<details>
<summary>查看原文（10行）</summary>

```text
      })
    }, 60_000)
    ctx.effect(() => () => { clearInterval(timer) })
    // 每 30s 扫到期日程 → taskExecuteScheduled；装配失败只降级（定时不生效）。
    installNotesSchedulerSafely(ctx, notesService)
    installNotesAgentBridgeWhenReady(ctx)
  } catch (error) {
    void domain.close()
    void metaDomain.close()
    throw error
```

</details>

**依据 2 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-core.ts#L87-L102)

最大更新时间与仅大于水位。

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/service.ts:399-405](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L399-L405)

删除不推进统一版本。

```text
  async delete(id: NoteId): Promise<boolean> {
    await this.revokeTaskLease(id)
    const deleted = await this.table.delete(id)
    if (deleted) this.broadcastChanged()
    return deleted
  }

```

**依据 4 · 源码核查**：[packages/plugin-notes/src/note-asset-store.ts:60-99](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/note-asset-store.ts#L60-L99)

附件/图片存储与inline外置。

<details>
<summary>查看原文（40行）</summary>

```text
  async saveImageBase64(data: string, mediaType: string): Promise<string> {
    const extension = extensionForMediaType(mediaType)
    if (extension === null) throw new Error(`不支持的图片类型：${mediaType}`)
    const bytes = this.decode(data, this.maxImageBytes)
    return this.write(`${randomUUID()}.${extension}`, bytes)
  }

  async readImageBase64(fileName: string): Promise<{ mediaType: string; data: string }> {
    const mediaType = mediaTypeOfNoteImageFile(fileName)
    if (!isValidNoteImageFile(fileName) || mediaType === null) throw new Error('图片引用非法')
    return { mediaType, data: (await this.read(fileName)).toString('base64') }
  }

  async saveFileBase64(data: string, name: string): Promise<string> {
    const bytes = this.decode(data, this.maxFileBytes)
    return this.write(`${randomUUID()}.${extensionOfNoteFileName(name)}`, bytes)
  }

  async readFileBase64(fileName: string): Promise<string> {
    if (!isValidNoteFile(fileName)) throw new Error('附件引用非法')
    return (await this.read(fileName)).toString('base64')
  }

  filePath(fileName: string): string {
    if (!isValidNoteFile(fileName)) throw new Error('附件引用非法')
    return join(this.root, fileName)
  }

  async offloadInlineImages(text: string): Promise<OffloadImagesResult> {
    const matches = findInlineImages(text)
    if (matches.length === 0) return { text, changed: false, saved: 0 }
    const fileNames: string[] = []
    for (const match of matches) {
      fileNames.push(await this.saveImageBase64(match.base64, match.mediaType))
    }
    return {
      text: replaceInlineImages(text, matches, fileNames),
      changed: true,
      saved: matches.length,
    }
```

</details>

**依据 5 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:22-34](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-core.ts#L22-L34)

payload只有notes。

<details>
<summary>查看原文（13行）</summary>

```text
export interface NotesBackupPayload {
  readonly schema: typeof WEBDAV_BACKUP_SCHEMA
  readonly version: typeof WEBDAV_PAYLOAD_VERSION
  readonly exportedAt: number
  readonly notes: readonly NoteRecord[]
}

/** 序列化备份 payload（含 schema 版本，供恢复侧校验）。 */
export function buildBackupPayload(
  notes: readonly NoteRecord[],
  exportedAt: number = Date.now(),
): NotesBackupPayload {
  return { schema: WEBDAV_BACKUP_SCHEMA, version: WEBDAV_PAYLOAD_VERSION, exportedAt, notes }
```

</details>

**依据 6 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:170-180](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-backup.ts#L170-L180)

JSON快照PUT。

<details>
<summary>查看原文（11行）</summary>

```text

  async function putSnapshot(cfg: NotesWebdavConfig, notes: readonly NoteRecord[]): Promise<string> {
    // 撞名去重：先列当前快照名，同一秒重复备份时用 -N 后缀，避免 PUT 覆盖旧快照。
    const existing = new Set(await remoteSnapshotNames(cfg))
    const name = uniqueBackupName(backupFileName(), existing)
    const payload = buildBackupPayload(notes)
    const dir = normalizeDir(cfg.path)
    let res = await dav(cfg, 'PUT', dir + name, JSON.stringify(payload))
    if (!res.ok && (res.status === 409 || res.status === 404)) {
      await ensureRemoteDir(cfg)
      res = await dav(cfg, 'PUT', dir + name, JSON.stringify(payload))
```

</details>

**依据 7 · 源码核查**：[packages/plugin-notes/README.md:70-74](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/README.md#L70-L74)

作者明确附件不随备份。

```text
## 备份（WebDAV）

填服务器地址、远端目录、账号与**应用密码**（凭据只存本机设置，建议用服务商提供的应用密码而非主密码）。按**检查间隔**定时比对，**只在便签有变更时**上传快照，远端只留最近**保留份数**份。想立刻验证连通可以点「保存并立即备份」；恢复前会先自动备份当前状态，选中的那份**整体覆盖**现有便签。

图片与附件文件**不随备份上传**：快照里只有正文与 `notes-asset:` / `notes-file:` 引用。换机恢复只恢复文字与引用，本机没有对应文件时便签里显示「图片已丢失」，附件链接点了会提示下载失败。
```

**依据 8 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:262-302](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-backup.ts#L262-L302)

目标固定/安全备份与replaceAll。

<details>
<summary>查看原文（41行）</summary>

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
    }
```

</details>

**依据 9 · 源码核查**：[packages/plugin-notes/src/service.ts:651-657](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L651-L657)

逐删再put恢复。

```text
  async replaceAll(notes: readonly NoteRecord[]): Promise<void> {
    for (const [id] of this.table.entries()) await this.table.delete(id)
    for (const [leaseId] of this.leases.entries()) await this.leases.delete(leaseId)
    for (const note of notes) await this.table.put(note.id, note)
    await this.migrateInlineImages()
    this.broadcastChanged()
  }
```

**依据 10 · 源码核查**：[packages/plugin-notes/src/webdav-backup.ts:103-141](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-backup.ts#L103-L141)

Basic/http(s)/fetch timeout范围。

<details>
<summary>查看原文（39行）</summary>

```text
  const configError = (cfg: NotesWebdavConfig): string | null => {
    if (!cfg.enabled) return 'WebDAV 未启用'
    if (!/^https?:\/\//iu.test(cfg.url.trim())) return '服务器地址须为 http(s):// 完整 URL'
    if (cfg.username.trim() === '') return '缺少账号'
    if (cfg.password === '') return '缺少应用密码'
    return null
  }

  const authHeader = (cfg: NotesWebdavConfig): string => {
    const token = Buffer.from(`${cfg.username}:${cfg.password}`, 'utf8').toString('base64')
    return `Basic ${token}`
  }

  async function dav(
    cfg: NotesWebdavConfig,
    method: string,
    relative: string,
    body?: string,
    extraHeaders?: Record<string, string>,
  ): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      return await fetch(normalizeBase(cfg.url) + relative, {
        method,
        headers: {
          Authorization: authHeader(cfg),
          ...(body !== undefined ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
          ...extraHeaders,
        },
        body,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }
  }

  /** 确保远端目录存在：按 / 分段逐级 MKCOL；已存在（405/2xx）视为成功。 */
```

</details>

#### 缺口

- 删除后远端一致性、附件跨机恢复和replaceAll中断真实结果未执行
  **影响**：快照不能承担唯一完整恢复承诺，关键迁移需独立备份
  **进一步探讨**：临时账户测删唯一/非最新、移机缺assets、恢复中断及慢body，再核远端JSON与本地记录/文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 成本、采用和下一步设计验证？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

个人便签/待办可有限试用，任务派发仅限隔离工作区、可核结果的小任务；不要把纯记录试用条件扩成关键无人值守调度推荐。先保原notes与notes-assets副本、确认任务工作区，WebDAV先用非敏感内容手动备份/删除后回读，再决定开自动。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH storageDomain/remote与Web slots | 便签必需 | 存储/编辑和展示 | 卡片可见非执行/备份已挂 |
| 会话/模型/工具服务与绝对工作区 | AI任务才必需 | 新session投递及lease回写 | no-dispatch/缺workspace或部分失败 |
| userQuestions与任务caller身份 | 对应Agent写必需 | 手写内容同意/租约归属 | 无通道拒相应写，非文件沙箱 |
| 可信WebDAV/应用密码 | 远端快照才必需 | JSON备份恢复 | 自动漏删，附件不上传 |
| 完整notes+assets副本 | 可靠恢复前提 | 回滚/换机 | 光远端JSON不还附件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 记录小样 | 用户备份后建普通便签/附件 | 重开可回读文字和文件 |
| 任务小样 | 指定隔离工作区、模型，手动派发 | 真session/真实产物与summary一致 |
| 日程 | 仅可幂等小任务设置endAt | 观察真实执行，不仅卡片失败 |
| 备份 | 非敏感账号手动快照、删除后再快照 | 远端JSON一致且另有assets备份 |
| 恢复退出 | 副本验证restore，停日程后核活会话 | 停插件不取消所有任务/删副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储/远端账户未知 | 工作区/权限/备份及恢复核对 | 接线时间未测 |
| 持续使用 | 模型会话、附件和WebDAV未知 | 任务验收、日程/租约和远端核对 | 无净节时/成功率 |
| 失败恢复 | 孤儿会话/副本与重传未知 | 比session/lease/notes/assets并补偿 | 非事务派发/replaceAll |
| 升级退出 | 迁移及副本存储未知 | 停日程、核仍运行会话/数据 | 禁用不撤外部副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 便签→任务 | 新会话/先选模型/lease回写 | 最终任务正确与净交接收益 |
| 日程 | 轮询/有效期/超时记账 | 准点、幂等、Agent实际停止 |
| WebDAV | JSON快照和安全副本 | 自动删除同步/原子恢复 |
| 附件 | 本地文件与正文引用 | 只靠远端JSON不能跨机完整恢复 |

遇到卡片失败而session仍跑、重复任务、summary不符、删除后远端仍旧或附件失效，应停进一步自动派发/恢复，先核session和实际文件，从独立副本恢复；别盲点执行或用新快照覆盖唯一旧备份。

未验证方向优先统一持久变更序号/删除墓碑，备份不再以存活最大时间代替全部变更；再以可恢复operation record关联新session/lease，模型选择/投递失败显式清理或保留未知结果。相对现实现增量分别是删除可见与派发副作用可查，不是再做便签UI。用删唯一/非最新、只改附件、备份中断、replaceAll中断和selectModel/prompt失败矩阵，比远端一致、孤儿数、重复执行和人工恢复。若迁移破坏数据、仍漏删/留孤儿或维护负担超过事前备份，否定；这一方案未实现且不会自动补偿业务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-notes/src/service.ts:508-554](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L508-L554)

多步派发和失败。

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

**依据 2 · 源码核查**：[packages/plugin-notes/src/webdav-core.ts:87-102](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/webdav-core.ts#L87-L102)

删除水位边界。

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

**依据 3 · 源码核查**：[packages/plugin-notes/src/service.ts:651-657](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/service.ts#L651-L657)

恢复事务缺口。

```text
  async replaceAll(notes: readonly NoteRecord[]): Promise<void> {
    for (const [id] of this.table.entries()) await this.table.delete(id)
    for (const [leaseId] of this.leases.entries()) await this.leases.delete(leaseId)
    for (const note of notes) await this.table.put(note.id, note)
    await this.migrateInlineImages()
    this.broadcastChanged()
  }
```

**依据 4 · 源码核查**：[packages/plugin-notes/README.md:70-74](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/README.md#L70-L74)

附件设计限制。

```text
## 备份（WebDAV）

填服务器地址、远端目录、账号与**应用密码**（凭据只存本机设置，建议用服务商提供的应用密码而非主密码）。按**检查间隔**定时比对，**只在便签有变更时**上传快照，远端只留最近**保留份数**份。想立刻验证连通可以点「保存并立即备份」；恢复前会先自动备份当前状态，选中的那份**整体覆盖**现有便签。

图片与附件文件**不随备份上传**：快照里只有正文与 `notes-asset:` / `notes-file:` 引用。换机恢复只恢复文字与引用，本机没有对应文件时便签里显示「图片已丢失」，附件链接点了会提示下载失败。
```

**依据 5 · 源码核查**：[packages/plugin-notes/src/scheduler.ts:135-149](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-notes/src/scheduler.ts#L135-L149)

调度超时只记账。

<details>
<summary>查看原文（15行）</summary>

```text
    // 与用户手点「执行」在超时兜底/审计上区分开。
    execute: (id) => notes.taskExecuteScheduled(id),
    write: async (id, schedule) => {
      await notes.setSchedule(id, schedule)
    },
    settle: async (id, summary) => {
      await notes.settleTaskRun(id, false, summary)
    },
    warn: (message, error) => ctx.logger.warn(message, error),
  })
  const timer = setInterval(() => {
    void runner.run()
  }, SCHEDULE_TICK_MS)
  ctx.effect(() => () => { clearInterval(timer) })
  return runner
```

</details>

#### 缺口

- 变更序号/可恢复派发尚未实现，真实收益无对照
  **影响**：仅建议可回退小样，不计未来效果
  **进一步探讨**：先临时数据/工作区故障矩阵验证，再决定是否扩展自动执行。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
