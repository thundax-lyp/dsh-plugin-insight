# novel-writer

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[bd00821](https://github.com/sailoumili/novel-writer/tree/bd0082106998a4737d3428bed334cacde46accd9)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sailoumili/novel-writer) [![npm 30d 1,512](https://img.shields.io/static/v1?label=npm+30d&message=1%2C512&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/novel-writer) [![最新发布 2026-09-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/novel-writer)
<!-- END META -->

> **功能**：为 DSH 安装小说创作预设，提供专用写作 Agent 能力。

> **亮点**：随包预设把角色分工与宿主的子代理工具接好，用户可使用同一组角色和本地交接资料反复起草。加载入口补齐两个缺失文件，保存已有用户修改。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：独占复制保护同名文件，双方文件可以来自不同版本，失败可只完成一份，停用挂载不会清理目标路径。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 插件提供什么小说写作任务能力，相对直接提示词增加什么？](#detail-section-11)
  - [Q02 · 预设如何装入宿主，覆盖和重复安装如何处理？](#detail-section-12)
  - [Q03 · 目录写入和预设内容带来哪些工程与安全限制？](#detail-section-13)
  - [Q04 · 怎样在最小成本下试用，并判断是否值得保留？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用 DSH 写长篇的作者需要反复维护人物和世界规则。这里把世界、人物、剧情、文笔和复核分给不同子代理，再由主代理结合本地文件汇总成草稿。

对照是单会话维护人物表和大纲、再手工指定起草与复核。独立角色能减少重复搭建提示，协调和检阅仍由人负责。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 部署小说预设 | 补齐两份缺失的宿主预设文件 | 按单文件独占，已有配置不升级 |
| 主代理委派 | 按角色划分规划、写作与复核 | 需要宿主注册子代理及可用模型 |
| 文件交接 | 在角色之间传递世界设定与原稿 | 落到用户项目目录，需保留和检查 |

**流程与依赖**

| 依赖 | 用途 | 缺失或错误时 |
| --- | --- | --- |
| 支持 Cordis bundle 的 DSH | 加载安装入口与 Agent 预设 | 缺少宿主发现机制时，文件存在也未必可选 |
| 可写的独立 DSH_HOME | 保存 agent.cordis.yml 和 preset.yml | 目标冲突跳过相应文件，其他错误停止后续复制 |
| 宿主子代理工具和模型 | 分派角色并生成或复核章节 | 没有调用能力时需回到单会话写作 |
| 非敏感项目工作区 | 存放人物与世界设定、草稿 | 目录与退场需人工核对 |

| 阶段 | 动作 | 成功或退出条件 |
| --- | --- | --- |
| 准备 | 用隔离 DSH_HOME，保留原目录备份 | 记录安装前应有的文件及摘要 |
| 加载 | 启用 bundle，确认两份目标配置和实际可见性 | 只落一份或有意外旧文件就停止 |
| 起草 | 向主代理交付同一段大纲与人物表 | 复核草稿和角色交接文件 |
| 退出 | 停用挂载，再核对保留与移除的预设 | 原稿继续保留，已有用户配置按备份恢复 |

**效果与成本**

| 阶段 | 现金与资源 | 人员工作 |
| --- | --- | --- |
| 首次 | 可写目录与兼容宿主，资源未计量 | 准备独立 DSH_HOME 并核对两份配置 |
| 持续 | 主代理与参与角色的模型调用，金额未知 | 维护人物表，核对模型稿与交接 |
| 恢复 | 可能需要重新启动或撤销本轮配置 | 核对部分落盘，清理时保护已有文件 |

| 结果 | 固定源码支持 | 仍需验证 |
| --- | --- | --- |
| 加载预设 | 启动时逐份独占复制到目标预设目录 | 宿主能否看到且加载成对配置 |
| 分角色起草 | 预设使用宿主子代理并约定本地文件交接 | 同一故事的设定冲突和人工编辑时间 |

> **思考**：独占复制保护同名文件，双方文件可以来自不同版本，失败可只完成一份，停用挂载不会清理目标路径。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：随包预设把角色分工与宿主的子代理工具接好，用户可使用同一组角色和本地交接资料反复起草。加载入口补齐两个缺失文件，保存已有用户修改。[Q01](#research-q01) [Q02](#research-q02)

安装器为两个文件分别使用独占复制，以保留用户编辑。缺少把两份文件共同校验及提交的控制，失败后须检查残留。预设调用的是宿主委派工具，退出不删除工作区草稿。

<a id="detail-section-5"></a>

### 1.4 主要限制

独占复制保护同名文件，双方文件可以来自不同版本，失败可只完成一份，停用挂载不会清理目标路径。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立 DSH_HOME 做一次短场景试写，先核对两份预设的来源与成对性，再与手工提示比较设定一致性。发现部分落盘、误用旧预设或意外写入路径时停用并核对备份。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交支持入口和核心机制的源码判断；目标宿主、外部服务、用户效果与全周期成本未在本轮运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、package.json、agent.cordis.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 sailoumili/novel-writer (root) 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：用同一份人物表和大纲比较手工提示与预设草稿，记录设定冲突、调用数量、编辑时间和脱离预设后的文件状态。

**分析版本**

- **仓库**：[sailoumili/novel-writer](https://github.com/sailoumili/novel-writer)
- **版本号**：1.0.2（[固定提交 bd00821](https://github.com/sailoumili/novel-writer/tree/bd0082106998a4737d3428bed334cacde46accd9)）
- **版本日期**：2026-09-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以对每个章节的角色交接附上人物表版本和结论出处，比较同一段落的设定冲突与复核时间。已有预设通过工作区文件衔接，此方案仍需对照验证。[Q04](#research-q04)

用同一份人物表和大纲比较手工提示与预设草稿，记录设定冲突、调用数量、编辑时间和脱离预设后的文件状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 59 | 36 | 16 | — |
| .md | source | 2 | 214 | — | — | 2557 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/sailoumili/novel-writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sailoumili/novel-writer/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sailoumili/novel-writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该极小插件是否通过可复现的预设安装改变 DSH 小说写作流程，其价值和安全边界是否足以支持用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件提供什么小说写作任务能力，相对直接提示词增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要反复核对人物和设定的 DSH 写作者可使用随包的小说工作室预设。它让主代理按文笔、复核、世界、剧情和人物方向拆出子任务，并使用本地文件交接。agent.cordis.yml 设定了代理委派和 workflow 工具，依赖宿主自己的子代理注册。相比一段普通提示词，新增的是持久角色配置与委派入口；故事连续性和创意质量仍由模型、工作区内容和人工复核决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/README.md#L1-L35)

作者介绍小说写作定位和使用入口。

<details>
<summary>查看原文（35行）</summary>

````text
# 多核协同写作模式

> [English](./README.en.md) | 简体中文

一个装在 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 里的**多智能体小说创作模式**：一个「统筹队长」统领全局，5 个专职子代理各司其职——架构世界、策划剧情、管理人物、执笔写文、质检复核。新建会话时选它，就能用这支各就各位的「创作工作室」把一部小说从构思一路写到成稿。

## 这是什么

它不是只会聊天的 AI，而是一支**分工明确的 6 人小说工作室**——由**一个「队长」统领全局，5 个「专职子代理」各干各的活**。和「一个 AI 轮流演 6 个角色」不同，这里每个岗位是独立的：写正文的只写正文、挑错的只挑错、管世界的只管世界，每个子代理脑子里只装它那一份活，互不干扰，所以更专注、不串味。

| 角色 | 优势 | 干什么 |
| --- | --- | --- |
| 统筹队长 | 专职总指挥，不写稿，能客观拍板 | 派单；控节奏、终裁分歧、签发定稿；同一章被连续 3 次打回时，召集全体重新校准《叙事宪法》 |
| 世界子代理 | 世界背景与专有名词的唯一权威 | 产出《世界规则白皮书》和《名词索引附录》；每条设定都展开成「是什么 + 为什么 + 对故事的影响」；写明「主角战力 vs 天花板」的百分比差值，防战力崩坏 |
| 剧情子代理 | 主线与因果的总策划 | 用「节点法」出主线节点、转折点、伏笔台账；每个节点都写清「因为…所以…」的因果链，不拍脑袋硬写；主动埋伏笔 + 设计矛盾冲突 |
| 人物子代理 | 人物灵魂与说话风格的档案库 | 建「灵魂四维」JSON（外在底色/隐性欲望/心理阈值/社交关系网）和「语言基因卡」（句子长短/口头禅/禁忌词/小动作）；拒绝贴标签，注重成长弧光，行为合情合理 |
| 文笔子代理 | 唯一执笔，专注不被干扰 | 先遵从其他代理的设定（宪法/伏笔/世界/人物），想突破须「破格申请」；文字易读不散文化、描写为突出人物、不直写情绪（用动作/环境暗示）；每章约 2000–4000 字 |
| 复核子代理 | 只挑错、不改写，立场客观 | 正文逐条对照所有设定；三色灯判决：🔴致命→打回重写并写清原因，🟡警告→改后过审，🟢通过；额外验「水到渠成」、出【节奏建议】和【章末钩子】 |

## 安装方法

这是一个 **DSH 预设插件**：装好后，插件会把「多核协同写作模式」这个预设**自动注册进 DSH**，新建会话时直接选它就行。

### 方法一：插件安装（推荐）

插件已发布到 npm（包名 `novel-writer`），在 DSH 命令行里执行下面这一行即可（Windows / macOS / Linux 通用）：

```
dsh plugin --profile web add novel-writer
```

装完后，**重启或刷新 DSH web**，新建会话时选「多核协同写作模式」即可。

### 方法二：手动安装（备选）

````

</details>

**依据 2 · 源码核查**：[lib/index.js:1-59](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L1-L59)

插件入口导出 apply 并安装随包预设到 DSH_HOME。

<details>
<summary>查看原文（59行）</summary>

```text
/**
 * novel-writer — DeepSeek Harness (DSH) 预设插件。
 *
 * 作用：每次 DSH 启动（加载本插件）时，把包内自带的 agent.cordis.yml 和
 * preset.yml 复制到 DSH 的预设目录（~/.dsh/.agent-presets/novel-writer/，
 * 支持 $DSH_HOME 覆盖），从而注册「多核协同写作模式」预设。
 *
 * 注意：只在目标文件【不存在】时才落地——绝不覆盖你本机改过的预设。
 */
import { mkdir, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Cordis 插件名（须与 cordis.patch.yml 里的 id 一致）。 */
const name = "novel-writer";

/** 本文件所在目录（<包>/lib）。 */
const here = dirname(fileURLToPath(import.meta.url));

/** 预设文件在包根目录（lib/ 的上一级）。 */
const SOURCE_DIR = join(here, "..");

/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}

export { apply, name };
```

</details>

**依据 3 · 源码核查**：[package.json:1-30](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/package.json#L1-L30)

manifest 声明 DSH 插件包及入口。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "novel-writer",
  "version": "1.0.2",
  "description": "Multi-Core Collaborative Novel Writing — a DeepSeek Harness (DSH) preset plugin that installs a multi-agent novel-writing mode: one conductor plus five specialized subagents (多核协同写作模式).",
  "author": "sailoumili",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "harness",
    "cordis",
    "plugin",
    "agent-preset",
    "preset",
    "multi-agent",
    "subagent",
    "novel",
    "fiction",
    "creative-writing",
    "story-writing",
    "writing",
    "novel-writing"
  ],
  "homepage": "https://github.com/sailoumili/novel-writer",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sailoumili/novel-writer.git"
  },
  "bugs": {
```

</details>

**依据 4 · 源码核查**：[agent.cordis.yml:1-34](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/agent.cordis.yml#L1-L34)

预设描述控制代理和角色间说明。

<details>
<summary>查看原文（34行）</summary>

```text
# The `novel-writer` agent preset: the six-role novel studio in TRUE multi-agent
# form — a main "conductor" agent dispatches focused subagents, one per specialty.
#
# AGENT-PLANE composition. The host composition (`base.cordis.yml` +
# `web.cordis.yml`) keeps what a preset must not own: the registries themselves,
# the sandbox and approval stack, persistence, and the model route. A service
# row here MUST sit inside a group carrying an `isolate` realm; this file adds
# no service of its own, so its group realms are exactly the shipped ones.
#
# This file is a copy of the shipped `standard` preset with ONE change: the
# persona is the "conductor" (队长), who does not write prose itself but
# dispatches focused subagents (文笔/复核/世界/剧情/人物) via the delegation
# tools below. Data moves between subagents through local files (人物档案 /
# 伏笔台账 / 世界白皮书 / 章节目录), never through conversation memory.
#
# Keeping the full `standard` row set guarantees this preset mounts exactly like
# a shipped one; the subagent rows live in the `delegation` group.

# ── identity ────────────────────────────────────────────────────────────────

# The preset's own persona, shadowing the deployment default for this agent.
# `{{cwd}}` resolves from the agent's own workspace.
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |
      你是「多核协同写作模式」的小说创作团队——由一个统筹队长统领全局、5 个专职子代理（世界、剧情、人物、文笔、复核）各司其职组成的创作工作室。你的工作目录是 {{cwd}}。你不亲自写稿，只负责派单、把控全局节奏、拍板定稿，通过调动 5 个专职子代理，把一部小说从构思一路写到成稿。

      ## 你的核心工作方式：派单

      你有一个「子代理」（subagent）工具，能派一个「全新上下文」的专职子代理去独立完成一件事。子代理就像新来的临时工：它没有你们的对话记忆，所以派单时必须在指令里一次性给全三样东西：

      1. 角色规则：它是谁、只准干什么（用下面「五个专职岗位」里的模板）。
      2. 本次任务：具体到「第几章 / 哪个环节」，要做什么、产出什么。
```

</details>

**依据 5 · 源码核查**：[agent.cordis.yml:197-227](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/agent.cordis.yml#L197-L227)

依赖宿主委派工具，包含新上下文和 fork 两类调用。

<details>
<summary>查看原文（31行）</summary>

```text
# ── delegation and workflows ────────────────────────────────────────────────

# The `subagents` registry and its spawn/fork backends live in the HOST
# composition; this preset contributes the delegation TOOLS, which resolve that
# host registry. The conductor uses `subagent` (spawn) to dispatch one focused
# subagent per specialty, and `subagent_fork` to hand a subagent this
# conversation's context when a revision needs it.
- id: delegation
  name: cordis:group
  group: true
  isolate:
    workflowEngine: true
  config:
    - id: tool-subagent-control
      name: '@deepseek-ai/dsh-tool-subagent-control'

    - id: tool-subagent-list-agents
      name: '@deepseek-ai/dsh-tool-subagent-control/list-agents'

    - id: tool-subagent
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: spawn
        toolName: subagent
        backgroundMode: continuable

    - id: tool-subagent-fork
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: fork
        toolName: subagent_fork
```

</details>

#### 缺口

- 缺少创作任务样例、预设内容质量及用户对照。
  **影响**：无法判断写作质量/节省提示准备时间
  **进一步探讨**：用固定题材和验收标准对照手动提示与预设。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设如何装入宿主，覆盖和重复安装如何处理？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Cordis 加载时通过 ctx.effect 调用 installPreset。目标是 process.env.DSH_HOME 或家目录 .dsh 下的 .agent-presets/novel-writer，随后递归创建。安装器依次用 COPYFILE_EXCL 复制 agent.cordis.yml 和 preset.yml，EEXIST 忽略，其他错误终止后续复制并打印错误。两个文件分别提交，如果第一个成功而第二个失败会留下部分安装；如果某一文件已存在则只尝试补齐另一份。重复启动不覆盖既有目标，但升级也因此不刷新旧配置。没有版本检查、批量事务或卸载回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-59](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L1-L59)

入口在加载阶段把 preset 安装到 DSH_HOME。

<details>
<summary>查看原文（59行）</summary>

```text
/**
 * novel-writer — DeepSeek Harness (DSH) 预设插件。
 *
 * 作用：每次 DSH 启动（加载本插件）时，把包内自带的 agent.cordis.yml 和
 * preset.yml 复制到 DSH 的预设目录（~/.dsh/.agent-presets/novel-writer/，
 * 支持 $DSH_HOME 覆盖），从而注册「多核协同写作模式」预设。
 *
 * 注意：只在目标文件【不存在】时才落地——绝不覆盖你本机改过的预设。
 */
import { mkdir, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Cordis 插件名（须与 cordis.patch.yml 里的 id 一致）。 */
const name = "novel-writer";

/** 本文件所在目录（<包>/lib）。 */
const here = dirname(fileURLToPath(import.meta.url));

/** 预设文件在包根目录（lib/ 的上一级）。 */
const SOURCE_DIR = join(here, "..");

/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}

export { apply, name };
```

</details>

**依据 2 · 源码核查**：[package.json:1-30](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/package.json#L1-L30)

指定宿主入口与运行范围。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "novel-writer",
  "version": "1.0.2",
  "description": "Multi-Core Collaborative Novel Writing — a DeepSeek Harness (DSH) preset plugin that installs a multi-agent novel-writing mode: one conductor plus five specialized subagents (多核协同写作模式).",
  "author": "sailoumili",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "harness",
    "cordis",
    "plugin",
    "agent-preset",
    "preset",
    "multi-agent",
    "subagent",
    "novel",
    "fiction",
    "creative-writing",
    "story-writing",
    "writing",
    "novel-writing"
  ],
  "homepage": "https://github.com/sailoumili/novel-writer",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sailoumili/novel-writer.git"
  },
  "bugs": {
```

</details>

**依据 3 · 作者声明**：[README.md:30-75](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/README.md#L30-L75)

作者说明如何启用和使用写作预设。

<details>
<summary>查看原文（46行）</summary>

````text
```

装完后，**重启或刷新 DSH web**，新建会话时选「多核协同写作模式」即可。

### 方法二：手动安装（备选）

不想用命令行的话，也可以手动装：

#### 一键脚本

Windows（PowerShell）：复制下面这一整行，粘贴回车，自动下载安装。

```powershell
irm https://raw.githubusercontent.com/sailoumili/novel-writer/main/install.ps1 | iex
```

macOS / Linux（终端）：

```bash
curl -fsSL https://raw.githubusercontent.com/sailoumili/novel-writer/main/install.sh | bash
```

装完后，**刷新或重启 DSH 页面**，新建会话时选「多核协同写作模式」即可。

#### 手动下载

1. 点本仓库绿色 `Code` 按钮 → `Download ZIP`，下载并解压。
2. 把解压出来的文件夹**改名为 `novel-writer`**（GitHub 下载的文件夹名通常带 `-main` 后缀，要去掉）。
3. 把这个 `novel-writer` 文件夹放进 DSH 的预设目录：
   - Windows：`C:\Users\你的用户名\.dsh\.agent-presets\`
   - （`~/.dsh/.agent-presets/`，`~` 表示你的用户主目录）
4. 刷新（或重启）DSH 页面。
5. 新建会话时选 **多核协同写作模式**。

## 怎么用

1. 选好预设后，直接发一句话给题材和核心梗概，例如：

   > 题材：东方玄幻 + 克苏鲁融合。核心梗概：一个能看到别人「死亡倒计时」的猎户，如何在不被污染的前提下，拯救即将被旧日支配者吞噬的村庄。

2. 队长会走三步流程，**每一步都停下来等你确认**，不会一口气乱写：
   - 派「世界」和「剧情」开联席会，出《叙事宪法》草案和《世界白皮书》大纲 → 等你批准；
   - 批准后派「人物」生成主要角色档案 → 存进本地文件；
   - 最后申请「写第一章」的许可 → 你同意才动笔。

## 它会读写文件，请注意
````

</details>

**依据 4 · 源码核查**：[lib/index.js:22-57](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L22-L57)

目标定位、独占复制、错误捕获与 effect 结束。

<details>
<summary>查看原文（36行）</summary>

```text
/** 预设文件在包根目录（lib/ 的上一级）。 */
const SOURCE_DIR = join(here, "..");

/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}
```

</details>

#### 缺口

- 未实际启动宿主确认写入路径、覆盖策略或升级差异。
  **影响**：可能覆盖用户已有设置
  **进一步探讨**：在临时 DSH_HOME 验证首次安装、重复安装、升级和移除。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目录写入和预设内容带来哪些工程与安全限制？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

安装器写的是 DSH_HOME 而非 profile 私有路径。仅新建 profile 未必隔开预设，试用需先隔离整个 DSH_HOME 或人工把关目标目录。源码没有卸载清理回调；去掉挂载后要单独核对这两个文件并按需保留或移除，写作工作区的文件另行检查。COPYFILE_EXCL 挡同名覆盖，但不能证明宿主加载成对、升级时不混用版本或子代理始终遵守约定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-59](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L1-L59)

安装入口操作 DSH_HOME 文件。

<details>
<summary>查看原文（59行）</summary>

```text
/**
 * novel-writer — DeepSeek Harness (DSH) 预设插件。
 *
 * 作用：每次 DSH 启动（加载本插件）时，把包内自带的 agent.cordis.yml 和
 * preset.yml 复制到 DSH 的预设目录（~/.dsh/.agent-presets/novel-writer/，
 * 支持 $DSH_HOME 覆盖），从而注册「多核协同写作模式」预设。
 *
 * 注意：只在目标文件【不存在】时才落地——绝不覆盖你本机改过的预设。
 */
import { mkdir, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Cordis 插件名（须与 cordis.patch.yml 里的 id 一致）。 */
const name = "novel-writer";

/** 本文件所在目录（<包>/lib）。 */
const here = dirname(fileURLToPath(import.meta.url));

/** 预设文件在包根目录（lib/ 的上一级）。 */
const SOURCE_DIR = join(here, "..");

/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}

export { apply, name };
```

</details>

**依据 2 · 源码核查**：[package.json:1-35](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/package.json#L1-L35)

包声明文件清单和入口，限定分发内容。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "novel-writer",
  "version": "1.0.2",
  "description": "Multi-Core Collaborative Novel Writing — a DeepSeek Harness (DSH) preset plugin that installs a multi-agent novel-writing mode: one conductor plus five specialized subagents (多核协同写作模式).",
  "author": "sailoumili",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "harness",
    "cordis",
    "plugin",
    "agent-preset",
    "preset",
    "multi-agent",
    "subagent",
    "novel",
    "fiction",
    "creative-writing",
    "story-writing",
    "writing",
    "novel-writing"
  ],
  "homepage": "https://github.com/sailoumili/novel-writer",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sailoumili/novel-writer.git"
  },
  "bugs": {
    "url": "https://github.com/sailoumili/novel-writer/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
```

</details>

**依据 3 · 作者声明**：[README.md:70-107](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/README.md#L70-L107)

文档描述使用/兼容/退出方式。

<details>
<summary>查看原文（38行）</summary>

````text
2. 队长会走三步流程，**每一步都停下来等你确认**，不会一口气乱写：
   - 派「世界」和「剧情」开联席会，出《叙事宪法》草案和《世界白皮书》大纲 → 等你批准；
   - 批准后派「人物」生成主要角色档案 → 存进本地文件；
   - 最后申请「写第一章」的许可 → 你同意才动笔。

## 它会读写文件，请注意

为了让档案和台账跨会话不丢，这个预设会给 AI **读写文件的权限**。每开一个新小说，它会在你的工作区建一个项目文件夹：

```
outputs/日期-项目名/
├─ 叙事宪法.md        核心冲突、禁用项、硬性约束
├─ 世界规则白皮书.md   世界设定全记录（含战力天花板与差值）
├─ 人物档案.json      每个角色的「灵魂四维」档案
├─ 伏笔台账.md        所有伏笔的埋设/回收状态表
├─ 章节目录.md        每章最新版本 + 一句话梗概
├─ 第1章-v1.md        第一章正文（带版本号）
└─ 第1章-v2.md        改过的第二版……
```

文件操作仍受 DSH 自带的沙箱策略约束，预设本身不会突破沙箱。

## 章节版本管理

- 每章正文**单独存文件**，带版本号：`第N章-vX.md`（N=第几章，X=第几版，从 v1 开始）。
- **改稿不覆盖**：被打回重写或要求改稿时存成 `第1章-v2.md`，旧版留作废稿。
- **续写只认最新版**：只读每章版本号最大的那份。

## 想改它

- 完整提示词（「大脑设定」）在 `agent.cordis.yml`。
- 改完保存，下次开新会话生效。
- 卸载插件（`dsh plugin --profile web remove novel-writer`）不会删除已落地的预设文件。
- 想彻底删除：删掉 `~/.dsh/.agent-presets/novel-writer/` 整个文件夹。

## 许可

[MIT](./LICENSE)
````

</details>

**依据 4 · 源码核查**：[lib/index.js:25-57](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L25-L57)

覆盖拒绝、部分成功和无卸载清理。

<details>
<summary>查看原文（33行）</summary>

```text
/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}
```

</details>

**依据 5 · 源码核查**：[agent.cordis.yml:1-34](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/agent.cordis.yml#L1-L34)

模型工作流使用文件与委派。

<details>
<summary>查看原文（34行）</summary>

```text
# The `novel-writer` agent preset: the six-role novel studio in TRUE multi-agent
# form — a main "conductor" agent dispatches focused subagents, one per specialty.
#
# AGENT-PLANE composition. The host composition (`base.cordis.yml` +
# `web.cordis.yml`) keeps what a preset must not own: the registries themselves,
# the sandbox and approval stack, persistence, and the model route. A service
# row here MUST sit inside a group carrying an `isolate` realm; this file adds
# no service of its own, so its group realms are exactly the shipped ones.
#
# This file is a copy of the shipped `standard` preset with ONE change: the
# persona is the "conductor" (队长), who does not write prose itself but
# dispatches focused subagents (文笔/复核/世界/剧情/人物) via the delegation
# tools below. Data moves between subagents through local files (人物档案 /
# 伏笔台账 / 世界白皮书 / 章节目录), never through conversation memory.
#
# Keeping the full `standard` row set guarantees this preset mounts exactly like
# a shipped one; the subagent rows live in the `delegation` group.

# ── identity ────────────────────────────────────────────────────────────────

# The preset's own persona, shadowing the deployment default for this agent.
# `{{cwd}}` resolves from the agent's own workspace.
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |
      你是「多核协同写作模式」的小说创作团队——由一个统筹队长统领全局、5 个专职子代理（世界、剧情、人物、文笔、复核）各司其职组成的创作工作室。你的工作目录是 {{cwd}}。你不亲自写稿，只负责派单、把控全局节奏、拍板定稿，通过调动 5 个专职子代理，把一部小说从构思一路写到成稿。

      ## 你的核心工作方式：派单

      你有一个「子代理」（subagent）工具，能派一个「全新上下文」的专职子代理去独立完成一件事。子代理就像新来的临时工：它没有你们的对话记忆，所以派单时必须在指令里一次性给全三样东西：

      1. 角色规则：它是谁、只准干什么（用下面「五个专职岗位」里的模板）。
      2. 本次任务：具体到「第几章 / 哪个环节」，要做什么、产出什么。
```

</details>

#### 缺口

- 未执行安装/卸载，也未逐项审查预设对工具权限/提示注入的影响。
  **影响**：检查将写入的每个文件和内容，采用空 profile 验证可逆性并确认没有意外权限扩张。
  **进一步探讨**：检查将写入的每个文件和内容，采用空 profile 验证可逆性并确认没有意外权限扩张。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样在最小成本下试用，并判断是否值得保留？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

在隔离 DSH_HOME 加载后先核对两份配置的来源、成对性及实际可见性。用非敏感人物表和固定大纲写一段，再与手工提示比较设定冲突、协作文件可追溯性、模型调用与人工复核时间。若只落地一份、用到旧准则或写入意外路径就停止，并按预先备份恢复目标目录。停用挂载与清理预设文件需要分别确认，保留需要的原稿。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-50](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/README.md#L1-L50)

项目目标和推荐使用路径。

<details>
<summary>查看原文（50行）</summary>

````text
# 多核协同写作模式

> [English](./README.en.md) | 简体中文

一个装在 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 里的**多智能体小说创作模式**：一个「统筹队长」统领全局，5 个专职子代理各司其职——架构世界、策划剧情、管理人物、执笔写文、质检复核。新建会话时选它，就能用这支各就各位的「创作工作室」把一部小说从构思一路写到成稿。

## 这是什么

它不是只会聊天的 AI，而是一支**分工明确的 6 人小说工作室**——由**一个「队长」统领全局，5 个「专职子代理」各干各的活**。和「一个 AI 轮流演 6 个角色」不同，这里每个岗位是独立的：写正文的只写正文、挑错的只挑错、管世界的只管世界，每个子代理脑子里只装它那一份活，互不干扰，所以更专注、不串味。

| 角色 | 优势 | 干什么 |
| --- | --- | --- |
| 统筹队长 | 专职总指挥，不写稿，能客观拍板 | 派单；控节奏、终裁分歧、签发定稿；同一章被连续 3 次打回时，召集全体重新校准《叙事宪法》 |
| 世界子代理 | 世界背景与专有名词的唯一权威 | 产出《世界规则白皮书》和《名词索引附录》；每条设定都展开成「是什么 + 为什么 + 对故事的影响」；写明「主角战力 vs 天花板」的百分比差值，防战力崩坏 |
| 剧情子代理 | 主线与因果的总策划 | 用「节点法」出主线节点、转折点、伏笔台账；每个节点都写清「因为…所以…」的因果链，不拍脑袋硬写；主动埋伏笔 + 设计矛盾冲突 |
| 人物子代理 | 人物灵魂与说话风格的档案库 | 建「灵魂四维」JSON（外在底色/隐性欲望/心理阈值/社交关系网）和「语言基因卡」（句子长短/口头禅/禁忌词/小动作）；拒绝贴标签，注重成长弧光，行为合情合理 |
| 文笔子代理 | 唯一执笔，专注不被干扰 | 先遵从其他代理的设定（宪法/伏笔/世界/人物），想突破须「破格申请」；文字易读不散文化、描写为突出人物、不直写情绪（用动作/环境暗示）；每章约 2000–4000 字 |
| 复核子代理 | 只挑错、不改写，立场客观 | 正文逐条对照所有设定；三色灯判决：🔴致命→打回重写并写清原因，🟡警告→改后过审，🟢通过；额外验「水到渠成」、出【节奏建议】和【章末钩子】 |

## 安装方法

这是一个 **DSH 预设插件**：装好后，插件会把「多核协同写作模式」这个预设**自动注册进 DSH**，新建会话时直接选它就行。

### 方法一：插件安装（推荐）

插件已发布到 npm（包名 `novel-writer`），在 DSH 命令行里执行下面这一行即可（Windows / macOS / Linux 通用）：

```
dsh plugin --profile web add novel-writer
```

装完后，**重启或刷新 DSH web**，新建会话时选「多核协同写作模式」即可。

### 方法二：手动安装（备选）

不想用命令行的话，也可以手动装：

#### 一键脚本

Windows（PowerShell）：复制下面这一整行，粘贴回车，自动下载安装。

```powershell
irm https://raw.githubusercontent.com/sailoumili/novel-writer/main/install.ps1 | iex
```

macOS / Linux（终端）：

```bash
curl -fsSL https://raw.githubusercontent.com/sailoumili/novel-writer/main/install.sh | bash
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1-59](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L1-L59)

加载期安装机制。

<details>
<summary>查看原文（59行）</summary>

```text
/**
 * novel-writer — DeepSeek Harness (DSH) 预设插件。
 *
 * 作用：每次 DSH 启动（加载本插件）时，把包内自带的 agent.cordis.yml 和
 * preset.yml 复制到 DSH 的预设目录（~/.dsh/.agent-presets/novel-writer/，
 * 支持 $DSH_HOME 覆盖），从而注册「多核协同写作模式」预设。
 *
 * 注意：只在目标文件【不存在】时才落地——绝不覆盖你本机改过的预设。
 */
import { mkdir, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Cordis 插件名（须与 cordis.patch.yml 里的 id 一致）。 */
const name = "novel-writer";

/** 本文件所在目录（<包>/lib）。 */
const here = dirname(fileURLToPath(import.meta.url));

/** 预设文件在包根目录（lib/ 的上一级）。 */
const SOURCE_DIR = join(here, "..");

/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}

export { apply, name };
```

</details>

**依据 3 · 源码核查**：[package.json:1-30](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/package.json#L1-L30)

运行范围和入口。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "novel-writer",
  "version": "1.0.2",
  "description": "Multi-Core Collaborative Novel Writing — a DeepSeek Harness (DSH) preset plugin that installs a multi-agent novel-writing mode: one conductor plus five specialized subagents (多核协同写作模式).",
  "author": "sailoumili",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "harness",
    "cordis",
    "plugin",
    "agent-preset",
    "preset",
    "multi-agent",
    "subagent",
    "novel",
    "fiction",
    "creative-writing",
    "story-writing",
    "writing",
    "novel-writing"
  ],
  "homepage": "https://github.com/sailoumili/novel-writer",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sailoumili/novel-writer.git"
  },
  "bugs": {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:25-57](https://github.com/sailoumili/novel-writer/blob/bd0082106998a4737d3428bed334cacde46accd9/lib/index.js#L25-L57)

试用和退出依赖的实际落盘位置。

<details>
<summary>查看原文（33行）</summary>

```text
/** DSH 主目录：优先 $DSH_HOME，否则 ~/.dsh。 */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/** 目标目录：DSH 的预设目录。 */
function targetDir() {
  return join(dshHome(), ".agent-presets", "novel-writer");
}

/** 把预设两个文件落地（只在目标不存在时落地，不覆盖用户修改）。 */
async function installPreset() {
  const dest = targetDir();
  await mkdir(dest, { recursive: true });
  for (const f of ["agent.cordis.yml", "preset.yml"]) {
    try {
      await copyFile(join(SOURCE_DIR, f), join(dest, f), constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") {
        continue; // 目标已存在：跳过，绝不覆盖用户本机改过的预设。
      }
      throw err;
    }
  }
}

function apply(ctx) {
  ctx.effect(() => {
    installPreset().catch((err) => {
      console.error("[novel-writer] 预设落地失败：", err);
    });
  });
}
```

</details>

#### 缺口

- 没有用户写作产出或安装恢复验证。
  **影响**：以同题材任务记录提示准备、修稿、角色一致性及安装差异
  **进一步探讨**：不满足作者标准即移除。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
