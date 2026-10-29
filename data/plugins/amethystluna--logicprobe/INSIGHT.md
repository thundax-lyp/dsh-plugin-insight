# LogicProbe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[85c2468](https://github.com/AmethystLuna/logicprobe/tree/85c2468f1c57b7504e8bb9725647eade756696e6)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 3,087](https://img.shields.io/static/v1?label=npm+30d&message=3%2C087&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-logicprobe)
<!-- END META -->

> **功能**：为 DSH 开发者提供状态机、数据模型、结构图与并发声称检查工具和 Skill，返回模型判决、反例、回归及覆盖边界。

> **亮点**：模型检查、Skill方法、反例/哈希和前后/delta报告连接Agent审查，超出口头自信但不自动证明源码。见[Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：ask/auto非强制确认闸；预算/叙述/元数据边界不能靠ok或单一verdict概括，delta可掩已存在/升级错误，源码映射仍人工。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 从口头核验到实际可执行工具，新入口/继承边界？](#detail-section-11)
  - [Q02 · 模型/预算/未知如何进入判决，ok和verdict不同在哪？](#detail-section-12)
  - [Q03 · 多族工具、回归和外部导出能否推出源码/并发正确？](#detail-section-13)
  - [Q04 · 谁值得建模，总成本与采用/退出条件？](#detail-section-14)
  - [Q05 · 对源码映射缺口的可证伪设计方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为能复核模型的开发者，将设计/重构声称接到可执行模型、反例与版本报告。见[Q01](#research-q01)。

Agent口头审查/普通测试，或手工接专业模型检查器；抽象模型和检查算法沿既有方法，DSH接线/报告契约是本插件增量。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型验证 | 对状态/迁移不变量给反例 | 先核模型对应真实代码，预算未决保留 |
| 图/声称 | 依赖矩阵和并发风险路由 | 图非源码，声称扫描非并发证明 |
| 前后/报告 | 版本回归与delta/current比较 | changed及绝对fail不能忽略 |
| 外部导出 | 生成专业工具输入 | 性质子集warning，需另跑求解器 |
| Skill/gate | 建模方法和报告阅读入口 | auto可未确认，提示不是硬闸 |

**流程与依赖**

基础检查需兼容DSH与建模能力，专用求解器按语义另需；依赖表见[Q04](#research-q04)。

先定性质/复核转换表，再保full检查未决和当前绝对结果，反例回源与版本复核；步骤见[Q04](#research-q04)。

**效果与成本**

建模、源码映射/解释和扩大预算是专业成本，无净节时或金额对照；成本表见[Q04](#research-q04)。

重复反例/报告比口头判断可追溯，真实源码召回和收益未知；效果表见[Q04](#research-q04)。

> **思考**：ask/auto非强制确认闸；预算/叙述/元数据边界不能靠ok或单一verdict概括，delta可掩已存在/升级错误，源码映射仍人工。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：模型检查、Skill方法、反例/哈希和前后/delta报告连接Agent审查，超出口头自信但不自动证明源码。见[Q01](#research-q01)、[Q03](#research-q03)。

值得迁移的是封闭模型和显式结果分层；提示确认、_元数据、digest与delta必须保持边界，消费者需联合判读。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

ask/auto非强制确认闸；预算/叙述/元数据边界不能靠ok或单一verdict概括，delta可掩已存在/升级错误，源码映射仍人工。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

能核对源码模型的小型协议/状态机可有限试用；先保full/预算/版本，模型不可核、持续未决或仅单一pass验收时停自动链，回普通测试/专用检查。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持模型/反例与多族路由，重点核原生集成、状态机预算/报告和diff；未运行或全审每族算法。限人工复核小模型试用，不能据pass放行真实代码。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/index.ts、lib/index.js、src/tool.ts、src/engine.ts、src/report-view.ts、src/baseline.ts、src/report-diff-tool.ts、src/compose-tool.ts、src/data-tool.ts、src/structure-tool.ts、src/structure.ts、src/concurrency.ts、src/export-tool.ts、src/exporters.ts、skills/logicprobe/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧五题/全部findings和自身code依赖已复核；本轮核package/README、src/lib入口、主工具和state engine校验/探索/未决/结果、report-view、baseline，及data/compose/structure/concurrency/export实际调用与局部算法。未全审每个数据/UML/多层/概率算法和Python/各Agent替代路径，不执行目标。
- 下一步：后续隔离模型/已知缺陷对照预算/full-digest/严重升级与源码映射，测漏检/解释工时；宿主普通安装调用卸载另验。

**分析版本**

- **仓库**：[AmethystLuna/logicprobe](https://github.com/AmethystLuna/logicprobe)
- **版本号**：1.4.3（[固定提交 85c2468](https://github.com/AmethystLuna/logicprobe/tree/85c2468f1c57b7504e8bb9725647eade756696e6)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是独立来源/确认审查记录与报告消费规则，已有file:line和元数据之上新增变更失效绑定，已知错误盲测收益/工时否定。见[Q05](#research-q05)。

后续隔离模型/已知缺陷对照预算/full-digest/严重升级与源码映射，测漏检/解释工时；宿主普通安装调用卸载另验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 5205 | — | — | 54785 |
| .md | example | 1 | 46 | — | — | 276 |
| .js | source | 21 | 9547 | 8510 | 1004 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 19 | 9635 | 8005 | 1128 | — |
| .mjs | test | 17 | 6168 | 5181 | 492 | — |
| .md | test | 1 | 38 | — | — | 472 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/AmethystLuna/logicprobe/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可执行模型检查何时支持结论，何时会因确认、预算、摘要和delta误读？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从口头核验到实际可执行工具，新入口/继承边界？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH原生插件dsh-logicprobe 1.4.3，也带可供其它Agent环境使用的Skill/Python入口。主入口lib/index.js，src/index.ts注册本包skills目录的FileSystemSkillProvider，再按宿主就绪注册验证工具/提示上下文；agent/pre-step按持久history中的plugin来源标记决定是否注入首次gate。实际lib对应关键注册/ask-auto/gate分支，未假定所有发布文件逐字与src同步。

面向能人工复核抽象模型的开发者，在设计/重构涉及状态、迁移或架构声称时交付模型、假设、判决、可重复反例与源码证据。直接基线是Agent口头评审加普通测试，或开发者手工接专业检查器。增量是结构化闭合模型经工具运行、版本哈希/回归与Skill路由衔接审查；不自动提取任意源程序的完整语义，专业求解器能力也不是本插件发明。

README说模型总先确认，但当前运行时支持ask/auto/follow-approval，最后一个遇policy=never转auto；auto文案要求往返检查并标UNCONFIRMED，不询问确认。工具execute直接runVerification(model)，没有确认令牌/审批回执字段。这是提示/工作方法控制，不是强制阻止未确认模型执行的安全闸。首次gate进历史后避免重复，不保证每个模型都经人核对。

作者在README声明转向dsh-model-everything，并称已有0.2.1-rc.4安装/启动/调用/卸载实测。本轮只把它们视为作者信息：未研究后继项目，不把后继能力/当前远端可用性或作者宿主实测冒充本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/package.json#L1-L16)

包版本及入口。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-logicprobe",
  "version": "1.4.3",
  "description": "Verifies claims about designs and code. Facts go against the source. Behaviour goes through an executable model: state machines, protocols, composition, data models, migrations. Structure diagrams are read as dependency graphs, at one level or several. Two reports can be compared for regression. Exports UPPAAL, TLA+, PRISM and SPIN input. Ships a native DeepSeek Harness bundle that injects the verification gate into the first model step.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:385-426](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/index.ts#L385-L426)

注册skills目录与pre-step/historical gate。

<details>
<summary>查看原文（42行）</summary>

```text
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
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:198-233](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/index.ts#L198-L233)

approval解析与ask/auto文案。

<details>
<summary>查看原文（36行）</summary>

```text
    const event = events[index]
    if (event.type === 'approval/policy') {
      return event.data?.policy === 'never' ? 'never' : 'ask'
    }
  }
  return undefined
}

function planModeActive(session: Session): boolean {
  const events = readSessionEvents(session)
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]
    if (event.type === 'plan/mode') return event.data?.active === true
  }
  return false
}

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
  ]
  if (planModeActive(session)) {
    lines.push('Plan mode active: before exit_plan_mode, run logicprobe Phase 0 and append the "## Plan Verification" block to the plan file.')
  }
  return lines.join(' ')
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:436-446](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/index.ts#L436-L446)

实际历史来源判定。

<details>
<summary>查看原文（11行）</summary>

```text
function gateInHistory(session: Session): boolean {
  return readSessionEvents(session).some((event) => {
    if (event.type !== 'user/message') return false
    const source = event.data?.source as { kind?: string; plugin?: string } | undefined
    if (source === undefined) return false
    // The v4 producer-owned kind, plus the pre-v4 wrapper this bundle wrote
    // before DSH 0.1.7-alpha.1 retired it.
    return source.kind === GATE_SOURCE_KIND
      || (source.kind === 'plugin' && source.plugin === GATE_PLUGIN_ID)
  })
}
```

</details>

**依据 5 · 源码核查**：[src/tool.ts:58-68](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/tool.ts#L58-L68)

执行入口无确认token。

<details>
<summary>查看原文（11行）</summary>

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
})
```

</details>

**依据 6 · 源码核查**：[lib/index.js:248-278](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/lib/index.js#L248-L278)

真实主包集成/验证工具注册。

<details>
<summary>查看原文（31行）</summary>

```text
    const registerProvider = () => {
        if (providerRegistered)
            return;
        const inspect = ctx.get('cordisInspect');
        if (inspect === undefined)
            return;
        try {
            ctx.effect(() => inspect.register(inspectProvider(config, () => toolRegistered, () => dataToolRegistered, () => concurrencyToolRegistered, () => composeToolRegistered, () => exportToolRegistered, () => umlToolRegistered, () => structureToolRegistered, () => reportDiffToolRegistered)), 'logicprobe: inspect provider');
            providerRegistered = true;
        }
        catch (err) {
            console.warn('[logicprobe] inspect provider registration failed', err);
        }
    };
    const registerTool = () => {
        if (toolRegistered)
            return;
        const tools = ctx.get('tools');
        if (tools === undefined)
            return;
        try {
            ctx.effect(() => tools.register(logicProbeVerifyTool), 'logicprobe: verify tool');
            ctx.effect(() => tools.register(logicProbeDataModelVerifyTool), 'logicprobe: data verify tool');
            ctx.effect(() => tools.register(logicProbeConcurrencyScanTool), 'logicprobe: concurrency scan tool');
            ctx.effect(() => tools.register(logicProbeComposeTool), 'logicprobe: compose tool');
            ctx.effect(() => tools.register(logicProbeExportTool), 'logicprobe: export tool');
            ctx.effect(() => tools.register(logicProbeUmlTool), 'logicprobe: uml tool');
            ctx.effect(() => tools.register(logicProbeStructureTool), 'logicprobe: structure tool');
            ctx.effect(() => tools.register(logicProbeReportDiffTool), 'logicprobe: report diff tool');
            toolRegistered = true;
            dataToolRegistered = true;
```

</details>

**依据 7 · 源码核查**：[lib/index.js:350-361](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/lib/index.js#L350-L361)

实际lib pre-step分支。

<details>
<summary>查看原文（12行）</summary>

```text
    ctx.on('agent/pre-step', async ({ agent }, next) => {
        const decision = await next();
        if (decision.kind === 'reject')
            return decision;
        registerIntegrations();
        if (!injectionEnabled(config))
            return decision;
        if (gateInHistory(agent.session))
            return decision;
        return {
            kind: 'enter',
            messages: [...decision.messages, gateMessage(config.gateContent)],
```

</details>

**依据 8 · 源码核查**：[README.md:14-24](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/README.md#L14-L24)

作者后继与兼容信息。

<details>
<summary>查看原文（11行）</summary>

```text
> 的形式发展，同样覆盖声称、行为、结构、UML、数据模型、并发、导出与报告对比，
> 并加上设计原则审查（分层、边界、可替换性、接口宽度、图形状）、报告阅读技能、
> 标签口径解释和可选的会话启动路由。它不是本插件的 API 镜像：UML 能力拆在多个
> 工具里，本插件只有一个 `logicprobe_uml`。它已发布为
> [`dsh-model-everything`](https://github.com/AmethystLuna/dsh-model-everything)
> （[npm](https://www.npmjs.com/package/dsh-model-everything)）。现有安装继续可用。
> 0.2.1-rc.4 上已实测安装、挂载、启动、工具调用与卸载；逐版本证据见
> [DSH-COMPATIBILITY.md](DSH-COMPATIBILITY.md)。

没验证过的设计，翻车只是时间问题；再复杂的代码，建模再跑就清楚了。

```

</details>

**依据 9 · 源码核查**：[README.md:47-47](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/README.md#L47-L47)

README先确认的表述需受当前交互模式限定。

```text
模型永远先以转换表形式展示，**经用户确认后才运行**。模型提取错误是验证的头号失败模式。
```

#### 缺口

- 建模/解释工时与真实缺陷收益未对照
  **影响**：不能从工具列表推出总成本更低或可靠源码证明
  **进一步探讨**：选已知缺陷的小型协议，比较人工审查/现有测试和建模核验的漏检、误报和工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型/预算/未知如何进入判决，ok和verdict不同在哪？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

logicprobe_verify接受LogicModelV1及maxStates/maxPermutationEvents、beforeModel/stateMapping，直接调用本地runVerification。默认10000探索状态/5个排列事件是资源预算，工具声明10秒超时不是实际耗时或同步计算已被硬中止的证据。本轮不跑目标。

validateModel拒非对象、错schema及未声明字段，_前缀作为metadata例外忽略且不进modelHash；有助防拼字静默漏约束，却不能补没建的失败转移，_source/_verified变化也不能由相同modelHash证明同一源码/确认事实。BFS遍历runtime并按state预算停止，summary.truncated合并探索截断和部分未决码。

A9 leads-to的独立walk耗尽明确warning A9_LEADS_TO_UNDECIDED：“没有反例”并未证明不存在；错误→verdict fail，warning→pass_with_findings，无error/warning才pass。ok:true/ran:true只说明有效输入进入运行，模型违反性质仍可ok:true。不能只按ok、甚至只按一个pass前缀自动放行；要同时读取verdict、summary.truncated、覆盖/nextSteps与性质范围。

还有两条细化边界：NARRATIVE_PARTIAL是info，不参与error/warning判决，所以pass可伴解释不完整；探索截断只写summary，主返回的verdict直接由checks findings生成，没有单凭exploration.truncated升级判决。digest header只列states/transitions/errors/warnings/checksRun而不列truncated，footer保留coverage/nextSteps，但本轮未在此renderer找到独立summary.truncated输出。读取full结构化结果可保这个标记；哪些输入会出现“摘要不显眼但截断”的组合仍需对照，不宣称已经复现具体假阳性。

digest会合并重复、隐藏warning证据并限warning行，保error行；适合阅读但不能充当完整diff输入/唯一审计档案。需要reportView:full保原结构/哈希/未决；未知与模型范围必须跟结果一起交付。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:20-68](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/tool.ts#L20-L68)

真实参数、默认说明、摘要/full、timeout与执行。

<details>
<summary>查看原文（49行）</summary>

```text
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
  },
})
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:550-577](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L550-L577)

封闭校验的_元数据例外。

<details>
<summary>查看原文（28行）</summary>

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
  if (root.schemaVersion !== 1) bad('schemaVersion', 'must be 1')
  if (typeof root.init !== 'string' || root.init.length === 0) bad('init', 'must be a non-empty string')
  if (!Array.isArray(root.states) || root.states.length === 0) {
    bad('states', 'must be a non-empty array')
  } else {
    const seen = new Set<string>()
    root.states.forEach((entry, index) => {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:1071-1093](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L1071-L1093)

BFS预算截断。

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

**依据 4 · 源码核查**：[src/engine.ts:461-495](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L461-L495)

ok与三档verdict语义。

<details>
<summary>查看原文（35行）</summary>

```text
export type Verdict = 'pass' | 'pass_with_findings' | 'fail'

export interface VerdictSummary {
  verdict: Verdict
  verdictReason: string
}

/** A tool that refused the request before running anything: it neither passed nor failed a review. */
export function refusalVerdict(reason: string): VerdictSummary {
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

```

</details>

**依据 5 · 源码核查**：[src/engine.ts:2605-2638](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L2605-L2638)

leads-to未决warning。

<details>
<summary>查看原文（34行）</summary>

```text
  for (const invariant of model.invariants ?? []) {
    if (invariant.kind !== 'leads-to') continue
    const targets = new Set(leadsToTargets(invariant))
    const label = leadsToTargetLabel(invariant)
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

**依据 6 · 源码核查**：[src/engine.ts:3293-3333](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L3293-L3333)

info说明、判决与truncated各自生成。

<details>
<summary>查看原文（41行）</summary>

```text
  const coverageNotes = computeCoverageNotes(model)
  const narrativeCoverage = narrativeCoverageOf(model)
  // R3: a partial narrative is valid, but the gap must be machine-readable instead of only a
  // sentence in `nextSteps`. It rides on S5 — the check that already reports undocumented
  // (state, event) combinations — so the documented check count stays 22.
  if (narrativeCoverage !== undefined && !narrativeComplete(narrativeCoverage)) {
    checks.find((check) => check.id === 'S5')?.findings.push({
      code: 'NARRATIVE_PARTIAL',
      severity: 'info',
      message: 'Narrative coverage is partial (states ' + narrativeCoverage.states + ', events ' + narrativeCoverage.events + ', scenarios ' + narrativeCoverage.scenarios + '): the checks still run over the whole model, but the undocumented symbols have to be re-derived by the reader.',
    })
  }
  return {
    ok: true,
    ran: true,
    ...verdictOfFindings(checks.flatMap((check) => check.findings)),
    schema: REPORT_SCHEMAS.verify,
    schemaVersion: 1,
    hashSpec,
    modelHash: modelHash(model, hashSpec),
    hashes: {
      hashSpec,
      modelHash: modelHash(model, hashSpec),
      ...(comparison === undefined ? {} : { beforeModelHash: comparison.beforeModelHash, afterModelHash: comparison.afterModelHash }),
    },
    ...metadata,
    ...(narrativeCoverage === undefined ? {} : { narrativeCoverage }),
    summary: {
      states: model.states.length,
      transitions: model.transitions.length,
      errors,
      warnings,
      checksRun: checks.length,
      truncated: exploration.truncated || hasUndecidedFinding(checks),
    },
    checks,
    nextSteps: verificationNextSteps(checks, narrativeCoverage),
    ...(model.narrative === undefined ? {} : { narrative: model.narrative }),
    ...(comparison === undefined ? {} : { comparison }),
    ...(coverageNotes.length === 0 ? {} : { coverageNotes }),
  }
```

</details>

**依据 7 · 源码核查**：[src/report-view.ts:151-166](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/report-view.ts#L151-L166)

摘要行数预算保error及重复合并。

<details>
<summary>查看原文（16行）</summary>

```text
    stateGroups.set(state, group)
  }
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
  return kept
```

</details>

**依据 8 · 源码核查**：[src/report-view.ts:171-213](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/report-view.ts#L171-L213)

摘要header未列truncated、coverage/nextSteps保留。

<details>
<summary>查看原文（43行）</summary>

```text
  const schema = text(report.schema) ?? 'logicprobe/report'
  const verdict = text(report.verdict)
  const ok = report.ok
  const summary = record(report.summary) ?? {}
  const lines: string[] = []
  const bits = [
    `${schema}`,
    verdict === undefined ? `ok=${String(ok)}` : `verdict=${verdict}`,
    text(report.verdictReason) ?? '',
    ok === undefined || verdict === undefined ? '' : `ok=${String(ok)}`,
  ].filter((bit) => bit !== '')
  lines.push(bits.join('  '))
  const hash = text(report.modelHash) ?? text(record(report.hashes)?.modelHash)
  const counts = ['states', 'transitions', 'errors', 'warnings', 'checksRun']
    .map((key) => (count(summary[key]) === undefined ? '' : `${key}=${String(count(summary[key]))}`))
    .filter((bit) => bit !== '')
  if (counts.length > 0 || hash !== undefined) lines[0] += '  ' + [...(hash === undefined ? [] : [`modelHash=${hash.slice(0, 12)}…`]), ...counts].join(' ')
  if (report.ran === false) lines.push('note: the tool did not run (the engine refused the input) — the fields below describe the refusal.')
  const coverage = record(report.narrativeCoverage)
  if (coverage !== undefined) {
    const parts = Object.entries(coverage)
      .filter(([, value]) => count(value) !== undefined)
      .map(([key, value]) => `${key} ${String(count(value))}`)
    if (parts.length > 0) lines.push(`NARRATIVE  ${parts.join(' / ')} documented`)
  }
  void options
  return lines
}

/** Trailing lines: notes about what was not checked, then the next steps. */
function footerLines(report: Record_): string[] {
  const lines: string[] = []
  const notes = array(report.coverageNotes).map(String).filter((note) => note !== '')
  if (notes.length > 0) lines.push(`COVERAGE  ${notes.join(' ')}`)
  const steps = array(report.nextSteps).map(String).filter((step) => step !== '')
  for (const step of steps) lines.push(`NEXT  ${step}`)
  const comparison = record(report.comparison)
  if (comparison !== undefined) {
    const parts = Object.entries(comparison)
      .filter(([, value]) => count(value) !== undefined || typeof value === 'string')
      .map(([key, value]) => `${key}=${String(value)}`)
    if (parts.length > 0) lines.push(`COMPARISON  ${parts.join(' ')}`)
  }
```

</details>

**依据 9 · 源码核查**：[src/report-view.ts:324-328](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/report-view.ts#L324-L328)

full输出原JSON。

```text
export function renderReportText(value: unknown, options: ReportViewOptions = {}): string {
  const resolved: Required<ReportViewOptions> = { ...DEFAULTS, ...options }
  if (resolved.full) return JSON.stringify(value as JsonValue, null, 2)
  const report = record(value)
  if (report === undefined) return JSON.stringify(value as JsonValue) ?? String(value)
```

#### 缺口

- 预算截断、摘要阅读和抽象遗漏的真实漏检/误读组合未跑
  **影响**：不能把源码标记存在等同所有消费者正确解释
  **进一步探讨**：同模型以小/足预算对照full/digest，核summary.truncated、verdict与已知反例，测用户能否正确拒绝未决。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多族工具、回归和外部导出能否推出源码/并发正确？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

主模型引擎按固定列表执行结构/对抗检查，并可beforeModel/stateMapping做前后比较；两版都漏建同一行为时不能证明源代码保行为。组合工具调用runCompositionVerification，模型是rendezvous握手：声明该事件且未终止的机器须同刻enabled，其它事件各自推进，没有速率比/公平上界。预算限探索，不能拿没见组合死锁代替真实调度/抢占正确。

data工具把model/beforeModel/fieldMapping/copyPairs/migrationMappings/backupPairs交runDataVerification，不连接生产数据库跑迁移；结构工具把单图或多层图交reviewStructure/reviewGranularity。结构引擎按矩阵deny优先/默认策略给edgeVerdicts，并提示源码扫描对账；无矩阵只跑结构性检查。它核画出的图，动态DI/插件注册/函数指针缺边仍需代码侧检查，未全审数据/UML/多粒度每项算法。

concurrency_scan对文本规则命中给关键词warning或绝对声称error，nextSteps明确要TSan/CBMC/TLA+等独立证据，不是对真实程序线程安全的运行证明。export调用exportModel生成primary/extras，不能表达的性质warning；例如UPPAAL非never-states只放comment，TLA同样有子集限制。execute不调用外部求解器，导出成功不证明目标工具解析/性质成立。

report_diff按check/code/机器定位匹配，message/严重级变化入changed；只有added里的新error使delta fail。若同identity从warning变error则changed可不使delta失败，currentVerdict仍保本次绝对fail并提示复查changed。旧错误未修时delta可pass，所以“违规不增”不能只读一个delta字段；合读currentVerdict/changed/当前完整报告，定位改名或范围变化也不能当已解决。

各家族调用足以说明工具分工，不等八族算法都已经独立验证正确。外部求解器只在真正升级语义时另装、另建模型并跑，它们不是基本原生检查的必需依赖。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:3220-3246](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L3220-L3246)

固定检查与前后模型入口。

<details>
<summary>查看原文（27行）</summary>

```text
  const checks: CheckResult[] = [
    S1_reachability(model, exploration),
    S2_deadlock(model),
    S3_liveness(model),
    S4_determinism(model),
    S5_eventCompleteness(model),
    S6_guardCompleteness(model),
    S7_invariants(model, normalized),
    S8_monotonicVariables(model),
    A1_unexpectedEvents(model),
    A2_raceInterleaving(model, exploration),
    A3_orderPermutation(model, normalized),
    A4_pairSymmetry(model),
    A5_boundaryBlast(model),
    A6_resourceInjection(model),
    A7_shortestViolations(model, normalized),
    A8_idempotentReplay(model, exploration),
    A9_leadsTo(model, exploration, normalized),
    A10_sequenceOrder(model, normalized),
    A11_atomicity(model, normalized),
    A12_budget(model, normalized),
    A13_probability(model, normalized),
    A14_deadline(model, normalized),
  ]
  let comparison: ComparisonSummary | undefined
  if (options.beforeModel !== undefined) {
    const beforeValidation = validateModel(options.beforeModel)
```

</details>

**依据 2 · 源码核查**：[src/compose-tool.ts:15-50](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/compose-tool.ts#L15-L50)

握手语义、预算与真实执行。

<details>
<summary>查看原文（36行）</summary>

```text
    'Check two or more LogicModelV1 machines together. Pass the models in `machines`. Pass `rendezvous` for handshake events: these fire only when every declaring machine is enabled at once, and a terminal machine stops taking part. Other events advance one machine, so a machine waiting on a handshake can take any number of its own steps first. There is no rate ratio and no fairness bound. Returns C1 deadlocks (no machine can advance, and one is not terminal) and C2 handshakes that never fire. Both name the reason per machine, and C1 gives the shortest counterexample. `maxStates` caps the search; a capped run says so. Read `verdict` and `verdictReason`.',
  parameters: {
    machines: {
      type: 'json',
      required: true,
      description: 'Array of LogicModelV1 state-machine models to compose (two or more).',
    },
    rendezvous: {
      type: 'json',
      description: 'Optional array of handshake event names shared by the machines.',
    },
    maxStates: {
      type: 'integer',
      description: 'Maximum composite states to explore. Default 10000.',
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
      description: 'Composition verification report with C1/C2 findings.',
    },
    render(args, value) {
      return [{ type: 'text' as const, text: renderReportText(value, { full: args.reportView === 'full' }) }]
    },
  },
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return runCompositionVerification(args.machines as unknown[], {
      rendezvous: args.rendezvous as string[] | undefined,
      maxStates: args.maxStates,
```

</details>

**依据 3 · 源码核查**：[src/data-tool.ts:59-70](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/data-tool.ts#L59-L70)

仅模型/映射进入本地引擎。

<details>
<summary>查看原文（12行）</summary>

```text
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    return runDataVerification(args.model, {
      beforeModel: args.beforeModel,
      fieldMapping: args.fieldMapping as Record<string, string> | undefined,
      copyPairs: args.copyPairs as Array<{ id: string; sourceEntity: string; targetEntity: string; mapping: Record<string, string> }> | undefined,
      migrationMappings: args.migrationMappings as Array<{ from: string; to: string; transform?: 'copy' | 'rename' | 'split' | 'merge' | 'drop' | 'manual'; note?: string }> | undefined,
      backupPairs: args.backupPairs as Array<{ id: string; sourceEntity: string; targetEntity: string; mapping: Record<string, string> }> | undefined,
    }) as unknown as JsonValue
  },
})
```

</details>

**依据 4 · 源码核查**：[src/structure-tool.ts:55-73](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/structure-tool.ts#L55-L73)

单/多图真实路由。

<details>
<summary>查看原文（19行）</summary>

```text
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    if (args.diagrams !== undefined) {
      return reviewGranularity({
        diagrams: args.diagrams as unknown as GranularityDiagram[],
        notation: (args.notation ?? 'auto') as 'auto' | 'plantuml' | 'mermaid',
        ...(args.matrix === undefined ? {} : { matrix: args.matrix }),
      }) as unknown as JsonValue
    }
    if (args.diagram === undefined) {
      return { ok: false, ran: false, verdict: 'fail', verdictReason: 'the tool did not run: pass `diagram` (one structure diagram) or `diagrams` (several levels with parents)', schema: REPORT_SCHEMAS.structure, errorCode: 'UML_INPUT', error: 'structure review needs `diagram` or `diagrams`' } as unknown as JsonValue
    }
    return reviewStructure({
      diagram: args.diagram,
      notation: (args.notation ?? 'auto') as 'auto' | 'plantuml' | 'mermaid',
      ...(args.matrix === undefined ? {} : { matrix: args.matrix }),
    }) as unknown as JsonValue
  },
```

</details>

**依据 5 · 源码核查**：[src/structure.ts:598-617](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/structure.ts#L598-L617)

deny/allow与逐边判决。

<details>
<summary>查看原文（20行）</summary>

```text
      if (matchesAny(rule.deny, edge.to) !== undefined && deniedBy === undefined) deniedBy = rule
      if (matchesAny(rule.allow, edge.to) !== undefined && allowedBy === undefined) allowedBy = rule
    }
    // Deny wins globally: a later rule's allow must not resurrect an edge an earlier
    // rule forbade, or the matrix would depend on rule order.
    let allowed: boolean
    let basis: StructureEdgeVerdict['basis']
    if (deniedBy !== undefined) { allowed = false; basis = 'deny' }
    else if (allowedBy !== undefined) { allowed = true; basis = 'allow' }
    else if (matrixDefault === 'deny') { allowed = false; basis = 'unlisted' }
    else { allowed = true; basis = 'default' }
    edgeVerdicts.push({ from: edge.from, to: edge.to, line: edge.line, matchedRules, allowed, basis })
    if (!allowed) {
      const rule = deniedBy
      findings.push({
        code: 'UML023_DISALLOWED_EDGE',
        severity: 'error',
        message: rule === undefined
          ? 'edge ' + edge.from + ' → ' + edge.to + ' is not permitted: no rule allows it and the matrix default is deny.'
          : 'edge ' + edge.from + ' → ' + edge.to + ' violates rule ' + rule.id + (rule.deny === undefined ? '' : ' (deny ' + rule.deny.join(', ') + ')') + '.',
```

</details>

**依据 6 · 源码核查**：[src/structure.ts:688-706](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/structure.ts#L688-L706)

图与源码对账及矩阵提示。

<details>
<summary>查看原文（19行）</summary>

```text
  const nextSteps: string[] = []
  if (errors > 0) nextSteps.push('Resolve the error findings first: a dangling endpoint or a layer violation means the diagram and the intended architecture disagree.')
  if (rules.length === 0) nextSteps.push('Supply a dependency matrix (rules/layers) to have every edge judged and named; without one only the structural checks run.')
  nextSteps.push('Reconcile the result with the source-side checker: this audits the diagram, an include/graph scan audits the code, and the difference between them is the finding worth chasing.')
  if (graph.notation === 'plantuml') nextSteps.push('State machines are a different question — for a state or activity diagram use logicprobe_uml action=review and logicprobe_verify.')

  return {
    ok: true,
    ran: true,
    ...verdictOfFindings(findings),
    schema: REPORT_SCHEMAS.structure,
    notation: graph.notation,
    graph,
    ...(options.matrix === undefined ? {} : { edgeVerdicts }),
    findings,
    summary,
    hashes: {
      diagram: createHash('sha256').update(options.diagram).digest('hex'),
      ...(options.matrix === undefined ? {} : { matrix: createHash('sha256').update(canonicalJson(options.matrix)).digest('hex') }),
```

</details>

**依据 7 · 源码核查**：[src/concurrency.ts:95-122](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/concurrency.ts#L95-L122)

文本声称与专用验证路由。

<details>
<summary>查看原文（28行）</summary>

```text
      seen.add(key)
      const finding: ConcurrencyFinding = {
        code: rule.absolute ? 'CONCURRENCY_ABSOLUTE_CLAIM' : 'CONCURRENCY_KEYWORD',
        severity: rule.absolute ? 'error' : 'warning',
        message: rule.absolute
          ? 'Concurrency safety claim "' + rule.label + '" detected; logicprobe does not verify concurrency — this needs dedicated verification.'
          : 'Concurrency-related term "' + rule.label + '" detected; review whether the plan addresses this risk.',
        line: lineNumber,
        snippet: line.trim().slice(0, 200),
        keyword: rule.label,
        ...(rule.absolute ? { suggestions: suggestionsFor(rule.label) } : {}),
      }
      findings.push(finding)
    }
  })
  const errors = findings.filter((finding) => finding.severity === 'error').length
  const warnings = findings.filter((finding) => finding.severity === 'warning').length
  const absoluteClaims = findings.filter((finding) => finding.code === 'CONCURRENCY_ABSOLUTE_CLAIM').length
  const nextSteps: string[] = []
  if (absoluteClaims > 0) {
    nextSteps.push('Every absolute claim must either cite dedicated evidence (a TSan/Helgrind run, a CBMC harness, a TLA+ model of the interleaving) or be restated as a bounded, testable property.')
  }
  if (findings.length > absoluteClaims) {
    nextSteps.push('Review each flagged keyword: a plan that names shared state, a mutex or an interrupt without a synchronization argument is incomplete, not merely verbose.')
  }
  nextSteps.push('This scan mines claims; it does not prove concurrency safety — route each one to the tool named in its suggestions.')
  return {
    ok: true,
```

</details>

**依据 8 · 源码核查**：[src/export-tool.ts:50-72](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/export-tool.ts#L50-L72)

导出内容而非外部求解执行。

<details>
<summary>查看原文（23行）</summary>

```text
      return [{ type: 'text' as const, text: renderReportText(value, { full: args.reportView === 'full' }) }]
    },
  },
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    try {
      const result = exportModel(args.model, args.format as ExportFormat)
      const warnings = result.warnings ?? []
      const nextSteps: string[] = []
      if (warnings.length > 0) nextSteps.push('The target notation cannot express some invariants; the warnings name each one — verify them in the target tool rather than assuming they carried over.')
      nextSteps.push('Run the exported file through its own tool (verify/compile) before trusting the translation; logicprobe guarantees the encoding, not the target checker\'s verdict.')
      return {
        ok: true,
        ran: true,
        ...verdictOf(0, warnings.length),
        schema: REPORT_SCHEMAS.export,
        format: result.format,
        primary: result.primary,
        ...(result.extras === undefined ? {} : { extras: result.extras }),
        hashes: exportHashes(args.model),
        warnings,
        nextSteps,
```

</details>

**依据 9 · 源码核查**：[src/exporters.ts:117-135](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/exporters.ts#L117-L135)

UPPAAL性质子集warning。

<details>
<summary>查看原文（19行）</summary>

```text
    if (invariant.kind !== 'never-states') warnings.push('UPPAAL export carries invariant kind ' + invariant.kind + ' only as a comment (not expressible in the exported XML).')
  }
  const initIndex = indexOf.get(model.init) ?? 0
  const xta = '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<!DOCTYPE nta PUBLIC \'-//Uppaal Team//DTD Flat System 1.6//EN\' \'http://www.it.uu.se/research/group/darts/uppaal/flat-1_6.dtd\'>\n' +
    '<nta>\n' +
    '  <declaration>// Generated by logicprobe (UPPAAL XML export; booleans as int).\n' + (globals === '' ? '' : globals + '\n') + '</declaration>\n' +
    '  <template>\n' +
    '    <name x=\"5\" y=\"5\">LogicProbe</name>\n' +
    '    <declaration/>\n' +
    locs + '\n' +
    '    <init ref=\"id' + String(initIndex) + '\"/>\n' +
    edges + '\n' +
    '  </template>\n' +
    '  <system>system LogicProbe;</system>\n' +
    '</nta>\n'
  const extras: Record<string, string> = { queries: queries.join('\n') + (queries.length ? '\n' : '') }
  void initId
  return { format: 'uppaal', primary: xta, extras, warnings }
```

</details>

**依据 10 · 源码核查**：[src/exporters.ts:169-185](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/exporters.ts#L169-L185)

TLA性质子集。

<details>
<summary>查看原文（17行）</summary>

```text
  const forbids = forbiddenIndexes(ex).map((i) => '"' + stateIds[i] + '"')
  const props: string[] = []
  if (forbids.length) props.push('CheckSafety == [] (pc ' + NOTIN + ' {' + forbids.join(', ') + '})')
  for (const invariant of model.invariants ?? []) {
    if (invariant.kind !== 'never-states') warnings.push('TLA+ v1 does not translate invariant kind ' + invariant.kind + '; only never-states becomes a property.')
  }
  let spec = '---- MODULE LogicProbe ----\n' +
    'EXTENDS Integers\n' +
    'VARIABLES ' + variables.join(', ') + '\n' +
    'States == {' + stateIds.map((s) => '"' + s + '"').join(', ') + '}\n' +
    'TypeOK == pc ' + MEM + ' States' + (typeVar === '' ? '' : ' ' + CONJ + ' ' + typeVar) + '\n' +
    'Init == ' + initParts + '\n' +
    'Next ==\n' + nextParts + '\n' +
    (props.length ? '\n' + props.join('\n\n') + '\n' : '') +
    '====\n'
  const extras: Record<string, string> = props.length ? { properties: props.join('\n') + '\n' } : {}
  return { format: 'tla', primary: spec, extras, warnings }
```

</details>

**依据 11 · 源码核查**：[src/baseline.ts:95-164](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/baseline.ts#L95-L164)

delta只计added errors、changed与currentVerdict。

<details>
<summary>查看原文（70行）</summary>

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

  return {
    ok: true,
    ran: true,
    ...delta,
    schema: REPORT_SCHEMAS.baseline,
    currentVerdict: verdictOfReport(current),
    added,
```

</details>

#### 缺口

- 各专用引擎及导出语义/外部求解结果未全量核验
  **影响**：本轮不能对所有模型族给算法正确性或源码证明背书
  **进一步探讨**：按实际任务族选已知反例/兼容输入对照独立检查器，保当前绝对结果/映射/覆盖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得建模，总成本与采用/退出条件？

**研究主题**：采用判断、效果与总成本、工程质量与复用

#### 完整回答

值得试的是已有明确状态/协议不变量、能人工核源码对应关系的开发者，从小型可复核模型找反例；简单直线改动先用普通测试/人工核验可能更省。专业建模和抽象遗漏是关键成本，不是只会填工具参数就能采购“代码正确”。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH/Node及skills/tools服务 | 原生路径必需 | 插件挂载、模型执行 | catalog出现不等工具就绪 |
| 源码/业务不变量与建模能力 | 有效结论必需 | 核对模型假设/反例 | 没对应关系仅模型自洽 |
| full报告、预算与版本档案 | 审计/回归必需 | 保truncated/current/changed | digest不能独立当全量证据 |
| 其它Agent环境/Python CLI | 替代路径才需 | Skill/CLI使用 | 不声称本轮验证这些路径 |
| 外部求解器/专用模型 | 语义升级才需 | 真实时钟/并发等 | 导出文件不等已执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选界限 | 开发者列明确性质/源码版本 | 不可表达就路由专用检查 |
| 建模复核 | 人看转换表、失败路径/假设 | ask确认或auto显式UNCONFIRMED |
| 小样运行 | 固定输入/预算，保full | 看verdict/truncated/覆盖而非ok |
| 反例回源 | 核真实代码与业务条件 | 区分模型错/源码错再改 |
| 版本对比 | 同口径before/diff与当前结果 | 不只看delta，复查changed/current |
| 退出/恢复 | 停gate/卸载前导出档案 | 工具不改业务代码，已有计划/报告另管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地Node/可选模型费用未知 | 学Schema、建模/源码映射 | 门槛专业，耗时未测 |
| 持续使用 | 有界探索/外部求解资源未知 | 同步模型/不变量/源码与解释 | 无净节时或召回对照 |
| 失败恢复 | 重跑/扩预算/另工具未知 | 修抽象、分清未决与真反例 | 多跑不自动解决遗漏 |
| 升级退出 | 报告/版本归档存储未知 | 处理新旧Skill路由/报告口径 | 后继迁移未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可重复核验 | 模型执行/结构化反例/哈希 | 真实源码缺陷召回与净收益 |
| 显式未知 | A9 warning、truncated、coverage | digest/使用者是否正确拒绝未决 |
| 前后/diff | 模型回归与delta/current字段 | 两版同遗漏、严重升级被误读 |
| 外部路由 | 扫声称/导出子集和warning | 专用求解器实际通过/语义全保 |

若转换表无法人工核对、预算持续未决、只拿digest或pass当上线许可、已有错误被delta掩盖，停止自动验收，回到源码/普通测试或专业检查器；保模型/报告以便修正，不需回放目标代码修改。Plugin gate是提示，不保证用户与Agent执行这些审查步骤。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:20-68](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/tool.ts#L20-L68)

资源/报告选项与执行。

<details>
<summary>查看原文（49行）</summary>

```text
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
  },
})
```

</details>

**依据 2 · 源码核查**：[src/index.ts:220-233](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/index.ts#L220-L233)

ask/auto方法差异。

<details>
<summary>查看原文（14行）</summary>

```text
function modeContextText(config: Config, session: Session): string {
  const interaction = resolveInteraction(config, session)
  const lines = [
    'logicprobe: tools — `logicprobe_verify` (state machines), `logicprobe_datamodel_verify` (data models, migrations), `logicprobe_compose_verify` (two or more machines), `logicprobe_concurrency_scan` (finds concurrency claims, proves nothing), `logicprobe_export` (UPPAAL, TLA+, PRISM, SPIN), `logicprobe_uml` (render, parse, review UML), `logicprobe_structure_verify` (dependency diagrams, one or several levels), `logicprobe_report_diff` (baseline vs current).',
    'logicprobe: gate on `verdict`, never on `ok`. Reports carry `verdictReason`, `hashes` and `nextSteps`.',
    interaction === 'auto'
      ? 'logicprobe interaction=auto: do NOT call ask_user_question for model confirmation; run round-trip validation of the extracted transition table and mark the result UNCONFIRMED.'
      : 'logicprobe interaction=ask: show the extracted transition table and get user confirmation before running verification.',
  ]
  if (planModeActive(session)) {
    lines.push('Plan mode active: before exit_plan_mode, run logicprobe Phase 0 and append the "## Plan Verification" block to the plan file.')
  }
  return lines.join(' ')
}
```

</details>

**依据 3 · 源码核查**：[src/report-view.ts:171-213](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/report-view.ts#L171-L213)

摘要边界。

<details>
<summary>查看原文（43行）</summary>

```text
  const schema = text(report.schema) ?? 'logicprobe/report'
  const verdict = text(report.verdict)
  const ok = report.ok
  const summary = record(report.summary) ?? {}
  const lines: string[] = []
  const bits = [
    `${schema}`,
    verdict === undefined ? `ok=${String(ok)}` : `verdict=${verdict}`,
    text(report.verdictReason) ?? '',
    ok === undefined || verdict === undefined ? '' : `ok=${String(ok)}`,
  ].filter((bit) => bit !== '')
  lines.push(bits.join('  '))
  const hash = text(report.modelHash) ?? text(record(report.hashes)?.modelHash)
  const counts = ['states', 'transitions', 'errors', 'warnings', 'checksRun']
    .map((key) => (count(summary[key]) === undefined ? '' : `${key}=${String(count(summary[key]))}`))
    .filter((bit) => bit !== '')
  if (counts.length > 0 || hash !== undefined) lines[0] += '  ' + [...(hash === undefined ? [] : [`modelHash=${hash.slice(0, 12)}…`]), ...counts].join(' ')
  if (report.ran === false) lines.push('note: the tool did not run (the engine refused the input) — the fields below describe the refusal.')
  const coverage = record(report.narrativeCoverage)
  if (coverage !== undefined) {
    const parts = Object.entries(coverage)
      .filter(([, value]) => count(value) !== undefined)
      .map(([key, value]) => `${key} ${String(count(value))}`)
    if (parts.length > 0) lines.push(`NARRATIVE  ${parts.join(' / ')} documented`)
  }
  void options
  return lines
}

/** Trailing lines: notes about what was not checked, then the next steps. */
function footerLines(report: Record_): string[] {
  const lines: string[] = []
  const notes = array(report.coverageNotes).map(String).filter((note) => note !== '')
  if (notes.length > 0) lines.push(`COVERAGE  ${notes.join(' ')}`)
  const steps = array(report.nextSteps).map(String).filter((step) => step !== '')
  for (const step of steps) lines.push(`NEXT  ${step}`)
  const comparison = record(report.comparison)
  if (comparison !== undefined) {
    const parts = Object.entries(comparison)
      .filter(([, value]) => count(value) !== undefined || typeof value === 'string')
      .map(([key, value]) => `${key}=${String(value)}`)
    if (parts.length > 0) lines.push(`COMPARISON  ${parts.join(' ')}`)
  }
```

</details>

**依据 4 · 源码核查**：[src/baseline.ts:142-164](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/baseline.ts#L142-L164)

delta与当前判决。

<details>
<summary>查看原文（23行）</summary>

```text
  const addedErrors = added.filter((finding) => finding.severity === 'error')
  const addedWarnings = added.filter((finding) => finding.severity === 'warning')
  const delta = diffOf(added.length, removed.length, addedErrors.length, addedErrors[0]?.code)

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

  return {
    ok: true,
    ran: true,
    ...delta,
    schema: REPORT_SCHEMAS.baseline,
    currentVerdict: verdictOfReport(current),
    added,
```

</details>

**依据 5 · 源码核查**：[src/export-tool.ts:50-72](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/export-tool.ts#L50-L72)

外部独立检查要求。

<details>
<summary>查看原文（23行）</summary>

```text
      return [{ type: 'text' as const, text: renderReportText(value, { full: args.reportView === 'full' }) }]
    },
  },
  timeoutMs: 10_000,
  isConcurrencySafe: () => true,
  async execute(args) {
    try {
      const result = exportModel(args.model, args.format as ExportFormat)
      const warnings = result.warnings ?? []
      const nextSteps: string[] = []
      if (warnings.length > 0) nextSteps.push('The target notation cannot express some invariants; the warnings name each one — verify them in the target tool rather than assuming they carried over.')
      nextSteps.push('Run the exported file through its own tool (verify/compile) before trusting the translation; logicprobe guarantees the encoding, not the target checker\'s verdict.')
      return {
        ok: true,
        ran: true,
        ...verdictOf(0, warnings.length),
        schema: REPORT_SCHEMAS.export,
        format: result.format,
        primary: result.primary,
        ...(result.extras === undefined ? {} : { extras: result.extras }),
        hashes: exportHashes(args.model),
        warnings,
        nextSteps,
```

</details>

#### 缺口

- 真实建模/解释成本与缺陷收益未知
  **影响**：只建议有专业复核的小样，非默认自动验收
  **进一步探讨**：同已知缺陷对比人审/测试/本工具总工时、漏检、误报、纠错和持续意愿。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 对源码映射缺口的可证伪设计方向？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是给模型语义哈希之外保存版本化源码—模型审查记录：固定源码commit/片段digest、每个关键转移/不变量的对应来源、抽象假设与ask确认/auto未确认状态，并把它与报告完整输入/预算/truncated/绝对当前结果绑定。现Skill已经要求file:line核查，模型也容许_source等元数据；增量在可检查的绑定和变更失效规则，不再声称“从无到有的源码证明”。

因为_元数据被忽略且不进modelHash，单靠往模型塞_source再比较hash不够：应独立的来源/确认记录摘要，源码或映射变更时要求复核而非沿用原确认；它也不能发现所有漏建路径，不能把人确认当语义等价证明。报告消费侧再明确同时拒truncated/未确认/未解决绝对fail，且审严重升级changed，而不是压成单一pass。

最小试验给同一组已知漏建失败/源码变化/严重升级/小预算案例，分别用现Skill+原报告和新增记录+消费规则，比较漏建发现、误阻、未确认被误放、建模/解释工时及真实缺陷修正。若无记录组已同样发现，或新增记录仍漏且成本更高、假确认变流程打勾，则否定独立插件方向，优先改既有消费/审查流程；本轮未实现或测收益。

#### 证据与依据

**依据 1 · 源码核查**：[skills/logicprobe/SKILL.md:20-32](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/skills/logicprobe/SKILL.md#L20-L32)

既有claim/file:line方法与建模路由。

<details>
<summary>查看原文（13行）</summary>

```text

**This is the entry point.** If you have any thought of checking whether something about the code is actually true — however small, however informal the claim — load this skill. It owns the doctrine (enumerate the claims, verify each against the code, cite `file:line`, read `verdict` and never `ok`) and the executable verification for behaviour. When the task lands in a neighbouring domain, its routing table below hands it over rather than stretching the doctrine to cover it.

| The task involves… | What it does |
|---|---|
| Any claim about code you want to check — a design doc, spec, plan, review comment, README, commit message, refactor proposal, or a "this is safe / this always holds / this can't deadlock" assertion | Enumerate the verifiable claims (Phase 1), verify each against the codebase with `file:line` evidence (Phase 2), classify the gaps (Phase 3) |
| A state machine or protocol — ≥3 states, guards, ACK/NACK/retry, lock/unlock, start/stop ordering | Build an executable model: S1-S8 structural checks, A1-A14 adversarial probes |
| A quantitative or temporal guarantee — worst-case path cost ≤ budget, "≥90% of runs reach SAFE", "must leave within 2 ticks" | A12 budget, A13 probabilistic reachability, A14 deadlines, each with a counterexample path |
| A handshake or power-up sequencing across two or more components | `logicprobe_compose_verify`: C1 composition deadlock, C2 rendezvous that never fires |
| A refactoring that changes state topology or guard conditions | BEFORE/AFTER models compared for behavioral preservation, invariant continuity and deadlock regression (D1-D4) |
| Explicit request to prove code correct, formally verify a module, or check a migration for breakage | Route by domain — the table under [Routing to the Sibling Skills](#routing-to-the-sibling-skills) — and keep the doctrine |
| An architecture or dependency question about a component/package/class diagram | `logicprobe-structure`: parse the diagram into a dependency graph and judge every edge against the dependency matrix |

```

</details>

**依据 2 · 源码核查**：[src/engine.ts:558-569](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L558-L569)

来源元数据忽略。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 3 · 源码核查**：[src/engine.ts:3293-3333](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/engine.ts#L3293-L3333)

哈希、叙述与truncated输出。

<details>
<summary>查看原文（41行）</summary>

```text
  const coverageNotes = computeCoverageNotes(model)
  const narrativeCoverage = narrativeCoverageOf(model)
  // R3: a partial narrative is valid, but the gap must be machine-readable instead of only a
  // sentence in `nextSteps`. It rides on S5 — the check that already reports undocumented
  // (state, event) combinations — so the documented check count stays 22.
  if (narrativeCoverage !== undefined && !narrativeComplete(narrativeCoverage)) {
    checks.find((check) => check.id === 'S5')?.findings.push({
      code: 'NARRATIVE_PARTIAL',
      severity: 'info',
      message: 'Narrative coverage is partial (states ' + narrativeCoverage.states + ', events ' + narrativeCoverage.events + ', scenarios ' + narrativeCoverage.scenarios + '): the checks still run over the whole model, but the undocumented symbols have to be re-derived by the reader.',
    })
  }
  return {
    ok: true,
    ran: true,
    ...verdictOfFindings(checks.flatMap((check) => check.findings)),
    schema: REPORT_SCHEMAS.verify,
    schemaVersion: 1,
    hashSpec,
    modelHash: modelHash(model, hashSpec),
    hashes: {
      hashSpec,
      modelHash: modelHash(model, hashSpec),
      ...(comparison === undefined ? {} : { beforeModelHash: comparison.beforeModelHash, afterModelHash: comparison.afterModelHash }),
    },
    ...metadata,
    ...(narrativeCoverage === undefined ? {} : { narrativeCoverage }),
    summary: {
      states: model.states.length,
      transitions: model.transitions.length,
      errors,
      warnings,
      checksRun: checks.length,
      truncated: exploration.truncated || hasUndecidedFinding(checks),
    },
    checks,
    nextSteps: verificationNextSteps(checks, narrativeCoverage),
    ...(model.narrative === undefined ? {} : { narrative: model.narrative }),
    ...(comparison === undefined ? {} : { comparison }),
    ...(coverageNotes.length === 0 ? {} : { coverageNotes }),
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:220-233](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/index.ts#L220-L233)

auto未确认提示。

<details>
<summary>查看原文（14行）</summary>

```text
function modeContextText(config: Config, session: Session): string {
  const interaction = resolveInteraction(config, session)
  const lines = [
    'logicprobe: tools — `logicprobe_verify` (state machines), `logicprobe_datamodel_verify` (data models, migrations), `logicprobe_compose_verify` (two or more machines), `logicprobe_concurrency_scan` (finds concurrency claims, proves nothing), `logicprobe_export` (UPPAAL, TLA+, PRISM, SPIN), `logicprobe_uml` (render, parse, review UML), `logicprobe_structure_verify` (dependency diagrams, one or several levels), `logicprobe_report_diff` (baseline vs current).',
    'logicprobe: gate on `verdict`, never on `ok`. Reports carry `verdictReason`, `hashes` and `nextSteps`.',
    interaction === 'auto'
      ? 'logicprobe interaction=auto: do NOT call ask_user_question for model confirmation; run round-trip validation of the extracted transition table and mark the result UNCONFIRMED.'
      : 'logicprobe interaction=ask: show the extracted transition table and get user confirmation before running verification.',
  ]
  if (planModeActive(session)) {
    lines.push('Plan mode active: before exit_plan_mode, run logicprobe Phase 0 and append the "## Plan Verification" block to the plan file.')
  }
  return lines.join(' ')
}
```

</details>

**依据 5 · 源码核查**：[src/baseline.ts:132-164](https://github.com/AmethystLuna/logicprobe/blob/85c2468f1c57b7504e8bb9725647eade756696e6/src/baseline.ts#L132-L164)

严重级changed及绝对结果。

<details>
<summary>查看原文（33行）</summary>

```text
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

  return {
    ok: true,
    ran: true,
    ...delta,
    schema: REPORT_SCHEMAS.baseline,
    currentVerdict: verdictOfReport(current),
    added,
```

</details>

#### 缺口

- 来源/确认记录与消费规则未实现，无盲测
  **影响**：假设不能计入本插件能力/评分或采用优势
  **进一步探讨**：先可丢弃案例盲测上述错误/成本，增量不抵负担则停止。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
