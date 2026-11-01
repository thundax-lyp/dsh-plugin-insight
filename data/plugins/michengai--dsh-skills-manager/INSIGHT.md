# DSH Skills Manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[09510fe](https://github.com/MichengAI/dsh-skills-manager/tree/09510fe0bdb56d32ae62238ebde30368b2f56046)

<!-- BEGIN META -->
[![GitHub ★ 426](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=426&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 142,851](https://img.shields.io/static/v1?label=npm+30d&message=142%2C851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)
<!-- END META -->

> **功能**：在 DSH 中管理本地与项目 Skills，并提供仓库导入、更新和备份恢复。

> **亮点**：插件将多个来源的候选、启停策略及仓库更新流程接入 DSH，并用预览令牌和本地复验限制部分过期覆盖；相对于手工记录提供可核查的组织机制，不证明净节时或内容安全。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：更新失败可能留下文件已安装但来源状态未确认，回退也可能失败；旧 webServer 回退的实际认证及接收阶段大小限制尚未确认，不能把界面上的备份和路由检查视为完整安全保障。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 用户要管理什么，插件相对原有办法增加了什么？](#detail-section-11)
  - [Q02 · 设置页、provider 和状态如何连接？](#detail-section-12)
  - [Q03 · 仓库安装与更新如何检查内容、冲突和回退？](#detail-section-13)
  - [Q04 · 依赖、安全准入与恢复负担有哪些边界？](#detail-section-14)
  - [Q05 · 如何试用，什么改进值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 使用多个本地和项目 Skill 来源的维护者，可以在界面统一查看与配置；重复需求和效率尚无独立用户材料。[Q01](#research-q01)

用户可手工查看 Skill 文件并通过宿主原生机制管理；原生 provider 已提供其根目录的技能，插件提供额外策略与界面而非独占加载能力。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 来源管理与启停 | 管理本地、项目 Skill 的调用策略 | 原生 provider 与作用域优先级仍需宿主验证 |
| 仓库安装与预览 | 安装已选 Skill 并比较更新 | 依赖目标登记与来源可访问，内容仍需审阅 |
| 更新与回滚 | 校验预览并备份旧目录 | 失败恢复可能失败，需要人工检查备份 |
| create_skill | 创建本地 DSH Skill | 源码注册执行前询问，真实宿主行为未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 和宿主服务 | 必需 | 加载 provider、路由和设置页 | 未满足时不能假定插件可用 |
| 注册工作区 | 项目写入需要 | 限定项目目标 | 未登记则拒绝目标 |
| GitHub 与网络 | 仓库功能需要 | 获取与刷新 Skill | 访问失败需保留现有文件并检查错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者核对宿主版本和目标范围 | 条件不符先停止 |
| 查看 | 用户在设置页检查来源与策略 | 与实际目录对照 |
| 更新 | 用户预览差异并确认替换 | 本地文件或版本变化则重新预览 |
| 恢复 | 用户检查结果和备份 | 恢复报错时停止重复操作并人工检查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装、网络与磁盘成本未知 | 配置来源及宿主耗时未知 | 兼容性未实测 |
| 持续使用 | 仓库访问和备份空间未知 | 审阅来源及变更时间未知 | 内容安全由用户判断 |
| 失败恢复 | 备份与重试资源未知 | 检查文件和来源状态 | 自动恢复可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多来源管理 | provider、策略和设置页有接线 | 真实宿主可用性与用户节时 |
| 仓库更新 | 预览令牌、复验与备份分支存在 | 所有失败情况下可恢复或内容可信 |

> **思考**：更新失败可能留下文件已安装但来源状态未确认，回退也可能失败；旧 webServer 回退的实际认证及接收阶段大小限制尚未确认，不能把界面上的备份和路由检查视为完整安全保障。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件将多个来源的候选、启停策略及仓库更新流程接入 DSH，并用预览令牌和本地复验限制部分过期覆盖；相对于手工记录提供可核查的组织机制，不证明净节时或内容安全。[Q02](#research-q02) [Q03](#research-q03)

provider 与 Agent 生命周期对应，更新令牌绑定当前与目标内容，替换失败尝试恢复并报告未恢复状态。回退 HTTP 路由和缓存刷新仍有独立宿主与运行边界。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

更新失败可能留下文件已安装但来源状态未确认，回退也可能失败；旧 webServer 回退的实际认证及接收阶段大小限制尚未确认，不能把界面上的备份和路由检查视为完整安全保障。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合在 DSH 管理多个来源且愿意审阅变更的维护者先用隔离工作区试用；来源不明、文件在预览后变化或恢复报错时停止并人工核对备份。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有机制基于固定源码解释；尚未进行真实宿主或效果验证，未来设计仅为假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/core.ts、src/client.ts、src/repositories.ts、src/repository-updates.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查宿主 provider、设置页、仓库更新及路由代表路径；未对所有 96 个文件做安全审计，未执行插件、第三方仓库、真实宿主或失败注入。
- 下一步：在隔离 profile 检查同名 Skill 覆盖与禁用，验证 connection 和回退路由准入，并用本地编辑、写入故障和备份恢复逐步对照磁盘。

**分析版本**

- **仓库**：[MichengAI/dsh-skills-manager](https://github.com/MichengAI/dsh-skills-manager)
- **版本号**：1.2.26（[固定提交 09510fe](https://github.com/MichengAI/dsh-skills-manager/tree/09510fe0bdb56d32ae62238ebde30368b2f56046)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：预览时将权限敏感指令与来源信任说明并列，可能帮助维护者发现不适合安装的 Skill，但会增加审阅成本；对照普通文件差异测发现率、误报和时间，若无改善或负担不可接受则否定。[Q05](#research-q05)

在隔离 profile 检查同名 Skill 覆盖与禁用，验证 connection 和回退路由准入，并用本地编辑、写入故障和备份恢复逐步对照磁盘。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1276 | — | — | 20563 |
| .js | source | 11 | 7201 | 7193 | 89 | — |
| .mjs | source | 9 | 941 | 884 | 22 | — |
| .ts | source | 25 | 12235 | 11342 | 486 | — |
| .mjs | test | 44 | 14175 | 13195 | 453 | — |
| .mjs | example | 1 | 61 | 59 | 1 | — |
| .ts | test | 2 | 89 | 76 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=43&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=43&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 用户管理本地与仓库 Skills 的实际接线、安全边界及恢复成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户要管理什么，插件相对原有办法增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 中使用多个本地 Agent Skill 来源的个人或维护者，可以在统一面板查看、启停及导入；作者还描述仓库发现与更新。以手工查看目录、修改宿主配置为基线，插件源码通过宿主 provider 加载候选、以本地策略决定调用状态，并注册设置页；这使管理和来源选择集中在界面中，但不证明使用者无需理解来源优先级或因此节省时间。原生 provider 本身提供原生根的技能，代码也在无须覆盖时让其继续工作；不能将宿主原本加载能力归给插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-31](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/README.md#L20-L31)

作者描述管理、导入、仓库和回收站。

<details>
<summary>查看原文（12行）</summary>

```text
> DSH Skills Manager is a community-maintained DeepSeek Harness (DSH) plugin, not an official DeepSeek AI product.

This README describes **1.2.26**. Released changes are in the [changelog](CHANGELOG.md).

## Features

Bring skills from your computer and projects into DSH without switching between Agent folders.

- **Unified multi-view management**: Browse Global Skills, Project Skills, Discover, and Trash in unified tabs with instant search, status filtering, and collapsible source groups.
- **Broad ecosystem support**: Full coverage for 20+ tools and CLI environments including DSH, Shared Agent, Codex, Claude Code, Copilot, Cursor, Google Antigravity, Windsurf, Qoder, and Trae without touching third-party files.
- **Categorization and drag & drop**: Create category folders inside sources, drag skill rows (`⋮⋮`) to organize and order them, batch assign skills, and toggle entire categories with a single switch. Category metadata is saved without moving files.
- **Public markets & repositories**: Integrated Discover hub to explore trending skills from ClawHub and skills.sh, or subscribe to public GitHub repositories with incremental diff inspection and backups.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:232-243](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L232-L243)

provider 的 list/get 调用项目自身扫描与读取函数。

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

**依据 3 · 源码核查**：[src/index.ts:322-334](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L322-L334)

宿主注册全局和 Agent 作用域 provider。

<details>
<summary>查看原文（13行）</summary>

```text
  const providerInvalidators = new Set<() => void>();
  const invalidateSkills = () => {
    for (const invalidate of providerInvalidators) invalidate();
  };
  const afterWrite = () => notifyChatCatalog(ctx, invalidateSkills);
  let mutationQueue: Promise<unknown> = Promise.resolve();
  const enqueueMutation: Serialize = (task) => {
    const queued = mutationQueue.then(task, task);
    mutationQueue = queued.catch(() => undefined);
    return queued;
  };
  ctx.effect(() => ctx.skills.registerProvider((control) => externalSkillProvider(control, providerInvalidators)), "skills-manager global external skills provider");
  ctx.effect(() => registerAgentSkillProviders(ctx, providerInvalidators), "skills-manager agent-scoped external skills providers");
```

</details>

**依据 4 · 源码核查**：[src/core.ts:4024-4040](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/core.ts#L4024-L4040)

原生根不需要覆盖时让宿主 provider 继续提供。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/client.ts:1346-1349](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/client.ts#L1346-L1349)

注册设置页。

```text
      }, "skills-manager: plugin update ui");
      installSettingsNavIcon(ctx, function () { return ctx.locale.bind(NS)("title"); });
      ctx.slots.inject("settings.section", function () { return ctx.slots.register({ name: "settings.section", id: "skills-manager", order: 25, label: function () { return ctx.locale.bind(NS)("title"); }, icon: "skill", locale: NS }, SkillManagerSection); });
      sidebarController = setupSidebarEntry(ctx, {
```

#### 缺口

- 没有独立用户任务、频率或操作对照
  **影响**：不能确定持续需求或净节时
  **进一步探讨**：使用同一组本地与项目 Skill，比较面板和宿主原有操作并记录正确结果及人工操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置页、provider 和状态如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主 apply 把 provider 注册到全局和活跃 Agent 作用域，并通过 Agent 创建和销毁事件管理作用域注册。provider 列举用户根和当前工作目录相关项目根，按名称分组、优先级及管理策略决定是否提供覆盖候选；get 时重新解析路径并比较此前记录的真实路径，以减少读取与选择对象发生变化时的混淆。客户端通过设置插槽注册面板，callApi 将响应解析后用于界面；状态路由调用 state 并附安装来源。停用操作写管理策略而不是直接修改第三方文件。缓存失效或通知失败被捕获，不撤销已经完成的文件操作，因此界面或宿主菜单何时刷新仍需核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:251-287](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L251-L287)

Agent provider 伴随创建与销毁注册及释放。

<details>
<summary>查看原文（37行）</summary>

```text
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
  }

  return () => {
    if (typeof stopCreated === "function") stopCreated();
    if (typeof stopDisposed === "function") stopDisposed();
    for (const dispose of registrations.values()) {
      if (typeof dispose === "function") dispose();
    }
    registrations.clear();
  };
```

</details>

**依据 2 · 源码核查**：[src/core.ts:4000-4040](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/core.ts#L4000-L4040)

候选扫描、优先级与是否覆盖宿主原生项。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/core.ts:4085-4117](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/core.ts#L4085-L4117)

读取前复核定位与真实路径。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:386-396](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L386-L396)

状态附加来源信息。

<details>
<summary>查看原文（11行）</summary>

```text
  const attachSources = async <T extends { roots: RootView[]; warnings: Diagnostic[] }>(snapshot: T) => {
    try {
      const sources = await repositories.sources();
      for (const root of snapshot.roots) {
        const realRoot = await realpath(root.path).catch(() => root.path);
        for (const skill of root.skills || []) skill.installSource = sources[installationSourceKey(realRoot, skill.name)] ?? null;
      }
    } catch (caught) { const error = caught as CodedError; snapshot.warnings.push({ code: "error.repo.state", error: error.message }); }
    return snapshot;
  };
  const stateWithSources = async (req: Request) => attachSources(await state(projectOptions(req.headers.get("x-dsh-skills-session"))));
```

</details>

**依据 5 · 源码核查**：[src/index.ts:437-442](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L437-L442)

状态端点实际调用 state。

```text
  const routes: ApiFetchRoute[] = [
    {
      path: `${API_PREFIX}/state`,
      methods: ["GET", "HEAD"],
      fetch: (req) => runFetch(() => stateWithSources(req), undefined, req.method === "HEAD"),
    },
```

**依据 6 · 源码核查**：[src/client.ts:230-231](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/client.ts#L230-L231)

客户端请求并解析响应。

```text
    function parseApiResponse<T = unknown>(response: Response): Promise<T> { return response.json().catch(function () { var error: CodedError = new Error("non-json response"); error.code = "error.proto.nonJson"; error.params = { status: response.status }; throw error; }).then(function (value: unknown) { const payload = value as {ok?: boolean; data: T}; if (!response.ok || payload.ok === false) throw payload; return payload.data; }); }
    function callApi<K extends keyof ApiRoutes>(path: K, options?: RequestInit): Promise<ApiRoutes[K]> { return fetch(resolveApiUrl("/api/michengai/dsh-skills-manager" + path), options).then(parseApiResponse<ApiRoutes[K]>); }
```

**依据 7 · 源码核查**：[src/core.ts:2590-2609](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/core.ts#L2590-L2609)

启停写管理状态并保留源文件。

<details>
<summary>查看原文（20行）</summary>

```text
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("toggle");
  const current = await readManagerState();
  if (current.writable === false) return invalidManagerStateWrite();
  const result = await applyPolicySkillEnabled(definition, name, enabled, current.state);
  if (result && result.ok === false) return result;
  await writeManagerState(current.state);
  if (log)
    log(
      enabled ? "policy-enable" : "policy-disable",
      `${enabled ? "启用" : "停用"} ${definition.key}/${name}（本地策略，源文件不变）`,
    );
  return result;
}

// ── 启用 / 停用（同时控制模型与 / 手动调用，非破坏）──────────────────────────

/** enabled=true 恢复模型与 / 手动调用；false 同时停用两种调用入口。 */
export async function setSkillEnabled(root: RootInput, name: string, enabled: boolean, log?: Log) {
  return setPolicySkillEnabled(root, name, enabled, log);
```

</details>

**依据 8 · 源码核查**：[src/index.ts:174-184](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L174-L184)

刷新失败不阻止已完成写入。

<details>
<summary>查看原文（11行）</summary>

```text
/** 文件写入后刷新宿主技能目录，并通知 Web 端重拉 `/` 菜单缓存。 */
function notifyChatCatalog(ctx: HostContext, invalidateSkills?: () => void) {
  try {
    if (typeof invalidateSkills === "function") invalidateSkills();
  } catch {
    /* 目录缓存失效失败不影响已完成的文件操作 */
  }
  try {
    if (typeof ctx.emit === "function") ctx.emit("commands/change");
  } catch {
    /* 命令目录刷新失败不影响已完成的文件操作 */
```

</details>

#### 缺口

- 未在真实 DSH 宿主验证 provider 优先级、生命周期与刷新
  **影响**：不能保证被禁用技能在所有版本或作用域都不可调用
  **进一步探讨**：用同名全局和项目技能，在匹配宿主中切换状态并分别检查候选和手动调用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 仓库安装与更新如何检查内容、冲突和回退？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

安装先确认目标工作区来自登记列表，检查同名冲突，再下载并比较 SKILL.md 的哈希；写入未完成安装记录后导入并启用，成功后标记完成。中间失败会尝试撤销记录和已复制目录；若最终写状态失败，代码明确报告文件已装而来源状态未确认，需人工检查。更新预览使用当前文件、目标版本和来源信息计算令牌；执行重新准备并比对令牌及本地改动，下载内容也与预览摘要比对，替换前再读一次本地文件。它将旧目录移到备份并替换，失败尝试恢复；恢复失败报告备份保留且不应盲目重复。目录扫描拒绝符号链接并限制大小，但这些措施不证明下载内容可信或并发文件系统变化完全无风险。

#### 证据与依据

**依据 1 · 源码核查**：[src/repositories.ts:862-885](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repositories.ts#L862-L885)

目标、重名与下载内容的安装前核对。

<details>
<summary>查看原文（24行）</summary>

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
      const archive = await download(repo, path), prefix = path ? `${path}/` : "";
      const document = archive[prefix + "SKILL.md"];
      if (!document || hash(document) !== skill.documentHash) throw failure("仓库技能内容与扫描版本不一致，请重新刷新");
      const entries = Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => ({ path: p.slice(prefix.length), data: Buffer.from(bytes).toString("base64") }));
      if (!entries.some((e) => e.path === "SKILL.md")) throw failure("仓库技能内容已失效");
```

</details>

**依据 2 · 源码核查**：[src/repositories.ts:889-911](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repositories.ts#L889-L911)

安装记录、复制、启用及失败和最终写入分支。

<details>
<summary>查看原文（23行）</summary>

```text
      const record: InstallRecord = { id, path, root: workspaceRoot ? "dsh" : root.key, ...(workspaceRoot ? { workspace: workspaceRoot } : {}), source: { owner: repo.owner, name: repo.name, ref: repo.ref, subdirectory: repo.subdirectory, ...(repo.url ? { url: repo.url } : {}) }, name: skill.name, commit: repo.commit, complete: false, files: entries.map((e) => ({ path: e.path, hash: hash(Buffer.from(e.data, "base64")) })) };
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

**依据 3 · 源码核查**：[src/repository-updates.ts:54-80](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repository-updates.ts#L54-L80)

路径、符号链接和大小限制。

<details>
<summary>查看原文（27行）</summary>

```text
function safePath(path: string) {
  if (typeof path !== "string" || !path || path.length > 512 || path.split("/").length > 64 || path.split("/").some(p => !p || p === "." || p === ".." || /[\\:<>"|?*\x00-\x1f]/.test(p) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) throw failure("技能文件路径无效");
}
async function safeDirectory(root: string) {
  for (let p = root; ; p = dirname(p)) {
    const info = await fs.lstat(p);
    if (info.isSymbolicLink() || !info.isDirectory()) throw failure("技能或备份目录包含链接");
    if (dirname(p) === p) break;
  }
}
/** 完整读取目录，新增文件参与冲突检测，禁止跟随链接。 */
export async function readSkillTree(root: string) {
  await safeDirectory(root);
  const result: Archive = Object.create(null); let size = 0, count = 0;
  async function walk(dir: string, prefix = "") {
    for (const entry of await fs.readdir(dir)) {
      const path = prefix + entry; safePath(path);
      if (++count > 2000) throw failure("技能目录数量超限");
      const target = join(dir, entry), info = await fs.lstat(target);
      if (info.isSymbolicLink()) throw failure("技能包含链接，拒绝更新");
      if (info.isDirectory()) await walk(target, path + "/");
      else {
        if (!info.isFile() || info.size > 32 << 20 || (size += info.size) > 64 << 20 || Object.keys(result).length >= 1000) throw failure("技能文件数量或大小超限");
        result[path] = await fs.readFile(target);
      }
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/repository-updates.ts:90-119](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repository-updates.ts#L90-L119)

预览令牌、备份有效性及本地修改门槛。

<details>
<summary>查看原文（30行）</summary>

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
        const archive = await download(repo, path), prefix = path ? path + "/" : "";
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
```

</details>

**依据 5 · 源码核查**：[src/repository-updates.ts:120-150](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repository-updates.ts#L120-L150)

替换前复验、备份和失败恢复。

<details>
<summary>查看原文（31行）</summary>

```text
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
    return { name: record.name, commit: plan.commit };
```

</details>

**依据 6 · 源码核查**：[src/index.ts:570-592](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L570-L592)

实际注册安装、预览、更新和回滚路由。

<details>
<summary>查看原文（23行）</summary>

```text
      path: `${API_PREFIX}/repositories/install`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, (b) => repositories.install(b, registeredWorkspacePaths(ctx)), { isRepo: true, afterSuccess: afterWrite }),
    },
    {
      path: `${API_PREFIX}/repositories/uninstall`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, (b) => repositories.uninstall(b), { isRepo: true, afterSuccess: afterWrite }),
    },
    {
      path: `${API_PREFIX}/repositories/preview`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, (b) => repositories.preview(b), { isRepo: true }),
    },
    {
      path: `${API_PREFIX}/repositories/update`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, (b) => repositories.update(b), { isRepo: true, afterSuccess: afterWrite }),
    },
    {
      path: `${API_PREFIX}/repositories/rollback`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, (b) => repositories.rollback(b), { isRepo: true, afterSuccess: afterWrite }),
```

</details>

#### 缺口

- 未在真实文件系统及仓库验证中断、跨卷和恢复
  **影响**：不能承诺自动回退在所有失败条件下成功
  **进一步探讨**：使用隔离临时目录构造本地编辑、下载变更和写入故障，逐步核对文件及记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、安全准入与恢复负担有哪些边界？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

包声明 Node ^22.19 或 24 以上及 DSH 0.2 线对等依赖；宿主必须提供技能、会话、工具与连接服务，客户端需 slots 和 locale。作者声明的测试兼容范围不是本次宿主验收。写路由要求自定义头、JSON，并在存在 Origin 时比对 host；源码注释将登录与跨站准入交给宿主 connection。代码还存在旧 webServer 回退，所读回退实现先缓冲请求体再交给路由，路由上限在读取 Request 文本后检查；因此不能仅凭限制值宣称回退链在接收时有界，也不能假定回退具备相同宿主认证。安装、外部 GitHub 访问、审阅差异、备份、回收与异常恢复会消耗用户时间、网络和磁盘；金额和耗时没有实测，Skill 内容也需使用者审阅。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:61-77](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/package.json#L61-L77)

DSH 对等依赖。

<details>
<summary>查看原文（17行）</summary>

```text
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-session": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-skill": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-web-app": ">=0.2.0-rc.1 <0.3.0-0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.3",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.3",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.3",
    "@deepseek-ai/dsh-host-webserver": "0.2.1-rc.3",
    "@deepseek-ai/dsh-scope": "0.2.1-rc.3",
```

</details>

**依据 2 · 源码核查**：[package.json:91-94](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/package.json#L91-L94)

Node 与 DSH 范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
```

**依据 3 · 源码核查**：[src/index.ts:102-120](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L102-L120)

写请求标记、Origin 和内容类型检查。

<details>
<summary>查看原文（19行）</summary>

```text
/** 写接口额外要求自定义头与 JSON；跨站与未登录由官方宿主 connection.admit / owner 门禁负责。 */
function validateMutationRequest(req: Request) {
  const marker = req.headers.get(CLIENT_MARKER_HEADER) || req.headers.get("x-michengai-client");
  if (marker !== "1") return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden mutation request" };
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const reqHost = req.headers.get("host") || new URL(req.url).host;
      if (originHost !== reqHost) {
        return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden cross-origin mutation request" };
      }
    } catch {
      return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden origin" };
    }
  }
  const contentType = String(req.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") return { statusCode: 415, code: "error.proto.contentType", error: "content-type must be application/json" };
  return null;
```

</details>

**依据 4 · 源码核查**：[src/index.ts:752-760](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L752-L760)

优先注册宿主 connection 路由。

```text
  ctx.effect(() => {
    // 方案 A：优先官方标准 connection.fetch.register
    if (ctx.connection?.fetch?.register) {
      const disposers = routes.map((route) =>
        ctx.connection!.fetch.register({
          path: route.path,
          methods: route.methods,
          requestBody: route.requestBody ?? "buffered",
          fetch: route.fetch,
```

**依据 5 · 源码核查**：[src/index.ts:773-820](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L773-L820)

旧 webServer 回退及完整缓冲请求体。

<details>
<summary>查看原文（48行）</summary>

```text
    // 兜底：无 connection 时自动通过 webServer 桥接 Fetch 路由（兼顾老测试和纯 webServer 环境）
    let webServer: HostContext["webServer"] | undefined;
    try {
      webServer = ctx.webServer;
    } catch {
      // 真实 Cordis Context Proxy 在未 inject 且无该服务时抛错，安全捕获忽略
    }
    if (webServer?.register) {
      const routeMap = new Map<string, ApiFetchRoute>();
      for (const r of routes) routeMap.set(r.path, r);
      return webServer.register({
        kind: "prefix",
        path: API_PREFIX,
        handler: async (req, res) => {
          const u = new URL(req.url!, "http://localhost");
          const path = u.pathname.replace(/\/+$/, "");
          const route = routeMap.get(path);
          if (!route) {
            json(res, 404, { ok: false, code: "error.proto.unknownAction", error: `unknown action: ${path}` });
            return;
          }
          if (!route.methods.includes(req.method!)) {
            json(res, 405, { ok: false, code: "error.proto.method", error: `method not allowed: ${req.method}` });
            return;
          }
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (v !== undefined) {
              if (Array.isArray(v)) for (const item of v) headers.append(k, item);
              else headers.set(k, v);
            }
          }
          try {
            let bodyBuffer: Buffer | null = null;
            if (req.method !== "GET" && req.method !== "HEAD") {
              bodyBuffer = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                req.on("data", (c) => chunks.push(c));
                req.on("end", () => resolve(Buffer.concat(chunks)));
                req.on("error", reject);
              });
            }
            const fetchReq = new Request(u.toString(), {
              method: req.method,
              headers,
              body: bodyBuffer && bodyBuffer.length > 0 ? new Uint8Array(bodyBuffer) : undefined,
            });
            const response = await route.fetch(fetchReq);
```

</details>

**依据 6 · 源码核查**：[src/index.ts:82-88](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/index.ts#L82-L88)

业务层读完请求文本后核对大小。

```text
async function readJsonBody(request: Request, limit = 1 << 20): Promise<RequestBody> {
  const text = await request.text();
  if (Buffer.byteLength(text) > limit) {
    const error: CodedError = new Error("body too large");
    error.statusCode = 413;
    error.code = "error.proto.bodyTooLarge";
    throw error;
```

**依据 7 · 作者声明**：[README.md:75-78](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/README.md#L75-L78)

作者声明版本测试和范围。

```text
Restart DSH, refresh the page, and open **Settings → Skills**. To update, select **Check for updates** or run the installation command again.

- Plugin `1.2.26` is tested with DeepSeek Harness `0.2.0-rc.1`, `0.2.0-rc.2`, `0.2.1-rc.1`, `0.2.1-rc.2`, `0.2.1-rc.3`.
- Host compatibility: Full DeepSeek Harness `0.2.x` line (`>=0.2.0-rc.1 <0.3.0-0`), forwards-compatible with subsequent `0.2.x` releases, alphas, and RCs without requiring routine plugin version bumps. Legacy versions and breaking changes in the `0.3.0` generation are rejected by the version gate. If you still use a `0.1.x` host, install plugin `1.1.23` instead of `@latest`.
```

#### 缺口

- 两种宿主路由的认证、代理部署和请求限制没有实测
  **影响**：不能将写接口本地检查当作完整访问控制或安全审计
  **进一步探讨**：在匹配宿主中检查实际准入链，隔离测试匿名、跨站和大请求。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用，什么改进值得验证？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

预览令牌同时绑定目标版本、本地文件和下一版本文件；更新前重新读取本地数据，能将一部分预览后的变化变成显式冲突，而不静默覆盖。这是可借鉴的并发保护设计，不代表消除了所有文件系统竞态。未验证假设是在预览中同时展示更新前后权限敏感指令和来源信任说明，可帮助维护者更早发现不适合安装的 Skill；它增加审阅负担，也不能由文本差异判定内容安全。应在相同一组包含正常及风险指令的 Skill 上比较普通文件差异和该说明，记录发现率、误报与审阅时间；若发现率未改善或负担不可接受则否定。建议维护者在隔离工作区用已核实来源小范围试用，预览后发现本地变化、来源不可确认或恢复报错就停止写入，核对备份并回到手工管理。

#### 证据与依据

**依据 1 · 源码核查**：[src/repository-updates.ts:103-119](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repository-updates.ts#L103-L119)

预览绑定内容和令牌及本地修改门槛。

<details>
<summary>查看原文（17行）</summary>

```text
    } else {
      const repo = repository(data, id), skill = repo.skills.find(s => s.path === path);
      if (repo.error || !skill?.valid || skill.name !== record.name || !skill.files) throw failure("请先成功检查更新；技能改名或已移除时不能直接替换");
      next = skill.files; commit = repo.commit;
      if (includeArchive) {
        const archive = await download(repo, path), prefix = path ? path + "/" : "";
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
```

</details>

**依据 2 · 源码核查**：[src/repository-updates.ts:127-150](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repository-updates.ts#L127-L150)

再次复验并在异常时尝试恢复。

<details>
<summary>查看原文（24行）</summary>

```text
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
    return { name: record.name, commit: plan.commit };
```

</details>

**依据 3 · 源码核查**：[src/repositories.ts:889-910](https://github.com/MichengAI/dsh-skills-manager/blob/09510fe0bdb56d32ae62238ebde30368b2f56046/src/repositories.ts#L889-L910)

安装可能留下文件已写但记录未确认状态。

<details>
<summary>查看原文（22行）</summary>

```text
      const record: InstallRecord = { id, path, root: workspaceRoot ? "dsh" : root.key, ...(workspaceRoot ? { workspace: workspaceRoot } : {}), source: { owner: repo.owner, name: repo.name, ref: repo.ref, subdirectory: repo.subdirectory, ...(repo.url ? { url: repo.url } : {}) }, name: skill.name, commit: repo.commit, complete: false, files: entries.map((e) => ({ path: e.path, hash: hash(Buffer.from(e.data, "base64")) })) };
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
```

</details>

#### 缺口

- 敏感指令审阅方案没有用户实验且安全定义依任务变化
  **影响**：不能声称降低实际安全事件或提效
  **进一步探讨**：预先定义风险样本和成功指标，使用相同材料做盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
