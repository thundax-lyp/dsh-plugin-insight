# DSH Toolbox UI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2adb277](https://github.com/Imzl-zl/dsh-toolbox-ui/tree/2adb27737bfe3f606be73078a1ac5c550102d3b4)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Imzl-zl/dsh-toolbox-ui) [![npm 30d 4,831](https://img.shields.io/static/v1?label=npm+30d&message=4%2C831&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-ui) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-ui)
<!-- END META -->

> **功能**：为 DSH Web 提供 MCP、技能与工具加载管理面板，可按全局或项目查看和调整配置。

> **亮点**：[Q01](#research-q01) 工作区工具页结合宿主注册表和已跟踪会话，帮助定位不同范围的已注册工具。[Q02](#research-q02) 按 Agent 延迟提供 schema。

> **主要限制**：[Q02](#research-q02) 工具页并集不能代表当前 Agent 的准入，读取视图失败可退回宿主全量呈现。[Q03](#research-q03) reveal 会把有效配置值送到浏览器。

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
  - [Q01 · 工具页为何要区分工作区视图与当前模型的真实工具范围？](#detail-section-11)
  - [Q02 · ToolSearch 何时减少 schema，是否可以作为权限边界？](#detail-section-12)
  - [Q03 · 配置导入、凭据显露和技能安装如何限制写入？](#detail-section-13)
  - [Q04 · 怎样试用并验证工具并集是否会被误解？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：管理多个 DSH 工作区的用户可在会话旁核对 MCP、技能和工具加载。

原生或手工配置可管理服务。工具箱集中显示连接、作用域和运行时列表，仍要核对当前会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 与技能面板 | 查配置并调整作用域 | 使用已授权的来源和目标 |
| 工具盘点 | 汇总工作区的工具可见情况 | 与单 Agent 真实准入分开 |
| ToolSearch | 按需发现工具 schema | 宿主兼容且准入有效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 插槽及宿主服务 | 必需 | 加载面板与调用宿主 | 回原生或手工配置 |
| 已注册工作区及适当访问范围 | 项目管理需要 | 读取项目服务和工具 | 保留全局查看 |
| 受信 MCP 或技能来源 | 导入需要 | 装载新的能力 | 不导入未知来源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立独立 profile 和项目 | 无凭据、范围明确 |
| 核对 | 对比列表和当前会话工具 | 只调整一个项目 |
| 退出 | 恢复策略和配置 | 回宿主原有工具加载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 兼容宿主和测试服务 | 检查工作区与配置 | 未测接入成本 |
| 持续 | MCP 连接与搜索回合 | 核对 schema 和作用域 | 实际净费用未知 |
| 恢复 | 可能重新连接服务 | 还原写盘配置和策略 | 未测恢复时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置盘点 | 多作用域与已有会话入口 | 真实宿主和项目可用性 |
| 按需加载 | Agent 视图、搜索与守卫 | 合格任务用量与命中率 |
| 导入管理 | 指纹、准入和确认 | 外部配置与服务安全性 |

> **思考**：[Q02](#research-q02) 工具页并集不能代表当前 Agent 的准入，读取视图失败可退回宿主全量呈现。[Q03](#research-q03) reveal 会把有效配置值送到浏览器。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 工作区工具页结合宿主注册表和已跟踪会话，帮助定位不同范围的已注册工具。[Q02](#research-q02) 按 Agent 延迟提供 schema。

诊断工具清单与 Agent 实际准入分开。来源导入绑定预览指纹，外部技能安装使用暂存和清理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 工具页并集不能代表当前 Agent 的准入，读取视图失败可退回宿主全量呈现。[Q03](#research-q03) reveal 会把有效配置值送到浏览器。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅用隔离 profile 和无凭据的只读 MCP，核对两个会话的范围；发生降级或范围错误时回宿主配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具盘点、按需加载和受控导入。真实宿主授权、兼容与净成本未复验。显示范围的改进为待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/index.js、lib/client.js、lib/tool-search-runtime.js、lib/import-admission.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根插件及代表性 Host、客户端、ToolSearch 和导入源码。未运行模型、宿主、外部 MCP 或技能制品。
- 下一步：比较同工作区不同 Agent 的工具范围，注入视图失败，再测实际用量、命中及回退。对导入使用哨兵字段核对凭据与配置归属。

**分析版本**

- **仓库**：[Imzl-zl/dsh-toolbox-ui](https://github.com/Imzl-zl/dsh-toolbox-ui)
- **版本号**：1.11.1（[固定提交 2adb277](https://github.com/Imzl-zl/dsh-toolbox-ui/tree/2adb27737bfe3f606be73078a1ac5c550102d3b4)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 把工作区并集和当前 Agent 准入分别标注，可能减少范围误判。

比较同工作区不同 Agent 的工具范围，注入视图失败，再测实际用量、命中及回退。对导入使用哨兵字段核对凭据与配置归属。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 89 | 12021 | — | — | 250492 |
| .mjs | source | 18 | 3614 | 2537 | 891 | — |
| .js | source | 45 | 29735 | 20916 | 7979 | — |
| .mjs | test | 68 | 26015 | 19637 | 4580 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Imzl-zl/dsh-toolbox-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Imzl-zl/dsh-toolbox-ui/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Imzl-zl/dsh-toolbox-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要维护多个 DSH 工作区的用户，能否通过工具箱查看和调整 MCP、技能与工具加载，同时保留范围、授权及回退信息？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具页为何要区分工作区视图与当前模型的真实工具范围？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常在两个 DSH 工作区维护 MCP 和技能的开发者，可以用同一界面核对某台服务是否已配置、哪些工具可见、项目是否覆盖全局策略。例如新建一个只读项目服务，希望已有会话也能显示其工具，并能判断配置写到了哪个范围。合格结果应同时解释面板列表、实际生效作用域和模型可调用性。直接编辑 profile 和项目配置也能达成，核对运行时状态要另外查日志与工具定义。

固定包的 Cordis 条目挂载管理服务，Host 初始化时安装 ToolSearch 并将技能服务作为独立子插件挂载。客户端提供浮层和侧栏入口。项目视图验证工作区已注册，再合并根 schemas 和属于该工作区的活跃 Agent schemas，按工具名称去重。Agent 集合含运行时、插件监听集合和宿主注册表，早于插件启动的会话也可能被补回。此列表是工作区诊断用的并集。模型真正搜索时另按调用 Agent 和当次准入视图取工具，面板出现某工具不能代替当前模型调用成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-21](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/README.md#L19-L21)

作者描述浮层与三个管理面。

```text
点右下角悬浮按钮或侧栏「工具箱」打开，面板浮在会话之上——改配置、看技能，都不打断正在进行的对话。三个能力面在同一个面板里切换：**MCP**、**技能**与**工具**。

> 面板本身跟随 DSH 的界面语言：DSH 设成 English 时，面板里的文案、按钮与状态一律是英文（词典在 `lib/client.js` 的 `EN_DICT`）；设成中文或宿主没有语言服务时，显示中文原文。**语言开关在 DSH 里，不在面板里**：设置 → 通用 → 语言。面板刻意不设自己的开关——语言只有宿主一个真相源，两套开关必然对不上。没手动选过语言时，宿主按**浏览器语言**推断（浏览器是英文，面板就是英文；这时去设置里选一次中文即可，之后记住该选择）。
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/cordis.patch.yml#L1-L3)

实际 Cordis bundle 注册。

```text
- insert:
  - id: mcp-manager-ui
    name: dsh-toolbox-ui
```

**依据 3 · 源码核查**：[lib/index.js:1420-1439](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L1420-L1439)

Agent 生命周期跟踪、ToolSearch 和子技能服务挂载。

<details>
<summary>查看原文（20行）</summary>

```text
			this.liveAgents = new Set();
			ctx.on("agent/created", (payload) => {
				const agent = payload?.agent;
				if (agent) this.liveAgents.add(agent);
			});
			ctx.on("agent/disposed", (payload) => {
				const agent = payload?.agent;
				if (agent) this.liveAgents.delete(agent);
			});
			this.globalToolLoading = readToolLoadingPolicy(config);
			const policyFor = (agent, schemas) => this.loadingPolicy(agent, schemas);
			this.toolSearchRuntime = installToolSearchIsolated(ctx, toolSearchSettings, policyFor);
			// 闭包读 this.toolSearchRuntime：重装之后 teardown 拿到的才是最新那份 disposer。
			ctx.effect(() => () => this.toolSearchRuntime.dispose(), "mcp-manager.toolSearch");
			// 技能服务作为**子插件**在同一个 patch 条目内挂载（SPEC 约束 15）：
			// cordis.patch.yml 只有一条 `- id: mcp-manager-ui / name: <包名>`，而package-contract
			// 断言该 id 与 name 各出现恰好 1 次，所以不得为 skills 新增 patch 条目。
			// 子插件自带 inject=["skills"]，未挂载 dsh-skill 时它只保持不激活，不影响本服务。
			ctx.plugin(SkillsManagerGateway, {});
			__runInitializers(this, _instanceExtraInitializers);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:7451-7472](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/client.js#L7451-L7472)

浮层和侧栏的客户端注册。

<details>
<summary>查看原文（22行）</summary>

```text
        ctx.slots.register({ name: 'shell.overlay', id: 'mcp-handover', order: 1000, label: () => t('工具箱') }, () => h(HandoverNotice, { conflict })),
      );
      return cleanup;
    }
    const pluginManager = (typeof ctx.get === 'function' ? ctx.get('remote.' + UPGRADE_NAMESPACE) : null)
      || (ctx.remote && ctx.remote[UPGRADE_NAMESPACE])
      || null;
    ctx.slots.inject('shell.overlay', () =>
      ctx.slots.register({ name: 'shell.overlay', id: 'mcp-fab', order: 1000, label: () => t('工具箱'), inject: () => ({ call, callSkills, timer, pluginManager }) }, McpOverlay),
    );
    // 官方标准侧栏入口（sidebar.footer.action，0.1.5 起声明）：与悬浮按钮共享同一个
      // 面板和开关状态。用 inject 而不是直接 register：它声明感知，会等侧边栏把 slot 声明出来
      // （插件加载顺序不保证晚于侧边栏）。
    // ⚠️ label 就是侧栏里**看得见的那几个字**（slot 的 label 由外壳渲染）。这里从 'MCP' 改成
    // t('工具箱')：面板早就不是只有 MCP 了（还有技能面与技能市场），而 name/包名是 dsh-toolbox-ui
    // ——入口上写着 MCP、点开却是 MCP + 技能，用户第一眼就会问"名字怎么还是 MCP"。
    // ⚠️ label 必须写成 **thunk**（() => t('工具箱')）而不是求值好的字符串：宿主的 SlotLabel
    // 契约是「string | (() => string)」，侧栏每读一次条目就 resolveSlotLabel 一次（且订阅
    // locale 变化重解），thunk 才会跟着当前语言走；直接写 t('工具箱') 会把语言冻在插件加载
    // 那一刻，切语言后侧栏入口停在旧语言直到宿主重启。
    ctx.slots.inject('sidebar.footer.action', () =>
      ctx.slots.register({ name: 'sidebar.footer.action', id: 'mcp-manager', order: 100, label: () => t('工具箱') }, McpFooterAction),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1274-1285](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L1274-L1285)

读取宿主注册表补齐已有 Agent。

<details>
<summary>查看原文（12行）</summary>

```text
// 第三个来源必须是**宿主 agent 注册表**，而不只是本插件监听 agent/created 得到的集合：
// 插件升级、HMR 或桌面端先开会话时，会话可能早于插件加载；只靠事件会漏掉它，面板就只剩
// 根作用域那几个工具（真机表现：文件 1 / MCP 资源 3 / 代码与工作区 1，共 5 个）。
function hostLiveAgents(ctx, localAgents) {
	const agents = new Set([...liveAgents(), ...(localAgents ?? [])]);
	try {
		for (const agent of ctx?.agents?.list?.() ?? []) {
			if (agent) agents.add(agent);
		}
	} catch { /* 注册表不可用时保留已跟踪的会话，不影响其余来源 */ }
	return [...agents];
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1909-1935](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L1909-L1935)

按注册工作区过滤 Agent，并合并工具库存。

<details>
<summary>查看原文（27行）</summary>

```text
		async workspaceToolLoading(payload) {
			const wsPath = canonicalWorkspacePath(String(payload?.wsPath ?? ""));
			assertRegisteredWorkspace(this.ctx, wsPath);
			const config = await readWorkspaceConfigCached(this.ctx, wsPath);
			if (config.error) throw new Error(config.error);
			const projectPolicy = normalizePolicyConfig(config.toolLoading);
			const globalSchemas = typeof this.ctx.tools?.schemas === "function" ? this.ctx.tools.schemas() : [];
			const projectSchemas = [];
			for (const agent of hostLiveAgents(this.ctx, this.liveAgents)) {
				if (agentWorkspace(agent) !== wsPath) continue;
				try {
					for (const schema of agent?.ctx?.tools?.schemas?.(agent) ?? []) projectSchemas.push(schema);
				} catch { /* 某个会话读取失败时仍返回其它可见工具 */ }
			}
			const available = [];
			const seen = new Set();
			for (const schema of [...globalSchemas, ...projectSchemas]) {
				if (!schema || typeof schema.name !== "string" || schema.name === "" || seen.has(schema.name)) continue;
				seen.add(schema.name);
				available.push(schema);
			}
			const ownerSet = new Set(serverNamesOf(this.ctx, { session: { header: { cwd: wsPath } } }));
			const scopeAgent = { session: { header: { cwd: wsPath } } };
            const resolution = this.loadingPolicy(scopeAgent, available, {
                serverNames: ownerSet,
                projectPolicy,
            });
```

</details>

**依据 7 · 源码核查**：[lib/tool-search-runtime.js:845-865](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L845-L865)

执行侧按当前 Agent 和准入工具集构建。

<details>
<summary>查看原文（21行）</summary>

```text
  const viewFor = (agent, assemblyTools, toolSet) => {
    try {
      const agentTools = typeof agent?.ctx?.get === 'function' ? agent.ctx.get('tools') : agent?.ctx?.tools
      if (agentTools === undefined) throw new Error('agent tools service is unavailable')
      const registeredSchemas = caps.definitions && toolSet !== undefined
        ? agentTools.definitions(agent, toolSet).map((definition) => ({
          name: definition.name,
          description: definition.description,
          parameters: definition.parameters,
          output: definition.output?.schema,
        }))
        : agentTools.schemas(agent)
      // definitions(scope, toolSet) is the preferred projection, but the admission object is
      // the authoritative boundary. Intersect explicitly so a host implementation that returns
      // registered definitions from this method cannot make conditional tools searchable.
      const admitted = typeof toolSet?.view === 'function' ? toolSet.view(agent) : undefined
      const schemas = admitted === undefined
        ? registeredSchemas
        : registeredSchemas.filter((schema) => admitted.has(schema.name))
      // agent 一路带下去：项目族的加载策略、保护名单与老 defer 都按**这个会话所在项目**解析。
      const revision = viewRevision(schemas, resolved, agent)
```

</details>

#### 缺口

- 没有插件热加载后双会话的真实宿主记录
  **影响**：无法证明前台工具始终准确显示
  **进一步探讨**：先开项目会话再加载插件，核对列表和每个 Agent 的实际工具

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · ToolSearch 何时减少 schema，是否可以作为权限边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

ToolSearch 在宿主提供工具定义和工具集时，取当前 Agent 定义并与 toolSet.view 求交，避免条件未准入的工具进入搜索。缺少该视图时回到宿主 schemas。项目、服务和工具级策略决定哪些 schema 常驻、哪些先延迟。模型可通过关键词或精确名称搜索，搜索成功后按 Agent 记录已发现工具，并返回当次快照。调用守卫依据受管及已发现集合检查是否先搜索，搜索与原生工具调用分别接线。视图读取异常会退回宿主原有的全量呈现，工具集为空时插件守卫也不额外阻止。这是可见性和加载机制，底层授权仍由宿主承担。

作者在同一套 MCP 对照截图中报告 schema 显著减少。对只需要少数工具的任务，初次上下文可更小，搜索会增加一个步骤；命名不匹配、工具频繁淘汰或多次发现会增加额外轮次。真实净费用需包含成功率、重试、每轮 token 与计费，不能用作者截图直接推到所有任务。不同宿主代际通过呈现钩子或兼容装饰接入，仍需核对具体宿主的工具视图和卸载。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tool-search-runtime.js:845-878](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L845-L878)

当前 Agent、准入交集与异常时全量降级。

<details>
<summary>查看原文（34行）</summary>

```text
  const viewFor = (agent, assemblyTools, toolSet) => {
    try {
      const agentTools = typeof agent?.ctx?.get === 'function' ? agent.ctx.get('tools') : agent?.ctx?.tools
      if (agentTools === undefined) throw new Error('agent tools service is unavailable')
      const registeredSchemas = caps.definitions && toolSet !== undefined
        ? agentTools.definitions(agent, toolSet).map((definition) => ({
          name: definition.name,
          description: definition.description,
          parameters: definition.parameters,
          output: definition.output?.schema,
        }))
        : agentTools.schemas(agent)
      // definitions(scope, toolSet) is the preferred projection, but the admission object is
      // the authoritative boundary. Intersect explicitly so a host implementation that returns
      // registered definitions from this method cannot make conditional tools searchable.
      const admitted = typeof toolSet?.view === 'function' ? toolSet.view(agent) : undefined
      const schemas = admitted === undefined
        ? registeredSchemas
        : registeredSchemas.filter((schema) => admitted.has(schema.name))
      // agent 一路带下去：项目族的加载策略、保护名单与老 defer 都按**这个会话所在项目**解析。
      const revision = viewRevision(schemas, resolved, agent)
      const cached = viewCache.get(agent)
      let view = cached !== undefined && cached.revision === revision ? cached.view : undefined
      if (view === undefined) {
        view = { ...buildToolSearchView(schemas, resolved, agent), revision }
        viewCache.set(agent, { revision, view })
      }
      // 模式不进视图缓存：它对同一个 agent 是恒定的，缓存它只会多一个要失效的字段。
      const mode = modeOf(agent, assemblyTools, view.managed)
      return { mode, view: mode === 'both' ? inertView() : view }
    } catch (error) {
      ctx.logger?.error?.(`mcp-manager: ToolSearch 视图不可用，本轮退回全量可见：${error?.message ?? error}`)
      return { mode: 'native', view: inertView({ degraded: true }) }
    }
```

</details>

**依据 2 · 源码核查**：[lib/tool-search-runtime.js:1078-1107](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L1078-L1107)

在 Agent 范围查找、发现与同步快照。

<details>
<summary>查看原文（30行）</summary>

```text
    async execute(args, exec) {
      if (exec.agent === undefined) throw new Error(`${resolved.toolName} requires an agent-scoped execution`)
      const { mode, view } = viewFor(exec.agent, undefined, exec.toolSet)
      // 没东西可搜 → **明确报错**（B13）。判据是 `managed = ∅`（一个延迟服务器都没有），
      // 不是 `D = ∅`（都发现了——再搜一次是合法的）。修复前这里是"空结果 + 指向一个不存在的
      // 目录段"（F10），那是最坏的一种反馈：模型看不出自己错在哪。
      if (view.managed.size === 0) {
        throw new Error(view.degraded
          ? `${resolved.toolName}: deferred tool loading is unavailable in this session (the host tool view could not be read); every tool is visible — call it directly`
          : `${resolved.toolName}: no MCP server is set to deferred loading in this session; every tool is already available — call it directly`)
      }
      const query = typeof args.query === 'string' ? args.query.trim() : ''
      if (query === '') throw new Error('query must not be empty')
      const limit = Math.min(Math.max(Number(args.max_results) || resolved.maxResults, 1), resolved.maxResults)
      // 搜索按 `hasDeferredServers`（B14）：受管集为空 = 没有任何服务器被延迟，索引里
      // 本来就没有东西可搜。判据刻意不是 `D`——B13：全部发现之后再搜一次是合法的。
      const matches = searchCatalog(view.catalog, query, limit, resolved.stem)
      const returned = matches.filter((match) => match.found).map((match) => match.name)
      // 先 `discover`（B8：发现即播种 lastUsed）再淘汰——顺序反了会把刚发现的一批当最旧踢掉。
      // 所有提交都是**同步**的：异步签名准备发生在提交之后，绝不会用旧快照覆盖新状态。
      const discoveredNow = discovery.discover(exec.agent, returned)
      // 再把**本批返回的全部名字**（含早就发现的）记成"已承诺、未使用"。少这一步就是
      // 混合批次的自我矛盾：结果里写着"直接调"，而其中较旧的项刚被本次淘汰。
      discovery.claim(exec.agent, returned)
      // **只在本次真的新增了名字时淘汰**（B10）：一次"什么都没搜到"的搜索不该踢掉一半。
      if (discoveredNow.length > 0) discovery.evict(exec.agent, discoveredNow.length)
      // 结果里的快照必须与本次提交一致：同步取，不能在 await 之后再读（那时可能已被
      // 另一次搜索推进，模型会拿到一份"和它看到的 matches 不一致"的累计表）。
      const orderedNames = discovery.snapshot(exec.agent)
      const discoveredCount = discovery.size(exec.agent)
```

</details>

**依据 3 · 源码核查**：[lib/tool-search-runtime.js:1147-1160](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L1147-L1160)

已发现集合接入宿主 guard。

<details>
<summary>查看原文（14行）</summary>

```text
  const disposeGuard = acquire(() => ctx.tools.guard((execution) => {
    if (execution.agent === undefined) return undefined
    // guard 没有 assembly 可看：`modeFor` 缺席时 `modeOf` 会退回 'native'（缺项已记过日志）。
    const { view } = viewFor(execution.agent, undefined, execution.toolSet)
    // 守卫按 `hasDeferredServers`（B14）：D = ∅ 时"都发现了"，守卫自然放行（每个工具
    // 都在 discovered 里），不需要额外的开关判断。
    if (view.managed.size === 0) return undefined
    const state = stateFor(execution.agent)
    // LRU 的**唯一写入口**（B7）：guard 是"每次调用都经过"的现成钩子——含 PTC 的嵌套派发
    // （已实测走完整管线），所以不需要再加任何订阅。只记录**已发现**的名字：未发现的调用
    // 会被下面拒掉，把被拒的也算"用过"会让一次性试探永久占住热点位。
    discovery.touch(execution.agent, execution.name)
    return guardDecision(execution.name, { managed: view.managed, discovered: state.discovered }, resolved)
  }))
```

</details>

**依据 4 · 源码核查**：[lib/tool-search-runtime.js:1204-1227](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L1204-L1227)

呈现端口与兼容装饰。

<details>
<summary>查看原文（24行）</summary>

```text
  /** 呈现端口的唯一入口：两代宿主都走这里（接入点差异在 adapter 里）。 */
  const present = async (assembly, context) => {
    const agent = context?.agent
    if (agent === undefined) return assembly
    const snapshot = snapshotFor(agent, context?.toolSet, assembly?.tools, context?.scope)
    return presentAssembly(assembly, snapshot, presentationHandlers, {
      guidanceSection: GUIDANCE_SECTION_NAME,
      catalogSection: CATALOG_SECTION_NAME,
      onDiagnostic: noteDiagnostic,
    })
  }

  // 代次差异只在这一行：rc.5 走 waterfall，rc.1 走 assemble 装饰（并支持 HMR 重绑）。
  // 不在 acquire 里包：端口自己负责"失败不留下装饰"，这里只要拿到 disposer 就登记。
  const presentationPort = installPresentationPort(ctx, ctx.tools, present, {
    onDiagnostic: noteDiagnostic,
    generation: presentationGeneration,
  })
  track(presentationPort.dispose)
  if (presentationGeneration === 'modern') {
    warnOnce(ctx, 'modernPresentationBridge',
      'host 0.2.2+: presenting through a documented compatibility bridge (systemPrompt.assemble decorator) — '
      + 'not an upstream hook; it is restored on unload and never overwrites a later third-party replacement')
  }
```

</details>

**依据 5 · 作者声明**：[README.md:43-52](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/README.md#L43-L52)

作者截图是同一套 MCP 的一次对照。

<details>
<summary>查看原文（10行）</summary>

```text
## ToolSearch 效果

同一套 MCP，只切换 ToolSearch：

<p align="center">
  <img src="docs/images/toolsearch-off.png" alt="未启用 ToolSearch：工具定义 89.9K，上下文已用 115K" width="440">
  <img src="docs/images/toolsearch-on.png" alt="启用 ToolSearch：工具定义 9.4K，上下文已用 21.3K" width="440">
</p>

工具定义从 **89.9K** 降到 **9.4K**：少 **80.5K（-89.5%）**，约 **9.6×**；整段上下文占用从 **115K** 降到 **21.3K**，少 **93.7K（-81.5%）**。工具多的时候，省下来的是每一轮都要付的钱。
```

</details>

**依据 6 · 作者声明**：[README.md:60-69](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/README.md#L60-L69)

作者说明默认及各级加载策略。

<details>
<summary>查看原文（10行）</summary>

```text
- **全局 + 项目双作用域**：全局写 Web profile（所有项目可用），项目写该项目 `.dsh/mcp.json`（只该项目会话可见）；项目里还能「屏蔽」某个全局 MCP
- 从本机其他客户端**导入**：Claude Code、Codex、OpenCode、pi、Claude Desktop、Cursor、Windsurf、VS Code、Gemini CLI、Roo Code 与跨工具共享配置，也能直接粘贴 JSON；写入前预览，支持「合并」与「替换」
- **跨工作区搬运**：把本项目的 MCP 复制到另一个已注册工作区（在宿主内完成，凭据不经过浏览器），或导出成 JSON 备份 / 分享
- **工具延迟加载（ToolSearch）**：让某个服务器的工具不再每轮常驻上下文——模型先看到一份**只列工具名**的目录，用内置的 `tool_search` 搜到（关键词或 `select:<确切名字>`）之后，完整参数 schema 才进它的工具列表并可直接调用。默认不开：行上的「延迟 / 全量」芯片改的是**整台默认**（写组级策略），模型实际看到多少还要看工具页里的逐工具覆盖；环境变量 `DSH_MCP_TOOL_SEARCH=off` 整体退回全量注入。选成「按需」的工具，模型要先经 `tool_search` 拿到 schema 才能用；没有可搜的工具时搜索入口本身不出现。机制的三个上限在工具页**顶部**的「搜索设置」里调，写进 profile patch 的 `config.toolSearch`

**工具面**

- **内置工具在前，按用途分组**：文件 / 命令与终端 / 网络 / MCP 资源 / 任务与后台 / 子代理与团队 / 技能与交互 / 定时 / 代码与工作区 / 宿主与插件；MCP 工具按服务器分组排在后面，未知名字单列「其他插件与未识别」。所有组默认收起，顶部可按**类型**（全部 / 内置 / MCP / 其他）与**加载方式**（全部 / 常驻 / 按需 / 有覆盖）筛选
- **每行三态，跟随谁写清楚**：MCP 行是「跟随服务器 / 常驻 / 按需」，内置行是「宿主默认 / 常驻 / 按需」，项目覆盖是「跟随全局（当前值）」。选「跟随 / 默认」就删掉覆盖键，任何时候都能退回上一级；整台默认只在 MCP 列表的芯片（`groups`）上改，本页只写逐工具（`tools`）
- **搜索设置固定在顶部**：`maxResults`、`maxDiscovered` 与默认关着的「限制目录大小」（`maxCatalogChars`）都在页面顶部常驻可见，保存写进 profile patch 的 `config.toolSearch`，当前会话立即生效。`mode` 只由配置文件决定；被它压住时页面给横幅，不提供第二个开关
```

</details>

#### 缺口

- 没有同版本宿主任务与 token 账单
  **影响**：无法量化召回、额外轮次或净节省
  **进一步探讨**：固定工具和任务，交叉对照常驻与按需，核对受控工具未跨 Agent 暴露

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置导入、凭据显露和技能安装如何限制写入？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

MCP 可将现有来源移到全局或项目。来源导入预览生成内容指纹，提交重新读取并核对，避免预览后文件改变。直接粘贴入口单独解析并走相同的基础准入规则，对不支持的表达式拒绝，对同作用域重名保留第一项并提示。配置可能包含执行命令和连接信息，格式准入和指纹绑定只能保证这一部分，不能证明来源服务安全。全局和项目设置应分别核对，因为写错范围的服务可影响其他会话。

普通视图的掩码并不阻止专用 reveal RPC 返回有效运行值。全局读取要求 MCP 属于当前 Web profile，项目读取由具体工作区配置解析。显露后凭据可能到达浏览器，复制与导出还需用户管理。外部技能安装要求 RPC 提供 acknowledged=true，目标必须可写，先下载到临时目录，再走既有 archive 导入并清理临时文件。这个确认参数是功能门槛，仍须结合宿主调用授权与实际制品证据判断。初次成本包括兼容宿主、项目授权与配置备份，持续成本有连接运行、策略核对和可能的搜索轮次。退出时需要恢复已写入的项目或全局配置，卸载界面不能代替撤销操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2102-2118](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L2102-L2118)

全局 reveal 校验受管配置并返回有效运行值。

<details>
<summary>查看原文（17行）</summary>

```text
		async reveal(payload) {
			const name = String(payload?.name || "");
			const field = String(payload?.field || "");
			const key = payload?.key === undefined ? undefined : String(payload.key);
			const state = await managedState(this.ctx);
			const current = state.byName.get(name);
			const entry = current ? managedLiveEntry(this.ctx, state, name) : null;
			if (!current || !entry) throw new Error("此 MCP 不属于当前 Web profile，不能读取配置");
			if (!["url", "args", "env", "headers"].includes(field)) throw new Error("不支持读取该配置字段");
			// 编辑表单仅把有效运行值用于显示；未实际修改输入时仍提交保留原值标记，
			// 不会把密钥写回 profile。options.config 里是 raw 的 `!!js` 表达式，必须求值一次。
			const value = resolveLiveConfigValue(entry, entry.options.config[field] ?? current[field]);
			if (key !== undefined) {
				if (!value || typeof value !== "object" || !Object.hasOwn(value, key)) throw new Error("没有该配置项");
				return { value: value[key] };
			}
			return { value: structuredClone(value) };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2120-2128](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L2120-L2128)

直接粘贴预览及准入后写入。

```text
		async previewImport(payload) {
			const json = typeof payload?.json === "string" ? JSON.parse(payload.json) : payload?.json;
			const state = await managedState(this.ctx);
			return importPreview(this.ctx, admittedImport(json), state);
		}
		async importJson(payload) {
			const mode = payload?.mode === "replace" ? "replace" : "merge";
			const json = typeof payload?.json === "string" ? JSON.parse(payload.json) : payload?.json;
			return applyManagedImport(this.ctx, admittedImport(json), mode);
```

**依据 3 · 源码核查**：[lib/index.js:2135-2165](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L2135-L2165)

来源预览和提交的指纹比较。

<details>
<summary>查看原文（31行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/import-admission.js:30-43](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/import-admission.js#L30-L43)

对表达式递归规范及不支持项拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/import-admission.js:56-68](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/import-admission.js#L56-L68)

去重和警告策略。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2420-2437](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L2420-L2437)

项目 reveal 会解析环境引用并向浏览器回传。

<details>
<summary>查看原文（18行）</summary>

```text
		async revealWorkspaceServer(payload) {
			const wsPath = canonicalWorkspacePath(String(payload?.wsPath || ""));
			const name = String(payload?.name || "");
			const field = String(payload?.field || "");
			const key = payload?.key === undefined ? undefined : String(payload.key);
			const config = await readWorkspaceConfigCached(this.ctx, wsPath);
			if (config.error) throw new Error(config.error);
			const current = config.servers.find((server) => server.name === name);
			if (!current) throw new Error("该项目中没有此 MCP：" + name);
			if (!["url", "args", "env", "headers"].includes(field)) throw new Error("不支持读取该配置字段");
			// 列表与详情的默认显示走 workspaceServerView 的模板形式（`${VAR}`，与文件一致、
			// 不泄露）；这里是被眼睛点开的通路，要的是「有效运行值」，所以按建连同一个求值器解析。
			const value = resolveSpecValue(current[field], process.env);
			if (key !== undefined) {
				if (!value || typeof value !== "object" || !Object.hasOwn(value, key)) throw new Error("没有该配置项");
				return { value: value[key] };
			}
			return { value: structuredClone(value) };
```

</details>

**依据 7 · 源码核查**：[lib/index.js:2705-2737](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L2705-L2737)

外部技能安装确认、目标解析及暂存清理。

<details>
<summary>查看原文（33行）</summary>

```text
		async skillHubInstall(payload) {
			// 下载 zip 到临时目录，再交给**现有的** importSkill（type: 'archive'）落盘。
			// 这样外部源与「从本机导入」共用同一条写入路径：解压、挑技能根、防重名、
			// 按实际字节判大小上限都在那一处，落点也就能沿用面板的「安装到」
			// （全局/项目 × .dsh/.agents），而不是由上游替用户决定装到哪。
			//
			// ⚠️ 显式确认必须在 **wire 上**（SPEC 约束 17：勾选后才可安装）。UI 里那个勾选框
			// 只是它的界面；把判据留在客户端等于没有闸门——任何别的调用方都能绕过。
			if (payload?.acknowledged !== true) {
				throw new Error("安装外部源技能需要一次显式确认（acknowledged）");
			}
			const target = await resolveTargetReference(this.ctx, {
				source: payload?.source,
				root: payload?.root,
				projectPath: payload?.projectPath,
			});
			if (target.writable === false) throw new Error("该位置是只读的（bundled），不能写入");
			const slug = String(payload?.slug ?? "");
			if (slug === "") throw new Error("缺少 slug");
			const staging = await mkdtemp(join(tmpdir(), "dsh-skillhub-"));
			try {
				const archive = await downloadHubArchive(slug, { version: payload?.version, dir: staging });
				const result = await importSkill({
					root: target.root,
					scope: target.scope,
					writable: true,
					source: { type: "archive", path: archive.path },
				});
				return mutationResult("applied", refreshSkillCatalog(this.ctx), result);
			} finally {
				// 临时目录无论成败都要清掉（成功时技能已经复制进目标根）。
				await rm(staging, { recursive: true, force: true });
			}
```

</details>

**依据 8 · 作者声明**：[README.md:85-101](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/README.md#L85-L101)

作者安装、卸载与已有 MCP 留存边界。

<details>
<summary>查看原文（17行）</summary>

````text
## 安装

```sh
# 推荐：npm 安装 —— 之后 `dsh plugin update` 在 ^1.x 内自动升小版本
dsh plugin --profile web add dsh-toolbox-ui@^1.11.1

# 或固定 GitHub release tag（不自动跨版本，升级要换 tag 重新 add）
dsh plugin --profile web add github:Imzl-zl/dsh-toolbox-ui#v1.11.1
```

装完**重启 `dsh web`**。卸载（不会删除 profile 里已有的 MCP 条目）：

```sh
dsh plugin --profile web remove dsh-toolbox-ui
```

> 不要把 `mcp-manager-ui` 手工插进 profile 的 `cordis.patch.yml`、Agent preset 或额外的 `--patch` 文件——插件命令已经完成这件事，重复装配会明确报错。
````

</details>

#### 缺口

- 没有跨来源导入、远程 RPC 或凭据显露的同版本实测
  **影响**：不能判定客户端权限及每类配置的写入是否符合部署要求
  **进一步探讨**：在独立 profile 用哨兵环境变量和无副作用 MCP 验证预览、读取与恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并验证工具并集是否会被误解？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合已经使用 DSH Web、需要跨项目核对工具的人。用隔离 profile、两个项目和一个无凭据的只读 MCP，先打开会话再加载插件。核对各项目列表、当前 Agent 的可调用工具和回退路径，仅改一个项目的加载策略。若发现项目范围错误、当前 Agent 取不到展示的工具，或兼容端口降级，就关闭按需策略并回到宿主配置检查，不导入未知服务或提交真实密钥。

设计假设是给工具页同时显示配置作用域、工作区并集和当前 Agent 准入三类证据，遇到多个会话取不同工具时提供来源。当前 Agent 汇总与真实模型视图已经在不同函数中，界面可尝试用这些信息解释差异。固定两个同工作区 Agent 和另一个项目 Agent，比较有无范围证据时错误判断数、成功调用和排查时间。若标签无法减少误判、泄露其他工作区工具名，或增加相当的核对成本，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1911-1935](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/index.js#L1911-L1935)

工作区并集可作为现状对照。

<details>
<summary>查看原文（25行）</summary>

```text
			assertRegisteredWorkspace(this.ctx, wsPath);
			const config = await readWorkspaceConfigCached(this.ctx, wsPath);
			if (config.error) throw new Error(config.error);
			const projectPolicy = normalizePolicyConfig(config.toolLoading);
			const globalSchemas = typeof this.ctx.tools?.schemas === "function" ? this.ctx.tools.schemas() : [];
			const projectSchemas = [];
			for (const agent of hostLiveAgents(this.ctx, this.liveAgents)) {
				if (agentWorkspace(agent) !== wsPath) continue;
				try {
					for (const schema of agent?.ctx?.tools?.schemas?.(agent) ?? []) projectSchemas.push(schema);
				} catch { /* 某个会话读取失败时仍返回其它可见工具 */ }
			}
			const available = [];
			const seen = new Set();
			for (const schema of [...globalSchemas, ...projectSchemas]) {
				if (!schema || typeof schema.name !== "string" || schema.name === "" || seen.has(schema.name)) continue;
				seen.add(schema.name);
				available.push(schema);
			}
			const ownerSet = new Set(serverNamesOf(this.ctx, { session: { header: { cwd: wsPath } } }));
			const scopeAgent = { session: { header: { cwd: wsPath } } };
            const resolution = this.loadingPolicy(scopeAgent, available, {
                serverNames: ownerSet,
                projectPolicy,
            });
```

</details>

**依据 2 · 源码核查**：[lib/tool-search-runtime.js:845-878](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/lib/tool-search-runtime.js#L845-L878)

当前 Agent 准入视图与降级作为判据。

<details>
<summary>查看原文（34行）</summary>

```text
  const viewFor = (agent, assemblyTools, toolSet) => {
    try {
      const agentTools = typeof agent?.ctx?.get === 'function' ? agent.ctx.get('tools') : agent?.ctx?.tools
      if (agentTools === undefined) throw new Error('agent tools service is unavailable')
      const registeredSchemas = caps.definitions && toolSet !== undefined
        ? agentTools.definitions(agent, toolSet).map((definition) => ({
          name: definition.name,
          description: definition.description,
          parameters: definition.parameters,
          output: definition.output?.schema,
        }))
        : agentTools.schemas(agent)
      // definitions(scope, toolSet) is the preferred projection, but the admission object is
      // the authoritative boundary. Intersect explicitly so a host implementation that returns
      // registered definitions from this method cannot make conditional tools searchable.
      const admitted = typeof toolSet?.view === 'function' ? toolSet.view(agent) : undefined
      const schemas = admitted === undefined
        ? registeredSchemas
        : registeredSchemas.filter((schema) => admitted.has(schema.name))
      // agent 一路带下去：项目族的加载策略、保护名单与老 defer 都按**这个会话所在项目**解析。
      const revision = viewRevision(schemas, resolved, agent)
      const cached = viewCache.get(agent)
      let view = cached !== undefined && cached.revision === revision ? cached.view : undefined
      if (view === undefined) {
        view = { ...buildToolSearchView(schemas, resolved, agent), revision }
        viewCache.set(agent, { revision, view })
      }
      // 模式不进视图缓存：它对同一个 agent 是恒定的，缓存它只会多一个要失效的字段。
      const mode = modeOf(agent, assemblyTools, view.managed)
      return { mode, view: mode === 'both' ? inertView() : view }
    } catch (error) {
      ctx.logger?.error?.(`mcp-manager: ToolSearch 视图不可用，本轮退回全量可见：${error?.message ?? error}`)
      return { mode: 'native', view: inertView({ degraded: true }) }
    }
```

</details>

**依据 3 · 作者声明**：[README.md:63-69](https://github.com/Imzl-zl/dsh-toolbox-ui/blob/2adb27737bfe3f606be73078a1ac5c550102d3b4/README.md#L63-L69)

作者说明如何退回常驻策略及控制作用域。

```text
- **工具延迟加载（ToolSearch）**：让某个服务器的工具不再每轮常驻上下文——模型先看到一份**只列工具名**的目录，用内置的 `tool_search` 搜到（关键词或 `select:<确切名字>`）之后，完整参数 schema 才进它的工具列表并可直接调用。默认不开：行上的「延迟 / 全量」芯片改的是**整台默认**（写组级策略），模型实际看到多少还要看工具页里的逐工具覆盖；环境变量 `DSH_MCP_TOOL_SEARCH=off` 整体退回全量注入。选成「按需」的工具，模型要先经 `tool_search` 拿到 schema 才能用；没有可搜的工具时搜索入口本身不出现。机制的三个上限在工具页**顶部**的「搜索设置」里调，写进 profile patch 的 `config.toolSearch`

**工具面**

- **内置工具在前，按用途分组**：文件 / 命令与终端 / 网络 / MCP 资源 / 任务与后台 / 子代理与团队 / 技能与交互 / 定时 / 代码与工作区 / 宿主与插件；MCP 工具按服务器分组排在后面，未知名字单列「其他插件与未识别」。所有组默认收起，顶部可按**类型**（全部 / 内置 / MCP / 其他）与**加载方式**（全部 / 常驻 / 按需 / 有覆盖）筛选
- **每行三态，跟随谁写清楚**：MCP 行是「跟随服务器 / 常驻 / 按需」，内置行是「宿主默认 / 常驻 / 按需」，项目覆盖是「跟随全局（当前值）」。选「跟随 / 默认」就删掉覆盖键，任何时候都能退回上一级；整台默认只在 MCP 列表的芯片（`groups`）上改，本页只写逐工具（`tools`）
- **搜索设置固定在顶部**：`maxResults`、`maxDiscovered` 与默认关着的「限制目录大小」（`maxCatalogChars`）都在页面顶部常驻可见，保存写进 profile patch 的 `config.toolSearch`，当前会话立即生效。`mode` 只由配置文件决定；被它压住时页面给横幅，不提供第二个开关
```

#### 缺口

- 没有真实用户排查和授权对照
  **影响**：不能量化帮助及误判减少
  **进一步探讨**：做三个会话的工具可见性对照并记录实际调用

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
