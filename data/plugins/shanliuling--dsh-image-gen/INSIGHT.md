# dsh-image-gen

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[34c3841](https://github.com/shanliuling/dsh-image-gen/tree/34c3841be558cf638e8976d45bf3a3e693f7cd79)

<!-- BEGIN META -->
[![GitHub ★ 1,178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/dsh-image-gen) [![npm 30d 69,270](https://img.shields.io/static/v1?label=npm+30d&message=69%2C270&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen)
<!-- END META -->

> **功能**：将多种图像供应商接入 DSH 对话，支持逐张批量生成、附件呈现和可选工作区保存。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 确认有从多提示词到多附件的顺序工具入口，已配置渠道可把配图生成和会话呈现接在一起。

> **主要限制**：[Q03](#research-q03) 批量成功、附件存在和文件可读是不同条件。取消可能发生在外部生成或附件保存之后，重跑前需要核对已有成果和上游状态。

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
  - [Q01 · 对话批量与手工生成、上传相比增加什么？](#detail-section-11)
  - [Q02 · 从工具参数到供应商和附件怎样接线？](#detail-section-12)
  - [Q03 · 部分失败和中途取消保留哪些成果？](#detail-section-13)
  - [Q04 · 谁适合试用，失败时怎样恢复？](#detail-section-14)
  - [Q05 · 按条对账能否减少重复生成？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 写文章或准备项目材料的创作者，需要为一组已确定的主题逐张生成、验收和保存配图。

使用供应商自带网站或本地工作流逐张生成，人工下载、上传到会话并整理工作区目录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：generate_image 和 generate_images
- **界面**：工具输出会话附件卡，包声明 Web 客户端

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19 或 ≥24、DSH Tools、Attachments、Credentials | 启动必需 | 注册工具、附件与凭据服务 | Host 加载或工具注册需按实际版本排查 |
| 云端 API Key 或相应订阅登录 | 对应云端渠道必需 | 访问选定模型 | 该渠道生成失败 |
| 可达 ComfyUI 和 API 工作流 | 本地分支必需 | 执行工作流 | 本地分支不可用 |
| 可写会话工作区 | 文件保存时必需 | 持久化为项目文件 | 仍可能只有附件或保存失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 创作者确认可信渠道与测试提示词 | 凭据与目标渠道可用 |
| 加载 | Host 加载插件，用户选会话和保存设置 | 能调用模型工具 |
| 执行 | 提交少量不同提示词 | 每个提示词关联附件或失败项 |
| 验收 | 用户检查附件和实际文件 | 匹配要求后交付，缺项先核对再补 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、模型账号或本地计算资源 | 配置渠道、凭据和工作区 | 渠道费用、资源和配置耗时未测 |
| 持续使用 | 逐张请求、可能的积分和文件空间 | 图质验收、确认保存和整理输出 | 实际等待、返工率及每张费用未知 |
| 失败恢复 | 上游后台、会话附件或既有图像工具 | 核对已发生调用、下载可用图，只补缺项 | 未量化重复扣费和恢复人时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多图结果收集 | 批量顺序、逐项失败与会话附件有源码接线 | 对照手工上传的节时及合格率 |
| 工作区文件 | 可选写入及失败返回与附件区分 | 不同宿主文件表现和恢复成功率 |
| 部分失败 | 失败可定位，后项可继续或标记未启动 | 是否实际减少重发与现金成本 |

> **思考**：[Q03](#research-q03) 批量成功、附件存在和文件可读是不同条件。取消可能发生在外部生成或附件保存之后，重跑前需要核对已有成果和上游状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 确认有从多提示词到多附件的顺序工具入口，已配置渠道可把配图生成和会话呈现接在一起。

工具层保留按项失败，附件层与工作区层分步持久化。工作区有路径约束和临时文件写入，超时和取消后仍需核对已发生的上游与附件动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 批量成功、附件存在和文件可读是不同条件。取消可能发生在外部生成或附件保存之后，重跑前需要核对已有成果和上游状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 已有可信渠道的创作者可先用两到三条不同主题的无敏感内容提示词，核对每张附件与文件是否符合任务。[Q03](#research-q03) 若缺附件、保存报错或遇到取消，先查会话、工作区和上游记录，再下载已有图或退回原工具只补缺项。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 Host 工具、供应商接线和保存状态边界。上游实际图片质量、扣费、市场可用性及取消后的最终结果仍需验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/openai-compatible.ts、src/workspace-save.ts、src/generation-timeout.ts、package.json、src/config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件的对话生成和批量接线及工作区写入。Studio、多模型对比、订阅条款和远端下载目标未作完整审计。
- 下一步：固定源码核查。下一步用可记录请求次数的假供应商及临时工作区对三个固定提示词注入一次保存失败和一次附件后的取消，比较整批重跑与逐项补缺的请求数、文件完整性和人时。

**分析版本**

- **仓库**：[shanliuling/dsh-image-gen](https://github.com/shanliuling/dsh-image-gen)
- **版本号**：0.11.1（[固定提交 34c3841](https://github.com/shanliuling/dsh-image-gen/tree/34c3841be558cf638e8976d45bf3a3e693f7cd79)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 逐项记录供应商响应、附件和工作区状态可能减少整批重跑，需与故障注入对照。

固定源码核查。下一步用可记录请求次数的假供应商及临时工作区对三个固定提示词注入一次保存失败和一次附件后的取消，比较整批重跑与逐项补缺的请求数、文件完整性和人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1118 | — | — | 13944 |
| .mjs | source | 4 | 281 | 242 | 23 | — |
| .mjs | example | 1 | 202 | 187 | 18 | — |
| .ts | source | 94 | 18133 | 14509 | 2528 | — |
| .tsx | source | 19 | 10896 | 9472 | 832 | — |
| .ts | test | 74 | 14665 | 13007 | 538 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断在 DSH 为文章或项目生成一组插图的用户，能否得到逐项可验收的附件与工作区文件，并在取消或部分失败时知道从哪一项恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对话批量与手工生成、上传相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者用一篇文章配多张图说明连续生成场景。固定代码注册单图和多图工具，批量共用参数、按输入顺序调用，成功直接由附件展示。相比离开会话逐张发提示词再传文件，可在原会话把多个提示词的结果收集在同一个工具回包。合格结果仍需逐项满足主题、风格、可打开，若交付需要文件还须确实存在。统一参数只表达共同约束，不能推出出图风格一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:174-186](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/README.md#L174-L186)

作者的批量场景、主张和示例

<details>
<summary>查看原文（13行）</summary>

```text
### 🔁 对话批量生图：一句话，一整组图

配图、分镜、系列插画、同一主题的多个变体，不用一张一张地催。

- 用一句话描述数量和统一要求，Agent 会自己规划出一组 Prompt，**单次最多 10 张**，图片按顺序附在同一条回复里。
- 比例、清晰度、模型、Provider 可以对整组统一指定，保证风格一致。
- 逐张生成，**某一张失败不会影响其余图片**，最后会汇报「成功 X / 共 Y」并列出失败原因。
- 本地 ComfyUI 和订阅通道同样支持批量。

<div align="center">
  <img src="docs/assets/readme/chat-batch.webp" alt="一条消息让 Agent 批量生成 5 张二次元插画，失败的那张自动重跑，最后整组进入图库" width="100%" />
  <br />
  <sub>一条消息写 5 个画面 → Agent 规划成两批生成 → 逐张出图，失败的那张自动单独重跑 → 整组进入图库。（等待部分已加速）</sub>
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/cordis.patch.yml#L1-L5)

根插件组合及默认 provider

```text
- insert:
    - id: image-gen
      name: dsh-image-gen
      config:
        provider: google
```

**依据 3 · 源码核查**：[src/index.ts:537-561](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L537-L561)

单图和批量工具在同一 Host 注册

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'generate_image',
    description: 'Generate a new image with the configured provider. Use when the user asks to create or draw a new image; use edit_image instead when they want to change an existing image. Give a complete visual prompt including subject, composition, style, lighting, and any exact text that should appear. The optional provider/model arguments switch provider or model for this call only when the user asks for a specific one. A successful image is attached directly to the conversation and may also be saved under the session workspace. Do not call read, glob, or other tools to locate or verify the image.',
    parameters: {
      prompt: { type: 'string', required: true, description: 'Complete description of the image to generate.' },
      provider: { type: 'string', enum: ['google', 'openai', 'openai-compat', 'seedream', 'dashscope', 'xai', 'zhipu', 'comfyui', 'chatgpt-sub', 'grok-sub', 'google-sub'], description: 'OMIT unless the user explicitly requests a specific image provider. Omission uses the saved default; never guess a channel or fill this with an empty string. chatgpt-sub, grok-sub, and google-sub use logged-in subscription accounts instead of API keys.' },
      model: { type: 'string', description: 'OMIT unless the user explicitly requests a specific model; omission uses the configured model. Optional override for this call only. Not used by ComfyUI (use workflow instead) nor by the subscription providers (model fixed by the subscription).' },
      channel: { type: 'string', description: 'Optional configured OpenAI-compatible channel id for this call only. Only meaningful with provider=openai-compat; omit to use the active channel.' },
      aspect_ratio: { type: 'string', enum: ['1:1', '3:2', '2:3', '4:3', '3:4', '4:5', '5:4', '16:9', '9:16', '21:9'], description: 'Optional output aspect ratio for Google Gemini, xAI Grok, subscription channels, and ComfyUI workflows with {{width}}/{{height}} placeholders (about one megapixel).' },
      image_size: { type: 'string', enum: ['1K', '2K', '4K'], description: 'Optional output resolution for Google Gemini, xAI Grok, Grok subscription (1K/2K), or Google subscription (1K/4K). NEVER send this for chatgpt-sub; omit unused fields entirely.' },
      size: { type: 'string', description: 'Optional dimensions or size tier for OpenAI, Seedream, or DashScope; WIDTHxHEIGHT maps to aspect_ratio for xAI Grok and sets the frame of ComfyUI workflows with {{width}}/{{height}} placeholders. Do not combine with aspect_ratio; omit instead of using an empty string.' },
      quality: { type: 'string', description: 'Optional generation quality for OpenAI or compatible APIs, independent of pixel size (e.g. auto, low, medium, high). Omit to use the configured default.' },
      workflow: { type: 'string', description: 'Optional name of the ComfyUI workflow to run; omit to use the active workflow from settings. Only meaningful when the ComfyUI provider is selected.' },
      ...gifToolParameters,
    },
    output: imageOutput('Generated'),
    async execute(args, exec): Promise<GeneratedValue> {
      return generateSingle(args, exec)
    },
    presentResult: (_args, result) => imagePresentation(result),
  }))

  ctx.tools.register(defineTool({
    name: 'generate_images',
    description: 'Generate several images in one call, one per prompt, in order. Use for batches, variations, or illustration sets; prefer generate_image for a single image. Every successful image is attached to the conversation and may be saved under the session workspace. Items generate sequentially; a failed item is reported in the failures list and does not abort the rest. The optional provider/model/size arguments apply to every item.',
```

</details>

**依据 4 · 源码核查**：[src/index.ts:589-601](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L589-L601)

批量结果与附件渲染

<details>
<summary>查看原文（13行）</summary>

```text
        {
          type: 'text' as const,
          text: `Generated ${String(value.images.length)} of ${String(value.images.length + value.failures.length)} images.\n${value.failures.map(failure => `${failure.prompt.slice(0, 80)} — failed: ${failure.error}`).join('\n')}`,
        },
        // Batch arguments apply to every item, so each item's summary can
        // compare the GIF it asked for with what came back.
        ...value.images.flatMap(image => imageOutput('Generated').render(args, image).map(block =>
          block.type === 'text' ? { ...block, text: `${block.text}\nImage prompt: ${image.prompt}` } : block)),
      ],
      presentationMeta: (_args: unknown, value: BatchGeneratedValue) => ({
        kind: 'dsh-image-gen-batch',
        images: value.images.map(image => imageOutput('Generated').presentationMeta({ prompt: image.prompt }, image)),
      }),
```

</details>

#### 缺口

- 缺少与手工上传的同主题时间及图像质量对照。
  **影响**：无法量化合格插图的人时或一致性。
  **进一步探讨**：用三张有预定义可验收条件的插图，比较交付人时和返工数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从工具参数到供应商和附件怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具接收单图或批量参数，清理覆盖参数后按活动供应商路由。ComfyUI 使用已配置工作流、订阅使用登录管理器，常规云端请求读取凭据并传超时信号。OpenAI 兼容实现 POST 模型、提示词与可选大小，再解析返回。生成成功后先保存到 DSH 附件服务，结果可带原动画与工作区状态。此链说明实际调用及保存接线，图片是否符合提示词要看具体模型和输入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:457-494](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L457-L494)

单图共享入口、分支与凭据调用

<details>
<summary>查看原文（38行）</summary>

```text
  /** Per-item generation request shared by generate_image and generate_images. */
  const generateSingle = async (rawArgs: SingleGenerationArgs, exec: { agent?: { session: { header: { cwd?: string } } }; signal: AbortSignal }): Promise<GeneratedValue> => {
    const args = cleanImageToolArgs(rawArgs)
    const requestConfig = configForToolCall(current(), providerOverrideOf(args.provider), args.channel)
    const active = resolveProvider(withProviderOverrides(requestConfig, providerOverrideOf(args.provider), args.model))
    assertGifProvider(args, active.provider)
    if (active.provider === 'comfyui') {
      const workflow = selectComfyUIWorkflow(active, args.workflow)
      const slots = comfyUIWorkflowSlots(workflow.json)
      assertImageCount(slots.images, 0)
      const frame = comfyUIFrame(workflow.name, slots, args)
      const generated = await generateComfyUIImage({
        baseURL: active.baseURL,
        workflowJson: workflow.json,
        prompt: mergeComfyUIPrompt(workflow.presetPrompt, args.prompt),
        timeoutMs: active.timeoutMs,
        maxBytes: ctx.attachments.imageLimits.maxImageBytes,
        signal: exec.signal,
        ...(frame.size === undefined ? {} : { size: frame.size }),
      })
      const value = await saveGenerated(ctx, generated, active.provider, workflow.name, 'API workflow', current(), exec, knownWorkspaceRoots)
      return frame.notice === undefined ? value : { ...value, notice: frame.notice }
    }
    if (active.provider === 'chatgpt-sub' || active.provider === 'grok-sub' || active.provider === 'google-sub') {
      const subscriptionParams = subscriptionToolParameters(active.provider, { ...(args.size !== undefined ? { size: args.size } : {}), ...(args.aspect_ratio !== undefined ? { aspectRatio: args.aspect_ratio } : {}), ...(args.image_size !== undefined ? { imageSize: args.image_size } : {}) })
      const generated = await generateSubscriptionImage({
        manager: subscriptionManager,
        provider: active.provider,
        prompt: args.prompt,
        ...subscriptionParams,
        maxBytes: ctx.attachments.imageLimits.maxImageBytes,
        signal: exec.signal,
      })
      return saveGenerated(ctx, generated, active.provider, active.model, 'subscription', current(), exec, knownWorkspaceRoots)
    }
    const runCloud = <T>(operation: (signal: AbortSignal) => Promise<T>, gif = false): Promise<T> =>
      withGenerationTimeout(cloudTimeoutFor(current().cloudTimeoutMs, gif), exec.signal, operation)
    const credential = await requireApiKey(ctx, active.provider, 'generate_image', active.provider === 'openai-compat' ? resolveOpenAICompatChannel(requestConfig, args.channel).keyRef : undefined)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:524-534](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L524-L534)

OpenAI 兼容调用后进入保存

<details>
<summary>查看原文（11行）</summary>

```text
    if (active.provider === 'openai' && size !== undefined) {
      if (gifRequested) validateGifFrameSize(size)
      else validateOfficialSize(active.model, size)
    }
    const quality = active.provider === 'openai-compat' ? compatRequestQuality(requestConfig, args.quality) : active.provider === 'openai' ? args.quality : undefined
    if (active.provider === 'openai' && quality !== undefined && !officialQualityOptions(active.model).some(option => option.value === quality)) throw new Error('该 OpenAI 模型不支持所选生成质量')
    const extraBody = channelExtraBody !== undefined ? { ...channelExtraBody, ...gifFields } : Object.keys(gifFields).length === 0 ? undefined : gifFields
    const generated = await runCloud(signal => generateOpenAICompatibleImage({ provider: active.provider, apiKey: credential, baseURL: active.baseURL, model: active.model, prompt: args.prompt, ...(size === undefined ? {} : { size }), maxBytes: ctx.attachments.imageLimits.maxImageBytes, signal, ...(quality === undefined ? {} : { quality }), ...(extraBody === undefined ? {} : { extraBody }), ...(arkOptions === undefined ? {} : { arkOptions }) }), gifRequested)
    const output = size ?? 'auto'
    const value = await saveGenerated(ctx, generated, active.provider, active.model, quality === undefined ? output : `${output}, quality=${quality}`, current(), exec, knownWorkspaceRoots)
    return active.provider === 'openai-compat' ? { ...value, channel: resolveOpenAICompatChannel(requestConfig, args.channel).id } : value
```

</details>

**依据 3 · 源码核查**：[src/openai-compatible.ts:42-57](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/openai-compatible.ts#L42-L57)

对选中端点发送生成请求

<details>
<summary>查看原文（16行）</summary>

```text
  const response = await guardedFetch(`${input.provider} image request`, input.signal, () => fetch(imageEndpoint(input.baseURL, 'generations'), {
    method: 'POST', redirect: 'error', signal: input.signal,
    headers: { authorization: `Bearer ${input.apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: input.model,
      prompt: input.prompt,
      ...(input.size === undefined ? {} : { size: input.size }),
      ...(input.quality === undefined ? {} : { quality: input.quality }),
      // `background: false` — Ark rejects `transparent` on this endpoint
      // outright (it needs exactly one input image), so it is the edit path's
      // option alone.
      ...(input.provider === 'seedream' ? { response_format: 'url', ...arkOutputBody(input.arkOptions, { background: false }) } : {}),
      ...(input.extraBody ?? {}),
    }),
  }), input.apiKey)
  return parseImageResponse(response, input.provider, input)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:915-938](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L915-L938)

附件与可选工作区的顺序

<details>
<summary>查看原文（24行）</summary>

```text
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const animation = animationOf(generated)
  // Kept before the workspace step so a result without a file (or a disabled
  // workspace) still carries the animation the card plays.
  const original = await keepGifOriginal(vaultConfigOf(config), generated, attachment, message => { ctx.logger.warn(message) })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
    ...(animation === undefined ? {} : { animation }),
    ...(original === undefined ? {} : { original }),
  }
  if (config.saveToWorkspace === false) return value
  const workspaceRoot = exec.agent?.session.header.cwd
  if (workspaceRoot === undefined) return value
  knownRoots?.add(workspaceRoot)
  try {
    value.savedTo = await saveImageToWorkspace({ workspaceRoot, folder: config.workspaceFolder, attachmentId: attachment.attachmentId, mediaType: generated.mediaType, data: generated.data, signal: exec.signal })
  } catch (error) {
    exec.signal.throwIfAborted()
    ctx.logger.warn(`dsh-image-gen: failed to save image to workspace: ${error instanceof Error ? error.message : String(error)}`)
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 5 · 源码核查**：[src/index.ts:805-832](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L805-L832)

附件及独立路径或保存错误的呈现

<details>
<summary>查看原文（28行）</summary>

```text
function imageOutput(verb: 'Generated' | 'Edited') {
  return {
    schema: {
      type: 'object', additionalProperties: false, properties: {
        attachment: { type: 'object', required: true, additionalProperties: false, properties: {
          attachmentId: { type: 'string', required: true }, mediaType: { type: 'string', required: true }, bytes: { type: 'integer', required: true }, width: { type: 'integer', required: true }, height: { type: 'integer', required: true }, name: { type: 'string' }, originalDimensions: { type: 'object', additionalProperties: false, properties: { width: { type: 'integer', required: true }, height: { type: 'integer', required: true } } },
        } },
        provider: { type: 'string', required: true }, channel: { type: 'string' }, model: { type: 'string', required: true }, output: { type: 'string', required: true }, savedTo: { type: 'string' }, saveError: { type: 'string' }, seed: { type: 'integer' }, animation: animationSchema, original: originalSchema, notice: { type: 'string' },
      },
    },
    render: (args: unknown, value: GeneratedValue) => {
      const saved = typeof value.savedTo === 'string' ? ` It was also saved to the workspace as ${value.savedTo}.` : typeof value.saveError === 'string' ? ` Saving it to the workspace failed: ${value.saveError}.` : ' It has no local file path.'
      const action = verb === 'Generated' ? 'It is already attached to the conversation.' : 'The edited image is attached to the conversation.'
      // The fixed sentence is a parsing contract for PTC dispatch cards
      // (image-result-node.ts); GIF facts are appended after it, never inside.
      return [
        { type: 'text' as const, text: `${verb} one image with ${value.provider}/${value.model} (${value.output}). Attachment ID: ${String(value.attachment.attachmentId)}. ${action}${saved} Respond to the user without reading or searching for the image.${animationNotes(args, value)}${cardNote(value)}${originalNote(value)}${value.notice === undefined ? '' : ` ${value.notice}`}` },
        { type: 'image' as const, attachment: value.attachment },
      ]
    },
    presentationMeta: (args: unknown, value: GeneratedValue) => ({
      kind: 'dsh-image-gen', attachment: attachmentMeta(value.attachment), provider: value.provider, model: value.model, output: value.output,
      ...(value.channel === undefined ? {} : { channel: value.channel }),
      ...(verb === 'Edited' ? { operation: 'edit' } : {}),
      ...(typeof value.savedTo === 'string' ? { savedTo: value.savedTo } : {}),
      ...(typeof value.seed === 'number' ? { seed: value.seed } : {}),
      ...(value.original === undefined ? {} : { original: { key: value.original.key, bytes: value.original.bytes, mediaType: value.original.mediaType } }),
      prompt: (args as { prompt: string }).prompt,
```

</details>

#### 缺口

- 各供应商真实输出及格式能力未做同条件验证。
  **影响**：相同参数在不同供应商上未必得到可比较的图片。
  **进一步探讨**：先固定一个允许的渠道与期望媒体类型，逐图验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部分失败和中途取消保留哪些成果？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

每批一至十项，按顺序处理。已取消时后续项以原 index 记为未启动，已开始的失败入 failures 后继续处理其他项。附件先保存，普通文件写失败附上 saveError 仍返回图片，取消时 saveGenerated 重抛而不会将该附件纳入这批成功清单。文件写入先核对工作区与真实路径，写临时文件后改名，取消或错误仅尽力清理文件。源码没有在这个失败分支回撤已保存附件。云端超时是本地取消请求，提示明确要求核对上游生成及计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:603-634](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L603-L634)

批次顺序、失败和取消的结果分支

<details>
<summary>查看原文（32行）</summary>

```text
    async execute(args, exec): Promise<BatchGeneratedValue> {
      if (args.prompts.length === 0) throw new Error('generate_images requires at least one prompt')
      if (args.prompts.length > 10) throw new Error(`generate_images accepts at most 10 prompts per call (got ${String(args.prompts.length)}); split larger batches into several calls`)
      const images: BatchGeneratedValue['images'] = []
      const failures: BatchGeneratedValue['failures'] = []
      for (const [index, prompt] of args.prompts.entries()) {
        if (exec.signal.aborted) {
          failures.push({ index, prompt, error: 'aborted before this image started' })
          continue
        }
        try {
          const value = await generateSingle({
            prompt,
            ...(args.provider !== undefined ? { provider: args.provider } : {}),
            ...(args.model !== undefined ? { model: args.model } : {}),
            ...(args.channel !== undefined ? { channel: args.channel } : {}),
            ...(args.aspect_ratio !== undefined ? { aspect_ratio: args.aspect_ratio } : {}),
            ...(args.image_size !== undefined ? { image_size: args.image_size } : {}),
            ...(args.size !== undefined ? { size: args.size } : {}),
            ...(args.quality !== undefined ? { quality: args.quality } : {}),
            ...(args.workflow !== undefined ? { workflow: args.workflow } : {}),
            ...(args.output_format !== undefined ? { output_format: args.output_format } : {}),
            ...(args.frame_count !== undefined ? { frame_count: args.frame_count } : {}),
            ...(args.frame_duration_ms !== undefined ? { frame_duration_ms: args.frame_duration_ms } : {}),
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
    },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:915-938](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L915-L938)

附件保存先于工作区，普通失败和取消分开

<details>
<summary>查看原文（24行）</summary>

```text
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const animation = animationOf(generated)
  // Kept before the workspace step so a result without a file (or a disabled
  // workspace) still carries the animation the card plays.
  const original = await keepGifOriginal(vaultConfigOf(config), generated, attachment, message => { ctx.logger.warn(message) })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
    ...(animation === undefined ? {} : { animation }),
    ...(original === undefined ? {} : { original }),
  }
  if (config.saveToWorkspace === false) return value
  const workspaceRoot = exec.agent?.session.header.cwd
  if (workspaceRoot === undefined) return value
  knownRoots?.add(workspaceRoot)
  try {
    value.savedTo = await saveImageToWorkspace({ workspaceRoot, folder: config.workspaceFolder, attachmentId: attachment.attachmentId, mediaType: generated.mediaType, data: generated.data, signal: exec.signal })
  } catch (error) {
    exec.signal.throwIfAborted()
    ctx.logger.warn(`dsh-image-gen: failed to save image to workspace: ${error instanceof Error ? error.message : String(error)}`)
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 3 · 源码核查**：[src/workspace-save.ts:108-144](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/workspace-save.ts#L108-L144)

临时文件、改名和取消后尽力清理

<details>
<summary>查看原文（37行）</summary>

```text
export async function saveImageToWorkspace(options: {
  workspaceRoot: string
  folder?: string | undefined
  attachmentId: string
  mediaType: ImageAttachmentRef['mediaType']
  data: Uint8Array
  signal?: AbortSignal
}): Promise<string> {
  const dir = workspaceImageDir(options.workspaceRoot, options.folder)
  options.signal?.throwIfAborted()
  const realRoot = await realpath(resolve(options.workspaceRoot))
  assertInsideWorkspace(realRoot, await nearestExistingRealPath(dir), options.folder)
  const name = workspaceImageName(options.attachmentId, options.mediaType)
  const target = join(dir, name)
  const staging = join(dir, `.${name}.${process.pid}-${randomUUID()}.tmp`)
  await mkdir(dir, { recursive: true })
  // Re-validate the finished directory: creating it may have traversed a
  // symlink, and links can be swapped in between the checks above.
  assertInsideWorkspace(realRoot, await realpath(dir), options.folder)
  try {
    await writeFile(staging, options.data, { flag: 'wx', signal: options.signal })
    options.signal?.throwIfAborted()
    await rename(staging, target)
  } catch (error) {
    await unlink(staging).catch(() => {})
    throw error
  }
  // Final gate: a cancellation landing during the last write/rename step must
  // not be reported as a successful save, and the already-renamed file is
  // removed so no orphan image outlives the cancelled call.
  try {
    options.signal?.throwIfAborted()
  } catch (error) {
    await unlink(target).catch(() => {})
    throw error
  }
  return target
```

</details>

**依据 4 · 源码核查**：[src/generation-timeout.ts:1-26](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/generation-timeout.ts#L1-L26)

请求信号与上游结果未知提示

<details>
<summary>查看原文（26行）</summary>

```text
export const UPSTREAM_TIMEOUT_HINT = '上游可能已扣费或仍在生成，请到服务商后台确认'

export class GenerationTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`生图超时（${String(timeoutMs / 1000)} 秒未返回），请检查网络或代理后重试；${UPSTREAM_TIMEOUT_HINT}`)
    this.name = 'GenerationTimeoutError'
  }
}

export async function withGenerationTimeout<T>(
  timeoutMs: number,
  signal: AbortSignal,
  operation: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const watchdog = new AbortController()
  const combinedSignal = AbortSignal.any([signal, watchdog.signal])
  const timeout = setTimeout(() => { watchdog.abort() }, timeoutMs)
  timeout.unref?.()
  try {
    return await operation(combinedSignal)
  } catch (error) {
    if (watchdog.signal.aborted && !signal.aborted) throw new GenerationTimeoutError(timeoutMs)
    throw error
  } finally {
    clearTimeout(timeout)
  }
```

</details>

#### 缺口

- 当前缺取消夹在附件和文件之间的故障注入。
  **影响**：无法判断宿主实际保留哪些附件，以及供应商是否继续生成或扣费。
  **进一步探讨**：在假供应商和临时工作区同时记录请求、附件 ID、文件和清理失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合试用，失败时怎样恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需使用已配置的 DSH Host 服务及符合 manifest 的 Node，云端需有效凭据或已登录订阅，ComfyUI 分支需可达实例和工作流。保存默认开启，写入依赖当前会话有工作区且能在范围内落盘。适合有图像供应商、只处理无敏感内容且能人工核对的小批创作者。拿到附件而路径失败时可从会话下载再手工放入工作区。超时或取消后应先核对附件、目录与上游后台，再决定仅重跑缺项。需要明确计费、保真或私有参考图而无法核对时回到既有工具。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-66](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/package.json#L39-L66)

根包 Web 注入和 Node 版本

<details>
<summary>查看原文（28行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-tool",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "node scripts/clean-lib.mjs && tsc && tsdown",
    "prepare": "pnpm run build",
    "test": "vitest run",
    "test:package": "node scripts/check-package.mjs",
    "pack:check": "pnpm pack --dry-run"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:57-58](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L57-L58)

Host 核心服务

```text
export const name = 'dsh-image-gen'
export const inject = ['tools', 'attachments', 'credentials']
```

**依据 3 · 源码核查**：[src/config.ts:271-275](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/config.ts#L271-L275)

工作区保存缺省配置

```text
  comfyuiWorkflowJson: volatile(z.string().default('')),
  comfyuiWorkflowName: volatile(z.string().default('')),
  comfyuiTimeoutMs: volatile(z.number().min(1_000).max(3_600_000).default(DEFAULT_COMFYUI_TIMEOUT_MS)),
  saveToWorkspace: volatile(z.boolean().default(true)),
  workspaceFolder: volatile(z.string().default(DEFAULT_WORKSPACE_FOLDER)),
```

**依据 4 · 作者声明**：[README.md:360-367](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/README.md#L360-L367)

作者说明凭据、数据发送和工作区条件

```text
## 数据与隐私

- **BYOK**：API Key 通过 DSH Credentials 服务保存，设置页不会回显 Key 明文。
- **订阅登录**：订阅账号令牌经你授权登录后保存于 DSH Credentials，与 API Key 完全隔离，浏览器侧不接触令牌。
- **云端请求**：Prompt 与本次使用的参考图会发送给所选 Provider，请遵守对应服务条款。
- **上游图片下载**：沿用宿主已有的网络和代理配置，不额外拦截 Fake-IP、内网或回环地址。当前未提供完整的 SSRF 目标限制。
- **本地 ComfyUI**：请求发送到用户配置的 ComfyUI 地址。
- **工作区文件**：开启工作区保存后，对话结果会落盘；Studio 仅保存用户选中的候选图。
```

**依据 5 · 源码核查**：[src/workspace-save.ts:116-143](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/workspace-save.ts#L116-L143)

工作区与文件保存约束

<details>
<summary>查看原文（28行）</summary>

```text
  const dir = workspaceImageDir(options.workspaceRoot, options.folder)
  options.signal?.throwIfAborted()
  const realRoot = await realpath(resolve(options.workspaceRoot))
  assertInsideWorkspace(realRoot, await nearestExistingRealPath(dir), options.folder)
  const name = workspaceImageName(options.attachmentId, options.mediaType)
  const target = join(dir, name)
  const staging = join(dir, `.${name}.${process.pid}-${randomUUID()}.tmp`)
  await mkdir(dir, { recursive: true })
  // Re-validate the finished directory: creating it may have traversed a
  // symlink, and links can be swapped in between the checks above.
  assertInsideWorkspace(realRoot, await realpath(dir), options.folder)
  try {
    await writeFile(staging, options.data, { flag: 'wx', signal: options.signal })
    options.signal?.throwIfAborted()
    await rename(staging, target)
  } catch (error) {
    await unlink(staging).catch(() => {})
    throw error
  }
  // Final gate: a cancellation landing during the last write/rename step must
  // not be reported as a successful save, and the already-renamed file is
  // removed so no orphan image outlives the cancelled call.
  try {
    options.signal?.throwIfAborted()
  } catch (error) {
    await unlink(target).catch(() => {})
    throw error
  }
```

</details>

#### 缺口

- 尚无不同渠道的每张费用、有效交付率和恢复人时。
  **影响**：不能估算完成一组合格图的实际成本。
  **进一步探讨**：记录单张额度、等待、审核、失败补图与人工保存时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按条对账能否减少重复生成？

**研究主题**：新假设与验证

#### 完整回答

用三项输入做同样两次批次，令第二项生成成功而本地写入报错，再令第三项在附件保存后收到取消。分别使用整批重跑和逐项核对再补缺两种处理。记录上游请求数、附件和文件是否可读、每条最终交付及补图工时。若按条核对没有减少重复请求，或核对成本超过补图收益，假设不获支持。真实费用需另按供应商账单核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:608-634](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L608-L634)

批量失败有原始索引，成功项附 prompt

<details>
<summary>查看原文（27行）</summary>

```text
      for (const [index, prompt] of args.prompts.entries()) {
        if (exec.signal.aborted) {
          failures.push({ index, prompt, error: 'aborted before this image started' })
          continue
        }
        try {
          const value = await generateSingle({
            prompt,
            ...(args.provider !== undefined ? { provider: args.provider } : {}),
            ...(args.model !== undefined ? { model: args.model } : {}),
            ...(args.channel !== undefined ? { channel: args.channel } : {}),
            ...(args.aspect_ratio !== undefined ? { aspect_ratio: args.aspect_ratio } : {}),
            ...(args.image_size !== undefined ? { image_size: args.image_size } : {}),
            ...(args.size !== undefined ? { size: args.size } : {}),
            ...(args.quality !== undefined ? { quality: args.quality } : {}),
            ...(args.workflow !== undefined ? { workflow: args.workflow } : {}),
            ...(args.output_format !== undefined ? { output_format: args.output_format } : {}),
            ...(args.frame_count !== undefined ? { frame_count: args.frame_count } : {}),
            ...(args.frame_duration_ms !== undefined ? { frame_duration_ms: args.frame_duration_ms } : {}),
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
    },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:915-938](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/index.ts#L915-L938)

保存附件与工作区的独立落点

<details>
<summary>查看原文（24行）</summary>

```text
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const animation = animationOf(generated)
  // Kept before the workspace step so a result without a file (or a disabled
  // workspace) still carries the animation the card plays.
  const original = await keepGifOriginal(vaultConfigOf(config), generated, attachment, message => { ctx.logger.warn(message) })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
    ...(animation === undefined ? {} : { animation }),
    ...(original === undefined ? {} : { original }),
  }
  if (config.saveToWorkspace === false) return value
  const workspaceRoot = exec.agent?.session.header.cwd
  if (workspaceRoot === undefined) return value
  knownRoots?.add(workspaceRoot)
  try {
    value.savedTo = await saveImageToWorkspace({ workspaceRoot, folder: config.workspaceFolder, attachmentId: attachment.attachmentId, mediaType: generated.mediaType, data: generated.data, signal: exec.signal })
  } catch (error) {
    exec.signal.throwIfAborted()
    ctx.logger.warn(`dsh-image-gen: failed to save image to workspace: ${error instanceof Error ? error.message : String(error)}`)
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 3 · 源码核查**：[src/workspace-save.ts:127-143](https://github.com/shanliuling/dsh-image-gen/blob/34c3841be558cf638e8976d45bf3a3e693f7cd79/src/workspace-save.ts#L127-L143)

在保存尾端可注入失败或取消

<details>
<summary>查看原文（17行）</summary>

```text
  try {
    await writeFile(staging, options.data, { flag: 'wx', signal: options.signal })
    options.signal?.throwIfAborted()
    await rename(staging, target)
  } catch (error) {
    await unlink(staging).catch(() => {})
    throw error
  }
  // Final gate: a cancellation landing during the last write/rename step must
  // not be reported as a successful save, and the already-renamed file is
  // removed so no orphan image outlives the cancelled call.
  try {
    options.signal?.throwIfAborted()
  } catch (error) {
    await unlink(target).catch(() => {})
    throw error
  }
```

</details>

#### 缺口

- 没有对照样本。
  **影响**：不能把逐项回包直接换算成少重跑或低费用。
  **进一步探讨**：在模拟上游固定三个提示词，给工作区写入注入错误并记录重跑次数。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
