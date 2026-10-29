# Windows Computer Use

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[6fb6421](https://github.com/Yu-tao-Li/dsh-computer-use-win/tree/6fb642129595a6357588c70812974951db304662)

<!-- BEGIN META -->
[![GitHub ★ 289](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=289&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yu-tao-Li/dsh-computer-use-win) [![npm 30d 13,527](https://img.shields.io/static/v1?label=npm+30d&message=13%2C527&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use-win) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use-win)
<!-- END META -->

> **功能**：把 Windows UIA、截图/OCR、真实输入与后台浏览器通道接入 DSH/MCP，并提供接管提示和停止控制。

> **亮点**：DSH/MCP与常驻UIA桥、背景优先升级输入、窗口身份/遮挡校验及sent/unknown反馈形成实际工具循环，见 [Q02](#research-q02)。

> **主要限制**：sent不是业务成功，取消不撤已发动作；quiet网页不武装桌面Esc，保留浏览器profile也不等无登录隔离，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 它是原生插件还是独立桌面Agent，适合什么任务？](#detail-section-11)
  - [Q02 · 真实动作链与结果确认边界是什么？](#detail-section-12)
  - [Q03 · Esc/停止是否撤销动作，浏览器登录和数据边界如何？](#detail-section-13)
  - [Q04 · 可以推荐哪种具体试用，值得验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：没有稳定API的Windows本机操作可在隔离测试桌面逐动作试用；有API时以同任务可靠性比较，不推导无人值守业务可用，见 [Q01](#research-q01)。

人工桌面操作或应用结构API；插件提供模型可调用观察/动作与接管反馈，Agent规划仍由宿主承担，核心UIA/浏览器协议继承系统。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| UIA/截图/OCR | 观测窗口和定位控件 | 不是全应用可靠识别 |
| 桌面输入 | 背景优先或前台SendInput | 点覆盖拒绝，sent非效果 |
| 网页lane | 背景页面访问 | cookies和quiet停止不同 |
| 接管/取消 | 暂停本轮并清理输入 | 不撤已经发生的业务副作用 |

**流程与依赖**

| 条件 | 用途 | 不满足时 |
|---|---|---|
| Windows交互式桌面/PowerShell/UIA | 原生观测与输入 | macOS/Linux不是支持目标 |
| Node>=22、匹配DSH/MCP桥 | stdio工具和设置 | 单独MCP缺DSH整轮反馈 |
| 可访问目标/控件/DPI | 元素和坐标定位 | 稀疏UIA/OCR需重新观察 |
| Chromium/Edge及独立profile | 背景网页动作 | cookies/Windows账号须单核 |
| 用户授权与停止/验收 | 限定业务副作用 | 派发不授予付款/提交权限 |

| 阶段 | 动作 | 判据与恢复 |
|---|---|---|
| 准备 | 固定Windows/宿主和测试目标 | 无真实账号文件，先核停止 |
| 观察 | 获取树/截图/身份 | 不复用过期坐标猜测 |
| 执行 | 小步背景或接管输入 | sent仅派发，未确认先停 |
| 后观察 | 查实际字段/页面/文件 | 明确后条件才算成功 |
| 取消 | 停新请求等必要释放 | 不撤副作用，核已发生结果 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 测试桌面/浏览器成本未知 | profile、权限、UIA、停止核对 |
| 持续 | 模型视觉/文字token及进程资源未知 | 多轮观察、适配应用/浏览器 |
| 故障 | 输入/登录残留资源未知 | 核焦点、迟到动作、cookies及应用状态 |
| 退出 | 不撤实际文本/提交 | 清profile与独立回退，业务可能不可撤 |

| 项目 | 源码支持 | 未知 |
|---|---|---|
| 实际动作 | PowerShell/UIA与浏览器链 | 任意应用及控件可靠性 |
| 干扰控制 | 背景优先与接管暂停 | 真实停止释放与前台恢复 |
| 任务效果 | 有派发和再观察提示 | 错误率、接管、节时节费 |

> **思考**：sent不是业务成功，取消不撤已发动作；quiet网页不武装桌面Esc，保留浏览器profile也不等无登录隔离，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：DSH/MCP与常驻UIA桥、背景优先升级输入、窗口身份/遮挡校验及sent/unknown反馈形成实际工具循环，见 [Q02](#research-q02)。

[Q02](#research-q02) 窗口身份、点遮挡和sent语义可借鉴；[Q03](#research-q03) 按键清理后停止比强杀输入安全，但不能宣传撤销副作用，quiet与Esc范围须讲明。

<a id="detail-section-5"></a>

### 1.4 主要限制

sent不是业务成功，取消不撤已发动作；quiet网页不武装桌面Esc，保留浏览器profile也不等无登录隔离，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

Windows隔离桌面上只试记事本/本地网页无提交动作，逐步核后条件与取消；重要业务先用稳定API或人工，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认实际桌面和浏览器接线，试用无账号/可丢弃测试；未运行Windows动作或验证停止、模型数据流和业务结果。

- 已检查：作者 README、包清单、源码路径 README.md、mcp/browser.mjs、mcp/dsh-plugin.mjs、mcp/server.mjs、mcp/takeover.mjs、package.json、scripts/windows-uia.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根统计，抽读plugin桥、MCP请求/PowerShell派发、取消/接管、browser profile和PS身份/覆盖代表段；稀疏checkout中的PS用固定HEAD git对象读取，未执行或修改checkout。未全审UIA/PInvoke、OCR和浏览器全部操作。
- 下一步：在隔离Windows记事本/本地表单覆盖遮挡、移窗、身份变化、导航和慢输入停止，核按键释放、派发后条件、浏览器登录与宿主数据流；比较人工/API效果。本轮无Windows运行证据。

**分析版本**

- **仓库**：[Yu-tao-Li/dsh-computer-use-win](https://github.com/Yu-tao-Li/dsh-computer-use-win)
- **版本号**：0.5.3（[固定提交 6fb6421](https://github.com/Yu-tao-Li/dsh-computer-use-win/tree/6fb642129595a6357588c70812974951db304662)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

组合观察版本、目标身份、派发/实际后条件与可撤性的动作收据，检验是否减少误确认与未知重试；未实现需求未知，见 [Q04](#research-q04)。

在隔离Windows记事本/本地表单覆盖遮挡、移窗、身份变化、导航和慢输入停止，核按键释放、派发后条件、浏览器登录与宿主数据流；比较人工/API效果。本轮无Windows运行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 777 | 718 | 54 | — |
| .mjs | source | 10 | 4413 | 3843 | 427 | — |
| .md | source | 17 | 2783 | — | — | 66389 |
| .mjs | test | 45 | 3924 | 3565 | 295 | — |
| .cjs | test | 2 | 402 | 381 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：追真实Windows动作链，区分观察/派发/后确认与业务授权，核取消和浏览器登录边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是原生插件还是独立桌面Agent，适合什么任务？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-computer-use-win 0.5.3是原生DSH插件外壳连接本地stdio MCP服务，同时可通过wcu-mcp给其他MCP客户端使用。Node>=22，os=win32；真实桌面后端依赖交互式Windows、PowerShell/UIA、OCR和可访问窗口，浏览器通道依赖Chromium/Edge等调试协议。单独MCP没有DSH设置、对话记录和整轮提示，不能把适配器存在当所有客户端同等功能。README安装命令反映作者Desktop环境，当前官方Desktop/发行版本兼容需另核，不能机械套用跨代profile管理方式。

面向没有现成API、但需要在本机表单/桌面软件输入和检查结果的DSH用户。相较人手操作，提供可被Agent调用的观察、定位、执行、再观察工具；相较成熟结构API，仍受焦点、窗口/页面变化、权限和控件暴露质量约束，应优先可稳定直接调用的API。贡献是MCP/DSH桥、常驻PowerShell、背景优先输入、浏览器lane与接管反馈，不是独立规划模型；规划与继续决策属于宿主Agent。工具数、作者截图及测试文件不能证明任意业务自动化可靠。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-9](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/package.json#L2-L9)

版本、MCP bin及原生main。

```text
  "name": "dsh-computer-use-win",
  "version": "0.5.3",
  "description": "Windows computer use for DeepSeek Harness: an MCP stdio server + PowerShell UIA backend, bridged into DSH via @deepseek-ai/dsh-mcp-client. Read/act on real Windows desktop apps (UI Automation tree, screenshots, typed input, OCR, window management).",
  "type": "module",
  "bin": {
    "wcu-mcp": "mcp/server.mjs"
  },
  "main": "mcp/dsh-plugin.mjs",
```

**依据 2 · 源码核查**：[package.json:77-82](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/package.json#L77-L82)

Node/Windows约束。

```text
  "engines": {
    "node": ">=22"
  },
  "os": [
    "win32"
  ],
```

**依据 3 · 源码核查**：[mcp/dsh-plugin.mjs:71-85](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/dsh-plugin.mjs#L71-L85)

桥启动本地stdio MCP与设置环境。

<details>
<summary>查看原文（15行）</summary>

```text
export function bridgeConfig(config = {}, runtime = {}) {
  const settings = normalizeSettings(config);
  return {
    serverName: 'wincu', transport: 'stdio', command: process.execPath,
    args: [fileURLToPath(new URL('./server.mjs', import.meta.url))],
    env: { ELECTRON_RUN_AS_NODE: '1', WCU_BROWSER_HEADLESS: settings.browserVisible?'0':'1', WCU_BROWSER_APP: settings.browserApp, WCU_BROWSER_SIGNIN: settings.browserSignIn?'1':'0', WCU_TOOL_MODE: settings.toolPreset==='lazy'?'lazy':settings.mode, WCU_ENABLED_TOOLS: JSON.stringify(enabledToolsForSettings(settings)), WCU_SETTINGS_JSON: JSON.stringify(settings),
      ...(runtime.configFile ? { WCU_CONFIG_FILE: runtime.configFile, WCU_STATE_FILE: runtime.stateFile } : {}),
      ...(runtime.activityFile ? {WCU_ACTIVITY_FILE:runtime.activityFile}: {}),
      ...(runtime.notices ? {WCU_ADAPTER_NOTICES:JSON.stringify(runtime.notices)}: {}) },
    toolCallTimeoutMs: config.toolCallTimeoutMs ?? 90000,
    failOnStartupError: config.failOnStartupError ?? false
  };
}
export async function apply(ctx, config) {
  const bridge = await import('@deepseek-ai/dsh-mcp-client');
```

</details>

**依据 4 · 源码核查**：[README.md:32-47](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/README.md#L32-L47)

作者交互式Desktop安装说明。

<details>
<summary>查看原文（16行）</summary>

````text
你需要一台 Windows 电脑，并且已经装好 DSH Desktop。插件用的是 Windows 自带的 PowerShell 5.1，不用另外安装。

1. 右键点击任务栏托盘里的 DSH 图标，选“打开 DSH 终端”，然后运行：

   ```powershell
   dsh plugin --profile desktop add dsh-computer-use-win
   ```

2. 再右键托盘图标，选“退出”，然后重新打开 DSH Desktop。只关掉窗口不够：窗口关了，DSH 还在托盘里运行，不会加载新装的插件。
3. 打开 **设置 → 电脑操控**（鼠标图标）看看各项选项。不改也能直接用，默认加载全部工具。然后给 agent 布置一个桌面任务，比如[第 6 节](#6-使用示例)里的例子。

#### 1.2 升级

运行同一条安装命令，然后像上面第 2 步那样完全退出、再重新打开 DSH Desktop。

命令里的 `desktop` 是 DSH Desktop 使用的配置（profile）。如果装到了别的 profile，正在用的 DSH 不会有任何变化。
````

</details>

**依据 5 · 源码核查**：[README.md:66-81](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/README.md#L66-L81)

单独MCP与DSH专有反馈边界。

<details>
<summary>查看原文（16行）</summary>

````text
不在 DSH 里，也可以让任何 MCP 客户端启动它：

```json
{
  "mcpServers": {
    "wincu": {
      "command": "npx",
      "args": ["-y", "dsh-computer-use-win"]
    }
  }
}
```

DSH Web 和单独的 MCP 客户端会用你电脑上的 Node.js 运行插件，需要 22 或更高版本。DSH Desktop 自带运行环境，不用另装 Node.js。

单独运行时默认加载全部工具。设置环境变量 `WCU_TOOL_MODE=lite` 只加载常用工具，`WCU_TOOL_MODE=lazy` 开始时只加载管理入口。也可以在 `WCU_ENABLED_TOOLS` 里写一个 JSON 数组，指定允许哪些工具。设置页、对话里的操作记录和整轮提示只有在 DSH 里才有。详见[工具加载说明](docs/tool-context.md)。
````

</details>

#### 缺口

- 未验证当前Windows/DSH代际、原生控件及浏览器组合。
  **影响**：源码接线不证明任意Windows应用动作、停止或真实业务结果。
  **进一步探讨**：固定Windows/宿主版本，在无业务账号的记事本和本地示例网页做完整动作/停止核对。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实动作链与结果确认边界是什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

DSH apply导入dsh-mcp-client，把server.mjs作为Node子进程stdio启动；服务处理tools/call，桌面路径再spawn PowerShell -Sta -ExecutionPolicy Bypass运行固定windows-uia.ps1 Persistent，通过JSON请求响应。这证明存在实际系统输入链而非仅截图建议。网页browserTab走单独浏览器lane，背景读/写页面避免前台鼠标键盘；桌面则优先背景模式，若明确WCU_NEEDS_INPUT才升级带接管的真实输入，不是所有动作都悄悄抢焦点。

PS坐标点击会临时借目标前台、校点被哪个窗口覆盖，非目标进程覆盖时报POINT_COVERED；按windowTitle缓存HWND/PID若五分钟内身份变化拒绝，过期则重新基线，故不保证旧坐标始终安全。UIA/OCR/截图只是定位证据，各有稀疏/比例/内容变化问题。server对输入回执标verification=sent或unconfirmed，并明确要wait_for或新观察核效果；sent只代表派发，不是点击触发业务成功，更不是提交/付款已被授权。某些输入返回verifyValue也只是一项控件值，不能替代整项任务验收。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/dsh-plugin.mjs:71-85](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/dsh-plugin.mjs#L71-L85)

实际MCP桥。

<details>
<summary>查看原文（15行）</summary>

```text
export function bridgeConfig(config = {}, runtime = {}) {
  const settings = normalizeSettings(config);
  return {
    serverName: 'wincu', transport: 'stdio', command: process.execPath,
    args: [fileURLToPath(new URL('./server.mjs', import.meta.url))],
    env: { ELECTRON_RUN_AS_NODE: '1', WCU_BROWSER_HEADLESS: settings.browserVisible?'0':'1', WCU_BROWSER_APP: settings.browserApp, WCU_BROWSER_SIGNIN: settings.browserSignIn?'1':'0', WCU_TOOL_MODE: settings.toolPreset==='lazy'?'lazy':settings.mode, WCU_ENABLED_TOOLS: JSON.stringify(enabledToolsForSettings(settings)), WCU_SETTINGS_JSON: JSON.stringify(settings),
      ...(runtime.configFile ? { WCU_CONFIG_FILE: runtime.configFile, WCU_STATE_FILE: runtime.stateFile } : {}),
      ...(runtime.activityFile ? {WCU_ACTIVITY_FILE:runtime.activityFile}: {}),
      ...(runtime.notices ? {WCU_ADAPTER_NOTICES:JSON.stringify(runtime.notices)}: {}) },
    toolCallTimeoutMs: config.toolCallTimeoutMs ?? 90000,
    failOnStartupError: config.failOnStartupError ?? false
  };
}
export async function apply(ctx, config) {
  const bridge = await import('@deepseek-ai/dsh-mcp-client');
```

</details>

**依据 2 · 源码核查**：[mcp/server.mjs:786-805](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L786-L805)

常驻PowerShell命令和IPC。

<details>
<summary>查看原文（20行）</summary>

```text
function spawnBackend() {
  let backendBuf = "";
  const proc = backendProc = spawn(
    powershell,
    [
      "-NoLogo",
      "-NoProfile",
      "-Sta",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      backendPath,
      "-Persistent"
    ],
    {
      cwd: pluginRoot,
      env: { ...process.env, WCU_CANCEL_EVENT: takeover.disabledForTest ? '' : takeover.eventName },
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    }
```

</details>

**依据 3 · 源码核查**：[mcp/server.mjs:891-917](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L891-L917)

背景探测失败才升级接管输入。

<details>
<summary>查看原文（27行）</summary>

```text
  const quiet = isQuietCall(action, args);
  const mayUpgrade = BACKGROUND_FIRST.has(action) || (action === 'click' && (args.dispatch ?? 'auto') === 'auto' && args.elementId != null);
  if (quiet && mayUpgrade) {
    try { return await runBackendOnce(action, { ...args, _wcuQuiet: true }, timeoutMs, request, true); }
    catch (error) { if (!/^WCU_NEEDS_INPUT\b/.test(error.message) || request?.cancelled) throw error; }
    return runBackendOnce(action, args, timeoutMs, request, false);
  }
  return runBackendOnce(action, { ...args, _wcuQuiet: quiet }, timeoutMs, request, quiet);
}

async function runBackendOnce(action, args, timeoutMs, request, quiet) {
  const changesDesktop = action!=='health';
  let acquired = false;
  // Reserve preparation in arrival order. Otherwise awaiting the native
  // indicator can let a later observation reach the backend before its input.
  const prepared = takeoverSetup.then(async () => {
    if (request?.cancelled) throw new Error(request.stoppedByUser ? STOPPED : 'COMPUTER_USE_CANCELLED');
    if (changesDesktop) { await takeover.begin({ quiet }); acquired = true; }
  });
  takeoverSetup = prepared.catch(() => {});
  try {
    await prepared;
    if (request?.cancelled) throw new Error(request.stoppedByUser ? STOPPED : 'COMPUTER_USE_CANCELLED');
    // The series lets typing without a window target follow the window the
    // series last gave input to, after the user got the foreground back.
    return await dispatchBackend(action, { ...args, _wcuCornerFailsafe: false, _wcuTakeoverPid: takeover.child?.pid ?? 0, _wcuSeries: takeover.seriesKey ?? null }, timeoutMs, request);
  } finally { if (acquired) await takeover.end({ quiet }); }
```

</details>

**依据 4 · 源码核查**：[scripts/windows-uia.ps1:810-843](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/scripts/windows-uia.ps1#L810-L843)

借前台和点覆盖拒绝。

<details>
<summary>查看原文（34行）</summary>

```text
# Before real input: note the window in front and the pointer, then bring the
# target (a top-level window, or 0 for whatever is in front) forward. With
# -NoActivate the input itself brings it forward (a click on an uncovered
# point, a UIA SetFocus); it is given back all the same.
function Start-Input {
  param([object]$InputObject, [long]$Hwnd, [switch]$NoActivate)
  $cursor = New-Object WindowsComputerUseNative+POINT
  [void][WindowsComputerUseNative]::GetCursorPos([ref]$cursor)
  $state = @{ user = [WindowsComputerUseNative]::GetForegroundWindow().ToInt64(); target = [int64]$Hwnd; keep = [bool](Get-Prop $InputObject 'activate' $false)
    cursor = $cursor; moved = $null; borrowed = $false; procId = (Get-WindowProcessId $Hwnd); popups = @() }
  if ($state.target -and $state.user -ne $state.target) {
    $state.popups = @([WindowsComputerUseNative]::VisiblePopups([uint32]$state.procId))
    if (-not $NoActivate -and -not (Set-WindowForeground ([pscustomobject]@{ nativeWindowHandle = $state.target }))) {
      throw 'The target window could not be brought to the foreground (Windows foreground lock), so no input was sent. Try again, or call activate_window first.'
    }
    $state.borrowed = $true
  }
  return $state
}

# Real input lands on whatever shows at the point. With the target in front,
# the point must show the target or a window of its process (its menu, list or
# dialog); otherwise nothing is sent. WindowFromPoint skips the DSH indicator,
# which is layered and click-through.
function Assert-PointOnTarget {
  param([int]$X, [int]$Y, [long]$Target)
  if (-not $Target) { return }
  $hit = Get-RootWindowAt $X $Y
  if ($hit -eq $Target -or ((Get-WindowProcessId $hit) -eq (Get-WindowProcessId $Target))) { return }
  $title = New-Object System.Text.StringBuilder 256
  [void][WindowsComputerUseNative]::GetWindowText([IntPtr]$hit, $title, 256)
  $class = New-Object System.Text.StringBuilder 128
  [void][WindowsComputerUseNative]::GetClassName([IntPtr]$hit, $class, 128)
  throw "POINT_COVERED: ($X,$Y) shows another window ('$($title.ToString())', class $($class.ToString()), HWND $hit) above the target, so no input was sent. Move or close that window, or pick a point of the target that is not covered."
```

</details>

**依据 5 · 源码核查**：[scripts/windows-uia.ps1:1086-1109](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/scripts/windows-uia.ps1#L1086-L1109)

窗口身份校验与五分钟重基线。

<details>
<summary>查看原文（24行）</summary>

```text
function Assert-WindowIdentity {
  param([object]$InputObject, [object]$Target)
  $title = [string](Get-Prop $InputObject "windowTitle" "")
  if ([string]::IsNullOrWhiteSpace($title) -or $null -eq $Target) { return }
  $key = $title.Trim().ToLowerInvariant()
  $hwnd = if (Get-Prop $Target 'nativeWindowHandle' 0) { [int64]$Target.nativeWindowHandle } else { Invoke-Safe { [int64]$Target.Current.NativeWindowHandle } 0 }
  $procId = if (Get-Prop $Target 'processId' 0) { [int]$Target.processId } else { Invoke-Safe { [int]$Target.Current.ProcessId } 0 }
  $cached = $script:WindowIdentity[$key]
  if ($null -eq $cached) {
    # First sighting of this title: baseline it, no check.
    $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = [DateTimeOffset]::Now.ToUnixTimeMilliseconds() }
    return
  }
  $now = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
  if (($now - [int64]$cached.ts) -gt 300000) {
    # Stale baseline (older than 5 min): silently re-baseline rather than
    # failing on a long-ago observation.
    $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = $now }
    return
  }
  if ($hwnd -ne [int64]$cached.hwnd -or $procId -ne [int]$cached.pid) {
    throw "identity_changed: the window titled '$title' is a different window than when last observed (HWND $([int64]$cached.hwnd) -> $hwnd, PID $([int]$cached.pid) -> $procId). The app may have restarted or the window was recreated. Re-observe with snapshot before acting."
  }
  $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = $now }
```

</details>

**依据 6 · 源码核查**：[mcp/server.mjs:1078-1085](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L1078-L1085)

sent与unconfirmed回执非效果确认。

```text
const inputActions = new Set(["click", "double_click", "move", "drag", "scroll", "type_text", "keypress", "focus", "invoke", "set_value", "activate_window", "close_window", "move_window"]);
async function backendText(action, args, timeoutMs, request) {
  const result = await runBackend(action, args, timeoutMs, request);
  if (inputActions.has(action)) {
    result.verification = result.moved === false || result.posted === false || result.activated === false ? "unconfirmed" : "sent";
    result.verificationNote = result.verification === "sent" ? "The action was dispatched. Use wait_for or a fresh observation to verify the expected effect." : "Windows did not confirm dispatch. Inspect the warning and observe the target before retrying.";
  }
  return { content: [{ type: "text", text: safeJson(stripImagePayload(result)) }] };
```

**依据 7 · 源码核查**：[mcp/server.mjs:1121-1138](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L1121-L1138)

tools/call错误与取消反馈。

<details>
<summary>查看原文（18行）</summary>

```text
  if (method === "tools/call") {
    const request = { proc: null };
    pendingToolCalls.set(id, request);
    try {
      const result = await callTool(params?.name, params?.arguments === undefined ? {} : params.arguments, request);
      if (request.cancelled) return { jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: request.takeoverError || "COMPUTER_USE_CANCELLED_AFTER_CURRENT_ACTION" }] } };
      return { jsonrpc: "2.0", id, result };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: request.takeoverError || (error instanceof Error ? error.message : String(error)) }]
        }
      };
    } finally {
      if (pendingToolCalls.get(id) === request) pendingToolCalls.delete(id);
```

</details>

#### 缺口

- 未实测UIA控件、坐标偏移、OCR、网页导航和实际业务完成。
  **影响**：源码接线不证明任意Windows应用动作、停止或真实业务结果。
  **进一步探讨**：在目标测试应用移动/遮挡/重建窗口、改页面、模拟慢响应，核拒绝和动作后真实状态，不以sent当通过。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Esc/停止是否撤销动作，浏览器登录和数据边界如何？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

接管begin检查当前series是否blocked/paused，非quiet动作才启动可见提示和停止按键；quiet浏览器调用同样计活动和查暂停，但不显示桌面提示、不武装Esc。因此“按Esc随时停止”不能推广为所有背景网页动作都有同样快捷键路径；可用宿主停止还需实际验收。Esc触发暂停并记录blockedSeries，本轮不应重试输入，新用户轮可以恢复，这不是永久禁用。

MCP取消对尚未发送请求直接拒绝，部分只读可杀worker；已发输入为避免按键/鼠标悬挂，要让key-up清理后退役worker，仍受原超时限制。取消响应明确可为AFTER_CURRENT_ACTION，不能撤销已写文本、已提交网页或启动的应用。Agent应重新观察确定是否已发生，再决定续做；当前代表链没有提供通用业务撤销事务。

浏览器使用自身临时或保留profile，记住登录会保留cookies；Edge保留profile可能继承Windows Microsoft账号登录，这是源码明确说明，独立目录不能当无登录/安全沙箱。截图、树、OCR、输入和控件值会成为模型/宿主可见内容，是否上传与保留由宿主模型/记录决定，本轮未完整审计数据流，不承诺本地执行等于数据永不离机。首次需profile、可访问权限、浏览器和停止路径确认；持续有模型截图上下文与进程资源，金额未知；失败要核焦点、输入、cookies、迟到动作和应用状态，退出不撤实际副作用。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/takeover.mjs:122-150](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/takeover.mjs#L122-L150)

quiet不武装停止键，series暂停。

<details>
<summary>查看原文（29行）</summary>

```text
  // A quiet lease (browser-lane calls) checks the stopped state and counts as an
  // action in progress, but neither shows the indicator nor arms the stop keys.
  async begin({ quiet = false } = {}) {
    await this.sync();
    if(this.seriesHeld&&this.blockedSeries.has(this.seriesKey))throw new Error(this.blockedSeries.get(this.seriesKey));
    if(this.paused&&!this.activityFile&&this.active===0)await this.resumeOperation();
    if (this.paused) throw new Error(this.pauseMessage);
    if (this.closed) throw new Error('COMPUTER_USE_STOPPING');
    if (!quiet&&!this.disabledForTest&&(!this.seriesHeld||!this.seriesIndicator||!this.child)) {
      try { await this.command('begin', this.config); this.sentShortcut = this.config.stopShortcut; this.sentCursorIndicator = this.config.cursorIndicatorEnabled;this.sentRemoteVisible=this.config.remoteIndicatorVisible; }
      catch (error) { this.fail(error); throw error; }
    }
    if (this.paused) throw new Error(this.pauseMessage);
    this.active++; if (!quiet) this.shown++; this.persist();
  }
  async end({ quiet = false } = {}) {
    this.active = Math.max(0, this.active - 1); if (!quiet) this.shown = Math.max(0, this.shown - 1); this.persist(this.paused ? 'stopped-by-user' : null);
    if (!quiet && this.shown === 0 && !(this.seriesHeld&&this.seriesIndicator)&&this.child && !this.paused) await this.command('end').catch(error => this.fail(error));
  }
  fail(error) {
    if (this.closed || this.paused) return;
    this.paused = true;
    this.stoppedSeriesKey=this.seriesKey;
    this.pauseMessage = error?.message === STOPPED ? STOPPED : `COMPUTER_USE_PAUSED: ${error?.message ?? error}. This operation series is paused. Do not retry in this turn; a new user turn can retry the desktop connection.`;
    if(this.seriesKey!==null)this.blockedSeries.set(this.seriesKey,this.pauseMessage);
    this.persist(String(error?.message ?? error));
    // This also covers a control-file or presentation failure while input runs.
    this.child?.stdin.write(JSON.stringify({command:'stop'})+'\n',()=>{});
    this.onStop(new Error(this.pauseMessage));
```

</details>

**依据 2 · 源码核查**：[mcp/takeover.mjs:8-8](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/takeover.mjs#L8-L8)

停止后本轮不重试、新轮恢复语义。

```text
export const STOPPED = 'COMPUTER_USE_STOPPED_BY_USER: The user stopped this operation series with Esc or their custom shortcut. Do not retry desktop input in this turn. A new user turn, including a request to continue, can use the desktop automatically; no settings change is required.';
```

**依据 3 · 源码核查**：[mcp/server.mjs:750-769](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L750-L769)

取消不撤已发输入，等待key-up清理。

<details>
<summary>查看原文（20行）</summary>

```text
function cancelBackendRequest(request) {
  if (request) request.cancelled = true;
  const proc = request?.proc;
  const entry = [...backendWaiters.entries()].find(([, w]) => w.request === request);
  if (!proc || !entry) return;
  const [id, w] = entry;
  const error = new Error("COMPUTER_USE_CANCELLED");
  if (!w.sent) {
    backendWaiters.delete(id); clearTimeout(w.timer); w.reject(error);
    return;
  }
  // Read tools may activate a target, including an Alt press/release in the
  // foreground helper. Let those calls finish just like explicit input actions.
  if (interruptibleActions.has(w.action) && !w.args?.activate) {
    killBackend(error, proc);
    return;
  }
  // Input routines may currently hold a button/key. Let their key-up cleanup finish,
  // but discard every not-yet-started action and retire this worker immediately after.
  // The existing timeout still bounds cleanup; cancellation does not extend it.
```

</details>

**依据 4 · 源码核查**：[mcp/server.mjs:1125-1126](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L1125-L1126)

AFTER_CURRENT_ACTION回执。

```text
      const result = await callTool(params?.name, params?.arguments === undefined ? {} : params.arguments, request);
      if (request.cancelled) return { jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: request.takeoverError || "COMPUTER_USE_CANCELLED_AFTER_CURRENT_ACTION" }] } };
```

**依据 5 · 源码核查**：[mcp/browser.mjs:14-28](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/browser.mjs#L14-L28)

独立profile、保留登录及Edge账号边界。

<details>
<summary>查看原文（15行）</summary>

```text
const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
// The browser the lane runs is the one picked in settings, else the Windows
// default, always on a profile of its own: a throwaway one per launch or, with
// sign-ins kept, one kept profile per browser, in which the sites the user
// signed in to stay signed in. The user's own browser is never used: it lets a
// program in only after the user allows it there, at every connection.
const APPS = {
  chrome: { name: 'Google Chrome', exe: 'Google/Chrome/Application/chrome.exe' },
  edge: { name: 'Microsoft Edge', exe: 'Microsoft/Edge/Application/msedge.exe' }
};
// When the default browser is neither, Chrome comes first: Edge signs every
// new profile in with the Windows Microsoft account and sets that account's
// cookies; no switch, profile preference or profile directory turns this off
// (Edge 156). Throwaway-profile tabs never see them (they run in an isolated
// context); on a kept Edge profile, Microsoft's sites are signed in.
```

</details>

**依据 6 · 源码核查**：[mcp/browser.mjs:798-810](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/browser.mjs#L798-L810)

保留cookies和临时profile实现。

<details>
<summary>查看原文（13行）</summary>

```text
    const headless = this.env.WCU_BROWSER_HEADLESS === '1';
    let profile;
    if (this.keepSignIns) {
      profile = this.keptDir(executable);
      mkdirSync(profile, { recursive: true });
      const running = await this.keptBrowser(profile, executable);
      if (running) return this.prepareAgent(running);
      // A headless browser would reopen the last tabs; with no session files
      // there are none. The session cookies stay (they are kept by the switch).
      rmSync(path.join(profile, 'Default', 'Sessions'), { recursive: true, force: true });
    } else profile = mkdtempSync(path.join(this.agentDir, `profile-${process.pid}-`));
    // Temporary browsers belong to this server. Kept browsers and their cleanup
    // watcher are detached so another active MCP client can retain them.
```

</details>

#### 缺口

- 停止快捷键全路径、截图/日志留存及登录清理没有实测/全审。
  **影响**：源码接线不证明任意Windows应用动作、停止或真实业务结果。
  **进一步探讨**：隔离Windows测试按住键/拖动/慢输入时停止，核释放和不重试；核浏览器cookies、profile清除、宿主记录和模型请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可以推荐哪种具体试用，值得验证什么？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议只在无真实账号、可丢弃文件的Windows测试桌面试用，如记事本写入一段文本和本地示例网页填表但不提交。先观察应用/字段，再逐动作核对，遮挡/身份变化或未确认就停；不把它直接推荐为无人值守付款、发信、删文件或重要后台操作。用户明确动作范围和可见停止入口是实际采用条件，业务授权不是工具派发自动获得。

首次安装和宿主重启、UIA/权限/浏览器适配需要人工，持续有提示、观察轮次、模型视觉token和profile清理成本，现金耗时未知；失败恢复是核实际结果并手动回退或重做，某些业务无法撤销。若已存在稳定API，比较同一合格任务的误点、漏项、重做、人工接管与资源消耗，不从背景鼠标不动推算节省。

未验证方向是为每个动作组合“观察版本/目标身份/派发状态/实际后条件/是否可撤”的证据收据，并在结果未知时禁止业务层盲重试。现有HWND/PID检查和sent回执提供起点，增量必须超出当前观察提示。最小测试用遮挡、窗口替换、页导航和提交后丢响应，对比当前工具提示与显式后条件；若不能降低误确认/重复提交，或确认负担反增则停止。没有用户需求与付费证据，不把它算当前安全自动化能力。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/server.mjs:1078-1085](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L1078-L1085)

已有派发/后观察语义。

```text
const inputActions = new Set(["click", "double_click", "move", "drag", "scroll", "type_text", "keypress", "focus", "invoke", "set_value", "activate_window", "close_window", "move_window"]);
async function backendText(action, args, timeoutMs, request) {
  const result = await runBackend(action, args, timeoutMs, request);
  if (inputActions.has(action)) {
    result.verification = result.moved === false || result.posted === false || result.activated === false ? "unconfirmed" : "sent";
    result.verificationNote = result.verification === "sent" ? "The action was dispatched. Use wait_for or a fresh observation to verify the expected effect." : "Windows did not confirm dispatch. Inspect the warning and observe the target before retrying.";
  }
  return { content: [{ type: "text", text: safeJson(stripImagePayload(result)) }] };
```

**依据 2 · 源码核查**：[scripts/windows-uia.ps1:1086-1109](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/scripts/windows-uia.ps1#L1086-L1109)

身份基线可支撑版本收据。

<details>
<summary>查看原文（24行）</summary>

```text
function Assert-WindowIdentity {
  param([object]$InputObject, [object]$Target)
  $title = [string](Get-Prop $InputObject "windowTitle" "")
  if ([string]::IsNullOrWhiteSpace($title) -or $null -eq $Target) { return }
  $key = $title.Trim().ToLowerInvariant()
  $hwnd = if (Get-Prop $Target 'nativeWindowHandle' 0) { [int64]$Target.nativeWindowHandle } else { Invoke-Safe { [int64]$Target.Current.NativeWindowHandle } 0 }
  $procId = if (Get-Prop $Target 'processId' 0) { [int]$Target.processId } else { Invoke-Safe { [int]$Target.Current.ProcessId } 0 }
  $cached = $script:WindowIdentity[$key]
  if ($null -eq $cached) {
    # First sighting of this title: baseline it, no check.
    $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = [DateTimeOffset]::Now.ToUnixTimeMilliseconds() }
    return
  }
  $now = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
  if (($now - [int64]$cached.ts) -gt 300000) {
    # Stale baseline (older than 5 min): silently re-baseline rather than
    # failing on a long-ago observation.
    $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = $now }
    return
  }
  if ($hwnd -ne [int64]$cached.hwnd -or $procId -ne [int]$cached.pid) {
    throw "identity_changed: the window titled '$title' is a different window than when last observed (HWND $([int64]$cached.hwnd) -> $hwnd, PID $([int]$cached.pid) -> $procId). The app may have restarted or the window was recreated. Re-observe with snapshot before acting."
  }
  $script:WindowIdentity[$key] = @{ hwnd = $hwnd; pid = $procId; ts = $now }
```

</details>

**依据 3 · 源码核查**：[mcp/server.mjs:750-769](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/mcp/server.mjs#L750-L769)

已发副作用不能取消的设计依据。

<details>
<summary>查看原文（20行）</summary>

```text
function cancelBackendRequest(request) {
  if (request) request.cancelled = true;
  const proc = request?.proc;
  const entry = [...backendWaiters.entries()].find(([, w]) => w.request === request);
  if (!proc || !entry) return;
  const [id, w] = entry;
  const error = new Error("COMPUTER_USE_CANCELLED");
  if (!w.sent) {
    backendWaiters.delete(id); clearTimeout(w.timer); w.reject(error);
    return;
  }
  // Read tools may activate a target, including an Alt press/release in the
  // foreground helper. Let those calls finish just like explicit input actions.
  if (interruptibleActions.has(w.action) && !w.args?.activate) {
    killBackend(error, proc);
    return;
  }
  // Input routines may currently hold a button/key. Let their key-up cleanup finish,
  // but discard every not-yet-started action and retire this worker immediately after.
  // The existing timeout still bounds cleanup; cancellation does not extend it.
```

</details>

**依据 4 · 源码核查**：[README.md:17-23](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/6fb642129595a6357588c70812974951db304662/README.md#L17-L23)

作者观察定位执行确认循环。

```text
这个插件让 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）里的 agent 看到并操作你电脑上真实的 Windows 程序和网页：找到按钮和输入框，读出屏幕上的文字，点击、打字，切换和管理窗口。网页默认在 DSH 自己的浏览器里后台完成，不动你的鼠标，也不抢前台。

**网页在后台完成 · 24 个桌面工具 + 1 个管理入口 · 用到鼠标键盘时有明显提示 · 按 Esc 随时停止 · 中英文设置界面**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/diagrams/how-it-works-zh-dark.png">
  <img alt="使用流程图。第 1 步：右键托盘图标打开 DSH 终端，运行安装命令，再退出并重新打开 DSH Desktop；设置里“浏览器操控（Browser Use）”下的“网页优先用浏览器操控”和“显示浏览器窗口”默认打开，不改也能直接用。第 2 步：在对话里布置任务，对话中出现“输入了文本”“发送了按键”“检查了操作结果”等记录。第 3 步：网页在 DSH 浏览器里后台操作，它的窗口框是 DSH 蓝，正在操作的标签页图标换成蓝色箭头，网页上一个小箭头标出它点的位置，不遮挡网页；你正在用的窗口留在前面，鼠标不受影响，点 DSH 的停止按钮可以停止；操作桌面程序、用到鼠标键盘时，屏幕边缘发亮，出现“DSH 正在控制电脑”提示条和鼠标旁的 DSH 标签，按 Esc 立即停止这一轮。下方是 agent 每一步的循环：观察、定位、执行、确认，网页和桌面程序用同一套工具，没达到目标就再观察一次。" src="assets/diagrams/how-it-works-zh-light.png">
```

#### 缺口

- 没有真实用户任务收益、控制失误率或后条件收据实验。
  **影响**：源码接线不证明任意Windows应用动作、停止或真实业务结果。
  **进一步探讨**：在新无敏感任务上对比人工/API和当前/收据方案，记录完成质量、错误、接管、时间和费用后决定。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
