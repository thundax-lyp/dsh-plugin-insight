# DSH Archive Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[866fd95](https://github.com/MichengAI/dsh-archive-manager/tree/866fd95c157a6c943e697d58f589826a6cbf97e0)

<!-- BEGIN META -->
[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-archive-manager) [![npm 30d 71,052](https://img.shields.io/static/v1?label=npm+30d&message=71%2C052&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager)
<!-- END META -->

> **功能**：管理 DSH 会话归档，支持恢复、收藏、检索和永久删除。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示不用激活冷会话即可筛选用户与助手文本，相对打开完整会话减少一个操作步骤；不证明覆盖全部事件或节时。

> **主要限制**：[Q03](#research-q03) 显示子代理清理失败只记录警告，父级结果可能继续成功；[Q04](#research-q04) 的临时移动备份成功后清理，不能当永久恢复点。

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
  - [Q01 · 用户通过会话检索获得什么，原生归档是否足够？](#detail-section-11)
  - [Q02 · 只读预览和搜索如何接入存储？](#detail-section-12)
  - [Q03 · 删除父项是否证明所有子项和工件均清除？](#detail-section-13)
  - [Q04 · 缓存重建和移动的事务与恢复边界是什么？](#detail-section-14)
  - [Q05 · 依赖、使用负担及停止条件是什么？](#detail-section-15)
  - [Q06 · 对象级清理收据能否降低误判？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要查找和整理大量 DSH 会话的用户可先检索对话文本，必要时恢复；物理清理仍需逐对象核实。

原生归档和打开完整会话可完成部分工作；此插件提供冷会话只读检索和批量管理，未比较真实时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 冷会话检索 | 搜索并预览对话文本 | 工具输出、附件和推理不包含在正文 |
| 会话清理 | 删除归档会话及相关工件 | 子代理失败可能只写警告，需重扫 |
| 移动与缓存重建 | 迁移会话并确认缓存 | 暂存备份不等于长期备份，超时不取消写入 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配 DSH 宿主 | 启动需要 | Workspace 和客户端集成 | 版本不符时不能假定加载 |
| session persistence | 冷读取需要 | 只读打开会话 | 不支持时提示打开完整会话 |
| 投影缓存和存储服务 | 相应管理功能需要 | 缓存重建与状态保存 | 缺失时相应操作失败 |
| 独立数据备份 | 物理操作前需要 | 故障后恢复 | 临时移动备份不是长期备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认宿主、profile 并复制数据 | 备份可独立读取 |
| 查询 | 用户搜索并只读预览 | 核对失败项和不覆盖的内容类型 |
| 管理 | 用户先在副本试恢复或收藏 | 不对重要数据直接永久删除 |
| 核验 | 用户检查父子对象、投影与备份 | 状态不明时停止重试并调查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 独立备份空间未知 | 版本与数据副本核对，时间未知 | 需兼容宿主 |
| 持续 | 读取日志及投影 I/O 未知 | 过滤搜索结果与失败项 | 大量会话性能未知 |
| 失败恢复 | 备份与残留空间未知 | 核对父子、文件和记账 | 永久删除不可靠卸载撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 搜索和预览 | 冷读取并抽取对话文本 | 全事件查全率和大规模耗时 |
| 清理 | 父目标结果和物理操作路径 | 子项残留、所有存储的清理效果 |
| 移动 | 暂存和尽力回滚 | 断电后的完整事务与恢复 |

> **思考**：[Q03](#research-q03) 显示子代理清理失败只记录警告，父级结果可能继续成功；[Q04](#research-q04) 的临时移动备份成功后清理，不能当永久恢复点。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示不用激活冷会话即可筛选用户与助手文本，相对打开完整会话减少一个操作步骤；不证明覆盖全部事件或节时。

[Q02](#research-q02) 的只读 handle 生命周期及 [Q04](#research-q04) 的身份复核、缓存回读有明确条件；[Q03](#research-q03) 的子项错误未随父结果传播，不能由父成功推断完整清理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示子代理清理失败只记录警告，父级结果可能继续成功；[Q04](#research-q04) 的临时移动备份成功后清理，不能当永久恢复点。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议已有独立备份的用户先在副本试检索和恢复；删除或移动结果不明时停止并逐对象核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持所查读取和物理操作分支；宿主兼容、恢复与实际性能未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/workspace.ts、src/archive-discovery.ts、src/cache-rebuild.ts、src/session-move.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的 Workspace 远程接口、会话读取、物理删除、缓存重建和移动路径；未运行插件、宿主或真实删除，未审全部更新、安全路由和存储格式。
- 下一步：固定宿主版本，在可丢弃副本测试冷读取、子项删除失败、缓存回读超时、移动中断及从独立备份恢复；分别核验文件、子会话与状态。

**分析版本**

- **仓库**：[MichengAI/dsh-archive-manager](https://github.com/MichengAI/dsh-archive-manager)
- **版本号**：1.1.22（[固定提交 866fd95](https://github.com/MichengAI/dsh-archive-manager/tree/866fd95c157a6c943e697d58f589826a6cbf97e0)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出对象级清理及重扫收据的未验证假设；若不能覆盖真实存储或增加负担过高则不推广。

固定宿主版本，在可丢弃副本测试冷读取、子项删除失败、缓存回读超时、移动中断及从独立备份恢复；分别核验文件、子会话与状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 2000 | — | — | 34438 |
| .js | source | 20 | 3738 | 3663 | 94 | — |
| .mjs | source | 8 | 600 | 533 | 26 | — |
| .ts | source | 32 | 9792 | 8910 | 563 | — |
| .mjs | test | 41 | 8956 | 8030 | 322 | — |
| .mjs | example | 4 | 605 | 573 | 18 | — |
| .ts | test | 1 | 30 | 19 | 9 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/MichengAI/dsh-archive-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查只读会话检索、删除及移动的实际接线与恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户通过会话检索获得什么，原生归档是否足够？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要从大量 DSH 会话找回对话的用户可按标题和正文筛选、只读预览再决定是否恢复；原生归档和打开完整会话是替代。README.md:56-62 说明搜索按批次读取并排除工具、附件、推理、系统消息和插件注入；src/archive-discovery.ts:80-95 只抽取用户/助手消息中的文本。因此未命中不证明会话里没有有关工具输出或附件。源码提供不用激活冷会话而找文本的条件性增量，真实查全率、大量日志耗时和节省操作未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:56-62](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/README.md#L56-L62)

作者说明搜索及正文范围。

```text
## Search and preview

- Archived and Unarchived share title/content search, project, favorites, updated-date filters, and creation-time sorting. Star or unstar conversations on either tab.
- Search automatically covers both conversation titles and body history (including user and assistant messages) by default. Date filters include the entire local end date and combine with project and favorites.
- Matches show snippets and highlights. On Archived, click a snippet or **More → Quick preview** to inspect context without restoring. On Unarchived, a snippet opens the full conversation.
- Preview renders Markdown tables, quotes, and code blocks with role labels; switch to source text for highlights. It shows up to eight recent messages, or context around the first match. Each message is limited to 2,000 UTF-16 code units without splitting Unicode characters.
- Search accepts up to 200 query characters and reads batches of at most 20 sessions, sequentially within each batch. Tools, attachments, reasoning, system messages, and plugin injections are excluded. Read failures remain visible and can be retried. Stored text is not the model's current context.
```

**依据 2 · 源码核查**：[src/archive-discovery.ts:80-95](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/archive-discovery.ts#L80-L95)

事件正文的实际筛选。

<details>
<summary>查看原文（16行）</summary>

```text
/** 读取持久化事件的原始对话文本，不把工具输出、推理或插件注入当作正文。 */
export function extractConversation(events: readonly unknown[]) {
  if (!Array.isArray(events)) throw new TypeError("会话日志无效");
  const messages: TextMessage[] = [];
  for (const event of events.map(record)) {
    if (event.type !== "user/message" && event.type !== "assistant/message") continue;
    const data = event.data && typeof event.data === "object" ? record(event.data) : {};
    const message = data.message && typeof data.message === "object" ? record(data.message) : data;
    const role = event.type === "user/message" ? "user" : "assistant";
    const source = message.source && typeof message.source === "object" ? record(message.source) : {};
    if (role === "user" && source.kind && source.kind !== "user") continue;
    const content = message?.content;
    const text = typeof content === "string" ? content : Array.isArray(content) ? content.filter(block => block?.type === "text" && typeof block.text === "string").map(block => block.text).join("\n") : "";
    if (text.trim()) messages.push({ seq: sequence(event.seq), role, text });
  }
  return messages;
```

</details>

#### 缺口

- 无真实用户和同任务对照
  **影响**：查全率与节时未知
  **进一步探讨**：在相同会话集比较原生打开方式与只读搜索。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 只读预览和搜索如何接入存储？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/workspace.ts:519-531 扩展宿主 Workspace Registry 并注册远程方法；533-549 对已归档会话前后检查身份，已加载对象取事件快照，冷会话通过 persistence 只读打开；792-803 完成读取后关闭 handle。552-581 对每个目标独立返回命中或失败和预览。extractConversation 只保留 user/assistant 的文本，且排除非用户来源；该功能不会覆盖所有事件。缺只读 persistence 时明确要求打开完整会话。源码支持该路径，不证明当前宿主安装、存储格式及性能均通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:519-549](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L519-L549)

宿主注入及只读来源。

<details>
<summary>查看原文（31行）</summary>

```text
	static inject = [
		"storageDomain",
		"sessionPersistence",
		"sessionProjectionCache",
		"typert",
	];
	declare typertRemote: TypertGatewayBinding<this>;
	declare favoriteDomainPromise: Promise<Domain<typeof favoriteDomainSpec>> | undefined;
	constructor(ctx: Context) {
		super(ctx);
		this.typertRemote = bindTypertRemote(this, this.name);
		for (const method of ARCHIVE_REMOTE_METHODS) markRemoteMethod(this, method);
		registerHostRemote(this.ctx);
	}
	/** 只读取归档日志；已有实时实例读取快照，不调用 prepare、enter 或恢复接口。 */
	async readArchivedConversation(sessionId: string) {
		const ensureArchived = () => {
			if (!this.requireState().archivedSessionIds.includes(sessionId)) throw new Error("会话已不在归档中，请刷新列表");
		};
		ensureArchived();
		const events = await this.readConversationEvents(sessionId);
		ensureArchived();
		return extractConversation(events);
	}
	/** 复用宿主只读接口读取事件，不激活会话。 */
	async readConversationEvents(sessionId: string) {
        const live = this.ctx.get("sessions")?.get(sessionId);
        if (typeof live?.snapshotEvents === "function") return live.snapshotEvents();
        const persistence = this.ctx.get("sessionPersistence");
        if (!persistence || typeof persistence.open !== "function") throw new Error("当前宿主不支持只读会话，请打开完整会话查看");
        return (await this.readStoredProjectionSource(persistence, sessionId)).events;
```

</details>

**依据 2 · 源码核查**：[src/workspace.ts:552-581](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L552-L581)

逐会话搜索、失败与预览。

<details>
<summary>查看原文（30行）</summary>

```text
    async searchSessionContent(input: unknown) {
        const { sessionIds, query } = searchInputSchema.parse(input);
        const items = [], failures = [];
        for (const sessionId of sessionIds) {
            try {
                if (!(await this.sessionKnown(sessionId))) throw new Error("会话不存在，请刷新列表");
                const messages = extractConversation(await this.readConversationEvents(sessionId));
                if (!(await this.sessionKnown(sessionId))) throw new Error("会话已移除，请刷新列表");
                const match = findContentMatch(messages, query);
                if (match) items.push({ sessionId, ...match });
            } catch (error) { failures.push({ sessionId, message: errorMessage(error).slice(0, 500) }); }
        }
        return { items, failures };
    }
    /** 输入为限定批次的归档 ID 和关键词，逐条返回命中或失败。 */
    async searchArchivedContent(input: unknown) {
		const { sessionIds, query } = searchInputSchema.parse(input);
		const items = [], failures = [];
		for (const sessionId of sessionIds) {
			try {
				const match = findContentMatch(await this.readArchivedConversation(sessionId), query);
				if (match) items.push({ sessionId, ...match });
			} catch (error) { failures.push({ sessionId, message: errorMessage(error).slice(0, 500) }); }
		}
		return { items, failures };
	}
	/** 返回最近八条对话或关键词附近的八条，单条最多 2000 字，不写入宿主数据。 */
	async previewArchivedSession(input: unknown) {
		const { sessionId, query } = previewInputSchema.parse(input);
		return { sessionId, ...previewConversation(await this.readArchivedConversation(sessionId), query) };
```

</details>

**依据 3 · 源码核查**：[src/workspace.ts:792-803](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L792-L803)

读取后关闭 handle。

<details>
<summary>查看原文（12行）</summary>

```text
	async readStoredProjectionSource(persistence: PersistenceCompat, sessionId: string) {
		const handle = await persistence.open(sessionId, "read");
		try {
			const { events } = await handle.read(0);
			return {
				meta: handle.header,
				inheritedEventCount: handle.inheritedEventCount,
				events,
			};
		} finally {
			await handle.close();
		}
```

</details>

**依据 4 · 源码核查**：[src/archive-discovery.ts:80-95](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/archive-discovery.ts#L80-L95)

只抽取对话文本。

<details>
<summary>查看原文（16行）</summary>

```text
/** 读取持久化事件的原始对话文本，不把工具输出、推理或插件注入当作正文。 */
export function extractConversation(events: readonly unknown[]) {
  if (!Array.isArray(events)) throw new TypeError("会话日志无效");
  const messages: TextMessage[] = [];
  for (const event of events.map(record)) {
    if (event.type !== "user/message" && event.type !== "assistant/message") continue;
    const data = event.data && typeof event.data === "object" ? record(event.data) : {};
    const message = data.message && typeof data.message === "object" ? record(data.message) : data;
    const role = event.type === "user/message" ? "user" : "assistant";
    const source = message.source && typeof message.source === "object" ? record(message.source) : {};
    if (role === "user" && source.kind && source.kind !== "user") continue;
    const content = message?.content;
    const text = typeof content === "string" ? content : Array.isArray(content) ? content.filter(block => block?.type === "text" && typeof block.text === "string").map(block => block.text).join("\n") : "";
    if (text.trim()) messages.push({ seq: sequence(event.seq), role, text });
  }
  return messages;
```

</details>

#### 缺口

- 未运行目标宿主和所有格式
  **影响**：不能证明兼容性与性能
  **进一步探讨**：在隔离副本测试冷会话、格式差异和读取失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 删除父项是否证明所有子项和工件均清除？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

src/workspace.ts:814-843 批量删除逐目标收集成功、跳过与失败；893-896 的单项接口在核心函数返回后报告 deleted。900-945 先尝试 flush/脱离实时会话，再删投影、子代理、spill 与 transcript，物理工件删除成功后才清归档记账。1080-1122 仅级联 origin=subagent 的子项，并在子项删除或枚举失败时记录警告而继续，因此父项成功不能证明所有子工件均已删除。实时 flush/detach 失败也仅警告。调用方应单独重扫子会话、文件与记账，永久删除不可由卸载撤销；本轮未执行任何删除。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:814-843](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L814-L843)

批量目标分别收集结果。

<details>
<summary>查看原文（30行）</summary>

```text
	async deleteArchivedSessions(target: unknown) {
		return this.enqueueOperation(async () => {
			const requestedSessionIds = this.archivedSessionIdsForTarget(target);
			const deletedSessionIds = [];
			const skippedSessionIds = [];
			const failures = [];
			// 只给本批级联枚举复用，避免每个目标重复读取存储列表。
			let descendantHeaders: Header[] | undefined;
			try {
				descendantHeaders = await this.listStoredHeaders();
			} catch (error) {
				this.ctx.logger.warn(
					`archive-manager: batch descendant listing failed; each cascade will retry: ${String(error)}`,
				);
			}
			for (const sessionId of requestedSessionIds) {
				try {
					const result = await this.deleteSessionCore(sessionId, descendantHeaders);
					if (result?.skipped) skippedSessionIds.push(sessionId);
					else deletedSessionIds.push(sessionId);
				} catch (error) {
					failures.push({ sessionId, message: deletionFailureMessage(error) });
				}
			}
			return {
				requestedSessionIds,
				deletedSessionIds,
				skippedSessionIds,
				failures,
			};
```

</details>

**依据 2 · 源码核查**：[src/workspace.ts:893-903](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L893-L903)

单项入口与未知项处理。

<details>
<summary>查看原文（11行）</summary>

```text
	async deleteSession(sessionId: string) {
		return this.enqueueOperation(async () => {
			await this.deleteSessionCore(sessionId);
			return { deleted: true };
		});
	}
	/** 串行化后的删除主体（级联路径复用：它已持有操作链，绝不能再入队）。 */
	async deleteSessionCore(sessionId: string, descendantHeaders?: Header[]) {
		if (!(await this.sessionKnown(sessionId))) {
			await this.cleanupUnknownArchivedSession(sessionId);
			return { deleted: true, skipped: true };
```

</details>

**依据 3 · 源码核查**：[src/workspace.ts:905-945](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L905-L945)

删除顺序与物理成功后记账。

<details>
<summary>查看原文（41行）</summary>

```text
		const sessions = this.ctx.get("sessions");
		const live = sessions?.get(sessionId);
		if (live !== void 0) {
			if (live.header !== void 0) {
				this.headers?.set(sessionId, live.header);
			}
			// 持久化屏障先行：尽力而为排空未落盘的转录写入
			//（若会话转录损坏导致 flush 失败，仅记录警告，不阻断后续分离与物理清理）。
			try {
				await sessions.flush(live);
			} catch (error) {
				this.ctx.logger.warn(
					`archive-manager: could not flush live session "${sessionId}" before deletion: ${String(error)}`,
				);
			}
			// 从存储分离；`session/disposed` 同步触发，驱动浏览器端的
			// `host/session-removed` 帧并启动投影缓存的最终写后落盘。
			try {
				const entry = sessions.liveEntryFor(live);
				sessions.detachEntered(entry);
			} catch (error) {
				this.ctx.logger.warn(
					`archive-manager: could not detach live session "${sessionId}" before deletion: ${String(error)}`,
				);
			}
		} else if (sessions !== void 0)
			await this.publishColdSessionRemoval(sessionId, sessions);
		const projCache = this.ctx.get("sessionProjectionCache");
		if (projCache !== void 0) await projCache.requireTable().delete(sessionId);
		await this.deleteDescendants(sessionId, descendantHeaders);
		await this.cleanSpill(sessionId);
		await this.removeTranscriptDirectory(sessionId);
		// 只有物理工件删除成功后才能提交记账清理；否则批量目标会因归档标记
		// 或工作区记账提前消失而无法重试。
		const state = this.requireState();
		if (state.archivedSessionIds.includes(sessionId)) {
			await this.setState({
				...state,
				archivedSessionIds: state.archivedSessionIds.filter(
					(id) => id !== sessionId,
				),
```

</details>

**依据 4 · 源码核查**：[src/workspace.ts:1080-1122](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L1080-L1122)

子代理筛选与失败只记录警告。

<details>
<summary>查看原文（43行）</summary>

```text
	/** 尽力而为的级联删除：删除 `sessionId` 的 SUBAGENT 子会话。
	 * 仅头部标记 `origin: "subagent"` 的会话参与：单凭 `parentSession` 有歧义
	 *（fork 分支也携带它），而 fork 分支是独立的用户会话，绝不能被级联删除。 */
	async deleteDescendants(sessionId: string, storedHeaders?: Header[]) {
		try {
			const descendants = [];
			const collected = new Set<string>();
			const sessions = this.ctx.get("sessions");
			if (sessions !== void 0)
				for (const session of sessions.list()) {
					if (
						session.header.parentSession === sessionId &&
						session.header.origin === "subagent"
					) {
						descendants.push(session.id);
						collected.add(session.id);
					}
				}
			// 批次快照只用于找子会话。缺省时逐次列举，便于单会话删除，也让失败的批次预取能按会话重试。
			for (const header of storedHeaders ?? await this.listStoredHeaders()) {
				if (
					header.parentSession === sessionId &&
					header.origin === "subagent" &&
					!collected.has(header.id)
				) {
					descendants.push(header.id);
					collected.add(header.id);
				}
			}
			for (const childId of descendants) {
				try {
					if (!(await this.sessionKnown(childId))) continue;
					await this.deleteSessionCore(childId, storedHeaders);
				} catch (error) {
					this.ctx.logger.warn(
						`archive-manager: cascade delete of subagent session "${childId}" (child of "${sessionId}") failed: ${String(error)}`,
					);
				}
			}
		} catch (error) {
			this.ctx.logger.warn(
				`archive-manager: descendant enumeration for deleted session "${sessionId}" failed: ${String(error)}`,
			);
```

</details>

#### 缺口

- 未验证所有存储与实际删除
  **影响**：父回执不保证没有子对象残留
  **进一步探讨**：在副本制造子项失败后重扫文件、spill、投影与记账。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 缓存重建和移动的事务与恢复边界是什么？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

workspace.ts:765-787 将缓存重建入工作区操作队列，写前再读头并比对身份；cache-rebuild.ts:9-26 对官方缓存快照进行回读比较，超时代表未确认而不是取消写。workspace.ts:1257-1271 将移动纳入相同操作链；session-move.ts:192-199 拒绝运行中会话，但 202-228 对取消、flush 和 detach 某些异常忽略。335-372 使用备份目录、重写及暂存文件；427-465 失败时尽力回滚，源恢复失败则报告备份路径，成功后清理临时备份。多个文件、缓存及工作区记录不因此构成经故障实测的全局事务，临时备份也不是长期恢复点。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:765-787](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L765-L787)

排队与身份复核。

<details>
<summary>查看原文（23行）</summary>

```text
	/** 与删除共用官方工作区队列；冷写入会同步加入官方域写入链，
	 * 回读超时也不会取消已入队的写入，因此后续删除会排在该写入之后。 */
	async rebuildSessionCaches(input: unknown): Promise<CacheRebuildResult> {
		const { items } = cacheRebuildInput.parse(input);
		const result: CacheRebuildResult = { rebuiltSessionIds: [], skippedSessionIds: [], failures: [] };
		for (const item of [...new Map(items.map(row => [row.sessionId, row])).values()]) {
			await this.enqueueOperation(async () => {
				try {
					const cache = this.ctx.get("sessionProjectionCache");
					if (!cache) throw new Error("Official session projection cache is unavailable");
					// 定向读取持久化头部，不使用工作区可能陈旧的内存索引。
					const header = await this.readSessionHeaderDirect(item.sessionId);
					if (!header || cacheIdentity(header) !== item.identity || !(await this.cacheRebuildEligible(header)) || this.usableSessionListCache(header)) {
						result.skippedSessionIds.push(item.sessionId); return;
					}
					const source = await this.readStoredProjectionSource(this.ctx.sessionPersistence, item.sessionId);
					const current = await this.readSessionHeaderDirect(item.sessionId);
					if (!current || cacheIdentity(current) !== item.identity || cacheIdentity(source.meta) !== item.identity || !(await this.cacheRebuildEligible(current))) {
						result.skippedSessionIds.push(item.sessionId); return;
					}
					await confirmColdCacheWrite(cache, source);
					result.rebuiltSessionIds.push(item.sessionId);
				} catch (error) { result.failures.push({ sessionId: item.sessionId, message: (error instanceof Error ? error.message : String(error)).slice(0, 500) }); }
```

</details>

**依据 2 · 源码核查**：[src/cache-rebuild.ts:9-26](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/cache-rebuild.ts#L9-L26)

回读确认和超时语义。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * coldSnapshot 仅安排容错写入；官方 cachedSnapshot 读取持久化成功后的域状态，
 * 因此只有匹配的回读才能确认保存。超时表示未确认，既不是成功也不是取消。
 * 调用方还须单独串行化生命周期变更，尤其是删除操作。
 */
export async function confirmColdCacheWrite<Meta, Events>(
  cache: ColdCache<Meta, Events>,
  source: { meta: Meta; inheritedEventCount: number; events: Events },
  { attempts = 100, wait = () => new Promise<void>(resolve => setTimeout(resolve, 20)) }: {
    attempts?: number; wait?: () => Promise<void>;
  } = {},
): Promise<CacheSnapshot> {
  const expected = cache.coldSnapshot(source.meta, source.inheritedEventCount, source.events);
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (isDeepStrictEqual(cache.cachedSnapshot(source.meta), expected)) return expected;
    await wait();
  }
  throw new Error("Official cache persistence could not be confirmed; retry is safe only after lifecycle revalidation.");
```

</details>

**依据 3 · 源码核查**：[src/workspace.ts:1257-1271](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L1257-L1271)

移动进入操作队列。

<details>
<summary>查看原文（15行）</summary>

```text
	async moveSessionToWorkspace(input: unknown): Promise<SessionMoveResult> {
		const { sessionId, targetWorkspaceId } = sessionMoveInputSchema.parse(input);
		return this.enqueueOperation(async () => {
			return moveSessionToWorkspace(
				{
					workspaceRegistry: this as unknown as SessionMoveContext["workspaceRegistry"],
					sessionPersistence: this.ctx.get("sessionPersistence") as unknown as SessionMoveContext["sessionPersistence"],
					sessionProjectionCache: this.ctx.get("sessionProjectionCache") as unknown as SessionMoveContext["sessionProjectionCache"],
					sessions: this.ctx.get("sessions") as unknown as SessionMoveContext["sessions"],
					agents: (this.ctx as unknown as { get(k: string): unknown }).get("agents") as SessionMoveContext["agents"],
					logger: this.ctx.logger,
				},
				sessionId,
				targetWorkspaceId
			);
```

</details>

**依据 4 · 源码核查**：[src/session-move.ts:192-228](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/session-move.ts#L192-L228)

运行检查和尽力释放。

<details>
<summary>查看原文（37行）</summary>

```text
	const isExecuting = liveSession?.running === true ||
		liveSession?.status === "running" ||
		liveSession?.status === "ongoing" ||
		agent?.busy === true ||
		agent?.status === "running";

	if (isExecuting) {
		throw new Error("该会话正处于执行或运行状态，请等待完成后再移动。");
	}

	// 若处于打开空闲态，先刷新缓冲并安全释放原有 entry，释放写所有权
	let originalEntry: { detach?(): void } | undefined;
	if (liveSession !== undefined) {
		if (typeof agent?.cancel === "function") {
			try {
				agent.cancel({ kind: "disposed" });
				await agent.whenIdle?.();
			} catch {}
		}
		if (typeof ctx.sessions?.flush === "function") {
			try {
				await ctx.sessions.flush(liveSession);
			} catch {}
		}
		try {
			await agent?.scope?.dispose?.();
			ctx.agents?.store?.delete(cleanSessionId);
		} catch {}

		originalEntry = ctx.sessions?.store?.get?.(cleanSessionId)
			?? (typeof (ctx.sessions as unknown as { liveEntryFor?: (s: unknown) => unknown })?.liveEntryFor === "function" ? (() => {
				try { return (ctx.sessions as unknown as { liveEntryFor: (s: unknown) => unknown }).liveEntryFor(liveSession) as { detach?(): void }; } catch { return undefined; }
			})() : undefined);
		if (typeof originalEntry?.detach === "function") {
			try {
				originalEntry.detach();
			} catch {}
```

</details>

**依据 5 · 源码核查**：[src/session-move.ts:335-372](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/session-move.ts#L335-L372)

备份与暂存落盘。

<details>
<summary>查看原文（38行）</summary>

```text

	const persistenceRoot = persistence.root ?? persistence.config?.root;
	const backupRoot = persistenceRoot
		? join(dirname(resolve(persistenceRoot)), "dsham-move-backup")
		: join(dirname(sourceSessionDir), ".dsham-move-backup");
	await mkdir(backupRoot, { recursive: true });
	const safeSessionName = encodeURIComponent(cleanSessionId).replace(/%/g, "~");
	const backupDir = join(backupRoot, `${safeSessionName}-${process.pid}-${Date.now()}`);

	const isZstd = sourceLogPath.endsWith(".zstd");
	const sourceBytes = await readFile(sourceLogPath);
	const newBytes = rewriteSessionArtifactCwd(sourceBytes, targetPath, isZstd);

	// 验证改写后的新数据第一行是否正确
	if (isZstd) {
		const f0 = zlib.zstdDecompressSync(newBytes);
		const f0Obj = JSON.parse(f0.toString("utf8").split("\n")[0]);
		if (f0Obj.id !== cleanSessionId || f0Obj.cwd !== targetPath) {
			throw new Error("迁移前校验失败：数据改写验证未通过。");
		}
	}

	// 事务执行：移开源目录到备份区 -> 写入目标 -> 校验 -> 切换记账
	const detachedWorkspaces: WorkspaceEntityLike[] = [];
	let targetAttached = false;
	let stageFile: string | null = null;
	let sourceDirMoved = false;

	try {
		// a. 移开源目录
		await rename(sourceSessionDir, backupDir);
		sourceDirMoved = true;

		// b. 创建目标目录并原子落盘
		await mkdir(targetSessionDir, { recursive: true });
		stageFile = join(targetSessionDir, `.stage-${process.pid}-${Date.now()}`);
		await writeFile(stageFile, newBytes);
		await rename(stageFile, targetLogPath);
```

</details>

**依据 6 · 源码核查**：[src/session-move.ts:427-465](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/session-move.ts#L427-L465)

失败恢复及成功删除备份。

<details>
<summary>查看原文（39行）</summary>

```text
	} catch (error) {
		// 回滚内存映射
		if (header) {
			registry.headers?.set(cleanSessionId, header);
			if (header.cwd) registry.sessionPaths?.set(cleanSessionId, header.cwd);
		}
		if (liveSession !== undefined && header) {
			try {
				if ("header" in liveSession && (liveSession as unknown as { header?: { cwd?: string } }).header) {
					(liveSession as unknown as { header: { cwd?: string } }).header.cwd = header.cwd;
				}
				if ("cwd" in liveSession && header.cwd) {
					(liveSession as unknown as { cwd?: string }).cwd = header.cwd;
				}
			} catch {}
		}

		// 回滚链路
		if (stageFile) await rm(stageFile, { force: true }).catch(() => {});
		await rm(targetSessionDir, { recursive: true, force: true }).catch(() => {});
		if (sourceDirMoved) {
			try {
				await mkdir(dirname(sourceSessionDir), { recursive: true });
				await rename(backupDir, sourceSessionDir);
			} catch (restoreErr) {
				throw new AggregateError([error, restoreErr], `移动失败且原工件回滚异常，备份暂存于: ${backupDir}`);
			}
		}
		if (targetAttached) {
			await targetWorkspace.detachSession(cleanSessionId).catch(() => {});
		}
		for (const ws of detachedWorkspaces) {
			await ws.attachSession(cleanSessionId).catch(() => {});
		}
		throw error;
	}

	// 成功后清理备份目录
	await rm(backupDir, { recursive: true, force: true }).catch(() => {});
```

</details>

#### 缺口

- 未进行中断和并发故障试验
  **影响**：不能保证全局事务或永久恢复
  **进一步探讨**：隔离副本测试 flush 失败、中断和独立备份还原。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖、使用负担及停止条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-18、45-66 声明宿主、Node 和 session、persistence、projection 与客户端相关依赖；workspace.ts:519-531 对所需服务做注入。首次需核对 profile、宿主版本并建立独立会话数据副本；持续查询要读取日志与人工筛选；删除或移动失败需核查文件、子项、spill、投影与 workspace 记账。建议匹配宿主且已有独立备份的用户先对副本试检索、收藏及归档恢复；永久删除和跨工作区移动必须另做逐对象验证。若失败或状态不明，停止重复操作并检查备份及实际对象。空间、人工和性能未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/package.json#L1-L18)

包及运行范围。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@michengai/dsh-archive-manager",
  "version": "1.1.22",
  "description": "归档、恢复、收藏和永久删除会话，并诊断损坏的会话日志。 · Archive, restore, favorite, and permanently delete sessions, and diagnose damaged session logs.",
  "type": "module",
  "packageManager": "pnpm@11.22.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./workspace": "./lib/workspace.js",
    "./projcache": "./lib/projcache.js",
    "./host": "./lib/host-install.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
```

</details>

**依据 2 · 源码核查**：[package.json:45-66](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/package.json#L45-L66)

宿主 peer 依赖。

<details>
<summary>查看原文（22行）</summary>

```text
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1 <5.0.0",
    "@deepseek-ai/dsh-client-connection": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-sidebar": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-workspace": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-session": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-session-format-catalog": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-session-projection-cache": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-spill-local": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-storage-domain": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-typert-registry": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-workspace": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-session-format-catalog": {
      "optional": true
```

</details>

**依据 3 · 源码核查**：[src/workspace.ts:519-531](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L519-L531)

宿主服务注入。

<details>
<summary>查看原文（13行）</summary>

```text
	static inject = [
		"storageDomain",
		"sessionPersistence",
		"sessionProjectionCache",
		"typert",
	];
	declare typertRemote: TypertGatewayBinding<this>;
	declare favoriteDomainPromise: Promise<Domain<typeof favoriteDomainSpec>> | undefined;
	constructor(ctx: Context) {
		super(ctx);
		this.typertRemote = bindTypertRemote(this, this.name);
		for (const method of ARCHIVE_REMOTE_METHODS) markRemoteMethod(this, method);
		registerHostRemote(this.ctx);
```

</details>

**依据 4 · 源码核查**：[src/session-move.ts:427-465](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/session-move.ts#L427-L465)

移动回滚与备份边界。

<details>
<summary>查看原文（39行）</summary>

```text
	} catch (error) {
		// 回滚内存映射
		if (header) {
			registry.headers?.set(cleanSessionId, header);
			if (header.cwd) registry.sessionPaths?.set(cleanSessionId, header.cwd);
		}
		if (liveSession !== undefined && header) {
			try {
				if ("header" in liveSession && (liveSession as unknown as { header?: { cwd?: string } }).header) {
					(liveSession as unknown as { header: { cwd?: string } }).header.cwd = header.cwd;
				}
				if ("cwd" in liveSession && header.cwd) {
					(liveSession as unknown as { cwd?: string }).cwd = header.cwd;
				}
			} catch {}
		}

		// 回滚链路
		if (stageFile) await rm(stageFile, { force: true }).catch(() => {});
		await rm(targetSessionDir, { recursive: true, force: true }).catch(() => {});
		if (sourceDirMoved) {
			try {
				await mkdir(dirname(sourceSessionDir), { recursive: true });
				await rename(backupDir, sourceSessionDir);
			} catch (restoreErr) {
				throw new AggregateError([error, restoreErr], `移动失败且原工件回滚异常，备份暂存于: ${backupDir}`);
			}
		}
		if (targetAttached) {
			await targetWorkspace.detachSession(cleanSessionId).catch(() => {});
		}
		for (const ws of detachedWorkspaces) {
			await ws.attachSession(cleanSessionId).catch(() => {});
		}
		throw error;
	}

	// 成功后清理备份目录
	await rm(backupDir, { recursive: true, force: true }).catch(() => {});
```

</details>

#### 缺口

- 空间、耗时和失败恢复未经测量
  **影响**：不能推断总成本或成熟度
  **进一步探讨**：在独立数据副本中测只读和恢复，再单独核实物理操作。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 对象级清理收据能否降低误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

根据 Q03 中父级成功可掩盖子项失败，可提出未验证假设：返回逐个父会话、子代理、spill、投影及记账对象的清理结果，并在独立重扫后明确“已确认／未确认／失败”，可能减少把父项成功误认为完全删除。相对现有父目标级结果会增加扫描和用户复核成本；在隔离副本故意制造子对象失败，比较现有返回与对象级收据的残留识别、耗时及误报；若独立重扫不能可靠覆盖宿主存储或负担超过收益则不推广。该方案尚未实现或验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:814-843](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L814-L843)

父目标级结果。

<details>
<summary>查看原文（30行）</summary>

```text
	async deleteArchivedSessions(target: unknown) {
		return this.enqueueOperation(async () => {
			const requestedSessionIds = this.archivedSessionIdsForTarget(target);
			const deletedSessionIds = [];
			const skippedSessionIds = [];
			const failures = [];
			// 只给本批级联枚举复用，避免每个目标重复读取存储列表。
			let descendantHeaders: Header[] | undefined;
			try {
				descendantHeaders = await this.listStoredHeaders();
			} catch (error) {
				this.ctx.logger.warn(
					`archive-manager: batch descendant listing failed; each cascade will retry: ${String(error)}`,
				);
			}
			for (const sessionId of requestedSessionIds) {
				try {
					const result = await this.deleteSessionCore(sessionId, descendantHeaders);
					if (result?.skipped) skippedSessionIds.push(sessionId);
					else deletedSessionIds.push(sessionId);
				} catch (error) {
					failures.push({ sessionId, message: deletionFailureMessage(error) });
				}
			}
			return {
				requestedSessionIds,
				deletedSessionIds,
				skippedSessionIds,
				failures,
			};
```

</details>

**依据 2 · 源码核查**：[src/workspace.ts:1109-1122](https://github.com/MichengAI/dsh-archive-manager/blob/866fd95c157a6c943e697d58f589826a6cbf97e0/src/workspace.ts#L1109-L1122)

子项失败不传播。

<details>
<summary>查看原文（14行）</summary>

```text
			for (const childId of descendants) {
				try {
					if (!(await this.sessionKnown(childId))) continue;
					await this.deleteSessionCore(childId, storedHeaders);
				} catch (error) {
					this.ctx.logger.warn(
						`archive-manager: cascade delete of subagent session "${childId}" (child of "${sessionId}") failed: ${String(error)}`,
					);
				}
			}
		} catch (error) {
			this.ctx.logger.warn(
				`archive-manager: descendant enumeration for deleted session "${sessionId}" failed: ${String(error)}`,
			);
```

</details>

#### 缺口

- 没有原型和对照实验
  **影响**：不能证明改进效果
  **进一步探讨**：对照现有结果和对象级重扫测残留识别及人工时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
