# dsh-wsl-eventlog

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d8f4847](https://github.com/173787247/dsh-wsl-eventlog/tree/d8f48479c2ac445e7cacb2e88cf0b04251eed187)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-eventlog)
<!-- END META -->

> **功能**：从 WSL 查看 Windows 事件日志的有限条目与消息摘要。

> **亮点**：[Q01](#research-q01) 把近期错误采样接到当前 WSL 排障会话。

> **主要限制**：[Q02](#research-q02) 先限量再筛选，空样本不能排除真实事件。

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
  - [Q01 · Windows 事件日志适合支持什么排障动作？](#detail-section-11)
  - [Q02 · 筛选是在取样前还是取样后执行？](#detail-section-12)
  - [Q03 · 怎样试用并减少空样本误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：应用异常后需要快速定位 Windows 侧错误线索。

直接用 Windows 事件查看器或 Get-WinEvent。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 事件日志样本 | 辅助定位 Windows 异常 | 样本先限量，消息显示会缩短 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 与日志读取权限 | 必需 | 读取 Windows 事件 | 无法采集或空样本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选无敏感日志的测试机 | 确认读取权限 |
| 查询 | 用户比对事件及窗口 | 确认样本范围 |
| 退出 | 用户回事件查看器 | 查看原时间线 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置 interop 与权限 | 选择测试日志 |
| 持续 | 查询开销未知 | 复核样本和消息 | 结果可能截断 |
| 失败 | 排查耗时未知 | 直接确认日志及权限 | 空样本不等于无事件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 事件初筛 | 返回近期事件摘要 | 真实漏检与节时 |

> **思考**：[Q02](#research-q02) 先限量再筛选，空样本不能排除真实事件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把近期错误采样接到当前 WSL 排障会话。

[Q02](#research-q02) 时间和 provider 条件应用在有限样本之后。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 先限量再筛选，空样本不能排除真实事件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用测试事件对照样本与原始日志。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持查询顺序，实际权限、召回和收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/eventlog-exec.js、lib/eventlog.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查。未运行 Windows、日志查询、宿主或目标测试。
- 下一步：验证日志缺权限、低频 provider、长消息和跨时区。

**分析版本**

- **仓库**：[173787247/dsh-wsl-eventlog](https://github.com/173787247/dsh-wsl-eventlog)
- **版本号**：0.1.0（[固定提交 d8f4847](https://github.com/173787247/dsh-wsl-eventlog/tree/d8f48479c2ac445e7cacb2e88cf0b04251eed187)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 前置筛选并显式区别权限失败，比较漏检。

验证日志缺权限、低频 provider、长消息和跨时区。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 418 |
| .js | source | 4 | 224 | 188 | 13 | — |
| .js | test | 1 | 37 | 33 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-eventlog/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-eventlog/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-eventlog/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 排障者能否从 DSH 找到相关 Windows 事件并正确解释空样本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows 事件日志适合支持什么排障动作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL 服务故障后，维护者可从 DSH 查询 Windows System 等日志的近期错误，记录 provider、事件 ID 与消息，再回事件查看器检查详细时间线。相比切到 Windows，插件为同一会话提供受限样本；它不持续订阅，也不证明 Windows 事件与 WSL 故障有因果关系。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/README.md#L3-L7)

作者的按日志和等级取样定位。

```text
DeepSeek Harness plugin: Read recent Windows event log entries from WSL, by log name and level.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)
```

**依据 2 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog-exec.js#L22-L32)

事件字段与查询形态。

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

**依据 3 · 源码核查**：[lib/eventlog.js:19-24](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog.js#L19-L24)

文本摘要。

```text
  return ((v) => {
      const l = [`win_eventlog ok=${v.ok} entries=${(v.entries || []).length}`];
      for (const e of v.entries || []) l.push(`  ${e.time.slice(0, 19)} [${e.level}] ${e.provider}(${e.id}) ${e.message.slice(0, 90)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
```

#### 缺口

- 未对照实际事故
  **影响**：无法判断相关事件召回和节时
  **进一步探讨**：对已知错误事件和原生查看器做时间线对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 筛选是在取样前还是取样后执行？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Get-WinEvent 只把 log 和 level 放进 FilterHashtable，并先用 MaxEvents 取样，随后才按 provider 和时间二次过滤。若目标 provider 的匹配排在样本外，返回空不能证明时间窗内没有该事件。SilentlyContinue 压制部分错误，空 stdout 又按空对象解析。消息脚本按 300 或 8000 字符截断，工具格式进一步只显示前 90 字符并省略时区部分，不能据此复原原始记录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog-exec.js#L22-L32)

MaxEvents、过滤顺序与消息截取。

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

**依据 2 · 源码核查**：[lib/eventlog-exec.js:39-59](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog-exec.js#L39-L59)

参数限幅和解析。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/eventlog.js:4-24](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog.js#L4-L24)

空结果及二次投影。

<details>
<summary>查看原文（21行）</summary>

```text
export function normalize(raw) {
  return ((raw) => ({
      entries: (raw.entries || []).map((e) => ({
        time: String(e.time ?? ""), level: String(e.level ?? ""), provider: String(e.provider ?? ""),
        id: num(e.id), message: String(e.message ?? ""),
      })),
    }))(raw ?? {});
}

// Dispatch on the shape of the result rather than making the caller say which
// formatter to use: a result carries either `detail`, or `subkeys`, or neither.
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

#### 缺口

- 未测试日志读取权限、时区和时间查询解析
  **影响**：不能确认空列表来源及边界覆盖
  **进一步探讨**：生成混合 provider 的测试事件并覆盖拒绝和时区差异

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用并减少空样本误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在有 Windows interop 的测试主机，用不含敏感消息的日志验证。先用原生 Get-WinEvent 核对 provider、时间与权限，空样本或不完整时立即回原件。可将 provider 和时间作为原生过滤条件前置，并分开标记查询失败和无匹配，比较相同事件集的召回率、误判及耗时，若性能或准确性无改善则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-33](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/index.js#L17-L33)

宿主与错误入口。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/eventlog-exec.js:22-32](https://github.com/173787247/dsh-wsl-eventlog/blob/d8f48479c2ac445e7cacb2e88cf0b04251eed187/lib/eventlog-exec.js#L22-L32)

当前后置过滤基线。

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

- 无真实主机及替代实现对照
  **影响**：接入与改法价值未知
  **进一步探讨**：用大量非目标事件夹杂少量目标事件复核

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
