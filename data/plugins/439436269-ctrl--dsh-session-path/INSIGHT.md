# dsh-session-path

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9ffc7b3](https://github.com/439436269-ctrl/dsh-session-path/tree/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607)

<!-- BEGIN META -->
[![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-session-path) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-session-path)
<!-- END META -->

> **实现功能**：复制DSH会话日志位置，或把压缩日志导出为可读交接文件，便于另一个会话阅读接续。

> **核心亮点**：集中日志定位、多帧解压和交接入口，减少手写接线；增量在流程整合而非新隔离或接续算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：ID未限制单路径组件/真实根，JSONL保留前缀而非最新尾部，裁剪与解码失败不足以说明完整性；同名明文可覆盖。详见[Q02](#research-q02)。

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
  - [Q01 · 适合谁，路径定位与交接如何完成？](#detail-section-11)
  - [Q02 · 增量贡献与最关键权限/完整性缺陷是什么？](#detail-section-12)
  - [Q03 · 启动、明文授权与使用流程有哪些要求？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本和效果如何界定？](#detail-section-14)
  - [Q05 · 工程复用点及可核交接假设如何研究？](#detail-section-15)
  - [Q06 · 当前推荐结论、继续探讨和停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户明确授权读取已有会话并交接，需核来源/遗漏和真实路径。

手动找日志/解压并提供路径可替代；插件集中入口但增加明文副本与格式/权限维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 日志定位 | 项目/会话/代际查找 | ID和真实路径需约束 |
| 复制路径 | GUI/模型复制块 | 非跨会话身份授权 |
| 交接导出 | MD/JSONL可读文件 | 语义/裁剪不同，明文同名覆盖 |
| 压缩读取 | 多帧Zstd | 缺API/损坏可能只保留前缀 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt/webServer契约 | Host必需 | 注册工具、指引与定位路由 | 服务/版本不匹配影响加载 |
| Node原生Zstd解压API | 压缩日志必需 | 每帧解压 | API缺失返回空前缀而非明确兼容错误 |
| DSH_HOME及日志读取权限 | 必需 | 查项目/会话目录 | 找不到或解码失败不代表空会话 |
| Web slots/clipboard | 界面可选 | 复制路径或接续块 | 有clipboard拒绝反馈和旧接口fallback |
| handoffDir写权限与明文保存授权 | 导出必需 | 写MD/JSONL | 不应把原生fs写出当沙箱存储 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包/Node及无敏感日志，明确读取范围 | 先核会话ID/真实路径和输出目录权限 |
| 定位 | 用户复制或模型显式session_path | 路径属于预期会话和真实根目录 |
| 交接 | 审核后session_handoff并读取输出 | 核格式保留范围、截断和来源，不直接执行历史指令 |
| 恢复 | 保留原日志，对照导出及目录清理 | 写出未知时核文件，避免同名覆盖与盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/兼容运行时与本地磁盘，金额未知 | 核日志结构、读取权限和输出目录 | 引入明文副本及版本维护 |
| 持续使用 | 扫目录、解压及全量累积，模型读取另算tokens | 审查接续保真及敏感信息 | maxChars不限制源读取/总内存 |
| 失败恢复 | 重读/重导出及旧文件比对 | 区分部分日志、解压不可用、写出失败 | 同名原生writeFile无原子版本收据 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少找日志接线 | 双GUI入口、两工具、日志代际排序 | 实际省时及任务接续正确率 |
| 读取压缩日志 | 多帧扫描与逐帧解压 | 损坏/缺API前缀的完整性可识别性 |
| 交接保真 | 来源头/MD角色区分 | MD裁剪及JSONL前缀是否保留关键最新决定 |

> **思考**：ID未限制单路径组件/真实根，JSONL保留前缀而非最新尾部，裁剪与解码失败不足以说明完整性；同名明文可覆盖。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：集中日志定位、多帧解压和交接入口，减少手写接线；增量在流程整合而非新隔离或接续算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

集中日志定位、多帧解压和交接入口，减少手写接线；增量在流程整合而非新隔离或接续算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用点包括纯定位/解析/渲染分层、数值代际排序、旧新目录命名兼容、多帧结构扫描、finally关闭文件、UI复制拒绝反馈，以及将上下文注入区分于用户消息。损坏时保留前缀有可用性价值，但静默部分成功和缺来源收据会影响可信度，不能只列成容错亮点。

<a id="detail-section-5"></a>

### 1.4 主要限制

ID未限制单路径组件/真实根，JSONL保留前缀而非最新尾部，裁剪与解码失败不足以说明完整性；同名明文可覆盖。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，继续核真实路径授权、导出完整性与JSONL最新语义，再对受控日志研究接续效果。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持日志代际定位、多帧解压和可读交接文件集成；路径授权、MD裁剪和JSONL前缀不提供完整交接保证，固定文件写出会覆盖。源/输出hash与保留范围收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/paths.js、lib/client.js、lib/zstd.js、lib/handoff.js、lib/session-info.js、lib/trust.js、lib/tools.js、package.json、lib/config.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host/GUI入口、定位/帧解析/渲染/写出与请求头信任；未读取真实会话或运行目标代码，宿主外层授权另有边界。
- 下一步：进一步探讨可从路径反例、损坏/缺API、超长单条、最新决定与同名并发夹具入手，比较完整性及资源。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-session-path](https://github.com/439436269-ctrl/dsh-session-path)
- **版本号**：0.1.2（[固定提交 9ffc7b3](https://github.com/439436269-ctrl/dsh-session-path/tree/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨真实路径授权与可核交接收据，绑定源/输出hash、保留范围和裁剪原因并原子版本写出，资源/快照成本未验证。详见[Q05](#research-q05)。

进一步探讨可从路径反例、损坏/缺API、超长单条、最新决定与同名并发夹具入手，比较完整性及资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 219 | — | — | 1906 |
| .js | source | 12 | 1558 | 962 | 514 | — |
| .mjs | test | 1 | 308 | 265 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-session-path/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-session-path/issues?q=is%3Aissue+created%3A2026-09-22T06%3A25%3A40.837Z..2026-10-22T06%3A25%3A40.837Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-session-path/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A25%3A40.837Z..2026-10-22T06%3A25%3A40.837Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查日志定位/压缩读取/可读交接、路径权限和完整性及资源成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，路径定位与交接如何完成？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合希望把已有DSH会话交给另一个会话阅读、继续工作的人。输入会话ID，默认当前会话；输出日志位置、复制块，或可读MD/JSONL文件。合格结果应对应正确会话、保留最新关键决定并说明遗漏，不能把找到路径/导出成功等同于任务接续成功。

定位从DSH_HOME/sessions按工作区派生项目优先、再枚举项目，候选会话目录兼容带session-前缀；日志名严格匹配并按数值代际降序，同代压缩优先。GUI按钮通过只读HTTP取复制内容；session_handoff另走原生文件写出。压缩阅读器结构扫描完整Zstd帧并解压、丢弃packed增量/损坏行；MD保留用户/助手/工具调用和上下文注入，非完整事件日志。JSONL也经过解析和packed过滤，不能称逐字原始日志副本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:24-61](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/index.js#L24-L61)

工具、提示与路由注册。

<details>
<summary>查看原文（38行）</summary>

```text
export const inject = ["tools", "systemPrompt", "webServer"];

export { Config };

/**
 * Mount the plugin.
 *
 * @param ctx - host plugin context.
 * @param config - loader config (defaults are re-resolved here).
 */
export function apply(ctx, config) {
	const settings = resolveConfig(config);
	if (!settings.enabled) return;

	if (settings.promptEnabled) {
		ctx.systemPrompt.section({
			name: "session-path:guide",
			order: settings.promptOrder,
			text: () => guideText(settings),
		});
	}

	ctx.effect(() => registerResolveRoute(ctx, settings), "dsh-session-path: resolve route");

	for (const spec of createToolSpecs({ ctx, settings })) {
		ctx.tools.register(
			defineTool({
				name: spec.name,
				description: spec.description,
				parameters: spec.parameters,
				output: {
					schema: spec.outputSchema,
					render: spec.render,
				},
				...(spec.presentCall ? { presentCall: spec.presentCall } : {}),
				execute: spec.execute,
			}),
		);
```

</details>

**依据 2 · 源码核查**：[lib/paths.js:60-87](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L60-L87)

候选日志/代际排序。

<details>
<summary>查看原文（28行）</summary>

```text
export function logGeneration(name) {
	const match = LOG_FILE.exec(name);
	if (match === null) return null;
	const version = Number(match[1] ?? 0);
	return Number.isSafeInteger(version) ? { version, compressed: Boolean(match[2]) } : null;
}

/**
 * Committed logs of one session directory, newest generation first.
 *
 * Numeric generations order numerically (`v10` beats `v3`), and a compressed
 * artifact wins over a plain one of the same generation.
 *
 * @param directory - session directory.
 * @returns absolute log paths, best candidate first.
 */
export function listSessionLogs(directory) {
	let names;
	try {
		names = readdirSync(directory);
	} catch {
		return [];
	}
	return names
		.map((name) => ({ name, generation: logGeneration(name) }))
		.filter((entry) => entry.generation !== null)
		.sort((a, b) => b.generation.version - a.generation.version || Number(b.generation.compressed) - Number(a.generation.compressed))
		.map((entry) => join(directory, entry.name));
```

</details>

**依据 3 · 源码核查**：[lib/paths.js:124-153](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L124-L153)

派生项目和全扫。

<details>
<summary>查看原文（30行）</summary>

```text
export function findSessionDirectory(root, sessionId, cwd) {
	const names = sessionDirectoryNames(sessionId);
	const projects = [];
	if (typeof cwd === "string" && cwd.length > 0) projects.push(projectDirectoryName(cwd));
	let candidates = [];
	try {
		candidates = readdirSync(root);
	} catch {
		return null;
	}
	for (const project of candidates) {
		if (!projects.includes(project)) projects.push(project);
	}
	let emptyMatch = null;
	for (const project of projects) {
		for (const name of names) {
			const dir = join(root, project, name);
			let stats;
			try {
				stats = statSync(dir);
			} catch {
				continue;
			}
			if (!stats.isDirectory()) continue;
			const logs = listSessionLogs(dir);
			if (logs.length > 0) return { dir, project, logs };
			emptyMatch ??= { dir, project, logs: [] };
		}
	}
	return emptyMatch;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:98-107](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/client.js#L98-L107)

GUI定位并复制。

<details>
<summary>查看原文（10行）</summary>

```text
		async function copyFor(sessionId) {
			const params = new URLSearchParams({ sessionId });
			const response = await fetch(ROUTE + "?" + params.toString(), { headers: { accept: "application/json" } });
			const body = await response.json().catch(() => null);
			if (!response.ok || body === null || body.ok !== true) {
				throw new Error(body?.error?.message ?? "HTTP " + response.status);
			}
			const text = typeof body.value?.text === "string" && body.value.text !== "" ? body.value.text : body.value?.logPath ?? "";
			if (!(await writeClipboard(text))) throw new Error("clipboard write was refused");
			return text;
```

</details>

**依据 5 · 源码核查**：[lib/zstd.js:91-101](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L91-L101)

记录筛选。

<details>
<summary>查看原文（11行）</summary>

```text
export function parseRecordLine(line) {
	if (line.length === 0) return null;
	if (line.length > 8 * 1024 * 1024) return null; // giant packed row: skip before JSON.parse
	try {
		const record = JSON.parse(line);
		if (record === null || typeof record !== "object") return null;
		if (PACKED_TYPES.has(record.type)) return null;
		return record;
	} catch {
		return null; // best-effort replay: one damaged line must not kill the file
	}
```

</details>

**依据 6 · 源码核查**：[lib/handoff.js:188-218](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L188-L218)

读取并写出。

<details>
<summary>查看原文（31行）</summary>

```text
export async function writeHandoff(ctx, settings, info, options = {}) {
	const format = options.format === "jsonl" ? "jsonl" : settings.handoffFormat;
	const maxChars = Number(options.maxChars) > 0 ? Math.floor(Number(options.maxChars)) : settings.maxHandoffChars;
	if (info.logPath === "") throw new Error(`no committed log found for session "${info.sessionId}"`);
	const directory = handoffDirectory(ctx, settings);
	await mkdir(directory, { recursive: true });
	let text;
	let kept;
	let truncated;
	if (format === "jsonl") {
		const records = [];
		for await (const record of readSessionRecords(info.logPath)) records.push(record);
		const rendered = renderJsonl(info, records, maxChars);
		text = rendered.text;
		kept = rendered.kept;
		truncated = rendered.truncated;
	} else {
		const entries = [];
		for await (const record of readSessionRecords(info.logPath)) {
			const entry = toEntry(record);
			if (entry !== null) entries.push(entry);
		}
		const rendered = renderMarkdown(info, entries, maxChars);
		text = rendered.text;
		kept = rendered.kept;
		truncated = rendered.truncated;
	}
	const safeId = info.sessionId.replace(/[^A-Za-z0-9._-]/g, "_");
	const file = join(directory, `${safeId}.${format === "jsonl" ? "jsonl" : "md"}`);
	await writeFile(file, text, "utf8");
	return { file, chars: text.length, kept, truncated, format };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量贡献与最关键权限/完整性缺陷是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把日志版本定位、多帧压缩读取、复制入口与接续文件连成无需手写目录/解压命令的流程；角色区分也有助于不把注入内容冒充用户。它不提供新的隔离或交接语义保证。

首先，sessionId只作非空/长度处理，目录候选保持分隔符，随后join(root,project,name)并statSync跟随链接，没有真实路径根包含检查。若调用者提供含父级片段的ID，且规范化后目录存在并包含匹配session日志，就可能选到sessions根之外；项目/会话符号链接也可把读取带出根。这是静态条件推演，未执行越界复现，并非任意文件名读取。显式ID还允许指定其他会话，未在插件中绑定调用者会话授权。

HTTP有Host白名单、拒绝cross-site与Origin hostname检查，能降低浏览器跨站读取，但Host是请求头、Origin同hostname未比较端口，不能单独当远端身份或会话授权。外层宿主认证未在本组件证明。

其次，MD尾部预算至少保留一条，首条可超maxChars，单条20000字符裁剪不设置全局truncated；JSONL按原顺序从头保留，预算满就break，与工具声称保留最近部分不同。损坏行/缺解压API可以变成较少甚至零条且最终写出成功。相同安全化ID固定文件名直接writeFile可覆盖旧版本，未提供原子写/快照hash；因此输出不是完整性或不可变收据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/session-info.js:100-113](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/session-info.js#L100-L113)

ID进入定位。

<details>
<summary>查看原文（14行）</summary>

```text
export async function resolveSessionInfo(ctx, settings, sessionId, hints = {}) {
	const id = hint(sessionId);
	if (id === "") throw new Error("session id is required");
	const header = liveSessionHeader(ctx, id);
	const hintedCwd = hint(hints.cwd);
	const liveCwd = hint(header.cwd);
	const root = sessionsRoot(ctx);
	const found = findSessionDirectory(root, id, liveCwd || hintedCwd);
	const logs = found?.logs ?? [];
	const logPath = logs[0] ?? "";
	let cwd = liveCwd || hintedCwd;
	if (cwd === "" && logPath !== "") cwd = hint((await readSessionHeader(logPath))?.cwd);
	let title = hint(hints.title);
	if (title === "" && logPath !== "") title = await readSessionTitle(logPath, settings.titleScanBytes);
```

</details>

**依据 2 · 源码核查**：[lib/paths.js:110-113](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L110-L113)

原样ID候选。

```text
export function sessionDirectoryNames(sessionId) {
	const id = String(sessionId);
	const bare = id.startsWith("session-") ? id.slice("session-".length) : id;
	return [...new Set([id, bare, `session-${bare}`])];
```

**依据 3 · 源码核查**：[lib/paths.js:138-150](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L138-L150)

join/stat/选择缺真实路径围栏。

<details>
<summary>查看原文（13行）</summary>

```text
	for (const project of projects) {
		for (const name of names) {
			const dir = join(root, project, name);
			let stats;
			try {
				stats = statSync(dir);
			} catch {
				continue;
			}
			if (!stats.isDirectory()) continue;
			const logs = listSessionLogs(dir);
			if (logs.length > 0) return { dir, project, logs };
			emptyMatch ??= { dir, project, logs: [] };
```

</details>

**依据 4 · 源码核查**：[lib/trust.js:67-80](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/trust.js#L67-L80)

请求头信任界限。

<details>
<summary>查看原文（14行）</summary>

```text
export function isTrustedRequest(request, trustedHosts) {
	const host = headerOf(request?.headers, "host");
	if (host === undefined) return false;
	const hostname = authorityHostname(host);
	if (hostname === null) return false;
	if (!isLoopbackHostname(hostname) && !isTrustedAuthority(host, trustedHosts)) return false;
	if (headerOf(request?.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = headerOf(request?.headers, "origin");
	if (origin === undefined) return true;
	try {
		return new URL(origin).hostname.toLowerCase() === hostname;
	} catch {
		return false;
	}
```

</details>

**依据 5 · 源码核查**：[lib/handoff.js:92-109](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L92-L109)

MD预算和截断标记。

<details>
<summary>查看原文（18行）</summary>

```text
export function renderEntries(entries, maxChars) {
	const kept = [];
	let used = 0;
	let truncated = false;
	for (let index = entries.length - 1; index >= 0; index -= 1) {
		const entry = entries[index];
		const text = entry.text.length > MESSAGE_CHARS ? `${entry.text.slice(0, MESSAGE_CHARS)}\n…（本条已截断）` : entry.text;
		const size = text.length + HEADING[entry.role].length + 4;
		if (kept.length > 0 && used + size > maxChars) {
			truncated = true;
			break;
		}
		kept.push({ ...entry, text });
		used += size;
	}
	kept.reverse();
	const body = kept.map((entry) => `${HEADING[entry.role]}\n\n${entry.text}`).join("\n\n");
	return { body, kept: kept.length, truncated };
```

</details>

**依据 6 · 源码核查**：[lib/handoff.js:146-165](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L146-L165)

JSONL从头保留。

<details>
<summary>查看原文（20行）</summary>

```text
export function renderJsonl(info, records, maxChars) {
	const header = {
		type: "session/handoff",
		sessionId: info.sessionId,
		title: info.title,
		cwd: info.cwd,
		logPath: info.logPath,
		exportedAt: new Date().toISOString(),
	};
	const lines = [JSON.stringify(header)];
	let used = lines[0].length;
	let kept = 0;
	for (const record of records) {
		const line = JSON.stringify(record);
		if (used + line.length > maxChars) break;
		lines.push(line);
		used += line.length + 1;
		kept += 1;
	}
	return { text: `${lines.join("\n")}\n`, kept, truncated: kept < records.length };
```

</details>

**依据 7 · 源码核查**：[lib/tools.js:104-106](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/tools.js#L104-L106)

最新部分声明。

```text
				maxChars: {
					type: "integer",
					description: "Character budget for the written file; the most recent part of the session is kept. Defaults to the plugin setting (200000).",
```

**依据 8 · 源码核查**：[lib/zstd.js:189-200](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L189-L200)

解压异常转null。

<details>
<summary>查看原文（12行）</summary>

```text
function inflateFrame(data, frame) {
	try {
		return inflate(data.subarray(frame.start, frame.end));
	} catch {
		return null;
	}
}

/** Decode one complete Zstandard frame (absent on exotic runtimes). */
function inflate(bytes) {
	if (typeof zlib.zstdDecompressSync !== "function") throw new Error("zstd is unavailable on this runtime");
	return zlib.zstdDecompressSync(bytes).toString("utf8");
```

</details>

**依据 9 · 源码核查**：[lib/handoff.js:215-218](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L215-L218)

固定文件名直接覆盖。

```text
	const safeId = info.sessionId.replace(/[^A-Za-z0-9._-]/g, "_");
	const file = join(directory, `${safeId}.${format === "jsonl" ? "jsonl" : "md"}`);
	await writeFile(file, text, "utf8");
	return { file, chars: text.length, kept, truncated, format };
```

#### 缺口

- 宿主外层认证、工具调用授权与真实部署可达性未在本组件确定。
  **影响：**不能把插件请求头检查当身份/会话访问权限。
  **进一步探讨：**可先固定宿主路由和tools授权实现，结合真实路径限定检查，而非仅靠浏览器限制。
- 导出缺少源hash、读取范围及损坏/裁剪完整性收据。
  **影响：**接续者可能把前缀/子集当完整上下文。
  **进一步探讨：**可从JSONL最新尾部语义、MD单条裁剪标志与缺API显式错误入手，分别研究保真。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、明文授权与使用流程有哪些要求？

**研究主题：**依赖、兼容与流程

#### 完整回答

包0.1.2声明Node>=22及DSH rc.2相关peer，实际压缩路径调用zlib.zstdDecompressSync并探测函数是否存在，不能把宽泛Node主版本声明当所有压缩日志均能解码。Host注入tools/systemPrompt/webServer；Web要求slots/UI依赖。enabledfalse停止注册，promptEnabled仅关闭指引。配置handoffDir和maxChars没有隔离含义，原生fs按进程权限读写。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt/webServer契约 | Host必需 | 注册工具、指引与定位路由 | 服务/版本不匹配影响加载 |
| Node原生Zstd解压API | 压缩日志必需 | 每帧解压 | API缺失返回空前缀而非明确兼容错误 |
| DSH_HOME及日志读取权限 | 必需 | 查项目/会话目录 | 找不到或解码失败不代表空会话 |
| Web slots/clipboard | 界面可选 | 复制路径或接续块 | 有clipboard拒绝反馈和旧接口fallback |
| handoffDir写权限与明文保存授权 | 导出必需 | 写MD/JSONL | 不应把原生fs写出当沙箱存储 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包/Node及无敏感日志，明确读取范围 | 先核会话ID/真实路径和输出目录权限 |
| 定位 | 用户复制或模型显式session_path | 路径属于预期会话和真实根目录 |
| 交接 | 审核后session_handoff并读取输出 | 核格式保留范围、截断和来源，不直接执行历史指令 |
| 恢复 | 保留原日志，对照导出及目录清理 | 写出未知时核文件，避免同名覆盖与盲重试 |

导出的会话文本会在本地形成额外明文副本，用户再让模型读取时按其provider外发；插件自身未调用模型来摘要，也未自动发送给别的会话。保留权限、清理期限和历史指令可信度仍需由读者明确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/package.json#L1-L4)

包版本。

```text
{
  "name": "dsh-session-path",
  "version": "0.1.2",
  "description": "DeepSeek Harness plugin: copy a session's log path (and an agent-readable handoff) so another session can read it and continue the work.",
```

**依据 2 · 源码核查**：[package.json:47-56](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/package.json#L47-L56)

Node/peer声明。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "test": "node test/selftest.mjs"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-system-prompt": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "^0.2.0-rc.2"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:24-48](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/index.js#L24-L48)

加载/开关。

<details>
<summary>查看原文（25行）</summary>

```text
export const inject = ["tools", "systemPrompt", "webServer"];

export { Config };

/**
 * Mount the plugin.
 *
 * @param ctx - host plugin context.
 * @param config - loader config (defaults are re-resolved here).
 */
export function apply(ctx, config) {
	const settings = resolveConfig(config);
	if (!settings.enabled) return;

	if (settings.promptEnabled) {
		ctx.systemPrompt.section({
			name: "session-path:guide",
			order: settings.promptOrder,
			text: () => guideText(settings),
		});
	}

	ctx.effect(() => registerResolveRoute(ctx, settings), "dsh-session-path: resolve route");

	for (const spec of createToolSpecs({ ctx, settings })) {
```

</details>

**依据 4 · 源码核查**：[lib/config.js:76-86](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/config.js#L76-L86)

配置解析。

<details>
<summary>查看原文（11行）</summary>

```text
export function resolveConfig(raw) {
	const config = raw === null || typeof raw !== "object" ? {} : raw;
	return {
		enabled: config.enabled !== false,
		copyFormat: pick(config.copyFormat, ["block", "path"], DEFAULTS.copyFormat),
		handoffFormat: pick(config.handoffFormat, ["md", "jsonl"], DEFAULTS.handoffFormat),
		handoffDir: typeof config.handoffDir === "string" ? config.handoffDir.trim() : "",
		maxHandoffChars: positiveInteger(config.maxHandoffChars, DEFAULTS.maxHandoffChars),
		titleScanBytes: positiveInteger(config.titleScanBytes, DEFAULTS.titleScanBytes),
		promptEnabled: config.promptEnabled !== false,
		promptOrder: Number.isSafeInteger(Number(config.promptOrder)) ? Number(config.promptOrder) : DEFAULTS.promptOrder,
```

</details>

**依据 5 · 源码核查**：[lib/zstd.js:197-200](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L197-L200)

原生API要求。

```text
/** Decode one complete Zstandard frame (absent on exotic runtimes). */
function inflate(bytes) {
	if (typeof zlib.zstdDecompressSync !== "function") throw new Error("zstd is unavailable on this runtime");
	return zlib.zstdDecompressSync(bytes).toString("utf8");
```

**依据 6 · 源码核查**：[lib/handoff.js:175-176](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L175-L176)

输出目录。

```text
export function handoffDirectory(ctx, settings) {
	return settings.handoffDir !== "" ? settings.handoffDir : join(dshHome(ctx), "session-handoff");
```

**依据 7 · 源码核查**：[lib/client.js:69-90](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/client.js#L69-L90)

clipboard fallback。

<details>
<summary>查看原文（22行）</summary>

```text
		async function writeClipboard(text) {
			try {
				if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(text);
					return true;
				}
			} catch {
				/* fall through to the legacy path */
			}
			const area = document.createElement("textarea");
			area.value = text;
			area.setAttribute("readonly", "");
			area.style.cssText = "position:fixed;top:-1000px;left:-1000px;opacity:0";
			document.body.appendChild(area);
			try {
				area.select();
				return document.execCommand("copy") === true;
			} catch {
				return false;
			} finally {
				area.remove();
			}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本和效果如何界定？

**研究主题：**效果与总成本

#### 完整回答

定位有工作区快路径但仍先读取sessions根、可枚举全部项目；标题扫描设置压缩字节预算，读取按1MiB块后判断，可超过精确预算。真正导出无maxBytes传入，先把全部记录/条目累积进数组再裁剪，字符上限不限制全量解压CPU、峰值内存、敏感读取范围或模型后续tokens。逐帧解析减小工作缓冲不意味着导出全流程常量内存。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/兼容运行时与本地磁盘，金额未知 | 核日志结构、读取权限和输出目录 | 引入明文副本及版本维护 |
| 持续使用 | 扫目录、解压及全量累积，模型读取另算tokens | 审查接续保真及敏感信息 | maxChars不限制源读取/总内存 |
| 失败恢复 | 重读/重导出及旧文件比对 | 区分部分日志、解压不可用、写出失败 | 同名原生writeFile无原子版本收据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少找日志接线 | 双GUI入口、两工具、日志代际排序 | 实际省时及任务接续正确率 |
| 读取压缩日志 | 多帧扫描与逐帧解压 | 损坏/缺API前缀的完整性可识别性 |
| 交接保真 | 来源头/MD角色区分 | MD裁剪及JSONL前缀是否保留关键最新决定 |

MD倾向最近条目，JSONL保留前缀，效果对照需分别检查是否包含最新决定/未完成任务/失败信息。无法仅以输出可读或体积更小推断更省上下文、更准确接续。

#### 证据与依据

**依据 1 · 源码核查**：[lib/paths.js:124-136](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L124-L136)

快路径仍枚举root。

<details>
<summary>查看原文（13行）</summary>

```text
export function findSessionDirectory(root, sessionId, cwd) {
	const names = sessionDirectoryNames(sessionId);
	const projects = [];
	if (typeof cwd === "string" && cwd.length > 0) projects.push(projectDirectoryName(cwd));
	let candidates = [];
	try {
		candidates = readdirSync(root);
	} catch {
		return null;
	}
	for (const project of candidates) {
		if (!projects.includes(project)) projects.push(project);
	}
```

</details>

**依据 2 · 源码核查**：[lib/zstd.js:135-171](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L135-L171)

读取块与预算检查。

<details>
<summary>查看原文（37行）</summary>

```text
export async function* readSessionRecords(file, options = {}) {
	const maxBytes = Number(options.maxBytes) > 0 ? Number(options.maxBytes) : Infinity;
	const onFrame = typeof options.onFrame === "function" ? options.onFrame : null;
	const handle = await open(file, "r");
	try {
		const compressed = file.endsWith(".zstd");
		let pending = "";
		let tail = Buffer.alloc(0);
		let read = 0;
		for (;;) {
			const chunk = await handle.read(Buffer.allocUnsafe(READ_CHUNK_BYTES), 0, READ_CHUNK_BYTES, null);
			if (chunk.bytesRead === 0) break;
			read += chunk.bytesRead;
			const slice = chunk.buffer.subarray(0, chunk.bytesRead);
			const data = tail.length > 0 ? Buffer.concat([tail, slice]) : Buffer.from(slice);
			tail = Buffer.alloc(0);
			if (!compressed) {
				const out = [];
				pending = consumeText(data.toString("utf8"), pending, out);
				if (out.length > 0) yield* out;
			} else {
				const frames = scanZstdFrames(data);
				for (const frame of frames) {
					const plain = inflateFrame(data, frame);
					if (plain === null) return;
					onFrame?.(frame.end - frame.start);
					const out = [];
					pending = consumeText(plain, pending, out);
					if (out.length > 0) yield* out;
				}
				const consumed = frames.length > 0 ? frames[frames.length - 1].end : 0;
				tail = Buffer.from(data.subarray(consumed));
				// A full chunk that still yields no frame means the container is
				// damaged; stop rather than buffer the rest of the file forever.
				if (frames.length === 0 && tail.length >= READ_CHUNK_BYTES * 2) return;
			}
			if (read >= maxBytes) break;
```

</details>

**依据 3 · 源码核查**：[lib/handoff.js:197-210](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L197-L210)

全量积累后裁剪。

<details>
<summary>查看原文（14行）</summary>

```text
	if (format === "jsonl") {
		const records = [];
		for await (const record of readSessionRecords(info.logPath)) records.push(record);
		const rendered = renderJsonl(info, records, maxChars);
		text = rendered.text;
		kept = rendered.kept;
		truncated = rendered.truncated;
	} else {
		const entries = [];
		for await (const record of readSessionRecords(info.logPath)) {
			const entry = toEntry(record);
			if (entry !== null) entries.push(entry);
		}
		const rendered = renderMarkdown(info, entries, maxChars);
```

</details>

**依据 4 · 源码核查**：[lib/handoff.js:146-165](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L146-L165)

JSONL前缀。

<details>
<summary>查看原文（20行）</summary>

```text
export function renderJsonl(info, records, maxChars) {
	const header = {
		type: "session/handoff",
		sessionId: info.sessionId,
		title: info.title,
		cwd: info.cwd,
		logPath: info.logPath,
		exportedAt: new Date().toISOString(),
	};
	const lines = [JSON.stringify(header)];
	let used = lines[0].length;
	let kept = 0;
	for (const record of records) {
		const line = JSON.stringify(record);
		if (used + line.length > maxChars) break;
		lines.push(line);
		used += line.length + 1;
		kept += 1;
	}
	return { text: `${lines.join("\n")}\n`, kept, truncated: kept < records.length };
```

</details>

#### 缺口

- 没有不同日志尺寸下峰值内存/解压延迟及接续任务准确率对照。
  **影响：**不能承诺低资源或提高接续成功率。
  **进一步探讨：**可用无敏感固定日志测MD/JSONL各自最新信息召回、遗漏与总资源，并对比手动定位/读取。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用点及可核交接假设如何研究？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用点包括纯定位/解析/渲染分层、数值代际排序、旧新目录命名兼容、多帧结构扫描、finally关闭文件、UI复制拒绝反馈，以及将上下文注入区分于用户消息。损坏时保留前缀有可用性价值，但静默部分成功和缺来源收据会影响可信度，不能只列成容错亮点。

可进一步探讨未验证的“可核交接收据”。先约束ID单路径组件并对真实日志路径做授权根围栏，再把源commit式内容hash/大小、读取代际/字节范围、丢弃和裁剪原因、保留顺序及输出hash写入收据；以临时文件原子写和唯一版本名避免覆盖。若输出预算应限制资源，可流式保留尾部并限制解压总字节，超限明确失败/部分。代价是额外读hash、日志并发追加的快照一致性、格式适配和收据隐私。可用父级ID、符号链接、同名并发、损坏/缺API、最新决定在尾部、单条超预算等夹具研究；若仍能把前缀当完整或目录越界，应先修契约而非加摘要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/paths.js:60-87](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L60-L87)

代际选择复用。

<details>
<summary>查看原文（28行）</summary>

```text
export function logGeneration(name) {
	const match = LOG_FILE.exec(name);
	if (match === null) return null;
	const version = Number(match[1] ?? 0);
	return Number.isSafeInteger(version) ? { version, compressed: Boolean(match[2]) } : null;
}

/**
 * Committed logs of one session directory, newest generation first.
 *
 * Numeric generations order numerically (`v10` beats `v3`), and a compressed
 * artifact wins over a plain one of the same generation.
 *
 * @param directory - session directory.
 * @returns absolute log paths, best candidate first.
 */
export function listSessionLogs(directory) {
	let names;
	try {
		names = readdirSync(directory);
	} catch {
		return [];
	}
	return names
		.map((name) => ({ name, generation: logGeneration(name) }))
		.filter((entry) => entry.generation !== null)
		.sort((a, b) => b.generation.version - a.generation.version || Number(b.generation.compressed) - Number(a.generation.compressed))
		.map((entry) => join(directory, entry.name));
```

</details>

**依据 2 · 源码核查**：[lib/zstd.js:41-82](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L41-L82)

帧结构扫描。

<details>
<summary>查看原文（42行）</summary>

```text
export function scanZstdFrames(buffer) {
	const frames = [];
	let offset = 0;
	while (offset < buffer.length) {
		const start = offset;
		if (buffer.length - offset < 4) return frames;
		if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) return frames;
		offset += 4;
		if (offset === buffer.length) return frames;
		const descriptor = buffer.readUInt8(offset);
		offset += 1;
		if ((descriptor & 24) !== 0) return frames; // reserved bits: structurally invalid
		const contentSizeFlag = descriptor >>> 6;
		const singleSegment = (descriptor & 32) !== 0;
		const checksum = (descriptor & 4) !== 0;
		const dictionaryFlag = descriptor & 3;
		const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
		const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : 1 << contentSizeFlag;
		const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
		if (buffer.length - offset < remainingHeaderBytes) return frames;
		offset += remainingHeaderBytes;
		for (;;) {
			if (buffer.length - offset < 3) return frames;
			const blockHeader = buffer.readUIntLE(offset, 3);
			offset += 3;
			const lastBlock = (blockHeader & 1) !== 0;
			const blockType = (blockHeader >>> 1) & 3;
			const blockSize = blockHeader >>> 3;
			if (blockType === 3) return frames; // reserved block type
			// An RLE block stores one byte regardless of its decompressed size.
			const payloadBytes = blockType === 1 ? 1 : blockSize;
			if (buffer.length - offset < payloadBytes) return frames;
			offset += payloadBytes;
			if (lastBlock) break;
		}
		if (checksum) {
			if (buffer.length - offset < 4) return frames;
			offset += 4;
		}
		frames.push({ start, end: offset });
	}
	return frames;
```

</details>

**依据 3 · 源码核查**：[lib/zstd.js:177-179](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L177-L179)

句柄关闭。

```text
	} finally {
		await handle.close();
	}
```

**依据 4 · 源码核查**：[lib/handoff.js:92-109](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L92-L109)

裁剪起点。

<details>
<summary>查看原文（18行）</summary>

```text
export function renderEntries(entries, maxChars) {
	const kept = [];
	let used = 0;
	let truncated = false;
	for (let index = entries.length - 1; index >= 0; index -= 1) {
		const entry = entries[index];
		const text = entry.text.length > MESSAGE_CHARS ? `${entry.text.slice(0, MESSAGE_CHARS)}\n…（本条已截断）` : entry.text;
		const size = text.length + HEADING[entry.role].length + 4;
		if (kept.length > 0 && used + size > maxChars) {
			truncated = true;
			break;
		}
		kept.push({ ...entry, text });
		used += size;
	}
	kept.reverse();
	const body = kept.map((entry) => `${HEADING[entry.role]}\n\n${entry.text}`).join("\n\n");
	return { body, kept: kept.length, truncated };
```

</details>

**依据 5 · 源码核查**：[lib/handoff.js:215-218](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L215-L218)

原子版本假设起点。

```text
	const safeId = info.sessionId.replace(/[^A-Za-z0-9._-]/g, "_");
	const file = join(directory, `${safeId}.${format === "jsonl" ? "jsonl" : "md"}`);
	await writeFile(file, text, "utf8");
	return { file, chars: text.length, kept, truncated, format };
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前推荐结论、继续探讨和停止条件是什么？

**研究主题：**采用判断

#### 完整回答

推荐observe。对正确会话日志定位和压缩解码的接线价值明确，但未经限定的ID/真实路径、明文同名覆盖和JSONL前缀语义使通用跨会话接续保证不足。可继续从纯受控日志的真实路径围栏、明确读取授权和完整性收据入手，随后比较MD/JSONL最新决定保留率及接续任务效果。

读者若单独核查，应使用无敏感副本、确认目标日志和输出目录，不把历史工具/用户内容直接执行。出现根外路径、读取非目标会话、截断标识与实际不符、最新决定缺失、解压不可用仍成功或导出覆盖不可追溯时，应停止采用该交接结果，保留源日志再核对。没有证据支持值得安装层级，也不以未做宿主冒烟充作缺陷。

#### 证据与依据

**依据 1 · 源码核查**：[lib/paths.js:138-150](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/paths.js#L138-L150)

路径条件。

<details>
<summary>查看原文（13行）</summary>

```text
	for (const project of projects) {
		for (const name of names) {
			const dir = join(root, project, name);
			let stats;
			try {
				stats = statSync(dir);
			} catch {
				continue;
			}
			if (!stats.isDirectory()) continue;
			const logs = listSessionLogs(dir);
			if (logs.length > 0) return { dir, project, logs };
			emptyMatch ??= { dir, project, logs: [] };
```

</details>

**依据 2 · 源码核查**：[lib/handoff.js:146-165](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L146-L165)

前缀和预算。

<details>
<summary>查看原文（20行）</summary>

```text
export function renderJsonl(info, records, maxChars) {
	const header = {
		type: "session/handoff",
		sessionId: info.sessionId,
		title: info.title,
		cwd: info.cwd,
		logPath: info.logPath,
		exportedAt: new Date().toISOString(),
	};
	const lines = [JSON.stringify(header)];
	let used = lines[0].length;
	let kept = 0;
	for (const record of records) {
		const line = JSON.stringify(record);
		if (used + line.length > maxChars) break;
		lines.push(line);
		used += line.length + 1;
		kept += 1;
	}
	return { text: `${lines.join("\n")}\n`, kept, truncated: kept < records.length };
```

</details>

**依据 3 · 源码核查**：[lib/zstd.js:189-200](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/zstd.js#L189-L200)

解压可静默停止。

<details>
<summary>查看原文（12行）</summary>

```text
function inflateFrame(data, frame) {
	try {
		return inflate(data.subarray(frame.start, frame.end));
	} catch {
		return null;
	}
}

/** Decode one complete Zstandard frame (absent on exotic runtimes). */
function inflate(bytes) {
	if (typeof zlib.zstdDecompressSync !== "function") throw new Error("zstd is unavailable on this runtime");
	return zlib.zstdDecompressSync(bytes).toString("utf8");
```

</details>

**依据 4 · 源码核查**：[lib/handoff.js:215-218](https://github.com/439436269-ctrl/dsh-session-path/blob/9ffc7b3f1bfdeb67a7614ff23463c6844b47e607/lib/handoff.js#L215-L218)

覆盖边界。

```text
	const safeId = info.sessionId.replace(/[^A-Za-z0-9._-]/g, "_");
	const file = join(directory, `${safeId}.${format === "jsonl" ? "jsonl" : "md"}`);
	await writeFile(file, text, "utf8");
	return { file, chars: text.length, kept, truncated, format };
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
