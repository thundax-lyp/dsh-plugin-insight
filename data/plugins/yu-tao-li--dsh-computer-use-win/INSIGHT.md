# Windows 电脑操控

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e136fcb](https://github.com/Yu-tao-Li/dsh-computer-use-win/tree/e136fcb87b2eb88d7192531b7ab941b475482ec6)

<!-- BEGIN META -->
[![GitHub ★ 683](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=683&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yu-tao-Li/dsh-computer-use-win) [![npm 30d 32,163](https://img.shields.io/static/v1?label=npm+30d&message=32%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use-win) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use-win)
<!-- END META -->

> **功能**：在 DSH 中读取和操作 Windows 桌面与浏览器，支持界面树、截图、文字识别、输入和窗口管理。

> **亮点**：在同一个 DSH 会话里分流浏览器后台操作和真实 Windows 输入。可连续执行已校验的短步骤，报告最后一步引发的窗口或页面变化。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：Windows 后台投递可能只确认入队，应用未必实际接受。停止或批量提前退出后，已发生的操作仍需现场核对和恢复。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 宿主怎样注册、路由和展示两类工具？](#detail-section-11)
  - [Q02 · 后台输入、真实输入和 WSL 互操作分别如何失败？](#detail-section-12)
  - [Q03 · 批量末步导航和中途变更对结果有何影响？](#detail-section-13)
  - [Q04 · OCR 的小字优化与工程修复改善哪些情况？](#detail-section-14)
  - [Q05 · 何时值得试用，怎样验证高影响动作的确认成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH 会话内处理 Windows 桌面程序或网页、并能核对每个动作结果的用户。适合先验证可撤销且无敏感数据的短流程。见 [Q01](#research-q01)、[Q05](#research-q05)。

人工操作便于即时确认窗口和弹窗，固定脚本适合界面稳定的重复任务。插件增加同一模型会话中的结构化观察和动作回执。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Windows UIA 与 OCR | 读控件和截图文字 | 受保护桌面或不可读区域受限制 |
| 浏览器通道 | 定位网页控件和后台操作 | 须核专用浏览器或用户授权 |
| 后台输入与接管 | 向明确控件输入，并响应停止 | 投递后需要回读，真实输入依赖监听助手 |
| 单目标批量 | 完成已计划的短操作串 | 未确认或中途目标变化时停止 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 及 MCP 桥 | DSH 接入必需 | 挂载设置和工具，启动服务 | 无法注册或启动子进程 |
| Windows、PowerShell 和桌面会话 | 原生桌面操作必需 | UIA、截图与输入 | 无桌面或受保护窗口时缩小范围 |
| 接管助手 | 真实输入需要 | 监督键鼠及响应停止 | 拒绝真实输入，允许安静读取 |
| 支持的浏览器与授权 | 浏览器操控需要 | 选择专用或用户已打开浏览器 | 连接失败后改用人工或独立浏览器 |
| WSL 互操作 | 从 WSL 使用时需要 | 启动 Windows 程序和传递路径 | 核对实际安装及互操作环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在兼容 Windows DSH profile 加载插件，只启用所需工具 | 查看健康状态和工具列表 |
| 定位 | 先读窗口或专用浏览器标签 | 核对唯一目标和可读字段 |
| 执行 | 对测试数据执行单步或短批量 | 每步查看是否送达，最终读回应用状态 |
| 退出 | 出现未确认输入或意外弹窗时停止 | 人工核对已经发生的动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Windows、宿主、浏览器和模型 | 配置并核工具范围 | 安装与验证耗时未知 |
| 持续使用 | 模型调用、OCR、浏览器和 PowerShell | 核对象、回执和退出 | 任务级用量及时间未知 |
| 失败恢复 | 保留现场与测试数据 | 暂停并检查实际应用状态 | 停止后恢复成本取决于已执行动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Windows 与浏览器路由 | 按目标类型选择独立通道 | 真实目标识别成功率 |
| 输入与停止 | 区分后台投递、结果核对和真实输入保护 | WSL 与不同控件的兼容范围 |
| 短批量 | 保留逐步结果和末步变化 | 任务节省时间与业务完成率 |
| 文字识别 | 小字二次识别受像素预算约束 | 普遍准确率及延迟 |

按同一合格任务比较应用最终状态与人工操作。确认成本和运行费用分别记录。

> **思考**：Windows 后台投递可能只确认入队，应用未必实际接受。停止或批量提前退出后，已发生的操作仍需现场核对和恢复。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在同一个 DSH 会话里分流浏览器后台操作和真实 Windows 输入。可连续执行已校验的短步骤，报告最后一步引发的窗口或页面变化。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

宿主适配器实际注册官方桥。客户端关联新旧消息结构，临时布局保存失败做有界退避。输入处理区分前台接管和后台回读，OCR 通过 .NET 文件调用整理助手临时件。

<a id="detail-section-5"></a>

### 1.4 主要限制

Windows 后台投递可能只确认入队，应用未必实际接受。停止或批量提前退出后，已发生的操作仍需现场核对和恢复。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可在隔离 Windows 桌面先试无敏感数据的草稿填写。出现未核实输入、窗口不符或停止后仍有动作时退出，并在目标应用人工核查。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持原生工具接线、接管失败分流和批量结果表达。OCR 效果及真实 WSL 停止时序尚未独立复现，提交前确认仍是待验证方案。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、mcp/dsh-plugin.mjs、mcp/client.js、cordis.patch.yml、mcp/server.mjs、mcp/activity.mjs、scripts/windows-uia.ps1、mcp/takeover.mjs、CHANGELOG.md、mcp/browser.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查 DSH 路由、原生焦点、WSL、批量及 OCR，浏览器协议实现和完整 PowerShell 安全边界仅抽读。未执行安装、目标代码、测试或真实宿主操作。
- 下一步：在隔离 Windows 环境分别核后台字段、Esc、批量中途与末步变化，以及文字识别小样本。实际业务任务先对照人工结果再扩大范围。

**分析版本**

- **仓库**：[Yu-tao-Li/dsh-computer-use-win](https://github.com/Yu-tao-Li/dsh-computer-use-win)
- **版本号**：0.5.7（[固定提交 e136fcb](https://github.com/Yu-tao-Li/dsh-computer-use-win/tree/e136fcb87b2eb88d7192531b7ab941b475482ec6)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在实际提交前展示固定目标和变更摘要，再等待本人确认。对照测试若发现确认仍允许过期目标或耗时高于人工，退回手动提交。见 [Q05](#research-q05)。

在隔离 Windows 环境分别核后台字段、Esc、批量中途与末步变化，以及文字识别小样本。实际业务任务先对照人工结果再扩大范围。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 862 | 787 | 72 | — |
| .mjs | source | 12 | 5353 | 4627 | 564 | — |
| .md | source | 17 | 3017 | — | — | 83346 |
| .mjs | test | 56 | 5404 | 4876 | 435 | — |
| .cjs | test | 2 | 474 | 443 | 32 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 如何在 Windows 上选中真实桌面和网页目标，在不干扰用户与可核对操作之间取舍？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 宿主怎样注册、路由和展示两类工具？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

适合需要在没有任务 API 的旧桌面程序里查状态并做少量操作，同时在普通网页执行可核对步骤的 Windows DSH 用户。手工逐步操作最容易确认对话框，固定脚本适合控件稳定且任务重复的环境。插件增加了同一 DSH 会话里的观察与动作反馈。宿主 Cordis 补丁挂载根包，根适配器调用 DSH MCP 桥，以当前 Node 或 Electron 启动打包的 server.mjs。配置向子进程传递工具范围、浏览器选择及设置路径。服务先核工具启用状态、校验参数，再根据浏览器标签或页面元素标识选择浏览器路径，否则走桌面工具。列窗可能补浏览器可见标签信息，浏览器枚举失败会单独返回错误。

客户端进度中，turn/start 启动一轮，同一轮工具调用、结果与结束是更新。读取新版 toolCallId 或旧版嵌套 tool-result，才能把动作关联到结果。该展示是已收到的事件状态。进度内容可写本机活动文件，关闭浮窗或保留期结束时不继续写出进度文本。需核同版本宿主的工具可见性及对话回放。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:12-16](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/cordis.patch.yml#L12-L16)

固定补丁挂载同名根包。

```text
- insert:
    - id: mcp-dsh-computer-use-win
      name: 'dsh-computer-use-win'
      config:
        mode: full
```

**依据 2 · 源码核查**：[mcp/dsh-plugin.mjs:135-151](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/dsh-plugin.mjs#L135-L151)

stdio 子进程启动及宿主桥导入。

<details>
<summary>查看原文（17行）</summary>

```text
export function bridgeConfig(config = {}, runtime = {}) {
  const settings = normalizeSettings(config);
  return {
    serverName: 'wincu', transport: 'stdio', command: process.execPath,
    args: [fileURLToPath(new URL('./server.mjs', import.meta.url))],
    env: { ELECTRON_RUN_AS_NODE: '1', WCU_IMAGE_MODE: 'file', WCU_BROWSER_ATTACH_USER: settings.browserAttachUser?'1':'0', WCU_BROWSER_HEADLESS: settings.browserVisible?'0':'1', WCU_BROWSER_APP: settings.browserApp, WCU_BROWSER_SIGNIN: settings.browserSignIn?'1':'0', WCU_TOOL_MODE: settings.toolPreset==='lazy'?'lazy':settings.mode, WCU_ENABLED_TOOLS: JSON.stringify(enabledToolsForSettings(settings)), WCU_SETTINGS_JSON: JSON.stringify(settings),
      ...(runtime.configFile ? { WCU_CONFIG_FILE: runtime.configFile, WCU_STATE_FILE: runtime.stateFile } : {}),
      ...(runtime.activityFile ? {WCU_ACTIVITY_FILE:runtime.activityFile}: {}),
      ...(runtime.layoutFile ? {WCU_LAYOUT_FILE:runtime.layoutFile}: {}),
      ...(runtime.notices ? {WCU_ADAPTER_NOTICES:JSON.stringify(runtime.notices)}: {}) },
    toolCallTimeoutMs: config.toolCallTimeoutMs ?? 90000,
    failOnStartupError: config.failOnStartupError ?? false
  };
}
export async function apply(ctx, config) {
  const bridge = await import('@deepseek-ai/dsh-mcp-client');
  const root = mkdtempSync(path.join(os.tmpdir(), `${CONTROL_PREFIX}${process.pid}-`));
```

</details>

**依据 3 · 源码核查**：[mcp/dsh-plugin.mjs:283-290](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/dsh-plugin.mjs#L283-L290)

实际启动 DSH MCP 桥并应用设置。

```text
    desired = normalizeSettings(scope.get()); atomicJson(runtime.configFile, desired);
    settingsContext.effect(() => scope.watch(applySettings));
    if (connection) return applySettings(desired);
  });
  runningSelection = toolSelectionKey(desired);
  connection = ctx.plugin(bridge, bridgeConfig({ ...config, ...desired }, runtime));
  await connection;
  await applySettings(desired);
```

**依据 4 · 源码核查**：[mcp/server.mjs:1000-1030](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L1000-L1030)

允许工具、输入校验、浏览器路由和列窗结果。

<details>
<summary>查看原文（31行）</summary>

```text
async function callTool(name, args, request) {
  if (batchOwner && batchOwner !== request) throw new Error('COMPUTER_USE_BUSY: A batch is in progress; wait for its result.');
  if (!allowedTools.has(name) && TOOL_NAMES.includes(name.slice(prefix.length))) throw new Error('TOOL_DISABLED_IN_SETTINGS: This tool is disabled by the user in Settings > Computer Use (设置 > 电脑操控 in the Chinese interface).');
  if (name === discoveryName) return manageTools(args);
  const definition = tools.find(tool => tool.name === name);
  if (!definition) throw new Error(`Unknown tool: ${name}`);
  args = validateArguments(definition.inputSchema, args);
  if (name === 'windows_computer_use_batch') return runBatch(args, request);
  const actionName = name.replace("windows_computer_use_", "");
  const browser = isBrowserCall(args);
  validateActionArguments(actionName, args);
  if (browser) return runBrowser(actionName === "accessibility_tree" ? "tree" : actionName, args, request);
  switch (name) {
    case "windows_computer_use_launch_app":
      return backendText("launch_app", args, 30000, request);
    case "windows_computer_use_health": {
      const result = await runBackend("health", args, undefined, request);
      result.browserLane = await browserLane.health();
      if (adapterNotices) result.adapterNotices = adapterNotices;
      return { content: [{ type: "text", text: safeJson(result) }] };
    }
    case "windows_computer_use_snapshot": {
      const result = await observeBackend("snapshot", args, request);
      return imageResult(result, args.includeScreenshot ?? true);
    }
    case "windows_computer_use_accessibility_tree":
      return observationText("tree", args, request);
    case "windows_computer_use_list_windows": {
      const result = await runBackend("list_windows", args, undefined, request);
      try { await browserLane.annotateWindows(result); } catch (error) { result.browserLane = { error: error.message }; }
      return { content: [{ type: "text", text: safeJson(result) }] };
```

</details>

**依据 5 · 源码核查**：[mcp/client.js:588-596](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/client.js#L588-L596)

兼容两代工具结果消息关联。

```text
    // DSH 0.1.7 and later send a tool result as {role:'tool', toolCallId,
    // source:{callId}, content, isError}. DSH 0.1.5 wraps it in one
    // {type:'tool-result', toolCallId, content, isError} block of a user
    // message. Neither has a top-level callId.
    function toolResult(message){
      const block=Array.isArray(message?.content)?message.content.find(part=>part?.type==='tool-result'):undefined;
      const inner=block??message??{};
      return {id:inner.toolCallId??message?.toolCallId??message?.source?.callId??message?.callId,content:Array.isArray(inner.content)?inner.content:[],isError:inner.isError===true};
    }
```

**依据 6 · 源码核查**：[mcp/client.js:650-659](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/client.js#L650-L659)

只有 turn/start 启动轮次。

<details>
<summary>查看原文（10行）</summary>

```text
    // One Context per turn, started only by turn/start, as DSH's own turn-tail
    // Definition does. DSH 0.1.5 throws on a second start Match for a Context,
    // and the throw left every conversation's history paging stuck (#76).
    const seriesEvents=['turn/start','turn/end','tool/call','tool/result'];
    const seriesDefinition={
      kind:'wincu-series',target:'chat',
      match:event=>seriesEvents.includes(event.type)&&Number.isInteger(event.data?.turn)?{id:String(event.data.turn),role:event.type==='turn/start'?'start':'update'}:null,
      start:(_context,match)=>reduceSeries({calls:[],seq:match.event.seq,ended:false},match.event),
      update:(context,match)=>reduceSeries(context.state,match.event),
      buildViewNode:context=>!context.state?.ended||!context.state.calls.length?null:{key:context.key,kind:'wincu-series',id:context.id,target:'chat',anchorSeq:context.state.calls[0].seq,location:context.start?.location??{kind:'unresolved'},visibility:'visible',data:context.state}
```

</details>

**依据 7 · 源码核查**：[mcp/activity.mjs:98-107](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/activity.mjs#L98-L107)

浮窗启用及保留状态决定是否写入进度文本。

<details>
<summary>查看原文（10行）</summary>

```text
  const publish=()=>{
    needsPublish=true;expireIdle();
    if(lingering&&(owner||Date.now()>=lingering.until))lingering=undefined;
    const shown=owner??lingering?.owner;
    summaries.update(shown);
    // Only the overlay reads this text. While it is off the text stays in
    // memory, so turning it on mid-turn still shows the whole turn.
    atomicJson(file,{active:!!owner,sessionId:owner?.id??null,turn:owner?.turn??null,indicator:!!owner?.desktop,expiresAt:owner?Date.now()+5000:0,locale:locale(),
      ...(shown&&getSettings().progressOverlayEnabled!==false?{progress:shown.progress}:{}),...(!owner&&lingering?{lingerUntil:lingering.until}:{})});
    needsPublish=false;
```

</details>

#### 缺口

- 本轮未在目标宿主重放历史会话或调用两种工具。
  **影响**：不能确认所有宿主版本均显示对应结果。
  **进一步探讨**：在 0.1.5 及目标宿主各重放一轮，检查早期消息加载、完成状态和两个工具回执。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后台输入、真实输入和 WSL 互操作分别如何失败？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

原生后台打字把 WM_CHAR 发送到显式目标窗口里有焦点的控件。在消息成功入队后，能读回的 Win32 编辑框还需核对文字，其他控件可能忽略消息，返回未核实状态。后台按键只支持单个字符，组合键和功能键要求真实输入。工具使用者应先查看实际目标和结果，再判断是否改前台。桌面前台输入由接管助手监督，浏览器、读取和安静后台动作无需启动全局停止监听。监听助手故障时真实输入被拒，安静动作仍可工作。明确用户停止则按停止状态拒绝两类路径。它限制继续输入，无法撤销已经进入应用的消息或业务动作。

WSL 路径仍依赖 Windows 互操作。后端启动把脚本转为 Windows 路径并在脚本目录执行，取消事件变量经 WSLENV 传给 Windows。助手进程号优先用其自报的 Windows PID。包清单仍声明 win32，作者给出 WSL 用法，两者共同意味着不能假定任意 Linux 环境能经正常包安装使用。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/windows-uia.ps1:3213-3230](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L3213-L3230)

显式目标、焦点控件和文本读回。

<details>
<summary>查看原文（18行）</summary>

```text
      # Background path: post WM_CHAR to the control with the keyboard focus
      # in the target window — no clipboard, no foreground, no system input
      # queue.
      if ($method -eq "background") {
        if (-not (Has-WindowTarget $inputObject)) {
          throw "method:'background' requires a window target (windowTitle / processId / nativeWindowHandle)."
        }
        $hwnd = Resolve-TargetHwnd $inputObject
        if (-not ($hwnd -and $hwnd -ne 0)) { throw "No window handle found for the target." }
        $focus = Get-BackgroundKeyTarget $hwnd
        $before = Get-EditTextLength $focus
        $ok = Post-BackgroundText -Hwnd $focus -Text $text
        if (-not $ok) { throw "background_unavailable: some WM_CHAR messages were refused. Retry with method:'clipboard'." }
        $typed = Test-BackgroundTyped $focus $before $text
        $result = [ordered]@{ ok = $true; action = "type_text"; length = $text.Length; method = "postmessage-wmchar"; verified = ($typed -eq $true) }
        if ($null -eq $typed) { $result["note"] = "Background text queued to the focused control, delivery unverified; controls that reject WM_CHAR (some custom UIs) need method:'clipboard'." }
        elseif (-not $typed) { $result["note"] = "The focused field did not take the text within a second: it may reject WM_CHAR or limit its length. Check the field, or use method:'clipboard'." }
        return $result
```

</details>

**依据 2 · 源码核查**：[scripts/windows-uia.ps1:3286-3309](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L3286-L3309)

后台按键只接收单字符，发送后可保留未核实。

<details>
<summary>查看原文（24行）</summary>

```text
      if ($dispatch -eq "background") {
        # Only a single printable character can be posted as WM_CHAR. Chords
        # and functional keys need the system input queue — say so honestly
        # instead of pretending (cua's background_unavailable pattern).
        if ($keys.Count -ne 1) {
          throw "background_unavailable: key chords and functional keys need the system input queue. Use dispatch:'foreground'."
        }
        $ch = [string]$keys[0]
        if ($ch.Length -ne 1) {
          throw "background_unavailable: only a single character can be posted in background. Use dispatch:'foreground' for functional keys."
        }
        if (-not (Has-WindowTarget $inputObject)) {
          throw "background dispatch requires a window target (windowTitle / processId / nativeWindowHandle)."
        }
        $hwnd = Resolve-TargetHwnd $inputObject
        if (-not ($hwnd -and $hwnd -ne 0)) { throw "No window handle found for the target." }
        $focus = Get-BackgroundKeyTarget $hwnd
        $before = Get-EditTextLength $focus
        [void](Test-Failsafe)
        $ok = [WindowsComputerUseNative]::PostMessageW([IntPtr]$focus, [WindowsComputerUseNative]::WM_CHAR, [IntPtr][int][char]$ch, [IntPtr]1)
        if (-not $ok) { throw "background_unavailable: WM_CHAR was refused. Use dispatch:'foreground'." }
        $typed = Test-BackgroundTyped $focus $before $ch
        $result = [ordered]@{ ok = $true; action = "keypress"; keys = $keys; method = "postmessage-wmchar"; verified = ($typed -eq $true) }
        if ($typed -ne $true) { $result["note"] = "Background key queued to the focused control, delivery unverified." }
```

</details>

**依据 3 · 源码核查**：[mcp/takeover.mjs:19-41](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/takeover.mjs#L19-L41)

WSL 路径、盘符和环境桥接。

<details>
<summary>查看原文（23行）</summary>

```text
const readText = file => { try { return readFileSync(file, 'utf8'); } catch { return ''; } };
export const IN_WSL = process.platform === 'linux' && (!!process.env.WSL_DISTRO_NAME || !!process.env.WSL_INTEROP || /microsoft/i.test(readText('/proc/sys/kernel/osrelease')));
const wslpath = (flag, file) => execFileSync('wslpath', [flag, file], { encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true }).trim();
export function windowsPath(file, { wsl = IN_WSL, distro = process.env.WSL_DISTRO_NAME, convert = wslpath } = {}) {
  if (!wsl || typeof file !== 'string' || !file.startsWith('/')) return file;
  try { const converted = convert('-w', file); if (converted) return converted; } catch { }
  const drive = /^\/mnt\/([a-z])(?=\/|$)(.*)$/i.exec(file);
  if (drive) return `${drive[1].toUpperCase()}:${(drive[2] || '/').replaceAll('/', '\\')}`;
  return distro ? `\\\\wsl.localhost\\${distro}${file.replaceAll('/', '\\')}` : file;
}
export function linuxPath(file, { wsl = IN_WSL, convert = wslpath } = {}) {
  if (!wsl || typeof file !== 'string' || !/^[A-Za-z]:[\\/]/.test(file)) return file;
  try { const converted = convert('-u', file); if (converted) return converted; } catch { }
  return `/mnt/${file[0].toLowerCase()}${file.slice(2).replaceAll('\\', '/')}`;
}
// The variables named here reach Windows processes as they are (/w: only
// when WSL starts a Windows process; /u would mean the other way round).
export function windowsEnv(env, names, { wsl = IN_WSL } = {}) {
  if (!wsl) return env;
  const shared = String(env.WSLENV ?? '').split(':').filter(Boolean);
  const listed = new Set(shared.map(item => item.split('/')[0]));
  for (const name of names) if (!listed.has(name)) shared.push(name + '/w');
  return { ...env, WSLENV: shared.join(':') };
```

</details>

**依据 4 · 源码核查**：[mcp/server.mjs:828-853](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L828-L853)

实际传入 Windows 脚本路径、工作目录及停止事件。

<details>
<summary>查看原文（26行）</summary>

```text
function backendEnv(env) {
  return windowsEnv(env, Object.keys(env).filter(name => name.startsWith('WCU_')));
}

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
      windowsScript(backendPath),
      "-Persistent"
    ],
    {
      cwd: pluginRoot,
      // Under WSL the backend reads the WCU_ variables only when WSLENV names them (#79).
      env: backendEnv({ ...process.env, WCU_CANCEL_EVENT: takeover.disabledForTest ? '' : takeover.eventName }),
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    }
  );
```

</details>

**依据 5 · 源码核查**：[mcp/takeover.mjs:189-215](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/takeover.mjs#L189-L215)

Windows 进程号和不同操作的接管失败规则。

<details>
<summary>查看原文（27行）</summary>

```text
  // The helper's Windows process id, which the backend watches during input.
  // Under WSL the child's own pid is that of the interop process (#79).
  get helperProcessId() { return this.child ? (this.helperPid || this.child.pid || 0) : 0; }
  // A quiet lease (browser-lane calls) checks the stopped state and counts as an
  // action in progress, but neither shows the indicator nor arms the stop keys.
  // Quiet calls send no real input, so they need no stop listener: when the
  // listener failed (it did not start, or it exited), they keep working and
  // only real input stays refused. A stop by the user refuses everything (#79).
  async begin({ quiet = false } = {}) {
    // A read that found the helper failing has paused the series; the checks
    // below then decide.
    try { await this.sync(); } catch (error) { if (!this.paused) throw error; }
    const refuses = message => !(quiet && message !== STOPPED);
    if(this.seriesHeld&&this.blockedSeries.has(this.seriesKey)&&refuses(this.blockedSeries.get(this.seriesKey)))throw new Error(this.blockedSeries.get(this.seriesKey));
    if(this.paused&&!this.activityFile&&this.active===0)await this.resumeOperation();
    if (this.paused&&refuses(this.pauseMessage)) throw new Error(this.pauseMessage);
    if (this.closed) throw new Error('COMPUTER_USE_STOPPING');
    if (!quiet&&!this.disabledForTest&&(!this.seriesHeld||!this.seriesIndicator||!this.child)) {
      try { await this.command('begin', this.config); this.sentShortcut = this.config.stopShortcut; this.sentCursorIndicator = this.config.cursorIndicatorEnabled;this.sentRemoteVisible=this.config.remoteIndicatorVisible; }
      catch (error) { this.fail(error); throw new Error(this.paused ? this.pauseMessage : error.message); }
    }
    if (this.paused&&refuses(this.pauseMessage)) throw new Error(this.pauseMessage);
    this.active++; if (!quiet) this.shown++; this.persist();
  }
  async end({ quiet = false } = {}) {
    this.active = Math.max(0, this.active - 1); if (!quiet) this.shown = Math.max(0, this.shown - 1); this.persist(this.paused ? 'stopped-by-user' : null);
    if (!quiet && this.shown === 0 && !(this.seriesHeld&&this.seriesIndicator)&&this.child && !this.paused) await this.command('end').catch(error => this.fail(error));
```

</details>

**依据 6 · 源码核查**：[package.json:79-84](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/package.json#L79-L84)

包声明 Node 与 Windows。

```text
  "engines": {
    "node": ">=22"
  },
  "os": [
    "win32"
  ],
```

**依据 7 · 作者声明**：[README.md:308-312](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/README.md#L308-L312)

作者说明受保护桌面和 WSL 互操作条件。

```text
先看目标窗口有没有被挡住、程序是不是卡住了。按坐标点击时，落点露出的是别的窗口（比如通知）就不会点下去，结果会说出挡住它的窗口（`POINT_COVERED`）；结果里的 `foreground` 和 `pointer` 说明这一步有没有借用前台、有没有还回去。Chromium、Electron 和部分 WinUI 程序会忽略后台输入，所以优先用 UIA 操作，或者先把目标窗口切到前台再输入，然后看看实际效果。以管理员身份运行的窗口和 UAC 确认界面受 Windows 权限保护，插件无法操作。插件还需要一个正常可用的桌面会话。

#### 8.3 支持 PowerShell 7、其他系统，或者自带看图模型吗？

只支持 Windows。DSH 也可以跑在 WSL 里（比如在 WSL 里运行 `dsh web`）：插件经 WSL 互操作调用 Windows 的 PowerShell，操作的仍是 Windows 桌面，前提是 WSL 里能启动 Windows 程序（能运行 `powershell.exe`）。默认用 PowerShell 5.1，它的文字识别（WinRT OCR）经过了真实测试。自动测试同时覆盖 PowerShell 5.1 和 7：在 7 上，界面读取和截图有真实测试，但文字识别只测了协议，所以还不能保证 7 上的文字识别可用。
```

#### 缺口

- 未复现 WSL 不同安装路径、助手故障和实际 Esc 停止时序。
  **影响**：尚不能确认停止不会晚于高影响动作。
  **进一步探讨**：在隔离桌面跑后台文本、前台按键和助手失败，检查动作、日志及 Esc 后下一步是否执行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 批量末步导航和中途变更对结果有何影响？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

批量适用于事先可以确定的短操作串，例如填写测试表单后提交。先校验所有步骤的工具授权和目标，拒绝跨标签元素、打开新标签指令或把网页坐标混为桌面输入。桌面解析必须得到唯一窗口，绑定 HWND 与进程，后续每步仍走工具校验和停止门禁。每步报告发出或验证状态，未确认、超时、取消会停。导航、弹窗、新窗口或目标关闭出现在中间时停住，出现在最后一步时通过 afterLastStep 记录，计划可返回成功。存在关闭、取消或没有可用观察工具时，末尾观察可省略。相比每次让模型重新计划，这条路径可以少做轮间观察，但完成数和 ok 仅描述批量控制流，不能证明业务提交完成或回滚已经发生的动作。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/server.mjs:1140-1157](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L1140-L1157)

整计划授权与单目标预校验。

<details>
<summary>查看原文（18行）</summary>

```text
  // Validate the entire plan before its first read or action. A batch never
  // grants permission to an action disabled in settings.
  const plan = args.steps.map((step,index) => {
    const name = prefix + step.action;
    if (!allowedTools.has(name)) throw new Error(`TOOL_DISABLED_IN_SETTINGS: batch step ${index + 1} (${step.action}).`);
    for (const key of ['browserTab','windowTitle','processId','nativeWindowHandle']) if (step.arguments[key] !== undefined && step.arguments[key] !== target[key]) throw new Error('INVALID_ARGUMENTS: all batch steps must keep the same target.');
    if (/^(?:new-tab|b[0-9a-z]+:(?:new-tab|connect))$/.test(step.arguments.elementId ?? '')) throw new Error('INVALID_ARGUMENTS: open or connect a browser before batching.');
    if (target.browserTab && step.arguments.elementId && !step.arguments.elementId.startsWith(target.browserTab + ':')) throw new Error('INVALID_ARGUMENTS: batch element belongs to another tab.');
    if (!target.browserTab && isBrowserCall(step.arguments)) throw new Error('INVALID_ARGUMENTS: a desktop batch cannot contain page elements.');
    const definition = tools.find(tool => tool.name === name);
    // wait has no target properties, and never borrows the foreground.
    const inherited = Object.fromEntries(Object.entries(target).filter(([key]) => Object.hasOwn(definition.inputSchema.properties,key)));
    const combined = step.action === 'wait' ? { ...step.arguments } : { ...inherited, ...step.arguments };
    if (target.browserTab && !Object.hasOwn(definition.inputSchema.properties,'browserTab')) delete combined.browserTab;
    if (target.browserTab && step.action !== 'wait' && !isBrowserCall(combined)) throw new Error('INVALID_ARGUMENTS: this browser batch action needs a page element ID; page coordinates cannot become desktop input.');
    const validated = validateArguments(definition.inputSchema, combined);
    validateActionArguments(step.action, validated);
    return { name, action: step.action, args: validated };
```

</details>

**依据 2 · 源码核查**：[mcp/server.mjs:1162-1195](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L1162-L1195)

固定窗口和进程，逐步调用及停止条件。

<details>
<summary>查看原文（34行）</summary>

```text
  const state = async () => {
    if (target.browserTab) return browserLane.batchState(target, request);
    const listed = await runBackend('list_windows', { maxWindows: 200 }, 10000, request);
    const windows = listed.windows ?? [];
    const matches = windows.filter(window => nativeHandle ? String(window.nativeWindowHandle) === nativeHandle : target.nativeWindowHandle ? String(window.nativeWindowHandle) === String(target.nativeWindowHandle) : target.processId ? window.processId === target.processId : String(window.name ?? window.title ?? '').toLowerCase().includes(target.windowTitle.toLowerCase()));
    // Once resolved the target is pinned to its HWND, so no match means it closed.
    if (nativeHandle && matches.length === 0) return { closed: true };
    if (matches.length !== 1) throw new Error('BATCH_TARGET_UNAVAILABLE: target is missing or ambiguous; specify its nativeWindowHandle.');
    const found = matches[0]; nativeHandle ??= String(found.nativeWindowHandle); nativePid ??= found.processId;
    if (found.processId !== nativePid) throw new Error('BATCH_TARGET_CHANGED: target process changed.');
    // The target may itself be a dialog; only another dialog of its process blocks it.
    return { title: withoutUnsavedMark(found.name ?? found.title), windows: windows.map(window => String(window.nativeWindowHandle)).sort(), dialog: windows.some(window => window.className === '#32770' && window.processId === nativePid && String(window.nativeWindowHandle) !== nativeHandle) };
  };
  try {
    await takeover.begin({ quiet: true }); lease = true;
    before = await state();
    if (before.dialog) stopReason = 'dialog';
    for (const [index,step] of plan.entries()) {
      if (stopReason !== 'completed') break;
      if (request.cancelled || takeover.paused) { stopReason = 'cancelled'; break; }
      if (Date.now() >= deadline) { stopReason = 'deadline'; break; }
      // Native actions stay pinned to the originally resolved HWND.
      if (!target.browserTab && step.action !== 'wait') step.args.nativeWindowHandle = Number(nativeHandle);
      let result;
      try { result = await callTool(step.name, step.args, request); }
      catch (error) { steps.push({ index: index + 1, action: step.action, ok: false, error: error.message }); stopReason = request.cancelled ? 'cancelled' : 'error'; break; }
      const data = textData(result);
      const summary = { index: index + 1, action: step.action, ok: result.isError !== true, verification: data?.verification ?? 'sent' };
      for (const key of ['dialog','openedTabs','fileChooser','stillLoading','tabClosed','warning']) if (data?.[key] !== undefined) summary[key] = data[key];
      if (result.isError) { summary.error = result.content?.[0]?.text; stopReason = 'error'; }
      steps.push(summary);
      if (result.isError) break;
      if (request.cancelled || takeover.paused) { stopReason = 'cancelled'; break; }
      if (data?.verification === 'unconfirmed' || data?.verified === false) { stopReason = 'unconfirmed'; break; }
```

</details>

**依据 3 · 源码核查**：[mcp/server.mjs:1196-1230](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L1196-L1230)

末步变化标注及最终观察。

<details>
<summary>查看原文（35行）</summary>

```text
      // What the action changed. Before another action this stops the plan; a
      // change caused by the last action (a submit that navigates, a confirm
      // dialog, a closed window) completes the plan and is reported with it.
      let change;
      if (data?.dialog || data?.fileChooser) change = 'dialog';
      else if (data?.openedTabs?.length) change = 'newWindow';
      else if (data?.tabClosed) change = 'targetClosed';
      else {
        const after = await state();
        if (after.closed) change = 'targetClosed';
        else if (after.dialog) change = 'dialog';
        else if (after.windows.some(id => !before.windows.includes(id))) change = 'newWindow';
        else if (after.url !== before.url || after.document !== before.document || after.load !== before.load || after.title !== before.title || data?.stillLoading) change = 'navigation';
        if (!after.closed) before = after;
      }
      if (change) { if (index === plan.length - 1) afterLastStep = change; else stopReason = change; break; }
    }
  } catch (error) { stopReason = request.cancelled ? 'cancelled' : 'error'; message = error.message; }
  finally { request.batchSuppressObservation = false; }
  try {
    const closed = stopReason === 'targetClosed' || afterLastStep === 'targetClosed';
    if (closed) content.push({ type: 'text', text: 'Final observation skipped: the target closed.' });
    else if (before && !request.cancelled && !takeover.paused) {
      const observer = allowedTools.has(prefix + 'accessibility_tree') ? 'accessibility_tree' : allowedTools.has(prefix + 'screenshot') ? 'screenshot' : null;
      if (observer) {
        try {
          const final = await callTool(prefix + observer, target.browserTab ? { browserTab: target.browserTab } : { ...target, nativeWindowHandle: Number(nativeHandle), activate: false }, request);
          content.push({ type: 'text', text: 'Final observation:' }, ...final.content);
        } catch (error) { content.push({ type: 'text', text: 'Final observation unavailable: ' + error.message }); }
      }
    }
    const result = { content: [{ type: 'text', text: safeJson({ ok: stopReason === 'completed', action: 'batch', planned: plan.length, completed: steps.filter(step => step.ok).length, stopReason, ...(afterLastStep ? { afterLastStep } : {}), steps, ...(message ? { message } : {}) }) }, ...content], ...(stopReason !== 'completed' ? { isError: true } : {}) };
    request.batchResult = true;
    return result;
  } finally { try { if (lease) await takeover.end({ quiet: true }); } finally { batchOwner = null; } }
```

</details>

#### 缺口

- 未测浏览器重导航与中途取消在真实任务的完整时序。
  **影响**：不能把成功字段或停止状态当作业务提交证明。
  **进一步探讨**：用可撤销测试页分别在中途和末步提交，核对剩余步骤及业务对象落库状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · OCR 的小字优化与工程修复改善哪些情况？

**研究主题**：贡献与相对优势、工程质量与复用、效果与总成本

#### 完整回答

当 Windows UIA 不提供文字时，OCR 提供基于截图的备选观察。小字处理先读原尺寸，若词高度中值不足约 30 像素，再尝试向约 36 像素放大，最多三倍并受引擎尺寸和像素预算约束。它保留坐标缩放，结果向调用者给出识别语言及缩放倍率。多一轮 OCR 会增加本机计算，混合字体、复杂背景和语言包仍可能影响识别。作者在 9–20 像素文字给出的错误率改善属于特定样本，不可套用于任意应用。可读 UIA 字段仍应优先。

另一个影响可用性的修复是将编译辅助件的临时文件清理交给 .NET File API，枚举过期的特定助手文件名并按 UTC 清理。这样避开作者报告的 PowerShell 5.1 短路径提供程序失败。截图留存检查也用 UTC；这只是清理逻辑，不构成截图不会含敏感信息的保证。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/windows-uia.ps1:426-449](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L426-L449)

临时文件删除和助手半成品清理。

<details>
<summary>查看原文（24行）</summary>

```text
# temporary files are handled with .NET calls only, never with Remove-Item,
# Get-ChildItem or Test-Path.
function Remove-TempFile {
  param([string]$Path)
  try { [System.IO.File]::Delete($Path) } catch { }
}

# A compile that failed or was cut off leaves <helper>.<pid>.<guid>.dll and
# its .cs source behind (one pair per OCR call on the machines of #78). Those
# an hour old are removed before a helper is compiled.
function Remove-StaleHelperParts {
  param([string]$Directory)
  $cutoff = [DateTime]::UtcNow.AddHours(-1)
  try {
    foreach ($file in [System.IO.Directory]::EnumerateFiles($Directory, 'wcu-*.dll*')) {
      if ([System.IO.Path]::GetFileName($file) -cmatch '^wcu-(native|ocr|wgc)-[a-z0-9-]+\.\d+\.[0-9a-f]{32}\.dll(\.cs)?$' -and [System.IO.File]::GetLastWriteTimeUtc($file) -lt $cutoff) { Remove-TempFile $file }
    }
  } catch { }
}

function Import-HelperAssembly {
  param([string]$Path, [scriptblock]$Compile)
  if (-not [System.IO.File]::Exists($Path)) {
    Remove-StaleHelperParts ([System.IO.Path]::GetDirectoryName($Path))
```

</details>

**依据 2 · 源码核查**：[scripts/windows-uia.ps1:1350-1365](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L1350-L1365)

放大限制与词高中值。

<details>
<summary>查看原文（16行）</summary>

```text
  // read again enlarged toward 36 px, at most 3x and within the engine's
  // maximum image size and a 36-megapixel budget. On rendered 9-20 px UI text
  // this halved the character error rate; enlarging 4x did worse than 3x.
  public const double TargetWordHeight = 36, MaxUpscale = 3, PixelBudget = 36e6;
  public static double Fit(int width, int height, double maxDimension) {
    return Math.Min(maxDimension / Math.Max(width, height), Math.Sqrt(PixelBudget / ((double)width * height)));
  }
  public static double ReadScale(double[] wordHeights, int width, int height, double maxDimension) {
    double scale = MaxUpscale;
    if (wordHeights.Length > 0) {
      var sorted = (double[])wordHeights.Clone();
      Array.Sort(sorted);
      double median = sorted[sorted.Length / 2];
      if (median > 0) scale = Math.Min(MaxUpscale, TargetWordHeight / median);
    }
    return Math.Min(scale, Fit(width, height, maxDimension));
```

</details>

**依据 3 · 源码核查**：[scripts/windows-uia.ps1:1435-1469](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L1435-L1469)

两次识别和坐标转换。

<details>
<summary>查看原文（35行）</summary>

```text
    try {
      OcrEngine engine = CreateEngine(languageTag);
      StorageFile file = WaitOp(StorageFile.GetFileFromPathAsync(pngPath));
      using (IRandomAccessStream stream = WaitOp(file.OpenAsync(FileAccessMode.Read))) {
        BitmapDecoder decoder = WaitOp(BitmapDecoder.CreateAsync(stream));
        int width = (int)decoder.PixelWidth, height = (int)decoder.PixelHeight;
        double maxDimension = OcrEngine.MaxImageDimension;
        double scale = Math.Min(1, Fit(width, height, maxDimension));
        OcrResult result = WaitOp(engine.RecognizeAsync(Decode(decoder, width, height, scale)));
        var heights = new List<double>();
        foreach (OcrLine line in result.Lines)
          foreach (OcrWord word in line.Words)
            if (word.BoundingRect.Height > 0) heights.Add(word.BoundingRect.Height / scale);
        double larger = ReadScale(heights.ToArray(), width, height, maxDimension);
        if (larger > scale * 1.2) {
          scale = larger;
          result = WaitOp(engine.RecognizeAsync(Decode(decoder, width, height, scale)));
        }
        string tag = engine.RecognizerLanguage.LanguageTag;
        bool spaced = UsesSpaces(tag);
        var sb = new StringBuilder();
        sb.Append("LANG\t").AppendLine(tag);
        sb.Append("SCALE\t").AppendLine(scale.ToString("0.###", CultureInfo.InvariantCulture));
        foreach (OcrLine line in result.Lines) {
          var texts = new List<string>();
          var ws = new StringBuilder();
          foreach (OcrWord word in line.Words) {
            var r = word.BoundingRect;
            string text = Clean(word.Text);
            texts.Add(text);
            ws.Append(text).Append('\u001E')
              .Append((int)Math.Round(r.Left / scale)).Append(',')
              .Append((int)Math.Round(r.Top / scale)).Append(',')
              .Append((int)Math.Round(r.Width / scale)).Append(',')
              .Append((int)Math.Round(r.Height / scale)).Append('\u001F');
```

</details>

**依据 4 · 源码核查**：[scripts/windows-uia.ps1:2423-2432](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L2423-L2432)

按 UTC 清理截图。

<details>
<summary>查看原文（10行）</summary>

```text
# local write time against a UTC cutoff kept files for hours east of UTC and
# deleted fresh ones west of it.
function Remove-OldScreenshots {
  $cutoff = [DateTime]::UtcNow.AddMinutes(-30)
  try {
    foreach ($file in [System.IO.Directory]::EnumerateFiles($env:TEMP, 'windows-computer-use-*.png')) {
      if ([System.IO.File]::GetLastWriteTimeUtc($file) -lt $cutoff) { Remove-TempFile $file }
    }
  } catch { }
}
```

</details>

**依据 5 · 源码核查**：[scripts/windows-uia.ps1:3609-3618](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/scripts/windows-uia.ps1#L3609-L3618)

回传 OCR 语言与比例。

<details>
<summary>查看原文（10行）</summary>

```text
        source = if ($winEl -ne $null) { "window" } else { "desktop" }
      }
      $result['coordinateSpace'] = 'screen'
      $result['imageScale'] = $scale
      # The recognizer that read the text, and how much the capture was
      # enlarged for it (1 = read at capture size).
      $result['language'] = $ocr.language
      $result['ocrScale'] = $ocr.readScale
      $result['captureMethod'] = $shot.method
      $result['occludedPossible'] = $shot.occludedPossible
```

</details>

**依据 6 · 作者声明**：[CHANGELOG.md:15-17](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/CHANGELOG.md#L15-L17)

作者说明小字样本、语言和回归范围。

```text
- 修复装上插件后，DSH 0.1.5 里所有会话的“加载更早”和右侧序列条失效，控制台报 “received more than one start Match”（[#76](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues/76)）。对话里的电脑操控汇总改为只由 `turn/start` 开始一轮，同一轮的工具调用、结果和结束都算更新，和 DSH 自带的轮次定义一致；DSH 0.1.7 以后本来就容许，汇总照常显示。0.1.x 设置页“插件”里的卡片改用 `key` 注册，不再报 “keyed slot requires options.key”。/ On DSH 0.1.5 every conversation's “load earlier” and series bar stopped working: the computer-use series now starts a turn only on `turn/start`, as DSH's own turn definitions do, and the 0.1.x plugin settings card registers with `key`.
- OCR 读小字（[#75](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues/75)）：先按原尺寸读一遍，词的中位高度低于 30 像素时，把图放大到约 36 像素高再读（最多 3 倍，结果里的 `ocrScale`），坐标仍是屏幕坐标；在 9–20 像素的界面文字上，逐字错误率大约减半。`ocr` 默认按原尺寸截图（`maxWidth` 默认改为 0，不再先缩到 1920 宽）；新增 `language` 参数选识别语言，结果里的 `language` 写明实际用的语言（以前总是空的）；中文、日文的行不再逐字加空格；`text` 里的换行不再是字面的 `\n`；工具说明写明 OCR 是尽力而为，能读到 UIA 文字时优先用 UIA。/ OCR reads small text enlarged (a second pass, at most 3x), captures at full size by default, takes a `language`, names the recognizer, joins Chinese and Japanese words without spaces and returns real line breaks.
- 浮窗、屏幕提示条和 AI 总结跟随 DSH 的界面语言（[#74](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues/74)）：读 DSH 自己的语言设置（`locale` 设置项），没选语言时跟系统；现有中文和英文，其他语言显示英文。文字集中在 `mcp/overlay-strings.mjs`，每种语言一份词典，C# 助手只画收到的文字；提示文字保持默认时也跟着语言变。/ The overlay, the indicator bar and the AI summary follow the DSH interface language; every word lives in one dictionary per language in `mcp/overlay-strings.mjs`.
```

#### 缺口

- 没有同一桌面字体集、实际延迟和识别结果对照。
  **影响**：小字改善和额外资源成本均无法泛化。
  **进一步探讨**：固定分辨率用中英小字样本，比较 UIA、单次 OCR、双次 OCR 的识别错字、坐标和时延。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，怎样验证高影响动作的确认成本？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

可以有条件试用。已有 Windows DSH 的用户可先使用隔离桌面和专用浏览器，只读取窗口并填写无敏感数据的草稿。比较手动操作与插件路径，每次合格结果需核对目标窗口、实际字段、最终状态和日志。权限不足、回读不确定或停止之后仍见动作时，停止并退回手工。前期投入是选宿主版本、浏览器、工具方案及准备测试数据。持续资源包括模型调用、PowerShell 和浏览器进程，人工承担对象确认和异常恢复。保留登录或接管已打开浏览器会扩大可接触数据范围，关闭插件也不会撤销已提交业务动作。

待验证的方案是在真正提交或覆盖之前先显示固定窗口、变更摘要与目标字段，再由用户确认。批量预检和停止给出了插入核对的机制基础，目前观察结果无法替代审批。在相同任务比较误目标、已提交但报告不确定、审阅时长和失败接管。若新增确认仍不能阻止过期目标，或合格完成时间长期高于人工，退回短批量和手动提交。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:286-291](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/README.md#L286-L291)

专用浏览器和保留登录的作者说明。

```text
浏览器有三种来源：

- **agent 浏览器（默认）**：第一次用 `new-tab` 时，插件在后台创建一个可见但不抢前台的浏览器窗口。用哪个浏览器可以在设置里选，默认跟随 Windows 的默认浏览器；默认浏览器不是 Edge 或 Chrome 时，用已安装的 Chrome 或 Edge；也可以选 Firefox 系，这是实验功能，在后台运行，见 [Firefox 系浏览器](docs/browser-bidi.md)。它每次都从新的临时配置开始，标签页放在单独的隔离环境里，看不到你的 Cookie、登录状态和浏览记录。插件进程退出时它跟着退出，空闲 10 分钟也会自己关掉。如果用的是 Edge，Edge 会自动把这个临时配置登录到 Windows 的微软账户；agent 的标签页留在隔离环境里，用不到这个登录状态，窗口上也不显示账户；临时配置在浏览器关闭后删除。在设置里关掉“显示 DSH 浏览器窗口”，它就在后台运行，没有窗口。浏览器操控不显示屏幕边缘和鼠标标签。
- **保留网站登录状态**：需要登录的任务，可以在设置里打开“保留网站登录状态”，默认关闭。打开后，DSH 专用浏览器不再每次用临时配置，而是给每个浏览器保留一个配置（`%LOCALAPPDATA%\dsh-computer-use-win\agent-browser` 下的 `kept-edge`、`kept-chrome`）：你在它的窗口（蓝框）里登录过的网站，之后的任务里还是登录状态，没勾“记住我”的网站也一样。第一次用到要登录的网站时，agent 会请你在这个窗口里登录一次，密码和验证码由你自己输入。你自己的浏览器始终不碰，不用开远程调试，也不会弹出允许提示。用 Edge 时，Edge 会自动用 Windows 上的微软账户登录这个配置，微软自家的网站直接是登录状态；不想这样就选 Chrome。关掉开关后登录仍然保留；要全部清除，退出 DSH 后删除上面的文件夹。风险：DSH 会以你的身份操作你在这里登录过的网站；网页上的文字可能诱导 agent；DSH 浏览器开着时，本机其他程序也能通过它的调试端口连上它。
- **操作已打开的浏览器（实验性）**：默认关闭。打开后，`list_windows` 只读取浏览器写下的 `DevToolsActivePort` 文件，把你的浏览器列为“可以连接”，并给出 `"<浏览器 ID>:connect"` 入口，这时既不连接，也不会弹出提示。agent 会先请你准备在浏览器里点“允许”，再用 `set_value` 往这个入口写 `connect`，浏览器这时才问你是否允许。被拒绝或超时就停下，不自动重试，列表里会标出“未获允许”或“已超时”，所以提示不会叠在一起。连上以后，你自己标签页的网址会去掉 `?` 后面的参数和 `#` 片段；agent 只操作你提到的标签页和它自己打开的标签页，发送、购买、删除或改账户设置之前会先问你。断开时只断开连接，不关你的浏览器。连接期间，浏览器顶部会显示受自动测试软件控制的提示。

```

**依据 2 · 源码核查**：[mcp/browser.mjs:1128-1141](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/browser.mjs#L1128-L1141)

附着浏览器列表说明需独立授权，拒绝后不绕行。

<details>
<summary>查看原文（14行）</summary>

```text
      for (const window of result.windows ?? []) if (browser.pid && window.processId === browser.pid) window.browser = browser.key;
    }
    const candidate = await this.userCandidate();
    if (candidate && !listed.some(browser => browser.id === candidate.key)) {
      const attempt = this.attachAttempts.get(candidate.key);
      listed.push({ id: candidate.key, name: candidate.name, source: 'user', status: attempt?.url === candidate.url ? attempt.status : 'available', connect: `${candidate.key}:connect`, tabs: [], ...(attempt?.url === candidate.url && attempt.error ? { error: attempt.error } : {}) });
    }
    const waiting = [...this.browsers.values()].filter(browser => browser.status === 'connecting').map(browser => browser.name);
    result.browserLane = {
      browsers: listed, ...(waiting.length ? { waitingForPermission: waiting } : {}),
      ...(this.attachUser ? { attachUser: { enabled: true, available: !!candidate, instruction: 'Listing makes no connection. Ask the user to allow remote debugging before set_value elementId "<browser id>:connect" value "connect". Only explicit requests retry; do not bypass a refusal.' } } : {}),
      use: 'Pass browserTab (a tab id) to snapshot/accessibility_tree/find/type_text/keypress/scroll/screenshot/wait_for to work on that page in the background; its element ids (t1a2b:57) work in click/set_value/focus/invoke/scroll/element_info. set_value elementId "new-tab" value "<url>" opens a background tab ' +
        (this.keepSignIns ? 'in the DSH browser, whose profile is kept: sites the user signed in to there are still signed in' : 'in a separate agent browser without sign-ins') + (listed.some(browser => browser.source !== 'agent') ? '; "<browser id>:new-tab" opens it in that connected browser.' : '.')
    };
```

</details>

**依据 3 · 源码核查**：[mcp/server.mjs:1181-1195](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/mcp/server.mjs#L1181-L1195)

取消、失败和未确认切断后续步骤。

<details>
<summary>查看原文（15行）</summary>

```text
      if (request.cancelled || takeover.paused) { stopReason = 'cancelled'; break; }
      if (Date.now() >= deadline) { stopReason = 'deadline'; break; }
      // Native actions stay pinned to the originally resolved HWND.
      if (!target.browserTab && step.action !== 'wait') step.args.nativeWindowHandle = Number(nativeHandle);
      let result;
      try { result = await callTool(step.name, step.args, request); }
      catch (error) { steps.push({ index: index + 1, action: step.action, ok: false, error: error.message }); stopReason = request.cancelled ? 'cancelled' : 'error'; break; }
      const data = textData(result);
      const summary = { index: index + 1, action: step.action, ok: result.isError !== true, verification: data?.verification ?? 'sent' };
      for (const key of ['dialog','openedTabs','fileChooser','stillLoading','tabClosed','warning']) if (data?.[key] !== undefined) summary[key] = data[key];
      if (result.isError) { summary.error = result.content?.[0]?.text; stopReason = 'error'; }
      steps.push(summary);
      if (result.isError) break;
      if (request.cancelled || takeover.paused) { stopReason = 'cancelled'; break; }
      if (data?.verification === 'unconfirmed' || data?.verified === false) { stopReason = 'unconfirmed'; break; }
```

</details>

**依据 4 · 作者声明**：[CHANGELOG.md:3-8](https://github.com/Yu-tao-Li/dsh-computer-use-win/blob/e136fcb87b2eb88d7192531b7ab941b475482ec6/CHANGELOG.md#L3-L8)

作者报告 OCR、WSL 和后台输入问题，未独立复现。

```text
## 0.5.7 — 2026-11-11

- 修复 OCR 在部分电脑上每次都报“指定路径 C:\Users\XXX~1 下的对象不存在”，`find` 的 OCR 兜底也一样（[#78](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues/78)）。原因在 Windows PowerShell 5.1 的文件系统提供程序：TEMP 是 8.3 短路径、而短名比原名还长时（用户名很短又带空格，如 `Li Hua` 的短名是 `LIHUA~1`），删除临时文件的命令会报这句错。OCR 每次编译识别组件都要删临时文件，所以每次都失败，还在 TEMP 里留下一对半成品文件。现在临时文件全部用 .NET 处理，编译前清掉一小时前的半成品。顺带修正截图清理拿本地时间和 UTC 比较，在西半球的时区会删掉刚截的图。/ OCR failed on every call with “An object at the specified path C:\Users\XXX~1 does not exist” when TEMP is an 8.3 path whose short name is longer than the real one (a short user name with a space): Windows PowerShell 5.1 rejects such paths when deleting files, and every OCR compile deleted its temporary files. Temporary files are now handled with .NET calls, and leftover partial builds are removed. Screenshot cleanup compares times in UTC, so it no longer deletes fresh captures west of UTC.
- 修复 DSH 跑在 WSL 里时，所有发送输入的工具都报“-File 形式参数实际参数……不存在”，之后连读屏也一起暂停（[#79](https://github.com/Yu-tao-Li/dsh-computer-use-win/issues/79)）。PowerShell 是 Windows 程序，按自己的当前盘解析 Linux 路径：从 `/mnt/c/...` 启动 DSH 时，脚本路径被解析成 `C:\home\...`。现在脚本以 Windows 路径（`wslpath -w`）交给 PowerShell，工作目录设为脚本所在目录；Esc 停止用的变量经 `WSLENV` 传给 Windows 进程；接管助手报告自己的 Windows 进程号；截图路径换成 WSL 里能直接读的 `/mnt/...`。接管助手起不来时只拒绝真正的键盘鼠标输入，读屏、后台操作和浏览器通道照常，也不再每秒反复启动 PowerShell。/ Under WSL every input tool failed with “-File … does not exist” and then paused reading as well: PowerShell resolved the Linux script path against its own current drive. Scripts now get their Windows path and directory, the stop event reaches Windows through `WSLENV`, the takeover helper reports its Windows process id, and screenshot paths come back as `/mnt/...`. When the takeover helper cannot start, only real keyboard and mouse input is refused; reading, background actions and the browser lane keep working, and PowerShell is no longer relaunched several times a second.
- 对话里的电脑操控汇总不再每一轮都显示“未完成”：DSH 回传的工具结果里没有插件读取的 `callId`（0.1.7 起用 `toolCallId`，0.1.5 把结果包在 `tool-result` 块里），每一步都停在“进行中”。现在两种结构都能识别，DSH 0.1.5 里的单步行也显示完成或失败。/ The conversation's computer-use summary no longer marks every turn as unfinished: DSH's tool results carry `toolCallId` (0.1.7 and later) or a `tool-result` block (0.1.5), not the `callId` the plugin read, so every step stayed “working”.
- 显式后台打字（`type_text` 的 `method:'background'`）和后台按键（`keypress` 的 `dispatch:'background'`）改为发给目标窗口里有键盘焦点的控件；以前发给顶层窗口，顶层窗口不会转给里面的文本框，字打不进去。Win32 文本框会读回确认（`verified`）；窗口里没有获得焦点的控件时直接报错。/ Explicit background typing and background keys now go to the focused control of the target window; the top-level window they were posted to did not pass them on. Win32 edits are read back (`verified`), and a window without a focused control is refused.
```

#### 缺口

- 隔离 Windows 任务的完成率、失败接管和总耗时未知。
  **影响**：仅能给出可撤销的有界试用。
  **进一步探讨**：对同一表单任务跑人工、单步插件和批量加确认三条路径，分开记录时间及资源成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
