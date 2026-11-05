# dsh-wsl-defender

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7777ae2](https://github.com/173787247/dsh-wsl-defender/tree/7777ae2d838701185dca0b7478f5167931290cf1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-defender)
<!-- END META -->

> **功能**：从 WSL 查看 Windows Defender、防火墙、检测记录与排除项。

> **亮点**：[Q01](#research-q01) 在 WSL 排障中聚合多个 Windows 安全状态探针。

> **主要限制**：[Q02](#research-q02) 多类错误退化为空，且排除路径等敏感字段可能进入会话。

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
  - [Q01 · 从 WSL 查 Defender 有什么运维用途？](#detail-section-11)
  - [Q02 · 为什么空检测和空防火墙列表需要区别？](#detail-section-12)
  - [Q03 · 怎样验收并避免把未知读数当安全结论？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者需要从会话核对 Windows 安全配置线索。

从 Windows 安全中心或原生 PowerShell 读取。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Windows 安全快照 | 辅助核对主机配置 | 权限失败可能显示为空，输出可含排除路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 和 PowerShell 安全模块 | 必需 | 查询 Windows 安全状态 | 部分探针可静默失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离主机与非敏感配置 | 核对模块与权限 |
| 对照 | 用户查各项并比对原工具 | 区分失败和空数据 |
| 退出 | 用户回安全中心 | 以原件确认状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认测试模块与账户 | 避免真实排除值 |
| 持续 | 查询资源未知 | 复核缺失和敏感输出 | 有结果也需查范围 |
| 失败 | 排查耗时未知 | 直接核查各探针 | 结果为空需排除权限失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 安全初筛 | 多项 Windows 状态聚合 | 真实判断准确性与用时 |

> **思考**：[Q02](#research-q02) 多类错误退化为空，且排除路径等敏感字段可能进入会话。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在 WSL 排障中聚合多个 Windows 安全状态探针。

[Q02](#research-q02) 各探针分开执行，当前状态未携带其失败原因。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 多类错误退化为空，且排除路径等敏感字段可能进入会话。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在隔离 Windows 主机对照每个探针，空结果不用于结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认采集与回退。真实权限、配置和错误分类未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/defender-exec.js、lib/defender.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码，未运行 Windows、Defender、PowerShell 或 DSH。
- 下一步：覆盖模块缺失、拒绝、空检测、排除项截断和非 WSL。

**分析版本**

- **仓库**：[173787247/dsh-wsl-defender](https://github.com/173787247/dsh-wsl-defender)
- **版本号**：0.1.0（[固定提交 7777ae2](https://github.com/173787247/dsh-wsl-defender/tree/7777ae2d838701185dca0b7478f5167931290cf1)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 分探针回报权限、失败和空数据，比较误判。

覆盖模块缺失、拒绝、空检测、排除项截断和非 WSL。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 407 |
| .js | source | 4 | 241 | 207 | 12 | — |
| .js | test | 1 | 22 | 21 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-defender/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-defender/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-defender/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 维护者能否从 DSH 获取 Windows 安全状态线索并区分读取失败与空数据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从 WSL 查 Defender 有什么运维用途？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

排查 Windows 安全设置与 WSL 任务的关系时，可从 DSH 查看 Defender 状态、防火墙配置文件及有限检测与排除项，定位值得人工核查的主机配置。原生 Windows 安全中心和 PowerShell 可读取相同材料，工具增量是会话内聚合。快照不能证明符合安全策略或说明某故障由防火墙造成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/README.md#L3-L7)

作者范围。

```text
DeepSeek Harness plugin: Windows security posture from WSL: Defender antivirus status and firewall profile state.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[lib/defender-exec.js:24-54](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender-exec.js#L24-L54)

实际采集与字段。

<details>
<summary>查看原文（31行）</summary>

```text
$av = $null
try { $av = Get-MpComputerStatus -ErrorAction Stop } catch {}
$fw = @()
try { $fw = Get-NetFirewallProfile -ErrorAction Stop | ForEach-Object { @{ profile = $_.Name; enabled = [bool]$_.Enabled } } } catch {}
$threats = @()
try {
  $threats = @(Get-MpThreatDetection -ErrorAction Stop | Select-Object -First 10 | ForEach-Object {
    @{ time = $_.InitialDetectionTime.ToString('o'); name = "$($_.ThreatID)"; action = "$($_.ActionSuccess)" }
  })
} catch {}
$excl = $null
try {
  $p = Get-MpPreference -ErrorAction Stop
  $excl = @{
    paths = @($p.ExclusionPath | Where-Object { $_ } | Select-Object -First 20)
    extensions = @($p.ExclusionExtension | Where-Object { $_ } | Select-Object -First 20)
    processes = @($p.ExclusionProcess | Where-Object { $_ } | Select-Object -First 20)
  }
} catch {}
$out = @{ firewall = @($fw); threats = @($threats) }
if ($av) {
  $out.antivirus = @{
    realTime = [bool]$av.RealTimeProtectionEnabled
    sigAge = [int]$av.AntivirusSignatureAge
    sigVersion = "$($av.AntivirusSignatureVersion)"
    quickScanAge = [int]$av.QuickScanAge
  }
  $out.tamperProtected = [bool]$av.IsTamperProtected
}
if ($excl) { $out.exclusions = $excl }
ConvertTo-Json -Compress -Depth 5 $out`)(a);
```

</details>

#### 缺口

- 未做同环境诊断对照
  **影响**：未知聚合是否改变判断时间和质量
  **进一步探讨**：在测试机对照原生命令与工具状态

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么空检测和空防火墙列表需要区别？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

脚本分别 try/catch 四类命令，不记录各项异常。检测和防火墙默认空数组，取数失败可产生与无记录相同的结果；杀毒状态缺失才在文本显示 unavailable。检测只取前 10 条，排除项各取前 20 项，源码没有在查询前按时间排序。检测 name 实际承载 ThreatID，action 来自 ActionSuccess。输出可能含本地排除路径、扩展名及进程名，读取权限和结果披露需分别约束。

#### 证据与依据

**依据 1 · 源码核查**：[lib/defender-exec.js:24-54](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender-exec.js#L24-L54)

每类读取、上限和缺省。

<details>
<summary>查看原文（31行）</summary>

```text
$av = $null
try { $av = Get-MpComputerStatus -ErrorAction Stop } catch {}
$fw = @()
try { $fw = Get-NetFirewallProfile -ErrorAction Stop | ForEach-Object { @{ profile = $_.Name; enabled = [bool]$_.Enabled } } } catch {}
$threats = @()
try {
  $threats = @(Get-MpThreatDetection -ErrorAction Stop | Select-Object -First 10 | ForEach-Object {
    @{ time = $_.InitialDetectionTime.ToString('o'); name = "$($_.ThreatID)"; action = "$($_.ActionSuccess)" }
  })
} catch {}
$excl = $null
try {
  $p = Get-MpPreference -ErrorAction Stop
  $excl = @{
    paths = @($p.ExclusionPath | Where-Object { $_ } | Select-Object -First 20)
    extensions = @($p.ExclusionExtension | Where-Object { $_ } | Select-Object -First 20)
    processes = @($p.ExclusionProcess | Where-Object { $_ } | Select-Object -First 20)
  }
} catch {}
$out = @{ firewall = @($fw); threats = @($threats) }
if ($av) {
  $out.antivirus = @{
    realTime = [bool]$av.RealTimeProtectionEnabled
    sigAge = [int]$av.AntivirusSignatureAge
    sigVersion = "$($av.AntivirusSignatureVersion)"
    quickScanAge = [int]$av.QuickScanAge
  }
  $out.tamperProtected = [bool]$av.IsTamperProtected
}
if ($excl) { $out.exclusions = $excl }
ConvertTo-Json -Compress -Depth 5 $out`)(a);
```

</details>

**依据 2 · 源码核查**：[lib/defender.js:4-20](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender.js#L4-L20)

规范化空值。

<details>
<summary>查看原文（17行）</summary>

```text
export function normalize(raw) {
  return ((raw) => ({
      antivirus: raw.antivirus ? {
        realTime: Boolean(raw.antivirus.realTime),
        sigAge: num(raw.antivirus.sigAge),
        sigVersion: String(raw.antivirus.sigVersion ?? ""),
        quickScanAge: num(raw.antivirus.quickScanAge),
      } : null,
      tamperProtected: raw.tamperProtected === undefined ? null : Boolean(raw.tamperProtected),
      firewall: (raw.firewall || []).map((f) => ({ profile: String(f.profile ?? ""), enabled: Boolean(f.enabled) })),
      threats: (raw.threats || []).map((t) => ({ time: String(t.time ?? ""), name: String(t.name ?? ""), action: String(t.action ?? "") })),
      exclusions: raw.exclusions ? {
        paths: (raw.exclusions.paths || []).map(String),
        extensions: (raw.exclusions.extensions || []).map(String),
        processes: (raw.exclusions.processes || []).map(String),
      } : null,
    }))(raw ?? {});
```

</details>

**依据 3 · 源码核查**：[lib/defender.js:29-48](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender.js#L29-L48)

空检测及排除项的文本。

<details>
<summary>查看原文（20行）</summary>

```text
  return ((v) => {
      const l = [`win_defender ok=${v.ok}`];
      if (v.antivirus) {
        l.push(`  real-time protection: ${v.antivirus.realTime ? "on" : "OFF"}`);
        l.push(`  signatures: ${v.antivirus.sigVersion} (${v.antivirus.sigAge} days old)`);
        l.push(`  last quick scan: ${v.antivirus.quickScanAge === 0 ? "today" : v.antivirus.quickScanAge + " days ago"}`);
      } else l.push("  antivirus: unavailable (Get-MpComputerStatus failed)");
      if (v.tamperProtected !== null) l.push(`  tamper protection: ${v.tamperProtected ? "on" : "off"}`);
      for (const f of v.firewall || []) l.push(`  firewall ${f.profile}: ${f.enabled ? "on" : "OFF"}`);
      if ((v.threats ?? []).length) {
        l.push(`  recent detections: ${v.threats.length}`);
        for (const t of v.threats) l.push(`    ${t.time.slice(0, 19)} threat ${t.name} action-ok=${t.action}`);
      } else l.push("  recent detections: none");
      if (v.exclusions) {
        const x = v.exclusions;
        l.push(`  exclusions: ${x.paths.length + x.extensions.length + x.processes.length}`);
        for (const p of x.paths) l.push(`    path ${p}`);
        for (const e of x.extensions) l.push(`    ext  ${e}`);
        for (const p of x.processes) l.push(`    proc ${p}`);
      }
```

</details>

#### 缺口

- 未测真实 Defender 模块、策略与权限失败
  **影响**：不能将空视为无威胁或防火墙正常
  **进一步探讨**：用测试主机对照命令缺失、拒绝和确实无记录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收并避免把未知读数当安全结论？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

使用隔离 Windows 测试机及已知合成配置，先验证 interop 和 PowerShell 模块，再对照状态、排除项和防火墙原始结果。遇到空、拒绝或敏感输出时回安全中心。可让每个探针独立报告 unavailable、denied、ok-empty 和 ok-data，减少将读取失败视为无检测。以相同受限与正常环境比较误判和输出体积，若误判不降则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-33](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/index.js#L17-L33)

注册和非 WSL 拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
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
```

</details>

**依据 2 · 源码核查**：[lib/defender-exec.js:24-54](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender-exec.js#L24-L54)

独立探针及当前错误处理。

<details>
<summary>查看原文（31行）</summary>

```text
$av = $null
try { $av = Get-MpComputerStatus -ErrorAction Stop } catch {}
$fw = @()
try { $fw = Get-NetFirewallProfile -ErrorAction Stop | ForEach-Object { @{ profile = $_.Name; enabled = [bool]$_.Enabled } } } catch {}
$threats = @()
try {
  $threats = @(Get-MpThreatDetection -ErrorAction Stop | Select-Object -First 10 | ForEach-Object {
    @{ time = $_.InitialDetectionTime.ToString('o'); name = "$($_.ThreatID)"; action = "$($_.ActionSuccess)" }
  })
} catch {}
$excl = $null
try {
  $p = Get-MpPreference -ErrorAction Stop
  $excl = @{
    paths = @($p.ExclusionPath | Where-Object { $_ } | Select-Object -First 20)
    extensions = @($p.ExclusionExtension | Where-Object { $_ } | Select-Object -First 20)
    processes = @($p.ExclusionProcess | Where-Object { $_ } | Select-Object -First 20)
  }
} catch {}
$out = @{ firewall = @($fw); threats = @($threats) }
if ($av) {
  $out.antivirus = @{
    realTime = [bool]$av.RealTimeProtectionEnabled
    sigAge = [int]$av.AntivirusSignatureAge
    sigVersion = "$($av.AntivirusSignatureVersion)"
    quickScanAge = [int]$av.QuickScanAge
  }
  $out.tamperProtected = [bool]$av.IsTamperProtected
}
if ($excl) { $out.exclusions = $excl }
ConvertTo-Json -Compress -Depth 5 $out`)(a);
```

</details>

**依据 3 · 源码核查**：[lib/defender.js:29-48](https://github.com/173787247/dsh-wsl-defender/blob/7777ae2d838701185dca0b7478f5167931290cf1/lib/defender.js#L29-L48)

用户可见空状态。

<details>
<summary>查看原文（20行）</summary>

```text
  return ((v) => {
      const l = [`win_defender ok=${v.ok}`];
      if (v.antivirus) {
        l.push(`  real-time protection: ${v.antivirus.realTime ? "on" : "OFF"}`);
        l.push(`  signatures: ${v.antivirus.sigVersion} (${v.antivirus.sigAge} days old)`);
        l.push(`  last quick scan: ${v.antivirus.quickScanAge === 0 ? "today" : v.antivirus.quickScanAge + " days ago"}`);
      } else l.push("  antivirus: unavailable (Get-MpComputerStatus failed)");
      if (v.tamperProtected !== null) l.push(`  tamper protection: ${v.tamperProtected ? "on" : "off"}`);
      for (const f of v.firewall || []) l.push(`  firewall ${f.profile}: ${f.enabled ? "on" : "OFF"}`);
      if ((v.threats ?? []).length) {
        l.push(`  recent detections: ${v.threats.length}`);
        for (const t of v.threats) l.push(`    ${t.time.slice(0, 19)} threat ${t.name} action-ok=${t.action}`);
      } else l.push("  recent detections: none");
      if (v.exclusions) {
        const x = v.exclusions;
        l.push(`  exclusions: ${x.paths.length + x.extensions.length + x.processes.length}`);
        for (const p of x.paths) l.push(`    path ${p}`);
        for (const e of x.extensions) l.push(`    ext  ${e}`);
        for (const p of x.processes) l.push(`    proc ${p}`);
      }
```

</details>

#### 缺口

- 真实宿主与改法未验收
  **影响**：无法确定兼容范围、披露风险和分类收益
  **进一步探讨**：用有权限和无权限测试用户逐项比较

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
