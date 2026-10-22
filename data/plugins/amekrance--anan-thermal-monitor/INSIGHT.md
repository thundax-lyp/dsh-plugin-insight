# anan-thermal-monitor

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[13ed26d](https://github.com/AmeKrance/anan-thermal-monitor/tree/13ed26da20da08eecc300fb9963bea3dd4634205)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor)
<!-- END META -->

> **实现功能**：Windows WPF 温度桌宠，利用 PowerShell 与随包 LibreHardwareMonitor 采集传感器，DSH Host 负责启动/停止。

> **核心亮点**：把硬件传感器以桌面悬浮卡片呈现，并可由 DSH 启停。详见[Q01](#research-q01)。

> **风险与缺陷**：管理员提权与二进制依赖较重；Host 启动立即回 running:true，GUI 卡片承诺缺直接实现，npm files 不含独立启动/自启入口。详见[Q01](#research-q01)至[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 它怎样提供温度桌宠？](#detail-section-11)
  - [Q02 · 启动提权与停止是否可靠？](#detail-section-12)
  - [Q03 · 安装包和自启承诺有什么边界？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望常驻桌面查看 CPU/内存/GPU/NVMe 温度的 Windows 用户。

独立硬件监控软件或 Windows 工具；此插件以桌宠形态展示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 传感器 | 温度提醒 | 管理员/硬件依赖 |
| 启停 | 随 DSH | 状态可能误报 |
| 自启 | 登录时启动 | npm files 未列脚本 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| Windows/PowerShell 5.1 | WPF | 无法运行 |
| 管理员 | CPU/内存传感器 | 部分缺失 |
| LHM DLL/硬件 | 温度采集 | -- 或错误 |

#### 隔离验证

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 包 | 看 npm tarball | 自启入口可知 |
| 启动 | 允许/拒绝 UAC | 状态准确 |
| 停止 | 停插件/卸载 | 无进程/任务残留 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 安装 | Windows/PowerShell/DSH | npm 与源码入口不同 |
| 运行 | 管理员/LHM/CPU | 硬件支持未知 |
| 自启 | 高权限计划任务 | 需显式卸载 |

#### 效果

| 项 | 代码支持 | 未知 |
| --- | --- | --- |
| 温度桌宠 | WPF/LHM | 传感器可用率 |
| DSH 启停 | spawn/flag | 真正子进程状态 |
| 独立自启 | 仓库 vbs/bat | npm 包缺入口 |

> **思考**：管理员提权与二进制依赖较重；Host 启动立即回 running:true，GUI 卡片承诺缺直接实现，npm files 不含独立启动/自启入口。详见[Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把硬件传感器以桌面悬浮卡片呈现，并可由 DSH 启停。详见[Q01](#research-q01)。

把硬件传感器以桌面悬浮卡片呈现，并可由 DSH 启停。详见[Q01](#research-q01)。

Host 和提权后 PowerShell 经共享临时文件协调；无直接浏览器客户端。

<a id="detail-section-5"></a>

### 1.4 主要限制

管理员提权与二进制依赖较重；Host 启动立即回 running:true，GUI 卡片承诺缺直接实现，npm files 不含独立启动/自启入口。详见[Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离 VM 核包内容、二进制来源和 UAC；测试传感器缺失、启动误报、停止/卸载及任务计划残留。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

桌宠采集和 Host 生命周期源码可核；DSH 对话卡片无直接 client 入口，发布包 files 不含独立自启脚本，真实 Windows/硬件效果未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、assets/desktop-pet.ps1、install-autostart.bat 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README、Host、PowerShell、包清单与自启 bat；不运行 Windows 程序或审计 DLL。
- 下一步：Windows VM 实机传感器、UAC、异常/重启/卸载测试；核 npm tarball 和 DLL 来源。

**分析版本**

- **仓库**：[AmeKrance/anan-thermal-monitor](https://github.com/AmeKrance/anan-thermal-monitor)
- **版本号**：1.0.4（[固定提交 13ed26d](https://github.com/AmeKrance/anan-thermal-monitor/tree/13ed26da20da08eecc300fb9963bea3dd4634205)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

核实 PID/数据心跳后再报告运行、明确源码与 npm 安装差异，可减少误导；待 Windows 实测。详见[Q03](#research-q03)。

Windows VM 实机传感器、UAC、异常/重启/卸载测试；核 npm tarball 和 DLL 来源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 97 | 70 | 19 | — |
| .md | source | 1 | 161 | — | — | 1705 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor/issues?q=is%3Aissue+created%3A2026-09-22T06%3A17%3A54.624Z..2026-10-22T06%3A17%3A54.624Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A17%3A54.624Z..2026-10-22T06%3A17%3A54.624Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实 Windows 温度桌宠的硬件采集、权限/生命周期与包内承诺差异。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它怎样提供温度桌宠？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

项目用 PowerShell 5.1/WPF 在 Windows 桌面显示贴边悬浮卡片，后台通过随包 LibreHardwareMonitor DLL 读取 CPU、内存、GPU、NVMe 温度，WMI/系统 API 取硬件信息。DSH Host apply 启动 powershell.exe 执行脚本并在 TEMP 目录读 JSON 数据/写停止旗标；脚本还可独立运行。这个方案让温度常驻桌面，不需要持续打开监控窗口，但实际传感器覆盖和视觉效果因设备不同未验。README 称 DSH 对话流有实时温度卡片/启停按钮；仓库没有浏览器 client 入口，Host 只有在全局 harness.handle 存在时注册四个 RPC，静态包缺失则跳过，因此该 GUI 承诺缺直接代码支持。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-25](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/README.md#L1-L25)

作者描述 WPF 桌宠与四类温度。

<details>
<summary>查看原文（25行）</summary>

```text
# 安安热能监控 · 桌面萌宠温度监控（DSH 插件包）

一个悬浮在 Windows 桌面上的紫白主题萌宠卡片，实时监控 **CPU / 内存 / GPU / NVMe 固态** 四项温度，并展示笔记本型号与硬件信息。这是一个标准的 **DeepSeek Harness (DSH) 插件包**，可通过 `dsh plugin --profile <name> add <包名>` 一条命令安装；也支持脱离 harness 独立运行。基于 PowerShell 5.1 + WPF 原生实现，无第三方桌面组件依赖。

---

## ✨ 功能总览

- **边缘停靠悬浮窗（360 悬浮球风格）**：透明、无边框、置顶的紫白渐变卡片（207×320）；平时贴边半藏露出 16px 边框（四边均可），鼠标靠近边缘自动滑出，移开鼠标 2 秒自动收回
- **手动拖动 + 松手吸附**：滑出后可自由拖动到屏幕任意位置，松手自动吸附最近的屏幕边缘（右/左/上/下，400px 内）；甩出屏幕自动弹回；拖动不会覆盖任务栏，底部停靠时自动藏到任务栏后
- **实时温度监控**：CPU / 内存 / GPU / NVMe 四项温度，每 2 秒刷新，数值按温度分级变色（紫 <65°C，橙 65–79°C，红 ≥80°C）
- **页面自动轮换**：下方区域每 5 秒在「温度信息页」与「硬件信息页」之间切换，鼠标悬停时暂停轮换并固定显示温度
- **硬件信息展示**：笔记本型号、CPU/显卡/内存摘要、屏幕分辨率、硬盘总容量、电池状态（电量 + 充电/电源/使用中）
- **自定义素材**：`assets/素材1号.jpg` 作为萌宠形象，等比缩放填充图片区
- **自动提权**：读取 CPU/内存温度需要管理员权限，启动时自动弹出 UAC 确认；启动后无控制台窗口残留
- **优雅退出**：右键菜单退出；作为插件运行时，插件停止会通过停止信号文件让桌宠自动关闭并清理

---

## 📸 演示

![桌宠截图 1](https://raw.githubusercontent.com/AmeKrance/anan-thermal-monitor/main/assets/screenshots/screenshot-1.png)

![桌宠截图 2](https://raw.githubusercontent.com/AmeKrance/anan-thermal-monitor/main/assets/screenshots/screenshot-2.png)

```

</details>

**依据 2 · 源码核查**：[lib/index.js:25-72](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/lib/index.js#L25-L72)

Host spawn、临时文件与停止旗标。

<details>
<summary>查看原文（48行）</summary>

```text

export const apply = (ctx) => {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  } catch { /* 忽略 */ }

  const PID_FILE = path.join(TEMP_DIR, 'desktop-pet.pid')
  const DATA_FILE = path.join(TEMP_DIR, 'desktop-pet-data.json')
  const STOP_FILE = path.join(TEMP_DIR, 'desktop-pet-stop.flag')

  let proc = null

  const startPet = () => {
    if (proc && proc.exitCode === null) return { running: true, pid: proc.pid }
    try {
      proc = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', PET_SCRIPT], {
        cwd: PKG_ROOT,
        stdio: 'ignore',
        windowsHide: true,
      })
      const h = proc
      h.once('error', () => { if (proc === h) proc = null })
      h.once('exit', () => { if (proc === h) proc = null })
      return { running: true, pid: h.pid }
    } catch (e) {
      return { running: false, error: String((e && e.message) || e) }
    }
  }

  const stopPet = () => {
    if (proc) {
      try { proc.kill() } catch { /* 已退出 */ }
      proc = null
    }
    // 停止信号：提权的桌宠进程轮询到该文件后优雅退出
    // （非提权进程无法强杀管理员桌宠，必须用信号文件）
    try {
      fs.writeFileSync(STOP_FILE, 'stop')
    } catch { /* 忽略 */ }
    return { stopped: true }
  }

  ctx.effect(() => {
    const r = startPet()
    if (!r.running) console.error(`[anan-thermal-monitor] 桌宠启动失败: ${JSON.stringify(r)}`)
    return () => stopPet()
  })

```

</details>

**依据 3 · 源码核查**：[lib/index.js:79-97](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/lib/index.js#L79-L97)

仅可选 harness.handle 注册 RPC，无 client。

<details>
<summary>查看原文（19行）</summary>

```text
    try {
      const n = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10)
      return Number.isFinite(n) && n > 0 ? n : null
    } catch { return null }
  }

  // 若宿主环境提供 harness（动态插件式 RPC），注册状态查询；
  // 静态包环境下缺失则跳过（桌宠本身是完整功能）。
  const h = (typeof harness !== 'undefined') ? harness : undefined
  if (h && typeof h.handle === 'function') {
    h.handle('pet-status', async () => {
      const pid = readPid()
      return { running: !!proc || !!pid, pid: proc ? proc.pid : pid }
    })
    h.handle('pet-temps', async () => readJson())
    h.handle('pet-stop', async () => stopPet())
    h.handle('pet-start', async () => startPet())
  }
}
```

</details>

**依据 4 · 源码核查**：[assets/desktop-pet.ps1:80-148](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/assets/desktop-pet.ps1#L80-L148)

LHM 初始化和传感器数据写出。

<details>
<summary>查看原文（69行）</summary>

```text
Add-Type -Name ZOrd -Namespace Zz -MemberDefinition @'
[DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
'@

# ---------- 后台传感器采集(runspace) ----------
$sensorScript = {
  param($st)
  try {
    [Reflection.Assembly]::LoadFrom($st.lhmDll) | Out-Null
  } catch {
    $st.err = "LHM加载失败: " + $_.Exception.Message
    try { [System.IO.File]::WriteAllText($st.errFile, ("LHM加载失败: " + $_.Exception.Message + "`r`n"), [System.Text.Encoding]::UTF8) } catch {}
    return
  }
  $computer = [LibreHardwareMonitor.Hardware.Computer]::new()
  $computer.IsCpuEnabled = $true
  $computer.IsGpuEnabled = $true
  $computer.IsMotherboardEnabled = $true
  $computer.IsControllerEnabled = $true
  $computer.IsStorageEnabled = $true
  $computer.IsMemoryEnabled = $true
  try { $computer.Open() } catch { $st.err = "Open失败: " + $_.Exception.Message; try { [System.IO.File]::WriteAllText($st.errFile, ("Open失败: " + $_.Exception.Message + "`r`n"), [System.Text.Encoding]::UTF8) } catch {}; return }
  try { [System.IO.File]::AppendAllText($st.errFile, ("采集线程已启动 " + (Get-Date -Format 'HH:mm:ss') + "`r`n"), [System.Text.Encoding]::UTF8) } catch {}
  Start-Sleep -Seconds 2
  while ($st.running) {
    try {
      foreach ($hu in $computer.Hardware) {
        try { $hu.Update() } catch {}
        foreach ($shu in $hu.SubHardware) { try { $shu.Update() } catch {} }
      }
      $cpu = $null; $gpu = $null; $mem = $null; $nvme = $null
      foreach ($h in $computer.Hardware) {
        $type = [string]$h.HardwareType
        $sensors = @($h.Sensors)
        foreach ($sh in $h.SubHardware) { $sensors += @($sh.Sensors) }
        if ($type -eq 'Cpu') {
          $t = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Name -eq 'CPU Package' } | Select-Object -First 1
          if (-not $t) { $t = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Name -eq 'Core Max' } | Select-Object -First 1 }
          if (-not $t) { $t = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Value } | Sort-Object Value -Descending | Select-Object -First 1 }
          if ($t -and $null -ne $t.Value) { $cpu = [double]$t.Value }
        } elseif ($type -like 'Gpu*') {
          $t = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Name -eq 'GPU Core' } | Select-Object -First 1
          if (-not $t) { $t = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Value } | Select-Object -First 1 }
          if ($t -and $null -ne $t.Value) { $gpu = [double]$t.Value }
        } elseif ($type -eq 'Memory') {
          # 内存温度: 优先 DIMM 传感器, 取所有 DIMM 最大值
          $ts = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Name -match 'DIMM' -and $_.Value }
          if (-not $ts) { $ts = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Value } }
          foreach ($t in $ts) {
            $v = [double]$t.Value
            if ($null -eq $mem -or $v -gt $mem) { $mem = $v }
          }
        } elseif ($type -eq 'Storage') {
          # NVMe 固态温度: 优先 Composite Temperature, 多块盘取最大值
          $ts = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Name -match 'Composite' -and $_.Value }
          if (-not $ts) { $ts = $sensors | Where-Object { [string]$_.SensorType -eq 'Temperature' -and $_.Value } | Select-Object -First 1 }
          foreach ($t in $ts) {
            $v = [double]$t.Value
            if ($null -eq $nvme -or $v -gt $nvme) { $nvme = $v }
          }
        }
      }
      $st.cpu = $cpu; $st.gpu = $gpu; $st.mem = $mem; $st.nvme = $nvme
      $st.ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
      try {
        $json = @{ cpu = $cpu; mem = $mem; gpu = $gpu; nvme = $nvme; ts = $st.ts } | ConvertTo-Json -Compress
        [System.IO.File]::WriteAllText($st.dataFile, $json)
      } catch {}
```

</details>

#### 缺口

- 未在 Windows/DSH 运行，未查实际硬件传感器。
  **影响：**可用温度项、桌面交互和所谓对话卡片未证实。
  **进一步探讨：**在隔离 Windows 设备检查桌宠、温度准确度及 DSH UI 是否有入口。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动提权与停止是否可靠？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host 启动 PowerShell 时带 ExecutionPolicy Bypass；脚本在非管理员时用 Start-Process -Verb RunAs 自提权。提权后 Host 原始 child 可先退出，真正桌宠是另一个进程，Host 通过共享 TEMP 的 PID/data/stop.flag 协调。stopPet 会尝试 kill 当前 child、写 stop.flag，脚本 UI 定时器轮询 flag 后清理。startPet 在 spawn 返回后立刻声明 running:true，异步 error/exit 才清 proc；UAC 拒绝、PowerShell 不存在或 LHM 加载失败时接口可能短暂误报运行，实际错误日志需检查。自动启动脚本可注册最高权限登录任务，扩大常驻与权限范围，不能在本轮运行或预设同意。

自提权 catch 注释称拒绝 UAC 后继续降权运行，但 catch 后无条件 exit，实际该分支会退出；不能把注释当可靠降权回退。PID 文件只查同 PID 进程是否存在，没有校验启动时间或可执行身份，旧 PID 复用也可误判已有实例。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:36-68](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/lib/index.js#L36-L68)

异步 spawn、先返回 running:true、停止旗标。

<details>
<summary>查看原文（33行）</summary>

```text

  const startPet = () => {
    if (proc && proc.exitCode === null) return { running: true, pid: proc.pid }
    try {
      proc = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', PET_SCRIPT], {
        cwd: PKG_ROOT,
        stdio: 'ignore',
        windowsHide: true,
      })
      const h = proc
      h.once('error', () => { if (proc === h) proc = null })
      h.once('exit', () => { if (proc === h) proc = null })
      return { running: true, pid: h.pid }
    } catch (e) {
      return { running: false, error: String((e && e.message) || e) }
    }
  }

  const stopPet = () => {
    if (proc) {
      try { proc.kill() } catch { /* 已退出 */ }
      proc = null
    }
    // 停止信号：提权的桌宠进程轮询到该文件后优雅退出
    // （非提权进程无法强杀管理员桌宠，必须用信号文件）
    try {
      fs.writeFileSync(STOP_FILE, 'stop')
    } catch { /* 忽略 */ }
    return { stopped: true }
  }

  ctx.effect(() => {
    const r = startPet()
```

</details>

**依据 2 · 源码核查**：[assets/desktop-pet.ps1:21-61](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/assets/desktop-pet.ps1#L21-L61)

幂等 PID 与 RunAs 提权。

<details>
<summary>查看原文（41行）</summary>

```text
# ---------- 幂等: 已有一个实例则退出(放在提权前, 避免重复实例弹两次 UAC) ----------
if (Test-Path $pidFile) {
  $oldPid = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($oldPid) {
    $oldProc = Get-Process -Id ([int]$oldPid) -ErrorAction SilentlyContinue
    if ($oldProc) { exit }
  }
}

# ---------- 确认要启动后才清理上次的停止信号(避免覆盖插件正在发送的停止指令) ----------
Remove-Item -Path $stopFile -Force -ErrorAction SilentlyContinue

# ---------- 自提权(读取 CPU 温度/内存温度需要管理员) ----------
# 调试开关: $env:PET_NO_ELEVATE=1 时跳过提权(便于非管理员调试 UI)
if ($env:PET_NO_ELEVATE -ne '1') {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    try {
      Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File', "`"$PSCommandPath`"")
    } catch {
      # 用户拒绝提权: 仍以降权模式运行(GPU/NVMe温度可用)
    }
    exit
  }
}

# ---------- 隐藏控制台窗口(桌宠是纯 GUI, 不需要挂着 PowerShell 控制台) ----------
try {
  Add-Type -Name K -Namespace N -MemberDefinition '[DllImport("kernel32.dll")] public static extern bool FreeConsole();' -ErrorAction Stop
  $null = [N.K]::FreeConsole()
} catch {
  # FreeConsole 失败时退回: 隐藏控制台窗口
  try {
    Add-Type -Name U -Namespace N2 -MemberDefinition '[DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow(); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);' -ErrorAction Stop
    $hw = [N2.U]::GetConsoleWindow()
    if ($hw -ne [IntPtr]::Zero) { $null = [N2.U]::ShowWindow($hw, 0) }
  } catch {}
}

Set-Content -Path $pidFile -Value ([string]$PID) -Encoding ASCII

```

</details>

**依据 3 · 源码核查**：[assets/desktop-pet.ps1:465-482](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/assets/desktop-pet.ps1#L465-L482)

脚本轮询停止旗标并清理。

<details>
<summary>查看原文（18行）</summary>

```text
      Toggle-Page
    }
  }
  # 停止信号: 插件停止时写入该文件, 宠物优雅退出
  if (Test-Path $stopFile) {
    $state.running = $false
    try { $window.Close() } catch {}
  }
})
$timer.Start()

$window.Add_Closed({
  $state.running = $false
  try { Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue } catch {}
  try { Remove-Item -Path $stopFile -Force -ErrorAction SilentlyContinue } catch {}
  $timer.Stop()
  try { $mouseTimer.Stop() } catch {}
  try { $window.Dispatcher.InvokeShutdown() } catch {}
```

</details>

**依据 4 · 源码核查**：[install-autostart.bat:1-7](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/install-autostart.bat#L1-L7)

schtasks 注册最高权限登录任务。

```text
@echo off
REM AnAn Thermal Monitor - install auto-start at login (admin rights, no UAC popup)
schtasks /create /tn "AnAnThermalMonitor" /tr "wscript.exe \"%~dp0start-pet.vbs\"" /sc onlogon /rl highest /f
echo.
echo Done! The pet will start automatically at login with admin rights (no UAC prompt).
echo To remove: run uninstall-autostart.bat
pause
```

**依据 5 · 源码核查**：[assets/desktop-pet.ps1:21-44](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/assets/desktop-pet.ps1#L21-L44)

PID 存活判定及拒绝 UAC 后仍 exit

<details>
<summary>查看原文（24行）</summary>

```text
# ---------- 幂等: 已有一个实例则退出(放在提权前, 避免重复实例弹两次 UAC) ----------
if (Test-Path $pidFile) {
  $oldPid = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($oldPid) {
    $oldProc = Get-Process -Id ([int]$oldPid) -ErrorAction SilentlyContinue
    if ($oldProc) { exit }
  }
}

# ---------- 确认要启动后才清理上次的停止信号(避免覆盖插件正在发送的停止指令) ----------
Remove-Item -Path $stopFile -Force -ErrorAction SilentlyContinue

# ---------- 自提权(读取 CPU 温度/内存温度需要管理员) ----------
# 调试开关: $env:PET_NO_ELEVATE=1 时跳过提权(便于非管理员调试 UI)
if ($env:PET_NO_ELEVATE -ne '1') {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    try {
      Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File', "`"$PSCommandPath`"")
    } catch {
      # 用户拒绝提权: 仍以降权模式运行(GPU/NVMe温度可用)
    }
    exit
  }
```

</details>

#### 缺口

- 未在 Windows 模拟 UAC 拒绝、传感器故障及重启竞态。
  **影响：**实际残留进程/状态误报频率未知。
  **进一步探讨：**在可回滚 VM 拒绝 UAC、杀 Host、重启和卸载，核 PID/flag/任务计划状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装包和自启承诺有什么边界？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

package.json 的 npm files 仅列 lib、assets、cordis.patch.yml、README.md，未包含 start-pet.vbs、install-autostart.bat 与卸载 bat；README 独立运行/自启的“双击”路径在源码仓库可见，但发布 npm 包未必包含这些入口。随包带多个二进制 DLL/EXE，LHM 版本与素材许可由作者声明，本轮仅检查文件存在，不做二进制行为/签名或版权结论。采用前需核目标包实际内容、来源和管理员权限需求；仅在可回滚 Windows VM 试用，先确认传感器缺失显示、停止和任务卸载。建议将安装方式分清源码与发布包，并使 Host 返回经 PID/数据心跳核实的状态。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-34](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/package.json#L24-L34)

files 白名单不含 vbs/bat。

<details>
<summary>查看原文（11行）</summary>

```text
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "assets",
    "cordis.patch.yml",
    "README.md"
  ]
}
```

</details>

**依据 2 · 作者声明**：[README.md:64-96](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/README.md#L64-L96)

作者说明独立双击与自启。

<details>
<summary>查看原文（33行）</summary>

````text

### 启动

**双击 `start-pet.vbs`**（隐藏窗口启动，无控制台闪烁），或命令行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File assets\desktop-pet.ps1
```

- 首次运行弹 **UAC 提权**（读取 CPU/内存温度需要管理员权限），点"是"
- 启动后无控制台窗口残留；右键桌宠卡片 → "退出安安热能监控" 关闭

### 开机自启（免 UAC 弹窗）

双击 **`install-autostart.bat`**——通过 Windows 任务计划程序注册"登录时以最高权限运行"（管理员权限、**不再弹 UAC**）。卸载自启：双击 `uninstall-autostart.bat`。

### 独立运行 vs DSH 插件

| 方式 | 启动 | 特点 |
|---|---|---|
| **独立（vbs/自启）** | 双击 `start-pet.vbs` / 开机自动 | 不依赖 DSH/Bigfish；无 GUI 控制卡片 |
| **DSH 插件** | `dsh plugin add` + 重启 | 随 DSH 启停；对话流内有实时温度卡片 + 启停按钮 |

两种方式可共存（脚本有幂等检查，不会双开桌宠）。

---

## 🖥️ 对电脑各种信息的调用

| 信息 | 调用方式 | 权限 | 说明 |
|---|---|---|---|
| CPU 温度 | LibreHardwareMonitorLib (Ring0 / Intel MSR) | 管理员 | CPU Package / Core Max 温度 |
| 内存温度 | LibreHardwareMonitorLib (SMBus / SPD) | 管理员 | DDR DIMM 温度传感器，无传感器显示 "--" |
````

</details>

**依据 3 · 作者声明**：[README.md:114-161](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/README.md#L114-L161)

作者说明二进制依赖、临时文件及许可。

<details>
<summary>查看原文（48行）</summary>

````text
```
anan-thermal-monitor/
├── package.json                # npm 包清单：声明 dsh.bundle.patch（使插件可被 dsh plugin add 识别）
├── cordis.patch.yml            # 组合层 patch：把插件插入 profile 的层栈
├── lib/index.js                # 插件 Host（ESM，完整 Node API）：spawn/停止桌宠进程
├── assets/
│   ├── desktop-pet.ps1         # 桌宠主脚本（WPF + LHM 采集 + 自提权，路径全相对，可移植）
│   ├── 素材1号.jpg              # 桌宠素材（可替换）
│   └── LibreHardwareMonitor/   # 硬件监控库（运行时依赖）
├── install.ps1                 # 备选手动安装脚本
├── README.md
└── backups/                    # 历史版本备份
```

### 安装原理

`dsh plugin --profile <name> add <包>` 是一个 pnpm 转发器：安装依赖后，会读取每个新依赖的 `package.json`，凡声明 `dsh.bundle.patch` 的包会自动加入 profile 的 `dsh.profile.bundles` 层栈；下次启动时，该 patch（`cordis.patch.yml`）把插件作为一行 `- id: anan-thermal-monitor / name: anan-thermal-monitor` 插入组合，插件 `apply()` 随即执行并拉起桌宠进程。

---

## ⚙️ 配置与运行时文件

- 所有资源路径基于脚本自身目录相对定位（`$PSScriptRoot`），任意位置部署无需改路径
- 运行时临时文件写入 `%TEMP%\anan-thermal-monitor\`：

| 文件 | 作用 |
|---|---|
| `desktop-pet.pid` | 桌宠进程 PID（插件判定运行状态） |
| `desktop-pet-data.json` | 最新传感器数据 `{cpu, mem, gpu, nvme, ts}` |
| `desktop-pet-stop.flag` | 停止信号（插件停止时写入，桌宠优雅退出） |
| `desktop-pet-pos.txt` | 窗口位置记忆 |
| `desktop-pet-error.log` | 运行诊断日志 |

---

## 🐛 常见问题

- **硬件显示 "--"**：对应传感器未暴露（如笔记本主板无板载温度传感器），非故障
- **每次启动弹 UAC**：Ring0/SMBus 读取需要管理员权限，属正常现象
- **重复启动双开**：脚本内置幂等检查，已运行实例存在时新实例直接退出

---

## 📄 许可

- 代码：MIT License
- `assets/LibreHardwareMonitor/`：[LibreHardwareMonitor](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) (MIT License, v0.9.6)
- 桌宠素材（`assets/素材1号.jpg`）作者：**X (Twitter) [@yua_6ukkr](https://x.com/yua_6ukkr)**，版权归原作者所有
````

</details>

**依据 4 · 源码核查**：[lib/index.js:79-97](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/lib/index.js#L79-L97)

当前状态读 PID/文件，RPC 可选。

<details>
<summary>查看原文（19行）</summary>

```text
    try {
      const n = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10)
      return Number.isFinite(n) && n > 0 ? n : null
    } catch { return null }
  }

  // 若宿主环境提供 harness（动态插件式 RPC），注册状态查询；
  // 静态包环境下缺失则跳过（桌宠本身是完整功能）。
  const h = (typeof harness !== 'undefined') ? harness : undefined
  if (h && typeof h.handle === 'function') {
    h.handle('pet-status', async () => {
      const pid = readPid()
      return { running: !!proc || !!pid, pid: proc ? proc.pid : pid }
    })
    h.handle('pet-temps', async () => readJson())
    h.handle('pet-stop', async () => stopPet())
    h.handle('pet-start', async () => startPet())
  }
}
```

</details>

#### 缺口

- 未检查实际 npm tarball 与 bundled binary 安全/授权。
  **影响：**无法确认发布包入口、二进制可靠性和可部署合规性。
  **进一步探讨：**核 npm tarball 内容与 DLL 哈希/许可，在 VM 完整安装卸载及心跳校验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
