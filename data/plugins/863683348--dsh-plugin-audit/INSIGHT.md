# dsh-plugin-audit

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[e5c9c5d](https://github.com/863683348/dsh-plugin-audit/tree/e5c9c5df08a56a23e37966640390d07052fcc9a6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit) [![npm 30d 817](https://img.shields.io/static/v1?label=npm+30d&message=817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-audit) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-audit)
<!-- END META -->

> **实现功能**：同步 GitHub topic/npm 元数据并评分排行，按需对单插件做有限静态安全扫描。

> **核心亮点**：提供可解释的元数据分数与按需安全线索，详见[Q01](#research-q01)。

> **风险与缺陷**：深扫失败被落成空扫描并在工具输出中表现为 clean，可能覆盖既有证据；详见[Q02](#research-q02)。

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
  - [Q01 · 插件体检分数代表什么？](#detail-section-11)
  - [Q02 · audit_scan 的“清洁”和失败状态能否信任？](#detail-section-12)
  - [Q03 · 静态安全警示与生态决策怎样使用？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复如何核算成本和效果？](#detail-section-14)
  - [Q05 · 怎样证伪独立失败状态和覆盖率记录能减少虚假clean？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 生态选择待评估插件并跟踪仓库健康度。

人工检索 GitHub/npm 与逐仓安全检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 机制 | 边界 |
| --- | --- | --- |
| 排名 | 元数据评分 | 非质量/安全认证 |
| 深扫 | ≤6 文件正则 | 失败可误显 clean |
| 历史 | 本地快照 | 依赖重复 sync |

**流程与依赖**

GitHub topic/search API、npm registry、DSH tools，可选 schedule/browser panel。

audit_sync→top/plugin→scan→人工审阅→安装验证。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装包/本地catalog磁盘，GitHub/npm初次同步请求；价格未知 | 配数据目录与可选token，核评分口径与权限，工时未知 | API额度/覆盖范围依账号与同步停止条件，不能保证全目录 |
| 持续使用 | 同步元数据、历史快照，按需tree与最多6次contents抓取/静态扫描；可选schedule周期执行 | 复核分数/误报及漏扫，工时未知 | 限流/网络错误可能产生不完整信息，净节省未测 |
| 失败恢复 | 重试API与备份catalog恢复所需网络/磁盘，金额未知 | 对照旧finding与抓取coverage、追失败状态，工时未知 | 当前失败可覆盖旧证据，重试成功不证明旧证据完整恢复 |

提升候选检索与元数据透明度，安全等级不能当认证。

> **思考**：深扫失败被落成空扫描并在工具输出中表现为 clean，可能覆盖既有证据；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供可解释的元数据分数与按需安全线索，详见[Q01](#research-q01)。

提供可解释的元数据分数与按需安全线索，详见[Q01](#research-q01)。

四维纯函数评分、有限文件抓取、正则安全 rule、JSON 存储。

<a id="detail-section-5"></a>

### 1.4 主要限制

深扫失败被落成空扫描并在工具输出中表现为 clean，可能覆盖既有证据；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只把分数作线索，确认扫描文件覆盖/错误状态后再读固定 SHA 源码、验证安装；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

评分机制有源码依据；audit_scan 网络失败会清空 finding、100 trust 且工具显示 clean，需修复。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/audit.js、lib/scanner.js、lib/security.js、lib/scoring.js、lib/storage.js、test/scanner.test.mjs、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交；未调用 GitHub/npm 或运行目标测试。
- 下一步：模拟 fetch 429/500、旧 finding 保留、六文件覆盖、误报漏报抽样。

**分析版本**

- **仓库**：[863683348/dsh-plugin-audit](https://github.com/863683348/dsh-plugin-audit)
- **版本号**：0.5.2（[固定提交 e5c9c5d](https://github.com/863683348/dsh-plugin-audit/tree/e5c9c5df08a56a23e37966640390d07052fcc9a6)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

区分抓取失败与有效扫描，保留旧结果并展示覆盖范围；反证条件及代价见[Q05](#research-q05)。

模拟 fetch 429/500、旧 finding 保留、六文件覆盖、误报漏报抽样。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1540 | 1258 | 202 | — |
| .md | source | 3 | 257 | — | — | 2416 |
| .mjs | source | 4 | 373 | 313 | 36 | — |
| .mjs | test | 8 | 726 | 661 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit/issues?q=is%3Aissue+created%3A2026-09-22T07%3A41%3A13.677Z..2026-10-22T07%3A41%3A13.677Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-audit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A41%3A13.677Z..2026-10-22T07%3A41%3A13.677Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分元数据健康排名与安全审核，检查扫描失败路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件体检分数代表什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

audit_sync 从 GitHub dsh-plugin topic 和 npm 元数据组成本地 catalog；scoreRecord 以维护 30、文档 25、npm 30、awesome 列表 15 计算 0–100 分，high/critical 安全标志或 archived/gone 使等级 D，深扫确认缺插件结构且没有高危flag时直接赋等级C；该分支先于总分阈值，可能把原本低分D抬成C，并非单纯封顶。分数偏向元数据与生态活跃，不等于功能质量、可安装性或安全认证。audit_top/plugin/history 展示本地快照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-19](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/README.md#L3-L19)

作者评分和结构说明。

<details>
<summary>查看原文（17行）</summary>

```text
Turn the GitHub `dsh-plugin` topic into a **local, scored plugin catalog** for DeepSeek Harness.
Every plugin gets a 0–100 health score across four signals, a leaderboard in the web UI,
and agent tools that answer *"which plugins are worth installing?"*.

| Signal | Weight | What it measures |
| --- | --- | --- |
| Maintenance | 30 | last push recency + star tier + **star trend** (archived → 0 + 🚨 flag) |
| Docs | 25 | README presence + description depth + license |
| npm | 30 | npm package exists + publish recency + **weekly downloads (v0.3)** |
| Ecosystem | 15 | presence in the curated awesome list + listing recency |

Grades: **A 🛡️ (80+)** · **B ✅ (60+)** · **C ⚠️ (40+)** · **D 🚨 (<40 or any high flag)**.
Scores are pure functions over plain records — fully explainable (every deduction carries a note).

**v0.3:** npm signal now includes a weekly-downloads tier (exists 10 + publish recency 14 + weekly downloads 6).

**v0.4 (真插件校验 / topic-tag farming filter):** deep scan now verifies a repo is actually a DSH plugin — presence of `cordis.patch.yml`, `dsh.bundle` in package.json, or a plugin entry file. Repos with none of these are flagged `not-plugin` (medium) and **capped at grade C**, no matter how healthy they look. The npm probe also detects whether the published package declares `dsh.bundle` (installable via `dsh plugin add`). This filters the ~half of the topic that is old projects or tag farming.
```

</details>

**依据 2 · 源码核查**：[lib/scoring.js:21-27](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scoring.js#L21-L27)

权重与时间。

```text
export const WEIGHTS = { maintenance: 30, docs: 25, npm: 30, ecosystem: 15 };

function daysSince(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / 86400000;
```

**依据 3 · 源码核查**：[lib/scoring.js:168-209](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scoring.js#L168-L209)

总分与等级优先级，高危D优先、否则缺结构直接C

<details>
<summary>查看原文（42行）</summary>

```text
/** Compute the full report card for a record. Pure. */
export function scoreRecord(record) {
  const flags = [];
  if (record.archived === true) flags.push({ kind: "archived", severity: "high", detail: "repository is archived" });
  if (record.gone === true) flags.push({ kind: "gone", severity: "high", detail: "repository returned 404" });
  // Security findings from the static scan (v0.2): high/critical veto the grade.
  for (const f of record.security?.findings ?? []) {
    if (f.severity === "critical" || f.severity === "high") {
      flags.push({ kind: "security", severity: "high", detail: (f.rule ?? "security") + ": " + (f.detail ?? "") });
    }
  }
  // Plugin-structure verification (v0.4): after a deep scan, a repo with NO
  // cordis.patch.yml / dsh.bundle / plugin entry is likely topic-tag farming.
  const st = record.structure;
  if (st && st.checkedAt && st.dshEvidence === false) {
    flags.push({ kind: "not-plugin", severity: "medium", detail: "no DSH plugin structure (no cordis.patch.yml / dsh.bundle / plugin entry) — possible topic-tag farming" });
  }

  const maintenance = maintenanceScore(record);
  const docs = docsScore(record);
  const npm = npmScore(record);
  const ecosystem = ecosystemScore(record);
  const total = maintenance.points + docs.points + npm.points + ecosystem.points;

  const breakdown = {
    maintenance: { weight: WEIGHTS.maintenance, points: maintenance.points, notes: maintenance.notes },
    docs: { weight: WEIGHTS.docs, points: docs.points, notes: docs.notes },
    npm: { weight: WEIGHTS.npm, points: npm.points, notes: npm.notes },
    ecosystem: { weight: WEIGHTS.ecosystem, points: ecosystem.points, notes: ecosystem.notes },
  };

  const hasHighFlag = flags.some((f) => f.severity === "high");
  const hasMediumCap = flags.some((f) => f.kind === "not-plugin");
  const grade = hasHighFlag ? "D" : hasMediumCap ? "C" : total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";
  return {
    total,
    grade,
    breakdown,
    flags,
    scoredAt: new Date().toISOString(),
    version: 1,
  };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:66-134](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js#L66-L134)

sync 注册。

<details>
<summary>查看原文（69行）</summary>

```text
/** Cordis plugin body: register tools, projection, and optional schedule. */
function apply(ctx, config) {
  const storage = storageFor(config);
  const token = resolveToken(config);

  ctx.tools.register(defineTool({
    name: "audit_sync",
    description: "Sweep the GitHub dsh-plugin topic into the local plugin catalog: fetch repo metadata (stars, last push, license, archived), probe npm for matching package names, recompute health scores, and snapshot stars. Use this first, then audit_top / audit_plugin. Requires network; GitHub search is rate-limited (a token raises 10/min to 30/min) so runs are incremental and stop early when the budget runs low.",
    parameters: {
      force: {
        type: "boolean",
        description: "Re-fetch every page even if a recent sync exists (default reuses cached catalog when a sync finished less than an hour ago).",
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          fetched: { type: "integer", required: true },
          added: { type: "integer", required: true },
          updated: { type: "integer", required: true },
          total: { type: "integer", required: true },
          npmFound: { type: "integer", required: true },
          stopped: { type: "string" },
          rateRemaining: { type: "integer" },
          startedAt: { type: "string", required: true },
        },
      },
      render: (_args, value) => {
        const head = "audit sync: " + value.total + " plugins in catalog (" + value.added + " new, " + value.updated + " refreshed, " + value.npmFound + " on npm)";
        const lines = [head];
        if (value.stopped) lines.push("stopped early: " + value.stopped + " (resume with another audit_sync)");
        if (value.rateRemaining !== undefined) lines.push("GitHub rate remaining: " + value.rateRemaining);
        lines.push("started " + value.startedAt);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args, exec) => {
      const meta = storage.loadMeta();
      const fresh = !args.force && meta.lastSyncAt && Date.now() - Date.parse(meta.lastSyncAt) < 3600000;
      if (fresh) {
        const s = storage.getSummary();
        return { fetched: 0, added: 0, updated: 0, total: s.total, npmFound: s.withNpm, stopped: "recent-sync", startedAt: meta.lastSyncAt };
      }
      const summary = await syncTopic({ storage, token, npmProbe: config.npmProbe });
      try {
        const records = storage.loadCatalog();
        const date = String(summary.startedAt || new Date().toISOString()).slice(0, 10);
        const entries = records
          .filter((r) => typeof r?.score?.total === "number")
          .map((r) => ({ repo: r.repo, score: r.score.total, grade: r.score.grade ?? null }));
        const res = appendScoreSnapshots({ history: storage.loadScores(), entries, date });
        if (res.changed) storage.saveScores(res.history);
      } catch { /* score history must never break a sync */ }
      exec.agent?.session?.append?.("audit/sync", syncEvent(summary));
      return {
        fetched: summary.fetched,
        added: summary.added,
        updated: summary.updated,
        total: summary.total,
        npmFound: summary.npmFound,
        stopped: summary.stopped ?? undefined,
        rateRemaining: summary.rate?.remaining,
        startedAt: summary.startedAt,
      };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit sync", kind: "other", rawInput: args }),
  }));
```

</details>

**依据 5 · 源码核查**：[lib/client.js:43-80](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/client.js#L43-L80)

会话投影排行和dock注册

<details>
<summary>查看原文（38行）</summary>

```text
    /** Leaderboard dock: catalog summary + top scored plugins. */
    function AuditPanel(props) {
      var useProjection = props.useProjection;
      var projection = useProjection("auditSummary");
      if (projection == null) {
        return react.createElement("div", { className: "dspa-dock", "data-audit-panel": true },
          react.createElement("div", { className: "dspa-empty" }, "Plugin audit: catalog unavailable."));
      }
      var rows = [];
      if (projection.total === 0) {
        rows.push(react.createElement("div", { key: "empty", className: "dspa-empty" },
          "插件体检：目录为空 — 让 Agent 运行 audit_sync 同步 GitHub dsh-plugin 生态。"));
      } else {
        var top = (projection.top || []).map(function (r) {
          return react.createElement("div", { key: r.repo, className: "dspa-row" },
            react.createElement("span", { className: "dspa-badge" }, r.grade ? (BADGE[r.grade] || "❓") + " " + r.grade : "? "),
            react.createElement("span", { className: "dspa-repo" }, r.repo),
            react.createElement("span", { className: "dspa-meta" }, (r.score != null ? r.score + "/100" : "") + (r.stars != null ? " · " + r.stars + "★" : "") + (r.category ? " · " + r.category : "")));
        });
        rows.push(react.createElement("div", { key: "counts", className: "dspa-meta" },
          projection.total + " 插件 · " + projection.scored + " 已评分 · " + projection.withNpm + " 有 npm 包 · " + projection.flagged + " 带警示 · 上次同步 " + fmtDate(projection.lastSyncAt)));
        rows = rows.concat(top);
      }
      return react.createElement("div", { className: "dspa-dock", "data-audit-panel": true },
        react.createElement("div", { className: "dspa-head" }, "🩺 DSH 插件体检"),
        rows);
    }

    /** Browser plugin body: register the dock entry into the composer dock. */
    function apply(ctx) {
      ctx.slots.inject("conversation.input.dock", function () {
        return ctx.slots.register({
          name: "conversation.input.dock",
          id: "audit-leaderboard",
          order: 40,
        }, AuditPanel);
      });
    }
```

</details>

#### 缺口

- 未运行真实 topic 全量同步
  **影响**：目录覆盖与元数据误差未知
  **进一步探讨**：用固定仓库样本核查分数与安装表现

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · audit_scan 的“清洁”和失败状态能否信任？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

深扫只取树和最多六个文件（package、最多三 entry、最多三 scripts），其余代码/依赖未检查；正则规则也不做数据流分析。更严重的是 fetchKeyFiles 失败会返回 files=[]、tree=null、error，但 scanPlugin 仍对空文件扫描，applyScanToRecord 重置 security 为零 finding、trustScore=100，并把无 tree 视为无DSH结构；若无其它高危flag则直接给C，可能将低总分D抬为C；工具返回时丢弃 out.error，render 显示“no findings — clean”。这会把网络/速率失败误呈为干净扫描，且可能覆盖之前的扫描证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scanner.js:18-49](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js#L18-L49)

最多六个文件。

<details>
<summary>查看原文（32行）</summary>

```text
const MAX_FILES = 6;

function headers(token) {
  return {
    accept: "application/vnd.github+json",
    "user-agent": UA,
    ...(token ? { authorization: "Bearer " + token } : {}),
  };
}

const ENTRY_CANDIDATES = [
  "lib/index.js", "src/index.js", "index.js", "plugin.js", "src/plugin.js",
  "lib/client.js", "src/index.ts", "lib/index.ts", "index.ts",
];

/** Pick which tree paths to fetch; prefer roots, cap by MAX_FILES. */
export function pickFiles(treePaths) {
  const out = [];
  const shells = [];
  const entries = [];
  let pkg = null;
  for (const p of treePaths) {
    if (p === "package.json") { pkg = p; continue; }
    if (/package\.json$/.test(p) && p.split("/").length === 2 && !pkg) { pkg = p; continue; }
    if (/\.(sh|bash|zsh)$/.test(p)) { shells.push(p); continue; }
    if (ENTRY_CANDIDATES.includes(p)) { entries.push(p); continue; }
    if (/^scripts\//.test(p) && /\.[a-z]+$/.test(p) && shells.length < 3) { shells.push(p); continue; }
  }
  if (pkg) out.push(pkg);
  out.push(...entries.slice(0, 3));
  out.push(...shells.slice(0, 3));
  return out.slice(0, MAX_FILES);
```

</details>

**依据 2 · 源码核查**：[lib/scanner.js:56-80](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js#L56-L80)

失败返回空文件和错误。

<details>
<summary>查看原文（25行）</summary>

```text
export async function fetchKeyFiles(repo, { token, fetchImpl = fetch }) {
  try {
    const treeRes = await fetchImpl(GITHUB_API + "/repos/" + repo + "/git/trees/HEAD?recursive=1", {
      headers: headers(token),
      signal: AbortSignal.timeout(20000),
    });
    if (!treeRes.ok) return { files: [], hasReadme: null, tree: null, error: "tree HTTP " + treeRes.status };
    const body = await treeRes.json();
    const paths = (body.tree ?? []).filter((t) => t.type === "blob").map((t) => t.path);
    const hasReadme = paths.some((p) => /^readme(\.md|\.txt|\.rst)?$/i.test(p.split("/").pop() ?? ""));
    const targets = pickFiles(paths);
    const files = [];
    for (const p of targets) {
      const res = await fetchImpl(GITHUB_API + "/repos/" + repo + "/contents/" + encodeURIComponent(p), {
        headers: { ...headers(token), accept: "application/vnd.github.raw" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length < 512 * 1024) files.push({ path: p, text });
    }
    return { files, hasReadme, tree: paths };
  } catch (err) {
    return { files: [], hasReadme: null, tree: null, error: String(err?.message ?? err) };
  }
```

</details>

**依据 3 · 源码核查**：[lib/audit.js:254-273](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/audit.js#L254-L273)

失败后仍扫描/保存。

<details>
<summary>查看原文（20行）</summary>

```text
export async function scanPlugin(storage, repo, { token, fetchImpl = fetch } = {}) {
  const records = storage.loadCatalog();
  const record = records.find((r) => r.repo === repo) ?? records.find((r) => r.name === repo);
  if (!record) return { found: false, repo };
  const scan = await fetchKeyFiles(record.repo, { token, fetchImpl });
  const result = runSecurityScan(scan.files);
  applyScanToRecord(record, { ...scan, result });
  record.score = scoreRecord(record);
  storage.mergeRecords([record]);
  return {
    found: true,
    repo: record.repo,
    filesScanned: scan.files.map((f) => f.path),
    hasReadme: scan.hasReadme,
    findings: result.findings,
    trustScore: result.trustScore,
    grade: record.score.grade,
    total: record.score.total,
    error: scan.error ?? null,
  };
```

</details>

**依据 4 · 源码核查**：[lib/scanner.js:83-110](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js#L83-L110)

覆盖 security/结构。

<details>
<summary>查看原文（28行）</summary>

```text
/** Merge a scan result into a catalog record (mutates and returns it). */
export function applyScanToRecord(record, scan) {
  if (!record) return record;
  record.security = {
    scannedAt: new Date().toISOString(),
    filesScanned: scan.files.map((f) => f.path),
    findings: scan.result.findings,
    trustScore: scan.result.trustScore,
  };
  if (scan.hasReadme !== null) record.hasReadme = scan.hasReadme;
  // Plugin-structure verification (v0.4): is this repo actually a DSH plugin,
  // or just tagged dsh-plugin (topic-tag farming)?
  const paths = scan.tree ?? [];
  const pkgFile = (scan.files ?? []).find((f) => f.path === "package.json" || f.path.endsWith("/package.json"));
  let hasBundle = false;
  if (pkgFile) {
    try { hasBundle = !!(JSON.parse(pkgFile.text).dsh?.bundle); } catch { hasBundle = false; }
  }
  const hasPatch = (scan.files ?? []).some((f) => /cordis\.(patch\.ya?ml|ya?ml)$/.test(f.path))
    || paths.some((p) => /cordis\.(patch\.ya?ml|ya?ml)$/.test(p));
  const hasEntry = paths.some((p) => ENTRY_CANDIDATES.includes(p));
  record.structure = {
    checkedAt: new Date().toISOString(),
    hasPatch,
    hasBundle,
    hasEntry,
    dshEvidence: hasPatch || hasBundle || hasEntry,
  };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:255-274](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js#L255-L274)

工具输出“clean”且不含 error。

<details>
<summary>查看原文（20行）</summary>

```text
      render: (_args, value) => {
        if (!value.found) return [{ type: "text", text: "plugin not found in catalog: " + (value.repo ?? "?") + " (run audit_sync first)" }];
        const lines = ["scan " + value.repo + " — trust " + value.trustScore + "/100, grade " + value.grade];
        lines.push("files: " + ((value.filesScanned ?? []).join(", ") || "none"));
        for (const f of value.findings ?? []) lines.push("  ⚑ " + f);
        if ((value.findings ?? []).length === 0) lines.push("  no findings — clean (static scan only, not a guarantee)");
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args, exec) => {
      const out = await scanPlugin(storage, (args.repo ?? "").trim(), { token });
      exec.agent?.session?.append?.("audit/scan", { repo: out.repo, trustScore: out.trustScore, grade: out.grade });
      return {
        found: out.found,
        repo: out.repo,
        filesScanned: out.filesScanned ?? [],
        trustScore: out.trustScore ?? null,
        grade: out.grade ?? null,
        findings: (out.findings ?? []).map((f) => f.severity + " " + f.rule + ": " + f.detail),
      };
```

</details>

#### 缺口

- 未在宿主模拟 GitHub 失败
  **影响**：实际误导程度与持久化状态待运行验证
  **进一步探讨**：隔离 fake fetch 429/500 与已有 finding 记录回归

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 静态安全警示与生态决策怎样使用？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

扫描仅静态文本规则：URL 不在 allowlist 命中网络调用，源码中读取 process.env 且同文件含该 URL 就标高危 env-exfil，未证明变量值发往域名；也无法覆盖动态拼接/依赖包/未取文件。高危 finding 会直接 veto D，因此应当把 D 视为人工复核线索，而 A/“clean”也不能当安全保证。网络 sync 受 GitHub rate limit、npm 可达性、名单时效影响；推荐把已校验固定 SHA、完整安装测试与手工安全审阅作为采用门槛。

#### 证据与依据

**依据 1 · 源码核查**：[lib/security.js:19-53](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/security.js#L19-L53)

域名 allowlist/URL 正则。

<details>
<summary>查看原文（35行）</summary>

```text
/** Domains a plugin may legitimately talk to without review. */
export const NET_ALLOWLIST = [
  "api.github.com", "raw.githubusercontent.com", "registry.npmjs.org",
  "github.com", "api.deepseek.com", "deepseek.com", "localhost", "127.0.0.1",
  "0.0.0.0", "::1",
];

const SEVERITY_WEIGHT = { critical: 40, high: 20, medium: 8, low: 3, info: 1 };

/** Run a regex over text and return a finding detail or null. */
function find(patterns, text) {
  for (const re of patterns) {
    const m = re.exec(text);
    if (m) return m[0].slice(0, 120);
  }
  return null;
}

/** Network exfiltration: suspicious domains outside the allowlist. */
export function scanNetworkUrls(text, path) {
  const findings = [];
  const re = /(?:fetch\(\s*["']|https?:\/\/)([a-zA-Z0-9.-]+\.[a-z]{2,})(?:[\/"']|\s)/g;
  let m;
  const seen = new Set();
  while ((m = re.exec(text)) !== null) {
    const host = m[1].toLowerCase();
    if (NET_ALLOWLIST.some((d) => host === d || host.endsWith("." + d))) continue;
    if (seen.has(host)) continue;
    seen.add(host);
    findings.push({
      rule: "net-callback",
      severity: host.includes("telegram") || host.includes("t.me") || host.includes("discord") ? "high" : "medium",
      detail: "network call to non-allowlisted host: " + host + " (" + path + ")",
    });
  }
```

</details>

**依据 2 · 源码核查**：[lib/security.js:117-165](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/security.js#L117-L165)

env+URL 启发式与 trustScore。

<details>
<summary>查看原文（49行）</summary>

```text
export function scanSource(text, path) {
  const findings = [];
  if (find([/\beval\s*\(/i], text)) {
    findings.push({ rule: "eval", severity: "high", detail: "eval() in source (" + path + ")" });
  }
  if (find([/new\s+Function\s*\(/i, /Function\s*\(\s*["']/i], text)) {
    findings.push({ rule: "dynamic-code", severity: "medium", detail: "dynamic code construction (" + path + ")" });
  }
  if (find([/(?:child_process\.(?:exec|execSync|spawn|spawnSync))|(?:require\(["']child_process["']\))/i], text)) {
    findings.push({ rule: "child-process", severity: "medium", detail: "spawns child processes (" + path + ")" });
  }
  if (find([/atob\s*\([^)]{80,}/i, /fromCharCode\([^)]{200,}/i, /[A-Za-z0-9+/=]{200,}/i], text)) {
    findings.push({ rule: "obfuscation", severity: "medium", detail: "possible obfuscated blob (" + path + ")" });
  }
  const urls = scanNetworkUrls(text, path);
  findings.push(...urls);
  const envRead = /process\.env\s*\[/.test(text) || /process\.env\.[A-Za-z_]+/.test(text);
  const exfil = urls.some((f) => f.severity === "high" || f.severity === "medium");
  if (envRead && exfil) {
    findings.push({ rule: "env-exfil", severity: "high", detail: "reads process.env and sends data to a non-allowlisted host (" + path + ")" });
  }
  if (envRead && !exfil) {
    findings.push({ rule: "env-read", severity: "info", detail: "reads process.env (" + path + ")" });
  }
  return findings;
}

/** Run every scanner over a set of files; produce findings + a trust score. */
export function runSecurityScan(files) {
  const findings = [];
  for (const file of files) {
    const { path, text } = file;
    if (!text) continue;
    if (/package\.json$/.test(path)) findings.push(...scanManifest(text, path));
    else if (/\.(sh|bash|zsh)$/.test(path) || path.startsWith("scripts/")) findings.push(...scanShell(text, path));
    else if (/\.(js|cjs|mjs|ts|mts|cts)$/.test(path)) findings.push(...scanSource(text, path));
    else findings.push(...scanNetworkUrls(text, path));
  }
  const seen = new Set();
  const unique = findings.filter((f) => {
    const k = f.rule + "|" + f.severity + "|" + f.detail;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  unique.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));
  const trustScore = Math.max(0, 100 - unique.reduce((acc, f) => acc + (SEVERITY_WEIGHT[f.severity] ?? 1), 0));
  return { findings: unique, trustScore };
```

</details>

**依据 3 · 源码核查**：[lib/scoring.js:168-201](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scoring.js#L168-L201)

finding 对等级影响。

<details>
<summary>查看原文（34行）</summary>

```text
/** Compute the full report card for a record. Pure. */
export function scoreRecord(record) {
  const flags = [];
  if (record.archived === true) flags.push({ kind: "archived", severity: "high", detail: "repository is archived" });
  if (record.gone === true) flags.push({ kind: "gone", severity: "high", detail: "repository returned 404" });
  // Security findings from the static scan (v0.2): high/critical veto the grade.
  for (const f of record.security?.findings ?? []) {
    if (f.severity === "critical" || f.severity === "high") {
      flags.push({ kind: "security", severity: "high", detail: (f.rule ?? "security") + ": " + (f.detail ?? "") });
    }
  }
  // Plugin-structure verification (v0.4): after a deep scan, a repo with NO
  // cordis.patch.yml / dsh.bundle / plugin entry is likely topic-tag farming.
  const st = record.structure;
  if (st && st.checkedAt && st.dshEvidence === false) {
    flags.push({ kind: "not-plugin", severity: "medium", detail: "no DSH plugin structure (no cordis.patch.yml / dsh.bundle / plugin entry) — possible topic-tag farming" });
  }

  const maintenance = maintenanceScore(record);
  const docs = docsScore(record);
  const npm = npmScore(record);
  const ecosystem = ecosystemScore(record);
  const total = maintenance.points + docs.points + npm.points + ecosystem.points;

  const breakdown = {
    maintenance: { weight: WEIGHTS.maintenance, points: maintenance.points, notes: maintenance.notes },
    docs: { weight: WEIGHTS.docs, points: docs.points, notes: docs.notes },
    npm: { weight: WEIGHTS.npm, points: npm.points, notes: npm.notes },
    ecosystem: { weight: WEIGHTS.ecosystem, points: ecosystem.points, notes: ecosystem.notes },
  };

  const hasHighFlag = flags.some((f) => f.severity === "high");
  const hasMediumCap = flags.some((f) => f.kind === "not-plugin");
  const grade = hasHighFlag ? "D" : hasMediumCap ? "C" : total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";
```

</details>

**依据 4 · 作者声明**：[README.md:21-26](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/README.md#L21-L26)

安全 veto 声明。

```text
**Security (v0.2) is a veto, not a weight:** `audit_scan` static-scans a
plugin's package.json install scripts, shell scripts, and entry sources for
remote-code-execution, encoded commands, rc persistence, obfuscation, and
exfiltration to non-allowlisted hosts. High/critical findings land in the
`flags` contract → **grade D**, no matter how healthy the other signals look.
Each finding carries evidence; the scanner is deliberately conservative.
```

#### 缺口

- 未做人工标注误报/漏报评估
  **影响**：警示校准性未知
  **进一步探讨**：以已知安全/恶意插件样本做盲评

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复如何核算成本和效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装包/本地catalog磁盘，GitHub/npm初次同步请求；价格未知 | 配数据目录与可选token，核评分口径与权限，工时未知 | API额度/覆盖范围依账号与同步停止条件，不能保证全目录 |
| 持续使用 | 同步元数据、历史快照，按需tree与最多6次contents抓取/静态扫描；可选schedule周期执行 | 复核分数/误报及漏扫，工时未知 | 限流/网络错误可能产生不完整信息，净节省未测 |
| 失败恢复 | 重试API与备份catalog恢复所需网络/磁盘，金额未知 | 对照旧finding与抓取coverage、追失败状态，工时未知 | 当前失败可覆盖旧证据，重试成功不证明旧证据完整恢复 |

以能解释范围与错误状态的候选筛选结果为成本单位，不以显示clean或高trust算有效验收。评分减少分散元数据整理，安全复核仍需固定版本源码；有限文件抓取控制请求量也牺牲覆盖，不能将两者混为全仓审计节约。价格、配额实际消耗、人工误报复核与恢复工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scanner.js:18-80](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js#L18-L80)

限文件抓取与失败

<details>
<summary>查看原文（63行）</summary>

```text
const MAX_FILES = 6;

function headers(token) {
  return {
    accept: "application/vnd.github+json",
    "user-agent": UA,
    ...(token ? { authorization: "Bearer " + token } : {}),
  };
}

const ENTRY_CANDIDATES = [
  "lib/index.js", "src/index.js", "index.js", "plugin.js", "src/plugin.js",
  "lib/client.js", "src/index.ts", "lib/index.ts", "index.ts",
];

/** Pick which tree paths to fetch; prefer roots, cap by MAX_FILES. */
export function pickFiles(treePaths) {
  const out = [];
  const shells = [];
  const entries = [];
  let pkg = null;
  for (const p of treePaths) {
    if (p === "package.json") { pkg = p; continue; }
    if (/package\.json$/.test(p) && p.split("/").length === 2 && !pkg) { pkg = p; continue; }
    if (/\.(sh|bash|zsh)$/.test(p)) { shells.push(p); continue; }
    if (ENTRY_CANDIDATES.includes(p)) { entries.push(p); continue; }
    if (/^scripts\//.test(p) && /\.[a-z]+$/.test(p) && shells.length < 3) { shells.push(p); continue; }
  }
  if (pkg) out.push(pkg);
  out.push(...entries.slice(0, 3));
  out.push(...shells.slice(0, 3));
  return out.slice(0, MAX_FILES);
}

/**
 * Fetch the key files of one repo. Returns { files, hasReadme, tree }.
 * hasReadme is true/false when the tree was readable, null otherwise.
 */
export async function fetchKeyFiles(repo, { token, fetchImpl = fetch }) {
  try {
    const treeRes = await fetchImpl(GITHUB_API + "/repos/" + repo + "/git/trees/HEAD?recursive=1", {
      headers: headers(token),
      signal: AbortSignal.timeout(20000),
    });
    if (!treeRes.ok) return { files: [], hasReadme: null, tree: null, error: "tree HTTP " + treeRes.status };
    const body = await treeRes.json();
    const paths = (body.tree ?? []).filter((t) => t.type === "blob").map((t) => t.path);
    const hasReadme = paths.some((p) => /^readme(\.md|\.txt|\.rst)?$/i.test(p.split("/").pop() ?? ""));
    const targets = pickFiles(paths);
    const files = [];
    for (const p of targets) {
      const res = await fetchImpl(GITHUB_API + "/repos/" + repo + "/contents/" + encodeURIComponent(p), {
        headers: { ...headers(token), accept: "application/vnd.github.raw" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length < 512 * 1024) files.push({ path: p, text });
    }
    return { files, hasReadme, tree: paths };
  } catch (err) {
    return { files: [], hasReadme: null, tree: null, error: String(err?.message ?? err) };
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:66-134](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js#L66-L134)

同步与历史

<details>
<summary>查看原文（69行）</summary>

```text
/** Cordis plugin body: register tools, projection, and optional schedule. */
function apply(ctx, config) {
  const storage = storageFor(config);
  const token = resolveToken(config);

  ctx.tools.register(defineTool({
    name: "audit_sync",
    description: "Sweep the GitHub dsh-plugin topic into the local plugin catalog: fetch repo metadata (stars, last push, license, archived), probe npm for matching package names, recompute health scores, and snapshot stars. Use this first, then audit_top / audit_plugin. Requires network; GitHub search is rate-limited (a token raises 10/min to 30/min) so runs are incremental and stop early when the budget runs low.",
    parameters: {
      force: {
        type: "boolean",
        description: "Re-fetch every page even if a recent sync exists (default reuses cached catalog when a sync finished less than an hour ago).",
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          fetched: { type: "integer", required: true },
          added: { type: "integer", required: true },
          updated: { type: "integer", required: true },
          total: { type: "integer", required: true },
          npmFound: { type: "integer", required: true },
          stopped: { type: "string" },
          rateRemaining: { type: "integer" },
          startedAt: { type: "string", required: true },
        },
      },
      render: (_args, value) => {
        const head = "audit sync: " + value.total + " plugins in catalog (" + value.added + " new, " + value.updated + " refreshed, " + value.npmFound + " on npm)";
        const lines = [head];
        if (value.stopped) lines.push("stopped early: " + value.stopped + " (resume with another audit_sync)");
        if (value.rateRemaining !== undefined) lines.push("GitHub rate remaining: " + value.rateRemaining);
        lines.push("started " + value.startedAt);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args, exec) => {
      const meta = storage.loadMeta();
      const fresh = !args.force && meta.lastSyncAt && Date.now() - Date.parse(meta.lastSyncAt) < 3600000;
      if (fresh) {
        const s = storage.getSummary();
        return { fetched: 0, added: 0, updated: 0, total: s.total, npmFound: s.withNpm, stopped: "recent-sync", startedAt: meta.lastSyncAt };
      }
      const summary = await syncTopic({ storage, token, npmProbe: config.npmProbe });
      try {
        const records = storage.loadCatalog();
        const date = String(summary.startedAt || new Date().toISOString()).slice(0, 10);
        const entries = records
          .filter((r) => typeof r?.score?.total === "number")
          .map((r) => ({ repo: r.repo, score: r.score.total, grade: r.score.grade ?? null }));
        const res = appendScoreSnapshots({ history: storage.loadScores(), entries, date });
        if (res.changed) storage.saveScores(res.history);
      } catch { /* score history must never break a sync */ }
      exec.agent?.session?.append?.("audit/sync", syncEvent(summary));
      return {
        fetched: summary.fetched,
        added: summary.added,
        updated: summary.updated,
        total: summary.total,
        npmFound: summary.npmFound,
        stopped: summary.stopped ?? undefined,
        rateRemaining: summary.rate?.remaining,
        startedAt: summary.startedAt,
      };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit sync", kind: "other", rawInput: args }),
  }));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:373-383](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js#L373-L383)

可选周期同步

<details>
<summary>查看原文（11行）</summary>

```text

  // Optional periodic sync. The schedule service may not be mounted on every
  // profile, so guard it: auto-sync is a convenience, never a hard dependency.
  if (config.syncIntervalHours > 0 && typeof ctx.schedule?.setInterval === "function") {
    const ms = config.syncIntervalHours * 3600000;
    ctx.effect(() => ctx.schedule.setInterval(() => {
      syncTopic({ storage, token, npmProbe: config.npmProbe }).catch((err) => {
        console.error("[dsh-plugin-audit] scheduled sync failed:", err);
      });
    }, ms), "audit.sync-schedule()");
  }
```

</details>

#### 缺口

- 真实目录规模、配额和人工复核恢复工时未知
  **影响**：无法计算净节约或完整安全审查成本
  **进一步探讨**：从固定样本的API请求量、范围和复核记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪独立失败状态和覆盖率记录能减少虚假clean？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定链条中fetch异常产生空files和error，空扫得100 trust，随后覆盖security，工具又丢error并展示clean。相对当前空扫成功语义，设计假设是将抓取失败、部分覆盖、完成扫描分开，保留旧成功结果及其SHA/时间，在输出中带已取/未取文件和错误，可减少读者把失败当安全的决定。条件是错误一路传递且存储能原子保留旧证据，部分contents失败也被显式记账；代价是记录版本、界面状态和迁移复杂度。最小对照以相同预置高危finding和固定仓库样本，分别制造tree非OK、contents非OK、网络throw、空仓库和正常有限扫描，在原版及隔离原型检查是否覆盖旧证据、是否显示clean、覆盖率/错误是否可见及请求/存储代价。若失败仍呈成功clean、旧成功证据丢失或部分覆盖被当全仓，假设被证伪；若状态显示正确也不证明正则具备数据流检测能力。此方案未实现/未执行，误报漏报须另以人工标注校准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scanner.js:56-110](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/scanner.js#L56-L110)

失败和覆盖security

<details>
<summary>查看原文（55行）</summary>

```text
export async function fetchKeyFiles(repo, { token, fetchImpl = fetch }) {
  try {
    const treeRes = await fetchImpl(GITHUB_API + "/repos/" + repo + "/git/trees/HEAD?recursive=1", {
      headers: headers(token),
      signal: AbortSignal.timeout(20000),
    });
    if (!treeRes.ok) return { files: [], hasReadme: null, tree: null, error: "tree HTTP " + treeRes.status };
    const body = await treeRes.json();
    const paths = (body.tree ?? []).filter((t) => t.type === "blob").map((t) => t.path);
    const hasReadme = paths.some((p) => /^readme(\.md|\.txt|\.rst)?$/i.test(p.split("/").pop() ?? ""));
    const targets = pickFiles(paths);
    const files = [];
    for (const p of targets) {
      const res = await fetchImpl(GITHUB_API + "/repos/" + repo + "/contents/" + encodeURIComponent(p), {
        headers: { ...headers(token), accept: "application/vnd.github.raw" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length < 512 * 1024) files.push({ path: p, text });
    }
    return { files, hasReadme, tree: paths };
  } catch (err) {
    return { files: [], hasReadme: null, tree: null, error: String(err?.message ?? err) };
  }
}

/** Merge a scan result into a catalog record (mutates and returns it). */
export function applyScanToRecord(record, scan) {
  if (!record) return record;
  record.security = {
    scannedAt: new Date().toISOString(),
    filesScanned: scan.files.map((f) => f.path),
    findings: scan.result.findings,
    trustScore: scan.result.trustScore,
  };
  if (scan.hasReadme !== null) record.hasReadme = scan.hasReadme;
  // Plugin-structure verification (v0.4): is this repo actually a DSH plugin,
  // or just tagged dsh-plugin (topic-tag farming)?
  const paths = scan.tree ?? [];
  const pkgFile = (scan.files ?? []).find((f) => f.path === "package.json" || f.path.endsWith("/package.json"));
  let hasBundle = false;
  if (pkgFile) {
    try { hasBundle = !!(JSON.parse(pkgFile.text).dsh?.bundle); } catch { hasBundle = false; }
  }
  const hasPatch = (scan.files ?? []).some((f) => /cordis\.(patch\.ya?ml|ya?ml)$/.test(f.path))
    || paths.some((p) => /cordis\.(patch\.ya?ml|ya?ml)$/.test(p));
  const hasEntry = paths.some((p) => ENTRY_CANDIDATES.includes(p));
  record.structure = {
    checkedAt: new Date().toISOString(),
    hasPatch,
    hasBundle,
    hasEntry,
    dshEvidence: hasPatch || hasBundle || hasEntry,
  };
```

</details>

**依据 2 · 源码核查**：[lib/audit.js:254-273](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/audit.js#L254-L273)

空扫仍保存并返回error

<details>
<summary>查看原文（20行）</summary>

```text
export async function scanPlugin(storage, repo, { token, fetchImpl = fetch } = {}) {
  const records = storage.loadCatalog();
  const record = records.find((r) => r.repo === repo) ?? records.find((r) => r.name === repo);
  if (!record) return { found: false, repo };
  const scan = await fetchKeyFiles(record.repo, { token, fetchImpl });
  const result = runSecurityScan(scan.files);
  applyScanToRecord(record, { ...scan, result });
  record.score = scoreRecord(record);
  storage.mergeRecords([record]);
  return {
    found: true,
    repo: record.repo,
    filesScanned: scan.files.map((f) => f.path),
    hasReadme: scan.hasReadme,
    findings: result.findings,
    trustScore: result.trustScore,
    grade: record.score.grade,
    total: record.score.total,
    error: scan.error ?? null,
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:255-274](https://github.com/863683348/dsh-plugin-audit/blob/e5c9c5df08a56a23e37966640390d07052fcc9a6/lib/index.js#L255-L274)

模型结果丢弃error并显示clean

<details>
<summary>查看原文（20行）</summary>

```text
      render: (_args, value) => {
        if (!value.found) return [{ type: "text", text: "plugin not found in catalog: " + (value.repo ?? "?") + " (run audit_sync first)" }];
        const lines = ["scan " + value.repo + " — trust " + value.trustScore + "/100, grade " + value.grade];
        lines.push("files: " + ((value.filesScanned ?? []).join(", ") || "none"));
        for (const f of value.findings ?? []) lines.push("  ⚑ " + f);
        if ((value.findings ?? []).length === 0) lines.push("  no findings — clean (static scan only, not a guarantee)");
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args, exec) => {
      const out = await scanPlugin(storage, (args.repo ?? "").trim(), { token });
      exec.agent?.session?.append?.("audit/scan", { repo: out.repo, trustScore: out.trustScore, grade: out.grade });
      return {
        found: out.found,
        repo: out.repo,
        filesScanned: out.filesScanned ?? [],
        trustScore: out.trustScore ?? null,
        grade: out.grade ?? null,
        findings: (out.findings ?? []).map((f) => f.severity + " " + f.rule + ": " + f.detail),
      };
```

</details>

#### 缺口

- 方案未实现，读者误判下降和状态迁移代价未知
  **影响**：不能声称现有安全审核已可靠
  **进一步探讨**：从失败矩阵和预置旧证据的可核对状态差异入手

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
