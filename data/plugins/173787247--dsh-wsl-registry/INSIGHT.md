# dsh-wsl-registry

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ec36b50](https://github.com/173787247/dsh-wsl-registry/tree/ec36b50ceab4f15549c2b2ac7f97033084a3eb56)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-registry)
<!-- END META -->

> **功能**：为 WSL 内 DSH 提供受路径列表约束的 Windows 注册表读取工具。

> **亮点**：把 WSL 到 Windows PowerShell 的注册表读取封装为模型工具，提供常用前缀与 Run 段筛选；底层读取仍由 Windows 命令和 ACL 完成。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：路径白名单只用 startsWith，无段边界；具名值不受作者所称400字符裁剪。通配符/权限影响未实测，不把静态缺口说成已读取禁区。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要查询，交付什么结果？](#detail-section-11)
  - [Q02 · 路径校验和 Windows 进程查询如何实现？](#detail-section-12)
  - [Q03 · 白名单和 400 字符限制是否覆盖所有查询？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本如何影响采用，下一步可验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 WSL 里运行 DSH、需核 Windows 软件或系统键值的诊断用户。

WSL 用户可手工调用 powershell.exe 读取 Windows registry；本包把常用查询封装进 DSH tool。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 注册表值读取 | WSL 中查看 Windows 配置 | 当前用户 ACL 与路径校验 |
| 子键枚举 | 最多列 200 个子键 | 仍为只读，可能含敏感名称 |
| 格式化结果 | 给模型摘要与结构化输出 | 具名值结构化长度未限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows + WSL | 必需 | 访问 Windows 注册表 | 非 WSL 返回错误 |
| powershell.exe 与 interop | 必需 | 执行只读查询 | 命令失败/超时 |
| DSH tools/systemPrompt | 注册必需 | 模型工具与提示 | 宿主服务缺失无法装载 |
| 当前 Windows 用户 ACL | 读取约束 | 实际键访问 | 无权时失败 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核环境 | 用户确认 DSH 在 WSL、PowerShell 可用 | 非 WSL 不调用 |
| 核路径 | 用户/Agent 选择非敏感 allowlist 键 | 段边界与内容需人工确认 |
| 查询 | 用 win_reg 指定 path/name/subkeys | 返回结构化值或错误 |
| 退出 | 用户停用插件并核 tool 消失 | 未在本轮宿主验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Windows+WSL/PowerShell 资源，现金未知 | 安装、核 ACL 和授权路径 | 真实宿主未测 |
| 持续使用 | 每查一次 PowerShell 进程 | 复核键值、避免敏感信息进上下文 | 延迟与错误率未知 |
| 失败恢复 | 进程重试/超时资源未知 | 查 WSL interop、权限、路径 | 不能通过扩大范围解决 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| WSL 注册表读取 | PowerShell 只读 cmdlet 和工具路由可见 | Windows ACL、实际响应与延迟 |
| 前缀筛选 | 四个字符串前缀及 Run 段拒绝可见 | 通配符和前缀碰撞实际可达性 |
| 输出裁剪 | 列表值400字符、文本摘要100字符 | 具名长值无结构化裁剪 |

> **思考**：路径白名单只用 startsWith，无段边界；具名值不受作者所称400字符裁剪。通配符/权限影响未实测，不把静态缺口说成已读取禁区。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 WSL 到 Windows PowerShell 的注册表读取封装为模型工具，提供常用前缀与 Run 段筛选；底层读取仍由 Windows 命令和 ACL 完成。详见[Q01](#research-q01)、[Q02](#research-q02)。

固定 argv 的 execFile、引号转义和 WSL 检测减少直拼 shell 命令风险；路径规则是字符串前缀而非段语义，结构化具名值未裁剪。kit 公共 helper 归共享设计，不全计本包原创。

<a id="detail-section-5"></a>

### 1.4 主要限制

路径白名单只用 startsWith，无段边界；具名值不受作者所称400字符裁剪。通配符/权限影响未实测，不把静态缺口说成已读取禁区。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察并限非敏感诊断；在隔离测试键验证路径与长值边界、再评估是否允许真实注册表查询。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可确认只读查询与 WSL 检测；白名单分隔符和具名值长度有静态边界，实际 Windows 可达性未验证；路径门控是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/registry.js、lib/registry-exec.js、lib/wsl-host.js、test/registry.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交阅读 README、工具入口、路径/脚本和 WSL helper、纯函数测试；未读取用户注册表或执行 PowerShell。
- 下一步：在隔离 Windows 用户的临时非敏感键中测前缀碰撞、Run 段、通配符、具名长值、ACL 错误及宿主退出。

**分析版本**

- **仓库**：[173787247/dsh-wsl-registry](https://github.com/173787247/dsh-wsl-registry)
- **版本号**：0.1.0（[固定提交 ec36b50](https://github.com/173787247/dsh-wsl-registry/tree/ec36b50ceab4f15549c2b2ac7f97033084a3eb56)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用规范化 Hive/段边界及统一值裁剪，并在隔离测试键上比较前缀碰撞、通配符、合法路径与长值的拒绝/保留；当前未实现。详见[Q04](#research-q04)。

在隔离 Windows 用户的临时非敏感键中测前缀碰撞、Run 段、通配符、具名长值、ACL 错误及宿主退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 481 |
| .js | source | 4 | 252 | 214 | 15 | — |
| .js | test | 1 | 33 | 29 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+created%3A2026-09-22T05%3A20%3A03.310Z..2026-10-22T05%3A20%3A03.310Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A20%3A03.310Z..2026-10-22T05%3A20%3A03.310Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本的 WSL 只读注册表工具能否在明确路径范围内提供可控查询，以及边界是否与作者描述一致。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要查询，交付什么结果？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 WSL 内运行 DSH、需从 Windows 注册表读取软件或系统配置信息以辅助诊断的用户。工具 win_reg 接收 path，可选 name 查单值或 subkeys 列子键，返回结构化 path、values 或 subkeys，再提供模型可读摘要。合格结果应是所请求的真实键/值、来源路径与失败信息匹配，并且查询确实限制在约定范围，不把只读等同于无敏感信息。

原办法是用户从 WSL 手工调用 powershell.exe 或在 Windows GUI 查看注册表。本包的增量是把 WSL 检测、固定参数、常用路径筛选、数量/长度裁剪封装成 DSH 模型工具，并不新增 Windows 注册表读取能力。README 列 HKLM SOFTWARE、Services、HARDWARE 与 HKCU SOFTWARE 为授权前缀，拒绝 Run/RunOnce 段；实际保护强度需以源码校验为准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-31](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/README.md#L1-L31)

作者给出 WSL 场景、示例、白名单和只读声明。

<details>
<summary>查看原文（31行）</summary>

````text
# dsh-wsl-registry

DeepSeek Harness plugin: Read-only Windows registry access from WSL, restricted to an allowlist of key prefixes.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-registry
```

## Usage

```
win_reg path='HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
win_reg path='HKLM:\SOFTWARE\...' name=ProductName
```

## Notes

**Read-only, and restricted to an allowlist** of key prefixes:
`HKLM:\SOFTWARE`, `HKLM:\SYSTEM\CurrentControlSet\Services`, `HKCU:\SOFTWARE`,
`HKLM:\HARDWARE`. Keys under a `Run` or `RunOnce` segment are refused wherever they
appear — matched as a whole path segment, so `...\CurrentVersion\Run` is caught as
well as `...\Run\Something`. Values are truncated to 400 characters.

## Requirements

````

</details>

**依据 2 · 源码核查**：[index.js:5-38](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/index.js#L5-L38)

宿主注册 win_reg，非 WSL 时返回错误。

<details>
<summary>查看原文（34行）</summary>

```text
export const name = "dsh-wsl-registry";
export const inject = ["tools", "systemPrompt"];

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
    },
    presentCall: () => ({ card: "generic", title: "win_reg" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_reg", content: result?.content }),
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/registry.js:25-55](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry.js#L25-L55)

工具参数和返回字段形状。

<details>
<summary>查看原文（31行）</summary>

```text
export function parameters() {
  return {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "path": {
      "type": "string",
      "description": "Registry path, e.g. HKLM:\\\\SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion."
    },
    "name": {
      "type": "string",
      "description": "Read one value by name (optional; omit to list the key's values)."
    },
    "subkeys": {
      "type": "boolean",
      "description": "List the child keys under this path instead of its values. A key is a container as well as a set of values."
    }
  }
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

export function normalizeKeys(raw) {
  return ((raw) => ({
      path: String(raw.path ?? ""),
      subkeys: (raw.subkeys || []).map(String),
      valueCount: num(raw.valueCount),
    }))(raw ?? {});
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径校验和 Windows 进程查询如何实现？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

index.js 在加载时通过环境变量或 /proc/sys/kernel/osrelease 检测 WSL，工具调用仅在检测通过后进入 execute。execute 将 path 送 assertRegistryPath，随后生成 PowerShell 脚本，通过 WSL 可访问的 powershell.exe 以 execFile 的固定 argv、无 shell、可配且夹在 1 至 120 秒的超时执行。脚本用单引号并将内部单引号重复转义，调用 Test-Path、Get-Item 或 Get-ItemProperty，最后把 JSON stdout 解析为受约束的输出。子键最多 200，值列表最多 100；列表值裁至 400 字符，模型摘要又只取前 100 字符。

这种把路径校验和命令参数从模型输入拆开的做法可借鉴，但安全还要看路径语义。源码使用 Get-Item -Path 而非 LiteralPath，PowerShell 通配符是否影响实际匹配需要 WSL/Windows 试验。PowerShell 进程读注册表仍受 Windows ACL 和当前身份约束；插件的只读脚本没有写入 cmdlet，但读取和返回的值可能敏感。模块中的 WSL helper 注释为 kit 共享副本，这部分归属不是本插件独有机制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:8-41](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/wsl-host.js#L8-L41)

WSL 检测和固定 execFile PowerShell argv/缓冲/超时。

<details>
<summary>查看原文（34行）</summary>

```text
const WINDOWS_BINS = {
  "powershell.exe": ["/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"],
  "cmd.exe": ["/mnt/c/Windows/System32/cmd.exe"],
  "explorer.exe": ["/mnt/c/Windows/explorer.exe"],
};

export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
}

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

**依据 2 · 源码核查**：[lib/registry-exec.js:7-58](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L7-L58)

路径、转义、PowerShell 读命令和输出上限。

<details>
<summary>查看原文（52行）</summary>

```text
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
}

function clamp(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * The script is built here, at the call site, the way every other plugin in the
 * kit does it: the PowerShell is written inline and the values are escaped as
 * they are interpolated. An earlier version of this file used a @@TOKEN@@
 * substitution table instead, which needed a template literal that ate the
 * backslashes in a regex and quoted every token twice.
 */
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

**依据 3 · 源码核查**：[lib/registry-exec.js:61-92](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L61-L92)

execute 归一化参数并解析 stdout。

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
}
```

</details>

#### 缺口

- 没有本轮 WSL interop、Windows ACL 和通配符路径的执行证据。
  **影响**：不能把静态只读脚本升级为所有 Windows 安装上的权限或访问范围保证。
  **进一步探讨**：在隔离 Windows 用户下试普通/无权键、通配符、非法路径与超时，记录实际命中和错误。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 白名单和 400 字符限制是否覆盖所有查询？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

并不完整。assertRegistryPath 用不区分大小写的 startsWith 判断四个前缀，没有检查前缀后必须是路径分隔符或结束；例如 HKLM:\SOFTWARE 后接其它字符仍会通过字符串前缀检查，虽是否能命中实际键需另查。Run/RunOnce 只在由斜杠、反斜杠、冒号切分出的整个段匹配时拒绝；这覆盖直接的 Run 子键，却不能从字符串规则本身证明通配符或其它 PowerShell 路径语义都不能触及被排除项。不能据此声称已突破 Windows ACL或实际读到了敏感键。

README 的“值裁至400字符”仅在无 name 的列表分支成立；指定 name 时直接把 `$v` 转字符串，没有长度限制，normalize 也只做 String 转换，模型 format 最多显示100字符，但结构化返回仍可能含完整较长值。作者单测只覆盖 normalize/format 等纯函数，未见白名单边界和具名值长度断言。对于可能含密钥或个人数据的注册表，即使只读也应把可访问前缀与输出内容分开评估。

#### 证据与依据

**依据 1 · 源码核查**：[lib/registry-exec.js:3-17](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L3-L17)

四前缀以 startsWith 判断，Run/RunOnce 为整段检测。

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

**依据 2 · 源码核查**：[lib/registry-exec.js:37-58](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L37-L58)

具名值未裁剪，列表值有400字符裁剪。

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

**依据 3 · 源码核查**：[lib/registry.js:4-21](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry.js#L4-L21)

结构化 normalize 保留全值，文本摘要取前100字符。

<details>
<summary>查看原文（18行）</summary>

```text
export function normalize(raw) {
  return ((raw) => ({
      path: String(raw.path ?? ""),
      values: (raw.values || []).map((x) => ({ name: String(x.name ?? ""), kind: String(x.kind ?? ""), value: String(x.value ?? "") })),
    }))(raw ?? {});
}

// Dispatch on the shape of the result rather than making the caller say which
// formatter to use: a result carries either `detail`, or `subkeys`, or neither.
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_reg ok=${v.ok} path=${v.path} values=${(v.values || []).length}`];
      for (const x of v.values || []) l.push(`  ${x.name}${x.kind ? ` (${x.kind})` : ""} = ${x.value.slice(0, 100)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
```

</details>

**依据 4 · 源码核查**：[test/registry.test.js:1-33](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/test/registry.test.js#L1-L33)

现有测试主要校验纯格式与归一化，未覆盖前缀边界。

<details>
<summary>查看原文（33行）</summary>

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalize, format, parameters } from "../lib/registry.js";

describe("registry", () => {
  it("normalises values and keeps the key kind", () => {
    const v = normalize({ path: "HKLM:\\X", values: [{ name: "A", kind: "DWord", value: "1" }] });
    assert.equal(v.path, "HKLM:\\X");
    assert.equal(v.values[0].kind, "DWord");
  });
  it("defaults missing values to an empty array", () => {
    assert.deepEqual(normalize({}).values, []);
  });
  it("summarises the path and value count", () => {
    const out = format(normalize({ path: "HKLM:\\X", values: [{ name: "A", value: "1" }] }));
    assert.match(out, /path=HKLM:\\X/);
    assert.match(out, /values=1/);
  });
});

// ── subkey enumeration, added after the first release ───────────────────────
import { normalizeKeys } from "../lib/registry.js";

describe("normalizeKeys", () => {
  it("keeps the child keys and the value count", () => {
    const v = normalizeKeys({ path: "HKLM:\\SOFTWARE", subkeys: ["A", "B"], valueCount: 3 });
    assert.deepEqual(v.subkeys, ["A", "B"]);
    assert.equal(v.valueCount, 3);
  });
  it("defaults to an empty list", () => {
    assert.deepEqual(normalizeKeys({}).subkeys, []);
  });
});
```

</details>

#### 缺口

- 缺少实际 Windows 注册表中的前缀碰撞、通配符和具名长值测试。
  **影响**：不能量化超范围读取或长值暴露的实际可达性。
  **进一步探讨**：用无敏感数据的临时测试键验证前缀分隔符、通配符、Run/RunOnce 和大于400字符具名值，再修路径解析和输出上限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本如何影响采用，下一步可验证什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用户须在 Windows+WSL 内运行 DSH，并能从 WSL 启动 Windows PowerShell。首次要安装组件、核授权读取的键范围和 Windows 身份；持续每次查询都启一个 PowerShell 进程，值读出的内容还需人工判读并决定是否允许进入模型上下文。超时/权限/无键返回错误，失败恢复需核 WSL interop、Windows ACL、路径和具体键，不宜扩大白名单来绕过错误。现金支出与时延没有本轮数据。

当前建议观察。它对诊断有直接入口价值，但路径前缀边界与具名值裁剪不满足 README 字面承诺，且本轮未实测宿主或敏感值处理；不适合直接开放给处理真实密钥注册表的 Agent。可提出未实现的路径解析和输出门控方案：先规范化 Hive 与段，再只接受前缀精确段边界、显式拒绝通配符/Run 段，并统一裁剪所有值形态。最小对照用前缀碰撞、合法键、具名长值和通配符测试，记录错误拒绝与合法查询是否被误拒。若新解析导致常用合法键不可用或仍出现超范围读取，则假设需修正。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-43](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/README.md#L18-L43)

作者提供安装、使用条件和测试声明。

<details>
<summary>查看原文（26行）</summary>

````text
win_reg path='HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
win_reg path='HKLM:\SOFTWARE\...' name=ProductName
```

## Notes

**Read-only, and restricted to an allowlist** of key prefixes:
`HKLM:\SOFTWARE`, `HKLM:\SYSTEM\CurrentControlSet\Services`, `HKCU:\SOFTWARE`,
`HKLM:\HARDWARE`. Keys under a `Run` or `RunOnce` segment are refused wherever they
appear — matched as a whole path segment, so `...\CurrentVersion\Run` is caught as
well as `...\Run\Something`. Values are truncated to 400 characters.

## Requirements

- Windows with WSL, and DeepSeek Harness running inside it.

## Tests

```sh
npm test
```

The unit tests run anywhere. The live tests are skipped outside WSL.

## Compatibility

````

</details>

**依据 2 · 源码核查**：[lib/registry-exec.js:3-17](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L3-L17)

现有字符串前缀是改进假设的比较基线。

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

**依据 3 · 源码核查**：[lib/registry-exec.js:48-58](https://github.com/173787247/dsh-wsl-registry/blob/ec36b50ceab4f15549c2b2ac7f97033084a3eb56/lib/registry-exec.js#L48-L58)

具名值与列表值的输出上限不一致。

<details>
<summary>查看原文（11行）</summary>

```text
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

#### 缺口

- 统一路径解析和输出裁剪尚未实现，且没有合法/非法键的同条件对照。
  **影响**：假设不能算当前安全能力或降低采用风险。
  **进一步探讨**：在隔离 Windows 测试键中建立合法、碰撞、通配符与长值矩阵，核误拒和超界。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
