# DSH ComfyUI

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[1e10d0e](https://github.com/fandc520/dsh-comfyui/tree/1e10d0e2596956e9dffd85ff7f344151e57c34e0)

<!-- BEGIN META -->
[![GitHub ★ 161](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=161&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fandc520/dsh-comfyui) [![npm 30d 6,235](https://img.shields.io/static/v1?label=npm+30d&message=6%2C235&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-comfyui) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-comfyui)
<!-- END META -->

> **功能**：从 DSH 调用本地或远程 ComfyUI，管理工作流参数和生成媒体。

> **亮点**：[Q01](#research-q01) 把参数和媒体结果连到会话。

> **主要限制**：[Q03](#research-q03) 背景作业检查可能发生在远端提交之后。

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
  - [Q01 · 会话中运行现有工作流的增量？](#detail-section-11)
  - [Q02 · 背景作业如何取得结果？](#detail-section-12)
  - [Q03 · 工具报错时任务是否已提交？](#detail-section-13)
  - [Q04 · 怎样试用并退出？](#detail-section-14)
  - [Q05 · 提交前校验后台能力能减少重复吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 调用已有 ComfyUI 工作流的创作者可减少操作切换。

手工使用 ComfyUI 可直查队列，但需要切换与搬运。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提交 | 执行工作流 | 依赖实例与节点 |
| 异步跟踪 | 查看进度和媒体 | 取消需核对远端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH | 必需 | 注册工具 | 改用原界面 |
| ComfyUI 实例 | 必需 | 执行工作流 | 无生成 |
| jobs 服务 | 异步需要 | 运行背景作业 | 使用同步 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对实例和模板 | 用简单节点 |
| 核查 | 发起同步并看媒体 | 查远端队列 |
| 退出 | 禁用并单独确认队列 | 保留原工作流 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | GPU 与配置费用未知 | 准备耗时未知 | 配对版本 |
| 持续 | 运行资源未知 | 检查媒体耗时未知 | 远端节点决定开销 |
| 恢复 | 重复执行成本未知 | 排查耗时未知 | 报错可能已经排队 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话化执行 | 有参数与媒体路径 | 实际质量和速度 |

> **思考**：[Q03](#research-q03) 背景作业检查可能发生在远端提交之后。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把参数和媒体结果连到会话。

跟踪使用 promptId，取消须回查后端状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 背景作业检查可能发生在远端提交之后。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先同步试一次并检查真实队列。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的工作流提交、等待取消及已提交未确认状态。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/tools.ts、src/index.ts、src/comfyui.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的工作流提交、等待取消及已提交未确认状态。未执行目标代码或实际宿主验证。
- 下一步：注入缺服务与网络超时

**分析版本**

- **仓库**：[fandc520/dsh-comfyui](https://github.com/fandc520/dsh-comfyui)
- **版本号**：0.5.5（[固定提交 1e10d0e](https://github.com/fandc520/dsh-comfyui/tree/1e10d0e2596956e9dffd85ff7f344151e57c34e0)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证预检能否减少失败重试时的重复。

注入缺服务与网络超时

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 525 | — | — | 13413 |
| .mjs | source | 10 | 1800 | 1533 | 165 | — |
| .ts | source | 24 | 9339 | 7350 | 1526 | — |
| .tsx | source | 6 | 4427 | 3760 | 431 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/fandc520/dsh-comfyui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/fandc520/dsh-comfyui/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/fandc520/dsh-comfyui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工作流提交、等待取消及已提交未确认状态

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话中运行现有工作流的增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已拥有 ComfyUI 工作流的创作者可以通过保存的参数名调用。入口先拒绝未知参数，随后把已知覆盖和素材信息应用到 prompt，再记录返回的 promptId。相对手工开另一个界面可减少搬运，但模型与节点仍由 ComfyUI 提供。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-26](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/README.md#L9-L26)

连接与版本说明

<details>
<summary>查看原文（18行）</summary>

```text
<h1 align="center">dsh-comfyui</h1>

<p align="center">让 DeepSeek Harness 的 Agent 智能驱动本地或远程 ComfyUI 生成任何内容。附带工作流、资产管理面板与技能包管理挂载。配套 skill 与同源媒体代理。</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-comfyui"><img src="https://img.shields.io/npm/v/dsh-comfyui" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/dsh-comfyui"><img src="https://img.shields.io/npm/dm/dsh-comfyui" alt="npm downloads" /></a>
  <img src="https://img.shields.io/npm/l/dsh-comfyui" alt="license" />
</p>

> **版本配对（选对 dsh 版本再装，否则 dshmarket 会报风险提示）**：
>
> | dsh-comfyui | 配对的 DeepSeek Harness | 说明 |
> | --- | --- | --- |
> | **0.5.x（最新，`latest` tag）** | **≥ 0.1.2，< 0.3**（含 0.1.5 / 0.1.6 / 0.1.7 / 0.2.x 预发布版） | 0.5.3 起兼容 dsh 0.1.7 的设置机制（设置页保存直接生效，无需重启）；0.5.5 起兼容 dsh 0.2.x |
> | **0.3.x（beta 线，`beta` tag）** | **0.1.1** | 老版本 dsh 请留在 0.3.x 线 |
>
> 安装：`dsh plugin --profile web add dsh-comfyui`（装最新 0.5.x）/ `dsh plugin --profile web add dsh-comfyui@beta`（老宿主装 0.3.x）。
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:985-1003](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/tools.ts#L985-L1003)

提交前参数检查

<details>
<summary>查看原文（19行）</summary>

```text
      const values = typeof args.parameters === 'object' && args.parameters !== null
        ? (args.parameters as Record<string, unknown>)
        : {}
      // Unknown names used to be ignored silently, so a misspelt prompt key
      // ran the saved default and looked like "ComfyUI ignores my prompt".
      // Refuse before anything is queued and name the valid keys instead.
      const known = new Set((saved.parameters ?? []).map((param) => param.name))
      const unknown = Object.keys(values).filter((name) => !known.has(name))
      if (unknown.length > 0) {
        throw new Error(`comfyui_workflow: "${saved.name}" has no parameter ${unknown.map((name) => `"${name}"`).join(', ')} — nothing was submitted. Valid parameter names: ${[...known].join(', ') || '(none)'}`)
      }
      const prompts = promptsUsed(saved.parameters ?? [], values)
      const promptId = await runtime.queue(saved.workflow, {
        workflowName: saved.name,
        workflowId: saved.id,
        source: 'workflow-tool',
        parameters: saved.parameters,
        values,
      })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:206-223](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/index.ts#L206-L223)

队列接线与跟踪

<details>
<summary>查看原文（18行）</summary>

```text
    queue: async (workflow, meta) => {
      const client = runtime.createClient(await resolveApiKey(ctx, resolved.apiKeyEnv))
      // Heals library entries saved with the pre-0.5.2 wrapped DynamicCombo shape (Issue #10).
      let prompt = flattenDynamicCombos(workflow as unknown as Workflow)
      if (meta.parameters !== undefined && meta.parameters.length > 0) {
        const objectInfo = await objectInfoCached(client)
        const slots = await store.loadSlots()
        const loaded = slots.filter((slot): slot is NonNullable<typeof slot> => slot !== null)
        prompt = applyWorkflowParameters(prompt, meta.parameters, meta.values ?? {}, objectInfo, await store.loadMediaSizes(), loaded)
      }
      const extraData: Record<string, unknown> = {}
      if (meta.workflowId !== undefined && meta.workflowId !== null && meta.workflowName !== null) {
        // ComfyUI's job metadata derives workflow_id from extra_pnginfo.workflow.id.
        extraData['extra_pnginfo'] = { workflow: { id: meta.workflowId, name: meta.workflowName } }
      }
      const promptId = await client.queuePrompt(prompt, { extraData })
      tracker.track({ promptId, ts: new Date().toISOString(), workflowName: meta.workflowName, source: meta.source })
      return promptId
```

</details>

#### 缺口

- 未对照生成质量
  **影响**：不知道操作收益
  **进一步探讨**：复用同一已知工作流比较

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 背景作业如何取得结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

运行时用 promptId 轮询，发布进度并从历史结果收集媒体。背景作业取消只先触发 AbortController，等待层再尝试远端取消。若只是本地结束或错误，不能把它当成远端任务成功停止。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:298-341](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/tools.ts#L298-L341)

后台等待与本地取消

<details>
<summary>查看原文（44行）</summary>

```text
    label,
    ...jobOwner(jobs, opts.agent),
    run: (job) => {
      const startedAt = Date.now()
      const controller = new AbortController()
      let lastLine: string | undefined
      const publishProgress = (): void => {
        if (job?.updateProgress === undefined) return
        const line = progressLine(runtime.queueProgress(promptId))
        if (line === lastLine) return
        lastLine = line
        job.updateProgress(line)
      }
      const done = (async (): Promise<JobOutcome> => {
        try {
          const entry = await client.waitForCompletion({
            promptId,
            timeoutMs: waitMs,
            pollIntervalMs: config.pollIntervalMs,
            signal: controller.signal,
            onPoll: publishProgress,
          })
          const items = collectMedia({ promptId, entry, maxItems: config.maxMediaItems, proxyBase: runtime.proxyBase() })
          const result: RunResult = {
            kind: 'sync',
            promptId,
            status: 'completed',
            elapsedMs: Date.now() - startedAt,
            media: items,
            summary: summarizeMedia(items),
            ...(opts.prompts !== undefined && opts.prompts.length > 0 ? { prompts: opts.prompts } : {}),
          }
          return jobCompleted(jobs, runResultText(subject, result))
        } catch (error) {
          runtime.untrack(promptId)
          if (controller.signal.aborted) return { status: 'killed', detail: 'comfyui: cancelled' }
          const message = error instanceof Error ? error.message : String(error)
          return jobFailed(jobs, message)
        }
      })()
      return {
        cancel: () => controller.abort(),
        done,
      }
```

</details>

**依据 2 · 源码核查**：[src/comfyui.ts:546-562](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/comfyui.ts#L546-L562)

等待层尝试取消

<details>
<summary>查看原文（17行）</summary>

```text
   * (`cancelPrompt`) and throws an "interrupted" error. `onPoll` runs once per
   * poll, for callers that publish progress.
   */
  async waitForCompletion(opts: {
    promptId: string
    timeoutMs: number
    pollIntervalMs: number
    signal: AbortSignal
    onPoll?: () => void
  }): Promise<ComfyUIHistoryEntry> {
    const { promptId, timeoutMs, pollIntervalMs, signal, onPoll } = opts
    const deadline = Date.now() + timeoutMs
    for (;;) {
      if (signal.aborted) {
        await this.cancelPrompt(promptId).catch(() => undefined)
        throw new ComfyUIError(`ComfyUI generation interrupted (prompt ${promptId})`)
      }
```

</details>

#### 缺口

- 未测远端断开
  **影响**：不能确定状态最终一致
  **进一步探讨**：断开网络再读取队列

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具报错时任务是否已提交？

**研究主题**：缺陷与关键质疑

#### 完整回答

保存工作流路径先提交 prompt，再检查 mode 和 jobs 服务。参数 schema 可能拦截无效 mode，但缺 jobs 服务仍可能在已提交后报错。取消按当前队列区分待处理和运行，队列查询与终止之间仍有时序窗口。重试前须按 promptId 或远端队列核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:997-1018](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/tools.ts#L997-L1018)

提交发生在背景服务检查前

<details>
<summary>查看原文（22行）</summary>

```text
      const promptId = await runtime.queue(saved.workflow, {
        workflowName: saved.name,
        workflowId: saved.id,
        source: 'workflow-tool',
        parameters: saved.parameters,
        values,
      })
      const mode = args.mode === undefined ? 'sync' : args.mode
      if (mode !== 'sync' && mode !== 'async') {
        throw new Error(`comfyui_workflow: mode must be sync or async, got ${String(mode)}`)
      }
      const waitMs = typeof args.timeout_ms === 'number' ? args.timeout_ms : config.timeoutMs
      if (mode === 'async') {
        const jobs = ctx.get('jobs') as JobsService | undefined
        if (jobs === undefined) {
          throw new Error('comfyui_workflow: background jobs unavailable — load @deepseek-ai/dsh-jobs-local and @deepseek-ai/dsh-tool-jobs')
        }
        const jobId = startPromptJob(jobs, runtime, client, { promptId, label: saved.name, subject: 'ComfyUI workflow', waitMs, agent: exec.agent, prompts })
        const background: BackgroundResult = { kind: 'background', jobId, promptId, label: saved.name, notifies: sessionJobs(jobs) }
        return { action: 'run', id, workflowName: saved.name, background, report: backgroundText('ComfyUI workflow', background) }
      }
      const result = await waitSync(runtime, client, promptId, config, exec.signal, waitMs, { prompts })
```

</details>

**依据 2 · 源码核查**：[src/comfyui.ts:362-384](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/comfyui.ts#L362-L384)

取消的检查和动作

<details>
<summary>查看原文（23行）</summary>

```text
   * Stop one prompt without touching anyone else's work: dequeue it while
   * pending, interrupt it only while it is the running one, no-op once it has
   * left the queue. A bare `interrupt()` stops whatever is running — another
   * session's job or the user's own ComfyUI run — and ComfyUI versions before
   * prompt-scoped interrupts ignore the `prompt_id` body, hence the queue
   * check. (Older servers keep a tiny race: the prompt could finish between
   * the check and the interrupt.)
   */
  async cancelPrompt(promptId: string): Promise<void> {
    const queue = await this.getQueue()
    if (queue.queue_pending.some((item) => item.prompt_id === promptId)) {
      await this.deleteQueueItems([promptId])
      return
    }
    if (queue.queue_running.some((item) => item.prompt_id === promptId)) {
      await this.interruptPrompt(promptId)
    }
  }

  /** Interrupt the running prompt; without an id, interrupt globally. */
  async interruptPrompt(promptId?: string): Promise<void> {
    await this.request('/interrupt', {
      method: 'POST',
```

</details>

#### 缺口

- 未做真实重试
  **影响**：重复执行与取消竞态未验
  **进一步探讨**：先在测试实例观察已提交错误

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先匹配 README 的版本线，选择可控制的 ComfyUI 实例和简单工作流。用同步方式确认参数、promptId 和实际媒体，再试异步及取消。报错先查远端队列；停用插件不会自动证明已提交任务终止。资源和等待代价未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-26](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/README.md#L19-L26)

兼容要求

```text
> **版本配对（选对 dsh 版本再装，否则 dshmarket 会报风险提示）**：
>
> | dsh-comfyui | 配对的 DeepSeek Harness | 说明 |
> | --- | --- | --- |
> | **0.5.x（最新，`latest` tag）** | **≥ 0.1.2，< 0.3**（含 0.1.5 / 0.1.6 / 0.1.7 / 0.2.x 预发布版） | 0.5.3 起兼容 dsh 0.1.7 的设置机制（设置页保存直接生效，无需重启）；0.5.5 起兼容 dsh 0.2.x |
> | **0.3.x（beta 线，`beta` tag）** | **0.1.1** | 老版本 dsh 请留在 0.3.x 线 |
>
> 安装：`dsh plugin --profile web add dsh-comfyui`（装最新 0.5.x）/ `dsh plugin --profile web add dsh-comfyui@beta`（老宿主装 0.3.x）。
```

**依据 2 · 源码核查**：[src/index.ts:384-401](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/index.ts#L384-L401)

工具和技能挂载

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => {
    const disposers = registerComfyUITools(ctx, runtime)
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'dsh-comfyui: tools')

  // The companion skill rides the same optional-services pattern: headless
  // hosts without a skills service simply skip it. Runtime skills register at
  // rank 250, so project/user skills can override the shipped guidance.
  ctx.effect(() => {
    const skills = ctx.get('skills') as { register(skill: unknown): () => void } | undefined
    if (skills === undefined) return () => {}
    return skills.register({
      ...COMFYUI_SKILL,
      content: COMFYUI_SKILL.content,
    })
  }, 'dsh-comfyui: skill')
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:1004-1018](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/tools.ts#L1004-L1018)

同步与异步差异

<details>
<summary>查看原文（15行）</summary>

```text
      const mode = args.mode === undefined ? 'sync' : args.mode
      if (mode !== 'sync' && mode !== 'async') {
        throw new Error(`comfyui_workflow: mode must be sync or async, got ${String(mode)}`)
      }
      const waitMs = typeof args.timeout_ms === 'number' ? args.timeout_ms : config.timeoutMs
      if (mode === 'async') {
        const jobs = ctx.get('jobs') as JobsService | undefined
        if (jobs === undefined) {
          throw new Error('comfyui_workflow: background jobs unavailable — load @deepseek-ai/dsh-jobs-local and @deepseek-ai/dsh-tool-jobs')
        }
        const jobId = startPromptJob(jobs, runtime, client, { promptId, label: saved.name, subject: 'ComfyUI workflow', waitMs, agent: exec.agent, prompts })
        const background: BackgroundResult = { kind: 'background', jobId, promptId, label: saved.name, notifies: sessionJobs(jobs) }
        return { action: 'run', id, workflowName: saved.name, background, report: backgroundText('ComfyUI workflow', background) }
      }
      const result = await waitSync(runtime, client, promptId, config, exec.signal, waitMs, { prompts })
```

</details>

#### 缺口

- 未运行服务器
  **影响**：无法确认 GPU、插件和节点兼容
  **进一步探讨**：用测试实例核对单个低成本任务

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 提交前校验后台能力能减少重复吗？

**研究主题**：新假设与验证

#### 完整回答

把现有提交后检查与提交前预检对照，在缺 jobs 服务或响应丢失时记录远端排队、用户重试和重复生成。若预检无助或拒绝可运行同步任务，否定改动。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:997-1018](https://github.com/fandc520/dsh-comfyui/blob/1e10d0e2596956e9dffd85ff7f344151e57c34e0/src/tools.ts#L997-L1018)

当前验证顺序

<details>
<summary>查看原文（22行）</summary>

```text
      const promptId = await runtime.queue(saved.workflow, {
        workflowName: saved.name,
        workflowId: saved.id,
        source: 'workflow-tool',
        parameters: saved.parameters,
        values,
      })
      const mode = args.mode === undefined ? 'sync' : args.mode
      if (mode !== 'sync' && mode !== 'async') {
        throw new Error(`comfyui_workflow: mode must be sync or async, got ${String(mode)}`)
      }
      const waitMs = typeof args.timeout_ms === 'number' ? args.timeout_ms : config.timeoutMs
      if (mode === 'async') {
        const jobs = ctx.get('jobs') as JobsService | undefined
        if (jobs === undefined) {
          throw new Error('comfyui_workflow: background jobs unavailable — load @deepseek-ai/dsh-jobs-local and @deepseek-ai/dsh-tool-jobs')
        }
        const jobId = startPromptJob(jobs, runtime, client, { promptId, label: saved.name, subject: 'ComfyUI workflow', waitMs, agent: exec.agent, prompts })
        const background: BackgroundResult = { kind: 'background', jobId, promptId, label: saved.name, notifies: sessionJobs(jobs) }
        return { action: 'run', id, workflowName: saved.name, background, report: backgroundText('ComfyUI workflow', background) }
      }
      const result = await waitSync(runtime, client, promptId, config, exec.signal, waitMs, { prompts })
```

</details>

#### 缺口

- 缺重试样本
  **影响**：收益未知
  **进一步探讨**：注入缺服务与网络超时

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
