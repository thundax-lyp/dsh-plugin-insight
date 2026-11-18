# dsh-tool-describe-image

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：让 DeepSeek Harness 的文本模型通过配置的视觉服务读取本地、网络或附件中的图片，并返回文字描述。

> **亮点**：[Q01](#research-q01) 显示，包在 Web 发送和模型读取之间接好附件引用、端点设置和文字输出，让模型能在当前会话提出定向图像问题。

> **主要限制**：[Q02](#research-q02) 显示，工具直接以宿主权限读取地址或文件，把完整图片交给配置端点；插件层没有统一的来源或会话范围限制。

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
  - [Q01 · 图片草稿如何变成模型能用的引用？](#detail-section-11)
  - [Q02 · 文件、URL、附件访问和传给端点的权限如何区分？](#detail-section-12)
  - [Q03 · 重复调用、上传失败和历史重开会怎样？](#detail-section-13)
  - [Q04 · 何时值得试用，如何验证更严格的图片来源与回执？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH 文本模型的开发者可以将公开截图交给指定视觉服务，再在当前会话核对返回文字。

人工查看后转述可继续使用原文本工作流，已有视觉客户端也可直接分析图片。这个组件在 DSH 文本会话内连接视觉请求与上传。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 附件转接 | 上传草稿并把引用送入文本会话 | 依赖宿主附件服务和客户端方法 |
| 图像描述 | 用视觉模型按提示描述图片 | 完整图片发送到配置端点，需授权 |
| 重复回答复用 | 短时间复用同内容成功结果 | 先读图，命中依赖完全相同输入和设置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 工具、Web 服务和客户端 | 加载需要 | 注册工具和浏览器发送接线 | 可能无法使用其中入口 |
| 宿主附件服务 | 草稿和附件读取需要 | 保存、读取与返回短引用 | 上传或读取报错 |
| 视觉端点、模型和凭据 | 运行需要 | 读取图像并输出文字 | 调用失败或无法使用 |
| 批准的出站与来源范围 | 采用需要 | 控制可访问图片与端点 | 回到手工转述 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者选择可信端点与无私密合成图 | 已确认图片可传及端点用途 |
| 读取 | 用户在隔离会话提交样本 | 短引用可核对，实际请求目标明确 |
| 验证 | 操作者对照图像和返回字段 | 错误则保存可复现线索，避免用回答代替原图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及视觉端点资源 | 配置访问范围、协议和模型 | 环境和开支未知 |
| 持续 | 图像传输、视觉请求及缓存 | 校验返回文字 | 单任务耗时与费用未测 |
| 失败恢复 | 重新读图或上传可能增加请求 | 检查旧引用与费用，退回手工 | 实际留存和恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文字会话继续提问 | 发送和工具都进行引用转接 | 模型是否稳定选择工具 |
| 视觉文本 | 实际请求发送图像与提示 | 字段准确率和节时 |
| 重复读取 | 短缓存可复用同一结果 | 实际命中率和账单 |

> **思考**：[Q02](#research-q02) 显示，工具直接以宿主权限读取地址或文件，把完整图片交给配置端点；插件层没有统一的来源或会话范围限制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示，包在 Web 发送和模型读取之间接好附件引用、端点设置和文字输出，让模型能在当前会话提出定向图像问题。

附件校验、发送钩子及视觉请求独立；短引用会失效，缓存以图像内容和端点复用答案。发生失败需要分别回查会话、工具调用及宿主附件状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示，工具直接以宿主权限读取地址或文件，把完整图片交给配置端点；插件层没有统一的来源或会话范围限制。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先确认宿主访问权和视觉端点的数据边界。只用可传的合成图片验证，回读图像字段与实际请求；如果出站不明就回人工转述。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认工具接线、附件及视觉请求。实际端点、权限、账单和图片理解准确性未核实。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-describe-image/README.md、packages/dsh-tool-describe-image/package.json、packages/dsh-tool-describe-image/cordis.patch.yml、packages/dsh-tool-describe-image/tsdown.config.ts、packages/dsh-tool-describe-image/src/config-resolve.ts、packages/dsh-tool-describe-image/src/client/index.ts、packages/dsh-tool-describe-image/src/client/send-hook.ts、packages/dsh-tool-describe-image/src/attach-routes.ts、packages/dsh-tool-describe-image/src/index.ts、packages/dsh-tool-describe-image/src/vision-client.ts 及固定范围 inventory；组件：packages/dsh-tool-describe-image。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定源码的输入、存储与外传机制。未验证宿主访问控制、服务端对图像的留存、真实模型和费用。
- 下一步：测试合成图片、未知链接和有界失败端点；比较会话记录、实际视觉请求、重启短引用和人工核对耗时。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出在执行前将附件来源和实际视觉端点交给统一授权验证，并比较越域拒绝与误拒。

测试合成图片、未知链接和有界失败端点；比较会话记录、实际视觉请求、重启短引用和人工核对耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 250 | — | — | 2694 |
| .ts | source | 12 | 1953 | 1290 | 531 | — |
| .tsx | source | 2 | 550 | 453 | 80 | — |
| .ts | test | 8 | 1924 | 1612 | 89 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用文本模型整理合成截图时，图片如何经宿主交给视觉模型，哪些条件影响可用性与数据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 图片草稿如何变成模型能用的引用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

常用仅文本 DSH 模型整理公开界面截图的开发者，可以让模型围绕指定区域提出视觉问题，再根据文本回答整理复查。手工看图再粘贴文字已能完成同样任务，原生视觉宿主还可以直接向模型提供图像。这个组件为已有文字工作流增加一个可调用的视觉端点，并为 Web 会话补草稿发送接线。

当宿主 conversation 提供预期方法时，钩子检查图片 ID 与草稿数量，逐一转为 base64 并上传到宿主附件入口。保存结果返回含附件 ID 的 Markdown；所有上传成功才把正文与短引用作为 text block 发送，草稿在发送成功后释放。上传失败时回到宿主原流程，文本模型原先拒绝图片的情形仍可能发生。工具单独解析视觉端点、凭据和当前图片，再把视觉结果作为文本返回。附件可在客户端以 URL 展示，文本模型不会直接收到这份上传字节；后续视觉调用会另行传给配置的端点。包说明自述其视觉能力移植自既有实现，能确认的本包增量是 Web 提交流程、设置、附件和工具的整合。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-describe-image/src/client/index.ts:78-100](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/client/index.ts#L78-L100)

真实宿主会话钩子和设置卡接线。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.inject(['slots', 'conversation'], (scope: ClientContext) => {
    const conversation = scope.conversation
    const slots = scope.slots

    // Text-only models reject image blocks at submit: rewrite image-bearing
    // sends into describe-image references before they reach the model.
    installSendHook(conversation)

    // The settings card: bound to the describe-image namespace through the
    // family bridge when the official scope does not expose it.
    ctx.inject(['settingsScope'], (settingsCtx: ClientContext) => {
      const binder = settingsCtx.get('webUiSettings') ?? settingsCtx.settingsScope
      const settingsScope = binder.bind<DescribeImageSettings>({ namespace: NS })
      const settingsCard = new DescribeImageSettingsCardController(settingsScope)
      slots.inject('web-ui.plugin.item', () =>
        slots.register({
          name: 'web-ui.plugin.item',
          id: 'describe-image',
          order: 115,
          locale: NS,
          inject: () => settingsCard.inject(),
        }, DescribeImageSettingsCard))
    })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-describe-image/src/client/send-hook.ts:51-86](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/client/send-hook.ts#L51-L86)

草稿至附件短引用、原流程回退及清理条件。

<details>
<summary>查看原文（36行）</summary>

```text
export function installSendHook(conversation: unknown): void {
  const face = conversation as ConversationSendFace
  if (face === null || typeof face !== 'object') return
  if (typeof face.sendSession !== 'function') return
  if (typeof face.draftImages !== 'function' || typeof face.releaseDraftImage !== 'function') return
  if ((face as unknown as Record<string, unknown>)[HOOK_MARKER] === true) return

  const original = face.sendSession
  face.sendSession = async (session, text, imageIds, mode): Promise<void> => {
    if (imageIds.length === 0) {
      return original.call(face, session, text, imageIds, mode)
    }
    const attachments = face.draftImages(imageIds)
    if (attachments.length !== imageIds.length) {
      return original.call(face, session, text, imageIds, mode)
    }
    const refs: string[] = []
    for (const attachment of attachments) {
      const read = await readFileAsBase64(attachment.file)
      if (!read.ok) break
      const upload = await uploadImageForDescribe(read.base64, attachment.file.type, attachment.file.name)
      if (!upload.ok) break
      refs.push(upload.markdown)
    }
    if (refs.length !== attachments.length) {
      // Upload fell short: keep the shell's original behavior (which will
      // reject the image block for a text-only model).
      return original.call(face, session, text, imageIds, mode)
    }
    const fullText = [text.trim(), ...refs].filter(part => part !== '').join('\n')
    const result = await session.prompt([{ type: 'text', text: fullText }], mode)
    if (!result.ok) {
      throw new Error(`conversation.send failed: ${result.error?.code ?? 'unknown'}: ${result.error?.message ?? ''}`)
    }
    for (const id of imageIds) face.releaseDraftImage(id)
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:144-160](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L144-L160)

附件服务实际保存并返回引用。

<details>
<summary>查看原文（17行）</summary>

```text
export async function handleAttach(ctx: Context, maxBytes: number, payload: unknown): Promise<AttachOutcome> {
  const validated = validateAttachPayload(payload, maxBytes)
  if ('error' in validated) return { ok: false, error: validated.error }
  const attachments = ctx.get('attachments')
  if (attachments === undefined) {
    return { ok: false, error: { code: 'internal', message: 'the attachment service is not mounted; the route cannot store images' } }
  }
  try {
    const ref = await attachments.saveImage({
      data: validated.bytes,
      mediaType: validated.payload.mediaType,
      ...validated.payload.name === undefined ? {} : { name: validated.payload.name },
    })
    registerAttachmentRef(ref)
    return { ok: true, ref, note: attachmentNote(ref), markdown: attachmentMarkdown(ref.attachmentId) }
  } catch (error) {
    return { ok: false, error: { code: 'internal', message: `attachment store rejected the image: ${(error as Error).message ?? String(error)}` } }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-describe-image/src/index.ts:166-175](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/index.ts#L166-L175)

工具调用动作和文本渲染。

<details>
<summary>查看原文（10行）</summary>

```text
      render: (_args, value) => [{ type: 'text', text: value.text }],
    },
    async execute(args, exec) {
      const active = spec()
      const apiKey = await resolveApiKey(ctx, active)
      const image = await loadImage(ctx, args.image, exec.signal, active.maxBytes)
      const text = await callVision(active, apiKey, args.prompt ?? active.defaultPrompt, image, exec.signal, visionCache)
      return { text, model: active.model, image: args.image, mimeType: image.mimeType, bytes: image.bytes.length }
    },
    presentCall: describeImageCallView,
```

</details>

**依据 5 · 作者声明**：[packages/dsh-tool-describe-image/README.md:5-14](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/README.md#L5-L14)

作者给出的适用模型与移植基线。

<details>
<summary>查看原文（10行）</summary>

```text
Model-facing `describe_image` tool: gives **text-only models** (DeepSeek V4 etc.) image understanding.
Each call loads one image — a local file path, an http(s) URL, or a session attachment reference —
and asks an OpenAI-compatible vision endpoint (Qwen-VL, GLM-4V, GPT-4o, a local Ollama endpoint…) to
answer over the Chat Completions or Responses protocol; **only the returned text enters the
conversation, the image itself never enters the session log**.

Ported from deepseek-harness `packages/vision/tool-describe-image` (mirrored at
[whitelonng/dsh-plugin-describe-image](https://github.com/whitelonng/dsh-plugin-describe-image)),
adapted to the dsh-web-ui family conventions: official NPM SDK only, host-side plugin with a
browser half, live settings, no dsh source changes.
```

</details>

#### 缺口

- 未在目标宿主实测拖拽发送、模型选择工具和多附件。
  **影响**：只能证明接线具备，不能保证特定模型会按需调用。
  **进一步探讨**：用同一合成截图对照手工描述、工具调用和文本会话收到的内容。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、URL、附件访问和传给端点的权限如何区分？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具对附件先经宿主服务读取，再按字节和类型校验。HTTP 读取禁重定向，先查长度，再按流限制，但找不到对 URL 的公共域名单、内网地址排除或主机核验。对其余输入直接 stat 和 readFile，没有以工作区根或绝对路径作为硬性门槛，调用权与宿主进程读权限直接相关。该本地分支读前看文件长度，随后不再核读后长度；可以确认代码有读前检查，不能保证文件在检查与读之间变化时仍受同等限制。

附件 POST 解码后查声明类型与魔数、大小，再交宿主保存，GET 用进程里的已登记引用返回原字节。路由代码把 GET 作为前缀的读取路径，并只检查 HTTP 方法及输入，未在这一层检查会话归属或来源。源码注释称环回，实际访问边界需结合部署和宿主鉴权，不可从注释推定。视觉请求使用已配端点，将所读的全部图像字节编码到请求体并带提示、模型和认证；对话只包含文本不能约束端点的数据留存。只有材料与发送对象明确时才适合考虑使用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:140-182](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L140-L182)

三种图像读取路径，URL 只校协议和长度，文件走实际宿主路径。

<details>
<summary>查看原文（43行）</summary>

```text
export async function loadImage(ctx: Context, input: string, signal: AbortSignal, maxBytes: number): Promise<LoadedImage> {
  const trimmed = input.trim()
  if (trimmed.length === 0) throw new Error('describe-image: image must be a non-empty path, URL, or attachment reference')
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    throw new Error('describe-image: only http(s) URLs, local file paths, and attachment references are supported')
  }
  if (trimmed.startsWith('{')) {
    const bytes = await readAttachment(ctx, trimmed, signal)
    if (bytes.length > maxBytes) {
      throw new Error(`describe-image: image is ${bytes.length} bytes, above the ${maxBytes}-byte bound`)
    }
    return toImage(bytes, trimmed.slice(0, 96))
  }
  if (/^https?:\/\//i.test(trimmed)) {
    const response = await fetch(trimmed, { signal, redirect: 'error' })
    if (!response.ok) {
      throw new Error(`describe-image: image fetch returned HTTP ${response.status}`)
    }
    const declared = Number(response.headers.get('content-length'))
    if (Number.isSafeInteger(declared) && declared > maxBytes) {
      throw new Error(`describe-image: image is ${declared} bytes, above the ${maxBytes}-byte bound`)
    }
    const bytes = await readBoundedBody(response, maxBytes)
    return toImage(bytes, trimmed)
  }
  // A bare attachment id — the `sha256:…` string text models tend to copy out of
  // an `[image attachment …]` note instead of the whole JSON. Resolve it through
  // the attach-route registry (the store's digest verification still runs).
  const registered = attachmentRefById(trimmed)
  if (registered !== undefined) {
    const bytes = await readAttachment(ctx, JSON.stringify(registered), signal)
    if (bytes.length > maxBytes) {
      throw new Error(`describe-image: image is ${bytes.length} bytes, above the ${maxBytes}-byte bound`)
    }
    return toImage(bytes, trimmed)
  }
  const info = await stat(trimmed, { bigint: false })
  if (!info.isFile()) throw new Error(`describe-image: image path is not a file: ${trimmed}`)
  if (info.size > maxBytes) {
    throw new Error(`describe-image: image is ${info.size} bytes, above the ${maxBytes}-byte bound`)
  }
  const bytes = await readFile(trimmed, { signal })
  return toImage(bytes, trimmed)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:191-208](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L191-L208)

网络读取按流限制。

<details>
<summary>查看原文（18行）</summary>

```text
export async function readBoundedBody(response: Response, cap: number): Promise<Buffer> {
  if (response.body === null) return Buffer.alloc(0)
  const reader = response.body.getReader()
  const chunks: Buffer[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = Buffer.from(value)
      total += chunk.length
      if (total > cap) throw new Error(`describe-image: response exceeds the ${cap}-byte bound`)
      chunks.push(chunk)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:119-132](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L119-L132)

上传魔数与字节检查。

<details>
<summary>查看原文（14行）</summary>

```text
  const bytes = decodeBase64(data)
  if (bytes === undefined) {
    return { error: { code: 'rejected', message: 'image data is not valid base64' } }
  }
  if (bytes.length === 0) {
    return { error: { code: 'rejected', message: 'image data is empty' } }
  }
  if (bytes.length > maxBytes) {
    return { error: { code: 'rejected', message: `image is ${bytes.length} bytes, above the ${maxBytes}-byte bound` } }
  }
  if (sniffMimeType(bytes) !== mediaType) {
    return { error: { code: 'rejected', message: `bytes do not match the declared ${mediaType} type` } }
  }
  return { payload: { data, mediaType, name }, bytes }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:197-224](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L197-L224)

已注册 ID 可返回存储字节，无独立会话校验。

<details>
<summary>查看原文（28行）</summary>

```text
async function serveRawImage(ctx: Context, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const match = /^\/describe-image\/raw\/([^/]+)$/.exec(new URL(req.url ?? '/', 'http://x').pathname)
  if (match === null) {
    res.writeHead(404)
    res.end()
    return
  }
  const id = decodeURIComponent(match[1])
  const ref = attachmentRefById(id)
  if (ref === undefined) {
    res.writeHead(404)
    res.end()
    return
  }
  const attachments = ctx.get('attachments')
  if (attachments === undefined) {
    res.writeHead(404)
    res.end()
    return
  }
  try {
    const stored = await attachments.readImage(ref)
    res.writeHead(200, { 'content-type': ref.mediaType, 'content-length': String(stored.data.byteLength), 'cache-control': 'private, max-age=3600' })
    res.end(Buffer.from(stored.data))
  } catch {
    res.writeHead(404)
    res.end()
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:234-264](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L234-L264)

前缀路由只按方法和请求体处理。

<details>
<summary>查看原文（31行）</summary>

```text
export function registerAttachRoute(ctx: Context, readMaxBytes: () => number = () => DEFAULT_MAX_BYTES): void {
  const webserver = ctx.get('webServer')
  if (webserver === undefined) return
  webserver.register({
    kind: 'prefix',
    path: '/describe-image',
    handler: async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      // GET /describe-image/raw/<id>: serve the stored bytes so the
      // markdown image reference inserted into the draft renders. The id is
      // content-addressed and loopback-only, so a bare read carries no
      // secrets; the store's digest verification still runs.
      if (req.method === 'GET') {
        await serveRawImage(ctx, req, res)
        return
      }
      if (req.method !== 'POST') {
        json(res, { ok: false, error: METHOD_NOT_ALLOWED }, 405)
        return
      }
      const body = await readJsonBody(req, MAX_ATTACH_BODY_BYTES)
      if (body === null) {
        json(res, { ok: false, error: { code: 'internal', message: 'request body must be JSON within 16 MiB' } }, 400)
        return
      }
      const outcome = await handleAttach(ctx, readMaxBytes(), body)
      if (outcome.ok) {
        json(res, { ok: true, value: { note: outcome.note, markdown: outcome.markdown, ref: outcome.ref } })
        return
      }
      json(res, { ok: false, error: outcome.error }, outcome.error.code === 'rejected' ? 422 : 500)
    },
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:275-307](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L275-L307)

请求包含实际图像和查询文字。

<details>
<summary>查看原文（33行）</summary>

```text
/** Build the request the configured style sends: its path and JSON body. */
export function buildVisionRequest(spec: ResolvedConfig, prompt: string, image: LoadedImage): { path: string; body: string } {
  const dataUrl = `data:${image.mimeType};base64,${image.bytes.toString('base64')}`
  if (spec.apiStyle === 'responses') {
    return {
      path: `${spec.baseURL}/responses`,
      body: JSON.stringify({
        model: spec.model,
        max_output_tokens: spec.maxOutputTokens,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: dataUrl },
          ],
        }],
      }),
    }
  }
  return {
    path: `${spec.baseURL}/chat/completions`,
    body: JSON.stringify({
      model: spec.model,
      max_tokens: spec.maxOutputTokens,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      }],
    }),
  }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:384-396](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L384-L396)

出站目的地、认证和取消边界。

<details>
<summary>查看原文（13行）</summary>

```text
  const { path, body } = buildVisionRequest(spec, prompt, image)
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body,
    redirect: 'error',
    signal: AbortSignal.any([signal, AbortSignal.timeout(spec.timeoutMs)]),
  })
  if (!response.ok) {
    const excerpt = await readBoundedText(response, 200)
    throw new Error(`describe-image: vision endpoint returned HTTP ${response.status}: ${excerpt}`)
  }
  const payloadBytes = await readBoundedBody(response, spec.maxOutputTokens * 8 + 64 * 1024)
```

</details>

#### 缺口

- 目标宿主的访问控制、实际网络出口和图像服务留存政策未查证。
  **影响**：不能给出隔离或可公开部署的结论。
  **进一步探讨**：用受控宿主、无私人内容的图和测试端点核查哪些调用者能读、请求发到何处。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复调用、上传失败和历史重开会怎样？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

视觉请求前先完成读图。每个挂载实例有短缓存，同图字节、提示、端点、模型、协议和令牌上限完全一致时可用成功旧结果。键包含图像 base64 与提示，没带凭据或会话 ID。没有请求进行中的共享 Promise，同一时刻缓存未命中仍可能各自发送。缓存有期限与条目上限，节省的是后续视觉 POST，读图与内存占用仍在。提供方非成功响应会抛带截断响应文字的错误，读图信号与视觉 POST 自己的超时也不同。

短引用靠宿主进程中的 ID 表，该表有限且淘汰最早条目；内容地址仍在旧会话里，进程退出或淘汰后裸 ID 无法解析，GET 明确返回 404。附带完整引用时另有宿主读取路径，不能用短引用失效推定文件已删。多图上传中途失败会保留已经保存的附件，钩子回到原发送流程，未回滚先前成功的上传。实际费用除了视觉请求数量，还有重复读取、上传和人工复核，当前没有实测或价格引用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-describe-image/src/index.ts:126-132](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/index.ts#L126-L132)

每挂载一个视觉缓存。

```text
  const spec = (): ResolvedConfig => resolveConfig(current())
  // Short-lived semantic cache scoped to this mount: identical image + prompt
  // within the TTL reuse the prior answer instead of a second fetch.
  const visionCache = createVisionCache()
  // The webserver is optional (the loader-composition tests boot without one):
  // the attach route registers only when the service is actually mounted.
  registerAttachRoute(ctx, () => current().maxBytes ?? DEFAULT_MAX_BYTES)
```

**依据 2 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:310-336](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L310-L336)

缓存期限与容量。

<details>
<summary>查看原文（27行）</summary>

```text
/** Default semantic-cache lifetime for a successful vision answer, in milliseconds. */
export const DEFAULT_CACHE_TTL_MS = 10_000
/** Default upper bound on cached vision answers. */
export const DEFAULT_CACHE_MAX_ENTRIES = 32

/** A bounded, TTL-expiring cache of successful vision answers. */
export interface VisionCache {
  /** Look up a cached answer, honoring the TTL. */
  get(key: string): string | undefined
  /** Store an answer with a fresh TTL, evicting expired and then oldest entries. */
  set(key: string, text: string): void
  /** Number of live cached answers. */
  readonly size: number
  /** Running cache hits, for observability and tests. */
  readonly hits: number
  /** Running cache misses, for observability and tests. */
  readonly misses: number
  /** Drop every entry. */
  clear(): void
}

/** Create a TTL-expiring, capacity-capped vision answer cache. */
export function createVisionCache(options?: { ttlMs?: number; maxEntries?: number }): VisionCache {
  const ttlMs = options?.ttlMs ?? DEFAULT_CACHE_TTL_MS
  const maxEntries = Math.max(1, options?.maxEntries ?? DEFAULT_CACHE_MAX_ENTRIES)
  const entries = new Map<string, { text: string; expiresAt: number }>()
  let hits = 0
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:363-405](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L363-L405)

缓存键、命中、错误、取消及成功写入。

<details>
<summary>查看原文（43行）</summary>

```text
/** The semantic identity of one vision request: endpoint fields plus the same image bytes and prompt. */
export function semanticRequestKey(spec: ResolvedConfig, prompt: string, image: LoadedImage): string {
  return JSON.stringify([
    spec.baseURL, spec.model, spec.maxOutputTokens, spec.apiStyle,
    image.bytes.toString('base64'), image.mimeType, prompt,
  ])
}

/** Call the configured vision endpoint and return its text answer, with short-lifetime caching for repeats. */
export async function callVision(
  spec: ResolvedConfig,
  apiKey: string,
  prompt: string,
  image: LoadedImage,
  signal: AbortSignal,
  cache?: VisionCache,
): Promise<string> {
  if (cache !== undefined) {
    const cached = cache.get(semanticRequestKey(spec, prompt, image))
    if (cached !== undefined) return cached
  }
  const { path, body } = buildVisionRequest(spec, prompt, image)
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body,
    redirect: 'error',
    signal: AbortSignal.any([signal, AbortSignal.timeout(spec.timeoutMs)]),
  })
  if (!response.ok) {
    const excerpt = await readBoundedText(response, 200)
    throw new Error(`describe-image: vision endpoint returned HTTP ${response.status}: ${excerpt}`)
  }
  const payloadBytes = await readBoundedBody(response, spec.maxOutputTokens * 8 + 64 * 1024)
  let payload: unknown
  try {
    payload = JSON.parse(payloadBytes.toString('utf8'))
  } catch {
    throw new Error('describe-image: vision endpoint returned invalid JSON')
  }
  const text = spec.apiStyle === 'responses' ? extractResponsesContent(payload) : extractChatCompletionsContent(payload)
  if (cache !== undefined) cache.set(semanticRequestKey(spec, prompt, image), text)
  return text
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:49-75](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L49-L75)

进程级短引用 registry 有容量与淘汰。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * In-memory registry of references this process's attach route persisted,
 * keyed by attachment id. Text models that copy only the id out of an
 * `[image attachment …]` note (instead of the whole JSON) still resolve
 * through here, and the attachment store's digest verification runs on the
 * read regardless. Bounded FIFO; ids are content-addressed so a stale entry
 * cannot be confused with another image.
 */
const ATTACHMENT_REF_REGISTRY = new Map<string, ImageAttachmentRef>()

/** Registry capacity; beyond it the oldest entry is dropped. */
const ATTACHMENT_REF_REGISTRY_CAP = 128

/** Remember one persisted reference by its attachment id. */
export function registerAttachmentRef(ref: ImageAttachmentRef): void {
  ATTACHMENT_REF_REGISTRY.delete(ref.attachmentId)
  ATTACHMENT_REF_REGISTRY.set(ref.attachmentId, ref)
  while (ATTACHMENT_REF_REGISTRY.size > ATTACHMENT_REF_REGISTRY_CAP) {
    const oldest = ATTACHMENT_REF_REGISTRY.keys().next().value
    if (oldest === undefined) break
    ATTACHMENT_REF_REGISTRY.delete(oldest)
  }
}

/** Look up a persisted reference by its bare attachment id, if still in the registry. */
export function attachmentRefById(id: string): ImageAttachmentRef | undefined {
  return ATTACHMENT_REF_REGISTRY.get(id)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-describe-image/src/attach-routes.ts:204-220](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/attach-routes.ts#L204-L220)

未知 bare ID 读不到并返回 404。

<details>
<summary>查看原文（17行）</summary>

```text
  const id = decodeURIComponent(match[1])
  const ref = attachmentRefById(id)
  if (ref === undefined) {
    res.writeHead(404)
    res.end()
    return
  }
  const attachments = ctx.get('attachments')
  if (attachments === undefined) {
    res.writeHead(404)
    res.end()
    return
  }
  try {
    const stored = await attachments.readImage(ref)
    res.writeHead(200, { 'content-type': ref.mediaType, 'content-length': String(stored.data.byteLength), 'cache-control': 'private, max-age=3600' })
    res.end(Buffer.from(stored.data))
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-describe-image/src/client/send-hook.ts:67-85](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/client/send-hook.ts#L67-L85)

多图按顺序上传，回退时未执行先前保存的回滚。

<details>
<summary>查看原文（19行）</summary>

```text
    const refs: string[] = []
    for (const attachment of attachments) {
      const read = await readFileAsBase64(attachment.file)
      if (!read.ok) break
      const upload = await uploadImageForDescribe(read.base64, attachment.file.type, attachment.file.name)
      if (!upload.ok) break
      refs.push(upload.markdown)
    }
    if (refs.length !== attachments.length) {
      // Upload fell short: keep the shell's original behavior (which will
      // reject the image block for a text-only model).
      return original.call(face, session, text, imageIds, mode)
    }
    const fullText = [text.trim(), ...refs].filter(part => part !== '').join('\n')
    const result = await session.prompt([{ type: 'text', text: fullText }], mode)
    if (!result.ok) {
      throw new Error(`conversation.send failed: ${result.error?.code ?? 'unknown'}: ${result.error?.message ?? ''}`)
    }
    for (const id of imageIds) face.releaseDraftImage(id)
```

</details>

#### 缺口

- 未在同一提供方、宿主与样本集上测延迟、重复调用和冷启动。
  **影响**：无法给出回落后的费用与独立复现能力。
  **进一步探讨**：使用非敏感测试端点记录上传、视觉 POST、缓存到期和宿主重启后的引用结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，如何验证更严格的图片来源与回执？

**研究主题**：采用判断、新假设与验证

#### 完整回答

对仅文本模型有重复公开截图整理任务的用户，可以先观察该接线。只有确认宿主授权及图片出站边界、明确端点用途后，再考虑用本机受控端点分析一张合成图片，要求返回可人工核对的表格字段。相比人工复制文字，其潜在增量是保留图像体验并让模型自行请求定向提取，但仍要核查易错内容。图片包含敏感资料、来源超出预期或请求位置无法确认时应回到手动转述，关闭或删除插件不能证明已传数据被端点删除。

可以测试每次工具调用附上最小来源凭据、明确目标视觉端点，并允许宿主经统一授权只读取指定的附件及公共样本。以同一批合成截图、未知链接、越界本地路径和返回错误的模拟端点对照现版、来源约束版与手工输入。观察字段正确率、被拒的越域访问、误拒及人工耗时。如果合规图片的误拒增加，而模拟越权或错误字段没有减少，则缺乏继续加入这项操作的依据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:153-182](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L153-L182)

本地与网络输入进入工具的具体边界。

<details>
<summary>查看原文（30行）</summary>

```text
  if (/^https?:\/\//i.test(trimmed)) {
    const response = await fetch(trimmed, { signal, redirect: 'error' })
    if (!response.ok) {
      throw new Error(`describe-image: image fetch returned HTTP ${response.status}`)
    }
    const declared = Number(response.headers.get('content-length'))
    if (Number.isSafeInteger(declared) && declared > maxBytes) {
      throw new Error(`describe-image: image is ${declared} bytes, above the ${maxBytes}-byte bound`)
    }
    const bytes = await readBoundedBody(response, maxBytes)
    return toImage(bytes, trimmed)
  }
  // A bare attachment id — the `sha256:…` string text models tend to copy out of
  // an `[image attachment …]` note instead of the whole JSON. Resolve it through
  // the attach-route registry (the store's digest verification still runs).
  const registered = attachmentRefById(trimmed)
  if (registered !== undefined) {
    const bytes = await readAttachment(ctx, JSON.stringify(registered), signal)
    if (bytes.length > maxBytes) {
      throw new Error(`describe-image: image is ${bytes.length} bytes, above the ${maxBytes}-byte bound`)
    }
    return toImage(bytes, trimmed)
  }
  const info = await stat(trimmed, { bigint: false })
  if (!info.isFile()) throw new Error(`describe-image: image path is not a file: ${trimmed}`)
  if (info.size > maxBytes) {
    throw new Error(`describe-image: image is ${info.size} bytes, above the ${maxBytes}-byte bound`)
  }
  const bytes = await readFile(trimmed, { signal })
  return toImage(bytes, trimmed)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-describe-image/src/vision-client.ts:275-305](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/vision-client.ts#L275-L305)

模型端点会取得同一完整图像和提示。

<details>
<summary>查看原文（31行）</summary>

```text
/** Build the request the configured style sends: its path and JSON body. */
export function buildVisionRequest(spec: ResolvedConfig, prompt: string, image: LoadedImage): { path: string; body: string } {
  const dataUrl = `data:${image.mimeType};base64,${image.bytes.toString('base64')}`
  if (spec.apiStyle === 'responses') {
    return {
      path: `${spec.baseURL}/responses`,
      body: JSON.stringify({
        model: spec.model,
        max_output_tokens: spec.maxOutputTokens,
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: dataUrl },
          ],
        }],
      }),
    }
  }
  return {
    path: `${spec.baseURL}/chat/completions`,
    body: JSON.stringify({
      model: spec.model,
      max_tokens: spec.maxOutputTokens,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      }],
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-describe-image/src/index.ts:168-173](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/src/index.ts#L168-L173)

直接执行路径可作为对照。

```text
    async execute(args, exec) {
      const active = spec()
      const apiKey = await resolveApiKey(ctx, active)
      const image = await loadImage(ctx, args.image, exec.signal, active.maxBytes)
      const text = await callVision(active, apiKey, args.prompt ?? active.defaultPrompt, image, exec.signal, visionCache)
      return { text, model: active.model, image: args.image, mimeType: image.mimeType, bytes: image.bytes.length }
```

**依据 4 · 作者声明**：[packages/dsh-tool-describe-image/README.md:5-14](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-tool-describe-image/README.md#L5-L14)

目标是对只文本模型提供图片处理。

<details>
<summary>查看原文（10行）</summary>

```text
Model-facing `describe_image` tool: gives **text-only models** (DeepSeek V4 etc.) image understanding.
Each call loads one image — a local file path, an http(s) URL, or a session attachment reference —
and asks an OpenAI-compatible vision endpoint (Qwen-VL, GLM-4V, GPT-4o, a local Ollama endpoint…) to
answer over the Chat Completions or Responses protocol; **only the returned text enters the
conversation, the image itself never enters the session log**.

Ported from deepseek-harness `packages/vision/tool-describe-image` (mirrored at
[whitelonng/dsh-plugin-describe-image](https://github.com/whitelonng/dsh-plugin-describe-image)),
adapted to the dsh-web-ui family conventions: official NPM SDK only, host-side plugin with a
browser half, live settings, no dsh source changes.
```

</details>

#### 缺口

- 未有来源约束对照实现和视觉准确性结果。
  **影响**：无法由源码预期定量节时或成功率。
  **进一步探讨**：固定截图与人工标准答案，记录遗漏、误识别、越界拒绝和时间。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
