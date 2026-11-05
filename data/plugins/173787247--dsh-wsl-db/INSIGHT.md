# dsh-wsl-db

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ee4885b](https://github.com/173787247/dsh-wsl-db/tree/ee4885be541956a0b54ba4f587e313d8310ce53c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-db)
<!-- END META -->

> **功能**：在 DSH 中探测 PostgreSQL 和 Redis，并运行受规则限制的查询。

> **亮点**：[Q01](#research-q01) 将连接探测和常用读取放到同一排障会话。

> **主要限制**：[Q02](#research-q02) 字符串规则不等于服务端只读，默认 Redis ping 也未走主机检查。

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
  - [Q01 · 数据库探针适合哪些日常诊断？](#detail-section-11)
  - [Q02 · SQL 与 Redis 的允许规则能提供什么边界？](#detail-section-12)
  - [Q03 · 如何在合成数据库中评估，并减少误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者需要初步判断应用数据库和缓存是否可连通。

用固定目标和最小权限账户直接运行原生 CLI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 连通性探测 | 区分连接失败或跳过 | 需看分项结果 |
| 查询 | 获取有限数据库输出 | 实际权限及负载由服务端决定 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| psql 或 redis-cli 与合成实例 | 按任务必需 | 连接与诊断 | 工具缺失或权限不足 |
| 受限角色与 Redis ACL | 受控验收必需 | 限制查询权限 | 文本检查不能替代数据库授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立合成实例与专用权限 | 目标和数据均可弃用 |
| 探测 | 用户显式选连接并核对各子结果 | 区分失败与跳过 |
| 退出 | 用户改原生 CLI 与服务日志 | 保留服务端权限边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试服务费用未知 | 创建角色和连接别名 | 核对命令行凭据暴露 |
| 持续 | 查询服务器负载未知 | 复核范围及结果输出 | 宽查询仍可消耗资源 |
| 失败 | 排障开销未知 | 核对服务日志和真实地址 | 先确认执行范围 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 数据库初诊 | 连通性和有限查询入口 | 实际排障节时 |
| 查询范围 | 文本过滤及显式地址检查 | 服务端实际授权及负载 |

> **思考**：[Q02](#research-q02) 字符串规则不等于服务端只读，默认 Redis ping 也未走主机检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将连接探测和常用读取放到同一排障会话。

[Q02](#research-q02) 限制响应字符只影响输出，不能限制服务端查询执行时间或开销。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 字符串规则不等于服务端只读，默认 Redis ping 也未走主机检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在合成实例验收显式目标和读权限，避免用真实业务凭据作首次试验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认工具、文本约束与默认目标。真实数据库权限及诊断效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/db.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码，未运行 psql、Redis、DSH 或目标测试。
- 下一步：用隔离实例验证权限、默认目标、函数访问、负载和退出状态。

**分析版本**

- **仓库**：[173787247/dsh-wsl-db](https://github.com/173787247/dsh-wsl-db)
- **版本号**：0.1.1（[固定提交 ee4885b](https://github.com/173787247/dsh-wsl-db/tree/ee4885be541956a0b54ba4f587e313d8310ce53c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 显式绑定目标、区分子状态，再对照误判与非授权读取。

用隔离实例验证权限、默认目标、函数访问、负载和退出状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 470 |
| .js | source | 2 | 386 | 354 | 12 | — |
| .js | test | 1 | 18 | 17 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-db/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否从 DSH 诊断 PostgreSQL 或 Redis，并限制目标与查询权限？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 数据库探针适合哪些日常诊断？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对服务连不上数据库或缓存的问题，维护者可在 DSH 先做 PostgreSQL SELECT 1 或 Redis PING，再查少量已知数据。相比直接运行 psql/redis-cli，插件新增的是同一会话的参数与连接别名，不提供数据库中间层。auto 探测缺 conn 时可能跳过 PostgreSQL，外层 ok 不代表两个服务都连通。合格结果需逐项核对目标与返回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/README.md#L5-L15)

作者说明只读探针。

<details>
<summary>查看原文（11行）</summary>

````text
psql / redis-cli 只读探针。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-db
````

</details>

**依据 2 · 源码核查**：[index.js:27-40](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/index.js#L27-L40)

连接别名与显式 URI。

<details>
<summary>查看原文（14行）</summary>

```text
  function resolveConn(nameOrUrl) {
    const s = String(nameOrUrl || "").trim();
    if (!s) {
      if (connections.default) return connections.default;
      throw new Error("conn required (named connection or URL)");
    }
    if (connections[s]) return connections[s];
    if (/^postgres(ql)?:\/\//i.test(s)) {
      if (!allowAnyUrl && !Object.values(connections).includes(s)) {
        throw new Error("URL not in config.connections (set allowAnyUrl=true to override)");
      }
      return s;
    }
    throw new Error(`unknown connection alias: ${s}`);
```

</details>

**依据 3 · 源码核查**：[lib/db.js:110-166](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L110-L166)

auto 探测和子结果。

<details>
<summary>查看原文（57行）</summary>

```text
export async function dbPing({
  target = "auto",
  conn,
  host,
  port,
  db,
  timeoutMs = 10_000,
} = {}) {
  const t = String(target || "auto").toLowerCase();
  const out = { ok: true, target: t, postgres: null, redis: null };

  const wantPg = t === "auto" || t === "postgres" || t === "psql" || t === "pg";
  const wantRedis = t === "auto" || t === "redis";

  if (wantPg && (conn || t !== "auto" || (await which("psql")))) {
    if (conn || t !== "auto") {
      try {
        const r = await psqlQuery({ sql: "SELECT 1 AS ok", conn, timeoutMs, maxOut: 2_000 });
        out.postgres = { ok: true, output: (r.output || "").trim().slice(0, 200) };
      } catch (e) {
        out.postgres = { ok: false, error: e instanceof Error ? e.message : String(e) };
        if (t !== "auto") out.ok = false;
      }
    } else {
      out.postgres = { ok: null, skipped: "pass conn alias/URL to probe postgres" };
    }
  }

  if (wantRedis) {
    const redisBin = await which("redis-cli");
    if (!redisBin && t !== "auto") {
      out.redis = { ok: false, error: "redis-cli not on PATH" };
      out.ok = false;
    } else if (redisBin) {
      try {
        const r = await redisCmd({
          command: "PING",
          host: host || "127.0.0.1",
          port,
          db,
          timeoutMs,
          maxOut: 1_000,
        });
        out.redis = { ok: true, output: (r.output || "").trim() };
      } catch (e) {
        out.redis = { ok: false, error: e instanceof Error ? e.message : String(e) };
        if (t === "redis") out.ok = false;
      }
    } else {
      out.redis = { ok: null, skipped: "redis-cli not on PATH" };
    }
  }

  if (t === "postgres" || t === "psql" || t === "pg") {
    out.ok = !!(out.postgres && out.postgres.ok);
  }
  return out;
```

</details>

#### 缺口

- 缺少真实事故诊断对照
  **影响**：未能量化定位收益
  **进一步探讨**：用同一测试环境对照可达、连接拒绝和跳过

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · SQL 与 Redis 的允许规则能提供什么边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

SQL 用字符串规则限制 SELECT、WITH、SHOW、EXPLAIN，拦分号与部分关键词，再直接 psql -c。它没有建立只读事务，SELECT 仍可能调用数据库函数，其真实行为取决于权限和服务端对象。连接字符串若含凭据，会作为 CLI 参数传入，需避免暴露在进程命令行。Redis 按首词允许，KEYS * 的分支只有注释而未拒绝，输出截断不能限制服务端执行开销。显式 Redis host 受允许列表筛选，db_ping 省略 host 时直接交给库，库使用 127.0.0.1，不会先按配置检查该默认值。port 和 db 也没有同级允许表。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-40](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/index.js#L11-L40)

连接与 Redis 配置。

<details>
<summary>查看原文（30行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 30_000);
  // named connections: { local: "postgresql://...", ... } — only these URLs allowed unless empty+allowAnyUrl
  const connections =
    config.connections && typeof config.connections === "object" && !Array.isArray(config.connections)
      ? Object.fromEntries(Object.entries(config.connections).map(([k, v]) => [String(k), String(v)]))
      : {};
  const allowAnyUrl = config.allowAnyUrl === true;
  const redisHosts = Array.isArray(config.redisHosts) ? config.redisHosts.map(String) : ["127.0.0.1", "localhost"];
  console.log(`[dsh-wsl-db] connections=${Object.keys(connections).length} allowAnyUrl=${allowAnyUrl}`);

  ctx.systemPrompt.section({
    name: "tool:db",
    order: 137,
    text: "dsh-wsl-db is read-only: psql SELECT/WITH/SHOW/EXPLAIN and redis-cli GET/INFO/SCAN-style commands. Prefer named connections in config. Never dump passwords into chat.",
  });

  function resolveConn(nameOrUrl) {
    const s = String(nameOrUrl || "").trim();
    if (!s) {
      if (connections.default) return connections.default;
      throw new Error("conn required (named connection or URL)");
    }
    if (connections[s]) return connections[s];
    if (/^postgres(ql)?:\/\//i.test(s)) {
      if (!allowAnyUrl && !Object.values(connections).includes(s)) {
        throw new Error("URL not in config.connections (set allowAnyUrl=true to override)");
      }
      return s;
    }
    throw new Error(`unknown connection alias: ${s}`);
```

</details>

**依据 2 · 源码核查**：[index.js:88-102](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/index.js#L88-L102)

ping 仅在参数有值时检查 host。

<details>
<summary>查看原文（15行）</summary>

```text
    timeoutMs: Math.min(timeoutMs, 15_000),
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        let conn;
        if (args?.conn) conn = resolveConn(args.conn);
        const host = args?.host ? guardRedisHost(args.host) : undefined;
        return await dbPing({
          target: args?.target || "auto",
          conn,
          host,
          port: args?.port,
          db: args?.db,
          timeoutMs: Math.min(timeoutMs, 15_000),
        });
```

</details>

**依据 3 · 源码核查**：[index.js:159-172](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/index.js#L159-L172)

常规 Redis 查询调用 guard。

<details>
<summary>查看原文（14行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = guardRedisHost(args.host || "127.0.0.1");
        return await redisCmd({
          command: args.command,
          host,
          port: args.port,
          db: args.db,
          timeoutMs,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 4 · 源码核查**：[lib/db.js:47-98](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L47-L98)

SQL 与 Redis 文本检查及 KEYS 分支。

<details>
<summary>查看原文（52行）</summary>

```text
export function assertReadonlySql(sql) {
  const s = String(sql || "").trim();
  if (!s || s.length > 4000) throw new Error("invalid sql");
  if (s.includes(";")) throw new Error("sql: multiple statements refused");
  const head = s.replace(/^\s*\(/, "").trim().toUpperCase();
  if (!(head.startsWith("SELECT") || head.startsWith("WITH") || head.startsWith("SHOW") || head.startsWith("EXPLAIN"))) {
    throw new Error("psql: only SELECT / WITH / SHOW / EXPLAIN allowed");
  }
  if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|GRANT|REVOKE|TRUNCATE|COPY|VACUUM|CALL)\b/i.test(s)) {
    throw new Error("psql: mutating keywords refused");
  }
  return s;
}

export function assertRedisReadonly(cmd) {
  const parts = String(cmd || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) throw new Error("redis command required");
  const op = parts[0].toUpperCase();
  const allow = new Set([
    "PING",
    "INFO",
    "DBSIZE",
    "GET",
    "MGET",
    "EXISTS",
    "TTL",
    "TYPE",
    "KEYS",
    "SCAN",
    "HGET",
    "HGETALL",
    "HKEYS",
    "LLEN",
    "LRANGE",
    "SCARD",
    "SMEMBERS",
    "ZCARD",
    "ZRANGE",
    "CLIENT",
  ]);
  if (!allow.has(op)) throw new Error(`redis command not allowed: ${op}`);
  if (op === "KEYS" && parts.length > 1 && parts[1] === "*") {
    // allow but warn via result; still capped by redis-cli
  }
  if (op === "CLIENT" && (parts[1] || "").toUpperCase() !== "LIST") {
    throw new Error("only CLIENT LIST allowed");
  }
  // block dangerous KEYS with huge patterns somehow - just cap output
  return parts;
```

</details>

**依据 5 · 源码核查**：[lib/db.js:138-157](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L138-L157)

ping 使用默认本地地址。

<details>
<summary>查看原文（20行）</summary>

```text
  if (wantRedis) {
    const redisBin = await which("redis-cli");
    if (!redisBin && t !== "auto") {
      out.redis = { ok: false, error: "redis-cli not on PATH" };
      out.ok = false;
    } else if (redisBin) {
      try {
        const r = await redisCmd({
          command: "PING",
          host: host || "127.0.0.1",
          port,
          db,
          timeoutMs,
          maxOut: 1_000,
        });
        out.redis = { ok: true, output: (r.output || "").trim() };
      } catch (e) {
        out.redis = { ok: false, error: e instanceof Error ? e.message : String(e) };
        if (t === "redis") out.ok = false;
      }
```

</details>

**依据 6 · 源码核查**：[lib/db.js:173-202](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L173-L202)

实际 psql 与 redis-cli 参数。

<details>
<summary>查看原文（30行）</summary>

```text
export async function psqlQuery({ sql, conn, timeoutMs, maxOut = 60_000 } = {}) {
  const q = assertReadonlySql(sql);
  const bin = (await which("psql")) || "psql";
  const args = ["-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-c", q];
  const env = {};
  if (conn) {
    // prefer URI
    if (/^postgres(ql)?:\/\//i.test(conn)) {
      args.unshift(conn);
    } else {
      // treat as conninfo string via PGOPTIONS? Use psql "conninfo"
      args.unshift(conn);
    }
  }
  const r = await run(bin, args, { timeoutMs, maxOut, env });
  if (r.code !== 0) throw new Error(`psql failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
}

export async function redisCmd({ command, host, port, db, timeoutMs, maxOut = 40_000 } = {}) {
  const parts = assertRedisReadonly(command);
  const bin = (await which("redis-cli")) || "redis-cli";
  const args = [];
  if (host) args.push("-h", String(host));
  if (port) args.push("-p", String(port));
  if (db != null && db !== "") args.push("-n", String(db));
  args.push(...parts);
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`redis-cli failed: ${r.stderr || r.stdout || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout.trim() };
```

</details>

#### 缺口

- 未测试真实权限、函数、CLI 参数与查询负载
  **影响**：无法宣称数据库端只读或性能安全
  **进一步探讨**：在隔离实例用专用角色验证拒绝写、函数行为、默认 Redis host 与大范围读取

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何在合成数据库中评估，并减少误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

准备独立 PostgreSQL 与 Redis，使用最小权限角色及 ACL，保持 allowAnyUrl=false，避免连接字符串含真实密码并核对查询输出是否含敏感内容。显式指定连接目标并逐项确认子状态。遇到地址或结果不明时回原生命令和服务器审计，避免在业务实例运行宽查询。可评估按服务绑定已批准目标、默认使用只读权限并把 skip、failed 和 ok 独立显示。对照目标遗漏、函数、副作用和拒绝样本，测错目标率、正确判定与开销。若目标绑定仍未挡下未批准目标或大幅阻碍合法探测则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:27-46](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/index.js#L27-L46)

别名和 host 范围。

<details>
<summary>查看原文（20行）</summary>

```text
  function resolveConn(nameOrUrl) {
    const s = String(nameOrUrl || "").trim();
    if (!s) {
      if (connections.default) return connections.default;
      throw new Error("conn required (named connection or URL)");
    }
    if (connections[s]) return connections[s];
    if (/^postgres(ql)?:\/\//i.test(s)) {
      if (!allowAnyUrl && !Object.values(connections).includes(s)) {
        throw new Error("URL not in config.connections (set allowAnyUrl=true to override)");
      }
      return s;
    }
    throw new Error(`unknown connection alias: ${s}`);
  }

  function guardRedisHost(host) {
    const h = String(host || "127.0.0.1");
    if (redisHosts.length && !redisHosts.includes(h)) {
      throw new Error(`redis host not allowed: ${h}`);
```

</details>

**依据 2 · 源码核查**：[lib/db.js:119-166](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L119-L166)

多状态探测基线。

<details>
<summary>查看原文（48行）</summary>

```text
  const out = { ok: true, target: t, postgres: null, redis: null };

  const wantPg = t === "auto" || t === "postgres" || t === "psql" || t === "pg";
  const wantRedis = t === "auto" || t === "redis";

  if (wantPg && (conn || t !== "auto" || (await which("psql")))) {
    if (conn || t !== "auto") {
      try {
        const r = await psqlQuery({ sql: "SELECT 1 AS ok", conn, timeoutMs, maxOut: 2_000 });
        out.postgres = { ok: true, output: (r.output || "").trim().slice(0, 200) };
      } catch (e) {
        out.postgres = { ok: false, error: e instanceof Error ? e.message : String(e) };
        if (t !== "auto") out.ok = false;
      }
    } else {
      out.postgres = { ok: null, skipped: "pass conn alias/URL to probe postgres" };
    }
  }

  if (wantRedis) {
    const redisBin = await which("redis-cli");
    if (!redisBin && t !== "auto") {
      out.redis = { ok: false, error: "redis-cli not on PATH" };
      out.ok = false;
    } else if (redisBin) {
      try {
        const r = await redisCmd({
          command: "PING",
          host: host || "127.0.0.1",
          port,
          db,
          timeoutMs,
          maxOut: 1_000,
        });
        out.redis = { ok: true, output: (r.output || "").trim() };
      } catch (e) {
        out.redis = { ok: false, error: e instanceof Error ? e.message : String(e) };
        if (t === "redis") out.ok = false;
      }
    } else {
      out.redis = { ok: null, skipped: "redis-cli not on PATH" };
    }
  }

  if (t === "postgres" || t === "psql" || t === "pg") {
    out.ok = !!(out.postgres && out.postgres.ok);
  }
  return out;
```

</details>

**依据 3 · 源码核查**：[lib/db.js:173-202](https://github.com/173787247/dsh-wsl-db/blob/ee4885be541956a0b54ba4f587e313d8310ce53c/lib/db.js#L173-L202)

直接执行宿主命令。

<details>
<summary>查看原文（30行）</summary>

```text
export async function psqlQuery({ sql, conn, timeoutMs, maxOut = 60_000 } = {}) {
  const q = assertReadonlySql(sql);
  const bin = (await which("psql")) || "psql";
  const args = ["-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-c", q];
  const env = {};
  if (conn) {
    // prefer URI
    if (/^postgres(ql)?:\/\//i.test(conn)) {
      args.unshift(conn);
    } else {
      // treat as conninfo string via PGOPTIONS? Use psql "conninfo"
      args.unshift(conn);
    }
  }
  const r = await run(bin, args, { timeoutMs, maxOut, env });
  if (r.code !== 0) throw new Error(`psql failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
}

export async function redisCmd({ command, host, port, db, timeoutMs, maxOut = 40_000 } = {}) {
  const parts = assertRedisReadonly(command);
  const bin = (await which("redis-cli")) || "redis-cli";
  const args = [];
  if (host) args.push("-h", String(host));
  if (port) args.push("-p", String(port));
  if (db != null && db !== "") args.push("-n", String(db));
  args.push(...parts);
  const r = await run(bin, args, { timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`redis-cli failed: ${r.stderr || r.stdout || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout.trim() };
```

</details>

#### 缺口

- 无真实 CLI、角色授权和服务器压力测试
  **影响**：连接成本、查询开销与方案收益未知
  **进一步探讨**：在合成库检查权限、查询时长、输出和退出码

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
