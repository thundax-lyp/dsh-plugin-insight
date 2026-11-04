# WeChat OCR

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8f6254d](https://github.com/hawkhai/wechat-ocr/tree/8f6254d9545643ad68fc2967c22240cb4fa433b2)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：通过微信 OCR 运行时识别本地图像，并将文本及结构化结果提供给 DSH。

> **亮点**：[Q01](#research-q01) 把已有 OCR 包装成 DSH 工具，[Q02](#research-q02) 输出文字与原 JSON；不贡献底层识别模型。

> **主要限制**：[Q03](#research-q03) 内置扩展只列 Windows pyd，无法凭底层 Linux 支持推断插件开箱可用；离线及宿主数据流未独立证实。

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
  - [Q01 · 面向本地图片识别用户，相比直接调用微信 OCR 增加什么？](#detail-section-11)
  - [Q02 · 图片如何流向微信 OCR 并返回 DSH？](#detail-section-12)
  - [Q03 · Linux 和隐私主张能否直接成立？](#detail-section-13)
  - [Q04 · 采用者需要什么依赖，如何控制风险？](#detail-section-14)
  - [Q05 · 如何帮助使用者发现去重导致的文本遗漏？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 会话中识别本地图片的用户。

直接调用微信 OCR Python 接口或人工读取图片。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 图片 OCR | 提取文字 | 需匹配微信运行时和扩展 |
| 文本摘要 | 收集并去重文本字段 | 重复出现会合并 |
| 原始 JSON | 保留结构化结果 | 引擎结构和质量未测 |
| 超时取消 | 请求停止子进程 | 实际进程树退出未测 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| DSH 与 Node | 宿主工具需要 | 注册调用 | 无法调用 |
| 兼容 Python 和 wcocr 扩展 | 每次识别需要 | 桥接引擎 | 导入失败 |
| 匹配微信 OCR 和运行时目录 | 识别需要 | 底层引擎 | 路径或初始化失败 |
| 可读图片 | 每次调用 | 输入 | 识别失败 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户核验微信、Python 和权限 | 在隔离环境配置 |
| 调用 | Agent 提供图片路径 | 参数及运行路径有效 |
| 识别 | Python 加载扩展并返回 JSON | 超时或异常报告 |
| 复核 | 用户比对原图与结构化结果 | 摘要遗漏时使用原结果 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 微信引擎、Python、DSH | 路径和版本匹配 | 授权与兼容未知 |
| 持续 | 本地进程 | 审查识别和重复文本 | 准确率与耗时未知 |
| 故障 | 日志及测试环境 | 处理运行时或进程退出 | 恢复成本未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| DSH 接线 | JS 注册与 Python 调用 | 真实宿主兼容 |
| 结构化结果 | 脚本 JSON 与 JS 返回 | OCR 质量 |
| 停止控制 | 超时及取消源码 | 子进程树退出 |

> **思考**：[Q03](#research-q03) 内置扩展只列 Windows pyd，无法凭底层 Linux 支持推断插件开箱可用；离线及宿主数据流未独立证实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把已有 OCR 包装成 DSH 工具，[Q02](#research-q02) 输出文字与原 JSON；不贡献底层识别模型。

[Q02](#research-q02) 使用 shell=false 和上限；[Q03](#research-q03) 要区分底层支持与包内扩展平台。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 内置扩展只列 Windows pyd，无法凭底层 Linux 支持推断插件开箱可用；离线及宿主数据流未独立证实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用非敏感图片验证版本、授权与识别；重要内容核对原始 JSON 和原图，不合条件时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本静态检查；未执行微信二进制、Python 扩展或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/dsh-plugin.js、dsh/ocr_once.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 JS 入口、一次性 Python 脚本、打包声明和作者文档；微信 OCR 引擎、全部 C++ 桥接、Linux 编译及宿主传输未审计。
- 下一步：隔离系统验证微信引擎、扩展加载、重复文本、取消与数据传输；本轮未执行。

**分析版本**

- **仓库**：[hawkhai/wechat-ocr](https://github.com/hawkhai/wechat-ocr)
- **版本号**：0.1.1（[固定提交 8f6254d](https://github.com/hawkhai/wechat-ocr/tree/8f6254d9545643ad68fc2967c22240cb4fa433b2)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 保留摘要中的重复与来源路径，需检验漏读与额外上下文成本。

隔离系统验证微信引擎、扩展加载、重复文本、取消与数据传输；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 99 | — | — | 592 |
| .js | source | 1 | 133 | 125 | 0 | — |
| .mjs | test | 1 | 16 | 15 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hawkhai/wechat-ocr/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hawkhai/wechat-ocr/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hawkhai/wechat-ocr/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 接线、微信 OCR 依赖及结果和隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向本地图片识别用户，相比直接调用微信 OCR 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目把微信 OCR 运行时的识别能力通过 Python 扩展与 DSH 工具暴露给代理，返回提取文字及原始结构化结果。用户也可直接调用 Python 接口或手工读取图片，明确增量是 DSH 接线和进程封装，不是微信 OCR 模型本身。真实识别效果、效率和其他 OCR 的对照未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-18](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/README.md#L1-L18)

原项目及 DSH 工具说明。

<details>
<summary>查看原文（18行）</summary>

````text
# wcocr: demonstrate how to use WeChatOCR.exe

Great thanks to IEEE by his [Project IEEE/QQImpl](https://github.com/EEEEhex/qqimpl)] and [article](https://bbs.kanxue.com/thread-278161.htm).
This project is based on it and reduced the product size by using `protobuf-lite` instead of `protobuf`.

This project provided a direct Python interface for calling in sync mode as well as other languages support including but not limited with c++/java/c#.

## DeepSeek Harness plugin

This repository can be installed as a [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) plugin:

```powershell
dsh plugin add github:hawkhai/wechat-ocr
```

It registers `wechat_ocr_recognize`, a model-facing tool that accepts a local image path and returns recognized text together with WeChat OCR's structured result. OCR runs locally; the image is not sent to an external OCR service.

Configure `wechatOcrPath` (the WeChat 3.x `WeChatOCR.exe`, WeChat 4.x `wxocr.dll`, or Linux OCR binary) and `wechatPath` (the matching WeChat runtime directory) in the plugin row. You may instead set `WECHAT_OCR_PATH` and `WECHAT_PATH`. The default `python` must match one of the bundled Windows extension builds (CPython 3.7, 3.11, or 3.12); `pythonBin` and `moduleDir` are configurable.
````

</details>

**依据 2 · 源码核查**：[src/dsh-plugin.js:90-113](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L90-L113)

工具注册和输出。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const pythonBin = typeof config.pythonBin === 'string' && config.pythonBin ? config.pythonBin : 'python'
  const moduleDir = typeof config.moduleDir === 'string' && config.moduleDir ? resolve(config.moduleDir) : DEFAULT_MODULE_DIR
  const wechatOcrPath = config.wechatOcrPath || process.env.WECHAT_OCR_PATH || ''
  const wechatPath = config.wechatPath || process.env.WECHAT_PATH || ''
  const timeoutMs = positiveInteger(config.timeoutMs, 60_000, 'timeoutMs')
  const maxOutputBytes = positiveInteger(config.maxOutputBytes, 4 * 1024 * 1024, 'maxOutputBytes')

  ctx.tools.register(defineTool({
    name: 'wechat_ocr_recognize',
    description: 'Recognize text in a local image with the local WeChat OCR engine. Returns extracted text and the engine structured JSON result.',
    parameters: {
      image_path: { type: 'string', required: true, description: 'Absolute path, or a path relative to the current session workspace.' }
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
      render: (_args, value) => [{ type: 'text', text: `<ocr_text>\n${value.text}\n</ocr_text>\n<wechat_ocr_json>\n${value.result}\n</wechat_ocr_json>` }]
```

</details>

**依据 3 · 作者声明**：[README.md:78-88](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/README.md#L78-L88)

直接 Python 调用方式。

<details>
<summary>查看原文（11行）</summary>

````text
## Python interface
Rename the built `wcocr.dll` to `wcocr.pyd` and put it in the same directory as `test.py`.
You can use the following code to test it:

```python
import wcocr
wcocr.init(wechatocr_path, wechat_path)
result = wcocr.ocr("D:\\test.png")
```

Currently, the python interface only supports sync mode.
````

</details>

#### 缺口

- 未与人工或其他 OCR 同任务对照
  **影响**：无法量化识别收益
  **进一步探讨**：固定标注图片比较准确率及人工复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片如何流向微信 OCR 并返回 DSH？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具要求配置微信 OCR 与运行时目录，将图片路径传给 shell=false 的 Python 子进程；脚本检查路径，动态导入 wcocr，调用 init 和 ocr 并输出 JSON。JS 递归搜集 text、content、words 字符串并去重，同时返回原始 JSON；对重复文本去重可能影响需要保留重复内容或顺序的任务，应以原结果核对。子进程有输出上限、超时和取消，未实测进程树终止。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-plugin.js:18-26](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L18-L26)

路径和 Python 启动。

```text
function sessionPath(path, exec) {
  if (isAbsolute(path)) return path
  return resolve(exec.agent?.session?.header?.cwd ?? process.cwd(), path)
}

function runPython(pythonBin, args, { timeoutMs, maxOutputBytes, signal }) {
  return new Promise((resolveRun, reject) => {
    if (signal?.aborted) return reject(new Error('WeChat OCR call aborted'))
    const child = spawn(pythonBin, args, { windowsHide: true, shell: false, stdio: ['ignore', 'pipe', 'pipe'] })
```

**依据 2 · 源码核查**：[src/dsh-plugin.js:44-70](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L44-L70)

大小、超时与 JSON 错误。

<details>
<summary>查看原文（27行）</summary>

```text
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
      finish(new Error('WeChat OCR call aborted'))
    }
    const timer = setTimeout(() => {
      stop()
      finish(new Error(`WeChat OCR timed out after ${timeoutMs} ms`))
    }, timeoutMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk, 'stdout') })
    child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk, 'stderr') })
    child.on('error', (error) => finish(error))
    child.on('close', (code) => {
      if (settled) return
      if (code !== 0) return finish(new Error(`WeChat OCR exited with code ${code}: ${stderr.toString('utf8').trim().slice(0, 2000)}`))
      try {
        finish(undefined, JSON.parse(stdout.toString('utf8')))
      } catch (error) {
        finish(new Error(`WeChat OCR returned invalid JSON: ${error.message}`))
```

</details>

**依据 3 · 源码核查**：[src/dsh-plugin.js:76-87](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L76-L87)

递归提取文本。

<details>
<summary>查看原文（12行）</summary>

```text
function collectText(value, output = []) {
  if (typeof value === 'string') return output
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, output)
    return output
  }
  if (!value || typeof value !== 'object') return output
  for (const key of ['text', 'content', 'words']) {
    if (typeof value[key] === 'string' && value[key].trim()) output.push(value[key].trim())
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') collectText(child, output)
  return output
```

</details>

**依据 4 · 源码核查**：[src/dsh-plugin.js:115-131](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L115-L131)

参数、调用与去重。

<details>
<summary>查看原文（17行）</summary>

```text
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      if (exec.signal?.aborted) throw new Error('WeChat OCR call aborted')
      if (typeof args.image_path !== 'string' || !args.image_path.trim()) throw new Error('image_path must be a non-empty string')
      if (!wechatOcrPath || !wechatPath) {
        throw new Error('Configure wechatOcrPath and wechatPath in the plugin row, or set WECHAT_OCR_PATH and WECHAT_PATH')
      }
      const result = await runPython(pythonBin, [
        DEFAULT_SCRIPT,
        '--module-dir', moduleDir,
        '--wechat-ocr-path', resolve(wechatOcrPath),
        '--wechat-path', resolve(wechatPath),
        '--image', sessionPath(args.image_path, exec)
      ], { timeoutMs, maxOutputBytes, signal: exec.signal })
      return { text: [...new Set(collectText(result))].join('\n'), result: JSON.stringify(result, null, 2) }
    },
    presentCall: (args) => ({ card: 'generic', title: `WeChat OCR ${args.image_path}`, kind: 'read', locations: [{ path: args.image_path }] })
```

</details>

**依据 5 · 源码核查**：[dsh/ocr_once.py:20-41](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/dsh/ocr_once.py#L20-L41)

路径检查、扩展加载及调用。

<details>
<summary>查看原文（22行）</summary>

```text
    module_dir = os.path.abspath(args.module_dir)
    wechat_ocr_path = os.path.abspath(args.wechat_ocr_path)
    wechat_path = os.path.abspath(args.wechat_path)
    image_path = os.path.abspath(args.image)
    if not os.path.isdir(module_dir):
        raise FileNotFoundError(f'wcocr module directory not found: {module_dir}')
    if not os.path.exists(wechat_ocr_path):
        raise FileNotFoundError(f'WeChat OCR binary not found: {wechat_ocr_path}')
    if not os.path.isdir(wechat_path):
        raise FileNotFoundError(f'WeChat runtime directory not found: {wechat_path}')
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f'image not found: {image_path}')

    sys.path.insert(0, module_dir)
    try:
        wcocr = importlib.import_module('wcocr')
    except ImportError as error:
        version = f'{sys.version_info.major}.{sys.version_info.minor}'
        raise RuntimeError(f'no compatible wcocr extension for Python {version} in {module_dir}; bundled Windows builds support CPython 3.7, 3.11, and 3.12') from error
    wcocr.init(wechat_ocr_path, wechat_path)
    result = wcocr.ocr(image_path)
    sys.stdout.write(json.dumps(result, ensure_ascii=False))
```

</details>

#### 缺口

- 未运行目标扩展、DSH 或图片
  **影响**：不能确认文本结构、精度和终止行为
  **进一步探讨**：用含重复词与不同结构的测试图比较 text 与原 JSON。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Linux 和隐私主张能否直接成立？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README 称底层项目支持 Linux，但包文件规则只包含 python/*.pyd，固定仓库树中的扩展为 Windows CPython 3.7、3.11、3.12 版本；脚本报错也称内置 Windows 构建，因此不能推断 Linux 上无需自备兼容 wcocr 扩展即可运行。作者称 OCR 本地执行；微信引擎二进制和宿主后续模型传输未审计，不能仅凭封装证明完整离线或保密。绝对路径不限定于会话目录。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:16-18](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/README.md#L16-L18)

本地识别和 Python 版本说明。

```text
It registers `wechat_ocr_recognize`, a model-facing tool that accepts a local image path and returns recognized text together with WeChat OCR's structured result. OCR runs locally; the image is not sent to an external OCR service.

Configure `wechatOcrPath` (the WeChat 3.x `WeChatOCR.exe`, WeChat 4.x `wxocr.dll`, or Linux OCR binary) and `wechatPath` (the matching WeChat runtime directory) in the plugin row. You may instead set `WECHAT_OCR_PATH` and `WECHAT_PATH`. The default `python` must match one of the bundled Windows extension builds (CPython 3.7, 3.11, or 3.12); `pythonBin` and `moduleDir` are configurable.
```

**依据 2 · 源码核查**：[README.md:56-62](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/README.md#L56-L62)

作者对 Linux 支持的说明。

```text
# Linux is now supported

![linux supported](doc/images/linux-spt.jpg)

Typically, You should use `/opt/wechat/wxocr` as the OCR exe path and `/opt/wechat/` as the WeChat folder path.

The other usages are similar to those on Windows.
```

**依据 3 · 源码核查**：[package.json:8-13](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/package.json#L8-L13)

分发规则只列 pyd。

```text
  "files": [
    "src/dsh-plugin.js",
    "python/*.pyd",
    "dsh/ocr_once.py",
    "cordis.patch.yml",
    "README.md"
```

**依据 4 · 源码核查**：[dsh/ocr_once.py:33-40](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/dsh/ocr_once.py#L33-L40)

导入扩展与 Windows 构建错误说明。

```text
    sys.path.insert(0, module_dir)
    try:
        wcocr = importlib.import_module('wcocr')
    except ImportError as error:
        version = f'{sys.version_info.major}.{sys.version_info.minor}'
        raise RuntimeError(f'no compatible wcocr extension for Python {version} in {module_dir}; bundled Windows builds support CPython 3.7, 3.11, and 3.12') from error
    wcocr.init(wechat_ocr_path, wechat_path)
    result = wcocr.ocr(image_path)
```

**依据 5 · 源码核查**：[src/dsh-plugin.js:18-20](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L18-L20)

绝对路径处理。

```text
function sessionPath(path, exec) {
  if (isAbsolute(path)) return path
  return resolve(exec.agent?.session?.header?.cwd ?? process.cwd(), path)
```

#### 缺口

- Linux 自建扩展、微信引擎和宿主数据流未经审计
  **影响**：不能保证跨平台兼容、离线或数据隐私
  **进一步探讨**：固定平台和扩展检查加载并在隔离网络验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用者需要什么依赖，如何控制风险？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要 DSH、Node、兼容 Python 扩展和匹配的微信 OCR 二进制及运行时路径；包中 Python 版本依赖、微信版本变化、图像敏感性及输出复核都带来负担。WeChat OCR 程序不随用户环境保证可用，取消或超时仅能据静态源码判断发起终止。先在非敏感图片和隔离环境验证匹配与识别；无权访问引擎或不能接受数据流时停止。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:16-18](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/README.md#L16-L18)

路径、版本和配置条件。

```text
It registers `wechat_ocr_recognize`, a model-facing tool that accepts a local image path and returns recognized text together with WeChat OCR's structured result. OCR runs locally; the image is not sent to an external OCR service.

Configure `wechatOcrPath` (the WeChat 3.x `WeChatOCR.exe`, WeChat 4.x `wxocr.dll`, or Linux OCR binary) and `wechatPath` (the matching WeChat runtime directory) in the plugin row. You may instead set `WECHAT_OCR_PATH` and `WECHAT_PATH`. The default `python` must match one of the bundled Windows extension builds (CPython 3.7, 3.11, or 3.12); `pythonBin` and `moduleDir` are configurable.
```

**依据 2 · 源码核查**：[package.json:31-44](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/package.json#L31-L44)

Node、DSH 与 bundle。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/dsh-plugin.js:23-35](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L23-L35)

进程退出策略。

<details>
<summary>查看原文（13行）</summary>

```text
function runPython(pythonBin, args, { timeoutMs, maxOutputBytes, signal }) {
  return new Promise((resolveRun, reject) => {
    if (signal?.aborted) return reject(new Error('WeChat OCR call aborted'))
    const child = spawn(pythonBin, args, { windowsHide: true, shell: false, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = Buffer.alloc(0)
    let stderr = Buffer.alloc(0)
    let settled = false
    const stop = () => {
      if (child.exitCode !== null || child.signalCode !== null) return
      if (process.platform === 'win32' && child.pid) {
        const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
        killer.unref()
      } else child.kill('SIGKILL')
```

</details>

**依据 4 · 源码核查**：[dsh/ocr_once.py:20-38](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/dsh/ocr_once.py#L20-L38)

运行依赖检查。

<details>
<summary>查看原文（19行）</summary>

```text
    module_dir = os.path.abspath(args.module_dir)
    wechat_ocr_path = os.path.abspath(args.wechat_ocr_path)
    wechat_path = os.path.abspath(args.wechat_path)
    image_path = os.path.abspath(args.image)
    if not os.path.isdir(module_dir):
        raise FileNotFoundError(f'wcocr module directory not found: {module_dir}')
    if not os.path.exists(wechat_ocr_path):
        raise FileNotFoundError(f'WeChat OCR binary not found: {wechat_ocr_path}')
    if not os.path.isdir(wechat_path):
        raise FileNotFoundError(f'WeChat runtime directory not found: {wechat_path}')
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f'image not found: {image_path}')

    sys.path.insert(0, module_dir)
    try:
        wcocr = importlib.import_module('wcocr')
    except ImportError as error:
        version = f'{sys.version_info.major}.{sys.version_info.minor}'
        raise RuntimeError(f'no compatible wcocr extension for Python {version} in {module_dir}; bundled Windows builds support CPython 3.7, 3.11, and 3.12') from error
```

</details>

#### 缺口

- 未核验微信二进制授权、成本及实际退出
  **影响**：无法保证兼容和安全恢复
  **进一步探讨**：检查软件许可，并在隔离系统测试进程终止。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助使用者发现去重导致的文本遗漏？

**研究主题**：新假设与验证

#### 完整回答

当前摘要递归提取常见字段并通过 Set 去重，而原始 JSON 仍返回；可探索同时输出保序且保留重复的片段与提取路径，并提示摘要与原始结果差异。该方案尚未验证，比较原摘要与增强输出在票据或表格重复词上的漏读率、上下文长度与复核耗时，若不能降低漏读或上下文成本过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-plugin.js:76-87](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L76-L87)

字段递归提取。

<details>
<summary>查看原文（12行）</summary>

```text
function collectText(value, output = []) {
  if (typeof value === 'string') return output
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, output)
    return output
  }
  if (!value || typeof value !== 'object') return output
  for (const key of ['text', 'content', 'words']) {
    if (typeof value[key] === 'string' && value[key].trim()) output.push(value[key].trim())
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') collectText(child, output)
  return output
```

</details>

**依据 2 · 源码核查**：[src/dsh-plugin.js:122-129](https://github.com/hawkhai/wechat-ocr/blob/8f6254d9545643ad68fc2967c22240cb4fa433b2/src/dsh-plugin.js#L122-L129)

Set 去重和完整结果返回。

```text
      const result = await runPython(pythonBin, [
        DEFAULT_SCRIPT,
        '--module-dir', moduleDir,
        '--wechat-ocr-path', resolve(wechatOcrPath),
        '--wechat-path', resolve(wechatPath),
        '--image', sessionPath(args.image_path, exec)
      ], { timeoutMs, maxOutputBytes, signal: exec.signal })
      return { text: [...new Set(collectText(result))].join('\n'), result: JSON.stringify(result, null, 2) }
```

#### 缺口

- 没有真实结果或用户复核实验
  **影响**：不能断言去重一定导致业务错误
  **进一步探讨**：对含重复文本的合成 JSON 与图片开展对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
