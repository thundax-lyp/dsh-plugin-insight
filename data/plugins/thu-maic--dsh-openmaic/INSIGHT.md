# DSH OpenMAIC

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[09c1693](https://github.com/THU-MAIC/dsh-openmaic/tree/09c1693cfe83224db89fdd4abd245ac9174d3a05)

<!-- BEGIN META -->
[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/THU-MAIC/dsh-openmaic)
<!-- END META -->

> **功能**：将完整课堂生成与会话内教学卡片接入 DSH

> **亮点**：[Q01](#research-q01) 提供课堂链接和会话中可操作的教学材料。

> **主要限制**：[Q03](#research-q03) 外部 API、浏览器资源和教学正确性应分别核对。

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
  - [Q01 · 用户能交付什么？](#detail-section-11)
  - [Q02 · 接入如何实现？](#detail-section-12)
  - [Q03 · 网络和权限有何边界？](#detail-section-13)
  - [Q04 · 采用和退出的成本是什么？](#detail-section-14)
  - [Q05 · 什么结果否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：教师需在 DSH 会话解释抽象概念并让学生操作。

文字讲解后另写演示页面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文字讲解后另写演示页面。 | 可直接比较 | 保留人工步骤 |
| DSH OpenMAIC | 提供课堂链接和会话中可操作的教学材料。 | 外部 API、浏览器资源和教学正确性应分别核对。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 课堂走异步 API，内联片段通过展示元数据在 iframe 渲染。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 教师需在 DSH 会话解释抽象概念并让学生操作。 | 保留原流程 |
| 试验 | 课堂走异步 API，内联片段通过展示元数据在 iframe 渲染。 | 观察固定版本 |
| 复核 | 先试无敏卡片，再用模拟服务验证课堂提交。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在一节小课里交付可操作的模拟器 | 小型交互演示能减少备课切换并维持可复核性。 | 先试无敏卡片，再用模拟服务验证课堂提交。 |

> **思考**：[Q03](#research-q03) 外部 API、浏览器资源和教学正确性应分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供课堂链接和会话中可操作的教学材料。

工具、持久展示和浏览器 sandbox 有可见接缝。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 外部 API、浏览器资源和教学正确性应分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先试无敏卡片，再用模拟服务验证课堂提交。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在一节小课里交付可操作的模拟器。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/tool.ts、src/index.ts、src/client/WidgetCard.tsx、src/client/shell.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在一节小课里交付可操作的模拟器。未执行目标代码或实际宿主验证。
- 下一步：保留运行截图、计算期望和操作轨迹。

**分析版本**

- **仓库**：[THU-MAIC/dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic)
- **版本号**：0.4.0（[固定提交 09c1693](https://github.com/THU-MAIC/dsh-openmaic/tree/09c1693cfe83224db89fdd4abd245ac9174d3a05)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 小型交互演示能减少备课切换并维持可复核性。

保留运行截图、计算期望和操作轨迹。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2186 | — | — | 9904 |
| .js | source | 2 | 85830 | 78135 | 7895 | — |
| .ts | source | 14 | 1357 | 949 | 322 | — |
| .tsx | source | 5 | 564 | 431 | 83 | — |
| .ts | test | 5 | 464 | 391 | 30 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/THU-MAIC/dsh-openmaic/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/THU-MAIC/dsh-openmaic/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/THU-MAIC/dsh-openmaic/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在一节小课里交付可操作的模拟器

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户能交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

教师可让同一会话生成一个可操作模拟器，或提交课堂要求获得外部课堂链接。对比文字讲解与手写 HTML，验收是参数确实改变图形结果、卡片重开后可回放、完整课堂链接能打开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-12](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/README.md#L5-L12)

作者列出四种工具及教学技能

```text
`dsh-openmaic` is a DeepSeek Harness plugin that registers four tools and a
Socratic teaching skill:

- `openmaic_generate`: tell your agent "make me a lesson about X", and the plugin submits the requirement to [open.maic.chat](https://open.maic.chat/), waits for the async generation job, and returns a playable classroom link.
- `openmaic_slide`: the agent writes one OpenMAIC slide (PPTist-style Slide JSON) and the plugin renders it with OpenMAIC's official renderer (text, shapes, images, tables, charts, formulas, code).
- `openmaic_widget`: the agent writes an OpenMAIC-style interactive widget (simulation, game, or code) per the bundled contract; the code streams as it writes, then renders inline as a sandboxed card.
- `openmaic_render`: the agent writes an inline HTML teaching fragment (concept card, quiz, walkthrough) and the plugin renders it as a sandboxed card right in the conversation.
- `openmaic-teach` skill: turns a session into a Socratic OpenMAIC lesson, teaching by guided questioning and pulling in slides, widgets, and cards as aids.
```

**依据 2 · 源码核查**：[src/tool.ts:58-77](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/tool.ts#L58-L77)

将片段保留在展示元数据中供回放

<details>
<summary>查看原文（20行）</summary>

```text
      // Model-facing text stays a one-line confirmation; the fragment is the
      // model's own argument and re-echoing it would double its context cost.
      render: (_args, value) => [{
        type: 'text',
        text: `Rendered "${value.title}" inline (${value.sizeBytes} bytes). The user sees the interactive card in the conversation.`,
      }],
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: 'openmaic-render',
        fragment: value.fragment,
        title: value.title,
      }),
    },
    // Pure validation; concurrent sibling calls cannot conflict.
    isConcurrencySafe: () => true,
    async execute(args) {
      const sizeBytes = validateFragment(args.fragment, MAX_FRAGMENT_BYTES)
      const title = args.title?.trim() || 'OpenMAIC 课堂'
      return { title, sizeBytes, fragment: args.fragment }
```

</details>

#### 缺口

- 原理正确性需教学复核。
  **影响**：可在解释和动手操作间直接切换。
  **进一步探讨**：从虚构抛体运动参数开始。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 接入如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

完整课堂工具提交需求并等待异步任务；小卡片走 HTML 参数校验、展示元数据、浏览器沙箱，结构化 slide 与 widget 有独立工具。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:114-140](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/index.ts#L114-L140)

课堂等待限额和提交字段

<details>
<summary>查看原文（27行）</summary>

```text
    output: TEXT_OUTPUT,
    timeoutMs: resolved.maxWaitMs,
    isConcurrencySafe: () => true,
    execute: async (args) => {
      const input = args as {
        requirement?: unknown
        language?: unknown
        enableWebSearch?: unknown
        enableImageGeneration?: unknown
        enableVideoGeneration?: unknown
        enableTTS?: unknown
        agentMode?: unknown
      }
      const requirement = typeof input.requirement === 'string' ? input.requirement : ''
      if (requirement === '') throw new Error('openmaic_generate: requirement is required')
      const outcome = await generateClassroom({
        baseUrl: resolved.baseUrl,
        accessCode: resolved.accessCode,
        pollIntervalMs: resolved.pollIntervalMs,
        maxWaitMs: resolved.maxWaitMs,
        requirement,
        language: typeof input.language === 'string' ? input.language : undefined,
        enableWebSearch: typeof input.enableWebSearch === 'boolean' ? input.enableWebSearch : undefined,
        enableImageGeneration: typeof input.enableImageGeneration === 'boolean' ? input.enableImageGeneration : undefined,
        enableVideoGeneration: typeof input.enableVideoGeneration === 'boolean' ? input.enableVideoGeneration : undefined,
        enableTTS: typeof input.enableTTS === 'boolean' ? input.enableTTS : undefined,
        agentMode: typeof input.agentMode === 'string' ? input.agentMode : undefined,
```

</details>

**依据 2 · 源码核查**：[src/tool.ts:64-77](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/tool.ts#L64-L77)

片段校验和保留

<details>
<summary>查看原文（14行）</summary>

```text
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: 'openmaic-render',
        fragment: value.fragment,
        title: value.title,
      }),
    },
    // Pure validation; concurrent sibling calls cannot conflict.
    isConcurrencySafe: () => true,
    async execute(args) {
      const sizeBytes = validateFragment(args.fragment, MAX_FRAGMENT_BYTES)
      const title = args.title?.trim() || 'OpenMAIC 课堂'
      return { title, sizeBytes, fragment: args.fragment }
```

</details>

**依据 3 · 源码核查**：[src/client/WidgetCard.tsx:102-109](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/client/WidgetCard.tsx#L102-L109)

Widget 采用脚本沙箱

```text

function WidgetFrame({ meta, callId, height }: { meta: WidgetMeta; callId: string; height?: number | string }) {
  const doc = buildWidgetDoc(meta.html, callId)
  return (
    <iframe
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      title={meta.title}
```

#### 缺口

- 代码合同和生成质量均影响渲染。
  **影响**：课堂与本地卡片故障可分开定位。
  **进一步探讨**：分别验证 URL 和卡片。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网络和权限有何边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

课堂默认外部 API，需求和可选设置由工具转发。卡片 CSP 禁止普通网络 connect，允许有限来源装载脚本、图片等资源，不能据此判定整个卡片离线。超时只说明客户端停止等待。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:40-50](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/index.ts#L40-L50)

外部服务和轮询配置

<details>
<summary>查看原文（11行）</summary>

```text
const DEFAULT_BASE_URL = 'https://open.maic.chat'

export const Config: z<Config> = z.object({
  baseUrl: z.string().default(DEFAULT_BASE_URL)
    .description('OpenMAIC API base URL. Point it at http://localhost:3000 to develop against a local OpenMAIC instance.'),
  accessCode: z.string().role('secret').default('')
    .description('Invite code for open.maic.chat. Access codes are not enforced online yet, so leave it empty; fill it in once they are enabled.'),
  pollIntervalMs: z.number().step(1).min(1_000).default(5_000)
    .description('Polling interval in milliseconds. Classroom generation is slow, so 60000 is friendlier than the default.'),
  maxWaitMs: z.number().step(1).min(1_000).default(600_000)
    .description('How long to poll one job before giving up, in milliseconds (default 10 minutes).'),
```

</details>

**依据 2 · 源码核查**：[src/index.ts:127-140](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/index.ts#L127-L140)

课堂提交需求

<details>
<summary>查看原文（14行）</summary>

```text
      const requirement = typeof input.requirement === 'string' ? input.requirement : ''
      if (requirement === '') throw new Error('openmaic_generate: requirement is required')
      const outcome = await generateClassroom({
        baseUrl: resolved.baseUrl,
        accessCode: resolved.accessCode,
        pollIntervalMs: resolved.pollIntervalMs,
        maxWaitMs: resolved.maxWaitMs,
        requirement,
        language: typeof input.language === 'string' ? input.language : undefined,
        enableWebSearch: typeof input.enableWebSearch === 'boolean' ? input.enableWebSearch : undefined,
        enableImageGeneration: typeof input.enableImageGeneration === 'boolean' ? input.enableImageGeneration : undefined,
        enableVideoGeneration: typeof input.enableVideoGeneration === 'boolean' ? input.enableVideoGeneration : undefined,
        enableTTS: typeof input.enableTTS === 'boolean' ? input.enableTTS : undefined,
        agentMode: typeof input.agentMode === 'string' ? input.agentMode : undefined,
```

</details>

**依据 3 · 源码核查**：[src/client/shell.ts:25-44](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/client/shell.ts#L25-L44)

资源和连接的限制不同

<details>
<summary>查看原文（20行）</summary>

```text
  'https://unpkg.com',
] as const

const RESOURCE_SOURCES = ['blob:', 'data:', ...RESOURCE_ORIGINS].join(' ')

/** The frame document's Content-Security-Policy. */
export const FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  'connect-src blob: data:',
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')
```

</details>

#### 缺口

- 远端任务和浏览器静态资源可能各自产生网络访问。
  **影响**：需要分别验证隐私与退出。
  **进一步探讨**：模拟远端超时和 CDN 阻断。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出的成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者提供带编译产物的 Git 安装，固定包先验证 Web。首次成本含模型和教师备课，持续成本含课堂等待、外部服务与 CDN、回放维护。退出前保存材料及所需链接，移除 bundle 后验证旧记录降级和远端课堂状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-43](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/README.md#L36-L43)

作者说明 Git 安装和重启

````text
## Install

```sh
dsh plugin --profile web add git+https://github.com/THU-MAIC/dsh-openmaic.git
```

Then restart `dsh web` and refresh. The plugin ships its compiled `lib/`, so a
git install needs no build step.
````

**依据 2 · 源码核查**：[src/tool.ts:84-91](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/tool.ts#L84-L91)

展示元数据缺失时回退通用结果

```text
    // The completed title derives from persisted meta, not args, so replay of
    // a defaulted title still shows the resolved one. A malformed or absent
    // meta declines to the generic fallback.
    presentResult(_args, result) {
      if (result.isError) return undefined
      const meta = openmaicMetaFrom(result.meta)
      if (meta === undefined) return undefined
      return { card: 'generic', title: `OpenMAIC · ${meta.title}` }
```

**依据 3 · 源码核查**：[src/index.ts:40-50](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/index.ts#L40-L50)

等待和配置成本可调

<details>
<summary>查看原文（11行）</summary>

```text
const DEFAULT_BASE_URL = 'https://open.maic.chat'

export const Config: z<Config> = z.object({
  baseUrl: z.string().default(DEFAULT_BASE_URL)
    .description('OpenMAIC API base URL. Point it at http://localhost:3000 to develop against a local OpenMAIC instance.'),
  accessCode: z.string().role('secret').default('')
    .description('Invite code for open.maic.chat. Access codes are not enforced online yet, so leave it empty; fill it in once they are enabled.'),
  pollIntervalMs: z.number().step(1).min(1_000).default(5_000)
    .description('Polling interval in milliseconds. Classroom generation is slow, so 60000 is friendlier than the default.'),
  maxWaitMs: z.number().step(1).min(1_000).default(600_000)
    .description('How long to poll one job before giving up, in milliseconds (default 10 minutes).'),
```

</details>

#### 缺口

- 服务价格、可用性与链接留存未知。
  **影响**：退出不等于删除远端课堂。
  **进一步探讨**：使用模拟服务记录提交和取消。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果否定采用？

**研究主题**：新假设与验证

#### 完整回答

对照纯文字、内联模拟器、远程课堂，用同一教学目标记录答案正确性、交互可达性、备课和等待。增加重开、缺 CDN 和超时；若交互结果不正确、回放不可用，或用时无改善，则当前方案不满足对应目标。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:58-77](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/tool.ts#L58-L77)

持久展示可独立验收

<details>
<summary>查看原文（20行）</summary>

```text
      // Model-facing text stays a one-line confirmation; the fragment is the
      // model's own argument and re-echoing it would double its context cost.
      render: (_args, value) => [{
        type: 'text',
        text: `Rendered "${value.title}" inline (${value.sizeBytes} bytes). The user sees the interactive card in the conversation.`,
      }],
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: 'openmaic-render',
        fragment: value.fragment,
        title: value.title,
      }),
    },
    // Pure validation; concurrent sibling calls cannot conflict.
    isConcurrencySafe: () => true,
    async execute(args) {
      const sizeBytes = validateFragment(args.fragment, MAX_FRAGMENT_BYTES)
      const title = args.title?.trim() || 'OpenMAIC 课堂'
      return { title, sizeBytes, fragment: args.fragment }
```

</details>

**依据 2 · 源码核查**：[src/client/shell.ts:28-44](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/src/client/shell.ts#L28-L44)

可模拟外部资源被拒绝

<details>
<summary>查看原文（17行）</summary>

```text
const RESOURCE_SOURCES = ['blob:', 'data:', ...RESOURCE_ORIGINS].join(' ')

/** The frame document's Content-Security-Policy. */
export const FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  'connect-src blob: data:',
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')
```

</details>

**依据 3 · 作者声明**：[README.md:26-34](https://github.com/THU-MAIC/dsh-openmaic/blob/09c1693cfe83224db89fdd4abd245ac9174d3a05/README.md#L26-L34)

有模拟器用例

````text
Interactive widget:

```
用户: 做一个抛体运动模拟器
模型 → 按 openmaic-widget 模板写完整 HTML（流式输出）
     → openmaic_widget(html="<!doctype html>…", widgetType="simulation", title="抛体运动")
     ← "Rendered the simulation widget …"
     对话里就地出现一个可交互的 OpenMAIC 模拟器
```
````

#### 缺口

- 尚无独立教学任务验证。
  **影响**：区分界面演示和学习效果。
  **进一步探讨**：保留运行截图、计算期望和操作轨迹。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
