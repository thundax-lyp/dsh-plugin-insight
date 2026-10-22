# dsh-obsidian-board

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[072612e](https://github.com/2026heshao/dsh-obsidian-board/tree/072612e0245565cee12cbfd07a421f2029d35c4e)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)
<!-- END META -->

> **实现功能**：在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。

> **核心亮点**：把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](#research-q01)。

> **风险与缺陷**：索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 本地笔记问答的实际目标是什么？](#detail-section-11)
  - [Q02 · 检索和规划的机制是什么？](#detail-section-12)
  - [Q03 · 索引、读源和保存的路径保护一致吗？](#detail-section-13)
  - [Q04 · 停止、回退和历史隔离有哪些边界？](#detail-section-14)
  - [Q05 · 工程证据与三阶段成本如何评价？](#detail-section-15)
  - [Q06 · 如何采用及继续探讨？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人笔记库问答、找原文并回存知识。详见[Q01](#research-q01)。

原Obsidian搜索复制到聊天，集中RAG便利不等已证召回可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地BM25 | 搜个人笔记 | 索引仍可读链接 |
| 模型问答 | 生成/规划 | 远程与回退政策 |
| 点源/回存 | 查证与积累 | 读源不同限额/保存竞争 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 宿主typert/llm/loader | RPC与模型 | ABI与准入 |
| Markdown vault | 索引/读源 | 链接/大小约束不一致 |
| 授权模型通道 | 生成与规划 | 内容离机/回退费用 |
| 可写AI回答目录 | 保存 | 并发/外链需核 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 选可信非敏感库 | 用户 | 外链与大小可控 |
| 核允许模型 | 用户 | 包括回退接收者 |
| 对照提问读源 | 用户 | 不把未召回当不存在 |
| 保存核文件 | 用户 | 独立备份/YAML正确 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | vault全读/内存索引 | 查链接、体积、模型政策 | 整库读取/索引依规模；隐私和模型路线核查工时未知 |
| 持续使用 | 元数据扫描+模型/规划/回退 | 审阅召回和规划结果，处理漏项与冲突 | 规划/回退增加模型调用；费用与召回效果未量化 |
| 失败恢复 | 原库备份/partial/历史 | 核保存、重建与实际上游停止 | 要分保存、partial与上游真正停止；恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 无embedding检索 | BM25+CJK | 语义漏召回/限额 |
| 可点来源 | 引用与readNote | 引用不证明忠实 |
| 可停/回退 | abortrace/attempt | 上游取消和数据接收方 |

> **思考**：索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](#research-q01)。

把搜索、来源阅读、流式问答与保存放进同页闭环。详见[Q01](#research-q01)。

attempt隔离、思考分流与统一契约有价值，源码正则测试不能代替阻塞资源行为。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

索引直接读可含外链md而读源另有realpath，自动回退可能更换资料接收者，同名保存非独占。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，非敏感可信个人库和限定模型通道对照。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地检索与attempt恢复设计可查，索引路径/大小、自动回退和写入/历史隔离边界限制采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/vault.js、lib/typert.js、lib/client.js、test/stop-cycle.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定VaultIndex扫描/构建/读源、gateway检索规划/上下文/流式/历史/保存、typert契约和停止源码测试；不穷尽客户端渲染。
- 下一步：进一步从外链/大文件、双vault、阻塞planner/return和双同名保存探讨统一边界。

**分析版本**

- **仓库**：[2026heshao/dsh-obsidian-board](https://github.com/2026heshao/dsh-obsidian-board)
- **版本号**：0.2.4（[固定提交 072612e](https://github.com/2026heshao/dsh-obsidian-board/tree/072612e0245565cee12cbfd07a421f2029d35c4e)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究统一索引/读源物理限额、取消预算与provider白名单、独占保存和历史CAS，比较召回/停止/恢复。当前未验证。详见[Q06](#research-q06)。

进一步从外链/大文件、双vault、阻塞planner/return和双同名保存探讨统一边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 1699 | — | — | 24131 |
| .mjs | source | 25 | 1519 | 1196 | 151 | — |
| .js | source | 4 | 4593 | 3590 | 880 | — |
| .mjs | test | 22 | 1782 | 1355 | 233 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board/issues?q=is%3Aissue+created%3A2026-09-22T06%3A19%3A18.896Z..2026-10-22T06%3A19%3A18.896Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A19%3A18.896Z..2026-10-22T06%3A19%3A18.896Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**本地BM25问答如何处理笔记/模型/流式与保存，哪些边界限制可信采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地笔记问答的实际目标是什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

在DSH专用三栏页面浏览Obsidian库、提问并点引用看笔记原文，回答可存成AI回答笔记。检索不需embedding服务，BM25和CJK bigram在宿主本地算，回答复用宿主模型通道。相较手工搜库复制到聊天，主要贡献是搜索、来源阅读、流式对话和保存形成同页闭环；不是Obsidian插件或新检索算法。

README“no data leaves your machine”只能收窄到本地索引/检索计算，问句、历史和命中正文明确进入llm.stream，对远程模型就会离机。引用代表被检索的来源，不自动证明模型每个主张被支持。成功需相关笔记真能召回、回答忠实且引用定位可靠，不能由界面可点或自带演示得出准确率结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-18](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/README.md#L5-L18)

作者RAG与本地主张。

<details>
<summary>查看原文（14行）</summary>

```text
A [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) plugin that turns your local **Obsidian vault** into a **dedicated RAG chat panel** inside the DSH GUI — a sidebar entry leading to a full three-pane page: note browser on the left, retrieval-augmented chat in the middle, cited note source on the right. The desktop app and the Web GUI ship the same browser-rendered client, so the panel behaves identically in both. All retrieval and indexing run **100% locally** (BM25 + CJK bigram); answers go through the model channel you already configured in DSH.

> **Not an MCP integration, not an Obsidian plugin** — this is a dual-half DSH plugin (host + browser client). The UI is injected into the DSH main window as a `main` slot page (same mechanism as switching conversations); model calls reuse the host `ctx.llm`; the knowledge base points at your local vault directory (Obsidian doesn't even need to be running).

> **Compatibility**: fully tested on DeepSeek Harness 44.7.0 (host ships `@deepseek-ai/dsh-typert-protocol@0.2.1-rc.2` / cordis 4.0.5); the declared peer range `>=0.1.5-rc.1` still covers it — no code changes needed in v0.2.3.

## Features

- 🔍 **Local-first retrieval** — BM25 with CJK bigram tokenization, title/path boosting, Obsidian tag & alias awareness. No embedding model, no network, no data leaves your machine.
- 🎯 **Finds what you actually wrote** — your own notes outrank collected third-party material (public skill libraries are down-weighted), long identifiers such as `github_pat_…` are matched literally, and meaningful hidden folders (e.g. `.workbuddy/`) are indexed instead of silently skipped.
- 🛑 **Stop that actually stops** — the stop button takes effect at any stage, including the retrieval/planning phase and the model's silent period before its first token. Stopped replies are shown as a neutral "stopped" state, not a red error.
- 🧵 **Output that never garbles or hangs** — the stream pipeline is keyed per attempt, so switching provider fallbacks can't splice two answers together or silently swallow a reply; each answer shows the model that actually produced it. Replies left mid-stream by a panel refresh are marked "interrupted" with a retry button instead of spinning forever.
- 📖 **Clickable citations** — every `[n]` in the answer and the citation chips below it open the exact note in the right-hand source pane.
- 📊 **Rich Markdown answers** — tables, headings, links, italics and task lists render in answers and the source pane, sandboxed (no executable links).
```

</details>

**依据 2 · 源码核查**：[lib/index.js:161-214](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L161-L214)

正文历史构造模型上下文。

<details>
<summary>查看原文（54行）</summary>

```text
function buildMessages({ system, context, history, question, historyLimit = 24, route }) {
	const messages = [];
	const modelSource = () => ({ kind: "model", provider: String(route?.provider || ""), model: String(route?.model || "") });
	messages.push({
		id: randomUUID(),
		role: "system",
		content: [{ type: "text", text: system + (context ? "\n\n<context>\n" + context + "\n</context>" : "") }],
		source: { kind: "system-prompt" },
	});
	// 面板会话历史（截断到最近 N 条，防止上下文膨胀）
	const limit = Math.max(2, Math.min(60, Number(historyLimit) || 24));
	const tail = history.slice(-limit);
	// OPT-2.9 历史预算：多轮追问（「再详细说说第 2 点」）时，指代对象常落在前一轮长回答的后半段，
	// 一刀切 4000 字会把它腰斩成「上一轮没说过」。给最近 2 条 assistant 消息 8000 字，更早的仍 4000 字。
	const RECENT_BUDGET = 8000;
	const OLD_BUDGET = 4000;
	const assistantCount = tail.filter((m) => m && m.role === "assistant" && typeof m.content === "string" && m.content.trim()).length;
	let assistantSeen = 0;
	for (const m of tail) {
		if (!m || typeof m.content !== "string" || !m.content.trim()) continue;
		const isAssistant = m.role === "assistant";
		let budget = OLD_BUDGET;
		if (isAssistant) {
			assistantSeen += 1;
			if (assistantCount - assistantSeen < 2) budget = RECENT_BUDGET;
		}
		messages.push({
			id: randomUUID(),
			role: isAssistant ? "assistant" : "user",
			content: [{ type: "text", text: m.content.slice(0, budget) }],
			source: isAssistant ? modelSource() : { kind: "user" },
		});
	}
	messages.push({ id: randomUUID(), role: "user", content: [{ type: "text", text: question }], source: { kind: "user" } });
	return messages;
}

function contextBlock(hits, chunkLimit) {
	if (!hits.length) return "";
	const isIndexLike = (title, text) => {
		const t = (title || "").toLowerCase();
		if (/目录|索引|moc|index|导航|sitemap/.test(t)) return true;
		const links = (text.match(/\[\[/g) || []).length + (text.match(/\.md/g) || []).length;
		return text.length > 0 && links / (text.length / 30) > 0.8;
	};
	return hits
		.map((hit, i) => {
			const body = hit.text.length > chunkLimit ? hit.text.slice(0, chunkLimit) + "…" : hit.text;
			const tag = isIndexLike(hit.noteTitle, hit.text)
				? "\n⚠️ 这是目录/索引类材料：它只说明库里**有哪些**笔记，不含具体内容。绝不依据它组织回答——只可用来了解知识库覆盖范围。"
				: "";
			return `[${i + 1}] 笔记「${hit.noteTitle}」${hit.heading ? " · " + hit.heading : ""}${tag}\n${body}`;
		})
		.join("\n\n---\n\n");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1177-1177](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1177-L1177)

buildMessages实际入口。

```text
		const messages = buildMessages({ system, context, history, question, historyLimit: this.config.historyLimit, route });
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索和规划的机制是什么？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

VaultIndex扫描Markdown、按标题切片与长段拆分，标题/面包屑参与词频，拉丁词和CJK二元词形成索引；BM25另加标题/别名/标签及目录惩罚、收集语料降权以优先自己的笔记。全文内存索引通过mtime增量更新，有界并发读文件和可选watch；mtime未变内容变化不会主动识别。复杂问题可多调用一次模型生成最多三条搜索query，融合原与扩展结果，简单问题可跳规划。

这是一组启发式排序，不是语义向量召回或有保证的个人笔记归属分类。planner失败静默退单路，extra为空时返回primary而其为2*topK，和简单分支slice(topK)不同，引用/上下文预算可能翻倍。typert gateway依赖llm/loader，zod+宿主typert protocol，浏览器RPC用direct descriptor；package未声明Node engines，需结合宿主API核对。模型/路径选择和保存配置依赖可选服务，不能从peer范围推出任意新版兼容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/vault.js:19-36](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L19-L36)

分词。

<details>
<summary>查看原文（18行）</summary>

```text
export function tokenize(text) {
	const tokens = [];
	const lowered = String(text).toLowerCase();
	// 拉丁/数字词
	for (const m of lowered.matchAll(/[a-z0-9_][a-z0-9_'+.-]*/g)) {
		let w = m[0].replace(/^['+.-]+|['+.-]+$/g, "");
		if (w.length >= 2 && !/^\d+$/.test(w)) {
			if (w.length > 4 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
			tokens.push(w);
		}
	}
	// CJK bigram（单字也保留，权重低——用于单字专有名词）
	for (const m of lowered.matchAll(/[\u2E80-\u9FFF\uF900-\uFAFF]{1,}/g)) {
		const run = m[0];
		if (run.length === 1) { tokens.push(run); continue; }
		for (let i = 0; i < run.length - 1; i++) tokens.push(run.slice(i, i + 2));
	}
	return tokens;
```

</details>

**依据 2 · 源码核查**：[lib/vault.js:289-349](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L289-L349)

增量与并发。

<details>
<summary>查看原文（61行）</summary>

```text
	async ensureIndexed(vaultPath, { force = false } = {}) {
		if (this.scanning) return { queued: true };
		if (!force && this.builtAt && this.vaultPath === vaultPath) {
			// 轻量增量：只对 mtime 变化的笔记重建 chunk。
			return this._incremental(vaultPath);
		}
		this.scanning = true;
		try {
			if (force || this.vaultPath !== vaultPath) await this._full(vaultPath);
			else await this._incremental(vaultPath);
		} finally {
			this.scanning = false;
		}
		return { queued: false };
	}

	_scan(vaultPath) {
		return scanVault(vaultPath, {
			skipDirs: this.skipDirs,
			allowDotDirs: this.allowDotDirs,
			maxDepth: this.maxDepth,
		});
	}

	async _full(vaultPath) {
		this.vaultPath = vaultPath;
		this.chunks = [];
		this.byNote = new Map();
		this.df = new Map();
		const files = await this._scan(vaultPath);
		// OPT-1.7：有界并发读文件；提交严格按 files 顺序，chunk 顺序与串行实现逐字节一致。
		const built = await mapPool(files, this.readConcurrency, (file) => this._safeBuild(file, vaultPath));
		for (let i = 0; i < files.length; i++) if (built[i]) this._commitNote(built[i]);
		this._recomputeStats();
		this.builtAt = Date.now();
	}

	async _incremental(vaultPath) {
		const files = await this._scan(vaultPath);
		const seen = new Set();
		const mtimes = await mapPool(files, this.readConcurrency, async (file) => {
			try { return (await stat(file)).mtimeMs; } catch { return null; }
		});
		const dirty = [];
		for (let i = 0; i < files.length; i++) {
			seen.add(files[i]);
			if (mtimes[i] === null) continue;
			const rec = this.byNote.get(files[i]);
			if (!rec || rec.mtimeMs !== mtimes[i]) dirty.push(files[i]);
		}
		const built = await mapPool(dirty, this.readConcurrency, (file) => this._safeBuild(file, vaultPath));
		for (let i = 0; i < dirty.length; i++) {
			// 先标记旧 chunk 为孤儿再提交新 chunk：与基线的「drop+index 逐文件交替」等价
			// （孤儿只在 _recomputeStats 里压实，追加顺序不受影响）。
			this._dropNote(dirty[i]);
			if (built[i]) this._commitNote(built[i]);
		}
		let dirtyAny = dirty.length > 0;
		for (const path of [...this.byNote.keys()]) {
			if (!seen.has(path)) { this._dropNote(path); dirtyAny = true; }
		}
```

</details>

**依据 3 · 源码核查**：[lib/vault.js:354-374](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L354-L374)

切片计权。

<details>
<summary>查看原文（21行）</summary>

```text
	async _buildNote(file, vaultPath) {
		const raw = await readFile(file, "utf8");
		const { frontmatter, body } = parseFrontmatter(raw);
		const rel = relative(vaultPath, file).split(sep).join("/");
		const title = basename(file).replace(/\.(md|markdown)$/i, "");
		const mtimeMs = (await stat(file)).mtimeMs;
		const note = {
			path: rel,
			title,
			mtimeMs,
			aliases: extractAliases(frontmatter),
			tags: extractTags(frontmatter, body),
			chunkIdx: [],
		};
		const chunks = chunkNote({ path: rel, title, body }).map((chunk) => {
			// 标题面包屑重复进正文计权：标题词在检索里更重。
			const boost = note.title + "\n" + chunk.crumbs + "\n" + chunk.heading;
			const tokenList = tokenize(boost + "\n" + chunk.text);
			const tokens = new Map();
			for (const t of tokenList) tokens.set(t, (tokens.get(t) || 0) + 1);
			return { ...chunk, tokens, len: tokenList.length };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:784-845](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L784-L845)

多query与extra空分支。

<details>
<summary>查看原文（62行）</summary>

```text
	async _multiHits(question, llm, route) {
		const vaultPath = await this._vaultPath();
		await this.index.ensureIndexed(vaultPath);
		const topK = Math.max(1, Math.min(20, Number(this.config.topK) || 8));
		const primary = this.index.search(question, { topK: topK * 2 }).hits;

		// 简单问题不规划。注意：primary 取的是 2×topK（给融合留冗余），
		// 但返回给调用方的 citations 必须收敛到 topK——否则引用 chips 会翻倍。
		// OPT-Config 规划开关：plannerEnabled=false 时整跳短路（少一次 LLM 往返，首字更快）。
		if (this.config.plannerEnabled === false || !needsPlanning(question)) return primary.slice(0, topK);

		// 规划跳：非流式、短输出、失败静默（规划失败 = 退回单路）
		let extra = [];
		try {
			const planMessages = [
				{ role: "system", content: [{ type: "text", text: PLANNER_PROMPT }] },
				{ role: "user", content: [{ type: "text", text: question.slice(0, 500) }] },
			];
			const options = { messages: planMessages };
			if (route?.provider) options.provider = route.provider;
			if (route?.model) options.model = route.model;
			// OPT-2.4 规划跳比主生成便宜一档即可，别再额外砍到 low（见 PLAN_EFFORT_MAP 注释）。
			const planEffort = String(this.config.reasoningEffort ?? "high").trim();
			if (planEffort) options.reasoningEffort = PLAN_EFFORT_MAP[planEffort] || planEffort;
			let planText = "";
			// 规划跳必须有超时：某些路由/无路由下 llm.stream 永不 settle，会挂死整个请求。
			const planStream = (async () => {
				for await (const chunk of llm.stream(options)) {
					const failure = terminalFailure(chunk);
					if (failure) break;
					planText += visibleDelta(chunk);
				}
			})();
			await withTimeout(planStream, 20000, "检索规划");
			const queries = parseQueryList(planText).filter((q) => q !== question.trim());
			// 各路检索（串行即可：BM25 是内存毫秒级）
			const perQuery = [];
			for (const q of queries.slice(0, 3)) {
				const r = this.index.search(q, { topK });
				if (r.hits.length) perQuery.push(r.hits);
			}
			extra = perQuery;
		} catch { /* 规划失败退回单路 */ }

		if (!extra.length) return primary;

		// RRF 融合：score(chunk) = Σ 1/(RRF_K + rank_i)；同 chunk 以 notePath+heading 归并
		const fused = new Map();
		const lists = [primary, ...extra];
		for (const hits of lists) {
			hits.forEach((hit, rank) => {
				const key = hit.notePath + "::" + (hit.heading || "") + "::" + hit.text.slice(0, 60);
				const cur = fused.get(key) || { hit, rrf: 0, rankSum: 0, count: 0 };
				cur.rrf += 1 / (ObsidianBoardGateway.RRF_K + rank + 1);
				cur.rankSum += rank + 1;
				cur.count += 1;
				fused.set(key, cur);
			});
		}
		const merged = [...fused.values()]
			.sort((a, b) => b.count - a.count || b.rrf - a.rrf) // 多路共同命中优先，再按 RRF
			.map((v) => ({ ...v.hit, multiHit: v.count > 1, score: Math.round(v.rrf * 100) / 100 }));
```

</details>

**依据 5 · 源码核查**：[lib/index.js:405-432](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L405-L432)

Gateway依赖。

<details>
<summary>查看原文（28行）</summary>

```text
export class ObsidianBoardGateway extends TypertRemoteService {
	// 只写必然存在的服务。可选依赖一律在方法内用 ctx.get 探测——loader 不认 "?"
	// 后缀语法（实测 0.2.0-rc.2：带 ? 的条目会让注入解析失败 → 服务整体不激活）。
	// loader 是 cordis 核心服务（读 agent-default-model 的配置解析默认路由）。
	static inject = ["llm", "loader"];
	constructor(ctx, config) {
		super(ctx, "obsidianBoard");
		this.config = config || {};
		// OPT-1.4 GAP-1：I1 在 Config 里声明了 5 个扫描参数，vault.js 也把它们做成了
		// VaultIndex 构造选项，但这里历史上一律 new VaultIndex() 不传参 —— 用户配
		// scanMaxDepth / vendoredWeight / extra*Dirs 全是死字段，永远不生效。
		// 语义分两类：
		//   数值项（scanMaxDepth / vendoredWeight）—— 有值才传，非法值不传（让库用缺省）；
		//   追加项（extraVendoredDirs / extraSkipDirs / extraDotDirs）—— 基线 + 额外项。
		// 追加项在额外项为空时**完全不传**：保持「库自决缺省」这一条路径，避免宿主镜像的
		// 基线表跟库里的漂移时无声改变默认扫描范围。
		const indexOptions = {};
		const maxDepth = configNumberOrUndefined(this.config.scanMaxDepth);
		if (maxDepth !== undefined) indexOptions.maxDepth = maxDepth;
		const vendoredWeight = configNumberOrUndefined(this.config.vendoredWeight);
		if (vendoredWeight !== undefined) indexOptions.vendoredWeight = vendoredWeight;
		const extraVendored = configList(this.config.extraVendoredDirs);
		if (extraVendored.length) indexOptions.vendoredDirHints = [...BASELINE_VENDORED_DIR_HINTS, ...extraVendored];
		const extraSkip = configList(this.config.extraSkipDirs);
		if (extraSkip.length) indexOptions.skipDirs = [...BASELINE_SKIP_DIRS, ...extraSkip];
		const extraDot = configList(this.config.extraDotDirs);
		if (extraDot.length) indexOptions.allowDotDirs = [...BASELINE_ALLOW_DOT_DIRS, ...extraDot];
		this.index = new VaultIndex(indexOptions);
```

</details>

**依据 6 · 源码核查**：[lib/typert.js:5-43](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/typert.js#L5-L43)

RPC描述符。

<details>
<summary>查看原文（39行）</summary>

```text

// strict codec 的双键形状（schema + create 工厂）是 0.1.5-rc.x 与 0.1.6+ 同时兼容的
// 唯一形状，原理见 dsh-skill-mcp-board/lib/typert.js 的注释——两处同源。
const codec = (symbol, schema) => ({
	mode: 'strict',
	typeSymbol: `dsh-obsidian-board/typert#${symbol}`,
	schema,
	create: () => schema,
})

const mv = (method, params, resultSym) => ({
	id: `dsh-obsidian-board#obsidianBoard/${method}`,
	service: 'obsidianBoard',
	namespace: 'obsidianBoard',
	method,
	invocation: { kind: 'direct' },
	parameters: params,
	result: codec(resultSym, z.unknown()),
	sourceLocation: { file: 'dsh-obsidian-board/lib/typert.js', line: 7, column: 1 },
})

const $any = z.unknown()

// 所有方法统一「payload 进、结果出」信封，params 全部走单一 payload 参数（与
// mcp-board 的 payloadParam 同构），避免逐字段编解码的形状漂移。
const payloadParam = { name: 'payload', wire: 'payload', source: 'json', codec: codec('Payload', $any) }
const noParams = []

export const TYPERT = {
	package: 'dsh-obsidian-board',
	face: 'host',
	schemas: [],
	invocations: [
		mv('status', [], 'StatusResult'),
		mv('configure', [payloadParam], 'StatusResult'),
		mv('listNotes', [payloadParam], 'NotesResult'),
		mv('readNote', [payloadParam], 'NoteResult'),
		mv('search', [payloadParam], 'SearchResult'),
		mv('chat', [payloadParam], 'ChatResult'), // deprecated: 非流式管线已下线（OPT-2.6）
```

</details>

**依据 7 · 源码核查**：[package.json:29-34](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/package.json#L29-L34)

分发依赖。

```text
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.5-rc.1"
  },
  "dsh": {
    "bundle": {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 索引、读源和保存的路径保护一致吗？

**研究主题：**缺陷与关键质疑

#### 完整回答

readNote有扩展名/体积限制，realpath同时核vault和目标防外链读，是积极设计；但索引scanVault把非目录且扩展名匹配的项加入，符号链接文件也会进来，_buildNote直接readFile且无realpath/体积检查。结果可能把vault外链接Markdown或超大文件读进内存并用于模型上下文，即使之后点来源readNote会拒绝，两个入口不一致。maxNoteBytes只看读源路径不能当全库索引大小上限。起始目录和文件在检查后替换也没有稳定句柄身份保证。

saveNote清理标题、同名追加序号后普通writeFile，但access再写不是独占创建；并发保存同名可能覆盖，序号循环到上限仍写最终路径。AI回答目录没有realpath链接约束，预置链接可把写入落外部。refs YAML字符串未逃逸引号/换行等任意笔记名，列表键只出现一次不等任何名字都产生合法YAML。存笔记是明确写能力，不把整个插件叫只读。

#### 证据与依据

**依据 1 · 源码核查**：[lib/vault.js:191-205](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L191-L205)

非目录md加入。

<details>
<summary>查看原文（15行）</summary>

```text
	async function walk(dir, depth) {
		if (depth > maxDepth) return;
		let entries;
		try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
		for (const e of entries) {
			if (skipDirs.has(e.name)) continue;
			const isDot = e.name.startsWith(".") && e.name !== ".";
			if (isDot) {
				// 点目录：默认跳过；但白名单目录（.workbuddy）在开启时放行
				if (!includeDotDirs || !ALLOW_DOT_DIRS.has(e.name)) continue;
			}
			const full = join(dir, e.name);
			if (e.isDirectory()) await walk(full, depth + 1);
			else if (MD_EXT.has(e.name.slice(e.name.lastIndexOf(".")).toLowerCase())) files.push(full);
		}
```

</details>

**依据 2 · 源码核查**：[lib/vault.js:354-380](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L354-L380)

直接读索引与静默失败。

<details>
<summary>查看原文（27行）</summary>

```text
	async _buildNote(file, vaultPath) {
		const raw = await readFile(file, "utf8");
		const { frontmatter, body } = parseFrontmatter(raw);
		const rel = relative(vaultPath, file).split(sep).join("/");
		const title = basename(file).replace(/\.(md|markdown)$/i, "");
		const mtimeMs = (await stat(file)).mtimeMs;
		const note = {
			path: rel,
			title,
			mtimeMs,
			aliases: extractAliases(frontmatter),
			tags: extractTags(frontmatter, body),
			chunkIdx: [],
		};
		const chunks = chunkNote({ path: rel, title, body }).map((chunk) => {
			// 标题面包屑重复进正文计权：标题词在检索里更重。
			const boost = note.title + "\n" + chunk.crumbs + "\n" + chunk.heading;
			const tokenList = tokenize(boost + "\n" + chunk.text);
			const tokens = new Map();
			for (const t of tokenList) tokens.set(t, (tokens.get(t) || 0) + 1);
			return { ...chunk, tokens, len: tokenList.length };
		});
		return { file, note, chunks };
	}

	async _safeBuild(file, vaultPath) {
		try { return await this._buildNote(file, vaultPath); } catch { return null; /* 单文件失败不拖垮全量 */ }
```

</details>

**依据 3 · 源码核查**：[lib/vault.js:646-690](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L646-L690)

读源realpath与大小检查。

<details>
<summary>查看原文（45行）</summary>

```text
	async readNote(vaultPath, relPath) {
		const safe = String(relPath ?? "").split("/").join(sep);
		if (safe.includes("..")) throw new Error("路径不允许包含 ..");
		// 先归一化 vault 根（去掉尾部分隔符、相对路径转绝对），否则 `D:\vault\` 这种配置
		// 会让 `vaultPath + sep` 变成双分隔符，把合法笔记误判成越界。
		const rootAbs = resolve(String(vaultPath ?? ""));
		const full = join(rootAbs, safe);
		// 快筛 1：字符串层面必须仍在 vault 内（低成本，先挡畸形输入）
		if (!full.startsWith(rootAbs + sep) && full !== rootAbs) throw new Error("路径越出 vault 范围");
		const ext = full.slice(full.lastIndexOf(".")).toLowerCase();
		if (!MD_EXT.has(ext)) throw new Error(`只允许读取 Markdown 笔记（${[...MD_EXT].join(" / ")}），收到：${relPath}`);

		// 终判 1：vault 根自身必须可解析。用户把仓库位置配错时给可诊断错误，而不是原始 ENOENT。
		let realVault;
		try {
			realVault = await realpath(rootAbs);
		} catch (err) {
			const code = (err && err.code) || "UNKNOWN";
			throw new Error(`vault 路径不可用：${vaultPath}（${code}）——请检查配置的仓库位置是否存在且可读`);
		}

		// 终判 2：目标必须真实存在。不存在要报「笔记不存在」，绝不能把 ENOENT 吞成成功。
		let realTarget;
		try {
			realTarget = await realpath(full);
		} catch (err) {
			if (err && err.code === "ENOENT") throw new Error(`笔记不存在：${relPath}`);
			const code = (err && err.code) || "UNKNOWN";
			throw new Error(`无法解析笔记路径：${relPath}（${code}）`);
		}

		// 终判 3：归一化后的真实路径仍必须落在 vault 根内——这才是挡 junction / 符号链接逃逸的那道闸。
		if (realTarget !== realVault && !realTarget.startsWith(realVault + sep)) {
			throw new Error(`路径越出 vault 范围（真实路径解析后）：${relPath}`);
		}

		const info = await stat(realTarget);
		if (!info.isFile()) throw new Error(`不是普通文件：${relPath}`);
		if (info.size > this.maxNoteBytes) {
			throw new Error(`笔记过大：${info.size} 字节，超过上限 ${this.maxNoteBytes} 字节（可调整 VaultIndex 的 maxNoteBytes）`);
		}
		const raw = await readFile(realTarget, "utf8");
		return { path: relPath, content: raw, mtimeMs: Math.round(info.mtimeMs) };
	}

```

</details>

**依据 4 · 源码核查**：[lib/index.js:1409-1442](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1409-L1442)

保存路径、access写与YAML。

<details>
<summary>查看原文（34行）</summary>

```text
	async saveNote(payload) {
		await this._restorePersisted();
		const vaultPath = await this._vaultPath();
		const title = String(payload?.title || "").trim() || "知识库回答 " + new Date().toISOString().slice(0, 16).replace("T", " ");
		const content = String(payload?.content || "");
		if (!content.trim()) throw new Error("内容为空，没有可保存的回答");
		// 文件名消毒：Windows 非法字符 + 长度上限
		const safe = title.replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "知识库回答";
		const dir = join(vaultPath, "AI 回答");
		const { mkdir, writeFile, access } = await import("node:fs/promises");
		await mkdir(dir, { recursive: true });
		let path = join(dir, safe + ".md");
		// 同名追加序号
		for (let i = 2; i < 200; i++) {
			try { await access(path); path = join(dir, `${safe} ${i}.md`); } catch { break; }
		}
		const header = [
			"---",
			"tags: [ai-answer]",
			`created: ${new Date().toISOString()}`,
			`source: dsh-obsidian-board`,
		];
		// OPT-2.1 YAML 列表写法：每个文件只出现一次 refs: 键（重复 key 是非法 YAML，
		// Obsidian 会丢字段）；零引用时不写 refs 键。
		const cites = Array.isArray(payload?.citations) ? payload.citations : [];
		const refs = cites.filter((c) => c?.notePath).slice(0, 20).map((c) => `  - "[[${c.notePath.replace(/\.md$/i, "")}|${c.noteTitle || c.notePath}]]"`);
		if (refs.length) header.push("refs:", ...refs);
		header.push("---", "");
		const body = header.join("\n") + content.trim() + "\n";
		await writeFile(path, body, "utf8");
		// OPT-2.10 保存一条笔记后不再全量重建索引：万级笔记的库 force 一次要卡好几秒，
		// 而 ensureIndexed 的增量分支按 mtime 就能捡到刚写的这个文件。
		await this.index.ensureIndexed(vaultPath);
		return { saved: true, path: "AI 回答/" + path.split(/[\\/]/).pop(), title: path.split(/[\\/]/).pop().replace(/\.md$/i, "") };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 停止、回退和历史隔离有哪些边界？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

stream先注册状态，再以abortable包装检索，生成时race iterator.next和abort，attempt递增时清buffer避免回退重复拼接，是清楚的失败恢复设计。但检索/规划promise外层被中止不等内部文件扫描/规划stream被取消；planner options未带signal，20秒withTimeout只限制等待。总deadline在检索之后才启动，不能把配置timeout当整轮上限。runOne finally await iterator.return若适配器卡住，UI停止可见也不等上游资源已释放。

首路无正文时自动枚举其他provider/model继续发送同一上下文，没有逐候选同意；实际接收者/费用可能变化，fallback仅成功后提示且不改用户持久配置。笔记隐私政策应覆盖所有可回退通道。静态_streams为所有实例共用sessionId池最多6个，poll/stop只按ID无vault/主体核对，另实例可驱逐最老流；RPC身份依赖宿主不在此闭合。historyStore按调用者提供vaultId/default，全局内存每项40条但key无限，无版本比较，更新时间不做冲突判定，晚到旧值可覆盖新值；客户端localStorage兜底不等持久同步保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:798-817](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L798-L817)

planner无signal。

<details>
<summary>查看原文（20行）</summary>

```text
			const planMessages = [
				{ role: "system", content: [{ type: "text", text: PLANNER_PROMPT }] },
				{ role: "user", content: [{ type: "text", text: question.slice(0, 500) }] },
			];
			const options = { messages: planMessages };
			if (route?.provider) options.provider = route.provider;
			if (route?.model) options.model = route.model;
			// OPT-2.4 规划跳比主生成便宜一档即可，别再额外砍到 low（见 PLAN_EFFORT_MAP 注释）。
			const planEffort = String(this.config.reasoningEffort ?? "high").trim();
			if (planEffort) options.reasoningEffort = PLAN_EFFORT_MAP[planEffort] || planEffort;
			let planText = "";
			// 规划跳必须有超时：某些路由/无路由下 llm.stream 永不 settle，会挂死整个请求。
			const planStream = (async () => {
				for await (const chunk of llm.stream(options)) {
					const failure = terminalFailure(chunk);
					if (failure) break;
					planText += visibleDelta(chunk);
				}
			})();
			await withTimeout(planStream, 20000, "检索规划");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1090-1148](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1090-L1148)

共享流池与驱逐。

<details>
<summary>查看原文（59行）</summary>

```text
	static _streams = new Map(); // sessionId -> {text, done, error, controller, provider, model, ts}
	static _historyStore = new Map(); // OPT-4.2 vaultId -> { items, updatedAt }，纯内存（服务重启即丢，客户端 localStorage 另有本地兜底）

	async chatStart(payload) {
		const question = String(payload?.question || "").trim();
		const history = Array.isArray(payload?.history) ? payload.history : [];
		if (!question) throw new Error("问题不能为空");
		await this._restorePersisted();
		const llm = this._llm();
		// 路由解析：消息级覆盖（选择器选定）> 显式配置 > DSH 默认模型 > 空则目录回退。
		// 「不带 provider」在实测里必定空转，所以这里必须拿到具体 provider 再发起流。
		const baseRoute = await this._resolveRoute(llm);
		const route = {
			provider: String(payload?.provider || "").trim() || baseRoute.provider,
			model: String(payload?.model || "").trim() || baseRoute.model,
		};
		// 推理档位：消息级选择（选择器选定，可传 "" 表示跟随上游默认）> resolveEffort 规则。
		const effortExplicit = payload?.effort !== undefined ? String(payload.effort || "").trim() : undefined;
		const effortRow = readCatalogModels().find((m) => m.id === route.model);
		const effort = effortExplicit !== undefined
			? effortExplicit
			: resolveEffort({ configDefault: this.config.reasoningEffort, row: effortRow });
		// OPT-2.12 单次生成超时：走配置（钳制逻辑见 _timeoutMs），文案按实际秒数生成。
		const timeoutMs = this._timeoutMs();
		const timeoutSec = Math.round(timeoutMs / 1000);

		// 会话状态先建、先注册：检索/规划也是这几秒的耗时（复杂问题还会多打一次
		// planner 模型调用），历史版本把它们放在 sessionId 之前，这段窗口里客户端
		// 还没有 sessionId 可停——点停止完全空转，气泡卡在「检索知识库并生成回答…」。
		const sessionId = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
		// OPT-2.8 阶段可见：检索+规划要好几秒（复杂问题还多打一次 planner 调用），
		// 这段窗口客户端轮询只看到空白。phase 让面板能显示「正在检索 / 正在生成」，
		// hitCount 在检索完成后回填——只在内存里，不影响任何既有字段。
		// ⚠️ test/stop-cycle.test.mjs 按字符下标断言：本行 `_streams.set` 必须出现在
		// 检索那行 abortable 调用之前（会话状态先注册才能被 chatStop 找到）。
		// 两者可以一起后移，但相对顺序不能反。
		const state = { text: "", think: "", done: false, error: "", controller: new AbortController(), provider: route.provider, model: route.model, effort, usage: null, ts: Date.now(), attempt: 1, stopping: false, phase: "retrieval", hitCount: 0, fallback: null };
		ObsidianBoardGateway._streams.set(sessionId, state);
		// 只保留最近 6 个会话，防泄漏
		for (const [k, v] of ObsidianBoardGateway._streams) {
			// OPT-2.7 两级清理：先删全部过期会话（done 且超 60s），再按 ts 驱逐最老会话直到 size ≤ 6。
		// 未 done 的会话先 abort 再删，保证其 awaiting 侧能立刻收到 AbortError 而不是永久悬挂。
		if (ObsidianBoardGateway._streams.size > 6) {
			for (const [k, v] of ObsidianBoardGateway._streams) {
				if (v.done && Date.now() - v.ts > 60000) ObsidianBoardGateway._streams.delete(k);
			}
		}
		while (ObsidianBoardGateway._streams.size > 6) {
			let oldestKey = null;
			let oldestTs = Infinity;
			for (const [k, v] of ObsidianBoardGateway._streams) {
				if (v.ts < oldestTs) {
					oldestTs = v.ts;
					oldestKey = k;
				}
			}
			const oldest = ObsidianBoardGateway._streams.get(oldestKey);
			if (oldest && oldest.controller && !oldest.done) oldest.controller.abort();
			ObsidianBoardGateway._streams.delete(oldestKey);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1183-1229](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1183-L1229)

deadline/abort/return。

<details>
<summary>查看原文（47行）</summary>

```text
		(async () => {
			let timedOut = false;
			const deadline = setTimeout(() => {
				timedOut = true;
				try { state.controller.abort(); } catch { /* ignore */ }
			}, timeoutMs);
			const runOne = async (options) => {
				const signal = state.controller.signal;
				const iterator = llm.stream({ ...options, signal })[Symbol.asyncIterator]();
				// abort 与「等下一个 chunk」赛跑：模型静默期（首字等待、上游缓冲、
				// 适配器卡住）根本没有 chunk 到达，只在循环顶部检查 aborted 永远读不到
				// 停止指令——实测表现就是「停止按钮只有思考增量在流的时候才生效」。
				let abortResolve = () => {};
				const abortPromise = new Promise((resolve) => {
					abortResolve = () => resolve({ __abort: true });
					if (signal.aborted) abortResolve();
					else signal.addEventListener("abort", abortResolve, { once: true });
				});
				try {
					while (true) {
						if (signal.aborted) return true;
						const pending = iterator.next();
						// 竞速落败方的 rejection 不该成为 unhandled rejection（原始 promise
						// 仍会把错误交给 race 抛出，这里只是挂一个吞掉的派生分支）
						pending.catch(() => {});
						const next = await Promise.race([pending, abortPromise]);
						if (next && next.__abort) return true;
						if (next.done) break;
						const chunk = next.value;
						const failure = terminalFailure(chunk);
						if (failure) { state.error = "模型调用失败：" + failure; return false; }
						// usage chunk：token 计量（协议：{type:'usage', usage:{inputTokens,...}}，
						// 先于 finish；usageOf 统一 camelCase/snake_case/旧形状）
						const usage = usageOf(chunk);
						if (usage) state.usage = usage;
						// 思考增量：单独通道攒给面板展示（onlyReasoning 模型的思考期可达分钟级，
						// 不展示就是「只转圈」；正文与思考互不混入）
						const think = thinkingDelta(chunk);
						if (think) state.think += think;
						const delta = visibleDelta(chunk);
						if (delta) state.text += delta;
					}
					return true;
				} finally {
					signal.removeEventListener("abort", abortResolve);
					// 提前退出（停止/失败）时释放上游迭代器，让适配器尽快收尾
					try { await iterator.return?.(); } catch { /* ignore */ }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1284-1305](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1284-L1305)

自动回退上下文与提示。

<details>
<summary>查看原文（22行）</summary>

```text
					for (const pair of pairs) {
						if (state.controller.signal.aborted) break;
						try {
							// 新一次尝试：清空宿主缓冲，并且**递增 attempt**。
							// 关键：客户端按「绝对偏移 received」取增量，宿主一旦重置 text
							// 而偏移不重置，切片就错位——轻则新回答永远不出现（length 没超过
							// 旧偏移），重则把上一轮的残文和这一轮的正文拼成重复/错乱的输出
							// （这正是「总是输出异常」的一类来源）。客户端看到 attempt 变化
							// 会同步重置偏移并清掉气泡里上一轮的残文。
							state.text = "";
							state.think = "";
							state.error = ""; // 清残留：上一对的失败不能吞掉这一对的结果
							state.usage = null; // 用量也是上一轮的，别混算
							state.attempt += 1;
							ok = await runOne(withEffort({ messages, provider: pair.provider, ...(pair.model ? { model: pair.model } : {}) }));
							attempts.push(pair.provider + "/" + (pair.model || "?") + (state.error ? "：" + state.error : (state.text.trim() ? "有输出" : "零文本")));
							if (state.text.trim()) {
								state.provider = pair.provider;
								state.model = pair.model || state.model;
								// OPT-2.2 回退成功不再写 config / _saveState：持久层保持用户显式配置，
								// 只在会话内存里记 fallback，客户端经 chatPoll.fallback 一次性提示。
								state.fallback = { provider: pair.provider, model: pair.model || state.model };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1378-1405](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1378-L1405)

停止与历史存储。

<details>
<summary>查看原文（28行）</summary>

```text
	async chatStop(payload) {
		const state = ObsidianBoardGateway._streams.get(String(payload?.sessionId || ""));
		if (!state) return { stopped: false };
		// 幂等：重复点停止 / 已自然结束都不会改变终态
		try { state.controller.abort(); } catch { /* ignore */ }
		// 立刻标记停止：后台段可能正卡在没有 chunk 的 await 上（上游静默期），
		// 轮询不该等它自己收敛——先把中性终态写给客户端（不冒充错误，也没有
		// 半截正文时不留空气泡）。
		state.stopping = true;
		if (!state.text.trim() && !state.error) state.error = "已停止";
		return { stopped: true };
	}

	// ── RPC：对话历史云同步（OPT-4.2 宿主半；typert descriptor 由 B7 批次生成，当前 direct 调用可达）──
	async historyGet(payload) {
		const key = String(payload?.vaultId || "").trim() || "default";
		const entry = ObsidianBoardGateway._historyStore.get(key);
		return entry ? { items: entry.items, updatedAt: entry.updatedAt } : { items: [], updatedAt: 0 };
	}

	async historySet(payload) {
		const key = String(payload?.vaultId || "").trim() || "default";
		const raw = Array.isArray(payload?.items) ? payload.items : [];
		// 与客户端 sanitizeHistory(-40) 对齐：只保留最近 40 条
		const items = raw.slice(-40);
		const updatedAt = Number(payload?.updatedAt) || Date.now();
		ObsidianBoardGateway._historyStore.set(key, { items, updatedAt });
		return { ok: true };
```

</details>

#### 缺口

- 宿主typert对这些direct RPC的身份/客户端隔离与可用provider数据策略
  **影响：**插件局部池键和vaultId不能单独提供多用户权限保证
  **进一步探讨：**对照部署宿主admission与远端模型授权范围，明确允许回退的通道

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程证据与三阶段成本如何评价？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

vault纯函数/索引、gateway与client分离，统一typert描述符生成可减少接口漂移，专门处理attempt/思考增量/旧轮finally，工程关注失败路径。测试目录广泛，但stop-cycle多是includes/正则断言源码存在，不执行真实阻塞iterator与取消生命周期；源码形状通过不等静默期真实资源及时停止。本次只读关键测试，不运行。

首次选可信vault、确认哪些隐藏/收集目录会索引以及实际模型接收者；首次全量读切片占CPU/内存，单文件索引未套读源体积上限。持续每轮仍扫文件元数据，复杂题多一次规划、回退可增加多次收费，历史按条/字符截断而非统一token预算；thinking全文和最多六流也占内存。失败恢复包括重建索引、保留partial回复/原note、确认保存是否发生与历史是否仅内存；README召回可靠和停止保证没有同库基线量化，不硬报节省时间/准确率。

#### 证据与依据

**依据 1 · 源码核查**：[lib/vault.js:313-349](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L313-L349)

全量/增量工作。

<details>
<summary>查看原文（37行）</summary>

```text
	async _full(vaultPath) {
		this.vaultPath = vaultPath;
		this.chunks = [];
		this.byNote = new Map();
		this.df = new Map();
		const files = await this._scan(vaultPath);
		// OPT-1.7：有界并发读文件；提交严格按 files 顺序，chunk 顺序与串行实现逐字节一致。
		const built = await mapPool(files, this.readConcurrency, (file) => this._safeBuild(file, vaultPath));
		for (let i = 0; i < files.length; i++) if (built[i]) this._commitNote(built[i]);
		this._recomputeStats();
		this.builtAt = Date.now();
	}

	async _incremental(vaultPath) {
		const files = await this._scan(vaultPath);
		const seen = new Set();
		const mtimes = await mapPool(files, this.readConcurrency, async (file) => {
			try { return (await stat(file)).mtimeMs; } catch { return null; }
		});
		const dirty = [];
		for (let i = 0; i < files.length; i++) {
			seen.add(files[i]);
			if (mtimes[i] === null) continue;
			const rec = this.byNote.get(files[i]);
			if (!rec || rec.mtimeMs !== mtimes[i]) dirty.push(files[i]);
		}
		const built = await mapPool(dirty, this.readConcurrency, (file) => this._safeBuild(file, vaultPath));
		for (let i = 0; i < dirty.length; i++) {
			// 先标记旧 chunk 为孤儿再提交新 chunk：与基线的「drop+index 逐文件交替」等价
			// （孤儿只在 _recomputeStats 里压实，追加顺序不受影响）。
			this._dropNote(dirty[i]);
			if (built[i]) this._commitNote(built[i]);
		}
		let dirtyAny = dirty.length > 0;
		for (const path of [...this.byNote.keys()]) {
			if (!seen.has(path)) { this._dropNote(path); dirtyAny = true; }
		}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:170-190](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L170-L190)

历史字符预算。

<details>
<summary>查看原文（21行）</summary>

```text
	// 面板会话历史（截断到最近 N 条，防止上下文膨胀）
	const limit = Math.max(2, Math.min(60, Number(historyLimit) || 24));
	const tail = history.slice(-limit);
	// OPT-2.9 历史预算：多轮追问（「再详细说说第 2 点」）时，指代对象常落在前一轮长回答的后半段，
	// 一刀切 4000 字会把它腰斩成「上一轮没说过」。给最近 2 条 assistant 消息 8000 字，更早的仍 4000 字。
	const RECENT_BUDGET = 8000;
	const OLD_BUDGET = 4000;
	const assistantCount = tail.filter((m) => m && m.role === "assistant" && typeof m.content === "string" && m.content.trim()).length;
	let assistantSeen = 0;
	for (const m of tail) {
		if (!m || typeof m.content !== "string" || !m.content.trim()) continue;
		const isAssistant = m.role === "assistant";
		let budget = OLD_BUDGET;
		if (isAssistant) {
			assistantSeen += 1;
			if (assistantCount - assistantSeen < 2) budget = RECENT_BUDGET;
		}
		messages.push({
			id: randomUUID(),
			role: isAssistant ? "assistant" : "user",
			content: [{ type: "text", text: m.content.slice(0, budget) }],
```

</details>

**依据 3 · 源码核查**：[test/stop-cycle.test.mjs:17-38](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/test/stop-cycle.test.mjs#L17-L38)

源码字符串测试。

<details>
<summary>查看原文（22行）</summary>

```text
const host = readFileSync(new URL("../lib/index.js", import.meta.url), "utf8");
const client = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");

// ── 1. 宿主：abort 与等 chunk 竞速 ──────────────────────────────────
t("runOne 用 asyncIterator 手动驱动（可与 abort 竞速）", host.includes("llm.stream({ ...options, signal })[Symbol.asyncIterator]()"));
t("abort 与 iterator.next() 走 Promise.race", /Promise\.race\(\[pending, abortPromise\]\)/.test(host));
t("race 落败分支挂 catch（不留 unhandled rejection）", /pending\.catch\(\(\) => \{\}\)/.test(host));
t("竞速胜出立即返回（静默期也能停）", /if \(next && next\.__abort\) return true;/.test(host));
t("提前退出释放上游迭代器", /await iterator\.return\?\.\(\)/.test(host));
t("abort 监听器在 finally 里摘除（不泄漏）", /signal\.removeEventListener\("abort", abortResolve\)/.test(host));

// ── 2. 宿主：检索/规划阶段可中止 ────────────────────────────────────
t("会话状态在检索之前创建并注册", host.indexOf("ObsidianBoardGateway._streams.set(sessionId, state)") < host.indexOf("await abortable(this._multiHits("));
t("检索用 abortable 包装", /const retrieval = await abortable\(this\._multiHits\(/.test(host));
t("检索被中止时直接落定终态并返回空 citations", /if \(retrieval && retrieval\.__aborted\) \{[\s\S]{0,200}state\.done = true/.test(host));
t("abortable 同时监听 abort 与 resolve/reject 并摘除监听", /signal\.addEventListener\("abort", onAbort, \{ once: true \}\)/.test(host) && /signal\.removeEventListener\("abort", onAbort\)/.test(host));

// ── 3. 宿主：chatStop 立即可见 + 幂等 ───────────────────────────────
t("chatStop 立刻给空正文会话写入中性终态", /state\.stopping = true;/.test(host) && /if \(!state\.text\.trim\(\) && !state\.error\) state\.error = "已停止";/.test(host));
t("chatStop 对 abort 抛错免疫（幂等）", /try \{ state\.controller\.abort\(\); \} catch/.test(host));
t("停止引发的迭代器异常收敛为中性终态", /state\.controller\.signal\.aborted\s*\?\s*"已停止"\s*:\s*"模型调用失败："/.test(host));
t("已有正文的停止保留正文（不写 error）", /if \(state\.controller\.signal\.aborted && state\.text\.trim\(\)\) state\.error = "";/.test(host));
```

</details>

**依据 4 · 源码核查**：[lib/typert.js:1-3](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/typert.js#L1-L3)

统一契约源。

```text
/* Generated for dsh-obsidian-board — do not edit. */
// OPT-6.1：本文件的 TYPERT 导出是全链契约的单一来源；客户端 descriptor 区
// 由 scripts/gen-client-contract.mjs 从它生成（lib/client.js 的 <gen:contract> 区）。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何采用及继续探讨？

**研究主题：**新假设与验证、采用判断

#### 完整回答

先观察，关键原因是索引/读源物理边界不一致、自动跨provider回退带数据政策变化以及保存非独占。可信个人非敏感库、受限模型通道、备份后可做同库对照；先排除外链/超大md与AI回答目录链接，保存后核文件和YAML，不用于唯一重要资料或严格多用户隔离。没有召回不等笔记不存在，答案需对着原文核对。

继续可研究扫描/读源统一物理句柄与大小限制、单飞等待正确索引版本、受预算且传signal的规划与候选provider白名单，保存用独占创建、历史加vault主体和版本CAS。基线为当前词法枚举+直接读、外层abortrace和access写，反例含外链md、大文件、双vault并发索引、规划阻塞/return不收敛、双同名保存、旧历史晚到和不准离机笔记触发回退。比较越界内容、召回对账、真实停止耗时/费用与恢复工时，方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/vault.js:289-301](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L289-L301)

扫描已进行时仅queued返回。

<details>
<summary>查看原文（13行）</summary>

```text
	async ensureIndexed(vaultPath, { force = false } = {}) {
		if (this.scanning) return { queued: true };
		if (!force && this.builtAt && this.vaultPath === vaultPath) {
			// 轻量增量：只对 mtime 变化的笔记重建 chunk。
			return this._incremental(vaultPath);
		}
		this.scanning = true;
		try {
			if (force || this.vaultPath !== vaultPath) await this._full(vaultPath);
			else await this._incremental(vaultPath);
		} finally {
			this.scanning = false;
		}
```

</details>

**依据 2 · 源码核查**：[lib/vault.js:354-380](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js#L354-L380)

索引基线。

<details>
<summary>查看原文（27行）</summary>

```text
	async _buildNote(file, vaultPath) {
		const raw = await readFile(file, "utf8");
		const { frontmatter, body } = parseFrontmatter(raw);
		const rel = relative(vaultPath, file).split(sep).join("/");
		const title = basename(file).replace(/\.(md|markdown)$/i, "");
		const mtimeMs = (await stat(file)).mtimeMs;
		const note = {
			path: rel,
			title,
			mtimeMs,
			aliases: extractAliases(frontmatter),
			tags: extractTags(frontmatter, body),
			chunkIdx: [],
		};
		const chunks = chunkNote({ path: rel, title, body }).map((chunk) => {
			// 标题面包屑重复进正文计权：标题词在检索里更重。
			const boost = note.title + "\n" + chunk.crumbs + "\n" + chunk.heading;
			const tokenList = tokenize(boost + "\n" + chunk.text);
			const tokens = new Map();
			for (const t of tokenList) tokens.set(t, (tokens.get(t) || 0) + 1);
			return { ...chunk, tokens, len: tokenList.length };
		});
		return { file, note, chunks };
	}

	async _safeBuild(file, vaultPath) {
		try { return await this._buildNote(file, vaultPath); } catch { return null; /* 单文件失败不拖垮全量 */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:798-817](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L798-L817)

规划基线。

<details>
<summary>查看原文（20行）</summary>

```text
			const planMessages = [
				{ role: "system", content: [{ type: "text", text: PLANNER_PROMPT }] },
				{ role: "user", content: [{ type: "text", text: question.slice(0, 500) }] },
			];
			const options = { messages: planMessages };
			if (route?.provider) options.provider = route.provider;
			if (route?.model) options.model = route.model;
			// OPT-2.4 规划跳比主生成便宜一档即可，别再额外砍到 low（见 PLAN_EFFORT_MAP 注释）。
			const planEffort = String(this.config.reasoningEffort ?? "high").trim();
			if (planEffort) options.reasoningEffort = PLAN_EFFORT_MAP[planEffort] || planEffort;
			let planText = "";
			// 规划跳必须有超时：某些路由/无路由下 llm.stream 永不 settle，会挂死整个请求。
			const planStream = (async () => {
				for await (const chunk of llm.stream(options)) {
					const failure = terminalFailure(chunk);
					if (failure) break;
					planText += visibleDelta(chunk);
				}
			})();
			await withTimeout(planStream, 20000, "检索规划");
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1409-1442](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js#L1409-L1442)

保存基线。

<details>
<summary>查看原文（34行）</summary>

```text
	async saveNote(payload) {
		await this._restorePersisted();
		const vaultPath = await this._vaultPath();
		const title = String(payload?.title || "").trim() || "知识库回答 " + new Date().toISOString().slice(0, 16).replace("T", " ");
		const content = String(payload?.content || "");
		if (!content.trim()) throw new Error("内容为空，没有可保存的回答");
		// 文件名消毒：Windows 非法字符 + 长度上限
		const safe = title.replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "知识库回答";
		const dir = join(vaultPath, "AI 回答");
		const { mkdir, writeFile, access } = await import("node:fs/promises");
		await mkdir(dir, { recursive: true });
		let path = join(dir, safe + ".md");
		// 同名追加序号
		for (let i = 2; i < 200; i++) {
			try { await access(path); path = join(dir, `${safe} ${i}.md`); } catch { break; }
		}
		const header = [
			"---",
			"tags: [ai-answer]",
			`created: ${new Date().toISOString()}`,
			`source: dsh-obsidian-board`,
		];
		// OPT-2.1 YAML 列表写法：每个文件只出现一次 refs: 键（重复 key 是非法 YAML，
		// Obsidian 会丢字段）；零引用时不写 refs 键。
		const cites = Array.isArray(payload?.citations) ? payload.citations : [];
		const refs = cites.filter((c) => c?.notePath).slice(0, 20).map((c) => `  - "[[${c.notePath.replace(/\.md$/i, "")}|${c.noteTitle || c.notePath}]]"`);
		if (refs.length) header.push("refs:", ...refs);
		header.push("---", "");
		const body = header.join("\n") + content.trim() + "\n";
		await writeFile(path, body, "utf8");
		// OPT-2.10 保存一条笔记后不再全量重建索引：万级笔记的库 force 一次要卡好几秒，
		// 而 ensureIndexed 的增量分支按 mtime 就能捡到刚写的这个文件。
		await this.index.ensureIndexed(vaultPath);
		return { saved: true, path: "AI 回答/" + path.split(/[\\/]/).pop(), title: path.split(/[\\/]/).pop().replace(/\.md$/i, "") };
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
