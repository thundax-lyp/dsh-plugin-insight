# dsh-wsl-winctl

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[2e22c81](https://github.com/173787247/dsh-wsl-winctl/tree/2e22c81fb6375a17d387226f0dfe359ba5dc3954)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winctl)
<!-- END META -->

> **实现功能**：从 WSL 枚举并控制 Windows 顶层窗口的 Agent 工具，支持窗口状态与多种变更动作。

> **核心亮点**：把 Windows 窗口枚举和基础控制封装为 WSL Agent 工具。详见[Q01](#research-q01)。

> **风险与缺陷**：作者显式目标承诺与空目标首窗选择不符；activate/close 等返回值被忽略，成功状态不可直接信。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 窗口控制插件实际暴露哪些动作？](#detail-section-11)
  - [Q02 · 目标窗口如何匹配和执行 Win32 操作？](#detail-section-12)
  - [Q03 · 不指定目标时真的不会作用于当前随机窗口吗？](#detail-section-13)
  - [Q04 · activate 与 ok:true 能否证明状态真的变更？](#detail-section-14)
  - [Q05 · 怎样限制误操作并验证价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可交互 Windows 桌面的窗口管理辅助；变更前需明确唯一目标。详见[Q01](#research-q01)。

Windows 原生窗口 UI/PowerShell 可手动选目标并观察结果；插件省步骤但需增加唯一性和结果核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 枚举 | 找窗口 | UIA 覆盖未知 |
| 控制 | 改窗口状态 | 返回值未验证 |
| 目标筛选 | PID/标题 | 空参选首个、同名不唯一 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| WSL/Windows 桌面 | 必需 | 窗口对象 | 无结果 |
| PowerShell/UIAutomation | 必需 | 枚举/调用 | 执行失败 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 列表 | windows/state | 识别 PID/标题 |
| 确认 | 选唯一目标 | 避免空参 |
| 操作 | move/activate 等 | 宿主许可 |
| 复核 | state/windows | 观察实际状态 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 接入 WSL/PowerShell/UIA，确定窗口许可/审批 | 使用本机 Windows/WSL 资源；额外购买费未见，未知 | 设置环境、按 PID/标题核权限，工时未知 | 权限/UIA 不兼容需停用/回退手工操作 |
| 持续 | 枚举窗口、调用 Win32 并复核状态 | PowerShell/UIA CPU 与桌面切换，量和金额未知 | 唯一目标确认、执行后状态比对，工时未知 | 多窗口/通配符误匹配频率未知 |
| 失败恢复 | 处理错窗移动/最小化/关闭或焦点失败 | 未保存工作损失、重开应用资源与现金影响未知 | 恢复布局、确认保存对话框、重做丢失工作，工时未知 | 返回 ok:true 不足以定位真实失败 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 窗口枚举 | UIA 顶层列表 | 覆盖所有窗口 |
| 变更 | Win32 调用 | 实际成功 |
| 精确目标 | PID/标题可选 | 空目标安全 |

> **思考**：作者显式目标承诺与空目标首窗选择不符；activate/close 等返回值被忽略，成功状态不可直接信。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 窗口枚举和基础控制封装为 WSL Agent 工具。详见[Q01](#research-q01)。

把 Windows 窗口枚举和基础控制封装为 WSL Agent 工具。详见[Q01](#research-q01)。

PowerShell/WIn32 桥与 move 参数校验有参考性，目标选择与返回状态需严格化。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

作者显式目标承诺与空目标首窗选择不符；activate/close 等返回值被忽略，成功状态不可直接信。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只读枚举，变更时提供 PID+标题并事后复核；close/topmost 需人类批准。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核9种动作；空目标仍取首个窗口、activate 未真正设前台、返回 ok:true 不验证 Win32 成功；目标桌面未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/winctl.js、lib/winctl-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/winctl.js、lib/winctl-exec.js、lib/wsl-host.js、包声明；未在 Windows/WSL 执行动作。旧 META 仅复用。
- 下一步：目标 Windows 测空目标、同 PID 多窗口、通配符标题、焦点拒绝、关闭确认和 Win32 失败返回。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winctl](https://github.com/173787247/dsh-wsl-winctl)
- **版本号**：0.1.0（[固定提交 2e22c81](https://github.com/173787247/dsh-wsl-winctl/tree/2e22c81fb6375a17d387226f0dfe359ba5dc3954)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为强制目标唯一、标题字面匹配、实际焦点调用及事后状态确认。详见[Q05](#research-q05)。

目标 Windows 测空目标、同 PID 多窗口、通配符标题、焦点拒绝、关闭确认和 Win32 失败返回。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 491 |
| .js | source | 4 | 296 | 259 | 13 | — |
| .js | test | 1 | 70 | 63 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-winctl/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 顶层窗口控制在目标唯一性、动作成功确认和用户工作保护上是否可靠？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 窗口控制插件实际暴露哪些动作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

win_windows 暴露 windows/state 与 activate/minimize/maximize/restore/move/topmost/close，总计9类 action，可从 WSL 控制 Windows 顶层窗口。README 主要介绍激活、最小化、还原、移动/调整大小，却未突出 topmost 和 close；后两者也有桌面副作用。适合本机可交互桌面的辅助管理，但模型执行变更前需明确窗口和用户授权。源码只证 API 调用，未证实际焦点/关闭成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-29](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/README.zh.md#L1-L29)

作者定位与显式目标主张

<details>
<summary>查看原文（29行）</summary>

````text
# dsh-wsl-winctl

> 从 WSL 枚举与控制 Windows 顶层窗口：激活、最小化、还原、移动与调整大小。

DeepSeek Harness 插件：Enumerate and control Windows top-level windows from WSL: activate, minimize, restore, move and resize.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-winctl
```

## 用法

```
win_windows action=windows
win_windows action=activate titleContains="Notepad"
win_windows action=move pid=1234 x=0 y=0 width=1280 height=800
```

## 说明

Every action names its target by `pid` or `titleContains`; nothing acts on
whatever happens to be focused. `move` requires a position **and** a positive size —
a half-specified move is refused rather than guessed at.
````

</details>

**依据 2 · 源码核查**：[lib/winctl.js:1-12](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl.js#L1-L12)

9类 action

<details>
<summary>查看原文（12行）</summary>

```text
// Window lifecycle control. Every command names its target explicitly; nothing
// here acts on "whatever happens to be focused".
export const ACTIONS = ["windows", "state", "activate", "minimize", "maximize", "restore", "move", "topmost", "close"];

export const ALLOWED_ACTIONS = new Set(ACTIONS);

export function assertAction(action) {
  if (!ALLOWED_ACTIONS.has(action)) {
    throw new Error(`unsupported action: ${String(action)} (expected one of ${ACTIONS.join(", ")})`);
  }
  return action;
}
```

</details>

**依据 3 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/index.js#L17-L37)

工具注册

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_windows",
    description: "Enumerate and control Windows top-level windows from WSL: activate, minimize, maximize, restore, move and resize.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "windows", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "windows", error: String(error?.message ?? error) };
      }
    },
    presentCall: (args) => ({ card: "generic", title: `win_windows ${args?.action ?? "windows"}` }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_windows", content: result?.content }),
  });
```

</details>

#### 缺口

- 目标 Windows 桌面权限/会话未测
  **影响**：不能把静态 action 当成功控制
  **进一步探讨**：目标窗口多实例逐动作验证

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标窗口如何匹配和执行 Win32 操作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

PowerShell UIAutomation 遍历根的顶层 Window，按 PID 和 titleContains 过滤，返回首个匹配；move 要求 x/y 与正宽高，topmost 通过 SetWindowPos，close 发送 WM_CLOSE，其他动作调用 ShowWindow。标题使用 -like "*标题*"，其中用户输入的通配符仍按 PowerShell 模式解释，不是字面子串；多窗口同 PID/同标题会取遍历首个。行动后只等200ms，再读该 UIA 对象状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/winctl-exec.js:21-45](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L21-L45)

UIA 查找/信息

<details>
<summary>查看原文（25行）</summary>

```text
# $pid is a read-only automatic variable in PowerShell (the current process
# id) - using it as a parameter name makes the function uncallable.
function Dsh-Find([int]$targetPid, [string]$title) {
  Add-Type -AssemblyName UIAutomationClient; Add-Type -AssemblyName UIAutomationTypes
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) {
    if ($w.Current.NativeWindowHandle -eq 0) { continue }
    if ($targetPid -gt 0 -and $w.Current.ProcessId -ne $targetPid) { continue }
    if ($title -ne '' -and $w.Current.Name -notlike "*$title*") { continue }
    return $w
  }
  return $null
}
function Dsh-I([double]$v) { if ([double]::IsNaN($v) -or [double]::IsInfinity($v)) { 0 } else { [int]$v } }
function Dsh-Info($w, $fg) {
  $r = $w.Current.BoundingRectangle
  $hw = [IntPtr]$w.Current.NativeWindowHandle
  # WS_EX_TOPMOST is 0x8 in the extended style.
  $ex = [DshCtl]::GetWindowLong($hw, -20)
  @{ pid = $w.Current.ProcessId; handle = $w.Current.NativeWindowHandle.ToString(); title = $w.Current.Name;
     minimized = [DshCtl]::IsIconic($hw); maximized = [DshCtl]::IsZoomed($hw); topmost = (($ex -band 0x8) -ne 0);
     x = (Dsh-I $r.X); y = (Dsh-I $r.Y); width = (Dsh-I $r.Width); height = (Dsh-I $r.Height);
     foreground = ($w.Current.NativeWindowHandle -eq $fg.ToInt64()) }
}
```

</details>

**依据 2 · 源码核查**：[lib/winctl-exec.js:69-95](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L69-L95)

动作 Win32 调用

<details>
<summary>查看原文（27行）</summary>

```text
  const SW = { activate: 5, minimize: 6, maximize: 3, restore: 9 };
  if (action !== "move" && action !== "topmost" && action !== "close" && SW[action] === undefined) {
    throw new Error(`no ShowWindow flag for action: ${action}`);
  }
  // Topmost has to go through SetWindowPos: the WS_EX_TOPMOST style bit alone is
  // a request the window manager may ignore, and reading it back then reports a
  // state the window is not actually in. HWND_TOPMOST is -1, HWND_NOTOPMOST -2.
  const call = action === "move"
    ? `[void][DshCtl]::MoveWindow($h, ${opts.x}, ${opts.y}, ${opts.width}, ${opts.height}, $true)`
    : action === "topmost"
      ? `[void][DshCtl]::SetWindowPos($h, [IntPtr]${opts.on ? -1 : -2}, 0, 0, 0, 0, 0x0003)`
      // Closing is a message, not a ShowWindow flag: WM_CLOSE asks the window to
      // close, which is what lets an application prompt to save first.
      : action === "close"
        ? `[void][DshCtl]::PostMessage($h, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero)`
        : `[void][DshCtl]::ShowWindow($h, ${SW[action]})`;
  return `${PRELUDE}
${fg}
$w = Dsh-Find ${opts.pid} '${String(opts.titleContains).replace(/'/g, "''")}'
if ($null -eq $w) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$h = [IntPtr]$w.Current.NativeWindowHandle
${call}
Start-Sleep -Milliseconds 200
$w2 = $w
ConvertTo-Json -Compress -Depth 4 @{ window = (Dsh-Info $w2 $fg) }
`;
}
```

</details>

**依据 3 · 源码核查**：[lib/winctl.js:19-28](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl.js#L19-L28)

move 参数限制

<details>
<summary>查看原文（10行）</summary>

```text
/** Moving a window needs both a position and a size; a half-specified move is refused. */
export function normalizeMove(args) {
  const x = safeInt(args?.x, NaN), y = safeInt(args?.y, NaN);
  const width = safeInt(args?.width, NaN), height = safeInt(args?.height, NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("move requires x and y");
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("move requires a positive width and height");
  }
  return { x, y, width, height };
}
```

</details>

#### 缺口

- 目标 UIA 顺序/标题通配行为未测
  **影响**：匹配可能不唯一、标题通配扩大目标
  **进一步探讨**：目标同 PID 多窗口与含星号标题测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不指定目标时真的不会作用于当前随机窗口吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

README 声称每个动作按 PID 或标题指定；但参数 schema 没把 pid/titleContains 设为必填，execute 默认 pid=0/titleContains=""，Dsh-Find 此时遍历后返回第一个顶层窗口。该窗口不一定是前台，且代码没有拒绝空目标。因而任何变更 action 未给目标时可能改动任意枚举首项；与“不会作用在当前焦点窗口”口径不同，风险比焦点误判更大。需在变更动作前强制唯一目标并显示匹配信息。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:25-29](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/README.zh.md#L25-L29)

作者显式指定目标说法

```text
## 说明

Every action names its target by `pid` or `titleContains`; nothing acts on
whatever happens to be focused. `move` requires a position **and** a positive size —
a half-specified move is refused rather than guessed at.
```

**依据 2 · 源码核查**：[lib/winctl.js:67-81](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl.js#L67-L81)

参数 pid/titleContains 可选

<details>
<summary>查看原文（15行）</summary>

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      action: { type: "string", enum: ACTIONS, description: "windows: list them all. state: one window's details. activate/minimize/maximize/restore/close: act on the target. move: reposition and resize. topmost: keep it above other windows." },
      pid: { type: "number", description: "Target process id. Defaults to the foreground window." },
      titleContains: { type: "string", description: "Pick the target by window title instead of pid." },
      on: { type: "boolean", description: "topmost: true to keep the window above others, false to release it." },
      x: { type: "number", description: "move: left edge in screen pixels." },
      y: { type: "number", description: "move: top edge in screen pixels." },
      width: { type: "number", description: "move: width in pixels." },
      height: { type: "number", description: "move: height in pixels." },
    },
  };
```

</details>

**依据 3 · 源码核查**：[lib/winctl-exec.js:23-34](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L23-L34)

空过滤取首个窗口

<details>
<summary>查看原文（12行）</summary>

```text
function Dsh-Find([int]$targetPid, [string]$title) {
  Add-Type -AssemblyName UIAutomationClient; Add-Type -AssemblyName UIAutomationTypes
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) {
    if ($w.Current.NativeWindowHandle -eq 0) { continue }
    if ($targetPid -gt 0 -and $w.Current.ProcessId -ne $targetPid) { continue }
    if ($title -ne '' -and $w.Current.Name -notlike "*$title*") { continue }
    return $w
  }
  return $null
}
```

</details>

**依据 4 · 源码核查**：[lib/winctl-exec.js:97-114](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L97-L114)

默认空 target 仍执行

<details>
<summary>查看原文（18行）</summary>

```text
export async function execute(args, config = {}) {
  const action = assertAction(args?.action ?? "windows");
  const opts = {
    pid: safeInt(args?.pid),
    titleContains: typeof args?.titleContains === "string" ? args.titleContains : "",
  };
  if (action === "move") Object.assign(opts, normalizeMove(args));
  if (action === "topmost") opts.on = args?.on !== false;
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const { stdout } = await runPowerShell(buildScript(action, opts), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: String(raw.error) };
  if (action === "windows") {
    const windows = (raw.windows ?? []).map(normalizeWindow);
    return { ok: true, action, count: windows.length, windows };
  }
  if (action === "state") return { ok: true, action, window: normalizeState(raw.window) };
  return { ok: true, action, window: normalizeState(raw.window) };
```

</details>

#### 缺口

- 目标 UIA 枚举具体首项未测
  **影响**：可能误关/最小化其他应用窗口
  **进一步探讨**：目标隔离桌面调用无参数变更动作观察

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · activate 与 ok:true 能否证明状态真的变更？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

代码导入 SetForegroundWindow 却未在 action 分支调用；activate 映射 ShowWindow(h,5)，主要是显示窗口，未保证取得前台焦点。ShowWindow、MoveWindow、SetWindowPos、PostMessage 的返回值都被 [void] 丢弃；只要脚本未异常，JS 将 raw.window 规范化后返回 ok:true，没有检查 Win32 成功或目标变化。WM_CLOSE 还可触发应用“保存更改”对话框，发送不等于窗口已关闭。对关键操作必须事后 state/windows 复核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/winctl-exec.js:9-18](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L9-L18)

导入 SetForegroundWindow 等 API

<details>
<summary>查看原文（10行）</summary>

```text
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool repaint);
  [DllImport("user32.dll")] public static extern bool IsZoomed(IntPtr h);
  [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr h, int index);
  [DllImport("user32.dll")] public static extern int SetWindowLong(IntPtr h, int index, int value);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int ht, uint flags);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
```

</details>

**依据 2 · 源码核查**：[lib/winctl-exec.js:69-94](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L69-L94)

activate/close 调用且丢返回值

<details>
<summary>查看原文（26行）</summary>

```text
  const SW = { activate: 5, minimize: 6, maximize: 3, restore: 9 };
  if (action !== "move" && action !== "topmost" && action !== "close" && SW[action] === undefined) {
    throw new Error(`no ShowWindow flag for action: ${action}`);
  }
  // Topmost has to go through SetWindowPos: the WS_EX_TOPMOST style bit alone is
  // a request the window manager may ignore, and reading it back then reports a
  // state the window is not actually in. HWND_TOPMOST is -1, HWND_NOTOPMOST -2.
  const call = action === "move"
    ? `[void][DshCtl]::MoveWindow($h, ${opts.x}, ${opts.y}, ${opts.width}, ${opts.height}, $true)`
    : action === "topmost"
      ? `[void][DshCtl]::SetWindowPos($h, [IntPtr]${opts.on ? -1 : -2}, 0, 0, 0, 0, 0x0003)`
      // Closing is a message, not a ShowWindow flag: WM_CLOSE asks the window to
      // close, which is what lets an application prompt to save first.
      : action === "close"
        ? `[void][DshCtl]::PostMessage($h, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero)`
        : `[void][DshCtl]::ShowWindow($h, ${SW[action]})`;
  return `${PRELUDE}
${fg}
$w = Dsh-Find ${opts.pid} '${String(opts.titleContains).replace(/'/g, "''")}'
if ($null -eq $w) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$h = [IntPtr]$w.Current.NativeWindowHandle
${call}
Start-Sleep -Milliseconds 200
$w2 = $w
ConvertTo-Json -Compress -Depth 4 @{ window = (Dsh-Info $w2 $fg) }
`;
```

</details>

**依据 3 · 源码核查**：[lib/winctl-exec.js:97-114](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L97-L114)

无结果验证即 ok:true

<details>
<summary>查看原文（18行）</summary>

```text
export async function execute(args, config = {}) {
  const action = assertAction(args?.action ?? "windows");
  const opts = {
    pid: safeInt(args?.pid),
    titleContains: typeof args?.titleContains === "string" ? args.titleContains : "",
  };
  if (action === "move") Object.assign(opts, normalizeMove(args));
  if (action === "topmost") opts.on = args?.on !== false;
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const { stdout } = await runPowerShell(buildScript(action, opts), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: String(raw.error) };
  if (action === "windows") {
    const windows = (raw.windows ?? []).map(normalizeWindow);
    return { ok: true, action, count: windows.length, windows };
  }
  if (action === "state") return { ok: true, action, window: normalizeState(raw.window) };
  return { ok: true, action, window: normalizeState(raw.window) };
```

</details>

#### 缺口

- 目标 Windows 焦点策略/应用关闭确认未测
  **影响**：工具成功文本可能与真实桌面状态不一致
  **进一步探讨**：目标禁止前台切换/拒绝关闭窗口对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样限制误操作并验证价值？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先在隔离 Windows 桌面只用 windows/state 枚举，变更时传明确 PID 与标题并在前后复核状态；close/topmost 应有宿主用户批准，避免对未保存工作下发。改进可对变更动作强制非空且唯一目标、标题做字面匹配、activate 调 SetForegroundWindow 并检查返回/前台、所有动作返回实际状态与不确定结果；均未实现。部署成本主要是 UIA/PowerShell 运行与误操作恢复，真实耗时未测。 假设的起点是源码中可选 pid/title 允许空目标首匹配，Win32 返回值又被丢弃；因此把工具回报当成功会增加误操作概率。相对固定版，强制变更动作以 PID+字面标题唯一匹配、执行后核前台/矩形/关闭状态并在不确定时返回 unknown，而非 ok:true，可能减少错窗操作与假成功。条件是 UIA 能稳定枚举目标且宿主允许用户审批；代价是多次查询、延迟和在焦点策略限制下更多“不确定”结果。最小对照构造两个同 PID 窗口、同标题/含通配符标题、空目标、拒绝焦点、关闭前保存对话框，比较固定版/原型的误选率、真实状态与报告一致率、人工恢复时间。若原型仍误选、把保存对话框当关闭成功，或不确定率过高导致工作流无法用，即证伪增量；建议未在固定版实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-42](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/README.zh.md#L11-L42)

作者安装/依赖

<details>
<summary>查看原文（32行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-winctl
```

## 用法

```
win_windows action=windows
win_windows action=activate titleContains="Notepad"
win_windows action=move pid=1234 x=0 y=0 width=1280 height=800
```

## 说明

Every action names its target by `pid` or `titleContains`; nothing acts on
whatever happens to be focused. `move` requires a position **and** a positive size —
a half-specified move is refused rather than guessed at.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。
- PowerShell 位于标准路径（插件自己会找）。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。
````

</details>

**依据 2 · 源码核查**：[lib/winctl-exec.js:21-45](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L21-L45)

目标查找

<details>
<summary>查看原文（25行）</summary>

```text
# $pid is a read-only automatic variable in PowerShell (the current process
# id) - using it as a parameter name makes the function uncallable.
function Dsh-Find([int]$targetPid, [string]$title) {
  Add-Type -AssemblyName UIAutomationClient; Add-Type -AssemblyName UIAutomationTypes
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) {
    if ($w.Current.NativeWindowHandle -eq 0) { continue }
    if ($targetPid -gt 0 -and $w.Current.ProcessId -ne $targetPid) { continue }
    if ($title -ne '' -and $w.Current.Name -notlike "*$title*") { continue }
    return $w
  }
  return $null
}
function Dsh-I([double]$v) { if ([double]::IsNaN($v) -or [double]::IsInfinity($v)) { 0 } else { [int]$v } }
function Dsh-Info($w, $fg) {
  $r = $w.Current.BoundingRectangle
  $hw = [IntPtr]$w.Current.NativeWindowHandle
  # WS_EX_TOPMOST is 0x8 in the extended style.
  $ex = [DshCtl]::GetWindowLong($hw, -20)
  @{ pid = $w.Current.ProcessId; handle = $w.Current.NativeWindowHandle.ToString(); title = $w.Current.Name;
     minimized = [DshCtl]::IsIconic($hw); maximized = [DshCtl]::IsZoomed($hw); topmost = (($ex -band 0x8) -ne 0);
     x = (Dsh-I $r.X); y = (Dsh-I $r.Y); width = (Dsh-I $r.Width); height = (Dsh-I $r.Height);
     foreground = ($w.Current.NativeWindowHandle -eq $fg.ToInt64()) }
}
```

</details>

**依据 3 · 源码核查**：[lib/winctl-exec.js:69-114](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js#L69-L114)

操作与返回

<details>
<summary>查看原文（46行）</summary>

```text
  const SW = { activate: 5, minimize: 6, maximize: 3, restore: 9 };
  if (action !== "move" && action !== "topmost" && action !== "close" && SW[action] === undefined) {
    throw new Error(`no ShowWindow flag for action: ${action}`);
  }
  // Topmost has to go through SetWindowPos: the WS_EX_TOPMOST style bit alone is
  // a request the window manager may ignore, and reading it back then reports a
  // state the window is not actually in. HWND_TOPMOST is -1, HWND_NOTOPMOST -2.
  const call = action === "move"
    ? `[void][DshCtl]::MoveWindow($h, ${opts.x}, ${opts.y}, ${opts.width}, ${opts.height}, $true)`
    : action === "topmost"
      ? `[void][DshCtl]::SetWindowPos($h, [IntPtr]${opts.on ? -1 : -2}, 0, 0, 0, 0, 0x0003)`
      // Closing is a message, not a ShowWindow flag: WM_CLOSE asks the window to
      // close, which is what lets an application prompt to save first.
      : action === "close"
        ? `[void][DshCtl]::PostMessage($h, 0x0010, [IntPtr]::Zero, [IntPtr]::Zero)`
        : `[void][DshCtl]::ShowWindow($h, ${SW[action]})`;
  return `${PRELUDE}
${fg}
$w = Dsh-Find ${opts.pid} '${String(opts.titleContains).replace(/'/g, "''")}'
if ($null -eq $w) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$h = [IntPtr]$w.Current.NativeWindowHandle
${call}
Start-Sleep -Milliseconds 200
$w2 = $w
ConvertTo-Json -Compress -Depth 4 @{ window = (Dsh-Info $w2 $fg) }
`;
}

export async function execute(args, config = {}) {
  const action = assertAction(args?.action ?? "windows");
  const opts = {
    pid: safeInt(args?.pid),
    titleContains: typeof args?.titleContains === "string" ? args.titleContains : "",
  };
  if (action === "move") Object.assign(opts, normalizeMove(args));
  if (action === "topmost") opts.on = args?.on !== false;
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const { stdout } = await runPowerShell(buildScript(action, opts), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: String(raw.error) };
  if (action === "windows") {
    const windows = (raw.windows ?? []).map(normalizeWindow);
    return { ok: true, action, count: windows.length, windows };
  }
  if (action === "state") return { ok: true, action, window: normalizeState(raw.window) };
  return { ok: true, action, window: normalizeState(raw.window) };
```

</details>

**依据 4 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/index.js#L17-L37)

工具执行

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_windows",
    description: "Enumerate and control Windows top-level windows from WSL: activate, minimize, maximize, restore, move and resize.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "windows", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "windows", error: String(error?.message ?? error) };
      }
    },
    presentCall: (args) => ({ card: "generic", title: `win_windows ${args?.action ?? "windows"}` }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_windows", content: result?.content }),
  });
```

</details>

#### 缺口

- 目标宿主审批与误操作恢复成本未知
  **影响**：不能直接用于生产桌面自动化
  **进一步探讨**：隔离桌面先只读、再逐动作矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
