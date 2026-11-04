# ff-toolkit

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0b4a00c](https://github.com/inthepond/ff-toolkit/tree/0b4a00c57cf14118a3f2d6f5182f1ff85879d885)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/inthepond/ff-toolkit)
<!-- END META -->

> **功能**：将 FFmpeg 媒体处理操作封装为 Python 和模型可调用工具。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供统一操作和宿主桥接；编码能力由 FFmpeg 提供。

> **主要限制**：[Q03](#research-q03) 默认覆盖已存在输出，concat 清单可能残留；[Q04](#research-q04) 取消和恢复未验。

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
  - [Q01 · FFmpeg 工具包对谁有价值，相比直接调用 FFmpeg 增加什么？](#detail-section-11)
  - [Q02 · 工具名如何从 DSH 调用抵达 FFmpeg？](#detail-section-12)
  - [Q03 · 默认文件写入和合并临时文件有哪些影响？](#detail-section-13)
  - [Q04 · 运行条件、失败和退出需要哪些成本？](#detail-section-14)
  - [Q05 · 如何减少覆盖和不透明的临时文件残留？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要将媒体处理接入 Agent 或 Python 流水线的开发者。

手工编写 FFmpeg 命令、参数验证和模型工具 schema。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| FFmpeg 操作 | 处理媒体 | 外部二进制和格式依赖 |
| JSON bridge | 对接 DSH 等宿主 | 每次子进程，未验取消 |
| 合并清单 | concat demuxer | 临时路径可能残留 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| Python 和 ff-toolkit | 运行必需 | bridge 与操作函数 | 启动失败 |
| FFmpeg / ffprobe | 媒体操作必需 | 编解码与探测 | 工具不可用 |
| DSH 与工具接口 | DSH 入口需要 | 注册模型工具 | 宿主功能不可用 |
| 隔离目录与备份 | 安全处理需要 | 保护用户媒体 | 默认输出可能覆盖 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户复制素材并检查工具版本 | 不满足依赖则停止 |
| 配置 | 设置唯一输出路径并关闭覆盖 | 检查真实参数 |
| 处理 | 调用指定操作 | 非零错误则停止并检查残留 |
| 验收 | 用户核对输出内容与质量 | 不符时保留原件并重试 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | Python、FFmpeg、宿主 | 安装与权限审查 | 版本兼容未知 |
| 持续 | CPU、磁盘和进程 | 核验输出与路径 | 编码耗时未测 |
| 恢复 | 输入与输出备份 | 清理部分文件 | 取消及恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 统一工具入口 | 注册表和 bridge | 实际宿主兼容 |
| 输出错误返回 | 非零时抛异常 | 媒体内容质量 |
| 可控覆盖选项 | executor 配置 | 默认安全性及误用率 |

> **思考**：[Q03](#research-q03) 默认覆盖已存在输出，concat 清单可能残留；[Q04](#research-q04) 取消和恢复未验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供统一操作和宿主桥接；编码能力由 FFmpeg 提供。

[Q02](#research-q02) 用 argv 和 JSON 桥接分离调用方；[Q03](#research-q03) 默认覆盖和临时清单生命周期需重点处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认覆盖已存在输出，concat 清单可能残留；[Q04](#research-q04) 取消和恢复未验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离副本中关闭覆盖、使用新路径并检查结果；不接受权限或恢复边界时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码检查，未运行目标、FFmpeg 或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、src/ff_kit/bridge.py、src/ff_kit/dispatch.py、src/ff_kit/executor.py、src/ff_kit/core/clip.py、src/ff_kit/core/merge.py、integrations/deepseek-harness/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 Python bridge、dispatcher、executor、clip、merge 及 DSH 代表接线；其余操作、FFmpeg 行为和宿主权限未全审。
- 下一步：隔离目录验证五操作、特殊路径、输出冲突、取消与残留；本次未执行。

**分析版本**

- **仓库**：[inthepond/ff-toolkit](https://github.com/inthepond/ff-toolkit)
- **版本号**：未声明（[固定提交 0b4a00c](https://github.com/inthepond/ff-toolkit/tree/0b4a00c57cf14118a3f2d6f5182f1ff85879d885)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显式覆盖确认和清理临时清单能减少损失，需实测。

隔离目录验证五操作、特殊路径、输出冲突、取消与残留；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 298 | — | — | 1485 |
| .ts | source | 1 | 338 | 267 | 52 | — |
| .ts | test | 1 | 125 | 108 | 0 | — |
| .mjs | test | 1 | 41 | 36 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/inthepond/ff-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/inthepond/ff-toolkit/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/inthepond/ff-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 FFmpeg 工具分派、DSH 桥接及文件写入边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · FFmpeg 工具包对谁有价值，相比直接调用 FFmpeg 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目为 Python 和模型工具调用提供裁剪、合并、音频提取、字幕和转码入口，适合需要让 Agent 编排媒体处理的开发者。相对直接调用 FFmpeg 或自己维护工具 schema，它提供统一工具名、参数分派和结构化结果；实际编解码能力来自本机 FFmpeg。根对象是 Python 工具包，DSH 插件位于子目录，不能把其全部能力当根组件自身的原生 DSH 安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/README.md#L1-L20)

作者列出用途和 DSH 子组件。

<details>
<summary>查看原文（20行）</summary>

```text
# ff-toolkit

FFmpeg operations as LLM-callable tools.

<p align="center">
  <img src="https://raw.githubusercontent.com/inthepond/ff-toolkit/main/docs/demo.svg" alt="ff-toolkit demo" width="720">
</p>

> **Stop hand-writing FFmpeg subprocess calls and JSON tool schemas.**
> `ff-toolkit` gives you 5 production-ready media operations, dual-format LLM schemas (OpenAI + Anthropic), and an MCP server — all in one `pip install`.

## Real-World Use Cases

**"My agent pipeline needs to process uploaded videos"** — Give your agent `openai_tools()` or `anthropic_tools()` and let it decide how to clip, transcode, or extract audio. The `dispatch()` function handles execution.

**"I need to batch-extract 16kHz WAV for ASR"** — One line: `extract_audio("video.mp4", "out.wav", codec="pcm_s16le", sample_rate=16000, channels=1)`

**"I want FFmpeg tools in Claude Desktop / Cursor"** — Add the MCP server config (3 lines of JSON) and Claude can edit your videos directly.

**"I want FFmpeg tools in DeepSeek Harness"** — `dsh plugin add dsh-ffkit` installs the native plugin from [integrations/deepseek-harness](integrations/deepseek-harness/).
```

</details>

**依据 2 · 源码核查**：[src/ff_kit/dispatch.py:24-43](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/dispatch.py#L24-L43)

五项注册表。

<details>
<summary>查看原文（20行）</summary>

```text
# Map of tool name → (function, set of valid kwargs)
_REGISTRY: dict[str, tuple[Any, set[str]]] = {
    "ffkit_clip": (clip, {"input_path", "output_path", "start", "end", "duration"}),
    "ffkit_merge": (merge, {"input_paths", "output_path", "method"}),
    "ffkit_extract_audio": (
        extract_audio,
        {"input_path", "output_path", "codec", "sample_rate", "channels"},
    ),
    "ffkit_add_subtitles": (
        add_subtitles,
        {"input_path", "output_path", "subtitle_path", "mode"},
    ),
    "ffkit_transcode": (
        transcode,
        {
            "input_path", "output_path", "video_codec", "audio_codec",
            "resolution", "bitrate", "fps", "preset", "crf", "extra_args",
        },
    ),
}
```

</details>

**依据 3 · 源码核查**：[src/ff_kit/executor.py:71-87](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L71-L87)

实际调用 FFmpeg。

<details>
<summary>查看原文（17行）</summary>

```text
    def run(
        self,
        args: list[str],
        output_path: str | None = None,
    ) -> FFmpegResult:
        """Run an ffmpeg command and return the result."""
        cmd = [self.ffmpeg_bin]
        if self.overwrite:
            cmd.append("-y")
        cmd.extend(args)

        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )
```

</details>

#### 缺口

- 没有同任务人工与开发成本对照
  **影响**：不能量化节时或媒体质量
  **进一步探讨**：以相同输入对比手写调用、异常处理与输出校验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具名如何从 DSH 调用抵达 FFmpeg？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

子目录的 DSH 适配器定义工具并注册；调用将参数、可选执行器配置序列化给 Python bridge 子进程，bridge 检查对象结构并分派注册表，未知名称返回 error、额外参数被过滤，目标函数构造 argv 后以 subprocess.run 执行。示例 clip 要求 end 和 duration 二选一并使用流复制；这条接线是静态源码核查，未安装 Python 包、运行 FFmpeg 或验证宿主 Tool 接口兼容。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/src/index.ts:123-148](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/integrations/deepseek-harness/src/index.ts#L123-L148)

按调用启动 bridge 并写入 JSON。

<details>
<summary>查看原文（26行）</summary>

```text
export async function runBridge(
  config: Config,
  tool: string,
  args: unknown,
  signal: AbortSignal,
): Promise<BridgeResult> {
  signal.throwIfAborted()
  const [command, ...baseArgs] = config.bridgeCommand
  if (!command) throw new Error('dsh-ffkit: bridgeCommand must not be empty')

  const executor = executorConfig(config)
  const request = JSON.stringify({ tool, arguments: args, ...(executor ? { executor } : {}) })

  const child = spawn(command, baseArgs, {
    cwd: config.cwd || undefined,
    env: { ...process.env, ...config.env },
    stdio: ['pipe', 'pipe', 'pipe'],
    signal,
  })

  const stdoutChunks: Buffer[] = []
  const stderrChunks: Buffer[] = []
  child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk))
  child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk))
  child.stdin.on('error', () => {}) /* EPIPE when the process never started; surfaced via 'error'/'close' */
  child.stdin.end(request)
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/src/index.ts:201-214](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/integrations/deepseek-harness/src/index.ts#L201-L214)

工具执行委托 bridge。

<details>
<summary>查看原文（14行）</summary>

```text
/** Define one ffkit tool that executes through the bridge. */
function ffkitTool<const S extends ParameterSchemaSpec>(config: Config, spec: FfkitToolSpec<S>): ToolDefinition {
  return defineTool({
    name: spec.name,
    description: spec.description,
    parameters: spec.parameters,
    timeoutMs: config.timeoutMs,
    output: {
      schema: RESULT_SCHEMA,
      render: (_args, value) => renderResult(value),
    },
    execute(args, exec) {
      return runBridge(config, spec.name, args, exec.signal)
    },
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/src/index.ts:330-337](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/integrations/deepseek-harness/src/index.ts#L330-L337)

注册工具。

```text
 * Register the ffkit tools; disposal unregisters them with the plugin fiber.
 * @param ctx - plugin context providing `ctx.tools`.
 * @param config - validated plugin configuration.
 */
export function apply(ctx: Context, config: Config): void {
  for (const definition of ffkitToolDefinitions(config)) {
    ctx.tools.register(definition)
  }
```

**依据 4 · 源码核查**：[src/ff_kit/bridge.py:51-82](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/bridge.py#L51-L82)

协议结构与分派。

<details>
<summary>查看原文（32行）</summary>

```text
def run_request(req: Any) -> dict[str, Any]:
    """
    Execute a parsed bridge request and return the response dict.

    Raises
    ------
    BridgeProtocolError
        If the request is structurally invalid (not dispatched).
    """
    if not isinstance(req, dict):
        raise BridgeProtocolError("Request must be a JSON object.")

    tool = req.get("tool")
    if not isinstance(tool, str) or not tool:
        raise BridgeProtocolError("Request field 'tool' must be a non-empty string.")

    arguments = req.get("arguments", {})
    if not isinstance(arguments, dict):
        raise BridgeProtocolError("Request field 'arguments' must be an object.")

    executor_cfg = req.get("executor")
    executor = None
    if executor_cfg is not None:
        if not isinstance(executor_cfg, dict):
            raise BridgeProtocolError("Request field 'executor' must be an object.")
        kwargs = {k: v for k, v in executor_cfg.items() if k in _EXECUTOR_KEYS}
        try:
            executor = Executor(**kwargs)
        except Exception as exc:
            return {"status": "error", "error": f"{type(exc).__name__}: {exc}"}

    return dispatch(tool, arguments, executor=executor)
```

</details>

**依据 5 · 源码核查**：[src/ff_kit/dispatch.py:70-88](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/dispatch.py#L70-L88)

注册表查找、过滤和错误返回。

<details>
<summary>查看原文（19行）</summary>

```text
    if tool_name not in _REGISTRY:
        return {
            "status": "error",
            "error": f"Unknown tool: {tool_name!r}. Available: {sorted(_REGISTRY)}",
        }

    fn, valid_keys = _REGISTRY[tool_name]

    # Filter out any unexpected keys the LLM might hallucinate
    kwargs = {k: v for k, v in arguments.items() if k in valid_keys}

    if executor is not None:
        kwargs["executor"] = executor

    try:
        result: FFmpegResult = fn(**kwargs)
        return {"status": "ok", **result.to_dict()}
    except Exception as exc:
        return {"status": "error", "error": f"{type(exc).__name__}: {exc}"}
```

</details>

**依据 6 · 源码核查**：[src/ff_kit/core/clip.py:37-52](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/core/clip.py#L37-L52)

参数条件及流复制。

<details>
<summary>查看原文（16行）</summary>

```text

    Returns
    -------
    FFmpegResult
    """
    if not end and not duration:
        raise ValueError("Either 'end' or 'duration' must be provided.")
    if end and duration:
        raise ValueError("Provide either 'end' or 'duration', not both.")

    exe = executor or Executor()
    args = ["-i", input_path, "-ss", start]

    if end:
        args.extend(["-to", end])
    else:
```

</details>

**依据 7 · 源码核查**：[src/ff_kit/executor.py:71-87](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L71-L87)

argv 和进程调用。

<details>
<summary>查看原文（17行）</summary>

```text
    def run(
        self,
        args: list[str],
        output_path: str | None = None,
    ) -> FFmpegResult:
        """Run an ffmpeg command and return the result."""
        cmd = [self.ffmpeg_bin]
        if self.overwrite:
            cmd.append("-y")
        cmd.extend(args)

        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )
```

</details>

#### 缺口

- 未执行真实媒体或 DSH 调用
  **影响**：无法确认编码兼容、时间精度及输出内容
  **进一步探讨**：隔离媒体样本测试各格式、失败输出和取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认文件写入和合并临时文件有哪些影响？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Executor 默认 overwrite=true，执行时添加 -y；因此提供已存在的 output_path 可能覆盖文件，调用前应确定新路径并备份。subprocess.run 接收 argv 数组而非构造 shell 字符串，但不能因此认为路径或 FFmpeg 参数被隔离。默认 concat demuxer 将每个绝对路径写入 delete=False 的临时列表，使用 -safe 0；该函数中未见删除该列表或转义单引号，因而可能遗留包含路径的临时文件，带特殊字符的路径解析也需实测。未声称已发生覆盖或注入。

#### 证据与依据

**依据 1 · 源码核查**：[src/ff_kit/executor.py:53-60](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L53-L60)

默认覆盖及超时。

```text
@dataclass
class Executor:
    """Thin wrapper around subprocess for running ffmpeg/ffprobe."""

    ffmpeg_bin: str = "ffmpeg"
    ffprobe_bin: str = "ffprobe"
    timeout: int = 300  # seconds
    overwrite: bool = True
```

**依据 2 · 源码核查**：[src/ff_kit/executor.py:71-87](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L71-L87)

-y 与 argv 运行。

<details>
<summary>查看原文（17行）</summary>

```text
    def run(
        self,
        args: list[str],
        output_path: str | None = None,
    ) -> FFmpegResult:
        """Run an ffmpeg command and return the result."""
        cmd = [self.ffmpeg_bin]
        if self.overwrite:
            cmd.append("-y")
        cmd.extend(args)

        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )
```

</details>

**依据 3 · 源码核查**：[src/ff_kit/core/merge.py:50-68](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/core/merge.py#L50-L68)

临时文件、路径写入和 safe 0。

<details>
<summary>查看原文（19行）</summary>

```text
def _merge_demuxer(
    exe: Executor, input_paths: list[str], output_path: str
) -> FFmpegResult:
    """Fast concat via the concat demuxer (same codec required)."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", delete=False
    ) as f:
        for p in input_paths:
            f.write(f"file '{Path(p).resolve()}'\n")
        list_file = f.name

    args = [
        "-f", "concat",
        "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        output_path,
    ]
    return exe.run(args, output_path=output_path)
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/src/index.ts:40-45](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/integrations/deepseek-harness/src/index.ts#L40-L45)

宿主侧覆盖与超时选项。

```text
  /** Per-operation FFmpeg timeout in seconds, enforced inside the bridge. Unset = the bridge's default (300). */
  ffmpegTimeoutSeconds?: number
  /** Whether FFmpeg overwrites existing output files. Unset = the bridge's default (true). */
  overwrite?: boolean
  /** Cooperative tool-call timeout budget in milliseconds, enforced by the harness timeout policy. */
  timeoutMs: number
```

#### 缺口

- 未实测媒体文件、特殊文件名与异常清理
  **影响**：无法断言实际数据损失或特定输入的解析结果
  **进一步探讨**：隔离目录测试同名输出、单引号与运行失败后临时文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行条件、失败和退出需要哪些成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

运行需要 Python、包和 PATH 上的 FFmpeg，使用 DSH 还需要对应插件和宿主工具接口；每次 bridge 都生成进程，FFmpeg 默认超时 300 秒，编码耗 CPU、磁盘和人工检查，成本未知。进程返回非零会报错，但成功码不证明内容完整、字幕或质量正确；终止 bridge 是否终止其子 FFmpeg 未在本次核查。先使用隔离副本、唯一输出名和关闭覆盖的配置，核对产物后再决定采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:118-127](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/README.md#L118-L127)

作者描述 Python 和 DSH 接线。

<details>
<summary>查看原文（10行）</summary>

````text
### As a DeepSeek Harness plugin

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) is DeepSeek's plugin-based agent runtime. ff-toolkit ships a native dsh plugin — the `dsh-ffkit` npm package in [integrations/deepseek-harness](integrations/deepseek-harness/):

```sh
pip install ff-toolkit                      # the Python side (this package)
dsh plugin --profile <name> add dsh-ffkit   # the harness side
```

The plugin registers all five operations as typed harness tools with structured canonical outputs (usable from dsh Code Mode) and UI cards. Under the hood each call runs `python -m ff_kit.bridge`, a one-shot JSON entry point over stdin/stdout that any host runtime can reuse. See the [plugin README](integrations/deepseek-harness/README.md) for configuration.
````

</details>

**依据 2 · 源码核查**：[src/ff_kit/executor.py:53-67](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L53-L67)

可执行依赖、默认超时和覆盖。

<details>
<summary>查看原文（15行）</summary>

```text
@dataclass
class Executor:
    """Thin wrapper around subprocess for running ffmpeg/ffprobe."""

    ffmpeg_bin: str = "ffmpeg"
    ffprobe_bin: str = "ffprobe"
    timeout: int = 300  # seconds
    overwrite: bool = True

    def __post_init__(self) -> None:
        if not shutil.which(self.ffmpeg_bin):
            raise FFmpegNotFoundError(
                f"Could not find '{self.ffmpeg_bin}' on PATH. "
                "Install FFmpeg: https://ffmpeg.org/download.html"
            )
```

</details>

**依据 3 · 源码核查**：[src/ff_kit/executor.py:82-98](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L82-L98)

运行与非零失败。

<details>
<summary>查看原文（17行）</summary>

```text
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )

        result = FFmpegResult(
            command=cmd,
            returncode=proc.returncode,
            stdout=proc.stdout,
            stderr=proc.stderr,
            output_path=output_path,
        )

        if proc.returncode != 0:
            raise FFmpegExecutionError(cmd, proc.returncode, proc.stderr)
```

</details>

**依据 4 · 源码核查**：[integrations/deepseek-harness/src/index.ts:123-140](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/integrations/deepseek-harness/src/index.ts#L123-L140)

信号传给 bridge。

<details>
<summary>查看原文（18行）</summary>

```text
export async function runBridge(
  config: Config,
  tool: string,
  args: unknown,
  signal: AbortSignal,
): Promise<BridgeResult> {
  signal.throwIfAborted()
  const [command, ...baseArgs] = config.bridgeCommand
  if (!command) throw new Error('dsh-ffkit: bridgeCommand must not be empty')

  const executor = executorConfig(config)
  const request = JSON.stringify({ tool, arguments: args, ...(executor ? { executor } : {}) })

  const child = spawn(command, baseArgs, {
    cwd: config.cwd || undefined,
    env: { ...process.env, ...config.env },
    stdio: ['pipe', 'pipe', 'pipe'],
    signal,
```

</details>

#### 缺口

- 未核对 FFmpeg 子进程取消和临时产物恢复
  **影响**：不能保证终止任务或失败时无残留
  **进一步探讨**：以短时隔离进程测试取消、输出清理及验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少覆盖和不透明的临时文件残留？

**研究主题**：新假设与验证

#### 完整回答

针对 Q03 默认 -y 及 concat 临时清单，假设默认拒绝已存在输出、仅在显式确认后覆盖，并用 finally 清除清单，可减少误覆盖与残留。需对照现有 overwrite 配置和高并发任务，测意外覆盖、失败残留、重试与用户确认负担；若降低吞吐但未减少损失、或清理干扰仍在读的进程则否定。它是新假设，覆盖开关是已存在的反例。

#### 证据与依据

**依据 1 · 源码核查**：[src/ff_kit/executor.py:53-60](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/executor.py#L53-L60)

已有覆盖配置，默认开启。

```text
@dataclass
class Executor:
    """Thin wrapper around subprocess for running ffmpeg/ffprobe."""

    ffmpeg_bin: str = "ffmpeg"
    ffprobe_bin: str = "ffprobe"
    timeout: int = 300  # seconds
    overwrite: bool = True
```

**依据 2 · 源码核查**：[src/ff_kit/core/merge.py:50-68](https://github.com/inthepond/ff-toolkit/blob/0b4a00c57cf14118a3f2d6f5182f1ff85879d885/src/ff_kit/core/merge.py#L50-L68)

清单生命周期。

<details>
<summary>查看原文（19行）</summary>

```text
def _merge_demuxer(
    exe: Executor, input_paths: list[str], output_path: str
) -> FFmpegResult:
    """Fast concat via the concat demuxer (same codec required)."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", delete=False
    ) as f:
        for p in input_paths:
            f.write(f"file '{Path(p).resolve()}'\n")
        list_file = f.name

    args = [
        "-f", "concat",
        "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        output_path,
    ]
    return exe.run(args, output_path=output_path)
```

</details>

#### 缺口

- 假设未实现或运行
  **影响**：不能声称问题已修复
  **进一步探讨**：用临时目录及失败注入对照输出保护与残留。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
