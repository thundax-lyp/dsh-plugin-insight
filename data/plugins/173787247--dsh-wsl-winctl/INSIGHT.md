# dsh-wsl-winctl

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ba4f78e](https://github.com/173787247/dsh-wsl-winctl/tree/ba4f78e927942207dde73bd5c840f26751f377b1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winctl)
<!-- END META -->

> **功能**：从 WSL 枚举 Windows 窗口，并调整位置、大小、可见状态或请求关闭。

> **亮点**：[Q01](#research-q01) 将窗口枚举及布局动作接到 WSL 会话。

> **主要限制**：[Q02](#research-q02) 缺省目标可能选到第一扇窗口，成功响应不证明 Win32 动作完成。

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
  - [Q01 · 从 WSL 管理窗口适合哪种工作流？](#detail-section-11)
  - [Q02 · 省略目标和忽略 Win32 返回值会怎样？](#detail-section-12)
  - [Q03 · 怎样评估并防止操作错窗口？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：桌面测试者需要安排测试窗口布局并检查结果。

使用 Windows 原生窗口操作或带目标验证的自动化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 窗口枚举 | 定位测试窗口 | 需可访问交互桌面 |
| 窗口控制 | 改变布局或发关闭请求 | 必须核对实际目标与状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与 Windows 交互桌面 | 必需 | 枚举和控制窗口 | 无法读取或执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离桌面并枚举 | 确认唯一测试窗口 |
| 验收 | 用户对比单步动作前后 | 核对真实目标与状态 |
| 退出 | 用户停止并回手工 | 查看是否留有保存提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 建立隔离窗口 | 不处理真实文档 |
| 持续 | 调用开销未知 | 复核身份和状态 | 避免重叠操作 |
| 失败 | 恢复成本未知 | 人工核对窗口 | 不要用 ok 代替状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 布局控制 | 工具可发出窗口动作 | 实际动作效果与准确性 |

> **思考**：[Q02](#research-q02) 缺省目标可能选到第一扇窗口，成功响应不证明 Win32 动作完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将窗口枚举及布局动作接到 WSL 会话。

[Q02](#research-q02) 窗口选择与操作结果未做强校验，并发标记不能证明副作用独立。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 缺省目标可能选到第一扇窗口，成功响应不证明 Win32 动作完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只枚举测试窗口，变更时核对明确目标和可见状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认窗口动作和定位缺口。实际 Windows 权限及成功率未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/winctl.js、lib/winctl-exec.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 Windows、DSH 或窗口动作。
- 下一步：覆盖多实例、空目标、权限、窗口状态、关闭和并发。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winctl](https://github.com/173787247/dsh-wsl-winctl)
- **版本号**：0.1.0（[固定提交 ba4f78e](https://github.com/173787247/dsh-wsl-winctl/tree/ba4f78e927942207dde73bd5c840f26751f377b1)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 强制唯一目标并验证新状态，比较误操作。

覆盖多实例、空目标、权限、窗口状态、关闭和并发。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 491 |
| .js | source | 4 | 296 | 259 | 13 | — |
| .js | test | 1 | 70 | 63 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-winctl/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-winctl/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-winctl/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 用户能否在 DSH 管理指定测试窗口并验证实际变更？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从 WSL 管理窗口适合哪种工作流？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

桌面测试者可先枚举 Windows 顶层窗口和状态，再安排测试窗口的移动、大小、置顶或最小化，便于恢复固定观察布局。相比手动操作，工具在当前 DSH 会话接受结构化参数。源码还支持 close，调用会发出 WM_CLOSE；是否关闭或出现保存提示仍由应用决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/README.md#L3-L7)

作者的窗口管理定位。

```text
DeepSeek Harness plugin: Enumerate and control Windows top-level windows from WSL: activate, minimize, restore, move and resize.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[lib/winctl.js:1-27](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl.js#L1-L27)

动作集合和尺寸处理。

<details>
<summary>查看原文（27行）</summary>

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

export function safeInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/** Moving a window needs both a position and a size; a half-specified move is refused. */
export function normalizeMove(args) {
  const x = safeInt(args?.x, NaN), y = safeInt(args?.y, NaN);
  const width = safeInt(args?.width, NaN), height = safeInt(args?.height, NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("move requires x and y");
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("move requires a positive width and height");
  }
  return { x, y, width, height };
```

</details>

**依据 3 · 源码核查**：[lib/winctl-exec.js:48-94](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl-exec.js#L48-L94)

枚举与窗口变更。

<details>
<summary>查看原文（47行）</summary>

```text
export function buildScript(action, opts) {
  const fg = "$fg = [DshCtl]::GetForegroundWindow()";
  if (action === "windows") {
    return `${PRELUDE}
${fg}
Add-Type -AssemblyName UIAutomationClient; Add-Type -AssemblyName UIAutomationTypes
$cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
$wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
$out = @()
foreach ($w in $wins) { if ($w.Current.NativeWindowHandle -eq 0) { continue } ; $out += (Dsh-Info $w $fg) }
ConvertTo-Json -Compress -Depth 4 @{ windows = @($out) }
`;
  }
  if (action === "state") {
    return `${PRELUDE}
${fg}
$w = Dsh-Find ${opts.pid} '${String(opts.titleContains).replace(/'/g, "''")}'
if ($null -eq $w) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
ConvertTo-Json -Compress -Depth 4 @{ window = (Dsh-Info $w $fg) }
`;
  }
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

#### 缺口

- 未运行布局任务
  **影响**：不能量化布局效率或成功率
  **进一步探讨**：比较同一测试布局的人工操作和会话操作

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 省略目标和忽略 Win32 返回值会怎样？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Dsh-Find 枚举窗口，按正 PID 或非空标题模式筛选，找到第一项就返回。execute 默认 PID 为 0 且标题为空，调用控制动作时没有校验两者至少一个。因此省略目标可能作用于枚举中的第一个带句柄窗口，与提示中的总是明确目标冲突。PID 也可能对应多个窗口，标题使用 -like。MoveWindow、SetWindowPos、PostMessage 和 ShowWindow 的返回值都丢弃；等待后读取同一 UIA 对象，foreground 使用动作前的快照。ok 表示脚本产出而非目标状态已达成。注册还将这些变更标记为并发安全。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-32](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/index.js#L12-L32)

目标声明和并发标记。

<details>
<summary>查看原文（21行）</summary>

```text
    name: "tool:win_windows",
    order: 213,
    text: "Use win_windows to enumerate and control Windows top-level windows from WSL. Every action names its target by pid or title substring; nothing acts on whatever happens to be focused unless you ask for the foreground window.",
  });

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
```

</details>

**依据 2 · 源码核查**：[lib/winctl-exec.js:23-44](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl-exec.js#L23-L44)

首项匹配与状态读取。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/winctl-exec.js:70-114](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl-exec.js#L70-L114)

副作用和默认目标。

<details>
<summary>查看原文（45行）</summary>

```text
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

#### 缺口

- 未验证真实顺序、权限和并发竞争
  **影响**：不能保证动作只作用于预期窗口
  **进一步探讨**：在隔离桌面覆盖空目标、重复标题、关闭确认和同时修改

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样评估并防止操作错窗口？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在支持 interop 的独立 Windows 桌面先只枚举，操作只用可弃用窗口并逐次核对结果。目标不明、状态未改变或出现保存提示时改人工，避免盲重试。可在所有变更要求明确唯一句柄和当前身份，保留 Win32 返回并用新状态校验。用双窗口、多实例与拒绝样例比较误操作率、失败可见性和额外耗时；无法降低错目标或误拒绝明显时放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-33](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/index.js#L25-L33)

宿主门槛。

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "windows", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "windows", error: String(error?.message ?? error) };
      }
```

**依据 2 · 源码核查**：[lib/winctl-exec.js:23-34](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl-exec.js#L23-L34)

当前目标定位。

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

**依据 3 · 源码核查**：[lib/winctl-exec.js:76-107](https://github.com/173787247/dsh-wsl-winctl/blob/ba4f78e927942207dde73bd5c840f26751f377b1/lib/winctl-exec.js#L76-L107)

动作与状态回读基线。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

#### 缺口

- 未测 Windows 版本、焦点及改法
  **影响**：错误恢复成本未知
  **进一步探讨**：在隔离桌面检查唯一目标及窗口状态

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
