# dsh-wsl-service

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6dfdc4a](https://github.com/173787247/dsh-wsl-service/tree/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-service)
<!-- END META -->

> **实现功能**：给 WSL 中的 DSH Agent 提供 Windows 服务列表与单服务详情只读工具。

> **核心亮点**：把 Windows 服务元数据带进 WSL Agent 对话，省手工跨系统查询。详见[Q01](#research-q01)。

> **风险与缺陷**：详情包含系统账户/路径，权限由宿主决定；全量枚举可能在服务多时变慢。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · Windows 服务状态工具适合怎样的 WSL 排障？](#detail-section-11)
  - [Q02 · 列表、详情、过滤和输出截断如何实现？](#detail-section-12)
  - [Q03 · 服务详情暴露哪些系统元数据？](#detail-section-13)
  - [Q04 · 一次调用的成本和超时边界是什么？](#detail-section-14)
  - [Q05 · 怎样验证部署而不误把状态当处理结果？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者跨 WSL/Windows 排查服务运行状态和启动方式；不负责启停。详见[Q01](#research-q01)。

手工 PowerShell/Get-Service 已可查询；Agent 工具简化跨系统交互但要审结果暴露。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 服务列表 | 排障导航 | limit 不限全量枚举 |
| 单项详情 | 查路径/依赖 | 敏感系统元数据 |
| WSL 门控 | 环境识别 | 无 Windows 原生支持 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | 注册 Agent 工具 | 无入口 |
| WSL/Windows PowerShell | 必需 | 跨系统服务查询 | 非 WSL 失败 |
| Windows Service/CIM 权限 | 必需 | 列表/详情字段 | 可能失败/字段缺失 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | WSL web profile 加包 | win_services 可见 |
| 列表 | 无参/按 state 查询 | 看 listed 与 total |
| 详情 | 按 name/detail 查询 | 核账户/路径敏感性 |
| 对照 | Windows 服务管理器复核 | 以实时状态处置 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH WSL/Windows Interop | profile 加包 | 兼容未测 |
| 查询 | PowerShell/CIM 全量枚举 | 核筛选/列表限制 | 大机器时延未知 |
| 结果 | 服务路径/账户可出现在对话 | 审敏感字段 | 宿主权限未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 列表/状态 | Get-Service/过滤 | 实际实时准确性 |
| 服务详情 | 路径/依赖/PID | 宿主授权边界 |
| 只读 | 无启停调用 | 所有环境权限效果 |

> **思考**：详情包含系统账户/路径，权限由宿主决定；全量枚举可能在服务多时变慢。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 服务元数据带进 WSL Agent 对话，省手工跨系统查询。详见[Q01](#research-q01)。

把 Windows 服务元数据带进 WSL Agent 对话，省手工跨系统查询。详见[Q01](#research-q01)。

输入单引号转义和结构化输出可借鉴；全量查询成本与详情敏感字段需控。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

详情包含系统账户/路径，权限由宿主决定；全量枚举可能在服务多时变慢。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人本机 WSL 排障可观察试用；共享环境先核工具授权和详情字段。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核只读查询与转义；limit 只限返回而非初始枚举，详情暴露账号/二进制路径；目标 WSL 未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/service.js、lib/service-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/service.js、lib/service-exec.js、lib/wsl-host.js 与包声明；未执行目标 PowerShell/WSL。旧 META 仅复用。
- 下一步：目标 WSL 测列表/详情/非 WSL、非英文服务、400+条截断、慢 PowerShell 超时及工具权限。

**分析版本**

- **仓库**：[173787247/dsh-wsl-service](https://github.com/173787247/dsh-wsl-service)
- **版本号**：0.1.0（[固定提交 6dfdc4a](https://github.com/173787247/dsh-wsl-service/tree/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为按名服务端查询、分页/时间戳和敏感字段按需返回。详见[Q05](#research-q05)。

目标 WSL 测列表/详情/非 WSL、非英文服务、400+条截断、慢 PowerShell 超时及工具权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 117 | — | — | 424 |
| .js | source | 4 | 257 | 221 | 12 | — |
| .js | test | 1 | 36 | 32 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-service/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 中读取 Windows 服务状态是否准确、只读且输出范围可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 服务状态工具适合怎样的 WSL 排障？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

win_services 让运行在 WSL 中的 DSH Agent 列出 Windows 服务、按运行状态筛选或按名称查看细节，用于跨 WSL/Windows 的本机故障定位。源码只调用 Get-Service/Get-CimInstance/Get-Service 的依赖关系读取路径，无 Start/Stop-Service 或修改服务调用；它不能代替服务修复、日志分析或 Windows 管理权限。作者的兼容版本与 WSL 实时可用性本轮未独立验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-32](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/README.zh.md#L3-L32)

作者只读状态/场景说明

<details>
<summary>查看原文（30行）</summary>

````text
> 从 WSL 读取 Windows 服务状态：列出服务、按名查看单个服务。

DeepSeek Harness 插件：Read Windows service state from WSL: list services and inspect one by name.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-service
```

## 用法

```
win_services                          # all services
win_services state=running limit=20
win_services name=Spooler             # one service
```

## 说明

Read-only: this plugin lists and inspects services, it does not start or stop them.
`total` counts services matching the filter, which can exceed `listed`.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。
````

</details>

**依据 2 · 源码核查**：[index.js:5-36](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/index.js#L5-L36)

WSL 门控与单工具注册

<details>
<summary>查看原文（32行）</summary>

```text
export const name = "dsh-wsl-service";
export const inject = ["tools", "systemPrompt"];

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
    },
    presentCall: () => ({ card: "generic", title: "win_services" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_services", content: result?.content }),
```

</details>

**依据 3 · 源码核查**：[lib/service-exec.js:22-42](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L22-L42)

PowerShell 仅读服务命令

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

- 目标 WSL Interop/Windows 权限下能列哪些服务未测
  **影响**：不能把只读状态视为修复能力
  **进一步探讨**：目标 WSL 低权限/管理员对照查服务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 列表、详情、过滤和输出截断如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具参数接受 name/state/limit/detail；limit 用 clamp 限1–400，默认40。列表 PowerShell 先 Get-Service，再按名称/显示名或状态过滤，Select-Object -First N 返回记录，同时 total 统计筛选后全部；详情按 name 在 Win32_Service 查状态、启动模式、登录账户、PID、二进制路径与依赖关系。值插入 PowerShell 时采用单引号包裹并把单引号成对转义，减小直接注入风险。结果 JSON 化并转为文本；无分页游标，超过限制需缩窄过滤。

#### 证据与依据

**依据 1 · 源码核查**：[lib/service.js:28-85](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service.js#L28-L85)

输入/输出结构与详情字段

<details>
<summary>查看原文（58行）</summary>

```text
export function parameters() {
  return {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "description": "Inspect one service by name (optional)."
    },
    "state": {
      "type": "string",
      "description": "Filter: running, stopped, or all (default all)."
    },
    "limit": {
      "type": "number",
      "description": "Max services to list (default 40, max 400)."
    },
    "detail": {
      "type": "boolean",
      "description": "Return one service in full: logon account, process id, binary path and dependencies. Requires name."
    }
  }
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

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
    })(raw ?? {});
}
```

</details>

**依据 2 · 源码核查**：[lib/service-exec.js:4-13](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L4-L13)

单引号转义与限制

<details>
<summary>查看原文（10行）</summary>

```text
/** The kit's one escaping rule: single-quote the value, doubling any apostrophe. */
function esc(s) {
  return "'" + String(s ?? "").replace(/'/g, "''") + "'";
}

function clamp(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}
```

</details>

**依据 3 · 源码核查**：[lib/service-exec.js:22-43](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L22-L43)

列表/详情 PowerShell

<details>
<summary>查看原文（22行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[lib/service-exec.js:45-77](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L45-L77)

执行/JSON 解析

<details>
<summary>查看原文（33行）</summary>

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
}
```

</details>

#### 缺口

- 目标 PowerShell 输出编码/长服务名/巨大服务集未测
  **影响**：不能保证所有服务稳定列举或时间固定
  **进一步探讨**：目标机器测400+服务、非英文显示名和详情

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 服务详情暴露哪些系统元数据？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

detail=true 需要 name，返回服务运行账户、进程 id、二进制可执行路径以及被依赖/依赖的服务名；这些信息比普通列表更敏感，可能揭示本机用户/安装路径。源码未对这些字段脱敏，也没有逐字段权限门控，是否能被 Agent/对话查看取决于宿主工具调用授权。这里没有读取凭据或修改服务的证据，但不能称结果对任何使用者都无敏感性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/service.js:43-48](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service.js#L43-L48)

详情参数说明

```text
      "description": "Max services to list (default 40, max 400)."
    },
    "detail": {
      "type": "boolean",
      "description": "Return one service in full: logon account, process id, binary path and dependencies. Requires name."
    }
```

**依据 2 · 源码核查**：[lib/service.js:57-84](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service.js#L57-L84)

字段规范化及文本呈现

<details>
<summary>查看原文（28行）</summary>

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
    })(raw ?? {});
```

</details>

**依据 3 · 源码核查**：[lib/service-exec.js:24-34](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L24-L34)

Windows 系统字段读取

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[index.js:17-36](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/index.js#L17-L36)

工具结果发送 Agent

<details>
<summary>查看原文（20行）</summary>

```text
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
    },
    presentCall: () => ({ card: "generic", title: "win_services" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_services", content: result?.content }),
```

</details>

#### 缺口

- 目标宿主授权和 Windows 权限视图未核
  **影响**：不宜在共享对话展示未经审查的二进制路径/账户
  **进一步探讨**：目标权限策略与结果脱敏/角色分层检查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次调用的成本和超时边界是什么？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

列表从 Get-Service 完整读取后才在 PowerShell 内筛选/Select-Object，total 还对筛选集计数；limit 只限制返回条目，不限制查询全部服务的初始成本。详情使用 Get-CimInstance Win32_Service 全量后 Where-Object 按名称过滤，再查两方向依赖，可能比直接按名查询更慢。外层工具 timeoutMs 配置默认30秒，执行层将其钳在1–120秒；实际 Windows Interop 启动和超时是否同步由宿主/PowerShell 决定。无缓存或批量详情能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/index.js#L25-L30)

工具超时及执行

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
```

**依据 2 · 源码核查**：[lib/service-exec.js:22-42](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L22-L42)

全量查询后筛选

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

**依据 3 · 源码核查**：[lib/service-exec.js:64-76](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L64-L76)

执行层超时钳位

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/wsl-host.js#L34-L41)

PowerShell 执行超时

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

- 目标大机器、CIM 速度和宿主中断语义未测
  **影响**：不能把 limit 看成服务端工作量上限
  **进一步探讨**：大量服务/慢 WSL Interop 的耗时与超时测量

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证部署而不误把状态当处理结果？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

安装后在 WSL 会话先按 README 试无参列表、state=running、name=Spooler，再对照 Windows Services/PowerShell 的同一时间状态；非 WSL 会返回明确错误。total 可大于 listed，自动化结论应保留采样限制，并核详情路径是否可向 Agent 展示。改进方向是服务端按名查询/分页、详情敏感字段按需返回和结果时间戳；均未实现。对个人本机排障可观察试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-40](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/README.zh.md#L11-L40)

作者安装/用法/只读与测试声明

<details>
<summary>查看原文（30行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-service
```

## 用法

```
win_services                          # all services
win_services state=running limit=20
win_services name=Spooler             # one service
```

## 说明

Read-only: this plugin lists and inspects services, it does not start or stop them.
`total` counts services matching the filter, which can exceed `listed`.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。
````

</details>

**依据 2 · 源码核查**：[index.js:27-32](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/index.js#L27-L32)

非 WSL 失败

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
```

**依据 3 · 源码核查**：[lib/service-exec.js:35-42](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service-exec.js#L35-L42)

total/limit 语义

```text
      : `
$svc = Get-Service
if (${esc(a.name)}) { $svc = $svc | Where-Object { $_.Name -eq ${esc(a.name)} -or $_.DisplayName -eq ${esc(a.name)} } }
elseif (${esc(a.state)}) { $svc = $svc | Where-Object { $_.Status -eq ${esc(a.state)} } }
$list = $svc | Select-Object -First ${a.limit} | ForEach-Object {
  @{ name = $_.Name; displayName = $_.DisplayName; status = "$($_.Status)"; startType = "$($_.StartType)" }
}
ConvertTo-Json -Compress -Depth 4 @{ services = @($list); total = @($svc).Count }`))(a);
```

**依据 4 · 源码核查**：[lib/service.js:57-84](https://github.com/173787247/dsh-wsl-service/blob/6dfdc4a18e7155fe0c4bb0bcb75283b879bc3727/lib/service.js#L57-L84)

详情可见字段

<details>
<summary>查看原文（28行）</summary>

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
    })(raw ?? {});
```

</details>

#### 缺口

- 安装成功率、状态变化时效和改进收益未测
  **影响**：不能用旧状态或截断列表替代实时处置
  **进一步探讨**：目标 WSL 安装、Windows 对照与敏感字段复核

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
