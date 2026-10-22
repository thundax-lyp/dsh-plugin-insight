# dsh-peak-runner

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fe646bc](https://github.com/439436269-ctrl/dsh-peak-runner/tree/fe646bc931b3853815a760d7eb6943d96e6cad8f)

<!-- BEGIN META -->
[![npm 30d 24](https://img.shields.io/static/v1?label=npm+30d&message=24&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-peak-runner) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-peak-runner)
<!-- END META -->

> **实现功能**：按配置峰谷时段排队模型文本任务，提供执行、状态查询和取消工具。

> **核心亮点**：把时段判断、持久队列和模型工具接为一个可查询/取消的延时工作流，比手工等时更系统；但核心“自动低价执行”当前源码未闭环，不能将作者预期节费写成已实现效果。详见[Q01](#research-q01)。

> **风险与缺陷**：timer 到点只 log，schedule 仅读状态；leadMinutes 没有在非峰临峰时阻止启动，目标失效会回退任意模型。任务可能滞留或不按适用价格规则执行。详见[Q02](#research-q02)、[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 峰谷调度要交付什么，相比手工排程的真实增量是什么？](#detail-section-11)
  - [Q02 · 排队、到点、模型调用与取消实际上如何流转？](#detail-section-12)
  - [Q03 · 峰前 leadMinutes 和目标模型能否保证任务真的避开高价？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复的成本分别是什么？](#detail-section-14)
  - [Q05 · 如何从未执行定时器、lead 判断和模型回退推导最小改进？](#detail-section-15)
  - [Q06 · 当前版本能在什么范围试用，哪些承诺不能依赖？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供可等待的文本批任务试算峰谷调度；合格交付是任务按目标模型完成且费用可核。详见[Q01](#research-q01)。

手动等待或 cron 在同一模型/价格条件下可排程；插件应证明自动完成与总费用优势，目前 timer 与 drain 断开。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 时段判断 | 决定即时/排队 | lead 前窗口缺口，当前价格未核 |
| 持久队列 | 保存状态、查询/取消 | 单文档整批写，重启/并发待测 |
| 模型执行 | 逐条运行文本 prompt | 只在非峰工具调用时 drain，可回退别的模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH llm/storageDomain/tools/systemPrompt | 必需 | 队列、模型工具与提示 | 插件不能形成链路 |
| 可用 provider/model 与账号 | 必需 | 执行文本任务 | 可能回退其他模型或报错 |
| 准确时段/价格规则 | 节费判断必需 | 选择时机 | 当前账单未验证、可能误判 |
| 持续调度和人工监控 | 当前完成需要 | 让 pending 最终被执行 | timer 只打印日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核模型和当前官方价格，设无资金风险测试 | 规则/目标明确 |
| 排队 | 调 peak_run 提交文本任务 | pending 可查，返回 ETA 仅提示 |
| 触发 | 当前版本平价时人工再调 peak_run 并核队列 | 任务真正 done/有文本，不滞留 |
| 复盘 | 对照真实账单、模型和状态 | 不因静态时间表宣称节费 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH/模型账号/存储；金额未知 | 配 UTC 时段、价格、目标模型；耗时未知 | 当前费率未核 |
| 持续使用 | 模型 token、等待、可能重试；数值未知 | 监控 pending、人工再触发与核账单；频率未知 | 到点回调不执行 |
| 失败恢复 | 误费/滞留/重跑；金额未知 | 查 running、空文本、错模型和版本冲突；耗时未知 | 无可确认自动恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 排队/查询/取消 | 工具与 storage domain 源码 | 并发/重启完整性 |
| 定时执行 | 可 armTimer 到点写日志 | 自动 drain 未实现 |
| 节费 | 时段规则和模型调用接线 | 当前费率、目标一致性与净节省 |

> **思考**：timer 到点只 log，schedule 仅读状态；leadMinutes 没有在非峰临峰时阻止启动，目标失效会回退任意模型。任务可能滞留或不按适用价格规则执行。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把时段判断、持久队列和模型工具接为一个可查询/取消的延时工作流，比手工等时更系统；但核心“自动低价执行”当前源码未闭环，不能将作者预期节费写成已实现效果。详见[Q01](#research-q01)。

把时段判断、持久队列和模型工具接为一个可查询/取消的延时工作流，比手工等时更系统；但核心“自动低价执行”当前源码未闭环，不能将作者预期节费写成已实现效果。详见[Q01](#research-q01)。

调度/队列/runner 分层有复用价值；当前关键定时器并未消费队列，时段判断/模型回退需要统一任务契约。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

timer 到点只 log，schedule 仅读状态；leadMinutes 没有在非峰临峰时阻止启动，目标失效会回退任意模型。任务可能滞留或不按适用价格规则执行。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

自动节费/按时交付主诉求暂不推荐；可用模拟任务观察队列，但必须人工再触发并核实际模型/账单。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实队列/工具链，但自动到点执行、峰前 lead 和指定模型价区保障不足；风险是源码推导，未做宿主/账单实测；改进假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/config.js、lib/tariff.js、lib/scheduler.js、lib/queue.js、lib/runner.js、lib/tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、scheduler/runner/queue/tools/index 源码；未执行目标测试/模型、核当前官方价格或真实宿主；旧 META 仅复用。
- 下一步：固定时钟覆盖峰前 10 分钟、到点无人调用、跨日/周末、重启与并发，模拟目标失效；核实际模型、执行次数、状态和账单。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-peak-runner](https://github.com/439436269-ctrl/dsh-peak-runner)
- **版本号**：0.1.0（[固定提交 fe646bc](https://github.com/439436269-ctrl/dsh-peak-runner/tree/fe646bc931b3853815a760d7eb6943d96e6cad8f)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是持久调度器主动领取、单任务租约/版本提交，任务绑定模型与价格规则，峰前按预计运行时长判断；固定时钟和模型失败夹具测执行/费用正确性。详见[Q05](#research-q05)。

固定时钟覆盖峰前 10 分钟、到点无人调用、跨日/周末、重启与并发，模拟目标失效；核实际模型、执行次数、状态和账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 98 | — | — | 800 |
| .js | source | 8 | 880 | 528 | 286 | — |
| .mjs | test | 3 | 318 | 250 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-peak-runner/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-peak-runner 是否真正于低价时自动完成指定模型批任务，节费承诺依赖哪些未满足条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 峰谷调度要交付什么，相比手工排程的真实增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

场景是可延迟的摘要、翻译、改写等文本批任务，用户愿以等待换取预期较低的模型价格。合格交付必须是每条任务最终由目标费率对应的实际 provider/model 产出文本，状态可查、失败/取消可恢复，并用真实账单而非时段表估算节费。相对手动等低价或用 cron 调同模型，插件的增量是价格日程判断、持久队列、模型调用和三个模型工具的组合；价格规则与模型调用能力并非新发明。作者 README 声称峰价队列会在下个平价自动执行，但固定源码定时器只打印日志，故当前只能确认“排队待下次工具调用处理”的机制，不能确认自动交付。作者时段/双倍价格与假日口径是旧文档主张，本轮未查当前价格。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-26](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/README.md#L6-L26)

作者的峰谷节费和到点自动执行承诺。

<details>
<summary>查看原文（21行）</summary>

````text
DeepSeek **峰谷价感知**的任务执行器：平价时段直接跑 `deepseek-flash` 的任务批；峰价快到时把任务攒进队列、挂一条定时器，到下一个平价时段自动执行完。

## 它解决什么问题

DeepSeek 官方按 UTC 时段两档计价：**01:00–04:00、06:00–10:00 为峰时价（约两倍），其余时段平价**；周末与法定假日全天平价。你把一批摘要/翻译/改写任务丢给它，它只在便宜的时候花钱。

与 [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) 用同一套时段口径，两边对「现在是平价还是峰价」的判断一致。

## 装（正式安装）

```sh
dsh plugin --profile desktop add dsh-peak-runner
```

然后重启 DSH。它插一行进组合，注册三个工具 + 一段系统提示：

| 工具 | 作用 |
|---|---|
| `peak_run({ prompts })` | 一批 prompt 交给 `deepseek-flash` 执行。平价时段立即跑；峰价时段（或距峰价不足 `leadMinutes` 分钟时）排队，等下一个平价时段自动执行 |
| `peak_schedule()` | 查看当前档位、下一个切换点、队列状态与定时器排定情况 |
| `peak_cancel({ id? })` | 取消队列中的待执行任务（不传 id 则取消全部） |
````

</details>

**依据 2 · 源码核查**：[lib/index.js:39-55](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/index.js#L39-L55)

定时器回调仅日志，不触发 drain。

<details>
<summary>查看原文（17行）</summary>

```text
	const queue = createQueue(ctx);

	// The scheduler handle is shared between `apply()` and the tool specs.
	// `armedAt` is the one piece of mutable state the tools read.
	const timer = {
		armedAt: null,
		_dispose: null,
		arm(atMs) {
			this.disarm();
			this.armedAt = atMs;
			this._dispose = armTimer(atMs, () => {
				this.armedAt = null;
				// The timer only wakes the queue; the actual drain happens on the
				// next `peak_run` call (or the next `peak_schedule` read), which
				// keeps model calls inside an explicit tool invocation.
				console.log(`[dsh-peak-runner] off-peak reached at ${new Date(atMs).toISOString()}; queue is ready to drain`);
			});
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:98-171](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/tools.js#L98-L171)

工具提供排队、执行与状态读取。

<details>
<summary>查看原文（74行）</summary>

```text
	return [
		{
			name: "peak_run",
			description:
				"Run a batch of prompts through deepseek-flash. During off-peak hours the batch runs immediately; during peak hours (or within leadMinutes of a peak window) it is queued and executed at the next off-peak start. Returns one text block with the per-task outcome.",
			parameters: {
				prompts: {
					type: "array",
					items: { type: "string" },
					required: true,
					description: "The prompts to run; each entry is one independent model call.",
				},
			},
			output: OUTPUT,
			async execute(args) {
				const list = Array.isArray(args?.prompts) ? args.prompts : [];
				const now = Date.now();
				const added = [];
				const tasks = await queue.tasks();
				for (const prompt of list) {
					const task = normalizeTask({ prompt }, now);
					tasks.push(task);
					added.push(task);
				}
				await queue.put(tasks);

				const decision = shouldRunNow(now, settings);
				if (!decision.run) {
					const armedAt = reschedule();
					const eta = armedAt === null ? "（无下一个平价点）" : new Date(armedAt).toISOString();
					return {
						text: [
							`当前${decision.reason === "lead-window" ? "接近峰价" : "峰价"}，${added.length} 个任务已排队，等待平价时段（预计 ${eta}）自动执行。`,
							"用 peak_schedule 查看详情，用 peak_cancel 取消。",
						].join("\n"),
					};
				}

				const finished = await drain();
				const done = finished.filter((t) => t.status === "done").length;
				const failed = finished.filter((t) => t.status === "failed");
				const lines = [
					`平价时段执行完成：${done}/${added.length} 成功。`,
					...finished.slice(-added.length).map((t, i) => {
						const body = t.status === "done" ? t.result ?? "" : t.error ?? "";
						return `${i + 1}. [${t.status}] ${clip(body)}`;
					}),
				];
				if (failed.length > 0) lines.push(`${failed.length} 个任务失败，可用 peak_run 重试。`);
				return { text: lines.join("\n") };
			},
		},
		{
			name: "peak_schedule",
			description:
				"Show the current DeepSeek price tier (off-peak / peak), the next switch instant, and the state of the pending task queue.",
			parameters: {},
			output: OUTPUT,
			async execute() {
				const now = Date.now();
				const tariff = describeTariff(now, settings.peakWindows);
				const tasks = await queue.tasks();
				const pending = tasks.filter((t) => t.status === "pending");
				const done = tasks.filter((t) => t.status === "done");
				const failed = tasks.filter((t) => t.status === "failed");
				const armedAt = timer.armedAt;
				return {
					text: [
						`当前档位：${tariff.text}`,
						`队列：${pending.length} 待执行 / ${done.length} 已完成 / ${failed.length} 失败`,
						armedAt === null ? "定时器：未排定" : `定时器：已排定 ${new Date(armedAt).toISOString()}`,
					].join("\n"),
				};
			},
```

</details>

**依据 4 · 源码核查**：[lib/queue.js:24-46](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/queue.js#L24-L46)

队列存储一个 batch 文档。

<details>
<summary>查看原文（23行）</summary>

```text
export const peakRunnerDomain = defineDomain({
	// Domain names must match /^[a-z][a-z0-9_]*$/ — the hyphenated plugin name
	// is rejected by the host's schema, so the underscore spelling is used here.
	name: "peak_runner",
	version: 1,
	tables: {
		batches: domainTable(recordSchema()),
	},
});

/** The one and only batch document key. */
export const BATCH_KEY = "current";

/** Task statuses this queue uses. */
export const TASK_STATUSES = Object.freeze(["pending", "running", "done", "failed", "cancelled"]);

/**
 * Create an empty batch document.
 *
 * @returns a fresh batch with an empty task list.
 */
export function emptyBatch() {
	return { tasks: [] };
```

</details>

#### 缺口

- 未核当前价格、真实账单和宿主模型任务
  **影响**：不能量化节费或确认真实完成率
  **进一步探讨**：固定价格表与同模型任务对照，记录状态/账单/等待和合格文本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 排队、到点、模型调用与取消实际上如何流转？

**研究主题**：功能与机制

#### 完整回答

peak_run 把 prompts 标准化为 pending 后整批写 storage domain；shouldRunNow 判当前时段，峰段则 armTimer 并返回“预计自动执行”，非峰段才调用 drain。timer 到点清 armedAt 并记录一条 console log，没有对队列调用 drain；peak_schedule 仅读 tasks 计数和 timer 状态，也不触发 drain，注释“下次 schedule 读取会 drain”与实现不一致。因此峰段排队的任务要等后续非峰段 peak_run 调用才可能被执行；若一直无人再调用，仍 pending。drain 逐条置 running、调用 ctx.llm.stream、记录 done/failed；取消工具只改 pending。任务都保存在单个 batches/current 文档且每次更新 whole-document put，重启对 running 的恢复也未见专门扫描。模型文本组装失败有错误结果，成功但空文本仍可能标 done。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:98-149](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/tools.js#L98-L149)

peak_run 入队、峰段返回和非峰段 drain。

<details>
<summary>查看原文（52行）</summary>

```text
	return [
		{
			name: "peak_run",
			description:
				"Run a batch of prompts through deepseek-flash. During off-peak hours the batch runs immediately; during peak hours (or within leadMinutes of a peak window) it is queued and executed at the next off-peak start. Returns one text block with the per-task outcome.",
			parameters: {
				prompts: {
					type: "array",
					items: { type: "string" },
					required: true,
					description: "The prompts to run; each entry is one independent model call.",
				},
			},
			output: OUTPUT,
			async execute(args) {
				const list = Array.isArray(args?.prompts) ? args.prompts : [];
				const now = Date.now();
				const added = [];
				const tasks = await queue.tasks();
				for (const prompt of list) {
					const task = normalizeTask({ prompt }, now);
					tasks.push(task);
					added.push(task);
				}
				await queue.put(tasks);

				const decision = shouldRunNow(now, settings);
				if (!decision.run) {
					const armedAt = reschedule();
					const eta = armedAt === null ? "（无下一个平价点）" : new Date(armedAt).toISOString();
					return {
						text: [
							`当前${decision.reason === "lead-window" ? "接近峰价" : "峰价"}，${added.length} 个任务已排队，等待平价时段（预计 ${eta}）自动执行。`,
							"用 peak_schedule 查看详情，用 peak_cancel 取消。",
						].join("\n"),
					};
				}

				const finished = await drain();
				const done = finished.filter((t) => t.status === "done").length;
				const failed = finished.filter((t) => t.status === "failed");
				const lines = [
					`平价时段执行完成：${done}/${added.length} 成功。`,
					...finished.slice(-added.length).map((t, i) => {
						const body = t.status === "done" ? t.result ?? "" : t.error ?? "";
						return `${i + 1}. [${t.status}] ${clip(body)}`;
					}),
				];
				if (failed.length > 0) lines.push(`${failed.length} 个任务失败，可用 peak_run 重试。`);
				return { text: lines.join("\n") };
			},
		},
```

</details>

**依据 2 · 源码核查**：[lib/index.js:41-64](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/index.js#L41-L64)

timer 回调只清时刻与写日志。

<details>
<summary>查看原文（24行）</summary>

```text
	// The scheduler handle is shared between `apply()` and the tool specs.
	// `armedAt` is the one piece of mutable state the tools read.
	const timer = {
		armedAt: null,
		_dispose: null,
		arm(atMs) {
			this.disarm();
			this.armedAt = atMs;
			this._dispose = armTimer(atMs, () => {
				this.armedAt = null;
				// The timer only wakes the queue; the actual drain happens on the
				// next `peak_run` call (or the next `peak_schedule` read), which
				// keeps model calls inside an explicit tool invocation.
				console.log(`[dsh-peak-runner] off-peak reached at ${new Date(atMs).toISOString()}; queue is ready to drain`);
			});
		},
		disarm() {
			if (typeof this._dispose === "function") this._dispose();
			this._dispose = null;
			this.armedAt = null;
		},
	};

	ctx.effect(() => () => timer.disarm(), "dsh-peak-runner: scheduler timer");
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:150-171](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/tools.js#L150-L171)

peak_schedule 只读队列。

<details>
<summary>查看原文（22行）</summary>

```text
		{
			name: "peak_schedule",
			description:
				"Show the current DeepSeek price tier (off-peak / peak), the next switch instant, and the state of the pending task queue.",
			parameters: {},
			output: OUTPUT,
			async execute() {
				const now = Date.now();
				const tariff = describeTariff(now, settings.peakWindows);
				const tasks = await queue.tasks();
				const pending = tasks.filter((t) => t.status === "pending");
				const done = tasks.filter((t) => t.status === "done");
				const failed = tasks.filter((t) => t.status === "failed");
				const armedAt = timer.armedAt;
				return {
					text: [
						`当前档位：${tariff.text}`,
						`队列：${pending.length} 待执行 / ${done.length} 已完成 / ${failed.length} 失败`,
						armedAt === null ? "定时器：未排定" : `定时器：已排定 ${new Date(armedAt).toISOString()}`,
					].join("\n"),
				};
			},
```

</details>

**依据 4 · 源码核查**：[lib/tools.js:37-84](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/tools.js#L37-L84)

drain 逐条写状态和运行模型。

<details>
<summary>查看原文（48行）</summary>

```text
	/** Drain every pending task in order; each one is one model call. */
	async function drain() {
		const tasks = await queue.tasks();
		const pending = tasks.filter((t) => t.status === "pending");
		if (pending.length === 0) return tasks;

		const target = await resolveTarget(ctx, settings);
		if (target === null) {
			throw new Error("no usable provider/model is registered in this harness");
		}

		const running = new Set();
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), settings.timeoutMs);
		if (typeof timeout.unref === "function") timeout.unref();

		try {
			for (const task of pending) {
				task.status = "running";
				task.startedAt = Date.now();
				running.add(task.id);
				await queue.put(tasks);

				const outcome = await runPrompt(ctx, {
					prompt: task.prompt,
					provider: target.provider,
					model: target.model,
					maxTokens: settings.maxTokens,
					temperature: settings.temperature,
					reasoningEffort: settings.reasoningEffort,
					signal: controller.signal,
				});

				task.finishedAt = Date.now();
				running.delete(task.id);
				if (outcome.ok) {
					task.status = "done";
					task.result = outcome.text;
				} else {
					task.status = "failed";
					task.error = `${outcome.code}: ${outcome.detail}`;
				}
				await queue.put(tasks);
			}
		} finally {
			clearTimeout(timeout);
		}
		return tasks;
```

</details>

**依据 5 · 源码核查**：[lib/queue.js:78-101](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/queue.js#L78-L101)

单文档整批读写。

<details>
<summary>查看原文（24行）</summary>

```text
export function createQueue(ctx) {
	const ready = ctx.storageDomain.open(peakRunnerDomain);

	/** @returns {Promise<Array>} the current task list (fresh copy). */
	async function tasks() {
		const domain = await ready;
		const table = domain.table("batches");
		const batch = table.get(BATCH_KEY);
		if (batch === undefined) return [];
		return Array.isArray(batch.tasks) ? batch.tasks : [];
	}

	/**
	 * Persist a whole task list.
	 *
	 * @param list - the task list to store.
	 * @returns {Promise<void>} resolves once the write is durable.
	 */
	async function put(list) {
		const domain = await ready;
		await domain.table("batches").put(BATCH_KEY, { tasks: list });
	}

	return { ready, tasks, put };
```

</details>

#### 缺口

- 未用固定时钟/重启模拟确认宿主调用与持久化行为
  **影响**：不能断言每种环境的实际滞留时长与丢更新频率
  **进一步探讨**：用隔离时钟/存储/LLM 假服务覆盖到点、重启、并发和空输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 峰前 leadMinutes 和目标模型能否保证任务真的避开高价？

**研究主题**：缺陷与关键质疑

#### 完整回答

shouldRunNow 在周末或当前不在峰段时立即 run=true，未先检查距离下一峰段是否不足 leadMinutes，所以 README 的“峰价快到前停止新任务”没有在非峰分支实现；lead 窗口判断放在已处峰段之后，实际仅把临近平段结束的峰段状态命名为 lead-window。runner 的 resolveTarget 在配置 provider/model 解析失败后遍历任意可用 provider 的首个模型，不要求其价格规则与配置相同；因此任务即使等到按 DeepSeek 时间表的平价，也可能由不适用该规则的模型执行。结合 Q02 到点不执行，作者“自动避峰节费”在三个环节都没有足够源码保证。以上为固定源码推导，尚未对真实模型/账单复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scheduler.js:25-49](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/scheduler.js#L25-L49)

非峰立即运行，lead 检查在峰段内。

<details>
<summary>查看原文（25行）</summary>

```text
export function shouldRunNow(at, settings) {
	// A weekend instant is always off-peak; `isPeak` already handles that.
	// For a weekday we need the *window* tier, not the calendar tier, because
	// the lead window extends the "stop running" zone past the window end.
	const date = new Date(at);
	const weekend = Number.isNaN(date.getTime()) || date.getUTCDay() === 0 || date.getUTCDay() === 6;
	if (weekend) return { run: true, reason: "off-peak", nextRunAt: null };

	if (!hourInPeak(date.getUTCHours(), settings.peakWindows)) {
		return { run: true, reason: "off-peak", nextRunAt: null };
	}

	// Inside a peak window: look for the next switch and see whether the lead
	// window has already swallowed us.
	const switchAt = nextSwitch(at, settings.peakWindows);
	if (switchAt === null) return { run: false, reason: "peak-no-switch-found", nextRunAt: null };

	const leadMs = settings.leadMinutes * 60_000;
	if (at >= switchAt - leadMs) {
		// We are inside the lead window that precedes the switch into off-peak.
		return { run: false, reason: "lead-window", nextRunAt: switchAt };
	}
	// Still early inside a peak window; the next off-peak start is the switch.
	return { run: false, reason: "peak", nextRunAt: switchAt };
}
```

</details>

**依据 2 · 源码核查**：[lib/runner.js:21-46](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/runner.js#L21-L46)

配置目标失败时回退任意首个可用模型。

<details>
<summary>查看原文（26行）</summary>

```text
export async function resolveTarget(ctx, settings) {
	const provider = settings.provider;
	const model = settings.model;
	if (provider !== "" && model !== "") {
		try {
			await ctx.llm.resolveModelInfo(provider, model);
			return { provider, model, source: "config" };
		} catch {
			// Fall through to discovery: a profile without this provider is not an error.
		}
	}
	try {
		const providers = ctx.llm.listProviders() ?? [];
		for (const entry of providers) {
			const id = typeof entry === "string" ? entry : entry?.id;
			if (typeof id !== "string" || id === "") continue;
			const models = await ctx.llm.listModels(id);
			if (!Array.isArray(models)) continue;
			const first = models.find((candidate) => typeof candidate === "string" && candidate !== "");
			if (first !== undefined) return { provider: id, model: first, source: "auto" };
		}
	} catch {
		// No discovery either — report the absence instead of guessing.
	}
	return null;
}
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:124-147](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/tools.js#L124-L147)

按时段决定排队或即时 drain。

<details>
<summary>查看原文（24行）</summary>

```text
				const decision = shouldRunNow(now, settings);
				if (!decision.run) {
					const armedAt = reschedule();
					const eta = armedAt === null ? "（无下一个平价点）" : new Date(armedAt).toISOString();
					return {
						text: [
							`当前${decision.reason === "lead-window" ? "接近峰价" : "峰价"}，${added.length} 个任务已排队，等待平价时段（预计 ${eta}）自动执行。`,
							"用 peak_schedule 查看详情，用 peak_cancel 取消。",
						].join("\n"),
					};
				}

				const finished = await drain();
				const done = finished.filter((t) => t.status === "done").length;
				const failed = finished.filter((t) => t.status === "failed");
				const lines = [
					`平价时段执行完成：${done}/${added.length} 成功。`,
					...finished.slice(-added.length).map((t, i) => {
						const body = t.status === "done" ? t.result ?? "" : t.error ?? "";
						return `${i + 1}. [${t.status}] ${clip(body)}`;
					}),
				];
				if (failed.length > 0) lines.push(`${failed.length} 个任务失败，可用 peak_run 重试。`);
				return { text: lines.join("\n") };
```

</details>

**依据 4 · 作者声明**：[README.md:20-45](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/README.md#L20-L45)

作者峰前 lead 与目标模型承诺。

<details>
<summary>查看原文（26行）</summary>

````text
然后重启 DSH。它插一行进组合，注册三个工具 + 一段系统提示：

| 工具 | 作用 |
|---|---|
| `peak_run({ prompts })` | 一批 prompt 交给 `deepseek-flash` 执行。平价时段立即跑；峰价时段（或距峰价不足 `leadMinutes` 分钟时）排队，等下一个平价时段自动执行 |
| `peak_schedule()` | 查看当前档位、下一个切换点、队列状态与定时器排定情况 |
| `peak_cancel({ id? })` | 取消队列中的待执行任务（不传 id 则取消全部） |

## 配置（profile 补丁层覆盖）

```yaml
- id: dsh-peak-runner
  config:
    enabled: true
    provider: deepseek-account
    model: deepseek-flash
    # 峰段窗口（UTC 小时，半开区间 [start, end)）；默认对齐 DeepSeek 官方口径
    peakWindows:
      - { start: 1, end: 4 }
      - { start: 6, end: 10 }
    # 峰价开始前多少分钟停止执行新任务、开始排队
    leadMinutes: 10
    # 推理档：off 是延迟/成本正确的档位（low 仍可能烧掉 2000+ 思考 token）
    reasoningEffort: "off"
    maxTokens: 2048
    timeoutMs: 45000
````

</details>

#### 缺口

- 未核实际模型价格、假日和时钟边界
  **影响**：不能量化费用偏差或证明任务会跨峰
  **进一步探讨**：固定时钟覆盖峰前、跨日、周末和目标不可用，并核实际调用模型及账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复的成本分别是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需 DSH 的 llm/storageDomain/tools/systemPrompt、Node>=22、可用 provider/model 与正确的时区/价格窗口；包声明 DSH 0.2.0-rc.2 相关依赖。持续成本包括队列等待、宿主常驻、模型 token、价格表/节假日维护、手工观察 pending 与重触发；插件没有读取实时账单。模型可能推理 token 耗尽、超时或目标回退，多次重试会吞掉节费。失败恢复需识别到点未执行、running 重启滞留、空结果被 done、并发 whole-document put 失配；没有自动补偿/交易性恢复证据。作者“双倍价格”是时间敏感财务主张，本轮未做官方实时价格核对，因此不能用于费用建议。现金、等待、恢复及人工管理耗时均未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-35](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/package.json#L1-L35)

Node 和 DSH peer 依赖。

<details>
<summary>查看原文（35行）</summary>

```text
{
	"name": "dsh-peak-runner",
	"version": "0.1.0",
	"description": "DeepSeek 峰谷价感知的任务执行器：平价时段跑 deepseek-flash 任务批，峰价前挂定时任务推迟到下一个平价时段执行。",
	"type": "module",
	"license": "MIT",
	"main": "lib/index.js",
	"files": [
		"lib/**/*.js",
		"cordis.patch.yml",
		"README.md",
		"LICENSE"
	],
	"engines": {
		"node": ">=22"
	},
	"scripts": {
		"test": "node --test test/*.test.mjs"
	},
	"peerDependencies": {
		"@deepseek-ai/cordis": "^4.0.1",
		"@deepseek-ai/dsh-llm": "^0.2.0-rc.2",
		"@deepseek-ai/dsh-storage-domain": "^0.2.0-rc.2",
		"@deepseek-ai/dsh-system-prompt": "^0.2.0-rc.2",
		"@deepseek-ai/dsh-tools": "^0.2.0-rc.2"
	},
	"dsh": {
		"bundle": {
			"patch": "./cordis.patch.yml"
		},
		"compatibility": {
			"dshReleases": {
				"0.2.0-rc.2": "compatible"
			}
		}
```

</details>

**依据 2 · 作者声明**：[README.md:6-12](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/README.md#L6-L12)

作者价格时段与倍数声明。

```text
DeepSeek **峰谷价感知**的任务执行器：平价时段直接跑 `deepseek-flash` 的任务批；峰价快到时把任务攒进队列、挂一条定时器，到下一个平价时段自动执行完。

## 它解决什么问题

DeepSeek 官方按 UTC 时段两档计价：**01:00–04:00、06:00–10:00 为峰时价（约两倍），其余时段平价**；周末与法定假日全天平价。你把一批摘要/翻译/改写任务丢给它，它只在便宜的时候花钱。

与 [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) 用同一套时段口径，两边对「现在是平价还是峰价」的判断一致。
```

**依据 3 · 源码核查**：[lib/index.js:20-74](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/index.js#L20-L74)

宿主服务和定时器生命周期。

<details>
<summary>查看原文（55行）</summary>

```text
export const name = "peak-runner";

export const inject = ["llm", "storageDomain", "tools", "systemPrompt"];

export { Config };

/**
 * Mount the plugin.
 *
 * @param ctx - host plugin context.
 * @param config - loader config (defaults are re-resolved here).
 */
export function apply(ctx, config) {
	const settings = resolveConfig(config);
	if (!settings.enabled) {
		console.log("[dsh-peak-runner] disabled by configuration");
		return;
	}

	const queue = createQueue(ctx);

	// The scheduler handle is shared between `apply()` and the tool specs.
	// `armedAt` is the one piece of mutable state the tools read.
	const timer = {
		armedAt: null,
		_dispose: null,
		arm(atMs) {
			this.disarm();
			this.armedAt = atMs;
			this._dispose = armTimer(atMs, () => {
				this.armedAt = null;
				// The timer only wakes the queue; the actual drain happens on the
				// next `peak_run` call (or the next `peak_schedule` read), which
				// keeps model calls inside an explicit tool invocation.
				console.log(`[dsh-peak-runner] off-peak reached at ${new Date(atMs).toISOString()}; queue is ready to drain`);
			});
		},
		disarm() {
			if (typeof this._dispose === "function") this._dispose();
			this._dispose = null;
			this.armedAt = null;
		},
	};

	ctx.effect(() => () => timer.disarm(), "dsh-peak-runner: scheduler timer");

	ctx.systemPrompt.section({
		name: "peak-runner:guide",
		order: 70,
		text: () => guideText(settings),
	});

	for (const spec of createToolSpecs({ ctx, settings, queue, timer })) {
		ctx.tools.register(spec);
	}
```

</details>

**依据 4 · 源码核查**：[lib/runner.js:68-127](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/runner.js#L68-L127)

模型调用、推理档重试和文本组装。

<details>
<summary>查看原文（60行）</summary>

```text
export async function runPrompt(ctx, options) {
	const { system, prompt, provider, model, maxTokens, temperature, reasoningEffort, signal } = options;

	const attempt = async (effort) => {
		const assembler = new BlockAssembler();
		const config = {
			provider,
			model,
			...(system === undefined || system === "" ? {} : { system }),
			messages: [
				createUserMessage({
					content: [{ type: "text", text: prompt }],
					source: { kind: "user" },
				}),
			],
			...(temperature === undefined ? {} : { temperature }),
			...(maxTokens === undefined ? {} : { maxTokens }),
			...(signal === undefined ? {} : { signal }),
		};
		if (typeof effort === "string" && effort !== "") config.reasoningEffort = effort;

		const stream = ctx.llm.stream(config);
		for await (const chunk of stream) {
			assembler.push(chunk);
		}
		const finish = assembler.finish;
		let text = "";
		try {
			for (const block of assembler.blocks()) {
				if (block?.type === "text" && typeof block.text === "string") text += block.text;
			}
		} catch {
			// A malformed stream still yields whatever text was assembled above.
		}
		const usage = typeof assembler.usage === "object" ? assembler.usage : undefined;
		if (finish !== undefined && finish !== null && (finish.kind === "error" || finish.kind === "aborted")) {
			return { ok: false, code: finish.kind, detail: describeFailure(finish.failure) };
		}
		return { ok: true, text, ...(usage === undefined ? {} : { usage }) };
	};

	try {
		return await attempt(reasoningEffort);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		// A model that advertises no reasoning support rejects the knob outright;
		// the call itself is still fine, so retry once without it.
		if (typeof reasoningEffort === "string" && reasoningEffort !== "" && /reasoning/i.test(detail)) {
			try {
				return await attempt("");
			} catch (retryError) {
				return {
					ok: false,
					code: "stream-failed",
					detail: retryError instanceof Error ? retryError.message : String(retryError),
				};
			}
		}
		return { ok: false, code: "stream-failed", detail };
	}
```

</details>

**依据 5 · 源码核查**：[lib/queue.js:78-101](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/queue.js#L78-L101)

整批存储。

<details>
<summary>查看原文（24行）</summary>

```text
export function createQueue(ctx) {
	const ready = ctx.storageDomain.open(peakRunnerDomain);

	/** @returns {Promise<Array>} the current task list (fresh copy). */
	async function tasks() {
		const domain = await ready;
		const table = domain.table("batches");
		const batch = table.get(BATCH_KEY);
		if (batch === undefined) return [];
		return Array.isArray(batch.tasks) ? batch.tasks : [];
	}

	/**
	 * Persist a whole task list.
	 *
	 * @param list - the task list to store.
	 * @returns {Promise<void>} resolves once the write is durable.
	 */
	async function put(list) {
		const domain = await ready;
		await domain.table("batches").put(BATCH_KEY, { tasks: list });
	}

	return { ready, tasks, put };
```

</details>

#### 缺口

- 当前官方费率、模型账单与真实失败恢复时间未核
  **影响**：不能计算净节费和总拥有成本
  **进一步探讨**：查同日期官方费率，隔离对照任务记录等待、token、重试和人工处置

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何从未执行定时器、lead 判断和模型回退推导最小改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

队列、时段判断、模型调用分模块，BlockAssembler 的失败分支也可借鉴；但当前定时器与 drain 脱节，且时段/模型规则未绑定任务。未验证方向是为每个任务冻结实际 provider/model、价格规则版本、提交时间和最迟完成时间；由可恢复的持久调度器在到点主动领取 pending，采用单任务租约/版本提交保证重启和并发不重复或丢写。峰前判断要考虑预计最长运行时间与下一峰开始，目标模型不可用时停止或取得用户同意，而非自动换不相关模型。最小验证用固定时钟、模拟存储和 LLM 覆盖峰前 10 分钟、到点无人调用、重启、并发、目标缺失与长任务，核执行次数、目标、状态和模拟账单；若真实规则不稳定，不能承诺节费，只能呈现预计价格并让用户决定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:39-64](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/index.js#L39-L64)

到点回调无 drain。

<details>
<summary>查看原文（26行）</summary>

```text
	const queue = createQueue(ctx);

	// The scheduler handle is shared between `apply()` and the tool specs.
	// `armedAt` is the one piece of mutable state the tools read.
	const timer = {
		armedAt: null,
		_dispose: null,
		arm(atMs) {
			this.disarm();
			this.armedAt = atMs;
			this._dispose = armTimer(atMs, () => {
				this.armedAt = null;
				// The timer only wakes the queue; the actual drain happens on the
				// next `peak_run` call (or the next `peak_schedule` read), which
				// keeps model calls inside an explicit tool invocation.
				console.log(`[dsh-peak-runner] off-peak reached at ${new Date(atMs).toISOString()}; queue is ready to drain`);
			});
		},
		disarm() {
			if (typeof this._dispose === "function") this._dispose();
			this._dispose = null;
			this.armedAt = null;
		},
	};

	ctx.effect(() => () => timer.disarm(), "dsh-peak-runner: scheduler timer");
```

</details>

**依据 2 · 源码核查**：[lib/scheduler.js:25-49](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/scheduler.js#L25-L49)

lead 分支缺口。

<details>
<summary>查看原文（25行）</summary>

```text
export function shouldRunNow(at, settings) {
	// A weekend instant is always off-peak; `isPeak` already handles that.
	// For a weekday we need the *window* tier, not the calendar tier, because
	// the lead window extends the "stop running" zone past the window end.
	const date = new Date(at);
	const weekend = Number.isNaN(date.getTime()) || date.getUTCDay() === 0 || date.getUTCDay() === 6;
	if (weekend) return { run: true, reason: "off-peak", nextRunAt: null };

	if (!hourInPeak(date.getUTCHours(), settings.peakWindows)) {
		return { run: true, reason: "off-peak", nextRunAt: null };
	}

	// Inside a peak window: look for the next switch and see whether the lead
	// window has already swallowed us.
	const switchAt = nextSwitch(at, settings.peakWindows);
	if (switchAt === null) return { run: false, reason: "peak-no-switch-found", nextRunAt: null };

	const leadMs = settings.leadMinutes * 60_000;
	if (at >= switchAt - leadMs) {
		// We are inside the lead window that precedes the switch into off-peak.
		return { run: false, reason: "lead-window", nextRunAt: switchAt };
	}
	// Still early inside a peak window; the next off-peak start is the switch.
	return { run: false, reason: "peak", nextRunAt: switchAt };
}
```

</details>

**依据 3 · 源码核查**：[lib/runner.js:21-46](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/runner.js#L21-L46)

目标回退。

<details>
<summary>查看原文（26行）</summary>

```text
export async function resolveTarget(ctx, settings) {
	const provider = settings.provider;
	const model = settings.model;
	if (provider !== "" && model !== "") {
		try {
			await ctx.llm.resolveModelInfo(provider, model);
			return { provider, model, source: "config" };
		} catch {
			// Fall through to discovery: a profile without this provider is not an error.
		}
	}
	try {
		const providers = ctx.llm.listProviders() ?? [];
		for (const entry of providers) {
			const id = typeof entry === "string" ? entry : entry?.id;
			if (typeof id !== "string" || id === "") continue;
			const models = await ctx.llm.listModels(id);
			if (!Array.isArray(models)) continue;
			const first = models.find((candidate) => typeof candidate === "string" && candidate !== "");
			if (first !== undefined) return { provider: id, model: first, source: "auto" };
		}
	} catch {
		// No discovery either — report the absence instead of guessing.
	}
	return null;
}
```

</details>

**依据 4 · 源码核查**：[lib/queue.js:78-101](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/queue.js#L78-L101)

整批更新的并发边界。

<details>
<summary>查看原文（24行）</summary>

```text
export function createQueue(ctx) {
	const ready = ctx.storageDomain.open(peakRunnerDomain);

	/** @returns {Promise<Array>} the current task list (fresh copy). */
	async function tasks() {
		const domain = await ready;
		const table = domain.table("batches");
		const batch = table.get(BATCH_KEY);
		if (batch === undefined) return [];
		return Array.isArray(batch.tasks) ? batch.tasks : [];
	}

	/**
	 * Persist a whole task list.
	 *
	 * @param list - the task list to store.
	 * @returns {Promise<void>} resolves once the write is durable.
	 */
	async function put(list) {
		const domain = await ready;
		await domain.table("batches").put(BATCH_KEY, { tasks: list });
	}

	return { ready, tasks, put };
```

</details>

#### 缺口

- 持久调度/租约/规则绑定未实现或实测
  **影响**：不能把到点完成或降低费用计作现有贡献
  **进一步探讨**：原型对比丢任务、重复执行、错模型、等待和费用估算偏差

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前版本能在什么范围试用，哪些承诺不能依赖？

**研究主题**：采用判断

#### 完整回答

可把它作为无硬期限文本任务的日程/队列原型，在隔离账户和测试额度下观察任务状态，且人为在平价时再次触发并核实际模型输出。不能依赖“到点自动执行”或“峰前 lead 停止”来保证完成时间/费用，也不能据作者静态价格表推断当前账单。若目标模型不可用，应先拒绝或人工确认替代模型。当前建议 not_recommended 用于自动节费/按时交付的主诉求；作为研究原型可以观察。必须修复到点调用与模型/时段绑定并完成固定时钟及真实账单对照后重新评估。本轮未执行插件、目标测试或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:39-55](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/index.js#L39-L55)

定时器未执行队列。

<details>
<summary>查看原文（17行）</summary>

```text
	const queue = createQueue(ctx);

	// The scheduler handle is shared between `apply()` and the tool specs.
	// `armedAt` is the one piece of mutable state the tools read.
	const timer = {
		armedAt: null,
		_dispose: null,
		arm(atMs) {
			this.disarm();
			this.armedAt = atMs;
			this._dispose = armTimer(atMs, () => {
				this.armedAt = null;
				// The timer only wakes the queue; the actual drain happens on the
				// next `peak_run` call (or the next `peak_schedule` read), which
				// keeps model calls inside an explicit tool invocation.
				console.log(`[dsh-peak-runner] off-peak reached at ${new Date(atMs).toISOString()}; queue is ready to drain`);
			});
```

</details>

**依据 2 · 源码核查**：[lib/scheduler.js:25-49](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/scheduler.js#L25-L49)

lead 未在非峰前检查。

<details>
<summary>查看原文（25行）</summary>

```text
export function shouldRunNow(at, settings) {
	// A weekend instant is always off-peak; `isPeak` already handles that.
	// For a weekday we need the *window* tier, not the calendar tier, because
	// the lead window extends the "stop running" zone past the window end.
	const date = new Date(at);
	const weekend = Number.isNaN(date.getTime()) || date.getUTCDay() === 0 || date.getUTCDay() === 6;
	if (weekend) return { run: true, reason: "off-peak", nextRunAt: null };

	if (!hourInPeak(date.getUTCHours(), settings.peakWindows)) {
		return { run: true, reason: "off-peak", nextRunAt: null };
	}

	// Inside a peak window: look for the next switch and see whether the lead
	// window has already swallowed us.
	const switchAt = nextSwitch(at, settings.peakWindows);
	if (switchAt === null) return { run: false, reason: "peak-no-switch-found", nextRunAt: null };

	const leadMs = settings.leadMinutes * 60_000;
	if (at >= switchAt - leadMs) {
		// We are inside the lead window that precedes the switch into off-peak.
		return { run: false, reason: "lead-window", nextRunAt: switchAt };
	}
	// Still early inside a peak window; the next off-peak start is the switch.
	return { run: false, reason: "peak", nextRunAt: switchAt };
}
```

</details>

**依据 3 · 源码核查**：[lib/runner.js:21-46](https://github.com/439436269-ctrl/dsh-peak-runner/blob/fe646bc931b3853815a760d7eb6943d96e6cad8f/lib/runner.js#L21-L46)

模型可回退。

<details>
<summary>查看原文（26行）</summary>

```text
export async function resolveTarget(ctx, settings) {
	const provider = settings.provider;
	const model = settings.model;
	if (provider !== "" && model !== "") {
		try {
			await ctx.llm.resolveModelInfo(provider, model);
			return { provider, model, source: "config" };
		} catch {
			// Fall through to discovery: a profile without this provider is not an error.
		}
	}
	try {
		const providers = ctx.llm.listProviders() ?? [];
		for (const entry of providers) {
			const id = typeof entry === "string" ? entry : entry?.id;
			if (typeof id !== "string" || id === "") continue;
			const models = await ctx.llm.listModels(id);
			if (!Array.isArray(models)) continue;
			const first = models.find((candidate) => typeof candidate === "string" && candidate !== "");
			if (first !== undefined) return { provider: id, model: first, source: "auto" };
		}
	} catch {
		// No discovery either — report the absence instead of guessing.
	}
	return null;
}
```

</details>

#### 缺口

- 没有真实宿主、账单和修复版验收
  **影响**：不能推荐生产排程或量化节费
  **进一步探讨**：修复后先用无资金风险的模拟任务与官方价格来源核查

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
