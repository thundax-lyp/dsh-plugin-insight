# dsh-memory-setup

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[989e8a5](https://github.com/863683348/dsh-memory-setup/tree/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup) [![npm 30d 155](https://img.shields.io/static/v1?label=npm+30d&message=155&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-memory-setup) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-memory-setup)
<!-- END META -->

> **实现功能**：提供工作区JSON偏好、规范、工作流与教训记忆，含DSH工具、提示注入、知识检索及备份恢复接口。

> **核心亮点**：把可读工作区记忆、工具/提示注入、规则提取和检索/快照组合，减少每次重述的接线；Jaccard/BM25/cosine非新算法。详见[Q01](#research-q01)。

> **风险与缺陷**：冷KB调用未定义emptyKnowledge，通用更新可沿原型链；注入全局共享、分离revision非原子CAS，错误fix可晋升、脱敏/冷层未接线，限制高信任记忆主张。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 个人记忆如何帮助跨会话工作，真正增量是什么？](#detail-section-11)
  - [Q02 · 工作区注入与写入接口有没有可靠隔离？](#detail-section-12)
  - [Q03 · 检索、证据与自学习主张哪些成立？](#detail-section-13)
  - [Q04 · 并发、快照与恢复是否保证不丢数据？](#detail-section-14)
  - [Q05 · 启动、持续与失败恢复成本有哪些？](#detail-section-15)
  - [Q06 · 采用结论与可证伪的后续探索是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH用户保留偏好、项目规范、工作流和错误教训，原有办法是手工README/CLAUDE.md及每次重新提示。插件用工作区JSON、工具、changelog/备份/快照与systemPrompt可变context接线，另有知识条目BM25和可选向量检索。合格结果应是正确工作区、当前且有依据的记忆帮助真实任务，条目数/hits不是改善效果。

增量是可读文件+录入/复盘/恢复/注入的组合，不是新的记忆学习算法或事实验证器。scanner从有限README/package/配置用规则提出约定，有来源路径并可预览，适合做候选；不证明仓库实际规范或命令可执行。Jaccard、BM25及cosine来自常见方法，不能归插件新算法。

手工项目规范/偏好与每次重述；当前新增结构化记忆/知识文件和注入检索接口，效果需正确性前提。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 偏好/规范/复盘工具 | 保存工作区记忆 | 内容证据/路径需审 |
| 提示注入/focus | 下次少重述 | 单份共享/节流陈旧 |
| BM25/向量知识库 | 检索条目 | 冷KB缺定义，选配会外发 |
| 备份/快照/审计 | 人员可读恢复 | 非原子CAS/完整备份/防篡改 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/fs/systemPrompt/workspace和相关peer | 工具/文件/注入 | 无独立Node engines声明，宿主版本需核 |
| 明确单工作区/可写目录与备份 | JSON记忆 | 多会话共享context与并发不可当隔离 |
| 可选可信embedding endpoint/model/key | 语义检索 | 实际会外发文本，非纯本地 |
| 人员审记忆/证据/晋升 | 控制高信任提示 | hits/时间不等正确性 |



#### 使用流程

| 步骤 | 行为 | 判据 |
| --- | --- | --- |
| 首次 | 固定版本审配置/路径与冷KB初始化 | 先修缺定义/原型路径 |
| 录入 | 预览规范、证据与个人偏好 | 不录密钥/外来命令作可信事实 |
| 检索/注入 | 核工作区/当前版本/外发范围 | 不信cold/脱敏标签已生效 |
| 恢复 | 离线保全原件，逐文件核revision/KB/index | 不把索引当完整备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地JSON/Host依赖，选配向量服务 | 审高信任记忆、修初始化/路径、备份 | 部署工时/模型费用未知 |
| 持续使用 | 注入token、BM25扫描、向量请求、快照累计 | 核错误fix/晋升/冲突与敏感内容 | 无净省时/误召回对照 |
| 失败恢复 | 重建KB索引/备份、重复请求与可能丢写 | 保全损坏原件、核并发/旧revision、逐文件恢复 | 未保证事务/物理快照上限，恢复耗时未知 |



#### 效果

| 目标 | 已实现增量 | 限制 |
| --- | --- | --- |
| 少重述 | 偏好/教训文件与注入 | 共享/陈旧/错误内容风险 |
| 复用知识 | BM25/选配向量 | 冷KB缺定义、向量陈旧 |
| 可读审阅 | JSON/hash/changelog/快照 | 不等防篡改/完整恢复 |

> **思考**：冷KB调用未定义emptyKnowledge，通用更新可沿原型链；注入全局共享、分离revision非原子CAS，错误fix可晋升、脱敏/冷层未接线，限制高信任记忆主张。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把可读工作区记忆、工具/提示注入、规则提取和检索/快照组合，减少每次重述的接线；Jaccard/BM25/cosine非新算法。详见[Q01](#research-q01)。

把可读工作区记忆、工具/提示注入、规则提取和检索/快照组合，减少每次重述的接线；Jaccard/BM25/cosine非新算法。详见[Q01](#research-q01)。

revision检查是分离read→compare→backup→write，不是文件系统原子CAS/锁；两个会话都读同revision并同时比较成功仍能各写revision+1覆盖。KB无revision检查，search命中还写hits，读取式检索也参与丢更新风险。Host writeText是否原子不由插件证明，跨memory/KB/index更无事务。

snapshot payload包含doc/KB，但保留N只裁snapshots.json列表，不删除旧snapshot文件，因此不是物理存储上限。restore把历史doc的旧revision交saveDoc，当前revision已增长时触发conflict，正常回滚反可能被乐观检查拒；import/merge也需按其revision语义核，不能绕过冲突就声称安全。完整bundle导出只给snapshots索引，迁移后索引文件可能不存在；import_all先memory再KB再index，失败可部分恢复而无回滚。args.id拼快照相对路径未按索引/ID格式严格检查，物理越界仍取决Host fs。

backup写失败被吞，JSON parse失败当null，loadDoc可回空初始状态；后续保存有覆盖损坏原件风险。diff只对偏好与集合ID增删比较，同ID内容更改不报，不能作为完整语义变更审计。作者纯函数测试覆盖正常记录/显式过期/相似合并，package test不含knowledge与smoke-import，未证明Host工具初始化、并发、真实恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

冷KB调用未定义emptyKnowledge，通用更新可沿原型链；注入全局共享、分离revision非原子CAS，错误fix可晋升、脱敏/冷层未接线，限制高信任记忆主张。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前不推荐直接启为真实高信任记忆层。文件化与工具组合方向有用，但缺失emptyKnowledge、通用路径原型链、共享注入、非原子CAS与恢复冲突、无效fix晋升/脱敏未接线使README多项关键保证不成立。先修核心正确性，再单工作区无秘密数据评估；不因功能数量提高信任。详见[Q06](#research-q06)。

增量是可读文件+录入/复盘/恢复/注入的组合，不是新的记忆学习算法或事实验证器。scanner从有限README/package/配置用规则提出约定，有来源路径并可预览，适合做候选；不证明仓库实际规范或命令可执行。Jaccard、BM25及cosine来自常见方法，不能归插件新算法。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。文件化记忆组合贡献可见，安全隔离/多会话安全/恢复与自学习强主张存在明确静态缺口。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、lib/index.js、lib/memory.js、lib/knowledge.js、lib/kb-tools.js、lib/scanner.js、test/memory.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取完整memory/knowledge/kb-tools/scanner、index存储/注入/更新/导出/快照恢复/聚焦层级审计与导入主链、作者纯函数测试片段与包/安全声明；未全面审所有工具schema/发布脚本/Host，不运行目标或真实记忆。
- 下一步：可继续假fs/两工作区/双写/恢复/敏感字段与失败fix矩阵，原型未实现。

**分析版本**

- **仓库**：[863683348/dsh-memory-setup](https://github.com/863683348/dsh-memory-setup)
- **版本号**：1.2.0（[固定提交 989e8a5](https://github.com/863683348/dsh-memory-setup/tree/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索按工作区的不可变版本快照、typed patch与锁内事务、效果确认晋升及统一隐私策略，用假fs交错矩阵证伪；未实现。详见[Q06](#research-q06)。

可继续假fs/两工作区/双写/恢复/敏感字段与失败fix矩阵，原型未实现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 2204 | 1947 | 148 | — |
| .md | source | 3 | 109 | — | — | 1126 |
| .mjs | source | 1 | 117 | 103 | 7 | — |
| .mjs | test | 4 | 417 | 369 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup/issues?q=is%3Aissue+created%3A2026-09-22T10%3A47%3A05.357Z..2026-10-22T10%3A47%3A05.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A47%3A05.357Z..2026-10-22T10%3A47%3A05.357Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核高信任记忆的工作区注入、检索/证据晋升、并发恢复和隐私，按真实代码区分README主张。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 个人记忆如何帮助跨会话工作，真正增量是什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

面向DSH用户保留偏好、项目规范、工作流和错误教训，原有办法是手工README/CLAUDE.md及每次重新提示。插件用工作区JSON、工具、changelog/备份/快照与systemPrompt可变context接线，另有知识条目BM25和可选向量检索。合格结果应是正确工作区、当前且有依据的记忆帮助真实任务，条目数/hits不是改善效果。

增量是可读文件+录入/复盘/恢复/注入的组合，不是新的记忆学习算法或事实验证器。scanner从有限README/package/配置用规则提出约定，有来源路径并可预览，适合做候选；不证明仓库实际规范或命令可执行。Jaccard、BM25及cosine来自常见方法，不能归插件新算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:73-93](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L73-L93)

工具指导与共享context。

<details>
<summary>查看原文（21行）</summary>

```text
  const memoryRel = (file) => join(dirName, file);
  const kbRel = (file) => join(dirName, file);
  const cwdOf = (exec) => exec.agent?.session?.header?.cwd;

  const STATIC_GUIDANCE =
    "A personal memory lives in the session workspace at .dsh-memory-setup/memory.json. " +
    "At the start of meaningful work read it (memory_status) and follow your preferences, conventions, workflows and lessons. " +
    "Record new conventions with memory_project, formalize failures with memory_review, and consult your knowledge base with knowledge_search." +
    (config.reviewReminder
      ? " At the end of a long task, run memory_review for anything that failed and knowledge_add for useful new facts."
      : "") +
    (config.troubleshootReminder
      ? " When a tool or command fails, run memory_troubleshoot with the error text — it checks past lessons and knowledge for a known fix. Snapshot your memory before big changes with memory_snapshot."
      : "");
  /** Mutable context object — dsh-system-prompt renders its .text live per request. */
  const memCtx = { name: "memory:content", order: 500, text: STATIC_GUIDANCE };
  let lastContextRefresh = 0;
  /** v0.9: optional focus topic — when set, only relevant memory fragments are injected. */
  let focusQuery = config.focus || "";

  let fsFailures = 0;
```

</details>

**依据 2 · 源码核查**：[lib/scanner.js:7-59](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/scanner.js#L7-L59)

规则提取。

<details>
<summary>查看原文（53行）</summary>

```text
const COMMAND_RE = /(npm|yarn|pnpm|bun|pip|pip3|poetry|uv|python|python3|make|docker|docker-compose|gradle|mvn|cargo|go run|ruby)\s+[^\n]{0,60}/gi;

function extractFromPackageJson(text, out) {
  try {
    const pkg = JSON.parse(text);
    const scripts = pkg.scripts ? Object.keys(pkg.scripts) : [];
    if (scripts.length) {
      out.push({ type: "workflow", pattern: "package-manager", detail: "npm scripts: " + scripts.slice(0, 8).join(", "), evidence: "package.json" });
    }
    const pkgManager = pkg.packageManager || (pkg.lockfileVersion ? "npm" : null);
    if (pkgManager) out.push({ type: "config", pattern: "package-manager", detail: "declared package manager: " + pkgManager, evidence: "package.json" });
  } catch { /* not json */ }
}

function extractFromReadme(text, out) {
  const commands = new Set();
  for (const m of text.matchAll(COMMAND_RE)) commands.add(m[1].toLowerCase());
  if (commands.size) {
    out.push({ type: "workflow", pattern: "commands", detail: "documented commands: " + [...commands].slice(0, 6).join(", "), evidence: "README" });
  }
}

function extractFromEnvExample(text, out) {
  const vars = [...text.matchAll(/^([A-Z][A-Z0-9_]{2,})/gm)].map((m) => m[1]).slice(0, 10);
  if (vars.length) out.push({ type: "config", pattern: "env", detail: "environment keys: " + vars.join(", "), evidence: ".env.example" });
}

function extractFromConfig(text, out, path) {
  if (/python|pyproject|requirements/.test(path)) {
    const langs = [];
    if (/\[project\]|pypi|requires-python/.test(text)) langs.push("python (pyproject)");
    if (/requirements/.test(path)) langs.push("python (requirements)");
    if (langs.length) out.push({ type: "config", pattern: "language", detail: langs.join(", "), evidence: path });
  }
  if (/tsconfig/.test(path)) out.push({ type: "config", pattern: "language", detail: "typescript (tsconfig)", evidence: path });
}

/**
 * @param files [{path, text}] — bounded set of workspace files
 * @returns [{type, pattern, detail, evidence}] proposed conventions
 */
export function extractConventions(files) {
  const out = [];
  for (const f of files || []) {
    const path = String(f.path || "");
    const text = String(f.text || "");
    if (path === "package.json" || path.endsWith("/package.json")) extractFromPackageJson(text, out);
    else if (/^readme(\.md|\.txt|\.rst)?$/i.test(path.split("/").pop() || "")) extractFromReadme(text, out);
    else if (path === ".env.example" || path.endsWith("/.env.example")) extractFromEnvExample(text, out);
    else extractFromConfig(text, out, path);
  }
  return out;
}
```

</details>

**依据 3 · 源码核查**：[lib/knowledge.js:128-170](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/knowledge.js#L128-L170)

BM25实现。

<details>
<summary>查看原文（43行）</summary>

```text
export function kbSearchBM25(kb, query, { limit = 10, k1 = 1.5, b = 0.75 } = {}) {
  const k = kb && isValidKnowledge(kb) ? kb : emptyKnowledge();
  const q = tokenize(query);
  if (!k.entries.length || !q.length) return [];
  const docs = k.entries.map((e) => ({
    entry: e,
    title: tokenize(e.title),
    tags: tokenize((e.tags || []).join(" ")),
    content: tokenize(e.content),
  }));
  const N = docs.length;
  const len = (d) => d.title.length * 3 + d.tags.length * 2 + d.content.length;
  const avgdl = docs.reduce((a, d) => a + len(d), 0) / N || 1;
  const df = new Map();
  for (const d of docs) {
    const seen = new Set();
    for (const t of [...d.title, ...d.tags, ...d.content]) {
      if (!seen.has(t)) { seen.add(t); df.set(t, (df.get(t) ?? 0) + 1); }
    }
  }
  const idf = (t) => Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
  const freq = (toks, t) => { let n = 0; for (const x of toks) if (x === t) n++; return n; };
  const scored = docs.map((d) => {
    const dl = len(d);
    let score = 0;
    for (const t of q) {
      const f = freq(d.title, t) * 3 + freq(d.tags, t) * 2 + freq(d.content, t);
      if (f > 0) score += idf(t) * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * dl) / avgdl)));
    }
    return { entry: d.entry, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => ({ ...x.entry, score: Math.round(x.score * 1000) / 1000 }));
}
// ---- v0.5: embeddings (optional provider; pure cosine scoring) ----

/** Cosine similarity between two vectors. Pure. */
export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
```

</details>

**依据 4 · 源码核查**：[lib/memory.js:166-174](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L166-L174)

Jaccard。

```text
export function similarity(a, b) {
  const tok = (s) => new Set(String(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
  const A = tok(a), B = tok(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区注入与写入接口有没有可靠隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

load/save按调用session cwd解析存储，是正确方向，但memCtx、lastContextRefresh和focusQuery全在一次apply闭包共享，context只注册一份。boot用ctx.workspace.path，后续任一工作区save/focus可改同一text；没有每请求/session cwd选择器，不能保证多工作区会话拿到自己记忆。30秒节流是直接return且无尾随timer，刚写后被节流可一直旧内容直到后续刷新调用，不是保证30秒后更新。focus分支也不受maxMemoryChars截断。

memory_update通用路径按对象属性直接向下走，没有own-property或__proto__/constructor/prototype禁用。普通对象的__proto__可引到Object.prototype，随后写属性是静态可达的原型污染条件；这在save前就发生，非只局限JSON字段，本轮未运行反例/宿主。路径还可改revision/结构必填字段，浅isValidMemory不足防后续渲染/保存异常。Host fs限制文件位置不消除此内存对象边界。

存储用ctx.fs但本插件调用未显式传sandboxPolicy，具体授权取决固定Host实现，不能仅凭SECURITY的声明证明全部读写受正确session策略约束。普通工具可记录/导入高信任提示内容而无本模块独立人员审批来源，文件可读不等内容可信。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:87-134](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L87-L134)

共享注入/节流。

<details>
<summary>查看原文（48行）</summary>

```text
  /** Mutable context object — dsh-system-prompt renders its .text live per request. */
  const memCtx = { name: "memory:content", order: 500, text: STATIC_GUIDANCE };
  let lastContextRefresh = 0;
  /** v0.9: optional focus topic — when set, only relevant memory fragments are injected. */
  let focusQuery = config.focus || "";

  let fsFailures = 0;
  async function loadJsonFor(rel, cwd, signal) {
    try {
      const target = await ctx.fs.resolve(rel, { cwd, ...(signal ? { signal } : {}) });
      const info = await ctx.fs.stat(target, signal).catch(() => undefined);
      if (!info || info.type !== "file") return { doc: null, target };
      const text = await ctx.fs.readText(target, signal);
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      return { doc: parsed, target };
    } catch (err) {
      fsFailures++;
      if (fsFailures >= 3 && !memCtx.text.includes("⚠️")) {
        memCtx.text += "\n\n⚠️ The memory plugin is hitting filesystem errors (" + fsFailures + "x). Check workspace permissions and the .dsh-memory-setup/ state.";
      }
      throw err;
    }
  }

  /** Refresh the injected context text with the current memory (throttled). */
  async function refreshMemoryContext(cwd) {
    if (!cwd) return;
    const now = Date.now();
    if (now - lastContextRefresh < 30000) return;
    lastContextRefresh = now;
    try {
      const { doc } = await loadJsonFor(memoryRel("memory.json"), cwd);
      const migrated = isValidMemory(doc) ? migrateMemory(doc) : emptyMemory();
      let body;
      if (focusQuery) {
        const rel = selectRelevant(migrated, focusQuery);
        const lines = [];
        for (const c of rel.conventions) lines.push("- [convention] " + c.detail);
        for (const l of rel.lessons) lines.push("- [lesson] " + l.error + " -> " + l.fix + (l.health === "failing" ? " (⚠️ fix not working)" : ""));
        body = lines.join("\n") + "\n(focused on: " + focusQuery + " — run memory_status for the full memory)";
      } else {
        body = renderMemory(migrated, config.maxMemoryChars);
      }
      memCtx.text = STATIC_GUIDANCE + (body ? "\n\nCurrent personal memory:\n" + body : "");
    } catch { /* keep static guidance */ }
  }

```

</details>

**依据 2 · 源码核查**：[lib/index.js:193-200](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L193-L200)

单份context注册。

```text
  if (config.injectOnBoot) {
    ctx.effect(() => {
      const dispose = ctx.systemPrompt.context(memCtx);
      const bootCwd = ctx.workspace?.path;
      if (bootCwd) refreshMemoryContext(bootCwd).catch(() => {});
      return dispose;
    });
  }
```

**依据 3 · 源码核查**：[lib/index.js:285-294](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L285-L294)

模型参数直传路径。

<details>
<summary>查看原文（10行）</summary>

```text
      },
      render: (_a, v) => [{ type: "text", text: "Updated.\n" + v.markdown }],
    },
    execute: wrap(async (args, exec) => {
      const { doc, target } = await loadDoc(exec);
      let value;
      try { value = JSON.parse(args.value); } catch { value = args.value; }
      const next = updateEntry(doc, args.path, value, args.note, undefined);
      await saveDoc(exec, target, next);
      return { doc: next };
```

</details>

**依据 4 · 源码核查**：[lib/memory.js:32-34](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L32-L34)

浅验证。

```text
export function isValidMemory(doc) {
  return !!doc && (doc.version === MEMORY_VERSION || doc.schemaVersion === 2) && typeof doc.preferences === "object" && Array.isArray(doc.projectConventions) && Array.isArray(doc.workflows) && Array.isArray(doc.lessons);
}
```

**依据 5 · 源码核查**：[lib/memory.js:70-84](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L70-L84)

原型路径。

<details>
<summary>查看原文（15行）</summary>

```text
export function updateEntry(doc, path, value, note, ts) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const parts = String(path).split(".").filter(Boolean);
  if (!parts.length) throw new Error("path required");
  let target = d;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof target[parts[i]] !== "object" || target[parts[i]] === null) target[parts[i]] = {};
    target = target[parts[i]];
  }
  target[parts[parts.length - 1]] = value;
  d.updatedAt = ts ?? new Date().toISOString();
  d.changelog.push(ch(ts, "update", path, note || "updated"));
  return d;
}

```

</details>

**依据 6 · 源码核查**：[lib/index.js:858-884](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L858-L884)

共享focus。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "memory_focus",
    description: "设置记忆聚焦主题：注入的上下文只包含与该主题相关的记忆片段（空 = 恢复全量）。",
    parameters: {
      input: {
        type: "object",
        additionalProperties: false,
        properties: {
          topic: { type: "string", required: true, description: "聚焦主题（空字符串恢复全量）" },
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          focus: { type: "string" },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.focus ? "Focus set: " + v.focus : "Focus cleared - full memory injected." }],
    },
    execute: async (args, exec) => {
      focusQuery = String(args.topic || "").trim();
      refreshMemoryContext(cwdOf(exec)).catch(() => {});
      return { focus: focusQuery };
    },
```

</details>

#### 缺口

- 外部Host context隔离和fs授权具体实现不在当前插件证明中。
  **影响**：不能推跨工作区保密或物理写授权已完整。
  **进一步探讨**：核固定Host context/text按session的消费与fs策略；用假会话/对象路径对照，不读实际用户记忆。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检索、证据与自学习主张哪些成立？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

知识库冷启动有直接缺口。index只import isValidKnowledge，loadKB在缺失/无效knowledge.json时调用未导入/未定义的emptyKnowledge，静态会ReferenceError；知识添加/检索/快照/统计等依赖此分支，不能把纯knowledge模块测试当工具初始化通过。有已有效KB时不触发此特定缺失分支。

无embedding时按字段权重BM25，Unicode字母数字连续串分词，中文整句不做语义切词。配置endpoint后query与条目title/content前2000字/tags发到该地址，带可选Bearer key，20秒timeout，失败回退BM25。URL未强制HTTPS，向量仅检数组/长度没有有限数值/模型版本绑定；条目相似标题更新内容却保留旧embedding，可能语义索引陈旧。README/SECURITY“nothing leaves/no network”与这条可选路径不一致。

lesson evidence可null，不是“无证据不得入库”。去重只按error相似，重复增加hits且不替换已存fix，重复失败可把无效旧fix升成长期规范。save先updateLessonHealth标failing，随后promoteLessons只看hits/无expiresAt，不排failing，故“反复错即学会”不成立。tier仅写字段，renderMemory/selectRelevant都没过滤cold；TTL参数cutoff计算后void，实际只删显式expiresAt，无日期就不会90天自动过期。历史静默不等已解决，health resolved是时间启发式。

sensitiveKeys只定义及import redactDoc，memory_export直接exportMarkdown、bundle直接原doc/KB，未调用redactDoc；备份/注入也不脱敏。导出“full”Markdown实际render默认6000字符，bundle只有快照索引不含快照文件。SHA与changelog同可写文件自存且保存会重算/截日志，能检查不一致但不是防篡改证明或独立审计链。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:26-30](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L26-L30)

缺emptyKnowledge导入。

```text
} from "./memory.js";
import { kbSearchBM25 } from "./knowledge.js";
import { extractConventions } from "./scanner.js";
import { isValidKnowledge } from "./knowledge.js";
import { registerKnowledgeTools } from "./kb-tools.js";
```

**依据 2 · 源码核查**：[lib/index.js:173-181](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L173-L181)

冷启动缺定义。

```text
  async function loadKB(exec) {
    const { doc, target } = await loadJsonFor(kbRel("knowledge.json"), cwdOf(exec), exec.signal);
    return { kb: isValidKnowledge(doc) ? doc : emptyKnowledge(), target };
  }
  async function saveKB(exec, target, kb) {
    await ctx.fs.writeText(target, JSON.stringify(kb, null, 2) + "\n", undefined, exec.signal);
    return kb;
  }

```

**依据 3 · 源码核查**：[lib/kb-tools.js:6-27](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/kb-tools.js#L6-L27)

外发/20秒。

<details>
<summary>查看原文（22行）</summary>

```text

/** Fetch an embedding from an OpenAI-compatible endpoint. Runtime-only. */
async function embed(text, config) {
  const res = await fetch(config.embeddingEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.embeddingKey ? { Authorization: "Bearer " + config.embeddingKey } : {}),
    },
    body: JSON.stringify({ input: text, model: config.embeddingModel || "text-embedding-3-small" }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("embed HTTP " + res.status);
  const j = await res.json();
  const vec = j?.data?.[0]?.embedding ?? j?.embeddings?.[0] ?? null;
  if (!Array.isArray(vec)) throw new Error("unexpected embedding response");
  return vec;
}

function embedTextOf(entry) {
  return (entry.title || "") + "\n" + (entry.content || "").slice(0, 2000) + "\n" + (entry.tags || []).join(", ");
}
```

</details>

**依据 4 · 源码核查**：[lib/kb-tools.js:94-114](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/kb-tools.js#L94-L114)

向量/BM25回退。

<details>
<summary>查看原文（21行）</summary>

```text
    },
    execute: async (args, exec) => {
      const { kb, target } = await storage.loadKB(exec);
      const limit = Math.max(1, Math.min(20, args.limit || 5));
      let results = null;
      if (config.embeddingEndpoint) {
        try {
          const queryVec = await embed(args.query, config);
          results = embeddingSearch(kb, queryVec, { limit });
          if (!results.length && kb.entries.some((e) => e.embedding)) {
            // query embedded but nothing above 0 — fall through to BM25
          }
        } catch { results = null; }
      }
      if (results === null || !results.length) {
        results = kbSearchBM25(kb, args.query, { limit });
      }
      if (results.length) {
        const next = kbHit(kb, results[0].id);
        await storage.saveKB(exec, target, next);
      }
```

</details>

**依据 5 · 源码核查**：[lib/knowledge.js:29-42](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/knowledge.js#L29-L42)

合并不清embedding。

<details>
<summary>查看原文（14行）</summary>

```text
  const similar = k.entries
    .map((e) => ({ entry: e, sim: similarity(e.title, title) }))
    .filter((x) => x.sim >= 0.7)
    .sort((a, b) => b.sim - a.sim);
  if (similar.length) {
    const target = k.entries.find((e) => e.id === similar[0].entry.id);
    target.content = content;
    for (const t of tags) if (!target.tags.includes(t)) target.tags.push(t);
    target.updatedAt = ts ?? new Date().toISOString();
    k.updatedAt = ts ?? new Date().toISOString();
    return { kb: k, entry: target, deduped: true };
  }
  const entry = {
    id: nextId(k, "k"),
```

</details>

**依据 6 · 源码核查**：[lib/memory.js:105-122](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L105-L122)

证据可空。

<details>
<summary>查看原文（18行）</summary>

```text
export function addLesson(doc, lesson, ts) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const error = String(lesson?.error ?? "").trim();
  const fix = String(lesson?.fix ?? "").trim();
  if (!error || !fix) throw new Error("error and fix are required");
  const entry = {
    id: "l" + (d.lessons.length + 1),
    error,
    fix,
    evidence: String(lesson?.evidence ?? "").trim() || null,
    createdAt: ts ?? new Date().toISOString(),
  };
  d.lessons.push(entry);
  d.updatedAt = ts ?? new Date().toISOString();
  d.changelog.push(ch(ts, "lesson", "lessons", "added: " + error.slice(0, 60)));
  return { doc: d, entry };
}

```

</details>

**依据 7 · 源码核查**：[lib/memory.js:176-185](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L176-L185)

TTL未用。

<details>
<summary>查看原文（10行）</summary>

```text
export function pruneMemory(doc, { now = Date.now(), changelogCap = 100, lessonTtlDays = 90 } = {}) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const cutoff = now - lessonTtlDays * 86400000;
  void cutoff;
  d.lessons = d.lessons.filter((l) => !l.expiresAt || new Date(l.expiresAt).getTime() > now);
  d.projectConventions = d.projectConventions.filter((c) => !c.expiresAt || new Date(c.expiresAt).getTime() > now);
  d.workflows = d.workflows.filter((w) => !w.expiresAt || new Date(w.expiresAt).getTime() > now);
  if (d.changelog.length > changelogCap) d.changelog = d.changelog.slice(d.changelog.length - changelogCap);
  return d;
}
```

</details>

**依据 8 · 源码核查**：[lib/memory.js:295-318](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L295-L318)

hits晋升不核health。

<details>
<summary>查看原文（24行）</summary>

```text
export function promoteLessons(doc, { hitThreshold = 3, ts } = {}) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const promoted = [];
  for (const l of d.lessons) {
    const hits = l.hits ?? 1;
    if (hits < hitThreshold || l.expiresAt) continue;
    const detail = "[learned] " + l.fix + " (from: " + l.error.slice(0, 60) + ")";
    if (d.projectConventions.some((c) => c.detail === detail)) continue;
    d.projectConventions.push({
      id: "c" + (d.projectConventions.length + 1),
      type: "learned",
      pattern: "lesson",
      detail,
      evidence: l.evidence || "lesson #" + l.id + " x" + hits,
      createdAt: ts ?? new Date().toISOString(),
    });
    promoted.push({ lesson: l, detail });
  }
  if (promoted.length) {
    d.updatedAt = ts ?? new Date().toISOString();
    d.changelog.push({ ts: ts ?? new Date().toISOString(), action: "promote", path: "projectConventions", summary: promoted.length + " lesson(s) promoted" });
  }
  return { doc: d, promoted };
}
```

</details>

**依据 9 · 源码核查**：[lib/index.js:142-169](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L142-L169)

health/晋升/写hash。

<details>
<summary>查看原文（28行）</summary>

```text
  const hashOf = (doc) => {
    const copy = { ...doc };
    delete copy.integrity;
    return createHash("sha256").update(JSON.stringify(copy)).digest("hex");
  };
  async function saveDoc(exec, target, doc) {
    const healthy = updateLessonHealth(doc);
    const promotedDoc = config.autoPromote ? promoteLessons(healthy, { hitThreshold: config.promoteHitThreshold }).doc : healthy;
    const pruned = pruneMemory(promotedDoc, { changelogCap: config.changelogCap, lessonTtlDays: config.lessonTtlDays });
    // v1.1 optimistic locking: fail if the file moved under us (another session/agent)
    const current = await loadJsonFor(memoryRel("memory.json"), cwdOf(exec), exec.signal);
    const curRev = current.doc && isValidMemory(current.doc) ? (current.doc.revision || 0) : 0;
    const myRev = pruned.revision || 0;
    if (current.doc && isValidMemory(current.doc) && curRev !== myRev) {
      throw new Error("memory conflict: file modified elsewhere (revision " + curRev + " != " + myRev + "). Run memory_status and re-apply.");
    }
    pruned.revision = myRev + 1;
    pruned.integrity = hashOf(pruned);
    if (config.backupOnSave) {
      const bak = await ctx.fs.resolve(memoryRel("memory.json.bak"), { cwd: cwdOf(exec), signal: exec.signal });
      const info = await ctx.fs.stat(target, exec.signal).catch(() => undefined);
      if (info && info.type === "file") {
        const text = await ctx.fs.readText(target, exec.signal);
        await ctx.fs.writeText(bak, text, undefined, exec.signal).catch(() => {});
      }
    }
    await ctx.fs.writeText(target, JSON.stringify(pruned, null, 2) + "\n", undefined, exec.signal);
    refreshMemoryContext(cwdOf(exec)).catch(() => {});
```

</details>

**依据 10 · 源码核查**：[lib/index.js:430-438](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L430-L438)

导出无redact。

```text
    execute: async (args, exec) => {
      const cwd = cwdOf(exec);
      const { doc } = await loadDoc(exec);
      const md = exportMarkdown(doc, { includeChangelog: args.includeChangelog !== false });
      const rel = memoryRel("memory-export.md");
      const target = await ctx.fs.resolve(rel, { cwd, signal: exec.signal });
      await ctx.fs.writeText(target, md + "\n", undefined, exec.signal);
      return { path: rel, preview: md.slice(0, 400) };
    },
```

**依据 11 · 源码核查**：[lib/memory.js:124-147](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L124-L147)

渲染无tier。

<details>
<summary>查看原文（24行）</summary>

```text
export function renderMemory(doc, maxChars = 6000) {
  const d = doc && isValidMemory(doc) ? doc : emptyMemory();
  const out = [];
  const has = (x) => String(x ?? "").trim().length > 0;
  if (Object.values(d.preferences).some(has)) {
    out.push("## Preferences");
    for (const [k, v] of Object.entries(d.preferences)) if (has(v)) out.push("- " + k + ": " + v);
  }
  if (d.projectConventions.length) {
    out.push("## Project conventions");
    for (const c of d.projectConventions) out.push("- " + (c.type === "user" ? "[user] " : "[auto] ") + c.detail + (c.evidence && c.evidence !== "user-setup" ? " (" + c.evidence + ")" : ""));
  }
  if (d.workflows.length) {
    out.push("## Workflows");
    for (const w of d.workflows) out.push("- " + w.name + (w.steps.length ? ": " + w.steps.join(" -> ") : ""));
  }
  if (d.lessons.length) {
    out.push("## Lessons (do not repeat these mistakes)");
    for (const l of d.lessons) out.push("- ERROR: " + l.error + " -> FIX: " + l.fix + (l.evidence ? " (evidence: " + l.evidence + ")" : "") + (l.health === "failing" ? " ⚠️FIX-NOT-WORKING" : l.health === "resolved" ? " ✅resolved" : ""));
  }
  let text = out.join("\n");
  if (text.length > maxChars) text = text.slice(0, maxChars) + "\n... (truncated)";
  return text;
}
```

</details>

**依据 12 · 源码核查**：[lib/memory.js:542-552](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L542-L552)

bundle仅索引。

<details>
<summary>查看原文（11行）</summary>

```text
/** Bundle memory + knowledge + snapshots index into one object. Pure. */
export function buildBundle(doc, kb, snapshots, extra = {}) {
  return { bundleVersion: 1, exportedAt: new Date().toISOString(), memory: migrateMemory(doc), knowledge: kb, snapshots: snapshots || [], ...extra };
}

/** Validate a bundle payload. Pure. */
export function parseBundle(text) {
  let p;
  try { p = JSON.parse(text); } catch { throw new Error("invalid JSON"); }
  if (!p || p.bundleVersion !== 1 || !isValidMemory(migrateMemory(p.memory))) throw new Error("not a valid bundle");
  return p;
```

</details>

**依据 13 · 源码核查**：[lib/memory.js:201-230](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L201-L230)

重复error只加hits不换fix，evidence可空

<details>
<summary>查看原文（30行）</summary>

```text
export function applyReview(doc, review, ts) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const error = String(review?.error ?? "").trim();
  const fix = String(review?.fix ?? "").trim();
  if (!error || !fix) throw new Error("error and fix are required");
  const similar = findSimilarLessons(d, error);
  if (similar.length) {
    const target = d.lessons.find((l) => l.id === similar[0].lesson.id);
    target.hits = (target.hits ?? 1) + 1;
    if (review.evidence && !target.evidence) target.evidence = String(review.evidence).trim();
    target.lastSeenAt = ts ?? new Date().toISOString();
    d.updatedAt = ts ?? new Date().toISOString();
    d.changelog.push({ ts: ts ?? new Date().toISOString(), action: "lesson-hit", path: "lessons", summary: error.slice(0, 60) });
    return { doc: d, entry: target, deduped: true, hits: target.hits };
  }
  const entry = {
    id: "l" + (d.lessons.length + 1),
    error,
    fix,
    evidence: String(review?.evidence ?? "").trim() || null,
    rootCause: String(review?.rootCause ?? "").trim() || null,
    hits: 1,
    createdAt: ts ?? new Date().toISOString(),
  };
  if (review.expiresAt) entry.expiresAt = review.expiresAt;
  d.lessons.push(entry);
  d.updatedAt = ts ?? new Date().toISOString();
  d.changelog.push({ ts: ts ?? new Date().toISOString(), action: "lesson", path: "lessons", summary: "added: " + error.slice(0, 60) });
  return { doc: d, entry, deduped: false, hits: 1 };
}
```

</details>

**依据 14 · 源码核查**：[lib/memory.js:260-274](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L260-L274)

exportMarkdown实际render默认限制

<details>
<summary>查看原文（15行）</summary>

```text
/** Full markdown export (including changelog) for review/backup. Pure. */
export function exportMarkdown(doc, { includeChangelog = true } = {}) {
  const d = doc && isValidMemory(doc) ? doc : emptyMemory();
  const out = [];
  out.push("# Personal memory export");
  out.push("");
  out.push("Generated: " + new Date().toISOString());
  out.push("");
  out.push(renderMemory(d));
  if (includeChangelog && d.changelog.length) {
    out.push("");
    out.push("## Changelog");
    for (const c of d.changelog) out.push("- " + (c.ts || "?") + " [" + c.action + "] " + c.path + ": " + c.summary);
  }
  return out.join("\n");
```

</details>

**依据 15 · 源码核查**：[lib/memory.js:431-449](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L431-L449)

health时间/hits启发式

<details>
<summary>查看原文（19行）</summary>

```text
export function updateLessonHealth(doc, { now = Date.now(), ineffectiveWindowDays = 7, resolvedAfterDays = 30 } = {}) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const nowIso = new Date(now).toISOString();
  for (const l of d.lessons) {
    const hits = l.hits ?? 1;
    const last = l.lastSeenAt || l.createdAt || null;
    if (hits >= 3 && last) {
      const days = (now - new Date(last).getTime()) / 86400000;
      l.health = days <= ineffectiveWindowDays ? "failing" : (days > resolvedAfterDays ? "resolved" : "active");
    } else if (hits >= 3) {
      l.health = "failing";
    } else if (last && (now - new Date(last).getTime()) / 86400000 > resolvedAfterDays) {
      l.health = "resolved";
    } else {
      l.health = l.health || "active";
    }
    void nowIso;
  }
  return d;
```

</details>

**依据 16 · 源码核查**：[lib/memory.js:461-486](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L461-L486)

focus选择未过滤tier，tier仅字段

<details>
<summary>查看原文（26行）</summary>

```text
/** Select the most relevant conventions/lessons for a focus query. Pure. */
export function selectRelevant(doc, query, { limit = 5 } = {}) {
  const d = doc && isValidMemory(doc) ? doc : emptyMemory();
  if (!String(query || "").trim()) return { conventions: [], lessons: [], score: 0 };
  const conv = (d.projectConventions || []).map((c) => ({ item: c, score: relevance(query, c.detail) }));
  const lessons = (d.lessons || []).map((l) => ({ item: l, score: relevance(query, l.error + " " + l.fix) }));
  return {
    conventions: conv.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.item),
    lessons: lessons.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.item),
    score: 1,
  };
}
// ---- v1.0: tiers, redaction, audit ----

/** Set the tier (hot/warm/cold) of an entry. Pure. */
export function setTier(doc, kind, id, tier) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  if (!["hot", "warm", "cold"].includes(tier)) throw new Error("tier must be hot|warm|cold");
  const list = kind === "lesson" ? d.lessons : kind === "workflow" ? d.workflows : kind === "convention" ? d.projectConventions : null;
  if (!list) throw new Error("kind must be lesson|workflow|convention");
  const e = list.find((x) => x.id === id);
  if (!e) throw new Error("entry not found: " + id);
  e.tier = tier;
  d.updatedAt = new Date().toISOString();
  d.changelog.push({ ts: d.updatedAt, action: "tier", path: kind + ":" + id, summary: tier });
  return d;
```

</details>

**依据 17 · 源码核查**：[lib/knowledge.js:168-188](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/knowledge.js#L168-L188)

向量cosine无finite/模型绑定校验

<details>
<summary>查看原文（21行）</summary>

```text
export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || !a.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Cosine-ranked retrieval over entries that carry a stored `embedding`.
 * Entries without an embedding get score 0. Pure.
 */
export function embeddingSearch(kb, queryVec, { limit = 10 } = {}) {
  const k = kb && isValidKnowledge(kb) ? kb : emptyKnowledge();
  if (!Array.isArray(queryVec) || !queryVec.length) return [];
  return k.entries
    .map((e) => ({ entry: e, score: cosineSimilarity(e.embedding, queryVec) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => ({ ...x.entry, score: Math.round(x.score * 10000) / 10000 }));
```

</details>

**依据 18 · 源码核查**：[lib/index.js:1017-1026](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L1017-L1026)

原对象doc/KB构bundle无脱敏调用

<details>
<summary>查看原文（10行）</summary>

```text
    execute: async (args, exec) => {
      const cwd = cwdOf(exec);
      const { doc } = await loadDoc(exec);
      const { kb } = await loadKB(exec);
      const idx = await loadJsonFor(memoryRel("snapshots.json"), cwd, exec.signal);
      const bundle = buildBundle(doc, kb, Array.isArray(idx.doc) ? idx.doc : []);
      const rel = args.path || memoryRel("memory-bundle.json");
      const target = await ctx.fs.resolve(rel, { cwd, signal: exec.signal });
      await ctx.fs.writeText(target, JSON.stringify(bundle, null, 2) + "\n", undefined, exec.signal);
      return { path: rel };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 并发、快照与恢复是否保证不丢数据？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

revision检查是分离read→compare→backup→write，不是文件系统原子CAS/锁；两个会话都读同revision并同时比较成功仍能各写revision+1覆盖。KB无revision检查，search命中还写hits，读取式检索也参与丢更新风险。Host writeText是否原子不由插件证明，跨memory/KB/index更无事务。

snapshot payload包含doc/KB，但保留N只裁snapshots.json列表，不删除旧snapshot文件，因此不是物理存储上限。restore把历史doc的旧revision交saveDoc，当前revision已增长时触发conflict，正常回滚反可能被乐观检查拒；import/merge也需按其revision语义核，不能绕过冲突就声称安全。完整bundle导出只给snapshots索引，迁移后索引文件可能不存在；import_all先memory再KB再index，失败可部分恢复而无回滚。args.id拼快照相对路径未按索引/ID格式严格检查，物理越界仍取决Host fs。

backup写失败被吞，JSON parse失败当null，loadDoc可回空初始状态；后续保存有覆盖损坏原件风险。diff只对偏好与集合ID增删比较，同ID内容更改不报，不能作为完整语义变更审计。作者纯函数测试覆盖正常记录/显式过期/相似合并，package test不含knowledge与smoke-import，未证明Host工具初始化、并发、真实恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:142-181](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L142-L181)

分离检查/备份失败吞/KB写。

<details>
<summary>查看原文（40行）</summary>

```text
  const hashOf = (doc) => {
    const copy = { ...doc };
    delete copy.integrity;
    return createHash("sha256").update(JSON.stringify(copy)).digest("hex");
  };
  async function saveDoc(exec, target, doc) {
    const healthy = updateLessonHealth(doc);
    const promotedDoc = config.autoPromote ? promoteLessons(healthy, { hitThreshold: config.promoteHitThreshold }).doc : healthy;
    const pruned = pruneMemory(promotedDoc, { changelogCap: config.changelogCap, lessonTtlDays: config.lessonTtlDays });
    // v1.1 optimistic locking: fail if the file moved under us (another session/agent)
    const current = await loadJsonFor(memoryRel("memory.json"), cwdOf(exec), exec.signal);
    const curRev = current.doc && isValidMemory(current.doc) ? (current.doc.revision || 0) : 0;
    const myRev = pruned.revision || 0;
    if (current.doc && isValidMemory(current.doc) && curRev !== myRev) {
      throw new Error("memory conflict: file modified elsewhere (revision " + curRev + " != " + myRev + "). Run memory_status and re-apply.");
    }
    pruned.revision = myRev + 1;
    pruned.integrity = hashOf(pruned);
    if (config.backupOnSave) {
      const bak = await ctx.fs.resolve(memoryRel("memory.json.bak"), { cwd: cwdOf(exec), signal: exec.signal });
      const info = await ctx.fs.stat(target, exec.signal).catch(() => undefined);
      if (info && info.type === "file") {
        const text = await ctx.fs.readText(target, exec.signal);
        await ctx.fs.writeText(bak, text, undefined, exec.signal).catch(() => {});
      }
    }
    await ctx.fs.writeText(target, JSON.stringify(pruned, null, 2) + "\n", undefined, exec.signal);
    refreshMemoryContext(cwdOf(exec)).catch(() => {});
    return pruned;
  }

  async function loadKB(exec) {
    const { doc, target } = await loadJsonFor(kbRel("knowledge.json"), cwdOf(exec), exec.signal);
    return { kb: isValidKnowledge(doc) ? doc : emptyKnowledge(), target };
  }
  async function saveKB(exec, target, kb) {
    await ctx.fs.writeText(target, JSON.stringify(kb, null, 2) + "\n", undefined, exec.signal);
    return kb;
  }

```

</details>

**依据 2 · 源码核查**：[lib/index.js:537-552](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L537-L552)

快照索引裁剪。

<details>
<summary>查看原文（16行）</summary>

```text
      },
      render: (_a, v) => [{ type: "text", text: "snapshot " + v.id + " (kept " + v.kept + ")" }],
    },
    execute: async (args, exec) => {
      const cwd = cwdOf(exec);
      const { doc } = await loadDoc(exec);
      const { kb } = await loadKB(exec);
      const id = snapshotId();
      const snapTarget = await ctx.fs.resolve(memoryRel("snapshots/" + id + ".json"), { cwd, signal: exec.signal });
      const payload = { id, ts: new Date().toISOString(), note: args.note || "", doc, kb };
      await ctx.fs.writeText(snapTarget, JSON.stringify(payload, null, 2) + "\n", undefined, exec.signal);
      const idxTarget = await ctx.fs.resolve(memoryRel("snapshots.json"), { cwd, signal: exec.signal });
      const idx = await loadJsonFor(memoryRel("snapshots.json"), cwd, exec.signal);
      const list = pruneSnapshots([...(Array.isArray(idx.doc) ? idx.doc : []), { id, ts: payload.ts, file: "snapshots/" + id + ".json", note: args.note || "" }], config.snapshotKeep);
      await ctx.fs.writeText(idxTarget, JSON.stringify(list, null, 2) + "\n", undefined, exec.signal);
      return { id, kept: list.length };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:606-620](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L606-L620)

历史revision恢复。

<details>
<summary>查看原文（15行）</summary>

```text
    },
    execute: async (args, exec) => {
      const cwd = cwdOf(exec);
      const snap = await loadJsonFor(memoryRel("snapshots/" + args.id + ".json"), cwd, exec.signal);
      const payload = snap.doc || null;
      const doc = payload && isValidMemory(payload.doc) ? payload.doc : null;
      if (!doc) return { restored: false, summary: memorySummary(emptyMemory()) };
      const cur = await loadDoc(exec);
      const restored = await saveDoc(exec, cur.target, doc);
      if (payload && isValidKnowledge(payload.kb)) {
        const kbCur = await loadKB(exec);
        await saveKB(exec, kbCur.target, payload.kb);
      }
      return { restored: true, summary: memorySummary(restored) };
    },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1055-1068](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L1055-L1068)

非事务导入。

<details>
<summary>查看原文（14行）</summary>

```text
      const { doc: raw } = await loadJsonFor(args.path, cwd, exec.signal);
      if (!raw) return { ok: false };
      const bundle = parseBundle(JSON.stringify(raw));
      const memTarget = (await loadDoc(exec)).target;
      await saveDoc(exec, memTarget, migrateMemory(bundle.memory));
      if (bundle.knowledge && isValidKnowledge(bundle.knowledge)) {
        const kbCur = await loadKB(exec);
        await saveKB(exec, kbCur.target, bundle.knowledge);
      }
      if (Array.isArray(bundle.snapshots)) {
        const idxTarget = await ctx.fs.resolve(memoryRel("snapshots.json"), { cwd, signal: exec.signal });
        await ctx.fs.writeText(idxTarget, JSON.stringify(bundle.snapshots, null, 2) + "\n", undefined, exec.signal);
      }
      return { ok: true };
```

</details>

**依据 5 · 源码核查**：[lib/memory.js:233-252](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L233-L252)

diff只看ID集合。

<details>
<summary>查看原文（20行）</summary>

```text
export function diffMemory(prev, cur) {
  const p = prev && isValidMemory(prev) ? prev : emptyMemory();
  const c = cur && isValidMemory(cur) ? cur : emptyMemory();
  const changes = [];
  for (const key of ["language", "codeStyle", "tools", "notes"]) {
    const a = p.preferences?.[key];
    const b = c.preferences?.[key];
    if (a !== b) changes.push({ path: "preferences." + key, from: a || "(none)", to: b || "(none)" });
  }
  const summaryOf = (x) => (x.error || x.detail || x.name || x.id || "entry") + (x.evidence ? " (" + x.evidence + ")" : "");
  for (const section of ["projectConventions", "workflows", "lessons"]) {
    const pa = p[section] || [];
    const ca = c[section] || [];
    const ids = new Set(ca.map((x) => x.id));
    for (const x of pa) if (!ids.has(x.id)) changes.push({ path: section, from: summaryOf(x), to: "(removed)" });
    const pids = new Set(pa.map((x) => x.id));
    for (const x of ca) if (!pids.has(x.id)) changes.push({ path: section, from: "(added)", to: summaryOf(x) });
  }
  return changes;
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:95-107](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L95-L107)

parse失败null。

<details>
<summary>查看原文（13行）</summary>

```text
    try {
      const target = await ctx.fs.resolve(rel, { cwd, ...(signal ? { signal } : {}) });
      const info = await ctx.fs.stat(target, signal).catch(() => undefined);
      if (!info || info.type !== "file") return { doc: null, target };
      const text = await ctx.fs.readText(target, signal);
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      return { doc: parsed, target };
    } catch (err) {
      fsFailures++;
      if (fsFailures >= 3 && !memCtx.text.includes("⚠️")) {
        memCtx.text += "\n\n⚠️ The memory plugin is hitting filesystem errors (" + fsFailures + "x). Check workspace permissions and the .dsh-memory-setup/ state.";
      }
```

</details>

**依据 7 · 源码核查**：[package.json:1-17](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/package.json#L1-L17)

实际test入口。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-memory-setup",
  "version": "1.2.0",
  "description": "Solve the AI goldfish brain: a personal memory layer for DeepSeek Harness — preferences, project conventions, workflows, and error lessons, stored locally as auditable, evidence-backed Markdown/JSON. 解决 AI 金鱼脑：偏好、项目约定、工作方式与纠错教训的本地可审计记忆层。",
  "type": "module",
  "main": "lib/index.js",
  "files": ["lib", "cordis.patch.yml", "README.md", "SECURITY.md"],
  "license": "MIT",
  "scripts": { "test": "node test/memory.test.mjs && node test/scanner.test.mjs" },
  "publishConfig": { "access": "public" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  }
}
```

</details>

**依据 8 · 源码核查**：[test/memory.test.mjs:84-101](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/test/memory.test.mjs#L84-L101)

纯函数范围。

<details>
<summary>查看原文（18行）</summary>

```text
});

test("applyReview dedupes similar lessons and bumps hits", () => {
  const first = applyReview(emptyMemory(), { error: "npm install fails due to lockfile mismatch", fix: "delete lockfile and reinstall" });
  assert.equal(first.deduped, false);
  assert.equal(first.hits, 1);
  const again = applyReview(first.doc, { error: "npm install failed due to lockfile mismatch again", fix: "same fix", evidence: "run 5" });
  assert.equal(again.deduped, true);
  assert.equal(again.hits, 2);
  assert.equal(again.doc.lessons.length, 1);
  assert.equal(again.entry.evidence, "run 5");
});

test("exportMarkdown includes changelog and renders", () => {
  const { doc } = applySetup(emptyMemory(), { language: "Go" });
  const md = exportMarkdown(doc);
  assert.ok(md.includes("# Personal memory export"));
  assert.ok(md.includes("## Changelog"));
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与失败恢复成本有哪些？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/fs/systemPrompt/workspace和相关peer | 工具/文件/注入 | 无独立Node engines声明，宿主版本需核 |
| 明确单工作区/可写目录与备份 | JSON记忆 | 多会话共享context与并发不可当隔离 |
| 可选可信embedding endpoint/model/key | 语义检索 | 实际会外发文本，非纯本地 |
| 人员审记忆/证据/晋升 | 控制高信任提示 | hits/时间不等正确性 |

#### 使用流程

| 步骤 | 行为 | 判据 |
| --- | --- | --- |
| 首次 | 固定版本审配置/路径与冷KB初始化 | 先修缺定义/原型路径 |
| 录入 | 预览规范、证据与个人偏好 | 不录密钥/外来命令作可信事实 |
| 检索/注入 | 核工作区/当前版本/外发范围 | 不信cold/脱敏标签已生效 |
| 恢复 | 离线保全原件，逐文件核revision/KB/index | 不把索引当完整备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地JSON/Host依赖，选配向量服务 | 审高信任记忆、修初始化/路径、备份 | 部署工时/模型费用未知 |
| 持续使用 | 注入token、BM25扫描、向量请求、快照累计 | 核错误fix/晋升/冲突与敏感内容 | 无净省时/误召回对照 |
| 失败恢复 | 重建KB索引/备份、重复请求与可能丢写 | 保全损坏原件、核并发/旧revision、逐文件恢复 | 未保证事务/物理快照上限，恢复耗时未知 |

#### 效果

| 目标 | 已实现增量 | 限制 |
| --- | --- | --- |
| 少重述 | 偏好/教训文件与注入 | 共享/陈旧/错误内容风险 |
| 复用知识 | BM25/选配向量 | 冷KB缺定义、向量陈旧 |
| 可读审阅 | JSON/hash/changelog/快照 | 不等防篡改/完整恢复 |


#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:32-70](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L32-L70)

依赖/默认配置。

<details>
<summary>查看原文（39行）</summary>

```text
const name = "dsh-memory-setup";
const inject = ["tools", "fs", "systemPrompt", "workspace"];

const Config = z.object({
  /** Memory directory, relative to the session workspace. */
  memoryDir: z.string().default(".dsh-memory-setup"),
  /** Add the memory guidance section to the system prompt at boot. */
  injectOnBoot: z.boolean().default(true),
  /** Cap for rendered memory text. */
  maxMemoryChars: z.number().default(6000),
  /** Lessons expire after this many days (pruned on save). 0 disables expiry. */
  lessonTtlDays: z.number().default(90),
  /** Keep at most this many changelog entries. */
  changelogCap: z.number().default(100),
  /** Write memory.json.bak before every save (crash/tamper recovery). */
  backupOnSave: z.boolean().default(true),
  /** Append a self-review reminder to the injected guidance. */
  reviewReminder: z.boolean().default(true),
  /** Optional OpenAI-compatible embeddings endpoint (v0.5). Empty = BM25 only. */
  embeddingEndpoint: z.string().default(""),
  /** Bearer key for the embeddings endpoint. */
  embeddingKey: z.string().default(""),
  /** Embeddings model name. */
  embeddingModel: z.string().default("text-embedding-3-small"),
  /** Keep at most this many memory snapshots. */
  snapshotKeep: z.number().default(10),
  /** Append a troubleshoot reminder to the injected guidance. */
  troubleshootReminder: z.boolean().default(true),
  /** Auto-promote recurring lessons (hits >= threshold) into conventions on save. */
  autoPromote: z.boolean().default(true),
  /** Hit threshold for lesson promotion. */
  promoteHitThreshold: z.number().default(3),
  /** v0.9: focus topic for relevance-based memory injection (empty = full memory). */
  focus: z.string().default(""),
  /** v1.0: preference keys whose values are redacted in exports (privacy). */
  sensitiveKeys: z.array(z.string()).default([]),
});

function apply(ctx, config) {
```

</details>

**依据 2 · 源码核查**：[lib/kb-tools.js:194-217](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/kb-tools.js#L194-L217)

逐条向量请求。

<details>
<summary>查看原文（24行）</summary>

```text
          note: { type: "string" },
        },
      },
      render: (_a, v) => [{ type: "text", text: "embedded " + v.embedded + ", failed " + v.failed + (v.note ? ". " + v.note : "") }],
    },
    execute: async (args, exec) => {
      if (!config.embeddingEndpoint) {
        return { embedded: 0, failed: 0, note: "set embeddingEndpoint in plugin config to enable embeddings" };
      }
      const { kb, target } = await storage.loadKB(exec);
      let embedded = 0, failed = 0;
      for (const entry of kb.entries) {
        if (Array.isArray(entry.embedding)) continue;
        try {
          entry.embedding = await embed(embedTextOf(entry), config);
          embedded++;
        } catch { failed++; }
      }
      if (embedded) {
        kb.updatedAt = new Date().toISOString();
        await storage.saveKB(exec, target, kb);
      }
      return { embedded, failed, note: config.embeddingEndpoint };
    },
```

</details>

**依据 3 · 源码核查**：[lib/memory.js:576-584](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L576-L584)

仅裁列表。

```text

/** Keep the latest N snapshots (by ts), oldest first. Pure. */
export function pruneSnapshots(snapshots, keep = 10) {
  const list = [...(snapshots || [])].sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
  return list.length > keep ? list.slice(list.length - keep) : list;
}



```

#### 缺口

- 固定任务相对手工规范的减少重复解释、误用记忆、净token/工时效果未知。
  **影响**：不能从条目数/hits说明收益。
  **进一步探讨**：单工作区假数据对照正确召回、错误fix沿用、恢复正确性与人员审阅时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用结论与可证伪的后续探索是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前不推荐直接启为真实高信任记忆层。文件化与工具组合方向有用，但缺失emptyKnowledge、通用路径原型链、共享注入、非原子CAS与恢复冲突、无效fix晋升/脱敏未接线使README多项关键保证不成立。先修核心正确性，再单工作区无秘密数据评估；不因功能数量提高信任。

从共享context/分离revision/晋升与隐私路径推导“工作区版本化记忆仓库”。按真实root/session选择不可变快照，typed patch禁止原型/元数据路径，以锁内revision检查+原子替换提交，跨文件manifest绑定版本；lesson把命中次数与独立fix效果分开，未经确认不升约定，导出/注入同一敏感字段策略且explicit外发。

未实现。对照手工Markdown与当前版、原型，假fs双写交错、两cwd/节流、空KB、旧revision恢复、损坏JSON、cold/secret字段、反复失败fix和断点恢复矩阵；验收无跨项目注入/静默丢写，恢复与manifest一致，错误fix不因重复失败升级。反例是锁串行降低吞吐、严格证据误拒合法偏好、人工确认抵消省时；计正确召回/错注入、丢写、恢复时间和审阅负担。若仍旧工作区内容或未脱敏外发、锁竞争写丢、错误fix升级，假设被反证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:87-169](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/index.js#L87-L169)

隔离/事务推导。

<details>
<summary>查看原文（83行）</summary>

```text
  /** Mutable context object — dsh-system-prompt renders its .text live per request. */
  const memCtx = { name: "memory:content", order: 500, text: STATIC_GUIDANCE };
  let lastContextRefresh = 0;
  /** v0.9: optional focus topic — when set, only relevant memory fragments are injected. */
  let focusQuery = config.focus || "";

  let fsFailures = 0;
  async function loadJsonFor(rel, cwd, signal) {
    try {
      const target = await ctx.fs.resolve(rel, { cwd, ...(signal ? { signal } : {}) });
      const info = await ctx.fs.stat(target, signal).catch(() => undefined);
      if (!info || info.type !== "file") return { doc: null, target };
      const text = await ctx.fs.readText(target, signal);
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      return { doc: parsed, target };
    } catch (err) {
      fsFailures++;
      if (fsFailures >= 3 && !memCtx.text.includes("⚠️")) {
        memCtx.text += "\n\n⚠️ The memory plugin is hitting filesystem errors (" + fsFailures + "x). Check workspace permissions and the .dsh-memory-setup/ state.";
      }
      throw err;
    }
  }

  /** Refresh the injected context text with the current memory (throttled). */
  async function refreshMemoryContext(cwd) {
    if (!cwd) return;
    const now = Date.now();
    if (now - lastContextRefresh < 30000) return;
    lastContextRefresh = now;
    try {
      const { doc } = await loadJsonFor(memoryRel("memory.json"), cwd);
      const migrated = isValidMemory(doc) ? migrateMemory(doc) : emptyMemory();
      let body;
      if (focusQuery) {
        const rel = selectRelevant(migrated, focusQuery);
        const lines = [];
        for (const c of rel.conventions) lines.push("- [convention] " + c.detail);
        for (const l of rel.lessons) lines.push("- [lesson] " + l.error + " -> " + l.fix + (l.health === "failing" ? " (⚠️ fix not working)" : ""));
        body = lines.join("\n") + "\n(focused on: " + focusQuery + " — run memory_status for the full memory)";
      } else {
        body = renderMemory(migrated, config.maxMemoryChars);
      }
      memCtx.text = STATIC_GUIDANCE + (body ? "\n\nCurrent personal memory:\n" + body : "");
    } catch { /* keep static guidance */ }
  }

  async function loadDoc(exec) {
    const { doc, target } = await loadJsonFor(memoryRel("memory.json"), cwdOf(exec), exec.signal);
    if (!doc) return { doc: emptyMemory(), target };
    const migrated = migrateMemory(doc);
    return { doc: isValidMemory(migrated) ? migrated : emptyMemory(), target };
  }

  const hashOf = (doc) => {
    const copy = { ...doc };
    delete copy.integrity;
    return createHash("sha256").update(JSON.stringify(copy)).digest("hex");
  };
  async function saveDoc(exec, target, doc) {
    const healthy = updateLessonHealth(doc);
    const promotedDoc = config.autoPromote ? promoteLessons(healthy, { hitThreshold: config.promoteHitThreshold }).doc : healthy;
    const pruned = pruneMemory(promotedDoc, { changelogCap: config.changelogCap, lessonTtlDays: config.lessonTtlDays });
    // v1.1 optimistic locking: fail if the file moved under us (another session/agent)
    const current = await loadJsonFor(memoryRel("memory.json"), cwdOf(exec), exec.signal);
    const curRev = current.doc && isValidMemory(current.doc) ? (current.doc.revision || 0) : 0;
    const myRev = pruned.revision || 0;
    if (current.doc && isValidMemory(current.doc) && curRev !== myRev) {
      throw new Error("memory conflict: file modified elsewhere (revision " + curRev + " != " + myRev + "). Run memory_status and re-apply.");
    }
    pruned.revision = myRev + 1;
    pruned.integrity = hashOf(pruned);
    if (config.backupOnSave) {
      const bak = await ctx.fs.resolve(memoryRel("memory.json.bak"), { cwd: cwdOf(exec), signal: exec.signal });
      const info = await ctx.fs.stat(target, exec.signal).catch(() => undefined);
      if (info && info.type === "file") {
        const text = await ctx.fs.readText(target, exec.signal);
        await ctx.fs.writeText(bak, text, undefined, exec.signal).catch(() => {});
      }
    }
    await ctx.fs.writeText(target, JSON.stringify(pruned, null, 2) + "\n", undefined, exec.signal);
    refreshMemoryContext(cwdOf(exec)).catch(() => {});
```

</details>

**依据 2 · 源码核查**：[lib/memory.js:70-84](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L70-L84)

typed patch推导。

<details>
<summary>查看原文（15行）</summary>

```text
export function updateEntry(doc, path, value, note, ts) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const parts = String(path).split(".").filter(Boolean);
  if (!parts.length) throw new Error("path required");
  let target = d;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof target[parts[i]] !== "object" || target[parts[i]] === null) target[parts[i]] = {};
    target = target[parts[i]];
  }
  target[parts[parts.length - 1]] = value;
  d.updatedAt = ts ?? new Date().toISOString();
  d.changelog.push(ch(ts, "update", path, note || "updated"));
  return d;
}

```

</details>

**依据 3 · 源码核查**：[lib/memory.js:295-318](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/memory.js#L295-L318)

效果证据晋升推导。

<details>
<summary>查看原文（24行）</summary>

```text
export function promoteLessons(doc, { hitThreshold = 3, ts } = {}) {
  const d = doc && isValidMemory(doc) ? structuredClone(doc) : emptyMemory();
  const promoted = [];
  for (const l of d.lessons) {
    const hits = l.hits ?? 1;
    if (hits < hitThreshold || l.expiresAt) continue;
    const detail = "[learned] " + l.fix + " (from: " + l.error.slice(0, 60) + ")";
    if (d.projectConventions.some((c) => c.detail === detail)) continue;
    d.projectConventions.push({
      id: "c" + (d.projectConventions.length + 1),
      type: "learned",
      pattern: "lesson",
      detail,
      evidence: l.evidence || "lesson #" + l.id + " x" + hits,
      createdAt: ts ?? new Date().toISOString(),
    });
    promoted.push({ lesson: l, detail });
  }
  if (promoted.length) {
    d.updatedAt = ts ?? new Date().toISOString();
    d.changelog.push({ ts: ts ?? new Date().toISOString(), action: "promote", path: "projectConventions", summary: promoted.length + " lesson(s) promoted" });
  }
  return { doc: d, promoted };
}
```

</details>

**依据 4 · 源码核查**：[lib/kb-tools.js:6-27](https://github.com/863683348/dsh-memory-setup/blob/989e8a5e7ac32b0864f5a7c2167ca5e242d55f43/lib/kb-tools.js#L6-L27)

显式外发推导。

<details>
<summary>查看原文（22行）</summary>

```text

/** Fetch an embedding from an OpenAI-compatible endpoint. Runtime-only. */
async function embed(text, config) {
  const res = await fetch(config.embeddingEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.embeddingKey ? { Authorization: "Bearer " + config.embeddingKey } : {}),
    },
    body: JSON.stringify({ input: text, model: config.embeddingModel || "text-embedding-3-small" }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("embed HTTP " + res.status);
  const j = await res.json();
  const vec = j?.data?.[0]?.embedding ?? j?.embeddings?.[0] ?? null;
  if (!Array.isArray(vec)) throw new Error("unexpected embedding response");
  return vec;
}

function embedTextOf(entry) {
  return (entry.title || "") + "\n" + (entry.content || "").slice(0, 2000) + "\n" + (entry.tags || []).join(", ");
}
```

</details>

#### 缺口

- 按工作区版本化事务/确认晋升/统一脱敏原型未实现。
  **影响**：不是当前隔离、恢复或隐私保证。
  **进一步探讨**：先假fs/合成条目矩阵，对照正确性和额外人工成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
