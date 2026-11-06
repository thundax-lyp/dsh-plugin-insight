# Vision-Complete

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9526ccd](https://github.com/Yts1919/dsh-vision-complete/tree/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4)

<!-- BEGIN META -->
[![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yts1919/dsh-vision-complete)
<!-- END META -->

> **功能**：以 Skill、Python 图片客户端和 Windows 截图工具衔接视觉服务，并配置 Qwen MCP。

> **亮点**：贡献是任务指引、标准库单图请求与截图路径衔接；视频/音频/文档主要继承上游，不把菜单和安装完成当视觉能力验收，见 [Q01](#research-q01)。

> **主要限制**：一键脚本覆盖同名目录、基于字符串重建/卸载补丁，截图监控只判端口且可接管其他应用图片；OCR/坐标输出无结构校验，见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要媒体补充、哪些是本包增量？](#detail-section-11)
  - [Q02 · 图片如何成为结果，失败和结构校验在哪里？](#detail-section-12)
  - [Q03 · 安装、监控与卸载会改什么？](#detail-section-13)
  - [Q04 · 应如何试用、成本和退出是什么？](#detail-section-14)
  - [Q05 · 下一步什么改进可证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望将无敏感截图的解释带回纯文本 Agent 任务的 Windows 用户，可减少手动保存和往返；逐字/坐标须验收，见 [Q01](#research-q01)。

手工保存图片交已有视觉工具，再把结果带回原任务；模型与MCP媒体能力来自上游，本包组织接入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 媒体Skill指引 | 帮Agent选工具 | 上游能力未验 |
| 单图Python | chat/OCR/grounding | 模型外部提供，原样文本需验 |
| 供应商对比 | 顺序调用预设 | 缺key跳过，完成非成功 |
| 截图路径 | 本地存图并改剪贴板 | Windows可选，端口非DSH认证 |

#### 依赖

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python3.7+与命令执行 | Python路线 | 编码图片/HTTP | 不是原生Host工具 |
| 可信视觉服务/凭据 | 图片理解需 | 模型能力来自上游 | 无key/模型不可用则失败 |
| uvx与DSH MCP客户端 | MCP路线 | core1.0.2/api1.0.3/video-memory1.0.1标签 | 安装写配置不保证启动 |
| Windows/PowerShell/可写用户目录 | 安装截图路线 | 覆盖目录/profile与监控 | Python路线另验平台 |
| 可备份profile与非敏感图片 | 试用条件 | 恢复/核准确性 | 不直接动日常配置 |

#### 步骤

| 步骤 | 动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 基线 | 手工视觉工具读自造图 | 保留原图与校验答案 |
| 隔离 | 仅复制Skill/Python并核服务/环境key | 不发key到对话 |
| 请求 | 单图一次调用 | 验文字/坐标，返回文本不算准确 |
| 可选安装 | 先备份核差异/单独验MCP | 完成提示不算验收 |
| 退出 | 停监控撤key恢复配置清图 | 不用宽正则盲删 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | Python/服务/MCP依赖 | 备份、凭据和路径 | 金额与耗时未知 |
| 持续 | 整图请求/输出、本地模型硬件 | 校验OCR/框与剪贴板 | compare多请求，零包非零费 |
| 失败 | 超时可能已处理、重跑增加请求 | 对照服务与配置 | 未测费用/准确率 |
| 退出 | 图片/云记录存量 | 停自启恢复配置撤key | 卸载不自动清数据 |

#### 效果

| 效果 | 材料支持 | 未确认 |
| --- | --- | --- |
| 图片接入 | 真实HTTP与打印结果 | 当前服务可用/准确 |
| OCR定位 | 提示词约束 | 完整文字/合法正确框 |
| 截图衔接 | 保存PNG和路径替换 | 用户误接管负担 |
| 多媒体 | 指引上游MCP | 上游能力与端到端产物 |

> **思考**：一键脚本覆盖同名目录、基于字符串重建/卸载补丁，截图监控只判端口且可接管其他应用图片；OCR/坐标输出无结构校验，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是任务指引、标准库单图请求与截图路径衔接；视频/音频/文档主要继承上游，不把菜单和安装完成当视觉能力验收，见 [Q01](#research-q01)。

Python请求薄且可换兼容服务，但compare与普通配置语义不同、结果缺结构验收；安装/卸载需检查变更范围，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

一键脚本覆盖同名目录、基于字符串重建/卸载补丁，截图监控只判端口且可接管其他应用图片；OCR/坐标输出无结构校验，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：已有可信视觉服务的用户可在隔离位置只试单图Python桥接，校验原图文字/坐标；先不运行日常profile一键安装或自启监控。识别不稳或配置/剪贴板不可控则停用，回手工视觉工具，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill与单图请求、固定Git中的安装/截图/卸载路径已查；未运行Windows/宿主/模型，上游媒体能力未审。隔离观察，改进仅候选。

- 已检查：作者 README、包清单、源码路径 install.ps1、skills/vision-multimodal/SKILL.md、skills/vision-multimodal/vision.py、tools/screenshot-tool/install-autostart.bat、tools/screenshot-tool/screenshot-autosave.ps1、uninstall.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Git读取Skill、全部270行Python、安装/卸载、截图监控与自启必要原件；未审Qwen上游实现、执行Windows/模型或完整平台兼容。
- 下一步：- 固定源码，只读Git blob补齐未展开PowerShell原件。
- 未安装、运行脚本/模型、启动监控或发送图片。
- 不把作者完整视觉菜单、5分钟和零依赖当效果/成本验收。

**分析版本**

- **仓库**：[Yts1919/dsh-vision-complete](https://github.com/Yts1919/dsh-vision-complete)
- **版本号**：未声明（[固定提交 9526ccd](https://github.com/Yts1919/dsh-vision-complete/tree/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是可预览/回滚的结构化安装和明确执行成功计数，比较配置保留与误判成本；不改上游模型，见 [Q05](#research-q05)。

- 固定源码，只读Git blob补齐未展开PowerShell原件。
- 未安装、运行脚本/模型、启动监控或发送图片。
- 不把作者完整视觉菜单、5分钟和零依赖当效果/成本验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 506 | — | — | 5799 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Yts1919/dsh-vision-complete/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：媒体补充链的自有贡献、真实请求与安装/截图边界能否支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要媒体补充、哪些是本包增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

真实条目是以 vision-multimodal 为入口的 Skill 和安装辅助集合，没有原生 Host apply 或自己训练的视觉模型。适合 Windows 上让纯文本 Agent 解释一张无敏感截图、提取文字再继续原任务的人；替代是手动保存图片、交已有视觉应用，再把结果带回。新增的是任务到工具的说明、一个标准库图片请求客户端及截图路径衔接，而不是媒体理解能力本身。

方式 A 指引调用另行注册的 Qwen MCP；视频、音频、分割、PDF 和长视频记忆都主要归该上游，不能据菜单确认本包已实现。方式 B 真正提供单图 chat/OCR/grounding 与多供应商对比；没有独立 ASR、视频解码或画框实现。合格结果是可追溯到图片、逐字/坐标能人工校验，并能回原任务，不以模型会说话视为识别准确。本轮不审上游服务器内部，因此收窄到本地图片请求桥接。

#### 证据与依据

**依据 1 · 源码核查**：[skills/vision-multimodal/SKILL.md:11-31](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/SKILL.md#L11-L31)

两条接入与截图路径说明。

<details>
<summary>查看原文（21行）</summary>

````text
## 方式 A：MCP 工具（默认，通义千问 Qwen）
若工具列表里有 `mcp__qwen-mm-plugins-*`，直接使用（已注册、无需额外安装，只需 `DASHSCOPE_API_KEY`）：
- `qwen-mm-plugins-core`：本地读图 / 读视频 / 裁剪 / 画框 / 可视化任意文件 / 看媒体元信息。
- `qwen-mm-plugins-api`：调用 Qwen 多模态模型（理解、OCR、检测、视频+音频融合、语音转写、音乐分析、图像分割）。
- `qwen-mm-plugins-video-memory`：30 分钟以上长视频的语义记忆与检索。

## 方式 B：通用方式 —— 用本目录的 vision.py（接任意供应商）
环境里没有 MCP 工具、或想接**别的模型**（OpenAI / 智谱 GLM / Kimi / 通义千问 / 硅基流动 / 本地 Ollama …）时，用命令行调用 `vision.py`（零依赖，Python 3.7+）：

```bash
python vision.py chat      --image 图.png --prompt "描述这张图"
python vision.py ocr       --image 图.png --lang zh
python vision.py grounding --image 图.png --prompt "所有猫"
python vision.py compare   --image 图.png --prompt "描述这张图" --models qwen,glm,kimi
python vision.py providers
```

供应商切换：把 `config.example.json` 复制为 `config.json`，改 `provider` 一行即可；API Key 用环境变量设置。详见 `references/providers.md`。

## 截图直读（配合 screenshot-tool）
若用户装了截图自动保存工具（`~/.dsh/tools/screenshot-tool`），截图后剪贴板会自动变成文件路径（形如 `...\Pictures\DeepSeek-Shots\shot_xxx.png`）。用户粘贴出来的是**路径文字**，直接把它当图片的绝对路径，走下面的工作流即可，无需额外处理。
````

</details>

**依据 2 · 源码核查**：[skills/vision-multimodal/SKILL.md:35-50](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/SKILL.md#L35-L50)

多媒体菜单明确依赖上游。

<details>
<summary>查看原文（16行）</summary>

```text
| 我想做什么 | 方式 A（MCP） | 方式 B（vision.py） |
|---|---|---|
| 描述一张图片 / 回答关于图的问题 | `vision_chat` | `python vision.py chat` |
| 从图片/截图/票据里提取文字 | `ocr` | `python vision.py ocr` |
| 找出物体在哪儿（画框定位） | `grounding` | `python vision.py grounding` |
| 把框画到图上给用户看 | core `draw_bbox` 或 `grounding(return_img=true)` | core `draw_bbox`（0–1000 坐标） |
| 裁剪图片某块区域 | core `crop` | core `crop` |
| 低成本先瞄一眼图 | core `read_image` | — |
| 同一张图对比多个模型 | 手动多次调用 | `python vision.py compare` |
| 理解一段视频（画面+声音） | `omni_av_caption` 等 | core `media_info` → 抽帧 → `vision.py chat` |
| 视频/音频转文字 | `transcribe_audio` 或 `omni_asr*` | 接任意 ASR 服务 |
| 多说话人分别转写 | `omni_multi_speaker_asr` | 接任意 ASR 服务 |
| 分析一首音乐 | `omni_music_caption` | — |
| 把物体从图里抠出来（分割掩码） | `segmentation` | — |
| 看 PDF / Office / CSV / 代码 / 3D | core `visualize` / `save_view` | — |
| 30 分钟以上长视频问答 | `qwen-mm-plugins-video-memory` 系列 | — |
```

</details>

**依据 3 · 源码核查**：[skills/vision-multimodal/vision.py:245-266](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L245-L266)

实际CLI只有五个命令。

<details>
<summary>查看原文（22行）</summary>

```text
def main():
    _setup_utf8()
    ap = argparse.ArgumentParser(description="统一多模态视觉客户端（provider-agnostic）")
    ap.add_argument("command", choices=["chat", "ocr", "grounding", "compare", "providers"])
    ap.add_argument("--image", "-i", help="图片路径")
    ap.add_argument("--prompt", "-p", help="提示词 / 要检测的目标")
    ap.add_argument("--models", help="compare 用：逗号分隔的供应商列表，如 qwen,glm,kimi")
    ap.add_argument("--lang", choices=["zh", "en", "auto"], default="auto", help="OCR 语言（默认 auto）")
    ap.add_argument("--provider", help="供应商 key（openai/glm/kimi/qwen/siliconflow/ollama/...）")
    ap.add_argument("--base-url", help="OpenAI 兼容接口地址")
    ap.add_argument("--model", help="模型名")
    ap.add_argument("--api-key", help="API Key（不推荐，优先用环境变量）")
    args = ap.parse_args()

    handlers = {
        "chat": cmd_chat,
        "ocr": cmd_ocr,
        "grounding": cmd_grounding,
        "compare": cmd_compare,
        "providers": cmd_providers,
    }
    handlers[args.command](args)
```

</details>

#### 缺口

- 未检查上游 Qwen MCP 的实际能力实现与当前运行。
  **影响**：不能把完整媒体菜单归成本组件已验证能力。
  **进一步探讨**：如采用视频/音频能力，另固定上游版本并审真实请求和产物。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片如何成为结果，失败和结构校验在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

chat/OCR/grounding 先选 provider/base/model/key，配置优先级为命令行、环境、配置、预设；但 key 只从参数/环境取，不读 config。读取整个文件为 base64 data URL，POST 到所选 /chat/completions，120 秒超时；有 key 才写 Authorization。默认云模型会收到图片和提示，选择本地 Ollama 只是可选分支，不使默认外发消失。没有图像体积限制、压缩或重试预算。

OCR 与定位只是更换提示词并把 content 原样打印；grounding 要求 0–1000 JSON 框，但不解析 JSON、不校验范围，也不绘图。返回文本不是坐标正确/文字完整的验收。HTTP、网络、响应结构错误会退出；compare 独立按预设与各自环境 key 顺序调用，忽略普通分支 config/base/model 覆盖，缺 key 跳过、调用失败继续，最后仍印“对比完成”，不能把这一行当至少一个成功。没有置信度或共识校验，多个模型一致也可能同错。

#### 证据与依据

**依据 1 · 源码核查**：[skills/vision-multimodal/vision.py:108-138](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L108-L138)

配置/key与整图编码。

<details>
<summary>查看原文（31行）</summary>

```text
def _pick(args):
    """解析最终的 provider / base_url / model / api_key。"""
    cfg = _read_config()
    provider = args.provider or os.environ.get("VISION_PROVIDER") or cfg.get("provider") or "qwen"

    preset = PRESETS.get(provider, {})
    base_url = args.base_url or os.environ.get("VISION_BASE_URL") or cfg.get("base_url") or preset.get("base_url")
    model = args.model or os.environ.get("VISION_MODEL") or cfg.get("model") or preset.get("model")
    key_env = preset.get("key_env")

    api_key = (
        args.api_key
        or os.environ.get("VISION_API_KEY")
        or (os.environ.get(key_env) if key_env else None)
    )

    if not base_url:
        sys.exit("[error] 缺少 base_url：用 --base-url 或 config.json 指定，或选用内置 provider。")
    if not model:
        sys.exit("[error] 缺少 model：用 --model 或 config.json 指定，或选用内置 provider。")

    return provider, base_url.rstrip("/"), model, api_key


def _encode_image(path):
    p = Path(path)
    if not p.exists():
        sys.exit(f"[error] 图片不存在：{path}")
    mime = mimetypes.guess_type(str(p))[0] or "image/png"
    data = base64.b64encode(p.read_bytes()).decode("ascii")
    return {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{data}"}}
```

</details>

**依据 2 · 源码核查**：[skills/vision-multimodal/vision.py:141-170](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L141-L170)

真实POST、超时与错误。

<details>
<summary>查看原文（30行）</summary>

```text
def _chat(base_url, model, api_key, prompt, image_paths, max_tokens=2048, temperature=0.2):
    content = [{"type": "text", "text": prompt}]
    for ip in image_paths or []:
        content.append(_encode_image(ip))

    body = {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    url = f"{base_url}/chat/completions"
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        sys.exit(f"[error] HTTP {e.code}：{detail[:500]}")
    except urllib.error.URLError as e:
        sys.exit(f"[error] 网络错误：{e.reason}")

    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        sys.exit(f"[error] 响应格式异常：{json.dumps(data, ensure_ascii=False)[:500]}")
```

</details>

**依据 3 · 源码核查**：[skills/vision-multimodal/vision.py:181-195](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L181-L195)

OCR/grounding原样输出。

<details>
<summary>查看原文（15行）</summary>

```text
def cmd_ocr(args):
    _, base_url, model, api_key = _pick(args)
    if not args.image:
        sys.exit("[error] ocr 需要 --image")
    prompt = OCR_PROMPTS.get(args.lang, OCR_PROMPTS["auto"])
    print(_chat(base_url, model, api_key, prompt, [args.image], max_tokens=2048, temperature=0), flush=True)


def cmd_grounding(args):
    _, base_url, model, api_key = _pick(args)
    if not args.image:
        sys.exit("[error] grounding 需要 --image")
    target = args.prompt or "所有目标物体"
    prompt = GROUNDING_TMPL.format(target=target)
    print(_chat(base_url, model, api_key, prompt, [args.image], max_tokens=2048, temperature=0), flush=True)
```

</details>

**依据 4 · 源码核查**：[skills/vision-multimodal/vision.py:198-223](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L198-L223)

compare独立配置、跳过和失败继续。

<details>
<summary>查看原文（26行）</summary>

```text
def cmd_compare(args):
    if not args.image:
        sys.exit("[error] compare 需要 --image")
    prompt = args.prompt or "请详细描述这张图片的内容。"
    models = [m.strip() for m in (args.models or "").split(",") if m.strip()]
    if not models:
        sys.exit("[error] compare 需要 --models，例如 --models qwen,glm,kimi")

    image = [args.image]
    for key in models:
        if key not in PRESETS:
            print(f"\n[skip] 未知供应商：{key}（可选：{', '.join(PRESETS.keys())}）")
            continue
        p = PRESETS[key]
        key_env = p.get("key_env")
        api_key = os.environ.get(key_env) if key_env else None
        if key_env and not api_key:
            print(f"\n[skip] {key}：缺少环境变量 {key_env}")
            continue
        print(f"\n========== {p['name']} | model={p['model']} ==========", flush=True)
        try:
            out = _chat(p["base_url"], p["model"], api_key, prompt, image, max_tokens=2048, temperature=0.2)
            print(out, flush=True)
        except SystemExit:
            print(f"[error] {key} 调用失败（见上方报错）")
    print("\n（对比完成）")
```

</details>

**依据 5 · 源码核查**：[skills/vision-multimodal/vision.py:90-96](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L90-L96)

框JSON只存在于提示词。

```text
GROUNDING_TMPL = (
    "在图片中找出：{target}。"
    "对每一个找到的目标，输出一个 JSON 数组，格式严格为："
    '[{{"label":"目标名称","bbox":[x1,y1,x2,y2]}}]，'
    "坐标使用 0-1000 的归一化像素坐标（左上角为 0,0）。"
    "只输出 JSON，不要任何其他文字。"
)
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、监控与卸载会改什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Windows 安装脚本按 USERPROFILE 固定写 ~/.dsh，不采用可配置 DSH_HOME；先删除同名 Skill 再复制，截图工具同样覆盖，无备份/事务。MCP 三服务通过 web cordis.patch.yml 注册为 stdio uvx，Git 标签 core1.0.2/api1.0.3/video-memory1.0.1 和 httpx<0.28 约束清晰，但这不是锁定全部传递依赖。缺 uvx/Python/key 只提示；自测仅列 providers，不调用图片，因此安装完成不是视觉验收。

补丁检测是字符串命中：已有 qwen-mm-plugins 即跳过；文件任意独立 [] 行会触发整体重建，已有其它内容可能丢失。卸载正则从匹配的 Qwen insert 块删到文件末尾，若其后追加其它配置也可能被删；这由范围直接推得，未实测损坏。应先备份并人工对照配置，不能把“幂等”注释当保留既有配置保证。

可选截图监控用 TCP 端口可连接判断活跃，并不认证监听者是 DSH；活跃时每250ms检查新剪贴板图片，保存 PNG 后替换成路径，切活跃时先基线避免处理旧图。它不局限当前聚焦 DSH 窗口，其他应用复制图片也可被接管；也不直接上传，外发发生在后续工具调用。自启写 HKCU Run。卸载停 PID/删自启与安装目录，但不清图片目录/API 环境变量/云端记录，停止不等于删除数据。

#### 证据与依据

**依据 1 · 源码核查**：[install.ps1:23-36](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/install.ps1#L23-L36)

先删同名Skill再复制。

<details>
<summary>查看原文（14行）</summary>

```text
Write-Step '安装 skill'
$skillsSrc = Join-Path $scriptRoot 'skills'
$skillsDst = Join-Path $homeRoot '.dsh\skills'

if (-not (Test-Path $skillsSrc)) {
    Write-Warning "未找到 skills 目录：$skillsSrc"
} else {
    New-Item -ItemType Directory -Force -Path $skillsDst | Out-Null
    Get-ChildItem -Directory $skillsSrc | ForEach-Object {
        $name = $_.Name
        $dst  = Join-Path $skillsDst $name
        if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
        Copy-Item -Recurse -Force $_.FullName $dst
        Write-Host ("  [OK] 已安装 skill: " + $name) -ForegroundColor Green
```

</details>

**依据 2 · 源码核查**：[install.ps1:56-98](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/install.ps1#L56-L98)

固定标签MCP启动配置。

<details>
<summary>查看原文（43行）</summary>

```text
function Get-McpBlock([string]$uvxCmd) {
    return @"

- insert:
    - id: mcp-qwen-mm-plugins-core
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: qwen-mm-plugins-core
        transport: stdio
        command: '$uvxCmd'
        args:
          - '--from'
          - 'qwen-mm-plugins[core] @ git+https://github.com/QwenLM/Qwen-MM-Plugins.git@qwen-mm-plugins-core-v1.0.2'
          - '--with'
          - 'httpx<0.28'
          - 'qwen-mm-plugins-core'
        cwd: !!js process.cwd()
    - id: mcp-qwen-mm-plugins-api
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: qwen-mm-plugins-api
        transport: stdio
        command: '$uvxCmd'
        args:
          - '--from'
          - 'qwen-mm-plugins[api] @ git+https://github.com/QwenLM/Qwen-MM-Plugins.git@qwen-mm-plugins-api-v1.0.3'
          - '--with'
          - 'httpx<0.28'
          - 'qwen-mm-plugins-api'
        cwd: !!js process.cwd()
    - id: mcp-qwen-mm-plugins-video-memory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: qwen-mm-plugins-video-memory
        transport: stdio
        command: '$uvxCmd'
        args:
          - '--from'
          - 'qwen-mm-plugins[video-memory] @ git+https://github.com/QwenLM/Qwen-MM-Plugins.git@qwen-mm-plugins-video-memory-v1.0.1'
          - '--with'
          - 'httpx<0.28'
          - 'qwen-mm-plugins-video-memory'
        cwd: !!js process.cwd()
```

</details>

**依据 3 · 源码核查**：[install.ps1:102-127](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/install.ps1#L102-L127)

字符串去重与空列表整体重建。

<details>
<summary>查看原文（26行）</summary>

```text
$patchFile = Join-Path $homeRoot '.dsh\profiles\web\cordis.patch.yml'
$patchDir  = Split-Path $patchFile
New-Item -ItemType Directory -Force -Path $patchDir | Out-Null

$existing = ''
if (Test-Path $patchFile) { $existing = Get-Content -Raw $patchFile }

$hasQwen = $existing -match 'qwen-mm-plugins'
# 判断文件里是否残留了顶层空列表 []（默认新文件的标志，或上次安装损坏的标志）
$hasEmptyList = (($existing -split "`n") | Where-Object { $_.Trim() -eq '[]' }).Count -gt 0

if ($hasQwen -and -not $hasEmptyList) {
    Write-Host '  [~] cordis.patch.yml 已包含 qwen-mm-plugins，跳过注册。' -ForegroundColor Yellow
} else {
    $block = Get-McpBlock $uvx
    if ($hasEmptyList) {
        # 默认空文件（含 []）或上次安装损坏的文件（[] 残留）→ 整体重建
        $newContent = "# dsh profile patch (generated by DeepSeek Vision install)`n" + $block
    } else {
        # 有其它内容 → 追加到末尾
        $sep = if ($existing.EndsWith("`n")) { "" } else { "`n" }
        $newContent = $existing + $sep + $block
    }
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($patchFile, $newContent, $utf8NoBom)
    Write-Host '  [OK] 已把 core / api / video-memory 注册到 cordis.patch.yml' -ForegroundColor Green
```

</details>

**依据 4 · 源码核查**：[install.ps1:138-177](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/install.ps1#L138-L177)

工具覆盖、自检和providers自测。

<details>
<summary>查看原文（40行）</summary>

```text
Write-Step '安装截图工具'
$toolsSrc = Join-Path $scriptRoot 'tools\screenshot-tool'
$toolsDst = Join-Path $homeRoot '.dsh\tools\screenshot-tool'

if (-not (Test-Path $toolsSrc)) {
    Write-Warning "未找到截图工具目录：$toolsSrc"
} else {
    New-Item -ItemType Directory -Force -Path (Split-Path $toolsDst) | Out-Null
    if (Test-Path $toolsDst) { Remove-Item -Recurse -Force $toolsDst }
    Copy-Item -Recurse -Force $toolsSrc $toolsDst
    Write-Host '  [OK] 已安装截图工具: ~\.dsh\tools\screenshot-tool' -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# 4. 环境自检
# -----------------------------------------------------------------------------
Write-Step '环境自检'

$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) { Write-Host ("  [OK]  Python        " + $py.Source) -ForegroundColor Green }
else     { Write-Host '  [!!]  Python        未检测到（方式 B vision.py 需要，Python 3.7+）' -ForegroundColor Yellow }

if (-not $uvxMissing) { Write-Host ("  [OK]  uvx           " + $uvx) -ForegroundColor Green }
else                  { Write-Host '  [!!]  uvx           未检测到（方式 A MCP 需要）' -ForegroundColor Yellow }

$ff = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ff) { Write-Host ("  [OK]  ffmpeg        " + $ff.Source) -ForegroundColor Green }
else     { Write-Host '  [~]   ffmpeg        未检测到（视频抽帧/音频转写需要，可选）' -ForegroundColor Yellow }

if ($env:DASHSCOPE_API_KEY) { Write-Host '  [OK]  DASHSCOPE_API_KEY 已设置' -ForegroundColor Green }
else { Write-Host '  [!!]  DASHSCOPE_API_KEY 未设置（方式 A 云模型必需）' -ForegroundColor Yellow }

# -----------------------------------------------------------------------------
# 5. 快速自测 vision.py（若 python 可用）
# -----------------------------------------------------------------------------
if ($py) {
    Write-Step '自测 vision.py'
    $vp = Join-Path $skillsDst 'vision-multimodal\vision.py'
    if (Test-Path $vp) {
        try { & $py.Source $vp providers } catch { Write-Warning "自测失败：$($_.Exception.Message)" }
```

</details>

**依据 5 · 源码核查**：[tools/screenshot-tool/screenshot-autosave.ps1:20-34](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/tools/screenshot-tool/screenshot-autosave.ps1#L20-L34)

端口/目录/轮询。

<details>
<summary>查看原文（15行）</summary>

```text
$DsHost = '127.0.0.1'
# DeepSeek GUI port. Override with env var DS_PORT (default 3080).
if ($env:DS_PORT) { $DsPort = [int]$env:DS_PORT } else { $DsPort = 3080 }

# Screenshot save folder. Precedence: env var DS_SHOT_DIR, else
# %USERPROFILE%\Pictures\DeepSeek-Shots (created automatically on first run).
if ($env:DS_SHOT_DIR) {
    $saveDir = $env:DS_SHOT_DIR
} else {
    $saveDir = Join-Path $env:USERPROFILE 'Pictures\DeepSeek-Shots'
}

$checkMs  = 250    # clipboard poll interval while active
$idleMs   = 1500   # re-check interval while inactive
$pidFile  = Join-Path $env:TEMP 'ds-screenshot-monitor.pid'
```

</details>

**依据 6 · 源码核查**：[tools/screenshot-tool/screenshot-autosave.ps1:48-61](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/tools/screenshot-tool/screenshot-autosave.ps1#L48-L61)

仅TCP可达判断。

<details>
<summary>查看原文（14行）</summary>

```text
# Fast non-blocking TCP connect test: is the DeepSeek GUI up?
function Test-DsRunning {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $ar = $client.BeginConnect($DsHost, $DsPort, $null, $null)
        $ok = $ar.AsyncWaitHandle.WaitOne(400, $false)
        if (-not $ok) { return $false }
        try { $client.EndConnect($ar) } catch { return $false }
        return $true
    } catch {
        return $false
    } finally {
        $client.Close()
    }
```

</details>

**依据 7 · 源码核查**：[tools/screenshot-tool/screenshot-autosave.ps1:85-101](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/tools/screenshot-tool/screenshot-autosave.ps1#L85-L101)

本地保存并替换剪贴板。

<details>
<summary>查看原文（17行）</summary>

```text
# Save the clipboard image and put its path back on the clipboard.
function Save-ClipboardImage {
    try {
        $img = [System.Windows.Forms.Clipboard]::GetImage()
        if (-not $img) { return }
        try {
            $name = 'shot_' + (Get-Date -Format 'yyyyMMdd_HHmmss_fff') + '.png'
            $path = Join-Path $saveDir $name
            $img.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
            [System.Windows.Forms.Clipboard]::SetText($path)
            Write-Host ('[saved] ' + $path) -ForegroundColor Green
        } finally {
            $img.Dispose()
        }
    } catch {
        Write-Host ('[warn] ' + $_.Exception.Message) -ForegroundColor Yellow
    }
```

</details>

**依据 8 · 源码核查**：[tools/screenshot-tool/screenshot-autosave.ps1:113-138](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/tools/screenshot-tool/screenshot-autosave.ps1#L113-L138)

活跃基线与循环。

<details>
<summary>查看原文（26行）</summary>

```text
try {
    while ($true) {
        try {
            $active = Test-DsRunning
            if ($active) {
                if (-not $wasActive) {
                    # Just became active: baseline the current clipboard so we
                    # only intercept images taken AFTER DeepSeek is opened.
                    $lastHash = Get-ClipboardImageHash
                }
                $wasActive = $true

                $h = Get-ClipboardImageHash
                if ($h -and $h -ne $lastHash) {
                    Save-ClipboardImage
                    $lastHash = $h
                }
                Start-Sleep -Milliseconds $checkMs
            } else {
                $wasActive = $false
                $lastHash  = $null
                Start-Sleep -Milliseconds $idleMs
            }
        } catch {
            Start-Sleep -Milliseconds $idleMs
        }
```

</details>

**依据 9 · 源码核查**：[tools/screenshot-tool/install-autostart.bat:1-5](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/tools/screenshot-tool/install-autostart.bat#L1-L5)

注册用户登录自启。

```text
@echo off
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "DeepSeekScreenshotAutosave" /t REG_SZ /d "\"%~dp0start-screenshot-autosave.bat\"" /f
echo Installed to startup. The monitor will run at logon and
echo self-activate only while the DeepSeek GUI is open.
pause
```

**依据 10 · 源码核查**：[uninstall.ps1:13-59](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/uninstall.ps1#L13-L59)

卸载动作与删到文件末尾正则。

<details>
<summary>查看原文（47行）</summary>

```text
# 1. 停掉截图监控进程
Write-Step '停止截图监控'
$pidFile = Join-Path $env:TEMP 'ds-screenshot-monitor.pid'
if (Test-Path -LiteralPath $pidFile) {
    $mpid = (Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
    if ($mpid) { taskkill /PID $mpid /T /F 2>$null | Out-Null }
    Remove-Item -LiteralPath $pidFile -Force
    Write-Host '  [OK] 已停止截图监控进程' -ForegroundColor Green
} else {
    Write-Host '  [~] 未发现运行中的监控进程' -ForegroundColor Yellow
}

# 2. 移除开机自启
Write-Step '移除开机自启'
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "DeepSeekScreenshotAutosave" /f 2>$null | Out-Null
Write-Host '  [OK] 已移除自启项' -ForegroundColor Green

# 3. 移除 skill
Write-Step '移除 skill'
$skill = Join-Path $homeRoot '.dsh\skills\vision-multimodal'
if (Test-Path $skill) { Remove-Item -Recurse -Force $skill; Write-Host '  [OK] 已移除 vision-multimodal' -ForegroundColor Green }
else { Write-Host '  [~] 未找到 vision-multimodal' -ForegroundColor Yellow }

# 4. 移除截图工具
Write-Step '移除截图工具'
$tool = Join-Path $homeRoot '.dsh\tools\screenshot-tool'
if (Test-Path $tool) { Remove-Item -Recurse -Force $tool; Write-Host '  [OK] 已移除截图工具' -ForegroundColor Green }
else { Write-Host '  [~] 未找到截图工具' -ForegroundColor Yellow }

# 5. 移除 MCP 注册块（best-effort）
Write-Step '移除 MCP 注册块'
$patchFile = Join-Path $homeRoot '.dsh\profiles\web\cordis.patch.yml'
if (Test-Path $patchFile) {
    $content = Get-Content -Raw $patchFile
    # 删除以 "- insert:" 开头、首个子项为 mcp-qwen-mm-plugins-*、且延伸到文件末尾的整块
    $newContent = [regex]::Replace($content, '(?s)- insert:\s*\n\s+- id:\s*mcp-qwen-mm-plugins-.*\z', '')
    if ($newContent -ne $content) {
        $newContent = $newContent.TrimEnd("`r", "`n") + "`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($patchFile, $newContent, $utf8NoBom)
        Write-Host '  [OK] 已从 cordis.patch.yml 移除 qwen-mm-plugins 块' -ForegroundColor Green
    } else {
        Write-Host '  [~] 未在文件末尾找到 qwen-mm-plugins 块' -ForegroundColor Yellow
        Write-Host '      如仍残留，请手动打开 cordis.patch.yml 删除 mcp-qwen-mm-plugins-* 相关条目'
    }
} else {
    Write-Host '  [~] 未找到 cordis.patch.yml' -ForegroundColor Yellow
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应如何试用、成本和退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

先观察，优先在已有可信视觉服务中手动处理图片作基线；确需 Agent 内续任务时，仅复制 Skill/Python 到隔离测试位置，对一张自造无敏感小图调用所选服务，逐字/框坐标对照原图，不直接运行一键脚本修改日常 profile。测试图片解释与业务结果应分别验收；关键数字、身份材料和定位动作不能只凭生成文本。不要按 README 临时方案把 key 发进对话，凭据应由测试环境变量注入并核目标 base URL。

首次有 Python、DSH可用Skill/命令执行能力和服务凭据；MCP路线另需uvx、网络/依赖与部分媒体工具，Windows仅约束安装/截图路线而非标准库客户端全部平台。持续每次送整图、提示和输出，compare 可多次计费，120秒超时不代表提供方未处理；本地模型有硬件/电力。无当前报价、总时长和准确率测量，零第三方Python包不等于零成本。恢复先核是否已调用与错误，不盲目对比重跑。退出须分别停监控/自启、恢复配置备份、清截图和撤环境凭据，已外发图片另按服务方处理。识别不稳、剪贴板被误接管或配置难恢复时停用并回手工视觉工具。

#### 证据与依据

**依据 1 · 源码核查**：[skills/vision-multimodal/vision.py:132-170](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L132-L170)

整图请求和超时导致资源边界。

<details>
<summary>查看原文（39行）</summary>

```text
def _encode_image(path):
    p = Path(path)
    if not p.exists():
        sys.exit(f"[error] 图片不存在：{path}")
    mime = mimetypes.guess_type(str(p))[0] or "image/png"
    data = base64.b64encode(p.read_bytes()).decode("ascii")
    return {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{data}"}}


def _chat(base_url, model, api_key, prompt, image_paths, max_tokens=2048, temperature=0.2):
    content = [{"type": "text", "text": prompt}]
    for ip in image_paths or []:
        content.append(_encode_image(ip))

    body = {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    url = f"{base_url}/chat/completions"
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        sys.exit(f"[error] HTTP {e.code}：{detail[:500]}")
    except urllib.error.URLError as e:
        sys.exit(f"[error] 网络错误：{e.reason}")

    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        sys.exit(f"[error] 响应格式异常：{json.dumps(data, ensure_ascii=False)[:500]}")
```

</details>

**依据 2 · 源码核查**：[skills/vision-multimodal/vision.py:198-223](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L198-L223)

多个供应商独立请求。

<details>
<summary>查看原文（26行）</summary>

```text
def cmd_compare(args):
    if not args.image:
        sys.exit("[error] compare 需要 --image")
    prompt = args.prompt or "请详细描述这张图片的内容。"
    models = [m.strip() for m in (args.models or "").split(",") if m.strip()]
    if not models:
        sys.exit("[error] compare 需要 --models，例如 --models qwen,glm,kimi")

    image = [args.image]
    for key in models:
        if key not in PRESETS:
            print(f"\n[skip] 未知供应商：{key}（可选：{', '.join(PRESETS.keys())}）")
            continue
        p = PRESETS[key]
        key_env = p.get("key_env")
        api_key = os.environ.get(key_env) if key_env else None
        if key_env and not api_key:
            print(f"\n[skip] {key}：缺少环境变量 {key_env}")
            continue
        print(f"\n========== {p['name']} | model={p['model']} ==========", flush=True)
        try:
            out = _chat(p["base_url"], p["model"], api_key, prompt, image, max_tokens=2048, temperature=0.2)
            print(out, flush=True)
        except SystemExit:
            print(f"[error] {key} 调用失败（见上方报错）")
    print("\n（对比完成）")
```

</details>

**依据 3 · 源码核查**：[skills/vision-multimodal/SKILL.md:88-97](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/SKILL.md#L88-L97)

作者路径/坐标/凭据/产物提示。

<details>
<summary>查看原文（10行）</summary>

```text
## 关键注意点
- **路径一律用绝对路径**；中文路径可直接传，别用相对路径。
- **grounding 坐标是 0–1000 归一化**，不是像素；`draw_bbox` / `crop` 用同一套坐标，别换算错。
- **先 `media_info` 再处理视频**：省时，且能避开 VFR、旋转、无音轨这些坑。
- **模型默认**：视觉 `qwen3.7-plus`，Omni `qwen3.5-omni-plus`，一般不用覆盖。
- **省钱**：视频默认 1 fps、约 448² 抽帧已经够用；别乱调高 `fps`，除非要抓快动作。
- **切换供应商（方式 B）**：改 `config.json` 的 `provider`；临时覆盖用 `--provider / --model / --base-url / --api-key`。
- **API Key 只放环境变量**，别写进 config.json（已被 .gitignore 忽略，避免泄露）。
- **鉴权/401 报错**：先按 `references/api-key-setup.md` 配好 `DASHSCOPE_API_KEY` 再重试，别硬试。
- **结果要落地**：用户要「看到框」就给带框图；要「文字」就给整理好的文本；要「统计」就给总数+时间点，别只回一句结论。
```

</details>

**依据 4 · 源码核查**：[uninstall.ps1:13-59](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/uninstall.ps1#L13-L59)

需要区分退出与数据/配置恢复。

<details>
<summary>查看原文（47行）</summary>

```text
# 1. 停掉截图监控进程
Write-Step '停止截图监控'
$pidFile = Join-Path $env:TEMP 'ds-screenshot-monitor.pid'
if (Test-Path -LiteralPath $pidFile) {
    $mpid = (Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
    if ($mpid) { taskkill /PID $mpid /T /F 2>$null | Out-Null }
    Remove-Item -LiteralPath $pidFile -Force
    Write-Host '  [OK] 已停止截图监控进程' -ForegroundColor Green
} else {
    Write-Host '  [~] 未发现运行中的监控进程' -ForegroundColor Yellow
}

# 2. 移除开机自启
Write-Step '移除开机自启'
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "DeepSeekScreenshotAutosave" /f 2>$null | Out-Null
Write-Host '  [OK] 已移除自启项' -ForegroundColor Green

# 3. 移除 skill
Write-Step '移除 skill'
$skill = Join-Path $homeRoot '.dsh\skills\vision-multimodal'
if (Test-Path $skill) { Remove-Item -Recurse -Force $skill; Write-Host '  [OK] 已移除 vision-multimodal' -ForegroundColor Green }
else { Write-Host '  [~] 未找到 vision-multimodal' -ForegroundColor Yellow }

# 4. 移除截图工具
Write-Step '移除截图工具'
$tool = Join-Path $homeRoot '.dsh\tools\screenshot-tool'
if (Test-Path $tool) { Remove-Item -Recurse -Force $tool; Write-Host '  [OK] 已移除截图工具' -ForegroundColor Green }
else { Write-Host '  [~] 未找到截图工具' -ForegroundColor Yellow }

# 5. 移除 MCP 注册块（best-effort）
Write-Step '移除 MCP 注册块'
$patchFile = Join-Path $homeRoot '.dsh\profiles\web\cordis.patch.yml'
if (Test-Path $patchFile) {
    $content = Get-Content -Raw $patchFile
    # 删除以 "- insert:" 开头、首个子项为 mcp-qwen-mm-plugins-*、且延伸到文件末尾的整块
    $newContent = [regex]::Replace($content, '(?s)- insert:\s*\n\s+- id:\s*mcp-qwen-mm-plugins-.*\z', '')
    if ($newContent -ne $content) {
        $newContent = $newContent.TrimEnd("`r", "`n") + "`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($patchFile, $newContent, $utf8NoBom)
        Write-Host '  [OK] 已从 cordis.patch.yml 移除 qwen-mm-plugins 块' -ForegroundColor Green
    } else {
        Write-Host '  [~] 未在文件末尾找到 qwen-mm-plugins 块' -ForegroundColor Yellow
        Write-Host '      如仍残留，请手动打开 cordis.patch.yml 删除 mcp-qwen-mm-plugins-* 相关条目'
    }
} else {
    Write-Host '  [~] 未找到 cordis.patch.yml' -ForegroundColor Yellow
```

</details>

#### 缺口

- 未运行Windows安装/监控、宿主Skill或服务请求，未验准确率/价目。
  **影响**：只支持隔离图片桥接观察，不能推荐一键完整媒体能力。
  **进一步探讨**：用自造图记录正确字数/框误差、请求次数、耗时和配置前后差异。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 下一步什么改进可证伪？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证方向是把安装改为“配置变更预览+按ID结构化合并+带备份回滚”，并把图片执行输出变为明确成功/跳过/失败计数及原图/供应商/结果格式校验。当前提供 providers 列表和文本错误已有价值，候选只补安装提交与业务结果验收之间缺口，不把上游视觉模型再包装为自有创新。

最小对照给已有无关 insert、残留[]、旧Qwen项、后续追加项和全失败compare五类样本，在不接真实凭据的隔离环境比较无关配置保留、退出码/成功计数与人工恢复时间。成本是YAML解析依赖、版本兼容和备份含凭据的保护；没有减少误判/配置损失却增加维护时应否定，单次手动Python用户不必承担新安装器。本轮未实现或运行此方案。

#### 证据与依据

**依据 1 · 源码核查**：[install.ps1:102-127](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/install.ps1#L102-L127)

可测试的覆盖/跳过分支。

<details>
<summary>查看原文（26行）</summary>

```text
$patchFile = Join-Path $homeRoot '.dsh\profiles\web\cordis.patch.yml'
$patchDir  = Split-Path $patchFile
New-Item -ItemType Directory -Force -Path $patchDir | Out-Null

$existing = ''
if (Test-Path $patchFile) { $existing = Get-Content -Raw $patchFile }

$hasQwen = $existing -match 'qwen-mm-plugins'
# 判断文件里是否残留了顶层空列表 []（默认新文件的标志，或上次安装损坏的标志）
$hasEmptyList = (($existing -split "`n") | Where-Object { $_.Trim() -eq '[]' }).Count -gt 0

if ($hasQwen -and -not $hasEmptyList) {
    Write-Host '  [~] cordis.patch.yml 已包含 qwen-mm-plugins，跳过注册。' -ForegroundColor Yellow
} else {
    $block = Get-McpBlock $uvx
    if ($hasEmptyList) {
        # 默认空文件（含 []）或上次安装损坏的文件（[] 残留）→ 整体重建
        $newContent = "# dsh profile patch (generated by DeepSeek Vision install)`n" + $block
    } else {
        # 有其它内容 → 追加到末尾
        $sep = if ($existing.EndsWith("`n")) { "" } else { "`n" }
        $newContent = $existing + $sep + $block
    }
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($patchFile, $newContent, $utf8NoBom)
    Write-Host '  [OK] 已把 core / api / video-memory 注册到 cordis.patch.yml' -ForegroundColor Green
```

</details>

**依据 2 · 源码核查**：[uninstall.ps1:42-56](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/uninstall.ps1#L42-L56)

可测试的删除范围。

<details>
<summary>查看原文（15行）</summary>

```text
# 5. 移除 MCP 注册块（best-effort）
Write-Step '移除 MCP 注册块'
$patchFile = Join-Path $homeRoot '.dsh\profiles\web\cordis.patch.yml'
if (Test-Path $patchFile) {
    $content = Get-Content -Raw $patchFile
    # 删除以 "- insert:" 开头、首个子项为 mcp-qwen-mm-plugins-*、且延伸到文件末尾的整块
    $newContent = [regex]::Replace($content, '(?s)- insert:\s*\n\s+- id:\s*mcp-qwen-mm-plugins-.*\z', '')
    if ($newContent -ne $content) {
        $newContent = $newContent.TrimEnd("`r", "`n") + "`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($patchFile, $newContent, $utf8NoBom)
        Write-Host '  [OK] 已从 cordis.patch.yml 移除 qwen-mm-plugins 块' -ForegroundColor Green
    } else {
        Write-Host '  [~] 未在文件末尾找到 qwen-mm-plugins 块' -ForegroundColor Yellow
        Write-Host '      如仍残留，请手动打开 cordis.patch.yml 删除 mcp-qwen-mm-plugins-* 相关条目'
```

</details>

**依据 3 · 源码核查**：[skills/vision-multimodal/vision.py:207-223](https://github.com/Yts1919/dsh-vision-complete/blob/9526ccd4ddeb50ba245b693f137ff4ee0432d5a4/skills/vision-multimodal/vision.py#L207-L223)

全跳过/失败仍完成的文本边界。

<details>
<summary>查看原文（17行）</summary>

```text
    for key in models:
        if key not in PRESETS:
            print(f"\n[skip] 未知供应商：{key}（可选：{', '.join(PRESETS.keys())}）")
            continue
        p = PRESETS[key]
        key_env = p.get("key_env")
        api_key = os.environ.get(key_env) if key_env else None
        if key_env and not api_key:
            print(f"\n[skip] {key}：缺少环境变量 {key_env}")
            continue
        print(f"\n========== {p['name']} | model={p['model']} ==========", flush=True)
        try:
            out = _chat(p["base_url"], p["model"], api_key, prompt, image, max_tokens=2048, temperature=0.2)
            print(out, flush=True)
        except SystemExit:
            print(f"[error] {key} 调用失败（见上方报错）")
    print("\n（对比完成）")
```

</details>

#### 缺口

- 未证明安装损失实际发生频率或改进收益。
  **影响**：只形成设计候选，不能当现有能力。
  **进一步探讨**：以隔离配置样本与失败请求桩进行对照后决定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
