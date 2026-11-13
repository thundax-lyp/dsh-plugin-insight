# dsh-mcp

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9917c97](https://github.com/ArvinQi/dsh-mcp/tree/9917c9796aa8ecae45c3808fa5436bb45ece445c)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArvinQi/dsh-mcp) [![npm 30d 3,556](https://img.shields.io/static/v1?label=npm+30d&message=3%2C556&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp)
<!-- END META -->

> **功能**：在 DSH 设置中配置和启停 MCP 服务，并按需让模型发现和调用工具。

> **亮点**：[Q01](#research-q01) 将定义、凭据和挂载状态组织进同一设置页。[Q02](#research-q02) 用注册期条件在 DSH 每步工具集合中联动搜索、开关和现有调用方条件。

> **主要限制**：[Q02](#research-q02) 的热度是服务实例级，先注册的工具可能直到重挂载才受准入约束。[Q03](#research-q03) 的 stdio 仍运行外部命令，工具可见性与服务授权应分别核对。

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
  - [Q01 · Web 设置如何减少配置动作，保存成功代表服务已可用吗？](#detail-section-11)
  - [Q02 · 按需检索怎样改变模型可见工具，何时不起作用？](#detail-section-12)
  - [Q03 · 托管 MCP 会启动什么进程、保存哪些凭据，出错如何恢复？](#detail-section-13)
  - [Q04 · 在何种小范围任务应试用，怎样判断按需真的省成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在多个 MCP 服务之间切换的 DSH 用户，可以在设置中管理服务器、核对状态和控制模型可见工具。

原生 Cordis 已能声明 MCP。少量固定服务可直接改 profile，插件提供图形管理及每步按需工具的增量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 管理 | 编辑、启停与核对服务器 | 保存不证明服务器已连通 |
| 工具搜索 | 让命中工具加入热集合 | 词法匹配，热集合共享 |
| 注册准入 | 按步限制模型可见工具 | 依赖 Host 接缝，仍需核对服务权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明匹配的 DSH 与 Web profile | 是 | 挂载工具和设置管理 | 退回有限原生声明 |
| 可信 MCP 与宿主凭据服务 | 依传输而定 | 本地进程、HTTP 和授权 | 先用只读假服务 |
| 注册期条件或旧组装接缝 | 按需需要 | 限制每步工具曝光 | 检查 enforcement |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 固定基准 | 用户 | 备份并记录原生声明 | 隔离 profile |
| 检查曝光 | 用户与模型 | 搜索后查看下一步列表和工具开关 | 异常则停用按需 |
| 回读与退出 | 用户 | 检查实际服务、进程及凭据 | 恢复原声明与独立配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 两个可丢弃测试服务 | 备份、固定宿主和配置 | 耗时未知 |
| 持续 | 工具 schema、搜索轮次和外部服务 | 核对权限和协议 | 实际节省未知 |
| 失败恢复与退出 | 配置副本和测试环境 | 恢复原生声明并核凭据 | 未验收真实恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可视管理 | Remote、定义、挂载状态 | 真实授权与可用性 |
| 按需曝光 | when、热集合、旧组装回退 | 总输入与成功率 |
| 稳定注册 | 保留未改结构的工具 | 真实缓存命中 |

> **思考**：[Q02](#research-q02) 的热度是服务实例级，先注册的工具可能直到重挂载才受准入约束。[Q03](#research-q03) 的 stdio 仍运行外部命令，工具可见性与服务授权应分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将定义、凭据和挂载状态组织进同一设置页。[Q02](#research-q02) 用注册期条件在 DSH 每步工具集合中联动搜索、开关和现有调用方条件。

[Q02](#research-q02) 的条件组合与方法身份释放可复用，需关注先注册工具、共享热集合和另一插件继续包裹方法后的生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的热度是服务实例级，先注册的工具可能直到重挂载才受准入约束。[Q03](#research-q03) 的 stdio 仍运行外部命令，工具可见性与服务授权应分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离 profile 对照按需与全量，按 [Q03](#research-q03) 的建议使用只读或空实现服务。发现禁用不生效或需过多搜索时恢复原生声明。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 MCP 管理与注册期工具曝光。真实宿主、第三方传输和缓存节省仍待验，按会话热集合是待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/index.js、lib/mcp-client.js、lib/oauth.js、lib/patch-writer.js、lib/tool-admission.js、lib/transport.js、package.json、scripts/build.mjs、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根包、设置、Host 存储与挂载、工具准入和代表性传输。未核查全部 OAuth 错误、MCP 工具输出或宿主运行。
- 下一步：在两会话复用相同只读服务，观察每步列表、失败回退、上下文和任务结果，并分别核对配置及凭据状态。

**分析版本**

- **仓库**：[ArvinQi/dsh-mcp](https://github.com/ArvinQi/dsh-mcp)
- **版本号**：1.15.1（[固定提交 9917c97](https://github.com/ArvinQi/dsh-mcp/tree/9917c9796aa8ecae45c3808fa5436bb45ece445c)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出为热集合加入会话隔离，比较两会话的无关工具数、额外搜索轮次和合格任务结果。

在两会话复用相同只读服务，观察每步列表、失败回退、上下文和任务结果，并分别核对配置及凭据状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1430 | — | — | 29741 |
| .js | source | 14 | 22777 | 20879 | 2184 | — |
| .mjs | source | 2 | 224 | 133 | 76 | — |
| .tsx | source | 5 | 1755 | 1454 | 216 | — |
| .ts | source | 4 | 1014 | 796 | 166 | — |
| .mjs | test | 16 | 2637 | 2194 | 300 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArvinQi/dsh-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/ArvinQi/dsh-mcp/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/ArvinQi/dsh-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：管理多个 MCP 服务的 DSH 用户，何时能通过设置界面控制模型工具曝光并减少上下文，操作时有哪些宿主和凭据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Web 设置如何减少配置动作，保存成功代表服务已可用吗？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合频繁启停多个 MCP 服务的 DSH 用户。原生 Cordis 声明已能挂 MCP，手工编辑适合稳定少量配置。插件增加统一设置 Remote、托管配置和运行状态，原生同名声明仍由宿主组合负责。客户端先挂远程接口再注册设置槽，Host 验证配置与同名冲突，处理凭据后写配置表并进行挂载协调。镜像行、禁用行、仍有原生声明的行不会新挂载，避免同名工具冲突。

挂载任务把有效环境、全局环境和定义组合后启 MCP 客户端，对 OAuth 服务传授权 provider。真正连接失败会更新挂载失败状态。upsert 返回成功和列表条目只表明定义通过了存储及协调路径，验收应再检查 live 状态和一条预期工具调用。凭据更新还会按服务排队重挂载，因而切换时要核对旧工具是否已经注销。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-17](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/README.md#L15-L17)

作者描述配置问题与适用场景。

```text
- **MCP 工具全量注入烧 token**：接入多个 MCP 服务器后工具可达上百个，每轮全量注入开销巨大。`search` 按需检索模式让模型通过 `mcp_tool_search` 热注入所需工具，大幅节省 token。
- **工具列表反复更新破坏缓存**：`tools/list_changed` 通知会让同名工具被反复注销/重注册，系统提示词工具列表抖动、prompt cache 频繁失效。工具列表稳定化让未变化的工具保留原注册，最大化 cache 命中。
- **没有可视化管理入口**：服务器配置、启停、工具勾选全靠手工改文件。Settings → MCP 一站式可视化完成。
```

**依据 2 · 源码核查**：[src/client/index.ts:129-142](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/src/client/index.ts#L129-L142)

挂载远程管理接口。

<details>
<summary>查看原文（14行）</summary>

```text
export async function apply(ctx: Context): Promise<void> {
  await ctx.remote.$mount(remoteContribution)

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-mcp: dictionaries')

  const t = ctx.locale.bind(NS)

  // The mcpManager namespace is self-mounted by $mount above, so injecting
  // `remote.mcpManager` would deadlock this plugin's own activation. Read the
  // provided service through the global service store instead of the ctx
  // property proxy, which would demand an inject declaration.
  const manager = ctx.get('remote.mcpManager') as McpManagerRemote | undefined
  if (manager === undefined) {
    throw new Error('dsh-mcp: remote.mcpManager namespace is not mounted after $mount')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:238-246](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/src/client/index.ts#L238-L246)

设置槽位。

```text
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'mcp',
    order: 25,
    label: () => t('nav'),
    locale: NS,
    store: createMcpManagerStore,
    inject: injected,
  }, McpSettingsSection))
```

**依据 4 · 源码核查**：[lib/index.js:1416-1456](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1416-L1456)

表单校验、同名检查、持久化和协调。

<details>
<summary>查看原文（41行）</summary>

```text
		async upsert(request) {
			const table = this.requireTable();
			try {
				validateServerInput(request.server, request.env ?? []);
			} catch (error) {
				if (error instanceof McpServerValidationError) return {
					ok: false,
					error: {
						code: "MCP_INVALID_SPEC",
						message: error.message
					}
				};
				throw error;
			}
			if (request.id !== void 0 && table.get(request.id) === void 0) return {
				ok: false,
				error: this.notFound(request.id)
			};
			const id = request.id ?? mintServerId(new Set(table.keys()));
			for (const [otherId, row] of table.entries()) if (otherId !== id && row.serverName === request.server.serverName) return {
				ok: false,
				error: {
					code: "MCP_SERVER_NAME_CONFLICT",
					message: `serverName "${request.server.serverName}" is already used by another managed server`
				}
			};
			const previous = table.get(id);
			// The settings form no longer edits env (process-level env vars are
			// managed separately); when env is not submitted, keep the stored
			// env untouched. The JSON editor still submits env to replace it.
			const envInputs = request.env === void 0
				? (previous?.env ?? []).map((entry) => ({ ...entry }))
				: request.env;
			await this.applyEnv(id, previous, envInputs);
			const row = toServerRow(id, request.server, envInputs, previous);
			await table.put(id, row);
			await this.serialize(id, () => this.reconcileMount(id));
			return {
				ok: true,
				server: await this.view(id, row)
			};
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1268-1288](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1268-L1288)

同名及镜像保护。

<details>
<summary>查看原文（21行）</summary>

```text
		async reconcileMount(id) {
			const row = this.requireTable().get(id);
			// A mirror row is owned by the composition (`origin: "cordis"`): it is
			// never mounted here, whether or not a declaration currently shadows it.
			if (row === void 0 || !row.enabled || row.origin === "cordis" || this.declaredBy(row.serverName) !== void 0) {
				await this.disposeMount(id);
				return;
			}
			// Tools with no local mount are foreign ONLY when this manager never
			// mounted this id: right after a disable/enable cycle its own
			// previous client may still be unregistering.
			if (!this.mounts.has(id) && !this.everMounted.has(id) && this.serverHasTools(row.serverName)) {
				await this.disposeMount(id);
				return;
			}
			await this.disposeMount(id);
			// Registering a second client under the same name while the old
			// registration is still live makes the new generation roll back, so
			// wait for our previous tools to disappear first.
			if (this.serverHasTools(row.serverName)) await this.waitForTools(row.serverName, 2e3, false);
			this.mount(id, row);
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1188-1232](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1188-L1232)

挂载阶段、OAuth 和真实失败分支。

<details>
<summary>查看原文（45行）</summary>

```text
		mount(id, row) {
			this.serialize(id, async () => {
				this.everMounted.add(id);
				await this.disposeMount(id);
				const entry = {
					phase: "mounting",
					error: void 0,
					/** True when the mount only failed because the user still has to authorize. */
					oauthRequired: false
				};
				this.mounts.set(id, entry);
				let handle;
				try {
					const env = await this.resolveEnv(row);
					const globalEnv = await this.resolveGlobalEnv();
					const config = this.toClientConfig(row, env, globalEnv);
					// The OAuth switch is explicit per server (`oauth: true`), and
					// automatic browser authorization happens at most once per
					// server per process: later attempts surface the
					// authorization link instead of opening the browser again.
					// Tokens are keyed by serverName, so a test-connection
					// authorization is reused by the mount.
					const authProvider = this.wantsOAuthProvider(row)
						? createOAuthProvider(row.serverName, this.ctx, {
							allowBrowser: this.allowBrowserOnMount && this.claimAutoBrowser(row.serverName),
							serverUrl: row.url,
							// The mcp-client wrapper replaces the thrown error, so
							// record the pending authorization here: the settings page
							// then shows "waiting for authorization" (plus the button)
							// instead of a red mount failure.
							onAuthorizationRequired: () => {
								entry.oauthRequired = true;
							}
						})
						: void 0;
					handle = this.ctx.plugin(MCP_CLIENT_PLUGIN, { ...config, ...authProvider === void 0 ? {} : { authProvider } });
				} catch (error) {
					entry.phase = "failed";
					entry.error = errorText(error);
					// The provider may already have flagged the pending
					// authorization (it knows before the error gets wrapped);
					// never clear that here.
					entry.oauthRequired = entry.oauthRequired || isOAuthRequired(error);
					this.ctx.logger.error(`mcp-manager(${id}): mount failed: ${entry.error}`);
					return;
```

</details>

#### 缺口

- 未测试真实 MCP 服务连接和设置交互。
  **影响**：不能从保存返回确认工具可用。
  **进一步探讨**：在临时 profile 连接一个本地无副作用 MCP，检查保存、连接、调用、停用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按需检索怎样改变模型可见工具，何时不起作用？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

默认搜索模式通过 MCP 工具注册期注入 when，让宿主每一步根据开关和热集合求值。包装保留既有调用方条件并求交，只影响 mcp__ 命名空间，检索工具自己保持可见。搜索以 ASCII 分词匹配服务名、工具名和描述，限制结果量，把命中放进服务实例的热集合；工具结果也会刷新该集合，最多 60 项。热度表按工具名而非会话分组，因此共享同一管理实例的不同会话可能相互改变下一步曝光。查询纯中文时可能落到无分词分支，从启用列表取前若干项，不能据此承诺语义召回。

兼容旧核心时用提示组装过滤。如果核心既不带 tools 数组也无 resolve，设置可能显示 unavailable。先于包装登记的工具会保留旧注册，直到服务重新挂载。包装的销毁只在当前仍持有方法身份时还原，避免直接覆盖其他插件。MCP 客户端同一连接内同步尽量保留结构不变的工具，能减少注册震荡，但热集合变化仍可能改变工具列表，真实缓存命中率不能从该实现推断。按需模式是模型工具曝光策略，授权和敏感工具的最小权限仍要在服务与宿主独立核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tool-admission.js:50-55](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/tool-admission.js#L50-L55)

实时准入判断。

```text
export function shouldAdmitTool(name, state) {
	const { toolMode, toolSwitches, hotTools } = state;
	if (toolSwitches.get(name) === false) return false;
	if (toolMode === "search") return hotTools.has(name);
	return true;
}
```

**依据 2 · 源码核查**：[lib/tool-admission.js:75-110](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/tool-admission.js#L75-L110)

包装安装、调用方条件和释放。

<details>
<summary>查看原文（36行）</summary>

```text
export function installAdmissionGate(tools, isAdmitted) {
	if (tools === null || typeof tools !== "object") return undefined;
	if (typeof tools.register !== "function") return undefined;
	// `tools.resolve()` is the per-step admission pass introduced with the
	// `when` option; without it the extra argument would be dead weight and the
	// waterfall transform is still the working path.
	if (typeof tools.resolve !== "function") return undefined;
	if (tools.register[GATE_MARK] === true) return () => {};

	const original = tools.register;
	const hadOwnRegister = Object.prototype.hasOwnProperty.call(tools, "register");

	const gate = function registerWithAdmission(definition, options) {
		const name = definition !== null && typeof definition === "object" && typeof definition.name === "string"
			? definition.name
			: undefined;
		if (name === undefined || !name.startsWith("mcp__")) {
			return original.call(this, definition, options);
		}
		const base = options !== null && typeof options === "object" ? options : {};
		const callerWhen = base.when;
		const when = typeof callerWhen === "function"
			? async (context) => (await callerWhen(context)) && isAdmitted(name)
			: () => isAdmitted(name);
		return original.call(this, definition, { ...base, when });
	};
	gate[GATE_MARK] = true;
	tools.register = gate;

	return () => {
		// Only undo our own patch: a later plugin may have wrapped register in
		// turn, and deleting their wrapper would re-open the admission hole.
		if (tools.register !== gate) return;
		if (hadOwnRegister) tools.register = original;
		else delete tools.register;
	};
```

</details>

**依据 3 · 源码核查**：[lib/index.js:619-626](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L619-L626)

模式与热集合属于服务实例。

```text
		/** Per-tool enable switches: a stored `false` disables that tool; absent means enabled. */
		toolSwitches = /* @__PURE__ */ new Map();
		/** Injection mode: `search` (default) injects only resident + hot tools; `full` injects every enabled tool. */
		toolMode = "search";
		/** Recently searched or called MCP tools, LRU-bounded; injected under search mode. */
		hotTools = /* @__PURE__ */ new Map();
		/** LRU bound for {@link hotTools}. */
		static HOT_LIMIT = 60;
```

**依据 4 · 源码核查**：[lib/index.js:1886-1907](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1886-L1907)

LRU 和词法分数。

<details>
<summary>查看原文（22行）</summary>

```text
		/** Record one tool as hot (most-recently-used), LRU-bounded. */
		touchHot(name) {
			this.hotTools.delete(name);
			this.hotTools.set(name, Date.now());
			while (this.hotTools.size > McpManagerService.HOT_LIMIT) {
				const oldest = this.hotTools.keys().next().value;
				if (oldest === void 0) break;
				this.hotTools.delete(oldest);
			}
		}
		/** Keyword score of one tool against query tokens: server name +2, tool name +3, description +1. */
		score(tokens, name, description) {
			const lowerName = name.toLowerCase();
			const hay = `${name} ${description ?? ""}`.toLowerCase();
			const server = this.serverOf(name);
			let s = 0;
			for (const token of tokens) {
				if (server.includes(token)) s += 2;
				else if (lowerName.includes(token)) s += 3;
				else if (hay.includes(token)) s += 1;
			}
			return s;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1939-1947](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1939-L1947)

前置注册及检索工具。

```text
				// A tool registered before this point keeps the old (unconditional)
				// registration; surface it rather than silently mixing behaviours.
				// At boot the count is zero because mounts have not resolved yet.
				const preRegistered = this.toolSnapshot().length;
				if (preRegistered > 0) this.ctx.logger?.warn?.(`mcp-manager: ${preRegistered} MCP tool(s) registered before the admission gate; they stay unconditionally visible until their server remounts`);
			}
			this.ctx.tools.register({
				name: "mcp_tool_search",
				description: hostText(this.ctx, "toolSearchDesc"),
```

**依据 6 · 源码核查**：[lib/index.js:1969-1995](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1969-L1995)

实际查询、匹配及热化。

<details>
<summary>查看原文（27行）</summary>

```text
				execute: async (args) => {
					const q = String(args?.query ?? "").toLowerCase();
					const limit = Math.min(Math.max(Number(args?.limit) || 8, 1), 20);
					const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
					const pool = this.toolSnapshot().filter((tool) => this.toolSwitches.get(tool.name) !== false);
					const picked = tokens.length > 0
						? pool
							.map((tool) => ({ tool, s: this.score(tokens, tool.name, tool.description) }))
							.filter((entry) => entry.s > 0)
							.sort((a, b) => b.s - a.s)
							.slice(0, limit)
							.map((entry) => entry.tool)
						: pool.slice(0, limit);
					for (const tool of picked) this.touchHot(tool.name);
					const lines = picked.map((tool) => JSON.stringify({
						name: tool.name,
						description: String(tool.description ?? "").slice(0, 220),
						parameters: tool.parameters
					}));
					return {
						content: [{
							type: "text",
							text: lines.length > 0
								? hostText(this.ctx, "searchHit", { lines: lines.join("\n") })
								: hostText(this.ctx, "searchMiss")
						}]
					};
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1998-2024](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1998-L2024)

旧 waterfall 降级及工具结果热化。

<details>
<summary>查看原文（27行）</summary>

```text
			this.ctx.on("system-prompt/assemble", (assembly, _context, next) => {
				// Cores ≤ 0.2.1 hand the tool list to this waterfall; filter it here.
				// Cores ≥ 0.2.2 attach the list after the waterfall, so `assembly`
				// carries none — the admission gate above is what filters there. Never
				// read `assembly.tools` unconditionally: doing that threw
				// `assembly.tools is not iterable` on every turn and killed the whole
				// pre-step assembly (issue #22).
				const applied = applyToolControl(assembly, {
					toolSwitches: this.toolSwitches,
					toolMode: this.toolMode,
					hotTools: this.hotTools,
					serverOf: (name) => this.serverOf(name),
					promptText: (key, vars) => hostText(this.ctx, key, vars)
				});
				if (!applied) {
					this.assembleSeamBlocked = true;
					if (!this.assembleToolsUnavailableLogged) {
						this.assembleToolsUnavailableLogged = true;
						if (this.admissionGateInstalled) this.ctx.logger?.info?.("mcp-manager: system-prompt/assemble carries no tool list (DSH >= 0.2.2) — per-tool switches and search mode are enforced at registration time through the admission `when` hook");
						else this.ctx.logger?.warn?.("mcp-manager: system-prompt/assemble carries no tool list and this core exposes no admission hook — per-tool switches and search mode are inactive on this core");
					}
				}
				return next();
			});
			this.ctx.on("tools/result", (exec) => {
				if (exec && typeof exec.name === "string" && exec.name.startsWith("mcp__")) this.touchHot(exec.name);
			});
```

</details>

**依据 8 · 源码核查**：[lib/mcp-client.js:167-200](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/mcp-client.js#L167-L200)

同步保留未变定义。

<details>
<summary>查看原文（34行）</summary>

```text
	// re-sync (e.g. a `tools/list_changed` notification) a tool whose public
	// surface (name/description/parameters/output schema) is unchanged keeps its
	// existing registration instead of being disposed and re-registered.
	// Keeping the system-prompt tool list stable preserves prompt-cache hits;
	// execution still calls the live MCP server, so server-side changes need no
	// re-registration. A reconnected generation gets `stable: false` and rebuilds
	// every tool because its executors bind the new client.
	const kept = /* @__PURE__ */ new Set();
	if (opts.stable !== false) {
		for (const [publicName, definition] of definitions) {
			if (!previous.has(publicName)) continue;
			const existing = ctx.tools.get(publicName);
			if (existing !== void 0 && toolPublicEqual(existing, definition)) kept.add(publicName);
		}
	}
	for (const [publicName, dispose] of previous) {
		if (!kept.has(publicName)) dispose();
	}
	const disposers = /* @__PURE__ */ new Map();
	try {
		for (const [publicName, definition] of definitions) {
			if (kept.has(publicName)) {
				disposers.set(publicName, previous.get(publicName));
				continue;
			}
			disposers.set(publicName, ctx.tools.register(definition));
		}
	} catch (error) {
		for (const dispose of disposers.values()) dispose();
		ctx.logger.error(`mcp-client(${opts.serverName}): tool registration failed, no tools registered: ${String(error)}`);
		if (opts.registrationFailure === "throw") throw error;
		return /* @__PURE__ */ new Map();
	}
	return disposers;
```

</details>

#### 缺口

- 未测 DSH 核心真实 when 调用、共享热集合、缓存或模型选工具效果。
  **影响**：应把工具曝光与权限、成本分别验证。
  **进一步探讨**：在两个会话对照按需与全量，核实开关、中文查询、工具结构变化和下一步曝光。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 托管 MCP 会启动什么进程、保存哪些凭据，出错如何恢复？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

stdio transport 会以配置命令、参数、cwd 运行外部进程，环境从宿主提供的 scrubbedParentEnv 与插件配置叠加。清理父环境只减少继承内容，不能当作进程隔离。streamable HTTP 会按指定 URL 连接，使用配置 header 与可选授权 provider，HTTPS 补用系统信任根。OAuth 凭据从宿主凭据服务读取，存在 refresh token 时保留过期 access token 供 SDK 处理刷新，否则识别过期后清除并重新授权。实际网络、浏览器与服务端仍需核对。

服务定义和环境凭据依次保存，失败可能留下配置与凭据状态不一致，删除会先释放挂载并删表，再清理 secret env；授权 token 和所有 profile 状态需要另行回读。接管声明时管理块写入 profile patch，若文件非空且此前无备份就保留一次副本，再用临时文件 rename。该原子替换只对应文件，宿主是否重载需要回执。持续成本主要为检查第三方服务、凭据及网络，不宜在真实凭据和高权限 stdio 命令下先做验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:43-55](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/package.json#L43-L55)

固定源码声明宿主 0.2.2-rc.1 和客户端依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "supported": "0.2.2-rc.1",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[lib/transport.js:5-38](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/transport.js#L5-L38)

stdio 命令与环境、HTTP 头及 TLS。

<details>
<summary>查看原文（34行）</summary>

```text
function buildChildEnv(extra) {
  return { ...scrubbedParentEnv(), ...extra };
}
/**
 * HTTPS servers are verified against the operating-system trust store in
 * addition to Node's bundled roots (see lib/system-ca.js): internal/corporate
 * endpoints are usually signed by a CA that only the OS knows.
 */
function trustSystemCaFor(url) {
  try {
    if (new URL(url).protocol === "https:") ensureSystemCaTrust();
  } catch {
  }
}
function createTransport(config) {
  switch (config.transport) {
    case "stdio":
      return new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: buildChildEnv(config.env),
        cwd: config.cwd
      });
    case "streamable-http":
      trustSystemCaFor(config.url);
      return new StreamableHTTPClientTransport(
        new URL(config.url),
        {
          requestInit: { headers: config.headers },
          // HTTPS verification trusts the OS store (corporate/internal roots);
          // the SDK reuses this fetch for its OAuth discovery/token calls.
          fetch: systemFetch(),
          ...(config.authProvider === void 0 ? {} : { authProvider: config.authProvider })
        }
```

</details>

**依据 3 · 源码核查**：[lib/oauth.js:279-307](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/oauth.js#L279-L307)

凭据读取和刷新资格。

<details>
<summary>查看原文（29行）</summary>

```text
    async tokens() {
      const hit = await ctx.credentials.resolve(oauthTokenRef(serverId));
      if (hit === undefined) return undefined;
      let tokens;
      try {
        tokens = JSON.parse(hit.value);
      } catch {
        return undefined;
      }
      // An expired access token is NOT a reason to forget the credentials: the
      // SDK answers a 401 with `refreshAuthorization` and retries the request,
      // and that path only runs when the stored tokens (refresh token included)
      // are handed back. Clearing on expiry — the previous behaviour — turned
      // every token lifetime into a fresh browser authorization although the
      // refresh token was still valid (access tokens here live ~1h). Only a
      // credential that cannot refresh at all is dropped, so the SDK goes
      // straight to the authorization flow instead of a doomed refresh; a dead
      // refresh token is handled by `auth()` itself (InvalidGrant →
      // invalidateCredentials → retry → browser flow).
      const refreshable = tokens.refresh_token !== undefined && tokens.refresh_token !== null && tokens.refresh_token !== "";
      if (!refreshable) {
        const exp = jwtExp(tokens.access_token);
        if (exp !== undefined && Date.now() / 1000 >= exp) {
          log.info(`${tag}: stored access token expired and no refresh token is stored, clearing for re-authorization`);
          await ctx.credentials.unset(oauthTokenRef(serverId));
          return undefined;
        }
      }
      return tokens;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1446-1455](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1446-L1455)

凭据与定义分别写。

<details>
<summary>查看原文（10行）</summary>

```text
			const envInputs = request.env === void 0
				? (previous?.env ?? []).map((entry) => ({ ...entry }))
				: request.env;
			await this.applyEnv(id, previous, envInputs);
			const row = toServerRow(id, request.server, envInputs, previous);
			await table.put(id, row);
			await this.serialize(id, () => this.reconcileMount(id));
			return {
				ok: true,
				server: await this.view(id, row)
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1487-1500](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1487-L1500)

删除挂载、配置及 secret env 的顺序。

<details>
<summary>查看原文（14行）</summary>

```text
		async delete(request) {
			const table = this.requireTable();
			const row = table.get(request.id);
			if (row === void 0) return {
				ok: false,
				error: this.notFound(request.id)
			};
			await this.serialize(request.id, async () => {
				await this.disposeMount(request.id);
				await table.delete(request.id);
			});
			this.everMounted.delete(request.id);
			for (const entry of row.env) if (entry.secret) await this.ctx.credentials.unset(secretRef(request.id, entry.name));
			return { ok: true };
```

</details>

**依据 6 · 源码核查**：[lib/patch-writer.js:110-135](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/patch-writer.js#L110-L135)

托管块和一次备份、原子替换。

<details>
<summary>查看原文（26行）</summary>

```text
export function writeManagedIds(path, ids) {
	const current = readPatchText(path);
	const unique = [...new Set(ids)].sort();
	const next = composeText(splitManagedBlock(current).base, unique);
	if (next === current) return { ok: true, changed: false, path };
	let backupPath;
	try {
		if (current.length > 0 && !existsSync(`${path}${BACKUP_SUFFIX}`)) {
			copyFileSync(path, `${path}${BACKUP_SUFFIX}`);
			backupPath = `${path}${BACKUP_SUFFIX}`;
		}
		// Atomic replace: a reader (the HMR watcher) never observes a half write.
		const staging = `${path}.dsh-mcp.tmp-${process.pid}`;
		writeFileSync(staging, next);
		renameSync(staging, path);
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
	return {
		ok: true,
		changed: true,
		path,
		...backupPath === void 0 ? {} : { backupPath }
```

</details>

#### 缺口

- 未核实宿主凭据存储、网络认证或第三方进程权限。
  **影响**：试用应采用无真实授权的只读或空实现服务。
  **进一步探讨**：临时 profile 加假 stdio 与 HTTP 服务，测试失败、撤销及重挂载后的进程和凭据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在何种小范围任务应试用，怎样判断按需真的省成本？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

建议有多个 MCP 工具且经常发现工具列表过长的用户，在声明匹配的隔离 profile 接两台可丢弃只读服务。先记录原生声明和全量模式的工具列表，再用同一问题启用搜索，分别核查第一次搜索、下一步实际可见工具和关闭单工具的结果。采用前需确认右工具可选、禁用工具不进当前步骤，以及同一合格任务实际输入量和轮次数。若宿主报 unavailable、前置工具未受限、中文搜索未能匹配或总轮次抵消上下文节省，停止依赖搜索模式，回到有限的原生声明。

待验证设计是假设按会话而非按服务实例保留热集合，能减少跨会话污染及无关 schema 而不明显增加冷启动检索。用交替的两会话及相同服务集比较现状与原型，统计无关工具、请求数和正确任务，若需更多轮且正确率不增，保留共享热度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:619-626](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L619-L626)

共享热集合和容量。

```text
		/** Per-tool enable switches: a stored `false` disables that tool; absent means enabled. */
		toolSwitches = /* @__PURE__ */ new Map();
		/** Injection mode: `search` (default) injects only resident + hot tools; `full` injects every enabled tool. */
		toolMode = "search";
		/** Recently searched or called MCP tools, LRU-bounded; injected under search mode. */
		hotTools = /* @__PURE__ */ new Map();
		/** LRU bound for {@link hotTools}. */
		static HOT_LIMIT = 60;
```

**依据 2 · 源码核查**：[lib/index.js:1969-1987](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L1969-L1987)

现有匹配与热化。

<details>
<summary>查看原文（19行）</summary>

```text
				execute: async (args) => {
					const q = String(args?.query ?? "").toLowerCase();
					const limit = Math.min(Math.max(Number(args?.limit) || 8, 1), 20);
					const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);
					const pool = this.toolSnapshot().filter((tool) => this.toolSwitches.get(tool.name) !== false);
					const picked = tokens.length > 0
						? pool
							.map((tool) => ({ tool, s: this.score(tokens, tool.name, tool.description) }))
							.filter((entry) => entry.s > 0)
							.sort((a, b) => b.s - a.s)
							.slice(0, limit)
							.map((entry) => entry.tool)
						: pool.slice(0, limit);
					for (const tool of picked) this.touchHot(tool.name);
					const lines = picked.map((tool) => JSON.stringify({
						name: tool.name,
						description: String(tool.description ?? "").slice(0, 220),
						parameters: tool.parameters
					}));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2031-2050](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L2031-L2050)

采用时可检查 enforcement。

<details>
<summary>查看原文（20行）</summary>

```text
		async toolsList() {
			const tools = this.toolSnapshot().map((tool) => ({
				name: tool.name,
				server: this.serverOf(tool.name),
				description: String(tool.description ?? "").slice(0, 140),
				enabled: this.toolSwitches.get(tool.name) !== false
			}));
			return {
				ok: true,
				tools,
				mode: this.toolMode,
				hotSize: this.hotTools.size,
				/**
				* How this core enforces `mode` and the per-tool switches: `admission`
				* (declared at registration, resolved per step — DSH ≥ 0.2.2),
				* `waterfall` (filtered inside `system-prompt/assemble` — ≤ 0.2.1), or
				* `unavailable` (neither seam exists, so the stored config is inert).
				*/
				enforcement: this.admissionGateInstalled ? "admission" : this.assembleSeamBlocked ? "unavailable" : "waterfall"
			};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2080-2090](https://github.com/ArvinQi/dsh-mcp/blob/9917c9796aa8ecae45c3808fa5436bb45ece445c/lib/index.js#L2080-L2090)

切模式会清热度。

<details>
<summary>查看原文（11行）</summary>

```text
				return {
					ok: false,
					error: {
						code: "MCP_TOOL_INVALID_MODE",
						message: "mode must be full|search"
					}
				};
			}
			this.toolMode = mode;
			this.hotTools.clear();
			return { ok: true, mode };
```

</details>

#### 缺口

- 未验证节省输入量、缓存命中及采用回退。
  **影响**：当前只建议隔离试用。
  **进一步探讨**：用可重复两会话工作负载记录正确性、输入量、额外轮数和恢复负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
