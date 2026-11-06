# dsh-plans

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f7cec53](https://github.com/Optim-Agent/dsh-plans/tree/f7cec536a49f548aa96503011b98f76faaf95c35)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Optim-Agent/dsh-plans)
<!-- END META -->

> **功能**：通过 Agent/Preset、五个 Skill 和可选模型的评审工具，组织版本化计划及显式 DSH goal 交接。

> **亮点**：把语言/模型偏好、计划版本与评审/交接组织成可追溯工作流，真实工具可选模型并区分执行/释放失败；净质量未测，见 [Q01](#research-q01)至 [Q03](#research-q03)。

> **主要限制**：内置plan mode关闭，交接/不改目标主要靠模型遵循；子评审deny未移除shell，不能把局部工具过滤当硬只读；状态并发/公共计划目录也有边界，见 [Q02](#research-q02)至 [Q04](#research-q04)。

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
  - [Q01 · 真实预设组成与目标人群是什么？](#detail-section-11)
  - [Q02 · 问答、计划和执行交接谁真正强制？](#detail-section-12)
  - [Q03 · 评审子Agent如何选模型、失败与只读到哪？](#detail-section-13)
  - [Q04 · 状态可靠性与全周期采用条件如何？](#detail-section-14)
  - [Q05 · 下一步可证伪的结构改进是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意先澄清复杂仓库变更再执行的人，可生成带决策和验收表的版本计划；简单任务未必值得多轮，见 [Q01](#research-q01)。

宿主plan mode或手工Markdown计划/复核；本包复用goal/subagents而非新执行引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 规划预设 | 标准Agent加工作流 | 内置plan mode关闭 |
| 版本计划指引 | 决策/精炼/交接 | 模型纪律非授权状态机 |
| 角色子Agent | 模型选择与结果报告 | deny不含shell |
| 状态辅助CLI | 偏好/run/子任务记录 | 无并发锁、私态非加密 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH preset roster/原生工具服务 | 必需 | 组合标准Agent | 根无统一Host入口 |
| codeRuntime | 固定Code Mode | SDK工具呈现 | 无Native fallback |
| llm/subagents与模型凭据 | 评审条件 | 角色执行 | 目录歧义/启动失败报错 |
| 可用Python与脚本绝对路径 | 状态条件 | config/run/记录 | 相对cwd需核 |
| 独立副本与真实受限权限 | 观察条件 | 控制可能写入 | deny名单非OS只读 |

#### 步骤

| 步骤 | 动作 | 判据或退路 |
| --- | --- | --- |
| 准备 | 新preset会话/独立副本 | 核Code Runtime和脚本位置 |
| 小计划 | 确认语言/范围，记录决策 | 只交PLAN与验收表 |
| 可选评审 | 自愿选模式/模型 | 核真实权限与子任务状态 |
| 交接 | 明确stop或执行 | 不把Auto-complete当执行许可 |
| 退出 | 停活任务换preset | 状态/缓存/goal另管 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 宿主/Python/模型 | 语言与角色/工具配置 | 版本兼容未测 |
| 持续 | 多review/critic/goal请求 | 问答/版本与意见核证 | 三review并发非低总费用 |
| 失败 | 重派/状态临时文件 | 分执行/释放/错目录 | 无跨进程事务 |
| 退出 | 计划/私态/缓存 | 停任务清留存 | 卸preset不回滚代码 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 追溯计划 | 版本/决策工作流 | 模型实际遵循/遗漏减少 |
| 角色模型 | 真实目录解析/start | 远端模型可用 |
| 执行交接 | 明确指令与goal工具 | 程序强制授权 |
| 评审限制 | deny名单 | shell等全面只读 |

> **思考**：内置plan mode关闭，交接/不改目标主要靠模型遵循；子评审deny未移除shell，不能把局部工具过滤当硬只读；状态并发/公共计划目录也有边界，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把语言/模型偏好、计划版本与评审/交接组织成可追溯工作流，真实工具可选模型并区分执行/释放失败；净质量未测，见 [Q01](#research-q01)至 [Q03](#research-q03)。

结果与dispose异常分别报、模型歧义拒绝值得复用；固定tmp/无锁与共享artifact目录不宜当多run事务，工具名单也不能替代权限边界，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

内置plan mode关闭，交接/不改目标主要靠模型遵循；子评审deny未移除shell，不能把局部工具过滤当硬只读；状态并发/公共计划目录也有边界，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：复杂变更用户在独立副本先走small-plan并停在计划交接，人工核决策和清单；不把预设当硬只读。流程过重/模型越写边界时停用，换原plan mode或手工计划，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核预设/五Skill路由、共享规划/状态规则、完整评审工具与Python关键持久链；未运行宿主/模型或目标写入。观察；硬交接候选未实现。

- 已检查：作者 README、包清单、源码路径 README.md、agent.cordis.yml、lib/plan-subagents.js、preset.yml、scripts/dsh_plans_state.py、skills/create-a-small-plan/SKILL.md、skills/references/dsh-planning-workflow.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根preset/完整143行评审工具、组合工具与Code Mode，small-plan及共享规划/状态规范，Python配置/创建run/子任务记录/命令调度。其余Skill作为路由范围，不穷举正文；未审宿主标准工具和权限实现。
- 下一步：- 固定源码，不运行辅助CLI/子Agent/goal或安装preset。
- 作者只读/比例成本陈述不当本轮验收。
- 根为Agent/Preset资源，局部Host工具不混称根原生插件。

**分析版本**

- **仓库**：[Optim-Agent/dsh-plans](https://github.com/Optim-Agent/dsh-plans)
- **版本号**：未声明（[固定提交 f7cec53](https://github.com/Optim-Agent/dsh-plans/tree/f7cec536a49f548aa96503011b98f76faaf95c35)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是已接受plan hash/用户选择的结构化交接，加真实受限评审preset，比较错误执行/错版本与额外交互成本，见 [Q05](#research-q05)。

- 固定源码，不运行辅助CLI/子Agent/goal或安装preset。
- 作者只读/比例成本陈述不当本轮验收。
- 根为Agent/Preset资源，局部Host工具不混称根原生插件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 226 | 188 | 16 | — |
| .md | source | 9 | 714 | — | — | 6398 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Optim-Agent/dsh-plans/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：规划预设的真实工具、状态与执行交接如何支撑可追溯计划，哪里只是纪律而非隔离？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实预设组成与目标人群是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是可放入DSH preset根目录的 Agent/Preset 资源，没有package.json统一Host入口；包含agent.cordis.yml、显示metadata、五个Skill、Python状态辅助与本地CommonJS工具。登记类型用resource表达预设组成，不能因带一个Host工具就把根叫原生Host插件。面向愿意先把仓库变更研究成Markdown计划、逐轮确认再执行的用户，直接替代是宿主plan mode或手工计划/复核。

本包把语言/角色模型偏好、问答/计划版本/评审出处与goal交接串成可追溯工作流；标准coding工具、goal、子Agent、模型、搜索都继承宿主，不是自研执行引擎。小/中/大计划与诊断/参考前置提供不同深度，不应把每次简单改字都升级多轮流程。合格产物是计划与验收表能回溯具体决策，执行后有实际验证；模型说计划已审不证明可以无监督生产采用。

#### 证据与依据

**依据 1 · 源码核查**：[preset.yml:1-2](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/preset.yml#L1-L2)

预设显示信息。

```text
name: 规划模式（dsh-plans）
description: 人类在环的计划工作流：变更前先产出经过研究、评审与批评子代理打磨的 Markdown 计划（dsh-plans/），经显式交接后作为 DSH goal 执行（ponytail + MVP 最小测试）。每个工作目录首次使用会询问语言与 reviewer/criticizer/executor 模型。具备标准模式的全部能力。
```

**依据 2 · 作者声明**：[README.md:16-26](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/README.md#L16-L26)

五Skill作者范围。

<details>
<summary>查看原文（11行）</summary>

```text
## Bundled skills

Five skills, chosen by the agent for each request:

| Skill | Use it when |
|---|---|
| `create-a-small-plan` | A small scoped repo change needs 1 to 3 planning questions. Recommended refinement: one criticizer round, then accept for execution. |
| `create-a-plan` | A broad or risky change needs 5 to 10 planning questions and web research. Recommended refinement: one reviewer round, then one criticizer round, then accept for execution. |
| `create-a-big-plan` | An open-ended or high-risk effort needs 10 or more planning questions and web research. Recommended refinement: one round of three concurrent reviewers consolidated by the main agent, then one criticizer round, then accept for execution. |
| `diagnose-before-plan` | A bug, CI failure, regression, incident, RCA, or broken behavior needs diagnosis before planning. |
| `reference-before-plan` | Downloaded projects, articles, papers, or docs must be analyzed before planning choices are safe. |
```

</details>

**依据 3 · 源码核查**：[agent.cordis.yml:25-40](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L25-L40)

预设persona工作流。

<details>
<summary>查看原文（16行）</summary>

```text
- id: persona
  name: '@deepseek-ai/dsh-persona'
  config:
    text: |-
      You are a planning-first coding agent powered by the {{model}} model, running on the DeepSeek Harness. Your working directory is {{cwd}}.

      This session is composed from the `dsh-plans` preset, which adapts the prime-plans workflow to the Harness: repository changes are researched, written as traceable Markdown plans under `dsh-plans/`, refined through reviewer/criticizer subagent rounds with the user in the loop, and only then implemented as a DSH goal.

      When the user asks for a repository change (or a diagnosis/reference study before one), select the matching bundled skill from the skill catalog — create-a-small-plan, create-a-plan, create-a-big-plan, diagnose-before-plan, or reference-before-plan — load it with the `skill` tool, and follow it exactly, including its shared normative references. The workflow, not your judgment of convenience, decides the order of questions, artifacts, and handoffs.

      Core discipline:
      - Per workspace, confirm the language setting first; confirm each role's model at that role's first use. Reviewer and criticizer subagents run with the `run_plan_subagent` tool, passing the persisted model.
      - Ask one user question at a time through ask_user_question, in the standard choice format; record every decision in `DECISIONS.md` and the run ledgers.
      - Never spawn a reviewer or criticizer without the refinement mode question; after every PLAN version ask the refinement question, and after refinement converges ask the execution handoff question: execute the plan now as a DSH goal, or stop after planning.
      - Before that handoff answer arrives, write only `dsh-plans/` state and artifacts — never target source, configs, or tests. `Auto-complete` never approves goal execution, installs, deploys, merges, pushes, or destructive cleanup.
      - After approval, drive implementation with create_goal and the plan's Verifier Checklist, using todo_write, ponytail discipline, and the MVP minimum test set; call update_goal complete only when every checklist box passes.
```

</details>

**依据 4 · 源码核查**：[agent.cordis.yml:212-232](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L212-L232)

附带工具接入。

<details>
<summary>查看原文（21行）</summary>

```text
- id: plan-subagents-tool
  name: ./lib/plan-subagents.js
  config:
    toolName: run_plan_subagent
    provider: spawn
    deny:
      - write
      - edit
      - todo_write
      - create_goal
      - get_goal
      - update_goal
      - ask_user_question
      - run_plan_subagent
      - subagent
      - subagent_fork
      - send_message
      - interrupt_agent
      - list_agents
      - workflow
      - ralph
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 问答、计划和执行交接谁真正强制？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Skill要求先只读看仓库、确认语言和角色模型，逐题问答，初稿前确认范围，每版计划后选择评审/批评，最终单独问是否执行且无Auto-complete。中大计划建议多模型评审，接受意见仍需原始证据；五Skill和共享规范是模型遵循的指令，不是代码中验证过的状态机。辅助CLI不会检查已问完问题、计划已收敛或用户确实同意执行，模型仍持有普通文件/goal工具；不能称交接被程序强制。

组合明确关闭内置planMode，理由是要写版本化计划；因此规划前只改dsh-plans目录的边界也是工作流纪律，原生只读plan mode并未兜底。执行批准后指令让当前会话create_goal并用清单驱动完成，若已有active/paused goal则不替换、退回普通工具执行；“所有执行都有新持久goal”并不成立。executor模型需用户切当前会话选择器，工具不自动换主会话模型。Code Mode为固定呈现，依赖host codeRuntime，未配没有Native fallback；实际兼容/加载须另验。

#### 证据与依据

**依据 1 · 源码核查**：[skills/create-a-small-plan/SKILL.md:12-23](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/create-a-small-plan/SKILL.md#L12-L23)

小计划与共享规则入口。

<details>
<summary>查看原文（12行）</summary>

```text
Read `../references/dsh-planning-workflow.md` and `../references/state-and-config.md` — both normative — and follow their setup, state, `language`, and reviewer/criticizer/executor rules. State lives in `dsh-plans/.state/` via `../scripts/dsh_plans_state.py init --workdir <target-workdir>`; spawn reviewer and criticizer roles with the `run_plan_subagent` tool.

## Depth Contract

- Inspect the target repo read-only before the first product question.
- Ask 1 to 3 planning questions, one at a time; standard choice format (recommended first, `Other` second-last, `Auto-complete` last).
- Ask the final scope confirmation, then write `PLAN_v1.md` under the artifact root (normally `dsh-plans/YYYY-MM-DD-topic/`) per `../references/plan-artifact-template.md`.
- After each plan version, ask the refinement mode question from the shared workflow — never spawn a reviewer or criticizer unless the user or `Auto-complete` selected it at that question. Default: exactly one round, recommended mode `Criticizer`; afterwards the recommended option is `Accept plan for DSH goal execution`, then the goal-based execution handoff from the shared workflow.

## Fit

A few local files, clear ownership, low risk, focused verification. Escalate to `create-a-plan` for external API semantics, dependency behavior, compatibility research, cross-module design, or more than three meaningful decisions.
```

</details>

**依据 2 · 源码核查**：[skills/references/dsh-planning-workflow.md:18-38](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/references/dsh-planning-workflow.md#L18-L38)

规划边界/状态初始化指令。

<details>
<summary>查看原文（21行）</summary>

````text
## Planning Boundary

- Treat the user's request as a planning target, not as write authorization.
- Before the explicit execution handoff, do not edit target source files, docs, configs, package metadata, generated assets, or tests outside the planning artifact directory and the dsh-plans state.
- The normal pre-handoff writes are `dsh-plans/.state/` state plus planning artifacts in `dsh-plans/YYYY-MM-DD-topic/`.
- Large downloaded references belong outside the target repository by default, under `~/.cache/dsh-plans/refs/<repo-slug>/<topic>/`; record their paths and evidence in `REF_ANALYSIS.md`.
- After the user explicitly approves execution, leave this planning workflow and execute as a DSH goal (see DSH Goal Execution Handoff).

## State And Settings

Before the first planning question, read `../references/state-and-config.md` and initialize the target workspace state. State lives in `<workdir>/dsh-plans/.state/` (kept out of git by the helper) and artifacts in `<workdir>/dsh-plans/`. The target workspace is the session working directory unless the user explicitly names another directory.

Use the helper script from the skill set:

```bash
python3 ../scripts/dsh_plans_state.py init --workdir <target-workdir>
```

If language is missing from the workspace's `dsh-plans/.state/config.json`, ask the language setting question before any product question. Persist the answer; this language question does not count against the planning-question limit.

Use `dsh-plans/.state/config.json` for reviewer, criticizer, and executor settings. If a role's `mode` is missing or invalid, or its `confirmed_at` is `null` when the role is about to run, ask the matching role-setting or model-confirmation question from `../references/state-and-config.md`, persist the answer, and then spawn or run the selected role.
````

</details>

**依据 3 · 源码核查**：[skills/references/dsh-planning-workflow.md:136-175](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/references/dsh-planning-workflow.md#L136-L175)

精炼版本与意见证据。

<details>
<summary>查看原文（40行）</summary>

```text
After each plan version, ask one refinement mode question. The recommended (first) option follows the skill level's default sequence; the user may always pick a different mode or keep refining:

- `create-a-small-plan`: recommend `Criticizer` for the first (and only default) round; at the next refinement question, recommend `Accept plan for DSH goal execution`.
- `create-a-plan`: recommend `Reviewer` for the first round, then `Criticizer` for the second; at the next refinement question, recommend `Accept plan for DSH goal execution`.
- `create-a-big-plan`: recommend `Reviewer` for the first round as three concurrent independent reviewers (see below), then `Criticizer` for the second; at the next refinement question, recommend `Accept plan for DSH goal execution`.

The question format is:

1. The recommended option from the level's sequence above.
2. The other refinement modes, each with the tradeoff that matters.
3. `Accept plan for DSH goal execution` - stop planning and move to the explicit execution handoff (this is itself the recommended option once the level's sequence is complete).
4. `Auto-complete`.

If the user selects `Reviewer` or `Criticizer`, apply the persisted role settings from `dsh-plans/.state/config.json`. The recommended role mode is `delegated-subagent`, which uses the `run_plan_subagent` tool. `current-session` is available when the user explicitly prefers it or subagent spawning is unavailable.

Reviewer output should record findings with IDs, severity, affected plan IDs, evidence, impact, recommended fix, and disposition. Revise the next plan only for findings that are accepted with evidence.

### Concurrent Reviewers (big plans)

A big-plan reviewer round spawns three independent reviewer subagents so blind spots do not correlate:

- Make three `run_plan_subagent` tool calls in ONE assistant message. Each gets a distinct short description (for example `<topic>-review-a`, `-b`, `-c`) and the same read-only reviewer brief, but is instructed to form its own priorities independently.
- Each reviewer returns its findings in its final report; it writes no files (write tools are denied by the tool).
- After all three settle, the main agent merges and dedupes their findings into one consolidated `PLAN_vN_reviewer_comments.md`, keeping each finding's source reviewer, severity, evidence, and disposition, and surfaces at most five high-priority comments to the user.
- Treat agreement between independent reviewers as stronger evidence, not as authority; every accepted finding still needs repo or reference evidence.

Criticizer output should ask up to five adaptive questions per round. Before presenting a criticizer question, summarize the original criticism in at most three sentences and highlight the most important point. Do not revise the plan until every criticizer question has a recorded answer or an `Auto-complete` answer.

### Round Lifecycle

A refinement round's results are complete when every spawned reviewer has replied (three for big plans) or, for a criticizer round, when every question has a recorded or `Auto-complete` answer. In the same turn, the main agent must:

1. Consolidate the results (merge reviewer findings; collect criticizer answers).
2. Accept or reject each finding on repo or reference evidence and record dispositions; acceptance is the main agent's evidence-based call, and the user may override any disposition.
3. Revise the plan (`PLAN_v(N+1).md`) when accepted items require it.
4. Immediately ask the next refinement mode question — recommended: the next step in the level's sequence, or `Accept plan for DSH goal execution` once the sequence is complete.

Never end a turn merely because a round completed. The only user-waiting points are the refinement mode question itself and unanswered criticizer questions.

To revise a plan, copy `PLAN_vN.md` to `PLAN_v(N+1).md`, edit only the new version, and update the revision ledger plus verifier checklist.
```

</details>

**依据 4 · 源码核查**：[skills/references/dsh-planning-workflow.md:177-193](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/references/dsh-planning-workflow.md#L177-L193)

显式执行交接和已有goal例外。

<details>
<summary>查看原文（17行）</summary>

```text
## DSH Goal Execution Handoff

After the plan is accepted or refinement converges, ask an explicit execution handoff question without `Auto-complete`:

1. `Execute this plan now as a DSH goal`.
2. `Stop after planning`.
3. `Other`.

If approved, stop applying this planning workflow and connect execution to the DSH goal loop:

- Call `get_goal` first. Corner case: if a goal is still pending (active or paused), do not create or replace a goal — the executor simply implements the plan with normal DSH tools and no goal tracking. A completed goal may be replaced by the new one.
- If the executor role's `confirmed_at` is `null`, ask the executor model confirmation question from `../references/state-and-config.md` before creating the goal. The goal loop runs in the CURRENT session, so the confirmed executor model is the session model: when the user picks a specific model that differs from the current session model, ask them to switch the session model in the model selector before answering the handoff question, then proceed.
- Start execution with `create_goal(objective)`. The objective is a compact brief: the absolute path of the accepted `PLAN_vN.md`, an instruction to implement its implementation items in dependency order, the verification commands to run, and the requirement that every `## Verifier Checklist` box passes before calling `update_goal` complete. Set `max_goal_rounds` only when the user explicitly requested a round cap.
- The goal loop re-prompts the session across turns until `update_goal` complete arrives, so execution persists instead of ending with the first reply. The executor is the current session using normal DSH tools; do not create a separate execution engine.
- During goal rounds, track implementation items with `todo_write` in dependency order.
- When the plan is fully implemented and verified, call `update_goal` with action complete and report the result.
- If a blocking condition persists across at least three consecutive goal rounds, call `update_goal` with action blocked and report the concrete blocking condition; do not mark blocked for difficulty or uncertainty.
```

</details>

**依据 5 · 源码核查**：[agent.cordis.yml:93-111](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L93-L111)

goal工具可用，内置plan mode关闭。

<details>
<summary>查看原文（19行）</summary>

```text
# the host plane. dsh-plans drives the execution phase through this tool.
- id: tool-goal
  name: '@deepseek-ai/dsh-tool-goal'

# ── plan mode ───────────────────────────────────────────────────────────────

# Built-in plan mode is DISABLED in this preset. Its single-plan,
# write-forbidden loop conflicts with artifact planning: dsh-plans writes
# `PLAN_vN.md` artifacts under `dsh-plans/` during the planning phase and
# enforces its own handoff questions instead of exit_plan_mode.
- id: planning
  name: cordis:group
  group: true
  disabled: true
  isolate:
    planMode: true
  config:
    - id: plan-mode
      name: '@deepseek-ai/dsh-plan-mode'
```

</details>

**依据 6 · 源码核查**：[agent.cordis.yml:254-261](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L254-L261)

固定Code Mode。

```text
# Present every registered tool through the host's generated TypeScript SDK.
# The official selector waits for the host-plane `codeRuntime` and makes preset
# mounting fail clearly when that prerequisite is absent; there is no Native
# fallback because it would restore the Bash schema incompatibility.
- id: tool-presentation
  name: '@deepseek-ai/dsh-agent-tool-presentation'
  config:
    mode: code
```

**依据 7 · 源码核查**：[scripts/dsh_plans_state.py:329-345](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L329-L345)

CLI调度没有执行授权状态验证。

<details>
<summary>查看原文（17行）</summary>

```text
def main() -> int:
    args = build_parser().parse_args()
    workdir = normalize_workdir(args.workdir)
    if args.command == "init":
        result = ensure_state(workdir)
    elif args.command == "show":
        result = show_state(workdir)
    elif args.command == "set-language":
        result = set_language(workdir, args.tag, args.source)
    elif args.command == "set-role":
        result = set_role(
            workdir, args.role, args.mode, args.model_selector, args.confirmed, args.reset_confirmation
        )
    elif args.command == "start-run":
        result = start_run(workdir, args.topic, args.skill, args.request_text)
    elif args.command == "record-subagent":
        result = record_subagent(workdir, args.run_id, args.role, args.label, args.model, args.status)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 评审子Agent如何选模型、失败与只读到哪？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

run_plan_subagent是真实模型工具：要求parent，选定模型可用provider/model前缀直路由，普通名字查各provider目录，唯一匹配才接受，零/多匹配报错；显式前缀不代表远端已认证或模型可调用。工具不会自己读取持久config/confirmed_at，也不验证refinement选择，调用者需按工作流传已确认值，不能把说明文字当执行前置门禁。

它将自包含prompt/parent/toolFilter.deny传subagents.start，带exec.signal，前台等result后dispose；执行失败和dispose失败分别报，非completed即使有部分文本也抛并带部分输出，正常只拼接text返回。没有本地额外超时/总token预算，取消和实际子任务收尾依宿主。

组合deny了write/edit/goal/问答/再委派等名单，但bash/pwsh仍在预设且不在deny；所以这是被列名工具的结构过滤，不等于子会话没有其他写入路径，更不是OS只读沙箱。保留shell可能服务于读仓库，但作者“read-only by construction”不能外推全面不改文件。本轮未审宿主权限继承或运行写入，不称已复现绕过；只在可信隔离副本评审，靠现有名单不能保护生产工作区。

#### 证据与依据

**依据 1 · 源码核查**：[lib/plan-subagents.js:18-42](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/lib/plan-subagents.js#L18-L42)

模型目录解析与歧义。

<details>
<summary>查看原文（25行）</summary>

```text
async function resolveAgentOptions(llm, selector) {
  const providers = llm.listProviders()
  const normalized = selector.toLowerCase()
  const explicit = providers.find(({ id }) => normalized.startsWith(`${id.toLowerCase()}/`))
  if (explicit) {
    const model = selector.slice(explicit.id.length + 1)
    if (model === '') throw new Error('the provider/model selector is missing its model id')
    return { provider: explicit.id, model }
  }

  const catalogs = await Promise.all(providers.map(async ({ id }) => {
    try {
      return (await llm.listModels(id)).map((model) => ({ provider: id, model }))
    } catch {
      return []
    }
  }))
  const matches = catalogs.flat().filter(({ model }) =>
    model.id.toLowerCase() === normalized ||
    (typeof model.name === 'string' && model.name.toLowerCase() === normalized)
  )

  if (matches.length === 1) return { provider: matches[0].provider, model: matches[0].model.id }
  if (matches.length === 0) throw new Error('selector was not found in the current model catalog; use a model row label or provider/model id')
  throw new Error(`selector is ambiguous; use one of: ${matches.map(({ provider, model }) => `${provider}/${model.id}`).join(', ')}`)
```

</details>

**依据 2 · 源码核查**：[lib/plan-subagents.js:48-57](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/lib/plan-subagents.js#L48-L57)

注册服务与deny来自配置。

<details>
<summary>查看原文（10行）</summary>

```text
  inject: ['tools', 'subagents', 'llm'],

  apply(ctx, config) {
    const toolName = typeof config.toolName === 'string' && config.toolName !== '' ? config.toolName : 'run_plan_subagent'
    const provider = typeof config.provider === 'string' && config.provider !== '' ? config.provider : 'spawn'
    const deny = Array.isArray(config.deny) ? config.deny.filter((name) => typeof name === 'string') : []

    const definition = {
      name: toolName,
      description: 'Delegate one planning-role pass (reviewer or criticizer) to a fresh subagent that works in its own context and returns its final report. Use it only for dsh-plans reviewer/criticizer rounds after the user answered the refinement mode question. The child is read-only by construction: file-write tools, goal tools, user questions, and delegation tools are denied to it. It runs in the foreground: the call returns the child\'s complete final report. The optional model parameter is the persisted model ID or display name from dsh-plans/.state/config.json for the role; omit it to inherit the current session model.',
```

</details>

**依据 3 · 源码核查**：[lib/plan-subagents.js:82-107](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/lib/plan-subagents.js#L82-L107)

真实parent/start/model与signal。

<details>
<summary>查看原文（26行）</summary>

```text
      async execute(args, exec) {
        const parent = exec.agent
        if (!parent) throw new Error('run_plan_subagent requires a calling agent (exec.agent was undefined)')

        const request = {
          label: String(args.description ?? ''),
          prompt: [{ type: 'text', text: String(args.prompt ?? '') }],
          parent,
          toolFilter: { deny },
        }
        const modelSelector = typeof args.model === 'string' && args.model.trim() !== '' ? args.model.trim() : undefined
        if (modelSelector !== undefined) {
          try {
            request.agentOptions = await resolveAgentOptions(ctx.llm, modelSelector)
          } catch (error) {
            throw new Error(`run_plan_subagent could not resolve model "${modelSelector}": ${String(error && error.message ? error.message : error)}`)
          }
        }

        let run
        try {
          run = await ctx.subagents.start(provider, { ...request, signal: exec.signal })
        } catch (error) {
          throw new Error(
            `run_plan_subagent could not start${modelSelector ? ` with model "${modelSelector}"` : ''}: ${String(error && error.message ? error.message : error)}`
          )
```

</details>

**依据 4 · 源码核查**：[lib/plan-subagents.js:110-141](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/lib/plan-subagents.js#L110-L141)

等结果/释放/异常和返回文本。

<details>
<summary>查看原文（32行）</summary>

```text
        const [execution] = await Promise.allSettled([run.result])
        const [disposal] = await Promise.allSettled([Promise.resolve().then(() => run.dispose())])

        if (execution.status === 'rejected') {
          const detail = String(execution.reason && execution.reason.message ? execution.reason.message : execution.reason)
          if (disposal.status === 'rejected') {
            throw new Error(`run_plan_subagent run failed: ${detail}; dispose failed: ${String(disposal.reason && disposal.reason.message ? disposal.reason.message : disposal.reason)}`)
          }
          throw new Error(`run_plan_subagent run failed: ${detail}`)
        }
        if (disposal.status === 'rejected') {
          throw new Error(`run_plan_subagent dispose failed: ${String(disposal.reason && disposal.reason.message ? disposal.reason.message : disposal.reason)}`)
        }

        const result = execution.value
        const text = (Array.isArray(result && result.output) ? result.output : [])
          .filter((block) => block && typeof block === 'object' && block.type === 'text' && typeof block.text === 'string')
          .map((block) => block.text)
          .join('')

        if (result && result.stopReason !== 'completed') {
          const reason = result.stopReason != null ? String(result.stopReason) : 'unknown'
          const suffix = text.length > 0 ? ` Partial output before the child ended:\n${text}` : ''
          throw new Error(`run_plan_subagent ended abnormally (${reason}) before it finished.${suffix}`)
        }

        return text
      },
    }

    const dispose = ctx.tools.register(definition)
    return () => dispose()
```

</details>

**依据 5 · 源码核查**：[agent.cordis.yml:51-62](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L51-L62)

shell与文件工具仍组成。

<details>
<summary>查看原文（12行）</summary>

```text
- id: tool-bash
  name: '@deepseek-ai/dsh-tool-bash'
  disabled: !!js process.platform === 'win32'

- id: tool-pwsh
  name: '@deepseek-ai/dsh-tool-pwsh'
  disabled: !!js process.platform !== 'win32'

# ── filesystem ──────────────────────────────────────────────────────────────

- id: tool-fs
  name: '@deepseek-ai/dsh-tool-fs'
```

</details>

**依据 6 · 源码核查**：[agent.cordis.yml:217-232](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/agent.cordis.yml#L217-L232)

deny名单无shell。

<details>
<summary>查看原文（16行）</summary>

```text
    deny:
      - write
      - edit
      - todo_write
      - create_goal
      - get_goal
      - update_goal
      - ask_user_question
      - run_plan_subagent
      - subagent
      - subagent_fork
      - send_message
      - interrupt_agent
      - list_agents
      - workflow
      - ralph
```

</details>

#### 缺口

- 未运行Host过滤/Code Mode/子Agent权限继承和取消收尾。
  **影响**：不能支持全面只读或真实模型兼容保证。
  **进一步探讨**：在隔离副本验证可见工具与宿主实际权限，若要硬只读另用宿主受限preset/OS边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 状态可靠性与全周期采用条件如何？

**研究主题**：工程质量与复用、效果与总成本、采用判断

#### 完整回答

状态辅助用标准库写config/run/active及subagent jsonl，init附加.state忽略项；JSON用固定.tmp后replace避免单次半写，但没有跨进程锁/CAS，多调用可丢更新或共用临时名。同秒run会顺序探测后加后缀，创建exist_ok:false，竞争仍可能失败；同日同topic的公共artifact_dir会复用，run_id唯一也不保证PLAN目录隔离。不能把“private”理解加密/权限控制，run保存原请求和绝对workdir，.gitignore不阻止人工提交/备份外泄。

推荐观察：确有复杂需求澄清的人在独立工作副本选small-plan，先只交计划，人工核DECISIONS/Verifier Checklist，停止在执行交接；不用日常生产目录当硬只读。先定位辅助脚本绝对路径，文档../scripts相对命令未绑定shell cwd，实际脚本在预设根scripts，避免照抄后以错误位置运行。若后续自愿评审，需知道父会话持有写工具、子Agent shell仍可用。

首次有preset部署、codeRuntime/llm/subagents、Python和配置确认；Python使用现代类型写法，实际版本兼容未跑，不能凭stdlib说任意Python可用。持续有每版计划/问题与review/critic模型轮次，大计划一轮三reviewer，goal执行另耗资源；未测净返工减少或费用。失败需核子任务状态、原目录/临时文件/重复计划，不能盲重派。退出选stop-after-planning、停活子任务，换普通preset；状态/公共计划/缓存和已进goal的执行分别收尾，删除preset不回滚目标代码。流程过重或模型不能遵守写边界时停用，回原plan mode/手工计划。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/dsh_plans_state.py:80-86](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L80-L86)

固定临时名replace。

```text
def atomic_write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(
        json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    tmp.replace(path)
```

**依据 2 · 源码核查**：[scripts/dsh_plans_state.py:107-133](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L107-L133)

忽略项与初始化。

<details>
<summary>查看原文（27行）</summary>

```text
def ensure_gitignored(artifact_root: Path) -> None:
    """Keep `.state/` out of git without touching anything else."""
    ignore = artifact_root / ".gitignore"
    entry = PRIVATE_DIRNAME + "/"
    raw = ""
    if ignore.exists():
        raw = ignore.read_text(encoding="utf-8")
        if any(line.strip().rstrip("/") == PRIVATE_DIRNAME for line in raw.splitlines()):
            return
    raw_ends_with_newline = raw.endswith("\n")
    with ignore.open("a", encoding="utf-8") as handle:
        if ignore.exists() and not raw_ends_with_newline:
            handle.write("\n")
        handle.write(f"# dsh-plans machine state; never commit\n{entry}\n")


def _ensure(workdir: Path) -> tuple[dict[str, Any], Path]:
    config = load_config(workdir / ARTIFACT_DIRNAME / PRIVATE_DIRNAME)
    artifact_root = artifact_root_for(workdir, config)
    state = state_root_for(workdir, config)
    artifact_root.mkdir(parents=True, exist_ok=True)
    state.mkdir(parents=True, exist_ok=True)
    for sub in ("runs", "tmp", "cache"):
        (state / sub).mkdir(parents=True, exist_ok=True)
    ensure_gitignored(artifact_root)
    atomic_write_json(state / "config.json", config)
    return config, state
```

</details>

**依据 3 · 源码核查**：[scripts/dsh_plans_state.py:206-242](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L206-L242)

run碰撞、公共目录复用与原请求持久。

<details>
<summary>查看原文（37行）</summary>

```text
def start_run(workdir: Path, topic: str, skill: str, request_text: str) -> dict[str, Any]:
    config, state = _ensure(workdir)
    now = utc_now()
    stamp = now.replace("-", "").replace(":", "").replace("Z", "Z")
    topic_slug = slugify(topic)
    base_run_id = f"{stamp}-{topic_slug}"
    run_id = base_run_id
    suffix = 2
    while (state / "runs" / run_id).exists():
        run_id = f"{base_run_id}-{suffix}"
        suffix += 1
    artifact_root = artifact_root_for(workdir, config)
    date_slug = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    artifact_dir = artifact_root / f"{date_slug}-{topic_slug}"
    run_dir = state / "runs" / run_id
    run_dir.mkdir(parents=True, exist_ok=False)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    run = {
        "schema": 1,
        "run_id": run_id,
        "skill": skill,
        "topic": topic_slug,
        "request_text": request_text,
        "workdir": str(workdir),
        "artifact_dir": str(artifact_dir),
        "language_tag": config.get("language", {}).get("tag"),
        "status": "planning",
        "created_at": now,
        "updated_at": now,
    }
    atomic_write_json(run_dir / "run.json", run)
    for name in ("decisions.jsonl", "subagents.jsonl", "refs.jsonl"):
        (run_dir / name).touch(exist_ok=True)
    atomic_write_json(
        state / "active.json",
        {"run_id": run_id, "run_dir": str(run_dir), "artifact_dir": str(artifact_dir)},
    )
```

</details>

**依据 4 · 源码核查**：[scripts/dsh_plans_state.py:246-268](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L246-L268)

子Agent记录仅追加。

<details>
<summary>查看原文（23行）</summary>

```text
def record_subagent(
    workdir: Path,
    run_id: str,
    role: str,
    label: str,
    model: str | None,
    status: str | None,
) -> dict[str, Any]:
    if role not in {"reviewer", "criticizer"}:
        raise SystemExit("--role must be reviewer or criticizer")
    _, state = _ensure(workdir)
    path = state / "runs" / run_id / "subagents.jsonl"
    if not path.parent.is_dir():
        raise SystemExit(f"run does not exist: {run_id}")
    entry = {
        "role": role,
        "label": label,
        "model": model,
        "status": status,
        "recorded_at": utc_now(),
    }
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry, sort_keys=True) + "\n")
```

</details>

**依据 5 · 源码核查**：[skills/references/dsh-planning-workflow.md:30-34](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/references/dsh-planning-workflow.md#L30-L34)

相对脚本命令。

````text
Use the helper script from the skill set:

```bash
python3 ../scripts/dsh_plans_state.py init --workdir <target-workdir>
```
````

**依据 6 · 作者声明**：[README.md:37-56](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/README.md#L37-L56)

作者部署与Code Runtime要求。

<details>
<summary>查看原文（20行）</summary>

````text
## Install

```bash
mkdir -p ~/.dsh/.agent-presets
git clone https://github.com/Optim-Agent/dsh-plans.git ~/.dsh/.agent-presets/dsh-plans
```

The roster re-scans its roots on every read, so the new preset appears in the preset picker immediately — select `dsh-plans` for a new session (no restart needed). Then from any directory ask:

```text
Create a plan for <your change>
```

Update an existing install with `git -C ~/.dsh/.agent-presets/dsh-plans pull`.

## Code Mode requirement

`dsh-plans` presents all tools through DSH Code Mode (`run_code` plus the generated TypeScript SDK). This avoids native function-schema incompatibilities in models that populate every optional Bash argument, while leaving the original Bash implementation, sandbox escalation checks, approvals, background jobs, and cancellation behavior unchanged.

The host must provide `codeRuntime`; the DSH Web profile already loads `dsh-code-runtime-worker-thread`. Profiles without a code runtime fail clearly while mounting the preset instead of falling back to the incompatible Native tool presentation. Presentation is fixed when an agent is composed, so open a new `dsh-plans` session after updating. Restarting the whole DSH service is not normally required, and existing sessions are not hot-migrated.
````

</details>

#### 缺口

- 没有真实规划质量/净耗时/费用、并发恢复与隐私验收。
  **影响**：只支持隔离计划观察，不推荐把纪律当执行沙箱。
  **进一步探讨**：以相同小变更对比手工计划，记录决策遗漏、模型轮次、错误写入和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 下一步可证伪的结构改进是什么？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是在保持Markdown工作流的同时，给执行交接一项可核的已接受plan hash/明确用户选择记录，并让评审使用实际受限preset而非只维护deny名单。当前已有状态/版本与模型工具可复用，增量是把“用户选了什么计划”和“子Agent能做什么”从自然语言分开，而不是再造goal执行引擎。

最小对照用未答交接、过期计划版本、评审缺模型/取消和双run同topic四类离线样本，比较错误执行、错版本接手、残留子任务和恢复时间。代价是宿主权限接口兼容、并发状态迁移、更多用户交接负担；若只读/版本错误没减少反而让简单计划更难用，就否定。不能把任何本地确认记录当外部部署/发布权限，候选本轮未实现。

#### 证据与依据

**依据 1 · 源码核查**：[skills/references/dsh-planning-workflow.md:177-193](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/skills/references/dsh-planning-workflow.md#L177-L193)

当前指令性交接和goal边界。

<details>
<summary>查看原文（17行）</summary>

```text
## DSH Goal Execution Handoff

After the plan is accepted or refinement converges, ask an explicit execution handoff question without `Auto-complete`:

1. `Execute this plan now as a DSH goal`.
2. `Stop after planning`.
3. `Other`.

If approved, stop applying this planning workflow and connect execution to the DSH goal loop:

- Call `get_goal` first. Corner case: if a goal is still pending (active or paused), do not create or replace a goal — the executor simply implements the plan with normal DSH tools and no goal tracking. A completed goal may be replaced by the new one.
- If the executor role's `confirmed_at` is `null`, ask the executor model confirmation question from `../references/state-and-config.md` before creating the goal. The goal loop runs in the CURRENT session, so the confirmed executor model is the session model: when the user picks a specific model that differs from the current session model, ask them to switch the session model in the model selector before answering the handoff question, then proceed.
- Start execution with `create_goal(objective)`. The objective is a compact brief: the absolute path of the accepted `PLAN_vN.md`, an instruction to implement its implementation items in dependency order, the verification commands to run, and the requirement that every `## Verifier Checklist` box passes before calling `update_goal` complete. Set `max_goal_rounds` only when the user explicitly requested a round cap.
- The goal loop re-prompts the session across turns until `update_goal` complete arrives, so execution persists instead of ending with the first reply. The executor is the current session using normal DSH tools; do not create a separate execution engine.
- During goal rounds, track implementation items with `todo_write` in dependency order.
- When the plan is fully implemented and verified, call `update_goal` with action complete and report the result.
- If a blocking condition persists across at least three consecutive goal rounds, call `update_goal` with action blocked and report the concrete blocking condition; do not mark blocked for difficulty or uncertainty.
```

</details>

**依据 2 · 源码核查**：[lib/plan-subagents.js:82-103](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/lib/plan-subagents.js#L82-L103)

工具接线可绑定更强角色约束。

<details>
<summary>查看原文（22行）</summary>

```text
      async execute(args, exec) {
        const parent = exec.agent
        if (!parent) throw new Error('run_plan_subagent requires a calling agent (exec.agent was undefined)')

        const request = {
          label: String(args.description ?? ''),
          prompt: [{ type: 'text', text: String(args.prompt ?? '') }],
          parent,
          toolFilter: { deny },
        }
        const modelSelector = typeof args.model === 'string' && args.model.trim() !== '' ? args.model.trim() : undefined
        if (modelSelector !== undefined) {
          try {
            request.agentOptions = await resolveAgentOptions(ctx.llm, modelSelector)
          } catch (error) {
            throw new Error(`run_plan_subagent could not resolve model "${modelSelector}": ${String(error && error.message ? error.message : error)}`)
          }
        }

        let run
        try {
          run = await ctx.subagents.start(provider, { ...request, signal: exec.signal })
```

</details>

**依据 3 · 源码核查**：[scripts/dsh_plans_state.py:206-242](https://github.com/Optim-Agent/dsh-plans/blob/f7cec536a49f548aa96503011b98f76faaf95c35/scripts/dsh_plans_state.py#L206-L242)

现有run/公共计划分离。

<details>
<summary>查看原文（37行）</summary>

```text
def start_run(workdir: Path, topic: str, skill: str, request_text: str) -> dict[str, Any]:
    config, state = _ensure(workdir)
    now = utc_now()
    stamp = now.replace("-", "").replace(":", "").replace("Z", "Z")
    topic_slug = slugify(topic)
    base_run_id = f"{stamp}-{topic_slug}"
    run_id = base_run_id
    suffix = 2
    while (state / "runs" / run_id).exists():
        run_id = f"{base_run_id}-{suffix}"
        suffix += 1
    artifact_root = artifact_root_for(workdir, config)
    date_slug = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    artifact_dir = artifact_root / f"{date_slug}-{topic_slug}"
    run_dir = state / "runs" / run_id
    run_dir.mkdir(parents=True, exist_ok=False)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    run = {
        "schema": 1,
        "run_id": run_id,
        "skill": skill,
        "topic": topic_slug,
        "request_text": request_text,
        "workdir": str(workdir),
        "artifact_dir": str(artifact_dir),
        "language_tag": config.get("language", {}).get("tag"),
        "status": "planning",
        "created_at": now,
        "updated_at": now,
    }
    atomic_write_json(run_dir / "run.json", run)
    for name in ("decisions.jsonl", "subagents.jsonl", "refs.jsonl"):
        (run_dir / name).touch(exist_ok=True)
    atomic_write_json(
        state / "active.json",
        {"run_id": run_id, "run_dir": str(run_dir), "artifact_dir": str(artifact_dir)},
    )
```

</details>

#### 缺口

- 未证明硬交接/受限评审带来的实际净收益。
  **影响**：只作研究候选，不算当前能力。
  **进一步探讨**：先离线测错版本/未授权执行与额外交互成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
