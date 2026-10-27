# dsh-subagent-role-router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e606490](https://github.com/643048695/dsh-subagent-role-router/tree/e6064904e116910c4c1aa403d40505304653ee23)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/643048695/dsh-subagent-role-router)
<!-- END META -->

> **实现功能**：按探索、规划、修补角色为子代理分配模型候补池，并处理故障转移与 fork 窗口切片。

> **核心亮点**：相对逐次显式指定模型，它把角色分类、同角色并发工位、短期冷却和跨供应商失败切换合并在派发层；相对上游默认模型插件，新增角色池和保守的 fork 活跃窗口，但关键词分类仍是启发式，不是任务语义证明。 详见[Q03](#research-q03)。

> **风险与缺陷**：最关键质疑是误分类和失败归因会否把任务送往不合适模型或重复消耗额度。默认模糊任务归 patch 降低弱模型误用，却可能提高费用；认证失败也切换会暂时保活，但可能掩盖需要修复的凭据。切片放弃条件保护正确性，却在长会话上退回原始大种子。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-subagent-role-router，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-subagent-role-router 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-subagent-role-router 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-subagent-role-router 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-subagent-role-router 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-subagent-role-router 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-subagent-role-router 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-subagent-role-router？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多子代理开发中，操作者希望探索任务使用便宜模型、修补任务使用更强模型，并在单一路由限流时保持派发。简单基线是每次调用显式传 provider/model；合格结果是角色匹配、显式覆盖不被改写、失败候补可见且 fork 上下文仍完整。 详见[Q01](#research-q01)。

多子代理开发中，操作者希望探索任务使用便宜模型、修补任务使用更强模型，并在单一路由限流时保持派发。简单基线是每次调用显式传 provider/model；合格结果是角色匹配、显式覆盖不被改写、失败候补可见且 fork 上下文仍完整。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 角色路由 | 按 explore/plan/patch 选择模型 | 无标签时关键词判断，模糊任务默认 patch |
| 候补池与故障转移 | 并发分摊并绕开短时失败 | 需要多条真实可用路由；只切指定故障类 |
| fork 窗口切片 | 缩小长会话子代理 seed | 映射不完整即回退完整历史 |
| 路由可见性 | 向界面和子代理说明实际路由 | 只覆盖子代理，不改变主代理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH peer 接口 | 必需 | 接入 subagent、LLM、设置和客户端 UI | 版本超出声明区间可能无法挂载 |
| 模型 provider 与凭据 | 必需 | 执行子代理请求 | 失败会冷却/切换，耗尽后抛错 |
| 多候补配置 | 特定能力必需 | 并发工位与故障转移 | 退化为单路由 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 管理员填写角色池与默认 models | 保存后下一次派发生效；配置不全回落 |
| 派发 | 调用方创建子代理 | 显式路由优先，否则插件分类选候补 |
| 执行 | 后台监听请求和失败 | 可迁移故障切候补并记录 warn |
| 验收 | 操作者核对路由行和产物 | 误路由时显式指定并调整规则 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无固定现金；需已有模型账户 | 配置三类角色与候补、做标签校准 | 模型价格和配置时长未知 |
| 持续使用 | 各候补实际 token 与失败重试计费 | 查看路由/告警并修正分类 | 应按合格子代理任务统计 |
| 失败恢复 | 可能多供应商各产生失败请求费用 | 修密钥、删候补或显式固定路由 | 全部候补耗尽后返回原错 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 角色分流 | 源码实现四级判定和显式覆盖优先 | 真实任务误分类率 |
| 并发/故障转移 | 源码维护占用、冷却与候补切换 | 同预算合格率和总 token |
| fork 缩减 | 源码在映射完整时重写 seed | 目标 Host 长会话延迟与语义保真 |

> **思考**：最关键质疑是误分类和失败归因会否把任务送往不合适模型或重复消耗额度。默认模糊任务归 patch 降低弱模型误用，却可能提高费用；认证失败也切换会暂时保活，但可能掩盖需要修复的凭据。切片放弃条件保护正确性，却在长会话上退回原始大种子。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对逐次显式指定模型，它把角色分类、同角色并发工位、短期冷却和跨供应商失败切换合并在派发层；相对上游默认模型插件，新增角色池和保守的 fork 活跃窗口，但关键词分类仍是启发式，不是任务语义证明。 详见[Q03](#research-q03)。

相对逐次显式指定模型，它把角色分类、同角色并发工位、短期冷却和跨供应商失败切换合并在派发层；相对上游默认模型插件，新增角色池和保守的 fork 活跃窗口，但关键词分类仍是启发式，不是任务语义证明。 详见[Q03](#research-q03)。

监听器、provider 包装和卸载恢复都限定在自身包装仍为当前值时撤销，避免覆盖后来者；路由状态按 agent 清理。可复用点是“派发时选择、运行中故障转移、事后可见性”三段分离；迁移需宿主具备相同瀑布事件与 provider 可包装接口。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键质疑是误分类和失败归因会否把任务送往不合适模型或重复消耗额度。默认模糊任务归 patch 降低弱模型误用，却可能提高费用；认证失败也切换会暂时保活，但可能掩盖需要修复的凭据。切片放弃条件保护正确性，却在长会话上退回原始大种子。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已经并行使用多个子代理、拥有多供应商额度且能审查路由日志的团队做隔离试用；单模型、强合规固定路由或不能容忍凭据切换的环境不宜启用。先用带显式角色标签的小任务，验收角色命中、显式覆盖、冷却恢复和 seed 完整性，出现跨角色切换或重复烧额度即停用。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了角色判定、候补占用/冷却、请求失败切换、实际路由注入及 fork seed 保守回退；尚未在真实多供应商任务中测量角色混淆、总 token、故障转移成功率与长会话语义保真，因此贡献成立到路由机制而非成本或质量收益。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 e6064904e116910c4c1aa403d40505304653ee23 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：先对 30 个带人工角色金标的子代理任务做显式路由与自动路由对照；同时注入限流、无权限模型和长 fork seed，按角色混淆、合格产物、总 token、重试数与 seed 引用完整率判定。

**分析版本**

- **仓库**：[643048695/dsh-subagent-role-router](https://github.com/643048695/dsh-subagent-role-router)
- **版本号**：4.0.0（[固定提交 e606490](https://github.com/643048695/dsh-subagent-role-router/tree/e6064904e116910c4c1aa403d40505304653ee23)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用任务声明而非关键词作为角色契约，并把预算上限纳入候补选择，可同时降低误路由和超额重试。最小实验对同一组 30 个探索/规划/修补任务比较显式基线与自动路由，记录角色混淆矩阵、合格率、总 token、失败重试和人工改派次数；任一任务质量下降或成本不降即削弱假设。 详见[Q08](#research-q08)。

先对 30 个带人工角色金标的子代理任务做显式路由与自动路由对照；同时注入限流、无权限模型和长 fork seed，按角色混淆、合格产物、总 token、重试数与 seed 引用完整率判定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1316 | — | — | 32758 |
| .js | source | 3 | 3729 | 2470 | 1110 | — |
| .mjs | test | 4 | 1153 | 927 | 93 | — |
| .mjs | source | 1 | 110 | 60 | 38 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+created%3A2026-09-22T16%3A03%3A15.556Z..2026-10-22T16%3A03%3A15.556Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-subagent-role-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A03%3A15.556Z..2026-10-22T16%3A03%3A15.556Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-subagent-role-router 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-subagent-role-router，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

多子代理开发中，操作者希望探索任务使用便宜模型、修补任务使用更强模型，并在单一路由限流时保持派发。简单基线是每次调用显式传 provider/model；合格结果是角色匹配、显式覆盖不被改写、失败候补可见且 fork 上下文仍完整。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/README.md#L1-L15)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-subagent-role-router

[English](README.en.md) | 中文

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的子代理（subagent）派发选择路由：**按角色分流**、**每个角色可配多个候补并按忙闲顺延**、多模型轮换、跨供应商故障转移，并为 fork 类派发做**活跃窗口切片**。

当创建子代理时未显式指定 `model` 时，本插件按配置注入路由 —— 因此所有 `subagent`、`subagent_fork` 以及任何省略 `agentOptions` 的工具调用都会经过它。显式传参的覆盖始终生效；配置缺失或不完整时保持原有行为（子代理继承父会话路由）。

> ### 来源与署名
>
> 本项目基于 [**dingminhua/dsh-subagent-default-model**](https://github.com/dingminhua/dsh-subagent-default-model)（MIT，Copyright (c) 2026 **LaoDing**）二次开发。
>
> 原作提供了本项目的基础能力：默认模型注入、多模型分配策略、跨供应商故障转移、路由可见性。本项目在其之上新增了**按角色路由**、**角色候补池（忙闲顺延 / 溢出并发 / 失败冷却）**、**fork 活跃窗口切片**、**agent-teams 豁免**四项能力。原作的版权与许可声明完整保留在 [LICENSE](LICENSE) 中。

## 本插件比原作多了什么
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-subagent-role-router 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

插件包裹 subagent provider，在派发时从标签、提示词与默认规则判定 explore/plan/patch，再按候补占用与冷却选择路由；agent/request-error 只对连接、配额等可迁移故障换候补，agent/request/pre-step 记录实际路由并注入上下文；fork provider 仅在事件映射完整时裁切最近轮次。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:718-830](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js#L718-L830)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（113行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
		ctx.logger.warn(
			`[dsh-subagent-role-router] subagent %s failed with %s on turn %d step %d; switching to %s/%s (attempt %d/%d, strategy=%s)`,
			agent.id,
			failure.code,
			turn,
			step,
			view.entries[index].provider,
			view.entries[index].model,
			(current?.count ?? 0) + 1,
			view.entries.length,
			view.strategy
		);
		// An auth switch is called out explicitly: the point of allowing it is
		// resilience, and the risk it introduces is that a broken credential
		// becomes invisible. This line is what keeps it visible — without it,
		// silently rerouting around a bad key would hide a real misconfiguration.
		if (isAuthFailure(failure.code)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the credentials for the failing provider ${payload.provider ?? "(unknown)"} were refused (%s). This is NOT a connection problem: that provider's API key is likely invalid, expired, or unauthorised. Failover is switching the subagent to %s/%s — verify that provider's key, because the failure will keep recurring until it is fixed.`,
				failure.code,
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		// An unusable candidate is a CONFIGURATION problem, and unlike a rate
		// limit it will not heal by itself. Say so once per failure, with the
		// offending route named, so the dead row can be fixed or removed instead
		// of quietly burning a slot forever.
		if (isUnusableCandidate(failure)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the candidate route %s/%s cannot serve this request (%s: %s). It is cooling down and the subagent is switching to %s/%s — remove or fix that row in the role candidate list, because this failure will repeat on every run.`,
				payload.provider ?? "(unknown)",
				agent?.session?.requestContext?.()?.model ?? "(unknown)",
				failure.code,
				failure.message ?? "(no message)",
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		return { kind: "retry" };
	});

	// On the rebuilt request for that subagent: swap the seed route for the
	// pending pool entry, carrying the target's OWN request controls.
	//
	// The inherited `reasoningEffort` is dropped because it belongs to the route
	// that just failed. The failure this fixes: without re-applying the target's
	// declared effort, the fallback is dispatched with the previous route's
	// thinking mode, and a provider whose thinking level must agree with the
	// effort rejects it with e.g. "invalid thinking type, only be disabled when
	// reasoning effort is none ...". That error is NOT retryable, so the
	// failover burns every remaining candidate on a request that can never
	// succeed — the subagent dies even though a healthy model was available.
	//
	// When the target declares no effort, sending the key as `undefined` is the
	// correct dispatch: the adapter then resolves the model's own
	// `defaultEffort` (or omits the reasoning option entirely), instead of
	// inheriting a level the target may not support.
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});

	ctx.effect(() => () => {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-subagent-role-router 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对逐次显式指定模型，它把角色分类、同角色并发工位、短期冷却和跨供应商失败切换合并在派发层；相对上游默认模型插件，新增角色池和保守的 fork 活跃窗口，但关键词分类仍是启发式，不是任务语义证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/README.md#L1-L15)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-subagent-role-router

[English](README.en.md) | 中文

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的子代理（subagent）派发选择路由：**按角色分流**、**每个角色可配多个候补并按忙闲顺延**、多模型轮换、跨供应商故障转移，并为 fork 类派发做**活跃窗口切片**。

当创建子代理时未显式指定 `model` 时，本插件按配置注入路由 —— 因此所有 `subagent`、`subagent_fork` 以及任何省略 `agentOptions` 的工具调用都会经过它。显式传参的覆盖始终生效；配置缺失或不完整时保持原有行为（子代理继承父会话路由）。

> ### 来源与署名
>
> 本项目基于 [**dingminhua/dsh-subagent-default-model**](https://github.com/dingminhua/dsh-subagent-default-model)（MIT，Copyright (c) 2026 **LaoDing**）二次开发。
>
> 原作提供了本项目的基础能力：默认模型注入、多模型分配策略、跨供应商故障转移、路由可见性。本项目在其之上新增了**按角色路由**、**角色候补池（忙闲顺延 / 溢出并发 / 失败冷却）**、**fork 活跃窗口切片**、**agent-teams 豁免**四项能力。原作的版权与许可声明完整保留在 [LICENSE](LICENSE) 中。

## 本插件比原作多了什么
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-subagent-role-router 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键质疑是误分类和失败归因会否把任务送往不合适模型或重复消耗额度。默认模糊任务归 patch 降低弱模型误用，却可能提高费用；认证失败也切换会暂时保活，但可能掩盖需要修复的凭据。切片放弃条件保护正确性，却在长会话上退回原始大种子。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:718-830](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js#L718-L830)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（113行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
		ctx.logger.warn(
			`[dsh-subagent-role-router] subagent %s failed with %s on turn %d step %d; switching to %s/%s (attempt %d/%d, strategy=%s)`,
			agent.id,
			failure.code,
			turn,
			step,
			view.entries[index].provider,
			view.entries[index].model,
			(current?.count ?? 0) + 1,
			view.entries.length,
			view.strategy
		);
		// An auth switch is called out explicitly: the point of allowing it is
		// resilience, and the risk it introduces is that a broken credential
		// becomes invisible. This line is what keeps it visible — without it,
		// silently rerouting around a bad key would hide a real misconfiguration.
		if (isAuthFailure(failure.code)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the credentials for the failing provider ${payload.provider ?? "(unknown)"} were refused (%s). This is NOT a connection problem: that provider's API key is likely invalid, expired, or unauthorised. Failover is switching the subagent to %s/%s — verify that provider's key, because the failure will keep recurring until it is fixed.`,
				failure.code,
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		// An unusable candidate is a CONFIGURATION problem, and unlike a rate
		// limit it will not heal by itself. Say so once per failure, with the
		// offending route named, so the dead row can be fixed or removed instead
		// of quietly burning a slot forever.
		if (isUnusableCandidate(failure)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the candidate route %s/%s cannot serve this request (%s: %s). It is cooling down and the subagent is switching to %s/%s — remove or fix that row in the role candidate list, because this failure will repeat on every run.`,
				payload.provider ?? "(unknown)",
				agent?.session?.requestContext?.()?.model ?? "(unknown)",
				failure.code,
				failure.message ?? "(no message)",
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		return { kind: "retry" };
	});

	// On the rebuilt request for that subagent: swap the seed route for the
	// pending pool entry, carrying the target's OWN request controls.
	//
	// The inherited `reasoningEffort` is dropped because it belongs to the route
	// that just failed. The failure this fixes: without re-applying the target's
	// declared effort, the fallback is dispatched with the previous route's
	// thinking mode, and a provider whose thinking level must agree with the
	// effort rejects it with e.g. "invalid thinking type, only be disabled when
	// reasoning effort is none ...". That error is NOT retryable, so the
	// failover burns every remaining candidate on a request that can never
	// succeed — the subagent dies even though a healthy model was available.
	//
	// When the target declares no effort, sending the key as `undefined` is the
	// correct dispatch: the adapter then resolves the model's own
	// `defaultEffort` (or omits the reasoning option entirely), instead of
	// inheriting a level the target may not support.
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});

	ctx.effect(() => () => {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-subagent-role-router 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

DSH 0.1.7/0.2.x 对应的九个 peer 接口、至少一条可用模型路由和各 provider 凭据；角色池与故障转移要两条以上候补，fork 优化依赖 subagent fork provider。缺配置时回落父会话或 models，切片不安全时回落完整 seed。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/README.md#L1-L15)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-subagent-role-router

[English](README.en.md) | 中文

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的子代理（subagent）派发选择路由：**按角色分流**、**每个角色可配多个候补并按忙闲顺延**、多模型轮换、跨供应商故障转移，并为 fork 类派发做**活跃窗口切片**。

当创建子代理时未显式指定 `model` 时，本插件按配置注入路由 —— 因此所有 `subagent`、`subagent_fork` 以及任何省略 `agentOptions` 的工具调用都会经过它。显式传参的覆盖始终生效；配置缺失或不完整时保持原有行为（子代理继承父会话路由）。

> ### 来源与署名
>
> 本项目基于 [**dingminhua/dsh-subagent-default-model**](https://github.com/dingminhua/dsh-subagent-default-model)（MIT，Copyright (c) 2026 **LaoDing**）二次开发。
>
> 原作提供了本项目的基础能力：默认模型注入、多模型分配策略、跨供应商故障转移、路由可见性。本项目在其之上新增了**按角色路由**、**角色候补池（忙闲顺延 / 溢出并发 / 失败冷却）**、**fork 活跃窗口切片**、**agent-teams 豁免**四项能力。原作的版权与许可声明完整保留在 [LICENSE](LICENSE) 中。

## 本插件比原作多了什么
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-subagent-role-router 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要为三个角色配置 provider/model/effort 或候补队列并核对配额；持续成本按每个子代理实际模型 token、失败重试次数与候补冷却误判计量；失败恢复要读 warn、修凭据或删不可用候补，全部候补失败后仍会抛出原错误。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:718-830](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js#L718-L830)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（113行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
		ctx.logger.warn(
			`[dsh-subagent-role-router] subagent %s failed with %s on turn %d step %d; switching to %s/%s (attempt %d/%d, strategy=%s)`,
			agent.id,
			failure.code,
			turn,
			step,
			view.entries[index].provider,
			view.entries[index].model,
			(current?.count ?? 0) + 1,
			view.entries.length,
			view.strategy
		);
		// An auth switch is called out explicitly: the point of allowing it is
		// resilience, and the risk it introduces is that a broken credential
		// becomes invisible. This line is what keeps it visible — without it,
		// silently rerouting around a bad key would hide a real misconfiguration.
		if (isAuthFailure(failure.code)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the credentials for the failing provider ${payload.provider ?? "(unknown)"} were refused (%s). This is NOT a connection problem: that provider's API key is likely invalid, expired, or unauthorised. Failover is switching the subagent to %s/%s — verify that provider's key, because the failure will keep recurring until it is fixed.`,
				failure.code,
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		// An unusable candidate is a CONFIGURATION problem, and unlike a rate
		// limit it will not heal by itself. Say so once per failure, with the
		// offending route named, so the dead row can be fixed or removed instead
		// of quietly burning a slot forever.
		if (isUnusableCandidate(failure)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the candidate route %s/%s cannot serve this request (%s: %s). It is cooling down and the subagent is switching to %s/%s — remove or fix that row in the role candidate list, because this failure will repeat on every run.`,
				payload.provider ?? "(unknown)",
				agent?.session?.requestContext?.()?.model ?? "(unknown)",
				failure.code,
				failure.message ?? "(no message)",
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		return { kind: "retry" };
	});

	// On the rebuilt request for that subagent: swap the seed route for the
	// pending pool entry, carrying the target's OWN request controls.
	//
	// The inherited `reasoningEffort` is dropped because it belongs to the route
	// that just failed. The failure this fixes: without re-applying the target's
	// declared effort, the fallback is dispatched with the previous route's
	// thinking mode, and a provider whose thinking level must agree with the
	// effort rejects it with e.g. "invalid thinking type, only be disabled when
	// reasoning effort is none ...". That error is NOT retryable, so the
	// failover burns every remaining candidate on a request that can never
	// succeed — the subagent dies even though a healthy model was available.
	//
	// When the target declares no effort, sending the key as `undefined` is the
	// correct dispatch: the adapter then resolves the model's own
	// `defaultEffort` (or omits the reasoning option entirely), instead of
	// inheriting a level the target may not support.
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});

	ctx.effect(() => () => {
```

</details>

#### 缺口

- 自动角色判定的真实混淆率未知
  **影响**：决定是否会把省钱变成质量损失
  **进一步探讨**：用固定任务集记录自动角色与人工金标、产物合格率和单任务 token

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-subagent-role-router 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

监听器、provider 包装和卸载恢复都限定在自身包装仍为当前值时撤销，避免覆盖后来者；路由状态按 agent 清理。可复用点是“派发时选择、运行中故障转移、事后可见性”三段分离；迁移需宿主具备相同瀑布事件与 provider 可包装接口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:718-830](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js#L718-L830)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（113行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
		ctx.logger.warn(
			`[dsh-subagent-role-router] subagent %s failed with %s on turn %d step %d; switching to %s/%s (attempt %d/%d, strategy=%s)`,
			agent.id,
			failure.code,
			turn,
			step,
			view.entries[index].provider,
			view.entries[index].model,
			(current?.count ?? 0) + 1,
			view.entries.length,
			view.strategy
		);
		// An auth switch is called out explicitly: the point of allowing it is
		// resilience, and the risk it introduces is that a broken credential
		// becomes invisible. This line is what keeps it visible — without it,
		// silently rerouting around a bad key would hide a real misconfiguration.
		if (isAuthFailure(failure.code)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the credentials for the failing provider ${payload.provider ?? "(unknown)"} were refused (%s). This is NOT a connection problem: that provider's API key is likely invalid, expired, or unauthorised. Failover is switching the subagent to %s/%s — verify that provider's key, because the failure will keep recurring until it is fixed.`,
				failure.code,
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		// An unusable candidate is a CONFIGURATION problem, and unlike a rate
		// limit it will not heal by itself. Say so once per failure, with the
		// offending route named, so the dead row can be fixed or removed instead
		// of quietly burning a slot forever.
		if (isUnusableCandidate(failure)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the candidate route %s/%s cannot serve this request (%s: %s). It is cooling down and the subagent is switching to %s/%s — remove or fix that row in the role candidate list, because this failure will repeat on every run.`,
				payload.provider ?? "(unknown)",
				agent?.session?.requestContext?.()?.model ?? "(unknown)",
				failure.code,
				failure.message ?? "(no message)",
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		return { kind: "retry" };
	});

	// On the rebuilt request for that subagent: swap the seed route for the
	// pending pool entry, carrying the target's OWN request controls.
	//
	// The inherited `reasoningEffort` is dropped because it belongs to the route
	// that just failed. The failure this fixes: without re-applying the target's
	// declared effort, the fallback is dispatched with the previous route's
	// thinking mode, and a provider whose thinking level must agree with the
	// effort rejects it with e.g. "invalid thinking type, only be disabled when
	// reasoning effort is none ...". That error is NOT retryable, so the
	// failover burns every remaining candidate on a request that can never
	// succeed — the subagent dies even though a healthy model was available.
	//
	// When the target declares no effort, sending the key as `undefined` is the
	// correct dispatch: the adapter then resolves the model's own
	// `defaultEffort` (or omits the reasoning option entirely), instead of
	// inheriting a level the target may not support.
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});

	ctx.effect(() => () => {
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是用任务声明而非关键词作为角色契约，并把预算上限纳入候补选择，可同时降低误路由和超额重试。最小实验对同一组 30 个探索/规划/修补任务比较显式基线与自动路由，记录角色混淆矩阵、合格率、总 token、失败重试和人工改派次数；任一任务质量下降或成本不降即削弱假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:718-830](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js#L718-L830)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（113行）</summary>

```text
	const disposeRequestError = ctx.on("agent/request-error", (payload, next) => {
		const { agent, turn, step, failure, signal } = payload;
		if (signal?.aborted) return next();
		if (!isSubagentAgent(agent)) return next();
		if (failure === void 0) return next();
		// Two ways in: the route was unreachable (rate limit, quota, transport…)
		// or the route cannot serve this request at all (model not allowed for
		// this account, unknown model, unsupported effort). The second class is
		// skipped-and-cooled exactly like the first — see CANDIDATE_UNUSABLE_CODES.
		if (!FAILOVER_ELIGIBLE_CODES.includes(failure.code) && !isUnusableCandidate(failure)) return next();
		// Cool the failing route down BEFORE deciding whether anything can be
		// switched to: a role pool with a single lane cannot fail over at all,
		// yet its model still deserves to be skipped by the NEXT delegation
		// instead of being handed the next task while it is still rate-limited.
		noteCooldown(ctx, state, agent, failure);
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const current = pending.get(agent.id);
		// The primary already failed (that triggered the first switch), so the
		// remaining candidates are the other pool entries: at most
		// `entries.length - 1` switches, then let the real error surface.
		if (current !== void 0 && current.count >= view.entries.length - 1) return next(); // pool exhausted
		const index = nextFailoverIndex(view, agent, current);
		// Remember every pool entry this run has already been switched to, so a
		// candidate that fails again is not selected a second time.
		const tried = new Set(current?.tried ?? []);
		tried.add(index);
		pending.set(agent.id, {
			index,
			tried,
			count: (current?.count ?? 0) + 1
		});
		ctx.logger.warn(
			`[dsh-subagent-role-router] subagent %s failed with %s on turn %d step %d; switching to %s/%s (attempt %d/%d, strategy=%s)`,
			agent.id,
			failure.code,
			turn,
			step,
			view.entries[index].provider,
			view.entries[index].model,
			(current?.count ?? 0) + 1,
			view.entries.length,
			view.strategy
		);
		// An auth switch is called out explicitly: the point of allowing it is
		// resilience, and the risk it introduces is that a broken credential
		// becomes invisible. This line is what keeps it visible — without it,
		// silently rerouting around a bad key would hide a real misconfiguration.
		if (isAuthFailure(failure.code)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the credentials for the failing provider ${payload.provider ?? "(unknown)"} were refused (%s). This is NOT a connection problem: that provider's API key is likely invalid, expired, or unauthorised. Failover is switching the subagent to %s/%s — verify that provider's key, because the failure will keep recurring until it is fixed.`,
				failure.code,
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		// An unusable candidate is a CONFIGURATION problem, and unlike a rate
		// limit it will not heal by itself. Say so once per failure, with the
		// offending route named, so the dead row can be fixed or removed instead
		// of quietly burning a slot forever.
		if (isUnusableCandidate(failure)) {
			ctx.logger.warn(
				`[dsh-subagent-role-router] the candidate route %s/%s cannot serve this request (%s: %s). It is cooling down and the subagent is switching to %s/%s — remove or fix that row in the role candidate list, because this failure will repeat on every run.`,
				payload.provider ?? "(unknown)",
				agent?.session?.requestContext?.()?.model ?? "(unknown)",
				failure.code,
				failure.message ?? "(no message)",
				view.entries[index].provider,
				view.entries[index].model
			);
		}
		return { kind: "retry" };
	});

	// On the rebuilt request for that subagent: swap the seed route for the
	// pending pool entry, carrying the target's OWN request controls.
	//
	// The inherited `reasoningEffort` is dropped because it belongs to the route
	// that just failed. The failure this fixes: without re-applying the target's
	// declared effort, the fallback is dispatched with the previous route's
	// thinking mode, and a provider whose thinking level must agree with the
	// effort rejects it with e.g. "invalid thinking type, only be disabled when
	// reasoning effort is none ...". That error is NOT retryable, so the
	// failover burns every remaining candidate on a request that can never
	// succeed — the subagent dies even though a healthy model was available.
	//
	// When the target declares no effort, sending the key as `undefined` is the
	// correct dispatch: the adapter then resolves the model's own
	// `defaultEffort` (or omits the reasoning option entirely), instead of
	// inheriting a level the target may not support.
	const disposeRequest = ctx.on("agent/request", async (payload, next) => {
		const { agent } = payload;
		if (!isSubagentAgent(agent)) return next();
		const current = pending.get(agent.id);
		if (current === void 0) return next();
		const view = failoverView(state, agent);
		if (view === void 0) return next();
		const target = view.entries[current.index];
		if (target === void 0) return next();
		const seed = await next();
		if (seed === void 0 || seed === null) return seed;
		const { reasoningEffort: _inherited, ...rest } = seed;
		const switched = { ...rest, provider: target.provider, model: target.model };
		if (target.reasoningEffort !== void 0) switched.reasoningEffort = target.reasoningEffort;
		return switched;
	});

	// Drop per-agent state once the subagent is disposed.
	const disposeDisposed = ctx.on("agent/disposed", ({ agent }) => {
		pending.delete(agent.id);
	});

	ctx.effect(() => () => {
```

</details>

#### 缺口

- 自动角色判定的真实混淆率未知
  **影响**：决定是否会把省钱变成质量损失
  **进一步探讨**：用固定任务集记录自动角色与人工金标、产物合格率和单任务 token

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-subagent-role-router？

**研究主题**：采用判断

#### 完整回答

适合已经并行使用多个子代理、拥有多供应商额度且能审查路由日志的团队做隔离试用；单模型、强合规固定路由或不能容忍凭据切换的环境不宜启用。先用带显式角色标签的小任务，验收角色命中、显式覆盖、冷却恢复和 seed 完整性，出现跨角色切换或重复烧额度即停用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/README.md#L1-L15)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-subagent-role-router

[English](README.en.md) | 中文

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的子代理（subagent）派发选择路由：**按角色分流**、**每个角色可配多个候补并按忙闲顺延**、多模型轮换、跨供应商故障转移，并为 fork 类派发做**活跃窗口切片**。

当创建子代理时未显式指定 `model` 时，本插件按配置注入路由 —— 因此所有 `subagent`、`subagent_fork` 以及任何省略 `agentOptions` 的工具调用都会经过它。显式传参的覆盖始终生效；配置缺失或不完整时保持原有行为（子代理继承父会话路由）。

> ### 来源与署名
>
> 本项目基于 [**dingminhua/dsh-subagent-default-model**](https://github.com/dingminhua/dsh-subagent-default-model)（MIT，Copyright (c) 2026 **LaoDing**）二次开发。
>
> 原作提供了本项目的基础能力：默认模型注入、多模型分配策略、跨供应商故障转移、路由可见性。本项目在其之上新增了**按角色路由**、**角色候补池（忙闲顺延 / 溢出并发 / 失败冷却）**、**fork 活跃窗口切片**、**agent-teams 豁免**四项能力。原作的版权与许可声明完整保留在 [LICENSE](LICENSE) 中。

## 本插件比原作多了什么
```

</details>

#### 缺口

- 自动角色判定的真实混淆率未知
  **影响**：决定是否会把省钱变成质量损失
  **进一步探讨**：用固定任务集记录自动角色与人工金标、产物合格率和单任务 token

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
