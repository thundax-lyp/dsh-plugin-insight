# DSH Archive Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2fbf0f6](https://github.com/MichengAI/dsh-archive-manager/tree/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7)

<!-- BEGIN META -->
[![GitHub ★ 328](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=328&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-archive-manager) [![npm 30d 113,080](https://img.shields.io/static/v1?label=npm+30d&message=113%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供会话归档、恢复、检索、冷会话缓存重建及物理清理管理界面。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将冷会话列表诊断与官方投影回读纳入同一管理入口，逐项报告跳过、失败与已确认成功。

> **主要限制**：[Q03](#research-q03) 缓存回读超时仍可能有迟到写入，真实删除顺序依赖宿主域写入契约。

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
  - [Q01 · 列表缓存修复针对什么问题？](#detail-section-11)
  - [Q02 · 如何避免把已排队写入当作完成？](#detail-section-12)
  - [Q03 · 超时后再删除会话有什么边界？](#detail-section-13)
  - [Q04 · 怎样先验证修复而不扩大清理范围？](#detail-section-14)
  - [Q05 · 持久化结果回执能否减少重复修复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：冷会话缺失列表标题时，管理者可以先诊断和重建官方投影，再核对原日志。

逐一打开会话或手工核对持久化日志，原日志仍是恢复和内容核验依据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 缓存诊断 | 查找缺标题投影的普通冷会话 | 排除活动、IM 和子代理 |
| 缓存重建 | 重放只读日志到官方缓存 | 依赖宿主投影，超时仍可能完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和官方缓存接口 | 必需 | 诊断与回读 | 接口缺失时停止 |
| 会话备份 | 试用前必需 | 核验恢复 | 先建立可恢复副本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份并创建合成冷会话 | 副本可恢复 |
| 修复 | 用户诊断并逐项重建 | 官方列表与日志一致 |
| 恢复 | 用户保留超时条目并回读 | 不明状态时暂停清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 备份存储 | 宿主契约核对 | 耗时未知 |
| 持续 | 缓存和日志读取 | 检查投影结果 | 净节时未知 |
| 失败 | 保留备份和失败记录 | 回读或恢复 | 迟到写入等待未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 冷列表修复 | 逐项只读重建并回读 | 真实宿主完成率 |
| 失败辨认 | 超时保留未确认语义 | 断连后最终结果查询 |

> **思考**：[Q03](#research-q03) 缓存回读超时仍可能有迟到写入，真实删除顺序依赖宿主域写入契约。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将冷会话列表诊断与官方投影回读纳入同一管理入口，逐项报告跳过、失败与已确认成功。

[Q02](#research-q02) 在读取前后核对身份，finally 关闭只读句柄。[Q03](#research-q03) 删除顺序保留物理失败时的记账线索。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 缓存回读超时仍可能有迟到写入，真实删除顺序依赖宿主域写入契约。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 优先验证合成冷会话的列表修复，超时先读回并暂停清理。保留持久化数据备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定重建、回读和删除顺序源码。宿主实际队列契约与恢复行为未验收。

- 已检查：作者 README、包清单、源码路径 src/workspace.ts、src/cache-rebuild.ts、README.zh-CN.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查官方列表缓存重建与删除生命周期。未全面审计检索、移动、所有远程接口或宿主实现。
- 下一步：在备份宿主延迟缓存保存，核对超时、关闭页面、迟到完成和后续清理的实际顺序。

**分析版本**

- **仓库**：[MichengAI/dsh-archive-manager](https://github.com/MichengAI/dsh-archive-manager)
- **版本号**：1.3.1（[固定提交 2fbf0f6](https://github.com/MichengAI/dsh-archive-manager/tree/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 持久化操作回执可能帮助断连后识别迟到完成，需检验它与官方存储的一致性。

在备份宿主延迟缓存保存，核对超时、关闭页面、迟到完成和后续清理的实际顺序。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 3575 | — | — | 56151 |
| .js | source | 18 | 3208 | 3133 | 89 | — |
| .mjs | source | 8 | 627 | 558 | 28 | — |
| .ts | source | 28 | 10674 | 9711 | 606 | — |
| .mjs | test | 42 | 10001 | 8913 | 365 | — |
| .mjs | example | 4 | 627 | 589 | 23 | — |
| .ts | test | 1 | 30 | 19 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MichengAI/dsh-archive-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=66&color=737b86&logo=github)](https://github.com/MichengAI/dsh-archive-manager/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：近30天关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：大量冷会话缺失列表投影时，操作者能否先修复可发现性并区分结果未知与完成？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 列表缓存修复针对什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

会话积累后，用户可能遇到冷会话没有可用标题投影，难以在归档与未归档列表中找回内容。插件把诊断与逐项重建入口放在会话管理流程中。旧办法是逐一打开或手工排查原日志；合格结果是官方列表能呈现与原日志一致的标题，且会话未被激活。永久删除是另一项高影响操作，不应用来替代缓存修复。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:48-52](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/README.zh-CN.md#L48-L52)

作者描述轻量诊断、完整日志只读重建与超时。

```text
## 手动重建列表缓存（#88）

打开归档管理后，仅从头部及官方缓存轻量检测登记工作区、未分组及归档中的普通冷会话（前置排除 IM 渠道特殊会话）。官方缓存缺失、生命周期或格式不兼容、或标题投影不可用时，整理区域显示「重建列表缓存」卡片；没有候选就不显示。

点击后逐条只读完整日志，调用官方 `coldSnapshot` 重建全部已注册投影，并保存至官方 `session_projcache`。不扫描旧插件域、不搬运 JSON、不激活会话/Agent、不调用模型，也不改变归档和定时任务。活动会话跳过，失败项可单独重试；操作反馈提供「完成」按钮并支持自动收起；完成后刷新官方列表并重新检测。保存确认超时表示结果未知，不代表已取消；删除操作仍与迟到写入安全排队。关闭页面只停止后续请求，已发送的那一条会在服务端完成。
```

**依据 2 · 源码核查**：[src/workspace.ts:737-754](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L737-L754)

诊断依据头部与标题投影。

<details>
<summary>查看原文（18行）</summary>

```text
	/** 检测仅读取头部与官方缓存，不读取会话正文。 */
	usableSessionListCache(header: Header) {
		const snapshot = this.ctx.get("sessionProjectionCache")?.cachedSnapshot(header);
		return snapshot !== undefined && Object.hasOwn(snapshot.values, "title");
	}
	async diagnoseSessionCaches(): Promise<CacheDiagnosis> {
		const cache = this.ctx.get("sessionProjectionCache");
		if (!cache) throw new Error("Official session projection cache is unavailable");
		const items = [];
		const headers = (this as unknown as { headers?: Map<string, Header> }).headers?.size
			? Array.from((this as unknown as { headers: Map<string, Header> }).headers.values())
			: await this.listStoredHeaders();
		for (const header of headers) {
			if (await this.cacheRebuildEligible(header) && !this.usableSessionListCache(header)) {
				items.push({ sessionId: header.id, identity: cacheIdentity(header) });
			}
		}
		return { count: items.length, items };
```

</details>

#### 缺口

- 真实冷会话库的缺失频率和人工查找时间未知。
  **影响**：无法量化修复入口的净收益。
  **进一步探讨**：在备份会话库比对缺投影会话的查找和重建时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何避免把已排队写入当作完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

诊断先排除子代理、IM 和已加载或活动中的会话。重建逐项进入工作区操作队列，读持久头部，核对身份及资格，只读打开日志并在 finally 关闭。重读头部后调用 coldSnapshot，再轮询 cachedSnapshot 与预期深比较，相符才加入成功列表。客户端接到成功可以据此知道插件观察到匹配的官方缓存，但这仍依赖宿主缓存契约。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:732-740](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L732-L740)

排除活动会话并检查标题投影。

```text
	async cacheRebuildEligible(header: Header) {
		if (header.origin !== undefined || header.id.startsWith("im:") || this.ctx.get("sessions")?.get(header.id) !== undefined) return false;
		const activity = await this.ctx.waterfall("workspace/session-activity", { sessionId: header.id as never }, () => Promise.resolve([]));
		return activity.length === 0 && this.ctx.get("sessions")?.get(header.id) === undefined;
	}
	/** 检测仅读取头部与官方缓存，不读取会话正文。 */
	usableSessionListCache(header: Header) {
		const snapshot = this.ctx.get("sessionProjectionCache")?.cachedSnapshot(header);
		return snapshot !== undefined && Object.hasOwn(snapshot.values, "title");
```

**依据 2 · 源码核查**：[src/workspace.ts:765-803](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L765-L803)

队列、双重身份核查和只读句柄关闭。

<details>
<summary>查看原文（39行）</summary>

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
			});
		}
		return result;
	}
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

**依据 3 · 源码核查**：[src/cache-rebuild.ts:14-26](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/cache-rebuild.ts#L14-L26)

深比较回读，否则报未确认。

<details>
<summary>查看原文（13行）</summary>

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时后再删除会话有什么边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

回读轮询耗尽会报错，coldSnapshot 排队的写入仍可能稍后完成。删除也进入同一个工作区队列，执行时会先处理活会话、投影和子代理，再删物理日志，最后移除归档记账。这个顺序保留物理删除失败后的重试线索。源码注释要求官方域写入链覆盖迟到写入，本研究没有加载宿主确认这项约定，不能仅据本地队列声称跨宿主所有写入均被串行化。

#### 证据与依据

**依据 1 · 源码核查**：[src/cache-rebuild.ts:9-26](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/cache-rebuild.ts#L9-L26)

超时没有取消排队保存。

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

**依据 2 · 源码核查**：[src/workspace.ts:765-787](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L765-L787)

回读失败按单项失败保留。

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

**依据 3 · 源码核查**：[src/workspace.ts:893-948](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L893-L948)

删除串行化且物理删除早于归档记账清除。

<details>
<summary>查看原文（56行）</summary>

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
		}
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
			});
		}
		await this.removeFromWorkspaceAccounts(sessionId);
```

</details>

#### 缺口

- 未验证宿主官方域写入链与插件队列的共同顺序。
  **影响**：迟到写入后删除的真实安全性待验证。
  **进一步探讨**：在备份库延迟缓存持久化，触发超时后排队删除，核对磁盘与官方缓存。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样先验证修复而不扩大清理范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

能备份持久化会话的 DSH 管理者，可先用一次性配置里的少量合成冷会话测试诊断与重建。宿主需要 sessionPersistence、官方投影缓存和工作区生命周期接口。先核对标题、内容和活动状态，再决定是否把该环境用于普通归档管理。超时先保留会话和失败条目、读回官方列表；状态仍不明时暂停清理并恢复备份。首次备份和宿主契约核对、持续列表复核与失败读回都需要人工。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:743-750](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L743-L750)

缺少官方缓存时拒绝诊断。

```text
		const cache = this.ctx.get("sessionProjectionCache");
		if (!cache) throw new Error("Official session projection cache is unavailable");
		const items = [];
		const headers = (this as unknown as { headers?: Map<string, Header> }).headers?.size
			? Array.from((this as unknown as { headers: Map<string, Header> }).headers.values())
			: await this.listStoredHeaders();
		for (const header of headers) {
			if (await this.cacheRebuildEligible(header) && !this.usableSessionListCache(header)) {
```

**依据 2 · 源码核查**：[src/workspace.ts:792-803](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L792-L803)

只读持久化访问仍依赖宿主。

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

**依据 3 · 作者声明**：[README.zh-CN.md:50-52](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/README.zh-CN.md#L50-L52)

作者明确关闭页面与已发送服务端工作的区别。

```text
打开归档管理后，仅从头部及官方缓存轻量检测登记工作区、未分组及归档中的普通冷会话（前置排除 IM 渠道特殊会话）。官方缓存缺失、生命周期或格式不兼容、或标题投影不可用时，整理区域显示「重建列表缓存」卡片；没有候选就不显示。

点击后逐条只读完整日志，调用官方 `coldSnapshot` 重建全部已注册投影，并保存至官方 `session_projcache`。不扫描旧插件域、不搬运 JSON、不激活会话/Agent、不调用模型，也不改变归档和定时任务。活动会话跳过，失败项可单独重试；操作反馈提供「完成」按钮并支持自动收起；完成后刷新官方列表并重新检测。保存确认超时表示结果未知，不代表已取消；删除操作仍与迟到写入安全排队。关闭页面只停止后续请求，已发送的那一条会在服务端完成。
```

#### 缺口

- 固定宿主加载及备份恢复用时未测。
  **影响**：批量操作的总维护成本未知。
  **进一步探讨**：先测三个合成冷会话，记录正常、活动跳过和延迟失败后的恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久化结果回执能否减少重复修复？

**研究主题**：新假设与验证

#### 完整回答

可试验给重建操作绑定会话身份、预期投影摘要和操作 ID，保存成功或未知的最终回执，供客户端重连后查询。现有逐项回读能发现当次匹配，但超时后用户仍需主动核对。用延迟持久化、页面关闭和重新连接比较重复请求次数及错误显示。如果回执与官方存储不能一起可靠更新，或仍需同样人工核对而新增大量状态，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/cache-rebuild.ts:21-26](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/cache-rebuild.ts#L21-L26)

当前回读超时返回未确认。

```text
  const expected = cache.coldSnapshot(source.meta, source.inheritedEventCount, source.events);
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (isDeepStrictEqual(cache.cachedSnapshot(source.meta), expected)) return expected;
    await wait();
  }
  throw new Error("Official cache persistence could not be confirmed; retry is safe only after lifecycle revalidation.");
```

**依据 2 · 源码核查**：[src/workspace.ts:785-790](https://github.com/MichengAI/dsh-archive-manager/blob/2fbf0f627bd5296d178ad0e7aae938ce297b9ac7/src/workspace.ts#L785-L790)

完成和失败分别记录在当前调用结果。

```text
					await confirmColdCacheWrite(cache, source);
					result.rebuiltSessionIds.push(item.sessionId);
				} catch (error) { result.failures.push({ sessionId: item.sessionId, message: (error instanceof Error ? error.message : String(error)).slice(0, 500) }); }
			});
		}
		return result;
```

#### 缺口

- 回执方案没有实现。
  **影响**：重复修复减少量未知。
  **进一步探讨**：在隔离宿主中做延迟与断连对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
