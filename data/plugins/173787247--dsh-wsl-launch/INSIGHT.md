# dsh-wsl-launch

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2090dc0](https://github.com/173787247/dsh-wsl-launch/tree/2090dc095654c22ccf93b26d0a2ff0050bc4e380)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch)
<!-- END META -->

> **实现功能**：从 WSL 通过受配置名单约束的 win_launch 工具启动 Windows 应用。

> **核心亮点**：把 Windows 应用启动封装成 DSH 工具，并对目标名设默认 allowlist；详见[Q01](#research-q01)。

> **风险与缺陷**：allowlist 只核 target 字符串，args 与最终应用行为未限，前缀通配扩大范围；详见[Q02](#research-q02)。

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
  - [Q01 · win_launch 如何从 WSL 启动 Windows 应用？](#detail-section-11)
  - [Q02 · allowlist 限制的是可执行文件还是启动行为？](#detail-section-12)
  - [Q03 · 怎样采用并衡量启动可靠性与额外成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 DSH Agent 从 WSL 启动 VS Code、Explorer 或浏览器等 Windows 应用。

手工从 WSL 运行 PowerShell 或 wsl interop 启动 Windows 应用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| win_launch | 启动名单内 Windows 应用 | WSL/PowerShell；只限制 target，未限制 args |
| 默认 allowlist | 拒绝名单外 target 字符串 | 后缀/前缀匹配不保证最终应用行为 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL 与 Windows PowerShell | 必需 | 跨系统启动进程 | 返回 not running in WSL 或调用失败 |
| DSH tools/systemPrompt | 必需 | 注册工具与提示 | 工具不可用 |
| 允许的 Windows 应用 | 每次任务必需 | 真正执行目标 | PATH/文件缺失则失败 |
| dsh-wsl-kit | 可选套件 | 组合其他 WSL 工具 | 单插件仍可研究 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员核 WSL/PowerShell/目标 app 路径及 args | 只允许必要目标 |
| 加载 | 管理员安装插件、设置精确 allowlist | win_launch 可见 |
| 任务 | 用户授权启动，Agent 传 target/args | PowerShell 返回；仍需观察 GUI |
| 验收/恢复 | 用户核应用实际打开 | 若未就绪排查 PATH/参数/超时 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows 与目标应用、DSH；授权/许可费用未知 | 安装、配置精准 allowlist 并审参数；耗时未知 | Windows 应用需可用 |
| 持续使用 | 每次跨境调用 PowerShell/GUI 进程资源；量值未知 | 核目标是否真正打开，维护名单；耗时未知 | ok 不代表 GUI 就绪 |
| 失败恢复 | 超时、路径/应用错误后的重试可能增加资源；金额未知 | 排查 PATH/WSL/目标进程并人工重开；耗时未知 | 真实失败率未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目标名校验 | 源码有默认名单与匹配（Q02） | PATH 解析到的实际程序 |
| 启动调用 | 源码 PowerShell Start-Process（Q01） | GUI 是否成功打开/可用 |
| 参数传递 | JSON 列表和转义（Q02） | 被启动应用的参数副作用 |

> **思考**：allowlist 只核 target 字符串，args 与最终应用行为未限，前缀通配扩大范围；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Windows 应用启动封装成 DSH 工具，并对目标名设默认 allowlist；详见[Q01](#research-q01)。

把 Windows 应用启动封装成 DSH 工具，并对目标名设默认 allowlist；详见[Q01](#research-q01)。

execFile 不经 shell 调 powershell.exe；单引号转义及 JSON 参数列表；工具调用标记非并发安全。 包装器只等待PowerShell，无exec.signal或目标PID/GUI就绪回执，目标进程生命周期不由局部超时统一管理。

<a id="detail-section-5"></a>

### 1.4 主要限制

allowlist 只核 target 字符串，args 与最终应用行为未限，前缀通配扩大范围；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在需要 WSL 启动固定 Windows 应用时试用；先用精确名称/路径并审各应用 args，详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。目标文本名单与PowerShell接线成立，实际二进制、应用args和目标进程/GUI就绪不在名单/超时保证内。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/launch.js、lib/wsl-host.js、test/launch.test.js、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅；未从 WSL 启动 Windows 程序或执行目标测试。
- 下一步：在隔离 WSL 核真实路径、允许/拒绝目标、参数矩阵、目标 GUI 就绪与错误恢复。

**分析版本**

- **仓库**：[173787247/dsh-wsl-launch](https://github.com/173787247/dsh-wsl-launch)
- **版本号**：0.1.0（[固定提交 2090dc0](https://github.com/173787247/dsh-wsl-launch/tree/2090dc095654c22ccf93b26d0a2ff0050bc4e380)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

绝对路径与逐应用参数策略可能收窄启动授权，但需兼容验证；详见[Q03](#research-q03)。

在隔离 WSL 核真实路径、允许/拒绝目标、参数矩阵、目标 GUI 就绪与错误恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 177 | — | — | 899 |
| .js | source | 3 | 199 | 180 | 2 | — |
| .js | test | 1 | 19 | 16 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+created%3A2026-09-22T08%3A06%3A22.399Z..2026-10-22T08%3A06%3A22.399Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A06%3A22.399Z..2026-10-22T08%3A06%3A22.399Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 WSL Windows 启动工具的 allowlist 边界、脚本执行与运营成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · win_launch 如何从 WSL 启动 Windows 应用？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Host 注册 win_launch，接 target 与可选 args；启动时检测 WSL，工具调用时归一化 target、按 allowlist 校验，再用 PowerShell -NoProfile -NonInteractive -Command 执行 Start-Process。结果只表示 PowerShell 脚本返回，没有目标 GUI 已可见/就绪的确认。该包面向启动应用，打开 Linux 文件由套件另一个插件负责。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:10-89](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/index.js#L10-L89)

注册工具、WSL 检查、allowlist 与结果。

<details>
<summary>查看原文（80行）</summary>

```text
export const name = "dsh-wsl-launch";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowlist = Array.isArray(config.allowlist) && config.allowlist.length
    ? config.allowlist.map(String)
    : DEFAULT_ALLOWLIST;
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_launch",
    order: 118,
    text: [
      "Use win_launch to start an allowlisted Windows app (code, explorer.exe, browsers, etc.).",
      "Do not invent executables outside the allowlist; ask the user to extend config.allowlist if needed.",
      "Prefer dsh-wsl-open for opening Linux file paths; use win_launch for apps and Windows-native targets.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "win_launch",
    description: "Start an allowlisted Windows executable or shell command name from WSL.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["target"],
      properties: {
        target: {
          type: "string",
          description: "Executable name or path on Windows PATH / absolute Windows path (must match allowlist).",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Optional argument list.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          target: { type: "string" },
          args: { type: "array", items: { type: "string" } },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatLaunchResult(value) }],
    },
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
    },
    presentCall: () => ({ card: "generic", title: "Windows launch" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "Windows launch failed", content: result.content }
        : { card: "generic", title: "Windows launch", content: result.content }
    ),
```

</details>

**依据 2 · 源码核查**：[lib/wsl-host.js:21-41](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/lib/wsl-host.js#L21-L41)

WSL 探测、powershell execFile。

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

**依据 3 · 作者声明**：[README.md:37-52](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/README.md#L37-L52)

app 启动定位和默认 allowlist。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · allowlist 限制的是可执行文件还是启动行为？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

匹配大小写不敏感，可用精确名、Windows/Unix 路径后缀，或末尾 * 前缀；只检查 target 字符串。args 每项转字符串后进入 PowerShell JSON/Start-Process，没有业务参数 allowlist；扩展配置若写 msedge* 之类前缀会扩大可启动目标，PATH 名称也由 Windows 端解析。脚本把单引号加倍并用 JSON 包参数，可阻断直接 PowerShell 单引号逃逸的常见形式，但不能等同于被启动应用的参数/文件权限隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/launch.js:1-39](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/lib/launch.js#L1-L39)

目标匹配、通配与 PowerShell 构造。

<details>
<summary>查看原文（39行）</summary>

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
}

export const DEFAULT_ALLOWLIST = [
  "code",
  "code.cmd",
  "explorer.exe",
  "notepad.exe",
  "wt.exe",
  "windows terminal",
  "msedge.exe",
  "chrome.exe",
  "firefox.exe",
];

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

**依据 2 · 源码核查**：[index.js:64-74](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/index.js#L64-L74)

allowlist 仅校验 target，args 原样传脚本。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[test/launch.test.js:5-18](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/test/launch.test.js#L5-L18)

仅覆盖名称/后缀/通配和脚本文字。

<details>
<summary>查看原文（14行）</summary>

```text
describe("win_launch allowlist", () => {
  it("allows default names and paths ending with them", () => {
    assert.equal(matchesAllowlist("code", DEFAULT_ALLOWLIST), true);
    assert.equal(matchesAllowlist("C:\\\\Program Files\\\\Microsoft VS Code\\\\Code.exe", ["code.exe"]), true);
    assert.equal(matchesAllowlist("evil.exe", DEFAULT_ALLOWLIST), false);
  });

  it("supports trailing wildcards", () => {
    assert.equal(matchesAllowlist("msedge.exe", ["msedge*"]), true);
  });

  it("builds Start-Process script", () => {
    assert.match(buildLaunchScript("notepad.exe", ["a.txt"]), /Start-Process/);
  });
```

</details>

#### 缺口

- 未测不同目标应用对 args 的解析和 Windows PATH 劫持
  **影响**：allowlist 不能证明启动后的动作受限
  **进一步探讨**：按实际允许应用审参数与解析后的可执行文件路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样采用并衡量启动可靠性与额外成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需要WSL/可访问powershell.exe、DSH tools/systemPrompt和目标Windows应用。先核目标可执行来源与逐应用参数，精确名仍可匹配任意目录中的同名后缀，不是对二进制hash/签名授权。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/Windows 与目标应用、DSH；授权/许可费用未知 | 安装、配置精准 allowlist 并审参数；耗时未知 | Windows 应用需可用 |
| 持续使用 | 每次跨境调用 PowerShell/GUI 进程资源；量值未知 | 核目标是否真正打开，维护名单；耗时未知 | ok 不代表 GUI 就绪 |
| 失败恢复 | 超时、路径/应用错误后的重试可能增加资源；金额未知 | 排查 PATH/WSL/目标进程并人工重开；耗时未知 | 真实失败率未测 |

局部timeout限制PowerShell调用等待，代码不接exec.signal，也不追踪目标PID/GUI就绪；Start-Process后启动的应用不因工具取消/超时自动停止。包装器不检查目标画面或业务结果，重试前须先判断原应用是否已开，避免重复窗口或副作用。真实启动失败率、GUI资源和人工恢复量未知。

相对当前只校target文本，可探索先解析并授权绝对二进制路径/身份、逐应用参数schema和明确启动状态回执；不能把参数JSON转义当应用授权。代价是各主机安装路径、版本/签名与参数变化维护，PID存在仍非业务ready。最小反例包括同名不同路径、前缀通配、危险args、PowerShell等待超时但应用已开和重复重试。若仍非授权路径/参数启动，或失败回执诱导重复副作用，则假设失败；若误拒/维护负担抵消便利也不支持采用收益。未实现/未验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-18](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/index.js#L13-L18)

配置默认值与 WSL 检查。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowlist = Array.isArray(config.allowlist) && config.allowlist.length
    ? config.allowlist.map(String)
    : DEFAULT_ALLOWLIST;
  const wsl = detectWsl();
```

**依据 2 · 源码核查**：[lib/wsl-host.js:8-41](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/lib/wsl-host.js#L8-L41)

PowerShell 解析与等待预算。

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

**依据 3 · 作者声明**：[README.md:23-76](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/README.md#L23-L76)

兼容、安装、配置和测试说明。

<details>
<summary>查看原文（54行）</summary>

````text
---
## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-launch` **0.1.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.0-rc.2`**) — single source of truth for the suite |
| **Kit set** | `daily` (also in `github` / `full`; fetch+net also in `llm`) |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

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

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-launch
```

## Config

```yaml
- id: dsh-wsl-launch
  name: dsh-wsl-launch
  config:
    timeoutMs: 20000
    # allowlist: ["code", "explorer.exe", "msedge*"]
```

If `allowlist` is omitted or empty, defaults apply.

## Test

```sh
npm test
```
````

</details>

**依据 4 · 源码核查**：[index.js:62-83](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/index.js#L62-L83)

包装器仅await PowerShell完成，无exec.signal/PID/GUI回执。

<details>
<summary>查看原文（22行）</summary>

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
    },
```

</details>

**依据 5 · 源码核查**：[lib/launch.js:30-39](https://github.com/173787247/dsh-wsl-launch/blob/2090dc095654c22ccf93b26d0a2ff0050bc4e380/lib/launch.js#L30-L39)

构造Start-Process后常量ok，未取应用就绪信息。

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

#### 缺口

- 无真实 WSL 启动与单位调用时耗/资源样本
  **影响**：可靠性、资源与维护成本未知
  **进一步探讨**：记录测试目标应用启动/失败和人工恢复时间

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
