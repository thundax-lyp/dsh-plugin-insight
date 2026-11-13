# DSH Skills Manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5d9db87](https://github.com/MichengAI/dsh-skills-manager/tree/5d9db87081504d2c6751d5617665a54fb80c4bd5)

<!-- BEGIN META -->
[![GitHub ★ 550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 160,217](https://img.shields.io/static/v1?label=npm+30d&message=160%2C217&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中集中发现、加载和管理本机及仓库技能，支持工作区和自定义预设。

> **亮点**：把自定义预设纳入宿主的技能候选与启停策略，保留官方预设只读。批量变更支持固定目标、差异预览和逐项来源记录。见 [Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：成功复制技能不保证来源记录已落盘或宿主已刷新。调用和写入还依赖当前宿主作用域及审批。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 集中面板怎样接到宿主实际的技能发现？](#detail-section-11)
  - [Q02 · 如何区分内置预设与自定义预设的调用及写入？](#detail-section-12)
  - [Q03 · 仓库批量变更怎样在文件与记录之间保留结果？](#detail-section-13)
  - [Q04 · 面板 API、工具审批和插件更新由谁控制？](#detail-section-14)
  - [Q05 · 何时值得试用，怎样判断新增核对是否有效？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在多个 DSH 项目与预设维护技能的用户，可在设置中核对来源、调用范围和安装记录。见 [Q01](#research-q01)。

宿主原生发现可直接调用，手工 Git 和目录备份可管理版本。插件把多来源、实际作用域和变更回执连在同一流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多来源与预设浏览 | 查看本机技能和实际目标 | 内置及相对路径预设只读 |
| Agent 候选控制 | 按工作区和预设限制实际调用 | 取决于宿主提供的作用域和刷新 |
| 批量仓库变更 | 检查、更新、回退和卸载多个技能 | 逐项执行，失败后核文件和来源状态 |
| 创建本机技能 | 将明确的复用需求写成文件 | 受宿主工具审批和目录约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Node、DSH、Skill 与连接服务 | 插件入口需要 | 注册 provider 和设置变更 | 缺少连接时不挂 API |
| 已登记工作区或安全的自定义预设目录 | 对应范围写入需要 | 明确文件落点 | 重叠或不安全路径拒绝写入 |
| 可访问仓库、Git 和本机磁盘 | 仓库安装及更新需要 | 获取与核对文件 | 网络、冲突或内容变化时核错误 |
| 人工审阅技能内容 | 采用需要 | 评估指令及副作用 | 未核实内容暂不加载 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建隔离预设或项目，选一份已审阅技能 | 来源、目标和调用范围可辨认 |
| 导入 | 在面板选明确目标并保存 | 核目录及来源记录 |
| 验证 | 查看技能详情并从目标 Agent 核调用 | 手动及模型策略符合预期 |
| 更新 | 阅读差异后确认一次替换及回退 | 文件变化或恢复失败则停止写入，保留备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、网络和测试目录 | 核来源及预设范围 | 初始化耗时未知 |
| 持续使用 | Git 缓存及备份 | 审阅指令、差异及实际调用 | 使用技能产生的工具及模型开支另计 |
| 失败恢复 | 保留原文件及回收站 | 核来源状态、恢复目标和 provider | 跨进程与断电恢复未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多来源调用 | 预设作用域、同名与启停覆盖 | 真实宿主缓存和更新时序 |
| 批量变更 | 意图先落盘，逐项处理文件及记录 | 多进程和异常写入结果 |
| 更新回退 | 预览摘要及本地文件复核 | 真实用户时间与恢复率 |

以一次在目标 Agent 生效且完成回退的技能更新为单位，对照手工目录管理。

> **思考**：成功复制技能不保证来源记录已落盘或宿主已刷新。调用和写入还依赖当前宿主作用域及审批。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把自定义预设纳入宿主的技能候选与启停策略，保留官方预设只读。批量变更支持固定目标、差异预览和逐项来源记录。见 [Q02](#research-q02)、[Q03](#research-q03)。

全局及 Agent 作用域均挂 provider，使用候选覆盖处理同名。批量请求逐项保留结果，失败并不消除先前成功项。更新前核文件哈希及目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

成功复制技能不保证来源记录已落盘或宿主已刷新。调用和写入还依赖当前宿主作用域及审批。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离预设试一份已审阅的技能，核来源、版本和调用范围。状态与文件不符时停止写入，从本机备份恢复并回到手工管理。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持预设发现、Agent 候选、路径校验和批量来源记录。宿主刷新与真实恢复未复现，逐项验收清单为待验证方案。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、src/client.ts、src/index.ts、CHANGELOG.zh-CN.md、src/preset-skills.ts、src/core.ts、src/repositories.ts、src/repository-updates.ts、README.zh-CN.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查实际 DSH 接线、预设和候选、仓库批量操作及宿主审批边界。未执行插件、技能、网络请求或真实宿主。未审计全部目录后端、代理或跨进程竞态。
- 下一步：在固定版本的隔离 DSH 用两份同名测试技能检查范围切换和普通会话批准，再测试两项批量更新中的单项写入失败。

**分析版本**

- **仓库**：[MichengAI/dsh-skills-manager](https://github.com/MichengAI/dsh-skills-manager)
- **版本号**：1.4.3（[固定提交 5d9db87](https://github.com/MichengAI/dsh-skills-manager/tree/5d9db87081504d2c6751d5617665a54fb80c4bd5)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把来源、文件差异、目标预设及宿主可见状态组成逐项核对清单，验证是否能减少选错目录或误调用。若仍有误操作或审核负担持续高于人工，则缩小自动化范围。见 [Q05](#research-q05)。

在固定版本的隔离 DSH 用两份同名测试技能检查范围切换和普通会话批准，再测试两项批量更新中的单项写入失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2784 | — | — | 37669 |
| .js | source | 13 | 7834 | 7811 | 102 | — |
| .mjs | source | 9 | 952 | 894 | 24 | — |
| .ts | source | 25 | 13463 | 12357 | 633 | — |
| .mjs | test | 52 | 17363 | 16013 | 590 | — |
| .mjs | example | 2 | 141 | 137 | 2 | — |
| .ts | test | 2 | 89 | 76 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=43&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 44](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=44&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 管理多来源技能时，用户能否按实际工作区与预设限制调用和写入，并从批量变更中核对逐项结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 集中面板怎样接到宿主实际的技能发现？

**研究主题**：场景与需求、依赖、兼容与流程、功能与机制

#### 完整回答

适合已有 DSH、多个本机技能目录或登记项目的维护者。手工管理可直接查看文件，但需要逐个查来源、同名和改动。此插件用一个设置入口看目录和文件，宿主端同时注册全局 provider 和 Agent 自身作用域的 provider。其状态接口刷新预设后附加仓库来源与来源信息，附加失败时返回诊断。设置列表看得到的条目还需进入对应 Agent 的 provider 候选，才能判断实际调用。包声明 Node 22.19 或 24 起以及 DSH 0.2.x 对应范围，作者宣称核过 0.2.2-rc.2，当前研究只核源码接线。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-57](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/package.json#L45-L57)

声明补丁和 Web 依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[package.json:106-109](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/package.json#L106-L109)

版本范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
```

**依据 3 · 源码核查**：[lib/index.js:289-320](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/lib/index.js#L289-L320)

实际注册两层 provider 并创建仓库服务。

<details>
<summary>查看原文（32行）</summary>

```text
function apply(ctx, config) {
  const log = makeLog();
  const repositories = createRepositoryManager({
    log,
    maxRepositoryBytes: config?.maxRepositoryBytes,
    maxTransientBytes: config?.maxTransientBytes,
    gitTimeoutMs: config?.gitTimeoutMs,
    registeredWorkspaces: () => registeredWorkspacePaths(ctx),
    getPresetRoots: () => getPresetRootsCached(ctx)
  });
  const findUserRoot = (key) => userRoots().find((root) => root.key === key);
  const providerInvalidators = /* @__PURE__ */ new Set();
  const invalidateSkills = () => {
    invalidatePresetRootsCache(ctx);
    for (const invalidate of providerInvalidators) invalidate();
  };
  const afterWrite = () => notifyChatCatalog(ctx, invalidateSkills);
  if (typeof ctx.on === "function") {
    ctx.effect(() => ctx.on("agent-preset/selected", () => invalidatePresetRootsCache(ctx)), "skills-manager preset cache invalidation");
  }
  let mutationQueue = Promise.resolve();
  const enqueueMutation = (task) => {
    const queued = mutationQueue.then(task, task);
    mutationQueue = queued.catch(() => void 0);
    return queued;
  };
  ctx.effect(() => ctx.skills.registerProvider((control) => externalSkillProvider(control, providerInvalidators)), "skills-manager global external skills provider");
  ctx.effect(() => registerAgentSkillProviders(ctx, providerInvalidators), "skills-manager agent-scoped external skills providers");
  if (ctx.tools && typeof ctx.tools.register === "function") {
    ctx.effect(() => ctx.tools.register({
      name: "create_skill",
      description: "Create a new local DSH skill in DSH_HOME/skills. Use only when the user explicitly asks to create or save a reusable skill.",
```

</details>

**依据 4 · 源码核查**：[src/client.ts:1685-1694](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/client.ts#L1685-L1694)

设置页真实注册与异常处理。

<details>
<summary>查看原文（10行）</summary>

```text
      const mountSettingsSection = () => {
        if (!settingsSectionSupported || offSettingsSection) return;
        if (sidebarController && !sidebarController.isSettingsSectionEnabled()) return;
        try {
          const unreg = ctx.slots.register({ name: "settings.section", id: "skills-manager", order: 25, label: function () { return ctx.locale.bind(NS)("title"); }, icon: "skill", locale: NS }, SkillManagerSection);
          offSettingsSection = typeof unreg === "function" ? (unreg as () => void) : () => {};
        } catch (reason) {
          console.warn("skills-manager: register settings.section failed:", reason);
          offSettingsSection = null;
        }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:495-509](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L495-L509)

读取面板状态、附加来源及诊断。

<details>
<summary>查看原文（15行）</summary>

```text
  const attachSources = async <T extends { roots: RootView[]; warnings: Diagnostic[] }>(snapshot: T) => {
    try {
      const sources = await repositories.sources();
      for (const root of snapshot.roots) {
        const realRoot = await realpath(root.path).catch(() => root.path);
        for (const skill of root.skills || []) skill.installSource = sources[installationSourceKey(realRoot, skill.name)] ?? null;
      }
    } catch (caught) { const error = caught as CodedError; snapshot.warnings.push({ code: "error.repo.state", error: error.message }); }
    try { await attachProvenance(snapshot); }
    catch (caught) { const error = caught as CodedError; snapshot.warnings.push({ code: "error.repo.state", error: error.message }); }
    return snapshot;
  };
  const stateWithSources = async (req: Request) => {
    const presetRoots = await getPresetRootsCached(ctx, true);
    return attachSources(await state({ ...projectOptions(req.headers.get("x-dsh-skills-session")), presetRoots }));
```

</details>

**依据 6 · 作者声明**：[CHANGELOG.zh-CN.md:3-8](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/CHANGELOG.zh-CN.md#L3-L8)

作者兼容核验声明。

```text
## [1.4.3] - 2026-11-12

### 兼容性与维护优化

- 完成 DeepSeek Harness `0.2.2-rc.2` 全量兼容验证，支持范围涵盖 `0.2.0-rc.1` 至 `0.2.2-rc.2` 全部 RC 宿主。
- 对齐开发依赖至官方 `0.2.2-rc.2`、Cordis `4.1.0` 与 Schemastery `3.19.0`，并同步更新多语言说明文档中的版本徽章与兼容验证列表。
```

#### 缺口

- 目标宿主下刷新、重启和 provider 重新选择效果未知。
  **影响**：不能仅凭设置列表判断已能调用。
  **进一步探讨**：以同一技能核面板、手动调用与模型候选，改变配置后重复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何区分内置预设与自定义预设的调用及写入？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

发现过程尝试宿主当前的预设注册表及随包目录。现有目录中，绝对路径且非官方来源的自定义预设可写可启停，内置和相对路径只读浏览。Agent 侧根据宿主查询到的实际合成预设 ID 只引入可开关的对应根。全局、项目和活动预设的同名候选先选优先项，必要时发布较高优先级的策略候选以阻止关闭后回落到宿主原生副本。模型与手动调用分别受文档声明和来源及技能启停约束。禁用模型调用可保留手动入口。读正文前重新确认候选根、真实文件和目录标识，随后保留候选原有的调用策略。要改变调用策略应触发刷新，不能仅替换文件并假设已取得最新候选。

对自定义预设写入还要检查与全局目录是否重叠并核祖先路径；项目目录同样拒绝重叠及指向项目外的路径。该机制增量是把外部目录管理和实际 Agent 选择接起来。作用域依赖宿主提供合成预设，跨进程文件变化和内容信任仍需人工确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/preset-skills.ts:313-347](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/preset-skills.ts#L313-L347)

发现与可写开关按预设来源及绝对路径区分。

<details>
<summary>查看原文（35行）</summary>

```text
    for (let i = 0; i < declaredDirs.length; i++) {
      let dir = declaredDirs[i];
      if (dir === "@deepseek-ai/dsh-agent-preset/skills" && cordisBundledSkillsDir) {
        dir = cordisBundledSkillsDir;
      }
      // 依据宿主 @deepseek-ai/dsh-skill-filesystem/lib/index.js:78：
      // 宿主直接以 resolve(root) 解析 customSkillDirs（相对路径随进程 cwd，且不展开 ~）。
      // 为保证发现位置与宿主实际加载目录完全一致，这里对齐使用 resolve(trimmedDir)；
      // 同时为防止相对路径或 ~ 写法因启动目录变化而误写入错位位置，仅对绝对路径且非宿主安装包内的自定义预设开放可写。
      const trimmedDir = dir.trim();
      const resolved = resolve(trimmedDir);
      if (seenPaths.has(resolved)) continue;
      if (!(await isExistingDir(resolved))) continue;
      seenPaths.add(resolved);

      const isBuiltin = presetBuiltin || isHostBuiltinLocation(resolved) || (Boolean(cordisBundledSkillsDir) && resolved === cordisBundledSkillsDir);
      const rootKey = declaredDirs.length === 1 ? `preset-${preset.id}` : `preset-${preset.id}-${i + 1}`;
      const presetName = preset.name || BUILTIN_PRESET_NAMES[preset.id] || preset.id;
      const suffix = declaredDirs.length === 1 ? "" : ` (${i + 1})`;
      const label = `预设: ${presetName}${suffix}`;

      const mutable = !isBuiltin && isAbsolute(trimmedDir);
      roots.push({
        key: rootKey,
        path: resolved,
        label,
        rank: 10000 + roots.length * 10,
        mutable,
        native: isBuiltin,
        // 自定义绝对路径预设依托 agent-scoped provider 实现真开关拦截；内置、宿主包内目录或相对路径预设保持只读不可开关。
        toggleable: mutable,
        kind: "preset",
        group: `${presetName}${suffix}`,
        presetId: preset.id,
        localeKey: `preset.${preset.id}`,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:260-274](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L260-L274)

只取宿主当前可开关的实际预设。

<details>
<summary>查看原文（15行）</summary>

```text
async function resolveAgentPresetScope(
  hostCtx?: HostContext,
  agentCtx?: unknown,
  options: ScopeOptions = {},
): Promise<ScopeOptions> {
  if (!hostCtx || !agentCtx) return options;
  const getService = typeof hostCtx.get === "function" ? (hostCtx.get as (name: string) => unknown).bind(hostCtx) : undefined;
  const agentPresets = getService?.("agentPresets") as { composedPreset?: (ctx: unknown) => unknown } | undefined;
  const activePresetId = typeof agentPresets?.composedPreset === "function"
    ? agentPresets.composedPreset(agentCtx)
    : undefined;
  if (typeof activePresetId !== "string" || !activePresetId.trim()) return options;
  const allPresets = await getPresetRootsCached(hostCtx);
  const matchingPresets = allPresets.filter((root) => root.presetId === activePresetId && root.toggleable);
  return matchingPresets.length > 0 ? { ...options, presetRoots: matchingPresets } : options;
```

</details>

**依据 3 · 源码核查**：[src/index.ts:277-320](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L277-L320)

在 Agent 自身范围安装列候选和读正文逻辑。

<details>
<summary>查看原文（44行）</summary>

```text
function externalSkillProvider(
  control: ProviderControl,
  invalidators: Set<() => void>,
  hostCtx?: HostContext,
  agentCtx?: unknown,
) {
  invalidators.add(control.invalidate);
  if (control.signal && typeof control.signal.addEventListener === "function") {
    control.signal.addEventListener("abort", () => {
      invalidators.delete(control.invalidate);
    }, { once: true });
  }
  return {
    name: "dsh-skills-manager-external",
    list: async (options?: ScopeOptions) => listProviderCandidates(await resolveAgentPresetScope(hostCtx, agentCtx, options)),
    get: async (candidate: ProviderCandidate, options?: ScopeOptions) => getProviderSkill(candidate, await resolveAgentPresetScope(hostCtx, agentCtx, options)),
  };
}

/**
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
    const dispose = skills.registerProvider((control) => externalSkillProvider(control, invalidators, ctx, agentCtx));
    registrations.set(agent.id, dispose);
  };

  const uninstall = (agent: Agent) => {
    if (!agent) return;
    const dispose = registrations.get(agent.id);
    registrations.delete(agent.id);
    if (typeof dispose === "function") dispose();
```

</details>

**依据 4 · 源码核查**：[src/core.ts:4135-4179](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/core.ts#L4135-L4179)

活动预设、同名组与调用策略覆盖。

<details>
<summary>查看原文（45行）</summary>

```text
  const activePresets = policyResult.writable === false
    ? []
    : (options.presetRoots || []).filter((root) => root.kind === "preset" && root.toggleable);
  if (activePresets.length > 0) {
    const presetScans = await scanDeduplicatedRoots(activePresets);
    for (const root of activePresets) {
      const scanned = presetScans.get(root.key);
      if (!scanned) continue;
      for (const entry of scanned.entries) {
        items.push({ root, entry, policy: effectiveSkillPolicy(policyResult, root, entry) });
      }
    }
  }
  for (const group of groupLoadableSkillsByName(items).values()) {
    const { root, entry, policy } = selectSkillWinner(group);
    // 关闭的外部来源不覆盖其他插件；原生副本、预设原生来源、分发链接及显式单技能禁用仍需阻断。
    const hasNativeCopy = group.some(({ root, entry }) => root.native || root.kind === "preset" ||
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
    // 原生根与预设根由宿主自己的 provider 提供；来源停用或单技能停用必须发布覆盖层，否则停用不生效。
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
```

</details>

**依据 5 · 源码核查**：[src/core.ts:1895-1906](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/core.ts#L1895-L1906)

Frontmatter 两种调用声明。

<details>
<summary>查看原文（12行）</summary>

```text
function entryOf(name: string, kind: string, docPath: string, doc: Pick<ParsedSkill, "map" | "hasFrontmatter">) {
  const declaredName = doc.map.name !== undefined ? unquote(doc.map.name) : "";
  const description =
    doc.map.description !== undefined ? unquote(doc.map.description) : "";
  const modelValue = parseBoolValue(doc.map["disable-model-invocation"]);
  const userValue = parseBoolValue(doc.map["user-invocable"]);
  const modelDisabled = modelValue === true;
  const userDisabled = userValue === false;
  const invocationPolicyValid =
    (doc.map["disable-model-invocation"] === undefined ||
      modelValue !== undefined) &&
    (doc.map["user-invocable"] === undefined || userValue !== undefined);
```

</details>

**依据 6 · 源码核查**：[src/core.ts:2443-2459](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/core.ts#L2443-L2459)

总开关与有效调用方式。

<details>
<summary>查看原文（17行）</summary>

```text
  if ((!isReadonlyPreset && policyResult.writable === false) || !sourceEnabled || override === false) {
    return {
      override,
      sourceEnabled,
      modelInvocable: false,
      userInvocable: false,
      enabled: false,
    };
  }
  const modelInvocable = entry.invocationPolicyValid ? entry.modelInvocable : true;
  const userInvocable = entry.invocationPolicyValid ? entry.userInvocable : true;
  return {
    override,
    sourceEnabled,
    modelInvocable,
    userInvocable,
    enabled: true,
```

</details>

**依据 7 · 源码核查**：[src/core.ts:4240-4273](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/core.ts#L4240-L4273)

读正文前核真实路径，保留候选调用策略。

<details>
<summary>查看原文（34行）</summary>

```text
  if (!root && options.presetRoots) {
    root = options.presetRoots.find((item) => item.key === locator.rootKey);
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
```

</details>

**依据 8 · 源码核查**：[src/core.ts:1375-1407](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/core.ts#L1375-L1407)

预设与工作区写入路径保护。

<details>
<summary>查看原文（33行）</summary>

```text
async function checkedWritableRootDefinition(root: RootInput): Promise<SkillRoot | OperationError | null | undefined> {
  const definition = writableRootDefinition(root);
  if (definition?.key === "agents") {
    return checkedUserRootAncestors(definition);
  }
  if (definition?.kind === "preset" && definition.native === false) {
    if (await overlapsUserSkillRoot(definition.path)) {
      return {
        ok: false,
        error: `预设技能目录与用户技能目录重叠，拒绝写入: ${definition.path}`,
        code: "error.root.unsafe",
        params: { path: definition.path },
      };
    }
    return checkedUserRootAncestors(definition);
  }
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
```

</details>

#### 缺口

- 宿主快速换预设或直接改文件后的候选失效时序未测。
  **影响**：不能保证每次调用都观察到最新策略。
  **进一步探讨**：在隔离 Agent 中交替选择两个同名预设，验证候选、手动调用及停用行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 仓库批量变更怎样在文件与记录之间保留结果？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

批量安装最多 100 项，共用一个已解析目标，对同名和重复输入逐项拒绝。文件复制前持久化包含 commit、目标及文件哈希的未完成意图；逐项复制、按适用条件启用并标记完成，再写回最终来源状态。若最后状态写失败，文件可能已经复制，返回来源状态未确认，不能直接重跑。卸载绑定具体安装记录和当前文件摘要，先记回收站意图，再移除目标。失败时只有能证明文件及状态符合恢复条件才清除意图。多个条目并非一个全有或全无的事务。

更新或回退先返回每项预览摘要，目标位置、版本、原文件、新文件和操作方向共同决定令牌。替换前重新读取并拒绝内容变化或未经批准的本地覆盖。文件先备份再重命名，写来源记录失败时尝试恢复，失败保留备份。批量更新逐项复用这条路径并按顺序返回结果。相对手工 git 复制，预览和来源绑定可减少误更新。内容可信、多个宿主并发及断电恢复仍须单独验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/repositories.ts:859-899](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repositories.ts#L859-L899)

批量目标范围、冲突和来源意图内容。

<details>
<summary>查看原文（41行）</summary>

```text
    installMany: (input: { items?: Array<{ id?: unknown; path?: unknown }>; root?: unknown; workspace?: string }, registered?: string[]) => serialize(async () => {
      const rawItems = Array.isArray(input?.items) ? input.items : [];
      if (!rawItems.length) throw failure("批量安装项为空", "error.repo.empty");
      if (rawItems.length > 100) throw failure("批量安装项超过上限（最多 100 项）", "error.repo.tooMany");
      let root: any, workspaceRoot: string | undefined;
      let presetRoots: SkillRoot[] | undefined;
      if (input.workspace !== undefined) {
        if (input.root !== undefined && input.root !== "dsh") throw failure("工作区只能安装到项目 DSH skills");
        const target = await resolveWorkspaceTarget(input.workspace, registered);
        if ("ok" in target && target.ok === false) throw failure(target.error, target.code, target.params);
        root = (target as { root: any }).root;
        workspaceRoot = root.projectRoot;
      } else {
        presetRoots = await fetchPresetRoots();
        root = await recordInstallRoot({ root: input.root }, registered, undefined, presetRoots);
      }
      const data = await read();
      const sameTarget = (await state({ projectCwds: workspaceRoot ? [workspaceRoot] : [], ...(presetRoots ? { presetRoots } : {}) })).roots.filter(item => workspaceRoot ? item.projectRoot === workspaceRoot && item.kind === "project-dsh" : root.kind === "preset" ? item.key === root.key : item.scope !== "project");
      const taken = new Set<string>();
      for (const item of sameTarget) for (const entry of item.skills || []) {
        taken.add(entry.name.toLowerCase());
        if (entry.declaredName) taken.add(entry.declaredName.toLowerCase());
      }
      type BulkInstallResult = { id: string; path: string; name?: string; ok: boolean; error?: string; code?: string; params?: unknown };
      const results: BulkInstallResult[] = new Array(rawItems.length);
      const prepared: Array<{ slot: number; id: string; path: string; name: string; record: InstallRecord; entries: Array<{ path: string; data: string }> }> = [];
      const seen = new Set<string>();
      for (const [slot, raw] of rawItems.entries()) {
        const id = typeof raw?.id === "string" ? raw.id : "";
        const path = typeof raw?.path === "string" ? raw.path : "";
        const duplicate = JSON.stringify([id, path]);
        if (seen.has(duplicate)) { results[slot] = { id, path, ok: false, error: "重复的安装项", code: "error.repo.duplicate" }; continue; }
        seen.add(duplicate);
        try {
          const repo = repository(data, id);
          const skill = repo.skills.find((s) => s.path === path);
          if (!skill || !skill.valid) throw failure("技能不存在或格式无效");
          const lowered = skill.name.toLowerCase();
          if (taken.has(lowered)) throw failure("同名技能已存在，不会覆盖本地文件", "error.repo.conflict");
          const entries = await preparedEntries(repo, skill, path);
          const record: InstallRecord = { id, path, root: workspaceRoot ? "dsh" : root.key, ...(workspaceRoot ? { workspace: workspaceRoot } : {}), source: { owner: repo.owner, name: repo.name, ref: repo.ref, subdirectory: repo.subdirectory, ...(repo.url ? { url: repo.url } : {}) }, name: skill.name, commit: repo.commit, complete: false, files: entries.map((e) => ({ path: e.path, hash: hash(Buffer.from(e.data, "base64")) })) };
```

</details>

**依据 2 · 源码核查**：[src/repositories.ts:908-932](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repositories.ts#L908-L932)

先意图，后复制，最终来源记录可能不确定。

<details>
<summary>查看原文（25行）</summary>

```text
      if (prepared.length) await write(data);
      if (prepared.length) await resolveInstallRoot({ root: input.root, workspace: workspaceRoot }, registered, undefined, presetRoots);
      for (const item of prepared) {
        let copied = false;
        try {
          const result = await importUploadedSkill({ name: item.name, entries: item.entries }, log, { conflict: "skip", root });
          if (result.ok === false || !result.imported?.length) throw failure(result.error || "技能安装失败或遇到同名冲突", typeof result.code === "string" ? result.code : "error.repo.conflict", result.params);
          copied = true;
          if (root.toggleable !== false && root.kind !== "preset") {
            const enabled = await setSkillEnabled(root, item.name, true, log);
            if (enabled && typeof enabled === "object" && "ok" in enabled && enabled.ok === false) throw failure(enabled.error || "技能启用状态无法写入", typeof enabled.code === "string" ? enabled.code : "error.repo.enableState", enabled.params);
          }
          item.record.complete = true;
          results[item.slot] = { id: item.id, path: item.path, name: item.name, ok: true };
        } catch (caught) { const error = caught as CodedError;
          data.installs = data.installs.filter((record) => record !== item.record);
          try { await write(data); }
          catch { throw failure("安装未完成且来源记录无法撤销，请恢复磁盘写入后检查技能目录", "error.repo.installState"); }
          if (copied) await fs.rm(join(root.path, item.name), { recursive: true, force: true }).catch(() => undefined);
          results[item.slot] = { id: item.id, path: item.path, name: item.name, ok: false, error: error.message, code: String(error.code || "error.repo.invalid"), params: error.params };
        }
      }
      if (prepared.length) {
        try { await write(data); }
        catch { throw failure("技能文件已安装但来源状态未确认，请恢复磁盘写入后重新打开仓库页", "error.repo.installState"); }
```

</details>

**依据 3 · 源码核查**：[src/repositories.ts:957-995](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repositories.ts#L957-L995)

卸载目标摘要、回收站意图及失败恢复。

<details>
<summary>查看原文（39行）</summary>

```text
        try {
          const request = { id, path: entryPath, ...(raw?.root !== undefined ? { root: raw.root as SkillRequest["root"] } : {}), ...(typeof raw?.workspace === "string" ? { workspace: raw.workspace } : {}) };
          const record = await pickInstallRecord(data.installs, request, index.registered, "没有可追溯的安装记录，不能卸载", presetRoots);
          if (selected.has(record)) throw failure("重复的卸载项", "error.repo.duplicate");
          selected.add(record);
          rootKey = record.root || "dsh";
          workspaceKey = record.workspace;
          const root = await resolveInstallRoot(record, index.registered, await indexedFor(record), presetRoots);
          const fingerprint = signature(fileIndex(await readSkillTree(join(root.path, record.name))));
          const trashId = `${Date.now()}-${randomUUID()}`;
          // 先持久化卸载意图；本进程失败凭据或中断恢复检查决定能否撤销。
          const catalog = catalogCopies(data, root, record.name);
          prepared.push({ slot, id, path: entryPath, record, root, fingerprint, trashId, catalog });
        } catch (caught) { const error = caught as CodedError;
          results[slot] = { id, path: entryPath, ...(rootKey ? { root: rootKey } : {}), ...(workspaceKey ? { workspace: workspaceKey } : {}), ok: false, error: error.message, code: String(error.code || "error.repo.invalid"), params: error.params };
        }
      }
      for (const item of prepared) {
        try {
          item.record.trashId = item.trashId;
          item.record.uninstallFingerprint = item.fingerprint;
          for (const entry of item.catalog) entry.trashId = item.trashId;
          try { await write(data); } catch (error) {
            delete item.record.trashId; delete item.record.uninstallFingerprint;
            for (const entry of item.catalog) delete entry.trashId;
            throw error;
          }
          await resolveInstallRoot(item.record, index.registered, await indexedFor(item.record), presetRoots);
          const result = await deleteSkill(item.root, item.record.name, log, { repositoryEntryOnly: true, repositoryTrash: { id: item.trashId, repository: { id: item.id, path: item.path } }, ...(item.catalog.length ? { catalogTrash: { id: item.trashId, ids: item.catalog.map(entry => entry.id) } } : {}) });
          if ("ok" in result && result.ok === false) throw result;
          results[item.slot] = { id: item.id, path: item.path, root: item.record.root || "dsh", ...(item.record.workspace ? { workspace: item.record.workspace } : {}), ok: true };
        } catch (caught) { const error = caught as CodedError;
          if (item.record.trashId && await deleteRolledBack(caught, item.record.trashId, item.record, item.fingerprint, await indexedFor(item.record))) {
            delete item.record.trashId;
            delete item.record.uninstallFingerprint;
            for (const entry of item.catalog) delete entry.trashId;
            await write(data);
          }
          results[item.slot] = { id: item.id, path: item.path, ...(item.record.root ? { root: item.record.root } : {}), ...(item.record.workspace ? { workspace: item.record.workspace } : {}), ok: false, error: error.message || (caught as { error?: string })?.error, code: String(error.code || "error.repo.invalid"), params: error.params };
```

</details>

**依据 4 · 源码核查**：[src/repository-updates.ts:127-170](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repository-updates.ts#L127-L170)

令牌及文件变更复验、备份及恢复。

<details>
<summary>查看原文（44行）</summary>

```text
        const archive = await download(repo, path), prefix = path ? path + "/" : "";
        entries = Object.fromEntries(Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => [p.slice(prefix.length), bytes]));
        if (signature(fileIndex(entries)) !== signature(next)) throw failure("下载内容与预览版本不同，请重新检查更新");
      }
    }
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false, sharedData?: Awaited<ReturnType<typeof read>>) {
    const plan = await prepare({ ...input, rollback }, true, sharedData);
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
      const index = data.installs.findIndex(item => item === record || (item.id === record.id && item.path === record.path && item.name === record.name && item.root === record.root && item.workspace === record.workspace));
      if (index !== -1) data.installs[index] = record;
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

**依据 5 · 源码核查**：[src/repository-updates.ts:204-246](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repository-updates.ts#L204-L246)

逐项预览、替换和状态。

<details>
<summary>查看原文（43行）</summary>

```text
    // 批量预览：一次状态读取、一次返回全部 token；结果按请求顺序（结果[slot] 对应 items[slot]）。
    previewMany: (input: { items?: BulkUpdateItem[] }) => serialize(async () => {
      const rawItems = bulkItems(input, "批量预览");
      const data = await read();
      const results: BulkPreviewResult[] = new Array(rawItems.length);
      const seen = new Set<string>();
      for (const [slot, raw] of rawItems.entries()) {
        const id = typeof raw.id === "string" ? raw.id : "";
        const path = typeof raw.path === "string" ? raw.path : "";
        const rollback = raw.rollback === true;
        const duplicate = JSON.stringify([id, path, raw.root ?? null, typeof raw.workspace === "string" ? raw.workspace : null, rollback]);
        if (seen.has(duplicate)) { results[slot] = { id, path, rollback, ok: false, error: "重复的更新项", code: "error.repo.duplicate" }; continue; }
        seen.add(duplicate);
        try {
          const plan = await prepare({ ...(raw as unknown as SkillRequest), rollback }, false, data);
          results[slot] = { id, path, rollback, ok: true, token: plan.token, commit: plan.commit, localModified: plan.localModified, changes: plan.changes };
        } catch (caught) { const error = caught as CodedError;
          results[slot] = { id, path, rollback, ok: false, error: error.message, code: String(error.code || "error.repo.invalid"), params: error.params };
        }
      }
      return { results };
    }),
    // 批量替换：共享同一份状态数据（单项互不重叠，见去重键），逐项复用单技能 replace 的备份/回滚事务并各自写盘。
    updateMany: (input: { items?: BulkUpdateItem[] }) => serialize(async () => {
      const rawItems = bulkItems(input, "批量更新");
      const data = await read();
      const results: BulkReplaceResult[] = new Array(rawItems.length);
      const seen = new Set<string>();
      for (const [slot, raw] of rawItems.entries()) {
        const id = typeof raw.id === "string" ? raw.id : "";
        const path = typeof raw.path === "string" ? raw.path : "";
        const rollback = raw.rollback === true;
        const duplicate = JSON.stringify([id, path, raw.root ?? null, typeof raw.workspace === "string" ? raw.workspace : null, rollback]);
        if (seen.has(duplicate)) { results[slot] = { id, path, rollback, ok: false, error: "重复的更新项", code: "error.repo.duplicate" }; continue; }
        seen.add(duplicate);
        try {
          const outcome = await replace({ ...(raw as unknown as SkillRequest), rollback }, rollback, data);
          results[slot] = { id, path, rollback, ok: true, name: outcome.name, commit: outcome.commit };
        } catch (caught) { const error = caught as CodedError;
          results[slot] = { id, path, rollback, ok: false, error: error.message, code: String(error.code || "error.repo.invalid"), params: error.params };
        }
      }
      return { results };
```

</details>

#### 缺口

- 批量崩溃、跨进程并发及状态存储异常缺真实宿主结果。
  **影响**：不宜对重要目录执行大批替换。
  **进一步探讨**：对隔离目录的两项更新注入第二项写入失败，核第一项、失败项及备份的实际状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 面板 API、工具审批和插件更新由谁控制？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

变更路由仅注册到宿主 connection.fetch。请求先做格式校验与限量解析，再解析工作区并排队执行。缺少该服务时记录警告并不注册这些路由。该边界依赖宿主的实际鉴权，插件代码不能证明反代或其他宿主扩展的整条安全链。create_skill 另由工具注册，只写一个本机技能。存在预执行事件接口时一般返回 ask，高权限会话会继续执行。这个工具的说明要求显式创建请求，实际授权和高权限选择还要核宿主。

旧版面板自更新不再出现。固定 Git 树对照中原插件自更新、模型与 UI 模块已删除，发布声明将插件安装更新交回宿主插件中心。仓库中 Skill 的批量更新仍是插件自己的文件操作，不能将面板卸载等同于自动清除曾导入的技能文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:512-541](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L512-L541)

请求验证、工作区检查与变更排队。

<details>
<summary>查看原文（30行）</summary>

```text
  const handlePost = async (
    req: Request,
    action: (body: RequestBody, scope: { projectCwds: string[] } | null) => Promise<unknown>,
    options?: { maxBytes?: number; afterSuccess?: (body: RequestBody) => void; isRepo?: boolean; queued?: boolean }
  ) => {
    const mutationError = validateMutationRequest(req);
    if (mutationError) {
      return jsonResponse(mutationError.statusCode, { ok: false, code: mutationError.code, error: mutationError.error });
    }
    let body: RequestBody;
    try {
      body = await readJsonBody(req, options?.maxBytes);
    } catch (caught) {
      const e = caught as CodedError;
      return jsonResponse(Number.isInteger(e && e.statusCode) ? e.statusCode! : 400, {
        ok: false,
        code: (e && typeof e.code === "string") ? e.code : "error.proto.invalidJson",
        error: String(e && e.message ? e.message : e),
      });
    }
    if (options?.isRepo && (!body || typeof body !== "object" || Array.isArray(body))) {
      return jsonResponse(400, { ok: false, code: "error.repo.invalid", error: "仓库参数必须是对象" });
    }
    const execute = async () => {
      const scope = await workspaceScope(body);
      if (scope && "ok" in scope && scope.ok === false) return scope;
      return action(body, scope as { projectCwds: string[] } | null);
    };
    const afterSuccess = options?.afterSuccess ? () => options.afterSuccess!(body) : undefined;
    return runFetch(() => (options?.queued !== false ? enqueueMutation(execute) : execute()), afterSuccess);
```

</details>

**依据 2 · 源码核查**：[src/index.ts:901-924](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L901-L924)

只注册宿主连接，不提供裸路由回退。

<details>
<summary>查看原文（24行）</summary>

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
        })
      );
      return () => {
        for (const disposer of disposers) {
          try {
            disposer();
          } catch {
            /* ignore */
          }
        }
      };
    }
    ctx.logger?.warn?.("Skills Manager routes require authenticated connection.fetch");
    return () => {};
  }, "skills-manager: API routes");
```

</details>

**依据 3 · 源码核查**：[src/index.ts:412-458](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/index.ts#L412-L458)

工具实际写入路径及审批分支。

<details>
<summary>查看原文（47行）</summary>

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
    if (typeof ctx.on === "function") {
      const registerPreExecute = () => ctx.on!("tools/pre-execute", (exec, next) => {
        if (exec && exec.name === "create_skill") {
          if (isDangerFullAccess(ctx, exec)) return next();
          return Promise.resolve({
            kind: "ask",
            reason: "Create a new skill under DSH_HOME/skills",
            displayReason: {
              en: "Create a new skill under DSH_HOME/skills",
              zh: "在 DSH_HOME/skills 目录下创建新技能",
            },
          });
        }
        return next();
      });
      if (typeof ctx.effect === "function") {
        ctx.effect(registerPreExecute, "skills-manager create_skill pre-execute guard");
      } else {
```

</details>

**依据 4 · 作者声明**：[CHANGELOG.zh-CN.md:38-47](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/CHANGELOG.zh-CN.md#L38-L47)

作者注明移除面板自更新。

<details>
<summary>查看原文（10行）</summary>

```text
## [1.4.0] - 2026-11-09

### 新功能

- **全面支持官方内置 8 门语言**：新增德语、西班牙语、法语、日语、葡萄牙语与俄语的插件元信息清单（`locale/*.json`）及完整使用说明文档，在不同语言的宿主环境下均可展示地道的功能简介与操作指引。

### 行为变更

- **移除面板内的在线更新入口与配置开关**：技能管理器的安装、更新与卸载全生命周期由 DSH 宿主插件中心统一管理，面板顶栏不再展示「检查更新」按钮，插件配置页中同步移除多余的更新开关。
- **完善插件标准化元数据**：补充发布者信息、规范图标导出路径与宿主清单版本声明，提升与宿主插件市场的兼容性。
```

</details>

#### 缺口

- 实际部署的 host 鉴权、高权限规则及卸载后目录保留状态未验。
  **影响**：须防止把宿主配置默认值视为所有环境中的强制批准。
  **进一步探讨**：在受控 profile 核未授权请求、普通工具批准及禁用后 provider 和文件留存。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，怎样判断新增核对是否有效？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

可先在隔离预设目录维护一份已审阅、无外部副作用的测试技能。用户核对来源和版本，预览新旧文件，先验证手动与模型调用符合预期，再做一次更新和回退。路径提示与实际目录不符、文件在预览后变化或来源状态未确认时停止写入，核对本机备份并回到手工目录管理。首次需要选择宿主、目录和来源，持续需要审查技能指令、占用网络与磁盘并核调用范围。技能后续引发的模型或外部工具开支单独记录。没有日常节省时间或安全效果的实测数据。

可测试的下一步是把预览令牌绑定的目标及文件差异、调用作用域和宿主可见状态放进逐项核对清单。比较现有面板和人工清单在更新后误调用、选错预设、恢复与审阅耗时上的差异。若有额外提示仍频繁选择错误目标或明显慢于手工，就保留文件差异与独立回退，不扩大自动化范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:194-198](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/README.zh-CN.md#L194-L198)

作者说明自定义和内置预设的使用范围。

```text
### Agent 预设模式（Agent Presets）

插件自动发现 DSH 中包含专属技能目录的 Agent 预设模式，并稳定归位于全局技能列表末尾：
- **官方内置预设**（如创造模式）：随包内置的技能严格保持只读浏览，支持查看详情，不提供无意义开关且不改动宿主内置文件；
- **自定义预设模式**：您在 DSH 中自行创建的自定义模式（通过 `customSkillDirs` 配置了专属技能目录），支持与全局技能完全一致的管理能力——包括启停单个技能或整组开关（实时拦截宿主调用）、整理分类与添加备注、在「创建技能」「导入」「仓库 / 市场安装」弹窗中直接选择目标预设模式写入，以及卸载删除至回收站和原路径恢复。与全局技能目录重叠的预设路径将被安全拦截以防误删；配置为相对路径的预设出于防写偏安全考虑，自动以「只读（相对路径）」模式展示（配置为绝对路径即可开放完整管理）。
```

**依据 2 · 源码核查**：[src/repository-updates.ts:132-151](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repository-updates.ts#L132-L151)

预览和目标的实际绑定。

<details>
<summary>查看原文（20行）</summary>

```text
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false, sharedData?: Awaited<ReturnType<typeof read>>) {
    const plan = await prepare({ ...input, rollback }, true, sharedData);
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
```

</details>

**依据 3 · 源码核查**：[src/repositories.ts:920-932](https://github.com/MichengAI/dsh-skills-manager/blob/5d9db87081504d2c6751d5617665a54fb80c4bd5/src/repositories.ts#L920-L932)

复制完成与来源记录可能不一致。

<details>
<summary>查看原文（13行）</summary>

```text
          item.record.complete = true;
          results[item.slot] = { id: item.id, path: item.path, name: item.name, ok: true };
        } catch (caught) { const error = caught as CodedError;
          data.installs = data.installs.filter((record) => record !== item.record);
          try { await write(data); }
          catch { throw failure("安装未完成且来源记录无法撤销，请恢复磁盘写入后检查技能目录", "error.repo.installState"); }
          if (copied) await fs.rm(join(root.path, item.name), { recursive: true, force: true }).catch(() => undefined);
          results[item.slot] = { id: item.id, path: item.path, name: item.name, ok: false, error: error.message, code: String(error.code || "error.repo.invalid"), params: error.params };
        }
      }
      if (prepared.length) {
        try { await write(data); }
        catch { throw failure("技能文件已安装但来源状态未确认，请恢复磁盘写入后重新打开仓库页", "error.repo.installState"); }
```

</details>

#### 缺口

- 同版本的实际 Agent 使用和恢复时间未测。
  **影响**：采用价值仅限可控试用。
  **进一步探讨**：用两个同名测试技能比较手工和插件操作，记录有效作用域、回退与确认耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
