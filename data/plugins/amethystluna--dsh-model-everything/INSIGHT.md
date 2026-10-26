# DSH Model Everything

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1abe8ab](https://github.com/AmethystLuna/dsh-model-everything/tree/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875)

<!-- BEGIN META -->
[![npm 30d 415](https://img.shields.io/static/v1?label=npm+30d&message=415&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model-everything)
<!-- END META -->

> **实现功能**：为设计与代码断言提供建模Skill、有限模型验证、UML/依赖审查及可复算报告工具。

> **核心亮点**：已有增量是把断言核验、有限模型执行、反例和可复算报告接入DSH工作流，报告明确区分跳过、未决和判定；有限状态方法本身及外部检查器不是插件原创。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：忠实抽象是贡献成立的前提。模型pass、规范化hash和工具ok均不能证明源码程序安全；漏掉现实异常或截断搜索时必须收窄结论，构模成本也可能超过简单办法。[Q03](#research-q03)

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
  - [Q01 · 可执行模型审查相对读代码或外部检查器增加什么？](#detail-section-11)
  - [Q02 · 注册、模型读取和报告语义如何避免虚假通过？](#detail-section-12)
  - [Q03 · 抽象正确性与状态爆炸怎样约束核心价值和总成本？](#detail-section-13)
  - [Q04 · 怎样把模型反例与程序证据闭环，并界定采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要检查复杂行为断言及保存反例/报告的开发者，目标是对明确模型性质给出可追溯判断。

简单事实用通读或脚本；复杂全路径性质可直接用TLA+/SPIN等检查器。插件贡献是宿主集成与报告契约，未做外部工具效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 有限模型验证 | 检查明确模型的性质和反例 | 模型不等于程序；截断/未决不是通过 |
| 图与结构工具 | 渲染/解析/审查UML与依赖图 | 各图族契约不同，不能泛化为全部语义证明 |
| 报告与导出 | 冻结hash、比较报告并交外部检查器 | hash只绑定模型，导出不代表外部工具已运行 |
| 域Skill | 分解断言和指导工具使用 | 模型仍需维护源码映射和验收条件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node≥20；DSH ^0.1.7-alpha.2 ∨ ^0.1.7-rc.1 ∨ ^0.2.0-rc.1 ∨ ^0.2.1-alpha.1；Cordis ^4.0.4 | 启动必需 | 注册Skills与模型工具 | 以上为作者包声明，本轮未加载；声明范围外兼容未知 |
| 忠实模型、明确性质与源码映射 | 效果必需 | 限定判定对象和对应实现 | 缺映射不得把模型pass当程序通过 |
| 外部检查器 | 交叉验证/导出后可选 | 复核模型或处理状态爆炸 | 未安装不阻止本地模型检查，外部结论仍未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 明确断言 | 用户/助手列性质并核对源码 | 确定不能用简单办法解决且建模有价值 |
| 构模与验证 | 助手/工程师选schema并运行指定工具 | 读verdict、truncated、skip和反例，不只看ok |
| 回到实现 | 工程师回放反例并冻结报告/模型 | 无映射或未决则停止放行，必要时换检查器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Skill上下文、工具定义与构模模型调用 | 学习schema、抽象和性质设计 | 作者有任务成本声明，未独立核对 |
| 持续使用 | 状态枚举资源与模型更新调用 | 维护映射、核对反例和报告diff | 无同条件合格任务成本数据 |
| 失败恢复 | 重构模型/外部检查器资源 | 缩减状态、定位遗漏并重验源码 | 增大maxStates不保证解决，时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可复算报告 | 规范化hash、检查/判定/截断字段 | 模型与源码一致性及全部算法正确性 |
| 全路径性质 | 有限状态探索与反例机制 | 超过边界未决，不能覆盖任意程序 |
| 效果/成本 | 作者报告特定任务成本范围 | 独立任务收益、净节时及质量改进 |

> **思考**：忠实抽象是贡献成立的前提。模型pass、规范化hash和工具ok均不能证明源码程序安全；漏掉现实异常或截断搜索时必须收窄结论，构模成本也可能超过简单办法。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有增量是把断言核验、有限模型执行、反例和可复算报告接入DSH工作流，报告明确区分跳过、未决和判定；有限状态方法本身及外部检查器不是插件原创。[Q01](#research-q01) [Q02](#research-q02)

已有增量是把断言核验、有限模型执行、反例和可复算报告接入DSH工作流，报告明确区分跳过、未决和判定；有限状态方法本身及外部检查器不是插件原创。[Q01](#research-q01) [Q02](#research-q02)

报告语义分层、未知/skip显式和模型hash值得复用。状态引擎与宿主工具分离便于检查，但工具族庞大、构模接口与报告契约维护成本高；本次只核对代表路径，不凭测试目录数量保证引擎正确。

<a id="detail-section-5"></a>

### 1.4 主要限制

忠实抽象是贡献成立的前提。模型pass、规范化hash和工具ok均不能证明源码程序安全；漏掉现实异常或截断搜索时必须收窄结论，构模成本也可能超过简单办法。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合理解有限模型、愿意维护源码映射的工程师小范围试用；未决、跳过关键性质或无法映射实现时停止放行，不把它当自动程序正确性证明。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查代表性状态验证链路及发布入口；未执行工具，未审计全部算法，模型结论不能外推程序正确。

- 已检查：作者 README、包清单、源码路径 README.md、skills/model-everything/SKILL.md、src/engine.ts、lib/index.js、src/index.ts、src/tool.ts、src/model-file.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：用带已知异常分支的实现及忠实/遗漏模型，比较假放行、反例回放与人工成本；小模型交叉外部检查器。当前未执行目标代码。

**分析版本**

- **仓库**：[AmethystLuna/dsh-model-everything](https://github.com/AmethystLuna/dsh-model-everything)
- **版本号**：0.3.0（[固定提交 1abe8ab](https://github.com/AmethystLuna/dsh-model-everything/tree/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是性质—源码—模型映射—可回放反例的最小证据闭环，能减少模型正确而程序有错的假放行；以已知缺陷和遗漏迁移对照，计入构模/复核成本。[Q04](#research-q04)

用带已知异常分支的实现及忠实/遗漏模型，比较假放行、反例回放与人工成本；小模型交叉外部检查器。当前未执行目标代码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 63 | 9336 | — | — | 122188 |
| .mjs | source | 12 | 2433 | 1929 | 312 | — |
| .md | example | 6 | 104 | — | — | 687 |
| .js | example | 17 | 546 | 458 | 22 | — |
| .js | source | 39 | 17943 | 15311 | 2638 | — |
| .ts | source | 39 | 19597 | 15170 | 3314 | — |
| .md | test | 3 | 268 | — | — | 2875 |
| .mjs | test | 36 | 14082 | 11241 | 1702 | — |
| .mjs | example | 1 | 118 | 91 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A30.854Z..2026-10-23T07%3A58%3A30.854Z)

暂未获取：近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：有限模型验证如何把行为断言变成可复算报告，抽象正确性和状态截断如何约束结论？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可执行模型审查相对读代码或外部检查器增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合需要检查状态机/协议全路径断言、重构前后性质或交付可复算报告的开发者。合格结果不是一段“看起来安全”的解释，而是明确模型、性质、边界、反例与报告hash，并回到源码确认抽象。作者同时提供技能和模型工具，将断言清单、建模、验证、读报告和导出放进DSH，增量在可复算工作流集成与结果语义，不是发明有限状态探索或替代TLA+/SPIN。对人工一次通读或几行脚本即可确定的断言，该方法建模固定成本不合算。README的0.93×–1.11×成本比为作者特定任务报告，本轮没有检查其完整配对实验，不作收益证据。模型检查只能决定输入模型，不自动证明程序实现。结构依赖工具可从源码建图，不应与状态机引擎的抽象责任混淆。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-39](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/README.md#L11-L39)

作者目标、成本声明与模型/程序界线。

<details>
<summary>查看原文（29行）</summary>

```text

把设计与代码里的断言抽象成模型，交给引擎跑一遍：结论带出处与哈希，能复算、能比对。让结论来自一次运行，而不是一次通盘推理：把「想清楚」变成「跑一遍」。

DeepSeek Harness 原生插件。把设计与代码里**关于行为的断言**变成可运行、可审查、可导出的模型：

- **核验断言**：逐条对着源码检查，引用到 `file:line`。
- **跑模型**：状态机、协议、多机协作、数据模型先建成可执行模型，再交给引擎跑。
- **审图**：UML 图按模型读、按模型审，并与模型对照。
- **对照重构**：重构前后各建一份模型，两份报告摆一起比。
- **留痕**：结论固化成带哈希的报告，可复算、可比对、可导出。

## 它更贵，但它给的是判定

这是一个**能力型工具，不是省钱工具**。

**贵多少取决于任务大小，而且是反过来的**：几百行的夹具上它贵出数倍——固定成本（技能正文、工具定义）摊不开；对象涨到几万行、上百文件，比例回落到持平附近，我们测到 0.93×–1.11×。**任务越大，这笔钱越值**：一次判定替代的是几十次 `read`，而不是几行代码。

换来的是别的东西：

- 一条**可复算**的结论：哈希、`verdict`、出处，而不是一段读起来像结论的散文；
- 一条**反例路径**：哪几步、哪个事件序列让断言不成立；
- 一份**可导出的模型**：同一条结论能交给 UPPAAL、TLA+、PRISM、SPIN 复核。

什么时候不值得：断言能靠通读一次代码、或者写三行脚本数出来的时候。**它买不到比读一遍更快**；它买到的是「读一遍给不出判定」的那类断言。

**它判定的是小模型，不是程序。** 引擎显式枚举状态，模型炸开时会报 `truncated` 并点名未决的检查。那不是重试一个更大的 `maxStates` 就能解决的：先减模型（去掉性质不读的变量、合并对称状态），仍然炸开就换不靠枚举的工具——SPIN 的偏序归约、NuSMV 的符号化、CBMC 的有界 SAT。本插件不建立抽象，也不读程序源码。

## 能力范围

```

</details>

**依据 2 · 作者声明**：[skills/model-everything/SKILL.md:10-25](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/skills/model-everything/SKILL.md#L10-L25)

技能要求断言核验及小模型边界，说明人工建模责任。

<details>
<summary>查看原文（16行）</summary>

```text
## When This Skill Applies

**This is the entry point.** Load this skill when a claim about the code has to be settled and a reading will not settle it. It owns the doctrine: enumerate the claims, verify each against the code, cite `file:line`, read `verdict`. It also owns the executable verification for behaviour. A neighbouring domain goes to its own skill through the routing table below.

**It decides small models, not programs.** The engine enumerates states, so a model that explodes is reported `truncated` with the undecided check named. That is not a bug to retry with a larger `maxStates`: reduce the model first (drop variables the property does not read, collapse symmetric states), and if it still explodes the property needs a tool that does not enumerate - SPIN for partial-order reduction, NuSMV for symbolic search, CBMC for bounded SAT. This plugin builds no abstraction and reads no program source.

**This costs more than reading, and less the larger the task.** On a fixture of a few hundred lines it costs several times a plain reading, because the fixed cost has nothing to amortise against. On a tree of tens of thousands of lines the ratio falls to roughly parity. Spend it where the object is large enough for one decision to replace many reads. Reach for it when the claim is about all paths rather than one, when nothing in the repository will go red if it is false, or when the verdict has to be reproducible later. A claim one reading settles belongs in a sentence, not in a model.

| The task involves… | What it does |
|---|---|
| Any claim about code: design doc, spec, plan, review comment, README, commit message, refactor proposal, "this is safe", "this always holds", "this can't deadlock" | Enumerate the verifiable claims (Phase 1), verify each with `file:line` evidence (Phase 2), classify the gaps (Phase 3) |
| A state machine or protocol with three or more states, guards, ACK/NACK/retry, lock/unlock, or start/stop ordering | Build an executable model. Run the S1-S8 structural checks and the A1-A14 adversarial probes |
| A quantitative or temporal guarantee: worst-case cost within a budget, "90% of runs reach SAFE", "must leave within 2 ticks" | A12 budget, A13 probabilistic reachability, A14 deadlines. Each returns a counterexample path |
| A handshake or power-up sequence across two or more components | `model_compose_verify`: C1 composition deadlock, C2 rendezvous that never fires |
| A refactoring that changes state topology or guards | Compare BEFORE and AFTER models for behaviour preservation, invariant continuity and deadlock regression (D1-D4) |
| An explicit request to prove code correct, verify a module, or check a migration for breakage | Route by domain through [Routing to the Sibling Skills](#routing-to-the-sibling-skills). Keep the doctrine |
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:1363-1385](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L1363-L1385)

有限状态探索支撑工具机制，非直接执行程序。

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

- 作者成本比对应的同条件合格任务证据未独立核验
  **影响**：不能宣称规模越大越省钱或更高效
  **进一步探讨**：冻结同任务/模型/质量门槛，比读代码、简单脚本和模型工作流的总费用与人工

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注册、模型读取和报告语义如何避免虚假通过？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

发布lib/index注册验证、数据/组合、UML、结构、设计、编辑与报告diff等工具，并通过文件系统provider注册本包Skills。以model_verify为代表，参数要求inline模型和modelPath二选一，stateMapping须为非空目标状态映射且要求beforeModel，错误参数返回拒绝报告。引擎校验模型后枚举状态，超maxStates标truncated；未决检查的_UNDECIDED后缀统一传播到summary.truncated，checksRun不把skip计作已检查，报告携带规范化hash及判定。调用者需读verdict、各检查和truncated，而非只看ok或hash。hash固定的是模型内容/规范，不证明模型对应程序、性质足够或引擎无缺陷。可借鉴的是拒绝、跳过、未决与失败分开，移植仍要维护各工具族一致报告契约；本次抽读状态验证链路，不宣称所有图族/概率性质算法均已审计正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:179-205](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/lib/index.js#L179-L205)

发布入口工具注册支持运行接线，非只看文档清单。

<details>
<summary>查看原文（27行）</summary>

```text
        if (toolRegistered)
            return;
        const tools = ctx.get('tools');
        if (tools === undefined)
            return;
        try {
            ctx.effect(() => tools.register(modelVerifyTool), 'dsh-model-everything: verify tool');
            ctx.effect(() => tools.register(modelDataModelVerifyTool), 'dsh-model-everything: data verify tool');
            ctx.effect(() => tools.register(modelConcurrencyScanTool), 'dsh-model-everything: concurrency scan tool');
            ctx.effect(() => tools.register(modelComposeTool), 'dsh-model-everything: compose tool');
            ctx.effect(() => tools.register(modelExportTool), 'dsh-model-everything: export tool');
            ctx.effect(() => tools.register(umlRenderTool), 'dsh-model-everything: uml render tool');
            ctx.effect(() => tools.register(umlParseTool), 'dsh-model-everything: uml parse tool');
            ctx.effect(() => tools.register(umlReviewTool), 'dsh-model-everything: uml review tool');
            ctx.effect(() => tools.register(umlExplainLabelsTool), 'dsh-model-everything: uml explain-labels tool');
            ctx.effect(() => tools.register(umlStructureTool), 'dsh-model-everything: structure tool');
            ctx.effect(() => tools.register(designTool), 'dsh-model-everything: design review tool');
            ctx.effect(() => tools.register(reportDiffTool), 'dsh-model-everything: report diff tool');
            ctx.effect(() => tools.register(modelEditTool), 'dsh-model-everything: model edit tool');
            ctx.effect(() => tools.register(modelAutomatonTool), 'dsh-model-everything: automaton tool');
            toolRegistered = true;
            dataToolRegistered = true;
            concurrencyToolRegistered = true;
            composeToolRegistered = true;
            exportToolRegistered = true;
            umlToolsRegistered = true;
            structureToolRegistered = true;
```

</details>

**依据 2 · 源码核查**：[src/index.ts:269-281](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/index.ts#L269-L281)

文件系统Skill provider注册本包目录。

<details>
<summary>查看原文（13行）</summary>

```text
  // Ship the bundled skill through the registry: reuse the standard
  // filesystem provider over this package's own `skills/` directory, so
  // catalog discovery, frontmatter parsing, and SKILL.md loading behave
  // exactly like project/user skills while the plugin stays self-contained.
  // Registration lands in the global registry layer (this row mounts at the
  // profile root), so every agent preset sees the skill. `registerProvider`
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'dsh-model-everything',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
```

</details>

**依据 3 · 源码核查**：[src/tool.ts:75-106](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/tool.ts#L75-L106)

参数形状与前后映射要求及引擎调用。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/model-file.ts:35-48](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/model-file.ts#L35-L48)

内联模型与文件路径互斥。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Exactly one of the inline value and the file path. Both is ambiguous, neither is a missing
 * argument, and each gets its own sentence so the caller knows which one to drop.
 */
export function oneOf(value: unknown, path: unknown, inlineName: string, pathName: string, code: string): unknown {
  const hasValue = value !== undefined
  const hasPath = path !== undefined
  if (hasValue && hasPath) {
    throw new OptionShapeError(code, `Pass either ${inlineName} or ${pathName}, not both: the file would be read and then ignored, or the other way round.`)
  }
  if (!hasValue && !hasPath) {
    throw new OptionShapeError(code, `Pass ${inlineName} or ${pathName}: the model has to come from somewhere.`)
  }
  return hasPath ? readJsonFile(path, pathName, code) : value
```

</details>

**依据 5 · 源码核查**：[src/engine.ts:3972-3991](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L3972-L3991)

skip、未决、截断与边界注记进入正式报告。

<details>
<summary>查看原文（20行）</summary>

```text
    summary: {
      states: model.states.length,
      transitions: model.transitions.length,
      errors,
      warnings,
      // `checksRun` counts the checks that examined the model, which is what the name promises. It used to
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
    },
    checks,
    nextSteps: verificationNextSteps(checks, narrativeCoverage),
    ...(model.narrative === undefined ? {} : { narrative: model.narrative }),
    ...(comparison === undefined ? {} : { comparison }),
    ...(coverageNotes.length === 0 ? {} : { coverageNotes }),
```

</details>

**依据 6 · 源码核查**：[src/engine.ts:424-433](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L424-L433)

规范化hash只是内容绑定。

<details>
<summary>查看原文（10行）</summary>

```text
 * The hash of any model this plugin carries: the same normalization as `modelHash`,
 * over whatever object the family defines. A use case diagram and a state machine are
 * hashed by one rule, so a report can name either.
 */
export function valueHash(value: unknown, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return createHash('sha256').update(stableStringify(hashPayload(value, spec))).digest('hex')
}

export function modelHash(model: LogicModelV1, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return valueHash(model, spec)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 抽象正确性与状态爆炸怎样约束核心价值和总成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

核心质疑是正确地检查一个遗漏现实行为的模型，是否仍让用户误以为程序正确。技能明确不自动构建状态抽象，状态机引擎只遍历提供模型；漏掉重试、异常或资源分支时，无论hash可复算还是模型pass，都不能外推程序安全。相反，truncated/_UNDECIDED是有意义的不完整结论，不能通过加大maxStates就自动转成证据。引擎会规范化搜索上限并报告调整，显式遍历状态达到阈值即停止。首次成本包含人工/模型抽取、性质设计与工具schema学习，持续使用包括模型随代码更新和反例回放，失败需缩减模型或换外部检查器再核对源码。Node和宿主Skill/tool服务是启动条件；外部检查器仅导出复核时需要，并非本工具所有功能必需。建模引入的LLM费和人工时间均无本轮测量。

#### 证据与依据

**依据 1 · 作者声明**：[skills/model-everything/SKILL.md:12-16](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/skills/model-everything/SKILL.md#L12-L16)

明确只决定小模型、抽象由外部负责及替代检查器。

```text
**This is the entry point.** Load this skill when a claim about the code has to be settled and a reading will not settle it. It owns the doctrine: enumerate the claims, verify each against the code, cite `file:line`, read `verdict`. It also owns the executable verification for behaviour. A neighbouring domain goes to its own skill through the routing table below.

**It decides small models, not programs.** The engine enumerates states, so a model that explodes is reported `truncated` with the undecided check named. That is not a bug to retry with a larger `maxStates`: reduce the model first (drop variables the property does not read, collapse symmetric states), and if it still explodes the property needs a tool that does not enumerate - SPIN for partial-order reduction, NuSMV for symbolic search, CBMC for bounded SAT. This plugin builds no abstraction and reads no program source.

**This costs more than reading, and less the larger the task.** On a fixture of a few hundred lines it costs several times a plain reading, because the fixed cost has nothing to amortise against. On a tree of tens of thousands of lines the ratio falls to roughly parity. Spend it where the object is large enough for one decision to replace many reads. Reach for it when the claim is about all paths rather than one, when nothing in the repository will go red if it is false, or when the verdict has to be reproducible later. A claim one reading settles belongs in a sentence, not in a model.
```

**依据 2 · 源码核查**：[src/engine.ts:3824-3836](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L3824-L3836)

规范化搜索预算与模型校验入口。

<details>
<summary>查看原文（13行）</summary>

```text
export function runVerification(input: unknown, options: VerificationOptions = {}): VerificationReport {
  // A bound that was replaced or clamped is recorded here and reported through the summary, so a
  // caller who asked for 10^12 learns the answer came from a smaller search instead of reading a
  // truncated report as a complete one.
  const boundNotes: string[] = []
  const normalized: NormalizedOptions = {
    maxStates: boundedOption(options.maxStates, DEFAULT_MAX_STATES, MAX_STATES_CEILING, 'maxStates', boundNotes),
    maxPermutationEvents: boundedOption(options.maxPermutationEvents, DEFAULT_MAX_PERMUTATION_EVENTS, MAX_PERMUTATION_EVENTS_CEILING, 'maxPermutationEvents', boundNotes),
  }
  const hashSpec = options.hashSpec ?? DEFAULT_HASH_SPEC
  const metadataKeys = metadataKeysOf(input)
  const metadata = metadataKeys.length === 0 ? {} : { metadataKeys }
  const validation = validateModel(input)
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:1363-1385](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L1363-L1385)

枚举/截断决定能力边界。

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

**依据 4 · 源码核查**：[src/engine.ts:572-585](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L572-L585)

未决传播而非假通过。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Whether a finding means "the search stopped before deciding", as opposed to "the model is wrong".
 * Such a finding must reach `summary.truncated`, or a caller reading only that flag would take an
 * unfinished search for a clean one.
 *
 * The shipped schema reference states the rule as a name: the check that stopped carries a finding
 * whose code ends in `_UNDECIDED`, and the report sets `summary.truncated`. Read from the name, that
 * is one rule in one place. It used to be a hand-written set of codes, and A12 and A14 minted their
 * own codes without joining it: the report carried an undecided finding and `truncated` stayed
 * false, so the two halves of that sentence disagreed.
 */
function hasUndecidedFinding(checks: CheckResult[]): boolean {
  return checks.some((check) => check.findings.some((finding) => finding.code.endsWith('_UNDECIDED')))
}
```

</details>

**依据 5 · 源码核查**：[package.json:34-38](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/package.json#L34-L38)

作者声明DSH版本范围。

```text
      "dsh": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1"
    },
    "category": "tools/dev",
    "displayName": "dsh-model-everything",
    "bundle": {
```

**依据 6 · 源码核查**：[package.json:71-78](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/package.json#L71-L78)

Cordis及宿主peer依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1",
    "@deepseek-ai/dsh-llm": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1",
    "@deepseek-ai/dsh-session": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1",
    "@deepseek-ai/dsh-skill-filesystem": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1",
    "@deepseek-ai/dsh-tools": "^0.1.7-alpha.2 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.1-alpha.1",
    "@deepseek-ai/schemastery": "^3.18.4"
```

**依据 7 · 源码核查**：[package.json:126-128](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/package.json#L126-L128)

Node运行时要求。

```text
  "engines": {
    "node": ">=20"
  }
```

#### 缺口

- 模型是否忠实覆盖实际源码行为尚无自动保证或本轮对照
  **影响**：限制程序级安全/重构正确性结论
  **进一步探讨**：用故意遗漏异常分支的模型对照源码测试或独立检查器

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样把模型反例与程序证据闭环，并界定采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是建立“性质→源码位置→抽象映射→反例可回放用例”的最小证据闭环，能够比只保存hash报告更早暴露模型与实现偏离。推导来自可复算报告的优势及抽象缺口，新增负担是维护映射和用例，不是把模型报告直接当CI放行。最小验证对同一含已知异常/重试缺陷的模块，提供忠实模型和删掉关键迁移的模型，比较普通报告流程与闭环流程能否识别抽象遗漏；另以独立模型检查器交叉核对小模型。只有在相同预算下减少假放行、且人工构模/复核量可接受才支持；模型通过而程序缺陷仍漏过则否定保障效果。建议trial给理解有限模型和源码映射的工程师，从一个小协议、明确性质和反例开始；对简单事实或需要自动程序正确性证明的人不适合。遇到未决、缺性质、无源码对应时停止把结果用于交付放行。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:424-433](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L424-L433)

内容hash可成为冻结模型的证据锚点，但不含代码对应证明。

<details>
<summary>查看原文（10行）</summary>

```text
 * The hash of any model this plugin carries: the same normalization as `modelHash`,
 * over whatever object the family defines. A use case diagram and a state machine are
 * hashed by one rule, so a report can name either.
 */
export function valueHash(value: unknown, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return createHash('sha256').update(stableStringify(hashPayload(value, spec))).digest('hex')
}

export function modelHash(model: LogicModelV1, spec: HashSpec = DEFAULT_HASH_SPEC): string {
  return valueHash(model, spec)
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:3972-3991](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/src/engine.ts#L3972-L3991)

报告可见跳过、未决及覆盖注记提供闭环条件。

<details>
<summary>查看原文（20行）</summary>

```text
    summary: {
      states: model.states.length,
      transitions: model.transitions.length,
      errors,
      warnings,
      // `checksRun` counts the checks that examined the model, which is what the name promises. It used to
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
    },
    checks,
    nextSteps: verificationNextSteps(checks, narrativeCoverage),
    ...(model.narrative === undefined ? {} : { narrative: model.narrative }),
    ...(comparison === undefined ? {} : { comparison }),
    ...(coverageNotes.length === 0 ? {} : { coverageNotes }),
```

</details>

**依据 3 · 作者声明**：[skills/model-everything/SKILL.md:12-16](https://github.com/AmethystLuna/dsh-model-everything/blob/1abe8ab4caaf0f0d72553d9ac7054a552c4ff875/skills/model-everything/SKILL.md#L12-L16)

人工抽象边界决定验证假设的必要性。

```text
**This is the entry point.** Load this skill when a claim about the code has to be settled and a reading will not settle it. It owns the doctrine: enumerate the claims, verify each against the code, cite `file:line`, read `verdict`. It also owns the executable verification for behaviour. A neighbouring domain goes to its own skill through the routing table below.

**It decides small models, not programs.** The engine enumerates states, so a model that explodes is reported `truncated` with the undecided check named. That is not a bug to retry with a larger `maxStates`: reduce the model first (drop variables the property does not read, collapse symmetric states), and if it still explodes the property needs a tool that does not enumerate - SPIN for partial-order reduction, NuSMV for symbolic search, CBMC for bounded SAT. This plugin builds no abstraction and reads no program source.

**This costs more than reading, and less the larger the task.** On a fixture of a few hundred lines it costs several times a plain reading, because the fixed cost has nothing to amortise against. On a tree of tens of thousands of lines the ratio falls to roughly parity. Spend it where the object is large enough for one decision to replace many reads. Reach for it when the claim is about all paths rather than one, when nothing in the repository will go red if it is false, or when the verdict has to be reproducible later. A claim one reading settles belongs in a sentence, not in a model.
```

#### 缺口

- 源码映射闭环尚无本轮实现与对照
  **影响**：不能当成当前程序级保证
  **进一步探讨**：用带已知缺陷模块比较假放行与人工成本，并复核独立引擎一致性

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
