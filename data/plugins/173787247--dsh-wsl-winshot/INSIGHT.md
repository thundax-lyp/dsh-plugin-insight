# dsh-wsl-winshot

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[332f9f5](https://github.com/173787247/dsh-wsl-winshot/tree/332f9f5791f5fa267c0760c7f44405d22e29a82c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-winshot)
<!-- END META -->

> **功能**：从 WSL 捕获 Windows 窗口或指定区域并保存 PNG。

> **亮点**：[Q01](#research-q01) 将目标选择、元素裁剪和 PNG 落盘串成一个会话工具。

> **主要限制**：[Q02](#research-q02) 矩形抓取读取实际屏幕，可能包含遮挡内容，也会恢复最小化窗口并写文件。

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
  - [Q01 · 截图工具何时能帮助复核 Windows 界面？](#detail-section-11)
  - [Q02 · 目标选中后图像是否只含该窗口内容？](#detail-section-12)
  - [Q03 · 如何验收并降低截错窗口的代价？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：桌面流程排查需要将指定窗口画面保存到 WSL。

在 Windows 手工截图，再保存到指定 WSL 可访问目录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 窗口截图 | 生成可在 WSL 检查的 PNG | 捕获屏幕矩形，遮挡内容可能进入图像 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与交互式 Windows 桌面 | 必需 | 调用 PowerShell 和屏幕抓取 | 无可绘制窗口时失败 |
| Windows Public 与 WSL 目标目录可写 | 必需 | 临时和最终图像 | 复制失败或留下临时文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离桌面、PID 和目录 | 无敏感窗口 |
| 截图 | 用户指定目标并检查 PNG | 确认无其他窗口内容 |
| 退出 | 用户回原生截图并检查临时文件 | 确认残留及目标路径 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 磁盘资源未知 | 配置 interop 与测试目录 | 需可见桌面 |
| 持续 | 复制开销未知 | 检查图像目标与尺寸 | 可能需清理临时文件 |
| 失败 | 排查耗时未知 | 检查遮挡、权限和残留 | 窗口恢复改变桌面状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 截图交付 | 输出窗口矩形或元素裁剪 PNG | 遮挡下的实际准确性和节时 |

> **思考**：[Q02](#research-q02) 矩形抓取读取实际屏幕，可能包含遮挡内容，也会恢复最小化窗口并写文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将目标选择、元素裁剪和 PNG 落盘串成一个会话工具。

[Q02](#research-q02) 图像是屏幕像素而非窗口离屏缓冲，不能单凭匹配 PID 确认内容。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 矩形抓取读取实际屏幕，可能包含遮挡内容，也会恢复最小化窗口并写文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在隔离桌面用明确 PID 和目录验收，结果不符回原生。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认选区和文件路径，实际桌面、隐私与误捕未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/shot.js、lib/shot-exec.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查。未运行 Windows、PowerShell、桌面捕获或 DSH。
- 下一步：验证可见、遮挡、多窗口、最小化、DPI、目录失败和临时残留。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winshot](https://github.com/173787247/dsh-wsl-winshot)
- **版本号**：0.1.0（[固定提交 332f9f5](https://github.com/173787247/dsh-wsl-winshot/tree/332f9f5791f5fa267c0760c7f44405d22e29a82c)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在抓取前复核身份与遮挡，比较错捕和额外延迟。

验证可见、遮挡、多窗口、最小化、DPI、目录失败和临时残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 119 | — | — | 472 |
| .js | source | 4 | 319 | 273 | 18 | — |
| .js | test | 2 | 118 | 105 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-winshot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 用户能否从 DSH 保存正确的 Windows 窗口证据并限制非预期像素？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 截图工具何时能帮助复核 Windows 界面？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL 中维护桌面流程的人可按 PID 找窗口，或用前台窗口，按窗口坐标或指定 UIA 元素裁剪，再得到 WSL 中 PNG 路径。相比手工截图后跨环境传文件，插件把选择、裁剪和复制串到 DSH。实际工具 schema 不接受窗口句柄，与 README 提到的句柄方式有差异；模型文本返回路径和尺寸，不内嵌图像。成功要以实际图像包含预期目标为准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/README.md#L3-L7)

作者提及 PID 或窗口句柄。

```text
DeepSeek Harness plugin: Capture a specific Windows window to a WSL file, by process id or window handle.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[index.js:11-24](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/index.js#L11-L24)

实际工具范围。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:win_shot_window",
    order: 212,
    text: "Use win_shot_window to capture a specific Windows window into a WSL file: pass pid, or omit it for the foreground window. Use dsh-wsl-shot instead when the image is already on the clipboard.",
  });

  ctx.tools.register({
    name: "win_shot_window",
    description: "Capture a specific Windows window to a WSL file, by process id or the foreground window.",
    parameters: shot.parameters(),
    output: {
      schema: shot.outputSchema(),
      render: (_args, value) => [{ type: "text", text: shot.format(value) }],
    },
```

</details>

**依据 3 · 源码核查**：[lib/shot.js:42-69](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot.js#L42-L69)

文本及输入。

<details>
<summary>查看原文（28行）</summary>

```text
export function format(v) {
  const lines = [`win_shot_window ok=${v.ok}`];
  if (v.path) lines.push(`path: ${v.path}`);
  if (v.width) lines.push(`size: ${v.width}x${v.height}`);
  if (v.crop) lines.push(`crop: ${v.crop.width}x${v.crop.height} at ${v.crop.x},${v.crop.y} (window-relative)`);
  if (v.element) lines.push(`element: ${v.element.controlType} "${v.element.name}"`);
  if (v.pid) lines.push(`pid: ${v.pid}`);
  if (v.error) lines.push(`error: ${v.error}`);
  return lines.join("\n");
}

export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      pid: { type: "number", description: "Process id of the window to capture. Defaults to the foreground window." },
      outDir: { type: "string", description: "Output directory under WSL (default ~/.dsh/shots)." },
      name: { type: "string", description: "File basename without extension." },
      expectName: { type: "string", description: "Crop to the element with this exact name instead of the whole window. Use uia_tree to see what is there." },
      expectType: { type: "string", description: "Narrow the expectName match by control type, e.g. Button." },
      x: { type: "number", description: "Crop: window-relative left edge." },
      y: { type: "number", description: "Crop: window-relative top edge." },
      width: { type: "number", description: "Crop: width in pixels." },
      height: { type: "number", description: "Crop: height in pixels." },
    },
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/shot-exec.js:117-148](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L117-L148)

产物复制和返回。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(args, config = {}) {
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const pid = safeInt(args?.pid);
  const outDir = typeof args?.outDir === "string" && args.outDir.trim()
    ? args.outDir.trim() : join(homedir(), ".dsh", "shots");
  mkdirSync(outDir, { recursive: true });
  const base = sanitizeName(args?.name, `window-${Date.now()}`);
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-winshot-${Date.now()}.png`;

  const expectName = typeof args?.expectName === "string" ? args.expectName : "";
  const expectType = typeof args?.expectType === "string" ? args.expectType : "";
  // An element crop and a coordinate crop are two ways of asking for the same
  // thing; naming an element wins, because it is the one that survives the
  // window being moved or resized.
  const crop = expectName ? null : normalizeCrop(args, { width: 0, height: 0 });

  const { stdout } = await runPowerShell(captureScript(pid, winTemp, { expectName, expectType, crop }), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: raw.error };

  const wslPath = winTemp.replace(/^C:\\\\Users\\\\Public\\\\/, "/mnt/c/Users/Public/").replace(/\\\\/g, "/");
  if (!existsSync(wslPath)) return { ok: false, error: `capture not found at ${wslPath}` };
  const dest = join(outDir, `${base}.png`);
  copyFileSync(wslPath, dest);
  try { unlinkSync(wslPath); } catch {}
  return {
    ok: true, path: dest, bytes: statSync(dest).size,
    width: safeInt(raw.width), height: safeInt(raw.height),
    pid: safeInt(raw.pid), x: safeInt(raw.x), y: safeInt(raw.y),
    crop: raw.crop, windowWidth: safeInt(raw.windowWidth), windowHeight: safeInt(raw.windowHeight),
    element: raw.element ?? null,
  };
```

</details>

#### 缺口

- 未对照真实截图任务与手工路径
  **影响**：节时与成功率未知
  **进一步探讨**：对同一无敏感应用比较窗口和元素截图

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标选中后图像是否只含该窗口内容？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

正 PID 取第一个带窗口句柄的顶层元素，省略时读当前前台。元素裁剪选择匹配名称和可选类型的首个后代，受访问数量和深度限制。脚本可能还原最小化窗口，然后以屏幕坐标 CopyFromScreen，捕获的是该矩形内的可见像素，遮挡窗口可进入截图。图片先写 Windows Public，再复制到调用方给的 outDir，目录没有此处根路径限制，copy 后尽力删临时文件，失败可残留。运行效果因此涉及 UI 状态与本地文件，不能视为纯读取。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot-exec.js:36-69](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L36-L69)

名称裁剪和搜索限制。

<details>
<summary>查看原文（34行）</summary>

```text
export function captureScript(pid, outPath, opts = {}) {
  const { expectName = "", expectType = "", crop = null } = opts;
  const elemBlock = expectName
    ? `
# Crop to a named element. Name, not index: an index is a position in a picture
# that has already moved, and two walks of a live window disagree about it.
$walker = [System.Windows.Automation.TreeWalker]::ControlViewWalker
$match = $null
$queue = New-Object System.Collections.Queue
$queue.Enqueue(@{ el = $el; d = 0 })
$seen = 0
while ($queue.Count -gt 0 -and $seen -lt 2000 -and $null -eq $match) {
  $item = $queue.Dequeue(); $e = $item.el; $d = $item.d
  $seen++
  if ($d -gt 0) {
    try {
      $ct = $e.Current.ControlType.ProgrammaticName.Replace('ControlType.','')
      $typeOk = ${expectType ? `($ct -eq ${psq(expectType)})` : "$true"}
      if ($typeOk -and $e.Current.Name -eq ${psq(expectName)}) { $match = $e; break }
    } catch {}
  }
  if ($d -lt 10) {
    $c = $walker.GetFirstChild($e)
    while ($c) { $queue.Enqueue(@{ el = $c; d = $d + 1 }); $c = $walker.GetNextSibling($c) }
  }
}
if ($null -eq $match) { ConvertTo-Json -Compress @{ error = ${psq("no element matched")} }; exit }
$er = $match.Current.BoundingRectangle
if ([double]::IsNaN($er.Width) -or [double]::IsInfinity($er.Width) -or $er.Width -le 0) {
  ConvertTo-Json -Compress @{ error = 'the matched element has no drawable area' }; exit
}
$cx = (Dsh-I $er.X) - $r.L; $cy = (Dsh-I $er.Y) - $r.T
$cw = Dsh-I $er.Width; $ch = Dsh-I $er.Height
$matched = @{ controlType = $match.Current.ControlType.ProgrammaticName.Replace('ControlType.',''); name = $match.Current.Name }
```

</details>

**依据 2 · 源码核查**：[lib/shot-exec.js:79-105](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L79-L105)

目标选择、窗口还原和屏幕抓取。

<details>
<summary>查看原文（27行）</summary>

```text
  return `${PRELUDE}
$h = [IntPtr]::Zero
if (${pid} -gt 0) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, ${pid})
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) { if ($w.Current.NativeWindowHandle -ne 0) { $h = [IntPtr]$w.Current.NativeWindowHandle; $el = $w; break } }
} else {
  $h = [DshShot]::GetForegroundWindow()
  $el = [System.Windows.Automation.AutomationElement]::FromHandle($h)
}
if ($h -eq [IntPtr]::Zero) { ConvertTo-Json -Compress @{ error = 'no window for that pid' }; exit }
# A minimized window has no drawable area; restore it before measuring.
if ([DshShot]::IsIconic($h)) { [void][DshShot]::ShowWindow($h, 9) ; Start-Sleep -Milliseconds 250 }
$r = New-Object DshShot+RECT
if (-not [DshShot]::GetWindowRect($h, [ref]$r)) { ConvertTo-Json -Compress @{ error = 'GetWindowRect failed' }; exit }
$w = $r.R - $r.L; $ht = $r.B - $r.T
if ($w -le 0 -or $ht -le 0) { ConvertTo-Json -Compress @{ error = 'window has no drawable area'; width=$w; height=$ht }; exit }
${elemBlock}
if ($cx -lt 0) { $cw += $cx; $cx = 0 }
if ($cy -lt 0) { $ch += $cy; $cy = 0 }
if ($cx + $cw -gt $w) { $cw = $w - $cx }
if ($cy + $ch -gt $ht) { $ch = $ht - $cy }
if ($cw -le 0 -or $ch -le 0) { ConvertTo-Json -Compress @{ error = 'the crop falls outside the window'; x=$cx; y=$cy; width=$cw; height=$ch }; exit }
$bmp = New-Object System.Drawing.Bitmap $cw, $ch
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen(($r.L + $cx), ($r.T + $cy), 0, 0, $bmp.Size)
$bmp.Save(${psq(outPath)}, [System.Drawing.Imaging.ImageFormat]::Png)
```

</details>

**依据 3 · 源码核查**：[lib/shot-exec.js:117-141](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L117-L141)

输出路径与临时文件。

<details>
<summary>查看原文（25行）</summary>

```text
export async function execute(args, config = {}) {
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const pid = safeInt(args?.pid);
  const outDir = typeof args?.outDir === "string" && args.outDir.trim()
    ? args.outDir.trim() : join(homedir(), ".dsh", "shots");
  mkdirSync(outDir, { recursive: true });
  const base = sanitizeName(args?.name, `window-${Date.now()}`);
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-winshot-${Date.now()}.png`;

  const expectName = typeof args?.expectName === "string" ? args.expectName : "";
  const expectType = typeof args?.expectType === "string" ? args.expectType : "";
  // An element crop and a coordinate crop are two ways of asking for the same
  // thing; naming an element wins, because it is the one that survives the
  // window being moved or resized.
  const crop = expectName ? null : normalizeCrop(args, { width: 0, height: 0 });

  const { stdout } = await runPowerShell(captureScript(pid, winTemp, { expectName, expectType, crop }), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: raw.error };

  const wslPath = winTemp.replace(/^C:\\\\Users\\\\Public\\\\/, "/mnt/c/Users/Public/").replace(/\\\\/g, "/");
  if (!existsSync(wslPath)) return { ok: false, error: `capture not found at ${wslPath}` };
  const dest = join(outDir, `${base}.png`);
  copyFileSync(wslPath, dest);
  try { unlinkSync(wslPath); } catch {}
```

</details>

#### 缺口

- 未测真实窗口遮挡、DPI 与文件错误
  **影响**：无法保证截图只含目标像素或无残留
  **进一步探讨**：用两个可弃用窗口检查遮挡、最小化、重复标题和输出失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验收并降低截错窗口的代价？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在支持 interop 的测试会话只打开无敏感内容的窗口，指定 PID 和隔离输出目录，检查 PNG 与屏幕，再检查 Windows 临时文件。结果不符即停用并回原生截图。可试验将待截图窗口身份回显并在截取前复核，遇到前台变化和遮挡条件拒绝采集。与现有实现对照多窗口和 DPI 样例的错捕率、遗漏和额外延迟，若没有降低错捕或误拒绝过多则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-33](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/index.js#L25-L33)

WSL 门槛及错误。

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
```

**依据 2 · 源码核查**：[lib/shot-exec.js:79-105](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L79-L105)

目标及截图方式。

<details>
<summary>查看原文（27行）</summary>

```text
  return `${PRELUDE}
$h = [IntPtr]::Zero
if (${pid} -gt 0) {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ProcessIdProperty, ${pid})
  $wins = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($w in $wins) { if ($w.Current.NativeWindowHandle -ne 0) { $h = [IntPtr]$w.Current.NativeWindowHandle; $el = $w; break } }
} else {
  $h = [DshShot]::GetForegroundWindow()
  $el = [System.Windows.Automation.AutomationElement]::FromHandle($h)
}
if ($h -eq [IntPtr]::Zero) { ConvertTo-Json -Compress @{ error = 'no window for that pid' }; exit }
# A minimized window has no drawable area; restore it before measuring.
if ([DshShot]::IsIconic($h)) { [void][DshShot]::ShowWindow($h, 9) ; Start-Sleep -Milliseconds 250 }
$r = New-Object DshShot+RECT
if (-not [DshShot]::GetWindowRect($h, [ref]$r)) { ConvertTo-Json -Compress @{ error = 'GetWindowRect failed' }; exit }
$w = $r.R - $r.L; $ht = $r.B - $r.T
if ($w -le 0 -or $ht -le 0) { ConvertTo-Json -Compress @{ error = 'window has no drawable area'; width=$w; height=$ht }; exit }
${elemBlock}
if ($cx -lt 0) { $cw += $cx; $cx = 0 }
if ($cy -lt 0) { $ch += $cy; $cy = 0 }
if ($cx + $cw -gt $w) { $cw = $w - $cx }
if ($cy + $ch -gt $ht) { $ch = $ht - $cy }
if ($cw -le 0 -or $ch -le 0) { ConvertTo-Json -Compress @{ error = 'the crop falls outside the window'; x=$cx; y=$cy; width=$cw; height=$ch }; exit }
$bmp = New-Object System.Drawing.Bitmap $cw, $ch
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen(($r.L + $cx), ($r.T + $cy), 0, 0, $bmp.Size)
$bmp.Save(${psq(outPath)}, [System.Drawing.Imaging.ImageFormat]::Png)
```

</details>

**依据 3 · 源码核查**：[lib/shot-exec.js:117-148](https://github.com/173787247/dsh-wsl-winshot/blob/332f9f5791f5fa267c0760c7f44405d22e29a82c/lib/shot-exec.js#L117-L148)

文件副作用和结果。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(args, config = {}) {
  const timeoutMs = Math.min(120_000, Math.max(1000, Number(config.timeoutMs) || 30_000));
  const pid = safeInt(args?.pid);
  const outDir = typeof args?.outDir === "string" && args.outDir.trim()
    ? args.outDir.trim() : join(homedir(), ".dsh", "shots");
  mkdirSync(outDir, { recursive: true });
  const base = sanitizeName(args?.name, `window-${Date.now()}`);
  const winTemp = `C:\\\\Users\\\\Public\\\\dsh-winshot-${Date.now()}.png`;

  const expectName = typeof args?.expectName === "string" ? args.expectName : "";
  const expectType = typeof args?.expectType === "string" ? args.expectType : "";
  // An element crop and a coordinate crop are two ways of asking for the same
  // thing; naming an element wins, because it is the one that survives the
  // window being moved or resized.
  const crop = expectName ? null : normalizeCrop(args, { width: 0, height: 0 });

  const { stdout } = await runPowerShell(captureScript(pid, winTemp, { expectName, expectType, crop }), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: raw.error };

  const wslPath = winTemp.replace(/^C:\\\\Users\\\\Public\\\\/, "/mnt/c/Users/Public/").replace(/\\\\/g, "/");
  if (!existsSync(wslPath)) return { ok: false, error: `capture not found at ${wslPath}` };
  const dest = join(outDir, `${base}.png`);
  copyFileSync(wslPath, dest);
  try { unlinkSync(wslPath); } catch {}
  return {
    ok: true, path: dest, bytes: statSync(dest).size,
    width: safeInt(raw.width), height: safeInt(raw.height),
    pid: safeInt(raw.pid), x: safeInt(raw.x), y: safeInt(raw.y),
    crop: raw.crop, windowWidth: safeInt(raw.windowWidth), windowHeight: safeInt(raw.windowHeight),
    element: raw.element ?? null,
  };
```

</details>

#### 缺口

- 无真实桌面与隐私边界试验
  **影响**：不知多窗口正确率或故障恢复成本
  **进一步探讨**：在隔离桌面演练遮挡、权限、临时残留和命名碰撞

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
