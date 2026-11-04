# DSH Subagent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[97406ac](https://github.com/1373700184/dsh-subagent/tree/97406ac6126a424e2dcda8ff6b79b141da7a65a6)

<!-- BEGIN META -->
[![npm 30d 33](https://img.shields.io/static/v1?label=npm+30d&message=33&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

> **功能**：将本机外部 CLI 注册为 DSH 子代理后端，支持调度、进度及模型回退。

> **亮点**：[Q01](#research-q01) 将多个 CLI 作为宿主 provider；[Q02](#research-q02) 加入模型回退和并发调度，效果尚未对照。

> **主要限制**：[Q03](#research-q03) 默认绕过权限且文件系统错误时并发门控退化，不能把委派视作隔离执行。

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
  - [Q01 · 外部 CLI 委派与原生子代理相比增加什么？](#detail-section-11)
  - [Q02 · 调度、模型回退和取消怎样执行？](#detail-section-12)
  - [Q03 · 权限、并发和本地恢复有哪些重要限制？](#detail-section-13)
  - [Q04 · 采用者需要承担哪些配置、费用及退出负担？](#detail-section-14)
  - [Q05 · 如何检验启动前展示权限与目标是否降低误授权？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 会话需要把独立任务委派给已安装外部 CLI 的使用者。

DSH 原生子代理或用户直接在终端运行 CLI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 后端注册 | 委派外部 CLI | 依赖本机程序及登录 |
| 模型链 | 在失败时尝试后续模型 | 实际协议兼容未测 |
| 并发门控 | 跨进程共享槽位 | 文件异常退化为本进程 |
| 运行状态 | 查看事件与结果 | 本机日志可能含敏感内容 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容的 DSH 组件和 Node | 运行必需 | 宿主注册 | 不可接入 |
| 本机 CLI 及登录 | 对应后端必需 | 执行委派 | 后端不可用 |
| 服务额度 | 对应模型需要 | 推理 | 超额或失败 |
| 可写临时目录 | 跨进程门控需要 | 文件槽位 | 退回进程内计数 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 配置 | 用户安装 CLI、限制权限和目录 | 校验账户和额度 |
| 委派 | 父代理提交任务及上下文 | 调度到可用后端 |
| 执行 | 后端输出事件并返回结果 | 失败或超时终止并报告 |
| 复核 | 用户检查结果和副作用 | 错误时人工恢复 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | CLI、宿主、账号 | 登录和权限配置 | 版本兼容 |
| 持续 | 订阅或 API 额度 | 上下文准备和输出复核 | 单任务成本 |
| 故障 | 日志与隔离目录 | 检查残留进程和改动 | 恢复成本 |

| 效果 | 材料 | 未知 |
|---|---|---|
| CLI 接线 | provider 与工具注册源码 | 真实宿主兼容 |
| 模型回退 | 源码清理并尝试下一模型 | 外部 CLI 实际成功率 |
| 并发控制 | 锁文件与回退代码 | 文件异常下跨进程上限 |

> **思考**：[Q03](#research-q03) 默认绕过权限且文件系统错误时并发门控退化，不能把委派视作隔离执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将多个 CLI 作为宿主 provider；[Q02](#research-q02) 加入模型回退和并发调度，效果尚未对照。

[Q02](#research-q02) 在 finally 释放槽位；[Q03](#research-q03) 文件系统异常可降级为进程内计数，因此上限并非无条件跨进程。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认绕过权限且文件系统错误时并发门控退化，不能把委派视作隔离执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先检查后端权限、工作目录与费用；不能接受默认绕过审批时不要启动相应后端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码定向检查；未启动目标、CLI 或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/shared-gate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 provider 注册、选路、模型链、Codex 权限、并发门控和启动；未完整审计其他驱动、恢复及权限路径。
- 下一步：在隔离工作区验证各 CLI 权限、取消、文件故障和宿主重启；本轮未执行。

**分析版本**

- **仓库**：[1373700184/dsh-subagent](https://github.com/1373700184/dsh-subagent)
- **版本号**：1.1.11（[固定提交 97406ac](https://github.com/1373700184/dsh-subagent/tree/97406ac6126a424e2dcda8ff6b79b141da7a65a6)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 建议先显示实际后端和权限并确认，需检验误授权与疲劳。

在隔离工作区验证各 CLI 权限、取消、文件故障和宿主重启；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 191 | — | — | 3175 |
| .js | source | 4 | 3643 | 3355 | 199 | — |
| .cjs | source | 1 | 21 | 18 | 2 | — |
| .mjs | source | 1 | 40 | 35 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查外部 CLI 子代理接线、调度及权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 外部 CLI 委派与原生子代理相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者面向希望在 DSH 会话委派本机外部 CLI 的用户，支持多个后端并暴露其事件；子代理不继承父会话上下文，任务必须自行提供上下文。原生子代理和直接终端运行也是替代方式，本组件的增量是把 CLI 适配为宿主 provider 和工具；没有同任务效果对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/README.md#L1-L15)

项目用途、一次性运行和上下文限制。

<details>
<summary>查看原文（15行）</summary>

````text
# dsh-subagent

把外部 CLI 子代理(Qoder、QoderCN、Codex、Claude、OpenCode、Pi、CodeBuddy,可继续扩展)注册成 dsh(DeepSeek Harness)的**子代理提供方**,让父 agent 通过委派工具把任务交给这些 CLI 跑,消耗各自的订阅/API 额度。

每个后端都是**一次性执行**:插件 spawn CLI 子进程,提示词经 stdin 送入,读取各自的 JSON 事件流(`qoder-json` / `claude-json` / `codex-json` / `codebuddy-json` / `opencode-json` / `pi-json` 驱动),收敛到最终结果。子代理**看不到父会话上下文**,所以委派任务里要自带完整上下文。

## 安装

```sh
dsh plugin --profile web add github:1373700184/dsh-subagent
```

装好后插件的 `cordis.patch.yml` 会向 profile 树插入提供方 `dsh-subagent` 和 Agent 预设;委派工具、斜杠指令随**已启用的后端**动态挂载(启用几个后端就有几个工具/指令)。重启 dsh 生效。

前置条件:对应 CLI 已安装且已登录——`qodercli`(`~/.qoder/bin/qodercli/`)、`qoderclicn`(`~/.qoder-cn/bin/qoderclicn/`)、`codex`(npm 全局)、`claude`(npm 全局,沿用 `~/.claude/settings.json` 的模型/网关配置;设置页的模型列表也从这里读取)、`opencode`(`~/.opencode/bin/`)、`pi`(`~/.pi/agent/`,优先通过 node 直接启动受管安装的 CLI,避免 Windows 弹终端窗口)、`codebuddy`(npm 全局 `@tencent-ai/codebuddy-code`,通过 node 启动)。上述目录都找不到时,会按 PATH 搜索命令名(`qodercli` / `qoderclicn` / `opencode` / `pi` / `codebuddy` / `codex` / `claude`);CLI 路径里填裸命令名也会走 PATH。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1724-1751](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L1724-L1751)

动态挂载工具及注册 provider。

<details>
<summary>查看原文（28行）</summary>

```text
			if (!entries.has(entry.name)) entries.set(entry.name, entry);
		}
		for (const [providerName, record] of registrations) {
			if (entries.has(providerName)) continue;
			record.provider?.();
			record.command?.();
			record.tool?.();
			registrations.delete(providerName);
		}
		for (const [providerName, entry] of entries) {
			let record = registrations.get(providerName);
			if (!record) {
				record = { provider: undefined, command: undefined, tool: undefined };
				registrations.set(providerName, record);
			}
			if (!record.tool) {
				const fiber = ctx.plugin(ToolSubagentPlugin, { provider: providerName, toolName: providerName, maxDepth: "provider-managed" });
				record.tool = () => {
					void fiber.dispose?.();
				};
			}
			if (!record.provider) {
				record.provider = ctx.subagents.registerProvider(new QoderJsonProvider(
					providerName,
					() => liveSpec(providerName),
					(id) => ctx.get("agents")?.get?.(id),
					schedule,
				));
```

</details>

#### 缺口

- 缺少具体重复任务与对照
  **影响**：不能确定委派的净收益
  **进一步探讨**：在同一任务记录质量、人工交接及耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调度、模型回退和取消怎样执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

启动时验证工作目录，创建运行记录；调度按指定策略选择有空位的已启用 CLI，并在 finally 释放槽位。选定后端按模型列表启动进程，首事件超时或完成结果失败会清理当前进程并继续尝试；取消路径调用 dispose。存在外部 CLI、订阅以及事件协议变化的依赖，源码路径不能保证这些后端实际兼容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:267-285](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L267-L285)

筛选 CLI 与调度排序。

<details>
<summary>查看原文（19行）</summary>

```text
class ProviderScheduler {
	#uses = new Map();
	async acquire(specs, requested, mode, signal, onWait) {
		const pool = specs.filter((spec) => spec.binary && existsSync(spec.binary));
		if (pool.length === 0) throw new Error("no enabled provider has a usable CLI binary");
		const requestedAt = pool.findIndex((spec) => spec.name === requested);
		for (;;) {
			if (signal?.aborted) throw new Error("cancelled");
			let ordered;
			if (mode === "balanced") {
				ordered = [...pool].sort((a, b) =>
					providerGate.active(a.name) - providerGate.active(b.name)
					|| (this.#uses.get(a.name) ?? 0) - (this.#uses.get(b.name) ?? 0)
					|| pool.indexOf(a) - pool.indexOf(b));
			} else {
				ordered = pool.slice(requestedAt >= 0 ? requestedAt : 0);
			}
			for (const spec of ordered) {
				const release = providerGate.tryAcquire(spec.name, spec.maxConcurrency);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:321-339](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L321-L339)

cwd、上下文和取消。

<details>
<summary>查看原文（19行）</summary>

```text
	async start(request) {
		assertUsableCwd(this.name, "cwd", request.cwd);
		const spec = this.#getSpec();
		if (!spec) {
			throw new Error(`${this.name}: provider is no longer present in the dsh-subagent config.`);
		}
		const prompt = promptText(request.prompt);
		const id = SessionId(randomUUID());
		const activity = activityLedger.begin({ id, provider: this.name, label: request.label ?? "", prompt: prompt.slice(0, 160), stallWarnSeconds: spec.stallWarnSeconds });
		let currentRun;
		let cancelled = false;
		let lastDiagnostic;
		const aborted = new Promise((resolve) => request.signal.addEventListener("abort", () => resolve("aborted"), { once: true }));
		const onAbort = () => {
			cancelled = true;
			void currentRun?.dispose();
		};

		const runChain = async (target) => {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:339-398](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L339-L398)

模型链、首事件等待及失败回退。

<details>
<summary>查看原文（60行）</summary>

```text
		const runChain = async (target) => {
			const chain = target.models.length > 0 ? target.models : [undefined];
			const deadline = Date.now() + target.allowedWaitSeconds * 1000;
			const tried = [];
			for (const model of chain) {
				if (cancelled) throw new Error("cancelled");
				const label = model ?? "(CLI 默认)";
				activity.record("model", `正在尝试模型 ${label}`);
				const driver = DRIVERS[target.driver];
				const spawnSpec = spawnCommand(target.driver, target);
				const run = new QoderJsonRun({
					id,
					activity,
					parentAgent: this.#getAgent?.(request.parent?.id),
					stallWarnSeconds: target.stallWarnSeconds,
					warnAfterFirstEvent: true,
					driver,
					driverName: target.driver,
					provider: target.name,
					label: request.label ?? "",
					promptSummary: prompt.slice(0, 160),
					parentId: request.parent?.id,
					command: spawnSpec.command,
					args: [...spawnSpec.prefix, ...driver.buildArgs(target, model)],
					env: spawnSpec.env,
					cwd: request.cwd,
					prompt,
					signal: request.signal,
					timeoutMs: target.timeoutSeconds ? target.timeoutSeconds * 1000 : 0,
				});
				currentRun = run;
				const remaining = Math.max(0, deadline - Date.now());
				const waitMs = target.stallWarnSeconds > 0 ? Math.min(target.stallWarnSeconds * 1000, remaining) : remaining;
				const first = await Promise.race([
					run.firstEvent.then(() => "ready"),
					new Promise((resolve) => setTimeout(() => resolve("timeout"), waitMs)),
					aborted,
				]);
				if (first === "aborted" || cancelled) {
					await run.dispose();
					throw new Error("cancelled");
				}
				if (first === "ready") {
					const result = await run.handle().result;
					await run.dispose();
					if (result.stopReason === "completed") return result;
					if (cancelled) throw new Error("cancelled");
					tried.push(`${label}: ${result.stopReason}${result.diagnostic ? ` — ${result.diagnostic.slice(0, 160)}` : ""}`);
					activity.record("error", `${label} 失败(${result.stopReason}),尝试下一个模型`);
					if (Date.now() >= deadline) break;
					continue;
				}
				tried.push(`${label}: ${Math.round(waitMs / 1000)} 秒无输出`);
				activity.record("error", `${label} ${Math.round(waitMs / 1000)} 秒无输出,切换下一个模型`);
				await run.dispose();
				if (Date.now() >= deadline) break;
			}
			lastDiagnostic = `所有模型均失败或超过允许等待时间(${target.allowedWaitSeconds}s)。尝试记录:\n${tried.join("\n")}`;
			activity.record("error", lastDiagnostic);
			throw new Error(lastDiagnostic);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:401-424](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L401-L424)

选中后端及释放槽位。

<details>
<summary>查看原文（24行）</summary>

```text
		const attempt = async () => {
			const schedule = this.#getSchedule?.() ?? { specs: [spec], mode: "priority" };
			let waiting = false;
			const selected = await providerScheduler.acquire(
				schedule.specs,
				this.name,
				schedule.mode,
				request.signal,
				() => {
					if (waiting) return;
					waiting = true;
					activity.record("queue", "所有可用后端均已达到并发上限(含其他 dsh 任务),等待空位");
				},
			);
			const target = selected.spec;
			activity.provider(target.name);
			activity.record("queue", target.name === this.name
				? `使用 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`
				: `已从 ${this.name} 转给 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`);
			try {
				return await runChain(target);
			} finally {
				selected.release();
			}
```

</details>

#### 缺口

- 各 CLI 的事件格式和异常行为未运行
  **影响**：无法确定真实模型故障转移可靠性
  **进一步探讨**：用固定版本 CLI 模拟无输出、错误、取消与成功事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、并发和本地恢复有哪些重要限制？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

配置默认 permissionMode 为 bypass_permissions；Codex 驱动在该模式下明确传入绕过审批和沙箱的参数，因此委派任务能具有重大本机副作用，不能把子进程当隔离沙箱。并发门控通常使用临时目录互斥文件、PID 和心跳；文件系统异常则退回进程内计数，此时不能保证跨进程上限。进程 detached 且日志落盘可供恢复，但实际重启、日志权限与清理未核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:220-241](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L220-L241)

权限默认值及等待设置。

<details>
<summary>查看原文（22行）</summary>

```text
	/** 注册名;必须与 patch 中 `dsh-tool-subagent` 的 provider 一致。 */
	name: z.string().required(),
	/** 传输驱动:qoder-json | opencode-json | pi-json | codebuddy-json | codex-json | claude-json。 */
	driver: z.string().default("qoder-json"),
	/** CLI 绝对路径;省略则按内置名称自动探测。 */
	binary: z.string(),
	/** 无头运行的 CLI 权限模式;无法弹窗询问,故默认放行。 */
	permissionMode: z.string().default("bypass_permissions"),
	/** 强制指定模型 id;省略则使用 CLI 自己的默认值(如免费额度)。 */
	model: z.string(),
	/** 有序的模型回退链;非空时覆盖 `model`。 */
	models: z.array(z.string()).default([]),
	/** 整条回退链共用的总等待预算,单位秒。 */
	allowedWaitSeconds: z.number().min(1),
	/** 传给 CLI 的思考程度:auto|none|low|medium|high|xhigh|max|ultracode。 */
	reasoningEffort: z.string().default("auto"),
	/** 显式上下文窗口(正整数 token);省略则使用 CLI 默认值。 */
	contextWindow: z.number().min(1),
	/** 单次委派的墙钟上限(秒),可选。 */
	timeoutSeconds: z.number().min(1),
	/** CLI 连续无输出的秒数,达到后提醒父 agent;0 表示关闭。 */
	stallWarnSeconds: z.number().min(0),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:564-575](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L564-L575)

Codex 权限模式映射。

<details>
<summary>查看原文（12行）</summary>

```text
	"codex-json": {
		buildArgs(spec, model) {
			const sandbox = { accept_edits: ["--approve-for-me"], auto: ["-s", "workspace-write"], dont_ask: ["-s", "workspace-write"], default: ["-s", "read-only"], plan: ["-s", "read-only"] };
			const access = spec.permissionMode === "bypass_permissions"
				? ["--dangerously-bypass-approvals-and-sandbox"]
				: sandbox[spec.permissionMode] ?? ["-s", "workspace-write"];
			const args = ["exec", "--json", "--skip-git-repo-check", "--color", "never", ...access];
			if (model) args.push("--model", model);
			const effort = { low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max", ultracode: "ultra" }[spec.reasoningEffort];
			if (effort) args.push("-c", `model_reasoning_effort="${effort}"`);
			if (spec.contextWindow) args.push("-c", `model_context_window=${spec.contextWindow}`);
			args.push(...(spec.extraArgs ?? []));
```

</details>

**依据 3 · 源码核查**：[lib/shared-gate.js:66-83](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/shared-gate.js#L66-L83)

PID、心跳及独占文件。

<details>
<summary>查看原文（18行）</summary>

```text
	#alive(record) {
		if (!record?.pid) return false;
		try {
			process.kill(record.pid, 0);
		} catch {
			return false;
		}
		return Date.now() - record.mtime <= STALE_MS;
	}

	#writeNew(file, token) {
		const fd = openSync(file, "wx");
		try {
			writeSync(fd, JSON.stringify({ pid: process.pid, token, since: Date.now() }));
		} finally {
			closeSync(fd);
		}
	}
```

</details>

**依据 4 · 源码核查**：[lib/shared-gate.js:230-245](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/shared-gate.js#L230-L245)

文件失败时退回进程内计数。

<details>
<summary>查看原文（16行）</summary>

```text
	/** 占用一个槽位;成功返回释放函数,已满返回 null。 */
	tryAcquire(name, limit) {
		const max = Math.max(1, Number(limit) || 1);
		if (!this.#memory) {
			try {
				return this.#acquireShared(name, max);
			} catch {
				this.#memory = new Map();
			}
		}
		return this.#acquireMemory(name, max);
	}

	/** 当前占用槽位的运行数(含其他 dsh 进程),短缓存避免轮询反复扫目录。 */
	active(name) {
		if (this.#memory) return this.#memory.get(name) ?? 0;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1080-1118](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L1080-L1118)

子进程与文件和 prompt 接线。

<details>
<summary>查看原文（39行）</summary>

```text
			// 隐藏控制台避免 CLI 的 shell 子进程闪出黑框。
			this.#promptPath = runPromptPath(this.#id);
			this.#configPath = runConfigPath(this.#id);
			this.#runnerErrPath = runRunnerErrPath(this.#id);
			writeFileSync(this.#promptPath, opts.prompt);
			writeFileSync(this.#configPath, JSON.stringify({
				File: opts.command,
				Arguments: opts.args.map(quoteWindowsArg).join(" "),
				Stdin: this.#promptPath,
				Stdout: this.#logPath,
				Stderr: this.#errPath,
				Env: opts.env ?? {},
			}));
			this.#child = spawn(process.execPath, [HIDDEN_RUNNER, this.#configPath, this.#runnerErrPath], {
				cwd: opts.cwd,
				stdio: "ignore",
				windowsHide: true,
				detached: true,
			});
		} else {
			const outFd = openSync(this.#logPath, "a");
			const errFd = openSync(this.#errPath, "a");
			try {
				this.#child = spawn(opts.command, opts.args, {
					cwd: opts.cwd,
					stdio: ["pipe", outFd, errFd],
					windowsHide: true,
					detached: true,
					...(opts.env ? { env: { ...process.env, ...opts.env } } : {}),
				});
			} finally {
				closeSync(outFd);
				closeSync(errFd);
			}
			this.#child.stdin.on("error", () => {});
			this.#child.stdin.write(opts.prompt);
			this.#child.stdin.end();
		}
		this.#child.unref();
```

</details>

#### 缺口

- 其他后端权限映射和文件系统故障恢复未全面核实
  **影响**：无法承诺一致隔离与跨进程限制
  **进一步探讨**：逐驱动审查参数，并在隔离环境测试临时目录不可用与宿主崩溃。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用者需要承担哪些配置、费用及退出负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要兼容版本的 DSH、已安装已登录的对应 CLI，以及各自账户或 API 额度；委派者必须提供足够上下文并复核修改，运行日志留在本机。等待预算和超时参数控制部分执行，具体费用和恢复成本未知。优先选择受限权限和隔离工作目录，检查要发送的上下文和各 CLI 默认权限；无法接受绕过审批或文件修改时不要启动该后端。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-54](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/package.json#L44-L54)

Node 和 DSH peer 版本。

<details>
<summary>查看原文（11行）</summary>

```text
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tool-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/schemastery": "^3.18.2",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.2 <0.3.0"
```

</details>

**依据 2 · 作者声明**：[README.md:13-15](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/README.md#L13-L15)

安装、启用与 CLI 登录。

```text
装好后插件的 `cordis.patch.yml` 会向 profile 树插入提供方 `dsh-subagent` 和 Agent 预设;委派工具、斜杠指令随**已启用的后端**动态挂载(启用几个后端就有几个工具/指令)。重启 dsh 生效。

前置条件:对应 CLI 已安装且已登录——`qodercli`(`~/.qoder/bin/qodercli/`)、`qoderclicn`(`~/.qoder-cn/bin/qoderclicn/`)、`codex`(npm 全局)、`claude`(npm 全局,沿用 `~/.claude/settings.json` 的模型/网关配置;设置页的模型列表也从这里读取)、`opencode`(`~/.opencode/bin/`)、`pi`(`~/.pi/agent/`,优先通过 node 直接启动受管安装的 CLI,避免 Windows 弹终端窗口)、`codebuddy`(npm 全局 `@tencent-ai/codebuddy-code`,通过 node 启动)。上述目录都找不到时,会按 PATH 搜索命令名(`qodercli` / `qoderclicn` / `opencode` / `pi` / `codebuddy` / `codex` / `claude`);CLI 路径里填裸命令名也会走 PATH。
```

**依据 3 · 作者声明**：[README.md:84-101](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/README.md#L84-L101)

权限、运行时限及后端配置。

<details>
<summary>查看原文（18行）</summary>

```text
## 配置

在 profile 里覆盖 `dsh-subagent` 节点的 `config`(`providers` 数组,每项一个后端):

| 字段 | 默认 | 说明 |
|---|---|---|
| `name` | 必填 | 提供方名,须与 patch 里 `dsh-tool-subagent` 的 `provider` 一致 |
| `driver` | `qoder-json` | 传输驱动:`qoder-json` / `claude-json` / `codex-json` / `codebuddy-json` / `opencode-json` / `pi-json` |
| `binary` | 自动探测 | CLI 绝对路径或 PATH 中的命令名;内置后端可省略 |
| `permissionMode` | `bypass_permissions` | headless 无法弹权限确认,故默认放行 |
| `model` | 沿用 CLI 默认 | 强制模型 id;留空用 CLI 默认(如免费模型) |
| `reasoningEffort` | `auto` | `auto/none/low/medium/high/xhigh/max/ultracode` |
| `contextWindow` | CLI 默认 | 正整数 token 数 |
| `timeoutSeconds` | 无上限 | 单次委派墙钟上限 |
| `extraArgs` | `[]` | 追加的 CLI 参数 |
| `maxConcurrency` | `2` | 同时最多执行几个该后端子代理;同一台机器的所有 dsh 任务共享该上限,超出后排队 |

默认 `providers` 包含全部内置后端;实际启用哪些由 profile 的 `providers` 列表决定。全局字段 `scheduleMode` 控制调度:`priority`(从所调用的后端开始,按 `providers` 顺序自动溢出到下一个有空位的后端)或 `balanced`(插件自动选择当前任务最少者)。调度在插件层完成,工具名只是入口;状态与工具行会显示实际执行的后端。
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1144-1173](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L1144-L1173)

超时、取消和清理进程。

<details>
<summary>查看原文（30行）</summary>

```text
		if (this.#stallWarnSeconds > 0) {
			this.#stallTimer = setInterval(() => this.#checkStall(), Math.min(15000, Math.max(2000, this.#stallWarnSeconds * 500)));
		}
		if (this.#timeoutMs > 0) {
			this.#timeoutTimer = setTimeout(() => {
				this.#timedOut = true;
				this.#activity?.record("error", `timed out after ${this.#timeoutMs / 1000}s`);
				this.#killTree();
			}, this.#timeoutMs);
		}
		this.#onAbort = () => {
			this.#cancelled = true;
			this.#activity?.finish("aborted");
			this.#killTree();
		};
		this.#signal.addEventListener("abort", this.#onAbort, { once: true });
	}

	/**
	* 停止本次尝试并等待进程退出。幂等;供
	* 回退链清理从未发布句柄的尝试。
	*/
	async dispose() {
		this.#cancelled = true;
		if (this.#timeoutTimer) clearTimeout(this.#timeoutTimer);
		clearInterval(this.#stallTimer);
		clearInterval(this.#tailTimer);
		this.#signal.removeEventListener("abort", this.#onAbort);
		this.#killTree();
		await this.#waitForExit();
```

</details>

#### 缺口

- 不同 CLI 的实际权限行为和订阅消耗未知
  **影响**：无法量化完整成本或保证退出清理
  **进一步探讨**：固定 CLI 版本及沙箱记录任务成本、取消与残留进程。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验启动前展示权限与目标是否降低误授权？

**研究主题**：新假设与验证

#### 完整回答

目前 Codex 权限选项可能绕过审批，运行前可探索向用户展示实际后端、工作目录和已解析权限并要求确认。该方案并非已实现的保障；以模拟任务比较错误授权率、启动时延和确认疲劳，若未减少误授权或提醒被普遍忽略则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:564-570](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L564-L570)

危险权限映射。

```text
	"codex-json": {
		buildArgs(spec, model) {
			const sandbox = { accept_edits: ["--approve-for-me"], auto: ["-s", "workspace-write"], dont_ask: ["-s", "workspace-write"], default: ["-s", "read-only"], plan: ["-s", "read-only"] };
			const access = spec.permissionMode === "bypass_permissions"
				? ["--dangerously-bypass-approvals-and-sandbox"]
				: sandbox[spec.permissionMode] ?? ["-s", "workspace-write"];
			const args = ["exec", "--json", "--skip-git-repo-check", "--color", "never", ...access];
```

**依据 2 · 源码核查**：[lib/index.js:401-419](https://github.com/1373700184/dsh-subagent/blob/97406ac6126a424e2dcda8ff6b79b141da7a65a6/lib/index.js#L401-L419)

实际后端可能与请求入口不同。

<details>
<summary>查看原文（19行）</summary>

```text
		const attempt = async () => {
			const schedule = this.#getSchedule?.() ?? { specs: [spec], mode: "priority" };
			let waiting = false;
			const selected = await providerScheduler.acquire(
				schedule.specs,
				this.name,
				schedule.mode,
				request.signal,
				() => {
					if (waiting) return;
					waiting = true;
					activity.record("queue", "所有可用后端均已达到并发上限(含其他 dsh 任务),等待空位");
				},
			);
			const target = selected.spec;
			activity.provider(target.name);
			activity.record("queue", target.name === this.name
				? `使用 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`
				: `已从 ${this.name} 转给 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`);
```

</details>

#### 缺口

- 启动前确认方案未实现或测试
  **影响**：不能声称可阻止越权执行
  **进一步探讨**：用受控后端替换和权限情境开展对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
