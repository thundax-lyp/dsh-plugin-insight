# dsh-model-everything

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[29b0bae](https://github.com/AmethystLuna/dsh-model-everything/tree/29b0bae2bf4b355243a0ca757512dc489440d659)

<!-- BEGIN META -->
[![npm 30d 1,186](https://img.shields.io/static/v1?label=npm+30d&message=1%2C186&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything)
<!-- END META -->

> **功能**：把设计和代码断言建成模型，执行验证、图审查和前后报告比较。

> **亮点**：[Q03](#research-q03) 核心增量是将有限模型验证、版本哈希和重构对照组织为宿主内可归档的审查交付；成熟搜索算法及哈希不作原创归属，代码到模型的忠实性仍由人负责。

> **主要限制**：[Q03](#research-q03) 模型通过能否说明实际代码通过？引擎明确不建立抽象，漏抽一个实现事件便能使模型结论失去代表性；应把报告当抽象范围内的证据，不能替代实现验收。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 哪些审查值得使用模型报告，何时退回直接阅读？](#detail-section-15)
  - [Q02 · 工具如何从DSH注册进入有预算的验证？](#detail-section-16)
  - [Q03 · 模型哈希与重构对照的贡献能否延伸为代码正确性证明？](#detail-section-17)
  - [Q04 · 成本、失败恢复和工程复用是否足以支持有试用？](#detail-section-18)
  - [Q05 · 抽取证据清单能否减少模型与实现脱节？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向能抽取有限模型的架构与重构审查者，用可复算模型报告回查行为断言。

简单基线是人工读代码加既有单元测试，专业基线是直接准备SPIN等验证输入；本轮只比较实现与交接方式，未做效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型验证与回归 | 检查有限模型并比较前后行为 | 用户负责抽取，预算截断不等于通过 |
| 报告哈希与对照 | 归档和复算同一抽象 | 不证明抽象与实际代码一致 |
| 包内Skill | 指导模型与判定阅读 | 依赖宿主Skill提供者 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 失效与退路 |
|---|---|---|
| Node与包声明的DSH peer | 加载原生工具与Skill | 版本不符先停止接入 |
| tools与skills宿主服务 | 注册工具和包内建模说明 | 服务不可用时核查注册日志 |
| 有限模型及人工抽取能力 | 让判定代表目标断言 | 无法忠实抽取时回到代码测试 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与完成判据 | 失败处理 |
|---|---|---|
| 隔离配置匹配宿主 | 使用者核对工具与Skill可见 | 不可见则停用并排查peer与服务 |
| 提供已知反例模型 | 审查者确认出处与约束覆盖 | 漏抽则先修模型 |
| 验证并比较报告 | 审查者区分失败、跳过、未决 | 截断先缩模，必要时转专业验证器 |
| 回查实际代码 | 代码负责人复核反例与映射 | 不能对应则不将模型报告用于放行 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次使用 | Node、DSH及模型调用资源，金额未知 | 配置宿主、学习schema、抽取模型，时长未知 |
| 持续使用 | 每轮建模与回查调用，费用未知 | 代码变动后重抽与解释报告，时长未知 |
| 失败恢复 | 重试与外部验证器资源，费用未知 | 修正选项、缩模、复查未决及接管，时长未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 合格任务 | 源码支持 | 仍缺依据 |
|---|---|---|
| 有限模型审查 | 有预算搜索、参数拒绝和反例报告接线 | 本轮未执行正确性与宿主验收 |
| 重构回归 | 接收beforeModel及stateMapping | 抽取忠实性、总耗时与错误放行率未测 |

> **思考**：[Q03](#research-q03) 模型通过能否说明实际代码通过？引擎明确不建立抽象，漏抽一个实现事件便能使模型结论失去代表性；应把报告当抽象范围内的证据，不能替代实现验收。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q03](#research-q03) 核心增量是将有限模型验证、版本哈希和重构对照组织为宿主内可归档的审查交付；成熟搜索算法及哈希不作原创归属，代码到模型的忠实性仍由人负责。

统一hash与选项拒绝值得复用，但必须连同规范版本和判定语义迁移；src/index.ts批量注册中途失败后的effect与重试关系尚需宿主检验，不能当已确认故障。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 模型通过能否说明实际代码通过？引擎明确不建立抽象，漏抽一个实现事件便能使模型结论失去代表性；应把报告当抽象范围内的证据，不能替代实现验收。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q01](#research-q01)、[Q04](#research-q04) 建议仅对已有小模型能力的架构师隔离试用，先检查已知反例与抽取覆盖，再核对报告是否正确区分skip和未决；不以模型通过放行实际代码。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查宿主接线、模型工具、预算截断与哈希机制；效果与宿主兼容未经运行，抽取证据清单是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tool.ts、src/engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的README、清单与核心源码；未执行目标代码与测试，未独立复现作者成本数据。
- 下一步：最小验证先用一个已知缺陷的小状态机确认反例和未决语义，再以相同预算比较五个协议的抽取清单；记录漏检、人工分钟及调用费。尚未执行。

**分析版本**

- **仓库**：[AmethystLuna/dsh-model-everything](https://github.com/AmethystLuna/dsh-model-everything)
- **版本号**：0.5.0（[固定提交 29b0bae](https://github.com/AmethystLuna/dsh-model-everything/tree/29b0bae2bf4b355243a0ca757512dc489440d659)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是把每个转换的代码出处与独立摘要作为抽取交接清单，在运行验证前确认覆盖，以减少模型和实现脱节；五个已知缺陷协议对照漏检与人工时间，未改善即停止。

最小验证先用一个已知缺陷的小状态机确认反例和未决语义，再以相同预算比较五个协议的抽取清单；记录漏检、人工分钟及调用费。尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 69 | 10196 | — | — | 132584 |
| .mjs | source | 15 | 2592 | 2045 | 342 | — |
| .md | example | 6 | 104 | — | — | 687 |
| .js | example | 17 | 546 | 458 | 22 | — |
| .js | source | 58 | 21712 | 18598 | 3140 | — |
| .ts | source | 58 | 22833 | 17561 | 3903 | — |
| .md | test | 3 | 288 | — | — | 3064 |
| .mjs | test | 40 | 16824 | 13589 | 1816 | — |
| .mjs | example | 1 | 118 | 91 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查建模报告相对聊天式代码审查的可追溯增量及抽取边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 哪些审查值得使用模型报告，何时退回直接阅读？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合已经能抽取有限状态机的架构师与重构审查者，在跨模块协议、迁移或行为保持审查中，把模糊断言改成可以复算的模型判定。合格交付是带出处、模型与报告的审查记录，并由人把反例回查实际代码；不是拿到pass便宣布实现正确。简单替代是直接阅读代码加单元测试，或人工给外部验证器准备输入。此插件把模型输入、判定、前后对比和报告集中在宿主工具链，减少切换与报告格式拼装，但不能省掉抽象与验收。作者称中大型项目可摊薄开销，其成本倍数只是作者报告；项目大不意味着引擎可以枚举大状态空间。初次试用应选已有已知反例的小协议，报告未指出反例、模型遗漏业务约束或抽取负担超过直接复核时退出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-39](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/README.md#L25-L39)

作者同时限定目标项目尺度和已经抽象的小模型，不能把项目规模直接解释为验证规模。

<details>
<summary>查看原文（15行）</summary>

```text
## 专精于中大型、中高复杂度项目的建模审查

这个工具专做一件事：把项目里关于行为、结构、数据的断言建成模型，跑一遍，拿回一条可复算的结论，而不是一段读起来像结论的散文。

**它专精的尺度是中大型、中高复杂度的项目**：几万行代码、上百个文件、跨模块的协议与状态机。在那个尺度上，一次判定替代的是几十次阅读，技能正文与工具定义那部分固定开销也随之摊开；我们测到的成本比在这一档回落到 0.93×–1.11×。

它交回三样东西：

- 一条**可复算**的结论：哈希、`verdict`、出处；
- 一条**反例路径**：哪几步、哪个事件序列让断言不成立；
- 一份**可导出的模型**：同一条结论能交给 UPPAAL、TLA+、PRISM、SPIN 复核。

**它专精的对象，是人已经抽象好的小模型**：状态机、有限词自动机、数据模型与迁移、设计声明、依赖图。模型大到枚举不动时，它报 `truncated` 并点名未决的检查；减模型（去掉性质不读的变量、合并对称状态），或把那份模型交给 SPIN 的偏序归约、NuSMV 的符号化、CBMC 的有界 SAT，都能接着往下走。

## 报告卡片
```

</details>

**依据 2 · 作者声明**：[README.md:84-95](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/README.md#L84-L95)

重构工作流由用户提供前后模型并回查代码，限定采用任务。

<details>
<summary>查看原文（12行）</summary>

```text

每个场景都只讲「给什么、看哪个字段、它不管什么」。

### 重构 harness

1. 重构前抽 **BEFORE** 模型；数据侧留一份旧 schema。
2. 重构。
3. 抽 **AFTER** 模型。
4. `model_verify` 带 `beforeModel` 与 `stateMapping`；数据侧用 `model_datamodel_verify` 的 `fieldMapping`。
5. `report_diff` 拿基线报告比对：**新增的 error 就是拒绝这次重构的理由**。

它比的是两份模型，不是两份代码；也不读 diff、不改代码、不跑测试。
```

</details>

#### 缺口

- 未独立测量抽取和复核总时间
  **影响**：不能确认整体节时或作者成本倍数
  **进一步探讨**：同一小协议比较直接审查与建模审查的合格率、人工分钟和总调用成本

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 工具如何从DSH注册进入有预算的验证？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply取得tools服务后通过ctx.effect注册model_verify及相关数据、组合、导出和报告工具；服务尚未挂载时直接返回，在agent/pre-step之后再次尝试。Skill使用宿主FileSystemSkillProvider加载包内skills，根组件有明确原生工具与Skill接线。model_verify接收内联模型或modelPath，先核对stateMapping形状与beforeModel依赖，再调用runVerification；错误转为VERIFY_OPTION_INVALID拒绝。搜索队列按运行状态去重，达到maxStates上限设置truncated并停止，报告指引明确未决不等于证明。Node与DSH peer版本是启动前提，API能注册、effect能销毁与实际宿主接线仍需安装验收。重试注册是在下一个模型步骤进行，不能解释为所有服务异常都能自动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:233-262](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/index.ts#L233-L262)

显示tools服务、注册效果及异常处理。

<details>
<summary>查看原文（30行）</summary>

```text
  const registerTool = (): void => {
    if (toolRegistered) return
    const tools = ctx.get('tools') as ToolRegistryLike | undefined
    if (tools === undefined) return
    try {
      ctx.effect(() => tools.register(modelVerifyTool), 'dsh-model-everything: verify tool')
      ctx.effect(() => tools.register(modelDataModelVerifyTool), 'dsh-model-everything: data verify tool')
      ctx.effect(() => tools.register(modelConcurrencyScanTool), 'dsh-model-everything: concurrency scan tool')
      ctx.effect(() => tools.register(modelComposeTool), 'dsh-model-everything: compose tool')
      ctx.effect(() => tools.register(modelExportTool), 'dsh-model-everything: export tool')
      ctx.effect(() => tools.register(umlRenderTool), 'dsh-model-everything: uml render tool')
      ctx.effect(() => tools.register(umlParseTool), 'dsh-model-everything: uml parse tool')
      ctx.effect(() => tools.register(umlReviewTool), 'dsh-model-everything: uml review tool')
      ctx.effect(() => tools.register(umlExplainLabelsTool), 'dsh-model-everything: uml explain-labels tool')
      ctx.effect(() => tools.register(umlStructureTool), 'dsh-model-everything: structure tool')
      ctx.effect(() => tools.register(designTool), 'dsh-model-everything: design review tool')
      ctx.effect(() => tools.register(reportDiffTool), 'dsh-model-everything: report diff tool')
      ctx.effect(() => tools.register(modelEditTool), 'dsh-model-everything: model edit tool')
      ctx.effect(() => tools.register(modelAutomatonTool), 'dsh-model-everything: automaton tool')
      toolRegistered = true
      dataToolRegistered = true
      concurrencyToolRegistered = true
      composeToolRegistered = true
      exportToolRegistered = true
      umlToolsRegistered = true
      structureToolRegistered = true
      reportDiffToolRegistered = true
    } catch (err) {
      console.warn('[dsh-model-everything] model_verify/model_datamodel_verify tool registration failed', err)
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:275-292](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/index.ts#L275-L292)

Skill提供者与pre-step重试实际接线。

<details>
<summary>查看原文（18行）</summary>

```text
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'dsh-model-everything',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
  })
  // Optional services register opportunistically and a base-bundle row can mount after
  // this one applies, so registration is retried on the first model step - the point by
  // which the app is fully booted. Nothing is appended to the step: the tools and the
  // skill text are the guide, not an injected reminder. Session-start routing, if a
  // deployment wants it, is the separate gate component in `gate.ts`, not this row.
  ctx.on('agent/pre-step', async (_payload, next) => {
    const decision = await next()
    registerIntegrations()
    return decision
  })
```

</details>

**依据 3 · 源码核查**：[src/tool.ts:76-108](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/tool.ts#L76-L108)

选项检查到runVerification及拒绝输出的调用链。

<details>
<summary>查看原文（33行）</summary>

```text
  async execute(args) {
    try {
      // `stateMapping` is declared `json`, so a string, a list or a map to non-strings all arrive here, and the
      // engine reads the option with `mapping[state] ?? state`: every one of those quietly became the identity
      // mapping. A renamed state then read as "A was removed and A2 was added" - a D1 error produced by the shape
      // of an option rather than by the refactor, which is the one thing a regression comparison must not do.
      requireObjectOption(args.stateMapping, 'stateMapping', 'VERIFY_OPTION_INVALID')
      const mapping = args.stateMapping as Record<string, unknown> | undefined
      if (mapping !== undefined) {
        if (args.beforeModel === undefined) {
          throw new OptionShapeError(
            'VERIFY_OPTION_INVALID',
            'stateMapping was passed without beforeModel: the mapping says how BEFORE state ids turn into AFTER ones, so there is nothing to map. Pass beforeModel, or omit the mapping.',
          )
        }
        const [from, to] = Object.entries(mapping).find(([, value]) => typeof value !== 'string' || value === '') ?? []
        if (from !== undefined) {
          throw new OptionShapeError(
            'VERIFY_OPTION_INVALID',
            'stateMapping.' + from + ' is not a state id (it is ' + (Array.isArray(to) ? 'an array' : to === null ? 'null' : 'a ' + typeof to) + '). Every value is the AFTER state id the BEFORE state maps to, so it has to be a non-empty string.',
          )
        }
      }
      const model = oneOf(args.model, args.modelPath, 'model', 'modelPath', 'VERIFY_OPTION_INVALID')
      return runVerification(model, {
        maxStates: args.maxStates,
        maxPermutationEvents: args.maxPermutationEvents,
        beforeModel: args.beforeModel,
        stateMapping: mapping as Record<string, string> | undefined,
      }) as unknown as JsonValue
    } catch (error) {
      return optionRefusal(error, 'VERIFY_OPTION_INVALID') as unknown as JsonValue
    }
```

</details>

**依据 4 · 源码核查**：[src/engine.ts:1363-1385](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L1363-L1385)

队列去重、maxStates截断和返回值。

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

- 未检查真实宿主版本中可选服务启动顺序
  **影响**：注册接线的实际兼容尚不确定
  **进一步探讨**：在隔离宿主观察首次注册、晚挂载和卸载后工具清理

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 模型哈希与重构对照的贡献能否延伸为代码正确性证明？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是将结构化模型判定与可归档的报告契约整合进DSH，而非首创状态空间搜索或SHA-256。相对聊天式审查，valueHash通过稳定序列化和统一hashPayload规范绑定模型输入，beforeModel与stateMapping给前后模型的行为保持检查明确接口，报告要求用户区分失败、跳过与未决，因而可以追问结论究竟覆盖什么。这些机制支持复算同一抽象并比较报告；不证明抽象忠实。最强反例是实际代码漏掉一个事件处理，而人工模型仍把该事件建为合法转换，模型可全部通过但实现有错。README和引擎都明确承认不建立抽象、不读取程序源码。相比直接使用专业验证器，增量主要是宿主内工作流和报告统一，不能据源码包装判断算法更强或全球原创。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:417-429](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L417-L429)

稳定排序序列化与统一模型hash实现支持版本绑定。

<details>
<summary>查看原文（13行）</summary>

```text
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map((item) => stableStringify(item)).join(',') + ']'
  const record = value as Record<string, unknown>
  return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableStringify(record[key])).join(',') + '}'
}

/**
 * The hash of any model this plugin carries: the same normalization as `modelHash`,
 * over whatever object the family defines. A use case diagram and a state machine are
 * hashed by one rule, so a report can name either.
 */
export function valueHash(value: unknown, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return createHash('sha256').update(stableStringify(hashPayload(value, spec))).digest('hex')
```

</details>

**依据 2 · 源码核查**：[src/tool.ts:41-47](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/tool.ts#L41-L47)

beforeModel与stateMapping的对照输入。

```text
    beforeModel: {
      type: 'json',
      description: 'Optional BEFORE LogicModelV1 state machine model for refactoring/migration regression comparison.',
    },
    stateMapping: {
      type: 'json',
      description: 'Optional object mapping BEFORE state ids to AFTER state ids. Omit for identity mapping (same state names).',
```

**依据 3 · 源码核查**：[src/engine.ts:290-311](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L290-L311)

跳过和未决的报告解释，以及不建立抽象的明确边界。

<details>
<summary>查看原文（22行）</summary>

```text
  // A check that had nothing to examine is named here, because a reader who is not told will assume every
  // named check looked at the model. A list of failures does not say that, and neither does `pass`.
  const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.name + ' (' + check.id + ')')
  if (skipped.length > 0) {
    steps.push('Not checked: ' + skipped.join(', ') + ' examined nothing — silence there is not a pass. Declare what each needs, or treat the model as unverified on those points.')
  }
  // Named checks above, bare codes here. That is deliberate: each warning is a different kind of thing,
  // so there is no single name to give the set, and the sentence points at where each one IS explained
  // rather than leaving a reader to guess what the codes stand for.
  if (warningCodes.length > 0) steps.push('Review the warning findings (' + warningCodes.join(', ') + '): they are not failures, but they are not silence either. Each one is explained in its own `message` under `findings`.')
  if (coverage !== undefined && !narrativeComplete(coverage)) {
    steps.push('Complete the narrative (states ' + coverage.states + ', events ' + coverage.events + ', scenarios ' + coverage.scenarios + ') — a partial narrative is valid, but a reader still has to re-derive the missing symbols.')
  }
  // A truncated search is the one outcome where "look harder" is the wrong advice: the wall is
  // combinatorial, and raising maxStates buys a constant factor. Name the ladder instead, so the reader
  // knows this is not a bug to fix but a model to reduce, or a different tool to use.
  if (hasUndecidedFinding(checks)) {
    steps.push('The search stopped before deciding, so the undecided checks are neither proven nor refuted. Do not just raise maxStates: first reduce the model (drop variables the property does not read, collapse symmetric states, order independent events), and if it still explodes, move to a tool that does not enumerate every state - SPIN for partial-order reduction, NuSMV/nuXMV for symbolic search, CBMC for bounded SAT. This plugin establishes no abstraction and reads no program source, so a property that needs one is outside it.')
  }
  // The range is dropped: the code that would be reported back is already named in `findings`, and a
  // reader who has not seen a report yet learns nothing from four digits.
  steps.push('Re-run with beforeModel/stateMapping after the change to prove the behaviour did not regress: behaviour preserved, invariants continuous, the state mapping consistent. Then compare the two reports with `report_diff` rather than reading them side by side.')
```

</details>

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 成本、失败恢复和工程复用是否足以支持有条件试用？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次成本由使用者承担Node、匹配DSH peer、建模规则学习和模型抽取；持续成本是每次代码变动重抽模型、模型调用和人工回查反例。失败恢复包括错误选项修正、缩小状态空间、保留未决结果并转到SPIN或符号化等外部工具。现金资源与人工时间均无本轮测量，不用未执行的测试套件存在来填补。值得借鉴的是错误选项显式拒绝、skip与truncated分开，以及统一hash规范，移植时必须保留规范版本和调用方的判定解释；若只复制工具名却丢失这些语义，报告可追溯性会下降。注册函数一次批量注册后才设标志，异常发生在中间时已有effect与后续重试的相互作用需要宿主检查；当前不把它写成已复现重复注册。采用仅限隔离的小模型试验，不适合直接作为代码合并放行证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:76-108](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/tool.ts#L76-L108)

参数拒绝与状态映射检查可作为可复用的边界设计。

<details>
<summary>查看原文（33行）</summary>

```text
  async execute(args) {
    try {
      // `stateMapping` is declared `json`, so a string, a list or a map to non-strings all arrive here, and the
      // engine reads the option with `mapping[state] ?? state`: every one of those quietly became the identity
      // mapping. A renamed state then read as "A was removed and A2 was added" - a D1 error produced by the shape
      // of an option rather than by the refactor, which is the one thing a regression comparison must not do.
      requireObjectOption(args.stateMapping, 'stateMapping', 'VERIFY_OPTION_INVALID')
      const mapping = args.stateMapping as Record<string, unknown> | undefined
      if (mapping !== undefined) {
        if (args.beforeModel === undefined) {
          throw new OptionShapeError(
            'VERIFY_OPTION_INVALID',
            'stateMapping was passed without beforeModel: the mapping says how BEFORE state ids turn into AFTER ones, so there is nothing to map. Pass beforeModel, or omit the mapping.',
          )
        }
        const [from, to] = Object.entries(mapping).find(([, value]) => typeof value !== 'string' || value === '') ?? []
        if (from !== undefined) {
          throw new OptionShapeError(
            'VERIFY_OPTION_INVALID',
            'stateMapping.' + from + ' is not a state id (it is ' + (Array.isArray(to) ? 'an array' : to === null ? 'null' : 'a ' + typeof to) + '). Every value is the AFTER state id the BEFORE state maps to, so it has to be a non-empty string.',
          )
        }
      }
      const model = oneOf(args.model, args.modelPath, 'model', 'modelPath', 'VERIFY_OPTION_INVALID')
      return runVerification(model, {
        maxStates: args.maxStates,
        maxPermutationEvents: args.maxPermutationEvents,
        beforeModel: args.beforeModel,
        stateMapping: mapping as Record<string, string> | undefined,
      }) as unknown as JsonValue
    } catch (error) {
      return optionRefusal(error, 'VERIFY_OPTION_INVALID') as unknown as JsonValue
    }
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:288-311](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L288-L311)

恢复指引区分跳过、warning和未决。

<details>
<summary>查看原文（24行）</summary>

```text
  const warningCodes = [...new Set(checks.flatMap((check) => check.findings).filter((finding) => finding.severity === 'warning').map((finding) => finding.code))].sort()
  if (failed.length > 0) steps.push('Resolve the failing checks first: ' + failed.join(', ') + '.')
  // A check that had nothing to examine is named here, because a reader who is not told will assume every
  // named check looked at the model. A list of failures does not say that, and neither does `pass`.
  const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.name + ' (' + check.id + ')')
  if (skipped.length > 0) {
    steps.push('Not checked: ' + skipped.join(', ') + ' examined nothing — silence there is not a pass. Declare what each needs, or treat the model as unverified on those points.')
  }
  // Named checks above, bare codes here. That is deliberate: each warning is a different kind of thing,
  // so there is no single name to give the set, and the sentence points at where each one IS explained
  // rather than leaving a reader to guess what the codes stand for.
  if (warningCodes.length > 0) steps.push('Review the warning findings (' + warningCodes.join(', ') + '): they are not failures, but they are not silence either. Each one is explained in its own `message` under `findings`.')
  if (coverage !== undefined && !narrativeComplete(coverage)) {
    steps.push('Complete the narrative (states ' + coverage.states + ', events ' + coverage.events + ', scenarios ' + coverage.scenarios + ') — a partial narrative is valid, but a reader still has to re-derive the missing symbols.')
  }
  // A truncated search is the one outcome where "look harder" is the wrong advice: the wall is
  // combinatorial, and raising maxStates buys a constant factor. Name the ladder instead, so the reader
  // knows this is not a bug to fix but a model to reduce, or a different tool to use.
  if (hasUndecidedFinding(checks)) {
    steps.push('The search stopped before deciding, so the undecided checks are neither proven nor refuted. Do not just raise maxStates: first reduce the model (drop variables the property does not read, collapse symmetric states, order independent events), and if it still explodes, move to a tool that does not enumerate every state - SPIN for partial-order reduction, NuSMV/nuXMV for symbolic search, CBMC for bounded SAT. This plugin establishes no abstraction and reads no program source, so a property that needs one is outside it.')
  }
  // The range is dropped: the code that would be reported back is already named in `findings`, and a
  // reader who has not seen a report yet learns nothing from four digits.
  steps.push('Re-run with beforeModel/stateMapping after the change to prove the behaviour did not regress: behaviour preserved, invariants continuous, the state mapping consistent. Then compare the two reports with `report_diff` rather than reading them side by side.')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:237-261](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/index.ts#L237-L261)

批量注册和异常处理范围的静态风险，未运行复现。

<details>
<summary>查看原文（25行）</summary>

```text
    try {
      ctx.effect(() => tools.register(modelVerifyTool), 'dsh-model-everything: verify tool')
      ctx.effect(() => tools.register(modelDataModelVerifyTool), 'dsh-model-everything: data verify tool')
      ctx.effect(() => tools.register(modelConcurrencyScanTool), 'dsh-model-everything: concurrency scan tool')
      ctx.effect(() => tools.register(modelComposeTool), 'dsh-model-everything: compose tool')
      ctx.effect(() => tools.register(modelExportTool), 'dsh-model-everything: export tool')
      ctx.effect(() => tools.register(umlRenderTool), 'dsh-model-everything: uml render tool')
      ctx.effect(() => tools.register(umlParseTool), 'dsh-model-everything: uml parse tool')
      ctx.effect(() => tools.register(umlReviewTool), 'dsh-model-everything: uml review tool')
      ctx.effect(() => tools.register(umlExplainLabelsTool), 'dsh-model-everything: uml explain-labels tool')
      ctx.effect(() => tools.register(umlStructureTool), 'dsh-model-everything: structure tool')
      ctx.effect(() => tools.register(designTool), 'dsh-model-everything: design review tool')
      ctx.effect(() => tools.register(reportDiffTool), 'dsh-model-everything: report diff tool')
      ctx.effect(() => tools.register(modelEditTool), 'dsh-model-everything: model edit tool')
      ctx.effect(() => tools.register(modelAutomatonTool), 'dsh-model-everything: automaton tool')
      toolRegistered = true
      dataToolRegistered = true
      concurrencyToolRegistered = true
      composeToolRegistered = true
      exportToolRegistered = true
      umlToolsRegistered = true
      structureToolRegistered = true
      reportDiffToolRegistered = true
    } catch (err) {
      console.warn('[dsh-model-everything] model_verify/model_datamodel_verify tool registration failed', err)
```

</details>

**依据 4 · 源码核查**：[package.json:1-12](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/package.json#L1-L12)

包入口及版本固定；其余peer要求应由使用者依包清单核对。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-model-everything",
  "version": "0.5.0",
  "description": "Modeling abstraction, architecture visualisation and automated review for designs and code, including a refactoring harness: draw a Mermaid or PlantUML source and measure its structure, executable verification of machines and protocols with before/after regression, data-model and migration checks, concurrency claim routing, export to external checkers, dependency-graph review, and report diffing. Native plugin for DeepSeek Harness (dsh).",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
```

</details>

#### 缺口

- 没有目标执行的现金、人工时间与全周期退出记录
  **影响**：不能称总成本更低或持续采用已成立
  **进一步探讨**：记录首次配置与每次重抽、重试、回查分钟及调用费，最后验证卸载工具消失

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 抽取证据清单能否减少模型与实现脱节？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给每个模型转换和关键约束附一条代码出处与反例检查清单，先由审查者确认抽取覆盖，再运行现有验证器，可降低模型本身无误却遗漏实现路径的错误放行。推导来自Q03的哈希绑定能力与引擎明确不建立抽象的缺口；增量在抽取交接责任，而非再增加一个验证算法。元数据可以记录出处，但哈希规范排除的字段不能直接当作证据未变证明，需要把清单独立摘要和代码revision一起保存。最小验证采用五个已有缺陷的有限协议任务，同一模型和审查预算比较有无清单，统计漏掉的代码路径、错误放行和人工时间。清单不能减少错误放行，或额外复核负担超过直接回查，便否定方向；不据此声明市场需求或付费意愿。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:303-307](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L303-L307)

引擎明确不建立抽象，为证据清单的缺口提供直接依据。

```text
  // A truncated search is the one outcome where "look harder" is the wrong advice: the wall is
  // combinatorial, and raising maxStates buys a constant factor. Name the ladder instead, so the reader
  // knows this is not a bug to fix but a model to reduce, or a different tool to use.
  if (hasUndecidedFinding(checks)) {
    steps.push('The search stopped before deciding, so the undecided checks are neither proven nor refuted. Do not just raise maxStates: first reduce the model (drop variables the property does not read, collapse symmetric states, order independent events), and if it still explodes, move to a tool that does not enumerate every state - SPIN for partial-order reduction, NuSMV/nuXMV for symbolic search, CBMC for bounded SAT. This plugin establishes no abstraction and reads no program source, so a property that needs one is outside it.')
```

**依据 2 · 源码核查**：[src/engine.ts:417-429](https://github.com/AmethystLuna/dsh-model-everything/blob/29b0bae2bf4b355243a0ca757512dc489440d659/src/engine.ts#L417-L429)

统一hash可借鉴，但清单仍需独立绑定。

<details>
<summary>查看原文（13行）</summary>

```text
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map((item) => stableStringify(item)).join(',') + ']'
  const record = value as Record<string, unknown>
  return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableStringify(record[key])).join(',') + '}'
}

/**
 * The hash of any model this plugin carries: the same normalization as `modelHash`,
 * over whatever object the family defines. A use case diagram and a state machine are
 * hashed by one rule, so a report can name either.
 */
export function valueHash(value: unknown, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return createHash('sha256').update(stableStringify(hashPayload(value, spec))).digest('hex')
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
