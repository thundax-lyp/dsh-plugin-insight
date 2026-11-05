# dsh-wsl-perf

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[737f653](https://github.com/173787247/dsh-wsl-perf/tree/737f6533caa9b6a2fb55ec969418cd6fee3d577f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-perf)
<!-- END META -->

> **功能**：从 WSL 的 DSH 会话查看 Windows 主机 CPU、内存、磁盘和进程快照。

> **亮点**：[Q01](#research-q01) 在 WSL 排障会话中补上 Windows 主机资源视角。

> **主要限制**：[Q02](#research-q02) 进程按内存排序，缺失数字回退为零，不能据此断定 CPU 热点或无负载。

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
  - [Q01 · Windows 资源快照能解决哪一类 WSL 排障？](#detail-section-11)
  - [Q02 · 进程排名和缺失计数有什么语义？](#detail-section-12)
  - [Q03 · 如何试用并区分零值与采样失败？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 任务变慢，需要检查 Windows 主机是否资源紧张。

直接查看 Windows 任务管理器或 CIM。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Windows 主机快照 | 辅助定位主机资源问题 | 依赖 interop、权限和 CIM，进程按内存排序 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与 PowerShell | 必需 | 执行 Windows 探针 | 环境检测通过也可能无法启动 |
| Windows CIM 及进程可读权限 | 必需 | 取得主机状态 | 可能失败或产生部分结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选测试主机 | 可访问 Windows interop |
| 采集 | 用户读取并对照原生工具 | 区分内存排行和 CPU 计数 |
| 退出 | 用户改用原生诊断 | 趋势或零值需复核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 检查 interop 和权限 | 需 Windows 环境 |
| 持续 | 采样开销未知 | 复核快照语义 | 仅单次读取 |
| 失败 | 排查耗时未知 | 用原生工具检查部分探针 | 缺失可能呈零 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨宿主诊断 | 显示 Windows 资源快照 | 实际读数准确性与节时 |

> **思考**：[Q02](#research-q02) 进程按内存排序，缺失数字回退为零，不能据此断定 CPU 热点或无负载。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在 WSL 排障会话中补上 Windows 主机资源视角。

[Q02](#research-q02) 对多个指标统一转数字会折叠缺失和真实零值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 进程按内存排序，缺失数字回退为零，不能据此断定 CPU 热点或无负载。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试机对照工作集排行和 CIM 指标，遇到未知零值回原生。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 Windows 读取与规范化。真实主机兼容性、资源读数和改法待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/perf-exec.js、lib/perf.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 PowerShell、Windows、插件或测试。
- 下一步：覆盖非 WSL、不可用 interop、CIM 部分失败、超时、计量单位和排行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-perf](https://github.com/173787247/dsh-wsl-perf)
- **版本号**：0.1.0（[固定提交 737f653](https://github.com/173787247/dsh-wsl-perf/tree/737f6533caa9b6a2fb55ec969418cd6fee3d577f)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 区分缺失与真实零值，比较部分失败的误判。

覆盖非 WSL、不可用 interop、CIM 部分失败、超时、计量单位和排行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 408 |
| .js | source | 4 | 214 | 180 | 12 | — |
| .js | test | 1 | 43 | 40 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-perf/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-perf/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-perf/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 维护者能否从 DSH 定位 Windows 主机资源线索并识别缺失数据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 资源快照能解决哪一类 WSL 排障？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

从 WSL 观察到响应变慢时，维护者可直接在 DSH 查询 Windows 主机 CPU、内存、磁盘、启动时间和内存占用较大的进程，避免将 WSL 内部资源视为整台机器。相比打开 Windows 工具，插件把固定快照放进排障会话。它不采集趋势或归因，合格结果是找出需要用原生工具继续核对的资源。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/README.md#L3-L12)

作者的跨宿主观察范围。

<details>
<summary>查看原文（10行）</summary>

````text
DeepSeek Harness plugin: Windows host performance counters from WSL: CPU, memory, disk and top processes.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-perf
````

</details>

**依据 2 · 源码核查**：[index.js:8-31](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/index.js#L8-L31)

注册与 WSL 拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_perf",
    order: 214,
    text: "Use win_perf for WSL/Windows interop: Windows host performance counters from WSL: CPU, memory, disk and top processes.",
  });

  ctx.tools.register({
    name: "win_perf",
    description: "Windows host performance counters from WSL: CPU, memory, disk and top processes.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
```

</details>

**依据 3 · 源码核查**：[lib/perf-exec.js:22-42](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/perf-exec.js#L22-L42)

实际查询 Windows 数据。

<details>
<summary>查看原文（21行）</summary>

```text
export function script(a) {
  return ((a) => `
$cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
  @{ drive = $_.DeviceID; freeGB = [math]::Round($_.FreeSpace/1GB,1); totalGB = [math]::Round($_.Size/1GB,1) }
}
$procs = Get-Process | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First ${a.top} | ForEach-Object {
  @{ name = $_.ProcessName; pid = $_.Id; memMB = [math]::Round($_.WorkingSet64/1MB,1); cpuSec = [math]::Round($_.CPU,1) }
}
ConvertTo-Json -Compress -Depth 5 @{
  cpuPercent = [math]::Round($cpu,1)
  memTotalMB = [math]::Round($os.TotalVisibleMemorySize/1KB,0)
  memFreeMB  = [math]::Round($os.FreePhysicalMemory/1KB,0)
  uptimeSec  = [int]((Get-Date) - $os.LastBootUpTime).TotalSeconds
  bootTime   = $os.LastBootUpTime.ToString('o')
  logicalProcessors = $cs.NumberOfLogicalProcessors
  disks = @($disk)
  processes = @($procs)
}`)(a);
```

</details>

#### 缺口

- 未比较同一故障和原生工具结果
  **影响**：节时及诊断准确性未知
  **进一步探讨**：同主机、同时点对照 Windows 原生指标

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 进程排名和缺失计数有什么语义？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

PowerShell 以 CIM 读取 CPU 负载和系统数据，固定盘按 DriveType=3 选择。进程先按 WorkingSet64 排序，再显示累积 CPU 秒，因此靠前表示内存工作集大，不能据此判断瞬时 CPU 热点。top 参数夹在 1 到 40。脚本只对 stdout 做 JSON 解析，空文本用空对象，字段缺失或非数字会在 normalize 中转成 0。若 PowerShell 产生部分结果但仍退出成功，零值可能掩盖缺失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/perf-exec.js:22-42](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/perf-exec.js#L22-L42)

指标来源与排序。

<details>
<summary>查看原文（21行）</summary>

```text
export function script(a) {
  return ((a) => `
$cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
  @{ drive = $_.DeviceID; freeGB = [math]::Round($_.FreeSpace/1GB,1); totalGB = [math]::Round($_.Size/1GB,1) }
}
$procs = Get-Process | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First ${a.top} | ForEach-Object {
  @{ name = $_.ProcessName; pid = $_.Id; memMB = [math]::Round($_.WorkingSet64/1MB,1); cpuSec = [math]::Round($_.CPU,1) }
}
ConvertTo-Json -Compress -Depth 5 @{
  cpuPercent = [math]::Round($cpu,1)
  memTotalMB = [math]::Round($os.TotalVisibleMemorySize/1KB,0)
  memFreeMB  = [math]::Round($os.FreePhysicalMemory/1KB,0)
  uptimeSec  = [int]((Get-Date) - $os.LastBootUpTime).TotalSeconds
  bootTime   = $os.LastBootUpTime.ToString('o')
  logicalProcessors = $cs.NumberOfLogicalProcessors
  disks = @($disk)
  processes = @($procs)
}`)(a);
```

</details>

**依据 2 · 源码核查**：[lib/perf-exec.js:45-69](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/perf-exec.js#L45-L69)

参数、超时和 JSON 路径。

<details>
<summary>查看原文（25行）</summary>

```text
export async function execute(args, config = {}) {
  const a = {
    name: typeof args?.name === "string" ? args.name : "",
    state: typeof args?.state === "string" ? args.state : "",
    log: typeof args?.log === "string" ? args.log : "System",
    path: typeof args?.path === "string" ? args.path : "",
    provider: typeof args?.provider === "string" ? args.provider : "",
    level: clamp(args?.level, 1, 5, 2),
    count: clamp(args?.count, 1, 200, 20),
    limit: clamp(args?.limit, 1, 400, 40),
    top: clamp(args?.top, 1, 40, 8),
    detail: Boolean(args?.detail),
    subkeys: Boolean(args?.subkeys),
    all: Boolean(args?.all),
    full: Boolean(args?.full),
    since: null,
  };



  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

</details>

**依据 3 · 源码核查**：[lib/perf.js:1-12](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/perf.js#L1-L12)

无效数字统一变零。

<details>
<summary>查看原文（12行）</summary>

```text
// Pure side of perf: normalisation and formatting, testable without Windows.
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      cpuPercent: num(raw.cpuPercent),
      memTotalMB: num(raw.memTotalMB), memFreeMB: num(raw.memFreeMB),
      uptimeSec: num(raw.uptimeSec), bootTime: String(raw.bootTime ?? ""),
      logicalProcessors: num(raw.logicalProcessors),
      disks: (raw.disks || []).map((d) => ({ drive: String(d.drive ?? ""), freeGB: num(d.freeGB), totalGB: num(d.totalGB) })),
      processes: (raw.processes || []).map((p) => ({ name: String(p.name ?? ""), pid: num(p.pid), memMB: num(p.memMB), cpuSec: num(p.cpuSec) })),
    }))(raw ?? {});
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/wsl-host.js#L34-L41)

PowerShell 进程边界。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

#### 缺口

- 未验证 CIM 失败、空输出及真实单位
  **影响**：不能保证零值代表真实观测
  **进一步探讨**：用同版本脚本比对空输出、部分失败和真实负载

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并区分零值与采样失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先在测试 WSL 核对 Windows interop 可调用，注意 WSL 环境检测本身不证明 PowerShell、CIM 权限或各探针可用。用原生任务管理器或相同 CIM 查询对照，再用独立失败样本看错误和结果。若零值与原生工具不符就退出到 Windows 原生诊断。可按探针保留 unknown 和来源状态，比较部分失败时的正确判定和额外处理成本，若误判没有下降则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/wsl-host.js#L21-L27)

WSL 识别。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 2 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/wsl-host.js#L34-L41)

实际跨边界命令。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

**依据 3 · 源码核查**：[lib/perf.js:1-12](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/lib/perf.js#L1-L12)

零值与缺失混合。

<details>
<summary>查看原文（12行）</summary>

```text
// Pure side of perf: normalisation and formatting, testable without Windows.
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      cpuPercent: num(raw.cpuPercent),
      memTotalMB: num(raw.memTotalMB), memFreeMB: num(raw.memFreeMB),
      uptimeSec: num(raw.uptimeSec), bootTime: String(raw.bootTime ?? ""),
      logicalProcessors: num(raw.logicalProcessors),
      disks: (raw.disks || []).map((d) => ({ drive: String(d.drive ?? ""), freeGB: num(d.freeGB), totalGB: num(d.totalGB) })),
      processes: (raw.processes || []).map((p) => ({ name: String(p.name ?? ""), pid: num(p.pid), memMB: num(p.memMB), cpuSec: num(p.cpuSec) })),
    }))(raw ?? {});
```

</details>

**依据 4 · 源码核查**：[index.js:25-33](https://github.com/173787247/dsh-wsl-perf/blob/737f6533caa9b6a2fb55ec969418cd6fee3d577f/index.js#L25-L33)

工具层错误。

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

#### 缺口

- 没有真实 WSL 或部分失败对照
  **影响**：接入耗时、采样开销和改法收益未知
  **进一步探讨**：以隔离主机模拟 CIM 缺权限、空输出和响应慢

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
