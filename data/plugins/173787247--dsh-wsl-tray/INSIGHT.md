# dsh-wsl-tray-launcher

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7ad45d3](https://github.com/173787247/dsh-wsl-tray/tree/7ad45d3db6672fb07ab909135c3c479ee5dee72a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tray)
<!-- END META -->

> **功能**：生成Windows PowerShell快捷方式和可选AHK托盘入口，调用可信WSL kit启动/诊断并打开token URL。

> **亮点**：集中发行版、UNC、PowerShell/BOM和token URL互操作接线，核心启动与运行依赖kit/AHK而非本插件实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：fallback使用未导入readdirSync，Bash路径引用、并发/取消与顺序超时存在静态边界，shortcut失败仍可ok:true；token来源只简单匹配。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要这个工具，生成物怎样成为Windows入口？](#detail-section-11)
  - [Q02 · 相比手工快捷方式贡献是什么，关键失效点有哪些？](#detail-section-12)
  - [Q03 · 启动退出、三阶段成本与效果如何衡量？](#detail-section-13)
  - [Q04 · 可复用工程及启动收据假设怎么验证？](#detail-section-14)
  - [Q05 · 当前适合谁采用，什么时候停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在WSL运行DSH且想从Windows桌面启动和诊断的维护者。

手工Windows快捷方式和WSL kit命令可替代；插件减少重复接线，也集中生成物和版本维护责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| status | 查看kit/生成物路径 | 不证明入口可运行 |
| install_scripts | PS1与桌面快捷方式 | 真实本地/Windows写入，失败hint需看 |
| install_tray | AHK脚本和依赖检测 | 不自动运行托盘，需AHK v2 |
| token/health | 调用kit与打开入口 | 仅简单URL匹配，外部kit需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL、Windows互操作与DSH tools/systemPrompt | 主链必需 | 检测与工具注册 | 非WSL返回错误 |
| 可信dsh-wsl-kit及restart/health等脚本 | 启动链必需 | 真正启动/重启/诊断 | 当前只核对restart脚本存在 |
| Windows PowerShell及可达WSL UNC路径 | 快捷方式必需 | Test-Path/COM创建与运行 | 失败可能只在hint而ok仍true |
| AutoHotkey v2 | 托盘运行必需 | 执行生成AHK | 未装仅提示，不自动启动 |
| 本地tray目录和桌面写权限 | 安装必需 | PS1/AHK/.lnk | 同步覆盖生成物，未见回滚 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者明确可信kitPath/发行版，备份已有tray脚本 | 不只依赖自动发现或存在即可信 |
| 查询 | 使用status核对路径 | status不证明快捷方式可运行 |
| 生成 | 明确选择install_scripts或install_tray | 分别检查文件、shortcutHint和AHK依赖 |
| 使用/退出 | 人工审查生成物后运行，退出AHK并清理计划任务/快捷方式 | 卸载插件不自动清外部生成物 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/kit/PowerShell/AHK，金额未知 | 发行版、路径、脚本和启动方式核对 | 无强制模型调用 |
| 持续使用 | 外部重启/relay/health与托盘进程 | token失效、kit变化和桌面入口维护 | 不是本插件提供完整服务可用性 |
| 失败恢复 | 重建脚本/.lnk、手动启动和kit排错 | 区分生成、路径、token、进程与服务故障 | 多步写入无自动回滚，恢复人时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可达入口 | 生成PS1/AHK和快捷方式请求 | 跨真实Windows/发行版运行质量 |
| token衔接 | 读取/tmp/dsh-ui-url并打开/复制 | URL来源真实性、可用性与浏览器任务成功 |
| 诊断 | 可调用kit health脚本 | health含义由未审计kit实现决定 |

> **思考**：fallback使用未导入readdirSync，Bash路径引用、并发/取消与顺序超时存在静态边界，shortcut失败仍可ok:true；token来源只简单匹配。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中发行版、UNC、PowerShell/BOM和token URL互操作接线，核心启动与运行依赖kit/AHK而非本插件实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是跨WSL/Windows路径转换、发行版从WSL环境或wslpath获取、PowerShell单引号处理、PS1 BOM与创建shortcut前Test-Path；这些是具体互操作经验。默认status和缺kit明确报错降低误写，但生成/快捷方式/启动各阶段结果仍混合。

<a id="detail-section-5"></a>

### 1.4 主要限制

fallback使用未导入readdirSync，Bash路径引用、并发/取消与顺序超时存在静态边界，shortcut失败仍可ok:true；token来源只简单匹配。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，优先核对生成路径/分步结果与可信kit，再评估可丢弃环境；超时或hint失败先盘点不盲重试。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持托盘脚本和Windows快捷方式生成的跨系统接线；生成不等成功启动，缺失目录枚举导入及重入/取消使结果保证不足。版本绑定生成/启动与恢复收据尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/tray.js、package.json、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全部index/tray与wsl-host主要路径；不执行Windows/WSL/AHK/kit，不创建快捷方式，外部kit未审计。
- 下一步：进一步探讨可从特殊路径、缺发行版、Test-Path失败、第二写失败与取消桩入手，核对分步结果和恢复材料。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tray](https://github.com/173787247/dsh-wsl-tray)
- **版本号**：0.2.4（[固定提交 7ad45d3](https://github.com/173787247/dsh-wsl-tray/tree/7ad45d3db6672fb07ab909135c3c479ee5dee72a)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨生成物与启动收据，绑定kit/脚本版本、串行可恢复写入并逐步报告；有跨系统状态和隐私成本，未验证。详见[Q04](#research-q04)。

进一步探讨可从特殊路径、缺发行版、Test-Path失败、第二写失败与取消桩入手，核对分步结果和恢复材料。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 164 | — | — | 1162 |
| .js | source | 3 | 574 | 401 | 146 | — |
| .js | test | 1 | 116 | 82 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+created%3A2026-09-22T05%3A43%3A05.977Z..2026-10-22T05%3A43%3A05.977Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A43%3A05.977Z..2026-10-22T05%3A43%3A05.977Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查WSL到Windows托盘/快捷方式的生成、可信路径与部分副作用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个工具，生成物怎样成为Windows入口？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合在WSL运行DSH、希望从Windows桌面启动/重启和打开web入口的个人维护者。输入为action、kitPath及发行版环境，输出状态或PS1/AHK文件及快捷方式提示。合格任务是目标发行版的可信kit真实启动服务并打开正确token URL，不能只看ok:true。

Host注册wsl_tray，非WSL拒绝。status报告路径；安装动作找kit restart脚本，写home/.dsh/tray中start/health/open脚本，再调用PowerShell测试UNC路径和COM创建桌面.lnk。install_tray另生成AHK并检测Windows PATH里AHK，提示读者自行运行，没有自动启动托盘。真正重启/health来自kit；打开读取/tmp/dsh-ui-url而不是使用url参数作为直接入口。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:4-30](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/index.js#L4-L30)

注册、WSL门槛及执行。

<details>
<summary>查看原文（27行）</summary>

```text
export const name = "dsh-wsl-tray-launcher";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_tray",
    order: 112,
    text: "Use wsl_tray for WSL/Windows interop: Install or report a Windows tray/shortcut launcher for dsh web in WSL.",
  });

  ctx.tools.register({
    name: "wsl_tray",
    description: "Install or report a Windows tray/shortcut launcher for dsh web in WSL.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:357-394](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L357-L394)

status与路径。

<details>
<summary>查看原文（38行）</summary>

```text
export async function execute(args) {
  const action = ["install_scripts", "install_tray"].includes(args?.action)
    ? args.action
    : "status";
  const url =
    typeof args?.url === "string" && args.url.trim() ? args.url.trim() : "http://127.0.0.1:3081";
  const distro = distroName();
  const dir = join(homedir(), ".dsh", "tray");
  const startPs1 = join(dir, "start-dsh-web.ps1");
  const healthPs1 = join(dir, "check-dsh-health.ps1");
  const trayAhk = join(dir, "dsh-tray.ahk");
  const kit = resolveKitPath({ kitPath: args?.kitPath });
  const advice = [
    "install_scripts: PowerShell launcher + optional Desktop shortcut.",
    "install_tray: AutoHotkey v2 tray with Open(token) / Restart / Health. Install AHK from https://www.autohotkey.com/ if missing.",
    "Open always uses /tmp/dsh-ui-url (?token=). Bare :3081 is 401 on dsh ≥0.1.2.",
    "Set DSH_WSL_KIT to your dsh-wsl-kit checkout if auto-detect fails.",
    "Run the .ahk once at login, or pin start-dsh-web.ps1 to Task Scheduler.",
  ];
  if (!kit.ok) {
    advice.unshift(
      "dsh-wsl-kit not found — set DSH_WSL_KIT=/path/to/dsh-wsl-kit or pass kitPath=… then re-run install_scripts.",
    );
  }
  if (action === "status") {
    return {
      ok: kit.ok,
      action,
      distro,
      url,
      dir,
      kitPath: kit.path,
      kitSource: kit.source,
      startPs1: existsSync(startPs1) ? startPs1 : "",
      trayAhk: existsSync(trayAhk) ? trayAhk : "",
      advice,
      error: kit.ok ? "" : "kit_path_missing",
    };
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:408-442](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L408-L442)

生成脚本/快捷方式与AHK提示。

<details>
<summary>查看原文（35行）</summary>

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
  let autohotkeyPath = "";
  if (action === "install_tray") {
    const ps1Win = wslPathToWin(startPs1);
    const healthWin = wslPathToWin(healthPs1);
    const openWin = wslPathToWin(openUiPs1);
    writeFileSync(trayAhk, ahkBody(distro, url, ps1Win, kit.path, healthWin, openWin), "utf8");
    autohotkeyPath = await detectAutoHotkey();
    if (autohotkeyPath) {
      advice.unshift(`Double-click ${trayAhk} or run: "${autohotkeyPath}" "${wslPathToWin(trayAhk)}"`);
    } else {
      advice.unshift("AutoHotkey not found on Windows PATH — install v2, then double-click dsh-tray.ahk.");
    }
  }
  return {
    ok: true,
    action,
    distro,
    url,
    dir,
    kitPath: kit.path,
    kitSource: kit.source,
    startPs1,
    healthPs1,
    openUiPs1,
    trayAhk: action === "install_tray" ? trayAhk : "",
    autohotkeyPath,
    shortcutHint,
    advice,
  };
```

</details>

**依据 4 · 源码核查**：[lib/tray.js:141-176](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L141-L176)

token读取及打开。

<details>
<summary>查看原文（36行）</summary>

```text
    "function Get-DshTokenUrl {",
    "  $fromFile = (wsl.exe -d $distro -- bash -lc 'cat /tmp/dsh-ui-url 2>/dev/null').Trim()",
    "  if ($fromFile -match 'token=') { return $fromFile }",
    "  return ''",
    "}",
    "function Start-DshWsl {",
    // `&` rather than Start-Process -ArgumentList.
    //
    // Start-Process joins an -ArgumentList array with spaces and quotes nothing,
    // so the command string -- which is full of spaces and semicolons -- arrived
    // at bash as several argv entries and only the tail of it ran. Measured:
    //
    //   Start-Process ... @(..., 'bash', '-lc', 'echo ARG_TEST; echo second; whoami')
    //     -> prints "second" and the user name; ARG_TEST never ran
    //   & wsl.exe -d $d -- bash -lc 'echo ARG_TEST; echo second; whoami'
    //     -> prints all three
    //
    // That is why the desktop shortcut did nothing: the recovery path had never
    // worked, and the moment it was needed was the moment everything else was
    // already broken.
    //
    // The console flash is handled on the shortcut instead, where WindowStyle
    // applies to the PowerShell host that owns the window.
    `  & wsl.exe -d $distro -- bash -lc '${psQuote(bashRestart)}'`,
    "  Start-Sleep -Seconds 12",
    "  $url = Get-DshTokenUrl",
    "  if ($url) {",
    // Put it on the clipboard as well as opening it. The token is per-process,
    // so the clipboard is the one route that survives everything else going
    // wrong: if the browser opens into the wrong profile, or does not open at
    // all, the address is already somewhere it can be pasted. The detached
    // restart has always done this through dsh_open_browser; this path opened
    // the URL and stopped, so the safety net was missing on exactly the route a
    // person reaches for when nothing else works.
    "    Set-Clipboard -Value $url",
    "    Start-Process $url",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相比手工快捷方式贡献是什么，关键失效点有哪些？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是集中WSL发行版/UNC路径、PowerShell引用/BOM、kit重启与token URL衔接，减少跨系统手工接线。它不实现DSH启动核心或可靠性监控，kit、Windows、AHK和浏览器承担实际运行。注释记述历史修复是作者材料，不等本轮跨平台验收。

关键限制是可执行生成物只检查restart脚本存在，未固定kit版本/信任和完整health/revive依赖。kitPath被放进Bash单引号路径，psQuote只处理外层PowerShell，包含单引号的Linux路径没有在Bash层完整转义，可能破坏命令边界。token文件只以包含token=判断，未校验协议/host/目标来源，并会复制到剪贴板；不能当可信启动收据。

自动发现还调用未import的readdirSync，异常被catch后静默跳过Windows fallback；安装同步覆盖多份文件且标isConcurrencySafe=true，没有锁/回滚。两次PowerShell路径验证/快捷方式可顺序等15s+20s，超出工具默认15s，execute不接取消signal；超时不等无文件/快捷方式副作用。快捷方式失败只返回hint，最外层仍ok:true，应分步骤核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tray.js:1-4](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L1-L4)

未导入readdirSync。

```text
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { distroName, runPowerShell } from "./wsl-host.js";
```

**依据 2 · 源码核查**：[lib/tray.js:22-37](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L22-L37)

自动发现引用与吞异常。

<details>
<summary>查看原文（16行）</summary>

```text
const FALLBACK_KIT_PATHS = (() => {
  const home = process.env.HOME || "/home";
  const winHome = process.env.WSL_WINDOWS_HOME || "/mnt/c/Users";
  const out = [];
  if (process.env.DSH_WSL_KIT) out.push(process.env.DSH_WSL_KIT);
  out.push(`${home}/src/dsh-wsl-kit`);
  // /mnt/c/Users/<user>/... — discover the Windows profile name rather than assume it
  try {
    for (const name of readdirSync(winHome)) {
      out.push(`${winHome}/${name}/Desktop/AIFullStackDevelopment/dsh-wsl-kit`);
      out.push(`${winHome}/${name}/Desktop/dsh-wsl-kit`);
    }
  } catch {
    // /mnt/c may not be mounted (native Linux, CI) — the WSL path above still applies
  }
  return out.filter((p, i) => p && out.indexOf(p) === i);
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:85-98](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L85-L98)

kit仅核restart存在。

<details>
<summary>查看原文（14行）</summary>

```text
  const fromArg = String(kitPath || "").trim();
  if (fromArg && exists(join(fromArg, "scripts", "restart-dsh-web.sh"))) {
    return { ok: true, path: fromArg.replace(/\/+$/, ""), source: "arg" };
  }
  const fromEnv = String(env.DSH_WSL_KIT || "").trim();
  if (fromEnv && exists(join(fromEnv, "scripts", "restart-dsh-web.sh"))) {
    return { ok: true, path: fromEnv.replace(/\/+$/, ""), source: "env" };
  }
  for (const c of candidates) {
    if (exists(join(c, "scripts", "restart-dsh-web.sh"))) {
      return { ok: true, path: c.replace(/\/+$/, ""), source: "fallback" };
    }
  }
  return { ok: false, path: "", source: "missing" };
```

</details>

**依据 4 · 源码核查**：[lib/tray.js:112-119](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L112-L119)

外层psQuote与路径。

```text
function psQuote(command) {
  return String(command).replace(/'/g, "''");
}

export function ps1Body(distro, url, kitPath) {
  const restart = `${kitPath}/scripts/restart-dsh-web.sh`;
  const revive = `${kitPath}/scripts/revive-dsh.sh`;
  const health = `${kitPath}/scripts/check-dsh-health.sh`;
```

**依据 5 · 源码核查**：[lib/tray.js:133-164](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L133-L164)

Bash路径单引号插值。

<details>
<summary>查看原文（32行）</summary>

```text
  const bashRestart = `if [ -f '${revive}' ]; then bash '${revive}'; else bash '${restart}'; fi`;
  const bashHealth = `bash '${health}'; echo; read -n 1 -p 'Press any key...'`;
  // Bare :3081 is 401 on dsh ≥0.1.2 — never open without ?token= from /tmp/dsh-ui-url.
  return [
    "# Generated by dsh-wsl-tray — start dsh web (WSL) + localhost relay, then open token URL.",
    "# NEVER bookmark bare http://127.0.0.1:3081/ (401). Always open /tmp/dsh-ui-url after restart.",
    `# kitPath: ${kitPath}`,
    `$distro = '${distro.replace(/'/g, "''")}'`,
    "function Get-DshTokenUrl {",
    "  $fromFile = (wsl.exe -d $distro -- bash -lc 'cat /tmp/dsh-ui-url 2>/dev/null').Trim()",
    "  if ($fromFile -match 'token=') { return $fromFile }",
    "  return ''",
    "}",
    "function Start-DshWsl {",
    // `&` rather than Start-Process -ArgumentList.
    //
    // Start-Process joins an -ArgumentList array with spaces and quotes nothing,
    // so the command string -- which is full of spaces and semicolons -- arrived
    // at bash as several argv entries and only the tail of it ran. Measured:
    //
    //   Start-Process ... @(..., 'bash', '-lc', 'echo ARG_TEST; echo second; whoami')
    //     -> prints "second" and the user name; ARG_TEST never ran
    //   & wsl.exe -d $d -- bash -lc 'echo ARG_TEST; echo second; whoami'
    //     -> prints all three
    //
    // That is why the desktop shortcut did nothing: the recovery path had never
    // worked, and the moment it was needed was the moment everything else was
    // already broken.
    //
    // The console flash is handled on the shortcut instead, where WindowStyle
    // applies to the PowerShell host that owns the window.
    `  & wsl.exe -d $distro -- bash -lc '${psQuote(bashRestart)}'`,
```

</details>

**依据 6 · 源码核查**：[lib/tray.js:141-176](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L141-L176)

token仅字符串检查且复制打开。

<details>
<summary>查看原文（36行）</summary>

```text
    "function Get-DshTokenUrl {",
    "  $fromFile = (wsl.exe -d $distro -- bash -lc 'cat /tmp/dsh-ui-url 2>/dev/null').Trim()",
    "  if ($fromFile -match 'token=') { return $fromFile }",
    "  return ''",
    "}",
    "function Start-DshWsl {",
    // `&` rather than Start-Process -ArgumentList.
    //
    // Start-Process joins an -ArgumentList array with spaces and quotes nothing,
    // so the command string -- which is full of spaces and semicolons -- arrived
    // at bash as several argv entries and only the tail of it ran. Measured:
    //
    //   Start-Process ... @(..., 'bash', '-lc', 'echo ARG_TEST; echo second; whoami')
    //     -> prints "second" and the user name; ARG_TEST never ran
    //   & wsl.exe -d $d -- bash -lc 'echo ARG_TEST; echo second; whoami'
    //     -> prints all three
    //
    // That is why the desktop shortcut did nothing: the recovery path had never
    // worked, and the moment it was needed was the moment everything else was
    // already broken.
    //
    // The console flash is handled on the shortcut instead, where WindowStyle
    // applies to the PowerShell host that owns the window.
    `  & wsl.exe -d $distro -- bash -lc '${psQuote(bashRestart)}'`,
    "  Start-Sleep -Seconds 12",
    "  $url = Get-DshTokenUrl",
    "  if ($url) {",
    // Put it on the clipboard as well as opening it. The token is per-process,
    // so the clipboard is the one route that survives everything else going
    // wrong: if the browser opens into the wrong profile, or does not open at
    // all, the address is already somewhere it can be pasted. The detached
    // restart has always done this through dsh_open_browser; this path opened
    // the URL and stopped, so the safety net was missing on exactly the route a
    // person reaches for when nothing else works.
    "    Set-Clipboard -Value $url",
    "    Start-Process $url",
```

</details>

**依据 7 · 源码核查**：[lib/tray.js:290-305](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L290-L305)

顺序PowerShell超时与失败hint。

<details>
<summary>查看原文（16行）</summary>

```text
    const check = await runPowerShell(
      `if (Test-Path '${arg}') { 'RESOLVES' } else { 'MISSING' }`,
      { timeoutMs: 15_000 },
    );
    if (!String(check.stdout).includes("RESOLVES")) {
      return `(shortcut NOT written: ${startPs1Win} does not resolve from Windows)`;
    }

    await runPowerShell(
      `$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut("$env:USERPROFILE\\Desktop\\DSH WSL.lnk"); $s.TargetPath = 'powershell.exe'; $s.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + '${arg}' + '"'; $s.Save()`,
      { timeoutMs: 20_000 },
    );
    return "Desktop\\DSH WSL.lnk";
  } catch {
    return "(shortcut creation failed — use startPs1 manually)";
  }
```

</details>

**依据 8 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/index.js#L25-L29)

并发安全声明和无signal执行。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 9 · 源码核查**：[lib/tray.js:408-442](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L408-L442)

多文件写入及ok true。

<details>
<summary>查看原文（35行）</summary>

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
  let autohotkeyPath = "";
  if (action === "install_tray") {
    const ps1Win = wslPathToWin(startPs1);
    const healthWin = wslPathToWin(healthPs1);
    const openWin = wslPathToWin(openUiPs1);
    writeFileSync(trayAhk, ahkBody(distro, url, ps1Win, kit.path, healthWin, openWin), "utf8");
    autohotkeyPath = await detectAutoHotkey();
    if (autohotkeyPath) {
      advice.unshift(`Double-click ${trayAhk} or run: "${autohotkeyPath}" "${wslPathToWin(trayAhk)}"`);
    } else {
      advice.unshift("AutoHotkey not found on Windows PATH — install v2, then double-click dsh-tray.ahk.");
    }
  }
  return {
    ok: true,
    action,
    distro,
    url,
    dir,
    kitPath: kit.path,
    kitSource: kit.source,
    startPs1,
    healthPs1,
    openUiPs1,
    trayAhk: action === "install_tray" ? trayAhk : "",
    autohotkeyPath,
    shortcutHint,
    advice,
  };
```

</details>

#### 缺口

- 真实Windows/WSL对特殊路径、并发安装、超时及生成物运行未验证。
  **影响**：静态引用/副作用问题不能称已在宿主复现。
  **进一步探讨**：可先离线审查生成文本和进程桩，覆盖单引号/空格路径及取消，再按明确授权研究可丢弃环境。
- kit固定脚本与token文件权限/真实性不在本组件研究范围。
  **影响**：不能把读取URL或health成功解释为完整可信服务验收。
  **进一步探讨**：可固定kit提交，继续核查启动/relay/token生成权限及health判据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动退出、三阶段成本与效果如何衡量？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package真实名称为dsh-wsl-tray-launcher0.2.4，Node>=18；README repo安装与kit set说明不等独立全自动安装。AHK、kit和Windows脚本外部运行，停用DSH插件不会停止已有AHK或清理桌面/任务计划入口，需维护者分别盘点。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL、Windows互操作与DSH tools/systemPrompt | 主链必需 | 检测与工具注册 | 非WSL返回错误 |
| 可信dsh-wsl-kit及restart/health等脚本 | 启动链必需 | 真正启动/重启/诊断 | 当前只核对restart脚本存在 |
| Windows PowerShell及可达WSL UNC路径 | 快捷方式必需 | Test-Path/COM创建与运行 | 失败可能只在hint而ok仍true |
| AutoHotkey v2 | 托盘运行必需 | 执行生成AHK | 未装仅提示，不自动启动 |
| 本地tray目录和桌面写权限 | 安装必需 | PS1/AHK/.lnk | 同步覆盖生成物，未见回滚 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者明确可信kitPath/发行版，备份已有tray脚本 | 不只依赖自动发现或存在即可信 |
| 查询 | 使用status核对路径 | status不证明快捷方式可运行 |
| 生成 | 明确选择install_scripts或install_tray | 分别检查文件、shortcutHint和AHK依赖 |
| 使用/退出 | 人工审查生成物后运行，退出AHK并清理计划任务/快捷方式 | 卸载插件不自动清外部生成物 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | WSL/kit/PowerShell/AHK，金额未知 | 发行版、路径、脚本和启动方式核对 | 无强制模型调用 |
| 持续使用 | 外部重启/relay/health与托盘进程 | token失效、kit变化和桌面入口维护 | 不是本插件提供完整服务可用性 |
| 失败恢复 | 重建脚本/.lnk、手动启动和kit排错 | 区分生成、路径、token、进程与服务故障 | 多步写入无自动回滚，恢复人时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可达入口 | 生成PS1/AHK和快捷方式请求 | 跨真实Windows/发行版运行质量 |
| token衔接 | 读取/tmp/dsh-ui-url并打开/复制 | URL来源真实性、可用性与浏览器任务成功 |
| 诊断 | 可调用kit health脚本 | health含义由未审计kit实现决定 |

完整对照是手工WSL启动到同一个可用页面，与快捷方式流程比准确率、恢复时间和维护人时，不按文件生成数量计收益。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/package.json#L1-L19)

包名版本/Node。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "dsh-wsl-tray-launcher",
  "version": "0.2.4",
  "description": "Install or report a Windows tray/shortcut launcher for dsh web in WSL.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-tray.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-tray/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-tray#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:257-265](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L257-L265)

AHK检测。

```text
async function detectAutoHotkey() {
  try {
    const { stdout } = await runPowerShell(
      "(Get-Command AutoHotkey64.exe, AutoHotkey.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source)",
      { timeoutMs: 8_000 },
    );
    return stdout.trim().split(/\r?\n/).map((s) => s.trim()).find(Boolean) || "";
  } catch {
    return "";
```

**依据 3 · 源码核查**：[lib/tray.js:369-374](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L369-L374)

读者自行安排登录/任务计划。

```text
  const advice = [
    "install_scripts: PowerShell launcher + optional Desktop shortcut.",
    "install_tray: AutoHotkey v2 tray with Open(token) / Restart / Health. Install AHK from https://www.autohotkey.com/ if missing.",
    "Open always uses /tmp/dsh-ui-url (?token=). Bare :3081 is 401 on dsh ≥0.1.2.",
    "Set DSH_WSL_KIT to your dsh-wsl-kit checkout if auto-detect fails.",
    "Run the .ahk once at login, or pin start-dsh-web.ps1 to Task Scheduler.",
```

**依据 4 · 源码核查**：[lib/tray.js:408-442](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L408-L442)

外部生成物。

<details>
<summary>查看原文（35行）</summary>

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
  let autohotkeyPath = "";
  if (action === "install_tray") {
    const ps1Win = wslPathToWin(startPs1);
    const healthWin = wslPathToWin(healthPs1);
    const openWin = wslPathToWin(openUiPs1);
    writeFileSync(trayAhk, ahkBody(distro, url, ps1Win, kit.path, healthWin, openWin), "utf8");
    autohotkeyPath = await detectAutoHotkey();
    if (autohotkeyPath) {
      advice.unshift(`Double-click ${trayAhk} or run: "${autohotkeyPath}" "${wslPathToWin(trayAhk)}"`);
    } else {
      advice.unshift("AutoHotkey not found on Windows PATH — install v2, then double-click dsh-tray.ahk.");
    }
  }
  return {
    ok: true,
    action,
    distro,
    url,
    dir,
    kitPath: kit.path,
    kitSource: kit.source,
    startPs1,
    healthPs1,
    openUiPs1,
    trayAhk: action === "install_tray" ? trayAhk : "",
    autohotkeyPath,
    shortcutHint,
    advice,
  };
```

</details>

#### 缺口

- 没有同环境手动启动与桌面入口的完成率、耗时及恢复人时对照。
  **影响**：不能承诺更稳或省多少时间。
  **进一步探讨**：可按发行版/重启后失效token/缺AHK等任务记录真实页面可用、各步骤失败与维护人时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可复用工程及启动收据假设怎么验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是跨WSL/Windows路径转换、发行版从WSL环境或wslpath获取、PowerShell单引号处理、PS1 BOM与创建shortcut前Test-Path；这些是具体互操作经验。默认status和缺kit明确报错降低误写，但生成/快捷方式/启动各阶段结果仍混合。

可探讨未验证的“生成物与启动收据”。固定kit提交及脚本哈希，路径用分层安全参数传递而非拼Bash文本，生成前展示覆盖清单并串行原子保存；每步分别记录文件/UNC/快捷方式/AHK/启动token来源与服务结果，取消后盘点已完成写入。相对当前ok加hint，目标是让读者分清哪一步完成并可恢复旧生成物。代价是版本/备份、跨系统状态与token隐私管理。可用特殊字符路径、缺发行版、Test-Path失败、第二写失败和超时桩，比较误成功与恢复完整性；若仍未知副作用，应拒绝自动重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:45-64](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/wsl-host.js#L45-L64)

发行版与wslpath回退。

<details>
<summary>查看原文（20行）</summary>

```text
 * \\wsl.localhost\WSL\... does not.
 */
export function distroName({ env = process.env, run = defaultWslpath } = {}) {
  if (env.WSL_DISTRO_NAME) return env.WSL_DISTRO_NAME;
  const fromWslpath = run();
  if (fromWslpath) return fromWslpath;
  return "WSL";
}

function defaultWslpath() {
  try {
    // \\wsl.localhost\<distro>\   or the older \\wsl$\<distro>\
    const out = execFileSync("wslpath", ["-w", "/"], { encoding: "utf8", timeout: 5000 }).trim();
    const m = out.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)\\/);
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

```

</details>

**依据 2 · 源码核查**：[lib/tray.js:269-305](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L269-L305)

路径验证与shortcut。

<details>
<summary>查看原文（37行）</summary>

```text
async function createDesktopShortcut(startPs1Win) {
  try {
    // The value goes into a single-quoted PowerShell string, so the only
    // character that needs doubling is the single quote itself.
    //
    // It used to double backslashes as well. That was harmless while the
    // argument was a Linux path with none, and wrong the moment it became a UNC
    // path: the shortcut was written with \\\\wsl.localhost\\Ubuntu-24.04\\...,
    // which is not a path any Windows API resolves. The path is only useful if
    // it survives this function byte for byte.
    const arg = String(startPs1Win).replace(/'/g, "''");

    // Confirm the path resolves from Windows before writing it into a shortcut.
    //
    // A .lnk pointing at a host that does not exist fails silently: no window,
    // no error, nothing left to read afterwards. This one was written with the
    // wrong distro name -- \\wsl.localhost\WSL\... -- and double-clicking it did
    // nothing at all. That is the worst possible shape for a recovery entry
    // point: the moment it is needed is the moment nothing else works either,
    // so there is nothing else to tell you why. Better to write no shortcut and
    // say so.
    const check = await runPowerShell(
      `if (Test-Path '${arg}') { 'RESOLVES' } else { 'MISSING' }`,
      { timeoutMs: 15_000 },
    );
    if (!String(check.stdout).includes("RESOLVES")) {
      return `(shortcut NOT written: ${startPs1Win} does not resolve from Windows)`;
    }

    await runPowerShell(
      `$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut("$env:USERPROFILE\\Desktop\\DSH WSL.lnk"); $s.TargetPath = 'powershell.exe'; $s.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + '${arg}' + '"'; $s.Save()`,
      { timeoutMs: 20_000 },
    );
    return "Desktop\\DSH WSL.lnk";
  } catch {
    return "(shortcut creation failed — use startPs1 manually)";
  }
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:323-354](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L323-L354)

UNC路径及BOM。

<details>
<summary>查看原文（32行）</summary>

```text
function wslPathToWin(path, distro = distroName()) {
  const drive = path.match(/^\/mnt\/([a-z])\/(.*)$/i);
  if (drive) return `${drive[1].toUpperCase()}:\\${drive[2].replace(/\//g, "\\")}`;
  if (path.startsWith("/")) {
    // UNC, and not \\wsl$ -- the older form works too, but \\wsl.localhost is
    // the one Microsoft documents and the one that resolves without the dollar.
    return `\\\\wsl.localhost\\${distro}${path.replace(/\//g, "\\")}`;
  }
  return path;
}

/**
 * Write a file for Windows PowerShell 5.1 to read.
 *
 * The BOM is required, not cosmetic. Without it powershell.exe decodes a .ps1
 * as the system ANSI code page -- GBK here -- and GBK is multi-byte, so a
 * lead byte consumes the following byte and the whole stream shifts. Any
 * non-ASCII character inside a single-quoted string then swallows the quote
 * that was meant to close it:
 *
 *   Start-DshWeb.ps1:24  字符串缺少终止符: '
 *
 * The generated health script had a dash only in a comment and worked; the
 * start script had one inside two strings and did not. Neither reported
 * anything useful, and the failing line was byte-identical to the working one,
 * which is what made this take so long to see.
 *
 * UTF-8 with BOM is what PowerShell 5.1 detects reliably. PowerShell 7 defaults
 * to UTF-8 anyway, so the BOM costs nothing there.
 */
function writePs1(path, body) {
  writeFileSync(path, "\uFEFF" + body, "utf8");
```

</details>

**依据 4 · 源码核查**：[lib/tray.js:408-442](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L408-L442)

假设针对分步结果混合。

<details>
<summary>查看原文（35行）</summary>

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
  let autohotkeyPath = "";
  if (action === "install_tray") {
    const ps1Win = wslPathToWin(startPs1);
    const healthWin = wslPathToWin(healthPs1);
    const openWin = wslPathToWin(openUiPs1);
    writeFileSync(trayAhk, ahkBody(distro, url, ps1Win, kit.path, healthWin, openWin), "utf8");
    autohotkeyPath = await detectAutoHotkey();
    if (autohotkeyPath) {
      advice.unshift(`Double-click ${trayAhk} or run: "${autohotkeyPath}" "${wslPathToWin(trayAhk)}"`);
    } else {
      advice.unshift("AutoHotkey not found on Windows PATH — install v2, then double-click dsh-tray.ahk.");
    }
  }
  return {
    ok: true,
    action,
    distro,
    url,
    dir,
    kitPath: kit.path,
    kitSource: kit.source,
    startPs1,
    healthPs1,
    openUiPs1,
    trayAhk: action === "install_tray" ? trayAhk : "",
    autohotkeyPath,
    shortcutHint,
    advice,
  };
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前适合谁采用，什么时候停止？

**研究主题**：采用判断

#### 完整回答

推荐observe。互操作接线有实际场景，但未导入fallback、特殊路径Bash引用、顺序超时/并发与假成功语义影响恢复入口本身。作为故障时要依赖的入口，不能只因文件生成成功就推荐启用。

继续探讨可先离线检查生成脚本、修路径/结果边界，再固定可信kit和无敏感可丢弃WSL环境按明确授权评估。遇到kit来源不明、token URL不是预期host、shortcutHint失败、超时后实际写入不清或并发生成覆盖时，应停止自动重试并盘点文件/桌面入口。Q02和Q03结果明确后再评估trial；本轮未执行Windows动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tray.js:22-37](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L22-L37)

fallback缺口。

<details>
<summary>查看原文（16行）</summary>

```text
const FALLBACK_KIT_PATHS = (() => {
  const home = process.env.HOME || "/home";
  const winHome = process.env.WSL_WINDOWS_HOME || "/mnt/c/Users";
  const out = [];
  if (process.env.DSH_WSL_KIT) out.push(process.env.DSH_WSL_KIT);
  out.push(`${home}/src/dsh-wsl-kit`);
  // /mnt/c/Users/<user>/... — discover the Windows profile name rather than assume it
  try {
    for (const name of readdirSync(winHome)) {
      out.push(`${winHome}/${name}/Desktop/AIFullStackDevelopment/dsh-wsl-kit`);
      out.push(`${winHome}/${name}/Desktop/dsh-wsl-kit`);
    }
  } catch {
    // /mnt/c may not be mounted (native Linux, CI) — the WSL path above still applies
  }
  return out.filter((p, i) => p && out.indexOf(p) === i);
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:133-164](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L133-L164)

命令文本边界。

<details>
<summary>查看原文（32行）</summary>

```text
  const bashRestart = `if [ -f '${revive}' ]; then bash '${revive}'; else bash '${restart}'; fi`;
  const bashHealth = `bash '${health}'; echo; read -n 1 -p 'Press any key...'`;
  // Bare :3081 is 401 on dsh ≥0.1.2 — never open without ?token= from /tmp/dsh-ui-url.
  return [
    "# Generated by dsh-wsl-tray — start dsh web (WSL) + localhost relay, then open token URL.",
    "# NEVER bookmark bare http://127.0.0.1:3081/ (401). Always open /tmp/dsh-ui-url after restart.",
    `# kitPath: ${kitPath}`,
    `$distro = '${distro.replace(/'/g, "''")}'`,
    "function Get-DshTokenUrl {",
    "  $fromFile = (wsl.exe -d $distro -- bash -lc 'cat /tmp/dsh-ui-url 2>/dev/null').Trim()",
    "  if ($fromFile -match 'token=') { return $fromFile }",
    "  return ''",
    "}",
    "function Start-DshWsl {",
    // `&` rather than Start-Process -ArgumentList.
    //
    // Start-Process joins an -ArgumentList array with spaces and quotes nothing,
    // so the command string -- which is full of spaces and semicolons -- arrived
    // at bash as several argv entries and only the tail of it ran. Measured:
    //
    //   Start-Process ... @(..., 'bash', '-lc', 'echo ARG_TEST; echo second; whoami')
    //     -> prints "second" and the user name; ARG_TEST never ran
    //   & wsl.exe -d $d -- bash -lc 'echo ARG_TEST; echo second; whoami'
    //     -> prints all three
    //
    // That is why the desktop shortcut did nothing: the recovery path had never
    // worked, and the moment it was needed was the moment everything else was
    // already broken.
    //
    // The console flash is handled on the shortcut instead, where WindowStyle
    // applies to the PowerShell host that owns the window.
    `  & wsl.exe -d $distro -- bash -lc '${psQuote(bashRestart)}'`,
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:408-442](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js#L408-L442)

最外层成功不等真实启动。

<details>
<summary>查看原文（35行）</summary>

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
  let autohotkeyPath = "";
  if (action === "install_tray") {
    const ps1Win = wslPathToWin(startPs1);
    const healthWin = wslPathToWin(healthPs1);
    const openWin = wslPathToWin(openUiPs1);
    writeFileSync(trayAhk, ahkBody(distro, url, ps1Win, kit.path, healthWin, openWin), "utf8");
    autohotkeyPath = await detectAutoHotkey();
    if (autohotkeyPath) {
      advice.unshift(`Double-click ${trayAhk} or run: "${autohotkeyPath}" "${wslPathToWin(trayAhk)}"`);
    } else {
      advice.unshift("AutoHotkey not found on Windows PATH — install v2, then double-click dsh-tray.ahk.");
    }
  }
  return {
    ok: true,
    action,
    distro,
    url,
    dir,
    kitPath: kit.path,
    kitSource: kit.source,
    startPs1,
    healthPs1,
    openUiPs1,
    trayAhk: action === "install_tray" ? trayAhk : "",
    autohotkeyPath,
    shortcutHint,
    advice,
  };
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
