# Academic Research Skills for DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[a6859a3](https://github.com/nullptr-DZF/dsh-academic-research-skills/tree/a6859a3752cfe582a166ca283c10d3a45e1f9c9c)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nullptr-DZF/dsh-academic-research-skills)
<!-- END META -->

> **功能**：把学术研究、论文写作、审稿和流水线技能及其手动命令接入 DeepSeek Harness。

> **亮点**：移植层把既有 ARS 提示及资源目录注册进 DSH，给人类保留命令入口。上游研究方法的效果仍需独立证明。[Q01](#research-q01)

> **主要限制**：包内有要求运行确定性审阅门的提示，但检查器及共享契约需从上游另行取得，无法由注册或提示确认已运行。[Q02](#research-q02)

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
  - [Q01 · 谁会用到这套学术入口，DSH 到底安装了什么？](#detail-section-11)
  - [Q02 · 控制流程、引用验证和审稿合成有何跨环境落差？](#detail-section-12)
  - [Q03 · 如何检验说明性技能对引用复核的实际价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中反复检查论文段落和引用的用户，可发现 ARS 的研究、写作与审稿入口。

从研究小组手工查稿，或在支持完整 ARS 工件的上游宿主做核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 学术技能 | 组织研究和审稿步骤 | 外部脚本未随包 |
| 命令入口 | 选择引用复核等模式 | 需 skill 工具及 DSH skills |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills | 必需 | 注册入口 | 直接退出 |
| 上游 ARS 脚本和依赖 | 硬判据才需 | 运行确定性检查 | 以未验证记录 |
| 检索和原文权限 | 证据工作需 | 回查引用 | 人工查核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选隔离非商业短稿 | 确认注册和依赖 |
| 检查 | 用户选引用核查 | 逐条带原文或未知 |
| 退出 | 弃用无法核查的报告 | 改手工核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 外部依赖与模型支出未知 | 核对许可和脚本 | 包仅带提示和入口 |
| 持续 | 模型和检索支出未知 | 逐条回源及复核 | 无法自动验证整篇稿件 |
| 失败恢复 | 重复查核成本未知 | 补材料或回退手工 | 不接受自报通过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| DSH 入口 | 实际注册功能 | 宿主环境运行结果 |
| 核查草稿 | 已有提示与文件路径 | 真实命中率和合格率 |

> **思考**：包内有要求运行确定性审阅门的提示，但检查器及共享契约需从上游另行取得，无法由注册或提示确认已运行。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：移植层把既有 ARS 提示及资源目录注册进 DSH，给人类保留命令入口。上游研究方法的效果仍需独立证明。[Q01](#research-q01)

轻量注册器易迁入支持 skills 的宿主，受简化前言处理和外部工件一致性约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

包内有要求运行确定性审阅门的提示，但检查器及共享契约需从上游另行取得，无法由注册或提示确认已运行。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用不含敏感信息的非商业短稿观察引用核查提示是否可追溯。依赖缺失或结果无法定位原文就退回人工核验。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认技能注册和独立的上游脚本缺口，审稿效果未知。

- 已检查：作者 README、包清单、源码路径 README.md、commands/ars-citation-check/SKILL.md、cordis.patch.yml、lib/startup.js、package.json、skills/academic-paper-reviewer/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根提交，核查启动、资源与引用路径，未运行脚本或宿主。
- 下一步：用标注真实、错引及缺失的三类引文复核提示和最终人工时间。

**分析版本**

- **仓库**：[nullptr-DZF/dsh-academic-research-skills](https://github.com/nullptr-DZF/dsh-academic-research-skills)
- **版本号**：0.1.0（[固定提交 a6859a3](https://github.com/nullptr-DZF/dsh-academic-research-skills/tree/a6859a3752cfe582a166ca283c10d3a45e1f9c9c)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

单一引用检查入口可能减少对缺证据条目的漏标；用混入错例的稿件比较，若模型报通过却无法回查原文则否定。[Q03](#research-q03)

用标注真实、错引及缺失的三类引文复核提示和最终人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 166 | 39988 | — | — | 337773 |
| .js | source | 1 | 120 | 82 | 30 | — |
| .mjs | source | 1 | 80 | 65 | 11 | — |
| .md | example | 24 | 6298 | — | — | 56850 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-17），可前往 [GitHub Issues](https://github.com/nullptr-DZF/dsh-academic-research-skills/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要可复核学术文档的 DSH 用户，安装这一移植后哪些入口可出现，哪些引用与审查行为依赖额外环境？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用到这套学术入口，DSH 到底安装了什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制、依赖、兼容与流程

#### 完整回答

适合在 DSH 中重复做文献查核、论文准备或审稿清单的研究者。比复制上游指令文件，移植包会由 profile 补丁把 startup 加入，宿主注入 skills 后读取四个固定技能目录及 commands 子目录。它将本地目录设为资源基址，临时注册技能；命令额外限定用户触发。以引用检查为例，包装内容请求加载 academic-paper，再进入 citation-check 模式，命令行出现不表示引用已经过独立核查。

入口不存在时先查 skills 服务与该路径文件。缺必需依赖时 startup 警告并退出，技能文件缺失或不适配前言时可只完成部分注册。移植贡献集中在可发现入口和资源定位，上游学术方法、提示结构及脚本不能算作这个 DSH 包的新机制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-24](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/README.md#L9-L24)

作者列出入口与上游许可证关系。

<details>
<summary>查看原文（16行）</summary>

```text
安装后自动获得：

- **4 个模型可调用技能**：`deep-research`（13-agent 调研团队，8 种模式）、
  `academic-paper`（12-agent 论文写作，11 种模式）、`academic-paper-reviewer`
  （5 席位同行评审面板）、`academic-pipeline`（10 阶段全流水线编排）
- **16 个用户可调用命令**：`/ars-full`、`/ars-plan`、`/ars-reviewer`、
  `/ars-lit-review`、`/ars-abstract`、`/ars-revision`、`/ars-outline`、
  `/ars-citation-check`、`/ars-disclosure`、`/ars-format-convert`、
  `/ars-rebuttal-audit`、`/ars-revision-coach`、`/ars-cache-invalidate`、
  `/ars-mark-read`、`/ars-unmark-read`、`/ars-3w`

> **署名 / Attribution**：本项目为 ARS 的 DSH 移植，技能内容与命令衍生自
> Cheng-I Wu（[Imbad0202](https://github.com/Imbad0202)）的
> [academic-research-skills](https://github.com/Imbad0202/academic-research-skills)，
> 全部内容（含移植层）遵循 **CC-BY-NC-4.0**（非商业用途），详见
> [NOTICE.md](NOTICE.md) 与 [LICENSE](LICENSE)。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:12-15](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/cordis.patch.yml#L12-L15)

实际加载 startup 并传 skills。

```text
- insert:
    - id: ars-skills
      name: 'dsh-academic-research-skills/startup'
      inject: [skills]
```

**依据 3 · 源码核查**：[lib/startup.js:63-80](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/lib/startup.js#L63-L80)

解析本地技能文件和资源基址。

<details>
<summary>查看原文（18行）</summary>

```text
function loadSkill(rel) {
  const skillDir = join(PACKAGE_ROOT, rel);
  const file = join(skillDir, 'SKILL.md');
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  const text = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) return null;
  const name = fm.name;
  const description = fm.description;
  if (typeof name !== 'string' || !NAME_RE.test(name)) return null;
  if (typeof description !== 'string' || description.length === 0) return null;
  const content = text.slice(text.indexOf('---', 3) + 3).replace(/^\r?\n/, '');
  return {
    name,
    description,
    content,
    resourceBase: { kind: 'directory', path: skillDir },
  };
```

</details>

**依据 4 · 源码核查**：[lib/startup.js:87-119](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/lib/startup.js#L87-L119)

宿主注册与用户专属命令。

<details>
<summary>查看原文（33行）</summary>

```text
export default function apply(ctx) {
  if (!ctx?.skills) {
    console.warn('[dsh-academic-research-skills] ctx.skills unavailable — skills not registered');
    return;
  }

  let registered = 0;
  for (const rel of SKILL_DIRS) {
    const skill = loadSkill(rel);
    if (!skill) {
      console.warn(`[dsh-academic-research-skills] failed to load ${rel}`);
      continue;
    }
    ctx.skills.register({ ...skill, source: 'runtime' });
    registered += 1;
  }

  const commandsDir = join(PACKAGE_ROOT, 'commands');
  if (existsSync(commandsDir)) {
    for (const entry of readdirSync(commandsDir)) {
      if (!statSync(join(commandsDir, entry)).isDirectory()) continue;
      const skill = loadSkill(`commands/${entry}`);
      if (!skill) continue;
      ctx.skills.register({
        ...skill,
        source: 'runtime',
        invocation: { modelInvocable: false, userInvocable: true },
      });
      registered += 1;
    }
  }

  console.log(`[dsh-academic-research-skills] registered ${registered} skills`);
```

</details>

**依据 5 · 源码核查**：[commands/ars-citation-check/SKILL.md:1-15](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/commands/ars-citation-check/SKILL.md#L1-L15)

命令委托已有技能并标记上游脚本依赖。

<details>
<summary>查看原文（15行）</summary>

```text
---
name: ars-citation-check
description: "ARS academic-paper `citation-check` mode — citation error report"
disable-model-invocation: true
user-invocable: true
---

The user invoked `/ars-citation-check` (port of the Claude Code slash command). First call the `skill` tool with name `academic-paper` to load that skill (unless it is already loaded in this session), then execute the mode it specifies:

Trigger the `academic-paper` skill in `citation-check` mode. Produces a citation error report (missing references, mismatched in-text citations, format errors). Fidelity spectrum, low oversight.

Mode reference: `MODE_REGISTRY.md` § academic-paper.
Skill entry: `academic-paper/SKILL.md`.

Note: this command was ported from the ARS Claude Code plugin (Imbad0202/academic-research-skills, CC-BY-NC-4.0). The deterministic tooling it references (scripts/*.py, MODE_REGISTRY.md, shared/) ships in the upstream repo — clone it alongside this plugin if you need script-based features such as the citation verification gate.
```

</details>

#### 缺口

- 未验收目标宿主是否发现所有入口及加载嵌套文件。
  **影响**：影响实际接入覆盖。
  **进一步探讨**：在隔离 profile 只验证一个工具入口的注册和对文献样本的路径回查。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 控制流程、引用验证和审稿合成有何跨环境落差？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

这个包发出研究、写作、评审和流水线提示。作者明确未迁移 Claude 写保护 hooks，外部验证脚本和共享 schema 不随包。审稿技能正文要求先开提交盲审条件，后看稿评审，再用 Python 检查 phase conformance 和 panel synthesis；注册器只是读 Markdown、注册，未提供上述执行入口。仓库跟踪树中没有该脚本或共享 schema。交付使用者可以运行宿主具备的提示流程，但缺可定位的脚本验证结果时应记录验证未实施，不把模型的自报 PASS 视为真实通过。补外部文件时要针对同一上游版本和工作副本，先确定许可和工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-58](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/README.md#L51-L58)

作者明示 hooks 和确定性脚本缺失，以及角色内联。

```text
## 与上游的差异

- **hooks 不移植**：上游 `hooks/hooks.json`（写保护 guard、SessionStart 播报）
  是 Claude Code 专属；DSH 无 hook 系统，写保护由 DSH 自身文件沙箱承担。
- **确定性脚本需上游仓库**：引用核验 gate 等 `scripts/*.py` 不在本包内；
  需要时 clone 上游仓库并按其 README 安装 Python 依赖（`pypdf` 等）。
- **子代理**：上游 39 个提示角色默认内联运行；3 个插件级 agent 文件随技能包
  分发，需要时可把其内容作为 `subagent` 工具的 prompt 使用。
```

**依据 2 · 源码核查**：[skills/academic-paper-reviewer/SKILL.md:455-462](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/skills/academic-paper-reviewer/SKILL.md#L455-L462)

实际应遵循的两阶段契约、脚本与 schema。

```text
## v3.6.2 Sprint Contract Hard Gate

- **Reviewer hard gate.** All reviewer modes that ship with contracts (`reviewer_full`, `reviewer_methodology_focus`) now run two-call Phase 1 (paper-content-blind) + Phase 2 (paper-visible) orchestration. See `references/sprint_contract_protocol.md`.
- **Schema 13.2 sprint contract.** Each dimension carries `eligible_roles` and `owner_role`; reviewer Phase 1 commits only eligible scoring plans, while Phase 2 marks ineligible dimensions `not_assessed`. Mandatory dimensions pre-commit `what_triggers_fatal`; fatality is never synthesized post hoc. Validator: `scripts/check_sprint_contract.py`. Schema: `shared/sprint_contract.schema.json`.
- **Executable conformance + panel checkers.** Before synthesis, `scripts/check_phase_conformance.py` verifies role binding, plan grammar, manuscript blindness, trigger binding, dissent cap, and evidence anchors. After synthesis, `scripts/check_panel_synthesis.py` recomputes role-scoped two-stage arithmetic, verifies `dimension_verdicts`, and enforces the DA-CRITICAL terminal gate.
- **Synthesizer three-step mechanical protocol.** Build per-dimension eligible-seat matrix → apply each condition's quantifier per dimension, then its dimension quantifier → resolve precedence by severity. Majority with one assessed eligible seat means that seat decides. Forbidden operations are explicit in `agents/editorial_synthesizer_agent.md`.
- **methodology_focus reduced panel.** `reviewer_methodology_focus` mode runs a 2-reviewer panel (Journal-Fit Reviewer, internal role `eic`, + methodology only) instead of the default 5.
- **Templates:** `shared/contracts/reviewer/full.json` (panel 5) and `shared/contracts/reviewer/methodology_focus.json` (panel 2). Reserved modes (`reviewer_calibration`, `reviewer_guided`) keep pre-v3.6.2 behaviour until follow-up patch templates land; `reviewer_re_review` left the Schema 13 enum with #576 Spec B and is governed by the dedicated contract family `shared/contracts/re_review/`.
```

**依据 3 · 源码核查**：[lib/startup.js:93-119](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/lib/startup.js#L93-L119)

注册器只把本地内容交给宿主，无自动执行上游的逻辑。

<details>
<summary>查看原文（27行）</summary>

```text
  let registered = 0;
  for (const rel of SKILL_DIRS) {
    const skill = loadSkill(rel);
    if (!skill) {
      console.warn(`[dsh-academic-research-skills] failed to load ${rel}`);
      continue;
    }
    ctx.skills.register({ ...skill, source: 'runtime' });
    registered += 1;
  }

  const commandsDir = join(PACKAGE_ROOT, 'commands');
  if (existsSync(commandsDir)) {
    for (const entry of readdirSync(commandsDir)) {
      if (!statSync(join(commandsDir, entry)).isDirectory()) continue;
      const skill = loadSkill(`commands/${entry}`);
      if (!skill) continue;
      ctx.skills.register({
        ...skill,
        source: 'runtime',
        invocation: { modelInvocable: false, userInvocable: true },
      });
      registered += 1;
    }
  }

  console.log(`[dsh-academic-research-skills] registered ${registered} skills`);
```

</details>

#### 缺口

- Skill 数量与源码接线已核查，实际宿主是否能正确暂停于缺件和人工确认处未知。
  **影响**：可能将未校验输出当作已验证。
  **进一步探讨**：故意不给外部脚本和一篇材料，检查是否如实停留在未核。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何检验说明性技能对引用复核的实际价值？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

建议先观察移植是否能帮 DSH 用户生成候选材料清单和引用核对项，拿已知来源的非商业短稿比较。构造一条原文支持、两条引用错位和一条找不到出处的样本，用作者平时的手工查核和 DSH 单一核查命令分别生成报告。以能定位原文、指出错误并如实记录未找到的结果为合格，计入逐条人查、补检索和缺依赖的时间。

待验证假设是入口和复用的检查提示能降低漏掉不确定性的次数。若模型会在脚本缺席时随机补造通过、同一错误引回同样的原文或复核耗时增加，则退回手工核对与维护好的校验工具。账单与工作量未知；包自带非商业许可证声明，另行核对具体使用权。

#### 证据与依据

**依据 1 · 源码核查**：[commands/ars-citation-check/SKILL.md:8-15](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/commands/ars-citation-check/SKILL.md#L8-L15)

单一命令适合最小对照，同时承认外部缺件。

```text
The user invoked `/ars-citation-check` (port of the Claude Code slash command). First call the `skill` tool with name `academic-paper` to load that skill (unless it is already loaded in this session), then execute the mode it specifies:

Trigger the `academic-paper` skill in `citation-check` mode. Produces a citation error report (missing references, mismatched in-text citations, format errors). Fidelity spectrum, low oversight.

Mode reference: `MODE_REGISTRY.md` § academic-paper.
Skill entry: `academic-paper/SKILL.md`.

Note: this command was ported from the ARS Claude Code plugin (Imbad0202/academic-research-skills, CC-BY-NC-4.0). The deterministic tooling it references (scripts/*.py, MODE_REGISTRY.md, shared/) ships in the upstream repo — clone it alongside this plugin if you need script-based features such as the citation verification gate.
```

**依据 2 · 源码核查**：[skills/academic-paper-reviewer/SKILL.md:455-462](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/skills/academic-paper-reviewer/SKILL.md#L455-L462)

命题的关键反证为脚本和契约是否实际执行。

```text
## v3.6.2 Sprint Contract Hard Gate

- **Reviewer hard gate.** All reviewer modes that ship with contracts (`reviewer_full`, `reviewer_methodology_focus`) now run two-call Phase 1 (paper-content-blind) + Phase 2 (paper-visible) orchestration. See `references/sprint_contract_protocol.md`.
- **Schema 13.2 sprint contract.** Each dimension carries `eligible_roles` and `owner_role`; reviewer Phase 1 commits only eligible scoring plans, while Phase 2 marks ineligible dimensions `not_assessed`. Mandatory dimensions pre-commit `what_triggers_fatal`; fatality is never synthesized post hoc. Validator: `scripts/check_sprint_contract.py`. Schema: `shared/sprint_contract.schema.json`.
- **Executable conformance + panel checkers.** Before synthesis, `scripts/check_phase_conformance.py` verifies role binding, plan grammar, manuscript blindness, trigger binding, dissent cap, and evidence anchors. After synthesis, `scripts/check_panel_synthesis.py` recomputes role-scoped two-stage arithmetic, verifies `dimension_verdicts`, and enforces the DA-CRITICAL terminal gate.
- **Synthesizer three-step mechanical protocol.** Build per-dimension eligible-seat matrix → apply each condition's quantifier per dimension, then its dimension quantifier → resolve precedence by severity. Majority with one assessed eligible seat means that seat decides. Forbidden operations are explicit in `agents/editorial_synthesizer_agent.md`.
- **methodology_focus reduced panel.** `reviewer_methodology_focus` mode runs a 2-reviewer panel (Journal-Fit Reviewer, internal role `eic`, + methodology only) instead of the default 5.
- **Templates:** `shared/contracts/reviewer/full.json` (panel 5) and `shared/contracts/reviewer/methodology_focus.json` (panel 2). Reserved modes (`reviewer_calibration`, `reviewer_guided`) keep pre-v3.6.2 behaviour until follow-up patch templates land; `reviewer_re_review` left the Schema 13 enum with #576 Spec B and is governed by the dedicated contract family `shared/contracts/re_review/`.
```

**依据 3 · 作者声明**：[README.md:20-24](https://github.com/nullptr-DZF/dsh-academic-research-skills/blob/a6859a3752cfe582a166ca283c10d3a45e1f9c9c/README.md#L20-L24)

作者明确 CC-BY-NC 声明。

```text
> **署名 / Attribution**：本项目为 ARS 的 DSH 移植，技能内容与命令衍生自
> Cheng-I Wu（[Imbad0202](https://github.com/Imbad0202)）的
> [academic-research-skills](https://github.com/Imbad0202/academic-research-skills)，
> 全部内容（含移植层）遵循 **CC-BY-NC-4.0**（非商业用途），详见
> [NOTICE.md](NOTICE.md) 与 [LICENSE](LICENSE)。
```

#### 缺口

- 缺少真实引用错误样本的合格率和复核耗时。
  **影响**：没有依据说移植后形成端到端合格流程。
  **进一步探讨**：同一模型用盲标注的短稿做对照，再人工复验原文。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
