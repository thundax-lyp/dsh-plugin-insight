# dshfind

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[341e9c5](https://github.com/hikariming/dshfind/tree/341e9c599367ecb7094c8064d13746d099381296)

<!-- BEGIN META -->
[![GitHub ★ 359](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=359&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hikariming/dshfind)
<!-- END META -->

> **功能**：围绕 DeepSeek Harness 的插件发现、学习和社区网站。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将候选、课程和发现入口集中；不证明插件已验证可用。

> **主要限制**：[Q03](#research-q03) 截断或手工来源失败仍可能继续执行缺席标记。

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
  - [Q01 · 站点帮助谁发现什么，相对 GitHub 搜索有什么增量？](#detail-section-11)
  - [Q02 · 来源如何进入数据库与读者页面？](#detail-section-12)
  - [Q03 · 来源不完整时软删除是否安全？](#detail-section-13)
  - [Q04 · 排名和数据使用需承担哪些依赖、成本与边界？](#detail-section-14)
  - [Q05 · 能否让来源缺口不改变既有目录的可见性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户搜索插件并学习相关概念，维护者聚合与发布目录。

用户直接查询 GitHub topic、仓库与官方文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 来源同步 | 汇总 topic 和附加来源 | 不完整时可能误标缺席 |
| 筛选排序 | 发现候选 | 热度和评分非安装验收 |
| 静态数据 | 提供浏览入口 | 依赖重新生成和部署 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| GitHub API 和配额 | 发现需要 | topic 与仓库数据 | 同步可能不完整或失败 |
| 数据库 | 生成及详情需要 | 保存目录和历史 | 更新或详情受影响 |
| 生成与部署 | 展示更新需要 | 发布快照 | 页面可能过期 |
| 仓库源码与宿主 | 采用前需要 | 独立核对安装与权限 | 不可将目录当验收 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 同步 | 维护者抓取来源并核对完整性 | 截断或失败须检查缺席状态 |
| 生成 | 维护者生成目录并部署 | 数据库或部署失败保留旧结果 |
| 发现 | 用户搜索并看详情 | 核对来源与更新时间 |
| 采用 | 用户回固定源码审查 | 条件不明时不安装 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | API、数据库和构建 | 配置来源 | 配额和覆盖未知 |
| 持续 | API 配额、部署 | 核对不完整数据 | 运行费用未知 |
| 恢复 | 数据历史或备份 | 定位误隐藏 | 恢复时间未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 集中发现 | topic、生成和筛选源码 | 实际召回及覆盖 |
| 分数 | 站点的公式与 AI 输入 | 是否预测安装价值 |
| 差异保留 | upsert 与历史快照 | 不完整扫描误隐藏规模 |

> **思考**：[Q03](#research-q03) 截断或手工来源失败仍可能继续执行缺席标记。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将候选、课程和发现入口集中；不证明插件已验证可用。

[Q02](#research-q02) 对搜索上限递归分片并保留旧贡献者值；[Q03](#research-q03) 完成状态未约束缺席判断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 截断或手工来源失败仍可能继续执行缺席标记。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 将目录当候选入口，安装前回固定源码核权限和兼容；来源或安全条件不明就停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向检查固定版本源码与文档；未运行同步、站点或目标插件。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/sync-plugins-db.mjs、scripts/gen-plugins-real.mjs、scripts/lib/scoring.mjs、apps/web/src/pages/api/plugins-data.ts、apps/web/src/components/PluginsBrowser.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 topic 扫描、缺席标记、静态生成、列表加载及评分定义；未审全部论坛、认证及线上部署。
- 下一步：在隔离数据库注入截断和来源失败，核查缺席及生成；站点可访问性和安装另行验证。

**分析版本**

- **仓库**：[hikariming/dshfind](https://github.com/hikariming/dshfind)
- **版本号**：0.1.0（[固定提交 341e9c5](https://github.com/hikariming/dshfind/tree/341e9c599367ecb7094c8064d13746d099381296)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出按来源完成状态控制缺席判断，需权衡漏隐藏和过期留存。

在隔离数据库注入截断和来源失败，核查缺席及生成；站点可访问性和安装另行验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 68 | 15420 | 11722 | 2688 | — |
| .md | source | 16 | 3380 | — | — | 39251 |
| .tsx | source | 51 | 4775 | 4114 | 440 | — |
| .ts | source | 69 | 35144 | 33750 | 26870 | — |
| .mjs | test | 11 | 2082 | 1804 | 228 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/hikariming/dshfind/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 社区目录的来源、页面与不完整同步边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 站点帮助谁发现什么，相对 GitHub 搜索有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dshfind 是独立 DSH 学习、目录与社区网站，而非可加载的 DSH 插件。面向寻找组件和学习 DSH 的用户，它汇集 GitHub topic、分类、排序、详情、课程和讨论；相对直接搜索 GitHub 可减少跨入口浏览，但目录出现、分数或热度并不证明组件安全、安装成功或适合用户。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-30](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/README.md#L17-L30)

作者描述站点和技术形态。

<details>
<summary>查看原文（14行）</summary>

```text
## What is dshfind?

dshfind is a community site built around DeepSeek Harness (DSH):

- **📖 Learn DSH principles** — structured lessons from the basics up to a chapter-by-chapter deep dive of the Cordis paper: monads, coeffects, revertible effects, effect composition, spatiotemporal composability, and more.
- **🧩 Plugin marketplace** — a live index of DSH plugins, automatically aggregated from the GitHub topic [`dsh-plugin`](https://github.com/topics/dsh-plugin).
- **📚 Docs & community** — the official DSH docs translated into four languages, plus a forum and per-plugin discussions.

## Tech stack

- [Astro 7](https://astro.build) + Preact islands ([`apps/web`](./apps/web))
- Site i18n in four languages (English, 简体中文, 日本語 and 한국어 UI)
- MDX for lesson content ([`src/content/lessons`](./src/content/lessons))
- Tailwind CSS · deployed on Cloudflare Workers + D1
```

</details>

**依据 2 · 源码核查**：[apps/web/src/components/PluginsBrowser.tsx:172-198](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/apps/web/src/components/PluginsBrowser.tsx#L172-L198)

本地筛选与排序。

<details>
<summary>查看原文（27行）</summary>

```text
  const plugins = full?.plugins ?? initialPlugins;
  const i18nDescriptions = full?.i18nDescriptions ?? initialI18n;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = plugins.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!matchesGrade(p, grade)) return false;
      if (language !== "all" && p.language !== language) return false;
      return !q || haystack(p).includes(q);
    });
    // 优质项目在任何排序下都置顶，风险项目在任何排序下都沉底（组内再按所选键排）
    const pin = (a: PluginWithGrowth, b: PluginWithGrowth) =>
      Number(a.isRisky) - Number(b.isRisky) || Number(pinned(b)) - Number(pinned(a));
    if (sort === "name") return [...matched].sort((a, b) => pin(a, b) || a.name.localeCompare(b.name, "en"));
    if (sort === "updated") return [...matched].sort((a, b) => pin(a, b) || b.pushedAt.localeCompare(a.pushedAt));
    if (sort === "downloads") {
      // 没探到下载量的沉底，同数按 star 兜底（口径见 src/lib/downloads.ts）
      return [...matched].sort(
        (a, b) => pin(a, b) || (b.downloads?.total ?? -1) - (a.downloads?.total ?? -1) || b.stars - a.stars,
      );
    }
    if (sort === "score") {
      // 未评分沉底，同分按 star
      return [...matched].sort((a, b) => pin(a, b) || (b.score ?? -1) - (a.score ?? -1) || b.stars - a.stars);
    }
    return matched; // 快照已按 featured DESC, stars DESC 排好
```

</details>

**依据 3 · 源码核查**：[package.json:1-8](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/package.json#L1-L8)

私有站点工程。

```text
{
  "name": "dshfind",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @dshfind/web run dev",
    "build": "pnpm --filter @dshfind/web run build",
    "lint": "eslint",
```

#### 缺口

- 无用户对照和完整性测量
  **影响**：不能证明发现效率或推荐效果
  **进一步探讨**：对比直接搜索的相关率、漏项和核查时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源如何进入数据库与读者页面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

同步脚本按 GitHub dsh-plugin 公共 topic 和创建时间分片，页面上限附近递归分裂，随后按 full_name 去重，补手工和 npm 发现来源；已抓取行 upsert 并记录快照。生成脚本只读取 is_present 且非 off-topic 的行形成静态插件数据，网页先用首屏数据，空闲时请求全量静态 JSON，再在客户端过滤排序；失败显式设置 loadFailed。不同来源、实际发布和运行状态未实测，静态候选不能证明插件身份。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync-plugins-db.mjs:159-175](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L159-L175)

分页读取及错误返回。

<details>
<summary>查看原文（17行）</summary>

```text
async function searchPage(q, page) {
  const res = await gh(
    `/search/repositories?q=${q}&per_page=100&page=${page}`,
  );
  if (!res.ok) throw new Error(`search API ${res.status}: ${await res.text()}`);
  return res.json();
}

/** 单个查询全量翻页；调用方需保证该查询的结果数 < 1000（search API 硬上限）。 */
async function fetchAllPages(q) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const body = await searchPage(q, page);
    all.push(...body.items);
    if (body.items.length < 100) break;
  }
  return all;
```

</details>

**依据 2 · 源码核查**：[scripts/sync-plugins-db.mjs:187-212](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L187-L212)

按时间递归发现。

<details>
<summary>查看原文（26行）</summary>

```text
async function fetchRepos() {
  const all = [];
  // 点名轮次：逐仓库直接抓，不碰 search API。点名却抓不到就是错，不静默跳过。
  if (ONLY.length) {
    for (const full of ONLY) {
      const res = await gh(`/repos/${full}`);
      if (!res.ok) throw new Error(`--only ${full} 抓取失败：${res.status} ${await res.text()}`);
      all.push(await res.json());
    }
    return all;
  }
  // GitHub search 的 created: 接受 ISO 8601 时间戳，精度到秒
  const stamp = (d) => `${d.toISOString().slice(0, 19)}Z`;
  async function walk(from, to) {
    const q = `topic:${TOPIC}+is:public+created:${stamp(from)}..${stamp(to)}`;
    const first = await searchPage(q, 1);
    if (first.total_count < 900) {
      all.push(...first.items);
      if (first.total_count > first.items.length) {
        for (let page = 2; page <= 10; page++) {
          const body = await searchPage(q, page);
          all.push(...body.items);
          if (body.items.length < 100) break;
        }
      }
      return;
```

</details>

**依据 3 · 源码核查**：[scripts/sync-plugins-db.mjs:220-240](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L220-L240)

去重和手工补充。

<details>
<summary>查看原文（21行）</summary>

```text
    // 对齐到秒，避免毫秒残留让左右两片在 stamp() 下退化成同一个查询
    const mid = new Date(Math.floor((from.getTime() + to.getTime()) / 2000) * 1000);
    await walk(from, mid);
    await walk(new Date(mid.getTime() + 1000), to);
  }
  await walk(new Date("2008-01-01T00:00:00Z"), new Date());
  // 同名仓库可能来自不同作者，用 full_name 去重；切片边界重叠也靠这里兜底
  const seen = new Set();
  const deduped = all.filter((r) => !seen.has(r.full_name) && seen.add(r.full_name));
  // 手动收录：topic 搜索之外逐仓库补抓；进了 repos 列表就同样参与快照与软删保护
  for (const full of MANUAL_REPOS) {
    if (deduped.some((r) => r.full_name.toLowerCase() === full.toLowerCase())) continue;
    const res = await gh(`/repos/${full}`);
    if (!res.ok) {
      console.warn(`  ⚠️ 手动收录 ${full} 抓取失败（${res.status}），本轮跳过`);
      continue;
    }
    deduped.push(await res.json());
  }
  // npm 发现名单：已入库的全抓，新的限量补
  const names = npmDiscoveredRepos().filter(
```

</details>

**依据 4 · 源码核查**：[scripts/sync-plugins-db.mjs:454-473](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L454-L473)

upsert 与保留手动分类。

<details>
<summary>查看原文（20行）</summary>

```text
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  // 分类每天随仓库描述/topic 重算，但运营手工定的分类（category_manual=1）永不覆盖；
  // 内测白名单组织的仓库自动加 is_insider（只加不摘，手动标的照旧保留）
  const upserts = repos.map((r, i) => ({
    sql: `INSERT INTO plugins
            (full_name, name, owner, url, description, tags, language, stars,
             contributors, pushed_at, archived, first_seen_at, last_synced_at, is_present, category, is_insider)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
          ON CONFLICT(full_name) DO UPDATE SET
            name = excluded.name, owner = excluded.owner, url = excluded.url,
            description = excluded.description, tags = excluded.tags,
            language = excluded.language, stars = excluded.stars,
            contributors = COALESCE(excluded.contributors, plugins.contributors),
            pushed_at = excluded.pushed_at, archived = excluded.archived,
            last_synced_at = excluded.last_synced_at, is_present = 1,
            category = CASE WHEN plugins.category_manual = 1
                            THEN plugins.category ELSE excluded.category END,
            is_insider = CASE WHEN excluded.is_insider = 1 THEN 1 ELSE plugins.is_insider END`,
```

</details>

**依据 5 · 源码核查**：[scripts/gen-plugins-real.mjs:30-45](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/gen-plugins-real.mjs#L30-L45)

静态数据过滤与排序。

<details>
<summary>查看原文（16行）</summary>

```text
const rs = await client.execute(
  `SELECT p.full_name, p.name, p.owner, p.url, p.description, p.tags, p.language,
          p.stars, p.contributors, p.pushed_at, p.archived, p.category, p.score,
          p.is_featured, p.featured_boost, p.is_insider, p.is_official, p.is_risky, p.risk_note,
          p.first_seen_at, p.is_plugin,
          p.dl_pkg, p.dl_npm_total, p.dl_mirror_total, p.dl_release_total,
          p.dl_manual_total, p.dl_manual_note,
          p.install_kind, p.install_cmd, p.install_cmd_auto, p.pkg_name, p.pkg_version,
          p.npm_latest_version,
          COALESCE(p.stars - bs.stars, 0) AS star_growth,
          CASE WHEN p.contributors IS NOT NULL AND bs.contributors IS NOT NULL
               THEN p.contributors - bs.contributors END AS contributor_growth
   FROM plugins p
   ${PLUGIN_GROWTH_JOIN_SQL}
   WHERE p.is_present = 1 AND p.is_offtopic = 0
   ORDER BY p.is_risky ASC, p.is_featured * p.featured_boost DESC, p.stars DESC, p.full_name`,
```

</details>

**依据 6 · 源码核查**：[apps/web/src/pages/api/plugins-data.ts:1-14](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/apps/web/src/pages/api/plugins-data.ts#L1-L14)

构建期 JSON。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * GET /api/plugins-data —— 插件超市的全量数据（懒加载第二段），与老站同一路径、同一形状。
 * 构建期直接生成静态 JSON：请求由静态资源返回，不跑 Worker、不查数据库。
 * 静态文件无扩展名，Content-Type 由 public/_headers 指定为 application/json。
 */
import type { APIRoute } from "astro";

import { getPluginsPageData } from "@/lib/plugins-page-data";

export const GET: APIRoute = () => {
  const { plugins, i18nDescriptions } = getPluginsPageData();
  return new Response(JSON.stringify({ plugins, i18nDescriptions }), {
    headers: { "content-type": "application/json" },
  });
```

</details>

**依据 7 · 源码核查**：[apps/web/src/components/PluginsBrowser.tsx:137-181](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/apps/web/src/components/PluginsBrowser.tsx#L137-L181)

首屏和全量筛选。

<details>
<summary>查看原文（45行）</summary>

```text
  // 全量数据懒加载：挂载后趁浏览器空闲拉齐，到达后无缝替换
  const [full, setFull] = useState<FullData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // 空闲加载可被用户操作抢先触发：全量没到之前筛选只跑在首屏 100 条上
  const loadNowRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    let alive = true;
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      loadNowRef.current = null;
      fetch("/api/plugins-data", { credentials: "omit" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((d: FullData) => {
          if (alive) setFull(d);
        })
        // 失败必须显式暴露：静默吞掉的话筛选会一直只作用于首屏 100 条，计数牌却写着全量数字
        .catch(() => {
          if (alive) setLoadFailed(true);
        });
    };
    loadNowRef.current = load;
    const idle = window.requestIdleCallback?.(load, { timeout: 2000 });
    const timer = idle == null ? window.setTimeout(load, 300) : null;
    return () => {
      alive = false;
      loadNowRef.current = null;
      if (idle != null) window.cancelIdleCallback?.(idle);
      if (timer != null) window.clearTimeout(timer);
    };
  }, [attempt]);
  const ensureFullData = useCallback(() => loadNowRef.current?.(), []);

  const plugins = full?.plugins ?? initialPlugins;
  const i18nDescriptions = full?.i18nDescriptions ?? initialI18n;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = plugins.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!matchesGrade(p, grade)) return false;
      if (language !== "all" && p.language !== language) return false;
      return !q || haystack(p).includes(q);
```

</details>

#### 缺口

- 未执行同步或访问部署站点
  **影响**：不能确认数据新鲜、实际可访问及完整覆盖
  **进一步探讨**：在受控数据与独立 GitHub 列表对照同步和页面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源不完整时软删除是否安全？

**研究主题**：缺陷与关键质疑

#### 完整回答

同步在所有 upsert 完成后对本轮未出现的仓库标记 is_present=0，点名轮次跳过软删除。这能防止写入中途直接清空，但 fetchRepos 对单秒超过上限只警告并截取前 1000，手工收录抓取失败也只警告跳过；本路径未见将这些不完整情况传递为禁止软删除的标志，因而在这些条件下遗漏的既有仓库可能被误标缺席，并在静态生成时被过滤。尚未触发实验，不能断言线上实际发生。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync-plugins-db.mjs:200-218](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L200-L218)

单秒超限后警告和截断。

<details>
<summary>查看原文（19行）</summary>

```text
  async function walk(from, to) {
    const q = `topic:${TOPIC}+is:public+created:${stamp(from)}..${stamp(to)}`;
    const first = await searchPage(q, 1);
    if (first.total_count < 900) {
      all.push(...first.items);
      if (first.total_count > first.items.length) {
        for (let page = 2; page <= 10; page++) {
          const body = await searchPage(q, page);
          all.push(...body.items);
          if (body.items.length < 100) break;
        }
      }
      return;
    }
    // 区间已缩到 1 秒还超限时只能截断收 1000 条，翻页收满并明说
    if (to.getTime() - from.getTime() < 1000) {
      console.warn(`  ⚠️ ${q} 单秒超 1000 仓库，只能收前 1000`);
      all.push(...(await fetchAllPages(q)));
      return;
```

</details>

**依据 2 · 源码核查**：[scripts/sync-plugins-db.mjs:226-235](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L226-L235)

手工收录失败跳过。

<details>
<summary>查看原文（10行）</summary>

```text
  // 同名仓库可能来自不同作者，用 full_name 去重；切片边界重叠也靠这里兜底
  const seen = new Set();
  const deduped = all.filter((r) => !seen.has(r.full_name) && seen.add(r.full_name));
  // 手动收录：topic 搜索之外逐仓库补抓；进了 repos 列表就同样参与快照与软删保护
  for (const full of MANUAL_REPOS) {
    if (deduped.some((r) => r.full_name.toLowerCase() === full.toLowerCase())) continue;
    const res = await gh(`/repos/${full}`);
    if (!res.ok) {
      console.warn(`  ⚠️ 手动收录 ${full} 抓取失败（${res.status}），本轮跳过`);
      continue;
```

</details>

**依据 3 · 源码核查**：[scripts/sync-plugins-db.mjs:510-523](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L510-L523)

全量轮次按本轮结果软删除。

<details>
<summary>查看原文（14行）</summary>

```text
  console.log(`写库：${upserts.length} 条 upsert + ${snapshots.length} 条快照…`);
  const stmts = [...upserts, ...snapshots];
  for (let i = 0; i < stmts.length; i += 100) {
    await client.batch(stmts.slice(i, i + 100), "write");
  }

  // 全部 upsert 成功后才软删——中途崩溃不会把站点清空。
  // 点名轮次没有全量名单，跳过（见 ONLY 的注释）。
  if (!ONLY.length) {
    await client.execute({
      sql: `UPDATE plugins SET is_present = 0
            WHERE full_name NOT IN (SELECT value FROM json_each(?))`,
      args: [JSON.stringify(repos.map((r) => r.full_name))],
    });
```

</details>

**依据 4 · 源码核查**：[scripts/gen-plugins-real.mjs:42-45](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/gen-plugins-real.mjs#L42-L45)

只发布 present 且非 off-topic。

```text
   FROM plugins p
   ${PLUGIN_GROWTH_JOIN_SQL}
   WHERE p.is_present = 1 AND p.is_offtopic = 0
   ORDER BY p.is_risky ASC, p.is_featured * p.featured_boost DESC, p.stars DESC, p.full_name`,
```

#### 缺口

- 未验证线上数据和失败条件频率
  **影响**：不能判断实际误删或受影响规模
  **进一步探讨**：用独立数据库注入单秒截断和手工抓取错误，核查既有行状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 排名和数据使用需承担哪些依赖、成本与边界？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

数据依赖 GitHub 搜索及配额、数据库和生成部署；贡献者抓取失败时 COALESCE 保留旧值，不能将旧值当本轮新鲜观测。评分组合活跃、Star、AI 工程分和维护者特征，是站点的排序规则而非独立安装验收。查找者应回原仓库检查固定版本、权限、依赖与安装路径，发现来源或安全边界不明时先不安装；维护者需为补采、状态核对和恢复软删除支付人工与计算资源，费用与时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync-plugins-db.mjs:126-155](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L126-L155)

限流重试和等待。

<details>
<summary>查看原文（30行）</summary>

```text
  // search API 只有 30 次/分钟，创建时间二分切到秒之后请求数明显变多，撞限流是常态。
  // 只在确实是限流时重试（429，或 403 且配额已归零），普通 403 权限错误照旧原样返回。
  // 二级限流（secondary rate limit）是 403 且 remaining 不为 0，只能靠响应体 / retry-after 识别；
  // 漏掉它会让 searchPage 直接抛错、整轮 sync 作废（10-27、10-29 两次就是这样挂的）。
  const secondary =
    res.status === 403 &&
    (res.headers.has("retry-after") ||
      /secondary rate limit/i.test(await res.clone().text().catch(() => "")));
  const limited =
    res.status === 429 ||
    (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") ||
    secondary;
  if (limited && attempt < 6) {
    const retryAfter = Number(res.headers.get("retry-after"));
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    const waitMs = retryAfter
      ? retryAfter * 1000
      : secondary
        ? 60_000
        : reset
        ? Math.max(0, reset * 1000 - Date.now()) + 1000
        : 60_000;
    // 上限 65 分钟而不是 2 分钟：search API 一分钟就恢复，但贡献者数走的 core API
    // 要等整点窗口重置（最长 1 小时）。等 2 分钟重试 6 次只撑 12 分钟，第 5000 次调用
    // 之后的仓库会整批落空（COALESCE 保留旧值，看不出失败，但贡献者数就再也不更新了）。
    const wait = Math.min(Math.max(waitMs, 1000), 65 * 60_000);
    console.warn(`  ⏳ 触发限流，等待 ${Math.ceil(wait / 1000)}s 重试（第 ${attempt + 1} 次）`);
    await new Promise((r) => setTimeout(r, wait));
    return gh(path, attempt + 1);
  }
```

</details>

**依据 2 · 源码核查**：[scripts/sync-plugins-db.mjs:440-450](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L440-L450)

贡献者采集失败计数。

<details>
<summary>查看原文（11行）</summary>

```text
  let contributors;
  let failures = 0;
  if (SKIP_CONTRIBUTORS) {
    console.log("跳过贡献者数（--skip-contributors），沿用上一轮的值");
    contributors = new Array(repos.length).fill(null);
  } else {
    console.log(`逐仓库抓贡献者数（并发 ${CONCURRENCY}）…`);
    contributors = await mapPool(repos, CONCURRENCY, (r) =>
      contributorCount(r.full_name),
    );
    failures = contributors.filter((c) => c === null).length;
```

</details>

**依据 3 · 源码核查**：[scripts/sync-plugins-db.mjs:459-470](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L459-L470)

贡献者缺失保留旧值。

<details>
<summary>查看原文（12行）</summary>

```text
  const upserts = repos.map((r, i) => ({
    sql: `INSERT INTO plugins
            (full_name, name, owner, url, description, tags, language, stars,
             contributors, pushed_at, archived, first_seen_at, last_synced_at, is_present, category, is_insider)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
          ON CONFLICT(full_name) DO UPDATE SET
            name = excluded.name, owner = excluded.owner, url = excluded.url,
            description = excluded.description, tags = excluded.tags,
            language = excluded.language, stars = excluded.stars,
            contributors = COALESCE(excluded.contributors, plugins.contributors),
            pushed_at = excluded.pushed_at, archived = excluded.archived,
            last_synced_at = excluded.last_synced_at, is_present = 1,
```

</details>

**依据 4 · 源码核查**：[scripts/lib/scoring.mjs:1-14](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/lib/scoring.mjs#L1-L14)

站点评分来源及版本。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * 插件综合评分：0-100 = 活跃度 + Star 热度 + 工程规范(AI) + 维护者靠谱度。
 *
 * 核心设计：DSH 生态刚开源几天，时间类信号（更新衰减/周覆盖率/长期增长）
 * 尚无区分度，所以权重与时间窗都是「生态年龄」的函数——
 * 今天自动是早期形态（工程规范与维护者历史吃重、star 看速度），
 * ~90 天后自动长成成熟形态（活跃度吃重、star 看存量与持续性），无需换算法。
 *
 * 工程规范 25 分制的四个子分由 AI 评审给出（manifest/发布/文档/DSH 真实集成度），
 * 其余全部为确定性公式，保证分数可复现、可审计。
 */

// 写入每条评分记录；算法、权重或输入口径变化时必须递增，供 API 消费者判读可比性。
export const SCORING_VERSION = "2026-08-17.1";
```

</details>

**依据 5 · 源码核查**：[scripts/lib/scoring.mjs:35-43](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/lib/scoring.mjs#L35-L43)

权重。

```text
/** 四维权重（和恒为 100）。 */
export function weights(ecoAgeDays) {
  const t = transition(ecoAgeDays);
  return {
    activity: 25 + 20 * t,
    star: 30,
    engineering: 25 - 10 * t,
    maintainer: 20 - 10 * t,
  };
```

**依据 6 · 作者声明**：[README.md:51-67](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/README.md#L51-L67)

生成、数据库和同步声明。

<details>
<summary>查看原文（17行）</summary>

````text
### Regenerating plugin data

Plugins from the GitHub topic `dsh-plugin` are synced daily into the project database; the static snapshots (plugin library, homepage rails) are generated from it. To regenerate the snapshots only (needs database credentials in `.env.local`):

```bash
pnpm gen:data
```

To run a full refresh — GitHub sync, download counts, install methods, snapshots, build check — and commit only the generated files:

```bash
pnpm refresh
```

## Submit your plugin

Add the `dsh-plugin` topic to your **public** GitHub repository. A scheduled job syncs the topic every day at 02:17 UTC, so a newly tagged repo shows up in the marketplace within about a day — no issue or PR needed.
````

</details>

#### 缺口

- 未检查各项评分材料质量和真实安装
  **影响**：不能把评分或候选当采用证明
  **进一步探讨**：回固定源码、记录权限与真实宿主验证后再决定安装。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让来源缺口不改变既有目录的可见性？

**研究主题**：新假设与验证

#### 完整回答

基于 Q03 的截断及手工来源缺失，假设为每次来源分片与手工条目记录完成状态，并只在相关来源完整时执行缺席标记，可以减少错误隐藏。对照现有逻辑注入搜索截断、限流和手工抓取失败，比较误隐藏、过期留存、人工核查和运行成本；若保留大量失效条目或不能识别遗漏则否定。该做法是未验证的设计建议，现有点名轮次跳过软删除是已存在的反例和局部保护。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync-plugins-db.mjs:214-218](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L214-L218)

截断仅告警。

```text
    // 区间已缩到 1 秒还超限时只能截断收 1000 条，翻页收满并明说
    if (to.getTime() - from.getTime() < 1000) {
      console.warn(`  ⚠️ ${q} 单秒超 1000 仓库，只能收前 1000`);
      all.push(...(await fetchAllPages(q)));
      return;
```

**依据 2 · 源码核查**：[scripts/sync-plugins-db.mjs:229-235](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L229-L235)

手工来源跳过。

```text
  // 手动收录：topic 搜索之外逐仓库补抓；进了 repos 列表就同样参与快照与软删保护
  for (const full of MANUAL_REPOS) {
    if (deduped.some((r) => r.full_name.toLowerCase() === full.toLowerCase())) continue;
    const res = await gh(`/repos/${full}`);
    if (!res.ok) {
      console.warn(`  ⚠️ 手动收录 ${full} 抓取失败（${res.status}），本轮跳过`);
      continue;
```

**依据 3 · 源码核查**：[scripts/sync-plugins-db.mjs:516-523](https://github.com/hikariming/dshfind/blob/341e9c599367ecb7094c8064d13746d099381296/scripts/sync-plugins-db.mjs#L516-L523)

点名跳过以及完整轮次缺席标记。

```text
  // 全部 upsert 成功后才软删——中途崩溃不会把站点清空。
  // 点名轮次没有全量名单，跳过（见 ONLY 的注释）。
  if (!ONLY.length) {
    await client.execute({
      sql: `UPDATE plugins SET is_present = 0
            WHERE full_name NOT IN (SELECT value FROM json_each(?))`,
      args: [JSON.stringify(repos.map((r) => r.full_name))],
    });
```

#### 缺口

- 方案和真实数据下运行成本未知
  **影响**：不能宣称已修复误隐藏
  **进一步探讨**：使用隔离数据库构造完整和不完整来源并验证状态。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
