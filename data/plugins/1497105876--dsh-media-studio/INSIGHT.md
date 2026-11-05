# dsh-media-studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[6e45d06](https://github.com/1497105876/dsh-media-studio/tree/6e45d0698e09c03b93de3e42dc81a4c6d009bd71)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 会话生成或发送图片与视频，并提供内联预览和后台推送。

> **亮点**：[Q01](#research-q01) 将生成、保存和查看媒体接到同一会话。

> **主要限制**：[Q02](#research-q02) 后台可在无 jobId 时继续，结果送达和远端取消需独立核对，文件读取沿用宿主权限。

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
  - [Q01 · 创作者能否在一次会话完成媒体生成与交付？](#detail-section-11)
  - [Q02 · 后台启动、取消和数据访问边界在哪里？](#detail-section-12)
  - [Q03 · 如何试用并避免无法核对的后台费用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：内容创作者需要生成媒体并在当前聊天审阅。

在外部生成媒体，下载后手动传回 DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图像与视频生成 | 获得可审阅媒体 | 取决于 provider、凭据与素材披露 |
| 后台回推 | 等待后在会话查收 | 无 jobId 时仍可能生成，送达需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host 与 Web 客户端 | 必需 | 调用、附件及媒体呈现 | 缺服务或版本不符时不可用 |
| 测试 provider 及凭据 | 生成必需 | 提交图像和视频 | 拒绝、超时或响应格式不符 |
| 隔离文件与输出目录 | 受控验收必需 | 参考图及产物存取 | 可能读取或写入非预期位置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置测试 provider 和可披露素材 | 确认目录及凭据 |
| 生成 | 用户先同步再验收后台 | 核对文件与会话 |
| 退出 | 用户停用并查上游状态 | 避免未知结果重复请求 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务费用未知 | 配置模型、凭据和目录 | 接口兼容要验收 |
| 持续 | 生成、轮询和磁盘资源未知 | 复核内容和会话送达 | 后台不一定可追踪 |
| 失败 | 恢复成本未知 | 查上游与本地文件 | 客户端取消不证明停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话媒体交付 | 生成并落盘或展示 | 真实成功率及节时 |
| 后台任务 | 异步开始并尝试回推 | 送达、取消与扣费 |

> **思考**：[Q02](#research-q02) 后台可在无 jobId 时继续，结果送达和远端取消需独立核对，文件读取沿用宿主权限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将生成、保存和查看媒体接到同一会话。

[Q02](#research-q02) detached 回退与已注册 job 的控制语义不同，产物可能生成但未送达。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 后台可在无 jobId 时继续，结果送达和远端取消需独立核对，文件读取沿用宿主权限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用可披露素材和测试模型核对同步，再检查后台是否可追踪。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认生成及回推分支。实际质量、收费、取消和权限未验收。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/tools.ts、src/jobs.ts、src/media.ts、src/providers.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host、provider、媒体文件及任务代码。未运行目标、宿主或真实服务，也未核实价格。
- 下一步：验收同步、后台、job 拒绝、断线、关闭会话、文件路径和真实费用。

**分析版本**

- **仓库**：[1497105876/dsh-media-studio](https://github.com/1497105876/dsh-media-studio)
- **版本号**：2.1.204（[固定提交 6e45d06](https://github.com/1497105876/dsh-media-studio/tree/6e45d0698e09c03b93de3e42dc81a4c6d009bd71)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 收费请求前要求可追踪任务或明确同步回退，测重复提交。

验收同步、后台、job 拒绝、断线、关闭会话、文件路径和真实费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 2794 | 2656 | 258 | — |
| .md | source | 1 | 151 | — | — | 1641 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1303 | 1095 | 140 | — |
| .ts | source | 12 | 1850 | 1465 | 279 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：内容创作者能否从 DSH 生成可交付媒体，并核对后台执行、文件与费用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 创作者能否在一次会话完成媒体生成与交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

创作者可在 DSH 从工具或斜杠命令请求图像、视频，也可把已有文件纳入会话。相比切换到生成网页再手动回传，默认后台流程为结果落盘并尝试回推拥有该会话的 Agent。同步入口则返回媒体结果。成功应看实际预览、文件和目标会话，started 只是开始。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-28](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/README.md#L7-L28)

作者的生成、预览和后台流程。

<details>
<summary>查看原文（22行）</summary>

```text
在 dsh（DeepSeek Harness）聊天里**直接生成图片 / 视频**并发送到会话的插件。
模型侧拿到 `generate_image` / `generate_video` / `send_media` 三个工具，人侧拿到
内联画廊、可播放的视频卡片，支持下载与用系统默认应用打开；长耗时生成默认走
后台任务，完成后自动把结果推送回会话。

生成后端可插拔：内置 **Agnes**（免费额度，图生图 / 首尾帧 / 参考图视频）与
**OpenAI 兼容**两种适配器，预设硅基流动、阿里百炼、Gemini（OpenAI 兼容端点）、
Sora 2 等条目，也可以在配置里加任意 `baseURL + model + apiKeyEnv` 的自定义条目。

## 功能

| 能力 | 说明 |
|---|---|
| 文生图 / 图生图 | `generate_image`：本地路径、https URL、data URI 均可作参考图 |
| 文生视频 | `generate_video`：支持首尾帧（keyframe）与参考图（reference）两种模式 |
| 发送本地媒体 | `send_media`：把已有图片 / 视频文件以画廊 / 文件卡片形式进入会话 |
| 斜杠命令 | `/image`、`/video`，加 `--wait` 前缀同步等待并在命令卡片内联展示 |
| 后台生成 | 默认走 `ctx.jobs` 后台任务，立即返回任务句柄，完成后自动推送 |
| 富渲染 | 工具行 / 命令行内联画廊与视频播放器，支持下载、灯箱查看、系统默认应用打开 |
| 自动保存 | 写进输出目录，默认按 profile 隔离（见「配置」一节） |
| 凭据安全 | API key 走 `credential-ref`（环境变量名），永不写进配置文件 |
| 设置卡片 | 插件详情页内的官方样式配置卡片：模型条目、默认参数、高级参数 |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:19-33](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/index.ts#L19-L33)

Host 注册工具与命令。

<details>
<summary>查看原文（15行）</summary>

```text
import { registerMediaCommands } from './commands.js'
import { registerMediaTools } from './tools.js'

export const name = 'media-studio'

export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials']

export { Config }
export type { MediaStudioConfig }
export type { MediaModelEntry, MediaItemMeta, MediaResultMeta, CommandMediaPayload } from './types.js'

export function apply(ctx: Context, config: MediaStudioConfig): void {
  registerMediaTools(ctx, config)
  registerMediaCommands(ctx, config)
}
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:315-357](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/tools.ts#L315-L357)

同步与后台分支。

<details>
<summary>查看原文（43行）</summary>

```text
    async execute(args, exec) {
      const entry = resolveModel(config.imageModels.get(), config.defaultImageModel.get(), args.model, 'image')
      const apiKey = await resolveApiKey(ctx, entry)
      const referenceImages = await Promise.all((args.reference_images ?? []).map(readReferenceImage))
      const gc = generationContext(ctx, config, sessionCwd(exec.agent))
      const params = {
        prompt: args.prompt,
        resolution: args.resolution ?? config.imageResolution.get(),
        aspectRatio: args.aspect_ratio ?? config.imageAspectRatio.get(),
        referenceImages,
      }
      const base = {
        kind: 'image-generation' as const,
        prompt: params.prompt,
        model: entry.id,
        provider: entry.provider as MediaProvider,
      }
      if (args.run_in_background === false) {
        const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal: exec.signal })
        return { ...base, status: 'completed' as const, images }
      }
      const owner = exec.agent?.id
      const jobId = startMediaJob(ctx, {
        kind: 'media-image',
        label: params.prompt,
        owner,
        work: async (job, signal) => {
          job.updateProgress(`generating image with ${entry.id}…`)
          const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal })
          const summary = formatImageSummary(images)
          const agent = lookupAgent(ctx, owner)
          if (agent !== undefined) {
            deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`)
          }
          return { summary }
        },
      })
      return {
        ...base,
        status: 'started' as const,
        ...(jobId === undefined ? {} : { jobId }),
        images: [],
      }
```

</details>

**依据 4 · 源码核查**：[src/jobs.ts:36-65](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/jobs.ts#L36-L65)

目标会话查找与通知。

<details>
<summary>查看原文（30行）</summary>

```text
/** Look up the live agent owning a session id. */
export function lookupAgent(ctx: Context, sessionId: Agent['id'] | undefined): Agent | undefined {
  if (sessionId === undefined) return undefined
  const registry = (ctx as unknown as { get(name: string): unknown }).get('agents') as AgentRegistryLike | undefined
  return registry?.get(sessionId)
}

/**
 * Deliver finished media into the owning conversation as a completion notice.
 *
 * The message source declares this plugin's own producer kind with
 * `form: 'notice'` — exactly like `dsh-tool-jobs` completion notices — so the
 * UI renders it as a task notice (not a user bubble) and the model reads it as
 * a job outcome instead of something the user said. Image blocks render as an
 * inline gallery; text carries the auto-saved paths.
 */
export function deliverMediaMessage(agent: Agent, content: ContentBlock[], summary: string): void {
  const message = createUserMessage({
    content,
    source: { kind: 'media-studio', form: 'notice', summary: boundContextSummary(summary) },
  })
  try {
    if (agent.status === 'idle') agent.followup(message)
    else agent.inject(message)
  } catch {
    try {
      agent.inject(message)
    } catch {
      // The agent may already be disposed; nothing else to deliver to.
    }
```

</details>

#### 缺口

- 没有真实用户交付与多服务生成对照
  **影响**：不能量化节时或成品质量
  **进一步探讨**：用一张已知短提示图核对落盘和聊天展示

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后台启动、取消和数据访问边界在哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

后台使用 jobs.start 及 AbortController，注册异常会退化为 detached 执行并返回无 jobId 的 started，仍可能发出付费请求。结果推送依赖会话仍存在，失败后最多再试注入，任务完成不能证明已送达。provider 路径将 AbortSignal 用于请求和视频轮询，远端是否停止及是否扣费未确认。参考图可接受 URL、data URI 或路径，本地路径直接用宿主文件系统读取，工具调用处未限定为会话根；相对参考图路径按进程 cwd。发送本地媒体也直接读取。权限、外部端点和输出披露需要独立约束。

#### 证据与依据

**依据 1 · 源码核查**：[src/jobs.ts:52-65](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/jobs.ts#L52-L65)

消息注入失败分支。

<details>
<summary>查看原文（14行）</summary>

```text
export function deliverMediaMessage(agent: Agent, content: ContentBlock[], summary: string): void {
  const message = createUserMessage({
    content,
    source: { kind: 'media-studio', form: 'notice', summary: boundContextSummary(summary) },
  })
  try {
    if (agent.status === 'idle') agent.followup(message)
    else agent.inject(message)
  } catch {
    try {
      agent.inject(message)
    } catch {
      // The agent may already be disposed; nothing else to deliver to.
    }
```

</details>

**依据 2 · 源码核查**：[src/jobs.ts:92-128](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/jobs.ts#L92-L128)

正常 job 与 detached。

<details>
<summary>查看原文（37行）</summary>

```text
export function startMediaJob(ctx: Context, request: MediaJobRequest): string | undefined {
  const runWork = (job: MediaJobWork, controller: AbortController): Promise<JobOutcome> =>
    (async (): Promise<JobOutcome> => {
      try {
        const { summary } = await request.work(job, controller.signal)
        return { status: 'completed', detail: 'media generated', result: summary }
      } catch (error) {
        return {
          status: controller.signal.aborted ? 'killed' : 'failed',
          detail: error instanceof Error ? error.message : String(error),
        }
      }
    })()
  try {
    const jobId: JobId = ctx.jobs.start({
      kind: request.kind,
      label: request.label.slice(0, 120),
      owner: request.owner,
      run: (job): JobHooks => {
        const controller = new AbortController()
        const done = runWork({
          append: text => job.append(text),
          updateProgress: line => job.updateProgress(line),
        }, controller)
        return {
          cancel: () => controller.abort(),
          done,
        }
      },
    })
    return jobId as unknown as string
  } catch {
    // No attached job controller (or the registry refused): run detached.
    const controller = new AbortController()
    void runWork({ append: () => undefined, updateProgress: () => undefined }, controller)
    return undefined
  }
```

</details>

**依据 3 · 源码核查**：[src/media.ts:69-76](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/media.ts#L69-L76)

本地参考图读取。

```text
export async function readReferenceImage(input: string): Promise<ReferenceImage> {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return { url: trimmed }
  if (/^data:/i.test(trimmed)) return { dataUri: trimmed }
  const path = isAbsolute(trimmed) ? trimmed : resolve(process.cwd(), trimmed)
  const bytes = new Uint8Array(await readFile(path))
  const mediaType = imageMediaTypeForPath(path) ?? sniffImageMediaType(bytes) ?? 'image/png'
  return { dataUri: toDataUri(bytes, mediaType) }
```

**依据 4 · 源码核查**：[src/media.ts:163-175](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/media.ts#L163-L175)

本地媒体读取。

<details>
<summary>查看原文（13行）</summary>

```text
export async function describeLocalFile(path: string): Promise<MediaItemMeta> {
  const bytes = new Uint8Array(await readFile(path))
  const mediaType = imageMediaTypeForPath(path) ?? sniffImageMediaType(bytes)
  const extension = extname(path).toLowerCase()
  const kind: MediaItemMeta['kind'] = mediaType !== undefined
    ? 'image'
    : ['.mp4', '.mov', '.webm', '.mkv', '.m4v'].includes(extension)
      ? 'video'
      : 'file'
  return {
    kind,
    name: basename(path),
    path,
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:315-355](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/tools.ts#L315-L355)

参考图处理及 started。

<details>
<summary>查看原文（41行）</summary>

```text
    async execute(args, exec) {
      const entry = resolveModel(config.imageModels.get(), config.defaultImageModel.get(), args.model, 'image')
      const apiKey = await resolveApiKey(ctx, entry)
      const referenceImages = await Promise.all((args.reference_images ?? []).map(readReferenceImage))
      const gc = generationContext(ctx, config, sessionCwd(exec.agent))
      const params = {
        prompt: args.prompt,
        resolution: args.resolution ?? config.imageResolution.get(),
        aspectRatio: args.aspect_ratio ?? config.imageAspectRatio.get(),
        referenceImages,
      }
      const base = {
        kind: 'image-generation' as const,
        prompt: params.prompt,
        model: entry.id,
        provider: entry.provider as MediaProvider,
      }
      if (args.run_in_background === false) {
        const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal: exec.signal })
        return { ...base, status: 'completed' as const, images }
      }
      const owner = exec.agent?.id
      const jobId = startMediaJob(ctx, {
        kind: 'media-image',
        label: params.prompt,
        owner,
        work: async (job, signal) => {
          job.updateProgress(`generating image with ${entry.id}…`)
          const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal })
          const summary = formatImageSummary(images)
          const agent = lookupAgent(ctx, owner)
          if (agent !== undefined) {
            deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`)
          }
          return { summary }
        },
      })
      return {
        ...base,
        status: 'started' as const,
        ...(jobId === undefined ? {} : { jobId }),
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:490-513](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/tools.ts#L490-L513)

发送已有文件。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args) {
      const paths = args.paths
      if (paths.length === 0) throw new Error('paths must not be empty')
      const files: MediaItemMeta[] = []
      for (const rawPath of paths) {
        const described = await describeLocalFile(rawPath)
        if (described.kind === 'image') {
          const { readFile } = await import('node:fs/promises')
          const bytes = new Uint8Array(await readFile(described.path!))
          const mediaType = imageMediaTypeForPath(described.path!) ?? sniffImageMediaType(bytes) ?? 'image/png'
          const ref = await ctx.attachments.saveImage({ data: bytes, mediaType, name: described.name })
          files.push({
            ...described,
            bytes: ref.bytes,
            mediaType: ref.mediaType,
            width: ref.width,
            height: ref.height,
            attachmentId: ref.attachmentId as string,
          })
        } else {
          files.push(described)
        }
      }
      return { kind: 'media-send' as const, ...(args.caption === undefined ? {} : { caption: args.caption }), files }
```

</details>

**依据 7 · 源码核查**：[src/providers.ts:272-284](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/providers.ts#L272-L284)

超时与视频适配。

<details>
<summary>查看原文（13行）</summary>

```text
export async function generateVideo(
  entry: MediaModelEntry,
  apiKey: string,
  params: VideoGenerationParams,
): Promise<GeneratedVideo> {
  const { signal, dispose } = linkSignal(params.signal, params.timeoutMs)
  const pollDeadline = Date.now() + params.pollTimeoutMs
  try {
    return entry.provider === 'agnes'
      ? await agnesVideo(entry, apiKey, params, signal, pollDeadline)
      : await openAiVideo(entry, apiKey, params, signal, pollDeadline)
  } finally {
    dispose()
```

</details>

**依据 8 · 源码核查**：[src/providers.ts:316-344](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/providers.ts#L316-L344)

提交与轮询结果。

<details>
<summary>查看原文（29行）</summary>

```text
  const submitted = await requestJson(`${entry.baseURL}/videos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, signal) as Record<string, unknown>
  const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
    : typeof submitted.id === 'string' ? submitted.id : undefined
  if (videoId === undefined) throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`)
  params.onProgress?.(`video task submitted: ${videoId}`)
  // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
  const queryBase = new URL(entry.baseURL).origin
  const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`
  for (;;) {
    if (Date.now() > pollDeadline) throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`)
    await sleep(params.pollIntervalMs, signal)
    const status = await requestJson(queryUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
    }, signal) as Record<string, unknown>
    const state = typeof status.status === 'string' ? status.status : ''
    if (state === 'completed') {
      const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined
      if (url === undefined) throw new Error(`video task completed without a url: ${JSON.stringify(status).slice(0, 500)}`)
      const downloaded = await fetchBytes(url, signal, entry.model)
      return { bytes: downloaded.bytes, mediaType: 'video/mp4' }
    }
    if (state === 'failed') {
      const error = status.error as { message?: string } | null
      throw new Error(`video task failed: ${error?.message ?? JSON.stringify(status).slice(0, 500)}`)
```

</details>

#### 缺口

- 未做真实宿主、路径限制和远端取消验收
  **影响**：不能确认没有错误披露、重复生成或生成后丢交付
  **进一步探讨**：用模拟上游测试丢回包、拒绝启动、关闭会话与文件越界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并避免无法核对的后台费用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先配置兼容 DSH、测试模型、Host 凭据与独立目录，确认参考图可披露。用同步模式先核对一次请求与输出，再测试后台结果、目标会话和取消。若无 jobId 或无法确认远端状态，停止继续生成，直接检查上游和落盘。可验证把无注册 job 的状态明确暴露并在收费操作前要求可追踪任务或显式同步回退。以模拟注册失败和响应丢失对照重复请求、孤儿产物和成功交付时间，若不能降低重复或无法覆盖正常交付则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:22-33](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/index.ts#L22-L33)

Host 服务依赖。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'media-studio'

export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials']

export { Config }
export type { MediaStudioConfig }
export type { MediaModelEntry, MediaItemMeta, MediaResultMeta, CommandMediaPayload } from './types.js'

export function apply(ctx: Context, config: MediaStudioConfig): void {
  registerMediaTools(ctx, config)
  registerMediaCommands(ctx, config)
}
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:101-112](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/tools.ts#L101-L112)

凭据解析及失败。

<details>
<summary>查看原文（12行）</summary>

```text
export async function resolveApiKey(ctx: Context, entry: MediaModelEntry): Promise<string> {
  const envName = entry.apiKeyEnv.trim()
  if (envName === '') throw new Error(`model "${entry.id}" has no apiKeyEnv configured`)
  try {
    const resolved = await ctx.credentials.resolve(credentialRef(envName))
    if (resolved?.value !== undefined && resolved.value !== '') return resolved.value
  } catch {
    // Fall through to the plain environment below.
  }
  const fromEnv = process.env[envName]
  if (fromEnv !== undefined && fromEnv !== '') return fromEnv
  throw new Error(`missing API key: set the ${envName} environment variable (model "${entry.id}")`)
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:332-357](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/tools.ts#L332-L357)

同步退路与 jobId 可缺。

<details>
<summary>查看原文（26行）</summary>

```text
      if (args.run_in_background === false) {
        const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal: exec.signal })
        return { ...base, status: 'completed' as const, images }
      }
      const owner = exec.agent?.id
      const jobId = startMediaJob(ctx, {
        kind: 'media-image',
        label: params.prompt,
        owner,
        work: async (job, signal) => {
          job.updateProgress(`generating image with ${entry.id}…`)
          const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal })
          const summary = formatImageSummary(images)
          const agent = lookupAgent(ctx, owner)
          if (agent !== undefined) {
            deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`)
          }
          return { summary }
        },
      })
      return {
        ...base,
        status: 'started' as const,
        ...(jobId === undefined ? {} : { jobId }),
        images: [],
      }
```

</details>

**依据 4 · 源码核查**：[src/jobs.ts:105-128](https://github.com/1497105876/dsh-media-studio/blob/6e45d0698e09c03b93de3e42dc81a4c6d009bd71/src/jobs.ts#L105-L128)

取消与注册异常处理。

<details>
<summary>查看原文（24行）</summary>

```text
  try {
    const jobId: JobId = ctx.jobs.start({
      kind: request.kind,
      label: request.label.slice(0, 120),
      owner: request.owner,
      run: (job): JobHooks => {
        const controller = new AbortController()
        const done = runWork({
          append: text => job.append(text),
          updateProgress: line => job.updateProgress(line),
        }, controller)
        return {
          cancel: () => controller.abort(),
          done,
        }
      },
    })
    return jobId as unknown as string
  } catch {
    // No attached job controller (or the registry refused): run detached.
    const controller = new AbortController()
    void runWork({ append: () => undefined, updateProgress: () => undefined }, controller)
    return undefined
  }
```

</details>

#### 缺口

- 真实 provider 价格、额度和故障未运行
  **影响**：不可估算生成成本或后台可靠性
  **进一步探讨**：在测试 provider 模拟取消、断线和重复提交

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
