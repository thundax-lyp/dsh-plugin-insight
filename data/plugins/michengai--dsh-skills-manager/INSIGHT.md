# DSH Skills Manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ed76f87](https://github.com/MichengAI/dsh-skills-manager/tree/ed76f87992ece26d2dd95e5e555deec94876d242)

<!-- BEGIN META -->
[![GitHub ★ 386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 138,355](https://img.shields.io/static/v1?label=npm+30d&message=138%2C355&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)
<!-- END META -->

> **功能**：在 DSH 中浏览、启停和管理本地及项目技能，并从仓库安装、更新与恢复技能。

> **亮点**：它把外部技能实际接入DSH调用链，并让同名选择、启停和可追溯仓库更新共享管理入口，超出单纯文件列表；收益仍以实际任务为准。见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：只读来源保护原文件，却仍能把正文送入模型调用；名称合法和文件摘要不证明指令可信。更新恢复设计也未独立证明任意硬中断和外部竞态下无损。见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 多来源技能管理解决谁的什么问题？](#detail-section-11)
  - [Q02 · 来源、重名与启停怎样进入实际调用？](#detail-section-12)
  - [Q03 · 仓库安装更新如何保护本地修改和恢复？](#detail-section-13)
  - [Q04 · 创建、删除与可写范围的边界是什么？](#detail-section-14)
  - [Q05 · 全周期成本与效果支持到哪？](#detail-section-15)
  - [Q06 · 哪些人值得试，怎样验证新的信任假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个助手和项目技能目录的人可统一查找副本并管理更新，合格结果应是目标会话调用正确正文且可恢复。见[Q01](#research-q01)。

简单替代为宿主原生技能目录、手工复制和版本管理。插件集成发现、策略覆盖与更新恢复，不把第三方技能内容或宿主加载机制计作本插件原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多来源技能调用 | 把外部与项目技能接入DSH provider | 来源默认启用；只读文件不等于可信指令 |
| 来源与单项启停 | 控制同名副本及调用候选 | 依赖宿主provider契约，需实际核对 |
| 仓库安装与更新 | 固定内容、比较本地修改并替换 | 目标限DSH/Shared Agent/登记项目，归档受限 |
| 回滚与回收站 | 恢复上一版或软删除内容 | 自动恢复失败保留备份，永久删除另有入口 |
| 创建技能工具 | 生成合法SKILL.md | ask是宿主确认请求，正文内容仍需审阅 |
| 插件自身更新 | 调用profile包管理器安装npm版本 | 与技能文件更新不同，有真实子进程副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills、webServer与Web设置服务 | 核心必需 | provider、管理API和界面 | 兼容不满足时不能按源码推定可用 |
| 可读技能目录及合法SKILL声明 | 发现调用必需 | 名称、正文及资源定位 | 不可读或非法条目缺席或诊断，扫描也会触限 |
| DSH/Shared Agent可写根或登记项目 | 文件管理必需 | 创建、安装、更新与回收 | 外部助手目录只读，未知目标拒绝 |
| 公共GitHub与磁盘空间 | 仓库功能必需 | 下载归档、stage、备份 | 网络或大小限额失败应保留当前文件 |
| 内容审阅与文件恢复能力 | 采用前提 | 判断技能适用并处理失败 | 不能由只读标签或目录合法性替代 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份技能和管理状态，审阅来源 | 不熟来源先停用 |
| 加载 | 安装bundle后重启/刷新并打开Skills | 本轮未安装验收，先确认目标宿主 |
| 调用核对 | 用户以同名测试技能检验项目和来源策略 | 实际正文和启停应符合意图 |
| 变更 | 用户预览仓库更新，明确本地修改覆盖 | 摘要变化应重预览，未授权不覆盖 |
| 恢复 | 用户验证回滚与回收站 | 报自动恢复失败时保留备份，不重复操作 |

**效果与成本**

采用成本主要取决于需要审阅多少来源、更新频率和失败时能否恢复，而不是面板点选次数。跨助手技能带来的指令适用审查仍由用户承担，完整阶段成本表见[Q05](#research-q05)。

应把“技能已列出”“正确正文可调用”“任务完成”分别记录，管理界面的规模不能代替调用质量。当前机制支持及尚缺结果在[Q05](#research-q05)效果表逐项列明。

> **思考**：只读来源保护原文件，却仍能把正文送入模型调用；名称合法和文件摘要不证明指令可信。更新恢复设计也未独立证明任意硬中断和外部竞态下无损。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把外部技能实际接入DSH调用链，并让同名选择、启停和可追溯仓库更新共享管理入口，超出单纯文件列表；收益仍以实际任务为准。见[Q01](#research-q01)至[Q03](#research-q03)。

可复用设计是agent层策略覆盖、真实路径复核、完整文件摘要预览与写前二次复验，以及明确保留备份的恢复失败分支。它们分别处理调用选择和文件替换，不应混成内容安全保证。检查了关键TS与对应lib接线，未重建以证明整包完全一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

只读来源保护原文件，却仍能把正文送入模型调用；名称合法和文件摘要不证明指令可信。更新恢复设计也未独立证明任意硬中断和外部竞态下无损。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在单个测试项目核对同名启停，再给一个有本地修改的仓库技能预览更新并验收回滚；不熟来源先停用。出现错误副本、未授权覆盖或恢复失败即停止并保留文件，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认provider、工具、文件管理及更新门禁；未验证真实宿主调用、并发硬中断恢复及任务收益。技能内容版本确认仅是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/core.ts、src/readonly-discovery.ts、src/repositories.ts、src/repository-updates.ts、src/plugin-updater.ts、src/client.ts、lib/index.js、lib/core.js、lib/repository-updates.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查provider注册与list/get、来源默认策略、仓库安装/更新/回滚、创建工具、可写根和删除路由，以及运行时lib对应关键接线；未全审市场目录、全部UI、第三方代码或所有恢复分支。
- 下一步：用隔离同名技能、不同来源、策略切换、本地修改和各目录切换中断做真实宿主对照，记录错误副本与恢复时间；本轮未运行。

**分析版本**

- **仓库**：[MichengAI/dsh-skills-manager](https://github.com/MichengAI/dsh-skills-manager)
- **版本号**：1.2.21（[固定提交 ed76f87](https://github.com/MichengAI/dsh-skills-manager/tree/ed76f87992ece26d2dd95e5e555deec94876d242)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究首次启用和内容变更时绑定技能摘要的适用确认，分清文件管理与指令信任；须比较误启用与审阅负担，尚未验证。见[Q06](#research-q06)。

用隔离同名技能、不同来源、策略切换、本地修改和各目录切换中断做真实宿主对照，记录错误副本与恢复时间；本轮未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1186 | — | — | 19050 |
| .js | source | 10 | 6362 | 6354 | 79 | — |
| .mjs | source | 9 | 941 | 884 | 22 | — |
| .ts | source | 24 | 11147 | 10300 | 492 | — |
| .mjs | test | 40 | 13578 | 12725 | 380 | — |
| .mjs | example | 1 | 61 | 59 | 1 | — |
| .ts | test | 2 | 89 | 76 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=41&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)

暂未获取：近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Skills Manager能否把多来源技能整理成实际可调用且可恢复管理的DSH目录，读取外部技能与仓库更新有哪些成立条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多来源技能管理解决谁的什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同时使用 DSH、Shared Agent 与其他编码助手的人，经常需要查找同名技能、确定实际加载的副本，并把仓库技能装到明确的用户或项目目录。合格结果是正确技能正文在目标会话可调用，启停策略符合用户意图，原文件与本地修改可追溯恢复，而不是列表数增加。

本包通过设置页、项目视图、来源分组、仓库订阅与回收站整理这套流程。相对手动复制文件和逐目录查找，它额外把外部技能注册进 DSH 的 provider，并把来源、重名选择和启停策略纳入同一候选链；这不是只有文件浏览的管理器。bundle与默认lib导出确认其真实类型为原生插件。

插件继承宿主的技能加载和调用体系，不提供新的模型推理算法，目录里的第三方技能也不是本插件创作的能力。单一目录、技能很少或只需宿主原生加载的人，手动维护可能更简单。作者展示广泛目录支持和界面，不等于独立证明用户需求、检索准确率或工作效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-34](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/README.md#L23-L34)

作者列出多来源、项目、仓库与回收站场景。

<details>
<summary>查看原文（12行）</summary>

```text

## Features

Bring skills from your computer and projects into DSH without switching between Agent folders.

- **Unified multi-view management**: Browse Global Skills, Project Skills, Discover, and Trash in unified tabs with instant search, status filtering, and collapsible source groups.
- **Broad ecosystem support**: Full coverage for 20+ tools and CLI environments including DSH, Shared Agent, Codex, Claude Code, Copilot, Cursor, Google Antigravity, Windsurf, Qoder, and Trae without touching third-party files.
- **Categorization and drag & drop**: Create category folders inside sources, drag skill rows (`⋮⋮`) to organize and order them, batch assign skills, and toggle entire categories with a single switch. Category metadata is saved without moving files.
- **Public markets & repositories**: Integrated Discover hub to explore trending skills from ClawHub and skills.sh, or subscribe to public GitHub repositories with incremental diff inspection and backups.
- **Create and flexible import**: Create skills or import ZIP archives, folders, and `SKILL.md` files directly into your global user root or a registered workspace.
- **Wide reading experience**: 760px responsive detail modal with monospace syntax styling, vertical resizing, and a one-click "Copy body" action.
- **Trash & safe rollback**: Soft delete protects skills from accidental loss, allowing complete restoration with provenance and update history preserved.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:303-314](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/index.ts#L303-L314)

外部provider实际绑定list与get。

<details>
<summary>查看原文（12行）</summary>

```text
function externalSkillProvider(control: ProviderControl, invalidators: Set<() => void>) {
  invalidators.add(control.invalidate);
  if (control.signal && typeof control.signal.addEventListener === "function") {
    control.signal.addEventListener("abort", () => {
      invalidators.delete(control.invalidate);
    }, { once: true });
  }
  return {
    name: "dsh-skills-manager-external",
    list: async (options?: ScopeOptions) => listProviderCandidates(options),
    get: async (candidate: ProviderCandidate, options?: ScopeOptions) => getProviderSkill(candidate, options),
  };
```

</details>

**依据 3 · 源码核查**：[src/index.ts:410-415](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/index.ts#L410-L415)

全局与agent层provider实际注册。

```text
  ctx.effect(() => ctx.skills.registerProvider((control) => externalSkillProvider(control, providerInvalidators)), "skills-manager global external skills provider");
  ctx.effect(() => registerAgentSkillProviders(ctx, providerInvalidators), "skills-manager agent-scoped external skills providers");

  if (ctx.tools && typeof ctx.tools.register === "function") {
    ctx.effect(() => ctx.tools!.register({
      name: "create_skill",
```

**依据 4 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/cordis.patch.yml#L1-L7)

bundle挂载插件。

```text
# dsh-skills-manager bundle patch
#
# 供 `dsh plugin --profile web add <路径>` 自动挂载（Loader bundle 层）；
# 手动挂载的用户也可在 profiles/web/cordis.patch.yml 自行添加 insert 条目。
- insert:
    - id: skills-manager
      name: '@michengai/dsh-skills-manager'
```

#### 缺口

- 没有真实用户的同任务手工维护对照。
  **影响**：只能解释流程增量，不能量化需求频率和净节时。
  **进一步探讨**：记录重复查找、选错副本和恢复任务，对比人工时间及错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源、重名与启停怎样进入实际调用？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

全局provider与各存活agent层provider共同提供外部候选，后者避免更近的原生provider绕开禁用策略。候选生成先扫描用户与当前cwd项目来源，按声明名分组选择优先副本，再根据来源与单项策略决定是否覆盖原生候选；不是把所有同名条目简单拼接。get阶段重新解析真实路径与正文，核对定位、可加载性及调用名，再把正文作为技能内容返回。

只读外部来源意味着管理器不改那些文件，不意味着它们只是供人查看。默认策略把用户来源启用，候选正文可能进入DSH的技能调用链。项目、第三方仓库或其他助手目录里的指令内容必须由使用者决定是否信任；路径校验、名称合法与只读标签都不证明指令适合当前任务，也不证明其附属脚本安全。不能把“安全管理文件”扩展为“技能内容已通过安全审查”。

扫描预算、路径变化、同名优先级和宿主provider契约仍可能影响可见与可调用性。只读发现器设深度6、目录2000和条目20000上限，遇到不可读目录会继续，触限标truncated；因此目录很多时不能从列表缺席推断技能不存在。源码显示了避免路径替换和策略绕过的设计，但本轮没有运行多个宿主与真实会话，不把源码注册当作兼容验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:318-348](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/index.ts#L318-L348)

agent层注册防止禁用落回更近原生provider。

<details>
<summary>查看原文（31行）</summary>

```text
 * Agent presets register their filesystem provider in a nearer, preset-scoped
 * skill layer. Register the manager policy once more in each live agent's own
 * layer so disabled shared skills cannot fall through to that native provider.
 */
function registerAgentSkillProviders(ctx: HostContext, invalidators: Set<() => void>) {
  if (typeof ctx.on !== "function") return () => {};
  const registrations = new Map<string, () => void>();

  const install = (agent: Agent) => {
    if (!agent || registrations.has(agent.id)) return;
    const agentCtx = agent.ctx;
    const skills = agentCtx && typeof agentCtx.get === "function"
      ? agentCtx.get("skills")
      : agentCtx && agentCtx.skills;
    if (!skills || typeof skills.registerProvider !== "function") return;
    const dispose = skills.registerProvider((control) => externalSkillProvider(control, invalidators));
    registrations.set(agent.id, dispose);
  };

  const uninstall = (agent: Agent) => {
    if (!agent) return;
    const dispose = registrations.get(agent.id);
    registrations.delete(agent.id);
    if (typeof dispose === "function") dispose();
  };

  const stopCreated = ctx.on("agent/created", ({ agent }) => install(agent));
  const stopDisposed = ctx.on("agent/disposed", ({ agent }) => uninstall(agent));
  const agents = typeof ctx.get === "function" ? ctx.get("agents") : undefined;
  if (agents && typeof agents.list === "function") {
    for (const agent of agents.list()) install(agent);
```

</details>

**依据 2 · 源码核查**：[src/core.ts:2039-2049](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L2039-L2049)

默认来源开启。

<details>
<summary>查看原文（11行）</summary>

```text

function defaultManagerState(): ManagerState {
  const sources: ManagerState["sources"] = Object.create(null);
  const disabledSkills: ManagerState["disabledSkills"] = Object.create(null);
  const enabledSkills: ManagerState["enabledSkills"] = Object.create(null);
  for (const root of userRoots()) {
    sources[root.key] = true;
    disabledSkills[root.key] = [];
    enabledSkills[root.key] = [];
  }
  return { version: 1, sources, disabledSkills, enabledSkills, sidebarEntry: false, onlineUpdate: true, categories: Object.create(null), categoryMembers: Object.create(null), categoryOrder: Object.create(null) };
```

</details>

**依据 3 · 源码核查**：[src/core.ts:3888-3968](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L3888-L3968)

扫描、同名选择、覆盖及候选来源。

<details>
<summary>查看原文（81行）</summary>

```text
export async function listProviderCandidates(options: ScopeOptions = {}) {
  const policyResult = await readManagerState();
  const candidates = [];
  const user = userRoots();
  const userScans = await scanDeduplicatedRoots(user);
  const items = user.flatMap((root) =>
    userScans.get(root.key)!.entries.map((entry) => ({ root, entry, policy: effectiveSkillPolicy(policyResult, root, entry) })),
  );
  const cwd =
    options && typeof options.cwd === "string" ? options.cwd : undefined;
  if (cwd) {
    const roots = await projectRoots([cwd]);
    for (const root of roots) {
      const scanned = (await scanDeduplicatedRoots([root])).get(root.key)!;
      for (const entry of scanned.entries) items.push({ root, entry, policy: effectiveSkillPolicy(policyResult, root, entry) });
    }
  }
  for (const group of groupLoadableSkillsByName(items).values()) {
    const { root, entry, policy } = selectSkillWinner(group);
    // 关闭的外部来源不覆盖其他插件；原生副本、分发链接及显式单技能禁用仍需阻断。
    const hasNativeCopy = group.some(({ root, entry }) => root.native ||
      entry.policyAliases?.some((alias) => user.some((item) => item.key === alias.rootKey && item.native)));
    const hasExplicitDisable = group.some((item) => item.policy.override === false);
    if (!hasNativeCopy && !hasExplicitDisable && !policy.sourceEnabled) continue;
    const project = root.scope === "project";
    // Shared Agent 继续由 manager 提供递归发现与链接副本，不因开放文件管理而丢失调用候选。
    const policyOnly = root.mutable && root.key !== "agents";
    // 回退副本也必须覆盖组内更高优先级的原生条目，防止宿主重新选中已停用副本。
    const overlayRank = group.length > 1
      ? Math.min(...group.map((item) => Math.min(item.root.rank, item.entry.providerRank ?? item.root.rank))) - 1
      : undefined;
    // 原生根由宿主自己的 provider 提供；来源停用必须发布覆盖层，否则停用不生效。
    const needsOverlay =
      !policyOnly ||
      group.length > 1 ||
      policy.override !== undefined ||
      !entry.invocationPolicyValid ||
      policyResult.writable === false ||
      !policy.sourceEnabled;
    if (!needsOverlay) continue;
    const candidateName = canonicalSkillName({ root, entry, policy });
    if (!KEBAB_RE.test(candidateName)) continue;
    candidates.push({
      name: candidateName,
      description: entry.description,
      invocation: {
        modelInvocable: policy.modelInvocable,
        userInvocable: policy.userInvocable,
      },
      provider: "dsh-skills-manager-external",
      source: project
        ? root.kind
        : root.key === "dsh"
          ? "user-dsh"
          : `agent-${root.key}`,
      rank: overlayRank ?? (project
        ? root.rank - 1
        : root.key === "dsh"
          ? USER_DSH_POLICY_RANK
          : (entry.providerRank ?? root.rank)),
      locator: {
        rootKey: root.key,
        entryName: entry.name,
        path: entry.docPath,
        realEntryPath: entry.realEntryPath,
        realDocPath: entry.realDocPath,
      },
      resourceBase: {
        kind: "directory",
        path: entry.kind === "bundle" ? entry.realEntryPath : root.path,
      },
      path: entry.docPath,
      metadata: {
        dshSkillsManager: {
          root: root.key,
          readOnly: !root.mutable || entry.linked === true,
          sourceReadOnly: !root.mutable || entry.linked === true,
          policyOnly,
        },
      },
    });
```

</details>

**依据 4 · 源码核查**：[src/core.ts:3973-4024](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L3973-L4024)

get重新核定位和正文，不审查语义安全。

<details>
<summary>查看原文（52行）</summary>

```text
export async function getProviderSkill(candidate: ProviderCandidate, options: ScopeOptions = {}) {
  const locator = candidate && candidate.locator;
  if (
    !locator ||
    typeof locator.path !== "string" ||
    typeof locator.rootKey !== "string" ||
    typeof locator.realEntryPath !== "string" ||
    typeof locator.realDocPath !== "string"
  )
    return undefined;
  let root = rootByKey(locator.rootKey);
  if (
    !root &&
    PROJECT_ROOT_KEY_RE.test(locator.rootKey) &&
    typeof options.cwd === "string"
  ) {
    root = (await projectRoots([options.cwd])).find(
      (item) => item.key === locator.rootKey,
    );
  }
  if (!root) return undefined;
  try {
    const entry = await resolveEntry(root, String(locator.entryName || ""));
    if (!entry || resolve(entry.docPath) !== resolve(locator.path))
      return undefined;
    if (
      pathIdentity(entry.realEntryPath) !== pathIdentity(locator.realEntryPath)
    )
      return undefined;
    if (pathIdentity(entry.realDocPath) !== pathIdentity(locator.realDocPath))
      return undefined;
    const doc = parseSkillDoc(
      await fs.readFile(entry.realDocPath || entry.docPath, "utf8"),
    );
    const summary = entryOf(locator.entryName, entry.kind, entry.docPath, doc);
    if (!summary.loadable) return undefined;
    const invocationName = KEBAB_RE.test(summary.declaredName) ? summary.declaredName : toKebab(summary.declaredName);
    if (invocationName !== candidate.name && summary.declaredName !== candidate.name) return undefined;
    return {
      name: candidate.name,
      description: candidate.description,
      invocation: candidate.invocation,
      provider: candidate.provider,
      source: candidate.source,
      resourceBase: candidate.resourceBase,
      path: candidate.path,
      metadata: candidate.metadata,
      content: doc.body.trim(),
    };
  } catch {
    return undefined;
  }
```

</details>

**依据 5 · 源码核查**：[src/readonly-discovery.ts:7-11](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/readonly-discovery.ts#L7-L11)

明确扫描预算。

```text
const MAX_DEPTH = 6;
const MAX_DIRECTORIES = 2000;
const MAX_ENTRIES = 20000;
const identity = (path: string) =>
  process.platform === "win32" ? path.toLowerCase() : path;
```

**依据 6 · 源码核查**：[lib/index.js:255-275](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/lib/index.js#L255-L275)

运行时lib存在对应agent注册，非只读TS接口。

<details>
<summary>查看原文（21行）</summary>

```text
function registerAgentSkillProviders(ctx, invalidators) {
  if (typeof ctx.on !== "function") return () => {
  };
  const registrations = /* @__PURE__ */ new Map();
  const install = (agent) => {
    if (!agent || registrations.has(agent.id)) return;
    const agentCtx = agent.ctx;
    const skills = agentCtx && typeof agentCtx.get === "function" ? agentCtx.get("skills") : agentCtx && agentCtx.skills;
    if (!skills || typeof skills.registerProvider !== "function") return;
    const dispose = skills.registerProvider((control) => externalSkillProvider(control, invalidators));
    registrations.set(agent.id, dispose);
  };
  const uninstall = (agent) => {
    if (!agent) return;
    const dispose = registrations.get(agent.id);
    registrations.delete(agent.id);
    if (typeof dispose === "function") dispose();
  };
  const stopCreated = ctx.on("agent/created", ({ agent }) => install(agent));
  const stopDisposed = ctx.on("agent/disposed", ({ agent }) => uninstall(agent));
  const agents = typeof ctx.get === "function" ? ctx.get("agents") : void 0;
```

</details>

#### 缺口

- 真实宿主多provider优先级与策略失效传播未运行核对。
  **影响**：不能保证各宿主版本中的启停和同名行为完全一致。
  **进一步探讨**：固定宿主用相同名的全局、项目和外部副本测试启停与切换。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 仓库安装更新如何保护本地修改和恢复？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

仓库安装只开放DSH、Shared Agent及登记工作区的项目DSH目标；外部助手根不作为安装目标。归档有32MiB压缩、64MiB解压和路径/数量限制，下载子目录仍取得整仓归档。安装核对SKILL.md摘要，先写未完成来源记录，再复制与启用，最后确认complete；中间失败有撤销记录与删除已复制目录的处理，最终状态未确认时明确报错，不直接宣称成功。

更新与回滚比只确认远端版本更严格。预览token绑定仓库、路径、根、工作区、提交及本地/目标完整文件摘要；替换前重新下载核对目标摘要，再核本地树未变化，本地修改另需overwrite明确确认。它先暂存新文件，把原目录移到备份，再切入新目录并写状态，捕获失败会尝试恢复原目录。备份回滚还核对备份内容摘要，防止把变过的备份当原版。

这些机制可解释为何比盲目覆盖更可控，但仍不是对任意进程崩溃或并发编辑的完整事务证明。最后一次本地复验与rename之间仍有时间窗，其他进程可能修改目录；多步目录切换与状态写入遇到硬中断的全部恢复尚未独立验证。自动恢复失败时明确保留备份并要求不要重复操作，这比静默重试好，也意味着用户必须有人工恢复能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/repositories.ts:99-143](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repositories.ts#L99-L143)

归档与下载预算、路径校验。

<details>
<summary>查看原文（45行）</summary>

```text
/** 解压前检查声明大小，解压后再检查实际大小和大小写路径冲突。 */
export function decodeRepositoryArchive(bytes: Uint8Array) {
  if (bytes.byteLength > LIMIT) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
  let total = 0, count = 0;
  const seen = new Set();
  const archive = unzipSync(new Uint8Array(bytes), { filter(entry) {
    safePath(entry.name.replace(/\/$/, ""));
    const key = entry.name.toLowerCase().replace(/\/$/, "");
    if (seen.has(key)) throw failure("仓库存在重复路径");
    seen.add(key);
    total += entry.originalSize;
    if (++count > 10000 || entry.originalSize > LIMIT || total > 64 << 20) throw failure("仓库解压大小或文件数量超限");
    return !entry.name.endsWith("/");
  } });
  const result: Archive = Object.create(null);
  let root;
  for (const [path, data] of Object.entries(archive)) {
    const slash = path.indexOf("/");
    if (slash < 1) throw failure("仓库归档路径无效");
    const prefix = path.slice(0, slash);
    if (root && root !== prefix) throw failure("仓库归档根目录不唯一");
    root = prefix;
    const relative = safePath(path.slice(slash + 1));
    if (data.byteLength > LIMIT) throw failure("仓库文件过大");
    result[relative] = data;
  }
  return result;
}

async function readResponse(response: Response, limit: number) {
  if (!response.ok) throw Object.assign(failure(`仓库访问失败（HTTP ${response.status}），请稍后重试`, "error.repo.network"), { httpStatus: response.status });
  if (Number(response.headers.get("content-length")) > limit) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
  const reader = response.body?.getReader();
  if (!reader) throw failure("仓库响应为空", "error.repo.network");
  const chunks = []; let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks, length);
```

</details>

**依据 2 · 源码核查**：[src/repositories.ts:667-716](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repositories.ts#L667-L716)

目标校验、摘要、pending安装与完成确认。

<details>
<summary>查看原文（50行）</summary>

```text
    install: ({ id, path, root: requestedRoot, workspace }: SkillRequest, registered?: string[]) => serialize(async () => {
      // 工作区只开放项目 DSH，不能与 Shared Agent 组合；路径必须来自宿主登记列表。
      let root: any, workspaceRoot: string | undefined;
      if (workspace !== undefined) {
        if (requestedRoot !== undefined && requestedRoot !== "dsh") throw failure("工作区只能安装到项目 DSH skills");
        const target = await resolveWorkspaceTarget(workspace, registered);
        if ("ok" in target && target.ok === false) throw failure(target.error, target.code, target.params);
        // 保留真实的项目根 key（project-dsh:<hash>）：启用策略与回收站都按它认根。
        root = (target as { root: any }).root;
        workspaceRoot = root.projectRoot;
      } else root = await recordInstallRoot({ root: requestedRoot });
      const data = await read(), repo = repository(data, id);
      const skill = repo.skills.find((s) => s.path === path);
      if (!skill || !skill.valid) throw failure("技能不存在或格式无效");
      // 工作区安装只和该项目的 .dsh/skills 比较，全局或其他项目已有同名副本不阻止安装。
      // 用户级位置（DSH 与 Shared Agent）仍互相比较：同一技能只能有一份可追溯的用户级安装。
      const lowered = skill.name.toLowerCase();
      const sameTarget = (await state({ projectCwds: workspaceRoot ? [workspaceRoot] : [] })).roots.filter(item => workspaceRoot ? item.projectRoot === workspaceRoot && item.kind === "project-dsh" : item.scope !== "project");
      if (sameTarget.some(item => (item.skills || []).some(entry => entry.name.toLowerCase() === lowered || entry.declaredName?.toLowerCase() === lowered))) throw failure("同名技能已存在，不会覆盖本地文件", "error.repo.conflict");
      const archive = await download(repo), prefix = path ? `${path}/` : "";
      const document = archive[prefix + "SKILL.md"];
      if (!document || hash(document) !== skill.documentHash) throw failure("仓库技能内容与扫描版本不一致，请重新刷新");
      const entries = Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => ({ path: p.slice(prefix.length), data: Buffer.from(bytes).toString("base64") }));
      if (!entries.some((e) => e.path === "SKILL.md")) throw failure("仓库技能内容已失效");
      // 同名记录只替换同一位置：用户级按 root 区分 DSH 与 Shared Agent，工作区按项目根区分。
            // 另一处的安装或回收记录必须保留，否则恢复时会丢失仓库来源。
            data.installs = data.installs.filter((i) => !(i.name === skill.name && (i.workspace ?? null) === (workspaceRoot ?? null) && (i.root || "dsh") === (workspaceRoot ? "dsh" : root.key)));
      const record: InstallRecord = { id, path, root: workspaceRoot ? "dsh" : root.key, ...(workspaceRoot ? { workspace: workspaceRoot } : {}), source: { owner: repo.owner, name: repo.name, ref: repo.ref, subdirectory: repo.subdirectory }, name: skill.name, commit: repo.commit, complete: false, files: entries.map((e) => ({ path: e.path, hash: hash(Buffer.from(e.data, "base64")) })) };
      data.installs.push(record);
      await write(data);
      let copied = false;
      try {
        await recordInstallRoot({ root: requestedRoot, workspace: workspaceRoot }, registered);
        const result = await importUploadedSkill({ name: skill.name, entries }, log, { conflict: "skip", root });
        if (result.ok === false || !result.imported?.length) throw failure(result.error || "技能安装失败或遇到同名冲突", typeof result.code === "string" ? result.code : "error.repo.conflict", result.params);
        copied = true;
        // 界面默认显示已启用，安装完成后走策略初始化，确保不在禁用列表中。
        const enabled = await setSkillEnabled(root, skill.name, true, log);
        if (enabled && typeof enabled === "object" && "ok" in enabled && enabled.ok === false) throw failure(enabled.error || "技能启用状态无法写入", typeof enabled.code === "string" ? enabled.code : "error.repo.enableState", enabled.params);
      } catch (caught) { const error = caught as CodedError;
        data.installs = data.installs.filter(item => item !== record);
        try { await write(data); }
        catch { throw failure("安装未完成且来源记录无法撤销，请恢复磁盘写入后检查技能目录", "error.repo.installState"); }
        if (copied) await fs.rm(join(root.path, skill.name), { recursive: true, force: true }).catch(() => undefined);
        throw error;
      }
      record.complete = true;
      try { await write(data); }
      catch { throw failure("技能文件已安装但来源状态未确认，请恢复磁盘写入后重新打开仓库页", "error.repo.installState"); }
      return { name: skill.name, commit: repo.commit, root: root.path };
```

</details>

**依据 3 · 源码核查**：[src/repository-updates.ts:90-149](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repository-updates.ts#L90-L149)

完整token、覆盖确认、写前复验、备份与恢复。

<details>
<summary>查看原文（60行）</summary>

```text
  async function prepare(input: SkillRequest, includeArchive = false) {
    const { id, path } = input, data = await read();
    const registered = registeredWorkspaces?.();
    const record = await selectInstallRecord(data.installs, input, registered, "没有可追溯的安装记录，不能在线更新");
    const target = join((await recordInstallRoot(record, registered)).path, record.name);
    const current = fileIndex(await readSkillTree(target));
    let entries: Archive | undefined, next: FileDigest[], commit: string | null;
    if (input.rollback === true) {
      const backup = record.backup!;
      if (!/^[a-f0-9-]{36}$/.test(backup?.key || "") || backup.record?.name !== record.name || backup.record?.id !== id || backup.record?.path !== path || (backup.record.root || "dsh") !== (record.root || "dsh") || (backup.record.workspace ?? "") !== (record.workspace ?? "") || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(backup.record?.commit || "") || !Array.isArray(backup.record?.files)) throw failure("没有有效的上一版备份");
      entries = await readSkillTree(join(managerHomePath(), "repository-backups", backup.key)); next = fileIndex(entries);
      if (signature(next) !== backup.fingerprint) throw failure("备份内容已变化，拒绝回退");
      commit = backup.record.commit;
    } else {
      const repo = repository(data, id), skill = repo.skills.find(s => s.path === path);
      if (repo.error || !skill?.valid || skill.name !== record.name || !skill.files) throw failure("请先成功检查更新；技能改名或已移除时不能直接替换");
      next = skill.files; commit = repo.commit;
      if (includeArchive) {
        const archive = await download(repo), prefix = path ? path + "/" : "";
        entries = Object.fromEntries(Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => [p.slice(prefix.length), bytes]));
        if (signature(fileIndex(entries)) !== signature(next)) throw failure("下载内容与预览版本不同，请重新检查更新");
      }
    }
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("文件或版本已变化，请重新预览");
    if (plan.localModified && input.overwrite !== true) throw failure("存在本地修改，请确认备份后替换", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true }); await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries!)) {
        safePath(path); const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true }); await fs.writeFile(file, bytes, { flag: "wx" });
      }
      // 下载期间仍可能编辑文件，替换前复验，避免覆盖预览之后的修改。
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("本地文件已变化，请重新预览");
      const previous = { ...record }; delete previous.backup;
      const nextRecord = rollback ? { ...record.backup!.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      // 跨卷或文件锁导致重命名失败时直接终止，不降级为覆盖复制。
      await renameWithRetry(target, backup); moved = true;
      await renameWithRetry(stage, target); replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) { const error = caught as CodedError;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch { recoveryFailed = true; throw failure("自动恢复失败，原文件保留在备份目录，请勿重复操作", "error.repo.state"); }
      }
      throw error;
    } finally { if (!recoveryFailed) await fs.rm(stage, { recursive: true, force: true }); }
```

</details>

**依据 4 · 源码核查**：[lib/repository-updates.js:105-144](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/lib/repository-updates.js#L105-L144)

运行时构建包含相同摘要门禁与目录切换。

<details>
<summary>查看原文（40行）</summary>

```text
    }
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("\u6587\u4EF6\u6216\u7248\u672C\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9884\u89C8");
    if (plan.localModified && input.overwrite !== true) throw failure("\u5B58\u5728\u672C\u5730\u4FEE\u6539\uFF0C\u8BF7\u786E\u8BA4\u5907\u4EFD\u540E\u66FF\u6362", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true });
    await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries)) {
        safePath(path);
        const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true });
        await fs.writeFile(file, bytes, { flag: "wx" });
      }
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("\u672C\u5730\u6587\u4EF6\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9884\u89C8");
      const previous = { ...record };
      delete previous.backup;
      const nextRecord = rollback ? { ...record.backup.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      await renameWithRetry(target, backup);
      moved = true;
      await renameWithRetry(stage, target);
      replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) {
      const error = caught;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch {
```

</details>

#### 缺口

- 硬中断及外部并发的恢复结果未运行验证。
  **影响**：不能承诺任意失败下无损回滚。
  **进一步探讨**：在隔离目录按暂存、旧目录移走、新目录切入和状态写入阶段中断并核对恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 创建、删除与可写范围的边界是什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

create_skill工具不是仅有名称：宿主注册了name、description、body参数，execute进入写队列调用createSkill，成功后使技能目录失效重读；pre-execute对该工具返回ask，要求宿主确认。createSkill校验名称、简介、正文、长度和同名冲突，把SKILL.md写到暂存目录后rename发布。它能防一部分无效文件或覆盖，却不检验正文指令的可信度；用户仍须读内容。

普通创建和删除都从checkedWritableRootDefinition校验目标。项目写入拒绝与用户根重叠及.dsh/skills符号链接重定向，外部只读根不能据请求任意改成可写。删除走回收站而非直接永久删除，保留源信息，失败会尝试移动回原位置；另有永久删除接口，最终移除后不能依赖同一回收站恢复。

来源开关和分类是保存在DSH侧的策略，而不是移动或删除外部原文件。卸载管理器可能让这些覆盖策略不再生效、原生加载重新显露；退出时要分别清点“保留的文件”和“被插件抑制的调用”。本轮未验收真实宿主确认UI，ask只是源码请求，不能当作已经发生人工同意。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:413-445](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/index.ts#L413-L445)

工具参数、执行队列与ask确认钩子。

<details>
<summary>查看原文（33行）</summary>

```text
  if (ctx.tools && typeof ctx.tools.register === "function") {
    ctx.effect(() => ctx.tools!.register({
      name: "create_skill",
      description: "Create a new local DSH skill in DSH_HOME/skills. Use only when the user explicitly asks to create or save a reusable skill.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Skill name; it will be normalized to kebab-case." },
          description: { type: "string", description: "A concise routing description for when to use the skill." },
          body: { type: "string", description: "Markdown instructions that form the skill body." },
        },
        required: ["name", "description", "body"],
        additionalProperties: false,
      },
      output: {
        schema: { type: "object" },
        render: (_args, value) => [{ type: "text", text: value && value.ok === false ? `Skill creation failed${typeof value.code === "string" ? ` (${value.code})` : ""}.` : `Created DSH skill ${value.name} at ${value.path}` }],
      },
      async execute(args) {
        return enqueueMutation(async () => {
          const result = await createSkill(args, log);
          if (!result || result.ok !== false) afterWrite();
          return result;
        });
      },
      presentCall(args) {
        return { card: "generic", title: "Create DSH skill", kind: "edit", rawInput: args && args.name ? String(args.name) : undefined };
      },
    }), "skills-manager create_skill tool");
    if (typeof ctx.on === "function") ctx.on("tools/pre-execute", (exec, next) => {
      if (exec && exec.name === "create_skill") return Promise.resolve({ kind: "ask", reason: "Create a new skill under DSH_HOME/skills" });
      return next();
    });
```

</details>

**依据 2 · 源码核查**：[src/core.ts:3780-3835](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L3780-L3835)

创建内容校验、冲突拒绝与stage发布。

<details>
<summary>查看原文（56行）</summary>

```text
export async function createSkill(input: CreateInput, log?: Log, options: MutationOptions = {}) {
  const requestedRoot = Object.prototype.hasOwnProperty.call(options, "root")
    ? options.root
    : rootByKey("dsh");
  const definition = await checkedWritableRootDefinition(requestedRoot);
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("create");
  const root = definition.path;
  const requestedName = String((input && input.name) || "").trim();
  const name = toKebab(requestedName);
  const description = String((input && input.description) || "").trim();
  const body = String((input && input.body) || "").trim();
  if (!name || !KEBAB_RE.test(name) || entryPath(root, name) === null)
    return {
      ok: false,
      error: `无法生成合法 kebab-case 名称（原始名: ${requestedName}）`,
      code: "error.import.invalidName",
      params: { name: requestedName },
    };
  if (!description)
    return {
      ok: false,
      error: "技能简介不能为空",
      code: "error.create.descriptionRequired",
    };
  if (!body)
    return {
      ok: false,
      error: "技能正文不能为空",
      code: "error.create.bodyRequired",
    };
  if (description.length > 500 || body.length > 1 << 18)
    return { ok: false, error: "技能内容过长", code: "error.create.tooLarge" };
  if (
    await safeExistingEntryPaths(root, name).then((items) => items.length > 0)
  )
    return {
      ok: false,
      error: `同名技能已存在: ${name}`,
      code: "error.create.conflict",
      params: { name },
    };
  await fs.mkdir(root, { recursive: true });
  const target = entryPath(root, name)!;
  const stage = temporaryPath(target, "create");
  try {
    await fs.mkdir(stage);
    const content = `---\nname: ${name}\ndescription: ${yamlString(description)}\n---\n\n${body}\n`;
    await fs.writeFile(join(stage, "SKILL.md"), content, "utf8");
    await renameWithRetry(stage, target);
  } catch (caught) { const error = caught as CodedError;
    await fs.rm(stage, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
  if (log) log("create", `创建 ${join(target, "SKILL.md")}`);
  return { name, path: join(target, "SKILL.md"), root: definition.key };
```

</details>

**依据 3 · 源码核查**：[src/core.ts:1329-1353](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L1329-L1353)

项目根重叠及链接拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
async function checkedWritableRootDefinition(root: RootInput): Promise<SkillRoot | OperationError | null | undefined> {
  const definition = writableRootDefinition(root);
  if (definition?.key === "agents") return checkedUserRootAncestors(definition);
  if (!definition || definition.scope !== "project") return definition;
  if (await overlapsUserSkillRoot(definition.path)) {
    return {
      ok: false,
      error: `项目技能目录与用户技能目录重叠，拒绝写入: ${definition.path}`,
      code: "error.root.unsafe",
      params: { path: definition.path },
    };
  }
  // 项目仓库内容不可信；拒绝通过 .dsh 或 skills 链接把写入重定向到项目之外。
  for (const path of [join(definition.projectRoot!, ".dsh"), definition.path]) {
    const st = await lstatOrNull(path);
    if (st && (!st.isDirectory() || st.isSymbolicLink())) {
      return {
        ok: false,
        error: `项目技能目录不安全，拒绝写入: ${path}`,
        code: "error.root.unsafe",
        params: { path },
      };
    }
  }
  return definition;
```

</details>

**依据 4 · 源码核查**：[src/core.ts:2855-2877](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L2855-L2877)

删除先核可写根与链接。

<details>
<summary>查看原文（23行）</summary>

```text
export async function deleteSkill(root: RootInput, name: string, log?: Log, options: MutationOptions = {}) {
  const definition = await checkedWritableRootDefinition(root);
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("delete");
  const resolved = await resolveEntry(definition, name);
  if (resolved === null && !options.repositoryEntryOnly)
    return {
      ok: false,
      error: `技能不存在: ${name}`,
      code: "error.skill.notFound",
      params: { name },
    };
  const targets = (await safeExistingEntryPaths(definition.path, name))
    .filter(target => !options.repositoryEntryOnly || target.fileName === name);
  if (!targets.length) return { ok: false, error: `技能不存在: ${name}`, code: "error.skill.notFound", params: { name } };
  if (definition.key === "agents") {
    for (const target of targets) {
      if ((await lstatOrNull(target.path))?.isSymbolicLink())
        return { ok: false, error: `技能目录不安全，拒绝写入: ${target.path}`, code: "error.root.unsafe", params: { path: target.path } };
    }
  } else {
    const bundle = entryPath(definition.path, name);
    if (bundle && (await isDirectoryLink(bundle))) return linkedWriteError(bundle);
```

</details>

**依据 5 · 源码核查**：[src/index.ts:644-655](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/index.ts#L644-L655)

删除路由接回收站并区分永久删除。

<details>
<summary>查看原文（12行）</summary>

```text
            case "/api/michengai/dsh-skills-manager/delete":
                          return run(res, () => withScope(body, async (scope) => {
                            const target = await workspaceTarget(body);
                            if (target && "ok" in target && target.ok === false) return target;
                            const root = target ? (target as { root: SkillRoot }).root : await requestRoot(String(body.root || "dsh"), scope?.projectCwds);
                            return repositories.trashSkill(root, String(body.name || ""));
                          }), afterWrite);
            case "/api/michengai/dsh-skills-manager/trash-restore":
              return run(res, () => withScope(body, (scope) => repositories.restoreTrash(String(body.id || ""), { ...(scope ?? {}), registeredWorkspaces: registeredWorkspacePaths(ctx) })), afterWrite);
            case "/api/michengai/dsh-skills-manager/trash-delete":
              return run(res, () => repositories.permanentlyDeleteTrash(String(body.id || "")));
            case "/api/michengai/dsh-skills-manager/detail":
```

</details>

**依据 6 · 源码核查**：[lib/index.js:330-360](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/lib/index.js#L330-L360)

运行时工具与确认钩子存在。

<details>
<summary>查看原文（31行）</summary>

```text
      name: "create_skill",
      description: "Create a new local DSH skill in DSH_HOME/skills. Use only when the user explicitly asks to create or save a reusable skill.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Skill name; it will be normalized to kebab-case." },
          description: { type: "string", description: "A concise routing description for when to use the skill." },
          body: { type: "string", description: "Markdown instructions that form the skill body." }
        },
        required: ["name", "description", "body"],
        additionalProperties: false
      },
      output: {
        schema: { type: "object" },
        render: (_args, value) => [{ type: "text", text: value && value.ok === false ? `Skill creation failed${typeof value.code === "string" ? ` (${value.code})` : ""}.` : `Created DSH skill ${value.name} at ${value.path}` }]
      },
      async execute(args) {
        return enqueueMutation(async () => {
          const result = await createSkill(args, log);
          if (!result || result.ok !== false) afterWrite();
          return result;
        });
      },
      presentCall(args) {
        return { card: "generic", title: "Create DSH skill", kind: "edit", rawInput: args && args.name ? String(args.name) : void 0 };
      }
    }), "skills-manager create_skill tool");
    if (typeof ctx.on === "function") ctx.on("tools/pre-execute", (exec, next) => {
      if (exec && exec.name === "create_skill") return Promise.resolve({ kind: "ask", reason: "Create a new skill under DSH_HOME/skills" });
      return next();
    });
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本与效果支持到哪？

**研究主题**：效果与总成本

#### 完整回答

一次合格任务应包含找到正确技能、在目标会话调用、确认正文与资源路径、必要时更新或恢复。插件把复制、目录查找和冲突检查集中起来，但并不省去技能内容审查、宿主适配及真实任务验收。扫描和归档限额控制资源上界，也会使大目录或大仓库无法按预期导入，用户需分拆或改用人工流程。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、磁盘扫描与可选仓库下载；金额未知 | 备份策略和技能目录，审阅各来源、同名副本与内容 | 来源默认启用；实际扫描延迟未知 |
| 持续使用 | 仓库归档下载、扫描和备份磁盘 | 审阅更新差异、本地修改、模型是否选对技能 | 目录/归档有预算，净节时与调用质量未知 |
| 失败恢复 | stage与备份目录占用 | 分清未完成安装、文件替换和来源状态，按错误保留材料恢复 | 自动恢复失败需人工接管 |
| 退出 | 已安装技能、策略及备份继续留存 | 清点原生与外部候选，恢复需要的调用策略 | 移除插件不等于删除已写技能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一发现与启停 | 全局和agent层provider连接同一策略 | 宿主组合中的实际调用与提示选择质量 |
| 防止陈旧预览覆盖 | token绑定完整本地/目标摘要并写前复验 | 外部进程竞态与硬中断完整恢复 |
| 减少误删损失 | 回收站、备份、回滚摘要检查 | 真实恢复成功率和管理员总投入 |

插件自身在线更新与仓库技能更新不同：前者会调用profile包管理器安装npm版本，后者下载技能文件并不执行其代码。安装技能不运行脚本不等于以后模型使用技能也没有执行副作用，需分别审查。本轮未安装、未运行测试，也不把README列出的兼容矩阵当独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/repositories.ts:99-143](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repositories.ts#L99-L143)

下载资源预算。

<details>
<summary>查看原文（45行）</summary>

```text
/** 解压前检查声明大小，解压后再检查实际大小和大小写路径冲突。 */
export function decodeRepositoryArchive(bytes: Uint8Array) {
  if (bytes.byteLength > LIMIT) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
  let total = 0, count = 0;
  const seen = new Set();
  const archive = unzipSync(new Uint8Array(bytes), { filter(entry) {
    safePath(entry.name.replace(/\/$/, ""));
    const key = entry.name.toLowerCase().replace(/\/$/, "");
    if (seen.has(key)) throw failure("仓库存在重复路径");
    seen.add(key);
    total += entry.originalSize;
    if (++count > 10000 || entry.originalSize > LIMIT || total > 64 << 20) throw failure("仓库解压大小或文件数量超限");
    return !entry.name.endsWith("/");
  } });
  const result: Archive = Object.create(null);
  let root;
  for (const [path, data] of Object.entries(archive)) {
    const slash = path.indexOf("/");
    if (slash < 1) throw failure("仓库归档路径无效");
    const prefix = path.slice(0, slash);
    if (root && root !== prefix) throw failure("仓库归档根目录不唯一");
    root = prefix;
    const relative = safePath(path.slice(slash + 1));
    if (data.byteLength > LIMIT) throw failure("仓库文件过大");
    result[relative] = data;
  }
  return result;
}

async function readResponse(response: Response, limit: number) {
  if (!response.ok) throw Object.assign(failure(`仓库访问失败（HTTP ${response.status}），请稍后重试`, "error.repo.network"), { httpStatus: response.status });
  if (Number(response.headers.get("content-length")) > limit) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
  const reader = response.body?.getReader();
  if (!reader) throw failure("仓库响应为空", "error.repo.network");
  const chunks = []; let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) throw failure("仓库归档超过 32 MiB", "error.repo.tooLarge");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks, length);
```

</details>

**依据 2 · 源码核查**：[src/repository-updates.ts:116-149](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repository-updates.ts#L116-L149)

stage、备份及人工恢复责任。

<details>
<summary>查看原文（34行）</summary>

```text
  async function replace(input: SkillRequest, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("文件或版本已变化，请重新预览");
    if (plan.localModified && input.overwrite !== true) throw failure("存在本地修改，请确认备份后替换", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true }); await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries!)) {
        safePath(path); const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true }); await fs.writeFile(file, bytes, { flag: "wx" });
      }
      // 下载期间仍可能编辑文件，替换前复验，避免覆盖预览之后的修改。
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("本地文件已变化，请重新预览");
      const previous = { ...record }; delete previous.backup;
      const nextRecord = rollback ? { ...record.backup!.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      // 跨卷或文件锁导致重命名失败时直接终止，不降级为覆盖复制。
      await renameWithRetry(target, backup); moved = true;
      await renameWithRetry(stage, target); replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) { const error = caught as CodedError;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch { recoveryFailed = true; throw failure("自动恢复失败，原文件保留在备份目录，请勿重复操作", "error.repo.state"); }
      }
      throw error;
    } finally { if (!recoveryFailed) await fs.rm(stage, { recursive: true, force: true }); }
```

</details>

**依据 3 · 源码核查**：[src/plugin-updater.ts:398-423](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/plugin-updater.ts#L398-L423)

插件自身更新确实启动包管理器，与技能归档导入不同。

<details>
<summary>查看原文（26行）</summary>

```text
async function install(target: UpdateTarget, packageSpec: string) {
  if (target.desktopPnpm !== void 0) {
    await guardReleaseAgeExclude(target.profileDir, packageSpec);
    const handle = target.desktopPnpm.runPlugin(["add", "--config.minimumReleaseAge=0", packageSpec, "--registry=https://registry.npmjs.org/"], target.profileDir);
    const result = await handle.done;
    if (result.exitCode !== 0) throw new Error(`更新进程退出码 ${String(result.exitCode)}。`);
    await recordReleaseAgeExclude(target.profileDir, packageSpec);
    return;
  }
  if (target.packageManager !== void 0) {
    await guardReleaseAgeExclude(target.profileDir, packageSpec);
    const manager = target.packageManager;
    await new Promise<void>((resolvePromise, reject) => {
      const child = spawn(manager.command, [...manager.args, "add", "--config.minimumReleaseAge=0", packageSpec, "--registry=https://registry.npmjs.org/"], {
        cwd: target.profileDir, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...manager.env, NO_COLOR: "1" },
      });
      let detail = "";
      child.stdout?.on("data", (chunk) => { detail = (detail + String(chunk)).slice(-4e3); });
      child.stderr?.on("data", (chunk) => { detail = (detail + String(chunk)).slice(-4e3); });
      const timer = setTimeout(() => { child.kill(); reject(new Error("更新超时，请改用手工更新。")); }, 10 * 6e4);
      child.once("error", (error) => { clearTimeout(timer); reject(error); });
      child.once("exit", (code) => { clearTimeout(timer); if (code === 0) resolvePromise(); else reject(new Error(detail.trim() || `更新进程退出码 ${String(code)}`)); });
    });
    await recordReleaseAgeExclude(target.profileDir, packageSpec);
    return;
  }
```

</details>

#### 缺口

- 缺相同技能任务的检索、调用、更新和恢复对照。
  **影响**：不能量化节时、正确率和净采用成本。
  **进一步探讨**：用固定来源与真实任务对比人工维护，记录选错副本、遗漏和恢复时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些人值得试，怎样验证新的信任假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有多个技能目录、经常更新公共技能且能恢复本地文件的人，可先在一个已登记测试项目试用。安装前保留技能与管理策略原件，审阅外部来源，先关闭不需要的来源；放入两份内容有区别的同名测试技能，核对项目覆盖、禁用和重新启用后实际调用的正文。随后只给一个可追溯仓库技能制造本地修改，预览更新并确认是否拒绝未授权覆盖，最后验收回滚与回收站恢复。

若只能看到条目而不能调用、禁用后仍加载错误副本、预览后本地修改被覆盖，或恢复提示指向保留备份，就停止更新，保留该目录和状态并回到人工维护。只读外部目录不等于可信输入，对来源不明确或会执行高影响脚本的技能不应因安装方便而启用。仅有少量原生技能的人可继续使用原生目录，不必增加管理状态。

可提出未验证的“技能内容信任与版本确认”假设。现有策略主要围绕来源与名称，更新以文件摘要保护修改，但技能正文仍直接交给调用链。可尝试在首次启用与内容摘要改变时呈现变化和所需资源，由用户确认该版本适用范围；确认记录绑定正文摘要而不是仅绑定名称，若版本变更则回到待确认。它可能把文件管理保证推进到更清楚的指令引入意图，但不能自动证明语义安全，还增加审阅负担。

最小验证用同名不同正文、合法但危险指令、附属脚本变更与无害文档更新对比当前开关和摘要确认，记录误启用、审阅耗时、拒绝率与任务完成率。若没有减少误引入、却让正常更新频繁被无意义阻断，应否定或收窄该假设；不能把它计为本插件已有安全能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/core.ts:2039-2049](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L2039-L2049)

来源默认启用构成首次审阅前提。

<details>
<summary>查看原文（11行）</summary>

```text

function defaultManagerState(): ManagerState {
  const sources: ManagerState["sources"] = Object.create(null);
  const disabledSkills: ManagerState["disabledSkills"] = Object.create(null);
  const enabledSkills: ManagerState["enabledSkills"] = Object.create(null);
  for (const root of userRoots()) {
    sources[root.key] = true;
    disabledSkills[root.key] = [];
    enabledSkills[root.key] = [];
  }
  return { version: 1, sources, disabledSkills, enabledSkills, sidebarEntry: false, onlineUpdate: true, categories: Object.create(null), categoryMembers: Object.create(null), categoryOrder: Object.create(null) };
```

</details>

**依据 2 · 源码核查**：[src/core.ts:3973-4024](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/core.ts#L3973-L4024)

正文进入provider，缺内容信任确认。

<details>
<summary>查看原文（52行）</summary>

```text
export async function getProviderSkill(candidate: ProviderCandidate, options: ScopeOptions = {}) {
  const locator = candidate && candidate.locator;
  if (
    !locator ||
    typeof locator.path !== "string" ||
    typeof locator.rootKey !== "string" ||
    typeof locator.realEntryPath !== "string" ||
    typeof locator.realDocPath !== "string"
  )
    return undefined;
  let root = rootByKey(locator.rootKey);
  if (
    !root &&
    PROJECT_ROOT_KEY_RE.test(locator.rootKey) &&
    typeof options.cwd === "string"
  ) {
    root = (await projectRoots([options.cwd])).find(
      (item) => item.key === locator.rootKey,
    );
  }
  if (!root) return undefined;
  try {
    const entry = await resolveEntry(root, String(locator.entryName || ""));
    if (!entry || resolve(entry.docPath) !== resolve(locator.path))
      return undefined;
    if (
      pathIdentity(entry.realEntryPath) !== pathIdentity(locator.realEntryPath)
    )
      return undefined;
    if (pathIdentity(entry.realDocPath) !== pathIdentity(locator.realDocPath))
      return undefined;
    const doc = parseSkillDoc(
      await fs.readFile(entry.realDocPath || entry.docPath, "utf8"),
    );
    const summary = entryOf(locator.entryName, entry.kind, entry.docPath, doc);
    if (!summary.loadable) return undefined;
    const invocationName = KEBAB_RE.test(summary.declaredName) ? summary.declaredName : toKebab(summary.declaredName);
    if (invocationName !== candidate.name && summary.declaredName !== candidate.name) return undefined;
    return {
      name: candidate.name,
      description: candidate.description,
      invocation: candidate.invocation,
      provider: candidate.provider,
      source: candidate.source,
      resourceBase: candidate.resourceBase,
      path: candidate.path,
      metadata: candidate.metadata,
      content: doc.body.trim(),
    };
  } catch {
    return undefined;
  }
```

</details>

**依据 3 · 源码核查**：[src/repository-updates.ts:113-149](https://github.com/MichengAI/dsh-skills-manager/blob/ed76f87992ece26d2dd95e5e555deec94876d242/src/repository-updates.ts#L113-L149)

已有摘要更新门禁可作新假设的参照。

<details>
<summary>查看原文（37行）</summary>

```text
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("文件或版本已变化，请重新预览");
    if (plan.localModified && input.overwrite !== true) throw failure("存在本地修改，请确认备份后替换", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true }); await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries!)) {
        safePath(path); const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true }); await fs.writeFile(file, bytes, { flag: "wx" });
      }
      // 下载期间仍可能编辑文件，替换前复验，避免覆盖预览之后的修改。
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("本地文件已变化，请重新预览");
      const previous = { ...record }; delete previous.backup;
      const nextRecord = rollback ? { ...record.backup!.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      // 跨卷或文件锁导致重命名失败时直接终止，不降级为覆盖复制。
      await renameWithRetry(target, backup); moved = true;
      await renameWithRetry(stage, target); replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) { const error = caught as CodedError;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch { recoveryFailed = true; throw failure("自动恢复失败，原文件保留在备份目录，请勿重复操作", "error.repo.state"); }
      }
      throw error;
    } finally { if (!recoveryFailed) await fs.rm(stage, { recursive: true, force: true }); }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
