# dsh-wsl-db

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7ec1796](https://github.com/173787247/dsh-wsl-db/tree/7ec1796675752805913ed7d5645d91541161d8eb)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-db)
<!-- END META -->

> **实现功能**：经 psql/redis-cli 为 DSH Agent 提供 PostgreSQL 与 Redis 连通性和查询工具。

> **核心亮点**：将常见 PostgreSQL/Redis 排障入口统一为 Agent 工具，默认限制连接 URL/Redis host。详见[Q01](#research-q01)。

> **风险与缺陷**：SQL SELECT/EXPLAIN 仍可触发副作用，连接 URI 进入 psql argv；输出截断不限制 DB 端资源。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 数据库探针提供哪些能力，配置限制了什么？](#detail-section-11)
  - [Q02 · 查询如何执行、限制时间和输出？](#detail-section-12)
  - [Q03 · SQL 关键词白名单能否保证真正只读？](#detail-section-13)
  - [Q04 · Redis 命令允许集和探测结果有什么边界？](#detail-section-14)
  - [Q05 · 应该如何配置成可控的开发排障工具？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在受信 WSL 测试数据库做连通性与有限读取排障。详见[Q01](#research-q01)。

手工 psql/redis-cli 可检查输出与凭据；Agent 工具节省命令输入但扩大数据出现在对话中的机会。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 命名连接/host | 缩小目标 | 数据库权限仍重要 |
| SQL/Redis 过滤 | 拦显式写命令 | 非真正只读保证 |
| 输出/超时限制 | 限客户端资源 | DB 端负载未知 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | Agent 工具入口 | 无法使用 |
| psql/redis-cli | 各工具必需 | 子进程查询 | 对应工具失败 |
| PG/Redis 服务与 ACL | 必需 | 数据源/真实权限 | 不可达或越权风险 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 准备 | 配低权限 alias/redisHosts | 只到测试库 |
| 探测 | db_status/db_ping | 看各服务子项而非总 ok |
| 查询 | 短 SELECT/SCAN | 核数据范围与耗时 |
| 审核 | 检 argv/输出/服务负载 | 满足权限基线再扩 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | psql/redis-cli、DSH Web | 配 alias/host/账号 | 环境兼容未测 |
| 查询 | 默认30秒、输出截断 | 审 SQL/Redis 与结果 | DB 端负载未知 |
| 风险 | 数据/凭据可能暴露 | 最小权限/ACL/脱敏 | 只读非强制保证 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 连通性探测 | SELECT 1/PING | auto ok 与实际可达一致 |
| 查询读取 | SQL/Redis 白名单 | 真正只读与低负载 |
| 输出上限 | 客户端截断 | 服务端资源上限 |

> **思考**：SQL SELECT/EXPLAIN 仍可触发副作用，连接 URI 进入 psql argv；输出截断不限制 DB 端资源。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将常见 PostgreSQL/Redis 排障入口统一为 Agent 工具，默认限制连接 URL/Redis host。详见[Q01](#research-q01)。

将常见 PostgreSQL/Redis 排障入口统一为 Agent 工具，默认限制连接 URL/Redis host。详见[Q01](#research-q01)。

spawn 参数化减小 shell 拼接风险，命令白名单不是数据库权限；凭据 argv 与探测语义需修。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

SQL SELECT/EXPLAIN 仍可触发副作用，连接 URI 进入 psql argv；输出截断不限制 DB 端资源。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅隔离测试库、最小权限账号试用；生产库不直接采用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核命令与限制；SQL 字符串白名单不是只读保证，Redis KEYS 等可能高成本；默认自动探测 ok 不能当可达证明。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、index.js、lib/db.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/db.js、包声明；未运行目标插件/数据库/CLI，旧 META 仅复用。
- 下一步：目标 PG/Redis 测只读角色、SELECT 副作用/INTO/EXPLAIN ANALYZE、KEYS 大库成本、argv 秘密、auto 空探测和超时。

**分析版本**

- **仓库**：[173787247/dsh-wsl-db](https://github.com/173787247/dsh-wsl-db)
- **版本号**：0.1.1（[固定提交 7ec1796](https://github.com/173787247/dsh-wsl-db/tree/7ec1796675752805913ed7d5645d91541161d8eb)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为角色级只读、禁高成本 Redis 命令、凭据保护和探测分项状态明确化。详见[Q05](#research-q05)。

目标 PG/Redis 测只读角色、SELECT 副作用/INTO/EXPLAIN ANALYZE、KEYS 大库成本、argv 秘密、auto 空探测和超时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 470 |
| .js | source | 2 | 386 | 354 | 12 | — |
| .js | test | 1 | 18 | 17 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-db/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DB 探针能否在不泄露凭据、不误写且资源可控的前提下辅助排障？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 数据库探针提供哪些能力，配置限制了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件给 DSH Agent 注册 db_status、db_ping、db_psql、db_redis：查询 CLI/连接别名、连通性、PostgreSQL 查询和 Redis 查询。配置.connections 命名 PostgreSQL URI，默认禁止任意 URL，redisHosts 默认只允许 127.0.0.1/localhost；命令本身通过 psql/redis-cli 子进程执行。它适合受信本地开发库排障，不能把“只读探针”理解成数据库账户只读或数据不会进入对话：查询结果会渲染给 Agent。实际账号权限/数据敏感性未核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-34](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/README.md#L5-L34)

作者只读探针与配置声明

<details>
<summary>查看原文（30行）</summary>

````text
psql / redis-cli 只读探针。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-db
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-db
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `db_status` | CLI 与连接别名 |
| `db_psql` | SELECT/WITH/SHOW/EXPLAIN |
| `db_redis` | PING/GET/INFO/SCAN… |

## 配置要点

`connections / allowAnyUrl / redisHosts / timeoutMs`

用 `config.connections` 命名 URI；默认禁止任意 URL。`redisHosts` 白名单。
````

</details>

**依据 2 · 源码核查**：[index.js:11-49](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/index.js#L11-L49)

连接别名/URL 和 Redis host 限制

<details>
<summary>查看原文（39行）</summary>

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
  }

  function guardRedisHost(host) {
    const h = String(host || "127.0.0.1");
    if (redisHosts.length && !redisHosts.includes(h)) {
      throw new Error(`redis host not allowed: ${h}`);
    }
    return h;
  }
```

</details>

**依据 3 · 源码核查**：[index.js:51-177](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/index.js#L51-L177)

四个工具及结果呈现

<details>
<summary>查看原文（127行）</summary>

```text
  ctx.tools.register({
    name: "db_status",
    description: "Whether psql / redis-cli are on PATH; list connection aliases (names only).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return {
        ...(await dbStatus()),
        connectionAliases: Object.keys(connections),
        allowAnyUrl,
        redisHosts,
      };
    },
    presentCall: () => ({ card: "generic", title: "db status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "db status", content: r.content }),
  });

  ctx.tools.register({
    name: "db_ping",
    description: "Connectivity probe: postgres SELECT 1 (needs conn) and/or redis PING. target=auto|postgres|redis.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        target: { type: "string", description: "auto|postgres|redis" },
        conn: { type: "string", description: "Alias or postgres URL for SELECT 1" },
        host: { type: "string", description: "Redis host (must be in redisHosts)" },
        port: { type: "number" },
        db: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
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
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "db ping" }),
    presentResult: (_a, r) => ({ card: "generic", title: "db ping", content: r.content }),
  });

  ctx.tools.register({
    name: "db_psql",
    description: "Read-only psql query (SELECT/WITH/SHOW/EXPLAIN). conn = alias from config.connections or URL if allowAnyUrl.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["sql"],
      properties: {
        sql: { type: "string" },
        conn: { type: "string", description: "Alias or postgres URL" },
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
        const conn = resolveConn(args.conn);
        return await psqlQuery({ sql: args.sql, conn, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "psql" }),
    presentResult: (_a, r) => ({ card: "generic", title: "psql", content: r.content }),
  });

  ctx.tools.register({
    name: "db_redis",
    description: "Read-only redis-cli (PING/INFO/GET/SCAN/…). Host must be in redisHosts allowlist.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["command"],
      properties: {
        command: { type: "string", description: "e.g. PING or GET mykey" },
        host: { type: "string" },
        port: { type: "number" },
        db: { type: "number" },
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
      }
    },
    presentCall: () => ({ card: "generic", title: "redis-cli" }),
    presentResult: (_a, r) => ({ card: "generic", title: "redis-cli", content: r.content }),
  });
```

</details>

#### 缺口

- 目标数据库账户权限、宿主工具授权与数据分类未知
  **影响**：不能直接在生产库部署
  **进一步探讨**：低权限测试库逐工具验收并审数据范围

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询如何执行、限制时间和输出？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

psqlQuery 用 psql -v ON_ERROR_STOP=1 -P pager=off -c SQL，Redis 用 redis-cli -h/-p/-n 与拆分后的命令词；子进程不经 shell 拼接 SQL，运行超时会 SIGKILL，stdout 超阈值也杀进程并截断返回，stderr 返回前4000字符。status 用 bash command -v 查 CLI，ping 分别 SELECT 1/PING。PostgreSQL 连接 URI 被作为 psql 命令行参数传入，含密码时可能被本机进程列表看到；不是通过环境秘密通道。运行时资源、DB 侧取消与可见性仍需实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/db.js:3-45](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L3-L45)

CLI 查找与 spawn/输出上限

<details>
<summary>查看原文（43行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
}

export function run(bin, args, { timeoutMs = 30_000, maxOut = 80_000, env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...(env || {}) },
    });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
```

</details>

**依据 2 · 源码核查**：[lib/db.js:109-167](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L109-L167)

ping 路径

<details>
<summary>查看原文（59行）</summary>

```text
/** Lightweight connectivity probe: psql SELECT 1 and/or redis PING. */
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
}
```

</details>

**依据 3 · 源码核查**：[lib/db.js:169-203](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L169-L203)

psql/redis-cli 命令参数

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * conn: either DATABASE_URL style or libpq keywords via env PG*
 * We accept a connection URI only from config allowlist aliases or explicit url if allowAnyUrl.
 */
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
}
```

</details>

**依据 4 · 源码核查**：[index.js:111-177](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/index.js#L111-L177)

工具调用

<details>
<summary>查看原文（67行）</summary>

```text
  ctx.tools.register({
    name: "db_psql",
    description: "Read-only psql query (SELECT/WITH/SHOW/EXPLAIN). conn = alias from config.connections or URL if allowAnyUrl.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["sql"],
      properties: {
        sql: { type: "string" },
        conn: { type: "string", description: "Alias or postgres URL" },
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
        const conn = resolveConn(args.conn);
        return await psqlQuery({ sql: args.sql, conn, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "psql" }),
    presentResult: (_a, r) => ({ card: "generic", title: "psql", content: r.content }),
  });

  ctx.tools.register({
    name: "db_redis",
    description: "Read-only redis-cli (PING/INFO/GET/SCAN/…). Host must be in redisHosts allowlist.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["command"],
      properties: {
        command: { type: "string", description: "e.g. PING or GET mykey" },
        host: { type: "string" },
        port: { type: "number" },
        db: { type: "number" },
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
      }
    },
    presentCall: () => ({ card: "generic", title: "redis-cli" }),
    presentResult: (_a, r) => ({ card: "generic", title: "redis-cli", content: r.content }),
  });
```

</details>

#### 缺口

- 目标系统进程列表权限/数据库查询取消行为未知
  **影响**：不能保证凭据不会暴露或超时立即停掉服务端执行
  **进一步探讨**：目标主机检查 argv、数据库语句取消和大输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · SQL 关键词白名单能否保证真正只读？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

assertReadonlySql 限 SELECT/WITH/SHOW/EXPLAIN、无分号和若干写入关键字，但只做字符串检查，没有 SQL 语法/数据库权限控制。PostgreSQL 的 SELECT 可调用有副作用函数，SELECT ... INTO 可建表（INTO 未禁），EXPLAIN ANALYZE 会执行所解释查询；被禁词也可在注释/字符串中触发误拒。故源码不能证明只读，真实危险程度取决于所配置账户的权限。必须使用数据库角色级 SELECT-only/只读事务而不是仅靠插件守卫。

已核[PostgreSQL 18 SELECT INTO 官方文档](https://www.postgresql.org/docs/18/sql-selectinto.html)说明会建表，[EXPLAIN 官方文档](https://www.postgresql.org/docs/18/sql-explain.html)说明 ANALYZE 会实际执行语句。这支持关键词过滤不足的静态推演，不代表目标数据库已发生写入；是否允许仍取决角色权限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/db.js:47-59](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L47-L59)

SQL 首词和正则关键词检查

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/db.js:173-189](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L173-L189)

通过 psql 真执行 SQL

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[index.js:21-25](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/index.js#L21-L25)

作者提示只读

```text
  ctx.systemPrompt.section({
    name: "tool:db",
    order: 137,
    text: "dsh-wsl-db is read-only: psql SELECT/WITH/SHOW/EXPLAIN and redis-cli GET/INFO/SCAN-style commands. Prefer named connections in config. Never dump passwords into chat.",
  });
```

#### 缺口

- 目标 PostgreSQL 版本、角色权限与特定语句行为未跑
  **影响**：“只读”声明不能作为生产安全边界
  **进一步探讨**：受控数据库用无副作用角色和函数/INTO/EXPLAIN ANALYZE 用例审查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Redis 命令允许集和探测结果有什么边界？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

Redis 允许 PING/GET/SCAN/KEYS/HGETALL/CLIENT LIST 等；它们不写键，但 KEYS/HGETALL/CLIENT LIST 可能取大量数据或暴露客户端/键名，stdout 截断在客户端进程层，不限制 Redis 服务端执行成本。db_ping target=auto 在没有连接 alias 且 CLI 不在 PATH 时可能跳过两边并保留 ok:true，因此 ok:true 不必然证明 PostgreSQL 或 Redis 可达；要看 postgres/redis 子项。Redis 命令按空白拆分，带空格参数不能保真。

#### 证据与依据

**依据 1 · 源码核查**：[lib/db.js:61-99](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L61-L99)

Redis 命令白名单与拆分

<details>
<summary>查看原文（39行）</summary>

```text
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
}
```

</details>

**依据 2 · 源码核查**：[lib/db.js:117-167](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L117-L167)

auto 探测跳过与 ok 语义

<details>
<summary>查看原文（51行）</summary>

```text
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
}
```

</details>

**依据 3 · 源码核查**：[lib/db.js:14-44](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L14-L44)

客户端输出/超时限制

<details>
<summary>查看原文（31行）</summary>

```text
export function run(bin, args, { timeoutMs = 30_000, maxOut = 80_000, env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...(env || {}) },
    });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
```

</details>

#### 缺口

- 目标 Redis 键规模/权限与 auto 空场景未实测
  **影响**：探测/输出上限不能等同安全成本上限
  **进一步探讨**：大键/KEYS/空配置探测和输出敏感性验收

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应该如何配置成可控的开发排障工具？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

限定开发/测试数据库和最小权限账号，连接 URI 使用宿主可保护的配置/环境并检查进程 argv 暴露，redisHosts 只列预期本机目标；Agent 的查询结果可能包含业务数据，应限制工具授权与输出。先 db_status/db_ping，随后短 SELECT/SCAN，验证结果与超时。改进方向为数据库账户级只读、SQL AST/事务保护、Redis 禁高成本命令、凭据不用 argv、明确探测分项状态；均未实现。当前不建议直连生产库。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-43](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/README.md#L12-L43)

作者安装/可选位置

<details>
<summary>查看原文（32行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-db
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-db
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `db_status` | CLI 与连接别名 |
| `db_psql` | SELECT/WITH/SHOW/EXPLAIN |
| `db_redis` | PING/GET/INFO/SCAN… |

## 配置要点

`connections / allowAnyUrl / redisHosts / timeoutMs`

用 `config.connections` 命名 URI；默认禁止任意 URL。`redisHosts` 白名单。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-db` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
````

</details>

**依据 2 · 源码核查**：[index.js:27-49](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/index.js#L27-L49)

连接/主机配置

<details>
<summary>查看原文（23行）</summary>

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
    }
    return h;
  }
```

</details>

**依据 3 · 源码核查**：[lib/db.js:173-203](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L173-L203)

具体 CLI 执行

<details>
<summary>查看原文（31行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[lib/db.js:117-167](https://github.com/173787247/dsh-wsl-db/blob/7ec1796675752805913ed7d5645d91541161d8eb/lib/db.js#L117-L167)

探测语义

<details>
<summary>查看原文（51行）</summary>

```text
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
}
```

</details>

#### 缺口

- 目标部署成本、数据分级与改进效果未知
  **影响**：无法承诺生产只读安全
  **进一步探讨**：隔离数据库角色/Redis ACL/输出脱敏与权限验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
