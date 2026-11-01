# dsh-model-everything

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9bfa4b4](https://github.com/AmethystLuna/dsh-model-everything/tree/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0)

<!-- BEGIN META -->
[![npm 30d 1,952](https://img.shields.io/static/v1?label=npm+30d&message=1%2C952&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything)
<!-- END META -->

> **功能**：将设计抽象为模型并提供状态机等验证与图形工具。

> **亮点**：[Q02](#research-q02) 把受限模型探索及审查结论带入 DSH。

> **主要限制**：[Q03](#research-q03) 模型通过不证明源码忠实或无界正确。

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
  - [Q01 · 设计模型验证比普通审查增加什么？](#detail-section-11)
  - [Q02 · 工具如何区分运行成功与审查结果？](#detail-section-12)
  - [Q03 · 模型通过是否证明代码正确？](#detail-section-13)
  - [Q04 · 如何采用及判断失败？](#detail-section-14)
  - [Q05 · 怎样帮助审查者判断是否需要补建模？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望形式化检查软件设计行为的开发者或审查者。

人工代码审查、测试和其他模型检查工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 状态机验证 | 检查输入模型 | 受建模和探索界限制约 |
| verdict | 区分审查结果 | 不等同工具执行成功 |
| 截断标记 | 暴露有限探索 | 不证明源码覆盖 |
| 其他建模与图形 | 作者声明的工具 | 本次未逐路验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 宿主 | 插件必需 | 注册工具 | 不可调用 |
| 合法模型与界限 | 验证必需 | 构造探索输入 | 拒绝或结果不足 |
| 源码证据与独立测试 | 实施验收必需 | 检查抽象忠实性 | 不能证明代码正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 建模 | 用户抽取源码断言、状态和约束 | 保留依据与未建模部分 |
| 验证 | 代理提交模型及界限 | 输入拒绝需修模型 |
| 审查 | 用户阅读 verdict、findings 和截断 | 不能以 ok 当通过 |
| 验收 | 用户与代码、测试交叉核对 | 不完整则补证或暂不放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 计算费用未知 | 建模及配置时间未知 | 需理解模型语义 |
| 持续使用 | 探索资源消耗未知 | 同步代码和模型耗时未知 | 状态空间与边界影响成本 |
| 失败恢复 | 重跑资源费用未知 | 查证及修模型时间未知 | 未测大模型性能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 受限探索 | 源码定义模型、界限与截断 | 真实缺陷发现率 |
| 审查结论 | 区分运行与 verdict | 模型与生产实现一致性 |
| 覆盖 | 提供描述覆盖比 | 全行为及代码覆盖 |

> **思考**：[Q03](#research-q03) 模型通过不证明源码忠实或无界正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把受限模型探索及审查结论带入 DSH。

[Q02](#research-q02) 审查 verdict 与工具执行状态分开，截断必须保留。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型通过不证明源码忠实或无界正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 小范围建模并核对界限、原始代码和独立测试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查代表验证路径；未运行目标或其他全部模式。

- 已检查：作者 README、包清单、源码路径 README.md、src/tool.ts、src/engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件代表状态机源码；未运行引擎或覆盖全部功能。
- 下一步：隔离模型检查拒绝、错误、截断及源码对应。

**分析版本**

- **仓库**：[AmethystLuna/dsh-model-everything](https://github.com/AmethystLuna/dsh-model-everything)
- **版本号**：0.5.2（[固定提交 9bfa4b4](https://github.com/AmethystLuna/dsh-model-everything/tree/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有覆盖和截断显示，验证源码断言映射缺口。

隔离模型检查拒绝、错误、截断及源码对应。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 70 | 10373 | — | — | 136714 |
| .mjs | source | 15 | 2592 | 2045 | 342 | — |
| .md | example | 6 | 104 | — | — | 687 |
| .js | example | 17 | 546 | 458 | 22 | — |
| .js | source | 71 | 28188 | 24083 | 4203 | — |
| .ts | source | 71 | 27316 | 20635 | 5036 | — |
| .md | test | 3 | 288 | — | — | 3064 |
| .mjs | test | 47 | 21368 | 17407 | 2238 | — |
| .mjs | example | 1 | 118 | 91 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/dsh-model-everything/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查代表状态机验证与模型、代码之间的证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设计模型验证比普通审查增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

软件设计者可将状态、事件与约束抽成模型并检查，辅助寻找设计反例；代码审查、测试与其他模型检查器也能检查部分问题。抽象质量及有限探索决定结论边界，未对照真实项目测缺陷发现率。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:10-18](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/README.md#L10-L18)

作者描述建模和审查。

```text
</p>

把设计与代码里的断言抽象成模型，交给引擎跑一遍：结论带出处与哈希，能复算、能比对。让结论来自一次运行，而不是一次通盘推理：把「想清楚」变成「跑一遍」。

同一套模型也能**画**：架构图从源码直接渲染，父子分组可折叠，结构可按预算量，两版设计可按包含关系比对。

DeepSeek Harness 原生插件。把设计与代码里**关于行为的断言**变成可运行、可审查、可导出的模型：

- **核验断言**：逐条对着源码检查，引用到 `file:line`。
```

**依据 2 · 源码核查**：[src/tool.ts:99-104](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/tool.ts#L99-L104)

模型输入传入验证引擎。

```text
      const model = oneOf(args.model, args.modelPath, 'model', 'modelPath', 'VERIFY_OPTION_INVALID')
      return runVerification(model, {
        maxStates: args.maxStates,
        maxPermutationEvents: args.maxPermutationEvents,
        beforeModel: args.beforeModel,
        stateMapping: mapping as Record<string, string> | undefined,
```

#### 缺口

- 未与人工审查和现有工具对照
  **影响**：不能量化真实缺陷减少
  **进一步探讨**：同一固定设计由两组独立建模和审查。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何区分运行成功与审查结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具校验参数后把模型和界限交给 runVerification；引擎区分工具是否执行与 pass、pass_with_findings、fail verdict，错误级发现会给 fail，拒绝未运行也给 fail 并说明。探索受 maxStates 等选项约束，报告有 truncated，必须连同 findings、界限阅读。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:99-105](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/tool.ts#L99-L105)

工具转发模型及界限。

```text
      const model = oneOf(args.model, args.modelPath, 'model', 'modelPath', 'VERIFY_OPTION_INVALID')
      return runVerification(model, {
        maxStates: args.maxStates,
        maxPermutationEvents: args.maxPermutationEvents,
        beforeModel: args.beforeModel,
        stateMapping: mapping as Record<string, string> | undefined,
      }) as unknown as JsonValue
```

**依据 2 · 源码核查**：[src/engine.ts:530-553](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L530-L553)

verdict 与执行状态区分。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * The review outcome, kept separate from `ok` (= "the tool ran"). Collapsing the two
 * is how a failed review gets read as a passing one.
 */
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
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:3824-3831](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L3824-L3831)

验证入口与边界配置。

```text
export function runVerification(input: unknown, options: VerificationOptions = {}): VerificationReport {
  // A bound that was replaced or clamped is recorded here and reported through the summary, so a
  // caller who asked for 10^12 learns the answer came from a smaller search instead of reading a
  // truncated report as a complete one.
  const boundNotes: string[] = []
  const normalized: NormalizedOptions = {
    maxStates: boundedOption(options.maxStates, DEFAULT_MAX_STATES, MAX_STATES_CEILING, 'maxStates', boundNotes),
    maxPermutationEvents: boundedOption(options.maxPermutationEvents, DEFAULT_MAX_PERMUTATION_EVENTS, MAX_PERMUTATION_EVENTS_CEILING, 'maxPermutationEvents', boundNotes),
```

**依据 4 · 源码核查**：[src/engine.ts:3978-3985](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L3978-L3985)

报告包含截断和边界信息。

```text
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
```

#### 缺口

- 未运行模型或其他验证模式
  **影响**：不能证明全部结论路径或版本兼容
  **进一步探讨**：隔离样例测试错误、截断和无效输入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型通过是否证明代码正确？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

模型检查覆盖的是输入中表达的行为及有限搜索，不自动证明模型忠实覆盖源码、运行环境或并发。narrativeCoverage 统计已描述状态、事件与场景的数量，但它是描述覆盖而非行为等价证明。工具执行 ok 更不等同 verdict=pass，截断与未决项必须保留。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:505-527](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L505-L527)

描述覆盖计算。

<details>
<summary>查看原文（23行）</summary>

```text
export function narrativeCoverageOf(model: LogicModelV1): NarrativeCoverage | undefined {
  const narrative = model.narrative
  if (narrative === undefined) return undefined
  const describedStates = narrative.states === undefined ? 0 : Object.keys(narrative.states).length
  const describedEvents = narrative.events === undefined ? 0 : Object.keys(narrative.events).length
  const groups = new Set(model.transitions.map((transition) => transition.from + '|' + transition.event))
  const describedGroups = narrative.scenarios === undefined
    ? 0
    : new Set(narrative.scenarios.map((scenario) => scenario.from + '|' + scenario.event)).size
  const events = new Set(model.transitions.map((transition) => transition.event))
  return {
    states: String(describedStates) + '/' + String(model.states.length),
    events: String(describedEvents) + '/' + String(events.size),
    scenarios: String(describedGroups) + '/' + String(groups.size),
  }
}

/** True when every dimension of the coverage is fully described. */
export function narrativeComplete(coverage: NarrativeCoverage | undefined): boolean {
  if (coverage === undefined) return false
  return coverage.states.split('/')[0] === coverage.states.split('/')[1]
    && coverage.events.split('/')[0] === coverage.events.split('/')[1]
    && coverage.scenarios.split('/')[0] === coverage.scenarios.split('/')[1]
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:530-553](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L530-L553)

执行与审查结论分开。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * The review outcome, kept separate from `ok` (= "the tool ran"). Collapsing the two
 * is how a failed review gets read as a passing one.
 */
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
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:3978-3985](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L3978-L3985)

报告携带截断。

```text
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
```

#### 缺口

- 未核对具体生产代码到模型的全部映射
  **影响**：无法断言实现正确
  **进一步探讨**：逐条映射源码证据，再以测试和运行数据交叉检验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用及判断失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、模型输入和研究者理解约束与状态空间；建模、核对源码及处理截断都需要人工。先从小模型和固定边界开始，阅读 verdict、findings 与截断，再回到代码和测试核查；输入不可信或探索不足时不能作放行依据。性能、质量与成本未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:99-104](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/tool.ts#L99-L104)

模型及探索参数。

```text
      const model = oneOf(args.model, args.modelPath, 'model', 'modelPath', 'VERIFY_OPTION_INVALID')
      return runVerification(model, {
        maxStates: args.maxStates,
        maxPermutationEvents: args.maxPermutationEvents,
        beforeModel: args.beforeModel,
        stateMapping: mapping as Record<string, string> | undefined,
```

**依据 2 · 源码核查**：[src/engine.ts:530-553](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L530-L553)

拒绝与发现需要分开。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * The review outcome, kept separate from `ok` (= "the tool ran"). Collapsing the two
 * is how a failed review gets read as a passing one.
 */
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
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:3978-3985](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L3978-L3985)

截断信息。

```text
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
```

#### 缺口

- 无真实项目运行或性能数据
  **影响**：不能估算工作量与收益
  **进一步探讨**：按固定模型规模测建模时间和边界增长。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样帮助审查者判断是否需要补建模？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有报告已有 narrative 覆盖比及 truncated 标志，是等价反证；假设对每个未映射源码断言标记证据缺失并链接对应模型范围，可帮助审查者决定补模型或暂不放行。对照现有报告，在故意省略转移、描述不全、截断和完整模型场景测遗漏识别、误报、复核时间及映射维护成本；无改善、误导或成本抵消收益则否定。尚未穷尽其他工具已有溯源能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:505-527](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L505-L527)

已有描述覆盖。

<details>
<summary>查看原文（23行）</summary>

```text
export function narrativeCoverageOf(model: LogicModelV1): NarrativeCoverage | undefined {
  const narrative = model.narrative
  if (narrative === undefined) return undefined
  const describedStates = narrative.states === undefined ? 0 : Object.keys(narrative.states).length
  const describedEvents = narrative.events === undefined ? 0 : Object.keys(narrative.events).length
  const groups = new Set(model.transitions.map((transition) => transition.from + '|' + transition.event))
  const describedGroups = narrative.scenarios === undefined
    ? 0
    : new Set(narrative.scenarios.map((scenario) => scenario.from + '|' + scenario.event)).size
  const events = new Set(model.transitions.map((transition) => transition.event))
  return {
    states: String(describedStates) + '/' + String(model.states.length),
    events: String(describedEvents) + '/' + String(events.size),
    scenarios: String(describedGroups) + '/' + String(groups.size),
  }
}

/** True when every dimension of the coverage is fully described. */
export function narrativeComplete(coverage: NarrativeCoverage | undefined): boolean {
  if (coverage === undefined) return false
  return coverage.states.split('/')[0] === coverage.states.split('/')[1]
    && coverage.events.split('/')[0] === coverage.events.split('/')[1]
    && coverage.scenarios.split('/')[0] === coverage.scenarios.split('/')[1]
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:3978-3985](https://github.com/AmethystLuna/dsh-model-everything/blob/9bfa4b469050dd7cc1650f6e95fa4f1384c7f2a0/src/engine.ts#L3978-L3985)

已有截断状态。

```text
      // count every check object, so a model that declared nothing still read as "22 checks ran".
      checksRun: checks.filter((check) => check.status !== 'skip').length,
      ...(() => {
        const skipped = checks.filter((check) => check.status === 'skip').map((check) => check.id)
        return skipped.length === 0 ? {} : { checksSkipped: skipped }
      })(),
      truncated: exploration.truncated || hasUndecidedFinding(checks),
      ...(boundNotes.length === 0 ? {} : { boundNotes }),
```

#### 缺口

- 尚未核查全部工具和溯源 UI
  **影响**：不能认定不存在等价功能或实际收益
  **进一步探讨**：固定源码和模型进行盲测，核查隐私与维护成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
