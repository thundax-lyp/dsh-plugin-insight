# DARE

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[41f752b](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/41f752b8444ed9030dd9dc223c302ce874e51f83)

<!-- BEGIN META -->
[![GitHub ★ 505](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=505&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yogsoth-ai/de-anthropocentric-research-engine)
<!-- END META -->

> **功能**：由 Markdown 技能图组织的分阶段 AI 科研流程与检查点规范

> **亮点**：[Q02](#research-q02) 将计划决定与科学结论分离并保留追加检查点，提供可读的研究流程合同；这属于编排贡献。

> **主要限制**：[Q03](#research-q03) 提示词要求停止并非独立执行屏障，Agent越过门禁或错误写入仍需外部发现。

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
  - [Q01 · DARE服务何种任务，真实类型是什么？](#detail-section-11)
  - [Q02 · 规格如何成为可恢复的研究状态？](#detail-section-12)
  - [Q03 · 门禁与损坏恢复是否由程序强制？](#detail-section-13)
  - [Q04 · 依赖与全周期代价是什么？](#detail-section-14)
  - [Q05 · 如何试用并推翻协议能减少错误完成的假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需阶段审阅和中断恢复的研究者，用研究Skill图组织方向、规格和证据状态。

普通Agent加人工计划与可回查笔记；比较错误完成和恢复负担，而非比较文件数。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 研究协议与检查点 | 组织分阶段科研 | 依赖Agent遵从与可用战术图 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 完整Skill图 | 必需 | 战术调用SOP | 缺失节点停止并补齐 |
| 可读写目录的Agent | 必需 | 执行与检查点 | 保留人工研究笔记 |
| 检索/实验资源 | 任务相关必需 | 获得科学证据 | 收窄任务，不宣称完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认方向与规格 | 明确门禁，未批准不执行 |
| 2 | Agent加载战术并追加检查点 | 字段齐全且门禁满足 |
| 3 | 审阅者核对证据与恢复 | 损坏则返回最近完整检查点 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型及资料资源 | 安装全图、确认规格 | 金额与耗时未测 |
| 持续 | 模型、检索或实验 | 审阅证据与门禁 | 不等于无运行成本 |
| 失败恢复 | 重放及重做调用 | 查序号、字段及冲突 | 恢复正确率未测 |
| 退出 | 文件存储 | 导出Markdown状态 | 开放文本易保留，但解释需人工 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 研究可追查 | 追加决策与证据Delta规范 | 模型实际遵从率 |
| 中断恢复 | 规定回退和重放 | 状态丢失及人工节省 |

> **思考**：[Q03](#research-q03) 提示词要求停止并非独立执行屏障，Agent越过门禁或错误写入仍需外部发现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将计划决定与科学结论分离并保留追加检查点，提供可读的研究流程合同；这属于编排贡献。

[Q03](#research-q03) 可读合同易迁移，独立写入并发与强制验证不在该库本体中。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 提示词要求停止并非独立执行屏障，Agent越过门禁或错误写入仍需外部发现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 以单一可核验问题试用，人工抽查每阶段；引用丢失或越过规格批准则停止并退回人工计划。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

合同和恢复规范有固定材料支持；门禁遵从、科学产出及外部验证器收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、skills/dare/SKILL.md、skills/execute-research-spec/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查产品入口与执行恢复协议、根说明；未逐项审计全技能图或运行科研实验。
- 下一步：比较普通计划、DARE、DARE加只读验证器，在同模型预算下测错误完成、恢复丢失和人工时间；无改善则否定验证器假设。

**分析版本**

- **仓库**：[yogsoth-ai/de-anthropocentric-research-engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine)
- **版本号**：4.0.1（[固定提交 41f752b](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/41f752b8444ed9030dd9dc223c302ce874e51f83)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 从八类Delta合同推导外部验证器假设；用中断和损坏实验检验错误完成是否减少，未实现且未验证。

比较普通计划、DARE、DARE加只读验证器，在同模型预算下测错误完成、恢复丢失和人工时间；无改善则否定验证器假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 279 | 14281 | — | — | 87741 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：纯 Markdown 研究程序能否让研究可恢复且不把提示词当强制执行？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DARE服务何种任务，真实类型是什么？

**研究主题**：场景与需求

#### 完整回答

DARE是研究 Skill 库，而非DSH原生服务插件。用户先确认方向，形成研究规格，再让Agent逐阶段研究；合格产物是有阶段门禁、证据引用和检查点支持的结论。相较用户直接提出开放研究问题，新增的是可审阅程序约束。README称无运行时依赖；这只描述库本体，模型、检索资料及实际实验资源仍由宿主提供。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/README.md#L17-L19)

作者定义纯Markdown库

```text

*A research skill graph for AI-native science. 271 markdown files. No runtime, no dependencies, no build step.*

```

**依据 2 · 源码核查**：[skills/dare/SKILL.md:24-30](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/dare/SKILL.md#L24-L30)

方向、规格、执行的顺序

```text
DARE enforces this order and does not skip a phase:

1. **North Star**: if a confirmed North Star and ResearchBrief are absent, collect and crystallize them from the user request. If they are present, verify that they still describe the request.
2. **Spec**: You MUST load skill `research-catalog` to expose the available tactics. You MUST load skill `write-research-spec` to turn the confirmed North Star, ResearchBrief, and user constraints into an executable Research Spec. Do not execute research while this phase is incomplete.
3. **Execution**: after the user approves the Spec, You MUST load skill `execute-research-spec` to execute its phases and checkpoints. Do not select a tactic directly from the flat skill directory.

At every phase boundary, record the decision and its reason in the current Phase checkpoint event stream. A plan change is an appended `decisions` event, never an edit to an earlier checkpoint. The product shell may present progress, but scientific conclusions remain in tactic/SOP Delta fields.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规格如何成为可恢复的研究状态？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

入口要求加载 research-catalog、write-research-spec，再在用户批准后加载 execute-research-spec。执行技能重放 decisions 构成内存SpecView，并要求每次战术操作后追加八类Delta检查点。计划变更保留原决定和替换原因，阶段完成需满足门禁；相较反复改写一份计划，状态演变更可追查。这是提示词合同与文件组织贡献，不是独立事务引擎。 所谓门禁是技能正文对执行 Agent 的约束；本组件没有后台监控者能在 Agent 违规时强制拦截。

#### 证据与依据

**依据 1 · 源码核查**：[skills/dare/SKILL.md:24-30](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/dare/SKILL.md#L24-L30)

入口顺序和批准要求

```text
DARE enforces this order and does not skip a phase:

1. **North Star**: if a confirmed North Star and ResearchBrief are absent, collect and crystallize them from the user request. If they are present, verify that they still describe the request.
2. **Spec**: You MUST load skill `research-catalog` to expose the available tactics. You MUST load skill `write-research-spec` to turn the confirmed North Star, ResearchBrief, and user constraints into an executable Research Spec. Do not execute research while this phase is incomplete.
3. **Execution**: after the user approves the Spec, You MUST load skill `execute-research-spec` to execute its phases and checkpoints. Do not select a tactic directly from the flat skill directory.

At every phase boundary, record the decision and its reason in the current Phase checkpoint event stream. A plan change is an appended `decisions` event, never an edit to an earlier checkpoint. The product shell may present progress, but scientific conclusions remain in tactic/SOP Delta fields.
```

**依据 2 · 源码核查**：[skills/execute-research-spec/SKILL.md:24-33](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L24-L33)

重放、选择与追加检查点

<details>
<summary>查看原文（10行）</summary>

```text
Before each route, reconstruct the in-memory `SpecView` by replaying the current Phase checkpoint events in sequence. `decisions` are the plan source; `open_questions` annotate existing plan items; the other Delta fields do not alter plan structure unless a decision explicitly references them.

For each phase:

1. Read `context/INDEX.md`, locate the unique Phase context file, validate checkpoint numbering, and load the latest complete checkpoint.
2. Select the first active Spec item whose dependencies are satisfied and whose status is not `complete`.
3. Load only the context and state slice required by that item. You MUST load the selected tactic as a skill; do not perform its research operation inline. The tactic body controls its required SOP calls and scientific thresholds.
4. After the tactic/SOP operation, append one checkpoint containing the eight Delta fields, process, results, status, and open questions. Do not edit earlier checkpoints.
5. Evaluate the current completion gate. Mark the plan item complete only when the gate is objectively satisfied. If it is not satisfied, keep the item active and record the gap.
6. Evaluate the backtrack condition. A triggered condition requires an explicit user decision, recorded as a new `decisions` event, before returning to an earlier stage.
```

</details>

**依据 3 · 源码核查**：[skills/execute-research-spec/SKILL.md:37-59](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L37-L59)

八类Delta及稳定键合并

<details>
<summary>查看原文（23行）</summary>

````text
Each appended checkpoint contains:

```text
Checkpoint: <unique increasing number>-<UTC timestamp>
Phase: <phase-slug>
Source: <tactic/sop or product layer>
Status: complete | partial
Input slice: <state range read>
Process: <operation performed>
Results: <observed result>
Delta:
  findings: []
  evidence_updates: []
  hypothesis_updates: []
  assumption_updates: []
  uncertainties: []
  decisions: []
  open_questions: []
  recommended_jumps: []
Open questions: <unresolved items>
```

Merge fields by stable keys. Preserve replaced decisions with their replacement reason. Deduplicate recommended jumps by `(target, reason)` and treat them as suggestions, never as permission to bypass a gate.
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 门禁与损坏恢复是否由程序强制？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

关键限制是运行语义由Agent遵从Markdown执行。execute技能规定损坏序号、缺字段或来源缺失就停止；partial检查点要退回最新complete，再重建状态。该协议能表达恢复标准，却没有在本轮范围内提供一个独立运行时去锁定写入、验证每次动作或阻止模型越过门禁。不能把“deterministic”文字或文件数量写成恢复已验证；强项在可读合同，成本是持续遵从和人工抽查。

#### 证据与依据

**依据 1 · 源码核查**：[skills/execute-research-spec/SKILL.md:61-63](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L61-L63)

partial恢复规则

```text
## Recovery Protocol

On a new session, read `context/INDEX.md`, find the target Phase file and latest checkpoint, replay events to rebuild `SpecView`, and resume at the first incomplete item. If the latest checkpoint is `partial`, read its open questions, return to the latest `complete` checkpoint, and rebuild from there. Check Phase, sequence continuity, and all eight Delta fields before continuing. Do not use scratch text as evidence and do not rerun an item already recorded complete unless a new decision explains why.
```

**依据 2 · 源码核查**：[skills/execute-research-spec/SKILL.md:83-93](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L83-L93)

损坏门禁与纯Markdown持久化边界

<details>
<summary>查看原文（11行）</summary>

```text
## Completion Criteria

Every required Spec item has a complete checkpoint whose completion gate is satisfied, or the final report names the first unmet gate and its supporting evidence. The final summary references all Phase context files and the checkpoints used to derive it.

## Failure and Backtrack

Missing or damaged context, a non-contiguous checkpoint sequence, an absent Delta field, or a missing SpecView source blocks routing and reports the exact location. Conflicting facts or decisions are retained as `uncertainties`; the dependent path remains paused until a user or designated reviewer writes a resolving decision. Execution never substitutes elapsed time, an empty result, or an external interruption for a scientific completion gate.

## Boundary

Persistence is append-only Markdown checkpoints in the existing Phase context file. `SpecView` is an in-memory projection and is never persisted as a second object. This product-shell skill is not a graph node and must not be added to the 267-node registry.
```

</details>

#### 缺口

- Markdown门禁遵从率与恢复正确率缺少同任务结果
  **影响**：不能确认提示词合同优于人工计划
  **进一步探讨**：比较相同模型/预算下的人工计划与DARE，注入中断并审阅检查点

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与全周期代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

作者要求整体安装，部分安装可能使战术调用的SOP缺失。使用者需可读写研究目录的Agent、足够上下文与检索/实验能力；库无自带运行时并不免除模型调用和人工审阅。首次确认方向及规格，持续复核证据，失败时检查点重放，退出时导出Markdown即可。现金按实际模型/检索/实验计量，人工按规格审阅、纠错、恢复分开记录，本轮均无实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-65](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/README.md#L53-L65)

完整安装及缺SOP的失败条件

<details>
<summary>查看原文（13行）</summary>

````text
```bash
npx skills add yogsoth-ai/de-anthropocentric-research-engine --skill '*'
```

The only install path. DARE is a plain [Agent Skills](https://agentskills.io) library, so [`skills`](https://github.com/vercel-labs/skills) places it into whichever coding agent you use. Run it from your own project directory, not from a clone of this repository.

`--skill '*'` takes the whole graph. A partial install breaks call edges: a tactic that loads a missing SOP has no fallback.

Nothing else to configure - no `npm install`, no API keys, no MCP config file. The library is 271 `SKILL.md` files and the agent reads them off disk.

## Quick Start

### Guided: the full engine
````

</details>

**依据 2 · 源码核查**：[skills/execute-research-spec/SKILL.md:24-33](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L24-L33)

执行中的读取与追加负担

<details>
<summary>查看原文（10行）</summary>

```text
Before each route, reconstruct the in-memory `SpecView` by replaying the current Phase checkpoint events in sequence. `decisions` are the plan source; `open_questions` annotate existing plan items; the other Delta fields do not alter plan structure unless a decision explicitly references them.

For each phase:

1. Read `context/INDEX.md`, locate the unique Phase context file, validate checkpoint numbering, and load the latest complete checkpoint.
2. Select the first active Spec item whose dependencies are satisfied and whose status is not `complete`.
3. Load only the context and state slice required by that item. You MUST load the selected tactic as a skill; do not perform its research operation inline. The tactic body controls its required SOP calls and scientific thresholds.
4. After the tactic/SOP operation, append one checkpoint containing the eight Delta fields, process, results, status, and open questions. Do not edit earlier checkpoints.
5. Evaluate the current completion gate. Mark the plan item complete only when the gate is objectively satisfied. If it is not satisfied, keep the item active and record the gap.
6. Evaluate the backtrack condition. A triggered condition requires an explicit user decision, recorded as a new `decisions` event, before returning to an earlier stage.
```

</details>

#### 缺口

- 全周期模型预算和审阅耗时未知
  **影响**：不能将无依赖等同低成本
  **进一步探讨**：同研究任务记录token、人工审阅、失败重做及合格结论数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用并推翻协议能减少错误完成的假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合本就需多阶段、可回查研究的团队，先选择一个可独立核验的小问题。由追加式检查点推导未验证假设：外部只读验证器在每个阶段核对Delta和引用，比仅靠模型自检更能减少错误完成。用相同模型、资料与预算对比普通计划、DARE协议、DARE加验证器，故意中断及损坏一条检查点。观察未达门禁却完成的次数、恢复丢失、总人工时间；若验证器不能减少错误或增加的审阅负担超过收益，则否定假设。若引用丢失或模型越过批准步骤，停止自动执行并退回人工计划。

#### 证据与依据

**依据 1 · 源码核查**：[skills/execute-research-spec/SKILL.md:31-33](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L31-L33)

追加与门禁是实验依据

```text
4. After the tactic/SOP operation, append one checkpoint containing the eight Delta fields, process, results, status, and open questions. Do not edit earlier checkpoints.
5. Evaluate the current completion gate. Mark the plan item complete only when the gate is objectively satisfied. If it is not satisfied, keep the item active and record the gap.
6. Evaluate the backtrack condition. A triggered condition requires an explicit user decision, recorded as a new `decisions` event, before returning to an earlier stage.
```

**依据 2 · 源码核查**：[skills/execute-research-spec/SKILL.md:87-93](https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/41f752b8444ed9030dd9dc223c302ce874e51f83/skills/execute-research-spec/SKILL.md#L87-L93)

协议指定的损坏条件

```text
## Failure and Backtrack

Missing or damaged context, a non-contiguous checkpoint sequence, an absent Delta field, or a missing SpecView source blocks routing and reports the exact location. Conflicting facts or decisions are retained as `uncertainties`; the dependent path remains paused until a user or designated reviewer writes a resolving decision. Execution never substitutes elapsed time, an empty result, or an external interruption for a scientific completion gate.

## Boundary

Persistence is append-only Markdown checkpoints in the existing Phase context file. `SpecView` is an in-memory projection and is never persisted as a second object. This product-shell skill is not a graph node and must not be added to the 267-node registry.
```

#### 缺口

- Markdown门禁遵从率与恢复正确率缺少同任务结果
  **影响**：不能确认提示词合同优于人工计划
  **进一步探讨**：比较相同模型/预算下的人工计划与DARE，注入中断并审阅检查点

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
