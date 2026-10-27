# HelloAGENTS

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[79c0b48](https://github.com/hellowind777/helloagents/tree/79c0b482fd209f2e847218e1f1aee36b2ddb54e6)

<!-- BEGIN META -->
[![GitHub ★ 709](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=709&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellowind777/helloagents) [![npm 30d 829](https://img.shields.io/static/v1?label=npm+30d&message=829&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents) [![最新发布 2026-07-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-07-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents)
<!-- END META -->

> **功能**：为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。

> **亮点**：将项目知识、分支会话状态、任务清单和质量检查组织成可恢复编码流程，增益在避免遗漏而非提高模型能力。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：QA记录可由调用方提供clean和命令名，所查验证器不执行命令或核对退出日志；无计划和非auto/loop也有明确范围，不能称普遍强制交付保证。[Q02](#research-q02)

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
  - [Q01 · 工作流层对什么编码任务有用？](#detail-section-11)
  - [Q02 · 交付检查是否能证明命令实际执行并通过？](#detail-section-12)
  - [Q03 · 部署工作流会修改哪些范围，恢复成本如何？](#detail-section-13)
  - [Q04 · 怎样借鉴文件范围管理，并减少只填证据的形式化通过？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要计划、实现、复核及跨轮继续的AI编码CLI用户。

项目AGENTS.md、任务清单和CI。应以遗漏与返工减少衡量，不能以Skill、回执或模板数量评价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作流路由 | 选择计划、实现和QA路径 | 文本规则仍依赖Agent遵循 |
| 交付状态检查 | 发现计划与证据缺项 | 不是命令真实执行证明 |
| 项目/会话材料 | 跨轮恢复上下文 | 不等于并发互斥或完整长期记忆 |
| 受管配置维护 | 安装和清理指定片段 | 应备份并核对无关内容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥18与CLI包 | 必需 | 管理Skill、规则及脚本 | 按具体宿主兼容检查 |
| 支持CLI与安装模式 | 宿主接入必需 | carrier、hook与通知 | 项目模式与全局修改范围不同 |
| 真实项目验证命令和维护者 | 交付判断必需 | 检查产物与执行结果 | 只有回执无法代替实际验证 |
| 会话/分支状态与备份 | 长任务建议 | 恢复当前计划 | 不把active映射当并发互斥锁 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份宿主配置，选择一个目标与模式 | 核对安装修改与原有规则冲突 |
| 2 | 副本工程初始化最小计划与验证命令 | 任务和产物对应，hook可观察 |
| 3 | 一次失败与一次完成流程 | 分别核对真实日志和拦截原因 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与模型上下文 | 选模式、规则冲突及备份 | 安装脚本可改变宿主配置 |
| 持续使用 | 质量Skill与复核调用 | 维护计划、证据和知识文件 | 无端到端节时数据 |
| 失败恢复 | 备份和状态存储 | doctor、核对受管片段并恢复 | safeWrite是直接writeFile非事务证明 |
| 退出 | 保留项目知识与计划 | cleanup后核对原有hook/notify | 实际完整卸载未测 |

已有跨轮编码流程且愿维护规范的人，可先单宿主、单副本试用。若现有AGENTS和CI已足够，或全局规则与项目授权冲突，停止扩大部署，保留原有流程。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 计划检查 | 未完成/缺失文件与所需证据可block | 需求真实完成与宿主消费 |
| QA记录 | 时间、指纹与必填字段校验 | 命令是否实际执行且通过 |
| 跨轮工作 | 文档定义会话状态 | 真实恢复率与手续成本 |

> **思考**：QA记录可由调用方提供clean和命令名，所查验证器不执行命令或核对退出日志；无计划和非auto/loop也有明确范围，不能称普遍强制交付保证。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将项目知识、分支会话状态、任务清单和质量检查组织成可恢复编码流程，增益在避免遗漏而非提高模型能力。[Q01](#research-q01) [Q02](#research-q02)

受管marker注入和清理保留非受管内容，host配置逻辑还有备份恢复线索；这些是缩小修改范围的便利，不能据函数名safeWrite推断掉电原子性。QA状态把时间与工作区指纹检查单列，有助于避免旧证据套到新改动，但证据生产者与检查执行的真实性仍需进一步绑定。

<a id="detail-section-5"></a>

### 1.4 主要限制

QA记录可由调用方提供clean和命令名，所查验证器不执行命令或核对退出日志；无计划和非auto/loop也有明确范围，不能称普遍强制交付保证。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

有跨轮编码任务且愿维护计划的用户可在单宿主副本试用，先备份配置并核对真实验证日志；与项目规则冲突或只增加填表负担时退回原有AGENTS和CI。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

计划检查、QA字段校验与受管注入有源码支持；各宿主消费、真实命令绑定和质量收益未实测。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/delivery-gate.mjs、scripts/turn-stop-gate.mjs、scripts/qa-review-state.mjs、scripts/notify.mjs、scripts/cli-utils.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查delivery/stop/QA记录与受管文件工具，不完整审计各宿主安装、所有配置恢复或并发锁。
- 下一步：副本工程比较缺计划、旧指纹、未执行却clean和真实失败场景，核对hook消费及恢复原有配置。

**分析版本**

- **仓库**：[hellowind777/helloagents](https://github.com/hellowind777/helloagents)
- **版本号**：3.1.9（[固定提交 79c0b48](https://github.com/hellowind777/helloagents/tree/79c0b482fd209f2e847218e1f1aee36b2ddb54e6)）
- **版本日期**：2026-07-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用CI或最小runner生成命令/目录/退出码/日志绑定记录，检查是否减少填表式错误放行；不替代需求与视觉判断，尚未验证。[Q04](#research-q04)

副本工程比较缺计划、旧指纹、未执行却clean和真实失败场景，核对hook消费及恢复原有配置。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 4812 | — | — | 62166 |
| .mjs | source | 65 | 12428 | 10905 | 86 | — |
| .md | test | 1 | 17 | — | — | 177 |
| .mjs | test | 34 | 8633 | 7675 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/hellowind777/helloagents/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hellowind777/helloagents/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/hellowind777/helloagents/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多CLI工作流规则与交付检查能降低哪些遗漏，证据真实性及配置维护边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作流层对什么编码任务有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要多阶段方案、实现、复核与跨会话继续的AI编码CLI用户。简单替代是项目AGENTS.md、任务清单与CI命令。HelloAGENTS把任务路由、质量Skill、计划文件、会话状态和交付检查组合，试图减少只给建议、忘上下文和提前结束。合格交付仍是实际需求对应的实现和验证，不是状态文件齐全或回复带格式。

贡献是工作流组织与宿主集成，而非提高模型权重能力。十四个质量Skill和模板数量不证明质量提升；已有成熟项目规范和CI的团队应比较新增手续是否减少遗漏，不应自动叠加全部全局规则。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-80](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L48-L80)

作者说明编码流程问题及工作流层目标。

<details>
<summary>查看原文（33行）</summary>

```text
## What HelloAGENTS Does

AI coding CLIs can move fast, but they can also stop at advice, skip checks, lose project context, shift responsibility when tasks get hard, or report completion before the work is really done.

HelloAGENTS adds a workflow layer on top of Claude Code, Gemini CLI, Grok Build, Cursor, and Codex CLI. It anchors the agent as a capable executor, blocks responsibility-shifting patterns, helps the agent choose the right path, use task-specific quality skills, keep a project knowledge base, and verify work before delivery.

<table>
<tr>
<td width="50%" valign="top" align="center">

**Without HelloAGENTS**

<img src="./readme_images/08-demo-snake-without-helloagents.png" alt="Without HelloAGENTS" width="520">

</td>
<td width="50%" valign="top" align="center">

**With HelloAGENTS**

<img src="./readme_images/07-demo-snake-with-helloagents.png" alt="With HelloAGENTS" width="520">

</td>
</tr>
</table>

| Problem | Without HelloAGENTS | With HelloAGENTS |
|---------|---------------------|------------------|
| Stops too early | Ends with suggestions | Continues into build, verify, and closeout |
| Shifts responsibility | Refuses hard tasks, suggests other tools | Exhausts alternative paths, stays on task |
| Quality is inconsistent | Depends on each prompt | 14 quality skills activate by task type |
| Context is scattered | Plans live in chat history | Project knowledge and plan files stay on disk |
| Completion is vague | Natural language says “done” | Delivery checks use state, evidence, and verification |
| Config writes are risky | CLI files can drift | Install, update, cleanup, and doctor flows check managed files |
```

</details>

**依据 2 · 作者声明**：[README.md:137-165](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L137-L165)

项目知识和结构计划交付。

<details>
<summary>查看原文（29行）</summary>

```text
### 3) Project knowledge base

HelloAGENTS can create and maintain a project knowledge base under `.helloagents/`.

The knowledge base helps future turns understand the repo without re-discovering the same facts. It can store:

| File or directory | Purpose |
|-------------------|---------|
| `context.md` | project overview, stack, architecture, module index |
| `guidelines.md` | non-obvious coding conventions inferred from the repo |
| `verify.yaml` | verification commands such as lint, test, build |
| `CHANGELOG.md` | project-level change history |
| `DESIGN.md` | stable UI design contract when the project has UI work |
| `modules/*.md` | module-specific notes and lessons |
| `plans/<feature>/` | active plan packages |
| `archive/` | archived plan packages |

`~init` initializes the project workflow: it writes the project-level full carrier marker, prepares project state, and creates or updates the knowledge base.

### 4) Structured plan packages

Complex work can be stored as plan packages instead of a single paragraph in chat.

For `~plan`, HelloAGENTS uses:

- `requirements.md`
- `plan.md`
- `tasks.md`
- `contract.json`
```

</details>

**依据 3 · 作者声明**：[README.md:202-218](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L202-L218)

状态、证据与实际交付的区别。

<details>
<summary>查看原文（17行）</summary>

```text
### 6) Verification and delivery evidence

HelloAGENTS does not treat “tests passed” and “task complete” as the same thing. Delivery can also require plan coverage, task checklist status, review evidence, advisor evidence, and visual evidence.

Runtime state now stays intentionally small:

- `.helloagents/sessions/<workspace>/<session>/STATE.md`
- `.helloagents/sessions/<workspace>/<session>/runtime.json`
- `.helloagents/sessions/active.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/qa-review.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/advisor.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/visual.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/closeout.json`
- optional `.helloagents/sessions/<workspace>/<session>/events.jsonl`
- `~/.codex/.helloagents/notify-state.json` for Codex-native closeout de-duplication only

`STATE.md` only keeps the human-readable recovery snapshot. `runtime.json` is machine-only and keeps the minimal runtime state. `artifacts/*.json` stays limited to structured receipts. `events.jsonl` remains opt-in trace output and stays off by default.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 交付检查是否能证明命令实际执行并通过？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

delivery-gate读取计划状态、缺文件、模板占位、未完成任务及按contract要求的QA/顾问/视觉证据；有问题返回block。无计划时直接suppressOutput，说明该检查有适用范围。turn-stop仅对显式auto/loop执行，complete状态可通过格式检查，waiting/blocked需结构化原因；不是对任何会话无条件强制办结。notify链将这些评估接入stop处理，但宿主必须实际安装并消费对应hook，本次未验证各CLI。

QA evidence写入接收source、outcome、commands等字段并加工作区指纹；校验要求明确结论、非空命令列表、非fastOnly与clean结果。这里没有执行验证命令，也未在所查函数逐命令比对退出码或签名日志。因此能约束证据记录完整与新鲜，不能把Agent填的clean等同独立测试真实通过。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/delivery-gate.mjs:32-81](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/delivery-gate.mjs#L32-L81)

计划文件、清单和contract检查。

<details>
<summary>查看原文（50行）</summary>

```text
function collectPlanIssues(planEntries) {
  const issues = []

  for (const entry of planEntries) {
    if (entry.missingFiles.length > 0) {
      issues.push({
        type: 'missing-files',
        planName: entry.planName,
        details: entry.missingFiles.map((file) => `缺少 ${file}`),
      })
    }

    if (entry.templateIssues.length > 0) {
      issues.push({
        type: 'template-placeholders',
        planName: entry.planName,
        details: entry.templateIssues,
      })
    }

    if (entry.taskSummary.total === 0) {
      issues.push({
        type: 'missing-task-checklist',
        planName: entry.planName,
        details: ['tasks.md 没有可执行检查项'],
      })
      continue
    }

    if (entry.taskSummary.open > 0) {
      issues.push({
        type: 'unfinished-tasks',
        planName: entry.planName,
        details: entry.taskSummary.items
          .filter((item) => item.status === 'open')
          .slice(0, 3)
          .map((item) => item.text),
        extraCount: Math.max(entry.taskSummary.open - 3, 0),
      })
    }
    collectTaskMetadataIssues(entry, issues)

    if (entry.contractIssues.length > 0) {
      issues.push({
        type: 'missing-contract',
        planName: entry.planName,
        details: entry.contractIssues,
      })
    }
  }
```

</details>

**依据 2 · 源码核查**：[scripts/delivery-gate.mjs:132-180](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/delivery-gate.mjs#L132-L180)

无计划例外及证据问题block。

<details>
<summary>查看原文（49行）</summary>

```text
export function evaluateDeliveryGate(data = {}) {
  const cwd = data.cwd || process.cwd()
  const workflowOptions = { payload: data }
  const snapshot = getWorkflowSnapshot(cwd, workflowOptions)
  const recommendation = getWorkflowRecommendation(cwd, workflowOptions)
  const deliveryAction = getDeliveryAction(cwd, workflowOptions)
  const gatePlans = selectGatePlans(snapshot)
  const qaStatus = getQaReviewEvidenceStatus(cwd, {
    required: deliveryAction?.phase === 'qa' || deliveryAction?.phase === 'consolidate',
    ...workflowOptions,
  })
  if (gatePlans.length === 0) {
    return { suppressOutput: true }
  }

  const advisorRequirements = gatePlans.map((entry) => getAdvisorRequirement(entry.contract))
  const advisorStatus = getAdvisorEvidenceStatus(cwd, {
    required: advisorRequirements.some((entry) => entry.required),
    focus: advisorRequirements.flatMap((entry) => entry.focus || []),
    ...workflowOptions,
  })
  const visualRequirements = gatePlans.map((entry) => getVisualValidationRequirement(entry.contract))
  const visualStatus = getVisualEvidenceStatus(cwd, {
    required: visualRequirements.some((entry) => entry.required),
    screens: visualRequirements.flatMap((entry) => entry.screens || []),
    states: visualRequirements.flatMap((entry) => entry.states || []),
    ...workflowOptions,
  })
  const closeoutRequired = (
    gatePlans.every((entry) => entry.missingFiles.length === 0 && entry.templateIssues.length === 0 && entry.taskSummary.total > 0 && entry.taskSummary.open === 0 && entry.taskSummary.underSpecifiedCount === 0)
    && (!qaStatus.required || qaStatus.status === 'valid')
    && (!advisorStatus.required || advisorStatus.status === 'valid')
    && (!visualStatus.required || visualStatus.status === 'valid')
  )
  const closeoutStatus = getCloseoutEvidenceStatus(cwd, {
    required: closeoutRequired,
    ...workflowOptions,
  })

  const issues = collectGateIssues(gatePlans, qaStatus, advisorStatus, visualStatus, closeoutStatus)
  if (issues.length === 0) {
    return { suppressOutput: true }
  }

  return {
    decision: 'block',
    reason: buildDeliveryBlockReason(issues, recommendation, buildDeliveryGateHint(cwd, workflowOptions)),
    suppressOutput: true,
  }
```

</details>

**依据 3 · 源码核查**：[scripts/turn-stop-gate.mjs:117-155](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/turn-stop-gate.mjs#L117-L155)

stop适用范围和结构化状态判据。

<details>
<summary>查看原文（39行）</summary>

```text
function validateTurnState(routeContext, turnState, cwd, payload = {}) {
  if (!turnState) {
    return buildBlockReason(routeContext, '缺少主代理 turn-state。', cwd)
  }
  if (turnState.kind === 'complete') {
    const formatReason = validateFormattedCloseoutMessage(routeContext, payload, cwd)
    if (formatReason) return formatReason
    return ''
  }
  if (turnState.kind === 'waiting' || turnState.kind === 'blocked') {
    if (turnState.reasonCategory && turnState.reason) {
      if (!hasStructuredBlocker(turnState)) {
        return buildBlockReason(
          routeContext,
          '当前 waiting/blocked 缺少结构化 `blocker.target`、`blocker.evidence` 或 `blocker.requiredAction`，不能证明存在可核实的真实阻塞。',
          cwd,
        )
      }
      return ''
    }
    return buildBlockReason(
      routeContext,
      `当前 turn-state 为 \`${turnState.kind}\`，但缺少 \`reasonCategory\` 或 \`reason\`。`,
      cwd,
    )
  }
  return buildBlockReason(routeContext, `当前 turn-state 为 \`${turnState.kind}\`，不能作为当前对话结束状态。`, cwd)
}

export function evaluateTurnStopGate(payload = {}) {
  const cwd = payload.cwd || process.cwd()
  const routeContext = getApplicableRouteContext({ cwd, payload })

  if (!routeContext || !ENFORCED_COMMANDS.has(routeContext.skillName)) {
    return { decision: 'continue' }
  }

  const reason = validateTurnState(routeContext, getMainTurnState(cwd, payload), cwd, payload)
  return reason ? { decision: 'block', reason } : { decision: 'continue' }
```

</details>

**依据 4 · 源码核查**：[scripts/qa-review-state.mjs:138-177](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/qa-review-state.mjs#L138-L177)

写入人工/Agent提供的字段并捕获指纹。

<details>
<summary>查看原文（40行）</summary>

```text
export function writeQaReviewEvidence(cwd, {
  source = 'manual',
  originCommand = '',
  qaMode = 'standard',
  scope = '',
  outcome = '',
  conclusion = '',
  findings = [],
  fileReferences = [],
  commands = [],
  fastOnly = false,
} = {}, options = {}) {
  const normalized = normalizeQaReviewEvidence({
    source,
    originCommand,
    qaMode,
    scope,
    outcome,
    conclusion,
    findings,
    fileReferences,
    commands,
    fastOnly,
  })
  const payload = {
    schemaVersion: 2,
    updatedAt: new Date().toISOString(),
    source: normalized.source,
    originCommand: normalized.originCommand,
    qaMode: normalized.qaMode,
    scope: normalized.scope,
    outcome: normalized.outcome,
    conclusion: normalized.conclusion,
    findings: normalized.findings,
    fileReferences: normalized.fileReferences,
    commands: normalized.commands,
    fastOnly: normalized.fastOnly,
    fingerprint: captureWorkspaceFingerprint(cwd),
  }
  writeRuntimeEvidence(cwd, QA_REVIEW_EVIDENCE_FILE_NAME, payload, options)
```

</details>

**依据 5 · 源码核查**：[scripts/qa-review-state.mjs:218-255](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/qa-review-state.mjs#L218-L255)

QA状态校验不执行命令或比对退出日志。

<details>
<summary>查看原文（38行）</summary>

```text
function validateQaReviewEvidence(commands, evidence) {
  if (!normalizeQaOutcome(evidence.outcome) || !String(evidence.conclusion || '').trim()) {
    return {
      required: true,
      status: 'invalid',
      evidence,
      commands,
      details: ['qa-review 证据必须记录明确的 outcome 和 conclusion'],
    }
  }
  if (commands.length > 0 && normalizeCommands(evidence.commands).length === 0) {
    return {
      required: true,
      status: 'invalid',
      evidence,
      commands,
      details: ['qa-review 证据必须记录本次实际执行的验证命令'],
    }
  }
  if (Boolean(evidence.fastOnly)) {
    return {
      required: true,
      status: 'fast-only',
      evidence,
      commands,
      details: ['最新 qa-review 证据只覆盖快速命令检查，未完成完整 qa-review 闭环'],
    }
  }
  if (normalizeQaOutcome(evidence.outcome) !== 'clean') {
    return {
      required: true,
      status: 'blocked',
      evidence,
      commands,
      details: ['最新 qa-review 证据仍记录阻断问题'],
    }
  }
  return null
```

</details>

**依据 6 · 源码核查**：[scripts/notify.mjs:309-326](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/notify.mjs#L309-L326)

notify实际调用两个gate评估。

<details>
<summary>查看原文（18行）</summary>

```text
async function runDeliveryGate(payload) {
  return await runInlineGate({
    payload,
    source: 'delivery-gate',
    blockEvent: 'delivery_gate_blocked',
    exportName: 'evaluateDeliveryGate',
    evaluateArgs: [payload],
  });
}

async function runTurnStopGate(payload) {
  return await runInlineGate({
    payload,
    source: 'turn-stop-gate',
    blockEvent: 'turn_stop_blocked',
    exportName: 'evaluateTurnStopGate',
    evaluateArgs: [payload],
  });
```

</details>

#### 缺口

- 宿主hook消费与真实测试命令证据的端到端绑定未验证。
  **影响**：不能把结构化回执当独立业务验收或不可伪造安全门。
  **进一步探讨**：在副本项目故意写有命令名但未运行的clean记录，与实际失败退出日志对照，确认检查范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部署工作流会修改哪些范围，恢复成本如何？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥18与CLI包 | 必需 | 管理Skill、规则及脚本 | 按具体宿主兼容检查 |
| 支持CLI与安装模式 | 宿主接入必需 | carrier、hook与通知 | 项目模式与全局修改范围不同 |
| 真实项目验证命令和维护者 | 交付判断必需 | 检查产物与执行结果 | 只有回执无法代替实际验证 |
| 会话/分支状态与备份 | 长任务建议 | 恢复当前计划 | 不把active映射当并发互斥锁 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份宿主配置，选择一个目标与模式 | 核对安装修改与原有规则冲突 |
| 2 | 副本工程初始化最小计划与验证命令 | 任务和产物对应，hook可观察 |
| 3 | 一次失败与一次完成流程 | 分别核对真实日志和拦截原因 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与模型上下文 | 选模式、规则冲突及备份 | 安装脚本可改变宿主配置 |
| 持续使用 | 质量Skill与复核调用 | 维护计划、证据和知识文件 | 无端到端节时数据 |
| 失败恢复 | 备份和状态存储 | doctor、核对受管片段并恢复 | safeWrite是直接writeFile非事务证明 |
| 退出 | 保留项目知识与计划 | cleanup后核对原有hook/notify | 实际完整卸载未测 |

已有跨轮编码流程且愿维护规范的人，可先单宿主、单副本试用。若现有AGENTS和CI已足够，或全局规则与项目授权冲突，停止扩大部署，保留原有流程。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-31](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/package.json#L13-L31)

CLI与postinstall/preuninstall生命周期脚本。

<details>
<summary>查看原文（19行）</summary>

```text
  "bin": {
    "helloagents": "cli.mjs",
    "helloagents-js": "cli.mjs",
    "helloagents-js.cmd": "cli.mjs",
    "helloagents-turn-state": "scripts/turn-state-cli.mjs"
  },
  "scripts": {
    "test": "node --test",
    "postinstall": "node cli.mjs postinstall",
    "preuninstall": "node cli.mjs preuninstall",
    "uninstall": "node cli.mjs preuninstall",
    "postuninstall": "node cli.mjs preuninstall",
    "prepublishOnly": "node cli.mjs sync-version",
    "deploy": "node cli.mjs install",
    "deploy:standby": "node cli.mjs install --all --standby",
    "deploy:global": "node cli.mjs install --all --global",
    "sync-hosts": "node cli.mjs update",
    "cleanup-hosts": "node cli.mjs cleanup",
    "switch-branch": "node cli.mjs switch-branch"
```

</details>

**依据 2 · 作者声明**：[README.md:187-200](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L187-L200)

会话分支状态路径与恢复规则。

<details>
<summary>查看原文（14行）</summary>

```text
### 5) State and recovery

Long tasks need a small recovery snapshot, but one shared state file is not safe enough for concurrent work.

HelloAGENTS now resolves the current state file from `state_path`:

- with a stable or reusable session id: `.helloagents/sessions/<workspace>/<session>/STATE.md`
- before a reusable session id is available: `.helloagents/sessions/<workspace>/default/STATE.md`

`<workspace>` is the current Git branch, `detached-<sha>` for a detached HEAD, or `workspace` for non-Git projects. `<session>` is the current project-local session token. `.helloagents/sessions/active.json` only keeps the latest active workspace/session mapping plus alias bridges, so the same CLI session stays in one directory and `/resume` can reuse it.

For project-local sessions, HelloAGENTS first uses stable host identifiers such as `sessionId`, `conversationId`, `threadId`, or `HELLOAGENTS_NOTIFY_SESSION_ID`. If the host only exposes a window or terminal id such as `WT_SESSION`, `TERM_SESSION_ID`, or `WINDOWID`, HelloAGENTS uses it only as a lightweight alias bridge and reuses the mapped session first instead of fanning out duplicate directories. If a session starts before a stable host identifier is available, HelloAGENTS can begin in `default` and keep reusing that same active directory after the same CLI session later exposes a stable identifier, instead of splitting into a second session directory.

`STATE.md` records where the current workflow stopped. It is not a universal memory file for every conversation. Codex `/goal` does not replace `state_path`, `turn-state`, or local evidence files; it only handles long-running continuation on the Codex side.
```

</details>

**依据 3 · 作者声明**：[README.md:226-239](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L226-L239)

安装/清理范围及诊断的作者说明。

<details>
<summary>查看原文（14行）</summary>

```text
### 7) Safer install, update, cleanup, and diagnostics

The CLI manages host files explicitly:

- `install` writes only the selected target unless `--all` is used
- `update` refreshes the selected target or all targets
- `cleanup` removes managed injections and links
- `uninstall` performs scoped cleanup before package removal
- `doctor` reports drift in carriers, links, hooks, config entries, plugin roots, cache copies, versions, and real Claude/Gemini global install artifacts; for Codex, it also surfaces native `codex doctor` output when available
- Codex managed `notify = ["helloagents-js", "codex-notify"]` stays portable, and `doctor`, `cleanup`, and `uninstall` also recognize wrapped `--previous-notify` chains used by Codex App / Computer Use
- per-host mode tracking is written only after host setup succeeds, and failed native global cleanup keeps the host tracked as `global` instead of silently layering standby on top
- direct `switch-branch` clears stale `HELLOAGENTS*` lifecycle env before its internal npm install/sync steps, and package `preuninstall` falls back to `--all` when no explicit host args are provided, so stale shell env does not shrink branch-switch or uninstall cleanup scope
- Windows `.cmd` / `.bat` lifecycle calls now run through an explicit command wrapper, so host installs, branch switching, and doctor flows do not emit Node `DEP0190` shell deprecation warnings
- Claude Code, Gemini CLI, Grok Build, Cursor, and Codex CLI config writes, updates, cleanup, uninstall, mode switching, and branch switching are covered as one tested lifecycle chain instead of separate best-effort paths
```

</details>

**依据 4 · 作者声明**：[README.md:243-257](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/README.md#L243-L257)

postinstall默认行为与显式宿主部署。

<details>
<summary>查看原文（15行）</summary>

````text
### 1) Install the package

```bash
npm install -g --allow-scripts=helloagents helloagents
```

If another executable named `helloagents` already exists in your `PATH`, use the stable managed-entry alias:

```bash
helloagents-js
```

By default, `postinstall` installs the package command, initializes `~/.helloagents/helloagents.json`, and syncs runtime files to `~/.helloagents/helloagents`. No host CLI is deployed unless you set `HELLOAGENTS=target[:mode]`, such as `HELLOAGENTS=codex:global`.

For npm 11 and later, keep `--allow-scripts=helloagents` on direct package install or upgrade commands so npm can run the managed `postinstall` without approval warnings. If you are still on npm 10 or earlier, you can omit that flag.
````

</details>

**依据 5 · 源码核查**：[scripts/cli-utils.mjs:12-16](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/cli-utils.mjs#L12-L16)

safeWrite为直接writeFileSync，不是原子事务。

```text
export function ensureDir(p) { mkdirSync(p, { recursive: true }); }
export function safeWrite(p, c) { ensureDir(dirname(p)); writeFileSync(p, c, 'utf-8'); }
export function safeRead(p) { try { return readFileSync(p, 'utf-8'); } catch { return null; } }
export function safeJson(p) { try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return null; } }
export function removeIfExists(p) { try { rmSync(p, { recursive: true, force: true }); } catch {} }
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样借鉴文件范围管理，并减少只填证据的形式化通过？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

受管marker注入和清理保留非受管内容，host配置逻辑还有备份恢复线索；这些是缩小修改范围的便利，不能据函数名safeWrite推断掉电原子性。QA状态把时间与工作区指纹检查单列，有助于避免旧证据套到新改动，但证据生产者与检查执行的真实性仍需进一步绑定。

未验证假设是把验证命令、运行目录、开始结束时间、退出码和日志摘要交由只执行既定命令的runner生成，QA综合引用该记录；需求覆盖和视觉判断仍由人/Agent解释。最小对照包含旧fingerprint、漏跑命令、命令失败却填clean和正常完成四组，比较错误放行、误拦截与维护时间。若额外runner只重做CI且没有减少错误放行，应复用现有CI结果，而不是再造审批层。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/cli-utils.mjs:68-87](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/cli-utils.mjs#L68-L87)

marker范围的注入/清理。

<details>
<summary>查看原文（20行）</summary>

```text
/** Inject content wrapped in markers, preserving existing content outside markers. */
export function injectMarkedContent(filePath, content) {
  const existing = safeRead(filePath) || '';
  const wrapped = `\n${MARKER}\n${content}\n${MARKER_END}\n`;
  if (existing.includes(MARKER)) {
    safeWrite(filePath, existing.replace(MARKER_RE, wrapped));
  } else if (existing.trim()) {
    safeWrite(filePath, existing.trimEnd() + '\n' + wrapped);
  } else {
    safeWrite(filePath, wrapped.trim() + '\n');
  }
}

/** Remove marked content from a file. Deletes file if nothing remains. */
export function removeMarkedContent(filePath) {
  const existing = safeRead(filePath);
  if (!existing || !existing.includes(MARKER)) return;
  const cleaned = existing.replace(MARKER_RE, '\n').trim();
  if (cleaned) safeWrite(filePath, cleaned + '\n');
  else removeIfExists(filePath);
```

</details>

**依据 2 · 源码核查**：[scripts/qa-review-state.mjs:210-255](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/qa-review-state.mjs#L210-L255)

时间/指纹与字段检查分开，是真实性绑定的改进入口。

<details>
<summary>查看原文（46行）</summary>

```text
function validateQaReviewTimestamp(evidence, now) {
  return validateEvidenceTimestamp(evidence, now, 'qa-review 证据')
}

function validateQaReviewFingerprint(cwd, evidence) {
  return validateEvidenceFingerprint(cwd, evidence, '成功 qa-review 证据')
}

function validateQaReviewEvidence(commands, evidence) {
  if (!normalizeQaOutcome(evidence.outcome) || !String(evidence.conclusion || '').trim()) {
    return {
      required: true,
      status: 'invalid',
      evidence,
      commands,
      details: ['qa-review 证据必须记录明确的 outcome 和 conclusion'],
    }
  }
  if (commands.length > 0 && normalizeCommands(evidence.commands).length === 0) {
    return {
      required: true,
      status: 'invalid',
      evidence,
      commands,
      details: ['qa-review 证据必须记录本次实际执行的验证命令'],
    }
  }
  if (Boolean(evidence.fastOnly)) {
    return {
      required: true,
      status: 'fast-only',
      evidence,
      commands,
      details: ['最新 qa-review 证据只覆盖快速命令检查，未完成完整 qa-review 闭环'],
    }
  }
  if (normalizeQaOutcome(evidence.outcome) !== 'clean') {
    return {
      required: true,
      status: 'blocked',
      evidence,
      commands,
      details: ['最新 qa-review 证据仍记录阻断问题'],
    }
  }
  return null
```

</details>

**依据 3 · 源码核查**：[scripts/delivery-gate.mjs:86-115](https://github.com/hellowind777/helloagents/blob/79c0b482fd209f2e847218e1f1aee36b2ddb54e6/scripts/delivery-gate.mjs#L86-L115)

交付汇总依据各类证据状态。

<details>
<summary>查看原文（30行）</summary>

```text
function collectEvidenceIssues(issues, qaStatus, advisorStatus, visualStatus, closeoutStatus) {
  if (qaStatus?.required && qaStatus.status !== 'valid') {
    issues.push({
      type: 'missing-qa-review-evidence',
      planName: 'delivery',
      details: qaStatus.details,
    })
  }
  if (advisorStatus?.required && advisorStatus.status !== 'valid') {
    issues.push({
      type: 'missing-advisor-evidence',
      planName: 'delivery',
      details: advisorStatus.details,
    })
  }
  if (visualStatus?.required && visualStatus.status !== 'valid') {
    issues.push({
      type: 'missing-visual-evidence',
      planName: 'delivery',
      details: visualStatus.details,
    })
  }

  if (issues.length === 0 && closeoutStatus?.required && closeoutStatus.status !== 'valid') {
    issues.push({
      type: 'missing-closeout-evidence',
      planName: 'delivery',
      details: closeoutStatus.details,
    })
  }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
