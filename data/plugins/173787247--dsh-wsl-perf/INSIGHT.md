# dsh-wsl-perf

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[c6aac1e](https://github.com/173787247/dsh-wsl-perf/tree/c6aac1e77224a9a81a1103ba199bd6b5785e654c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-perf)
<!-- END META -->

> **实现功能**：从 WSL 获取 Windows 宿主 CPU、内存、固定磁盘和按内存排序的进程快照。

> **核心亮点**：把 Windows 宿主多个指标一次聚合给 WSL 中的 Agent。详见[Q01](#research-q01)。

> **风险与缺陷**：缺失数据归零与单次 CPU/进程 CPU 混用会误导瓶颈归因；top 只限输出不限制枚举。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · win_perf 读的是 Windows 宿主还是 WSL 虚拟机？](#detail-section-11)
  - [Q02 · CPU、内存、磁盘与进程怎样计算？](#detail-section-12)
  - [Q03 · 失败或部分数据缺失如何呈现？](#detail-section-13)
  - [Q04 · 采样/并发与超时边界是什么？](#detail-section-14)
  - [Q05 · 如何用于 Windows 宿主性能排查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows 宿主低频性能初筛，需与任务管理器对照。详见[Q01](#research-q01)。

Windows 任务管理器/PerfMon 提供更完整性能视图；插件提供 Agent 可读摘要。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| CPU/内存 | 初筛负载 | 缺值归 0 |
| 磁盘 | 固定盘容量 | 不含网络盘 |
| 进程 | 内存排名 | 非 CPU 排名 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| WSL/Windows interop | 必需 | PowerShell | ok:false |
| CIM/Get-Process | 必需 | 指标 | 缺字段/失败 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 调用 | win_perf top=N | 单次快照 |
| 对照 | 任务管理器/PerfMon | 核单位/排序 |
| 复测 | 异常或 0 值 | 查 CIM/时间序列 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows PowerShell/CIM与DSH环境，新增现金未知 | 核平台/权限与任务管理器/字段基准，工时未知 | CIM权限/版本不匹配需原生诊断 |
| 持续使用 | 单次CIM与全量Get-Process枚举排序、宿主进程CPU/内存 | 低频核0值/累计CPU及字段窗口，工时未知 | top只限输出；并发高频开销/误报未测 |
| 失败恢复 | 重采样/原始日志与可能误判恢复资源，金额未知 | 分辨查询缺失和真0，回原工具查负载，工时未知 | 无自动趋势/告警或资源调节，恢复时间未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 宿主资源 | CIM/固定磁盘 | 目标准确性 |
| 进程 | 内存前 N | CPU 热点 |
| 监控 | 单次调用 | 时序趋势 |

> **思考**：缺失数据归零与单次 CPU/进程 CPU 混用会误导瓶颈归因；top 只限输出不限制枚举。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 宿主多个指标一次聚合给 WSL 中的 Agent。详见[Q01](#research-q01)。

把 Windows 宿主多个指标一次聚合给 WSL 中的 Agent。详见[Q01](#research-q01)。

固定脚本和 top 夹取降低参数风险，但异常数据归零/并发采样需谨慎。详见[Q02](#research-q02)至[Q04](#research-q04)。 原生执行不接调用方signal，top控制返回而非全量枚举成本，内外timeout不同不构成统一取消保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺失数据归零与单次 CPU/进程 CPU 混用会误导瓶颈归因；top 只限输出不限制枚举。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

低频初筛，0 值先核 CIM；CPU 热点另用实时进程采样。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。Windows宿主指标快照/内存前N查询成立，缺值归0、CPU累计和采样窗口需分清；字段状态/差分CPU方案未验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/perf.js、lib/perf-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/perf.js、lib/perf-exec.js、lib/wsl-host.js；未运行目标 Windows。旧 META 复用。
- 下一步：目标低/高负载、缺权限 CIM、高进程数、并发调用与任务管理器对照。

**分析版本**

- **仓库**：[173787247/dsh-wsl-perf](https://github.com/173787247/dsh-wsl-perf)
- **版本号**：0.1.0（[固定提交 c6aac1e](https://github.com/173787247/dsh-wsl-perf/tree/c6aac1e77224a9a81a1103ba199bd6b5785e654c)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为每字段状态、采样时间和进程 CPU 差分。详见[Q05](#research-q05)。

目标低/高负载、缺权限 CIM、高进程数、并发调用与任务管理器对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 408 |
| .js | source | 4 | 214 | 180 | 12 | — |
| .js | test | 1 | 43 | 40 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-perf/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 读取 Windows 宿主性能快照时，各指标的来源、排序和失败语义是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_perf 读的是 Windows 宿主还是 WSL 虚拟机？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

只注册 win_perf 一个只读工具，PowerShell 查询 Win32_Processor、Win32_OperatingSystem、Win32_ComputerSystem、Win32_LogicalDisk 和 Get-Process；结果是 Windows 宿主 CPU/内存/本地固定磁盘/进程，不是 WSL VM 自己的资源视图。top 参数默认 8，上限 40。适用于从 WSL 快速定位 Windows 宿主压力，但无持续时间序列或写入动作。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-27](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/README.zh.md#L1-L27)

作者用途和宿主/WSL 边界

<details>
<summary>查看原文（27行）</summary>

````text
# dsh-wsl-perf

> 从 WSL 读取 Windows 宿主性能计数器：CPU、内存、磁盘与占用最高的进程。

DeepSeek Harness 插件：Windows host performance counters from WSL: CPU, memory, disk and top processes.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-perf
```

## 用法

```
win_perf              # cpu, memory, disks, top processes
win_perf top=20       # more processes
```

## 说明

Counters come from `Get-CimInstance Win32_Processor` and `Win32_OperatingSystem`.
Memory figures are the host's, not the WSL VM's.
````

</details>

**依据 2 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/index.js#L17-L37)

只读工具入口

<details>
<summary>查看原文（21行）</summary>

```text
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
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_perf" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_perf", content: result?.content }),
  });
```

</details>

**依据 3 · 源码核查**：[lib/perf-exec.js:23-42](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L23-L42)

PowerShell 数据来源

<details>
<summary>查看原文（20行）</summary>

```text
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · CPU、内存、磁盘与进程怎样计算？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CPU 是 Win32_Processor.LoadPercentage 的平均值；总/空闲内存从 Win32_OperatingSystem 的 KiB 字段换算成 MB；运行时长是当前时间减 LastBootUpTime；固定盘 DriveType=3 以 GB 输出；进程由 Get-Process 按 WorkingSet64 内存降序取前 top，CPU 字段是累计 .CPU 秒而非实时占用百分比。因此“top processes”实际是内存排名，不能据列表判 CPU 热点。

#### 证据与依据

**依据 1 · 源码核查**：[lib/perf-exec.js:23-42](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L23-L42)

逐字段来源、排序与单位

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/perf.js:4-12](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf.js#L4-L12)

归一化输出

```text
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

**依据 3 · 源码核查**：[lib/perf.js:21-29](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf.js#L21-L29)

读者格式化

```text
  return ((v) => {
      const used = v.memTotalMB - v.memFreeMB;
      const days = Math.floor(v.uptimeSec / 86400), hours = Math.floor((v.uptimeSec % 86400) / 3600);
      const l = [`win_perf ok=${v.ok} cpu=${v.cpuPercent}% (${v.logicalProcessors} cores)`];
      l.push(`  memory: ${used}/${v.memTotalMB}MB`);
      l.push(`  uptime: ${days}d ${hours}h`);
      for (const d of v.disks || []) l.push(`  ${d.drive} ${d.freeGB}GB free of ${d.totalGB}GB`);
      for (const p of v.processes || []) l.push(`  ${p.name} (pid ${p.pid}) ${p.memMB}MB  cpu ${p.cpuSec}s`);
      if (v.error) l.push(`error: ${v.error}`);
```

#### 缺口

- 目标 CIM 刷新周期/单位未测
  **影响**：性能瓶颈归因可能错误
  **进一步探讨**：目标高 CPU 低内存进程对照任务管理器

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败或部分数据缺失如何呈现？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

PowerShell 脚本未给每个 CIM 调用单独错误 envelope；空 stdout JSON.parse 退 {}，normalize 的 num(null/undefined) 归 0，缺少 CPU/内存/核心数等会被显示成真实 0。若 raw.error 不存在，execute 总返回 ok:true。少数脚本级错误会使 JSON 解析失败并由 index 返回 ok:false，但部分查询静默缺失可被误作低负载。建议保留 null/来源状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/perf-exec.js:23-42](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L23-L42)

多个 CIM 调用组成一个 JSON

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/perf-exec.js:65-69](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L65-L69)

空输出 {} 与 ok:true

```text
  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

**依据 3 · 源码核查**：[lib/perf.js:2-12](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf.js#L2-L12)

缺值变 0

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 4 · 源码核查**：[index.js:27-33](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/index.js#L27-L33)

顶层错误捕捉

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
```

#### 缺口

- 目标 CIM 部分失败输出未测
  **影响**：0 CPU/内存可能是读数失败
  **进一步探讨**：目标缺权限/CIM 错误注入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采样/并发与超时边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、功能与机制

#### 完整回答

工具声明 isConcurrencySafe=true，多个 Agent 同时调用可并发启动 PowerShell/CIM。每次读取为一个即时快照，CPU LoadPercentage 的统计窗口由 Windows 决定，进程 .CPU 是累计秒，两者不应直接比较。top 限 1..40，但 Get-Process 先读所有进程并排序再取前 N；N 控制输出量，不控制系统枚举成本。外层 timeout 取原配置正数，内部限制 1..120 秒，配置极值可能造成不一致。

本工具依apply时WSL检测、可用Windows PowerShell/CIM与DSH tools/systemPrompt。原生执行器不接调用方exec.signal，内外timeout不同不能被解释为一致的协作取消/全链时间预算；并发安全声明也不是全局采样频率控制。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows PowerShell/CIM与DSH环境，新增现金未知 | 核平台/权限与任务管理器/字段基准，工时未知 | CIM权限/版本不匹配需原生诊断 |
| 持续使用 | 单次CIM与全量Get-Process枚举排序、宿主进程CPU/内存 | 低频核0值/累计CPU及字段窗口，工时未知 | top只限输出；并发高频开销/误报未测 |
| 失败恢复 | 重采样/原始日志与可能误判恢复资源，金额未知 | 分辨查询缺失和真0，回原工具查负载，工时未知 | 无自动趋势/告警或资源调节，恢复时间未知 |

基线是手动查看Windows多个性能视图或跑CIM脚本；合格单位是正确区分故障/缺值与真实负载的初筛，不是工具ok或列表长度。净节时/准确性无对照，未知不填0。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-27](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/index.js#L25-L27)

外层 timeout/并发

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
```

**依据 2 · 源码核查**：[lib/perf-exec.js:23-31](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L23-L31)

CIM/进程枚举

```text
  return ((a) => `
$cpu = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
$os = Get-CimInstance Win32_OperatingSystem
$cs = Get-CimInstance Win32_ComputerSystem
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
  @{ drive = $_.DeviceID; freeGB = [math]::Round($_.FreeSpace/1GB,1); totalGB = [math]::Round($_.Size/1GB,1) }
}
$procs = Get-Process | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First ${a.top} | ForEach-Object {
  @{ name = $_.ProcessName; pid = $_.Id; memMB = [math]::Round($_.WorkingSet64/1MB,1); cpuSec = [math]::Round($_.CPU,1) }
```

**依据 3 · 源码核查**：[lib/perf-exec.js:45-69](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L45-L69)

top/内部 timeout

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

**依据 4 · 源码核查**：[lib/perf.js:21-29](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf.js#L21-L29)

CPU百分比与累计秒展示

```text
  return ((v) => {
      const used = v.memTotalMB - v.memFreeMB;
      const days = Math.floor(v.uptimeSec / 86400), hours = Math.floor((v.uptimeSec % 86400) / 3600);
      const l = [`win_perf ok=${v.ok} cpu=${v.cpuPercent}% (${v.logicalProcessors} cores)`];
      l.push(`  memory: ${used}/${v.memTotalMB}MB`);
      l.push(`  uptime: ${days}d ${hours}h`);
      for (const d of v.disks || []) l.push(`  ${d.drive} ${d.freeGB}GB free of ${d.totalGB}GB`);
      for (const p of v.processes || []) l.push(`  ${p.name} (pid ${p.pid}) ${p.memMB}MB  cpu ${p.cpuSec}s`);
      if (v.error) l.push(`error: ${v.error}`);
```

**依据 5 · 源码核查**：[index.js:25-34](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/index.js#L25-L34)

外层预算与execute不接exec.signal。

<details>
<summary>查看原文（10行）</summary>

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
    },
```

</details>

**依据 6 · 源码核查**：[lib/perf-exec.js:65-69](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L65-L69)

内层clamp后原生查询，缺省空stdout解析。

```text
  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

#### 缺口

- 目标大进程数的开销未知
  **影响**：频繁并发采样可能增加负担
  **进一步探讨**：目标并发与高进程数测延迟

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用于 Windows 宿主性能排查？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先用任务管理器/Performance Monitor 对照 CPU、内存、磁盘；遇到 0 或缺字段先检查 CIM/PowerShell，不把 0 直接当资源空闲。要排 CPU 热点需另取进程实时 CPU 采样，当前进程列表按内存排。适合低频初筛，不适合高频监控/告警；改进可输出采样时间、字段状态与差分 CPU。硬件与运行开销未测。 假设推导：当前空 stdout 可变 {}，缺 CPU/内存被 normalize 为 0 且仍 ok:true；进程按内存排序，CPU 是累计秒，单次快照缺时间基准。因此只用当前输出作瓶颈归因会把故障当空闲、把累计 CPU 当实时热点。若为每字段保留 null/采样时间/查询错误，并对进程 CPU 做两次采样差分，预计错误读数可被识别，CPU 热点排序更接近任务管理器。前提是 PowerShell/CIM 允许稳定重采样和进程 ID 匹配；代价是多一次进程枚举、采样等待、并发开销，进程退出时需标未知。最小对照用同一 Windows 宿主的空闲、高 CPU 低内存、高内存低 CPU、CIM 失败与高进程数场景，原版/原型同任务管理器和 PerfMon 对照，比较假 0 率、热点排序一致性、延迟/CPU 开销。若故障仍被报告为正常 0、排序一致性未改善，或重采样开销超过可接受阈值，则假设不成立。字段状态与差分 CPU 均非现有实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:17-31](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/README.zh.md#L17-L31)

作者用法/依赖

<details>
<summary>查看原文（15行）</summary>

````text
## 用法

```
win_perf              # cpu, memory, disks, top processes
win_perf top=20       # more processes
```

## 说明

Counters come from `Get-CimInstance Win32_Processor` and `Win32_OperatingSystem`.
Memory figures are the host's, not the WSL VM's.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。
````

</details>

**依据 2 · 源码核查**：[lib/perf-exec.js:23-69](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf-exec.js#L23-L69)

实际一次采样

<details>
<summary>查看原文（47行）</summary>

```text
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
}

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

**依据 3 · 源码核查**：[lib/perf.js:21-29](https://github.com/173787247/dsh-wsl-perf/blob/c6aac1e77224a9a81a1103ba199bd6b5785e654c/lib/perf.js#L21-L29)

人类可读输出

```text
  return ((v) => {
      const used = v.memTotalMB - v.memFreeMB;
      const days = Math.floor(v.uptimeSec / 86400), hours = Math.floor((v.uptimeSec % 86400) / 3600);
      const l = [`win_perf ok=${v.ok} cpu=${v.cpuPercent}% (${v.logicalProcessors} cores)`];
      l.push(`  memory: ${used}/${v.memTotalMB}MB`);
      l.push(`  uptime: ${days}d ${hours}h`);
      for (const d of v.disks || []) l.push(`  ${d.drive} ${d.freeGB}GB free of ${d.totalGB}GB`);
      for (const p of v.processes || []) l.push(`  ${p.name} (pid ${p.pid}) ${p.memMB}MB  cpu ${p.cpuSec}s`);
      if (v.error) l.push(`error: ${v.error}`);
```

#### 缺口

- 目标时序和机器负载未测
  **影响**：误判性能瓶颈
  **进一步探讨**：目标同机对照任务管理器与 PerfMon

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
