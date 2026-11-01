# dsh-wsl-launch

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0c6d72f](https://github.com/173787247/dsh-wsl-launch/tree/0c6d72fcfe46d7619745eb74ec38323566a0603b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-launch)
<!-- END META -->

> **功能**：在 WSL 中通过 DSH 工具启动匹配白名单的 Windows 应用。

> **亮点**：将受名称规则约束的 Windows 应用启动接入 DSH 工具。[Q01](#research-q01)

> **主要限制**：名称匹配不验证程序身份；参数不受限且成功输出包含参数。[Q03](#research-q03)

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
  - [Q01 · 何时需要跨 WSL 启动 Windows 应用？](#detail-section-11)
  - [Q02 · 白名单怎样匹配和执行？](#detail-section-12)
  - [Q03 · 目标名称白名单能否保证安全、不会泄露参数？](#detail-section-13)
  - [Q04 · 如何在受控环境试用并处理失败？](#detail-section-14)
  - [Q05 · 已有名称匹配之外如何降低同名程序与参数风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 WSL DSH 并需启动 Windows 应用的用户；基线为手工在 Windows 启动。[Q01](#research-q01)

用户手工启动 Windows 编辑器或浏览器。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 匹配 | 限制目标名称 | 不核验二进制身份 |
| 启动 | 调 Windows 程序 | 参数可能输出 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与 WSL | 必需 | 工具注册及执行 | 手工启动 |
| Windows PowerShell 与目标程序 | 必需 | 启动应用 | 返回错误 |
| 可信目标及无敏感参数 | 试用必需 | 控制风险 | 不调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户检查目标来源及白名单 | 身份不明停止 |
| 启动 | 传无秘密参数调用工具 | 失败先检查进程 |
| 核查 | 用户检查实际窗口与结果 | 异常手工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Windows 与 WSL | 核查目标身份 | 实机未测 |
| 持续 | 被启动程序资源 | 审查参数与结果 | 提效未知 |
| 恢复 | 可能已有进程 | 核查并关闭 | 超时不证明未启动 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 启动 | 名称匹配与进程调用 | 程序身份及窗口成功 |
| 输出 | 展示目标与参数 | 不保证秘密脱敏 |

> **思考**：名称匹配不验证程序身份；参数不受限且成功输出包含参数。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将受名称规则约束的 Windows 应用启动接入 DSH 工具。[Q01](#research-q01)

白名单匹配名称/路径后缀或前缀，成功结果会输出参数。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

名称匹配不验证程序身份；参数不受限且成功输出包含参数。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先核实程序来源和参数；失败或超时后检查实际进程再决定。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持匹配及调用路径；未运行 Windows 或 WSL。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、index.js、lib/launch.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 9 文件、无排除和解析错误；静态检查启动与输出，未运行目标。
- 下一步：隔离 Windows/WSL 核验同名程序、参数输出与超时结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-launch](https://github.com/173787247/dsh-wsl-launch)
- **版本号**：0.1.0（[固定提交 0c6d72f](https://github.com/173787247/dsh-wsl-launch/tree/0c6d72fcfe46d7619745eb74ec38323566a0603b)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：绝对路径身份核验与脱敏预览可减少同名程序与敏感参数风险，须对照现有规则。[Q05](#research-q05)

隔离 Windows/WSL 核验同名程序、参数输出与超时结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 177 | — | — | 899 |
| .js | source | 3 | 199 | 180 | 2 | — |
| .js | test | 1 | 19 | 16 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 中启动 Windows 应用的白名单、参数和结果边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时需要跨 WSL 启动 Windows 应用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 WSL 中使用 DSH 且需要启动 Windows 编辑器、浏览器或终端的用户，可通过工具触发目标。相比手工切换 Windows 启动程序，它把调用纳入代理工作流，但需要 WSL、Windows 和用户对目标与参数的信任；偶发启动可直接手工完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-52](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/README.md#L37-L52)

作者说明用途与默认白名单。

<details>
<summary>查看原文（16行）</summary>

```text
## Why

Opening a **file** belongs to [dsh-wsl-open](https://github.com/173787247/dsh-wsl-open). Starting **VS Code / Edge / Explorer** as an app needs a controlled launcher so the agent cannot run arbitrary `.exe`.

## Tool

| Arg | Required | Meaning |
|-----|----------|---------|
| `target` | yes | Executable name or Windows path (must match allowlist) |
| `args` | no | String argument list |

## Default allowlist

`code`, `code.cmd`, `explorer.exe`, `notepad.exe`, `wt.exe`, `windows terminal`, `msedge.exe`, `chrome.exe`, `firefox.exe`

Extend via `config.allowlist` (exact name, path suffix, or `prefix*`).
```

</details>

**依据 2 · 源码核查**：[index.js:10-18](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/index.js#L10-L18)

工具宿主与环境检测。

```text
export const name = "dsh-wsl-launch";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowlist = Array.isArray(config.allowlist) && config.allowlist.length
    ? config.allowlist.map(String)
    : DEFAULT_ALLOWLIST;
  const wsl = detectWsl();
```

#### 缺口

- 未运行 WSL、PowerShell 或 Windows 应用
  **影响**：不能确认实际程序身份、启动与参数行为
  **进一步探讨**：隔离环境验证路径、参数、超时和目标进程

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 白名单怎样匹配和执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

目标被转成字符串去空格并小写，条目可精确匹配、路径末尾匹配或以 * 结尾的前缀匹配；参数转换为字符串数组并编码进 PowerShell 的 JSON。execute 在 WSL 且目标匹配时调用 PowerShell Start-Process，否则返回错误；进程调用成功不证明应用正常打开或动作已完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/launch.js:1-15](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L1-L15)

目标及白名单匹配。

<details>
<summary>查看原文（15行）</summary>

```text
/** Allowlist matching for Windows launch targets. */
export function normalizeTarget(raw) {
  return String(raw ?? "").trim();
}

export function matchesAllowlist(target, allowlist) {
  const t = normalizeTarget(target).toLowerCase();
  if (!t) return false;
  const list = Array.isArray(allowlist) ? allowlist : [];
  return list.some((entry) => {
    const e = String(entry ?? "").trim().toLowerCase();
    if (!e) return false;
    if (e.endsWith("*")) return t.startsWith(e.slice(0, -1));
    return t === e || t.endsWith(`\\${e}`) || t.endsWith(`/${e}`);
  });
```

</details>

**依据 2 · 源码核查**：[lib/launch.js:30-39](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L30-L39)

参数编码与 Start-Process。

<details>
<summary>查看原文（10行）</summary>

```text
export function buildLaunchScript(target, args) {
  const t = normalizeTarget(target).replace(/'/g, "''");
  const argList = Array.isArray(args) ? args.map((a) => String(a)) : [];
  const argJson = JSON.stringify(argList).replace(/'/g, "''");
  return [
    `$target = '${t}'`,
    `$args = ConvertFrom-Json '${argJson}'`,
    "if ($args.Count -gt 0) { Start-Process -FilePath $target -ArgumentList $args } else { Start-Process -FilePath $target }",
    "'ok'",
  ].join("; ");
```

</details>

**依据 3 · 源码核查**：[index.js:62-82](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/index.js#L62-L82)

WSL、匹配及执行错误分支。

<details>
<summary>查看原文（21行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const target = normalizeTarget(args?.target);
      const launchArgs = Array.isArray(args?.args) ? args.args.map(String) : [];
      if (!target) return { ok: false, error: "missing target" };
      if (!matchesAllowlist(target, allowlist)) {
        return { ok: false, target, args: launchArgs, error: `target not allowlisted: ${target}` };
      }
      try {
        await runPowerShell(buildLaunchScript(target, launchArgs), { timeoutMs });
        return { ok: true, target, args: launchArgs };
      } catch (err) {
        return {
          ok: false,
          target,
          args: launchArgs,
          error: err instanceof Error ? err.message : String(err),
        };
      }
```

</details>

#### 缺口

- 未运行 WSL、PowerShell 或 Windows 应用
  **影响**：不能确认实际程序身份、启动与参数行为
  **进一步探讨**：隔离环境验证路径、参数、超时和目标进程

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目标名称白名单能否保证安全、不会泄露参数？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。匹配路径后缀或前缀不检查二进制签名或真实路径身份；允许程序的参数也未受内容约束，可能触发程序自身能力。成功结果格式化会拼出参数，与 SECURITY 不打印秘密的声明存在冲突；用户不应在参数中放令牌，并需审查应用来源和动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/launch.js:6-15](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L6-L15)

后缀和前缀匹配。

<details>
<summary>查看原文（10行）</summary>

```text
export function matchesAllowlist(target, allowlist) {
  const t = normalizeTarget(target).toLowerCase();
  if (!t) return false;
  const list = Array.isArray(allowlist) ? allowlist : [];
  return list.some((entry) => {
    const e = String(entry ?? "").trim().toLowerCase();
    if (!e) return false;
    if (e.endsWith("*")) return t.startsWith(e.slice(0, -1));
    return t === e || t.endsWith(`\\${e}`) || t.endsWith(`/${e}`);
  });
```

</details>

**依据 2 · 源码核查**：[lib/launch.js:30-46](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L30-L46)

参数传递与成功输出。

<details>
<summary>查看原文（17行）</summary>

```text
export function buildLaunchScript(target, args) {
  const t = normalizeTarget(target).replace(/'/g, "''");
  const argList = Array.isArray(args) ? args.map((a) => String(a)) : [];
  const argJson = JSON.stringify(argList).replace(/'/g, "''");
  return [
    `$target = '${t}'`,
    `$args = ConvertFrom-Json '${argJson}'`,
    "if ($args.Count -gt 0) { Start-Process -FilePath $target -ArgumentList $args } else { Start-Process -FilePath $target }",
    "'ok'",
  ].join("; ");
}

export function formatLaunchResult(value) {
  if (!value.ok) return `win_launch failed: ${value.error || "denied"}`;
  const args = (value.args || []).join(" ");
  return `launched: ${value.target}${args ? ` ${args}` : ""}`;
}
```

</details>

**依据 3 · 作者声明**：[SECURITY.md:1-3](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/SECURITY.md#L1-L3)

作者声明不输出秘密。

```text
# Security

`dsh-wsl-launch` must not log, print, or return secrets (tokens, passwords, PEM keys).
```

#### 缺口

- 未运行 WSL、PowerShell 或 Windows 应用
  **影响**：不能确认实际程序身份、启动与参数行为
  **进一步探讨**：隔离环境验证路径、参数、超时和目标进程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在受控环境试用并处理失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖 WSL、Windows PowerShell、允许的目标和可用 GUI；默认白名单包含编辑器、浏览器和终端，空配置会回到默认而非拒绝全部。先使用可信程序与无秘密参数，在隔离环境确认可执行文件身份并观察实际窗口；拒绝或超时后先检查是否已有进程，避免盲目重复启动。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-18](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/index.js#L13-L18)

白名单空配置回退默认。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowlist = Array.isArray(config.allowlist) && config.allowlist.length
    ? config.allowlist.map(String)
    : DEFAULT_ALLOWLIST;
  const wsl = detectWsl();
```

**依据 2 · 源码核查**：[index.js:62-82](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/index.js#L62-L82)

执行与错误返回。

<details>
<summary>查看原文（21行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const target = normalizeTarget(args?.target);
      const launchArgs = Array.isArray(args?.args) ? args.args.map(String) : [];
      if (!target) return { ok: false, error: "missing target" };
      if (!matchesAllowlist(target, allowlist)) {
        return { ok: false, target, args: launchArgs, error: `target not allowlisted: ${target}` };
      }
      try {
        await runPowerShell(buildLaunchScript(target, launchArgs), { timeoutMs });
        return { ok: true, target, args: launchArgs };
      } catch (err) {
        return {
          ok: false,
          target,
          args: launchArgs,
          error: err instanceof Error ? err.message : String(err),
        };
      }
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/wsl-host.js#L34-L41)

PowerShell 调用及超时。

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

- 未运行 WSL、PowerShell 或 Windows 应用
  **影响**：不能确认实际程序身份、启动与参数行为
  **进一步探讨**：隔离环境验证路径、参数、超时和目标进程

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有名称匹配之外如何降低同名程序与参数风险？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：用户显式选择绝对路径、校验程序身份并在启动前预览脱敏参数，可能减少同名替换和敏感参数暴露。已有名称白名单和 PowerShell 字符串转义，不应重复当作新机制；未穷尽宿主或操作系统外部保护，签名检查也不能限制已允许程序的全部功能。对照现有规则，在同名不同路径、特殊参数与正常应用上测误放、误拒与可用性，无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/launch.js:6-15](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L6-L15)

已有名称匹配。

<details>
<summary>查看原文（10行）</summary>

```text
export function matchesAllowlist(target, allowlist) {
  const t = normalizeTarget(target).toLowerCase();
  if (!t) return false;
  const list = Array.isArray(allowlist) ? allowlist : [];
  return list.some((entry) => {
    const e = String(entry ?? "").trim().toLowerCase();
    if (!e) return false;
    if (e.endsWith("*")) return t.startsWith(e.slice(0, -1));
    return t === e || t.endsWith(`\\${e}`) || t.endsWith(`/${e}`);
  });
```

</details>

**依据 2 · 源码核查**：[lib/launch.js:30-46](https://github.com/173787247/dsh-wsl-launch/blob/0c6d72fcfe46d7619745eb74ec38323566a0603b/lib/launch.js#L30-L46)

已有参数编码及结果输出。

<details>
<summary>查看原文（17行）</summary>

```text
export function buildLaunchScript(target, args) {
  const t = normalizeTarget(target).replace(/'/g, "''");
  const argList = Array.isArray(args) ? args.map((a) => String(a)) : [];
  const argJson = JSON.stringify(argList).replace(/'/g, "''");
  return [
    `$target = '${t}'`,
    `$args = ConvertFrom-Json '${argJson}'`,
    "if ($args.Count -gt 0) { Start-Process -FilePath $target -ArgumentList $args } else { Start-Process -FilePath $target }",
    "'ok'",
  ].join("; ");
}

export function formatLaunchResult(value) {
  if (!value.ok) return `win_launch failed: ${value.error || "denied"}`;
  const args = (value.args || []).join(" ");
  return `launched: ${value.target}${args ? ` ${args}` : ""}`;
}
```

</details>

#### 缺口

- 未运行 WSL、PowerShell 或 Windows 应用
  **影响**：不能确认实际程序身份、启动与参数行为
  **进一步探讨**：隔离环境验证路径、参数、超时和目标进程

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
