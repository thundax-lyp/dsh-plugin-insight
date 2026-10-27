# dsh-image-gen

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[f5f8327](https://github.com/shanliuling/dsh-image-gen/tree/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a)

<!-- BEGIN META -->
[![GitHub ★ 716](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=716&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/dsh-image-gen) [![npm 30d 32,724](https://img.shields.io/static/v1?label=npm+30d&message=32%2C724&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen)
<!-- END META -->

> **功能**：为DSH提供对话生图、编辑、画布、批量生成和图库，并接入云端Provider与本地ComfyUI。

> **亮点**：把对话、画布、Studio与图库中的图像生成和资产复用接到宿主，贡献在流程及Provider适配而非图像模型原创。[Q01](#research-q01)

> **主要限制**：远端生成、附件与工作区保存是不同成功阶段；批量部分失败或saveError不能用整批重跑处理，订阅免Key也不等于无费用或所有模型等价。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 原生图像工作流给什么人带来额外价值？](#detail-section-11)
  - [Q02 · 一个批次成功或图片生成是否代表全部已落盘？](#detail-section-12)
  - [Q03 · 多Provider与订阅免Key是否代表等价且无费用？](#detail-section-13)
  - [Q04 · 参数和落盘设计值得怎样复用，恢复还能怎样验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已用DSH且持续制作与编辑内容配图的创作者使用。

供应商网页生成下载，或单一ComfyUI工作流。整合是否值得取决于反复创作与资产管理频率，不能以Provider数量证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 单图与批量生成 | 内容配图和变体 | 每批1-10条，分项检查失败 |
| 编辑与参考图 | 持续修改已有图 | 各Provider支持不同 |
| 工作区保存 | 落位可用资产 | saveError不等于生成失败 |
| Studio参数管理 | 对比与批量创作 | ComfyUI未在此通道支持 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH、Node及附件服务 | 必需 | 工具/界面和图片存储 | 先核对具体宿主，不凭“稳定版本”概称 |
| 供应商Key或有效订阅登录 | 云端对应能力必需 | 生成或编辑 | 当前服务和额度未知 |
| Host可访问ComfyUI及API工作流 | 本地通道必需 | 私有工作流执行 | 不覆盖Studio多模型比较 |
| 有限预算与非敏感参考图 | 试用前提 | 控制费用和数据发送 | 否则继续原界面 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定插件版本和一种Provider | 验证凭据、实际模型与费用条件 |
| 2 | 用一张非敏感图或prompt试单次生成 | 核对附件、保存位置与图像结果 |
| 3 | 再试含一项失败的小批次 | 单列成功项、失败项和保存失败 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件、账号或本地GPU环境 | 配置Provider/工作流与目录 | 耗时和费用未知 |
| 持续使用 | 生图、订阅/GPU及存储 | 选图、编辑复核、模型参数维护 | 多模型同时比较会增加调用 |
| 失败恢复 | 可能重复生成费用 | 对账附件、文件、远端任务 | 保存失败不应重新生成 |
| 退出 | 保留导出图片 | 备份图库、撤销凭据/登录 | 远端服务数据清理未核查 |

可先以单Provider小预算试用，若能力差异与失败对账难管理，退回供应商界面或单一ComfyUI流程。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 批量隔离 | 顺序收集成功/失败 | 远端请求幂等与账单 |
| 图片保存 | 附件和工作区错误区分 | 并发/取消旧文件影响 |
| 创作效率 | 多入口资产接线 | 合格图片总费用与节时 |

> **思考**：远端生成、附件与工作区保存是不同成功阶段；批量部分失败或saveError不能用整批重跑处理，订阅免Key也不等于无费用或所有模型等价。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把对话、画布、Studio与图库中的图像生成和资产复用接到宿主，贡献在流程及Provider适配而非图像模型原创。[Q01](#research-q01)

Studio在已配置分辨率表中仅向下取不超过请求的档位，不静默升档，避免不支持的请求变成更贵输出。保存目录同时做词法和真实路径检查，临时文件独占创建后rename，分离生成附件与工作区保存，使普通文件故障能被单独呈现。注意这条保存函数没有fsync，不能把原子名字切换写成掉电后持久性已验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

远端生成、附件与工作区保存是不同成功阶段；批量部分失败或saveError不能用整批重跑处理，订阅免Key也不等于无费用或所有模型等价。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有DSH图像任务者可先用单Provider、非敏感图片和小预算试用；核对附件、落盘和分项失败，保存故障不重新生成；不能管理通道差异与账单时退回供应商界面或固定ComfyUI。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

批量分项、保存错误与参数校验有源码支持；供应商效果/订阅可用性、并发落盘及费用未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/workspace-save.ts、src/studio.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查统一工具批量、Studio参数与工作区保存；未审计全部Provider、订阅实现、图库隔离或第三方服务政策。
- 下一步：非敏感图像在生成/附件/落盘故障点检查状态与费用，验证单Provider后再决定多模型比较。

**分析版本**

- **仓库**：[shanliuling/dsh-image-gen](https://github.com/shanliuling/dsh-image-gen)
- **版本号**：0.9.3（[固定提交 f5f8327](https://github.com/shanliuling/dsh-image-gen/tree/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用请求ID、附件ID和完整摘要跟踪分阶段状态，保存失败仅重试落盘，结果未知先对账；以故障点比较重复计费和旧资产影响，尚未验证。[Q04](#research-q04)

非敏感图像在生成/附件/落盘故障点检查状态与费用，验证单Provider后再决定多模型比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 974 | — | — | 9986 |
| .mjs | source | 3 | 271 | 235 | 21 | — |
| .mjs | example | 1 | 199 | 184 | 18 | — |
| .ts | source | 68 | 12165 | 9638 | 1750 | — |
| .tsx | source | 8 | 8865 | 7893 | 511 | — |
| .ts | test | 44 | 9212 | 8114 | 379 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/shanliuling/dsh-image-gen/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH内图像工作流能否减少创作切换，部分生成和保存失败如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生图像工作流给什么人带来额外价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已经使用DSH、反复生成与编辑内容配图的创作者。简单替代是供应商网页生成后下载导入项目；插件把对话、画布、批量创作和图库接到同一会话，目标交付是选中图片、可引用附件及明确保存位置，而不是多模型都返回一个结果就完成。

贡献是创作入口与资产衔接，图像质量和编辑能力仍由所选供应商或ComfyUI工作流承担。README明确ComfyUI未进Studio和多模型对比，因此本地与云端入口不等价。偶发单图或只用固定供应商的人，额外配置与图库维护可能超过便利。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-80](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/README.md#L52-L80)

作者描述会话、画布、Studio与图库的流程。

<details>
<summary>查看原文（29行）</summary>

````text
**为 DeepSeek Harness 带来完整的 AI 图像创作工作流。**

`dsh-image-gen` 不只是简单的对话生图，而是为 DSH 补齐从 **对话生成与连续修图**、**AI 创作画布**、**Studio 批量创作**、**多模型横向对比**，到 **Prompt 灵感库** 与 **本地 ComfyUI** 的完整图像创作能力。

支持主流云端图像模型与本地私有化工作流，既可使用 BYOK（自带 Key），也支持通过订阅账号直接使用，生成结果支持按工作区隔离存储。

> **已有 ChatGPT、Grok 或 Google 订阅？直接登录即可生图，无需额外购买 API Key。**

支持：Gemini · OpenAI / Compatible · Seedream · DashScope · Grok Imagine · GLM-Image · 本地 ComfyUI

```bash
pnpm dsh plugin --profile web add dsh-image-gen@latest
```

> **版本更新提示：** 本次版本变化较大，老用户请更新至最新版本。

<img src="docs/assets/readme/workflow-overview.webp" alt="dsh-image-gen 完整 AI 图像创作工作流" width="100%" />

---

## 一个插件，覆盖完整 AI 图像创作流程

| 入口          | 最适合           | 你可以做什么                             |
| :------------ | :--------------- | :--------------------------------------- |
| 💬 **对话**   | 快速表达想法     | 文生图、图生图、连续编辑、版本迭代       |
| ✏️ **画布**   | 表达视觉创意     | 草稿生成、参考图组合、空间创作、持续修改 |
| 🎛️ **工作台** | 精细控制创作参数 | 批量生成、多图参考、高级参数调整         |
| ✨ **灵感**   | 寻找创作方向     | Prompt 案例、风格探索、一键复用          |
| 🖼️ **图库**   | 管理生成结果     | 搜索、收藏、下载、重新使用               |
````

</details>

**依据 2 · 作者声明**：[README.md:260-267](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/README.md#L260-L267)

ComfyUI入口限制。

```text
### 🧩 本地 ComfyUI 多工作流

灵活调用本地 GPU 算力，让私有化绘图无缝融入 Agent 对话。

- 导入并管理多个命名工作流，支持预设 Prompt 和常用占位符。
- Agent 可按名称选择工作流，在对话中完成文生图和图生图。

> ComfyUI 暂未接入 Studio 和多模型对比。
```

**依据 3 · 作者声明**：[README.md:281-299](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/README.md#L281-L299)

各Provider编辑与Studio支持不同。

<details>
<summary>查看原文（19行）</summary>

```text
## Provider 支持情况

| Provider                          | 对话生图 | 对话编辑 | Studio | 多模型对比 |
| :-------------------------------- | :------: | :------: | :----: | :--------: |
| **Google Gemini**                 |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **OpenAI Images**                 |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **OpenAI Compatible（中转站）**   |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **ByteDance Seedream / 火山方舟** |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Aliyun DashScope / Qwen Image** |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **xAI Grok Imagine**              |    ✅    | ⚠️ 有限  |   ✅   |     ✅     |
| **智谱 GLM-Image**                |    ✅    |    —     |   ✅   |     ✅     |
| **Local ComfyUI**                 |    ✅    | ✅ 单图  |   —    |     —      |
| **ChatGPT 订阅（免 Key）**       |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Grok 订阅（免 Key）**          |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Google 订阅（免 Key）**        |    ✅    | ✅ 多图  |   ✅   |     ✅     |

> Studio 与多模型对比目前只支持云端 Provider（含订阅通道）；多模型对比调用的是各 Provider 在设置中已配置的模型。
> 智谱 GLM-Image 上游本身不支持图生图；xAI 图生图走 OpenAI 兼容协议（multipart），部分网关可能需等待后续适配。
> 订阅通道通过账号登录使用（免 API Key），支持对话文生图 / 图生图、Studio 批量生成与多模型对比；图生图走各订阅渠道的编辑接口（最多 5 张参考图），比例与清晰度可在 Studio 中直接选择。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一个批次成功或图片生成是否代表全部已落盘？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

generate_images限制1至10条prompt并顺序生成，每项独立捕获异常，返回images与failures；取消后未开始项记录失败，不为某张失败终止其他项。saveGenerated在远端图像已得到后先进入宿主附件，再尝试工作区文件；普通保存异常写saveError并保留结果，取消则重新抛出。调用者应区分远端生成、附件存储、工作区保存与人工选图，不能笼统按“成功”重跑整个批次。

workspace保存做词法与realpath范围检查、同目录临时文件再rename，写后检查取消并删除目标。文件名取附件摘要前8位，不能将短文件名看成完整内容身份证明；本次未证明高并发、碰撞或取消覆盖已有文件的行为。路径检查也不等同对所有并发文件系统变更的安全证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:343-345](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/index.ts#L343-L345)

批量语义明确为顺序且分项错误。

```text
  ctx.tools.register(defineTool({
    name: 'generate_images',
    description: 'Generate several images in one call, one per prompt, in order. Use for batches, variations, or illustration sets; prefer generate_image for a single image. Every successful image is attached to the conversation and may be saved under the session workspace. Items generate sequentially; a failed item is reported in the failures list and does not abort the rest. The optional provider/model/size arguments apply to every item.',
```

**依据 2 · 源码核查**：[src/index.ts:383-409](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/index.ts#L383-L409)

实际数量限制、取消与分项捕获。

<details>
<summary>查看原文（27行）</summary>

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

**依据 3 · 源码核查**：[src/index.ts:600-627](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/index.ts#L600-L627)

附件与工作区保存分层，saveError保留。

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

**依据 4 · 源码核查**：[src/workspace-save.ts:26-32](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/workspace-save.ts#L26-L32)

文件名仅摘要前8位。

```text
export function workspaceImageName(
  attachmentId: string,
  mediaType: ImageAttachmentRef['mediaType'],
): string {
  const digest = attachmentId.startsWith('sha256:') ? attachmentId.slice('sha256:'.length) : attachmentId
  const prefix = digest.slice(0, 8).padEnd(8, '0')
  return `image-${prefix}.${EXTENSION[mediaType]}`
```

**依据 5 · 源码核查**：[src/workspace-save.ts:116-144](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/workspace-save.ts#L116-L144)

实际范围检查、临时写和取消后的目标删除。

<details>
<summary>查看原文（29行）</summary>

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
  return target
```

</details>

#### 缺口

- 附件成功但保存失败、取消时已有目标及远端请求结果未知的恢复未运行。
  **影响**：直接整批重试可能重复计费或改变已有资产。
  **进一步探讨**：用测试图像分别模拟保存失败、取消和重复保存，先核对附件/文件/供应商状态再定重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多Provider与订阅免Key是否代表等价且无费用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

不是。免额外API Key只改变接入方式，不代表没有订阅、用量或第三方条件。本文只记录仓库声称的通道，不确认本轮服务可用、授权政策或当前额度。Studio按profile与当前model校验比例、清晰度、编辑及水印能力，不支持会抛错而非所有Provider接受同一参数。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH、Node及附件服务 | 必需 | 工具/界面和图片存储 | 先核对具体宿主，不凭“稳定版本”概称 |
| 供应商Key或有效订阅登录 | 云端对应能力必需 | 生成或编辑 | 当前服务和额度未知 |
| Host可访问ComfyUI及API工作流 | 本地通道必需 | 私有工作流执行 | 不覆盖Studio多模型比较 |
| 有限预算与非敏感参考图 | 试用前提 | 控制费用和数据发送 | 否则继续原界面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定插件版本和一种Provider | 验证凭据、实际模型与费用条件 |
| 2 | 用一张非敏感图或prompt试单次生成 | 核对附件、保存位置与图像结果 |
| 3 | 再试含一项失败的小批次 | 单列成功项、失败项和保存失败 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件、账号或本地GPU环境 | 配置Provider/工作流与目录 | 耗时和费用未知 |
| 持续使用 | 生图、订阅/GPU及存储 | 选图、编辑复核、模型参数维护 | 多模型同时比较会增加调用 |
| 失败恢复 | 可能重复生成费用 | 对账附件、文件、远端任务 | 保存失败不应重新生成 |
| 退出 | 保留导出图片 | 备份图库、撤销凭据/登录 | 远端服务数据清理未核查 |

可先以单Provider小预算试用，若能力差异与失败对账难管理，退回供应商界面或单一ComfyUI流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:116-132](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/README.md#L116-L132)

配置与订阅登录的作者说明。

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

**依据 2 · 作者声明**：[README.md:281-299](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/README.md#L281-L299)

Provider支持差异及本地能力边界。

<details>
<summary>查看原文（19行）</summary>

```text
## Provider 支持情况

| Provider                          | 对话生图 | 对话编辑 | Studio | 多模型对比 |
| :-------------------------------- | :------: | :------: | :----: | :--------: |
| **Google Gemini**                 |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **OpenAI Images**                 |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **OpenAI Compatible（中转站）**   |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **ByteDance Seedream / 火山方舟** |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Aliyun DashScope / Qwen Image** |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **xAI Grok Imagine**              |    ✅    | ⚠️ 有限  |   ✅   |     ✅     |
| **智谱 GLM-Image**                |    ✅    |    —     |   ✅   |     ✅     |
| **Local ComfyUI**                 |    ✅    | ✅ 单图  |   —    |     —      |
| **ChatGPT 订阅（免 Key）**       |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Grok 订阅（免 Key）**          |    ✅    | ✅ 多图  |   ✅   |     ✅     |
| **Google 订阅（免 Key）**        |    ✅    | ✅ 多图  |   ✅   |     ✅     |

> Studio 与多模型对比目前只支持云端 Provider（含订阅通道）；多模型对比调用的是各 Provider 在设置中已配置的模型。
> 智谱 GLM-Image 上游本身不支持图生图；xAI 图生图走 OpenAI 兼容协议（multipart），部分网关可能需等待后续适配。
> 订阅通道通过账号登录使用（免 API Key），支持对话文生图 / 图生图、Studio 批量生成与多模型对比；图生图走各订阅渠道的编辑接口（最多 5 张参考图），比例与清晰度可在 Studio 中直接选择。
```

</details>

**依据 3 · 源码核查**：[src/studio.ts:605-614](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/studio.ts#L605-L614)

实际profile/model/输出参数校验。

<details>
<summary>查看原文（10行）</summary>

```text
  if (input.model !== studioModelForMode(profile, input.mode)) throw new Error('模型配置已变化，请刷新工作台后重试')
  if (!profile.ratioOptions.some(option => option.value === input.ratio)) throw new Error('该 Provider 不支持所选比例')
  const selectedQuality = input.provider === 'openai' ? input.generationQuality ?? input.quality : input.resolution ?? input.quality
  if (!profile.qualityOptions.some(option => option.value === selectedQuality)) throw new Error('该 Provider 不支持所选清晰度')
  if (input.resolution !== undefined && profile.resolutionOptions !== undefined && !profile.resolutionOptions[input.ratio]?.some(option => option.value === input.resolution)) throw new Error('该比例不支持所选分辨率')
  if (input.generationQuality !== undefined && input.provider === 'openai-compat' && !profile.generationQualityOptions?.some(option => option.value === input.generationQuality)) throw new Error('该 Provider 不支持所选生成质量')
  if ((input.resolution !== undefined || input.generationQuality !== undefined) && input.provider !== 'openai' && input.provider !== 'openai-compat') throw new Error('该 Provider 不支持独立的 OpenAI 输出参数')
  if (input.watermark !== undefined && input.watermark !== 'default'
    && studioWatermarkCapability(profile, input.mode).status !== 'supported') throw new Error('该渠道尚未确认当前操作的水印控制，请刷新工作台')
  if (input.mode === 'edit' && !profile.supportsEditing) throw new Error('该 Provider 暂不支持图生图')
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 参数和落盘设计值得怎样复用，恢复还能怎样验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

Studio在已配置分辨率表中仅向下取不超过请求的档位，不静默升档，避免不支持的请求变成更贵输出。保存目录同时做词法和真实路径检查，临时文件独占创建后rename，分离生成附件与工作区保存，使普通文件故障能被单独呈现。注意这条保存函数没有fsync，不能把原子名字切换写成掉电后持久性已验证。

未验证假设是为每prompt/provider/model记录生成请求ID、附件ID、完整摘要及保存状态；文件失败时只重试落盘，远端结果未知时先查询而非新生成。最小对照在远端成功/附件成功/rename前后三处注入失败，比较重复账单、误删旧图和人工定位时间。若无法取得供应商任务ID，就保留未知并由用户确认，不能宣称全链路幂等。

#### 证据与依据

**依据 1 · 源码核查**：[src/studio.ts:86-109](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/studio.ts#L86-L109)

配置表内只向下选择清晰度。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * Resolve the wire `size` for one workbench request against the relay table.
 * Falls down to the largest tier not exceeding the requested one (never up,
 * so an unsupported combination cannot silently spend more); unparseable
 * quality labels (legacy `standard`) map to the ratio's lowest tier, and a
 * ratio with nothing at or below the request is rejected loudly.
 * @param config - plugin configuration carrying `openaiCompatSizes`.
 * @param ratio - selected ratio option (`W:H`).
 * @param quality - selected resolution tier.
 */
export function openAIRequestSize(config: Config, ratio: string, quality: string): string {
  const group = openAICompatTable(config).find(entry => entry.ratio === ratio)
  if (group === undefined) {
    if (ratio === '3:2') return '1536x1024'
    if (ratio === '2:3') return '1024x1536'
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

**依据 2 · 源码核查**：[src/workspace-save.ts:116-144](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/workspace-save.ts#L116-L144)

真实写入路径无fsync，原子rename与取消清理。

<details>
<summary>查看原文（29行）</summary>

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
  return target
```

</details>

**依据 3 · 源码核查**：[src/index.ts:600-627](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/index.ts#L600-L627)

生成后附件/工作区保存层次。

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

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
