# dsh-feed

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[bc59214](https://github.com/863683348/dsh-feed/tree/bc592147401c7697749390eb6a2a6cddd42af747)

<!-- BEGIN META -->
[![npm 30d 92](https://img.shields.io/static/v1?label=npm+30d&message=92&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feed) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feed)
<!-- END META -->

> **实现功能**：聚合 GitHub dsh-plugin topic 与 npm keyword 的本地 JSON 索引，供工具、CLI、MCP 查询。

> **核心亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](#research-q03)。

> **风险与缺陷**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](#research-q01)、[Q02](#research-q02)。

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
  - [Q01 · 开放 JSON 索引覆盖多少生态？](#detail-section-11)
  - [Q02 · 同步失败和文件写入是否可审计/受限？](#detail-section-12)
  - [Q03 · 三种消费面与采用成本是什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复的成本如何随使用方式变化？](#detail-section-14)
  - [Q05 · 怎样证伪身份映射和显式覆盖状态能改善候选索引可信度？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：查询 DSH 插件候选并向其他界面复用机器可读索引。

各消费者单独抓 GitHub/npm 并维护索引。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 | 边界 |
| --- | --- | --- |
| 同步 | GitHub/npm 首数页 | 非全量 |
| 检索 | 词面/2-gram | 非语义 |
| MCP/CLI | 共享本地 JSON | MCP 实验性 |

**流程与依赖**

GitHub search、npm registry、可选 GITHUB_TOKEN、DSH tools/systemPrompt 或 CLI/MCP 客户端。

feed_sync→本地 JSON→feed_search/feed_stats 或 CLI/MCP 消费。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装Node/插件，GitHub与npm请求和本地JSON磁盘；价格未知 | 配工作目录和可选token，核索引范围/身份，工时未知 | 默认GitHub最多200/npm100，不能当完整目录 |
| 持续使用 | 显式sync重建网络/排序/覆写；search/stats读本地JSON | 核新鲜度、重复和候选价值，工时未知 | 每cwd可能独立索引，无跨会话共享缓存；配额消耗未知 |
| 失败恢复 | 网络重试、备份索引恢复与可能越界写入清理资源，金额未知 | 区分GitHub异常、后页非OK部分结果与npm吞空；核symlink，工时未知 | 普通覆写非事务备份；恢复完整性需对照来源，耗时未知 |

开放机器可读候选目录，非全量且非安全/质量认证。

> **思考**：默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](#research-q03)。

模型工具、CLI 和实验性 MCP 共用可 diff JSON 索引，详见[Q03](#research-q03)。

两 API 有界分页、name-key Map 合并、字面搜索、词法路径检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认覆盖有限、同插件跨源可能双计，网络部分失败仍更新时间；路径约束仅词法检查，详见[Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离工作区试同步，审阅来源与错漏；search 只做候选检索，详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持开放索引；默认最多 200+100 候选、无跨源 repo/package 身份合并，部分失败不标记。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/index-store.js、lib/sync.js、lib/query.js、bin/dsh-feed.js、test/feed.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交；未实际同步外部 API 或运行目标 MCP。
- 下一步：对照全量源核覆盖/重复；模拟部分失败、symlink 与 MCP 客户端交互。

**分析版本**

- **仓库**：[863683348/dsh-feed](https://github.com/863683348/dsh-feed)
- **版本号**：0.1.0（[固定提交 bc59214](https://github.com/863683348/dsh-feed/tree/bc592147401c7697749390eb6a2a6cddd42af747)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以仓库/包关联身份与显式分页/失败状态减少双计和假新鲜，反证及代价见[Q05](#research-q05)；真实路径写入仍需独立约束。

对照全量源核覆盖/重复；模拟部分失败、symlink 与 MCP 客户端交互。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 537 | 441 | 70 | — |
| .md | source | 6 | 146 | — | — | 877 |
| .mjs | test | 1 | 61 | 54 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-feed/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-feed/issues?q=is%3Aissue+created%3A2026-09-22T07%3A45%3A00.459Z..2026-10-22T07%3A45%3A00.459Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-feed/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A45%3A00.459Z..2026-10-22T07%3A45%3A00.459Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**确认开放索引的真实覆盖、身份合并、同步失败与工作区写入边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 开放 JSON 索引覆盖多少生态？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

默认 GitHub topic 搜索取按 updated 降序的前两页、每页最多 100；npm keyword 搜索只取一页最多 100。合并时以小写 name 为唯一键，GitHub 的 owner/repo 与 npm package name 通常不同，虽有 repository URL 也未用于关联，容易双计同一插件。feed_search 仅对名称/description/topics 的英文词和中文 2-gram 做字面匹配。故“全生态”是开放索引的目标，不是已实现的完整覆盖或语义搜索。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:20-83](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js#L20-L83)

两页 GitHub、一页 npm 和 name 合并。

<details>
<summary>查看原文（64行）</summary>

```text
/** Fetch the dsh-plugin topic from the GitHub search API. */
export async function fetchGithubTopic({ token, pages = 2, perPage = 100, signal } = {}) {
  const headers = { "User-Agent": "dsh-feed", "Accept": "application/vnd.github+json" };
  if (token) headers.Authorization = "Bearer " + token;
  const items = [];
  for (let page = 1; page <= pages; page++) {
    const url = "https://api.github.com/search/repositories?q=topic:dsh-plugin&sort=updated&order=desc&per_page=" + perPage + "&page=" + page;
    const res = await fetch(url, { headers, signal });
    if (!res.ok) {
      if (page === 1) throw new Error("dsh-feed: GitHub search failed with " + res.status);
      break;
    }
    const body = await res.json();
    items.push(...(body.items ?? []));
    if ((body.items ?? []).length < perPage) break;
  }
  return items.map(normalizeGithubItem);
}

/** Fetch npm packages tagged with a dsh keyword. */
export async function fetchNpm({ keyword = "dsh-plugin", size = 100, signal } = {}) {
  const url = "https://registry.npmjs.org/-/v1/search?text=" + encodeURIComponent("keywords:" + keyword) + "&size=" + size;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("dsh-feed: npm search failed with " + res.status);
  const body = await res.json();
  return (body.objects ?? []).map((o) => {
    const p = o.package;
    return {
      name: p.name,
      url: p.links?.repository ?? "https://www.npmjs.com/package/" + p.name,
      description: p.description ?? "",
      stars: p.links?.repository ? 0 : 0,
      updatedAt: p.date ?? "",
      topics: (p.keywords ?? []).slice(0, 10),
      npmName: p.name,
    };
  });
}

/**
 * Run a full sync: GitHub topic + npm, merged by repo/npm identity.
 * @returns { updated, sources, plugins }
 */
export async function sync({ githubToken, githubPages = 2, npmKeyword = "dsh-plugin", signal } = {}) {
  const [gh, npm] = await Promise.all([
    fetchGithubTopic({ token: githubToken, pages: githubPages, signal }).catch((e) => {
      throw new Error("dsh-feed: github sync failed: " + e.message);
    }),
    fetchNpm({ keyword: npmKeyword, signal }).catch(() => []),
  ]);
  const byKey = new Map();
  for (const p of gh) byKey.set(p.name.toLowerCase(), { ...p, source: "github" });
  for (const p of npm) {
    const key = p.name.toLowerCase();
    const existing = byKey.get(key);
    if (existing) existing.npmName = p.npmName;
    else byKey.set(key, { ...p, source: "npm" });
  }
  return {
    updated: new Date().toISOString(),
    sources: { github: gh.length, npm: npm.length },
    count: byKey.size,
    plugins: [...byKey.values()].sort((a, b) => b.stars - a.stars),
  };
```

</details>

**依据 2 · 源码核查**：[lib/query.js:6-60](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/query.js#L6-L60)

字面分词/排序。

<details>
<summary>查看原文（55行）</summary>

```text
/** Tokenize a query (English words + Chinese 2-grams). */
export function tokenize(query) {
  const out = new Set();
  const lower = String(query).toLowerCase();
  for (const w of lower.split(/[^a-z0-9]+/)) {
    if (w.length >= 3) out.add(w);
  }
  const runs = lower.match(/[\u4e00-\u9fff]{2,}/g) ?? [];
  for (const run of runs) {
    for (let i = 0; i + 2 <= run.length; i++) out.add(run.slice(i, i + 2));
    if (run.length >= 3) out.add(run);
  }
  return [...out];
}

/** Score one plugin against query tokens. */
export function scorePlugin(plugin, terms) {
  let score = 0;
  const hits = [];
  const name = (plugin.name ?? "").toLowerCase();
  const text = ((plugin.description ?? "") + " " + (plugin.topics ?? []).join(" ")).toLowerCase();
  for (const t of terms) {
    if (name.includes(t)) {
      score += 3;
      hits.push(t);
    } else if (text.includes(t)) {
      score += 1;
      hits.push(t);
    }
  }
  return { score, hits: [...new Set(hits)].slice(0, 5) };
}

/** Search the index; returns ranked results. */
export function searchIndex(index, query, limit = 5) {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new Error('dsh-feed: "query" must be a non-empty string');
  }
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return (index.plugins ?? [])
    .map((plugin) => ({ plugin, ...scorePlugin(plugin, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.plugin.stars - a.plugin.stars || a.plugin.name.localeCompare(b.plugin.name))
    .slice(0, Math.min(Math.max(1, limit), 20))
    .map(({ plugin, score, hits }) => ({
      name: plugin.name,
      url: plugin.url,
      description: plugin.description ?? "",
      stars: plugin.stars ?? 0,
      topics: plugin.topics ?? [],
      npmName: plugin.npmName ?? null,
      score,
      hits,
    }));
```

</details>

**依据 3 · 作者声明**：[README.md:1-12](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/README.md#L1-L12)

开放索引定位。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-feed — 跨生态聚合底座（"聚合的聚合"）

不直接做 UI，做**开放数据层**：把 GitHub `dsh-plugin` topic 和 npm registry 归一化成一份开放 JSON 索引，交给任何 Agent / CLI / MCP / 未来 UI 消费。你的插件只做"同步 + 查询"——别人基于这份数据再建 UI。

## 为什么需要它

- 现有市场各自抓数据、各自维护，闭源且重复。`dsh-feed` 成为**数据源**：同步一次，全生态可查。
- 一个插件，三种消费面：
  - **模型工具**：`feed_sync` / `feed_search` / `feed_stats`
  - **CLI**：`dsh-feed sync|search|stats|mcp`
  - **MCP server**（实验性）：任何 MCP 客户端（Cursor、Claude Desktop…）都能查
- 索引是**开放 JSON 文件**（默认 `.dsh/dsh-feed.json`），明文、可 diff、可被任何工具读。
```

</details>

#### 缺口

- 未运行真实全生态同步
  **影响：**覆盖率与重复率未知
  **进一步探讨：**对 topic 全量和 npm 搜索结果抽样计算覆盖/重复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 同步失败和文件写入是否可审计/受限？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

npm 请求失败被 catch 成 []；GitHub仅后续页HTTP响应非OK时break并允许部分结果，仍生成updated=现在的新索引且无incomplete；第一页HTTP非OK、任意页fetch网络throw或JSON解析异常都会让GitHub分支reject，整个sync失败，不会正常生成新索引。npm分支则统一catch为空数组。若用户只看 updated/stale 可能误以为完整。indexTarget 拒绝绝对路径和词法 ..，但不检查 cwd 内 symlink/真实路径；writeIndex 递归建目录并 writeFileSync 覆盖目标，若 .dsh 或目标是符号链接，可能写出工作区边界。README 的“只写会话工作区内”需宿主文件权限或 realpath/no-follow 才能落实。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:25-35](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js#L25-L35)

GitHub 后续页失败中断。

<details>
<summary>查看原文（11行）</summary>

```text
  for (let page = 1; page <= pages; page++) {
    const url = "https://api.github.com/search/repositories?q=topic:dsh-plugin&sort=updated&order=desc&per_page=" + perPage + "&page=" + page;
    const res = await fetch(url, { headers, signal });
    if (!res.ok) {
      if (page === 1) throw new Error("dsh-feed: GitHub search failed with " + res.status);
      break;
    }
    const body = await res.json();
    items.push(...(body.items ?? []));
    if ((body.items ?? []).length < perPage) break;
  }
```

</details>

**依据 2 · 源码核查**：[lib/sync.js:63-83](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js#L63-L83)

npm 错误吞掉且更新时戳。

<details>
<summary>查看原文（21行）</summary>

```text
export async function sync({ githubToken, githubPages = 2, npmKeyword = "dsh-plugin", signal } = {}) {
  const [gh, npm] = await Promise.all([
    fetchGithubTopic({ token: githubToken, pages: githubPages, signal }).catch((e) => {
      throw new Error("dsh-feed: github sync failed: " + e.message);
    }),
    fetchNpm({ keyword: npmKeyword, signal }).catch(() => []),
  ]);
  const byKey = new Map();
  for (const p of gh) byKey.set(p.name.toLowerCase(), { ...p, source: "github" });
  for (const p of npm) {
    const key = p.name.toLowerCase();
    const existing = byKey.get(key);
    if (existing) existing.npmName = p.npmName;
    else byKey.set(key, { ...p, source: "npm" });
  }
  return {
    updated: new Date().toISOString(),
    sources: { github: gh.length, npm: npm.length },
    count: byKey.size,
    plugins: [...byKey.values()].sort((a, b) => b.stars - a.stars),
  };
```

</details>

**依据 3 · 源码核查**：[lib/index-store.js:9-16](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index-store.js#L9-L16)

仅词法路径检查。

```text
/** Resolve and validate the index path for a cwd. */
export function indexTarget(cwd, file) {
  if (typeof file !== "string" || file.length === 0) throw new Error("dsh-feed: invalid index file path");
  if (isAbsolute(file)) throw new Error("dsh-feed: index file must be relative to the workspace");
  const parts = file.split(/[\\/]+/);
  if (parts.some((p) => p === "..")) throw new Error("dsh-feed: index file must not traverse upwards");
  return join(resolve(cwd), ...parts);
}
```

**依据 4 · 源码核查**：[lib/index-store.js:28-34](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index-store.js#L28-L34)

直接写文件。

```text
/** Write the index, creating parent directories. */
export function writeIndex(cwd, file, index) {
  const target = indexTarget(cwd, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(index, null, 2) + "\n", "utf8");
  return target;
}
```

**依据 5 · 作者声明**：[README.md:59-66](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/README.md#L59-L66)

workspace 写入声明。

```text
## 设计

- `lib/sync.js` — 抓取 + 归一化（GitHub search API + npm search API，可注入 token）。
- `lib/query.js` — 纯查询逻辑（分词/评分/统计），零依赖可单测。
- `lib/index-store.js` — 索引文件读写（相对路径 + 防逃逸校验）。
- `bin/dsh-feed.js` — CLI + 极简 stdio MCP server（JSON-RPC 2.0）。
- **安全**：索引只写会话工作区内的 `.dsh/`；网络请求仅发生在 `feed_sync`（显式触发）。

```

#### 缺口

- 未造 symlink 或网络部分失败
  **影响：**实际宿主沙箱是否拦截/用户可见状态未知
  **进一步探讨：**隔离临时工作区测试 symlink、GitHub 第2页失败、npm 500

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 三种消费面与采用成本是什么？

**研究主题：**依赖、兼容与流程、采用判断

#### 完整回答

同一索引可由 DSH 模型工具、CLI 与实验性 stdio MCP 读取；工具 feed_sync 显式联网并写工作区 .dsh JSON，search/stats 只读本地文件。CLI/MCP 使用 GITHUB_TOKEN 提升额度。默认双源请求和频繁重建有网络/配额成本；每个会话 cwd 可能各写一份索引，不是跨会话统一缓存。适合作为透明候选列表，需保留来源、同步错误、身份映射，并对安装价值另做仓库审阅。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:45-70](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index.js#L45-L70)

工具写每会话 cwd。

<details>
<summary>查看原文（26行）</summary>

```text
function apply(ctx, config) {
  const cwdOf = (exec) => exec.agent?.session?.header?.cwd ?? process.cwd();

  ctx.tools.register(defineTool({
    name: "feed_sync",
    description: "Fetch the GitHub dsh-plugin topic and the npm registry into one normalized JSON index (default .dsh/dsh-feed.json in the session workspace). Call before feed_search when the index is missing or stale. Uses the network; may take a few seconds.",
    parameters: {},
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          updated: { type: "string", required: true },
          count: { type: "integer", required: true },
          sources: { additionalProperties: true, type: "object", required: true },
          path: { type: "string", required: true },
        },
      },
      render: (_args, value) => [{ type: "text", text: "feed index synced: " + value.count + " plugins (github " + value.sources.github + " / npm " + value.sources.npm + ") -> " + value.path }],
    },
    execute: async (_args, exec) => {
      const cwd = cwdOf(exec);
      const token = config.githubTokenEnv ? process.env[config.githubTokenEnv] : undefined;
      const index = await sync({ githubToken: token, signal: exec.signal });
      const path = writeIndex(cwd, config.file, index);
      return { updated: index.updated, count: index.count, sources: index.sources, path };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:75-179](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index.js#L75-L179)

搜索/统计本地索引。

<details>
<summary>查看原文（105行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "feed_search",
    description: "Search the aggregated dsh plugin index (GitHub dsh-plugin topic + npm) by natural language. Returns ranked plugins with stars, topics, and npm package names when known. Run feed_sync first if the index does not exist.",
    parameters: {
      query: { type: "string", required: true, description: "Natural-language query (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-20, default from config)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          stale: { type: "boolean", required: true },
          results: {
            type: "array",
            required: true,
            items: {
              type: "object",
              additionalProperties: false,
              required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                description: { type: "string", required: true },
                stars: { type: "integer", required: true },
                topics: { type: "array", required: true, items: { type: "string" } },
                npmName: { type: "string" },
                score: { type: "integer", required: true },
                hits: { type: "array", required: true, items: { type: "string" } },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = [value.count + " result" + (value.count === 1 ? "" : "s") + (value.stale ? " (index stale — run feed_sync)" : "")];
        for (const r of value.results) {
          lines.push("## " + r.name + " (score " + r.score + ", " + r.stars + " stars)");
          if (r.description) lines.push(r.description);
          if (r.npmName) lines.push("npm: " + r.npmName);
          if (r.topics.length) lines.push("topics: " + r.topics.slice(0, 8).join(", "));
          lines.push(r.url);
          lines.push("");
        }
        if (value.count === 0) lines.push("No matches — try feed_sync for a fresh index or different terms.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args, exec) => {
      const cwd = cwdOf(exec);
      const index = readIndex(cwd, config.file);
      if (!index) {
        throw new Error("feed index not found at " + config.file + " — run feed_sync first");
      }
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = searchIndex(index, String(args.query), limit);
      const age = indexAgeMs(cwd, config.file);
      return { count: results.length, stale: age !== null && age > 6 * 60 * 60 * 1000, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Feed search: " + String(args.query).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "feed_stats",
    description: "Statistics over the aggregated dsh plugin index: total plugins, sources, top topics, npm coverage, last update.",
    parameters: {},
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          sources: { additionalProperties: true, type: "object", required: true },
          updated: { type: "string" },
          npmCount: { type: "integer", required: true },
          topTopics: {
            type: "array",
            required: true,
            items: {
              type: "object",
              additionalProperties: false,
              required: true,
              properties: { topic: { type: "string", required: true }, count: { type: "integer", required: true } },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["feed index: " + value.count + " plugins" + (value.updated ? " (updated " + value.updated.slice(0, 10) + ")" : "")];
        lines.push("sources: " + JSON.stringify(value.sources));
        lines.push("npm packages: " + value.npmCount);
        lines.push("top topics: " + value.topTopics.slice(0, 10).map((t) => t.topic + "(" + t.count + ")").join(", "));
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (_args, exec) => {
      const cwd = cwdOf(exec);
      const index = readIndex(cwd, config.file);
      if (!index) {
        throw new Error("feed index not found at " + config.file + " — run feed_sync first");
      }
      return statsIndex(index);
    },
    presentCall: () => ({ card: "generic", title: "Feed index stats", kind: "other", rawInput: {} }),
```

</details>

**依据 3 · 源码核查**：[bin/dsh-feed.js:71-130](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/bin/dsh-feed.js#L71-L130)

stdio MCP 实现。

<details>
<summary>查看原文（60行）</summary>

```text
/** Minimal stdio MCP server: tools = feed_search, feed_stats, feed_sync. */
function cmdMcp() {
  const cwd = process.env.DSH_FEED_CWD ?? process.cwd();
  const file = process.env.DSH_FEED_FILE ?? FILE;
  const tools = [
    {
      name: "feed_search",
      description: "Search the aggregated dsh plugin index by natural language.",
      inputSchema: {
        type: "object",
        additionalProperties: true,
        properties: { query: { type: "string" }, limit: { type: "number" } },
        required: ["query"],
      },
    },
    { name: "feed_stats", description: "Statistics over the dsh plugin index.", inputSchema: { additionalProperties: true, type: "object" } },
    { name: "feed_sync", description: "Rebuild the index from GitHub + npm (network).", inputSchema: { additionalProperties: true, type: "object" } },
  ];
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", async (line) => {
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return;
    }
    let result = { jsonrpc: "2.0", id: msg.id ?? null };
    try {
      const method = msg.method ?? "";
      const params = msg.params ?? {};
      if (method === "initialize") {
        result.result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "dsh-feed", version: "0.1.0" } };
      } else if (method === "tools/list") {
        result.result = { tools };
      } else if (method === "tools/call") {
        const name = params.name;
        const args = params.arguments ?? {};
        if (name === "feed_search") {
          const index = readIndex(cwd, file);
          if (!index) throw new Error("index not found — call feed_sync first");
          result.result = { content: [{ type: "text", text: JSON.stringify(searchIndex(index, String(args.query ?? ""), Number(args.limit ?? 5))) }] };
        } else if (name === "feed_stats") {
          const index = readIndex(cwd, file);
          if (!index) throw new Error("index not found — call feed_sync first");
          result.result = { content: [{ type: "text", text: JSON.stringify(statsIndex(index)) }] };
        } else if (name === "feed_sync") {
          const index = await sync({ githubToken: process.env.GITHUB_TOKEN });
          const path = writeIndex(cwd, file, index);
          result.result = { content: [{ type: "text", text: JSON.stringify({ count: index.count, sources: index.sources, path }) }] };
        } else {
          throw new Error("unknown tool " + name);
        }
      } else {
        result.error = { code: -32601, message: "method not found: " + method };
      }
    } catch (e) {
      result.error = { code: -32603, message: String(e.message ?? e) };
    }
    process.stdout.write(JSON.stringify(result) + "\n");
  });
```

</details>

**依据 4 · 作者声明**：[README.md:21-43](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/README.md#L21-L43)

三个消费面。

<details>
<summary>查看原文（23行）</summary>

````text
## 用法

### 模型侧

| 工具 | 说明 |
| --- | --- |
| `feed_sync` | 拉取 GitHub topic + npm → 写索引（需网络） |
| `feed_search` | 自然语言查索引（英文词 + 中文 2-gram） |
| `feed_stats` | 索引统计：总数、来源、热门 topic、npm 覆盖 |

### CLI

```bash
dsh-feed sync                      # 同步（可选 GITHUB_TOKEN 提升限额）
dsh-feed search "移动端 远程"      # 查询
dsh-feed stats
dsh-feed mcp                       # 极简 stdio MCP server（实验性）
```

### MCP 配置示例（任意 MCP 客户端）

```json
{ "mcpServers": { "dsh-feed": { "command": "dsh-feed", "args": ["mcp"] } } }
````

</details>

#### 缺口

- 未在真实 MCP 客户端/DSH 宿主运行
  **影响：**兼容性和索引共享体验未知
  **进一步探讨：**隔离客户端调用初始化、工具列表、同步和查询

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复的成本如何随使用方式变化？

**研究主题：**效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装Node/插件，GitHub与npm请求和本地JSON磁盘；价格未知 | 配工作目录和可选token，核索引范围/身份，工时未知 | 默认GitHub最多200/npm100，不能当完整目录 |
| 持续使用 | 显式sync重建网络/排序/覆写；search/stats读本地JSON | 核新鲜度、重复和候选价值，工时未知 | 每cwd可能独立索引，无跨会话共享缓存；配额消耗未知 |
| 失败恢复 | 网络重试、备份索引恢复与可能越界写入清理资源，金额未知 | 区分GitHub异常、后页非OK部分结果与npm吞空；核symlink，工时未知 | 普通覆写非事务备份；恢复完整性需对照来源，耗时未知 |

核算对象是有明确来源覆盖和身份的候选列表，不是sync返回count就算完整。对既有离线索引而言，三消费面重用同一JSON可减少消费者各自取数，但只有指向同一目录才共享；频繁跨cwd重建可能重复网络与磁盘。实际账户配额、目录规模、安装/身份核对与故障清理工时未知，不由零付费API声明推零成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:20-83](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js#L20-L83)

双源请求与重建

<details>
<summary>查看原文（64行）</summary>

```text
/** Fetch the dsh-plugin topic from the GitHub search API. */
export async function fetchGithubTopic({ token, pages = 2, perPage = 100, signal } = {}) {
  const headers = { "User-Agent": "dsh-feed", "Accept": "application/vnd.github+json" };
  if (token) headers.Authorization = "Bearer " + token;
  const items = [];
  for (let page = 1; page <= pages; page++) {
    const url = "https://api.github.com/search/repositories?q=topic:dsh-plugin&sort=updated&order=desc&per_page=" + perPage + "&page=" + page;
    const res = await fetch(url, { headers, signal });
    if (!res.ok) {
      if (page === 1) throw new Error("dsh-feed: GitHub search failed with " + res.status);
      break;
    }
    const body = await res.json();
    items.push(...(body.items ?? []));
    if ((body.items ?? []).length < perPage) break;
  }
  return items.map(normalizeGithubItem);
}

/** Fetch npm packages tagged with a dsh keyword. */
export async function fetchNpm({ keyword = "dsh-plugin", size = 100, signal } = {}) {
  const url = "https://registry.npmjs.org/-/v1/search?text=" + encodeURIComponent("keywords:" + keyword) + "&size=" + size;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("dsh-feed: npm search failed with " + res.status);
  const body = await res.json();
  return (body.objects ?? []).map((o) => {
    const p = o.package;
    return {
      name: p.name,
      url: p.links?.repository ?? "https://www.npmjs.com/package/" + p.name,
      description: p.description ?? "",
      stars: p.links?.repository ? 0 : 0,
      updatedAt: p.date ?? "",
      topics: (p.keywords ?? []).slice(0, 10),
      npmName: p.name,
    };
  });
}

/**
 * Run a full sync: GitHub topic + npm, merged by repo/npm identity.
 * @returns { updated, sources, plugins }
 */
export async function sync({ githubToken, githubPages = 2, npmKeyword = "dsh-plugin", signal } = {}) {
  const [gh, npm] = await Promise.all([
    fetchGithubTopic({ token: githubToken, pages: githubPages, signal }).catch((e) => {
      throw new Error("dsh-feed: github sync failed: " + e.message);
    }),
    fetchNpm({ keyword: npmKeyword, signal }).catch(() => []),
  ]);
  const byKey = new Map();
  for (const p of gh) byKey.set(p.name.toLowerCase(), { ...p, source: "github" });
  for (const p of npm) {
    const key = p.name.toLowerCase();
    const existing = byKey.get(key);
    if (existing) existing.npmName = p.npmName;
    else byKey.set(key, { ...p, source: "npm" });
  }
  return {
    updated: new Date().toISOString(),
    sources: { github: gh.length, npm: npm.length },
    count: byKey.size,
    plugins: [...byKey.values()].sort((a, b) => b.stars - a.stars),
  };
```

</details>

**依据 2 · 源码核查**：[lib/index-store.js:9-34](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index-store.js#L9-L34)

读写与词法限制

<details>
<summary>查看原文（26行）</summary>

```text
/** Resolve and validate the index path for a cwd. */
export function indexTarget(cwd, file) {
  if (typeof file !== "string" || file.length === 0) throw new Error("dsh-feed: invalid index file path");
  if (isAbsolute(file)) throw new Error("dsh-feed: index file must be relative to the workspace");
  const parts = file.split(/[\\/]+/);
  if (parts.some((p) => p === "..")) throw new Error("dsh-feed: index file must not traverse upwards");
  return join(resolve(cwd), ...parts);
}

/** Read the index; returns null when missing. */
export function readIndex(cwd, file) {
  const target = indexTarget(cwd, file);
  try {
    return JSON.parse(readFileSync(target, "utf8"));
  } catch {
    return null;
  }
}

/** Write the index, creating parent directories. */
export function writeIndex(cwd, file, index) {
  const target = indexTarget(cwd, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(index, null, 2) + "\n", "utf8");
  return target;
}
```

</details>

**依据 3 · 源码核查**：[bin/dsh-feed.js:27-69](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/bin/dsh-feed.js#L27-L69)

CLI同步与本地查询

<details>
<summary>查看原文（43行）</summary>

```text

async function cmdSync(args) {
  const cwd = argValue(args, "--cwd", process.cwd());
  const file = argValue(args, "--file", FILE);
  const index = await sync({ githubToken: process.env.GITHUB_TOKEN });
  const path = writeIndex(cwd, file, index);
  console.log("synced " + index.count + " plugins (github " + index.sources.github + " / npm " + index.sources.npm + ") -> " + path);
}

function cmdSearch(args) {
  const cwd = argValue(args, "--cwd", process.cwd());
  const file = argValue(args, "--file", FILE);
  const query = args.find((a) => !a.startsWith("-"));
  if (!query) {
    console.error("usage: dsh-feed search <query> [--cwd DIR] [--limit N]");
    process.exit(2);
  }
  const index = readIndex(cwd, file);
  if (!index) {
    console.error("index not found at " + file + " — run: dsh-feed sync");
    process.exit(3);
  }
  const limit = Number(argValue(args, "--limit", "5"));
  for (const r of searchIndex(index, query, limit)) {
    console.log("# " + r.name + " (" + r.stars + " stars, score " + r.score + ")");
    if (r.description) console.log(r.description);
    if (r.npmName) console.log("npm: " + r.npmName);
    console.log(r.url);
    console.log("");
  }
}

function cmdStats(args) {
  const cwd = argValue(args, "--cwd", process.cwd());
  const file = argValue(args, "--file", FILE);
  const index = readIndex(cwd, file);
  if (!index) {
    console.error("index not found at " + file + " — run: dsh-feed sync");
    process.exit(3);
  }
  const s = statsIndex(index);
  console.log(JSON.stringify(s, null, 2));
}
```

</details>

#### 缺口

- 同步频率、跨cwd副本数和人工复核工时未知
  **影响：**无法计算净资源节约或总拥有成本
  **进一步探讨：**从同目录与多目录消费的请求量、字节及核对记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪身份映射和显式覆盖状态能改善候选索引可信度？

**研究主题：**新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定实现按name合并，未关联GitHub owner/repo与npm包；部分HTTP错误或npm异常可返回新时戳的不完整索引。相对当前name Map，设计假设是用规范化仓库标识加包归属映射保存关联，并记录各源页数、错误与完整状态，可降低双计和假新鲜。条件是仓库URL重命名/monorepo多包规则可核、来源元数据可信且缺失时不强制合并；代价是冲突表、额外查询与兼容旧索引。最小对照以人工标注固定双源样本和受控第一页失败、后页HTTP非OK、网络throw、npm失败为输入，比较原版与隔离原型的实体重复/误合并、缺源可见性、成功/失败状态、请求数和存储量。若误合并增加、部分结果仍被称完整或额外资源超预定预算，则假设被证伪。它不自动解决symlink写边界，真实路径/no-follow写入需另以授权临时目录反例核对；本轮未实现/执行对照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:20-83](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/sync.js#L20-L83)

错误分支和name身份合并

<details>
<summary>查看原文（64行）</summary>

```text
/** Fetch the dsh-plugin topic from the GitHub search API. */
export async function fetchGithubTopic({ token, pages = 2, perPage = 100, signal } = {}) {
  const headers = { "User-Agent": "dsh-feed", "Accept": "application/vnd.github+json" };
  if (token) headers.Authorization = "Bearer " + token;
  const items = [];
  for (let page = 1; page <= pages; page++) {
    const url = "https://api.github.com/search/repositories?q=topic:dsh-plugin&sort=updated&order=desc&per_page=" + perPage + "&page=" + page;
    const res = await fetch(url, { headers, signal });
    if (!res.ok) {
      if (page === 1) throw new Error("dsh-feed: GitHub search failed with " + res.status);
      break;
    }
    const body = await res.json();
    items.push(...(body.items ?? []));
    if ((body.items ?? []).length < perPage) break;
  }
  return items.map(normalizeGithubItem);
}

/** Fetch npm packages tagged with a dsh keyword. */
export async function fetchNpm({ keyword = "dsh-plugin", size = 100, signal } = {}) {
  const url = "https://registry.npmjs.org/-/v1/search?text=" + encodeURIComponent("keywords:" + keyword) + "&size=" + size;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("dsh-feed: npm search failed with " + res.status);
  const body = await res.json();
  return (body.objects ?? []).map((o) => {
    const p = o.package;
    return {
      name: p.name,
      url: p.links?.repository ?? "https://www.npmjs.com/package/" + p.name,
      description: p.description ?? "",
      stars: p.links?.repository ? 0 : 0,
      updatedAt: p.date ?? "",
      topics: (p.keywords ?? []).slice(0, 10),
      npmName: p.name,
    };
  });
}

/**
 * Run a full sync: GitHub topic + npm, merged by repo/npm identity.
 * @returns { updated, sources, plugins }
 */
export async function sync({ githubToken, githubPages = 2, npmKeyword = "dsh-plugin", signal } = {}) {
  const [gh, npm] = await Promise.all([
    fetchGithubTopic({ token: githubToken, pages: githubPages, signal }).catch((e) => {
      throw new Error("dsh-feed: github sync failed: " + e.message);
    }),
    fetchNpm({ keyword: npmKeyword, signal }).catch(() => []),
  ]);
  const byKey = new Map();
  for (const p of gh) byKey.set(p.name.toLowerCase(), { ...p, source: "github" });
  for (const p of npm) {
    const key = p.name.toLowerCase();
    const existing = byKey.get(key);
    if (existing) existing.npmName = p.npmName;
    else byKey.set(key, { ...p, source: "npm" });
  }
  return {
    updated: new Date().toISOString(),
    sources: { github: gh.length, npm: npm.length },
    count: byKey.size,
    plugins: [...byKey.values()].sort((a, b) => b.stars - a.stars),
  };
```

</details>

**依据 2 · 源码核查**：[lib/index-store.js:9-34](https://github.com/863683348/dsh-feed/blob/bc592147401c7697749390eb6a2a6cddd42af747/lib/index-store.js#L9-L34)

路径和覆盖写入

<details>
<summary>查看原文（26行）</summary>

```text
/** Resolve and validate the index path for a cwd. */
export function indexTarget(cwd, file) {
  if (typeof file !== "string" || file.length === 0) throw new Error("dsh-feed: invalid index file path");
  if (isAbsolute(file)) throw new Error("dsh-feed: index file must be relative to the workspace");
  const parts = file.split(/[\\/]+/);
  if (parts.some((p) => p === "..")) throw new Error("dsh-feed: index file must not traverse upwards");
  return join(resolve(cwd), ...parts);
}

/** Read the index; returns null when missing. */
export function readIndex(cwd, file) {
  const target = indexTarget(cwd, file);
  try {
    return JSON.parse(readFileSync(target, "utf8"));
  } catch {
    return null;
  }
}

/** Write the index, creating parent directories. */
export function writeIndex(cwd, file, index) {
  const target = indexTarget(cwd, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(index, null, 2) + "\n", "utf8");
  return target;
}
```

</details>

#### 缺口

- 映射规则与覆盖状态方案未实现，真实元数据歧义未知
  **影响：**不能据设计推断覆盖或去重已改善
  **进一步探讨：**从可核对实体真值和失败矩阵入手

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
