# Agent Vision Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[328c0ae](https://github.com/Anionex/agent-vision-toolkit/tree/328c0ae015a109d0b5539f0dd38cd65974b8147e)

<!-- BEGIN META -->
[![GitHub ★ 1,250](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C250&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/agent-vision-toolkit)
<!-- END META -->

> **功能**：为文本编码 Agent 提供图像问答、定位、长截图 OCR、像素处理与可选视觉代理。

> **亮点**：保留文本Agent工作流而把视觉推理按需外置，结合任务路由和精确像素工具；视觉模型能力不归本仓库原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：描述转文本可能损失视觉信息，坐标网格非像素精确；图像API出站及切块/重试投入会抵消预期便利，不能仅凭演示认定更好。[Q03](#research-q03)

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
  - [Q01 · 文本模型用户从视觉工具链获得什么，相对直接用视觉模型有何区别？](#detail-section-11)
  - [Q02 · 图像如何送到视觉模型，哪些属于本仓库而非DSH子模块？](#detail-section-12)
  - [Q03 · 什么时候额外视觉层收益可能被误读或抵消？](#detail-section-13)
  - [Q04 · 如何验证分块结果可追溯比全图描述更可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：文本模型编码Agent需读图或长截图时按需调用视觉CLI；已具备合格原生视觉可继续原流程。[Q01](#research-q01)

直接多模态模型或手工问图后复制描述；文本Agent保留原流程是可解释增量，未证明普遍更优。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 视觉CLI/Skill | 图像问答、定位与处理流程 | 外部视觉服务、需原图核对 |
| 长截图流程 | 分块OCR和风险检查 | 增加调用，未证完整准确 |
| 透明代理 | 改写视觉消息供文本模型 | 可选，需单独审权限和协议 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python及图像依赖 | CLI必需 | 编码与处理 | 先核依赖 |
| 视觉API/密钥/协议 | 模型操作必需 | 图片转回答 | 缺配置明确失败 |
| 图像出站许可 | 远程推理必需 | 发送截图 | 敏感图改用本地/人工 |
| 代理或宿主扩展 | 可选 | 透明输入 | 可只用CLI |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户核视觉服务和公开样图 | 明确出站与费用 |
| 选择 | Agent按问题用CLI | 描述、定位或像素工具相符 |
| 验收 | 用户回看原图与局部 | 漏字误定位则停或补读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python依赖、视觉API账号；金额未知 | 配置凭据协议并审图像出站 | 代理为额外可选接线 |
| 持续使用 | 图像调用、重试和存储 | 核对文字、坐标和原图 | 金额/合格任务量未测 |
| 失败恢复 | 补读区域和额外调用 | 查漏段、重复及代理配置 | 输出短不等完整 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文本Agent图像入口 | 外部视觉请求协议 | 最终任务质量 |
| 长图处理 | 分块与摘要结构 | 漏字、重复和净成本 |
| 精确图像操作 | Skill分工说明 | 实际像素工具结果 |

> **思考**：描述转文本可能损失视觉信息，坐标网格非像素精确；图像API出站及切块/重试投入会抵消预期便利，不能仅凭演示认定更好。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：保留文本Agent工作流而把视觉推理按需外置，结合任务路由和精确像素工具；视觉模型能力不归本仓库原创。[Q01](#research-q01) [Q02](#research-q02)

按问题路由模型与像素工具、提示版本和图像摘要可借鉴；透明代理需额外验证消息改写和隐私，不能由CLI通过推断。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

描述转文本可能损失视觉信息，坐标网格非像素精确；图像API出站及切块/重试投入会抵消预期便利，不能仅凭演示认定更好。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议公开截图的手工CLI限定试用，先保留原图复核和现有模型；敏感出站、漏段或重试成本不可控时停用并回原生视觉/人工检查。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

CLI/协议和切块结构可核对；作者真实会话与优于原生模型主张未独立复现。逐项图像追溯为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、skills/vision-skills/SKILL.md、vision_client.py、vision_proxy.py、skills/vision-skills/scripts/long_screenshot_ocr.py、.gitmodules 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读根说明、Skill、视觉Python client、代理候选与长图脚本；未初始化DSH子模块、执行CLI/API、测试或验证代理全链。Python不计JS/TS LOC。
- 下一步：固定公开长截图、模型与预算，比较三组完整性、坐标误差、全部调用及人工复核；本轮未执行。[Q04](#research-q04)

**分析版本**

- **仓库**：[Anionex/agent-vision-toolkit](https://github.com/Anionex/agent-vision-toolkit)
- **版本号**：未声明（[固定提交 328c0ae](https://github.com/Anionex/agent-vision-toolkit/tree/328c0ae015a109d0b5539f0dd38cd65974b8147e)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是逐项绑定原图摘要、区域和风险，只补读高风险边界，比较完整性与全部复核成本。[Q04](#research-q04)

固定公开长截图、模型与预算，比较三组完整性、坐标误差、全部调用及人工复核；本轮未执行。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 3425 | — | — | 38953 |
| .md | example | 2 | 472 | — | — | 3054 |
| .ts | source | 2 | 765 | 599 | 106 | — |
| .mjs | test | 1 | 247 | 211 | 13 | — |
| .jsx | source | 3 | 630 | 589 | 1 | — |
| .js | source | 1 | 8 | 6 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Anionex/agent-vision-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Anionex/agent-vision-toolkit/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Anionex/agent-vision-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工具式视觉层怎样补足文本Agent，图像出站、精度和代理负担是否限制收益？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文本模型用户从视觉工具链获得什么，相对直接用视觉模型有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是主要使用文本模型、但要读图、重建界面或识别长截图的编码Agent用户。该仓库提供本地CLI、vision-skills和可选透明代理，图像被外部视觉模型解释后再交文本Agent；不是让文本模型自身获得视觉编码器。相对切换整个编码模型到原生多模态，它可保留原工作流并按需调用视觉能力；相对手工问图再复制描述，它把图像、当前意图和后续裁剪/定位串起来。合格结果应是目标文字、位置或界面重建被原图复核，不能以生成描述或演示图视为成功。README“更好”与真实会话验证是作者报告，未经本轮独立复现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-39](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/README.md#L29-L39)

工具/Skill与透明集成分类及作者效果主张。

<details>
<summary>查看原文（11行）</summary>

```text

This repository provides two kinds of components:
1. **Vision tool CLIs** — multiple CLIs, plus a skill that teaches the agent when to use each one. Any agent that can invoke a shell can use them.
2. **Seamless integration** *(optional upgrade)* — a transparent local proxy and single-file native plugins, so **images we paste and the agent's built-in image tools both work seamlessly**, with no extra tool installation or additional prompting.

All code has been verified in real Codex + DeepSeek sessions, and the same pipeline has been live-verified end-to-end in Claude Code, Pi, Oh My Pi, and OpenCode.

> If this project helps you or gives you some inspiration, feel free to star🌟 & fork.

## ❤️ Sponsor

```

</details>

**依据 2 · 源码核查**：[skills/vision-skills/SKILL.md:16-44](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/SKILL.md#L16-L44)

工具任务分工与坐标精度限制。

<details>
<summary>查看原文（29行）</summary>

```text
Five local CLIs that give a text-only agent eyes. They read one shared
vision config (`VISION_API_KEY` / `VISION_BASE_URL` / `VISION_MODEL` /
`LANG`), plus the optional Python-client settings `VISION_API_PROTOCOL`,
`VISION_REASONING_EFFORT`, and `VISION_USER_AGENT` — no extra credentials.

Pick the tool by the question you are answering:

| Question | Tool |
|---|---|
| "What does this image show / say?" | `glance` |
| "Where is X?" — a thing you can name | `ground` |
| "Where are all the Xs?" — every instance of a kind | `detect` |
| "What is its exact shape, size, offset?" | `trace` |
| "Cut this box out as its own image file" | `crop` |
| "OCR this long screenshot / scrolling page / chat history" | `scripts/long_screenshot_ocr.py` |
| "Extract the icon/logo foreground as transparent PNG — manual region or auto (cropped+scaled screenshots)" | `scripts/extract_fg.py` |
| "Turn this HTML file into a viewport or full-page screenshot" | `scripts/html_shot.py` |
| "Which colours dominate a region, and which palette value fits it?" | `scripts/dominant_colors.py` |
| A relation none of them return — a gap, a distance between two located things | code over the pixels (Pillow) |

`glance` answers what something is; `ground` and `detect` answer where.
You give `ground` a description of a particular thing; you give `detect` a
kind and it enumerates the instances.

Both give real coordinates, but they are not pixel-exact: the box arrives
on a 0-1000 grid and is scaled to your image, so the last pixel or few are
not reliable. That is accurate enough to crop with, to click, to compare
positions against. When a number has to be exact, `trace` derives it from
the actual pixels — offsets, sizes, shapes.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图像如何送到视觉模型，哪些属于本仓库而非DSH子模块？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

共享Python client从环境读取VISION_BASE_URL/API_KEY/MODEL，图像转data URL后按Responses、Chat Completions或Anthropic协议请求外部服务。Skill按任务分glance/ground/detect/trace/crop，长截图脚本规划块、保存图像摘要和边界；代理从消息中提取图像与意图再改写请求。本仓库的DSH原生适配是独立dsh-vision-toolkit Git子模块，未初始化子模块不能把README十个DSH工具认作根组件已确认定义。可借鉴是按问题选择精确像素处理或模型描述，而非把所有测量交视觉模型；移植需协议、凭据、Python依赖及宿主接线。

#### 证据与依据

**依据 1 · 源码核查**：[vision_client.py:85-97](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/vision_client.py#L85-L97)

必需配置与图像编码。

<details>
<summary>查看原文（13行）</summary>

```text
def validate_vision_config() -> None:
    for name in ("VISION_API_KEY", "VISION_BASE_URL", "VISION_MODEL"):
        _required(name)


def image_path_to_data_url(path: str | os.PathLike[str]) -> str:
    image_path = Path(path).expanduser()
    if not image_path.is_file():
        raise VisionError(f"Image not found: {image_path}")
    mime, _ = mimetypes.guess_type(image_path.name)
    if mime not in {"image/png", "image/jpeg", "image/gif", "image/webp"}:
        raise VisionError("Only PNG, JPEG, GIF, and WebP images are supported")
    return f"data:{mime};base64,{base64.b64encode(image_path.read_bytes()).decode()}"
```

</details>

**依据 2 · 源码核查**：[vision_client.py:207-252](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/vision_client.py#L207-L252)

视觉请求协议和负载。

<details>
<summary>查看原文（46行）</summary>

```text
def describe_image(image_url: str | list[str], prompt: str | None = None, max_tokens: int = 4096,
                   apply_lang: bool = True) -> str:
    """Describe one data/http image URL (str) or several (list) in a single call."""
    validate_vision_config()
    urls = [image_url] if isinstance(image_url, str) else list(image_url)
    if not urls:
        raise VisionError("No image was provided")
    for url in urls:
        if not url.startswith(("data:", "http://", "https://")):
            raise VisionError("Only data URLs or http(s) image URLs are supported")
    base_url = _required("VISION_BASE_URL").rstrip("/")
    api_key = _required("VISION_API_KEY")
    user_agent = os.environ.get("VISION_USER_AGENT", "").strip() or DEFAULT_USER_AGENT
    text = prompt or DEFAULT_PROMPT
    if apply_lang:
        instruction = LANG_INSTRUCTIONS.get(os.environ.get("LANG", "").strip().lower())
        if instruction:
            text = f"{instruction}\n\n{text}"
    model = _required("VISION_MODEL")
    protocol = os.environ.get("VISION_API_PROTOCOL", "").strip().lower() or "chat_completions"
    if protocol == "responses":
        payload = {
            "model": model,
            "store": False,
            "input": [{"role": "user", "content": [
                {"type": "input_image", "image_url": url} for url in urls
            ] + [{"type": "input_text", "text": text}]}],
        }
        if max_tokens is not None:
            payload["max_output_tokens"] = max_tokens
        reasoning_effort = os.environ.get("VISION_REASONING_EFFORT", "").strip()
        if reasoning_effort:
            payload["reasoning"] = {"effort": reasoning_effort}
        endpoint = "/responses"
        extract_text = _responses_text
    elif protocol == "chat_completions":
        payload = {
            "model": model,
            "stream": False,
            "messages": [{"role": "user", "content": [
            {"type": "image_url", "image_url": {"url": url}} for url in urls
            ] + [{"type": "text", "text": text}]}],
        }
        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        endpoint = "/chat/completions"
```

</details>

**依据 3 · 源码核查**：[vision_client.py:275-293](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/vision_client.py#L275-L293)

外部API认证、请求和重试。

<details>
<summary>查看原文（19行）</summary>

```text
    headers = {
        "Content-Type": "application/json",
        "User-Agent": user_agent,
    }
    if protocol == "anthropic":
        headers.update({
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        })
    else:
        headers["Authorization"] = "Bearer " + api_key
    request = urllib.request.Request(base_url + endpoint, data=json.dumps(payload).encode(), headers=headers)
    retries = 2
    timeout = 180
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                raw = response.read()
                data = json.loads(_decompress_body(raw, response))
```

</details>

**依据 4 · 源码核查**：[skills/vision-skills/scripts/long_screenshot_ocr.py:31-61](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/scripts/long_screenshot_ocr.py#L31-L61)

OCR提示版本及切块图像摘要。

<details>
<summary>查看原文（31行）</summary>

```text
ANALYSIS_WIDTH = 900
SAFE_OCCUPANCY_LEVEL = 20.0
# Bump when the OCR output contract changes so --resume cannot reuse stale results.
OCR_PROMPT_VERSION = 5


@dataclass(frozen=True)
class CoreRange:
    top: int
    bottom: int
    cut_energy: float | None
    cut_quality: float | None
    top_safe_margin: int | None
    bottom_safe_margin: int | None


@dataclass(frozen=True)
class Chunk:
    index: int
    core_top: int
    core_bottom: int
    crop_top: int
    crop_bottom: int
    top_overlap: int
    bottom_overlap: int
    cut_energy: float | None
    cut_quality: float | None
    top_safe_margin: int | None
    bottom_safe_margin: int | None
    image_path: Path
    image_sha256: str
```

</details>

**依据 5 · 源码核查**：[.gitmodules:1-3](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/.gitmodules#L1-L3)

DSH适配独立子模块归属。

```text
[submodule "dsh-vision-toolkit"]
	path = dsh-vision-toolkit
	url = https://github.com/Anionex/dsh-vision-toolkit.git
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候额外视觉层收益可能被误读或抵消？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

额外描述层可能丢失原图关系、漏字或给错坐标，Skill自己说明ground/detect的0-1000坐标不是像素精确；视觉回答不能代替原图复核。外部模型需要密钥与图像上传，截图中的业务与隐私数据也随之出站，文本模型不支持图像并不减少此风险。一次请求最多两次重试、每次180秒超时，长截图切块会增加调用与结果合并，不能把某演示复现或单次低价当单位合格任务收益。可限定公开截图做手工CLI试用，先不用透明代理；原生多模态已经足够时新增代理无必要。出现漏段、错误定位、敏感图片或重试成本高，应停并回原图人工/原生视觉检查。

#### 证据与依据

**依据 1 · 源码核查**：[skills/vision-skills/SKILL.md:40-44](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/SKILL.md#L40-L44)

作者说明坐标网格精度。

```text
Both give real coordinates, but they are not pixel-exact: the box arrives
on a 0-1000 grid and is scaled to your image, so the last pixel or few are
not reliable. That is accurate enough to crop with, to click, to compare
positions against. When a number has to be exact, `trace` derives it from
the actual pixels — offsets, sizes, shapes.
```

**依据 2 · 源码核查**：[skills/vision-skills/SKILL.md:78-90](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/SKILL.md#L78-L90)

先差异定位与长图下采样风险。

<details>
<summary>查看原文（13行）</summary>

```text
When you do compare with `glance`, pass all paths to one call — separate
calls cannot see both images, so two descriptions compared afterwards are
two hallucination surfaces, not a comparison. `--region` uploads only the
crop, so small text and icons become readable.

But "what changed between these two?" is not a glance question. A one-word
badge or a small shift is a rounding error to a vision model and exact to
`scripts/pixel_diff.py`. Diff first to get the box, then `glance --region`
that box to read what the change actually is.

For a tall scrolling screenshot, do not send the whole image through one OCR
call and accept the model's downscaling loss. Run the long-screenshot workflow,
which finds low-content cut bands, invokes `glance` on each chunk, uses
```

</details>

**依据 3 · 源码核查**：[vision_client.py:275-293](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/vision_client.py#L275-L293)

真实出站及重试超时条件。

<details>
<summary>查看原文（19行）</summary>

```text
    headers = {
        "Content-Type": "application/json",
        "User-Agent": user_agent,
    }
    if protocol == "anthropic":
        headers.update({
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        })
    else:
        headers["Authorization"] = "Bearer " + api_key
    request = urllib.request.Request(base_url + endpoint, data=json.dumps(payload).encode(), headers=headers)
    retries = 2
    timeout = 180
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                raw = response.read()
                data = json.loads(_decompress_body(raw, response))
```

</details>

#### 缺口

- 没有同任务直接视觉基线的完整性、成本和时间对照。
  **影响**：不能声称优于原生多模态或普遍省钱。
  **进一步探讨**：用公开固定截图比较漏字、误定位、修正耗时及全部API调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证分块结果可追溯比全图描述更可靠？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是让每项文字和坐标结论绑定原图摘要、裁剪区域与边界风险，并只对高风险切分处补读；由Q02已有切块摘要和Q03漏字/网格限制推导。相对一次全图描述，可能减少漏段并把人工复核集中到边界，但增加裁剪调用和维护负担。最小实验使用固定公开长截图与像素位置真值，比较全图、当前分块和带逐项来源原型，测漏字、重复、坐标误差、总调用成本及复核时间。若真值错误未减少或总复核投入更大，就否定该设计当前价值；不能把脚本已有manifest当最终效果验证。

#### 证据与依据

**依据 1 · 源码核查**：[skills/vision-skills/scripts/long_screenshot_ocr.py:31-61](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/scripts/long_screenshot_ocr.py#L31-L61)

切块结构和摘要提供追溯基础。

<details>
<summary>查看原文（31行）</summary>

```text
ANALYSIS_WIDTH = 900
SAFE_OCCUPANCY_LEVEL = 20.0
# Bump when the OCR output contract changes so --resume cannot reuse stale results.
OCR_PROMPT_VERSION = 5


@dataclass(frozen=True)
class CoreRange:
    top: int
    bottom: int
    cut_energy: float | None
    cut_quality: float | None
    top_safe_margin: int | None
    bottom_safe_margin: int | None


@dataclass(frozen=True)
class Chunk:
    index: int
    core_top: int
    core_bottom: int
    crop_top: int
    crop_bottom: int
    top_overlap: int
    bottom_overlap: int
    cut_energy: float | None
    cut_quality: float | None
    top_safe_margin: int | None
    bottom_safe_margin: int | None
    image_path: Path
    image_sha256: str
```

</details>

**依据 2 · 源码核查**：[skills/vision-skills/SKILL.md:83-90](https://github.com/Anionex/agent-vision-toolkit/blob/328c0ae015a109d0b5539f0dd38cd65974b8147e/skills/vision-skills/SKILL.md#L83-L90)

局部差异和长图信息损失是问题动因。

```text
But "what changed between these two?" is not a glance question. A one-word
badge or a small shift is a rounding error to a vision model and exact to
`scripts/pixel_diff.py`. Diff first to get the box, then `glance --region`
that box to read what the change actually is.

For a tall scrolling screenshot, do not send the whole image through one OCR
call and accept the model's downscaling loss. Run the long-screenshot workflow,
which finds low-content cut bands, invokes `glance` on each chunk, uses
```

#### 缺口

- 逐项可追溯输出是否改善合格交付未实测。
  **影响**：仍为设计假设。
  **进一步探讨**：在相同图像与模型预算下做三组对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
