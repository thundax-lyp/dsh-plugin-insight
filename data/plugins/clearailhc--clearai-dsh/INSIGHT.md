# ClearAI

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[47f8cda](https://github.com/Clearailhc/clearai-dsh/tree/47f8cda175ed3bf73162fa3dc47a4c0d3874a542)

<!-- BEGIN META -->
[![GitHub ★ 673](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=673&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clearailhc/clearai-dsh) [![npm 30d 6,213](https://img.shields.io/static/v1?label=npm+30d&message=6%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/clearai-dsh)
<!-- END META -->

> **功能**：为 DSH 提供以问题、证据、独立评估和领域本体组织研究的 Agent 预设。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持由“执行者说完成”转为材料绑定独立裁决，并在审计后重新检查未决问题；贡献是研究完成协议，非新增宿主子 Agent。

> **主要限制**：[Q03](#research-q03) 指出独立角色仍可能共享模型偏差，结构完备不代表现实命题可信；额外评估费用是否降低错误结案尚无实测。

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
  - [Q01 · 研究工作流相对普通任务循环改变了什么？](#detail-section-11)
  - [Q02 · 评估派发、中断与结案是否真正受系统控制？](#detail-section-12)
  - [Q03 · 依赖和评估成本会怎样限制可信结论？](#detail-section-13)
  - [Q04 · 怎样验证独立评估有用，谁适合试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要逐题证据与反例的研究团队，将研究答案沉淀为有边界的本体条目。

普通待办任务循环及人工研究清单；DSH 续跑、子 Agent 与历史属于宿主基线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 问题与候选假设 | 组织可证伪研究 | 需明确判据和证据 |
| 独立评估 | 审查产物后决定结案 | 依赖宿主子Agent和可访问材料 |
| 未决项检查 | 阻止遗漏反例结案 | 不能保证模型判断正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22、DSH>=0.2.0-rc.2 | 必需 | 预设和宿主接入 | 不应据声明当兼容已验 |
| 子 Agent 与模型预算 | 独立评估必需 | 产生材料裁决 | 派发失败保持未知 |
| 证据访问和明确判据 | 效果必需 | 检验结论 | 图谱不能弥补缺证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择 ClearAI 并整理材料 | 预设可见且证据可读 |
| 研究 | Agent 写问题、假设和产物 | 对照预注册判据 |
| 评估 | 系统落账再派发受限评估者 | 无法派发或不成立则保持开放 |
| 验收 | 用户复核答案和未解释项 | 错误率不降回人工清单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主和插件资源 | 学习判据与证据协议 | 耗时未知 |
| 持续使用 | 执行及独立评估模型调用 | 处理反例和争议 | 单位合格报告费用未知 |
| 失败恢复 | 持久会话和重复查证 | 先查派发账本与裁决 | 真实中断恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结案约束 | 失败评估与未决问题阻止完成 | 现实命题正确率 |
| 恢复协议 | 派发前落账、失败不升级 | 重启后全部状态一致性 |

> **思考**：[Q03](#research-q03) 指出独立角色仍可能共享模型偏差，结构完备不代表现实命题可信；额外评估费用是否降低错误结案尚无实测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持由“执行者说完成”转为材料绑定独立裁决，并在审计后重新检查未决问题；贡献是研究完成协议，非新增宿主子 Agent。

[Q02](#research-q02) 先持久化派发、材料摘要复用裁决及运行 guard 值得借鉴；移植要匹配宿主目标版本、预设作用域与子会话恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指出独立角色仍可能共享模型偏差，结构完备不代表现实命题可信；额外评估费用是否降低错误结案尚无实测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在固定材料与可反驳问题上试用，保留人工复核，用错误结案及全部费用决定是否继续。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

审计派发和结案门有固定源码支持；实际宿主恢复、研究正确率及成本改善未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、tools/build-package.mjs、preset/plugins/clearai-kernel.js、preset/plugins/clearai-evaluator-face.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根插件，核查审计派发、评估工具面、结案转移、包和构建；未运行宿主和目标测试。
- 下一步：用故意错误证据和中断场景对照普通待办与人工抽查，记录错误结案、恢复状态和总费用；未执行。

**分析版本**

- **仓库**：[Clearailhc/clearai-dsh](https://github.com/Clearailhc/clearai-dsh)
- **版本号**：0.5.7（[固定提交 47f8cda](https://github.com/Clearailhc/clearai-dsh/tree/47f8cda175ed3bf73162fa3dc47a4c0d3874a542)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出以错误结案风险选择评估强度，保留语义门与可恢复派发；若错误率不降或费用反增则否定。

用故意错误证据和中断场景对照普通待办与人工抽查，记录错误结案、恢复状态和总费用；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 85 | 11757 | 8886 | 2263 | — |
| .md | source | 128 | 12303 | — | — | 232983 |
| .js | source | 18 | 15489 | 11295 | 3643 | — |
| .mjs | test | 25 | 9785 | 7778 | 1438 | — |
| .md | example | 1 | 23 | — | — | 352 |
| .cjs | source | 1 | 8 | 7 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Clearailhc/clearai-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/Clearailhc/clearai-dsh/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/Clearailhc/clearai-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立评估如何约束研究结案，是否值得承担额外模型成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 研究工作流相对普通任务循环改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ClearAI 面向需要把反复研究形成可引用知识结构的人，要求问题、候选假设、可证伪判据、证据与有边界的结论。相对用待办列表标记完成，增量是让产物与判据进入独立评估，保留反驳和未解释项，而非仅模型说任务完成。预设续跑、子 Agent 和文件历史依赖 DSH，不能把宿主能力归为插件原创；本体术语和边的存在也不保证现实命题为真。合格交付应是其他人能检查证据及边界的答案，不是图的节点数量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-79](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/README.md#L41-L79)

作者将研究约束与原生宿主能力分开。

<details>
<summary>查看原文（39行）</summary>

```text
## What you get: a domain ontology

A **domain ontology** that grows as you research:

- **Vocabulary** — the language your project speaks: concepts, predicates, value forms, units. Conventions themselves carry no truth value; sentences written with them do.
- **Established entries** — knowledge that passed the loop: each with its boundary, support level, and evidence chain. Each entry states its boundary explicitly, so it can be cited safely.
- **Ontology graph and entity graph** — what your domain looks like (structure), and what you have actually verified (the state of play).
- **Conflict readings** — contradictory conclusions surface automatically; the system reports them, and retracting or keeping is your decision.

## How you get it: the Epistemic Loop

Most agent loops track one thing: whether the task is done. The Epistemic Loop also tracks **what makes a conclusion trustworthy**:

| | Task loop | Epistemic loop |
|---|---|---|
| Driving question | What next? | What do we know, and on what grounds? |
| Completion | The model declares it | The system computes it from delivered evidence |
| Verdict | Whoever did it, says so | Separated — above a level, the doer cannot judge themselves |
| Failure | Deleted, retried, forgotten | Kept: a refuted hypothesis is a result, not noise |
| Stopping | The model feels it is done | Every candidate and anomaly that could change the answer is handled, or written into the open points |
| What accumulates | A chat transcript | **An ontology**: every edge earned through the loop |

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/diagrams/epistemic-loop-hero-dark.png">
  <img src="docs/diagrams/epistemic-loop-hero.png" alt="The Epistemic Loop" width="1000">
</picture>

*Inside the ring is the instrument's read-out: the L0–L4 axis, the **pre-registered** threshold as a dashed line, and five observations with error bars — the supported one filled, the inconclusive drawn as a dashed circle, the refuted left in place with a slash through it (nothing is deleted). The emerald dot at the opening is the one reading that crossed the threshold and settled as a fact.*

In the loop the ontology comes first, not last:

- **The ontology is written at framing.** Which quantities the answer involves, what measures each one, how the reading is checked, and how the quantities affect each other are written in one go with the framing. A measure with no measuring method cannot be framed.
- **The ontology yields the candidates.** Each question lists at least two candidate hypotheses, each naming the relation it comes from; before each step the model writes a prediction per candidate, and a step that predicts the same for all of them is flagged as unable to tell them apart.
- **Anomalies need a destination.** A reading that does not fit the prediction or the ontology becomes an unexplained item: explained, ruled out with a reason, or written into the answer. One that touches an established fact sends that fact back to awaiting check.
- **Answers are delivered per question.** Each in four parts: conclusion / basis / open points / for you to decide. While a candidate still under examination or an open unexplained item is missing from the answer, the goal cannot close as achieved.

State is derived from the session record with no second store; the tools the model holds contain no field in which it could declare a step complete, and a goal completes only after independent evaluation. ClearAI does only what the host cannot — the epistemic contract, the domain ontology, presentation; goal continuation, subagents, asking you, deliverable cards and file history all come from DSH itself.

ClearAI does **not** claim recursive self-improvement. It provides the epistemic substrate a self-improving system would need. See [Positioning](docs/positioning.md) and the [OpenRSI survey](docs/research-openrsi.md).
```

</details>

**依据 2 · 源码核查**：[preset/plugins/clearai-kernel.js:3690-3700](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L3690-L3700)

评估后的新未解释项仍需进入答案。

<details>
<summary>查看原文（11行）</summary>

```text
			/**
			 * **停止检查在审计之后再做一次**:评估者这次审计里新报的未解释项(做的人没登记、或排除理由站不住),
			 * 只要它没说「不影响结论」,也要在结论里有交代。审计结算已经落账,这些项会挂在卡上;
			 * 补写 `answers` 后再结案,材料没变,裁决复用,不再花一次评估。
			 * 只在审计之前看的话,评估者指出的问题从不经过停止检查。
			 */
			const afterAudit = previewOf(hostService, sessionId, mutations)
			if (afterAudit === null) return fail('host_unavailable', '审计后无法重新核对材料,保持开放', { mutations })
			if (CFG.requireAnswers) {
				const missing = unsettledForAnswers(afterAudit.state, afterAudit.derived, answers)
				if (missing.length) return fail('answers_incomplete', `审计后仍有未处理事项:\n${missing.join('\n')}`, { mutations })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 评估派发、中断与结案是否真正受系统控制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

关键链不是单纯的独立评审提示词。kernel 在 await 派发前记录 audit/dispatched 并 flush，记录不可持久化时返回 unknown 且不派发；派发失败明确结算 unknown。评估预设的工具面既尝试隐藏非允许工具，也注册运行 guard，避免只在界面上隐藏。目标结案在评估不成立时返回 goal_not_achieved，评估后重读状态，仍有未解释项则保持开放；后面才写 goal/closed 并完成原生目标。可借鉴的是材料摘要绑定裁决、先记录外部派发、错误时拒绝升级；这些是源码可见协议，不等于真实中断恢复全部通过。

#### 证据与依据

**依据 1 · 源码核查**：[preset/plugins/clearai-kernel.js:1782-1812](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L1782-L1812)

派发前持久化及失败收束。

<details>
<summary>查看原文（31行）</summary>

```text
			const pendingId = `audit:pending:${auditPathComponent(`${sessionId}:${kind}:${step.id}:${digest}:${auditKey}`).slice(0, 32)}`
			landFact(sessionId, { t: 'audit/dispatched', id: pendingId, step: step.id, plan: plan?.id ?? 'goal', kind, digest, capability: null, evaluator_session: null, status: 'dispatching', goal_id: nativeBefore?.id, goal_revision: nativeBefore?.revision })
			try { await flushFacts(sessionId) } catch (error) {
				mutations.push({ t: 'audit/settled', id: pendingId, step: step.id, verdict: 'unknown', holds: 'unknown', basis: String(error.message), shortfalls: ['audit_dispatch_not_durable'], card_path: null, digest })
				return { holds: 'unknown', results: [], basis: '派发记录未持久保存,未派发评估者', shortfalls: ['audit_dispatch_not_durable'], cardPath: null, digest, mutations }
			}
			const rerunDir = CFG.auditRerun ? rerunCopy(sessionId, auditKey) : null
			const dispatched = await dispatchSubRun({
				label: `${kind === 'goal_audit' ? tr('目标评估者', 'Goal evaluator') : tr('评估者', 'Evaluator')} · ${step.id} · ${pendingId}`,
				persona: evaluatorDiscipline(),
				prompt: evaluatorPrompt(initialState, step, gate, sessionId, rerunDir),
				outputSchema: verdictSchema(),
				toolFilter: { allow: resolveToolFace(agent, rerunDir === null ? CFG.auditToolFilter : [...CFG.auditToolFilter, process.platform === 'win32' ? 'pwsh' : 'bash', 'job_output', 'job_list', 'job_kill']) },
				parent: agent,
				signal,
			})
			if (dispatched.ok !== true) {
				dropRerunCopy(rerunDir)
				/**
				 * 派不出去:把那条"正在派"如实结掉。结算与派发**同 id**,且上面那条 pending
				 * 走的是独立落账通道、在 `withPendingFacts` 的合并结果里排在前面,所以折法先建记录、
				 * 再结它——账上不会留一条永远 `verdict=null` 的悬空派发。
				 */
				mutations.push({ t: 'audit/settled', id: pendingId, step: step.id, verdict: 'unknown', holds: 'unknown', basis: tr(`独立评估者无法派遣(${dispatched.reason})`, `The independent evaluator could not be dispatched (${dispatched.reason})`), shortfalls: ['audit_dispatch_failed'], card_path: null, digest })
				return { holds: 'unknown', results: [], basis: tr(`独立评估者无法派遣(${dispatched.reason})`, `The independent evaluator could not be dispatched (${dispatched.reason})`), shortfalls: ['audit_dispatch_failed'], cardPath: null, mutations }
			}
			mutations.push(landFact(sessionId, { t: 'audit/dispatched', id: pendingId, step: step.id, plan: plan?.id ?? 'goal', kind, evaluator_session: String(dispatched.run.id), capability: dispatched.capability, digest, status: 'dispatched' }))
			try { await flushFacts(sessionId) } catch (error) {
				try { await dispatched.run.dispose?.() } catch {}
				dropRerunCopy(rerunDir)
				mutations.push({ t: 'audit/settled', id: pendingId, step: step.id, verdict: 'unknown', holds: 'unknown', basis: String(error.message), shortfalls: ['audit_child_not_durable'], card_path: null, digest })
```

</details>

**依据 2 · 源码核查**：[preset/plugins/clearai-evaluator-face.js:27-59](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-evaluator-face.js#L27-L59)

限制工具视图并执行 guard。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx, config = {}) {
	const allow = new Set([...(Array.isArray(config.allow) ? config.allow : []), ...ALWAYS])
	if (allow.size === ALWAYS.length) throw new Error('clearai-evaluator-face: config.allow must list the evaluator tools')
	const tools = ctx.tools

	/**
	 * 只管评估者自己。restriction / guard 注册在预设作用域里,本来就只覆盖加入这个预设的 agent;
	 * 若宿主把这一层当成全局(作用域判断变了),再按 agent 实际加入的预设核一遍,绝不误伤主会话。
	 */
	let scoped = true
	const presets = () => {
		try { return ctx.get('agentPresets') } catch { return undefined }
	}
	const isEvaluator = (agent) => {
		if (scoped) return true
		const composed = agent?.ctx === undefined ? undefined : presets()?.composedPreset?.(agent.ctx)
		return composed === PRESET_ID
	}

	try {
		const inherited = [...(tools.view?.(undefined)?.restrictableNames ?? [])]
		const deny = inherited.filter((toolName) => !allow.has(toolName) && toolName !== 'run_code')
		if (deny.length > 0) tools.restrict({ deny })
	} catch (error) {
		const message = String(error?.message ?? error)
		if (/scoped context/.test(message)) scoped = false
		ctx.logger?.warn?.(`clearai-evaluator-face: could not hide inherited tools (${message.slice(0, 160)}); the execution guard still applies`)
	}

	tools.guard((exec) => {
		if (allow.has(exec?.name) || !isEvaluator(exec?.agent)) return undefined
		return `The ClearAI evaluator is read-only: "${exec?.name}" is outside its tool face (${[...allow].join(', ')}). Verify with the allowed tools and report the limitation in the verdict.`
	})
```

</details>

**依据 3 · 源码核查**：[preset/plugins/clearai-kernel.js:3682-3700](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L3682-L3700)

审计失败和审计后再检查。

<details>
<summary>查看原文（19行）</summary>

```text
				const preview = previewOf(hostService, sessionId, mutations)
				return fail(
					'goal_not_achieved',
					tr(`目标还没达成,保持开放。独立评估者认为判据${audit.holds === 'no' ? '没有达成' : '判不了是否达成'}。依据:${plainIds(sessionId, audit.basis)}${audit.shortfalls.length > 0 ? `\n缺口(逐条):\n${audit.shortfalls.map((item) => `- ${plainIds(sessionId, verdictText([item]))}`).join('\n')}` : ''}\n还没落定的步骤:${unfinished.length === 0 ? '无' : unfinished.map((step) => `第 ${step.ordinal} 步(${step.id})`).join('、')}`, `Goal not achieved yet; it stays open. The independent evaluator found the criteria ${audit.holds === 'no' ? 'not met' : 'impossible to judge'}. Basis: ${plainIds(sessionId, audit.basis)}${audit.shortfalls.length > 0 ? `\nShortfalls:\n${audit.shortfalls.map((item) => `- ${plainIds(sessionId, verdictText([item]))}`).join('\n')}` : ''}\nSteps not settled: ${unfinished.length === 0 ? 'none' : unfinished.map((step) => `step ${step.ordinal} (${step.id})`).join(', ')}`) +
						(preview === null ? tr('\n(状态卡这一刻取不到:宿主读面不可用。已经发生的事实照旧落账;先看当前账本再谈重试。)', '\n(The status card is unavailable right now: the host read side is down. Facts that happened are still recorded; check the ledger before retrying.)') : cardTail(sessionId, preview)),
					{ mutations },
				)
			}
			/**
			 * **停止检查在审计之后再做一次**:评估者这次审计里新报的未解释项(做的人没登记、或排除理由站不住),
			 * 只要它没说「不影响结论」,也要在结论里有交代。审计结算已经落账,这些项会挂在卡上;
			 * 补写 `answers` 后再结案,材料没变,裁决复用,不再花一次评估。
			 * 只在审计之前看的话,评估者指出的问题从不经过停止检查。
			 */
			const afterAudit = previewOf(hostService, sessionId, mutations)
			if (afterAudit === null) return fail('host_unavailable', '审计后无法重新核对材料,保持开放', { mutations })
			if (CFG.requireAnswers) {
				const missing = unsettledForAnswers(afterAudit.state, afterAudit.derived, answers)
				if (missing.length) return fail('answers_incomplete', `审计后仍有未处理事项:\n${missing.join('\n')}`, { mutations })
```

</details>

**依据 4 · 源码核查**：[preset/plugins/clearai-kernel.js:3744-3754](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L3744-L3754)

通过后才写目标完成与原生完成。

<details>
<summary>查看原文（11行）</summary>

```text
			const refutedAtClose = [...judged].filter(([, item]) => item.verdict === 'refute').map(([id]) => id)
			const factReview =
				refutedAtClose.length === 0
					? ''
					: await reviewRefutedFacts(exec, sessionId, state, refutedAtClose, (audit.results ?? []).find((item) => item.verdict === 'refute')?.basis ?? audit.basis, mutations)
			const untouched = derived.hypotheses.filter(
				(hypothesis) =>
					!judged.has(hypothesis.id) && (hypothesis.supportedLevel === null || hypothesis.supportedLevel === undefined) && (hypothesis.refutations ?? 0) === 0 && (hypothesis.inconclusive ?? 0) === 0,
			)
			mutations.push({ t: 'goal/closed', id: goal.id, status: 'achieved', verdict: 'support', note: args.note ?? null, unjudged: untouched.map((hypothesis) => hypothesis.id), ...(answers.length > 0 ? { answers } : {}) })
			const continuationNote = completeNativeGoal(exec.agent)
```

</details>

#### 缺口

- 实际宿主重启和子会话恢复未测
  **影响**：无法保证所有异常下恰好一次或无状态分叉
  **进一步探讨**：构造派发后中断、裁决回来前重启并核对账本及子会话

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖和评估成本会怎样限制可信结论？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

发布包依赖 Node>=22 与声明 DSH>=0.2.0-rc.2，构建脚本把 preset 源组合派生成宿主可发现的声明行，需通过正确预设进入。独立评估还依赖子 Agent 服务、可访问证据和模型预算；执行者与评估者角色分离不保证错误独立，若同模型误读同一材料，系统仍可能把错误裁决作为已满足判据。只检查文件存在和结构合法也不验证实质内容，源码明确后续还要评估。首次需掌握问题和判据写法，持续多次模型评估及人工处理争议，失败时读账本而非重复派发；没有合格研究数量和调用账单，单位报告费用与节时未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-45](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/package.json#L38-L45)

Node、宿主和运行依赖声明。

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.0-rc.2"
  },
  "dependencies": {
    "zod": "^4.6.1"
  },
  "dsh": {
```

**依据 2 · 源码核查**：[tools/build-package.mjs:100-113](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/tools/build-package.mjs#L100-L113)

预设发现依靠派生声明行。

<details>
<summary>查看原文（14行）</summary>

```text
for (const name of readdirSync(join(PORT, 'preset'))) {
	copy(join(PORT, 'preset', name), join(OUT, 'presets', 'clearai', name))
}

// ── ②′ 预设声明行:宿主 ≥0.1.7-alpha.1 的注册形态 ───────────────────────────
/**
 * 同一个预设**两个文件、一份源**:
 *   · 宿主的名册(本包要求宿主 ≥0.2.0-rc.2)只读**这里生成的** `presets/clearai/clearai.patch.yml` ——
 *     一条 `- id: preset-clearai` 声明行,`config.plugins` 里放整份插件列表;
 *   · `presets/clearai/agent.cordis.yml` 仍随包走,但宿主不读它:它是开发工具
 *     (`verify-deploy` / `e2e-run`)摊平预设用的源。
 * 两者都由 `preset/agent.cordis.yml` 派生,不手抄第二份(手抄就是第二本账)。
 *
 * 为什么声明行文件放在 `presets/clearai/` 里:声明行 plugins 里的**相对基准**
```

</details>

**依据 3 · 源码核查**：[preset/plugins/clearai-kernel.js:1782-1808](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L1782-L1808)

持久记录及派发成本边界。

<details>
<summary>查看原文（27行）</summary>

```text
			const pendingId = `audit:pending:${auditPathComponent(`${sessionId}:${kind}:${step.id}:${digest}:${auditKey}`).slice(0, 32)}`
			landFact(sessionId, { t: 'audit/dispatched', id: pendingId, step: step.id, plan: plan?.id ?? 'goal', kind, digest, capability: null, evaluator_session: null, status: 'dispatching', goal_id: nativeBefore?.id, goal_revision: nativeBefore?.revision })
			try { await flushFacts(sessionId) } catch (error) {
				mutations.push({ t: 'audit/settled', id: pendingId, step: step.id, verdict: 'unknown', holds: 'unknown', basis: String(error.message), shortfalls: ['audit_dispatch_not_durable'], card_path: null, digest })
				return { holds: 'unknown', results: [], basis: '派发记录未持久保存,未派发评估者', shortfalls: ['audit_dispatch_not_durable'], cardPath: null, digest, mutations }
			}
			const rerunDir = CFG.auditRerun ? rerunCopy(sessionId, auditKey) : null
			const dispatched = await dispatchSubRun({
				label: `${kind === 'goal_audit' ? tr('目标评估者', 'Goal evaluator') : tr('评估者', 'Evaluator')} · ${step.id} · ${pendingId}`,
				persona: evaluatorDiscipline(),
				prompt: evaluatorPrompt(initialState, step, gate, sessionId, rerunDir),
				outputSchema: verdictSchema(),
				toolFilter: { allow: resolveToolFace(agent, rerunDir === null ? CFG.auditToolFilter : [...CFG.auditToolFilter, process.platform === 'win32' ? 'pwsh' : 'bash', 'job_output', 'job_list', 'job_kill']) },
				parent: agent,
				signal,
			})
			if (dispatched.ok !== true) {
				dropRerunCopy(rerunDir)
				/**
				 * 派不出去:把那条"正在派"如实结掉。结算与派发**同 id**,且上面那条 pending
				 * 走的是独立落账通道、在 `withPendingFacts` 的合并结果里排在前面,所以折法先建记录、
				 * 再结它——账上不会留一条永远 `verdict=null` 的悬空派发。
				 */
				mutations.push({ t: 'audit/settled', id: pendingId, step: step.id, verdict: 'unknown', holds: 'unknown', basis: tr(`独立评估者无法派遣(${dispatched.reason})`, `The independent evaluator could not be dispatched (${dispatched.reason})`), shortfalls: ['audit_dispatch_failed'], card_path: null, digest })
				return { holds: 'unknown', results: [], basis: tr(`独立评估者无法派遣(${dispatched.reason})`, `The independent evaluator could not be dispatched (${dispatched.reason})`), shortfalls: ['audit_dispatch_failed'], cardPath: null, mutations }
			}
			mutations.push(landFact(sessionId, { t: 'audit/dispatched', id: pendingId, step: step.id, plan: plan?.id ?? 'goal', kind, evaluator_session: String(dispatched.run.id), capability: dispatched.capability, digest, status: 'dispatched' }))
```

</details>

**依据 4 · 源码核查**：[preset/plugins/clearai-kernel.js:3690-3700](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L3690-L3700)

完成需可解释未决项，不是保证答案正确。

<details>
<summary>查看原文（11行）</summary>

```text
			/**
			 * **停止检查在审计之后再做一次**:评估者这次审计里新报的未解释项(做的人没登记、或排除理由站不住),
			 * 只要它没说「不影响结论」,也要在结论里有交代。审计结算已经落账,这些项会挂在卡上;
			 * 补写 `answers` 后再结案,材料没变,裁决复用,不再花一次评估。
			 * 只在审计之前看的话,评估者指出的问题从不经过停止检查。
			 */
			const afterAudit = previewOf(hostService, sessionId, mutations)
			if (afterAudit === null) return fail('host_unavailable', '审计后无法重新核对材料,保持开放', { mutations })
			if (CFG.requireAnswers) {
				const missing = unsettledForAnswers(afterAudit.state, afterAudit.derived, answers)
				if (missing.length) return fail('answers_incomplete', `审计后仍有未处理事项:\n${missing.join('\n')}`, { mutations })
```

</details>

#### 缺口

- 评估者相关错误及真实研究质量未知
  **影响**：形式约束不能证明知识可信
  **进一步探讨**：加入错误证据和不可判定材料，比较独立评估是否识别

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证独立评估有用，谁适合试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

有固定材料、明确验收判据与人工复核能力的研究团队可试用；开放闲聊或无法给出反证的任务不适合先承担这套流程。待验证方向是按可观察错误风险决定何时需要独立评估，而非每个小步骤都付出同样成本；保留系统拒绝结案和可恢复派发，不把成本优化变成取消语义判断。用同一材料集比较普通待办、人工抽查和 ClearAI，加入错误证据、未决反例及中断，记录错误结案率、纠错时间及全部模型费用。若只增加仪式和费用而没有减少错误结案，应回到轻量研究清单及人工审阅。

#### 证据与依据

**依据 1 · 源码核查**：[preset/plugins/clearai-kernel.js:3682-3700](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/preset/plugins/clearai-kernel.js#L3682-L3700)

有明确错误结案拒绝点，可作为验证指标。

<details>
<summary>查看原文（19行）</summary>

```text
				const preview = previewOf(hostService, sessionId, mutations)
				return fail(
					'goal_not_achieved',
					tr(`目标还没达成,保持开放。独立评估者认为判据${audit.holds === 'no' ? '没有达成' : '判不了是否达成'}。依据:${plainIds(sessionId, audit.basis)}${audit.shortfalls.length > 0 ? `\n缺口(逐条):\n${audit.shortfalls.map((item) => `- ${plainIds(sessionId, verdictText([item]))}`).join('\n')}` : ''}\n还没落定的步骤:${unfinished.length === 0 ? '无' : unfinished.map((step) => `第 ${step.ordinal} 步(${step.id})`).join('、')}`, `Goal not achieved yet; it stays open. The independent evaluator found the criteria ${audit.holds === 'no' ? 'not met' : 'impossible to judge'}. Basis: ${plainIds(sessionId, audit.basis)}${audit.shortfalls.length > 0 ? `\nShortfalls:\n${audit.shortfalls.map((item) => `- ${plainIds(sessionId, verdictText([item]))}`).join('\n')}` : ''}\nSteps not settled: ${unfinished.length === 0 ? 'none' : unfinished.map((step) => `step ${step.ordinal} (${step.id})`).join(', ')}`) +
						(preview === null ? tr('\n(状态卡这一刻取不到:宿主读面不可用。已经发生的事实照旧落账;先看当前账本再谈重试。)', '\n(The status card is unavailable right now: the host read side is down. Facts that happened are still recorded; check the ledger before retrying.)') : cardTail(sessionId, preview)),
					{ mutations },
				)
			}
			/**
			 * **停止检查在审计之后再做一次**:评估者这次审计里新报的未解释项(做的人没登记、或排除理由站不住),
			 * 只要它没说「不影响结论」,也要在结论里有交代。审计结算已经落账,这些项会挂在卡上;
			 * 补写 `answers` 后再结案,材料没变,裁决复用,不再花一次评估。
			 * 只在审计之前看的话,评估者指出的问题从不经过停止检查。
			 */
			const afterAudit = previewOf(hostService, sessionId, mutations)
			if (afterAudit === null) return fail('host_unavailable', '审计后无法重新核对材料,保持开放', { mutations })
			if (CFG.requireAnswers) {
				const missing = unsettledForAnswers(afterAudit.state, afterAudit.derived, answers)
				if (missing.length) return fail('answers_incomplete', `审计后仍有未处理事项:\n${missing.join('\n')}`, { mutations })
```

</details>

**依据 2 · 作者声明**：[README.md:70-79](https://github.com/Clearailhc/clearai-dsh/blob/47f8cda175ed3bf73162fa3dc47a4c0d3874a542/README.md#L70-L79)

问题与反例流程及宿主归属。

<details>
<summary>查看原文（10行）</summary>

```text
In the loop the ontology comes first, not last:

- **The ontology is written at framing.** Which quantities the answer involves, what measures each one, how the reading is checked, and how the quantities affect each other are written in one go with the framing. A measure with no measuring method cannot be framed.
- **The ontology yields the candidates.** Each question lists at least two candidate hypotheses, each naming the relation it comes from; before each step the model writes a prediction per candidate, and a step that predicts the same for all of them is flagged as unable to tell them apart.
- **Anomalies need a destination.** A reading that does not fit the prediction or the ontology becomes an unexplained item: explained, ruled out with a reason, or written into the answer. One that touches an established fact sends that fact back to awaiting check.
- **Answers are delivered per question.** Each in four parts: conclusion / basis / open points / for you to decide. While a candidate still under examination or an open unexplained item is missing from the answer, the goal cannot close as achieved.

State is derived from the session record with no second store; the tools the model holds contain no field in which it could declare a step complete, and a goal completes only after independent evaluation. ClearAI does only what the host cannot — the epistemic contract, the domain ontology, presentation; goal continuation, subagents, asking you, deliverable cards and file history all come from DSH itself.

ClearAI does **not** claim recursive self-improvement. It provides the epistemic substrate a self-improving system would need. See [Positioning](docs/positioning.md) and the [OpenRSI survey](docs/research-openrsi.md).
```

</details>

#### 缺口

- 风险分级评估尚无结果
  **影响**：仍为新设计假设
  **进一步探讨**：在错误率不升前提下比较总费用，不能只看调用数减少

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
