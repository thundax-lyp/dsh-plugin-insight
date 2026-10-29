# DSH Armory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6229f9b](https://github.com/2026heshao/dsh-armory/tree/6229f9b6d2757aaaf2e4cbc4c679473f1715da70)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 2,752](https://img.shields.io/static/v1?label=npm+30d&message=2%2C752&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

> **功能**：为 DSH 提供 MCP、Skill、专家与插件的统一管理看板、市场入口和工具使用账本。

> **亮点**：统一生命周期、来源识别和有界使用观测，来源导入哈希及配置/live回滚有具体接线；净管理效果未测。见[Q01](#research-q01)、[Q04](#research-q04)。

> **主要限制**：Skill更新实际rm旧目录后rename，无自动保旧；摘要条件可跳无摘要/空响应，stat不是生效验收，零调用/字符粗估不是可信或节费放行。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁会反复需要统一看板，相对原生/上游多什么？](#detail-section-11)
  - [Q02 · 安装/更新/删除怎样到真实目录和Host状态？](#detail-section-12)
  - [Q03 · 安装身份与工具税/零调用能支持什么决策？](#detail-section-13)
  - [Q04 · 接入/认证/范围/退出负担和边界？](#detail-section-14)
  - [Q05 · 怎样试用和最值得验证哪种方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为维护多个 MCP、Skill、专家和社区插件的 DSH 用户，提供统一看板、市场安装、来源检查和工具使用账本。见[Q01](#research-q01)。

原生管理页、手改MCP与分散查技能/日志；fork上游MCP管理UI，不把宿主Loader/协议全部算原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一看板/Remote | 管理多对象及作用域 | Host服务可用，UI存在非执行成功 |
| Skill安装/卸载 | staging写入、目录删除 | 条件摘要非安全证明，更新无保旧 |
| 来源/时间 | 来源账本及标准根投影 | 名称/文件时间可能折叠或兜底 |
| 工具账本 | 调用/错误/Schema趋势 | 有界日志与字符粗估，不当精确账单 |
| 配置导入/启停 | 预览hash、同名跳过、live回滚 | 每路径不同，不能泛推全可恢复 |

**流程与依赖**

宿主内部服务/写目录、对应市场/凭据与日志按操作需要准备；表见[Q05](#research-q05)。

隔离profile备份，非关键安装更新/删除，读目录/账本/registry，再只读看工具建议；步骤见[Q05](#research-q05)。

**效果与成本**

配置/目录写面、远端服务、观察复核与更新恢复负担未知，不从粗估推净节费；表见[Q05](#research-q05)。

集中接线有据，真实身份/安装生效/净效率和无损禁用仍需验；效果见[Q05](#research-q05)。

> **思考**：Skill更新实际rm旧目录后rename，无自动保旧；摘要条件可跳无摘要/空响应，stat不是生效验收，零调用/字符粗估不是可信或节费放行。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一生命周期、来源识别和有界使用观测，来源导入哈希及配置/live回滚有具体接线；净管理效果未测。见[Q01](#research-q01)、[Q04](#research-q04)。

可信registry删除、观测缺口诊断、导入哈希与MCP patch/live回滚值得迁移；Skill替换事务/名称投影仍有维护和恢复限制。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Skill更新实际rm旧目录后rename，无自动保旧；摘要条件可跳无摘要/空响应，stat不是生效验收，零调用/字符粗估不是可信或节费放行。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有多对象负担者可隔离profile先备份再试非关键Skill，核目录和宿主；旧目录丢失、生效不符或工具裁剪损任务时停止更多写入，从备份恢复并回原生管理。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持看板Remote、Skill文件/删除、身份/日志观察与部分配置恢复；未运行且未全审OAuth/专家/所有市场。限隔离非关键Skill试用，事务假设未实现。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、lib/index.js、lib/client.js、lib/wb-market.js、lib/skill-remove.js、lib/skill-dir-times.js、lib/tool-ledger.js、lib/wb-install-state.js、lib/import-admission.js、lib/wb-registry.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧五题/全部findings、证据版本与自身code依赖；本轮定向核Host/client Remote、SkillHub文件安装/一般删除、身份时间账本、工具日志粗估、导入准入与MCP启停回滚。未全审OAuth/专家/所有市场/UI，不执行目标。
- 下一步：后续临时profile故障矩阵核目录/账本/registry及作用域，日志对照真实任务/用量；OAuth另测测试账号授权/刷新/撤销。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：2.4.3（[固定提交 6229f9b](https://github.com/2026heshao/dsh-armory/tree/6229f9b6d2757aaaf2e4cbc4c679473f1715da70)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是可恢复Skill更新/发现回读与明确提交，用故障矩阵对比旧版保留和恢复时间；备份已足够或维护更重则不扩复杂事务平台。见[Q05](#research-q05)。

后续临时profile故障矩阵核目录/账本/registry及作用域，日志对照真实任务/用量；OAuth另测测试账号授权/刷新/撤销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 318 | 262 | 36 | — |
| .md | source | 23 | 2318 | — | — | 56317 |
| .js | source | 30 | 26381 | 20757 | 4993 | — |
| .mjs | test | 64 | 16081 | 12358 | 2778 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：管理写入与观测何时可当完成，何时会误导采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会反复需要统一看板，相对原生/上游多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH插件。bundle行挂dsh-armory，Host默认导出McpManagerGateway继承TypertRemoteService，以Remote方法服务mcpManager；client将远程调用封装为统一结果，再把看板注入main等槽位。它不是一个独立MCP服务器，也不保证被管理的工具本身可用。package当前2.4.3，README标题仍提2.4.2，版本判断以固定包和源码为准，不从文档“最新”外推在线发行。

目标是同时管理多MCP、Skill、专家与社区插件的DSH用户，反复需要添加/更新/启停、确认安装来源以及辨别项目和全局作用域。基线是原生插件页加手改MCP配置、自己找技能仓库与检查会话日志。集中入口、来源和使用观测减少跨处定位/接线，但合格结果必须是正确对象在正确作用域生效、凭据不串用、失败后可恢复，而不是市场里出现或文件已下载。

项目明确fork自MCP管理UI，基础管理界面和宿主Loader/协议是继承能力；扩展在多对象生命周期、市场来源、工具账本和专家入口的组合。不能把市场条目数量、协议清单或工具零调用数字当采用效果，也不能将统一按钮解释为所有操作可撤销。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/package.json#L1-L16)

包版本与Host入口。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-armory",
  "version": "2.4.3",
  "description": "Unified Skill + MCP + Expert + Plugin board for DeepSeek Harness (desktop app and Web GUI) — custom skill suites, skill install/uninstall with live refresh, global panel page, JSON import, WorkBuddy connector & SkillHub & Expert & DSH community plugin market installs, MCP OAuth authorization, tool-usage tailor with wire-tax trends, and profile-backed Host Remote management.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/2026heshao/dsh-armory.git"
  },
  "homepage": "https://github.com/2026heshao/dsh-armory#readme",
  "bugs": {
    "url": "https://github.com/2026heshao/dsh-armory/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "engines": {
    "node": ">=22.15"
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/cordis.patch.yml#L1-L3)

bundle行。

```text
- insert:
  - id: dsh-armory
    name: dsh-armory
```

**依据 3 · 源码核查**：[lib/index.js:1224-1229](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1224-L1229)

原生远程服务类。

```text
let McpManagerGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators, _status_decorators, _enable_decorators, _disable_decorators, _reconnect_decorators, _tools_decorators, _add_decorators, _update_decorators, _remove_decorators, _reveal_decorators, _previewImport_decorators, _importJson_decorators, _listWorkspaces_decorators, _getWorkspaceView_decorators, _addWorkspaceServer_decorators, _updateWorkspaceServer_decorators, _removeWorkspaceServer_decorators, _setWorkspaceExclude_decorators, _previewWorkspaceImport_decorators, _importWorkspaceJson_decorators, _revealWorkspaceServer_decorators, _projectConnections_decorators, _reconnectWorkspaceServer_decorators, _updateHint_decorators, _whatsNew_decorators, _scanImportSources_decorators, _previewImportSource_decorators, _importSource_decorators, _toolTailor_decorators, _wbConnectorCatalog_decorators, _wbConnectorCachedCount_decorators, _wbConnectorIcon_decorators, _wbConnectorPreview_decorators, _wbConnectorInstall_decorators, _wbOAuthBegin_decorators, _wbOAuthPoll_decorators, _wbOAuthCancel_decorators, _wbOAuthToken_decorators, _wbOAuthOverview_decorators, _wbOAuthOpen_decorators, _wbSkillCatalog_decorators, _wbSkillDetail_decorators, _wbSkillInstall_decorators, _wbSkillUninstall_decorators, _wbSkillInstalled_decorators, _wbMarketRegistry_decorators, _wbMarketRegistryUpsert_decorators, _wbInstallState_decorators, _wbInstallStateRecord_decorators, _wbInstallStateForget_decorators, _wbAwesomeCatalog_decorators, _wbAwesomeDetail_decorators, _wbAwesomeReadme_decorators, _wbAwesomeUpdateCheck_decorators, _wbRepoMeta_decorators, _wbNpmDownloads_decorators, _wbLoadoutExport_decorators, _wbLoadoutDiff_decorators;
	return class McpManagerGateway extends _classSuper {
		static {
```

**依据 4 · 源码核查**：[lib/index.js:1352-1368](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1352-L1368)

宿主注入和构造。

<details>
<summary>查看原文（17行）</summary>

```text
		static inject = ["loader", "tools"];
		constructor(ctx) {
			super(ctx, "mcpManager");
			ensureLogCapture(ctx);
			installAgentRuntime(ctx);
			__runInitializers(this, _instanceExtraInitializers);
		}
		async list() {
			return listMcpServers(this.ctx);
		}
		async status(name) {
			ensureLogCapture(this.ctx);
			const value = String(name);
			const state = await managedState(this.ctx);
			const matches = entriesForName(this.ctx, value);
			if (!matches.length) throw new Error("no such MCP: " + name);
			const profileId = state.entryIds.get(value);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:12784-12808](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/client.js#L12784-L12808)

客户端远程封装到main槽位。

<details>
<summary>查看原文（25行）</summary>

```text
  try {
    disposeCss = __injectCss(MCP_CSS);
    timer = createTimer();
    MODULE_CTX.ctx = ctx;
    const call = async (method, args) => {
      const svc = (typeof ctx.get === 'function' ? ctx.get('remote.mcpManager') : null) || null;
      if (!svc || typeof svc[method] !== 'function') return { ok: false, error: t('MCP 市场服务未连接（面板仍可用）') };
      const r = args === undefined || args === null ? await svc[method]() : await svc[method](args);
      if (r && r.ok) return { ok: true, ...((r.value && typeof r.value === 'object') ? r.value : {}) };
      if (r && !r.ok) return { ok: false, error: (r.error && (r.error.message || r.error.code)) || t('调用失败') };
      return r;
    };
    // 一键升级要用官方 pluginManager，而它只在 apply 的 ctx 上取得到（面板组件拿不到 ctx——
    // 它的 props 来自 slot 的 inject）。所以在这里取好、随 inject 传进面板，与 call 同一手法；
    // 取不到就给 null，面板据此不显示按钮。
    const pluginManager = (typeof ctx.get === 'function' ? ctx.get('remote.' + UPGRADE_NAMESPACE) : null)
      || (ctx.remote && ctx.remote[UPGRADE_NAMESPACE])
      || null;
    // 看板页（main slot，key = PANEL_ID）：宿主中栏按 entryKey 渲染。用 inject 而不是
    // 直接 register：它声明感知，会等 ui-layout 把 main slot 声明出来（插件加载顺序不保证
    // 晚于布局）。
    ctx.slots.inject('main', () =>
      ctx.slots.register({ name: 'main', key: PANEL_ID, label: panelLabel(), inject: () => ({ call, timer, pluginManager }) }, McpBoardPage),
    );
    // 输入框召唤菜单（conversation.input.right，list 型 slot）：权限/模型座位右侧的小图标，
```

</details>

**依据 6 · 源码核查**：[README.md:1-8](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/README.md#L1-L8)

上游fork及文档版本描述。

```text
# dsh-armory — 军械库 / Armory

中文 | [English](README.en.md)

> **DeepSeek Harness 的一体化管理看板**：MCP · 技能 · 专家 · 插件 · 工具账本 · 四大市场，浏览、搜索、一键安装、一键召唤。
> fork 自 [Imzl-zl/dsh-mcp-manager-ui](https://github.com/Imzl-zl/dsh-mcp-manager-ui)（MIT），现已扩展为完整军械库。
>
> **最新 v2.4.2**：文档版——README（中 / 英）与实机功能对齐：三个入口席位与六种档位、悬浮按钮怎么隐藏、看板打开时它如何自动让位，以及 v2.4.1 的 SkillHub 详情修正都写进来了；运行代码与 v2.4.1 完全相同。详见 [更新日志](.github/release-notes/v2.4.2.md)。
```

#### 缺口

- 没有同任务原生/手工对照的净时间与错误率
  **影响**：统一界面增量不等于管理更可靠或省成本
  **进一步探讨**：以同一MCP/Skill生命周期记录定位、配置、纠错和恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装/更新/删除怎样到真实目录和Host状态？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

SkillHub安装按最终目录在进程内Map排队，前序失败不阻后序；拉文件清单，限制400文件和声明总量32MB，要求清单含SKILL.md。每个路径resolve后限制staging内，fetch后在sha256存在且buffer非空时做摘要比较，再写入。摘要来自同一市场清单，只能表明与清单字节一致，不证明内容可信；无摘要或空响应可绕过这一条件，落盘后stat也只证路径存在，不核非空/可被宿主正确解析。真实下载体积限制还依fetchWithLimits，不能把声明合计当最终占用恒定32MB。

更新先rm(finalDir)再rename(staging,finalDir)。注释“先挪开旧的”实际调用是永久删除，不是backup；rename失败catch只清staging并抛错，没有旧目录回滚。进程内队列不能防另一Host进程，也没将独立wbSkillUninstall纳入同一锁，安装/卸载竞态仍不是跨进程事务。结果note称“即刻生效”，但函数仅逐文件stat；没有此处宿主get/执行回读，不能以note保证模型已经发现新Skill。

Host在安装成功后再recordInstallState，登记失败只warn不撤目录。磁盘、账本与宿主缓存可能短暂或长期不同步，失败恢复要分别核三者，不能盲重复更新。市场卸载根据namespace/slug计算路径直接rm；一般Skill看板删除走更严格链，先由宿主registry.get(name)取得真实source/path，不采纳浏览器任意path，再白名单根/realpath、符号链接仅unlink、目录必须有SKILL.md。但两条都是永久删除，确认框不是回收站，关键技能必须先备份。

这里的可靠设计是可信来源删除和单路径任务排队；不可恢复更新与“文件存在=生效”则是影响采用的主要限制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-market.js:683-701](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/wb-market.js#L683-L701)

单进程目标目录排队。

<details>
<summary>查看原文（19行）</summary>

```text
const skillInstallLocks = new Map();
export async function wbSkillInstall(payload = {}, { onProgress } = {}) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  if (!slug || !namespace) throw new Error("缺少 slug 或 namespace");
  const finalDir = join(homedir(), ".agents", "skills", skillTargetName(namespace, slug));
  const previous = skillInstallLocks.get(finalDir);
  let run;
  // 前序任务失败不该连坐后序：catch 吞掉前序拒绝后再排自己的。
  const queued = previous ? previous.catch(() => {}) : Promise.resolve();
  run = queued
    .then(() => installSkillLocked(payload, { onProgress }, finalDir))
    .finally(() => {
      if (skillInstallLocks.get(finalDir) === run) skillInstallLocks.delete(finalDir);
    });
  skillInstallLocks.set(finalDir, run);
  return run;
}
async function installSkillLocked(payload = {}, { onProgress } = {}, finalDir) {
```

</details>

**依据 2 · 源码核查**：[lib/wb-market.js:702-746](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/wb-market.js#L702-L746)

清单限制、条件摘要、先rm再rename及失败清理。

<details>
<summary>查看原文（45行）</summary>

```text
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  const requestedName = String(payload?.name || "").trim();
  const listing = await wbSkillFiles(payload);
  if (!listing.files.length) throw new Error("该技能没有可下载的文件");
  if (listing.files.length > 400) throw new Error(`文件数超出上限（${listing.files.length} > 400）`);
  const stagingDir = `${finalDir}.installing`;
  const totalBytes = listing.files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > 32 * 1024 * 1024) throw new Error(`技能总体积超过 32MB 上限（${Math.round(totalBytes / 1024 / 1024)}MB）`);
  // 必须有 SKILL.md，否则装了也不会被注册表发现——直接拒绝而不是装个哑包。
  const hasSkillMd = listing.files.some((file) => file.path === "SKILL.md");
  if (!hasSkillMd) throw new Error("清单里没有 SKILL.md，不是标准技能包，拒绝安装");
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  let doneBytes = 0;
  try {
    for (const [index, file] of listing.files.entries()) {
      const relative = file.path;
      // 路径安全：解析后必须落在 staging 内（拒绝 ../、绝对路径、盘符）。
      const target = resolve(stagingDir, relative);
      if (target !== stagingDir && !target.startsWith(stagingDir + sep)) throw new Error(`清单里的非法路径：${relative}`);
      const params = new URLSearchParams({ namespace, path: relative });
      if (listing.version) params.set("version", listing.version);
      const buffer = await fetchWithLimits(`${SKILLHUB_ORIGIN}/api/v1/skills/${encodeURIComponent(slug)}/file?${params.toString()}`);
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
```

</details>

**依据 3 · 源码核查**：[lib/wb-market.js:747-772](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/wb-market.js#L747-L772)

存在性验证、成功note和卸载删除。

<details>
<summary>查看原文（26行）</summary>

```text
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
    }
  }
  return {
    note: `已安装到 ${finalDir}（${listing.files.length} 个文件${listing.version ? `，v${listing.version}` : ""}），即刻生效`,
    dir: finalDir,
    name: requestedName || slug,
    version: listing.version,
  };
}
export async function wbSkillUninstall(payload = {}) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  if (!slug || !namespace) throw new Error("缺少 slug 或 namespace");
  const targetName = skillTargetName(namespace, slug);
  const finalDir = join(homedir(), ".agents", "skills", targetName);
  try {
    await stat(finalDir);
  } catch {
    throw new Error("本机没有这个市场技能的安装记录（可能已卸载或由其它工具安装）");
  }
  await rm(finalDir, { recursive: true, force: true });
  return { note: `已卸载 ${targetName}` };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1999-2025](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1999-L2025)

安装后账本失败不撤目录。

<details>
<summary>查看原文（27行）</summary>

```text
	async wbSkillInstall(payload) {
		// 安装进度经 ctx.logger 落到宿主日志（Remote 单次调用没有流式回传通道，面板按
		// 阶段提示「正在下载与校验」，完成后一次拿到结果与 note）。
		const result = await wbSkillInstall(payload || {}, {
			onProgress: (progress) => this.ctx.logger?.debug?.(`wb-market: ${progress.phase} ${progress.index}/${progress.total}`),
		});
		// T04/R8：装成功后登记本地状态。key 取不到就跳过（record 对空 key 会抛错）。
		const key = result?.name || payload?.slug || payload?.name || "";
		if (key) {
			try {
				await recordInstallState({
					kind: "skill",
					key,
					name: result?.name || payload?.name || key,
					version: result?.version || "",
					installPath: result?.dir || "",
					source: { kind: "marketplace", marketplace: "workbuddy-skills" },
				});
			} catch (error) {
				this.ctx.logger?.warn?.(`wb-market: 技能 ${key} 安装状态登记失败（不影响安装结果）：${error?.message || error}`);
			}
		}
		return result;
	}
	async wbSkillUninstall(payload) {
		return wbSkillUninstall(payload || {});
	}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1808-1820](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1808-L1820)

从宿主registry取真实Skill。

<details>
<summary>查看原文（13行）</summary>

```text
	async removeSkill(payload) {
		const name = String(payload?.name || "").trim();
		if (!name) throw new Error("缺少 skill 名称");
		const result = await withSkillScope(this.ctx, payload, async (registry, options) => {
			if (typeof registry.get !== "function") throw new Error("宿主没有挂载 skill 注册表（@deepseek-ai/dsh-skill），无法卸载");
			const skill = await registry.get(name, options);
			if (!skill) throw new Error("没有找到这个 skill（可能刚被移动或删除）：" + name);
			return removeSkillFromDisk(skill, { cwd: options.cwd, home: homedir() });
		});
		if (result === undefined) throw new Error("宿主没有挂载 skill 注册表（@deepseek-ai/dsh-skill），无法卸载");
		return { note: `已卸载 ${name}（${result.kind === "symlink" ? "符号链接" : "目录"}：${result.path}）` };
	}
	// 安装时间 + 市场原名（按 skill 名字索引）：宿主自扫标准技能根目录、读 SKILL.md
```

</details>

**依据 6 · 源码核查**：[lib/skill-remove.js:69-125](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/skill-remove.js#L69-L125)

白名单/realpath/链接与永久删除。

<details>
<summary>查看原文（57行）</summary>

```text
	const source = typeof skill?.source === "string" ? skill.source : "";
	const root = skillRootFor(source, options);
	if (!root) {
		if (source === "project-agents" || source === "project-dsh") {
			throw new Error(`卸载项目级 skill 需要当前项目路径（来源：${describeSource(source)}）`);
		}
		throw new Error(`这个 skill 来自${describeSource(source)}，不在可卸载范围内（只支持用户级/项目级的 .dsh/skills 与 .agents/skills）`);
	}
	if (!isAbsolute(root)) throw new Error("拒绝卸载：无法确定 skills 根目录的绝对路径");
	const raw = typeof skill?.path === "string" ? skill.path.trim() : "";
	if (!raw) throw new Error("这个 skill 没有可卸载的磁盘路径（运行时注册的 skill 不落盘）");
	if (!isAbsolute(raw)) throw new Error("拒绝卸载：skill 路径不是绝对路径");

	const rawAbs = resolve(raw);
	// 注册表把 skill.path 指向清单文件（<skill>/SKILL.md），删除目标是它所在的目录。
	// 若直接拿清单路径去删，只会得到「该路径不是目录」——真实 GUI 首跑就撞上了。
	const target = basename(rawAbs).toLowerCase() === "skill.md" ? dirname(rawAbs) : rawAbs;
	const rootAbs = resolve(root);
	if (!isInside(rootAbs, target)) {
		throw new Error(`拒绝卸载：skill 路径不在预期的 skills 根目录内（${rootAbs}）`);
	}

	let info;
	try {
		info = await lstat(target);
	} catch (error) {
		if (error?.code === "ENOENT") throw new Error("这个 skill 已经不在磁盘上了（可能刚被移动或删除）");
		throw error;
	}

	// 父目录的 realpath 校验：防「根内路径 → 祖先符号链接实际指向根外」。根目录本身是
	// 符号链接（例如 ~/.agents → 别处）是允许的，所以比的是 realpath 后的根。
	const rootReal = await realpath(rootAbs);
	const parentReal = await realpath(dirname(target));
	if (!isInsideOrEqual(rootReal, parentReal)) {
		throw new Error("拒绝卸载：skill 路径经符号链接指向了 skills 根目录之外");
	}

	if (info.isSymbolicLink()) {
		// 只删链接本身。链接可能指向任意位置（例如 tabbit 这种外部安装的 skill），
		// rm/lstat 都不会跟随，但我们仍显式只用 unlink，语义一目了然。
		await unlink(target);
		return { path: target, kind: "symlink" };
	}
	if (!info.isDirectory()) throw new Error("拒绝卸载：该路径不是目录（也不是符号链接）");

	const targetReal = await realpath(target);
	if (!isInside(rootReal, targetReal)) {
		throw new Error("拒绝卸载：skill 目录经符号链接指向了 skills 根目录之外");
	}
	const manifest = await stat(join(target, "SKILL.md")).catch(() => null);
	if (!manifest || !manifest.isFile()) {
		throw new Error("拒绝卸载：目录里没有 SKILL.md，看起来不是 skill 目录");
	}
	await rm(target, { recursive: true, force: false });
	return { path: target, kind: "dir" };
}
```

</details>

#### 缺口

- 空文件、rename失败、安装/卸载及跨进程交错结果未做故障对照
  **影响**：源码足以指出旧版无自动恢复，实际损失和缓存收敛未知
  **进一步探讨**：用临时非关键技能分别注入空响应、替换失败/并发，再核目录、账本、registry三种状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装身份与工具税/零调用能支持什么决策？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

来源账本按kind+key记录，更新保留首次installedAt。Skill展示额外扫用户/项目四个标准根，读SKILL.md的name，以installPath对账本；同name只取先遇到的根/目录，没账本则birthtime再mtime兜底。因此“安装于”可能是文件时间，不一定真实安装事件；名称投影可能把多个来源折成一个，不能用显示名当稳定身份。

工具账本从本机会话日志和当前注册表Schema汇总调用/错误/结果，区分无日期、扫描跨度、超大/失败文件、失败帧等。单日志64MB上限，工具清单指纹/映射也有界，趋势存在被截断/缺数据的边界。零调用说明在此次可读窗口/归因范围没看到调用，不说明永远无用；低频恢复、审批或特定项目工具可能不该禁用。

“上下文税”用{name,description,parameters} JSON字符数除4向上取整，只用于量级和相对比较。注册表快照与真实请求工具清单用同投影，降低两路计算口径差；按天记录清单变化有助辨认为什么配置未变化，但不是精确模型分词、缓存计费或实际付款。wireTaxDaily的0只表明当天没有可计入的清单估算值，可能没有可读记录、tools非数组或空清单、时间无法归桶、清单指纹超限被跳过等；不证明根本没有request/header请求，也不证明真实零工具/零成本。

可用于生成审阅候选和定位观察盲区，不足自动裁掉应急工具或承诺省Token。应先看扫描失败/跨度、工具属于哪个作用域、是否有替代，再临时禁用并做同任务/恢复对照；不能拿被删后“零错误”证明能力不损失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-install-state.js:110-138](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/wb-install-state.js#L110-L138)

kind/key和首次时间。

<details>
<summary>查看原文（29行）</summary>

```text
 * 登记一条安装：同 kind+key 覆盖（刷新 lastUpdated，保留首次的 installedAt），
 * 首次写入补 installedAt。connector 不落 filesDigest（连接器装进 profile，
 * 没有关键文件可记）；plugin/skill 原样保留传入的 filesDigest。
 */
export async function record(item, options = {}) {
  const normalized = normalizeItem(item);
  if (!normalized.key) throw new Error("安装状态条目缺少 key，无法登记");
  const path = statePath(options);
  const { items } = await readState(options);
  const now = Date.now();
  const index = items.findIndex((entry) => entry.kind === normalized.kind && entry.key === normalized.key);
  if (index >= 0) {
    const existing = items[index];
    items[index] = {
      ...normalized,
      installedAt: existing.installedAt || now,
      lastUpdated: now,
      filesDigest: normalized.kind === "connector" ? {} : (Object.keys(normalized.filesDigest).length ? normalized.filesDigest : existing.filesDigest),
    };
  } else {
    items.push({
      ...normalized,
      installedAt: now,
      lastUpdated: now,
      filesDigest: normalized.kind === "connector" ? {} : normalized.filesDigest,
    });
  }
  await writeAtomic(path, { version: INSTALL_STATE_VERSION, items });
}
```

</details>

**依据 2 · 源码核查**：[lib/skill-dir-times.js:55-111](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/skill-dir-times.js#L55-L111)

根扫描、同名优先及文件时间兜底。

<details>
<summary>查看原文（57行）</summary>

```text
export async function skillInstallInfo(payload = {}, options = {}) {
  const home = options.home || homedir();
  const roots = [
    join(home, ".agents", "skills"),
    join(home, ".dsh", "skills"),
  ];
  const cwd = String(payload?.cwd || "").trim();
  if (cwd) {
    roots.push(join(cwd, ".agents", "skills"));
    roots.push(join(cwd, ".dsh", "skills"));
  }
  const ledger = await listInstalled("skill", options).catch(() => []);
  const byPath = new Map(
    ledger.filter((row) => row && row.installPath).map((row) => [normPath(row.installPath), row]),
  );
  const info = {};
  for (const root of roots) {
    let entries = [];
    try {
      entries = await readdir(root);
    } catch {
      continue; // 根目录不存在（没装过任何市场技能 / 没有 ~/.dsh/skills）：跳过
    }
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const dir = join(root, entry);
      let dirStat;
      try {
        dirStat = await stat(dir);
      } catch {
        continue; // 竞态删除等：跳过
      }
      if (!dirStat.isDirectory()) continue;
      let name = "";
      try {
        name = frontmatterName(await head(join(dir, "SKILL.md")));
      } catch {
        continue; // 没有 SKILL.md：注册表发现不了，不进映射
      }
      if (!name) name = entry;
      if (info[name]) continue; // 同名：首个根/首个目录优先
      const hit = byPath.get(normPath(dir));
      const bornAt = Math.round(Number(dirStat.birthtimeMs) || 0);
      const row = {
        installedAt: (hit?.installedAt || 0) || bornAt || Math.round(Number(dirStat.mtimeMs) || 0),
        dir,
      };
      if (hit?.name) {
        row.marketName = hit.name;
        row.marketplace = hit.source?.marketplace || "";
        row.marketVersion = hit.version || "";
      }
      info[name] = row;
    }
  }
  return { info };
}
```

</details>

**依据 3 · 源码核查**：[lib/tool-ledger.js:50-72](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L50-L72)

扫描/指纹有界。

<details>
<summary>查看原文（23行）</summary>

```text
 * 长的会话日志就能拖垮主进程。64 MB 相对当前最大单文件（4.4 MB）有十四倍冗余，正常使用碰不到。
 */
const MAX_LOG_BYTES = 64 * 1024 * 1024;
/** 解压文本缓存预算：按**字节**控制而非只按条数（见 textCache 注释）。 */
const TEXT_CACHE_MAX_BYTES = 128 * 1024 * 1024;
const TEXT_CACHE_MAX_ENTRIES = 32;

/**
 * 真实下发工具清单的**种类上限**（§6.1）。每种只在首次出现时算一次全量税，超出后不再新增、
 * 只把 `wireTaxTruncated` 置真并交给界面上屏。设这道闸是因为「每次请求清单都不一样」这种病态
 * 日志会让 wireTaxByKey 无界增长，而那恰恰是要靠趋势线暴露的场景——宁可少报几种并明确说「已
 * 截断」，也不能让只读账本把宿主主进程的内存吃掉。
 */
const WIRE_TAX_MAX_KEYS = 64;

/**
 * §6.4 `callId → 技能名` 的映射上限。它只在「等结果回来把错误算到技能头上」这一件事上用，
 * 而工具账本本来就为每个工具记着 `seenCallIds`，这里只是同一件事的技能版本。上限的作用与
 * WIRE_TAX_MAX_KEYS 同理：日志长度不可控时不能让它无界增长；超出后停止登记新映射，
 * 已登记的照常配对，未配对的错误数最多偏少（不会偏多）。
 */
const SKILL_CALL_MAP_MAX = 20_000;

```

</details>

**依据 4 · 源码核查**：[lib/tool-ledger.js:180-215](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L180-L215)

统一Schema粗估投影。

<details>
<summary>查看原文（36行）</summary>

```text

/**
 * 上下文 token 估算。Schema 以 ASCII 为主，4 字符 ≈ 1 token 是公开常用的粗估；
 * 只用于相对比较与量级感知，不承诺精确计费。
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
	return Math.ceil(text.length / 4);
}

/**
 * 单个工具 Schema 投影成「要下发的那段 JSON」后的上下文税。
 *
 * 注册表侧与日志真实下发侧**必须共用这一个投影**：两处各写一遍 `{name, description,
 * parameters}` 时，任何一侧改了键集合或兜底写法，「注册表快照 vs 真实下发」的偏差里就会
 * 混进口径差而不是真差异，那个偏差卡就成了长期误报的假告警。
 * @param {{name: string, description?: string, parameters?: unknown}} tool
 * @returns {number} 估算 token 数。
 */
function schemaTokensOf(tool) {
	return estimateTokens(JSON.stringify({ name: tool.name, description: tool.description || "", parameters: tool.parameters ?? null }));
}

/**
 * 一次请求真实下发的整份工具清单的税（§6.1，口径与 {@link schemaTokensOf} 逐工具一致）。
 * @param {Array<{name?: unknown, description?: unknown, parameters?: unknown}>} tools
 * @returns {{ tokens: number, toolCount: number }}
 */
function wireToolsSummary(tools) {
	let tokens = 0;
	let counted = 0;
	for (const tool of tools) {
		if (!tool || typeof tool.name !== "string") continue;
		tokens += schemaTokensOf(tool);
		counted += 1;
```

</details>

**依据 5 · 源码核查**：[lib/tool-ledger.js:400-418](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L400-L418)

超大日志跳过与失败。

<details>
<summary>查看原文（19行）</summary>

```text
					continue;
				}
				if (st.mtimeMs < cutoffMs) {
					filesSkippedStale += 1;
					continue;
				}
				// 尺寸闸门放在读盘之前（OPT-06）：超限就降级跳过，并把原因交给 failures()
				// 上屏，而不是先整块读进来再发现内存不够。
				if (st.size > MAX_LOG_BYTES) {
					filesSkippedOversize += 1;
					failures(`${logPath}: 日志 ${formatMB(st.size)} 超过 ${formatMB(MAX_LOG_BYTES)} 上限，已跳过`);
					continue;
				}
				let loaded;
				try {
					loaded = await readLogTextCached(logPath, st);
				} catch (error) {
					failures(`${logPath}: ${error instanceof Error ? error.message : String(error)}`);
					continue;
```

</details>

**依据 6 · 源码核查**：[lib/tool-ledger.js:603-634](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L603-L634)

注册表合计、请求趋势和扫描诊断。

<details>
<summary>查看原文（32行）</summary>

```text
	const deadMcpTools = deadTools.filter((tool) => tool.kind === "mcp");
	const taxTotalTokens = tools.reduce((sum, tool) => sum + (tool.schemaTokens ?? 0), 0);
	const deadMcpTaxTokens = deadMcpTools.reduce((sum, tool) => sum + (tool.schemaTokens ?? 0), 0);

	// §6.1 收尾：把按天采到的指纹换成税值，并挑出「窗口内出现过的不同清单」按首次出现时间排序。
	// 界面要回答的是「这份清单这几天动过没有」，所以清单种类（通常 1~5 种）远比请求条数有意义。
	const wireTaxDaily = new Array(windowDays).fill(0);
	for (let i = 0; i < windowDays; i++) {
		const dayBest = dayTaxKeys[i];
		if (!dayBest) continue;
		const entry = wireTaxByKey.get(dayBest.fingerprint);
		if (entry) wireTaxDaily[i] = entry.tokens;
	}
	const wireTaxSnapshots = [...wireTaxByKey.values()].sort((a, b) => a.firstMs - b.firstMs);
	// latest = 时间最晚那次请求所用的清单（不是「最后一个非空日桶」：日桶按天存当天最后一次，
	// 但同一天里先后的两份清单都记在 wireTaxSnapshots 的 firstMs/lastMs 上，这里取 lastMs 最大者）。
	let wireTaxLatest = null;
	for (const entry of wireTaxSnapshots) {
		if (wireTaxLatest === null || entry.lastMs > wireTaxLatest.atMs) wireTaxLatest = { atMs: entry.lastMs, tokens: entry.tokens, toolCount: entry.toolCount };
	}

	return {
		windowDays,
		generatedAt: now,
		sessionsScanned: sessionDirs,
		sessionsWithCalls,
		filesRead,
		filesSkippedStale,
		filesSkippedOversize,
		failedFiles,
		failedFileSamples,
		failedFrames,
```

</details>

**依据 7 · 源码核查**：[lib/tool-ledger.js:650-676](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L650-L676)

跨度/零数据趋势语义。

<details>
<summary>查看原文（27行）</summary>

```text
		orphanResults,
		// §6.2 被计入任何窗口但无法定位时间的调用（当前宿主恒为 0；一旦变红就是日志格式失配）。
		undatedCalls,
		// §6.3 本次读到的调用记录跨度。**按窗口变化**：更长的窗口会打开更多日志文件，读到更早的
		// 事件。界面用「spanDays < windowDays」解释为什么加长窗口什么都没改变。
		scannedEventsOldestMs,
		scannedEventsNewestMs,
		// 取整方式由 test/tailor-timeline.mjs §6 钉住：这里**必须**是 round 而不是 ceil。任何事
		// 件的时间戳都严格早于本次扫描的 now（哪怕只早几毫秒），ceil 于是恒定时把「2 天前」印成
		// 「跨 3 天」——正是本功能要消灭的那类「看起来没错、实际误导」的数字。round 的另一半好处
		// 在触发条件：ceil 下 2.0 天前的数据算成 3 天，3 天窗口 `3 > 3` 不成立，归因提示漏报；
		// round 给 2 天，提示正常出现。误差半天的漏报阈值远小于面板的语义颗粒（天）。
		scannedSpanDays: scannedEventsOldestMs === null ? 0 : Math.max(1, Math.round((now - scannedEventsOldestMs) / 86_400_000)),
		toolCount: tools.length,
		mcpToolCount: mcpTools.length,
		deadCount: deadTools.length,
		deadMcpCount: deadMcpTools.length,
		taxTotalTokens,
		deadMcpTaxTokens,
		// §5.4 趋势数据：逐日调用量（下标 0 = 窗口最早一天）。
		// 界面只在「确实有调用」时画 sparkline，全 0 从这里就能看出来，不必前端猜。
		dailyCalls: dayBuckets,
		// §6.1 真实下发税时间线：税值第一次有了「按天」的形状，用户不必再靠「这个数字看着没变」
		// 来猜注册表动没动。0 = 那天没有 request/header 记录（税不可能算成 0，所以 0 就是缺数据）。
		wireTaxDaily,
		wireTaxSnapshots: wireTaxSnapshots.map((entry) => ({ firstMs: entry.firstMs, lastMs: entry.lastMs, tokens: entry.tokens, toolCount: entry.toolCount })),
		wireTaxLatest,
```

</details>

**依据 8 · 源码核查**：[lib/tool-ledger.js:519-539](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L519-L539)

请求清单非数组/空、时间不能归桶和新指纹超限都continue，未计入不等无请求。

<details>
<summary>查看原文（21行）</summary>

```text
					} else if (event.type === "request/header") {
						// §6.1 该次请求真实下发给模型的整份工具清单。宿主把 `data.header.tools` 原样
						// 落盘，所以「注册表快照」有了一个可对照的真值：两者不一致就是「改了没生效」。
						const tools = event.data?.header?.tools;
						if (!Array.isArray(tools) || tools.length === 0) continue;
						// 没有 time 的清单快照无法归入日桶，直接丢；这类事件的存在由 undatedCalls
						// 那一路负责显形，两条口径不要混在一起。
						const taxBucket = dayIndex(time);
						if (taxBucket === null) continue;
						const fingerprint = wireToolsFingerprint(tools);
						const known = wireTaxByKey.get(fingerprint);
						if (!known) {
							if (wireTaxByKey.size >= WIRE_TAX_MAX_KEYS) {
								wireTaxTruncated = true;
								continue;
							}
							const summary = wireToolsSummary(tools);
							wireTaxByKey.set(fingerprint, { fingerprint, firstMs: time, lastMs: time, ...summary });
						} else if (time > known.lastMs) known.lastMs = time;
						const dayBest = dayTaxKeys[taxBucket];
						if (!dayBest || time > dayBest.time) dayTaxKeys[taxBucket] = { time, fingerprint };
```

</details>

#### 缺口

- 真实模型分词/计费及禁用后合格任务效果无同条件数据
  **影响**：不能承诺精确费用或无损削减工具
  **进一步探讨**：固定模型/任务比较保留与临时禁用组，记录误路由/补回、用量和总纠错成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入/认证/范围/退出负担和边界？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Host需loader/tools及Typert远程服务等DSH内部契约，client需slots/remote/typert和pluginManager，缺远程服务时界面可显示但call返回未连接，不等于管理可执行。MCP网络/凭据、市场目录和下载服务是对应操作的外部依赖；本轮不在线验证所有市场/OAuth提供商，也未完整审计OAuth协议合规，能力描述只能说有授权流程入口。

配置变更并非所有路径都与Skill更新一样。MCP setDisabled先在withPatchWrite下写profile patch，再更新live entry，live失败尝试按version回滚旧patch，回滚再失败明确AggregateError；这种显式回滚有源码支持。reconnect只请求fiber.restart/refresh后返回requested，不保证远端服务已健康。不能用某路径的回滚泛化为整个看板所有操作可恢复。

来源导入先preview回contentHash，importSource必须带同哈希并重读对照，减少“预览A却写B”；admitImportedServers按同名保留首条并累加skipped/warnings，对!!js环境引用做递归规范化，无法处理表达式拒绝。这是集合准入和配置一致性机制，不是对导入内容任意代码/服务来源的全面安全认证。全局profile和项目路径要在实际使用前确认，导入scope错误会影响其他会话。

首次负担是备份profile/Skill、核来源/作用域/密钥，持续要更新目录、维护授权并复核日志建议，失败后核目录/账本/live结果。现金来自被管理模型/远端服务，工具自身净节时和费用未知。退出看板不会撤销已安装技能/MCP/专家文件或所有凭据，删技能更不可逆；保留可恢复的原配置和目录比只禁用入口重要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5-18](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L5-L18)

依赖宿主远程/Loader/原子写与删除模块。

<details>
<summary>查看原文（14行）</summary>

```text
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { interpolate } from "@deepseek-ai/cordis-plugin-loader";
import { withFileLock, writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeMcpImport, readManagedMcpServers, setManagedMcpDisabled, updateManagedMcpPatch } from "./mcp-config.js";
import { admitImportedServers } from "./import-admission.js";
import { collectImportLocations, missingEnvNames, resolveImportLocation } from "./mcp-import-sources.js";
import { deriveMcpPhase, formatMcpLog, sanitizeMcpLog } from "./mcp-observability.js";
import { allMcpEntries, entriesForName, projectToolSchema, revisionOf, toolInventory } from "./mcp-registry.js";
// Skill 看板的卸载落盘点：来源白名单 + 根目录包含性 + 符号链接/根目录校验（lib/skill-remove.js）。
import { removeSkillFromDisk } from "./skill-remove.js";
// Skill 看板的安装时间 + 市场原名投影（名字自建映射，lib/skill-dir-times.js）。
import { skillInstallInfo } from "./skill-dir-times.js";
```

</details>

**依据 2 · 源码核查**：[lib/client.js:12784-12808](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/client.js#L12784-L12808)

远程缺失和pluginManager接入。

<details>
<summary>查看原文（25行）</summary>

```text
  try {
    disposeCss = __injectCss(MCP_CSS);
    timer = createTimer();
    MODULE_CTX.ctx = ctx;
    const call = async (method, args) => {
      const svc = (typeof ctx.get === 'function' ? ctx.get('remote.mcpManager') : null) || null;
      if (!svc || typeof svc[method] !== 'function') return { ok: false, error: t('MCP 市场服务未连接（面板仍可用）') };
      const r = args === undefined || args === null ? await svc[method]() : await svc[method](args);
      if (r && r.ok) return { ok: true, ...((r.value && typeof r.value === 'object') ? r.value : {}) };
      if (r && !r.ok) return { ok: false, error: (r.error && (r.error.message || r.error.code)) || t('调用失败') };
      return r;
    };
    // 一键升级要用官方 pluginManager，而它只在 apply 的 ctx 上取得到（面板组件拿不到 ctx——
    // 它的 props 来自 slot 的 inject）。所以在这里取好、随 inject 传进面板，与 call 同一手法；
    // 取不到就给 null，面板据此不显示按钮。
    const pluginManager = (typeof ctx.get === 'function' ? ctx.get('remote.' + UPGRADE_NAMESPACE) : null)
      || (ctx.remote && ctx.remote[UPGRADE_NAMESPACE])
      || null;
    // 看板页（main slot，key = PANEL_ID）：宿主中栏按 entryKey 渲染。用 inject 而不是
    // 直接 register：它声明感知，会等 ui-layout 把 main slot 声明出来（插件加载顺序不保证
    // 晚于布局）。
    ctx.slots.inject('main', () =>
      ctx.slots.register({ name: 'main', key: PANEL_ID, label: panelLabel(), inject: () => ({ call, timer, pluginManager }) }, McpBoardPage),
    );
    // 输入框召唤菜单（conversation.input.right，list 型 slot）：权限/模型座位右侧的小图标，
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1380-1410](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1380-L1410)

MCP patch/live失败回滚和重连requested。

<details>
<summary>查看原文（31行）</summary>

```text
		async setDisabled(name, disabled) {
			return withPatchWrite(this.ctx, async () => {
				const state = await managedState(this.ctx);
				const entry = managedLiveEntry(this.ctx, state, name);
				if (!entry) throw new Error("此 MCP 来自其他 bundle、存在同名冲突，或不属于当前 Web profile，不能修改");
				const persistedDisabled = state.byName.get(name)?.disabled === true;
				if (entry.disabled === disabled && persistedDisabled === disabled) return { note: disabled ? "already disabled" : "already enabled" };
				const outcome = await writePatch(state, setManagedMcpDisabled(state.content, name, disabled));
				if (entry.disabled === disabled) return { note: disabled ? "已校准 profile patch 为禁用" : "已校准 profile patch 为启用" };
				try {
					await entry.update({ disabled });
				} catch (error) {
					try {
						await writePatch(state, state.content, outcome.version);
					} catch (rollbackError) {
						throw new AggregateError([error, rollbackError], "MCP 状态更新失败，且 profile patch 回滚失败");
					}
					throw error;
				}
				return { note: disabled ? "已禁用并写入 profile patch" : "已启用并写入 profile patch" };
			});
		}
		async reconnect(name) {
			const value = String(name);
			const state = await managedState(this.ctx);
			const entry = managedLiveEntry(this.ctx, state, value);
			if (!entry) throw new Error("此 MCP 来自其他 bundle、存在同名冲突，或不属于当前 Web profile，不能重连");
			if (entry.disabled) throw new Error("MCP 已禁用，请先启用");
			if (entry.fiber) await entry.fiber.restart();
			else await entry.refresh();
			return { note: "restart requested" };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1488-1520](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1488-L1520)

导入preview与contentHash检查。

<details>
<summary>查看原文（33行）</summary>

```text
			return { sources: rows.map(projectSourceRow) };
		}
		async previewImportSource(payload) {
			const context = sourceContext(payload?.wsPath ? canonicalWorkspacePath(String(payload.wsPath)) : "");
			assertSourceLayer(context.layer, payload?.scope);
			const row = await resolveImportLocation(context, payload || {}, readSourceText);
			if (!row.exists) throw new Error(`来源文件不存在：${row.displayPath}`);
			if (row.error) throw new Error(row.error);
			const selected = selectSourceServers(row, payload?.names);
			let preview;
			if (context.cwd) {
				const config = await readWorkspaceConfigCached(this.ctx, context.cwd);
				if (config.error) throw new Error(config.error);
				preview = workspaceImportPreview(config, selected);
			} else {
				preview = importPreview(this.ctx, selected, await managedState(this.ctx));
			}
			// 指纹跟随预览返回：导入时用它拦住「预览之后文件被改」的情况。
			return { preview, contentHash: row.contentHash, source: { label: row.label, scope: row.scope, displayPath: row.displayPath } };
		}
		async importSource(payload) {
			const context = sourceContext(payload?.wsPath ? canonicalWorkspacePath(String(payload.wsPath)) : "");
			const mode = payload?.mode === "replace" ? "replace" : "merge";
			assertSourceLayer(context.layer, payload?.scope);
			const row = await resolveImportLocation(context, payload || {}, readSourceText);
			if (!row.exists) throw new Error(`来源文件不存在：${row.displayPath}`);
			if (row.error) throw new Error(row.error);
			// 指纹必须回传：没有它，"预览的是 A、导入的是 B"只差一次文件改动。
			if (typeof payload?.contentHash !== "string" || !payload.contentHash) throw new Error("缺少来源内容指纹：请先预览、再导入");
			if (payload.contentHash !== row.contentHash) throw new Error("来源配置在预览之后发生了变化，请重新预览");
			const selected = selectSourceServers(row, payload?.names);
			return context.cwd ? applyWorkspaceImport(this.ctx, context.cwd, selected, mode) : applyManagedImport(this.ctx, selected, mode);
		}
```

</details>

**依据 5 · 源码核查**：[lib/import-admission.js:28-69](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/import-admission.js#L28-L69)

表达式准入与同名首条/跳过。

<details>
<summary>查看原文（42行）</summary>

```text
 */

function canonicalizeAt(value, path) {
  if (typeof value === 'string') {
    if (!value.startsWith('!!js ') || isTotalExpression(value)) return value
    const canonical = canonicalizeExpression(value)
    // 不静默放行：写下去就是宿主求值时的失败，而不是解析失败。正常路径到这里之前已被
    // `expressionValue` 拒过；这条是给"以后有人把手工拼的 spec 塞进准入"兜底。
    // 报文只给字段路径，不回显值本身——值可能来自用户主目录里的配置。
    if (canonical === null) throw new Error(`导入结果的 ${path} 含不受支持的 !!js 表达式`)
    return canonical
  }
  if (Array.isArray(value)) return value.map((item, index) => canonicalizeAt(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, canonicalizeAt(item, path ? `${path}.${key}` : key)]))
  }
  return value
}

/**
 * 输入/输出都是 `{ servers, warnings }`（`normalizeMcpImport` 与 `selectSourceServers` 的产出
 * 形状）。非导入结果不要调用它。
 *
 * 同名条目的处理是**保留先出现的那条、跳过其余**，并把名字放进 `skipped` 与 `warnings`：
 * 一条重名不该把整批挡在门外（用户勾了 8 条、其中 1 条重名，却一条都导不进来，是更差的体验）。
 * 跳过而不是覆盖，是因为那两条本来就是不同的服务器配置，谁覆盖谁都没有依据——真正的解法是让用户
 * 在来源文件里改名，提示里因此给出冲突的名字。
 */
export function admitImportedServers(normalized) {
  const servers = (normalized?.servers ?? []).map((server, index) => canonicalizeAt(server, `servers[${index}]`))
  const duplicates = duplicateServerNames(servers)
  const seen = new Set()
  const unique = servers.filter((server) => (seen.has(server.name) ? false : Boolean(seen.add(server.name))))
  // `skipped` 只累加：预览与写盘各自准入一次（幂等），第二次不该丢掉第一次记下的名字——否则
  // 导入结果的"跳过 N 条"会变成空话。提示只在**本次**真的跳过时追加，重复调用不会重复报警。
  const skipped = [...(normalized?.skipped ?? []), ...duplicates]
  const warnings = [...(normalized?.warnings ?? [])]
  if (duplicates.length) {
    warnings.push(`同名条目只保留先出现的那条，已跳过：${duplicates.join('、')}（同一作用域内 serverName 只能有一条）`)
  }
  return { ...normalized, servers: unique, skipped, warnings }
}
```

</details>

#### 缺口

- 项目/全局管理、OAuth认证和远端实际健康完整链未在本范围逐项验收
  **影响**：不能据总功能列表称所有管理路径可靠，采用限定非关键Skill小样
  **进一步探讨**：授权后分作用域验证配置/live回读；OAuth另用测试账号核回调、刷新和撤销。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用和最值得验证哪种方向？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

已有多组件维护负担、愿备份配置的熟悉DSH用户，可在隔离profile先用非关键Skill试管理结果。只需要一个稳定MCP的人通常可用原生/手工配置，无需为集中入口扩展写权限面。试用先验证安装/更新/卸载和宿主回读，工具账本先只读，别按零调用直接大批禁用。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH内部服务和Web UI | 看板操作必需 | Remote/slots/Loader/tools | UI可开但管理call未连接 |
| profile/项目/技能目录写权限 | 写操作必需 | 配置与目录变更 | 备份不足不能安全更新关键项 |
| 市场网络/内容与来源审阅 | 对应安装必需 | 取清单/文件 | 摘要非可信放行，缺市场不装 |
| MCP提供商凭据/授权 | 对应连接才必需 | 远端能力 | 配置成功不等于健康/无费用 |
| 可读会话日志 | 工具裁缝必需 | 使用观察与粗估 | 缺失/跳过需看诊断，不当零 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离profile并备份配置/技能 | 原始目录可恢复，不只记市场名 |
| 小样安装 | 选非关键来源内容审阅后安装 | 磁盘/SKILL正文与registry都可读 |
| 更新/删除 | 人确认对象/作用域后操作 | 失败先核旧目录/账本，不盲重试 |
| 观察 | 读日志跨度/失败再看零调用 | 不把估算当账单，不直接批量削工具 |
| 退出 | 停用入口，按需恢复配置/副本/凭据 | 既有安装与删除影响另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 市场下载、存储与服务费用未知 | 备份/核来源/作用域/凭据 | 配置时间未测 |
| 持续使用 | 远端模型/服务和日志扫描未知 | 审原文、复核观察与维护认证 | 无净费用/人工节省对照 |
| 失败恢复 | 副本/重下载资源未知 | 核目录、账本、live并恢复 | 更新无旧版自动回滚 |
| 升级退出 | 配置/技能/凭据存储未知 | 撤入口、恢复或显式清理 | 删除永久，禁用看板不撤写 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中管理 | Host Remote与client看板接线 | 真实任务净节时和所有路径兼容 |
| Skill安装 | staging、条件摘要和stat | 内容可信/宿主发现/失败保旧 |
| 来源时间 | 账本路径和目录投影 | 同名归属与真实安装日期 |
| 工具观测 | 有界日志/Schema同口径粗估 | 精确账单、无损禁用与收益 |

若更新后旧目录消失、看板成功但宿主找不到、作用域/来源不符或禁用后任务能力下降，应停止更多写入，从备份恢复并回原生管理；先分清目录/账本/live，不以重复安装掩盖未知结果。

可借鉴来源账本与真实目录分开、trusted registry删除、导入哈希绑定和MCP live/patch失败显式回滚。未验证方向聚焦Skill更新事务：保留旧目录，验证新正文与发现结果，再明确提交和恢复状态，补当前rm旧后rename的断点。最小验证覆盖下载/空文件/rename失败、安装卸载交错和进程重启，对比旧版保留、误成功、恢复时间与额外维护。若简单事前备份即可同样可靠，或新状态无法收敛/成本更高，则不做独立复杂事务平台。这不算已有恢复能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-market.js:702-761](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/wb-market.js#L702-L761)

安装更新及成功边界。

<details>
<summary>查看原文（60行）</summary>

```text
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  const requestedName = String(payload?.name || "").trim();
  const listing = await wbSkillFiles(payload);
  if (!listing.files.length) throw new Error("该技能没有可下载的文件");
  if (listing.files.length > 400) throw new Error(`文件数超出上限（${listing.files.length} > 400）`);
  const stagingDir = `${finalDir}.installing`;
  const totalBytes = listing.files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > 32 * 1024 * 1024) throw new Error(`技能总体积超过 32MB 上限（${Math.round(totalBytes / 1024 / 1024)}MB）`);
  // 必须有 SKILL.md，否则装了也不会被注册表发现——直接拒绝而不是装个哑包。
  const hasSkillMd = listing.files.some((file) => file.path === "SKILL.md");
  if (!hasSkillMd) throw new Error("清单里没有 SKILL.md，不是标准技能包，拒绝安装");
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  let doneBytes = 0;
  try {
    for (const [index, file] of listing.files.entries()) {
      const relative = file.path;
      // 路径安全：解析后必须落在 staging 内（拒绝 ../、绝对路径、盘符）。
      const target = resolve(stagingDir, relative);
      if (target !== stagingDir && !target.startsWith(stagingDir + sep)) throw new Error(`清单里的非法路径：${relative}`);
      const params = new URLSearchParams({ namespace, path: relative });
      if (listing.version) params.set("version", listing.version);
      const buffer = await fetchWithLimits(`${SKILLHUB_ORIGIN}/api/v1/skills/${encodeURIComponent(slug)}/file?${params.toString()}`);
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
    }
  }
  return {
    note: `已安装到 ${finalDir}（${listing.files.length} 个文件${listing.version ? `，v${listing.version}` : ""}），即刻生效`,
    dir: finalDir,
    name: requestedName || slug,
    version: listing.version,
  };
}
export async function wbSkillUninstall(payload = {}) {
  const slug = String(payload?.slug || "").trim();
```

</details>

**依据 2 · 源码核查**：[lib/skill-remove.js:116-125](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/skill-remove.js#L116-L125)

目录永久删除。

<details>
<summary>查看原文（10行）</summary>

```text
	if (!isInside(rootReal, targetReal)) {
		throw new Error("拒绝卸载：skill 目录经符号链接指向了 skills 根目录之外");
	}
	const manifest = await stat(join(target, "SKILL.md")).catch(() => null);
	if (!manifest || !manifest.isFile()) {
		throw new Error("拒绝卸载：目录里没有 SKILL.md，看起来不是 skill 目录");
	}
	await rm(target, { recursive: true, force: false });
	return { path: target, kind: "dir" };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1380-1402](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/index.js#L1380-L1402)

可借鉴的另一配置路径回滚。

<details>
<summary>查看原文（23行）</summary>

```text
		async setDisabled(name, disabled) {
			return withPatchWrite(this.ctx, async () => {
				const state = await managedState(this.ctx);
				const entry = managedLiveEntry(this.ctx, state, name);
				if (!entry) throw new Error("此 MCP 来自其他 bundle、存在同名冲突，或不属于当前 Web profile，不能修改");
				const persistedDisabled = state.byName.get(name)?.disabled === true;
				if (entry.disabled === disabled && persistedDisabled === disabled) return { note: disabled ? "already disabled" : "already enabled" };
				const outcome = await writePatch(state, setManagedMcpDisabled(state.content, name, disabled));
				if (entry.disabled === disabled) return { note: disabled ? "已校准 profile patch 为禁用" : "已校准 profile patch 为启用" };
				try {
					await entry.update({ disabled });
				} catch (error) {
					try {
						await writePatch(state, state.content, outcome.version);
					} catch (rollbackError) {
						throw new AggregateError([error, rollbackError], "MCP 状态更新失败，且 profile patch 回滚失败");
					}
					throw error;
				}
				return { note: disabled ? "已禁用并写入 profile patch" : "已启用并写入 profile patch" };
			});
		}
		async reconnect(name) {
```

</details>

**依据 4 · 源码核查**：[lib/tool-ledger.js:180-201](https://github.com/2026heshao/dsh-armory/blob/6229f9b6d2757aaaf2e4cbc4c679473f1715da70/lib/tool-ledger.js#L180-L201)

估算口径。

<details>
<summary>查看原文（22行）</summary>

```text

/**
 * 上下文 token 估算。Schema 以 ASCII 为主，4 字符 ≈ 1 token 是公开常用的粗估；
 * 只用于相对比较与量级感知，不承诺精确计费。
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
	return Math.ceil(text.length / 4);
}

/**
 * 单个工具 Schema 投影成「要下发的那段 JSON」后的上下文税。
 *
 * 注册表侧与日志真实下发侧**必须共用这一个投影**：两处各写一遍 `{name, description,
 * parameters}` 时，任何一侧改了键集合或兜底写法，「注册表快照 vs 真实下发」的偏差里就会
 * 混进口径差而不是真差异，那个偏差卡就成了长期误报的假告警。
 * @param {{name: string, description?: string, parameters?: unknown}} tool
 * @returns {number} 估算 token 数。
 */
function schemaTokensOf(tool) {
	return estimateTokens(JSON.stringify({ name: tool.name, description: tool.description || "", parameters: tool.parameters ?? null }));
```

</details>

#### 缺口

- Skill可恢复事务未实现，真实管理净收益也缺对照
  **影响**：采用仅限可恢复非关键小样，未来方案不计当前分
  **进一步探讨**：临时profile故障矩阵结合人工备份基线，比较误成功/恢复和总负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
