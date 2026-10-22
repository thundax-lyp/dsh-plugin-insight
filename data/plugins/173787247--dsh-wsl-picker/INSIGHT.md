# dsh-wsl-picker

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[0cd8861](https://github.com/173787247/dsh-wsl-picker/tree/0cd8861e4240635693cf152c9c7635433e5980c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-picker)
<!-- END META -->

> **实现功能**：给 DSH Agent 浏览 WSL 与 Windows 挂载盘目录名称的只读工具。

> **核心亮点**：将 WSL/Windows 路径浏览和 IM 快捷入口暴露给 Agent，结果结构含 parent/chips/truncated。详见[Q01](#research-q01)。

> **风险与缺陷**：任意绝对路径和软链接可遍历目录名称；15 秒工具超时对同步文件系统调用的约束未经验证。详见[Q03](#research-q03)与[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 这个工具在 WSL 工作区选择链中承担什么？](#detail-section-11)
  - [Q02 · 路径解析、过滤和结果大小如何工作？](#detail-section-12)
  - [Q03 · WSL 门控和文件系统访问边界是什么？](#detail-section-13)
  - [Q04 · 超时与并发声明能否约束目录读取？](#detail-section-14)
  - [Q05 · 采用时应如何验证可用性并降低误选风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 用户在 /、/mnt 和 IM 工作区快捷入口中定位目录；并不登记工作区。详见[Q01](#research-q01)。

直接 shell ls/find 可定位目录；Agent 工具减少手工命令但增加路径暴露和权限核查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| WSL 目录浏览 | 选工作区路径 | 非 WSL 失败 |
| 过滤/截断 | 缩小列表 | 先全量读再截断 |
| 只读路径输出 | Agent 导航 | 元数据可暴露 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | 注册与提示 | Agent 无工具 |
| WSL 环境 | 必需 | Linux/Windows 挂载目录 | 返回 not WSL |
| 文件系统权限 | 必需 | readdir/stat | 路径错误或失败 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | profile add、重启 Web、新会话 | wsl_picker 可见 |
| 导航 | start=im 或 path=/mnt | 返回 entries/chips/parent |
| 缩窄 | filter/showHidden | 核 truncated 与 path |
| 后续 | 人工确认目标目录 | 再交其他工具处理 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web/WSL，金额未知 | 安装/重启/新会话 | 版本兼容未测 |
| 浏览 | 同步目录读/逐项 stat | 过滤并核路径 | 网络盘/大目录延迟未知 |
| 风险 | 路径元数据进入 Agent | 敏感目录授权/复核 | 宿主权限策略未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 快捷浏览 | /、/mnt、im chips | 目标挂载存在性 |
| 过滤定位 | 子串过滤/隐藏项开关 | 大目录完整性与延迟 |
| 只读 | 无写文件路径 | 宿主权限隔离 |

> **思考**：任意绝对路径和软链接可遍历目录名称；15 秒工具超时对同步文件系统调用的约束未经验证。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将 WSL/Windows 路径浏览和 IM 快捷入口暴露给 Agent，结果结构含 parent/chips/truncated。详见[Q01](#research-q01)。

将 WSL/Windows 路径浏览和 IM 快捷入口暴露给 Agent，结果结构含 parent/chips/truncated。详见[Q01](#research-q01)。

参数优先级、错误结构和截断标志明确；同步枚举及无根限制是部署边界。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

任意绝对路径和软链接可遍历目录名称；15 秒工具超时对同步文件系统调用的约束未经验证。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人 WSL 路径定位观察；敏感机器先核工具授权和目录暴露边界，大目录须确认截断。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核目录枚举和 WSL 门控；路径无工作区根限制，读取是同步且截断发生在全目录读取/排序之后；目标环境未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/picker.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/picker.js 和 lib/wsl-host.js；未运行目标 WSL/插件。旧 META 仅复用。
- 下一步：目标 WSL 测非 WSL 门控、挂载盘权限、软链接、敏感目录授权、大目录延迟/截断和新会话安装。

**分析版本**

- **仓库**：[173787247/dsh-wsl-picker](https://github.com/173787247/dsh-wsl-picker)
- **版本号**：0.1.1（[固定提交 0cd8861](https://github.com/173787247/dsh-wsl-picker/tree/0cd8861e4240635693cf152c9c7635433e5980c9)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为可配置浏览根、敏感路径策略、分页与异步限时枚举；先测大目录和宿主权限。详见[Q05](#research-q05)。

目标 WSL 测非 WSL 门控、挂载盘权限、软链接、敏感目录授权、大目录延迟/截断和新会话安装。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 127 | — | — | 741 |
| .js | source | 3 | 274 | 199 | 56 | — |
| .js | test | 1 | 27 | 23 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-picker/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**WSL 目录选择工具的只读范围、路径暴露和大目录成本是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个工具在 WSL 工作区选择链中承担什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

wsl_picker 是提供给 DSH Agent 的只读目录名称浏览工具，默认列 /，可经 /mnt 浏览 Windows 挂载盘，并有 ~/.dsh/im-workspace 快捷入口。它不登记、创建或选择 IM 工作区，也不读文件内容；适合让用户/Agent 找到目录路径，之后仍需其他工具实际进入或配置工作区。README 的套件关系和最低版本为作者声明，目标 WSL 未运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-20](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/README.zh.md#L5-L20)

作者限定浏览与不登记工作区

<details>
<summary>查看原文（16行）</summary>

````text
DeepSeek Harness 插件：从 / 与 /mnt Windows 盘符浏览 WSL 目录，便于选择工作区。

配套 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

## 在套件里的位置

列出 / 和 /mnt 下的目录，方便选工作区。不负责登记 IM 工作区。

```mermaid
flowchart LR
  agent["dsh agent"] --> tool["wsl_picker"] --> fs["/ 与 /mnt 目录列表"]
```

整套关系图和版本快照：[dsh-wsl-kit 中文说明](https://github.com/173787247/dsh-wsl-kit/blob/master/README.zh.md)。本插件是 **0.1.0**（full）。不要把那份总表抄进本 README。
````

</details>

**依据 2 · 源码核查**：[index.js:11-31](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/index.js#L11-L31)

注册系统提示与工具

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:wsl_picker",
    order: 111,
    text: "Use wsl_picker to browse WSL dirs (/ and /mnt). Pass start=im (or empty start) for ~/.dsh/im-workspace quick entries; optional filter substring.",
  });

  ctx.tools.register({
    name: "wsl_picker",
    description: "Browse WSL directories (/ and /mnt). start=im or empty start lists ~/.dsh/im-workspace; optional filter.",
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
    presentCall: () => ({ card: "generic", title: "wsl_picker" }),
```

</details>

**依据 3 · 源码核查**：[lib/picker.js:110-174](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L110-L174)

只列目录项名称/类型/路径

<details>
<summary>查看原文（65行）</summary>

```text
export async function execute(args, config = {}) {
  const maxEntries = Number(config.maxEntries) > 0 ? Number(config.maxEntries) : 200;
  const showHidden = args?.showHidden === true;
  const filterRaw = typeof args?.filter === "string" ? args.filter.trim() : "";
  const filterLc = filterRaw ? filterRaw.toLowerCase() : "";
  const { abs, quick } = resolveStart(args);
  const chips = buildChips();

  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
  }
  const parent = abs === "/" ? "/" : resolve(abs, "..");
  return {
    ok: true,
    path: abs,
    parent,
    chips,
    entries,
    truncated,
    filter: filterRaw || undefined,
    quick: quick || undefined,
  };
}
```

</details>

#### 缺口

- 与其他套件插件的完整交接未检查
  **影响：**不能把目录列表等同工作区注册或内容读取
  **进一步探讨：**目标 WSL 试用并核上游使用路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径解析、过滤和结果大小如何工作？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

参数允许 start 优先于 path；空 start 或 im 指向用户家目录下的 .dsh/im-workspace，缺省 /；相对路径被拼到根目录再 resolve，~/ 展开。执行时检查存在与目录、读名称，先去隐藏项/做大小写不敏感子串过滤、排序、按 maxEntries 截断，然后对每项 stat 区分目录/文件，返回 parent、chips、truncated。输出文本给出完整绝对路径。maxEntries 默认 200，但配置任意正数可放大；未实现分页游标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/picker.js:9-28](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L9-L28)

输入参数

<details>
<summary>查看原文（20行）</summary>

```text
export function parameters(config = {}) {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      path: {
        type: "string",
        description: "Directory to list (default /). Quick chips: /, /home, /mnt, /mnt/c, /mnt/d, im.",
      },
      start: {
        type: "string",
        description: "Starting directory (preferred over path). Empty or 'im' lists ~/.dsh/im-workspace/* quick entries.",
      },
      filter: {
        type: "string",
        description: "Case-insensitive substring filter on entry names.",
      },
      showHidden: { type: "boolean", description: "Include dotfiles (default false)." },
    },
  };
```

</details>

**依据 2 · 源码核查**：[lib/picker.js:68-108](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L68-L108)

快捷入口与路径解析

<details>
<summary>查看原文（41行）</summary>

```text
const CHIPS = ["/", "/home", "/mnt", "/mnt/c", "/mnt/d", "/mnt/e", "im"];

export function imWorkspaceRoot() {
  return join(homedir(), ".dsh", "im-workspace");
}

/** Resolve list root from start/path. Empty start or 'im' → ~/.dsh/im-workspace. */
export function resolveStart(args = {}) {
  const hasStart = typeof args.start === "string";
  const startRaw = hasStart ? args.start.trim() : null;
  const pathRaw = typeof args.path === "string" && args.path.trim() ? args.path.trim() : null;

  if (hasStart && (startRaw === "" || startRaw.toLowerCase() === "im")) {
    return { abs: imWorkspaceRoot(), quick: "im" };
  }
  if (startRaw) {
    if (startRaw.toLowerCase() === "im") return { abs: imWorkspaceRoot(), quick: "im" };
    const abs = resolveAbs(startRaw);
    return { abs, quick: null };
  }
  if (pathRaw) {
    if (pathRaw.toLowerCase() === "im") return { abs: imWorkspaceRoot(), quick: "im" };
    return { abs: resolveAbs(pathRaw), quick: null };
  }
  return { abs: "/", quick: null };
}

function resolveAbs(raw) {
  if (raw.startsWith("~/")) return `${homedir()}${raw.slice(1)}`;
  if (raw.startsWith("/")) return resolve(raw);
  return resolve(`/${raw}`);
}

function buildChips() {
  const im = imWorkspaceRoot();
  const chips = CHIPS.filter((c) => {
    if (c === "im") return existsSync(im);
    return existsSync(c) || c === "/";
  });
  return chips;
}
```

</details>

**依据 3 · 源码核查**：[lib/picker.js:110-174](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L110-L174)

列表/过滤/排序/截断与类型

<details>
<summary>查看原文（65行）</summary>

```text
export async function execute(args, config = {}) {
  const maxEntries = Number(config.maxEntries) > 0 ? Number(config.maxEntries) : 200;
  const showHidden = args?.showHidden === true;
  const filterRaw = typeof args?.filter === "string" ? args.filter.trim() : "";
  const filterLc = filterRaw ? filterRaw.toLowerCase() : "";
  const { abs, quick } = resolveStart(args);
  const chips = buildChips();

  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
  }
  const parent = abs === "/" ? "/" : resolve(abs, "..");
  return {
    ok: true,
    path: abs,
    parent,
    chips,
    entries,
    truncated,
    filter: filterRaw || undefined,
    quick: quick || undefined,
  };
}
```

</details>

#### 缺口

- 很大目录下的同步 readdir/stat 时延未测
  **影响：**不能承诺固定延迟或大目录完整浏览
  **进一步探讨：**大目录/权限错误/隐藏项/分页边界验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · WSL 门控和文件系统访问边界是什么？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

index.js 在 apply 时探测 WSL 环境，非 WSL 执行仅返回错误。WSL 上输入可解析到任意绝对目录，代码没有 / 与 /mnt 的根限制、路径许可表或敏感目录排除；软链接由 statSync 跟随，目录名称可暴露给有权调用该工具的 Agent/对话。它是只读枚举，不读文件内容，但仍涉及路径元数据；真实权限边界受宿主运行身份与工具授权控制，本仓库片段未证实授权行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/wsl-host.js#L21-L27)

WSL 检测规则

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 2 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/index.js#L7-L29)

非 WSL 门控及工具注册

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_picker",
    order: 111,
    text: "Use wsl_picker to browse WSL dirs (/ and /mnt). Pass start=im (or empty start) for ~/.dsh/im-workspace quick entries; optional filter substring.",
  });

  ctx.tools.register({
    name: "wsl_picker",
    description: "Browse WSL directories (/ and /mnt). start=im or empty start lists ~/.dsh/im-workspace; optional filter.",
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

**依据 3 · 源码核查**：[lib/picker.js:95-99](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L95-L99)

绝对路径可任意解析

```text
function resolveAbs(raw) {
  if (raw.startsWith("~/")) return `${homedir()}${raw.slice(1)}`;
  if (raw.startsWith("/")) return resolve(raw);
  return resolve(`/${raw}`);
}
```

**依据 4 · 源码核查**：[lib/picker.js:118-161](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L118-L161)

任意目录读取与 stat 跟随

<details>
<summary>查看原文（44行）</summary>

```text
  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
```

</details>

#### 缺口

- 宿主工具权限/用户确认策略未核
  **影响：**路径名可能泄露，不宜称限定在工作区
  **进一步探讨：**目标 DSH 授权检查与敏感路径策略审计

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时与并发声明能否约束目录读取？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

工具注册设置 15 秒默认 timeoutMs、声明 isConcurrencySafe=true，但核心 execute 内使用同步 existsSync/statSync/readdirSync 和逐项 statSync；同步文件系统操作会占用执行线程，外层超时能否及时中断这些调用需依宿主实现，源码不能证明。maxEntries 在读完整目录并排序后才截断，配置可放大。对慢网络挂载盘或海量目录，资源和响应成本不明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/index.js#L7-L29)

超时与并发设置

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_picker",
    order: 111,
    text: "Use wsl_picker to browse WSL dirs (/ and /mnt). Pass start=im (or empty start) for ~/.dsh/im-workspace quick entries; optional filter substring.",
  });

  ctx.tools.register({
    name: "wsl_picker",
    description: "Browse WSL directories (/ and /mnt). start=im or empty start lists ~/.dsh/im-workspace; optional filter.",
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

**依据 2 · 源码核查**：[lib/picker.js:110-161](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L110-L161)

同步读目录与截断时序

<details>
<summary>查看原文（52行）</summary>

```text
export async function execute(args, config = {}) {
  const maxEntries = Number(config.maxEntries) > 0 ? Number(config.maxEntries) : 200;
  const showHidden = args?.showHidden === true;
  const filterRaw = typeof args?.filter === "string" ? args.filter.trim() : "";
  const filterLc = filterRaw ? filterRaw.toLowerCase() : "";
  const { abs, quick } = resolveStart(args);
  const chips = buildChips();

  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
```

</details>

#### 缺口

- 宿主运行时调度、网络盘性能未测
  **影响：**不能把配置超时视为硬资源上限
  **进一步探讨：**在慢挂载/大目录测事件循环延迟和并发调用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用时应如何验证可用性并降低误选风险？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

个人 WSL 目录定位可试用：按 README 安装后重启 DSH Web、开新会话，先从 /、/mnt、im 快捷入口探路，再确认返回 path、parent、truncated。输出名称按 localeCompare 排序且只给首 maxEntries，筛选可能遗漏目标，Agent 应把路径交给用户核对，不应直接据此执行后续变更。可改进限定可列根目录/敏感路径策略、分页和异步或限时枚举；这些均是建议，未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:36-42](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/README.zh.md#L36-L42)

作者安装/新会话指引

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-picker
```

重启 `dsh web` 并开**新**会话。工具名：`wsl_picker`。
````

**依据 2 · 源码核查**：[lib/picker.js:57-65](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L57-L65)

文本结果形式

```text
export function format(v) {
  const lines = [`wsl_picker path=${v.path || "?"} ok=${v.ok}`];
  if (v.chips) lines.push(`chips: ${v.chips.join(" ")}`);
  if (v.parent) lines.push(`parent: ${v.parent}`);
  if (v.filter) lines.push(`filter: ${v.filter}`);
  for (const e of v.entries || []) lines.push(`${e.type === "dir" ? "[dir]" : "[file]"} ${e.path}`);
  if (v.truncated) lines.push("(truncated)");
  if (v.error) lines.push(`error: ${v.error}`);
  return lines.join("\n");
```

**依据 3 · 源码核查**：[lib/picker.js:147-174](https://github.com/173787247/dsh-wsl-picker/blob/0cd8861e4240635693cf152c9c7635433e5980c9/lib/picker.js#L147-L174)

排序、截断与返回结构

<details>
<summary>查看原文（28行）</summary>

```text
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
  }
  const parent = abs === "/" ? "/" : resolve(abs, "..");
  return {
    ok: true,
    path: abs,
    parent,
    chips,
    entries,
    truncated,
    filter: filterRaw || undefined,
    quick: quick || undefined,
  };
}
```

</details>

#### 缺口

- 安装成功率、路径误选率和改进效果未测
  **影响：**不能宣称安全或完整列举所有路径
  **进一步探讨：**目标 WSL 上测安装、目录规模和选择正确率

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
