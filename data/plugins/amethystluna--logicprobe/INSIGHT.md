# LogicProbe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e1b5ac4](https://github.com/AmethystLuna/logicprobe/tree/e1b5ac4a426c43878863092bc79387700a8189cb)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,723](https://img.shields.io/static/v1?label=npm+30d&message=2%2C723&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)
<!-- END META -->

> **实现功能**：为 DSH 提供状态机、数据模型、结构、并发线索和 UML 检查工具与 Skill。

> **核心亮点**：相对单靠模型口头审查，增量在封闭模型语言、可执行反例、前后版本回归与结构化判决的组合；模型转换正确性仍由人和Agent承担。[Q01](#research-q01)

> **风险与缺陷**：最强证据是引擎明确输出预算耗尽未决和覆盖注记，但被检对象仍是用户提供的抽象模型；模型通过无法推出源程序或真实并发正确。[Q03](#research-q03)

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
  - [Q01 · 可执行模型怎样补足口头评审？](#detail-section-11)
  - [Q02 · 输入模型如何进入引擎并约束结果？](#detail-section-12)
  - [Q03 · 预算与抽象遗漏会否制造通过幻觉？](#detail-section-13)
  - [Q04 · 什么规模的任务值得付出建模成本？](#detail-section-14)
  - [Q05 · 源码映射清单能否降低抽象遗漏？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合愿意复核抽象模型的开发者，用小型状态机、迁移或架构模型寻找可追溯反例和回归。交付必须包含覆盖与未决边界。

简单直线代码先用现有单测或人工审查；明确状态机才比较口头评审、此引擎与专业模型检查器。统一缺陷集合、模型信息及预算，报告建模时间和漏建，而非仅输出检查项数。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态机及组合检查 | 不变量和回归反例 | 只约束输入模型，受探索预算限制 |
| 数据/结构/UML工具 | 迁移与架构审阅入口 | 各模型需独立校验 |
| 并发线索扫描 | 路由值得建模的声明 | 扫描本身不证明并发正确 |
| 专业格式导出 | 衔接外部形式化工具 | 不等于已执行外部检查器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH工具/Skill接口 | 插件必需 | 注册检查入口和指导 | 需固定宿主代际 |
| 明确状态机与不变量 | 检查必需 | 构造可执行抽象 | 缺建模则无法证明真实行为 |
| 宿主模型 | Agent协作必需 | 建模和解释报告 | 输出仍要人核 |
| 专业外部检查器 | 更强语义可选 | 实时/并发等深入验证 | 导出存在不等已运行求解 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定题 | 开发者挑小型协议及不变量 | 明确真实代码映射 |
| 建模 | Agent与开发者列失败转移 | Schema合法且人工复核 |
| 运行检查 | 用户在授权环境调用工具 | 看verdict、反例、覆盖和undecided |
| 回归 | 提供beforeModel及stateMapping | 核改动前后模型及源码一致 |
| 处理未决 | 用户补路径/预算或外部求解 | 不把未发现当证明 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地Node与可选模型费未知 | 学习Schema并建模，耗时未知 | 模型是主要专业门槛 |
| 持续使用 | 状态探索受预算约束 | 同步源码、模型和不变量 | 建模成本不能忽略 |
| 失败恢复 | 重跑、扩大预算或外部检查器资源 | 判断未决、修正模型与映射 | 预算耗尽不能算无反例 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可复核反例 | 引擎输出检查与判决 | 对真实代码的缺陷召回率 |
| 回归与报告 | beforeModel和哈希接口存在 | 比人工审查节时多少 |

> **思考**：最强证据是引擎明确输出预算耗尽未决和覆盖注记，但被检对象仍是用户提供的抽象模型；模型通过无法推出源程序或真实并发正确。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对单靠模型口头审查，增量在封闭模型语言、可执行反例、前后版本回归与结构化判决的组合；模型转换正确性仍由人和Agent承担。[Q01](#research-q01)

相对单靠模型口头审查，增量在封闭模型语言、可执行反例、前后版本回归与结构化判决的组合；模型转换正确性仍由人和Agent承担。[Q01](#research-q01)

入口对schemastery volatile能力探测可避免旧宿主导入时直接失败；闭合字段模型和未决判决避免把未探索完当证明。可借鉴显式不确定性传播，但迁移需保持模型语言和报告消费者的verdict契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

最强证据是引擎明确输出预算耗尽未决和覆盖注记，但被检对象仍是用户提供的抽象模型；模型通过无法推出源程序或真实并发正确。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合愿意人工检查模型的开发者在小型状态机上试用。先核对模型与源码关系，读取verdict、覆盖和未决，不把pass当上线许可。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tool.ts、src/engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查DSH入口、主验证工具和状态机引擎；数据模型、UML等工具按入口能力确认，未完成各算法全审计。
- 下一步：按 [Q05](#research-q05) 给已知缺陷的同一模型加入转移—源码映射清单，盲测漏建和发现率、记录建模/解释时间；未决必须独立计数，不能归通过。

**分析版本**

- **仓库**：[AmethystLuna/logicprobe](https://github.com/AmethystLuna/logicprobe)
- **版本号**：1.4.2（[固定提交 e1b5ac4](https://github.com/AmethystLuna/logicprobe/tree/e1b5ac4a426c43878863092bc79387700a8189cb)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把模型每个转移绑定到源码片段及声明假设，要求模型变更时复核映射，以降低抽象遗漏；用已知缺陷比较映射前后的漏检与建模时间，收益不抵成本则否定。[Q05](#research-q05)

按 [Q05](#research-q05) 给已知缺陷的同一模型加入转移—源码映射清单，盲测漏建和发现率、记录建模/解释时间；未决必须独立计数，不能归通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 5119 | — | — | 54071 |
| .md | example | 1 | 46 | — | — | 276 |
| .js | source | 21 | 9547 | 8510 | 1004 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 19 | 9635 | 8005 | 1128 | — |
| .mjs | test | 17 | 6168 | 5181 | 492 | — |
| .md | test | 1 | 38 | — | — | 472 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：AmethystLuna/logicprobe 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可执行模型怎样补足口头评审？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对设计中可枚举的状态、转移和不变量，工具提供重复执行的检查与反例，交付物是模型、判决、哈希和具体问题。相比LLM口头同意，确定性执行能暴露路径与回归。入口明确要求读verdict而非ok，并承认并发扫描不构成证明。贡献在连接建模和Agent审阅，不是让任意程序自动获得形式化证明，也未证实优于专业求解器。

直接参照是Agent阅读源码后给口头评价，或开发者手工用专业模型检查器。前者缺可重复判决，后者表达能力与求解深度可能更强但接入成本不同。本插件封闭模型和任务路由减少手工接线，仍需开发者确认模型对应真实业务，不能按检查数量判断覆盖充分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:79-100](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/index.ts#L79-L100)

工具分工、verdict语义与并发边界。

<details>
<summary>查看原文（22行）</summary>

```text
const DEFAULT_GATE_CONTENT = `
<EXTREMELY_IMPORTANT>
Plugin logicprobe is active. It checks claims about designs and code: facts against the source, behaviour as an executable model.

**Unsure whether a check applies?** Load \`logicprobe\` first. It is the entry point: it owns the doctrine, the model schema, the depth rules and the routing to its siblings.

**Load the skill that matches the claim**: \`logicprobe\` (entry point; claim and behaviour checks), \`logicprobe-uml\` (diagrams), \`logicprobe-structure\` (architecture, dependencies), \`logicprobe-concurrency\` (concurrency claims), \`logicprobe-datamodel\` (data models, migrations).

**Tools** (dsh):

- \`logicprobe_verify\` — state machines: structural checks, adversarial probes, budgets, deadlines, before/after regression.
- \`logicprobe_datamodel_verify\` — data models and migrations: structure, migration coverage, copy consistency, rollback, before/after data.
- \`logicprobe_compose_verify\` — two or more machines: deadlock, and a rendezvous that never fires.
- \`logicprobe_concurrency_scan\` — finds concurrency claims and routes them. It proves nothing about concurrency.
- \`logicprobe_export\` — UPPAAL, TLA+, PRISM and SPIN input from a verified model.
- \`logicprobe_uml\` — render, parse or review a UML diagram.
- \`logicprobe_structure_verify\` — dependency review of a structure diagram, at one level or several.
- \`logicprobe_report_diff\` — baseline against current: what a change added, removed or changed.

**Read a report**: gate on \`verdict\` (\`pass\`, \`pass_with_findings\`, \`fail\`), never on \`ok\`. Reports carry \`verdictReason\`, \`hashes\` and \`nextSteps\`. Keys starting with \`_\` are notes: ignored, and left out of the model hash. A tool prints the report body: passing checks stay in the inventory line, repeated facts are grouped, and warning evidence is omitted — pass \`reportView: "full"\` only when you need the structured report itself, which \`logicprobe_report_diff\` consumes.

</EXTREMELY_IMPORTANT>
```

</details>

**依据 2 · 源码核查**：[src/tool.ts:8-20](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/tool.ts#L8-L20)

状态机和beforeModel检查的具体接口。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Model-visible DSH tool wrapping the bundled TypeScript verification engine.
 * The model passes a LogicModelV1 object; the engine validates it and returns
 * the 22-check report (S1-S8 structural, A1-A14), or a 26-check
 * report when beforeModel is supplied (D1 behavioral preservation, D2
 * invariant continuity, D3 regression delta, D4 deadlock/liveness regression).
 * This is the dsh-native path: the model is built and run here, with no
 * template to fill in by hand.
 */
export const logicProbeVerifyTool = defineTool({
  name: LOGICPROBE_VERIFY_TOOL_NAME,
  description:
    'Run state-machine verification on a LogicModelV1 object. Model shape: schemaVersion 1, init, states ({id, terminal?}), transitions ({from, event, to, guard?, updates?, cost?}), plus optional variables, invariants, concurrentPairs, boundaryChecks, resourcePairs, idempotentEvents and narrative. Guards are structured: {variable, op, value}, {all}, {any} or {not}. Invariants cover never-states, var-in-range, event-before-state, leads-to, sequence, atomicity, budget, probability and deadline. `cost` defaults to 1 and drives the A12 budget check. `weight` defaults to 1 and makes the model a DTMC for A13. A state with `maxTicks` needs top-level `tickEvents`; A14 reports over-residency. The schema is closed: an undeclared key is a validation error. Keys starting with `_` are metadata: ignored, kept out of `modelHash`, and echoed as `metadataKeys`. Variables support monotonic inc and dec. Pass `beforeModel` and `stateMapping` to add the D1-D4 regression. Read `verdict`, never `ok`. The full schema is in the `logicprobe` skill: references/dsh-model-schema.md.',
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入模型如何进入引擎并约束结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

DSH工具接受model及可选beforeModel、stateMapping、探索上限，直接调用runVerification，不需运行被审查程序。引擎模型定义包含守卫、更新、成本与权重；未知字段拒绝有助于避免拼错导致路径被静默裁掉。有效结果仍依赖模型建得正确，工具参数完整只能证明格式，不证明抽象忠实。

从工具入口可见输入不是任意项目源码，而是明确构造的LogicModelV1；runVerification直接处理该对象，reportView控制可读摘要或结构化报告。beforeModel/stateMapping能增加前后行为比较，但两套模型一致地遗漏同一种失败时，回归仍可能正常。封闭Schema对拼写错误有价值，不能补回未表达的实际事件。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:21-67](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/tool.ts#L21-L67)

参数和调用链。

<details>
<summary>查看原文（47行）</summary>

```text
  parameters: {
    model: {
      type: 'json',
      required: true,
      description: 'LogicModelV1 state machine model to verify.',
    },
    maxStates: {
      type: 'integer',
      description: 'Maximum runtime states to explore. Default 10000.',
    },
    maxPermutationEvents: {
      type: 'integer',
      description: 'Maximum event count for A3 order permutation. Default 5.',
    },
    beforeModel: {
      type: 'json',
      description: 'Optional BEFORE LogicModelV1 state machine model for refactoring/migration regression comparison.',
    },
    stateMapping: {
      type: 'json',
      description: 'Optional object mapping BEFORE state ids to AFTER state ids. Omit for identity mapping (same state names).',
    },
    reportView: {
      type: 'string',
      enum: ['digest', 'full'],
      description: 'digest (default) prints the readable body; full prints the structured report, which logicprobe_report_diff needs.',
    },
  },
  output: {
    schema: {
      type: 'json',
      description: 'logicprobe verification report with summary and per-check findings.',
    },
    render(args, value) {
      return [{ type: 'text' as const, text: renderReportText(value, { full: args.reportView === 'full' }) }]
    },
  },
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return runVerification(args.model, {
      maxStates: args.maxStates,
      maxPermutationEvents: args.maxPermutationEvents,
      beforeModel: args.beforeModel,
      stateMapping: args.stateMapping as Record<string, string> | undefined,
    }) as unknown as JsonValue
  },
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:101-120](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/engine.ts#L101-L120)

封闭Schema拒绝未知字段的理由。

<details>
<summary>查看原文（20行）</summary>

```text
/** Allowed keys per invariant kind — the schema is closed, so anything else is a typo or an unsupported feature. */
const INVARIANT_KEYS: Record<string, Set<string>> = {
  'never-states': new Set(['id', 'description', 'kind', 'states']),
  'var-in-range': new Set(['id', 'description', 'kind', 'variable', 'min', 'max', 'when']),
  'event-before-state': new Set(['id', 'description', 'kind', 'event', 'state']),
  'leads-to': new Set(['id', 'description', 'kind', 'from', 'to']),
  'sequence': new Set(['id', 'description', 'kind', 'events']),
  'atomicity': new Set(['id', 'description', 'kind', 'events', 'commit', 'rollback']),
  'budget': new Set(['id', 'description', 'kind', 'budget']),
  'probability': new Set(['id', 'description', 'kind', 'target', 'op', 'p']),
}

const KNOWN_INVARIANT_KINDS = new Set(Object.keys(INVARIANT_KEYS))

/**
 * Declared keys per model part. The model schema is closed: a key that is not
 * declared is a typo or an unsupported feature, and silently ignoring it can make
 * the engine report a property that the model does not actually have (a mistyped
 * guard variable reads as an always-false guard, which prunes real paths and can
 * yield a false "no deadlock"). Rejecting is the only safe option for a verifier.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算与抽象遗漏会否制造通过幻觉？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

引擎对leads-to探索耗尽明确返回undecided，正面避免未发现反例被误当证明；时间词覆盖注记也区分路径预算与硬实时语义。但这些约束只检查模型，如果漏建失败转移或错误地抽象共享状态，模型通过仍可能对应错误程序。Schema封闭性解决拼写与形式问题，无法替代源码—模型一致性检查。

预算未决是warning并进入检查结果，读者应同时检查verdict、覆盖注记和nextSteps，不能只见工具调用成功或局部pass就放行。实时、抢占并发和混合连续系统有明确语义边界，导出到专业求解器的文件也不代表已执行外部求解。关键采用门槛是抽象范围和目标性质可枚举、可由人复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:2537-2546](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/engine.ts#L2537-L2546)

预算耗尽必须保留未决。

<details>
<summary>查看原文（10行）</summary>

```text
 * the walk is **budgeted**, and it stores a **parent link** per node instead of a copy
 * of the path. Without the budget an unbounded counter makes the run graph infinite, so
 * the three colours above never repeat a key and the walk never returns; without the
 * parent link every frame retains its own copy of the path, which grows the walk's
 * memory quadratically in its depth. Either one alone turns "the model is wrong" into
 * an out-of-memory abort, which is the failure this function must not have.
 *
 * An exhausted budget is reported as `undecided`, never as `undefined`: a walk that
 * did not finish has not proven that every run reaches a target.
 */
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:2609-2638](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/engine.ts#L2609-L2638)

未决进入检查结果。

<details>
<summary>查看原文（30行）</summary>

```text
    const budget = leadsToWalkBudget(options)
    const walk: LeadsToWalk = { remaining: budget }
    for (const runtime of exploration.reachable) {
      if (runtime.state !== invariant.from) continue
      const outcome = findLeadsToBadPath(model, runtime, targets, label, walk)
      if (outcome.undecided) {
        findings.push({
          code: 'A9_LEADS_TO_UNDECIDED',
          severity: 'warning',
          message: 'Leads-to invariant "' + invariant.id + '" is undecided: the walk spent its budget of ' + budget + ' steps from ' + invariant.from + ' without finding a run that avoids ' + label + ', or proving that none exists. Absence is not proven.',
          evidence: { invariant },
        })
        break
      }
      if (outcome.violation !== undefined) {
        findings.push({
          code: 'A9_LEADS_TO_VIOLATION',
          severity: 'error',
          message: 'Leads-to invariant "' + invariant.id + '" violated from ' + invariant.from + ': ' + outcome.violation.reason,
          path: outcome.violation.path,
          evidence: { invariant },
        })
        break
      }
    }
  }
  const undecided = findings.some((finding) => finding.code === 'A9_LEADS_TO_UNDECIDED')
  return checkResult('A9', 'Leads-To', findings, findings.length === 0
    ? 'All leads-to invariants hold'
    : undecided ? 'Leads-to undecided: the search budget ran out' : 'Leads-to findings: ' + findings.length)
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:3160-3170](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/engine.ts#L3160-L3170)

时间语义边界。

<details>
<summary>查看原文（11行）</summary>

```text
    for (const action of state.onEntry ?? []) names.push(action)
    for (const action of state.onExit ?? []) names.push(action)
  }
  for (const transition of model.transitions) names.push(transition.event)
  const corpus = names.join(' ')
  const notes: string[] = []
  if (TIMING_VOCABULARY.test(corpus)) {
    notes.push('The model references time-like vocabulary (timeout/watchdog/timer/deadline...). logicprobe verifies ordering, counts, and path budgets (A12) but not hard real-time semantics: deadlines, periods, and clock invariants need a timed model checker (e.g. UPPAAL).')
  }
  if (PREEMPTION_VOCABULARY.test(corpus)) {
    notes.push('The model references preemption/concurrency vocabulary (ISR/IRQ/task/interrupt...). logicprobe models event-order interleavings (A2/A3) but not preemptive concurrency; absolute claims such as thread-safe or interrupt-safe need dedicated verification (TSan, CBMC, or a model checker such as TLA+).')
```

</details>

#### 缺口

- 模型到真实程序的忠实性缺少独立测量
  **影响**：决定缺陷漏检和采用可信度
  **进一步探讨**：让独立审阅者对源码、模型和遗漏路径进行盲审并比较已知缺陷。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么规模的任务值得付出建模成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议先选小型协议或明确状态机，人工写或复核不变量，以反例定位作为目标。模型学习、源码映射、预算未决解释是主要人工成本；本地引擎执行不代表总工作免费。若只是简单直线代码，现有测试或人工审查可能更省。工具10秒超时与10000默认探索状态是操作上限，不是交付耗时或正确率。

一次合格任务应同时交付可复核模型、业务不变量、反例或有边界的未发现结论，并由源码映射确认。失败恢复可能是缩小模型、扩大合理预算、补建失败路径或改用专业检查器；多跑一次并不自动减少未知。以缺陷发现和建模/解释工时比较，未知金额与收益不补0。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:27-33](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/tool.ts#L27-L33)

探索参数是预算而非收益。

```text
    maxStates: {
      type: 'integer',
      description: 'Maximum runtime states to explore. Default 10000.',
    },
    maxPermutationEvents: {
      type: 'integer',
      description: 'Maximum event count for A3 order permutation. Default 5.',
```

**依据 2 · 源码核查**：[src/tool.ts:58-67](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/tool.ts#L58-L67)

工具超时与直接执行引擎。

<details>
<summary>查看原文（10行）</summary>

```text
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return runVerification(args.model, {
      maxStates: args.maxStates,
      maxPermutationEvents: args.maxPermutationEvents,
      beforeModel: args.beforeModel,
      stateMapping: args.stateMapping as Record<string, string> | undefined,
    }) as unknown as JsonValue
  },
```

</details>

#### 缺口

- 同条件缺陷召回与总人工时间未知
  **影响**：不能量化收益或推广复杂系统
  **进一步探讨**：比较同一缺陷集的测试、人工与模型检查总投入及合格发现数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 源码映射清单能否降低抽象遗漏？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每条关键转移和不变量绑定源码范围及假设，源码变化后重新确认映射。既有哈希和beforeModel提供版本基础，但不能自动发现漏建。新清单增加可追溯审查约束而非新求解能力。用已知缺陷比较无映射与有映射两组的漏建率、发现率和建模时间；若额外记录没有改善漏检，或耗时显著超过收益，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:35-46](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/tool.ts#L35-L46)

beforeModel与报告模式是设计基础。

<details>
<summary>查看原文（12行）</summary>

```text
    beforeModel: {
      type: 'json',
      description: 'Optional BEFORE LogicModelV1 state machine model for refactoring/migration regression comparison.',
    },
    stateMapping: {
      type: 'json',
      description: 'Optional object mapping BEFORE state ids to AFTER state ids. Omit for identity mapping (same state names).',
    },
    reportView: {
      type: 'string',
      enum: ['digest', 'full'],
      description: 'digest (default) prints the readable body; full prints the structured report, which logicprobe_report_diff needs.',
```

</details>

**依据 2 · 源码核查**：[src/index.ts:98-98](https://github.com/AmethystLuna/logicprobe/blob/e1b5ac4a426c43878863092bc79387700a8189cb/src/index.ts#L98-L98)

哈希及判决契约支持追溯。

```text
**Read a report**: gate on \`verdict\` (\`pass\`, \`pass_with_findings\`, \`fail\`), never on \`ok\`. Reports carry \`verdictReason\`, \`hashes\` and \`nextSteps\`. Keys starting with \`_\` are notes: ignored, and left out of the model hash. A tool prints the report body: passing checks stay in the inventory line, repeated facts are grouped, and warning evidence is omitted — pass \`reportView: "full"\` only when you need the structured report itself, which \`logicprobe_report_diff\` consumes.
```

#### 缺口

- 源码映射机制和收益未实现验证
  **影响**：不能计入当前能力和创新分
  **进一步探讨**：先以少量故意遗漏的失败路径开展盲审对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
