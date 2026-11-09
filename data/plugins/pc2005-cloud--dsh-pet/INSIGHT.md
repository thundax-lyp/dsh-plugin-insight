# dsh-pet 素材制作工程

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[be4536d](https://github.com/PC2005-cloud/dsh-pet/tree/be4536da0ca71947058777d904874977ab9ab841)

<!-- BEGIN META -->
[![GitHub ★ 5,847](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C847&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet)
<!-- END META -->

> **功能**：将自动绿幕或手工抠像片段对齐并编码为桌宠动画，另提供 Safari 兼容素材派生。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把两类输入、可复用站姿归一化与编码串起，减少重复手工步骤的实际人时待测。

> **主要限制**：[Q03](#research-q03) 的抽帧失败会计入 OK，workflow 只取样且打印流信息。发布可用性和目标端透明播放需独立验收。

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
  - [Q01 · 哪类素材任务值得使用根工具链，如何与手工制作比较？](#detail-section-11)
  - [Q02 · 自动与手工输入在哪汇合，几何与编码如何执行？](#detail-section-12)
  - [Q03 · 透明检查能否作发布门禁，兼容产物有什么边界？](#detail-section-13)
  - [Q04 · 初次制作用到什么，重试和回退成本在哪里？](#detail-section-14)
  - [Q05 · 增加失败拒绝和多帧复核能否减少漏检？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 为 DSH 桌宠新角色或新增动作制作片段，需核对连续片段的透明、站姿和脚底。

[Q01](#research-q01) 的手工方案在剪辑器内逐段处理，保留精细遮罩控制，脚本统一下游操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 自动与人工抠像接入 | 产生统一 step02 | 源输入须有合适绿幕或已有 alpha |
| 站姿对齐与播放编码 | 输出 VP9 变体 | 仍需人工核对裁切、姿态与转场 |
| HEVC 派生 | 面向 Safari/WKWebView | 依赖 macOS，抽样检查有漏检 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 授权样片及目标播放端 | 是 | 制作及透明验收 | 停止替换 |
| Python、FFmpeg/FFprobe、NumPy | 按路径 | 抠像、对齐与编码 | 适配固定路径 |
| 带 alpha 的剪辑导出 | 仅人工路线 | 生成 MOV 输入 | 改用可验收的自动路线 |
| macOS 与 Swift 工具链 | 仅 HEVC 派生 | 原生透明 MOV 编码 | 暂不交付该兼容格式 |

[Q02](#research-q02) 准备源片，抠像后进入 step02，校正站姿与脚底，生成播放变体。[Q03](#research-q03) 描述兼容格式的另行派生与验收。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 源片及转码环境，金额未知 | 样片、提示、路径和权限核对 | 工作区工具与源 MP4 不在根代码树 |
| 持续 | CPU、空间，兼容派生占用 macOS | 手工抠像与逐片播放 | 编码与人工时未测 |
| 失败恢复 | 重转码及留存旧产物 | 检查增量复用、复核透明和回滚 | 单帧检查可误计成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同步素材几何 | 两类输入共享站姿、脚底与编码 | 视觉一致和节省时长 |
| 兼容派生 | 有 Swift 编码、抽样和发布接线 | 每一段的真实透明与播放 |

> **思考**：[Q03](#research-q03) 的抽帧失败会计入 OK，workflow 只取样且打印流信息。发布可用性和目标端透明播放需独立验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把两类输入、可复用站姿归一化与编码串起，减少重复手工步骤的实际人时待测。

[Q02](#research-q02) 全帧并集写元数据，未作为裁切门禁。[Q03](#research-q03) 抽帧失败的通过分支削弱发布检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的抽帧失败会计入 OK，workflow 只取样且打印流信息。发布可用性和目标端透明播放需独立验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离样片做第一段，保存旧产物并记录工具和人工成本。验收透明、脚底、转场和目标播放后再同步。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

素材路径、几何测量、编码和发布检查弱点有固定源码依据。质量、播放兼容与人时未实测。

- 已检查：作者 README、包清单、源码路径 MAKE-YOUR-OWN-PET.md、README.md、scripts/chroma_step02.py、scripts/pr_import_step02.py、scripts/normalize_step03.py、scripts/encode_thumbs.py、scripts/encode_hevc_alpha.sh、.github/workflows/hevc-alpha.yml、scripts/check_alpha.py、.gitignore、scripts/watermark_step01.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根素材流程、归一化、播放编码与 HEVC 派生。仅检查子目录交接，未执行素材链、CI、插件或浏览器。
- 下一步：[Q05](#research-q05) 对同素材重复操作，检查可解码、跨帧透明、对齐和目标播放，并计量处理与人工时间。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：未声明（[固定提交 be4536d](https://github.com/PC2005-cloud/dsh-pet/tree/be4536da0ca71947058777d904874977ab9ab841)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设对抽帧失败拒绝发布，并结合多帧、对齐和目标播放复核，可降低漏检。对照当前单帧规则，计入误拒和复核成本。

[Q05](#research-q05) 对同素材重复操作，检查可解码、跨帧透明、对齐和目标播放，并计量处理与人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 5623 | — | — | 122527 |
| .js | source | 42 | 7675 | 5433 | 1991 | — |
| .mjs | source | 13 | 950 | 658 | 240 | — |
| .mjs | test | 7 | 970 | 869 | 57 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 203 | 34753 | 28585 | 2981 | — |
| .ts | source | 394 | 47940 | 32262 | 12707 | — |
| .cjs | source | 2 | 423 | 308 | 85 | — |

</details>

**活跃度**

[![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=155&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：为 DSH 桌宠制作一个新动作时，根项目的归一化、格式派生与检查分别能保障什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类素材任务值得使用根工具链，如何与手工制作比较？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

桌宠动作素材作者需要让角色在多个片段间保持脚底、尺度和透明。手工方案在剪辑工具内逐段抠像、对齐、转码与目视检查，控制精细但重复。根项目提供绿幕与首尾站姿约束，汇合自动与人工透明输入后复用几何与编码。睡眠三段依赖彼此匹配的首尾帧，属于上游素材设计。插件入口位于子目录，根只研究素材制作。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:5-20](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/MAKE-YOUR-OWN-PET.md#L5-L20)

作者的样片规格、入库与取用口径。

<details>
<summary>查看原文（16行）</summary>

```text
## ① 提示词 → 源视频

用 AI 视频生成工具（如可灵、Runway、豆包等，本项目素材即由豆包生成），按 `prompts/桌面宠物 10 秒动作提示词.md` 的配方，一个动作生成一段 10 秒绿幕视频：

- 视频比例 16:9，背景纯绿幕（#00FF00）
- 人物位置/大小固定（头顶 ~20% 高度、脚底 ~85% 高度）
- 动作全程在画幅内，首尾帧为标准正面站立
- 每段动画按秒分解（0-10s 各阶段动作）

生成结果按动作各存一个 mp4，放入 `video/`。

> **源视频获取**：为控制仓库体积，`video/` 源视频不入 git。Releases 提供**打包压缩包**，浏览器直接下载即可：
>
> - `assets-videos.zip` —— 全部源视频压缩包（中文名 mp4，解压后放入 `video/`）
>
> 解压：`Expand-Archive assets-videos.zip`（Windows）或 `unzip assets-videos.zip`，把 mp4 放回 `video/` 即可运行素材链。
```

</details>

**依据 2 · 作者声明**：[MAKE-YOUR-OWN-PET.md:22-28](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/MAKE-YOUR-OWN-PET.md#L22-L28)

睡眠三段明确要求转场前目视比对。

```text
## ①.5 🌙 多段接力的动作（睡觉）

睡觉不是一个动作，而是**三段接力**：入睡 → 循环（无限）→ 醒来，由右键「睡觉」与点击唤醒驱动。提示词单独放在 [`prompts/睡觉动作提示词.md`](prompts/睡觉动作提示词.md)，与 10 秒动作提示词的区别必须照做：

- 入睡与循环段**结尾不许回到站立**，只有醒来段才回站立；循环段首尾两帧必须完全相同，否则循环处会跳。
- 三段共用同一条地面线、同一角色大小；生成后先比对「入睡尾帧 = 循环首帧 = 醒来首帧」「醒来尾帧 = 入睡首帧」再进素材链。
- 素材链其余步骤不变（同样落 `dsh-pet/assets/webm/`），最后把三个名字写进配置的 `animations.sleep`：一套 = `start` / `loop` / `end` 各一个候选数组，可以配多套（蹲着睡、趴着睡…）；结构见 `dsh-pet/assets/config.jsonc` 里的 `sleep` 注释。
```

**依据 3 · 作者声明**：[README.md:290-305](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/README.md#L290-L305)

项目目录划出发布插件与外层工具。

<details>
<summary>查看原文（16行）</summary>

````text
## 项目结构

只列代码与发布相关目录；素材链的 video / scripts / step / pr 见 [MAKE-YOUR-OWN-PET.md](MAKE-YOUR-OWN-PET.md) 的 ② 章节（gitignore 的本地目录不列）：

```
├── README.md  INSTALL.md  FEATURES.md  MAKE-YOUR-OWN-PET.md  CONFIG.md  API.md  CORDIS.md  openapi.yaml   # 说明 / 安装 / 功能详解 / 宠物制作指南 / 配置 / HTTP 接口 / Cordis 服务 / OpenAPI 规范
├── prompts/           # ① 动画生成提示词配方（绿幕规范 + 按秒分解）
├── assets/            # 仓库展示用截图
├── tools/             # 开发工具：API 调试页、cordis-probe mock 服务商、DPI 探针
├── .github/workflows/ # CI：Safari/HEVC 转码流水线（macOS runner，手动触发 → 发布 assets-mov Release）
├── dsh-pet/           # ③ 插件（可独立 npm 发布）
│   ├── src/
│   │   ├── host/       # 宿主半侧：配置 / 路由 / 余额 / 工作状态
│   │   ├── client/     # 浏览器半侧：宠物渲染 / 动画链 / 设置页
│   │   ├── shared/     # 双端共用纯逻辑（物理 / 菜单 / 取数）
│   │   └── standalone/ # 独立模式 CLI（不依赖 DSH 直接跑桌宠）
````

</details>

#### 缺口

- 没有同一素材的处理人时、返工或播放质量对照。
  **影响**：无法量化自动路线比人工方案省多少。
  **进一步探讨**：用相同短片测准备、抠像、透明边缘与对齐误差，分别记录工具和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动与手工输入在哪汇合，几何与编码如何执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

自动分支按 HSV 和色相羽化算出 alpha，人工分支接受剪辑工具输出 MOV，按动作文件名写入同一级 step02，符合增量条件时跳过。归一化从首尾抽帧，用非透明像素横向中位数、纵向范围和脚底估算统一尺度与平移。扫描的全帧并集在 worker 中记录为元数据，未用于拒绝裁切。最终编码执行 640×360、24 fps 的 VP9 播放版，源码参数与脚本开头旧的正方形注释有差异。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/chroma_step02.py:146-159](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/chroma_step02.py#L146-L159)

从 step01 流进入 VP9 编码。

<details>
<summary>查看原文（14行）</summary>

```text
def convert_video(src: Path, dst: Path, color: str) -> None:
    """HSV 色相判定抠像：绿色色相 + 足够饱和/明度 → 透明。

    输入管道：step01 视频 rgb24 流；输出管道：yuva420p → VP9 透明 webm。
    """
    bg = np.array([int(color[i:i + 2], 16) for i in (1, 3, 5)], np.uint8)  # #RRGGBB（仅用于参考）
    p1 = subprocess.Popen(
        [FFMPEG, "-loglevel", "error", "-i", str(src), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE)
    p2 = subprocess.Popen(
        [FFMPEG, "-y", "-loglevel", "error",
         "-f", "rawvideo", "-pix_fmt", "yuva420p", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-crf", "30", "-b:v", "0",
         "-auto-alt-ref", "0", "-deadline", "good", "-cpu-used", "4", str(dst)],
```

</details>

**依据 2 · 源码核查**：[scripts/chroma_step02.py:162-183](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/chroma_step02.py#L162-L183)

实际 HSV 羽化和子进程错误分支。

<details>
<summary>查看原文（22行）</summary>

```text
    frame_size = W * H * 3
    # 色相跨 0 度处理：绿色范围 [70,170]，两侧各留 HUE_FEATHER 渐变
    lo = GREEN_HUE_MIN - HUE_FEATHER
    hi = GREEN_HUE_MAX + HUE_FEATHER
    while True:
        buf = read_exact(p1.stdout, frame_size)
        if len(buf) < frame_size:
            break
        frame = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        hue, sat, val = _rgb_to_hsv(frame)
        # 背景 = 绿色色相内 且 饱和度/明度达标；色相边界做线性渐变
        in_hue = np.clip((hue - lo) / HUE_FEATHER, 0, 1) * np.clip((hi - hue) / HUE_FEATHER, 0, 1)
        bg_mask = (sat >= SAT_MIN) & (val >= VAL_MIN) & (hue >= lo) & (hue <= hi)
        # 背景 → alpha 0（透明）；绿色色相中心全透明，边缘渐变；非背景 → 255
        alpha = np.where(bg_mask, (1.0 - in_hue) * 255, 255).astype(np.uint8)
        y, u, v = _rgb_to_yuv(frame)
        p2.stdin.write(y.tobytes() + u.tobytes() + v.tobytes() + alpha.tobytes())
    p1.stdout.close()
    p2.stdin.close()
    rc = p1.wait() + p2.wait()
    if rc != 0:
        raise RuntimeError(f"convert failed rc={rc}: {src.name}")
```

</details>

**依据 3 · 源码核查**：[scripts/pr_import_step02.py:26-31](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/pr_import_step02.py#L26-L31)

人工与自动路径使用同一级输出。

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pr"                    # PR 扣好的透明 mov
OUT = ROOT / "step02"                # 直接覆盖 step02（等价于 chroma_step02 产物）
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")
```

**依据 4 · 源码核查**：[scripts/pr_import_step02.py:57-74](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/pr_import_step02.py#L57-L74)

人工 MOV 转码参数与失败分支。

<details>
<summary>查看原文（18行）</summary>

```text
        "-i",
        str(src),
        "-c:v",
        "libvpx-vp9",   # VP9 编码（WebM 标准，支持 alpha）
        "-pix_fmt",
        "yuva420p",     # 强制 4:2:0 + alpha 平面
        "-b:v",
        "0",            # 恒定质量模式（CRF）
        "-crf",
        str(CRF),
        "-row-mt",
        "1",            # 多行并行（加速编码）
        "-an",          # 丢弃音轨（动画无声音，省体积）
        str(dst),
    ]
    result = subprocess.run(cmd, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
```

</details>

**依据 5 · 源码核查**：[scripts/pr_import_step02.py:77-95](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/pr_import_step02.py#L77-L95)

复用判定及按 basename 输出。

<details>
<summary>查看原文（19行）</summary>

```text
def _is_valid(dst: Path, src: Path, min_size: int = 20_000) -> bool:
    """断点续跑完整性检查：存在、够大、不比源旧、且能被 ffprobe 读到视频流。"""
    if not dst.exists() or dst.stat().st_size <= min_size:
        return False
    if dst.stat().st_mtime < src.stat().st_mtime:
        return False
    r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "stream=codec_name",
                        "-of", "csv=p=0", str(dst)], capture_output=True)
    return bool(r.stdout.strip())


def _process_one(video: Path) -> tuple[str, int, int, bool]:
    """处理单个 mov（worker 函数，必须模块级以支持 Windows spawn）。"""
    src_size = video.stat().st_size
    dst = OUT / (video.stem + ".webm")
    if _is_valid(dst, video):
        return video.name, src_size, 0, True
    convert_video(video, dst)
    return video.name, src_size, dst.stat().st_size, False
```

</details>

**依据 6 · 源码核查**：[scripts/normalize_step03.py:85-106](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/normalize_step03.py#L85-L106)

首尾站立测量与全透明拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
def measure_standing(video: Path) -> dict:
    """首尾各 HEAD_FRAMES 帧站立姿态。

    水平中心用非透明像素 x 的中位数（防手/零食等扩展物把 bbox 中心拉偏），
    垂直基准用 bbox（y 方向扩展物干扰小，bbox 本身可靠）。
    """
    alphas = read_alpha_frames(video, frames=HEAD_FRAMES) + read_alpha_frames(video, seek=TAIL_SEEK, frames=HEAD_FRAMES)
    med_xs, heights, max_ys = [], [], []
    for a in alphas:
        ys, xs = np.where(a > 10)
        if len(xs) == 0:
            continue
        med_xs.append(float(np.median(xs)))
        heights.append(int(ys.max() - ys.min() + 1))
        max_ys.append(int(ys.max()))
    if not med_xs:
        raise RuntimeError(f"No opaque pixels found in {video.name}")
    return {
        "height": sum(heights) / len(heights),
        "max_y": sum(max_ys) / len(max_ys),
        "center_x": sum(med_xs) / len(med_xs),
    }
```

</details>

**依据 7 · 源码核查**：[scripts/normalize_step03.py:109-132](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/normalize_step03.py#L109-L132)

全帧并集与对齐滤镜。

<details>
<summary>查看原文（24行）</summary>

```text
def measure_content_union(video: Path) -> tuple[int, int, int, int]:
    """全帧扫描内容范围并集 (x1, y1, x2, y2)，用于校验动画内容是否被裁。"""
    boxes = scan_bbox(video)
    if not boxes:
        raise RuntimeError(f"No opaque pixels found in {video.name}")
    return (
        min(b[0] for b in boxes),
        min(b[2] for b in boxes),
        max(b[1] for b in boxes),
        max(b[3] for b in boxes),
    )


def build_filter(scale: float, standing: dict) -> str:
    """整帧缩放 + overlay 平移到透明画布，站立水平居中、脚底对齐 FEET_Y。"""
    scaled_w = int(SRC_W * scale) // 2 * 2
    scaled_h = int(SRC_H * scale) // 2 * 2
    overlay_x = CANVAS_W / 2 - standing["center_x"] * scale
    overlay_y = FEET_Y - standing["max_y"] * scale
    return (
        f"color=c=black@0:s={CANVAS_W}x{CANVAS_H}:r={FPS}[bg];"
        f"[0:v]scale={scaled_w}:{scaled_h}[sc];"
        f"[bg][sc]overlay={overlay_x:.1f}:{overlay_y:.1f}:shortest=1,format=yuva420p[v]"
    )
```

</details>

**依据 8 · 源码核查**：[scripts/normalize_step03.py:186-206](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/normalize_step03.py#L186-L206)

并集写元数据，目标滤镜仅用站立估计。

<details>
<summary>查看原文（21行）</summary>

```text
def _process_one(video: Path) -> tuple[dict, bool]:
    """处理单个视频（worker 函数）：测量 + 转码（或跳过转码），返回 entry。

    注意：entry 必须可 JSON 序列化（params.json 由主进程汇总写入）。
    """
    dst = OUT / (video.stem + ".webm")
    # 断点续跑：完整输出已存在 → 跳过转码（但仍测量，保证 params.json 完整）
    skip = _is_valid(dst, video)
    standing = measure_standing(video)
    union = measure_content_union(video)
    scale = TARGET_HEIGHT / standing["height"]
    entry = {
        "file": video.name,
        "standing": {k: round(v, 1) for k, v in standing.items()},
        "content_union": {"x1": union[0], "y1": union[1], "x2": union[2], "y2": union[3]},
        "scale": round(scale, 6),
    }
    if not skip:
        filter_complex = build_filter(scale, standing)
        convert_video(video, dst, filter_complex)
    return entry, skip
```

</details>

**依据 9 · 源码核查**：[scripts/encode_thumbs.py:30-42](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/encode_thumbs.py#L30-L42)

播放版真实尺寸和帧率。

<details>
<summary>查看原文（13行）</summary>

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "step03"
OUT = ROOT / "step04"
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")

PARALLEL = 4
# 转码参数（调这里改画质/分辨率）
TARGET_W = 640    # thumb 宽度（与 2160x1215 母版同 16:9 比例）
TARGET_H = 360    # thumb 高度
CRF = 40       # VP9 质量参数（0-63，越小越清晰越大；40 偏轻，透明区域省码）
FPS = 24       # 帧率（与母版一致，保持动作节奏）
```

</details>

**依据 10 · 源码核查**：[scripts/encode_thumbs.py:59-80](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/encode_thumbs.py#L59-L80)

透明像素格式、编码与错误路径。

<details>
<summary>查看原文（22行）</summary>

```text
        "-c:v",
        "libvpx-vp9",  # 关键：libvpx 解码才能保留 VP9 alpha
        "-i",
        str(src),
        "-vf",
        f"scale={TARGET_W}:{TARGET_H},format=yuva420p",
        "-c:v",
        "libvpx-vp9",  # VP9 编码（WebM 标准）
        "-crf",
        str(CRF),
        "-b:v",
        "0",  # 恒定质量模式（CRF）
        "-row-mt",
        "1",  # 多行并行（加速编码）
        "-r",
        str(FPS),
        "-an",  # 丢弃音轨（动画无声音，省体积）
        str(dst),
    ]
    result = subprocess.run(cmd, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
```

</details>

#### 缺口

- 样片是否按要求站立、全帧是否越界或编码器是否保留可用透明未播放验证。
  **影响**：元数据有几何信息，无法据此保证每个输出合格。
  **进一步探讨**：按当前两种输入各转一次，检查错姿、越界、绿色道具和无 alpha 对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 透明检查能否作发布门禁，兼容产物有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

HEVC 脚本以 libvpx 解码 WebM 到 BGRA，调用 Swift 编码器成功后才移动临时 MOV。发布 workflow 手动在 macOS runner 转码，只用前三个文件执行 alpha 检查，再为前两个文件打印 ffprobe，不比较 tag 或尺寸值。Python 实际在约一秒处尝试取一帧，正常时用 alpha 极值判断。抽帧返回错误、找不到结果或输出过小时打印 WARN 并返回 True，最终把该项纳入 OK，仍可退出 0。旧 tag 和 Release 删除早于打包和发布，途中失败可能导致同名下载短暂不可用。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/encode_hevc_alpha.sh:72-85](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/encode_hevc_alpha.sh#L72-L85)

编译原生 Swift，拒绝空素材输入。

<details>
<summary>查看原文（14行）</summary>

```text
# ---- 编译 Swift 编码器（macOS 原生 AVFoundation + VideoToolbox）----
xcrun swiftc -O -suppress-warnings \
  -framework AVFoundation \
  -framework CoreVideo \
  -framework VideoToolbox \
  "$encoder_src" \
  -o "$encoder_bin"

# ---- 批量编码 ----
mkdir -p "$out_dir"
webm_files=("$asset_dir"/*.webm(N))
if (( ${#webm_files} == 0 )); then
  print -u2 "no WebM assets found: $asset_dir"
  exit 1
```

</details>

**依据 2 · 源码核查**：[scripts/encode_hevc_alpha.sh:90-113](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/encode_hevc_alpha.sh#L90-L113)

解码、BGRA 传递和临时输出替换。

<details>
<summary>查看原文（24行）</summary>

```text
for source_file in "${webm_files[@]}"; do
  output_file="$out_dir/${source_file:t:r}.mov"
  if [[ -f "$output_file" && "$output_file" -nt "$source_file" ]]; then
    (( skipped += 1 ))
    continue
  fi

  temp_output="$out_dir/${source_file:t:r}.tmp.mov"
  rm -f "$temp_output"
  print "[$(( converted + skipped + 1))/${#webm_files}] ${source_file:t}"
  # ffmpeg：libvpx-vp9 解码（保留 alpha）→ 原始 BGRA 帧 → swift 编码器
  "$ffmpeg_bin" \
    -hide_banner \
    -loglevel error \
    -c:v libvpx-vp9 \
    -i "$source_file" \
    -an \
    -f rawvideo \
    -pix_fmt bgra \
    pipe:1 \
    | "$encoder_bin" "$temp_output" 640 360 24
  mv -f "$temp_output" "$output_file"
  temp_output=''
  (( converted += 1 ))
```

</details>

**依据 3 · 源码核查**：[.github/workflows/hevc-alpha.yml:27-47](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/.github/workflows/hevc-alpha.yml#L27-L47)

手动触发及 macOS 构建环境。

<details>
<summary>查看原文（21行）</summary>

```text
name: hevc-alpha

on:
  workflow_dispatch:

# 发布 Release / 删除旧 tag 需要 contents: write
permissions:
  contents: write

concurrency:
  group: hevc-alpha
  cancel-in-progress: false

jobs:
  encode:
    # HEVC-with-Alpha 编码（AVFoundation hevcWithAlpha）需要 macOS
    # 固定 macos-15：macos-14 的 arm64 runner 配置已下线（job 启动即被取消，
    # 注解为 configuration not supported）；不同 macOS 版本的 VideoToolbox 码率
    # 映射不同，换 runner 会改变 mov 体积，产物需重新核对
    runs-on: macos-15
    timeout-minutes: 120
```

</details>

**依据 4 · 源码核查**：[.github/workflows/hevc-alpha.yml:57-73](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/.github/workflows/hevc-alpha.yml#L57-L73)

发布路径抽样检查并仅打印流信息。

<details>
<summary>查看原文（17行）</summary>

```text
      - name: 批量编码 HEVC-with-Alpha（Swift 原生方案）
        run: |
          chmod +x scripts/encode_hevc_alpha.sh
          # 素材源：本仓库 dsh-pet/assets/webm；输出直接写回 dsh-pet/assets/mov
          mkdir -p dsh-pet/assets/mov
          ./scripts/encode_hevc_alpha.sh dsh-pet/assets/webm dsh-pet/assets/mov
          echo "mov 数量: $(ls dsh-pet/assets/mov/*.mov 2>/dev/null | wc -l)"

      - name: 校验产物（hvc1 tag + alpha 通道真实存在）
        run: |
          python scripts/check_alpha.py $(ls dsh-pet/assets/mov/*.mov | head -n 3)
          for f in $(ls dsh-pet/assets/mov/*.mov | head -n 2); do
            echo "=== $(basename "$f") ==="
            ffprobe -v error -select_streams v:0 \
              -show_entries stream=codec_tag_string,codec_name,width,height \
              -of csv=p=0 "$f"
          done
```

</details>

**依据 5 · 源码核查**：[.github/workflows/hevc-alpha.yml:85-109](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/.github/workflows/hevc-alpha.yml#L85-L109)

旧发布先删除、再打包全量。

<details>
<summary>查看原文（25行）</summary>

```text
      - name: 清理旧 tag 与 Release（同名重建）
        run: |
          set -euo pipefail
          tag="${{ steps.release.outputs.tag }}"
          # 删除旧 Release（连带 tag）。不存在时 gh 报错，忽略即可。
          gh release delete "$tag" --yes --cleanup-tag || true
          # 双保险：远端 tag 若残留（gh 未清理干净）直接删除
          git push origin ":refs/tags/$tag" || true
          git tag -d "$tag" 2>/dev/null || true
          echo "cleaned old release/tag: $tag"

      - name: 打包全量 zip
        run: |
          set -euo pipefail
          # 输出到仓库根（$(pwd) = GITHUB_WORKSPACE）下的 dsh-pet/assets/；
          # 用 python3 zipfile 打包（macOS 自带 zip 的退出码在中文文件名下不稳定，绕开）
          zip_path="$(pwd)/dsh-pet/assets/dsh-pet-mov-${{ steps.release.outputs.tag }}.zip"
          python3 - "$zip_path" <<'EOF'
          import sys, zipfile, glob
          zp = sys.argv[1]
          movs = sorted(glob.glob('dsh-pet/assets/mov/*.mov'))
          assert movs, 'no mov files to pack'
          with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
              for f in movs:
                  z.write(f, arcname=f.rsplit('/', 1)[-1])
```

</details>

**依据 6 · 源码核查**：[scripts/check_alpha.py:15-32](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/check_alpha.py#L15-L32)

抽帧失败返回 True，极值只检查一个样本。

<details>
<summary>查看原文（18行）</summary>

```text
def check_one(path: str) -> bool:
    rgba = path[:-4] + (".rgba" if not path.endswith(".rgba") else path)
    r = subprocess.run(
        [FFMPEG, "-y", "-v", "error", "-i", path, "-ss", "1", "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "rgba", rgba],
        capture_output=True, text=True,
    )
    if r.returncode != 0 or not os.path.exists(rgba) or os.path.getsize(rgba) < 16:
        print(f"  [WARN] {path}: no frame extracted")
        return True
    data = open(rgba, "rb").read()
    alpha = data[3::4]  # rgba 每像素 4 字节，A 是第 4 个
    a_min, a_max = min(alpha), max(alpha)
    a_mean = sum(alpha) / len(alpha)
    ok = a_max > 200 and a_min < 100
    print(f"  alpha min={a_min} max={a_max} mean={a_mean:.1f} -> {'OK' if ok else '!! LOST'}")
    os.remove(rgba)
    return ok
```

</details>

**依据 7 · 源码核查**：[scripts/check_alpha.py:35-45](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/check_alpha.py#L35-L45)

返回值决定最终成功计数与退出码。

<details>
<summary>查看原文（11行）</summary>

```text
def main() -> int:
    files = sys.argv[1:]
    if not files:
        print("usage: python check_alpha.py <mov...> 或 ls dist/*.mov | xargs python check_alpha.py")
        return 2
    failed = 0
    for f in files:
        if not check_one(f):
            failed += 1
    print(f"check: {len(files) - failed}/{len(files)} alpha OK")
    return 1 if failed else 0
```

</details>

#### 缺口

- 实际 MOV 发布、下载完整性、Safari/WKWebView 与整段动作透明未独立验证。
  **影响**：workflow 成功只能说明命令执行，无法证明所有素材透明或整段有效。
  **进一步探讨**：用无法抽帧、前透明后不透明、错误 tag 与目标播放器做对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 初次制作用到什么，重试和回退成本在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先备有权使用的短片及目标播放端。自动线路需 Python、NumPy 与工作区指定 FFmpeg/FFprobe，作者列 SciPy，水印填充另有掩模；人工线路需要带透明的剪辑输出。根脚本多处硬编码工作区内 Windows exe，仓库忽略本地工具及源 MP4。先在隔离目录保存单片和旧产物，处理后验收透明、脚底、转场和目标播放，最后才同步；工作流的 Mac 派生是单独路径。中途失败或参数改动后应核对按大小、mtime 和 probe 的复用，避免把旧结果当此次产物。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:30-52](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/MAKE-YOUR-OWN-PET.md#L30-L52)

两条路径与作者工具依赖。

<details>
<summary>查看原文（23行）</summary>

````text
## ② 源视频 → 透明动画（素材链）

step02（透明视频）有**两条路线，按需二选一**（默认自动、人人可复现；效果不佳可用 PR 手工抠像覆盖）：

```sh
cd scripts
# 路线 A（默认）：自动绿幕抠像（HSV 色相，无需人工）
python watermark_step01.py   # 水印遮罩填充 → step01/
python chroma_step02.py      # 绿幕抠像转透明 → step02/

# 路线 B（可选）：PR 手工抠像覆盖（针对含第三方物品/自动抠像效果不佳的动作）
#   1. 在 PR 里手工抠像，导出带 alpha 的透明 .mov（如 ProRes 4444 with Alpha）
#   2. 放入 pr/，文件名与动作名一致（如 吃白饭.mov）
python pr_import_step02.py   # pr/*.mov → step02/（透明 webm，覆盖该动作自动抠像结果）

# 后续步骤两条路线共用：
python normalize_step03.py   # 归一化 2160×1215 统一站立居中 → step03/
python encode_thumbs.py      # 转码 640×360 播放变体 → step04/
```

**依赖**：Python 3 + ffmpeg + numpy + scipy（素材链脚本自动用工作区 `.tools/` 下的 ffmpeg）。

> **本项目全部采用路线 B**（全部动作均为 PR 手工抠像）：对"含第三方物品/透明边缘复杂"的动作，自动 HSV 抠像易残边或误抠，PR 手动遮罩更精细。两条路线产出同一级 `step02/`，后续步骤完全一致；`chroma_step02.py` 保留为自动化兜底，任何动作仍可一键自动生成。
````

</details>

**依据 2 · 作者声明**：[MAKE-YOUR-OWN-PET.md:61-73](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/MAKE-YOUR-OWN-PET.md#L61-L73)

交接播放素材及子目录安装边界。

<details>
<summary>查看原文（13行）</summary>

````text
## ③ 动画 → 插件

```sh
# 把 step04 的播放变体同步进插件包（webm 直接 cp）
cp step04/*.webm dsh-pet/assets/webm/   # 播放格式（VP9-alpha）

# 本地安装插件（--profile 填实际在用的那个：dsh web → web，桌面应用 → desktop；
# 详见 INSTALL.md 的「从源码安装」；
# file: 指向插件目录 dsh-pet/dsh-pet）
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
```

> 中间产物（step01-04）由脚本生成、不入仓库；`video/` 源视频和脚本是成果、入库维护。
````

</details>

**依据 3 · 源码核查**：[.gitignore:1-17](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/.gitignore#L1-L17)

固定树忽略源 MP4、本地中间产物及工具。

<details>
<summary>查看原文（17行）</summary>

```text
# ── 素材处理链中间产物（跑 scripts/*.py 可再生，不入仓库） ──
step01/
step02/
step03/
step04/

# ── 素材源（托管在 GitHub Releases assets-videos，不入仓库） ──
video/*.mp4

# ── PR 手工抠像工作数据（本地工作数据，同 step 中间产物，不入库） ──
#   pr/      PR 导出的透明 .mov（路线 B 的输入）
#   prproj/  PR 工程目录（.prproj + 遮罩缓存 + 自动保存，约 2GB）
pr/
prproj/

# ── 本地工具（机器相关，不入仓库） ──
.tools/
```

</details>

**依据 4 · 源码核查**：[scripts/watermark_step01.py:22-32](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/watermark_step01.py#L22-L32)

硬编码工具及水印掩模。

<details>
<summary>查看原文（11行）</summary>

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "video"
OUT = ROOT / "step01"
MASK = SRC / "watermark_mask_v5.mkv"
K = 5
PARALLEL = 4
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")
sys.path.insert(0, str(ROOT / "scripts"))
from fill_nn import fill_nn  # noqa: E402
```

</details>

**依据 5 · 源码核查**：[scripts/encode_thumbs.py:83-101](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/encode_thumbs.py#L83-L101)

按时间、体积及 probe 判定复用。

<details>
<summary>查看原文（19行）</summary>

```text
def _is_valid(dst: Path, src: Path, min_size: int = 20_000) -> bool:
    """断点续跑完整性检查：存在、够大、不比源旧、且能被 ffprobe 读到视频流。"""
    if not dst.exists() or dst.stat().st_size <= min_size:
        return False
    if dst.stat().st_mtime < src.stat().st_mtime:
        return False
    r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "stream=codec_name",
                        "-of", "csv=p=0", str(dst)], capture_output=True)
    return bool(r.stdout.strip())


def _process_one(video: Path) -> tuple[str, int, int, bool]:
    """处理单个视频（worker 函数），返回 (名字, 源大小, 输出大小, 是否跳过)。"""
    src_size = video.stat().st_size
    dst = OUT / video.name
    if _is_valid(dst, video):
        return video.name, src_size, 0, True
    convert_video(video, dst)
    return video.name, src_size, dst.stat().st_size, False
```

</details>

#### 缺口

- 初次路径适配、视频算力、人工蒙版和回滚人时未知。
  **影响**：首次投入受工具环境与样片影响，后续编码与人工检查均要计入。
  **进一步探讨**：记录设置人时、编码机器时、逐片检查和失败后重做时，保留旧素材以便回退。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 增加失败拒绝和多帧复核能否减少漏检？

**研究主题**：新假设与验证

#### 完整回答

保持当前一秒点极值作为对照。对无法抽帧的输入记为未验证并阻止发布，另检查首中尾的透明像素分布、脚底偏移、裁切和动作衔接，再用目标播放器复查一小批已标注样片。比较对已知缺陷的漏检率、对好片的误拒、每片人工及机器检查时长。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/check_alpha.py:15-45](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/check_alpha.py#L15-L45)

当前抽帧与计数逻辑构成对照。

<details>
<summary>查看原文（31行）</summary>

```text
def check_one(path: str) -> bool:
    rgba = path[:-4] + (".rgba" if not path.endswith(".rgba") else path)
    r = subprocess.run(
        [FFMPEG, "-y", "-v", "error", "-i", path, "-ss", "1", "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "rgba", rgba],
        capture_output=True, text=True,
    )
    if r.returncode != 0 or not os.path.exists(rgba) or os.path.getsize(rgba) < 16:
        print(f"  [WARN] {path}: no frame extracted")
        return True
    data = open(rgba, "rb").read()
    alpha = data[3::4]  # rgba 每像素 4 字节，A 是第 4 个
    a_min, a_max = min(alpha), max(alpha)
    a_mean = sum(alpha) / len(alpha)
    ok = a_max > 200 and a_min < 100
    print(f"  alpha min={a_min} max={a_max} mean={a_mean:.1f} -> {'OK' if ok else '!! LOST'}")
    os.remove(rgba)
    return ok


def main() -> int:
    files = sys.argv[1:]
    if not files:
        print("usage: python check_alpha.py <mov...> 或 ls dist/*.mov | xargs python check_alpha.py")
        return 2
    failed = 0
    for f in files:
        if not check_one(f):
            failed += 1
    print(f"check: {len(files) - failed}/{len(files)} alpha OK")
    return 1 if failed else 0
```

</details>

**依据 2 · 源码核查**：[scripts/normalize_step03.py:186-206](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/scripts/normalize_step03.py#L186-L206)

已有几何记录但未用于放行。

<details>
<summary>查看原文（21行）</summary>

```text
def _process_one(video: Path) -> tuple[dict, bool]:
    """处理单个视频（worker 函数）：测量 + 转码（或跳过转码），返回 entry。

    注意：entry 必须可 JSON 序列化（params.json 由主进程汇总写入）。
    """
    dst = OUT / (video.stem + ".webm")
    # 断点续跑：完整输出已存在 → 跳过转码（但仍测量，保证 params.json 完整）
    skip = _is_valid(dst, video)
    standing = measure_standing(video)
    union = measure_content_union(video)
    scale = TARGET_HEIGHT / standing["height"]
    entry = {
        "file": video.name,
        "standing": {k: round(v, 1) for k, v in standing.items()},
        "content_union": {"x1": union[0], "y1": union[1], "x2": union[2], "y2": union[3]},
        "scale": round(scale, 6),
    }
    if not skip:
        filter_complex = build_filter(scale, standing)
        convert_video(video, dst, filter_complex)
    return entry, skip
```

</details>

**依据 3 · 作者声明**：[MAKE-YOUR-OWN-PET.md:22-28](https://github.com/PC2005-cloud/dsh-pet/blob/be4536da0ca71947058777d904874977ab9ab841/MAKE-YOUR-OWN-PET.md#L22-L28)

作者依赖人工确认多段接力。

```text
## ①.5 🌙 多段接力的动作（睡觉）

睡觉不是一个动作，而是**三段接力**：入睡 → 循环（无限）→ 醒来，由右键「睡觉」与点击唤醒驱动。提示词单独放在 [`prompts/睡觉动作提示词.md`](prompts/睡觉动作提示词.md)，与 10 秒动作提示词的区别必须照做：

- 入睡与循环段**结尾不许回到站立**，只有醒来段才回站立；循环段首尾两帧必须完全相同，否则循环处会跳。
- 三段共用同一条地面线、同一角色大小；生成后先比对「入睡尾帧 = 循环首帧 = 醒来首帧」「醒来尾帧 = 入睡首帧」再进素材链。
- 素材链其余步骤不变（同样落 `dsh-pet/assets/webm/`），最后把三个名字写进配置的 `animations.sleep`：一套 = `start` / `loop` / `end` 各一个候选数组，可以配多套（蹲着睡、趴着睡…）；结构见 `dsh-pet/assets/config.jsonc` 里的 `sleep` 注释。
```

#### 缺口

- 规则是否提高净收益尚未验证。
  **影响**：合法全透明过渡和低透明效果也可能触发误拒。
  **进一步探讨**：分开解码失败、格式不符与视觉瑕疵，若误拒成本抵消漏检下降则不扩大使用。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
