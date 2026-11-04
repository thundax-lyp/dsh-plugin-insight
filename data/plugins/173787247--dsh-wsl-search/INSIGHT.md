# dsh-wsl-search

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[073d609](https://github.com/173787247/dsh-wsl-search/tree/073d609b394bd352e7345a37484b104782fea07f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-search)
<!-- END META -->

> **功能**：为 DSH 提供根目录受限的 ripgrep、fd 和 ast-grep 搜索工具。

> **亮点**：让代理在同一会话中按任务选择文本、文件或结构搜索，返回可定位线索。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：允许根约束的是查询起点，默认含整个 HOME；返回计数也不能解释是否已截断。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 三种搜索分别解决什么任务？](#detail-section-11)
  - [Q02 · 实际如何限量并定位结果？](#detail-section-12)
  - [Q03 · 允许目录是否等价于执行沙箱？](#detail-section-13)
  - [Q04 · 如何在可控范围试用并验证更清楚的返回？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在固定项目根目录内从文件名、文本或结构模式定位源码。

原生命令具有同等搜索算法；这里主要降低参数及解析接入成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索 | 按文本、文件名或语法定位 | 允许根、可信 CLI，输出限量 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| rg/fd/ast-grep | 执行搜索 | 逐个核对版本与身份 |
| DSH 工具与窄根 | 接线及范围 | 用只读样本 |

| 阶段 | 操作 | 结果 |
| --- | --- | --- |
| 配置 | 先确定根和工具 | 版本及路径正确 |
| 查询 | 验证已知命中 | 可回读文件 |

**效果与成本**

| 阶段 | 资源 | 待测 |
| --- | --- | --- |
| 扫描 | 磁盘和进程缓冲 | 超大目录与重复查找 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 源码线索 | 文件、行与文本 | 覆盖率与实际节时 |

> **思考**：允许根约束的是查询起点，默认含整个 HOME；返回计数也不能解释是否已截断。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：让代理在同一会话中按任务选择文本、文件或结构搜索，返回可定位线索。[Q01](#research-q01) [Q02](#research-q02)

参数数组及统一进程入口减少拼接；不同 CLI 的结果限制语义仍需区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

允许根约束的是查询起点，默认含整个 HOME；返回计数也不能解释是否已截断。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只查明确样本根；工具重名或需要完整命中时回归受控 CLI。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持命令接线、起点检查与返回边界。CLI 可用性及真实隔离未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/search.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定入口和搜索核心；未运行目标 CLI 或宿主。
- 下一步：固定 CLI 版本，测试根链接、多文件超限、未匹配及结构行号。

**分析版本**

- **仓库**：[173787247/dsh-wsl-search](https://github.com/173787247/dsh-wsl-search)
- **版本号**：0.3.0（[固定提交 073d609](https://github.com/173787247/dsh-wsl-search/tree/073d609b394bd352e7345a37484b104782fea07f)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

显式暴露截断与计数口径，测可复核任务的误归纳和补查率。尚未验证。[Q04](#research-q04)

固定 CLI 版本，测试根链接、多文件超限、未匹配及结构行号。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 129 | — | — | 529 |
| .js | source | 2 | 313 | 293 | 2 | — |
| .js | test | 1 | 38 | 35 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-search/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 能否在明确项目目录中提供可复核的文字、文件名与结构检索？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三种搜索分别解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护 DSH 工作区的开发者查错误文本时可用 rg，找名字用 fd，找语法形态用 ast-grep。合格输出至少能回到文件及行并在源码复核。相比从 shell 自己解析返回，插件提供一组面向模型的参数和格式；CLI 已有全部检索能力，范围很小且熟悉命令时增量有限。结构查找可少把注释和真实调用混淆，但需要语言和结构模式正确，不能直接视为完整引用图。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-23](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/README.md#L18-L23)

作者区分状态和三类搜索。

```text
| 工具 | 作用 |
|------|------|
| `search_status` | rg/fd/ast-grep 是否可用 |
| `search_rg` | 内容搜索（行数/行长有上限） |
| `search_fd` | 按文件名查找 |
| `search_astgrep` | 结构化模式搜索 |
```

**依据 2 · 源码核查**：[lib/search.js:125-149](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L125-L149)

结构模式实际交给 ast-grep 并解析路径与行。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

#### 缺口

- 未对真实重构任务做成功率对照。
  **影响**：不能估计定位收益。
  **进一步探讨**：构造含同词注释、真调用和变量别名的目录对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际如何限量并定位结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 配置超时、根和最大结果，工具按参数数组启动命令。rg 使用 JSON 事件与 --max-count，后者是按文件计；插件再在解析阶段对最终数组截断，并裁行文本。fd 传 --max-results 后分行。ast-grep 读 JSON stream，结果上限在回收后解析，不能用作扫描上限。无论分支，通用 runner 在 stdout 超阈值或超时 kill，stderr 不受同样体积限制。解析忽略坏 JSON，无显式截断旗标，结果数等于返回数组长度而非总命中。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-23](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/index.js#L6-L23)

应用配置边界。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/search.js:44-66](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L44-L66)

进程、超时、输出约束。

<details>
<summary>查看原文（23行）</summary>

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
  });
```

</details>

**依据 3 · 源码核查**：[lib/search.js:69-113](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L69-L113)

rg 和 fd 参数及返回限制。

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

**依据 4 · 源码核查**：[lib/search.js:125-155](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L125-L155)

结构化查找事后截断。

<details>
<summary>查看原文（31行）</summary>

```text
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

#### 缺口

- 未核查各 CLI 真实输出版本。
  **影响**：行号和截断行为需按工具验收。
  **进一步探讨**：用多文件超限、长行和非 ASCII 文件名核对。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 允许目录是否等价于执行沙箱？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

已有起始目录通过 realpath 与允许根边界对照，默认含整个 HOME，因此并非项目最小权限。包装层核查查询起点，但未以 OS 沙箱限制子进程实际读写；子目录处理、忽略文件和软链接行为依赖选中二进制。status 仅查命令路径；ast-grep 缺失时探测 sg，在 Linux 上可能碰到同名非搜索命令，不能因路径存在就声称可用。扫描仍要读取磁盘；重试、版本核对与隐藏目录遗漏由用户承担。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:17-41](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L17-L41)

默认范围和起点检查。

<details>
<summary>查看原文（25行）</summary>

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
}

function isUnderRoot(real, root) {
  const r = root.replace(/[/\\]+$/, "");
  if (process.platform === "win32") {
    const a = real.toLowerCase();
    const b = r.toLowerCase();
    return a === b || a.startsWith(b + "\\") || a.startsWith(b + "/");
  }
  return real === r || real.startsWith(r + "/");
```

</details>

**依据 2 · 源码核查**：[lib/search.js:116-135](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L116-L135)

status、二进制回退和调用。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[index.js:17-23](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/index.js#L17-L23)

提示自称沙箱，实际选项只有根和限额。

```text
  ctx.systemPrompt.section({
    name: "tool:search",
    order: 130,
    text: "dsh-wsl-search runs sandboxed ripgrep/fd/ast-grep under allowlisted roots (default: $HOME, ~/.dsh, and ~/.dsh/im-workspace). Do not search all of /mnt/c. Prefer search_rg for text, search_fd for filenames, search_astgrep for structural patterns.",
  });

  const base = { allowRoots, timeoutMs, maxMatches, maxLineChars };
```

#### 缺口

- 未核对实际工具身份和链接下钻行为。
  **影响**：不能承诺无越界或覆盖完整。
  **进一步探讨**：在只读夹具目录分别测试根链接、内部链接和同名 sg。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在可控范围试用并验证更清楚的返回？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先配置一个只含测试代码的根，确认 rg/fd/ast-grep 各自版本，再用已知命中和未命中对照。不明行号、命令重名、搜索到私有文件或超时时停用，回到手工指定文件。可给结果增加每工具的匹配计数口径与显式截断标志，让模型知道何时应缩小查询而不是据缺失断言。用恰好到上限和远超上限两类样本验证错误归纳和补查次数；若不能减少误判或反而造成过多重复查询，就不采用。尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/search.js:81-97](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L81-L97)

现有返回 count 只是截取后大小。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/search.js:136-155](https://github.com/173787247/dsh-wsl-search/blob/073d609b394bd352e7345a37484b104782fea07f/lib/search.js#L136-L155)

结构分支无截断旗标。

<details>
<summary>查看原文（20行）</summary>

```text
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

#### 缺口

- 未做下游判断对照。
  **影响**：只能支持可复核的小范围搜索。
  **进一步探讨**：用已知真值区分零、截断和失败。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
