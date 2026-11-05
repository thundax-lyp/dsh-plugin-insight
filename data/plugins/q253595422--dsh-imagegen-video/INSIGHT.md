# dsh-imagegen-video

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[fb8fbe1](https://github.com/q253595422/dsh-imagegen-video/tree/fb8fbe1d7859485beda4ae8bd99f837442d6444e)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/q253595422/dsh-imagegen-video) [![npm 30d 6,009](https://img.shields.io/static/v1?label=npm+30d&message=6%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video)
<!-- END META -->

> **功能**：在 DSH 中接入图像和异步视频生成渠道，统一管理任务、历史与画布，并支持本地拼接和代码渲染。

> **亮点**：把模型图像/视频结果汇入同一历史和创作工作流，并把视频远端ID用于恢复、将本地取消与远端状态分开；这是适配与流程组织，不是生成模型创新。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：当前视频远端取消全部不支持，而本地代码实际帧函数不受创建阶段vm timeout抢占；因此本地取消/超时显示不能被理解为停止计费或终止任意代码。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 图像与视频统一工作台相对供应商页面增加什么？](#detail-section-11)
  - [Q02 · 模型图像/视频从请求到本地结果如何接通？](#detail-section-12)
  - [Q03 · 取消和重启恢复是否意味着停止计费或避免重复提交？](#detail-section-13)
  - [Q04 · 本机代码渲染能否据VM与deadline称作可靠隔离？](#detail-section-14)
  - [Q05 · 拼接、长期成本和使用决定如何受这些边界影响？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复生成和整理图片/短视频的DSH用户可研究统一渠道、任务和历史入口，成品质量仍需人工核对。[Q01](#research-q01)

供应商页面加本地剪辑更分散但状态和费用直接可见；本组件集中流程，同时增加渠道、任务账本和本地执行维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| generate_image/edit_image | 模型图片生成与修改 | 需匹配渠道协议和外发素材许可 |
| 图像任务查询/取消 | 查看本地生成状态 | 不推断远端撤销 |
| generate_video/from_image | 文生/参考图视频任务 | 异步供应商渲染，结果需下载落盘 |
| 视频任务查询/取消 | 追踪远端ID与本地状态 | 当前远端取消不支持，可能继续计费 |
| 远端任务恢复 | 重启后轮询原ID | ID须已保存；retry另提交 |
| 本地片段拼接 | 多素材编码为一个成片 | ffmpeg/ffprobe必需，消耗本机资源 |
| 代码渲染 | 聊天模型程序生成像素/视频 | 同步帧不受编译timeout抢占，不作为可靠隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/systemPrompt/commands与可选tools/attachments | 对应入口必需 | 路由、会话与工具 | 实际宿主兼容需固定验证 |
| 生成渠道API/key与所选协议模型 | 模型生成必需 | 远端图片/视频 | 配置或协议不符明确失败 |
| 宿主聊天模型 | 规划/代码路径条件 | 计划或绘图程序 | 不是不消耗模型费用 |
| ffmpeg与ffprobe | 拼接必需 | 探测并本地编码 | 缺工具不能拼接 |
| 独立数据与上游imagegen互斥 | 切换条件 | 保护共用目录/路由 | 并装冲突应停用备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份共用数据并选一个渠道/模型 | 核对素材外发与预算 |
| 加载 | Host注册路由和工具，用户保存模型配置 | 配置存在不代表服务已验 |
| 生成 | 模型路径提交任务并等结果落盘 | 保存远端ID与本地终态，核对文件 |
| 取消/重试 | 用户先查供应商任务和费用 | 本地取消不停止远端；retry是新提交 |
| 本地处理 | 有工具才拼接；代码路径先暂停采用 | 未解决隔离前不视为可靠沙盒 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 渠道、宿主、下载与本地工具资源未知 | 配置协议、key、数据与权限 | 不并装冲突路线 |
| 持续使用 | 生成/规划模型费用、CPU与磁盘未知 | 等待、素材挑选与成品复核 | 本地拼接无生成API调用但非零成本 |
| 失败恢复 | 远端渲染仍可能计费，重试另提交 | 核对ID/账单/落盘窗口与进程 | 无合格成品对照不算ROI |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一创作 | 渠道与历史结果汇合 | 质量、节时与商业收益 |
| 异步恢复 | 按持久远端ID恢复轮询 | 崩溃窗口和重复费用 |
| 本地取消 | 本地状态及abort | 供应商停止，当前远端不支持 |
| 代码渲染 | 聊天代码绘制与编码实现 | 任意代码可终止/隔离保证 |
| 拼接 | 本地探测与ffmpeg输出检查 | 实际成片质量及资源耗时 |

> **思考**：当前视频远端取消全部不支持，而本地代码实际帧函数不受创建阶段vm timeout抢占；因此本地取消/超时显示不能被理解为停止计费或终止任意代码。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型图像/视频结果汇入同一历史和创作工作流，并把视频远端ID用于恢复、将本地取消与远端状态分开；这是适配与流程组织，不是生成模型创新。[Q01](#research-q01) [Q03](#research-q03)

远端ID恢复、重试另提交和取消状态分离值得借鉴；但pending持久化窗口及同步帧调用预算是重要恢复条件，功能广不等于边界完整。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

当前视频远端取消全部不支持，而本地代码实际帧函数不受创建阶段vm timeout抢占；因此本地取消/超时显示不能被理解为停止计费或终止任意代码。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并核清代码执行隔离和远端账单；不要把本地取消当止费，也不要把VM注释当安全验收。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

渠道适配、异步任务、历史和本地拼接有源码依据；供应商效果/计费与代码隔离未验证，不能按注释当安全保证。恢复和隔离改进为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/routes.ts、src/engine.ts、src/generation-runtime.ts、src/video-engine.ts、src/video-task-queue.ts、src/agent-video-tools.ts、src/agent-image-tools.ts、src/code-render.ts、src/code-render-runtime.ts、src/clip-compose.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查模型图像/视频runtime、视频队列/取消、代码渲染和本地拼接主线；未执行目标/供应商，未审所有协议族、PPT、电商、外部Skill或订阅OAuth，不声称全面审计。
- 下一步：先在受限独立环境验证代码帧终止与进程清理，再固定单渠道任务对照提交/取消/恢复、费用和产物；拼接记录实际成片与资源。

**分析版本**

- **仓库**：[q253595422/dsh-imagegen-video](https://github.com/q253595422/dsh-imagegen-video)
- **版本号**：1.22.2（[固定提交 fb8fbe1](https://github.com/q253595422/dsh-imagegen-video/tree/fb8fbe1d7859485beda4ae8bd99f837442d6444e)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将远端任务账本和可强制终止的隔离渲染分开验收，可能降低重复付费与无法收口的恢复负担；须同故障轨迹比较，尚未实现或验证。[Q05](#research-q05)

先在受限独立环境验证代码帧终止与进程清理，再固定单渠道任务对照提交/取消/恢复、费用和产物；拼接记录实际成片与资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 72 | 9541 | — | — | 129895 |
| .mjs | source | 37 | 26427 | 18857 | 6480 | — |
| .js | source | 1 | 205 | 141 | 50 | — |
| .ts | source | 98 | 39542 | 29261 | 8303 | — |
| .mjs | test | 1 | 100 | 92 | 0 | — |
| .tsx | source | 38 | 24188 | 19807 | 3529 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/q253595422/dsh-imagegen-video/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一创作工作流能否在远端计费、恢复和本地执行边界可核对时成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 图像与视频统一工作台相对供应商页面增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要反复生成、编辑并整理图片与短视频的DSH内容创作者。合格结果是知道每次用了哪个渠道/模型、得到可回读文件与历史，并能复用素材；不等于模型效果一定更好或电商收益提高。相对供应商独立页面和本地剪辑，它把渠道选择、任务、历史与画布接到同一宿主。图像生成继承兼容供应商和原imagegen路线，README明确不能与@dickpy/dsh-imagegen同时启用，路由和数据目录共用；切换应备份，不能当互不影响的独立安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-63](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/README.md#L61-L63)

作者路线冲突和共用数据警告。

```text
> ⚠️ **不要与 `@dickpy/dsh-imagegen` 同时安装。** 两者注册的是同一套
> `/api/dsh-imagegen/*` 路由和同一个 UI 面板，同时启用会冲突。数据目录
> `~/.dsh/dsh-imagegen/` 也是两者共用的，切换前请先备份。详见 [授权与致谢](#license)。
```

**依据 2 · 作者声明**：[README.md:81-92](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/README.md#L81-L92)

作者统一工作台范围。

<details>
<summary>查看原文（12行）</summary>

```text
| 能力 | 用途 |
| --- | --- |
| **无限画布** | 把提示词、参考图和生成节点连成可迭代的创作流程。 |
| **视频节点与拼接** | 视频节点与图片节点同一套控制；多选后按画布位置拼成一条成片。 |
| **分镜节点** | 一列镜头各出一段视频，可接上一镜尾帧；成品就是普通视频节点，同样能拼接。 |
| **时间线与身份锚定** | 成片可以在时间线里排序、裁剪、加转场再拼；钉住的角色/物品会跟着后续每一次生成。 |
| **电商套图** | 从商品参考图生成主图、卖点图、场景图等成套素材。 |
| **文生图 / 图生图** | 使用兼容的生图渠道生成、编辑并比较图片。 |
| **生视频** | 文生视频、图生视频、首尾帧与多参考图；按协议族适配异步渲染与轮询。 |
| **代码生成** | 让 DSH 里已有的对话模型写绘图程序，本机渲染成视频或图片；不调生图/生视频模型，每个任务单独选。 |
| **对话与 Agent** | 在 DSH 对话中生成图片、继续编辑，并把结果带回会话。 |
| **画廊与历史** | 图片与视频同列管理，支持模板与标签；在不同设备上接续创作。 |
```

</details>

**依据 3 · 源码核查**：[src/generation-runtime.ts:459-503](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/generation-runtime.ts#L459-L503)

渠道选择、生成与统一历史写入。

<details>
<summary>查看原文（45行）</summary>

```text
  async run(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult> {
    // The code path needs no image model, so it is resolved before any channel
    // lookup: requiring a configured image channel here would be a lie.
    if (request.renderer === 'code') return await this.runImageCode(request, signal)
    const view = this.resolve()
    const channel = view.channels.find(candidate => candidate.id === request.channelId)
      ?? view.channels.find(candidate => candidate.id === view.defaultChannelId)
      ?? view.channels[0]
    if (channel === undefined) {
      throw new ImageGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    const result = channel.auth === 'subscription' && channel.subscription !== undefined
      ? { images: await this.generateSubscription(channel.subscription, request, signal) }
      : await generateImage({ apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name, watermark: channel.watermark } satisfies UpstreamConfig, request, { signal })
    try {
      // Same contract as the code path: the id must exist before the append so
      // the caller can echo it back as `embedId` and resolve the written files.
      const entryId = randomUUID()
      const history = await this.history.append({
        id: entryId,
        createdAt: Date.now(),
        mode: request.mode,
        model: request.model,
        prompt: request.prompt,
        size: request.size,
        quality: request.quality,
        detail: request.detail,
        n: request.n,
        images: result.images,
        ...request.refName === undefined ? {} : { refName: request.refName },
        ...request.channelId === undefined ? {} : { channelId: request.channelId },
        ...request.channel === undefined ? {} : { channel: request.channel },
        ...request.comparisonId === undefined ? {} : { comparisonId: request.comparisonId },
        ...request.comparisonModels === undefined ? {} : { comparisonModels: request.comparisonModels },
        ...request.workflow === undefined ? {} : { workflow: request.workflow },
        ...request.projectId === undefined ? {} : { projectId: request.projectId },
        ...request.projectName === undefined ? {} : { projectName: request.projectName },
        ...request.slotKey === undefined ? {} : { slotKey: request.slotKey },
        ...request.slotLabel === undefined ? {} : { slotLabel: request.slotLabel },
        ...request.canvas === undefined ? {} : { canvas: request.canvas },
      })
      return {
        ...result,
        ...history.some(entry => entry.id === entryId) ? { embedId: entryId } : {},
        history,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型图像/视频从请求到本地结果如何接通？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host把runtime交makeRoutes并注册到webServer，另在tools可用时注册图像/视频工具。图像运行先选渠道，缺配置明确失败，按订阅或API路径生成再追加历史；通用image engine按协议分派，部分模型拒绝不支持的edit。视频工具读取宿主附件并校验首帧，提交队列；runtime映射模型别名到协议族，未知族失败，可选director计划直接成为提交请求，然后generateVideo得到bytes再写视频历史。远端模型/API和内容审查是外部依赖，源码适配不证明各供应商在线兼容或结果质量。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1153-1176](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/index.ts#L1153-L1176)

实际route到runtime接线。

<details>
<summary>查看原文（24行）</summary>

```text
        const routes = makeRoutes({
          settings: seam,
          settingsNamespace,
          resolve: () => {
            const value = resolve()
            const channel = value.channels.find(candidate => candidate.id === value.defaultChannelId) ?? value.channels[0]
            return { apiUrl: channel?.apiUrl ?? '', apiKey: channel?.apiKey ?? '' }
          },
          resolveChannels: channelsView,
          resolvePrompt: () => resolvePromptModelConfig(resolve()),
          resolveImageModels: () => {
            const value = resolve()
            return [...new Set(value.channels.flatMap(channel => channel.models.map(model => model.alias)))]
          },
          attachments: sctx.attachments,
          pendingConversationImages,
          runtime,
          subscriptions,
          resolveStorage: () => resolve().storage,
          skills: skillRunner,
          pptRuntime,
          skillLibrary,
        })
        const disposers = routes.map(route => ctx.webServer.register(route))
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:1567-1592](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/engine.ts#L1567-L1592)

配置与协议分派、并行生成。

<details>
<summary>查看原文（26行）</summary>

```text
export async function generateImage(upstream: UpstreamConfig, request: GenerateRequest, options: { signal?: AbortSignal } = {}): Promise<GenerateResult> {
  const configuredBaseUrl = upstream.apiUrl.trim().replace(/\/+$/, '')
  const baseUrl = normalizeModelScopeBaseUrl(configuredBaseUrl, upstream.apiUrlFull === true)
  if (baseUrl === '') throw new ImageGenError('api_url 未配置：请先在「设置 → 生图配置」中填写', 'config-missing')
  if (upstream.apiKey.trim() === '') throw new ImageGenError('api_key 未配置：请先在「设置 → 生图配置」中填写', 'config-missing')
  if (resolveChannelProtocol(baseUrl, upstream.protocol) === 'chat-completions') {
    return { images: await generateChatCompletionImages(upstream, baseUrl, request, options.signal) }
  }
  // A complete URL is an explicit escape hatch to the exact provider endpoint:
  // use the generic OpenAI-compatible request shape instead of native family
  // routing or appending another path.
  if (upstream.apiUrlFull !== true) {
    // ModelScope exposes Qwen models through the OpenAI-compatible image API,
    // not DashScope's native multimodal-generation contract.
    if (!isModelScopeInference(baseUrl) && isQwenImage(wireModel(request))) return generateQwenImage(baseUrl, upstream, request, options)
    if (isMiniMaxImage(wireModel(request))) return generateMiniMaxImage(baseUrl, upstream, request, options)
    if (request.mode === 'edit' && isZhipuImage(wireModel(request))) {
      throw new ImageGenError('智谱 GLM-Image 当前仅支持文生图，请切换到文生图模式或选择支持图生图的模型', 'edit-unsupported')
    }
  }
  const params = effectiveParams(request, upstream)
  const count = effectiveCount(request)
  const batches = await Promise.all(
    Array.from({ length: count }, () => requestOneImage(baseUrl, upstream, request, params, options.signal)),
  )
  return { images: batches.flat() }
```

</details>

**依据 3 · 源码核查**：[src/agent-video-tools.ts:299-323](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/agent-video-tools.ts#L299-L323)

参考附件到队列。

<details>
<summary>查看原文（25行）</summary>

```text
      async execute(args, exec) {
        const config = ensureConfigured()
        const picked = resolveAgentVideoModel(config, args.model)
        requireKnownFamily(picked.upstream)
        const mode: VideoMode = args.mode === 'keyframe' ? 'keyframe' : args.mode === 'reference' ? 'reference' : 'image'
        const readFrame = async (value: unknown, what: string): Promise<string | undefined> => {
          if (value === null || typeof value !== 'object') return undefined
          const reference = await ctx.attachments.readImage(restoreRef(value as Record<string, unknown>), exec.signal)
          if (reference.data.byteLength === 0) throw new VideoGenError(`${what} had no readable bytes.`, 'video-bad-reference')
          return imageDataUrl(reference)
        }
        const image = await readFrame(args.image, 'image')
        const first = await readFrame(args.first_frame, 'first_frame')
        const last = await readFrame(args.last_frame, 'last_frame')
        if (mode === 'keyframe' && first === undefined) {
          throw new VideoGenError('mode=keyframe needs first_frame (and optionally last_frame).', 'video-bad-reference')
        }
        if (mode !== 'keyframe' && image === undefined) {
          throw new VideoGenError(`mode=${mode} needs image.`, 'video-bad-reference')
        }
        const frame = mode === 'keyframe'
          ? { ...first === undefined ? {} : { firstFrame: first }, ...last === undefined ? {} : { lastFrame: last } }
          : { image: image!, refName: 'reference' }
        const task = runtime.videoQueue.submit(buildRequest(picked, args, mode, frame))
        return taskResult(args.wait_for_completion === false ? task : await waitForAgentVideoTask(runtime, task.id, exec.signal))
```

</details>

**依据 4 · 源码核查**：[src/generation-runtime.ts:177-196](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/generation-runtime.ts#L177-L196)

代码路径与模型路径分开，模型映射。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/generation-runtime.ts:218-269](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/generation-runtime.ts#L218-L269)

计划、生成与视频历史。

<details>
<summary>查看原文（52行）</summary>

```text
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
          method: 'POST',
          failureCode: 'video-plan-degraded',
          message: plan.degradedReason ?? '规划降级为离线模式',
          requestExcerpt: plan.notes.length > 0 ? plan.notes.join(' · ') : undefined,
          durationMs: Date.now() - startedAt,
          hadAuth: (this.directorSeam()?.resolveConfig().apiKey.trim() ?? '') !== '',
        })
      }
      effective = applyPlan(effective, plan)
    }

    const result = await generateVideo(
      { apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name } satisfies UpstreamConfig,
      effective,
      { ...signal === undefined ? {} : { signal }, family },
    )
    const entryId = randomUUID()
    try {
      const history = await appendVideoHistory({
        id: entryId,
        createdAt: Date.now(),
        mode: effective.mode,
        model: effective.model,
        prompt: effective.prompt,
        aspectRatio: effective.aspectRatio,
        resolution: effective.resolution,
        seconds: effective.seconds,
        files: result.videos.map(video => ({
          bytes: video.bytes,
          mime: video.mime,
          ...video.duration === undefined ? {} : { duration: video.duration },
          ...video.poster === undefined ? {} : { poster: video.poster },
          ...video.revisedPrompt === undefined ? {} : { revisedPrompt: video.revisedPrompt },
        })),
        ...request.refName === undefined ? {} : { refName: request.refName },
        ...channel.id === undefined ? {} : { channelId: channel.id },
        channel: channel.name,
        ...plan === undefined ? {} : { plan },
      })
```

</details>

#### 缺口

- 没有同版本供应商接口与图像/视频产物的运行原件。
  **影响**：不能保证各协议族、参考图和参数在所用渠道可用。
  **进一步探讨**：固定一个渠道/模型/任务，以允许外发的素材核查请求、产物、费用和错误。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消和重启恢复是否意味着停止计费或避免重复提交？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

视频取消先把本地任务标cancelled并abort，再异步设置remoteCancel；当前cancelRemoteVideo所有族均返回unsupported，不发送远端取消。因此关闭页面或本地取消不能当已停止供应商渲染/计费。提交回调把remoteTaskId写入pending，落盘失败不终止渲染；恢复只读取一次并为已有本地ID去重，resume携带远端ID而非重新提交，理论上可避免那条已保存任务重复付费。若响应已被供应商接受但ID尚未持久化，崩溃仍有恢复缺口；明确retry会删除resume并新提交，需用户核对供应商状态后决定。

#### 证据与依据

**依据 1 · 源码核查**：[src/video-task-queue.ts:133-150](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/video-task-queue.ts#L133-L150)

远端ID回调后异步保存。

<details>
<summary>查看原文（18行）</summary>

```text
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
      submittedAt: event.submittedAt,
```

</details>

**依据 2 · 源码核查**：[src/video-task-queue.ts:217-246](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/video-task-queue.ts#L217-L246)

本地取消与异步远端状态。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/video-engine.ts:128-137](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/video-engine.ts#L128-L137)

当前全部远端取消不支持。

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

**依据 4 · 源码核查**：[src/video-task-queue.ts:278-318](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/video-task-queue.ts#L278-L318)

按远端ID恢复和去重。

<details>
<summary>查看原文（41行）</summary>

```text
  private async restorePendingOnce(): Promise<VideoRestoreOutcome> {
    let read: { tasks: PendingVideoTask[]; corrupt?: string }
    try {
      read = await this.hooks.readPending()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.hooks.recordFailure({ taskId: '', model: '', mode: '', message, code: 'video-resume-failed' })
      return { restored: 0, error: message }
    }
    if (read.corrupt !== undefined) {
      this.hooks.recordFailure({ taskId: '', model: '', mode: '', message: read.corrupt, code: 'video-resume-failed' })
    }
    let restored = 0
    for (const entry of read.tasks) {
      // A record for a task this process already knows about (the write raced the
      // restore) must not be queued twice.
      if (this.tasks.some(task => task.id === entry.localTaskId)) continue
      const task: VideoTask = {
        id: entry.localTaskId,
        request: {
          mode: entry.request.mode,
          model: entry.modelAlias,
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

#### 缺口

- 供应商接受到pending写入之间的崩溃恢复和费用结果未实测。
  **影响**：丢失远端ID时重试可能另收一次费用，不能承诺绝无重复提交。
  **进一步探讨**：在隔离任务追踪提交、ID响应、落盘和崩溃时点，先查询供应商再决定新提交。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本机代码渲染能否据VM与deadline称作可靠隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

代码渲染是独立路径：聊天模型写程序，renderCode把函数在vm上下文编译，再直接调用该函数绘制像素，视频通过ffmpeg编码。vm.runInContext的2秒timeout只包住创建函数；实际factory调用在返回的闭包里，renderFrame也只在调用前检查时间与abort。若生成函数不返回，循环外deadline和取消检查无法抢占它；这是固定控制流可见的限制，本次未运行复现。调用还传入宿主构造器与绘图API，所以不能仅凭“空context、无require”的注释证明不可信代码隔离。当前不应把模型生成代码路径当可靠沙盒；独立进程/受限执行环境与每帧可终止预算需要另验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/code-render.ts:481-504](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/code-render.ts#L481-L504)

timeout仅在factory创建，真实调用在外。

<details>
<summary>查看原文（24行）</summary>

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
  }
```

</details>

**依据 2 · 源码核查**：[src/code-render.ts:713-730](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/code-render.ts#L713-L730)

每帧调用前检查时间和取消。

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

**依据 3 · 源码核查**：[src/code-render.ts:748-769](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/code-render.ts#L748-L769)

外层取消杀编码器但不能抢占同步函数。

<details>
<summary>查看原文（22行）</summary>

```text
  const encoder = startEncoder(ffmpeg, width, height, fps)
  let aborted = false
  const onAbort = (): void => {
    aborted = true
    encoder.process.kill('SIGKILL')
  }
  options.signal?.addEventListener('abort', onAbort, { once: true })
  let bytes: Buffer
  try {
    for (let frameIndex = 0; frameIndex < frames; frameIndex++) {
      if (aborted || options.signal?.aborted === true) throw new CodeRenderError('代码渲染已取消', 'render-cancelled')
      await encoder.write(renderFrame(frameIndex))
    }
    bytes = await encoder.finish()
  } catch (error) {
    encoder.process.kill('SIGKILL')
    // Cancelling kills the encoder, so `finish()` sees a non-zero exit. That is
    // not an encoder failure and must not be reported as one.
    if (aborted || options.signal?.aborted === true) {
      throw new CodeRenderError('代码渲染已取消', 'render-cancelled')
    }
    throw error
```

</details>

**依据 4 · 源码核查**：[src/code-render-runtime.ts:172-187](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/code-render-runtime.ts#L172-L187)

代码确实进入renderCode。

<details>
<summary>查看原文（16行）</summary>

```text
  // ---- 2. render ----------------------------------------------------------
  const request: CodeRenderRequest = {
    kind: input.kind,
    source,
    width: plan.width,
    height: plan.height,
    fps: plan.fps,
    seconds: plan.seconds,
  }
  const rendered: CodeRenderResult = await renderCode(
    request,
    {
      ...options.ffmpeg === undefined ? {} : { ffmpeg: options.ffmpeg },
      ...options.signal === undefined ? {} : { signal: options.signal },
    },
  )
```

</details>

#### 缺口

- 未对不返回函数或跨上下文引用做隔离验证。
  **影响**：不能证明超时/取消可终止所有生成代码，更不能给出完整安全保证。
  **进一步探讨**：经明确执行授权后在受限独立进程验证不可返回帧、资源上限和清理；本轮不执行。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 拼接、长期成本和使用决定如何受这些边界影响？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

本地拼接要求ffmpeg和ffprobe，先解析输入/探测再编码，少于两段或缺工具失败，读取产物空字节也报错；它不调用生成模型，但仍消耗CPU、磁盘和人工。首次还需渠道API/key、模型能力配置和本地数据备份，持续有远端生成/规划费用、等待和素材复核；没有合格成品对照，费用与节时未知。当前建议观察，先修清Q04执行隔离，再考虑以有限预算单一模型路径核查。由Q03/Q04可提出“远端任务账本与隔离渲染分别可审计”的未验证假设，比较重复提交、无法终止任务和人工恢复；若仍无法解释远端费用或终止本地执行则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/clip-compose.ts:357-419](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/clip-compose.ts#L357-L419)

工具发现、输入探测与编码结果。

<details>
<summary>查看原文（63行）</summary>

```text
export function createClipComposer(): ClipComposer {
  let cached: ToolPair | undefined
  const locate = (): ToolPair => {
    if (cached === undefined) cached = { ffmpeg: findTool('ffmpeg'), ffprobe: findTool('ffprobe') }
    return cached
  }

  const requireTools = (): Required<ToolPair> => {
    const found = locate()
    if (found.ffmpeg === undefined || found.ffprobe === undefined) {
      throw new Error(`ffmpeg and ffprobe are both required; ${describeTools(found)}`)
    }
    return { ffmpeg: found.ffmpeg, ffprobe: found.ffprobe }
  }

  return {
    available: () => {
      const found = locate()
      return found.ffmpeg !== undefined && found.ffprobe !== undefined
    },

    describe: () => describeTools(locate()),

    /**
     * Turn a served clip URL back into its local file. A clip that is no longer
     * on disk (evicted history entry, foreign URL) resolves to undefined, and
     * the caller must fail the run rather than drop the segment.
     */
    resolve: async (url: string): Promise<string | undefined> => {
      const found = videoFileFrom(url)
      if (found === undefined) return undefined
      const stored = await found.read(found.file)
      return stored?.path
    },

    stitch: async (input): Promise<ClipStitchResult> => {
      const { ffmpeg, ffprobe } = requireTools()
      const sources = [...input.sources]
      if (sources.length < 2) throw new Error(`stitching needs at least two clips, got ${sources.length}`)
      // One trim entry per source, in the same order. Missing entries mean
      // "the whole clip", which is exactly what a plain stitch always meant.
      const trims = input.trims ?? []
      input.onStage?.('probe')
      const probes: ClipProbe[] = []
      for (let index = 0; index < sources.length; index += 1) {
        if (input.signal?.aborted === true) throw new Error('stitch was cancelled')
        const trim = trims[index] ?? { start: 0 }
        probes.push(await probeClip(ffprobe, sources[index]!, trim, input.signal))
      }
      input.onStage?.('encode')
      const dir = await fs.mkdtemp(path.join(tmpdir(), 'dsh-compose-'))
      const target = path.join(dir, 'stitched.mp4')
      try {
        const result = await runProcess(ffmpeg, buildStitchArgs(sources, probes, target, {
          ...input.transitions === undefined ? {} : { transitions: input.transitions },
          ...input.keepAudio === undefined ? {} : { keepAudio: input.keepAudio },
        }), {
          timeoutMs: STITCH_TIMEOUT_MS,
          ...input.signal === undefined ? {} : { signal: input.signal },
        })
        if (result.code !== 0) throw new Error(`ffmpeg exited ${result.code}: ${tail(result.stderr)}`)
        const bytes = await fs.readFile(target)
        if (bytes.length === 0) throw new Error('ffmpeg produced an empty file')
```

</details>

**依据 2 · 源码核查**：[src/video-engine.ts:128-137](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/video-engine.ts#L128-L137)

远端不能确认停止。

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

**依据 3 · 源码核查**：[src/code-render.ts:717-725](https://github.com/q253595422/dsh-imagegen-video/blob/fb8fbe1d7859485beda4ae8bd99f837442d6444e/src/code-render.ts#L717-L725)

同步执行预算缺口。

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
```

#### 缺口

- 没有统一工作台相对供应商页面/剪辑的成品质量与总成本对照。
  **影响**：不能宣称提效、节费或商业收益。
  **进一步探讨**：固定相同素材、模型和成品标准，记录全部尝试、费用、人工与失败恢复。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
