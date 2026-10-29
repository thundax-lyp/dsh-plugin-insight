# Archive Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6b8babc](https://github.com/MichengAI/dsh-archive-manager/tree/6b8babc7b7f8da44466c7bd611ad29e66408623c)

<!-- BEGIN META -->
[![GitHub ★ 262](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=262&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-archive-manager) [![npm 30d 70,634](https://img.shields.io/static/v1?label=npm+30d&message=70%2C634&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-archive-manager)
<!-- END META -->

> **功能**：集中归档、恢复、收藏和搜索 DSH 会话，提供缓存重建、跨工作区移动及永久物理清理入口。

> **亮点**：冷会话只读查询、官方投影重建身份复核与回读，以及删除物理成功后记账是明确工程增量；减少用户为查会话而恢复实例的步骤，见 [Q01](#research-q01) 和 [Q03](#research-q03)。

> **主要限制**：父删除成功可能掩盖子Agent清理失败；移动临时备份成功即删除，flush失败部分被吞，无法承诺全局事务或永久恢复点。物理操作须分层验证，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

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
  - [Q01 · 相对原生归档，用户多了什么，搜索查到什么？](#detail-section-11)
  - [Q02 · 永久删除是否可以当成全有或全无的清理？](#detail-section-12)
  - [Q03 · 缓存重建和跨工作区移动分别写什么？](#detail-section-13)
  - [Q04 · 如何分层采用，下一步值得验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：大量DSH会话用户可通过只读预览/检索找回对话并组织归档，物理清理另行验收；正文不是全部工具和附件内容，见 [Q01](#research-q01)。

原生会话归档恢复与手工日志/存储操作。插件贡献是集中组织、非激活预览、批量操作及恢复反馈，核心生命周期和缓存能力继承宿主，不能当新备份系统。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 文本查询 | 冷会话用户/助手正文定位 | 无工具/附件完整检索，无持久全文索引 |
| 缓存重建 | 恢复官方投影可见性 | 不修转录内容，超时不取消 |
| 永久删除 | 清父工件、子代理及记账 | 子错误仅日志，非全有全无 |
| 移动 | 改cwd、工件位置和工作区 | 临时备份不是永久恢复点 |

**流程与依赖**

| 依赖 | 用途与条件 | 不满足时 |
|---|---|---|
| 匹配DSH 0.2 RC profile | 原生Session/Workspace/Client组合 | peer范围不代表完整运行验证 |
| Persistence只读/open/locate | 检索与物理定位 | 不支持只读提示开完整会话；未知布局只删工件 |
| ProjectionCache/StorageDomain/Typert | 重建、收藏与远程方法 | 服务缺失对应功能失败 |
| 独立数据副本/备份 | 验证删除和移动的恢复 | 临时移动备份不等于长期备份 |

| 阶段 | 操作 | 成功与失败处理 |
|---|---|---|
| 查询 | 先按项目日期缩小范围 | 查文本与失败项，不激活冷会话 |
| 组织 | 收藏、归档或恢复 | 比对宿主集合与实际可打开 |
| 重建 | 确认候选并逐对象重建 | 回读持久投影；超时保留未知 |
| 移动 | 仅副本检查cwd、路径和记账 | 核回滚/备份，不以缓存预热当成功 |
| 清理 | 独立确认父与子及残留 | 不把父成功当级联完整 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 备份存储空间未知 | profile/版本、数据副本和会话核对 |
| 持续 | 扫日志I/O与投影写盘未知 | 大量日志过滤和宿主升级适配 |
| 异常 | 残留与备份空间未知 | 逐文件/子会话/记账核对恢复 |
| 退出 | 删除无法靠卸载撤销 | 保留独立备份、已改cwd须另恢复 |

| 效果项 | 源码支持 | 未知 |
|---|---|---|
| 找会话 | 不激活冷会话读用户/助手文本 | 大量日志耗时与查全率 |
| 缓存可见性 | 官方回读与身份复核 | 实际宿主队列和迟到写一致性 |
| 清空间 | 有物理删路径 | 子失败可能残留，不能凭父回执保证 |

> **思考**：父删除成功可能掩盖子Agent清理失败；移动临时备份成功即删除，flush失败部分被吞，无法承诺全局事务或永久恢复点。物理操作须分层验证，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：冷会话只读查询、官方投影重建身份复核与回读，以及删除物理成功后记账是明确工程增量；减少用户为查会话而恢复实例的步骤，见 [Q01](#research-q01) 和 [Q03](#research-q03)。

[Q03](#research-q03) 身份复核、官方投影回读和生命周期排队值得借鉴；[Q02](#research-q02) 子级失败仅日志说明对象结果须传播到父UI。永久清理和移动都不应以“原子”名称代替跨对象证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

父删除成功可能掩盖子Agent清理失败；移动临时备份成功即删除，flush失败部分被吞，无法承诺全局事务或永久恢复点。物理操作须分层验证，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

匹配宿主且有独立副本可先试用查询/收藏和归档恢复；移动、永久删除单独验证，重要数据不直接清理。失败核实际对象而不是盲重试，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表生命周期链静态核查完成。建议只读/可逆功能试用，物理移动删除不在重要数据直接采用；没有运行清理或故障恢复实验。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、package.json、src/archive-discovery.ts、src/cache-rebuild.ts、src/client.ts、src/session-move.ts、src/workspace.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根统计，抽读发布入口、Workspace远程方法、只读发现/预览、代表物理删除、投影重建及移动事务恢复；未审计在线更新、安全路由全链、全部UI及所有格式，不运行目标。
- 下一步：在备份副本比较检索耗时/查全与原生办法，故障注入子删除、枚举、flush、磁盘、记账和迟到缓存，逐文件/索引/子会话检查。该实验未发生，本轮仅源码。

**分析版本**

- **仓库**：[MichengAI/dsh-archive-manager](https://github.com/MichengAI/dsh-archive-manager)
- **版本号**：1.1.18（[固定提交 6b8babc](https://github.com/MichengAI/dsh-archive-manager/tree/6b8babc7b7f8da44466c7bd611ad29e66408623c)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按父/子/spill/缓存/记账返回对象级清理证据并重扫确认，可能减少把父成功误当彻底删除；未实现且需求未知，见 [Q04](#research-q04)。

在备份副本比较检索耗时/查全与原生办法，故障注入子删除、枚举、flush、磁盘、记账和迟到缓存，逐文件/索引/子会话检查。该实验未发生，本轮仅源码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1952 | — | — | 33610 |
| .js | source | 20 | 3574 | 3499 | 94 | — |
| .mjs | source | 8 | 600 | 533 | 26 | — |
| .ts | source | 32 | 10232 | 9252 | 673 | — |
| .mjs | test | 39 | 8667 | 7795 | 299 | — |
| .mjs | example | 4 | 605 | 573 | 18 | — |
| .ts | test | 1 | 30 | 19 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-archive-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=60&color=737b86&logo=github)](https://github.com/MichengAI/dsh-archive-manager/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=60&color=737b86&logo=github)](https://github.com/MichengAI/dsh-archive-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分可逆会话组织与物理数据变更，核查删除、缓存重建和移动的成功及恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对原生归档，用户多了什么，搜索查到什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是DSH原生插件@michengai/dsh-archive-manager 1.1.18，不是独立会话备份服务。README中文仍描述1.1.17，版本以固定package为准。目标是积累大量开发会话的个人用户，集中归档、恢复、收藏、搜索、预览和管理工作区；相较原生逐条归档及手工读日志，增量在组织界面与冷会话可见性，底层会话生命周期仍借宿主能力。

只读检索不调用prepare/enter来激活冷会话，已运行实例取snapshotEvents，冷会话用persistence.open(read)读事件并关闭。extractConversation只接受user/message和assistant/message，过滤非用户source和非text块，因而不是工具输出、附件、推理或所有上下文的完整全文索引。搜索逐会话处理并返回失败项；预览限附近/最近八条、每条2000 UTF-16码元。README也承认没有持久化全文索引，大量日志需要时间，故价值是无需恢复即可定位部分对话文本，不是零成本全量知识检索。依赖宿主Workspace、Session、Persistence、ProjectionCache、StorageDomain、Typert与Web界面版本一致，广范围peer声明不能当实测兼容。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-20](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/package.json#L2-L20)

版本、范围、入口。

<details>
<summary>查看原文（19行）</summary>

```text
  "name": "@michengai/dsh-archive-manager",
  "version": "1.1.18",
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
    "./locale/*.json": "./locale/*.json"
  },
```

</details>

**依据 2 · 源码核查**：[README.zh-CN.md:22-42](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/README.zh-CN.md#L22-L42)

版本滞后及组织/删除能力主张。

<details>
<summary>查看原文（21行）</summary>

```text
本文描述 **1.1.17**。已发布变更见[更新日志](CHANGELOG.zh-CN.md)。

## 功能概览

把暂时不用的会话收起来，需要时再找回，让日常任务列表更清爽。

- **多视图与侧栏直达**：支持开启主侧边栏直接导航入口，在主工作区以 **960px 居中版心** 展开「已归档」与「未归档」完整大面板，告别狭窄弹窗。
- **全生命周期管理**：支持单条会话归档、全工作区一键归档、跨项目批量归档、单条/批量恢复并打开会话。
- **侧栏全行右键操作**：支持直接右键点击侧栏工作区行或会话行空白处唤起专属操作菜单；未分组工作区行与空白未落盘会话行优雅放行系统原生右键菜单，杜绝误触新建或星标。
- **侧栏星标对齐与状态点共存（#90, #92）**：收藏星标对齐 16×16px 宿主标准尺寸，通过绝对定位精确复用前导插槽位置，消除侧栏会话标题左右微小抖动；当会话处于运行中或等待交互时，原生状态指示点保持 100% 可见，星标自适应转为右下角 10px 金色角标，实现状态与收藏完美共存，保护原生选择器与第三方皮肤插件兼容性。
- **工作区快捷操作菜单**：侧栏工作区提供快速「复制目录」、「打开目录」（在系统文件管理器 Windows Explorer / macOS Finder 中直接打开）及一键「归档会话」。
- **会话跨工作区移动**：会话操作菜单支持级联悬停子菜单直接跨工作区迁移会话，采用进程锁静默停靠与原子级改写校验，投影缓存即时预热彻底消除临时“未命名”，安全兼容含冒号的 IM 会话。
- **一体化抽屉与 40px 超紧凑列表**：工作区分组采用与技能管理同款的一体化卡片抽屉设计，折叠顶栏（高 38px）与下方列表融为一体；会话列表项行高超紧凑化至 40px，信息密度显著提升。
- **暗黑模式原生复选框规范**：复选框严格回归宿主原生原语 Checkbox 规范，使用原生 `accent-color` 完美适配深色模式（深暗底色与品牌蓝选中态），根除白底白勾刺眼方块 bug。
- **模态弹窗防穿透与本地化无障碍**：宽版预览弹窗直挂 body 根节点消除局部包含块限制，配合实色底与毛玻璃高斯模糊彻底杜绝文字穿透重叠；全量弹窗右上角 X 关闭按钮完整支持三语本地化无障碍标签（`common.close`）。
- **纯净自适应单行工具栏**：采用宿主原生 `Input` 原语，内置官方放大镜图标与绿色呼吸聚焦边框，自适应弹性撑满；控件按「输入框、查询条件、所有项目、时间选择」极简单行排列，锁死盒模型杜绝溢出重叠。
- **全文联合检索与 Codex 复合菜单**：默认自动联合搜索标题与正文历史（用户与助手消息）；将会话筛选（全部/只看收藏）与排序收归为 Codex 风格两段式复合菜单，完全采用宿主原生对勾原语。
- **轻量单字段日期胶囊与日历浮层**：彻底告别原生日期选择器的暗黑模式反白与失焦缺陷（#74），单行展示时间范围；浮层支持快捷预设、中英俄三语原生排版，以及完备的 WAI-ARIA 键盘无障碍漫游（上下左右键、Home/End、PageUp/Down 及月末夹紧）与高亮区间实时拉伸预览。
- **智能闲置会话整理**：自定义闲置天数，自动分析并排除正在运行、等待交互及已收藏的关键会话，支持预览候选后确认归档，并提供误操作撤回机制。
- **永久彻底清理**：确认后永久删除不再需要的会话，彻底清除物理日志、索引与缓存，支持错误项独立重试。
- **无主孤儿子代理检测与物理清理**：自动探测母会话已被外部物理删除的残留子代理，在会话整理中直观展示空间占用并支持一键物理释放。
```

</details>

**依据 3 · 源码核查**：[README.zh-CN.md:64-67](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/README.zh-CN.md#L64-L67)

预览限制和无全文索引声明。

```text
- 正文命中显示片段和关键词高亮；已归档页点击片段或「更多 → 快速预览」查看上下文，不恢复会话；未归档页点击片段打开完整会话。没有关键词时预览最近八条消息，有关键词时定位首个命中附近。
- 检索逐批读取，每批最多 20 条会话，批内逐条读取；关键词最多 200 字符。预览每条最多 2000 个 UTF-16 码元，截断保留完整 Unicode 字符，较长内容请打开完整会话。
- 搜索与预览不包含工具输出、附件、推理、系统或插件注入消息；读取失败会显示详情并支持重试。检索的是持久化原始文本，不等同于模型当前上下文。
- 未建立持久化全文索引，大量或超长会话可能需要较久，建议先缩小项目、日期或收藏范围；尚无可承诺的会话数量上限或响应时延；更改条件会停止后续批次，正在读取的单批仍会完成，但旧结果不会覆盖新筛选。
```

**依据 4 · 源码核查**：[src/workspace.ts:533-549](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L533-L549)

只读冷会话接线。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 5 · 源码核查**：[src/workspace.ts:552-578](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L552-L578)

按会话搜索和失败项。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[src/archive-discovery.ts:80-95](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/archive-discovery.ts#L80-L95)

实际正文提取白名单。

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

- 未运行大量日志检索及宿主兼容矩阵。
  **影响**：不能由源码直接保证真实存储和宿主数据操作结果。
  **进一步探讨**：用副本比较原生查找与插件搜索的准确率、延迟和占用，核对工具内容漏查预期。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 永久删除是否可以当成全有或全无的清理？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

不能。UI提供永久删除确认，批量入口在enqueueOperation中逐目标执行，分别返回成功/已消失/失败；删除核心先flush并detach实时会话、删投影缓存、处理子Agent和spill、删物理转录，之后清父会话归档/工作区记账及索引。已知JSONL目录验证所有权并拒绝项目/会话符号链接，其他后端退到仅工件删除；lstat到rm并非跨进程原子防护。物理删除失败会保留父记账供重试，但不能恢复此前已删缓存或子对象。

更关键的反证是deleteDescendants对每个子会话删除失败及枚举失败只记录warn，不抛回父核心；父仍继续删自身并可返回deleted:true。级联只认origin=subagent，fork不会跟删，这是合理独立会话边界；但“所有子Agent和记录彻底清除”的UI文案不能作为已完成证明。子Agent可能变成孤儿，存在后续孤儿检测入口不等于本次级联已完整完成。永久删除没有撤回，普通归档恢复与物理清理必须分层采用，不能把清理成功条数当释放全量空间或无残留证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:1565-1572](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/client.ts#L1565-L1572)

永久删除确认按钮。

```text
                }), (0, react_jsx_runtime.jsx)(SettingsModal, {
					t,
					open: deleteTarget !== null,
					onClose: closeDelete,
					title: deleteDialogTitle,
					...deleteDialogDescription === void 0 ? {} : { description: deleteDialogDescription },
					footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [modalFooterButton({ disabled: busy, onClick: closeDelete, children: t("cancel") }), modalFooterButton({ danger: true, disabled: busy, onClick: confirmDelete, children: deleteConfirmLabel })] }),
					children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
```

**依据 2 · 源码核查**：[src/workspace.ts:814-843](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L814-L843)

批量成功/跳过/失败分开。

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

**依据 3 · 源码核查**：[src/workspace.ts:893-937](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L893-L937)

删除顺序和成功后记账。

<details>
<summary>查看原文（45行）</summary>

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
			// 持久化屏障先行：不能有未落盘的转录写入与目录删除竞争
			//（持久化后端按批关闭句柄，flush 过的会话不再持有打开的文件）。
			await sessions.flush(live);
			// 从存储分离；`session/disposed` 同步触发，驱动浏览器端的
			// `host/session-removed` 帧并启动投影缓存的最终写后落盘。
			const entry = sessions.liveEntryFor(live);
			sessions.detachEntered(entry);
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
		// 物理删除已成功：此时再清父类索引。后续记账失败时保留索引，便于重试。
		this.forgetIndexedSession(sessionId);
		this.publishDeletedSession(sessionId);
		return { deleted: true };
```

</details>

**依据 4 · 源码核查**：[src/workspace.ts:992-1035](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L992-L1035)

目录所有权、链接检查和删除自证。

<details>
<summary>查看原文（44行）</summary>

```text
		let target = { path: location.path, kind: "transcript artifact" };
		try {
			const directory = jsonlSessionDirectory(persistence, header, location);
			if (directory !== void 0) {
				target = { path: directory, kind: "session directory" };
				// The configured storage root may itself be an intentional alias, but
				// project/session links must not redirect recursive deletion elsewhere.
				// These checks assume trusted, stable storage ancestors; lstat + rm
				// is not an atomic defense against another process swapping directories.
				for (const path of [dirname(directory), directory]) {
					let stat;
					try {
						stat = await lstat(path);
					} catch (error) {
						if (errorCode(error) === "ENOENT") continue; // Already removed on an earlier attempt.
						throw error;
					}
					if (stat.isSymbolicLink())
						throw new Error(`refusing to delete through symbolic link "${path}"`);
					if (!stat.isDirectory())
						throw new Error(`expected session storage directory "${path}"`);
				}
			} else if (persistence.name === "session-persistence-jsonl") {
				this.ctx.logger.warn(
					`archive-manager: session "${sessionId}": JSONL directory ownership could not be verified; falling back to artifact-only deletion at "${location.path}" (parent directory retained)`,
				);
			}
			const existed = await pathExists(target.path);
			await rm(target.path, { recursive: true, force: true });
			// stat 不读日志。它抛错只说明无法自证，不能当成已经删掉。
			// 只有删除前目标确实存在、删除后该路径已消失，才接受这次校验失败。
			if (typeof persistence.stat === "function") {
				try {
					const postStat = await persistence.stat(sessionId);
					if (postStat !== void 0) {
						throw new PersistenceStillPresentError(sessionId);
					}
				} catch (error) {
					if (error instanceof PersistenceStillPresentError) throw error;
					const gone = !(await pathExists(target.path));
					if (!existed || !gone) {
						throw new Error(
							`cannot verify removal of session "${sessionId}": stat failed and "${target.path}" was not a present artifact removed by this deletion`,
						);
```

</details>

**依据 5 · 源码核查**：[src/workspace.ts:1068-1108](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L1068-L1108)

只级联subagent但子失败仅日志，父继续。

<details>
<summary>查看原文（41行）</summary>

```text
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
		}
```

</details>

**依据 6 · 源码核查**：[src/client.ts:3025-3026](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/client.ts#L3025-L3026)

UI称清全部子代理和记录，不可撤回。

```text
			"deleteSession.confirmTitle": "Delete session?",
			"deleteSession.desc": "This permanently deletes session “{name}”, its child agents (including any that are still running), and all of its records (conversation, stats, cache). This cannot be undone.",
```

#### 缺口

- 真实删除、跨进程竞争和孤儿重扫未验证。
  **影响**：不能由源码直接保证真实存储和宿主数据操作结果。
  **进一步探讨**：只在完整备份副本注入子删除/枚举失败，核对父返回、剩余文件、孤儿检测和重试，不在重要会话试错。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缓存重建和跨工作区移动分别写什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

缓存重建不是修复转录内容。诊断从头部和官方投影看冷会话候选，实际重建逐目标进入官方操作队列，读前后复核header identity与资格，open(read)完整日志产生coldSnapshot，再通过cachedSnapshot深比较确认；超时只代表未确认，不取消已入队写。与删除排队是避免迟到缓存复活的关键条件，不能把关页面当停止服务端。

跨工作区移动则会改转录cwd并改变物理位置与记账，不只是界面分组。入口排队且检查运行状态，空闲实时对象会释放所有权；但flush、cancel和detach部分错误被吞，因此未实测不能称绝对安全。目标同名拒绝覆盖，源目录移到备份、stage写目标再rename，失败尝试回滚，回滚失败报备份地址。成功后备份主动删除，缓存预热失败仅warn；这份临时备份不能当永久恢复点。README声称“原子级改写”不能推导跨文件、索引和进程的全局事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:742-754](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L742-L754)

官方缓存诊断。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[src/workspace.ts:765-803](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L765-L803)

入队、身份复核、只读源和确认。

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

**依据 3 · 源码核查**：[src/cache-rebuild.ts:9-26](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/cache-rebuild.ts#L9-L26)

写后深比较，超时不等于取消。

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

**依据 4 · 源码核查**：[src/workspace.ts:1242-1256](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L1242-L1256)

移动进入操作链。

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

**依据 5 · 源码核查**：[src/session-move.ts:185-229](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/session-move.ts#L185-L229)

拒运行，但flush/cancel/detach错误吞掉。

<details>
<summary>查看原文（45行）</summary>

```text
	const liveSession = ctx.sessions?.get?.(cleanSessionId) as {
		running?: boolean;
		status?: string;
	} | undefined;

	const agent = ctx.agents?.get?.(cleanSessionId);

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
		}
```

</details>

**依据 6 · 源码核查**：[src/session-move.ts:330-377](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/session-move.ts#L330-L377)

目标冲突、临时备份、改cwd和stage落盘。

<details>
<summary>查看原文（48行）</summary>

```text
		targetOccupied = true;
	} catch {}
	if (targetOccupied) {
		throw new Error(`目标工作区已存在同名会话工件，拒绝覆盖: ${targetLogPath}`);
	}

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
		stageFile = null;

		// c. 读回校验
		const readbackBytes = await readFile(targetLogPath);
		if (readbackBytes.length === 0) throw new Error("目标写入工件为空");
```

</details>

**依据 7 · 源码核查**：[src/session-move.ts:396-465](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/session-move.ts#L396-L465)

缓存预热降级、回滚和成功清备份。

<details>
<summary>查看原文（70行）</summary>

```text
		// e. 宿主记账同步
		for (const ws of sourceWorkspaces) {
			await ws.detachSession(cleanSessionId);
			detachedWorkspaces.push(ws);
		}
		await targetWorkspace.attachSession(cleanSessionId);
		targetAttached = true;

		if (ctx.sessionProjectionCache && typeof ctx.sessionProjectionCache.coldSnapshot === "function") {
			try {
				if (ctx.sessionProjectionCache.coldSnapshot.length === 1) {
					await ctx.sessionProjectionCache.coldSnapshot(cleanSessionId);
				} else if (persistence && typeof persistence.open === "function") {
					const readHandle = await persistence.open(cleanSessionId, "read");
					try {
						const { events } = typeof readHandle.read === "function" ? await readHandle.read(0) : { events: [] };
						const coldMeta = readHandle.header ?? targetHeader;
						const inherited = (readHandle as unknown as { inheritedEventCount?: number }).inheritedEventCount ?? 0;
						await (ctx.sessionProjectionCache.coldSnapshot as unknown as (m: unknown, c: number, ev: unknown[]) => Promise<unknown>)(
							coldMeta,
							inherited,
							events ?? []
						);
					} finally {
						await readHandle.close();
					}
				}
			} catch (err) {
				ctx.logger?.warn?.(`archive-manager: post-move coldSnapshot failed: ${String(err)}`);
			}
		}
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

- 未审计所有格式、压缩解码和宿主缓存队列内部，也未做移动中断验证。
  **影响**：不能由源码直接保证真实存储和宿主数据操作结果。
  **进一步探讨**：使用副本模拟flush失败、磁盘满、记账失败、写后读失败和迟到缓存，核对原日志、cwd、目标、记账和备份能否恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何分层采用，下一步值得验证什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议先试用只读搜索、预览和收藏，再在副本检查归档恢复；永久删除与移动留在独立验收后。首次成本是对应profile安装、版本匹配、会话存储备份和数据核对，现金/耗时未测；持续有批量日志读取I/O、缓存重建写盘和兼容升级。故障恢复可能要逐对象核文件、子会话和记账，不能只点重试；卸载插件不撤销物理删除或cwd重写，源数据独立备份是退出方案，非插件自动能力。

可推导“分对象清理证据收据”：将父、子Agent、spill、缓存、记账各目标的已删除/失败/未知返回UI，直到重扫确认无残留才称彻底删除，避免父成功掩盖子warn。相对现有批量父对象结果，这是具体工程增量，尚未实现，不计成已解决。最小验证在副本注入子删除和枚举失败，比较当前UI与对象收据的漏报残留、误报完整、恢复时间；若展示负担超过减少的误判或无真实残留问题则停止。受众是否会为此采用独立插件尚无证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/workspace.ts:831-843](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L831-L843)

当前按父对象返回批量状态。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[src/workspace.ts:1094-1108](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/workspace.ts#L1094-L1108)

子对象错误降级形成收据缺口。

<details>
<summary>查看原文（15行）</summary>

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
		}
```

</details>

**依据 3 · 源码核查**：[src/session-move.ts:444-465](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/src/session-move.ts#L444-L465)

移动备份生命周期不是用户永久备份。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 4 · 源码核查**：[README.zh-CN.md:65-67](https://github.com/MichengAI/dsh-archive-manager/blob/6b8babc7b7f8da44466c7bd611ad29e66408623c/README.zh-CN.md#L65-L67)

批量读取成本与未知性能。

```text
- 检索逐批读取，每批最多 20 条会话，批内逐条读取；关键词最多 200 字符。预览每条最多 2000 个 UTF-16 码元，截断保留完整 Unicode 字符，较长内容请打开完整会话。
- 搜索与预览不包含工具输出、附件、推理、系统或插件注入消息；读取失败会显示详情并支持重试。检索的是持久化原始文本，不等同于模型当前上下文。
- 未建立持久化全文索引，大量或超长会话可能需要较久，建议先缩小项目、日期或收藏范围；尚无可承诺的会话数量上限或响应时延；更改条件会停止后续批次，正在读取的单批仍会完成，但旧结果不会覆盖新筛选。
```

#### 缺口

- 没有真实用户恢复成本、清理误判及采用对照。
  **影响**：不能由源码直接保证真实存储和宿主数据操作结果。
  **进一步探讨**：先收集匿名失败案例和副本故障测试，用对象收据对照现有返回再决定实现。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
