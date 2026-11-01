# dsh-wsl-tray

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4aa74bb](https://github.com/173787247/dsh-wsl-tray/tree/4aa74bb5e72deafb6a24e052434c26cd50d89861)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tray)
<!-- END META -->

> **功能**：为 WSL 中的 DSH web 生成 Windows 启动脚本、快捷方式及可选托盘。

> **亮点**：集中启动、健康检查和 token URL 打开入口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：生成脚本会复制并打印 token URL，与 SECURITY 的不打印秘密声明存在冲突。[Q03](#research-q03)

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
  - [Q01 · 谁需要启动器，与手动启动相比有何差别？](#detail-section-11)
  - [Q02 · status 和安装具体做什么，是否等于启动成功？](#detail-section-12)
  - [Q03 · token 是否不被打印或暴露？](#detail-section-13)
  - [Q04 · 如何评估安装、覆盖和恢复？](#detail-section-14)
  - [Q05 · 已有 token 文件读取与备用剪贴板之外，怎样减少凭据暴露？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望从 Windows 方便启动 WSL DSH 的用户；基线是手工运行 kit 脚本。[Q01](#research-q01)

手工进入 WSL 运行可信 kit 启动脚本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态 | 检查 kit 和现有路径 | 不证明服务可用 |
| 安装 | 生成脚本及托盘 | 可能覆盖同名文件 |
| 打开 | 读取 token URL | 剪贴板和终端可见 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Windows、WSL 与 DSH | 必需 | 启动环境 | 手工排查 |
| 可信 dsh-wsl-kit | 安装需要 | 实际启动及健康脚本 | 不生成 |
| AutoHotkey v2 | 托盘需要 | 托盘菜单 | 使用脚本入口 |
| 凭据和文件保护 | 必需 | 防止 token 和覆盖风险 | 停止安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 检查 | 用户查询 status 并核对 kit 和已有文件 | 归属不明则停止 |
| 安装 | 授权后生成脚本和快捷方式 | 失败使用手工启动 |
| 验证 | 检查健康及 token 暴露范围 | 异常停止并恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Windows 和 WSL 环境 | 检查 kit 与备份 | 未实测 |
| 持续 | 脚本与服务资源 | 保护凭据 | 启动可靠性未知 |
| 恢复 | 覆盖已有文件风险 | 确认归属后恢复 | 不自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 入口 | 脚本与快捷方式生成 | 实机启动成功 |
| 凭据 | 从文件读并复制打印 URL | 浏览器及外部工具暴露 |

> **思考**：生成脚本会复制并打印 token URL，与 SECURITY 的不打印秘密声明存在冲突。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集中启动、健康检查和 token URL 打开入口。[Q01](#research-q01) [Q02](#research-q02)

status 不启动服务；安装写脚本，启动路径会复制并打印 token URL。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

生成脚本会复制并打印 token URL，与 SECURITY 的不打印秘密声明存在冲突。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先检查 status、kit 和文件归属，确认接受 token 暴露再决定是否安装。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持状态及脚本生成路径；未运行 Windows 或 kit。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、index.js、lib/tray.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 9 文件、无排除和解析错误；静态检查生成脚本与安装分支，未运行目标。
- 下一步：隔离 Windows 用户环境测试脚本覆盖、启动、失败与凭据暴露。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tray](https://github.com/173787247/dsh-wsl-tray)
- **版本号**：0.2.4（[固定提交 4aa74bb](https://github.com/173787247/dsh-wsl-tray/tree/4aa74bb5e72deafb6a24e052434c26cd50d89861)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：可选不复制/打印 URL 与覆盖前确认可减少暴露，须对照现有剪贴板兜底。[Q05](#research-q05)

隔离 Windows 用户环境测试脚本覆盖、启动、失败与凭据暴露。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 164 | — | — | 1162 |
| .js | source | 3 | 574 | 401 | 146 | — |
| .js | test | 1 | 116 | 82 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 启动器实际生成什么，token 和覆盖已有文件的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要启动器，与手动启动相比有何差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 Windows 上使用 WSL DSH web 的用户可通过生成的 PowerShell 快捷方式或可选 AutoHotkey 托盘启动、恢复和打开界面。相对手动进入 WSL 运行 kit 脚本，它集中入口，但仍依赖 kit、发行版和 Windows 环境；偶尔使用时手工命令可能更简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-40](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/README.md#L34-L40)

作者说明启动入口与一次性 token。

```text
Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

**Scope:** Windows tray/shortcut around kit start/restart/health. Open the URL with `?token=` from restart output or `/tmp/dsh-ui-url` (dsh ≥0.1.2).

## Why

Clicking a tray icon is easier than remembering WSL + `restart-dsh-web.sh`. The hard part after dsh **0.1.2** is the **one-shot launch token**: bare `http://127.0.0.1:3081/` returns **401**. Tray actions should open the token URL (or re-run restart so a fresh token is printed).
```

**依据 2 · 源码核查**：[index.js:4-29](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/index.js#L4-L29)

注册 WSL 工具。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

#### 缺口

- 未运行 Windows、WSL、快捷方式或 kit
  **影响**：无法验证启动、token 有效性和桌面集成
  **进一步探讨**：在隔离用户配置核对生成脚本、快捷方式、失败和凭据暴露

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · status 和安装具体做什么，是否等于启动成功？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

status 只检查 kit 路径及已有文件；安装先要求找到 kit，随后写入启动、健康检查、打开页面脚本并尝试创建桌面快捷方式，托盘选项另写 AHK 脚本并检测程序。生成成功不证明快捷方式、kit 脚本、服务或浏览器在目标机可用；写文件会覆盖同名生成文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tray.js:78-94](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L78-L94)

kit 解析优先顺序。

<details>
<summary>查看原文（17行）</summary>

```text
/** Resolve dsh-wsl-kit root: kitPath arg → DSH_WSL_KIT → existsSync candidates. */
export function resolveKitPath({
  kitPath = "",
  env = process.env,
  exists = existsSync,
  candidates = FALLBACK_KIT_PATHS,
} = {}) {
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
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:355-395](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L355-L395)

默认状态与现有路径检查。

<details>
<summary>查看原文（41行）</summary>

```text
}

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
  }
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:396-425](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L396-L425)

缺 kit 拒绝、写入脚本与可选托盘。

<details>
<summary>查看原文（30行）</summary>

```text
  if (!kit.ok) {
    return {
      ok: false,
      action,
      distro,
      url,
      dir,
      kitPath: "",
      advice,
      error: "kit_path_missing",
    };
  }
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
```

</details>

#### 缺口

- 未运行 Windows、WSL、快捷方式或 kit
  **影响**：无法验证启动、token 有效性和桌面集成
  **进一步探讨**：在隔离用户配置核对生成脚本、快捷方式、失败和凭据暴露

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · token 是否不被打印或暴露？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能如此断言。SECURITY 声称不得打印或返回 token，但生成启动脚本读取 /tmp/dsh-ui-url 后写入系统剪贴板、打开 URL 并打印 opened 加完整 URL；脚本内容明确包含这些动作。用户需视该 URL 为凭证，确认剪贴板和终端暴露范围；未运行目标，不能断言实际已泄露。

#### 证据与依据

**依据 1 · 作者声明**：[SECURITY.md:1-5](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/SECURITY.md#L1-L5)

作者声明不打印或返回秘密。

```text
# Security

`dsh-wsl-tray` must not log, print, or return secrets (tokens, passwords, PEM keys).
Launcher scripts only start `dsh web` in the configured WSL distro.

```

**依据 2 · 源码核查**：[lib/tray.js:135-144](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L135-L144)

从文件读取带 token 的 URL。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:165-180](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L165-L180)

启动路径复制、打开及打印 URL。

<details>
<summary>查看原文（16行）</summary>

```text
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
    "    Write-Host ('opened ' + $url)",
    "    Write-Host 'the same URL is on the clipboard'",
    "  } else {",
    "    Write-Host 'FAIL: no token URL in /tmp/dsh-ui-url — re-run restart-dsh-web.sh'",
```

</details>

#### 缺口

- 未运行 Windows、WSL、快捷方式或 kit
  **影响**：无法验证启动、token 有效性和桌面集成
  **进一步探讨**：在隔离用户配置核对生成脚本、快捷方式、失败和凭据暴露

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何评估安装、覆盖和恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖 Windows、WSL、可信 kit 脚本和 Windows PowerShell，可选托盘需要 AutoHotkey。先仅查 status、确认 kit 所有权及现有生成文件并备份；经用户授权再安装，检查快捷方式与服务健康。生成路径写入会覆盖同名文件，卸载或恢复前应确认归属；token 进入剪贴板与终端时不要分享，失败回手工启动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tray.js:78-94](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L78-L94)

kit 路径检查。

<details>
<summary>查看原文（17行）</summary>

```text
/** Resolve dsh-wsl-kit root: kitPath arg → DSH_WSL_KIT → existsSync candidates. */
export function resolveKitPath({
  kitPath = "",
  env = process.env,
  exists = existsSync,
  candidates = FALLBACK_KIT_PATHS,
} = {}) {
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
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:355-395](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L355-L395)

状态分支。

<details>
<summary>查看原文（41行）</summary>

```text
}

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
  }
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:396-425](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L396-L425)

写文件和可选 AHK。

<details>
<summary>查看原文（30行）</summary>

```text
  if (!kit.ok) {
    return {
      ok: false,
      action,
      distro,
      url,
      dir,
      kitPath: "",
      advice,
      error: "kit_path_missing",
    };
  }
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
```

</details>

**依据 4 · 源码核查**：[lib/tray.js:165-180](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L165-L180)

凭据 URL 输出。

<details>
<summary>查看原文（16行）</summary>

```text
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
    "    Write-Host ('opened ' + $url)",
    "    Write-Host 'the same URL is on the clipboard'",
    "  } else {",
    "    Write-Host 'FAIL: no token URL in /tmp/dsh-ui-url — re-run restart-dsh-web.sh'",
```

</details>

#### 缺口

- 未运行 Windows、WSL、快捷方式或 kit
  **影响**：无法验证启动、token 有效性和桌面集成
  **进一步探讨**：在隔离用户配置核对生成脚本、快捷方式、失败和凭据暴露

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有 token 文件读取与备用剪贴板之外，怎样减少凭据暴露？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：用户可选择只打开 token URL、不输出或复制，并在覆盖文件前展示差异与确认，可能减少凭据和配置意外暴露。已有 token 文件校验、打开流程和剪贴板兜底，不能把它们当新能力；不能保证浏览器、进程列表或外部脚本无泄露，未穷尽等价保护。隔离测试启动成功率、可观察 token 位置和恢复时间，对照现有路径；成功率下降或暴露未减少则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tray.js:135-144](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L135-L144)

已有 token 文件读取与检查。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/tray.js:165-180](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L165-L180)

已有剪贴板、打开及输出。

<details>
<summary>查看原文（16行）</summary>

```text
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
    "    Write-Host ('opened ' + $url)",
    "    Write-Host 'the same URL is on the clipboard'",
    "  } else {",
    "    Write-Host 'FAIL: no token URL in /tmp/dsh-ui-url — re-run restart-dsh-web.sh'",
```

</details>

**依据 3 · 源码核查**：[lib/tray.js:408-413](https://github.com/173787247/dsh-wsl-tray/blob/4aa74bb5e72deafb6a24e052434c26cd50d89861/lib/tray.js#L408-L413)

已有文件写入与快捷方式。

```text
  mkdirSync(dir, { recursive: true });
  const openUiPs1 = join(dir, "open-dsh-ui.ps1");
  writePs1(startPs1, ps1Body(distro, url, kit.path));
  writePs1(healthPs1, healthPs1Body(distro, kit.path));
  writePs1(openUiPs1, openUiPs1Body(distro));
  const shortcutHint = await createDesktopShortcut(wslPathToWin(startPs1, distro));
```

#### 缺口

- 未运行 Windows、WSL、快捷方式或 kit
  **影响**：无法验证启动、token 有效性和桌面集成
  **进一步探讨**：在隔离用户配置核对生成脚本、快捷方式、失败和凭据暴露

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
