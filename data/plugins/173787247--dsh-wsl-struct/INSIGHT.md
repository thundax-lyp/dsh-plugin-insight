# dsh-wsl-struct

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6133450](https://github.com/173787247/dsh-wsl-struct/tree/6133450a091e0fbb1f8d02a10f371e30e8d56f7b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct)
<!-- END META -->

> **实现功能**：为DSH封装jq、yq与readonly SQLite查询，提供主文件allowRoots检查及输出截断标记。

> **核心亮点**：将参数化CLI、主路径realpath、SQLite readonly和错误输出接到DSH，算法与表达式能力来自上游。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：主路径谓词在POSIX接受反斜杠前缀可误认兄弟目录，也不限制CLI全部能力；raw spawn无宿主沙箱且默认HOME/tmp过宽；which/取消/输出资源边界也不完整。详见[Q02](#research-q02)。

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
  - [Q01 · 场景和结构化CLI主链是什么？](#detail-section-11)
  - [Q02 · 贡献和所谓沙箱/超时边界是什么？](#detail-section-12)
  - [Q03 · 依赖、退出和三阶段成本效果如何衡量？](#detail-section-13)
  - [Q04 · 可复用工程和最小进程能力假设怎么验证？](#detail-section-14)
  - [Q05 · 当前推荐及停止条件是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在明确授权数据上重复进行结构化查询，需正确结果和实际进程边界。

直接CLI或宿主受控工具可替代；封装减少argv接线，但未提供承诺的完整沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| status | 查询CLI路径 | ok不代表都存在，发现无deadline |
| jq/yq | JSON/YAML表达式 | 主路径受限不等全部能力受限 |
| SQLite | SELECT/WITH等读取 | readonly加词法，不保证全部函数语义 |
| 输出 | 文本/截断标记 | 完成后裁剪非完整内存预算 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18和DSH tools/systemPrompt | 注册必需 | 工具与提示段 | 非独立CLI引擎 |
| bash与PATH中的jq/yq/sqlite3 | 对应操作必需 | which发现与实际处理 | 未固定实现/版本，yq语法可能不同 |
| 明确最小allowRoots | 文件查询必需 | 主文件realpath边界 | 默认整个HOME/.dsh及/tmp过宽 |
| OS层进程/文件/环境策略 | 真正隔离所需 | 限制表达式附带能力 | 本包原生spawn不提供这层保证 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定可信CLI实现，最小独占数据根 | 不用沙箱字样代替实际OS能力核对 |
| 加载 | 安装包并确认每个CLI版本/路径 | status ok只表示检查完成，不保证均存在 |
| 查询 | 先用无敏感JSON/YAML/SQLite夹具 | 对照原结果并识别输出截断 |
| 退出/恢复 | 停用工具，检查超时子进程和输出 | 错误/超时不代表无资源或副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/bash环境与包，金额未知 | 版本/表达式能力和最小root核对 | 无强制模型调用 |
| 持续使用 | 每次which子进程及CLI处理/输出 | 检查查询正确和截断 | stderr无界、查找无超时 |
| 失败恢复 | CLI安装/版本修复、终止进程重做 | 区分超时与清理未完成 | 无宿主signal贯穿/进程树确认 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化查询 | jq/yq/sqlite argv与标准输出封装 | 具体CLI版本兼容与结果质量 |
| 文件边界 | 主文件realpath和allowRoots | 表达式全部访问/环境及并发路径变化 |
| 只读SQLite | -readonly及有限SQL词法拒绝 | 所有函数/扩展能力和资源边界 |

> **思考**：主路径谓词在POSIX接受反斜杠前缀可误认兄弟目录，也不限制CLI全部能力；raw spawn无宿主沙箱且默认HOME/tmp过宽；which/取消/输出资源边界也不完整。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将参数化CLI、主路径realpath、SQLite readonly和错误输出接到DSH，算法与表达式能力来自上游。详见[Q01](#research-q01)与[Q02](#research-q02)。

将参数化CLI、主路径realpath、SQLite readonly和错误输出接到DSH，算法与表达式能力来自上游。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是主文件和根的realpath、argv固定选项、SQLite底层readonly、inline输入与截断标记、工具错误值清楚。run/which分离也方便独立核对，但目前raw spawn不继承宿主治理；并发安全声明应包含资源而非仅不主动改主文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

主路径谓词在POSIX接受反斜杠前缀可误认兄弟目录，也不限制CLI全部能力；raw spawn无宿主沙箱且默认HOME/tmp过宽；which/取消/输出资源边界也不完整。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，固定CLI/缩小root并接宿主进程治理后再试，敏感配置先不用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持固定结构查询CLI和起始路径核对的接线；POSIX反斜杠谓词、子进程能力、表达式和输出范围不能构成完整隔离。接宿主策略的最小能力查询方案尚未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/struct.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整index/struct源码；未执行CLI或访问真实文件/数据库，不审计所有外部表达式实现。
- 下一步：进一步探讨可用假CLI覆盖缺bash、长stderr、派生进程、路径替换和额外资源访问，核对结果/清理。

**分析版本**

- **仓库**：[173787247/dsh-wsl-struct](https://github.com/173787247/dsh-wsl-struct)
- **版本号**：0.1.0（[固定提交 6133450](https://github.com/173787247/dsh-wsl-struct/tree/6133450a091e0fbb1f8d02a10f371e30e8d56f7b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨固定CLI的最小进程能力查询，接宿主policy/abort、环境/表达式与输出预算；兼容维护成本未验证。详见[Q04](#research-q04)。

进一步探讨可用假CLI覆盖缺bash、长stderr、派生进程、路径替换和额外资源访问，核对结果/清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 113 | — | — | 449 |
| .js | source | 2 | 252 | 234 | 1 | — |
| .js | test | 1 | 15 | 14 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+created%3A2026-09-22T06%3A04%3A03.095Z..2026-10-22T06%3A04%3A03.095Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A04%3A03.095Z..2026-10-22T06%3A04%3A03.095Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查jq/yq/SQLite工具封装、主路径与实际进程能力/资源边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景和结构化CLI主链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合DSH里重复查询JSON/YAML或本地SQLite的人，输入filter/expression或SQL及主文件，输出文本、字符数和截断标记。合格结果是对应已授权文件与正确查询，不能只以返回ok判读全量数据。CLI算法来自上游，本插件主要提供工具接口。

Host注册status/jq/yq/sqlite与提示段。which通过bash -lc command -v找bin，主路径先assertSafePath，已存在目标和根都realpath再检查边界；jq也可读inline JSON，yq按表达式+主文件，sqlite先词法只读检查再带-readonly -json。run原生spawn收stdout/stderr，超时kill后reject，成功输出再裁到80000字符。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-29](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js#L11-L29)

配置和status注册。

<details>
<summary>查看原文（19行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-struct] allowRoots=${allowRoots.length || "defaults"}`);

  ctx.systemPrompt.section({
    name: "tool:struct",
    order: 131,
    text: "dsh-wsl-struct runs sandboxed jq / yq / sqlite3 (SELECT-only) under allowlisted roots. Prefer these over raw bash for structured config and local SQLite caches. Never use for destructive SQL.",
  });

  ctx.tools.register({
    name: "struct_status",
    description: "Whether jq / yq / sqlite3 are on PATH.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return structStatus();
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:6-35](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L6-L35)

发现与realpath主路径校验。

<details>
<summary>查看原文（30行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
}

function defaultRoots() {
  const home = homedir();
  return [home, resolve(home, ".dsh"), "/tmp"].filter((p) => existsSync(p));
}

export function assertSafePath(filePath, allowRoots = []) {
  const abs = resolve(String(filePath || "").trim());
  if (!abs || abs.includes("\0")) throw new Error("invalid path");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 3 · 源码核查**：[lib/struct.js:78-105](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L78-L105)

jq/yq主链。

<details>
<summary>查看原文（28行）</summary>

```text
export async function runJq({ filter, path, input, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const f = String(filter || ".").trim();
  if (!f || f.length > 2000) throw new Error("invalid jq filter");
  const bin = (await which("jq")) || "jq";
  let args = ["-c", f];
  let stdin;
  if (path) {
    const file = assertSafePath(path, allowRoots);
    args.push(file);
  } else {
    stdin = String(input || "");
    if (!stdin) throw new Error("jq: path or input required");
  }
  const { code, stdout, stderr } = await run(bin, args, { timeoutMs, input: stdin });
  if (code !== 0) throw new Error(`jq failed: ${stderr || code}`);
  const out = stdout.slice(0, maxOut);
  return { ok: true, chars: out.length, truncated: stdout.length > maxOut, output: out };
}

export async function runYq({ expression, path, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const expr = String(expression || ".").trim();
  if (!expr || expr.length > 2000) throw new Error("invalid yq expression");
  const file = assertSafePath(path, allowRoots);
  const bin = (await which("yq")) || "yq";
  const { code, stdout, stderr } = await run(bin, [expr, file], { timeoutMs });
  if (code !== 0) throw new Error(`yq failed: ${stderr || code}`);
  const out = stdout.slice(0, maxOut);
  return { ok: true, path: file, chars: out.length, truncated: stdout.length > maxOut, output: out };
```

</details>

**依据 4 · 源码核查**：[lib/struct.js:108-130](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L108-L130)

SQLite词法及-readonly参数。

<details>
<summary>查看原文（23行）</summary>

```text
/** Read-only sqlite: only allow SELECT / WITH / PRAGMA table_info. */
export function assertReadonlySql(sql) {
  const s = String(sql || "").trim();
  if (!s || s.length > 4000) throw new Error("invalid sql");
  if (s.includes(";")) throw new Error("sql: multiple statements refused");
  const head = s.replace(/^\s*\(/, "").trim().toUpperCase();
  if (!(head.startsWith("SELECT") || head.startsWith("WITH") || head.startsWith("PRAGMA TABLE_INFO"))) {
    throw new Error("sqlite: only SELECT / WITH / PRAGMA table_info allowed");
  }
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|DETACH|VACUUM|REPLACE|CREATE|GRANT)\b/i.test(s)) {
    throw new Error("sqlite: mutating keywords refused");
  }
  return s;
}

export async function runSqlite({ db, sql, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const file = assertSafePath(db, allowRoots);
  const q = assertReadonlySql(sql);
  const bin = (await which("sqlite3")) || "sqlite3";
  const { code, stdout, stderr } = await run(bin, ["-readonly", "-json", file, q], { timeoutMs });
  if (code !== 0) throw new Error(`sqlite3 failed: ${stderr || code}`);
  const out = stdout.slice(0, maxOut);
  return { ok: true, db: file, chars: out.length, truncated: stdout.length > maxOut, output: out };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和所谓沙箱/超时边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把CLI参数、主路径realpath、SQLite-readonly及结构化错误统一给DSH，减少每次自由写shell命令。参数数组避免通用shell拼接是积极措施，但README/系统提示的sandboxed不能作为实际OS隔离证据。

run直接node spawn，没有DSH subprocess/sandboxPolicy、环境白名单或独立cwd/user，子进程仍有宿主用户能力；allowRoots只限制传入主文件，不分析jq/yq表达式其他能力或sqlite函数/扩展，也未固定yq实现。默认roots含整个HOME和/tmp，包括大量非任务数据，不是最小工作区授权。realpath可确定起始目标的真实路径，但目录谓词还同时接受正斜杠和反斜杠前缀。POSIX下反斜杠只是普通文件名字节，若allowRoot为/tmp/project，真实存在的名称为project加反斜杠other的兄弟目录路径也可能通过，不能概括成完整目录树边界。此为静态条件推导，未复现。校验/实际CLI打开分开还不是原子防替换。

资源限制也不完整。which无error监听/timeout，bash缺失或挂起不能靠run计时处理；run只kill直接child，不等进程树退出，execute不接宿主signal。stdout超过500000就kill，stderr持续累积无界，输出截断80000是在完成后；不能把字符上限当内存硬上限。SQLite正则会误拒字符串中的变更关键词，少量头部/关键词检查不等完整SQL语义安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-5](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/README.md#L5-L5)

作者沙箱化描述。

```text
沙箱化 jq / yq / sqlite3（只读 SELECT）。
```

**依据 2 · 源码核查**：[index.js:15-18](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js#L15-L18)

注入沙箱承诺。

```text
  ctx.systemPrompt.section({
    name: "tool:struct",
    order: 131,
    text: "dsh-wsl-struct runs sandboxed jq / yq / sqlite3 (SELECT-only) under allowlisted roots. Prefer these over raw bash for structured config and local SQLite caches. Never use for destructive SQL.",
```

**依据 3 · 源码核查**：[lib/struct.js:17-35](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L17-L35)

宽默认根与主路径。

<details>
<summary>查看原文（19行）</summary>

```text
function defaultRoots() {
  const home = homedir();
  return [home, resolve(home, ".dsh"), "/tmp"].filter((p) => existsSync(p));
}

export function assertSafePath(filePath, allowRoots = []) {
  const abs = resolve(String(filePath || "").trim());
  if (!abs || abs.includes("\0")) throw new Error("invalid path");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 4 · 源码核查**：[lib/struct.js:6-14](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L6-L14)

which无error/timeout。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
```

**依据 5 · 源码核查**：[lib/struct.js:38-65](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L38-L65)

原生spawn/timeout/输出收集。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 15_000, input } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    if (input != null) {
      child.stdin.write(String(input));
      child.stdin.end();
    } else {
      child.stdin.end();
    }
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
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

**依据 6 · 源码核查**：[index.js:52-58](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js#L52-L58)

执行不接signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await runJq({ ...args, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

**依据 7 · 源码核查**：[lib/struct.js:108-128](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L108-L128)

有限SQL语法检查和-readonly。

<details>
<summary>查看原文（21行）</summary>

```text
/** Read-only sqlite: only allow SELECT / WITH / PRAGMA table_info. */
export function assertReadonlySql(sql) {
  const s = String(sql || "").trim();
  if (!s || s.length > 4000) throw new Error("invalid sql");
  if (s.includes(";")) throw new Error("sql: multiple statements refused");
  const head = s.replace(/^\s*\(/, "").trim().toUpperCase();
  if (!(head.startsWith("SELECT") || head.startsWith("WITH") || head.startsWith("PRAGMA TABLE_INFO"))) {
    throw new Error("sqlite: only SELECT / WITH / PRAGMA table_info allowed");
  }
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|DETACH|VACUUM|REPLACE|CREATE|GRANT)\b/i.test(s)) {
    throw new Error("sqlite: mutating keywords refused");
  }
  return s;
}

export async function runSqlite({ db, sql, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const file = assertSafePath(db, allowRoots);
  const q = assertReadonlySql(sql);
  const bin = (await which("sqlite3")) || "sqlite3";
  const { code, stdout, stderr } = await run(bin, ["-readonly", "-json", file, q], { timeoutMs });
  if (code !== 0) throw new Error(`sqlite3 failed: ${stderr || code}`);
```

</details>

#### 缺口

- 固定CLI实现的表达式/函数附带文件、环境与网络能力未逐项核对。
  **影响**：不能由主路径allowRoots推断全部访问都受限。
  **进一步探讨**：可先固定jq/yq/sqlite版本，用无敏感桩/官方能力清单建立表达式能力白名单，再决定OS隔离。
- 缺bash、长stderr、子进程派生和取消后的清理未实际验证。
  **影响**：不能承诺超时后零残留或硬资源上限。
  **进一步探讨**：可用假CLI输出/派生进程夹具检查超时/abort/进程树与截断，先不执行用户数据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、退出和三阶段成本效果如何衡量？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包0.1.0、MIT、Node>=18，无运行包依赖不等没有外部环境，核心依赖bash和PATH CLI。status始终ok:true但各路径可能null，需要逐项判断。WSL只是名称/套件定位，源码没有WSL探测保护；实际可用性由CLI/OS决定。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18和DSH tools/systemPrompt | 注册必需 | 工具与提示段 | 非独立CLI引擎 |
| bash与PATH中的jq/yq/sqlite3 | 对应操作必需 | which发现与实际处理 | 未固定实现/版本，yq语法可能不同 |
| 明确最小allowRoots | 文件查询必需 | 主文件realpath边界 | 默认整个HOME/.dsh及/tmp过宽 |
| OS层进程/文件/环境策略 | 真正隔离所需 | 限制表达式附带能力 | 本包原生spawn不提供这层保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定可信CLI实现，最小独占数据根 | 不用沙箱字样代替实际OS能力核对 |
| 加载 | 安装包并确认每个CLI版本/路径 | status ok只表示检查完成，不保证均存在 |
| 查询 | 先用无敏感JSON/YAML/SQLite夹具 | 对照原结果并识别输出截断 |
| 退出/恢复 | 停用工具，检查超时子进程和输出 | 错误/超时不代表无资源或副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/bash环境与包，金额未知 | 版本/表达式能力和最小root核对 | 无强制模型调用 |
| 持续使用 | 每次which子进程及CLI处理/输出 | 检查查询正确和截断 | stderr无界、查找无超时 |
| 失败恢复 | CLI安装/版本修复、终止进程重做 | 区分超时与清理未完成 | 无宿主signal贯穿/进程树确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化查询 | jq/yq/sqlite argv与标准输出封装 | 具体CLI版本兼容与结果质量 |
| 文件边界 | 主文件realpath和allowRoots | 表达式全部访问/环境及并发路径变化 |
| 只读SQLite | -readonly及有限SQL词法拒绝 | 所有函数/扩展能力和资源边界 |

比较应是同一数据/查询正确完成的总人时与资源，与原生CLI或宿主工具相比，计安装、版本差异、截断和重做。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/package.json#L1-L14)

版本/引擎/无依赖包声明。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-wsl-struct",
  "version": "0.1.0",
  "description": "DeepSeek Harness WSL plugin: sandboxed jq / yq / read-only sqlite3.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-struct.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "jq", "yq", "sqlite"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:69-75](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L69-L75)

status ok并允许null。

```text
export async function structStatus() {
  return {
    ok: true,
    jq: (await which("jq")) || null,
    yq: (await which("yq")) || null,
    sqlite3: (await which("sqlite3")) || null,
  };
```

**依据 3 · 源码核查**：[index.js:6-19](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js#L6-L19)

只有enabled判断，没有WSL检测。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-struct] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-struct] allowRoots=${allowRoots.length || "defaults"}`);

  ctx.systemPrompt.section({
    name: "tool:struct",
    order: 131,
    text: "dsh-wsl-struct runs sandboxed jq / yq / sqlite3 (SELECT-only) under allowlisted roots. Prefer these over raw bash for structured config and local SQLite caches. Never use for destructive SQL.",
  });
```

</details>

#### 缺口

- 没有固定CLI版本/数据集的正确率、时延、峰值资源与恢复对照。
  **影响**：不能量化更快/更安全或兼容所有yq。
  **进一步探讨**：可用已知JSON/YAML/SQLite结果集比较wrapper和直接CLI，记录版本、权限、截断和完整恢复成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可复用工程和最小进程能力假设怎么验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是主文件和根的realpath、argv固定选项、SQLite底层readonly、inline输入与截断标记、工具错误值清楚。run/which分离也方便独立核对，但目前raw spawn不继承宿主治理；并发安全声明应包含资源而非仅不主动改主文件。

可探讨未验证的“最小进程能力查询”。固定CLI版本/二进制hash，用宿主subprocess和显式policy/环境白名单；缩小默认root，必要时仅stdin送内容，限制表达式附带能力。把which纳入同一deadline/abort，收集输出有界并确认整个进程树停止，截断/失败区分。相对当前主路径守卫，它增加实际进程能力与结果边界。代价是表达式兼容、性能和实现维护。可用缺bash、路径替换、读取附加资源、无限stderr与派生进程夹具，比较未授权访问、残留和任务正确率；若仍只能靠提示，不应称沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/struct.js:22-35](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L22-L35)

realpath路径守卫。

<details>
<summary>查看原文（14行）</summary>

```text
export function assertSafePath(filePath, allowRoots = []) {
  const abs = resolve(String(filePath || "").trim());
  if (!abs || abs.includes("\0")) throw new Error("invalid path");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:38-65](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L38-L65)

统一deadline/能力假设起点。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 15_000, input } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    if (input != null) {
      child.stdin.write(String(input));
      child.stdin.end();
    } else {
      child.stdin.end();
    }
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
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

**依据 3 · 源码核查**：[lib/struct.js:123-130](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L123-L130)

readonly底层参数与输出。

```text
export async function runSqlite({ db, sql, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const file = assertSafePath(db, allowRoots);
  const q = assertReadonlySql(sql);
  const bin = (await which("sqlite3")) || "sqlite3";
  const { code, stdout, stderr } = await run(bin, ["-readonly", "-json", file, q], { timeoutMs });
  if (code !== 0) throw new Error(`sqlite3 failed: ${stderr || code}`);
  const out = stdout.slice(0, maxOut);
  return { ok: true, db: file, chars: out.length, truncated: stdout.length > maxOut, output: out };
```

**依据 4 · 源码核查**：[index.js:52-58](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js#L52-L58)

并发声明与工具执行。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await runJq({ ...args, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前推荐及停止条件是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。结构化CLI封装有窄场景价值，但宽默认根、原生进程和未固定表达式能力与“沙箱化”承诺不匹配，发现/输出/取消也有关键缺口。不要用它替代已有明确宿主策略的工具来查询敏感配置。

继续探讨可先固定CLI并用无敏感夹具检查实际能力/清理，再缩小root和接入宿主治理后评估trial。遇到额外路径/环境读取、缺CLI却无明确错误、长输出内存异常、超时后残留或截断被当完整结果，应停止依赖并先盘点资源。依据Q02/Q03，本轮未运行任何CLI。

#### 证据与依据

**依据 1 · 源码核查**：[lib/struct.js:17-35](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L17-L35)

宽默认根。

<details>
<summary>查看原文（19行）</summary>

```text
function defaultRoots() {
  const home = homedir();
  return [home, resolve(home, ".dsh"), "/tmp"].filter((p) => existsSync(p));
}

export function assertSafePath(filePath, allowRoots = []) {
  const abs = resolve(String(filePath || "").trim());
  if (!abs || abs.includes("\0")) throw new Error("invalid path");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:6-14](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L6-L14)

发现边界。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[lib/struct.js:38-65](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js#L38-L65)

原生进程与输出/取消边界。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 15_000, input } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    if (input != null) {
      child.stdin.write(String(input));
      child.stdin.end();
    } else {
      child.stdin.end();
    }
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
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

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
