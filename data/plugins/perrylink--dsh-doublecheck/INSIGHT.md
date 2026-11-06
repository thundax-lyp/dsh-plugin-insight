# dsh-doublecheck

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0f80ced](https://github.com/PerryLink/dsh-doublecheck/tree/0f80ced5367ba284c55131f138e1d4c7188779a3)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-doublecheck) [![npm 30d 5,123](https://img.shields.io/static/v1?label=npm+30d&message=5%2C123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doublecheck) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-doublecheck)
<!-- END META -->

> **功能**：通过需求规格、红绿测试轨迹、评审与交付报告，为 DSH 会话提供工程纪律提示和可配置门禁。

> **亮点**：将需求规格、测试轨迹、评审和阶段裁决放同一会话，真实支持工作流checker和缺服务降级；效果与全部工具覆盖未验，见 [Q01](#research-q01)至 [Q04](#research-q04)。

> **主要限制**：默认remind不会挡写；测试依工具/命令/结果文本，gate的deliverable允许warn/skip，评审不可用不等于已证质量，见 [Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要交付纪律，根包怎样生效？](#detail-section-11)
  - [Q02 · 规格和报告会做哪些真实动作？](#detail-section-12)
  - [Q03 · 红绿与实现门禁从何而来，默认挡什么？](#detail-section-13)
  - [Q04 · 评审、交付裁决与未知状态是否等于证明？](#detail-section-14)
  - [Q05 · 具体怎么用，生命周期负担怎样？](#detail-section-15)
  - [Q06 · 什么改进值得最小对照？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复在需求不清时改代码、收尾缺测试证据的开发者，可在非关键任务中把规格和测试轨迹带回交付复核，见 [Q01](#research-q01)。

手工需求清单、宿主审批与CI；本组件集中会话证据，不自己替代测试或发布审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 规格/报告 | 会话与工作区证据 | 写失败可仍有会话记录 |
| 红绿策略 | 提醒/询问/拒绝 | 默认remind、有限工具路径 |
| checker/review | 维度复核 | 模型/preset/服务，非真值 |
| gate命令 | 四阶段交付判断 | skip/warn可仍deliverable |
| 状态投影/开关 | 查看/停纪律 | 旧宿主开关可仅本地 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容DSH/Node与两行bundle | 必需 | 插件/命令/工具 | 根导出不是激活两行 |
| 实际工具/测试命令/结果格式 | 证据条件 | 红绿和改动归因 | 名单外不代表已覆盖 |
| 宿主fs和工作区 | 写文件条件 | spec/report/CI JSON | false/静默跳写要核 |
| workflowEngine/子Agent/模型 | 验证评审条件 | checker/reviewer | null/skip/unavailable |
| 新版只读reviewer preset | startActivation宿主 | 评审权限 | 未配则不运行 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 隔离 | 加两行，保持remind | 原CI和人工复核保留 |
| 规格 | 六维人工核对 | 非空不等于用户共识 |
| 测试 | 真实红绿再查看报告 | 核命令/范围与原输出 |
| gate | 看四阶段而非只看deliverable | skip需补证据 |
| 退出 | off核持久性/撤两行 | 文件/日志与活workflow另管 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 宿主/Node/fs | 模式/路径/preset匹配 | 未测耗时 |
| 持续 | 测试、checker/review模型 | 规格维护/复核误报 | 六维fanout非总token预算 |
| 失败 | 重跑可增加请求 | 分false/skip/取消 | 不把文件缺失当未执行 |
| 退出 | 会话/报告留存 | 核关闭恢复与活任务 | 不自动清理业务文件 |

#### 效果

| 效果 | 当前支持 | 未确认 |
| --- | --- | --- |
| 需求记录 | 六维与成功调用折叠 | 用户确已达成共识 |
| 红绿纪律 | 结果分类/前置策略 | 全写路径/断言覆盖 |
| 评审 | 真实子Agent与未知结果 | 独立正确性 |
| 交付报告 | 分阶段/可写JSON | 净返工减少与费用 |

> **思考**：默认remind不会挡写；测试依工具/命令/结果文本，gate的deliverable允许warn/skip，评审不可用不等于已证质量，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将需求规格、测试轨迹、评审和阶段裁决放同一会话，真实支持工作流checker和缺服务降级；效果与全部工具覆盖未验，见 [Q01](#research-q01)至 [Q04](#research-q04)。

会话日志折叠与成功spec配对、未知评审及局部写失败分开有价值；默认强度/名单/二元verdict语义需显式解释，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认remind不会挡写；测试依工具/命令/结果文本，gate的deliverable允许warn/skip，评审不可用不等于已证质量，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用：非关键小改动保持默认remind，人工核spec与真实测试，再读gate四阶段。skip或written:false需回原证据补核，不把deliverable当发布许可；误挡/误报时off并回手工清单和CI，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

两行真实装配、规格/报告/工作流、前置策略、证据分类、评审与gate未知/写入/开关路径已查；未运行宿主/模型/CI。可非关键默认提醒试用，三态为候选。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、src/domain/evidence.ts、src/domain/gate.ts、src/domain/report.ts、src/grill/index.ts、src/guard/command.ts、src/guard/gate.ts、src/guard/index.ts、src/guard/review.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核两行装配，grill/spec/report/verify关键链、guard配置/前置/关闭提示/命令，域证据和报告、四阶段gate执行/失败与reviewer真实启动；未全审所有清单规则/CI出口/宿主执行器或运行。
- 下一步：- 固定源码，无目标安装/运行、模型、测试或文件副作用。
- 不把作者兼容/质量声明当验收。
- 分默认提醒、工具策略与交付报告，未知不是质量通过。

**分析版本**

- **仓库**：[PerryLink/dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)
- **版本号**：0.9.30（[固定提交 0f80ced](https://github.com/PerryLink/dsh-doublecheck/tree/0f80ced5367ba284c55131f138e1d4c7188779a3)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是突出证据完备三态和报告调用的模型/写盘副作用，比较未知评审/写失败时的误判与阅读成本，见 [Q06](#research-q06)。

- 固定源码，无目标安装/运行、模型、测试或文件副作用。
- 不把作者兼容/质量声明当验收。
- 分默认提醒、工具策略与交付报告，未知不是质量通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 3326 | — | — | 41008 |
| .mjs | source | 12 | 584 | 446 | 96 | — |
| .js | source | 21 | 4712 | 3455 | 1259 | — |
| .ts | source | 22 | 6187 | 4175 | 1709 | — |
| .ts | test | 21 | 4554 | 3817 | 298 | — |

</details>

**活跃度**

[![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-doublecheck/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需求到交付的证据链实际约束什么，默认提醒与未知评审如何限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要交付纪律，根包怎样生效？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是由两个原生插件行组成的 DSH bundle：grill 提供技能/规格/报告工具，guard 提供纪律观察、工具前置策略、命令与投影；根index是共享域导出，不能只挂根入口就当两行都工作。面向经常在需求尚不清楚时改代码、最后缺测试证据的开发者，参照是手工需求清单、原宿主审批和CI。增量是把规格、测试轨迹、评审和交付裁决折叠到同一会话，而不是替代测试实现或让模型自己宣布正确。

合格结果需要需求覆盖当前任务、测试真的针对改动、未知评审可见、用户仍能检查原文件/测试输出。仅提醒就可能改善遗漏，但“交付质量门禁”的名字不能推定默认强制阻止；真实配置/事件链需另核。包声明宿主/Node范围、市场身份和测试覆盖均是兼容线索，本轮不运行加载或把宣称适配当实际验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-24](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/index.ts#L1-L24)

根只导出，实际行在子路径。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * dsh-doublecheck package entry: the shared domain model and pure helpers.
 * The installable plugin rows live at the `./grill` and `./guard` subpath
 * exports (see cordis.patch.yml); this root exists for tools, tests, and
 * future modules that need the package's private domain vocabulary.
 *
 * @module dsh-doublecheck
 */

// Service Definition: the package's shared domain vocabulary — event/contract types, domain folds, and the grill/guard gate types re-exported below for both plugin rows.
export type { GrilledSpec, GuardIntensity, GuardGate, GuardVerdict } from './events.ts'
export * from './domain/stages.ts'
export * from './domain/evidence.ts'
export * from './domain/vagueness.ts'
export * from './domain/vocabulary.ts'
export * from './domain/report.ts'
export * from './domain/gate.ts'
// Consumer: the grill/guard rows consume the domain folds above; renderSpecMarkdown turns specs into model-facing text for the contract tools.
export { renderSpecMarkdown } from './grill/index.ts'
// Service Provider: BundledSkillProvider supplies the bundled grill-requirements skill to the doublecheck-grill row.
export { BundledSkillProvider, parseSkillAsset, PROVIDER_NAME } from './grill/provider.ts'
// Type-only re-export: keeps the `doublecheck` SessionProjectionMap merge
// edge in the emitted index.d.ts, so consumers receive the projection key's type.
export type * from './types.ts'
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:6-19](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/cordis.patch.yml#L6-L19)

两插件bundle接线。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    # The grill module: the bundled grill-requirements skill and the
    # model-facing spec/catalog/report tools. Disable this row to remove
    # the skill and tools together.
    - id: doublecheck-grill
      name: 'dsh-doublecheck/grill'

    # The discipline guard: the grill gate (requirements-less edits on vague
    # tasks), the red/green evidence gates (modules.tdd), and the adversary
    # review (modules.adversary: a forked critic audits the delivery once it
    # reaches green). All gates can be switched off per session with
    # /doublecheck on|off (durable, survives restore).
    - id: doublecheck-guard
      name: 'dsh-doublecheck/guard'
```

</details>

**依据 3 · 源码核查**：[src/guard/index.ts:184-205](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L184-L205)

真实默认强度和模块开关。

<details>
<summary>查看原文（22行）</summary>

```text
export const Config = z.object({
  intensity: z.union(['remind', 'warn', 'block'] as const).default('remind'),
  modules: z.object({
    grill: z.boolean().default(true),
    tdd: z.boolean().default(true),
    adversary: z.boolean().default(false),
  }).default({ grill: true, tdd: true, adversary: false }),
  adversaryModel: z.union([z.string(), z.const(null)]).default(null),
  adversaryProvider: z.string().min(1).default('fork'),
  adversaryPreset: z.string(),
  adversaryMaxFindings: z.number().default(5),
  adversaryTools: z.array(z.string()).default(['read', 'glob', 'grep']),
  adversaryTimeoutMs: z.number().default(120000),
  guardTools: z.array(z.string()).default([...DEFAULT_MUTATION_TOOLS]),
  vagueTaskMaxChars: z.number().default(200),
  remindOnce: z.boolean().default(true),
  language: z.union(['en', 'zh'] as const).default('en'),
  enableByDefault: z.boolean().default(true),
  testToolNames: z.array(z.string()).default([...DEFAULT_TEST_TOOL_NAMES]),
  testCommandPatterns: z.array(z.string()).default([...DEFAULT_TEST_COMMAND_PATTERNS]),
  testFilePatterns: z.array(z.string()).default([...DEFAULT_TEST_FILE_PATTERNS]),
  gate: gateField(),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规格和报告会做哪些真实动作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

doublecheck_spec 收六个非空维度，空字符串拒绝，先经宿主fs.resolve/writeText写规格，再返回spec与written；普通写失败/无fs仍可返回written:false并提交会话事实。成功的tool/call-result配对才被报告fold采纳规格，不能把失败调用参数当共识完成；但六字段非空也不证明用户真的确认内容。文件与会话是不同落点，写文件失败不等于需求记录消失。

doublecheck_report折叠会话规格、编辑、红绿与评审，默认verify:true，经workflowEngine按维度调用checker（默认fork、all模式），将完整性和fail结果合入裁决，并真实写报告。无spec/父Agent/引擎，拒绝启动、非completed或结果缺checks会返回无验证；少一维不算proven。它不自己运行测试命令，checker结论仍来自宿主子Agent而非独立真值。fs写失败仍返回报告/false，取消则抛；最后run.dispose异常也可能向外传播，不能承诺所有失败都吞。报告调用虽呈现kind:read，实际会请求模型/写工作区，采用者应按真实副作用计成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/grill/index.ts:262-284](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L262-L284)

六维非空、写文件与发事件。

<details>
<summary>查看原文（23行）</summary>

```text
    async execute(args, exec) {
      const spec: GrilledSpec = {
        goal: args.goal,
        scope: args.scope,
        acceptanceCriteria: args.acceptanceCriteria,
        failureModes: args.failureModes,
        priorities: args.priorities,
        nonGoals: args.nonGoals,
      }
      // Fail fast at the commit: an empty dimension would satisfy the gate
      // shape while recording an uncheckable contract. The grill must settle
      // every dimension before the spec counts.
      const empty = SPEC_FIELD_NAMES.filter(field => spec[field].trim() === '')
      if (empty.length > 0) {
        throw new Error(
          `doublecheck_spec: the spec dimension(s) ${empty.join(', ')} must not be empty; finish the requirements grill before committing the spec`,
        )
      }
      const outcome = await writeSpecFile(ctx, spec, args.filePath ?? config.specFile, exec)
      if (exec.agent !== undefined) {
        ctx.emit('doublecheck/spec', { session: exec.agent.session, spec, ...outcome })
      }
      return { spec, ...outcome }
```

</details>

**依据 2 · 源码核查**：[src/domain/report.ts:90-143](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/report.ts#L90-L143)

规格仅成功call-result配对提交。

<details>
<summary>查看原文（54行）</summary>

```text
export function foldReportFacts(events: readonly SessionEvent[], detection: TestRunDetection): ReportFacts {
  const facts = emptyReportFacts()
  const pendingTests = new Map<string, string>()
  /** Spec calls awaiting a result: only a successful pair commits the spec. */
  const pendingSpecs = new Map<string, GrilledSpec>()
  for (const event of events) {
    // A settled PTC sub-dispatch runs through the same pre-execute policy
    // gates, so a dispatched test run or edit is a real delivery fact and must
    // count exactly like a native call. The normalizer accepts both event
    // generations, so the fold does not depend on which one wrote the log.
    const settle = ptcSettle(event)
    if (settle !== undefined) {
      const args = parseRawArguments(settle.arguments)
      const command = shellCommand(settle.name, args, detection)
      if (command !== undefined && isTestCommand(command, detection)) {
        foldTestRun(facts, command, testOutcome(joinTextBlocks(settle.content), settle.isError))
      }
      const path = mutationTargetPath(settle.name, args, detection)
      if (path !== undefined && !isTestFilePath(path, detection)) {
        facts.edits += 1
      }
      continue
    }
    switch (event.type) {
      case 'tool/call': {
        const args = parseRawArguments(event.data.arguments)
        if (event.data.name === SPEC_TOOL_NAME) {
          const spec = readSpecFromArgs(args)
          if (spec !== null) pendingSpecs.set(event.data.callId, spec)
        }
        const command = shellCommand(event.data.name, args, detection)
        if (command !== undefined && isTestCommand(command, detection)) {
          pendingTests.set(event.data.callId, command)
        }
        const path = mutationTargetPath(event.data.name, args, detection)
        if (path !== undefined && !isTestFilePath(path, detection)) {
          facts.edits += 1
        }
        break
      }
      case 'tool/result': {
        const callId = event.data.message.source.callId
        const spec = pendingSpecs.get(callId)
        if (spec !== undefined && event.data.error === undefined) {
          pendingSpecs.delete(callId)
          facts.spec = spec
          facts.timeline.push({ kind: 'spec', detail: preview(spec.goal) })
        } else if (spec !== undefined) {
          pendingSpecs.delete(callId)
        }
        const command = pendingTests.get(callId)
        if (command === undefined) break
        pendingTests.delete(callId)
        foldTestRun(facts, command, testOutcome(joinTextBlocks(event.data.message.content), event.data.error !== undefined))
```

</details>

**依据 3 · 源码核查**：[src/grill/index.ts:417-446](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L417-L446)

真实报告折叠/工作流/写盘与read呈现。

<details>
<summary>查看原文（30行）</summary>

```text
    async execute(args, exec) {
      const session = exec.agent?.session
      const facts = session === undefined
        ? { spec: null, testRuns: { failed: 0, passed: 0 }, timeline: [], edits: 0, review: null }
        : foldReportFacts(sessionEvents(session), reportDetection)
      const verify = args.verify ?? config.reportVerify
      const verification = verify
        ? await runVerifyWorkflow(ctx, config, facts.spec, exec)
        : null
      const report: ReportData = {
        ...facts,
        verdict: deriveReportVerdict(facts, verification),
        verification,
        path: null,
        written: false,
      }
      const outcome = await writeReportFile(ctx, report, args.filePath ?? config.reportFile, exec)
      report.path = outcome.path
      report.written = outcome.written
      if (session !== undefined) {
        ctx.emit('doublecheck/report', { session, verdict: report.verdict, verification, path: report.path, written: report.written })
      }
      return report
    },
    presentCall(args) {
      return {
        card: 'generic',
        title: 'Assemble doublecheck report',
        kind: 'read',
        content: [{ type: 'text', text: args.verify === true ? 'verifying delivery' : 'folding session evidence' }],
```

</details>

**依据 4 · 源码核查**：[src/grill/index.ts:459-510](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L459-L510)

验证启动、完整维度、失败和dispose。

<details>
<summary>查看原文（52行）</summary>

```text
async function runVerifyWorkflow(
  ctx: Context,
  config: Config,
  spec: GrilledSpec | null,
  exec: ToolRunContext,
): Promise<{ checks: VerifyCheck[]; complete: boolean } | null> {
  if (spec === null || exec.agent === undefined) return null
  const engine = ctx.get('workflowEngine')
  if (engine === undefined) {
    ctx.logger.warn('dsh-doublecheck: verification skipped: the workflowEngine seam is not mounted')
    return null
  }
  let run: WorkflowRun
  try {
    run = engine.start({
      script: buildVerifyScript(config.verifyMode),
      meta: VERIFY_META,
      args: { spec, dimensions: [...VERIFY_DIMENSIONS] },
      subagentProvider: config.verifyProvider,
      maxTotalAgents: config.verifyMode === 'single' ? 1 : VERIFY_DIMENSIONS.length,
      parent: exec.agent,
      signal: exec.signal,
    })
  } catch (error) {
    // Invalid script/meta or an absent verify provider: verification did not
    // run, and the report states so instead of failing the report itself.
    ctx.logger.warn(`dsh-doublecheck: verification workflow rejected: ${String(error)}`)
    return null
  }
  try {
    const result = await run.result
    if (result.stopReason !== 'completed') return null
    const value = result.value as { checks?: unknown } | null | undefined
    if (value === null || value === undefined || !Array.isArray(value.checks)) return null
    const checks: VerifyCheck[] = []
    for (const check of value.checks as VerifyCheck[]) {
      if (!VERIFY_DIMENSIONS.includes(check.dimension)) continue
      checks.push(check)
    }
    // `proven` requires a verdict for every spec dimension: completeness is
    // judged here so a checker that silently dropped a dimension cannot
    // upgrade the delivery.
    const complete = VERIFY_DIMENSIONS.every(dimension => checks.some(check => check.dimension === dimension))
    return { checks, complete }
  } catch (error) {
    // A broken workflow engine must not fail the report call itself: the
    // delivery settles as unverified and the markdown says verification did
    // not run.
    ctx.logger.warn(`dsh-doublecheck: verification workflow failed: ${String(error)}`)
    return null
  } finally {
    await run.dispose()
```

</details>

**依据 5 · 源码核查**：[src/grill/index.ts:515-565](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L515-L565)

宿主fs写入，失败/取消边界。

<details>
<summary>查看原文（51行）</summary>

```text
async function writeReportFile(
  ctx: Context,
  report: ReportData,
  filePath: string,
  exec: ToolRunContext,
): Promise<SpecWriteOutcome> {
  const fs = ctx.get('fs')
  if (fs === undefined) return { path: null, written: false }
  let target: FsTarget
  try {
    target = await fs.resolve(filePath, {
      ...exec.agent?.session.header.cwd !== undefined ? { cwd: exec.agent.session.header.cwd } : {},
      signal: exec.signal,
    })
    await fs.writeText(target, renderReportMarkdown(report), undefined, exec.signal)
  } catch (error) {
    // Any write failure leaves the report in the tool result (the durable
    // snapshot); the outcome reports `written: false` instead of failing.
    exec.signal.throwIfAborted()
    ctx.logger.debug(`dsh-doublecheck: report file write skipped: ${String(error)}`)
    return { path: null, written: false }
  }
  return { path: target.displayPath, written: true }
}

/** Write the spec markdown through the filesystem seam, when one exists. */
async function writeSpecFile(
  ctx: Context,
  spec: GrilledSpec,
  filePath: string,
  exec: ToolRunContext,
): Promise<SpecWriteOutcome> {
  const fs = ctx.get('fs')
  if (fs === undefined) return { path: null, written: false }
  let target: FsTarget
  try {
    target = await fs.resolve(filePath, {
      ...exec.agent?.session.header.cwd !== undefined ? { cwd: exec.agent.session.header.cwd } : {},
      signal: exec.signal,
    })
    await fs.writeText(target, renderSpecMarkdown(spec), undefined, exec.signal)
  } catch (error) {
    // Any write failure leaves the spec recorded in the session (the tool
    // result is the durable snapshot); the outcome reports `written: false`
    // instead of failing the commit.
    exec.signal.throwIfAborted()
    ctx.logger.debug(`dsh-doublecheck: spec file write skipped: ${String(error)}`)
    return { path: null, written: false }
  }
  return { path: target.displayPath, written: true }
}
```

</details>

**依据 6 · 源码核查**：[src/domain/report.ts:188-200](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/report.ts#L188-L200)

报告各类verdict实际派生。

<details>
<summary>查看原文（13行）</summary>

```text
export function deriveReportVerdict(facts: ReportFacts, verification: ReportData['verification']): ReportVerdict {
  if (facts.spec === null) return 'grill'
  if (facts.edits === 0) return 'draft'
  const lastTest = facts.timeline.findLast(entry => entry.kind === 'red' || entry.kind === 'green')
  if (lastTest?.kind === 'red') return 'red'
  if (verification !== null) {
    if (verification.checks.some(check => check.verdict === 'fail')) return 'challenged'
    // A missing dimension is not a pass: `proven` requires a verdict for
    // every spec dimension.
    return verification.complete ? 'proven' : 'unverified'
  }
  if (facts.review === null || facts.review.verdict === 'unavailable') return 'green'
  return facts.review.verdict === 'findings' ? 'objections' : 'verified'
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 红绿与实现门禁从何而来，默认挡什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

纪律来自持久会话事件，测试识别按工具名与命令正则，默认bash/pwsh；结果按渲染文本标记提取exit。基础设施error、后台ack和sandbox拒绝不算测试，超时/信号算fail；未见失败标记的正常结果默认pass。该逻辑依赖宿主结果格式、命令识别与测试自身质量，不验证测试断言覆盖或测试真的检验当前需求。默认改动工具仅edit/write，名单外shell写入等不能据此称全面门禁。

tools/pre-execute遇未绑定Agent/非名单/会话关闭直接next；grill只对“被识别模糊、无当前spec”任务提醒或拦，后续用户任务可重开。TDD只对有可识别路径的非测试文件执行red检查，写测试和无路径调用放行。默认intensity=remind，始终next；warn返回ask、block返回deny，是否最终执行还依赖宿主前置策略契约。turn-stopping的green/report提醒与对抗评审是advisory，不阻止本轮关闭。用户需把质量提示与宿主权限/真正CI阻断分开。

#### 证据与依据

**依据 1 · 源码核查**：[src/domain/evidence.ts:27-45](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/evidence.ts#L27-L45)

默认工具/命令和测试路径识别。

<details>
<summary>查看原文（19行）</summary>

```text
/** Shared defaults: shell tools that can run tests. */
export const DEFAULT_TEST_TOOL_NAMES: readonly string[] = ['bash', 'pwsh']

/** Shared defaults: commands that count as test runs. */
export const DEFAULT_TEST_COMMAND_PATTERNS: readonly string[] = [
  '(?:^|[;&|]\\s*)(?:(?:pnpm|npm|npx|yarn|bun)(?:\\s+run)?\\s+(?:test|vitest|jest|mocha)(?:\\s|$))',
  '(?:^|[;&|]\\s*)(?:(?:pytest|go\\s+test|cargo\\s+test|make\\s+test|ctest)(?:\\s|$))',
  '(?:^|[;&|]\\s*)(?:node\\s+--test(?:\\s|$))',
  '(?:^|[;&|]\\s*)(?:deno\\s+test|uv\\s+run\\s+pytest)(?:\\s|$)',
]

/** Shared defaults: mutation tools and test-file path patterns. */
export const DEFAULT_MUTATION_TOOLS: readonly string[] = ['edit', 'write']

/** Shared defaults: paths that identify test files. */
export const DEFAULT_TEST_FILE_PATTERNS: readonly string[] = [
  '(^|[\\\\/])(tests?|__tests__|specs?)([\\\\/]|$)',
  '\\.(test|spec)\\.[A-Za-z0-9]+$',
]
```

</details>

**依据 2 · 源码核查**：[src/domain/evidence.ts:166-208](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/evidence.ts#L166-L208)

命令/改动目标路径识别。

<details>
<summary>查看原文（43行）</summary>

```text
export function shellCommand(name: string, args: Record<string, unknown> | undefined, detection: TestRunDetection): string | undefined {
  if (!detection.testToolNames.includes(name)) return undefined
  const command = args?.['command']
  return typeof command === 'string' && command.length > 0 ? command : undefined
}

/**
 * Whether a shell command is a test run under the configured patterns.
 * @param command - the command text.
 * @param detection - the compiled detection knobs.
 * @returns true when at least one pattern matches.
 */
export function isTestCommand(command: string, detection: TestRunDetection): boolean {
  return detection.testCommandPatterns.some(pattern => pattern.test(command))
}

/**
 * The mutation target path of a tool call, when the tool is a configured
 * mutation tool and its arguments name a file. Accepts both the DSH-native
 * `file_path` key (`edit` / `write`) and the `path` key custom guard tools
 * may use, so a configured tool is never mis-gated merely for its argument
 * shape.
 * @param name - the called tool name.
 * @param args - the parsed arguments record.
 * @param detection - the compiled detection knobs.
 * @returns the target path, or `undefined` when the call does not name one.
 */
export function mutationTargetPath(name: string, args: Record<string, unknown> | undefined, detection: TestRunDetection): string | undefined {
  if (!detection.mutationTools.includes(name)) return undefined
  const filePath = args?.['file_path']
  const path = filePath ?? args?.['path']
  return typeof path === 'string' && path.length > 0 ? path : undefined
}

/**
 * Whether a mutation target is itself a test file (writing the failing test
 * is the red step, so test files stay editable).
 * @param path - the mutation target path.
 * @param detection - the compiled detection knobs.
 * @returns true when the path matches a test-file pattern.
 */
export function isTestFilePath(path: string, detection: TestRunDetection): boolean {
  return detection.testFilePatterns.some(pattern => pattern.test(path))
```

</details>

**依据 3 · 源码核查**：[src/domain/evidence.ts:217-225](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/evidence.ts#L217-L225)

渲染结果分类与无失败标记默认pass。

```text
export function testOutcome(text: string, isError: boolean): TestOutcome | undefined {
  if (isError) return undefined
  if (BACKGROUND_ACK.test(text)) return undefined
  if (SANDBOX_DENIAL.test(text)) return undefined
  if (TIMED_OUT.test(text) || KILLED_BY_SIGNAL.test(text)) return 'fail'
  const exit = EXIT_CODE.exec(text)
  if (exit !== null) return exit[1] === '0' ? 'pass' : 'fail'
  // A finished shell run with no failure markers settled with exit code 0.
  return 'pass'
```

**依据 4 · 源码核查**：[src/guard/index.ts:508-560](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L508-L560)

grill范围与三强度实际返回。

<details>
<summary>查看原文（53行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next): Promise<PreToolDecision> => {
    const agent = exec.agent
    if (agent === undefined || !guardToolSet.has(exec.name)) return next()
    if (!doublecheckEnabled(agent.session)) return next()
    const snapshot = snapshotOf(agent.session)

    // Grill gate: first discipline stage wins while it stays unsatisfied.
    // The gate reopens when a new direct-user task arrives after the latest
    // spec commit (seq comparison): a committed spec covers its own task,
    // not follow-up requests the user appended to the session.
    const grillOpen = !snapshot.discipline.hasSpec || snapshot.discipline.specSeq < snapshot.lastTaskSeq
    if (config.modules.grill && grillOpen && snapshot.vague) {
      const reminder = nextGrillReminder(snapshot)
      if (reminder !== undefined) pendingReminders.set(exec, reminder)
      switch (config.intensity) {
        case 'remind': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'grill',
            verdict: 'reminded',
            ...reminder !== undefined ? { reminder: prose.grillReminder } : {},
          })
          return next()
        }
        case 'warn': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'grill',
            verdict: 'held',
          })
          return { kind: 'ask', reason: prose.grillAsk }
        }
        case 'block': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'grill',
            verdict: 'denied',
          })
          return { kind: 'deny', reason: prose.grillDeny }
        }
        /* v8 ignore next -- GuardIntensity is a closed union; a future member must fail compilation here. */
        default:
          return assertNever(config.intensity, 'guard intensity')
      }
```

</details>

**依据 5 · 源码核查**：[src/guard/index.ts:563-615](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L563-L615)

red检查例外与三强度。

<details>
<summary>查看原文（53行）</summary>

```text
    // Red gate: implementation edits need a failing test on record. Writing
    // test files is the red step itself and always delegates, and a call that
    // names no file at all (a custom guard tool with another argument shape)
    // is not an implementation edit either.
    if (config.modules.tdd && snapshot.discipline.color !== 'red') {
      const args = exec.arguments as Record<string, unknown> | undefined
      const path = mutationTargetPath(exec.name, args, detection)
      if (path === undefined || isTestFilePath(path, detection)) return next()
      const reminder = nextTddRedReminder(snapshot)
      if (reminder !== undefined) pendingReminders.set(exec, reminder)
      switch (config.intensity) {
        case 'remind': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'tdd',
            verdict: 'reminded',
            ...reminder !== undefined ? { reminder: prose.tddReminder } : {},
          })
          return next()
        }
        case 'warn': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'tdd',
            verdict: 'held',
          })
          return { kind: 'ask', reason: prose.tddAsk }
        }
        case 'block': {
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            toolName: exec.name,
            intensity: config.intensity,
            gate: 'tdd',
            verdict: 'denied',
          })
          return { kind: 'deny', reason: prose.tddDeny }
        }
        /* v8 ignore next -- GuardIntensity is a closed union; a future member must fail compilation here. */
        default:
          return assertNever(config.intensity, 'guard intensity')
      }
    }

    return next()
  })
```

</details>

**依据 6 · 源码核查**：[src/guard/index.ts:636-679](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L636-L679)

关闭时提醒不作veto。

<details>
<summary>查看原文（44行）</summary>

```text
  // Advisory, not a veto — `agent/turn-stopping` never blocks the close, and
  // a review that cannot run settles as an honest "unavailable" notice. The
  // turn's abort signal cancels the review instead of letting it run out the
  // configured timeout.
  ctx.on('agent/turn-stopping', async ({ agent, signal: turnSignal }) => {
    if (!doublecheckEnabled(agent.session)) return
    const snapshot = snapshotOf(agent.session)
    if (config.modules.tdd && snapshot.discipline.pendingGreen) {
      if (!config.remindOnce || !snapshot.greenReminded) {
        snapshot.greenReminded = true
        const text = config.intensity === 'remind' ? prose.greenReminder : prose.greenReminderStrict
        agent.inject(notice('green gate', text))
        ctx.emit('doublecheck/reminder', {
          agent,
          session: agent.session,
          intensity: config.intensity,
          gate: 'tdd',
          verdict: 'green-pending',
          reminder: text,
        })
      }
    }

    // Delivery gate (advisory): once the loop reaches green and no
    // doublecheck_report is on record, expect the delivery record before
    // completion claims. Requires test-evidence tracking (tdd or adversary),
    // since `green` itself is only known when detection is compiled.
    if (config.modules.tdd || config.modules.adversary) {
      const discipline = snapshot.discipline
      if (discipline.hasSpec && discipline.editCount > 0 && discipline.color === 'green'
        && !discipline.pendingGreen && discipline.stage !== 'verify') {
        if (!config.remindOnce || !snapshot.reportReminded) {
          snapshot.reportReminded = true
          const text = prose.reportExpected
          agent.inject(notice('delivery report', text))
          ctx.emit('doublecheck/reminder', {
            agent,
            session: agent.session,
            intensity: config.intensity,
            gate: 'delivery',
            verdict: 'report-expected',
            reminder: text,
          })
        }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 评审、交付裁决与未知状态是否等于证明？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

/gate run 实际汇总requirements/tests，再跑一致性与review；auto评审先折叠另一插件已有记录，没有记录才本地review并标降级，本轮只审本包读取契约不外推dsh-auto-review可靠性。新版startActivation要求明确只读preset，否则unavailable；旧start传只读工具过滤。评审有timeout/调用signal，失败/无结构findings标unavailable，依赖宿主遵守取消和权限。独立adversary默认关闭，开启后也只是向会话注入/steer，不能称强制审完才结束。

关键边界是二元gate只要没有enabled fail就判deliverable，warn/skip不改变；一致性/本地review不可用就是skip，所以其余项不fail时可能“可交付但没评审”。这是可见策略取舍，不是独立证明全部质量通过；使用者必须看四阶段细项。另doublecheck_report的proven来自各维checker无fail且完整，不等于程序行为或用户效果独立验证；两套verdict词汇不要混称。

/gate命令返回状态且写markdown/JSON，文件普通写失败只debug，状态可能已在会话settle，需核文件实际存在。开关在支持ignorable持久事件宿主中记状态，否则process-local回退，重启可能恢复默认；报告并不自动删除旧数据。红灯turn notice只注入建议，无自动重开plan或撤销交付。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard/gate.ts:463-535](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/gate.ts#L463-L535)

真实阶段与auto评审降级。

<details>
<summary>查看原文（73行）</summary>

```text
export async function runGate(
  ctx: Context,
  config: GateConfig,
  detection: TestRunDetection,
  agent: Agent,
  signal: AbortSignal,
  language: ProseLanguage,
): Promise<GateState> {
  const events = sessionEvents(agent.session)
  const coverageRegex = new RegExp(config.tests.coveragePattern, 'i')

  const requirements: GatePhaseResult = config.requirements.enabled
    ? evaluateRequirements(
      foldRequirementsEvidence(events, config.requirements.interrogateTool),
      { checklist: config.requirements.checklist, minConfirmed: config.requirements.minConfirmed },
    )
    : skippedPhase('requirements')
  let tests: GatePhaseResult = config.tests.enabled
    ? evaluateTests(foldTestEvidence(events, detection, coverageRegex), config.tests)
    : skippedPhase('tests')
  if (config.tests.enabled && config.tests.evalReports.enabled) {
    // Weak dependency on dsh-auto-review's eval engine: fold its report file
    // (prompt-regression / stress / fairness suites) into the tests phase.
    // A missing or malformed report settles as skip/red, never a throw.
    const read = await readEvalEvidence(ctx, config.tests.evalReports, agent, signal)
    tests = attachEvalChecks(tests, read.evidence, config.tests.evalReports, read.reason)
  }

  const prose = PROSE[language]
  const consistencyTask = language === 'zh' ? CONSISTENCY_TASK_ZH : CONSISTENCY_TASK_EN
  const consistencyPromise: Promise<LocalReviewOutcome> = config.consistency.enabled
    ? runLocalReviewer(ctx, config.consistency, agent, consistencyTask, 'doublecheck-gate-consistency', signal)
    : Promise.resolve({ findings: null, unavailable: 'disabled' })
  const localReviewPromise: Promise<LocalReviewOutcome> = config.review.enabled && config.review.engine === 'local'
    ? runLocalReviewer(ctx, config.review, agent, prose.criticTask, 'doublecheck-gate-review', signal)
    : Promise.resolve({ findings: null, unavailable: 'disabled' })

  const [consistencyOutcome, localReviewOutcome] = await Promise.all([consistencyPromise, localReviewPromise])

  const consistency: GatePhaseResult = config.consistency.enabled
    ? evaluateConsistency(consistencyOutcome.findings, consistencyOutcome.unavailable)
    : skippedPhase('consistency')

  let reviewResult: { result: GatePhaseResult; engine: GateState['reviewEngine'] }
  if (!config.review.enabled) {
    reviewResult = { result: skippedPhase('review'), engine: null }
  } else if (config.review.engine === 'auto') {
    // Weak dependency: the engine's durable verdict records are the evidence.
    // No records (not installed, or nothing triggered it this session) → the
    // local reviewer takes over, and an honest warn check names the degrade.
    const engine = foldAutoReviewEvidence(events)
    if (engine !== null) {
      reviewResult = evaluateReview(engine, null, '', 'auto')
    } else {
      const degradeNote = autoReviewInstalled(ctx, agent)
        ? 'dsh-auto-review is installed but has no verdict records in this session'
        : 'dsh-auto-review is not installed'
      const local = await runLocalReviewer(ctx, config.review, agent, prose.criticTask, 'doublecheck-gate-review', signal)
      const unavailable = local.findings === null
        ? `${degradeNote}; ${local.unavailable}`
        : local.unavailable
      reviewResult = evaluateReview(engine, local.findings, unavailable, 'auto', degradeNote)
    }
  } else {
    reviewResult = evaluateReview(null, localReviewOutcome.findings, localReviewOutcome.unavailable, 'local')
  }

  const phases = { requirements, tests, consistency, review: reviewResult.result }
  return {
    verdict: deriveGateVerdict(Object.values(phases)),
    phases,
    reviewEngine: reviewResult.engine,
    at: new Date().toISOString(),
```

</details>

**依据 2 · 源码核查**：[src/guard/gate.ts:354-425](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/gate.ts#L354-L425)

reviewer真实调用、preset/过滤、失败和释放。

<details>
<summary>查看原文（72行）</summary>

```text
async function runLocalReviewer(
  ctx: Context,
  reviewer: GateReviewerConfig,
  agent: Agent,
  task: string,
  label: string,
  signal: AbortSignal,
): Promise<LocalReviewOutcome> {
  const subagents = ctx.get('subagents')
  if (subagents === undefined) {
    ctx.logger.warn(`dsh-doublecheck: ${label} skipped: the ctx.subagents seam is not mounted`)
    return { findings: null, unavailable: 'the subagents seam is not mounted' }
  }
  const timeout = AbortSignal.timeout(reviewer.timeoutMs)
  const runSignal = AbortSignal.any([signal, timeout])
  let run: SubagentRun
  try {
    const activation = subagents as typeof subagents & GuardActivationService
    if (typeof activation.startActivation === 'function') {
      if (reviewer.preset === undefined) {
        return { findings: null, unavailable: 'this host uses subagents.startActivation; set the reviewer preset to a read-only Agent Preset' }
      }
      const started = await activation.startActivation({
        provider: reviewer.provider,
        label,
        request: {
          prompt: [{ type: 'text', text: task }],
          parent: agent,
          outputSchema: GATE_FINDINGS_SCHEMA,
          agentPreset: reviewer.preset,
          ...reviewer.model !== null ? { agentOptions: { model: reviewer.model } } : {},
        },
        signal: runSignal,
        delivery: 'caller',
      })
      run = started as unknown as SubagentRun
    } else {
      const legacy = subagents as unknown as { start: (provider: string, options: Record<string, unknown>) => Promise<SubagentRun> }
      run = await legacy.start(reviewer.provider, {
        label,
        prompt: [{ type: 'text', text: task }],
        parent: agent,
        signal: runSignal,
        ...reviewer.model !== null ? { agentOptions: { model: reviewer.model } } : {},
        outputSchema: GATE_FINDINGS_SCHEMA,
        toolFilter: { allow: reviewer.tools },
      })
    }
  } catch (error) {
    return { findings: null, unavailable: String(error) }
  }
  try {
    let result: Awaited<typeof run.result>
    try {
      result = await run.result
    } catch (error) {
      if (runSignal.aborted) {
        return { findings: null, unavailable: signal.aborted ? 'aborted' : 'timed out' }
      }
      return { findings: null, unavailable: String(error) }
    }
    if (result.stopReason !== 'completed') {
      return { findings: null, unavailable: `stopped (${result.stopReason})` }
    }
    const structured = result.structured as { findings?: unknown } | undefined
    const raw = structured?.findings
    if (!Array.isArray(raw)) {
      return { findings: null, unavailable: 'the reviewer returned no structured findings' }
    }
    return { findings: sortFindings(raw as ReviewFinding[]).slice(0, reviewer.maxFindings), unavailable: '' }
  } finally {
    await run.dispose()
```

</details>

**依据 3 · 源码核查**：[src/domain/gate.ts:594-608](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/gate.ts#L594-L608)

一致性不可用skip。

<details>
<summary>查看原文（15行）</summary>

```text
export function evaluateConsistency(findings: ReviewFinding[] | null, unavailableReason: string): GatePhaseResult {
  if (findings === null) {
    return {
      phase: 'consistency',
      enabled: true,
      status: 'skip',
      checks: [{
        id: 'consistency-review',
        phase: 'consistency',
        label: 'diff ↔ requirement mapping',
        status: 'skip',
        summary: unavailableReason,
        suggestion: 'run /gate run again once the reviewer seam is available',
      }],
    }
```

</details>

**依据 4 · 源码核查**：[src/domain/gate.ts:729-756](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/gate.ts#L729-L756)

本地review不可用skip。

<details>
<summary>查看原文（28行）</summary>

```text
/** The local reviewer's settled phase result (shared by both engine modes). */
function evaluateLocalReview(
  findings: ReviewFinding[] | null,
  unavailableReason: string,
  degraded: boolean,
  degradeNote: string | null,
): GatePhaseResult {
  const checks: GateCheck[] = []
  if (degraded && degradeNote !== null) {
    checks.push({
      id: 'engine-degraded',
      phase: 'review',
      label: 'review engine',
      status: 'warn',
      summary: degradeNote,
      suggestion: 'install dsh-auto-review, or re-run /gate run after it has judged this session\'s calls',
    })
  }
  if (findings === null) {
    checks.push({
      id: 'local-review',
      phase: 'review',
      label: 'local review',
      status: 'skip',
      summary: unavailableReason,
      suggestion: 'run /gate run again once the reviewer seam is available',
    })
    return { phase: 'review', enabled: true, status: worstStatus(checks), checks }
```

</details>

**依据 5 · 源码核查**：[src/domain/gate.ts:799-808](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/gate.ts#L799-L808)

只有fail使rework，skip/warn不阻断。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Derive the gate's binary decision: any enabled phase with a failing check
 * means rework. Warnings and skipped phases never flip the decision — a
 * skipped review keeps the report honest ("not reviewed") without inventing
 * a red light.
 * @param phases - the settled phase results.
 * @returns the gate verdict.
 */
export function deriveGateVerdict(phases: readonly GatePhaseResult[]): GateVerdict {
  return phases.some(phase => phase.enabled && phase.status === 'fail') ? 'rework' : 'deliverable'
```

</details>

**依据 6 · 源码核查**：[src/guard/review.ts:126-182](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/review.ts#L126-L182)

adversary真实调用与取消/preset边界。

<details>
<summary>查看原文（57行）</summary>

```text
export async function runAdversaryReview(
  ctx: Context,
  config: AdversaryConfig,
  agent: Agent,
  turnSignal?: AbortSignal,
): Promise<ReviewOutcome> {
  const prose = PROSE[config.language]
  const subagents = ctx.get('subagents')
  if (subagents === undefined) {
    ctx.logger.warn('dsh-doublecheck: adversary review skipped: the ctx.subagents seam is not mounted')
    return { verdict: 'unavailable', findings: [], text: prose.reviewUnavailableSeam }
  }
  const timeout = AbortSignal.timeout(config.adversaryTimeoutMs)
  const signal = turnSignal === undefined ? timeout : AbortSignal.any([turnSignal, timeout])
  let run: SubagentRun
  try {
    const activation = subagents as typeof subagents & GuardActivationService
    if (typeof activation.startActivation === 'function') {
      if (config.adversaryPreset === undefined) {
        return { verdict: 'unavailable', findings: [], text: prose.reviewUnavailableFailed('this host uses subagents.startActivation; set adversaryPreset to a read-only Agent Preset') }
      }
      const started = await activation.startActivation({
        provider: config.adversaryProvider,
        label: 'doublecheck-adversary',
        request: {
          prompt: [{ type: 'text', text: prose.criticTask }],
          parent: agent,
          outputSchema: REVIEW_OUTPUT_SCHEMA,
          agentPreset: config.adversaryPreset,
          ...config.adversaryModel !== null ? { agentOptions: { model: config.adversaryModel } } : {},
        },
        signal,
        delivery: 'caller',
      })
      run = started as unknown as SubagentRun
    } else {
      const legacy = subagents as unknown as { start: (provider: string, options: Record<string, unknown>) => Promise<SubagentRun> }
      run = await legacy.start(config.adversaryProvider, {
        label: 'doublecheck-adversary',
        prompt: [{ type: 'text', text: prose.criticTask }],
        parent: agent,
        signal,
        ...config.adversaryModel !== null ? { agentOptions: { model: config.adversaryModel } } : {},
        outputSchema: REVIEW_OUTPUT_SCHEMA,
        toolFilter: { allow: config.adversaryTools },
      })
    }
  } catch (error) {
    // Provider absence, capability rejection, or a child that could not be
    // composed: the review itself never ran, and the notice says so.
    return { verdict: 'unavailable', findings: [], text: prose.reviewUnavailableFailed(String(error)) }
  }
  try {
    const result = await settleResult(run, signal, prose, config.adversaryMaxFindings)
    return result
  } finally {
    await run.dispose()
```

</details>

**依据 7 · 源码核查**：[src/guard/index.ts:475-495](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L475-L495)

红gate只注入提醒。

<details>
<summary>查看原文（21行）</summary>

```text
  // The gate-red turn notice: once per session, a settled rework verdict
  // suggests re-opening the work in plan mode. Installed even when every
  // discipline module is off — the gate panel is advisory, not a gate.
  if (gateConfig.enabled) {
    ctx.on('agent/turn-stopping', async ({ agent }) => {
      if (!doublecheckEnabled(agent.session)) return
      const snapshot = snapshotOf(agent.session)
      if (snapshot.gateRedReminded) return
      const gate = snapshot.lastGate
      if (gate === null || gate.verdict !== 'rework') return
      snapshot.gateRedReminded = true
      const text = prose.gateRedNotice(gate.redCount)
      agent.inject(gateInjection(gate.verdict, gate.redCount, text))
      ctx.emit('doublecheck/reminder', {
        agent,
        session: agent.session,
        intensity: config.intensity,
        gate: 'gate',
        verdict: 'gate-red',
        reminder: text,
      })
```

</details>

**依据 8 · 源码核查**：[src/guard/gate.ts:551-593](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/gate.ts#L551-L593)

会话settle与文件写失败。

<details>
<summary>查看原文（43行）</summary>

```text
export async function settleGate(
  ctx: Context,
  config: GateConfig,
  state: GateState,
  agent: Agent,
  signal: AbortSignal,
  stampsIgnorable: boolean,
): Promise<void> {
  if (stampsIgnorable) {
    ;(agent.session.append as unknown as GateAppend)('doublecheck/gate', state, { ignorable: true })
  }
  ctx.emit('doublecheck/gate', { session: agent.session, state })
  await writeGateFile(ctx, config.reportFile, state, agent, signal)
}

/** Write the gate report markdown through the filesystem seam, when one exists. */
async function writeGateFile(
  ctx: Context,
  filePath: string,
  state: GateState,
  agent: Agent,
  signal: AbortSignal,
): Promise<void> {
  const fs = ctx.get('fs')
  if (fs === undefined) return
  try {
    const markdownTarget = await fs.resolve(filePath, {
      ...agent.session.header.cwd !== undefined ? { cwd: agent.session.header.cwd } : {},
      signal,
    })
    await fs.writeText(markdownTarget, renderGateReportMarkdown(state, true), undefined, signal)
    // The headless CI copy: the same settled state as JSON, for the
    // `doublecheck-gate` CLI (PR comment / status checks). Additive output —
    // the markdown report and the four-phase runner are unchanged.
    const ciTarget = await fs.resolve(ciReportPath(filePath), {
      ...agent.session.header.cwd !== undefined ? { cwd: agent.session.header.cwd } : {},
      signal,
    })
    await fs.writeText(ciTarget, renderGateReportJson(state), undefined, signal)
  } catch (error) {
    signal.throwIfAborted()
    ctx.logger.debug(`dsh-doublecheck: gate report file write skipped: ${String(error)}`)
  }
```

</details>

**依据 9 · 源码核查**：[src/guard/command.ts:159-178](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/command.ts#L159-L178)

开关持久与本地降级。

<details>
<summary>查看原文（20行）</summary>

```text
    const target = input === 'on'
    if (enabled === target) {
      return { kind: 'success', text: target ? prose.commandAlreadyOn : prose.commandAlreadyOff }
    }
    // Adaptive durable write: only hosts that stamp `ignorable` may write the
    // state event; on rc.6 the options bag is ignored and an unmarked foreign
    // event would make the session log unreadable to first-party readers.
    const durable = stampsIgnorable()
    if (durable) {
      ;(session.append as unknown as StateAppend)('doublecheck/state', { enabled: target }, { ignorable: true })
    } else {
      setLocalOverride(session, target)
    }
    agent.inject(switchNotice(target, durable, prose))
    return {
      kind: 'success',
      text: target
        ? durable ? prose.commandOnDurable : prose.commandOnLocal
        : durable ? prose.commandOffDurable : prose.commandOffLocal,
    }
```

</details>

#### 缺口

- 未运行匹配宿主、前置策略/子Agent权限、恢复与结果格式。
  **影响**：不能宣称真正阻止所有不合格交付或所有读写均有安全保证。
  **进一步探讨**：用非关键仓库验证各强度/缺preset/无服务/写失败/关闭恢复，看细项与最终执行。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 具体怎么用，生命周期负担怎样？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可以有条件试用：维护者选一个非关键小改动，在独立profile加载两行，保留默认remind；先提交并人工核六维spec，手动做一次真实失败/通过测试，再查看报告和/gate各阶段。不要首轮开启strict/adversary全套，不能把deliverable文字当发布许可或替代CI。缺reviewer/preset导致skip时，回原测试与人工复核；只有匹配实际工具/命令并验证过拦截，才讨论提高强度。

首次有Node/宿主服务与fs、工具/命令模式、工作区文件路径配置，旧版新API/preset差异需核；持续有规格维护、日志折叠、测试运行与验证checker/可选review模型费用。默认reportVerify开all可能按六维扇出，timeout不是总tokens预算。失败恢复区分写盘false、无验证/skip、模型失败与取消，避免因文件缺失重跑所有checker；退出关会话开关并核持久性，撤两行后原会话日志/规格报告仍在，运行中的工作流另行核结束。没有真实时间、准确率或费用对照。若提示反复误报、正常修改被挡或无法解释状态，先关闭纪律并回手工清单/原CI。

#### 证据与依据

**依据 1 · 源码核查**：[src/grill/index.ts:70-79](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L70-L79)

默认verify/fanout与输出文件。

<details>
<summary>查看原文（10行）</summary>

```text
export const Config: Schema<Config> = z.object({
  specFile: z.string().min(1).default('doublecheck-spec.md'),
  reportFile: z.string().min(1).default('doublecheck-report.md'),
  reportVerify: z.boolean().default(true),
  verifyProvider: z.string().min(1).default('fork'),
  verifyMode: z.union(['all', 'single'] as const).default('all'),
  reportTestToolNames: z.array(z.string()).default([...DEFAULT_TEST_TOOL_NAMES]),
  reportTestCommandPatterns: z.array(z.string()).default([...DEFAULT_TEST_COMMAND_PATTERNS]),
  reportMutationTools: z.array(z.string()).default([...DEFAULT_MUTATION_TOOLS]),
  reportTestFilePatterns: z.array(z.string()).default([...DEFAULT_TEST_FILE_PATTERNS]),
```

</details>

**依据 2 · 源码核查**：[src/guard/index.ts:184-205](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/index.ts#L184-L205)

默认提醒、adversary关闭。

<details>
<summary>查看原文（22行）</summary>

```text
export const Config = z.object({
  intensity: z.union(['remind', 'warn', 'block'] as const).default('remind'),
  modules: z.object({
    grill: z.boolean().default(true),
    tdd: z.boolean().default(true),
    adversary: z.boolean().default(false),
  }).default({ grill: true, tdd: true, adversary: false }),
  adversaryModel: z.union([z.string(), z.const(null)]).default(null),
  adversaryProvider: z.string().min(1).default('fork'),
  adversaryPreset: z.string(),
  adversaryMaxFindings: z.number().default(5),
  adversaryTools: z.array(z.string()).default(['read', 'glob', 'grep']),
  adversaryTimeoutMs: z.number().default(120000),
  guardTools: z.array(z.string()).default([...DEFAULT_MUTATION_TOOLS]),
  vagueTaskMaxChars: z.number().default(200),
  remindOnce: z.boolean().default(true),
  language: z.union(['en', 'zh'] as const).default('en'),
  enableByDefault: z.boolean().default(true),
  testToolNames: z.array(z.string()).default([...DEFAULT_TEST_TOOL_NAMES]),
  testCommandPatterns: z.array(z.string()).default([...DEFAULT_TEST_COMMAND_PATTERNS]),
  testFilePatterns: z.array(z.string()).default([...DEFAULT_TEST_FILE_PATTERNS]),
  gate: gateField(),
```

</details>

**依据 3 · 源码核查**：[src/guard/command.ts:159-178](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/command.ts#L159-L178)

关闭与恢复差异。

<details>
<summary>查看原文（20行）</summary>

```text
    const target = input === 'on'
    if (enabled === target) {
      return { kind: 'success', text: target ? prose.commandAlreadyOn : prose.commandAlreadyOff }
    }
    // Adaptive durable write: only hosts that stamp `ignorable` may write the
    // state event; on rc.6 the options bag is ignored and an unmarked foreign
    // event would make the session log unreadable to first-party readers.
    const durable = stampsIgnorable()
    if (durable) {
      ;(session.append as unknown as StateAppend)('doublecheck/state', { enabled: target }, { ignorable: true })
    } else {
      setLocalOverride(session, target)
    }
    agent.inject(switchNotice(target, durable, prose))
    return {
      kind: 'success',
      text: target
        ? durable ? prose.commandOnDurable : prose.commandOnLocal
        : durable ? prose.commandOffDurable : prose.commandOffLocal,
    }
```

</details>

**依据 4 · 源码核查**：[src/grill/index.ts:465-510](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L465-L510)

checker调用与失败。

<details>
<summary>查看原文（46行）</summary>

```text
  if (spec === null || exec.agent === undefined) return null
  const engine = ctx.get('workflowEngine')
  if (engine === undefined) {
    ctx.logger.warn('dsh-doublecheck: verification skipped: the workflowEngine seam is not mounted')
    return null
  }
  let run: WorkflowRun
  try {
    run = engine.start({
      script: buildVerifyScript(config.verifyMode),
      meta: VERIFY_META,
      args: { spec, dimensions: [...VERIFY_DIMENSIONS] },
      subagentProvider: config.verifyProvider,
      maxTotalAgents: config.verifyMode === 'single' ? 1 : VERIFY_DIMENSIONS.length,
      parent: exec.agent,
      signal: exec.signal,
    })
  } catch (error) {
    // Invalid script/meta or an absent verify provider: verification did not
    // run, and the report states so instead of failing the report itself.
    ctx.logger.warn(`dsh-doublecheck: verification workflow rejected: ${String(error)}`)
    return null
  }
  try {
    const result = await run.result
    if (result.stopReason !== 'completed') return null
    const value = result.value as { checks?: unknown } | null | undefined
    if (value === null || value === undefined || !Array.isArray(value.checks)) return null
    const checks: VerifyCheck[] = []
    for (const check of value.checks as VerifyCheck[]) {
      if (!VERIFY_DIMENSIONS.includes(check.dimension)) continue
      checks.push(check)
    }
    // `proven` requires a verdict for every spec dimension: completeness is
    // judged here so a checker that silently dropped a dimension cannot
    // upgrade the delivery.
    const complete = VERIFY_DIMENSIONS.every(dimension => checks.some(check => check.dimension === dimension))
    return { checks, complete }
  } catch (error) {
    // A broken workflow engine must not fail the report call itself: the
    // delivery settles as unverified and the markdown says verification did
    // not run.
    ctx.logger.warn(`dsh-doublecheck: verification workflow failed: ${String(error)}`)
    return null
  } finally {
    await run.dispose()
```

</details>

#### 缺口

- 没有真实需求减少返工或成本收益对照。
  **影响**：只支持非关键小任务提醒/证据查看试用。
  **进一步探讨**：对照手工清单记录遗漏、误挡、人工修改与模型请求费用。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么改进值得最小对照？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是保留当前二元兼容字段，同时在读者最先看到的位置明确“全部必需项通过/有未验证项/已失败”的证据完备状态，并把kind:read的报告调用标明模型验证和写文件副作用。现有各phase skip与written已经保存信息，增量是避免用户只读deliverable或read卡片而误判，不假定代码把未知偷偷当已完成。

最小对照用review无服务、缺只读preset、报告写失败和全部通过四样本，比较用户是否能正确决定“还需什么证据、是否重跑、是否允许交付”，并统计多余提示/阅读时间。代价是两套verdict兼容、CI消费者迁移与更多状态；如果不降低误解却增加流程摩擦，应否定。独立业务验收仍由测试与用户负责，候选未实现不计本包既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/domain/gate.ts:799-808](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/domain/gate.ts#L799-L808)

二元裁决边界。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Derive the gate's binary decision: any enabled phase with a failing check
 * means rework. Warnings and skipped phases never flip the decision — a
 * skipped review keeps the report honest ("not reviewed") without inventing
 * a red light.
 * @param phases - the settled phase results.
 * @returns the gate verdict.
 */
export function deriveGateVerdict(phases: readonly GatePhaseResult[]): GateVerdict {
  return phases.some(phase => phase.enabled && phase.status === 'fail') ? 'rework' : 'deliverable'
```

</details>

**依据 2 · 源码核查**：[src/guard/gate.ts:594-608](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/guard/gate.ts#L594-L608)

CI文件路径派生与证据读取接口位置。

<details>
<summary>查看原文（15行）</summary>

```text
}

/** Derive the JSON CI-report path from the markdown report path. */
function ciReportPath(filePath: string): string {
  return filePath.endsWith('.md') ? `${filePath.slice(0, -3)}.json` : `${filePath}.json`
}

/** The settled dsh-eval report fold: evidence when the file parsed, else an honest reason. */
interface EvalRead {
  evidence: EvalReportEvidence | null
  reason: string
}

/**
 * Read and fold the dsh-eval report through the filesystem seam. A missing
```

</details>

**依据 3 · 源码核查**：[src/grill/index.ts:433-446](https://github.com/PerryLink/dsh-doublecheck/blob/0f80ced5367ba284c55131f138e1d4c7188779a3/src/grill/index.ts#L433-L446)

写报告但呈现read。

<details>
<summary>查看原文（14行）</summary>

```text
      const outcome = await writeReportFile(ctx, report, args.filePath ?? config.reportFile, exec)
      report.path = outcome.path
      report.written = outcome.written
      if (session !== undefined) {
        ctx.emit('doublecheck/report', { session, verdict: report.verdict, verification, path: report.path, written: report.written })
      }
      return report
    },
    presentCall(args) {
      return {
        card: 'generic',
        title: 'Assemble doublecheck report',
        kind: 'read',
        content: [{ type: 'text', text: args.verify === true ? 'verifying delivery' : 'folding session evidence' }],
```

</details>

#### 缺口

- 未证明用户实际误读频率或新状态收益。
  **影响**：仅候选，不能说产品价值已验证。
  **进一步探讨**：用四状态盲读对照测误判和额外阅读负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
