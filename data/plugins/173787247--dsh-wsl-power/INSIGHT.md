# dsh-wsl-power

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7a37a8c](https://github.com/173787247/dsh-wsl-power/tree/7a37a8c91d47bf69e630ca59db4740a5d7451d77)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power)
<!-- END META -->

> **实现功能**：从 WSL 读取 Windows 活动电源方案、电池、睡眠与休眠信息的只读工具。

> **核心亮点**：以单工具聚合多个 Windows 电源状态指标。详见[Q01](#research-q01)。

> **风险与缺陷**：英语字符串解析、休眠关键词匹配与数值失败归零可能把未知当事实。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · win_power 真正能观察哪些状态？](#detail-section-11)
  - [Q02 · Windows 到 WSL 的读取与解析路径是什么？](#detail-section-12)
  - [Q03 · 不同 Windows 语言和版本是否可靠？](#detail-section-13)
  - [Q04 · 休眠 available 和电池缺失如何解释？](#detail-section-14)
  - [Q05 · 怎样验证并使用电源诊断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL Agent 对本机 Windows 电源状态做初步诊断。详见[Q01](#research-q01)。

Windows 原生 powercfg 与控制面板可直接看到部分状态；插件做单工具聚合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 方案 | 查看活动项 | 英语文本解析 |
| 电池 | 充电状态 | null 二义 |
| 睡眠 | AC 超时/休眠 | 关键词误判 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| WSL/Windows interop | 必需 | 执行 PowerShell | ok:false |
| powercfg/CIM | 必需 | 读取状态 | 字段缺失 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 调用 | win_power/all | 看字段 |
| 对照 | powercfg/CIM 原值 | 核单位/语言 |
| 判读 | 缺失标未知 | 避免误调策略 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 配 WSL interop/PowerShell 并核字段基准 | 现有 Windows/WSL 与测试设备资源；新增现金未知 | 对笔记本/台式机、中英语言核方案、电池、休眠字段，工时未知 | 不兼容设备需回退到原生工具 |
| 持续 | 调 powercfg/CIM 读取并与系统值对照 | 本机子进程 CPU/内存与超时占用；无已证外部收费 | 排查 null、0、休眠文案与原始输出，工时未知 | ok:true 可能掩盖字段失败 |
| 失败恢复 | 修复本地化误判或 interop/命令故障 | 重试与诊断设备资源；误判损失金额未知 | 复查原始命令、修报告/决策并验证语言版本，耗时未知 | 实际设备覆盖、故障率与恢复时间未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 方案 | powercfg | 多语言解析 |
| 电池 | CIM 查询 | 无电池与失败区分 |
| 睡眠 | 英文文本解析 | 实际值准确 |

> **思考**：英语字符串解析、休眠关键词匹配与数值失败归零可能把未知当事实。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以单工具聚合多个 Windows 电源状态指标。详见[Q01](#research-q01)。

以单工具聚合多个 Windows 电源状态指标。详见[Q01](#research-q01)。

固定脚本降低参数风险，但本地化文本和吞错需改进。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

英语字符串解析、休眠关键词匹配与数值失败归零可能把未知当事实。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先与 Windows 原生命令逐字段对照，缺字段视未知；不要把休眠布尔和 sleep=0 直接用于决策。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证只读聚合；英文 powercfg 文本匹配和吞错使 ok:true 可能缺字段或误判休眠/睡眠。目标 Windows 未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/power.js、lib/power-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/power.js、lib/power-exec.js、lib/wsl-host.js；未在 Windows/WSL 执行。旧 META 复用。
- 下一步：目标中英 Windows、笔记本/台式机、CIM 失败、休眠禁用与超时矩阵。

**分析版本**

- **仓库**：[173787247/dsh-wsl-power](https://github.com/173787247/dsh-wsl-power)
- **版本号**：0.1.0（[固定提交 7a37a8c](https://github.com/173787247/dsh-wsl-power/tree/7a37a8c91d47bf69e630ca59db4740a5d7451d77)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是改用稳定结构化 API/GUID、保留每字段错误状态。详见[Q05](#research-q05)。

目标中英 Windows、笔记本/台式机、CIM 失败、休眠禁用与超时矩阵。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 113 | — | — | 401 |
| .js | source | 4 | 215 | 181 | 12 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 电源读取的字段、错误信号和本地化适配是否可信？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_power 真正能观察哪些状态？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

只注册一个无变更动作的 win_power，默认读当前 powercfg 方案、Win32_Battery、交流电睡眠超时及休眠可用性；all=true 时再解析方案列表。桌面无电池显示 null，睡眠 0 显示“永不”。这适合 WSL Agent 做本机电源诊断，不能调整方案/休眠。固定源码可核调用，不代表目标 Windows 结果正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-26](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/README.zh.md#L1-L26)

作者用途和字段

<details>
<summary>查看原文（26行）</summary>

````text
# dsh-wsl-power

> 从 WSL 读取 Windows 电源状态：当前电源方案、电池状态与睡眠设置。

DeepSeek Harness 插件：Windows power state from WSL: active power plan, battery status and sleep settings.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-power
```

## 用法

```
win_power             # active plan, battery, sleep setting
```

## 说明

Reads the active scheme with `powercfg`. `battery` is absent on desktops.
`sleepAcSeconds` is the AC standby timeout; `0` means never.
````

</details>

**依据 2 · 源码核查**：[index.js:17-37](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/index.js#L17-L37)

只注册 win_power

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.tools.register({
    name: "win_power",
    description: "Windows power state from WSL: active power plan, battery status and sleep settings.",
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
    presentCall: () => ({ card: "generic", title: "win_power" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_power", content: result?.content }),
  });
```

</details>

**依据 3 · 源码核查**：[lib/power-exec.js:22-44](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L22-L44)

PowerShell 读取来源

<details>
<summary>查看原文（23行）</summary>

```text
export function script(a) {
  return ((a) => `
$plan = powercfg /getactivescheme 2>$null
$plans = @()
${a.all ? `$plans = @(powercfg /list 2>$null | ForEach-Object {
  $line = "$_".Trim()
  if ($line -match '^Power Scheme GUID:\\s*(\\S+)\\s*\\((.*)\\)\\s*(\\*)?$') {
    @{ guid = $Matches[1]; name = $Matches[2]; active = ($Matches[3] -eq '*') }
  }
})` : ""}
$bat = $null
try {
  $b = Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object -First 1
  if ($b) { $bat = @{ charge = [int]$b.EstimatedChargeRemaining; status = [int]$b.BatteryStatus } }
} catch {}
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Windows 到 WSL 的读取与解析路径是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

WSL 判定在插件加载时执行，非 WSL 返回 ok:false；执行时构造固定 PowerShell 脚本，经 runPowerShell 调用后 JSON.parse；normalize 转成 plan/plans/battery/sleepAcSeconds/hibernateAvailable。all 仅影响是否列所有方案。脚本无用户 URL/命令插值，read-only powercfg/CIM 调用有较小命令注入面。超时配置被 clamp 为 1..120 秒，但工具层 timeoutMs 直接取正数配置，可与内部实际超时不一致。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:8-33](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/index.js#L8-L33)

WSL 检查与外层 timeout

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_power",
    order: 219,
    text: "Use win_power for WSL/Windows interop: Windows power state from WSL: active power plan, battery status and sleep settings.",
  });

  ctx.tools.register({
    name: "win_power",
    description: "Windows power state from WSL: active power plan, battery status and sleep settings.",
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

**依据 2 · 源码核查**：[lib/power-exec.js:22-44](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L22-L44)

固定脚本

<details>
<summary>查看原文（23行）</summary>

```text
export function script(a) {
  return ((a) => `
$plan = powercfg /getactivescheme 2>$null
$plans = @()
${a.all ? `$plans = @(powercfg /list 2>$null | ForEach-Object {
  $line = "$_".Trim()
  if ($line -match '^Power Scheme GUID:\\s*(\\S+)\\s*\\((.*)\\)\\s*(\\*)?$') {
    @{ guid = $Matches[1]; name = $Matches[2]; active = ($Matches[3] -eq '*') }
  }
})` : ""}
$bat = $null
try {
  $b = Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object -First 1
  if ($b) { $bat = @{ charge = [int]$b.EstimatedChargeRemaining; status = [int]$b.BatteryStatus } }
} catch {}
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
```

</details>

**依据 3 · 源码核查**：[lib/power-exec.js:47-71](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L47-L71)

内部超时与 JSON

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

**依据 4 · 源码核查**：[lib/power.js:4-12](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power.js#L4-L12)

归一化

```text
export function normalize(raw) {
  return ((raw) => ({
      plan: String(raw.plan ?? "").trim(),
      plans: (raw.plans || []).map((p) => ({ guid: String(p.guid ?? ""), name: String(p.name ?? ""), active: Boolean(p.active) })),
      battery: raw.battery ? { charge: num(raw.battery.charge), status: num(raw.battery.status) } : null,
      sleepAcSeconds: raw.sleepAcSeconds === null || raw.sleepAcSeconds === undefined ? null : num(raw.sleepAcSeconds),
      hibernateAvailable: raw.hibernateAvailable === null || raw.hibernateAvailable === undefined ? null : Boolean(raw.hibernateAvailable),
    }))(raw ?? {});
}
```

#### 缺口

- 目标 PowerShell/WSL interop 未测
  **影响**：超时信号可能不一致
  **进一步探讨**：目标高延迟 interop 比较内外超时

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不同 Windows 语言和版本是否可靠？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

all=true 的列表解析用英语前缀 Power Scheme GUID 的正则；交流电超时用英语 Current AC Power Setting Index 查 powercfg /query；休眠用字符串 Hibernate 在 powercfg /a 输出里做模糊匹配。非英语本地化会导致列表/超时/休眠解析缺失或误判；脚本多数错误用 2>$null 和 catch{} 吞掉，最终仍可返回 ok:true 且相关字段 null/空。作者只说明读取，未声明多语言兼容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/power-exec.js:24-44](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L24-L44)

英语文本匹配与吞错

<details>
<summary>查看原文（21行）</summary>

```text
$plan = powercfg /getactivescheme 2>$null
$plans = @()
${a.all ? `$plans = @(powercfg /list 2>$null | ForEach-Object {
  $line = "$_".Trim()
  if ($line -match '^Power Scheme GUID:\\s*(\\S+)\\s*\\((.*)\\)\\s*(\\*)?$') {
    @{ guid = $Matches[1]; name = $Matches[2]; active = ($Matches[3] -eq '*') }
  }
})` : ""}
$bat = $null
try {
  $b = Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object -First 1
  if ($b) { $bat = @{ charge = [int]$b.EstimatedChargeRemaining; status = [int]$b.BatteryStatus } }
} catch {}
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
```

</details>

**依据 2 · 源码核查**：[lib/power-exec.js:67-71](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L67-L71)

无字段完整性检查即 ok:true

```text
  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

**依据 3 · 作者声明**：[README.zh.md:23-26](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/README.zh.md#L23-L26)

作者字段说明

```text
## 说明

Reads the active scheme with `powercfg`. `battery` is absent on desktops.
`sleepAcSeconds` is the AC standby timeout; `0` means never.
```

#### 缺口

- 目标语言与 powercfg 输出未采样
  **影响**：多语言机器可能出现看似成功但字段缺失
  **进一步探讨**：目标中英 Windows 文本对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 休眠 available 和电池缺失如何解释？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

hibernateAvailable 是把 powercfg /a 拼成一行后查是否出现单词 Hibernate，未区分“可用”与“因未启用而不可用”等上下文；可能误判。电池 Get-CimInstance 失败会被 catch 吞掉与桌面无电池同样显示 null，格式化文案把两者合成“none (desktop or unavailable)”。用户不能仅凭 null 判定硬件不存在。sleepAcSeconds 转数字失败落 0，还可能被格式化为“永不”，需与 powercfg 原始输出对照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/power-exec.js:32-44](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L32-L44)

电池/睡眠/休眠脚本

<details>
<summary>查看原文（13行）</summary>

```text
$bat = $null
try {
  $b = Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object -First 1
  if ($b) { $bat = @{ charge = [int]$b.EstimatedChargeRemaining; status = [int]$b.BatteryStatus } }
} catch {}
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
```

</details>

**依据 2 · 源码核查**：[lib/power.js:2-11](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power.js#L2-L11)

无效数字回落 0

<details>
<summary>查看原文（10行）</summary>

```text
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      plan: String(raw.plan ?? "").trim(),
      plans: (raw.plans || []).map((p) => ({ guid: String(p.guid ?? ""), name: String(p.name ?? ""), active: Boolean(p.active) })),
      battery: raw.battery ? { charge: num(raw.battery.charge), status: num(raw.battery.status) } : null,
      sleepAcSeconds: raw.sleepAcSeconds === null || raw.sleepAcSeconds === undefined ? null : num(raw.sleepAcSeconds),
      hibernateAvailable: raw.hibernateAvailable === null || raw.hibernateAvailable === undefined ? null : Boolean(raw.hibernateAvailable),
    }))(raw ?? {});
```

</details>

**依据 3 · 源码核查**：[lib/power.js:20-29](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power.js#L20-L29)

格式化缺失为 none/never

<details>
<summary>查看原文（10行）</summary>

```text
  return ((v) => {
      const l = [`win_power ok=${v.ok}`];
      if (v.plan) l.push(`  plan: ${v.plan.replace(/^Power Scheme GUID:\s*/, "")}`);
      for (const p of v.plans ?? []) l.push(`  ${p.active ? "*" : " "} ${p.name}  ${p.guid}`);
      if (v.battery) l.push(`  battery: ${v.battery.charge}% (status code ${v.battery.status})`);
      else l.push("  battery: none (desktop or unavailable)");
      if (v.sleepAcSeconds !== null) l.push(`  sleep after: ${v.sleepAcSeconds === 0 ? "never (on AC)" : v.sleepAcSeconds + "s on AC"}`);
      if (v.hibernateAvailable !== null) l.push(`  hibernate: ${v.hibernateAvailable ? "available" : "not available"}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
```

</details>

#### 缺口

- 目标具体文案/异常输出未测
  **影响**：可能把读取失败当真实节能设置
  **进一步探讨**：目标故意失败 CIM/powercfg 对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证并使用电源诊断？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

只在 WSL→Windows 环境调用，对同一设备用 Windows 控制面板、powercfg 原始输出和 CIM 值逐字段比对，分别覆盖笔记本/台式机、中英语言与休眠禁用；缺字段需标未知而非当否定。插件的价值是把多个本机状态聚合给 Agent，部署无需额外服务但依赖 Windows interop。改进可改用稳定的 GUID/结构化 API 而非英文 powercfg 文本，目标兼容性未证。 假设推导：当前 all=true 的方案、交流电超时和休眠均依英语 powercfg 文本，异常被吞并可能在 ok:true 下产出 null/0；因此跨语言诊断可能把读取失败误说成无电池、永不休眠或无方案。若优先取语言无关的方案 GUID 与结构化电池/休眠状态，给每字段保留来源与错误码，预期同一设备在中英系统上的字段完整率提高且失败不再伪装为正常值。条件是目标 Windows/WSL interop 能提供稳定接口并允许调用；代价是 API 适配、版本兼容和更复杂的输出。最小对照在同一设备切换中英语言或等价系统镜像，覆盖笔记本/台式机、休眠启停及模拟 CIM/powercfg 失败，原版和原型均与控制面板、原始命令逐字段比对，记录正确率、未知率和错误显露率。若原型仍因语言产生错误值或把故障当正常，或不能覆盖原有状态，就证伪该改进。结构化读取与错误码是未实现设想。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:28-46](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/README.zh.md#L28-L46)

作者依赖/兼容声明

<details>
<summary>查看原文（19行）</summary>

````text
## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-power` **0.1.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
````

</details>

**依据 2 · 源码核查**：[lib/power-exec.js:22-71](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power-exec.js#L22-L71)

实际读取与返回

<details>
<summary>查看原文（50行）</summary>

```text
export function script(a) {
  return ((a) => `
$plan = powercfg /getactivescheme 2>$null
$plans = @()
${a.all ? `$plans = @(powercfg /list 2>$null | ForEach-Object {
  $line = "$_".Trim()
  if ($line -match '^Power Scheme GUID:\\s*(\\S+)\\s*\\((.*)\\)\\s*(\\*)?$') {
    @{ guid = $Matches[1]; name = $Matches[2]; active = ($Matches[3] -eq '*') }
  }
})` : ""}
$bat = $null
try {
  $b = Get-CimInstance Win32_Battery -ErrorAction Stop | Select-Object -First 1
  if ($b) { $bat = @{ charge = [int]$b.EstimatedChargeRemaining; status = [int]$b.BatteryStatus } }
} catch {}
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
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

**依据 3 · 源码核查**：[lib/power.js:4-29](https://github.com/173787247/dsh-wsl-power/blob/7a37a8c91d47bf69e630ca59db4740a5d7451d77/lib/power.js#L4-L29)

字段解释

<details>
<summary>查看原文（26行）</summary>

```text
export function normalize(raw) {
  return ((raw) => ({
      plan: String(raw.plan ?? "").trim(),
      plans: (raw.plans || []).map((p) => ({ guid: String(p.guid ?? ""), name: String(p.name ?? ""), active: Boolean(p.active) })),
      battery: raw.battery ? { charge: num(raw.battery.charge), status: num(raw.battery.status) } : null,
      sleepAcSeconds: raw.sleepAcSeconds === null || raw.sleepAcSeconds === undefined ? null : num(raw.sleepAcSeconds),
      hibernateAvailable: raw.hibernateAvailable === null || raw.hibernateAvailable === undefined ? null : Boolean(raw.hibernateAvailable),
    }))(raw ?? {});
}

// Dispatch on the shape of the result rather than making the caller say which
// formatter to use: a result carries either `detail`, or `subkeys`, or neither.
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_power ok=${v.ok}`];
      if (v.plan) l.push(`  plan: ${v.plan.replace(/^Power Scheme GUID:\s*/, "")}`);
      for (const p of v.plans ?? []) l.push(`  ${p.active ? "*" : " "} ${p.name}  ${p.guid}`);
      if (v.battery) l.push(`  battery: ${v.battery.charge}% (status code ${v.battery.status})`);
      else l.push("  battery: none (desktop or unavailable)");
      if (v.sleepAcSeconds !== null) l.push(`  sleep after: ${v.sleepAcSeconds === 0 ? "never (on AC)" : v.sleepAcSeconds + "s on AC"}`);
      if (v.hibernateAvailable !== null) l.push(`  hibernate: ${v.hibernateAvailable ? "available" : "not available"}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
```

</details>

#### 缺口

- 目标硬件/语言覆盖未知
  **影响**：不宜直接据结果调电源策略
  **进一步探讨**：多设备/语言对照测试

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
