# dsh-task-board

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：在 DeepSeek Harness 网页用看板保存任务、启动会话、查看执行记录和设置定时触发。

> **亮点**：[Q01](#research-q01) 显示，卡片保存提示并能真实调用 DSH 会话，使重复任务和会话回读可以从同一位置发起。

> **主要限制**：[Q02](#research-q02) 显示，重载时历史缺失仍可能标为成功；[Q03](#research-q03) 的定时由浏览器执行，多个标签页之间没有原子认领。

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
  - [Q01 · 一张任务卡怎样进入真实会话？](#detail-section-11)
  - [Q02 · 看板完成状态究竟能确认什么？](#detail-section-12)
  - [Q03 · 定时和持久化依赖什么，多个标签页或禁用会怎样？](#detail-section-13)
  - [Q04 · 何时值得试用，如何检验严格执行回执？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人 DSH Web 用户可以重复提交短任务，使用看板寻找同一份提示和对应执行会话。

现有方式是新建会话、复用笔记中的提示并手填结果或会话链接。看板把留存、执行和回查集中到一张卡。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 保存看板卡片 | 保存提示、描述和执行记录 | 本地存储失效时不保证跨刷新 |
| 手动执行和回读 | 提交任务并查看会话 | 工作区从宿主最近记录选择，须核对输出 |
| 页面定时 | 定时尝试执行已有任务 | 依赖浏览器页面，跨标签页可能重复 |
| 回写卡片末态 | 归档完成或失败 | 弱历史信号不能验收产物 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 有兼容客户端和设置服务的 DSH Web | 加载需要 | 显示设置卡和任务表 | 可能缺少入口或连接 |
| 宿主工作区与会话驱动 | 执行需要 | 选择会话并接收提示 | 无工作区或 driver 时执行失败 |
| 浏览器 localStorage | 跨刷新保存 | 存储提示、任务与执行记录 | 读错时为空，写错时可能仅留内存 |
| 运行中的浏览器页面 | 到期触发需要 | 周期检查并接入真实运行 | 关闭期间无触发，恢复后可能补跑 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者选隔离工作区和单标签，关闭周期 | 确认看板展示以及预期工作区 |
| 运行 | 操作者从卡片提交只读提示 | 卡片附本次会话链接 |
| 核对 | 操作者检查原会话和输出 | 确认确实符合交付条件 |
| 退出 | 状态不明时停调度并检查已启动会话 | 宿主侧确认任务状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器、宿主和模型运行资源 | 准备工作区并配置提示 | 安装用时未知 |
| 持续 | 保持页面、模型推理及会话消耗 | 确认工作区、提示及输出 | 单位任务费用与节时未知 |
| 失败恢复 | 复查可能需要重新读历史或再跑 | 复核卡片与会话，检查错跑和重复 | 实际恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 重复执行 | 任务卡驱动实际会话并记录执行 | 人工操作时间变化 |
| 过程回查 | 可以查看运行记录与会话 | 成功状态是否等于合格产物 |
| 定时运行 | 页面内检查到期并走执行路径 | 背景执行和双标签重复率 |

> **思考**：[Q02](#research-q02) 显示，重载时历史缺失仍可能标为成功；[Q03](#research-q03) 的定时由浏览器执行，多个标签页之间没有原子认领。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示，卡片保存提示并能真实调用 DSH 会话，使重复任务和会话回读可以从同一位置发起。

控制器协调任务记录、存储、执行和浏览器调度。重载可重新读取可用会话，历史失败仍可被归为成功，重要任务须独立确认产物。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示，重载时历史缺失仍可能标为成功；[Q03](#research-q03) 的定时由浏览器执行，多个标签页之间没有原子认领。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议从单标签手动只读任务开始，确认实际工作区和会话输出再收尾。需要准确后台调度或结果无法回读时，继续用原有会话和调度工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认了会话执行、重载回读与浏览器调度机制，未验证真实宿主运行和双标签效果。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/README.md、packages/dsh-task-board/package.json、packages/dsh-task-board/cordis.patch.yml、packages/dsh-task-board/tsdown.config.ts、packages/dsh-task-board/src/client/index.ts、packages/dsh-task-board/src/core/controller.ts、packages/dsh-task-board/src/core/execution.ts、packages/dsh-task-board/src/core/scheduler.ts、packages/dsh-task-board/src/core/store.ts、packages/dsh-task-board/src/client/board-mount.tsx 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定包的 DSH 接线、真实提示调用、调度与存储。未执行插件、目标任务或真实宿主。
- 下一步：在两个隔离工作区测试成功、历史不可读和双标签同一到期槽，核对实际会话、提交次数、输出及退出结果。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出用明确目标与宿主执行回执校验结案，以共享执行键对照测试重复触发。

在两个隔离工作区测试成功、历史不可读和双标签同一到期槽，核对实际会话、提交次数、输出及退出结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 295 | — | — | 4990 |
| .js | source | 1 | 140 | 104 | 19 | — |
| .ts | source | 19 | 2708 | 1693 | 807 | — |
| .tsx | source | 8 | 1160 | 924 | 169 | — |
| .ts | test | 10 | 1964 | 1664 | 146 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH Web 多次执行固定任务时，看板如何创建实际会话并回写结果，何时仍需核对运行目标及结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一张任务卡怎样进入真实会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

重复让 DSH 生成相同类型整理材料的个人操作者，可保存标题、提示和执行记录，在同一个页面找回哪次运行和对应会话。原来可以手动新建会话、粘贴固定文本，再在笔记里记录链接。看板的增量是把这些操作和状态挂在同一张卡上，宿主仍负责真正执行。合格结果至少要核对目标工作区、提示送达、对应会话及输出。

客户端把宿主 sessions、workspaces 和会话历史接口注入执行服务。点击运行先生成执行 ID，卡片改为 running 并尝试写本地存储，已 running 的同页调用拒绝重入。服务选择最近工作区，否则用列表第一项；没有可用项时报错。卡片内容没有传入工作区选择，所以任务发起时可能随最近使用记录而改变目标。取得会话驱动后尽力改标题，取已有终态计数作为基线，将非空提示或标题以 queue 模式送往 session.prompt。开始和终态事件单独回写执行记录，以便用户回原会话复核。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:108-145](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/client/index.ts#L108-L145)

将实际宿主会话、工作区、历史及本地存储接入控制器。

<details>
<summary>查看原文（38行）</summary>

```text
  const mountUi = (): void => {
    if (uiDisposer !== undefined) return
    const sessions = ctx.sessions
    const workspaces = ctx.workspaces
    const connection = ctx.get('connection') as ConnectionHandle

    // Core wiring: real runtime faces into the framework-free services.
    const store = new LocalStorageTaskStore()
    const exec = new ExecutionService({
      sessions: {
        list: sessions.list,
        binding: id => sessions.binding(id as SessionId),
      },
      workspaces: {
        list: workspaces.list,
        connectWorkspace: id => workspaces.connectWorkspace(id as WorkspaceId),
      },
      history: {
        loadTail: async sessionId => {
          const response = await connection.api.sessions.history({
            sessionId: sessionId as SessionId,
            maxMessages: 20,
          })
          return response.result.ok
            ? { events: response.result.value.events.map(entry => entry.event) }
            : undefined
        },
      },
    })
    const controller = new BoardController({
      store,
      exec,
      sessions: {
        list: sessions.list,
        open: id => sessions.open(id as SessionId),
      },
    })
    controller.start()
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/core/controller.ts:252-264](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/controller.ts#L252-L264)

创建执行、持久化与同实例重入判断。

<details>
<summary>查看原文（13行）</summary>

```text
  async runTask(id: string): Promise<boolean> {
    const task = this.tasks.find(candidate => candidate.id === id)
    if (task === undefined || task.status === 'running') return false
    const { task: next, execution } = startExecution(task, this.now(), this.uuid())
    this.tasks = this.tasks.map(candidate => candidate.id === id ? next : candidate)
    this.persistAndNotify()
    // This page owns the settlement of its own launches: the live watch
    // (ExecutionService.run) settles on the turn boundary, and list
    // reconciliation must not pre-empt it with a session that has not
    // started a turn yet (its list row is idle, not completed).
    this.activeExecutionIds.add(execution.id)
    await this.deps.exec.run(next, execution, (event) => { this.handleExecutionEvent(event) })
    return true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:104-131](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L104-L131)

实际绑定、重命名、送入队列及错误处理。

<details>
<summary>查看原文（28行）</summary>

```text
  async run(
    task: TaskRecord,
    execution: ExecutionRecord,
    onEvent: (event: ExecutionEvent) => void,
  ): Promise<void> {
    try {
      const sessionId = await this.connectSession()
      onEvent({ kind: 'started', taskId: task.id, executionId: execution.id, sessionId })
      const driver = this.driverOf(sessionId)
      if (driver === undefined) {
        onEvent({ kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'failed', error: 'execution session is not ready' })
        return
      }
      // Best-effort rename so the execution is recognizable in the session list.
      await driver.rename(task.title).catch(() => { /* rename is cosmetic */ })
      // Baseline the turn counter BEFORE the prompt round-trip: a turn that
      // completes while prompt is in flight must still advance past this
      // baseline, or the watch below would never observe it settle.
      const baseline = driver.getSnapshot().turnEnds.size
      const accepted = await this.sendPrompt(driver, task)
      if (!accepted.ok) {
        onEvent({
          kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'failed',
          error: messageOf(accepted.error),
        })
        return
      }
      this.watchForSettlement(driver, task.id, execution.id, onEvent, baseline)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:201-224](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L201-L224)

工作区和队列提示的实际输入来源。

<details>
<summary>查看原文（24行）</summary>

```text
  private async connectSession(): Promise<string> {
    const workspace = this.env.workspaces.list.getSnapshot()
    const workspaceId = workspace.recentWorkspaceId ?? workspace.items[0]?.workspaceId
    if (workspaceId === undefined) {
      throw new Error('no workspace available to run the task in')
    }
    return this.env.workspaces.connectWorkspace(workspaceId)
  }

  private driverOf(sessionId: string): SessionDriver | undefined {
    return this.env.sessions.binding(sessionId)?.session
  }

  private async sendPrompt(
    driver: SessionDriver,
    task: TaskRecord,
  ): Promise<{ ok: true } | { ok: false; error: unknown }> {
    const text = task.prompt.trim() !== '' ? task.prompt : task.title
    try {
      const result = await driver.prompt([{ type: 'text', text }], 'queue')
      return result
    } catch (error) {
      return { ok: false, error }
    }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/core/controller.ts:278-290](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/controller.ts#L278-L290)

执行 ID 对应会话写回和结果。

<details>
<summary>查看原文（13行）</summary>

```text
  private handleExecutionEvent(event: ExecutionEvent): void {
    if (event.kind === 'started') {
      this.tasks = this.tasks.map(task => task.id === event.taskId
        ? attachSessionId(task, event.executionId, event.sessionId, this.now())
        : task)
      this.persistAndNotify()
      return
    }
    this.activeExecutionIds.delete(event.executionId)
    this.tasks = this.tasks.map(task => task.id === event.taskId
      ? settleExecution(task, event.executionId, event.outcome, this.now(), event.error)
      : task)
    this.persistAndNotify()
```

</details>

#### 缺口

- 未在目标宿主核实真实工作区会话是复用空白会话还是新建。
  **影响**：不能从标题一致推定在预期工作区完成。
  **进一步探讨**：用两个无敏感工作区切换 recent，核对运行归属、提示和会话链接。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 看板完成状态究竟能确认什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

同页发送成功先表示宿主接了 queue，尚无任务结束。执行服务在送提示前读取 turnEnds.size；监听器看到 session 不再 running 且计数超过基线时，用 lastAgentError 判失败或成功。这是一条会话级完成条件，源码没有在这里检查与该卡提示对应的具体产物，也没有对提示绑定单独的 turn ID。若同一会话同时还接收独立输入，任务与某个结束轮次的对应需进一步验证。

重载后的回读较宽。会话列表未就绪时等待，已不存在才取消，仍运行则保持待定。拿到已有会话快照时用其错误字段；拿不到已打开快照时读取至多 20 条消息的历史并寻找 turn/end 的 error 类型。历史为空、读取抛错或仅出现其他终态时，代码仍可走 succeeded。由此，卡片成功只是插件的归档判断，不保证作业生成了合格文件，也不能代替宿主运行证据。任务需要交付给别人时仍须检查原会话输出、实际文件和条件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:119-131](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L119-L131)

实时基线采样在提示前，接受后注册监听。

<details>
<summary>查看原文（13行）</summary>

```text
      // Baseline the turn counter BEFORE the prompt round-trip: a turn that
      // completes while prompt is in flight must still advance past this
      // baseline, or the watch below would never observe it settle.
      const baseline = driver.getSnapshot().turnEnds.size
      const accepted = await this.sendPrompt(driver, task)
      if (!accepted.ok) {
        onEvent({
          kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'failed',
          error: messageOf(accepted.error),
        })
        return
      }
      this.watchForSettlement(driver, task.id, execution.id, onEvent, baseline)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:233-257](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L233-L257)

实时依靠会话快照与 turn 数量判定。

<details>
<summary>查看原文（25行）</summary>

```text
  private watchForSettlement(
    driver: SessionDriver,
    taskId: string,
    executionId: string,
    onEvent: (event: ExecutionEvent) => void,
    baseline: number,
  ): void {
    let settled = false
    let unsubscribe: () => void = () => {}
    const check = (): void => {
      if (settled) return
      const snapshot = driver.getSnapshot()
      if (snapshot.running || snapshot.turnEnds.size <= baseline) return
      settled = true
      unsubscribe()
      onEvent({
        kind: 'settled', taskId, executionId,
        outcome: snapshot.lastAgentError !== null ? 'failed' : 'succeeded',
        error: snapshot.lastAgentError ?? undefined,
      })
    }
    unsubscribe = driver.subscribe(check)
    // A turn can complete during the prompt round-trip (before subscribe):
    // re-check immediately so a fast turn is never missed.
    check()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:156-183](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L156-L183)

重载分别处理列表未就绪、缺失会话、活跃及历史结果。

<details>
<summary>查看原文（28行）</summary>

```text
  async reconcile(task: TaskRecord): Promise<ExecutionEvent | undefined> {
    const execution = task.executions[task.executions.length - 1]
    if (execution === undefined || execution.sessionId === undefined || execution.endedAt !== undefined) return undefined
    const list = this.env.sessions.list.getSnapshot()
    // The host list baseline has not arrived yet (page load): a session "not
    // found" now would be a false cancel. Wait for a later list change.
    if (list.phase !== 'ready') return undefined
    const summary = list.byId[execution.sessionId]
    if (summary === undefined) {
      return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'cancelled', error: 'execution session no longer exists' }
    }
    if (summary.running) return undefined
    const driver = this.driverOf(execution.sessionId)
    if (driver !== undefined) {
      const snapshot = driver.getSnapshot()
      if (snapshot.turnEnds.size > 0) {
        const outcome = snapshot.lastAgentError !== null ? 'failed' : 'succeeded'
        return {
          kind: 'settled', taskId: task.id, executionId: execution.id, outcome,
          error: snapshot.lastAgentError ?? undefined,
        }
      }
    }
    const failed = await this.historyShowsFailure(execution.sessionId)
    if (failed) {
      return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'failed', error: 'agent turn failed' }
    }
    return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'succeeded' }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:186-198](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L186-L198)

历史不可读或没有识别到错误时返回 false。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Best-effort failure probe over the raw history tail (false when unavailable). */
  private async historyShowsFailure(sessionId: string): Promise<boolean> {
    const history = this.env.history
    if (history === undefined) return false
    try {
      const tail = await history.loadTail(sessionId)
      if (tail === undefined) return false
      return tail.events.some(event => event.type === 'turn/end' && isErrorTurnEnd(event.data))
    } catch (error) {
      // A failed history read must not block settlement; fall back to success.
      console.error('[dsh-task-board] history failure probe failed', error)
      return false
    }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:83-89](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L83-L89)

错误判据仅为 reason.kind 等于 error。

```text
/** Whether a `turn/end` payload closed the turn with an error reason. */
function isErrorTurnEnd(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const reason = (data as { reason?: unknown }).reason
  return typeof reason === 'object' && reason !== null
    && (reason as { kind?: unknown }).kind === 'error'
}
```

**依据 6 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:125-134](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/client/index.ts#L125-L134)

真实历史接口请求最多 20 条消息。

<details>
<summary>查看原文（10行）</summary>

```text
      history: {
        loadTail: async sessionId => {
          const response = await connection.api.sessions.history({
            sessionId: sessionId as SessionId,
            maxMessages: 20,
          })
          return response.result.ok
            ? { events: response.result.value.events.map(entry => entry.event) }
            : undefined
        },
```

</details>

#### 缺口

- 未实测提示未出队、失败历史不全或同时执行另一轮时的落卡。
  **影响**：主任务失败可能在弱兜底路径上被标为成功，实际发生率未知。
  **进一步探讨**：安排明确可核验成功和已知错误的会话，重载时分别提供完整、缺失和不可读历史。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 定时和持久化依赖什么，多个标签页或禁用会怎样？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

调度器挂在每个浏览器客户端，依赖会话列表基线。启用会立即检查，之后约每 60 秒及可见性事件时再查；页面未运行时没有该定时器。它从逾期时刻计算下一次，而非从现在跳到最近时间，因此关闭页面错过多个周期后，重开可在后续 tick 继续补执行旧时段。调度器等待 runTask；同页控制器在开始时已将任务置为 running。执行服务报告失败后 runTask 仍可能返回 true，因为 true 表示该任务进入执行路径，调度便会进位，不代表 DSH 成功完成。

任务定义、提示与执行记录用 localStorage 写整份账本。同源的另一个页面收到 storage 事件时重新读取，读失败退回空，写失败仅记日志且仍保留内存状态。它能传播已经写入的状态；触发模块只检查本页内存和到期条件，没有在两标签之间设置原子认领。相近时间启动的两个页面若都读到尚待运行的状态，存在重复提交的竞争窗口，尚未实测。启用需要宿主客户端服务、工作区与同源存储；DOM 挂载点找不到还可能看不到面板。

禁用会卸载面板、调度器及控制器监听。删除卡片只更新浏览器账本，禁用或删除都没有调用宿主取消已发送会话。自动执行需要用户自己保持浏览器、管理重复或错过的任务和复核结果，节省的操作与额外恢复时间还没有测量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/client/index.ts:147-178](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/client/index.ts#L147-L178)

浏览器调度器的页面就绪绑定及人工退出清理。

<details>
<summary>查看原文（32行）</summary>

```text
    // Scheduled runs: a browser-side heartbeat that triggers due tasks through
    // the same run path as the manual Run button. The first tick is gated on
    // the session list baseline so a page-load catch-up never fires into a
    // not-yet-ready runtime; tab visibility recovery ticks immediately.
    const scheduler = new SchedulerService({
      tasks: () => controller.getSnapshot().tasks,
      now: () => Date.now(),
      runTask: id => controller.runTask(id),
      applySchedule: (id, nextRunAt, lastTriggeredAt) =>
        controller.applyScheduleNextRun(id, nextRunAt, lastTriggeredAt),
      ready: () => sessions.list.getSnapshot().phase === 'ready',
      environment: {
        addEventListener: (type, listener) => document.addEventListener(type, listener),
        removeEventListener: (type, listener) => document.removeEventListener(type, listener),
      },
    })
    scheduler.start()

    const disposers: Array<() => void> = []
    try {
      disposers.push(mountSidebarEntry(controller))
      disposers.push(mountBoard(controller))
    } catch (error) {
      // DOM failures degrade the board, never the GUI.
      console.error('[dsh-task-board] mount failed:', error)
    }

    uiDisposer = () => {
      for (const dispose of disposers.splice(0)) dispose()
      scheduler.dispose()
      controller.dispose()
      uiDisposer = undefined
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/core/scheduler.ts:63-79](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/scheduler.ts#L63-L79)

页面内启动、默认节拍及可见性回调。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Start ticking: one immediate check (catch-up after reload) + the interval.
   * Single-instance: a second start while already armed is a no-op, so a
   * re-entrant mount can never stack a duplicate timer.
   */
  start(): void {
    if (this.disposed) return
    if (this.started) return
    this.started = true
    // Immediate catch-up tick: schedules whose due instant passed while the
    // tab was closed are triggered as soon as the runtime is ready.
    this.tick()
    this.timer = setInterval(() => { this.tick() }, this.deps.tickMs ?? 60_000)
    if (this.deps.environment !== undefined) {
      this.environmentListener = () => { this.tick() }
      this.deps.environment.addEventListener('visibilitychange', this.environmentListener)
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/core/scheduler.ts:112-133](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/scheduler.ts#L112-L133)

任务进位从原到期点算，等到 runTask 返回 true 后写。

<details>
<summary>查看原文（22行）</summary>

```text
  async tick(): Promise<void> {
    if (this.disposed) return
    if (this.deps.ready !== undefined && !this.deps.ready()) return
    const now = this.deps.now()
    for (const task of this.deps.tasks()) {
      const schedule = task.schedule
      if (schedule === undefined || !schedule.enabled) continue
      if (schedule.nextRunAt === undefined) {
        // Missing next-run instant (repaired/legacy data): recompute from the
        // cron expression and wait; an unparseable expression is skipped.
        const repaired = nextRunAtMs(schedule.cron, now)
        if (repaired === undefined) continue
        this.deps.applySchedule(task.id, repaired, undefined)
        continue
      }
      if (schedule.nextRunAt > now) continue
      // Advance from the due instant (not this tick's wall-clock) and only
      // after the run is accepted: a rejected run keeps its due slot.
      const next = nextRunAtMs(schedule.cron, schedule.nextRunAt)
      const accepted = await this.deps.runTask(task.id)
      if (accepted) this.deps.applySchedule(task.id, next, now)
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/core/controller.ts:252-264](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/controller.ts#L252-L264)

同页拒绝重入，运行返回值表示接纳到执行路径。

<details>
<summary>查看原文（13行）</summary>

```text
  async runTask(id: string): Promise<boolean> {
    const task = this.tasks.find(candidate => candidate.id === id)
    if (task === undefined || task.status === 'running') return false
    const { task: next, execution } = startExecution(task, this.now(), this.uuid())
    this.tasks = this.tasks.map(candidate => candidate.id === id ? next : candidate)
    this.persistAndNotify()
    // This page owns the settlement of its own launches: the live watch
    // (ExecutionService.run) settles on the turn boundary, and list
    // reconciliation must not pre-empt it with a session that has not
    // started a turn yet (its list row is idle, not completed).
    this.activeExecutionIds.add(execution.id)
    await this.deps.exec.run(next, execution, (event) => { this.handleExecutionEvent(event) })
    return true
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/core/controller.ts:101-126](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/controller.ts#L101-L126)

跨页只重新读取，销毁控制器只处理监听器。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Load the persisted ledger and start the navigation/status subscriptions. */
  start(): void {
    this.tasks = this.deps.store.load()
    void this.reconcileRunningTasks()
    // A sibling tab may have edited or deleted the ledger (same origin,
    // storage events). Reload on external change so a task deleted in
    // another tab stops firing here — and is never written back by this
    // tab's stale copy (scheduler roll-forward, execution settlement).
    const unsubscribeExternal = this.deps.store.subscribeExternal?.(() => {
      this.tasks = this.deps.store.load()
      this.notify()
    })
    if (unsubscribeExternal !== undefined) this.disposers.push(unsubscribeExternal)
    this.disposers.push(this.deps.sessions.list.subscribe(() => {
      this.onSessionsChanged()
    }))
    this.notify()
  }

  /** Stop all subscriptions and drop retained state (idempotent). */
  dispose(): void {
    for (const dispose of this.disposers.splice(0)) dispose()
    this.listeners.clear()
    if (this.reconcileTimer !== undefined) clearTimeout(this.reconcileTimer)
    this.reconcileTimer = undefined
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/core/controller.ts:199-204](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/controller.ts#L199-L204)

删除仅修改任务和选中项。

```text
  deleteTask(id: string): void {
    const { tasks, selectionCleared } = applyDeleteTask(this.tasks, this.selectedTaskId, id)
    this.tasks = [...tasks]
    if (selectionCleared) this.selectedTaskId = undefined
    this.persistAndNotify()
  }
```

**依据 7 · 源码核查**：[packages/dsh-task-board/src/core/store.ts:153-180](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/store.ts#L153-L180)

默认浏览器 localStorage，整文档保存，失败不反向取消运行。

<details>
<summary>查看原文（28行）</summary>

```text
  constructor(
    private readonly key: string = DEFAULT_STORAGE_KEY,
    private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | undefined = globalThis.localStorage,
    private readonly events: StorageEvents | undefined = typeof (globalThis as { addEventListener?: unknown }).addEventListener === 'function'
      ? (globalThis as unknown as StorageEvents)
      : undefined,
  ) {}

  load(): TaskRecord[] {
    if (this.storage === undefined) return []
    try {
      return parseLedger(this.storage.getItem(this.key))
    } catch (error) {
      // Storage read failures (private mode, quota) degrade to an empty ledger,
      // never break the board.
      console.error('[dsh-task-board] task ledger read failed; starting empty', error)
      return []
    }
  }

  save(tasks: readonly TaskRecord[]): void {
    if (this.storage === undefined) return
    try {
      this.storage.setItem(this.key, JSON.stringify(tasks))
    } catch (error) {
      // Write failures only skip persistence; in-memory state stays live.
      console.error('[dsh-task-board] task ledger write failed (persistence skipped)', error)
    }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-task-board/src/core/store.ts:198-205](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/store.ts#L198-L205)

跨页事件的实际通知实现。

```text
  subscribeExternal(listener: () => void): () => void {
    if (this.events === undefined) return () => {}
    const onStorage = (event: StorageChangeEvent): void => {
      if (event.key !== null && event.key !== this.key) return
      listener()
    }
    this.events.addEventListener('storage', onStorage)
    return () => { this.events?.removeEventListener('storage', onStorage) }
```

**依据 9 · 源码核查**：[packages/dsh-task-board/src/client/board-mount.tsx:33-51](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/client/board-mount.tsx#L33-L51)

中栏通过宿主 DOM 选择器挂载，缺失时退出。

<details>
<summary>查看原文（19行）</summary>

```text
  return document.querySelector<HTMLElement>(CONVERSATION_COLUMN_SELECTOR) ?? undefined
}

/**
 * Mount the board React tree into the center column and bind its visibility
 * to the controller's boardOpen state.
 * @param controller - the board controller driving the view.
 * @returns disposer unmounting the tree and restoring the column.
 */
export function mountBoard(controller: BoardController): () => void {
  let root: Root | undefined
  let container: HTMLDivElement | undefined

  const ensure = (): void => {
    if (container !== undefined) return
    const column = conversationColumn()
    if (column === undefined) return
    container = document.createElement('div')
    container.dataset.dshTaskboardView = ''
```

</details>

#### 缺口

- 未复现两个标签页同时准备执行以及浏览器后台节流。
  **影响**：无法承诺每个周期恰好运行一次，也无法判断实际补跑耗时。
  **进一步探讨**：使用低风险提示在双标签页、断开浏览器和恢复之后对比提交次数与下一次到期时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，如何检验严格执行回执？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

需要重复使用相同提示的个人 DSH Web 用户，可用单标签、隔离工作区和手动启动试一个只读任务，先关闭周期触发。与手工粘贴和记会话链接相比，任务卡能复用文本和追踪运行；只有原会话的输出符合预定条件才算成功。切换工作区、缺历史、重载后状态不一致或无法确认已停止时先禁用调度，回到宿主会话查看及处理现有任务。首次成本是配置环境及核对工作区，持续成本是检查末态、页面托管及单独保存重要提示。任务须在浏览器关闭时可靠执行的人，应继续用已有独立调度工具。

现有重载成功兜底和缺少全局认领，给出可验证方案。为每次运行登记明确工作区、宿主确认的 turn ID 与已检查的产物，历史失联保留待核状态；对到期任务由共同运行端使用同一个执行键。用现版和对照版分别测试历史丢失、实际成功与双标签抢同一时段。如果错计成功和重复执行没有减少，或者正常任务的验收耗时比手工记录更长，则无法支持把这些机制作为采用优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:156-183](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L156-L183)

重载 fallback 为对照组，终态不足时也可能判成功。

<details>
<summary>查看原文（28行）</summary>

```text
  async reconcile(task: TaskRecord): Promise<ExecutionEvent | undefined> {
    const execution = task.executions[task.executions.length - 1]
    if (execution === undefined || execution.sessionId === undefined || execution.endedAt !== undefined) return undefined
    const list = this.env.sessions.list.getSnapshot()
    // The host list baseline has not arrived yet (page load): a session "not
    // found" now would be a false cancel. Wait for a later list change.
    if (list.phase !== 'ready') return undefined
    const summary = list.byId[execution.sessionId]
    if (summary === undefined) {
      return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'cancelled', error: 'execution session no longer exists' }
    }
    if (summary.running) return undefined
    const driver = this.driverOf(execution.sessionId)
    if (driver !== undefined) {
      const snapshot = driver.getSnapshot()
      if (snapshot.turnEnds.size > 0) {
        const outcome = snapshot.lastAgentError !== null ? 'failed' : 'succeeded'
        return {
          kind: 'settled', taskId: task.id, executionId: execution.id, outcome,
          error: snapshot.lastAgentError ?? undefined,
        }
      }
    }
    const failed = await this.historyShowsFailure(execution.sessionId)
    if (failed) {
      return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'failed', error: 'agent turn failed' }
    }
    return { kind: 'settled', taskId: task.id, executionId: execution.id, outcome: 'succeeded' }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/core/execution.ts:201-208](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/execution.ts#L201-L208)

工作区选择为待确认字段。

```text
  private async connectSession(): Promise<string> {
    const workspace = this.env.workspaces.list.getSnapshot()
    const workspaceId = workspace.recentWorkspaceId ?? workspace.items[0]?.workspaceId
    if (workspaceId === undefined) {
      throw new Error('no workspace available to run the task in')
    }
    return this.env.workspaces.connectWorkspace(workspaceId)
  }
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/core/scheduler.ts:112-133](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/src/core/scheduler.ts#L112-L133)

到期触发和浏览器侧写入可定义竞态对照。

<details>
<summary>查看原文（22行）</summary>

```text
  async tick(): Promise<void> {
    if (this.disposed) return
    if (this.deps.ready !== undefined && !this.deps.ready()) return
    const now = this.deps.now()
    for (const task of this.deps.tasks()) {
      const schedule = task.schedule
      if (schedule === undefined || !schedule.enabled) continue
      if (schedule.nextRunAt === undefined) {
        // Missing next-run instant (repaired/legacy data): recompute from the
        // cron expression and wait; an unparseable expression is skipped.
        const repaired = nextRunAtMs(schedule.cron, now)
        if (repaired === undefined) continue
        this.deps.applySchedule(task.id, repaired, undefined)
        continue
      }
      if (schedule.nextRunAt > now) continue
      // Advance from the due instant (not this tick's wall-clock) and only
      // after the run is accepted: a rejected run keeps its due slot.
      const next = nextRunAtMs(schedule.cron, schedule.nextRunAt)
      const accepted = await this.deps.runTask(task.id)
      if (accepted) this.deps.applySchedule(task.id, next, now)
    }
```

</details>

**依据 4 · 作者声明**：[packages/dsh-task-board/README.md:13-19](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-task-board/README.md#L13-L19)

作者宣称会话入口与定时，用作操作目标。

```text
- **Sidebar entry**: injects a "任务看板" (task board) entry row inside the sidebar column (`[data-pane="sidebar"]` on older shells, `[class*="sidebarCol"]` on the DSH 0.1.0-rc.6 AppFrame layout) below the new-session button (wide rail shows icon + text, collapsed rail shows a bare icon, adapting to DSH skin tokens).
- **Multi-column board**: five columns — 待规划 (to plan) / 待办 (to do) / 进行中 (in progress) / 已完成 (done) / 已失败 (failed); cards show title, description, status, update time, and execution count; the top supports search filter, new task, and back to chat.
- **Task details**: click a card to open details (title/description/execution prompt/execution log) — it does **not** execute on a single click; the details offer "执行 / 重新执行" (Run / Re-run), "删除" (Delete, with confirm), "查看会话" (View session, jumps to the execution transcript), and a manual move to 待规划/待办.
- **Real execution**: on "执行" (Run), the plugin connects a workspace session through the client runtime (`workspaces.connectWorkspace`, reusing a blank session or letting the host create one), names the session after the task title, and drives a real agent via `session.prompt([{ type: 'text', text }], 'queue')`; it then subscribes to that session's snapshot and, once the round really finishes, sets the card to 已完成/已失败 and records the execution result. The execution session appears in the session list and can be opened to view the real transcript.
- **Status write-back**: card status (进行中 → 完成/失败) is driven by the real session state; after a page refresh/restart, leftover running tasks are auto-reconciled against the current session state (reconcile).
- **Scheduled tasks**: the details panel can schedule a task — an enable switch + a 5-field cron expression (分 时 日 月 周, supporting `*` / `*/n` / `a-b` / comma lists) + common presets (daily 09:00, every hour, every 10 minutes, Mondays 09:00); enabling computes and persists the "下次运行时间" (next run time), and the card shows a scheduled marker; at the due time it automatically takes the same real-execution path (as manual run), and the execution session remains linkable.
- **System-prompt injection**: the host half (`src/index.ts`) registers a `plugin:task-board` section (order 200) via `SystemPrompt.section`, declaring this plugin's existence, capabilities, and limits to every agent — it is injected when the plugin is in the composition (after mount + DSH restart) and disappears when removed (after unmount + restart), so an agent needs no external docs to know how to work with this board.
```

#### 缺口

- 并未实现或运行带执行键和绑定回执的对照版。
  **影响**：不能量化错误终态或总体节省。
  **进一步探讨**：用同一批短只读任务记录完成率、重放次数、人工核验时间及误判。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
