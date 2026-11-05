# dsh-wsl-service

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[255c1cd](https://github.com/173787247/dsh-wsl-service/tree/255c1cd3f8d2f4a78832e03de0ca82beda391aa4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-service)
<!-- END META -->

> **功能**：从 WSL 查看 Windows 服务列表、状态、启动配置和依赖。

> **亮点**：[Q01](#research-q01) 把 Windows 服务状态与依赖线索放进 WSL 排障会话。

> **主要限制**：[Q02](#research-q02) 列表与详情名称语义不同，读取依赖失败也可能显示为空。

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
  - [Q01 · Windows 服务查询在 WSL 排障中能提供什么？](#detail-section-11)
  - [Q02 · 列表和详情怎样筛选，失败会留下什么结果？](#detail-section-12)
  - [Q03 · 如何试用并区分无依赖与探测失败？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 应用依赖 Windows 后台服务，需定位哪一项异常。

直接在 Windows 查看服务管理器或 PowerShell。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 服务与依赖快照 | 辅助定位 Windows 后台服务异常 | 受主机权限和部分查询失败影响 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与 PowerShell | 必需 | 执行 Windows 查询 | 互操作或权限失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择无敏感的测试服务 | 记录真实服务名 |
| 核对 | 用户比对列表及详情 | 验证依赖空值 |
| 退出 | 用户回 Windows 服务工具 | 按实际状态判断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 准备主机和服务 | 需验证权限 |
| 持续 | 查询资源未知 | 复核实际筛选与依赖 | 避免将空结果当不存在 |
| 失败 | 排障时间未知 | 回 CIM 和 Get-Service | 单项错误可能被吞 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 服务诊断 | 输出有限服务属性和依赖 | 实际故障定位节时 |

> **思考**：[Q02](#research-q02) 列表与详情名称语义不同，读取依赖失败也可能显示为空。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把 Windows 服务状态与依赖线索放进 WSL 排障会话。

[Q02](#research-q02) CIM 详情与依赖查询是分开执行，部分失败可保留其他结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 列表与详情名称语义不同，读取依赖失败也可能显示为空。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先通过测试列表核对真实 Name，再查询详情和依赖。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认查询和投影。真实权限、服务行为和收益待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/service-exec.js、lib/service.js、index.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未运行 PowerShell、Windows 服务、DSH 或目标测试。
- 下一步：测试精确名称、显示名、缺权限、依赖空值和截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-service](https://github.com/173787247/dsh-wsl-service)
- **版本号**：0.1.0（[固定提交 255c1cd](https://github.com/173787247/dsh-wsl-service/tree/255c1cd3f8d2f4a78832e03de0ca82beda391aa4)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 逐项标注依赖读取状态及筛选条件，比较误判。

测试精确名称、显示名、缺权限、依赖空值和截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 117 | — | — | 424 |
| .js | source | 4 | 257 | 221 | 12 | — |
| .js | test | 1 | 36 | 32 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-service/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 操作者能否从 DSH 核对 Windows 服务状态及依赖？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 服务查询在 WSL 排障中能提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当 WSL 应用依赖 Windows 后台服务时，操作者可先按状态或名称查看服务，再按实际服务名读取 PID、启动类型、账户、路径与依赖。相较切到 Windows 服务管理器，这提供当前 DSH 会话里的原生状态线索。状态只说明服务管理器读数，应用是否健康仍需原生验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/README.md#L3-L12)

作者的只读服务用途。

<details>
<summary>查看原文（10行）</summary>

````text
DeepSeek Harness plugin: Read Windows service state from WSL: list services and inspect one by name.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-service
````

</details>

**依据 2 · 源码核查**：[lib/service-exec.js:22-42](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/service-exec.js#L22-L42)

列表和详情查询。

<details>
<summary>查看原文（21行）</summary>

```text
export function script(a) {
  return ((a) => (a.detail
      ? `
$one = Get-CimInstance Win32_Service | Where-Object { $_.Name -eq ${esc(a.name)} } | Select-Object -First 1
if ($null -eq $one) { ConvertTo-Json -Compress @{ error = 'service not found' }; exit }
$deps = @(); $need = @()
try { $deps = @((Get-Service -Name ${esc(a.name)}).DependentServices | ForEach-Object { $_.Name }) } catch {}
try { $need = @((Get-Service -Name ${esc(a.name)}).ServicesDependedOn | ForEach-Object { $_.Name }) } catch {}
ConvertTo-Json -Compress -Depth 4 @{ detail = @{
  name = $one.Name; displayName = $one.DisplayName; status = "$($one.State)"; startType = "$($one.StartMode)"
  logOnAs = $one.StartName; processId = $one.ProcessId; binaryPath = $one.PathName
  dependsOn = $need; dependedOnBy = $deps
} }`
      : `
$svc = Get-Service
if (${esc(a.name)}) { $svc = $svc | Where-Object { $_.Name -eq ${esc(a.name)} -or $_.DisplayName -eq ${esc(a.name)} } }
elseif (${esc(a.state)}) { $svc = $svc | Where-Object { $_.Status -eq ${esc(a.state)} } }
$list = $svc | Select-Object -First ${a.limit} | ForEach-Object {
  @{ name = $_.Name; displayName = $_.DisplayName; status = "$($_.Status)"; startType = "$($_.StartType)" }
}
ConvertTo-Json -Compress -Depth 4 @{ services = @($list); total = @($svc).Count }`))(a);
```

</details>

#### 缺口

- 未对照实际服务故障
  **影响**：无法确认节时或故障定位质量
  **进一步探讨**：用已知停止、运行与依赖失败样例对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 列表和详情怎样筛选，失败会留下什么结果？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

列表在有 name 时按 Name 或 DisplayName 精确匹配，否则才按 state 筛选，两项同时给出时不会叠加。详情的 CIM 查询只匹配 Name，显示名可能在列表命中却无法查详情。两组依赖由 Get-Service 分别取，异常 catch 后保留空数组，空不能证明没有依赖。列表最多返回配置输入夹在 1 到 400 的数量，同时有 total，单次结果仍可能不全。命令只读取服务，无写入口。详情会把启动账户与二进制路径带入结构化结果，应先确认披露范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/service-exec.js:22-42](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/service-exec.js#L22-L42)

筛选优先级、详情与依赖回退。

<details>
<summary>查看原文（21行）</summary>

```text
export function script(a) {
  return ((a) => (a.detail
      ? `
$one = Get-CimInstance Win32_Service | Where-Object { $_.Name -eq ${esc(a.name)} } | Select-Object -First 1
if ($null -eq $one) { ConvertTo-Json -Compress @{ error = 'service not found' }; exit }
$deps = @(); $need = @()
try { $deps = @((Get-Service -Name ${esc(a.name)}).DependentServices | ForEach-Object { $_.Name }) } catch {}
try { $need = @((Get-Service -Name ${esc(a.name)}).ServicesDependedOn | ForEach-Object { $_.Name }) } catch {}
ConvertTo-Json -Compress -Depth 4 @{ detail = @{
  name = $one.Name; displayName = $one.DisplayName; status = "$($one.State)"; startType = "$($one.StartMode)"
  logOnAs = $one.StartName; processId = $one.ProcessId; binaryPath = $one.PathName
  dependsOn = $need; dependedOnBy = $deps
} }`
      : `
$svc = Get-Service
if (${esc(a.name)}) { $svc = $svc | Where-Object { $_.Name -eq ${esc(a.name)} -or $_.DisplayName -eq ${esc(a.name)} } }
elseif (${esc(a.state)}) { $svc = $svc | Where-Object { $_.Status -eq ${esc(a.state)} } }
$list = $svc | Select-Object -First ${a.limit} | ForEach-Object {
  @{ name = $_.Name; displayName = $_.DisplayName; status = "$($_.Status)"; startType = "$($_.StartType)" }
}
ConvertTo-Json -Compress -Depth 4 @{ services = @($list); total = @($svc).Count }`))(a);
```

</details>

**依据 2 · 源码核查**：[lib/service-exec.js:45-76](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/service-exec.js#L45-L76)

数量限制和错误返回。

<details>
<summary>查看原文（32行）</summary>

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


  if (a.detail && !a.name) return { ok: false, error: "detail requires name" };
  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  if (a.detail) {
    if (!a.name) return { ok: false, error: "detail requires name" };
    const { stdout } = await runPowerShell(script(a), { timeoutMs });
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, error: String(raw.error) };
    return { ok: true, ...normalizeDetail(raw) };
  }
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

</details>

**依据 3 · 源码核查**：[lib/service.js:57-83](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/service.js#L57-L83)

详情字段及显示。

<details>
<summary>查看原文（27行）</summary>

```text
export function normalizeDetail(raw) {
  return ((raw) => {
      const d = raw?.detail ?? {};
      return {
        detail: {
          name: String(d.name ?? ""), displayName: String(d.displayName ?? ""),
          status: String(d.status ?? ""), startType: String(d.startType ?? ""),
          logOnAs: String(d.logOnAs ?? ""), processId: num(d.processId),
          binaryPath: String(d.binaryPath ?? ""),
          dependsOn: (d.dependsOn ?? []).map(String),
          dependedOnBy: (d.dependedOnBy ?? []).map(String),
        },
      };
    })(raw ?? {});
}

export function formatDetail(raw) {
  return ((v) => {
      const d = v.detail ?? {};
      const l = [`win_services ok=${v.ok} detail=${d.name}`, `  ${d.displayName}  [${d.status} / ${d.startType}]`];
      if (d.logOnAs) l.push(`  runs as: ${d.logOnAs}`);
      if (d.processId) l.push(`  process id: ${d.processId}`);
      if (d.binaryPath) l.push(`  binary: ${d.binaryPath}`);
      if ((d.dependsOn ?? []).length) l.push(`  depends on: ${d.dependsOn.join(", ")}`);
      if ((d.dependedOnBy ?? []).length) l.push(`  depended on by: ${d.dependedOnBy.join(", ")}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
```

</details>

#### 缺口

- 未验收权限不足、别名和 CIM 部分失败
  **影响**：不能判断空依赖是否真实
  **进一步探讨**：用不同权限用户和名称输入核对实际服务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并区分无依赖与探测失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

用支持 interop 的测试 WSL 主机及无敏感路径的服务对照 Get-Service，先由列表获得真实 Name，再查详情。发现账户、权限或依赖结果不明确即回 Windows 原生诊断。可让每个依赖读取独立标记状态，并在列表回显实际应用的筛选条件。用无依赖和权限失败的同一服务对照误判、运行耗时与输出体积，收益不足则弃用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:8-33](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/index.js#L8-L33)

注册和 WSL 前提。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_services",
    order: 215,
    text: "Use win_services for WSL/Windows interop: Read Windows service state from WSL: list services and inspect one by name.",
  });

  ctx.tools.register({
    name: "win_services",
    description: "Read Windows service state from WSL: list services and inspect one by name.",
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

**依据 2 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/wsl-host.js#L34-L41)

PowerShell 接线。

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

**依据 3 · 源码核查**：[lib/service-exec.js:25-38](https://github.com/173787247/dsh-wsl-service/blob/255c1cd3f8d2f4a78832e03de0ca82beda391aa4/lib/service-exec.js#L25-L38)

原有失败和筛选。

<details>
<summary>查看原文（14行）</summary>

```text
$one = Get-CimInstance Win32_Service | Where-Object { $_.Name -eq ${esc(a.name)} } | Select-Object -First 1
if ($null -eq $one) { ConvertTo-Json -Compress @{ error = 'service not found' }; exit }
$deps = @(); $need = @()
try { $deps = @((Get-Service -Name ${esc(a.name)}).DependentServices | ForEach-Object { $_.Name }) } catch {}
try { $need = @((Get-Service -Name ${esc(a.name)}).ServicesDependedOn | ForEach-Object { $_.Name }) } catch {}
ConvertTo-Json -Compress -Depth 4 @{ detail = @{
  name = $one.Name; displayName = $one.DisplayName; status = "$($one.State)"; startType = "$($one.StartMode)"
  logOnAs = $one.StartName; processId = $one.ProcessId; binaryPath = $one.PathName
  dependsOn = $need; dependedOnBy = $deps
} }`
      : `
$svc = Get-Service
if (${esc(a.name)}) { $svc = $svc | Where-Object { $_.Name -eq ${esc(a.name)} -or $_.DisplayName -eq ${esc(a.name)} } }
elseif (${esc(a.state)}) { $svc = $svc | Where-Object { $_.Status -eq ${esc(a.state)} } }
```

</details>

#### 缺口

- 未实测主机和提示方案
  **影响**：实际接入和查询开销未知
  **进一步探讨**：在隔离主机验证 interop、失败与详情字段

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
