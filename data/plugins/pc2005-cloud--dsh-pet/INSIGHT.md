# dsh-pet 素材制作工程

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[48426c3](https://github.com/PC2005-cloud/dsh-pet/tree/48426c387d6222293bbc25e0b264231875a5bac1)

<!-- BEGIN META -->
[![GitHub ★ 5,154](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C154&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet)
<!-- END META -->

> **功能**：提供桌宠提示词、透明视频处理、动作对齐和播放素材制作流程。

> **亮点**：把提示约束、两种抠像输入、站姿对齐和播放变体组织为可重做流程；HSV、VP9 等是通用技术。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：alpha 检查抽帧失败返回 True 并计为成功，不能把检查绿灯当作素材放行。[Q03](#research-q03)

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
  - [Q01 · 根仓库为谁解决什么问题，与桌宠插件是什么关系？](#detail-section-11)
  - [Q02 · 素材如何对齐并生成可播放格式？](#detail-section-12)
  - [Q03 · 检查显示通过能否证明透明素材合格？](#detail-section-13)
  - [Q04 · 可复现生产需要什么成本和环境？](#detail-section-14)
  - [Q05 · 怎样证明素材验收比现有检查可靠？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为 DSH 桌宠制作新角色或动作的素材作者；替代为人工视频编辑与转码。[Q01](#research-q01)

人工编辑、抠像与逐片转码；需要自己组织动作与尺寸。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 抠像 | 统一透明素材 | 手工路径依赖编辑 |
| 对齐转码 | 生成播放变体 | 固定工具路径须适配 |
| alpha 检查 | 抽帧查看透明 | 抽帧失败误记成功 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 源视频及使用许可 | 必需 | 动作素材输入 | 无法制作 |
| Python、ffmpeg、numpy/scipy | 处理必需 | 抠像与转码 | 先适配环境 |
| 可用目标播放端 | 发布必需 | 视觉验收 | 不发布 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 输入 | 获取授权绿幕素材 | 核对动作与首尾 |
| 处理 | 抠像、对齐和编码 | 核对透明与脚底 |
| 验收 | 多帧及目标端播放 | 黑底或跳变停止发布 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 视频生成及工具成本未知 | 提示与环境配置 | 源片不入 Git |
| 持续 | 视频计算资源 | 人工抠像和逐动作复核 | 作者称现有动作全用 PR |
| 恢复 | 重转码成本 | 检查 alpha 与播放 | 自动检查存在误通过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 制作组织 | 两种输入共享对齐和编码 | 质量与节时 |
| 素材验收 | 有 alpha 与视频流检查 | 抽帧失败及整段质量 |

> **思考**：alpha 检查抽帧失败返回 True 并计为成功，不能把检查绿灯当作素材放行。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把提示约束、两种抠像输入、站姿对齐和播放变体组织为可重做流程；HSV、VP9 等是通用技术。[Q01](#research-q01) [Q02](#research-q02)

按站立帧与最低点对齐，使用 VP9 alpha 格式；检查脚本抽帧失败却返回成功是关键反证。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

alpha 检查抽帧失败返回 True 并计为成功，不能把检查绿灯当作素材放行。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有授权样片时先核对工具路径，逐动作检查透明和播放；失败停止发布。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定脚本支持两路素材和对齐流程，也揭示抽帧失败误通过；未执行视频处理或目标端播放。

- 已检查：作者 README、包清单、源码路径 MAKE-YOUR-OWN-PET.md、scripts/check_alpha.py、scripts/normalize_step03.py、scripts/encode_thumbs.py、scripts/chroma_step02.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 600 个指定扩展名文件、无排除或解析错误；静态核查代表素材路径与验收，未运行插件或视频链。
- 下一步：适配本机 ffmpeg，在隔离素材集验证抽帧失败、alpha、循环和目标端播放。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：未声明（[固定提交 48426c3](https://github.com/PC2005-cloud/dsh-pet/tree/48426c387d6222293bbc25e0b264231875a5bac1)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：失败即拒绝并结合多帧透明、脚底、循环与目标端播放复核，可能减少漏检；须测误报与人工成本。[Q05](#research-q05)

适配本机 ffmpeg，在隔离素材集验证抽帧失败、alpha、循环和目标端播放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 5582 | — | — | 121275 |
| .js | source | 40 | 7340 | 5243 | 1867 | — |
| .mjs | source | 13 | 933 | 646 | 235 | — |
| .mjs | test | 5 | 777 | 691 | 51 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 175 | 30582 | 25159 | 2629 | — |
| .ts | source | 345 | 41553 | 27754 | 11219 | — |
| .cjs | source | 2 | 423 | 308 | 85 | — |

</details>

**活跃度**

[![近30天新建 108](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=108&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 110](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=110&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根仓桌宠素材制作链的可复现价值、透明验收和交付限制是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓库为谁解决什么问题，与桌宠插件是什么关系？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根仓库提供制作新宠物动作的提示、透明视频转换和播放素材流程，目标用户是愿意生成及整理动画的素材作者；合格结果需透明、脚底对齐、循环衔接和目标宿主播放。普通桌宠用户不一定需要制作链，运行插件位于 dsh-pet 子目录。人工编辑视频是基线；作者明确现有动作全部经 PR 手工抠像，因此不能将项目素材称为全自动生产结果。

#### 证据与依据

**依据 1 · 源码核查**：[MAKE-YOUR-OWN-PET.md:1-20](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L1-L20)

生成提示、源视频及获取方式。

<details>
<summary>查看原文（20行）</summary>

```text
# 从零生成你自己的宠物（完整流程）

> 返回 [README](README.md) ｜ 全流程：AI 提示词 → 绿幕视频 → 透明动画 → 插件 → 发布。换角色、换动作、换风格，均可复现。

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

**依据 2 · 源码核查**：[MAKE-YOUR-OWN-PET.md:30-52](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L30-L52)

两条抠像路径与实际手工采用。

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

**依据 3 · 源码核查**：[MAKE-YOUR-OWN-PET.md:61-70](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L61-L70)

生成素材再安装子目录插件。

<details>
<summary>查看原文（10行）</summary>

````text
## ③ 动画 → 插件

```sh
# 把 step04 的播放变体同步进插件包（webm 直接 cp）
cp step04/*.webm dsh-pet/assets/webm/   # 播放格式（VP9-alpha）

# 本地安装插件（--profile 填实际在用的那个：dsh web → web，桌面应用 → desktop；
# 详见 INSTALL.md 的「从源码安装」；
# file: 指向插件目录 dsh-pet/dsh-pet）
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
````

</details>

#### 缺口

- 本轮未运行视频链、播放或视觉验收
  **影响**：不能证明透明效果、循环衔接、跨平台可用与量产收益
  **进一步探讨**：在独立工作区用样片检查透明、对齐和实际播放

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 素材如何对齐并生成可播放格式？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

指南将自动 HSV 抠像或 PR 导入的透明视频统一到 step02，接着归一化到 2160×1215，按首尾站立测量和全帧最低点对齐脚底，再缩放 640×360、VP9 及 yuva420p 输出。代码使用 libvpx-vp9 解码避免丢 alpha；这些算法和格式不是原创，也不证明每个动作不裁切或跨端渲染正常。

#### 证据与依据

**依据 1 · 源码核查**：[MAKE-YOUR-OWN-PET.md:30-52](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L30-L52)

两路共享后续步骤。

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

**依据 2 · 源码核查**：[scripts/normalize_step03.py:1-7](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/normalize_step03.py#L1-L7)

对齐目标与画布。

```text
"""Unify character size across step02 videos into step03.

整帧等比缩放 + overlay 平移到 2160x1215（16:9）透明画布：
- 站立高度 900（按首尾站立帧的平均高度计算缩放比例）
- 水平居中，脚底对齐（按全帧内容最低点对齐，保证动画不裁剪）
- 不裁剪人物/动作内容，底部超出的透明空白直接裁掉
- 画布 2160x1215 与原始视频同为 16:9，宽度容纳最宽动作（2015px）
```

**依据 3 · 源码核查**：[scripts/normalize_step03.py:85-94](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/normalize_step03.py#L85-L94)

取首尾帧测量站立。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[scripts/encode_thumbs.py:37-42](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/encode_thumbs.py#L37-L42)

播放变体尺寸和帧率。

```text
PARALLEL = 4
# 转码参数（调这里改画质/分辨率）
TARGET_W = 640    # thumb 宽度（与 2160x1215 母版同 16:9 比例）
TARGET_H = 360    # thumb 高度
CRF = 40       # VP9 质量参数（0-63，越小越清晰越大；40 偏轻，透明区域省码）
FPS = 24       # 帧率（与母版一致，保持动作节奏）
```

**依据 5 · 源码核查**：[scripts/encode_thumbs.py:45-76](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/encode_thumbs.py#L45-L76)

VP9 alpha 解码与编码。

<details>
<summary>查看原文（32行）</summary>

```text
def convert_video(src: Path, dst: Path) -> None:
    """转码单个视频。

    注意：
    - 解码端必须指定 -c:v libvpx-vp9（libvpx 解码才能保留 VP9 alpha，与
      normalize_step03.py 一致）；ffmpeg 自动选解码器会丢 alpha 导致黑底。
    - scale 滤镜默认也会丢 alpha，需 format=yuva420p 强制保留。
    """
    cmd = [
        FFMPEG,
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
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
```

</details>

#### 缺口

- 本轮未运行视频链、播放或视觉验收
  **影响**：不能证明透明效果、循环衔接、跨平台可用与量产收益
  **进一步探讨**：在独立工作区用样片检查透明、对齐和实际播放

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检查显示通过能否证明透明素材合格？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。check_alpha 在 ffmpeg 返回非零、帧不存在或不足 16 字节时只输出 WARN 并返回 True；主程序只对 False 计失败，故抽帧失败会计入 alpha OK 且可能退出零。正常分支只抽取一秒处一帧并以 alpha min/max 判断，不覆盖整段、边缘、循环或跨平台播放。编码脚本断点跳过只核对大小、mtime 和存在视频流，也不是 alpha 质量证明。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/check_alpha.py:15-32](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/check_alpha.py#L15-L32)

抽帧失败返回 True 与单帧阈值。

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

**依据 2 · 源码核查**：[scripts/check_alpha.py:35-45](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/check_alpha.py#L35-L45)

统计和退出状态。

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

**依据 3 · 源码核查**：[scripts/encode_thumbs.py:83-91](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/encode_thumbs.py#L83-L91)

断点跳过仅核对元数据与视频流。

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
```

#### 缺口

- 本轮未运行视频链、播放或视觉验收
  **影响**：不能证明透明效果、循环衔接、跨平台可用与量产收益
  **进一步探讨**：在独立工作区用样片检查透明、对齐和实际播放

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可复现生产需要什么成本和环境？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

指南依赖源片、Python、numpy、scipy、ffmpeg、视频生成和可能的 PR 人工处理；源视频不入 Git，需另行取得。实际脚本将 ffmpeg 和 ffprobe 固定在工作区 .tools 下 Windows exe，非 Windows 或该目录缺失需要适配；运行时素材 webm 与作者描述的 Safari/WKWebView HEVC-alpha mov 是不同交付。先取得授权样片、核对工具路径并人工检验，抽帧失败、黑底或对齐异常时停止发布。费用与工时未测。

#### 证据与依据

**依据 1 · 源码核查**：[MAKE-YOUR-OWN-PET.md:14-20](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L14-L20)

源视频不入 Git。

```text
生成结果按动作各存一个 mp4，放入 `video/`。

> **源视频获取**：为控制仓库体积，`video/` 源视频不入 git。Releases 提供**打包压缩包**，浏览器直接下载即可：
>
> - `assets-videos.zip` —— 全部源视频压缩包（中文名 mp4，解压后放入 `video/`）
>
> 解压：`Expand-Archive assets-videos.zip`（Windows）或 `unzip assets-videos.zip`，把 mp4 放回 `video/` 即可运行素材链。
```

**依据 2 · 源码核查**：[MAKE-YOUR-OWN-PET.md:45-56](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L45-L56)

依赖、人工方式及 macOS 素材。

<details>
<summary>查看原文（12行）</summary>

````text
# 后续步骤两条路线共用：
python normalize_step03.py   # 归一化 2160×1215 统一站立居中 → step03/
python encode_thumbs.py      # 转码 640×360 播放变体 → step04/
```

**依赖**：Python 3 + ffmpeg + numpy + scipy（素材链脚本自动用工作区 `.tools/` 下的 ffmpeg）。

> **本项目全部采用路线 B**（全部动作均为 PR 手工抠像）：对"含第三方物品/透明边缘复杂"的动作，自动 HSV 抠像易残边或误抠，PR 手动遮罩更精细。两条路线产出同一级 `step02/`，后续步骤完全一致；`chroma_step02.py` 保留为自动化兜底，任何动作仍可一键自动生成。

## ②.5 🍎 Safari/HEVC 兼容素材（macOS 专用 mov）

插件默认只发布 `.webm`（VP9-alpha），Safari/WKWebView 不认 webm alpha（黑底），macOS 需要在 GitHub Release 下载官方转码的 **HEVC-with-Alpha `.mov`** 素材使用，两步：
````

</details>

**依据 3 · 源码核查**：[scripts/normalize_step03.py:20-25](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/normalize_step03.py#L20-L25)

ffmpeg 和 ffprobe 的固定 Windows 路径。

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "step02"
OUT = ROOT / "step03"
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")
```

#### 缺口

- 本轮未运行视频链、播放或视觉验收
  **影响**：不能证明透明效果、循环衔接、跨平台可用与量产收益
  **进一步探讨**：在独立工作区用样片检查透明、对齐和实际播放

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证明素材验收比现有检查可靠？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：将抽帧失败标为失败，并在多个动作帧采 alpha、脚底和首尾差异，结合目标浏览器或桌面播放人工复核，可能减少黑底和跳变漏检。现有 alpha 检查及视频流检查是反证：不应声称之前没有检查；少数帧仍漏瞬时问题且阈值可能误报有意半透明动作。对照现有脚本，用正常片、抽帧失败、缺 alpha、单帧漂移和循环错位样本，测漏报、误报、时间与视觉复核成本；若无改进或误伤过多则否定。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/check_alpha.py:15-32](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/check_alpha.py#L15-L32)

现有单帧透明检查与失败误通过。

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

**依据 2 · 源码核查**：[scripts/encode_thumbs.py:83-91](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/scripts/encode_thumbs.py#L83-L91)

现有文件级视频流检查。

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
```

**依据 3 · 源码核查**：[MAKE-YOUR-OWN-PET.md:22-28](https://github.com/PC2005-cloud/dsh-pet/blob/48426c387d6222293bbc25e0b264231875a5bac1/MAKE-YOUR-OWN-PET.md#L22-L28)

睡眠三段首尾对齐要求。

```text
## ①.5 🌙 多段接力的动作（睡觉）

睡觉不是一个动作，而是**三段接力**：入睡 → 循环（无限）→ 醒来，由右键「睡觉」与点击唤醒驱动。提示词单独放在 [`prompts/睡觉动作提示词.md`](prompts/睡觉动作提示词.md)，与 10 秒动作提示词的区别必须照做：

- 入睡与循环段**结尾不许回到站立**，只有醒来段才回站立；循环段首尾两帧必须完全相同，否则循环处会跳。
- 三段共用同一条地面线、同一角色大小；生成后先比对「入睡尾帧 = 循环首帧 = 醒来首帧」「醒来尾帧 = 入睡首帧」再进素材链。
- 素材链其余步骤不变（同样落 `dsh-pet/assets/webm/`），最后把三个名字写进配置的 `animations.sleep`：一套 = `start` / `loop` / `end` 各一个候选数组，可以配多套（蹲着睡、趴着睡…）；结构见 `dsh-pet/assets/config.jsonc` 里的 `sleep` 注释。
```

#### 缺口

- 本轮未运行视频链、播放或视觉验收
  **影响**：不能证明透明效果、循环衔接、跨平台可用与量产收益
  **进一步探讨**：在独立工作区用样片检查透明、对齐和实际播放

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
