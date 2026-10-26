# dsh-wsl-winshot

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e7963e2](https://github.com/173787247/dsh-wsl-winshot/tree/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winshot)
<!-- END META -->

> **实现功能**：从 WSL 调 PowerShell 截取 Windows 前台或指定 PID 窗口到本地 PNG 的工具。

> **核心亮点**：把 Windows 指定窗口画面转为 WSL PNG，支持元素名/坐标裁剪。详见[Q01](#research-q01)。

> **风险与缺陷**：CopyFromScreen 捕获屏幕可见像素并恢复最小化窗口；临时图位于 Public 且异常未保证清理，Agent 输出仅是文本路径。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 窗口截图工具能在 WSL 做什么？](#detail-section-11)
  - [Q02 · 截图与裁剪实际捕获的是哪个画面？](#detail-section-12)
  - [Q03 · 输出文件与临时文件的生命周期安全吗？](#detail-section-13)
  - [Q04 · 输出给 Agent 的内容能支持视觉理解吗？](#detail-section-14)
  - [Q05 · 怎样安全试用并验证截图正确？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可见 Windows 桌面窗口的取图辅助；非无头或完整窗口内容保证。详见[Q01](#research-q01)。

Windows 原生截图/录屏或手工截图能人工确定目标；插件跨 WSL 自动化方便但可见性边界需验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 窗口截图 | 桌面取图 | CopyFromScreen 受遮挡 |
| 裁剪 | 聚焦 UI 元素 | 首个匹配/最多2000节点 |
| 输出 | 存 PNG | Public 临时/纯文本路径 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| WSL/Windows 桌面 | 必需 | 目标窗口 | 无截图 |
| PowerShell/System.Drawing/UIA | 必需 | 查窗/捕获 | 执行失败 |
| /mnt/c/Users/Public | 当前实现必需 | 临时 PNG 传递 | 找不到文件 |
| 图像读取工具 | 视觉问答需要 | Agent 看图 | 仅获路径 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 准备 | 选前台/PID 与私有 outDir | 路径受控 |
| 截图 | 操作窗口/元素 | 返回 PNG 路径 |
| 复核 | 打开图与目标对照 | 无遮挡误图 |
| 清理 | 检 Public 和输出 | 敏感图不残留 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 安装到 WSL/确认 PowerShell、UIA、/mnt/c 映射与输出目录 | 使用已有 Windows/WSL；软件授权或额外现金费用未见，未知 | 配权限、选私有目录并检查 Agent 图片读取链，工时未知 | 环境不匹配需调整路径或停用 |
| 持续 | 每次启动 PowerShell、遍历最多 2000 UIA 节点、截图/复制 PNG | CPU/内存/双侧磁盘；每次现金/资源量未知 | 目视核目标窗口、遮挡和隐私，工时未知 | 文件大小、调用频率与识图 token 未测 |
| 失败恢复 | 查 Public 临时残留、错图/重名覆盖、还原桌面状态 | 重拍/存储和潜在敏感信息暴露损失未知 | 删除敏感临时图、恢复备份/重拍、核权限，工时未知 | 异常分支不保证清理，残留频率未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 窗口截图 | PID/前台可见像素 | 遮挡无关 |
| 裁剪 | UIA/坐标 | DPI 准确性 |
| Agent 图像 | 文件路径 | 自动视觉可见 |

> **思考**：CopyFromScreen 捕获屏幕可见像素并恢复最小化窗口；临时图位于 Public 且异常未保证清理，Agent 输出仅是文本路径。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 指定窗口画面转为 WSL PNG，支持元素名/坐标裁剪。详见[Q01](#research-q01)。

把 Windows 指定窗口画面转为 WSL PNG，支持元素名/坐标裁剪。详见[Q01](#research-q01)。

UIA 裁剪和字符串转义有局部参考；目标选择、临时隐私与呈现需改进。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

CopyFromScreen 捕获屏幕可见像素并恢复最小化窗口；临时图位于 Public 且异常未保证清理，Agent 输出仅是文本路径。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在隔离桌面试用，指定私有输出目录并手工核 PNG/残留；敏感窗口需额外授权。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持截图/裁剪；README 句柄选择未实现，遮挡画面/最小化副作用、临时文件残留与纯文本渲染需实测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/shot.js、lib/shot-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/shot.js、lib/shot-exec.js、lib/wsl-host.js、包声明；未调用 Windows/WSL。旧 META 仅复用。
- 下一步：目标 WSL 桌面测 PID 多窗口、遮挡/最小化、DPI、重名覆盖、异常 Public 清理与 Agent 图像可见性。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winshot](https://github.com/173787247/dsh-wsl-winshot)
- **版本号**：0.1.0（[固定提交 e7963e2](https://github.com/173787247/dsh-wsl-winshot/tree/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为句柄选择、遮挡无关捕获、finally 清理与私有目录/受控图片展示。详见[Q05](#research-q05)。

目标 WSL 桌面测 PID 多窗口、遮挡/最小化、DPI、重名覆盖、异常 Public 清理与 Agent 图像可见性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 119 | — | — | 472 |
| .js | source | 4 | 319 | 273 | 18 | — |
| .js | test | 2 | 118 | 105 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-winshot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 的窗口截图在选择目标、可见画面、敏感文件与 Agent 可见性上是否可靠？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 窗口截图工具能在 WSL 做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

win_shot_window 在 WSL 调 Windows PowerShell，对前台窗口或指定 PID 的第一个 UIAutomation 顶层窗口截图，复制 PNG 到 WSL 文件，可按 UI 元素名称/类型或窗口相对坐标裁剪。作者简介写“PID 或窗口句柄”，但工具参数及脚本没有 handle 路径；属于代码/文档不一致。适合可见桌面窗口的取证辅助，不是无头截图或跨会话屏幕抓取。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-5](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/README.zh.md#L1-L5)

作者 PID/句柄主张

```text
# dsh-wsl-winshot

> 把指定的 Windows 窗口截图存入 WSL 文件，可按进程号或窗口句柄指定。

DeepSeek Harness 插件：Capture a specific Windows window to a WSL file, by process id or window handle.
```

**依据 2 · 源码核查**：[lib/shot.js:53-69](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js#L53-L69)

参数无 handle

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/shot-exec.js:79-89](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L79-L89)

PID/前台选择

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/index.js#L17-L37)

工具注册/WSL 限制

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_shot_window",
    description: "Capture a specific Windows window to a WSL file, by process id or the foreground window.",
    parameters: shot.parameters(),
    output: {
      schema: shot.outputSchema(),
      render: (_args, value) => [{ type: "text", text: shot.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_shot_window" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_shot_window", content: result?.content }),
  });
```

</details>

#### 缺口

- 目标多显示器/DPI/远程桌面未测
  **影响**：不能按窗口句柄精确选择，PID 多窗口选择不确定
  **进一步探讨**：目标 Windows 多窗口对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 截图与裁剪实际捕获的是哪个画面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

PowerShell 先 GetWindowRect，若最小化则 ShowWindow(...,9) 恢复，再用 Graphics.CopyFromScreen 按窗口屏幕坐标复制像素并存 PNG。按元素名时遍历 UIAutomation 控件树至2000节点、深度10，命中首个同名/类型元素后用 BoundingRectangle 裁剪；坐标裁剪会钳到窗口边界。CopyFromScreen 取得当时屏幕可见区域，其他窗口遮挡、窗口超出屏幕或缩放可导致图片不是该窗口完整内容；恢复最小化还改变用户桌面状态，代码未还原。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot-exec.js:38-75](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L38-L75)

UIA/坐标选择

<details>
<summary>查看原文（38行）</summary>

```text
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
`
    : crop
      ? `$cx = ${crop.x}; $cy = ${crop.y}; $cw = ${crop.width}; $ch = ${crop.height}
$matched = $null
`
      : `$cx = 0; $cy = 0; $cw = $w; $ch = $ht
```

</details>

**依据 2 · 源码核查**：[lib/shot-exec.js:79-113](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L79-L113)

恢复/裁剪/CopyFromScreen

<details>
<summary>查看原文（35行）</summary>

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
$g.Dispose(); $bmp.Dispose()
ConvertTo-Json -Compress -Depth 4 @{
  path = ${psq(outPath)}; width = $cw; height = $ch; pid = ${pid}
  x = ($r.L + $cx); y = ($r.T + $cy)
  crop = @{ x = $cx; y = $cy; width = $cw; height = $ch }
  windowWidth = $w; windowHeight = $ht
  element = $matched
}
```

</details>

**依据 3 · 源码核查**：[lib/shot.js:17-35](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js#L17-L35)

裁剪规则

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * A crop is expressed relative to the window, so the caller does not have to
 * know where the window sits on screen. Out-of-window values are clamped to the
 * window rather than refused: asking for "the right half" of a window whose
 * width you misjudged should give you the right edge, not an error.
 */
export function normalizeCrop(crop, bounds) {
  if (!crop || typeof crop !== "object") return null;
  const w = safeInt(bounds?.width), h = safeInt(bounds?.height);
  let x = safeInt(crop.x), y = safeInt(crop.y);
  let width = safeInt(crop.width), height = safeInt(crop.height);
  if (width < 1 || height < 1) return null;
  if (x < 0) { width += x; x = 0; }
  if (y < 0) { height += y; y = 0; }
  if (w > 0) width = Math.min(width, w - x);
  if (h > 0) height = Math.min(height, h - y);
  if (width < 1 || height < 1) return null;
  return { x, y, width, height };
}
```

</details>

**依据 4 · 作者声明**：[README.zh.md:24-28](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/README.zh.md#L24-L28)

作者最小化处理

```text
## 说明

Use this when you need the **picture**. Use `dsh-wsl-shot` when the image is
already on the clipboard. A minimized window is restored before measuring, because a
minimized window reports an empty rectangle.
```

#### 缺口

- 目标 Windows 截图实际遮挡/DPI 表现未知
  **影响**：可见像素不等于窗口自身画面，可能截到遮挡内容
  **进一步探讨**：目标遮挡/最小化/多屏测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输出文件与临时文件的生命周期安全吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

执行层先 mkdir 用户给定 outDir（不限制在 ~/.dsh/shots），Windows 临时截图固定写 C:/Users/Public/dsh-winshot-时间戳.png，再从 /mnt/c/Users/Public 复制到 outDir/name.png，最后尝试删临时文件。若 PowerShell 错、JSON 解析错、复制失败，清理步骤可能未到达，Public 临时敏感截图残留；同名 name 的目标文件会被 copyFileSync 覆盖。路径与内容均应按敏感屏幕材料处理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shot-exec.js:117-149](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L117-L149)

目录、Public 临时与复制/删除

<details>
<summary>查看原文（33行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/shot.js:37-40](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js#L37-L40)

文件名仅净化

```text
export function sanitizeName(name, fallback) {
  const base = typeof name === "string" && name.trim() ? name.trim() : fallback;
  return base.replace(/[^\w.-]+/g, "_").slice(0, 80);
}
```

**依据 3 · 源码核查**：[lib/shot.js:53-60](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js#L53-L60)

outDir 参数

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      pid: { type: "number", description: "Process id of the window to capture. Defaults to the foreground window." },
      outDir: { type: "string", description: "Output directory under WSL (default ~/.dsh/shots)." },
      name: { type: "string", description: "File basename without extension." },
```

#### 缺口

- 目标 Windows/WSL 文件 ACL 与异常残留未测
  **影响**：敏感截图残留或覆盖已有文件
  **进一步探讨**：隔离桌面注入复制失败、重名和权限场景

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 输出给 Agent 的内容能支持视觉理解吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

tool output.render 的 shot.format 仅给路径、尺寸、裁剪、元素及错误文字，不内嵌 PNG 或 image content；代码返回的也是文件路径/大小等元数据。若 Agent 没有另一个可读该路径的图片工具，就只能知道截图已保存，无法直接看图。README 提到需要“picture”时使用此插件，但实际视觉理解依赖宿主/其他读取工具；本轮未验证 DSH 是否自动把路径显示为图像。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/index.js#L17-L37)

工具渲染为文本

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_shot_window",
    description: "Capture a specific Windows window to a WSL file, by process id or the foreground window.",
    parameters: shot.parameters(),
    output: {
      schema: shot.outputSchema(),
      render: (_args, value) => [{ type: "text", text: shot.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_shot_window" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_shot_window", content: result?.content }),
  });
```

</details>

**依据 2 · 源码核查**：[lib/shot.js:42-50](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js#L42-L50)

格式化只列元数据

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
```

**依据 3 · 源码核查**：[lib/shot-exec.js:137-148](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L137-L148)

返回文件路径

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 4 · 作者声明**：[README.zh.md:24-28](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/README.zh.md#L24-L28)

作者图像用例

```text
## 说明

Use this when you need the **picture**. Use `dsh-wsl-shot` when the image is
already on the clipboard. A minimized window is restored before measuring, because a
minimized window reports an empty rectangle.
```

#### 缺口

- 目标宿主是否自动渲染本地路径未核
  **影响**：仅文件落盘可能不足以完成视觉问答
  **进一步探讨**：目标 Agent 调用后检查实际可见内容

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样安全试用并验证截图正确？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

在本机 WSL/Windows 测指定 PID 单窗口、PID 多窗口、遮挡、最小化与元素裁剪，输出目录先设专用私有路径，并在失败后检查 C:/Users/Public 残留；手工打开 PNG 对照目标窗口与 Agent 可见结果。改进可支持 handle、使用不会受遮挡的窗口捕获方式、finally 清理临时文件及拒绝覆盖/限制输出根，另提供受控图像展示；这些是未实现假设。成本包括 PowerShell/UIA 遍历、磁盘与隐私复核，真实时延未知。 假设推导：固定版用 CopyFromScreen 获取可见像素，最小化会恢复且不还原；Public 临时 PNG 在异常时可能残留，而工具只返回路径。因此只有在任务允许可见桌面操作、且 Agent 能通过受控图片读取链取得图像时，自动截图才相对手工取图有可靠增量。拟将窗口句柄精确选择、遮挡无关捕获和 finally 清理/私有临时目录作为原型，并显式呈现图像；代价是 Windows API 适配、权限、格式转换与额外 token/IO。用同一批前台/PID 多窗口、遮挡、最小化、DPI、复制失败和敏感图样例比较手工截图、固定版、原型，逐张由人工标注目标一致率、残留文件数、桌面状态副作用和 Agent 实际识图成功率。若原型仍截到遮挡、留敏感图、误选窗口，或识图成功率无改善而成本明显上升，就证伪该增量；未实现能力不能算固定版贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-41](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/README.zh.md#L11-L41)

作者安装/依赖/测试

<details>
<summary>查看原文（31行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-winshot
```

## 用法

```
win_shot_window                                        # foreground window
win_shot_window pid=1234 name="build-output"           # a specific process
```

## 说明

Use this when you need the **picture**. Use `dsh-wsl-shot` when the image is
already on the clipboard. A minimized window is restored before measuring, because a
minimized window reports an empty rectangle.

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

**依据 2 · 源码核查**：[lib/shot-exec.js:38-113](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L38-L113)

窗口/裁剪机制

<details>
<summary>查看原文（76行）</summary>

```text
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
`
    : crop
      ? `$cx = ${crop.x}; $cy = ${crop.y}; $cw = ${crop.width}; $ch = ${crop.height}
$matched = $null
`
      : `$cx = 0; $cy = 0; $cw = $w; $ch = $ht
$matched = $null
`;

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
$g.Dispose(); $bmp.Dispose()
ConvertTo-Json -Compress -Depth 4 @{
  path = ${psq(outPath)}; width = $cw; height = $ch; pid = ${pid}
  x = ($r.L + $cx); y = ($r.T + $cy)
  crop = @{ x = $cx; y = $cy; width = $cw; height = $ch }
  windowWidth = $w; windowHeight = $ht
  element = $matched
}
```

</details>

**依据 3 · 源码核查**：[lib/shot-exec.js:117-149](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js#L117-L149)

文件生命周期

<details>
<summary>查看原文（33行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/index.js#L17-L37)

工具呈现

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_shot_window",
    description: "Capture a specific Windows window to a WSL file, by process id or the foreground window.",
    parameters: shot.parameters(),
    output: {
      schema: shot.outputSchema(),
      render: (_args, value) => [{ type: "text", text: shot.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_shot_window" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_shot_window", content: result?.content }),
  });
```

</details>

#### 缺口

- 目标宿主、隐私策略与时延未知
  **影响**：不能直接用于保密桌面自动截图
  **进一步探讨**：隔离 WSL 桌面完成上述矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
