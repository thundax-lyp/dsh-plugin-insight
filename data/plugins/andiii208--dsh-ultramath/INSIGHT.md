# dsh-ultramath

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[37d95b1](https://github.com/Andiii208/dsh-ultramath/tree/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath)
<!-- END META -->

> **实现功能**：同步数模竞赛主控/角色预设、模型库与论文模板。

> **核心亮点**：把分阶段数模资产、五角色预设、模型库、模板和审稿脚本打包为可发现入口，降低流程搭建成本；核心流程执行依赖模型与上游工具。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：“全自动/独立验算/盲评”多为提示文本，不能保证模型正确或真正独立；同步还会清理同名目标目录额外文件，安装前须核所有权和备份。详见[Q03](#research-q03)。

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
  - [Q01 · 它实际交付哪些数学建模入口和资产？](#detail-section-11)
  - [Q02 · 预设/技能同步和阶段门禁怎样工作？](#detail-section-12)
  - [Q03 · 安装同步会不会影响用户已有目录，如何看待提示优先级？](#detail-section-13)
  - [Q04 · 完成一次合格题目与失败恢复要付出什么资源和人工？](#detail-section-14)
  - [Q05 · 怎样区分流程门禁价值与模型自评幻觉，能否提出可证伪增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：数学建模竞赛团队需从读题、求解、验证到论文审稿的组织模板。

普通人工数模团队或单个 Skill 也可分工、复算和写 LaTeX；本项增量是 DSH 预设与资源打包，真实获奖效果未证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| Skill | 数模方法路由 | 模型按需阅读 |
| Agent/Preset | 阶段角色编排 | 不保证模型质量 |
| 加载时资源同步 | apply直接调用预设/Skill同步 | 无后台调度；同名目录可覆盖 |

**流程与依赖**

| 类型 | 条件 | 用途与限制 |
| --- | --- | --- |
| 必需 | 兼容 DSH/Node/Cordis 与文件发现目录 | 预设/技能加载，未宿主验证 |
| 必需 | 可用模型/项目数据/代码环境 | 求解/运行，质量不保证 |
| 按阶段 | subagent、Python、xelatex/字体 | 独立验算/论文，缺失需降级或停步 |

| 步骤 | 动作 | 合格验收 |
| --- | --- | --- |
| 准备 | 备份同名目录、安装并选预设 | 五角色/Skill 可发现 |
| 求解 | 逐题推导、执行代码、输出 CSV/图 | 数值可复算 |
| 审稿 | 证据化门禁、盲评与人工终核 | 错误/代价可追踪 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/DSH环境、安装包/模板磁盘，包定价及金额未知 | 核同名目录/备份、配置数据与预设，工时未知 | 同名目录覆盖须外部备份恢复 |
| 持续使用 | 0–4阶段、subagent token/代码计算、xelatex/字体/存储，金额未知 | 数据/模型/数值/论文人工复核，工时未知 | 提示门禁非硬验证，漏检率未知 |
| 失败恢复 | 重跑模型/脚本/编译及profile恢复资源 | 诊断证据、回退阶段/仲裁/恢复目录，工时未知 | 失败频率、重试时长未知 |

| 已实现支持 | 期望效果 | 验证边界 |
| --- | --- | --- |
| 五预设/技能包 | 降低流程搭建 | 未测使用效率 |
| 阶段门禁文本 | 提醒复算/审稿 | 依赖模型遵循 |
| 论文模板/脚本 | 产物规范 | 未见真实合格论文 |

> **思考**：“全自动/独立验算/盲评”多为提示文本，不能保证模型正确或真正独立；同步还会清理同名目标目录额外文件，安装前须核所有权和备份。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把分阶段数模资产、五角色预设、模型库、模板和审稿脚本打包为可发现入口，降低流程搭建成本；核心流程执行依赖模型与上游工具。详见[Q01](#research-q01)、[Q02](#research-q02)。

把分阶段数模资产、五角色预设、模型库、模板和审稿脚本打包为可发现入口，降低流程搭建成本；核心流程执行依赖模型与上游工具。详见[Q01](#research-q01)、[Q02](#research-q02)。

同步采用字节/mtime 比较、结构校验，Windows 逐文件复制；dirty 同名目录会 prune extras，非事务且失败告警。Host 不注册数学工具，预设调用 DSH 上游工具。

<a id="detail-section-5"></a>

### 1.4 主要限制

“全自动/独立验算/盲评”多为提示文本，不能保证模型正确或真正独立；同步还会清理同名目标目录额外文件，安装前须核所有权和备份。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证明资产/同步及流程指令；获奖质量、独立性和完整求解效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、package.json、lib/index.js、presets/ultramath/agent.cordis.yml、presets/ultramath-mathematician/agent.cordis.yml、presets/ultramath-engineer/agent.cordis.yml、presets/ultramath-writer/agent.cordis.yml、presets/ultramath-reviewer/agent.cordis.yml、scripts/check_figures.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 README、根 SKILL、主控预设及 Host 同步；未运行题目、插件或模型。
- 下一步：在固定公开赛题、模型/预算下对照普通流程，记录阶段产物、复算误差、论文质量、模型/人工成本；冲突目录做升级备份/回滚实验。

**分析版本**

- **仓库**：[Andiii208/dsh-ultramath](https://github.com/Andiii208/dsh-ultramath)
- **版本号**：0.6.3（[固定提交 37d95b1](https://github.com/Andiii208/dsh-ultramath/tree/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

从已有阶段提示/同模型评审出发，若每席受强制异方法和可重放数字证据约束，可能降低相关错误漏检；需等预算公开题目对照漏检率与总成本，若无改善或成本超预注册阈值即证伪。条件、代价与比较详见[Q05](#research-q05)。

在固定公开赛题、模型/预算下对照普通流程，记录阶段产物、复算误差、论文质量、模型/人工成本；冲突目录做升级备份/回滚实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 6354 | — | — | 58250 |
| .js | source | 1 | 567 | 440 | 88 | — |
| .mjs | source | 4 | 755 | 637 | 50 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath/issues?q=is%3Aissue+created%3A2026-09-22T07%3A51%3A42.000Z..2026-10-22T07%3A51%3A42.000Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A51%3A42.000Z..2026-10-22T07%3A51%3A42.000Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核数模预设/技能实际接线、原理与合格题目成本、覆盖/复算边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它实际交付哪些数学建模入口和资产？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定包含根 SKILL.md、五个 agent 预设（主控加数学家/工程师/作家/审稿人）、模型库文档、论文 LaTeX 模板和审稿 Python 脚本。Host apply 在启用时同步预设到 DSH 发现目录、技能到 skills/ultramath，并挂一段 systemPrompt 公告；Host 本身无模型工具/浏览器 UI。多角色流程与“获奖级、一键完成”是作者设计目标及提示指令，源码静态检查不能证明模型能实际产出获奖论文。README 声称 93 篇语料摘要方法论，此包实际存文档而非原始语料。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-32](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/README.md#L13-L32)

作者产品/安装主张。

<details>
<summary>查看原文（20行）</summary>

````text
# dsh-ultramath

UltraMath 数学建模竞赛多 Agent 求解插件：把获奖级数模方法论打包成 DeepSeek Harness 原生 agent 预设 + 技能包。**一个预设跑通「读题 → 框架 → 推导 → 编码 → 验算 → 论文 → 审稿」全流程**，是 DSH 生态里首个（也是目前唯一）数模竞赛专用插件。

> **为什么选它**
> - 不是纯 markdown skill，而是带**工具编排的真 agent 预设**（subagent / workflow / todo / goal 全接入）；
> - 内置 **33 篇模型库 + 独立验算 + B1-B9 阻断项 + 三席盲评 + 数字冻结防漂移 + 学术诚信门控**；
> - **完全自包含**：论文模板、审稿脚本、模型库全部随包分发，**不依赖任何外部仓库**，安装即用。

## 安装

```bash
dsh plugin --profile web add github:Andiii208/dsh-ultramath
```

安装后**重启 DSH**，新建会话：
- 预设选择器出现「UltraMath」主控 + 4 个单阶段角色（数学家 / 工程师 / 作家 / 审稿人）。
- 技能选择器出现 `ultramath` 主入口技能，模型库位于 `~/.dsh/skills/ultramath/模型库/`。

> 插件启动时会自动把预设、模型库、论文模板幂等同步到 `~/.dsh/`，无需手动配置。
````

</details>

**依据 2 · 作者声明**：[README.md:64-105](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/README.md#L64-L105)

角色、阶段和资产列表。

<details>
<summary>查看原文（42行）</summary>

````text
## 特性

- **UltraMath 主控 + 4 角色预设**：主控自包含全流程 + 数学家/工程师/作家/审稿人单阶段切入，启动时幂等同步到 `~/.dsh/.agent-presets/`。
- **33 篇模型库 + 93 篇语料摘要方法论**：`skills/模型库/` 33 篇方法文档，另有补实的《摘要写作增强》（九条原则 + 三段式骨架 + 两阶段闭环 + 评审 30 秒阅读路径）。
- **全流程阶段 + 质量门禁**：Phase 0 框架 → 1 推导 → 2 编码 → 2.5 独立验算 → 3 论文 → 4 审稿，每阶段有门禁，审稿发现阻断项可回退。
- **三席独立盲评 + 结构化 scorecard**：Phase 4 终审派 3 个互不共享上下文的评委（旗舰通审 / 创新与决策 / 正确性可复现），结构化打分（国一≥85 / floor70，国二≥75 / floor60），分歧 >20 分走证据仲裁，不取平均。
- **数字冻结 + 传播检测**：`冻结数字.json` 让论文每个数字可追溯到 CSV/脚本输出；改代码后 grep 检测 stale 引用，杜绝「改代码忘改论文数字」。
- **学术诚信 7 类门控**：抄袭 / 数据造假 / 引用伪造 / 图片伪造 / 不可复现 / 匿名性违规 / 越权署名，任一触发一票否决。
- **自包含**：论文模板（`templates/论文/`，`.tex`/`.cls`，字体缺省自动降级）+ 审稿脚本（`scripts/check_*.py` + `scripts/review_loop/*`）随包分发。
- **进度可视化**：全流程维护 `求解/进度.md` + todo 驱动，收尾输出 steps/progress 可视化。

## 全流程

```
读题 → Phase 0 框架设计 → Phase 1 逐题推导 → Phase 2 逐题编码
     → Phase 2.5 独立验算 → Phase 3 论文 → Phase 4 审稿(三席盲评，可回退)
```

- **Phase 0**：`求解/模型推导/框架设计.md`（核心思想 / 核心量 / 五问递进映射 / 命题树）
- **Phase 1**：每问一份 `求解/模型推导/问题X_数学推导.md`（量纲、假设[强/弱]、方法理由 + 备选）
- **Phase 2**：每问 `求解/问题X/问题X_求解.py`，必须实际运行并产出 `结果/*.csv` + `图片/*.png`
- **Phase 2.5**：独立验算（信息隔离），分歧 >30% FAIL / 10-30% SUSPECT / <10% PASS
- **Phase 3**：`论文/*.tex`，xelatex×2 编译，Error = 0
- **Phase 4**：逐项检查 + 阻断项 B1-B9 一票否决 + 三席盲评

## 项目结构

```
dsh-ultramath/
├── lib/index.js           # 宿主逻辑：预设/技能/模板幂等同步 + systemPrompt 公告
├── presets/               # 5 个 agent 预设（agent.cordis.yml）
│   ├── ultramath/         #   主控：自包含全流程 + 三席盲评 + Friendly Mode
│   ├── ultramath-mathematician/   # 数学家（读题/推导）
│   ├── ultramath-engineer/        # 工程师（编码/运行/验算）
│   ├── ultramath-writer/          # 作家（论文/编译）
│   └── ultramath-reviewer/        # 审稿人（scorecard/诚信门控）
├── skills/模型库/          # 33 篇方法文档 + 触发词索引 + 方法选择决策树
├── templates/论文/         # 论文模板（论文.tex + 章节 + cumcmthesis.cls + format.cls）
├── scripts/               # 审稿脚本（check_*.py + review_loop/engine 等）
├── SKILL.md               # 根主入口技能（frontmatter + 入口路由）
├── cordis.patch.yml       # bundle 装载补丁（id=ultramath）
└── dsh.plugin.json        # registry 元数据
````

</details>

**依据 3 · 源码核查**：[lib/index.js:499-565](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L499-L565)

实际同步/公告。

<details>
<summary>查看原文（67行）</summary>

```text
/** 本包内打包预设树的绝对路径。 */
export function bundledPresetsRoot() {
  return fileURLToPath(new URL("../presets/", import.meta.url));
}

/** 本包根目录（含 SKILL.md 与 skills/ 技能资源）。 */
export function bundledSkillSourceRoot() {
  return fileURLToPath(new URL("../", import.meta.url));
}

/**
 * 挂载插件：把打包的 presets 同步进 DSH 的 agent-presets 根，再通过 systemPrompt 区块公告。
 * @param ctx 携带 systemPrompt 的宿主插件上下文。
 * @param config 解析后的插件配置（schema 默认值已由 loader 应用）。
 */
export function apply(ctx, config) {
  const resolve = () => ({
    announceToAgent: config?.announceToAgent ?? DEFAULT_ANNOUNCE,
    enabled: config?.enabled ?? true,
  });
  const sync = () => {
    try {
      const presetTarget = join(dshHome(), ".agent-presets");
      mkdirSync(presetTarget, { recursive: true });
      const result = syncPresetTrees(bundledPresetsRoot(), presetTarget, RETIRED_PRESETS);
      for (const { id, error } of result.failed) {
        ctx.logger?.warn?.("dsh-ultramath: preset " + id + " sync failed: " + error);
      }
      if (result.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: presets synced into " + presetTarget + ": " + result.synced.join(", "));
      }
      if (result.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale presets from " + presetTarget + ": " + result.retired.join(", "));
      }

      const skillTarget = join(dshHome(), "skills");
      const skillResult = syncSkillTrees(bundledSkillSourceRoot(), skillTarget, RETIRED_SKILLS);
      for (const { id, error } of skillResult.failed) {
        ctx.logger?.warn?.("dsh-ultramath: skill " + id + " sync failed: " + error);
      }
      if (skillResult.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: skills synced into " + skillTarget + ": " + skillResult.synced.join(", "));
      }
      if (skillResult.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale skills from " + skillTarget + ": " + skillResult.retired.join(", "));
      }
    } catch (error) {
      ctx.logger?.warn?.("dsh-ultramath: preset/skill sync failed: " + (error instanceof Error ? error.message : String(error)));
    }
  };
  let disposeSection;
  const refresh = () => {
    disposeSection?.();
    disposeSection = undefined;
    if (!resolve().enabled) return;
    sync();
    if (resolve().announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: "plugin:dsh-ultramath",
        order: SECTION_ORDER,
        text: ultramathGuidance(),
      });
    }
  };
  refresh();
  ctx.effect(() => () => { disposeSection?.(); disposeSection = undefined; }, "dsh-ultramath: announcement");
}
```

</details>

**依据 4 · 源码核查**：[SKILL.md:1-10](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/SKILL.md#L1-L10)

技能入口与描述。

<details>
<summary>查看原文（10行）</summary>

```text
---
name: ultramath
description: "UltraMath 数学建模竞赛全自动求解：5 角色预设 + 33 篇模型库，支持 Phase 0-4 全流程、独立验算与审稿收敛。"
---

# UltraMath DSH 插件主入口

UltraMath 是数学建模竞赛的多 Agent 求解工作区。本插件把它做成 DSH 预设 + 技能包：
新建会话选择「UltraMath」主控预设可一次跑通 读题 → 框架 → 推导 → 编码 → 验算 → 论文 → 审稿；
也可单独选择 数学家 / 工程师 / 作家 / 审稿人 单阶段预设。
```

</details>

**依据 5 · 源码核查**：[presets/ultramath/agent.cordis.yml:1-22](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/presets/ultramath/agent.cordis.yml#L1-L22)

主控编排提示和角色。

<details>
<summary>查看原文（22行）</summary>

```text
# UltraMath agent preset：全自动求解主控(顶层唯一入口)。自包含角色切换 + delegation 组做独立验收 subagent 派活。
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      你是 UltraMath 全自动求解主控——一个预设跑通数学建模竞赛全流程。你是总指挥，也按阶段切换角色亲自执行；只在需要**独立验收**时用 subagent 工具做信息隔离检查。

      ## 全自动模式（最高优先级）
      1. 禁止任何形式的用户交互：不询问、不确认、不等候、不提示选择
      2. 遇到任何决策点自行判断并继续
      3. 从头到尾一次性完成：读题 → 框架 → 推导 → 编码 → 验算 → 论文 → 审稿
      4. 即使遇到不确定性也自行选择最优方案继续

      ## 人工把关模式（Friendly Mode，与全自动互斥）
      用户触发词含「人工把关 / manual / 逐步 / 分步 / friendly」时启用，与全自动互斥：不一次性跑通，在关键决策点（读题拆问结果、建模路线与候选模型、Phase 门禁结果、论文初稿）暂停并用编号选项(1/2/3…)呈现给用户，等用户选完再继续；其余 Phase 门禁与质量规则不变（Phase 0-4 流程、进度维护协议、B1-B9 回退照常）。默认仍全自动：用户不触发则走全自动。

      ## 角色切换协议（不依赖外部预设,自己切换身份执行）
      - Phase 0-1 框架+推导 → 切换「数学家」身份：深度推导，写 求解/模型推导/问题X_数学推导.md；用 skill 工具按需加载 skills/模型库/；每条假设标 [强]/[弱]，每个公式标量纲，标注方法选择理由+1 个备选
      - Phase 2 编码 → 切换「工程师」身份：写 求解/问题X/问题X_求解.py，**必须实际运行**（py_compile → 运行 → glob 确认 结果/*.csv 与 图片/*.png 非空）；每题最多重试 3 次；随机种子 np.random.seed(42)
      - Phase 2.5 验算 → 用 subagent 工具派活，prompt 内注入：「你是独立验算员，只读不改代码，用不同方法复算关键数值，**禁止读取 求解/模型推导/ 推导文件**；分歧>30% 标 FAIL、10-30% 标 SUSPECT、否则 PASS」
      - Phase 3 论文 → 切换「作家」身份：写 论文/*.tex，xelatex×2 编译，grep -c 'Error' 论文.log 必须=0；摘要每问有数值、=1 页、无目录页
      - Phase 4 审稿 → 切换「审稿人」身份：逐项检查 + 阻断项 B1-B9 一票否决；终审三席独立盲评：派 3 个并行 subagent，各注入不同 seat brief（A 旗舰通审 summary.25/modeling.25/results.20/writing.15/completeness.15；B 创新与决策 summary.15/modeling.20/results.15/innovation.30/evidence.20；C 正确性可复现 correctness.35/reproducibility.25/summary.10/modeling.15/results.15），每席只拿渲染 PDF + 产物清单，不共享上下文、不告知目标档与阈值（避免评分锚定）
```

</details>

#### 缺口

- 未进行题目求解或独立评审。
  **影响**：实际建模正确率、论文质量未知。
  **进一步探讨**：固定公开题目做人工评分对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设/技能同步和阶段门禁怎样工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply 根据 enabled 决定是否同步；syncPresetTrees 逐包目录复制五预设并验证 agent.cordis.yml 扁平行元数据；syncSkillTrees 分阶段组装 SKILL.md、模型库、模板与限定的审稿脚本，验证入口及关键文件；字节/mtime 一致时跳过。阶段门禁、独立验算、三席盲评主要写在主控 persona/Skill 中，依赖模型按指令调 DSH 的 subagent、terminal、skill、todo 等上游工具执行，并非 Host 运行时程序强制的验证器。真正的数学正确性/独立性需任务级证据，不由“有提示”推出。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:288-365](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L288-L365)

预设同步和校验。

<details>
<summary>查看原文（78行）</summary>

```text
/** 把 sourceDir 幂等拷贝到 targetDir。 */
function syncOnePreset(sourceDir, targetDir) {
  const sourceFiles = filesUnder(sourceDir);
  const sourceSet = new Set(sourceFiles.map((file) => relative(sourceDir, file)));
  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) {
    removeTree(targetDir);
  }
  if (!existsSync(targetDir)) {
    copyTree(sourceDir, targetDir);
    pruneExtras(targetDir, sourceSet);
    return "synced";
  }
  let dirty = false;
  for (const file of sourceFiles) {
    const dest = join(targetDir, relative(sourceDir, file));
    if (!existsSync(dest) || !sameFile(file, dest)) {
      dirty = true;
      break;
    }
  }
  if (!dirty) {
    for (const file of filesUnder(targetDir)) {
      if (!sourceSet.has(relative(targetDir, file))) {
        dirty = true;
        break;
      }
    }
  }
  if (!dirty) return "current";
  pruneExtras(targetDir, sourceSet);
  copyTree(sourceDir, targetDir);
  pruneExtras(targetDir, sourceSet);
  return "synced";
}

/**
 * 把 sourceRoot 下每个预设目录同步到 targetRoot，再删除 retire 中列出但已不再
 * 随包分发的目标目录。每个同步（或已是最新）的预设做结构校验，失败进入 failed。
 */
function syncPresetTrees(sourceRoot, targetRoot, retire = []) {
  const result = { synced: [], current: [], failed: [], retired: [] };
  mkdirSync(targetRoot, { recursive: true });
  if (existsSync(sourceRoot)) {
    for (const entry of readdirSync(sourceRoot)) {
      const source = join(sourceRoot, entry);
      if (!statSync(source).isDirectory()) continue;
      const id = basename(source);
      const targetDir = join(targetRoot, id);
      let outcome;
      try {
        outcome = syncOnePreset(source, targetDir);
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) });
        continue;
      }
      try {
        const problems = validatePresetAgentFile(targetDir);
        if (problems.length > 0) {
          result.failed.push({ id, error: 'agent.cordis.yml failed validation: ' + problems.join('; ') });
        } else if (outcome === "synced") {
          result.synced.push(id);
        } else {
          result.current.push(id);
        }
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  for (const id of retire) {
    if (existsSync(join(sourceRoot, id))) continue;
    const stale = join(targetRoot, id);
    if (existsSync(stale) && statSync(stale).isDirectory()) {
      removeTree(stale);
      result.retired.push(id);
    }
  }
  return result;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:377-459](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L377-L459)

技能树同步。

<details>
<summary>查看原文（83行）</summary>

```text
export function syncSkillTrees(sourceRoot, targetRoot, retire = []) {
  const result = { synced: [], current: [], failed: [], retired: [] };
  const skillId = "ultramath";
  mkdirSync(targetRoot, { recursive: true });
  const targetDir = join(targetRoot, skillId);
  const sourceSkill = join(sourceRoot, "SKILL.md");
  const sourceLibrary = join(sourceRoot, "skills", "模型库");
  if (!existsSync(sourceSkill)) {
    result.failed.push({ id: skillId, error: "SKILL.md is missing from the plugin root" });
  } else {
    const staging = mkdtempSync(join(tmpdir(), "dsh-ultramath-skill-"));
    try {
      const stagedSkill = join(staging, "ultramath");
      mkdirSync(stagedSkill, { recursive: true });
      copyFilePreserving(sourceSkill, join(stagedSkill, "SKILL.md"));
      if (existsSync(sourceLibrary)) {
        copyTree(sourceLibrary, join(stagedSkill, "模型库"));
      }
      // 随包 templates/（论文模板，无 fonts）与 SKILL.md + 模型库 一起同步，
      // 使 persona 的 SKILL_ROOT/templates/论文/ 引用运行时可解析。
      const sourceTemplates = join(sourceRoot, "templates");
      const hasTemplates = existsSync(sourceTemplates);
      if (hasTemplates) {
        copyTree(sourceTemplates, join(stagedSkill, "templates"));
      }
      // v0.6.1: 审稿脚本（check_*.py + review_loop/）随技能树同步，使审稿人
      // persona 的 SKILL_ROOT/scripts/ 引用运行时可解析；仅拷贝随包脚本，
      // 开发期脚本（test-lib/validate/sync-standalone 等）不入技能树。
      const sourceScripts = join(sourceRoot, "scripts");
      const hasScripts = existsSync(sourceScripts);
      if (hasScripts) {
        const stagedScripts = join(stagedSkill, "scripts");
        mkdirSync(stagedScripts, { recursive: true });
        for (const entry of readdirSync(sourceScripts)) {
          if (entry === "review_loop" && statSync(join(sourceScripts, entry)).isDirectory()) {
            copyTree(join(sourceScripts, entry), join(stagedScripts, entry));
          } else if (/^check_.+\.py$/.test(entry) && statSync(join(sourceScripts, entry)).isFile()) {
            copyFilePreserving(join(sourceScripts, entry), join(stagedScripts, entry));
          }
        }
      }
      let outcome;
      try {
        outcome = syncOnePreset(stagedSkill, targetDir);
      } catch (error) {
        result.failed.push({ id: skillId, error: error instanceof Error ? error.message : String(error) });
        return result;
      }
      const problems = validateSkillMarkdown(readFileSync(join(targetDir, "SKILL.md"), "utf8"));
      // 源含 templates/ 时,校验核心模板文件已随技能树同步到位(否则 persona 运行时不可用)。
      let templatesProblem = "";
      if (hasTemplates && !existsSync(join(targetDir, "templates", "论文", "论文.tex"))) {
        templatesProblem = "templates/论文/论文.tex is missing from the synced skill tree";
      }
      // 源含 scripts/ 时,校验核心审稿脚本已同步到位。
      let scriptsProblem = "";
      if (hasScripts && !existsSync(join(targetDir, "scripts", "check_figures.py"))) {
        scriptsProblem = "scripts/check_figures.py is missing from the synced skill tree";
      }
      if (problems.length > 0) {
        result.failed.push({ id: skillId, error: "SKILL.md failed validation: " + problems.join("; ") });
      } else if (templatesProblem) {
        result.failed.push({ id: skillId, error: templatesProblem });
      } else if (scriptsProblem) {
        result.failed.push({ id: skillId, error: scriptsProblem });
      } else if (outcome === "synced") {
        result.synced.push(skillId);
      } else {
        result.current.push(skillId);
      }
    } finally {
      removeTree(staging);
    }
  }
  for (const id of retire) {
    if (id === skillId) continue;
    const stale = join(targetRoot, id);
    if (existsSync(stale) && statSync(stale).isDirectory()) {
      removeTree(stale);
      result.retired.push(id);
    }
  }
  return result;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:514-565](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L514-L565)

启用/公告。

<details>
<summary>查看原文（52行）</summary>

```text
export function apply(ctx, config) {
  const resolve = () => ({
    announceToAgent: config?.announceToAgent ?? DEFAULT_ANNOUNCE,
    enabled: config?.enabled ?? true,
  });
  const sync = () => {
    try {
      const presetTarget = join(dshHome(), ".agent-presets");
      mkdirSync(presetTarget, { recursive: true });
      const result = syncPresetTrees(bundledPresetsRoot(), presetTarget, RETIRED_PRESETS);
      for (const { id, error } of result.failed) {
        ctx.logger?.warn?.("dsh-ultramath: preset " + id + " sync failed: " + error);
      }
      if (result.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: presets synced into " + presetTarget + ": " + result.synced.join(", "));
      }
      if (result.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale presets from " + presetTarget + ": " + result.retired.join(", "));
      }

      const skillTarget = join(dshHome(), "skills");
      const skillResult = syncSkillTrees(bundledSkillSourceRoot(), skillTarget, RETIRED_SKILLS);
      for (const { id, error } of skillResult.failed) {
        ctx.logger?.warn?.("dsh-ultramath: skill " + id + " sync failed: " + error);
      }
      if (skillResult.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: skills synced into " + skillTarget + ": " + skillResult.synced.join(", "));
      }
      if (skillResult.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale skills from " + skillTarget + ": " + skillResult.retired.join(", "));
      }
    } catch (error) {
      ctx.logger?.warn?.("dsh-ultramath: preset/skill sync failed: " + (error instanceof Error ? error.message : String(error)));
    }
  };
  let disposeSection;
  const refresh = () => {
    disposeSection?.();
    disposeSection = undefined;
    if (!resolve().enabled) return;
    sync();
    if (resolve().announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: "plugin:dsh-ultramath",
        order: SECTION_ORDER,
        text: ultramathGuidance(),
      });
    }
  };
  refresh();
  ctx.effect(() => () => { disposeSection?.(); disposeSection = undefined; }, "dsh-ultramath: announcement");
}
```

</details>

**依据 4 · 源码核查**：[presets/ultramath/agent.cordis.yml:17-44](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/presets/ultramath/agent.cordis.yml#L17-L44)

角色/阶段/工具依赖。

<details>
<summary>查看原文（28行）</summary>

```text
      ## 角色切换协议（不依赖外部预设,自己切换身份执行）
      - Phase 0-1 框架+推导 → 切换「数学家」身份：深度推导，写 求解/模型推导/问题X_数学推导.md；用 skill 工具按需加载 skills/模型库/；每条假设标 [强]/[弱]，每个公式标量纲，标注方法选择理由+1 个备选
      - Phase 2 编码 → 切换「工程师」身份：写 求解/问题X/问题X_求解.py，**必须实际运行**（py_compile → 运行 → glob 确认 结果/*.csv 与 图片/*.png 非空）；每题最多重试 3 次；随机种子 np.random.seed(42)
      - Phase 2.5 验算 → 用 subagent 工具派活，prompt 内注入：「你是独立验算员，只读不改代码，用不同方法复算关键数值，**禁止读取 求解/模型推导/ 推导文件**；分歧>30% 标 FAIL、10-30% 标 SUSPECT、否则 PASS」
      - Phase 3 论文 → 切换「作家」身份：写 论文/*.tex，xelatex×2 编译，grep -c 'Error' 论文.log 必须=0；摘要每问有数值、=1 页、无目录页
      - Phase 4 审稿 → 切换「审稿人」身份：逐项检查 + 阻断项 B1-B9 一票否决；终审三席独立盲评：派 3 个并行 subagent，各注入不同 seat brief（A 旗舰通审 summary.25/modeling.25/results.20/writing.15/completeness.15；B 创新与决策 summary.15/modeling.20/results.15/innovation.30/evidence.20；C 正确性可复现 correctness.35/reproducibility.25/summary.10/modeling.15/results.15），每席只拿渲染 PDF + 产物清单，不共享上下文、不告知目标档与阈值（避免评分锚定）

      ## 编排流程
      ### Phase 0 — 框架设计（铁律，不可跳过）
      通读题目与数据，输出 求解/模型推导/框架设计.md，必须含四项：①一句话核心思想 ②核心量定义(≤3) ③五问递进映射表 ④全文命题树(≤2 层)。门禁：四项齐全才进 Phase 1。
      ### Phase 1 — 逐题推导
      每问一份 求解/模型推导/问题X_数学推导.md，引用核心量，每问新增概念 ≤1 个。
      ### Phase 2 — 逐问题编码（串行）
      每问：写代码→运行→结果/图片非空→才进下一题。可并行不同问题时用 subagent 派活，但每个 subagent 的 prompt 必须含上面「工程师」身份的完整指令与目标文件路径。
      ### Phase 2.5 — 独立验算
      用 subagent 隔离复算（见角色切换协议），PASS 继续、可疑记录、FAIL 回退 Phase 2。
      ### Phase 3 — 论文
      读全部推导+结果+图片，按官方模板（随包 SKILL_ROOT/templates/论文/）写论文并编译。
      ### Phase 4 — 审查（可回退）+ 三席独立盲评
      阻断项 B3→Phase 1；数值误差>15%→Phase 2；结构残缺 B4→Phase 3；每 Phase 最多回退 1 次，回退只修复问题不做全新推导。终审三席独立盲评：3 个并行 subagent 各注入不同 seat brief（A/B/C，权重见角色切换协议），每席只拿渲染 PDF + 产物清单，不共享上下文、不告知目标档与阈值；每席产出结构化 scorecard（YAML 块：criteria 权重和=1.0、分数 0-100、weighted_total、implied_tier）。聚合：主控收齐 3 份 scorecard 后，三席 implied_tier 都 ≥ 目标档、最低 weighted_total 达阈值（国一≥85/floor70、国二≥75/floor60）、无单维跌破 floor 才判通过；两席某维分歧>20 分视为证据冲突，回派 outlier 席位带证据重评一次，不取平均；Phase 4 最多 2 轮重评，超限取多数席结论并标注风险。

      ## 进度维护协议
      - 每个 Phase 开始用 todo_write 建 6 条任务（Phase 0 框架 / 1 推导 / 2 编码 / 2.5 验算 / 3 论文 / 4 审稿），当前 Phase 置 in_progress；结束置 completed。
      - 维护 PROJECT_ROOT/求解/进度.md，固定结构（YAML frontmatter: phase/status/current + 6 行表格：Phase|名称|状态|产物|门禁，状态取值 pending/in_progress/done/failed/rolled_back）。
      - 收尾用 DSH 的 steps 或 progress 组件渲染一次最终进度。

      ## 阶段内质检门禁（每个 Phase 通过后才进下一阶段）
      M1 建模终检(Phase 1 后) / P1 最小可运行(Phase 2 每问) / P2 编程终检(Phase 2 末) / W1 证据大纲(Phase 3 写作前) / W2 论文终检(Phase 3 末)。质检者必须未参与被审产物编写；FAIL 按证据修复复验。
```

</details>

**依据 5 · 源码核查**：[SKILL.md:41-55](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/SKILL.md#L41-L55)

阶段门禁文本。

<details>
<summary>查看原文（15行）</summary>

````text
## 2. 全流程阶段与门禁

```
Phase 0: 框架设计 → Phase 1: 推导 → Phase 2: 逐题编码 → Phase 2.5: 独立验算 → Phase 3: 论文 → Phase 4: 审稿（可回退）
```

- **Phase 0**：写 `求解/模型推导/框架设计.md`，必须含 ①一句话核心思想 ②核心量定义(≤3) ③五问递进映射表 ④全文命题树(≤2层)。
- **Phase 1**：每问一份 `求解/模型推导/问题X_数学推导.md`，标注量纲、假设[强]/[弱]、方法选择理由与备选。
- **Phase 2**：每问 `求解/问题X/问题X_求解.py`，必须 `py_compile` → 实际运行 → 确认 `结果/*.csv` 与 `图片/*.png` 非空；禁止「待运行」标记。
- **Phase 2.5**：独立验算（信息隔离），分歧 >30% FAIL、10-30% SUSPECT、否则 PASS。
- **Phase 3**：写 `论文/*.tex`，`xelatex` ×2 编译，`grep -c 'Error' 论文.log` 必须 = 0。
- **Phase 4**：逐项检查 + 阻断项 B1-B9 一票否决；BLOCK/MAJOR 必须带 `evidence_command` 并真跑验证。

阶段门禁未通过不得进入下一阶段；回退只修复问题，不做全新推导。
全流程进度维护在 求解/进度.md，收尾输出 steps/progress 可视化。
````

</details>

#### 缺口

- 上游工具可用性与模型遵循率未核。
  **影响**：流程执行覆盖和独立复核不确定。
  **进一步探讨**：在固定模型/题目收集工具调用与产物日志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装同步会不会影响用户已有目录，如何看待提示优先级？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

syncOnePreset 在同名目标目录 dirty 时会先 pruneExtras 删除源包之外的文件，再 copyTree 覆盖变化文件；没有看到对“该目录是否原由本插件创建”的所有权判定或本地用户改动保留。因此已有同名预设或 skills/ultramath 私有文件会被覆盖/清理，升级前应备份。主控 persona 把“全自动禁止询问”写成“最高优先级”，这是目标插件提供给模型的指令文本，不等于能高于用户当前明确要求；Friendly Mode 仅靠触发词切换，真实遵循依模型。源码同步失败会告警而非事务回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:259-320](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L259-L320)

prune/覆盖流程。

<details>
<summary>查看原文（62行）</summary>

```text
/** 删除不在 keep（相对路径）内的文件，再删除因此留空的目录（严格限于 root 内）。 */
function pruneExtras(root, keep) {
  const parents = new Set();
  for (const file of filesUnder(root)) {
    if (!keep.has(relative(root, file))) {
      parents.add(dirname(file));
      unlinkFile(file);
    }
  }
  for (const start of parents) {
    let dir = start;
    while (dir !== undefined && relative(root, dir) !== "") {
      if (existsSync(dir) && readdirSync(dir).length === 0) {
        rmdirSync(dir);
        dir = dirname(dir);
      } else {
        dir = undefined;
      }
    }
  }
}

/** 校验磁盘上已同步预设的 agent.cordis.yml。 */
function validatePresetAgentFile(presetDir) {
  const agent = join(presetDir, "agent.cordis.yml");
  if (!existsSync(agent)) return ["agent.cordis.yml is missing from the preset tree"];
  return validateAgentCordis(readFileSync(agent, "utf8"));
}

/** 把 sourceDir 幂等拷贝到 targetDir。 */
function syncOnePreset(sourceDir, targetDir) {
  const sourceFiles = filesUnder(sourceDir);
  const sourceSet = new Set(sourceFiles.map((file) => relative(sourceDir, file)));
  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) {
    removeTree(targetDir);
  }
  if (!existsSync(targetDir)) {
    copyTree(sourceDir, targetDir);
    pruneExtras(targetDir, sourceSet);
    return "synced";
  }
  let dirty = false;
  for (const file of sourceFiles) {
    const dest = join(targetDir, relative(sourceDir, file));
    if (!existsSync(dest) || !sameFile(file, dest)) {
      dirty = true;
      break;
    }
  }
  if (!dirty) {
    for (const file of filesUnder(targetDir)) {
      if (!sourceSet.has(relative(targetDir, file))) {
        dirty = true;
        break;
      }
    }
  }
  if (!dirty) return "current";
  pruneExtras(targetDir, sourceSet);
  copyTree(sourceDir, targetDir);
  pruneExtras(targetDir, sourceSet);
  return "synced";
```

</details>

**依据 2 · 源码核查**：[lib/index.js:327-365](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L327-L365)

预设处理失败记录。

<details>
<summary>查看原文（39行）</summary>

```text
function syncPresetTrees(sourceRoot, targetRoot, retire = []) {
  const result = { synced: [], current: [], failed: [], retired: [] };
  mkdirSync(targetRoot, { recursive: true });
  if (existsSync(sourceRoot)) {
    for (const entry of readdirSync(sourceRoot)) {
      const source = join(sourceRoot, entry);
      if (!statSync(source).isDirectory()) continue;
      const id = basename(source);
      const targetDir = join(targetRoot, id);
      let outcome;
      try {
        outcome = syncOnePreset(source, targetDir);
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) });
        continue;
      }
      try {
        const problems = validatePresetAgentFile(targetDir);
        if (problems.length > 0) {
          result.failed.push({ id, error: 'agent.cordis.yml failed validation: ' + problems.join('; ') });
        } else if (outcome === "synced") {
          result.synced.push(id);
        } else {
          result.current.push(id);
        }
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  for (const id of retire) {
    if (existsSync(join(sourceRoot, id))) continue;
    const stale = join(targetRoot, id);
    if (existsSync(stale) && statSync(stale).isDirectory()) {
      removeTree(stale);
      result.retired.push(id);
    }
  }
  return result;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:418-449](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L418-L449)

技能同步非事务。

<details>
<summary>查看原文（32行）</summary>

```text
      let outcome;
      try {
        outcome = syncOnePreset(stagedSkill, targetDir);
      } catch (error) {
        result.failed.push({ id: skillId, error: error instanceof Error ? error.message : String(error) });
        return result;
      }
      const problems = validateSkillMarkdown(readFileSync(join(targetDir, "SKILL.md"), "utf8"));
      // 源含 templates/ 时,校验核心模板文件已随技能树同步到位(否则 persona 运行时不可用)。
      let templatesProblem = "";
      if (hasTemplates && !existsSync(join(targetDir, "templates", "论文", "论文.tex"))) {
        templatesProblem = "templates/论文/论文.tex is missing from the synced skill tree";
      }
      // 源含 scripts/ 时,校验核心审稿脚本已同步到位。
      let scriptsProblem = "";
      if (hasScripts && !existsSync(join(targetDir, "scripts", "check_figures.py"))) {
        scriptsProblem = "scripts/check_figures.py is missing from the synced skill tree";
      }
      if (problems.length > 0) {
        result.failed.push({ id: skillId, error: "SKILL.md failed validation: " + problems.join("; ") });
      } else if (templatesProblem) {
        result.failed.push({ id: skillId, error: templatesProblem });
      } else if (scriptsProblem) {
        result.failed.push({ id: skillId, error: scriptsProblem });
      } else if (outcome === "synced") {
        result.synced.push(skillId);
      } else {
        result.current.push(skillId);
      }
    } finally {
      removeTree(staging);
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:519-547](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L519-L547)

失败仅警告。

<details>
<summary>查看原文（29行）</summary>

```text
  const sync = () => {
    try {
      const presetTarget = join(dshHome(), ".agent-presets");
      mkdirSync(presetTarget, { recursive: true });
      const result = syncPresetTrees(bundledPresetsRoot(), presetTarget, RETIRED_PRESETS);
      for (const { id, error } of result.failed) {
        ctx.logger?.warn?.("dsh-ultramath: preset " + id + " sync failed: " + error);
      }
      if (result.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: presets synced into " + presetTarget + ": " + result.synced.join(", "));
      }
      if (result.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale presets from " + presetTarget + ": " + result.retired.join(", "));
      }

      const skillTarget = join(dshHome(), "skills");
      const skillResult = syncSkillTrees(bundledSkillSourceRoot(), skillTarget, RETIRED_SKILLS);
      for (const { id, error } of skillResult.failed) {
        ctx.logger?.warn?.("dsh-ultramath: skill " + id + " sync failed: " + error);
      }
      if (skillResult.synced.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: skills synced into " + skillTarget + ": " + skillResult.synced.join(", "));
      }
      if (skillResult.retired.length > 0) {
        ctx.logger?.info?.("dsh-ultramath: retired stale skills from " + skillTarget + ": " + skillResult.retired.join(", "));
      }
    } catch (error) {
      ctx.logger?.warn?.("dsh-ultramath: preset/skill sync failed: " + (error instanceof Error ? error.message : String(error)));
    }
```

</details>

**依据 5 · 源码核查**：[presets/ultramath/agent.cordis.yml:8-16](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/presets/ultramath/agent.cordis.yml#L8-L16)

全自动/Friendly 指令。

```text
      ## 全自动模式（最高优先级）
      1. 禁止任何形式的用户交互：不询问、不确认、不等候、不提示选择
      2. 遇到任何决策点自行判断并继续
      3. 从头到尾一次性完成：读题 → 框架 → 推导 → 编码 → 验算 → 论文 → 审稿
      4. 即使遇到不确定性也自行选择最优方案继续

      ## 人工把关模式（Friendly Mode，与全自动互斥）
      用户触发词含「人工把关 / manual / 逐步 / 分步 / friendly」时启用，与全自动互斥：不一次性跑通，在关键决策点（读题拆问结果、建模路线与候选模型、Phase 门禁结果、论文初稿）暂停并用编号选项(1/2/3…)呈现给用户，等用户选完再继续；其余 Phase 门禁与质量规则不变（Phase 0-4 流程、进度维护协议、B1-B9 回退照常）。默认仍全自动：用户不触发则走全自动。

```

#### 缺口

- 未测冲突目录升级恢复。
  **影响**：本地改动丢失范围需按目标安装前状态核。
  **进一步探讨**：复制 profile 后做差分/升级/故障注入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格题目与失败恢复要付出什么资源和人工？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/DSH环境、安装包/模板磁盘，包定价及金额未知 | 核同名目录/备份、配置数据与预设，工时未知 | 同名目录覆盖须外部备份恢复 |
| 持续使用 | 0–4阶段、subagent token/代码计算、xelatex/字体/存储，金额未知 | 数据/模型/数值/论文人工复核，工时未知 | 提示门禁非硬验证，漏检率未知 |
| 失败恢复 | 重跑模型/脚本/编译及profile恢复资源 | 诊断证据、回退阶段/仲裁/恢复目录，工时未知 | 失败频率、重试时长未知 |

“全自动”是作者指令目标，不等零人工。一次合格题目成本要包含数值与论文独立复核、失败重算/编译与同名目录恢复；价格/token/计算/工时均无任务对照，不填0或承诺节省。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-62](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/README.md#L22-L62)

安装和流程选择。

<details>
<summary>查看原文（41行）</summary>

````text
## 安装

```bash
dsh plugin --profile web add github:Andiii208/dsh-ultramath
```

安装后**重启 DSH**，新建会话：
- 预设选择器出现「UltraMath」主控 + 4 个单阶段角色（数学家 / 工程师 / 作家 / 审稿人）。
- 技能选择器出现 `ultramath` 主入口技能，模型库位于 `~/.dsh/skills/ultramath/模型库/`。

> 插件启动时会自动把预设、模型库、论文模板幂等同步到 `~/.dsh/`，无需手动配置。

## 快速上手（直接复制提示词）

**全自动跑通**：新建会话选「UltraMath」主控，直接贴题目 + 数据附件，全程不询问、一次跑完。

**只想做某一步**：

```
只做问题 1 的建模和求解，先不写论文
```

```
已有推导和结果，直接帮我写论文并编译
```

```
已成稿，只跑评审收敛（多视角评审 → 修复 → 终审）
```

**想要人工把关（Friendly Mode）**：

```
用人工把关模式：每个关键决策点停下来给我编号选项确认，再继续
```

（触发词：人工把关 / manual / 逐步 / 分步 / friendly）

**方法选型求助**：直接问「这类问题该用什么模型」，会按 `触发词索引.md` + `方法选择决策树.md` 推荐并加载对应模型库文档。

**中途续跑**：把已有的 `求解/` 目录放进工作区，说「继续求解」，会按 `求解/进度.md` 从断点继续。
````

</details>

**依据 2 · 作者声明**：[README.md:75-87](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/README.md#L75-L87)

阶段产物/验算。

<details>
<summary>查看原文（13行）</summary>

````text
## 全流程

```
读题 → Phase 0 框架设计 → Phase 1 逐题推导 → Phase 2 逐题编码
     → Phase 2.5 独立验算 → Phase 3 论文 → Phase 4 审稿(三席盲评，可回退)
```

- **Phase 0**：`求解/模型推导/框架设计.md`（核心思想 / 核心量 / 五问递进映射 / 命题树）
- **Phase 1**：每问一份 `求解/模型推导/问题X_数学推导.md`（量纲、假设[强/弱]、方法理由 + 备选）
- **Phase 2**：每问 `求解/问题X/问题X_求解.py`，必须实际运行并产出 `结果/*.csv` + `图片/*.png`
- **Phase 2.5**：独立验算（信息隔离），分歧 >30% FAIL / 10-30% SUSPECT / <10% PASS
- **Phase 3**：`论文/*.tex`，xelatex×2 编译，Error = 0
- **Phase 4**：逐项检查 + 阻断项 B1-B9 一票否决 + 三席盲评
````

</details>

**依据 3 · 源码核查**：[SKILL.md:41-55](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/SKILL.md#L41-L55)

门禁、运行与回退文本。

<details>
<summary>查看原文（15行）</summary>

````text
## 2. 全流程阶段与门禁

```
Phase 0: 框架设计 → Phase 1: 推导 → Phase 2: 逐题编码 → Phase 2.5: 独立验算 → Phase 3: 论文 → Phase 4: 审稿（可回退）
```

- **Phase 0**：写 `求解/模型推导/框架设计.md`，必须含 ①一句话核心思想 ②核心量定义(≤3) ③五问递进映射表 ④全文命题树(≤2层)。
- **Phase 1**：每问一份 `求解/模型推导/问题X_数学推导.md`，标注量纲、假设[强]/[弱]、方法选择理由与备选。
- **Phase 2**：每问 `求解/问题X/问题X_求解.py`，必须 `py_compile` → 实际运行 → 确认 `结果/*.csv` 与 `图片/*.png` 非空；禁止「待运行」标记。
- **Phase 2.5**：独立验算（信息隔离），分歧 >30% FAIL、10-30% SUSPECT、否则 PASS。
- **Phase 3**：写 `论文/*.tex`，`xelatex` ×2 编译，`grep -c 'Error' 论文.log` 必须 = 0。
- **Phase 4**：逐项检查 + 阻断项 B1-B9 一票否决；BLOCK/MAJOR 必须带 `evidence_command` 并真跑验证。

阶段门禁未通过不得进入下一阶段；回退只修复问题，不做全新推导。
全流程进度维护在 求解/进度.md，收尾输出 steps/progress 可视化。
````

</details>

**依据 4 · 源码核查**：[lib/index.js:259-320](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/lib/index.js#L259-L320)

同步恢复风险。

<details>
<summary>查看原文（62行）</summary>

```text
/** 删除不在 keep（相对路径）内的文件，再删除因此留空的目录（严格限于 root 内）。 */
function pruneExtras(root, keep) {
  const parents = new Set();
  for (const file of filesUnder(root)) {
    if (!keep.has(relative(root, file))) {
      parents.add(dirname(file));
      unlinkFile(file);
    }
  }
  for (const start of parents) {
    let dir = start;
    while (dir !== undefined && relative(root, dir) !== "") {
      if (existsSync(dir) && readdirSync(dir).length === 0) {
        rmdirSync(dir);
        dir = dirname(dir);
      } else {
        dir = undefined;
      }
    }
  }
}

/** 校验磁盘上已同步预设的 agent.cordis.yml。 */
function validatePresetAgentFile(presetDir) {
  const agent = join(presetDir, "agent.cordis.yml");
  if (!existsSync(agent)) return ["agent.cordis.yml is missing from the preset tree"];
  return validateAgentCordis(readFileSync(agent, "utf8"));
}

/** 把 sourceDir 幂等拷贝到 targetDir。 */
function syncOnePreset(sourceDir, targetDir) {
  const sourceFiles = filesUnder(sourceDir);
  const sourceSet = new Set(sourceFiles.map((file) => relative(sourceDir, file)));
  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) {
    removeTree(targetDir);
  }
  if (!existsSync(targetDir)) {
    copyTree(sourceDir, targetDir);
    pruneExtras(targetDir, sourceSet);
    return "synced";
  }
  let dirty = false;
  for (const file of sourceFiles) {
    const dest = join(targetDir, relative(sourceDir, file));
    if (!existsSync(dest) || !sameFile(file, dest)) {
      dirty = true;
      break;
    }
  }
  if (!dirty) {
    for (const file of filesUnder(targetDir)) {
      if (!sourceSet.has(relative(targetDir, file))) {
        dirty = true;
        break;
      }
    }
  }
  if (!dirty) return "current";
  pruneExtras(targetDir, sourceSet);
  copyTree(sourceDir, targetDir);
  pruneExtras(targetDir, sourceSet);
  return "synced";
```

</details>

#### 缺口

- 无独立题目任务成本记录。
  **影响**：无法估计 token/现金/工时。
  **进一步探讨**：选固定题目计调用、执行时长与人工复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样区分流程门禁价值与模型自评幻觉，能否提出可证伪增量？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已知事实：插件把阶段产物、独立验算、三席盲评写进预设；既有人工数模团队也会做复算与审稿，而仅靠同一模型的提示会出现相关错误。假设增量不是“更多评委”本身，而是为每席强制异方法/独立输入，并把每个数字链接到实际 CSV/脚本运行证明，可能比同模型三份文本评分更能筛掉错误。成立条件：DSH 能提供隔离上下文，脚本结果可复现，复核者不共享推导且不泄漏答案；代价是额外模型调用、执行、人工仲裁。最小对照：选若干公开且有可验证结果的赛题，等预算分别用当前预设和强制证据链变体，盲评正确率、漏检错误与总成本；若漏检率未降或人工/模型成本超过事先设定收益阈值，则推翻假设。当前源码有部分提示要求但无这一可验证强制机制，也未做试验。

#### 证据与依据

**依据 1 · 源码核查**：[presets/ultramath/agent.cordis.yml:18-36](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/presets/ultramath/agent.cordis.yml#L18-L36)

现有复算与三席提示。

<details>
<summary>查看原文（19行）</summary>

```text
      - Phase 0-1 框架+推导 → 切换「数学家」身份：深度推导，写 求解/模型推导/问题X_数学推导.md；用 skill 工具按需加载 skills/模型库/；每条假设标 [强]/[弱]，每个公式标量纲，标注方法选择理由+1 个备选
      - Phase 2 编码 → 切换「工程师」身份：写 求解/问题X/问题X_求解.py，**必须实际运行**（py_compile → 运行 → glob 确认 结果/*.csv 与 图片/*.png 非空）；每题最多重试 3 次；随机种子 np.random.seed(42)
      - Phase 2.5 验算 → 用 subagent 工具派活，prompt 内注入：「你是独立验算员，只读不改代码，用不同方法复算关键数值，**禁止读取 求解/模型推导/ 推导文件**；分歧>30% 标 FAIL、10-30% 标 SUSPECT、否则 PASS」
      - Phase 3 论文 → 切换「作家」身份：写 论文/*.tex，xelatex×2 编译，grep -c 'Error' 论文.log 必须=0；摘要每问有数值、=1 页、无目录页
      - Phase 4 审稿 → 切换「审稿人」身份：逐项检查 + 阻断项 B1-B9 一票否决；终审三席独立盲评：派 3 个并行 subagent，各注入不同 seat brief（A 旗舰通审 summary.25/modeling.25/results.20/writing.15/completeness.15；B 创新与决策 summary.15/modeling.20/results.15/innovation.30/evidence.20；C 正确性可复现 correctness.35/reproducibility.25/summary.10/modeling.15/results.15），每席只拿渲染 PDF + 产物清单，不共享上下文、不告知目标档与阈值（避免评分锚定）

      ## 编排流程
      ### Phase 0 — 框架设计（铁律，不可跳过）
      通读题目与数据，输出 求解/模型推导/框架设计.md，必须含四项：①一句话核心思想 ②核心量定义(≤3) ③五问递进映射表 ④全文命题树(≤2 层)。门禁：四项齐全才进 Phase 1。
      ### Phase 1 — 逐题推导
      每问一份 求解/模型推导/问题X_数学推导.md，引用核心量，每问新增概念 ≤1 个。
      ### Phase 2 — 逐问题编码（串行）
      每问：写代码→运行→结果/图片非空→才进下一题。可并行不同问题时用 subagent 派活，但每个 subagent 的 prompt 必须含上面「工程师」身份的完整指令与目标文件路径。
      ### Phase 2.5 — 独立验算
      用 subagent 隔离复算（见角色切换协议），PASS 继续、可疑记录、FAIL 回退 Phase 2。
      ### Phase 3 — 论文
      读全部推导+结果+图片，按官方模板（随包 SKILL_ROOT/templates/论文/）写论文并编译。
      ### Phase 4 — 审查（可回退）+ 三席独立盲评
      阻断项 B3→Phase 1；数值误差>15%→Phase 2；结构残缺 B4→Phase 3；每 Phase 最多回退 1 次，回退只修复问题不做全新推导。终审三席独立盲评：3 个并行 subagent 各注入不同 seat brief（A/B/C，权重见角色切换协议），每席只拿渲染 PDF + 产物清单，不共享上下文、不告知目标档与阈值；每席产出结构化 scorecard（YAML 块：criteria 权重和=1.0、分数 0-100、weighted_total、implied_tier）。聚合：主控收齐 3 份 scorecard 后，三席 implied_tier 都 ≥ 目标档、最低 weighted_total 达阈值（国一≥85/floor70、国二≥75/floor60）、无单维跌破 floor 才判通过；两席某维分歧>20 分视为证据冲突，回派 outlier 席位带证据重评一次，不取平均；Phase 4 最多 2 轮重评，超限取多数席结论并标注风险。
```

</details>

**依据 2 · 源码核查**：[SKILL.md:47-55](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/SKILL.md#L47-L55)

运行产物和门禁要求。

```text
- **Phase 0**：写 `求解/模型推导/框架设计.md`，必须含 ①一句话核心思想 ②核心量定义(≤3) ③五问递进映射表 ④全文命题树(≤2层)。
- **Phase 1**：每问一份 `求解/模型推导/问题X_数学推导.md`，标注量纲、假设[强]/[弱]、方法选择理由与备选。
- **Phase 2**：每问 `求解/问题X/问题X_求解.py`，必须 `py_compile` → 实际运行 → 确认 `结果/*.csv` 与 `图片/*.png` 非空；禁止「待运行」标记。
- **Phase 2.5**：独立验算（信息隔离），分歧 >30% FAIL、10-30% SUSPECT、否则 PASS。
- **Phase 3**：写 `论文/*.tex`，`xelatex` ×2 编译，`grep -c 'Error' 论文.log` 必须 = 0。
- **Phase 4**：逐项检查 + 阻断项 B1-B9 一票否决；BLOCK/MAJOR 必须带 `evidence_command` 并真跑验证。

阶段门禁未通过不得进入下一阶段；回退只修复问题，不做全新推导。
全流程进度维护在 求解/进度.md，收尾输出 steps/progress 可视化。
```

**依据 3 · 作者声明**：[README.md:68-72](https://github.com/Andiii208/dsh-ultramath/blob/37d95b1820bb77e97a3efc8fe3cbbeb2e5c7a0d1/README.md#L68-L72)

作者数字冻结与盲评声明。

```text
- **全流程阶段 + 质量门禁**：Phase 0 框架 → 1 推导 → 2 编码 → 2.5 独立验算 → 3 论文 → 4 审稿，每阶段有门禁，审稿发现阻断项可回退。
- **三席独立盲评 + 结构化 scorecard**：Phase 4 终审派 3 个互不共享上下文的评委（旗舰通审 / 创新与决策 / 正确性可复现），结构化打分（国一≥85 / floor70，国二≥75 / floor60），分歧 >20 分走证据仲裁，不取平均。
- **数字冻结 + 传播检测**：`冻结数字.json` 让论文每个数字可追溯到 CSV/脚本输出；改代码后 grep 检测 stale 引用，杜绝「改代码忘改论文数字」。
- **学术诚信 7 类门控**：抄袭 / 数据造假 / 引用伪造 / 图片伪造 / 不可复现 / 匿名性违规 / 越权署名，任一触发一票否决。
- **自包含**：论文模板（`templates/论文/`，`.tex`/`.cls`，字体缺省自动降级）+ 审稿脚本（`scripts/check_*.py` + `scripts/review_loop/*`）随包分发。
```

#### 缺口

- 未建证据链强制器或对照数据。
  **影响**：假设有效性未知。
  **进一步探讨**：固定题目与预算做盲法对照，预注册漏检阈值。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
