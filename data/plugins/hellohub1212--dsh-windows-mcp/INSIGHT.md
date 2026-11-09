# dsh-windows-mcp

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[dc1308f](https://github.com/helloHub1212/dsh-windows-mcp/tree/dc1308fa2cd14f3040764f37f2bd2099f74a9720)

<!-- BEGIN META -->
[![GitHub ★ 224](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=224&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/helloHub1212/dsh-windows-mcp) [![npm 30d 716,731](https://img.shields.io/static/v1?label=npm+30d&message=716%2C731&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp)
<!-- END META -->

> **功能**：把 Windows-MCP 接到 DSH 内置 MCP 桥接，并提供桌面开关、诊断和依赖管理。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 根插件把依赖选择、工具诊断和宿主调用开关接入 DSH，减少手写配置。实际屏幕和输入工具由 Windows-MCP 经宿主 MCP 桥接提供。

> **主要限制**：[Q03](#research-q03) Computer Use 是宿主共享状态。派发拒绝依赖 tools.guard，浏览器鉴权不可观测时插件层会继续处理修改。关闭无法据此证明已派发动作撤销，揭示也无法约束为只读。

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
  - [Q01 · 哪类 Windows 操作需要该 DSH 接入，包本身提供什么？](#detail-section-11)
  - [Q02 · 依赖与开关如何使截图工具可调用？](#detail-section-12)
  - [Q03 · 开关、渐进揭示和操作权限怎样区分？](#detail-section-13)
  - [Q04 · Windows、工具链、镜像与退出由谁管理？](#detail-section-14)
  - [Q05 · 怎样验收只观察试用与退出开关？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 Windows 隔离测试桌面中重复读取原生应用界面的 DSH 用户，需要可核对的画面、明确的工具暴露和可验证的停用结果。[Q01](#research-q01)

偶发任务可手工截图和核对。已有相容 DSH MCP 桥接的管理员可直接管理配置、上游进程与工具暴露。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Windows-MCP 桥接 | 通过 MCP 接入截图、输入等 | 需真实 Windows-MCP 和兼容 DSH |
| Computer Use | 共享工具派发开关 | 取决于守卫安装，关闭不取消已接受动作 |
| 揭示与诊断 | 减少模型工具上下文并定位缺失 | 按 Agent，匿名有共享后备 |
| 版本管理 | 安装、激活和回退 | 需 uv 与 profile 清晰，重启后检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows 与有官方桥接的 DSH | 桌面接入需要 | 运行实际服务 | 桥接不可验收 |
| uv 与可访问安装源 | GUI 托管安装需要 | 安装特定 Windows-MCP | 保持桥接关闭 |
| BrowserAuth 与 tools.guard | 受控验收需要 | 保护修改与派发 | 停用桥接 |
| 图像输入模型和附件准入 | 让 Agent 看到截图需要 | 处理 MCP 图像 | 核对诊断或人工读取 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 建立隔离 | 操作者准备低权限 Windows VM 和独立 profile | 可恢复、无业务数据 |
| 确认运行 | 核对实际 Host 鉴权、守卫和固定工具链 | 关闭时直接派发被拒 |
| 只观察 | 在隔离条件内揭示 Screenshot 并核对模型结果 | 另一个 Agent 和关闭状态符合预期 |
| 退出 | 停用桥接、核对在途动作和重启状态 | 失败时回到手工截图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Windows VM、工具链和网络 | 配置依赖、profile 和宿主权限 | 实测启动时间未知 |
| 持续 | 截图模型、网络及多版本存储 | 控制授权和核对工具 | 实际费用、触达未知 |
| 失败恢复 | 日志和 profile 副本 | 查版本档与有效启动行 | 部分写入需独立核对 |
| 退出 | 备份及必要验证环境 | 停用、核对在途和重启，清理测试环境 | 应用开关不终止进程 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 截图及工具桥接 | 配置官方 MCP 客户端和 Windows-MCP | 实际截图可读性与桌面操作 |
| 权限和上下文 | 提示过滤、派发守卫与按需揭示 | 真实宿主组合是否生效 |
| 依赖管理 | 多版本安装、切换和回退路径 | 部分失败的现场恢复 |

> **思考**：[Q03](#research-q03) Computer Use 是宿主共享状态。派发拒绝依赖 tools.guard，浏览器鉴权不可观测时插件层会继续处理修改。关闭无法据此证明已派发动作撤销，揭示也无法约束为只读。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 根插件把依赖选择、工具诊断和宿主调用开关接入 DSH，减少手写配置。实际屏幕和输入工具由 Windows-MCP 经宿主 MCP 桥接提供。

[Q02](#research-q02) 根包挂载官方 MCP 客户端并从 profile 启动独立 Windows-MCP。[Q03](#research-q03) 提示过滤、派发守卫、共享开关和版本状态各有独立失败边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Computer Use 是宿主共享状态。派发拒绝依赖 tools.guard，浏览器鉴权不可观测时插件层会继续处理修改。关闭无法据此证明已派发动作撤销，揭示也无法约束为只读。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察，先在无业务数据的 Windows VM 验收鉴权、tools.guard、双 Agent 及关闭后派发。不能确认则停用桥接、核对在途效果并回到人工截图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持根插件、桥接配置和两层工具过滤。真实宿主 BrowserAuth、派发守卫及执行中的关闭效果未验收。作者的测试记录与本次源码观察分开。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/updater.js、lib/dependency.js、lib/client.js、lib/settings.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次源码研究，固定根插件、宿主桥接配置和 Windows-MCP 启动接线。未审计上游实现，未运行 Windows、DSH、安装程序或工具。
- 下一步：[Q05](#research-q05) 低权限隔离 Windows VM 留下无 cookie 拒绝、两 Agent 的开关与揭示、只读截图、关闭后派发和重启日志。以长调用复查在途效果。

**分析版本**

- **仓库**：[helloHub1212/dsh-windows-mcp](https://github.com/helloHub1212/dsh-windows-mcp)
- **版本号**：0.2.4（[固定提交 dc1308f](https://github.com/helloHub1212/dsh-windows-mcp/tree/dc1308fa2cd14f3040764f37f2bd2099f74a9720)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 默认拒绝不可观测的鉴权，并在隔离环境引入限时观察许可，可能减少误开放桌面控制。用两个会话和长调用区分后续拒绝及在途效果。

[Q05](#research-q05) 低权限隔离 Windows VM 留下无 cookie 拒绝、两 Agent 的开关与揭示、只读截图、关闭后派发和重启日志。以长调用复查在途效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 969 | — | — | 11039 |
| .js | source | 8 | 4818 | 3863 | 696 | — |
| .mjs | source | 4 | 382 | 296 | 53 | — |
| .mjs | test | 3 | 1617 | 1339 | 120 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/helloHub1212/dsh-windows-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 用户怎样让 DSH 借宿主桥接观察测试桌面，哪些默认关闭、跨会话开关、工具暴露和版本条件会改变试用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类 Windows 操作需要该 DSH 接入，包本身提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 Windows 测试桌面需要让 DSH 看到非浏览器界面并做后续受控操作时，可以用截图、快照或输入工具。只想读取偶发静态信息时，人工截图并核对文件比安装工具链更直接；管理员也可自己写一条兼容的宿主 MCP 行。根包接线到 DSH 自带 MCP client，实际操作来自 CursorTouch/Windows-MCP。包自己的增量是依赖和 profile 管理、诊断、Computer Use 开关和按需工具揭示。合格结果先是读取一张虚构测试画面，工具只在预期配置下提供，停用后不能再派发。作者报告 18 个工具和约 1.5 秒启动属于其 Windows 11 和特定 DSH Desktop 样本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-22](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/README.md#L8-L22)

作者描述分层接线和目标。

<details>
<summary>查看原文（15行）</summary>

````text
**Windows desktop automation for [DeepSeek Harness](https://github.com/sandbaseai/deepseek-harness-handbook)** — lets the DSH agent see your screen and drive your PC.

This plugin connects [CursorTouch/Windows-MCP](https://github.com/CursorTouch/Windows-MCP) to DSH by mounting one loader row against the **MCP client bridge that already ships inside DeepSeek Harness**. There is no reimplemented protocol client and no second copy of the MCP SDK: the plugin is a *carrier bundle*, and everything you can do comes from the official bridge.

```text
DSH agent
  └─ tool call  mcp__windows__Screenshot
       └─ @deepseek-ai/dsh-mcp-client        (in-box, mounted by this plugin's patch row)
            └─ uvx windows-mcp@0.8.8 serve   (stdio child process)
                 └─ your desktop: UIA tree, Win32 input, screen capture
```

## What it gives the agent

With the plugin installed and Windows-MCP reachable, these tools appear in the tool list:
````

</details>

**依据 2 · 作者声明**：[README.md:44-57](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/README.md#L44-L57)

作者声明开关、工具数、启动和版本试验。

<details>
<summary>查看原文（14行）</summary>

```text
The composer also gains a **Computer Use** pill, next to the permission control: it shows how many desktop tools are actually registered and remembers your choice across restarts (state file: `~/.dsh/dsh-windows-mcp.state.json`). It starts **off** — a fresh install never hands the agent your desktop until you switch the pill on yourself.

Switching it off is a hard switch, not a hint. The bridge keeps running, but from the next step on every `mcp__windows__*` tool is filtered out of the tool list the model sees, and a call that still names one is refused at dispatch — in every session and subagent, live, with no restart. Switch it back on and they return immediately; `windows_mcp_doctor` always reports which way it is set.

> **Verified:** Windows 11 + DSH Desktop 0.2.0-rc.2 — the bridged server advertises
> **18 tools** (the 21 upstream tools minus the three excluded here) and is ready
> about 1.5 s after launch. The bridge publishes each as `mcp__windows__<ToolName>`.

## Requirements

- **Windows 10/11.**
- **DeepSeek Harness Desktop** with the in-box `@deepseek-ai/dsh-mcp-client` bridge (0.2.0-rc.2 or newer).
- **[uv](https://docs.astral.sh/uv/)** on the `PATH` of the process that runs DSH — **Settings → Desktop** uses it to install Windows-MCP. DSH itself boots without it. `%USERPROFILE%\.local\bin` is searched even when it is not on `PATH`.
- **A model that accepts image input** if you want the agent to actually *see* screenshots.
```

</details>

**依据 3 · 源码核查**：[package.json:2-12](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/package.json#L2-L12)

根包、Web 客户端入口与版本。

<details>
<summary>查看原文（11行）</summary>

```text
  "name": "dsh-windows-mcp",
  "version": "0.2.4",
  "description": "Windows desktop automation for DeepSeek Harness — plugs CursorTouch/Windows-MCP (screenshot, UI automation, input, clipboard, processes, registry) into DSH through the official MCP client bridge.",
  "license": "MIT",
  "author": "dsh-windows-mcp contributors",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:43-55](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/cordis.patch.yml#L43-L55)

真实 loader rows 分开挂插件和宿主桥接。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: windows-mcp-plugin
      name: dsh-windows-mcp

    - id: windows-mcp-bridge
      name: "@deepseek-ai/dsh-mcp-client"
      # Inert until the installer points it at a real executable (see above):
      # a cold `uvx` resolve inside DSH's startup can hang the whole window.
      disabled: true
      config:
        # Namespace for every tool name: mcp__windows__Screenshot, ...
        serverName: windows
        transport: stdio
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1125-1129](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L1125-L1129)

apply 真实注册诊断、路由、开关和揭示。

```text
    auditStartup(warn);
    registerDoctor(ctx, warn);
    registerStateRoute(ctx, warn);
    registerToolGate(ctx, warn);
    registerRevealTool(ctx, warn);
```

#### 缺口

- 未核查上游操作实现或 Windows 桌面实时结果。
  **影响**：已有原生操作、安全与稳定性均需实测。
  **进一步探讨**：用测试桌面对照手工截图及仅挂 MCP 行，记录额外工时与失败。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 依赖与开关如何使截图工具可调用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根补丁装配插件及 `@deepseek-ai/dsh-mcp-client`，后者默认 disabled，预置 stdio 和 `windows-mcp@0.8.8`。GUI 安装入口选择 pin 后发给版本管理器，按可用镜像用 uv 安装到版本目录，验证版本和可执行文件再激活。写回 profile 的完整 override 把桥改为 enabled、固定可执行程序和 stdio；选择不唯一且宿主未报 profile 时拒绝写，重启后由 DSH 按行启动实际服务。插件自身注册 doctor、状态路由、工具守卫和 `windows_desktop`。打开 Computer Use 后默认仅暴露揭示入口；筛选 Screenshot 后当前 Agent 的揭示表更新，提示装配让它在下一步可见，派发检查也匹配。实际屏幕、图像附件和模型准入由上游与 DSH 实现，作者说明文本模型可能只看诊断。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:43-74](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/cordis.patch.yml#L43-L74)

固定根补丁、默认关闭、stdio 及 pin。

<details>
<summary>查看原文（32行）</summary>

```text
- insert:
    - id: windows-mcp-plugin
      name: dsh-windows-mcp

    - id: windows-mcp-bridge
      name: "@deepseek-ai/dsh-mcp-client"
      # Inert until the installer points it at a real executable (see above):
      # a cold `uvx` resolve inside DSH's startup can hang the whole window.
      disabled: true
      config:
        # Namespace for every tool name: mcp__windows__Screenshot, ...
        serverName: windows
        transport: stdio
        # Only reached if someone re-enables this row without rewriting
        # `command`; harmless, because by then the toolchain is installed.
        command: uvx
        args:
          # Pinned for reproducibility. Replace with `windows-mcp` to float, or
          # with an absolute path to a fixed interpreter (`python -m windows_mcp`).
          - windows-mcp@0.8.8
          - serve
          # Curation: drop the tools DSH already covers (its own shell and file
          # tools), plus `App`, which upstream only supports reliably on an
          # English Windows install. Never list `ControlStatus` here — upstream
          # keeps it unconditionally.
          - --exclude-tools
          - App,PowerShell,FileSystem
        # Screenshots, UIA tree walks and PowerShell-style waits are slow.
        # Keep the pinned version in `args` below: the settings page and the
        # installer read it, and the profile block the installer writes restates
        # this row at that version.
        toolCallTimeoutMs: 120000
```

</details>

**依据 2 · 源码核查**：[lib/index.js:887-912](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L887-L912)

GUI POST 选择已知固定版本并启动安装。

<details>
<summary>查看原文（26行）</summary>

```text
        /** Start installing the pinned (or newest known) Windows-MCP into its own tool root. */
        const prepareHandler = (request, response) => {
          if (request.method === "GET") {
            respond(response, 200, snapshot());
            return;
          }
          if (request.method !== "POST") {
            respond(response, 405, { error: "method not allowed" });
            return;
          }
          if (updater === null) {
            respond(response, 503, { error: "the version manager is not ready" });
            return;
          }
          const view = updater.view();
          const target = view.versions.pinned ?? view.check.latest;
          if (target === null) {
            respond(response, 409, { started: false, reason: "no Windows-MCP version is known yet", prepare: prepareSnapshot() });
            return;
          }
          if (view.install.phase === "installing") {
            respond(response, 409, { started: false, reason: "an install is already running", prepare: prepareSnapshot() });
            return;
          }
          void updater.installVersion(target);
          respond(response, 202, { started: true, spec: `windows-mcp@${target}`, prepare: prepareSnapshot() });
```

</details>

**依据 3 · 源码核查**：[lib/updater.js:278-302](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L278-L302)

按镜像启动独立版本目录安装。

<details>
<summary>查看原文（25行）</summary>

```text
  function installAttempt({ uv, version, mirror }) {
    return new Promise((resolve) => {
      const toolRoot = versionToolRoot(root, version);
      const toolDirectory = toolDirectoryFor(root, version);
      const spec = `${WINDOWS_MCP_TOOL}@${version}`;
      append(`$ ${uv} tool install --force --default-index ${mirror.indexUrl} ${spec}  (UV_TOOL_DIR=${toolRoot})`);
      let running = null;
      let finished = false;
      const finish = (result) => {
        if (finished) return;
        finished = true;
        child = null;
        clearTimer();
        resolve(result);
      };
      try {
        const started = startInstall({
          uv,
          spec,
          indexUrl: mirror.indexUrl,
          toolDirectory: toolRoot,
          onLine: append,
        });
        running = started.child;
        child = running;
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:308-322](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L308-L322)

核对工具版本及 exe。

<details>
<summary>查看原文（15行）</summary>

```text
      running.on("close", (code) => {
        if (code !== 0) {
          finish({ ok: false, error: `uv exited with code ${code}` });
          return;
        }
        const installedVersion = toolVersionIn(toolDirectory);
        const executable = executableIn(toolDirectory);
        if (installedVersion !== version || executable === null) {
          finish({
            ok: false,
            error: `uv finished, but ${toolDirectory} does not contain windows-mcp ${version}`,
          });
          return;
        }
        finish({ ok: true, executable, toolDirectory });
```

</details>

**依据 5 · 源码核查**：[lib/updater.js:383-410](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L383-L410)

镜像失败回退，成功后写安装信息并激活。

<details>
<summary>查看原文（28行）</summary>

```text
      const order = mirrorOrder(lastProbe);
      let lastError = "no mirror was available";
      for (const mirror of order) {
        installState.mirror = mirror.id;
        append(`trying ${mirror.label} (${formatBytesPerSecond(mirrorSpeed(lastProbe, mirror.id))})`);
        const attempt = await installAttempt({ uv, version, mirror });
        if (attempt.ok !== true) {
          lastError = `${mirror.label}: ${attempt.error}`;
          append(`failed: ${lastError}`);
          continue;
        }
        try {
          writeManifest(root, version, {
            executable: attempt.executable,
            toolDirectory: attempt.toolDirectory,
            indexUrl: mirror.indexUrl,
            mirror: mirror.id,
          });
        } catch (error) {
          warn(`could not write the Windows-MCP install manifest: ${String(error)}`);
        }
        const activated = activate(version);
        if (activated.ok !== true) {
          settleInstall("failed", activated.error ?? "activation failed");
          return { ok: false, error: installState.error, view: view() };
        }
        settleInstall("ok", null);
        return { ok: true, version, mirror: mirror.id, view: view() };
```

</details>

**依据 6 · 源码核查**：[lib/dependency.js:532-540](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/dependency.js#L532-L540)

选择宿主已报、唯一或拒绝猜测。

```text
export function preferredProfileDirectory(home = dshHome(), env = process.env, argv = process.argv) {
  const candidates = profileDirectories(home);
  const requested = currentProfileDirectory(env, argv);
  if (requested !== null && withinProfiles(requested, home) && existsSync(join(requested, "node_modules", PACKAGE_ID))) {
    return { directory: requested, source: "booted", candidates };
  }
  if (candidates.length === 0) return { directory: null, source: "none", candidates };
  if (candidates.length === 1) return { directory: candidates[0], source: "only", candidates };
  return { directory: null, source: "ambiguous", candidates };
```

**依据 7 · 源码核查**：[lib/dependency.js:411-433](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/dependency.js#L411-L433)

完整重写覆盖为启用的 stdio 行。

<details>
<summary>查看原文（23行）</summary>

```text
export function bridgeOverrideBlock(executable, meta = {}) {
  const stamp = typeof meta.stamp === "string" ? meta.stamp : new Date().toISOString();
  const version = typeof meta.version === "string" ? meta.version : "unknown";
  const values = bridgeValues(meta);
  return [
    PROFILE_BLOCK_BEGIN,
    `# Written by ${PACKAGE_ID} ${version} at ${stamp}.`,
    "# A patch replaces the whole `config`, so the complete row is restated here.",
    `- id: ${BRIDGE_ROW_ID}`,
    // Re-enable the row the bundle patch ships inert. Without this the
    // machine block would override `config` while `disabled: true` stayed in
    // effect, and the profile would boot with no Windows tools at all.
    "  disabled: false",
    "  config:",
    "    serverName: windows",
    "    transport: stdio",
    `    command: ${yamlScalar(executable)}`,
    bridgeArgsLine(values.excludeTools),
    `    toolCallTimeoutMs: ${values.toolCallTimeoutMs}`,
    "    failOnStartupError: false",
    "    reconnect: { enabled: true, initialDelayMs: 500, maxDelayMs: 30000, maxAttempts: 10 }",
    bridgeEnvLine(values),
    PROFILE_BLOCK_END,
```

</details>

**依据 8 · 源码核查**：[lib/dependency.js:573-595](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/dependency.js#L573-L595)

备份与写入后返回需重启。

<details>
<summary>查看原文（23行）</summary>

```text
    const file = join(directory, "cordis.patch.yml");
    const current = existsSync(file) ? readFileSync(file, "utf8") : "";
    const eol = current.includes("\r\n") ? "\r\n" : "\n";
    let backup = null;
    if (current !== "") {
      backup = `${file}.bak-${new Date().toISOString().replace(/[:.]/gu, "-")}`;
      try {
        copyFileSync(file, backup);
      } catch (error) {
        warn(`could not back up ${file}: ${String(error)}`);
        backup = null;
      }
    }
    writeFileSync(
      file,
      withBridgeOverride(
        current,
        bridgeOverrideBlock(executable, { stamp: new Date().toISOString(), version, settings: options.settings }),
        eol,
      ),
      "utf8",
    );
    return { ok: true, path: file, backup, executable, restartRequired: true };
```

</details>

**依据 9 · 源码核查**：[lib/index.js:1108-1129](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L1108-L1129)

apply 挂接版本管理器及功能。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx) {
  try {
    const warn = makeLogger(ctx);
    computerUse.enabled = readComputerUse().enabled;
    settings = readSettings(stateDirectory);
    updater = createUpdater({
      warn,
      resolver: which,
      pinned: windowsMcpVersionPin(readText(patchPath)),
      preferredMirror: () => (settings === null ? "auto" : settings.plugin.preferredMirror),
      writeBridge: (executable) =>
        writeBridgeOverride(executable, {
          warn,
          version: selfVersion(),
          settings: settings === null ? null : bridgeSettingsOf(settings),
        }),
    });
    auditStartup(warn);
    registerDoctor(ctx, warn);
    registerStateRoute(ctx, warn);
    registerToolGate(ctx, warn);
    registerRevealTool(ctx, warn);
```

</details>

**依据 10 · 源码核查**：[lib/index.js:53-64](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L53-L64)

定义诊断工具、固定命名空间和揭示工具。

<details>
<summary>查看原文（12行）</summary>

```text
const BRIDGE_ROW_ID = "windows-mcp-bridge";
const TOOL_NAME = "windows_mcp_doctor";
/** Every bridged tool is `mcp__<serverName>__<UpstreamToolName>`. */
const BRIDGE_TOOL_PREFIX = "mcp__windows__";
/**
 * The one-line entry the model sees while the desktop capabilities are still
 * hidden. Calling it reveals picked capabilities (or all of them) for that
 * session; four tokens of description are much cheaper than eighteen schemas.
 */
const REVEAL_TOOL_NAME = "windows_desktop";
const REVEAL_TOOL_DESCRIPTION =
  "Reveal the Windows desktop capabilities (screenshots, clicking, typing, windows, clipboard, processes) for this session. Call it with no arguments to reveal all of them; the definitions come back in the result and the tools become callable on the next step.";
```

</details>

**依据 11 · 源码核查**：[lib/index.js:444-477](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L444-L477)

开启后允许按 Agent 选择工具或全部揭示。

<details>
<summary>查看原文（34行）</summary>

```text
          execute(args, exec) {
            if (!computerUse.enabled) {
              return {
                revealed: [],
                tools: [],
                note: "Computer Use is switched off, so there is nothing to reveal. Ask the user to switch the Computer Use control on in the composer first.",
              };
            }
            const catalog = desktopCatalog(scoped.tools);
            const names = Array.isArray(args?.names) ? args.names.map((value) => String(value)).filter((value) => value !== "") : [];
            const query = typeof args?.query === "string" ? args.query.trim().toLowerCase() : "";
            let picked = catalog;
            if (names.length > 0) {
              picked = catalog.filter((entry) =>
                names.some(
                  (wanted) =>
                    wanted === entry.name ||
                    `${BRIDGE_TOOL_PREFIX}${wanted}` === entry.name ||
                    (entry.name.startsWith(BRIDGE_TOOL_PREFIX) && entry.name.slice(BRIDGE_TOOL_PREFIX.length) === wanted),
                ),
              );
            } else if (query !== "") {
              picked = catalog.filter(
                (entry) => entry.name.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query),
              );
            }
            const state = revealStateFor(exec?.agent);
            for (const entry of picked) state.names.add(entry.name);
            if (catalog.length > 0 && picked.length === catalog.length) state.all = true;
            const note =
              picked.length === 0
                ? `Nothing matched. Known capabilities: ${catalog.map((entry) => entry.name).join(", ")}`
                : "The revealed tools are callable on the next step; every hidden one stays hidden until you reveal it too.";
            return { revealed: picked.map((entry) => entry.name), tools: picked, note };
```

</details>

**依据 12 · 源码核查**：[lib/index.js:329-371](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L329-L371)

真实提示与派发过滤。

<details>
<summary>查看原文（43行）</summary>

```text
function registerToolGate(ctx, warn) {
  if (typeof ctx?.on === "function") {
    try {
      ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
        const assembly = await next();
        if (assembly === null || typeof assembly !== "object") return assembly;
        const tools = assembly.tools;
        if (!Array.isArray(tools)) return assembly;
        const agent = context?.agent;
        const keep = (name) => {
          if (isBridgedToolName(name)) return computerUse.enabled && isToolRevealed(agent, name);
          // The entry itself is dead weight when the desktop is off or when
          // every schema is always shown.
          if (name === REVEAL_TOOL_NAME) return computerUse.enabled && lazyToolsEnabled();
          return true;
        };
        const kept = tools.filter((tool) => keep(tool?.name));
        if (kept.length === tools.length) return assembly;
        // Copy rather than mutate: the incoming assembly may be shared, and the
        // copy keeps whatever prototype the host built it with.
        return Object.assign(Object.create(Object.getPrototypeOf(assembly)), assembly, { tools: kept });
      });
    } catch (error) {
      warn(`could not hook prompt assembly, so desktop tools stay visible: ${String(error)}`);
    }
  }

  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["tools"], (scoped) => {
      try {
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!computerUse.enabled) {
            return `Computer Use is switched off, so "${name}" is not available. Switch the Computer Use control back on in the composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
        });
```

</details>

**依据 13 · 作者声明**：[README.md:329-335](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/README.md#L329-L335)

作者解释桥接图像与附件投影。

```text
- The integration is **version-sensitive** in one direction only: the bridge
  config schema belongs to DSH, not to this plugin. `package.json` declares the
  patch; DSH decides how to read it.
- Image projection is a bridge feature: MCP image blocks are saved as DSH
  attachments and surfaced as native image content. Audio and embedded resources
  degrade to diagnostic text.
- **MCP prompts are not supported** by the bridge (resources are, on demand).
```

#### 缺口

- 当前版本未在 Windows 或目标 DSH 验证。
  **影响**：是否可见工具、截图回传和模型呈现仍依赖宿主与上游。
  **进一步探讨**：重启后核对实际 profile、版本、工具列表和单次图像消息。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 开关、渐进揭示和操作权限怎样区分？

**研究主题**：缺陷与关键质疑

#### 完整回答

Computer Use 是宿主模块共享的布尔值，状态文件位于 DSH_HOME；Web 按钮来自会话槽，但 POST 没带会话 ID。默认关在文件缺失或解析失败时生效；重启可恢复打开，写失败时仍答应当前内存状态，故关后要复核重启。揭示按活 Agent 存 WeakMap，无 Agent 时共用后备。全揭示或关闭惰性工具时可用更广工具，筛选仅减少上下文，不是只读白名单。提示过滤与派发守卫是分离机制，缺 tools.guard 会跳过派发钩子，安装错误只警告；守卫覆盖固定工具前缀，不终止已接受的动作或桥接子进程。写路由的 cookie 检查只拒绝显式 false，Connection/BrowserAuth 缺失返回 null 时会继续 handler。这只能证明插件这一层的判断，宿主外层访问控制及实际请求仍需验证。文件具备同用户写入权限，也可改变重启状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:75-86](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L75-L86)

宿主模块和持久化位置。

<details>
<summary>查看原文（12行）</summary>

```text
const stateDirectory = (() => {
  const fromEnvironment = String(process.env.DSH_HOME ?? "").trim();
  return fromEnvironment === "" ? join(homedir(), ".dsh") : fromEnvironment;
})();
const statePath = join(stateDirectory, "dsh-windows-mcp.state.json");
const STATE_ROUTE = "/dsh-windows-mcp/state";
const MAX_STATE_BODY_BYTES = 1024;
const MAX_SETTINGS_BODY_BYTES = 8192;

/** Mirrors the persisted flag; read once at boot, updated by the state route.
 *  Desktop control is opt-in: a fresh install starts OFF. */
const computerUse = { enabled: false };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:283-306](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/client.js#L283-L306)

Web 修改共享状态，没有会话参数。

<details>
<summary>查看原文（24行）</summary>

```text
      var toggle = React.useCallback(function () {
        if (view.phase === "loading" || view.busy) return;
        var next = !view.enabled;
        busyRef.current = true;
        setView({ phase: view.phase, enabled: next, bridged: view.bridged, busy: true, error: null });
        try {
          fetch(apiUrl(STATE_PATH), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ enabled: next }),
          })
            .then(function (response) {
              if (!response.ok) throw new Error("HTTP " + response.status);
              return response.json();
            })
            .then(function (body) {
              busyRef.current = false;
              setView({
                phase: "ready",
                enabled: body && body.enabled === true,
                bridged: typeof (body && body.bridged) === "number" ? body.bridged : view.bridged,
                busy: false,
                error: null,
              });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:98-128](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L98-L128)

Agent 揭示状态与匿名后备。

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * Which desktop capabilities the model has asked for, per agent. The prompt
 * filter hides the rest and the dispatch guard refuses them, so "hidden" is a
 * gate rather than a hint. A WeakMap ties the answer to the live agent: a new
 * session starts from the one-line entry again.
 * @type {WeakMap<object, { all: boolean, names: Set<string> }>}
 */
const revealedTools = new WeakMap();
/** Fallback for callers that hand us no agent (tests, odd compositions). */
const revealedAnonymously = { all: false, names: new Set() };

/** @returns the reveal state for one agent. */
function revealStateFor(agent) {
  if (agent === null || typeof agent !== "object") return revealedAnonymously;
  let state = revealedTools.get(agent);
  if (state === undefined) {
    state = { all: false, names: new Set() };
    revealedTools.set(agent, state);
  }
  return state;
}

/** Lazy exposure is on unless the settings page turned it off. */
function lazyToolsEnabled() {
  return settings === null || settings.plugin === undefined || settings.plugin.lazyTools !== false;
}

/** True when the model may see and call one bridged tool. */
function isToolRevealed(agent, name) {
  if (!lazyToolsEnabled()) return true;
  const state = revealStateFor(agent);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:276-301](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L276-L301)

默认关闭和尽力持久化。

<details>
<summary>查看原文（26行）</summary>

```text
/** Read the persisted Computer Use flag; default OFF when nothing is stored. */
function readComputerUse() {
  const raw = readText(statePath);
  if (raw === null) return { enabled: false };
  try {
    const parsed = JSON.parse(raw.replace(/^\uFEFF/u, ""));
    return { enabled: parsed?.enabled === true };
  } catch {
    return { enabled: false };
  }
}

/** Persist the flag. A read-only home is not an error: the switch stays live
 *  for this process and simply does not survive a restart. */
function persistComputerUse(enabled) {
  try {
    mkdirSync(stateDirectory, { recursive: true });
    writeFileSync(
      statePath,
      `${JSON.stringify({ enabled: enabled === true, updatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8",
    );
    return true;
  } catch {
    return false;
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:329-378](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L329-L378)

提示及派发独立，缺能力或注册失败的行为。

<details>
<summary>查看原文（50行）</summary>

```text
function registerToolGate(ctx, warn) {
  if (typeof ctx?.on === "function") {
    try {
      ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
        const assembly = await next();
        if (assembly === null || typeof assembly !== "object") return assembly;
        const tools = assembly.tools;
        if (!Array.isArray(tools)) return assembly;
        const agent = context?.agent;
        const keep = (name) => {
          if (isBridgedToolName(name)) return computerUse.enabled && isToolRevealed(agent, name);
          // The entry itself is dead weight when the desktop is off or when
          // every schema is always shown.
          if (name === REVEAL_TOOL_NAME) return computerUse.enabled && lazyToolsEnabled();
          return true;
        };
        const kept = tools.filter((tool) => keep(tool?.name));
        if (kept.length === tools.length) return assembly;
        // Copy rather than mutate: the incoming assembly may be shared, and the
        // copy keeps whatever prototype the host built it with.
        return Object.assign(Object.create(Object.getPrototypeOf(assembly)), assembly, { tools: kept });
      });
    } catch (error) {
      warn(`could not hook prompt assembly, so desktop tools stay visible: ${String(error)}`);
    }
  }

  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["tools"], (scoped) => {
      try {
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!computerUse.enabled) {
            return `Computer Use is switched off, so "${name}" is not available. Switch the Computer Use control back on in the composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
        });
      } catch (error) {
        warn(`could not install the Computer Use dispatch guard: ${String(error)}`);
      }
    });
  } catch (error) {
    warn(`could not inject the tools service for the dispatch guard: ${String(error)}`);
  }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:754-792](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L754-L792)

cookie 未知返回 null，守卫只拒绝 false。

<details>
<summary>查看原文（39行）</summary>

```text
        const gateState = () => {
          const found = connectionService();
          const auth = found === null ? null : found.browserAuth;
          const enforced = auth !== null && auth !== undefined && typeof auth.isAuthenticated === "function";
          return { cookie: enforced ? "enforced" : "unobservable" };
        };

        const browserSession = (request) => {
          const connection = connectionService();
          const auth = connection === null || connection === undefined ? null : connection.browserAuth;
          if (auth === null || auth === undefined || typeof auth.isAuthenticated !== "function") return null;
          let secure = false;
          try {
            secure = scoped.get("webServer")?.protocol === "https:";
          } catch {
            secure = false;
          }
          try {
            return auth.isAuthenticated(request, secure) === true;
          } catch {
            return false;
          }
        };

        /**
         * Refuse a mutation that did not come from the GUI window. Reads stay
         * open; every POST that changes the flag, the patch layer, the settings
         * or the toolchain has to prove it speaks for the browser session.
         */
        const guarded = (handler) => (request, response) => {
          if (request.method === "POST" && browserSession(request) === false) {
            respond(response, 401, {
              error: "this change has to come from the DSH window",
              hint: "The request carried no signed session cookie. Use the composer switch or the Settings page: a script, or a model with shell access, cannot turn desktop control on for itself.",
            });
            return;
          }
          handler(request, response);
        };
```

</details>

**依据 7 · 源码核查**：[lib/index.js:876-882](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L876-L882)

先改内存并忽略持久化返回值。

```text
            if (typeof next?.enabled !== "boolean") {
              respond(response, 400, { error: "expected { enabled: boolean }" });
              return;
            }
            computerUse.enabled = next.enabled;
            persistComputerUse(computerUse.enabled);
            respond(response, 200, snapshot());
```

**依据 8 · 源码核查**：[lib/index.js:1089-1094](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L1089-L1094)

六个操作路由共享守卫。

```text
        scoped.webServer.register({ kind: "exact", path: STATE_ROUTE, handler: guarded(handler) });
        scoped.webServer.register({ kind: "exact", path: PREPARE_ROUTE, handler: guarded(prepareHandler) });
        scoped.webServer.register({ kind: "exact", path: PREPARE_CANCEL_ROUTE, handler: guarded(cancelHandler) });
        scoped.webServer.register({ kind: "exact", path: BRIDGE_ROUTE, handler: guarded(bridgeHandler) });
        scoped.webServer.register({ kind: "exact", path: UPDATE_ROUTE, handler: guarded(updateHandler) });
        scoped.webServer.register({ kind: "exact", path: SETTINGS_ROUTE, handler: guarded(settingsHandler) });
```

**依据 9 · 作者声明**：[README.md:296-303](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/README.md#L296-L303)

作者说明缺宿主认证及可写状态文件。

```text
- **When the cookie cannot be checked, the plugin says so.** A composition that
  mounts no `connection` service (headless hosts, Electron `file://`) cannot be
  authenticated; `/state` then reports `"gate": {"cookie": "unobservable"}`. In
  that case do not expose the web server on a non-loopback `--host`.
- **Files are still files.** The Computer Use flag in
  `$DSH_HOME/dsh-windows-mcp.state.json` and the machine-written patch block are
  ordinary files owned by the same user. An agent that can write them can still
  change the plugin's behaviour across a restart — the cookie gate closes the
```

#### 缺口

- 未验证外层宿主认证、实际 guard 和进行中调用。
  **影响**：误把开关当作进程停止、分会话授权或只读环境会扩大影响。
  **进一步探讨**：验证不带 cookie 修改被拒、跨会话同时开关、已派发动作与进程状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Windows、工具链、镜像与退出由谁管理？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根包版本 0.2.4，Node >=22。作者要求 Windows 10/11、带宿主桥接的 DSH Desktop、GUI 安装所需 uv、截图展示所需图像输入模型。固定补丁给出 stdio 启动和排除 App、PowerShell、FileSystem，仍有其它真实桌面操作。默认会后台查 PyPI 版本，设置可关。升级和回退改指向本地工具链版本，若历史不存在会失败；激活先写 bridge 再更新版本状态，中间失败会报告已写桥但版本档没更新。备份失败只告警，后面直接写 profile，因此升级/退出要独立备份并核对重启后的真实可执行路径。截图分辨率、模型用量、安装联网、恢复耗时和磁盘占用依环境。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-49](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/package.json#L34-L49)

Node 和 bundle 配置。

<details>
<summary>查看原文（16行）</summary>

```text
  ],
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "test": "node --test \"test/**/*.test.mjs\"",
    "check": "node --check lib/index.js",
    "dump": "node scripts/dump-config.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 2 · 作者声明**：[README.md:52-57](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/README.md#L52-L57)

作者给出 Windows、DSH、uv 和图像模型条件。

```text
## Requirements

- **Windows 10/11.**
- **DeepSeek Harness Desktop** with the in-box `@deepseek-ai/dsh-mcp-client` bridge (0.2.0-rc.2 or newer).
- **[uv](https://docs.astral.sh/uv/)** on the `PATH` of the process that runs DSH — **Settings → Desktop** uses it to install Windows-MCP. DSH itself boots without it. `%USERPROFILE%\.local\bin` is searched even when it is not on `PATH`.
- **A model that accepts image input** if you want the agent to actually *see* screenshots.
```

**依据 3 · 源码核查**：[cordis.patch.yml:62-90](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/cordis.patch.yml#L62-L90)

上游 pin、排除项、连接和截图默认。

<details>
<summary>查看原文（29行）</summary>

```text
          - windows-mcp@0.8.8
          - serve
          # Curation: drop the tools DSH already covers (its own shell and file
          # tools), plus `App`, which upstream only supports reliably on an
          # English Windows install. Never list `ControlStatus` here — upstream
          # keeps it unconditionally.
          - --exclude-tools
          - App,PowerShell,FileSystem
        # Screenshots, UIA tree walks and PowerShell-style waits are slow.
        # Keep the pinned version in `args` below: the settings page and the
        # installer read it, and the profile block the installer writes restates
        # this row at that version.
        toolCallTimeoutMs: 120000
        # Belt and braces: a missing Windows-MCP must never fail the profile.
        failOnStartupError: false
        reconnect:
          enabled: true
          initialDelayMs: 500
          maxDelayMs: 30000
          maxAttempts: 10
        env:
          # Upstream defaults to PostHog telemetry ON; a desktop-automation
          # plugin should not phone home.
          ANONYMIZED_TELEMETRY: "false"
          # Suppress the orange "control taken over" flash on every screenshot.
          WINDOWS_MCP_DISABLE_FLASH: "1"
          # Downscale screenshots (0.1–1.0) to cut image tokens. Lower it to
          # 0.5 if your budget is tight; raise it if small UI text is unreadable.
          WINDOWS_MCP_SCREENSHOT_SCALE: "0.75"
```

</details>

**依据 4 · 源码核查**：[lib/settings.js:37-53](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/settings.js#L37-L53)

更新检查和惰性工具默认开。

<details>
<summary>查看原文（17行）</summary>

```text
export const DEFAULT_SETTINGS = Object.freeze({
  version: SETTINGS_VERSION,
  bridge: Object.freeze({
    toolCallTimeoutMs: BRIDGE_DEFAULTS.toolCallTimeoutMs,
    excludeTools: Object.freeze(BRIDGE_DEFAULTS.excludeTools.slice()),
    screenshotScale: BRIDGE_DEFAULTS.screenshotScale,
    screenshotBackend: BRIDGE_DEFAULTS.screenshotBackend,
    disableFlash: BRIDGE_DEFAULTS.disableFlash,
  }),
  plugin: Object.freeze({
    autoCheckUpdates: true,
    preferredMirror: "auto",
    // Hide the bridged desktop tools behind a one-line entry the model has to
    // ask for; the default is the cheap mode, and the Settings page can turn
    // it off for workflows that want every schema up front.
    lazyTools: true,
  }),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1130-1138](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L1130-L1138)

默认后台检查但不等待。

```text
    // Check for a newer Windows-MCP build in the background (cheap: a ranged
    // read per mirror, cached for hours). The page shows the result; the boot
    // never waits for it, and a failure only costs the last known answer. The
    // settings page can turn this off.
    if (settings === null || settings.plugin.autoCheckUpdates === true) {
      try {
        void updater.check({ force: false }).catch(() => {});
      } catch {
        /* a failed check is not a boot problem */
```

**依据 6 · 源码核查**：[lib/updater.js:337-358](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L337-L358)

激活分两步，状态写失败可残留 bridge 修改。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Rewrite the bridge to the given managed version and remember it. */
  function activate(version) {
    const executable = activeInstall({ active: version }, home)?.executable ?? null;
    if (executable === null) {
      return { ok: false, error: `Windows-MCP ${version} is not installed under ${root}` };
    }
    let bridge;
    try {
      bridge = writeBridge(executable);
    } catch (error) {
      bridge = { ok: false, error: String(error) };
    }
    if (bridge?.ok !== true) return { ok: false, error: bridge?.error ?? "the bridge row could not be written", bridge };
    const state = readVersionsState(home);
    const next = activateVersion(state, version);
    try {
      writeVersionsState(next, home);
    } catch (error) {
      return { ok: false, error: `the bridge was written, but the versions file could not be updated: ${String(error)}`, bridge };
    }
    installState.bridge = bridge;
    return { ok: true, version, executable, bridge };
```

</details>

**依据 7 · 源码核查**：[lib/updater.js:426-439](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L426-L439)

已有版本激活和 previous 回退。

<details>
<summary>查看原文（14行）</summary>

```text
  /** Switch to a version that is already installed (no download). */
  function activateInstalled(version) {
    if (installState.phase === "installing") return { ok: false, error: "an install is already running" };
    const activated = activate(version);
    return { ...activated, view: view() };
  }

  /** Go back to the version that the active one replaced. */
  function rollback() {
    const state = readVersionsState(home);
    if (state.previous === null) return { ok: false, error: "there is no previous version to go back to", view: view() };
    const target = state.previous;
    const activated = activate(target);
    return { ...activated, rolledBackFrom: state.active, view: view() };
```

</details>

**依据 8 · 源码核查**：[lib/dependency.js:573-598](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/dependency.js#L573-L598)

备份失败仍写入，返回需重启。

<details>
<summary>查看原文（26行）</summary>

```text
    const file = join(directory, "cordis.patch.yml");
    const current = existsSync(file) ? readFileSync(file, "utf8") : "";
    const eol = current.includes("\r\n") ? "\r\n" : "\n";
    let backup = null;
    if (current !== "") {
      backup = `${file}.bak-${new Date().toISOString().replace(/[:.]/gu, "-")}`;
      try {
        copyFileSync(file, backup);
      } catch (error) {
        warn(`could not back up ${file}: ${String(error)}`);
        backup = null;
      }
    }
    writeFileSync(
      file,
      withBridgeOverride(
        current,
        bridgeOverrideBlock(executable, { stamp: new Date().toISOString(), version, settings: options.settings }),
        eol,
      ),
      "utf8",
    );
    return { ok: true, path: file, backup, executable, restartRequired: true };
  } catch (error) {
    warn(`could not point the bridge at the installed Windows-MCP: ${String(error)}`);
    return { ok: false, error: String(error), path: null };
```

</details>

#### 缺口

- 未测镜像真实性、依赖可用性或部分失败恢复。
  **影响**：实际部署与撤回可能需要额外检查。
  **进一步探讨**：在隔离 profile 记录 patch、版本档、exe、日志和回退后实况。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验收只观察试用与退出开关？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，等待受控验收。用可还原 Windows VM 和低权限会话，去掉业务凭据及实际写目标，确认目标 Host 能观测签名 cookie、强制拒绝无 cookie 的 POST、支持 tools.guard。固定可执行版本后用两个 Agent 试关闭、揭示前直呼、只揭示 Screenshot、关闭后再呼和重启恢复。另用模拟长调用确认开关只拦后续派发。把宿主级开关加成可验证的限时观察策略并默认拒绝不可观测鉴权，可能减少误给输入能力；记录越权调用、OCR 质量、切换与恢复时间。任何拒绝条件失效时停用桥接、退出受控桌面并回到手工截图。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:329-378](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L329-L378)

可按提示与派发分别验收。

<details>
<summary>查看原文（50行）</summary>

```text
function registerToolGate(ctx, warn) {
  if (typeof ctx?.on === "function") {
    try {
      ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
        const assembly = await next();
        if (assembly === null || typeof assembly !== "object") return assembly;
        const tools = assembly.tools;
        if (!Array.isArray(tools)) return assembly;
        const agent = context?.agent;
        const keep = (name) => {
          if (isBridgedToolName(name)) return computerUse.enabled && isToolRevealed(agent, name);
          // The entry itself is dead weight when the desktop is off or when
          // every schema is always shown.
          if (name === REVEAL_TOOL_NAME) return computerUse.enabled && lazyToolsEnabled();
          return true;
        };
        const kept = tools.filter((tool) => keep(tool?.name));
        if (kept.length === tools.length) return assembly;
        // Copy rather than mutate: the incoming assembly may be shared, and the
        // copy keeps whatever prototype the host built it with.
        return Object.assign(Object.create(Object.getPrototypeOf(assembly)), assembly, { tools: kept });
      });
    } catch (error) {
      warn(`could not hook prompt assembly, so desktop tools stay visible: ${String(error)}`);
    }
  }

  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["tools"], (scoped) => {
      try {
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!computerUse.enabled) {
            return `Computer Use is switched off, so "${name}" is not available. Switch the Computer Use control back on in the composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
        });
      } catch (error) {
        warn(`could not install the Computer Use dispatch guard: ${String(error)}`);
      }
    });
  } catch (error) {
    warn(`could not inject the tools service for the dispatch guard: ${String(error)}`);
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:754-792](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L754-L792)

测未认证、缺认证服务的状态。

<details>
<summary>查看原文（39行）</summary>

```text
        const gateState = () => {
          const found = connectionService();
          const auth = found === null ? null : found.browserAuth;
          const enforced = auth !== null && auth !== undefined && typeof auth.isAuthenticated === "function";
          return { cookie: enforced ? "enforced" : "unobservable" };
        };

        const browserSession = (request) => {
          const connection = connectionService();
          const auth = connection === null || connection === undefined ? null : connection.browserAuth;
          if (auth === null || auth === undefined || typeof auth.isAuthenticated !== "function") return null;
          let secure = false;
          try {
            secure = scoped.get("webServer")?.protocol === "https:";
          } catch {
            secure = false;
          }
          try {
            return auth.isAuthenticated(request, secure) === true;
          } catch {
            return false;
          }
        };

        /**
         * Refuse a mutation that did not come from the GUI window. Reads stay
         * open; every POST that changes the flag, the patch layer, the settings
         * or the toolchain has to prove it speaks for the browser session.
         */
        const guarded = (handler) => (request, response) => {
          if (request.method === "POST" && browserSession(request) === false) {
            respond(response, 401, {
              error: "this change has to come from the DSH window",
              hint: "The request carried no signed session cookie. Use the composer switch or the Settings page: a script, or a model with shell access, cannot turn desktop control on for itself.",
            });
            return;
          }
          handler(request, response);
        };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:444-477](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/index.js#L444-L477)

选择性揭示只是 Agent 视图。

<details>
<summary>查看原文（34行）</summary>

```text
          execute(args, exec) {
            if (!computerUse.enabled) {
              return {
                revealed: [],
                tools: [],
                note: "Computer Use is switched off, so there is nothing to reveal. Ask the user to switch the Computer Use control on in the composer first.",
              };
            }
            const catalog = desktopCatalog(scoped.tools);
            const names = Array.isArray(args?.names) ? args.names.map((value) => String(value)).filter((value) => value !== "") : [];
            const query = typeof args?.query === "string" ? args.query.trim().toLowerCase() : "";
            let picked = catalog;
            if (names.length > 0) {
              picked = catalog.filter((entry) =>
                names.some(
                  (wanted) =>
                    wanted === entry.name ||
                    `${BRIDGE_TOOL_PREFIX}${wanted}` === entry.name ||
                    (entry.name.startsWith(BRIDGE_TOOL_PREFIX) && entry.name.slice(BRIDGE_TOOL_PREFIX.length) === wanted),
                ),
              );
            } else if (query !== "") {
              picked = catalog.filter(
                (entry) => entry.name.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query),
              );
            }
            const state = revealStateFor(exec?.agent);
            for (const entry of picked) state.names.add(entry.name);
            if (catalog.length > 0 && picked.length === catalog.length) state.all = true;
            const note =
              picked.length === 0
                ? `Nothing matched. Known capabilities: ${catalog.map((entry) => entry.name).join(", ")}`
                : "The revealed tools are callable on the next step; every hidden one stays hidden until you reveal it too.";
            return { revealed: picked.map((entry) => entry.name), tools: picked, note };
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:337-358](https://github.com/helloHub1212/dsh-windows-mcp/blob/dc1308fa2cd14f3040764f37f2bd2099f74a9720/lib/updater.js#L337-L358)

回退前需要确认真实 bridge 与记录。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Rewrite the bridge to the given managed version and remember it. */
  function activate(version) {
    const executable = activeInstall({ active: version }, home)?.executable ?? null;
    if (executable === null) {
      return { ok: false, error: `Windows-MCP ${version} is not installed under ${root}` };
    }
    let bridge;
    try {
      bridge = writeBridge(executable);
    } catch (error) {
      bridge = { ok: false, error: String(error) };
    }
    if (bridge?.ok !== true) return { ok: false, error: bridge?.error ?? "the bridge row could not be written", bridge };
    const state = readVersionsState(home);
    const next = activateVersion(state, version);
    try {
      writeVersionsState(next, home);
    } catch (error) {
      return { ok: false, error: `the bridge was written, but the versions file could not be updated: ${String(error)}`, bridge };
    }
    installState.bridge = bridge;
    return { ok: true, version, executable, bridge };
```

</details>

#### 缺口

- 未运行 Windows 或真实 DSH，策略假设也未验证。
  **影响**：单靠源码不能通过实际权限验收。
  **进一步探讨**：固定一套宿主和上游，逐项留观察与拒绝日志。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
