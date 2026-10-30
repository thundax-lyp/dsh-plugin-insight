# Awesome DeepSeek Harness（libukai）

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7eb1fad](https://github.com/libukai/awesome-deepseek-harness/tree/7eb1fadd4d68ca121e27ad09093a1fb258147747)

<!-- BEGIN META -->
[![GitHub ★ 335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/libukai/awesome-deepseek-harness)
<!-- END META -->

> **功能**：以中英日文指南组织官方入门、教程、客户端、插件和集成，帮助读者分清对象类型与查证版本、权限及采用条件。

> **亮点**：官方与社区分层、客户端/发行版/插件区别和若干采用条件说明；这是资料贡献而非可执行技术机制，见 [Q01](#research-q01)。

> **主要限制**：外部CI/版本/权限陈述未独立核，代码块未钉文中基线，读者执行将产生本项目不控制的副作用，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 这份指南为谁做什么，真实对象类型是什么？](#detail-section-11)
  - [Q02 · 读者从文档到具体行动的链是什么，版本边界在哪里？](#detail-section-12)
  - [Q03 · 阅读和复制执行的成本、失败及退出应如何区分？](#detail-section-13)
  - [Q04 · 怎样有限采用，未来方向与当前分类提醒有何不同？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：初学者/选型者建立生态地图，按对象类别找官方入口与原仓，见 [Q01](#research-q01)。

官方文档、GitHub主题/搜索、逐个原仓README与其他awesome列表；本项长处是编辑组织和类别/版本风险提示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 三语导航 | 学习/找原仓 | 未逐句校译或核所有外链 |
| 对象分类 | 区分发行版/客户端/插件 | 人工资料，不自动检测Host |
| 采用提示 | 查版本/权限/费用线索 | 编辑转述非安装/安全通过 |
| 命令示例 | 交给外部程序执行 | 未固定基线，副作用另授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown/网络或仓库副本 | 阅读需要 | 目录与外链 | 离线可读文字，外链需另取 |
| 官方/原仓固定材料 | 采用候选必需 | 复核实际版本与行为 | 只能留未验证 |
| Node/Python/包管理器/模型服务 | 执行所选外部路径时 | Runtime/SDK/模型 | 不是读指南门槛，费用另核 |
| Profile/凭据/权限/可选云 | 按候选 | 实际工具与外部服务 | 本指南不统一隔离或撤销 |
| 人工编辑/三语核对 | 维护需要 | 更新分类与基线 | 无自动过期拒绝机制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定位 | 读者按官方/教程/客户端/插件分类 | 不把发行版当bundle |
| 查证 | 打开固定上游与原始版本记录 | 指南摘要仅线索 |
| 采用 | 对应程序/读者授权真实动作 | 命令未固定时先钉版本 |
| 验收 | 核具体最小任务/权限/退出 | 文中CI/低风险不能代验 |
| 撤销 | 分别处理已装对象及资料 | 关指南不等卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读成本低；外部安装/模型另计未知 | 分类定位/回原仓核版本/备份 | 没有本项目安装收费机制 |
| 持续使用 | 上游模型/云/本地Runtime未知 | 三语与依赖漂移复核 | 指南净节时未测 |
| 失败恢复 | 已写Profile/凭据/运行资源另计 | 分原因查固定原件，防重复安装 | 不以文中CI当恢复证明 |
| 退出 | 指南可关闭；外部副本/凭据另计 | 删书签与卸载/撤权分别核 | 本项目无统一清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 入门导航 | 三语目录与官方/社区分层 | 学习效果/全文翻译一致 |
| 对象区分 | 客户端/Fork/bundle明示 | 实际减少错装 |
| 风险线索 | 版本/权限/早期提醒文字 | 链接对象真实性/当前兼容 |
| 选择准备 | 原仓/命令入口 | 功能通过/安全/净节时 |

> **思考**：外部CI/版本/权限陈述未独立核，代码块未钉文中基线，读者执行将产生本项目不控制的副作用，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：官方与社区分层、客户端/发行版/插件区别和若干采用条件说明；这是资料贡献而非可执行技术机制，见 [Q01](#research-q01)。

没有可执行工程入口；值得保留的是区分对象、编辑判断和上游执行条件，不能复制文字即宣称自动治理。

<a id="detail-section-5"></a>

### 1.4 主要限制

外部CI/版本/权限陈述未独立核，代码块未钉文中基线，读者执行将产生本项目不控制的副作用，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可作为学习/查证起点，使用具体对象前回固定原仓；版本/类型/授权不明则停在阅读，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定树/三语入口、中文结构及代表外部采用摘要可核，未执行命令/访问全部链接或核远端最新状态。有限采用为资料入口。

- 已检查：作者 README、包清单、源码路径 README.md、README_EN.md、README_JA.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定git树核三README+两图片，没有manifest/代码/工作流。读三语入口/结构、中文快速开始/分类与代表客户端、插件、集成/开发工具风险摘要；未逐句校译、全审所链接源码/CI或验证远端版本，不执行代码块。
- 下一步：让读者用固定任务对照官方/原仓和本指南，核类型/版本/权限判断、最小行为/退出证据与复核总时间。

**分析版本**

- **仓库**：[libukai/awesome-deepseek-harness](https://github.com/libukai/awesome-deepseek-harness)
- **版本号**：未声明（[固定提交 7eb1fad](https://github.com/libukai/awesome-deepseek-harness/tree/7eb1fadd4d68ca121e27ad09093a1fb258147747)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在现有分类/提醒之上，把目标环境/任务与固定候选原始行为/退出证据绑定的只读采用任务卡，比较误荐与总工时，可被否定，见 [Q04](#research-q04)。

让读者用固定任务对照官方/原仓和本指南，核类型/版本/权限判断、最小行为/退出证据与复核总时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 921 | — | — | 29973 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/libukai/awesome-deepseek-harness/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：人工资料导航能支持什么选型，哪些外部版本/功能/安全仍需读者回原件核验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这份指南为谁做什么，真实对象类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是DeepSeek Harness生态的人工编辑资料指南：帮助初学者/选型者找到官方入门、教程、客户端、插件、外部集成和开发工具，另有中英日阅读入口。不是DSH bundle、桌面客户端、安装器、Skill或自主Agent。固定Git树只有三份README和两张图片；不存在可追到本项目模型调用、安装执行或后台服务的入口，外部项目的功能归各自对象。

相对从搜索引擎、GitHub主题和官方文档逐条查找，增量是分类与用途/版本/权限/早期状态的文字提示。尤其把发行版/Fork不能当普通插件、独立客户端靠桥接接入等区别写明，有助先选正确入口。三语入口可核，但未逐句校译或验证全部链接；“精选优质”和测试/安全叙述只是编辑判断/外部资料转述，不能用星数、收录量或术语密度替代选择正确率和需求。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:8-22](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L8-L22)

三语入口与作者精选定位。

<details>
<summary>查看原文（15行）</summary>

```text
  简体中文 · <a href="README_EN.md">English</a> · <a href="README_JA.md">日本語</a>
</p>

<p align="center">
  DeepSeek Harness 终极指南：资料、教程、插件与工具<br>
</p>

<p align="center">
  <a href="https://awesome.re"><img src="https://awesome.re/badge.svg" alt="Awesome"></a>
  <a href="https://github.com/topics/dsh-plugin"><img src="https://img.shields.io/badge/GitHub-dsh--plugin-0969da?style=flat-square" alt="GitHub topic: dsh-plugin"></a>
  <a href="https://github.com/libukai/awesome-deepseek-harness/stargazers"><img src="https://img.shields.io/github/stars/libukai/awesome-deepseek-harness?style=flat-square" alt="GitHub Stars"></a>
  <a href="https://github.com/libukai/awesome-deepseek-harness/issues"><img src="https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square" alt="Issues welcome"></a>
</p>

本项目秉持少而精的原则，精选并收录 DeepSeek Harness 相关优质资源，与更多 AI 从业者共同构建更繁荣的 Agent 生态。
```

</details>

**依据 2 · 源码核查**：[README.md:26-53](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L26-L53)

学习/选型导航结构。

<details>
<summary>查看原文（28行）</summary>

```text
## 目录

- [目录](#目录)
- [快速开始](#快速开始)
  - [启动 Web UI](#启动-web-ui)
  - [从源码运行](#从源码运行)
  - [使用 Python SDK](#使用-python-sdk)
  - [安装插件](#安装插件)
- [官方资源](#官方资源)
  - [安装集成](#安装集成)
  - [源码仓库](#源码仓库)
  - [官方文档](#官方文档)
  - [讨论社区](#讨论社区)
- [社区资源](#社区资源)
  - [分析教程](#分析教程)
  - [社区讨论](#社区讨论)
- [第三方客户端](#第三方客户端)
  - [桌面与发行版](#桌面与发行版)
  - [终端、移动与 Web 体验](#终端移动与-web-体验)
- [精选插件](#精选插件)
  - [工作流与 Agent](#工作流与-agent)
  - [上下文、会话与输入](#上下文会话与输入)
  - [浏览器、视觉与界面](#浏览器视觉与界面)
  - [沙箱与执行](#沙箱与执行)
  - [主题与皮肤](#主题与皮肤)
- [外部集成](#外部集成)
- [开发工具](#开发工具)
- [致谢](#致谢)
```

</details>

**依据 3 · 源码核查**：[README.md:152-181](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L152-L181)

客户端/发行版/插件分类和代表叙述。

<details>
<summary>查看原文（30行）</summary>

```text
## 第三方客户端

以下项目提供了独立的用户界面、发行形态或产品化组装，而不只是单个工具能力。

> **分类说明：** 发行版或 Fork 会直接复用、修改或重新打包完整的 DSH Runtime，不能通过 `dsh plugin` 安装，因此不属于插件；独立客户端则通过 Web、RPC、ACP 或配套桥接插件连接 DSH。它们仍然是 Harness 生态的重要组成部分。

### 桌面与发行版

| 项目                                                      | 平台 / 形态                          | 说明                                                                                                                   |
| --------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [DeepSeek Harness Desktop (anywhere-labs)](https://github.com/anywhere-labs/dsh-desktop) | macOS (Apple Silicon) / Windows · Electron | `v2.0.2` 固定并原样运行 DSH `0.1.1-rc.2`，提供本地服务、系统托盘、恢复 / 回滚和内置插件市场；上游含破坏性更新，旧 Profile 与未适配插件可能失效，升级前应先新建安全 Profile 并保留插件清单 |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | macOS / Windows · Electron · 早期 | 原样复用官方 Web UI，并让长任务常驻托盘；关闭渲染层 Node 集成、限制导航、更新包校验 SHA-256，但 Agent 进程仍拥有普通用户级文件权限，发行包也尚未正式开发者签名 |
| [DeepSeek Harness Desktop (steven-kid)](https://github.com/steven-kid/deepseek-harness-desktop) | macOS / Windows / Linux · Electron · 早期 | 保持原版 Web UI 的最小桌面壳，使用随机回环端口、Electron 沙箱和 `contextIsolation`，发行包通过跨平台启动冒烟测试；macOS 尚未公证，Windows 尚未商业签名 |
| [DeepSeek Harness Desktop App](https://github.com/vibeinging/dsh-desktop) | macOS / Windows · Electron · 社区工作台 | `v0.1.9` 在官方 Web / Profile 运行链上提供项目、Git Worktree、浏览器、Canvas、Site、Office 产物、文件 / 文件夹附件和 14 个固定 Bundle；macOS Apple Silicon 包已签名公证，Windows x64 包未签名但已在 GitHub Windows Runner 验收安装、启动、断网 Profile、恢复、卸载与残留清理。中断的插件安装会在下次启动安全重试，用户主动卸载的插件不会被自动补回 |
| [TinyWhale](https://github.com/aimierbear/TinyWhale)      | macOS · Electron · 发行版 Fork       | 直接 Fork `deepseek-ai/deepseek-harness` 并增加独立桌面壳；连接已有 Web UI，或启动完整的 `dsh web` Runtime，不属于插件 |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh)   | macOS / Linux / Windows · 社区发行版 | 将 DSH、Node.js 与本地能力打包为 Desktop、Web 和 TUI 三种形态，提供分层安装包与统一的 `ohdsh` 启动器                   |
| [DSH Desktop](https://github.com/dataelement/dsh-desktop) | macOS / Windows · Electron           | 管理本地 Harness、工作区、随机端口、Profile、插件和会话的跨平台桌面端                                                  |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | Windows · WebView2                   | 提供静默启动、独立窗口、便携包和 MSI 的轻量启动器                                                                      |

### 终端、移动与 Web 体验

| 项目                                                            | 类型              | 说明                                                                                              |
| --------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)               | TUI Bundle        | Claude Code 风格全屏终端、流式状态、上下文仪表与会话回退                                          |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | TUI Bundle        | 基于天枢演进的完整终端交互层，状态来自 DSH 会话事件流                                             |
| [dsh-tui](https://github.com/openguardrails/dsh-tui)            | TUI Bundle · 早期 | 支持本地 DeepSeek 与离线运行；仍处于活跃开发期，移植前的测试套件尚未恢复运行                      |
| [dsh-mini-tui](https://github.com/boxeryao/dsh-mini-tui)        | TUI 插件 · 早期   | 直接连接 DSH Runtime 的轻量终端界面；MIT、`v0.2.0`，通过 npm 安装，并以 DSH `0.1.0-rc.6` 开发与测试 |
| [Orbis](https://github.com/icodesign/orbis)                     | 移动远控 · Beta   | 通过 DSH 插件完成设备配对、端到端加密传输和多设备实时更新                                         |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)       | Web UI 集合       | 汇总任务看板、Git Graph、移动界面、皮肤、宠物和运行统计等组件                                     |
| [dsh-web](https://github.com/Tom6814/dsh-web)                   | Docker Web · 早期 | 通过 Docker 部署完整 Web 界面、工作区和插件市场；项目处于高速开发期，需挂载数据卷持久化配置与会话 |
```

</details>

**依据 4 · 源码核查**：[README_EN.md:8-13](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README_EN.md#L8-L13)

英文入口。

```text
  <a href="README.md">简体中文</a> · English · <a href="README_JA.md">日本語</a>
</p>

<p align="center">
  The ultimate guide to DeepSeek Harness: resources, tutorials, plugins, and tools<br>
</p>
```

**依据 5 · 源码核查**：[README_JA.md:8-13](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README_JA.md#L8-L13)

日文入口。

```text
  <a href="README.md">简体中文</a> · <a href="README_EN.md">English</a> · 日本語
</p>

<p align="center">
  DeepSeek Harness の究極ガイド：資料、チュートリアル、プラグイン、ツール<br>
</p>
```

#### 缺口

- 无真实读者任务/三语准确性或链接全量有效性验收。
  **影响**：只能肯定当前指南组织存在，不能说它已减少选错对象或核验工时。
  **进一步探讨**：给初学者/维护者相同已知任务比较官方文档/搜索与指南，核正确类型选择与复核总时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 读者从文档到具体行动的链是什么，版本边界在哪里？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

活动机制是读者读目录/类别、按用途点击官方/外部源，再自行决定命令；没有自动读取Host状态、验证候选或代执行的工程链。快速开始给Node+npx启动Web、从源码pnpm构建、Python SDK虚拟环境/pip路径，随后配置模型服务；这些代码块由人复制给外部程序才产生实际动作，本项目不返回运行结果。官方资源链接和社区教程分开，第三方客户端表与插件区分组，能建立初步行动顺序，不能替代源对象使用说明。

README的“当前核验版”、npm标签、许可、测试/CI和兼容基线都是该固定文档中的作者陈述，不是本轮去远端核过的事实；npx @deepseek-ai/dsh、pip install deepseek-harness-sdk及git clone命令本身未钉所述版本/commit。安装插件段建议固定Git commit并先查安装脚本，同时提醒构建脚本可在Agent沙箱之外执行，这个提醒已经存在，未来不能只把“加风险警告”算新功能。固定树无生成脚本/验证工作流，三语/版本内容的维护依编辑，而不由本项目自动拒绝陈旧依赖。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:55-69](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L55-L69)

作者所述Host/Node/Web入口，按文档转述定界。

<details>
<summary>查看原文（15行）</summary>

````text
## 快速开始

[DeepSeek Harness](https://deepseek.com/harness/)（简称 DSH 或 `dsh`）是 DeepSeek AI 开源的 Agent Harness 项目。它基于 [Cordis](https://github.com/cordiverse/cordis)，采用 **Everything is a Plugin（一切皆插件）** 的架构：模型适配器、工具、会话日志、界面和 Agent Loop 都可以通过插件树组合与替换。

当前核验到的官方 GitHub 开发者预览版为 [`0.1.2-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1)；npm `latest` 与 `next` 均已指向 `0.1.2-rc.1`。该 RC 增加完整历史回合导航、精确 Token / 耗时统计、子代理模型选择、ACP 标准控件、定时任务和断线重连，并以可双向继续的 `send_message` 取代单向 `report`。公开 WebFetch 默认启用但有 SSRF 防护；SQLite Session Backend 已移除（旧数据保留，导出需旧版本）；DeepSeek 适配器默认附带已启用插件包名与版本（可关闭），Session 日志增量上传仍为可选且默认关闭。官方同时明示未经安全审计，Sandbox、Approval 与 Permission 不构成完全隔离保证。下方各项目标注的 DSH 版本仅代表作者声明的开发或测试基线，不应自动视为已兼容最新预览版。

### 启动 Web UI

安装 [Node.js](https://nodejs.org/) 22.19.x 或 24+（推荐 24+）后执行：

```bash
npx @deepseek-ai/dsh web
```

默认访问 `http://127.0.0.1:3080`。进入 **Settings → Models** 配置模型服务后即可创建会话。详细步骤见[官方快速开始](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart)和[模型服务配置](https://deepseek-harness.github.io/deepseek-harness/guide/providers)。
````

</details>

**依据 2 · 源码核查**：[README.md:71-99](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L71-L99)

源码/SDK/插件命令与未固定来源。

<details>
<summary>查看原文（29行）</summary>

````text
### 从源码运行

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

### 使用 Python SDK

官方 Python SDK 支持通过内置运行时以编程方式调用 Harness，无需在系统中安装 Node.js。当前要求 Python 3.10+，支持情况和平台限制以[官方 Python SDK 指南](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)为准。

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install deepseek-harness-sdk
```

### 安装插件

`web` 和 `headless` 是发行版内置的 Profile。外部插件以声明 `dsh.bundle` 的 Bundle 加入指定 Profile：

```bash
dsh plugin --profile web add <package-or-git-spec>
dsh --profile web --dump-config
```

````

</details>

**依据 3 · 源码核查**：[README.md:100-100](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L100-L100)

已有安装脚本与沙箱外执行提醒。

```text
从 Git 仓库安装时，建议固定 commit，并先检查安装脚本。pnpm 可能要求显式授权依赖的构建脚本；这些构建脚本会在 Agent 沙箱之外执行。完整机制见[官方插件打包与安装教程](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)。
```

**依据 4 · 源码核查**：[README.md:102-126](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L102-L126)

官方来源/社区导航。

<details>
<summary>查看原文（25行）</summary>

```text
## 官方资源

官方提供开源仓库、配套论文和较完整的参考文档，并持续运营开发者社区。

### 安装集成

- [@deepseek-ai/dsh](https://www.npmjs.com/package/@deepseek-ai/dsh)：官方 CLI 与 Web UI 的 npm 启动包
- [deepseek-harness-sdk](https://pypi.org/project/deepseek-harness-sdk/)：用于程序化集成 DSH 的官方 Python SDK

### 源码仓库

- [GitHub](https://github.com/deepseek-ai/deepseek-harness)：查看源码、Issue、版本与贡献者
- [Paper](https://github.com/cordiverse/paper)：基于 Cordis 的产品架构详解论文

### 官方文档

- [中文官网](https://deepseek.com/harness/)：了解产品定位和核心理念
- [帮助文档](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart)：使用、插件开发与架构参考入口

### 讨论社区

- [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)：问题反馈、使用交流和提案讨论
- [Discord DeepSeek](https://discord.gg/Ycq5dCaS4)：官方 Discord 社区，以中文讨论为主
- ["DeepSeek Harness"](https://x.com/search?q=%22DeepSeek%20Harness%22%20OR%20dsh-plugin&src=typed_query&f=live)：X 上有关 DSH 的实时搜索结果
- [# dsh-plugin](https://github.com/topics/dsh-plugin)：GitHub 上的 DSH 插件项目集合
```

</details>

**依据 5 · 源码核查**：[README.md:130-150](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L130-L150)

外部教程/论述及作者背景。

<details>
<summary>查看原文（21行）</summary>

```text
### 分析教程

| 教程                                                                                         | 形式            | 内容                                                                             |
| -------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------- |
| [DeepSeek Harness 从零到一](https://yanhua1010.github.io/dsh-harness-tutorial/)              | 中文教程与 Demo | 包含原理、源码拆解、8 个 Demo 和 `mini-harness` 教学项目                         |
| [DeepSeek Harness：从开机到拆开](https://github.com/alchaincyf/deepseek-harness-orange-book) | 中文实测电子书  | 提供 PDF、EPUB 和 HTML，收录完整系统提示词、129 行默认启动清单与三份原始会话日志 |
| [解剖 DeepSeek Harness](https://xueai.app/slides/learn.html#dsh-1.html)                      | 交互式源码专题  | 拆解会话、上下文、工具、沙箱、Code Mode 和 Subagent 等核心机制                   |
| [Cordis 在做什么：从 DeepSeek Harness 看](https://blog.antinomie.org)                        | 中文架构短文    | 从插件作者视角解释 Cordis 心智模型，讨论复杂度如何转移到系统内部                 |
| [DeepSeek Harness 白皮书](https://github.com/Electricitysheep/dsh-handbook)                  | 中英双语手册    | 14 章覆盖安装、插件开发、安全与成本，提供在线阅读、PDF 和可运行示例；内容采用 CC BY-NC-SA 4.0，基于 `0.1.0-rc.6` |
| [NanoCordis](https://github.com/SheltonLiu-N/nano-cordis)                                    | 可运行的教学实现 | 用约 1,600 行 TypeScript 重建 Cordis 插件框架与 DSH 形态的 Agent Runtime；MIT、npm `0.1.0`、95 项测试，默认 Fake Model 无需 Key，Bash 工具仍需人工批准，真实模型凭据只从环境变量读取 |

### 社区讨论

收录包含完整论述、实践细节或一手背景的公开社交媒体长帖，补充官方资料未覆盖的背景与实践细节。

| 长帖                                                                                                           | 作者与背景                                                                | 内容摘要                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [从早期参与者视角理解 DSH](https://x.com/jiayuan_jy/status/2087911060154314963)                                | [Jiayuan (JY) Zhang](https://x.com/jiayuan_jy)；作者自述提前一个月获得仓库访问权限 | 将 DSH 同时理解为可运行的 Coding Agent 和 Agent 开发框架；用“乐高汽车”解释一切皆插件，并讨论 Runtime 自扩展、自进化软件雏形、当前成熟度和函数式编程特征。 |
| [从 Agent Runtime / Agent OS 视角理解 DSH](https://x.com/anion_ex/status/2087910193783025853)                  | [Anionex](https://x.com/anion_ex)；内测参与者与插件作者                           | 从模型、工具、策略、存储、上下文、界面和 Loop 的可组合性解释 DSH，并讨论 Agent 对运行时的有限观察与自扩展。                                               |
| [玩了一夜 DeepSeek Harness，我发现它在用《我的世界》的方式干掉 Claude Code](https://www.pingwest.com/a/316436) | 品玩；发布首夜的媒体观察                                                        | 用《我的世界》的原版、Mod、CurseForge 与整合包类比 DSH 本体、插件、目录和发行版，并记录首夜的兼容性与安全争议。                                           |
| [从源码对照 DSH 与 Codex：声明式插件 vs 可替换 Agent Loop](https://x.com/grapeot/status/2088019011561005382)   | [鸭哥](https://x.com/grapeot)；读完源码后与 Codex 逐行对照。展开文见 [yage.ai](https://yage.ai/share/dsh-deep-analysis-20260813.html) | 将 Codex 的声明式插件与 DSH 的命令式进程内插件对照，认为日常写代码并不需要 Cordis 的复杂度；唯一结构性优势是 Agent Loop 本身可热替换，从而为自进化 Harness 提供物理插槽。 |
```

</details>

#### 缺口

- 未读全部链接对象固定源码、远端标签或执行任一启动/配置/安装路径。
  **影响**：不能承诺命令取得的对象与文字核验基线相同，也不能把外部CI陈述升级独立兼容验收。
  **进一步探讨**：选一个目标版本/平台/任务，先核官方固定原件与安装元数据，再用隔离配置逐项验最小功能与回退，另记核验时间。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 阅读和复制执行的成本、失败及退出应如何区分？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

只阅读指南无需模型Key或Node/Python，但复制启动/SDK/源码/插件路径后依赖、账单与写入都转到外部对象：上游运行时/包管理器、模型服务凭据与费用、所选Profile/工作区、构建脚本权限、可选云或机器人账户。这里的“无需Node”是文中Python SDK介绍，不能外推所有DSH或当前SDK发行；本轮不验证外部实现。代表集成条目已提示消息会经过服务商、明文凭据/授权用户触发模型工具、遥测可能发送内容等差异，这些是查证线索，不是统一权限隔离承诺。

首次需区分读者选型时间和真正安装/备份/核版本成本；持续要维护/核对三语与各外部版本，实际调用模型/云费用另算。失败不能因为本指南写CI通过就重试安装覆盖配置，应回固定上游材料核未完成动作和已写Profile/账户。退出阅读可关页/删书签，已经装的Runtime、SDK、Profile、凭据和云副本分别清理；本项目没有统一卸载/回滚或账单上限。具体费用、恢复耗时和净节时均未知。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:61-99](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L61-L99)

读取与真正安装/构建/模型配置的差异。

<details>
<summary>查看原文（39行）</summary>

````text
### 启动 Web UI

安装 [Node.js](https://nodejs.org/) 22.19.x 或 24+（推荐 24+）后执行：

```bash
npx @deepseek-ai/dsh web
```

默认访问 `http://127.0.0.1:3080`。进入 **Settings → Models** 配置模型服务后即可创建会话。详细步骤见[官方快速开始](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart)和[模型服务配置](https://deepseek-harness.github.io/deepseek-harness/guide/providers)。

### 从源码运行

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

### 使用 Python SDK

官方 Python SDK 支持通过内置运行时以编程方式调用 Harness，无需在系统中安装 Node.js。当前要求 Python 3.10+，支持情况和平台限制以[官方 Python SDK 指南](https://deepseek-harness.github.io/deepseek-harness/guide/python-sdk)为准。

```bash
python -m venv .venv
. .venv/bin/activate
python -m pip install deepseek-harness-sdk
```

### 安装插件

`web` 和 `headless` 是发行版内置的 Profile。外部插件以声明 `dsh.bundle` 的 Bundle 加入指定 Profile：

```bash
dsh plugin --profile web add <package-or-git-spec>
dsh --profile web --dump-config
```

````

</details>

**依据 2 · 源码核查**：[README.md:162-178](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L162-L178)

各客户端/运行时固定与早期条件来自编辑转述。

<details>
<summary>查看原文（17行）</summary>

```text
| [DeepSeek Harness Desktop (anywhere-labs)](https://github.com/anywhere-labs/dsh-desktop) | macOS (Apple Silicon) / Windows · Electron | `v2.0.2` 固定并原样运行 DSH `0.1.1-rc.2`，提供本地服务、系统托盘、恢复 / 回滚和内置插件市场；上游含破坏性更新，旧 Profile 与未适配插件可能失效，升级前应先新建安全 Profile 并保留插件清单 |
| [dsh-desktop](https://github.com/bruc3van/dsh-desktop) | macOS / Windows · Electron · 早期 | 原样复用官方 Web UI，并让长任务常驻托盘；关闭渲染层 Node 集成、限制导航、更新包校验 SHA-256，但 Agent 进程仍拥有普通用户级文件权限，发行包也尚未正式开发者签名 |
| [DeepSeek Harness Desktop (steven-kid)](https://github.com/steven-kid/deepseek-harness-desktop) | macOS / Windows / Linux · Electron · 早期 | 保持原版 Web UI 的最小桌面壳，使用随机回环端口、Electron 沙箱和 `contextIsolation`，发行包通过跨平台启动冒烟测试；macOS 尚未公证，Windows 尚未商业签名 |
| [DeepSeek Harness Desktop App](https://github.com/vibeinging/dsh-desktop) | macOS / Windows · Electron · 社区工作台 | `v0.1.9` 在官方 Web / Profile 运行链上提供项目、Git Worktree、浏览器、Canvas、Site、Office 产物、文件 / 文件夹附件和 14 个固定 Bundle；macOS Apple Silicon 包已签名公证，Windows x64 包未签名但已在 GitHub Windows Runner 验收安装、启动、断网 Profile、恢复、卸载与残留清理。中断的插件安装会在下次启动安全重试，用户主动卸载的插件不会被自动补回 |
| [TinyWhale](https://github.com/aimierbear/TinyWhale)      | macOS · Electron · 发行版 Fork       | 直接 Fork `deepseek-ai/deepseek-harness` 并增加独立桌面壳；连接已有 Web UI，或启动完整的 `dsh web` Runtime，不属于插件 |
| [Oh-DSH](https://github.com/hust-open-atom-club/oh-dsh)   | macOS / Linux / Windows · 社区发行版 | 将 DSH、Node.js 与本地能力打包为 Desktop、Web 和 TUI 三种形态，提供分层安装包与统一的 `ohdsh` 启动器                   |
| [DSH Desktop](https://github.com/dataelement/dsh-desktop) | macOS / Windows · Electron           | 管理本地 Harness、工作区、随机端口、Profile、插件和会话的跨平台桌面端                                                  |
| [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) | Windows · WebView2                   | 提供静默启动、独立窗口、便携包和 MSI 的轻量启动器                                                                      |

### 终端、移动与 Web 体验

| 项目                                                            | 类型              | 说明                                                                                              |
| --------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)               | TUI Bundle        | Claude Code 风格全屏终端、流式状态、上下文仪表与会话回退                                          |
| [dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) | TUI Bundle        | 基于天枢演进的完整终端交互层，状态来自 DSH 会话事件流                                             |
| [dsh-tui](https://github.com/openguardrails/dsh-tui)            | TUI Bundle · 早期 | 支持本地 DeepSeek 与离线运行；仍处于活跃开发期，移植前的测试套件尚未恢复运行                      |
| [dsh-mini-tui](https://github.com/boxeryao/dsh-mini-tui)        | TUI 插件 · 早期   | 直接连接 DSH Runtime 的轻量终端界面；MIT、`v0.2.0`，通过 npm 安装，并以 DSH `0.1.0-rc.6` 开发与测试 |
```

</details>

**依据 3 · 源码核查**：[README.md:271-277](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L271-L277)

外部依赖/消息/凭据和遥测风险线索。

```text
- [dsh-multica-runtime](https://github.com/forrestchang/dsh-multica-runtime)：连接 Multica 与 DSH 的早期运行时桥接；当前包标记为 `private`、`UNLICENSED`，安装与分发边界仍不完整。
- [dsh-imessage](https://github.com/photon-hq/dsh-imessage)：通过 Photon 托管号码把一对一 iMessage 文本转成 DSH Prompt，并回发最终回答，支持会话切换、停止、审批和问题回答；MIT、npm / Release `0.2.0`，固定 DSH `0.1.0-rc.6`，含测试与 CI。需要 Photon 账号、发送号码和仅保留在 Host 侧的本地凭据，消息会经过 Photon；断开仅清理本地状态，不删除 Photon 云端资源。项目仍新且依赖托管服务，标注为早期。
- [dsh-lark-bot](https://github.com/PlutoKeating/dsh-lark-bot)：把本地 DSH 接入飞书 / Lark，提供流式卡片、工作区、会话恢复与审批；采用 AGPL-3.0，应用凭据以权限 `600` 的明文配置保存在本机。
- [dsh-lark](https://github.com/sugarforever/dsh-lark)：使用飞书官方 Node SDK 和 WebSocket 长连接把 DSH 接入飞书 / Lark，无需公网回调；MIT、npm / GitHub `v0.1.1`。默认只申请三项消息权限，凭据从环境变量读取；实际运行会接收并以机器人身份发送外部消息。
- [dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)：腾讯团队维护的 QQ Bot 插件，支持扫码绑定、私聊与群聊会话隔离及重启恢复；MIT、`0.1.0`，绑定过程会把凭据保存到本地 Profile。
- [dsh-im](https://github.com/xmanrui/dsh-im)：在一个 DSH Bundle 中统一管理十个 IM 渠道与 AI Office，支持多机器人、流式回复、工作区 / 会话绑定、远程审批及超时任务结果补发。MIT、npm / Release `4.20.0`、Node.js 22.19+，Release Commit 的 CI 通过。新版兼容未修改的原版 DSH `0.1.5-alpha.1`，并继续覆盖此前四个原版 DSH Web profile；管理能力统一通过 Connection 的公开 `/api` Fetch 接口实现，不需修改或重编译 DSH。管理访问默认仅回环，`trusted-host` 仍受 DSH 浏览器认证及 Host / Origin 检查约束，更新和入站 TTL 管理始终仅允许回环。升级后需重启 Host 并刷新设置页；授权聊天用户仍可触发模型和工具，工作区 / 会话列表可能暴露本机路径和敏感元数据，应只向可信用户开放。
- [LoongSuite DSH Plugin](https://github.com/loongsuite/dsh-plugin)：把 Agent Turn、模型调用、工具执行和 Token 使用转成 OpenTelemetry GenAI Trace，可发送到 Jaeger、Tempo、SigNoz、Langfuse 等 OTLP 后端；Apache-2.0、Beta，已在 DSH `0.1.0-rc.6` 的 Headless 与 Web Profile 验证。内容采集默认关闭，启用后可能外发源码、凭据和个人数据。
```

**依据 4 · 源码核查**：[README.md:286-300](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L286-L300)

开发工具条目的写入/发布/迁移/快照边界。

<details>
<summary>查看原文（15行）</summary>

```text
- [DSH Plugin Upgrade Skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill)：为 DSH 插件升级、迁移、编写、测试、发布、审计和运行时调试提供 8 个 Skills，收录截至 `0.1.2-alpha.4` 的 45 张迁移卡与 12 组通用策略，并用 29 个 Harbor 任务和多组有 / 无 Skill 对照验证。MIT，可通过 `npx skills add oh-my-dsh/dsh-plugin-upgrade-skill` 安装，当前验证 CI 通过。统一入口会先建议只读健康检查并分阶段请求确认，但具体工作流可修改源码、安装依赖、运行测试 / Docker、打包乃至发布，必须在对应授权下使用。项目创建于 2026 年 8 月 30 日，尚无 Release，迁移卡也尚未覆盖当前 `0.1.2-rc.1`，故标注为早期。
- [DSH Harbor](https://github.com/ZSeven-W/dsh-harbor)：为已安装插件生成声明与源码检出的 13 类能力账本、`file:line` 证据、运行时工具 / Provider / 路由归属、同 Profile 冲突、跨 Profile 版本漂移与变更快照；MIT、npm `next` / Git Tag `0.1.0-rc.2`，已在 DSH `0.1.1-rc.2` 验证，Node 20 / 24、Ubuntu / Windows CI 与真实打包烟测通过。默认扫描离线只读；快照写入 `~/.config/dsh-harbor/`，只有显式上游检查会读取 npm Registry 配置并联网，错误会脱敏凭据。它不是沙箱、安装门禁或策略引擎，且仍为预发布、无 GitHub Release 或独立使用证据，因此标注为早期。
- [HOL Guard for DSH](https://github.com/hashgraph-online/hol-guard-plugin)：在 DSH 的异步 `tools/pre-execute` 与最终单调 Guard 两层对工具调用做 fail-closed 本地策略检查，把模糊决策交给一次性原生审批，并保留安全回执；Apache-2.0、Release `v0.3.0`、Node.js 20+，另需安装 `hol-guard >=2.0.1024`。仓库含 14 个测试文件，CI 还用固定的官方 DSH `0.1.0-rc.5` 源码跑真实 Headless 阻断测试；默认无需云账号，Cloud 同步为可选。安装会修改所选 Profile，策略可阻止工具执行并在本地 Approval Center 等待决定；保护范围仅覆盖经过 DSH `ToolRuntime` 的调用，不约束插件在该管线之外自行执行的代码。由于尚未证明兼容当前官方 `0.1.1-rc.2`，且最新运行时版本同步 Workflow 失败，标注为早期。
- [dsh-fail-logger](https://github.com/Areium/dsh-fail-logger)：脱敏、去重并分类记录工具失败，将机器维护的实录沉淀进 Skill；只记录问题，不自动修改行为。
- [dsh-session-surgeon](https://github.com/xiaoshenming/dsh-session-surgeon)：扫描、检查、导出并修复无法加载、序列断裂或残留临时文件的 DSH 会话；MIT、`v0.1.0`，支持 DSH `0.1.0-rc.6` 并从 GitHub 源码安装，标注为早期。修复默认 dry-run，`--apply` 会先写 `.bak.<utc>`；导出默认脱敏，`--no-redact` 会显式关闭保护。
- [deepseek-harness-action](https://github.com/Lixiaoyiao/deepseek-harness-action)：在 GitHub Actions 中使用 DSH 做 PR Review、CI 诊断、自动修复和 Issue → PR；写权限默认关闭，并将验证放在无凭据容器中运行。
- [Awesome DSH Plugins Radar](https://github.com/AdamPlatin123/awesome-dsh-plugins)：自动扫描并分别展示发现、静态、编译和运行级信号的兼容性雷达；MIT、数据高速变化且尚无 Release，“运行可用”不等于安全审计或内容质量，标注为早期。
- [dsh-market](https://github.com/dsh-market/dsh-market)：DSH 内置插件市场，可浏览、搜索、安装、更新和卸载登记在 `awesome-dsh-plugin` 的项目；MIT、npm / Release `v1.31.1`。在网络分区、中国大陆路由、官方源回退与 Anywhere Labs Desktop 可恢复安装边界基础上，新版会明确解释 npm-only Desktop 无法安装 GitHub-only 项目、目录入口已失效，以及恢复、回滚或操作后 Profile 仍缺少的启动条件；`1.29.3` 同时回滚依赖和 Bundle 行，Tasks 面板关闭设置页后仍继续显示。安装后仍比较整个 Profile 的 Bundle 状态并检查 CJS，只报告本次引入的风险；ESM Bundle 仍不做语法检查。构建脚本默认阻止、安装端点仅同源 POST、Agent 运行时禁止更新，但代理传输不证明字节等价，目录收录也不代表安全背书。
- [dsh-suite](https://whyihaveyou.github.io/dsh-suite/zh.html)：中英双语 DSH 生态索引，提供插件搜索、`create-dsh-plugin` 脚手架和基础兼容性元数据；目录每小时刷新，并每天把收录包安装到临时 Profile 做兼容性检查。安装成功不等于安全审计或质量保证。
- [deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp)：让其他 Agent 通过 MCP 发现、检查、安装和调用 DSH 插件；安装与运行默认关闭，只有显式启用 `--allow-install` / `--allow-runtime` 才会产生对应副作用。
- [dsh-payload-capture](https://github.com/Moeblack/dsh-payload-capture)：捕获并落盘上行模型 API Payload，便于调试请求组装。
- [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool)：通过 Monaco 编辑器创建和管理沙箱化 JavaScript 工具。
- [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode)：从 Web UI 直接在 VS Code 中打开当前工作区。
- [dsh-movein](https://github.com/sjh9714/dsh-movein)：一条命令把 Claude Code 的 Skills、MCP、hooks 和全局指令迁入 DSH；默认预演，`CLAUDE.md` 由 DSH 原生读取，会话历史不在范围内。MIT，已在 DSH `0.1.0-rc.6` 验证，项目仍新，标注为早期。
- [dshpack](https://github.com/hili986/dshpack)：把 Skills、MCP、Profile Patch 和权限默认值打包成可安装、可分享、可审计的 DSH Profile；MIT、npm `0.3.0`，18 个命令已可用，包括 `init`、`export`、`compose`、`lock`、`pack`、事务化安装 / 更新 / 卸载和回环管理 UI。构建脚本默认拒绝，来源固定到 Commit，导出前后三次扫描凭据，冲突要求显式解决，失败会带 Journal 回滚；`doctor` 可能触发 DSH 重写 `cordis.yml`，并由 dshpack 写审计日志。Pack 格式与 CLI 仍不是稳定 API，标注为早期。
```

</details>

#### 缺口

- 没有目标对象实际副作用/清理或费用测量，外部风险标注也未独立复查。
  **影响**：不能用关指南页面代表已装对象退出，也不能据文中兼容或风险摘要授权真实账户/敏感工作区。
  **进一步探讨**：选少量代表对象列环境、凭据、写入/网络/恢复/撤销清单，用无敏感样本测首次/持续/失败/退出并核实际账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样有限采用，未来方向与当前分类提醒有何不同？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合想先分清生态对象和官方路径的读者，作为学习/选型起点；有明确单个插件需求且已知原仓时直接读原仓更省跳转。当前类别、版本文字和风险提示可以使用，实际适配/安全与运行结果必须回固定上游复核，不接受文中“CI通过/低风险”即本轮通过。

未来方向不是再加分类、翻译或免责声明，而是把读者的目标Host/平台/任务与固定候选原件及安装/最小行为/退出原始记录绑定，输出匹配、不匹配或未验证的只读任务卡。它相对当前文字导航增加逐条件可回指的采用判断，不代替人授权安装，不声称已实现。先用客户端误当bundle、Host版本冲突、云凭据要求和退出残留四类已知样本，对照直接官方/原仓、当前指南与任务卡版；盲核类型/版本/权限误荐、伪称兼容、复核总时间和维护工时。若只是多包装、没有更准或维护成本超过节省，否定独立插件方向，保留指南即可。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:26-53](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L26-L53)

当前已有分类，不重复算未来增量。

<details>
<summary>查看原文（28行）</summary>

```text
## 目录

- [目录](#目录)
- [快速开始](#快速开始)
  - [启动 Web UI](#启动-web-ui)
  - [从源码运行](#从源码运行)
  - [使用 Python SDK](#使用-python-sdk)
  - [安装插件](#安装插件)
- [官方资源](#官方资源)
  - [安装集成](#安装集成)
  - [源码仓库](#源码仓库)
  - [官方文档](#官方文档)
  - [讨论社区](#讨论社区)
- [社区资源](#社区资源)
  - [分析教程](#分析教程)
  - [社区讨论](#社区讨论)
- [第三方客户端](#第三方客户端)
  - [桌面与发行版](#桌面与发行版)
  - [终端、移动与 Web 体验](#终端移动与-web-体验)
- [精选插件](#精选插件)
  - [工作流与 Agent](#工作流与-agent)
  - [上下文、会话与输入](#上下文会话与输入)
  - [浏览器、视觉与界面](#浏览器视觉与界面)
  - [沙箱与执行](#沙箱与执行)
  - [主题与皮肤](#主题与皮肤)
- [外部集成](#外部集成)
- [开发工具](#开发工具)
- [致谢](#致谢)
```

</details>

**依据 2 · 源码核查**：[README.md:59-59](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L59-L59)

作者已区分声明兼容基线与最新预览兼容。

```text
当前核验到的官方 GitHub 开发者预览版为 [`0.1.2-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1)；npm `latest` 与 `next` 均已指向 `0.1.2-rc.1`。该 RC 增加完整历史回合导航、精确 Token / 耗时统计、子代理模型选择、ACP 标准控件、定时任务和断线重连，并以可双向继续的 `send_message` 取代单向 `report`。公开 WebFetch 默认启用但有 SSRF 防护；SQLite Session Backend 已移除（旧数据保留，导出需旧版本）；DeepSeek 适配器默认附带已启用插件包名与版本（可关闭），Session 日志增量上传仍为可选且默认关闭。官方同时明示未经安全审计，Sandbox、Approval 与 Permission 不构成完全隔离保证。下方各项目标注的 DSH 版本仅代表作者声明的开发或测试基线，不应自动视为已兼容最新预览版。
```

**依据 3 · 源码核查**：[README.md:156-156](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L156-L156)

当前已明示非插件类别。

```text
> **分类说明：** 发行版或 Fork 会直接复用、修改或重新打包完整的 DSH Runtime，不能通过 `dsh plugin` 安装，因此不属于插件；独立客户端则通过 Web、RPC、ACP 或配套桥接插件连接 DSH。它们仍然是 Harness 生态的重要组成部分。
```

**依据 4 · 源码核查**：[README.md:286-300](https://github.com/libukai/awesome-deepseek-harness/blob/7eb1fadd4d68ca121e27ad09093a1fb258147747/README.md#L286-L300)

当前已有丰富版本/风险/未验证提醒。

<details>
<summary>查看原文（15行）</summary>

```text
- [DSH Plugin Upgrade Skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill)：为 DSH 插件升级、迁移、编写、测试、发布、审计和运行时调试提供 8 个 Skills，收录截至 `0.1.2-alpha.4` 的 45 张迁移卡与 12 组通用策略，并用 29 个 Harbor 任务和多组有 / 无 Skill 对照验证。MIT，可通过 `npx skills add oh-my-dsh/dsh-plugin-upgrade-skill` 安装，当前验证 CI 通过。统一入口会先建议只读健康检查并分阶段请求确认，但具体工作流可修改源码、安装依赖、运行测试 / Docker、打包乃至发布，必须在对应授权下使用。项目创建于 2026 年 8 月 30 日，尚无 Release，迁移卡也尚未覆盖当前 `0.1.2-rc.1`，故标注为早期。
- [DSH Harbor](https://github.com/ZSeven-W/dsh-harbor)：为已安装插件生成声明与源码检出的 13 类能力账本、`file:line` 证据、运行时工具 / Provider / 路由归属、同 Profile 冲突、跨 Profile 版本漂移与变更快照；MIT、npm `next` / Git Tag `0.1.0-rc.2`，已在 DSH `0.1.1-rc.2` 验证，Node 20 / 24、Ubuntu / Windows CI 与真实打包烟测通过。默认扫描离线只读；快照写入 `~/.config/dsh-harbor/`，只有显式上游检查会读取 npm Registry 配置并联网，错误会脱敏凭据。它不是沙箱、安装门禁或策略引擎，且仍为预发布、无 GitHub Release 或独立使用证据，因此标注为早期。
- [HOL Guard for DSH](https://github.com/hashgraph-online/hol-guard-plugin)：在 DSH 的异步 `tools/pre-execute` 与最终单调 Guard 两层对工具调用做 fail-closed 本地策略检查，把模糊决策交给一次性原生审批，并保留安全回执；Apache-2.0、Release `v0.3.0`、Node.js 20+，另需安装 `hol-guard >=2.0.1024`。仓库含 14 个测试文件，CI 还用固定的官方 DSH `0.1.0-rc.5` 源码跑真实 Headless 阻断测试；默认无需云账号，Cloud 同步为可选。安装会修改所选 Profile，策略可阻止工具执行并在本地 Approval Center 等待决定；保护范围仅覆盖经过 DSH `ToolRuntime` 的调用，不约束插件在该管线之外自行执行的代码。由于尚未证明兼容当前官方 `0.1.1-rc.2`，且最新运行时版本同步 Workflow 失败，标注为早期。
- [dsh-fail-logger](https://github.com/Areium/dsh-fail-logger)：脱敏、去重并分类记录工具失败，将机器维护的实录沉淀进 Skill；只记录问题，不自动修改行为。
- [dsh-session-surgeon](https://github.com/xiaoshenming/dsh-session-surgeon)：扫描、检查、导出并修复无法加载、序列断裂或残留临时文件的 DSH 会话；MIT、`v0.1.0`，支持 DSH `0.1.0-rc.6` 并从 GitHub 源码安装，标注为早期。修复默认 dry-run，`--apply` 会先写 `.bak.<utc>`；导出默认脱敏，`--no-redact` 会显式关闭保护。
- [deepseek-harness-action](https://github.com/Lixiaoyiao/deepseek-harness-action)：在 GitHub Actions 中使用 DSH 做 PR Review、CI 诊断、自动修复和 Issue → PR；写权限默认关闭，并将验证放在无凭据容器中运行。
- [Awesome DSH Plugins Radar](https://github.com/AdamPlatin123/awesome-dsh-plugins)：自动扫描并分别展示发现、静态、编译和运行级信号的兼容性雷达；MIT、数据高速变化且尚无 Release，“运行可用”不等于安全审计或内容质量，标注为早期。
- [dsh-market](https://github.com/dsh-market/dsh-market)：DSH 内置插件市场，可浏览、搜索、安装、更新和卸载登记在 `awesome-dsh-plugin` 的项目；MIT、npm / Release `v1.31.1`。在网络分区、中国大陆路由、官方源回退与 Anywhere Labs Desktop 可恢复安装边界基础上，新版会明确解释 npm-only Desktop 无法安装 GitHub-only 项目、目录入口已失效，以及恢复、回滚或操作后 Profile 仍缺少的启动条件；`1.29.3` 同时回滚依赖和 Bundle 行，Tasks 面板关闭设置页后仍继续显示。安装后仍比较整个 Profile 的 Bundle 状态并检查 CJS，只报告本次引入的风险；ESM Bundle 仍不做语法检查。构建脚本默认阻止、安装端点仅同源 POST、Agent 运行时禁止更新，但代理传输不证明字节等价，目录收录也不代表安全背书。
- [dsh-suite](https://whyihaveyou.github.io/dsh-suite/zh.html)：中英双语 DSH 生态索引，提供插件搜索、`create-dsh-plugin` 脚手架和基础兼容性元数据；目录每小时刷新，并每天把收录包安装到临时 Profile 做兼容性检查。安装成功不等于安全审计或质量保证。
- [deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp)：让其他 Agent 通过 MCP 发现、检查、安装和调用 DSH 插件；安装与运行默认关闭，只有显式启用 `--allow-install` / `--allow-runtime` 才会产生对应副作用。
- [dsh-payload-capture](https://github.com/Moeblack/dsh-payload-capture)：捕获并落盘上行模型 API Payload，便于调试请求组装。
- [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool)：通过 Monaco 编辑器创建和管理沙箱化 JavaScript 工具。
- [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode)：从 Web UI 直接在 VS Code 中打开当前工作区。
- [dsh-movein](https://github.com/sjh9714/dsh-movein)：一条命令把 Claude Code 的 Skills、MCP、hooks 和全局指令迁入 DSH；默认预演，`CLAUDE.md` 由 DSH 原生读取，会话历史不在范围内。MIT，已在 DSH `0.1.0-rc.6` 验证，项目仍新，标注为早期。
- [dshpack](https://github.com/hili986/dshpack)：把 Skills、MCP、Profile Patch 和权限默认值打包成可安装、可分享、可审计的 DSH Profile；MIT、npm `0.3.0`，18 个命令已可用，包括 `init`、`export`、`compose`、`lock`、`pack`、事务化安装 / 更新 / 卸载和回环管理 UI。构建脚本默认拒绝，来源固定到 Commit，导出前后三次扫描凭据，冲突要求显式解决，失败会带 Journal 回滚；`doctor` 可能触发 DSH 重写 `cordis.yml`，并由 dshpack 写审计日志。Pack 格式与 CLI 仍不是稳定 API，标注为早期。
```

</details>

#### 缺口

- 没有任务卡或真实读者对照，也未证选择错误/权限误读有足够频率。
  **影响**：不能把资料导航便利推成已验证付费选型助手，或把未来判断算本指南现有能力。
  **进一步探讨**：用固定原件人工标注四类案例，先只读盲测正确与耗时；需验证收益和维护成本后才决定实现。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
