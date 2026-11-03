# DSH Taskboard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[69a3db3](https://github.com/shengsheng90/DSH-taskboard/tree/69a3db3b46ee04a960968af64a26f0ac901c82a5)

<!-- BEGIN META -->
[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,230](https://img.shields.io/static/v1?label=npm+30d&message=1%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)
<!-- END META -->

> **功能**：为 DSH 提供本地 SQLite 项目看板、Agent 任务工具、原生会话执行与自动化。

> **亮点**：[Q01](#research-q01) 把持久任务、owner认领、宿主原生会话和人工review接在一起，比聊天便签多了可拒绝的竞争与版本边界。 [Q02](#research-q02) 仍保留宿主执行归属，工作流仅指导而非自动引擎。

> **主要限制**：[Q02](#research-q02) human actor是入口信任约定，不能约束已获CLI/数据库能力的进程；Goal complete与非空验证文本不证明成果合格，SQLite事务也不包外部副作用。

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
  - [Q01 · 看板如何贯通人工任务、会话和工具？](#detail-section-11)
  - [Q02 · 执行、取消和重启如何避免重复或失控？](#detail-section-12)
  - [Q03 · 使用和退出需要什么，效率是否可确认？](#detail-section-13)
  - [Q04 · 如何区分任务状态与验收成果？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨会话管理本地项目的 DSH 操作者，可跟踪任务要求、claim与人工review，成果仍需独立验收。

本地任务清单、聊天笔记或外部看板可表达任务，本组件把任务版本、认领和原生会话连到同一库；不替代模型、文件权限或业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目任务与活动 | 持久化要求、状态、评论和关系 | 同一SQLite权威，不能由看板状态证明成果 |
| 排他认领 | 防同库非owner及旧版本写入 | 不等于外部文件/进程全局锁 |
| 原生Agent执行 | 任务映射到会话与Goal | 需要模型/工具权限，副作用另核 |
| 人工review | 将Agent提交与最终done分开 | human入口依赖宿主和本地权限 |
| 规则调度 | 周期认领todo并管理并发 | 配额未知可暂停，并发不是费用预算 |
| 工作流指导 | 给执行者提供持久节点说明 | worker不会自动逐节点运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24 | 本地库必需声明 | node:sqlite | 模块加载不代表GUI/执行兼容 |
| DSH web、原生任务服务 | 看板必需；Agent服务按执行使用 | 客户端、会话、工具与模型 | 缺服务不形成相应执行能力 |
| 同一已确认数据库与附件目录 | 持久化必需 | 任务唯一权威与附件 | 错库会看到不同事实，先对路径 |
| 模型、preset和受控目录 | 自动执行必需 | 原生Agent办任务 | 需另控工具权限、预算与副作用 |
| 宿主认证及本地CLI/DB权限 | 人类边界必需 | 约束accept和直接写库 | 本插件不是多租户隔离层 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核实际profile、库/附件路径并备份 | 同一库、目录和权限明确 |
| 加载 | 用户按作者命令安装重启 | 模块、GUI与工具分别确认，勿混为一次验收 |
| 手动闭环 | 人工写验收条件，Agent精确版本认领并提交review | 非owner/旧版本拒绝，人工看产物后accept |
| 自动评估 | 用户显式开启限量规则 | 核配额、claim、会话和费用，不以idle算完成 |
| 退出 | 用户停规则并核工作者与外部动作，保留库/附件 | 状态对账后移除插件，不盲重放 |

**效果与成本**

[Q03](#research-q03) 的成本表分开模型资源、附件存储和人工验收/恢复，金额和时间未知。

[Q03](#research-q03) 的效果表只支持任务组织与权限接线，不输出净效率或生产可靠性结论。

> **思考**：[Q02](#research-q02) human actor是入口信任约定，不能约束已获CLI/数据库能力的进程；Goal complete与非空验证文本不证明成果合格，SQLite事务也不包外部副作用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把持久任务、owner认领、宿主原生会话和人工review接在一起，比聊天便签多了可拒绝的竞争与版本边界。 [Q02](#research-q02) 仍保留宿主执行归属，工作流仅指导而非自动引擎。

[Q01](#research-q01) 同事务版本和claim有实际实现；[Q02](#research-q02) 孤儿状态与不确定配额可见值得借鉴。跨资源恢复仍需操作ID和实际结果，不能将owner字符串或human kind当OS权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) human actor是入口信任约定，不能约束已获CLI/数据库能力的进程；Goal complete与非空验证文本不证明成果合格，SQLite事务也不包外部副作用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用独立测试库和可丢弃目录从手动闭环试起，再显式开少量自动规则。出现重复执行、claim与会话不符或权限/预算不明，就暂停规则并对账外部副作用，保留数据库与附件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核根注册、模型工具、claim/事务、Goal到review、孤儿恢复、配额与Web/CLI边界。未执行目标或跨Host故障，工作流节点不当自动运行保证。

- 已检查：作者 README、包清单、源码路径 src/client/index.tsx、skills/manage-taskboard/SKILL.md、README.md、src/index.ts、src/tool/index.ts、src/sqlite/provider.ts、src/execution/index.ts、src/service/index.ts、src/cli.ts、src/domain/policy.ts、src/automation/index.ts、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件完整inventory，定向读取SQLite版本/claim/review/事务、工具权限、原生执行、孤儿恢复、调度和人类入口；不完整审计GUI、附件全过程或外部执行，不执行目标代码。
- 下一步：按 [Q03](#research-q03) 的竞争、非owner、旧版本和人工review检查后，再验证 [Q02](#research-q02) 的重启/取消与外部副作用；统计有效交付和恢复负担。

**分析版本**

- **仓库**：[shengsheng90/DSH-taskboard](https://github.com/shengsheng90/DSH-taskboard)
- **版本号**：0.1.11（[固定提交 69a3db3](https://github.com/shengsheng90/DSH-taskboard/tree/69a3db3b46ee04a960968af64a26f0ac901c82a5)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出版本、产物和真实验证记录绑定的验收包，检验能否减少误接受；相对现有human review新增可核材料，而非另设状态标签。

按 [Q03](#research-q03) 的竞争、非owner、旧版本和人工review检查后，再验证 [Q02](#research-q02) 的重启/取消与外部副作用；统计有效交付和恢复负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1528 | — | — | 19609 |
| .mjs | example | 1 | 47 | 44 | 0 | — |
| .js | source | 29 | 16870 | 16274 | 1267 | — |
| .mjs | source | 6 | 383 | 327 | 34 | — |
| .ts | source | 23 | 6438 | 5667 | 306 | — |
| .tsx | source | 2 | 1852 | 1711 | 69 | — |
| .ts | test | 17 | 4063 | 3676 | 108 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/shengsheng90/DSH-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何让看板、Agent执行与人工验收形成可追踪闭环，哪些状态不能当合格交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 看板如何贯通人工任务、会话和工具？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

DSH Taskboard 面向本地项目中需要跟踪多会话任务、依赖和人工验收的操作者。任务卡、聊天笔记或外部看板是直接替代；该项目把本地持久任务与原生 Agent/Goal 执行连接，让对话活动不再是唯一任务记录。合格结果是任务要求、当前 owner、执行会话和验收理由可核对，卡片变色本身不算业务交付。

根插件创建 TaskboardService，并在宿主 tools 可用时注册工具，在 agents/goals/workspaceRegistry/presets/model 服务可用时建立 worker 与调度器。Agent 工具从 ToolRunContext 取得实际 Agent 标识，不让模型参数自由声明 human；任务认领使用精确版本，并在 SQLite BEGIN IMMEDIATE 事务内检查状态、已有认领、开发上下文冲突和未完成依赖，随后写 claim、任务状态与活动。相比仅在聊天中写“我正在做”，它有实际共享权威与竞争拒绝。

模型工具包含读、认领、评论、提交复核等，不提供 accept 或任意状态变更。provider.accept 强制 human actor 且只允许 in_review 到 done。不过 human 是入口权限约定，不是密码学证明真人点击；本地 CLI 直接构造该 actor，有本地执行/数据库权限的进程仍必须由宿主权限限制，见 Q02。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:1667-1718](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/client/index.tsx#L1667-L1718)

客户端创建控制器并注册sidebar与overlay，实际原生界面接线。

<details>
<summary>查看原文（52行）</summary>

```text
export async function apply(ctx: Context): Promise<() => Promise<void>> {
  const connection = ctx.get('connection') as unknown as TaskboardConnection
  const remote = ctx.get('remote') as unknown as TypertClientRemote
  const locale = ctx.get('locale') as unknown as TaskboardLocaleRuntime
  const unbindLocale = bindTaskboardLocale(locale)
  const unregisterCopy = locale.register(TASKBOARD_LOCALE_NS, taskboardLocales)
  const unmountRemote = await remote.$mount(taskboardRemote)
  ctx.inject(['remote.taskboard', 'uiWorkspace'], (remoteCtx) => {
    const sessions = remoteCtx.get('sessions') as unknown as ISessions
    taskSessionList = sessions.list
    const workspaces = remoteCtx.get('workspaces') as unknown as IWorkspaces
    const uiWorkspace = remoteCtx.get('uiWorkspace') as unknown as UiWorkspace
    const conversation = remoteCtx.get('conversation') as unknown as ConversationDraftPort
    const mountedRemote = remoteCtx.get('remote') as unknown as TypertClientRemote
    const sessionNavigator: TaskSessionNavigator = {
      list: { getSnapshot: () => sessions.list.getSnapshot() },
      refresh: () => sessions.refresh(),
      open: sessionId => { uiWorkspace.openSession(sessionId) },
    }
    const controller = new TaskboardClientController(
      connection,
      mountedRemote.taskboard,
      sessionId => openTaskSession(sessionNavigator, sessionId),
      (workspaceId, draft) => prepareTaskSession(sessions, uiWorkspace, conversation, workspaceId, draft),
    )
    // Close the page when the user navigates to another Session: the shell's
    // session navigation is store-based (not hash-based), so it never clears
    // the Taskboard hash on its own.
    const sessionList = sessions.list
    let previousSession = sessionList.getSnapshot().current
    const offSessions = sessionList.subscribe(() => {
      const next = sessionList.getSnapshot().current
      if (next !== previousSession) {
        previousSession = next
        if (controller.getSnapshot().open) controller.close()
      }
    })
    remoteCtx.effect(() => () => { controller.dispose(); offSessions() }, 'taskboard client controller')
    const slots = remoteCtx.get('slots') as ISlots
    const Nav = (props: PropsRuntime<'sidebar.footer.action'>) => <TaskboardNavButton {...props} controller={controller} />
    const Page = (props: PropsRuntime<'shell.overlay'>) => <TaskboardPage {...props} controller={controller} workspaces={workspaces} />
    slots.inject('sidebar.footer.action', () => slots.register({ name: 'sidebar.footer.action', id: 'taskboard.navigation' }, Nav))
    slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'taskboard.page' }, Page))
  })
  return async () => {
    unbindLocale()
    unregisterCopy()
    await unmountRemote()
  }
}

const STYLES = `
```

</details>

**依据 2 · 源码核查**：[skills/manage-taskboard/SKILL.md:1-27](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/skills/manage-taskboard/SKILL.md#L1-L27)

包内Skill提供工具与人工review指导。

<details>
<summary>查看原文（27行）</summary>

```text
---
name: manage-taskboard
description: Manage work in the native DeepSeek Harness Taskboard with exact task ids and optimistic versions. Use when an Agent must inspect project work, claim an eligible todo, record progress or blockers, verify an implementation, submit it for human review, or release its own claim; also use when a human asks how to accept, return, archive, or automate Taskboard work through the native UI or dsh-taskboard JSON CLI.
---

# Manage Taskboard

Use the in-process `taskboard_*` tools for Agent work. Use `dsh-taskboard` only for human-operated scripts and interoperability; do not make the model shell out when a native tool exists.

## Execute one task

1. Call `taskboard_list` with the exact project id. Prefer an eligible `todo`; do not select `backlog`, archived, dependency-blocked, or already claimed work.
2. Call `taskboard_get` immediately before claiming. Preserve the opaque task id and current `version` exactly; never derive an id from a display key such as `DSH-42`.
3. Call `taskboard_claim` with that id and version. Treat a stale-version or claim conflict as a signal to reread and reconsider, not to retry blindly.
4. Read the full description, comments, relations, dependency state, development context, and attachment references before changing files. Work only in the task's declared workspace, branch, or worktree.
5. Complete the work and run relevant verification. If requirements change, call `taskboard_get` again before continuing.
6. Record the final result with `taskboard_comment` or `taskboard_submit_review`, always using the version returned by the latest read or write. Never modify the task description.
7. Call `taskboard_submit_review` with a concise result comment and concrete verification evidence. This moves owned work to `in_review`; it never marks work `done`.

Keep every write version-linear: after any successful comment, relation, block, or other mutation, use its returned version for the next write. If another actor wins the race, reread the task and reconcile instead of overwriting their change.

## Handle exceptional outcomes

- Call `taskboard_block` only on the in-progress task you hold the claim for, and only with a concrete reason when work cannot proceed. Include the missing dependency, decision, permission, or external condition. A `todo` you have not claimed is not yours to block: report the obstacle in a comment and leave the column to a human.
- Call `taskboard_release_claim` when intentionally abandoning owned work. Explain what remains and leave useful progress in a comment first when possible.
- Use `taskboard_relate` only after reading both tasks. Keep relations within one project and do not create parent cycles.
- Never call or emulate acceptance. Only a human may accept `in_review` as `done`, return it for rework, approve backlog work, archive it, or permanently delete it.
```

</details>

**依据 3 · 作者声明**：[README.md:5-30](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/README.md#L5-L30)

作者明确本地任务权威、宿主执行归属与人类验收定位。

<details>
<summary>查看原文（26行）</summary>

```text
Native, local project task management for DeepSeek Harness. SQLite is the sole task authority. Harness Agent Sessions, Goals, Workspaces, tools, permissions, and the Web Client remain the execution and conversation owners.

This README is written so a human **or another coding agent** can install the plugin into a live Harness profile, verify it, and start using it without guessing.

**Package:** `@shengsheng/dsh-taskboard`  
**Repository:** https://github.com/shengsheng90/DSH-taskboard  
**License:** Apache-2.0  
**Host version policy:** DSH runtime peers use `*` (no version gate). Installation/loading is tested against `0.1.6-alpha.1`, `0.1.7-rc.1/rc.2`, `0.2.0-rc.1/rc.2`, and `0.2.1-rc.2`. This verifies installation and module loading; GUI operations and model execution still need checking after a Host upgrade.

![Native Taskboard board, task detail, and workflow views](docs/assets/taskboard-demo.gif)

If you are an installing agent, jump to [Install into DeepSeek Harness](#install-into-deepseek-harness) and follow every step in order. Git, npm, and release tarballs carry prebuilt Host/Client artifacts. Installation requires neither a TypeScript build nor a Harness source checkout.

## What you get

After a successful install, Harness gains:

- A **Taskboard** sidebar button and a native overlay page (not an iframe, not a second chat runtime)
- Local SQLite projects, tasks, comments, relations, attachments, workflows, and automation
- Stable readable keys such as `DSH-42` plus opaque ids and optimistic versions
- Seven statuses: `backlog` → `todo` → `in_progress` → `in_review` → `done`, plus `blocked` and `canceled`
- In-process Agent tools `taskboard_*` (no accept / no generic status mutation)
- Headless JSON CLI `dsh-taskboard`
- Packaged Skill `manage-taskboard`

Agents can submit verified work to `in_review`. Only an authenticated human UI or CLI operation can accept it as `done`.
```

</details>

**依据 4 · 源码核查**：[src/index.ts:64-89](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/index.ts#L64-L89)

实际创建service、工具、worker和自动调度接线。

<details>
<summary>查看原文（26行）</summary>

```text
/** Mount the Taskboard service and optional loopback Web RPC adapter. */
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

**依据 5 · 源码核查**：[src/tool/index.ts:15-31](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/tool/index.ts#L15-L31)

工具actor来自实际Agent，工具面刻意没有accept。

<details>
<summary>查看原文（17行）</summary>

```text
function actor(exec: ToolRunContext): AgentActor {
  const agent = exec.agent
  if (agent === undefined) throw new TaskboardError('Taskboard tools require a live root Agent', 'TASK_FOREIGN_CLAIM')
  const owner = String(agent.id)
  return { kind: 'agent', actorId: owner, sessionId: owner, agentId: owner }
}

function present(title: string, rawInput?: unknown) {
  return { card: 'generic' as const, title, kind: 'other' as const, ...(rawInput === undefined ? {} : { rawInput }) }
}

function asJson(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue
}

/** Build the narrow model-facing tool set. It intentionally contains no accept or generic status mutation. */
export function taskboardToolDefinitions(service: TaskboardService): ToolDefinition[] {
```

</details>

**依据 6 · 源码核查**：[src/tool/index.ts:74-119](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/tool/index.ts#L74-L119)

工具将精确版本、owner和提交文本交给provider。

<details>
<summary>查看原文（46行）</summary>

```text
    defineTool({
      name: 'taskboard_claim',
      description: 'Atomically claim one eligible todo after reading it. Pass the exact current version. The service rechecks dependencies and exclusive ownership in the same transaction.',
      parameters: {
        task_id: { type: 'string', required: true },
        expected_version: { type: 'integer', required: true },
      },
      output: JSON_OUTPUT,
      execute(args, exec) {
        const owner = actor(exec)
        return Promise.resolve(asJson(service.provider.claim(TaskId(args.task_id), {
          expectedVersion: args.expected_version,
          sessionId: owner.sessionId,
          agentId: owner.agentId,
        }, owner)))
      },
      presentCall: args => present('Claim Taskboard issue', args.task_id),
    }),
    defineTool({
      name: 'taskboard_comment',
      description: 'Append a durable Markdown comment after rereading the task. Pass its exact current version; the write increments that version.',
      parameters: {
        task_id: { type: 'string', required: true },
        expected_version: { type: 'integer', required: true },
        body: { type: 'string', required: true },
      },
      output: JSON_OUTPUT,
      execute(args, exec) {
        return Promise.resolve(asJson(service.provider.comment(TaskId(args.task_id), args.expected_version, args.body, actor(exec))))
      },
      presentCall: args => present('Comment on Taskboard issue', args.task_id),
    }),
    defineTool({
      name: 'taskboard_submit_review',
      description: 'Submit the owning in-progress claim for human review only after verification. Requires a result comment, verification evidence, and the exact current task version. This never accepts the task as done.',
      parameters: {
        task_id: { type: 'string', required: true },
        expected_version: { type: 'integer', required: true },
        verification: { type: 'string', required: true },
        result_comment: { type: 'string', required: true },
      },
      output: JSON_OUTPUT,
      execute(args, exec) {
        return Promise.resolve(asJson(service.provider.submitReview(
          TaskId(args.task_id), args.expected_version, args.verification, args.result_comment, actor(exec),
        )))
```

</details>

**依据 7 · 源码核查**：[src/sqlite/provider.ts:565-605](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L565-L605)

同一事务检查依赖、owner与工作上下文后认领。

<details>
<summary>查看原文（41行）</summary>

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
    })
```

</details>

**依据 8 · 源码核查**：[src/sqlite/provider.ts:688-690](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L688-L690)

provider层限制human accept和状态来源。

```text
  accept(taskId: TaskboardTaskId, expectedVersion: number, actor: TaskboardActor): TaskboardTask {
    requireHuman(actor, 'accept')
    return this.transition(taskId, expectedVersion, ['in_review'], 'done', 'task.accepted', actor)
```

**依据 9 · 源码核查**：[src/sqlite/provider.ts:1759-1772](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L1759-L1772)

BEGIN IMMEDIATE/COMMIT与失败rollback形成库内原子边界。

<details>
<summary>查看原文（14行）</summary>

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
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行、取消和重启如何避免重复或失控？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

自动执行先同步认领，避免调度器把输掉事务竞争的任务当作已启动；再创建或恢复原生 Agent，安装模型选择和 preset，附工作区，发送包含任务版本、依赖、评论和附件引用的完整指令。赋给任务的 workflow 被渲染为 guidance-only，明确节点不会被调度器自动逐步执行，不能把工作流编辑器当已经运行的 DAG 引擎。

重启通过宿主现有 Agent 列表将缺席 owner 标为 orphaned，只恢复仍启用规则的相应 claim；恢复失败保留可见 orphaned。这个本地恢复机制有实质实现，但 SQLite 事务不包含 Agent、文件、模型与外部 API 的副作用。旧任务曾发出的命令是否停止、重放是否幂等，需要实际执行证据，单凭会话不在本进程列表不能推出远端已停。取消任务的数据库状态同样不能自行证明所有外部操作已撤销。

Goal complete 进入 in_review，不是 done，这是重要保护；但自动提交 verification 为 Completed，结果可取已有评论或通用 Work completed，并没有机器验证产物。最终仍依赖用户阅读实际成果。Web 写路由复用 connection.requestRejection 后使用 human:web-client，CLI 的 human(options) 在本地构造 actor；requireHuman 仅检查 kind。它隔离窄模型工具的权限，却不能约束已获 CLI 或数据库能力的 Agent，也不是多租户隔离。

调度器默认 quota 为 uncertain，pause-on-uncertain 会暂停新认领，而显式 ignore 可以继续；并发额度只限制 worker 数，不是模型费用预算。观察故障时须分别看任务库、claim、会话和实际副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/index.ts:175-199](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/execution/index.ts#L175-L199)

先认领、孤儿核对与启用规则条件恢复，失败仍可见。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Claim synchronously so the scheduler never counts work that lost the transaction race. */
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
  }

  /** Mark dead owners explicitly, then resume only claims owned by a still-enabled automation rule. */
  async reconcile(): Promise<void> {
    const live = new Set(this.ctx.agents.list().map(item => String(item.id)))
    this.taskboard.provider.markOrphanedClaims(live)
    for (const claim of this.taskboard.provider.listClaims(['orphaned'])) {
      if (claim.automationId === undefined) continue
      let rule: AutomationRule
      try { rule = this.taskboard.provider.getAutomation(claim.automationId) } catch (_deletedRule) { continue }
      if (rule.state !== 'enabled') continue
      const task = this.taskboard.provider.getTask(claim.taskId)
      try { await this.launch(rule, task, claim, true) } catch (_boundedResumeFailure) { /* claim remains visible as orphaned */ }
    }
```

</details>

**依据 2 · 源码核查**：[src/execution/index.ts:225-276](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/execution/index.ts#L225-L276)

创建/恢复Agent并发送任务，idle不当成任务完结。

<details>
<summary>查看原文（52行）</summary>

```text
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
    } catch (error) {
      if (handle !== undefined) await this.release(initialClaim.sessionId)
      const latest = this.taskboard.provider.getTask(task.id)
      if (latest.status === 'in_progress') {
        try { this.taskboard.provider.releaseClaim(latest.id, latest.version, `worker startup failed: ${String(error)}`, owner) } catch (_preserveOriginal) { /* authoritative state remains inspectable */ }
      }
      throw error
```

</details>

**依据 3 · 源码核查**：[src/execution/index.ts:96-107](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/execution/index.ts#L96-L107)

已赋工作流只作指导，不自动运行节点。

<details>
<summary>查看原文（12行）</summary>

```text
/** Assigned workflows are durable execution guidance. The editor's executable/design-only marker
 *  describes registered capabilities; it does not make the scheduler an implicit workflow engine. */
export function renderWorkflowGuidance(service: TaskboardService, task: TaskboardTask): string {
  if (task.workflowId === undefined) return '- None'
  const workflow = service.provider.getWorkflow(task.workflowId)
  const lines = [`Workflow: ${workflow.name} (guidance-only; nodes are not run automatically)`]
  for (const tab of workflow.document.tabs) {
    lines.push(`Tab: ${tab.name}`)
    lines.push(...renderWorkflowNode(tab.trigger, 1, 'trigger'))
    for (const node of tab.steps) lines.push(...renderWorkflowNode(node, 1, 'step'))
  }
  return lines.join('\n')
```

</details>

**依据 4 · 源码核查**：[src/execution/index.ts:280-312](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/execution/index.ts#L280-L312)

Goal完成只提交review，文本Completed不等于真实验证。

<details>
<summary>查看原文（33行）</summary>

```text
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
      if (rule !== undefined) this.recordGoalFailure(rule, task, error)
    }
    // Goal terminal state ends this worker's active turn. A blocked claim remains visible until a
    // human resumes or releases it; a submitted review claim is retired by the provider.
    void this.releaseUnclaimed(claim.sessionId)
```

</details>

**依据 5 · 源码核查**：[src/service/index.ts:297-303](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/service/index.ts#L297-L303)

Web入口在服务端构造human actor。

```text
    ctx.inject(['connection', 'webServer'], (channelCtx) => {
      const handler: TaskboardRpcHandler = (endpoint, payload) => endpoint === 'automation.run-now'
        ? this.dispatchAutomationRunNow(payload)
        : Promise.resolve(this.dispatchHumanRpc(endpoint, payload, human('human:web-client')))
      const connection = channelCtx.connection as unknown as {
        requestRejection(request: { headers: IncomingMessage['headers'] }): number | undefined
      }
```

**依据 6 · 源码核查**：[src/service/index.ts:338-346](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/service/index.ts#L338-L346)

请求仍由宿主connection拒绝边界守护，不能说无鉴权。

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
```

**依据 7 · 源码核查**：[src/cli.ts:88-90](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/cli.ts#L88-L90)

本地CLI直接构造human actor，边界依赖外层进程/文件权限。

```text
function human(options: ReadonlyMap<string, string>): HumanActor {
  return { kind: 'human', actorId: options.get('actor') ?? 'human:cli' }
}
```

**依据 8 · 源码核查**：[src/domain/policy.ts:17-22](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/domain/policy.ts#L17-L22)

人类检查仅依据actor.kind。

```text
/** Assert that an operation carries direct human authority. */
export function requireHuman(actor: TaskboardActor, operation: string): asserts actor is Extract<TaskboardActor, { kind: 'human' }> {
  if (actor.kind !== 'human') {
    throw new TaskboardError(`${operation} requires human authority`, 'TASK_HUMAN_AUTHORITY_REQUIRED', { operation })
  }
}
```

**依据 9 · 源码核查**：[src/automation/index.ts:15-17](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/automation/index.ts#L15-L17)

默认配额保持不确定而非假定可用。

```text
// Harness does not currently publish a proactive quota signal. Unknown must stay unknown instead
// of silently disabling `pause-on-uncertain`; operators can explicitly select `ignore`.
const DEFAULT_QUOTA: TaskboardQuotaPolicy = { state: () => Promise.resolve('uncertain') }
```

**依据 10 · 源码核查**：[src/automation/index.ts:165-173](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/automation/index.ts#L165-L173)

不确定配额策略会暂停新认领。

```text
      let rule = this.taskboard.provider.getAutomation(ruleId)
      if (!preserve && rule.state !== 'enabled') return
      const quota = await this.quota.state(rule)
      if (quota === 'uncertain' && rule.config.quotaPolicy === 'pause-on-uncertain') {
        rule = this.record(ruleId, {
          kind: 'quota-paused', message: 'quota state is uncertain; no new claims started', at: Date.now(),
        }, preserve ? kept : undefined, preserve ? undefined : 'paused')
        if (!preserve) this.refresh(rule)
        return
```

#### 缺口

- 未验证进程重启、取消和模型/远端副作用的真实执行结果。
  **影响**：本地claim恢复与库内互斥不能证明跨Host排他、外部幂等或取消完成。
  **进一步探讨**：在隔离项目中记录worker中断、重启和外部操作ID，检查重复执行、原owner是否仍活跃以及人工接管条件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用和退出需要什么，效率是否可确认？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

适合已有 DSH 本地项目、愿意承担人工验收的人先在独立测试库和可丢弃项目中试用。先走人工任务和模型工具闭环，再显式开启少量自动规则。根声明 peers 不设版本门槛，作者表格只声称指定版本安装/模块加载测试，已经区分 GUI 和模型执行仍需检查，不能将其扩展为全面兼容。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node内置SQLite、包、数据库与附件磁盘；金额未知 | 确定同库路径、安装profile、重启和备份；耗时未知 | GUI可见不等于模型执行已通 |
| 持续使用 | 模型/工具费用、附件与数据库增长未知 | 写验收条件、复核成果、处理依赖与版本冲突 | worker并发不是现金预算 |
| 失败恢复 | 保留SQLite与附件、任务和会话记录 | 对账claim/owner/外部副作用并决定重放 | orphaned不证明旧工作停止 |
| 退出 | 导出或保留库与附件 | 先停自动规则和工作者，核会话及外部动作，再移除插件 | 保留任务事实不等于自动迁移到其他看板 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 任务协作 | 同库乐观版本、排他认领和活动记录 | 跨Host与实际负载下可靠性 |
| 人工验收 | 模型工具无accept，done需human入口 | CLI/DB权限边界与真人审核质量 |
| 自动执行 | 原生会话/Goal与孤儿恢复接线 | 任务成果、外部幂等和故障恢复耗时 |
| 业务效率 | 有减少聊天遗失任务的组织机制 | 合格率、返工、总成本没有对照 |

先让两个受控会话争用同一任务，检查旧版本与非owner写入被拒，再提交review并由操作者核成果。出现重复执行、任务库与会话不符、权限边界不明或费用超过人工预算就暂停自动规则并人工对账。项目所用工作目录、CLI和数据库权限也必须由宿主单独控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-12](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/README.md#L9-L12)

版本政策仅安装/加载测试，保留作者限制。

```text
**Package:** `@shengsheng/dsh-taskboard`  
**Repository:** https://github.com/shengsheng90/DSH-taskboard  
**License:** Apache-2.0  
**Host version policy:** DSH runtime peers use `*` (no version gate). Installation/loading is tested against `0.1.6-alpha.1`, `0.1.7-rc.1/rc.2`, `0.2.0-rc.1/rc.2`, and `0.2.1-rc.2`. This verifies installation and module loading; GUI operations and model execution still need checking after a Host upgrade.
```

**依据 2 · 作者声明**：[README.md:34-42](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/README.md#L34-L42)

Node SQLite、web、写权限等启动条件。

```text
## Requirements

| Requirement | Value |
|---|---|
| Node.js | `^22.19.0` or `>=24.0.0` (24 recommended; built-in `node:sqlite`) |
| pnpm | Use `11.15.1` for repository development (`packageManager`); profile installation uses Harness's pnpm |
| DeepSeek Harness | checkout or installation, **web** profile; no DSH version constraint |
| Network | only needed to clone this repo and install Node dependencies |
| Permissions | write access to `$DSH_HOME` (default `~/.dsh`) and the ability to restart the Harness process |
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-17](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/cordis.patch.yml#L1-L17)

数据库/附件、并发、间隔和共享工作目录默认值。

<details>
<summary>查看原文（17行）</summary>

```text
- insert:
    - id: taskboard
      name: '@shengsheng/dsh-taskboard'
      config:
        databasePath: !!js process.env.DSH_TASKBOARD_DATABASE ?? '.dsh/taskboard.sqlite'
        attachmentRoot: !!js process.env.DSH_TASKBOARD_ATTACHMENTS ?? '.dsh/taskboard-attachments'
        pageSize: 100
        maxAttachmentBytes: 26214400
        maxTaskAttachmentBytes: 104857600
        minAutomationIntervalMs: 30000
        maxProjectWorkers: 2
        maxGlobalWorkers: 4
        allowSharedWorktrees: false
        clientRefreshIntervalMs: 15000
        maxChangeWaiters: 128
        maxChangeWatchMs: 30000
        defaultAgentPreset: standard
```

</details>

**依据 4 · 源码核查**：[src/index.ts:72-88](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/index.ts#L72-L88)

停自动化并停止worker的清理接线。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/sqlite/provider.ts:565-605](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L565-L605)

竞争和非owner检查为试用成功判据提供依据。

<details>
<summary>查看原文（41行）</summary>

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
    })
```

</details>

#### 缺口

- 没有同项目、相同预算的有效任务对照。
  **影响**：不能确认减少聊天遗失的组织机制带来净效率，人工审核和恢复可能增加负担。
  **进一步探讨**：对照原有任务清单，测同批合格交付数、重复工作、人工验收/恢复时间与现金支出，不只统计done卡片。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何区分任务状态与验收成果？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是把任务版本、产物摘要和真实验证记录绑定为验收包，可能降低人类面对通用 Completed 文本时误接受的概率。它建立在已有human accept、版本与review事件上，不声称系统没有人工门槛。当前自动路径把 Goal complete 转为review，verification传固定 Completed，评论可能只有通用 Work completed，因此“已提交复核”与“验证充分”仍有距离。

新增约束应保留原有任务责任和宿主执行归属，只要求接受时能查看匹配该版本的产物和实际检查结果；验证记录缺失或失配应展示未知，不自动补造通过。代价是取证、存储、用户阅读与跨工具适配。对照相同项目任务和审核者，比较当前评论review与版本绑定包的误接受、误退回、审核时长、返工和恢复成本。若未降低误接受，或材料阅读负担超过效果，就否定该方案。它不让自动检查替代最终业务责任。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/index.ts:280-298](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/execution/index.ts#L280-L298)

Goal完成触发固定Completed字段，是假设依据。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/sqlite/provider.ts:634-653](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L634-L653)

非空文本和owner/version进入review，但不执行真实性校验。

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

**依据 3 · 源码核查**：[src/sqlite/provider.ts:688-690](https://github.com/shengsheng90/DSH-taskboard/blob/69a3db3b46ee04a960968af64a26f0ac901c82a5/src/sqlite/provider.ts#L688-L690)

已有human accept是反证和基线，不能说无审核门槛。

```text
  accept(taskId: TaskboardTaskId, expectedVersion: number, actor: TaskboardActor): TaskboardTask {
    requireHuman(actor, 'accept')
    return this.transition(taskId, expectedVersion, ['in_review'], 'done', 'task.accepted', actor)
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
