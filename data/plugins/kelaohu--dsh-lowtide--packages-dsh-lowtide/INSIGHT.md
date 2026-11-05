# dsh-lowtide

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e1f8efa](https://github.com/KelaoHu/dsh-lowtide/tree/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide)

<!-- BEGIN META -->
[![GitHub ★ 178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KelaoHu/dsh-lowtide) [![npm 30d 1,762](https://img.shields.io/static/v1?label=npm+30d&message=1%2C762&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lowtide) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lowtide)
<!-- END META -->

> **功能**：为 DSH 提供按时间窗口运行的任务队列、裁定界面和批次报告。

> **亮点**：[Q01](#research-q01) 把可延后任务的投递、放行、窗口执行和查收连接起来，减少用户持续等待。

> **主要限制**：[Q02](#research-q02) 重启回队可能重复已有副作用。[Q03](#research-q03) 并发预检和未定价使用量使账本不能充当硬预算。

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
  - [Q01 · 延后运行能改变哪类 DSH 工作？](#detail-section-11)
  - [Q02 · 窗口、并发和故障恢复提供怎样的保证？](#detail-section-12)
  - [Q03 · 预算与节省数字应如何解释？](#detail-section-13)
  - [Q04 · 怎样安排低风险试用和退出？](#detail-section-14)
  - [Q05 · 重启后增加待核对状态能减少重复副作用吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能等到下一窗口的开发任务可先排队，事后检查差异、生成内容和异常。

直接在 DSH 发起任务并人工等待，或自行安排定时执行及次日查收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工单队列 | 登记可延期任务并裁定 | L3 可自动进入队列 |
| 窗口批处理 | 按工作区键调度 Agent | 窗口末尾不强制中断已运行任务 |
| 批次报告 | 查收异常、结果线索与估算费用 | 需要核对工作区和账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host 与客户端 | 必需 | 挂载 Agent、HTTP 及界面 | 版本或服务不符时无法正常运行 |
| 已配置模型和独立工作区 | 运行必需 | 执行延期工单 | 模型或路径不可用会失败 |
| 独立 profile 与单写者 | 受控验收必需 | 保存队列与报告 | 共享状态可能互相覆盖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户创建隔离 profile 和可弃用工单 | 权限和模型已核对 |
| 放行 | 用户选 L1/L2 并审阅后排队 | 只允许预期工单入队 |
| 查收 | 用户查报告和工作区差异 | 完成标准由人工确认 |
| 退出 | 用户暂停自动调度并查现有会话 | 确认已运行任务的实际状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型或服务支出未知 | 设置窗口、模型、权限和测试工作区 | 依赖实际宿主版本 |
| 持续 | 真实费用未知 | 人工裁定、查收及对账 | 多轮策略和估价影响预算 |
| 失败 | 恢复资源未知 | 核对工作区与旧会话，再判断重试 | 重启可能把未结束工单回队 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 延期执行 | 入队后按窗口运行并汇总报告 | 同任务质量和用户时间 |
| 费用计算 | 使用量与价表估算，并反算峰价 | 实际账单与硬预算边界 |
| 故障回收 | 重启将执行中工单回队 | 重复副作用和人工恢复时长 |

> **思考**：[Q02](#research-q02) 重启回队可能重复已有副作用。[Q03](#research-q03) 并发预检和未定价使用量使账本不能充当硬预算。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把可延后任务的投递、放行、窗口执行和查收连接起来，减少用户持续等待。

[Q02](#research-q02) 分组保证的是同一工作区键内的串行，而非系统级文件或跨进程隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 重启回队可能重复已有副作用。[Q03](#research-q03) 并发预检和未定价使用量使账本不能充当硬预算。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先选择无敏感材料的小任务，明确使用需人工放行的档位，核对实际权限、执行差异和账单后再扩大。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认队列、批处理、状态和本地计算。真实宿主权限、账单、故障恢复与假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-lowtide/README.md、packages/dsh-lowtide/src/index.ts、packages/dsh-lowtide/client/index.tsx、packages/dsh-lowtide/src/intake.ts、packages/dsh-lowtide/src/routes.ts、packages/dsh-lowtide/src/runner.ts、packages/dsh-lowtide/src/scheduler.ts、packages/dsh-lowtide/src/store.ts、packages/dsh-lowtide/src/api-trust.ts 及固定范围 inventory；组件：packages/dsh-lowtide。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查固定子包的 Host、客户端注册、任务、调度、账本和请求围栏。未运行插件、宿主、模型、测试或核验当前价目。
- 下一步：隔离 profile 复核批准、窗口、并发、拒绝、重启、真实计费和退出。

**分析版本**

- **仓库**：[KelaoHu/dsh-lowtide](https://github.com/KelaoHu/dsh-lowtide)
- **版本号**：0.2.8（[固定提交 e1f8efa](https://github.com/KelaoHu/dsh-lowtide/tree/e1f8efa528b8e509c68e294919f6b74d0a17aaeb)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 为未确认结束的任务引入待核对和执行代次，对照重复写入与恢复成本。

隔离 profile 复核批准、窗口、并发、拒绝、重启、真实计费和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 23 | 5405 | 4136 | 927 | — |
| .tsx | source | 18 | 3539 | 2983 | 369 | — |
| .md | source | 1 | 168 | — | — | 3417 |
| .ts | test | 37 | 3811 | 2954 | 464 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KelaoHu/dsh-lowtide/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/KelaoHu/dsh-lowtide/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否把可延期、可验收的任务放到闲时运行，并可靠判断审批、工作区与费用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 延后运行能改变哪类 DSH 工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合可等到下一窗口且可事后检查的文档整理、补测试或小范围重构。用户可投递、选择自治档位，在同一界面查看队列和报告。相比一直等交互会话，插件把提交、放行、执行与查收拆开，Host 载入存储并启动调度，客户端注册 composer、队列与报告界面。L1/L2 初始待审，L3 自动进入 queued；批处理只取 queued，所以不能概括成所有工单都由人逐项批准。采样分支生成多个候选，不在代码中自动决定最优。合格结果是次日能对照原工单检查结果和工作区副作用，报告状态不能代替验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-lowtide/README.md:3-15](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/README.md#L3-L15)

作者的异步任务定位。

<details>
<summary>查看原文（13行）</summary>

```text
lowtide 是 DeepSeek Harness (dsh) 的一个插件。它解决的问题其实很自然：

通常，用户想让 Agent 干活的时候，就得坐在电脑前向它发送指令，等待回复，然后人工审核。但这种工作方式似乎忘了：用户日常有大把的空闲时间，也有避开某些模型峰谷定价的机会。

用户在白天想到什么活儿（适合进行峰谷运行的任务），可以随手扔进队列，审一眼放行；它攒到用户设定的时间（比如晚上七点以后——那会儿 DeepSeek 是低谷价）自动开跑；第二天早上用户可以打开报告，查收晚上的具体成果。

“时间就是金钱，效率就是生命”……

几个关键能力：

- **四种执行策略**：单次、迭代、采样、复核，从“一遍过”到“跑五份用户来挑”
- **168 项单元测试 + 10 个端到端 spec**
- **桌面端和网页端用的是同一份构建产物**，装一次两端通用
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/src/index.ts:19-36](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/index.ts#L19-L36)

Host 入口启动调度与路由。

<details>
<summary>查看原文（18行）</summary>

```text
export const inject = ['webServer', 'agents', 'permissionPresets', 'agentDefaultModel', 'agentPresets', 'llm', 'settings', 'workspaceRegistry', 'sessions']

export function apply(ctx: Context): void {
  const store = LowtideStore.load(stateFilePath())
  ctx.logger('lowtide').info('host half loaded (store: %d tasks, batch windows: %s)',
    store.tasks.length, batchWindowList(store.config.batch).join(', '))
  // Diagnostic: confirm workspace registry and sessions are available.
  const hasRegistry = (ctx as any).workspaceRegistry !== undefined
  const hasSessions = (ctx as any).sessions !== undefined
  ctx.logger('lowtide').info('services: workspaceRegistry=%s, sessions=%s', hasRegistry, hasSessions)

  const scheduler = startScheduler(ctx, store)
  registerRoutes(ctx, { store, scheduler })

  ctx.effect(() => () => {
    scheduler.stop()
    store.save()
  })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-lowtide/client/index.tsx:59-91](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/client/index.tsx#L59-L91)

实际注册 composer、队列和多个 overlay。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register(
    { name: 'conversation.session.header.utilities', id: 'lt-price-pill', order: 100, locale: NS },
    PricePill,
  ))

  // The select keys off the live draft (intercept-draft.ts): an empty draft
  // keeps the native bar + queue dock visible; typing claims the composer.
  ctx.slots.inject('conversation.composer', () => ctx.slots.register(
    { name: 'conversation.composer', select: selectIntercept, locale: NS },
    InterceptCard,
  ))

  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'lt-queue-dock', order: 100, locale: NS },
    QueueDock,
  ))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'lt-morning-report', order: 100, locale: NS },
    MorningReport,
  ))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'lt-confirm-gate', order: 80, locale: NS },
    ConfirmGate,
  ))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'lt-toast', order: 90 },
    LowtideToast,
  ))

  ctx.slots.inject('settings.section', () => ctx.slots.register(
```

</details>

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/intake.ts:131-157](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/intake.ts#L131-L157)

L3 初始放行与其他档位差异。

<details>
<summary>查看原文（27行）</summary>

```text
  // 自治档位(PLAN §2.3):任务级覆盖优先,否则跟随全局;L3 投递即 queued
  // (auto-l3 审计),L1/L2 落 pending-review 人工裁定。
  const autonomy = data.autonomy ?? options?.autonomy ?? 'l2'
  const autoQueued = autonomy === 'l3'
  const now = new Date().toISOString()

  const task: Task = {
    id: `lt-${randomUUID().slice(0, 8)}`,
    prompt: data.prompt,
    files,
    workspace,
    ...(ref !== null ? { gitRef: ref } : {}),
    priority: data.priority,
    ...(data.deadline !== undefined ? { deadline: data.deadline } : {}),
    permissionPreset: data.permissionPreset as PermissionPreset,
    status: autoQueued ? 'queued' : 'pending-review',
    ...(autoQueued ? { triagedAt: now, triagedBy: 'auto-l3' as const } : {}),
    ...(data.autonomy !== undefined ? { autonomy: data.autonomy } : {}),
    ...(data.model !== undefined ? { model: data.model } : {}),
    ...(data.modelProvider !== undefined ? { modelProvider: data.modelProvider } : {}),
    ...(data.continuesFromSession !== undefined ? { continuesFromSession: data.continuesFromSession } : {}),
    createdAt: now,
    strategy,
    rounds,
    ...(data.reasoning !== undefined ? { reasoning: data.reasoning } : {}),
    ...(data.strategyHint !== undefined && data.strategyHint.trim() !== '' ? { strategyHint: data.strategyHint.trim() } : {}),
    estimateYuan: priceKnown ? Number((priced.off * costFactor).toFixed(6)) : undefined,
```

</details>

**依据 5 · 源码核查**：[packages/dsh-lowtide/src/routes.ts:338-347](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/routes.ts#L338-L347)

批量放行待审任务。

<details>
<summary>查看原文（10行）</summary>

```text
        if (path === '/ds-lowtide/tasks/approve-all' && req.method === 'POST') {
          let count = 0
          for (const task of store.tasks) {
            if (task.status === 'pending-review') {
              store.setStatus(task.id, 'queued', { triagedAt: new Date().toISOString(), triagedBy: 'user' })
              count += 1
            }
          }
          void broadcastState(ctx, routes)
          reply(res, 200, { ok: true, approved: count })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:139-166](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L139-L166)

采样实际执行及中止。

<details>
<summary>查看原文（28行）</summary>

```text
  // Sampling: N independent fresh sessions; produce candidates ONLY — the
  // user picks the best the next morning (no selection turn, no synthesis).
  if (strategy === 'sampling') {
    const candidates: CandidateResult[] = []
    let totalUsage: UsageLike = { input: 0, output: 0, cacheRead: 0 }
    let lastError: string | undefined
    for (let k = 0; k < rounds; k++) {
      const res = await executeTurns(ctx, task, (index) => (index === 0 ? prompt : null), timeoutMs, reasoning, resumeSessionId)
      if (res.resumeNote !== undefined) resumeNote = res.resumeNote
      if (res.resumed) resumed = true
      if (res.forked) forked = true
      // A user hitting "stop generating" aborts the whole sampling run — no
      // point producing candidates the user walked away from.
      if (res.status === 'aborted') {
        return {
          final: 'aborted',
          elapsedMs: res.elapsedMs,
          costYuan: 0,
          peakYuan: 0,
          error: res.error ?? '用户停止了生成',
          roundsRun: k + 1,
          ...(resumeNote !== undefined ? { resumeNote } : {}),
          ...(resumed ? { resumed: true } : {}),
          ...(forked ? { forked: true } : {}),
        }
      }
      if (res.status === 'done' && res.turns.length > 0) {
        const turn = res.turns[0]
```

</details>

#### 缺口

- 没有人工值守和延后运行的同任务对照
  **影响**：无法确认查收节时或候选质量
  **进一步探讨**：同一小型任务比较等待、次日返工和验收完成率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 窗口、并发和故障恢复提供怎样的保证？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

调度器默认每 30 秒检查，paused 仅拦非强制执行。每个活动窗口的已触发标记存在内存，手动 runNow 绕过自动窗口与 pause。批次按优先级和创建时间取队列，按 task.workspace 字符串分组，组内串行、组间受配置限制。这个分组避免同一键并发，不能单独证明不同路径不会指向同一工作区。窗口末尾阻止正常批次继续启动，已运行任务没有在批循环被强制中断。预检检查记录文件哈希、工作区存在和有结果时的 HEAD；gitRef 返回 null 不拒绝。重启后 running/preflight 直接回队，并无外部副作用已提交的判定，部分修改可能保留，因此重跑前需核对工作区和会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:119-169](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L119-L169)

窗口锁、暂停与手动运行。

<details>
<summary>查看原文（51行）</summary>

```text
export function startScheduler(ctx: Context, store: LowtideStore, tickMs = 30_000): Scheduler {
  let running = false
  let startedAt: Date | null = null
  let lastWindowKey: string | null = null

  async function run(forced: boolean): Promise<void> {
    if (running) return
    if (!forced && store.config.batch.paused) return
    const now = new Date()
    const wins = batchWindowList(store.config.batch)
    const activeRange = forced ? undefined : activeWindows(now, wins, store.config.batch.tz)[0]
    if (!forced && activeRange === undefined) {
      // Outside every window: clear the once-per-window latch so the next
      // window (possibly the same day after a config change) may run again.
      if (lastWindowKey !== null) lastWindowKey = null
      return
    }
    const key = activeRange === undefined ? null : currentWindowKey(now, wins, store.config.batch.tz)
    if (!forced) {
      if (key !== null && key === lastWindowKey) return
      if (key !== null) lastWindowKey = key
      recoverDeferred(store)
      if (!hasQueuedWork(store)) return
    }
    running = true
    startedAt = new Date()
    try {
      const end = forced ? new Date(Date.now() + 24 * 3600_000) : batchWindowEnd(new Date(), wins, store.config.batch.tz)
      // The report records the window that actually triggered this batch
      // (forced manual runs label the first configured window, as before).
      await runBatch(ctx, store, end, forced, activeRange ?? wins[0])
    } catch (error) {
      ctx.logger('lowtide').warn('batch failed: %s', error instanceof Error ? error.message : String(error))
    } finally {
      running = false
      startedAt = null
    }
  }

  const timer = setInterval(() => {
    run(false).catch((error) => {
      ctx.logger('lowtide').error('scheduler tick error: %s', error instanceof Error ? error.message : String(error))
    })
  }, tickMs)

  return {
    stop() {
      clearInterval(timer)
    },
    runNow() {
      return run(true)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:306-343](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L306-L343)

预检及 HEAD 不可确认分支。

<details>
<summary>查看原文（38行）</summary>

```text
async function preflight(ctx: Context, store: LowtideStore, task: Task, windowEndAt: Date): Promise<Preflight> {
  // ① snapshot: every recorded file must still match sha256+size.
  for (const file of task.files) {
    if (!existsSync(file.path)) return { ok: false, status: 'stale', note: `文件缺失: ${file.path}` }
    if (file.sha256 !== undefined) {
      try {
        const snap = await snapshotFile(file.path)
        if (snap.sha256 !== file.sha256 || (file.size !== undefined && snap.size !== file.size)) {
          return { ok: false, status: 'stale', note: `文件已变化: ${basename(file.path)}` }
        }
      } catch (error) {
        return { ok: false, status: 'stale', note: `文件不可读: ${file.path}` }
      }
    }
  }

  // ② cwd must exist.
  if (!existsSync(task.workspace)) {
    return { ok: false, status: 'stale', note: `工作区不存在: ${task.workspace}` }
  }

  // ②b git HEAD must still match the snapshot (best-effort: a non-git
  // workspace now yields null and is treated as unchanged — the snapshot
  // only recorded a ref when one existed at intake).
  if (task.gitRef !== undefined) {
    const current = await gitRef(task.workspace)
    if (current !== null && current.sha !== task.gitRef.sha) {
      return { ok: false, status: 'stale', note: `git HEAD 已变化: ${task.gitRef.sha} → ${current.sha}` }
    }
  }

  // ③ window fit: estimated duration must fit the remaining off-peak time.
  const now = new Date()
  const remainingMs = windowEndAt.getTime() - now.getTime()
  const estMs = (task.estimateMinutes ?? 30) * 60_000
  if (remainingMs > 0 && estMs > remainingMs) {
    return { ok: false, status: 'deferred', note: `预估 ${task.estimateMinutes ?? 30}min 超出剩余窗口，顺延下一窗口` }
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:544-574](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L544-L574)

按分组键串行。

<details>
<summary>查看原文（31行）</summary>

```text
export async function scheduleGroups<T>(
  items: T[],
  keyOf: (item: T) => string,
  maxConcurrency: number,
  runOne: (item: T) => Promise<{ skipped: boolean; deferred: boolean }>,
): Promise<void> {
  // Group by key, preserving first-seen order within each group.
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    const list = groups.get(key)
    if (list === undefined) groups.set(key, [item])
    else list.push(item)
  }
  const groupLists = [...groups.values()]
  let next = 0
  async function pump(): Promise<void> {
    for (;;) {
      const index = next
      next += 1
      if (index >= groupLists.length) return
      // Serial within the group; stop launching past the window is the
      // caller's runOne concern (windowEndAt checked per task inside).
      for (const item of groupLists[index]) {
        await runOne(item)
      }
    }
  }
  const runners = Array.from({ length: Math.min(maxConcurrency, groupLists.length) }, () => pump())
  await Promise.all(runners)
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:611-635](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L611-L635)

队列、并发和窗口边界。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runBatch(ctx: Context, store: LowtideStore, windowEndAt: Date, forced = false, windowLabel?: string): Promise<MorningReport | null> {
  const startedAt = new Date()
  const queue = [...store.tasks]
    .filter((t) => t.status === 'queued')
    .sort((a, b) => a.priority - b.priority || a.createdAt.localeCompare(b.createdAt))
    .slice(0, store.config.batch.maxTasksPerNight)

  // Results are collected into a Map because scheduleGroups runs groups in
  // parallel: completion order is arbitrary. assembleReportRows() restores
  // the queue order afterwards (H-001).
  const results = new Map<string, RunTaskResult>()

  await scheduleGroups(
    queue,
    (t) => t.workspace,
    Math.min(Math.max(store.config.batch.maxConcurrency ?? 3, 1), 8),
    async (task) => {
      if (!forced && new Date().getTime() >= windowEndAt.getTime()) {
        return { skipped: true, deferred: false }
      }
      const result = await runTask(ctx, store, task, windowEndAt)
      results.set(task.id, result)
      return result
    },
  )
```

</details>

**依据 5 · 源码核查**：[packages/dsh-lowtide/src/store.ts:377-387](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/store.ts#L377-L387)

启动时回队。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Startup scan: a dead process leaves running/preflight behind — requeue them. */
  private recover(state: StoreState): StoreState {
    let changed = false
    for (const task of state.tasks) {
      if (task.status === 'running' || task.status === 'preflight') {
        task.status = 'queued'
        task.lastError = 'overdue recovery: host restarted while executing'
        changed = true
      }
    }
    return changed ? { ...state, tasks: [...state.tasks] } : state
```

</details>

#### 缺口

- 未测试重启时宿主 Agent 或文件副作用状态
  **影响**：不能给出至多一次运行或冲突率
  **进一步探讨**：隔离工作区模拟同路径别名、窗口结束与重启，查任务和差异

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算与节省数字应如何解释？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

预算是在任务预检将日账本已记金额与估算相加，估算缺失时取 0。没有为尚在执行的并发任务预留额度，多个工作区可能都通过同一额度检查，预算不是硬上限。插件从使用量和本地价表计算费用，未知价格模型在这条成本函数返回 0，因此数值不能被读作实际零费用。报告节省量取按峰时价格反算的成本减实际计算成本并下限为 0，属于插件反事实估算，不能替代 provider 账单。批窗口、模型和多轮策略会改变等待、生成次数及实际开销。作者关于峰谷收益的说法只作为设计动机，当前服务价格及真实账单不在本次源码结论中。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-lowtide/README.md:19-32](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/README.md#L19-L32)

作者列出策略对调用次数的预期。

<details>
<summary>查看原文（14行）</summary>

```text
## 四种执行方式

| 方式 | 说明 | 费用 |
|---|---|---|
| **单次** | 一次完成，等价于普通 harness 提示词+任务 | 单次 |
| **智能迭代** | 同一会话按轮执行：每轮先做**结构化维度审查**（按任务类型自动选择审查维度，输出问题清单 JSON），再**逐条修复**；无高危问题或修复无明显变化即提前结束。生成 1 轮 + 每轮审查+修复 | 约 1 + (N-1)×2 次调用 |
| **采样** | N 个独立会话（2–5 可选）各跑一遍同一指令，闲时只**生成** N 份候选结果；之后由**你**挑选最满意的一份（机器不做自动择优） | 约 N 倍 |
| **复核** | 执行一份结果后，再开一个独立会话以挑剔眼光复核，附审查意见 | 约 2 倍 |

- 新建工单时选择执行方式与轮数；迭代/采样/复核旁有 ⓘ 悬停说明。
- 新建工单时可选**运行模式**（L1 逐条确认 / L2 批次确认 / L3 全自动，按钮组，默认跟随设置页的全局自治级别、可逐任务覆盖）；每个按钮都有悬停一句话 + 选中后的详细效果说明。任务统一按「标准开发」权限档执行（投递 UI 不再暴露权限档选择）。
- 智能迭代的审查历史（每轮评分与问题清单）写入任务详情与执行报告的「审查意见」。
- 采样任务的候选在任务详情与执行报告中并列呈现（含每份花费），可点击「选这份」记录你的选择。
- 报告明示「迭代 3 轮 / 采样 3 份 / 已复核 · 实花 ¥X」。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/src/intake.ts:149-158](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/intake.ts#L149-L158)

估价可缺失。

<details>
<summary>查看原文（10行）</summary>

```text
    ...(data.model !== undefined ? { model: data.model } : {}),
    ...(data.modelProvider !== undefined ? { modelProvider: data.modelProvider } : {}),
    ...(data.continuesFromSession !== undefined ? { continuesFromSession: data.continuesFromSession } : {}),
    createdAt: now,
    strategy,
    rounds,
    ...(data.reasoning !== undefined ? { reasoning: data.reasoning } : {}),
    ...(data.strategyHint !== undefined && data.strategyHint.trim() !== '' ? { strategyHint: data.strategyHint.trim() } : {}),
    estimateYuan: priceKnown ? Number((priced.off * costFactor).toFixed(6)) : undefined,
    estimateMinutes: DEFAULT_ESTIMATE_MINUTES * costFactor,
```

</details>

**依据 3 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:71-87](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L71-L87)

使用量、价表及无价格时返回值。

<details>
<summary>查看原文（17行）</summary>

```text
function costOf(usage: UsageLike, modelId: string, windows: WindowCfg[], prices: PriceTable | undefined): number {
  // Unknown-price models (non-deepseek providers) are NOT costed — the UI
  // shows "价格未知" instead of a made-up flash-tier number. Aliases and dated
  // routes (legacy flash ids, retired V4 Pro) resolve inside the core helpers.
  const now = new Date()
  if (!hasPriceEntry(modelId, prices, now)) return 0
  return prices === undefined ? cost(usage, modelId, now, windows) : cost(usage, modelId, now, windows, prices)
}

/** Hypothetical peak-hour cost of a usage — the "what you saved" baseline.
 *  Only models with a real price entry (the official table — including legacy
 *  aliases such as deepseek-v4-flash-vision-exp — or a user price override)
 *  get a baseline; anything else yields 0 so no fake savings are reported. */
export function peakCostOf(usage: UsageLike, modelId: string, prices: PriceTable | undefined): number {
  const now = new Date()
  if (!hasPriceEntry(modelId, prices, now)) return 0
  return costAtRow(usage, tierFor(modelId, prices, now).peak)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:345-351](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L345-L351)

预算预检条件。

```text
  // ④ budget: daily cap defers the task (MVP policy; knobs land in T2.7).
  const budget = store.config.budgetDailyYuan
  if (budget > 0) {
    const spent = store.ledgerToday(now).yuan
    if (spent + (task.estimateYuan ?? 0) > budget) {
      return { ok: false, status: 'deferred', note: `今日预算将超限（已花 ¥${spent.toFixed(2)} / 上限 ¥${budget.toFixed(2)}）` }
    }
```

**依据 5 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:477-505](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L477-L505)

运行后记账和峰价差值。

<details>
<summary>查看原文（29行）</summary>

```text
  // Workspace evidence captured once, AFTER the whole strategy (the working
  // tree has evolved through all rounds).
  const diffStat = await gitDiffStat(task.workspace)
  const untracked = await gitUntrackedFiles(task.workspace)

  const run: TaskRun = {
    at: new Date().toISOString(),
    // 'aborted' is a deliberate user stop — persist it as a failed run so the
    // task/report states stay within the documented vocabulary.
    status: result.final === 'aborted' ? 'failed' : result.final,
    elapsedMs: result.elapsedMs,
    costYuan: result.costYuan,
    ...(result.usage !== undefined ? { usage: result.usage } : {}),
    diffStat,
    untracked,
    ...(result.error !== undefined ? { error: result.error } : {}),
    ...(result.assistantExcerpt !== undefined ? { assistantExcerpt: result.assistantExcerpt } : {}),
    strategy: task.strategy ?? 'single',
    roundsRun: result.roundsRun,
    ...(result.candidates !== undefined ? { candidates: result.candidates } : {}),
    ...(result.reviewExcerpt !== undefined ? { reviewExcerpt: result.reviewExcerpt } : {}),
    ...(result.resumeNote !== undefined ? { resumeNote: result.resumeNote } : {}),
    ...(result.resumed ? { resumed: true } : {}),
        ...(result.forked ? { forked: true } : {}),
  }

  store.recordRun(task.id, run, result.final === 'aborted' ? 'failed' : result.final)
  const saved = Math.max(0, result.peakYuan - result.costYuan)
  store.addSavings(saved)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:645-662](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L645-L662)

报告汇总。

<details>
<summary>查看原文（18行）</summary>

```text
  const totalCostYuan = rows.reduce((sum, row) => sum + (row.costYuan ?? 0), 0)
  const doneCount = rows.filter((r) => r.status === 'done').length
  const failCount = rows.length - doneCount
  const deferredNote = deferredCount > 0 ? ` · ${deferredCount} 顺延` : ''

  const report: MorningReport = {
    id: `rpt-${Date.now()}`,
    date: localDateKey(new Date()),
    window: windowLabel ?? store.config.batch.window,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    tasks: rows,
    totalCostYuan: Number(totalCostYuan.toFixed(4)),
    savedYuan: Number(savedTotal.toFixed(4)),
    ...(deferredCount > 0 ? { deferredCount } : {}),
    summary: `${rows.length} 项任务 · ${doneCount} 成功 ${failCount} 异常${deferredNote} · 实花 ¥${totalCostYuan.toFixed(2)}`,
  }
  store.addReport(report)
```

</details>

#### 缺口

- 未核对实收账单、并发预算竞争和价格随时间变化
  **影响**：不能确认节省比例或财务上限
  **进一步探讨**：在相同模型与使用量下对账，另外模拟并发、未知价格和窗口跨界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安排低风险试用和退出？

**研究主题**：依赖、兼容与流程、采用判断、工程质量与复用

#### 完整回答

用隔离 profile、可弃用工作区和已配置模型，验证插件包的 Host 与 Web 客户端接线、用户审批与执行的实际权限。Host 文件路径按 DSH_PROFILE 选择，只有正确配置才分别落盘，作者要求同一文件单写者。状态文件含完整提示词和路径，POSIX 权限修改只是尽力而为。路由首先检查 Host 为 loopback、阻止 cross-site 并在有 Origin 时比较回环和端口，无 Origin 也能通过这一层，因而这是请求来源围栏，不能由此推导出逐调用操作者身份。用 L1/L2 手动放行一项无敏感输入的任务，对照队列、实际权限与工作区差异，出现任务重复或目标不明就暂停自动调度并直接检查运行会话。停止 scheduler 清除 tick，未在该入口取消正在执行的批次。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-lowtide/README.md:65-80](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/README.md#L65-L80)

作者的安装与隔离声明。

<details>
<summary>查看原文（16行）</summary>

````text
## 安装（用户）

从 [GitHub Releases](https://github.com/KelaoHu/dsh-lowtide/releases/latest) 下载预构建的 `dsh-lowtide.tgz`（或在 dsh 插件市场中一键安装），无需本地构建。桌面端与网页端使用同一份产物，按需要装入对应 profile：

```powershell
# 桌面端（DSH Desktop 客户端使用的 profile）
dsh plugin --profile desktop add dsh-lowtide.tgz

# 网页端（浏览器访问的 dsh web）
dsh plugin --profile web add dsh-lowtide.tgz
dsh web
```

- 宿主区间：0.1.0-rc.7 至 0.2.1 全系（含两代引擎）。网页端需要 `@deepseek-ai/dsh` ≥ 0.1.5-rc.1（`npm i -g @deepseek-ai/dsh` 或随桌面客户端附带）；桌面端本产物已在 DSH Desktop 2.0.3（0.1.1 代引擎）、2.0.19（DSH 0.2.0-rc.2）与 DeepSeek Harness 0.2.1-rc.2 上验证。≥ 0.2.3 起同一份产物两端通吃（0.2.2 及更早版本在 CLI 0.1.5 上无法启动，见 issue #4）；0.2.5 及更早版本的 peer 上界写成了 caret（`^0.1.0-rc.7`，语义上止于 0.2.0 之前），在 DSH 0.2.0 系宿主上会被兼容门禁拒绝；0.2.7 的显式上界 `<0.2.1-0` 同样挡住了 DSH 0.2.1，0.2.8 起上界抬至 `<0.2.2-0`。
- 两个 profile 的状态文件相互独立（`DSH_PROFILE` 隔离），桌面端与网页端可并行运行。
- 状态文件：`$DSH_HOME/lowtide.json`（web 端为 `$DSH_HOME/profiles/web/lowtide.json`）。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/README.md:99-104](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/README.md#L99-L104)

单写者说明。

```text
## 数据模型

- **状态文件**：`$DSH_HOME/lowtide.json`（`$DSH_HOME` 默认 `~/.dsh`）。若进程暴露 `DSH_PROFILE` 环境变量，则按 profile 隔离为 `$DSH_HOME/profiles/<profile>/lowtide.json`，避免并行实例互相覆盖。**同一时刻只应运行一个写入该文件的实例**（dev 与 desktop profile 分属不同文件的前提是 `DSH_PROFILE` 被正确设置）。
- **任务生命周期**：`draft → pending-review → queued → preflight → running → done/failed/stale/timeout`，加 `deferred`（顺延）与 `dropped`（软删，可恢复）。

## HTTP API（前缀 `/ds-lowtide/`，同源 + loopback 信任围栏）
```

**依据 3 · 源码核查**：[packages/dsh-lowtide/src/store.ts:248-254](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/store.ts#L248-L254)

状态路径实际规则。

```text
export function stateFilePath(): string {
  const home = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  const profile = process.env.DSH_PROFILE
  return profile === undefined || profile === ''
    ? join(home, 'lowtide.json')
    : join(home, 'profiles', profile, 'lowtide.json')
}
```

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/store.ts:394-415](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/store.ts#L394-L415)

保存及权限处理。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Atomic-ish write: tmp in the same directory, then rename over.
   *  tmp is cleaned up in every path (including crashes during rename). */
  save(): void {
    const tmp = `${this.file}.tmp-${Date.now()}`
    try {
      mkdirSync(dirname(this.file), { recursive: true })
      writeFileSync(tmp, JSON.stringify(this.state, null, 2), 'utf8')
      try {
        renameSync(tmp, this.file)
      } catch {
        rmSync(this.file, { force: true })
        renameSync(tmp, this.file)
      }
      // The state file carries full task prompts and paths — keep it
      // owner-only on posix (Windows ACLs make chmod a no-op there, skip it).
      if (process.platform !== 'win32') {
        try { chmodSync(this.file, 0o600) } catch { /* best-effort */ }
      }
    } finally {
      // Always attempt to remove the tmp file — it may have been left behind
      // by a failed write or a crashed rename (second rename also failed).
      try { rmSync(tmp, { force: true }) } catch { /* absent or permission — ignore */ }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-lowtide/src/routes.ts:166-175](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/routes.ts#L166-L175)

路由先过来源围栏。

<details>
<summary>查看原文（10行）</summary>

```text
  const handler = (req: IncomingMessage, res: ServerResponse) => {
    void (async () => {
      try {
        // Host/Origin 信任围栏(PLAN B2):loopback + 同源;跨站一律 403。
        if (!isTrustedApiRequest(req.headers)) {
          reply(res, 403, { ok: false, error: '请求来源不受信任' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://127.0.0.1')
        const path = url.pathname
```

</details>

**依据 6 · 源码核查**：[packages/dsh-lowtide/src/api-trust.ts:49-67](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/api-trust.ts#L49-L67)

Origin 和 loopback 判定。

<details>
<summary>查看原文（19行）</summary>

```text
export function isTrustedApiRequest(headers: IncomingHttpHeaders): boolean {
  const host = header(headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (header(headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(headers, 'origin')
  if (origin === undefined) return true
  try {
    const originUrl = new URL(origin)
    // Loopback aliases (localhost / 127.x / [::1]) are interchangeable:
    // comparing verbatim would 403 a page served from 127.0.0.1 that talks
    // to a localhost Host (or vice versa) — same machine, same risk class.
    if (!isLoopbackHostname(originUrl.hostname)) return false
    return normalizedPort(originUrl) === normalizedPort(hostUrl)
  } catch {
    return false
  }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-lowtide/src/index.ts:19-36](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/index.ts#L19-L36)

Host 服务和卸载行为。

<details>
<summary>查看原文（18行）</summary>

```text
export const inject = ['webServer', 'agents', 'permissionPresets', 'agentDefaultModel', 'agentPresets', 'llm', 'settings', 'workspaceRegistry', 'sessions']

export function apply(ctx: Context): void {
  const store = LowtideStore.load(stateFilePath())
  ctx.logger('lowtide').info('host half loaded (store: %d tasks, batch windows: %s)',
    store.tasks.length, batchWindowList(store.config.batch).join(', '))
  // Diagnostic: confirm workspace registry and sessions are available.
  const hasRegistry = (ctx as any).workspaceRegistry !== undefined
  const hasSessions = (ctx as any).sessions !== undefined
  ctx.logger('lowtide').info('services: workspaceRegistry=%s, sessions=%s', hasRegistry, hasSessions)

  const scheduler = startScheduler(ctx, store)
  registerRoutes(ctx, { store, scheduler })

  ctx.effect(() => () => {
    scheduler.stop()
    store.save()
  })
```

</details>

**依据 8 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:158-169](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L158-L169)

停止计时器与强制入口。

<details>
<summary>查看原文（12行）</summary>

```text
  const timer = setInterval(() => {
    run(false).catch((error) => {
      ctx.logger('lowtide').error('scheduler tick error: %s', error instanceof Error ? error.message : String(error))
    })
  }, tickMs)

  return {
    stop() {
      clearInterval(timer)
    },
    runNow() {
      return run(true)
```

</details>

#### 缺口

- 未运行相应宿主版本、权限档及路由环境
  **影响**：不能保证当前宿主的实际权限、远端暴露和退出效果
  **进一步探讨**：隔离 profile 验证 HTTP 拒绝、审批、文件副作用和停止时会话状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 重启后增加待核对状态能减少重复副作用吗？

**研究主题**：新假设与验证

#### 完整回答

现有恢复将未完成任务直接回队，并以文件与 HEAD 预检发现部分漂移。可为运行中断保存执行代次、当时会话标识和最后确认的工作区证据，在无法证明上一轮已停止或未发生副作用时先进入待核对。用相同两项小任务分别在写前、写后与报告前终止 Host，对照当前回队和待核对方案的重复写入、可恢复率和人工时间。若不能减少重复写入，或大量无副作用任务因核对停滞，则放弃此改法。该机制尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-lowtide/src/store.ts:377-387](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/store.ts#L377-L387)

未完成状态启动时回队。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Startup scan: a dead process leaves running/preflight behind — requeue them. */
  private recover(state: StoreState): StoreState {
    let changed = false
    for (const task of state.tasks) {
      if (task.status === 'running' || task.status === 'preflight') {
        task.status = 'queued'
        task.lastError = 'overdue recovery: host restarted while executing'
        changed = true
      }
    }
    return changed ? { ...state, tasks: [...state.tasks] } : state
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:306-335](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L306-L335)

现有快照预检。

<details>
<summary>查看原文（30行）</summary>

```text
async function preflight(ctx: Context, store: LowtideStore, task: Task, windowEndAt: Date): Promise<Preflight> {
  // ① snapshot: every recorded file must still match sha256+size.
  for (const file of task.files) {
    if (!existsSync(file.path)) return { ok: false, status: 'stale', note: `文件缺失: ${file.path}` }
    if (file.sha256 !== undefined) {
      try {
        const snap = await snapshotFile(file.path)
        if (snap.sha256 !== file.sha256 || (file.size !== undefined && snap.size !== file.size)) {
          return { ok: false, status: 'stale', note: `文件已变化: ${basename(file.path)}` }
        }
      } catch (error) {
        return { ok: false, status: 'stale', note: `文件不可读: ${file.path}` }
      }
    }
  }

  // ② cwd must exist.
  if (!existsSync(task.workspace)) {
    return { ok: false, status: 'stale', note: `工作区不存在: ${task.workspace}` }
  }

  // ②b git HEAD must still match the snapshot (best-effort: a non-git
  // workspace now yields null and is treated as unchanged — the snapshot
  // only recorded a ref when one existed at intake).
  if (task.gitRef !== undefined) {
    const current = await gitRef(task.workspace)
    if (current !== null && current.sha !== task.gitRef.sha) {
      return { ok: false, status: 'stale', note: `git HEAD 已变化: ${task.gitRef.sha} → ${current.sha}` }
    }
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-lowtide/src/runner.ts:477-505](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/runner.ts#L477-L505)

工作区证据和运行记录在策略完成后写入。

<details>
<summary>查看原文（29行）</summary>

```text
  // Workspace evidence captured once, AFTER the whole strategy (the working
  // tree has evolved through all rounds).
  const diffStat = await gitDiffStat(task.workspace)
  const untracked = await gitUntrackedFiles(task.workspace)

  const run: TaskRun = {
    at: new Date().toISOString(),
    // 'aborted' is a deliberate user stop — persist it as a failed run so the
    // task/report states stay within the documented vocabulary.
    status: result.final === 'aborted' ? 'failed' : result.final,
    elapsedMs: result.elapsedMs,
    costYuan: result.costYuan,
    ...(result.usage !== undefined ? { usage: result.usage } : {}),
    diffStat,
    untracked,
    ...(result.error !== undefined ? { error: result.error } : {}),
    ...(result.assistantExcerpt !== undefined ? { assistantExcerpt: result.assistantExcerpt } : {}),
    strategy: task.strategy ?? 'single',
    roundsRun: result.roundsRun,
    ...(result.candidates !== undefined ? { candidates: result.candidates } : {}),
    ...(result.reviewExcerpt !== undefined ? { reviewExcerpt: result.reviewExcerpt } : {}),
    ...(result.resumeNote !== undefined ? { resumeNote: result.resumeNote } : {}),
    ...(result.resumed ? { resumed: true } : {}),
        ...(result.forked ? { forked: true } : {}),
  }

  store.recordRun(task.id, run, result.final === 'aborted' ? 'failed' : result.final)
  const saved = Math.max(0, result.peakYuan - result.costYuan)
  store.addSavings(saved)
```

</details>

#### 缺口

- 没有中断点试验或执行代次实现
  **影响**：无法判断待核对的恢复成本是否可接受
  **进一步探讨**：在隔离宿主记录重复动作、恢复时间和漏报

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
