# dsh-wsl-search

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[445b0fd](https://github.com/173787247/dsh-wsl-search/tree/445b0fd89b128696f447f28ff6dd3b0c0964885e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search)
<!-- END META -->

> **实现功能**：把ripgrep、fd与ast-grep接成DSH模型搜索工具，检查起始根白名单并限制返回条目和文本长度。

> **核心亮点**：统一现成搜索器、模型参数及根检查，减少手写shell。详见[Q01](#research-q01)。

> **风险与缺陷**：默认HOME范围宽，先缓冲后全局截断且无截断标志，AST坐标和长度与rg未统一。详见[Q03](#research-q03)。

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
  - [Q01 · 为什么把命令行搜索做成模型工具？](#detail-section-11)
  - [Q02 · 三条搜索链和依赖是什么？](#detail-section-12)
  - [Q03 · 路径与输出限制能保证什么？](#detail-section-13)
  - [Q04 · 测试和成本支持怎样的判断？](#detail-section-14)
  - [Q05 · 采用条件和进一步探讨方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可信WSL项目内由模型查文本、文件名及AST模式。详见[Q01](#research-q01)。

模型直接调用rg/fd/ast-grep的shell流程，包装便利不等新算法或强沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 文本/文件/AST | 模型定位 | 外部CLI |
| 起始根检查 | 项目范围 | 默认HOME宽且非沙箱 |
| 输出切片 | 少上下文 | 完整性无标志 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18及宿主tools/systemPrompt | 注册 | ABI需匹配 |
| bash/PATH | 查找二进制 | 查找未独立超时 |
| rg/fd/ast-grep | 执行搜索 | sg身份/JSON版本需核 |
| 项目allowRoots | 收窄访问 | 空值默认整个HOME |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 装CLI并核路径 | 用户 | 不只看status非空 |
| 配项目白名单 | 用户 | 避免HOME秘密 |
| 选择搜索模式 | 模型 | 文本/文件/AST匹配 |
| 原工具核关键结果 | 用户 | 截断与坐标可解释 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/bash和搜索CLI | 固定版本/项目白名单 | 需固定CLI和项目根；安装/白名单核查工时未知 |
| 持续使用 | 扫描CPU/IO及结果上下文 | 审阅命中、核对坐标与截断 | 插件无LLM调用；扫描规模/结果token/延迟未量化 |
| 失败恢复 | 原CLI与更窄查询 | 查超限/解析/坐标，重搜 | 收窄重搜和坐标核对工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 少拼命令 | 四模型工具 | 仍需CLI |
| 限根搜索 | 起始root realpath | 非OS沙箱 |
| 缩短输出 | 返回数/文本切片 | 执行并非全局早停 |

> **思考**：默认HOME范围宽，先缓冲后全局截断且无截断标志，AST坐标和长度与rg未统一。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：统一现成搜索器、模型参数及根检查，减少手写shell。详见[Q01](#research-q01)。

统一现成搜索器、模型参数及根检查，减少手写shell。详见[Q01](#research-q01)。

小型实现与realpath目录边界可借鉴，测试集中入口，需流式限额和明确回执。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认HOME范围宽，先缓冲后全局截断且无截断标志，AST坐标和长度与rg未统一。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信单用户最小项目根可试用，结果只作线索。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

四工具和realpath入口约束可查，默认HOME、输出完整性与执行限额不支持强沙箱/穷尽主张。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、lib/search.js、test/search.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口、完整search实现、README/patch和完整38行路径测试，只读。
- 下一步：从多文件超限、坏JSON、AST坐标、stderr与root变化探讨流式回执。

**分析版本**

- **仓库**：[173787247/dsh-wsl-search](https://github.com/173787247/dsh-wsl-search)
- **版本号**：0.3.0（[固定提交 445b0fd](https://github.com/173787247/dsh-wsl-search/tree/445b0fd89b128696f447f28ff6dd3b0c0964885e)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究流式全局停止、截断回执和统一坐标，将CLI查找/子进程纳入可取消限额，固定宿主沙箱root。当前未验证。详见[Q05](#research-q05)。

从多文件超限、坏JSON、AST坐标、stderr与root变化探讨流式回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 529 |
| .js | source | 2 | 313 | 293 | 2 | — |
| .js | test | 1 | 38 | 35 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+created%3A2026-09-22T05%3A58%3A26.256Z..2026-10-22T05%3A58%3A26.256Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A58%3A26.256Z..2026-10-22T05%3A58%3A26.256Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定WSL搜索工具如何约束路径、执行和返回，是否足以支持可靠定位？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么把命令行搜索做成模型工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在WSL代码/资料目录中，模型可按内容、文件名或AST模式查询，返回有限条目与路径，避免每轮自行拼bash命令。search_status给出二进制位置，rg/fd/ast-grep分别承担文本、文件名、结构搜索。成功不仅是返回ok，还需能说明搜索根、结果坐标和结果是否完整。

贡献是把已有搜索器接到DSH参数schema、root白名单与结果截断，不是新搜索算法。相比模型直接shell调用，它统一入口且把pattern作为argv值交给搜索器；但README的“沙箱”仅由本进程路径检查和外部CLI约定支持，不能当操作系统隔离。默认允许整个HOME，.dsh和im-workspace是其子集而不是额外收窄，敏感目录仍可能被搜到，必须显式配置项目根。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-23](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/README.md#L5-L23)

作者的搜索工具定位。

<details>
<summary>查看原文（19行）</summary>

````text
WSL 上给 dsh 用的沙箱 **ripgrep** / **fd** / **ast-grep**：`search_rg` / `search_fd` / `search_astgrep`。

默认只允许在 `$HOME` 与 `~/.dsh` 下搜。

## 最短上手

```sh
sudo apt install ripgrep fd-find   # 或等价包名
dsh plugin --profile web add github:173787247/dsh-wsl-search
```

## 工具

| 工具 | 作用 |
|------|------|
| `search_status` | rg/fd/ast-grep 是否可用 |
| `search_rg` | 内容搜索（行数/行长有上限） |
| `search_fd` | 按文件名查找 |
| `search_astgrep` | 结构化模式搜索 |
````

</details>

**依据 2 · 源码核查**：[lib/search.js:17-31](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L17-L31)

默认HOME和物理root检查。

<details>
<summary>查看原文（15行）</summary>

```text
export function defaultRoots() {
  const home = homedir();
  return [home, resolve(home, ".dsh"), resolve(home, ".dsh", "im-workspace")].filter((p) => existsSync(p));
}

export function resolveRoot(root, allowRoots = []) {
  const abs = resolve(String(root || "").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((r) => isUnderRoot(real, r));
  if (!ok) throw new Error(`search root outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 3 · 源码核查**：[index.js:17-35](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/index.js#L17-L35)

提示与状态工具。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:search",
    order: 130,
    text: "dsh-wsl-search runs sandboxed ripgrep/fd/ast-grep under allowlisted roots (default: $HOME, ~/.dsh, and ~/.dsh/im-workspace). Do not search all of /mnt/c. Prefer search_rg for text, search_fd for filenames, search_astgrep for structural patterns.",
  });

  const base = { allowRoots, timeoutMs, maxMatches, maxLineChars };

  ctx.tools.register({
    name: "search_status",
    description: "Whether rg/fd/ast-grep are on PATH.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return searchStatus();
    },
    presentCall: () => ({ card: "generic", title: "Search status" }),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三条搜索链和依赖是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口注册四个并发安全模型工具，宿主提供tools/systemPrompt；文本/文件/AST包装异常为ok:false。lib先resolve并对已存在根做realpath，再检查白名单目录边界；whichSimple经bash -lc command -v找rg/fd或fdfind、ast-grep或sg，spawn直接执行找到的路径。rg加--分隔pattern和目录，输出JSON逐行取match，截断行文本和全局返回数；fd限制max-results再切片；AST用run --pattern和json stream，语言名只留简单字符。

Node声明>=18，无npm运行库依赖，实际需要bash和各外部CLI，WSL发行版应额外装AST工具；README的apt命令只装rg/fd。whichSimple没有timeout和spawn error处理，环境没有bash或登录初始化挂住时，外层搜索超时未覆盖查找阶段；search_status的宿主5秒期限不等它主动清理子进程。PATH上的sg还可能是其他程序，非空路径不证明语义兼容。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-35](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/index.js#L1-L35)

宿主和配置。

<details>
<summary>查看原文（35行）</summary>

```text
import { rgSearch, fdSearch, searchStatus, astGrepSearch } from "./lib/search.js";

export const name = "dsh-wsl-search";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-search] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxMatches = positive(config.maxMatches, 50);
  const maxLineChars = positive(config.maxLineChars, 400);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-search] maxMatches=${maxMatches}`);

  ctx.systemPrompt.section({
    name: "tool:search",
    order: 130,
    text: "dsh-wsl-search runs sandboxed ripgrep/fd/ast-grep under allowlisted roots (default: $HOME, ~/.dsh, and ~/.dsh/im-workspace). Do not search all of /mnt/c. Prefer search_rg for text, search_fd for filenames, search_astgrep for structural patterns.",
  });

  const base = { allowRoots, timeoutMs, maxMatches, maxLineChars };

  ctx.tools.register({
    name: "search_status",
    description: "Whether rg/fd/ast-grep are on PATH.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return searchStatus();
    },
    presentCall: () => ({ card: "generic", title: "Search status" }),
```

</details>

**依据 2 · 源码核查**：[lib/search.js:6-14](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L6-L14)

bash查找。

```text
export function whichSimple(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[lib/search.js:69-113](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L69-L113)

rg/fd链。

<details>
<summary>查看原文（45行）</summary>

```text
export async function rgSearch({ pattern, root, glob, maxMatches = 50, maxLineChars = 400, allowRoots, timeoutMs = 30_000 }) {
  const dir = resolveRoot(root, allowRoots);
  const pat = String(pattern || "").trim();
  if (!pat) throw new Error("pattern required");
  if (pat.length > 500) throw new Error("pattern too long");
  const bin = (await whichSimple("rg")) || "rg";
  const args = ["--json", "--max-count", String(maxMatches), "-n", "--no-heading", "--", pat, dir];
  if (glob) {
    args.splice(4, 0, "--glob", String(glob));
  }
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0 && code !== 1) throw new Error(`rg failed: ${stderr || code}`);
  const matches = [];
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      if (ev.type !== "match") continue;
      matches.push({
        path: ev.data?.path?.text,
        line: ev.data?.line_number,
        text: String(ev.data?.lines?.text || "").trimEnd().slice(0, maxLineChars),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
}

export async function fdSearch({ name, root, maxMatches = 50, allowRoots, timeoutMs = 30_000 }) {
  const dir = resolveRoot(root, allowRoots);
  const q = String(name || "").trim();
  if (!q) throw new Error("name required");
  const bin = (await whichSimple("fd")) || (await whichSimple("fdfind")) || "fd";
  const args = ["--max-results", String(maxMatches), "--", q, dir];
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0 && code !== 1) throw new Error(`fd failed: ${stderr || code}`);
  const paths = stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxMatches);
  return { ok: true, root: dir, count: paths.length, paths };
```

</details>

**依据 4 · 源码核查**：[lib/search.js:116-155](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L116-L155)

status与AST链。

<details>
<summary>查看原文（40行）</summary>

```text
export async function searchStatus() {
  return {
    ok: true,
    rg: (await whichSimple("rg")) || null,
    fd: (await whichSimple("fd")) || (await whichSimple("fdfind")) || null,
    astGrep: (await whichSimple("ast-grep")) || (await whichSimple("sg")) || null,
  };
}

export async function astGrepSearch({ pattern, root, lang, maxMatches = 50, allowRoots, timeoutMs = 30_000 }) {
  const dir = resolveRoot(root, allowRoots);
  const pat = String(pattern || "").trim();
  if (!pat) throw new Error("pattern required");
  if (pat.length > 500) throw new Error("pattern too long");
  const bin = (await whichSimple("ast-grep")) || (await whichSimple("sg")) || "ast-grep";
  const args = ["run", "--pattern", pat, "--json=stream", dir];
  if (lang) {
    const l = String(lang).replace(/[^a-zA-Z0-9_+-]/g, "");
    if (l) args.splice(1, 0, "--lang", l);
  }
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0 && code !== 1) throw new Error(`ast-grep failed: ${stderr || code}`);
  const matches = [];
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      const file = ev.file || ev.path || ev.paths?.[0];
      const range = ev.range || ev.ranges?.[0];
      matches.push({
        path: file,
        line: range?.start?.line ?? ev.line,
        text: String(ev.text || ev.lines || "").trimEnd().slice(0, 400),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
```

</details>

**依据 5 · 源码核查**：[package.json:1-14](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/package.json#L1-L14)

Node与分发。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-wsl-search",
  "version": "0.3.0",
  "description": "DeepSeek Harness WSL plugin: sandboxed ripgrep/fd/ast-grep under allowlisted roots.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-search.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "ripgrep", "fd", "ast-grep"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

</details>

**依据 6 · 源码核查**：[README.md:9-14](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/README.md#L9-L14)

安装示例。

````text
## 最短上手

```sh
sudo apt install ripgrep fd-find   # 或等价包名
dsh plugin --profile web add github:173787247/dsh-wsl-search
```
````

#### 缺口

- 目标环境CLI版本及sg是否确为ast-grep未由查找函数验证
  **影响**：status可用不等结构搜索JSON契约兼容
  **进一步探讨**：核对绝对可执行路径、版本与固定样例输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径与输出限制能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

对已存在root和allowRoots做realpath，比纯词法前缀能识别起始路径符号链接逃逸，目录边界检查也避免相邻同前缀目录误入。它没有在操作系统层限制子进程读取，启动后目录替换/挂载变化与工具自身配置仍不受持续约束；不存在root只做词法判断，后续创建也存在时间窗口。默认HOME范围尤其不能被解释为仅项目。所有进程继承宿主环境，搜索本地内容会经模型工具结果暴露给会话。

run累积stdout超过约200万字符才kill，stderr无限累积；close照常返回code和缓冲，没有独立truncated字段。rg --max-count限制每文件匹配，不能在整个执行阶段保证全局50条，只有收完再解析时全局截断。AST也先收全输出再切片；未解析JSON静默跳过仍ok:true，AST行号直接用上游range.start.line未+1，和rg一基行号未统一，maxLineChars设置只用于rg而AST硬编码400。fd用换行拆路径，带换行文件名会失真。读者不能把count当完整匹配数或统一坐标契约。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:22-42](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L22-L42)

realpath与边界。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveRoot(root, allowRoots = []) {
  const abs = resolve(String(root || "").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((r) => isUnderRoot(real, r));
  if (!ok) throw new Error(`search root outside allowRoots: ${real}`);
  return real;
}

function isUnderRoot(real, root) {
  const r = root.replace(/[/\\]+$/, "");
  if (process.platform === "win32") {
    const a = real.toLowerCase();
    const b = r.toLowerCase();
    return a === b || a.startsWith(b + "\\") || a.startsWith(b + "/");
  }
  return real === r || real.startsWith(r + "/");
}
```

</details>

**依据 2 · 源码核查**：[lib/search.js:44-65](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L44-L65)

stdout阈值和stderr。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("search timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 2_000_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[lib/search.js:75-97](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L75-L97)

先收集、静默解析和返回。

<details>
<summary>查看原文（23行）</summary>

```text
  const args = ["--json", "--max-count", String(maxMatches), "-n", "--no-heading", "--", pat, dir];
  if (glob) {
    args.splice(4, 0, "--glob", String(glob));
  }
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0 && code !== 1) throw new Error(`rg failed: ${stderr || code}`);
  const matches = [];
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      if (ev.type !== "match") continue;
      matches.push({
        path: ev.data?.path?.text,
        line: ev.data?.line_number,
        text: String(ev.data?.lines?.text || "").trimEnd().slice(0, maxLineChars),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
```

</details>

**依据 4 · 源码核查**：[lib/search.js:105-113](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L105-L113)

fd按行切分。

```text
  const args = ["--max-results", String(maxMatches), "--", q, dir];
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0 && code !== 1) throw new Error(`fd failed: ${stderr || code}`);
  const paths = stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxMatches);
  return { ok: true, root: dir, count: paths.length, paths };
```

**依据 5 · 源码核查**：[lib/search.js:138-155](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L138-L155)

AST坐标与固定400。

<details>
<summary>查看原文（18行）</summary>

```text
  const matches = [];
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      const file = ev.file || ev.path || ev.paths?.[0];
      const range = ev.range || ev.ranges?.[0];
      matches.push({
        path: file,
        line: range?.start?.line ?? ev.line,
        text: String(ev.text || ev.lines || "").trimEnd().slice(0, 400),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试和成本支持怎样的判断？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

现有38行测试验证HOME允许、/etc拒绝和默认根结构，最后临时目录样例验证白名单子路径。没有覆盖真实搜索器、JSON解析、超限kill、符号链接或目录变化。测试声称im-workspace出现时必须列出，但条件成立才assert(true)，不能独立证明该分支；源码defaultRoots能直接核对。此次只检查测试，不执行目标代码。

首次需装CLI并设最小项目白名单、核对bash初始化与工具版本。持续无插件侧LLM请求，但搜索结果会增加宿主模型上下文，成本随匹配数量/行长及任务轮数变化；大树扫描CPU/IO不被maxMatches全局早停，多个工具声明并发安全却没有总并发额度。失败恢复要区分不可执行、超时、输出太大和解析丢行，再缩根/缩pattern重查，当前结果没有清楚截断标识，可能增加误判断和返工。

#### 证据与依据

**依据 1 · 源码核查**：[test/search.test.js:1-38](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/test/search.test.js#L1-L38)

现有完整测试范围。

<details>
<summary>查看原文（38行）</summary>

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { homedir, tmpdir } from "node:os";
import { defaultRoots, resolveRoot } from "../lib/search.js";

describe("resolveRoot", () => {
  it("allows home", () => {
    const r = resolveRoot(homedir(), [homedir()]);
    assert.ok(r);
  });
  it("rejects /etc", () => {
    assert.throws(() => resolveRoot("/etc", [homedir()]), /outside/);
  });
});

describe("defaultRoots", () => {
  it("lists home and .dsh paths; includes im-workspace when present", () => {
    const roots = defaultRoots();
    assert.ok(Array.isArray(roots));
    assert.ok(roots.length >= 1);
    // When ~/.dsh/im-workspace exists it must appear in defaultRoots.
    const imDefault = join(homedir(), ".dsh", "im-workspace");
    if (roots.some((r) => r === imDefault || r.endsWith(`${join(".dsh", "im-workspace")}`))) {
      assert.ok(true);
    }
    const dir = mkdtempSync(join(tmpdir(), "dsh-search-"));
    try {
      const im = join(dir, ".dsh", "im-workspace");
      mkdirSync(im, { recursive: true });
      const allowed = resolveRoot(im, [dir, join(dir, ".dsh"), im]);
      assert.equal(allowed, im);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/search.js:44-65](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L44-L65)

执行成本边界。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("search timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 2_000_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[index.js:65-76](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/index.js#L65-L76)

并发安全与异常包装。

<details>
<summary>查看原文（12行）</summary>

```text
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await rgSearch({ ...base, ...args });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rg" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rg", content: r.content }),
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件和进一步探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可信个人WSL、明确项目白名单、已核对CLI路径且结果只作定位线索时可试用；不要默认放开HOME来处理不可信搜索请求，也不要依赖其实现阻止读取宿主秘密。需要严格访问隔离、可靠穷尽性或审计坐标的业务应暂缓。看到ok但缺行/空结果、巨量输出超时或行号错位，应回原工具核对而不是认定文件不存在。

可以研究流式解析并在达到全局限额时主动停止，返回truncated/reason与统一一基坐标；将查找执行也纳入可取消生命周期，限制stderr并验证CLI身份，在宿主沙箱中固定项目root。基线为当前先缓冲后切片、HOME默认根，反例包括多文件各50匹配、超长stderr、坏JSON、AST零基坐标、换行文件名、查找阶段挂起和root替换。比较结果漏报、峰值内存、首次定位时间和恢复工时，方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:44-65](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L44-L65)

当前缓冲执行基线。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("search timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 2_000_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 2 · 源码核查**：[lib/search.js:82-97](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L82-L97)

当前截断契约。

<details>
<summary>查看原文（16行）</summary>

```text
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      if (ev.type !== "match") continue;
      matches.push({
        path: ev.data?.path?.text,
        line: ev.data?.line_number,
        text: String(ev.data?.lines?.text || "").trimEnd().slice(0, maxLineChars),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
```

</details>

**依据 3 · 源码核查**：[lib/search.js:138-155](https://github.com/173787247/dsh-wsl-search/blob/445b0fd89b128696f447f28ff6dd3b0c0964885e/lib/search.js#L138-L155)

AST返回。

<details>
<summary>查看原文（18行）</summary>

```text
  const matches = [];
  for (const line of stdout.split("\n")) {
    if (!line.trim()) continue;
    try {
      const ev = JSON.parse(line);
      const file = ev.file || ev.path || ev.paths?.[0];
      const range = ev.range || ev.ranges?.[0];
      matches.push({
        path: file,
        line: range?.start?.line ?? ev.line,
        text: String(ev.text || ev.lines || "").trimEnd().slice(0, 400),
      });
      if (matches.length >= maxMatches) break;
    } catch {
      /* ignore */
    }
  }
  return { ok: true, root: dir, count: matches.length, matches };
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
