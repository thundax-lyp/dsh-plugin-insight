# Clarify Intent and Establish Shared Understanding

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d423115](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/tree/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e)

<!-- BEGIN META -->
[![GitHub ★ 205](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=205&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding)
<!-- END META -->

> **功能**：通过依赖决策树和逐轮聚焦提问澄清复杂意图，适合显式压力测试；文本流程不强制执行或保证共识正确。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把依赖顺序、先取证后问人、事实与假设及显式对齐整合为可携Skill，减少无结构澄清，不等已证降低误解。

> **主要限制**：[Q03](#research-q03) README单问与Skill整frontier描述不一致，停止/预算留模型判断；推荐答案有锚定风险，用户确认不证事实正确。

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
  - [Q01 · 何种需求值得有意进入澄清循环，真实类型是什么？](#detail-section-11)
  - [Q02 · 逐轮frontier、执行门和接入实际怎样规定？](#detail-section-12)
  - [Q03 · 轮次、建议锚定与过度确认风险是什么？](#detail-section-13)
  - [Q04 · 怎样试用、停止并检验收益是否覆盖互动成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户主动要求挑战/审计复杂计划，目标含糊会造成返工，需愿意承担问答而非普遍自动盘问。

直接执行加局部澄清/手工“有问题先问”；资源把提问依赖和验收对齐组织成流程，不新增模型能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 决策frontier | 基础先于依赖问题 | 模型解释执行非强制状态机 |
| 取证/总结 | 少问可查事实并对齐 | 确认不证事实正确 |
| 显式执行门 | 重要输出前用户认可 | 只在主动调用流程，不能普遍自动审批 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持Skill的Agent | 必需 | 读取并遵循指令 | DSH专用加载未见/未验 |
| 用户明确审计/压力测试意图 | 触发前提 | 授予互动流程 | 不自动套普通任务 |
| 可用上下文/授权工具 | 按事实需要 | 自取可查信息 | 缺口披露不编事实 |
| 用户判断/确认 | 执行后果前提 | 接受目标/约束 | 不将静默当确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 项目接入 | 复制SKILL核宿主发现 | 不全局自动拦任务 |
| 约范围 | 主动选复杂决定/预算 | 哪些判断与验收必须明确 |
| 逐轮 | 查事实再问当前frontier | 依赖未答不跳轮 |
| 对齐 | 总结事实/未知让用户确认 | 不等事实真相保证 |
| 退出 | 过度问停并交摘要/回局部澄清 | 不绕未授权执行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Skill/宿主环境 | 发现/读流程和约预算 | 无额外服务非零成本 |
| 持续 | 模型上下文/工具检索 | 答问题/等待/核建议锚定 | 金额轮数净收益未知 |
| 失败恢复 | 重新取证/执行返工 | 修错误共识/退出循环 | 卸载不撤已决策后果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 问题组织 | frontier/依赖/取证规则 | 实际模型遵循和用户负担 |
| 共识 | 标签/总结/显式确认流程 | 共识是否事实正确 |
| 任务质量 | 有可比较验收方向 | 幻觉/返工/总时间下降 |

> **思考**：[Q03](#research-q03) README单问与Skill整frontier描述不一致，停止/预算留模型判断；推荐答案有锚定风险，用户确认不证事实正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把依赖顺序、先取证后问人、事实与假设及显式对齐整合为可携Skill，减少无结构澄清，不等已证降低误解。

[Q02](#research-q02) 可携文本依赖树和取证规则可借鉴，无运行代码/强制状态机；[Q03](#research-q03) 多入口描述和停止预算需一致，不能以提示字数当机制验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) README单问与Skill整frontier描述不一致，停止/预算留模型判断；推荐答案有锚定风险，用户确认不证事实正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 显式压力测试复杂决策时项目级小试，约互动预算；可查信息反复问或循环无进展就交已知/未知摘要回直接任务/局部澄清，保必要授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整57行SKILL、Agent显示元数据与README安装/目标章节静态研究；无目标加载/用户任务或工具运行，非DSH执行插件，收益未验。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、agents/openai.yaml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：SKILL全57行、agents/openai.yaml全3行、README安装/目标；未运行skills CLI/实际Agent或当前第三方安装工具，外部兼容声明不验。
- 下一步：[Q04](#research-q04) 高含糊/低含糊任务有无Skill对照总用户/模型时间、一次验收和返工，未执行。

**分析版本**

- **仓库**：[Inference1/clarify-intent-and-establish-shared-understanding](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding)
- **版本号**：未声明（[固定提交 d423115](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/tree/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证有限预算/按验收影响排序与带条件未知，对照已有frontier/总结测互动全成本和返工，不重复计算现有提示。

[Q04](#research-q04) 高含糊/低含糊任务有无Skill对照总用户/模型时间、一次验收和返工，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 171 | — | — | 1576 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：意图澄清文本如何形成共享验收，互动成本和停止边界是否合理？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种需求值得有意进入澄清循环，真实类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根是可复制的Agent Skill资源：SKILL.md加agents/openai.yaml显示元数据，无DSH package/Host注册/执行程序。它供用户明确要求挑战、压力测试、pre-mortem或决策审计时，将目标、约束、成功标准与假设问清；不是对每个普通请求自动开展盘问。

相对临时“你有问题就问”，增量是依赖决策树/当前frontier、每题解释影响与建议、先查现有上下文、不混事实假设、阶段总结与显式共同理解确认。适合需求误解可能造成较大返工、且用户愿意投入问答的决策/复杂计划；明确简单可逆任务通常可用直接执行加局部问答。合格产物是可操作且经用户认可的验收/约束，而非问数多或“super-alignment”口号。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:1-12](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L1-L12)

显式触发与决策树流程。

<details>
<summary>查看原文（12行）</summary>

```text
---
name: clarify-intent-and-establish-shared-understanding
description: Whether you're thinking or getting things done, be clear, specific, and methodical. Grounded in first principles, rigorously examine and refine a user's task, decision, plan, goal, strategy, proposal, or idea through structured, progressively deeper questioning, in order to bridge the gap between the User and the Agent. Use when the user explicitly requests grilling, challenge, pressure-testing, cross-examination, red-team review, pre-mortem analysis, or a decision audit. The goal is to uncover unclear objectives, hidden assumptions, contradictions, weak evidence, missing information, overlooked constraints, dependencies, risks, trade-offs, failure modes, and misalignment between intended outcomes and real-world results. Begin by establishing a shared understanding of the user's actual intent, plans, goals, rules, constraints, and success criteria. Ask focused, high-leverage questions rather than broad or repetitive ones. Adapt each question based on previous answers, probing deeper where uncertainty, unsupported assumptions, or strategic weaknesses remain. Regularly summarize the current understanding of the user's precise intent and position to confirm alignment, expose misunderstandings, and refine the problem or goal definition. Distinguish facts, assumptions, hypotheses, and unknowns. Challenge reasoning rigorously while remaining constructive, respectful, and solution-oriented. Continue until the reasoning is internally coherent, evidence-aware, constraint-conscious, risk-assessed, and translated into a clearer, more actionable goal, decision, or plan. Ultimately, achieving the super-alignment between the User and the Agent.
---

**Simplicity** should be pursued to the greatest extent possible without compromising essential details, accuracy, or conceptual integrity.

**Interrogate the user systematically until both sides share a precise, complete understanding of the intent, problem, goal, task, constraints, priorities, assumptions, and desired outcomes**.

Construct and navigate an implicit decision tree. Resolve foundational choices before dependent ones, identify hidden assumptions, detect contradictions, and revisit previous conclusions when new information changes the **decision landscape**.

**Proceed through the decision tree iteratively, one round at a time**. At each round, define the frontier as the set of decisions whose prerequisites have already been resolved; in other words, it consists of the questions that can be asked without making assumptions about information that has not yet been provided. Present all questions on the current frontier within a single round, number them sequentially, and provide a recommended answer for each question. Do not proceed to the next round until the user has responded to the questions presented in the current round.
```

</details>

**依据 2 · 源码核查**：[SKILL.md:30-48](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L30-L48)

聚焦问题、查上下文与共享总结。

<details>
<summary>查看原文（19行）</summary>

```text
Do not combine independent questions. Each question should:

- target a specific unresolved decision or ambiguity;
- briefly explain why the answer affects the outcome;
- provide a clearly labeled recommended option when sufficient context exists;
- preserve user agency by making clear that the final choice belongs to the user.

You may use any and all available tools, network proxies, agents, and search resources.

Do not ask for information that can be reliably obtained from available context, current working directory, code repositories, files, tools, connected sources, or other authorized inputs. **Retrieve or verify such information directly when possible**. Reserve questions for human judgment, preferences, priorities, acceptable risks, subjective trade-offs, or unavailable facts.

**Continuously restate and refine the emerging understanding**. Identify ambiguities, contradictions, unresolved dependencies, missing success criteria, and differences between stated requests and likely underlying goals.

Continuously maintain a shared mental model by:

- summarize the current understanding when meaningful progress is made;
- separate confirmed facts, assumptions, interpretations, and open decisions;
- highlight ambiguity, conflicting requirements, missing constraints, and unclear evaluation criteria;
- check whether the inferred objective matches the user's actual intent.
```

</details>

**依据 3 · 源码核查**：[agents/openai.yaml:1-3](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/agents/openai.yaml#L1-L3)

仅界面元数据。

```text
interface:
  display_name: "Clarify Intent and Establish Shared Understanding"
  short_description: "Stress-test thinking one question or more at a time"
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 逐轮frontier、执行门和接入实际怎样规定？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Skill要求先解决基础决策，当前frontier所有依赖已解决的问题放同轮、编号且各给建议；本轮人未回答不进入下一轮，依赖本轮未答的问题延后，不混合独立问题。先从仓库/目录/工具/授权来源取可可靠获得事实，只问人的判断、偏好和缺事实，避免把检索责任转给用户。

后续不断分事实/假设/未知，直到依赖/成功标准/取舍已明确且用户显式确认，才执行或定稿有后果输出。这是自然语言行为规范，没有可验证状态存储、预算器、确认UI或执行拦截；依赖支持Skill的Agent和工具/用户实际配合。README给skills CLI和手工复制项目/全局位置，DSH没有专用加载接线，兼容需逐宿主确认。可复用的是问题依赖顺序与先检索后问，不把Prompt文本当代码门。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:10-39](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L10-L39)

frontier/提问与事实取证。

<details>
<summary>查看原文（30行）</summary>

````text
Construct and navigate an implicit decision tree. Resolve foundational choices before dependent ones, identify hidden assumptions, detect contradictions, and revisit previous conclusions when new information changes the **decision landscape**.

**Proceed through the decision tree iteratively, one round at a time**. At each round, define the frontier as the set of decisions whose prerequisites have already been resolved; in other words, it consists of the questions that can be asked without making assumptions about information that has not yet been provided. Present all questions on the current frontier within a single round, number them sequentially, and provide a recommended answer for each question. Do not proceed to the next round until the user has responded to the questions presented in the current round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

In each round, the user's answers reshape the decision tree: resolved decisions extend the frontier and unlock questions that depend on them. Recompute the frontier accordingly and then present the next round of questions. Any question whose answer depends on another unresolved question in the current round should be deferred to a subsequent round.

Do not combine independent questions. Each question should:

- target a specific unresolved decision or ambiguity;
- briefly explain why the answer affects the outcome;
- provide a clearly labeled recommended option when sufficient context exists;
- preserve user agency by making clear that the final choice belongs to the user.

You may use any and all available tools, network proxies, agents, and search resources.

Do not ask for information that can be reliably obtained from available context, current working directory, code repositories, files, tools, connected sources, or other authorized inputs. **Retrieve or verify such information directly when possible**. Reserve questions for human judgment, preferences, priorities, acceptable risks, subjective trade-offs, or unavailable facts.
````

</details>

**依据 2 · 源码核查**：[SKILL.md:50-57](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L50-L57)

显式确认前不做后果输出与效率取舍。

```text
**Do not execute, implement, modify, submit, publish, or finalize any consequential output until**:

1. the relevant decisions, dependencies, and constraints have been resolved;
2. the desired outcome and measurable success criteria are explicit;
3. major assumptions and trade-offs have been surfaced and accepted;
4. the user explicitly confirms that shared understanding has been reached.

**Maintain a balance between rigor and efficiency**. Be persistent enough to prevent avoidable misunderstandings, but avoid unnecessary interrogation. Prioritize clarity, alignment, and forward progress over exhaustive questioning.
```

**依据 3 · 源码核查**：[README.md:51-67](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/README.md#L51-L67)

项目/全局手工资源安装。

<details>
<summary>查看原文（17行）</summary>

````text
Project-level installation is the default; `-g` / `--global` makes the Skill available across projects.

### Option 3: Install Manually

Download the repository as a ZIP from GitHub, or clone it:

```bash
git clone https://github.com/Inference1/clarify-intent-and-establish-shared-understanding.git
```

Then copy the repository folder into your Agent's **project-level** or **global** skills directory. Keep `SKILL.md` inside the Skill folder:

```text
<skills-directory>/
└── clarify-intent-and-establish-shared-understanding/
    └── SKILL.md
```
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 轮次、建议锚定与过度确认风险是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

SKILL12说一轮问当前frontier所有问题，README106却说exactly one question at a time；agents元数据也one or more。实际执行应以Skill正文理解，但多个入口描述不一致会让用户预期/模型执行分歧。每题预给recommended答案可降低输入负担，也可能在用户信息不足时锚定判断；正文34已限定sufficient context，是反证而非完全无保护。

“precise complete understanding”与一直问到确认没有量化停止预算/轮数/关键剩余风险阈值；57要求避免过问但留给模型判断，可能延误本可推进工作。显式确认是此Skill用户选择的流程契约，不应擅自推广为所有普通任务的必要审批。没有执行权限隔离/证据真实性保证，事实验证仍靠实际来源，确认一致也可能共同采纳错误假设。没有任务对照，不能说它已降低幻觉/返工或达到super-alignment。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:12-35](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L12-L35)

整frontier与建议条件。

<details>
<summary>查看原文（24行）</summary>

````text
**Proceed through the decision tree iteratively, one round at a time**. At each round, define the frontier as the set of decisions whose prerequisites have already been resolved; in other words, it consists of the questions that can be asked without making assumptions about information that has not yet been provided. Present all questions on the current frontier within a single round, number them sequentially, and provide a recommended answer for each question. Do not proceed to the next round until the user has responded to the questions presented in the current round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

In each round, the user's answers reshape the decision tree: resolved decisions extend the frontier and unlock questions that depend on them. Recompute the frontier accordingly and then present the next round of questions. Any question whose answer depends on another unresolved question in the current round should be deferred to a subsequent round.

Do not combine independent questions. Each question should:

- target a specific unresolved decision or ambiguity;
- briefly explain why the answer affects the outcome;
- provide a clearly labeled recommended option when sufficient context exists;
- preserve user agency by making clear that the final choice belongs to the user.
````

</details>

**依据 2 · 作者声明**：[README.md:104-108](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/README.md#L104-L108)

one question和触发描述。

```text
## ✅️ What Does This SKILL Do? When Is It Triggered?

The SKILL `clarify-intent-and-establish-shared-understanding` systematically examines and refines a user's plan, decision, goal, strategy, proposal, or idea before consequential actions are taken. Its purpose is to establish a precise and shared understanding of the user's intent, objectives, constraints, priorities, assumptions, dependencies, risks, trade-offs, and measurable criteria for success. It achieves this through adaptive and progressively deeper questioning, posing exactly one high-leverage, decision-focused question at a time. Throughout this process, it distinguishes among facts, assumptions, hypotheses, and unknowns; identifies contradictions and information gaps; directly verifies available facts; and periodically synthesizes the emerging shared understanding.

The SKILL is triggered when the user explicitly requests rigorous scrutiny, such as **grilling, challenging, pressure-testing, cross-examination, red-team review, pre-mortem analysis, or a decision audit**. The process continues until the reasoning is coherent, grounded in available evidence, responsive to relevant constraints, informed by an explicit assessment of risks, actionable, and confirmed by the user.
```

**依据 3 · 源码核查**：[agents/openai.yaml:1-3](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/agents/openai.yaml#L1-L3)

显示描述one or more。

```text
interface:
  display_name: "Clarify Intent and Establish Shared Understanding"
  short_description: "Stress-test thinking one question or more at a time"
```

**依据 4 · 源码核查**：[SKILL.md:50-57](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L50-L57)

无预算停止器与效率原则。

```text
**Do not execute, implement, modify, submit, publish, or finalize any consequential output until**:

1. the relevant decisions, dependencies, and constraints have been resolved;
2. the desired outcome and measurable success criteria are explicit;
3. major assumptions and trade-offs have been surfaced and accepted;
4. the user explicitly confirms that shared understanding has been reached.

**Maintain a balance between rigor and efficiency**. Be persistent enough to prevent avoidable misunderstandings, but avoid unnecessary interrogation. Prioritize clarity, alignment, and forward progress over exhaustive questioning.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用、停止并检验收益是否覆盖互动成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用户明确想压力测试复杂决定时，可项目级小试一个决策，预读流程并约定本次目标/时间、必须解决的判断与授权执行边界；不把它全局自动套所有任务。用户愿确认后再有后果输出；若问题可查却反复问、已明确问题仍循环或建议替代人的选择，应结束澄清并给已知/未知摘要，回直接任务执行或局部问题，不绕过未获的必要授权。

首次复制/宿主Skill发现和理解流程，持续是模型上下文/检索工具与用户回答、轮次等待；无脚本/额外服务不等零token/时间。失败是错误共识、返工和高互动负担，退出移除/不调用Skill即可，但已经形成的决定仍需实际验收，不能靠卸载撤后果。具体收益/金额未知。

未验证方向是在已有frontier上引入用户约定的有限澄清预算、按对验收影响排序并显式保留可带条件推进的未知。不是重复增加总结/事实标签。对照模糊高返工任务与清楚简单任务，比较总问答轮数/用户时间/模型成本、一次验收和后续返工；若减少问题却加误解或互动负担大于返工下降，则否定。实验未做，不造真实研究结果。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:39-57](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/SKILL.md#L39-L57)

事实自取/确认与效率是采用和假设基线。

<details>
<summary>查看原文（19行）</summary>

```text
Do not ask for information that can be reliably obtained from available context, current working directory, code repositories, files, tools, connected sources, or other authorized inputs. **Retrieve or verify such information directly when possible**. Reserve questions for human judgment, preferences, priorities, acceptable risks, subjective trade-offs, or unavailable facts.

**Continuously restate and refine the emerging understanding**. Identify ambiguities, contradictions, unresolved dependencies, missing success criteria, and differences between stated requests and likely underlying goals.

Continuously maintain a shared mental model by:

- summarize the current understanding when meaningful progress is made;
- separate confirmed facts, assumptions, interpretations, and open decisions;
- highlight ambiguity, conflicting requirements, missing constraints, and unclear evaluation criteria;
- check whether the inferred objective matches the user's actual intent.

**Do not execute, implement, modify, submit, publish, or finalize any consequential output until**:

1. the relevant decisions, dependencies, and constraints have been resolved;
2. the desired outcome and measurable success criteria are explicit;
3. major assumptions and trade-offs have been surfaced and accepted;
4. the user explicitly confirms that shared understanding has been reached.

**Maintain a balance between rigor and efficiency**. Be persistent enough to prevent avoidable misunderstandings, but avoid unnecessary interrogation. Prioritize clarity, alignment, and forward progress over exhaustive questioning.
```

</details>

**依据 2 · 源码核查**：[README.md:51-67](https://github.com/Inference1/clarify-intent-and-establish-shared-understanding/blob/d423115bcb2dc01b6a9822ff9e9b5aac4b637a9e/README.md#L51-L67)

项目/全局接入成本。

<details>
<summary>查看原文（17行）</summary>

````text
Project-level installation is the default; `-g` / `--global` makes the Skill available across projects.

### Option 3: Install Manually

Download the repository as a ZIP from GitHub, or clone it:

```bash
git clone https://github.com/Inference1/clarify-intent-and-establish-shared-understanding.git
```

Then copy the repository folder into your Agent's **project-level** or **global** skills directory. Keep `SKILL.md` inside the Skill folder:

```text
<skills-directory>/
└── clarify-intent-and-establish-shared-understanding/
    └── SKILL.md
```
````

</details>

#### 缺口

- 没有真实用户/同任务对照或宿主加载验收
  **影响**：不能保证降低幻觉/返工、净省时或DSH可直接用
  **进一步探讨**：项目级明确调用，固定预算比较含澄清全流程成本/验收返工，先核Skill宿主。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
