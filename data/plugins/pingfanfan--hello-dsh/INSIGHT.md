# hello-dsh

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ef388c2](https://github.com/pingfanfan/hello-dsh/tree/ef388c22b65cb7429f536be79e3c76af97a81b4e)

<!-- BEGIN META -->
[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pingfanfan/hello-dsh)
<!-- END META -->

> **功能**：提供中文 DSH 入门教程、示例 Skill 和最小代码插件。

> **亮点**：[Q01](#research-q01) 把技能发现和工具注册变为可观察的练习。

> **主要限制**：[Q02](#research-q02) 验证环境是早期 DSH，批量复制存在版本和同名冲突。

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
  - [Q01 · 学习者能实际观察什么？](#detail-section-11)
  - [Q02 · 复制 Skill 的路径和版本有什么限制？](#detail-section-12)
  - [Q03 · 如何低成本判断教程适合当前环境？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：首次学习 DSH 扩展机制的中文用户。

直接阅读官方架构和 API 文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 教程 | 跟随检查点了解 DSH | 作者环境为早期 macOS 构建 |
| 示例 | 观察 Skill 和工具插件 | 在隔离环境逐个验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 与可用 DSH | 实践需要 | 观察插件和 Skill | 仅阅读无需安装 |
| 模型路由与网络 | 按练习需要 | 运行示例对话 | 可先只做静态和界面练习 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 阅读 | 从中文教程的终端和插件检查开始 | 核对版本 |
| 体验 | 在临时目录试固定 Skill | 确认发现和输出 |
| 编写 | 阅读工具样例并走生命周期 | 核对 Host 当前 API |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型及网络资源未知 | 准备环境并完成检查点 | 作者估计未独立验证 |
| 持续 | 资源未知 | 更新旧版本指引 | 按需复用例子 |
| 失败 | 恢复工时未知 | 移除测试例子并查宿主文档 | 保留原用户目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 新手入门 | 按检查点理解 DSH 扩展 | 实际通过率与用时 |

> **思考**：[Q02](#research-q02) 验证环境是早期 DSH，批量复制存在版本和同名冲突。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把技能发现和工具注册变为可观察的练习。

[Q02](#research-q02) 文档的批量复制不处理同名覆盖，核对具体版本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 验证环境是早期 DSH，批量复制存在版本和同名冲突。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用临时环境和单个固定示例。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认是教程资源及示例集合，未运行。

- 已检查：作者 README、包清单、源码路径 README.md、docs/hello-dsh.md、examples/skills/hello-dsh/SKILL.md、examples/hello-plugin/src/hello.ts、INSTALL-FOR-AGENTS.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定教程、Skill 和代码样例；未下载、复制或运行目标。
- 下一步：空配置对照教程和现行 Host，记录发现路径和通过率。

**分析版本**

- **仓库**：[pingfanfan/hello-dsh](https://github.com/pingfanfan/hello-dsh)
- **版本号**：未声明（[固定提交 ef388c2](https://github.com/pingfanfan/hello-dsh/tree/ef388c22b65cb7429f536be79e3c76af97a81b4e)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照官方文档比较首个扩展的完成时间。

空配置对照教程和现行 Host，记录发现路径和通过率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1635 | — | — | 12709 |
| .md | example | 23 | 2489 | — | — | 23696 |
| .ts | example | 1 | 29 | 27 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/pingfanfan/hello-dsh/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/pingfanfan/hello-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：首次使用 DSH 的中文用户能否观察 Skill 加载和代码插件生命周期？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 学习者能实际观察什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

仓库主入口是中文入门教程，配套独立 Skill 示例和一个最小代码插件。教程由命令行走到插件列表与生命周期；hello-dsh Skill 用固定句子演示从磁盘读内容，代码样例通过 apply 向 tools 服务注册工具。相对只读官方架构介绍，学习者能按检查点分辨模型读 Skill 和 Host 执行插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-36](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/README.md#L20-L36)

主入口和语言。

<details>
<summary>查看原文（17行）</summary>

```text
DSH introduces itself as *"Everything is a Plugin."*

That is not marketing. Open Settings → Plugins → Plugin list and look at the count:

![Plugin list](assets/05-plugin-list-133.png)

**133 of them.** `llm` (the model adapter), `session` (conversation history), `webserver` (the page you are looking at), `ui-sidebar` (the sidebar on the left), and `agent-loop` — **the agent loop itself is a plugin**.

This repo walks you from "open a terminal" to building your own plugin and watching its lifecycle.

---

## Start here

**→ [Full tutorial: Hello DSH](docs/hello-dsh.md)**

> 🌏 **The tutorial is currently written in Chinese.** An English version is in progress.
```

</details>

**依据 2 · 源码核查**：[docs/hello-dsh.md:7-28](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/docs/hello-dsh.md#L7-L28)

版本和分步检查点。

<details>
<summary>查看原文（22行）</summary>

```text
**这份教程假设你什么都没有。** 没装过 Node，没用过命令行，不知道什么是环境变量。每一节末尾都有一个检查点，**看到指定的结果才能往下走**。

所有截图和输出都是真实的（DSH `0.1.0-rc.6`，macOS，2026-08-13）。

---

## 目录

| 节 | 内容 | 预计 |
|---|---|---|
| [第 1 步](#第-1-步打开终端) | 打开终端 | 2 分钟 |
| [第 2 步](#第-2-步装-nodejs) | 装 Node.js | 5 分钟 |
| [第 3 步](#第-3-步启动-dsh) | 启动 DSH | 5 分钟 |
| [第 4 步](#第-4-步配置密钥) | 配置 API 密钥 | 3 分钟 |
| [第 5 步](#第-5-步选一个工作区) | 选一个工作区 | 2 分钟 |
| [第 6 步](#第-6-步亲眼看到-133-个插件) | **亲眼看到 133 个插件** | 3 分钟 |
| [第 7 步](#第-7-步做第一个插件) | **做第一个插件** | 5 分钟 |
| [第 8 步](#第-8-步看它的生命周期) | **看它的生命周期** | 5 分钟 |
| [第 9 步](#第-9-步接下来可以做什么) | 接下来可以做什么 | 3 分钟 |
| [第 10 步](#第-10-步原理选读) | 原理（选读） | 10 分钟 |

前 8 步大约 30 分钟，跑完就能用。第 10 步（原理）是选读的。
```

</details>

**依据 3 · 源码核查**：[examples/skills/hello-dsh/SKILL.md:7-12](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/examples/skills/hello-dsh/SKILL.md#L7-L12)

Skill 示范的可观测输出。

```text

先原样输出这一行：

**HELLO DSH — 这句话来自 ~/.dsh/skills/hello-dsh/SKILL.md**

然后用一句话说明：这句话不在你的训练数据里，是刚才通过 `skill` 工具从本地磁盘的一个 Markdown 文件读到的。
```

**依据 4 · 源码核查**：[examples/hello-plugin/src/hello.ts:4-12](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/examples/hello-plugin/src/hello.ts#L4-L12)

独立代码插件接线。

```text
export const name = 'hello-plugin'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'pingfan_hello',
    description: '返回一句固定问候，用于验证第三方插件是否加载成功。',
    parameters: {
      who: { type: 'string', description: '要问候的对象' },
```

#### 缺口

- 未观察真实学习者
  **影响**：无法确认教程节时或通过率
  **进一步探讨**：让新用户从空 profile 复述两种入口并完成检查点

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 复制 Skill 的路径和版本有什么限制？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

作者提供 DSH 用户目录和跨 Agent 共享目录；安装手册示例从 main 下载后批量复制，不能提供固定制品或同名文件冲突防护。示例环境声明为 macOS DSH 0.1.0-rc.6。Node、网络和可用模型根据选定步骤有不同需求，截图和发现检查点在其他版本须重新验证。

#### 证据与依据

**依据 1 · 源码核查**：[INSTALL-FOR-AGENTS.md:19-41](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/INSTALL-FOR-AGENTS.md#L19-L41)

Node 与 npx 的前置条件。

<details>
<summary>查看原文（23行）</summary>

````text
### 1. Node.js（硬前置，缺了做不下去）

```sh
node --version
```

没有 Node 就**停下来告诉用户去装**，不要自作主张用包管理器装（可能污染他的环境）：

> DSH 需要 Node.js。请先从 https://nodejs.org 安装（建议 LTS 版本），装完告诉我，我继续。

macOS 用户如果有 Homebrew，可以建议 `brew install node`，但**要先问过再执行**。

### 2. DSH 本身（不用预装）

```sh
npx @deepseek-ai/dsh --version
```

**这一步会自动下载 DSH，首次会比较慢（几十秒到几分钟），不是卡死。**

如果输出了版本号（例如 `0.1.0-rc.6`），说明没问题。

> 注意：DSH **不需要提前安装**。`npx` 会按需拉取，`~/.dsh/` 目录也是首次运行时自动生成的。所以技能可以在 DSH 第一次运行之前就放好——实测确认过，把技能放进一个从没跑过 DSH 的目录，第一次运行就能发现它们。
````

</details>

**依据 2 · 源码核查**：[INSTALL-FOR-AGENTS.md:72-100](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/INSTALL-FOR-AGENTS.md#L72-L100)

复制源和作用域。

<details>
<summary>查看原文（29行）</summary>

````text

| 位置 | 用于 |
|---|---|
| `~/.dsh/skills/` | 只给 DSH 用（**默认选这个**） |
| `~/.agents/skills/` | 跨 agent 共享，Claude Code 等也能读到 |

### 取得文件

优先用 git（保留后续更新能力）：

```sh
git clone --depth 1 https://github.com/pingfanfan/hello-dsh.git /tmp/hello-dsh
```

没有 git 时用打包下载：

```sh
curl -fsSL https://github.com/pingfanfan/hello-dsh/archive/refs/heads/main.tar.gz | tar xz -C /tmp
# 解出 /tmp/hello-dsh-main
```

### 拷贝

```sh
mkdir -p ~/.dsh/skills
cp -R /tmp/hello-dsh/examples/skills/* ~/.dsh/skills/
```

`~/.dsh/skills/` 不存在时直接创建即可，**不用先跑 DSH**。
````

</details>

**依据 3 · 源码核查**：[docs/hello-dsh.md:5-9](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/docs/hello-dsh.md#L5-L9)

作者验证环境。

```text
这句话不是修辞。跑完这份教程，你会亲眼看到它有 **133 个插件**，其中包括模型适配器、工具注册表、会话记录、Web 服务器，甚至 **agent 的主循环本身**。然后你会自己做出一个。

**这份教程假设你什么都没有。** 没装过 Node，没用过命令行，不知道什么是环境变量。每一节末尾都有一个检查点，**看到指定的结果才能往下走**。

所有截图和输出都是真实的（DSH `0.1.0-rc.6`，macOS，2026-08-13）。
```

#### 缺口

- 未测试各平台和版本的发现顺序
  **影响**：可能出现已复制但 Host 没发现的情况
  **进一步探讨**：用隔离目录单独复制一个固定 Skill，再测试发现与同名冲突

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何低成本判断教程适合当前环境？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先读中文教程并走到原生插件列表，在临时配置中只放入一个固定版本示例 Skill，核对名字、触发和输出后再做代码样例。对照纯官方文档的时间和卡住次数。若版本差异使路径失效，就以当前宿主文档核对流程，保留这套教程用于理解概念。

#### 证据与依据

**依据 1 · 源码核查**：[docs/hello-dsh.md:13-28](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/docs/hello-dsh.md#L13-L28)

逐步验收顺序。

<details>
<summary>查看原文（16行）</summary>

```text
## 目录

| 节 | 内容 | 预计 |
|---|---|---|
| [第 1 步](#第-1-步打开终端) | 打开终端 | 2 分钟 |
| [第 2 步](#第-2-步装-nodejs) | 装 Node.js | 5 分钟 |
| [第 3 步](#第-3-步启动-dsh) | 启动 DSH | 5 分钟 |
| [第 4 步](#第-4-步配置密钥) | 配置 API 密钥 | 3 分钟 |
| [第 5 步](#第-5-步选一个工作区) | 选一个工作区 | 2 分钟 |
| [第 6 步](#第-6-步亲眼看到-133-个插件) | **亲眼看到 133 个插件** | 3 分钟 |
| [第 7 步](#第-7-步做第一个插件) | **做第一个插件** | 5 分钟 |
| [第 8 步](#第-8-步看它的生命周期) | **看它的生命周期** | 5 分钟 |
| [第 9 步](#第-9-步接下来可以做什么) | 接下来可以做什么 | 3 分钟 |
| [第 10 步](#第-10-步原理选读) | 原理（选读） | 10 分钟 |

前 8 步大约 30 分钟，跑完就能用。第 10 步（原理）是选读的。
```

</details>

**依据 2 · 源码核查**：[INSTALL-FOR-AGENTS.md:100-115](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/INSTALL-FOR-AGENTS.md#L100-L115)

检查目录与 headless 示例。

<details>
<summary>查看原文（16行）</summary>

````text
`~/.dsh/skills/` 不存在时直接创建即可，**不用先跑 DSH**。

---

## 第三步：验证

```sh
ls ~/.dsh/skills/
```

应该看到 20 多个目录，每个里面有一个 `SKILL.md`。

如果用户有 API Key，直接做端到端验证：

```sh
npx @deepseek-ai/dsh --profile headless "hello dsh"
````

</details>

**依据 3 · 源码核查**：[examples/skills/hello-dsh/SKILL.md:24-44](https://github.com/pingfanfan/hello-dsh/blob/ef388c22b65cb7429f536be79e3c76af97a81b4e/examples/skills/hello-dsh/SKILL.md#L24-L44)

Skill 和插件的概念边界。

<details>
<summary>查看原文（21行）</summary>

```text
不只是"支持插件扩展"，而是**产品自身就是插件拼出来的**：模型适配器是插件，工具注册表是插件，会话日志是插件，连 agent 主循环本身都是插件。

刚才那句暗号就是证据。让它成为可能的是四个插件协作：

| 插件 | 干什么 |
|---|---|
| `dsh-skill` | 定义「技能」这个能力 |
| `dsh-skill-filesystem` | 扫描目录、读取 Markdown 文件 |
| `dsh-tool-skill` | 把技能目录给模型看，提供加载工具 |
| `dsh-client-ui-skill` | Web UI 里的技能界面 |

**你要给 DSH 加东西，也是加插件。** 两条路：

| 路 | 写什么 | 成本 | 适合 |
|---|---|---|---|
| **技能插件** | 一个 Markdown 文件 | 5 分钟 | 改变判断标准、输出格式、工作流程 |
| **代码插件** | TypeScript 模块 | 半小时起 | 注册新工具、接外部服务、挂生命周期钩子 |

**判断依据：用自然语言能说清楚的，走 Markdown 那条路。**

（严格说，技能是被 `skill-filesystem` 插件读取的数据文件，本身不是 Cordis 意义上的插件实体。这个区别在写代码插件时才需要在意，用的时候不影响。）
```

</details>

#### 缺口

- 作者的约 30 分钟未实测
  **影响**：入门时间和环境摩擦未知
  **进一步探讨**：记录首次检查点成功和失败位置

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
