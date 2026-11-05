# dsh-wsl-struct

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[597c4f7](https://github.com/173787247/dsh-wsl-struct/tree/597c4f700e2928597ff47449a8b2ca3be6b230c3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-struct)
<!-- END META -->

> **功能**：在 DSH 中使用 jq、yq 与 sqlite3 查询结构化数据。

> **亮点**：[Q01](#research-q01) 把三类文件查询接到模型工具，适合只取几个字段而非读入整文件。

> **主要限制**：[Q02](#research-q02) 主文件路径检查与表达式进程隔离是两层边界，实际 CLI 权限仍需核对。

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
  - [Q01 · 结构化数据查询帮用户省掉哪些操作？](#detail-section-11)
  - [Q02 · 文件限制和只读控制覆盖哪些路径？](#detail-section-12)
  - [Q03 · 怎样在不暴露工作文件的前提下评估？](#detail-section-13)
  - [Q04 · 限定表达式运行目录和可读文件会降低误读吗？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者从模型会话查看 JSON、YAML 和数据库样例。

用相同 CLI 直接查询并保留原始输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| JSON/YAML 查询 | 提取配置字段 | 依赖本机 CLI 方言与可读权限 |
| SQLite 查询 | 读取数据库结果 | 有只读标志，语句受关键词限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| jq、yq 或 sqlite3 | 按任务必需 | 执行表达式 | 缺工具或方言不符会失败 |
| 狭窄 allowRoots | 受控验收必需 | 限制主文件路径 | 空配置采用较宽默认根 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户创建隔离样例目录 | 不含生产数据 |
| 查询 | 用户对比工具和原命令 | 字段与截断标志相符 |
| 退出 | 用户停用并回到原 CLI | 不依赖插件结果保存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 软件与资源支出未知 | 选择 CLI 方言并配置路径 | 根路径需复核 |
| 持续 | CPU 与 I/O 未测 | 核对截断和表达式 | 敏感数据需要访问策略 |
| 失败 | 排错成本未知 | 用原命令复核 | 区分拒绝和字段为空 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结构化查询 | 统一工具形态访问三类数据 | 节时和方言兼容 |
| 路径限制 | 主文件 realpath 与配置根比较 | 表达式内部访问与系统隔离 |

> **思考**：[Q02](#research-q02) 主文件路径检查与表达式进程隔离是两层边界，实际 CLI 权限仍需核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把三类文件查询接到模型工具，适合只取几个字段而非读入整文件。

[Q02](#research-q02) SQLite 使用 -readonly，其他 CLI 的表达式能力需按实际方言单独约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 主文件路径检查与表达式进程隔离是两层边界，实际 CLI 权限仍需核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在合成配置样例上验收，涉及保密数据先检查 CLI 访问范围。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 CLI 接线、路径与 SQLite 规则。真实表达式能力、收益和隔离设想待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/struct.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定工具接线、路径、子进程和 SQL 规则。未运行目标代码、宿主或外部 CLI。
- 下一步：对照真实 CLI 版本做路径、表达式、SQLite、超时和截断的受控验证。

**分析版本**

- **仓库**：[173787247/dsh-wsl-struct](https://github.com/173787247/dsh-wsl-struct)
- **版本号**：0.1.0（[固定提交 597c4f7](https://github.com/173787247/dsh-wsl-struct/tree/597c4f700e2928597ff47449a8b2ca3be6b230c3)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用受控文件集合运行表达式，比较根外可读性和合法查询回归。

对照真实 CLI 版本做路径、表达式、SQLite、超时和截断的受控验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 113 | — | — | 449 |
| .js | source | 2 | 252 | 234 | 1 | — |
| .js | test | 1 | 15 | 14 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-struct/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：能否在 DSH 中稳定筛选结构化样例，并确保读取边界足以支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 结构化数据查询帮用户省掉哪些操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

开发者可从 DSH 对内联 JSON 做字段筛选，或读取配置的文件、YAML 和 SQLite 表以定位记录。直接运行 jq、yq 或 sqlite3 已能取得同一数据，插件增加模型可填的结构化参数、紧凑输出和默认上限。它不统一三个工具的表达式语义，合格输出需核对字段、行数及是否截断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/README.md#L5-L15)

作者用途和加载入口。

<details>
<summary>查看原文（11行）</summary>

````text
沙箱化 jq / yq / sqlite3（只读 SELECT）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-struct
````

</details>

**依据 2 · 源码核查**：[index.js:35-60](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/index.js#L35-L60)

JSON 的注册接口。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.tools.register({
    name: "struct_jq",
    description: "Run jq filter on a file under allowRoots, or on inline JSON input.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["filter"],
      properties: {
        filter: { type: "string" },
        path: { type: "string" },
        input: { type: "string", description: "Inline JSON when path omitted" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await runJq({ ...args, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
```

</details>

**依据 3 · 源码核查**：[lib/struct.js:78-105](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L78-L105)

JSON 和 YAML 调用差异。

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

**依据 4 · 源码核查**：[lib/struct.js:123-130](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L123-L130)

SQLite 查询输出。

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

#### 缺口

- 无同文件的实际对照
  **影响**：节时和结果准确性未知
  **进一步探讨**：用已知 JSON 字段、YAML 字段及 SQLite 行对照原命令

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件限制和只读控制覆盖哪些路径？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

直接文件参数会经过 realpath（存在时），再比较根路径，默认根含用户 HOME 与 /tmp。这个检查限制传给工具的主输入，随后用当前进程身份启动 CLI，没有额外文件系统或网络隔离。yq 表达式原样作为首个参数，jq 过滤器也原样传入；插件没有对表达式内部访问其他资源或旗标形值提供单独策略。SQLite 同时要求语句前缀、拒绝分号及部分关键词，并传 -readonly；关键词检查可能误拒绝文本常量，不能证明完整语法层或机器隔离。需要用实际 CLI 确认表达式功能和文件访问范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/struct.js:17-36](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L17-L36)

默认根、存在路径真实解析。

<details>
<summary>查看原文（20行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:38-65](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L38-L65)

以宿主身份调用 CLI。

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

**依据 3 · 源码核查**：[lib/struct.js:78-105](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L78-L105)

表达式校验限长度并直接交给 CLI。

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

**依据 4 · 源码核查**：[lib/struct.js:108-130](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L108-L130)

SQLite 规则和只读标志。

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

#### 缺口

- 未核对安装的 yq 方言及表达式额外读取行为
  **影响**：不能将 allowRoots 当沙箱保证
  **进一步探讨**：用目标版本测试指向根外的样例、符号链接和拒绝 SQL

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样在不暴露工作文件的前提下评估？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

仅在独立目录配置狭窄根路径与合成数据。status 可查二进制路径，但不会确认 CLI 方言或能否打开样例。先分别执行一条已知 JSON、YAML 和 SQLite 读取，核对与原命令一致，再测超长返回、无二进制和拒绝语句。调用设超时，stdout 超过硬阈值会杀进程，正常结果另截断为 maxOut。输出截断时应重写过滤器再比较原件，未核对 CLI 可读范围前只观察，不把敏感文件交给模型。退出停用 profile 插件并恢复直接查询。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-32](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/index.js#L6-L32)

配置和状态注册。

<details>
<summary>查看原文（27行）</summary>

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

  ctx.tools.register({
    name: "struct_status",
    description: "Whether jq / yq / sqlite3 are on PATH.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return structStatus();
    },
    presentCall: () => ({ card: "generic", title: "struct status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "struct status", content: r.content }),
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:38-75](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L38-L75)

超时、输出硬上限和二进制发现。

<details>
<summary>查看原文（38行）</summary>

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
  });
}

export async function structStatus() {
  return {
    ok: true,
    jq: (await which("jq")) || null,
    yq: (await which("yq")) || null,
    sqlite3: (await which("sqlite3")) || null,
  };
```

</details>

**依据 3 · 源码核查**：[lib/struct.js:78-105](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L78-L105)

命令失败与返回截断。

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

**依据 4 · 源码核查**：[lib/struct.js:123-130](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L123-L130)

SQLite 只读运行。

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

#### 缺口

- 未实测 WSL 方言和长输出资源
  **影响**：需要估算安装与排障时间
  **进一步探讨**：按实际 jq/yq/sqlite3 版本建立小样例回归

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 限定表达式运行目录和可读文件会降低误读吗？

**研究主题**：新假设与验证

#### 完整回答

当前实现验证主文件，却仍把表达式交给宿主 CLI。可在固定临时工作目录与明确可读文件集合下运行同一查询，再对照现有路径验证，比较许可查询成功率、根外读取率与启动耗时。样例包含常规字段、符号链接、CLI 方言不支持和表达式引用另一文件。若根外仍可读，或常用合法查询被大量阻断，则放弃该隔离方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/struct.js:22-40](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L22-L40)

主输入限制与无额外环境限制的 spawn。

<details>
<summary>查看原文（19行）</summary>

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
}

export function run(bin, args, { timeoutMs = 15_000, input } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
```

</details>

**依据 2 · 源码核查**：[lib/struct.js:97-104](https://github.com/173787247/dsh-wsl-struct/blob/597c4f700e2928597ff47449a8b2ca3be6b230c3/lib/struct.js#L97-L104)

yq 表达式独立交给 CLI。

```text
export async function runYq({ expression, path, allowRoots, timeoutMs, maxOut = 80_000 }) {
  const expr = String(expression || ".").trim();
  if (!expr || expr.length > 2000) throw new Error("invalid yq expression");
  const file = assertSafePath(path, allowRoots);
  const bin = (await which("yq")) || "yq";
  const { code, stdout, stderr } = await run(bin, [expr, file], { timeoutMs });
  if (code !== 0) throw new Error(`yq failed: ${stderr || code}`);
  const out = stdout.slice(0, maxOut);
```

#### 缺口

- 无隔离实现和可接受开销数据
  **影响**：假设尚不能支持安全承诺
  **进一步探讨**：以许可和拒绝两类 fixture 做同版本对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
