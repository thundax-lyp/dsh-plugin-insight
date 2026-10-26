# dsh-subagent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[0b64f7b](https://github.com/1373700184/dsh-subagent/tree/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b)

<!-- BEGIN META -->
[![npm 30d 21](https://img.shields.io/static/v1?label=npm+30d&message=21&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

> **实现功能**：把外部CLI注册为DSH子代理提供方，提供动态委派工具、进度、调度和崩溃后跟踪。

> **核心亮点**：集中CLI驱动、动态工具、并发槽和日志恢复，减少手工终端编排；模型与官方subagent契约为继承能力。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：默认bypass权限可映射为跳过批准与沙箱，detached存活扩大操作责任；先发notice后标记不保证端到端只一次。见 [Q03](#research-q03)。

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
  - [Q01 · 多后端委派的实际增量是什么？](#detail-section-11)
  - [Q02 · 运行和恢复如何串接？](#detail-section-12)
  - [Q03 · 默认权限与通知保证可靠吗？](#detail-section-13)
  - [Q04 · 前置与全任务成本是什么？](#detail-section-14)
  - [Q05 · 可证伪改进与当前采用是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多CLI使用者委派自包含独立任务，以正确产物和父agent独立验收为交付。

手动CLI终端/脚本与宿主原生子agent是替代；比较需同任务、后端和预算，不把并发数当收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| CLI委派 | 使用外部订阅/模型任务 | 子代理无父上下文，权限独立 |
| 调度/进度 | 并发槽和状态查询 | 实际后端可因溢出改变 |
| 崩溃后跟踪 | 重读日志与补notice | 不保证父消费只一次，需验收进程树 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH subagent/tools/agents等接口 | 启动必需 | provider和通知接线 | 不兼容需停止加载 |
| 已安装登录的外部CLI | 对应后端必需 | 执行任务和消耗自身额度 | 不可用不得伪装成功 |
| 隔离目录/最小权限/预算 | 可控使用必需 | 约束文件与外部副作用 | 默认bypass不适合直接生产 |
| 日志/meta磁盘与平台进程支持 | 恢复必需 | 重接运行 | 重启/Windows需单独验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核CLI版本/登录并配置最小权限 | 隔离任务不越范围 |
| 2 | 父agent给自包含任务并记录实际后端 | 产物可独立核验 |
| 3 | 用户取消/强杀宿主并恢复 | 无停止后写入或重复办结，否则停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多CLI/账号及隔离资源未知 | 驱动、权限、目录和预算配置 | 默认bypass需明确调整 |
| 持续使用 | 各订阅/API、失败尝试与日志 | 自包含上下文、汇总和独立验收 | 无合格任务单位成本 |
| 失败恢复 | 存活进程、重试与重复结果资源未知 | 核对PID/日志/通知/真实写入 | 宿主退出不等于子进程停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 委派 | 多driver和动态provider存在 | 任务质量与成本优势 |
| 恢复 | 日志与PID重接路径 | 正确进程、取消和父消费 |
| 调度 | 并发槽与重启占位 | 总吞吐和预算放大 |

> **思考**：默认bypass权限可映射为跳过批准与沙箱，detached存活扩大操作责任；先发notice后标记不保证端到端只一次。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中CLI驱动、动态工具、并发槽和日志恢复，减少手工终端编排；模型与官方subagent契约为继承能力。见 [Q01](#research-q01)、[Q02](#research-q02)。

集中CLI驱动、动态工具、并发槽和日志恢复，减少手工终端编排；模型与官方subagent契约为继承能力。见 [Q01](#research-q01)、[Q02](#research-q02)。

文件日志脱离宿主管道、先读尾部再判失败值得借鉴；需为detached进程定义权限/退出与回执所有权。notified应表达投递尝试而非用户已消费，当前不能宣传严格只一次。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认bypass权限可映射为跳过批准与沙箱，detached存活扩大操作责任；先发notice后标记不保证端到端只一次。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先在隔离仓库用最小权限和总预算验收每个后端的取消、重启与结果消费。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多后端与恢复编排；默认权限、取消和通知消费未验收；稳定回执为未验证假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/hidden-runner.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查driver、spawn、recovery和注册，不运行外部CLI/目标代码，不访问账号或订阅，不把作者恢复说明当本轮实测。
- 下一步：逐后端最小权限、静默、失败转移、取消、宿主强杀和通知消费矩阵，对账真实文件及全部费用。

**分析版本**

- **仓库**：[1373700184/dsh-subagent](https://github.com/1373700184/dsh-subagent)
- **版本号**：1.1.6（[固定提交 0b64f7b](https://github.com/1373700184/dsh-subagent/tree/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的稳定完成回执与父会话消费确认，可能减少崩溃窗口重复/遗漏；用五阶段强杀实验测净收益。见 [Q05](#research-q05)。

逐后端最小权限、静默、失败转移、取消、宿主强杀和通知消费矩阵，对账真实文件及全部费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 187 | — | — | 2942 |
| .js | source | 3 | 3210 | 2964 | 177 | — |
| .cjs | source | 1 | 21 | 18 | 2 | — |
| .mjs | source | 1 | 40 | 35 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/1373700184/dsh-subagent/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外部CLI子代理适配能否减少多后端委派负担，崩溃存活和权限默认值带来什么责任？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多后端委派的实际增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已经使用多个外部编码CLI订阅、希望由DSH父agent分派独立任务的人。合格结果是子任务产物正确、可核验且与父目标一致，不是外部CLI进程退出0。相对手动开多个终端，插件将provider注册、协议事件折叠、进度、并发槽和恢复集中到DSH。父上下文不自动继承，任务必须自包含；因此它减少启动/查状态负担，同时把上下文准备和验收留给父agent。技术贡献为驱动与宿主编排，外部模型、CLI与官方subagent工具不是原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/README.md#L1-L15)

作者一次性CLI/上下文隔离定位

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

**依据 2 · 源码核查**：[lib/index.js:1693-1711](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L1693-L1711)

动态官方ToolSubagent/provider及可用命令接线

<details>
<summary>查看原文（19行）</summary>

```text
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
			}
			// 只有本机确实存在对应 CLI 时斜杠指令才有用;
			// 否则跳过,避免指令菜单出现死路。
			const commandBinary = resolveBinary(providerName, entry.binary);
			const commandAvailable = Boolean(commandBinary && existsSync(commandBinary));
			if (commandAvailable && !record.command) record.command = buildCommand(providerName);
```

</details>

#### 缺口

- 没有多CLI真实案件的质量与总成本对照
  **影响**：无法确认并发等于效率提升
  **进一步探讨**：固定同批独立任务比较终端与插件的合格率、人工验收和总费用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 运行和恢复如何串接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每种driver映射参数与JSON事件，实际CLI以detached启动，stdin传任务，stdout/stderr写文件，run meta保存provider、PID和父会话。重启时先折叠日志，再看PID，运行中占并发槽继续跟踪，结束后补notice。可借鉴处是日志与进程寿命脱离宿主管道，并在重启先读尾部再判死，避免把停机期间正常完成误判失败。代价是宿主退出不等于子进程停止，需要明确取消/退出所有权；PID活着也不能单独证明仍是原进程，具体重接安全需真实平台验收。Windows额外隐藏runner改变进程树，不能用Unix结果代替。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:980-1009](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L980-L1009)

重启折叠日志、判死、补通知及恢复槽位

<details>
<summary>查看原文（30行）</summary>

```text
		const entry = activityLedger.adopt(meta);
		let offset = foldRunLog(meta, entry, 0);
		if (entry.status === "running" && !pidAlive(meta.pid)) {
			// CLI 可能在宿主停机期间已经完成:先折叠日志尾部,
			// 只有仍未收敛的运行才判定为失败。
			offset = foldRunLog(meta, entry, offset, true);
			if (entry.status === "running") {
				entry.status = "error";
				entry.endedAt = Date.now();
			}
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), pid: null });
		}
		if (entry.status !== "running") {
			cleanupRunFiles(meta.id);
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, pid: null });
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
				}
			}
			continue;
		}
		const releaseSlot = providerGate.reserve(meta.provider ?? "unknown");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1106-1153](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L1106-L1153)

detached、文件日志、stdin与unref

<details>
<summary>查看原文（48行）</summary>

```text
		// 输出持久化:子进程直接写文件并以 detached 方式运行,
		// 因此 dsh 崩溃既不会中断其 stdout,也不会丢失转录;宿主
		// 跟踪日志,并在重启后继续跟踪。
		ensureRunsDir();
		this.#logPath = runLogPath(this.#id);
		this.#errPath = runErrPath(this.#id);
		const useHiddenRunner = platform === "win32" && existsSync(HIDDEN_RUNNER);
		if (useHiddenRunner) {
			// Windows 下经隐藏控制台包装启动:detached 保证崩溃后存活,
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

**依据 3 · 源码核查**：[lib/hidden-runner.cjs:5-19](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/hidden-runner.cjs#L5-L19)

Windows隐藏进程包装

<details>
<summary>查看原文（15行）</summary>

```text
// 以隐藏控制台托管 CLI:本进程保持 detached 以便 dsh 崩溃后继续运行,
// PowerShell 为 CLI 创建不可见控制台,避免其 shell 子进程弹黑框。
const configPath = process.argv[2];
const errPath = process.argv[3];
if (!configPath) process.exit(2);
let errFd = "ignore";
try {
	if (errPath) errFd = openSync(errPath, "a");
} catch {}
const child = spawn("powershell.exe", [
	"-NoProfile",
	"-ExecutionPolicy", "Bypass",
	"-File", path.join(__dirname, "hidden-runner.ps1"),
	"-ConfigPath", configPath,
], { windowsHide: true, stdio: ["ignore", "ignore", errFd] });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认权限与通知保证可靠吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认permissionMode是bypass_permissions；Codex driver明确映射为跳过批准与沙箱参数。这不是只有“调用另一模型”，外部CLI会以其账户和机器权限操作工作区，并且父会话权限不会自动成为子CLI权限。故核心采用前提是隔离工作树、最小权限与完整任务范围。恢复通知“只一次”也需要收窄：先agent.followup再upsert notified，中间崩溃可能导致重复通知；标记成功不等于父agent已消费或验收结果。源码可说明存在去重意图，不能证明端到端exactly-once。模型故障转移与后端溢出也会改变实际执行者/额度，必须看状态记录，不凭工具入口名推断来源。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:224-237](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L224-L237)

权限默认与墙钟上限可选

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:599-610](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L599-L610)

具体CLI权限参数映射

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

**依据 3 · 源码核查**：[lib/index.js:995-1004](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L995-L1004)

通知先于notified持久标记

<details>
<summary>查看原文（10行）</summary>

```text
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1029-1038](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L1029-L1038)

运行中恢复通知同样先发后记

<details>
<summary>查看原文（10行）</summary>

```text
				cleanupRunFiles(meta.id);
				upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt, sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, pid: null });
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
```

</details>

#### 缺口

- 取消、权限隔离、重启窗口和通知重复未执行
  **影响**：限制生产代码与不可逆操作采用
  **进一步探讨**：故障注入通知前后并核对父事件、子进程树及文件写入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 前置与全任务成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

用户需安装登录各CLI、确保版本支持driver参数与事件格式，并有宿主subagents/tools/agents等服务。不同订阅/API额度各自扣费，插件不会统一免单。首次投入是驱动/路径、工作目录、权限、超时与并发配置；持续是任务上下文、子代理调用、日志存储、父agent汇总和独立验收。故障转移多尝试与输出静默等待都计入单位合格子任务成本，不能只算最后成功模型。默认timeout未设时不能假定全任务总时长有限，需显式配置相关预算。升级CLI或Windows runner后要重新验收。金额、工时和实际并发收益均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-15](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/README.md#L13-L15)

CLI安装登录前提

```text
装好后插件的 `cordis.patch.yml` 会向 profile 树插入提供方 `dsh-subagent` 和 Agent 预设;委派工具、斜杠指令随**已启用的后端**动态挂载(启用几个后端就有几个工具/指令)。重启 dsh 生效。

前置条件:对应 CLI 已安装且已登录——`qodercli`(`~/.qoder/bin/qodercli/`)、`qoderclicn`(`~/.qoder-cn/bin/qoderclicn/`)、`codex`(npm 全局)、`claude`(npm 全局,沿用 `~/.claude/settings.json` 的模型/网关配置;设置页的模型列表也从这里读取)、`opencode`(`~/.opencode/bin/`)、`pi`(`~/.pi/agent/`,优先通过 node 直接启动受管安装的 CLI,避免 Windows 弹终端窗口)、`codebuddy`(npm 全局 `@tencent-ai/codebuddy-code`,通过 node 启动)。上述目录都找不到时,会按 PATH 搜索命令名(`qodercli` / `qoderclicn` / `opencode` / `pi` / `codebuddy` / `codex` / `claude`);CLI 路径里填裸命令名也会走 PATH。
```

**依据 2 · 源码核查**：[lib/index.js:228-243](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L228-L243)

模型链预算、超时和并发配置

<details>
<summary>查看原文（16行）</summary>

```text
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
	/** 原样追加的额外 CLI 参数(高级覆盖项)。 */
	extraArgs: z.array(z.string()).default([]),
	/** 同时最多执行几个该后端子代理;超出后排队。 */
	maxConcurrency: z.number().min(1).default(2),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1135-1153](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L1135-L1153)

日志、环境和子进程资源

<details>
<summary>查看原文（19行）</summary>

```text
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

- 各后端订阅/费用、失败率和验收工时未测
  **影响**：总成本及可扩展性未知
  **进一步探讨**：记录每次尝试真实后端、token/费用、时长和人工修正

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可证伪改进与当前采用是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是给每次run分配稳定完成回执ID，并让父会话持久确认消费后再标完成通知，能减少崩溃窗口重复汇总和漏办结。依据Q03通知与notified非事务，不应通过“再发新任务”恢复。最小实验在CLI结束、notice发前、发后落标前、父消费前后强杀宿主，对照当前实现，统计重复notice、遗漏结果、重复文件修改及恢复时间；若收益不能超过协议维护成本则否定。当前建议观察，尤其默认绕过沙箱/批准不适合直接用于真实生产仓库。具备隔离环境者可先最小权限、明确可回滚范围和总预算验收，再考虑试用；任何停止后仍写入或任务范围漂移都应停用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:995-1004](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L995-L1004)

完成通知与持久去重窗口

<details>
<summary>查看原文（10行）</summary>

```text
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1106-1153](https://github.com/1373700184/dsh-subagent/blob/0b64f7b9cc99daa2ad2f51d80c5ab16899f2db6b/lib/index.js#L1106-L1153)

子进程可存活于宿主退出

<details>
<summary>查看原文（48行）</summary>

```text
		// 输出持久化:子进程直接写文件并以 detached 方式运行,
		// 因此 dsh 崩溃既不会中断其 stdout,也不会丢失转录;宿主
		// 跟踪日志,并在重启后继续跟踪。
		ensureRunsDir();
		this.#logPath = runLogPath(this.#id);
		this.#errPath = runErrPath(this.#id);
		const useHiddenRunner = platform === "win32" && existsSync(HIDDEN_RUNNER);
		if (useHiddenRunner) {
			// Windows 下经隐藏控制台包装启动:detached 保证崩溃后存活,
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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
