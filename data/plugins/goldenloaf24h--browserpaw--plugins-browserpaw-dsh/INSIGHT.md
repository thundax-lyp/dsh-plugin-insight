# BrowserPaw DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d8b4834](https://github.com/GoldenLoaf24h/browserpaw/tree/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GoldenLoaf24h/browserpaw)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中注册 BrowserPaw 技能，并按需连接本地 MCP 浏览器自动化桥。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将本地桥连接做成显式的工具生命周期。

> **主要限制**：[Q03](#research-q03) 插件实例只维护一个连接状态，active 无法证明单会话隔离或工具健康。

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
  - [Q01 · 何时需要按需桥接？](#detail-section-11)
  - [Q02 · open 和 close 怎样处理竞争？](#detail-section-12)
  - [Q03 · active 和 close 的作用域是什么？](#detail-section-13)
  - [Q04 · 如何安全地试一个最小任务？](#detail-section-14)
  - [Q05 · 按调用会话计数能否减少互相关闭？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偶尔访问网页的 DSH 使用者可按需开启工具，并在任务结束后核对关闭。

长期挂载 MCP 或在浏览器手工核对公开网页。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工具会话 | 按需连接和释放浏览器工具 | 需本地桥与 token，实例共享连接状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与内置 MCP client | 必需 | 加载子包及连接 | 停止连接 |
| 本机 BrowserPaw 与 token | 必需 | 验证回环桥 | 检查本机服务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离浏览器配置并启动桥 | 确认授权公开页面 |
| 使用 | open 后执行只读操作 | 工具列表和结果匹配 |
| 退出 | close 后检查工具和桥状态 | 失败时停用并核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和本机桥资源 | 安装子包与验证授权 | 耗时未知 |
| 持续 | 连接与模型资源 | 按需开关、核对 | 上下文节省未测 |
| 失败 | 本机桥仍可存活 | 检查状态、重试关闭 | 恢复负担未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按需接入 | 有串行生命周期 | 多会话隔离 |
| 失败反馈 | 启动和显式释放错误可见 | 卸载后真实残留 |

> **思考**：[Q03](#research-q03) 插件实例只维护一个连接状态，active 无法证明单会话隔离或工具健康。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将本地桥连接做成显式的工具生命周期。

[Q02](#research-q02) 串行化连接转换并保留失败状态；[Q03](#research-q03) 连接与调用者未绑定。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 插件实例只维护一个连接状态，active 无法证明单会话隔离或工具健康。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用隔离配置和公开页面，关闭后读回工具表及桥状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查 DSH 子包桥接代码。原生浏览器端、真实宿主和隔离未运行。

- 已检查：作者 README、包清单、源码路径 plugins/browserpaw-dsh/index.js、plugins/browserpaw-dsh/README.md、plugins/browserpaw-dsh/package.json 及固定范围 inventory；组件：plugins/browserpaw-dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅 plugins/browserpaw-dsh 子包及作者说明。未审核整个浏览器扩展或 MCP 服务的执行安全。
- 下一步：同版本宿主核查单会话及两会话开关、连接故障与卸载。

**分析版本**

- **仓库**：[GoldenLoaf24h/browserpaw](https://github.com/GoldenLoaf24h/browserpaw)
- **版本号**：4.1.2（[固定提交 d8b4834](https://github.com/GoldenLoaf24h/browserpaw/tree/d8b48343d173031b0f2d92cb9993cd2457956062)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 以会话绑定桥接租约可能减少并发使用时的相互关闭。

同版本宿主核查单会话及两会话开关、连接故障与卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 171 | 122 | 35 | — |
| .md | source | 11 | 779 | — | — | 8451 |
| .mjs | source | 1 | 461 | 395 | 49 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/GoldenLoaf24h/browserpaw/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：偶尔执行浏览器任务的 DSH 用户能否按需接入本地 BrowserPaw 并核实卸载工具？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时需要按需桥接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户偶尔在 DSH 中核对公开网页，平时不希望整套浏览器工具常驻。常驻 MCP 与手工浏览器都是替代。子包保留使用技能，用 open/close 管理本地 MCP 连接，降低长期暴露工具的需要；合格结果还要看到工具确已卸载及浏览器状态符合预期。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/browserpaw-dsh/README.md:1-3](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/README.md#L1-L3)

作者描述子包桥接。

```text
# dsh-browserpaw

DeepSeek Harness bundle for [BrowserPaw](https://github.com/GoldenLoaf24h/browserpaw). It registers the `browserpaw` skill and `browserpaw_session` tool, then connects that session to the local BrowserPaw MCP bridge.
```

**依据 2 · 源码核查**：[plugins/browserpaw-dsh/index.js:54-70](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L54-L70)

持续注册技能与动态工具命名。

<details>
<summary>查看原文（17行）</summary>

```text
  const toolNamingNote =
    `> **DSH tool names**: DSH exposes every BrowserPaw tool as \`mcp__${SERVER_NAME}__<raw name>\`, ` +
    `and the MCP client passes each raw name through unchanged — so the \`chrome_*\`, ` +
    `\`performance_*\` and \`get_windows_and_tabs\` names used below are callable as ` +
    `\`mcp__${SERVER_NAME}__chrome_<name>\`, \`mcp__${SERVER_NAME}__performance_<name>\` and ` +
    `\`mcp__${SERVER_NAME}__get_windows_and_tabs\`. Open the tool set first with ` +
    `\`browserpaw_session\` (\`action: "open"\`). The active tool profile announces only a ` +
    `subset of these names. On clients that handle the standard list-changed notification, ` +
    `call \`mcp__${SERVER_NAME}__chrome_tool_docs\` with \`activateForSession: true\` to ` +
    `widen the visible set; otherwise restart with \`CHROME_MCP_TOOL_PROFILE=full\`.`;
  ctx.skills.register({
    name: SERVER_NAME,
    source: 'runtime',
    description:
      'BrowserPaw 浏览器自动化操作技能：执行阶梯、工具选择表、状态机与失败恢复。使用前先调用 browserpaw_session 开启工具集。',
    content: `${toolNamingNote}\n\n${skillContent}`,
    resourceBase: { kind: 'directory', path: skillDir },
```

</details>

**依据 3 · 源码核查**：[plugins/browserpaw-dsh/index.js:132-160](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L132-L160)

状态工具提供开关与 active。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register({
    name: 'browserpaw_session',
    description:
      '开启/关闭/查看 BrowserPaw 浏览器自动化工具集。action: open | close | status。open 后工具以 mcp__browserpaw__ 前缀出现；用完后务必 close 释放上下文。',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['open', 'close', 'status'], description: '操作类型' },
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    async execute(args) {
      const action = args?.action ?? 'status';
      if (action === 'open') {
        await open();
        return { ok: true, action, note: 'browserpaw 工具已注入，调用后请 close' };
      }
      if (action === 'close') {
        await close();
        return { ok: true, action, note: 'browserpaw 工具已卸载' };
      }
      return {
        ok: true,
        action,
        active: session !== null,
      };
```

</details>

#### 缺口

- 工具数与上下文用量的真实变化未测。
  **影响**：不能推断节省多少模型资源。
  **进一步探讨**：在固定宿主对照打开和关闭的工具表及请求用量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · open 和 close 怎样处理竞争？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

状态转换以 Promise 链串行。open 找本地 token，经宿主 loader 解析 MCP 客户端，连接回环并让启动错误直接失败，成功才设置 session。close 先释放 fork，成功后才清状态，释放失败可重试。卸载经相同 close 入队。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/browserpaw-dsh/index.js:81-119](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L81-L119)

串行、令牌、启动和本地地址。

<details>
<summary>查看原文（39行）</summary>

```text
  let transitions = Promise.resolve();

  function serialize(transition) {
    const run = transitions.then(transition);
    transitions = run.then(
      () => {},
      () => {},
    );
    return run;
  }

  async function open() {
    return serialize(async () => {
      if (session) return;
      const token = resolveBridgeToken();
      if (!token) {
        throw new Error(
          'BrowserPaw bridge token not found. Start the native host or set CHROME_MCP_TOKEN.',
        );
      }
      // Cordis rejects a bare specifier here: it needs a function or an object carrying
      // `apply`, which is exactly what the loader resolves the specifier to.
      const client = await ctx.loader.import(MCP_CLIENT_SPECIFIER);
      // `failOnStartupError` defaults to false, which makes the client swallow a failed first
      // connection and retry in the background. open() would then report success while no tool
      // exists, so a caller that trusts the result calls a name that was never registered. Turn
      // the failure into a rejection: the bridge either answers now or open() fails loudly.
      const fork = await ctx.plugin(client, {
        serverName: SERVER_NAME,
        transport: 'streamable-http',
        url: `http://127.0.0.1:${resolveServerPort()}/mcp`,
        headers: { 'x-mcp-token': token },
        failOnStartupError: true,
      });
      session = {
        fork,
        startedAt: Date.now(),
      };
    });
```

</details>

**依据 2 · 源码核查**：[plugins/browserpaw-dsh/index.js:122-129](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L122-L129)

保留失败的连接记录。

```text
  async function close() {
    return serialize(async () => {
      if (!session) return;
      // Retain the session until disposal succeeds so status stays honest and a
      // failed close can be retried without allowing a second transport to open.
      await session.fork.dispose();
      session = null;
    });
```

**依据 3 · 源码核查**：[plugins/browserpaw-dsh/index.js:164-169](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L164-L169)

卸载同一转换链。

```text
  ctx.effect(
    () => () =>
      // Route unload through close() so it queues behind any in-flight open instead of
      // observing an empty session and leaving that fork connected after the plugin is gone.
      close().catch(() => {}),
    'browserpaw-session.dispose',
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · active 和 close 的作用域是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

session 存在 apply 作用域中，工具执行未使用调用 Agent 或会话 ID，多个调用者可能共享同一个 fork。active 只报告对象是否存在，无法确认浏览器健康或各会话独占。显式 close 若释放失败会报错，卸载路径捕获后不转述错误。已执行网页副作用不能因断开而假定撤回。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/browserpaw-dsh/index.js:73-94](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L73-L94)

一个实例一份连接状态。

<details>
<summary>查看原文（22行）</summary>

```text
  let session = null;

  // Open and close transitions are serialized. `ctx.plugin` cannot be cancelled once it has
  // started, so a concurrent open would fork a second transport that nothing tracks, and a
  // close (or plugin unload) landing while an open is still awaiting would see no session,
  // return as a no-op, and let the connection reappear afterwards. Serializing makes each
  // transition observe the settled result of the previous one, so close can dispose the
  // fork created by an in-flight open.
  let transitions = Promise.resolve();

  function serialize(transition) {
    const run = transitions.then(transition);
    transitions = run.then(
      () => {},
      () => {},
    );
    return run;
  }

  async function open() {
    return serialize(async () => {
      if (session) return;
```

</details>

**依据 2 · 源码核查**：[plugins/browserpaw-dsh/index.js:146-169](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L146-L169)

工具不读取调用者身份，卸载捕获错误。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args) {
      const action = args?.action ?? 'status';
      if (action === 'open') {
        await open();
        return { ok: true, action, note: 'browserpaw 工具已注入，调用后请 close' };
      }
      if (action === 'close') {
        await close();
        return { ok: true, action, note: 'browserpaw 工具已卸载' };
      }
      return {
        ok: true,
        action,
        active: session !== null,
      };
    },
  });

  ctx.effect(
    () => () =>
      // Route unload through close() so it queues behind any in-flight open instead of
      // observing an empty session and leaving that fork connected after the plugin is gone.
      close().catch(() => {}),
    'browserpaw-session.dispose',
```

</details>

**依据 3 · 源码核查**：[plugins/browserpaw-dsh/README.md:49-62](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/README.md#L49-L62)

作者区分历史验证与当前宿主边界。

<details>
<summary>查看原文（14行）</summary>

```text
## Host-Level Validation

On 2026-10-18 the plugin was exercised end to end against a real DeepSeek Harness `0.2.1-rc.1` runtime launched in an isolated DSH profile whose bundle list contains `dsh-browserpaw` as a linked dependency. That run established:

- The package loads as a profile layer rather than as a plain dependency, so its `cordis.patch.yml` applies and `apply()` executes.
- The `browserpaw` skill registers through the runtime provider.
- The `browserpaw_session` tool registers.
- `action: "open"` connects to the live bridge at `http://127.0.0.1:12306/mcp` and injects the MCP tools; `action: "close"` unloads them.

The native host and `~/.chrome-mcp/bridge-token` were both in place for that run.

**Boundary**: the `desktop` profile is owned exclusively by the Electron host and was not exercised. The 0.2.1-rc.1 bridge result above is historical; a fresh live headless model session against the current package was not completed. Current validation establishes packaging, installation, configuration, and component contracts, not live current-runtime tool execution.

**Tool-profile boundary**: the native host announces its `core` profile by default, while the bundled skill body references the wider canonical set. `chrome_tool_docs` with `activateForSession: true` widens the server-side list, and BrowserPaw advertises `tools.listChanged` and forwards the notification through its bridge. Clients that implement the standard refresh can observe the new list; clients that cannot should run with `CHROME_MCP_TOOL_PROFILE=full`.
```

</details>

#### 缺口

- 未核查宿主对工具可见性及失败 fork 的实际处理。
  **影响**：不能保证关闭仅影响一个调用方。
  **进一步探讨**：隔离宿主两会话交错 open 和 close，检查工具表与 bridge。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何安全地试一个最小任务？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、正确子包、原生 BrowserPaw bridge 和本机 token。使用独立浏览器配置和公开页面测试只读访问，读回工具列表和状态后再退出。若工具未出现、close 报错或不同会话互相影响，暂停访问并在宿主核查桥接，再用手工浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/browserpaw-dsh/package.json:37-51](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/package.json#L37-L51)

宿主范围和可选 MCP peer。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-mcp-client": ">=0.2.0-rc.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-mcp-client": {
      "optional": true
    }
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[plugins/browserpaw-dsh/README.md:25-37](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/README.md#L25-L37)

作者说明安装和本机桥条件。

<details>
<summary>查看原文（13行）</summary>

```text
`--profile` is mandatory, and the command initializes the profile when it does not exist yet. The `desktop` profile is owned by the Electron host: a standalone npm `dsh` refuses it with `profile "desktop" is managed exclusively by the Electron application`, so use the Desktop CLI shim (`<DSH_INSTALL>/resources/runtime/cli/bin/dsh.cmd` on Windows) or the Plugins panel for that profile. `dsh plugin` installs through pnpm and therefore needs registry and `codeload.github.com` access.

The installer reads this package's `dsh.bundle.patch`, so it registers itself as a profile
bundle layer on the way in — no manifest editing, no separate mount line. Restart the host
afterwards; both the `browserpaw` skill and the `browserpaw_session` tool appear once
`apply()` has run.

Verify the layer registered before restarting: `dsh --profile <PROFILE> --dump-config` shows a
`# == dsh-browserpaw` layer header followed by its inserted `browserpaw-skill` entry.

BrowserPaw itself must be running: the native server listens on `127.0.0.1:12306` and writes
`~/.chrome-mcp/bridge-token`, and the plugin needs both before `open` can connect. Install
BrowserPaw first if `browserpaw_session { action: "open" }` reports a missing bridge token.
```

</details>

**依据 3 · 源码核查**：[plugins/browserpaw-dsh/index.js:95-114](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L95-L114)

本地令牌和连接参数。

<details>
<summary>查看原文（20行）</summary>

```text
      const token = resolveBridgeToken();
      if (!token) {
        throw new Error(
          'BrowserPaw bridge token not found. Start the native host or set CHROME_MCP_TOKEN.',
        );
      }
      // Cordis rejects a bare specifier here: it needs a function or an object carrying
      // `apply`, which is exactly what the loader resolves the specifier to.
      const client = await ctx.loader.import(MCP_CLIENT_SPECIFIER);
      // `failOnStartupError` defaults to false, which makes the client swallow a failed first
      // connection and retry in the background. open() would then report success while no tool
      // exists, so a caller that trusts the result calls a name that was never registered. Turn
      // the failure into a rejection: the bridge either answers now or open() fails loudly.
      const fork = await ctx.plugin(client, {
        serverName: SERVER_NAME,
        transport: 'streamable-http',
        url: `http://127.0.0.1:${resolveServerPort()}/mcp`,
        headers: { 'x-mcp-token': token },
        failOnStartupError: true,
      });
```

</details>

#### 缺口

- 真实连接、退出和桌面兼容未运行。
  **影响**：部署与维护代价未测。
  **进一步探讨**：隔离 profile 验证 open、读取公开页、close 和故障恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按调用会话计数能否减少互相关闭？

**研究主题**：新假设与验证

#### 完整回答

可试验把桥接租约绑定调用会话，同时共享受控物理连接，仅最后一个退出时释放。它需要宿主能可靠识别会话和清理已失活租约。用两会话交错、异常退出和卸载比较工具暴露、残留连接及恢复时间。若用户只单会话且新租约增加故障，方案没有足够增量。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/browserpaw-dsh/index.js:81-129](https://github.com/GoldenLoaf24h/browserpaw/blob/d8b48343d173031b0f2d92cb9993cd2457956062/plugins/browserpaw-dsh/index.js#L81-L129)

当前使用单状态与串行转换。

<details>
<summary>查看原文（49行）</summary>

```text
  let transitions = Promise.resolve();

  function serialize(transition) {
    const run = transitions.then(transition);
    transitions = run.then(
      () => {},
      () => {},
    );
    return run;
  }

  async function open() {
    return serialize(async () => {
      if (session) return;
      const token = resolveBridgeToken();
      if (!token) {
        throw new Error(
          'BrowserPaw bridge token not found. Start the native host or set CHROME_MCP_TOKEN.',
        );
      }
      // Cordis rejects a bare specifier here: it needs a function or an object carrying
      // `apply`, which is exactly what the loader resolves the specifier to.
      const client = await ctx.loader.import(MCP_CLIENT_SPECIFIER);
      // `failOnStartupError` defaults to false, which makes the client swallow a failed first
      // connection and retry in the background. open() would then report success while no tool
      // exists, so a caller that trusts the result calls a name that was never registered. Turn
      // the failure into a rejection: the bridge either answers now or open() fails loudly.
      const fork = await ctx.plugin(client, {
        serverName: SERVER_NAME,
        transport: 'streamable-http',
        url: `http://127.0.0.1:${resolveServerPort()}/mcp`,
        headers: { 'x-mcp-token': token },
        failOnStartupError: true,
      });
      session = {
        fork,
        startedAt: Date.now(),
      };
    });
  }

  async function close() {
    return serialize(async () => {
      if (!session) return;
      // Retain the session until disposal succeeds so status stays honest and a
      // failed close can be retried without allowing a second transport to open.
      await session.fork.dispose();
      session = null;
    });
```

</details>

#### 缺口

- 租约方案未实现。
  **影响**：实际收益和残留未知。
  **进一步探讨**：在隔离宿主对照多会话竞争。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
