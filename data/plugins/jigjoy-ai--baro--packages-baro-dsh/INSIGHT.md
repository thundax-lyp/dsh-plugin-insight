# baro-dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e81b87e](https://github.com/jigjoy-ai/baro/tree/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh)

<!-- BEGIN META -->
[![GitHub ★ 126](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=126&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jigjoy-ai/baro) [![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/baro-dsh) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/baro-dsh)
<!-- END META -->

> **功能**：将 Baro 编码流程作为 DSH 子代理委派并显示任务状态。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将外部 Baro 工作流连接到 DSH 模型工具、任务及 Web 状态。

> **主要限制**：[Q03](#research-q03) 的 completed 可能包含开放合约或缺失 done；调用者应读取原始 success 与产物。

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
  - [Q01 · 插件适合什么工作，它与 Baro 引擎如何分工？](#detail-section-11)
  - [Q02 · 一次委派如何连接进程、进度和回交？](#detail-section-12)
  - [Q03 · completed 是否能作为目标全部达成的证明？](#detail-section-13)
  - [Q04 · 默认权限、可见状态及退出成本是什么？](#detail-section-14)
  - [Q05 · 如何减少终态被误读的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要委派跨文件编码目标的 DSH 用户。

对照 DSH 原生子代理与人工调用外部 CLI；插件增加 provider、模型工具与进度观察，不等于外部引擎的实现或实际完成证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 子代理工具 | 委派完整文本目标 | 不继承父上下文；依赖 CLI |
| 后台任务 | 展示进度和取消 | 信号与退出行为未运行验证 |
| Web 面板 | 查看状态与里程碑 | settings 可被客户端读取 |
| 结果映射 | 回交终态与摘要 | completed 不保证目标合约关闭 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.1.2-rc.1 服务 | Host 必需 | provider、任务、设置和子进程 | 兼容性不满足可能无法加载 |
| Baro CLI 与模型凭据 | 委派必需 | 外部执行目标 | 进程或模型调用失败 |
| Web Client 服务 | 面板条件 | 显示状态 | 不影响已接线的其他观察器，具体运行未测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离仓库、安装固定宿主与 CLI | 核对凭据和原配置 |
| 委派 | 模型通过工具提交完整目标 | 观察任务状态和取消 |
| 核验 | 用户检查 success、合约、验证和提交 | 未达预期则停止并恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI 和模型成本未知 | 配置版本、凭据和隔离环境 | 宿主兼容未测 |
| 持续使用 | 模型与子进程成本未知 | 观察并复核产物 | 节省时间未对照 |
| 失败恢复 | 重试费用未知 | 检查提交及取消结果 | 部分变更可能需要人工处理 |
| 退出 | 状态与日志清理成本未知 | 恢复 profile 并检查残留 | 自动清理未证实 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 委派 | provider 启动外部 CLI | 引擎实际执行效果 |
| 可观察 | jobs 与 settings 接线 | 实际显示与可靠性 |
| 结果 | 映射终态与文本 | 目标真实达成 |

> **思考**：[Q03](#research-q03) 的 completed 可能包含开放合约或缺失 done；调用者应读取原始 success 与产物。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将外部 Baro 工作流连接到 DSH 模型工具、任务及 Web 状态。

[Q02](#research-q02) 分离进程、观察器和领域跟踪；[Q03](#research-q03) 显示结果判定的边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的 completed 可能包含开放合约或缺失 done；调用者应读取原始 success 与产物。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离环境核查权限、状态和退出；按 [Q03](#research-q03) 核验目标而非只看状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 CLI 委派和状态接线；真实引擎、宿主兼容、目标达成和费用均未运行验证。

- 已检查：作者 README、包清单、源码路径 packages/baro-dsh/README.md、packages/baro-dsh/cordis.patch.yml、packages/baro-dsh/src/adapters/dsh/subprocess-runner.ts、packages/baro-dsh/src/index.ts、packages/baro-dsh/src/adapters/dsh/subagent-provider.ts、packages/baro-dsh/src/application/delegate-run.ts、packages/baro-dsh/src/adapters/dsh/jobs-observer.ts、packages/baro-dsh/src/domain/run.ts、packages/baro-dsh/package.json、packages/baro-dsh/src/adapters/dsh/settings-observer.ts、packages/baro-dsh/src/client/index.tsx 及固定范围 inventory；组件：packages/baro-dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查子包清单、bundle、Host、provider、子进程、跟踪器、设置观察器和 Client 入口；未审计整个 Baro 引擎和宿主。
- 下一步：仅静态检查固定源码；未构建、运行测试、调用模型或验证发布品。

**分析版本**

- **仓库**：[jigjoy-ai/baro](https://github.com/jigjoy-ai/baro)
- **版本号**：0.1.0（[固定提交 e81b87e](https://github.com/jigjoy-ai/baro/tree/e81b87e2a43270949ce6de0ef451bdce9dde0913)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设展示独立终态字段可减少误读，尚未验证。

仅静态检查固定源码；未构建、运行测试、调用模型或验证发布品。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 75 | — | — | 506 |
| .ts | source | 11 | 1076 | 900 | 77 | — |
| .tsx | source | 2 | 259 | 223 | 11 | — |
| .ts | test | 4 | 394 | 361 | 7 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/jigjoy-ai/baro/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实外部编码流程的 DSH 接线、终态和使用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件适合什么工作，它与 Baro 引擎如何分工？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要把跨文件目标委派给外部编码流程的 DSH 用户，bundle 同时插入 Baro provider 与绑定的模型工具，避免只有 provider 而模型不可见。README 描述规划、并行编码、独立审查与合并验证；本组件实际接入外部 baro CLI，并不自身实现或证明这些引擎能力。

#### 证据与依据

**依据 1 · 作者声明**：[packages/baro-dsh/README.md:3-12](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/README.md#L3-L12)

作者描述目标工作流。

<details>
<summary>查看原文（10行）</summary>

```text
baro as a subagent provider for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).
A dsh agent calls the `baro` tool with a goal; baro plans it into stories,
executes them in parallel with coding agents in the session's working
directory, reviews each story independently and verifies the merged result.
The delegation returns the certified outcome: whether the run succeeded, how it
was classified when it did not, the story count, commits, and the pull request
if one was made. While it runs, the sidebar shows a **baro runs** panel with the
phase (intake → architect → planning → executing → finalizing), story progress,
the agent's latest activity and the milestone log; dsh's own jobs list carries
it as a `baro-N` job.
```

</details>

**依据 2 · 源码核查**：[packages/baro-dsh/cordis.patch.yml:1-23](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/cordis.patch.yml#L1-L23)

bundle 注册 provider 与绑定工具。

<details>
<summary>查看原文（23行）</summary>

```text
# Layer applied when a dsh profile lists this bundle. Two rows: the provider
# (this package) and the model-facing tool bound to it. A provider alone is
# invisible to the model — dsh's delegation tool is bound to exactly one
# provider per row, so the `baro` tool is what the agent actually calls.
- insert:
    - id: baro
      name: baro-dsh
      config:
        providerName: baro
        command: baro
        localOnly: true

    - id: tool-baro
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: baro
        toolName: baro
        backgroundMode: one-shot
        # A run is already a `baro-N` job through the registry; the tool's own
        # background switch needs dsh-tool-jobs' controller, which the web
        # profile does not give every agent, and the model reaches for it.
        enableRunInBackground: false
        maxDepth: provider-managed
```

</details>

**依据 3 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/subprocess-runner.ts:22-41](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/subprocess-runner.ts#L22-L41)

启动外部命令而非实现引擎。

<details>
<summary>查看原文（20行）</summary>

```text
  start(request: RunRequest): RunProcess {
    const argv = [
      this.baro.command,
      request.goal,
      '--headless',
      '--cwd',
      request.cwd,
      ...(this.baro.localOnly ? ['--local-only'] : []),
      ...this.baro.args,
    ]
    // stdin must be closed, not merely silent: headless baro answers its own
    // intake questions only once stdin hits EOF, and blocks on an open pipe.
    const child = this.spawn({
      argv,
      cwd: request.cwd,
      stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'inherit' },
      graceMs: this.baro.disposeGraceMs,
      signal: request.signal,
      env: { ...this.baro.env, BARO_RUN_ID: request.runId },
    })
```

</details>

#### 缺口

- 未运行 Baro 引擎或宿主，无法确认描述的多代理流程和产物
  **影响**：相关结论尚不能确认
  **进一步探讨**：在隔离仓库运行固定版本并检查事件、提交及验证结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次委派如何连接进程、进度和回交？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 注入 subagents、subprocess、jobs、settings 和 systemPrompt，注册 provider、提示与观察器；provider 只提取文本目标，使用配置或父会话 cwd 并生成 ID，不继承父上下文。runner 将目标作为 argv、附加 headless、cwd 与默认 local-only，关闭 stdin 并传 signal；跟踪器解析 stdout JSON 行、折叠阶段和里程碑；jobs 可取消，最终文本和结构化结果交回父代理。观察器异常被隔离，因此 UI 不可用不必然终止执行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/baro-dsh/src/index.ts:57-101](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/index.ts#L57-L101)

Host 装配依赖、观察器、provider 和提示。

<details>
<summary>查看原文（45行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = Config(config)
  const warn = (what: string) => (error: unknown) => {
    console.error(`[baro-dsh] ${what}: ${error instanceof Error ? error.message : String(error)}`)
  }

  const runner = new SubprocessRunner(spec => ctx.subprocess.spawn(spec), {
    command: resolved.command ?? 'baro',
    args: resolved.args ?? [],
    localOnly: resolved.localOnly ?? true,
    env: resolved.env ?? {},
    disposeGraceMs: resolved.disposeGraceMs ?? 5_000,
  })

  // The registry refuses a job no controller serves. Our runs are unowned, so
  // this plugin attaches its own controller for the scope it lives in instead
  // of depending on which agent preset happened to load dsh-tool-jobs.
  ctx.effect(() => ctx.jobs.attachController('baro-dsh'))

  const runs = ctx.settings.register(RUNS_SETTINGS_NS, RunsSchema, { base: { runs: {} } })
  const settingsObserver = new SettingsObserver(
    {
      get: () => runs.get(),
      update: patch => runs.update(patch as { runs: Record<string, RunRecord> }),
    },
    warn('run panel state not persisted'),
  )

  const provider = new BaroSubagentProvider(
    resolved.providerName ?? 'baro',
    new DelegateRun(
      runner,
      composeObservers([new JobsObserver(ctx.jobs), settingsObserver], warn('run observer failed')),
      warn('run continues without an observer'),
    ),
    resolved.cwd,
  )
  ctx.effect(() => ctx.subagents.registerProvider(provider))
  ctx.effect(() =>
    ctx.systemPrompt.section({
      name: 'baro:delegation',
      order: 400,
      text: DELEGATION_GUIDANCE.replaceAll('"baro"', `"${resolved.providerName ?? 'baro'}"`),
    }),
  )
```

</details>

**依据 2 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/subagent-provider.ts:23-48](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/subagent-provider.ts#L23-L48)

提取目标和 cwd 并启动委派。

<details>
<summary>查看原文（26行）</summary>

```text
export class BaroSubagentProvider implements SubagentProvider {
  readonly capabilities: SubagentCapabilities = NO_START_CAPABILITIES
  readonly inheritsParentContext = false

  constructor(
    readonly name: string,
    private readonly delegate: DelegateRun,
    private readonly configuredCwd: string | undefined,
  ) {}

  async start(request: ResolvedSubagentStartRequest): Promise<SubagentRun> {
    const goal = promptText(request.prompt)
    const cwd = resolveChildCwd(this.name, this.configuredCwd, request.parent.session.header.cwd)
    const id = brandString<SessionId>(randomUUID())
    const delegation = this.delegate.start({
      goal,
      cwd,
      label: request.label ?? truncate(goal, 80),
      runId: id,
      signal: request.signal,
    })
    return {
      id,
      localAgent: undefined,
      result: delegation.outcome.then(toResult),
      dispose: () => delegation.dispose(),
```

</details>

**依据 3 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/subprocess-runner.ts:22-46](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/subprocess-runner.ts#L22-L46)

构造命令并传递取消信号。

<details>
<summary>查看原文（25行）</summary>

```text
  start(request: RunRequest): RunProcess {
    const argv = [
      this.baro.command,
      request.goal,
      '--headless',
      '--cwd',
      request.cwd,
      ...(this.baro.localOnly ? ['--local-only'] : []),
      ...this.baro.args,
    ]
    // stdin must be closed, not merely silent: headless baro answers its own
    // intake questions only once stdin hits EOF, and blocks on an open pipe.
    const child = this.spawn({
      argv,
      cwd: request.cwd,
      stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'inherit' },
      graceMs: this.baro.disposeGraceMs,
      signal: request.signal,
      env: { ...this.baro.env, BARO_RUN_ID: request.runId },
    })
    return {
      lines: lines(child.stdout),
      exited: child.done.then(outcome => ({ exitCode: outcome.exitCode })),
      terminate: () => child.terminate(),
      waitForExit: () => child.waitForExit(),
```

</details>

**依据 4 · 源码核查**：[packages/baro-dsh/src/application/delegate-run.ts:102-165](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/application/delegate-run.ts#L102-L165)

跟踪协议、观察者隔离及结果关闭。

<details>
<summary>查看原文（64行）</summary>

```text
  start(request: RunRequest): Delegation {
    if (!request.goal.trim()) throw new Error('baro needs a goal — the delegation prompt is empty')
    const tracker = new RunTracker()

    let child: RunProcess | undefined
    let aborted = false
    const cancel = (reason?: string) => {
      aborted = true
      child?.terminate()
      void reason
    }
    // The observer opens before the process starts, and its failure is not the
    // run's failure: a panel that cannot be shown must never orphan a child or
    // turn a deliverable delegation into an error.
    let subscription: RunSubscription | undefined
    try {
      subscription = this.observer?.opened({
        id: request.runId,
        label: request.label,
        startedAt: new Date().toISOString(),
        summary: () => tracker.summary(),
        progress: () => renderProgress(tracker.summary()),
        cancel,
      })
    } catch (error) {
      this.onObserverFailure?.(error)
    }
    const notify = (fn: (() => void) | undefined) => {
      try {
        fn?.()
      } catch (error) {
        this.onObserverFailure?.(error)
      }
    }

    child = this.process.start(request)
    const started = child
    const followed = (async () => {
      for await (const line of started.lines) {
        const event = parseLine(line)
        if (!event) continue
        const before = tracker.summary().revision
        tracker.accept(event)
        if (tracker.summary().revision !== before) notify(subscription?.changed?.bind(subscription))
      }
    })()

    const outcome = (async (): Promise<DelegationOutcome> => {
      const { exitCode } = await started.exited
      await followed.catch(() => undefined)
      const summary = tracker.summary()
      const terminal = resolveTerminal(aborted || request.signal.aborted, exitCode, summary.done)
      notify(subscription ? () => subscription?.closed(terminal) : undefined)
      return { terminal, text: renderOutcome(summary, terminal), summary }
    })()

    return {
      outcome,
      cancel,
      dispose: async () => {
        cancel('disposed')
        await started.waitForExit()
      },
    }
```

</details>

**依据 5 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/jobs-observer.ts:17-33](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/jobs-observer.ts#L17-L33)

任务取消与输出接线。

<details>
<summary>查看原文（17行）</summary>

```text
  opened(view: RunView): RunSubscription {
    let settle: ((outcome: JobOutcome) => void) | undefined
    const done = new Promise<JobOutcome>(resolve => {
      settle = resolve
    })
    const hooks: JobHooks = {
      cancel: reason => view.cancel(reason),
      done,
      readOutput: () => view.progress(),
    }
    this.jobs.start({ kind: 'baro', label: view.label, run: () => hooks })
    let settled = false
    return {
      closed: terminal => {
        if (settled) return
        settled = true
        settle?.(toJobOutcome(terminal))
```

</details>

#### 缺口

- 尚未验证宿主 API、信号与真实 CLI 协议端到端兼容
  **影响**：相关结论尚不能确认
  **进一步探讨**：用固定 DSH 和 CLI 覆盖启动、取消、无效输出及结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · completed 是否能作为目标全部达成的证明？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。done.success 为真时映射 completed；即使 success 非真，只要无 abort code、完成故事数大于零、跳过数为零且 verification_status 为 passed，也映射 completed，并在文本提示目标合约仍未关闭；结构化 success 仍是 false。若没有 done 且退出码为零也映射 completed。判定直接信任子进程事件，未在包装层独立复验，故调用者必须核查结构化字段、合约和实际产物，而不能只看 stopReason。

#### 证据与依据

**依据 1 · 源码核查**：[packages/baro-dsh/src/domain/run.ts:10-35](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/domain/run.ts#L10-L35)

终态优先级和开放合约及无 done 的映射。

<details>
<summary>查看原文（26行）</summary>

```text
/* `done.abort_code` is a classification only when every failed story agreed
   on one code; a prose-only abort is `error`, never guessed further — with one
   exception. baro marks a run unsuccessful when its goal contract keeps open
   invariants even though every story merged and verification passed. For the
   delegating agent that run delivered; calling it an error made the parent
   conclude nothing was produced. It is `completed`, and the text carries the
   open contract. */
export function classifyDone(done: BaroEvent): Terminal {
  if (done.success === true) return 'completed'
  if (done.abort_code === 'token_ceiling') return 'max-tokens'
  return deliveredDespiteContract(done) ? 'completed' : 'error'
}

export function deliveredDespiteContract(done: BaroEvent): boolean {
  if (done.success === true || done.abort_code !== undefined) return false
  const stats = done.stats as Record<string, unknown> | undefined
  const completed = typeof stats?.stories_completed === 'number' ? stats.stories_completed : 0
  const skipped = typeof stats?.stories_skipped === 'number' ? stats.stories_skipped : 0
  return completed > 0 && skipped === 0 && done.verification_status === 'passed'
}

export function resolveTerminal(aborted: boolean, exitCode: number | null, done: BaroEvent | undefined): Terminal {
  if (aborted) return 'aborted'
  if (done) return classifyDone(done)
  // No `done` line: the process died before baro could classify anything.
  return exitCode === 0 ? 'completed' : 'error'
```

</details>

**依据 2 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/subagent-provider.ts:53-67](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/subagent-provider.ts#L53-L67)

结果的 success 与 stopReason 分开映射。

<details>
<summary>查看原文（15行）</summary>

```text
function toResult(outcome: DelegationOutcome): SubagentResult {
  const stopReason: SubagentStopReason = outcome.terminal
  const done = outcome.summary.done
  return {
    output: [{ type: 'text', text: outcome.text } satisfies ContentBlock],
    structured: done
      ? {
          success: done.success === true,
          abortCode: typeof done.abort_code === 'string' ? done.abort_code : null,
          prUrl: outcome.summary.prUrl ?? null,
        }
      : undefined,
    diagnostic: stopReason === 'completed' ? undefined : truncate(outcome.text, DIAGNOSTIC_LIMIT),
    stopReason,
  }
```

</details>

**依据 3 · 源码核查**：[packages/baro-dsh/src/domain/run.ts:199-235](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/domain/run.ts#L199-L235)

结果文本携带合约与验证状态。

<details>
<summary>查看原文（37行）</summary>

```text
/** The prose a delegating agent receives back. */
export function renderOutcome(summary: RunSummary, terminal: Terminal): string {
  const done = summary.done
  const lines: string[] = []
  if (done) {
    const code = stringField(done, 'abort_code')
    const reason = stringField(done, 'abort_reason')
    const stats = done.stats as Record<string, unknown> | undefined
    if (done.success === true) {
      lines.push('baro run succeeded.')
    } else if (deliveredDespiteContract(done)) {
      lines.push('baro run delivered: every story merged and verification passed, but baro left its goal contract open.')
      if (reason) lines.push(`open contract: ${reason}`)
    } else {
      lines.push(`baro run failed${code ? ` (${code})` : ''}.`)
      if (reason) lines.push(reason)
    }
    if (stats) {
      const facts = [
        `stories completed: ${String(stats.stories_completed ?? '?')}, skipped: ${String(stats.stories_skipped ?? '?')}`,
        typeof stats.total_commits === 'number' ? `commits: ${stats.total_commits}` : undefined,
        typeof stats.files_created === 'number' || typeof stats.files_modified === 'number'
          ? `files created: ${String(stats.files_created ?? 0)}, modified: ${String(stats.files_modified ?? 0)}`
          : undefined,
      ].filter((f): f is string => f !== undefined)
      lines.push(...facts)
    }
    const verification = stringField(done, 'verification_status')
    if (verification) lines.push(`verification: ${verification}`)
    if (done.success !== true) lines.push('Changes are committed in the working directory; inspect them with git log.')
  } else {
    lines.push(`baro run ended without a result (${terminal}).`)
  }
  if (summary.prUrl) lines.push(`pull request: ${summary.prUrl}`)
  const tail = summary.milestones.slice(-12)
  if (tail.length) lines.push('', 'milestones:', ...tail)
  return lines.join('\n')
```

</details>

#### 缺口

- 未做协议一致性和故障注入
  **影响**：无法量化误判概率
  **进一步探讨**：用伪造事件、真实失败场景核对 UI、父代理及产物。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认权限、可见状态及退出成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

版本 0.1.0 声明 Node 20 以上及固定 DSH 0.1.2-rc.1 组件，另需 CLI 与其模型凭据；默认 localOnly 向 CLI 传 --local-only，README 称其禁止 Baro 自有推送和 PR，但不能推导所有子进程网络操作受限。状态写入 settings 包含标签、项目、活动和里程碑，作者说明各客户端可读，最多保留五个完成记录；README 还描述 CLI 完整协议日志路径，卸载不会被此代码证明自动清理。首次应隔离仓库和合成数据，复核凭据、提交和残留；成本、实际权限及清理语义未测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/baro-dsh/package.json:38-74](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/package.json#L38-L74)

打包、Node 和宿主依赖。

<details>
<summary>查看原文（37行）</summary>

```text
  "files": [
    "dist/",
    "cordis.patch.yml"
  ],
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "npm run build:host && npm run build:client",
    "build:host": "tsc -p tsconfig.json",
    "build:client": "tsup",
    "test": "node --test --import tsx test/*.test.ts",
    "typecheck": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json",
    "prepublishOnly": "npm run typecheck && npm test && npm run build"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-jobs": "0.1.2-rc.1",
    "@deepseek-ai/dsh-subagent": "0.1.2-rc.1",
    "@deepseek-ai/dsh-subprocess": "0.1.2-rc.1",
    "@deepseek-ai/dsh-system-prompt": "0.1.2-rc.1",
    "@deepseek-ai/schemastery": "^3.18.2"
```

</details>

**依据 2 · 作者声明**：[packages/baro-dsh/README.md:20-34](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/README.md#L20-L34)

CLI、凭据、默认 localOnly 与配置说明。

<details>
<summary>查看原文（15行）</summary>

```text
The `baro` CLI must be on `PATH` (`npm i -g baro-ai`) and signed into its own
model lane. dsh scrubs the parent environment before spawning, so any credential
baro needs goes into the plugin's `env` config, never inherited.

## Configuration

| key | default | meaning |
|---|---|---|
| `providerName` | `baro` | name under `ctx.subagents`; the tool is named the same |
| `command` | `baro` | executable, name on PATH or absolute path |
| `args` | `[]` | extra `baro` flags (e.g. `--llm codex`) |
| `localOnly` | `true` | `--local-only`: no baro-owned pushes or pull requests |
| `cwd` | parent session cwd | working directory override |
| `env` | `{}` | child environment (credentials go here) |
| `disposeGraceMs` | `5000` | SIGTERM→SIGKILL grace on dispose |
```

</details>

**依据 3 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/settings-observer.ts:55-85](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/settings-observer.ts#L55-L85)

持久状态内容和保留上限。

<details>
<summary>查看原文（31行）</summary>

```text
  constructor(
    private readonly sink: RunsSink,
    private readonly onError: (error: unknown) => void,
    options: SettingsObserverOptions = {},
  ) {
    this.throttleMs = options.throttleMs ?? 1_000
    this.keepFinished = options.keepFinished ?? 5
    this.tail = options.tail ?? 8
    this.now = options.now ?? Date.now
    this.schedule = options.setTimeout ?? ((fn, ms) => setTimeout(fn, ms))
  }

  opened(view: RunView): RunSubscription {
    let lastWrite = 0
    let pending = false
    let finished: Terminal | undefined

    const record = (): RunRecord => {
      const s = view.summary()
      return {
        label: view.label,
        status: finished ?? 'running',
        startedAt: view.startedAt,
        finishedAt: finished ? new Date(this.now()).toISOString() : null,
        project: s.project ?? null,
        phase: s.phase,
        activity: s.activity ?? null,
        completed: s.completed,
        total: s.total || s.storiesTotal,
        prUrl: s.prUrl ?? null,
        milestones: s.milestones.slice(-this.tail),
```

</details>

**依据 4 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/settings-observer.ts:115-133](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/settings-observer.ts#L115-L133)

序列化更新并清理完成记录。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Serialized read-modify-write: two runs updating at once must not lose each other. */
  private persist(id: string, next: RunRecord): void {
    this.chain = this.chain
      .then(async () => {
        const current = this.sink.get().runs
        const runs: Record<string, RunRecord> = { ...current, [id]: next }
        prune(runs, this.keepFinished)
        await this.sink.update({ runs })
      })
      .catch(this.onError)
  }
}

function prune(runs: Record<string, RunRecord>, keepFinished: number): void {
  const finished = Object.entries(runs)
    .filter(([, r]) => r.status !== 'running')
    .sort(([, a], [, b]) => (a.finishedAt ?? '').localeCompare(b.finishedAt ?? ''))
  for (const [id] of finished.slice(0, Math.max(0, finished.length - keepFinished))) delete runs[id]
}
```

</details>

**依据 5 · 作者声明**：[packages/baro-dsh/README.md:53-75](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/README.md#L53-L75)

完整日志和跨客户端 settings 说明。

<details>
<summary>查看原文（23行）</summary>

```text
The full protocol stream of a run is in `~/.baro/runs/<repo>-<timestamp>.jsonl`.

## Layout

- `src/domain` — baro's TUI protocol v3 and the run fold (phase, activity,
  milestones, outcome); no dsh imports.
- `src/application` — the one use case, `DelegateRun`, over two ports: a
  process to run and observers to watch, composed and isolated from each other.
- `src/adapters/dsh` — the subagent provider, the subprocess runner, the jobs
  observer and the settings observer that feeds the panel.
- `src/client` — the browser half: reads run state from the `baro-dsh` settings
  namespace, follows `settings/document-updated`, renders the sidebar panel.
- `src/index.ts` — the plugin: composition only.

## Why a settings namespace

An out-of-tree plugin cannot add a remote or a forwarded event to dsh's API
assembly (it is fixed at dsh build time). The settings service is writable from
the host, readable from every client, and its update event is forwarded, so
run state travels that way. Writes are throttled to one per second per run and
finished runs are pruned after five.

Pinned to dsh `0.1.2-rc.1`; the provider seam is a developer preview upstream.
```

</details>

**依据 6 · 源码核查**：[packages/baro-dsh/src/client/index.tsx:27-56](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/client/index.tsx#L27-L56)

客户端订阅和运行时轮询。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'baro-dsh: dictionaries')

  const store = new RunsStore(async (): Promise<RunsDocument | null> => {
    const answered = await ctx.remote.settings.describe()
    if (!answered.ok) throw new Error(`${answered.error.code}: ${answered.error.message}`)
    const view = answered.value.namespaces.find((entry: { ns: string; value: unknown }) => entry.ns === RUNS_SETTINGS_NS)
    return view ? (view.value as unknown as RunsDocument) : null
  })

  ctx.effect(() => {
    const disposers = [
      ctx.remote.$on('settings/document-updated', (ns: string) => {
        if (ns === RUNS_SETTINGS_NS) void store.refresh()
      }),
      ctx.on('connection/reset', () => {
        store.reset()
        void store.refresh()
      }),
    ]
    // Belt and braces for the event: while a run is live, poll slowly too. The
    // document is small and the host writes at most once a second anyway.
    const poll = setInterval(() => {
      if (store.getSnapshot().running > 0) void store.refresh()
    }, 4_000)
    void store.refresh()
    return () => {
      clearInterval(poll)
      for (const dispose of disposers) dispose()
    }
```

</details>

#### 缺口

- 未验证 CLI 环境清洗、文件权限、模型费用、日志与卸载行为
  **影响**：相关结论尚不能确认
  **进一步探讨**：在隔离宿主核查实际权限、所有写入与停止后的残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少终态被误读的风险？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在结果与面板中同时展示进程退出码、原始 success、验证状态、开放合约和 stopReason，并将无 done 的正常退出标为待核验，能帮助调用者区分进程结束与目标达成。这会改变现有宿主映射语义，需要与调用方协商；可用成功、开放合约、缺 done 和非零退出的相同任务对照识别率，若用户仍把未达成目标判为成功或兼容性被破坏，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/baro-dsh/src/domain/run.ts:17-35](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/domain/run.ts#L17-L35)

现有终态映射。

<details>
<summary>查看原文（19行）</summary>

```text
export function classifyDone(done: BaroEvent): Terminal {
  if (done.success === true) return 'completed'
  if (done.abort_code === 'token_ceiling') return 'max-tokens'
  return deliveredDespiteContract(done) ? 'completed' : 'error'
}

export function deliveredDespiteContract(done: BaroEvent): boolean {
  if (done.success === true || done.abort_code !== undefined) return false
  const stats = done.stats as Record<string, unknown> | undefined
  const completed = typeof stats?.stories_completed === 'number' ? stats.stories_completed : 0
  const skipped = typeof stats?.stories_skipped === 'number' ? stats.stories_skipped : 0
  return completed > 0 && skipped === 0 && done.verification_status === 'passed'
}

export function resolveTerminal(aborted: boolean, exitCode: number | null, done: BaroEvent | undefined): Terminal {
  if (aborted) return 'aborted'
  if (done) return classifyDone(done)
  // No `done` line: the process died before baro could classify anything.
  return exitCode === 0 ? 'completed' : 'error'
```

</details>

**依据 2 · 源码核查**：[packages/baro-dsh/src/adapters/dsh/subagent-provider.ts:53-67](https://github.com/jigjoy-ai/baro/blob/e81b87e2a43270949ce6de0ef451bdce9dde0913/packages/baro-dsh/src/adapters/dsh/subagent-provider.ts#L53-L67)

现有结构化字段与终态。

<details>
<summary>查看原文（15行）</summary>

```text
function toResult(outcome: DelegationOutcome): SubagentResult {
  const stopReason: SubagentStopReason = outcome.terminal
  const done = outcome.summary.done
  return {
    output: [{ type: 'text', text: outcome.text } satisfies ContentBlock],
    structured: done
      ? {
          success: done.success === true,
          abortCode: typeof done.abort_code === 'string' ? done.abort_code : null,
          prUrl: outcome.summary.prUrl ?? null,
        }
      : undefined,
    diagnostic: stopReason === 'completed' ? undefined : truncate(outcome.text, DIAGNOSTIC_LIMIT),
    stopReason,
  }
```

</details>

#### 缺口

- 该改进未实现，也没有用户对照
  **影响**：不能声称已降低误判
  **进一步探讨**：构造协议场景并验证宿主调用方兼容。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
