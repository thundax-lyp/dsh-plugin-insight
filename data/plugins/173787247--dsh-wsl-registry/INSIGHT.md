# dsh-wsl-registry

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[53be33c](https://github.com/173787247/dsh-wsl-registry/tree/53be33c998c3bf1c462e11551434d45d823def5b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-registry)
<!-- END META -->

> **功能**：从 WSL 查询部分 Windows 注册表键、子键和键值。

> **亮点**：[Q01](#research-q01) 把键值与子键查询接入当前排障会话。

> **主要限制**：[Q02](#research-q02) 允许前缀没有段边界或字面路径保证，值输出仍可能敏感。

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
  - [Q01 · WSL 排障者可用注册表读取确认什么？](#detail-section-11)
  - [Q02 · 允许前缀是不是严格的注册表路径边界？](#detail-section-12)
  - [Q03 · 怎样验收路径约束并减少越界误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要检查 Windows 应用或系统配置的 WSL 用户。

原生 PowerShell 或 Windows 注册表工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 注册表读取 | 核对配置线索 | 依赖 Windows 权限，前缀规则仅限制输入文本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL interop 和 PowerShell | 必需 | 读取 Windows 注册表 | 调用失败 |
| 受控 Windows 用户和合成数据 | 验收必需 | 确认实际路径和权限 | 可能读到非预期值 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立可弃用测试键 | 不含真实凭据 |
| 读取 | 用户指定键并核对原件 | 路径、类型和截断清楚 |
| 退出 | 用户回原生查询 | 避免继续读取不明目标 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置测试键与 interop | 确认用户权限 |
| 持续 | 查询开销未知 | 复核输出与截断 | 值可能含敏感内容 |
| 失败 | 排错时间未知 | 查实际 provider 路径 | 区分不存在和拒绝 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置诊断 | 读取键、子键和指定值 | 范围可靠性与时间节省 |

> **思考**：[Q02](#research-q02) 允许前缀没有段边界或字面路径保证，值输出仍可能敏感。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把键值与子键查询接入当前排障会话。

[Q02](#research-q02) 保护规则处理文本前缀，并未验证 Windows 解析后的路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 允许前缀没有段边界或字面路径保证，值输出仍可能敏感。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在合成键上先验证段边界和字面路径，避免读取生产值。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认路径规则和查询。真实 provider 与 ACL 未测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/registry-exec.js、lib/registry.js、index.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码。未执行目标、PowerShell 或注册表请求。
- 下一步：覆盖路径邻接、通配、拒绝、值类型、超长输出和 non-WSL。

**分析版本**

- **仓库**：[173787247/dsh-wsl-registry](https://github.com/173787247/dsh-wsl-registry)
- **版本号**：0.1.0（[固定提交 53be33c](https://github.com/173787247/dsh-wsl-registry/tree/53be33c998c3bf1c462e11551434d45d823def5b)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 验证标准化和字面路径能否减少越界。

覆盖路径邻接、通配、拒绝、值类型、超长输出和 non-WSL。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 481 |
| .js | source | 4 | 252 | 214 | 15 | — |
| .js | test | 1 | 33 | 29 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 排障者能否在 DSH 读取预期 Windows 注册表键并核对可见范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · WSL 排障者可用注册表读取确认什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

可在 DSH 内查看指定 Windows 键的直接子键、列举值，或按名称读取单个值，帮助核对 Windows 版本与安装配置线索。相比切到注册表编辑器，工具可提供结构化目标和有限文本。它只调用读取命令，实际返回值仍可能含敏感配置，合格结果需回注册表原件核对目标路径和类型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/README.md#L3-L12)

作者说明只读查询。

<details>
<summary>查看原文（10行）</summary>

````text
DeepSeek Harness plugin: Read-only Windows registry access from WSL, restricted to an allowlist of key prefixes.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-registry
````

</details>

**依据 2 · 源码核查**：[lib/registry-exec.js:37-58](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry-exec.js#L37-L58)

子键、单值与枚举三种路径。

<details>
<summary>查看原文（22行）</summary>

```text
export function script(a) {
  return ((a) => `
if (-not (Test-Path ${esc(a.path)})) { ConvertTo-Json -Compress @{ error = 'key not found' }; exit }
$key = Get-Item -Path ${esc(a.path)}
${a.subkeys ? `
ConvertTo-Json -Compress -Depth 4 @{
  path = ${esc(a.path)}
  subkeys = @($key.GetSubKeyNames() | Select-Object -First 200)
  valueCount = @($key.GetValueNames()).Count
}
exit` : ""}
${a.name ? `
$item = Get-ItemProperty -Path ${esc(a.path)} -Name ${esc(a.name)} -ErrorAction SilentlyContinue
if ($null -eq $item) { ConvertTo-Json -Compress @{ error = 'value not found' }; exit }
$v = $item.PSObject.Properties[${esc(a.name)}].Value
ConvertTo-Json -Compress @{ path = ${esc(a.path)}; values = @(@{ name = ${esc(a.name)}; value = "$v" }) }
exit` : ""}
$vals = $key.GetValueNames() | Select-Object -First 100 | ForEach-Object {
  $m = "$($key.GetValue($_))"
  @{ name = $_; kind = "$($key.GetValueKind($_))"; value = $m.Substring(0,[Math]::Min(400,$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ path = ${esc(a.path)}; values = @($vals) }`)(a);
```

</details>

**依据 3 · 源码核查**：[lib/registry.js:13-22](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry.js#L13-L22)

文本显示。

<details>
<summary>查看原文（10行）</summary>

```text
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_reg ok=${v.ok} path=${v.path} values=${(v.values || []).length}`];
      for (const x of v.values || []) l.push(`  ${x.name}${x.kind ? ` (${x.kind})` : ""} = ${x.value.slice(0, 100)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
```

</details>

#### 缺口

- 未比较实际排障与原生查询
  **影响**：节时及值投影准确性未知
  **进一步探讨**：在无敏感值的测试键比较三类查询

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 允许前缀是不是严格的注册表路径边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

过滤用不区分大小写的 startsWith 比对四个前缀，未验证段边界，也未规范化 provider 路径。以允许字符串开头的同名前缀路径会通过 JavaScript 判断，实际存在与读取结果由 PowerShell 决定。另检查每段拒绝 Run 与 RunOnce，不过浏览子键会返回名称，不能等同对所有输出的内容审查。路径经单引号转义后交给 Test-Path 和 Get-Item -Path，后者不是字面路径入口，通配符解释需在真实 provider 核对。子键与值枚举分别最多 200 和 100 项，文本值进一步截断；单值结构化返回没有枚举分支的 400 字符限制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/registry-exec.js:3-21](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry-exec.js#L3-L21)

前缀和 Run 段检查。

<details>
<summary>查看原文（19行）</summary>

```text
const ALLOWED = [
  "HKLM:\\SOFTWARE", "HKLM:\\SYSTEM\\CurrentControlSet\\Services",
  "HKCU:\\SOFTWARE", "HKLM:\\HARDWARE",
];
export function assertRegistryPath(path) {
  const p = String(path ?? "").trim();
  if (!p) throw new Error("path is required");
  const ok = ALLOWED.some((a) => p.toUpperCase().startsWith(a.toUpperCase()));
  if (!ok) throw new Error(`registry path is outside the allowlist: ${p}`);
  // Run / RunOnce as a whole path segment, wherever it appears, including at the
  // end of the path. A pattern requiring a trailing separator let
  // "...CurrentVersion\\Run" through.
  const segments = p.split(/[\\/:]+/).filter(Boolean);
  if (segments.some((s) => /^Run(Once)?$/i.test(s))) throw new Error("autorun keys are outside the allowlist");
  return p;
}
/** The kit's one escaping rule: single-quote the value, doubling any apostrophe. */
function esc(s) {
  return "'" + String(s ?? "").replace(/'/g, "''") + "'";
```

</details>

**依据 2 · 源码核查**：[lib/registry-exec.js:37-58](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry-exec.js#L37-L58)

PowerShell 路径参数及返回上限。

<details>
<summary>查看原文（22行）</summary>

```text
export function script(a) {
  return ((a) => `
if (-not (Test-Path ${esc(a.path)})) { ConvertTo-Json -Compress @{ error = 'key not found' }; exit }
$key = Get-Item -Path ${esc(a.path)}
${a.subkeys ? `
ConvertTo-Json -Compress -Depth 4 @{
  path = ${esc(a.path)}
  subkeys = @($key.GetSubKeyNames() | Select-Object -First 200)
  valueCount = @($key.GetValueNames()).Count
}
exit` : ""}
${a.name ? `
$item = Get-ItemProperty -Path ${esc(a.path)} -Name ${esc(a.name)} -ErrorAction SilentlyContinue
if ($null -eq $item) { ConvertTo-Json -Compress @{ error = 'value not found' }; exit }
$v = $item.PSObject.Properties[${esc(a.name)}].Value
ConvertTo-Json -Compress @{ path = ${esc(a.path)}; values = @(@{ name = ${esc(a.name)}; value = "$v" }) }
exit` : ""}
$vals = $key.GetValueNames() | Select-Object -First 100 | ForEach-Object {
  $m = "$($key.GetValue($_))"
  @{ name = $_; kind = "$($key.GetValueKind($_))"; value = $m.Substring(0,[Math]::Min(400,$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ path = ${esc(a.path)}; values = @($vals) }`)(a);
```

</details>

**依据 3 · 源码核查**：[lib/registry-exec.js:79-91](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry-exec.js#L79-L91)

执行前检查。

<details>
<summary>查看原文（13行）</summary>

```text
  if (a.path) a.path = assertRegistryPath(a.path);

  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  if (a.subkeys) {
    const { stdout } = await runPowerShell(script(a), { timeoutMs });
    const raw = JSON.parse(stdout.trim() || "{}");
    if (raw.error) return { ok: false, error: String(raw.error) };
    return { ok: true, ...normalizeKeys(raw) };
  }
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
```

</details>

**依据 4 · 源码核查**：[lib/registry.js:13-22](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry.js#L13-L22)

默认文本截取。

<details>
<summary>查看原文（10行）</summary>

```text
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_reg ok=${v.ok} path=${v.path} values=${(v.values || []).length}`];
      for (const x of v.values || []) l.push(`  ${x.name}${x.kind ? ` (${x.kind})` : ""} = ${x.value.slice(0, 100)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
```

</details>

#### 缺口

- 未实测 PowerShell provider 对前缀、通配与段的解释
  **影响**：不能把字符串检查当完整隔离
  **进一步探讨**：在测试键核对前缀近邻、通配、Run 与类型边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收路径约束并减少越界误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

只在隔离 Windows 用户、WSL interop 和合成注册表数据上验证。先用原生命令核对键与值类型，避免把生产值交给会话。若路径越界、值不清楚或读取错误，立即回到原生查询。可对照先标准化键路径、精确段边界、按字面读取并标记输出截断，测允许和拒绝样例。若仍读到邻接键或合法查询大量回归则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:8-33](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/index.js#L8-L33)

Host 注册和 WSL 失败。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_reg",
    order: 217,
    text: "Use win_reg for WSL/Windows interop: Read-only Windows registry access from WSL, restricted to an allowlist of key prefixes.",
  });

  ctx.tools.register({
    name: "win_reg",
    description: "Read-only Windows registry access from WSL, restricted to an allowlist of key prefixes.",
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

**依据 2 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/wsl-host.js#L34-L41)

跨边界 PowerShell 调用。

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

**依据 3 · 源码核查**：[lib/registry-exec.js:3-17](https://github.com/173787247/dsh-wsl-registry/blob/53be33c998c3bf1c462e11551434d45d823def5b/lib/registry-exec.js#L3-L17)

当前检查基线。

<details>
<summary>查看原文（15行）</summary>

```text
const ALLOWED = [
  "HKLM:\\SOFTWARE", "HKLM:\\SYSTEM\\CurrentControlSet\\Services",
  "HKCU:\\SOFTWARE", "HKLM:\\HARDWARE",
];
export function assertRegistryPath(path) {
  const p = String(path ?? "").trim();
  if (!p) throw new Error("path is required");
  const ok = ALLOWED.some((a) => p.toUpperCase().startsWith(a.toUpperCase()));
  if (!ok) throw new Error(`registry path is outside the allowlist: ${p}`);
  // Run / RunOnce as a whole path segment, wherever it appears, including at the
  // end of the path. A pattern requiring a trailing separator let
  // "...CurrentVersion\\Run" through.
  const segments = p.split(/[\\/:]+/).filter(Boolean);
  if (segments.some((s) => /^Run(Once)?$/i.test(s))) throw new Error("autorun keys are outside the allowlist");
  return p;
```

</details>

#### 缺口

- 无真实 Windows 注册表验收或改法试验
  **影响**：接入、ACL 与误判成本未知
  **进一步探讨**：用合成键对照拒绝、错误和大值

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
