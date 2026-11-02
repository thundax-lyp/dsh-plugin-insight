# dsh-wsl-editor

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5e087d7](https://github.com/173787247/dsh-wsl-editor/tree/5e087d7cf57fe6bf8c15da89f95504251003fda3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-editor)
<!-- END META -->

> **功能**：在 Windows Cursor、VS Code 或 Notepad 中打开 WSL 路径并支持可选行列。

> **亮点**：[Q01](#research-q01) 减少路径转换和goto命令手填步骤，原生DSH双工具入口成立。

> **主要限制**：[Q02](#research-q02) launcher成功非文档验收；status和.exe启动不对称，相对path非session cwd，逐次预算/取消未贯通。

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
  - [Q01 · 跨OS编辑器入口为谁省什么？](#detail-section-11)
  - [Q02 · 打开成功和状态可用究竟证明什么？](#detail-section-12)
  - [Q03 · 启动、持续使用和恢复有什么隐含负担？](#detail-section-13)
  - [Q04 · 试用边界和下一步可检验方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在WSL完成任务后到Windows桌面查看源码/日志。

手工wslpath和code/cursor命令；插件不提供编辑器或远程开发。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 编辑器启动 | Windows查看WSL文档 | 进程接受非文档验收 |
| 行列goto | Code/Cursor定位 | Notepad忽略，最终argv未验 |
| 状态探测 | Get-Command可用性 | 不等实际.exe/文件可打开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/WSL/DSH | 必需 | 工具运行 | 版本声明未验 |
| wslpath/PowerShell/interop | 必需 | 转换与启动 | status不保证完整链 |
| Windows编辑器/桌面/PATH | 必需 | 真实查看 | .cmd与.exe可能不同 |
| 可信显式path | 试用前提 | 避免错文件/敏感打开 | 无工作区根限制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核PATH和绝对path | 可信样例可手动打开 |
| 启动 | Agent转换并调用 | 人工核文档/行列 |
| 异常 | 用户查迟到/重复窗口 | 不盲重试 |
| 退出 | 保存文档/关闭应用和工具 | 插件不撤销外部编辑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 既有编辑器/宿主 | PATH/桌面核对 | 工时未知 |
| 持续 | 转换/进程/GUI内存 | 确认文档 | 时延/资源未测 |
| 失败恢复 | 迟到/重复窗口 | 查状态与保存文档 | 无外部编辑回滚 |
| 退出 | 外部进程可能仍在 | 保存后关闭 | 关工具不等关应用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 转换 | realpath/wslpath | 实际UNC/空格行为 |
| 打开 | Start-Process返回 | 文档/行列被接受 |
| 可用性 | Get-Command | 最终.exe及GUI可用 |
| 效率 | 统一模型入口 | 节时/错误率 |

> **思考**：[Q02](#research-q02) launcher成功非文档验收；status和.exe启动不对称，相对path非session cwd，逐次预算/取消未贯通。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 减少路径转换和goto命令手填步骤，原生DSH双工具入口成立。

[Q02](#research-q02) realpath/单引号处理可查，最终argv与GUI完成分离，避免把启动成功写成用户结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) launcher成功非文档验收；status和.exe启动不对称，相对path非session cwd，逐次预算/取消未贯通。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 显式绝对路径/可信样例试用，人工确认文档；取消或失败先核窗口再重试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核全部运行JS，未启动编辑器/目标；可控显式路径试用，完成收据仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/editor.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读README/清单/65行入口/173行editor/57行host；复核全部旧findings，不执行目标、测试或外部编辑器。
- 下一步：受控空格/UNC/单引号与不同cwd、code.cmd-only、慢启动取消，核最终文档/行列和重复窗口。

**分析版本**

- **仓库**：[173787247/dsh-wsl-editor](https://github.com/173787247/dsh-wsl-editor)
- **版本号**：0.1.1（[固定提交 5e087d7](https://github.com/173787247/dsh-wsl-editor/tree/5e087d7cf57fe6bf8c15da89f95504251003fda3)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 会话目标与分层收据/统一deadline可降低错文件和重复窗口，若不优于手工即否定。

受控空格/UNC/单引号与不同cwd、code.cmd-only、慢启动取消，核最终文档/行列和重复窗口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 126 | — | — | 773 |
| .js | source | 3 | 295 | 263 | 4 | — |
| .js | test | 1 | 23 | 20 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-editor/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨OS打开链与真实文档验收、进程/取消边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨OS编辑器入口为谁省什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL中的DSH用户需要在Windows桌面查看刚生成的源码/日志并定位行列时，win_editor封装路径转换与Cursor/Code/Notepad启动，win_editor_status检查命令可用性。相对手工wslpath和编辑器命令，多的是模型工具内可用的统一参数和回退选择，不是新的编辑器或远程开发协议。合格结果应是正确文档/行列出现在预期桌面，进程成功不是完整验收。

原生入口确实注册两工具和提示，用户需重启DSH/新会话。只偶尔打开文件或已有code命令顺手者，插件未必优于原方法；没有任务对照不能声称已节时。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:36-49](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/README.md#L36-L49)

安装及两个工具声明。

<details>
<summary>查看原文（14行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-editor
# or local:
dsh plugin --profile web add /absolute/path/to/dsh-wsl-editor
```

Restart `dsh web` and open a **new** session. Tools: `win_editor`, `win_editor_status`.

| Tool | Args | Notes |
|------|------|-------|
| `win_editor` | `path`, optional `editor`, `line`, `column` | Cursor/Code use `-g file:line:column`; notepad ignores line/column |
| `win_editor_status` | (none) | Reports which of cursor / code / notepad are on the Windows PATH |
````

</details>

**依据 2 · 源码核查**：[index.js:17-51](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/index.js#L17-L51)

两个实际注册入口。

<details>
<summary>查看原文（35行）</summary>

```text
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
    isConcurrencySafe: () => true,
    async execute() {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.executeStatus();
```

</details>

#### 缺口

- 用户桌面任务/手工命令对照缺失。
  **影响**：便利未证明为净效率。
  **进一步探讨**：记录打开正确文档/行列和人工窗口定位时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 打开成功和状态可用究竟证明什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

path先trim、~或resolve展开、existsSync后realpath，再wslpath -w；未限定工作区根，权限依运行用户。相对路径虽然schema说绝对但仍被resolve接受，基于进程cwd而非session，可能打开错文件；realpath与exists分开也有竞态，异常未在这一层归类。

auto按cursor/code/notepad逐个Start-Process，路径单引号双写、editor由schema枚举；有行列则Cursor/Code用-g，不应虚构路径导致任意命令注入。但PowerShell Start-Process -ArgumentList仍需最终Windows argv核实，含空格等路径的实际定位未运行。返回ok仅PowerShell调用没抛，不证明窗口/文件/行列被应用接受。status用Get-Command先.exe再无后缀，而启动固定.exe，status available不保证启动可行。每候选15秒，另wslpath5秒，外层默认15秒及signal未贯通；失败回退可能打开重复/迟到窗口，工具isConcurrencySafe不阻止多次GUI启动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/editor.js:70-138](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/editor.js#L70-L138)

路径/goto/逐候选启动与返回。

<details>
<summary>查看原文（69行）</summary>

```text
/** Build Cursor/VS Code goto target: file, file:line, or file:line:column. */
export function gotoTarget(windowsPath, line, column) {
  const win = String(windowsPath || "");
  const l = Number(line);
  if (!Number.isFinite(l) || l < 1) return win;
  const c = Number(column);
  if (Number.isFinite(c) && c >= 1) return `${win}:${Math.trunc(l)}:${Math.trunc(c)}`;
  return `${win}:${Math.trunc(l)}`;
}

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
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:141-171](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/editor.js#L141-L171)

status与.exe启动不对称。

<details>
<summary>查看原文（31行）</summary>

```text
export async function executeStatus() {
  const ps = `
$names = @('cursor','code','notepad');
$result = @{};
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
```

</details>

**依据 3 · 源码核查**：[index.js:25-30](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/index.js#L25-L30)

未传signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
    },
```

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/wsl-host.js#L34-L41)

实际PowerShell argv。

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

- 最终Windows argv、真实文档和取消后窗口未验。
  **影响**：不能承诺空格/UNC/行列正确或失败无副作用。
  **进一步探讨**：用可控文件核空格/单引号/UNC路径、慢启动/取消和最终窗口数量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、持续使用和恢复有什么隐含负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Node>=18、匹配DSH、WSL/interop、wslpath/PowerShell及Windows桌面编辑器/PATH；探测到WSL不等这些都可用，作者套件兼容声明不等本轮验收。打开文件可能触发编辑器扩展/工作区信任与用户手工保存，插件不直接写文件但也不能把外部应用副作用当没有。路径信息进入工具上下文，敏感文件应先核授权。

首次安装/PATH与目标桌面核对，持续有进程/GUI内存和窗口管理时间，现金/延迟未知。失败先找迟到窗口/已打开文档，不能直接重试制造重复；不提供撤销外部编辑。退出先处理编辑器未保存文档，再关插件/窗口，移除工具并不关闭所有外部进程。没有实际运行成本/恢复记录，只能限定可控文件试用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-28](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/package.json#L14-L28)

运行和分发条件。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "files": [
    "index.js",
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[README.md:23-44](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/README.md#L23-L44)

作者兼容/新会话要求。

<details>
<summary>查看原文（22行）</summary>

````text
## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-editor` **0.1.1** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.1-rc.5`**) — single source of truth for the suite |
| **Kit set** | `full` or install alone |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-editor
# or local:
dsh plugin --profile web add /absolute/path/to/dsh-wsl-editor
```

Restart `dsh web` and open a **new** session. Tools: `win_editor`, `win_editor_status`.
````

</details>

**依据 3 · 源码核查**：[lib/editor.js:80-138](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/editor.js#L80-L138)

外部进程依赖与副作用。

<details>
<summary>查看原文（59行）</summary>

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
```

</details>

#### 缺口

- 宿主兼容、编辑器扩展行为及资源未知。
  **影响**：真实成本与权限可能超出打开文件便利。
  **进一步探讨**：用不含敏感内容的独立profile先核启动、退出和文档保存行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用边界和下一步可检验方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可用显式绝对路径、可信非敏感样例试用，并人工确认文档/行列；status只作线索，失败/取消先看窗口再重试。若目标不符或出现重复窗口，回手工wslpath/code并停止自动回退，保存外部文档。

可探索会话目标解析与分层启动收据：区分解析、launcher接受、用户确认文档三个状态，统一deadline/取消与回退策略。现有realpath、windowsPath和status已提供部分信息，增量是避免进程成功冒认文档验收及重复窗口。最小对照用不同session cwd、带空格UNC、仅code.cmd存在、慢启动取消，比较错文件/重复窗口、人工确认与额外等待。若收据无法观察最终应用状态或用户确认比手工更繁琐，否定；未实现且不把GUI启动取消当可撤销。

#### 证据与依据

**依据 1 · 源码核查**：[lib/editor.js:93-138](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/editor.js#L93-L138)

目标和启动状态基线。

<details>
<summary>查看原文（46行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/editor.js:141-168](https://github.com/173787247/dsh-wsl-editor/blob/5e087d7cf57fe6bf8c15da89f95504251003fda3/lib/editor.js#L141-L168)

现有status非完成证明。

<details>
<summary>查看原文（28行）</summary>

```text
export async function executeStatus() {
  const ps = `
$names = @('cursor','code','notepad');
$result = @{};
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
```

</details>

#### 缺口

- 会话收据/取消方案未实现。
  **影响**：不能计为已改善跨OS可靠性。
  **进一步探讨**：先比较手工打开和仅完善错误说明的简单替代。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
