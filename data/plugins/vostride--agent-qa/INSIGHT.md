# agent-qa

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2b848e3](https://github.com/vostride/agent-qa/tree/2b848e3f094c3c81a9004eb63c236c32adc55da6)

<!-- BEGIN META -->
[![GitHub ★ 915](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=915&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vostride/agent-qa)
<!-- END META -->

> **功能**：用自然语言描述用户旅程，在 Web、Android 或 iOS 上执行测试并保留可检查证据的 QA 工具。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将planner的完成声明拆成带引用的条件，再由runner计算通过，比仅接受执行模型自报更可追查；这不等于独立业务状态已被验证。

> **主要限制**：[Q02](#research-q02) 条件文字覆盖与引用命中仍不能证明屏幕之外的业务语义。README的两组基准关闭记忆和自改进，不能支持这两项收益；恢复checkpoint也不能证明外部动作幂等。

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
  - [Q01 · 自然语言旅程怎样转化为可验收结果，增加了什么？](#detail-section-11)
  - [Q02 · 条件覆盖是否足以支持通过？](#detail-section-12)
  - [Q03 · 中断恢复和运行成本如何影响试用？](#detail-section-13)
  - [Q04 · 如何减少模型假通过，能提出什么增量假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发与 QA 团队可用自然语言旅程补充探索回归，并回看逐步失败证据。

[Q01](#research-q01) 参照人工探索与已有确定性断言，增量在于自然语言操作和逐条件证据；模型参与不自动证明比原回归更准确或更便宜。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自然语言步骤执行 | 驱动探索旅程 | 需模型、对应平台适配和测试目标 |
| 逐条件验证 | 形成带引用的通过依据 | 依赖观察范围，不能替代完整业务语义 |
| 本地job恢复组成 | 保存checkpoint并处理失去claim | 要求有效fence且旧host已离开，不保证UI动作幂等 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node.js 24+ | CLI必需，作者要求 | 执行CLI | 不符合运行前提 |
| 可用模型和预算 | 自然语言执行/验证必需 | planner与verifier | 调用失败无法据此判通过 |
| 测试浏览器或移动设备适配 | 对应平台必需 | 操作和观察目标 | 对应旅程无法执行；本次未核全部驱动 |
| 测试账号与明确判据 | 任务必需 | 进入测试范围并定义合格结果 | 不应以生产副作用补偿缺失测试条件 |
| 可写本地运行目录 | 记录/恢复必需 | checkpoint、证据与状态 | I/O错误应作为恢复问题处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 团队固定CLI、模型、设备与测试副本 | 连接检查通过且判据具体；本轮未执行 |
| 执行 | planner操作并发出步骤完成信号 | 验证器重新观察，截图取得为尽力路径 |
| 判断 | runner检查条件覆盖与引用/guard | 所有条件met且对话框解释成立才pass |
| 复核 | QA检查失败与不可判定证据 | 关键业务状态用原断言确认 |
| 恢复/退出 | 确认旧host离开，再处理claim/checkpoint | 先对账真实目标，避免重复动作；负担过高回原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型、测试平台与证据空间 | 接入设备、账号与具体旅程 | 金额和时长未知 |
| 持续使用 | planner及verifier调用、截图/记录存储 | 复核模型误判、维护判据和知识 | 未测单位合格任务成本 |
| 失败恢复 | 追加调用、设备复位和checkpoint空间 | 对账旧host、目标实际状态与恢复边界 | checkpoint不保证外部动作幂等 |
| 退出 | 导出证据与保留原测试 | 撤回测试账号、恢复原回归 | 全部知识/凭据清理尚未穷尽 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 条件核查 | 空、错误或未覆盖条件被降为未验证 | 全业务语义遗漏率 |
| 可追查结果 | 逐条件引用及运行器记录 | 所有平台观察完整性 |
| 恢复 | checkpoint发布顺序与有限恢复组成 | 崩溃后的外部副作用与真实耐久性 |
| 记忆收益 | 作者声明可复核知识 | 基准关闭记忆，不能推断记忆增益 |

> **思考**：[Q02](#research-q02) 条件文字覆盖与引用命中仍不能证明屏幕之外的业务语义。README的两组基准关闭记忆和自改进，不能支持这两项收益；恢复checkpoint也不能证明外部动作幂等。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将planner的完成声明拆成带引用的条件，再由runner计算通过，比仅接受执行模型自报更可追查；这不等于独立业务状态已被验证。

[Q02](#research-q02) 把通过权放到逐条件计算，且guard只降级判定，具有可复用的证据责任分工。[Q03](#research-q03) checkpoint明确文件同步/rename顺序，但部分父目录同步错误按平台尽力处理，恢复还依赖旧host离开；不能把这些设计写成已测的所有平台强保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 条件文字覆盖与引用命中仍不能证明屏幕之外的业务语义。README的两组基准关闭记忆和自改进，不能支持这两项收益；恢复checkpoint也不能证明外部动作幂等。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先选可重置且不影响生产的少量旅程，把它作为探索补充并保留确定性断言。重要结果只能由后台证明时另查原有验收；误判频繁或恢复对账过重便缩小范围。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查条件计算与本地恢复组成的源码；真实平台可靠性、任务检出率、记忆增益和总成本未验证。未来后台证据实验与已有贡献分开。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/agent-local/src/composition/compose-job-recovery.ts、packages/agent-local/src/store/job-checkpoint-store.ts、packages/cli/package.json、packages/runner/src/loop/index.ts、packages/runner/src/loop/requested-conditions.ts、packages/runner/src/loop/verifier.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查runner验证链、条件guard调用、本地job checkpoint与恢复组成；未审计全部平台驱动、memidex知识写入、模型服务、退出清理或基准报告。
- 下一步：按[Q04](#research-q04)在测试副本植入UI成功而后台失败等故障，对比独立只读后台证据的假通过、假失败与维护成本；独立性不成立或成本抵消收益则否定。本轮未执行。

**分析版本**

- **仓库**：[vostride/agent-qa](https://github.com/vostride/agent-qa)
- **版本号**：未声明（[固定提交 2b848e3](https://github.com/vostride/agent-qa/tree/2b848e3f094c3c81a9004eb63c236c32adc55da6)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在现有视觉、持久化和文件guard之外，针对少量后台关键条件绑定同次运行的独立只读查询，比较植入故障下的假通过与维护成本。该限定假设未验证，也不声称全仓缺少oracle。

按[Q04](#research-q04)在测试副本植入UI成功而后台失败等故障，对比独立只读后台证据的假通过、假失败与维护成本；独立性不成立或成本抵消收益则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 82 | 4333 | — | — | 26333 |
| .ts | test | 1522 | 485138 | 410223 | 27972 | — |
| .ts | example | 26 | 4978 | 4281 | 327 | — |
| .mjs | example | 2 | 58 | 49 | 5 | — |
| .ts | source | 1138 | 202397 | 165145 | 19237 | — |
| .cjs | source | 1 | 14 | 11 | 2 | — |
| .mjs | source | 21 | 3806 | 3376 | 61 | — |
| .md | example | 2 | 27 | — | — | 222 |
| .tsx | test | 157 | 56857 | 48222 | 1900 | — |
| .tsx | source | 192 | 37769 | 34379 | 699 | — |
| .mjs | test | 16 | 3446 | 3146 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/vostride/agent-qa/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/vostride/agent-qa/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/vostride/agent-qa/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自然语言QA怎样形成可核查通过条件，恢复和总成本何时妨碍采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自然语言旅程怎样转化为可验收结果，增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要补充 Web 或移动端回归的开发与 QA 团队，agent-qa 接受自然语言旅程并保留步骤证据。合格结果应是具体业务条件确已成立、失败可定位，而且不把模型声称完成等同于业务成功。这里以人工探索加既有确定性断言为基线；自然语言操作能扩大探索入口，但原有断言仍有较清楚的可复现语义。

可检查的增量是把 planner 的完成信号再次送入 verifier，由模型给每项条件、引用和判断，最后由 runner 计算 pass，而非让 planner 自己给总成功。这建立更可追查的责任分工，但条件与证据仍可能来自同一观察范围。作者报告 AndroidWorld 和 AppControlBench 成绩，README 明确两组都关闭记忆和 self-improvement，后者还允许部分完成得分。这些材料不能用来证明记忆增益，也不与本次源码核查冒充独立复现。根项目是工具 monorepo，用户 CLI 在子包，未确认它是原生 DSH 插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-34](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/README.md#L24-L34)

作者任务定位及基准条件，关闭记忆是对记忆收益主张的直接限制。

<details>
<summary>查看原文（11行）</summary>

```text
**Your AI QA engineer, with memory.** Describe a user journey in plain language. agent-qa tests it on web, Android or iOS and keeps the evidence. Use the CLI, the dashboard, or your coding agent through MCP and skills.

- **memidex:** remembers facts and working procedures as reviewable files in your repository.
- **Self-improvement:** validates lessons from runs, retires stale knowledge, and uses your feedback to correct mistakes.

| Benchmark | Rank | Published result |
| --- | --- | --- |
| [AndroidWorld](https://vostride.com/benchmark/android-world) | **#1** | **100% pass@1** (116/116 tasks) |
| [AppControlBench](https://vostride.com/benchmark/app-control-bench) | **#1** | **99.6% completion** (114.5/115 points) |

Read the full benchmark reports, with run evidence and methodology, on [our blog](https://vostride.com/blog). Both used gpt-6-sol with memory and self-improvement off; AppControlBench gives half credit for partial completion.
```

</details>

**依据 2 · 源码核查**：[packages/runner/src/loop/index.ts:1901-1951](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/index.ts#L1901-L1951)

完成后verifier判断再由runner计算pass并记录条件。

<details>
<summary>查看原文（51行）</summary>

```text
      // The verifier judges the whole step, from its settled start to its final screen.
      const record = stepRecord.snapshot()
      const accumulatedEvidence = hasOperationEvidence(stepOperationEvidence)
        ? stepOperationEvidence
        : undefined
      let verifyResult
      meter.recordVerifierCall()
      try {
        verifyResult = await withAbort(
          ports.verifier.verify(
            stepInstruction, record.startScreen, afterState, action,
            gate.attachImage ? verifyScreenshot : undefined,
            ports.abortSignal, gate.promptNote, activePredicate, verifierAuthorContext,
            accumulatedEvidence, record,
          ),
          ports.abortSignal,
        )
      } catch (verifyError: unknown) {
        const abortDuringVerify = checkAbort()
        if (abortDuringVerify) return abortDuringVerify
        throw verifyError
      }
      if (verifyResult.tokenUsage) {
        totalPromptTokens += verifyResult.tokenUsage.promptTokens
        totalCompletionTokens += verifyResult.tokenUsage.completionTokens
      }
      // The runner computes the pass from the cited per-condition verdicts.
      const judged = judgeConditions({
        stepText: stepInstruction,
        output: verifyResult.verification,
        sources: buildVerifierCitationSources(
          record.startScreen,
          afterState,
          action,
          accumulatedEvidence,
          record,
        ),
        mask: recordMask,
        imageAttached: gate.attachImage && verifyScreenshot !== undefined,
        ending: 'completion',
        plannerReasoning: reasoning,
        guards: {
          finalElements: afterState.elements,
          platform: afterState.platform,
          record,
          imageAttached: gate.attachImage && verifyScreenshot !== undefined,
          ...(needsSavedFile(verifyResult.verification) ? { files: savedFiles(record.actions) } : {}),
        },
      })
      recorder.recordConditionVerdicts(judged.evidence)
      verifierReasoning = judged.pass ? verifyResult.verification.reasoning : judged.reason
```

</details>

**依据 3 · 源码核查**：[package.json:1-17](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/package.json#L1-L17)

根为私有workspace。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "agent-qa-monorepo",
  "private": true,
  "license": "FSL-1.1-ALv2",
  "homepage": "https://github.com/vostride/agent-qa#readme",
  "bugs": {
    "url": "https://github.com/vostride/agent-qa/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vostride/agent-qa.git"
  },
  "type": "module",
  "packageManager": "pnpm@12.17.0",
  "engines": {
    "node": ">=24"
  },
```

</details>

**依据 4 · 源码核查**：[packages/cli/package.json:1-5](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/cli/package.json#L1-L5)

实际CLI子包为agent-qa。

```text
{
  "name": "agent-qa",
  "version": "0.2.5",
  "private": false,
  "description": "The self-improving Agentic QA harness with Memory",
```

#### 缺口

- 没有独立重放基准与同资源人工/确定性测试对照。
  **影响**：无法量化检出率、记忆收益或测试维护节省。
  **进一步探讨**：固定任务、模型、预算和故障集合，分别比较探索、断言及记忆开关。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 条件覆盖是否足以支持通过？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

runner 在 planner 发出 stepComplete 时重新观察稳定后的界面，截图属于尽力取得；再将开始/结束屏幕、动作、累计操作证据和步骤记录交给 verifier。verifier 不输出总成功，而是输出每项 quote、verdict、needs、引用和理由。runner 的 judgeConditions 对验证器错误、空条件或未覆盖的步骤词生成 unverified；只有条件非空且全是met、对话框已被解释，才计算通过。

进一步检查并非只数题。judgeOne 要求条件文字来自步骤，met 至少有可找到的引用，并执行限制、范围收窄、持久化、视觉和文件检查。故不能声称它完全没有独立防护或文件验收。另一方面，词覆盖以规范化后的token和短语跨度判断，部分否定推理启发式限于英语。引用确实出现在观察中，不等于观察已经覆盖后台账务、权限或远端持久状态；截图也不能单独证明所有业务语义。核心质疑因此是证据可见范围和语义分解充分性，不能把结构覆盖当成完整业务验收，也不能从潜在语义遗漏断言项目已实际假通过。

#### 证据与依据

**依据 1 · 源码核查**：[packages/runner/src/loop/index.ts:1870-1896](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/index.ts#L1870-L1896)

稳定后观察和尽力截图的实际链路。

<details>
<summary>查看原文（27行）</summary>

```text
    // 5. VERIFY — only when the planner signals stepComplete (three-outcome strategy).
    let verifierReasoning: string | undefined
    if (rawPlan.stepComplete && ports.verifier) {
      // Every completion claim is judged by the verifier; its own re-observation is stateAfter.
      let afterState: ScreenState
      try {
        // The verifier must not judge a screen that is still changing, such as a composer that
        // has not cleared yet, so the frames settle compares are VERIFY_SETTLE_INTERVAL_MS apart.
        const settledAfter = await settle(
          () => withAbort(ports.adapter.observe(), ports.abortSignal),
          {
            maxPolls: DEFAULT_SETTLE_MAX_POLLS,
            intervalMs: VERIFY_SETTLE_INTERVAL_MS,
            deadline,
            signal: ports.abortSignal,
          },
        )
        afterState = settledAfter.state
      } catch (err) {
        const abortResult = checkAbort()
        if (abortResult) return abortResult
        throw err
      }
      let verifyScreenshot: Buffer | undefined
      if (ports.adapter.screenshot) {
        try { verifyScreenshot = await withAbort(ports.adapter.screenshot(), ports.abortSignal) } catch { /* best-effort */ }
      }
```

</details>

**依据 2 · 源码核查**：[packages/runner/src/loop/verifier.ts:28-60](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/verifier.ts#L28-L60)

逐条件结构要求与引用。

<details>
<summary>查看原文（33行）</summary>

```text
// The verifier gives no overall success; a computed non-pass is a rejection that replans.
const ConditionJudgmentSchema = z.object({
  quote: z.string().describe('The exact words of the step this condition covers'),
  verdict: z
    .enum(CONDITION_VERDICTS)
    .describe(
      'met only when cited evidence shows the condition holds; not-met when evidence shows it does not; unverified when the evidence needed is missing; inconclusive when the evidence cannot settle it',
    ),
  needs: z
    .enum(['none', ...CONDITION_NEEDS])
    .describe('What the condition needs beyond a cited line, or none'),
  controlRef: z
    .string()
    .describe("For limit-max or limit-min: the control's ref on the final screen; otherwise ''"),
  file: z
    .object({
      name: z.string().describe("The expected file name, or '' when this is not a file condition"),
      match: z.enum(['none', 'exact', 'lines']).describe('How the file text must match, or none'),
      text: z.string().describe("The expected file text read from the step or the screen, or ''"),
    })
    .describe('The expected saved file, for a file condition'),
  citations: z
    .array(
      z.object({
        source: z
          .enum(CITATION_SOURCES)
          .describe('Which part of the request the quote comes from'),
        quote: z.string().describe('Text copied exactly from that part'),
      }),
    )
    .describe('The evidence for the verdict; a met condition needs at least one'),
  reasoning: z.string().describe('Why this condition has this verdict'),
})
```

</details>

**依据 3 · 源码核查**：[packages/runner/src/loop/requested-conditions.ts:268-326](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/requested-conditions.ts#L268-L326)

条件文字/引用核查及多项只降级的guard。

<details>
<summary>查看原文（59行）</summary>

```text
function judgeOne(
  judgment: ConditionJudgment,
  inStep: boolean,
  context: JudgeContext,
): ConditionRecord {
  const { input, haystacks } = context
  const maskedQuote = collapse(input.mask(judgment.quote ?? ''))
  const quote = bound(maskedQuote, QUOTE_MAX)
  const reasoning = collapse(input.mask(judgment.reasoning ?? ''))
  const reason = bound(reasoning, REASON_MAX)
  const checked = (Array.isArray(judgment.citations) ? judgment.citations : []).map((citation) =>
    checkCitation(citation, haystacks, input.mask, input.imageAttached),
  )
  const citations = checked.slice(0, RECORDED_CITATIONS_MAX)
  const needs =
    judgment.needs !== undefined && judgment.needs !== 'none' ? { needs: judgment.needs } : {}
  const changed = (verdict: ConditionRecord['verdict'], guard: ConditionGuard, why: string) => ({
    quote,
    verdict,
    ...(judgment.verdict !== verdict ? { judged: judgment.verdict } : {}),
    guard,
    ...needs,
    reason: bound(why, REASON_MAX),
    citations,
  })
  if (!inStep) {
    return changed('unverified', 'quote-not-in-step', GUARD_REASONS['quote-not-in-step']!)
  }
  if (judgment.verdict !== 'met') {
    return { quote, verdict: judgment.verdict, ...needs, reason, citations }
  }
  if (!checked.some((citation) => citation.found !== false)) {
    return changed('unverified', 'citation-missing', GUARD_REASONS['citation-missing']!)
  }
  for (const source of [reasoning, context.plannerReasoning]) {
    const phrase = source === '' ? undefined : admitsNotDone(source, maskedQuote)
    if (phrase !== undefined) {
      return changed('not-met', 'admits-not-done', `The reasoning says "${phrase}"`)
    }
  }
  const met: ConditionRecord = { quote, verdict: 'met', ...needs, reason, citations }
  const cited: CheckedCitation[] = checked.map((citation, i) => ({
    source: citation.source,
    quote: judgment.citations[i]?.quote ?? '',
    found: citation.found,
  }))
  const { finalElements, record, imageAttached, files } = context.guards
  let guardedRecord = applyLimitGuard(met, judgment, finalElements, input.mask)
  guardedRecord = applyNarrowedGuard(guardedRecord, cited, record, input.mask)
  guardedRecord = applyPersistenceGuard(guardedRecord, judgment, cited, record)
  guardedRecord = applyVisualGuard(
    guardedRecord,
    judgment,
    cited,
    record,
    imageAttached,
    input.mask,
  )
  return applyFileGuard(guardedRecord, judgment, files, input.mask)
```

</details>

**依据 4 · 源码核查**：[packages/runner/src/loop/requested-conditions.ts:338-387](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/requested-conditions.ts#L338-L387)

错误、空条件、未覆盖条件和总pass规则。

<details>
<summary>查看原文（50行）</summary>

```text
export function judgeConditions(input: JudgeConditionsInput): ConditionJudgeResult {
  const maskedStep = collapse(input.mask(input.stepText))
  const stepQuote = bound(maskedStep, QUOTE_MAX)
  const output = input.output
  let conditions: ConditionRecord[]
  if (output.verifierError !== undefined) {
    const error = collapse(input.mask(output.verifierError))
    const reason = `the verifier could not judge the step: ${error}`
    conditions = [guarded(stepQuote, 'verifier-error', reason)]
  } else {
    const haystacks = Object.fromEntries(
      TEXT_SOURCES.map((source) => {
        const raw = collapse(input.sources[source] ?? '')
        return [source, { raw, masked: collapse(input.mask(raw)) }]
      }),
    ) as Record<keyof CitationSources, Haystack>
    const judgments = Array.isArray(output.conditions) ? output.conditions : []
    const stepTokens = tokenize(maskedStep)
    const coverage = coverConditions(
      stepTokens,
      judgments.map((judgment) => tokenize(input.mask(judgment.quote ?? ''))),
    )
    const plannerReasoning = collapse(input.mask(input.plannerReasoning ?? ''))
    const context: JudgeContext = { input, haystacks, plannerReasoning, guards: guardFacts(input) }
    conditions = judgments.map((judgment, i) =>
      judgeOne(judgment, coverage.inStep[i] ?? false, context),
    )
    if (conditions.length === 0) {
      conditions = [guarded(stepQuote, 'not-covered', GUARD_REASONS['not-covered']!)]
    } else if (coverage.uncovered.length > 0) {
      const words = coverage.uncovered.map((token) => token.text).join(' ')
      conditions.push(guarded(bound(words, QUOTE_MAX), 'not-covered', UNCOVERED_REASON))
    }
  }
  const facts = guardFacts(input)
  const openDialogs = applyDialogGuard(
    openDialogsOn(facts.finalElements, facts.platform),
    Array.isArray(output.dialogs) ? output.dialogs : [],
    input.mask,
  )
  const evidence: ConditionVerdictsEvidence = {
    ending: input.ending,
    conditions,
    ...(openDialogs.length > 0 ? { openDialogs } : {}),
  }
  const pass =
    conditions.length > 0 &&
    conditions.every((condition) => condition.verdict === 'met') &&
    openDialogs.every((dialog) => dialog.account === 'unrelated' || dialog.account === 'requested')
  return { evidence, pass, reason: pass ? '' : formatUnprovenReason(conditions, openDialogs) }
```

</details>

**依据 5 · 源码核查**：[packages/runner/src/loop/requested-conditions.ts:169-206](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/requested-conditions.ts#L169-L206)

词覆盖机制的实际语义范围。

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * Runs of Unicode letters or digits after NFKC, compared lowercased; a secret placeholder
 * (`[secret:name]`, `{{secret:name}}`) is one token.
 */
export function tokenize(value: string): StepToken[] {
  const tokens: StepToken[] = []
  for (const match of value.normalize('NFKC').matchAll(TOKEN_PATTERN)) {
    tokens.push({ text: match[0], key: match[0].toLowerCase() })
  }
  return tokens
}

export interface ConditionCoverage {
  /** Per quote: whether its words occur, in order and adjacent, in the step. */
  inStep: boolean[]
  /** The step words outside STOP_WORDS that no in-step quote covers, in step order. */
  uncovered: StepToken[]
}

/** Every occurrence of every in-step quote covers its span of step words. */
export function coverConditions(
  stepTokens: readonly StepToken[],
  quotes: readonly (readonly StepToken[])[],
): ConditionCoverage {
  const covered = new Array<boolean>(stepTokens.length).fill(false)
  const inStep = quotes.map((quote) => {
    if (quote.length === 0) return stepTokens.length === 0
    let found = false
    for (let start = 0; start + quote.length <= stepTokens.length; start++) {
      if (quote.every((token, i) => stepTokens[start + i]?.key === token.key)) {
        found = true
        for (let i = 0; i < quote.length; i++) covered[start + i] = true
      }
    }
    return found
  })
  const uncovered = stepTokens.filter((token, i) => !covered[i] && !STOP_WORDS.has(token.key))
  return { inStep, uncovered }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 中断恢复和运行成本如何影响试用？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用、采用判断

#### 完整回答

面向已有 QA 能力团队，本项目适合作测试副本上的补充探索回归，不能替代关键放行断言。作者要求 Node.js 24+，还需连接模型和测试目标；截图、设备状态、模型调用与证据存储都构成资源依赖。自然语言判据仍需人写清并复核，复杂性并未全部消失。runner 单独计量 verifier 调用和token，证明验证本身会增加模型工作，但没有本次总费用或合格任务耗时数据。

工程上 checkpoint 通过独占临时文件、文件fsync、rename和父目录同步发布，并验证读回信封版本与地址；父目录同步对部分平台错误尽力处理，不能写成所有文件系统都同等耐久。恢复组成要求 fence，并明确只能在旧host已经离开时释放旧claim；resumePending 最多默认处理64项，否则抛错而非假称清空。不能从API名称推断自动跨进程接管仲裁，更不能从checkpoint推断外部UI动作幂等或已经撤销。失败后先核查实际目标状态和checkpoint，再决定重试，避免重复提交。

先选不含真实支付/生产写入的测试旅程，保留确定性断言和证据；若模型频繁把未证实条件当完成，或恢复要求人工逐项重置目标超过收益，就停止扩大自动验收范围，回到原回归流程。持久数据和凭据退出清理未穷尽，因此仅给受控试用，不给持续安装保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-74](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/README.md#L62-L74)

作者Node与模型接入前提，且声明early stage。

<details>
<summary>查看原文（13行）</summary>

````text
## Get started

Requires Node.js 24+.

```sh
npm install -D agent-qa
npx agent-qa init
```

Follow the [quickstart](https://vostride.com/docs/agent-qa/quickstart) to connect a model and run the demo, or [set up with your coding agent](https://vostride.com/docs/agent-qa/agent-quickstart).

> [!NOTE]
> Early stage. Expect bugs. [Report an issue](https://github.com/vostride/agent-qa/issues) when something breaks.
````

</details>

**依据 2 · 源码核查**：[packages/runner/src/loop/index.ts:1906-1926](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/index.ts#L1906-L1926)

verifier独立调用与token计量。

<details>
<summary>查看原文（21行）</summary>

```text
      let verifyResult
      meter.recordVerifierCall()
      try {
        verifyResult = await withAbort(
          ports.verifier.verify(
            stepInstruction, record.startScreen, afterState, action,
            gate.attachImage ? verifyScreenshot : undefined,
            ports.abortSignal, gate.promptNote, activePredicate, verifierAuthorContext,
            accumulatedEvidence, record,
          ),
          ports.abortSignal,
        )
      } catch (verifyError: unknown) {
        const abortDuringVerify = checkAbort()
        if (abortDuringVerify) return abortDuringVerify
        throw verifyError
      }
      if (verifyResult.tokenUsage) {
        totalPromptTokens += verifyResult.tokenUsage.promptTokens
        totalCompletionTokens += verifyResult.tokenUsage.completionTokens
      }
```

</details>

**依据 3 · 源码核查**：[packages/agent-local/src/store/job-checkpoint-store.ts:200-227](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/agent-local/src/store/job-checkpoint-store.ts#L200-L227)

独占临时文件、fsync、rename与清理。

<details>
<summary>查看原文（28行）</summary>

```text
    publish(jobId, checkpointId, payload) {
      const file = pathFor(jobId, checkpointId)
      // Typed as the shipped envelope contract, so a field added on one side stops compiling.
      const envelope: JobCheckpointEnvelope = {
        schemaVersion: JOB_CHECKPOINT_SCHEMA_VERSION,
        jobId: asJobId(jobId),
        checkpointId,
        payload,
      }
      fs.mkdirSync(dirname(file), { recursive: true })
      const temporary = `${file}.tmp-${randomUUID()}`
      let fd: number | undefined
      try {
        // Exclusive create, so a torn temporary from an earlier crash can never be mistaken
        // for this one's; then fsync the fd BEFORE the rename, so the rename can only
        // publish bytes that are already on the device.
        fd = fs.openSync(temporary, 'wx')
        fs.writeFileSync(fd, `${canonicalJson(envelope)}\n`, 'utf8')
        fs.fsyncSync(fd)
        fs.closeSync(fd)
        fd = undefined
        fs.renameSync(temporary, file)
        // A rename is a directory mutation, durable only once its parent directory is synced.
        bestEffortFsyncDirectory(dirname(file))
      } finally {
        if (fd !== undefined) fs.closeSync(fd)
        fs.rmSync(temporary, { force: true })
      }
```

</details>

**依据 4 · 源码核查**：[packages/agent-local/src/store/job-checkpoint-store.ts:182-193](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/agent-local/src/store/job-checkpoint-store.ts#L182-L193)

父目录同步错误处理边界。

<details>
<summary>查看原文（12行）</summary>

```text
  function bestEffortFsyncDirectory(dir: string): void {
    let fd: number | undefined
    try {
      fd = fs.openSync(dir, 'r')
      fs.fsyncSync(fd)
    } catch (error) {
      if (!isSwallowableDirectoryFsyncError(error)) {
        throw error
      }
    } finally {
      if (fd !== undefined) fs.closeSync(fd)
    }
```

</details>

**依据 5 · 源码核查**：[packages/agent-local/src/composition/compose-job-recovery.ts:50-63](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/agent-local/src/composition/compose-job-recovery.ts#L50-L63)

恢复claim依赖旧host已消失的前提。

<details>
<summary>查看原文（14行）</summary>

```text
export interface JobRecoveryHost {
  readonly store: SqliteJobStore
  readonly kinds: JobKindRegistry
  readonly queue: AgentJobQueue
  /**
   * Return every outstanding claim to the queue, keeping the attempt each one spent.
   *
   * Call this FIRST. Only one process drains under a given fence, so at the moment authority is
   * adopted every outstanding claim belongs to a host that is gone; calling it beside a live pump
   * would reclaim a job from the handler still running it.
   */
  recoverAbandonedClaims(fence: JobStoreFence): Promise<RecoverAbandonedClaimsOutcome>
  /** Pump until no row is claimable. No timers, no sleeping — not a dispatcher. */
  resumePending(fence: JobStoreFence, maxJobs?: number): Promise<readonly RunNextJobOutcome[]>
```

</details>

**依据 6 · 源码核查**：[packages/agent-local/src/composition/compose-job-recovery.ts:91-107](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/agent-local/src/composition/compose-job-recovery.ts#L91-L107)

有限恢复泵及超界抛错。

<details>
<summary>查看原文（17行）</summary>

```text
    async resumePending(
      fence: JobStoreFence,
      maxJobs: number = JOB_RECOVERY_MAX_RESUMED_JOBS,
    ): Promise<readonly RunNextJobOutcome[]> {
      const outcomes: RunNextJobOutcome[] = []
      for (;;) {
        if (outcomes.length >= maxJobs) {
          throw new Error(
            `agent job recovery ran ${maxJobs} jobs without emptying the agent job queue; the ` +
              'bound exists so a chain that keeps enqueuing successors cannot turn recovery into an unbounded ' +
              'drain, and stopping early without saying so would report success over work left behind',
          )
        }
        const outcome = await queue.runNextJob({ fence })
        if (!outcome.ran) return outcomes
        outcomes.push(outcome)
      }
```

</details>

#### 缺口

- 各平台真实恢复、重复外部动作与凭据/知识数据退出流程未完整核查。
  **影响**：不能保证中断后无重复副作用或退出无残留。
  **进一步探讨**：在测试副本注入中断，核对目标真实状态、围栏拒绝与导出清理。
- 没有包括失败重试、复核和设备复位的总成本对照。
  **影响**：无法判断自然语言探索是否比既有回归更经济。
  **进一步探讨**：固定旅程与故障，记录合格率、全部调用费用和人工维护时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何减少模型假通过，能提出什么增量假设？

**研究主题**：新假设与验证

#### 完整回答

由 Q02 可推导一个限定假设：对少数高影响的业务条件，把同次运行中的界面证据与由测试方控制的独立后台只读查询绑定，可能比继续增加模型解释减少假通过。当前已有持久化、文件和视觉guard，因此不把“增加任何确定性验收”说成新方向，也不声称全仓缺少其他oracle。本次增量是限定在屏幕无法证明的后台最终状态，并把查询结果、条件ID和运行身份绑定，结果未知时保持未验证而不回退为模型通过。

先用测试环境的订单已创建/未创建、UI提示成功但后台失败等小样本，比较现有路径和增加后台只读查询两组，固定模型、旅程、预算和故障。指标包括假通过、假失败、不可判定比例、人工复核时间、接口维护和数据权限成本。若查询与UI共享同一错误来源、结果过时或并非当前运行，不算独立证据；若未减少假通过，或新增权限/维护成本大于收益，则否定当前范围的假设。它不是本项目已经实现的收益，不计入已有创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/runner/src/loop/requested-conditions.ts:314-326](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/requested-conditions.ts#L314-L326)

已有多类guard是反证，未来设计不从零开始。

<details>
<summary>查看原文（13行）</summary>

```text
  const { finalElements, record, imageAttached, files } = context.guards
  let guardedRecord = applyLimitGuard(met, judgment, finalElements, input.mask)
  guardedRecord = applyNarrowedGuard(guardedRecord, cited, record, input.mask)
  guardedRecord = applyPersistenceGuard(guardedRecord, judgment, cited, record)
  guardedRecord = applyVisualGuard(
    guardedRecord,
    judgment,
    cited,
    record,
    imageAttached,
    input.mask,
  )
  return applyFileGuard(guardedRecord, judgment, files, input.mask)
```

</details>

**依据 2 · 源码核查**：[packages/runner/src/loop/index.ts:1928-1951](https://github.com/vostride/agent-qa/blob/2b848e3f094c3c81a9004eb63c236c32adc55da6/packages/runner/src/loop/index.ts#L1928-L1951)

runner已有条件与引用记录，是绑定独立结果的接合点。

<details>
<summary>查看原文（24行）</summary>

```text
      const judged = judgeConditions({
        stepText: stepInstruction,
        output: verifyResult.verification,
        sources: buildVerifierCitationSources(
          record.startScreen,
          afterState,
          action,
          accumulatedEvidence,
          record,
        ),
        mask: recordMask,
        imageAttached: gate.attachImage && verifyScreenshot !== undefined,
        ending: 'completion',
        plannerReasoning: reasoning,
        guards: {
          finalElements: afterState.elements,
          platform: afterState.platform,
          record,
          imageAttached: gate.attachImage && verifyScreenshot !== undefined,
          ...(needsSavedFile(verifyResult.verification) ? { files: savedFiles(record.actions) } : {}),
        },
      })
      recorder.recordConditionVerdicts(judged.evidence)
      verifierReasoning = judged.pass ? verifyResult.verification.reasoning : judged.reason
```

</details>

#### 缺口

- 未测独立后台查询在真实任务中的有效性及维护成本。
  **影响**：不能声称它已降低假通过或是全仓缺失的功能。
  **进一步探讨**：用植入故障的小规模双组实验核对独立性、错误率和总维护投入。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
