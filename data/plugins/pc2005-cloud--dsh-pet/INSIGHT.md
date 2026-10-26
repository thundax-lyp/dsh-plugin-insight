# dsh-pet 素材制作工程

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[dfc0396](https://github.com/PC2005-cloud/dsh-pet/tree/dfc03961bdb4d26898838cb72c9c2ac09699b1e2)

<!-- BEGIN META -->
[![GitHub ★ 4,043](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C043&color=yellow&logo=github&style=flat)](https://github.com/PC2005-cloud/dsh-pet)
<!-- END META -->

> **实现功能**：提供桌宠动作提示词、视频抠像、姿态归一化及透明播放素材转码流程，插件位于子目录。

> **核心亮点**：[Q03](#research-q03)识别出提示约束、人工/自动统一中间格式、脚底对齐和播放变体的工程组合。相对逐片手工转码，它组织了可重做阶段；标准视频算法不视为原创，全部动作人工PR的作者说明限制了自动量产主张。

> **风险与缺陷**：[Q04](#research-q04)核实Windows工具硬路径与源片范围不一致，更发现alpha抽帧失败被return True并计入成功。当前检查绿灯不能承担素材放行，因而应观察根制作链，而不是把可安装子插件的演示当制作链验收。

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
  - [Q01 · 根项目的素材制作链与可安装子插件分别服务什么任务？](#detail-section-11)
  - [Q02 · 提示词、抠像、归一化、转码怎样衔接？](#detail-section-12)
  - [Q03 · 相对逐段手工视频处理，能借鉴什么增量？](#detail-section-13)
  - [Q04 · 为什么“可复现”“检查通过”仍不能证明素材合格？](#detail-section-14)
  - [Q05 · 创作与播放分别依赖哪些工具和资源？](#detail-section-15)
  - [Q06 · 素材链如何计入生成、人工精修、重试与退出？](#detail-section-16)
  - [Q07 · 哪些可复用做法和检查缺陷值得关注？](#detail-section-17)
  - [Q08 · 怎样把制作链升级为可证伪的素材验收契约？](#detail-section-18)
  - [Q09 · 根制作链适合立即采用还是观察，停止点在哪里？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根仓库除dsh-pet子包外，主要提供角色动作提示词、源视频到透明动画的制作链及发布说明。面向愿意自己生成新角色/动作的桌宠素材作者，合格交付是一组尺寸/脚底对齐、循环衔接和透明通道正确的播放素材及pet pack配置。简单替代是人工视频编辑再放进现有桌宠。普通只想显示宠物的人应看子包，不需要运行这套生成链；仓库根没有package.json，不能把root当另一份npm插件。

贡献在把生成提示约束、自动/人工抠像统一中间格式、站立姿态归一化及轻量播放版连成制作流程。相对单独ffmpeg命令，固定脚底和多动作首尾有助于运行时无缝切换；相对纯自动抠像，允许手工结果覆盖而不重做下游。HSV、bbox、VP9不是原创，作者本项目全部动作走PR人工抠像，不能把配方称为全自动兑现；本轮未运行质量对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 素材路线组织 | 统一自动/人工透明片输入 | 复杂边缘仍需编辑器 |
| 姿态归一化 | 对齐站立高度与脚底 | 依赖固定采样与完整源片 |
| 播放变体 | 生成VP9-alpha webm | 硬编码工具路径须适配 |
| 素材检查 | 抽帧与透明判断 | 当前抽帧失败误记通过 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 授权源视频 | 必需 | 动作输入 | Git不含完整源片，不能凭clone复现 |
| Python/numpy/scipy及ffmpeg | 处理必需 | 抠像/测量/转码 | Windows工具路径需核对 |
| 人工视频编辑器 | 复杂边缘 | 透明mov | 作者本项目全部动作使用 |
| dsh-pet子包 | 播放验收 | 宠物运行 | 根不是独立npm插件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 作者准备源片与工具 | 尺寸/角色/路径已核实 |
| 2 | 自动或人工输入step02 | alpha和边缘逐帧可接受 |
| 3 | 归一化并转码step04 | 脚底、完整性、循环正常 |
| 4 | 独立质量核对再接插件 | 不以当前alpha绿灯独立放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 视频工具与本地依赖 | 角色/工具/路径配置 | 金额人时未知 |
| 持续 | 生成额度、转码CPU/磁盘 | PR精修和逐帧检查 | 每合格动作成本未知 |
| 失败恢复 | 原片和中间文件保留 | 重抠/修复/独立检查 | alpha检查不能作放行 |
| 退出 | 标准mov/webm可保存 | 转人工编辑或其它载体 | 许可条件仍保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 对齐/透明转码 | 具体参数和阶段实现 | 不同角色全帧质量 |
| 自动制作 | HSV路线存在 | 作者全部手工PR，不证明量产 |
| 质量检查 | 抽帧失败会误记通过 | 不能承担当前放行 |

> **思考**：[Q04](#research-q04)核实Windows工具硬路径与源片范围不一致，更发现alpha抽帧失败被return True并计入成功。当前检查绿灯不能承担素材放行，因而应观察根制作链，而不是把可安装子插件的演示当制作链验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出提示约束、人工/自动统一中间格式、脚底对齐和播放变体的工程组合。相对逐片手工转码，它组织了可重做阶段；标准视频算法不视为原创，全部动作人工PR的作者说明限制了自动量产主张。

[Q03](#research-q03)识别出提示约束、人工/自动统一中间格式、脚底对齐和播放变体的工程组合。相对逐片手工转码，它组织了可重做阶段；标准视频算法不视为原创，全部动作人工PR的作者说明限制了自动量产主张。

正向设计是人工/自动路线共用step02、独立阶段方便重做单动作，以及转码显式保留alpha而不是依赖默认解码。恢复检查以文件大小、时间戳和ffprobe判断可复用输入，但不能替代透明/质量验证。check_alpha抽帧失败return True、encode注释仍写旧360x360而常量为640x360，提醒移植要以执行参数和fail-closed结果为准。本轮inventory不统计Python主体代码行，也不等于全素材审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)核实Windows工具硬路径与源片范围不一致，更发现alpha抽帧失败被return True并计入成功。当前检查绿灯不能承担素材放行，因而应观察根制作链，而不是把可安装子插件的演示当制作链验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议有透明视频制作经验的素材作者先观察并核对工具路径和质量检查，避免按“全流程可复现”直接批量生成。它提供可借鉴的对齐和转码阶段，但不替代人工抠像，也没有可信的当前自动放行门槛。遇到坏视频仍alpha OK、跨平台工具缺失或角色/素材范围不清时停止发布，保留原片与中间产物，退回人工编辑器和逐帧验收；只想养宠物者直接评估子插件。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、MAKE-YOUR-OWN-PET.md、scripts/chroma_step02.py、scripts/normalize_step03.py、scripts/encode_thumbs.py、scripts/pr_import_step02.py、scripts/check_alpha.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是每动作输出带源hash、工具版本、全部帧alpha/边界/脚底和首尾差异的manifest，抽帧失败记error而非pass。由两路输入共享中间格式和当前fail-open检查推导，可能在不强制全自动抠像下稳定交付。最小验证准备无alpha、坏视频、边缘残留、超宽动作和合格样本，对照当前检查与manifest门槛，测误放行及人工补检时间；若仍漏关键缺陷或扫描成本超出人工抽查收益，则否定采用整套契约。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：未声明（[固定提交 dfc0396](https://github.com/PC2005-cloud/dsh-pet/tree/dfc03961bdb4d26898838cb72c9c2ac09699b1e2)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的每动作质量manifest，用坏视频、无alpha、超宽动作等反例对照误放行与补检人时；若额外扫描不改善交付或成本过高，否定整套方案。

未验证假设是每动作输出带源hash、工具版本、全部帧alpha/边界/脚底和首尾差异的manifest，抽帧失败记error而非pass。由两路输入共享中间格式和当前fail-open检查推导，可能在不强制全自动抠像下稳定交付。最小验证准备无alpha、坏视频、边缘残留、超宽动作和合格样本，对照当前检查与manifest门槛，测误放行及人工补检时间；若仍漏关键缺陷或扫描成本超出人工抽查收益，则否定采用整套契约。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 4032 | — | — | 101023 |
| .js | source | 20 | 5791 | 4228 | 1395 | — |
| .mjs | source | 11 | 724 | 489 | 195 | — |
| .mjs | test | 3 | 604 | 560 | 32 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 62 | 14944 | 12366 | 1369 | — |
| .ts | source | 96 | 20318 | 14365 | 4878 | — |
| .cjs | source | 2 | 423 | 308 | 85 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 82](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=82&color=grey&logo=github&style=flat)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-09-26T09%3A41%3A37.852Z..2026-10-26T09%3A41%3A37.852Z) [![近30天关闭 76](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=76&color=grey&logo=github&style=flat)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A41%3A37.852Z..2026-10-26T09%3A41%3A37.852Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断dsh-pet 素材制作工程的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目的素材制作链与可安装子插件分别服务什么任务？

**研究主题**：场景与需求

#### 完整回答

根仓库除dsh-pet子包外，主要提供角色动作提示词、源视频到透明动画的制作链及发布说明。面向愿意自己生成新角色/动作的桌宠素材作者，合格交付是一组尺寸/脚底对齐、循环衔接和透明通道正确的播放素材及pet pack配置。简单替代是人工视频编辑再放进现有桌宠。普通只想显示宠物的人应看子包，不需要运行这套生成链；仓库根没有package.json，不能把root当另一份npm插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-25](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L18-L25)

三件套及定制目标

````text
这不是一个普通插件，而是**完整的三件套项目**：

```
① 提示词（配方）    →  ② 素材生成链（引擎）  →  ③ 插件（成品）
AI 生成动画的配方     源视频 → 透明动画的管线    运行在 DSH 里的宠物
```

任何人 clone 本仓库，都可以**从零生成自己的桌面宠物**——换角色、换动作、换风格，全流程可复现。
````

**依据 2 · 作者声明**：[MAKE-YOUR-OWN-PET.md:5-20](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L5-L20)

提示词源视频及外部素材范围

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

**依据 3 · 作者声明**：[MAKE-YOUR-OWN-PET.md:53-74](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L53-L74)

实际子目录安装和发布

<details>
<summary>查看原文（22行）</summary>

````text
## ③ 动画 → 插件

```sh
# 把 step04 的播放变体同步进插件包（webm 直接 cp）
cp step04/*.webm dsh-pet/assets/webm/   # 播放格式（VP9-alpha）

# 本地安装插件（--profile 填实际在用的那个：dsh web → web；
# 桌面应用（Electron 版）改用应用内「插件管理」，见「快速开始（安装插件）」；
# file: 指向插件目录 dsh-pet/dsh-pet）
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
```

> 中间产物（step01-04）由脚本生成、不入仓库；`video/` 源视频和脚本是成果、入库维护。

## 🎯 发布（单一 webm 格式）

插件只发布一个 npm 包、一个素材格式（webm）；`files` 收敛为固定清单（lib / src / assets/webm / runtime/electron-helper / assets/fonts / assets/pic / assets/config.jsonc / scripts/ensure-electron.mjs / cordis.patch.yml，见 `prepare.js`；浏览器与桌面模式共用，包体最小）：

```sh
cd dsh-pet
npm publish --tag latest   # prepack 自动执行构建（完整产物 + 收敛 files），无需手动构建
```
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提示词、抠像、归一化、转码怎样衔接？

**研究主题**：功能与机制

#### 完整回答

提示词要求固定构图和10秒动作，源mp4进入video；step01处理遮罩，step02可走HSV自动绿幕或人工PR透明mov导入，两路共用透明webm。normalize以首尾站立帧、bbox与alpha统计统一尺寸和脚底位置，encode再转640×360、VP9/yuva420p供插件。目录阶段提供中间复用，而不是同一命令自动完成角色创作；输入视频生成与复杂抠像仍在外部工具完成。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:5-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L5-L44)

两条路线与共享后续

<details>
<summary>查看原文（40行）</summary>

````text
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

**依据 2 · 源码核查**：[scripts/chroma_step02.py:13-29](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/chroma_step02.py#L13-L29)

HSV与工具路径

<details>
<summary>查看原文（17行）</summary>

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "step01"
OUT = ROOT / "step02"
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")

PARALLEL = 4
W, H, FPS = 1280, 720, 24
# HSV 色相判定抠像：只把"绿色色相 + 足够饱和/明度"的像素判为背景（透明）。
# 相比 chromakey(YUV 色度距离) 和 RGB 色差阈值：它们是"以绿幕为中心画圈"，
# 蓝色/白色等彩色可能落入圈内被误抠；HSV 色相判定只认绿色方向，蓝/白/红永不误抠。
GREEN_HUE_MIN = 70.0   # 绿色色相下界
GREEN_HUE_MAX = 170.0  # 绿色色相上界
SAT_MIN = 0.15         # 饱和度下界（低于此的白色/浅色不算背景）
VAL_MIN = 0.15         # 明度下界
HUE_FEATHER = 6.0      # 色相边界渐变（度）
```

</details>

**依据 3 · 源码核查**：[scripts/normalize_step03.py:20-37](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/normalize_step03.py#L20-L37)

画布、脚底和采样条件

<details>
<summary>查看原文（18行）</summary>

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "step02"
OUT = ROOT / "step03"
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")

PARALLEL = 4
CANVAS_W = 2160  # 16:9：2160 = 1215 * 16/9，与原始视频同比例
CANVAS_H = 1215
TARGET_HEIGHT = 900
FEET_Y = CANVAS_H - 100  # 距底 100

SRC_W = 1280
SRC_H = 720
FPS = 24
HEAD_FRAMES = 5
TAIL_SEEK = -0.2  # 从末尾取帧，避免取到收尾动作
```

</details>

**依据 4 · 源码核查**：[scripts/normalize_step03.py:42-55](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/normalize_step03.py#L42-L55)

bbox测量

<details>
<summary>查看原文（14行）</summary>

```text
def scan_bbox(video: Path, seek: float | None = None, frames: int | None = None) -> list[tuple[int, int, int, int]]:
    """用 alphaextract,bbox 滤镜扫描帧内容边界，返回 [(x1, x2, y1, y2)] 列表。"""
    cmd = [FFMPEG, "-hide_banner", "-loglevel", "info", "-c:v", "libvpx-vp9"]
    if seek is not None:
        cmd += ["-sseof", str(seek)]
    cmd += ["-i", str(video)]
    if frames is not None:
        cmd += ["-frames:v", str(frames)]
    cmd += ["-vf", "alphaextract,bbox", "-f", "null", "-"]
    # text=True 时显式指定 UTF-8 解码（Windows 默认 GBK 会解不了 ffmpeg 的 UTF-8 输出）
    result = subprocess.run(cmd, check=False, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
    return [tuple(int(g) for g in m.groups()) for m in _BBOX_RE.finditer(result.stderr)]
```

</details>

**依据 5 · 源码核查**：[scripts/encode_thumbs.py:37-75](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/encode_thumbs.py#L37-L75)

实际640x360及alpha编码

<details>
<summary>查看原文（39行）</summary>

```text
PARALLEL = 4
# 转码参数（调这里改画质/分辨率）
TARGET_W = 640    # thumb 宽度（与 2160x1215 母版同 16:9 比例）
TARGET_H = 360    # thumb 高度
CRF = 40       # VP9 质量参数（0-63，越小越清晰越大；40 偏轻，透明区域省码）
FPS = 24       # 帧率（与母版一致，保持动作节奏）


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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对逐段手工视频处理，能借鉴什么增量？

**研究主题**：贡献与相对优势

#### 完整回答

贡献在把生成提示约束、自动/人工抠像统一中间格式、站立姿态归一化及轻量播放版连成制作流程。相对单独ffmpeg命令，固定脚底和多动作首尾有助于运行时无缝切换；相对纯自动抠像，允许手工结果覆盖而不重做下游。HSV、bbox、VP9不是原创，作者本项目全部动作走PR人工抠像，不能把配方称为全自动兑现；本轮未运行质量对照。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:24-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L24-L44)

作者明确全部动作人工PR

<details>
<summary>查看原文（21行）</summary>

````text
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

**依据 2 · 源码核查**：[scripts/pr_import_step02.py:1-17](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/pr_import_step02.py#L1-L17)

人工输入与统一中间格式

<details>
<summary>查看原文（17行）</summary>

```text
"""Import hand-keyed MOV files from pr/ and write transparent WebM into step02/.

针对自动绿幕抠像（chroma_step02.py）对「包含第三方物品」的动作效果不佳的情况：
用户在 PR 里手动抠像，导出携带 alpha 通道的 .mov。本脚本直接用 ffmpeg 把这批
mov 转成透明 webm，写入 step02/，覆盖该动作此前的自动抠像结果。之后继续走
normalize_step03.py → encode_thumbs.py，整条素材链其余环节不变。

使用：
  1. 把 PR 导出的透明 mov 放进 pr/，文件名与动作名一致（如 吃汤圆.mov）。
  2. 运行 `python pr_import_step02.py` → 生成 step02/吃汤圆.webm。
  3. 接着跑 normalize_step03.py、encode_thumbs.py（增量：本动作重做，其余 SKIP）。
  4. 把 step04 结果同步到 dsh-pet/assets/thumb/。

注意：
  - mov 必须携带 alpha 通道（如 ProRes 4444 with alpha，或 PNG 序列封装），
    ffmpeg 解码端才能读回透明；否则输出为不透明。
  - 转换参数按用户指定：-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -an。
```

</details>

**依据 3 · 源码核查**：[scripts/normalize_step03.py:1-8](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/normalize_step03.py#L1-L8)

站立/脚底对齐目标

```text
"""Unify character size across step02 videos into step03.

整帧等比缩放 + overlay 平移到 2160x1215（16:9）透明画布：
- 站立高度 900（按首尾站立帧的平均高度计算缩放比例）
- 水平居中，脚底对齐（按全帧内容最低点对齐，保证动画不裁剪）
- 不裁剪人物/动作内容，底部超出的透明空白直接裁掉
- 画布 2160x1215 与原始视频同为 16:9，宽度容纳最宽动作（2015px）
"""
```

**依据 4 · 源码核查**：[scripts/encode_thumbs.py:45-64](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/encode_thumbs.py#L45-L64)

保留alpha的具体编码机制

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么“可复现”“检查通过”仍不能证明素材合格？

**研究主题**：缺陷与关键质疑

#### 完整回答

脚本把ffmpeg路径固定为仓库.tools下Windows exe，而源码仓库不带这套工具/所有源视频，macOS/Linux需改造并核对工具版本。指南源视频获取处说不入git，后段65却写源视频入库，材料范围文案不一致。更关键的是check_alpha在抽帧失败/无文件/过小时打印WARN却return True，主函数只把False计失败，可能输出alpha OK；这是源码可确认的检查语义缺陷，并未执行复现。抽到首帧有透明也不能证明全部帧边缘、循环和角色完整性。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/chroma_step02.py:13-18](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/chroma_step02.py#L13-L18)

Windows工具硬路径

```text
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "step01"
OUT = ROOT / "step02"
# 统一使用工作区自带的 ffmpeg（素材处理链零第三方依赖）
FFMPEG = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffmpeg.exe")
FFPROBE = str(ROOT / ".tools" / "ffmpeg-9.0.1-essentials_build" / "bin" / "ffprobe.exe")
```

**依据 2 · 作者声明**：[MAKE-YOUR-OWN-PET.md:14-20](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L14-L20)

源视频不入Git

```text
生成结果按动作各存一个 mp4，放入 `video/`。

> **源视频获取**：为控制仓库体积，`video/` 源视频不入 git。Releases 提供**打包压缩包**，浏览器直接下载即可：
>
> - `assets-videos.zip` —— 全部源视频压缩包（中文名 mp4，解压后放入 `video/`）
>
> 解压：`Expand-Archive assets-videos.zip`（Windows）或 `unzip assets-videos.zip`，把 mp4 放回 `video/` 即可运行素材链。
```

**依据 3 · 作者声明**：[MAKE-YOUR-OWN-PET.md:65-65](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L65-L65)

后文源视频入库文案

```text
> 中间产物（step01-04）由脚本生成、不入仓库；`video/` 源视频和脚本是成果、入库维护。
```

**依据 4 · 源码核查**：[scripts/check_alpha.py:15-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/check_alpha.py#L15-L44)

抽帧失败返回True及主函数计数

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

#### 缺口

- 当前素材源件完整性、跨平台可执行性和逐帧质量未知
  **影响**：不能承诺clone后全流程直接可复现或绿灯即可发布
  **进一步探讨**：固定授权源视频和工具后按透明度、完整性、循环/脚底逐帧检查，失败样本独立对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 创作与播放分别依赖哪些工具和资源？

**研究主题**：依赖、兼容与流程

#### 完整回答

创作上游需AI视频工具或自行已有源片、生成费用与角色权利确认；脚本依赖Python3、numpy/scipy和ffmpeg/ffprobe，复杂边缘另需人工编辑器，Safari/HEVC转换还有特定macOS工具链。播放端依赖dsh-pet子包及其宿主，不把Python/PR当普通插件运行必需。源码MIT与素材/提示词/形象非商业及署名条件分开，研究仅转述当前材料，不替作者补充授权结论。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:5-7](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L5-L7)

源视频生成工具

```text
## ① 提示词 → 源视频

用 AI 视频生成工具（如可灵、Runway、豆包等，本项目素材即由豆包生成），按 `prompts/桌面宠物 10 秒动作提示词.md` 的配方，一个动作生成一段 10 秒绿幕视频：
```

**依据 2 · 作者声明**：[MAKE-YOUR-OWN-PET.md:24-51](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L24-L51)

人工路线、Python依赖和Safari资源

<details>
<summary>查看原文（28行）</summary>

````text
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

## ②.5 🍎 Safari/HEVC 兼容素材（macOS 专用 mov）

插件默认只发布 `.webm`（VP9-alpha），Safari/WKWebView 不认 webm alpha（黑底），macOS 需要在 GitHub Release 下载官方转码的 **HEVC-with-Alpha `.mov`** 素材使用，两步：

1. **下载**：<https://github.com/PC2005-cloud/dsh-pet/releases/tag/assets-mov>（固定 tag，保持最新；zip 解压后文件名与 webm 一一对应）
2. **放入**：`.mov` 文件放进 `$DSH_HOME/dsh-pet/main-animation/mov/`（pet pack 宠物则是 `pet/<种类名>-animation/mov/`）
````

</details>

**依据 3 · 作者声明**：[README.md:432-438](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L432-L438)

代码与素材/形象声明

```text
## 许可

- 代码：MIT
- 素材（动画/提示词/源视频）：允许开源使用，**禁止商用**
- **二次创作（二创）约定**：基于本项目的衍生 / 改版 / 换皮作品，在 **GitHub 仓库、产品官网等公开渠道**上须附上原作者 GitHub 地址：<https://github.com/PC2005-cloud/dsh-pet>
- **形象出处**：宠物形象为社区二创的 DeepSeek「大肥鱼」（鲸鱼娘），**非 DeepSeek 官方形象**；原型「溟月」出自 B 站 [@上善无形](https://space.bilibili.com/4456176)，DeepSeek 版（女仆鲸鱼娘）设计出自 B 站 [@ZipZipPipe](https://space.bilibili.com/4168597)
- **形象授权**：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)（署名 · 非商业 · 相同方式共享），[声明原文](https://www.bilibili.com/opus/1247156596114456581)：「大肥鱼是遵守CC BY-NC-SA 4.0协议的形象，不可以以任何形式商业化。若您非常喜爱该形象，希望其拥有实体，您可以自行定制。」
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 素材链如何计入生成、人工精修、重试与退出？

**研究主题**：效果与总成本

#### 完整回答

首次要准备角色、动作视频、工具路径和目标播放环境；持续每个动作承担视频生成、人工抠像、归一化与转码CPU/磁盘，并逐帧复核。失败不能仅重跑到检查绿灯：alpha检查自身有fail-open，需保留原片和中间素材，必要时回人工编辑。退出可保留标准透明mov/webm并手工接到其他桌宠，但平台格式及授权需继续核对。未提供可用于当前任务的生成金额、每动作人时、成片率或资源测量，不能推算廉价量产。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:24-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L24-L44)

作者手工路线与依赖

<details>
<summary>查看原文（21行）</summary>

````text
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

**依据 2 · 源码核查**：[scripts/pr_import_step02.py:43-74](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/pr_import_step02.py#L43-L74)

转码与错误抛出

<details>
<summary>查看原文（32行）</summary>

```text
def convert_video(src: Path, dst: Path) -> None:
    """把带 alpha 的 mov 转码为透明 VP9 webm（保持原始分辨率，不做缩放）。

    注意：
    - 解码端不做强制指定：PR 导出的 mov 自带 alpha（ProRes/PNG 封装），ffmpeg
      自动解码器能读回 rgba；若源不含 alpha 则结果不透明（见模块 docstring）。
    - 编码端必须 -c:v libvpx-vp9 + -pix_fmt yuva420p 才能把 alpha 写进 WebM。
    """
    cmd = [
        FFMPEG,
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
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

**依据 3 · 源码核查**：[scripts/check_alpha.py:15-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/check_alpha.py#L15-L44)

错误检查退路不充分

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

#### 缺口

- 单位合格动作的生成次数、精修时间和转码成本未知
  **影响**：不能判断相比人工流程有净经济收益
  **进一步探讨**：固定一组难边缘和宽动作，分别记录生成重试、编辑人时、计算资源及通过质量门槛的数量

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些可复用做法和检查缺陷值得关注？

**研究主题**：工程质量与复用

#### 完整回答

正向设计是人工/自动路线共用step02、独立阶段方便重做单动作，以及转码显式保留alpha而不是依赖默认解码。恢复检查以文件大小、时间戳和ffprobe判断可复用输入，但不能替代透明/质量验证。check_alpha抽帧失败return True、encode注释仍写旧360x360而常量为640x360，提醒移植要以执行参数和fail-closed结果为准。本轮inventory不统计Python主体代码行，也不等于全素材审计。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/pr_import_step02.py:77-85](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/pr_import_step02.py#L77-L85)

恢复检查的真实判据

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

**依据 2 · 源码核查**：[scripts/encode_thumbs.py:1-21](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/encode_thumbs.py#L1-L21)

旧说明文案

<details>
<summary>查看原文（21行）</summary>

```text
"""Transcode step03 masters into 360x360 playback thumbnails (step04).

素材处理链的第 4 步（转码）：把归一化后的 1200x1200 透明母版（step03/）
转成 360x360 播放变体（step04/），供 dsh-pet 插件运行时使用。

完整处理链（与 crop_step01.py / chroma_step02.py / normalize_step03.py 同级）：
  step01（原始视频）→ crop_step01.py → chroma_step02.py（绿幕抠像）
  → step02（透明 810x720）→ normalize_step03.py（归一化 1200x1200 统一站立）
  → step03（母版）→ 本脚本 → step04（360x360 播放变体）

step04 是素材处理链的最终产物。发布/安装插件时把 step04 的内容
同步到 dsh-pet/assets/thumb/（npm 包需要自包含的播放资源）。

为什么需要转码：
- 播放时宠物只显示约 260px，360 分辨率已足够清晰，1200 是 4.6 倍冗余
- 1200 全量 172MB 超过 npm 包体积上限；转码后仅 ~10MB，可以发布
- 播放更省内存、切换更快

双轨设计：
- thumb（本脚本产物，360x360，step04）→ 同步进 npm 包 assets/thumb/，运行时播放
- full（step03 原始 1200x1200）→ 不进 npm 包，发布到 GitHub Releases 存档
```

</details>

**依据 3 · 源码核查**：[scripts/encode_thumbs.py:37-64](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/encode_thumbs.py#L37-L64)

实际常量和alpha参数

<details>
<summary>查看原文（28行）</summary>

```text
PARALLEL = 4
# 转码参数（调这里改画质/分辨率）
TARGET_W = 640    # thumb 宽度（与 2160x1215 母版同 16:9 比例）
TARGET_H = 360    # thumb 高度
CRF = 40       # VP9 质量参数（0-63，越小越清晰越大；40 偏轻，透明区域省码）
FPS = 24       # 帧率（与母版一致，保持动作节奏）


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
```

</details>

**依据 4 · 源码核查**：[scripts/check_alpha.py:15-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/check_alpha.py#L15-L44)

失败仍被当通过的检查语义

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样把制作链升级为可证伪的素材验收契约？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每动作输出带源hash、工具版本、全部帧alpha/边界/脚底和首尾差异的manifest，抽帧失败记error而非pass。由两路输入共享中间格式和当前fail-open检查推导，可能在不强制全自动抠像下稳定交付。最小验证准备无alpha、坏视频、边缘残留、超宽动作和合格样本，对照当前检查与manifest门槛，测误放行及人工补检时间；若仍漏关键缺陷或扫描成本超出人工抽查收益，则否定采用整套契约。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/check_alpha.py:15-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/check_alpha.py#L15-L44)

fail-open触发设计需求

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[scripts/normalize_step03.py:1-8](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/normalize_step03.py#L1-L8)

对齐/不裁剪目标

```text
"""Unify character size across step02 videos into step03.

整帧等比缩放 + overlay 平移到 2160x1215（16:9）透明画布：
- 站立高度 900（按首尾站立帧的平均高度计算缩放比例）
- 水平居中，脚底对齐（按全帧内容最低点对齐，保证动画不裁剪）
- 不裁剪人物/动作内容，底部超出的透明空白直接裁掉
- 画布 2160x1215 与原始视频同为 16:9，宽度容纳最宽动作（2015px）
"""
```

**依据 3 · 源码核查**：[scripts/pr_import_step02.py:1-17](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/pr_import_step02.py#L1-L17)

两路中间产物

<details>
<summary>查看原文（17行）</summary>

```text
"""Import hand-keyed MOV files from pr/ and write transparent WebM into step02/.

针对自动绿幕抠像（chroma_step02.py）对「包含第三方物品」的动作效果不佳的情况：
用户在 PR 里手动抠像，导出携带 alpha 通道的 .mov。本脚本直接用 ffmpeg 把这批
mov 转成透明 webm，写入 step02/，覆盖该动作此前的自动抠像结果。之后继续走
normalize_step03.py → encode_thumbs.py，整条素材链其余环节不变。

使用：
  1. 把 PR 导出的透明 mov 放进 pr/，文件名与动作名一致（如 吃汤圆.mov）。
  2. 运行 `python pr_import_step02.py` → 生成 step02/吃汤圆.webm。
  3. 接着跑 normalize_step03.py、encode_thumbs.py（增量：本动作重做，其余 SKIP）。
  4. 把 step04 结果同步到 dsh-pet/assets/thumb/。

注意：
  - mov 必须携带 alpha 通道（如 ProRes 4444 with alpha，或 PNG 序列封装），
    ffmpeg 解码端才能读回透明；否则输出为不透明。
  - 转换参数按用户指定：-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -an。
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 根制作链适合立即采用还是观察，停止点在哪里？

**研究主题**：采用判断

#### 完整回答

当前建议有透明视频制作经验的素材作者先观察并核对工具路径和质量检查，避免按“全流程可复现”直接批量生成。它提供可借鉴的对齐和转码阶段，但不替代人工抠像，也没有可信的当前自动放行门槛。遇到坏视频仍alpha OK、跨平台工具缺失或角色/素材范围不清时停止发布，保留原片与中间产物，退回人工编辑器和逐帧验收；只想养宠物者直接评估子插件。

#### 证据与依据

**依据 1 · 作者声明**：[MAKE-YOUR-OWN-PET.md:24-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/MAKE-YOUR-OWN-PET.md#L24-L44)

实际人工制作路线

<details>
<summary>查看原文（21行）</summary>

````text
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

**依据 2 · 源码核查**：[scripts/check_alpha.py:15-44](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/scripts/check_alpha.py#L15-L44)

停止条件的检查缺陷

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:432-438](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L432-L438)

素材范围限制

```text
## 许可

- 代码：MIT
- 素材（动画/提示词/源视频）：允许开源使用，**禁止商用**
- **二次创作（二创）约定**：基于本项目的衍生 / 改版 / 换皮作品，在 **GitHub 仓库、产品官网等公开渠道**上须附上原作者 GitHub 地址：<https://github.com/PC2005-cloud/dsh-pet>
- **形象出处**：宠物形象为社区二创的 DeepSeek「大肥鱼」（鲸鱼娘），**非 DeepSeek 官方形象**；原型「溟月」出自 B 站 [@上善无形](https://space.bilibili.com/4456176)，DeepSeek 版（女仆鲸鱼娘）设计出自 B 站 [@ZipZipPipe](https://space.bilibili.com/4168597)
- **形象授权**：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)（署名 · 非商业 · 相同方式共享），[声明原文](https://www.bilibili.com/opus/1247156596114456581)：「大肥鱼是遵守CC BY-NC-SA 4.0协议的形象，不可以以任何形式商业化。若您非常喜爱该形象，希望其拥有实体，您可以自行定制。」
```

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
