# DirectorX视频生产插件

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[d63c425](https://github.com/LaplaceYoung/dsh-directorx/tree/d63c425b4d6c40f3db30ccd433d24ed34947c8af)

<!-- BEGIN META -->
[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LaplaceYoung/dsh-directorx)
<!-- END META -->

> **功能**：将DSH Agent接到分镜/生成提案、外部媒体模型、可重渲染时间线及技术质检与画布交付。

> **亮点**：[Q01](#research-q01)视频垂直工具/知识接线；[Q02](#research-q02)项目/参考/提案与代表生成链；[Q04](#research-q04)可改时间线、本地编辑和技术QC反馈。

> **主要限制**：[Q03](#research-q03)proposal可自批、inBudget常量true/批准非单次能力，cancel仅本地账本；[Q04](#research-q04)QC不验创作发布质量；[Q05](#research-q05)数据/资源/费用和恢复仍待验证。

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
  - [Q01 · DirectorX是新Agent内核还是视频生产插件，谁能得到什么？](#detail-section-11)
  - [Q02 · 一条生成意图怎样从原生工具到真实素材？](#detail-section-12)
  - [Q03 · 用户签字、预算、取消与恢复是否强制可靠？](#detail-section-13)
  - [Q04 · 剪辑、质检和交付怎样真正执行，判据到哪为止？](#detail-section-14)
  - [Q05 · 配置、路径/数据和退出对采用有什么要求？](#detail-section-15)
  - [Q06 · 最值得验证的生产方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DirectorX0.2.0是原生DSH垂直视频生产插件，含模型工具、分镜画布客户端、bundled Skills/知识配方及媒体管线，不是另一个独立Agent runtime。它面向在DSH把brief转脚本/镜头、生成素材、人工审阅并交付视频的创作者；Agent loop/提问审批/会话由宿主提供，生成质量来自外部模型，媒体处理来自FFmpeg。成功是符合brief且素材/剪辑/声音/字幕可核的可用成片和可继续修订的项目，不是命令多/画布有节点。

分散模型API+人工分镜/本地剪辑；DSH Agent loop、模型生成、FFmpeg与图形库为已有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| craft/ready/提案 | 准备参考与签字 | 自批可达/非硬现金预算 |
| provider生成 | 真付费媒体请求 | 模型/账单/远端任务另核 |
| 账本/cancel | 中断线索/停轮询 | 本地状态非远端撤销 |
| timeline/剪辑 | 可重渲染成片 | FFmpeg/磁盘/人验 |
| QC/画布 | 技术阈值/结果回查 | 非创作可发布或打包完整工程 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH tools/Skills/settings/llm/Node>=22.19 | 必需 | 原生Agent上下文 | 无第二套runtime |
| 已审核provider/模型/Key/额度 | 真生成必需 | 图片视频音频 | mock不验质量费用 |
| FFmpeg/ffprobe/本机磁盘 | 剪辑/QC必需 | 渲染与技术信号 | spawnSync取消/预算须核 |
| 素材来源/人工签收 | 采用前提 | 创作/版权/发布 | 技术QC不替代 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 隔离项目/可信素材/输出和provider | 核Key/实际额度/网络 |
| 接线 | mock验工具画布/本地剪辑 | 不当真实生成验收 |
| 小额生成 | craft/ready→提案→人签字→一次调用 | 不用自批/常量预算作硬限额 |
| 成片 | 时间线/QC并人工核故事声画字幕 | 过阈值非可发布 |
| 故障退出 | 查供应商任务/费用、保素材与项目 | cancel仅本地、不盲重提 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/机器/存储金额未知 | provider/模板/FFmpeg与额度 | mock非免费生产证明 |
| 持续 | 视频图音/LLM token/编码磁盘未知 | 镜头/连续性/字幕/来源核验 | 本地改剪不等全费用下降 |
| 故障 | 远端继续/重复费/部分产物未知 | 按任务查账/修素材/恢复项目 | 账本非全事务 |
| 退出 | 远端任务/媒体/Key留存未知 | 确认供应商停止/清归属 | 本地cancel不撤费/不删数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 生产链 | 代表真provider/账本/素材 | 全模型质量/可用率 |
| 人审 | Host ask写提案 | 不可绕过/单次付费授权 |
| 剪辑 | 真FFmpeg/时间线/画布路径 | 可播放/净返工 |
| QC | 技术阈值/检查节点 | 创作/版权/发布可用 |
| 恢复 | taskId和本地cancel线索 | 远端撤销/费用找回 |

> **思考**：[Q03](#research-q03)proposal可自批、inBudget常量true/批准非单次能力，cancel仅本地账本；[Q04](#research-q04)QC不验创作发布质量；[Q05](#research-q05)数据/资源/费用和恢复仍待验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)视频垂直工具/知识接线；[Q02](#research-q02)项目/参考/提案与代表生成链；[Q04](#research-q04)可改时间线、本地编辑和技术QC反馈。

[Q02](#research-q02)参考准备/项目上下文、[Q04](#research-q04)本地可重渲染与技术检查可组合；必须把人审约定/强授权、本地cancel/远端撤费、技术QC/创作签收分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)proposal可自批、inBudget常量true/批准非单次能力，cancel仅本地账本；[Q04](#research-q04)QC不验创作发布质量；[Q05](#research-q05)数据/资源/费用和恢复仍待验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06)观察；可丢弃项目先mock+小额代表provider，人工查账/创作验收，企业无人值守需先补授权恢复实证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持代表视频API→任务/素材及本地渲染/QC真链；无真实生成/成片/费用/恢复验证，观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/config.ts、src/confirm.ts、src/index.ts、src/media-server.ts、src/persona.ts、src/project.ts、src/proposals.ts、src/providers/ffmpeg.ts、src/providers/generic-rest.ts、src/providers/tasks.ts、src/providers/timeline.ts、src/providers/video-analyze.ts、src/providers/video-process.ts、src/providers/video.ts、src/support.ts、src/tasks.ts、src/tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核package/README、原生设置注册与session项目上下文、代表video工具gate/提案ask及可自批、OpenAI视频POST/poll/下载/本地任务cancel、时间线/FFmpeg/技术QC与媒体路径服务/密钥回退；未全审1016文件、全部模型/适配器/画布/Skills知识/剪辑特效/路由与测试。
- 下一步：只读固定树，不运行Host/模型/API/FFmpeg/浏览器/插件测试；无真实成片/费用/权限/取消恢复独立验证，作者规模不当效果证据。

**分析版本**

- **仓库**：[LaplaceYoung/dsh-directorx](https://github.com/LaplaceYoung/dsh-directorx)
- **版本号**：0.2.0（[固定提交 d63c425](https://github.com/LaplaceYoung/dsh-directorx/tree/d63c425b4d6c40f3db30ccd433d24ed34947c8af)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)不可自批单次生成能力/费用任务回执与技术+创作+来源分层签收，故障对照验重复费用和净成本，未实现。

只读固定树，不运行Host/模型/API/FFmpeg/浏览器/插件测试；无真实成片/费用/权限/取消恢复独立验证，作者规模不当效果证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .tsx | source | 22 | 11133 | 10644 | 65 | — |
| .js | source | 79 | 191699 | 171839 | 21552 | — |
| .jsx | source | 1 | 21039 | 21038 | 1 | — |
| .md | source | 639 | 94147 | — | — | 1267138 |
| .mjs | source | 29 | 14827 | 12533 | 1153 | — |
| .ts | source | 203 | 43472 | 38504 | 1954 | — |
| .md | example | 1 | 321 | — | — | 8553 |
| .mjs | test | 42 | 7840 | 7254 | 132 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/LaplaceYoung/dsh-directorx/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/LaplaceYoung/dsh-directorx/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核代表付费生成/本地渲染/质检真实链，区分创作工作流、人审约定与强制授权和恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DirectorX是新Agent内核还是视频生产插件，谁能得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DirectorX0.2.0是原生DSH垂直视频生产插件，含模型工具、分镜画布客户端、bundled Skills/知识配方及媒体管线，不是另一个独立Agent runtime。它面向在DSH把brief转脚本/镜头、生成素材、人工审阅并交付视频的创作者；Agent loop/提问审批/会话由宿主提供，生成质量来自外部模型，媒体处理来自FFmpeg。成功是符合brief且素材/剪辑/声音/字幕可核的可用成片和可继续修订的项目，不是命令多/画布有节点。

基线是分别调视频/图像模型API、人工分镜与本地剪辑，或已有生成器。插件增量是把craft/参考准备/提案签字、任务/素材、时间线和QC放在同一项目里。作者“第一个”/“无限画布”/知识工具数量不作独立创新或采用证据；README例片/截图也不能替代生产效果/成本对照。mock只可验工具链，不验生成质量或真实费用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/README.md#L5-L19)

作者定位/宿主与垂直生产职责。

<details>
<summary>查看原文（15行）</summary>

```text
# DirectorX：第一个以 DeepSeek Harness 为内核的 Video Agent Harness

**The first DeepSeek Harness-native video agent harness for end-to-end AI video production.**

DirectorX 是一个运行在 **DeepSeek Harness (DSH)** 里的开源 `dsh-plugin`：让一个真正的 video agent 从需求理解、导演决策、剧本与分镜，到图像 / 视频 / 音频生成、剪辑、质检和交付，沿着同一条可审计的生产链完成工作。

> **一句话定位**：DeepSeek Harness 负责 agent loop、上下文、提问、审批与编排；DirectorX 负责 AI video production 的工具、知识、配方、媒体管线和无限分镜画布。

这不是另一个提示词合集，也不是把聊天窗口包成视频生成器。它是 **DeepSeek Harness 的第一个 video agent harness**：让视频 agent 有状态、有工具、有知识、有确认闸门，并能把计划落成可编辑、可重渲染的成片。

**中文关键词**：DeepSeek Harness 视频 Agent、AI 视频 Agent、视频生成工作流、AI 导演、分镜画布、智能剪辑、成片质检、FFmpeg 视频管线。

**English keywords**: DeepSeek Harness video agent, AI video agent harness, AI video generation workflow, text-to-video, image-to-video, storyboard canvas, smart video editing, FFmpeg media pipeline.

一句话进入视频工作坊：DSH 负责导演、审批与编排，DirectorX 提供无限分镜板、生成、镜头拆解、粗剪、批处理和交付工具。
```

</details>

**依据 2 · 作者声明**：[README.md:68-76](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/README.md#L68-L76)

作者依赖/mock与规模主张。

```text

- 开源、Apache-2.0、Node.js 22.19+，作为 `dsh-plugin` 安装到 DeepSeek Harness。
- 原生使用 DSH 的 agent loop、Session、`userQuestions`、工具注册和 Settings；不复制第二套 agent runtime。
- 默认 Vision 走 DeepSeek 第一方多模态 `deepseek-chat` / `deepseek-v4-flash-vision-exp`，也支持 OpenAI-compatible VL endpoint。
- 支持 mock 模式：没有 API Key 时也能先验证 brief → 确认 → 画布 → 时间线 → 质检链路。
- 包含 348 篇 OKF 知识库文章、39 套主技能、12 套配方和 100+ `directorx_*` 工具。


## 自适应接入
```

**依据 3 · 源码核查**：[package.json:1-20](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/package.json#L1-L20)

原生Host/client入口与版本。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-directorx",
  "version": "0.2.0",
  "description": "DirectorX：第一个以 DeepSeek Harness 为内核的 Video Agent Harness——面向端到端 AI 视频生产的开源 dsh-plugin，覆盖视频生成、分镜画布、智能剪辑、FFmpeg 质检与交付。The first DeepSeek Harness-native video agent harness for AI video production.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/client.d.ts",
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
```

</details>

**依据 4 · 源码核查**：[package.json:110-121](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/package.json#L110-L121)

Node/Apache许可及UI依赖。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "node": ">=22.19.0"
  },
  "license": "Apache-2.0",
  "dependencies": {
    "@webav/av-cliper": "^1.2.8",
    "@xyflow/react": "^12.11.3",
    "cmdk": "^1.1.1",
    "nanoid": "^6.0.1",
    "three": "^0.185.1",
    "tui-image-editor": "^3.15.3",
    "wavesurfer.js": "^7.12.11"
```

</details>

**依据 5 · 源码核查**：[src/index.ts:32-47](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/index.ts#L32-L47)

原生注入/设置和启用能力URL校验。

<details>
<summary>查看原文（16行）</summary>

```text

export const name = 'directorx'
export const inject = ['tools', 'skills', 'systemPrompt', 'settings', 'llm']

export function apply(ctx: Context): void {
  corpus.setRoot(fileURLToPath(new URL('../knowledge/', import.meta.url)))

  const namespace = SETTINGS_NS as SettingsNamespace
  const scope = ctx.settings.register(namespace, DirectorxSettings, {
    applies: 'live',
    validate(value) {
      for (const capability of [value.vision, value.image, value.video, value.audio]) {
        if (capability.enabled && capability.mode !== 'mock' && capability.baseURL.trim() === '') {
          throw new Error('An enabled DirectorX capability needs a non-empty Base URL (or choose mock mode).')
        }
      }
```

</details>

**依据 6 · 源码核查**：[src/providers/video.ts:31-47](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video.ts#L31-L47)

mock实际FFmpeg合成而非真实模型生成。

<details>
<summary>查看原文（17行）</summary>

```text
export async function mockVideo(ctx: ProviderContext, prompt: string): Promise<VideoResult> {
  const outDir = await ensureOutputDir(ctx.settings.outputDir)
  const path = join(outDir, `${slugify(prompt)}-mock.mp4`)
  const ffmpeg = spawnSync('ffmpeg', [
    '-y', '-f', 'lavfi', '-i', 'color=c=0x0b1020:s=640x360:d=1:r=24',
    '-vf', `drawtext=text='DirectorX mock video':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=(h-text_h)/2`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', path,
  ], { encoding: 'utf8' })
  if (ffmpeg.error !== undefined) {
    throw new Error(`mock video mode requires ffmpeg on PATH (${ffmpeg.error.message}). Choose openai-videos or modelverse-tasks and configure Base URL / API Key.`)
  }
  if (ffmpeg.status !== 0) {
    throw new Error(`mock video ffmpeg failed: ${ffmpeg.stderr?.slice(-500)}`)
  }
  return { model: ctx.capability.model, prompt, status: 'completed', files: [{ path, mimeType: 'video/mp4' }], mode: 'mock' }
}

```

</details>

#### 缺口

- 无本研究独立成片/创作者需求、连续性/版权/修改成本验收。
  **影响**：大工具箱和例片不能证明端到端视频质量或企业采用。
  **进一步探讨**：固定brief与人工/API+剪辑基线，验成片/修订和全部成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一条生成意图怎样从原生工具到真实素材？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口注册设置/模型能力、syncTools、Skills与Web路由，safeDefine在当前Agent session cwd的AsyncLocalStorage项目上下文执行，落输出目录；无session root时可退process.cwd。画布意图是任务输入和工作流提示，不是另一套自治Agent。

以generate_video为代表：generationGate读取proposal→requireCraft→requireReady并检查craft/kind、薄提示/IP专名等；提案授权后补角色卡/参考帧和风格，再带合并exec/超时signal调用runVideo。runVideo按mock/openai-videos/modelverse/其它厂商/generic-rest分派。已核openai-videos实际Bearer POST /videos，取taskId后append submitted，再poll GET /videos/id，成功URL下载本地并append succeeded。

这是实际远端付费/本地文件链，不只接口声明；但只覆盖代表provider，不将某一实现推广到所有厂商。任务标识是在服务返回之后才写本地账本：请求已接受却响应丢失或append失败时，仍可能不知道远端已花费，重试必须先查服务。角色/风格拼接/ready回执只是输入准备，不证明角色连续性或镜头语义正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:78-113](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/index.ts#L78-L113)

sync/路由与原生能力接线。

<details>
<summary>查看原文（36行）</summary>

```text
        ...prev,
        ...patch,
        auth: { ...prev.auth, ...(patch.auth ?? {}) },
      },
    })
  }

  const sync = (settings: DirectorxSettingsType): void => {
    disposeTools?.()
    disposePrompt?.()
    disposeTools = syncTools(ctx, settings, applyCapability, defineTool)
    disposePrompt = registerSystemPrompt(ctx, settings)
  }

  sync(scope.get())
  ctx.effect(() => registerStageRoutes(ctx, () => scope.get()), 'directorx director stage route')
  ctx.effect(() => registerEditRoutes(ctx), 'directorx edit stage route')
  ctx.effect(() => scope.watch(sync), 'directorx settings watch')
  ctx.effect(() => registerMediaRoute(ctx, () => scope.get().outputDir), 'directorx media route')
  ctx.effect(() => registerMediaEditsRoute(ctx, () => scope.get().outputDir), 'directorx media edits route')
  ctx.effect(() => registerMediaTasksRoute(ctx, () => scope.get().outputDir), 'directorx media tasks route')
  ctx.effect(() => registerMediaListRoute(ctx, () => scope.get().outputDir), 'directorx media list route')
  ctx.effect(() => registerProjectsRoute(ctx), 'directorx projects route')
  ctx.effect(() => registerCanvasRoute(ctx, () => scope.get().outputDir), 'directorx canvas route')
  ctx.effect(() => registerCanvasResetRoute(ctx, () => scope.get().outputDir), 'directorx canvas reset route')
  ctx.effect(() => registerCanvasSnapshotsRoute(ctx, () => scope.get().outputDir), 'directorx canvas snapshots route')
  ctx.effect(() => registerCanvasRestoreRoute(ctx, () => scope.get().outputDir), 'directorx canvas restore route')
  ctx.effect(() => registerCanvasIntentRoute(ctx, () => scope.get().outputDir), 'directorx canvas intent route')
  ctx.effect(() => registerCanvasCraftRoute(ctx, () => scope.get().outputDir), 'directorx canvas craft route')
  ctx.effect(() => registerCanvasGenerateRoute(ctx, () => scope.get() as DirectorxSettingsType), 'directorx canvas generate route')
  ctx.effect(() => registerCharactersRoute(ctx, () => scope.get().outputDir), 'directorx characters route')
  ctx.effect(() => registerStudioRoute(ctx, () => scope.get().outputDir), 'directorx studio route')
  ctx.effect(() => registerVendorRoute(ctx), 'directorx vendor assets route')
  ctx.effect(() => registerProposalsRoute(ctx, () => scope.get().outputDir), 'directorx proposals route')
  ctx.effect(() => registerProposalUpdateRoute(ctx, () => scope.get().outputDir), 'directorx proposal update route')
  ctx.effect(() => registerSettingsTestRoute(ctx, () => scope.get() as DirectorxSettingsType), 'directorx settings test route')
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:101-110](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L101-L110)

实际按session项目上下文执行。

<details>
<summary>查看原文（10行）</summary>

```text
function safeDefine(def: any) {
  const run = def.execute as (args: unknown, exec: unknown) => Promise<unknown>
  return defineRegistered({
    ...def,
    execute: async (args: never, exec: never) => {
      const root = sessionProjectRoot(exec)
      return runInProject(root, async () => asJsonObject(await run(args, exec)))
    },
  })
}
```

</details>

**依据 3 · 源码核查**：[src/project.ts:9-23](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/project.ts#L9-L23)

项目上下文/缺省cwd与session来源。

<details>
<summary>查看原文（15行）</summary>

```text
/** Workspace directory the current tool/HTTP call should write into. */
export function currentProjectRoot(): string {
  return projectStore.getStore() ?? process.cwd()
}

export function runInProject<T>(root: string | undefined, fn: () => T): T {
  const next = typeof root === 'string' && root.trim() !== '' ? resolve(root) : currentProjectRoot()
  return projectStore.run(next, fn)
}

export function sessionProjectRoot(exec: unknown): string | undefined {
  const cwd = (exec as { agent?: { session?: { header?: { cwd?: string } } } } | null)?.agent?.session?.header?.cwd
  return typeof cwd === 'string' && cwd.trim() !== '' ? cwd : undefined
}

```

</details>

**依据 4 · 源码核查**：[src/tools.ts:273-330](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L273-L330)

真实craft/ready/授权/薄提示/IP检查。

<details>
<summary>查看原文（58行）</summary>

```text
  settings: DirectorxSettings,
  store: ProposalStore,
  args: { prompt?: string; text?: string; proposalId?: string; craftId?: string; readyId?: string },
  kind?: 'image' | 'video',
) {
  const proposalId = typeof args.proposalId === 'string' ? args.proposalId.trim() : ''
  const proposal = proposalId === '' ? null : await store.get(proposalId)
  if (proposalId !== '' && proposal === null) {
    return { generate: false as const, prompt: '', reason: `proposal "${proposalId}" not found`, authorized: false, refused: true }
  }
  const craftId = typeof args.craftId === 'string' ? args.craftId : (proposal as { craftId?: string } | null)?.craftId
  const crafted = await requireCraft(settings.outputDir, craftId)
  if (!crafted.ok) {
    return { generate: false as const, prompt: '', reason: crafted.reason, authorized: false, refused: true, next: crafted.next }
  }
  const readyId = typeof args.readyId === 'string' ? args.readyId : (proposal as { readyId?: string } | null)?.readyId
  if (kind === 'image' || kind === 'video') {
    const ready = await requireReady(settings.outputDir, readyId, { craftId: crafted.craft.id, kind })
    if (!ready.ok) {
      return { generate: false as const, prompt: '', reason: ready.reason, authorized: false, refused: true, next: ready.next }
    }
    const auth = resolveGenerateAuthorization({
      mode: settings.initiative,
      prompt: crafted.craft.prompt,
      inBudget: true,
      proposal,
    })
    const thin = isThinPrompt(crafted.craft.intent, auth.prompt)
    if (thin !== undefined) {
      return {
        generate: false as const,
        prompt: auth.prompt,
        reason: thin,
        authorized: false,
        refused: true,
        next: 'directorx_prompt_plan → directorx_prompt_craft。占位必须是导演成稿，不能是角度标签或原句。',
      }
    }
    const scanned = await scanIpWithMemory(settings.outputDir, auth.prompt)
    if (scanned.brief.dirty) {
      return {
        generate: false as const,
        prompt: auth.prompt,
        reason: '成稿仍含 IP 专名',
        authorized: false,
        refused: true,
        ip: scanned.brief,
        memory: scanned.memory,
        next: scanned.brief.next,
      }
    }
    const intentScan = await scanIpWithMemory(settings.outputDir, crafted.craft.intent)
    const extras = [...intentScan.brief.exclude, ...intentScan.memory.flatMap(entry => entry.exclude)]
    return {
      ...auth,
      ready: ready.brief,
      ip: intentScan.brief,
      memory: intentScan.memory,
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:470-512](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L470-L512)

真生成gate→角色风格→runVideo。

<details>
<summary>查看原文（43行）</summary>

```text
      timeoutMs: Math.max(settings.timeoutMs, settings.pollIntervalMs * Math.min(settings.maxPollAttempts, 120)),
      async execute(args: any, exec: any) {
        const gate = await generationGate(settings, proposals, args, 'video')
        if (!gate.generate) {
          return { ...gate, refused: true, next: (gate as { next?: string }).next ?? '先 directorx_prompt_craft → directorx_generate_ready' }
        }
        const budget = Math.max(settings.timeoutMs, settings.pollIntervalMs * Math.min(settings.maxPollAttempts, 120))
        const signal = combinedSignal(exec.signal, budget)
        const bind = 'ready' in gate && gate.ready !== undefined
          ? mergeReadyBind(gate.ready, args)
          : {
              characters: Array.isArray(args.characters) ? args.characters.map(String) : [],
              referenceImages: Array.isArray(args.reference_image_paths) ? args.reference_image_paths.map(String) : [],
              firstFrame: typeof args.first_frame_path === 'string' ? args.first_frame_path : undefined,
              lastFrame: typeof args.last_frame_path === 'string' ? args.last_frame_path : undefined,
            }
        const characterCards = await new CharacterStore(settings.outputDir).get(bind.characters)
        const refs = [...new Set([...bind.referenceImages, ...characterCards.map(card => card.refPath)])]
        const characterNote = characterCards.map(card => `[角色卡 ${card.name}] ${card.description}${card.outfit !== undefined ? `；服装：${card.outfit}` : ''}${card.props !== undefined ? `；道具：${card.props}` : ''}`).join('；')
        const style = await new ProjectStyleStore(settings.outputDir).read()
        const styleNote = style !== null
          ? `风格常量：camera ${style.camera}；palette ${style.palette}；lighting ${style.lighting}${style.sceneAnchors.length > 0 ? `；场景锚点 ${style.sceneAnchors.join(' / ')}` : ''}`
          : ''
        const blocks = [characterCards.length > 0 ? `角色一致性锚点：${characterNote}` : '', styleNote].filter(block => block !== '')
        const prompt = blocks.length > 0 ? `${gate.prompt}\n\n${blocks.join('；')}` : gate.prompt
        const negative = [
          typeof args.negative_prompt === 'string' ? args.negative_prompt : '',
          'negativeExtra' in gate && typeof gate.negativeExtra === 'string' ? gate.negativeExtra : '',
          style?.negativeBaseline ?? '',
        ].filter(part => part !== '').join(', ')
        return runVideo(await generateContext(settings, 'video', signal, typeof args.model === 'string' ? args.model : undefined), prompt, {
          seconds: args.seconds,
          size: args.size,
          aspectRatio: args.aspect_ratio,
          resolution: settings.video.resolution,
          firstFramePath: bind.firstFrame,
          lastFramePath: bind.lastFrame,
          referenceImagePaths: bind.firstFrame || bind.lastFrame ? [] : refs,
          negativePrompt: negative !== '' ? negative : undefined,
        })
      },
    })))
  }
```

</details>

**依据 6 · 源码核查**：[src/providers/video.ts:49-123](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video.ts#L49-L123)

代表OpenAI视频真实POST/账本/poll/下载结果。

<details>
<summary>查看原文（75行）</summary>

```text
function withTaskId(error: unknown, taskId: string): Error {
  const wrapped = error instanceof Error ? error : new Error(String(error))
  ;(wrapped as Error & { taskId?: string }).taskId = taskId
  return wrapped
}

export async function openaiVideo(
  ctx: ProviderContext,
  prompt: string,
  seconds?: number,
  size?: string,
  options: { firstFramePath?: string; characterIds?: string[] } = {},
): Promise<VideoResult> {
  const baseURL = ctx.capability.baseURL.replace(/\/+$/, '')
  const apiKey = apiKeyOf(ctx.capability.apiKey, ['DIRECTORX_VIDEO_API_KEY', 'OPENAI_API_KEY'], baseURL)
  const payload: Record<string, unknown> = { model: ctx.capability.model, prompt }
  if (seconds !== undefined && seconds > 0) {
    // Sora 2 takes seconds as a STRING enum; clamp to the method-reference
    // values (4/8/12 — the guide's 16/20 claim is unverified, documented
    // in the community radar).
    const allowed = [4, 8, 12]
    const nearest = allowed.reduce((best, candidate) => Math.abs(candidate - seconds) < Math.abs(best - seconds) ? candidate : best, 8)
    payload.seconds = String(nearest)
  }
  if (size !== undefined && size !== '') payload.size = size
  if (options.firstFramePath !== undefined) {
    const dataUrl = await mediaSourceToDataUrl(options.firstFramePath)
    if (dataUrl.startsWith('data:')) payload.input_reference = { image_url: dataUrl }
    else payload.input_reference = { image_url: options.firstFramePath }
  }
  if (options.characterIds !== undefined && options.characterIds.length > 0) {
    payload.characters = options.characterIds.map(id => ({ id }))
  }
  const response = await fetch(`${baseURL}/videos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: ctx.signal,
  })
  const body = await readJsonResponse<VideoCreateEnvelope>(response)
  if (!response.ok) {
    throw new Error(`Video creation failed (HTTP ${response.status}): ${JSON.stringify(body.error ?? body).slice(0, 400)}`)
  }
  const taskId = body.id ?? body.output?.task_id
  if (taskId === undefined || taskId === '') throw new Error(`Video response did not contain a task id: ${JSON.stringify(body).slice(0, 400)}`)
  await ctx.ledger?.append({
    taskId,
    model: ctx.capability.model,
    mode: 'openai-videos',
    prompt,
    state: 'submitted',
    at: Date.now(),
  })
  const finished = await pollOpenAIVideoTask(baseURL, apiKey, taskId, ctx.settings, ctx.signal, ctx.ledger)
    .catch(error => { throw withTaskId(error, taskId) })
  const files: MediaFile[] = []
  for (const url of finished.urls) {
    files.push({ url })
    if (files.length === 1 && /^https?:\/\//i.test(url)) {
      const path = await downloadToFile(url, ctx.settings.outputDir, slugify(prompt), '.mp4')
      files[0] = { path, url, mimeType: 'video/mp4' }
    }
  }
  await ctx.ledger?.append({
    taskId,
    model: ctx.capability.model,
    mode: 'openai-videos',
    prompt,
    state: 'succeeded',
    at: Date.now(),
    urls: finished.urls,
    files,
  })
  return { model: ctx.capability.model, prompt, taskId, status: finished.status, files, mode: 'openai-videos' }
}
```

</details>

**依据 7 · 源码核查**：[src/providers/video.ts:196-215](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video.ts#L196-L215)

真实多模式分派。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runVideo(
  ctx: ProviderContext,
  prompt: string,
  options: { seconds?: number; size?: string; aspectRatio?: string; resolution?: string; firstFramePath?: string; lastFramePath?: string; referenceImagePaths?: string[]; negativePrompt?: string },
): Promise<VideoResult> {
  try {
    if (ctx.capability.mode === 'mock') return mockVideo(ctx, prompt)
    if (ctx.capability.mode === 'openai-videos') return openaiVideo(ctx, prompt, options.seconds, options.size, { firstFramePath: options.firstFramePath })
    if (ctx.capability.mode === 'modelverse-tasks') return modelverseVideo(ctx, prompt, options)
    if (ctx.capability.mode === 'kling') return klingVideo(ctx, prompt, { ...options, negativePrompt: options.negativePrompt })
    if (ctx.capability.mode === 'runway') return runwayVideo(ctx, prompt, options)
    if (ctx.capability.mode === 'minimax-h3') return minimaxH3Video(ctx, prompt, options)
    if (ctx.capability.mode === 'kling-v3') return klingV3Video(ctx, prompt, options)
    if (ctx.capability.mode === 'vidu') return viduVideo(ctx, prompt, options)
    if (ctx.capability.mode === 'veo') return veoVideo(ctx, prompt, options)
    if (ctx.capability.mode === 'generic-rest') {
      if (ctx.adapter === undefined) throw new Error('generic-rest 需要已 commit 的 AdapterSpec（directorx_provider_commit）')
      return genericAsVideo(ctx, ctx.adapter, { prompt, ...options })
    }
    throw new Error(`Unsupported video mode: ${ctx.capability.mode}`)
```

</details>

**依据 8 · 源码核查**：[src/providers/tasks.ts:90-130](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/tasks.ts#L90-L130)

实际OpenAI任务GET/取消检查与结果状态。

<details>
<summary>查看原文（41行）</summary>

```text
export async function pollOpenAIVideoTask(
  baseURL: string,
  apiKey: string,
  taskId: string,
  settings: DirectorxSettings,
  signal: AbortSignal,
  ledger?: DirectorxTaskLedger,
): Promise<{ urls: string[]; status: string }> {
  const base = baseURL.replace(/\/+$/, '')
  for (let attempt = 0; attempt < settings.maxPollAttempts; attempt += 1) {
    if (signal.aborted) throw new Error('Video polling cancelled')
    if (ledger !== undefined && await ledger.isCancelled(taskId)) {
      throw new Error(`Video task ${taskId} was cancelled via directorx_cancel_task`)
    }
    await new Promise(resolve => setTimeout(resolve, settings.pollIntervalMs))
    const response = await fetch(`${base}/videos/${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    })
    const body = await readJsonResponse<StatusEnvelope>(response)
    if (!response.ok) {
      throw new Error(`Video status request failed (HTTP ${response.status}): ${JSON.stringify(body).slice(0, 400)}`)
    }
    const rawStatus = body.output?.status ?? (body as unknown as Record<string, unknown>).status ?? ''
    const status = String(rawStatus).toLowerCase()
    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      const topLevel = body as unknown as { urls?: unknown; url?: unknown }
      const urls = [
        ...(body.output?.urls ?? []),
        ...(body.output?.url ? [body.output.url] : []),
        ...(Array.isArray(topLevel.urls) ? topLevel.urls : []),
        ...(typeof topLevel.url === 'string' ? [topLevel.url] : []),
      ].filter((url): url is string => typeof url === 'string' && url.length > 0)
      if (urls.length === 0) throw new Error(`video task ${taskId} completed but returned no URLs`)
      return { urls, status: String(rawStatus) }
    }
    if (status === 'failed' || status === 'cancelled' || status === 'error') {
      throw new Error(`video task ${taskId} failed: ${JSON.stringify(body).slice(0, 400)}`)
    }
  }
  throw new Error(`video task ${taskId} did not finish within ${settings.maxPollAttempts * settings.pollIntervalMs}ms`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 用户签字、预算、取消与恢复是否强制可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

directorx_confirm确实用Host userQuestions.ask把分镜/提案交人答复，再把选择写approved/rejected，是可用的人审工作流。可是模型可调用directorx_proposal_update直接写approved；snapshot失败也不阻批准。resolveGenerateAuthorization信proposal.status，自动模式只检查inBudget不为false，而generationGate传的是常量true；不是现金余额/次数硬预算或独立不可绕过的人审。直接generate_video返回runVideo，未在该工具中一次性消费approved或标done，同提案不能当单次付费票据。

ProposalStore为读/改/直接writeFile JSON，读失败返回空列表，非原子事务/跨进程锁；并发签字/生成与崩溃状态需要核。tasks.jsonl是真持久append，list只读尾20000行且跳坏行，不是完整不可丢审计。task_status只读本地最新transition，不自动查询远端，因此中断后submitted只是线索。

cancel_task在账本追加cancelled，poll下次检查会停；没有该入口远端DELETE/cancel API，远端可能继续计费。HTTP信号/超时可停止等待，但提交已生效/未知结果不能当退款或撤销。不能以失败信息“网络可重试”自动重新生成，须按taskId/供应商账单核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:2353-2378](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L2353-L2378)

实际Host ask入口。

<details>
<summary>查看原文（26行）</summary>

```text
    name: 'directorx_confirm',
    description: 'Pause on the DSH ask UI (ctx.userQuestions) to sign off the production board: next pending proposal, multi-select proposals, or the canvas shot list. Applies approve/reject to the ledger. Does not generate media. Prefer this over a free-form ask_user_question after directorx_propose / directorx_canvas_shotlist.',
    parameters: {
      scope: {
        type: 'string',
        enum: ['next', 'proposals', 'shotlist'],
        description: 'next = oldest pending proposal; proposals = multi-select pending ids; shotlist = sign the whole board. Default next.',
      },
    },
    output: objectOutput(),
    timeoutMs: 300_000,
    async execute(args: any, exec: any) {
      const hostAsk = resolveHostAsk(ctx)
      if (hostAsk === undefined) {
        throw new Error('directorx_confirm requires DSH userQuestions (Web UI or TUI). This deployment has no ask provider.')
      }
      const scope = args.scope === 'proposals' || args.scope === 'shotlist' ? args.scope : 'next'
      return confirmProduction({
        scope,
        outputDir: settings.outputDir,
        ask: request => hostAsk.ask(request),
        agent: exec.agent,
        signal: exec.signal,
      })
    },
  })))
```

</details>

**依据 2 · 源码核查**：[src/confirm.ts:175-193](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/confirm.ts#L175-L193)

真实ask答案写提案状态。

<details>
<summary>查看原文（19行）</summary>

```text
  const [doc, proposals, next] = await Promise.all([canvas.read(), store.list(), store.next()])
  const shotlist = formatCanvasShotlist(doc)
  const questions = buildConfirmQuestions({ scope: input.scope, proposals, shotlist, next })
  const asked = await input.ask({
    questions,
    ...(input.agent === undefined ? {} : { agent: input.agent }),
    ...(input.signal === undefined ? {} : { signal: input.signal }),
  })
  const applied = applyConfirmAnswers({ answers: asked.answers, proposals, next })
  for (const change of applied) {
    await store.update(change.id, change.status)
  }
  const after = await store.list()
  return {
    scope: input.scope,
    answers: asked.answers,
    applied,
    board: formatProductionBoard({ shotlist, proposals: after, next: await store.next() }),
  }
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:2471-2493](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L2471-L2493)

模型可直接approve、快照失败不阻。

<details>
<summary>查看原文（23行）</summary>

```text
  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_proposal_update',
    description: 'Update a proposal status (proposed -> approved/rejected/done). Approving moves it to the execution queue; done marks it executed with its artifact.',
    parameters: {
      id: { type: 'string', required: true, description: 'Proposal id from directorx_proposals.' },
      status: { type: 'string', enum: ['proposed', 'approved', 'rejected', 'done'], required: true, description: 'New status.' },
    },
    output: objectOutput(),
    timeoutMs: 30_000,
    async execute(args: any) {
      const status = args.status
      if (status === 'approved') {
        // 撤销此批：批准即存画布检查点（执行前快照）。
        try {
          await canvas.snapshot(`proposal-${String(args.id)}`)
        } catch {
          // 快照失败不阻塞批准。
        }
      }
      return proposals.update(String(args.id), status)
    },
  })))

```

</details>

**依据 4 · 源码核查**：[src/persona.ts:174-211](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/persona.ts#L174-L211)

实际approved/自动inBudget授权裁决。

<details>
<summary>查看原文（38行）</summary>

```text
export function resolveGenerateAuthorization(input: {
  mode?: unknown
  prompt?: string
  inBudget?: boolean
  proposal?: { status: string; prompt: string } | null
}): { generate: boolean; prompt: string; reason: string; authorized: boolean } {
  const mode = parseInitiative(input.mode)
  if (input.proposal !== undefined && input.proposal !== null) {
    if (input.proposal.status === 'approved') {
      return {
        generate: true,
        prompt: input.proposal.prompt,
        reason: '用户已审阅并批准占位，执行生成',
        authorized: true,
      }
    }
    return {
      generate: false,
      prompt: input.proposal.prompt,
      reason: `提案 ${input.proposal.status}，尚未批准，不得执行生成`,
      authorized: false,
    }
  }
  if (mode === '自动' && input.inBudget !== false) {
    return {
      generate: true,
      prompt: (input.prompt ?? '').trim(),
      reason: '自动：预算范围内直接执行生成',
      authorized: false,
    }
  }
  return {
    generate: false,
    prompt: (input.prompt ?? '').trim(),
    reason: '未授权：严格/协同不得自行执行生成，先占位并经用户审阅',
    authorized: false,
  }
}
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:291-299](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L291-L299)

generationGate传入inBudget:true。

```text
    if (!ready.ok) {
      return { generate: false as const, prompt: '', reason: ready.reason, authorized: false, refused: true, next: ready.next }
    }
    const auth = resolveGenerateAuthorization({
      mode: settings.initiative,
      prompt: crafted.craft.prompt,
      inBudget: true,
      proposal,
    })
```

**依据 6 · 源码核查**：[src/tools.ts:498-512](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L498-L512)

直接生成返回provider而非消费提案。

<details>
<summary>查看原文（15行）</summary>

```text
          style?.negativeBaseline ?? '',
        ].filter(part => part !== '').join(', ')
        return runVideo(await generateContext(settings, 'video', signal, typeof args.model === 'string' ? args.model : undefined), prompt, {
          seconds: args.seconds,
          size: args.size,
          aspectRatio: args.aspect_ratio,
          resolution: settings.video.resolution,
          firstFramePath: bind.firstFrame,
          lastFramePath: bind.lastFrame,
          referenceImagePaths: bind.firstFrame || bind.lastFrame ? [] : refs,
          negativePrompt: negative !== '' ? negative : undefined,
        })
      },
    })))
  }
```

</details>

**依据 7 · 源码核查**：[src/proposals.ts:52-73](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/proposals.ts#L52-L73)

读错空列表/直接JSON写。

<details>
<summary>查看原文（22行）</summary>

```text
export class ProposalStore {
  constructor(private readonly outputDir: string) {}

  private filePath(): string {
    return join(resolveOutputDir(this.outputDir), 'proposals.json')
  }

  async read(): Promise<ProposalLedger> {
    try {
      const raw = await readFile(this.filePath(), 'utf8')
      const parsed = JSON.parse(raw) as Partial<ProposalLedger>
      return { proposals: Array.isArray(parsed.proposals) ? parsed.proposals : [] }
    } catch {
      return { proposals: [] }
    }
  }

  private async write(ledger: ProposalLedger): Promise<ProposalLedger> {
    await mkdir(resolveOutputDir(this.outputDir), { recursive: true })
    await writeFile(this.filePath(), JSON.stringify(ledger, null, 2), 'utf8')
    return ledger
  }
```

</details>

**依据 8 · 源码核查**：[src/proposals.ts:134-148](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/proposals.ts#L134-L148)

状态更新直接写账本。

<details>
<summary>查看原文（15行）</summary>

```text
    if (proposal === undefined) throw new Error(`proposal "${id}" not found`)
    proposal.status = status
    if (status === 'rejected' && fields.rejectReason !== undefined && fields.rejectReason !== '') proposal.rejectReason = fields.rejectReason
    if (fields.taskId !== undefined && fields.taskId !== '') proposal.taskId = fields.taskId
    if (fields.attempts !== undefined) proposal.attempts = fields.attempts
    if (fields.prompt !== undefined && fields.prompt.trim() !== '') proposal.prompt = fields.prompt.slice(0, 2000)
    await this.write(ledger)
    return proposal
  }

  /** 版本血统：基于被拒提案生成新版本（parentId 链 + attempts 递增）。 */
  async regenerate(id: string, patch: { prompt?: string; note?: string } = {}): Promise<GenerationProposal> {
    const ledger = await this.read()
    const parent = ledger.proposals.find(candidate => candidate.id === id)
    if (parent === undefined) throw new Error(`proposal "${id}" not found`)
```

</details>

**依据 9 · 源码核查**：[src/tasks.ts:45-73](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tasks.ts#L45-L73)

真实append与尾20000/坏行跳过。

<details>
<summary>查看原文（29行）</summary>

```text
  }

  async append(record: TaskRecord): Promise<void> {
    if (record.taskId === '') return
    const path = await this.filePath()
    await appendFile(path, `${JSON.stringify(record)}\n`, 'utf8')
  }

  /** All transitions of every task, in append order. */
  async list(): Promise<TaskRecord[]> {
    const path = await this.filePath()
    const content = await readFile(path, 'utf8').catch(error => {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return ''
      throw error
    })
    const records: TaskRecord[] = []
    for (const line of content.split('\n').slice(-MAX_LEDGER_LINES)) {
      const trimmed = line.trim()
      if (trimmed === '') continue
      try {
        const parsed = JSON.parse(trimmed) as TaskRecord
        if (typeof parsed.taskId === 'string' && parsed.taskId !== '') records.push(parsed)
      } catch {
        // A torn line from a crashed append: skip it, keep the ledger readable.
      }
    }
    return records
  }

```

</details>

**依据 10 · 源码核查**：[src/tools.ts:1056-1102](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L1056-L1102)

task_status本地读与cancel仅账本。

<details>
<summary>查看原文（47行）</summary>

```text
    name: 'directorx_task_status',
    description: 'Read the DirectorX task ledger (persisted under the output directory). Without task_id, returns the most recent tasks; with task_id, the latest transition. Use it to recover tasks whose original tool call timed out or whose session was interrupted.',
    parameters: {
      task_id: { type: 'string', description: 'Optional provider task id; omit to list recent tasks.' },
      limit: { type: 'number', description: 'Max tasks to list when task_id is omitted (default 10, max 50).' },
    },
    output: objectOutput(),
    timeoutMs: 30_000,
    isConcurrencySafe: () => true,
    async execute(args: any, exec: any) {
      void exec
      const ledger = new DirectorxTaskLedger(settings.outputDir)
      const taskId = typeof args.task_id === 'string' ? args.task_id.trim() : ''
      if (taskId !== '') {
        const record = await ledger.latest(taskId)
        return record === undefined
          ? { task_id: taskId, found: false }
          : { task_id: taskId, found: true, task: record }
      }
      const limit = Math.min(50, Math.max(1, Math.round(args.limit ?? 10)))
      const records = await ledger.list()
      // Latest state per task id, newest first.
      const byId = new Map<string, (typeof records)[number]>()
      for (const record of records) byId.set(record.taskId, record)
      const tasks = [...byId.values()].reverse().slice(0, limit)
      return { tasks, count: byId.size }
    },
  })))

  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_cancel_task',
    description: 'Cancel an in-flight or orphaned DirectorX generation task by task id. An in-flight poll loop stops at its next ledger check; a task already succeeded is a no-op. The provider-side task may keep running remotely.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'Provider task id from directorx_task_status or a previous generation result.' },
    },
    output: objectOutput(),
    timeoutMs: 30_000,
    isConcurrencySafe: () => true,
    async execute(args: any) {
      const ledger = new DirectorxTaskLedger(settings.outputDir)
      const taskId = args.task_id.trim()
      if (taskId === '') throw new Error('directorx_cancel_task requires a non-empty task_id')
      const record = await ledger.cancel(taskId)
      return { task_id: taskId, task: record }
    },
  })))

```

</details>

**依据 11 · 源码核查**：[src/tasks.ts:90-112](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tasks.ts#L90-L112)

cancel追加本地cancelled。

<details>
<summary>查看原文（23行）</summary>

```text

  /**
   * Record a cancel intent. Idempotent for finished tasks: appending a
   * `cancelled` transition over a `succeeded`/`cancelled` task is a no-op. A
   * locally `failed` task may still be running at the provider (orphan), so it
   * accepts the cancel transition; an in-flight task flips to cancelled and
   * the matching poll loop aborts on its next ledger check.
   */
  async cancel(taskId: string, reason = 'cancel requested'): Promise<TaskRecord> {
    const latest = await this.latest(taskId)
    const terminal = latest !== undefined && (latest.state === 'succeeded' || latest.state === 'cancelled')
    if (terminal) return latest
    const record: TaskRecord = {
      taskId,
      model: latest?.model ?? '',
      mode: latest?.mode ?? '',
      prompt: latest?.prompt ?? '',
      state: 'cancelled',
      at: Date.now(),
      reason,
    }
    await this.append(record)
    return record
```

</details>

**依据 12 · 源码核查**：[src/providers/tasks.ts:99-111](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/tasks.ts#L99-L111)

poll检查本地cancelled后GET。

<details>
<summary>查看原文（13行）</summary>

```text
  for (let attempt = 0; attempt < settings.maxPollAttempts; attempt += 1) {
    if (signal.aborted) throw new Error('Video polling cancelled')
    if (ledger !== undefined && await ledger.isCancelled(taskId)) {
      throw new Error(`Video task ${taskId} was cancelled via directorx_cancel_task`)
    }
    await new Promise(resolve => setTimeout(resolve, settings.pollIntervalMs))
    const response = await fetch(`${base}/videos/${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    })
    const body = await readJsonResponse<StatusEnvelope>(response)
    if (!response.ok) {
      throw new Error(`Video status request failed (HTTP ${response.status}): ${JSON.stringify(body).slice(0, 400)}`)
```

</details>

#### 缺口

- 签字/付费双发、写盘失败、远端取消/账单找回无真实演练。
  **影响**：不能作硬预算、单次批准、全事务恢复或取消退款保证。
  **进一步探讨**：隔离配置/极小额度测重复提案/网络接受后断线/ledger失败；核供应商任务和费用后才重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 剪辑、质检和交付怎样真正执行，判据到哪为止？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

directorx_timeline实际调用renderTimeline并可finishBound回画布路径。渲染先查源存在/trim/speed，逐镜处理/缓存，单镜处理或videoConcat，多镜全cut才硬切否则fade，再混音/字幕；FFmpeg封装实际spawnSync，普通视频处理用临时输出成功rename，失败删临时。时间线渲染finally清被替换中间文件而保最终；这不是项目全事务或媒体历史无限保留。

qa_report真实qaCheck后把每检查与verdict写成画布文字节点，qaCheck用videoAnalyze/ffprobe信号检查时长(容差max1秒或25%)、比例/音轨/镜头数、黑白帧/闪烁/冻结/音量等，全部pass才总pass。它并不证明故事满足brief、人物身份/动作物理、字幕事实/版权或审美；frame QA/模型判读另需验，不能把技术QC当最终可发布。

本地剪辑可不重新调用生成API，支持差异修订的实际基础，但spawnSync没有在所核路径传exec.signal或子进程timeout，工具timeout不保证立即中断重编码；缓存/输出磁盘、前后画布绑定和实际可播放性需核。交付路径/画布可回查仍不等打包可迁移工程或所有资源齐全。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:2706-2729](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L2706-L2729)

真实timeline工具执行/画布结果绑定。

<details>
<summary>查看原文（24行）</summary>

```text
  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_timeline',
    description: 'Render a timeline JSON into a finished cut (OTIO-inspired subset — the editing agent\'s central format): scenes with per-scene trims, cross-fade/hard-cut concat, optional audio mixing with ducking, and subtitle muxing. Deterministic and re-renderable: change the plan, re-render, never re-generate. 可带 nodeId 回写画布。 timeline = { scenes: [{source, trim?, transition?}], subtitle?, audio? [{path, volume?, duckUnder?}], scale? }.',
    parameters: {
      timeline: { type: 'object', additionalProperties: true, required: true, description: 'Timeline spec: scenes array + optional subtitle srt path, audio tracks, scale.' },
      nodeId: { type: 'string', description: '画布节点 id。有则把成片 path 写回该节点。' },
    },
    output: objectOutput(),
    timeoutMs: 1800_000,
    isConcurrencySafe: () => true,
    async execute(args: any) {
      const timeline = (args.timeline ?? {}) as { scenes?: unknown[]; subtitle?: string; audio?: unknown[]; scale?: string }
      const rendered = await renderTimeline({
        scenes: Array.isArray(timeline.scenes) ? timeline.scenes as never[] : [],
        subtitle: timeline.subtitle,
        audio: Array.isArray(timeline.audio) ? timeline.audio as never[] : undefined,
        scale: timeline.scale,
      }, settings.outputDir)
      const nodeId = typeof args.nodeId === 'string' && args.nodeId !== '' ? args.nodeId : undefined
      return { ...rendered, ...(await finishBound({ nodeId }, rendered, 'video/mp4')) }
    },
  })))

  disposers.push(ctx.tools.register(safeDefine({
```

</details>

**依据 2 · 源码核查**：[src/providers/timeline.ts:87-135](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/timeline.ts#L87-L135)

参数预检/逐镜处理与缓存。

<details>
<summary>查看原文（49行）</summary>

```text
export async function renderTimeline(spec: TimelineSpec, outputDir: string): Promise<TimelineOutput> {
  if (spec.scenes.length === 0) throw new DirectiveError('invalidArg', 'timeline needs at least one scene')
  // Input guardrails: fail fast with actionable messages before any ffmpeg work.
  for (const [index, scene] of spec.scenes.entries()) {
    if (scene.source === '' || !existsSync(scene.source)) {
      throw new DirectiveError('notFound', `timeline scene ${index + 1}: source not found (${scene.source || '<empty>'})`)
    }
    if (scene.trim !== undefined) {
      const [start, end] = scene.trim
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
        throw new DirectiveError('outOfRange', `timeline scene ${index + 1}: trim window [${start},${end}] invalid (0 <= start < end)`)
      }
    }
    if (scene.speed !== undefined && (scene.speed < 0.5 || scene.speed > 8)) {
      throw new DirectiveError('outOfRange', `timeline scene ${index + 1}: speed ${scene.speed}x out of range [0.5, 8]`)
    }
  }
  const steps: string[] = []
  /** 被下一阶段替换掉的旧产物（最终成片不入队，永不删除）。 */
  const staleFiles: string[] = []

  try {
    // 1. Per-scene trims (video_process when a trim window is requested).
    // 场景指纹缓存：命中即复用（修订 diff 重渲染：未改场景零成本）。
    const segmentPaths: string[] = []
    for (const [index, scene] of spec.scenes.entries()) {
      const fingerprint = sceneFingerprint(scene, spec.scale)
      const cached = segmentCachePath(outputDir, fingerprint)
      if (existsSync(cached)) {
        segmentPaths.push(cached)
        steps.push(`scene ${index + 1} cache hit (fingerprint ${fingerprint}): ${cached}`)
        continue
      }
      if (scene.trim !== undefined) {
        const segment = await videoProcess({
          source: scene.source,
          outputDir,
          start: scene.trim[0],
          end: scene.trim[1],
          ...(scene.speed !== undefined && scene.speed > 0 ? { speed: Math.min(8, Math.max(0.5, scene.speed)) } : {}),
          ...(scene.reverse === true ? { reverse: true } : {}),
          ...(spec.scale !== undefined && spec.scale !== '' ? { scale: spec.scale } : {}),
        })
        staleFiles.push(segment.path)
        segmentPaths.push(segment.path)
        steps.push(`trim scene ${index + 1}${scene.speed !== undefined && scene.speed > 0 ? ` (speed ${scene.speed}x)` : ''}: ${scene.source} [${scene.trim[0]},${scene.trim[1]}] -> ${segment.path}`)
        try {
          mkdirSync(join(resolveOutputDir(outputDir), '.timeline-cache'), { recursive: true })
          copyFileSync(segment.path, cached)
```

</details>

**依据 3 · 源码核查**：[src/providers/timeline.ts:155-185](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/timeline.ts#L155-L185)

实际单镜/拼接/混音。

<details>
<summary>查看原文（31行）</summary>

```text
    // 2. Concat (fade by default; per-scene hard cuts honored globally when all are cut).
    // A single segment skips the concat stage entirely.
    const allCut = spec.scenes.every(scene => scene.transition === 'cut')
    let assembled: VideoOutput
    if (segmentPaths.length === 1) {
      const single = await videoProcess({ source: segmentPaths[0], outputDir, ...(spec.scale !== undefined && spec.scale !== '' ? { scale: spec.scale } : {}) })
      assembled = { path: single.path, mimeType: 'video/mp4', probe: single.probe }
      steps.push(`single scene (no concat): ${segmentPaths[0]} -> ${single.path}`)
    } else {
      assembled = await videoConcat({
        files: segmentPaths,
        outputDir,
        transition: allCut ? 'cut' : 'fade',
        fadeSec: 0.5,
        ...(spec.scale !== undefined && spec.scale !== '' ? { scale: spec.scale } : {}),
      })
      steps.push(`concat (${allCut ? 'cut' : 'fade'}): ${segmentPaths.length} scenes -> ${assembled.path}`)
    }

    // 3. Audio mixing (ducking under the narration track when requested).
    if (spec.audio !== undefined && spec.audio.length > 0) {
      const narrationIndex = spec.audio.findIndex(track => track.duckUnder !== undefined && track.duckUnder >= 0)
      staleFiles.push(assembled.path)
      assembled = await audioMix({
        video: assembled.path,
        outputDir,
        tracks: spec.audio.map(track => ({ path: track.path, volume: track.volume })),
        duckUnder: narrationIndex >= 0 ? narrationIndex : undefined,
      })
      steps.push(`audio mix: ${spec.audio.length} tracks${narrationIndex >= 0 ? ` (duck under track ${narrationIndex})` : ''} -> ${assembled.path}`)
    }
```

</details>

**依据 4 · 源码核查**：[src/providers/timeline.ts:202-229](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/timeline.ts#L202-L229)

FFmpeg淡入淡出/字幕/结果/finally清中间文件。

<details>
<summary>查看原文（28行）</summary>

```text
        const fargs: string[] = ['-hide_banner', '-y', '-i', assembled.path]
        if (fadeFilters.length > 0) fargs.push('-vf', fadeFilters.join(','))
        if (audioFade.length > 0) fargs.push('-af', audioFade.join(','))
        fargs.push('-c:v', 'libx264', '-preset', 'veryfast', '-c:a', 'aac', out)
        const result = spawnSync('ffmpeg', fargs, { encoding: 'utf8' })
        if (result.status !== 0) throw new Error(`fade failed: ${result.stderr?.slice(-300)}`)
        staleFiles.push(assembled.path)
        assembled = { path: out, mimeType: 'video/mp4', probe: probeMedia(out) }
        steps.push(`fade in/out -> ${out}`)
      }
    }

    // 4. Subtitle mux (soft track; burn only when the build supports libass).
    if (spec.subtitle !== undefined && spec.subtitle !== '') {
      staleFiles.push(assembled.path)
      assembled = await videoSubtitle({ video: assembled.path, srt: spec.subtitle, mode: 'soft', outputDir })
      steps.push(`subtitle mux: ${spec.subtitle} -> ${assembled.path}`)
    }

    return { path: assembled.path, mimeType: 'video/mp4', steps, probe: assembled.probe }
  } finally {
    // 只清理被替换掉的中间产物；最终成片永不入清理队列。
    await Promise.all(staleFiles.map(stale => rm(stale, { force: true }).catch(() => {})))
  }
}

export interface AudioSyncInput {
  /** Base video the narration rides on. */
```

</details>

**依据 5 · 源码核查**：[src/providers/video-process.ts:20-39](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video-process.ts#L20-L39)

真实spawnSync/临时文件/失败清除/成功rename。

<details>
<summary>查看原文（20行）</summary>

```text
  let outputIndex = -1
  for (let index = args.length - 1; index >= 0; index -= 1) {
    const arg = args[index]
    if (arg !== undefined && !arg.startsWith('-')) { outputIndex = index; break }
  }
  const finalArgs = [...args]
  const dot = outputIndex >= 0 ? args[outputIndex].lastIndexOf('.') : -1
  const tempPath = outputIndex >= 0 && dot > 0
    ? `${args[outputIndex].slice(0, dot)}.tmp-${Date.now().toString(36)}${args[outputIndex].slice(dot)}`
    : undefined
  if (outputIndex >= 0 && tempPath !== undefined) finalArgs[outputIndex] = tempPath
  const result = spawnSync('ffmpeg', ['-hide_banner', '-y', ...finalArgs], { encoding: 'utf8' })
  if (result.status !== 0) {
    if (tempPath !== undefined) rmSync(tempPath, { force: true })
    throw new Error(`${what} failed: ${result.stderr?.slice(-600) || `exit ${result.status}`}`)
  }
  if (outputIndex >= 0 && tempPath !== undefined) {
    renameSync(tempPath, args[outputIndex])
  }
}
```

</details>

**依据 6 · 源码核查**：[src/providers/ffmpeg.ts:39-58](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/ffmpeg.ts#L39-L58)

真实ffprobe与失败检查。

<details>
<summary>查看原文（20行）</summary>

```text
export function probeMedia(source: string): MediaProbe {
  requireBinary('ffprobe')
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    source,
  ], { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(`ffprobe failed: ${result.stderr?.slice(-400) || `exit ${result.status}`}`)
  }
  const parsed = JSON.parse(result.stdout) as {
    format?: { format_name?: string; duration?: string; size?: string }
    streams?: Array<Record<string, unknown>>
  }
  const compactStreams = (parsed.streams ?? []).map(stream => ({
    type: stream.codec_type,
    codec: stream.codec_name,
    ...(stream.width !== undefined ? { width: stream.width } : {}),
```

</details>

**依据 7 · 源码核查**：[src/tools.ts:3144-3170](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L3144-L3170)

真实qa报告写canvas节点。

<details>
<summary>查看原文（27行）</summary>

```text
  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_qa_report',
    description: 'One-call QC report card: runs directorx_qa against the brief and mirrors the verdict + per-check evidence + rule citations onto the canvas as a「质检｜…」text node. The standardized final-cut QA card for every deliverable.',
    parameters: {
      source: { type: 'string', required: true, description: 'Absolute path of the rendered video.' },
      expect: { type: 'object', additionalProperties: true, description: 'Expected brief: { targetSeconds?, aspectRatio?, hasAudio?, minShots?, maxShots?, rhythm?, asl? [min,max] }.' },
      title: { type: 'string', description: 'Optional report title (defaults to the file name).' },
    },
    output: objectOutput(),
    timeoutMs: 1800_000,
    isConcurrencySafe: () => true,
    async execute(args: any) {
      const expect = (args.expect ?? {}) as { targetSeconds?: number; aspectRatio?: string; hasAudio?: boolean; minShots?: number; maxShots?: number; rhythm?: boolean }
      const report = await qaCheck({ source: String(args.source), outputDir: settings.outputDir, expect }, settings, settings.vision)
      const name = typeof args.title === 'string' && args.title !== '' ? args.title : String(args.source).split('/').pop()
      const lines = [`质检｜${name}`, `verdict: ${report.verdict}`, ...report.checks.map(check => `${check.pass ? 'PASS' : 'FAIL'} ${check.name}: ${check.detail}`), '规则引用: directorx-methodology（节奏规则 2/10，黑帧白帧规则由确定性信号分析覆盖）']
      const doc = await canvas.read()
      const maxBottom = doc.nodes.reduce((max, node) => Math.max(max, node.y + (node.height ?? 120)), 0)
      const nodeId = `qc-${Date.now()}`
      const updatedDoc = await canvas.addNode({ id: nodeId, kind: 'text', label: lines.join('\n'), x: 0, y: maxBottom + 60, width: 420, height: 60 + report.checks.length * 40 })
      const node = updatedDoc.nodes.find(candidate => candidate.id === nodeId)
      return { qa: report, canvasNodeId: node?.id ?? nodeId }
    },
  })))

  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_qa',
```

</details>

**依据 8 · 源码核查**：[src/providers/video-analyze.ts:307-369](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video-analyze.ts#L307-L369)

实际技术质量阈值与最终every(pass)。

<details>
<summary>查看原文（63行）</summary>

```text
export async function qaCheck(input: QaInput, settings: DirectorxSettings, vision: CapabilitySettings): Promise<QaOutput> {
  const analysis = await videoAnalyze({ source: input.source, outputDir: input.outputDir, settings, vision, minShotSec: 0.3 })
  const checks: QaOutput['checks'] = []
  const videoStream = analysis.probe.streams.find(stream => stream.type === 'video')
  const audioStream = analysis.probe.streams.some(stream => stream.type === 'audio')
  const duration = analysis.probe.durationSec

  if (input.expect?.targetSeconds !== undefined) {
    const target = input.expect.targetSeconds
    const ok = Math.abs(duration - target) <= Math.max(1, target * 0.25)
    checks.push({ name: '时长', pass: ok, detail: `实测 ${duration}s / 目标 ${target}s` })
  }
  if (input.expect?.aspectRatio !== undefined) {
    const width = videoStream?.width as number | undefined
    const height = videoStream?.height as number | undefined
    const [tw, th] = String(input.expect.aspectRatio).split(':').map(Number)
    const ok = width !== undefined && height !== undefined && Math.abs(width / height - tw / th) < 0.08
    checks.push({ name: '画幅', pass: ok, detail: `${width}x${height} / 期望 ${input.expect.aspectRatio}` })
  }
  if (input.expect?.hasAudio !== undefined) {
    checks.push({ name: '音轨', pass: audioStream === input.expect.hasAudio, detail: audioStream ? '含音轨' : '无音轨' })
  }
  if (input.expect?.minShots !== undefined || input.expect?.maxShots !== undefined) {
    const count = analysis.shots.length
    const minOk = input.expect.minShots === undefined || count >= input.expect.minShots
    const maxOk = input.expect.maxShots === undefined || count <= input.expect.maxShots
    checks.push({ name: '镜头数', pass: minOk && maxOk, detail: `${count} 镜 / 期望 [${input.expect.minShots ?? '-'}, ${input.expect.maxShots ?? '-'}]` })
  }
  // Black/white frame sanity from the analysis output.
  checks.push({ name: '黑帧', pass: analysis.blackFrameCount === 0, detail: analysis.blackFrameCount > 0 ? `检出 ${analysis.blackFrameCount} 帧近黑（YAVG<16）` : '无近黑帧' })
  checks.push({ name: '白帧', pass: analysis.whiteFrameCount === 0, detail: analysis.whiteFrameCount > 0 ? `检出 ${analysis.whiteFrameCount} 帧过曝（YAVG>240）` : '无过曝帧' })
  checks.push({ name: '闪烁', pass: analysis.flickerCount <= Math.max(3, Math.round((analysis.probe.durationSec ?? 0) * 2)), detail: analysis.flickerCount > 0 ? `检出 ${analysis.flickerCount} 次亮度符号交替（AI 视频常见闪烁伪影）` : '无闪烁' })
  checks.push({ name: '锐度', pass: analysis.edgeSharpness >= 15, detail: analysis.edgeSharpness > 0 ? `边缘能量均值 ${analysis.edgeSharpness}${analysis.edgeSharpness < 15 ? '（疑似整体模糊）' : '（清晰）'}` : '无法测量' })
  checks.push({ name: '冻结', pass: analysis.freezeSeconds <= 1, detail: analysis.freezeCount > 0 ? `检出 ${analysis.freezeCount} 处静止段共 ${analysis.freezeSeconds}s${analysis.freezeSeconds > 1 ? '（>1s，疑似卡帧）' : '（轻微）'}` : '无冻结段' })
  checks.push({ name: '跳变', pass: analysis.jumpCount === 0, detail: analysis.jumpCount > 0 ? `检出 ${analysis.jumpCount} 帧非切点亮度尖峰（形态突变/模型跳帧）` : '无跳变' })
  checks.push({ name: '黑场占比', pass: (analysis.blackSegments ?? []).reduce((sum, segment) => sum + segment.durationSec, 0) <= (analysis.probe.durationSec ?? 0) * 0.02, detail: (analysis.blackSegments ?? []).length > 0 ? `黑场共 ${(analysis.blackSegments ?? []).reduce((sum, segment) => sum + segment.durationSec, 0).toFixed(1)}s` : '无黑场' })
  if (analysis.blackSegments !== undefined && analysis.blackSegments.length > 0) {
    const total = analysis.blackSegments.reduce((sum, segment) => sum + segment.durationSec, 0)
    checks.push({ name: '黑场段', pass: false, detail: `${analysis.blackSegments.length} 段黑场共 ${total.toFixed(2)}s（blackdetect d=0.25）` })
  }
  if (analysis.volumeDbfs !== undefined) {
    const ok = !(analysis.volumeDbfs.mean < -40 && analysis.volumeDbfs.peak < -25)
    checks.push({ name: '音量', pass: ok, detail: `mean ${analysis.volumeDbfs.mean.toFixed(1)}dB, peak ${analysis.volumeDbfs.peak.toFixed(1)}dB（过静音或过低峰值会拦截）` })
  }
  if (input.expect?.asl !== undefined && analysis.shots.length > 1) {
    const mean = analysis.shots.reduce((sum, shot) => sum + shot.durationSec, 0) / analysis.shots.length
    const [min, max] = input.expect.asl
    const ok = mean >= min && mean <= max
    checks.push({ name: '平均镜头时长', pass: ok, detail: `ASL ${mean.toFixed(2)}s / 期望 [${min}, ${max}]s` })
  }
  if (input.expect?.rhythm === true && analysis.shots.length > 1) {
    const longest = Math.max(...analysis.shots.map(shot => shot.durationSec))
    const over = analysis.shots.filter(shot => shot.durationSec > 8).length
    checks.push({ name: '节奏密度', pass: over === 0, detail: `最长镜 ${longest.toFixed(1)}s（${analysis.shots.length} 镜）${over > 0 ? `，${over} 镜超 8s 无变化` : ''}` })
  }
  if (analysis.audioLoudness !== undefined && analysis.audioLoudness.peakLu > -60) {
    checks.push({ name: '响度', pass: true, detail: `均值 ${analysis.audioLoudness.meanLu} LU，峰值 ${analysis.audioLoudness.peakLu} LU` })
  } else if (audioStream) {
    checks.push({ name: '响度', pass: false, detail: '音频近乎静音（峰值 < -60 LU）' })
  }

  return { verdict: checks.every(check => check.pass) ? 'pass' : 'fix', checks }
}
```

</details>

#### 缺口

- 未编码/播放/QC真实视频，未核全部剪辑/视觉分析分支。
  **影响**：静态QC非创作质量或可发布成片验收。
  **进一步探讨**：固定小片对照技术QC和盲人工评审，演练长编码取消与缓存/素材缺失恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 配置、路径/数据和退出对采用有什么要求？

**研究主题**：采用判断、效果与总成本

#### 完整回答

能力设置apiKey标role(secret)，apiKeyOf实际可取配置/多个环境变量回退；这不证明每部署都有独立凭据库或所有日志脱敏。基础URL/自定义adapter endpoint代表数据/密钥信任边界；generic-rest支持绝对URL和bearer/header/query认证，应审核供应商与请求模板，不能把“填文档Key自动接入”当兼容/保密验证。

工具输出目录resolve(currentProjectRoot,dir)，不是canonical授权边界；媒体内联猜本机路径后整读再查15MiB，下载fetch/arrayBuffer整响应再write，所核函数无signal/超时/流式大小预算。浏览器媒体服务有Origin相对Host检查(无Origin放行)、项目roots列表和output目录词法包含/大小等约束，依赖宿主认证；roots空时resolveRequestProject接受requested，不能当多租户沙箱或全部符号链接隔离。这里只核代表读/服务链，不声称已发现可利用攻击。

采用要可丢弃项目、可信素材/输出目录、显式供应商/模型/额度上限和人工审阅，先mock验接线，再最小真实任务核账单/画面/声轨/来源。现金费率、失败生成重复、GPU/FFmpeg/磁盘/模型token、人审与版权处理成本均未知；本地编辑可能省重复生成，但不是经济供给/收费或风险承担结构创新。停插件/取消只停止部分本地等待，不清远端已花费/素材/任务账本，退出应逐项确认供应商任务并保留/清理资产凭据。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:79-96](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/config.ts#L79-L96)

secret/默认output/超时与协同模式设置。

<details>
<summary>查看原文（18行）</summary>

```text
  return z.object({
    enabled: z.boolean().default(true).description('Register and expose this capability to the agent.'),
    mode: z.union(modes as unknown as string[]).default(mode).description('Protocol used to reach the provider.'),
    baseURL: z.string().default(baseURL).description('Base URL, e.g. https://api.openai.com/v1.'),
    apiKey: z.string().role('secret').default('').description('API key; empty means local endpoint or env fallback.'),
    model: z.string().default(model).description('Model id.'),
    resolution: z.string().default(resolution).description('Provider-specific output tier.'),
    auth: modeAuth(),
  })
}

export const DirectorxSettings = z.object({
  outputDir: z.string().default('directorx_output').description('Directory under the current working directory for downloaded media.'),
  timeoutMs: z.number().step(1).min(1_000).max(3_600_000).default(120_000).description('HTTP timeout for one provider request.'),
  pollIntervalMs: z.number().step(1).min(500).max(60_000).default(5_000).description('Async task polling interval.'),
  maxPollAttempts: z.number().step(1).min(1).max(2_000).default(360).description('Maximum async task polling attempts.'),
  persona: z.union(['成片']).default('成片').description('成片 persona：导演角度分析，积极调用知识库与 skill。'),
  initiative: z.union(['严格', '自动', '协同']).default('协同').description('严格：多确认、不生成、二到四个提示词。自动：预算内直接执行生成。协同：提示词和占位，用户审阅后执行生成。'),
```

</details>

**依据 2 · 源码核查**：[src/support.ts:144-155](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/support.ts#L144-L155)

真实Key配置/环境回退。

<details>
<summary>查看原文（12行）</summary>

```text
export function apiKeyOf(configApiKey: string, envNames: string[], baseURL: string): string {
  const candidates = [...envNames, 'MODELVERSE_API_KEY', 'AIGW_API_KEY', 'OPENAI_API_KEY']
  const fromEnv = candidates.map(name => process.env[name]).find(value => value !== undefined && value !== '')
  const key = configApiKey !== '' ? configApiKey : fromEnv ?? ''
  if (key === '' && !isLocalBaseUrl(baseURL)) {
    throw new Error(
      `No API key configured. Fill Base URL / API Key in WebUI Settings → DirectorX, or export ${envNames.join(' / ')}.`,
    )
  }
  return key
}

```

</details>

**依据 3 · 源码核查**：[src/providers/generic-rest.ts:17-36](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/generic-rest.ts#L17-L36)

绝对URL及多种认证位置。

<details>
<summary>查看原文（20行）</summary>

```text

function joinUrl(baseURL: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = baseURL.replace(/\/+$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

export function authHeaders(spec: AdapterSpec, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (spec.auth.kind === 'bearer' && apiKey !== '') headers.authorization = `Bearer ${apiKey}`
  if (spec.auth.kind === 'header' && spec.auth.headerName && apiKey !== '') headers[spec.auth.headerName] = apiKey
  return headers
}

function withQuery(url: string, spec: AdapterSpec, apiKey: string): string {
  if (spec.auth.kind !== 'query' || !spec.auth.queryName || apiKey === '') return url
  const parsed = new URL(url)
  parsed.searchParams.set(spec.auth.queryName, apiKey)
  return parsed.toString()
```

</details>

**依据 4 · 源码核查**：[src/support.ts:27-42](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/support.ts#L27-L42)

真实整读后内联大小检查。

<details>
<summary>查看原文（16行）</summary>

```text
export async function mediaSourceToDataUrl(source: string, maxBytes = 15 * 1024 * 1024): Promise<string> {
  if (/^data:/i.test(source)) return source
  if (isHttpUrl(source)) return source
  const project = currentProjectRoot()
  const guesses = [
    resolve(source),
    resolve(project, source),
    resolve(project, 'directorx_output', source.replace(/^directorx_output[/\\]/, '')),
  ]
  const path = [...new Set(guesses)].find(candidate => existsSync(candidate))
  if (path === undefined) throw new Error(`File not found: ${source}`)
  const data = await readFile(path)
  if (data.length > maxBytes) {
    throw new Error(`File too large to inline (${Math.round(data.length / 1024 / 1024)}MB > ${Math.round(maxBytes / 1024 / 1024)}MB): ${source}`)
  }
  return `data:${mimeForPath(path)};base64,${data.toString('base64')}`
```

</details>

**依据 5 · 源码核查**：[src/support.ts:52-70](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/support.ts#L52-L70)

输出目录/全量下载写盘无signal。

<details>
<summary>查看原文（19行）</summary>

```text
export function resolveOutputDir(dir: string): string {
  return resolve(currentProjectRoot(), dir)
}

export async function ensureOutputDir(dir: string): Promise<string> {
  const out = resolveOutputDir(dir)
  await mkdir(out, { recursive: true })
  return out
}

export async function downloadToFile(url: string, outDir: string, prefix: string, ext: string): Promise<string> {
  const dir = await ensureOutputDir(outDir)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed with HTTP ${response.status}: ${url}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  const stem = `${prefix}-${new Date().toISOString().replaceAll(':', '-').replace(/\.\d+Z$/, 'Z')}${ext}`
  const path = join(dir, stem)
  await writeFile(path, bytes)
  return path
```

</details>

**依据 6 · 源码核查**：[src/support.ts:91-106](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/support.ts#L91-L106)

媒体词法包含判断非realpath。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveMediaPath(outputDir: string, candidate: string): string {
  const project = currentProjectRoot()
  const root = resolve(project, outputDir)
  const inside = (target: string): boolean => target === root || target.startsWith(root + sep)
  const guesses = isAbsolute(candidate)
    ? [resolve(candidate)]
    : [resolve(project, candidate), resolve(root, candidate)]
  const allowed = [...new Set(guesses)].filter(inside)
  if (allowed.length === 0) {
    throw new Error(`Media path escapes the DirectorX output directory: ${candidate}`)
  }
  const existing = allowed.find(path => existsSync(path))
  return existing ?? allowed[0]
}

export interface ByteRange {
```

</details>

**依据 7 · 源码核查**：[src/project.ts:61-69](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/project.ts#L61-L69)

请求项目白名单/空列表回退。

```text
export function resolveRequestProject(ctx: { get(name: string): unknown }, request: IncomingMessage): string {
  const requested = projectFromRequest(request)
  const allowed = listWorkspaceRoots(ctx).map(item => resolve(item.path))
  if (requested === undefined) return allowed[0] ?? process.cwd()
  const resolved = resolve(requested)
  if (allowed.includes(resolved)) return resolved
  if (allowed.length === 0) return resolved
  throw new Error('unknown project')
}
```

**依据 8 · 源码核查**：[src/media-server.ts:147-157](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/media-server.ts#L147-L157)

实际Origin检查无Origin放行。

<details>
<summary>查看原文（11行）</summary>

```text
function isCrossOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  if (origin === undefined) return false
  const host = request.headers.host ?? ''
  try {
    return new URL(origin).host !== host
  } catch {
    return true
  }
}

```

</details>

**依据 9 · 源码核查**：[src/media-server.ts:201-246](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/media-server.ts#L201-L246)

代表媒体路由/inspect/range/stream执行。

<details>
<summary>查看原文（46行）</summary>

```text
export function registerMediaRoute(ctx: Context, getOutputDir: () => string): () => void {
  const webServer = directorxWeb(ctx)
  if (webServer === undefined) return () => {}

  return webServer.register({
    kind: 'exact',
    path: MEDIA_ROUTE_PATH,
    handler: async (request, response) => {
      if (isCrossOrigin(request)) {
        response.writeHead(403)
        response.end('forbidden')
        return
      }
      if (request.method === 'POST') {
        await saveEditedMedia(getOutputDir(), request, response)
        return
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405)
        response.end('method not allowed')
        return
      }
      try {
        const requested = parseMediaQuery(request.url)
        if (requested === undefined) {
          response.writeHead(400)
          response.end('missing path')
          return
        }
        const info = await inspectMediaFile(getOutputDir(), requested)
        const range = parseRangeHeader(request.headers.range, info.size)
        const length = range === undefined ? info.size : range.end - range.start + 1
        response.writeHead(range === undefined ? 200 : 206, {
          'content-type': info.mediaType,
          'content-length': length,
          'accept-ranges': 'bytes',
          'cache-control': 'no-store',
          ...(range === undefined ? {} : { 'content-range': `bytes ${range.start}-${range.end}/${info.size}` }),
        })
        if (request.method === 'HEAD') {
          response.end()
          return
        }
        createReadStream(info.path, range === undefined ? undefined : { start: range.start, end: range.end }).pipe(response)
      } catch {
        if (!response.headersSent) {
```

</details>

#### 缺口

- 部署认证/密钥留存/远端政策、资源和总费用未知。
  **影响**：不据secret标签/路径前缀或mock给生产安全/零成本保证。
  **进一步探讨**：审核已选provider模板和Host身份边界，小额度任务核成本与素材/队列/退出清单。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 最值得验证的生产方向是什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：把单次生成计划做成不可自批的能力回执，绑定用户、provider/model/参数/参考素材摘要和最大次数/实际费用，在外部接受后立即记录可找回任务；将技术QC、创作审阅、版权/来源与最终交付分别签收，可能比扩大模型和知识条目更能减少重复付费和“QC通过=可发布”误判。这不是当前已实现硬预算/事务审计，不计当前创新。

同一brief比较现有分散API+剪辑和当前DirectorX，再加回执原型：测试自批工具/同approved重调、提交后丢响应、ledger写失败、远端继续/本地取消、技术QC过但人物/字幕错误。记录重复扣费、可找回率、创作接受率、修订次数和人工/token/算力总成本；若不能降低错误与净成本或签收负担过高则停止。当前建议观察，个人可丢弃项目先mock和小额度代表provider验证，企业多人/敏感素材/无人值守付费生成需先补授权和恢复实证。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:2471-2493](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/tools.ts#L2471-L2493)

可自批的具体门禁缺口。

<details>
<summary>查看原文（23行）</summary>

```text
  disposers.push(ctx.tools.register(safeDefine({
    name: 'directorx_proposal_update',
    description: 'Update a proposal status (proposed -> approved/rejected/done). Approving moves it to the execution queue; done marks it executed with its artifact.',
    parameters: {
      id: { type: 'string', required: true, description: 'Proposal id from directorx_proposals.' },
      status: { type: 'string', enum: ['proposed', 'approved', 'rejected', 'done'], required: true, description: 'New status.' },
    },
    output: objectOutput(),
    timeoutMs: 30_000,
    async execute(args: any) {
      const status = args.status
      if (status === 'approved') {
        // 撤销此批：批准即存画布检查点（执行前快照）。
        try {
          await canvas.snapshot(`proposal-${String(args.id)}`)
        } catch {
          // 快照失败不阻塞批准。
        }
      }
      return proposals.update(String(args.id), status)
    },
  })))

```

</details>

**依据 2 · 源码核查**：[src/providers/video.ts:76-123](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video.ts#L76-L123)

远端接受之后才记账/轮询与下载。

<details>
<summary>查看原文（48行）</summary>

```text
    if (dataUrl.startsWith('data:')) payload.input_reference = { image_url: dataUrl }
    else payload.input_reference = { image_url: options.firstFramePath }
  }
  if (options.characterIds !== undefined && options.characterIds.length > 0) {
    payload.characters = options.characterIds.map(id => ({ id }))
  }
  const response = await fetch(`${baseURL}/videos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: ctx.signal,
  })
  const body = await readJsonResponse<VideoCreateEnvelope>(response)
  if (!response.ok) {
    throw new Error(`Video creation failed (HTTP ${response.status}): ${JSON.stringify(body.error ?? body).slice(0, 400)}`)
  }
  const taskId = body.id ?? body.output?.task_id
  if (taskId === undefined || taskId === '') throw new Error(`Video response did not contain a task id: ${JSON.stringify(body).slice(0, 400)}`)
  await ctx.ledger?.append({
    taskId,
    model: ctx.capability.model,
    mode: 'openai-videos',
    prompt,
    state: 'submitted',
    at: Date.now(),
  })
  const finished = await pollOpenAIVideoTask(baseURL, apiKey, taskId, ctx.settings, ctx.signal, ctx.ledger)
    .catch(error => { throw withTaskId(error, taskId) })
  const files: MediaFile[] = []
  for (const url of finished.urls) {
    files.push({ url })
    if (files.length === 1 && /^https?:\/\//i.test(url)) {
      const path = await downloadToFile(url, ctx.settings.outputDir, slugify(prompt), '.mp4')
      files[0] = { path, url, mimeType: 'video/mp4' }
    }
  }
  await ctx.ledger?.append({
    taskId,
    model: ctx.capability.model,
    mode: 'openai-videos',
    prompt,
    state: 'succeeded',
    at: Date.now(),
    urls: finished.urls,
    files,
  })
  return { model: ctx.capability.model, prompt, taskId, status: finished.status, files, mode: 'openai-videos' }
}
```

</details>

**依据 3 · 源码核查**：[src/providers/video-analyze.ts:307-369](https://github.com/LaplaceYoung/dsh-directorx/blob/d63c425b4d6c40f3db30ccd433d24ed34947c8af/src/providers/video-analyze.ts#L307-L369)

技术阈值与总verdict非创作签收。

<details>
<summary>查看原文（63行）</summary>

```text
export async function qaCheck(input: QaInput, settings: DirectorxSettings, vision: CapabilitySettings): Promise<QaOutput> {
  const analysis = await videoAnalyze({ source: input.source, outputDir: input.outputDir, settings, vision, minShotSec: 0.3 })
  const checks: QaOutput['checks'] = []
  const videoStream = analysis.probe.streams.find(stream => stream.type === 'video')
  const audioStream = analysis.probe.streams.some(stream => stream.type === 'audio')
  const duration = analysis.probe.durationSec

  if (input.expect?.targetSeconds !== undefined) {
    const target = input.expect.targetSeconds
    const ok = Math.abs(duration - target) <= Math.max(1, target * 0.25)
    checks.push({ name: '时长', pass: ok, detail: `实测 ${duration}s / 目标 ${target}s` })
  }
  if (input.expect?.aspectRatio !== undefined) {
    const width = videoStream?.width as number | undefined
    const height = videoStream?.height as number | undefined
    const [tw, th] = String(input.expect.aspectRatio).split(':').map(Number)
    const ok = width !== undefined && height !== undefined && Math.abs(width / height - tw / th) < 0.08
    checks.push({ name: '画幅', pass: ok, detail: `${width}x${height} / 期望 ${input.expect.aspectRatio}` })
  }
  if (input.expect?.hasAudio !== undefined) {
    checks.push({ name: '音轨', pass: audioStream === input.expect.hasAudio, detail: audioStream ? '含音轨' : '无音轨' })
  }
  if (input.expect?.minShots !== undefined || input.expect?.maxShots !== undefined) {
    const count = analysis.shots.length
    const minOk = input.expect.minShots === undefined || count >= input.expect.minShots
    const maxOk = input.expect.maxShots === undefined || count <= input.expect.maxShots
    checks.push({ name: '镜头数', pass: minOk && maxOk, detail: `${count} 镜 / 期望 [${input.expect.minShots ?? '-'}, ${input.expect.maxShots ?? '-'}]` })
  }
  // Black/white frame sanity from the analysis output.
  checks.push({ name: '黑帧', pass: analysis.blackFrameCount === 0, detail: analysis.blackFrameCount > 0 ? `检出 ${analysis.blackFrameCount} 帧近黑（YAVG<16）` : '无近黑帧' })
  checks.push({ name: '白帧', pass: analysis.whiteFrameCount === 0, detail: analysis.whiteFrameCount > 0 ? `检出 ${analysis.whiteFrameCount} 帧过曝（YAVG>240）` : '无过曝帧' })
  checks.push({ name: '闪烁', pass: analysis.flickerCount <= Math.max(3, Math.round((analysis.probe.durationSec ?? 0) * 2)), detail: analysis.flickerCount > 0 ? `检出 ${analysis.flickerCount} 次亮度符号交替（AI 视频常见闪烁伪影）` : '无闪烁' })
  checks.push({ name: '锐度', pass: analysis.edgeSharpness >= 15, detail: analysis.edgeSharpness > 0 ? `边缘能量均值 ${analysis.edgeSharpness}${analysis.edgeSharpness < 15 ? '（疑似整体模糊）' : '（清晰）'}` : '无法测量' })
  checks.push({ name: '冻结', pass: analysis.freezeSeconds <= 1, detail: analysis.freezeCount > 0 ? `检出 ${analysis.freezeCount} 处静止段共 ${analysis.freezeSeconds}s${analysis.freezeSeconds > 1 ? '（>1s，疑似卡帧）' : '（轻微）'}` : '无冻结段' })
  checks.push({ name: '跳变', pass: analysis.jumpCount === 0, detail: analysis.jumpCount > 0 ? `检出 ${analysis.jumpCount} 帧非切点亮度尖峰（形态突变/模型跳帧）` : '无跳变' })
  checks.push({ name: '黑场占比', pass: (analysis.blackSegments ?? []).reduce((sum, segment) => sum + segment.durationSec, 0) <= (analysis.probe.durationSec ?? 0) * 0.02, detail: (analysis.blackSegments ?? []).length > 0 ? `黑场共 ${(analysis.blackSegments ?? []).reduce((sum, segment) => sum + segment.durationSec, 0).toFixed(1)}s` : '无黑场' })
  if (analysis.blackSegments !== undefined && analysis.blackSegments.length > 0) {
    const total = analysis.blackSegments.reduce((sum, segment) => sum + segment.durationSec, 0)
    checks.push({ name: '黑场段', pass: false, detail: `${analysis.blackSegments.length} 段黑场共 ${total.toFixed(2)}s（blackdetect d=0.25）` })
  }
  if (analysis.volumeDbfs !== undefined) {
    const ok = !(analysis.volumeDbfs.mean < -40 && analysis.volumeDbfs.peak < -25)
    checks.push({ name: '音量', pass: ok, detail: `mean ${analysis.volumeDbfs.mean.toFixed(1)}dB, peak ${analysis.volumeDbfs.peak.toFixed(1)}dB（过静音或过低峰值会拦截）` })
  }
  if (input.expect?.asl !== undefined && analysis.shots.length > 1) {
    const mean = analysis.shots.reduce((sum, shot) => sum + shot.durationSec, 0) / analysis.shots.length
    const [min, max] = input.expect.asl
    const ok = mean >= min && mean <= max
    checks.push({ name: '平均镜头时长', pass: ok, detail: `ASL ${mean.toFixed(2)}s / 期望 [${min}, ${max}]s` })
  }
  if (input.expect?.rhythm === true && analysis.shots.length > 1) {
    const longest = Math.max(...analysis.shots.map(shot => shot.durationSec))
    const over = analysis.shots.filter(shot => shot.durationSec > 8).length
    checks.push({ name: '节奏密度', pass: over === 0, detail: `最长镜 ${longest.toFixed(1)}s（${analysis.shots.length} 镜）${over > 0 ? `，${over} 镜超 8s 无变化` : ''}` })
  }
  if (analysis.audioLoudness !== undefined && analysis.audioLoudness.peakLu > -60) {
    checks.push({ name: '响度', pass: true, detail: `均值 ${analysis.audioLoudness.meanLu} LU，峰值 ${analysis.audioLoudness.peakLu} LU` })
  } else if (audioStream) {
    checks.push({ name: '响度', pass: false, detail: '音频近乎静音（峰值 < -60 LU）' })
  }

  return { verdict: checks.every(check => check.pass) ? 'pass' : 'fix', checks }
}
```

</details>

#### 缺口

- 单次能力/分层验收原型是否改善真实视频生产未验证。
  **影响**：不能把设想加到当前可靠性或商业创新分。
  **进一步探讨**：固定brief/故障与人工对照，预设重复费/可找回和签收人工停止阈值。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
