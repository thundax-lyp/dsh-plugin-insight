# dsh_workflow

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[44b83c1](https://github.com/omdsh-dev/dsh_workflow/tree/44b83c182aa02d1be8a0803e8446cb495f93cd8f)

<!-- BEGIN META -->
[![GitHub ★ 153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh_workflow)
<!-- END META -->

> **功能**：在 DSH 中创建、保存和运行可复用的多 Agent 工作流，并保留运行证据。

> **亮点**：[Q01](#research-q01) 将流程定义、运行图与产物独立保存，支持按名称复用和回查。

> **主要限制**：[Q02](#research-q02) 取消是协作式，缓存命中不保证外部状态一致或副作用幂等。

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
  - [Q01 · 具名流程相比一次性子 Agent 调度改变了什么？](#detail-section-11)
  - [Q02 · 脚本约束、取消和恢复分别能保证什么？](#detail-section-12)
  - [Q03 · 怎样评估复用及避免把旧证据用于新状态？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队重复执行可检查的取证、复核或交付流程。

使用原生子 Agent 工具并在每次会话重新描述过程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 流程运行 | 复用具名多 Agent 步骤 | 依赖 DSH provider 与权限 |
| 快照与恢复 | 回查结果和续跑 | 缓存与外部状态需独立验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 subagents/tools | 必需 | 启动流程和子任务 | 服务缺失时无法运行 |
| 审批服务 | 要求审批时必需 | 批准受限或本地运行 | 缺服务时失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定测试 profile 和只读流程 | 确认 provider、权限和输入 |
| 执行 | 用户运行并查事件和结果 | 核对真实产物和预算 |
| 退出 | 用户回原生调度 | 停止前确认已接受的动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型支出未知 | 编写或核对流程定义 | 需配置宿主和 provider |
| 持续 | 运行成本未知 | 复核运行事件和缓存 | 外部状态变化需核对 |
| 失败 | 恢复时间未知 | 检查事件、子任务和原件 | 不可把超时当作停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 流程复用 | 具名运行和持久证据 | 节时与跨项目效果 |
| 恢复 | 快照和合格结果缓存 | 外部副作用与重启语义 |

> **思考**：[Q02](#research-q02) 取消是协作式，缓存命中不保证外部状态一致或副作用幂等。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将流程定义、运行图与产物独立保存，支持按名称复用和回查。

[Q02](#research-q02) VM 限额与宿主调度取消属于不同边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 取消是协作式，缓存命中不保证外部状态一致或副作用幂等。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在只读任务对照一次重复运行和一次恢复，核对真实事件与结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认流程、受限运行时与缓存路径；真实宿主、隔离和恢复待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/store.ts、src/runtime.ts、src/service.ts、src/engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查入口、受限运行、存储和预算。未运行目标、真实 DSH 或模型。
- 下一步：检查审批拒绝、超时收尾、缓存失效、工作区变更与真实结果。

**分析版本**

- **仓库**：[omdsh-dev/dsh_workflow](https://github.com/omdsh-dev/dsh_workflow)
- **版本号**：0.1.2（[固定提交 44b83c1](https://github.com/omdsh-dev/dsh_workflow/tree/44b83c182aa02d1be8a0803e8446cb495f93cd8f)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 将可核对的外部状态纳入恢复验收，比较错误复用与执行开销。

检查审批拒绝、超时收尾、缓存失效、工作区变更与真实结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 787 | — | — | 8930 |
| .js | source | 12 | 4997 | 4961 | 38 | — |
| .mjs | source | 2 | 80 | 68 | 0 | — |
| .ts | source | 13 | 5485 | 5089 | 55 | — |
| .ts | test | 11 | 2609 | 2404 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/omdsh-dev/dsh_workflow/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 团队能否把重复多 Agent 操作保存为可审计流程，并确认恢复使用的证据仍有效？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 具名流程相比一次性子 Agent 调度改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

团队可将经常重复的复核或并行取证保存为具名流程，选择输入再次启动，并查询运行状态、事件和产物。相较每次重新提示并行步骤，插件提供持久流程和回查路径；底层执行仍依赖宿主 subagents。Host 挂 DynamicWorkflowService 并注册工具及命令，run 文件与事件分别落盘。合格结果应能从产物和子任务回查流程结论，状态成功本身不能代表内容正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-38](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/README.md#L22-L38)

作者给出的原生调度比较。

<details>
<summary>查看原文（17行）</summary>

```text
`@dsh-external/workflow` 是一个官方 bundle 形态、零核心 patch 的 DSH 插件。它完整参考 KodaX 的 workflow 设计能力，并针对 DSH 的 Cordis、`ctx.subagents`、Session、后台 jobs、审批、命令和工具机制做独立实现。

它不替换 DSH 已有的前台 `workflow` 工具。原生工具适合“这一次把若干工作并行跑完”；本插件负责更高一层的流程产品能力：命名、发现、生成、复用、暂停/恢复、重跑/续跑、持久证据、成本记录和治理。

## 它为 DSH 带来什么

DSH 已经有很强的 Harness 基础设施：模型路由、子 Agent provider、工具权限、审批、Session 日志、后台 jobs 与 UI 事件。但仅有这些“执行原语”，团队仍需在每次会话里重新描述如何拆解、并发、验证和汇总。

| 只有一次性调度时 | 安装 DSH Workflow 后 |
| --- | --- |
| 每轮重新提示如何拆任务，策略难复用 | 保存为项目或个人 workflow，按名字运行 |
| 并行结果散落在会话里 | run graph、事件、artifact、结果摘要和成本永久落盘 |
| 中断后通常从头重来 | 按 run snapshot 重跑，或用 effect cache 续跑未完成部分 |
| provider/模型/并发/预算靠提示词约束 | manifest + preflight + 运行时硬限制 |
| 生成的脚本容易越权或不可复现 | capability-only VM、JSON 边界、确定性 guard、审批分级 |
| 复杂流程只有作者自己知道怎么用 | capsule 自带 intent、inputs、requirements、provenance |
| 多 Agent 是一次性技巧 | 多 Agent 变成可审计、可分享、可演进的工程资产 |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:634-656](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/index.ts#L634-L656)

运行查询与控制工具。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.tools.register(defineTool({
    name: resolved.manageToolName,
    description: 'Inspect and control durable workflow processes: runs/show/pause/resume/stop/rerun/resume-run/save/rename-run/rename-saved/revise/delete-run/delete-saved/prune.',
    parameters: {
      action: { type: 'string', required: true, enum: ['runs', 'show', 'pause', 'resume', 'stop', 'rerun', 'resume-run', 'save', 'rename-run', 'rename-saved', 'revise', 'delete-run', 'delete-saved', 'prune'] },
      target: { type: 'string' }, name: { type: 'string' }, value: { type: 'string' }, args: { type: 'json' }, wait: { type: 'boolean' },
      scope: { type: 'string', enum: ['project', 'personal'] }, force: { type: 'boolean' }, dry_run: { type: 'boolean' }, keep: { type: 'integer' }, older_than_days: { type: 'integer' }, background: { type: 'boolean' },
    },
    output: { schema: { type: 'json' }, render: (_args, value) => render(value) },
    async execute(args, exec) {
      const agent = requireAgent(exec.agent)
      const target = args.target ?? ''
      switch (args.action) {
        case 'runs': return JSON.parse(JSON.stringify(service.runs(agent))) as never
        case 'show': return JSON.parse(JSON.stringify(service.show(agent, target) ?? null)) as never
        case 'pause': return { accepted: service.pause(agent, target) } as never
        case 'resume': return { accepted: service.resume(agent, target) } as never
        case 'stop': return { accepted: service.stop(agent, target, args.value) } as never
        case 'rerun':
        case 'resume-run': {
          const run = await service.rerun(agent, target, args.args, exec.signal, args.action === 'resume-run')
          return await runResult(service, agent, run, args.wait === true || args.background === false) as never
        }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:683-698](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/index.ts#L683-L698)

服务实际挂载。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  const approval = ctx.get('approval') as ApprovalService | undefined
  const jobs = ctx.get('jobs') as JobRegistry | undefined
  const userQuestions = ctx.get('userQuestions') as UserQuestionService | undefined
  ctx.plugin(DynamicWorkflowService, {
    config: resolved,
    subagents: ctx.subagents,
    ...(approval === undefined ? {} : { approval }),
    ...(jobs === undefined ? {} : { jobs }),
    ...(userQuestions === undefined ? {} : { userQuestions }),
  })
  ctx.inject(['dynamicWorkflows'], child => installSurfaces(child, resolved))
}

export default { name, inject, Config, apply }
```

</details>

**依据 4 · 源码核查**：[src/store.ts:90-115](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/store.ts#L90-L115)

事件、产物和快照。

<details>
<summary>查看原文（26行）</summary>

```text
    mkdirSync(join(runDir, 'results'), { recursive: true })
    let sequence = 0
    const artifactNames = new Set<string>()
    const events = join(runDir, 'events.jsonl')
    const cachePath = (key: string): string => join(runDir, 'results', `${safePart(key, 'cache key')}.json`)
    return {
      runId,
      runDir,
      append: (type, data) => {
        const event: WorkflowEvent = { seq: sequence++, time: this.now(), type, data }
        appendFileSync(events, `${JSON.stringify(event)}\n`, 'utf8')
        return event
      },
      artifact: (name, value) => {
        if (artifactNames.has(name)) throw new Error(`workflow artifact "${name}" was already written`)
        const path = join(runDir, 'artifacts', artifactFilename(name))
        writeFileSync(path, json(value), { encoding: 'utf8', flag: 'wx' })
        artifactNames.add(name)
        return { name, path }
      },
      snapshotScript: (capsule) => {
        writeFileSync(join(runDir, 'workflow.workflow.json'), json(capsule), 'utf8')
        writeFileSync(join(runDir, 'script.js'), `${capsule.source}\n`, 'utf8')
        writeFileSync(join(runDir, 'manifest.json'), json(capsule.manifest), 'utf8')
      },
      writeSnapshot: snapshot => writeFileSync(join(runDir, 'run.json'), json(snapshot), 'utf8'),
```

</details>

#### 缺口

- 未测长期复用与维护收益
  **影响**：不能量化较一次性调度的节省
  **进一步探讨**：用同一个复核流程重复两次比较编写和复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 脚本约束、取消和恢复分别能保证什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

受限脚本经来源校验、QuickJS 运行时限内存和栈，并通过代理 API 和 JSON 边界操作。宿主桥接的取消是协作式，wall timeout 后仍 await 已接受的 host dispatches，不等于硬终止。trusted-local 路径由服务请求批准，执行语义明确有宿主权限，不能和 QuickJS 路径混写。resume-run 可从已有脚本快照重启并尝试缓存命中，缓存复用先前已完成、无验证告警的任务，不能据此推导外部写入是幂等或进程恢复不重做。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:260-283](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/runtime.ts#L260-L283)

QuickJS 限额与调用。

<details>
<summary>查看原文（24行）</summary>

```text
export async function runRestrictedWorkflowScript(options: RestrictedWorkflowRunOptions): Promise<unknown> {
  validateRestrictedWorkflowSource(options.source, options.filename)
  assertRestrictedWorkflowQuality(options.source)
  const api = proxyApi(options.wf, options.args)
  const args = jsonClone(options.args, 'workflow args', true)
  const QuickJS = await getQuickJS()
  const runtime = QuickJS.newRuntime()
  runtime.setMemoryLimit(64 * 1024 * 1024)
  runtime.setMaxStackSize(1024 * 1024)
  let executionDeadline = Date.now() + options.syncTimeoutMs
  runtime.setInterruptHandler(() => Date.now() > executionDeadline)
  const vm = runtime.newContext()
  const pending = new Set<QuickJSDeferredPromise>()
  const hostDispatches = new Set<Promise<void>>()
  let closed = false
  let timedOut = false
  let timer: NodeJS.Timeout | undefined

  const pump = (): void => {
    if (closed || !runtime.alive) return
    executionDeadline = Date.now() + options.syncTimeoutMs
    const outcome = runtime.executePendingJobs()
    if (outcome.error !== undefined) outcome.error.dispose()
  }
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:449-477](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/runtime.ts#L449-L477)

超时和协作式宿主收尾。

<details>
<summary>查看原文（29行）</summary>

```text
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        timedOut = true
        closed = true
        options.onTimeout?.()
        reject(new WorkflowScriptError(`workflow script timed out after ${options.wallTimeoutMs}ms`, { fatal: true }))
      }, options.wallTimeoutMs)
      timer.unref()
    })
    let outcome: Awaited<typeof resolved> | undefined
    let outcomeError: unknown
    try {
      outcome = await Promise.race([resolved, timeout])
    } catch (error) {
      outcomeError = error
    }
    closed = true
    try {
      // Keep the wall deadline active while draining fire-and-forget RPCs. If
      // it expires, onTimeout gets the first chance to cancel the owner work.
      await Promise.race([quiesceHostDispatches(), timeout])
    } catch (error) {
      if (timedOut || outcomeError === undefined) outcomeError = error
    }
    // Cancellation is cooperative at the WorkflowApi boundary. Even after the
    // deadline, do not tear down or return while accepted host work is alive.
    await quiesceHostDispatches()
    if (timer !== undefined) clearTimeout(timer)
    if (outcomeError !== undefined) throw outcomeError
```

</details>

**依据 3 · 源码核查**：[src/service.ts:188-209](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/service.ts#L188-L209)

可信本地和快照路径。

<details>
<summary>查看原文（22行）</summary>

```text
  async rerun(agent: Agent, target: string, args: unknown, signal?: AbortSignal, resume = false, approvalGranted = false): Promise<WorkflowRun> {
    const identity = this.store(agent).resolveIdentity(target)
    if (identity.kind === 'ambiguous') throw new Error(`workflow target "${target}" matches multiple runs: ${identity.runIds.join(', ')}`)
    const catalogEntry = (await this.list(agent)).entries.find(entry => entry.name === target && entry.valid)
    if (identity.kind === 'run' && catalogEntry !== undefined) throw new Error(`workflow target "${target}" is ambiguous between a run and saved workflow`)
    let loadedSaved: LoadedWorkflow | undefined
    try { loadedSaved = await this.load(agent, target, approvalGranted) } catch (error) {
      if (/trusted-local/u.test(error instanceof Error ? error.message : String(error))) {
        const granted = await this.confirm(agent, `Run trusted local workflow "${target}"?`, 'This executes local TypeScript/JavaScript with host authority.', signal)
        if (!granted) throw new Error('trusted-local workflow was not approved')
        loadedSaved = await this.load(agent, target, true)
        approvalGranted = true
      }
      // A missing saved workflow may still identify an immutable run snapshot.
      else if (!/not found/u.test(error instanceof Error ? error.message : String(error))) throw error
    }
    if (loadedSaved !== undefined) return await this.startLoaded(agent, loadedSaved, args, signal, approvalGranted)
    if (identity.kind === 'missing') throw new Error(`workflow target "${target}" was not found`)
    const capsule = this.store(agent).getCapsule(identity.runId)
    if (capsule === undefined) throw new Error(`run "${identity.runId}" has no immutable capability script snapshot`)
    const module: WorkflowModule = { manifest: capsule.manifest, execution: 'capability-generated', source: capsule.source, capsule }
    return await this.engine(agent).start({ module, source: 'run-snapshot', parent: agent, args, ...(signal === undefined ? {} : { signal }), sourceRunId: identity.runId, ...(resume ? { resumeFromRunId: identity.runId } : {}), ...(approvalGranted ? { requireApproval: false } : {}) })
```

</details>

**依据 4 · 源码核查**：[src/store.ts:116-131](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/store.ts#L116-L131)

缓存键与筛选。

<details>
<summary>查看原文（16行）</summary>

```text
      cacheKey: (input, occurrence) => {
        const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 32)
        return `${hash}-${occurrence}`
      },
      getCached: (key, priorRunId) => {
        const own = cachePath(key)
        if (existsSync(own)) return readJson<WorkflowTaskResult>(own)
        if (priorRunId === undefined) return undefined
        const prior = join(this.runDir(priorRunId), 'results', `${safePart(key, 'cache key')}.json`)
        if (!existsSync(prior)) return undefined
        const result = readJson<WorkflowTaskResult>(prior)
        if (result.status !== 'completed' || (result.verificationWarnings?.length ?? 0) > 0) return undefined
        writeFileSync(own, json(result), 'utf8')
        return result
      },
      setCached: (key, result) => writeFileSync(cachePath(key), json(result), 'utf8'),
```

</details>

**依据 5 · 源码核查**：[src/engine.ts:1025-1044](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/engine.ts#L1025-L1044)

恢复取缓存。

<details>
<summary>查看原文（20行）</summary>

```text
    }
    const occurrenceBase = JSON.stringify(cacheIdentity)
    const occurrence = (run.cacheOccurrences.get(occurrenceBase) ?? 0) + 1
    run.cacheOccurrences.set(occurrenceBase, occurrence)
    const cacheKey = run.writer.cacheKey(cacheIdentity, occurrence)
    const cached = run.input.resumeFromRunId === undefined ? undefined : run.writer.getCached(cacheKey, run.input.resumeFromRunId)
    if (cached !== undefined) {
      const replayed: WorkflowTaskResult = { ...cached, taskId, origin: 'replayed-from-cache' }
      const task: TrackedTask = {
        id: taskId, sequence: run.taskSequence, input, startedAt: cached.startedAt, status: cached.status,
        result: replayed, promise: Promise.resolve(replayed), origin: 'replayed-from-cache', ...(phase === undefined ? {} : { phase }),
        resolve: () => {}, reject: () => {}, ready: Promise.resolve(), resolveReady: () => {}, rejectReady: () => {}, nativeStarted: false, terminalPublished: true,
      }
      run.tasks.set(taskId, task)
      this.emit(run, 'cache-hit', { taskId, cacheKey, fromRunId: run.input.resumeFromRunId })
      return { taskId, name: input.name }
    }
    let resolve!: (value: WorkflowTaskResult) => void
    let reject!: (error: unknown) => void
    const promise = new Promise<WorkflowTaskResult>((resolve_, reject_) => { resolve = resolve_; reject = reject_ })
```

</details>

#### 缺口

- 未测试真实子 Agent 取消或外部状态漂移
  **影响**：不能声称具有事务级恢复或独立宿主隔离
  **进一步探讨**：用隔离任务测脚本超时、拒绝权限、缓存失效和中断

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样评估复用及避免把旧证据用于新状态？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先用匹配插件要求的测试 DSH、只读流程及可弃用工作区，核对 provider、审批和事件。记录首次编写、运行、人工复核与续跑开销。若任务具副作用或外部状态已变，先查原件与事件再决定是否恢复。可对照在缓存键或读取前验收中加入可验证的外部前置状态，测在同输入不同工作树条件下的错误缓存命中、运行时间和误拒绝。若正确率无提升或反复使有效缓存失效，则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:683-695](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/index.ts#L683-L695)

依赖的宿主服务。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  const approval = ctx.get('approval') as ApprovalService | undefined
  const jobs = ctx.get('jobs') as JobRegistry | undefined
  const userQuestions = ctx.get('userQuestions') as UserQuestionService | undefined
  ctx.plugin(DynamicWorkflowService, {
    config: resolved,
    subagents: ctx.subagents,
    ...(approval === undefined ? {} : { approval }),
    ...(jobs === undefined ? {} : { jobs }),
    ...(userQuestions === undefined ? {} : { userQuestions }),
  })
  ctx.inject(['dynamicWorkflows'], child => installSurfaces(child, resolved))
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:643-653](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/engine.ts#L643-L653)

需要审批但无服务时失败。

<details>
<summary>查看原文（11行）</summary>

```text
    this.emit(run, 'workflow-started', { runId: run.snapshot.runId, workflow: run.snapshot.workflow })
    try {
      if (this.needsApproval(run.input)) {
        if (this.deps.approval === undefined) throw new Error('workflow approval is required but the DSH approval service is unavailable')
        const outcome = await this.deps.approval.request({ agent: run.input.parent, toolName: 'run_workflow', reason: preflight.approvalSummary, signal: run.controller.signal })
        if (outcome !== 'allowed-once') {
          run.snapshot = { ...run.snapshot, status: 'denied', error: `workflow approval ${outcome}` }
          this.emit(run, 'workflow-stopped', { reason: `approval ${outcome}` })
          return this.finish(run)
        }
      }
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:1078-1093](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/engine.ts#L1078-L1093)

预留 token 预算。

<details>
<summary>查看原文（16行）</summary>

```text
        subagents: this.deps.subagents, dispatchAvailable: this.deps.dispatch !== undefined, isolationAvailable: this.deps.isolation !== undefined,
      })
      const { readOnly, route, subagentProvider } = admission
      allocation = admission.allocation
      const total = run.input.module.manifest.tokenBudget
      if (total !== undefined) {
        if (allocation <= 0) throw new WorkflowControlError('token-budgeted workflow task requires maxTokens through its task or model tier')
        if (run.spentTokens + run.reservedTokens + allocation > total) throw new WorkflowControlError('workflow token budget exceeded before agent start')
        run.reservedTokens += allocation
        reservationActive = true
      }
      const descriptor = this.deps.subagents.getProvider(subagentProvider)!
      const verification = task.input.verification ?? (readOnly ? undefined : { enforcement: 'warn' as const, requiresMutation: true, rejectPreparatoryFinalText: true })
      let parent = run.input.parent
      if (task.input.isolation === 'worktree') {
        isolation = await this.deps.isolation!.prepare({ runId: run.snapshot.runId, taskId: task.id, cwd: cwdOf(parent), parent })
```

</details>

**依据 4 · 源码核查**：[src/store.ts:116-131](https://github.com/omdsh-dev/dsh_workflow/blob/44b83c182aa02d1be8a0803e8446cb495f93cd8f/src/store.ts#L116-L131)

缓存基线。

<details>
<summary>查看原文（16行）</summary>

```text
      cacheKey: (input, occurrence) => {
        const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 32)
        return `${hash}-${occurrence}`
      },
      getCached: (key, priorRunId) => {
        const own = cachePath(key)
        if (existsSync(own)) return readJson<WorkflowTaskResult>(own)
        if (priorRunId === undefined) return undefined
        const prior = join(this.runDir(priorRunId), 'results', `${safePart(key, 'cache key')}.json`)
        if (!existsSync(prior)) return undefined
        const result = readJson<WorkflowTaskResult>(prior)
        if (result.status !== 'completed' || (result.verificationWarnings?.length ?? 0) > 0) return undefined
        writeFileSync(own, json(result), 'utf8')
        return result
      },
      setCached: (key, result) => writeFileSync(cachePath(key), json(result), 'utf8'),
```

</details>

#### 缺口

- 未运行当前 DSH、真实模型及复用对照
  **影响**：实际 token 成本、维护和恢复工时未知
  **进一步探讨**：用测试 workflow 演练审批拒绝、超时、预算和变化工作树

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
