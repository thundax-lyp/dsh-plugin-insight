# plugin-team-board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5649509](https://github.com/whyihaveyou/dsh-suite/tree/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 1,037](https://img.shields.io/static/v1?label=npm+30d&message=1%2C037&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-team-board) [![最新发布 2026-08-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-team-board)
<!-- END META -->

> **功能**：为同一 DSH 进程提供共享任务服务、五个任务工具和三列看板，并保存任务快照。

> **亮点**：共同服务把跨agent的主题、负责人、状态和依赖ID变为可查询对象，工具与界面共享同一状态，是相对文字交接的具体增量；不承诺自动调度或首创。[Q01](#research-q01)

> **主要限制**：认领可被后写覆盖，持久化错误被吞且全HOME共用文件；返回成功不等于排他获得任务或重启后仍保留，不能用于重要任务的可靠分派。[Q03](#research-q03)

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
  - [Q01 · 共享任务板相对会话文字待办增加什么？](#detail-section-11)
  - [Q02 · 状态从工具或界面如何写入并在重启后恢复？](#detail-section-12)
  - [Q03 · 为什么不能把认领当排他锁或通用多项目调度？](#detail-section-13)
  - [Q04 · 全量快照的成本如何影响使用，值得验证什么改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同一DSH进程内的协作者可共享结构化任务和三列视图，但任务完成仍需另行验收。[Q01](#research-q01)

会话文字待办简单但难统一查询；已有事务任务系统通常提供权限与并发控制。本组件提供轻量结构和界面，不具有后者保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| task_create | 创建共同任务 | 主题与可选owner/deps；deps不强制执行 |
| task_claim | 写入负责人和doing状态 | 可覆盖已有认领，无排他锁 |
| task_update | 修改任务字段 | 未作完成证据验收 |
| task_list | 按状态或负责人查询 | 同服务内共享 |
| task_delete | 删除任务 | 无外部成果回滚 |
| 三列看板 | 人工创建和切换状态 | 依赖Web服务与旧client接口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Cordis ^4.0.1、session/tools ^0.1.0-rc.6 | 包声明必需 | 服务与工具 | 跨世代兼容未知 |
| webServer服务 | 服务启动必需 | 浏览器API | 缺失则服务等待或不能实例化 |
| 旧client runtime/UI slots/settings/locale | 界面必需 | 注册设置页看板 | 新宿主可能无法加载 |
| 可写DSH_HOME | 跨重启必需 | 保存board.json | 写失败被吞，不能保证持久化 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离HOME并备份数据 | 不与其他进程共写 |
| 加载 | 宿主实例化Service和Web模块 | 确认工具、路由与面板都存在 |
| 使用 | agent建任务认领，用户查看并改状态 | 人工核对owner和实际成果 |
| 恢复 | 用户比较文件和状态 | 写错或冲突时停止，保留副本后人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主资源费用未知 | 处理旧依赖与隔离目录，耗时未知 | 本组件无外部API调用链 |
| 持续使用 | 每次整板写与快照事件增长 | 人工核对认领冲突与完成 | 延迟和容量未知 |
| 失败恢复 | 重试及备份资源未知 | 比较文件/journal/内存 | 无原子事务与错误反馈 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共同查询 | 服务内同一BoardStore | 是否减少重复工作 |
| 跨重启恢复 | 读取board.json的实现 | 写失败与中断完整性 |
| 可视化状态 | HTTP变更后refresh | 实际浏览器与新宿主兼容 |

> **思考**：认领可被后写覆盖，持久化错误被吞且全HOME共用文件；返回成功不等于排他获得任务或重启后仍保留，不能用于重要任务的可靠分派。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：共同服务把跨agent的主题、负责人、状态和依赖ID变为可查询对象，工具与界面共享同一状态，是相对文字交接的具体增量；不承诺自动调度或首创。[Q01](#research-q01)

纯领域BoardStore与Cordis包装分离，undefined字段清理避免部分更新污染；但没有运行时状态校验、版本冲突检测或可靠写盘错误响应。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

认领可被后写覆盖，持久化错误被吞且全HOME共用文件；返回成功不等于排他获得任务或重启后仍保留，不能用于重要任务的可靠分派。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并核查旧依赖与路由边界，不把claim当锁、done当验收；重要任务继续用已有可靠流程。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

任务CRUD和界面接线有源码依据；排他认领、事务持久化及当前宿主兼容没有保证，改进仅为假设。

- 已检查：作者 README、包清单、源码路径 packages/plugins/plugin-team-board/src/index.ts、packages/plugins/plugin-team-board/src/board.ts、packages/plugins/plugin-team-board/lib/client.js、packages/plugins/plugin-team-board/README.md、packages/plugins/plugin-team-board/package.json、packages/plugins/plugin-team-board/cordis.patch.yml 及固定范围 inventory；组件：packages/plugins/plugin-team-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件源码与包声明；未运行目标测试、HTTP或浏览器。根目录其他插件不计入本组件能力。
- 下一步：先在隔离HOME核对启动依赖，再以双认领、只读文件和中断恢复检查误报成功及状态一致性。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.2.1（[固定提交 5649509](https://github.com/whyihaveyou/dsh-suite/tree/5649509411de7fb95c8f024e728cbf28f8ac48ac)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

带版本更新、原子文件替换和显式写错响应可能使冲突与恢复可核对；应比较双认领和中断轨迹，若仍误报成功或负担过高则放弃。这是未实现设计。[Q04](#research-q04)

先在隔离HOME核对启动依赖，再以双认领、只读文件和中断恢复检查误报成功及状态一致性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 159 | 133 | 10 | — |
| .md | source | 1 | 125 | — | — | 1509 |
| .mjs | source | 1 | 67 | 52 | 4 | — |
| .ts | source | 2 | 448 | 374 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/whyihaveyou/dsh-suite/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/whyihaveyou/dsh-suite/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/whyihaveyou/dsh-suite/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：共享看板能否在任务状态、认领和恢复边界清楚的条件下支持多agent协作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享任务板相对会话文字待办增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一DSH进程中的多agent可把任务主题、状态、负责人和依赖ID放到共同服务中，通过五个工具创建、认领、修改、查询、删除。相对每个会话各写一段待办，它增加可查询的结构和Web三列视图；合格结果是参与者能看到同一任务状态，而非保证分工正确或任务真正办结。README的“生态空白”没有独立比较依据，不采纳首创说法。deps只是存储字段，代码没有依赖完成前禁止认领的调度规则，done也不是证据验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:94-113](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L94-L113)

服务消费者共享同一BoardStore。

<details>
<summary>查看原文（20行）</summary>

```text
  createTask(subject: string, opts?: { owner?: string; deps?: string[] }): Task {
    const task = this.board.create({ subject, ...opts })
    this.persist()
    return task
  }

  claimTask(id: string, owner: string): Task {
    const task = this.board.claim(id, owner)
    this.persist()
    return task
  }

  updateTask(id: string, patch: { subject?: string; status?: TaskStatus; owner?: string; deps?: string[] }): Task {
    const task = this.board.update(id, patch)
    this.persist()
    return task
  }

  listTasks(filter?: { status?: TaskStatus; owner?: string }): Task[] {
    return this.board.list(filter)
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:217-249](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L217-L249)

创建与认领工具实际注册。

<details>
<summary>查看原文（33行）</summary>

```text
  private registerTools(): void {
    const board = this.board
    const persist = () => this.persist()

    this.ctx.tools.register(defineTool({
      name: 'task_create',
      description: 'Create a task on the shared team board (visible to every agent in this process). Returns the created task with a generated id and status "todo".',
      parameters: {
        subject: { type: 'string', required: true, description: 'Short imperative task description.' },
        owner: { type: 'string', description: 'Optional owner (agent/session id).' },
        deps: { type: 'array', items: { type: 'string' }, description: 'Optional task ids this task depends on.' },
      },
      output: { schema: taskOutputSchema, render: (_args, value) => renderTask(value) },
      async execute(args) {
        const task = board.create({ subject: args.subject, owner: args.owner, deps: args.deps })
        persist()
        return task
      },
    }))

    this.ctx.tools.register(defineTool({
      name: 'task_claim',
      description: 'Claim a task: mark it "doing" and assign an owner (defaults to the calling agent). Use before starting work on it.',
      parameters: {
        id: { type: 'string', required: true, description: 'Task id to claim.' },
        owner: { type: 'string', description: 'Who claims it; defaults to the calling agent id.' },
      },
      output: { schema: taskOutputSchema, render: (_args, value) => renderTask(value) },
      async execute(args, exec) {
        const owner = args.owner ?? String(exec.agent?.id ?? 'unknown')
        const task = board.claim(args.id, owner)
        persist()
        return task
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-team-board/src/board.ts:47-78](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/board.ts#L47-L78)

状态写入和筛选不强制依赖或验收。

<details>
<summary>查看原文（32行）</summary>

```text
  create(input: CreateInput): Task {
    const now = Date.now()
    const task: Task = {
      id: this.mintId(),
      subject: input.subject,
      status: 'todo',
      ...(input.owner === undefined ? {} : { owner: input.owner }),
      deps: input.deps ?? [],
      createdAt: now,
      updatedAt: now,
    }
    this.tasks.set(task.id, task)
    return task
  }

  /** Claim a task: mark it `doing` and assign the owner. */
  claim(id: string, owner: string): Task {
    const task = this.require(id)
    return this.put({ ...task, status: 'doing', owner })
  }

  update(id: string, patch: UpdatePatch): Task {
    const task = this.require(id)
    const clean = sanitize(patch)
    return this.put({ ...task, ...clean })
  }

  list(filter?: ListFilter): Task[] {
    let out = [...this.tasks.values()]
    if (filter?.status) out = out.filter(t => t.status === filter.status)
    if (filter?.owner) out = out.filter(t => t.owner === filter.owner)
    return out.sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态从工具或界面如何写入并在重启后恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Service构造时先restore，再注册工具和HTTP路由。工具修改内存BoardStore后persist；persist先追加完整board/snapshot事件，再尝试写全量board.json。启动优先从文件数组重建，没有可用文件时尝试已有内存journal最后快照。浏览器加载时请求list，点击状态按钮POST update后refresh，创建同样POST create后读取。文件写入不是临时文件加原子替换，且异常被吞掉；内存及journal可能已有新状态而磁盘仍旧，调用方收到任务对象不代表跨重启持久成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:117-148](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L117-L148)

恢复次序和best-effort直接写文件。

<details>
<summary>查看原文（32行）</summary>

```text
  private restore(): void {
    const file = boardFile()
    if (existsSync(file)) {
      try {
        const tasks = JSON.parse(readFileSync(file, 'utf8'))
        if (Array.isArray(tasks)) this.board = new BoardStore(tasks)
      } catch { /* corrupt snapshot falls through to the journal path */ }
    }
    const existing = this.ctx.sessions.get(SessionId(BOARD_SESSION_ID))
    if (existing) {
      this.journal = existing
      if (this.board.list().length === 0) {
        for (let i = existing.events.length - 1; i >= 0; i--) {
          const event = existing.events[i]
          if (event.type === 'board/snapshot') {
            this.board = new BoardStore(event.data.tasks)
            break
          }
        }
      }
    } else {
      this.journal = this.ctx.sessions.create(SessionId(BOARD_SESSION_ID))
    }
  }

  private persist(): void {
    this.journal?.append('board/snapshot', { tasks: this.board.snapshot() })
    try {
      const file = boardFile()
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify(this.board.snapshot(), null, 2))
    } catch { /* file durability is best-effort; the journal still covers live sessions */ }
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-team-board/lib/client.js:57-95](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/lib/client.js#L57-L95)

浏览器读取和变更刷新。

<details>
<summary>查看原文（39行）</summary>

```text
      React.useEffect(() => {
        fetchJson('/team-board/list')
          .then(r => r.ok ? setTasks(r.value || []) : setTasks([]))
          .catch(() => setTasks([]))
      }, [])

      const grouped = React.useMemo(() => {
        const g = { todo: [], doing: [], done: [] }
        for (const it of tasks || []) g[it.status || 'todo'].push(it)
        return g
      }, [tasks])

      async function refresh() {
        const r = await fetchJson('/team-board/list')
        setTasks(r.ok ? (r.value || []) : [])
      }

      async function move(it, status) {
        await fetchJson('/team-board/update', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: it.id, status }) })
        await refresh()
        setBusy(undefined)
      }

      function actionFor(it) {
        const status = it.status || 'todo'
        return status === 'todo' ? { label: t('actionDo'), to: 'doing' } : status === 'doing' ? { label: t('actionDone'), to: 'done' } : { label: t('actionBack'), to: 'todo' }
      }

      async function create() {
        const subj = subject.trim()
        if (!subj) return
        setBusy('creating')
        try {
          await fetchJson('/team-board/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subject: subj }) })
          setSubject('')
          await new Promise(r => setTimeout(r, 160))
          await refresh()
          setCreating(false)
        } finally { setBusy(undefined) }
```

</details>

#### 缺口

- 没有磁盘写失败或进程中断后的恢复结果。
  **影响**：用户可能以为看板已持久化，重启后却丢失最近修改。
  **进一步探讨**：用隔离数据目录模拟写入失败和中断，核对调用响应、磁盘与重启内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么不能把认领当排他锁或通用多项目调度？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

claim只读取任务再覆盖owner和doing，不检查现有owner或版本，因此后一次认领会覆盖前一次；这是最后写入者胜出的状态编辑，不是排他认领。文件路径是DSH_HOME/team-board/board.json而非工作区或profile隔离，多个实例共用同目录时没有文件锁或事务协调。HTTP update仅校验id并透传字段，不能把TypeScript类型当运行校验。必需服务包括tools、sessions和webServer；客户端还声明旧世代runtime/UI包，实际新宿主兼容未知。只适合隔离进程里的低风险信息板，重要调度和多实例写入应暂缓。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-team-board/src/board.ts:62-71](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/board.ts#L62-L71)

认领无排他检查。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Claim a task: mark it `doing` and assign the owner. */
  claim(id: string, owner: string): Task {
    const task = this.require(id)
    return this.put({ ...task, status: 'doing', owner })
  }

  update(id: string, patch: UpdatePatch): Task {
    const task = this.require(id)
    const clean = sanitize(patch)
    return this.put({ ...task, ...clean })
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:31-34](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L31-L34)

全局HOME下的单一文件。

```text
function boardFile(): string {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'team-board', 'board.json')
}
```

**依据 3 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:79-90](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L79-L90)

必须注入webServer等服务。

<details>
<summary>查看原文（12行）</summary>

```text
export default class TeamBoardService extends Service {
  static inject = ['tools', 'sessions', 'webServer']

  private board = new BoardStore()
  private journal?: Session

  constructor(ctx: Context) {
    super(ctx, 'teamBoard')
    this.restore()
    this.registerTools()
    this.registerBoardRoutes()
    console.log(`[plugin-team-board] tools registered — task_create listed=${ctx.tools.get('task_create') !== undefined}`)
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:160-177](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L160-L177)

HTTP更新只检查id。

<details>
<summary>查看原文（18行）</summary>

```text
    this.ctx.webServer.register({
      kind: 'exact',
      path: '/team-board/update',
      handler: async (req: unknown, res: ResponseLike) => {
        const body = await this.readJsonBody(req as RequestLike)
        if (!body || typeof body.id !== 'string') {
          this.json(res, { ok: false, error: 'missing id' }, 400)
          return
        }
        const patch: Record<string, unknown> = {}
        const fields = ['subject', 'status', 'owner', 'deps'] as const
        for (const k of fields) {
          const v = (body as Record<string, unknown>)[k]
          if (v !== undefined) patch[k] = v
        }
        const task = this.board.update(body.id, patch)
        this.persist()
        this.json(res, { ok: true, value: task })
```

</details>

**依据 5 · 源码核查**：[packages/plugins/plugin-team-board/package.json:20-41](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/package.json#L20-L41)

客户端与peer依赖世代。

<details>
<summary>查看原文（22行）</summary>

```text
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6"
```

</details>

#### 缺口

- 宿主HTTP层鉴权、路由清理和本版本客户端兼容未核查。
  **影响**：不能判断暴露看板路由的访问边界或加载成功。
  **进一步探讨**：固定目标宿主核对路由认证及卸载，再做隔离profile的浏览器验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全量快照的成本如何影响使用，值得验证什么改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

每次变更追加整板快照并同步写整文件，任务越多每次写入越大；实际延迟、日志增长和最大任务量未知。首次要解决旧peer范围与客户端依赖，持续需要人工核对负责人冲突、done含义以及备份文件；失败时须比较内存、journal和磁盘，不应盲目重启。当前建议观察，重要项目继续用人工确认或已有带权限与事务的任务系统。由Q02/Q03可提出带版本的比较并交换更新、原子快照和显式持久化错误的假设；在双认领、写失败和中断轨迹下比较误报成功及恢复完整性，若仍丢状态或复杂性超过低风险看板需求则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-team-board/src/index.ts:142-148](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/index.ts#L142-L148)

每次全量快照和吞写错。

```text
  private persist(): void {
    this.journal?.append('board/snapshot', { tasks: this.board.snapshot() })
    try {
      const file = boardFile()
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify(this.board.snapshot(), null, 2))
    } catch { /* file durability is best-effort; the journal still covers live sessions */ }
```

**依据 2 · 源码核查**：[packages/plugins/plugin-team-board/src/board.ts:62-71](https://github.com/whyihaveyou/dsh-suite/blob/5649509411de7fb95c8f024e728cbf28f8ac48ac/packages/plugins/plugin-team-board/src/board.ts#L62-L71)

认领与更新缺少版本检查。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Claim a task: mark it `doing` and assign the owner. */
  claim(id: string, owner: string): Task {
    const task = this.require(id)
    return this.put({ ...task, status: 'doing', owner })
  }

  update(id: string, patch: UpdatePatch): Task {
    const task = this.require(id)
    const clean = sanitize(patch)
    return this.put({ ...task, ...clean })
```

</details>

#### 缺口

- 原子快照与版本检查方案未实现。
  **影响**：不计为现有可靠性或采用收益。
  **进一步探讨**：先做同轨迹故障对照，记录冲突可见性、恢复完整性与维护投入。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
