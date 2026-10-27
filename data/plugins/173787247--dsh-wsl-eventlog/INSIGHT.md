# dsh-wsl-eventlog

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7b322da](https://github.com/173787247/dsh-wsl-eventlog/tree/7b322dacb89aef7efb3e28b66cf92451178f5e65)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-eventlog)
<!-- END META -->

> **功能**：从 WSL 通过 PowerShell 只读查询 Windows 事件日志的 Agent 工具。

> **亮点**：把 Windows 事件日志的初步查询暴露给 WSL 中的 Agent，参数和结果结构较简洁。详见[Q01](#research-q01)。

> **主要限制**：后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · Windows 事件日志工具能支持哪些 WSL 排障？](#detail-section-11)
  - [Q02 · 查询参数和消息内容如何处理？](#detail-section-12)
  - [Q03 · 提供者与时间过滤会不会漏掉应查事件？](#detail-section-13)
  - [Q04 · full 消息与实际 Agent 可见内容一致吗？](#detail-section-14)
  - [Q05 · 怎样用作可靠的只读初筛？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 用户初筛 Windows System/Application 等日志的严重事件；非完整审计。详见[Q01](#research-q01)。

Windows 事件查看器或手工 Get-WinEvent 可完整筛选；工具减少跨系统操作，但需复核漏检。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 事件初筛 | 查近况 | 最多200条且后过滤 |
| full 参数 | 更长原始消息 | render 仍仅90字符 |
| WSL 门控 | 限环境 | Windows 原生未支持 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | Agent 工具入口 | 无法使用 |
| WSL/Windows PowerShell | 必需 | Get-WinEvent | 非 WSL 失败 |
| Windows EventLog 权限 | 必需 | 读取各日志 | 日志缺失/失败 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | WSL profile 加包 | win_eventlog 可见 |
| 初筛 | log/level/count | 记录样本范围 |
| 复核 | provider/since 与 Windows 对照 | 空结果不直接排除 |
| 深查 | 检消息原文/权限 | 避免摘要漏关键 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH WSL/Windows PowerShell | profile 加包 | 兼容未测 |
| 查询 | 默认20、最多200条/30秒 | 放大/调整筛选 | 漏检与时延未知 |
| 结果 | 日志消息可能含敏感信息 | 人工复核/脱敏 | full 呈现不一致 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 严重度筛选 | Level=1..N | 完整检索 |
| 提供者/时间 | 后置过滤 | 不漏稀疏事件 |
| full 文本 | 执行层8000字符 | Agent 可见完整性 |

> **思考**：后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 事件日志的初步查询暴露给 WSL 中的 Agent，参数和结果结构较简洁。详见[Q01](#research-q01)。

PowerShell 转义/结构化字段可复用；MaxEvents/后过滤顺序和 render 截断应调整。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

后置过滤的空结果不能证明无事件；full 的实际呈现长度与执行层不一致。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只作本机日志初筛；空结果和 full 消息需与事件查看器复核。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核只读查询；provider/since 在 MaxEvents 后过滤会漏稀疏事件，full 结果文本仍被 format 截90字符；目标 WSL 未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/eventlog.js、lib/eventlog-exec.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/eventlog.js、lib/eventlog-exec.js 和包声明；未运行目标 WSL/PowerShell。旧 META 仅复用。
- 下一步：目标 WSL 测稀疏 provider、时间窗口、200条界限、full 消息 Agent 呈现和日志权限。

**分析版本**

- **仓库**：[173787247/dsh-wsl-eventlog](https://github.com/173787247/dsh-wsl-eventlog)
- **版本号**：0.1.0（[固定提交 7b322da](https://github.com/173787247/dsh-wsl-eventlog/tree/7b322dacb89aef7efb3e28b66cf92451178f5e65)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为源端过滤、分页/总量、full 渲染对齐和敏感字段控制。详见[Q05](#research-q05)。

目标 WSL 测稀疏 provider、时间窗口、200条界限、full 消息 Agent 呈现和日志权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 418 |
| .js | source | 4 | 224 | 188 | 13 | — |
| .js | test | 1 | 37 | 33 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-eventlog/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 事件日志查询能否完整表达过滤结果并保留排障所需消息？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 事件日志工具能支持哪些 WSL 排障？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

win_eventlog 让 DSH Agent 在 WSL 中读取 Windows 事件日志，默认 System、严重/错误等级及最多20条，也可按日志名、等级、提供者和最近分钟数过滤。它只查询 Get-WinEvent，没有清理/写入日志能力，适合排查系统服务或应用报错的第一轮线索；不是完整事件调查、告警或修复系统。作者声称的最低 DSH 与套件归属未在目标环境验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-31](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/README.zh.md#L3-L31)

作者场景/默认用法与只读口径

<details>
<summary>查看原文（29行）</summary>

````text
> 从 WSL 读取 Windows 事件日志，可按日志名与级别过滤。

DeepSeek Harness 插件：Read recent Windows event log entries from WSL, by log name and level.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-eventlog
```

## 用法

```
win_eventlog                              # System, errors+critical, 20 entries
win_eventlog log=Application level=3 count=50
```

## 说明

Reads by log name and minimum level. Level is 1 critical, 2 error, 3 warning,
4 information. Messages are truncated to 300 characters.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。
````

</details>

**依据 2 · 源码核查**：[index.js:5-36](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/index.js#L5-L36)

WSL 门控与工具注册

<details>
<summary>查看原文（32行）</summary>

```text
export const name = "dsh-wsl-eventlog";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_eventlog",
    order: 216,
    text: "Use win_eventlog for WSL/Windows interop: Read recent Windows event log entries from WSL, by log name and level.",
  });

  ctx.tools.register({
    name: "win_eventlog",
    description: "Read recent Windows event log entries from WSL, by log name and level.",
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
    presentCall: () => ({ card: "generic", title: "win_eventlog" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_eventlog", content: result?.content }),
```

</details>

**依据 3 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L22-L32)

PowerShell 只读 Get-WinEvent 查询

<details>
<summary>查看原文（11行）</summary>

```text
export function script(a) {
  return ((a) => `
$entries = Get-WinEvent -FilterHashtable @{ LogName = ${esc(a.log)}; Level = 1..${a.level} } -MaxEvents ${a.count} -ErrorAction SilentlyContinue
${a.provider ? `$entries = $entries | Where-Object { $_.ProviderName -eq ${esc(a.provider)} }` : ""}
${a.since ? `$cut = [datetime]::Parse(${esc(a.since)}); $entries = $entries | Where-Object { $_.TimeCreated -ge $cut }` : ""}
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
```

</details>

#### 缺口

- 目标 Windows 日志权限/事件来源覆盖未测
  **影响**：不能把无结果等同系统无故障
  **进一步探讨**：目标 WSL 对照事件查看器/PowerShell

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询参数和消息内容如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

PowerShell FilterHashtable 先用 LogName 与 Level=1..level、MaxEvents=count 取事件，然后可按 ProviderName 和 since 时间再过滤；level 钳1–5，count 钳1–200，sinceMinutes 上限30天，默认无时间限制。每条返回 time/level/provider/id/message；默认消息最多300字符，full 时在执行层最多8000字符。字符串参数经 PowerShell 单引号及引号翻倍转义，JSON 解析后结构化输出。真实日志时区/编码和长消息表现未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/eventlog.js:27-68](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog.js#L27-L68)

参数和 since 时间限制

<details>
<summary>查看原文（42行）</summary>

```text
export function parameters() {
  return {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "log": {
      "type": "string",
      "description": "Log name (default System)."
    },
    "level": {
      "type": "number",
      "description": "Minimum level: 1 critical, 2 error, 3 warning, 4 information (default 2)."
    },
    "count": {
      "type": "number",
      "description": "How many entries (default 20, max 200)."
    },
    "provider": {
      "type": "string",
      "description": "Only entries from this provider."
    },
    "sinceMinutes": {
      "type": "number",
      "description": "Only entries newer than this many minutes ago."
    },
    "full": {
      "type": "boolean",
      "description": "Return the whole message instead of the first 300 characters."
    }
  }
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

/** A log with no lower bound is a log you page through by guessing. */
export function sinceIso(minutes, now = Date.now()) {
  const n = Number(minutes);
  if (!Number.isFinite(n) || n <= 0) return null;
  return new Date(now - Math.min(Math.trunc(n), 43200) * 60_000).toISOString();
```

</details>

**依据 2 · 源码核查**：[lib/eventlog-exec.js:4-13](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L4-L13)

字符串转义/钳位

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

**依据 3 · 源码核查**：[lib/eventlog-exec.js:22-60](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L22-L60)

查询/过滤/消息截断/解析

<details>
<summary>查看原文（39行）</summary>

```text
export function script(a) {
  return ((a) => `
$entries = Get-WinEvent -FilterHashtable @{ LogName = ${esc(a.log)}; Level = 1..${a.level} } -MaxEvents ${a.count} -ErrorAction SilentlyContinue
${a.provider ? `$entries = $entries | Where-Object { $_.ProviderName -eq ${esc(a.provider)} }` : ""}
${a.since ? `$cut = [datetime]::Parse(${esc(a.since)}); $entries = $entries | Where-Object { $_.TimeCreated -ge $cut }` : ""}
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
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
  a.since = sinceIso(args?.sinceMinutes);


  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
}
```

</details>

#### 缺口

- 目标 Windows PowerShell 字符编码与日期解析未测
  **影响**：不能保证所有复杂事件字段完整
  **进一步探讨**：目标多语种/长消息/时区日志对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提供者与时间过滤会不会漏掉应查事件？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

脚本先 Get-WinEvent -MaxEvents count，再在返回的最新 N 条里按 provider 和 since 过滤。若目标提供者的最新事件排在全日志第 N+1 条之后，即使在 since 窗口内也会返回空；扩大 count 至多200仍可能漏更早匹配。过滤发生顺序使“无结果”只代表已取前 N 条中没有匹配，不能证明日志没有事件。应把能下推的过滤移进 FilterHashtable 或增加可分页游标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L22-L32)

MaxEvents 先于 provider/since

<details>
<summary>查看原文（11行）</summary>

```text
export function script(a) {
  return ((a) => `
$entries = Get-WinEvent -FilterHashtable @{ LogName = ${esc(a.log)}; Level = 1..${a.level} } -MaxEvents ${a.count} -ErrorAction SilentlyContinue
${a.provider ? `$entries = $entries | Where-Object { $_.ProviderName -eq ${esc(a.provider)} }` : ""}
${a.since ? `$cut = [datetime]::Parse(${esc(a.since)}); $entries = $entries | Where-Object { $_.TimeCreated -ge $cut }` : ""}
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
```

</details>

**依据 2 · 源码核查**：[lib/eventlog.js:40-50](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog.js#L40-L50)

count/provider/since 参数

<details>
<summary>查看原文（11行）</summary>

```text
    "count": {
      "type": "number",
      "description": "How many entries (default 20, max 200)."
    },
    "provider": {
      "type": "string",
      "description": "Only entries from this provider."
    },
    "sinceMinutes": {
      "type": "number",
      "description": "Only entries newer than this many minutes ago."
```

</details>

**依据 3 · 作者声明**：[README.zh.md:17-28](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/README.zh.md#L17-L28)

作者按日志/级别的用法

<details>
<summary>查看原文（12行）</summary>

````text
## 用法

```
win_eventlog                              # System, errors+critical, 20 entries
win_eventlog log=Application level=3 count=50
```

## 说明

Reads by log name and minimum level. Level is 1 critical, 2 error, 3 warning,
4 information. Messages are truncated to 300 characters.

````

</details>

#### 缺口

- 目标日志体量和提供者分布未测
  **影响**：容易把受限空集误作无故障
  **进一步探讨**：目标日志制造稀疏 provider 并与事件查看器对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · full 消息与实际 Agent 可见内容一致吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

执行层 full=true 把单条 Message 截为最多8000字符，默认300；但工具的 format 始终只把 message.slice(0,90) 拼进文本输出，index.js 的 output.render 调用 format，因此模型看到的呈现文本仍只有前90字符。结果对象内可能保留更长 message，具体宿主是否同时展示结构化值未核，不能称 Agent 通过 full 就获得完整消息。事件 Message 还可能包含路径、用户名或隐私文本，需限制工具授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/eventlog-exec.js:27-32](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L27-L32)

full 与默认截断长度

```text
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
```

**依据 2 · 源码核查**：[lib/eventlog.js:15-24](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog.js#L15-L24)

format 总截90字符

<details>
<summary>查看原文（10行）</summary>

```text
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_eventlog ok=${v.ok} entries=${(v.entries || []).length}`];
      for (const e of v.entries || []) l.push(`  ${e.time.slice(0, 19)} [${e.level}] ${e.provider}(${e.id}) ${e.message.slice(0, 90)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
```

</details>

**依据 3 · 源码核查**：[index.js:17-35](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/index.js#L17-L35)

工具 render/返回

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register({
    name: "win_eventlog",
    description: "Read recent Windows event log entries from WSL, by log name and level.",
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
    presentCall: () => ({ card: "generic", title: "win_eventlog" }),
```

</details>

**依据 4 · 源码核查**：[lib/eventlog.js:48-55](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog.js#L48-L55)

full 参数描述

```text
    "sinceMinutes": {
      "type": "number",
      "description": "Only entries newer than this many minutes ago."
    },
    "full": {
      "type": "boolean",
      "description": "Return the whole message instead of the first 300 characters."
    }
```

#### 缺口

- 宿主是否向模型附加原始结构化结果未核
  **影响**：排障可能缺关键尾部信息/敏感内容可能进入对话
  **进一步探讨**：目标宿主检查 full 输出与权限脱敏

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样用作可靠的只读初筛？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

在本机 WSL 安装后先查 System 最近错误，再用特定 LogName/level/count，对时间与 provider 有约束时与事件查看器同条件复核。记录 count 截断与“provider 后过滤”边界，不因空结果直接关单。改进可将 provider/since 放入源端 FilterHashtable、提供分页/总量、让 full 文本与返回值一致，并允许按需脱敏；这些未实现。部署成本主要是 PowerShell 查询时间与审查敏感日志，真实时延未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-40](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/README.zh.md#L11-L40)

作者安装/测试/依赖说明

<details>
<summary>查看原文（30行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-eventlog
```

## 用法

```
win_eventlog                              # System, errors+critical, 20 entries
win_eventlog log=Application level=3 count=50
```

## 说明

Reads by log name and minimum level. Level is 1 critical, 2 error, 3 warning,
4 information. Messages are truncated to 300 characters.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。

````

</details>

**依据 2 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog-exec.js#L22-L32)

查询边界

<details>
<summary>查看原文（11行）</summary>

```text
export function script(a) {
  return ((a) => `
$entries = Get-WinEvent -FilterHashtable @{ LogName = ${esc(a.log)}; Level = 1..${a.level} } -MaxEvents ${a.count} -ErrorAction SilentlyContinue
${a.provider ? `$entries = $entries | Where-Object { $_.ProviderName -eq ${esc(a.provider)} }` : ""}
${a.since ? `$cut = [datetime]::Parse(${esc(a.since)}); $entries = $entries | Where-Object { $_.TimeCreated -ge $cut }` : ""}
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
```

</details>

**依据 3 · 源码核查**：[lib/eventlog.js:15-24](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/lib/eventlog.js#L15-L24)

文本输出长度

<details>
<summary>查看原文（10行）</summary>

```text
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_eventlog ok=${v.ok} entries=${(v.entries || []).length}`];
      for (const e of v.entries || []) l.push(`  ${e.time.slice(0, 19)} [${e.level}] ${e.provider}(${e.id}) ${e.message.slice(0, 90)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
```

</details>

**依据 4 · 源码核查**：[index.js:25-32](https://github.com/173787247/dsh-wsl-eventlog/blob/7b322dacb89aef7efb3e28b66cf92451178f5e65/index.js#L25-L32)

工具超时/失败路径

```text
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
```

#### 缺口

- 目标日志查询耗时、分页改进效果未知
  **影响**：不能作为完整审计或自动结案依据
  **进一步探讨**：目标 WSL/Windows 实例做稀疏过滤/长消息/权限验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
