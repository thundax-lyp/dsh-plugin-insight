# DSH Archived Chats

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1595809](https://github.com/Ultroncn/dsh-archived-chats/tree/1595809e252e798fb7afd8ea001b09e5fc0e6958)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ultroncn/dsh-archived-chats) [![npm 30d 5,252](https://img.shields.io/static/v1?label=npm+30d&message=5%2C252&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-archived-chats) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-archived-chats)
<!-- END META -->

> **功能**：在 DSH 设置内搜索和整理会话，支持标签备注、项目批量归档、ZIP 转存、恢复及谱系查看。

> **亮点**：[Q01](#research-q01) 与 [Q05](#research-q05) 支持具体组合增量：在同一设置工作台把找回、批量整理与可追踪的永久删除任务连起来，批量操作绑定预览而非直接套用旧列表。底层会话存储、消息语义和官方归档归宿主，新增价值是整合与范围控制。

> **主要限制**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示有界搜索不等于查遍全部历史，ZIP也不是包含实际附件的完整副本；补偿回滚不能保证进程强杀下多资源原子恢复。整理唯一副本前若忽略这些差别，会把“成功导出”误当“确定可恢复”。

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
  - [Q01 · 已有大量本地会话的人需要什么，插件相对单条归档标记增加了什么？](#detail-section-11)
  - [Q02 · 两端怎样挂载，缺少宿主能力时是否所有功能都可用？](#detail-section-12)
  - [Q03 · 全文检索与谱系能当成全部历史的真相吗？](#detail-section-13)
  - [Q04 · ZIP备份和导入是否等于完整可恢复副本，失败怎样处理？](#detail-section-14)
  - [Q05 · 批量归档与永久删除如何绑定确认，并限制范围变化和部分失败？](#detail-section-15)
  - [Q06 · 什么人值得试用，首次、持续和失败处理要付出什么？](#detail-section-16)
  - [Q07 · 怎样把“已导出”推进成用户能判断的“可恢复后再整理”？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有大量本地会话的人需要找回与整理旧对话，合格结果是目标内容仍可解释和恢复；不是归档条数越多越好，见 [Q01](#research-q01)。

以宿主registry单条archive/unarchive与手工文件备份为基线，只比较本次实际检查的操作接缝，不宣称宿主完全没有检索或备份能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 归档列表与标签备注 | 找回和分类本地会话 | 宿主持久化/工作区与metadata可读 |
| 全文查询与预览 | 定位消息和查看内容 | 有界投影、命中上限与skipped/remaining |
| 项目批量归档 | 预览选集后官方归档 | 归属/活跃变化重新检查，结果可部分成功 |
| ZIP导出与恢复 | 事件JSON及Markdown转存和新会话恢复 | 预算、writer能力、冲突/cwd与附件warning |
| 会话谱系 | 查看宿主记录的父子关系 | 缺关系不猜测，不代表全历史完整 |
| 永久删除与重试 | 持久意图后限制物理目录删除 | 不等普通归档，需先备份并看部分失败 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明兼容的DSH/Cordis/React与可解析dsh-session | 加载与投影必需 | 两端模块和会话语义 | 不能仅凭可选peer标记假设可缺包 |
| Web、workspaceRegistry、sessionPersistence | 管理界面必需 | 读取和官方归档操作 | 未齐时不注册，等待服务 |
| 排他writer、registry写入与metadata | 恢复需要 | 新会话和归档状态恢复 | 返回unsupported，不模拟覆盖 |
| list/locate和可验证独占目录 | 物理删除需要 | 限制递归rm范围 | 拒绝删盘并留任务 |
| 本地磁盘、脱敏副本及人工核对 | 试用前提 | 备份、恢复验证和失败保全 | 不对唯一源库试删除 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户先复制脱敏库、记录代表对话与附件 | 源库保留，内容可对照 |
| 加载 | 宿主注册设置区和管理路由 | 缺能力按功能说明，不能以界面存在代全部可用 |
| 查找整理 | 用户检索/预览并确认所选范围 | 核remaining/skipped和项目归属 |
| 转存恢复 | 导出后在副本导入，核warning与事件 | 不以ZIP生成成功代完整恢复 |
| 删除或失败 | 确认范围后执行，逐项看待办和失败 | 仅显式重试，异常保留源件并停止扩大操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地副本、磁盘与匹配宿主；金额未知 | 核版本、备份和代表会话 | 无服务订阅路径不等于总成本为零 |
| 持续使用 | 全文投影CPU/内存、ZIP和额外磁盘 | 核查询范围、标签、警告 | 缓存和预算有界，实际规模耗时未知 |
| 失败恢复 | 源库、导出包及待办保留空间 | 解释部分归档、恢复warning和删除任务 | rollback/重试需人工，不保证强杀原子性 |
| 退出 | 留存元数据/谱系/待办文件 | 先解决删除待办并保存备份，再禁用插件 | 宿主会话不由禁用自动恢复，插件数据需保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中整理 | 设置区、检索与批量归档有真实接线 | 人工时间与误操作降低 |
| 转存恢复 | 结构预算校验与补偿流程 | 附件完备和强杀恢复 |
| 删除范围 | 指纹确认、排他目录及待办 | 任意外部竞争与全平台无损保证 |

> **思考**：[Q03](#research-q03) 与 [Q04](#research-q04) 显示有界搜索不等于查遍全部历史，ZIP也不是包含实际附件的完整副本；补偿回滚不能保证进程强杀下多资源原子恢复。整理唯一副本前若忽略这些差别，会把“成功导出”误当“确定可恢复”。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q05](#research-q05) 支持具体组合增量：在同一设置工作台把找回、批量整理与可追踪的永久删除任务连起来，批量操作绑定预览而非直接套用旧列表。底层会话存储、消息语义和官方归档归宿主，新增价值是整合与范围控制。

[Q05](#research-q05)的预览指纹、持久意图、目录排他与显式重试分层值得借鉴；迁移需要目标系统提供真实身份和定位能力，不能仅复制rm外层检查。[Q04](#research-q04)对补偿失败单独报错是有用设计，但仍应和进程崩溃事务区分。检索响应保留完整性字段，便于调用者处理“没查完”。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 与 [Q04](#research-q04) 显示有界搜索不等于查遍全部历史，ZIP也不是包含实际附件的完整副本；补偿回滚不能保证进程强杀下多资源原子恢复。整理唯一副本前若忽略这些差别，会把“成功导出”误当“确定可恢复”。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在脱敏副本上用已知对话验证查找、标签与导出/恢复；确认事件、关系及附件后再决定是否扩大。出现范围变化、warning或持久化错误时保留源库并停止写操作。不要把永久删除当普通归档，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查归档工作台、查询、备份/恢复和删除机制；确认多种范围及能力降级限制。脱敏副本可控试用属于源码推断，未有宿主验收；恢复核对清单为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/client.js、lib/search.js、lib/lineage.js、lib/export.js、lib/import.js、lib/restore.js、lib/deletion.js、lib/deletion-safety.js、lib/durable.js、lib/workspace-bulk-archive.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取根manifest/patch、host/client注册，以及search、lineage、workspace bulk、export/import、restore、deletion、directory safety、durable的关键路径。INVENTORY是完整组件静态统计，本次源码检查为关键文件子集；未审计所有UI呈现、全部宿主实现或文件系统平台。
- 下一步：- 已检查固定源码及真实注册，未运行目标代码。
- 未读取用户会话、实际导入/归档/删除或真实宿主验收。
- 跨进程/强杀/附件恢复须单独验证，源码安全检查不等于已通过。

**分析版本**

- **仓库**：[Ultroncn/dsh-archived-chats](https://github.com/Ultroncn/dsh-archived-chats)
- **版本号**：2.0.6（[固定提交 1595809](https://github.com/Ultroncn/dsh-archived-chats/tree/1595809e252e798fb7afd8ea001b09e5fc0e6958)）
- **版本日期**：2026-11-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提出未验证的恢复核对清单，把身份、事件、关系、附件和工作区去向逐项核实后再由用户决定整理；用误判率与核对负担验证，而非承诺自动安全删除。

- 已检查固定源码及真实注册，未运行目标代码。
- 未读取用户会话、实际导入/归档/删除或真实宿主验收。
- 跨进程/强杀/附件恢复须单独验证，源码安全检查不等于已通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 2900 | — | — | 54370 |
| .js | source | 19 | 15999 | 14825 | 613 | — |
| .mjs | source | 5 | 315 | 279 | 8 | — |
| .mjs | test | 32 | 16287 | 15047 | 240 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ultroncn/dsh-archived-chats/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对归档整理相对单条操作的增量及查询、备份、恢复、删除的可信边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有大量本地会话的人需要什么，插件相对单条归档标记增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是定期整理DSH会话、需要按项目找回旧对话的用户。合格结果不是归档数量增加，而是能找到目标对话、确认其范围，必要时移回可见列表，且整理前后的记录仍可解释。以宿主registry的单条archive/unarchive操作为比较基线，插件新增设置工作台、全文检索、标签备注、项目批量整理、谱系和ZIP转存，把散落的整理操作组成一个流程。它沿用宿主会话持久化和官方归档操作，没有取代宿主存储。

已有归档列表按官方归档ID查标题和工作区，损坏日志仍可列出无标题条目，删除待办则被排除，避免已接受删除的条目重新出现。这个设计增量有实际接线支持；是否减少用户漏找或误删，需要同任务对照，不能从功能数量或作者截图推导。偶尔只需隐藏一条对话的人，原有单条操作可能已经足够。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/package.json#L1-L4)

作者包描述列出归档、搜索、批量、标签、ZIP与谱系。

```text
{
  "name": "dsh-archived-chats",
  "version": "2.0.6",
  "description": "查看、搜索和管理会话归档，支持工作区批量归档、标签备注、ZIP 备份和会话谱系。",
```

**依据 2 · 源码核查**：[lib/index.js:535-596](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L535-L596)

归档列表实际关联持久化、标题、项目、元数据与删除排除。

<details>
<summary>查看原文（62行）</summary>

```text
    try {
        for (const header of await persistence.list()) headerById.set(String(header.id), header);
    } catch (error) {
        ctx.logger.warn(`archived-chats: session header listing failed: ${String(error)}`);
    }
    const live = ctx.get('sessions');
    const workspaces = registry.list();
    const rows = [];
    for (const id of archivedIds) {
        // Scoped previews and search batches must not read unrelated or hidden
        // logs even for title metadata. List consumers retain their full scope.
        if (candidateIds !== undefined && !(await isVisibleArchivedSession(registry, pendingStore, deletionStore, id))) continue;
        const header = headerById.get(id) ?? live?.get(id)?.header;
        let title = titleCache?.get(id);
        if (title === undefined) {
            try {
                title = typeof persistence.readTitle === 'function'
                    ? await persistence.readTitle(id)
                    : extractTitle((await persistence.inspect(id)).events);
                // A rename can arrive while the persisted title is being read.
                // Prefer the newer official event already published to the cache.
                if (titleCache?.has(id)) title = titleCache.get(id);
                else if (title !== undefined) titleCache?.set(id, title);
            } catch {
                // A torn/unreadable log still lists — the row is manageable without a title.
            }
        }
        const workspace = workspaces.find((item) => workspaceSessionIds(item).includes(id));
        rows.push({
            id,
            title: title ?? null,
            createdAt: header?.createdAt ?? null,
            updatedAt: sessionListUpdatedAt(ctx, id, header),
            origin: header?.origin ?? null,
            workspaceId: workspace === undefined ? null : String(workspace.id),
            workspaceTitle: workspace?.title ?? null,
            workspacePath: workspace?.path ?? null,
        });
    }
    // Parked-for-deletion sessions stay archived (invisible everywhere) but are
    // excluded from the listing: they have been accepted for deletion and only
    // await an explicit retry, so they must not reappear on refresh.
    const pendingIds = await pendingStore.load();
    const tasks = await deletionStore.load();
    const taskIds = tasks.status === 'ready' ? new Set(tasks.records.keys()) : new Set();
    const visibleRows = rows.filter((row) => !pendingIds.has(row.id) && !taskIds.has(row.id));
    const metadata = await metadataStore.getMany(visibleRows.map((row) => row.id));
    return {
        metadataStatus: metadata.status,
        deletionStatus: tasks.status,
        sessions: visibleRows.map((row) => {
            const entry = metadata.entries[row.id];
            return {
                ...row,
                tags: entry?.tags ?? [],
                note: entry?.note ?? '',
                metadataUpdatedAt: entry?.updatedAt ?? null,
            };
        }),
    };
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:615-621](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L615-L621)

移回列表调用官方unarchiveSession，不重写捕获的registry状态。

```text
async function unarchiveIds(registry, ids) {
    if (typeof registry.unarchiveSession !== 'function') {
        throw Object.assign(new Error('this Host does not support the official unarchive operation'), { code: 'unarchive-unsupported', status: 501 });
    }
    for (const id of new Set(ids.map(String))) await registry.unarchiveSession(id);
    return [...registry.archivedSessionIds];
}
```

**依据 4 · 源码核查**：[lib/client.js:8924-8963](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/client.js#L8924-L8963)

设置归档工作台真实注册。

<details>
<summary>查看原文（40行）</summary>

```text
		const inject = ["slots", "locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(SETTINGS_NS, dictionaries), "archived-chats: dictionaries");
			ensureStyle();
			ctx.effect(() => () => { document.getElementById(STYLE_ID)?.remove(); }, "archived-chats: css cleanup");
			startNavIconPatch();
			ctx.effect(() => () => { stopNavIconPatch(); }, "archived-chats: nav-icon observer cleanup");

			const t = ctx.locale.bind(SETTINGS_NS);
            const archiveNavigation = createArchiveViewNavigation();
            registerArchiveToastShortcut(ctx, t, archiveNavigation);
            let archiveInteraction;
            const beginArchiveInteraction = content => {
                archiveInteraction?.dispose();
                archiveInteraction = preserveArchiveSettings(ctx.slots, { content });
                return archiveInteraction;
            };
            ctx.effect(() => () => archiveInteraction?.dispose(), "archived-chats: settings archive interaction");
			// Sidebar convergence after deletes: the concrete client sessions
			// service re-pulls its session.list baseline on refresh(). Optional
			// on purpose — an older runtime without it still deletes correctly,
			// the main page just needs a reload to catch up.
			const refreshSidebar = () => {
				try { return ctx.get("sessions")?.refresh?.(); } catch { return undefined; /* sidebar converges on next reconnect */ }
			};
			const refreshWorkspaceArchiveConsumers = async () => {
				await Promise.allSettled([
					Promise.resolve().then(() => refreshSidebar()),
					Promise.resolve().then(() => ctx.get("workspaces")?.refresh?.()),
				]);
			};
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "archived-chats",
				order: 30,
				label: () => t("nav"),
				locale: SETTINGS_NS,
				inject: () => ({ refreshSidebar, refreshWorkspaceArchiveConsumers, archiveNavigation, beginArchiveInteraction, getLineageListOrder: () => readLineageListOrder(ctx), subscribeArchiveChanges: listener => {
                        const disposers = [];
```

</details>

#### 缺口

- 没有真实整理任务与原生单条操作的同条件比较
  **影响**：不能量化漏找、误操作或人工时间降低
  **进一步探讨**：用已知内容的脱敏会话集完成找回与整理任务，记录准确性、步骤和时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 两端怎样挂载，缺少宿主能力时是否所有功能都可用？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

根bundle补丁按包名装入lib/index.js，客户端从lib/client.js导出并注册settings.section。宿主apply通过ctx.get探测webServer/httpServer、workspaceRegistry/workspace及sessionPersistence，三类服务未齐时保持未注册，并监听internal/service补挂载。这只能说明服务延迟的兼容处理，不证明所有宿主版本支持全部操作。

恢复需要可排他创建的持久化writer、可写registry和元数据接口；物理删除还需要list/locate以及排他目录验证。缺能力按操作返回unsupported，不能把“界面能出现”解释为能安全恢复或删盘。search.js顶层实际导入@deepseek-ai/dsh-session，尽管peerDependenciesMeta将其标optional，运行时仍需可解析的兼容包。宿主和React/Cordis版本声明是准入条件，不是本轮加载验收。POST的插件自有guard要求自定义请求头，这是跨站表单缓解措施，不是账户授权系统；部署暴露范围仍需由宿主控制。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:5-7](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/cordis.patch.yml#L5-L7)

根挂载路径。

```text
- insert:
    - id: archived-chats
      name: 'dsh-archived-chats'
```

**依据 2 · 源码核查**：[package.json:77-113](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/package.json#L77-L113)

DSH/client/peer及fflate声明。

<details>
<summary>查看原文（37行）</summary>

```text
  "engines": {
    "dsh": ">=0.1.0-rc.7 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.1.0-rc.7 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web",
      "immediately": true
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.7 <0.1.1-0 || >=0.1.1-rc.1 <0.1.2-0 || >=0.1.2-alpha.1 <0.2.0-0 || 0.1.5-rc.2 || 0.1.7-rc.2 || 0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.5 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-session": {
      "optional": true
    }
  },
  "dependencies": {
    "fflate": "^0.8.3"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-session": "0.2.2-rc.3",
    "typescript": "^5.9.3"
  },
  "overrides": {
    "zod": "4.6.7"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1938-1966](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L1938-L1966)

三类服务探测、路由注册与延迟监听。

<details>
<summary>查看原文（29行）</summary>

```text
    const registerWebSurface = () => {
        if (registered) return;
        const webServer = ctx.get(WEB_SERVER_KEYS[0]) ?? ctx.get(WEB_SERVER_KEYS[1]);
        const registry = ctx.get(WORKSPACE_KEYS[0]) ?? ctx.get(WORKSPACE_KEYS[1]);
        const rawPersistence = ctx.get(PERSISTENCE_KEYS[0]);
        if (webServer === undefined || registry === undefined || rawPersistence === undefined) return;
        const persistence = resolvePersistenceCompat(rawPersistence);
        registered = true;
        statsService ??= createStatsService({ persistence });
        const restoreAdapter = createRestoreAdapter({
            ctx,
            persistence,
            registry,
            metadataStore,
            tempRoot: join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'plugin-data', 'archived-chats', 'imports'),
        });
        registerRoutes(ctx, webServer, registry, persistence, titleCache, metadataStore, statsService, pendingStore, deletionStore, lifecycle, importTokens, restoreAdapter, provenanceStore, forkTracking);
        // Permanent-deletion tasks run only after an explicit user action.
    };
    registerWebSurface();
    ctx.on('internal/service', (serviceName) => {
        if (serviceName === 'sessionController') forkTracking.refresh();
        if (WEB_SERVER_KEYS.includes(serviceName)
            || WORKSPACE_KEYS.includes(serviceName)
            || PERSISTENCE_KEYS.includes(serviceName)) {
            registerWebSurface();
        }
    });
}
```

</details>

**依据 4 · 源码核查**：[lib/search.js:1-4](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/search.js#L1-L4)

直接运行时导入宿主会话包。

```text
import {
  deriveEventMessage,
  isAppendSurfaceEvent,
} from '@deepseek-ai/dsh-session';
```

**依据 5 · 源码核查**：[lib/restore.js:295-313](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L295-L313)

恢复能力检查。

<details>
<summary>查看原文（19行）</summary>

```text
export function createRestoreAdapter({ ctx, persistence, registry, metadataStore, tempRoot, titlePublicationTimeoutMs = TITLE_PUBLICATION_TIMEOUT_MS }) {
  const writer = resolveWriter(persistence);
  let capability = { supported: true };
  if (writer === null) {
    const ambiguousLegacy = typeof persistence?.create === 'function'
      && typeof persistence?.append === 'function' && typeof persistence?.locate === 'function';
    capability = { supported: false, reason: ambiguousLegacy ? 'exclusive-create-missing' : 'writer-missing' };
  }
  else if (typeof registry?.setState !== 'function' || registry.state === undefined) capability = { supported: false, reason: 'registry-writer-missing' };
  else if (typeof metadataStore?.getMany !== 'function' || typeof metadataStore?.set !== 'function' || typeof metadataStore?.remove !== 'function') capability = { supported: false, reason: 'metadata-writer-missing' };

  async function prepare(records, { knownIds = new Set() } = {}) {
    if (!capability.supported) throw unsupported(capability.reason);
    const items = Array.isArray(records) ? records : [];
    requireRestorableCwds(items);
    if (writer.kind !== 'handle' && items.some(item => item.record?.source?.inheritedEventCount > 0
      || item.record?.source?.meta?.isSeeded === true)) {
      throw unsupported('inherited-boundary-unsupported');
    }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:353-364](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L353-L364)

自定义POST头检查并非独立认证。

<details>
<summary>查看原文（12行）</summary>

```text
function guard(req, res) {
    if (req.method !== 'POST') {
        send(res, 405, { error: 'method-not-allowed' });
        return false;
    }
    if (req.headers[GUARD_HEADER] !== '1') {
        send(res, 403, { error: 'forbidden' });
        return false;
    }
    return true;
}
//#endregion
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全文检索与谱系能当成全部历史的真相吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能把无命中解释为整个会话库不存在内容。检索先将会话事件投影为可查的消息文字，空白分词后的所有词必须在同一投影消息中匹配，不是跨全会话语义检索；每会话最多保留三处摘录。默认最多返回50个命中会话，上限100，并发4。响应保留scannedIds、skipped、processed、remaining和complete，达到命中上限会停止继续扫描。预览另有消息/分段文本预算及稳定页码，定位seq是源事件序号而非数组下标。

谱系来自宿主header中的parentSession、origin等已记录关系，并处理缺父、环和异常字段。它不从文本相似度猜亲缘，缺失关系保持缺口；旧格式seedLength与v4实际继承边界也不能混用。这样可以辅助找回上下文，但不能证明所有派生会话都被宿主完整记录或任何旧导入都保持了外部附件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:6-26](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/search.js#L6-L26)

预览/检索/缓存资源边界。

<details>
<summary>查看原文（21行）</summary>

```text
export const PREVIEW_LIMITS = Object.freeze({
  defaultPageSize: 50,
  maxPageSize: 200,
  maxSegmentCodePoints: 256 * 1024,
  maxIdentityCodePoints: 1024,
  maxSegmentsPerMessage: 1000,
  maxMessageCodePoints: 1024 * 1024,
  maxProjectedMessages: 10000,
});

export const SEARCH_LIMITS = Object.freeze({
  maxQueryCodePoints: 200,
  defaultSessions: 50,
  maxSessions: 100,
  matchesPerSession: 3,
  excerptCodePoints: 240,
  concurrency: 4,
  cacheEntries: 64,
  cacheTtlMs: 30_000,
  maxCachedCodePoints: 2 * 1024 * 1024,
});
```

</details>

**依据 2 · 源码核查**：[lib/search.js:751-770](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/search.js#L751-L770)

稳定分页和seq定位。

<details>
<summary>查看原文（20行）</summary>

```text
/** Return one stable offset page without exposing the private search corpus. */
export function paginateProjectedMessages(messages, options = {}) {
  let offset = pageInteger(options.offset, 0, 0, Number.MAX_SAFE_INTEGER);
  const limit = pageInteger(options.limit, PREVIEW_LIMITS.defaultPageSize, 1, PREVIEW_LIMITS.maxPageSize);
  const total = Array.isArray(messages) ? messages.length : 0;
  let anchor;
  if (options.seq !== undefined) {
    if (!Number.isSafeInteger(options.seq) || options.seq < 0) {
      throw Object.assign(new Error('preview anchor is invalid'), { status: 400, code: 'preview-anchor-invalid' });
    }
    const index = (messages ?? []).findIndex(message => message.seq === options.seq);
    anchor = { seq: options.seq, status: index < 0 ? 'missing' : 'found' };
    // Locate within projected messages: source event seq is not an array index.
    offset = index < 0 ? 0 : Math.max(0, index - Math.floor(limit / 2));
  }
  const items = (Array.isArray(messages) ? messages : []).slice(offset, offset + limit)
    .map(({ normalized: _normalized, searchable: _searchable, ...message }) => message);
  const nextOffset = offset + items.length < total ? offset + items.length : null;
  return { offset, limit, total, previousOffset: offset > 0 ? Math.max(0, offset - limit) : null, nextOffset, ...(anchor ? { anchor } : {}), messages: items };
}
```

</details>

**依据 3 · 源码核查**：[lib/search.js:831-895](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/search.js#L831-L895)

同消息多词匹配、有界扫描和完整性字段。

<details>
<summary>查看原文（65行）</summary>

```text
      : sourcePointOffset(points, matched));
  const radius = Math.floor(SEARCH_LIMITS.excerptCodePoints / 2);
  const start = Math.max(0, first - radius);
  const end = Math.min(points.length, start + SEARCH_LIMITS.excerptCodePoints);
  return `${start > 0 ? '…' : ''}${points.slice(start, end).join('')}${end < points.length ? '…' : ''}`;
}

/** Search one projected session; every whitespace-separated term must match one event. */
export function searchProjectedMessages(messages, query) {
  const terms = queryTerms(query);
  const matches = [];
  for (const message of Array.isArray(messages) ? messages : []) {
    if (!terms.every((term) => message.normalized.includes(term))) continue;
    matches.push({
      seq: message.seq,
      time: message.time,
      role: message.role,
      excerpt: excerptFor(message, terms),
    });
    if (matches.length >= SEARCH_LIMITS.matchesPerSession) break;
  }
  return matches;
}

/** Inspect archived sessions with bounded concurrency and preserve caller order. */
export async function searchArchivedSessions({ ids, inspect, loadMessages, query, limit, signal }) {
  queryTerms(query);
  if (typeof inspect !== 'function' && typeof loadMessages !== 'function') throw new TypeError('inspect or loadMessages is required');
  const sessionLimit = searchSessionLimit(limit);
  const ordered = [...new Set((Array.isArray(ids) ? ids : []).filter((id) => typeof id === 'string'))];
  const hits = [];
  const skipped = [];
  const scannedIds = [];
  for (let start = 0; start < ordered.length && hits.length < sessionLimit;) {
    if (signal?.aborted) throw signal.reason ?? Object.assign(new Error('search aborted'), { code: 'request-aborted', status: 499 });
    // Never inspect more potential matches than the legacy response can retain.
    const batch = ordered.slice(start, start + Math.min(SEARCH_LIMITS.concurrency, sessionLimit - hits.length));
    start += batch.length;
    const results = await Promise.all(batch.map(async (id) => {
      try {
        const messages = typeof loadMessages === 'function'
          ? await loadMessages(id)
          : projectArchivedMessages((await inspect(id))?.events);
        const matches = searchProjectedMessages(messages, query);
        return matches.length > 0 ? { hit: { sessionId: id, matches } } : {};
      } catch (error) {
        return { skipped: { sessionId: id, reason: String(error?.code ?? error?.name ?? 'inspect-failed') } };
      }
    }));
    if (signal?.aborted) throw signal.reason ?? Object.assign(new Error('search aborted'), { code: 'request-aborted', status: 499 });
    for (const [index, result] of results.entries()) {
      scannedIds.push(batch[index]);
      if (result.hit !== undefined) hits.push(result.hit);
      if (result.skipped !== undefined) skipped.push(result.skipped);
    }
  }
  return {
    hits,
    skipped,
    scannedIds,
    total: ordered.length,
    processed: scannedIds.length,
    remaining: ordered.length - scannedIds.length,
    complete: scannedIds.length === ordered.length,
  };
```

</details>

**依据 4 · 源码核查**：[lib/lineage.js:96-121](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/lineage.js#L96-L121)

从header派生关系并对未知字段降级。

<details>
<summary>查看原文（26行）</summary>

```text
  const order = [];
  for (const header of headers) {
    // Headers are the Host's data, so every field here is a forward-compatibility
    // surface: a new `origin` value, an absent timestamp, a changed numeric type.
    // Each one degrades that single node's detail to a value the public
    // LineageNode already allows. Only an unusable identity drops the row, and a
    // duplicate id keeps the first. One unrecognized session must never cost the
    // whole graph — this projection was the only surface that failed that way.
    if (header === null || typeof header !== 'object' || Array.isArray(header)) continue;
    if (typeof header.id !== 'string' || header.id === '' || nodes.has(header.id)) continue;
    const id = header.id;
    const cachedTitle = titles.get(id);
    // v4 stores the exact inherited cut in Session state, never in its header.
    const legacySeedLength = (header.version === undefined || header.version < 4)
      && Number.isSafeInteger(header.seedLength) && header.seedLength >= 0 ? header.seedLength : null;
    const node = {
      id,
      parentSession: typeof header.parentSession === 'string' && header.parentSession !== '' ? header.parentSession : null,
      isSeeded: typeof header.isSeeded === 'boolean' ? header.isSeeded : legacySeedLength === null ? null : legacySeedLength > 0,
      seedLength: legacySeedLength,
      origin: header.origin === 'subagent' ? 'subagent' : null,
      delegationDepth: Number.isSafeInteger(header.delegationDepth) && header.delegationDepth >= 0 ? header.delegationDepth : 0,
      title: typeof cachedTitle === 'string' ? cachedTitle : (typeof header.title === 'string' ? header.title : null),
      createdAt: Number.isSafeInteger(header.createdAt) && header.createdAt >= 0 ? header.createdAt : null,
      workspace: { ...(workspaceBySession.get(id) ?? { id: null, title: null }) },
      status: archived.has(id) ? 'archived' : 'active',
```

</details>

**依据 5 · 源码核查**：[lib/lineage.js:132-179](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/lineage.js#L132-L179)

自引用/环/缺父关系的处理。

<details>
<summary>查看原文（48行）</summary>

```text
    if (node.parentSession === id) {
      detached.add(id);
      diagnostics.push({ code: 'self-parent', sessionId: id, relatedId: id });
    }
  }

  const state = new Map();
  const cycleNodes = new Set();
  for (const startId of order) {
    if ((state.get(startId) ?? 0) !== 0) continue;
    const path = [];
    const pathIndex = new Map();
    let id = startId;
    while ((state.get(id) ?? 0) === 0) {
      state.set(id, 1);
      pathIndex.set(id, path.length);
      path.push(id);
      const parent = nodes.get(id).parentSession;
      if (parent === null || parent === id || !nodes.has(parent)) break;
      const parentState = state.get(parent) ?? 0;
      if (parentState === 1) {
        const cycleStart = pathIndex.get(parent);
        if (cycleStart !== undefined) {
          for (let index = cycleStart; index < path.length; index += 1) cycleNodes.add(path[index]);
        }
        break;
      }
      if (parentState === 2) break;
      id = parent;
    }
    for (let index = path.length - 1; index >= 0; index -= 1) state.set(path[index], 2);
  }
  for (const id of order) {
    if (!cycleNodes.has(id)) continue;
    detached.add(id);
    diagnostics.push({ code: 'cycle', sessionId: id, relatedId: nodes.get(id).parentSession });
  }

  const missingNodes = new Map();
  for (const id of order) {
    const node = nodes.get(id);
    const parent = node.parentSession;
    if (parent === null || detached.has(id) || nodes.has(parent)) continue;
    if (!missingNodes.has(parent)) {
      missingNodes.set(parent, {
        id: parent,
        parentSession: null,
        isSeeded: null,
```

</details>

#### 缺口

- 宿主历史关系与投影对全部实际会话格式的覆盖未验证
  **影响**：可能存在因格式或缺关系而未找到的内容，不能把谱系当完整审计账
  **进一步探讨**：在包含继承、重试、缺父和旧格式的脱敏样本中逐一核对检索命中与关系边。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · ZIP备份和导入是否等于完整可恢复副本，失败怎样处理？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

导出先生成manifest，再为每会话写事件JSON和Markdown，统一检查格式版本、语义和导入预算后才创建ZIP流。因此不是把任意目录打包，Markdown也不是恢复的唯一事实来源。预算包括最多2000会话、单JSON4MiB、单条目8MiB、总展开256MiB等；大对话可能明确拒绝，不能把导出按钮存在当无限备份能力。

导入预览用一次性token/nonce绑定计划，默认十分钟过期，限制保留计划数及总字节。恢复检查ID冲突、cwd平台与继承边界支持；先暂存，再调用可排他写入的宿主writer，关联工作区与元数据，最后更新归档状态。异常会依次撤registry、元数据、工作区和本次写入，回滚自身失败会单独报错，不把它包装成成功。

重要边界是附件引用可能被保留但附件本体未包含，缺目标工作区也会给warning。跨多个宿主资源的rollback是补偿动作，源码没有证明进程被强杀后的全局原子恢复；标题发布也在主提交之后给警告。因此备份应在副本实际恢复并核内容，不能导出后立即物理删除唯一原件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/export.js:428-490](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/export.js#L428-L490)

导出预算、事件JSON/Markdown、格式语义预检。

<details>
<summary>查看原文（63行）</summary>

```text
async function prepareExport({ plan, inspect, generatorVersion, limits: limitOverrides }) {
  if (!Array.isArray(plan?.items) || plan.items.length === 0) {
    throw new TypeError('export plan must contain at least one session');
  }
  if (typeof inspect !== 'function') throw new TypeError('inspect must be a function');

  const limits = { ...IMPORT_LIMITS, ...(limitOverrides ?? {}) };
  // `sessionId` names the session the limit applies to, so a caller can tell the
  // user which one to deselect instead of reporting a bare failure.
  const fail = (message, sessionId) => {
    throw Object.assign(new Error(message), {
      code: 'export-limit-exceeded',
      ...(typeof sessionId === 'string' && sessionId !== '' ? { sessionId } : {}),
    });
  };
  if (plan.items.length > limits.maxSessions || 1 + (plan.items.length * 2) > limits.maxEntries) {
    fail('export session or entry count exceeds import limits');
  }

  let firstInspection = await inspect(plan.items[0].id);
  const formatVersion = Object.hasOwn(firstInspection ?? {}, 'inheritedEventCount') ? 2 : 1;
  const manifest = createManifest(plan, generatorVersion, formatVersion);
  const manifestText = formattedJson(manifest);
  const manifestBytes = Buffer.byteLength(manifestText, 'utf8');
  if (manifestBytes > limits.maxManifestBytes || manifestBytes > limits.maxEntryBytes
    || validateJsonValue(manifest, limits) !== null) fail('export manifest exceeds import limits');

  const staged = [{ source: manifestText, name: 'manifest.json' }];
  const records = [];
  let totalBytes = manifestBytes;
  for (let index = 0; index < plan.items.length; index += 1) {
    const item = plan.items[index];
    let inspected = index === 0 ? firstInspection : await inspect(item.id);
    const record = createSessionRecord(item, inspected, plan.exportedAt);
    if (record.version !== formatVersion) throw new Error('inconsistent export source format');
    const json = formattedJson(record);
    records[index] = JSON.parse(json);
    const markdown = renderTranscript(item, inspected?.events, plan.exportedAt);
    const jsonBytes = Buffer.byteLength(json, 'utf8');
    const markdownBytes = Buffer.byteLength(markdown, 'utf8');
    if (jsonBytes > limits.maxJsonBytes || jsonBytes > limits.maxEntryBytes
      || markdownBytes > limits.maxMarkdownBytes || markdownBytes > limits.maxEntryBytes
      || validateJsonValue(record, limits) !== null) fail(`export session ${item.id} exceeds import limits`, item.id);
    totalBytes += jsonBytes + markdownBytes;
    if (totalBytes > limits.maxUncompressedBytes) fail('export package exceeds import expansion limit');
    staged.push({ source: json, name: item.files.json }, { source: markdown, name: item.files.markdown });
    inspected = null;
    if (index === 0) firstInspection = null;
  }
  const semanticErrors = validateBackupSemantics(manifest, records);
  if (records.some((record) => record.version === 1 && record.source?.meta?.isSeeded === true)) {
    semanticErrors.push({ code: 'source-invalid', path: '$.source.meta.isSeeded', message: 'seeded v1 sources lack an inherited boundary' });
  }
  if (semanticErrors.length > 0) {
    throw Object.assign(new Error('export source is invalid'), { code: 'export-source-invalid', errors: semanticErrors });
  }

  return { staged, entryDate: new Date(plan.exportedAt) };
}

/** Validate the same import budgets and source semantics without starting a ZIP. */
export async function validateExport(options) {
  await prepareExport(options);
```

</details>

**依据 2 · 源码核查**：[lib/import.js:5-17](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/import.js#L5-L17)

明确的压缩/展开与JSON预算。

<details>
<summary>查看原文（13行）</summary>

```text
export const IMPORT_LIMITS = Object.freeze({
  maxCompressedBytes: 512 * 1024 * 1024,
  maxUncompressedBytes: 256 * 1024 * 1024,
  maxSessions: 2000,
  maxEntries: 1 + (2000 * 2),
  maxEntryBytes: 8 * 1024 * 1024,
  maxManifestBytes: 4 * 1024 * 1024,
  maxJsonBytes: 4 * 1024 * 1024,
  maxMarkdownBytes: 8 * 1024 * 1024,
  maxJsonDepth: 64,
  maxJsonNodes: 100_000,
  maxJsonStringCodePoints: 4 * 1024 * 1024,
});
```

</details>

**依据 3 · 源码核查**：[lib/index.js:212-246](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L212-L246)

一次性预览计划token、nonce、容量和过期。

<details>
<summary>查看原文（35行）</summary>

```text
export function createImportTokenStore({
    now = () => Date.now(),
    ttlMs = 10 * 60 * 1000,
    maxEntries = 8,
    maxBytes = 128 * 1024 * 1024,
} = {}) {
    const tokens = new Map();
    function cleanup() {
        const time = now();
        for (const [token, value] of tokens) if (value.expiresAt <= time) tokens.delete(token);
    }
    return {
        create(plan) {
            cleanup();
            const planBytes = Number.isSafeInteger(plan?.totalBytes) && plan.totalBytes >= 0 ? plan.totalBytes : 0;
            const retainedBytes = [...tokens.values()].reduce((total, entry) => total + entry.bytes, 0);
            if (tokens.size >= maxEntries || retainedBytes + planBytes > maxBytes) {
                throw Object.assign(new Error('import confirmation capacity is full'), { status: 503, code: 'import-token-capacity' });
            }
            const token = randomUUID();
            const nonce = randomUUID();
            const expiresAt = now() + ttlMs;
            tokens.set(token, { plan, nonce, expiresAt, bytes: planBytes });
            return { token, nonce, expiresAt };
        },
        consume(token, nonce) {
            cleanup();
            const value = tokens.get(token);
            if (value === undefined || value.nonce !== nonce) throw Object.assign(new Error('import token is invalid or expired'), { status: 409, code: 'import-token-invalid' });
            tokens.delete(token);
            return value.plan;
        },
        remove(token) { tokens.delete(token); },
        cleanup,
    };
```

</details>

**依据 4 · 源码核查**：[lib/restore.js:295-329](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L295-L329)

writer、冲突、继承/cwd和元数据检查。

<details>
<summary>查看原文（35行）</summary>

```text
export function createRestoreAdapter({ ctx, persistence, registry, metadataStore, tempRoot, titlePublicationTimeoutMs = TITLE_PUBLICATION_TIMEOUT_MS }) {
  const writer = resolveWriter(persistence);
  let capability = { supported: true };
  if (writer === null) {
    const ambiguousLegacy = typeof persistence?.create === 'function'
      && typeof persistence?.append === 'function' && typeof persistence?.locate === 'function';
    capability = { supported: false, reason: ambiguousLegacy ? 'exclusive-create-missing' : 'writer-missing' };
  }
  else if (typeof registry?.setState !== 'function' || registry.state === undefined) capability = { supported: false, reason: 'registry-writer-missing' };
  else if (typeof metadataStore?.getMany !== 'function' || typeof metadataStore?.set !== 'function' || typeof metadataStore?.remove !== 'function') capability = { supported: false, reason: 'metadata-writer-missing' };

  async function prepare(records, { knownIds = new Set() } = {}) {
    if (!capability.supported) throw unsupported(capability.reason);
    const items = Array.isArray(records) ? records : [];
    requireRestorableCwds(items);
    if (writer.kind !== 'handle' && items.some(item => item.record?.source?.inheritedEventCount > 0
      || item.record?.source?.meta?.isSeeded === true)) {
      throw unsupported('inherited-boundary-unsupported');
    }
    const ids = items.map((item) => String(item.id));
    const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
    if (duplicate !== undefined) throw Object.assign(new Error(`duplicate restore id ${duplicate}`), { code: 'restore-duplicate' });
    if (ids.some((id) => knownIds.has(id))) throw Object.assign(new Error('restore records contain an ID conflict'), { code: 'id-conflict' });
    const root = tempRoot ?? join(process.env.DSH_HOME ?? '/tmp', 'plugin-data', 'archived-chats', 'imports');
    await mkdir(root, { recursive: true, mode: 0o700 });
    const originalArchiveIds = (registry.archivedSessionIds ?? registry.state?.archivedSessionIds ?? []).map(String);
    const originalMetadata = await metadataStore.getMany(ids);
    if (originalMetadata?.status !== 'ready') throw Object.assign(new Error('restore metadata is unavailable'), { code: 'metadata-store-unavailable', status: 503 });
    const staging = await mkdtemp(join(root, 'restore-'));
    const staged = [];
    let committed = false;
    let cleaned = false;

    async function cleanup() {
      if (!cleaned) {
```

</details>

**依据 5 · 源码核查**：[lib/restore.js:366-395](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L366-L395)

逐类补偿与回滚失败报错。

<details>
<summary>查看原文（30行）</summary>

```text
        }
        for (const id of transaction._metadataTouched?.slice().reverse() ?? []) {
          try {
            const previous = originalMetadata.entries?.[id];
            if (previous === undefined) await metadataStore.remove([id]);
            else await metadataStore.set(id, { tags: previous.tags, note: previous.note });
          } catch (error) { rollbackErrors.push(error); }
        }
        for (const undo of transaction._workspaceUndos?.slice().reverse() ?? []) {
          try { await undo(); } catch (error) { rollbackErrors.push(error); }
        }
        for (const undo of transaction._undos?.slice().reverse() ?? []) {
          try { await undo(); } catch (error) { rollbackErrors.push(error); }
        }
        try { await cleanup(); } catch (error) { rollbackErrors.push(error); }
        if (rollbackErrors.length > 0) throw Object.assign(new Error('restore rollback failed'), { code: 'restore-rollback-failed', cause: rollbackErrors[0] });
      },
      async commit() {
        if (committed) throw Object.assign(new Error('restore transaction already committed'), { code: 'restore-replayed' });
        if (staged.length === 0) throw Object.assign(new Error('no staged records'), { code: 'nothing-to-restore' });
        transaction._undos = [];
        transaction._workspaceUndos = [];
        transaction._metadataTouched = [];
        transaction._registryAttempted = false;
        const finishWrites = [];
        const restored = [];
        const warnings = [];
        try {
          requireRestorableCwds(staged);
          for (const item of staged) {
```

</details>

**依据 6 · 源码核查**：[lib/restore.js:405-445](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L405-L445)

写入、附件warning、归档发布与异常路径。

<details>
<summary>查看原文（41行）</summary>

```text
            const result = await writer.write(payload, (undo) => { transaction._undos[transaction._undos.length - 1] = undo; });
            const ownedUndo = resolveUndo(result, fallbackUndo);
            transaction._undos[transaction._undos.length - 1] = ownedUndo;
            if (typeof result?.finish === 'function') finishWrites.push(result.finish);
            const workspace = workspaceFor(registry, item.workspace?.id);
            if (workspace === null) {
              warnings.push(...warningFor(item));
            } else if (!workspaceSessionIds(workspace).includes(item.id)) {
              if (typeof workspace.attachSession !== 'function' || typeof workspace.detachSession !== 'function') {
                warnings.push(...warningFor(item));
              } else {
                transaction._workspaceUndos.push(() => workspaceSessionIds(workspace).includes(item.id)
                  ? workspace.detachSession(item.id)
                  : undefined);
                await workspace.attachSession(item.id);
              }
            }
            if (item.hasAttachmentReferences) warnings.push({ id: item.id, reason: 'attachments-not-included' });
            transaction._metadataTouched.push(item.id);
            await metadataStore.set(item.id, { tags: item.tags, note: item.note });
            restored.push(item.id);
          }
          const current = registry.archivedSessionIds.map(String);
          transaction._registryAttempted = true;
          await registry.setState({ ...registry.state, archivedSessionIds: [...current, ...restored] });
          for (const finish of finishWrites) await finish();
          await cleanup();
          committed = true;
        } catch (error) {
          try { await transaction.rollback(); }
          catch (rollbackError) { throw rollbackError; }
          throw error;
        }
        warnings.push(...await publishColdTitles(ctx, staged, titlePublicationTimeoutMs));
        return { restored, warnings };
      },
    };
    return transaction;
  }

  return { capability, prepare };
```

</details>

#### 缺口

- 未验证强制终止后的多资源恢复，ZIP也不包含全部外部附件
  **影响**：不能据此保证任意故障下无损恢复或唯一副本可删除
  **进一步探讨**：先在隔离副本恢复含附件引用/继承边界的样本，对比事件、实际文件和工作区；强杀各提交点单独检验恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 批量归档与永久删除如何绑定确认，并限制范围变化和部分失败？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

批量归档预览捕获所选会话及活跃状态，用token、nonce和过期时间确认；需要停止活跃任务时另要求stopActivity确认。执行时逐项进入生命周期队列，重新核项目归属、删除排除、活动与内容，再调用官方archiveSession并核归档已提交。它返回archived/skipped/failed数组，明确允许部分完成，不是一个全批事务。

永久删除先计算所选会话和子Agent闭包，绑定createdAt与范围指纹；确认后重算，变化则409拒绝。每项先持久保存purge-pending意图，再停用/分离live session、检查物理范围并删盘。安全解析器要求宿主完整list/locate、规范绝对日志路径、会话独占目录、无链接祖先和目录不重叠；不根据旧列表猜目录。删除调用rm后用ENOENT确认，再移除工作区、归档、谱系及元数据，最后清待办。中间失败仍保留任务，用户显式重试taskId，而非启动自动继续删除。

这套设计的可借鉴点是把“接受删除”与“完成物理删除”分开，并让范围变化重新确认。局限也明确：生命周期队列仅在这个运行实例中串行化，不等于任意外部写入都被锁住；目录检查与文件删除不是OS级不可竞争事务。单文件原子rename/fsync提高待办耐久性，目录fsync不支持时返回降级结果，仍不能推广成跨平台断电保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace-bulk-archive.js:234-289](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/workspace-bulk-archive.js#L234-L289)

预览确认及活跃停止条件。

<details>
<summary>查看原文（56行）</summary>

```text
  async function preview(workspaceId, selectedIds, { includeActive = false } = {}) {
    const issuedAt = stableNow(now).valueOf();
    sweepExpired(issuedAt);
    const headers = await listSessionHeaders?.();
    const workspace = await workspaceFor(workspaceId, headers);
    if (workspace === null) throw failure('workspace-not-found', 'workspace was not found', 404);
    let captured = await snapshotCandidates(workspace, includeActive, headers);
    if (selectedIds !== undefined) {
      const eligible = new Set(captured.sessions.map(row => row.id));
      if (!Array.isArray(selectedIds) || selectedIds.length === 0 || selectedIds.length > MAX_ELIGIBLE_SESSIONS
        || selectedIds.some(id => typeof id !== 'string' || !eligible.has(id))) {
        throw failure('workspace-archive-selection-changed', 'selection changed; refresh and select again', 409);
      }
      const selected = new Set(selectedIds);
      captured = { sessions: captured.sessions.filter(row => selected.has(row.id)), skipped: [] };
    }
    if (captured.sessions.length > MAX_ELIGIBLE_SESSIONS) {
      throw failure('workspace-archive-too-many', 'workspace archive selection is too large', 400);
    }
    const expiresAt = issuedAt + CONFIRMATION_TTL_MS;
    const nonce = randomUUID();
    serial += 1;
    const token = createHmac('sha256', secret)
      .update(`${serial}:${nonce}:${expiresAt}`)
      .digest('base64url');
    const confirmation = {
      nonce,
      expiresAt,
      workspace: safeWorkspace(workspace),
      sessionIds: captured.sessions.map((session) => session.id),
      stopSessionIds: captured.sessions.filter(session => session.busy === true).map(session => session.id),
    };
    confirmations.set(token, confirmation);
    return {
      token,
      nonce,
      expiresAt: new Date(expiresAt).toISOString(),
      workspace: { ...confirmation.workspace },
      stopSessionIds: [...confirmation.stopSessionIds],
      sessions: captured.sessions.map((session) => ({ ...session })),
      skipped: captured.skipped.map((item) => ({ ...item })),
    };
  }

  async function execute(token, nonce, { stopActivity = false } = {}) {
    const confirmation = typeof token === 'string' ? confirmations.get(token) : undefined;
    if (confirmation === undefined || typeof nonce !== 'string' || nonce !== confirmation.nonce) {
      throw failure('workspace-archive-confirmation-invalid', 'workspace archive confirmation is invalid', 409);
    }
    if (stableNow(now).valueOf() >= confirmation.expiresAt) {
      confirmations.delete(token);
      throw failure('workspace-archive-confirmation-expired', 'workspace archive confirmation has expired', 409);
    }
    if (confirmation.stopSessionIds.length > 0 && !stopActivity) {
      throw failure('workspace-archive-stop-confirmation-required', 'confirm stopping active work before archiving', 409);
    }
```

</details>

**依据 2 · 源码核查**：[lib/workspace-bulk-archive.js:303-379](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/workspace-bulk-archive.js#L303-L379)

逐项复核、官方归档与部分结果。

<details>
<summary>查看原文（77行）</summary>

```text
        return !workspaces().some(workspace => asIds(workspace.sessionIds).some(entry => safeSession(entry)?.id === sessionId));
      }
      const workspace = await workspaceFor(confirmation.workspace.id);
      return workspace !== null && asIds(workspace.sessionIds).some(entry => safeSession(entry)?.id === sessionId);
    };
    for (const sessionId of confirmation.sessionIds) {
      const item = { archived: null, skipped: null, failed: null };
      const stopConfirmed = stopActivity && confirmation.stopSessionIds.includes(sessionId);
      try {
        await lifecycle.run(async () => {
          const excluded = async () => (await getExcludedIds(headers)).some(id => normalizeSessionId(id) === normalizeSessionId(sessionId));
          if (await excluded()) {
            item.skipped = { id: sessionId, reason: 'session-ineligible' };
            return;
          }
          if (!(await isMember(sessionId))) {
            item.skipped = { id: sessionId, reason: 'session-workspace-changed' };
            return;
          }
          if (!stopConfirmed && await sessionBusy(sessionId)) {
            item.skipped = { id: sessionId, reason: 'session-live' };
            return;
          }
          if (archivedIds().has(sessionId)) {
            item.skipped = { id: sessionId, reason: 'session-archived' };
            return;
          }
          const inspection = await conversationStatus(sessionId);
          if (inspection.status !== 'present') {
            item.skipped = { id: sessionId, reason: inspection.status === 'empty' ? 'session-empty' : 'session-unavailable' };
            return;
          }
          // Inspection yields to the Host; membership and task status may have
          // changed while the log was being read. Recheck before committing.
          if (await excluded()) {
            item.skipped = { id: sessionId, reason: 'session-ineligible' };
            return;
          }
          if (!(await isMember(sessionId))) {
            item.skipped = { id: sessionId, reason: 'session-workspace-changed' };
            return;
          }
          if (!stopConfirmed && await sessionBusy(sessionId)) {
            item.skipped = { id: sessionId, reason: 'session-live' };
            return;
          }
          if (archivedIds().has(sessionId)) {
            item.skipped = { id: sessionId, reason: 'session-archived' };
            return;
          }
          // Current official Host exposes this helper alongside archiveSession's
          // stopActivity option. Never emulate cancellation on older hosts.
          if (stopConfirmed && typeof registry.stopSessionActivity !== 'function') {
            item.failed = { id: sessionId, reason: 'stop-archive-unsupported' };
            return;
          }
          try {
            await registry.archiveSession.call(registry, sessionId, ...(stopConfirmed ? [{ stopActivity: true }] : []));
          } catch {
            item.failed = { id: sessionId, reason: 'archive-failed' };
            return;
          }
          if (!archivedIds().has(sessionId)) {
            item.failed = { id: sessionId, reason: 'archive-uncommitted' };
            return;
          }
          item.archived = sessionId;
        });
        if (item.archived !== null) {
          result.archived.push(item.archived);
        } else if (item.skipped !== null) result.skipped.push(item.skipped);
        else if (item.failed !== null) result.failed.push(item.failed);
        else result.failed.push({ id: sessionId, reason: 'lifecycle-failed' });
      } catch {
        result.failed.push({ id: sessionId, reason: 'lifecycle-failed' });
      }
    }
```

</details>

**依据 3 · 源码核查**：[lib/deletion.js:185-253](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/deletion.js#L185-L253)

删除计划、身份/子Agent范围与指纹确认。

<details>
<summary>查看原文（69行）</summary>

```text
      const present = new Set(headers.map(header => header.id));
      const currentRecords = await loadedTasks();
      const targets = record.cascadeSessionIds.filter(child => present.has(child) || currentRecords.has(child));
      cascade = await purgeDirect(targets, { allowUnarchived: new Set(targets), cascadeEnabled: false,
        requireIdle: record.purgeRequireIdle === true, confirmedScope: record.confirmedScope });
      if (cascade.failed.length > 0) {
        throw error('cascade-purge-pending', 'subagent deletion requires retry', 409, { ...cascade, deleted: [id, ...cascade.deleted] });
      }
    }
    const removed = await taskStore.remove(id);
    if (!removed.includes(id)) throw error('deletion-task-conflict', 'deletion task changed during purge', 409);
    invalidate?.([id]);
    return [id, ...cascade.deleted];
  }

  async function headerInventory() {
    let headers;
    try { headers = await persistence.list(); }
    catch { throw error('session-inventory-unavailable', 'session inventory is unavailable', 503); }
    if (!Array.isArray(headers) || headers.some(header => typeof header?.id !== 'string' || header.id === '')) {
      throw error('session-inventory-unavailable', 'session inventory is invalid', 503);
    }
    const seen = new Set();
    for (const header of headers) {
      const key = normalizeSessionId(header.id);
      if (key === null || key === '' || seen.has(key)) throw error('session-inventory-unavailable', 'session identity is ambiguous', 503);
      seen.add(key);
    }
    return headers;
  }

  async function cascadeTargets(id) {
    const headers = await headerInventory();
    const records = await loadedTasks();
    return [...resolveSubagentDescendants(headers, [id], { preserveIds: [...records.keys()].filter(key => key !== id) })];
  }

  async function verifyConfirmedScope(record) {
    const headers = await headerInventory();
    assertConfirmedDeletionScope(headers, record.confirmedScope);
    for (const target of record.confirmedScope) {
      await verifyPurgeScope(target.sessionId);
      await assertIdle?.(target.sessionId);
    }
  }

  async function buildPlan(ids, { requireArchived = true, validate } = {}) {
    const selected = uniqueIds(ids).sort();
    if (selected.length === 0) throw error('sessionIds-required', 'select chats to delete', 400);
    await validate?.(selected);
    const headers = await headerInventory();
    const records = await loadedTasks();
    const pending = await pendingStore?.load() ?? new Set();
    const archived = new Set((registry.archivedSessionIds ?? []).map(String));
    const descendants = resolveSubagentDescendants(headers, selected);
    const targets = [...selected, ...[...descendants].filter(id => !selected.includes(id)).sort()].map(id => {
      const header = headers.find(row => row.id === id);
      if (!header || !Number.isSafeInteger(header.createdAt) || header.createdAt < 0) throw error('session-location-unavailable', 'session identity is unavailable', 409);
      if (records.has(id) || pending.has(id)) throw error('session-deletion-pending', 'session deletion is pending', 409);
      if (requireArchived && selected.includes(id) && !archived.has(id)) throw error('session-not-archived', 'session is not archived', 404);
      return { sessionId: id, createdAt: header.createdAt };
    });
    if (typeof assertIdle !== 'function' || typeof verifyPurgeScope !== 'function'
      || typeof purgePhysical !== 'function' || typeof persistence.locate !== 'function') {
      throw error('purge-unsupported', 'physical purge is unavailable', 501);
    }
    for (const target of targets) {
      await verifyPurgeScope(target.sessionId);
      await assertIdle?.(target.sessionId);
```

</details>

**依据 4 · 源码核查**：[lib/deletion.js:268-315](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/deletion.js#L268-L315)

先持久意图、逐项删除和失败/重试结果。

<details>
<summary>查看原文（48行）</summary>

```text
      }
      const key = JSON.stringify(['delete', uniqueIds(ids).sort(), options.requireArchived !== false,
        options.fingerprint, options.confirmationKey ?? null]);
      const completed = completedResult(key);
      if (completed) return completed;
      const plan = await buildPlan(ids, options);
      if (options.fingerprint !== plan.fingerprint) {
        throw error('deletion-scope-changed', 'confirm the changed deletion scope', 409);
      }
      const result = await purgeDirect(plan.sessionIds, { allowUnarchived: new Set(plan.sessionIds), requireIdle: true,
        confirmedScope: plan.targets, validate: options.validate });
      rememberCompleted(key, result);
      return result;
    });
  }

  // Called only with the lifecycle lock held. Retry existing durable intent,
  // rather than replacing it and losing a previously captured descendant set.
  async function purgeDirect(ids, { allowUnarchived = new Set(), cascadeEnabled = true, validate, requireIdle = false, confirmedScope } = {}) {
    const deleted = [];
    const pending = [];
    const failed = [];
    for (const id of uniqueIds(ids)) {
      if (deleted.includes(id)) continue;
      try {
        const existing = (await loadedTasks()).get(id);
        if (existing === undefined) {
          if (typeof purgePhysical !== 'function' || typeof verifyPurgeScope !== 'function'
            || typeof persistence.locate !== 'function') throw error('purge-unsupported', 'physical purge is unavailable', 501);
          const source = await descriptor(id, { requireArchived: !allowUnarchived.has(id) });
          await verifyPurgeScope(id);
          await validate?.([id]);
          let scope;
          if (confirmedScope) {
            const descendants = cascadeEnabled ? await cascadeTargets(id) : [];
            const scopeIds = new Set([id, ...descendants]);
            scope = cascadeEnabled ? confirmedScope.filter(target => scopeIds.has(target.sessionId)) : confirmedScope;
            if ([...scopeIds].some(target => !scope.some(row => row.sessionId === target))
              || scope.find(target => target.sessionId === id)?.createdAt !== source.archive.createdAt) {
              throw error('deletion-scope-changed', 'confirm the changed deletion scope', 409);
            }
          }
          const at = now().toISOString();
          await taskStore.put({
            sessionId: id, taskId: randomUUID(), state: 'purge-pending', purgeRequestedAt: at,
            ...source.archive,
            ...(!cascadeEnabled ? { purgeSelectedOnly: true } : {}),
            ...(requireIdle ? { purgeRequireIdle: true } : {}),
```

</details>

**依据 5 · 源码核查**：[lib/deletion-safety.js:88-156](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/deletion-safety.js#L88-L156)

物理删除范围与重叠/路径验证。

<details>
<summary>查看原文（69行）</summary>

```text
 * been checked, so a lexical platform alias or higher link is never passed to
 * recursive removal.
 * Missing headers or directories are successful restart states, not permission
 * to infer a path from stale registry data.
 */
export async function resolveExclusiveSessionDirectory(persistence, sessionId) {
  if (!safeId(sessionId)) throw unsafe('session id is not a safe directory name');
  if (typeof persistence?.list !== 'function' || typeof persistence?.locate !== 'function') {
    throw unavailable('session location inventory is unavailable');
  }

  let headers;
  try { headers = await persistence.list(); }
  catch { throw unavailable('session location inventory is unavailable'); }
  if (!Array.isArray(headers)) throw unavailable('session location inventory is invalid');

  const ids = new Set();
  const entries = [];
  for (const header of headers) {
    const id = header?.id;
    if (!safeId(id) || ids.has(id)) throw unsafe('session location inventory has an unsafe or duplicate id');
    ids.add(id);
    let location;
    try { location = await persistence.locate(header); }
    catch { throw unavailable('session location inventory cannot be resolved'); }
    const rawPath = location?.path;
    if (typeof rawPath !== 'string' || rawPath === '' || rawPath.includes('\0') || !isAbsolute(rawPath)) {
      throw unsafe('session location must be an absolute file path');
    }
    const path = normalize(rawPath);
    if (path !== rawPath) throw unsafe('session location must be normalized');
    const directory = dirname(path);
    if (directory === parse(path).root || basename(directory) !== id) {
      throw unsafe('session location is not session-scoped');
    }
    entries.push({ id, path, directory });
  }

  const checkedCanonicalDirectories = new Set();
  for (const entry of entries) {
    const parent = dirname(entry.directory);
    const storageRoot = dirname(parent);
    if (storageRoot !== parse(storageRoot).root) {
      const storageRootStat = await checkedStat(storageRoot, 'storage-root ancestor', true);
      if (storageRootStat !== null && !storageRootStat.isDirectory()) throw unsafe('storage-root ancestor is not a directory');
    }
    const parentStat = await checkedStat(parent, 'session-root ancestor', true);
    if (parentStat !== null && !parentStat.isDirectory()) throw unsafe('session-root ancestor is not a directory');
    const directoryStat = await checkedStat(entry.directory, 'session directory', true);
    if (directoryStat === null) continue;
    if (!directoryStat.isDirectory()) throw unsafe('session directory is not a directory');
    try {
      entry.realDirectory = await realpath(entry.directory);
    } catch { throw unavailable('session location cannot be canonicalized'); }
    await checkCanonicalDirectoryAncestry(entry.realDirectory, checkedCanonicalDirectories);
    await checkSessionLogs(entry);
  }

  const target = entries.find((entry) => entry.id === sessionId && entry.realDirectory !== undefined);
  if (target === undefined) return { status: 'missing', sessionDirectory: null };
  for (const entry of entries) {
    if (entry === target || entry.realDirectory === undefined) continue;
    if (inside(target.realDirectory, entry.realDirectory)
      || inside(entry.realDirectory, target.realDirectory)) {
      throw unsafe('session locations overlap');
    }
  }
  return { status: 'present', sessionDirectory: target.realDirectory };
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:775-830](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L775-L830)

rm确认及后续多资源清理。

<details>
<summary>查看原文（56行）</summary>

```text
async function deleteSession(ctx, registry, persistence, id, titleCache, statsService, metadataStore, pendingStore, provenanceStore, beforeRemove) {
    const commit = async () => {
        const archived = registry.archivedSessionIds.map(String).includes(String(id));
        const pending = await pendingStore.load();
        if (!pending.has(String(id))) return 'cancelled';
        const scope = await resolveExclusiveSessionDirectory(persistence, String(id));
        if (scope.status === 'present') {
            if (beforeRemove) {
                await beforeRemove();
                // No await between the final live-state check and starting rm.
                const agent = ctx.get('agents')?.get(id);
                if (agent && agent.status !== 'idle') {
                    throw Object.assign(new Error('stop this chat before deleting it'), { code: 'unarchived-delete-running', status: 409 });
                }
                if (ctx.get('sessions')?.get(id) !== undefined) {
                    throw Object.assign(new Error('the chat resumed during deletion'), { code: 'unarchived-delete-changed', status: 409 });
                }
            }
            const sessionDirectory = scope.sessionDirectory;
            await rm(sessionDirectory, { recursive: true, force: true, ...RM_RETRY });
            try {
                await lstat(sessionDirectory);
                throw Object.assign(new Error('session directory still exists'), { code: 'session-delete-unconfirmed' });
            } catch (error) {
                if (error?.code !== 'ENOENT') throw error;
            }
        }
        // Cold sessions never emit session/disposed. Remove their cached client
        // summaries before any workspace/archive feed can make them visible.
        // Only announce removal after persistence confirms the session is gone.
        if (typeof ctx.emit === 'function') ctx.emit('api-session/removed', id);
        for (const workspace of registry.list()) {
            if (workspaceSessionIds(workspace).includes(String(id))) {
                await workspace.detachSession(id);
            }
        }
        // Purge the registry's in-memory header index (built once at startup from
        // persistence). Without this the stale header keeps the deleted session
        // "known" to the registry for the rest of this boot — it could be
        // re-archived as a ghost or re-accounted on the next workspace mutation.
        for (const key of ['headers', 'sessionPaths', 'invalidSessionPaths']) {
            const map = registry[key];
            if (map instanceof Map) map.delete(id);
        }
        // Keep archive protection until membership and stale indexes are gone.
        // Retain the durable intent if any cleanup fails so an explicit retry
        // can finish even after the original log has already been deleted.
        if (archived) await unarchiveIds(registry, [id]);
        await provenanceStore.remove([id]);
        await metadataStore.remove([id]);
        titleCache?.delete(id);
        statsService.invalidate([id]);
        await pendingStore.remove([id]);
        return 'deleted';
    };
    return commit();
```

</details>

**依据 7 · 源码核查**：[lib/durable.js:28-45](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/durable.js#L28-L45)

目录fsync平台边界。

<details>
<summary>查看原文（18行）</summary>

```text
/** Flush directory-entry changes where the platform exposes directory fsync. */
export async function syncDirectory(path, openFile = open) {
  let handle;
  try { handle = await openFile(path, 'r'); }
  catch (error) {
    if (directorySyncUnsupported(error)) return false;
    throw error;
  }
  try {
    await handle.sync();
    return true;
  } catch (error) {
    if (directorySyncUnsupported(error)) return false;
    throw error;
  } finally {
    await handle.close();
  }
}
```

</details>

**依据 8 · 源码核查**：[lib/durable.js:71-99](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/durable.js#L71-L99)

原子文件替换及fsync。

<details>
<summary>查看原文（29行）</summary>

```text
  const directory = dirname(filePath);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await chmod(directory, 0o700);
  let tempPath = null;
  try {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const candidate = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
      try {
        await writeFile(candidate, data, {
          ...(encoding === undefined ? {} : { encoding }),
          mode: 0o600,
          flag: 'wx',
        });
        tempPath = candidate;
        break;
      } catch (error) {
        await rm(candidate, { force: true }).catch(() => undefined);
        if (error?.code !== 'EEXIST' || attempt === 7) throw error;
      }
    }
    await chmod(tempPath, 0o600);
    await syncFile(tempPath);
    await replaceFile(tempPath, filePath);
    tempPath = null;
    await syncDirectory(directory);
  } finally {
    if (tempPath !== null) await rm(tempPath, { force: true }).catch(() => undefined);
  }
}
```

</details>

#### 缺口

- 没有实际跨进程并发、系统崩溃及所有平台目录行为证据
  **影响**：不能把插件内排队与耐久写扩展成全局无损删除保证
  **进一步探讨**：在脱敏副本注入目录变更、元数据失败、rm后中断和父子新增，核删除范围、任务残留及显式重试。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么人值得试用，首次、持续和失败处理要付出什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

适合已有大量本地DSH会话且愿意先在副本核查的人做小范围整理试用，首轮仅查看、搜索、标签及导出/副本恢复，不在唯一会话库上试永久删除。成功标准是能找回预先指定对话，导出后可还原其事件和关系，warnings可解释；仅对话数量相同不够。若出现内容缺失、范围确认改变或持久化警告，应停止写操作，保留源库和导出包，回到宿主单条归档/文件备份办法。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地副本、磁盘与匹配宿主；金额未知 | 核版本、备份和代表会话 | 无服务订阅路径不等于总成本为零 |
| 持续使用 | 全文投影CPU/内存、ZIP和额外磁盘 | 核查询范围、标签、警告 | 缓存和预算有界，实际规模耗时未知 |
| 失败恢复 | 源库、导出包及待办保留空间 | 解释部分归档、恢复warning和删除任务 | rollback/重试需人工，不保证强杀原子性 |
| 退出 | 留存元数据/谱系/待办文件 | 先解决删除待办并保存备份，再禁用插件 | 宿主会话不由禁用自动恢复，插件数据需保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 找回与整理 | 有界全文、标签及项目批量处理接线 | 真实查找成功率和节时 |
| 转存 | manifest+JSON+Markdown校验 | 附件完整性及任意崩溃恢复 |
| 删除管理 | 显式确认、持久意图与重试 | 任意外部并发/平台安全保证 |

判断的是一次正确找回或可解释整理任务，不是每秒处理条数。真实任务量、工时与成功数缺失，不能输出单位成本或ROI。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:6-26](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/search.js#L6-L26)

资源上限与缓存。

<details>
<summary>查看原文（21行）</summary>

```text
export const PREVIEW_LIMITS = Object.freeze({
  defaultPageSize: 50,
  maxPageSize: 200,
  maxSegmentCodePoints: 256 * 1024,
  maxIdentityCodePoints: 1024,
  maxSegmentsPerMessage: 1000,
  maxMessageCodePoints: 1024 * 1024,
  maxProjectedMessages: 10000,
});

export const SEARCH_LIMITS = Object.freeze({
  maxQueryCodePoints: 200,
  defaultSessions: 50,
  maxSessions: 100,
  matchesPerSession: 3,
  excerptCodePoints: 240,
  concurrency: 4,
  cacheEntries: 64,
  cacheTtlMs: 30_000,
  maxCachedCodePoints: 2 * 1024 * 1024,
});
```

</details>

**依据 2 · 源码核查**：[lib/restore.js:405-445](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L405-L445)

附件/工作区warning及恢复提交。

<details>
<summary>查看原文（41行）</summary>

```text
            const result = await writer.write(payload, (undo) => { transaction._undos[transaction._undos.length - 1] = undo; });
            const ownedUndo = resolveUndo(result, fallbackUndo);
            transaction._undos[transaction._undos.length - 1] = ownedUndo;
            if (typeof result?.finish === 'function') finishWrites.push(result.finish);
            const workspace = workspaceFor(registry, item.workspace?.id);
            if (workspace === null) {
              warnings.push(...warningFor(item));
            } else if (!workspaceSessionIds(workspace).includes(item.id)) {
              if (typeof workspace.attachSession !== 'function' || typeof workspace.detachSession !== 'function') {
                warnings.push(...warningFor(item));
              } else {
                transaction._workspaceUndos.push(() => workspaceSessionIds(workspace).includes(item.id)
                  ? workspace.detachSession(item.id)
                  : undefined);
                await workspace.attachSession(item.id);
              }
            }
            if (item.hasAttachmentReferences) warnings.push({ id: item.id, reason: 'attachments-not-included' });
            transaction._metadataTouched.push(item.id);
            await metadataStore.set(item.id, { tags: item.tags, note: item.note });
            restored.push(item.id);
          }
          const current = registry.archivedSessionIds.map(String);
          transaction._registryAttempted = true;
          await registry.setState({ ...registry.state, archivedSessionIds: [...current, ...restored] });
          for (const finish of finishWrites) await finish();
          await cleanup();
          committed = true;
        } catch (error) {
          try { await transaction.rollback(); }
          catch (rollbackError) { throw rollbackError; }
          throw error;
        }
        warnings.push(...await publishColdTitles(ctx, staged, titlePublicationTimeoutMs));
        return { restored, warnings };
      },
    };
    return transaction;
  }

  return { capability, prepare };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1918-1946](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L1918-L1946)

插件数据与延迟加载，删除任务不自动执行。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx) {
    let registered = false;
    /** Memoized session titles for {@link listArchived} (id → title). */
    const titleCache = new Map();
    const metadataPath = join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'plugin-data', 'archived-chats', 'metadata.json');
    const pluginDataRoot = dirname(metadataPath);
    const metadataStore = createMetadataStore({ filePath: metadataPath });
    const pendingStore = createPendingStore();
    const deletionStore = createDeletionTaskStore({ path: join(pluginDataRoot, 'deletion-tasks.json'), previousPath: join(pluginDataRoot, 'trash.json') });
    const provenanceStore = createForkProvenanceStore({ filePath: join(pluginDataRoot, 'fork-provenance.json') });
    const lifecycle = createLifecycleQueue();
    const forkTracking = observeOfficialForks({ ctx, store: provenanceStore, runExclusive: operation => lifecycle.run(operation), readHeader: async id => {
        const live = ctx.get('sessions')?.get(id)?.header;
        if (live) return live;
        const raw = ctx.get(PERSISTENCE_KEYS[0]);
        if (!raw) return undefined;
        return (await resolvePersistenceCompat(raw).list()).find(header => header.id === id);
    } });
    const importTokens = createImportTokenStore();
    let statsService;
    const registerWebSurface = () => {
        if (registered) return;
        const webServer = ctx.get(WEB_SERVER_KEYS[0]) ?? ctx.get(WEB_SERVER_KEYS[1]);
        const registry = ctx.get(WORKSPACE_KEYS[0]) ?? ctx.get(WORKSPACE_KEYS[1]);
        const rawPersistence = ctx.get(PERSISTENCE_KEYS[0]);
        if (webServer === undefined || registry === undefined || rawPersistence === undefined) return;
        const persistence = resolvePersistenceCompat(rawPersistence);
        registered = true;
        statsService ??= createStatsService({ persistence });
```

</details>

**依据 4 · 源码核查**：[lib/deletion.js:331-350](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/deletion.js#L331-L350)

显式taskId重试的适用范围。

<details>
<summary>查看原文（20行）</summary>

```text
    const records = await loadedTasks();
    const retryTargets = [...new Set(pending)].filter(id => records.has(id))
      .map(id => ({ sessionId: id, taskId: records.get(id).taskId }));
    return { deleted: [...new Set(deleted)], pending: [...new Set(pending)], failed, retryTargets };
  }

  async function legacyRemove(ids, options) {
    try { return await remove(ids, options); }
    catch (cause) {
      if (cause?.status === 503) throw cause;
      return { deleted: [], pending: [], failed: uniqueIds(ids).map(id => failure(id, cause)), retryTargets: [] };
    }
  }
  const deleteArchived = (ids, options) => legacyRemove(ids, options);

  async function retry(targets) {
    return lifecycle.run(async () => {
      if (!Array.isArray(targets) || targets.length === 0 || targets.some(target => typeof target?.sessionId !== 'string' || target.sessionId === ''
        || typeof target.taskId !== 'string' || target.taskId === '')) throw error('deletion-task-missing', 'deletion task is missing', 409);
      const key = JSON.stringify(['retry', targets.map(target => [target.sessionId, target.taskId]).sort()]);
```

</details>

#### 缺口

- 没有真实任务集的合格交付数、工时与资源数据
  **影响**：不能量化采用收益或单位合格任务成本
  **进一步探讨**：记录同批脱敏会话的找回正确率、整理错误、人工工时、存储与恢复成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 怎样把“已导出”推进成用户能判断的“可恢复后再整理”？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

待验证设计假设是增加显式的恢复核对清单，比单纯把ZIP导出成功当备份完成更能降低误判。依据是Q04中JSON/Markdown预检已有，而附件本体、目标工作区和强杀恢复仍有缺口；Q05中永久删除又是不可逆的物理动作。候选清单应分别核会话身份、事件计数/摘要、继承关系、工作区去向、实际附件可达性，以及哪些warning仍未解决。仅在副本恢复结果与清单一致时提示用户是否继续整理，不能把提示变成自动授权删除。

最小实验用含继承、附件、缺工作区和超预算的脱敏备份，与现有只展示导出/导入结果的流程对照，让用户指出“可恢复、部分可恢复、未知”的对象。记录错误判为完整恢复的数量、核对时间和额外磁盘成本。只有误判减少且负担可接受时才支持设计；如果用户仍依赖手工逐文件检查，或清单给出错误完整性承诺，应放弃自动结论，仅展示可核实项。这是未验证假设，不是当前产品的无损恢复保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/export.js:470-490](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/export.js#L470-L490)

已有导出结构语义校验。

<details>
<summary>查看原文（21行）</summary>

```text
      || validateJsonValue(record, limits) !== null) fail(`export session ${item.id} exceeds import limits`, item.id);
    totalBytes += jsonBytes + markdownBytes;
    if (totalBytes > limits.maxUncompressedBytes) fail('export package exceeds import expansion limit');
    staged.push({ source: json, name: item.files.json }, { source: markdown, name: item.files.markdown });
    inspected = null;
    if (index === 0) firstInspection = null;
  }
  const semanticErrors = validateBackupSemantics(manifest, records);
  if (records.some((record) => record.version === 1 && record.source?.meta?.isSeeded === true)) {
    semanticErrors.push({ code: 'source-invalid', path: '$.source.meta.isSeeded', message: 'seeded v1 sources lack an inherited boundary' });
  }
  if (semanticErrors.length > 0) {
    throw Object.assign(new Error('export source is invalid'), { code: 'export-source-invalid', errors: semanticErrors });
  }

  return { staged, entryDate: new Date(plan.exportedAt) };
}

/** Validate the same import budgets and source semantics without starting a ZIP. */
export async function validateExport(options) {
  await prepareExport(options);
```

</details>

**依据 2 · 源码核查**：[lib/restore.js:423-445](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/restore.js#L423-L445)

仍有附件/工作区和标题警告。

<details>
<summary>查看原文（23行）</summary>

```text
            transaction._metadataTouched.push(item.id);
            await metadataStore.set(item.id, { tags: item.tags, note: item.note });
            restored.push(item.id);
          }
          const current = registry.archivedSessionIds.map(String);
          transaction._registryAttempted = true;
          await registry.setState({ ...registry.state, archivedSessionIds: [...current, ...restored] });
          for (const finish of finishWrites) await finish();
          await cleanup();
          committed = true;
        } catch (error) {
          try { await transaction.rollback(); }
          catch (rollbackError) { throw rollbackError; }
          throw error;
        }
        warnings.push(...await publishColdTitles(ctx, staged, titlePublicationTimeoutMs));
        return { restored, warnings };
      },
    };
    return transaction;
  }

  return { capability, prepare };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:775-799](https://github.com/Ultroncn/dsh-archived-chats/blob/1595809e252e798fb7afd8ea001b09e5fc0e6958/lib/index.js#L775-L799)

整理中的物理删除实际不可逆。

<details>
<summary>查看原文（25行）</summary>

```text
async function deleteSession(ctx, registry, persistence, id, titleCache, statsService, metadataStore, pendingStore, provenanceStore, beforeRemove) {
    const commit = async () => {
        const archived = registry.archivedSessionIds.map(String).includes(String(id));
        const pending = await pendingStore.load();
        if (!pending.has(String(id))) return 'cancelled';
        const scope = await resolveExclusiveSessionDirectory(persistence, String(id));
        if (scope.status === 'present') {
            if (beforeRemove) {
                await beforeRemove();
                // No await between the final live-state check and starting rm.
                const agent = ctx.get('agents')?.get(id);
                if (agent && agent.status !== 'idle') {
                    throw Object.assign(new Error('stop this chat before deleting it'), { code: 'unarchived-delete-running', status: 409 });
                }
                if (ctx.get('sessions')?.get(id) !== undefined) {
                    throw Object.assign(new Error('the chat resumed during deletion'), { code: 'unarchived-delete-changed', status: 409 });
                }
            }
            const sessionDirectory = scope.sessionDirectory;
            await rm(sessionDirectory, { recursive: true, force: true, ...RM_RETRY });
            try {
                await lstat(sessionDirectory);
                throw Object.assign(new Error('session directory still exists'), { code: 'session-delete-unconfirmed' });
            } catch (error) {
                if (error?.code !== 'ENOENT') throw error;
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
