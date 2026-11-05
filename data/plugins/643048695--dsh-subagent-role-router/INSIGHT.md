# dsh-subagent-role-router

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[50e42de](https://github.com/643048695/dsh-subagent-role-router/tree/50e42de539fc5efc234bfa5facc26707d24c9bd6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/643048695/dsh-subagent-role-router)
<!-- END META -->

> **功能**：为 DSH 子代理分配模型路由，提供失败切换与当前会话的改路由工具。

> **亮点**：[Q01](#research-q01) 将故障切换接入宿主子代理循环。

> **主要限制**：[Q02](#research-q02) 随机次数和批量写入都不能当作完整覆盖或事务。

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
  - [Q01 · 如何切换子代理请求？](#detail-section-11)
  - [Q02 · 随机候选与批量修改的失败边界？](#detail-section-12)
  - [Q03 · 怎样试用与退出？](#detail-section-13)
  - [Q04 · 怎样验证候选覆盖？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：并行使用多个获授权模型供应商的 DSH 开发者。

配置单一模型或人工重派故障子任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 故障切换 | 子代理按错误重试 | 备用需有授权且受次数限制 |
| 路由管理 | 更新直接子代理 | 逐目标验证结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 挂载请求钩子 | 用原路由 |
| 获授权候选 | 故障切换需要 | 提供备用模型 | 禁用切换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置两个可用候选 | 核对数据目的地 |
| 验证 | 操作者制造模拟错误 | 记录路由与失败 |
| 退出 | 关闭故障转移 | 确认原路由 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 试验额度未知 | 维护候选 | 未测 |
| 持续 | 重试调用可能收费 | 核对池及日志 | 未对账 |
| 恢复 | 额外请求未知 | 检查逐项目标 | 避免盲目批改 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分流 | 按配置选候选 | 实际任务质量 |
| 重试 | 有错误与次数上限 | 健康候选覆盖 |

> **思考**：[Q02](#research-q02) 随机次数和批量写入都不能当作完整覆盖或事务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将故障切换接入宿主子代理循环。

[Q02](#research-q02) 分开记录次数与候选身份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 随机次数和批量写入都不能当作完整覆盖或事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用虚拟请求检查回退。[Q02](#research-q02) 修改后逐项读回。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核对，未执行宿主和模型。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/router-tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主请求及工具源码，未执行目标。
- 下一步：验证限流、取消、随机重复与批量修订。

**分析版本**

- **仓库**：[643048695/dsh-subagent-role-router](https://github.com/643048695/dsh-subagent-role-router)
- **版本号**：5.0.0（[固定提交 50e42de](https://github.com/643048695/dsh-subagent-role-router/tree/50e42de539fc5efc234bfa5facc26707d24c9bd6)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照未试候选抽样能否提高恢复。

验证限流、取消、随机重复与批量修订。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1884 | — | — | 47174 |
| .js | source | 6 | 11212 | 8161 | 2622 | — |
| .mjs | test | 23 | 7605 | 6347 | 582 | — |
| .mjs | source | 1 | 110 | 60 | 38 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/643048695/dsh-subagent-role-router/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：子代理候选、重试与批量改路由的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何切换子代理请求？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

希望并行任务使用多个模型的操作者，原本须在各子代理启动或故障后手工换路由。插件提供轮换和随机配置，失败钩子限制子代理，跳过取消、豁免与非适用错误，先给失败路由冷却，再根据池状态请求宿主重建调用。认证错误可触发换路并留下警告。备用可能属于另一供应商，仍需用户确认数据可以发送到所有候选。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-58](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/README.md#L35-L58)

作者说明池及运行内切换

<details>
<summary>查看原文（24行）</summary>

```text
### 功能一：多模型分配策略 —— `round-robin` 顺序轮换 / `random` 随机切换

配置 `models` 列表（≥2 项）并选择 `strategy`，决定并行派发的子代理在多条路由之间如何分配：

- **`round-robin`（顺序）** —— 按列表顺序依次取用，第 1 个子代理用第 1 条路由，第 2 个用第 2 条……走到末尾后回到开头。**结果可预期、分布可控**：10 个子代理配 2 条路由，稳定得到 5/5。适合想让多个供应商的额度被均匀消耗、或想让不同模型跑同样的活做对比的场景。
- **`random`（随机）** —— 每次派发从列表中随机挑一条路由。**结果不可预期但无固定规律**，适合不想让请求呈现规律性节奏的场景。

注意：这里分配的是**「谁去跑下一个子代理」**，策略在**派发时**决定，同一个子代理内部不会因为策略而中途换模型（中途换模型是功能二的事）。只配 1 条路由时策略无意义。

### 功能二：跨供应商故障转移 —— 这条通了、那条不通，就换另一个供应商的模型

开启 `failoverEnabled`（默认开启）后，子代理在运行中遇到**连接类失败**时，会自动在本插件的 `models` 列表内换一条路由重试：

- **不区分供应商** —— 候选来自整个 `models` 列表，**跨 provider 生效**。主选 `deepseek-official/deepseek-v4-pro` 挂了，可以切到列表里另一个供应商的模型，而不只是在同一家换个型号。
- **触发码分两类** ——
  - **连接类**：`RATE_LIMIT`、`QUOTA`、`SERVER`、`TIMEOUT`、`TRANSPORT`、`EMPTY_RESPONSE`。
  - **认证类**：`AUTH`、`INVALID_CREDENTIAL`（HTTP 401/403，密钥无效/过期/无权限）。
  - 认证类**也会切换**：当各家供应商密钥各自独立时，其中一家密钥失效不应该让整个任务死掉、而健康的供应商却在闲置。
  - **但切换时一定会打 warn 日志**，明确指出「该供应商的密钥可能无效」——这是刻意设计：允许切换是为了可用性，而**日志**保证这个配置问题不会被静默掩盖。
  - 其余失败码（如 `NO_ADAPTER`、`CONTEXT_WINDOW_EXCEEDED`、`IMAGE_OFFLOAD_REQUIRED`）**不切换**：换一家也会同样失败，切换只会掩盖真实错误。
- **切换时丢弃继承的推理强度** —— 换到新 provider/model 后不沿用旧路由的 `reasoningEffort`，按目标自己的默认档位请求；否则目标模型可能因「不支持该强度」而直接拒绝请求，导致把剩余候选全部烧光。
- **同一次运行内粘住** —— 切换后该子代理后续步骤继续跑在新模型上，不会每步来回跳。
- **耗尽即放行** —— 列表内全部候选都试过仍失败，就抛出真实错误，不做无限重试。
- **需要 ≥ 2 条路由**，且**仅对子代理生效** —— 主代理循环不受影响。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1833-1868](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1833-L1868)

失败触发和预算

<details>
<summary>查看原文（36行）</summary>

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
		// An exempt plugin child must not even COOL its route down: its failure
		// says nothing about the model's health for everyone else, and a cooldown
		// recorded here would silently skew the next ordinary delegation.
		if (isExemptAgent(state, agent)) return next();
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1881-1908](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1881-L1908)

错误分类日志及重试返回

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3243-3263](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L3243-L3263)

实际挂载与模型工具

<details>
<summary>查看原文（21行）</summary>

```text
	installChildRouteOverride(ctx, state);

	// Subagent-only failover hooks the agent loop, not the subagents service,
	// so it is installed unconditionally: listeners no-op when the `failover`
	// section is absent/disabled or when the failing agent is the main loop.
	installFailover(ctx, state);


	// Tell each subagent which route it is actually running on. Same gate as
	// failover (origin === "subagent"), so the main agent's context is untouched.
	installRouteContextInjector(ctx, state);

	// Repair a display name ("dnq") into the exact model id ("group/dnq") before
	// the host preflight asks the adapter for a model that does not exist.
	installDelegationArgumentRepair(ctx, state);

	// Serve the Web UI's model/effort picker for a running child.
	installOverrideEndpoint(ctx, state);

	// Model-callable tools over the same controller the HTTP endpoints use.
	installRouterTools(ctx, state);
```

</details>

#### 缺口

- 未触发真实宿主或跨供应商回退
  **影响**：无法保证任务恢复、费用和路由效果
  **进一步探讨**：以允许的模拟供应商制造限流、拒绝与取消

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 随机候选与批量修改的失败边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

轮换按已试集合寻找后继，随机路径每次可再次选到失败候选。失败预算按切换次数，不等于访问每个候选。批量改路由工具从当前 Agent 取得父会话，校验目标形状，再依次对每个子代理或团队成员应用，传递期望修订号。这里没有预先校验全批或回滚已成功的操作，所以不能从 README 的整批失败说明推断事务语义。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1748-1783](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1748-L1783)

随机和轮换的不同选择

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * Pick the next pool index for one failed subagent request.
 *
 * - round-robin: the next entry after the currently-served model, wrapping
 *   around the list (the "queue"), skipping entries this run already tried so a
 *   single bad candidate is not re-selected while an untried one remains.
 * - random: any entry, without checking whether it was used before — a random
 *   pick may repeat the failing model, which is fine by design (simplest).
 */
function nextFailoverIndex(view, agent, current) {
	const { entries, strategy } = view;
	if (strategy === "random") {
		return Math.floor(Math.random() * entries.length);
	}
	const tried = current?.tried;
	if (current !== void 0) {
		// Advance from the last pick, taking the first entry this run has not used.
		for (let step = 1; step <= entries.length; step += 1) {
			const candidate = (current.index + step) % entries.length;
			if (tried === void 0 || !tried.has(candidate)) return candidate;
		}
		return (current.index + 1) % entries.length;
	}
	// First failure: locate the served route in the pool and move to the next.
	const served = agent.session?.requestContext?.();
	const found = served === void 0 ? -1 : entries.findIndex((entry) =>
		entry.provider === served.provider && entry.model === served.model
	);
	if (found < 0) return 0;
	// Start after the served entry, preferring one this run has not used.
	for (let step = 1; step <= entries.length; step += 1) {
		const candidate = (found + step) % entries.length;
		if (tried === void 0 || !tried.has(candidate)) return candidate;
	}
	return (found + 1) % entries.length;
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1854-1868](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1854-L1868)

重试以次数而非唯一路由计数

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 3 · 作者声明**：[README.md:150-157](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/README.md#L150-L157)

作者的修订号表述

```text
### 功能八：模型可以调用这条路由 —— `subagent_routes_inspect` / `subagent_routes_update`

两个工具让模型自己查、自己改子代理的路由，不用人点界面：

- **`subagent_routes_inspect`** —— 返回当前对话每个子代理的实际路由、是否可写，以及配置好的模型池与各模型**自己声明**支持的推理强度。
- **`subagent_routes_update`** —— 支持指定子代理、指定团队成员，或「当前对话全部可写子代理」批量换模型 / 强度；也支持只改强度（`keep_model`，沿用各自当前模型）与重置（`reset`）。
- **每次修改带修订号** —— 每个目标有独立 revision，整体有实例 epoch；工具改完界面不会被旧缓存拉回去。批量修改可传 `expected_revisions`，版本对不上就整批失败，而不是互相覆盖。
- **团队成员换模型** —— 通过 AgentTeams 的成员路由服务在同一个成员会话上改下一次请求用的模型：成员名、childId、任务、attempt_id、消息队列与历史全部保留。服务不存在时明确报 `teams-unavailable`，**绝不**退回「删成员重建」这种丢上下文的做法。
```

**依据 4 · 源码核查**：[lib/router-tools.js:383-432](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/router-tools.js#L383-L432)

目标范围、修订号及逐个提交

<details>
<summary>查看原文（50行）</summary>

```text
		async execute(args, exec) {
			requireCaller(exec);
			const parentSessionId = callerSessionId(exec);
			if (parentSessionId === "") {
				throw new Error("subagent_routes_update could not resolve the calling session id");
			}
			const action = args.action;
			const targets = args.targets ?? {};
			const specified = ["child_ids", "member_names", "all_current"].filter((key) => {
				const value = targets[key];
				return key === "all_current" ? value === true : Array.isArray(value) && value.length > 0;
			});
			if (specified.length !== 1) {
				throw new Error("targets must specify exactly one of child_ids, member_names, all_current");
			}
			if (action === "reset") {
				for (const key of ["provider", "model", "reasoning_effort", "keep_model"]) {
					if (args[key] !== void 0) throw new Error(`reset takes no ${key}`);
				}
			} else {
				const hasPair = typeof args.provider === "string" && args.provider.trim() !== "" &&
					typeof args.model === "string" && args.model.trim() !== "";
				const keepModel = args.keep_model === true;
				if (hasPair && keepModel) throw new Error("give provider+model or keep_model, not both");
				if (!hasPair && !keepModel) throw new Error("select needs provider and model (or keep_model: true to keep each target's model)");
				if (keepModel && (typeof args.reasoning_effort !== "string" || args.reasoning_effort.trim() === "")) {
					throw new Error("keep_model needs reasoning_effort (omitting it would be a no-op)");
				}
			}
			const expectedRevisions = args.expected_revisions ?? void 0;
			const results = [];
			let childIds = [];
			let memberNames = [];
			if (specified[0] === "child_ids") {
				childIds = targets.child_ids.map((value) => String(value).trim()).filter(Boolean);
			} else if (specified[0] === "member_names") {
				memberNames = targets.member_names.map((value) => String(value).trim()).filter(Boolean);
			} else {
				const listed = await controller.children(parentSessionId);
				if (listed.ok !== true) {
					throw new Error(`subagent catalog unavailable: ${listed.error?.code ?? "unknown"}`);
				}
				childIds = listed.value.filter((row) => row.selectable === true).map((row) => row.childId);
			}
			for (const childId of childIds) {
				results.push(await applyChild(controller, parentSessionId, action, childId, args, expectedRevisions));
			}
			for (const memberName of memberNames) {
				results.push(await applyMember(adapter, exec, action, memberName, args, expectedRevisions));
			}
```

</details>

#### 缺口

- 未执行并发改路由和随机回退
  **影响**：无法确定宿主逐项目录的权限拒绝或实际成功分布
  **进一步探讨**：对照随机重复、单目标修订冲突和批量部分成功

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者给出 Git 和 link 安装，路由未配时保留默认。试用要固定宿主与构建版本，先用纯文本子代理和两个合规候选，观察请求次数、凭据错误和实际路由。额外调用会增加费用，备用不同上下文与 effort 可改变结果。若故障时数据目的地或批量结果无法核对，关闭故障转移并切回原路由。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:181-196](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/README.md#L181-L196)

安装与默认范围

<details>
<summary>查看原文（16行）</summary>

````text
## 安装

本插件**未发布到 npm registry**，从仓库安装：

```sh
dsh plugin add github:643048695/dsh-subagent-role-router
```

本地开发安装（`link:` 安装，改代码后重载客户端即可生效）：

```sh
# 检出后把目录本身装成插件（包内 node_modules 会是源码软链）
dsh plugin add link:/path/to/dsh-subagent-role-router
```

装好后在 `设置 → 插件配置 → 子代理路由` 里配置路由；不配置时行为与没装插件一致。
````

</details>

**依据 2 · 作者声明**：[README.md:44-58](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/README.md#L44-L58)

故障转移与上限

<details>
<summary>查看原文（15行）</summary>

```text
### 功能二：跨供应商故障转移 —— 这条通了、那条不通，就换另一个供应商的模型

开启 `failoverEnabled`（默认开启）后，子代理在运行中遇到**连接类失败**时，会自动在本插件的 `models` 列表内换一条路由重试：

- **不区分供应商** —— 候选来自整个 `models` 列表，**跨 provider 生效**。主选 `deepseek-official/deepseek-v4-pro` 挂了，可以切到列表里另一个供应商的模型，而不只是在同一家换个型号。
- **触发码分两类** ——
  - **连接类**：`RATE_LIMIT`、`QUOTA`、`SERVER`、`TIMEOUT`、`TRANSPORT`、`EMPTY_RESPONSE`。
  - **认证类**：`AUTH`、`INVALID_CREDENTIAL`（HTTP 401/403，密钥无效/过期/无权限）。
  - 认证类**也会切换**：当各家供应商密钥各自独立时，其中一家密钥失效不应该让整个任务死掉、而健康的供应商却在闲置。
  - **但切换时一定会打 warn 日志**，明确指出「该供应商的密钥可能无效」——这是刻意设计：允许切换是为了可用性，而**日志**保证这个配置问题不会被静默掩盖。
  - 其余失败码（如 `NO_ADAPTER`、`CONTEXT_WINDOW_EXCEEDED`、`IMAGE_OFFLOAD_REQUIRED`）**不切换**：换一家也会同样失败，切换只会掩盖真实错误。
- **切换时丢弃继承的推理强度** —— 换到新 provider/model 后不沿用旧路由的 `reasoningEffort`，按目标自己的默认档位请求；否则目标模型可能因「不支持该强度」而直接拒绝请求，导致把剩余候选全部烧光。
- **同一次运行内粘住** —— 切换后该子代理后续步骤继续跑在新模型上，不会每步来回跳。
- **耗尽即放行** —— 列表内全部候选都试过仍失败，就抛出真实错误，不做无限重试。
- **需要 ≥ 2 条路由**，且**仅对子代理生效** —— 主代理循环不受影响。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1854-1879](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1854-L1879)

切换次数与日志

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

#### 缺口

- 未验证安装和停用
  **影响**：无法估计真实资源或恢复时间
  **进一步探讨**：在独立 profile 对照配置前后请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证候选覆盖？

**研究主题**：新假设与验证

#### 完整回答

可以在现有日志旁提供按请求分组的已试和未试候选数，并对照当前随机模式与从未试池抽样的策略。固定故障池中记录健康候选命中率、成本和恢复时间。若有效恢复不增或等待与费用上升，保留原策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1757-1768](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1757-L1768)

现有随机和轮换逻辑

<details>
<summary>查看原文（12行）</summary>

```text
function nextFailoverIndex(view, agent, current) {
	const { entries, strategy } = view;
	if (strategy === "random") {
		return Math.floor(Math.random() * entries.length);
	}
	const tried = current?.tried;
	if (current !== void 0) {
		// Advance from the last pick, taking the first entry this run has not used.
		for (let step = 1; step <= entries.length; step += 1) {
			const candidate = (current.index + step) % entries.length;
			if (tried === void 0 || !tried.has(candidate)) return candidate;
		}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1860-1879](https://github.com/643048695/dsh-subagent-role-router/blob/50e42de539fc5efc234bfa5facc26707d24c9bd6/lib/index.js#L1860-L1879)

已试记录与日志

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

#### 缺口

- 未复跑固定故障池
  **影响**：没有随机覆盖效果证据
  **进一步探讨**：用可重复随机种子测试

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
