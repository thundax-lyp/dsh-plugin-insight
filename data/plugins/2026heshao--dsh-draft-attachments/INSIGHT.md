# dsh-draft-attachments

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f285e67](https://github.com/2026heshao/dsh-draft-attachments/tree/f285e67bab926ee3083ee7b3858aa28a6092ec8a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)
<!-- END META -->

> **实现功能**：把DSH输入框未发送的图片和文件保存到IndexedDB，在会话输入区重新挂载时恢复附件。

> **核心亮点**：用会话级slot观察输入并经官方附件intake恢复，减少切页后手工重选且不patch官方函数；持久化技术本身成熟，收益依赖正确保存时序。详见[Q02](#research-q02)。

> **风险与缺陷**：核心持久化缺少提交序号和明确失败状态，旧异步捕获可能覆盖新删除；单会话120MB常量未执行，超限单附件还可能使整集合不更新。均为源码条件风险，未复现。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要未发送附件恢复，数据如何从输入框持久化？](#detail-section-11)
  - [Q02 · 相对手工重选的增量是什么，保存承诺有哪些关键缺陷？](#detail-section-12)
  - [Q03 · 启动、隐私和退出分别依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复的成本和效果怎样计量？](#detail-section-14)
  - [Q05 · 哪些设计可借鉴，可信保存收据如何检验？](#detail-section-15)
  - [Q06 · 当前是否值得试用，什么情况必须停止依赖？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助切页或重启前已选择附件的用户减少手工重选，合格结果需正确恢复且不复活已发送内容。

原流程为附件只留内存，切页后手工从原文件重选。浏览器持久层可补缺口，但需对集合更新、发送清理和数据退出给出一致性保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 草稿附件捕获 | 保存File/Blob字节与元数据 | 单附件30MB，合计上限未执行 |
| 挂载恢复 | 经官方intake重建附件和缩略图 | 输入为空、服务可用、浏览器存储正常 |
| 空集合清理 | 同步发送/删除后的集合 | 异步提交顺序与失败状态存在缺口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH客户端React/slot/会话输入kit | 启动必需 | 挂不可见哨兵和读取附件状态 | 失配可能不挂载或无功能 |
| conversation createDrafts/resolve/release | 恢复/捕获必需 | 复用官方附件生命周期 | 未就绪跳过，未保证自动重试 |
| IndexedDB与配额 | 持久化必需 | 保存二进制与元数据 | 失败可能静默失去保护 |
| 受信浏览器origin/本地数据策略 | 隐私条件 | 控制未发送原始附件留存 | 禁用包不自动删除数据库 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认允许保存未发送文件，使用非敏感样本 | 明确origin、配额和清理责任 |
| 加载 | 在所需profile装固定包并重启 | 选取附件后的DB记录可核对 |
| 恢复 | 切页/重开后核对集合和发送状态 | 不把缩略图出现当上传成功 |
| 退出 | 移除包并按需清除IndexedDB库 | 核对原始附件数据确实清除 |

同源页面脚本可访问浏览器存储，本实现未额外加密或TTL清理。作者“卸载无残留”与后文需DevTools清库并不等价，需由读者承担数据退出动作。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装与浏览器存储，金额未知 | 兼容、数据留存与恢复样本核对 | 作者兼容测试未独立复核 |
| 持续使用 | 二进制拷贝、IndexedDB容量和可能重上传 | 观察附件集合是否准确 | 实际峰值内存、配额和上传次数未知 |
| 失败恢复 | 重选/重上传与数据库清理 | 识别丢失或旧附件，手工复核发送状态 | 缺少可见事务失败状态，排障负担未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨挂载保存 | IndexedDB存取与官方恢复链存在 | 各种切页/关闭/发送时序的成功率 |
| 发送后清除 | 空集合删除机制存在 | 异步旧写是否覆盖删除 |
| 限制资源 | 单附件30MB检查存在 | 声明120MB合计上限没有执行，真实资源占用未知 |

不能从没有模型调用得出总成本为零。应把误恢复、失败重传和人工核对算入完整任务成本。

> **思考**：核心持久化缺少提交序号和明确失败状态，旧异步捕获可能覆盖新删除；单会话120MB常量未执行，超限单附件还可能使整集合不更新。均为源码条件风险，未复现。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用会话级slot观察输入并经官方附件intake恢复，减少切页后手工重选且不patch官方函数；持久化技术本身成熟，收益依赖正确保存时序。详见[Q02](#research-q02)。

用会话级slot观察输入并经官方附件intake恢复，减少切页后手工重选且不patch官方函数；持久化技术本身成熟，收益依赖正确保存时序。详见[Q02](#research-q02)。

可借鉴的是不改官方函数而通过会话级slot观察输入，恢复调用官方intake，拒绝回填时释放新草稿，并在异步读回后重新检查当前输入避免直接覆盖用户新选择。这些减少宿主patch耦合，但仍依赖公开服务和slot的版本契约。存储封装把失败吞掉、捕获没有串行与代际所有权，使简洁实现付出可诊断性和一致性代价。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心持久化缺少提交序号和明确失败状态，旧异步捕获可能覆盖新删除；单会话120MB常量未执行，超限单附件还可能使整集合不更新。均为源码条件风险，未复现。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，暂不把它当日常附件保护。愿意继续核查的读者可用非敏感且可重选的集合检查发送、切页和关闭时序，并明确清除IndexedDB的方式。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的官方附件通道与IndexedDB集成；可靠保存和不复活承诺存在关键静态缺口。版本化保存收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定README、包声明和完整浏览器/宿主入口；未执行目标代码、安装或宿主冒烟，时序问题仅静态分析。
- 下一步：进一步探讨可从可控延迟Blob、发送后立即切页、双标签和配额失败样本入手，核对数据库最终集合、恢复附件及失败状态。

**分析版本**

- **仓库**：[2026heshao/dsh-draft-attachments](https://github.com/2026heshao/dsh-draft-attachments)
- **版本号**：1.0.1（[固定提交 f285e67](https://github.com/2026heshao/dsh-draft-attachments/tree/f285e67bab926ee3083ee7b3858aa28a6092ec8a)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨每会话版本化保存收据，以generation、串行提交、明确状态与实际字节预算约束保存，核对双标签及关闭页边界；尚未验证。详见[Q05](#research-q05)。

进一步探讨可从可控延迟Blob、发送后立即切页、双标签和配额失败样本入手，核对数据库最终集合、恢复附件及失败状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 314 | 223 | 79 | — |
| .md | source | 1 | 44 | — | — | 777 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments/issues?q=is%3Aissue+created%3A2026-09-22T04%3A53%3A10.788Z..2026-10-22T04%3A53%3A10.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A53%3A10.788Z..2026-10-22T04%3A53%3A10.788Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查未发送附件的IndexedDB保存与恢复是否可靠，以及隐私、资源和退出边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要未发送附件恢复，数据如何从输入框持久化？

**研究主题**：场景与需求、功能与机制

#### 完整回答

对象是已在DSH输入框选取图片/文件、尚未发送却要切页或重启的用户。相比文字草稿可恢复，重新选择附件会增加返工。合格结果应是同一会话按原顺序恢复未发送附件，已发送/删除附件不复活，存储失败可知且不会泄露到其他会话。作者称桌面与web都可用，本轮只据共同浏览器实现确认设计，不确认两个宿主实际表现。

浏览器bundle在conversation.input.dock注册不可见哨兵，读取useSession/useInput的sessionId与attachmentIds。捕获通过conversation.resolveDraftAttachments拿File/Blob，读为Uint8Array后按sessionId写IndexedDB；正常变化300ms去抖，cleanup触发即时捕获。挂载恢复读取记录，输入为空才走createDrafts重建File，再addAttachments回填。空集合删除记录，回填拒绝则释放刚建草稿。host入口apply为空，业务全部在浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-19](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/README.md#L3-L19)

作者场景与官方API集成主张。

<details>
<summary>查看原文（17行）</summary>

```text
DeepSeek Harness（DSH）插件：**把输入框的草稿图片/文件像文字草稿一样持久化**。桌面端与 Web 端通用（插件 UI 运行在两端同源的浏览器渲染层，行为一致）。

DSH 的已知行为：在 A 会话输入框上传了几张图片，中途点到其他页面再切回来，输入的文字还在，但上传的图片消失了。本插件修复这个问题——切换页面、切换会话、甚至重启 DSH 之后回到该会话，未发送的附件会自动恢复到输入框，缩略图原样重现。桌面端与 Web 端表现相同。

> **兼容性**：已在 DeepSeek Harness 44.7.0（宿主内置 `@deepseek-ai/dsh-typert-protocol@0.2.1-rc.2` / cordis 4.0.5）上全量测试通过；声明的 peer 范围 `>=0.1.5-rc.1` 继续覆盖，本版本无需代码改动。

## 原理

| | 文字草稿（官方） | 附件草稿（官方） | 附件草稿（本插件） |
|---|---|---|---|
| 存储 | localStorage（`dsh.conversation.<sessionId>`） | 仅内存（`draftAttachments` Map + `attachmentIds` 数组） | IndexedDB（字节 + 元数据，按会话记序） |
| 重挂载 | 自动 seed 回输入框 | 被 release（objectURL revoke + Map 删除）→ 丢失 | 读回 IndexedDB → 官方 `createDrafts` 通道重建 |

- **捕获**：插件在 `conversation.input.dock`（官方 list 型会话级插槽，hero/composer 两种输入区形态都渲染）挂一个不可见哨兵组件，订阅输入态的 `attachmentIds`，每次变化把草稿附件字节写入 IndexedDB（300ms 去抖；卸载/切换会话时立即冲刷）。
- **恢复**：输入区重新挂载时读回记录，走 `conversation.createDrafts(sessionId, files)`（与点输入框「添加附件」完全同一条官方通道）重建草稿，再经 `inputActions.addAttachments` 回填 → 官方缩略图 rail 原样显示。
- **清空同步**：发送成功或手动删除附件后 `attachmentIds` 变化，捕获写入同样集合（空集合 = 清除记录），**不会复活已发送的图片**。

```

</details>

**依据 2 · 源码核查**：[lib/client.js:147-175](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L147-L175)

哨兵依输入状态形成会话捕获。

<details>
<summary>查看原文（29行）</summary>

```text
		function DraftAttachmentsSentinel(props) {
			const { useEffect, useRef } = React;
			const session = props.useSession((s) => s);
			const input = props.useInput((s) => s);
			const sessionId = session?.sessionId;
			const attachmentIds = input?.attachmentIds;
			const conversationFace = props.conversationFace;

			/** 每挂载一份的持久状态（条目随会话代际重挂载而天然重置）。 */
			const stRef = useRef(null);
			if (stRef.current === null) {
				stRef.current = { timer: null, pendingIds: null, restored: false, lastSignature: "", cache: new Map() };
			}
			const st = stRef.current;
			/** 最新输入态快照（供恢复时判断，避免闭包旧值）。 */
			const liveInputRef = useRef(input);
			liveInputRef.current = input;

			/**
			 * 捕获：把当前有序附件写盘。immediate=true 跳过去抖与签名检查
			 * （卸载/切换会话时的冲刷路径）。
			 */
			const captureRef = useRef(null);
			captureRef.current = async (ids, immediate) => {
				if (sessionId === undefined || sessionId === null) return;
				const ordered = Array.isArray(ids) ? ids : [];
				const signature = ordered.join("\n");
				if (!immediate && signature === st.lastSignature) return;
				st.lastSignature = signature;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:218-249](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L218-L249)

仅输入为空恢复并走官方intake，拒绝时释放。

<details>
<summary>查看原文（32行）</summary>

```text
			// 恢复：挂载后读盘回填（仅当输入态当前没有附件；每会话代际一次）。
			useEffect(() => {
				if (sessionId === undefined || sessionId === null) return undefined;
				let cancelled = false;
				(async () => {
					try {
						if (st.restored) return;
						st.restored = true;
						const records = await loadDraft(sessionId);
						if (cancelled) return;
						if (records === null || records.length === 0) return;
						// 最新快照里已经有附件（时序竞争）→ 不重复注入。
						if ((liveInputRef.current?.attachmentIds?.length ?? 0) > 0) return;
						const conversation = conversationFace?.();
						const actions = props.inputActions;
						if (conversation === undefined || actions === undefined) {
							console.warn(`[${PLUGIN_ID}] 恢复跳过：conversation/inputActions 不可用`);
							return;
						}
						const files = [];
						for (const record of records) files.push(...recordToFiles(record));
						if (files.length === 0) return;
						// 官方 intake 通道：图片建 objectURL 预览，文件走后台上传。
						const drafts = conversation.createDrafts(sessionId, files);
						const ids = drafts.map((draft) => draft.id);
						if (ids.length === 0) return;
						if (!actions.addAttachments(ids)) {
							// 回填被拒（admission 锁定）→ 释放刚建的草稿，避免泄漏。
							for (const draft of drafts) {
								try { conversation.releaseDraftAttachment(draft.id); } catch { /* 忽略 */ }
							}
						}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1-6](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/index.js#L1-L6)

宿主半部无业务。

```text
//#region lib/index.js
/** Host half of the browser-only draft-attachment persistence plugin. */
/** No host-side behavior; the client half registers the persistence slot entry. */
function apply() {}
//#endregion
export { apply };
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对手工重选的增量是什么，保存承诺有哪些关键缺陷？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把官方内存草稿接到浏览器持久层，而不patch官方函数，避免每次切页手工重选；通过官方createDrafts恢复也复用既有预览/上传语义。这是明确的集成增量，不是新的存储或上传技术。

关键质疑是“不会复活已发送图片”和“单会话120MB上限”是否由实现保证。MAX_SESSION_TOTAL_BYTES只定义未在捕获路径累计使用，真正检查仅单附件30MB；文档合计上限没有执行。捕获遇任一不支持/超限附件时，records.length与ordered.length不等便跳过整次save，而不是只保存其余集合，也没有清理旧记录。异步run没有每会话写入序号或串行队列，旧集合在await arrayBuffer后可能晚于删除集合落盘，使旧记录覆盖更新。cleanup调用run也未await，不能保证浏览器被终止前事务完成。均为源码条件判断，未运行复现。

数据库打开失败/null被dbPromise缓存，本挂载期可能不再重试；事务error/abort仍resolve且不返回失败，缺少保存状态。lastSignature在实际保存前更新，失败后同一附件集合可能不再重试。故“最坏只是退化”不应扩写成可靠持久化保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:48-73](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L48-L73)

定义两个上限但openDb失败被promise缓存。

<details>
<summary>查看原文（26行）</summary>

```text
		const DB_NAME = "dsh-draft-attachments";
		const STORE = "drafts";
		/** 体积护栏：单个附件与单会话合计上限（与官方图片上限同量级）。 */
		const MAX_ATTACHMENT_BYTES = 30 * 1024 * 1024;
		const MAX_SESSION_TOTAL_BYTES = 120 * 1024 * 1024;

		let dbPromise = null;
		/** 打开（或创建）持久化库；失败返回 null（调用方退化为 no-op）。 */
		function openDb() {
			if (typeof indexedDB === "undefined") return Promise.resolve(null);
			if (dbPromise !== null) return dbPromise;
			dbPromise = new Promise((resolve) => {
				try {
					const request = indexedDB.open(DB_NAME, 1);
					request.onupgradeneeded = () => {
						const db = request.result;
						if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
					};
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => resolve(null);
					request.onblocked = () => resolve(null);
				} catch {
					resolve(null);
				}
			});
			return dbPromise;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:90-106](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L90-L106)

事务错误也静默resolve，无可观察成功/失败收据。

<details>
<summary>查看原文（17行）</summary>

```text
		/** 写一个会话的草稿附件记录（空数组 = 清除该会话记录）。 */
		async function saveDraft(sessionId, records) {
			const db = await openDb();
			if (db === null) return;
			await new Promise((resolve) => {
				try {
					const tx = db.transaction(STORE, "readwrite");
					const store = tx.objectStore(STORE);
					if (records.length === 0) store.delete(sessionId);
					else store.put(records, sessionId);
					tx.oncomplete = () => resolve();
					tx.onerror = () => resolve();
					tx.onabort = () => resolve();
				} catch {
					resolve();
				}
			});
```

</details>

**依据 3 · 源码核查**：[lib/client.js:110-120](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L110-L120)

只执行单附件大小检查。

<details>
<summary>查看原文（11行）</summary>

```text
		/** 把一个草稿附件序列化成可存记录（超限/异常返回 undefined）。 */
		async function captureOne(attachment) {
			const file = attachment?.file;
			if (!(file instanceof Blob)) return undefined;
			if (file.size > MAX_ATTACHMENT_BYTES) return undefined;
			return {
				name: file.name || "image",
				type: file.type || "application/octet-stream",
				size: file.size,
				bytes: new Uint8Array(await file.arrayBuffer())
			};
```

</details>

**依据 4 · 源码核查**：[lib/client.js:170-215](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L170-L215)

异步捕获无序号，全集合匹配才写，签名提前记录。

<details>
<summary>查看原文（46行）</summary>

```text
			captureRef.current = async (ids, immediate) => {
				if (sessionId === undefined || sessionId === null) return;
				const ordered = Array.isArray(ids) ? ids : [];
				const signature = ordered.join("\n");
				if (!immediate && signature === st.lastSignature) return;
				st.lastSignature = signature;
				// 淘汰已消失 id 的字节缓存。
				for (const id of [...st.cache.keys()]) {
					if (!ordered.includes(id)) st.cache.delete(id);
				}
				if (st.timer !== null) {
					clearTimeout(st.timer);
					st.timer = null;
				}
				const run = async () => {
					st.timer = null;
					try {
						if (ordered.length === 0) {
							await saveDraft(sessionId, []);
							return;
						}
						const conversation = conversationFace?.();
						const resolveFace = conversation?.resolveDraftAttachments?.bind(conversation);
						if (typeof resolveFace !== "function") return;
						const attachments = resolveFace(ordered);
						// 数量不一致 → 有 id 已失效（正在释放），跳过本轮（等下一轮变化）。
						if (attachments.length !== ordered.length) return;
						for (let index = 0; index < ordered.length; index++) {
							if (st.cache.has(ordered[index])) continue;
							const record = await captureOne(attachments[index]);
							if (record !== undefined) st.cache.set(ordered[index], record);
						}
						const records = ordered
							.map((id) => st.cache.get(id))
							.filter((record) => record !== undefined);
						if (records.length === ordered.length) await saveDraft(sessionId, records);
					} catch (error) {
						console.warn(`[${PLUGIN_ID}] 捕获失败:`, error);
					}
				};
				if (immediate) {
					run();
					return;
				}
				st.pendingIds = ordered;
				st.timer = setTimeout(run, 300);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:260-273](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L260-L273)

cleanup即时发起但不等待异步持久化。

<details>
<summary>查看原文（14行）</summary>

```text
			// 捕获：attachmentIds 变化（增/删/发送清空）→ 去抖落盘；
			// 卸载或会话切换 → 立即冲刷未落盘的变化。
			useEffect(() => {
				if (sessionId === undefined || sessionId === null) return undefined;
				captureRef.current?.(attachmentIds ?? [], false);
				return () => {
					if (st.timer !== null) {
						clearTimeout(st.timer);
						st.timer = null;
						const pending = st.pendingIds;
						if (Array.isArray(pending)) captureRef.current?.(pending, true);
					}
				};
			}, [sessionId, attachmentIds]);
```

</details>

#### 缺口

- 旧捕获覆盖新删除、首次挂载空集合与恢复的时序未复现。
  **影响**：不能保证已发送/删除附件永不恢复，也不能保证跨重启保存。
  **进一步探讨**：可用可控延迟Blob、发送清空与立即关页样本，核对DB最终集合和恢复结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、隐私和退出分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖DSH客户端bundle、React、slots与conversation服务，以及standard kit提供useSession/useInput/inputActions。存储依赖当前浏览器origin的IndexedDB和足够配额，恢复依赖File/Blob及宿主官方intake可用；文件类恢复会再次上传，不能当单纯离线展示。package未声明README所说peer版本范围，不能把作者兼容说明当包管理器强制约束。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH客户端React/slot/会话输入kit | 启动必需 | 挂不可见哨兵和读取附件状态 | 失配可能不挂载或无功能 |
| conversation createDrafts/resolve/release | 恢复/捕获必需 | 复用官方附件生命周期 | 未就绪跳过，未保证自动重试 |
| IndexedDB与配额 | 持久化必需 | 保存二进制与元数据 | 失败可能静默失去保护 |
| 受信浏览器origin/本地数据策略 | 隐私条件 | 控制未发送原始附件留存 | 禁用包不自动删除数据库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认允许保存未发送文件，使用非敏感样本 | 明确origin、配额和清理责任 |
| 加载 | 在所需profile装固定包并重启 | 选取附件后的DB记录可核对 |
| 恢复 | 切页/重开后核对集合和发送状态 | 不把缩略图出现当上传成功 |
| 退出 | 移除包并按需清除IndexedDB库 | 核对原始附件数据确实清除 |

同源页面脚本可访问浏览器存储，本实现未额外加密或TTL清理。作者“卸载无残留”与后文需DevTools清库并不等价，需由读者承担数据退出动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:282-304](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L282-L304)

slot和conversation惰性服务依赖。

<details>
<summary>查看原文（23行）</summary>

```text
		async function apply(ctx) {
			/** 惰性解析 root 单例的 conversation 服务（scope-addressed face）。 */
			const conversationFace = () => {
				try {
					const service = typeof ctx.get === "function" ? ctx.get("conversation") : undefined;
					if (service !== undefined && typeof service.createDrafts === "function") return service;
				} catch { /* 服务未就绪 */ }
				return undefined;
			};
			ctx.slots.inject(DOCK_SLOT, () =>
				ctx.slots.register({
					name: DOCK_SLOT,
					id: DOCK_ID,
					order: DOCK_ORDER,
					inject: () => ({ conversationFace })
				}, DraftAttachmentsSentinel)
			);
		}

		const inject = ["slots"];

		exports.apply = apply;
		exports.inject = inject;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:61-68](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L61-L68)

数据库创建与打开。

```text
					const request = indexedDB.open(DB_NAME, 1);
					request.onupgradeneeded = () => {
						const db = request.result;
						if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
					};
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => resolve(null);
					request.onblocked = () => resolve(null);
```

**依据 3 · 源码核查**：[lib/client.js:237-249](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L237-L249)

恢复经官方intake并可能触发文件上传。

<details>
<summary>查看原文（13行）</summary>

```text
						const files = [];
						for (const record of records) files.push(...recordToFiles(record));
						if (files.length === 0) return;
						// 官方 intake 通道：图片建 objectURL 预览，文件走后台上传。
						const drafts = conversation.createDrafts(sessionId, files);
						const ids = drafts.map((draft) => draft.id);
						if (ids.length === 0) return;
						if (!actions.addAttachments(ids)) {
							// 回填被拒（admission 锁定）→ 释放刚建的草稿，避免泄漏。
							for (const draft of drafts) {
								try { conversation.releaseDraftAttachment(draft.id); } catch { /* 忽略 */ }
							}
						}
```

</details>

**依据 4 · 作者声明**：[README.md:27-44](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/README.md#L27-L44)

作者安装、限制与清库说明。

<details>
<summary>查看原文（18行）</summary>

````text

## 安装

装进哪个 profile，就在哪个端生效：`web` profile = 浏览器/网页版，`desktop` profile = 桌面应用（两处都装则两端都有）。

1. 在 `~/.dsh/profiles/<profile>/package.json`（桌面端为 `~/.dsh/profiles/desktop/package.json`）的 `dependencies` 加入：
   ```json
   "dsh-draft-attachments": "file:D:/桌面/AI Port/DSH plugins/dsh-draft-attachments"
   ```
2. 在同一文件 `dsh.profile.bundles` 数组加入 `"dsh-draft-attachments"`。
3. 在 profile 目录执行 `pnpm install`。
4. 重启 DeepSeek Harness。

卸载 = 从上面两处移除条目 + `pnpm install` + 重启，无残留（插件数据只存在于浏览器的 IndexedDB `dsh-draft-attachments` 库，可在 DevTools 清除）。

## License

MIT
````

</details>

**依据 5 · 源码核查**：[package.json:1-24](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/package.json#L1-L24)

包声明入口与client，但没有peer约束。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-draft-attachments",
  "version": "1.0.1",
  "description": "DeepSeek Harness 插件：把输入框的草稿图片/文件像文字草稿一样持久化。切换页面、重启应用后回到会话，未发送的附件自动恢复。基于 IndexedDB，走官方 createDrafts/addAttachments 通道。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复的成本和效果怎样计量？

**研究主题**：效果与总成本

#### 完整回答

计量单位应是一组未发送附件在会话生命周期变化后正确恢复且不复活旧发送内容。节省的是重新找文件和重新选择的人时，源码不提供实际减少丢附件频率或任务总耗时的测量。读取arrayBuffer、Uint8Array、恢复时slice和File构造带来内存拷贝，保存二进制消耗配额，文件恢复还可能重走上传。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装与浏览器存储，金额未知 | 兼容、数据留存与恢复样本核对 | 作者兼容测试未独立复核 |
| 持续使用 | 二进制拷贝、IndexedDB容量和可能重上传 | 观察附件集合是否准确 | 实际峰值内存、配额和上传次数未知 |
| 失败恢复 | 重选/重上传与数据库清理 | 识别丢失或旧附件，手工复核发送状态 | 缺少可见事务失败状态，排障负担未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨挂载保存 | IndexedDB存取与官方恢复链存在 | 各种切页/关闭/发送时序的成功率 |
| 发送后清除 | 空集合删除机制存在 | 异步旧写是否覆盖删除 |
| 限制资源 | 单附件30MB检查存在 | 声明120MB合计上限没有执行，真实资源占用未知 |

不能从没有模型调用得出总成本为零。应把误恢复、失败重传和人工核对算入完整任务成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:110-133](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L110-L133)

字节序列化和恢复拷贝。

<details>
<summary>查看原文（24行）</summary>

```text
		/** 把一个草稿附件序列化成可存记录（超限/异常返回 undefined）。 */
		async function captureOne(attachment) {
			const file = attachment?.file;
			if (!(file instanceof Blob)) return undefined;
			if (file.size > MAX_ATTACHMENT_BYTES) return undefined;
			return {
				name: file.name || "image",
				type: file.type || "application/octet-stream",
				size: file.size,
				bytes: new Uint8Array(await file.arrayBuffer())
			};
		}
		/** 把一条记录还原成 File（官方 createDrafts 只吃 File/Blob）。 */
		function recordToFiles(record) {
			try {
				if (typeof record?.name !== "string" || !(record.bytes instanceof Uint8Array)) return [];
				const buffer = record.bytes.buffer.slice(
					record.bytes.byteOffset,
					record.bytes.byteOffset + record.bytes.byteLength
				);
				return [new File([buffer], record.name, { type: record.type })];
			} catch {
				return [];
			}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:184-205](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L184-L205)

异步捕获集合及写入条件。

<details>
<summary>查看原文（22行）</summary>

```text
				const run = async () => {
					st.timer = null;
					try {
						if (ordered.length === 0) {
							await saveDraft(sessionId, []);
							return;
						}
						const conversation = conversationFace?.();
						const resolveFace = conversation?.resolveDraftAttachments?.bind(conversation);
						if (typeof resolveFace !== "function") return;
						const attachments = resolveFace(ordered);
						// 数量不一致 → 有 id 已失效（正在释放），跳过本轮（等下一轮变化）。
						if (attachments.length !== ordered.length) return;
						for (let index = 0; index < ordered.length; index++) {
							if (st.cache.has(ordered[index])) continue;
							const record = await captureOne(attachments[index]);
							if (record !== undefined) st.cache.set(ordered[index], record);
						}
						const records = ordered
							.map((id) => st.cache.get(id))
							.filter((record) => record !== undefined);
						if (records.length === ordered.length) await saveDraft(sessionId, records);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:237-247](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L237-L247)

恢复经官方上传/预览通道。

<details>
<summary>查看原文（11行）</summary>

```text
						const files = [];
						for (const record of records) files.push(...recordToFiles(record));
						if (files.length === 0) return;
						// 官方 intake 通道：图片建 objectURL 预览，文件走后台上传。
						const drafts = conversation.createDrafts(sessionId, files);
						const ids = drafts.map((draft) => draft.id);
						if (ids.length === 0) return;
						if (!actions.addAttachments(ids)) {
							// 回填被拒（admission 锁定）→ 释放刚建的草稿，避免泄漏。
							for (const draft of drafts) {
								try { conversation.releaseDraftAttachment(draft.id); } catch { /* 忽略 */ }
```

</details>

#### 缺口

- 缺少大附件、多个附件和快速生命周期变化下资源/正确率数据。
  **影响**：无法给出低开销或可靠节时结论。
  **进一步探讨**：可用不同文件大小与数量记录DB增长、峰值内存、重复上传及正确恢复率。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可借鉴，可信保存收据如何检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是不改官方函数而通过会话级slot观察输入，恢复调用官方intake，拒绝回填时释放新草稿，并在异步读回后重新检查当前输入避免直接覆盖用户新选择。这些减少宿主patch耦合，但仍依赖公开服务和slot的版本契约。存储封装把失败吞掉、捕获没有串行与代际所有权，使简洁实现付出可诊断性和一致性代价。

由Q02可推导未验证的“每会话版本化保存收据”假设。以递增generation绑定附件集合，串行化读字节和写DB，只有当前generation可提交，返回明确saved/failed/skipped状态，并按实际总字节执行容量预算。其增量是让用户能区别已保存与仅尝试过，不只是加提示文案。还需考虑多个标签页共享DB、关闭页不可等待和敏感数据TTL，不能单进程队列解决全部情况。最小对照可用旧Blob延迟、新附件/发送清空、双标签与配额失败夹具，比较最终集合、错误可见性和额外等待；若仍误恢复或延迟过大，则假设不足。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:229-247](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L229-L247)

恢复前重查输入，回填拒绝则释放。

<details>
<summary>查看原文（19行）</summary>

```text
						// 最新快照里已经有附件（时序竞争）→ 不重复注入。
						if ((liveInputRef.current?.attachmentIds?.length ?? 0) > 0) return;
						const conversation = conversationFace?.();
						const actions = props.inputActions;
						if (conversation === undefined || actions === undefined) {
							console.warn(`[${PLUGIN_ID}] 恢复跳过：conversation/inputActions 不可用`);
							return;
						}
						const files = [];
						for (const record of records) files.push(...recordToFiles(record));
						if (files.length === 0) return;
						// 官方 intake 通道：图片建 objectURL 预览，文件走后台上传。
						const drafts = conversation.createDrafts(sessionId, files);
						const ids = drafts.map((draft) => draft.id);
						if (ids.length === 0) return;
						if (!actions.addAttachments(ids)) {
							// 回填被拒（admission 锁定）→ 释放刚建的草稿，避免泄漏。
							for (const draft of drafts) {
								try { conversation.releaseDraftAttachment(draft.id); } catch { /* 忽略 */ }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:170-215](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L170-L215)

缺少捕获generation和串行提交的直接依据。

<details>
<summary>查看原文（46行）</summary>

```text
			captureRef.current = async (ids, immediate) => {
				if (sessionId === undefined || sessionId === null) return;
				const ordered = Array.isArray(ids) ? ids : [];
				const signature = ordered.join("\n");
				if (!immediate && signature === st.lastSignature) return;
				st.lastSignature = signature;
				// 淘汰已消失 id 的字节缓存。
				for (const id of [...st.cache.keys()]) {
					if (!ordered.includes(id)) st.cache.delete(id);
				}
				if (st.timer !== null) {
					clearTimeout(st.timer);
					st.timer = null;
				}
				const run = async () => {
					st.timer = null;
					try {
						if (ordered.length === 0) {
							await saveDraft(sessionId, []);
							return;
						}
						const conversation = conversationFace?.();
						const resolveFace = conversation?.resolveDraftAttachments?.bind(conversation);
						if (typeof resolveFace !== "function") return;
						const attachments = resolveFace(ordered);
						// 数量不一致 → 有 id 已失效（正在释放），跳过本轮（等下一轮变化）。
						if (attachments.length !== ordered.length) return;
						for (let index = 0; index < ordered.length; index++) {
							if (st.cache.has(ordered[index])) continue;
							const record = await captureOne(attachments[index]);
							if (record !== undefined) st.cache.set(ordered[index], record);
						}
						const records = ordered
							.map((id) => st.cache.get(id))
							.filter((record) => record !== undefined);
						if (records.length === ordered.length) await saveDraft(sessionId, records);
					} catch (error) {
						console.warn(`[${PLUGIN_ID}] 捕获失败:`, error);
					}
				};
				if (immediate) {
					run();
					return;
				}
				st.pendingIds = ordered;
				st.timer = setTimeout(run, 300);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:90-106](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L90-L106)

保存函数未暴露状态，形成收据设计起点。

<details>
<summary>查看原文（17行）</summary>

```text
		/** 写一个会话的草稿附件记录（空数组 = 清除该会话记录）。 */
		async function saveDraft(sessionId, records) {
			const db = await openDb();
			if (db === null) return;
			await new Promise((resolve) => {
				try {
					const tx = db.transaction(STORE, "readwrite");
					const store = tx.objectStore(STORE);
					if (records.length === 0) store.delete(sessionId);
					else store.put(records, sessionId);
					tx.oncomplete = () => resolve();
					tx.onerror = () => resolve();
					tx.onabort = () => resolve();
				} catch {
					resolve();
				}
			});
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前是否值得试用，什么情况必须停止依赖？

**研究主题**：采用判断

#### 完整回答

推荐observe。功能需求明确，官方API接线也有价值，但当前保存可靠性就是核心功能，异步旧写、无事务状态及未执行总容量限制均直接影响它。尚不能给普通用户提供足以信赖的保护，尤其未发送敏感文件会被额外持久化。具备调试能力的读者可以继续核查，不应把该检查路径当作已推荐日常试用。

进一步判断可从非敏感、可重选且已知集合的样本开始，覆盖发送清空、快速切页、关闭、超单文件上限与总量超限。出现旧附件复活、保存无提示失败、显著内存压力或禁用后数据仍不知如何清除，应停止依赖。只有修正一致性/容量并有绑定版本的恢复和退出依据，才有理由重新判断可控试用。依据Q02、Q03与Q04。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:170-215](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L170-L215)

核心保存一致性和全集合写入条件影响建议。

<details>
<summary>查看原文（46行）</summary>

```text
			captureRef.current = async (ids, immediate) => {
				if (sessionId === undefined || sessionId === null) return;
				const ordered = Array.isArray(ids) ? ids : [];
				const signature = ordered.join("\n");
				if (!immediate && signature === st.lastSignature) return;
				st.lastSignature = signature;
				// 淘汰已消失 id 的字节缓存。
				for (const id of [...st.cache.keys()]) {
					if (!ordered.includes(id)) st.cache.delete(id);
				}
				if (st.timer !== null) {
					clearTimeout(st.timer);
					st.timer = null;
				}
				const run = async () => {
					st.timer = null;
					try {
						if (ordered.length === 0) {
							await saveDraft(sessionId, []);
							return;
						}
						const conversation = conversationFace?.();
						const resolveFace = conversation?.resolveDraftAttachments?.bind(conversation);
						if (typeof resolveFace !== "function") return;
						const attachments = resolveFace(ordered);
						// 数量不一致 → 有 id 已失效（正在释放），跳过本轮（等下一轮变化）。
						if (attachments.length !== ordered.length) return;
						for (let index = 0; index < ordered.length; index++) {
							if (st.cache.has(ordered[index])) continue;
							const record = await captureOne(attachments[index]);
							if (record !== undefined) st.cache.set(ordered[index], record);
						}
						const records = ordered
							.map((id) => st.cache.get(id))
							.filter((record) => record !== undefined);
						if (records.length === ordered.length) await saveDraft(sessionId, records);
					} catch (error) {
						console.warn(`[${PLUGIN_ID}] 捕获失败:`, error);
					}
				};
				if (immediate) {
					run();
					return;
				}
				st.pendingIds = ordered;
				st.timer = setTimeout(run, 300);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:90-106](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/lib/client.js#L90-L106)

无法区分保存失败与成功。

<details>
<summary>查看原文（17行）</summary>

```text
		/** 写一个会话的草稿附件记录（空数组 = 清除该会话记录）。 */
		async function saveDraft(sessionId, records) {
			const db = await openDb();
			if (db === null) return;
			await new Promise((resolve) => {
				try {
					const tx = db.transaction(STORE, "readwrite");
					const store = tx.objectStore(STORE);
					if (records.length === 0) store.delete(sessionId);
					else store.put(records, sessionId);
					tx.oncomplete = () => resolve();
					tx.onerror = () => resolve();
					tx.onabort = () => resolve();
				} catch {
					resolve();
				}
			});
```

</details>

**依据 3 · 作者声明**：[README.md:21-28](https://github.com/2026heshao/dsh-draft-attachments/blob/f285e67bab926ee3083ee7b3858aa28a6092ec8a/README.md#L21-L28)

作者声明容量与恢复限制，须和实现对照。

```text

## 限制

- 单附件 ≤ 30 MB，单会话合计 ≤ 120 MB（超限的附件不持久化，行为同官方）。
- 附件恢复后走官方重新上传/编码流程（图片重建 objectURL 预览；文件类草稿会重新进入后台上传）。
- 恢复时机是「输入区挂载且当前没有附件」；若在提交锁定相位（adjudicating/submitting）挂载，回填会被拒绝并释放草稿，等下次挂载再试。

## 安装
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
