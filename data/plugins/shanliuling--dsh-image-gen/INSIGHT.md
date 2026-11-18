# dsh-image-gen

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[7e3b2fb](https://github.com/shanliuling/dsh-image-gen/tree/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7)

<!-- BEGIN META -->
[![GitHub ★ 1,597](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C597&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/dsh-image-gen) [![npm 30d 87,128](https://img.shields.io/static/v1?label=npm+30d&message=87%2C128&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供对话生图、编辑、批量配图和图像工作台，支持云端模型与本地 ComfyUI。

> **亮点**：[Q01](#research-q01) 逐项回执把图片和失败留在同一任务里，成功位图直接用作会话附件，减去手工上传。工作台把已有和探测到的模型合并到候选，并在后台刷新，减少手填模型标识 [Q05](#research-q05)。矢量结果在对话卡片中可预览和下载，供应商回位图时也会报告实际交付格式 [Q04](#research-q04)。

> **主要限制**：[Q03](#research-q03) 取消会在上游已开始、附件已存或本地写入中间发生，工具错误会遮住已发生的动作，整批重跑可能重复请求。共享 Web 环境还依赖部署者核对入站保护与兼容下载默认值 [Q07](#research-q07)。

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
  - [Q01 · 在 DSH 写文章配图时，顺序批量相比在供应商网页逐张生成和上传，交付增加了什么？](#detail-section-11)
  - [Q02 · 从安装入口到一次图像工具调用，实际由哪些 DSH 服务和渠道分支接续？](#detail-section-12)
  - [Q03 · 中途取消、附件成功和文件保存失败分别留下什么，能否安全重跑整批？](#detail-section-13)
  - [Q04 · 请求 SVG 与中转尺寸时，最终交付怎样判断是真矢量、普通位图或近似比例？](#detail-section-14)
  - [Q05 · 工作台动态发现的模型列表怎样影响模型选择，能否把在列表里视为可调用？](#detail-section-15)
  - [Q06 · 在 GIF 图卡按帧写修改意见后，正在生成、收到结果和版本落地分别由谁处理？](#detail-section-16)
  - [Q07 · 什么安装、网络和成本条件下值得用一组无敏感配图试用，何时应退出？](#detail-section-17)
  - [Q08 · 逐项持久收据在部分失败后的补做中能否减少重复请求？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已在 DSH 写文章或项目材料的创作者，可以把两三条不同主题的配图提示词放在同一会话，按每张结果验收图卡和项目文件。需要精细手改、特定比例或收据可审计的工作，对渠道和输出格式有更严格要求。

手工流程要将提示词逐次带入供应商网站，验图后再下载、上传或拷入项目。已熟悉供应商专用编辑器的人可继续在那里控制高级参数和审计账单。DSH 会话内的流程把请求和附件接在一起，适合主题都已确定、输出需要回到稿件上下文的批次。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| generate_image | 单条提示词生成 | 需要可用渠道；矢量请求只在相应 OpenAI 形状路径处理 |
| generate_images | 为同一任务生成一组图 | 1–10 条，共用调用参数，逐项返回成功或失败 |
| edit_image | 基于参考图修改 | 受图像来源与对应渠道编辑能力限制 |
| find_inspiration | 查找预置案例提示词 | 返回候选模板，图质仍由后续生成和验收决定 |
| 工作台模型候选 | 从有凭据的渠道选择配置及发现模型 | 缓存可能过期，候选可见不代表授权 |
| GIF 图卡编辑 | 按帧写修改意见并保留版本 | 需可解码且支持该格式的渠道，返回静帧亦会记录 |
| SVG 图卡与文件 | 预览、复制或下载实际矢量结果 | 真正收到 SVG；工作区文件需可写目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19.0 或 ≥24，宿主 Tools、Attachments、Credentials | 启动所需 | 加载服务端、注册工具和保存附件 | 核对是否已使用符合同版本声明的宿主 |
| 可用凭据或订阅登录 | 对应云渠道所需 | 执行生成与编辑 | 无权调用，已列模型也可能被拒 |
| 可达 ComfyUI 与 API 工作流 | 本地对话分支所需 | 调用工作流 | 本地分支失效，工作台不接入 |
| Web server 与适用客户端插槽 | 对应界面所需 | 工作台、图卡和图库操作 | 从已验证的宿主表面查找替代入口 |
| 可写会话工作区 | 按项目文件交付时所需 | 保存当前图像 | 可能有附件或 SVG 文本，但没有文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 部署者核对版本、配置渠道与连接条件 | 使用单一可信渠道与无敏感输入 |
| 发起 | 创作者写两三条确切提示词，确认比例和格式 | 工具能调用，按响应实际格式核查 |
| 验收 | 逐图检查卡片与项目文件，确认合格与失败 | 先下载并保护已有结果，再决定是否补做 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、云账号或本机算力 | 核对 profile、凭据及工作区 | 费用及配置耗时未测 |
| 持续使用 | 按张请求、磁盘空间、可能的积分或算力 | 验图、核对实际尺寸、整理文件 | 每张费用及合格率未知 |
| 失败恢复 | 可能损失已提交调用的费用 | 对账、取回可用图、补失败项 | 取消后上游动作和恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 完成一组稿件配图 | 多条提示词顺序调用、按项回报、可见附件 | 最终采用率、总耗时、同款风格 |
| 源文件交付 | 位图可选写文件，SVG 专用路径返回文本及可选 .svg | 渠道实际输出矢量和宿主跨会话保留 |
| 工作台选择模型 | 在配置模型之外异步合并探测结果 | 所列模型是否具有实际调用权限 |
| GIF 修改 | 收到结果后保留原图版本关系并区分静帧 | 不同渠道的帧质量与预览完整性 |

> **思考**：[Q03](#research-q03) 取消会在上游已开始、附件已存或本地写入中间发生，工具错误会遮住已发生的动作，整批重跑可能重复请求。共享 Web 环境还依赖部署者核对入站保护与兼容下载默认值 [Q07](#research-q07)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 逐项回执把图片和失败留在同一任务里，成功位图直接用作会话附件，减去手工上传。工作台把已有和探测到的模型合并到候选，并在后台刷新，减少手填模型标识 [Q05](#research-q05)。矢量结果在对话卡片中可预览和下载，供应商回位图时也会报告实际交付格式 [Q04](#research-q04)。

[Q03](#research-q03) 临时文件、重命名和两次目录实路径检查把一般失败与可用附件区分开。路径检查和取消清理只覆盖本地写入阶段。[Q06](#research-q06) GIF 完成回包以原图身份归档，图片切换时可以保护当前卡片，仍需要核对图库是否实际持久化。模型目录的错误保留亦有明确代价，用户可能短暂看到过期选项。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 取消会在上游已开始、附件已存或本地写入中间发生，工具错误会遮住已发生的动作，整批重跑可能重复请求。共享 Web 环境还依赖部署者核对入站保护与兼容下载默认值 [Q07](#research-q07)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q07](#research-q07) 在可控会话用可信渠道跑两三条公开配图提示词，核对成功图附件、工作区路径和返回格式。共享 Web 在试用前需确认实际连接保护。如果渠道超时、所求比例或格式不符，按 [Q03](#research-q03) 先查已有附件、文件与上游记录，再用原来工具只补缺图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查根 bundle 接线、对话批量与保存、SVG、工作台模型目录、GIF 编辑完成态及两项可选网络边界。逐项对账的改进属于未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、tsdown.config.ts、src/index.ts、cordis.patch.yml、src/client/index.tsx、src/workspace-save.ts、src/openai-compatible.ts、src/client/image-result-view.tsx、src/studio.ts、src/channel-model-discovery.ts、src/client/studio-view.tsx、src/client/gif-comments.tsx、src/client/gif-edit.tsx、src/config.ts、src/web-route.ts、src/public-image-download.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码抽读覆盖对话批量、注册与主要保存边界、SVG／尺寸、工作台目录、GIF 后续编辑及本版安全设置。完整 Canvas、跨模型输出质量、所有供应商、订阅条款及公网部署检查超出本次材料范围。
- 下一步：固定一组无敏感提示词及单一授权渠道，跟踪模型回包、附件、最终文件及账单。分别测试取消、工作区不可写和供应商回错格式，按 [Q08](#research-q08) 比较按项恢复的请求次数和成功图数量。

**分析版本**

- **仓库**：[shanliuling/dsh-image-gen](https://github.com/shanliuling/dsh-image-gen)
- **版本号**：0.11.3（[固定提交 7e3b2fb](https://github.com/shanliuling/dsh-image-gen/tree/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08) 可试验让每项分别对账上游接收、附件和工作区文件，观察它能否避免取消后重复生成。这需要稳定的回执或明确的未知状态，远端无法关联请求时可能失去收益。

固定一组无敏感提示词及单一授权渠道，跟踪模型回包、附件、最终文件及账单。分别测试取消、工作区不可写和供应商回错格式，按 [Q08](#research-q08) 比较按项恢复的请求次数和成功图数量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1174 | — | — | 15141 |
| .mjs | source | 4 | 281 | 242 | 23 | — |
| .mjs | example | 1 | 202 | 187 | 18 | — |
| .ts | source | 96 | 19086 | 15166 | 2777 | — |
| .tsx | source | 19 | 11275 | 9756 | 907 | — |
| .ts | test | 80 | 16013 | 14187 | 630 | — |
| .ts | example | 1 | 18 | 13 | 4 | — |

</details>

**活跃度**

[![近30天新建 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=37&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 36](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=36&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本所支持的对话配图和后续处理流程中，创作者能得到哪些可验收成果，哪些渠道、取消、格式与权限分支会使图卡、文件或成本判断失效？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH 写文章配图时，顺序批量相比在供应商网页逐张生成和上传，交付增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已经在 DSH 编辑文章或项目材料、手头有一组不同主题或版式的配图需求的创作者，现版为一组提示词提供一次发起、依次请求和集中看结果的路径。README 的开业文章四图是作者给出的任务示例；稳定的机制是 generate_images 接收 1 到 10 条提示词，同一次调用对这些提示词共享供应商、模型和本次尺寸等参数，再逐条调用单图路径。每项结果保留原提示词，错误含索引、提示词和消息；会话层将位图呈现为附件，矢量结果按另一路径交付。用供应商网页时，用户通常要另开上下文、逐项复制提示词和搬运合格图。在任务已经位于 DSH 时，这条接线省去了成功位图的手工上传，并保留逐项补做的线索。前提是助手正确分解需求、对应渠道能生成所需内容且用户逐图验收。固定版本未统一保证构图、文字正确或系列风格，复杂返工仍可能更适合直接使用供应商编辑器。共享单渠道参数也不等于一批能给每张设定不同模型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:71-83](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/README.md#L71-L83)

作者以同篇文章的多张插图解释对话批量场景。

<details>
<summary>查看原文（13行）</summary>

```text
## 一句话就能做到

不用学参数，也不用切页面，直接在 DSH 对话里说：

| 你在对话里说                                                  | 插件会做什么                                                                   |
| :------------------------------------------------------------ | :----------------------------------------------------------------------------- |
| 「给《咖啡店开业》这篇文章配 4 张插图，统一扁平插画风，16:9」 | 🔁 **对话批量生图**：Agent 把需求拆成 4 个 Prompt 逐张生成，一条消息收齐整组图 |
| 「用手绘风格 #123 画一张咖啡店菜单」                          | ✨ **自动套用灵感**：Agent 先在 500+ 案例库里检索对应风格，再套用模板出图      |
| 「把我在画布上画的草图变成正式插画」                          | ✏️ **看懂画布**：Agent 读取画布选区，把草稿变成成图                            |
| 「把我圈出来的剑换成斧头，其他不变」                          | 🎯 **圈哪改哪**：只改你标出的局部                                              |
| 「保持这个角色不变，换到雪地场景」                            | 🎭 **角色一致性**：图生图时保持同一个人物或物体，不会换成长得相似的另一个      |
| 「同一个 Prompt，GPT 和 Gemini 各出一张对比」                 | ⚖️ **多模型对比**：并发调用多个模型，放在同一张画布上比较                      |
| 「把这个角色做成一段挥手的 GIF 动图」                          | 🎞️ **GIF 动图**：直接生成循环动画，卡片里播放、调倍速，还能按帧写评论修改      |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:688-720](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L688-L720)

执行顺序、上限、共享参数和按项回执由工具本身实现。

<details>
<summary>查看原文（33行）</summary>

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
    presentResult: (_args, result) => imagePresentation(result),
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1085-1096](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L1085-L1096)

会话通用图卡使用现有附件引用呈现成功图。

<details>
<summary>查看原文（12行）</summary>

```text
function imagePresentation(result: ToolResult) {
  const meta = result.meta
  if (typeof meta === 'object' && meta !== null && !Array.isArray(meta)
    && meta.kind === 'dsh-image-gen-batch' && Array.isArray(meta.images)) {
    const content = meta.images.flatMap(image => {
      const attachment = imageAttachmentFromMeta(image)
      return attachment === undefined ? [] : [{ type: 'image' as const, attachment }]
    })
    return content.length === 0 ? undefined : { card: 'generic' as const, title: 'Generated images', content }
  }
  const attachment = imageAttachmentFromMeta(result.meta)
  return attachment === undefined ? undefined : { card: 'generic' as const, title: 'Generated image', content: [{ type: 'image' as const, attachment }] }
```

</details>

#### 缺口

- 没有同等合格标准下的网页对照
  **影响**：能确认省去的操作，无法量化整批节省时间或合格率
  **进一步探讨**：让同一组创作者分别完成同组配图并记录上传、补做和最终验收结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从安装入口到一次图像工具调用，实际由哪些 DSH 服务和渠道分支接续？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

根包通过 bundle patch 将插件载入 profile，默认 Google。宿主工具、附件、凭据三项注入使工具可注册，连接及 Web server 是 HTTP 功能的后续注入。单图与批量共用 generateSingle，按单次供应商覆盖或兼容渠道折叠配置。ComfyUI 要有可达实例和对应 API 工作流，插件检查参考图槽位，再发合成提示词。订阅分支走独立管理器，普通云端先取凭据，按供应商适配参数，普通云生成部分用调用取消与 watchdog 超时合成信号。位图结果经宿主附件返回，Web 客户端从注册的工具插槽展示。无 Web server 时工具仍可激活，工作台等 HTTP 功能需要另一宿主条件。供应商枚举与项目自述仅说明入口范围，账号权限、订阅条款及宿主互操作仍需实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-55](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/package.json#L39-L55)

补丁和 Web 端宿主依赖。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/cordis.patch.yml#L1-L5)

以包名挂载插件，默认 Google。

```text
- insert:
    - id: image-gen
      name: dsh-image-gen
      config:
        provider: google
```

**依据 3 · 源码核查**：[src/index.ts:58-59](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L58-L59)

三项宿主服务注入。

```text
export const name = 'dsh-image-gen'
export const inject = ['tools', 'attachments', 'credentials']
```

**依据 4 · 源码核查**：[src/index.ts:275-287](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L275-L287)

Web 与连接校验通过后续注入。

<details>
<summary>查看原文（13行）</summary>

```text
  let webAdmission: WebAdmission | undefined
  const getWebAdmission = () => resolveWebAdmission(webAdmission, current().requireHostAdmission === true)
  ctx.inject(['connection'], (connectionCtx: Context) => {
    const check: WebAdmission = request => connectionCtx.connection.requestRejection(request)
    webAdmission = check
    return () => { if (webAdmission === check) webAdmission = undefined }
  })
  // Every HTTP surface needs webServer, which only the web-app bundle (web,
  // desktop) provides; the headless, acp and sdk profiles have none. Mount the
  // routes when it is present so the tools below still activate without it.
  ctx.inject(['webServer'], (webCtx: Context) => {
    const register = (route: WebRoute) => webCtx.webServer.register(withWebAdmission(route, getWebAdmission))
    registerSubscriptionRoutes(webCtx, subscriptionManager, getWebAdmission)
```

</details>

**依据 5 · 源码核查**：[src/index.ts:476-518](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L476-L518)

真实渠道分流与凭据、工作流和请求接线。

<details>
<summary>查看原文（43行）</summary>

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
    if (active.provider === 'google') {
      const aspectRatio = (args.aspect_ratio ?? active.aspectRatio) as AspectRatio
      const imageSize = (args.image_size ?? active.imageSize) as ImageSize
      const generated = await runCloud(signal => generateGoogleImage({ apiKey: credential, endpoint: active.endpoint, native: active.native, model: active.model, prompt: args.prompt, aspectRatio, imageSize, maxBytes: ctx.attachments.imageLimits.maxImageBytes, signal }))
      return saveGenerated(ctx, generated, active.provider, active.model, `${aspectRatio}, ${imageSize}`, current(), exec, knownWorkspaceRoots)
```

</details>

**依据 6 · 源码核查**：[src/client/index.tsx:385-415](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/index.tsx#L385-L415)

客户端注册设置控件和工具结果视图。

<details>
<summary>查看原文（31行）</summary>

```text
  injectSettingsItem(ctx)
  injectComposerPill(ctx)
  // Preview cores can expose the credentials service after this plugin loads:
  // adopt it late and refresh every mounted card through the shared events.
  ctx.inject(['remote.credentials'], (remoteCtx) => {
    const credentials = asCredentialsRemote(remoteCtx.get('remote.credentials'))
    if (credentials === undefined) {
      console.warn('dsh-image-gen: remote.credentials resolved with an incompatible interface; key settings stay degraded')
      return
    }
    credentialsRef.current = credentials
    notifyCredentialsUpdated()
  })

  // 2. Tool result view card in chat stream
  ctx.slots.inject('tool.call.toolview', () => register({
    name: 'tool.call.toolview',
    key: 'generate_image',
    inject: (): ImageCardFace => ({ locale, promoted: promotion.enabled }),
  }, GeneratedImageCard))
  ctx.slots.inject('tool.call.toolview', () => register({
    name: 'tool.call.toolview',
    key: 'generate_images',
    inject: (): ImageCardFace => ({ locale, promoted: promotion.enabled }),
  }, GeneratedImagesCard))
  ctx.slots.inject('tool.call.toolview', () => register({
    name: 'tool.call.toolview',
    key: 'edit_image',
    inject: (): ImageCardFace => ({ locale, promoted: promotion.enabled }),
  }, GeneratedImageCard))

```

</details>

#### 缺口

- 各渠道实际授权、计费和兼容范围未知
  **影响**：渠道枚举不足以承诺运行
  **进一步探讨**：通过一个明确获准的渠道验证固定宿主加载、一次无敏感内容调用及退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 中途取消、附件成功和文件保存失败分别留下什么，能否安全重跑整批？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

位图保存先由 DSH 附件服务检查媒体类型并保存，还可能持久化 GIF 原画。工作区保存是第二步。普通写入错误保留附件，另写 saveError。关闭自动保存或没有会话 cwd 时也可能只有附件。工作区检查目录真实路径，以独占临时文件写入再改名，改名前后检查取消。取消恰落在改名阶段会尝试删掉目标并拒绝成功返回，附件和上游计算没有对应回滚。批量层继续处理普通错误，检测到取消后把剩余项标为未启动。如果取消发生在附件已保存但工具回执未成形时，该批次结果可能只有错误条目，附件、原画或外部请求仍可能留下。重跑前应核对会话、工作区及可信上游日志，取回现存图再补确知缺项。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1017-1045](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L1017-L1045)

先持久化附件，工作区异常单独归入 saveError 或按取消抛出。

<details>
<summary>查看原文（29行）</summary>

```text
  if (generated.mediaType === 'image/svg+xml') {
    if (generated.data.byteLength > ctx.attachments.imageLimits.maxImageBytes) throw new Error('SVG response exceeds the image byte limit')
    return saveGeneratedSvg({ ...generated, mediaType: 'image/svg+xml' }, provider, model, output, config, exec)
  }
  const raster = { ...generated, mediaType: generated.mediaType as ImageAttachmentRef['mediaType'] }
  if (!ctx.attachments.imageLimits.mediaTypes.includes(raster.mediaType)) throw new Error(`This DSH deployment does not accept ${raster.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: raster.data, mediaType: raster.mediaType, name: 'generated-image' })
  const animation = animationOf(raster)
  // Kept before the workspace step so a result without a file (or a disabled
  // workspace) still carries the animation the card plays.
  const original = await keepGifOriginal(vaultConfigOf(config), raster, attachment, message => { ctx.logger.warn(message) })
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
    value.savedTo = await saveImageToWorkspace({ workspaceRoot, folder: config.workspaceFolder, attachmentId: attachment.attachmentId, mediaType: raster.mediaType, data: raster.data, signal: exec.signal })
  } catch (error) {
    exec.signal.throwIfAborted()
    ctx.logger.warn(`dsh-image-gen: failed to save image to workspace: ${error instanceof Error ? error.message : String(error)}`)
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 2 · 源码核查**：[src/workspace-save.ts:124-151](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/workspace-save.ts#L124-L151)

路径校验、临时写入、重命名与取消后的尽力清理。

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

**依据 3 · 源码核查**：[src/index.ts:688-718](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L688-L718)

批量区分逐项错误及未启动项。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

#### 缺口

- 实际供应商中止后的生成及账单语义未知
  **影响**：缺回包不能证明未扣费或无产物
  **进一步探讨**：在请求、附件落地后和 workspace 改名时分别注入取消并按层对账

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 请求 SVG 与中转尺寸时，最终交付怎样判断是真矢量、普通位图或近似比例？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

这条 SVG 对话路径面向 OpenAI 形状渠道。请求会去掉 GIF 帧字段和像素尺寸，也过滤中转中不相容的额外参数，向用户报告被忽略的字段。解析同一次请求返回的数据，内容识别为 SVG 才进入矢量路径。中转忽略字段回位图时会作位图附件，同时工具文本说明未获得矢量。真矢量以标记文本和字节数返回，有工作区时可按内容散列保存为 .svg。Web 图卡用 data URL 的图片元素预览并支持复制与下载，通用图卡只接普通附件，独立 SVG 文件仍应按来源审查后再嵌入文档。普通位图的中转尺寸优先用显式 size，否则按比例取该表最低配置档。没有 3:4 行时可能回退为竖向 1024x1536，保留取向但并无精确比例。工作台位图分支会拒绝 SVG。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:530-560](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L530-L560)

格式决定帧参数与尺寸查表。

<details>
<summary>查看原文（31行）</summary>

```text
    // GIF fields ride the same extraBody channel as the relay extras, merged
    // after them so a per-call parameter wins over the channel default. A
    // channel whose extras already select GIF counts as a GIF request, so a
    // call may tune the frames alone.
    const channelExtraBody = active.provider === 'openai-compat' ? requestConfig.openaiCompatExtraBody ?? {} : undefined
    const channelFormat = channelExtraBody?.output_format
    const requestedFormat = args.output_format ?? (channelFormat === 'gif' || channelFormat === 'svg' ? channelFormat : undefined)
    // Some chat models fill every optional parameter, so an SVG call can carry
    // frame fields it never meant (#137). The channel's own frame extras are
    // already dropped for SVG below; per-call ones are dropped the same way
    // and reported, instead of failing the whole request.
    const svgFramesDropped = requestedFormat === 'svg' && (args.frame_count !== undefined || args.frame_duration_ms !== undefined)
    const outputFields = outputRequestFields(svgFramesDropped
      ? { outputFormat: 'svg' }
      : { outputFormat: requestedFormat, frameCount: args.frame_count, frameDurationMs: args.frame_duration_ms })
    const gifRequested = outputFields.output_format === 'gif'
    const svgRequested = outputFields.output_format === 'svg'
    // A GIF without an explicit size leaves the frame size to the provider:
    // the still-image default of 1024x1024 overflows the frame sheet. An SVG
    // has no pixel grid at all, so a still-image size would only be rejected.
    // A relay's `aspect_ratio` maps through the same configured size table the
    // workbench uses, so the chat tools and the studio agree on one resolution.
    // The whole decision lives in `chatToolSize` so it can be unit-tested
    // without standing up a Context.
    const size = chatToolSize({
      provider: active.provider,
      config: requestConfig,
      fallbackSize: active.imageSize,
      args,
      gifRequested,
      svgRequested,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:569-610](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L569-L610)

格式过滤以及同一调用返回位图的回执。

<details>
<summary>查看原文（42行）</summary>

```text
    // A vector document has no pixel dimensions, so an explicit size is not
    // forwarded; say so instead of letting the relay ignore it silently.
    const sizeNotice = svgRequested && (args.size !== undefined || args.aspect_ratio !== undefined || args.image_size !== undefined)
      ? `Note for the user: size/aspect_ratio/image_size do not apply to an SVG result, so the requested ${args.size ?? args.aspect_ratio ?? args.image_size ?? ''} was not sent.`
      : undefined
    const frameNotice = svgFramesDropped
      ? 'Note for the user: frame_count/frame_duration_ms only apply to a GIF, so they were not sent with this SVG request.'
      : undefined
    const quality = active.provider === 'openai-compat' ? compatRequestQuality(requestConfig, args.quality) : active.provider === 'openai' ? args.quality : undefined
    if (active.provider === 'openai' && quality !== undefined && !officialQualityOptions(active.model).some(option => option.value === quality)) throw new Error('该 OpenAI 模型不支持所选生成质量')
    // A GIF channel's frame controls and a configured pixel size do not apply
    // to a vector document, so an SVG request leaves them out.
    const channelExtras = svgRequested && channelExtraBody !== undefined
      ? Object.fromEntries(Object.entries(channelExtraBody).filter(([key]) => !SVG_INCOMPATIBLE_EXTRAS.has(key)))
      : channelExtraBody
    const extraBody = channelExtras !== undefined ? { ...channelExtras, ...outputFields } : Object.keys(outputFields).length === 0 ? undefined : outputFields
    const generated = await runCloud(signal => generateOpenAICompatibleImage({
      strictImageDownloads: current().strictImageDownloads === true,
      provider: active.provider,
      apiKey: credential,
      baseURL: active.baseURL,
      model: active.model,
      prompt: args.prompt,
      maxBytes: ctx.attachments.imageLimits.maxImageBytes,
      signal,
      ...(size === undefined ? {} : { size }),
      ...(quality === undefined ? {} : { quality }),
      ...(extraBody === undefined ? {} : { extraBody }),
      ...(arkOptions === undefined ? {} : { arkOptions }),
    }), gifRequested)
    // Report what the provider actually delivered: a relay that ignores
    // output_format returns a bitmap, and the card must not claim 'svg'.
    const deliveredSvg = generated.mediaType === 'image/svg+xml'
    const output = deliveredSvg ? 'svg' : size ?? 'auto'
    const value = await saveGenerated(ctx, generated, active.provider, active.model, quality === undefined ? output : `${output}, quality=${quality}`, current(), exec, knownWorkspaceRoots)
    if (sizeNotice !== undefined) value.notice = value.notice === undefined ? sizeNotice : `${value.notice} ${sizeNotice}`
    if (frameNotice !== undefined) value.notice = value.notice === undefined ? frameNotice : `${value.notice} ${frameNotice}`
    const svgFallback = svgRequested && !deliveredSvg
      ? `Note for the user: an SVG was requested, but the provider returned a ${generated.mediaType.replace('image/', '').toUpperCase()} raster image; the result is a bitmap, not a vector document.`
      : undefined
    if (svgFallback !== undefined) value.notice = value.notice === undefined ? svgFallback : `${value.notice} ${svgFallback}`
    return active.provider === 'openai-compat' ? { ...value, channel: resolveOpenAICompatChannel(requestConfig, args.channel).id } : value
```

</details>

**依据 3 · 源码核查**：[src/openai-compatible.ts:307-322](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/openai-compatible.ts#L307-L322)

按返回字节识别 SVG。

<details>
<summary>查看原文（16行）</summary>

```text
  input: ImageResponseOptions,
): Promise<GeneratedCompatibleImage> {
  const text = await readBoundedText(response, Math.ceil(input.maxBytes * 1.4) + ERROR_LIMIT)
  if (!response.ok) throw new Error(`${provider} image request failed (${response.status}): ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`)
  let payload: unknown
  try { payload = JSON.parse(text) } catch { throw new Error(`${provider} image request returned invalid JSON`) }
  const image = firstImage(payload)
  if (image === undefined) throw new Error(`${provider} image request returned no image: ${redactSecrets(text, input.apiKey).slice(0, ERROR_LIMIT)}`)
  if (image.b64_json !== undefined) {
    // Relays may omit mime_type while returning non-PNG bytes (Ark jpeg), so
    // sniff before trusting the header to avoid IMAGE_TYPE_MISMATCH (#61).
    const data = decodeBase64(image.b64_json, provider)
    if (isSvgDocument(data)) return { data, mediaType: 'image/svg+xml' }
    return { data, mediaType: detectImageMediaType(data) ?? imageMediaType(image.mime_type) ?? 'image/png' }
  }
  return downloadImage(image.url, provider, input)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1059-1082](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L1059-L1082)

矢量 markup 和可选 .svg 持久化。

<details>
<summary>查看原文（24行）</summary>

```text
  exec: { agent?: { session: { header: { cwd?: string } } }; signal: AbortSignal },
): Promise<GeneratedValue> {
  const value: GeneratedValue = {
    provider, model, output,
    svg: new TextDecoder().decode(generated.data),
    svgBytes: generated.data.byteLength,
    ...(typeof generated.seed === 'number' ? { seed: generated.seed } : {}),
  }
  if (config.saveToWorkspace === false) return value
  const workspaceRoot = exec.agent?.session.header.cwd
  if (workspaceRoot === undefined) return value
  try {
    // The file name is content-addressed exactly like a raster attachment, so
    // the same drawing always lands on the same .svg path.
    value.savedTo = await saveImageToWorkspace({
      workspaceRoot, folder: config.workspaceFolder,
      attachmentId: `sha256:${createHash('sha256').update(generated.data).digest('hex')}`,
      mediaType: 'image/svg+xml', data: generated.data, signal: exec.signal,
    })
  } catch (error) {
    exec.signal.throwIfAborted()
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 5 · 源码核查**：[src/client/image-result-view.tsx:564-604](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/image-result-view.tsx#L564-L604)

浏览器的矢量预览和下载。

<details>
<summary>查看原文（41行）</summary>

```text
  const markup = result.svg ?? ''
  const [previewOpen, setPreviewOpen] = useState(false)
  const [toast, setToast] = useState<string>()
  const savedTo = result.savedTo
  // A percent-encoded data URL avoids base64 limits for large documents and
  // keeps the markup readable in devtools. <img> never runs scripts.
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  const copyMarkup = () => {
    const flash = (message: string) => {
      setToast(message)
      setTimeout(() => { setToast(undefined) }, 2000)
    }
    // navigator.clipboard is missing outside a secure context.
    if (typeof navigator.clipboard?.writeText !== 'function') { flash(t('copyFailed')); return }
    void navigator.clipboard.writeText(markup).then(() => { flash(t('svgCopy')) }).catch(() => { flash(t('copyFailed')) })
  }
  const download = () => {
    const name = savedTo?.split(/[\\/]/).pop() ?? 'image.svg'
    const blobUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = name.endsWith('.svg') ? name : `${name}.svg`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => { URL.revokeObjectURL(blobUrl) }, 10_000)
  }
  return <section className="dsh-ig-result" aria-label={t('generatedTitle')}>
    <div className="dsh-ig-result-title">
      {t('generatedTitle')}
      <span className="dsh-ig-tag dsh-ig-svg-badge" title={t('svgPreviewHint')}>{t('svgBadge')}</span>
    </div>
    {savedTo !== undefined
      ? <div className="dsh-ig-savedto">{t('savedToPath')}: {openFile === undefined ? savedTo : <button type="button" className="dsh-ig-savedto-open" title={savedTo} onClick={() => { openFile(savedTo) }}>{savedTo}</button>}</div>
      : null}
    <div className="dsh-ig-container">
      <img
        className="dsh-ig-image"
        src={url}
        alt={result.prompt || 'Generated SVG'}
        onClick={() => { setPreviewOpen(true) }}
```

</details>

**依据 6 · 源码核查**：[src/studio.ts:104-124](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/studio.ts#L104-L124)

缺少比例映射时按横竖方向回退。

<details>
<summary>查看原文（21行）</summary>

```text
export function openAIRequestSize(config: Config, ratio: string, quality: string): string {
  const group = openAICompatTable(config).find(entry => entry.ratio === ratio)
  if (group === undefined) {
    // The built-in table only lists 1:1/3:2/2:3, while the tool schema and the
    // ratio picker advertise the full ten. An unmapped ratio used to collapse to
    // 1024x1024 — a 3:4 portrait request silently became a square. Orient the
    // square instead: the generator honours one dimension per axis, so a
    // portrait keeps the taller side and a landscape the wider one.
    const [width, height] = ratio.split(':').map(Number)
    if (width !== undefined && height !== undefined && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return height > width ? '1024x1536' : width > height ? '1536x1024' : '1024x1024'
    }
    return '1024x1024'
  }
  const requested = tierRank(quality)
  const wanted = Number.isNaN(requested) ? group.tiers[0]!.rank : requested
  const withinBudget = group.tiers.filter(entry => entry.rank <= wanted)
  if (withinBudget.length === 0) {
    throw new Error(`该比例不支持 ${quality} 清晰度，请降低清晰度或更换比例`)
  }
  return withinBudget.reduce((best, entry) => (entry.rank > best.rank ? entry : best)).size
```

</details>

**依据 7 · 源码核查**：[src/studio.ts:148-162](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/studio.ts#L148-L162)

对话尺寸优先级。

<details>
<summary>查看原文（15行）</summary>

```text
export function chatToolSize(input: {
  provider: string
  config: Config
  fallbackSize: string
  args: { size?: string; aspect_ratio?: string }
  gifRequested: boolean
  svgRequested: boolean
}): string | undefined {
  const sizeDiscarded = input.svgRequested || (input.gifRequested && input.args.size === undefined)
  if (sizeDiscarded) return undefined
  if (input.args.size !== undefined) return input.args.size
  const ratioSize = input.provider === 'openai-compat' && input.args.aspect_ratio !== undefined
    ? openAIRequestSize(input.config, input.args.aspect_ratio, '')
    : undefined
  return ratioSize ?? input.fallbackSize
```

</details>

**依据 8 · 源码核查**：[src/openai-compatible.ts:23-28](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/openai-compatible.ts#L23-L28)

位图专用调用拒绝 SVG。

```text
 * The workbench stores results through the raster attachment API only, so a
 * studio call never asks for SVG; guard the widened result type anyway.
 */
export function rasterOnly<T extends { data: Uint8Array; mediaType: GeneratedMediaType }>(image: T): { data: Uint8Array; mediaType: ImageMediaType } {
  if (image.mediaType === 'image/svg+xml') throw new Error('SVG 输出仅在对话工具中支持；工作台请使用位图格式')
  return { data: image.data, mediaType: image.mediaType }
```

#### 缺口

- 所选中转支持的 SVG 与精确尺寸未验证
  **影响**：入口存在仍可能回位图或近似尺寸
  **进一步探讨**：在支持与忽略该参数的渠道比较实际 MIME、矢量源、像素及提示

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工作台动态发现的模型列表怎样影响模型选择，能否把在列表里视为可调用？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

工作台按已存凭据建立云渠道行，先回已有候选与 pending 状态。中转探测以基础 URL 与密钥引用为缓存键，同键合并进行中查询。无密钥时不存远端结果，有密钥才访问探测端点。失败会续五分钟缓存并保留上次成功目录，有效空表可以清空。客户端在有限窗口静默轮询，原输入大体保留，但渠道消失或所选模型不在新候选中时可回退。生成端同样扩展模型列表再验证请求，还要取得凭据、读取参考文件、执行上游调用。相比固定列表，省去部分手抄模型 ID 的操作；可列出与可生成是两道验证，缓存还可能保留已失效模型。选择价格或品质差异明显的比较对象时，应核对最终发出的模型和真实成果。ComfyUI 被工作台生成入口显式拒绝。

#### 证据与依据

**依据 1 · 源码核查**：[src/studio.ts:220-248](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/studio.ts#L220-L248)

仅配置好的云端行安排后台探测。

<details>
<summary>查看原文（29行）</summary>

```text
    ...compatChannels.map(async channel => {
      return [`openai-compat:${channel.id}`, await resolveApiKey(ctx, 'openai-compat', channel.keyRef) !== undefined] as const
    }),
  ])
  const configured = Object.fromEntries(configuredEntries) as Record<string, boolean>
  const cloudRows = CLOUD_IMAGE_PROVIDERS.flatMap(provider => provider === 'openai-compat'
    ? compatChannels.map(channel => studioProfile(effectiveConfig, provider, configured[`openai-compat:${channel.id}`] === true, channel.id))
    : [studioProfile(effectiveConfig, provider, configured[provider] === true)])
  // Return cached models right away and tell the workbench when a probe is pending.
  let modelDiscoveryPending = false
  const cloudProfiles = cloudRows.map(row => {
    if (!row.configured) return row
    const widened = widenProfileModels(row, effectiveConfig)
    if (widened.refresh) {
      modelDiscoveryPending = true
      refreshProfileModels(ctx, effectiveConfig, widened.profile)
    }
    return widened.profile
  })
  // Subscription profiles: configured means "signed in", and the parameter
  // matrix collapses to a single channel-default pair (prompt-only channels).
  const subStatuses = await Promise.all(SUBSCRIPTION_PROVIDERS.map(async provider => {
    return [provider, subscriptions !== undefined && (await subscriptions.loginStatus(vendorOf(provider))).state === 'logged-in'] as const
  }))
  const subProfiles = SUBSCRIPTION_PROVIDERS.map(provider => {
    const signedIn = subStatuses.find(entry => entry[0] === provider)?.[1] === true
    return subscriptionStudioProfile(provider, signedIn)
  })
  const profiles = [...cloudProfiles, ...subProfiles]
```

</details>

**依据 2 · 源码核查**：[src/channel-model-discovery.ts:118-146](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/channel-model-discovery.ts#L118-L146)

缓存键、合并请求、凭据和探测超时。

<details>
<summary>查看原文（29行）</summary>

```text
  const baseURL = channel.baseURL.trim()
  if (baseURL.length === 0) return Promise.resolve([])
  const key = cacheKeyFor(baseURL, channel.keyRef)
  const cached = cache.get(key)
  if (cached !== undefined && cached.expiresAt > now) return Promise.resolve(cached.models)
  const running = inflight.get(key)
  if (running !== undefined) return running
  const probe = (async (): Promise<readonly string[]> => {
    // "No key stored" is a local fact, not an endpoint answer: deciding it
    // without caching means a freshly entered key starts discovery on the next
    // render instead of leaving the picker empty for a whole TTL.
    const apiKey = await resolveApiKey(ctx, 'openai-compat', channel.keyRef).catch(() => undefined)
    if (apiKey === undefined) return []
    let pulled: string[] | undefined
    try {
      const result = await fetchOpenAIImageModels(
        'openai-compat',
        withOpenAICompatChannel(config, channel.id),
        apiKey,
        AbortSignal.timeout(CHANNEL_MODEL_DISCOVERY_TIMEOUT_MS),
      )
      pulled = result.ok ? result.models : undefined
    } catch {
      pulled = undefined
    }
    remember(key, pulled, now)
    return agedModels(key) ?? []
  })().finally(() => { inflight.delete(key) })
  inflight.set(key, probe)
```

</details>

**依据 3 · 源码核查**：[src/channel-model-discovery.ts:320-339](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/channel-model-discovery.ts#L320-L339)

失败保留结果，有效空表可替换。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Record a probe outcome.
 *
 * `undefined` means the endpoint never answered usefully, so the last good
 * catalog stays and the entry is pushed one TTL out. That keeps a selected
 * discovered model from vanishing during a transient outage, and retries a
 * broken endpoint in five minutes rather than on every render. An empty
 * array is a real answer and does replace the catalog.
 */
function remember(key: string, models: readonly string[] | undefined, now: number): void {
  cache.set(key, {
    expiresAt: now + CHANNEL_MODEL_DISCOVERY_TTL_MS,
    models: models ?? cache.get(key)?.models ?? [],
  })
}

/** True while the entry is inside its TTL, so no refresh is owed. */
function isFresh(key: string, now: number): boolean {
  const entry = cache.get(key)
  return entry !== undefined && entry.expiresAt > now
```

</details>

**依据 4 · 源码核查**：[src/client/studio-view.tsx:393-408](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/studio-view.tsx#L393-L408)

刷新保留输入但允许模型回退。

<details>
<summary>查看原文（16行）</summary>

```text
      setConfig(payload)
      if (silent) {
        // Silent refresh: keep the user's in-flight form state (prompt,
        // parameters, selections). Only reconcile the selected provider's
        // model when it changed on the host, and drop comparisons that are
        // no longer signed in / configured.
        const { provider: currentProvider, channel: currentChannel, model: currentModel } = formStateRef.current
        const activeProfile = payload.providers.find(item => item.provider === currentProvider && item.channel === currentChannel)
        if (activeProfile === undefined) {
          const fallback = payload.providers.find(item => item.provider === payload.activeProvider && item.channel === payload.activeChannel) ?? payload.providers[0]
          if (fallback !== undefined) applyProvider(fallback)
        } else if (!studioModelOptionsForMode(activeProfile, 'generate').some(option => option.value === currentModel)) {
          setModel(activeProfile.model)
        }
        setComparisonProviderKeys(current => current.filter(selectedKey =>
          payload.providers.some(item => studioTargetKey(item.provider, item.channel) === selectedKey && item.configured)))
```

</details>

**依据 5 · 源码核查**：[src/client/studio-view.tsx:432-448](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/studio-view.tsx#L432-L448)

轮询受时窗与 pending 约束。

<details>
<summary>查看原文（17行）</summary>

```text
  const modelDiscoveryPending = config?.modelDiscoveryPending === true
  useEffect(() => {
    if (!modelDiscoveryPending) return
    const controller = new AbortController()
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(MODEL_DISCOVERY_WINDOW_MS)])
    let timer: number
    const refresh = async () => {
      if (signal.aborted) return
      const latest = await loadConfig({ silent: true, signal })
      if (!signal.aborted && (latest === undefined || latest.modelDiscoveryPending === true)) {
        timer = window.setTimeout(() => { void refresh() }, MODEL_DISCOVERY_POLL_MS)
      }
    }
    timer = window.setTimeout(() => { void refresh() }, MODEL_DISCOVERY_POLL_MS)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
```

</details>

**依据 6 · 源码核查**：[src/studio.ts:319-338](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/studio.ts#L319-L338)

生成再次验证，且需要真实凭据和参考数据。

<details>
<summary>查看原文（20行）</summary>

```text
  const channel = input.provider === 'openai-compat' ? resolveOpenAICompatChannel(config, input.channel) : undefined
  const requestConfig = input.provider === 'openai-compat' ? withOpenAICompatChannel(config, input.channel) : config
  const profile = widenProfileModels(studioProfile(requestConfig, input.provider, true, channel?.id), requestConfig).profile
  const model = withGenerationModel(profile, input).model
  const channelGif = channelSelectsGif(config, input)
  assertAllowed(profile, { ...input, model }, input.output?.format === 'gif' || channelGif)
  const active = resolveProvider(withProviderOverrides(requestConfig, input.provider, model))
  if (active.provider === 'comfyui') throw new Error('ComfyUI 暂未接入工作台')
  if (isSubscriptionProvider(active.provider)) throw new Error('订阅生图应通过订阅渠道执行')
  // ComfyUI is rejected above; subscription channels were routed earlier; narrow for the closures below.
  const wired = active
  const credential = await requireApiKey(ctx, input.provider, undefined, channel?.keyRef)

  const rawRefs = input.references ?? (input.reference ? [input.reference] : [])
  if (input.mode === 'edit' && rawRefs.length === 0) {
    throw new Error('图生图需要至少一张参考图')
  }
  const sourceImages = input.mode === 'edit'
    ? await Promise.all(rawRefs.map(ref => readStudioReference(ctx, ref, signal)))
    : []
```

</details>

#### 缺口

- 模型目录与真实生成权限的覆盖关系未测
  **影响**：不能承诺列表中付费模型可用
  **进一步探讨**：核对目录响应、实际 generation 请求及账户授权，在变更授权后复查缓存窗口

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 在 GIF 图卡按帧写修改意见后，正在生成、收到结果和版本落地分别由谁处理？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

按帧编辑要求 OpenAI 形状渠道、可解码动画和有效帧数。浏览器将帧拼成受字节预算约束的参考图并结合批注，向工作台提交编辑。请求使用共享忙位和 AbortController。收到带附件的有效回包后进入完成态，形成修订，同时持久化图库及有等待上限的预取，最后写入发起时的原图版本链。晚回包不会替换已经切换到另一张图的卡片。客户端收到回包后继续提交修订，以保留已经拿到的结果；若渠道给静帧也留作一版并提示。图库保存状态单独返回，失败时需核对新版本和图库，不能将动画预览当成跨会话持久化证据。解码或渠道不支持可把批注整理成文本，再决定是否回原工具。界面等待进度不能用来反推上游完成或计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/gif-comments.tsx:27-43](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/gif-comments.tsx#L27-L43)

限制供应商、帧数、解码状态。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Whether the animation can be edited, and why not: only OpenAI-shaped
 * providers take the edit request, the frames must be decoded (the sheet is
 * built from them) and their number must be one the GIF contract can ask for.
 * Once decoded, the frames themselves are counted, whatever the header says:
 * they are what the sheet and the request use.
 */
export function gifEditAvailability(input: { provider: string; animated: boolean; snapshot: Pick<GifPlayerSnapshot, 'status' | 'frames' | 'info'> | undefined }): GifEditAvailability | undefined {
  const { snapshot } = input
  if (input.provider !== 'openai' && input.provider !== 'openai-compat') return undefined
  if (!input.animated || snapshot === undefined) return undefined
  const frames = snapshot.status === 'ready' ? snapshot.frames.length : snapshot.info?.frames
  if (frames !== undefined && frames < GIF_FRAME_COUNT_MIN) return undefined
  if (frames !== undefined && frames > GIF_FRAME_COUNT_MAX) return 'frame-count'
  if (snapshot.status === 'fallback') return 'unsupported'
  if (snapshot.status === 'native') return 'unloaded'
  return snapshot.status === 'ready' ? 'ready' : 'decoding'
```

</details>

**依据 2 · 源码核查**：[src/client/gif-edit.tsx:266-310](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/gif-edit.tsx#L266-L310)

受限拼图、提交、回包、保存以及静帧提示。

<details>
<summary>查看原文（45行）</summary>

```text
  const send = (sheet: DrawnSheet) => {
    if (image === undefined || player === undefined || busy.running || comments.length === 0) return
    const controller = new AbortController()
    busy.controller.current = controller
    busy.setRunning(true)
    setError(undefined)
    setNotice(undefined)
    const run = status.start()
    // Either cancel, the overlay's or the card's, clears the overlay at once rather than when the step in flight notices.
    controller.signal.addEventListener('abort', run.stop, { once: true })
    void (async () => {
      try {
        const limit = await readCanvasImageLimit(controller.signal).catch(() => 4_000_000)
        controller.signal.throwIfAborted()
        const encoded = await encodeSheetWithinLimit(sheet.canvas, sheet.plan, limit).catch(() => { throw new Error(t('gifSheetTooLarge')) })
        const data = (await blobToDataUrl(encoded.blob)).replace(/^[^,]*,/, '')
        const model = await fetchGifEditModel(image, controller.signal)
        const request = gifEditRequest({ image, model, comments, sheet: { mediaType: encoded.mediaType, data, plan: encoded.plan }, frame: sheet.frame, speed: player.getSnapshot().speed })
        run.redraw()
        const response = await fetch(STUDIO_ROUTE, {
          method: 'POST',
          credentials: 'same-origin',
          signal: controller.signal,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(request),
        })
        const payload = await response.json().catch(() => null) as StudioGenerateResponse | { error?: string } | null
        if (!response.ok || payload === null || !('attachment' in payload)) {
          const reported = payload !== null && 'error' in payload && payload.error ? payload.error : undefined
          throw reported === undefined ? new Error(t('gifEditFailed')) : new StudioReplyError(reported)
        }
        run.finish()
        // The reply is paid for: from here a cancel no longer drops it, and the full bar shows before the new version is filed.
        await new Promise(resolve => { setTimeout(resolve, GIF_EDIT_FINISH_MS) })
        const revision = revisionFromReply(payload, request, image.prompt)
        const savedOk = await addRevision(revision)
        if (controller.signal.aborted) return
        // The channel answered with a still: kept as a version so the result is not lost.
        const still = revision.original?.mediaType !== 'image/gif' && revision.attachment.mediaType !== 'image/gif'
        if (!isPreviewOpen()) {
          onSent(still ? t('gifEditStill') : savedOk ? t('gifEditDone') : t('gifEditSaveFailed'))
          return
        }
        const message = still ? t('gifEditStill') : savedOk ? t('gifEditDoneHere', { seconds: String(status.getSnapshot().seconds) }) : t('gifEditSaveFailed')
        run.succeed({ message, still })
```

</details>

**依据 3 · 源码核查**：[src/client/image-result-view.tsx:205-226](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/image-result-view.tsx#L205-L226)

预取与持久化分离，原图身份保护替换操作。

<details>
<summary>查看原文（22行）</summary>

```text
  const edit = useGifEdit({
    gif,
    image: originId ? activeResult : undefined,
    versionKey: activeAttachment === undefined ? undefined : imageVersionKey(String(activeAttachment.attachmentId), activeOriginal),
    busy: { running: isRegenerating, setRunning: setIsRegenerating, controller: regenerateControllerRef },
    addRevision: async revision => {
      // The new version's picture is fetched (and cached) alongside, so a preview still open switches straight to it rather than showing the old one while it loads.
      const [savedOk] = await Promise.all([
        persistGalleryRecord(revisionGalleryRecord(revision)),
        waitAtMost(fetchAttachmentBlob(revision.attachment).catch(() => undefined), GIF_EDIT_PREFETCH_WAIT_MS),
      ])
      const chain = appendConversationImageRevision(String(originId), revision)
      // Filed under the image it was made from; a card handed another image meanwhile keeps that image's versions.
      if (originRef.current === originId) setRevisionChain(chain)
      return savedOk
    },
    isPreviewOpen: () => originRef.current === originId && previewOpenRef.current,
    onSent: message => {
      // Said of the image the edit was made on; a card handed another image meanwhile has nothing to report.
      if (originRef.current !== originId) return
      setPreviewOpen(false)
      setToast(message)
```

</details>

**依据 4 · 源码核查**：[src/client/gif-edit.tsx:354-363](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/client/gif-edit.tsx#L354-L363)

请求取消与批注文本退路。

<details>
<summary>查看原文（10行）</summary>

```text
    send,
    // Frees the card at once, as its own cancel does, rather than when the step in flight notices: the notes can be sent again straight away.
    cancelSend: () => {
      busy.controller.current?.abort()
      busy.controller.current = undefined
      busy.setRunning(false)
    },
    fallback: total => {
      if (image === undefined) return
      onFallback(composeFallbackPrompt(image.prompt, comments, total), t('gifEditFallbackHint'))
```

</details>

#### 缺口

- 真实浏览器对完成态、图库保持和预取失败的表现未验证
  **影响**：不能承诺任何动画都可编辑或跨会话保留
  **进一步探讨**：用短 GIF 在请求中及回包后切换原图和关闭预览，并核对图卡、图库和版本链

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 什么安装、网络和成本条件下值得用一组无敏感配图试用，何时应退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已在 DSH 写稿、有可信渠道和可控 Web profile 的创作者可先试两三条无敏感提示。先核对宿主、Node 和构建产物，再控制投入上限，验收图卡、文件、比例和实际格式。源码声明 Node ^22.19.0 或 ≥24。README 建议日常使用预构建 npm 包，Git URL 安装可能要批准该提交的 prepare 脚本。严格结果下载和强制宿主入站校验均默认为 false。有连接服务时使用宿主拒绝函数，缺服务且强制校验时回 503，检测异常也回 503；缺服务且未强制时会交给原路由。兼容路径默认跟随重定向。选择严格后走公网 HTTPS 443，验证并固定 DNS 答案，限制重定向、时间及流字节。此保障针对走该分支的结果 URL，仍需核对共享 Web 的宿主及代理部署。无法确认连接边界、遇到失配格式、附件缺失或上游超时时，先回收现有结果并对账，再改用可信的直接生成工具。首次是配置和验证，持续是按张资源消耗及验图，恢复是核对账单及补做。各自发生多少费用或人工时间当前未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:57-67](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/package.json#L57-L67)

prepare 会构建，Node 版本有明确条件。

<details>
<summary>查看原文（11行）</summary>

```text
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
  },
```

</details>

**依据 2 · 作者声明**：[README.md:446-451](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/README.md#L446-L451)

作者区分 Git URL 构建审批与预构建 npm 包。

```text
<details>
<summary><strong>从 GitHub 安装时，pnpm 拦截构建脚本怎么办？</strong></summary>

如果报 `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`，打开 DSH 提示的 profile 下的 `pnpm-workspace.yaml`，把 pnpm 输出的完整键加入 `allowBuilds` 并设为 `true`，然后重跑 GitHub 安装命令。如果换了 Git 提交后再次遇到该错误，用新输出的键。日常安装可直接使用预构建的 npm 包。

</details>
```

**依据 3 · 源码核查**：[src/config.ts:223-227](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/config.ts#L223-L227)

两个安全选项默认关闭。

```text
export const Config = z.object({
  provider: volatile(z.union(IMAGE_PROVIDERS).default('google')),
  cloudTimeoutMs: volatile(z.number().min(5_000).max(3_600_000).default(DEFAULT_CLOUD_TIMEOUT_MS)),
  strictImageDownloads: volatile(z.boolean().default(false)),
  requireHostAdmission: volatile(z.boolean().default(false)),
```

**依据 4 · 源码核查**：[src/web-route.ts:6-23](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/web-route.ts#L6-L23)

缺连接校验和异常分支。

<details>
<summary>查看原文（18行）</summary>

```text
/** Preserve hosts without connection admission unless the operator opts in. */
export function resolveWebAdmission(check: WebAdmission | undefined, required: boolean): WebAdmission | undefined {
  return check ?? (required ? () => 503 : undefined)
}

export function withWebAdmission(route: WebRoute, admission: () => WebAdmission | undefined): WebRoute {
  return {
    ...route,
    handler: (req, res) => {
      let rejection: number | undefined
      try {
        const check = admission()
        rejection = check?.(req)
      } catch { rejection = 503 }
      if (rejection === undefined) return route.handler(req, res)
      res.writeHead(rejection, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: rejection === 401 ? 'unauthorized' : 'forbidden' }))
    },
```

</details>

**依据 5 · 源码核查**：[src/openai-compatible.ts:410-439](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/openai-compatible.ts#L410-L439)

兼容与严格下载路径独立。

<details>
<summary>查看原文（30行）</summary>

```text
async function requestImageCandidate(
  candidate: string,
  provider: string,
  input: ImageResponseOptions,
): Promise<Response> {
  const sameOrigin = new URL(candidate).origin === new URL(input.baseURL).origin
  if (input.strictImageDownloads === true) {
    const options = { maxBytes: input.maxBytes, signal: input.signal, acceptSvg: input.acceptSvg === true }
    let result
    try {
      result = await downloadPublicImage(candidate, {
        ...options,
        ...(sameOrigin && input.apiKey !== undefined ? { authorization: 'Bearer ' + input.apiKey } : {}),
      })
    } catch (error) {
      if (!sameOrigin || input.apiKey === undefined) throw error
      result = await downloadPublicImage(candidate, options)
    }
    return new Response(result.data as BodyInit, { headers: result.contentType === undefined ? {} : { 'content-type': result.contentType } })
  }
  let response = await guardedFetch(provider + ' image download', input.signal, () => fetch(candidate, {
    redirect: 'follow', signal: input.signal,
    ...(input.apiKey === undefined || !sameOrigin ? {} : { headers: { authorization: 'Bearer ' + input.apiKey } }),
  }), input.apiKey)
  // Some same-origin relays reject Authorization on public image URLs, so the
  // legacy retry remains available without ever sending the key to another origin.
  if (!response.ok && input.apiKey !== undefined && sameOrigin) {
    await response.body?.cancel().catch(() => undefined)
    response = await guardedFetch(provider + ' image download', input.signal, () => fetch(candidate, { redirect: 'follow', signal: input.signal }), input.apiKey)
  }
```

</details>

**依据 6 · 源码核查**：[src/public-image-download.ts:36-76](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/public-image-download.ts#L36-L76)

公网 HTTPS、固定 DNS 和连接条件。

<details>
<summary>查看原文（41行）</summary>

```text
export async function downloadPublicImage(value: string, options: DownloadOptions, deps: DownloadDeps = {}): Promise<{ data: Uint8Array; contentType: string | undefined }> {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw new Error('Image download requires a public HTTPS URL on port 443')
  }
  const max = options.maxBytes
  if (!Number.isSafeInteger(max) || max <= 0) throw new Error('Invalid image byte limit')
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  const timeout = AbortSignal.timeout(30_000)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout
  signal.throwIfAborted()
  const resolve: NonNullable<DownloadDeps['lookup']> = deps.lookup ?? ((host, options) => dnsLookup(host, options))
  const request = deps.request ?? httpsRequest
  let abortDns: (() => void) | undefined
  let answers: LookupAddress[]
  try {
    answers = isIP(hostname) ? [{ address: hostname, family: isIP(hostname) }] : await Promise.race([
      resolve(hostname, { all: true, verbatim: true }),
      new Promise<never>((_, reject) => {
        abortDns = () => reject(signal.reason)
        signal.addEventListener('abort', abortDns, { once: true })
      }),
    ])
  } finally { if (abortDns) signal.removeEventListener('abort', abortDns) }
  signal.throwIfAborted()
  if (!answers.length || answers.some(a => !isPublicAddress(a.address) || isIP(a.address) !== a.family)) {
    throw new Error('Image download target is not a public address')
  }
  const pinnedLookup = ((_host, opts, callback) => {
    if (opts?.all) callback(null, answers)
    else {
      const a = answers.find(a => !opts?.family || a.family === opts.family) ?? answers[0]!
      callback(null, a.address, a.family)
    }
  }) as LookupFunction
  const rasterTypes = 'image/png,image/jpeg,image/webp,image/gif'
  const accept = options.acceptSvg === true ? `image/svg+xml,${rasterTypes}` : rasterTypes
  return await new Promise((resolveResult, reject) => {
    const req = request(url, {
      signal, lookup: pinnedLookup, agent: false,
      headers: { accept, ...(options.authorization ? { authorization: options.authorization } : {}) },
```

</details>

**依据 7 · 源码核查**：[src/public-image-download.ts:77-95](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/public-image-download.ts#L77-L95)

拒绝非成功状态，遵守字节上限。

<details>
<summary>查看原文（19行）</summary>

```text
    }, res => {
      void (async () => {
        const status = res.statusCode ?? 0
        if (status < 200 || status >= 300) { res.destroy(); throw new Error(`Image download HTTP ${status}`) }
        const length = res.headers['content-length']
        if (length !== undefined && (!/^\d+$/.test(length) || Number(length) > max)) {
          res.destroy(); throw new Error('Image response exceeds the byte limit')
        }
        const chunks: Buffer[] = []
        let bytes = 0
        try {
          for await (const chunk of res) {
            const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
            bytes += data.length
            if (bytes > max) throw new Error('Image response exceeds the byte limit')
            chunks.push(data)
          }
          resolveResult({ data: new Uint8Array(Buffer.concat(chunks, bytes)), contentType: res.headers['content-type'] })
        } catch (error) { res.destroy(); throw error }
```

</details>

#### 缺口

- 宿主实际拒绝策略和开关覆盖范围未实测
  **影响**：公网接入与私密素材试用没有足够依据
  **进一步探讨**：先核对实际 profile、前置代理和所选渠道的拒绝行为
- 每张合格素材的现金和人工成本未知
  **影响**：无法用一次成功回包比较总成本
  **进一步探讨**：分别记录请求计费、审图、文件恢复与返工时间

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 逐项持久收据在部分失败后的补做中能否减少重复请求？

**研究主题**：新假设与验证

#### 完整回答

提出待验证假设。为每项保存稳定 ID 并区分上游已接受、附件已落地和工作区文件完成，再按项补做，可能比仅返回结果和错误数组减少取消后的误重发。现有循环能识别未启动项，但无法在回包丢失时向调用者证明附件或上游已经动作。上游必须能关联回执，或显式标出未知，本地标识并不能替代上游幂等。可在同批配图的调用排队、附件落地和改名时分别注入故障，比较两版的上游调用数、额外付费、附件与文件保全、补做耗时及误报完成率。回执无法关联或这些指标恶化时，假设在该渠道不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:688-718](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L688-L718)

现有数组只返回该调用中的成功、失败或未启动项。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1021-1045](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/index.ts#L1021-L1045)

附件与工作区文件独立落地。

<details>
<summary>查看原文（25行）</summary>

```text
  const raster = { ...generated, mediaType: generated.mediaType as ImageAttachmentRef['mediaType'] }
  if (!ctx.attachments.imageLimits.mediaTypes.includes(raster.mediaType)) throw new Error(`This DSH deployment does not accept ${raster.mediaType} generated images`)
  const attachment = await ctx.attachments.saveImage({ data: raster.data, mediaType: raster.mediaType, name: 'generated-image' })
  const animation = animationOf(raster)
  // Kept before the workspace step so a result without a file (or a disabled
  // workspace) still carries the animation the card plays.
  const original = await keepGifOriginal(vaultConfigOf(config), raster, attachment, message => { ctx.logger.warn(message) })
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
    value.savedTo = await saveImageToWorkspace({ workspaceRoot, folder: config.workspaceFolder, attachmentId: attachment.attachmentId, mediaType: raster.mediaType, data: raster.data, signal: exec.signal })
  } catch (error) {
    exec.signal.throwIfAborted()
    ctx.logger.warn(`dsh-image-gen: failed to save image to workspace: ${error instanceof Error ? error.message : String(error)}`)
    value.saveError = error instanceof Error ? error.message : String(error)
  }
  return value
```

</details>

**依据 3 · 源码核查**：[src/workspace-save.ts:134-151](https://github.com/shanliuling/dsh-image-gen/blob/7e3b2fbd10cb8bf79055373ac5161e045fb4e2d7/src/workspace-save.ts#L134-L151)

改名与取消交错是可控制的故障点。

<details>
<summary>查看原文（18行）</summary>

```text
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

- 拟议收据尚未实现或验证
  **影响**：收益取决于供应商回执和实际人工补做
  **进一步探讨**：比较有上游请求 ID 与没有回执的两种模拟环境

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
