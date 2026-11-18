# dsh-vision

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[72978aa](https://github.com/william-jin-cmu/dsh-vision/tree/72978aa176df8e01a685bf270a1b1d016660c492)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/william-jin-cmu/dsh-vision)
<!-- END META -->

> **功能**：在 DeepSeek Harness 注册 view_image，把图片与问题发给配置的视觉模型并返回文本。

> **亮点**：[Q01](#research-q01) 为文本 Agent 提供同任务的图片问答动作。它将问题与图像交给独立 VLM，省去用户手工搬运，仍由用户核对关键数字和文字。

> **主要限制**：[Q03](#research-q03) Host 按传入路径读取，工具没有独立工作区边界，URL 与 data URL 绕过本地大小门。使用自定义 VLM 地址时，环境 key 也可能被带上 [Q04](#research-q04)。

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
  - [Q01 · 何种图片问答适合让文本 Agent 调用此工具，和手动把图片交给视觉模型相比增加什么？](#detail-section-11)
  - [Q02 · 固定版本如何挂载到 DSH，图像问题怎样返回到主对话？](#detail-section-12)
  - [Q03 · 本地文件、URL 与 data URL 都经过同样的路径限制和大小检查吗？](#detail-section-13)
  - [Q04 · 怎样决定发给哪个端点、是否带 key，以及失败是否会重试？](#detail-section-14)
  - [Q05 · 当前证据支持实际安装或生产截图使用吗，何时应回到原方法？](#detail-section-15)
  - [Q06 · 把工具可读路径和后端密钥绑定到用户授权，能否保留公开截图能力并减少误出站？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：正在用只支持文本的 DSH Agent 排查公开截图的人，可以问某行报错并对照原图复核工具给出的文字。

人工另开支持图片的视觉模型可直接上传并校对，再把答案交回 DSH。具有原生视觉输入的宿主也省去此适配。桥接让纯文本 Agent 自行取得一段文字证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| view_image | 向视觉模型询问一张图，返回可供当前对话引用的文字 | 确认路径、模型、数据和密钥授权 |
| 同地址模型退路 | 部分错误时依次尝试其他模型 | 仅符合重试条件，不能保证成功或零费用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- |
| 匹配的 DSH tools、systemPrompt 及 Schemastery | Host 加载所需 | 注册工具和提示段 | 抽查实际符号和装载路径 |
| 明确获准的 VLM 及目标配置 | 图片问答所需 | 处理并返回文本 | 配置或协议不匹配时停止 |
| Host 可读的合成图片或已授权图像 URL | 输入所需 | 构造请求图片 | 前置核对读权限和端点 |
| 对应的 key | 外部调用按配置所需 | 访问 VLM | 核认环境 key 与 endpoint 一致 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 固定仓库与 Host 版本，明确文件和服务边界 | 只在隔离环境加载 |
| 查询 | 用合成图提出一个具体问题 | 返回可在原图中验证的文本 |
| 结束 | 复核所用端点和已提交数据 | 不符时停用并回到原图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、视觉服务或本地算力 | 选定端点、依赖及权限 | 未测设置费用与耗时 |
| 持续 | 图片、外部请求、可能的多次尝试 | 复核不同图像结果 | 账单及合格答案的成本未知 |
| 失败 | 已启动请求及图像可能耗资源 | 检查模型、授权和原图 | 终止或重复调用结果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文本 Agent 看图 | 工具转发并获取文本 | 视觉准确率及当前模型支持 |
| 免手工转写 | 结果直接回工具 | 用户校对后的实际时间 |
| 失败治理 | 选定错误可尝试同地址下一模型 | 真实成功率、费用和 Host 总超时 |

> **思考**：[Q03](#research-q03) Host 按传入路径读取，工具没有独立工作区边界，URL 与 data URL 绕过本地大小门。使用自定义 VLM 地址时，环境 key 也可能被带上 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 为文本 Agent 提供同任务的图片问答动作。它将问题与图像交给独立 VLM，省去用户手工搬运，仍由用户核对关键数字和文字。

[Q04](#research-q04) 取消透传给 fetch，模型顺序退路和单次请求超时明确。路径及请求体约束不一致，错误有有限遮盖，保护范围需要按真实 Host 和出站策略另核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Host 按传入路径读取，工具没有独立工作区边界，URL 与 data URL 绕过本地大小门。使用自定义 VLM 地址时，环境 key 也可能被带上 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先观察本固定版本的路径及请求出口，在获得明确授权后只用合成图核对。无法确认图的来源和出站密钥时，按 [Q03](#research-q03) 停止并直接查看原图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查显式挂载、发布源码入口、图像传给视觉端点、结果解析与错误边界。固定版本兼容和真实 VLM 未验收，建议观察。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/vlm.ts、package.json、dsh.plugin.json、lib/index.js、lib/vlm.js、tests/plugin.spec.ts、scripts/build.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 william-jin-cmu/dsh-vision 根与仓内 JS。未运行目标代码、VLM、浏览器或 DSH，未核验文档提及的其他仓库、供应商价格和可用性。
- 下一步：固定一个隔离 Host 与 mock VLM，给合成图问题、越界测试文件和长数据输入，核对实际 route、状态码、输出及 Host 取消。使用真实端点前先检查当前授权和容量。

**分析版本**

- **仓库**：[william-jin-cmu/dsh-vision](https://github.com/william-jin-cmu/dsh-vision)
- **版本号**：0.1.0（[固定提交 72978aa](https://github.com/william-jin-cmu/dsh-vision/tree/72978aa176df8e01a685bf270a1b1d016660c492)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 以授权附件句柄限制可读图像，并把专用密钥与出站端点绑定，可能保留公开截图问答且减少非预期请求。

固定一个隔离 Host 与 mock VLM，给合成图问题、越界测试文件和长数据输入，核对实际 route、状态码、输出及 Host 取消。使用真实端点前先检查当前授权和容量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 229 | 203 | 28 | — |
| .md | source | 1 | 112 | — | — | 1236 |
| .ts | source | 2 | 263 | 216 | 29 | — |
| .ts | test | 2 | 280 | 235 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/william-jin-cmu/dsh-vision/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/william-jin-cmu/dsh-vision/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/william-jin-cmu/dsh-vision/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：只接收文本的 DSH Agent 如何针对单图提问，哪部分路径、出站、授权与错误边界需要独立复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种图片问答适合让文本 Agent 调用此工具，和手动把图片交给视觉模型相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经在 DSH 用只收文本的模型排查公开界面的人，可以把一张事先脱敏的错误截图交给明确的工具路径，并请 Agent 对某行报错提问。该工具在同一对话中发一条带图问题，返回可供主模型引用的文本；系统提示建议明确提问而不是猜图。相对手动另开视觉模型、复制结果，它把这一步放回同一个工具回合，让主模型可据文字做下一步解释。真正 OCR、布局及计数都由外部或本地另一个 VLM 完成，工具不新增识别算法，也不保证识别准确。目标应是有可对照原图的答案，涉及字符、数字、证据时需人工核对；宿主本身已可用视觉输入时，桥接收益可能降低。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-16](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/README.md#L3-L16)

作者的截图报错和工具问题示例。

<details>
<summary>查看原文（14行）</summary>

````text
给纯文本的 DeepSeek 加上眼睛。Vision for text-only DeepSeek.

deepseek-v4 看不了图。本插件注册一个 `view_image` 工具：模型带着问题调用它（OCR、数数、读图表、看 UI 布局……任意视觉问题），插件把图片和问题转发给任意 **OpenAI 兼容的 VLM 端点**，答案以文本返回。装上之后，dsh 的所有入口（web、TUI、远程通道）同时获得视觉。

```
用户: 看下 ~/Desktop/error.png 是什么报错
模型 → view_image(source="/Users/me/Desktop/error.png", question="这个报错的完整文本是什么？")
     ← "TypeError: Cannot read properties of undefined (reading 'map') at …"
模型: 这是一个 … 建议 …
```

## 真实效果（dsh web，DeepSeek-V4-Flash）

对纯文本的 deepseek-v4 说"看看 images.jpeg 在我的桌面上的"——模型自己定位文件、带着问题调 `view_image`（14.5s），拿到的描述精确到樱花图案、摄像头开孔和底部的 BURGA 品牌标识：
````

</details>

**依据 2 · 源码核查**：[src/index.ts:52-58](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L52-L58)

提供视觉工具提示和文字渲染。

```text
const PROMPT_TEXT = `## Vision (view_image)
The chat model itself cannot see images, but the view_image tool can. Whenever an image matters — a screenshot path the user mentions, an image URL, a chart, a UI mockup — call view_image instead of guessing or refusing. Ask it a specific question (extract text, count objects, read a chart, describe the layout); it answers arbitrary questions, not just captions. Prefer one focused call per thing you need to know; ask a follow-up call rather than one vague question.`

const TEXT_OUTPUT = {
  schema: { type: 'string' as const },
  render: (_args: unknown, value: unknown) => [{ type: 'text' as const, text: String(value) }],
}
```

**依据 3 · 源码核查**：[src/index.ts:83-111](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L83-L111)

实际注册输入并返回同包调用产生的文本。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'view_image',
    description: 'Look at an image and answer a question about it (OCR, counting, chart reading, layout, arbitrary visual questions). Accepts an absolute local file path, an http(s) URL, or a data: URL.',
    parameters: {
      source: {
        type: 'string',
        required: true,
        description: 'The image: absolute local file path, http(s) URL, or data: URL',
      },
      question: {
        type: 'string',
        description: 'What to find out about the image. Be specific. Default: a thorough general description including any visible text.',
      },
    },
    output: TEXT_OUTPUT,
    timeoutMs: resolved.timeoutMs,
    isConcurrencySafe: () => true,
    execute: async (args, exec) => {
      const input = args as { source?: unknown; question?: unknown }
      const source = typeof input.source === 'string' ? input.source : ''
      if (source === '') throw new Error('view_image: source is required')
      const question = typeof input.question === 'string' && input.question !== ''
        ? input.question
        : 'Describe this image thoroughly. Include any visible text verbatim, the overall layout, and notable details.'
      const apiKey = resolveApiKey()
      let lastError: unknown
      for (const model of [resolved.model, ...fallbackModels]) {
        try {
          return await visionChat({ ...resolved, model, apiKey, source, question, signal: exec.signal })
```

</details>

**依据 4 · 源码核查**：[src/vlm.ts:88-99](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L88-L99)

图像与单条问题同发给 VLM。

<details>
<summary>查看原文（12行）</summary>

```text
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: request.question },
          ],
        }],
      }),
      signal: AbortSignal.any(signals),
```

</details>

#### 缺口

- 真实 OCR 或界面问答准确率未独立检查
  **影响**：不能把源码结果路由当识别质量提升
  **进一步探讨**：用同样合成截图对照人工视觉工具与同会话工具，记录返回精确性和耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定版本如何挂载到 DSH，图像问题怎样返回到主对话？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

根包和 dsh.plugin.json 均指向 lib/index.js，README 给显式 Cordis insert 的路径示例，未提供当前常见自动 bundle patch。它依赖 Host tools 与 systemPrompt，并向二者分别注册工具和提示段，加载后不需要另一个 Web 客户端。已编译入口实际把 path、question 与取消信号交给随包 VLM handler。工具取已选模型，构造 OpenAI 形态的 chat/completions 请求；识别非空文本或拼接文本 parts，去掉 think 块后返回，未得到可用内容则以错误结束。能挂载并接收 Host 事件是独立前提，当前清单的旧版本范围和 README 入口广泛性的声明不代表各 Host 实际满足服务。安装文档用不同 Git 地址，故本轮不把对应仓库或宿主集成宣称归入固定版本验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-25](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/package.json#L5-L25)

私有根包、Host 入口和动态宿主版本条件。

<details>
<summary>查看原文（21行）</summary>

```text
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./package.json": "./package.json"
  },
  "files": ["lib"],
  "license": "BSD-3-Clause",
  "engines": { "dsh": ">=0.0.1" },
  "dshx": {
    "contributes": { "tools": ["view_image"], "skills": [] }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-system-prompt": "^0.0.1",
    "@deepseek-ai/dsh-tools": "^0.0.1",
    "@deepseek-ai/cordis": "^4.0.1-rc.1"
  },
  "dependencies": {
    "schemastery": "^3.18.0"
```

</details>

**依据 2 · 源码核查**：[dsh.plugin.json:1-11](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/dsh.plugin.json#L1-L11)

声明指向同一入口。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "id": "@dsh-external/dsh-vision",
  "version": "0.1.0",
  "main": "./lib/index.js",
  "description": "Vision for text-only DeepSeek: a view_image tool that answers questions about images via any OpenAI-compatible VLM endpoint",
  "engines": { "dsh": ">=0.0.1" },
  "contributes": {
    "tools": ["view_image"],
    "skills": []
  }
}
```

</details>

**依据 3 · 作者声明**：[README.md:58-76](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/README.md#L58-L76)

原生路径挂载与作者示例。

<details>
<summary>查看原文（19行）</summary>

````text
**原生挂载（默认）**——dsh 主程序自带 `~/.dsh/config.yaml` 个人覆盖层，三步完成，不依赖任何第三方管理器：

```sh
# 1) 取码（放哪都行）
git clone https://github.com/dsh-external/dsh-vision ~/dsh-plugins/dsh-vision
# 2) 链接宿主依赖（pnpm 布局下必需，背景见 marisa#2）
CHECKOUT="$(cd "$(dirname "$(readlink -f "$(command -v dsh)")")/../../.." && pwd)"
mkdir -p ~/dsh-plugins/dsh-vision/node_modules/@deepseek-ai
ln -sfn "$CHECKOUT/packages/core/tools"  ~/dsh-plugins/dsh-vision/node_modules/@deepseek-ai/dsh-tools
ln -sfn "$CHECKOUT/vendor/schemastery"   ~/dsh-plugins/dsh-vision/node_modules/schemastery
# 3) 挂载并重启 dsh
cat >> ~/.dsh/config.yaml <<EOF
- insert:
    - id: dsh-vision
      name: '$HOME/dsh-plugins/dsh-vision/lib/index.js'
EOF
```

用 [DSH Companion](https://github.com/dsh-external/dsh-companion) 的话零安装——已随应用自带。
````

</details>

**依据 4 · 源码核查**：[lib/index.js:60-105](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/lib/index.js#L60-L105)

已提交产物的 Host 注册和调用。

<details>
<summary>查看原文（46行）</summary>

```text
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'view_image',
        description: 'Look at an image and answer a question about it (OCR, counting, chart reading, layout, arbitrary visual questions). Accepts an absolute local file path, an http(s) URL, or a data: URL.',
        parameters: {
            source: {
                type: 'string',
                required: true,
                description: 'The image: absolute local file path, http(s) URL, or data: URL',
            },
            question: {
                type: 'string',
                description: 'What to find out about the image. Be specific. Default: a thorough general description including any visible text.',
            },
        },
        output: TEXT_OUTPUT,
        timeoutMs: resolved.timeoutMs,
        isConcurrencySafe: () => true,
        execute: async (args, exec) => {
            const input = args;
            const source = typeof input.source === 'string' ? input.source : '';
            if (source === '')
                throw new Error('view_image: source is required');
            const question = typeof input.question === 'string' && input.question !== ''
                ? input.question
                : 'Describe this image thoroughly. Include any visible text verbatim, the overall layout, and notable details.';
            const apiKey = resolveApiKey();
            let lastError;
            for (const model of [resolved.model, ...fallbackModels]) {
                try {
                    return await visionChat({ ...resolved, model, apiKey, source, question, signal: exec.signal });
                }
                catch (error) {
                    lastError = error;
                    if (!(error instanceof Error) || !RETRIABLE.test(error.message))
                        throw error;
                }
            }
            throw lastError;
        },
    })), 'dsh-vision.tool');
    ctx.effect(() => ctx.systemPrompt.section({
        name: 'tool:dsh-vision',
        order: 116,
        text: PROMPT_TEXT,
    }), 'dsh-vision.prompt');
}
```

</details>

**依据 5 · 源码核查**：[src/vlm.ts:55-69](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L55-L69)

第一条返回以及可用文本 parts。

<details>
<summary>查看原文（15行）</summary>

```text
/** Pull assistant text out of an OpenAI-compatible response; content may be a string or parts. */
function extractText(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null) return undefined
  const choices = (payload as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return undefined
  const message = (choices[0] as { message?: { content?: unknown } }).message
  const content = message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const parts = content
      .map(part => (typeof part === 'object' && part !== null && typeof (part as { text?: unknown }).text === 'string') ? (part as { text: string }).text : '')
      .filter(text => text !== '')
    if (parts.length > 0) return parts.join('\n')
  }
  return undefined
```

</details>

**依据 6 · 源码核查**：[src/vlm.ts:110-136](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L110-L136)

异常 JSON、缺文本及 think 剥离。

<details>
<summary>查看原文（27行）</summary>

```text
  let payload: unknown
  try {
    payload = JSON.parse(body)
  } catch {
    throw new Error(redact(`view_image: ${url} returned non-JSON body: ${body.slice(0, 200)}`))
  }
  const text = extractText(payload)
  if (text === undefined) {
    throw new Error(redact(`view_image: no assistant text in response: ${body.slice(0, 300)}`))
  }
  const cleaned = stripThink(text)
  if (cleaned === '') {
    throw new Error('view_image: model returned only reasoning and no answer (try raising maxTokens)')
  }
  return cleaned
}

/**
 * Thinking-mode VLMs (e.g. glm-4.1v-thinking-flash) inline their reasoning as
 * <think>…</think> in the content. Strip it; a response that is ONLY an
 * unterminated think block (reasoning ate the token budget) becomes empty.
 */
function stripThink(text: string): string {
  const closed = text.replace(/<think>[\s\S]*?<\/think>/g, '')
  if (closed !== text) return closed.trim()
  if (/^\s*<think>/.test(text)) return ''
  return text.trim()
```

</details>

#### 缺口

- 现有 DSH Host 及第三方装载器尚未验证
  **影响**：不将旧式显式接线升级为当前普适
  **进一步探讨**：用固定 Host 的隔离配置检查 register/unregister 和合成返回

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地文件、URL 与 data URL 都经过同样的路径限制和大小检查吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本地文件先取用户参数的后缀映射 MIME，再 stat 比较 size，随后整文件读入编码为 data URL。工具说明说绝对路径，但实现对文件分支没有 isAbsolute、真实路径和会话工作区校验，普通 Node stat/readFile 也会跟随符号链接，因此插件本身没有把可读路径缩到已授权图像目录。MIME 来自扩展名而非内容验证，检查大小发生在读取前。HTTP、HTTPS 和 data 输入直接返回，绕过本地的文件大小检查与格式识别；HTTP URL 被包入发给配置 VLM 的 image_url，是否及在哪里抓图由该上游决定，插件不自行验证 URL 来历。文件路径的读权限以上游 Host 进程为准，Host 是否另有限制未研究。处理公开或合成截图必须事先核对目标与实际数据路径；若用户只给附件 ID 或不同设备相对路径，所阅代码没有对应解析器。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:83-106](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L83-L106)

工具接口仅接受 source 字符串和问题。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'view_image',
    description: 'Look at an image and answer a question about it (OCR, counting, chart reading, layout, arbitrary visual questions). Accepts an absolute local file path, an http(s) URL, or a data: URL.',
    parameters: {
      source: {
        type: 'string',
        required: true,
        description: 'The image: absolute local file path, http(s) URL, or data: URL',
      },
      question: {
        type: 'string',
        description: 'What to find out about the image. Be specific. Default: a thorough general description including any visible text.',
      },
    },
    output: TEXT_OUTPUT,
    timeoutMs: resolved.timeoutMs,
    isConcurrencySafe: () => true,
    execute: async (args, exec) => {
      const input = args as { source?: unknown; question?: unknown }
      const source = typeof input.source === 'string' ? input.source : ''
      if (source === '') throw new Error('view_image: source is required')
      const question = typeof input.question === 'string' && input.question !== ''
        ? input.question
        : 'Describe this image thoroughly. Include any visible text verbatim, the overall layout, and notable details.'
```

</details>

**依据 2 · 源码核查**：[src/vlm.ts:25-52](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L25-L52)

后缀、stat/readFile 与 URL 直接返回。

<details>
<summary>查看原文（28行）</summary>

```text
const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.heic': 'image/heic',
}

/** Resolve `source` to a URL the endpoint accepts: pass URLs through, base64 local files. */
export async function toImageUrl(source: string, maxImageBytes: number): Promise<string> {
  if (/^(https?|data):/.test(source)) return source
  const mime = MIME_BY_EXT[extname(source).toLowerCase()]
  if (mime === undefined) {
    const supported = Object.keys(MIME_BY_EXT).join(' ')
    throw new Error(`view_image: unsupported image extension in ${JSON.stringify(source)} (supported: ${supported}, or pass an http(s)/data: URL)`)
  }
  const info = await stat(source).catch(() => {
    throw new Error(`view_image: file not found: ${source}`)
  })
  if (info.size > maxImageBytes) {
    throw new Error(`view_image: image is ${info.size} bytes, over the ${maxImageBytes}-byte limit (raise maxImageBytes in the dsh-vision config)`)
  }
  const bytes = await readFile(source)
  return `data:${mime};base64,${bytes.toString('base64')}`
```

</details>

**依据 3 · 源码核查**：[lib/vlm.js:29-36](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/lib/vlm.js#L29-L36)

固定入口的本地读取路径。

```text
    const info = await stat(source).catch(() => {
        throw new Error(`view_image: file not found: ${source}`);
    });
    if (info.size > maxImageBytes) {
        throw new Error(`view_image: image is ${info.size} bytes, over the ${maxImageBytes}-byte limit (raise maxImageBytes in the dsh-vision config)`);
    }
    const bytes = await readFile(source);
    return `data:${mime};base64,${bytes.toString('base64')}`;
```

**依据 4 · 源码核查**：[src/vlm.ts:88-96](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L88-L96)

图像位置或 base64 真正进入请求。

```text
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: request.question },
          ],
```

#### 缺口

- Host 权限模型与上游如何解析 URL 未核实
  **影响**：不能推断已发生跨目录读取或远端取图
  **进一步探讨**：在隔离本机用模拟 provider 测试受限目录、符号链接、超长 data URL 和本地路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样决定发给哪个端点、是否带 key，以及失败是否会重试？

**研究主题**：缺陷与关键质疑、功能与机制、效果与总成本

#### 完整回答

配置指定 baseURL、模型及 fallback。每次工具调用优先取显式 key，否则按通用和供应商环境变量顺序取；本地地址只豁免无 key 时的报错，如果环境已有 key，仍会使用它。Endpoint 拼接 chat/completions，所阅逻辑未将 key 与出站地址配对，也没有在请求前要求 HTTPS，因此自定义端点时需要核对实际凭据与目标。错误消息清理当前 API key 的相同字符串，仍可能把上游响应前缀和路径信息带入错误。默认模型在默认端点且未配置非空 fallback 时，会按顺序尝试更早模型；触发依据是错误文本中的 429、404 或 5xx 模式，不是第二端点，空文本、鉴权和一般网络错误通常停止。每次尝试在完成图像构建后创建自己的网络超时并合并宿主取消；读本地文件没有信号，中间尝试也没有独立总预算，Host 级工具 timeout 是否强制整个调用需针对宿主确认。在首请求已消耗又失败时，顺序重试可能重复传同图并增加耗时，不能承诺一定有结果或固定费用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:60-80](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L60-L80)

默认链及 per-call key 选择，本地只豁免缺 key。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const resolved = {
    baseURL: config.baseURL ?? DEFAULT_BASE_URL,
    model: config.model ?? 'glm-4.6v-flash',
    maxTokens: config.maxTokens ?? 2048,
    timeoutMs: config.timeoutMs ?? 60_000,
    maxImageBytes: config.maxImageBytes ?? 10 * 1024 * 1024,
  }
  const fallbackModels = config.fallbackModels !== undefined && config.fallbackModels.length > 0
    ? config.fallbackModels
    : resolved.baseURL === DEFAULT_BASE_URL && resolved.model === 'glm-4.6v-flash' ? DEFAULT_FREE_FALLBACKS : []
  // Key is resolved per call, not at mount: the plugin loads fine without one
  // and the tool explains exactly where to put it. Local endpoints need none.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(resolved.baseURL)
  const resolveApiKey = (): string => {
    const key = config.apiKey !== undefined && config.apiKey !== '' ? config.apiKey
      : process.env.VISION_API_KEY ?? process.env.DSH_VISION_API_KEY ?? process.env.ZHIPUAI_API_KEY ?? process.env.DASHSCOPE_API_KEY ?? ''
    if (key === '' && !isLocal) {
      throw new Error('view_image: no API key. Set the dsh-vision apiKey config, or set VISION_API_KEY (in ~/.dsh/.env or exported; also honored: ZHIPUAI_API_KEY, DASHSCOPE_API_KEY — DSH_* names are rejected inside .env files, so the old DSH_VISION_API_KEY works only when exported). The default model glm-4.6v-flash is FREE — create a key in 1 minute at https://open.bigmodel.cn. Offline alternative: baseURL http://localhost:11434/v1 + an Ollama vision model, no key needed.')
    }
    return key
```

</details>

**依据 2 · 源码核查**：[src/index.ts:98-117](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L98-L117)

Host timeout 宣称、传入取消及按错误消息重试。

<details>
<summary>查看原文（20行）</summary>

```text
    timeoutMs: resolved.timeoutMs,
    isConcurrencySafe: () => true,
    execute: async (args, exec) => {
      const input = args as { source?: unknown; question?: unknown }
      const source = typeof input.source === 'string' ? input.source : ''
      if (source === '') throw new Error('view_image: source is required')
      const question = typeof input.question === 'string' && input.question !== ''
        ? input.question
        : 'Describe this image thoroughly. Include any visible text verbatim, the overall layout, and notable details.'
      const apiKey = resolveApiKey()
      let lastError: unknown
      for (const model of [resolved.model, ...fallbackModels]) {
        try {
          return await visionChat({ ...resolved, model, apiKey, source, question, signal: exec.signal })
        } catch (error) {
          lastError = error
          if (!(error instanceof Error) || !RETRIABLE.test(error.message)) throw error
        }
      }
      throw lastError
```

</details>

**依据 3 · 源码核查**：[src/vlm.ts:73-108](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L73-L108)

先做图片，再设取消，明确出站与错误体。

<details>
<summary>查看原文（36行）</summary>

```text
export async function visionChat(request: VisionRequest): Promise<string> {
  const doFetch = request.fetch ?? fetch
  const url = `${request.baseURL.replace(/\/$/, '')}/chat/completions`
  const imageUrl = await toImageUrl(request.source, request.maxImageBytes)
  const signals = [AbortSignal.timeout(request.timeoutMs), ...request.signal === undefined ? [] : [request.signal]]
  const redact = (text: string): string => request.apiKey === '' ? text : text.replaceAll(request.apiKey, '***')

  let response: Response
  try {
    response = await doFetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...request.apiKey === '' ? {} : { authorization: `Bearer ${request.apiKey}` },
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: request.question },
          ],
        }],
      }),
      signal: AbortSignal.any(signals),
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(redact(`view_image: request to ${url} failed: ${reason}`))
  }

  const body = await response.text()
  if (!response.ok) {
    throw new Error(redact(`view_image: ${url} returned ${response.status}: ${body.slice(0, 500)}`))
```

</details>

**依据 4 · 源码核查**：[src/index.ts:32-49](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L32-L49)

默认模型、错误正则与各参数约束。

<details>
<summary>查看原文（18行）</summary>

```text
const DEFAULT_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'
/** Zhipu's free tier gets congested (HTTP 429 code 1305); older free models still answer. */
const DEFAULT_FREE_FALLBACKS = ['glm-4.1v-thinking-flash', 'glm-4v-flash']
/** Errors worth trying the next model for: rate limit, missing model, server trouble. */
const RETRIABLE = /returned (?:429|404|5\d\d)/

export const Config: z<Config> = z.object({
  baseURL: z.string().default(DEFAULT_BASE_URL)
    .description('OpenAI-compatible endpoint base URL (…/chat/completions is appended)'),
  apiKey: z.string().role('secret').default('')
    .description('API key; falls back to $VISION_API_KEY (or exported $DSH_VISION_API_KEY), then $ZHIPUAI_API_KEY / $DASHSCOPE_API_KEY'),
  model: z.string().default('glm-4.6v-flash')
    .description('Vision model id at the endpoint, e.g. glm-4.6v-flash (free) / glm-4.6v / qwen3-vl-flash / qwen3.7-plus / qwen3-vl:4b'),
  fallbackModels: z.array(z.string()).default([])
    .description('Models tried in order when the primary returns 429/404/5xx; defaults to Zhipu free-tier chain when baseURL is the default'),
  maxTokens: z.number().step(1).min(1).max(32_768).default(2048),
  timeoutMs: z.number().step(1).min(1_000).max(300_000).default(60_000),
  maxImageBytes: z.number().step(1).min(1).default(10 * 1024 * 1024),
```

</details>

#### 缺口

- 实际失败账单、请求截止与 API 配额未验证
  **影响**：顺序尝试的总耗时和成本不能从单次设置推断
  **进一步探讨**：用 mock 返回鉴权、429、空文本与阻塞，测出站、payload 重复和 Host 截止

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前证据支持实际安装或生产截图使用吗，何时应回到原方法？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

适合已有 DSH 和已获授权 VLM 的开发者先观察固定版本的实际出站规则。README 的 4K 截图、时延和全入口兼容属于发布者的场景说明，没有同一固定提交的独立账号或多输入对照。单元/集成测试源确实搭起会话和工具服务并用注入 fetch，设计可复现但本轮没有执行。首次成本主要是匹配对应 Host 版本、拆清手工加载及目标地址配置、验证密钥，持续要承担视觉推理与重复图像数据，失败要回原图核对文本或切回原工具。可在明确获准的隔离 Host 与自管代理只用合成图先查是否调用当前目标；如看到不识别目标、未经授权路径、模型回答无法回溯原图或意外 key 发送，应停用并转人工查看图像。对真实业务截图，先完成数据流与权限验收再评价是否适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-45](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/README.md#L39-L45)

作者单例耗时与结果声明，范围有限。

```text
## 实测（2026-08-05，4K 屏幕截图问答，全链路真实调用）

| 模型                               | 结果                               | 延迟      | 备注                                             |
| ---------------------------------- | ---------------------------------- | --------- | ------------------------------------------------ |
| `qwen3-vl-flash`                   | ✅ 准确                            | **~2.9s** | 全场最快，百炼最便宜 VL 线——追求速度选它         |
| `qwen3-vl-plus`                    | ✅ 准确                            | ~3.4s     |                                                  |
| `glm-4.6v-flash`（**默认，免费**） | ✅ 准确                            | ~6.8s     | 高峰限流时自动走降级链                           |
```

**依据 2 · 作者声明**：[README.md:101-108](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/README.md#L101-L108)

作者描述测试与构建。

````text
## 开发

```sh
./scripts/build.sh                 # 用 dsh 检出的 tsc 编译 src/ → lib/（产物入库）
<dsh-checkout>/node_modules/.bin/vitest run --root .   # 17 个 spec：真实 Cordis 组合 + 注入 fetch
```

设计说明：桥接抽象与 Qwen 官方 [Qwen-MM-Plugins](https://github.com/QwenLM/Qwen-MM-Plugins) 的 `vision_chat` 一致（OpenAI 兼容 `/chat/completions` + `image_url`），但本插件是零依赖 TS、原生 cordis 形态，不引入 Python/uv/MCP。本地图片以 base64 data URL 内联；`exec.signal` 全程透传，取消即中断请求；错误信息自动脱敏 API key。
````

**依据 3 · 源码核查**：[tests/plugin.spec.ts:24-45](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/tests/plugin.spec.ts#L24-L45)

测试搭建 Host 工具执行入口。

<details>
<summary>查看原文（22行）</summary>

```text
async function setup(config: DshVision.Config = {}): Promise<Context> {
  const ctx = new Context()
  activeContexts.push(ctx)
  await ctx.plugin(SessionStore)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(DshVision, config)
  return ctx
}

async function callTool(ctx: Context, args: unknown): Promise<ToolExecutionResult> {
  const caller = ctx.sessions.create(SessionId(`caller-${++calls}`), { meta: { createdAt: 1, cwd: '/work' } })
  caller.append('turn/start', { turn: 1, trigger: { kind: 'message', source: { kind: 'user' } } })
  caller.append('user/message', createUserMessage({ content: [{ type: 'text', text: 'go' }], source: { kind: 'user' } }), { surfaceOp: 'append' })
  const agent = { id: caller.id, session: caller } as never
  return ctx.tools.execute({
    name: 'view_image',
    arguments: args,
    callId: CallId(`call-${++calls}`),
    signal: new AbortController().signal,
    agent,
  })
```

</details>

**依据 4 · 源码核查**：[tests/plugin.spec.ts:52-59](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/tests/plugin.spec.ts#L52-L59)

网络使用 stub。

```text
function stubFetchOk(answer: string): { bodies: unknown[]; headers: Array<Record<string, string>> } {
  const captured: { bodies: unknown[]; headers: Array<Record<string, string>> } = { bodies: [], headers: [] }
  vi.stubGlobal('fetch', async (_url: unknown, init?: RequestInit) => {
    captured.bodies.push(JSON.parse(String(init?.body)))
    captured.headers.push({ ...(init?.headers as Record<string, string> | undefined) })
    return new Response(JSON.stringify({ choices: [{ message: { content: answer } }] }), { status: 200 })
  })
  return captured
```

**依据 5 · 源码核查**：[scripts/build.sh:13-25](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/scripts/build.sh#L13-L25)

若自行构建需对应 DSH checkout 工具链。

<details>
<summary>查看原文（13行）</summary>

```text
if command -v dsh &>/dev/null; then
  DSH_BIN=$(readlink -f "$(command -v dsh)" 2>/dev/null || command -v dsh)
  CHECKOUT=$(cd "$(dirname "$DSH_BIN")/../../.." && pwd)
fi
if [ -z "$CHECKOUT" ] || [ ! -d "$CHECKOUT/packages" ]; then
  echo "build: cannot locate the dsh checkout (dsh not on PATH?)" >&2
  exit 1
fi

TSC="$CHECKOUT/node_modules/.bin/tsc"
if [ ! -x "$TSC" ]; then
  echo "build: tsc not found at $TSC" >&2
  exit 1
```

</details>

#### 缺口

- 当前宿主、本机数据隔离、真实服务价格均未检查
  **影响**：采用仍是观察，不推广到真实敏感截图
  **进一步探讨**：先用合成图确认宿主注册和出站路径，再核对授权的模型质量与计费

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 把工具可读路径和后端密钥绑定到用户授权，能否保留公开截图能力并减少误出站？

**研究主题**：新假设与验证

#### 完整回答

提出待验证设计。由宿主显式提供用户选中的附件或工作区授权句柄，读取时一次校验文件身份、真实大小和内容类型，按已获授权端点取专用 key。远程 URL 单独按上游取图边界验证，未经选择的不交给 VLM，错误输出只留分类和可追踪 ID。推导是固定代码对三种 source 的校验不同，key 读取与端点配对也独立；同一工具因此很难证明一条提问使用了正确的数据和账号。用合成公开图、越界路径、符号链接、超长 URL、错误 key 环境和模拟上游回放旧新流程，比对合格截图答复、未经授权 HTTP 次数、需人工确认回合和额外等待。若授权图仍失败很多或者越界请求照发，则推翻该范围内收益。不把这些改进视作插件已具备的安全属性。

#### 证据与依据

**依据 1 · 源码核查**：[src/vlm.ts:37-52](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L37-L52)

文件路径和原样 URL 的现有差异。

<details>
<summary>查看原文（16行）</summary>

```text
/** Resolve `source` to a URL the endpoint accepts: pass URLs through, base64 local files. */
export async function toImageUrl(source: string, maxImageBytes: number): Promise<string> {
  if (/^(https?|data):/.test(source)) return source
  const mime = MIME_BY_EXT[extname(source).toLowerCase()]
  if (mime === undefined) {
    const supported = Object.keys(MIME_BY_EXT).join(' ')
    throw new Error(`view_image: unsupported image extension in ${JSON.stringify(source)} (supported: ${supported}, or pass an http(s)/data: URL)`)
  }
  const info = await stat(source).catch(() => {
    throw new Error(`view_image: file not found: ${source}`)
  })
  if (info.size > maxImageBytes) {
    throw new Error(`view_image: image is ${info.size} bytes, over the ${maxImageBytes}-byte limit (raise maxImageBytes in the dsh-vision config)`)
  }
  const bytes = await readFile(source)
  return `data:${mime};base64,${bytes.toString('base64')}`
```

</details>

**依据 2 · 源码核查**：[src/index.ts:71-80](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/index.ts#L71-L80)

key 与目标选择分离。

<details>
<summary>查看原文（10行）</summary>

```text
  // Key is resolved per call, not at mount: the plugin loads fine without one
  // and the tool explains exactly where to put it. Local endpoints need none.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(resolved.baseURL)
  const resolveApiKey = (): string => {
    const key = config.apiKey !== undefined && config.apiKey !== '' ? config.apiKey
      : process.env.VISION_API_KEY ?? process.env.DSH_VISION_API_KEY ?? process.env.ZHIPUAI_API_KEY ?? process.env.DASHSCOPE_API_KEY ?? ''
    if (key === '' && !isLocal) {
      throw new Error('view_image: no API key. Set the dsh-vision apiKey config, or set VISION_API_KEY (in ~/.dsh/.env or exported; also honored: ZHIPUAI_API_KEY, DASHSCOPE_API_KEY — DSH_* names are rejected inside .env files, so the old DSH_VISION_API_KEY works only when exported). The default model glm-4.6v-flash is FREE — create a key in 1 minute at https://open.bigmodel.cn. Offline alternative: baseURL http://localhost:11434/v1 + an Ollama vision model, no key needed.')
    }
    return key
```

</details>

**依据 3 · 源码核查**：[src/vlm.ts:82-108](https://github.com/william-jin-cmu/dsh-vision/blob/72978aa176df8e01a685bf270a1b1d016660c492/src/vlm.ts#L82-L108)

实际发送及错误摘要。

<details>
<summary>查看原文（27行）</summary>

```text
    response = await doFetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...request.apiKey === '' ? {} : { authorization: `Bearer ${request.apiKey}` },
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: request.question },
          ],
        }],
      }),
      signal: AbortSignal.any(signals),
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(redact(`view_image: request to ${url} failed: ${reason}`))
  }

  const body = await response.text()
  if (!response.ok) {
    throw new Error(redact(`view_image: ${url} returned ${response.status}: ${body.slice(0, 500)}`))
```

</details>

#### 缺口

- 封装未实现，Host 能否提供稳定附件权限未知
  **影响**：只能提出设计和证伪方法
  **进一步探讨**：固定一个 Host 通过 mock 评估句柄、端点和回执约束

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
