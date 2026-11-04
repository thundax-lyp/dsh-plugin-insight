# LogicProbe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[71fb550](https://github.com/AmethystLuna/logicprobe/tree/71fb55042f52e804f1a063169b98dc2202f2489e)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 3,301](https://img.shields.io/static/v1?label=npm+30d&message=3%2C301&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)
<!-- END META -->

> **功能**：检查设计和代码主张，使用可执行模型分析状态、数据和结构，并比较验证报告。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示它将模型检查、Skill 提示和报告比较接到同一会话；这不证明模型自动对应源码，也未验证实际节时。

> **主要限制**：[Q03](#research-q03) 显示未决、摘要和差异结论都有边界；同一发现从警告升级为错误可能不使增量判决失败，必须同时检查当前结果与 changed。[Q02](#research-q02) 的确认模式是提示，不应当作强制审批。

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
  - [Q01 · 面向什么任务，和人工核查及现有检查工具相比做了什么？](#detail-section-11)
  - [Q02 · 入口如何触发，工具如何接入模型引擎与用户提示？](#detail-section-12)
  - [Q03 · 模型检查的通过、未决和报告输出能证明什么？](#detail-section-13)
  - [Q04 · 依赖、成本和使用条件是什么？](#detail-section-14)
  - [Q05 · 能否提出可证伪的增量方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能够核对代码和模型的开发者可用它审阅状态机、数据迁移和设计主张，并保留人工确认。

开发者也可以人工核查源码、编写测试或使用独立模型检查器；本包的增量是会话内组合建模指引、工具和结果对比。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态模型检查 | 处理状态与迁移模型 | 结论只覆盖输入模型和检查范围 |
| 并发声明扫描 | 定位并发主张 | 入口说明不证明并发安全 |
| 报告比较 | 比较当前与基线发现 | 需同时读取当前绝对结论 |
| 格式导出 | 生成外部检查器输入 | 不等于已执行外部检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH、Node 与宿主 peer | DSH 挂载需要 | 提供服务与运行时 | 版本不符时可用性未知 |
| 可核查的源码和模型 | 模型验证需要 | 建立状态与真实实现的对应 | 无法对应时不能推断源码正确 |
| 外部模型检查器 | 特定导出结果使用时 | 消费目标格式 | 导出不等于求解器已运行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者固定源码和宿主 | 核对版本和访问权限 |
| 建模 | 开发者提取状态与性质并复核对应关系 | 对应无法核实则停止 |
| 检查 | 调用状态工具并保存完整报告 | 同时检查 verdict、未决与预算 |
| 验收 | 比较反例与真实代码 | 当前仍失败或映射不明时回到源码审查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主及计算资源成本未知 | 配置环境并建模，时间未知 | 需具备建模能力 |
| 持续 | 模型调用及计算费用未知 | 检查映射并审阅完整报告 | 无同任务对照 |
| 失败恢复 | 扩大预算或使用其他工具成本未知 | 复核截断、反例和源码 | 未决并非通过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内检查 | 工具接线及报告结构 | 真实宿主成功率 |
| 差异分析 | 对比增量并保留当前结论 | 源码缺陷召回与误报 |
| 来源记录 | 可携带注释 | 注释与源码是否真实对应 |

> **思考**：[Q03](#research-q03) 显示未决、摘要和差异结论都有边界；同一发现从警告升级为错误可能不使增量判决失败，必须同时检查当前结果与 changed。[Q02](#research-q02) 的确认模式是提示，不应当作强制审批。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示它将模型检查、Skill 提示和报告比较接到同一会话；这不证明模型自动对应源码，也未验证实际节时。

[Q02](#research-q02) 的延迟注册和会话历史防重复使集成点明确；[Q03](#research-q03) 的结果、未决和差异判决须同时由消费者理解，不能只看单一布尔值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示未决、摘要和差异结论都有边界；同一发现从警告升级为错误可能不使增量判决失败，必须同时检查当前结果与 changed。[Q02](#research-q02) 的确认模式是提示，不应当作强制审批。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在可核对源码的小状态机上试用，保存完整报告；映射无法确认或检查持续未决时回到既有审查和测试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向检查固定源码，贡献为条件性解释；未来设计是假设，运行效果和源码映射准确率未验证。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、src/tool.ts、src/engine.ts、src/report-view.ts、src/baseline.ts、src/data-tool.ts、src/compose-tool.ts、src/structure-tool.ts、src/concurrency-tool.ts、src/export-tool.ts、src/report-diff-tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧成果的场景、入口、源码映射、结果语义、依赖、成本、推荐和未验证假设；定向检查工具注册、状态工具、数据／组合／并发／结构／导出工具入口及差异报告。未逐项审计算法、其他全部工具或执行目标代码。
- 下一步：固定宿主及版本，在隔离环境比较已知缺陷模型与源码，记录注册、确认、预算耗尽、完整报告及回退结果。

**分析版本**

- **仓库**：[AmethystLuna/logicprobe](https://github.com/AmethystLuna/logicprobe)
- **版本号**：1.4.4（[固定提交 71fb550](https://github.com/AmethystLuna/logicprobe/tree/71fb55042f52e804f1a063169b98dc2202f2489e)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出源码变化触发模型映射复核的未验证假设；用已知变更盲测，若无法提高识别率或成本超过收益则否定。

固定宿主及版本，在隔离环境比较已知缺陷模型与源码，记录注册、确认、预算耗尽、完整报告及回退结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 5284 | — | — | 55491 |
| .md | example | 1 | 46 | — | — | 276 |
| .js | source | 21 | 9547 | 8510 | 1004 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 19 | 9635 | 8005 | 1128 | — |
| .mjs | test | 17 | 6168 | 5181 | 492 | — |
| .md | test | 1 | 38 | — | — | 472 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定版本如何把设计主张转换为可审阅模型结果，并明确模型、源码和报告边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向什么任务，和人工核查及现有检查工具相比做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

能阅读源码和模型的开发者可把设计、协议或重构中声称的状态行为整理成机器可处理的状态与迁移，再查看结构、反例和回归报告。手工查源码、写测试和使用独立模型检查器仍能完成部分任务；本包把 Skill 指引、模型工具、比较与导出接到 DSH 会话，增加可重复审阅入口，而不是自动证明模型真实反映源码。入口自身列出多种工具，其中并发扫描明确只发现声明，不证明线程安全。收益大小、源代码映射准确率和用户真实需求尚无对照。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-4](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/package.json#L1-L4)

作者描述检查设计和代码主张以及建模范围。

```text
{
  "name": "dsh-logicprobe",
  "version": "1.4.4",
  "description": "Verifies claims about designs and code. Facts go against the source. Behaviour goes through an executable model: state machines, protocols, composition, data models, migrations. Structure diagrams are read as dependency graphs, at one level or several. Two reports can be compared for regression. Exports UPPAAL, TLA+, PRISM and SPIN input. Ships a native DeepSeek Harness bundle that injects the verification gate into the first model step.",
```

**依据 2 · 源码核查**：[src/index.ts:79-98](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/index.ts#L79-L98)

会话提示列出工具并提示读取报告的限定。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/concurrency-tool.ts:39-42](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/concurrency-tool.ts#L39-L42)

并发工具把文本交给声明扫描器，不是并发安全证明。

```text
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return runConcurrencyScan(args.text) as unknown as JsonValue
```

**依据 4 · 源码核查**：[src/report-diff-tool.ts:44-47](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/report-diff-tool.ts#L44-L47)

报告比较工具将基线和当前报告传入 diffReports。

```text
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return diffReports(args.baseline, args.current) as unknown as JsonValue
```

#### 缺口

- 未做相同任务的独立对照
  **影响**：不能量化节时或错误发现率
  **进一步探讨**：用固定任务比较人工核查、测试和本包并核对源码映射。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口如何触发，工具如何接入模型引擎与用户提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 在宿主服务可用时把状态、数据、组合等工具注册到 tools 服务，并在 agent/pre-step 完成下游 decision 后重试注册。被拒绝的 decision 直接返回；开关关闭或会话历史已有提示时不再注入，否则在本步消息中追加提示。状态工具把调用者提供的模型与预算传给本地 runVerification，结果按 reportView 渲染。交互模式只把确认或自动模式写进提示文本；代码路径没有把用户确认作为运行验证引擎的硬性前置条件，因此不能把 ask 当作强制审批。真实宿主对注入与服务时序的效果未执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:309-345](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/index.ts#L309-L345)

工具注册依赖宿主 tools 服务。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // Optional services are registered opportunistically; base-bundle rows can
  // mount after this row applies, so registration is retried on the first
  // agent/pre-step — by then the app is fully booted.
  let providerRegistered = false
  let toolRegistered = false
  let dataToolRegistered = false
  let concurrencyToolRegistered = false
  let composeToolRegistered = false
  let exportToolRegistered = false
  let umlToolRegistered = false
  let structureToolRegistered = false
  let reportDiffToolRegistered = false
  let modeContextRegistered = false
  const registerProvider = (): void => {
    if (providerRegistered) return
    const inspect = ctx.get('cordisInspect')
    if (inspect === undefined) return
    try {
      ctx.effect(() => inspect.register(inspectProvider(config, () => toolRegistered, () => dataToolRegistered, () => concurrencyToolRegistered, () => composeToolRegistered, () => exportToolRegistered, () => umlToolRegistered, () => structureToolRegistered, () => reportDiffToolRegistered)), 'logicprobe: inspect provider')
      providerRegistered = true
    } catch (err) {
      console.warn('[logicprobe] inspect provider registration failed', err)
    }
  }
  const registerTool = (): void => {
    if (toolRegistered) return
    const tools = ctx.get('tools') as ToolRegistryLike | undefined
    if (tools === undefined) return
    try {
      ctx.effect(() => tools.register(logicProbeVerifyTool), 'logicprobe: verify tool')
      ctx.effect(() => tools.register(logicProbeDataModelVerifyTool), 'logicprobe: data verify tool')
      ctx.effect(() => tools.register(logicProbeConcurrencyScanTool), 'logicprobe: concurrency scan tool')
      ctx.effect(() => tools.register(logicProbeComposeTool), 'logicprobe: compose tool')
      ctx.effect(() => tools.register(logicProbeExportTool), 'logicprobe: export tool')
      ctx.effect(() => tools.register(logicProbeUmlTool), 'logicprobe: uml tool')
      ctx.effect(() => tools.register(logicProbeStructureTool), 'logicprobe: structure tool')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:415-424](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/index.ts#L415-L424)

pre-step 处理拒绝、开关与历史后追加消息。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    registerIntegrations()
    if (!injectionEnabled(config)) return decision
    if (gateInHistory(agent.session)) return decision
    return {
      kind: 'enter',
      messages: [...decision.messages, gateMessage(config.gateContent)],
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:215-227](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/index.ts#L215-L227)

交互策略形成提示文本。

<details>
<summary>查看原文（13行）</summary>

```text
function resolveInteraction(config: Config, session: Session): 'ask' | 'auto' {
  if (config.interaction === 'ask' || config.interaction === 'auto') return config.interaction
  return lastApprovalPolicy(session) === 'never' ? 'auto' : 'ask'
}

function modeContextText(config: Config, session: Session): string {
  const interaction = resolveInteraction(config, session)
  const lines = [
    'logicprobe: tools — `logicprobe_verify` (state machines), `logicprobe_datamodel_verify` (data models, migrations), `logicprobe_compose_verify` (two or more machines), `logicprobe_concurrency_scan` (finds concurrency claims, proves nothing), `logicprobe_export` (UPPAAL, TLA+, PRISM, SPIN), `logicprobe_uml` (render, parse, review UML), `logicprobe_structure_verify` (dependency diagrams, one or several levels), `logicprobe_report_diff` (baseline vs current).',
    'logicprobe: gate on `verdict`, never on `ok`. Reports carry `verdictReason`, `hashes` and `nextSteps`.',
    interaction === 'auto'
      ? 'logicprobe interaction=auto: do NOT call ask_user_question for model confirmation; run round-trip validation of the extracted transition table and mark the result UNCONFIRMED.'
      : 'logicprobe interaction=ask: show the extracted transition table and get user confirmation before running verification.',
```

</details>

**依据 4 · 源码核查**：[src/tool.ts:43-66](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/tool.ts#L43-L66)

工具渲染并直接把模型和选项传入引擎。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行宿主或模型
  **影响**：不能证明提示一定遵循或服务在目标环境正常注册
  **进一步探讨**：在隔离宿主记录注册、模式文本、调用与开关切换。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型检查的通过、未决和报告输出能证明什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

结果评价的是输入模型与实现的检查范围，不自动验证模型和真实源码一致。引擎区分执行成功的 ok 和按错误、警告计算的 verdict；搜索预算耗尽的部分有未决状态，不能当作性质已证明。闭合模型拒绝未声明字段，但下划线字段被忽略且不计入模型哈希，故来源注释并未因哈希绑定而验证。默认摘要会合并及限制警告显示，需要完整报告审查；对比报告的 verdict 只说明增量，当前报告仍可能失败，应同时读取 currentVerdict。未逐项审计算法正确性，不将没有看到错误当作证明。 差异身份相同但 severity 改变时被记作 changed 而非 added，增量判决仅由新增项计算，所以从 warning 升为 error 也可能得到干净的增量判决；仍应检查 changed 与 currentVerdict，后者可反映当前失败。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:330-355](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/engine.ts#L330-L355)

搜索预算耗尽表达未决。

<details>
<summary>查看原文（26行）</summary>

```text
const DEFAULT_MAX_STATES = 10_000
const DEFAULT_MAX_PERMUTATION_EVENTS = 5
/**
 * Budget for the leads-to walk, as a multiple of `maxStates`. That walk is depth-first
 * over run states, so `maxStates` does not bound it the way it bounds the breadth-first
 * explorations: an `inc`/`dec` counter whose updates are not pinned by a guard has an
 * unbounded reachable set, every run state is distinct, and the walk never revisits one.
 * The budget is shared across every start state of a single check, so a wide search
 * space cannot multiply it by the number of starts.
 */
const LEADS_TO_WALK_FACTOR = 20

function leadsToWalkBudget(options: NormalizedOptions): number {
  return Math.max(1_000, options.maxStates * LEADS_TO_WALK_FACTOR)
}

interface LeadsToWalk {
  /** Nodes still allowed, shared across every start state of one check. */
  remaining: number
}

interface LeadsToOutcome {
  /** A run from the start state that reaches none of the targets. */
  violation?: { path: PathStep[]; reason: string }
  /** The budget ran out: the property is neither refuted nor proven. */
  undecided: boolean
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:470-504](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/engine.ts#L470-L504)

错误警告生成 verdict，未决代码传到截断标志。

<details>
<summary>查看原文（35行）</summary>

```text
  return { verdict: 'fail', verdictReason: 'the tool did not run: ' + reason }
}

/**
 * Decide the verdict from finding counts. Any error-severity finding fails the review
 * even though the tool ran successfully — that gap is exactly what `verdict` closes.
 */
export function verdictOf(errors: number, warnings: number, firstCode?: string): VerdictSummary {
  if (errors > 0) {
    return {
      verdict: 'fail',
      verdictReason: String(errors) + ' error finding(s)' + (firstCode === undefined ? '' : ' (first: ' + firstCode + ')'),
    }
  }
  if (warnings > 0) {
    return { verdict: 'pass_with_findings', verdictReason: 'no error findings; ' + String(warnings) + ' warning finding(s)' }
  }
  return { verdict: 'pass', verdictReason: 'no error or warning findings' }
}

export function verdictOfFindings(findings: Array<{ code: string; severity: string }>): VerdictSummary {
  const errors = findings.filter((finding) => finding.severity === 'error')
  const warnings = findings.filter((finding) => finding.severity === 'warning')
  return verdictOf(errors.length, warnings.length, errors[0]?.code)
}

/**
 * Finding codes that mean "the search stopped before deciding", as opposed to "the
 * model is wrong". They must reach `summary.truncated`, or a caller reading only that
 * flag would take an unfinished search for a clean one.
 */
const UNDECIDED_CODES = new Set(['S7_UNDECIDED', 'A7_UNDECIDED', 'A9_LEADS_TO_UNDECIDED', 'D2_UNDECIDED'])

function hasUndecidedFinding(checks: CheckResult[]): boolean {
  return checks.some((check) => check.findings.some((finding) => UNDECIDED_CODES.has(finding.code)))
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:550-569](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/engine.ts#L550-L569)

模型校验与元数据排除语义。

<details>
<summary>查看原文（20行）</summary>

```text
export function validateModel(input: unknown): { ok: true; model: LogicModelV1 } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const bad = (path: string, message: string): void => {
    errors.push(path + ': ' + message)
  }
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: ['model: must be an object'] }
  }
  const root = input as Record<string, unknown>
  // `_`-prefixed keys are annotation metadata (provenance, verification snapshots,
  // extraction caveats). They are ignored here and excluded from the hash, so a model
  // can carry its own archive record without a sidecar that drifts away from it.
  // Everything else stays closed: a mistyped `sttes` must still be an error.
  const rejectUnknownKeys = (value: Record<string, unknown>, allowed: Set<string>, path: string): void => {
    const unexpected = Object.keys(value).filter((key) => !allowed.has(key) && !key.startsWith('_'))
    if (unexpected.length > 0) {
      bad(path + '.' + unexpected[0], 'unknown field (allowed: ' + [...allowed].join(', ') + ')')
    }
  }
  rejectUnknownKeys(root, MODEL_KEYS.root, 'model')
```

</details>

**依据 4 · 源码核查**：[src/report-view.ts:153-165](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/report-view.ts#L153-L165)

摘要限制警告并提示还有内容。

<details>
<summary>查看原文（13行）</summary>

```text
  for (const [state, group] of stateGroups) {
    lines.push(`  ${state} (${String(group.events.length)}) [${group.severity}/${group.code}]: ${group.events.join(', ')}`)
  }
  const rendered = collapse(singles.map((finding) => findingLine(finding, options)))
  const budget = options.maxFindingsPerCheck
  const kept: string[] = []
  let dropped = 0
  for (const line of [...lines, ...rendered]) {
    if (kept.length < budget || line.includes('/error]')) kept.push(line)
    else dropped += 1
  }
  if (dropped > 0) kept.push(`  +${String(dropped)} more warning line(s) — ask for this check by id to see them all`)
  if (repeats > 0) kept.push(`  (${String(repeats)} finding(s) here repeat facts already reported above)`)
```

</details>

**依据 5 · 源码核查**：[src/baseline.ts:96-115](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/baseline.ts#L96-L115)

增量判决和当前判决独立。

<details>
<summary>查看原文（20行）</summary>

```text
function diffOf(added: number, removed: number, addedErrors: number, firstCode?: string): VerdictSummary {
  if (addedErrors > 0) {
    return {
      verdict: 'fail',
      verdictReason: String(added) + ' new finding(s) (' + String(addedErrors) + ' error)' + (firstCode === undefined ? '' : ' (first: ' + firstCode + ')'),
    }
  }
  if (added > 0) {
    return { verdict: 'pass_with_findings', verdictReason: String(added) + ' new warning finding(s), no new errors' }
  }
  if (removed > 0) {
    return { verdict: 'pass', verdictReason: 'no new findings; ' + String(removed) + ' finding(s) resolved' }
  }
  return { verdict: 'pass', verdictReason: 'no new findings, nothing resolved' }
}

/**
 * Compare a baseline report with the current one. The verdict describes the *delta*
 * (a new error fails it), while `currentVerdict` keeps the absolute result visible.
 */
```

</details>

**依据 6 · 源码核查**：[src/baseline.ts:116-144](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/baseline.ts#L116-L144)

相同身份 severity 或消息变更进入 changed；delta 只统计 added。

<details>
<summary>查看原文（29行）</summary>

```text
export function diffReports(baseline: unknown, current: unknown): BaselineReport {
  const before = flattenReportFindings(baseline)
  const after = flattenReportFindings(current)
  const beforeByIdentity = new Map<string, ReportFinding>()
  for (const finding of before) beforeByIdentity.set(findingIdentity(finding), finding)
  const seen = new Set<string>()
  const added: ReportFinding[] = []
  const changed: BaselineChange[] = []
  for (const finding of after) {
    const identity = findingIdentity(finding)
    seen.add(identity)
    const previous = beforeByIdentity.get(identity)
    if (previous === undefined) {
      added.push(finding)
      continue
    }
    if (previous.severity !== finding.severity || previous.message !== finding.message) {
      changed.push({
        identity,
        code: finding.code,
        before: { severity: previous.severity, message: previous.message },
        after: { severity: finding.severity, message: finding.message },
      })
    }
  }
  const removed = before.filter((finding) => !seen.has(findingIdentity(finding)))
  const addedErrors = added.filter((finding) => finding.severity === 'error')
  const addedWarnings = added.filter((finding) => finding.severity === 'warning')
  const delta = diffOf(added.length, removed.length, addedErrors.length, addedErrors[0]?.code)
```

</details>

#### 缺口

- 模型源码映射与各检查算法尚未系统验证
  **影响**：无法将模型结果提升为源程序正确性的证明
  **进一步探讨**：固定模型和源码，以已知缺陷及独立检查器验证覆盖和反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本和使用条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node 20 以上、DSH 兼容范围和多项宿主 peer 依赖，声明不等于本次兼容实测。用户需要能够提取状态、事件和性质并核对来源，检查大型模型还可能受到预算限制。首次需准备宿主和模型，持续工作需维护源码对应与读报告，失败时需检查截断、未决和差异结果；实际时间、计算资源及外部求解器费用均未知。适合先拿边界明确的小型状态机做可控试用；无法核对模型、持续未决或当前报告仍失败时应停止依赖自动判定，回到源码审查、现有测试及适用的独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-43](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/package.json#L25-L43)

声明 DSH 版本及客户端接口。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.1.0-rc.7"
    },
    "category": "skill",
    "displayName": "逻辑探针",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
      ]
    },
    "compatibility": {
      "dsh": "^0.1.0-rc.7 || ^0.1.1-rc.1 || ^0.1.2-alpha.2 || ^0.1.2-alpha.3 || ^0.1.2-alpha.4 || ^0.1.2-alpha.5 || ^0.1.2-rc.1 || ^0.1.3-alpha.1 || ^0.1.3-alpha.2 || ^0.1.5-alpha.1 || ^0.1.5-rc.1 || ^0.1.5-alpha.2 || ^0.1.5-rc.2 || ^0.1.5-rc.3 || ^0.1.6-alpha.1 || ^0.1.6-alpha.2 || ^0.1.7-alpha.1 || ^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
```

</details>

**依据 2 · 源码核查**：[package.json:92-99](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/package.json#L92-L99)

声明宿主 peer 依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-skill-filesystem": "^0.1.0-rc.8 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.2",
    "@deepseek-ai/schemastery": "^3.18.4"
```

**依据 3 · 源码核查**：[package.json:144-148](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/package.json#L144-L148)

声明 Node 版本条件。

```text
    "dsh"
  ],
  "engines": {
    "node": ">=20"
  }
```

**依据 4 · 源码核查**：[src/tool.ts:21-46](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/tool.ts#L21-L46)

输入模型、预算和完整视图。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/baseline.ts:146-156](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/baseline.ts#L146-L156)

对比结果给出当前失败仍存在的提醒。

<details>
<summary>查看原文（11行）</summary>

```text
  const nextSteps: string[] = []
  if (addedErrors.length > 0) {
    nextSteps.push('Fix or explicitly accept the ' + String(addedErrors.length) + ' new error finding(s) before calling this slice done: the baseline is what "not worse" is measured against.')
  } else if (added.length > 0) {
    nextSteps.push('The new warnings are not failures, but they are new: decide per finding whether the change introduced them or the baseline was incomplete.')
  } else {
    nextSteps.push('No new findings: re-record the baseline with this report if the slice is accepted, so the next comparison starts from it.')
  }
  if (changed.length > 0) nextSteps.push('Review the ' + String(changed.length) + ' changed finding(s): the same locator now reports something different, which usually means the fix moved the problem.')
  if (removed.length > 0) nextSteps.push(String(removed.length) + ' finding(s) from the baseline are gone — confirm they were fixed rather than renamed out of the report (a renamed check or a reworded message changes the identity).')
  if (verdictOfReport(current) === 'fail') nextSteps.push('The current report still fails on its own terms; the delta being clean does not make the run clean.')
```

</details>

#### 缺口

- 未测宿主兼容、成本和任务效果
  **影响**：无法预测试用收益和总成本
  **进一步探讨**：在隔离环境记录模型准备时间、资源、报告与复核工作。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否提出可证伪的增量方向？

**研究主题**：新假设与验证

#### 完整回答

可探索把每条状态转移的人工确认与对应源码版本绑定，并在源码位置变化后要求复核；它比当前允许作为下划线元数据保存的注释多一条可执行失效规则。现有提示已经要求源码核查和确认，不能将这些既有能力称为新增贡献。用一组带已知变化的协议代码盲测审查者是否识别过期映射，并记录复核耗时；若无更高的过期识别率或复核成本超过收益，则否定这一方向。这只是未验证设想，不能归入现有能力或创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:550-566](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/engine.ts#L550-L566)

下划线注释被忽略并排除哈希。

<details>
<summary>查看原文（17行）</summary>

```text
export function validateModel(input: unknown): { ok: true; model: LogicModelV1 } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const bad = (path: string, message: string): void => {
    errors.push(path + ': ' + message)
  }
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: ['model: must be an object'] }
  }
  const root = input as Record<string, unknown>
  // `_`-prefixed keys are annotation metadata (provenance, verification snapshots,
  // extraction caveats). They are ignored here and excluded from the hash, so a model
  // can carry its own archive record without a sidecar that drifts away from it.
  // Everything else stays closed: a mistyped `sttes` must still be an error.
  const rejectUnknownKeys = (value: Record<string, unknown>, allowed: Set<string>, path: string): void => {
    const unexpected = Object.keys(value).filter((key) => !allowed.has(key) && !key.startsWith('_'))
    if (unexpected.length > 0) {
      bad(path + '.' + unexpected[0], 'unknown field (allowed: ' + [...allowed].join(', ') + ')')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:220-227](https://github.com/AmethystLuna/logicprobe/blob/71fb55042f52e804f1a063169b98dc2202f2489e/src/index.ts#L220-L227)

现有流程已有人工确认或未确认提示。

```text
function modeContextText(config: Config, session: Session): string {
  const interaction = resolveInteraction(config, session)
  const lines = [
    'logicprobe: tools — `logicprobe_verify` (state machines), `logicprobe_datamodel_verify` (data models, migrations), `logicprobe_compose_verify` (two or more machines), `logicprobe_concurrency_scan` (finds concurrency claims, proves nothing), `logicprobe_export` (UPPAAL, TLA+, PRISM, SPIN), `logicprobe_uml` (render, parse, review UML), `logicprobe_structure_verify` (dependency diagrams, one or several levels), `logicprobe_report_diff` (baseline vs current).',
    'logicprobe: gate on `verdict`, never on `ok`. Reports carry `verdictReason`, `hashes` and `nextSteps`.',
    interaction === 'auto'
      ? 'logicprobe interaction=auto: do NOT call ask_user_question for model confirmation; run round-trip validation of the extracted transition table and mark the result UNCONFIRMED.'
      : 'logicprobe interaction=ask: show the extracted transition table and get user confirmation before running verification.',
```

#### 缺口

- 设想尚无实现或对照
  **影响**：不能断言能提高审查质量
  **进一步探讨**：按已知源码变更设计盲测并预先设置否定条件。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
