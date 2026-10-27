# dsh-engineering-workflow

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3e251eb](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/tree/3e251eb78002625bcc238a42d9926d87c3a38bfe)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)
<!-- END META -->

> **功能**：可选工程 preset 与六个方法 Skill，以五阶段文字门禁引导 DSH Agent；Host 自动同步本地预设并公告。

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](#research-q01)。

> **主要限制**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](#research-q02)。

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
  - [Q01 · 安装后带来什么工作流？](#detail-section-11)
  - [Q02 · 自动同步如何对待用户修改？](#detail-section-12)
  - [Q03 · 五阶段硬门禁怎样影响开发体验？](#detail-section-13)
  - [Q04 · 六个技能如何分工，批准和执行规则是否一致？](#detail-section-14)
  - [Q05 · 委派、复审和完成证据有哪些可复用方法及成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队希望对复杂工程任务进行需求、计划、TDD、委派与验收约束。

DSH 内置 preset 与按需独立 Skill；本包强推五阶段纪律流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| preset/Skill | 纪律工程流程 | 文字约束 |
| 自动同步 | 更新安装 | 覆写自改 |
| 公告 | 提醒新会话 | 默认会话也可能收到 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH preset/skill 发现 | 新会话装载 | 不可用 |
| 目标工具 | plan/subagent/TDD | 阶段无法照做 |
| 同名目录备份 | 用户自改恢复 | 可能丢失 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 备份 | 同名 preset 目录 | 可恢复 |
| 对照 | 选/不选 preset | 提示边界清楚 |
| 量测 | 完成任务 | 质量收益抵消等待 |

**效果与成本**

#### 成本

| 阶段 | 已知投入 | 尚未知 |
| --- | --- | --- |
| 首次使用 | 备份同名 preset、核宿主工具与技能契约 | 兼容与配置工时 |
| 持续使用 | 需求/计划批准、测试循环、子代理双审、简报/报告/账本 | 模型费用、等待与质量收益 |
| 失败恢复 | 从账本/Git重建任务，恢复被同步覆盖的个人预设 | 重做与恢复时间，原件无备份时可能不可恢复 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 五阶段指引 | 六个 Skill 文本 | 模型遵循度 |
| 自动安装 | 逐字节同步 | 自改覆写 |
| 公告 | systemPrompt section | 默认会话干扰 |

> **思考**：自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：打包五阶段工程方法与 DSH preset/Skill 工具组合，减少手工配置。详见[Q01](#research-q01)。

宿主同步目录并加提示段；preset 指定工具组合和六个显式技能，硬门禁由文本驱动。 全部技能分工与矛盾见[Q04](#research-q04)，有界修复与新鲜证据的成本见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动同步同名 preset 目录时无备份覆写用户改动/删除附加文件；默认公告影响未选 preset 的新会话。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

备份 DSH_HOME/.agent-presets/engineering-workflow，再在新会话选择 preset 做对照试验；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

preset 与 Skill 结构可核；自动同步会覆盖同名自改并删除额外文件，文字门禁不等于执行强制；实际质量/效率未验。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/index.js、presets/engineering-workflow/preset.yml、presets/engineering-workflow/agent.cordis.yml、presets/engineering-workflow/skills/engineering-workflow/SKILL.md、presets/engineering-workflow/skills/workflow-requirements/SKILL.md、presets/engineering-workflow/skills/workflow-planning/SKILL.md、presets/engineering-workflow/skills/workflow-tdd/SKILL.md、presets/engineering-workflow/skills/workflow-subagents/SKILL.md、presets/engineering-workflow/skills/workflow-verification/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查 Host、preset 与全部六个 Skill；这些文本仅作研究材料，未套用其指令或执行目标。
- 下一步：隔离 DSH_HOME 同步自改/新增文件，比较默认/选中 preset 提示与同类工程任务耗时/质量。

**分析版本**

- **仓库**：[82c86b8z86-stack/dsh-engineering-workflow](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)
- **版本号**：0.1.1（[固定提交 3e251eb](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/tree/3e251eb78002625bcc238a42d9926d87c3a38bfe)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入版本化/备份合并与轻量低风险路径、按选中 preset 公告，可降低采用摩擦；待验证。详见[Q03](#research-q03)。

隔离 DSH_HOME 同步自改/新增文件，比较默认/选中 preset 提示与同类工程任务耗时/质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 807 | — | — | 10378 |
| .js | source | 1 | 254 | 172 | 67 | — |
| .mjs | source | 3 | 198 | 138 | 50 | — |
| .mjs | test | 1 | 126 | 112 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/issues?q=is%3Aissue+created%3A2026-09-22T06%3A28%3A17.787Z..2026-10-22T06%3A28%3A17.787Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A28%3A17.787Z..2026-10-22T06%3A28%3A17.787Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 preset+六 Skill 的实际载入、五阶段约束与自动同步对用户预设的影响。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安装后带来什么工作流？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件提供可选 engineering-workflow agent preset 与六个技能（总纲、需求、计划、TDD、子 Agent、验证），通过 preset 的工具组合和 Skill 文本指导 Agent 走五阶段门禁。Host 在挂载时同步 preset 目录，并可向 systemPrompt 注册公告；它本身没有浏览器面板、Host 路由或模型工具。只有新建会话明确选择该 preset 才加载完整技能/工具组合，公告却可进入宿主插件挂载后的新会话，即未选择 preset 的会话也会看到工作流推荐语。此为行为引导，不是硬性的执行引擎门禁。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-63](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/README.zh.md#L1-L63)

作者列五阶段、六技能和 preset 安装范围。

<details>
<summary>查看原文（63行）</summary>

````text
# dsh-engineering-workflow（工程工作流）

[![CI](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/actions/workflows/ci.yml)

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）叠加完整的工程化工作流层。一次安装即获得「**工程工作流**」agent preset——带五阶段硬门禁的纪律工程师模式——以及承载方法论的 6 个工作流技能。

方法论改编自 [obra/superpowers](https://github.com/obra/superpowers)（MIT）的 brainstorming / writing-plans / TDD / subagent-driven-development / verification-before-completion，并针对 dsh 原生能力重写：plan mode + `exit_plan_mode`、后台 `subagent`/`subagent_fork`、`workflow` 编排、目标工具与 preset/skill 体系。

## 五个阶段

| 阶段 | 技能 | 门禁 | dsh 机制 |
| --- | --- | --- | --- |
| ① 需求澄清 | `workflow-requirements` | 意图获批后才动手 | `ask_user_question` 一次一问 |
| ② 计划审批 | `workflow-planning` | 计划经 `exit_plan_mode` 获批 | plan mode，批准后 `todo_write` |
| ③ TDD 实现 | `workflow-tdd` | 没有失败测试就没有生产代码 | `pwsh`/`bash` 跑测试 |
| ④ 子 Agent 并行执行 | `workflow-subagents` | 逐任务审查 + 账本 | 后台 `subagent`、`send_message`、`list_agents` |
| ⑤ 验证收尾 | `workflow-verification` | 证据先于断言 | 全量套件 + 分支收尾菜单 |

总纲技能 `engineering-workflow` 把每个非平凡任务路由到对应阶段，并强制执行纪律规则（含合理化红线表）。

## 安装

```sh
dsh plugin --profile <name> add github:82c86b8z86-stack/dsh-engineering-workflow
```

（或将本包安装进 profile 依赖，并把 `dsh-engineering-workflow` 加入 `dsh.profile.bundles`。）

重启一次 dsh 让宿主插件挂载。启动时插件把 preset 同步到 `~/.dsh/.agent-presets/engineering-workflow`，之后新建会话的预设选择器中即可选「工程工作流」。同步幂等——升级插件会自动更新 preset 与技能。

免重启的手动/开发回退：

```sh
node scripts/sync-presets.mjs
```

dsh 每次读取 roster 都会重新发现预设，同步后立即可选。

## 工作原理

```
dsh-engineering-workflow (bundle)
├── cordis.patch.yml        insert 一行宿主插件
└── lib/index.js            宿主插件：把 presets/ 同步进 ~/.dsh/.agent-presets，
│                           并经 system-prompt section 向模型公告工作流
└── presets/engineering-workflow/
    ├── agent.cordis.yml    完整工具集 composition（改编自内置 cordis preset，MIT）：
    │                       shell、文件、后台任务、目标、plan mode、压缩、委派
    │                       （subagent/subagent_fork/workflow/ralph）、ask-user、todo、web、skills
    ├── preset.yml          roster 元数据（名称/描述/排序）
    ├── skills/             6 个工作流技能（每目录一个 SKILL.md）
    └── NOTICE              署名声明
```

preset 通过 `@deepseek-ai/dsh-skill-filesystem` 的 `customSkillDirs`（以 preset 自身目录为根）接入技能——与内置 `cordis` preset 同款模式，技能目录随 preset 走到哪跟到哪。

## 验证安装

```sh
node scripts/verify-install.mjs
# ✓ engineering-workflow: current (byte-identical)
```

````

</details>

**依据 2 · 源码核查**：[lib/index.js:1-44](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L1-L44)

Host 只同步预设并公告，无浏览器/路由/工具。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * dsh-engineering-workflow — engineering workflow layer for DeepSeek Harness.
 *
 * Host half only: on startup it syncs the bundled `presets/` tree into the
 * harness-home agent-presets root (`~/.dsh/.agent-presets`), making the
 * engineering-workflow preset (composition + skills) selectable for new
 * sessions without copying files by hand, and announces the workflow through
 * a system-prompt section. No browser half, no routes, no agent tools — the
 * preset itself provides the tools and the skills provide the methodology.
 *
 * The five workflow phases shipped as skills:
 *   engineering-workflow   — master skill, routes tasks to phases
 *   workflow-requirements  — requirements clarification (classify → questions → approval)
 *   workflow-planning      — plan writing and approval (plan mode + exit_plan_mode)
 *   workflow-tdd           — test-driven implementation (red-green-refactor)
 *   workflow-subagents     — parallel subagent execution (dispatch, ledger, review)
 *   workflow-verification  — verified finishing (evidence before claims, branch menu)
 *
 * The preset-sync pattern (per-directory idempotent copy with byte-compare
 * and pruning) follows the approach used by @linxin666/dsh-liangshen (MIT);
 * the workflow methodology is adapted from obra/superpowers (MIT).
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import z from "schemastery";

/** Stable cordis plugin name. */
export const name = "engineering-workflow";

/** Prompt assembly must exist before the announcement section can register. */
export const inject = ["systemPrompt"];

/** Plugin config: both switches default on. */
export const Config = z.object({
  enabled: z.boolean().default(true),
  announceToAgent: z.boolean().default(true),
});

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 160;

/**
```

</details>

**依据 3 · 源码核查**：[lib/index.js:234-254](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L234-L254)

enabled/announceToAgent 与 systemPrompt section。

<details>
<summary>查看原文（21行）</summary>

```text
      ctx.logger?.warn?.(`dsh-engineering-workflow: preset sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  let disposeSection;
  const refresh = () => {
    disposeSection?.();
    disposeSection = void 0;
    if (!resolve().enabled) return;
    sync();
    if (resolve().announceToAgent) disposeSection = ctx.systemPrompt.section({
      name: "plugin:dsh-engineering-workflow",
      order: SECTION_ORDER,
      text: WORKFLOW_GUIDANCE,
    });
  };
  refresh();
  ctx.effect(() => () => {
    disposeSection?.();
    disposeSection = void 0;
  }, "dsh-engineering-workflow: announcement");
}
```

</details>

**依据 4 · 源码核查**：[presets/engineering-workflow/skills/engineering-workflow/SKILL.md:1-38](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/engineering-workflow/SKILL.md#L1-L38)

总纲 Skill 的五阶段文字规则。

<details>
<summary>查看原文（38行）</summary>

````text
---
name: engineering-workflow
description: 工程化工作流总纲：五阶段硬门禁（需求澄清 → 计划审批 → TDD 实现 → 子 Agent 并行执行 → 验证收尾），任务路由、产物约定与纪律规则。Use when starting any non-trivial task — every feature, bugfix, refactor, or multi-step change must first be routed through this workflow.
---

# 工程化工作流总纲（Engineering Workflow Master）

本技能是 dsh 纪律工程师工作流层的入口。任何非平凡任务（新功能、缺陷修复、重构、多步骤变更）在动手之前，先按本技能完成阶段路由；被路由到的阶段技能必须在对应阶段**开始前**通过 `skill` 工具加载并遵循。

## 铁律

```
未经批准的意图 → 不写代码。
未经批准的计划 → 不执行任务。
没有失败测试 → 不写生产代码。
未经核实的证据 → 不宣称完成。
```

违反任一条的铁律的字面，就是违反其精神。

## 五个阶段与路由

| 阶段 | 技能 | 门禁（gate） | 产物 |
| --- | --- | --- | --- |
| ① 需求澄清 | `workflow-requirements` | 意图获得用户明确批准后才可动手 | 设计文档（架构级）或聊天内短设计（有界级） |
| ② 计划审批 | `workflow-planning` | 计划经 `exit_plan_mode` 呈现并获批准 | `docs/plans/YYYY-MM-DD-<feature>.md` |
| ③ TDD 实现 | `workflow-tdd` | 每个行为先有失败测试 | 测试 + 最小实现，小步提交 |
| ④ 子 Agent 并行执行 | `workflow-subagents` | 每任务审查通过，账本记录 | 账本 `.workflow/ledger.md`、审查报告 |
| ⑤ 验证收尾 | `workflow-verification` | 全部验证命令重新运行并有输出证据 | 绿套件 + 分支收尾决策 |

路由规则：

- 「帮我做个 X / 加个功能 / 改一下行为」→ ① 需求澄清（若已有明确规格或设计文档则跳到 ②）。
- 「修这个 bug」→ ① 轻量澄清 → ③ TDD（先写复现测试），不跳 ③。
- 已有批准的设计文档 → ② 计划审批。
- 已有批准的实施计划 → ③ 或 ④ 直接执行。
- 多步骤任务执行中 → 阶段技能按序流转，回退需明确说出口。

````

</details>

#### 缺口

- 未在目标 DSH 会话选择 preset 并执行任务。
  **影响**：模型是否遵循门禁和现有会话影响未知。
  **进一步探讨**：在隔离 profile 比较默认/选中 preset 新会话的提示、工具与执行行为。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动同步如何对待用户修改？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

syncOnePreset 对同名目标目录做逐字节比较；只要有差异，就先 pruneExtras 删除源包没有的目标文件，再 cpSync 覆盖同名文件，随后再删多余文件。自动挂载时会对 DSH_HOME/.agent-presets/engineering-workflow 执行此同步，故用户若在这个 preset 目录手改 SKILL、agent.cordis.yml 或添加个人文件，下次启用/更新可能被无备份覆盖或删除。保护范围仅限同名目录，兄弟 preset 不触碰。README 用“幂等/升级自动更新”描述此行为，未提示同名目录自改会丢失；这是可从代码确定的持久化边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:72-120](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L72-L120)

pruneExtras 删除多余文件、syncOnePreset 覆盖差异。

<details>
<summary>查看原文（49行）</summary>

```text
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else out.push(path);
    }
  };
  walk(root);
  return out;
}

/** Preset files are small; identity means identical bytes, not just size/mtime. */
function sameFile(a, b) {
  return readFileSync(a).equals(readFileSync(b));
}

/**
 * Remove files not in `keep` (relative paths), then remove only the
 * directories those removals left empty — still strictly inside `root`, so
 * sibling presets are never touched.
 */
function pruneExtras(root, keep) {
  const parents = new Set();
  for (const file of filesUnder(root)) if (!keep.has(relative(root, file))) {
    parents.add(dirname(file));
    rmSync(file, { force: true });
  }
  for (const start of parents) {
    let dir = start;
    while (dir !== void 0 && relative(root, dir) !== "") if (existsSync(dir) && readdirSync(dir).length === 0) {
      rmSync(dir, { recursive: true, force: true });
      dir = dirname(dir);
    } else dir = void 0;
  }
}

/** Copy `sourceRoot/<id>` into `targetRoot/<id>`, idempotently. Returns "synced" or "current". */
export function syncOnePreset(sourceDir, targetDir) {
  const sourceFiles = filesUnder(sourceDir);
  const sourceSet = new Set(sourceFiles.map((file) => relative(sourceDir, file)));
  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) rmSync(targetDir, { recursive: true, force: true });
  if (!existsSync(targetDir)) {
    cpSync(sourceDir, targetDir, { recursive: true, preserveTimestamps: true });
    pruneExtras(targetDir, sourceSet);
    return "synced";
  }
  let dirty = false;
  for (const file of sourceFiles) {
    const dest = join(targetDir, relative(sourceDir, file));
```

</details>

**依据 2 · 源码核查**：[lib/index.js:143-172](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L143-L172)

遍历包内 preset 并写到目标根。

<details>
<summary>查看原文（30行）</summary>

```text
 * untouched.
 *
 * @param sourceRoot - plugin-owned preset tree (bundled in the package).
 * @param targetRoot - dsh agent-presets discovery root (e.g. <home>/.dsh/.agent-presets).
 * @param retire - previously bundled preset ids to remove when absent from the source.
 * @returns { synced: string[], current: string[], failed: {id,error}[], retired: string[] }
 */
export function syncPresetTrees(sourceRoot, targetRoot, retire = []) {
  const result = { synced: [], current: [], failed: [], retired: [] };
  mkdirSync(targetRoot, { recursive: true });
  if (existsSync(sourceRoot)) for (const entry of readdirSync(sourceRoot)) {
    const source = join(sourceRoot, entry);
    if (!statSync(source).isDirectory()) continue;
    const id = basename(source);
    try {
      (syncOnePreset(source, join(targetRoot, id)) === "synced" ? result.synced : result.current).push(id);
    } catch (error) {
      result.failed.push({ id, error: error instanceof Error ? error.message : String(error) });
    }
  }
  for (const id of retire) {
    if (existsSync(join(sourceRoot, id))) continue;
    const stale = join(targetRoot, id);
    if (existsSync(stale) && statSync(stale).isDirectory()) {
      rmSync(stale, { recursive: true, force: true });
      result.retired.push(id);
    }
  }
  return result;
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:230-247](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L230-L247)

挂载刷新时自动 sync。

<details>
<summary>查看原文（18行）</summary>

```text
      for (const { id, error } of result.failed) ctx.logger?.warn?.(`dsh-engineering-workflow: preset ${id} sync failed: ${error}`);
      if (result.synced.length > 0) ctx.logger?.info?.(`dsh-engineering-workflow: presets synced into ${targetRoot}: ${result.synced.join(", ")}`);
      if (result.retired.length > 0) ctx.logger?.info?.(`dsh-engineering-workflow: retired stale presets from ${targetRoot}: ${result.retired.join(", ")}`);
    } catch (error) {
      ctx.logger?.warn?.(`dsh-engineering-workflow: preset sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  let disposeSection;
  const refresh = () => {
    disposeSection?.();
    disposeSection = void 0;
    if (!resolve().enabled) return;
    sync();
    if (resolve().announceToAgent) disposeSection = ctx.systemPrompt.section({
      name: "plugin:dsh-engineering-workflow",
      order: SECTION_ORDER,
      text: WORKFLOW_GUIDANCE,
    });
```

</details>

**依据 4 · 作者声明**：[README.zh.md:30-40](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/README.zh.md#L30-L40)

作者称自动同步且幂等。

<details>
<summary>查看原文（11行）</summary>

````text

免重启的手动/开发回退：

```sh
node scripts/sync-presets.mjs
```

dsh 每次读取 roster 都会重新发现预设，同步后立即可选。

## 工作原理

````

</details>

#### 缺口

- 未在用户真实 DSH_HOME 运行同步。
  **影响**：实际已有自改文件是否存在未知。
  **进一步探讨**：隔离目录放同名自改/新增文件复核删除，改为告警或保留备份/版本化迁移。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 五阶段硬门禁怎样影响开发体验？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

总纲要求非平凡任务先走需求意图批准、计划批准、TDD、逐任务子 Agent 审查和验证收尾；技能文本甚至强调简单任务也需批准。这可能适合高审查工程流程，却可能让小修复出现较多等待、文档/账本与测试提交成本。是否真能改善缺陷率取决于模型按文执行与项目约束，不因 Skill 文本即得到保证。采用时先复制/备份个人 preset，自行选择新会话试用并量测从需求到完成的等待时间、测试收益与审查工作量；用户已有明确授权时也应按其真实意图解释，而非机械重复批准。建议为低风险任务提供轻量路径并让默认公告只在选中 preset 时出现。

#### 证据与依据

**依据 1 · 源码核查**：[presets/engineering-workflow/skills/engineering-workflow/SKILL.md:10-74](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/engineering-workflow/SKILL.md#L10-L74)

硬门禁、一次一问、计划/测试/委派等文字规则。

<details>
<summary>查看原文（65行）</summary>

````text
## 铁律

```
未经批准的意图 → 不写代码。
未经批准的计划 → 不执行任务。
没有失败测试 → 不写生产代码。
未经核实的证据 → 不宣称完成。
```

违反任一条的铁律的字面，就是违反其精神。

## 五个阶段与路由

| 阶段 | 技能 | 门禁（gate） | 产物 |
| --- | --- | --- | --- |
| ① 需求澄清 | `workflow-requirements` | 意图获得用户明确批准后才可动手 | 设计文档（架构级）或聊天内短设计（有界级） |
| ② 计划审批 | `workflow-planning` | 计划经 `exit_plan_mode` 呈现并获批准 | `docs/plans/YYYY-MM-DD-<feature>.md` |
| ③ TDD 实现 | `workflow-tdd` | 每个行为先有失败测试 | 测试 + 最小实现，小步提交 |
| ④ 子 Agent 并行执行 | `workflow-subagents` | 每任务审查通过，账本记录 | 账本 `.workflow/ledger.md`、审查报告 |
| ⑤ 验证收尾 | `workflow-verification` | 全部验证命令重新运行并有输出证据 | 绿套件 + 分支收尾决策 |

路由规则：

- 「帮我做个 X / 加个功能 / 改一下行为」→ ① 需求澄清（若已有明确规格或设计文档则跳到 ②）。
- 「修这个 bug」→ ① 轻量澄清 → ③ TDD（先写复现测试），不跳 ③。
- 已有批准的设计文档 → ② 计划审批。
- 已有批准的实施计划 → ③ 或 ④ 直接执行。
- 多步骤任务执行中 → 阶段技能按序流转，回退需明确说出口。

## 何时用哪个执行模式（④ 内部再路由）

| 场景 | 模式 |
| --- | --- |
| 计划任务大部分互相独立、需要持续审查 | `workflow-subagents`（每任务一个后台 subagent + 审查） |
| 2+ 个完全独立的调查/修复域，无共享状态 | `workflow-subagents` 的并行派发模式 |
| 任务紧耦合、共享上下文过多 | 本会话内联执行（`workflow-tdd` + `todo_write` 跟踪） |
| 大规模同构任务（几十个文件同类改动） | `workflow` 工具编排脚本 |

## 通用纪律

1. **先加载技能再行动**：进入某阶段前先 `skill(<阶段技能>)`，包括提澄清问题之前。宣布「Using <技能名> to <目的>」。
2. **一次一个问题**：需求澄清用 `ask_user_question` 一次只问一个问题（见 `workflow-requirements`）。
3. **计划即合同**：批准后的计划是执行依据；执行中偏离需记录「裁定（Ruling）」并继续，只有四类情况停下询问（不可逆/破坏性操作、安全敏感动作、工作区外的副作用、计划烂到每步都靠猜）。
4. **账本胜过记忆**：多任务执行把进度写进账本文件（`.workflow/ledger.md`），因为会话压缩会丢失对话记忆。
5. **小步提交**：每个任务的提交独立、可审查（TDD 节奏：RED 提交测试、GREEN 提交实现，或至少每任务一提交）。
6. **YAGNI 无情**：任何设计/计划先砍掉不必要的功能。

## 红线（Rationalization Red Flags）

| 念头 | 事实 |
| --- | --- |
| 「这个太简单了，不用澄清」 | 简单意味着更短的设计，而不是没有设计；批准门禁从不随简单而消失。 |
| 「我先看一下代码再决定」 | 技能检查先于探索。先路由，再按技能规定的方式探索。 |
| 「计划我口头说一下就行」 | plan mode 下计划只通过 `exit_plan_mode` 呈现，口头同意不结束 plan mode。 |
| 「这个测试先跳过，回头补」 | 跳过 TDD 的代码 = 重写。没有例外。 |
| 「子 agent 说成功了」 | 独立核验 diff 与测试输出（见 `workflow-verification`）。 |
| 「之前跑过测试了」 | 证据只在本次运行该命令后有效。重新跑，读输出。 |
| 「我应该继续吗？」 | 已批准的计划不需要逐任务请示；按计划执行，只在四类停止条件停下。 |

## 本工作流在 DSH 中的工具映射

- 需求澄清：`ask_user_question`（一次一个问题，可带选项）。
- 计划审批：plan mode + `exit_plan_mode`；批准后 `todo_write` 建任务清单。
- TDD：`pwsh`（Windows）/ `bash` 运行测试，`read`/`grep`/`edit`/`write` 改代码。
- 并行执行：`subagent`（默认 `run_in_background: true`）、`subagent_fork`、`send_message`、`list_agents`、`interrupt_agent`、`job_output`；大 fan-out 用 `workflow`。
````

</details>

**依据 2 · 作者声明**：[README.zh.md:13-26](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/README.zh.md#L13-L26)

五阶段与 DSH 机制映射。

<details>
<summary>查看原文（14行）</summary>

````text
| ① 需求澄清 | `workflow-requirements` | 意图获批后才动手 | `ask_user_question` 一次一问 |
| ② 计划审批 | `workflow-planning` | 计划经 `exit_plan_mode` 获批 | plan mode，批准后 `todo_write` |
| ③ TDD 实现 | `workflow-tdd` | 没有失败测试就没有生产代码 | `pwsh`/`bash` 跑测试 |
| ④ 子 Agent 并行执行 | `workflow-subagents` | 逐任务审查 + 账本 | 后台 `subagent`、`send_message`、`list_agents` |
| ⑤ 验证收尾 | `workflow-verification` | 证据先于断言 | 全量套件 + 分支收尾菜单 |

总纲技能 `engineering-workflow` 把每个非平凡任务路由到对应阶段，并强制执行纪律规则（含合理化红线表）。

## 安装

```sh
dsh plugin --profile <name> add github:82c86b8z86-stack/dsh-engineering-workflow
```

````

</details>

**依据 3 · 源码核查**：[lib/index.js:40-45](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js#L40-L45)

未选 preset 的新会话仍可能收到公告。

```text

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 160;

/**
 * Model-facing announcement: plugin presence, the five workflow phases, and
```

#### 缺口

- 未观察真实任务中延迟、质量和模型遵循度。
  **影响**：效率与安全收益均无独立度量。
  **进一步探讨**：在同一代码任务对照该 preset 与普通流程，记录用户等待、测试/缺陷和完成质量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 六个技能如何分工，批准和执行规则是否一致？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

需求技能把试探、有界与架构任务分流，有界路径获设计批准后直接实现且不写计划文档，架构任务则规格自审后再交计划技能。因此总纲五阶段不是所有任务都实际经过的唯一控制流。计划技能要求实施代码、接口和测试细节完整，获批后支持内联或子代理；但开头称口头同意不批准任何东西，后文又允许非 plan mode 用 ask_user_question 明确批准，读者须结合运行模式辨认，不能把文本视为程序化状态机。TDD 强制先失败再最小实现，先写的生产代码要求删除重来，一次性原型、生成代码和纯配置也需用户同意才例外。这些是目标插件的规则内容，本研究没有执行它们。其严格门禁适合需要审查链的任务，已有测试、低风险配置或用户已经明确授权时仍可能增加等待和重复工作；没有同任务数据证明纪律收益超过仪式成本。

#### 证据与依据

**依据 1 · 源码核查**：[presets/engineering-workflow/skills/workflow-requirements/SKILL.md:14-44](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-requirements/SKILL.md#L14-L44)

三类任务与有界直接实施、架构转计划

<details>
<summary>查看原文（31行）</summary>

```text
## 三步分类

动手提问前，先大声说出分类（「这看起来是有界任务，我会在聊天里给出简短设计而不是写规格文档」），让用户可以推翻：

- **试探（Spike）**——可行性问题（「能不能…」「可行吗…」），产物是答案而不是要保留的代码。用 2-3 句话说明要验证的问题和探法，得到点头后，用「正确性允许的最便宜方式」调查，产出建议；搭建的一切标记为一次性。
- **有界（Bounded）**——对仓库中**已存在**的流程做边界清晰的改动。注意：理解这类应用不等于有界——有界意味着你要改的流程现在就躺在仓库里可读。没有现成流程可改 = 不是有界。提出关键澄清问题（一次一个），在聊天里给简短设计（几句话到几段），**停下**。用户明确说「是」之后才开始实现。
- **架构级（Architectural）**——新项目、新子系统、改变组件间组合关系或他人依赖的接口。走完整流程：问题 → 2-3 个方案 → 分段设计 → 规格文档 → 自审 → 用户审阅 → 转交 `workflow-planning`。

两档之间犹豫时取更重的一档。棘轮单向：中途发现隐藏复杂度就升级路径——停下、说明、升档；中途永不降档。

## 流程

### 有界路径

1. 探索项目上下文（文件、文档、近期提交）——用 `read`/`grep`/`glob`。
2. 用 `ask_user_question` **一次一个问题**地问关键澄清问题（优先带选项的多选题）。
3. 在聊天里呈现简短设计：方案、涉及文件、测试方式。
4. **拿到批准**——停下并等待明确的「是」；呈现设计和开始动手在同一口气里 = 跳过门禁。
5. 实现——走正常开发流程（TDD 适用，见 `workflow-tdd`）；不写计划文档。

### 架构级路径

1. 探索项目上下文（同上）。
2. 评估范围：若请求描述多个独立子系统，立刻指出——先把项目分解成子项目（独立件、相互关系、构建顺序），再逐个走设计流程。
3. 用 `ask_user_question` 一次一个问题地澄清：目的、约束、成功标准。
4. 提出 2-3 个方案，带权衡与你的推荐（推荐放在最前，说明理由）。
5. 分段呈现设计，每段之后问是否对路。覆盖：架构、组件、数据流、错误处理、测试。
6. 写设计文档到 `docs/specs/YYYY-MM-DD-<topic>-design.md` 并 git 提交。
7. **规格自审**（自己查自己，不用派 subagent）：占位符扫描（TBD/TODO/含糊需求）→ 内部一致性 → 范围是否聚焦 → 歧义检查（一句两读就选一读并写明）。发现问题就地修正。
8. **用户审阅门禁**：请用户审阅规格文件，等其回复；有改动就改并重跑自审，批准后才继续。
9. 转交 `workflow-planning`（唯一后续技能）。
```

</details>

**依据 2 · 源码核查**：[presets/engineering-workflow/skills/workflow-planning/SKILL.md:10-12](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-planning/SKILL.md#L10-L12)

批准方式强表述

```text
## 硬门禁

> 计划必须通过 `exit_plan_mode` 呈现并获批。用户的口头同意——包括对你所问问题的确认回答——不批准任何东西，也不结束 plan mode；把确认后的决定折进计划，通过 `exit_plan_mode` 提交。批准之前不得修改文件、不得建立 todo 实施清单。
```

**依据 3 · 源码核查**：[presets/engineering-workflow/skills/workflow-planning/SKILL.md:98-117](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-planning/SKILL.md#L98-L117)

非plan方式、执行移交与内联

<details>
<summary>查看原文（20行）</summary>

```text
## 提交审批

- 若在 plan mode 中：把完整计划 markdown 通过 `exit_plan_mode` 提交（该调用必须是那次响应的唯一且最后一个工具调用）。被驳回就吸收反馈重新提交；不可用则留在 plan mode 请用户手动切模式。
- 若不在 plan mode（用户关闭了 plan mode 或会话不在该模式）：用 `ask_user_question` 请求明确批准，等用户答复。
- 获批后：`todo_write` 为每个任务建一项（这跟踪的是批准后的实施，不属于 plan mode 的规划期）。

## 执行移交（计划获批后）

向用户给出两个选项：

1. **子 Agent 驱动（推荐）**——每任务派发一个全新后台 subagent，任务间审查，快速迭代 → 加载 `workflow-subagents`。
2. **内联执行**——本会话按任务顺序执行，批处理 + 检查点 → 继续用本技能的执行规则（见下）。

## 内联执行规则（选择选项 2 时）

1. 重读计划，批判性审查；有疑问先向用户提出，无问题才建 todo。
2. 每任务：标记 in_progress → 严格按步骤执行（每步验证照跑）→ 标记 completed。
3. 全部完成后转入 `workflow-verification` 收尾。
4. **何时停下求助**：遇到阻塞（缺依赖、测试失败、指令不清）、计划存在致命缺口、验证反复失败——停下问，不要猜。
5. 未经用户明确同意，不在 main/master 分支上开始实现。
```

</details>

**依据 4 · 源码核查**：[presets/engineering-workflow/skills/workflow-tdd/SKILL.md:12-26](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-tdd/SKILL.md#L12-L26)

先测试和例外范围

<details>
<summary>查看原文（15行）</summary>

````text
## 铁律

```
没有先失败的测试，就没有生产代码。
```

在测试之前写了代码？删掉，从头再来。没有例外：不留作「参考」、不在写测试时「改巴改巴再用」、看都不要看。删就是删。

## 何时使用

**总是**：新功能、缺陷修复、重构、行为变更。

**例外（须用户同意）**：一次性原型、生成的代码、纯配置文件。

「这次跳过 TDD」的念头 = 合理化。停。
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 委派、复审和完成证据有哪些可复用方法及成本？

**研究主题**：工程质量与复用、效果与总成本、新假设与验证

#### 完整回答

委派技能要求每任务全新实现者、独立审查者，以简报、报告、diff 文件及 Global Constraints 传递上下文，账本保存裁定；独立域并行，共享状态顺序执行。规格符合和质量双审是明确的职责划分。修复最多五轮，前三轮回原实现者，后两轮换人，封顶后必须逐条修复或记录裁定；全分支终审再限制一次修复派发。这是可借鉴的有界审查循环，但 parked 的真实问题仍可能留存，封顶不代表全部缺陷消除。验证技能要求读完整验证输出并逐项核需求，不能仅凭 agent 自报成功；同时要求本次消息新鲜验证，分支收尾呈现菜单，频繁重复验证的资源和等待成本未测。首次须配齐 shell、文件、计划、子代理和 skill 工具；持续产生多份任务简报、diff、报告、账本、测试与模型调用，失败恢复依赖账本与 Git 状态重建，没有执行器自动验收这些文件。可研究按风险裁剪批准/审查层级并缓存仍对应同一代码树的有效验证证据，比较缺陷、等待、模型调用及重做成本；这是本报告设计推演，不是现有实现。

#### 证据与依据

**依据 1 · 源码核查**：[presets/engineering-workflow/skills/workflow-subagents/SKILL.md:36-59](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-subagents/SKILL.md#L36-L59)

并行边界、账本和简报

<details>
<summary>查看原文（24行）</summary>

```text
**并行派发模式**（独立调查/修复域）：2+ 个互不依赖、无共享状态的问题域——多个 `subagent` 调用放在**同一条消息**里 = 并行运行；一条消息一个 = 顺序执行。规则：
- 一个 agent 一个问题域；提示要聚焦（具体文件/测试）、自包含（全部上下文）、明确输出（返回什么）。
- 共享文件/共享状态 = 不并行；会互相踩的改动顺序做。
- 返回后：逐个读摘要 → 检查冲突（是否改了同一代码）→ 跑全量套件 → 集成。

## 主流程（每任务循环）

### 0. 设置

- 不在 main/master 上实现（除非用户明确同意）；建议分支或独立工作区。
- 账本：`.workflow/ledger.md`，第一行 `# workflow ledger — plan: <plan path>`。**对话记忆活不过压缩；账本 + git log 才是恢复地图。**压缩后相信账本与 `git log`，别信回忆。
- 读一遍计划，记下 Global Constraints；spec 是绑定权威，计划是其论证。
- `todo_write` 每任务一项。
- **预检扫描**：派发 Task 1 前扫一遍计划内冲突（任务互相矛盾/与 Global Constraints 矛盾/计划强制要求但审查标准视为缺陷的内容），写成表格写入账本，每条给出裁定（Ruling）或标注「干净」。

### 1. 派发 implementer

- 记录 `BASE`（`git rev-parse HEAD`）——审查包与修复轮 diff 需要它。
- **任务简报文件**：用 `write` 把该任务全文提取到 `.workflow/task-N-brief.md`（唯一源需求文件）；派发提示包含：(1) 一行任务在项目中的位置；(2) 简报路径，注明「先读这个——它是你的需求，数值原文照抄」；(3) 之前任务的接口与裁定（简报里没有的）；(4) 你注意到的歧义的裁决；(5) 报告文件路径与报告契约。精确值（数字、魔法串、签名、用例）只出现在简报里。**永远不要让 subagent 读整份计划。**
- **报告文件**：`.workflow/task-N-report.md`，implementer 写全量报告，只返回：状态、提交、一行测试摘要、顾虑。
- 派发提示只描述一个任务，不贴会话历史，不带「前 N 个任务状态」。
- **契约：implementer 不派发 subagent**——不派帮手，更不派审查者；审查只从你这里来。
- 记录返回的 subagent_id（修复轮 1-3 用它）。
- 同形小任务（同一类一行改动 × N 个文件）合并成**一批**一个派发，review 其 diff 作为一个单元。
```

</details>

**依据 2 · 源码核查**：[presets/engineering-workflow/skills/workflow-subagents/SKILL.md:70-100](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-subagents/SKILL.md#L70-L100)

双审、五轮封顶与终审

<details>
<summary>查看原文（31行）</summary>

```text
### 3. 审查任务（逐任务门禁）

- reviewer 输入三条路径：简报文件、报告文件、diff 文件 + Global Constraints（逐字复制，作为其注意力透镜）。不加大而无当的指示；不要求它重跑 implementer 已跑过的测试；**不预判发现**（提示里出现「不要标 X」「最多 Minor」= 你在预判，重写）。
- 两个裁决缺一不可：**规格符合** 与 **质量**。implementer 自审不能替代任务审查。
- reviewer 报「⚠️ 无法从 diff 验证」的项：你自己逐项解决（你有计划与跨任务上下文）；确认是真缺口 = 按审查失败处理，进入修复循环。
- Minor 发现记入账本（`Task N: minor (deferred): <一句话>`），不进循环，留给终审分诊。

### 4. 修复循环（每任务最多 5 轮）

触发：规格 ❌、任何 Critical/Important 发现、或你确认的 ⚠️ 缺口。修复轮 = 一次修复派发 + 一次范围限定复审。

- **轮 1-3：`send_message` 恢复原 implementer**，原文贴未决发现。若平台不支持给活 agent 发消息，用简报 + 报告 + 发现清单重新派发。
- **轮 4-5：全新 implementer**（更清晰提示），带简报、报告文件、未决发现，并说明「前一位尝试了 N 次；现在你接手。读报告文件了解试过什么」。
- 每轮：修复 → 重跑覆盖测试 → 把修复报告**追加**到同一报告文件 → 复审。确认报告含覆盖测试、命令、输出三者齐全后才派复审；修复消息中点名覆盖测试文件。
- **复审是范围限定的**：`git diff -U10 FIX_BASE..HEAD`（FIX_BASE = 上一轮复审看到的 HEAD）。复审逐条裁决 ADDRESSED / NOT ADDRESSED，只标修复 diff 里的新破坏；范围外观测进账本，不延长循环。
- 每轮后记账：`Task N: fix round R/5 (X addressed, Y open — <发现一句话>; commits a7..b7)`。
- **绝不在主会话自己改代码**——控制器改动绕过审查、污染上下文。
- **熔断（第 5 轮仍开）**：停止派发，逐条裁决：(a) 审查者错/可争 → 记 `parked — 裁定`；(b) 真实但下游不依赖 → 同样 park 并注明真实且延期；(c) 真实且承重（后续任务依赖/暴露计划缺陷）→ 裁最小解堵改动，记入账本并带入下一任务派发；只有每条路都靠猜时才停下问人。**只在封顶时裁决**；每次裁决必须入账本，静默丢弃禁止。

### 5. 完成任务

审查干净（或封顶后全部裁决）→ 同一消息里记账：
- `Task N: complete (commits <base7>..<head7>, review clean)`
- 或 `Task N: complete (commits <base7>..<head7>, K parked)`

然后 todo 标记完成，继续下一任务。审查仍有未决 Critical/Important 且既未修复也未 park 时不得前进。

## 终审

- 全部任务完成后：`git diff -U10 $(git merge-base main HEAD)..HEAD > .workflow/final-diff.txt`，派发终审 reviewer（最强可用，全新 spawn），并把账本里的 deferred-minor 与 parked 行指给它分诊。
- 终审有发现 → **一次**修复派发（全部发现清单，一个 fixer——每个发现一个 fixer 的代价曾超过全部任务之和）→ 一次范围限定复审 → 残余裁决同上。没有第二波修复；残余承重发现留给 `workflow-verification` 的收尾菜单呈现给用户。
```

</details>

**依据 3 · 源码核查**：[presets/engineering-workflow/skills/workflow-verification/SKILL.md:16-44](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-verification/SKILL.md#L16-L44)

新鲜证据与需求核对

<details>
<summary>查看原文（29行）</summary>

````text
本次消息里没跑过那个验证命令，就不能声称它通过。

## 门函数

```
宣称任何状态或表达满意之前：

1. IDENTIFY：哪条命令能证明这个声明？
2. RUN：完整运行该命令（新鲜的、完整的）
3. READ：读全量输出、查退出码、数失败数
4. VERIFY：输出证实了声明吗？
   - 否 → 用证据陈述实际状态
   - 是 → 带证据陈述声明
5. ONLY THEN：才做声明

跳过任何一步 = 撒谎，不是验证。
```

## 常见失败（claim 对照表）

| 声明 | 需要 | 不够 |
| --- | --- | --- |
| 测试通过 | 测试命令输出：0 失败 | 上次跑过 / 「应该能过」 |
| Lint 干净 | Lint 输出：0 错误 | 部分检查、外推 |
| 构建成功 | 构建命令：退出码 0 | Lint 过了、日志看着还行 |
| Bug 已修 | 原症状测试通过 | 代码改了、假定修好 |
| 回归测试有效 | 红绿循环已验证（改回原实现必须失败） | 测试只通过一次 |
| 子 agent 完成了 | VCS diff 显示改动 + 你的独立核验 | agent 报「成功」 |
| 需求满足 | 逐行核对清单 | 测试通过 |
````

</details>

**依据 4 · 源码核查**：[presets/engineering-workflow/skills/workflow-verification/SKILL.md:61-85](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-verification/SKILL.md#L61-L85)

全套验证与收尾

<details>
<summary>查看原文（25行）</summary>

````text
## 分支收尾（实现完成、全绿之后）

宣布：「I'm using the workflow-verification skill to complete this work.」

1. **验证测试**：跑项目完整套件（`npm test` / `pytest` / `go test ./...`，DSH 里用 `pwsh`/`bash`）。失败 → 报告失败并停下，菜单在绿套件之后。
2. **检测环境**：普通仓库还是 worktree；确定 base 分支（不确定就问：从哪个分支分出来的——合错 base 的代价高昂）。
3. **呈现菜单**（原文呈现，等用户选择）：

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)

Which option?
```

4. **执行选择**：
   - 合并：合并 → 在合并结果上重跑测试 → 绿了再清分支。
   - PR：推送并创建 PR，报告 URL；工作区保留给反馈迭代。
   - 保留：报告保留状态。
   - 丢弃只发生在用户明确要求时；要求确认（`Type 'discard' to confirm.`），逐字确认后才删。
5. **文档收尾**：按项目约定更新 CHANGELOG / 文档（无约定则不虚构）。
6. **Rulings 汇总**：若本任务走过 `workflow-subagents`，把账本里全部 `Ruling:` 汇总进最终消息（按序、带错误代价）——那是你替用户做的决定的唯一出口。
````

</details>

#### 缺口

- 缺少同任务的分层流程与强制全流程对照。
  **影响**：无法确定额外批准、模型与测试成本是否换得质量收益。
  **进一步探讨**：固定代码任务对比逃逸缺陷、用户等待、模型调用及失败恢复工时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
