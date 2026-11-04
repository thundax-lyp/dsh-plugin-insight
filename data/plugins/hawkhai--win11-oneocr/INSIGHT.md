# Windows 11 OneOCR

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f09ce22](https://github.com/hawkhai/win11-oneocr/tree/f09ce228b50fefee64dfbfb5ef879a1092a894fd)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH 提供本地图片的 OneOCR 文字与结构化结果。

> **亮点**：[Q01](#research-q01) 将已有 OCR CLI 接入 DSH，[Q02](#research-q02) 限制进程输出并清理临时结果；不是新识别模型。

> **主要限制**：[Q03](#research-q03) DLL 与模型未开源且识别文本交给宿主，不能仅凭 JS 证明完整离线与保密。

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
  - [Q01 · Windows 图片文字识别相对手动复制增加什么？](#detail-section-11)
  - [Q02 · 本地图像如何送入进程并返回 DSH？](#detail-section-12)
  - [Q03 · 闭源引擎、离线和隐私主张的边界是什么？](#detail-section-13)
  - [Q04 · 使用需要哪些系统、权限及恢复条件？](#detail-section-14)
  - [Q05 · 如何降低 OCR 文本被误当确定事实的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从 Windows 本地图片读取文字并交给 DSH 的用户。

手工查看图片或直接运行已有 OneOCR CLI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 图片识别 | 提取文本及布局 | Windows 和 OneOCR 依赖 |
| 输出限制 | 控制结果与进程时间 | 实际资源及终止未测 |
| 临时结果 | 将 JSON 交给 DSH | 模型内容后续流向取决于宿主 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| Windows 11 和 DSH | 工具运行需要 | 宿主与进程 | 无法使用 |
| OneOCR 可执行文件和 DLL/模型 | 识别需要 | 运行 OCR | 进程失败 |
| 可读图片及权限 | 每次调用 | 提供输入 | 读取失败 |
| 临时目录 | 输出需要 | 保存结果 | 调用失败 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户核查 Windows 与二进制来源 | 使用非敏感测试图 |
| 调用 | Agent 提供可读图片路径 | 工具校验平台和参数 |
| 解析 | 子进程写临时 JSON | 超时或错误则报告 |
| 复核 | 用户检查文字和坐标 | 未确认时返回原图 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | Windows、二进制和 DSH | 安装和许可核对 | 兼容未知 |
| 持续 | 本机计算与临时存储 | 复核图片和结果 | 精度耗时未知 |
| 故障 | 临时目录和进程 | 核对退出与残留 | 异常清理未测 |

| 效果 | 材料 | 未知 |
|---|---|---|
| DSH 工具 | 注册与执行源码 | 实际宿主兼容 |
| 本地进程 | shell=false 和文件路径 | DLL 网络行为 |
| 输出限制 | 大小与超时检查 | 系统资源与识别质量 |

> **思考**：[Q03](#research-q03) DLL 与模型未开源且识别文本交给宿主，不能仅凭 JS 证明完整离线与保密。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将已有 OCR CLI 接入 DSH，[Q02](#research-q02) 限制进程输出并清理临时结果；不是新识别模型。

[Q02](#research-q02) 有大小、超时和临时清理路径；[Q03](#research-q03) 二进制及绝对路径权限不由工具沙箱保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) DLL 与模型未开源且识别文本交给宿主，不能仅凭 JS 证明完整离线与保密。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用非敏感图片验证并核对 DLL 来源；无法接受宿主数据发送或未知二进制边界时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本静态核查，未运行 Windows 二进制、DSH 或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH 入口、进程边界、包声明和 README；DLL、模型、发布包一致性及宿主数据路径未审计。
- 下一步：隔离 Windows 测试宿主调用、文件权限、二进制来源、网络和异常清理；本轮未执行。

**分析版本**

- **仓库**：[hawkhai/win11-oneocr](https://github.com/hawkhai/win11-oneocr)
- **版本号**：0.1.1（[固定提交 f09ce22](https://github.com/hawkhai/win11-oneocr/tree/f09ce228b50fefee64dfbfb5ef879a1092a894fd)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将低置信词引向人工复核，需用标注样本验证。

隔离 Windows 测试宿主调用、文件权限、二进制来源、网络和异常清理；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 191 | — | — | 813 |
| .js | source | 1 | 133 | 124 | 0 | — |
| .mjs | test | 1 | 14 | 13 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hawkhai/win11-oneocr/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hawkhai/win11-oneocr/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH OCR 接线、二进制依赖及隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 图片文字识别相对手动复制增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目面向希望在 DSH 中读取本地图片文字的 Windows 用户。它把已有 OneOCR 可执行程序封装为模型工具，返回文字与结构化布局；相比人工看图抄录或直接调用 OCR CLI，具体增量是 DSH 工具接线及结构化结果传递，不是 OneOCR 模型本身。识别精度、速度和真实成本均未经同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-17](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/README.md#L7-L17)

DSH 工具用途及本地运行主张。

<details>
<summary>查看原文（11行）</summary>

````text
## DeepSeek Harness plugin

This repository can be installed as a [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) plugin:

```powershell
dsh plugin add github:hawkhai/win11-oneocr
```

It registers `oneocr_recognize`, a model-facing tool that accepts a local image path and returns recognized text together with OneOCR's structured line/word polygons, confidence values, image angle, and handwriting style. The tool runs locally on Windows 11; image bytes are not sent to an external OCR service.

The bundle defaults to the prebuilt `bin/ocr.exe` and its adjacent runtime files. Override `ocrBin`, `timeoutMs`, or `maxOutputBytes` in the plugin row if needed.
````

</details>

**依据 2 · 作者声明**：[README.md:19-33](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/README.md#L19-L33)

作者描述的 OCR 输出能力。

<details>
<summary>查看原文（15行）</summary>

```text
## Features

| Feature | Description |
|---|---|
| **8-point Bounding Box** | 4-corner polygon bbox for lines and words (not just axis-aligned rect) |
| **Word Confidence** | Per-word recognition confidence score (0.0–1.0) |
| **Image Angle** | Detected rotation angle of the text in the image |
| **Line Style** | Handwritten vs. printed text classification with confidence |
| **Resize Resolution** | Configurable max internal resize before OCR (performance/accuracy trade-off) |
| **Resource Release** | Proper cleanup via `ReleaseOcrResult`, `ReleaseOcrPipeline`, etc. |
| **Unicode Path** | Full Unicode file path support via `_wfopen` in the DLL wrapper |
| **Multi-image Batch** | Process multiple images in one invocation |
| **Plain Text Output** | `--text` mode for pipe-friendly output (no JSON) |
| **Raw Buffer OCR** | `ocrImageRaw()` for in-memory BGRA pixel buffers (no file I/O) |
| **Visualization** | Python script with confidence-colored word boxes and style labels |
```

</details>

**依据 3 · 源码核查**：[src/index.js:80-103](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L80-L103)

工具注册和结果渲染。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const ocrBin = typeof config.ocrBin === 'string' && config.ocrBin ? resolve(config.ocrBin) : DEFAULT_OCR_BIN
  const timeoutMs = positiveInteger(config.timeoutMs, 60_000, 'timeoutMs')
  const maxOutputBytes = positiveInteger(config.maxOutputBytes, 4 * 1024 * 1024, 'maxOutputBytes')

  ctx.tools.register(defineTool({
    name: 'oneocr_recognize',
    description: 'Recognize text in a local image with the offline Windows 11 OneOCR engine. Returns plain text plus the engine JSON with line/word polygons, confidence, rotation, and handwriting style.',
    parameters: {
      image_path: { type: 'string', required: true, description: 'Absolute path, or a path relative to the current session workspace.' },
      max_lines: { type: 'integer', description: 'Maximum recognition lines (1-1000). Default: 1000.' },
      resize_width: { type: 'integer', description: 'Optional internal resize width; use together with resize_height.' },
      resize_height: { type: 'integer', description: 'Optional internal resize height; use together with resize_width.' }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          text: { type: 'string', required: true },
          result: { type: 'string', required: true }
        }
      },
      render: (_args, value) => [{ type: 'text', text: `<ocr_text>\n${value.text}\n</ocr_text>\n<oneocr_json>\n${value.result}\n</oneocr_json>` }]
```

</details>

#### 缺口

- 缺少目标图片与其他 OCR 的对照
  **影响**：不能衡量精度和收益
  **进一步探讨**：用标注图片比较识别准确率、失败和人工复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地图像如何送入进程并返回 DSH？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件验证 Windows、路径、行数和成对尺寸，解析相对路径后创建临时目录，以 shell=false 启动指定 ocr.exe 并传文件路径和输出参数，读取 JSON 返回文字及原结果，finally 清理临时目录。子进程输出、结果文件设大小限制，超时或取消调用停止流程；Windows taskkill 是异步发起，不能单凭调用证明后代均已退出。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:19-39](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L19-L39)

路径及进程启动和停止。

<details>
<summary>查看原文（21行）</summary>

```text
function sessionPath(path, exec) {
  if (isAbsolute(path)) return path
  const cwd = exec.agent?.session?.header?.cwd ?? process.cwd()
  return resolve(cwd, path)
}

function runProcess(command, args, { cwd, timeoutMs, maxOutputBytes, signal }) {
  return new Promise((resolveRun, reject) => {
    if (signal?.aborted) return reject(new Error('OneOCR call aborted'))
    const child = spawn(command, args, { cwd, windowsHide: true, shell: false, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = Buffer.alloc(0)
    let stderr = Buffer.alloc(0)
    let settled = false

    const stop = () => {
      if (child.exitCode !== null || child.signalCode !== null) return
      if (process.platform === 'win32' && child.pid) {
        const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
        killer.unref()
      } else child.kill('SIGKILL')
    }
```

</details>

**依据 2 · 源码核查**：[src/index.js:40-71](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L40-L71)

上限、取消、超时与错误。

<details>
<summary>查看原文（32行）</summary>

```text
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      error ? reject(error) : resolveRun(value)
    }
    const append = (current, chunk, stream) => {
      const next = Buffer.concat([current, chunk])
      if (next.length > maxOutputBytes) {
        stop()
        finish(new Error(`${stream} exceeded ${maxOutputBytes} bytes`))
      }
      return next
    }
    const onAbort = () => {
      stop()
      finish(new Error('OneOCR call aborted'))
    }
    const timer = setTimeout(() => {
      stop()
      finish(new Error(`OneOCR timed out after ${timeoutMs} ms`))
    }, timeoutMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk, 'stdout') })
    child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk, 'stderr') })
    child.on('error', (error) => finish(error))
    child.on('close', (code) => {
      if (settled) return
      if (code !== 0) return finish(new Error(`OneOCR exited with code ${code}: ${stderr.toString('utf8').trim().slice(0, 2000)}`))
      finish(undefined)
    })
```

</details>

**依据 3 · 源码核查**：[src/index.js:80-103](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L80-L103)

工具与输出模式。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const ocrBin = typeof config.ocrBin === 'string' && config.ocrBin ? resolve(config.ocrBin) : DEFAULT_OCR_BIN
  const timeoutMs = positiveInteger(config.timeoutMs, 60_000, 'timeoutMs')
  const maxOutputBytes = positiveInteger(config.maxOutputBytes, 4 * 1024 * 1024, 'maxOutputBytes')

  ctx.tools.register(defineTool({
    name: 'oneocr_recognize',
    description: 'Recognize text in a local image with the offline Windows 11 OneOCR engine. Returns plain text plus the engine JSON with line/word polygons, confidence, rotation, and handwriting style.',
    parameters: {
      image_path: { type: 'string', required: true, description: 'Absolute path, or a path relative to the current session workspace.' },
      max_lines: { type: 'integer', description: 'Maximum recognition lines (1-1000). Default: 1000.' },
      resize_width: { type: 'integer', description: 'Optional internal resize width; use together with resize_height.' },
      resize_height: { type: 'integer', description: 'Optional internal resize height; use together with resize_width.' }
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          text: { type: 'string', required: true },
          result: { type: 'string', required: true }
        }
      },
      render: (_args, value) => [{ type: 'text', text: `<ocr_text>\n${value.text}\n</ocr_text>\n<oneocr_json>\n${value.result}\n</oneocr_json>` }]
```

</details>

**依据 4 · 源码核查**：[src/index.js:105-131](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L105-L131)

参数校验、临时结果和清理。

<details>
<summary>查看原文（27行）</summary>

```text
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (exec.signal?.aborted) throw new Error('OneOCR call aborted')
      if (process.platform !== 'win32') throw new Error('OneOCR requires Windows 11')
      if (typeof args.image_path !== 'string' || !args.image_path.trim()) throw new Error('image_path must be a non-empty string')
      const maxLines = positiveInteger(args.max_lines, 1000, 'max_lines')
      if (maxLines > 1000) throw new Error('max_lines must not exceed 1000')
      const hasWidth = args.resize_width !== undefined
      const hasHeight = args.resize_height !== undefined
      if (hasWidth !== hasHeight) throw new Error('resize_width and resize_height must be supplied together')
      const tempDir = await fs.mkdtemp(join(tmpdir(), 'dsh-oneocr-'))
      const outputPath = join(tempDir, 'result.json')
      const argv = [sessionPath(args.image_path, exec), '--output', outputPath, '--max-lines', String(maxLines), '--quiet']
      if (hasWidth) {
        argv.push('--resize', `${positiveInteger(args.resize_width, 0, 'resize_width')}x${positiveInteger(args.resize_height, 0, 'resize_height')}`)
      }
      try {
        await runProcess(ocrBin, argv, { cwd: dirname(ocrBin), timeoutMs, maxOutputBytes, signal: exec.signal })
        const info = await fs.stat(outputPath)
        if (info.size > maxOutputBytes) throw new Error(`OneOCR result exceeded ${maxOutputBytes} bytes`)
        const result = JSON.parse(await fs.readFile(outputPath, 'utf8'))
        return { text: plainText(result), result: JSON.stringify(result, null, 2) }
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true })
      }
    },
    presentCall: (args) => ({ card: 'generic', title: `OneOCR ${args.image_path}`, kind: 'read', locations: [{ path: args.image_path }] })
```

</details>

#### 缺口

- 未运行 Windows 二进制和 DSH 工具
  **影响**：不能确认识别、清理或终止效果
  **进一步探讨**：隔离 Windows 测试路径、超时、取消和临时文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 闭源引擎、离线和隐私主张的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

仓库包括 ocr.exe、OneOCR DLL、模型及包装源码；README 将识别称为离线，但其中 DLL 和模型的内部实现未提供可审阅源码，不能仅凭 JS 不发网络证明其完整行为或二进制与 C++ 源码一致。工具把识别文字和完整结果交给 DSH，之后是否发送给模型取决于宿主配置；绝对路径未限制在工作目录内，调用权限取决于宿主策略及进程权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-17](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/README.md#L3-L17)

作者离线和二进制说明。

<details>
<summary>查看原文（15行）</summary>

````text
Offline OCR engine extracted from the Windows 11 Snipping Tool, with full-featured C++ CLI, reusable DLL wrapper, and Python visualization.

Based on: https://b1tg.github.io/post/win11-oneocr/

## DeepSeek Harness plugin

This repository can be installed as a [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) plugin:

```powershell
dsh plugin add github:hawkhai/win11-oneocr
```

It registers `oneocr_recognize`, a model-facing tool that accepts a local image path and returns recognized text together with OneOCR's structured line/word polygons, confidence values, image angle, and handwriting style. The tool runs locally on Windows 11; image bytes are not sent to an external OCR service.

The bundle defaults to the prebuilt `bin/ocr.exe` and its adjacent runtime files. Override `ocrBin`, `timeoutMs`, or `maxOutputBytes` in the plugin row if needed.
````

</details>

**依据 2 · 源码核查**：[package.json:8-15](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/package.json#L8-L15)

打包 exe、DLL 和模型声明。

```text
  "files": [
    "src",
    "bin/ocr.exe",
    "bin/oneocr.dll",
    "bin/oneocr.onemodel",
    "bin/onnxruntime.dll",
    "cordis.patch.yml",
    "README.md"
```

**依据 3 · 源码核查**：[src/index.js:19-22](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L19-L22)

绝对路径不受 cwd 约束。

```text
function sessionPath(path, exec) {
  if (isAbsolute(path)) return path
  const cwd = exec.agent?.session?.header?.cwd ?? process.cwd()
  return resolve(cwd, path)
```

**依据 4 · 源码核查**：[src/index.js:121-131](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L121-L131)

输出读回及返回给宿主。

<details>
<summary>查看原文（11行）</summary>

```text
      try {
        await runProcess(ocrBin, argv, { cwd: dirname(ocrBin), timeoutMs, maxOutputBytes, signal: exec.signal })
        const info = await fs.stat(outputPath)
        if (info.size > maxOutputBytes) throw new Error(`OneOCR result exceeded ${maxOutputBytes} bytes`)
        const result = JSON.parse(await fs.readFile(outputPath, 'utf8'))
        return { text: plainText(result), result: JSON.stringify(result, null, 2) }
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true })
      }
    },
    presentCall: (args) => ({ card: 'generic', title: `OneOCR ${args.image_path}`, kind: 'read', locations: [{ path: args.image_path }] })
```

</details>

#### 缺口

- 未审计 DLL、模型和宿主数据流
  **影响**：无法独立证实完整离线或数据保密
  **进一步探讨**：核对来源许可、二进制并在隔离网络环境审查进程及模型调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用需要哪些系统、权限及恢复条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

依赖 Windows 11、兼容 Node 和 DSH 工具；包声明附带 exe 与运行文件，README 同时提供从 Snipping Tool 复制依赖的说明，部署方式和权利适用条件需独立核实。使用者需提供可读图片并复核识别结果，临时目录保存结构化输出，进程或强制终止失败可能留下未验证状态。先用非敏感测试图片验证，不能接受读取或未知二进制边界时停用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-15](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/package.json#L8-L15)

预期分发文件。

```text
  "files": [
    "src",
    "bin/ocr.exe",
    "bin/oneocr.dll",
    "bin/oneocr.onemodel",
    "bin/onnxruntime.dll",
    "cordis.patch.yml",
    "README.md"
```

**依据 2 · 源码核查**：[package.json:33-47](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/package.json#L33-L47)

Node、宿主依赖与 bundle。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.0 <5.0.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.7"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 3 · 作者声明**：[README.md:35-44](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/README.md#L35-L44)

系统和额外运行依赖声明。

<details>
<summary>查看原文（10行）</summary>

```text
## Prerequisites

- Windows 11 (tested on 23H2+)
- Snipping Tool 11.2409.25.0+

Copy these 3 files from the Snipping Tool installation folder into the same directory as `ocr.exe`:

- `oneocr.dll`
- `oneocr.onemodel`
- `onnxruntime.dll`
```

</details>

**依据 4 · 源码核查**：[src/index.js:115-128](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L115-L128)

临时目录与正常清理。

<details>
<summary>查看原文（14行）</summary>

```text
      const tempDir = await fs.mkdtemp(join(tmpdir(), 'dsh-oneocr-'))
      const outputPath = join(tempDir, 'result.json')
      const argv = [sessionPath(args.image_path, exec), '--output', outputPath, '--max-lines', String(maxLines), '--quiet']
      if (hasWidth) {
        argv.push('--resize', `${positiveInteger(args.resize_width, 0, 'resize_width')}x${positiveInteger(args.resize_height, 0, 'resize_height')}`)
      }
      try {
        await runProcess(ocrBin, argv, { cwd: dirname(ocrBin), timeoutMs, maxOutputBytes, signal: exec.signal })
        const info = await fs.stat(outputPath)
        if (info.size > maxOutputBytes) throw new Error(`OneOCR result exceeded ${maxOutputBytes} bytes`)
        const result = JSON.parse(await fs.readFile(outputPath, 'utf8'))
        return { text: plainText(result), result: JSON.stringify(result, null, 2) }
      } finally {
        await fs.rm(tempDir, { recursive: true, force: true })
```

</details>

#### 缺口

- 未测二进制兼容、许可、资源和清理
  **影响**：无法确认总成本或恢复
  **进一步探讨**：固定 Windows 与 DSH 版本测试异常退出与临时文件，并核实许可。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低 OCR 文本被误当确定事实的风险？

**研究主题**：新假设与验证

#### 完整回答

结果包含结构化识别与置信信息，但本插件不做事实校验。可探索给低置信词提供图像位置引用与人工复核提示，并与现有直接返回结构化 JSON 对照；这是待验证方案，不声称已经实现。用带标注的真实和合成图片统计错误识别、用户发现率和处理时长，若未提升纠错或产生过多误报则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-26](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/README.md#L21-L26)

作者描述位置和置信输出。

```text
| Feature | Description |
|---|---|
| **8-point Bounding Box** | 4-corner polygon bbox for lines and words (not just axis-aligned rect) |
| **Word Confidence** | Per-word recognition confidence score (0.0–1.0) |
| **Image Angle** | Detected rotation angle of the text in the image |
| **Line Style** | Handwritten vs. printed text classification with confidence |
```

**依据 2 · 源码核查**：[src/index.js:95-103](https://github.com/hawkhai/win11-oneocr/blob/f09ce228b50fefee64dfbfb5ef879a1092a894fd/src/index.js#L95-L103)

文字与原始 JSON 返回。

```text
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          text: { type: 'string', required: true },
          result: { type: 'string', required: true }
        }
      },
      render: (_args, value) => [{ type: 'text', text: `<ocr_text>\n${value.text}\n</ocr_text>\n<oneocr_json>\n${value.result}\n</oneocr_json>` }]
```

#### 缺口

- 阈值和人工复核收益未知
  **影响**：无法证明降低误读
  **进一步探讨**：用多语言与低分辨率数据按置信度校准并对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
