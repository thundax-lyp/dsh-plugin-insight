# dsh-image-gen

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[5c8c141](https://github.com/shanliuling/dsh-image-gen/tree/5c8c14143f7f4b707b6bb88a068a365feb2f128e)

<!-- BEGIN META -->
[![GitHub ★ 1,036](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C036&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/dsh-image-gen) [![npm 30d 44,547](https://img.shields.io/static/v1?label=npm+30d&message=44%2C547&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen)
<!-- END META -->

> **功能**：在 DSH 对话及工作台中连接图像生成渠道与附件。

> **亮点**：[Q02](#research-q02) 把对话生成与附件及可选工作区保存相连，减少手动搬运，但不保证输出质量或文件保存。

> **主要限制**：[Q03](#research-q03) 生成附件、工作区保存与批量每项结果是不同状态，须分别核对。

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
  - [Q01 · 谁使用它，需要什么？](#detail-section-11)
  - [Q02 · 对话生成怎样到 Provider 和附件？](#detail-section-12)
  - [Q03 · 失败、保存和隐私边界？](#detail-section-13)
  - [Q04 · 成本和假设是什么？](#detail-section-14)
  - [Q05 · 如何试用与退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) DSH 内容创作者希望生成合要求的配图并核对附件和文件保存。

在供应商网页或工具生成后，用户手动下载并搬运到 DSH 工作区。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图像生成 | 对话调用已选 Provider 并生成附件 | 依赖供应商和凭据，质量与费用未验证 |
| 工作区保存 | 可选将结果写入会话工作区 | 可关闭、缺 cwd 或失败，需查看状态 |
| 批量生成 | 顺序处理多条提示 | 每项可能独立失败并产生费用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 工具与附件服务 | 必需 | 注册工具和保存结果 | 无法完成对话输出 |
| Provider 凭据与网络或本地工作流 | 必需 | 生成图片 | 调用失败或不可用 |
| Web 服务 | 对工作台必需 | 提供界面与路由 | 无法使用相应界面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选择一个 Provider 与工作区 | 凭据和额度可用 |
| 生成 | 用非敏感提示生成单图 | 附件可见且内容合适 |
| 核对 | 检查工作区保存与费用 | 分别确认附件、文件和账单 |
| 异常 | 暂停批量并核查 | 必要时回到供应商界面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 配置服务和凭据 | 选择渠道、模型与工作区 | 时间未知 |
| 持续使用 | 图像调用与存储费用 | 审核和调整图片 | 实际单张价格未知 |
| 失败恢复 | 重试可能再次计费 | 核对各项与附件 | 费用依服务而定 |
| 退出 | 处理附件与文件存储 | 检查已有输出 | 停用不撤销已生成图片 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 对话生成 | Provider 调用与附件保存源码 | 图像质量与实际节时 |
| 工作区保存 | 可选写文件和独立错误 | 每次生成均有文件 |

> **思考**：[Q03](#research-q03) 生成附件、工作区保存与批量每项结果是不同状态，须分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把对话生成与附件及可选工作区保存相连，减少手动搬运，但不保证输出质量或文件保存。

[Q02](#research-q02) 将渠道选择和附件保存集中，[Q03](#research-q03) 部分失败及工作区保存需独立处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 生成附件、工作区保存与批量每项结果是不同状态，须分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 单 Provider、单张非敏感提示试用，核对输出、保存和费用后再扩展。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持生成、附件与工作区路径；实际供应商、图像质量和成本未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/index.ts、src/google.ts、src/image-tool-context.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态核查对话生成及 Google 代表性路径，未运行 DSH、各 Provider 或浏览器。
- 下一步：在测试 DSH 和单一 Provider 使用一张非敏感图片，验证附件、文件、错误及账单。

**分析版本**

- **仓库**：[shanliuling/dsh-image-gen](https://github.com/shanliuling/dsh-image-gen)
- **版本号**：0.10.0（[固定提交 5c8c141](https://github.com/shanliuling/dsh-image-gen/tree/5c8c14143f7f4b707b6bb88a068a365feb2f128e)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 生成前显示按渠道和张数估价或可降低预算意外，需对照账单验证。

在测试 DSH 和单一 Provider 使用一张非敏感图片，验证附件、文件、错误及账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 974 | — | — | 9986 |
| .mjs | source | 3 | 271 | 235 | 21 | — |
| .mjs | example | 1 | 202 | 187 | 18 | — |
| .ts | source | 69 | 12449 | 9900 | 1758 | — |
| .tsx | source | 8 | 9241 | 8267 | 501 | — |
| .ts | test | 44 | 9668 | 8538 | 402 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=27&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 图像生成从工具到 Provider、附件和工作区的路径及失败成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它，需要什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

dsh-image-gen 面向希望在 DSH 对话中生成或编辑配图的用户，合格结果是选定渠道生成符合要求的图，附件可见且所需工作区保存状态可核对。依赖兼容 DSH 附件和工具服务、可用 Provider 与凭据或本地 ComfyUI；工作台等 HTTP 界面还需 webServer。各 Provider 的参数、权限、网络和费用不同，源码声明不证明实际账户可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-5](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/package.json#L2-L5)

包与定位。

```text
  "name": "dsh-image-gen",
  "version": "0.10.0",
  "description": "Bring ChatGPT-like image generation to DeepSeek Harness — Gemini, OpenAI, Seedream, DashScope, local ComfyUI & more.",
  "type": "module",
```

**依据 2 · 源码核查**：[package.json:38-55](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/package.json#L38-L55)

DSH 客户端和 bundle。

<details>
<summary>查看原文（18行）</summary>

```text
  ],
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
```

</details>

**依据 3 · 源码核查**：[package.json:65-68](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/package.json#L65-L68)

Node 版本声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "license": "Apache-2.0",
```

**依据 4 · 作者声明**：[README.md:116-132](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/README.md#L116-L132)

作者说明 Provider 与配置。

<details>
<summary>查看原文（17行）</summary>

```text
### 2. 配置 Provider

重启 DSH 后，点击左侧边栏的 **「插件」** 图标打开插件面板，在 **「已安装」** 分区点击 **dsh-image-gen**，进入插件详情页即可看到「图像生成」配置表单：

**插件面板 → 已安装 → dsh-image-gen**

<div align="center">
  <img src="docs/assets/readme/plugins-entry.webp" alt="在左侧边栏点击「插件」，于「已安装」分区点击 dsh-image-gen 进入详情页" width="100%" />
  <br />
  <sub>点击左侧边栏「插件」图标，在「已安装」分区点击 dsh-image-gen 进入插件详情页。</sub>
</div>

> DSH 0.1.5 及更早版本没有插件面板，入口仍为「设置 → 插件 → 插件配置 → 图像生成」；插件已同时兼容两种入口。

选择 Provider，填写自己的 API Key，并按需调整模型、Endpoint / Base URL 与工作区保存选项。填好 Key 后可点击**「测试连接」**验证可用性，或点击**「拉取模型」**一键获取该厂商支持的全部生图模型，无需手动查文档。使用 ComfyUI 时，请填写 DSH Host 可访问的服务地址，并导入 **API Format Workflow JSON**。

已有 ChatGPT、Grok 或 Google 订阅？无需填写 API Key：展开对应的订阅 Provider 行，点击**「登录」**并在浏览器完成授权，即可直接开始文生图与图生图。
```

</details>

**依据 5 · 源码核查**：[src/index.ts:140-145](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L140-L145)

设置及 Web 服务条件。

```text
  const settingsHealth = installImageSettings(ctx, current(), {
    setSource: source => { current = () => migrateOpenAICompatConfig(plainConfig(source())) },
    onChange: () => {},
  })
  // Every HTTP surface needs webServer, which only the web-app bundle (web,
  // desktop) provides; the headless, acp and sdk profiles have none. Mount the
```

#### 缺口

- 目标 DSH 和 Provider 的账户状态
  **影响**：决定能否生成和保存
  **进一步探讨**：在测试工作区检查服务与额度

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 对话生成怎样到 Provider 和附件？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 注册 generate_image 和 generate_images；单图调用清洗参数、解析配置与渠道，选择对应分支，云端获取凭据并带超时请求。以 Google 为例，适配器 POST 提示和尺寸，处理 HTTP、JSON、无图和字节限制；成功后保存 DSH 附件，并在配置允许且会话有 cwd 时尝试写入工作区。批量最多十条，顺序逐项运行，失败项单独记录而继续其余。相比网页生成后手工搬运，它把生成与 DSH 附件及可选工作区输出连接；不等于图库、文件和生成都必然同时成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:277-289](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L277-L289)

清洗参数、选 Provider 与本地工作流。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Per-item generation request shared by generate_image and generate_images. */
  const generateSingle = async (rawArgs: SingleGenerationArgs, exec: { agent?: { session: { header: { cwd?: string } } }; signal: AbortSignal }): Promise<GeneratedValue> => {
    const args = cleanImageToolArgs(rawArgs)
    const requestConfig = configForToolCall(current(), providerOverrideOf(args.provider), args.channel)
    const active = resolveProvider(withProviderOverrides(requestConfig, providerOverrideOf(args.provider), args.model))
    if (active.provider === 'comfyui') {
      const workflow = selectComfyUIWorkflow(active, args.workflow)
      const generated = await generateComfyUIImage({
        baseURL: active.baseURL,
        workflowJson: workflow.json,
        prompt: mergeComfyUIPrompt(workflow.presetPrompt, args.prompt),
        timeoutMs: active.timeoutMs,
        maxBytes: ctx.attachments.imageLimits.maxImageBytes,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:306-313](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L306-L313)

云端超时、凭据与 Google 分支。

```text
    const runCloud = <T>(operation: (signal: AbortSignal) => Promise<T>): Promise<T> =>
      withGenerationTimeout(current().cloudTimeoutMs ?? DEFAULT_CLOUD_TIMEOUT_MS, exec.signal, operation)
    const credential = await requireApiKey(ctx, active.provider, 'generate_image', active.provider === 'openai-compat' ? resolveOpenAICompatChannel(requestConfig, args.channel).keyRef : undefined)
    if (active.provider === 'google') {
      const aspectRatio = (args.aspect_ratio ?? active.aspectRatio) as AspectRatio
      const imageSize = (args.image_size ?? active.imageSize) as ImageSize
      const generated = await runCloud(signal => generateGoogleImage({ apiKey: credential, endpoint: active.endpoint, native: active.native, model: active.model, prompt: args.prompt, aspectRatio, imageSize, maxBytes: ctx.attachments.imageLimits.maxImageBytes, signal }))
      return saveGenerated(ctx, generated, active.provider, active.model, `${aspectRatio}, ${imageSize}`, current(), exec, knownWorkspaceRoots)
```

**依据 3 · 源码核查**：[src/google.ts:75-115](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/google.ts#L75-L115)

Google 请求、响应和错误检查。

<details>
<summary>查看原文（41行）</summary>

```text
/** Shared Google request, response parsing, decoding, and size enforcement. */
async function requestGoogleImage(input: GoogleRequestBase & {
  operation: 'generation' | 'editing'
  interactionInput: string | Array<Record<string, string>>
  nativeParts: Array<Record<string, unknown>>
}): Promise<GeneratedImage> {
  const label = `Google image ${input.operation}`
  const endpoint = input.native ? nativeGoogleUrl(input.endpoint, input.model).toString() : input.endpoint
  const body = input.native ? {
    contents: [{ role: 'user', parts: input.nativeParts }],
    generationConfig: {
      candidateCount: 1,
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: input.aspectRatio, imageSize: input.imageSize },
    },
  } : {
    model: input.model,
    input: input.interactionInput,
    response_format: {
      type: 'image', mime_type: REQUESTED_MEDIA_TYPE,
      aspect_ratio: input.aspectRatio, image_size: input.imageSize,
    },
  }
  const response = await guardedFetch(`${label} request`, input.signal, () => fetch(endpoint, {
    method: 'POST',
    redirect: 'error',
    signal: input.signal,
    headers: { 'content-type': 'application/json', 'x-goog-api-key': input.apiKey },
    body: JSON.stringify(body),
  }), input.apiKey)
  const text = await readBoundedText(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT, label)
  if (!response.ok) throw new Error(`${label} failed (${response.status}): ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`)
  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error(`${label} returned invalid JSON`)
  }
  const image = input.native ? nativeOutputImage(payload) : outputImage(payload)
  if (image === undefined) throw new Error(`${label} returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`)
  const data = decodeBase64(image.data, label)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:337-355](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L337-L355)

单图工具注册与执行。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'generate_image',
    description: 'Generate a new image with the configured provider. Use when the user asks to create or draw a new image; use edit_image instead when they want to change an existing image. Give a complete visual prompt including subject, composition, style, lighting, and any exact text that should appear. The optional provider/model arguments switch provider or model for this call only when the user asks for a specific one. A successful image is attached directly to the conversation and may also be saved under the session workspace. Do not call read, glob, or other tools to locate or verify the image.',
    parameters: {
      prompt: { type: 'string', required: true, description: 'Complete description of the image to generate.' },
      provider: { type: 'string', enum: ['google', 'openai', 'openai-compat', 'seedream', 'dashscope', 'xai', 'zhipu', 'comfyui', 'chatgpt-sub', 'grok-sub', 'google-sub'], description: 'OMIT unless the user explicitly requests a specific image provider. Omission uses the saved default; never guess a channel or fill this with an empty string. chatgpt-sub, grok-sub, and google-sub use logged-in subscription accounts instead of API keys.' },
      model: { type: 'string', description: 'Optional model name for this call only, overriding the configured model. Not used by ComfyUI (use workflow instead) nor by the subscription providers (model fixed by the subscription).' },
      channel: { type: 'string', description: 'Optional configured OpenAI-compatible channel id for this call only. Only meaningful with provider=openai-compat; omit to use the active channel.' },
      aspect_ratio: { type: 'string', enum: ['1:1', '3:2', '2:3', '4:3', '3:4', '4:5', '5:4', '16:9', '9:16', '21:9'], description: 'Optional output aspect ratio for Google Gemini, xAI Grok, and subscription channels.' },
      image_size: { type: 'string', enum: ['1K', '2K', '4K'], description: 'Optional output resolution for Google Gemini, xAI Grok, Grok subscription (1K/2K), or Google subscription (1K/4K). NEVER send this for chatgpt-sub; omit unused fields entirely.' },
      size: { type: 'string', description: 'Optional dimensions or size tier for OpenAI, Seedream, or DashScope; WIDTHxHEIGHT maps to aspect_ratio for xAI Grok. Do not combine with aspect_ratio; omit instead of using an empty string.' },
      quality: { type: 'string', description: 'Optional generation quality for OpenAI or compatible APIs, independent of pixel size (e.g. auto, low, medium, high). Omit to use the configured default.' },
      workflow: { type: 'string', description: 'Optional name of the ComfyUI workflow to run; omit to use the active workflow from settings. Only meaningful when the ComfyUI provider is selected.' },
    },
    output: imageOutput('Generated'),
    async execute(args, exec): Promise<GeneratedValue> {
      return generateSingle(args, exec)
    },
    presentResult: (_args, result) => imagePresentation(result),
```

</details>

**依据 5 · 源码核查**：[src/index.ts:358-360](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L358-L360)

批量工具语义。

```text
  ctx.tools.register(defineTool({
    name: 'generate_images',
    description: 'Generate several images in one call, one per prompt, in order. Use for batches, variations, or illustration sets; prefer generate_image for a single image. Every successful image is attached to the conversation and may be saved under the session workspace. Items generate sequentially; a failed item is reported in the failures list and does not abort the rest. The optional provider/model/size arguments apply to every item.',
```

**依据 6 · 源码核查**：[src/index.ts:399-426](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L399-L426)

逐项执行与失败记录。

<details>
<summary>查看原文（28行）</summary>

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
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:621-648](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L621-L648)

附件和可选工作区保存。

<details>
<summary>查看原文（28行）</summary>

```text
async function saveGenerated(
  ctx: Context,
  generated: { data: Uint8Array; mediaType: ImageAttachmentRef['mediaType']; seed?: number },
  provider: ImageProvider,
  model: string,
  output: string,
  config: Config,
  exec: { agent?: { session: { header: { cwd?: string } } }; signal: AbortSignal },
  knownRoots?: Set<string>,
): Promise<GeneratedValue> {
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
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

#### 缺口

- 真实 Provider 的出图、附件显示与文件持久化
  **影响**：影响完整工作流
  **进一步探讨**：使用一张非敏感测试图核验各状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败、保存和隐私边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

生成成功先保存为 DSH 附件；工作区保存关闭、无 cwd 或保存出错时不一定有工作区文件，出错记录 saveError，不能把附件成功等同文件保存成功。批量是逐项执行并保留失败列表，部分成功须逐项核对。云端会收到提示词及编辑输入图，能力和费用依 Provider 变化；模型输出本身需人工验收。提示指导不主动猜测替换 Provider，失败后不应默认为已切换渠道或无费用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:399-426](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L399-L426)

批量部分失败。

<details>
<summary>查看原文（28行）</summary>

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
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:621-648](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L621-L648)

附件与工作区保存分离。

<details>
<summary>查看原文（28行）</summary>

```text
async function saveGenerated(
  ctx: Context,
  generated: { data: Uint8Array; mediaType: ImageAttachmentRef['mediaType']; seed?: number },
  provider: ImageProvider,
  model: string,
  output: string,
  config: Config,
  exec: { agent?: { session: { header: { cwd?: string } } }; signal: AbortSignal },
  knownRoots?: Set<string>,
): Promise<GeneratedValue> {
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
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

**依据 3 · 源码核查**：[src/google.ts:65-70](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/google.ts#L65-L70)

编辑输入图片编码后发送。

```text
    ...input,
    operation: 'editing',
    interactionInput,
    nativeParts: input.native ? [
      ...input.sourceImages.map(image => ({ inlineData: { mimeType: image.mediaType, data: Buffer.from(image.data).toString('base64') } })),
      { text: input.prompt },
```

**依据 4 · 源码核查**：[src/google.ts:98-106](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/google.ts#L98-L106)

云端请求及错误。

```text
  const response = await guardedFetch(`${label} request`, input.signal, () => fetch(endpoint, {
    method: 'POST',
    redirect: 'error',
    signal: input.signal,
    headers: { 'content-type': 'application/json', 'x-goog-api-key': input.apiKey },
    body: JSON.stringify(body),
  }), input.apiKey)
  const text = await readBoundedText(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT, label)
  if (!response.ok) throw new Error(`${label} failed (${response.status}): ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`)
```

**依据 5 · 源码核查**：[src/image-tool-context.ts:14-18](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/image-tool-context.ts#L14-L18)

默认 Provider 与失败后不猜测切换的指导。

```text
  return [
    `Image tools current default provider: ${provider}; generation model: ${JSON.stringify(model)}; editing model: ${JSON.stringify(editModel)}.`,
    'Unless the user explicitly requests a different image provider or model, OMIT provider and model from generate_image, generate_images and edit_image. Do not guess a channel or switch channels after an error.',
    'Omit unused optional arguments entirely; never fill them with empty strings. size and aspect_ratio are alternatives: provide at most one.',
    'Subscription parameters: chatgpt-sub accepts size OR aspect_ratio, but NOT image_size. grok-sub image_size: 1K or 2K. google-sub image_size: 1K or 4K. Do not copy parameters from another provider.',
```

#### 缺口

- 供应商真实错误、计费与附件状态
  **影响**：影响重试和用户费用
  **进一步探讨**：逐项核查回执与账户记录后再决定重试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

需要配置账户、凭据或本地工作流，支付适用的模型调用与计算费用，并花时间审核图像、处理失败和保存。没有本次真实价格、耗时或返工对照，不能宣称比供应商界面更省。假设在批量生成前显示按 Provider 和张数的估算与确认，可减少预算意外；价格随渠道变化，估算维护也有成本。对照实际账单、确认耗时与取消率，若偏差过大或无帮助则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:358-360](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L358-L360)

一次多张的工具语义。

```text
  ctx.tools.register(defineTool({
    name: 'generate_images',
    description: 'Generate several images in one call, one per prompt, in order. Use for batches, variations, or illustration sets; prefer generate_image for a single image. Every successful image is attached to the conversation and may be saved under the session workspace. Items generate sequentially; a failed item is reported in the failures list and does not abort the rest. The optional provider/model/size arguments apply to every item.',
```

**依据 2 · 源码核查**：[src/index.ts:399-426](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L399-L426)

最多十张逐项运行。

<details>
<summary>查看原文（28行）</summary>

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
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
```

</details>

**依据 3 · 作者声明**：[README.md:128-132](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/README.md#L128-L132)

作者说明供应商配置与授权。

```text
> DSH 0.1.5 及更早版本没有插件面板，入口仍为「设置 → 插件 → 插件配置 → 图像生成」；插件已同时兼容两种入口。

选择 Provider，填写自己的 API Key，并按需调整模型、Endpoint / Base URL 与工作区保存选项。填好 Key 后可点击**「测试连接」**验证可用性，或点击**「拉取模型」**一键获取该厂商支持的全部生图模型，无需手动查文档。使用 ComfyUI 时，请填写 DSH Host 可访问的服务地址，并导入 **API Format Workflow JSON**。

已有 ChatGPT、Grok 或 Google 订阅？无需填写 API Key：展开对应的订阅 Provider 行，点击**「登录」**并在浏览器完成授权，即可直接开始文生图与图生图。
```

#### 缺口

- 实际费用、错误率和人工返工时间
  **影响**：无法量化价值
  **进一步探讨**：单 Provider 对照同任务并记录账单和耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用与退出？

**研究主题**：采用判断

#### 完整回答

已有 DSH 且经常需要配图的用户可先选一个已配置 Provider，在测试工作区用非敏感提示生成一张并核对附件、工作区保存和账单。相比网页生成后搬运，可把生成接到当前对话；效果和成本需要实际比较。若部分失败、保存状态或费用无法核对，暂停批量并回到供应商现有界面，确认已生成附件和文件后再处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:337-355](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L337-L355)

对话工具。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'generate_image',
    description: 'Generate a new image with the configured provider. Use when the user asks to create or draw a new image; use edit_image instead when they want to change an existing image. Give a complete visual prompt including subject, composition, style, lighting, and any exact text that should appear. The optional provider/model arguments switch provider or model for this call only when the user asks for a specific one. A successful image is attached directly to the conversation and may also be saved under the session workspace. Do not call read, glob, or other tools to locate or verify the image.',
    parameters: {
      prompt: { type: 'string', required: true, description: 'Complete description of the image to generate.' },
      provider: { type: 'string', enum: ['google', 'openai', 'openai-compat', 'seedream', 'dashscope', 'xai', 'zhipu', 'comfyui', 'chatgpt-sub', 'grok-sub', 'google-sub'], description: 'OMIT unless the user explicitly requests a specific image provider. Omission uses the saved default; never guess a channel or fill this with an empty string. chatgpt-sub, grok-sub, and google-sub use logged-in subscription accounts instead of API keys.' },
      model: { type: 'string', description: 'Optional model name for this call only, overriding the configured model. Not used by ComfyUI (use workflow instead) nor by the subscription providers (model fixed by the subscription).' },
      channel: { type: 'string', description: 'Optional configured OpenAI-compatible channel id for this call only. Only meaningful with provider=openai-compat; omit to use the active channel.' },
      aspect_ratio: { type: 'string', enum: ['1:1', '3:2', '2:3', '4:3', '3:4', '4:5', '5:4', '16:9', '9:16', '21:9'], description: 'Optional output aspect ratio for Google Gemini, xAI Grok, and subscription channels.' },
      image_size: { type: 'string', enum: ['1K', '2K', '4K'], description: 'Optional output resolution for Google Gemini, xAI Grok, Grok subscription (1K/2K), or Google subscription (1K/4K). NEVER send this for chatgpt-sub; omit unused fields entirely.' },
      size: { type: 'string', description: 'Optional dimensions or size tier for OpenAI, Seedream, or DashScope; WIDTHxHEIGHT maps to aspect_ratio for xAI Grok. Do not combine with aspect_ratio; omit instead of using an empty string.' },
      quality: { type: 'string', description: 'Optional generation quality for OpenAI or compatible APIs, independent of pixel size (e.g. auto, low, medium, high). Omit to use the configured default.' },
      workflow: { type: 'string', description: 'Optional name of the ComfyUI workflow to run; omit to use the active workflow from settings. Only meaningful when the ComfyUI provider is selected.' },
    },
    output: imageOutput('Generated'),
    async execute(args, exec): Promise<GeneratedValue> {
      return generateSingle(args, exec)
    },
    presentResult: (_args, result) => imagePresentation(result),
```

</details>

**依据 2 · 源码核查**：[src/index.ts:399-426](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L399-L426)

逐项失败处理。

<details>
<summary>查看原文（28行）</summary>

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
          }, exec)
          images.push({ ...value, prompt })
        } catch (error) {
          failures.push({ index, prompt, error: error instanceof Error ? error.message : String(error) })
        }
      }
      return { images, failures }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:631-646](https://github.com/shanliuling/dsh-image-gen/blob/5c8c14143f7f4b707b6bb88a068a365feb2f128e/src/index.ts#L631-L646)

附件与文件保存状态。

<details>
<summary>查看原文（16行）</summary>

```text
  if (!ctx.attachments.imageLimits.mediaTypes.includes(generated.mediaType)) throw new Error(`This DSH deployment does not accept ${generated.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: generated.data, mediaType: generated.mediaType, name: 'generated-image' })
  const value: GeneratedValue = {
    attachment, provider, model, output,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
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
```

</details>

#### 缺口

- 目标服务能力与账单
  **影响**：影响是否值得试用
  **进一步探讨**：先测试单张并核查文件和费用

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
