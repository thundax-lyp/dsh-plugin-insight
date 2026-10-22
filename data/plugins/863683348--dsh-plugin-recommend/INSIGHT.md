# dsh-plugin-recommend

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e553b1a](https://github.com/863683348/dsh-plugin-recommend/tree/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b)

<!-- BEGIN META -->
[![npm 30d 733](https://img.shields.io/static/v1?label=npm+30d&message=733&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend)
<!-- END META -->

> **实现功能**：从内置市场目录做需求词法排序、分类详情与相似候选搜索，可显式从固定HTTPS README刷新目录。

> **核心亮点**：将1135条描述/tag目录的解释性词法、分类与相似探索接到模型工具，并提供显式固定源刷新。详见[Q02](#research-q02)。

> **风险与缺陷**：live非空即全替换且无tag/版本，失败仍保旧live却提示embedded；解析类别子串/格式漂移可不完整，去重先保首项，分数不代表安全/值得安装。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 解决什么插件发现问题，分数能用于安装决定吗？](#detail-section-11)
  - [Q02 · 排序、去重、多样化和相似替代怎么产生？](#detail-section-12)
  - [Q03 · 内置数据与在线刷新是否同一质量/可追溯状态？](#detail-section-13)
  - [Q04 · 目录内容到模型和安装建议有哪些信任边界？](#detail-section-14)
  - [Q05 · 启动流程与首次持续恢复成本是什么？](#detail-section-15)
  - [Q06 · 推荐结论与可继续探讨入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向只知道能力需求、希望在DSH内搜目录/找近邻替代/看分类详情的用户。工具recommend支持search/categories/detail/similar/refresh；只返回目录事实/词重合分，不执行安装、不研究源码或核候选安全/兼容。

合格结果应给可追溯目录版本和匹配理由，明确未评估项与刷新边界。高分表示词法/类别相关，不是质量、热度、值得安装或成功概率。基线是手动查市场目录/README，增量是模型工具内离线较大目录与显式在线刷新。作者提示先gate_scan是建议文字，插件不强制安全门或实际调用scan，不证明扫描器自身有效。

人工按目录描述/标签检索再研究候选；统一工具入口有便利，质量/效率仍需标注比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| search | 需求词法+类过滤 | 非质量/安装评分 |
| categories/detail | 目录计数/首名称匹配 | 非最新身份/维护验收 |
| similar | tag/类/描述近邻 | 不证明可替代，diversify未接 |
| refresh | 固定HTTPS更新内存目录 | 非空不等完整，无tag/源版本 |
| 理由 | 字段权重可见 | 截断/tie分不完整 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt、Cordis/Schemastery | 工具/提示注册 | peer0.1系非全部代际验收 |
| 包内catalog可读 | 离线默认搜索 | 读错返回空，需区分错误 |
| fetch/AbortSignal网络能力 | 仅显式refresh | 固定HTTPS源，不保证格式与完整性 |
| 独立候选研究/安装权限 | 从相关候选到采用 | 工具不代核安全/兼容 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主DSL/目录版本 | main存在，verify子路径另核 |
| 先离线搜 | 明确need与category，限制topN | 分数仅词重合，查真实用途 |
| 看详情/替代 | 用完整名字/URL核身份 | 部分名第一条不一定目标 |
| 需要再刷新 | 先核数据来源/解析质量 | 不能只看ok/非空即全目录 |
| 安装前 | 独立评估候选/权限/宿主 | gate建议不等已通过或自动授权 |
| 恢复 | 看source、条数与损坏状态 | 旧live仍可在，重启才回embedded |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地1135条包数据，无独立模型请求 | 配DSL、核候选研究入口 | 工时/金额未知 |
| 持续使用 | 同步读JSON/词法排序、工具schema/结果上下文，可选refresh网络 | 判断理由/目录时效与候选适用 | 无额外LLM不等总token费0，真实时延/金额未知 |
| 失败恢复 | 重试/重新读目录、重启清live | 核格式漂移/错条目/旧live与来源 | 无持久live版本回滚，恢复时间与费用未知 |



#### 效果

| 目标 | 增量 | 限制 |
| --- | --- | --- |
| 大目录候选发现 | 描述/tag/类别词法 | 非质量/安全推荐 |
| 可解释 | 命中理由/分项 | 截断/tie项不全 |
| 新资料 | 固定URL显式refresh | 可能局部替换/丢tag，无版本 |
| 替代探索 | 元数据similar | 无兼容/等价研究 |

无同需求人工检索的召回/误荐率、总判断时间或模型token对照，不用1135条数量替代效果。

> **思考**：live非空即全替换且无tag/版本，失败仍保旧live却提示embedded；解析类别子串/格式漂移可不完整，去重先保首项，分数不代表安全/值得安装。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将1135条描述/tag目录的解释性词法、分类与相似探索接到模型工具，并提供显式固定源刷新。详见[Q02](#research-q02)。

将1135条描述/tag目录的解释性词法、分类与相似探索接到模型工具，并提供显式固定源刷新。详见[Q02](#research-q02)。

只读catalog.json解析得到count/实际1135、1135个归一URL、描述全非空、945条有tag，generatedAt2026-08-17。统计保DATA-AUDIT；它比只有名字的目录更有检索素材，但描述由上游文本截取/自动tag，不是每项源码研究。gen脚本regex解析本地yml，描述取en或zh截140字符、tag按词典至多6，跳坏文件；没有保逐项上游commit/文件指纹与选择/未知状态。

refresh只请求固定HTTPS raw README，AbortSignal30秒覆盖fetch/text链，HTTP非成功拒绝，parsed非空就替换模块级liveCatalog。parser只识###及CATEGORIES英文子串、特定GitHub列表行，描述截200，不生成t/tag。刷新后名称/描述仍可用，但tag相关权重/相似分丢失，不能把刷新当等质量增量。标题子串如含ui片段可能先命中ui，格式漂移/局部解析仅一条仍会全量替换，条数大跌不被拒绝。

失败没有清liveCatalog，若之前已成功刷新，catch文字却说using embedded，返回source仍是live；实际保旧live而非回内置，读者可误解数据回退。cache在模块全局跨apply共享，无版本/ETag/时间、重启丢live。嵌入加载失败catch返回空数组，“没有候选”可能是损坏而非确无匹配，缺错误可见性。

refresh由模型工具动作显式触发，不存在自行周期外发；固定URL避免任意用户URL fetch，但响应体res.text无字节上限、解析同步，30秒不等内存/CPU容量上限。远程文本中的name/description直接进结果与模型上下文，没有来源分级/指令隔离；它们应当第三方描述，而不是运行命令授权。

本实现不持久写/不安装或执行候选，也不验证HTTPS GitHub链接所指仓库的真实身份/转让/安全。detail部分名找第一条，可能选错同名，similar建议依元数据近似而非兼容替代。参数topN只需>0无最大上限，配置/长query也缺业务上限，可能把大量结果送上下文。

package导出./verify→lib/verify.js，但固定Git列出的lib只有index/recommend/catalog，子路径声明与树不符；main存在，不能称核心加载必失败，npm归档未核。package与提示词中的安全门名称不构成已实施约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

live非空即全替换且无tag/版本，失败仍保旧live却提示embedded；解析类别子串/格式漂移可不完整，去重先保首项，分数不代表安全/值得安装。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先加刷新来源/字段质量门，将结果当相关候选而非安全/安装推荐。详见[Q06](#research-q06)。

合格结果应给可追溯目录版本和匹配理由，明确未评估项与刷新边界。高分表示词法/类别相关，不是质量、热度、值得安装或成功概率。基线是手动查市场目录/README，增量是模型工具内离线较大目录与显式在线刷新。作者提示先gate_scan是建议文字，插件不强制安全门或实际调用scan，不证明扫描器自身有效。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。离线目录发现明确，在线完整性/字段一致与来源状态不足，不能将相关性当采用评价。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/recommend.js、lib/catalog.json、scripts/gen-catalog.mjs、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：两lib全读、生成脚本及catalog只读字段统计，包/patch；不执行refresh/生成脚本/测试或候选安装。
- 下一步：可继续固定README/目录mock核局部解析/无tag/旧live/重复身份与否定，比较更新完整性、误荐与总成本，不执行真实refresh。

**分析版本**

- **仓库**：[863683348/dsh-plugin-recommend](https://github.com/863683348/dsh-plugin-recommend)
- **版本号**：1.1.2（[固定提交 e553b1a](https://github.com/863683348/dsh-plugin-recommend/tree/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索源版本/字段质量与差异可审的候选快照、按身份取高分与完整解释，比较错更新/召回/审查成本；未实现。详见[Q06](#research-q06)。

可继续固定README/目录mock核局部解析/无tag/旧live/重复身份与否定，比较更新完整性、误荐与总成本，不执行真实refresh。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 166 | — | — | 1219 |
| .js | source | 2 | 523 | 418 | 76 | — |
| .mjs | source | 2 | 195 | 169 | 14 | — |
| .mjs | test | 1 | 172 | 157 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-recommend/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-recommend/issues?q=is%3Aissue+created%3A2026-09-22T09%3A14%3A37.113Z..2026-10-22T09%3A14%3A37.113Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-recommend/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A14%3A37.113Z..2026-10-22T09%3A14%3A37.113Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核相关性/推荐区别、内置与在线字段质量、解析/缓存/排序身份、信任与成本边界及改进。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决什么插件发现问题，分数能用于安装决定吗？

**研究主题**：场景与需求

#### 完整回答

面向只知道能力需求、希望在DSH内搜目录/找近邻替代/看分类详情的用户。工具recommend支持search/categories/detail/similar/refresh；只返回目录事实/词重合分，不执行安装、不研究源码或核候选安全/兼容。

合格结果应给可追溯目录版本和匹配理由，明确未评估项与刷新边界。高分表示词法/类别相关，不是质量、热度、值得安装或成功概率。基线是手动查市场目录/README，增量是模型工具内离线较大目录与显式在线刷新。作者提示先gate_scan是建议文字，插件不强制安全门或实际调用scan，不证明扫描器自身有效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-23](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/README.md#L11-L23)

作者1135/查找/刷新定位。

<details>
<summary>查看原文（13行）</summary>

```text
- Embedded catalog: **1135 entries** generated from the awesome-dsh-plugin data (name, repo, category, description, auto-derived tags).
- Free-text scoring: name matches weigh most, then tags, then description; category filter narrows results.
- Live refresh: pulls the latest catalog from the awesome-dsh-plugin README over HTTPS (fallback: embedded catalog).

## Tools

| Tool | Action | What it does |
|---|---|---|
| `recommend` | `search` | Top-N plugins for a need description (`query`), optional `category` / `topN`; each result includes score + match reasons |
| | `categories` | List catalog categories with counts |
| | `detail` | Full catalog entry for one plugin name |
| | `similar` | Nearest alternatives to a plugin (shared tags / category / description overlap) |
| | `refresh` | Fetch the latest catalog from the awesome-dsh-plugin README |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:42-49](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L42-L49)

引导建议和目录缓存。

```text
/** Prompt guidance for the agent. */
const RECOMMEND_SECTION_TEXT = "Plugin discovery: before installing or building a plugin, use the recommend tool to find existing DSH plugins for a need.\n\n- recommend search \"<need description>\" — keyword/tag/category matching over the marketplace catalog, with top-N results and match reasons.\n- recommend categories — list catalog categories with counts.\n- recommend detail <plugin name> — full catalog entry for one plugin.\n- recommend refresh — fetch the latest catalog from the awesome-dsh-plugin README (fallback: embedded catalog).\n\nAlways cross-check a recommendation with the installation safety gate (gate_scan) before installing.";

/** Catalog cache: embedded catalog + optional live refresh. */
let liveCatalog = null;

function currentCatalog() {
  return liveCatalog || loadEmbeddedCatalog();
```

**依据 3 · 源码核查**：[lib/index.js:155-182](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L155-L182)

详情仅固定字段。

<details>
<summary>查看原文（28行）</summary>

```text
    execute: async (args) => {
      const action = String(args.action || "search");
      const query = String(args.query || "").trim();
      const entries = currentCatalog();
      const source = liveCatalog ? "live" : "embedded";

      if (action === "categories") {
        return { action: "categories", ok: true, detail: "catalog categories", source, catalogSize: entries.length, categories: categoryCounts(entries) };
      }

      if (action === "detail") {
        const hit = findByName(entries, query);
        if (!hit) return { action: "detail", ok: false, detail: "no plugin named " + (query || "(empty)") + " in catalog", source, catalogSize: entries.length };
        return {
          action: "detail",
          ok: true,
          detail: hit.n,
          source,
          catalogSize: entries.length,
          results: [{
            name: hit.n,
            url: hit.u,
            category: hit.c,
            tags: hit.t || [],
            score: 1,
            reasons: ["exact/partial name match"],
            description: hit.d,
          }],
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 排序、去重、多样化和相似替代怎么产生？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

分词把CJK字符串合成相邻二字片段、英文至少2字符去停词；中文先抽全部汉字再拼，跨空格/标点的非相邻原文也可成片段。否定not/no被删，不能表达不要某能力；同义无词交集也会漏。

name命中+3，tag+2，否则desc+1，指定类别再+2，标签数量至多加0.04微小tie分。至少一个term真命中才入池，避免只类别加分推无关项。理由至多6/明细8且不列tag tie项，不能要求显示分项总和精确等于score。

search默认repo去重先保输入顺序首项，再按score/名称排；同repo不同条目时可能丢更高分。固定embedded1135个URL互异，此条件风险不等当前已发生。repoKey只小写去尾斜杠，不归一.git/重定向/组件身份。similar按共享tag*3、同类2、描述term重合至多2.5排序；同类别不等可互换/功能等价。参数说明diversify用于search/similar，但similar分支仅topN，不应用多样化/去重。

贡献是较大目录的解释性词法查找/近邻与宿主入口，无嵌入/新推荐算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/recommend.js:16-52](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L16-L52)

分词/否定停词。

<details>
<summary>查看原文（37行）</summary>

```text
const EN_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is",
  "are", "was", "were", "be", "this", "that", "these", "those", "it", "its",
  "at", "by", "from", "as", "not", "no", "do", "does", "did", "will", "would",
  "should", "can", "could", "may", "might", "have", "has", "had", "we", "you",
  "they", "he", "she", "them", "their", "our", "your", "my", "me", "there",
  "here", "what", "which", "who", "when", "where", "why", "how", "all", "any",
  "some", "more", "most", "other", "about", "into", "than", "then", "just",
  "also", "only", "very", "such", "if", "while", "because", "so", "up", "out",
  "over", "again", "once", "dsh", "plugin", "plugins", "for", "agent", "ai",
  "deepseek", "harness",
]);

const CJK_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/g;

/**
 * Tokenize a free-text need/query into search terms.
 * CJK text becomes character bigrams; English words >= 2 chars survive
 * stopword filtering; the result is lowercased and deduplicated.
 * @param {string} query
 * @returns {string[]}
 */
export function tokenize(query) {
  const text = String(query || "").toLowerCase();
  const out = new Set();
  // CJK bigrams
  const cjkChars = text.match(CJK_RE) || [];
  for (let i = 0; i < cjkChars.length - 1; i++) {
    out.add(cjkChars[i] + cjkChars[i + 1]);
  }
  if (cjkChars.length === 1) out.add(cjkChars[0]);
  // English words
  for (const m of text.matchAll(/[a-z0-9][a-z0-9_-]*/g)) {
    const w = m[0];
    if (w.length >= 2 && !EN_STOPWORDS.has(w)) out.add(w);
  }
  return [...out];
```

</details>

**依据 2 · 源码核查**：[lib/recommend.js:62-87](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L62-L87)

权重与截断。

<details>
<summary>查看原文（26行）</summary>

```text
export function scoreEntry(entry, terms, opts = {}) {
  const { category } = opts;
  const name = entry.n.toLowerCase();
  const desc = (entry.d || "").toLowerCase();
  const tags = (entry.t || []).map((x) => x.toLowerCase());
  const hay = name + " " + desc;
  let score = 0;
  const reasons = [];
  const details = [];
  for (const term of terms) {
    const inName = name.includes(term);
    const inTag = tags.some((t) => t.includes(term) || term.includes(t));
    const inDesc = desc.includes(term);
    if (inName) { score += 3; reasons.push("name matches '" + term + "'"); details.push({ field: "name", term, weight: 3 }); }
    if (inTag) { score += 2; reasons.push("tag [" + term + "]"); details.push({ field: "tags", term, weight: 2 }); }
    else if (inDesc) { score += 1; reasons.push("description mentions '" + term + "'"); details.push({ field: "description", term, weight: 1 }); }
  }
  if (category && entry.c === category) {
    score += 2;
    reasons.push("category " + category);
    details.push({ field: "category", term: category, weight: 2 });
  }
  // tiny tiebreaker: prefer entries with more tags (richer descriptions)
  score += Math.min(tags.length, 4) * 0.01;
  const uniqueDetails = details.filter((d, i, arr) => arr.findIndex((x) => x.field === d.field && x.term === d.term) === i).slice(0, 8);
  return { score, reasons: reasons.slice(0, 6), details: uniqueDetails };
```

</details>

**依据 3 · 源码核查**：[lib/recommend.js:108-149](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L108-L149)

先去重再排序。

<details>
<summary>查看原文（42行）</summary>

```text
export function rank(entries, terms, opts = {}) {
  const { category, topN = 5, minScore = 1, diversify = false, perCategory = 2, dedupeByRepo = false } = opts;
  const scored = [];
  for (const e of entries) {
    if (category && e.c !== category) continue;
    // a result must actually match at least one term; the category bonus alone
    // must not surface irrelevant plugins
    if (termMatches(e, terms) === 0) continue;
    const { score, reasons, details } = scoreEntry(e, terms, { category });
    if (score < minScore) continue;
    scored.push({ ...e, score, reasons, details });
  }
  let pool = scored;
  if (dedupeByRepo) {
    const seen = new Set();
    pool = scored.filter((e) => {
      const key = repoKey(e);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  pool.sort((a, b) => b.score - a.score || a.n.localeCompare(b.n));
  if (!diversify) return pool.slice(0, topN);
  const cap = Math.max(1, Math.floor(perCategory) || 2);
  const counts = new Map();
  const picked = [];
  for (const e of pool) {
    const key = String(e.c || "");
    const seen = counts.get(key) ?? 0;
    if (seen >= cap) continue;
    counts.set(key, seen + 1);
    picked.push(e);
    if (picked.length >= topN) break;
  }
  return picked;
}

/** Dedupe key for an entry: repository url when present, else lowercased name. */
export function repoKey(entry) {
  const url = String(entry.u || "").trim().toLowerCase().replace(/\/+$/, "");
  return url.length > 0 ? url : String(entry.n || "").toLowerCase();
```

</details>

**依据 4 · 源码核查**：[lib/recommend.js:166-195](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L166-L195)

相似仅词法。

<details>
<summary>查看原文（30行）</summary>

```text
export function similarity(a, b) {
  const tagsA = new Set((a.t || []).map((x) => String(x).toLowerCase()));
  const sharedTags = (b.t || []).map((x) => String(x).toLowerCase()).filter((t) => tagsA.has(t));
  const sameCategory = a.c === b.c;
  const termsA = new Set(tokenize(a.d || ""));
  const overlap = [...new Set(tokenize(b.d || ""))].filter((t) => termsA.has(t));
  let score = sharedTags.length * 3 + (sameCategory ? 2 : 0) + Math.min(overlap.length, 5) * 0.5;
  const reasons = [];
  if (sharedTags.length > 0) reasons.push("shared tags: " + sharedTags.slice(0, 5).join(", "));
  if (sameCategory) reasons.push("same category (" + a.c + ")");
  if (overlap.length > 0) reasons.push("description overlap: " + overlap.slice(0, 5).join(", "));
  return { score: Math.round(score * 100) / 100, reasons, sharedTags, sameCategory, overlap };
}

/** Entries most similar to a named entry (for alternatives / same-family tools). */
export function similar(entries, name, { topN = 5 } = {}) {
  const key = String(name || "").trim().toLowerCase();
  if (key.length === 0) throw new Error("recommend: a plugin name is required for action=similar");
  const exact = entries.find((e) => String(e.n).toLowerCase() === key);
  const target = exact ?? entries.find((e) => String(e.n).toLowerCase().includes(key));
  if (!target) return { target: null, results: [] };
  const results = entries
    .filter((e) => e !== target)
    .map((e) => {
      const sim = similarity(target, e);
      return { ...e, score: sim.score, similarity: sim.score, reasons: sim.reasons, sharedTags: sim.sharedTags };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score || a.n.localeCompare(b.n))
    .slice(0, Math.max(1, Math.floor(topN) || 5));
```

</details>

**依据 5 · 源码核查**：[lib/index.js:203-221](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L203-L221)

similar未传diversify。

<details>
<summary>查看原文（19行）</summary>

```text
      if (action === "similar") {
        const { target, results } = similar(entries, query, { topN: typeof args.topN === "number" && args.topN > 0 ? args.topN : config.topN });
        if (!target) return { action: "similar", ok: false, detail: "no plugin named " + (query || "(empty)") + " in catalog", source, catalogSize: entries.length };
        return {
          action: "similar",
          ok: true,
          detail: "plugins similar to " + target.n,
          source,
          catalogSize: entries.length,
          total: results.length,
          results: results.map((r) => ({
            name: r.n,
            url: r.u,
            category: r.c,
            tags: r.t || [],
            score: Math.round(r.score * 100) / 100,
            reasons: r.reasons,
            description: r.d,
          })),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 内置数据与在线刷新是否同一质量/可追溯状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

只读catalog.json解析得到count/实际1135、1135个归一URL、描述全非空、945条有tag，generatedAt2026-08-17。统计保DATA-AUDIT；它比只有名字的目录更有检索素材，但描述由上游文本截取/自动tag，不是每项源码研究。gen脚本regex解析本地yml，描述取en或zh截140字符、tag按词典至多6，跳坏文件；没有保逐项上游commit/文件指纹与选择/未知状态。

refresh只请求固定HTTPS raw README，AbortSignal30秒覆盖fetch/text链，HTTP非成功拒绝，parsed非空就替换模块级liveCatalog。parser只识###及CATEGORIES英文子串、特定GitHub列表行，描述截200，不生成t/tag。刷新后名称/描述仍可用，但tag相关权重/相似分丢失，不能把刷新当等质量增量。标题子串如含ui片段可能先命中ui，格式漂移/局部解析仅一条仍会全量替换，条数大跌不被拒绝。

失败没有清liveCatalog，若之前已成功刷新，catch文字却说using embedded，返回source仍是live；实际保旧live而非回内置，读者可误解数据回退。cache在模块全局跨apply共享，无版本/ETag/时间、重启丢live。嵌入加载失败catch返回空数组，“没有候选”可能是损坏而非确无匹配，缺错误可见性。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/gen-catalog.mjs:49-77](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/scripts/gen-catalog.mjs#L49-L77)

生成/字段截断与跳坏。

<details>
<summary>查看原文（29行）</summary>

```text
const URL_RE = /^url:[ \t]*(.+)$/m;
const NAME_RE = /^name:[ \t]*(.+)$/m;
const CAT_RE = /^category:[ \t]*(.+)$/m;
const EN_RE = /^[ \t]+en:[ \t]*'?(.*?)'?[ \t]*$/m;
const ZH_RE = /^[ \t]+zh:[ \t]*'?(.*?)'?[ \t]*$/m;

function parseEntry(text) {
  const u = (text.match(URL_RE) || [])[1];
  const n = (text.match(NAME_RE) || [])[1];
  const category = (text.match(CAT_RE) || [])[1];
  if (!u || !n || !category) return null;
  const en = (text.match(EN_RE) || [])[1];
  const zh = (text.match(ZH_RE) || [])[1];
  const d = (en || zh || "").trim();
  return { n: n.trim(), u: u.trim(), c: category.trim(), d: d.slice(0, 140), t: tagsFor(n, d) };
}

const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".yml"));
const entries = [];
for (const f of files) {
  try {
    const e = parseEntry(fs.readFileSync(path.join(dataDir, f), "utf8"));
    if (e) entries.push(e);
  } catch { /* skip malformed entries */ }
}
entries.sort((a, b) => a.n.localeCompare(b.n));
const json = JSON.stringify({ generatedAt: new Date().toISOString(), count: entries.length, entries });
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, json);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:45-49](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L45-L49)

模块全局live。

```text
/** Catalog cache: embedded catalog + optional live refresh. */
let liveCatalog = null;

function currentCatalog() {
  return liveCatalog || loadEmbeddedCatalog();
```

**依据 3 · 源码核查**：[lib/index.js:186-199](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L186-L199)

刷新接受/失败旧live。

<details>
<summary>查看原文（14行）</summary>

```text
      if (action === "refresh") {
        try {
          const res = await fetch("https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.md", {
            headers: { "User-Agent": "dsh-plugin-recommend" },
            signal: AbortSignal.timeout(30000),
          });
          if (!res.ok) throw new Error("http " + res.status);
          const md = await res.text();
          const parsed = parseAwesomeReadme(md);
          if (parsed.length === 0) throw new Error("no entries parsed");
          liveCatalog = parsed;
          return { action: "refresh", ok: true, detail: "catalog refreshed from awesome-dsh-plugin README", source: "live", catalogSize: parsed.length };
        } catch (e) {
          return { action: "refresh", ok: false, detail: "refresh failed: " + (e && e.message || e) + " — using embedded catalog", source, catalogSize: entries.length };
```

</details>

**依据 4 · 源码核查**：[lib/recommend.js:214-244](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L214-L244)

类别/行解析、无tag、加载失败空。

<details>
<summary>查看原文（31行）</summary>

```text
export function parseAwesomeReadme(md) {
  const entries = [];
  let category = null;
  const enHeadings = new Set(CATEGORIES);
  for (const raw of String(md).split(/\r?\n/)) {
    const heading = /^###\s+(.+)$/.exec(raw.trim());
    if (heading) {
      const title = heading[1];
      const en = CATEGORIES.find((c) => title.toLowerCase().includes(c));
      category = en || null;
      continue;
    }
    if (!category) continue;
    const m = /^-\s+\[([^\]]+)\]\((https:\/\/github\.com\/[^)]+)\)\s+[-—]\s+(.+)$/.exec(raw.trim());
    if (m) {
      entries.push({ n: m[1], u: m[2], c: category, d: m[3].trim().slice(0, 200) });
    }
  }
  return entries;
}

import { readFileSync } from "node:fs";

/** Load the embedded catalog JSON (created at build time). */
export function loadEmbeddedCatalog() {
  try {
    const raw = readFileSync(new URL("./catalog.json", import.meta.url), "utf8");
    const parsed = JSON.parse(raw);
    return parsed.entries || [];
  } catch {
    return [];
```

</details>

#### 缺口

- 刷新目标README当前格式/完整条数与检索质量没有本轮在线核验。
  **影响**：不称固定插件能稳定接当前全生态或保tag能力。
  **进一步探讨**：先用固定README样本与格式/类别/局部解析反例mock，核质量/条数门限与版本；本轮不调用真实refresh。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 目录内容到模型和安装建议有哪些信任边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

refresh由模型工具动作显式触发，不存在自行周期外发；固定URL避免任意用户URL fetch，但响应体res.text无字节上限、解析同步，30秒不等内存/CPU容量上限。远程文本中的name/description直接进结果与模型上下文，没有来源分级/指令隔离；它们应当第三方描述，而不是运行命令授权。

本实现不持久写/不安装或执行候选，也不验证HTTPS GitHub链接所指仓库的真实身份/转让/安全。detail部分名找第一条，可能选错同名，similar建议依元数据近似而非兼容替代。参数topN只需>0无最大上限，配置/长query也缺业务上限，可能把大量结果送上下文。

package导出./verify→lib/verify.js，但固定Git列出的lib只有index/recommend/catalog，子路径声明与树不符；main存在，不能称核心加载必失败，npm归档未核。package与提示词中的安全门名称不构成已实施约束。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:52-57](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L52-L57)

部分名首匹配。

```text
function findByName(entries, query) {
  const q = String(query || "").trim().toLowerCase();
  if (q.length === 0) return null;
  return entries.find((e) => e.n.toLowerCase() === q)
    || entries.find((e) => e.n.toLowerCase().includes(q))
    || null;
```

**依据 2 · 源码核查**：[lib/index.js:186-196](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L186-L196)

固定远程/无body上限。

<details>
<summary>查看原文（11行）</summary>

```text
      if (action === "refresh") {
        try {
          const res = await fetch("https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.md", {
            headers: { "User-Agent": "dsh-plugin-recommend" },
            signal: AbortSignal.timeout(30000),
          });
          if (!res.ok) throw new Error("http " + res.status);
          const md = await res.text();
          const parsed = parseAwesomeReadme(md);
          if (parsed.length === 0) throw new Error("no entries parsed");
          liveCatalog = parsed;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:225-247](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L225-L247)

topN/结果字段。

<details>
<summary>查看原文（23行）</summary>

```text
      // search (default)
      if (query.length === 0) {
        return { action: "search", ok: false, detail: "search needs a query describing the need", source, catalogSize: entries.length };
      }
      const terms = tokenize(query);
      const topN = typeof args.topN === "number" && args.topN > 0 ? args.topN : config.topN;
      const results = rank(entries, terms, {
        category: args.category,
        topN,
        minScore: config.minScore,
        diversify: args.diversify === true,
        perCategory: args.perCategory,
        dedupeByRepo: args.dedupe !== false,
      }).map((r) => ({
        name: r.n,
        url: r.u,
        category: r.c,
        tags: r.t,
        score: Math.round(r.score * 100) / 100,
        reasons: r.reasons,
        details: r.details,
        description: r.d,
      }));
```

</details>

**依据 4 · 源码核查**：[lib/index.js:42-43](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L42-L43)

扫描建议仅提示。

```text
/** Prompt guidance for the agent. */
const RECOMMEND_SECTION_TEXT = "Plugin discovery: before installing or building a plugin, use the recommend tool to find existing DSH plugins for a need.\n\n- recommend search \"<need description>\" — keyword/tag/category matching over the marketplace catalog, with top-N results and match reasons.\n- recommend categories — list catalog categories with counts.\n- recommend detail <plugin name> — full catalog entry for one plugin.\n- recommend refresh — fetch the latest catalog from the awesome-dsh-plugin README (fallback: embedded catalog).\n\nAlways cross-check a recommendation with the installation safety gate (gate_scan) before installing.";
```

**依据 5 · 源码核查**：[package.json:6-10](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/package.json#L6-L10)

verify导出声明。

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./verify": "./lib/verify.js",
    "./package.json": "./package.json"
```

#### 缺口

- 远程目录指令形文本、超大正文/结果与同名选错的具体宿主表现未模拟。
  **影响**：不保证输入可信隔离或有界模型上下文。
  **进一步探讨**：用无秘密固定文本与mock响应测字节/条数限制、来源标签及精确身份选择，不获取任意站点。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动流程与首次持续恢复成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt、Cordis/Schemastery | 工具/提示注册 | peer0.1系非全部代际验收 |
| 包内catalog可读 | 离线默认搜索 | 读错返回空，需区分错误 |
| fetch/AbortSignal网络能力 | 仅显式refresh | 固定HTTPS源，不保证格式与完整性 |
| 独立候选研究/安装权限 | 从相关候选到采用 | 工具不代核安全/兼容 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主DSL/目录版本 | main存在，verify子路径另核 |
| 先离线搜 | 明确need与category，限制topN | 分数仅词重合，查真实用途 |
| 看详情/替代 | 用完整名字/URL核身份 | 部分名第一条不一定目标 |
| 需要再刷新 | 先核数据来源/解析质量 | 不能只看ok/非空即全目录 |
| 安装前 | 独立评估候选/权限/宿主 | gate建议不等已通过或自动授权 |
| 恢复 | 看source、条数与损坏状态 | 旧live仍可在，重启才回embedded |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地1135条包数据，无独立模型请求 | 配DSL、核候选研究入口 | 工时/金额未知 |
| 持续使用 | 同步读JSON/词法排序、工具schema/结果上下文，可选refresh网络 | 判断理由/目录时效与候选适用 | 无额外LLM不等总token费0，真实时延/金额未知 |
| 失败恢复 | 重试/重新读目录、重启清live | 核格式漂移/错条目/旧live与来源 | 无持久live版本回滚，恢复时间与费用未知 |

#### 效果

| 目标 | 增量 | 限制 |
| --- | --- | --- |
| 大目录候选发现 | 描述/tag/类别词法 | 非质量/安全推荐 |
| 可解释 | 命中理由/分项 | 截断/tie项不全 |
| 新资料 | 固定URL显式refresh | 可能局部替换/丢tag，无版本 |
| 替代探索 | 元数据similar | 无兼容/等价研究 |

无同需求人工检索的召回/误荐率、总判断时间或模型token对照，不用1135条数量替代效果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:43-49](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/package.json#L43-L49)

宿主peer。

```text
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "repository": {
```

**依据 2 · 源码核查**：[lib/index.js:28-40](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L28-L40)

依赖/默认规模配置。

<details>
<summary>查看原文（13行）</summary>

```text
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration. */
const Config = z.object({
  /** Default number of results to return. */
  topN: z.number().default(5),
  /** Minimum score for a result to be returned. */
  minScore: z.number().default(1),
  /** Register the prompt-guidance section. */
  promptSection: z.boolean().default(true),
  /** Order of the prompt section. */
  sectionOrder: z.number().default(7),
});
```

</details>

**依据 3 · 源码核查**：[lib/index.js:155-159](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L155-L159)

每次currentCatalog/来源。

```text
    execute: async (args) => {
      const action = String(args.action || "search");
      const query = String(args.query || "").trim();
      const entries = currentCatalog();
      const source = liveCatalog ? "live" : "embedded";
```

**依据 4 · 源码核查**：[lib/index.js:268-273](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L268-L273)

提示段可关闭但仍静态inject。

```text
  if (config.promptSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "recommend:instructions",
      order: config.sectionOrder,
      text: RECOMMEND_SECTION_TEXT,
    }), "recommend.section()");
```

#### 缺口

- 真实需求的召回、误荐与总上下文/人工成本未标注比较。
  **影响**：不能量化推荐质量或省时。
  **进一步探讨**：固定目录版本和人工相关标签，比较手查/词法/刷新前后候选，并记录总阅读token/时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐结论与可继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

观察。离线较大目录的词法发现与解释可用作探索入口，但在线替换缺完整性/标签一致与版本，match分不是值得安装评估，近邻和去重也有选择偏差。先完善刷新质量门与来源收据，再作为稳定日常导购；不以一次高分直接安装。

从embedded有tag而live无tag、非空便替换且失败回退提示失真，推导“有版本与质量门的候选快照”。刷新先保候选包的源URL/固定commit/采集时间/解析器版本、条数/类别/tag覆盖变化，差异大则保旧版并标partial；统一tag派生与字段校验，再原子切换。搜索先按身份分组取最高相关项、保存完整评分解释，并显式区分相关性与未评估质量。

未实现。反例是生态真实大规模移除/新类别导致质量阈值误拒合法更新，因此需unknown与人工可审diff，而非永远保旧。最小对照含单条解析、标题substring、tag消失、网络失败旧live、重复repo高分后项、否定/同义需求。若新快照仍丢字段、错标embedded或召回/误荐不改善，或维护/审diff成本超过手查，核心假设不成立。只测可追溯与相关候选，不把目录快照当安全认证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:186-199](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js#L186-L199)

快照接受/回退基线。

<details>
<summary>查看原文（14行）</summary>

```text
      if (action === "refresh") {
        try {
          const res = await fetch("https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.md", {
            headers: { "User-Agent": "dsh-plugin-recommend" },
            signal: AbortSignal.timeout(30000),
          });
          if (!res.ok) throw new Error("http " + res.status);
          const md = await res.text();
          const parsed = parseAwesomeReadme(md);
          if (parsed.length === 0) throw new Error("no entries parsed");
          liveCatalog = parsed;
          return { action: "refresh", ok: true, detail: "catalog refreshed from awesome-dsh-plugin README", source: "live", catalogSize: parsed.length };
        } catch (e) {
          return { action: "refresh", ok: false, detail: "refresh failed: " + (e && e.message || e) + " — using embedded catalog", source, catalogSize: entries.length };
```

</details>

**依据 2 · 源码核查**：[lib/recommend.js:108-149](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L108-L149)

身份取最高分基线。

<details>
<summary>查看原文（42行）</summary>

```text
export function rank(entries, terms, opts = {}) {
  const { category, topN = 5, minScore = 1, diversify = false, perCategory = 2, dedupeByRepo = false } = opts;
  const scored = [];
  for (const e of entries) {
    if (category && e.c !== category) continue;
    // a result must actually match at least one term; the category bonus alone
    // must not surface irrelevant plugins
    if (termMatches(e, terms) === 0) continue;
    const { score, reasons, details } = scoreEntry(e, terms, { category });
    if (score < minScore) continue;
    scored.push({ ...e, score, reasons, details });
  }
  let pool = scored;
  if (dedupeByRepo) {
    const seen = new Set();
    pool = scored.filter((e) => {
      const key = repoKey(e);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  pool.sort((a, b) => b.score - a.score || a.n.localeCompare(b.n));
  if (!diversify) return pool.slice(0, topN);
  const cap = Math.max(1, Math.floor(perCategory) || 2);
  const counts = new Map();
  const picked = [];
  for (const e of pool) {
    const key = String(e.c || "");
    const seen = counts.get(key) ?? 0;
    if (seen >= cap) continue;
    counts.set(key, seen + 1);
    picked.push(e);
    if (picked.length >= topN) break;
  }
  return picked;
}

/** Dedupe key for an entry: repository url when present, else lowercased name. */
export function repoKey(entry) {
  const url = String(entry.u || "").trim().toLowerCase().replace(/\/+$/, "");
  return url.length > 0 ? url : String(entry.n || "").toLowerCase();
```

</details>

**依据 3 · 源码核查**：[lib/recommend.js:214-232](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js#L214-L232)

解析完整性基线。

<details>
<summary>查看原文（19行）</summary>

```text
export function parseAwesomeReadme(md) {
  const entries = [];
  let category = null;
  const enHeadings = new Set(CATEGORIES);
  for (const raw of String(md).split(/\r?\n/)) {
    const heading = /^###\s+(.+)$/.exec(raw.trim());
    if (heading) {
      const title = heading[1];
      const en = CATEGORIES.find((c) => title.toLowerCase().includes(c));
      category = en || null;
      continue;
    }
    if (!category) continue;
    const m = /^-\s+\[([^\]]+)\]\((https:\/\/github\.com\/[^)]+)\)\s+[-—]\s+(.+)$/.exec(raw.trim());
    if (m) {
      entries.push({ n: m[1], u: m[2], c: category, d: m[3].trim().slice(0, 200) });
    }
  }
  return entries;
```

</details>

#### 缺口

- 版本质量门快照与完整评分方案未实现。
  **影响**：不计现有追溯/质量优势。
  **进一步探讨**：固定样本/故障mock比较接受与拒绝、字段覆盖/误荐和审查成本，无真实安装。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
