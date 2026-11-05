# dsh-wsl-wininput

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[90d6b90](https://github.com/173787247/dsh-wsl-wininput/tree/90d6b907ca7e878a2e59365c91622ff099ebe1bb)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-wininput)
<!-- END META -->

> **功能**：从 WSL 调用 Windows 控件，并发送键盘、文字、点击和滚动操作。

> **亮点**：[Q01](#research-q01) 将语义调用与桌面输入接入 WSL 会话。

> **主要限制**：[Q02](#research-q02) 实际按名称找控件，键盘和坐标路径没有验证实际输入目标。

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
  - [Q01 · 会话能怎样操作一个 Windows 测试窗口？](#detail-section-11)
  - [Q02 · 输入实际绑定目标和控件的强度如何？](#detail-section-12)
  - [Q03 · 怎样验收并降低误输入？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者调试可弃用 Windows 桌面流程。

手工操作 Windows，或使用能验证目标及后置状态的专用自动化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 语义调用 | 操作匹配名称的控件 | 要求 InvokePattern，匹配范围有限 |
| 键鼠输入 | 发送桌面事件 | 焦点及屏幕位置影响实际目标 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与交互桌面 | 必需 | 执行 Windows 操作 | 无会话或权限时失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选可弃用测试应用 | 无敏感数据 |
| 验收 | 用户核对单次动作与实际状态 | 确保未影响其他窗口 |
| 退出 | 用户改手工并检查副作用 | 不盲目重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 建立隔离桌面 | 需确认目标 |
| 持续 | 调用开销未知 | 核对焦点和结果 | 坐标会受其他窗口影响 |
| 失败 | 恢复成本未知 | 检查真实应用状态 | 返回成功不证明动作完成 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面操作 | 能发出语义、键盘及鼠标动作 | 实际命中和节时 |

> **思考**：[Q02](#research-q02) 实际按名称找控件，键盘和坐标路径没有验证实际输入目标。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将语义调用与桌面输入接入 WSL 会话。

[Q02](#research-q02) 控件在当前遍历中重新匹配，调用没有消费先前观察的 handle。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 实际按名称找控件，键盘和坐标路径没有验证实际输入目标。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在可弃用应用验证焦点和结果，暂不用于高影响动作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认执行动作及定位缺口。真实输入去向和收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/wininput-exec.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 Windows、桌面输入、目标或宿主。
- 下一步：覆盖重复标题和控件、失焦、越界坐标与真实结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-wininput](https://github.com/173787247/dsh-wsl-wininput)
- **版本号**：0.1.0（[固定提交 90d6b90](https://github.com/173787247/dsh-wsl-wininput/tree/90d6b907ca7e878a2e59365c91622ff099ebe1bb)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 绑定窗口并复核焦点及坐标，比较误输入。

覆盖重复标题和控件、失焦、越界坐标与真实结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 623 |
| .js | source | 4 | 427 | 361 | 30 | — |
| .js | test | 1 | 50 | 46 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-wininput/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 用户能否用 DSH 操作指定 Windows 测试控件并核对输入实际去向？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话能怎样操作一个 Windows 测试窗口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL 桌面自动化开发者可通过 DSH 对支持 InvokePattern 的控件执行语义调用，或选择键盘、文本、点击与滚动输入。相较手工切换环境，增加跨边界工具入口。合格结果要观察测试应用的实际状态变化，返回动作参数本身不足以证明完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/README.md#L3-L7)

作者的定向输入定位。

```text
DeepSeek Harness plugin: Targeted Windows input from WSL: invoke a UI Automation element, or send keys and clicks to a chosen window without stealing focus.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[index.js:12-32](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/index.js#L12-L32)

Host 注册。

<details>
<summary>查看原文（21行）</summary>

```text
    name: "tool:win_invoke",
    order: 211,
    text: "Use win_invoke to act on Windows UI from WSL. action=invoke activates a UI Automation element by the handle uia_tree returned; the element is re-checked before it is invoked, so a handle from an older observation fails instead of clicking the wrong control. action=type and action=click target a window by pid.",
  });

  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "invoke", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "invoke", error: String(error?.message ?? error) };
```

</details>

**依据 3 · 源码核查**：[lib/wininput-exec.js:196-257](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L196-L257)

实际动作分发。

<details>
<summary>查看原文（62行）</summary>

```text
export async function execute(args, config = {}) {
  const action = assertAction(args?.action ?? "invoke");
  const pid = safeInt(args?.pid);
  const title = typeof args?.titleContains === "string" ? args.titleContains : "";
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));

  if (action === "invoke") {
    const expectName = typeof args?.expectName === "string" ? args.expectName : "";
    if (!expectName) {
      return { ok: false, action, error: "expectName is required: name the element you want, as uia_tree reported it" };
    }
    const expectType = typeof args?.expectType === "string" ? args.expectType : "";
    const maxDepth = Math.min(12, Math.max(1, safeInt(config.invokeMaxDepth, 10)));
    const maxElements = Math.min(3000, Math.max(10, safeInt(config.invokeMaxElements, 1200)));
    const { stdout } = await runPowerShell(
      buildInvokeScript({ pid, title, expectName, expectType, maxDepth, maxElements }),
      { timeoutMs },
    );
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, action, error: String(raw.error), element: raw.element, count: raw.count };
    return { ok: true, action, element: raw.element, window: raw.window, searched: raw.searched };
  }

  if (action === "type") {
    if (typeof args?.text !== "string" || !args.text) return { ok: false, action, error: "text is required" };
    const { stdout } = await runPowerShell(buildTypeScript({ pid, title, text: args.text }), { timeoutMs });
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, action, error: String(raw.error) };
    return { ok: true, action, window: raw.window, text: raw.typed };
  }

  if (action === "key") {
    let sequence;
    try {
      sequence = buildKeySequence(args?.key, Array.isArray(args?.modifiers) ? args.modifiers : []);
    } catch (error) {
      return { ok: false, action, error: String(error.message) };
    }
    const { stdout } = await runPowerShell(buildKeyScript({ pid, title, sequence }), { timeoutMs });
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, action, error: String(raw.error) };
    return { ok: true, action, window: raw.window, sequence: raw.sequence };
  }

  if (action === "scroll") {
    const amount = Math.min(20, Math.max(1, safeInt(args?.amount, 3)));
    const direction = args?.direction === "up" ? "up" : "down";
    const { stdout } = await runPowerShell(
      buildScrollScript({ pid, title, x: safeInt(args?.x, 100), y: safeInt(args?.y, 100), amount, direction }),
      { timeoutMs },
    );
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, action, error: String(raw.error) };
    return { ok: true, action, window: raw.window, scrolled: raw.scrolled };
  }

  const x = safeInt(args?.x, NaN), y = safeInt(args?.y, NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { ok: false, action, error: "click requires x and y" };
  const { stdout } = await runPowerShell(buildClickScript({ pid, title, x, y }), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, action, error: String(raw.error) };
  return { ok: true, action, window: raw.window, point: raw.point };
```

</details>

#### 缺口

- 未运行桌面流程
  **影响**：真实跨环境收益和成功率未知
  **进一步探讨**：在可弃用窗口对照原生输入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入实际绑定目标和控件的强度如何？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

提示声称消费 UIA handle 并拒绝过期，实际 invoke 分支要求 expectName，按 PID/标题找到第一个窗口并重新遍历匹配名称及可选类型，不消费 handle。已扫描范围内匹配多个时拒绝，一个匹配且支持 InvokePattern 才调用。键盘及文本会尝试置前但忽略结果，随后 SendWait，若前台未切换可能输入其他窗口。坐标分支把相对位置换成屏幕坐标，不检查偏移落在目标矩形，鼠标动作指向实际屏幕。脚本输出不验证应用结果。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-26](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/index.js#L12-L26)

工具自述与并发标记。

<details>
<summary>查看原文（15行）</summary>

```text
    name: "tool:win_invoke",
    order: 211,
    text: "Use win_invoke to act on Windows UI from WSL. action=invoke activates a UI Automation element by the handle uia_tree returned; the element is re-checked before it is invoked, so a handle from an older observation fails instead of clicking the wrong control. action=type and action=click target a window by pid.",
  });

  ctx.tools.register({
    name: "win_invoke",
    description: "Targeted Windows input from WSL: invoke a UI Automation element by handle, type text into a window, or click a window-relative point.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => false,
```

</details>

**依据 2 · 源码核查**：[lib/wininput-exec.js:21-30](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L21-L30)

首个窗口选择。

<details>
<summary>查看原文（10行）</summary>

```text
function Dsh-Window([int]$targetPid, [string]$title) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Window)
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) {
    if ($w.Current.NativeWindowHandle -eq 0) { continue }
    if ($targetPid -gt 0 -and $w.Current.ProcessId -ne $targetPid) { continue }
    if ($title -ne '' -and $w.Current.Name -notlike "*$title*") { continue }
    return $w
  }
  return $null
```

</details>

**依据 3 · 源码核查**：[lib/wininput-exec.js:46-88](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L46-L88)

重新遍历、歧义和 InvokePattern。

<details>
<summary>查看原文（43行）</summary>

```text
export function buildInvokeScript({ pid, title, expectName, expectType, maxDepth, maxElements }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker
$matches = New-Object System.Collections.ArrayList
$seen = 0
$queue = New-Object System.Collections.Queue
$queue.Enqueue(@{ el = $target; d = 0 })
while ($queue.Count -gt 0 -and $seen -lt ${maxElements}) {
  $item = $queue.Dequeue(); $el = $item.el; $d = $item.d
  $seen++
  if ($d -gt 0) {
    try {
      $ct = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
      $nm = $el.Current.Name
      $typeOk = ${expectType ? `($ct -eq ${psq(expectType)})` : "$true"}
      if ($typeOk -and $nm -eq ${psq(expectName)}) { [void]$matches.Add($el) }
    } catch {}
  }
  if ($d -lt ${maxDepth}) {
    $c = $walker.GetFirstChild($el)
    while ($c) { $queue.Enqueue(@{ el = $c; d = $d + 1 }); $c = $walker.GetNextSibling($c) }
  }
}
if ($matches.Count -eq 0) { ConvertTo-Json -Compress @{ error = ${psq("no element matched")}; searched = $seen }; exit }
if ($matches.Count -gt 1) {
  ConvertTo-Json -Compress @{ error = ${psq("ambiguous: more than one element matched")}; count = $matches.Count; searched = $seen }
  exit
}
$el = $matches[0]
$o = $null
if (-not $el.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$o)) {
  ConvertTo-Json -Compress @{ error = 'element does not support InvokePattern'; element = @{ controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.',''); name = $el.Current.Name } }
  exit
}
$o.Invoke()
$r = New-Object DshIn+RECT; [void][DshIn]::GetWindowRect([IntPtr]$target.Current.NativeWindowHandle, [ref]$r)
ConvertTo-Json -Compress -Depth 4 @{
  element = @{ controlType = $el.Current.ControlType.ProgrammaticName.Replace('ControlType.',''); name = $el.Current.Name }
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  searched = $seen
  x = $r.L; y = $r.T
```

</details>

**依据 4 · 源码核查**：[lib/wininput-exec.js:126-169](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L126-L169)

焦点、滚动与键盘。

<details>
<summary>查看原文（44行）</summary>

```text
export function buildKeyScript({ pid, title, sequence }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
[void][DshIn]::SetForegroundWindow([IntPtr]$target.Current.NativeWindowHandle)
Start-Sleep -Milliseconds 250
[System.Windows.Forms.SendKeys]::SendWait(${psq(sequence)})
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  sequence = ${psq(sequence)}
}
`;
}

export function buildScrollScript({ pid, title, x, y, amount, direction }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$r = New-Object DshIn+RECT; [void][DshIn]::GetWindowRect([IntPtr]$target.Current.NativeWindowHandle, [ref]$r)
if ($r.R -le $r.L -or $r.B -le $r.T) { ConvertTo-Json -Compress @{ error = 'window has no drawable area' }; exit }
# The wheel goes to whatever is under the cursor, so park it on the target first.
[void][DshIn]::SetCursorPos(($r.L + ${x}), ($r.T + ${y}))
Start-Sleep -Milliseconds 60
[DshIn]::mouse_event(0x0800, 0, 0, ${direction === "up" ? amount : -amount}, [IntPtr]::Zero)
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  scrolled = ${psq(direction + " " + amount)}
}
`;
}

export function buildTypeScript({ pid, title, text }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
# Synthesized keystrokes go to the focused window, so a background target has to
# be raised first.
[void][DshIn]::SetForegroundWindow([IntPtr]$target.Current.NativeWindowHandle)
Start-Sleep -Milliseconds 250
[System.Windows.Forms.SendKeys]::SendWait(${psq(escapeSendKeys(text))})
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  typed = ${psq(text)}
}
```

</details>

**依据 5 · 源码核查**：[lib/wininput-exec.js:178-216](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L178-L216)

鼠标与实际 invoke 参数。

<details>
<summary>查看原文（39行）</summary>

```text
export function buildClickScript({ pid, title, x, y }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$r = New-Object DshIn+RECT; [void][DshIn]::GetWindowRect([IntPtr]$target.Current.NativeWindowHandle, [ref]$r)
if ($r.R -le $r.L -or $r.B -le $r.T) { ConvertTo-Json -Compress @{ error = 'window has no drawable area' }; exit }
$sx = $r.L + ${x}; $sy = $r.T + ${y}
[void][DshIn]::SetCursorPos($sx, $sy)
Start-Sleep -Milliseconds 60
[DshIn]::mouse_event(0x0002, 0, 0, 0, [IntPtr]::Zero)
[DshIn]::mouse_event(0x0004, 0, 0, 0, [IntPtr]::Zero)
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  point = @{ x = ${x}; y = ${y} }
}
`;
}

export async function execute(args, config = {}) {
  const action = assertAction(args?.action ?? "invoke");
  const pid = safeInt(args?.pid);
  const title = typeof args?.titleContains === "string" ? args.titleContains : "";
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));

  if (action === "invoke") {
    const expectName = typeof args?.expectName === "string" ? args.expectName : "";
    if (!expectName) {
      return { ok: false, action, error: "expectName is required: name the element you want, as uia_tree reported it" };
    }
    const expectType = typeof args?.expectType === "string" ? args.expectType : "";
    const maxDepth = Math.min(12, Math.max(1, safeInt(config.invokeMaxDepth, 10)));
    const maxElements = Math.min(3000, Math.max(10, safeInt(config.invokeMaxElements, 1200)));
    const { stdout } = await runPowerShell(
      buildInvokeScript({ pid, title, expectName, expectType, maxDepth, maxElements }),
      { timeoutMs },
    );
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, action, error: String(raw.error), element: raw.element, count: raw.count };
    return { ok: true, action, element: raw.element, window: raw.window, searched: raw.searched };
```

</details>

#### 缺口

- 未测试多窗口、焦点切换及屏幕坐标
  **影响**：不能保证键鼠落到指定目标
  **进一步探讨**：用隔离桌面验证重复标题、错误焦点和越界点击

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收并降低误输入？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

仅在 interop 可用的隔离桌面操作可弃用应用，避免真实内容和高影响动作。先核对控件名、类型与应用状态，再确认实际后置状态；遇目标或焦点不明即改手工。可对照明确窗口句柄、输入前复核当前前台和坐标范围，并在状态无法确认时停下。测多窗口中错目标率、误拒绝和额外等待，若不能下降则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-33](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/index.js#L25-L33)

宿主拒绝与执行。

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, action: args?.action ?? "invoke", error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, action: args?.action ?? "invoke", error: String(error?.message ?? error) };
      }
```

**依据 2 · 源码核查**：[lib/wininput-exec.js:126-169](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L126-L169)

未验证焦点基线。

<details>
<summary>查看原文（44行）</summary>

```text
export function buildKeyScript({ pid, title, sequence }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
[void][DshIn]::SetForegroundWindow([IntPtr]$target.Current.NativeWindowHandle)
Start-Sleep -Milliseconds 250
[System.Windows.Forms.SendKeys]::SendWait(${psq(sequence)})
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  sequence = ${psq(sequence)}
}
`;
}

export function buildScrollScript({ pid, title, x, y, amount, direction }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$r = New-Object DshIn+RECT; [void][DshIn]::GetWindowRect([IntPtr]$target.Current.NativeWindowHandle, [ref]$r)
if ($r.R -le $r.L -or $r.B -le $r.T) { ConvertTo-Json -Compress @{ error = 'window has no drawable area' }; exit }
# The wheel goes to whatever is under the cursor, so park it on the target first.
[void][DshIn]::SetCursorPos(($r.L + ${x}), ($r.T + ${y}))
Start-Sleep -Milliseconds 60
[DshIn]::mouse_event(0x0800, 0, 0, ${direction === "up" ? amount : -amount}, [IntPtr]::Zero)
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  scrolled = ${psq(direction + " " + amount)}
}
`;
}

export function buildTypeScript({ pid, title, text }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
# Synthesized keystrokes go to the focused window, so a background target has to
# be raised first.
[void][DshIn]::SetForegroundWindow([IntPtr]$target.Current.NativeWindowHandle)
Start-Sleep -Milliseconds 250
[System.Windows.Forms.SendKeys]::SendWait(${psq(escapeSendKeys(text))})
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  typed = ${psq(text)}
}
```

</details>

**依据 3 · 源码核查**：[lib/wininput-exec.js:178-191](https://github.com/173787247/dsh-wsl-wininput/blob/90d6b907ca7e878a2e59365c91622ff099ebe1bb/lib/wininput-exec.js#L178-L191)

坐标投影及直接动作。

<details>
<summary>查看原文（14行）</summary>

```text
export function buildClickScript({ pid, title, x, y }) {
  return `${PRELUDE}
$target = Dsh-Window ${pid} '${title.replace(/'/g, "''")}'
if ($null -eq $target) { ConvertTo-Json -Compress @{ error = 'no matching window' }; exit }
$r = New-Object DshIn+RECT; [void][DshIn]::GetWindowRect([IntPtr]$target.Current.NativeWindowHandle, [ref]$r)
if ($r.R -le $r.L -or $r.B -le $r.T) { ConvertTo-Json -Compress @{ error = 'window has no drawable area' }; exit }
$sx = $r.L + ${x}; $sy = $r.T + ${y}
[void][DshIn]::SetCursorPos($sx, $sy)
Start-Sleep -Milliseconds 60
[DshIn]::mouse_event(0x0002, 0, 0, 0, [IntPtr]::Zero)
[DshIn]::mouse_event(0x0004, 0, 0, 0, [IntPtr]::Zero)
ConvertTo-Json -Compress -Depth 4 @{
  window = @{ pid = $target.Current.ProcessId; title = $target.Current.Name }
  point = @{ x = ${x}; y = ${y} }
```

</details>

#### 缺口

- 真实宿主与改法未运行
  **影响**：误操作和恢复成本未知
  **进一步探讨**：使用虚拟文档验证焦点竞争、坐标边界及拒绝

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
