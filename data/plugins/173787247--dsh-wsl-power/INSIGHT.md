# dsh-wsl-power

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f2ac258](https://github.com/173787247/dsh-wsl-power/tree/f2ac258b917742a8f7561a5d957853893d5006ef)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-power)
<!-- END META -->

> **功能**：从 WSL 查询 Windows 活动电源方案、电池和交流供电睡眠设置。

> **亮点**：[Q01](#research-q01) 将 Windows 电源线索放入 WSL 的当前工作会话。

> **主要限制**：[Q02](#research-q02) 文本解析依赖英文，休眠布尔结果及电池空值需要回查。

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
  - [Q01 · 如何从 WSL 检查长任务的主机电源条件？](#detail-section-11)
  - [Q02 · 电源方案与休眠解析在哪些机器上可能失真？](#detail-section-12)
  - [Q03 · 如何试用并减少语言相关误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：准备在 WSL 跑长任务，需要先核对主机电源状态。

使用 Windows 设置和原生 powercfg。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 电源状态 | 判断是否需要复核长任务运行条件 | 依赖语言与本机状态，睡眠读取只查 AC |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop、PowerShell 与 powercfg | 必需 | 读取 Windows 电源设置 | 无法调用或无法解析 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认测试主机与供电模式 | interop 可用 |
| 对照 | 用户查方案、电池与休眠 | 核对原命令和 Windows 设置 |
| 退出 | 用户回原生设置 | 按实际策略判断任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认系统语言与工具 | 需 Windows 主机 |
| 持续 | 采集开销未知 | 核对当前供电与设置 | 睡眠读数限 AC |
| 失败 | 排查耗时未知 | 读取原始 powercfg 输出 | 区分无数据与不支持 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 电源诊断 | 会话内显示多类线索 | 真实休眠判断与节时 |

> **思考**：[Q02](#research-q02) 文本解析依赖英文，休眠布尔结果及电池空值需要回查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 Windows 电源线索放入 WSL 的当前工作会话。

[Q02](#research-q02) 文本匹配不是跨语言协议，休眠出现字样只说明命中了字符串。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 文本解析依赖英文，休眠布尔结果及电池空值需要回查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试机核对 AC、语言和无电池情况。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认查询脚本，真实电源行为和语言兼容待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/power-exec.js、lib/power.js、index.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 Windows、PowerShell 或 DSH。
- 下一步：比对中英系统、无电池、非零退出和休眠可用性。

**分析版本**

- **仓库**：[173787247/dsh-wsl-power](https://github.com/173787247/dsh-wsl-power)
- **版本号**：0.1.0（[固定提交 f2ac258](https://github.com/173787247/dsh-wsl-power/tree/f2ac258b917742a8f7561a5d957853893d5006ef)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 独立标记不支持和解析失败，比较跨语言误判。

比对中英系统、无电池、非零退出和休眠可用性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 113 | — | — | 401 |
| .js | source | 4 | 215 | 181 | 12 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 用户能否从 DSH 查阅 Windows 电源线索并分辨未知设置？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何从 WSL 检查长任务的主机电源条件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

准备长任务时，可从 DSH 查看 Windows 活动电源方案、首块电池状态和交流供电睡眠设置。相比切到 Windows 分别执行 powercfg 与电池查询，插件把线索放进当前会话。它不设置方案，且只查询 AC 待机值，不能据此预测拔电后的行为。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/README.md#L3-L12)

作者范围。

<details>
<summary>查看原文（10行）</summary>

````text
DeepSeek Harness plugin: Windows power state from WSL: active power plan, battery status and sleep settings.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-power
````

</details>

**依据 2 · 源码核查**：[lib/power-exec.js:22-44](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power-exec.js#L22-L44)

实际电源和电池探针。

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

**依据 3 · 源码核查**：[lib/power.js:20-28](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power.js#L20-L28)

展示 AC 而非 DC。

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
```

#### 缺口

- 未对照真实电源转换
  **影响**：无法预测任务是否被休眠打断
  **进一步探讨**：比较接电、拔电和休眠策略样例

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 电源方案与休眠解析在哪些机器上可能失真？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

PowerShell 调用 /getactivescheme、可选 /list、/query 和 /a；列表解析硬编码 Power Scheme GUID 英文，睡眠查找 Current AC Power Setting Index，非英语输出可能找不到值。休眠用 /a 全文匹配 Hibernate 字样，并没有分段辨别可用与不可用条目。电池查询失败被吞掉，与没有电池一样返回 null；因此空表、休眠布尔值或无电池都应复核原始命令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/power-exec.js:24-44](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power-exec.js#L24-L44)

英文文本匹配、错误吞掉和休眠推断。

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

**依据 2 · 源码核查**：[lib/power.js:4-11](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power.js#L4-L11)

规范化未知状态。

```text
export function normalize(raw) {
  return ((raw) => ({
      plan: String(raw.plan ?? "").trim(),
      plans: (raw.plans || []).map((p) => ({ guid: String(p.guid ?? ""), name: String(p.name ?? ""), active: Boolean(p.active) })),
      battery: raw.battery ? { charge: num(raw.battery.charge), status: num(raw.battery.status) } : null,
      sleepAcSeconds: raw.sleepAcSeconds === null || raw.sleepAcSeconds === undefined ? null : num(raw.sleepAcSeconds),
      hibernateAvailable: raw.hibernateAvailable === null || raw.hibernateAvailable === undefined ? null : Boolean(raw.hibernateAvailable),
    }))(raw ?? {});
```

**依据 3 · 源码核查**：[lib/power.js:20-28](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power.js#L20-L28)

读者可见解释。

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
```

#### 缺口

- 缺少不同语言和硬件的真实输出
  **影响**：不能将休眠和方案空值作为确定诊断
  **进一步探讨**：用中英系统和无电池设备做原始输出对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并减少语言相关误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先在支持 Windows interop 的测试 WSL 主机检查 PowerShell 与 powercfg 可用性，与 Windows 原命令及设置对照。若结果不符或需要更改策略，退回 Windows 管理工具。可验证对 /a 输出显式区分可用、不可用和不可解析，使用中英文本及命令失败样例比较误判和维护量。若误判不减或语言覆盖维护过重，则弃用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:8-33](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/index.js#L8-L33)

Host 注册与 WSL 门槛。

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

**依据 2 · 源码核查**：[lib/power-exec.js:37-44](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/power-exec.js#L37-L44)

当前解析基线。

```text
$sleep = $null
try {
  $v = (powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE 2>$null | Select-String 'Current AC Power Setting Index' | Select-Object -First 1)
  if ($v) { $sleep = [Convert]::ToInt32(($v -split ':')[-1].Trim(), 16) }
} catch {}
$hib = $null
try { $hib = ((powercfg /a 2>$null) -join ' ') -match 'Hibernate' } catch {}
ConvertTo-Json -Compress -Depth 4 @{ plan = "$plan"; plans = @($plans); battery = $bat; sleepAcSeconds = $sleep; hibernateAvailable = $hib }`)(a);
```

**依据 3 · 源码核查**：[lib/wsl-host.js:21-41](https://github.com/173787247/dsh-wsl-power/blob/f2ac258b917742a8f7561a5d957853893d5006ef/lib/wsl-host.js#L21-L41)

检测与调用。

<details>
<summary>查看原文（21行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

</details>

#### 缺口

- 未实测宿主和解析替代方案
  **影响**：试用开销和可靠性未知
  **进一步探讨**：以不同系统语言和权限的测试主机验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
