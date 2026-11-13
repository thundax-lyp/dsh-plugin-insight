# dsh-deep-research

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c0b329e](https://github.com/omdsh-dev/dsh-deep-research/tree/c0b329e02cd0195f810a7c3608cb58701a7fe0f1)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-deep-research)
<!-- END META -->

> **功能**：基于 DeepSeek Harness 工作流编排子题研究、补证、综合报告和可选审阅。

> **亮点**：[Q01](#research-q01) 的队列把研究、再派高优先级缺口和审阅组织到一个工具回执中。

> **主要限制**：[Q02](#research-q02) 的轮次上限可能让待处理题退出队列且不出现在计数里；工具成功不能用作覆盖验收。

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
  - [Q01 · 一个研究问题如何进入 DSH 工作流并生成可读报告？](#detail-section-11)
  - [Q02 · 为什么工作流 completed 仍可能漏掉原始问题？](#detail-section-12)
  - [Q03 · 怎么选预算和验收方式，什么改动可减少把部分结果当全覆盖？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要围绕明确决策问题搜集公开来源的研究人员，可用既有问题清单核对覆盖与引用。

用会话搜索工具逐题研究或手动并行，再由研究者检查未处理问题和引用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 研究编排 | 按题并行取证和追缺口 | 需 workflow 和模型；受轮次限制 |
| 报告与审阅 | 生成报告和可选审阅意见 | 应独立核查题目与引用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、workflows 和调用 Agent | 是 | 注册及提交工作流 | 回到手动研究 |
| 模型及来源访问能力 | 取证必需 | 支持各子题搜索与复核 | 用公开可达来源观察 |
| 明确题单和单轮预算 | 本建议要求 | 限制漏题与成本 | 保留逐题验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户检查 profile 并固定公开问题 | 确认工具权限与题目总数 |
| 观察 | 触发小范围研究 | 对比题单、报告和引用 |
| 退出 | 未覆盖时停止依赖回执 | 回到手工逐题和现有搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、模型和网络条件，费用未知 | 选择模型与工作流并准备题单 | 兼容未复现 |
| 持续 | 多 Agent 调用和搜索，单位费用未知 | 复核来源和题目覆盖 | 总工作量与成功率未知 |
| 失败恢复 | 重跑与补证开销未知 | 补回失败或未处理项 | 取消及部分结果待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多题调度 | 按并发和轮次处理 | 真实覆盖及吞吐 |
| 缺口跟进 | 模型报出的高优先级缺口入队 | 是否识别关键缺口 |
| 审阅 | 可附独立审查意见 | 纠错和漏判率 |

> **思考**：[Q02](#research-q02) 的轮次上限可能让待处理题退出队列且不出现在计数里；工具成功不能用作覆盖验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的队列把研究、再派高优先级缺口和审阅组织到一个工具回执中。

[Q01](#research-q01) 的静态脚本与结构化参数使调用边界较清楚；[Q02](#research-q02) 的回执没带未处理队列。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的轮次上限可能让待处理题退出队列且不出现在计数里；工具成功不能用作覆盖验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离 profile 小范围观察，按 [Q02](#research-q02) 逐题核对覆盖。不能复核来源时保留人工研究。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具挂载和脚本编排。来源准确率、覆盖、宿主装载及成本待验。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/types/index.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定包、真实 lib 工作流脚本和工具回执；未执行目标代码、安装、模型或网络取证。
- 下一步：隔离 profile 比较少题与超过容量的已知题单，对照来源失败、停止状态、回执覆盖和禁用行为。

**分析版本**

- **仓库**：[omdsh-dev/dsh-deep-research](https://github.com/omdsh-dev/dsh-deep-research)
- **版本号**：0.1.0（[固定提交 c0b329e](https://github.com/omdsh-dev/dsh-deep-research/tree/c0b329e02cd0195f810a7c3608cb58701a7fe0f1)）
- **版本日期**：2026-08-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提议返回逐题覆盖及停止原因，以容量超限和来源失败样本验证能否减少漏判。

隔离 profile 比较少题与超过容量的已知题单，对照来源失败、停止状态、回执覆盖和禁用行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 532 | 437 | 85 | — |
| .md | source | 1 | 123 | — | — | 1667 |
| .ts | source | 1 | 559 | 442 | 90 | — |
| .mjs | test | 1 | 605 | 504 | 68 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-deep-research/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-deep-research/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-deep-research/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有明确决策问题时，deep_research 能否让多子题研究、补证与审阅可控，怎样判断覆盖是否足够？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一个研究问题如何进入 DSH 工作流并生成可读报告？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

研究人员可以提交主题和用途，或给出明确问题清单。工具要求有当前调用 Agent，校验 depth 后用固定脚本文本和结构化参数启动 ctx.workflows。脚本分批让 Agent 研究问题，收集报告的高优先级缺口并追加新题，再选择由综合 Agent 写报告，或保留按问题组织的证据中间结果。额外审阅会作为意见附到报告后。与逐一在对话中手派研究和反查缺口相比，预算内排队与重派机制由脚本执行；搜索、模型和工作流宿主都是外部能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-18](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/package.json#L7-L18)

固定运行时默认导出为现有 lib/types/index.js。

<details>
<summary>查看原文（12行）</summary>

```text
  "main": "./lib/types/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/types/index.js"
    },
    "./package.json": "./package.json"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:31-44](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/package.json#L31-L44)

工具与工作流依赖及 bundle 补丁声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "^0.0.1",
    "@deepseek-ai/dsh-workflow": "^0.0.1",
    "cordis": "^4.0.0-rc.7"
  },
  "devDependencies": {
    "@types/node": "^22.20.0",
    "typescript": "^6.0.3"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:6-8](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/cordis.patch.yml#L6-L8)

按名称加载扩展包。

```text
- insert:
    - id: dsh-deep-research
      name: '@dsh-external/dsh-deep-research'
```

**依据 4 · 源码核查**：[lib/types/index.js:360-378](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L360-L378)

实际注册 deep_research。

<details>
<summary>查看原文（19行）</summary>

```text
/** Apply the plugin: register the `deep_research` tool on `ctx.tools`. */
export function apply(ctx, config = {}) {
    const subagentProvider = config.subagentProvider ?? undefined;
    const plannerModel = config.plannerModel ?? undefined;
    const researcherModel = config.researcherModel ?? undefined;
    const synthesizerModel = config.synthesizerModel ?? undefined;
    const reviewerModel = config.reviewerModel ?? synthesizerModel;
    // null/undefined both mean "leave the engine default" (old JS contract:
    // positiveInt(..., undefined, ...) omitted the key — keep it omitted).
    const maxTotalAgents = config.maxTotalAgents === undefined || config.maxTotalAgents === null
        ? undefined
        : positiveInt(config.maxTotalAgents, 0, 'maxTotalAgents');
    const maxParallel = config.maxParallel === undefined
        ? 4
        : positiveInt(config.maxParallel, 4, 'maxParallel');
    ctx.tools.register(defineTool({
        name: 'deep_research',
        description: '深度研究编排工具（Deep Research Orchestrator，基于 DSH 官方 workflow 引擎，按控制论与'
            + '信息论设计的自适应流程）。当用户要求对复杂主题做深度研究/调研（需要多源信息搜集、'
```

</details>

**依据 5 · 源码核查**：[lib/types/index.js:431-460](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L431-L460)

验证当前 Agent、深度并启动 workflows。

<details>
<summary>查看原文（30行）</summary>

```text
        async execute(args, exec) {
            const parent = exec.agent;
            if (!parent) {
                throw new Error('deep_research requires a calling agent (exec.agent was undefined)');
            }
            const topic = String(args.topic).trim();
            if (topic.length === 0)
                throw new Error('deep_research: topic must not be empty');
            const purpose = typeof args.purpose === 'string' && args.purpose.trim().length > 0
                ? args.purpose.trim()
                : undefined;
            const depth = args.depth === undefined ? 2 : positiveInt(args.depth, 2, 'depth');
            if (depth > 3) {
                throw new Error('dsh-deep-research: depth must be 1, 2 or 3 (1=初步，2=深入，3=穷尽)');
            }
            const synthesize = args.synthesize !== false;
            const review = args.review === true;
            const questions = parseQuestionList(args.questions);
            const models = {};
            if (plannerModel !== undefined)
                models.planner = plannerModel;
            if (researcherModel !== undefined)
                models.researcher = researcherModel;
            if (synthesizerModel !== undefined)
                models.synthesizer = synthesizerModel;
            if (reviewerModel !== undefined)
                models.reviewer = reviewerModel;
            const run = ctx.workflows.start({
                script: SCRIPT,
                meta: {
```

</details>

**依据 6 · 源码核查**：[lib/types/index.js:253-284](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L253-L284)

批次、并行执行、收集缺口及队列更新。

<details>
<summary>查看原文（32行）</summary>

```text
const rounds = []
let pending = subs.slice()
let round = 0
while (pending.length > 0 && round < depth + 1) {
  round += 1
  phase('研究·第' + round + '轮')
  const batch = pending.slice(0, maxParallel)
  const found = await parallel(batch.map((q, i) => () => agent(researcherPrompt(q, round, round > 1), {
    label: '研究' + (i + 1) + '·第' + round + '轮',
    phase: '研究·第' + round + '轮',
    schema: RESEARCHER_SCHEMA,
    ...(M.researcher ? { model: M.researcher } : {}),
  })))
  batch.forEach((q, i) => {
    if (found[i]) results[q.question] = found[i]
  })
  rounds.push(batch.map((q, i) => ({ q, f: found[i] })))

  // 收敛评估：收集本轮所有 high-priority 缺口 → 下一轮动态补充。
  const leads = []
  const seen = new Set()
  for (const item of batch) {
    const f = results[item.question]
    if (!f || !Array.isArray(f.gaps)) continue
    for (const g of f.gaps) {
      if (g.priority !== 'high') continue
      if (seen.has(g.aspect) || leads.length >= maxParallel) continue
      seen.add(g.aspect)
      leads.push({ question: g.aspect, followUp: true })
    }
  }
  pending = [...pending.slice(maxParallel), ...leads]
```

</details>

**依据 7 · 源码核查**：[lib/types/index.js:290-311](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L290-L311)

按实际完成批次形成中间结果。

<details>
<summary>查看原文（22行）</summary>

```text
const ordered = []
const seenQ = new Set()
for (const batch of rounds) {
  for (const { q, f } of batch) {
    if (seenQ.has(q.question)) continue
    seenQ.add(q.question)
    ordered.push({ q, f })
  }
}
const parts = []
let okCount = 0
for (const { q, f } of ordered) {
  if (f) okCount += 1
  parts.push(f ? renderFindings(q, f) : '## ' + q.question + '\n\n> 该子问题研究失败（子代理未返回结构化证据）')
}
const totalRounds = rounds.length
const intermediate = '# ' + topic + ' — 深度研究中间结果（证据状态）\n\n> 子问题 ' + ordered.length
  + ' 个，完成 ' + okCount + ' 个，研究轮次 ' + totalRounds + ' 轮。'
  + (planText ? '\n\n' + planText : '') + '\n\n' + parts.join('\n\n---\n\n')

let report = intermediate
if (synthesize) {
```

</details>

**依据 8 · 源码核查**：[lib/types/index.js:477-495](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L477-L495)

传父 Agent 与信号并等待工作流结果。

<details>
<summary>查看原文（19行）</summary>

```text
                args: {
                    topic,
                    ...(purpose !== undefined ? { purpose } : {}),
                    ...(questions.length > 0 ? { questions } : {}),
                    depth,
                    synthesize,
                    review,
                    maxParallel,
                    ...(Object.keys(models).length > 0 ? { models } : {}),
                },
                ...(subagentProvider !== undefined ? { subagentProvider } : {}),
                ...(maxTotalAgents !== undefined ? { maxTotalAgents } : {}),
                parent,
                signal: exec.signal,
            });
            const result = await run.result;
            await run.dispose();
            if (result.stopReason !== 'completed') {
                throw new Error(`deep_research: workflow run ${result.stopReason}${result.error !== undefined ? ` (${result.error})` : ''}`);
```

</details>

#### 缺口

- 目标 profile 的 web_search/web_fetch 和模型权限
  **影响**：影响真实取证和工具可用性
  **进一步探讨**：在隔离 profile 使用公开主题核对各 Agent 的工具和可点击原件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么工作流 completed 仍可能漏掉原始问题？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

循环最多 depth+1 轮，每轮最多 maxParallel 项，默认并发 4。队列优先保留上一轮未处理项，再追加该轮模型标记为高优先级的缺口。若 depth=1 且初始问题数大于 8，剩余题在两轮后仍可能留在 pending。报告和失败计数从 rounds 中实际尝试的去重问题得到，不把残余 pending 纳入；工具只要求工作流 stopReason 为 completed 且有 report，最终 ok: true 只回报告和可选审查。审查调用可以抽查来源，意见仍独立输出，未自动纠正报告。这条实现依赖模型按优先级报缺口，固定代码没有测量信息增益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/types/index.js:255-287](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L255-L287)

固定轮次上限和待处理队列。

<details>
<summary>查看原文（33行）</summary>

```text
let round = 0
while (pending.length > 0 && round < depth + 1) {
  round += 1
  phase('研究·第' + round + '轮')
  const batch = pending.slice(0, maxParallel)
  const found = await parallel(batch.map((q, i) => () => agent(researcherPrompt(q, round, round > 1), {
    label: '研究' + (i + 1) + '·第' + round + '轮',
    phase: '研究·第' + round + '轮',
    schema: RESEARCHER_SCHEMA,
    ...(M.researcher ? { model: M.researcher } : {}),
  })))
  batch.forEach((q, i) => {
    if (found[i]) results[q.question] = found[i]
  })
  rounds.push(batch.map((q, i) => ({ q, f: found[i] })))

  // 收敛评估：收集本轮所有 high-priority 缺口 → 下一轮动态补充。
  const leads = []
  const seen = new Set()
  for (const item of batch) {
    const f = results[item.question]
    if (!f || !Array.isArray(f.gaps)) continue
    for (const g of f.gaps) {
      if (g.priority !== 'high') continue
      if (seen.has(g.aspect) || leads.length >= maxParallel) continue
      seen.add(g.aspect)
      leads.push({ question: g.aspect, followUp: true })
    }
  }
  pending = [...pending.slice(maxParallel), ...leads]
  // 队列语义：本轮未处理的子问题（超出 maxParallel 的部分）留在队首，
  // 下一轮继续研究；high-priority 缺口作为补充问题排在它们之后。
  // 边际信息增益收敛：本轮没有产出任何新的 high-priority 缺口 → 循环自然结束。
```

</details>

**依据 2 · 源码核查**：[lib/types/index.js:290-307](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L290-L307)

报告只计尝试过的题。

<details>
<summary>查看原文（18行）</summary>

```text
const ordered = []
const seenQ = new Set()
for (const batch of rounds) {
  for (const { q, f } of batch) {
    if (seenQ.has(q.question)) continue
    seenQ.add(q.question)
    ordered.push({ q, f })
  }
}
const parts = []
let okCount = 0
for (const { q, f } of ordered) {
  if (f) okCount += 1
  parts.push(f ? renderFindings(q, f) : '## ' + q.question + '\n\n> 该子问题研究失败（子代理未返回结构化证据）')
}
const totalRounds = rounds.length
const intermediate = '# ' + topic + ' — 深度研究中间结果（证据状态）\n\n> 子问题 ' + ordered.length
  + ' 个，完成 ' + okCount + ' 个，研究轮次 ' + totalRounds + ' 轮。'
```

</details>

**依据 3 · 源码核查**：[lib/types/index.js:329-358](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L329-L358)

可选审阅及脚本计数。

<details>
<summary>查看原文（30行）</summary>

```text
let reviewText = null
if (review) {
  phase('审查')
  reviewText = await agent(
    '你是研究审阅代理。你的角色是信道纠错：对报告做对抗性审查，找出证据链中的噪声与错误。若你的工具集中有 web_fetch，可用它抽查可疑来源 URL 是否真实可达、内容是否支撑引用；没有则依据 web_search 可得信息评估来源可信度。\n\n'
    + '审查维度：\n'
    + '1. 引用纠错：URL 无法访问或与结论无关？引用是否支撑对应观点？（幻觉来源 = 信道噪声，必须标出）\n'
    + '2. 覆盖度审计：对照规划阶段声明的信息维度，哪些维度证据不足或完全缺失？（Ashby 必要多样性：维度缺失 = 控制器多样性不足 = 盲区）\n'
    + '3. 信息矛盾：不同来源冲突处是否被标注并保留？\n'
    + '4. 时效性：关键数据是否过时？\n'
    + '5. 过度自信：是否有低置信结论被表述为确定事实？\n'
    + (planText ? '\n规划阶段声明：\n' + planText : '')
    + '\n\n只输出审查意见（Markdown，中文），不要改写报告本身：\n## 审查意见\n### 可疑来源（如有）\n### 覆盖盲区（如有）\n### 信息矛盾\n### 过度自信项\n### 需要补充研究的最高优先级缺口（如有，供下一步定向研究）\n### 总体评估与修正建议\n\n报告主题：' + topic + '\n\n以下是待审查报告：\n\n' + report,
    {
      label: '审查',
      phase: '审查',
      ...(M.reviewer ? { model: M.reviewer } : {}),
    },
  )
  if (reviewText) reviewText = '## 对抗性审查意见\n\n' + reviewText
}

return {
  report,
  review: reviewText,
  rounds: totalRounds,
  subquestions: ordered.length,
  completed: okCount,
  failed: ordered.length - okCount,
}
```

</details>

**依据 4 · 源码核查**：[lib/types/index.js:492-508](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L492-L508)

工具成功门槛和输出丢弃计数。

<details>
<summary>查看原文（17行）</summary>

```text
            const result = await run.result;
            await run.dispose();
            if (result.stopReason !== 'completed') {
                throw new Error(`deep_research: workflow run ${result.stopReason}${result.error !== undefined ? ` (${result.error})` : ''}`);
            }
            const raw = result.value;
            if (raw === null || typeof raw !== 'object') {
                throw new Error('deep_research: workflow returned no report');
            }
            const record = raw;
            if (typeof record.report !== 'string') {
                throw new Error('deep_research: workflow returned no report');
            }
            return {
                ok: true,
                report: record.report,
                ...(typeof record.review === 'string' ? { review: record.review } : {}),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎么选预算和验收方式，什么改动可减少把部分结果当全覆盖？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先确认固定包的默认 lib 入口可加载，兼容 profile 启用 tools、workflows、可用模型和公共网络取证能力。作者 README 声称源码入口，固定 package.json 实际指向现成 lib，应以目标包内容复查。试用只给少量公开、有已知答案的问题，设清楚并发和深度，对照原始题、来源可达性、引用支持和人工补证耗时。maxTotalAgents 为空会交回工作流默认，不能据此承诺预算；费用按所用模型和请求计，当前未测。可检验的改动是返回未处理、失败、待补证和已完成的题列表及停止原因。用超过容量和故意断开来源的对照检查用户能否更快识别缺题，同时保留人工逐题核查作为退路。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-43](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/README.md#L32-L43)

作者声称源码入口，与固定包默认导出存在差异。

<details>
<summary>查看原文（12行）</summary>

````text
## 开发与检查

```bash
pnpm install        # 仅 typescript/@types/node（typecheck 用）
pnpm run typecheck  # tsc -b，类型从 sibling deepseek-harness checkout 解析
```

源码即运行时：包入口直接指向 `src/index.ts`，无构建步骤。profile 安装的副本位于
node_modules 下，由 dsh 源码启动器的 tsx hook 加载（Node 原生类型剥离拒绝
node_modules 内的文件）；源码 checkout 在 node_modules 外直跑时也可用 Node ≥22.18
原生剥离。要求 erasable-only TS 语法（无 enum/命名空间等），
`node --test`/`pnpm typecheck` 会挡住不可移植写法。
````

</details>

**依据 2 · 源码核查**：[package.json:7-17](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/package.json#L7-L17)

实际包入口与 Node 版本。

<details>
<summary>查看原文（11行）</summary>

```text
  "main": "./lib/types/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/types/index.js"
    },
    "./package.json": "./package.json"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 3 · 源码核查**：[lib/types/index.js:361-374](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L361-L374)

子代理模型与预算配置。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
    const subagentProvider = config.subagentProvider ?? undefined;
    const plannerModel = config.plannerModel ?? undefined;
    const researcherModel = config.researcherModel ?? undefined;
    const synthesizerModel = config.synthesizerModel ?? undefined;
    const reviewerModel = config.reviewerModel ?? synthesizerModel;
    // null/undefined both mean "leave the engine default" (old JS contract:
    // positiveInt(..., undefined, ...) omitted the key — keep it omitted).
    const maxTotalAgents = config.maxTotalAgents === undefined || config.maxTotalAgents === null
        ? undefined
        : positiveInt(config.maxTotalAgents, 0, 'maxTotalAgents');
    const maxParallel = config.maxParallel === undefined
        ? 4
        : positiveInt(config.maxParallel, 4, 'maxParallel');
```

</details>

**依据 4 · 源码核查**：[lib/types/index.js:477-490](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L477-L490)

可选参数透传，宿主负责执行。

<details>
<summary>查看原文（14行）</summary>

```text
                args: {
                    topic,
                    ...(purpose !== undefined ? { purpose } : {}),
                    ...(questions.length > 0 ? { questions } : {}),
                    depth,
                    synthesize,
                    review,
                    maxParallel,
                    ...(Object.keys(models).length > 0 ? { models } : {}),
                },
                ...(subagentProvider !== undefined ? { subagentProvider } : {}),
                ...(maxTotalAgents !== undefined ? { maxTotalAgents } : {}),
                parent,
                signal: exec.signal,
```

</details>

**依据 5 · 源码核查**：[lib/types/index.js:350-358](https://github.com/omdsh-dev/dsh-deep-research/blob/c0b329e02cd0195f810a7c3608cb58701a7fe0f1/lib/types/index.js#L350-L358)

脚本已有统计但无完整待处理列表。

```text

return {
  report,
  review: reviewText,
  rounds: totalRounds,
  subquestions: ordered.length,
  completed: okCount,
  failed: ordered.length - okCount,
}
```

#### 缺口

- 宿主是否支持实际版本及模型费用与终止行为
  **影响**：限制当前采用和成本判断
  **进一步探讨**：在隔离 profile 逐题核对任务清单及成本账单，禁用后恢复手工研究

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
