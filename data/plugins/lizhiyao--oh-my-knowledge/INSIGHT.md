# Oh My Knowledge

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9e7da88](https://github.com/lizhiyao/oh-my-knowledge/tree/9e7da88d272b8f19d9423026c28d6a57f90f3e95)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lizhiyao/oh-my-knowledge) [![npm 30d 416](https://img.shields.io/static/v1?label=npm+30d&message=416&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/oh-my-knowledge) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/oh-my-knowledge)
<!-- END META -->

> **功能**：面向 AI 工作记录的知识提取、维护和载体评测工具集。

> **亮点**：[Q01](#research-q01) 描述记录、知识维护和评测的集成；[Q02](#research-q02) 给出来源覆盖决策和版本检查的源码依据。

> **主要限制**：[Q03](#research-q03) 指出模型材料、本地代码执行和无认证服务边界；[Q04](#research-q04) 说明试用及维护成本未知。

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
  - [Q01 · 面向谁，较普通记录和独立评测增加了什么？](#detail-section-11)
  - [Q02 · 来源审查和宿主连接如何工作？](#detail-section-12)
  - [Q03 · 数据、执行与网络暴露边界是什么？](#detail-section-13)
  - [Q04 · 试用和持续维护的成本及退出条件是什么？](#detail-section-14)
  - [Q05 · 什么可检验的改进能增强载体使用证据？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人和开发者从工作记录整理知识，维护知识载体并对比版本。

普通笔记、人工来源复核及独立评测可以完成类似工作；本项目将其组织为带引用和版本的流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 知识候选 | 从选定记录提取 | 模型调用和人工复核 |
| 来源审查 | 记录冲突与版本 | 未运行验证 |
| 载体评测 | 比较版本 | 不证明实际生效 |
| DSH 接入 | 选择会话 | 未在宿主验证 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| Node >=22 | 必需 | 运行工具 | 无法按声明运行 |
| 认证模型运行时 | 提取需要 | 生成候选 | 无法进行模型提取 |
| 可写工作区 | 维护需要 | 保存知识和载体 | 无法持续维护 |
| DSH | 宿主集成需要 | 访问会话 | 不能使用该宿主路径 |

| 步骤 | 动作 | 判据 |
|---|---|---|
| 准备 | 选择可信非敏感记录 | 审查材料和模型端点 |
| 提取 | 选择轮次并调用模型 | 复核候选和来源 |
| 维护 | 修订知识并显式保存载体 | 对照引用和版本 |
| 评测 | 固定任务及模型比较 | 检查失败案例和不确定性 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | Node、存储和模型 | 配置及筛选材料 | 费用未知 |
| 持续 | 模型和评测调用 | 复核及维护用例 | 节省时间未知 |
| 恢复 | 备份存储 | 迁移和恢复 | Beta 契约可能变化 |

| 效果 | 支持证据 | 未知 |
|---|---|---|
| 可审查来源 | 决策冲突及版本检查源码 | 端到端质量 |
| 知识维护 | 作者描述和案例 | 实际跨 Agent 复用 |
| 独立比较 | 文档描述固定模型和用例 | 产品效果和因果 |

> **思考**：[Q03](#research-q03) 指出模型材料、本地代码执行和无认证服务边界；[Q04](#research-q04) 说明试用及维护成本未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 描述记录、知识维护和评测的集成；[Q02](#research-q02) 给出来源覆盖决策和版本检查的源码依据。

[Q02](#research-q02) 来源决策有冲突、幂等和版本保护；[Q03](#research-q03) 对本地服务和执行环境仍须审慎配置。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指出模型材料、本地代码执行和无认证服务边界；[Q04](#research-q04) 说明试用及维护成本未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用可信非敏感材料复核来源和模型目标；无法验证来源或执行环境不可信时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向静态核查固定源码及文档；未运行目标、模型、服务、宿主或评测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/knowledge/source-review-history.ts、src/dsh-plugin/index.ts、src/cli/commands/studio.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根包入口、知识来源审查、DSH 会话选择和 Studio 参数；未全面审计模型调用、存储、评测执行及前端。
- 下一步：隔离环境固定任务、模型和载体版本，追踪来源和保存记录，检查网络、服务监听和恢复。

**分析版本**

- **仓库**：[lizhiyao/oh-my-knowledge](https://github.com/lizhiyao/oh-my-knowledge)
- **版本号**：1.0.0-beta.14（[固定提交 9e7da88](https://github.com/lizhiyao/oh-my-knowledge/tree/9e7da88d272b8f19d9423026c28d6a57f90f3e95)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 建议关联载体实际使用与独立结果，以对照验证价值。

隔离环境固定任务、模型和载体版本，追踪来源和保存记录，检查网络、服务监听和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 194 | 23760 | — | — | 455793 |
| .ts | source | 951 | 174138 | 158661 | 6442 | — |
| .mjs | source | 15 | 1261 | 1155 | 52 | — |
| .md | example | 44 | 1207 | — | — | 14606 |
| .mjs | example | 31 | 4759 | 4438 | 125 | — |
| .tsx | source | 89 | 9053 | 8619 | 183 | — |
| .ts | test | 569 | 145298 | 134196 | 2755 | — |
| .ts | example | 7 | 994 | 935 | 12 | — |
| .tsx | test | 35 | 6617 | 6056 | 241 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/lizhiyao/oh-my-knowledge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=66&color=737b86&logo=github)](https://github.com/lizhiyao/oh-my-knowledge/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=66&color=737b86&logo=github)](https://github.com/lizhiyao/oh-my-knowledge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查知识维护与评测工作流、来源审查及运行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，较普通记录和独立评测增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向维护 AI 知识和载体的个人及开发者，项目把工作记录候选提取、来源复核、知识修订、载体生成和独立版本比较组织到一个工作流。普通笔记及独立评测也可完成这些环节，增量在关联记录和维护流程；并无证据证明时间节省或跨 Agent 复用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L9-L17)

用途及版本边界。

```text
**Observe. Measure. Know.**

OMK helps people and agents build, maintain, and reuse valuable knowledge: turn insights, methods, and the reasoning behind decisions from real work and collaboration into readable, traceable knowledge that can be continually revised and used by people and different agents in future tasks.

For agent users and AI application developers, extract candidates from selected work records, review sources and conditions, and keep accumulating and revising knowledge. Select knowledge for a task or generate carriers such as skills and prompts. When you need evidence about a specific change, compare artifact versions under controlled conditions independently. See the guides below for version availability and integration boundaries.

## Start with local work records

Requires **Node.js ≥22**. The library, artifact authoring, and change review described here require **1.0.0-beta.14 or later**, from the **`@next` channel**; npm `latest` is a separate stable channel. Beta.13 does not include this maintenance UI. Strict extraction, native outcome archives, bounded retries, model-assisted cross-window link review and study review belong to later main development; a Beta.14 version alone does not establish their availability. See the [capability tiers](docs/guides/knowledge/extract-knowledge.md#availability) for release and source boundaries. Read the [migration guide](docs/guides/maintenance/v1-preview-migration.md) before upgrading an older installation.
```

**依据 2 · 作者声明**：[README.md:25-44](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L25-L44)

工作流与效果声明边界。

<details>
<summary>查看原文（20行）</summary>

```text
Open the local URL returned by the command and inspect an existing Codex task and its source records. This step makes no model call; Studio offers source and collection guidance when no conversations exist. Follow the [observation guide](docs/guides/observe/observe-production.md) for other log sources.

Next, choose a conversation and turns under “Knowledge → Candidate review”, inspect the material to send, and extract candidates. **Extraction calls a model**, so prepare an [authenticated runtime](docs/reference/integration/executors.md#prerequisites) first. Link sources in the library, revise outdated content, then explicitly generate and save an artifact. Its detail view lets you review knowledge changes and old and new references. Follow the [knowledge maintenance workflow](docs/guides/knowledge/extract-knowledge.md).

## When knowledge changes, review its artifacts

![SDK historical artifact changes in the Studio reader, captured from the Chinese case](./docs/public/sdk-maintenance-review.png)

In the existing SDK maintenance case, old statements were limited to their historical context, one item was discarded, and another gained a clearer boundary for its static observations. v4 retains three historical references and shows two changes; v5 explicitly selects two currently retained items, while old content and references remain available. [Read the case, sources, and review steps](docs/guides/knowledge/sdk-maintenance-case.md).

This verifies maintenance and reference behavior. It does not verify dynamic SDK effects, time saved, or cross-agent reuse benefits. Retaining knowledge, saving artifacts, using them, and verifying effects are separate records. Complete automatic management and reuse across agents remain in development.

## Continue with your task

- **Compare two artifacts directly**: preview the plan in the [evaluation quickstart](docs/guides/evaluation/quickstart-skill-eval.md), configure a runtime, then call the model. Fix models and cases, record execution conditions, and inspect decisions, uncertainty, and failed-case evidence.
- **Embed evaluation in a service**: begin with the [offline Node example](docs/guides/integration/eval-runtime.md), complete a traceable comparison, then choose models and configuration as needed.
- **Use OMK inside agents or DSH**: [install the official Skill](docs/guides/evaluation/quickstart-skill-eval.md#use-inside-an-agent), [submit MCP feedback](docs/guides/integration/mcp-integration.md), or use the [DSH host plugin](docs/reference/integration/executors.md#deepseek-harness-prefer-the-host-plugin).
- **Verify an agent’s file changes**: use independent checks in [local task acceptance](docs/guides/evaluation/local-tasks.md), or screen candidate versions with [iterative improvement](docs/guides/evaluation/auto-improve-skills.md).

Starter cases check the workflow; `UNDERPOWERED` is expected. Release decisions need your own domain cases and independent evidence. Observation signals do not establish causality; passing an evaluation does not mean an artifact took effect or a version was published.
```

</details>

**依据 3 · 源码核查**：[package.json:7-40](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/package.json#L7-L40)

库、CLI、MCP 与 DSH 入口。

<details>
<summary>查看原文（34行）</summary>

```text
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./eval-core": {
      "types": "./dist/eval-core/index.d.ts",
      "import": "./dist/eval-core/index.js"
    },
    "./eval-core/schemas/*": "./dist/eval-core/contracts/schemas/*",
    "./eval-samples/schemas/v3/*": "./dist/eval-workflows/inputs/contracts/schemas/v3/*",
    "./mcp": {
      "types": "./dist/mcp/index.d.ts",
      "import": "./dist/mcp/index.js"
    },
    "./dsh-plugin": {
      "types": "./dist/dsh-plugin/index.d.ts",
      "import": "./dist/dsh-plugin/index.js"
    }
  },
  "bin": {
    "omk": "dist/cli/index.js",
    "omk-mcp": "dist/mcp/stdio.js"
  },
  "engines": {
    "node": ">=22"
  },
  "files": [
    "dist/"
  ],
  "dsh": {
    "bundle": {
      "patch": "./dist/dsh-plugin/cordis.patch.yml"
    }
```

</details>

#### 缺口

- 没有相同任务的人工流程对照
  **影响**：不能量化效率和复用收益
  **进一步探讨**：固定样本比较人工记录、修订及实际使用效果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源审查和宿主连接如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

作者描述选择会话和轮次、审查发送材料、模型提取候选，之后链接来源、修订并显式保存载体。来源覆盖决策代码排除撤销和显式取代事件，对冲突意见标为 disputed，要求精确且非冲突的 proceed_with_limits 才通过断言；写入以 requestId 幂等并检查 generation 和 head。DSH 适配代码列出其他已结束 session 并读取选定组；这只是固定源码路径，尚未验证完整运行链。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-27](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L25-L27)

候选提取和显式保存。

```text
Open the local URL returned by the command and inspect an existing Codex task and its source records. This step makes no model call; Studio offers source and collection guidance when no conversations exist. Follow the [observation guide](docs/guides/observe/observe-production.md) for other log sources.

Next, choose a conversation and turns under “Knowledge → Candidate review”, inspect the material to send, and extract candidates. **Extraction calls a model**, so prepare an [authenticated runtime](docs/reference/integration/executors.md#prerequisites) first. Link sources in the library, revise outdated content, then explicitly generate and save an artifact. Its detail view lets you review knowledge changes and old and new references. Follow the [knowledge maintenance workflow](docs/guides/knowledge/extract-knowledge.md).
```

**依据 2 · 源码核查**：[src/knowledge/source-review-history.ts:165-180](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/src/knowledge/source-review-history.ts#L165-L180)

来源覆盖冲突及通过条件。

<details>
<summary>查看原文（16行）</summary>

```text
}
/** Explicit supersession/revocation only. Newer time and model agreement never select truth. */
export function selectSourceCoverageDecision(history: SourceCoverageEnvelope | undefined, ref: SourceCoverageRef) {
  if (history) validateSourceCoverageHistory(history);
  if (history && history.coverageId !== ref.coverageId) throw new Error('Source decision selection identity conflict.');
  const inactive = new Set(history?.events.flatMap(event => event.eventKind === 'decision' ? event.decision.supersedesEventIds : event.eventKind === 'revocation' ? [event.targetEventId] : []) ?? []);
  const events = history?.events.filter((event): event is Extract<SourceCoverageEnvelope['events'][number], { eventKind: 'decision' }> =>
    event.eventKind === 'decision' && same(event.decision.coverageRef, ref) && !inactive.has(event.eventId)) ?? [];
  const opinions = new Set(events.map(event => canonicalJson({ decisionKind: event.decision.decisionKind,
    dispositions: [...event.decision.dispositions].sort((a, b) => a.unresolvedId.localeCompare(b.unresolvedId)).map(({ unresolvedId, disposition }) => ({ unresolvedId, disposition })) })));
  const status = !events.length ? 'not_reviewed' as const : opinions.size > 1 ? 'disputed' as const : events[0].decision.decisionKind;
  return { status, events };
}
export function assertSourceCoverageDecision(history: SourceCoverageEnvelope, ref: SourceCoverageDecisionRef): void {
  const selected = selectSourceCoverageDecision(history, ref.coverageRef);
  if (selected.status !== 'proceed_with_limits' || !selected.events.some(event => event.eventId === ref.eventId && sameBinding(event.decision, bindingOf(ref)))) throw new Error('An active nonconflicting exact source coverage decision is required.');
```

</details>

**依据 3 · 源码核查**：[src/knowledge/source-review-history.ts:189-209](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/src/knowledge/source-review-history.ts#L189-L209)

幂等和版本冲突检查。

<details>
<summary>查看原文（21行）</summary>

```text
export function applySourceLedgerWrite(existing: SourceLedgerEnvelope | undefined, input: SourceLedgerWrite, actorInput: KnowledgeActor, namespace: string, commandDigest: string, at: string): SourceLedgerEnvelope {
  const command = SourceLedgerWriteSchema.parse(input), actor = SourceReviewActorSchema.parse(actorInput);
  if (existing) { validateSourceLedgerHistory(existing); if (existing.namespace !== namespace || existing.ledgerId !== command.ledgerId) throw new Error('Source ledger identity conflict.'); }
  const receipt = existing?.receipts.find(receipt => receipt.requestId === command.requestId);
  if (receipt) { if (receipt.commandDigest !== commandDigest) throw new Error('Source review idempotency conflict.'); return existing!; }
  if ((existing?.generation ?? 0) !== command.expectedGeneration || (existing?.writeHeadEventId ?? null) !== command.expectedHeadEventId) throw new Error('Source review revision conflict.');
  const next = SourceLedgerEnvelopeSchema.parse({ storeKind: 'knowledge-source-ledger-history', schemaVersion: 1, namespace, ledgerId: command.ledgerId,
    generation: command.expectedGeneration + 1, writeHeadEventId: command.requestId, events: [...(existing?.events ?? []), { eventKind: 'analysis', eventId: command.requestId, parentEventId: command.expectedHeadEventId, actor, at, revision: command.revision }],
    receipts: [...(existing?.receipts ?? []), { requestId: command.requestId, commandDigest, committedGeneration: command.expectedGeneration + 1, eventId: command.requestId }] });
  validateSourceLedgerHistory(next); return next;
}
export function applySourceCoverageWrite(existing: SourceCoverageEnvelope | undefined, input: SourceCoverageWrite, actorInput: KnowledgeActor, namespace: string, commandDigest: string, at: string): SourceCoverageEnvelope {
  const command = SourceCoverageWriteSchema.parse(input), actor = SourceReviewActorSchema.parse(actorInput);
  if (existing) { validateSourceCoverageHistory(existing); if (existing.namespace !== namespace || existing.coverageId !== command.coverageId) throw new Error('Source coverage identity conflict.'); }
  const receipt = existing?.receipts.find(receipt => receipt.requestId === command.requestId);
  if (receipt) { if (receipt.commandDigest !== commandDigest) throw new Error('Source review idempotency conflict.'); return existing!; }
  if ((existing?.generation ?? 0) !== command.expectedGeneration || (existing?.writeHeadEventId ?? null) !== command.expectedHeadEventId) throw new Error('Source review revision conflict.');
  const details = command.commandKind === 'append_analysis' ? { eventKind: 'analysis', revision: command.revision }
    : command.commandKind === 'record_decision' ? { eventKind: 'decision', decision: command.decision } : { eventKind: 'revocation', targetEventId: command.targetEventId, reason: command.reason };
  const next = SourceCoverageEnvelopeSchema.parse({ storeKind: 'knowledge-source-coverage-history', schemaVersion: 1, namespace, coverageId: command.coverageId,
    generation: command.expectedGeneration + 1, writeHeadEventId: command.requestId, events: [...(existing?.events ?? []), { ...details, eventId: command.requestId, parentEventId: command.expectedHeadEventId, actor, at }],
```

</details>

**依据 4 · 源码核查**：[src/dsh-plugin/index.ts:225-257](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/src/dsh-plugin/index.ts#L225-L257)

DSH 会话选择与读取。

<details>
<summary>查看原文（33行）</summary>

```text
async function executeObserveCommand(
  ctx: DshPluginContextLike,
  invocation: DshCommandInvocationLike,
  sessionId: string | undefined,
  state: DshObserveState,
): Promise<DshCommandResultLike> {
  const persistence = persistenceFor(ctx);
  if (!sessionId) {
    const candidates = await listDshObserveCandidates(persistence, {
      excludeSessionId: String(invocation.agent.session.id),
      signal: invocation.signal,
    });
    if (candidates.length === 0) {
      return {
        kind: 'success',
        text: '没有找到可观测的已结束 DSH session。完成一个任务后再运行 /omk observe。',
      };
    }
    return {
      kind: 'success',
      text: [
        '最近可观测的 DSH session：',
        ...candidates.map((candidate) => (
          `- ${candidate.sessionId}　${candidate.status}　${candidate.createdAt}${candidate.cwd ? `　${candidate.cwd}` : ''}`
        )),
        '',
        '查看轨迹：/omk observe <session-id>',
      ].join('\n'),
    };
  }
  const group = await readDshObservedGroup(persistence, sessionId, invocation.signal);
  const selected = group.traces.find((trace) => trace.session.runId === sessionId);
  if (!selected) throw new Error(`DSH session 一致快照缺少目标 session：${sessionId}。`);
```

</details>

#### 缺口

- 未运行提取、来源复核、保存或 DSH 宿主
  **影响**：无法验证端到端行为或模型输出质量
  **进一步探讨**：在隔离工作区固定模型和输入并追踪引用、版本与决策。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 数据、执行与网络暴露边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

查看会话无需模型调用，而提取需要已认证运行时并向模型发送所选材料。项目提醒本地任务、验证器和自定义断言执行代码，工作区副本不是沙箱；本地报告服务无认证，不应公开。Studio 参数说明默认监听 127.0.0.1，可显式向网络开放；这些是文档和参数声明，未实测数据流与隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-27](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L25-L27)

模型调用时点。

```text
Open the local URL returned by the command and inspect an existing Codex task and its source records. This step makes no model call; Studio offers source and collection guidance when no conversations exist. Follow the [observation guide](docs/guides/observe/observe-production.md) for other log sources.

Next, choose a conversation and turns under “Knowledge → Candidate review”, inspect the material to send, and extract candidates. **Extraction calls a model**, so prepare an [authenticated runtime](docs/reference/integration/executors.md#prerequisites) first. Link sources in the library, revise outdated content, then explicitly generate and save an artifact. Its detail view lets you review knowledge changes and old and new references. Follow the [knowledge maintenance workflow](docs/guides/knowledge/extract-knowledge.md).
```

**依据 2 · 作者声明**：[README.md:50-54](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L50-L54)

存储、执行与服务风险。

```text
Beta APIs and storage contracts may change. Knowledge stays in the explicitly selected workspace; execution evidence and machine preferences have their own storage scopes. Back up before upgrading, then establish new evidence through the migration guide.

## Security notice

Use a trusted local environment. Tasks, verifiers, and custom assertions execute local code and should be reviewed first; workspace copies are not security sandboxes. Inspect the material before a model call: source records and artifacts may contain sensitive information. The local report server has no authentication and should not be exposed publicly.
```

**依据 3 · 源码核查**：[src/cli/commands/studio.ts:178-200](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/src/cli/commands/studio.ts#L178-L200)

监听地址和端口参数。

<details>
<summary>查看原文（23行）</summary>

```text
  static flags = {
    lang: LANG_FLAG,
    'source-scope': Flags.string({ description: bilingual({ zh: '显式可信来源绑定 JSON（1 MiB 内）；只在宿主启动时读取，浏览器不能指定项目根或日志路径。',
      en: 'Explicit trusted source bindings JSON within 1 MiB, read only at host startup; browsers cannot supply project roots or trace paths.' }) }),
    port: Flags.string({
      description: bilingual({
        zh: '监听端口，默认 7799。传 0 让 OS 分配',
        en: 'Listen port, default 7799. Pass 0 for OS-assigned',
      }),
      default: '7799',
      parse: integerStringParser('--port', { min: 0, max: 65_535 }),
    }),
    host: Flags.string({
      description: bilingual({
        zh: '监听地址，默认 127.0.0.1（或 OMK_REPORT_HOST）。0.0.0.0／:: 显式向网络开放',
        en: 'Bind address, default 127.0.0.1 (or OMK_REPORT_HOST). 0.0.0.0 / :: explicitly exposes to the network',
      }),
    }),
    takeover: Flags.boolean({
      description: bilingual({
        zh: '显式替换同地址／端口上经验证的 OMK 服务；默认端口占用时报错，不关闭现有服务',
        en: 'Explicitly replace a verified OMK service on the same address/port; by default, port conflicts fail without stopping it',
      }),
```

</details>

#### 缺口

- 未审计全部网络和代码执行路径
  **影响**：不能保证材料不会泄露或执行受到隔离
  **进一步探讨**：在可信隔离环境观察请求、文件写入和实际监听地址。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用和持续维护的成本及退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要 Node 22 以上、工作记录、可写工作区和提取所需认证模型；人工需审查材料、候选、来源及结果，自备有代表性的评测用例。模型费用、维护时间及收益未知。先使用非敏感材料查看来源，再确认运行时与数据处理后提取；若来源无法核对、服务暴露或验证器不可信，应停止相关步骤。Beta API 和存储契约可能变化，升级前应备份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-27](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L15-L27)

版本、依赖和提取条件。

<details>
<summary>查看原文（13行）</summary>

````text
## Start with local work records

Requires **Node.js ≥22**. The library, artifact authoring, and change review described here require **1.0.0-beta.14 or later**, from the **`@next` channel**; npm `latest` is a separate stable channel. Beta.13 does not include this maintenance UI. Strict extraction, native outcome archives, bounded retries, model-assisted cross-window link review and study review belong to later main development; a Beta.14 version alone does not establish their availability. See the [capability tiers](docs/guides/knowledge/extract-knowledge.md#availability) for release and source boundaries. Read the [migration guide](docs/guides/maintenance/v1-preview-migration.md) before upgrading an older installation.

```bash
npm i -g oh-my-knowledge@next
omk --version
omk studio
```

Open the local URL returned by the command and inspect an existing Codex task and its source records. This step makes no model call; Studio offers source and collection guidance when no conversations exist. Follow the [observation guide](docs/guides/observe/observe-production.md) for other log sources.

Next, choose a conversation and turns under “Knowledge → Candidate review”, inspect the material to send, and extract candidates. **Extraction calls a model**, so prepare an [authenticated runtime](docs/reference/integration/executors.md#prerequisites) first. Link sources in the library, revise outdated content, then explicitly generate and save an artifact. Its detail view lets you review knowledge changes and old and new references. Follow the [knowledge maintenance workflow](docs/guides/knowledge/extract-knowledge.md).
````

</details>

**依据 2 · 作者声明**：[README.md:39-54](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L39-L54)

评测证据、维护与风险。

<details>
<summary>查看原文（16行）</summary>

```text
- **Compare two artifacts directly**: preview the plan in the [evaluation quickstart](docs/guides/evaluation/quickstart-skill-eval.md), configure a runtime, then call the model. Fix models and cases, record execution conditions, and inspect decisions, uncertainty, and failed-case evidence.
- **Embed evaluation in a service**: begin with the [offline Node example](docs/guides/integration/eval-runtime.md), complete a traceable comparison, then choose models and configuration as needed.
- **Use OMK inside agents or DSH**: [install the official Skill](docs/guides/evaluation/quickstart-skill-eval.md#use-inside-an-agent), [submit MCP feedback](docs/guides/integration/mcp-integration.md), or use the [DSH host plugin](docs/reference/integration/executors.md#deepseek-harness-prefer-the-host-plugin).
- **Verify an agent’s file changes**: use independent checks in [local task acceptance](docs/guides/evaluation/local-tasks.md), or screen candidate versions with [iterative improvement](docs/guides/evaluation/auto-improve-skills.md).

Starter cases check the workflow; `UNDERPOWERED` is expected. Release decisions need your own domain cases and independent evidence. Observation signals do not establish causality; passing an evaluation does not mean an artifact took effect or a version was published.

## Look up details and upgrade

[Documentation start](docs/README.md) · [Website](https://oh-my-knowledge.pages.dev/) · [CLI](docs/reference/cli.md) · [Runtimes and executors](docs/reference/integration/executors.md) · [Settings and environment variables](docs/reference/shared/settings.md) · [Examples](examples/README.md)

Beta APIs and storage contracts may change. Knowledge stays in the explicitly selected workspace; execution evidence and machine preferences have their own storage scopes. Back up before upgrading, then establish new evidence through the migration guide.

## Security notice

Use a trusted local environment. Tasks, verifiers, and custom assertions execute local code and should be reviewed first; workspace copies are not security sandboxes. Inspect the material before a model call: source records and artifacts may contain sensitive information. The local report server has no authentication and should not be exposed publicly.
```

</details>

**依据 3 · 源码核查**：[package.json:27-33](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/package.json#L27-L33)

CLI 与 Node 版本。

```text
  "bin": {
    "omk": "dist/cli/index.js",
    "omk-mcp": "dist/mcp/stdio.js"
  },
  "engines": {
    "node": ">=22"
  },
```

#### 缺口

- 未实测模型成本、迁移和恢复
  **影响**：无法估计总成本及持续维护负担
  **进一步探讨**：记录真实调用量、人工审查时间并试验备份恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么可检验的改进能增强载体使用证据？

**研究主题**：新假设与验证

#### 完整回答

可探索把实际任务中载体版本、引用知识和独立结果关联为可审查记录，并对缺少使用证据的结论保持未知。现有文档明确区分保存、使用和效果，故假设是增加可验证关联，不是声称现有评测已证明生效。用相同任务比较有无载体的结果和审查成本；关联不可靠或结果无改善时否定。该方案未实现或验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-44](https://github.com/lizhiyao/oh-my-knowledge/blob/9e7da88d272b8f19d9423026c28d6a57f90f3e95/README.md#L29-L44)

维护案例与使用效果的明确区分。

<details>
<summary>查看原文（16行）</summary>

```text
## When knowledge changes, review its artifacts

![SDK historical artifact changes in the Studio reader, captured from the Chinese case](./docs/public/sdk-maintenance-review.png)

In the existing SDK maintenance case, old statements were limited to their historical context, one item was discarded, and another gained a clearer boundary for its static observations. v4 retains three historical references and shows two changes; v5 explicitly selects two currently retained items, while old content and references remain available. [Read the case, sources, and review steps](docs/guides/knowledge/sdk-maintenance-case.md).

This verifies maintenance and reference behavior. It does not verify dynamic SDK effects, time saved, or cross-agent reuse benefits. Retaining knowledge, saving artifacts, using them, and verifying effects are separate records. Complete automatic management and reuse across agents remain in development.

## Continue with your task

- **Compare two artifacts directly**: preview the plan in the [evaluation quickstart](docs/guides/evaluation/quickstart-skill-eval.md), configure a runtime, then call the model. Fix models and cases, record execution conditions, and inspect decisions, uncertainty, and failed-case evidence.
- **Embed evaluation in a service**: begin with the [offline Node example](docs/guides/integration/eval-runtime.md), complete a traceable comparison, then choose models and configuration as needed.
- **Use OMK inside agents or DSH**: [install the official Skill](docs/guides/evaluation/quickstart-skill-eval.md#use-inside-an-agent), [submit MCP feedback](docs/guides/integration/mcp-integration.md), or use the [DSH host plugin](docs/reference/integration/executors.md#deepseek-harness-prefer-the-host-plugin).
- **Verify an agent’s file changes**: use independent checks in [local task acceptance](docs/guides/evaluation/local-tasks.md), or screen candidate versions with [iterative improvement](docs/guides/evaluation/auto-improve-skills.md).

Starter cases check the workflow; `UNDERPOWERED` is expected. Release decisions need your own domain cases and independent evidence. Observation signals do not establish causality; passing an evaluation does not mean an artifact took effect or a version was published.
```

</details>

#### 缺口

- 实际使用到效果的关联尚未核实
  **影响**：不能推出跨 Agent 或任务效果
  **进一步探讨**：固定载体版本、任务和对照条件记录结果。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
