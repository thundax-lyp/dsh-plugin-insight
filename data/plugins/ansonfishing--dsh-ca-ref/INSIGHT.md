# CA 参考库

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a773ae4](https://github.com/Ansonfishing/dsh-ca-ref/tree/a773ae460e90a0d4711c85b5e81b1c641ff3094b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-ca-ref)
<!-- END META -->

> **实现功能**：为Clean Architecture审查提供本地参考仓全文检索、基线清单、审查留账和观察面板。

> **核心亮点**：把参考检索、路径引用、基线和审查留账组织成可复用流程，减少散落材料查找的重复步骤。[Q03](#research-q03) 不等于自动验证架构或提供普适标准答案。

> **风险与缺陷**：索引读取当前工作树且重建把缺失与漂移仓都标ok，健康标记不代表内容完整；混合查询OR与AND过滤也可能越过语言边界。[Q04](#research-q04)

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
  - [Q01 · 它辅助哪类架构审查，合格结果是什么？](#detail-section-11)
  - [Q02 · 索引、工具、命令与留账怎样形成闭环？](#detail-section-12)
  - [Q03 · 相对手工参考检索和表格记账新增什么？](#detail-section-13)
  - [Q04 · “钉版与健康状态”是否足够可信？](#detail-section-14)
  - [Q05 · 从安装到可用需要哪些操作？](#detail-section-15)
  - [Q06 · 本地搜索与策展的成本和工程取舍是什么？](#detail-section-16)
  - [Q07 · 带实际版本与反例的证据卡能否改进策展？](#detail-section-17)
  - [Q08 · 当前更适合观察还是直接试用？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向Clean Architecture/DDD审查者，检索参考断言、获取基线并记录目标项目证据。

对照固定参考仓手工检索和审查表格记账；本轮没有同条件审查质量或工时对照，不将参考实现上升为规范。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地FTS搜索 | 查参考断言与文档出处 | 外部语料需准备；混合语言过滤有限制 |
| 基线清单 | 审查前定位规则 | rules和cards包外；不保证普适正确 |
| 留账与统计 | 记录审查及引用活动 | 自报发现未独立验证 |
| 版本状态与观察窗 | 提示HEAD漂移和查看台账 | index_state不代表各仓完整性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ≥24/node:sqlite | 必需 | FTS5数据库 | 无法加载 |
| DSH tools/commands/timer | 相应能力必需 | 工具、命令和每日tick | 能力缺失或插件等待 |
| 外部CORPUS八仓与规则卡片 | 核心价值必需 | 实际参考内容 | 缺失跳过，健康可能仍标ok |
| Git | 漂移核查必需 | 读取HEAD | 失败跳过，不能证明版本一致 |
| Web远程commands和当前会话 | 面板必需 | 只读数据通道 | 观察窗报通道错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 维护者准备钉版语料及rules/cards | 逐项确认内容与实际SHA |
| 2 | 安装bundle并重启DSH | 工具和观察窗出现 |
| 3 | 先小库索引并按语言搜索 | 核对内容覆盖，不能只看绿灯 |
| 4 | 审查时读源、留账并独立复核 | 规则命中不是审查正确性验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多仓下载、本地SQLite；金额未知 | 准备语言工具链与基线语料；耗时未知 | 包外语料为主要负担 |
| 持续使用 | 同步索引和定期Git读取 | 规则适用性与引用复核 | 未测检索命中或审查节时 |
| 失败恢复 | 重建索引与数据库备份 | 排查缺失、漂移和过滤错误 | 重建无显式事务 |
| 退出 | 数据库仍需用户管理 | 保留或清理审查证据 | 未见连接close释放路径 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 检索与留账 | FTS5和审查账源码实现 | 实际语料完整性与正确率 |
| 版本可信性 | HEAD漂移提示 | 索引块是否来自seed版本 |
| 审查质量 | 参考出处辅助人工复核 | 误报、漏报和工时收益没有对照 |

> **思考**：索引读取当前工作树且重建把缺失与漂移仓都标ok，健康标记不代表内容完整；混合查询OR与AND过滤也可能越过语言边界。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把参考检索、路径引用、基线和审查留账组织成可复用流程，减少散落材料查找的重复步骤。[Q03](#research-q03) 不等于自动验证架构或提供普适标准答案。

把参考检索、路径引用、基线和审查留账组织成可复用流程，减少散落材料查找的重复步骤。[Q03](#research-q03) 不等于自动验证架构或提供普适标准答案。

工具与命令复用数据、路径化引用、本地FTS和有限留账值得借鉴；混合查询括号、重建事务、实际版本绑定及生命周期连接清理需要补强。

<a id="detail-section-5"></a>

### 1.4 主要限制

索引读取当前工作树且重建把缺失与漂移仓都标ok，健康标记不代表内容完整；混合查询OR与AND过滤也可能越过语言边界。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察，补齐可核对的外部语料并验证过滤与健康状态后再做受控审查辅助；不能自动据基线放行项目。[Q08](#research-q08)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认搜索留账框架；外部规则语料未核实，钉版与健康状态不足以证明索引内容版本；采用暂观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/client.js、seed/repos.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定插件源码、seed及作者说明；未取得外部八仓、rules/cards/基线语料，不运行目标代码或宿主，不复现seed所述构建。
- 下一步：准备最小语料库逐项测缺失仓、HEAD漂移、重建中断和中英文过滤，再以同一审查任务对照人工检索；只有完整可追溯规则支持后再试用。

**分析版本**

- **仓库**：[Ansonfishing/dsh-ca-ref](https://github.com/Ansonfishing/dsh-ca-ref)
- **版本号**：1.0.0（[固定提交 a773ae4](https://github.com/Ansonfishing/dsh-ca-ref/tree/a773ae460e90a0d4711c85b5e81b1c641ff3094b)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为证据块绑定实际版本并记录适用条件、反例和复核质量，可避免把命中频率当规则正确性反馈。[Q07](#research-q07)

准备最小语料库逐项测缺失仓、HEAD漂移、重建中断和中英文过滤，再以同一审查任务对照人工检索；只有完整可追溯规则支持后再试用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 354 | — | — | 3679 |
| .js | source | 2 | 1431 | 1230 | 101 | — |
| .mjs | source | 1 | 113 | 86 | 9 | — |
| .mjs | test | 1 | 127 | 111 | 6 | — |
| .js | test | 3 | 962 | 852 | 69 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-ca-ref/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-ca-ref/issues?q=is%3Aissue+created%3A2026-09-23T07%3A59%3A13.409Z..2026-10-23T07%3A59%3A13.409Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-ca-ref/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A59%3A13.409Z..2026-10-23T07%3A59%3A13.409Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Clean Architecture参考库如何将钉版语料变成可追溯审查辅助，其完整性、索引健康和采用前提是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它辅助哪类架构审查，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向审查Clean Architecture、DDD或六边形分层代码的开发者，不是一般coding-agent参考项目收藏。合格交付是具体规则、参考断言出处及被审项目证据，人工或模型据此形成可核对判断；不能把某参考仓实现直接称为所有项目的标准答案。README声明八仓钉版、本地FTS5和审查账本。seed记录Go、Java、C#、Python仓库及作者验证状态，且明确部分只读参考；这些状态是作者元数据，本轮未克隆八仓或复现构建。替代是手工打开固定参考仓、grep文档和单独记录审查意见。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-13](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/README.md#L9-L13)

作者场景声明。

```text
## 为什么

审查 Clean Arch / DDD / 六边形分层项目时,「标准答案」散落在各个参考仓的架构测试和文档里,每次审查都要重新翻。

这个插件把 8 个钉版参考仓(Go / Java / C# / Python)预先索引成本地 FTS5 库,审查前一键拿「标准答案集」,审查完留账,命中统计反哺参考库策展。
```

**依据 2 · 作者声明**：[seed/repos.json:25-57](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/seed/repos.json#L25-L57)

包含已报告通过和只读参考的不同状态。

<details>
<summary>查看原文（33行）</summary>

```text
    },
    {
      "name": "ddd-example-ecommerce",
      "remote": "ttulka/ddd-example-ecommerce",
      "lang": "java",
      "sha": "b48268eacfb2940d4d1237cfae09acea3bcc779e",
      "last_commit": "2023-12-11",
      "verified": "pass",
      "verified_at": "2026-08-27",
      "verify_cmd": "JAVA_HOME=<JDK21 路径> ./mvnw -q test -Dlombok.version=1.18.40",
      "note": "230 测试 0 失败;JDK 25 编译挂(旧 lombok);停更 2023,代码当断言模板用"
    },
    {
      "name": "library",
      "remote": "ddd-by-examples/library",
      "lang": "java",
      "sha": "98d7004b5aef366ba5d661ae0cb544af1cfd33f1",
      "last_commit": "2022-05-25",
      "verified": "read-only",
      "verified_at": "2026-08-27",
      "verify_cmd": "",
      "note": "不可构建:Spring Boot 2.2.0.M6 里程碑仓已死(401/404);只作断言模板+docs 参考"
    },
    {
      "name": "modular-monolith-with-ddd",
      "remote": "kgrzybek/modular-monolith-with-ddd",
      "lang": "csharp",
      "sha": "91c8ef24b4cb6ef558c95d8267fa07d68c7059f8",
      "last_commit": "2024-04-20",
      "verified": "read-only",
      "verified_at": "2026-08-27",
      "verify_cmd": "",
      "note": "本机无 dotnet SDK;断言模式已读源码核对(LayersTests.cs 有 copy-paste bug,见 rules.yml layer-domain-infra)"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引、工具、命令与留账怎样形成闭环？

**研究主题**：功能与机制

#### 完整回答

服务端以Node内置SQLite创建FTS5 chunks表、仓元数据、ledger及命中统计。索引从外部CORPUS读取规则、卡片、Markdown、指定架构测试和目录骨架；英文词走FTS，中文连续词走LIKE，输出repo:path:symbol及片段。四个模型工具提供search、baseline、record和status；/ca-ref命令暴露相同数据给观察面板。搜索自动留查询账并加仓命中次数，record将调用方提供的发现入账并累加规则命中；这表示活动与自报发现，不是自动运行架构断言或验证发现正确。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:55-83](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L55-L83)

SQLite/FTS和台账结构。

<details>
<summary>查看原文（29行）</summary>

```text
function getDb() {
  if (db) return db;
  mkdirSync(CAREF_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS repos (
      name TEXT PRIMARY KEY, remote TEXT, lang TEXT, sha TEXT, last_commit TEXT,
      verified TEXT, verified_at TEXT, verify_cmd TEXT, note TEXT,
      head TEXT, index_state TEXT DEFAULT 'pending', indexed_at INTEGER
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
      repo, path, symbol, kind, lang, text, tokenize='unicode61'
    );
    CREATE TABLE IF NOT EXISTS ledger (
      id TEXT PRIMARY KEY, kind TEXT, project TEXT, language TEXT, query TEXT, detail TEXT, created_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_ledger_created ON ledger(created_at DESC);
    CREATE TABLE IF NOT EXISTS repo_hits (repo TEXT PRIMARY KEY, hits INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS rule_hits (rule_id TEXT PRIMARY KEY, hits INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  `);
  const has = db.prepare("SELECT name FROM sqlite_master WHERE name='repos' AND type='table'").get();
  if (has) {
    for (const r of REPOS) {
      db.prepare(`INSERT OR IGNORE INTO repos (name, remote, lang, sha, last_commit, verified, verified_at, verify_cmd, note)
                 VALUES (?,?,?,?,?,?,?,?,?)`)
        .run(r.name, r.remote, r.lang, r.sha, r.last_commit, r.verified, r.verified_at ?? "", r.verify_cmd ?? "", r.note ?? "");
    }
```

</details>

**依据 2 · 源码核查**：[index.js:252-280](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L252-L280)

基线规则索引来源。

<details>
<summary>查看原文（29行）</summary>

```text
function reindexAll(log) {
  const d = getDb();
  d.exec("DELETE FROM chunks_fts");
  const ins = d.prepare("INSERT INTO chunks_fts (repo, path, symbol, kind, lang, text) VALUES (?,?,?,?,?,?)");
  let n = 0;
  const add = (repo, path, symbol, kind, lang, text) => {
    const t = String(text || "").trim();
    if (!t) return;
    ins.run(repo, path, symbol || "", kind, lang, t);
    n++;
  };

  // 1) 基线文档
  for (const f of ["AGENT-REVIEW-BASELINE.md", "MANIFEST.md", "REPORT.md"]) {
    const p = join(CORPUS, f);
    if (!existsSync(p)) continue;
    for (const c of chunkMarkdown(readFileSync(p, "utf8"))) add("_baseline", f, c.symbol, "doc", "generic", c.text);
  }
  // 2) rules.yml 逐条规则
  const { rules, flags } = parseRulesYaml();
  for (const r of rules) {
    add("_baseline", "rules.yml", r.id, "rule", r.lang || "generic",
      [r.id, `[${r.section}][${r.lang || "generic"}][${r.severity || "yellow"}]`, r.check, r.template ? "template: " + r.template : null, r.warning ? "note: " + r.warning : null]
        .filter(Boolean).join("\n"));
  }
  for (const f of flags) {
    add("_baseline", "rules.yml", f.id, "flag", "generic", [f.id, f.check].filter(Boolean).join("\n"));
  }
  // 3) pattern cards
```

</details>

**依据 3 · 源码核查**：[index.js:347-379](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L347-L379)

英文FTS和中文LIKE路由。

<details>
<summary>查看原文（33行）</summary>

```text
function search(query, { language, kind, limit = 8 } = {}) {
  const d = getDb();
  ensureIndexed();
  const q = String(query || "").trim();
  if (!q) throw new Error("query 不能为空");
  const limitN = Math.max(1, Math.min(25, Number(limit) || 8));
  const ascii = [...q.matchAll(/[A-Za-z_][A-Za-z0-9_+#./-]*/g)].map((m) => m[0].toLowerCase());
  const cjk = [...q.matchAll(/[\u4e00-\u9fff]{2,}/g)].map((m) => m[0]);
  if (!ascii.length && !cjk.length) throw new Error("query 无可检索词");

  const where = [];
  const args = [];
  const hasFts = ascii.length > 0;
  if (hasFts) {
    where.push("chunks_fts MATCH ?");
    args.push(ascii.map((t) => `"${t.replaceAll('"', "")}"`).join(" OR "));
  }
  if (cjk.length) {
    where.push("(" + cjk.map(() => "text LIKE ?").join(" OR ") + ")");
    for (const t of cjk) args.push("%" + t + "%");
  }
  let sql = `SELECT repo, path, symbol, kind, lang, text${hasFts ? ", bm25(chunks_fts) AS score" : ""} FROM chunks_fts WHERE ` + where.join(" OR ");
  if (language) { sql += " AND lang IN (?, 'generic')"; args.push(String(language).toLowerCase()); }
  if (kind) { sql += " AND kind = ?"; args.push(String(kind)); }
  sql += ` ORDER BY ${hasFts ? "score" : "repo, path"} LIMIT ?`;
  args.push(limitN);
  const rows = d.prepare(sql).all(...args);

  // 去重(同一 repo+path+symbol 可能同时命中 FTS 与 LIKE)
  const seen = new Map();
  for (const r of rows) {
    const k = r.repo + "|" + r.path + "|" + r.symbol;
    const score = hasFts ? r.score : 1;
```

</details>

**依据 4 · 源码核查**：[index.js:412-431](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L412-L431)

record接收并保存调用方findings。

<details>
<summary>查看原文（20行）</summary>

```text
function recordReview({ project, language, findings = [] }) {
  const d = getDb();
  const p = String(project || "").trim();
  if (!p) throw new Error("project 不能为空");
  const sev = new Set(["red", "yellow", "ok"]);
  const list = findings.filter((f) => f && typeof f.rule_id === "string" && typeof f.rule_id !== "undefined");
  for (const f of list) {
    if (!sev.has(f.severity)) f.severity = "yellow";
  }
  const lid = id("r");
  d.prepare("INSERT INTO ledger (id, kind, project, language, query, detail, created_at) VALUES (?,?,?,?,?,?,?)")
    .run(lid, "review", p, language ? String(language) : "", "", JSON.stringify({ findings: list }), now());
  for (const f of list) {
    d.prepare("INSERT INTO rule_hits(rule_id,hits) VALUES(?,1) ON CONFLICT(rule_id) DO UPDATE SET hits=hits+1").run(f.rule_id);
  }
  trimLedger();
  return lid;
}

/* ------------------------------------------------------------------ */
```

</details>

**依据 5 · 源码核查**：[lib/client.js:346-368](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/lib/client.js#L346-L368)

面板从会话远程命令取数据。

<details>
<summary>查看原文（23行）</summary>

```text
        const remoteOk = ctx.remote && ctx.remote.commands && typeof ctx.remote.commands.execute === "function";
        if (!remoteOk) {
          setError("remote 通道未注入(客户端缺少 remote.commands 服务)");
          setLoading(false);
          return;
        }
        errs.current = [];
        setRefreshing(true);
        const exec = (line, slot) =>
          Promise.resolve()
            .then(() => ctx.remote.commands.execute(sid, line, []))
            .then(
              (result) => okResult(result, slot, (m) => errs.current.push(m)),
              (e2) => {
                errs.current.push(slot + " 被拒绝: " + (e2 && (e2.message || e2.code) || String(e2)));
                return null;
              }
            );
        // 命令并发发出，但 status 先到先渲染：不把面板锁在「加载中」等慢命令(ledger/stats)
        const pStatus = exec("/ca-ref status --json", "status");
        const pLedgerStats = Promise.all([
          exec("/ca-ref ledger 40 --json", "ledger"),
          exec("/ca-ref stats --json", "stats"),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对手工参考检索和表格记账新增什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献是把版本化参考、可检索的测试片段、规则入口与审查台账组成一个重复使用流程。用户不必每次重新翻散落文档，输出路径可回源核对，命中数据可用于后续人工策展。FTS5、BM25和SQLite是成熟基础，插件未提供新的架构验证算法；“审查前拿基线、审查后留账”是流程增量。由于rules.yml、cards和基线文档来自外部语料目录，实际交付价值依赖它们存在且质量可核实；仅有seed八仓列表不等于完整规则库已随包装好。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:266-284](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L266-L284)

规则和卡片从外部CORPUS读取。

<details>
<summary>查看原文（19行）</summary>

```text
    const p = join(CORPUS, f);
    if (!existsSync(p)) continue;
    for (const c of chunkMarkdown(readFileSync(p, "utf8"))) add("_baseline", f, c.symbol, "doc", "generic", c.text);
  }
  // 2) rules.yml 逐条规则
  const { rules, flags } = parseRulesYaml();
  for (const r of rules) {
    add("_baseline", "rules.yml", r.id, "rule", r.lang || "generic",
      [r.id, `[${r.section}][${r.lang || "generic"}][${r.severity || "yellow"}]`, r.check, r.template ? "template: " + r.template : null, r.warning ? "note: " + r.warning : null]
        .filter(Boolean).join("\n"));
  }
  for (const f of flags) {
    add("_baseline", "rules.yml", f.id, "flag", "generic", [f.id, f.check].filter(Boolean).join("\n"));
  }
  // 3) pattern cards
  for (const repo of REPOS) {
    const p = join(CORPUS, "cards", repo.name + ".md");
    if (existsSync(p)) add(repo.name, "cards/" + repo.name + ".md", "card", "card", repo.lang, readFileSync(p, "utf8"));
  }
```

</details>

**依据 2 · 源码核查**：[index.js:389-401](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L389-L401)

查询留账及仓命中统计。

<details>
<summary>查看原文（13行）</summary>

```text
      kind: r.kind,
      lang: r.lang,
      score: Number(scoreRound(r.score)),
      snippet: jsSnippet(r.text, [...ascii, ...cjk]),
    }));

  // 台账 + 命中计数
  for (const repo of new Set(results.map((r) => r.repo))) {
    d.prepare("INSERT INTO repo_hits(repo,hits) VALUES(?,1) ON CONFLICT(repo) DO UPDATE SET hits=hits+1").run(repo);
  }
  const lid = id("s");
  d.prepare("INSERT INTO ledger (id, kind, project, language, query, detail, created_at) VALUES (?,?,?,?,?,?,?)")
    .run(lid, "search", "", language ? String(language) : "", q, JSON.stringify({ hits: results.length, repos: [...new Set(results.map((r) => r.repo))] }), now());
```

</details>

**依据 3 · 源码核查**：[index.js:493-506](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L493-L506)

baseline加载外部卡片和规则。

<details>
<summary>查看原文（14行）</summary>

```text
function baselinePayload(language) {
  const lang = (language || "").toLowerCase();
  const { rules, flags } = parseRulesYaml();
  const sel = rules.filter((r) => !r.lang || r.lang === "generic" || r.lang === lang);
  const d = getDb();
  const repos = d.prepare("SELECT * FROM repos ORDER BY name").all();
  const cardRepos = lang ? repos.filter((r) => r.lang === lang) : repos;
  const cards = cardRepos
    .map((r) => {
      const p = join(CORPUS, "cards", r.name + ".md");
      return existsSync(p) ? readFileSync(p, "utf8") : `# ${r.name}\n(card 缺失: cards/${r.name}.md)`;
    });
  return { language: lang || "generic", rules: sel, red_flags: flags, repos: cardRepos, cards };
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “钉版与健康状态”是否足够可信？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是每日git rev-parse HEAD比较seed SHA，偏离记录stale及head_drift，且不自动checkout。然而reindexAll读取当前工作树而非固定Git blob，即使HEAD漂移仍可能把当前内容编入索引；结尾又对全部seed仓设index_state=ok，连缺失语料也包括。每日tick先标stale再ensureIndexed，过期触发重建时可能覆盖stale；head_drift仍独立可见，不能笼统说所有警告消失。更具体地，混合中英文查询拼成FTS OR LIKE AND语言/类型过滤，未将OR整体括号化，过滤不必约束FTS分支。这些静态边界足以收窄“标准答案”和绿灯含义，未在宿主复现。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:285-290](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L285-L290)

缺失仓直接跳过，现存工作树读取。

```text
  // 4) 各仓:md 文档 + 架构测试源文件 + golangci.yml + 目录骨架
  for (const repo of REPOS) {
    const root = join(CORPUS, repo.name);
    if (!existsSync(root)) continue;
    for (const rel of walkFiles(root, "", 0, 3, [], 300)) {
      if (!rel.endsWith(".md") || /^(CHANGELOG|CONTRIBUTING|LICENSE)\.md$/i.test(rel)) continue;
```

**依据 2 · 源码核查**：[index.js:319-325](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L319-L325)

重建后全部仓标ok。

```text

  const at = now();
  metaSet("last_index_at", at);
  metaSet("chunks", n);
  for (const r of REPOS) d.prepare("UPDATE repos SET index_state='ok', indexed_at=? WHERE name=?").run(at, r.name);
  if (log) log(`reindex: ${n} chunks`);
  return n;
```

**依据 3 · 源码核查**：[index.js:362-378](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L362-L378)

OR拼接后直接追加AND过滤。

<details>
<summary>查看原文（17行）</summary>

```text
    args.push(ascii.map((t) => `"${t.replaceAll('"', "")}"`).join(" OR "));
  }
  if (cjk.length) {
    where.push("(" + cjk.map(() => "text LIKE ?").join(" OR ") + ")");
    for (const t of cjk) args.push("%" + t + "%");
  }
  let sql = `SELECT repo, path, symbol, kind, lang, text${hasFts ? ", bm25(chunks_fts) AS score" : ""} FROM chunks_fts WHERE ` + where.join(" OR ");
  if (language) { sql += " AND lang IN (?, 'generic')"; args.push(String(language).toLowerCase()); }
  if (kind) { sql += " AND kind = ?"; args.push(String(kind)); }
  sql += ` ORDER BY ${hasFts ? "score" : "repo, path"} LIMIT ?`;
  args.push(limitN);
  const rows = d.prepare(sql).all(...args);

  // 去重(同一 repo+path+symbol 可能同时命中 FTS 与 LIKE)
  const seen = new Map();
  for (const r of rows) {
    const k = r.repo + "|" + r.path + "|" + r.symbol;
```

</details>

**依据 4 · 源码核查**：[index.js:616-637](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L616-L637)

tick漂移标记后可触发重建。

<details>
<summary>查看原文（22行）</summary>

```text
function tick(log) {
  const d = getDb();
  let drift = [];
  for (const repo of REPOS) {
    const root = join(CORPUS, repo.name);
    if (!existsSync(join(root, ".git"))) continue;
    let head = "";
    try {
      head = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { timeout: 8000, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch { /* git 失败不阻塞 */ }
    if (!head) continue;
    d.prepare("UPDATE repos SET head=? WHERE name=?").run(head, repo.name);
    if (head !== repo.sha) {
      d.prepare("UPDATE repos SET index_state='stale' WHERE name=?").run(repo.name);
      drift.push(`${repo.name}@${head.slice(0, 8)}`);
    }
  }
  if (drift.length) {
    metaSet("last_drift", new Date().toISOString().slice(0, 10));
    log(`HEAD 漂移(钉版 ${drift.join(", ")});不自动 re-clone,由 agent 决定是否更新语料`);
  }
  ensureIndexed(log);
```

</details>

#### 缺口

- 语料实际内容和规则来源不在本轮材料中
  **影响**：无法确认架构规则正确性、钉版匹配或搜索完整性
  **进一步探讨**：准备完整CORPUS并对每块保存实际SHA与规则来源，逐条抽查。
- 混合查询过滤与缺失语料健康状态未运行复现
  **影响**：影响按语言取证与健康标记可靠性
  **进一步探讨**：建立中英文混合小库，比较过滤结果并移除一个语料仓后重建。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从安装到可用需要哪些操作？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node至少24以提供node:sqlite，还需要DSH tools、commands、timer服务及Web前端依赖。最重要的前提不是安装包，而是外部~/AI/ca-ref或CAREF_CORPUS目录中八仓与规则、卡片、基线材料；源码没有自动克隆。用户应按seed固定SHA自行准备语料，并区分作者verify_cmd说明和本机实际执行记录。启动三秒后懒建索引，缺文件跳过；命令reindex重建本地FTS。面板依赖当前会话远程commands并30秒刷新。禁用后需自行保管或清理DSH_HOME/ca-ref数据库，插件不是源语料或目标项目的自动修复工具。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:24-35](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L24-L35)

服务、数据库与外部语料位置。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = "dsh-ca-ref";
export const inject = ["tools", "commands", "timer"];

const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), ".dsh");
const CAREF_DIR = join(DSH_HOME, "ca-ref");
const DB_PATH = join(CAREF_DIR, "caref.db");
const CORPUS = process.env.CAREF_CORPUS ?? join(homedir(), "AI", "ca-ref");
const TICK_MS = 24 * 3600 * 1000;
const MAX_FILE_BYTES = 300 * 1024;
const LEDGER_CAP = 2000;

const SEED = JSON.parse(readFileSync(join(import.meta.dirname, "seed", "repos.json"), "utf8"));
```

</details>

**依据 2 · 源码核查**：[index.js:647-661](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L647-L661)

懒建索引与每日tick。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx) {
  const tools = ctx.get?.("tools") ?? ctx.tools;
  const commands = ctx.get?.("commands") ?? ctx.commands;
  const log = (m) => { try { ctx.logger?.warn?.("[ca-ref] " + m); } catch { /* ignore */ } };
  const disposers = [];

  // 启动 3s 后懒建索引(不阻塞 apply)
  setTimeout(() => {
    try { ensureIndexed((m) => log(m)); } catch (e) { log("index failed: " + e.message); }
  }, 3000);

  // 每日 tick
  try {
    disposers.push(ctx.interval(TICK_MS, () => {
      try { tick((m) => log(m)); } catch (e) { log("tick failed: " + e.message); }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:346-355](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/lib/client.js#L346-L355)

远程命令通道为面板前提。

<details>
<summary>查看原文（10行）</summary>

```text
        const remoteOk = ctx.remote && ctx.remote.commands && typeof ctx.remote.commands.execute === "function";
        if (!remoteOk) {
          setError("remote 通道未注入(客户端缺少 remote.commands 服务)");
          setLoading(false);
          return;
        }
        errs.current = [];
        setRefreshing(true);
        const exec = (line, slot) =>
          Promise.resolve()
```

</details>

**依据 4 · 作者声明**：[README.md:19-32](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/README.md#L19-L32)

作者安装和外部语料说明。

<details>
<summary>查看原文（14行）</summary>

````text
```bash
cd ~/.dsh/profiles/web                      # 你的 DSH web profile 目录
pnpm add github:Ansonfishing/dsh-ca-ref
```

然后在 `package.json` 的 `dsh.profile.bundles` 数组里加上 `"dsh-ca-ref"`,重启 `dsh`。会话区出现「CA 参考库」tab。

首次使用自动建索引;语料默认在 `~/AI/ca-ref`(可用 `CAREF_CORPUS` 环境变量指向别处)。语料 = 8 个公开参考仓,克隆地址与验证命令见 `seed/repos.json` 各仓的 `verify_cmd` 字段——本机没有对应语料时,相关检查自动跳过(是数据缺失,不是代码 bug)。

## 功能

- **8 个钉版参考仓**——钉在固定 commit,每日 tick 用 `git rev-parse HEAD` 只读校验漂移,不自动 re-clone。
- **FTS5 全文搜索**——参考仓的断言 / 文档 / 结构;中文按子串、英文走 FTS5;引用带 `<repo>:<path>` 出处。
- **机器化规则清单**——每条规则带断言模板与出处,`ca_ref_baseline` 一次拿齐指定语言的「标准答案集」(含 8 条红旗)。
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 本地搜索与策展的成本和工程取舍是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次需准备多语言参考仓、规则文档及本地索引；持续包括每日HEAD读取、周期重建、查询留账和人工复核参考适用性。源码限制文件大小、遍历深度和条数，台账保留2000项；这控制资源但也意味着索引并非整仓完整读取。现金、时间、命中率和审查准确率未实测。重建先DELETE全部FTS再逐条同步插入，没有显式事务；中断可产生不完整索引且阻塞主线程。模块级数据库连接未见dispose关闭，启动setTimeout也未纳入disposers。可借鉴路径化证据和本地FTS，但移植需事务、生命周期与语料schema管理。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-33](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L29-L33)

大小与账本上限。

```text
const DB_PATH = join(CAREF_DIR, "caref.db");
const CORPUS = process.env.CAREF_CORPUS ?? join(homedir(), "AI", "ca-ref");
const TICK_MS = 24 * 3600 * 1000;
const MAX_FILE_BYTES = 300 * 1024;
const LEDGER_CAP = 2000;
```

**依据 2 · 源码核查**：[index.js:252-259](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L252-L259)

非事务删后重建。

```text
function reindexAll(log) {
  const d = getDb();
  d.exec("DELETE FROM chunks_fts");
  const ins = d.prepare("INSERT INTO chunks_fts (repo, path, symbol, kind, lang, text) VALUES (?,?,?,?,?,?)");
  let n = 0;
  const add = (repo, path, symbol, kind, lang, text) => {
    const t = String(text || "").trim();
    if (!t) return;
```

**依据 3 · 源码核查**：[index.js:285-309](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L285-L309)

有深度、条数和文件大小截断。

<details>
<summary>查看原文（25行）</summary>

```text
  // 4) 各仓:md 文档 + 架构测试源文件 + golangci.yml + 目录骨架
  for (const repo of REPOS) {
    const root = join(CORPUS, repo.name);
    if (!existsSync(root)) continue;
    for (const rel of walkFiles(root, "", 0, 3, [], 300)) {
      if (!rel.endsWith(".md") || /^(CHANGELOG|CONTRIBUTING|LICENSE)\.md$/i.test(rel)) continue;
      const p = join(root, rel);
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.size > MAX_FILE_BYTES) continue;
      for (const c of chunkMarkdown(readFileSync(p, "utf8"))) add(repo.name, rel, c.symbol, "doc", repo.lang, c.text);
    }
    for (const ts of TEST_SOURCES.filter((t) => t.repo === repo.name)) {
      for (const dirRel of ts.dirs) {
        const dir = join(root, dirRel);
        if (!existsSync(dir)) continue;
        for (const rel of walkFiles(dir, dirRel, 0, 4, [], 200)) {
          const sub = rel.slice(dirRel.length + 1);
          if (!ts.re.test(sub)) continue;
          const p = join(root, rel);
          let st;
          try { st = statSync(p); } catch { continue; }
          if (st.size > MAX_FILE_BYTES) continue;
          const chunker = rel.endsWith(".py") ? chunkPythonTestFile : chunkTestFile;
          for (const c of chunker(readFileSync(p, "utf8"))) add(repo.name, rel, c.symbol, "test", repo.lang, c.text);
```

</details>

**依据 4 · 源码核查**：[index.js:408-410](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L408-L410)

台账裁剪。

```text
function trimLedger() {
  getDb().prepare("DELETE FROM ledger WHERE id NOT IN (SELECT id FROM ledger ORDER BY created_at DESC LIMIT ?)").run(LEDGER_CAP);
}
```

**依据 5 · 源码核查**：[index.js:764-766](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L764-L766)

只释放已登记周期回调。

```text
  ctx.effect(() => () => {
    for (const f of disposers) { try { f(); } catch { /* ignore */ } }
  });
```

#### 缺口

- 语料准备与审查复核的实际工时未知
  **影响**：无法证明比手工搜索更省总成本
  **进一步探讨**：固定相同审查任务和语料，记录准备、检索、核对及错误修订时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 带实际版本与反例的证据卡能否改进策展？

**研究主题**：新假设与验证

#### 完整回答

由索引可能读取漂移工作树、命中统计只是活动次数，可以推导未验证假设：每个证据块绑定实际commit和内容hash，审查留账要求目标代码位置、适用条件及反例，再把“被采纳且独立核对”的引用与原始命中数分开，有望降低高频但错误规则被反复强化。增量是证据质量闭环而非点击率排名。需要更严格的规则版本与复核责任，增加录入负担。最小验证在含框架例外的审查集比较当前命中反馈与质量标记，观察错误规则复用率、有效引用比例及复核时间；若精度不增而负担上升，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:389-401](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L389-L401)

搜索计数仅代表命中活动。

<details>
<summary>查看原文（13行）</summary>

```text
      kind: r.kind,
      lang: r.lang,
      score: Number(scoreRound(r.score)),
      snippet: jsSnippet(r.text, [...ascii, ...cjk]),
    }));

  // 台账 + 命中计数
  for (const repo of new Set(results.map((r) => r.repo))) {
    d.prepare("INSERT INTO repo_hits(repo,hits) VALUES(?,1) ON CONFLICT(repo) DO UPDATE SET hits=hits+1").run(repo);
  }
  const lid = id("s");
  d.prepare("INSERT INTO ledger (id, kind, project, language, query, detail, created_at) VALUES (?,?,?,?,?,?,?)")
    .run(lid, "search", "", language ? String(language) : "", q, JSON.stringify({ hits: results.length, repos: [...new Set(results.map((r) => r.repo))] }), now());
```

</details>

**依据 2 · 源码核查**：[index.js:412-431](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L412-L431)

审查账只接受自报规则及发现。

<details>
<summary>查看原文（20行）</summary>

```text
function recordReview({ project, language, findings = [] }) {
  const d = getDb();
  const p = String(project || "").trim();
  if (!p) throw new Error("project 不能为空");
  const sev = new Set(["red", "yellow", "ok"]);
  const list = findings.filter((f) => f && typeof f.rule_id === "string" && typeof f.rule_id !== "undefined");
  for (const f of list) {
    if (!sev.has(f.severity)) f.severity = "yellow";
  }
  const lid = id("r");
  d.prepare("INSERT INTO ledger (id, kind, project, language, query, detail, created_at) VALUES (?,?,?,?,?,?,?)")
    .run(lid, "review", p, language ? String(language) : "", "", JSON.stringify({ findings: list }), now());
  for (const f of list) {
    d.prepare("INSERT INTO rule_hits(rule_id,hits) VALUES(?,1) ON CONFLICT(rule_id) DO UPDATE SET hits=hits+1").run(f.rule_id);
  }
  trimLedger();
  return lid;
}

/* ------------------------------------------------------------------ */
```

</details>

**依据 3 · 源码核查**：[index.js:616-637](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L616-L637)

HEAD漂移信号可作为版本证据起点。

<details>
<summary>查看原文（22行）</summary>

```text
function tick(log) {
  const d = getDb();
  let drift = [];
  for (const repo of REPOS) {
    const root = join(CORPUS, repo.name);
    if (!existsSync(join(root, ".git"))) continue;
    let head = "";
    try {
      head = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { timeout: 8000, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch { /* git 失败不阻塞 */ }
    if (!head) continue;
    d.prepare("UPDATE repos SET head=? WHERE name=?").run(head, repo.name);
    if (head !== repo.sha) {
      d.prepare("UPDATE repos SET index_state='stale' WHERE name=?").run(repo.name);
      drift.push(`${repo.name}@${head.slice(0, 8)}`);
    }
  }
  if (drift.length) {
    metaSet("last_drift", new Date().toISOString().slice(0, 10));
    log(`HEAD 漂移(钉版 ${drift.join(", ")});不自动 re-clone,由 agent 决定是否更新语料`);
  }
  ensureIndexed(log);
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 当前更适合观察还是直接试用？

**研究主题**：采用判断

#### 完整回答

当前结论为观察。场景具体，本地检索和留账值得借鉴，但本轮无法核对外部基线语料，健康标记又不能代表各仓内容已完整索引；这影响核心参考价值而非普通兼容性缺口。已有完备语料的维护者可自行做受控验证，但应先修复或绕开混合过滤和误导健康状态，再选择明确架构任务试用。不能据此自动放行架构审查或将seed作者验证状态当本机新验证。下一步以Q04的数据完整性证据和小库过滤结果作为改变建议的依据。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:319-325](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L319-L325)

仓健康标记没有逐仓完整性门槛。

```text

  const at = now();
  metaSet("last_index_at", at);
  metaSet("chunks", n);
  for (const r of REPOS) d.prepare("UPDATE repos SET index_state='ok', indexed_at=? WHERE name=?").run(at, r.name);
  if (log) log(`reindex: ${n} chunks`);
  return n;
```

**依据 2 · 源码核查**：[index.js:362-378](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/index.js#L362-L378)

查询过滤静态风险。

<details>
<summary>查看原文（17行）</summary>

```text
    args.push(ascii.map((t) => `"${t.replaceAll('"', "")}"`).join(" OR "));
  }
  if (cjk.length) {
    where.push("(" + cjk.map(() => "text LIKE ?").join(" OR ") + ")");
    for (const t of cjk) args.push("%" + t + "%");
  }
  let sql = `SELECT repo, path, symbol, kind, lang, text${hasFts ? ", bm25(chunks_fts) AS score" : ""} FROM chunks_fts WHERE ` + where.join(" OR ");
  if (language) { sql += " AND lang IN (?, 'generic')"; args.push(String(language).toLowerCase()); }
  if (kind) { sql += " AND kind = ?"; args.push(String(kind)); }
  sql += ` ORDER BY ${hasFts ? "score" : "repo, path"} LIMIT ?`;
  args.push(limitN);
  const rows = d.prepare(sql).all(...args);

  // 去重(同一 repo+path+symbol 可能同时命中 FTS 与 LIKE)
  const seen = new Map();
  for (const r of rows) {
    const k = r.repo + "|" + r.path + "|" + r.symbol;
```

</details>

**依据 3 · 作者声明**：[README.md:25-32](https://github.com/Ansonfishing/dsh-ca-ref/blob/a773ae460e90a0d4711c85b5e81b1c641ff3094b/README.md#L25-L32)

外部语料为关键前提。

```text

首次使用自动建索引;语料默认在 `~/AI/ca-ref`(可用 `CAREF_CORPUS` 环境变量指向别处)。语料 = 8 个公开参考仓,克隆地址与验证命令见 `seed/repos.json` 各仓的 `verify_cmd` 字段——本机没有对应语料时,相关检查自动跳过(是数据缺失,不是代码 bug)。

## 功能

- **8 个钉版参考仓**——钉在固定 commit,每日 tick 用 `git rev-parse HEAD` 只读校验漂移,不自动 re-clone。
- **FTS5 全文搜索**——参考仓的断言 / 文档 / 结构;中文按子串、英文走 FTS5;引用带 `<repo>:<path>` 出处。
- **机器化规则清单**——每条规则带断言模板与出处,`ca_ref_baseline` 一次拿齐指定语言的「标准答案集」(含 8 条红旗)。
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
