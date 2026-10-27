# dsh-wsl-editor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[0bc7619](https://github.com/173787247/dsh-wsl-editor/tree/0bc7619da7b473a622ae9e498d19fd0360162261)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-editor)
<!-- END META -->

> **实现功能**：将WSL路径转换后在Windows编辑器打开，支持Code/Cursor行列定位和命令存在查询。

> **核心亮点**：减少跨系统路径转换和编辑器goto命令步骤。详见[Q01](#research-q01)。

> **风险与缺陷**：启动完成不等文档验收，相对路径非session cwd，逐重试超时未与宿主取消联动。详见[Q03](#research-q03)。

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
  - [Q01 · 从WSL打开Windows编辑器有什么价值？](#detail-section-11)
  - [Q02 · 路径和程序如何解析，启动依赖是什么？](#detail-section-12)
  - [Q03 · ok和超时是否代表文件已正确打开？](#detail-section-13)
  - [Q04 · 测试与使用成本有哪些证据？](#detail-section-14)
  - [Q05 · 采用建议和继续探讨方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL开发者在Windows桌面查看源码/日志。详见[Q01](#research-q01)。

手工wslpath和Windows编辑器CLI；插件是启动桥而非文档同步。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 路径转换/打开 | 桌面查看文件 | 非文档验收 |
| goto | Code/Cursor行列 | Notepad忽略 |
| 命令状态 | 查询可解析名 | 非可读/可写证明 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/tools | 模型入口 | ABI匹配 |
| WSL/wslpath | 路径转换 | 非WSL拒绝 |
| PowerShell/编辑器.exe | 启动 | PATH/shim差异 |
| GUI与目标权限 | 文档可见 | 启动ok不保证 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 查编辑器状态 | 用户 | 实际.exe可用 |
| 明确绝对路径/程序 | 用户 | 真实目标正确 |
| 发打开请求 | 工具 | 返回只表示启动链 |
| 观察文档/行列 | 用户 | 重试前核结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL/编辑器PATH | 核目标路径/程序 | 依Windows PATH/WSL访问；准备耗时未知 |
| 持续使用 | wslpath/PowerShell/GUI | 桌面资源与定位确认 | 无独立模型调用；窗口/进程资源和定位延迟未计量 |
| 失败恢复 | 可能迟到/重复窗口，无插件文件写入 | 先核窗口与外部文档，再决定重试 | 先查迟到窗口再重试；外部文档恢复时间未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 跨路径打开 | realpath/wslpath | 相对路径进程cwd |
| 行列定位 | Code/Cursor -g | 非窗口结果验收 |
| 可用性查询 | Get-Command | 与实际.exe启动不同 |

> **思考**：启动完成不等文档验收，相对路径非session cwd，逐重试超时未与宿主取消联动。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少跨系统路径转换和编辑器goto命令步骤。详见[Q01](#research-q01)。

减少跨系统路径转换和编辑器goto命令步骤。详见[Q01](#research-q01)。

固定参数与单引号处理可查，测试仅格式，需最终argv/取消和错误分层。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

启动完成不等文档验收，相对路径非session cwd，逐重试超时未与宿主取消联动。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

显式绝对路径试用并人工确认文档，重试核现状。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定启动链可查，接受相对进程cwd路径且ok不证明文档/行列实际打开。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/editor.js、lib/wsl-host.js、test/editor.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整65行入口/173行编辑器/57行wsl-host/23行测试及README/package；不启动编辑器或执行目标。
- 下一步：从多会话相对路径/UNC空格/非exe shim和迟到窗口继续核。

**分析版本**

- **仓库**：[173787247/dsh-wsl-editor](https://github.com/173787247/dsh-wsl-editor)
- **版本号**：0.1.1（[固定提交 0bc7619](https://github.com/173787247/dsh-wsl-editor/tree/0bc7619da7b473a622ae9e498d19fd0360162261)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究会话目标解析/分层启动状态与统一取消，比较错文件和重复窗口，尚未验证。详见[Q05](#research-q05)。

从多会话相对路径/UNC空格/非exe shim和迟到窗口继续核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 126 | — | — | 773 |
| .js | source | 3 | 295 | 263 | 4 | — |
| .js | test | 1 | 23 | 20 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+created%3A2026-09-22T07%3A17%3A46.963Z..2026-10-22T07%3A17%3A46.963Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A17%3A46.963Z..2026-10-22T07%3A17%3A46.963Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Linux到Windows编辑器启动如何发生，路径归属、定位与启动成功的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从WSL打开Windows编辑器有什么价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向工具跑WSL、人在Windows桌面看文件的开发者，win_editor将Linux路径交wslpath转Windows路径，再启动Cursor/Code/Notepad；win_editor_status探Windows命令存在。比手工转路径、切终端、写goto参数少几步，尤其日志和源码定位有用。它不编辑或保存文件、不同步工作区，也不证明目标窗口已打开正确文档；编辑器后续访问/修改由该程序和用户承担。

Cursor/Code用-g支持行列，Notepad忽略定位；auto顺序cursor→code→notepad。贡献是跨系统路径和桌面启动接线，不是新的编辑器协作协议或远程文件系统。默认执行是模型工具动作，会产生桌面窗口，使用者应明确要打开的路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-50](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/README.md#L46-L50)

作者工具说明。

```text
| Tool | Args | Notes |
|------|------|-------|
| `win_editor` | `path`, optional `editor`, `line`, `column` | Cursor/Code use `-g file:line:column`; notepad ignores line/column |
| `win_editor_status` | (none) | Reports which of cursor / code / notepad are on the Windows PATH |

```

**依据 2 · 源码核查**：[lib/editor.js:95-141](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L95-L141)

实际启动和返回。

<details>
<summary>查看原文（47行）</summary>

```text
  if (!raw) return { ok: false, error: "missing path" };
  const abs = raw.startsWith("~/") ? `${homedir()}${raw.slice(1)}` : resolve(raw);
  if (!abs.startsWith("/")) return { ok: false, path: abs, error: "Linux absolute path required" };
  if (!existsSync(abs)) return { ok: false, path: abs, error: "path not found" };
  const win = await toWindows(realpathSync(abs));
  if (!win) return { ok: false, path: abs, error: "wslpath failed" };

  const line = args?.line;
  const column = args?.column;
  const pref = args?.editor || "auto";
  const order = pref === "auto" ? ["cursor", "code", "notepad"] : [pref];
  const target = gotoTarget(win, line, column);
  const hasGoto = target !== win;

  for (const editor of order) {
    try {
      if (editor === "notepad") {
        // Notepad has no reliable line/column goto; open file only.
        await runPowerShell(
          `Start-Process notepad.exe -ArgumentList @('${escapePsSingle(win)}')`,
          { timeoutMs: 15_000 },
        );
      } else {
        const argsList = hasGoto
          ? `@('-g', '${escapePsSingle(target)}')`
          : `@('${escapePsSingle(win)}')`;
        await runPowerShell(
          `Start-Process '${editor}.exe' -ArgumentList ${argsList}`,
          { timeoutMs: 15_000 },
        );
      }
      const out = { ok: true, path: abs, windowsPath: win, editor };
      if (hasGoto && editor !== "notepad") {
        const l = Number(line);
        if (Number.isFinite(l) && l >= 1) out.line = Math.trunc(l);
        const c = Number(column);
        if (Number.isFinite(c) && c >= 1) out.column = Math.trunc(c);
      }
      return out;
    } catch {
      // try next
    }
  }
  return { ok: false, path: abs, windowsPath: win, error: "no editor launched" };
}

export async function executeStatus() {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径和程序如何解析，启动依赖是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口apply时detectWsl，两个工具非WSL返回not running；检测信任变量或kernel含microsoft。参数说明要求绝对Linux路径，但execute对相对值直接resolve，结果自然以/开头，因此实际上接受相对宿主进程cwd路径，未绑定agent session cwd。~/用宿主homedir展开，exists后realpath追链接，再固定execFile wslpath -w。

PowerShell脚本把路径单引号翻倍，程序是有限枚举，避免直接插入用户shell；wsl-host优先固定C盘powershell路径再PATH，参数-NoProfile/-NonInteractive/-Command。Windows编辑器必须在Windows可解析命令路径，状态Get-Command先.exe再裸名；启动仅使用.exe，因此状态可见裸命令不等实际启动可用。Node>=18、WSL互操作/wslpath/Windows PowerShell和GUI会话均为依赖，插件自己不安装编辑器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/editor.js:14-35](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L14-L35)

参数描述。

<details>
<summary>查看原文（22行）</summary>

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["path"],
    properties: {
      path: { type: "string", description: "Absolute Linux path (or ~/…) to open." },
      editor: {
        type: "string",
        enum: ["auto", "cursor", "code", "notepad"],
        description: "Editor preference (default auto: cursor → code → notepad).",
      },
      line: {
        type: "integer",
        description: "1-based line to open (Cursor/VS Code only; notepad ignores).",
      },
      column: {
        type: "integer",
        description: "1-based column (Cursor/VS Code only; requires line).",
      },
    },
  };
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:80-113](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L80-L113)

转换/实际相对路径。

<details>
<summary>查看原文（34行）</summary>

```text
async function toWindows(abs) {
  try {
    const { stdout } = await execFileAsync("wslpath", ["-w", abs], { timeout: 5000, encoding: "utf8" });
    return String(stdout).trim();
  } catch {
    return "";
  }
}

function escapePsSingle(s) {
  return String(s).replace(/'/g, "''");
}

export async function execute(args) {
  const raw = typeof args?.path === "string" ? args.path.trim() : "";
  if (!raw) return { ok: false, error: "missing path" };
  const abs = raw.startsWith("~/") ? `${homedir()}${raw.slice(1)}` : resolve(raw);
  if (!abs.startsWith("/")) return { ok: false, path: abs, error: "Linux absolute path required" };
  if (!existsSync(abs)) return { ok: false, path: abs, error: "path not found" };
  const win = await toWindows(realpathSync(abs));
  if (!win) return { ok: false, path: abs, error: "wslpath failed" };

  const line = args?.line;
  const column = args?.column;
  const pref = args?.editor || "auto";
  const order = pref === "auto" ? ["cursor", "code", "notepad"] : [pref];
  const target = gotoTarget(win, line, column);
  const hasGoto = target !== win;

  for (const editor of order) {
    try {
      if (editor === "notepad") {
        // Notepad has no reliable line/column goto; open file only.
        await runPowerShell(
```

</details>

**依据 3 · 源码核查**：[lib/editor.js:145-173](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L145-L173)

状态裸名回退。

<details>
<summary>查看原文（29行）</summary>

```text
foreach ($n in $names) {
  $cmd = Get-Command ($n + '.exe') -ErrorAction SilentlyContinue;
  if (-not $cmd) { $cmd = Get-Command $n -ErrorAction SilentlyContinue };
  $result[$n] = [bool]$cmd;
}
($result | ConvertTo-Json -Compress)
`;
  try {
    const { stdout } = await runPowerShell(ps, { timeoutMs: 15_000 });
    const raw = String(stdout || "").trim();
    const jsonLine = raw.split(/\r?\n/).filter(Boolean).pop() || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(jsonLine);
    } catch {
      return { ok: false, error: "failed to parse Get-Command result", raw };
    }
    return {
      ok: true,
      editors: {
        cursor: Boolean(parsed.cursor),
        code: Boolean(parsed.code),
        notepad: Boolean(parsed.notepad),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
```

</details>

**依据 4 · 源码核查**：[index.js:25-47](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/index.js#L25-L47)

WSL门与两工具。

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
    presentCall: () => ({ card: "generic", title: "win_editor" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "win_editor failed", content: result.content }
        : { card: "generic", title: "win_editor", content: result.content }
    ),
  });

  ctx.tools.register({
    name: "win_editor_status",
    description: "Probe which of cursor/code/notepad.exe are available on the Windows PATH (Get-Command).",
    parameters: core.statusParameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.formatStatus(value) }],
    },
    timeoutMs,
```

</details>

**依据 5 · 源码核查**：[lib/wsl-host.js:14-40](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/wsl-host.js#L14-L40)

PowerShell解析。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[package.json:14-18](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/package.json#L14-L18)

Node。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · ok和超时是否代表文件已正确打开？

**研究主题**：缺陷与关键质疑

#### 完整回答

execute只等待PowerShell命令结束，之后立即ok，不检查新窗口、目标文件或行列；Start-Process也不带-PassThru/Wait和显式失败对象。auto仅在runPowerShell抛错时切下一个，具体非终止错误是否导致进程非零仍取决PowerShell行为，不能把“没有抛异常”当编辑器文档打开验收。路径含空格、引号、UNC和行列等最终argv语义需实际目标程序契约，脚本层单引号转义不等所有程序参数端到端一致。

状态报告只是Get-Command存在，不测编辑器能读WSL路径。exists与realpath之间有文件变化窗口，realpath异常没本地catch会让工具抛错；任意可见路径/符号链接目标都可被打开，没有工作区允许范围，它本来是广域打开器而非隔离保护。使用时应展示真实目标、避免把相对路径当会话目录。

wslpath局部5秒，逐编辑器PowerShell各15秒，auto最多三轮，外层默认15秒且无取消signal透传，宿主返回超时后窗口仍可能被迟后拉起。isConcurrencySafe表示无插件共享写状态，不能推桌面操作不会重叠或重复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/editor.js:95-142](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L95-L142)

异常/回退/ok时机。

<details>
<summary>查看原文（48行）</summary>

```text
  if (!raw) return { ok: false, error: "missing path" };
  const abs = raw.startsWith("~/") ? `${homedir()}${raw.slice(1)}` : resolve(raw);
  if (!abs.startsWith("/")) return { ok: false, path: abs, error: "Linux absolute path required" };
  if (!existsSync(abs)) return { ok: false, path: abs, error: "path not found" };
  const win = await toWindows(realpathSync(abs));
  if (!win) return { ok: false, path: abs, error: "wslpath failed" };

  const line = args?.line;
  const column = args?.column;
  const pref = args?.editor || "auto";
  const order = pref === "auto" ? ["cursor", "code", "notepad"] : [pref];
  const target = gotoTarget(win, line, column);
  const hasGoto = target !== win;

  for (const editor of order) {
    try {
      if (editor === "notepad") {
        // Notepad has no reliable line/column goto; open file only.
        await runPowerShell(
          `Start-Process notepad.exe -ArgumentList @('${escapePsSingle(win)}')`,
          { timeoutMs: 15_000 },
        );
      } else {
        const argsList = hasGoto
          ? `@('-g', '${escapePsSingle(target)}')`
          : `@('${escapePsSingle(win)}')`;
        await runPowerShell(
          `Start-Process '${editor}.exe' -ArgumentList ${argsList}`,
          { timeoutMs: 15_000 },
        );
      }
      const out = { ok: true, path: abs, windowsPath: win, editor };
      if (hasGoto && editor !== "notepad") {
        const l = Number(line);
        if (Number.isFinite(l) && l >= 1) out.line = Math.trunc(l);
        const c = Number(column);
        if (Number.isFinite(c) && c >= 1) out.column = Math.trunc(c);
      }
      return out;
    } catch {
      // try next
    }
  }
  return { ok: false, path: abs, windowsPath: win, error: "no editor launched" };
}

export async function executeStatus() {
  const ps = `
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:80-88](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L80-L88)

wslpath超时。

```text
async function toWindows(abs) {
  try {
    const { stdout } = await execFileAsync("wslpath", ["-w", abs], { timeout: 5000, encoding: "utf8" });
    return String(stdout).trim();
  } catch {
    return "";
  }
}

```

**依据 3 · 源码核查**：[index.js:8-29](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/index.js#L8-L29)

外层超时/无signal。

<details>
<summary>查看原文（22行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_editor",
    order: 118,
    text: "Use win_editor to open a WSL Linux path in Windows Cursor/VS Code/Notepad (optional line/column for Cursor/Code). Use win_editor_status to see which editors are on PATH.",
  });

  ctx.tools.register({
    name: "win_editor",
    description: "Open a WSL Linux path in Windows Cursor/VS Code/Notepad. Optional line/column for Cursor/Code (-g file:line:column).",
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

**依据 4 · 源码核查**：[lib/editor.js:145-173](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L145-L173)

状态仅命令存在。

<details>
<summary>查看原文（29行）</summary>

```text
foreach ($n in $names) {
  $cmd = Get-Command ($n + '.exe') -ErrorAction SilentlyContinue;
  if (-not $cmd) { $cmd = Get-Command $n -ErrorAction SilentlyContinue };
  $result[$n] = [bool]$cmd;
}
($result | ConvertTo-Json -Compress)
`;
  try {
    const { stdout } = await runPowerShell(ps, { timeoutMs: 15_000 });
    const raw = String(stdout || "").trim();
    const jsonLine = raw.split(/\r?\n/).filter(Boolean).pop() || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(jsonLine);
    } catch {
      return { ok: false, error: "failed to parse Get-Command result", raw };
    }
    return {
      ok: true,
      editors: {
        cursor: Boolean(parsed.cursor),
        code: Boolean(parsed.code),
        notepad: Boolean(parsed.notepad),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
```

</details>

#### 缺口

- PowerShell Start-Process最终argv/非终止错误与目标编辑器窗口结果
  **影响**：工具ok不足以证明空格/UNC路径和定位正确，auto失败语义可能偏弱
  **进一步探讨**：以固定PowerShell/编辑器版本契约核启动参数和退出码，并设计空格/引号/无程序反例

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试与使用成本有哪些证据？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

23行测试直接导入format/formatStatus/gotoTarget，覆盖正常行列与0行退化，未测试execute的路径/cwd、realpath变化、PowerShell最终参数、auto错误或取消。优点是wslpath走execFile固定参数，PowerShell单引号转义明确，WSL门和Notepad忽略行列如实表达；但不能用格式测试证明窗口行为。wsl-host通用辅助含runCmd，本插件实际不调用。

首次核Windows PATH和WSL文件访问，显式绝对路径更可控；持续每次一wslpath与一个或多个PowerShell进程，打开GUI有资源/焦点成本，无独立模型API但参数/返回路径进宿主上下文。失败后先看是否已打开再重试，避免迟到/重复窗口；插件不写数据，无持久状态撤销，编辑器外部改动/未保存文档由读者管理。没有节时或错误率对照。

#### 证据与依据

**依据 1 · 源码核查**：[test/editor.test.js:1-23](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/test/editor.test.js#L1-L23)

仅格式/goto测试。

<details>
<summary>查看原文（23行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { format, formatStatus, gotoTarget } from "../lib/editor.js";

describe("win_editor", () => {
  it("formats", () => {
    assert.match(format({ ok: true }), /ok/i);
  });

  it("builds goto target file:line:column", () => {
    assert.equal(gotoTarget("C:\\a.ts", 10, 5), "C:\\a.ts:10:5");
    assert.equal(gotoTarget("C:\\a.ts", 10), "C:\\a.ts:10");
    assert.equal(gotoTarget("C:\\a.ts"), "C:\\a.ts");
    assert.equal(gotoTarget("C:\\a.ts", 0, 1), "C:\\a.ts");
  });

  it("formats status", () => {
    assert.match(
      formatStatus({ ok: true, editors: { cursor: true, code: false, notepad: true } }),
      /cursor: available/,
    );
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:80-142](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L80-L142)

启动资源和参数。

<details>
<summary>查看原文（63行）</summary>

```text
async function toWindows(abs) {
  try {
    const { stdout } = await execFileAsync("wslpath", ["-w", abs], { timeout: 5000, encoding: "utf8" });
    return String(stdout).trim();
  } catch {
    return "";
  }
}

function escapePsSingle(s) {
  return String(s).replace(/'/g, "''");
}

export async function execute(args) {
  const raw = typeof args?.path === "string" ? args.path.trim() : "";
  if (!raw) return { ok: false, error: "missing path" };
  const abs = raw.startsWith("~/") ? `${homedir()}${raw.slice(1)}` : resolve(raw);
  if (!abs.startsWith("/")) return { ok: false, path: abs, error: "Linux absolute path required" };
  if (!existsSync(abs)) return { ok: false, path: abs, error: "path not found" };
  const win = await toWindows(realpathSync(abs));
  if (!win) return { ok: false, path: abs, error: "wslpath failed" };

  const line = args?.line;
  const column = args?.column;
  const pref = args?.editor || "auto";
  const order = pref === "auto" ? ["cursor", "code", "notepad"] : [pref];
  const target = gotoTarget(win, line, column);
  const hasGoto = target !== win;

  for (const editor of order) {
    try {
      if (editor === "notepad") {
        // Notepad has no reliable line/column goto; open file only.
        await runPowerShell(
          `Start-Process notepad.exe -ArgumentList @('${escapePsSingle(win)}')`,
          { timeoutMs: 15_000 },
        );
      } else {
        const argsList = hasGoto
          ? `@('-g', '${escapePsSingle(target)}')`
          : `@('${escapePsSingle(win)}')`;
        await runPowerShell(
          `Start-Process '${editor}.exe' -ArgumentList ${argsList}`,
          { timeoutMs: 15_000 },
        );
      }
      const out = { ok: true, path: abs, windowsPath: win, editor };
      if (hasGoto && editor !== "notepad") {
        const l = Number(line);
        if (Number.isFinite(l) && l >= 1) out.line = Math.trunc(l);
        const c = Number(column);
        if (Number.isFinite(c) && c >= 1) out.column = Math.trunc(c);
      }
      return out;
    } catch {
      // try next
    }
  }
  return { ok: false, path: abs, windowsPath: win, error: "no editor launched" };
}

export async function executeStatus() {
  const ps = `
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-53](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/wsl-host.js#L34-L53)

PowerShell/cmd辅助区分。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}

export async function runCmd(args, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("cmd.exe");
  const { stdout, stderr } = await execFileAsync(bin, args, {
    timeout: timeoutMs,
    windowsHide: true,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用建议和继续探讨方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

标准WSL/Windows开发者可按显式绝对路径试用，先win_editor_status，再指定编辑器并人工看文档和定位；tool ok只当启动请求已提交，不作文件成功打开/可写证明。重要或敏感文件先确认真实realpath，自动重试前核窗口现状。特殊挂载、非exe shim或必须严格会话cwd者需先解决契约。

可继续研究以会话cwd明确解析、返回解析后真实路径/目标程序及启动状态，把“命令存在/进程启动/文档定位”分层；统一deadline和取消并标未知结果避免重复启动。基线为当前进程cwd和PowerShell完成即ok，反例为A/B会话相对路径、含空格UNC、裸code但无code.exe、wslpath失败、迟到窗口与auto多次启动。比较错文件率、重复窗口、定位准确度与人工步骤，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/editor.js:95-142](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L95-L142)

基线。

<details>
<summary>查看原文（48行）</summary>

```text
  if (!raw) return { ok: false, error: "missing path" };
  const abs = raw.startsWith("~/") ? `${homedir()}${raw.slice(1)}` : resolve(raw);
  if (!abs.startsWith("/")) return { ok: false, path: abs, error: "Linux absolute path required" };
  if (!existsSync(abs)) return { ok: false, path: abs, error: "path not found" };
  const win = await toWindows(realpathSync(abs));
  if (!win) return { ok: false, path: abs, error: "wslpath failed" };

  const line = args?.line;
  const column = args?.column;
  const pref = args?.editor || "auto";
  const order = pref === "auto" ? ["cursor", "code", "notepad"] : [pref];
  const target = gotoTarget(win, line, column);
  const hasGoto = target !== win;

  for (const editor of order) {
    try {
      if (editor === "notepad") {
        // Notepad has no reliable line/column goto; open file only.
        await runPowerShell(
          `Start-Process notepad.exe -ArgumentList @('${escapePsSingle(win)}')`,
          { timeoutMs: 15_000 },
        );
      } else {
        const argsList = hasGoto
          ? `@('-g', '${escapePsSingle(target)}')`
          : `@('${escapePsSingle(win)}')`;
        await runPowerShell(
          `Start-Process '${editor}.exe' -ArgumentList ${argsList}`,
          { timeoutMs: 15_000 },
        );
      }
      const out = { ok: true, path: abs, windowsPath: win, editor };
      if (hasGoto && editor !== "notepad") {
        const l = Number(line);
        if (Number.isFinite(l) && l >= 1) out.line = Math.trunc(l);
        const c = Number(column);
        if (Number.isFinite(c) && c >= 1) out.column = Math.trunc(c);
      }
      return out;
    } catch {
      // try next
    }
  }
  return { ok: false, path: abs, windowsPath: win, error: "no editor launched" };
}

export async function executeStatus() {
  const ps = `
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:145-173](https://github.com/173787247/dsh-wsl-editor/blob/0bc7619da7b473a622ae9e498d19fd0360162261/lib/editor.js#L145-L173)

命令状态基线。

<details>
<summary>查看原文（29行）</summary>

```text
foreach ($n in $names) {
  $cmd = Get-Command ($n + '.exe') -ErrorAction SilentlyContinue;
  if (-not $cmd) { $cmd = Get-Command $n -ErrorAction SilentlyContinue };
  $result[$n] = [bool]$cmd;
}
($result | ConvertTo-Json -Compress)
`;
  try {
    const { stdout } = await runPowerShell(ps, { timeoutMs: 15_000 });
    const raw = String(stdout || "").trim();
    const jsonLine = raw.split(/\r?\n/).filter(Boolean).pop() || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(jsonLine);
    } catch {
      return { ok: false, error: "failed to parse Get-Command result", raw };
    }
    return {
      ok: true,
      editors: {
        cursor: Boolean(parsed.cursor),
        code: Boolean(parsed.code),
        notepad: Boolean(parsed.notepad),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
