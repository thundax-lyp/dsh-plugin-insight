# DSH MCP Manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a2a2a93](https://github.com/hyqhyq3/dsh-mcp-manager/tree/a2a2a936c42035a52656b8f8e625b871399b48eb)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyqhyq3/dsh-mcp-manager) [![npm 30d 1,105](https://img.shields.io/static/v1?label=npm+30d&message=1%2C105&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-manager) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-manager)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中管理 OAuth 或 stdio MCP 服务、工作区工具范围及按需工具。

> **亮点**：在一个 Web 设置中维护 MCP 服务、OAuth 与工作区可见集，并在部分 native 路径延后工具 schema。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：Agent scope 不约束底层 stdio 进程的 OS 权限。工具定义压缩还有 native/代码和模型路由条件，无法作为统一安全或成本保证。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要管理 MCP 服务，在 DSH 中新增的是哪一层？](#detail-section-11)
  - [Q02 · 工作区工具范围和 stdio 进程权限有什么关系？](#detail-section-12)
  - [Q03 · 按需 broker 在不同执行器上降低哪一部分负担？](#detail-section-13)
  - [Q04 · 如何在不牺牲可复核授权的前提下试验，费用如何计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多套 MCP 服务的 DSH 用户可通过设置接入工具，按需控制工作区来源和模型看到的定义。

少量已知服务可手工配置，保留原生调用与独立连接诊断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 设置与 OAuth | 维护连接和诊断 | 依赖宿主与 provider 支持 |
| 工作区工具 | 限定 Agent 可见组合 | 非 OS 沙箱，缺服务会降级 |
| 按需 broker | 降低部分 native 的定义重量 | code/PTC 保留目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| tools、Web 与 connection | 管理需 | 注册工具及授权 | 缺 GUI 仅保部分能力 |
| 可信 MCP 服务和本机命令 | 按连接类型 | 工具实现 | 断开或退手工 |
| agents 与模型路由 | 作用域和 broker 需 | 选择本会话的定义 | 降级或回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选可信本地只读服务 | 核对权限，避免真实凭据 |
| 执行 | 按两工作区和两路由调用 | 真实工具集与端点匹配 |
| 退出 | 禁用 broker 或断连接 | 回静态可核对设置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地与远端价格未测 | 配置源、权限和 OAuth | 认证 provider 独立验证 |
| 持续 | 新增往返及后台进程未计 | 查命令健康、刷新和工具可见 | 模型路由决定载荷 |
| 恢复 | 重连和重复任务成本未知 | 撤回工具与凭据 | 本机状态须保护 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 连接管理 | 存在 Web/Host 接线及 OAuth 回调 | 真实授权兼容 |
| 按需定义 | 多种展示与 stub | 真实 token 与准确率 |
| 会话过滤 | workspace scope 和排除 | 隔离覆盖以及误配置后果 |

> **思考**：Agent scope 不约束底层 stdio 进程的 OS 权限。工具定义压缩还有 native/代码和模型路由条件，无法作为统一安全或成本保证。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在一个 Web 设置中维护 MCP 服务、OAuth 与工作区可见集，并在部分 native 路径延后工具 schema。[Q01](#research-q01) [Q03](#research-q03)

配置替换、scope 清理和嵌套调用分别处理。移植需要核对动态 host 服务与凭据保护，不只复制 HTML 管理面。

<a id="detail-section-5"></a>

### 1.4 主要限制

Agent scope 不约束底层 stdio 进程的 OS 权限。工具定义压缩还有 native/代码和模型路由条件，无法作为统一安全或成本保证。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

关注已知两个工作区在 native 显示的工具集能否正确分开，使用无凭据且只读的受控服务。来源、权限或调用无法核对时关掉 broker、断开插件接线并退回手工配置。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持设置、工作区和 broker 能力，供应商 OAuth 及最终模型载荷和收益待验收。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根版本，抽查连接、授权、进程、工具与展示。不运行目标。
- 下一步：记录每个环境的最终 tool payload、可见集和调用结果，再验证述及时序而非只看客户端卡片。

**分析版本**

- **仓库**：[hyqhyq3/dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager)
- **版本号**：0.17.1（[固定提交 a2a2a93](https://github.com/hyqhyq3/dsh-mcp-manager/tree/a2a2a936c42035a52656b8f8e625b871399b48eb)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

大量工具的 native 场景中，按需查看完整定义可能减少有效调用的 schema 开销。用真实发送载荷、准确率和发现往返对照才能确认。[Q04](#research-q04)

记录每个环境的最终 tool payload、可见集和调用结果，再验证述及时序而非只看客户端卡片。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1923 | — | — | 32316 |
| .js | source | 2 | 5719 | 3463 | 2066 | — |
| .mjs | example | 4 | 573 | 526 | 36 | — |
| .mjs | source | 7 | 639 | 596 | 36 | — |
| .js | test | 23 | 6323 | 5453 | 397 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/hyqhyq3/dsh-mcp-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/hyqhyq3/dsh-mcp-manager/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyqhyq3/dsh-mcp-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护多套 MCP 连接的 DSH 用户能否按会话控制工具可见、保留授权，并在真实模型路径上降低 schema 负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要管理 MCP 服务，在 DSH 中新增的是哪一层？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

同时维护本地及远端 MCP 的 Web 用户可以从设置集中接入服务和诊断。领到的不是另一个工具协议：目标仍提供 MCP 工具。对照手工维护一份已知的 MCP 配置，响应的增量是图形管理、OAuth 状态和按会话选择所见工具。没有工作区差异、固定只用一个服务器时，先用现有配置更便于查证。作者声称内置方案仅为静态配置，本次未独立核对所有宿主版本，比较只以手工固定配置作基线。

包通过 Cordis 挂接 Host tools 和浏览器设置页。Host 等待 webServer 时可先保留工具，agents 服务出现后才装上工作区装饰。缺 create/resume 时 global 仍可用，不能因此声称 workspace 隔离生效。应分别核对路由、两个 workspace 可见集合和实际工具调用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-17](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/README.md#L7-L17)

作者列出 HTTP OAuth 和本地连接管理，宿主基线为作者主张。

<details>
<summary>查看原文（11行）</summary>

```text
**MCP server manager for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness)** — a Settings → MCP page where you add MCP servers once (remote HTTP or local stdio process), authenticate HTTP servers with **OAuth in the browser**, and expose their tools either directly or through a compact on-demand broker.

The built-in `@deepseek-ai/dsh-mcp-client` only accepts a static `headers` config — it has no OAuth support and no local stdio transport. This plugin fills that gap:

- **OAuth (authorization code + PKCE)** with spec-compliant discovery, RFC 7591 dynamic client registration, `refresh_token` rotation, and auto-reconnect across restarts — one browser login, then it keeps working.
  - **Registration identity and secret** (RFC 7591): the `client_name` sent to the registration endpoint is `dsh-mcp-manager-<server>` by default and configurable per server (**Client name**) for providers that gate registration on an exact name. When the authorization server advertises `client_secret_post`, the client registers confidentially: the issued `client_secret` is stored in the 0600 state file and sent on token exchange and refresh (never in a view, response or log). For a dynamically registered client, a changed client name — or a new GUI origin — re-registers and drops the old client's tokens; a manually configured Client ID is unaffected.
  - **Client application type** follows MCP SEP-837: HTTP loopback callbacks (`localhost`, IPv4 loopback, or `[::1]`) register as `native`; other callbacks register as `web`. This avoids OIDC providers defaulting a local GUI to `web` and rejecting its redirect. Registration failures show the provider's OAuth error code when available; the Logs panel retains the detailed reason. Providers may still restrict which clients or redirects they accept.
  - **Callback origin** accepts direct loopback `Host` values (including `[::1]:port`). Configure
    `publicOrigins` for a reverse proxy: one configured origin is the default callback even without
    forwarded headers; with multiple origins, a complete `X-Forwarded-Proto`/`X-Forwarded-Host` pair
    must match the allowlist. A foreign direct Host is rejected when no default is configured.
```

</details>

**依据 2 · 源码核查**：[package.json:5-19](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/package.json#L5-L19)

两个实际发布入口。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
```

</details>

**依据 3 · 源码核查**：[lib/client.js:764-779](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/client.js#L764-L779)

Web 注册 MCP 设置页。

<details>
<summary>查看原文（16行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("mcp", { zh, en }), "dsh-mcp-manager: dictionaries");
			const t = ctx.locale.bind("mcp");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "mcp-manager",
				order: 50,
				label: () => t("sectionLabel"),
				locale: "mcp",
			}, McpContent));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4886-4906](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L4886-L4906)

缺 webserver 或 agents 各自降级。

<details>
<summary>查看原文（21行）</summary>

```text
  // The Settings → MCP UI needs the GUI webserver, but the agent-side tiers do
  // not. Mount the route when (and if) a webserver appears instead of declaring
  // a hard dependency: a profile without one (headless/tui) then keeps its MCP
  // tools, whereas newer harness builds fail the whole boot when an installed
  // entry never activates.
  ctx.effect(() => ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register(routeDefinition));
  }).dispose);

  // Decorate agents.create/resume so every agent gets workspace-scoped MCP.
  // Injected lazily (not a hard plugin dependency): the agent registry may
  // appear after this plugin in some compositions. If it never appears,
  // workspace isolation stays off while the global tier keeps working.
  ctx.effect(() => ctx.inject(['agents'], (childCtx) => {
    const agents = childCtx.agents;
    if (!agents || typeof agents.create !== 'function' || typeof agents.resume !== 'function') {
      ctx.logger.warn('mcp-manager: agents registry lacks create/resume; workspace isolation disabled');
      return;
    }
    childCtx.effect(() => installAgentDecorators(agents), 'mcp-agent-decorators');
  }).dispose);
```

</details>

#### 缺口

- 未运行该固定版本从 GUI 完成首次与续期连接。
  **影响**：条件采用取决于真实宿主和服务器。
  **进一步探讨**：用隔离 profile 配置两个不会写文件的本地示例服务器，再核对实例是否可见并可调用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区工具范围和 stdio 进程权限有什么关系？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

create/resume 注入 setup 后读会话的绝对 cwd，归一化并扫描该工作区的 MCP 配置。读取到工作区服务、排除和禁用名单后，变更会触发串行重扫；无效 JSON 停在旧状态并显示错误。工作区工具挂入该 Agent scope，排除策略用 restrict 约束 global 工具，而失败只记录告警。因此必须确认 Agent 装饰是否成功以及实际调用可见集，不能把工作区配置理解为绝对隔离。

stdio 会继承当前环境再覆盖显式配置，cwd 来自服务器配置或进程默认，Windows 选择命令解释器，POSIX 不通过 shell。工作区控制的是连接及工具範围，子进程仍以宿主账号权限访问环境和文件。可信目录中的本地服务可作为最小验证对象，来源不明的配置会把调用方带到未知程序。卸载会清理各 scope、broker 与续连计时。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4205-4246](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L4205-L4246)

从 Agent create/resume 接线到会话 cwd，并注册清理。

<details>
<summary>查看原文（42行）</summary>

```text
  function composeAgentSetup(callerSetup) {
    return async (agentCtx, explicitAgent) => {
      const agent = resolveSetupAgent(agentCtx, explicitAgent);
      let wsPath = null;
      const cwd = agent?.session?.header?.cwd;
      if (typeof cwd === 'string' && cwd.length > 0 && isAbsolute(cwd)) {
        try {
          wsPath = canonicalize(cwd);
          const ws = ensureWorkspace(wsPath, cwd);
          await rescanWorkspace(wsPath);
          ws.agents.add(agent);
          agentScopeState.set(agent, { wsPath, disposers: new Map(), restrictDisposer: undefined, restrictKey: undefined });
          rebuildAgentWorkspace(agent, wsPath);
        } catch (error) {
          ctx.logger.warn(`mcp-manager: workspace scoping failed for ${cwd}: ${error?.message ?? error}`);
          wsPath = null;
        }
      }
      if (wsPath) {
        agentCtx.effect(() => () => { releaseWorkspace(wsPath, agent); }, 'mcp-workspace-release');
      }
      // A compose pass starts from an empty shadow row; the first assemble
      // event decides whether the agent's route gets stubs at all.
      disposeAgentShadows(agent);
      return (await callerSetup?.(agentCtx, agent)) ?? undefined;
    };
  }

  function installAgentDecorators(agents) {
    const wrapCreate = (original, thisArg, args) => {
      const options = args[0];
      if (!options || typeof options !== 'object') throw new TypeError('mcp-manager: agents.create() requires options');
      return original.call(thisArg, { ...options, setup: composeAgentSetup(options.setup) });
    };
    const wrapResume = (original, thisArg, args) => {
      const options = args[0];
      if (!options || typeof options !== 'object') throw new TypeError('mcp-manager: agents.resume() requires options');
      return original.call(thisArg, { ...options, setup: composeAgentSetup(options.setup) });
    };
    const h1 = installMethodWrapper(agents, 'create', wrapCreate);
    const h2 = installMethodWrapper(agents, 'resume', wrapResume);
    return () => { h2.dispose(); h1.dispose(); };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3536-3557](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L3536-L3557)

解析 JSON 全量工作区设置。

<details>
<summary>查看原文（22行）</summary>

```text
  function readWorkspaceConfig(cwd) {
    try {
      const raw = JSON.parse(readFileSync(wsConfigPath(cwd), 'utf8'));
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('root must be a JSON object');
      const mcpServers = raw?.mcpServers;
      const servers = [];
      if (mcpServers && typeof mcpServers === 'object' && !Array.isArray(mcpServers)) {
        for (const [name, cfg] of Object.entries(mcpServers)) {
          const server = normalizeWorkspaceServer(name, cfg, cwd);
          if (server) servers.push(server);
        }
      }
      const exclude = normalizeNameList(raw?.exclude);
      // Per-workspace off switch. Names may be global or workspace-local; an
      // unknown name is ignored (logged once when the list changes) rather than
      // failing the whole file.
      const disabled = normalizeNameList(raw?.disabled);
      return { servers, exclude, disabled, error: '' };
    } catch (error) {
      if (error?.code === 'ENOENT') return { servers: [], exclude: [], disabled: [], error: '' };
      return { servers: [], exclude: [], disabled: [], error: `invalid ${WORKSPACE_CONFIG_REL}: ${error?.message ?? error}` };
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3944-3972](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L3944-L3972)

坏文件回退，按配置建立作用域需求。

<details>
<summary>查看原文（29行）</summary>

```text
  async function doRescan(wsPath) {
    const ws = workspaces.get(wsPath);
    if (!ws) return;
    ensureWorkspaceWatchers(wsPath, ws);
    const cfg = readWorkspaceConfig(ws.rawPath ?? ws.path);
    if (cfg.error) {
      ws.error = cfg.error;
      return;
    }
    for (const srv of cfg.servers) {
      srv.id = workspaceServerId(wsPath, srv.name);
      srv.wsPath = wsPath;
      const oauth = state.workspaceTokens?.[workspaceTokenKey(wsPath, srv.name)]?.oauth;
      if (oauth) srv.oauth = oauth;
    }
    const errorChanged = ws.error !== '';
    ws.error = '';
    const excludeChanged = JSON.stringify([...(ws.exclude ?? [])].sort()) !== JSON.stringify([...(cfg.exclude ?? [])].sort());
    const disabledChanged = JSON.stringify([...(ws.disabled ?? [])].sort()) !== JSON.stringify([...(cfg.disabled ?? [])].sort());
    ws.exclude = cfg.exclude;
    ws.disabled = cfg.disabled;
    let changed = excludeChanged || disabledChanged || errorChanged;
    if (disabledChanged) reportUnknownDisabled(ws, cfg);
    const desired = new Map();
    for (const srv of cfg.servers) {
      const disabled = ws.disabled.includes(srv.name);
      // A disabled entry is not registered. If the same name also exists as a
      // global server, the entry masks that global too: one list, one name.
      desired.set(srv.name, { conflict: !disabled && serverNameTaken(srv.name, wsPath), server: srv, disabled });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3802-3815](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L3802-L3815)

排除和禁用使用 restrict，其失败只告警。

<details>
<summary>查看原文（14行）</summary>

```text
  function reconcileRestrictForAgent(agent, ws, st) {
    // `disabled` covers global servers too; workspace-local names are simply not
    // connected, so they never have entries in globalToolsByServer.
    const deny = deniedGlobalToolNames([...(ws.exclude ?? []), ...(ws.disabled ?? [])]);
    const restrictKey = JSON.stringify(deny);
    if (st.restrictKey === restrictKey) return;
    if (st.restrictDisposer) { try { st.restrictDisposer(); } catch {} st.restrictDisposer = undefined; }
    st.restrictKey = restrictKey;
    if (deny.length === 0) return;
    try {
      st.restrictDisposer = agent.ctx.tools.restrict({ deny });
    } catch (error) {
      ctx.logger.warn(`mcp-manager: restrict(${deny.join(', ')}) failed: ${error?.message ?? error}`);
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2591-2608](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2591-L2608)

实际 spawn 继承环境，Windows 用 shell。

<details>
<summary>查看原文（18行）</summary>

```text
  // ---------- stdio transport (JSON-RPC over stdin/stdout, newline-delimited) ----------
  function spawnStdio(server, onNotification) {
    // On Windows, `npx`/`uvx` are `.cmd` shims that spawn() cannot launch
    // directly (ENOENT for the bare name, EINVAL for the `.cmd` path). Letting
    // the shell resolve them fixes both cases. On POSIX this is a no-op.
    const isWin = process.platform === 'win32';
    // With `shell: true` Node hands `cmd.exe /d /s /c "<line>"` the command and
    // args joined by bare spaces and adds no quoting of its own, so any token
    // containing whitespace must be quoted here or cmd truncates it at the
    // first space. Quoting is idempotent for already-quoted config values.
    const command = isWin ? quoteWindowsToken(server.command) : server.command;
    const args = isWin ? (server.args ?? []).map(quoteWindowsToken) : (server.args ?? []);
    const child = spawn(command, args, {
      cwd: server.cwd || process.cwd(),
      env: { ...process.env, ...(server.env ?? {}) },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: isWin,
    });
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4908-4919](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L4908-L4919)

退出清理工作区和重连职责。

<details>
<summary>查看原文（12行）</summary>

```text
  // On plugin unload/reload, kill every live global + workspace stdio child
  // process and stop every workspace config watcher.
  ctx.effect(() => () => {
    pluginDisposed = true;
    brokerRuntimeDispose?.();
    brokerRuntimeDispose = null;
    for (const st of agentScopeState.values()) disposeAgentScope(st);
    disposeAllAgentShadows();
    // Cancel queued reconnects first: their timers would otherwise fire after the
    // plugin is gone and try to reconnect against a torn-down ctx.
    for (const serverId of [...reconnectTimers.keys()]) cancelReconnect(serverId, { resetAttempts: true });
    reconnectAttempts.clear();
```

</details>

#### 缺口

- 未验证多受限用户、配置故损以及子进程能读到哪些具体环境项。
  **影响**：权限影响可能超出 UI workspace 范围。
  **进一步探讨**：用隔离系统用户、赝造环境值和两个 workspace 验证 scope、allow/deny 与进程退出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 按需 broker 在不同执行器上降低哪一部分负担？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

开关 off 时工具直接通过 DSH 注册。启用时 write marker，并加入搜索、描述、执行入口以向当前 Agent 提供按需工具。执行时在该 Agent 的 brokerCatalog 查名，然后调用宿主 tools.execute，保留 signal、调用标识和可用 toolSet。传统与批执行参数共存，所以层间调用能力不等于让模型绕过工具可见集。

native 配合可以尊重 toolUpdate 的宿主路由优先走 deferLoading。模型路由解析失败仍按原 marker 流程。确认 route 缺该支持时，普通 native 的同名 Agent scope 工具可用参数为空的 stub 遮住较长定义，完整信息在描述时再拿，工具数量本身仍随目标服务器增加。code 或 PTC 场景要保持执行器 SDK 和原工具，不能照搬压缩效果。guard 为嵌套调用记录 per-agent 进行中，无法当成每次请求身份有单独令牌的权限机制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2180-2228](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2180-L2228)

开关 marker、code 识别与 Agent stub。

<details>
<summary>查看原文（49行）</summary>

```text
  function directMcpToolsDeferred() {
    return state.onDemandToolInjection === true;
  }

  function withDeferredDirectTool(definition) {
    if (!directMcpToolsDeferred()) {
      if (definition.deferLoading === undefined) return definition;
      const { deferLoading: _deferred, ...rest } = definition;
      return rest;
    }
    return { ...definition, deferLoading: true };
  }

  // A code/PTC presentation dispatches every capability from inside a generated
  // program, and those nested calls carry no broker parent token. Executors
  // distinguish the presentations by owning prompt sections (the generated SDK);
  // the native executor owns none.
  function isCodePresentationAgent(agent) {
    try {
      const executor = ctx.tools.selectExecutor(agent);
      return Array.isArray(executor?.sections) && executor.sections.length > 0;
    } catch {
      return false;
    }
  }

  const STUB_TOOL_PARAMETERS = { type: 'object', properties: {} };

  // The stub keeps the raw name reachable (nested dispatches execute through
  // it) while carrying none of the schema weight, so the pointer text stays
  // within 160 characters regardless of how long the real description is; the
  // 64-char public-name cap bounds the fallback form too.
  function stubDescription(base) {
    const name = typeof base?.name === 'string' ? base.name : '';
    const server = typeof base?.mcpServerName === 'string' ? base.mcpServerName : '';
    const detailed = `${name} (MCP server "${server}"): args hidden for prompt budget. Call via mcp_execute_tool(name="${name}") or inspect it with mcp_describe_tool.`;
    if (detailed.length <= 160) return detailed;
    return `${name}: MCP tool; args hidden for prompt budget. Call via mcp_execute_tool or mcp_describe_tool.`;
  }

  // The single materialization point for what reaches a registry tier: full
  // mode retreats to the state-driven deferLoading marker, and shadow mode
  // (per-agent scopes only) collapses parameters and description. Code/PTC/both
  // presentations keep the full catalog (issue #18) and never take a stub.
  function materializeDefinition(base, agent, stubbed) {
    if (stubbed === true && !isCodePresentationAgent(agent)) {
      return { ...base, description: stubDescription(base), parameters: STUB_TOOL_PARAMETERS, deferLoading: true };
    }
    return withDeferredDirectTool(base);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2247-2258](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2247-L2258)

按当前模型判 toolUpdate；未知的保守分支。

<details>
<summary>查看原文（12行）</summary>

```text
  async function routeHonorsToolUpdate(modelSelection) {
    if (!modelSelection || typeof modelSelection !== 'object'
      || typeof modelSelection.provider !== 'string' || typeof modelSelection.model !== 'string') return true;
    const llm = ctx.get?.('llm');
    if (!llm || typeof llm.resolveModelInfo !== 'function') return true;
    try {
      const info = await llm.resolveModelInfo(modelSelection.provider, modelSelection.model, undefined);
      return info?.toolUpdate === 'in-history' || info?.toolUpdate === 'addition-only';
    } catch (error) {
      ctx.logger.warn(`mcp-manager: model-info resolution failed for ${modelSelection.provider}/${modelSelection.model}; keeping the full direct MCP surface (${error?.message ?? error})`);
      return true;
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2447-2477](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2447-L2477)

broker 校验会话可见集再嵌套执行两类 API。

<details>
<summary>查看原文（31行）</summary>

```text
        isConcurrencySafe: () => false,
        async execute(args, exec) {
          const name = String(args?.name ?? '').trim();
          if (!brokerCatalog(exec.agent).some((candidate) => candidate.schema.name === name)) {
            throw new Error(`MCP tool "${name}" is not visible in this session`);
          }
          const agent = exec.agent;
          const callId = `${exec.callId}:mcp:${nestedSeq++}`;
          approvedParents.add(exec.token);
          if (agent !== undefined) dispatchingAgents.set(agent, (dispatchingAgents.get(agent) ?? 0) + 1);
          try {
            // DSH 0.2.2 takes a single-call batch (`calls`) and carries no parent
            // token; 0.2.1 and older take the flat single-call shape. Both keys
            // travel together, so each generation reads the one it knows. The
            // step's `toolSet` is forwarded when the harness supplies one.
            const settled = await ctx.tools.execute({
              calls: [{ id: callId, name, arguments: JSON.stringify(args.arguments ?? {}) }],
              callId,
              rootCallId: exec.rootCallId,
              name,
              arguments: args.arguments ?? {},
              agent,
              parent: exec.token,
              signal: exec.signal,
              ...(exec.toolSet !== undefined ? { toolSet: exec.toolSet } : {}),
            });
            const result = Array.isArray(settled?.results) ? settled.results[0]?.result : settled;
            if (result?.isError) throw new Error(result.error?.message ?? 'MCP tool execution failed');
            return { content: renderBrokerExecuteResult(args, { content: result?.content ?? [] }) };
          } finally {
            approvedParents.delete(exec.token);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2491-2547](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2491-L2547)

限制直调与不同 presentation 的 fallback。

<details>
<summary>查看原文（57行）</summary>

```text
  function installBrokerRuntime() {
    const approvedParents = new Set();
    // DSH 0.2 batch dispatch carries no parent token, so an in-flight broker
    // dispatch is tracked per agent for the duration of the nested call.
    const dispatchingAgents = new Map();
    // Harnesses that still hand the tool list to the waterfall report their
    // presentation there and may change it per assembly; harnesses that do not
    // are covered by the executor probe.
    const codePresentationAgents = new WeakSet();
    const warnedUnsupportedAgents = new WeakSet();
    const disposers = [];
    try {
      for (const definition of makeBrokerDefinitions(approvedParents, dispatchingAgents)) {
        disposers.push(ctx.tools.register(definition));
      }
      disposers.push(ctx.tools.guard((exec) => {
        if (!isMcpToolName(exec.name) || exec.agent === undefined) return undefined;
        if (exec.parent !== undefined && approvedParents.has(exec.parent)) return undefined;
        if ((dispatchingAgents.get(exec.agent) ?? 0) > 0) return undefined;
        if (codePresentationAgents.has(exec.agent) || isCodePresentationAgent(exec.agent)) return undefined;
        return `direct MCP tool "${exec.name}" is hidden while on-demand MCP tools are enabled; use mcp_execute_tool`;
      }));
      disposers.push(ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        // The route decides whether the deferLoading marker survives to the
        // provider: a model without toolUpdate support takes the core's
        // "immediately available tools" branch, which strips the marker after
        // this waterfall returns (issue #33). Fail safe to honoring on any
        // doubt; the verdict lives only for this assemble event.
        const markerHolds = await routeHonorsToolUpdate(context?.modelSelection);
        const assembled = await next();
        const agent = context.agent ?? context.scope;
        if (!agent || (typeof agent !== 'object' && typeof agent !== 'function')) return assembled;
        // Custom prompt contributions may omit/empty the SDK section. The
        // reserved transport still signals code presentation; filtering only
        // assembly.tools would leave its registry-backed bindings callable but
        // make our native-only guard reject their MCP sub-dispatches.
        const hasCodeSdk = assembled.sections?.some((section) => section.name === 'tools:sdk' && section.text.trim() !== '') === true;
        const hasCodeTransport = Array.isArray(assembled?.tools) && assembled.tools.some((tool) => tool.name === 'run_code');
        if (hasCodeSdk || hasCodeTransport || isCodePresentationAgent(agent)) {
          codePresentationAgents.add(agent);
          syncAgentShadows(agent, false);
          if (!warnedUnsupportedAgents.has(agent)) {
            warnedUnsupportedAgents.add(agent);
            ctx.logger.warn('mcp-manager: on-demand MCP tools require native presentation; keeping the full MCP tool surface for a code/PTC/both agent');
          }
          return assembled;
        }
        codePresentationAgents.delete(agent);
        // Shadows only exist for native agents on routes whose model strips the
        // marker; a honoring verdict (or a flip back) clears the agent's row.
        await syncAgentShadows(agent, directMcpToolsDeferred() && !markerHolds);
        // DSH >= 0.2.2 assembles the model-facing tool list from the registry
        // after this waterfall and never passes `tools` in: `deferLoading` hides
        // direct MCP tools there, so this filter only serves 0.2.1 and older.
        if (!Array.isArray(assembled?.tools)) return assembled;
        return { ...assembled, tools: assembled.tools.filter((tool) => !isMcpToolName(tool.name)) };
      }, { prepend: true, global: true }));
```

</details>

#### 缺口

- 同版本各 host route 的最终发送载荷未查，stub 的 token 节省与误选率未知。
  **影响**：不能预先承诺统一三工具模式、固定 token 节省或保安隔离。
  **进一步探讨**：捕获同一工具集在已支持 native、不支持 native 和 code 三路请求的实际 schema 字节与调用结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在不牺牲可复核授权的前提下试验，费用如何计？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

GUI API 走宿主 connection 的拒绝判断，服务缺席返回 503。OAuth GET 回调持合法 pending state 时可以绕过普通浏览用户判断，回调仍校验 server、code 与状态。状态文件以 0600 临时文件写明文 JSON 并 fsync 后移到目标，这说明本机凭据仍需靠系统权限保护。断开、清供给、OAuth 重新授权、错误时的恢复都要计入工作量。

适合先观察按需压缩与会话划分的用户，可隔离测试实现只读计数的本地工具，不上传真实凭据。对照直接注册，在 native 记录同一任务的 schema 字节、描述与调用次数、错选率、账单与人时。假设是大 catalog 请求体减少后，额外发现往返仍比直接高载荷更划算。若成功率降低、路由保留全量配置或发生跨会话可见，就不支持。随后可在独立授权的账号与已核实的 provider 检查回调、refresh 和退出，不能把 fixture 结果等成第三方可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4393-4428](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L4393-L4428)

普通管理鉴权与有 state 的回调例外。

<details>
<summary>查看原文（36行）</summary>

```text
      // started this authorization — is the admission credential. A GET on the
      // exact callback path whose state matches `pending` proceeds to the
      // normal callback logic below; everything else meets the gate.
      const cbAskMatch = req.method === 'GET' ? path.match(/^\/mcp-manager\/callback\/([A-Za-z0-9_-]+)$/) : null;
      const cbAskState = url.searchParams.get('state');
      const cbAdmitted = cbAskMatch !== null && cbAskState !== null && cbAskState !== ''
        && pending.get(cbAskMatch[1])?.state === cbAskState;
      // Admission gate (issue #31). The DSH login token protects the native
      // page but nothing else reaches a plugin-registered prefix route, so the
      // admin surface funnels through the composition's `connection` service
      // here: it applies the Host/Origin fence (403) and requires a live DSH
      // session (401). Fail closed with 503 when the service is absent — never
      // fall back to anonymous access.
      const connection = ctx.get?.('connection');
      const rejection = cbAdmitted ? undefined
        : typeof connection?.requestRejection === 'function' ? connection.requestRejection(req) : 503;
      if (rejection !== undefined) {
        return json(res, rejection, { error: 'DSH authentication required' });
      }
      const origin = browserOrigin(req);
      try {
        // OAuth redirect: /mcp-manager/callback/:id
        const cbMatch = path.match(/^\/mcp-manager\/callback\/([A-Za-z0-9_-]+)$/);
        if (cbMatch && req.method === 'GET') {
          const found = findServerById(cbMatch[1]);
          const server = found?.server;
          const code = url.searchParams.get('code');
          const flowState = url.searchParams.get('state');
          const oauthError = url.searchParams.get('error');
          const done = (ok, message) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;padding:40px"><h2>${ok ? '✅ Authorized' : '❌ Authorization failed'}</h2><p>${escapeHtml(message)}</p><p><a href="/">Back to DSH</a></p></body>`);
          };
          if (!server) return done(false, 'No MCP server config matches this callback');
          if (oauthError) { setServerAuthStatus(server, 'needs-auth', oauthError); return done(false, `Server returned: ${oauthError}`); }
          if (!code || pending.get(server.id)?.state !== flowState) { setServerAuthStatus(server, 'needs-auth', 'session expired'); return done(false, 'Authorization session expired or invalid — start again from Settings → MCP'); }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:126-145](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L126-L145)

令牌状态以用户权限受限的明文 JSON 写入。

<details>
<summary>查看原文（20行）</summary>

```text
  // token file empty or half-written. The temp file is created 0600 in the
  // same directory (same filesystem), fsynced, then renamed over the target.
  const dir = dirname(STATE_PATH);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tmp = `${STATE_PATH}.${process.pid}.${randomBytes(12).toString('hex')}.tmp`;
  let fd;
  try {
    fd = openSync(tmp, 'wx', 0o600);
    writeFileSync(fd, JSON.stringify(state, null, 2));
    fsyncSync(fd);
    closeSync(fd);
    fd = undefined;
    renameSync(tmp, STATE_PATH);
    try {
      const dfd = openSync(dir, 'r');
      try { fsyncSync(dfd); } finally { closeSync(dfd); }
    } catch {}
  } catch (error) {
    if (fd !== undefined) { try { closeSync(fd); } catch {} }
    try { unlinkSync(tmp); } catch {}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2513-2547](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/lib/index.js#L2513-L2547)

Native 与 code 路由决定实验分层。

<details>
<summary>查看原文（35行）</summary>

```text
      disposers.push(ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
        // The route decides whether the deferLoading marker survives to the
        // provider: a model without toolUpdate support takes the core's
        // "immediately available tools" branch, which strips the marker after
        // this waterfall returns (issue #33). Fail safe to honoring on any
        // doubt; the verdict lives only for this assemble event.
        const markerHolds = await routeHonorsToolUpdate(context?.modelSelection);
        const assembled = await next();
        const agent = context.agent ?? context.scope;
        if (!agent || (typeof agent !== 'object' && typeof agent !== 'function')) return assembled;
        // Custom prompt contributions may omit/empty the SDK section. The
        // reserved transport still signals code presentation; filtering only
        // assembly.tools would leave its registry-backed bindings callable but
        // make our native-only guard reject their MCP sub-dispatches.
        const hasCodeSdk = assembled.sections?.some((section) => section.name === 'tools:sdk' && section.text.trim() !== '') === true;
        const hasCodeTransport = Array.isArray(assembled?.tools) && assembled.tools.some((tool) => tool.name === 'run_code');
        if (hasCodeSdk || hasCodeTransport || isCodePresentationAgent(agent)) {
          codePresentationAgents.add(agent);
          syncAgentShadows(agent, false);
          if (!warnedUnsupportedAgents.has(agent)) {
            warnedUnsupportedAgents.add(agent);
            ctx.logger.warn('mcp-manager: on-demand MCP tools require native presentation; keeping the full MCP tool surface for a code/PTC/both agent');
          }
          return assembled;
        }
        codePresentationAgents.delete(agent);
        // Shadows only exist for native agents on routes whose model strips the
        // marker; a honoring verdict (or a flip back) clears the agent's row.
        await syncAgentShadows(agent, directMcpToolsDeferred() && !markerHolds);
        // DSH >= 0.2.2 assembles the model-facing tool list from the registry
        // after this waterfall and never passes `tools` in: `deferLoading` hides
        // direct MCP tools there, so this filter only serves 0.2.1 and older.
        if (!Array.isArray(assembled?.tools)) return assembled;
        return { ...assembled, tools: assembled.tools.filter((tool) => !isMcpToolName(tool.name)) };
      }, { prepend: true, global: true }));
```

</details>

**依据 4 · 作者声明**：[README.md:294-303](https://github.com/hyqhyq3/dsh-mcp-manager/blob/a2a2a936c42035a52656b8f8e625b871399b48eb/README.md#L294-L303)

作者给出的明文、启动方式、认证和工具能力边界。

<details>
<summary>查看原文（10行）</summary>

```text
## Limitations

- `resources` and `prompts` MCP capabilities are not bridged (tools only).
- On-demand filtering targets `native` presentation. Code/PTC/both agents keep the full session-visible MCP catalog; their presentation is read from the executor's prompt sections (and, on harnesses that still supply one, from the waterfall payload). Exported SDK renderers provide no presentation-only catalog contract; see the [interface evidence and fallbacks](docs/on-demand-code-mode.md). Full SDK compression remains open in [#18](https://github.com/hyqhyq3/dsh-mcp-manager/issues/18).
- On DSH ≤ 0.2.2-rc.1, on-demand filtering only collapses the schemas on routes whose model catalog declares `toolUpdate` (deepseek-official). Providers without `toolUpdate` (an `llm-pi-ai` backend with `api: openai-completions` is the common case) take the core's "immediately available tools" branch, which strips the `deferLoading` marker after the plugin returns, so the full `mcp__*` schemas would reach the provider every request. Since v0.17.0 the plugin mitigates this itself: on such a route each native agent gets **per-agent shadow stubs** — same `mcp__<server>__<tool>` names with a short pointer description and an empty arguments schema registered in the agent's own tool scope — so the request payload collapses to the broker's three tools plus the stubs instead of the full schemas (the [#33](https://github.com/hyqhyq3/dsh-mcp-manager/issues/33) report measured 82k tokens for 197 tools), while `mcp_search_tools`/`mcp_describe_tool` keep serving the full schemas from the plugin-owned registration store. Honoring routes (deepseek-official), code/PTC/both agents, and any model-route resolution failure keep the previous full-surface behavior; the upstream core fix (preserve or honor the `deferLoading` marker per adapter) remains the right final state per the issue thread.
- OAuth tokens live in a plain JSON file under `~/.dsh` — treat the file as a secret. Static bearer tokens and `headerEnv` values are read from environment variables and never persisted. Workspace OAuth tokens live in the same state file, never in the workspace's `mcp.json`.
- stdio servers run as long-lived child processes tied to the plugin lifecycle. On POSIX `args` are whitespace-tokenized (quotes protect args with spaces) with no shell expansion; on Windows the command line is passed to `cmd.exe`, so shell metacharacters (`&`, `|`, `>`, `%VAR%`) are interpreted — the command and any argument containing whitespace are quoted automatically (already-quoted values are left as-is), but prefer absolute paths.
- One OAuth client registration per server per GUI origin; moving the GUI to a new origin re-registers automatically on the next login, and changing the configured **Client name** re-registers with the new name (the old client's tokens are dropped, so a re-authorization is required). A manually configured Client ID is never re-registered — its redirect URI must already be whitelisted with the provider, so a GUI origin change shows up as a provider-side redirect error rather than an automatic fix.
- Attempt logs are in-memory on the host: they survive a browser refresh but not a DSH restart, and they are capped at 20 entries per server. The durable record remains the DSH server log (`ctx.logger`); the plugin deliberately writes no log file.
- The manual OAuth fields are validated but not proven against a live provider here — `client_secret_post` is the only supported client authentication method (no `client_secret_basic`). Some providers (Meta, Figma) gate dynamic registration on a `client_name` allowlist; setting **Client name** is the supported path, but the plugin deliberately does not ship another product's name as a default. A registration-issued `client_secret` is stored in `~/.dsh/mcp-manager.json` (0600) like the tokens; it is never returned by the API or written to a log, and it is presented only by a registration that asked for `client_secret_post` — never with a manual Client ID.
```

</details>

#### 缺口

- 远端 OAuth 授权兼容、复连、账单和采用收益未知。
  **影响**：没有足够理由直接迁移生产配置。
  **进一步探讨**：模拟服务先核对权限和真实传输，再在许可范围用沙盒 OAuth 验证。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
