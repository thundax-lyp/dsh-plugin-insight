# dsh-imagegen-video

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[858af35](https://github.com/q253595422/dsh-imagegen-video/tree/858af3501f4073a5bf250fa3766b5a76b9e8aa51)

<!-- BEGIN META -->
[![GitHub ★ 90](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/q253595422/dsh-imagegen-video) [![npm 30d 8,815](https://img.shields.io/static/v1?label=npm+30d&message=8%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video)
<!-- END META -->

> **功能**：在 DSH 中提供图片与视频生成、编辑、画布节点和本地片段拼接。

> **亮点**：[Q01](#research-q01) 把镜头规划、渠道模型和任务历史接成同一工作流，[Q02](#research-q02) 保存远端 ID 供恢复轮询。

> **主要限制**：[Q02](#research-q02) 本地取消无法确认远端停止，pending 写入有异步窗口。[Q03](#research-q03) 同步帧函数不能由前置预算检查抢占。

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
  - [Q01 · 统一工作室和镜头规划给什么人增加了什么交付能力？](#detail-section-11)
  - [Q02 · 异步恢复、取消与重试分别产生什么状态？](#detail-section-12)
  - [Q03 · 本地代码路径有哪些依赖，超时能否中止帧函数？](#detail-section-13)
  - [Q04 · 应采用哪条验证路径，任务账本和独立进程能改善什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复在 DSH 创作短片的用户可观察统一规划、提交、恢复和历史路径，成片仍需逐条验收。

独立生成渠道已能出片，用户自行组织镜头与文件。插件连接规划、画布和历史，仍依赖渠道协议及本地工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 镜头规划 | 把需求转成提交提示与参数 | 可降级为启发式规划 |
| 视频恢复 | 继续轮询记录的远端 ID | pending 写前退出仍可能无记录 |
| 代码绘图 | 本地输出媒体 | 帧函数需额外隔离验收 |
| 片段拼接 | 组合已有片段 | 需要 ffmpeg 与 ffprobe |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与共享 runtime 服务 | 接入必需 | 工具和工作室挂接 | 保持独立渠道流程 |
| 模型渠道及实际协议 | 远端生成必需 | 提交、轮询与下载 | 不提交付费任务 |
| 聊天模型及本地编码工具 | 代码路径或规划按需 | 绘图或拼接 | 保留模型路径和人工剪辑 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者用隔离端点核对 ID 与恢复 | 无重复远端提交 |
| 检查 | 区分 cancelled 与远端结果 | 结果未知时查远端任务账本 |
| 退出 | 无法控制代码进程或费用时停流水线 | 继续原渠道并核对已有任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 渠道、工具、磁盘未知 | 配置与故障模拟 | 不执行目标验证 |
| 持续 | 规划、生成、编码未知 | 逐条审片与核对账单 | 取消未必停止远端费用 |
| 失败恢复 | 新提交可能产生新费用 | 查 ID、进程和历史 | pending 窗口需单独验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一工作流 | 规划、运行和历史接线 | 作品质量与净投入 |
| 恢复 | 原 ID 轮询 | 崩溃落盘窗口 |
| 取消 | 本地状态和信号 | 远端停止与账单 |

> **思考**：[Q02](#research-q02) 本地取消无法确认远端停止，pending 写入有异步窗口。[Q03](#research-q03) 同步帧函数不能由前置预算检查抢占。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把镜头规划、渠道模型和任务历史接成同一工作流，[Q02](#research-q02) 保存远端 ID 供恢复轮询。

远端 ID、重试和本地取消分别表达便于诊断，异步落盘与同步帧函数仍形成恢复边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 本地取消无法确认远端停止，pending 写入有异步窗口。[Q03](#research-q03) 同步帧函数不能由前置预算检查抢占。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先保留观察结论，核对异步任务账本和可终止渲染，再考虑付费工作流。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码已核查任务、规划、取消和本地绘图边界。恢复覆盖、代码隔离和作品效果仍待实验。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/generation-runtime.ts、src/video-task-queue.ts、src/video-engine.ts、src/code-render.ts、src/video-director.ts、src/clip-compose.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核查模型视频运行、规划、异步队列、代码帧与拼接工具要求。未执行代码、供应商或测试，未全面审计画布、PPT、服饰、电商与全部协议。
- 下一步：隔离端点对照提交、落盘、恢复与重试，渲染端用独立进程测试不返回帧；本轮仅提出实验。

**分析版本**

- **仓库**：[q253595422/dsh-imagegen-video](https://github.com/q253595422/dsh-imagegen-video)
- **版本号**：1.27.0（[固定提交 858af35](https://github.com/q253595422/dsh-imagegen-video/tree/858af3501f4073a5bf250fa3766b5a76b9e8aa51)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 远端操作账本与可终止的独立渲染进程分别接受故障验收，可能减少重复提交和宿主阻塞。

隔离端点对照提交、落盘、恢复与重试，渲染端用独立进程测试不返回帧；本轮仅提出实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 79 | 10047 | — | — | 141541 |
| .mjs | source | 51 | 29983 | 22147 | 6557 | — |
| .js | source | 1 | 205 | 141 | 50 | — |
| .ts | source | 110 | 43032 | 31910 | 9005 | — |
| .mjs | test | 1 | 100 | 92 | 0 | — |
| .tsx | source | 47 | 25366 | 20768 | 3697 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 生成短视频的人能否保留实际提交条件、找回异步任务，并明确本地取消与代码渲染的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一工作室和镜头规划给什么人增加了什么交付能力？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复在 DSH 生成图片、短片并整理素材的创作者，可以研究同一工作室中继续编辑和保留视频提交条件的路径。合格短片需要主体、镜头、画幅、时长和输出文件都可核查。宿主创建共享 runtime，工具和路由接到它；视频先解析渠道和实际模型。请求开启规划时，已有预览会被重新约束后采用，否则调用规划器；无聊天模型或其调用失败时可退到启发式规划。规划为生成请求组织内容，成片质量由外部模型和素材决定。相比手工在独立渠道提交后整理文件，贡献是把参数、任务和历史接起来，上游生成模型与本地编码工具的能力仍各有归属。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1225-1234](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/index.ts#L1225-L1234)

宿主工具与命令接入共享 runtime。

<details>
<summary>查看原文（10行）</summary>

```text
      const disposeTools = registerAgentImageTools(tctx, runtime, resolveAgentConfig)
      // Video tools mount alongside the image ones and share the same runtime,
      // so a task started by an Agent and one started in the panel are visible
      // to each other and to the same persisted history.
      const disposeVideoTools = registerAgentVideoTools(tctx, runtime, resolveVideoToolConfig)
      // Canvas tools are structure-only: they lay out nodes and wires, never a
      // render. Generation stays behind the user's run button (see the module
      // header for why that is a product decision, not an omission).
      const disposeCanvasTools = registerAgentCanvasTools(tctx, resolveVideoToolConfig)
      const disposeCommand = registerEditImageCommand(tctx, runtime, resolveAgentConfig, {
```

</details>

**依据 2 · 源码核查**：[src/generation-runtime.ts:176-205](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/generation-runtime.ts#L176-L205)

视频先分本地代码和渠道模型，再按请求决定规划。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Generate one video: submit, poll, download, then persist the clip. */
  async runVideo(request: VideoGenerateRequest, signal?: AbortSignal): Promise<VideoGenerateResult> {
    // ---- code path --------------------------------------------------------
    // `renderer: 'code'` is a different production path, not a different model:
    // a chat model writes drawing code and this host renders it. It runs
    // BEFORE channel resolution on purpose — the whole point is that no video
    // provider (and no video model alias) is needed.
    if (request.renderer === 'code') return await this.runVideoCode(request, signal)

    const view = this.resolve()
    const channel = this.videoChannel(request.model, request.channelId, view)
    if (channel === undefined) {
      throw new VideoGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    // Map the panel's alias onto the channel's upstream id, exactly like the
    // image path does, so the engine always sends the real gateway model id.
    const mapping = (channel.videoModels ?? []).find(row => row.alias === request.model)
    const upstream = mapping?.id ?? request.model
    const family = describeVideoModel(upstream).family
    if (family === 'unknown') {
      throw new VideoGenError(`渠道「${channel.name}」未为模型「${request.model}」配置视频协议族；请在渠道的视频模型中改用受支持的视频模型`, 'video-unknown-model')
    }

    // ---- director step ----------------------------------------------------
    // Runs BEFORE the engine and its output IS the request: the planned prompt
    // and parameters are what gets submitted. With planning off the request is
    // passed through untouched (the historical behaviour).
    let plan: VideoDirectorPlan | undefined
    let effective: VideoGenerateRequest = { ...request, upstream }
    if (request.plan === true) {
```

</details>

**依据 3 · 源码核查**：[src/generation-runtime.ts:217-230](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/generation-runtime.ts#L217-L230)

采用预览或新规划，并记录降级。

<details>
<summary>查看原文（14行）</summary>

```text
      const startedAt = Date.now()
      plan = request.planPreview !== undefined
        ? adoptPlan(request, upstream)
        : await this.planVideoRequest(request, signal)
      if (plan.degraded) {
        // A degraded plan still renders, but the reason has to survive: it is
        // the difference between "the chat model is down" and "the chat model
        // answered nonsense", and nothing else records it.
        recordDiagnostic({
          phase: 'video-plan',
          channel: channel.name,
          model: request.model,
          mode: request.mode,
          url: 'chat/completions',
```

</details>

**依据 4 · 源码核查**：[src/video-director.ts:497-510](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-director.ts#L497-L510)

未配置聊天模型时使用启发式规划。

<details>
<summary>查看原文（14行）</summary>

```text
export async function planVideo(
  input: VideoPlanInput,
  config: PromptModelConfig | undefined,
  complete: ChatCompleter | undefined,
  signal?: AbortSignal,
): Promise<VideoPlan> {
  const prompt = requirePrompt(input.prompt)
  const chinese = looksChinese(prompt)
  const configured = config !== undefined && config.model.trim() !== '' && config.apiUrl.trim() !== ''
  if (!configured || complete === undefined) {
    // No chat model is a legitimate setup (the studio works without one), so
    // this is the offline path rather than an error: the plan still happens.
    const plan = finalize(heuristicRaw(input, prompt), { ...input, prompt }, 'heuristic', '未配置对话模型，使用离线镜头规划')
    return plan
```

</details>

#### 缺口

- 没有同一提示词、素材和预算的合格短片对照。
  **影响**：无法证明生成质量、交付时间或费用改善。
  **进一步探讨**：固定镜头验收表，对照独立渠道与工作室记录每次提交和人工调整。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 异步恢复、取消与重试分别产生什么状态？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

远端提交事件把远端任务 ID 加入本地任务，并启动异步 pending 写入；写入未被 await，进程在落盘前退出仍可能丢恢复线索。已记录的任务重启时带 resume 参数以轮询原 ID；主动重试删除 resume 后重新提交，应单独核对新费用。取消立即写本地 cancelled 并中止本地控制器，再异步问远端。此构建的远端取消函数直接返回 unsupported，因此无法用本地取消断言供应商停止。恢复任务也不会重建原提交上下文。总成本应包括规划、远端生成、可能继续计费的取消任务、下载和人工排查，金额与频率未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/video-task-queue.ts:131-149](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L131-L149)

远端 ID 更新和异步持久化有不同提交点。

<details>
<summary>查看原文（19行）</summary>

```text
    onVideoSubmitted(event => {
      if (event.signal === undefined) return
      const localId = this.signalTasks.get(event.signal)
      if (localId === undefined) return
      const task = this.tasks.find(item => item.id === localId)
      if (task === undefined) return
      task.remoteTaskId = event.remoteTaskId
      this.remoteOf.set(localId, event)
      this.publish(task)
      void this.persistPending(task, event).catch(() => { /* the render still proceeds */ })
    })
  }

  /** Persist one in-flight render; failures are reported, never fatal. */
  private async persistPending(task: VideoTask, event: VideoSubmitEvent): Promise<void> {
    const request = event.request
    const entry: PendingVideoTask = {
      localTaskId: task.id,
      remoteTaskId: event.remoteTaskId,
```

</details>

**依据 2 · 源码核查**：[src/video-task-queue.ts:217-249](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L217-L249)

本地取消、abort 和远端结果分开。

<details>
<summary>查看原文（33行）</summary>

```text
  cancel(id: string): VideoTask | undefined {
    const task = this.tasks.find(item => item.id === id)
    if (task === undefined || task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') return task
    task.status = 'cancelled'
    task.finishedAt = Date.now()
    task.remoteCancel = 'pending'
    this.controllers.get(id)?.abort()
    this.publish(task)
    this.trimTerminal()
    // The record stays until the remote attempt answered: if this process dies
    // while the provider is still rendering, the next start must find it (and
    // must NOT resume it — a cancelled task is never re-queued).
    void this.settleRemoteCancel(task)
    this.drain()
    return this.snapshot(task)
  }

  /** Ask the provider to stop, then record the honest answer on the task. */
  private async settleRemoteCancel(task: VideoTask): Promise<void> {
    let outcome: VideoCancelState
    try {
      outcome = task.remoteTaskId === undefined ? 'unsupported' : await this.hooks.cancelRemote(this.snapshot(task))
    } catch (error) {
      // A failed cancel must not resurrect the task, but it must not claim success
      // either: "the request never landed" is exactly `unconfirmed`.
      this.hooks.recordFailure({
        taskId: task.id,
        model: task.request.model,
        mode: task.request.mode,
        message: error instanceof Error ? error.message : String(error),
        code: 'video-cancel-failed',
      })
      outcome = 'unconfirmed'
```

</details>

**依据 3 · 源码核查**：[src/video-task-queue.ts:300-318](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L300-L318)

恢复任务带原 ID，并明确没有原提交上下文。

<details>
<summary>查看原文（19行）</summary>

```text
          prompt: entry.request.prompt,
          aspectRatio: entry.request.aspectRatio,
          resolution: entry.request.resolution as VideoGenerateRequest['resolution'],
          seconds: entry.request.seconds,
          upstream: entry.upstream,
          ...entry.channelId === undefined ? {} : { channelId: entry.channelId },
          ...entry.request.refName === undefined ? {} : { refName: entry.request.refName },
          resume: { taskId: entry.remoteTaskId, family: entry.family, submittedAt: entry.submittedAt },
        },
        status: 'queued',
        createdAt: entry.submittedAt,
        remoteTaskId: entry.remoteTaskId,
        resumedAt: Date.now(),
      }
      this.tasks.unshift(task)
      // 不写 `remoteOf`：恢复出来的任务没有本进程的 submit 上下文（渠道凭据
      // 属于上一次进程，重启后可能已经改了或删了）。取消时 `cancelRemote`
      // 会因为「没有上下文」直接答 `'unsupported'`，而不是拿着一个空 URL 去
      // 请求；真实的渠道由 `runVideo` 在恢复轮询时按 `channelId` 重新解析。
```

</details>

**依据 4 · 源码核查**：[src/video-task-queue.ts:336-341](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L336-L341)

retry 移除 resume 后重新提交。

```text
  retry(id: string): VideoTask | undefined {
    const previous = this.tasks.find(item => item.id === id)
    if (previous === undefined) return undefined
    const request = { ...previous.request }
    delete request.resume
    return this.submit(request)
```

**依据 5 · 源码核查**：[src/video-engine.ts:129-138](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-engine.ts#L129-L138)

当前取消函数总返回 unsupported。

<details>
<summary>查看原文（10行）</summary>

```text
export async function cancelRemoteVideo(
  upstream: VideoUpstreamConfig,
  target: { taskId: string; family: string; model: string; mode: string; signal?: AbortSignal },
): Promise<'stopped' | 'unconfirmed' | 'unsupported'> {
  if (target.taskId.trim() === '') return 'unsupported'
  if ((REMOTE_CANCEL[target.family] ?? 'unsupported') !== 'supported') return 'unsupported'
  // 每个协议族都是 'unsupported' 时这里走不到。等某一天真测到了取消端点，
  // 把那个族改成 'supported'，再在这里补发请求并把结果映射成
  // 'stopped' / 'unconfirmed'——不要在那之前先写一段猜出来的 DELETE。
  return 'unsupported'
```

</details>

#### 缺口

- 未复现提交与落盘之间崩溃及供应商账单状态。
  **影响**：无法验证恢复覆盖，也不能核定取消后费用。
  **进一步探讨**：隔离假端点记录每次提交，在 pending 写前后终止，回读 ID 和调用次数。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地代码路径有哪些依赖，超时能否中止帧函数？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

本地代码路径在渠道解析前分流，用聊天模型写绘图代码，本地执行并可编码成视频。编译器在空 VM context 中生成函数，2 秒 timeout 覆盖创建函数阶段；真正逐帧调用在普通同步函数中执行，帧前才检查 abort 和总预算。帧函数若不返回，无法回到下一次检查，取消与预算也就无法及时执行。注释中的限制意图没有形成该同步调用的抢占边界。短片拼接还需要本地 ffmpeg 和 ffprobe。部署者要核对生成代码的运行方式、资源占用及服务失去响应后的终止途径，单凭源码无法接受任意生成代码。

#### 证据与依据

**依据 1 · 源码核查**：[src/generation-runtime.ts:176-183](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/generation-runtime.ts#L176-L183)

本地代码在渠道解析前分支。

```text
  /** Generate one video: submit, poll, download, then persist the clip. */
  async runVideo(request: VideoGenerateRequest, signal?: AbortSignal): Promise<VideoGenerateResult> {
    // ---- code path --------------------------------------------------------
    // `renderer: 'code'` is a different production path, not a different model:
    // a chat model writes drawing code and this host renders it. It runs
    // BEFORE channel resolution on purpose — the whole point is that no video
    // provider (and no video model alias) is needed.
    if (request.renderer === 'code') return await this.runVideoCode(request, signal)
```

**依据 2 · 源码核查**：[src/code-render.ts:481-503](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/code-render.ts#L481-L503)

VM timeout 仅在返回 factory 时使用，帧函数后续直接调用。

<details>
<summary>查看原文（23行）</summary>

```text
  const sandbox = vm.createContext(Object.create(null) as Record<string, unknown>)
  let factory: unknown
  try {
    // `ctx` is a parameter of the wrapper, not a global: the generated code can
    // only draw, and only through the API it was handed.
    factory = vm.runInContext(
      `(function(ctx, frame, Math, JSON, Array, Object, String, Number, Boolean, isFinite, isNaN) {${code}\n})`,
      sandbox,
      { timeout: 2_000, filename: 'generated-render.js', displayErrors: true },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new CodeRenderError(`生成的代码无法编译：${message}`, 'code-syntax', true)
  }
  if (typeof factory !== 'function') {
    throw new CodeRenderError('生成的代码不是可调用的渲染函数', 'code-syntax', true)
  }
  return (api, frameIndex) => {
    // `frame` and the constructor globals are passed in so a sandboxed body
    // cannot reach `globalThis` to escape — the context itself is empty.
    (factory as (ctx: FrameApi, frame: number, m: Math, j: JSON, a: unknown, o: unknown, s: unknown, n: unknown, b: unknown, f: unknown, nan: unknown) => void)(
      api, frameIndex, Math, JSON, Array, Object, String, Number, Boolean, isFinite, isNaN,
    )
```

</details>

**依据 3 · 源码核查**：[src/code-render.ts:713-730](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/code-render.ts#L713-L730)

预算和信号在 renderer 前检查，调用本身同步。

<details>
<summary>查看原文（18行）</summary>

```text
  const renderer = compileRenderer(source)
  const budgetMs = request.timeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS
  const deadline = Date.now() + budgetMs

  const renderFrame = (frameIndex: number): Buffer => {
    if (options.signal?.aborted === true) throw new CodeRenderError('代码渲染已取消', 'render-cancelled')
    if (Date.now() > deadline) {
      throw new CodeRenderError(`代码渲染超时（已用 ${Math.round(budgetMs / 1000)} 秒）`, 'render-timeout', true)
    }
    const buffer = Buffer.alloc(width * height * 4)
    const api = createFrameApi(buffer, width, height, fps, seconds, frameIndex)
    try {
      renderer(api, frameIndex)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new CodeRenderError(`生成的代码运行出错（第 ${frameIndex + 1} 帧）：${message}`, 'code-runtime', true)
    }
    return buffer
```

</details>

**依据 4 · 源码核查**：[src/clip-compose.ts:360-369](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/clip-compose.ts#L360-L369)

本地拼接要求两种二进制工具。

<details>
<summary>查看原文（10行）</summary>

```text
    if (cached === undefined) cached = { ffmpeg: findTool('ffmpeg'), ffprobe: findTool('ffprobe') }
    return cached
  }

  const requireTools = (): Required<ToolPair> => {
    const found = locate()
    if (found.ffmpeg === undefined || found.ffprobe === undefined) {
      throw new Error(`ffmpeg and ffprobe are both required; ${describeTools(found)}`)
    }
    return { ffmpeg: found.ffmpeg, ffprobe: found.ffprobe }
```

</details>

#### 缺口

- 没有隔离运行的恶意帧或进程终止实验。
  **影响**：可从同步接线判断不可抢占窗口，实际阻塞影响与逃逸范围仍未验证。
  **进一步探讨**：把渲染移到可终止的独立进程，在隔离环境注入不返回帧并记录取消与宿主存活。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应采用哪条验证路径，任务账本和独立进程能改善什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前适合先观察任务恢复与代码隔离，尤其是准备将工作室用于付费视频或长时间自动流水线的人。先在不产生真实费用的隔离端点检查提交 ID、恢复、取消和重试，再用预算受控的真实生成逐个核对远端状态；本轮没有执行这些步骤。需要真实作品时可继续使用自己已验收的独立生成渠道。设计假设分两部分：远端操作账本保留提交、确认与费用未知状态，避免超时直接重提；代码渲染由独立进程及外部时间预算收口。用同样的故障时序比较重复提交数、账单未知任务和宿主存活。若仍出现无 ID 重复提交，或无法结束不返回帧，两种改动都未达到目标。

#### 证据与依据

**依据 1 · 源码核查**：[src/video-task-queue.ts:131-149](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L131-L149)

任务账本需覆盖远端提交与 durable pending 间窗口。

<details>
<summary>查看原文（19行）</summary>

```text
    onVideoSubmitted(event => {
      if (event.signal === undefined) return
      const localId = this.signalTasks.get(event.signal)
      if (localId === undefined) return
      const task = this.tasks.find(item => item.id === localId)
      if (task === undefined) return
      task.remoteTaskId = event.remoteTaskId
      this.remoteOf.set(localId, event)
      this.publish(task)
      void this.persistPending(task, event).catch(() => { /* the render still proceeds */ })
    })
  }

  /** Persist one in-flight render; failures are reported, never fatal. */
  private async persistPending(task: VideoTask, event: VideoSubmitEvent): Promise<void> {
    const request = event.request
    const entry: PendingVideoTask = {
      localTaskId: task.id,
      remoteTaskId: event.remoteTaskId,
```

</details>

**依据 2 · 源码核查**：[src/video-task-queue.ts:336-341](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/video-task-queue.ts#L336-L341)

主动 retry 会形成新提交。

```text
  retry(id: string): VideoTask | undefined {
    const previous = this.tasks.find(item => item.id === id)
    if (previous === undefined) return undefined
    const request = { ...previous.request }
    delete request.resume
    return this.submit(request)
```

**依据 3 · 源码核查**：[src/code-render.ts:717-730](https://github.com/q253595422/dsh-imagegen-video/blob/858af3501f4073a5bf250fa3766b5a76b9e8aa51/src/code-render.ts#L717-L730)

同步帧调用界定进程隔离的验证对象。

<details>
<summary>查看原文（14行）</summary>

```text
  const renderFrame = (frameIndex: number): Buffer => {
    if (options.signal?.aborted === true) throw new CodeRenderError('代码渲染已取消', 'render-cancelled')
    if (Date.now() > deadline) {
      throw new CodeRenderError(`代码渲染超时（已用 ${Math.round(budgetMs / 1000)} 秒）`, 'render-timeout', true)
    }
    const buffer = Buffer.alloc(width * height * 4)
    const api = createFrameApi(buffer, width, height, fps, seconds, frameIndex)
    try {
      renderer(api, frameIndex)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new CodeRenderError(`生成的代码运行出错（第 ${frameIndex + 1} 帧）：${message}`, 'code-runtime', true)
    }
    return buffer
```

</details>

#### 缺口

- 假设未实现，真实供应商状态未核验。
  **影响**：无法确认减少重复计费和宿主阻塞。
  **进一步探讨**：分别对账本与独立进程做故障对照，再决定是否进入付费任务。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
