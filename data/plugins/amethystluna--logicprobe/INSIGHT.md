# logicprobe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a264c40](https://github.com/AmethystLuna/logicprobe/tree/a264c4018b02d24e2b2103c772ca431e21c16e65)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,926](https://img.shields.io/static/v1?label=npm+30d&message=2%2C926&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-logicprobe)
<!-- END META -->

> **实现功能**：以八个工具和 Skill 对状态机、数据模型、UML/依赖图与报告差异做模型级核验。

> **核心亮点**：把多类形式化/结构检查、报告对比与外部导出汇入 DSH 工具集；详见[Q01](#research-q01)。

> **风险与缺陷**：模型转换表的用户确认在 Skill 层，verify 工具不校验来源；ok 不等于通过，截断不可当验证成功；详见[Q02](#research-q02)。 同步引擎不接signal，10秒注册期限非强停，maxStates非总资源预算。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 八个工具与 Skill 门禁各解决什么问题？](#detail-section-11)
  - [Q02 · verdict 能证明源码正确性或模型抽取准确吗？](#detail-section-12)
  - [Q03 · 部署并获得可信报告的完整成本是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：核查设计/代码声称，在明示模型边界下找反例、回归与依赖图问题。

纯人工审设计/源码或模型自由文本判断，缺可执行模型与明确 verdict/截断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| logicprobe_verify | 状态机 S/A 检查与前后回归 | 仅所给模型；截断未决 |
| logicprobe_datamodel_verify | 数据模型/迁移审查 | 需 DataModelV1 |
| logicprobe_concurrency_scan | 找并发声称并路由 | 不证明并发安全 |
| logicprobe_compose_verify | 多状态机握手/死锁 | 需组合模型 |
| logicprobe_export | 生成外部验证器输入 | 导出不等于外部验证已运行 |
| logicprobe_uml | 图 render/parse/review | 图族和往返保真限制 |
| logicprobe_structure_verify | 审依赖图与允许矩阵 | 图通过不证明源码依赖 |
| logicprobe_report_diff | 对比 baseline/current 报告 | 需同族结构化报告 |
| Skill/首步门禁 | 指导抽取、确认与判读 | 文本纪律，不是引擎保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills/tools/agent 等 peer | DSH 路线必需 | 注册八工具和 Skill | 原生工具不可用 |
| LogicModelV1/图与来源证据 | 相应核验必需 | 定义要检查的系统 | pass 不能代表源码 |
| Python 3.8+ 与仓库 CLI | 非 DSH 路线可选 | 命令行引擎 | npm 包不含 CLI |
| 外部 UPPAAL/TLA+/PRISM/SPIN | 仅导出后复验需要 | 深层时序/概率分析 | 本工具仅产输入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 人工列声称/源码锚点并抽状态表 | 表与源码逐项可追溯 |
| 确认 | 用户核模型；auto 时标 UNCONFIRMED | 不把遗漏建模当引擎通过 |
| 核验 | 按领域调用对应工具、记录 hash/verdict | 关注 fail、截断和未验证项 |
| 验收/恢复 | 人工对照代码与报告、必要时缩模型复跑 | 代码结论不超出模型范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH peer 或仓库 Python CLI、模型/计算资源；金额未知 | 抽取源码到模型、核状态/转移/证据；工时未知 | npm 不含 Python CLI |
| 持续使用 | 运行模型检查、状态空间与报告存储；CPU/token 未知 | 审 verdict/截断/覆盖、维护 baseline；耗时未知 | maxStates非总CPU/队列硬限，10秒注册不保证同步计算停止 |
| 失败恢复 | 重建模型/缩小搜索/复跑可能追加计算；费用未知 | 排抽取漏项、修模型、复核代码差异；工时未知 | 检出率未独立测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型检查 | 八工具与引擎检查实现（Q01） | 源码抽取忠实度 |
| 判据 | verdict、truncated 可区分（Q02） | 使用者是否误读 |
| 回归/导出 | 源码有 report_diff/export（Q01） | 外部验证器结果 |

> **思考**：模型转换表的用户确认在 Skill 层，verify 工具不校验来源；ok 不等于通过，截断不可当验证成功；详见[Q02](#research-q02)。 同步引擎不接signal，10秒注册期限非强停，maxStates非总资源预算。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把多类形式化/结构检查、报告对比与外部导出汇入 DSH 工具集；详见[Q01](#research-q01)。

把多类形式化/结构检查、报告对比与外部导出汇入 DSH 工具集；详见[Q01](#research-q01)。

八工具共用版本化模型/报告、hash、基线对比，首步门禁提醒报告判读。

注册timeoutMs=10000不是同步引擎的硬停止保证。verify.execute直接同步调用runVerification，没有exec参数或协作AbortSignal；explore在同一线程while队列中处理状态，先加入reachable再判断length>maxStates，因此可含上限后一状态。maxStates约束已访问状态计数，不直接限制分支生成队列大小、每状态枚举代价或整个CPU时长；无法据注册10秒就断言工作一定在10秒终止。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型转换表的用户确认在 Skill 层，verify 工具不校验来源；ok 不等于通过，截断不可当验证成功；详见[Q02](#research-q02)。 同步引擎不接signal，10秒注册期限非强停，maxStates非总资源预算。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合能提供可靠模型与人工复核的设计评审；先核转换表、verdict 和截断，再对照源码；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码证实八工具和门禁；verdict 约束所给模型，非源码正确性证明，模型忠实度未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tool.ts、src/engine.ts、skills/logicprobe/SKILL.md、src/concurrency-tool.ts、src/report-diff-tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定源码和作者文档；未运行插件、目标引擎或 Python CLI。作者报告的多版本兼容不等于本轮复现。
- 下一步：用带标准缺陷的源码/模型对照抽取忠实度、错误通过率、截断报告及工时。

**分析版本**

- **仓库**：[AmethystLuna/logicprobe](https://github.com/AmethystLuna/logicprobe)
- **版本号**：1.4.1（[固定提交 a264c40](https://github.com/AmethystLuna/logicprobe/tree/a264c4018b02d24e2b2103c772ca431e21c16e65)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把模型来源/确认与截断状态绑定报告可减少误读，但需标注题集证伪；详见[Q03](#research-q03)。

用带标准缺陷的源码/模型对照抽取忠实度、错误通过率、截断报告及工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 5030 | — | — | 53321 |
| .md | example | 1 | 46 | — | — | 276 |
| .js | source | 21 | 9547 | 8510 | 1004 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 19 | 9635 | 8005 | 1128 | — |
| .mjs | test | 17 | 6168 | 5181 | 492 | — |
| .md | test | 1 | 38 | — | — | 472 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+created%3A2026-09-22T08%3A13%3A46.647Z..2026-10-22T08%3A13%3A46.647Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A13%3A46.647Z..2026-10-22T08%3A13%3A46.647Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Logic Probe 的八工具、模型验证判据、模型抽取/确认边界与部署成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 八个工具与 Skill 门禁各解决什么问题？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

src/index.ts 条件注册八个模型工具：verify 审状态机，datamodel_verify 审迁移/数据模型，concurrency_scan 只挖并发声称，compose_verify 审多机握手，export 生成外部验证输入，uml 做图/模型转换和审图，structure_verify 审依赖图，report_diff 做基线增量比较。它另以 filesystem provider 挂载多份 Skill，并在首个模型步骤注入门禁文本。用户命令和图形功能不能与八工具混同。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:38-47](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/index.ts#L38-L47)

八工具入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { FileSystemSkillProvider } from '@deepseek-ai/dsh-skill-filesystem'
import { logicProbeVerifyTool } from './tool.js'
import { logicProbeDataModelVerifyTool, DATA_ENGINE_SCHEMA_VERSION } from './data-tool.js'
import { logicProbeConcurrencyScanTool } from './concurrency-tool.js'
import { logicProbeComposeTool } from './compose-tool.js'
import { logicProbeExportTool } from './export-tool.js'
import { logicProbeUmlTool } from './uml-tool.js'
import { logicProbeStructureTool } from './structure-tool.js'
import { logicProbeReportDiffTool } from './report-diff-tool.js'
import { ENGINE_SCHEMA_VERSION } from './engine.js'
```

</details>

**依据 2 · 源码核查**：[src/index.ts:334-425](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/index.ts#L334-L425)

注册工具/Skill provider 与 pre-step gate。

<details>
<summary>查看原文（92行）</summary>

```text
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
      ctx.effect(() => tools.register(logicProbeReportDiffTool), 'logicprobe: report diff tool')
      toolRegistered = true
      dataToolRegistered = true
      concurrencyToolRegistered = true
      composeToolRegistered = true
      exportToolRegistered = true
      umlToolRegistered = true
      structureToolRegistered = true
      reportDiffToolRegistered = true
    } catch (err) {
      console.warn('[logicprobe] logicprobe_verify/logicprobe_datamodel_verify tool registration failed', err)
    }
  }
  const registerModeContext = (): void => {
    if (modeContextRegistered) return
    const systemPrompt = ctx.get('systemPrompt') as SystemPromptLike | undefined
    if (systemPrompt === undefined) return
    try {
      ctx.effect(() => systemPrompt.context({
        name: 'logicprobe:mode',
        order: 118,
        text: (context: AssembleContext) => {
          const agent = (context as AssembleContext & { agent?: { session: Session } }).agent
          if (agent === undefined) return ''
          return modeContextText(config, agent.session)
        },
      }), 'logicprobe: system prompt context')
      modeContextRegistered = true
    } catch (err) {
      console.warn('[logicprobe] system prompt context registration failed', err)
    }
  }
  const registerIntegrations = (): void => {
    registerProvider()
    registerTool()
    registerModeContext()
  }
  registerIntegrations()
  // Ship the bundled skill through the registry: reuse the standard
  // filesystem provider over this package's own `skills/` directory, so
  // catalog discovery, frontmatter parsing, and SKILL.md loading behave
  // exactly like project/user skills while the plugin stays self-contained.
  // Registration lands in the global registry layer (this row mounts at the
  // profile root), so every agent preset sees the skill. `registerProvider`
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'logicprobe',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
  })
  // Injection listens unconditionally, including while the switch is off: the
  // switch is volatile, so `apply` runs once and the value behind it can turn on
  // later from the Web Plugins page. Returning early on a false value here would
  // freeze that decision for the lifetime of the mount, and turning the switch
  // back on could never take effect without a profile restart.
  //
  // Inject the gate once per session on the FIRST model step that runs,
  // instead of at session-start: session-start injection lands in the agent's
  // inbox, which a blank-session preset switch (agentPreset.select ->
  // recompose) can clear before the first step - the gate would then be lost
  // for the whole session. The pre-step decision is the durable path a
  // first-step injection takes: the gate is appended to the first step's
  // decision and enters session history there, so every later step (and a
  // resume) skips it. Anchored/bootstrap presets that strip first-step
  // injected reminders (skill catalog, AGENTS.md, gate plugins) simply defer
  // this message to the first step after their promotion - the history guard
  // re-injects it there, so the gate still lands exactly once per session.
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
  })
```

</details>

**依据 3 · 作者声明**：[README.md:49-65](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/README.md#L49-L65)

八工具各自用途。

<details>
<summary>查看原文（17行）</summary>

```text
## 工具与报告

下面两份清单（原生工具清单，以及怎么读它们的报告）与**安装方式无关**：dsh 走原生工具，Claude Code / Codex / Cursor / 终端 / CI 走同一套技能与 Python CLI 引擎（见「使用」）。

工具清单：

| 工具 | 作用 |
|------|------|
| `logicprobe_verify` | 状态机验证：S1-S8 结构检查 + A1-A14 对抗探针。传 `beforeModel` 与 `stateMapping` 可加做 D1-D4 前后回归。 |
| `logicprobe_datamodel_verify` | 数据模型验证：DataModelV1、迁移覆盖、copy 一致性、DD1-DD4 数据回归。 |
| `logicprobe_concurrency_scan` | 扫描并发风险声称（thread-safe、lock-free、race condition、mutex 等），标注需要专用验证。 |
| `logicprobe_compose_verify` | 两台及以上状态机组合验证（握手 rendezvous 语义）：C1 组合死锁、C2 握手永不触发。 |
| `logicprobe_export` | 导出外部工具原生输入：UPPAAL（`.xta` + queries）、TLA+（TLC 模块）、PRISM（DTMC `.pm` + `.pctl`）、SPIN（Promela + ltl）。 |
| `logicprobe_uml` | 用 UML 建模代码流程，并审查这份建模。见下方「UML 建模与审查」。 |
| `logicprobe_structure_verify` | 把组件/包/类/部署图当**依赖图**审查（UML020-UML026）：孤立节点、悬空端点、依赖环、违反允许依赖矩阵的边、跨层反向依赖、矩阵要求却缺失的边；每条被判定的边都会报出命中的规则 id。它审的是**图**，代码侧要用 include/依赖扫描对账。 |
| `logicprobe_report_diff` | 对比两份同族报告（baseline vs current），给出新增/消除/变化的发现与**增量**判定：按 `检查 id + code + 机器可读定位（evidence/path）` 匹配，改措辞只会算作 `changed`；新增 error 判 fail，而 `currentVerdict` 仍保留本次运行的绝对结论。"违规不增"的验收判据，算出来而不是看出来的。 |

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · verdict 能证明源码正确性或模型抽取准确吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

verify 接收调用者给出的 LogicModelV1，执行 S1-S8/A1-A14；引擎把 ok 定义为报告可产生，verdict 才是模型检查结论。maxStates 截断和 _UNDECIDED 不等于通过，concurrency_scan 只标声称并路由外部工具。工具入参没有用户确认标志；Skill 要求展示转换表并经确认，auto 模式则用证据标注/往返检查并标 UNCONFIRMED。这是模型抽取流程纪律，工具本身无法证明输入模型忠实对应源码；图检查也只证图自洽，需与代码依赖另对账。

注册timeoutMs=10000不是同步引擎的硬停止保证。verify.execute直接同步调用runVerification，没有exec参数或协作AbortSignal；explore在同一线程while队列中处理状态，先加入reachable再判断length>maxStates，因此可含上限后一状态。maxStates约束已访问状态计数，不直接限制分支生成队列大小、每状态枚举代价或整个CPU时长；无法据注册10秒就断言工作一定在10秒终止。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:17-66](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/tool.ts#L17-L66)

verify 参数中只含模型/搜索范围/报告视图，无确认字段。

<details>
<summary>查看原文（50行）</summary>

```text
export const logicProbeVerifyTool = defineTool({
  name: LOGICPROBE_VERIFY_TOOL_NAME,
  description:
    'Run state-machine verification on a LogicModelV1 object. Model shape: schemaVersion 1, init, states ({id, terminal?}), transitions ({from, event, to, guard?, updates?, cost?}), plus optional variables, invariants, concurrentPairs, boundaryChecks, resourcePairs, idempotentEvents and narrative. Guards are structured: {variable, op, value}, {all}, {any} or {not}. Invariants cover never-states, var-in-range, event-before-state, leads-to, sequence, atomicity, budget, probability and deadline. `cost` defaults to 1 and drives the A12 budget check. `weight` defaults to 1 and makes the model a DTMC for A13. A state with `maxTicks` needs top-level `tickEvents`; A14 reports over-residency. The schema is closed: an undeclared key is a validation error. Keys starting with `_` are metadata: ignored, kept out of `modelHash`, and echoed as `metadataKeys`. Variables support monotonic inc and dec. Pass `beforeModel` and `stateMapping` to add the D1-D4 regression. Read `verdict`, never `ok`. The full schema is in the `logicprobe` skill: references/dsh-model-schema.md.',
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
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:232-273](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/engine.ts#L232-L273)

ok/verdict/truncated/coverage 语义。

<details>
<summary>查看原文（42行）</summary>

```text

export interface VerificationReport {
  /**
   * The engine ran and the input was well-formed enough to produce this report.
   * It does NOT mean the review passed — read `verdict` for that.
   */
  ok: boolean
  /** The tool executed and produced a report. False only when a tool refused the request before the engine ran. */
  ran: boolean
  /** The review outcome. `ok: true` with `verdict: "fail"` is a failing review, not a passing one. */
  verdict: Verdict
  /** Why the verdict came out that way, e.g. `2 error finding(s) (first: S2_NO_TRANSITIONS)`. */
  verdictReason: string
  /** The versioned report contract this result follows. */
  schema: ReportSchema
  schemaVersion: 1
  /** Which published specification `modelHash` follows (see references/hash-spec.md). */
  hashSpec: HashSpec
  modelHash: string
  /** Every hash this report carries, in one place, for a baseline diff or an archive record. */
  hashes: { hashSpec: HashSpec; modelHash: string; beforeModelHash?: string; afterModelHash?: string }
  /** Paths of the `_`-prefixed metadata keys found in the input and ignored by the schema. */
  metadataKeys?: string[]
  /** How much of the model the narrative documents; absent when there is no narrative. */
  narrativeCoverage?: NarrativeCoverage
  /** Echo of the model's natural-language narrative, when present. */
  narrative?: ModelNarrative
  summary: {
    states: number
    transitions: number
    errors: number
    warnings: number
    checksRun: number
    truncated?: boolean
  }
  checks: CheckResult[]
  comparison?: ComparisonSummary
  /** What to do next, derived from the findings — never empty. */
  nextSteps: string[]
  /** Informational notes about semantic dimensions this model references (timing, preemption)
   * that this engine does not verify. Heuristic, vocabulary-based — never a substitute for the checks. */
  coverageNotes?: string[]
```

</details>

**依据 3 · 作者声明**：[README.md:68-98](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/README.md#L68-L98)

报告判据，ok 不等于通过。

<details>
<summary>查看原文（31行）</summary>

```text
### 怎么读报告（`ok` 不是结论）

所有报告都同时给「工具跑成功」与「审查通过」两件事：

| 字段 | 含义 |
|------|------|
| `schema` | 版本化报告契约（`logicprobe/verify/v1`、`logicprobe/uml/review/v1`…），消费方按它分支而不是猜字段。 |
| `ok` | 引擎产出了报告。对 `verify` 只在**模型校验失败**时为 `false`；它**不是**结论。 |
| `ran` | 工具确实执行了。仅在工具层拒绝请求（带 `errorCode`/`error`）时为 `false`。 |
| `verdict` | `pass` / `pass_with_findings` / `fail`。任何 `severity: "error"` 的发现、或校验失败，都会是 `fail`。 |
| `verdictReason` | 一行说明，例如 `1 error finding(s) (first: S2_NO_TRANSITIONS)`。 |
| `hashSpec` | `modelHash` 依据的已发布规范（见 [`hash-spec.md`](skills/logicprobe/references/hash-spec.md)）。 |
| `hashes` | 本次报告涉及的全部哈希集中一处（模型哈希、图/矩阵哈希、前后模型哈希）。 |
| `metadataKeys` | 输入里带 `_` 前缀的注记键路径（仅当存在时出现）。 |
| `narrativeCoverage` | `{states: "5/5", events: "3/9", scenarios: "0/12"}`：narrative **允许部分覆盖**，这里报告还差多少；缺口同时是一条 `NARRATIVE_PARTIAL`（info）发现，门禁不必去解析 `nextSteps` 文本。 |
| `nextSteps` | 由发现推导的下一步，永不为空，同一输入两次运行逐字一致。 |

只看 `ok` 会把「有死锁」的模型读成通过——判据是 `verdict`。非 DSH 的 Python CLI 退出码跟随 verdict：`pass`/`pass_with_findings` → `0`，`fail` 或拒绝 → `2`。

**工具打印的是报告正文，不是 JSON。** 结构化报告本身没有变（`schema`/`verdict`/`hashes`/检查项 id/`code`/`evidence`/`path` 都在），变的只是给模型看的那份文本：

- 通过的检查只出现在 `CHECKS` 清单行里，不再展开正文（通过的检查没有可行动内容）；
- 同一个事实被多个检查各报一遍时（例如 `S5` 与 `A1` 报同一批 `(state, event)` 对），只在先出现的检查里列出，后出现的检查写明「与上面重复」，不再重印；
- 同一检查内逐字相同的发现折叠成一行并标注 `(xN)`；
- 只有 `error` 级发现内联 `evidence`，`warning` 级不内联——那是机器字段，不是阅读材料。

需要结构化报告本体时传 `reportView: "full"`（例如要把它交给 `logicprobe_report_diff`，它按 `check + code + evidence` 匹配身份，正文替代不了对象）。非 dsh 宿主走 CLI，它直接打印报告 JSON：那份正文是 dsh 工具的呈现层。

### 模型自带的归档记录（`_` 前缀键）

任何以 `_` 开头的键（任意层级，如 `_source`、`_verified`、`_extraction_caveats`、`states[0]._note`）都是**注记元数据**：schema 跳过、`modelHash` 排除、报告以 `metadataKeys` 回显。这样来源与验证快照可以跟模型放在同一个文件里，不必再维护一个会漂移的 sidecar，而模型的哈希身份不变。其余键仍然闭合——拼错的 `sttes` 依旧报错。用 `verify model.json --hash-check <hex>` 可回答某个历史哈希是否属于任何已发布规范。
```

</details>

**依据 4 · 作者声明**：[skills/logicprobe/SKILL.md:490-500](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/skills/logicprobe/SKILL.md#L490-L500)

模型确认、auto/UNCONFIRMED 与截断规则。

<details>
<summary>查看原文（11行）</summary>

```text

1. Never trust a document's claim without codebase verification.
2. Be honest about mechanism boundaries — if the language standard can't do it, say so.
3. Cite evidence with specific file:line references.
4. Don't fix during review — point the way, let implementation happen after approval.
5. **For behavioral claims: verify with code, not reasoning.** If a plan says "always", "never", or "guaranteed", generate and run a model. One counter-example is enough to refute a universal claim.
6. **Confirm the model before running it** — unless the runtime reports `logicprobe interaction=auto`. Extraction errors are the dominant failure mode of formal verification. In auto mode, substitute evidence-cited extraction + round-trip validation and mark the report `UNCONFIRMED`.
7. **Don't verify what the code already checks.** If the existing codebase has compile-time assertions, static analysis, or runtime checks for a property, cite those — don't re-verify in a model.
8. **Hand a neighbouring domain to its own skill.** A diagram is a model, not evidence: modelling or auditing one belongs to `logicprobe-uml`. A concurrency claim is mined and routed, never proven here: that is `logicprobe-concurrency`. Schema, data invariants and migrations are `logicprobe-datamodel`. This skill keeps the doctrine and the behavioural checks.
9. **Say what this does not prove.** For dimensions logicprobe does not verify — hard real time (deadlines, periods), preemptive concurrency, hybrid-control stability, probabilistic reliability, execution-cost budgets — route to the dedicated tool named in `references/gap-routing-guide.md`. `logicprobe_verify` reports carry the same routing as informational `coverageNotes` on matching models.
10. **A declared range is a property, not a bound, and a capped search is not a pass.** `inc`/`dec` are never clamped to `min`/`max`; only a guard that pins the value bounds it. When a report is `truncated` or a check is `_UNDECIDED`, say the property is undecided and narrow the model — never report it as verified.
```

</details>

**依据 5 · 源码核查**：[src/tool.ts:58-66](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/tool.ts#L58-L66)

注册期限与同步调用，无exec.signal。

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
```

**依据 6 · 源码核查**：[src/engine.ts:1071-1093](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/engine.ts#L1071-L1093)

同步队列探索、先push后计数截断，状态数非CPU/队列总预算。

<details>
<summary>查看原文（23行）</summary>

```text
function explore(model: LogicModelV1, options: NormalizedOptions): Exploration {
  const init = initialState(model)
  const reachable: RuntimeState[] = []
  const reachableKeys = new Set<string>()
  const queue: RuntimeState[] = [init]
  let truncated = false
  while (queue.length > 0) {
    const runtime = queue.shift()!
    const key = runtimeKey(runtime)
    if (reachableKeys.has(key)) continue
    reachableKeys.add(key)
    reachable.push(runtime)
    if (reachable.length > options.maxStates) {
      truncated = true
      break
    }
    for (const event of allEvents(model)) {
      for (const next of stepRuntime(model, runtime, event)) {
        if (!reachableKeys.has(runtimeKey(next))) queue.push(next)
      }
    }
  }
  return { reachable, reachableKeys, truncated, initialState: init }
```

</details>

#### 缺口

- 未以独立源码/模型金标准测试抽取忠实度
  **影响**：pass 的结论只能约束所给模型，不能替代代码证明
  **进一步探讨**：用人工标注转换表与代码运行对照模型抽取、截断情况

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部署并获得可信报告的完整成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需 DSH base 的 skills/tools/agent 等 peer、学习 LogicModelV1 并把源码转成状态表；非 DSH 可用仓库 Python CLI，但 npm/bundle 不含该 CLI。持续需逐项核来源和建模、执行引擎、人工读 verdict/truncated/coverageNotes，复杂模型有状态空间/时间开销；失败恢复包括收紧模型、修抽取错误、重跑和对照基线。现金/模型 token、工程工时和假阳/漏报无数据。创新假设：相对只给模型 pass/fail，强制在报告中绑定模型来源证据、转换表确认状态和探索是否截断，可减少把模型通过误读成代码正确。条件是人提供可靠源码锚点与模型版本哈希，代价是抽取/审阅流程。最小证伪：给含故意遗漏迁移与大状态空间的同一代码，比较有/无来源门禁时误称“代码已证明”的比例；若仍误判或未标截断，假设失败。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH peer 或仓库 Python CLI、模型/计算资源；金额未知 | 抽取源码到模型、核状态/转移/证据；工时未知 | npm 不含 Python CLI |
| 持续使用 | 运行模型检查、状态空间与报告存储；CPU/token 未知 | 审 verdict/截断/覆盖、维护 baseline；耗时未知 | maxStates 截断不能当通过 |
| 失败恢复 | 重建模型/缩小搜索/复跑可能追加计算；费用未知 | 排抽取漏项、修模型、复核代码差异；工时未知 | 检出率未独立测 |

状态空间成本还包括同步探索队列和每状态计算；10秒为宿主注册期限，不是本引擎协作中止。可信小模型/明确maxStates与人工审阅是试用前提。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:149-172](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/README.md#L149-L172)

宿主与 Python CLI 分发范围。

<details>
<summary>查看原文（24行）</summary>

```text
## 使用

插件在会话首个模型步骤自动注入能力通知。技能按**领域**拆分;`logicprobe` 是总入口,只要有一点「想验证代码/某个说法是否成立」的念头就加载它,它自己的路由表再把相邻领域交出去:

| 技能 | 领域 | 典型触发 |
|---|---|---|
| `logicprobe` | 声称核查 + 行为验证(状态机/协议、时序与量化保证、组合、重构回归) | "Review this design document"、"could this state machine deadlock"、"is this retry limit safe"、"这个预算够不够" |
| `logicprobe-uml` | 图的建模与审查 | "把这个状态机画出来"、"这份 UML 图对吗"、"component 图能不能当状态机审" |
| `logicprobe-structure` | 架构 / 依赖结构审查 | "审查一下这个架构"、"模块依赖有没有问题"、"分层对不对" |
| `logicprobe-concurrency` | 并发声称:挖矿 + 路由(不证明) | "thread-safe 吗"、"这个 ISR 会 race 吗" |
| `logicprobe-datamodel` | 数据模型 / 迁移与不变量 | "is this migration non-breaking"、"这份 copy 覆盖全字段了吗" |

行为类问题仍按"主动建议、不自动升级"处理:先建议一次可选验证,由你决定是否跑。技能在 Phase 0 依据计划特征自动分级(LIGHTWEIGHT / STANDARD / ESCALATED),并在计划文件追加 `## Plan Verification` 摘要块作为审计痕迹。

在 dsh 之外（Claude Code、Cursor、Codex、终端、CI），装的是**仓库**（marketplace / git），随仓库带 `tools/python/logicprobe-engine.py`：只需 Python 3.8+ 标准库。dsh 安装包（npm / bundle）不含它。已有 LogicModelV1 JSON 时直接运行：

- `verify` 跑 S1-S8 / A1-A14 / D1-D4（`--before-model`、`--baseline`、`--hash-spec`、`--hash-check`）
- `compose` 跑 C1 / C2 组合
- `export` 生成 UPPAAL、TLA+、PRISM、SPIN 输入
- `uml-render`、`uml-parse`、`uml-review` 覆盖 UML 前端（`uml-review --explain-labels` 打印解析器接受的标签与注释口径）
- `structure`、`granularity` 审查依赖图与多粒度细化（UML020-UML031）
- 子命令的权威清单是 `--help`，本文不复制一份

凡引擎实现的子命令，其报告与 dsh 工具逐字节一致，对照见 `tests/python/run.mjs`。模型只有抽取出的状态表时，填充模板 `tools/python/verification-harness.py`。**数据模型验证没有镜像子命令**：非 dsh 宿主用 `tools/python/data-model-harness.py`，或对应 guide 的手动验证模式；并发声称扫描同理（它只做分流）。Python 不可用（例如离线开发机）时，对应 guide 提供手动验证模式。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:63-70](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/index.ts#L63-L70)

skills 依赖与包内路径。

```text
// Skills are contributed through the registry service, which dsh-base always
// mounts before bundle rows such as this one apply.
export const inject = ['skills']

// Absolute path of the package's shipped skills directory. `lib/index.js`
// lives one level below the package root, so `../skills` from the module URL
// lands on `<package>/skills` regardless of where the package was installed.
const SKILLS_DIR = fileURLToPath(new URL('../skills', import.meta.url))
```

**依据 3 · 源码核查**：[src/tool.ts:21-65](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/tool.ts#L21-L65)

模型和 maxStates、10 秒工具预算。

<details>
<summary>查看原文（45行）</summary>

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
```

</details>

**依据 4 · 作者声明**：[README.md:68-85](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/README.md#L68-L85)

verdict/truncated 等报告阅读要求。

<details>
<summary>查看原文（18行）</summary>

```text
### 怎么读报告（`ok` 不是结论）

所有报告都同时给「工具跑成功」与「审查通过」两件事：

| 字段 | 含义 |
|------|------|
| `schema` | 版本化报告契约（`logicprobe/verify/v1`、`logicprobe/uml/review/v1`…），消费方按它分支而不是猜字段。 |
| `ok` | 引擎产出了报告。对 `verify` 只在**模型校验失败**时为 `false`；它**不是**结论。 |
| `ran` | 工具确实执行了。仅在工具层拒绝请求（带 `errorCode`/`error`）时为 `false`。 |
| `verdict` | `pass` / `pass_with_findings` / `fail`。任何 `severity: "error"` 的发现、或校验失败，都会是 `fail`。 |
| `verdictReason` | 一行说明，例如 `1 error finding(s) (first: S2_NO_TRANSITIONS)`。 |
| `hashSpec` | `modelHash` 依据的已发布规范（见 [`hash-spec.md`](skills/logicprobe/references/hash-spec.md)）。 |
| `hashes` | 本次报告涉及的全部哈希集中一处（模型哈希、图/矩阵哈希、前后模型哈希）。 |
| `metadataKeys` | 输入里带 `_` 前缀的注记键路径（仅当存在时出现）。 |
| `narrativeCoverage` | `{states: "5/5", events: "3/9", scenarios: "0/12"}`：narrative **允许部分覆盖**，这里报告还差多少；缺口同时是一条 `NARRATIVE_PARTIAL`（info）发现，门禁不必去解析 `nextSteps` 文本。 |
| `nextSteps` | 由发现推导的下一步，永不为空，同一输入两次运行逐字一致。 |

只看 `ok` 会把「有死锁」的模型读成通过——判据是 `verdict`。非 DSH 的 Python CLI 退出码跟随 verdict：`pass`/`pass_with_findings` → `0`，`fail` 或拒绝 → `2`。
```

</details>

#### 缺口

- 未量测实际建模耗时、状态空间和代码缺陷检出率
  **影响**：单位合格核验成本和收益未知
  **进一步探讨**：在有标准缺陷的项目记人工建模/复核、运行及误判

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
