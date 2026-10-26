# dsh-media-studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[80096b9](https://github.com/1497105876/dsh-media-studio/tree/80096b9445eb7c544ab3025d6734e12bc973782e)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在DSH对话生成图片和视频或发送本地媒体，提供后台任务、自动保存及富媒体展示。

> **核心亮点**：将生成、媒体保存与会话展示结合，并将长任务转宿主jobs，减少网页下载上传步骤；生成模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：jobs注册失败会脱离控制器运行且无jobId；会话消失或推送失败不保证送达，远端ID恢复未见持久对账。见 [Q03](#research-q03)。

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
  - [Q01 · 对创作者的具体流程增量是什么？](#detail-section-11)
  - [Q02 · 生成、保存、推送如何串接？](#detail-section-12)
  - [Q03 · 后台开始是否保证可追溯完成？](#detail-section-13)
  - [Q04 · 依赖与完整任务成本是什么？](#detail-section-14)
  - [Q05 · 如何验证恢复及当前采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：创作者在DSH内从提示到可找回图片/视频，验收内容、保存和会话呈现。

服务商网页生成后下载/上传或简单脚本是替代；比较需同提示、同模型与预算，不能用工具数证明更高效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图片生成 | 文生图/参考图编辑 | 后端协议和凭据需确认 |
| 视频生成 | 提交、轮询、下载 | 远端任务恢复未验收 |
| 本地媒体发送 | 将已有文件送入会话 | 宿主文件/展示权限决定可用 |
| 后台交付 | 避免长时间阻塞 | jobs失败可detached，无句柄风险 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/jobs/commands/attachments/credentials | 启动必需 | 生成与会话接线 | 不满足不能假定可加载 |
| 已配置provider/key/网络 | 生成必需 | 远端图片/视频任务 | 核对是否已提交再重试 |
| 可写输出目录与附件存储 | 交付必需 | 保存图片/视频 | 视频始终写盘 |
| 活owner会话与Web渲染 | 会话呈现必需 | notice和画廊/播放器 | 文件成功不等于送达 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置后端/凭据和隔离目录 | 小样本协议可用 |
| 2 | 用户生成并记录job和远端ID | 文件与会话内容均可找回 |
| 3 | 用户故障注入与禁用验收 | 无孤立任务/重复生成，否则停止后台依赖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/端点/测试生成资源未知 | 模型与凭据/目录配置 | 支持协议需逐后端验收 |
| 持续使用 | 生成、轮询、下载与媒体存储 | 作品复核与目录维护 | 无合格作品单位成本 |
| 失败恢复 | 可能重复生成和孤立存储 | 对账远端/job/文件/会话 | 未知结果不能盲重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 生成与展示 | 工具、provider和媒体提交存在 | 作品质量、后端兼容 |
| 后台 | jobs与notice路径存在 | 句柄/取消/恢复和送达可靠性 |
| 成本 | 保存和轮询机制可见 | 净节时、实际金额及重试负担 |

> **思考**：jobs注册失败会脱离控制器运行且无jobId；会话消失或推送失败不保证送达，远端ID恢复未见持久对账。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将生成、媒体保存与会话展示结合，并将长任务转宿主jobs，减少网页下载上传步骤；生成模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

将生成、媒体保存与会话展示结合，并将长任务转宿主jobs，减少网页下载上传步骤；生成模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

JSON结果与presentationMeta一致、notice来源清楚有助复用；detached fallback牺牲可观测/取消，适合明确暴露降级而非继续称可靠job。远端ID和本地提交需统一事务状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

jobs注册失败会脱离控制器运行且无jobId；会话消失或推送失败不保证送达，远端ID恢复未见持久对账。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先验收远端提交后断连与job失败的可追溯恢复，再决定后台试用。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持生成与交付编排；后台恢复、远端对账和实际质量未验证；阶段回执为假设。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/tools.ts、src/jobs.ts、src/media.ts、src/providers.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查tools/jobs/media/providers/index，不运行目标代码、模型生成、远端服务或宿主；未全面审计所有provider与native-open。
- 下一步：用廉价测试后端逐阶段注入故障，比对远端任务、job、文件、会话并测总成本和人工恢复。

**分析版本**

- **仓库**：[1497105876/dsh-media-studio](https://github.com/1497105876/dsh-media-studio)
- **版本号**：0.7.0（[固定提交 80096b9](https://github.com/1497105876/dsh-media-studio/tree/80096b9445eb7c544ab3025d6734e12bc973782e)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的持久阶段回执与原远端ID核对，可能减少重复生成和丢交付；以四阶段故障矩阵测净收益。见 [Q05](#research-q05)。

用廉价测试后端逐阶段注入故障，比对远端任务、job、文件、会话并测总成本和人工恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 2774 | 2641 | 253 | — |
| .md | source | 1 | 302 | — | — | 1687 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1303 | 1095 | 140 | — |
| .ts | source | 12 | 1829 | 1450 | 274 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/1497105876/dsh-media-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：媒体生成后台化能否把DSH里的创作请求变成可找回的图片/视频交付，而不是仅返回任务已开始？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对创作者的具体流程增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是需要在DSH工作流中生成或发送图片/视频的创作者。合格交付应是生成内容符合要求、结果保存可找回并能在会话呈现；返回started或jobId只是开始。相对服务商网页生成后下载再上传，插件统一三个工具、命令、文件与富展示，并把长视频生成转后台。研究识别的贡献为服务适配和交付编排，不是图像/视频模型创新；预设模型名和免费额度属于作者材料，不能推断服务当前可用或总成本更低。

#### 证据与依据

**依据 1 · 作者声明**：[src/index.ts:1-10](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/index.ts#L1-L10)

作者描述生成/保存/会话交付

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * @gw/dsh-media-studio — DeepSeek Harness plugin.
 *
 * Host half: registers `generate_image` / `generate_video` / `send_media`
 * tools plus the `/image` `/video` slash commands, backed by pluggable
 * generation providers (Agnes presets + OpenAI-compatible custom entries).
 * Generated media is auto-saved to the output directory and delivered to the
 * chat (inline image gallery; video file + playable path), while the browser
 * half (`./client`) renders rich tool rows and command rows with preview,
 * download actions.
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:267-283](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/tools.ts#L267-L283)

图片工具输入与后台默认

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'generate_image',
    description:
      '生成图片并在对话中展示。支持文生图与图生图（reference_images 传本地路径或 https URL）。'
      + '默认后台生成（run_in_background: true）：立即返回任务句柄，完成后图片推送到会话；'
      + '设为 false 则同步等待并在工具结果里直接返回图片。',
    parameters: {
      prompt: { type: 'string', required: true, description: '图片描述 / 编辑指令（中文英文均可）' },
      model: { type: 'string', description: '生图模型条目 id（见插件配置 imageModels）；省略用默认模型' },
      resolution: { type: 'string', enum: RESOLUTIONS, description: '分辨率档位，默认取配置 imageResolution' },
      aspect_ratio: { type: 'string', enum: ASPECT_RATIOS, description: '画幅比例，默认取配置 imageAspectRatio' },
      reference_images: {
        type: 'array',
        items: { type: 'string' },
        description: '图生图参考图：本地文件路径、https URL 或 data URI。必须是字符串数组，即使只有一张：["C:\\a.png"]',
      },
      run_in_background: { type: 'boolean', description: '默认 true：后台生成完成后推送进会话；false：同步等待并在结果里返回图片' },
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:330-354](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/tools.ts#L330-L354)

同步/后台和started区别

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

#### 缺口

- 缺少实际创作案件及网页流程对照
  **影响**：无法确认端到端节时和作品质量
  **进一步探讨**：同提示与预算对照可用作品率、总时间与返工

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成、保存、推送如何串接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具解析模型和凭据、读取参考图、固定generationContext；同步模式用执行signal，后台模式通过ctx.jobs拥有独立controller。work调用provider后保存媒体并查owner agent，idle时followup、忙时inject带media-studio notice。图片先写attachment，可选再自动存文件；视频总是写磁盘供播放器使用。provider为视频先提交拿远端ID，再轮询下载。可借鉴的是模型结果与UI metadata共用结构、通知标明来源而非冒充用户；移植需要宿主jobs、附件、agent生命周期和文件展示接口，不是换baseURL就保证所有协议兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:313-347](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/tools.ts#L313-L347)

生成上下文、后台与owner推送

<details>
<summary>查看原文（35行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/jobs.ts:52-65](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/jobs.ts#L52-L65)

idle/busy通知及失败吞掉

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

**依据 3 · 源码核查**：[src/media.ts:109-143](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/media.ts#L109-L143)

图片attachment与视频磁盘提交

<details>
<summary>查看原文（35行）</summary>

```text
export async function commitImage(
  attachments: AttachmentStore,
  options: CommitOptions & { mediaType: ImageMediaType },
): Promise<MediaItemMeta> {
  const ref = await attachments.saveImage({
    data: options.bytes,
    mediaType: options.mediaType,
    name: basename(options.name),
  })
  let path: string | undefined
  if (options.autoSave) {
    path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes)
  }
  return {
    kind: 'image',
    name: ref.name ?? basename(options.name),
    ...(path === undefined ? {} : { path }),
    bytes: ref.bytes,
    mediaType: ref.mediaType,
    width: ref.width,
    height: ref.height,
    attachmentId: ref.attachmentId as string,
  }
}

/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options: CommitOptions): Promise<MediaItemMeta> {
  const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes)
  return {
    kind: 'video',
    name: basename(options.name),
    path,
    bytes: options.bytes.byteLength,
    mediaType: 'video/mp4',
  }
```

</details>

**依据 4 · 源码核查**：[src/providers.ts:316-334](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/providers.ts#L316-L334)

远端视频ID与轮询

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 后台开始是否保证可追溯完成？

**研究主题**：缺陷与关键质疑

#### 完整回答

不保证。startMediaJob若jobs.start抛错，会以新AbortController脱离任务控制器运行并返回undefined；工具仍返回started，调用者可能没有可取消/查询jobId。work仅在owner还能查到时推送，deliver两次失败也吞掉，因此生成成功与聊天送达是不同状态。远端视频提交后超出poll预算会报错，但抽读路径未见把远端ID保存成可重启核对的事务；若用户再发生成请求，可能重复付费/生成。这是静态恢复缺口，不是已复现丢任务。参考图相对路径还按process.cwd解析，而输出目录按会话cwd解析，需多工作区验证，避免误读文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/jobs.ts:105-127](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/jobs.ts#L105-L127)

jobs失败后detached fallback

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/jobs.ts:52-65](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/jobs.ts#L52-L65)

推送失败不再返回给用户

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

**依据 3 · 源码核查**：[src/tools.ts:341-347](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/tools.ts#L341-L347)

owner不存在时不推送

```text
          const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal })
          const summary = formatImageSummary(images)
          const agent = lookupAgent(ctx, owner)
          if (agent !== undefined) {
            deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`)
          }
          return { summary }
```

**依据 4 · 源码核查**：[src/providers.ts:321-329](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/providers.ts#L321-L329)

远端ID与轮询预算

```text
  const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
    : typeof submitted.id === 'string' ? submitted.id : undefined
  if (videoId === undefined) throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`)
  params.onProgress?.(`video task submitted: ${videoId}`)
  // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
  const queryBase = new URL(entry.baseURL).origin
  const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`
  for (;;) {
    if (Date.now() > pollDeadline) throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`)
```

**依据 5 · 源码核查**：[src/media.ts:53-60](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/media.ts#L53-L60)

参考图相对路径使用进程cwd

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

#### 缺口

- 重启、取消、断连和远端任务对账未测
  **影响**：限制可靠交付与预算判断
  **进一步探讨**：提交后断网/重启，核对远端ID、文件、job及会话四方状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与完整任务成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

宿主强依赖tools/jobs/commands/attachments/credentials，真实生成依赖已配置端点、key、网络和可写目录；图片/视频协议能力需逐provider确认。参考图可由本地文件转dataURI发给后端，文字与媒体处理范围应按任务选择。首次需配置模型、凭据与输出隔离；持续费用包括生成、轮询/下载、失败重复和磁盘存储；失败要核对远端是否已完成，再决定重试。没有当前服务价格、生成负载或实际合格作品数，本轮不估算金额和ROI。视频即使autoSave关闭仍写盘，不能把开关解释成不留本地媒体。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:24-32](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/index.ts#L24-L32)

宿主强依赖与注册

```text
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials']

export { Config }
export type { MediaStudioConfig }
export type { MediaModelEntry, MediaItemMeta, MediaResultMeta, CommandMediaPayload } from './types.js'

export function apply(ctx: Context, config: MediaStudioConfig): void {
  registerMediaTools(ctx, config)
  registerMediaCommands(ctx, config)
```

**依据 2 · 源码核查**：[src/media.ts:53-60](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/media.ts#L53-L60)

本地参考图读取及外发格式

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

**依据 3 · 源码核查**：[src/media.ts:134-143](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/media.ts#L134-L143)

视频无条件磁盘保存

<details>
<summary>查看原文（10行）</summary>

```text
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options: CommitOptions): Promise<MediaItemMeta> {
  const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes)
  return {
    kind: 'video',
    name: basename(options.name),
    path,
    bytes: options.bytes.byteLength,
    mediaType: 'video/mp4',
  }
```

</details>

**依据 4 · 源码核查**：[src/providers.ts:277-282](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/providers.ts#L277-L282)

超时与轮询预算

```text
  const { signal, dispose } = linkSignal(params.signal, params.timeoutMs)
  const pollDeadline = Date.now() + params.pollTimeoutMs
  try {
    return entry.provider === 'agnes'
      ? await agnesVideo(entry, apiKey, params, signal, pollDeadline)
      : await openAiVideo(entry, apiKey, params, signal, pollDeadline)
```

#### 缺口

- 现价、失败率、存储增量和人工返工未知
  **影响**：单位合格作品成本不可计算
  **进一步探讨**：记录所有请求及远端ID，以合格作品为分母对账

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证恢复及当前采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是建立持久“已提交远端ID—已下载—已存附件/文件—已送会话”的分阶段回执，并在未知时先核对原ID，能减少重复生成和丢交付。依据是Q03分离的远端/job/文件/通知状态；新增状态应由插件唯一持有，不另建会话推送队列。最小实验使用廉价测试端点，在提交后、下载后、附件保存后、推送时故障注入，对照当前实现，统计重复远端任务、孤立文件、未送达和人工恢复时间；若状态维护成本更高且无减少错误则否定。当前建议观察，先修复/验收可追溯后台路径；可同步小样本验证协议，但不把它当可靠后台创作队列。出现未知远端结果时不要盲重发。

#### 证据与依据

**依据 1 · 源码核查**：[src/jobs.ts:105-127](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/jobs.ts#L105-L127)

现有后台句柄缺失分支

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/providers.ts:321-329](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/providers.ts#L321-L329)

可作为对账锚点的远端ID

```text
  const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
    : typeof submitted.id === 'string' ? submitted.id : undefined
  if (videoId === undefined) throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`)
  params.onProgress?.(`video task submitted: ${videoId}`)
  // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
  const queryBase = new URL(entry.baseURL).origin
  const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`
  for (;;) {
    if (Date.now() > pollDeadline) throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`)
```

**依据 3 · 源码核查**：[src/media.ts:109-143](https://github.com/1497105876/dsh-media-studio/blob/80096b9445eb7c544ab3025d6734e12bc973782e/src/media.ts#L109-L143)

本地保存阶段

<details>
<summary>查看原文（35行）</summary>

```text
export async function commitImage(
  attachments: AttachmentStore,
  options: CommitOptions & { mediaType: ImageMediaType },
): Promise<MediaItemMeta> {
  const ref = await attachments.saveImage({
    data: options.bytes,
    mediaType: options.mediaType,
    name: basename(options.name),
  })
  let path: string | undefined
  if (options.autoSave) {
    path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes)
  }
  return {
    kind: 'image',
    name: ref.name ?? basename(options.name),
    ...(path === undefined ? {} : { path }),
    bytes: ref.bytes,
    mediaType: ref.mediaType,
    width: ref.width,
    height: ref.height,
    attachmentId: ref.attachmentId as string,
  }
}

/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options: CommitOptions): Promise<MediaItemMeta> {
  const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes)
  return {
    kind: 'video',
    name: basename(options.name),
    path,
    bytes: options.bytes.byteLength,
    mediaType: 'video/mp4',
  }
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
