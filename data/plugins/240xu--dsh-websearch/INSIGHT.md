# @240xu/dsh-websearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[da42e44](https://github.com/240xu/dsh-websearch/tree/da42e44a0f54913e132c5219174a3b6f267188fc)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)
<!-- END META -->

> **实现功能**：为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。

> **核心亮点**：将多搜索服务、查询/结果策略与故障遥测接入一个宿主provider，减少使用者切换接线。详见[Q01](#research-q01)。

> **风险与缺陷**：缓存不含多项策略及端点，URL全小写去重可能误合并，历史留原始查询；备用实例还接收同一可选密钥。详见[Q04](#research-q04)。

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
  - [Q01 · 聚合搜索服务为谁解决什么问题？](#detail-section-11)
  - [Q02 · 查询从输入到结果如何流动？](#detail-section-12)
  - [Q03 · 凭据、宿主和服务端点有哪些条件？](#detail-section-13)
  - [Q04 · 去重、缓存与熔断如何影响结果可信度？](#detail-section-14)
  - [Q05 · 容错与隐私入口实现到了哪一步？](#detail-section-15)
  - [Q06 · 多后端的首次、持续与恢复成本如何估计？](#detail-section-16)
  - [Q07 · 如何采用，哪些方向值得继续探讨？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：公开资料检索希望减少后端切换并对单服务失败软降级。详见[Q01](#research-q01)。

面向DSH研究/检索用户，希望不在每次任务中手选搜索后端，并在个别网络或服务失败时仍取得候选来源。合格产物应是带真实来源URL的候选资料和可解释失败记录，读者仍需打开原始材料核实；多后端、多来源和原文正确性是不同目标。

插件向ctx.web注册单个unified provider，内部集成11后端，默认选四个无key路线。简单替代是单一可靠provider、已有搜索连接器或手工并行检索。贡献是宿主搜索接缝的一体化扇出、过滤/去重/可选重排、故障软降级和设置交接，不是自建搜索索引，也不是RRF原创。只注册一个自己的provider不能保证宿主没有其他provider，仍应显式选择unified，README“永远不歧义”不宜无条件采用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 搜索provider | 11后端聚合 | 外部服务及隐私 |
| 去重/重排/多查询 | 候选来源组织 | 不等事实验证 |
| 缓存/历史/健康 | 重复请求与诊断 | 策略失效/留存需明确 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| ctx.web与宿主peers | provider与设置 | API版本需匹配 |
| 已选择unified | 宿主搜索路由 | 自己单注册不排除其他provider |
| 外部服务/可选key | 搜索查询 | 公共实例可用/费用未知 |
| 受信端点与本地存储 | 查询/历史/缓存 | 敏感信息和策略需控制 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 指定provider与后端 | 用户 | 仅允许接收方 |
| 确定历史/缓存与预算 | 用户 | 敏感信息不留存 |
| 搜索并看失败遥测 | Agent | 不将空与失败混淆 |
| 阅读来源原文 | 读者 | 事实/时效可核实 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容宿主/后端账号 | 选择查询接收方、禁留存策略 | 需选择后端接收方/凭据及留存策略；初配费用未知 |
| 持续使用 | 变体×后端请求与模型费 | 等拖尾、复核原文，收益未知 | 变体乘后端及模型费依配置；拖尾/原文复核工时未知 |
| 失败恢复 | 清缓存/历史、认证换实例 | 复核错误合并和旧策略命中 | 历史/缓存/身份和错误合并处置金额与时间未知 |

#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 容错搜索 | 软失败/熔断/并发 | 不保证当前服务在线 |
| 结果组织 | URL/标题去重及RRF | 不等事实或召回正确 |
| 少重复请求 | 磁盘TTL缓存 | 策略指纹不完整 |

> **思考**：缓存不含多项策略及端点，URL全小写去重可能误合并，历史留原始查询；备用实例还接收同一可选密钥。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多搜索服务、查询/结果策略与故障遥测接入一个宿主provider，减少使用者切换接线。详见[Q01](#research-q01)。

将多搜索服务、查询/结果策略与故障遥测接入一个宿主provider，减少使用者切换接线。详见[Q01](#research-q01)。

模块化后处理与故障mock便于核查，实际历史route用新版宿主admission；需补策略失效、clear队列及混合空结果判据。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存不含多项策略及端点，URL全小写去重可能误合并，历史留原始查询；备用实例还接收同一可选密钥。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

非敏感公开查询小集合试用，先关多查询/深覆盖，严格流程关缓存并清历史，审阅备用实例。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/provider.js、package.json、lib/backends/searxng.js、lib/util/rank.js、lib/rrf.js、lib/cache.js、lib/history.js、tests/v286-failures.test.js、lib/trust.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定入口、全部provider、缓存键、历史/信任接线、排序/RRF、SearXNG关键链及故障测试；未穷尽全部后端/egress/浏览器，不执行目标。
- 下一步：进一步探讨应围绕本项假设执行固定输入与简单替代对照。可进一步研究完整策略指纹缓存、可追溯合并来源和预算约束扇出，把排序/去重/安全过滤/端点模型与身份版本纳入失效，合并保留所有原始URL证据链；查询计划在总费用/等待预算中自适应选路线。基线是当前固定扇出及单后端，固定测试集含大小写路径、同标题异文、safeSearch切换、端点切换和成功空+失败混合；比较查全、错误合并、费用与人工复核量。它是待验证假设，不能把更多结果等同更准，也不能把已有RRF算新算法。

**分析版本**

- **仓库**：[240xu/dsh-websearch](https://github.com/240xu/dsh-websearch)
- **版本号**：2.8.8（[固定提交 da42e44](https://github.com/240xu/dsh-websearch/tree/da42e44a0f54913e132c5219174a3b6f267188fc)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究完整策略指纹、合并来源链及总预算约束扇出，用固定反例比较误合并、召回与总成本。当前未验证。详见[Q07](#research-q07)。

进一步探讨应围绕本项假设执行固定输入与简单替代对照。可进一步研究完整策略指纹缓存、可追溯合并来源和预算约束扇出，把排序/去重/安全过滤/端点模型与身份版本纳入失效，合并保留所有原始URL证据链；查询计划在总费用/等待预算中自适应选路线。基线是当前固定扇出及单后端，固定测试集含大小写路径、同标题异文、safeSearch切换、端点切换和成功空+失败混合；比较查全、错误合并、费用与人工复核量。它是待验证假设，不能把更多结果等同更准，也不能把已有RRF算新算法。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1084 | — | — | 10398 |
| .js | source | 30 | 5615 | 3895 | 1343 | — |
| .mjs | test | 1 | 97 | 84 | 7 | — |
| .js | test | 17 | 2526 | 2182 | 315 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/240xu/dsh-websearch/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本聚合搜索如何联结多后端、容错和结果策略，查询隐私、缓存与去重边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合搜索服务为谁解决什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向DSH研究/检索用户，希望不在每次任务中手选搜索后端，并在个别网络或服务失败时仍取得候选来源。合格产物应是带真实来源URL的候选资料和可解释失败记录，读者仍需打开原始材料核实；多后端、多来源和原文正确性是不同目标。

插件向ctx.web注册单个unified provider，内部集成11后端，默认选四个无key路线。简单替代是单一可靠provider、已有搜索连接器或手工并行检索。贡献是宿主搜索接缝的一体化扇出、过滤/去重/可选重排、故障软降级和设置交接，不是自建搜索索引，也不是RRF原创。只注册一个自己的provider不能保证宿主没有其他provider，仍应显式选择unified，README“永远不歧义”不宜无条件采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-14](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/README.md#L6-L14)

当前固定版本复核。作者聚合和单provider主张。

```text
> Aggregated web search provider for [DeepSeek Harness](https://github.com/deepseek-ai/dsh) — one plugin id `unified` that fans out to eleven backends concurrently, merges + URL-dedups results, and stays usable even when some backends go down.

A pure-Cordis drop-in: registers ONE provider at `ctx.web` so the `dsh-web` selection rule never fires `WEB_PROVIDER_AMBIGUOUS`. Zero-config search out of the box (Exa + Parallel + DuckDuckGo + SearXNG are keyless); API-key backends (DeepSeek / Anthropic / OpenAI / Brave / Tavily / Serper / Mojeek) auto-activate once their key is supplied via the credentials service or env.

---

DSH（[DeepSeek Harness](https://github.com/deepseek-ai/dsh)）原生插件：向 `ctx.web` 注册**唯一**的聚合搜索 provider `unified`，内置十一后端并发 fan-out，合并 + URL 去重后返回——即使部分后端宕机仍可用。

纯 Cordis 直插：只注册一个 provider，所以 `dsh-web` 的选择规则永远不会触发 `WEB_PROVIDER_AMBIGUOUS`。**零配置即可搜索**——Exa + Parallel + DuckDuckGo + SearXNG 四者皆无 key、开箱即用；DeepSeek / Anthropic / OpenAI / Brave / Tavily / Serper / Mojeek 在提供 API key 后自动激活。
```

**依据 2 · 源码核查**：[lib/index.js:53-72](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/index.js#L53-L72)

当前固定版本复核。11注册后端与默认四项。

<details>
<summary>查看原文（20行）</summary>

```text
/** Full backend registry. Order = default fan-out priority. */
const BACKENDS = {
  exa: exaBackend,
  parallel: parallelBackend,
  ddg: ddgBackend,
  searxng: searxngBackend,
  brave: braveBackend,
  tavily: tavilyBackend,
  serper: serperBackend,
  mojeek: mojeekBackend,
  deepseek: deepseekBackend,
  anthropic: anthropicBackend,
  openai: openaiBackend,
};

/** All backend ids in registry order. */
const ALL_BACKENDS = Object.keys(BACKENDS);

/** Backends enabled by default (keyless only). */
const DEFAULT_ENABLED = ["exa", "parallel", "ddg", "searxng"];
```

</details>

**依据 3 · 源码核查**：[lib/index.js:439-455](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/index.js#L439-L455)

当前固定版本复核。仅注册自身provider。

<details>
<summary>查看原文（17行）</summary>

```text
  const provider = createUnifiedSearchProvider({
    ctx,
    resolveOptions: () => resolveOptions(ctx, current()),
    backends: BACKENDS,
    cache: {
      get: (key) => searchCache.get(key),
      set: (key, value) => searchCache.set(key, value),
    },
    history: {
      record: (entry) => {
        if (resolveOptions(ctx, current()).historyEnabled !== true) return;
        historyStore.record(entry);
      },
    },
  });

  ctx.web.registerSearchProvider(provider);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询从输入到结果如何流动？

**研究主题**：功能与机制

#### 完整回答

search首先读取配置和过滤项，shapeQuery归一并拒绝空查询；deepCoverage提高每后端抓取数，multiQuery默认关且要过复杂度门控。缓存按查询/过滤/数量/后端集合/mode查，命中可直接返回。未命中时按本地available选择并剔除熔断冷却项，所有候选都冷却则fail-open全部放行。每个查询变体内有并发限制与后端计时器，Promise.allSettled收集，调用者取消和后端超时分开处理。

只收HTTP(S)源，按URL或URL+标题去重，可选词匹配重排；多查询顺序执行各自扇出后用已有RRF融合，最后截断maxResults并加提示/遥测、写缓存与历史。部分后端失败而有来源时仍返回；全部成功空结果可正常返回，但源码仅在allFailures.length===0时处理空结果，若一项成功为空而另一项失败、所有来源为空，仍会抛“all enabled backends failed”，所以不能把这个错误文字当每项真的失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/provider.js:198-242](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L198-L242)

当前固定版本复核。输入、门控与缓存键。

<details>
<summary>查看原文（45行）</summary>

```text
    async search(request, signal) {
      throwIfSearchAborted(signal);
      const opts = resolveOptions();
      const filters = normalizeFilters({
      ...(opts.filters ?? {}),
      ...(request?.filters ?? {}),
      });
        let effReq = { ...request, maxResults: Math.max(1, Number(request?.maxResults) || opts.numResults || 8) };
      // 系统性查询整形（Tavily/Exa best practices）：扇出前对口语化查询做
      // 确定性归一 —— 剥离寒暄前缀、压缩空白、截断到 1500 字符；
      // 专名/版本号/日期原样保留，不改写语义。
      effReq.query = shapeQuery(effReq.query);
      // 2.8.2（P2）：整形后为空（"搜索"/"search" 等寒暄独词被剥光）→ 早拒。
      // 不拒会：①空串扇出全部后端 ②不同原始查询共享 "" 缓存键（别名污染）
      // ③落入 all-backends-failed(0) 的误导错误。
      if (!effReq.query) {
        throw new WebError(
          "unified search: empty query after shaping (the request contained only fillers like \"search\")",
          "WEB_PROVIDER_ERROR",
        );
      }
      if (Object.keys(filters).length > 0) effReq = { ...effReq, filters };
      const maxResults = effReq.maxResults;
      const concurrency = opts.concurrency ?? 6;
      const backendTimeoutMs = opts.backendTimeoutMs ?? 30000;

      // v2.8.0 coverage / multiQuery gates (both default OFF; arXiv:2404.01037
      // warns blind multi-query degrades, so the gate is deliberately strict).
      const coverage = opts.deepCoverage === true;
      // Per-backend widening: fetch more per backend, dedupe down afterwards.
      const backendMaxResults = coverage ? Math.ceil(maxResults * 1.5) : maxResults;
      const multi = opts.multiQueryEnabled === true && isComplexQuery(effReq.query);
      const variants = multi ? deriveSubQueries(effReq.query) : [effReq.query];
      // Cache-key mode marker: different coverage/multiQuery settings must not
      // serve each other's cached results.
      const cacheMode = (multi ? "multi" : "single") + (coverage ? "+coverage" : "");

      // v2.7.0 disk cache: keyed on (shaped query + filters + maxResults +
      // backends + mode). A hit short-circuits the fan-out entirely; sources
      // are byte-identical to the first search and content carries a
      // "cache hit, age Ns" note. Cache failures never break the search.
      const cacheEnabled = opts.cacheEnabled === true && cache;
      let cacheKey = null;
      if (cacheEnabled) {
        cacheKey = cacheKeyFor({ query: effReq.query, filters, maxResults, backends: opts.enabledBackends, mode: cacheMode });
```

</details>

**依据 2 · 源码核查**：[lib/provider.js:273-318](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L273-L318)

当前固定版本复核。冷却及限并发。

<details>
<summary>查看原文（46行）</summary>

```text
      // Pick enabled & available backends. With the breaker enabled, a
      // backend inside its 60s cooldown window is skipped (annotated in
      // telemetry as "id ⏸cooled"). Fail-open: if EVERY candidate is cooled,
      // run them all anyway — the breaker must never make search worse than
      // no breaker. The pick is shared by every query variant.
      const breakerCfg = opts.breakerEnabled === false ? null : {
        threshold: opts.breakerThreshold,
        cooldownMs: opts.breakerCooldownMs,
      };
      const nowMs = Date.now();
      const candidates = [];
      for (const id of opts.enabledBackends) {
        const be = backends[id];
        if (!be) continue;
        const beOpts = opts.backends?.[id] ?? {};
        const avail = be.available(beOpts);
        if (!avail) continue;
        candidates.push({ id, backend: be, beOpts });
      }
      const cooled = new Map();
      let eligible = candidates;
      if (breakerCfg) {
        const active = candidates.filter((c) => {
          if (isCooled(latestBackendHealth.get(c.id), nowMs)) {
            cooled.set(c.id, latestBackendHealth.get(c.id));
            return false;
          }
          return true;
        });
        if (active.length > 0) eligible = active;
        else cooled.clear(); // all cooled -> fail-open
      }

      if (eligible.length === 0) {
        throw new WebError(
          "unified search: no enabled backend is available (configure a backend or set an API key)",
          "WEB_PROVIDER_UNAVAILABLE",
        );
      }

      // Run ONE query variant through the full fan-out: breaker-aware backend
      // execution under the per-variant limiter, then PHASE 1 collect. The
      // internal abort/timeout semantics are unchanged from v2.7.
      const fanoutVariant = async (variantReq) => {
        const telemetry = [];
        const limit = createLimiter(concurrency);
```

</details>

**依据 3 · 源码核查**：[lib/provider.js:370-418](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L370-L418)

当前固定版本复核。allSettled和分查询去重融合。

<details>
<summary>查看原文（49行）</summary>

```text
        const results = await Promise.allSettled(
          eligible.map(({ id, backend, beOpts }) => {
            const hooks = {
              recordRequest: (req) => recordBackendRequest(ctx, id, req),
              recordOutcome: (out) => recordBackendOutcome(ctx, id, out),
            };
            return limit(() => runBackend({ id, backend, beOpts, hooks }));
          }),
        );
        throwIfSearchAborted(signal);
        const fold = collectFanoutResults(results, eligible, signal);
        return { ...fold, telemetry };
      };

      // Fan out per variant (sequential — the limiter already parallelizes
      // backends within a variant), dedupe/rank each list, then fuse.
      const perVariant = [];
      const allTelemetry = [];
      const allFailures = [];
      let hardError = null;
      for (const variantQuery of variants) {
        const variantReq = {
          ...effReq,
          query: variantQuery,
          maxResults: backendMaxResults,
          ...(coverage ? { deepCoverage: true } : {}),
        };
        const fold = await fanoutVariant(variantReq);
        allTelemetry.push(...fold.telemetry);
        allFailures.push(...fold.failures);
        if (fold.hardError !== null && hardError === null) hardError = fold.hardError;
        // Caller-cancellation check (hard abort fires before we yield results).
        if (signal?.aborted === true || fold.hardAborted) {
          throw searchAborted(signal);
        }
        // PHASE 2 dedupe / PHASE 3 rerank (per variant list, pre-fusion).
        const strategy = opts.dedupStrategy === "url+title" ? "url+title" : "url";
        const deduped = dedupeSources(fold.collected, strategy);
        const ordered = opts.rerank === true ? rerankSources(deduped, variantQuery) : deduped;
        perVariant.push({ query: variantQuery, ordered, mergedContent: fold.mergedContent });
      }

      // PHASE 4 fuse: multi-query mode fuses the per-variant ranked lists with
      // RRF (k=60); single-query mode keeps the historical behavior (the one
      // list, unchanged ordering).
      const orderedLists = perVariant.filter((v) => v.ordered.length > 0).map((v) => v.ordered);
      const ordered = multi
        ? rrfFuse(orderedLists).fused
        : (orderedLists[0] ?? []);
```

</details>

**依据 4 · 源码核查**：[lib/provider.js:476-520](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L476-L520)

当前固定版本复核。空成功条件与all-fail合成。

<details>
<summary>查看原文（45行）</summary>

```text
      // 2.8.2（P1）：零结果 ≠ 全部失败。所有后端成功但确实 0 条命中（冷僻查询/
      // 过滤后为空）时，原实现无条件落入下面的 throw，模型端拿到
      // `all enabled backends failed (0) - `（detail 空、计数自相矛盾），且丢弃已
      // 拿到的 mergedContent（如 Tavily 直答）。成功即空 → 正常返回空结果。
      if (allFailures.length === 0) {
        let emptyContent = perVariant.find((v) => v.mergedContent !== undefined)?.mergedContent;
        if (opts.resultHeader !== false && emptyContent !== undefined) {
          const header = resultHeader(typeof request?.query === "string" && /[\u4e00-\u9fff]/.test(request.query) ? "zh" : "en");
          emptyContent = header + "\n\n" + emptyContent;
        }
        history?.record({
          query: request?.query,
          time: Date.now(),
          resultCount: 0,
          backendsOk: allTelemetry.filter((t) => t.ok).length,
          backendsTotal: allTelemetry.length,
        });
        if (cacheKey && cache) cache.set(cacheKey, { sources: [], content: emptyContent, truncated: false });
        return {
          sources: [],
          ...(emptyContent !== undefined ? { content: emptyContent } : {}),
          truncated: false,
        };
      }

      // All attempted backends failed - synthesize one meaningful error that
      // names each backend's own reason so the caller (model or user) can act.
      // Reasons beyond MAX_FAILURE_DETAILS collapse into "+N more"; backends
      // that never ran (breaker cooldown) are named explicitly — without the
      // note "(N)" reads as "N enabled" when it means "N attempted" (route6).
      const detail = allFailures.slice(0, MAX_FAILURE_DETAILS)
        .map((f) => f.id + ": " + String(f.err instanceof Error ? f.err.message : f.err).slice(0, 120))
        .join("; ") + (allFailures.length > MAX_FAILURE_DETAILS ? `; +${allFailures.length - MAX_FAILURE_DETAILS} more` : "");
      const allKeyMissing =
        allFailures.length > 0 &&
        allFailures.every((f) => f.err instanceof WebError && (f.err.code === "WEB_PROVIDER_UNAVAILABLE" || f.err.code === "WEB_PROVIDER_CREDENTIAL_MISSING"));
      const hint = allKeyMissing
        ? " (every enabled backend is missing its API key - add keys in Settings > Web Search, or enable a keyless backend)"
        : "";
      const cooledNote = cooled.size > 0
        ? " (cooled-skipped: " + [...cooled].map(([cid, centry]) => cid + " " + (cooledAnnotation(centry, Date.now()) || "⏸cooled")).join(", ") + ")"
        : "";
      throw new WebError(
        `unified search: all enabled backends failed (${allFailures.length}) - ${detail}` + cooledNote + hint,
        "WEB_PROVIDER_ERROR",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据、宿主和服务端点有哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

package声明Node>=20.3，peer列web、cordis、schema、credentials/settings/launch-environment且全部星号，实际接口需匹配；入口强依赖web，settings/webServer可选晚挂载。配置按显式列表、true开关、环境列表、默认集顺序选后端，全开关false时会落回默认，不能据此禁用所有搜索。credentials存在时每次操作由其resolve，否则才读launch environment，缺key返回后端软错误，available本地判断不证明网络服务在线。

baseURL是操作员信任边界，会收到查询及对应密钥。provider校验主baseURL必须HTTPS或私网HTTP且无userinfo，但SearXNG还接受searxngBaseURLs列表，搜索逐项把同一可选API key作为Bearer发送；这组候选没有经过provider同一校验。配置备用实例必须按密钥接受方审阅，不能将列表只当无害可达性兜底。无key不是稳定免配额承诺，外部公共服务状态和付费条款需按采用时核实。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-53](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/package.json#L47-L53)

当前固定版本复核。不固定宿主peer范围。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-web": "*",
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/schemastery": "*",
    "@deepseek-ai/dsh-credentials": "*",
    "@deepseek-ai/dsh-settings": "*",
    "@deepseek-ai/dsh-launch-environment": "*"
```

**依据 2 · 源码核查**：[package.json:70-72](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/package.json#L70-L72)

当前固定版本复核。Node下限。

```text
  "engines": {
    "node": ">=20.3"
  }
```

**依据 3 · 源码核查**：[lib/index.js:283-345](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/index.js#L283-L345)

当前固定版本复核。选择优先级与凭据策略。

<details>
<summary>查看原文（63行）</summary>

```text
export function resolveOptions(ctx, config) {
  // 1. Determine enabled backends: explicit list > toggles > env > defaults
  let enabledBackends = [];

  if (config?.enabledBackends && config.enabledBackends.length > 0) {
    enabledBackends = config.enabledBackends.filter((id) => ALL_BACKENDS.includes(id));
  }

  if (enabledBackends.length === 0) {
    const toggleMap = {
      exa: config?.enableExa,
      parallel: config?.enableParallel,
      ddg: config?.enableDdg,
      searxng: config?.enableSearxng,
      brave: config?.enableBrave,
      tavily: config?.enableTavily,
      serper: config?.enableSerper,
      mojeek: config?.enableMojeek,
      deepseek: config?.enableDeepseek,
      anthropic: config?.enableAnthropic,
      openai: config?.enableOpenai,
    };
    enabledBackends = ALL_BACKENDS.filter((id) => toggleMap[id] === true);
  }

  if (enabledBackends.length === 0) {
    const envList = launchEnvironmentOf(ctx).get(ENABLED_ENV)?.value;
    if (envList && envList.length > 0) {
      enabledBackends = envList
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => ALL_BACKENDS.includes(s));
    }
  }

  if (enabledBackends.length === 0) {
    enabledBackends = [...DEFAULT_ENABLED];
  }

  // 2. Resolve each backend option
  const backends = {};
  for (const id of ALL_BACKENDS) {
    const keyEnvName = config?.[`${id}ApiKeyEnv`] ?? DEFAULT_KEY_ENV[id];
    const ref = credentialRef(keyEnvName);

    backends[id] = {
      apiKeyEnv: keyEnvName,
      baseURL: config?.[`${id}BaseURL`] ?? DEFAULT_BASE_URLS[id],
      model: config?.[`${id}Model`] ?? DEFAULT_MODELS[id],
      ...(id === "tavily" ? { searchDepth: config?.tavilySearchDepth ?? "basic" } : {}),
      ...(id === "searxng" ? {
        baseURLs: Array.isArray(config?.searxngBaseURLs)
          ? config.searxngBaseURLs.filter((u) => typeof u === "string" && u.trim() !== "")
          : [],
      } : {}),
      safeSearch: config?.safeSearch !== false,
      label: DEFAULT_LABELS[id] ?? id,
      requiresKey: DEFAULT_KEY_ENV[id] !== undefined,
      resolveApiKey: async () => {
        const credentials = ctx.get("credentials");
        if (credentials !== undefined) return (await credentials.resolve(ref))?.value;
        const ambient = launchEnvironmentOf(ctx).get(ref);
        return ambient !== undefined && ambient.value.length > 0 ? ambient.value : undefined;
```

</details>

**依据 4 · 源码核查**：[lib/provider.js:319-332](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L319-L332)

当前固定版本复核。只校验beOpts.baseURL。

<details>
<summary>查看原文（14行）</summary>

```text
        const runBackend = ({ id, backend, beOpts, hooks }) => {
          const startedAtMs = Date.now();
          // Trust boundary: baseURL is operator-configurable and API keys are sent to it.
          // Enforce http(s); plain http only for private hosts (self-hosted SearXNG).
          // Reject embedded credentials. Failure is a per-backend soft error.
          if (beOpts.baseURL !== undefined) {
            let bu = null;
            try { bu = new URL(beOpts.baseURL); } catch { bu = null; }
            const privHost = bu ? /^(localhost|127(\.\d{1,3}){3}|10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){3}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){3})$/.test(bu.hostname) : false;
            const schemeOk = bu && (bu.protocol === "https:" || (bu.protocol === "http:" && privHost));
            if (!schemeOk || bu.username || bu.password) {
              throw new WebError(`backend "${id}" has an invalid baseURL: https required (plain http only for private hosts), credentials-in-URL rejected`, "WEB_PROVIDER_ERROR");
            }
          }
```

</details>

**依据 5 · 源码核查**：[lib/backends/searxng.js:54-68](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/backends/searxng.js#L54-L68)

当前固定版本复核。主与备用候选统一进入queryInstance。

<details>
<summary>查看原文（15行）</summary>

```text
  async search(request, signal, options, hooks) {
    throwIfSearchAborted(signal);
    const backendOpts = options ?? {};
    const baseURL = backendOpts.baseURL ?? DEFAULT_SEARXNG_URL;
    const apiKey = await backendOpts.resolveApiKey?.(); // Optional for private instances

    const candidates = [];
    for (const candidate of [baseURL, ...(Array.isArray(backendOpts.baseURLs) ? backendOpts.baseURLs : [])]) {
      const trimmed = typeof candidate === "string" ? candidate.trim() : "";
      if (trimmed !== "" && !candidates.includes(trimmed)) candidates.push(trimmed);
    }

    // Single instance (the default): legacy path, unchanged semantics.
    if (candidates.length === 1) {
      const sources = await queryInstance(candidates[0], request, signal, backendOpts, apiKey, hooks);
```

</details>

**依据 6 · 源码核查**：[lib/backends/searxng.js:118-139](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/backends/searxng.js#L118-L139)

当前固定版本复核。候选URL和Bearer使用。

<details>
<summary>查看原文（22行）</summary>

```text
async function queryInstance(baseURL, request, signal, backendOpts, apiKey, hooks) {
  const url = new URL(baseURL);
  url.pathname = url.pathname.replace(/\/+$/,"") + "/search";
  url.searchParams.set("q", request.query);
  url.searchParams.set("format", "json");
  // deepCoverage widens the category sweep (docs.searxng.org Search API:
  // categories is a comma-separated list) — breadth over one category.
  url.searchParams.set("categories", request.deepCoverage === true ? "general,news,it" : "general");
  // Language: settings/request filter wins, else historical "en" default.
  const filters = normalizeFilters(request.filters);
  url.searchParams.set("language", filters.lang ?? "en");
  applySearxngFilters(url, filters); // time_range (+ language override)
  // Safe-search defaults ON (preserves the previous hardcoded behavior).
  url.searchParams.set("safesearch", safeSearchParams("searxng", backendOpts.safeSearch ?? true) ?? "1");
  url.searchParams.set("pageno", "1");

  const headers = {
    "Accept": "application/json",
    "User-Agent": "dsh-websearch/2.3",
  };
  if (apiKey) {
    headers["Authorization"] = "Bearer " + apiKey;
```

</details>

#### 缺口

- 全部外部搜索后端的当前服务可用性/计费/覆盖没有固定材料可证明
  **影响**：不能写11后端都可用或免费额度仍有效
  **进一步探讨**：按实际选中后端在采用时核对官方服务与账号额度；报告只保留源码支持的接线

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 去重、缓存与熔断如何影响结果可信度？

**研究主题**：缺陷与关键质疑

#### 完整回答

URL去重把完整URL转小写，域名不区分大小写合理但路径/查询可能区分，会合并本应不同的文档。可选标题去重以token Jaccard>=0.9视为同篇，可能把同标题不同证据合并；字段补全把不同来源的缺失片段拼到保留对象中，URL来源链不等独立内容验证。词重排为标题3/摘要2/URL1，并不评估证据权威或事实对错；RRF提高重复出现项，也可能放大同源转载。

缓存键包含后端集合却不含rerank、dedupStrategy、safeSearch、每后端baseURL/model/深度或凭据身份；设置变化后相同查询可能在TTL内复用旧策略、旧端点结果，缓存命中还在当前后端available之前。默认history开启，原始query和时间明文写本地50条，查询含个人/机密信息会留痕并已发给参与后端；关闭history不会自动清旧文件。健康和熔断是模块级按backend id共享，不能表示某个账号或端点此刻可达，fail-open也可能在全面故障时继续消耗请求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/util/rank.js:52-86](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/util/rank.js#L52-L86)

当前固定版本复核。全URL小写和标题相似合并。

<details>
<summary>查看原文（35行）</summary>

```text
export function dedupeSources(sources, strategy) {
  const out = [];
  const byUrl = new Map(); // urlKey -> kept source
  const keptTitles = [];   // [{ tokens }] only when strategy is url+title

  for (const s of sources ?? []) {
    if (!s || typeof s.url !== "string" || s.url.length === 0) continue;
    const key = s.url.toLowerCase();
    const existing = byUrl.get(key);
    if (existing) {
      if (!existing.title && s.title) existing.title = s.title;
      if (!existing.snippet && s.snippet) existing.snippet = s.snippet;
      if (!existing.publishedAt && s.publishedAt) existing.publishedAt = s.publishedAt;
      continue;
    }

    if (strategy === "url+title" && typeof s.title === "string" && s.title.length > 0) {
      const tokens = tokenize(s.title);
      const dupOf = keptTitles.find((k) => tokenSimilarity(k.tokens, tokens) >= TITLE_DUP_THRESHOLD);
      if (dupOf) {
        // Same story from another outlet: enrich the kept entry with any
        // fields the mirror carries and the original lacks.
        if (!dupOf.source.title && s.title) dupOf.source.title = s.title;
        if (!dupOf.source.snippet && s.snippet) dupOf.source.snippet = s.snippet;
        if (!dupOf.source.publishedAt && s.publishedAt) dupOf.source.publishedAt = s.publishedAt;
        continue;
      }
    }

    const copy = { ...s };
    byUrl.set(key, copy);
    out.push(copy);
    if (strategy === "url+title" && typeof s.title === "string" && s.title.length > 0) {
      // backfill this kept entry into its title bucket for later comparisons
      keptTitles.push({ tokens: tokenize(s.title), source: copy });
```

</details>

**依据 2 · 源码核查**：[lib/util/rank.js:92-120](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/util/rank.js#L92-L120)

当前固定版本复核。词匹配权重。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * Score one source against the query tokens:
 *   title match ×3, snippet match ×2, URL match ×1.
 */
function scoreSource(source, queryTokens) {
  let score = 0;
  const titleTokens = tokenize(source.title ?? "");
  const snippetTokens = tokenize(source.snippet ?? "");
  const urlTokens = tokenize(String(source.url ?? ""));
  for (const q of queryTokens) {
    if (titleTokens.has(q)) score += 3;
    if (snippetTokens.has(q)) score += 2;
    if (urlTokens.has(q)) score += 1;
  }
  return score;
}

/**
 * Deterministic relevance rerank. Stable sort by descending score; equal
 * scores keep their original relative order (fan-out priority wins ties).
 * Returns a fresh array; input untouched.
 */
export function rerankSources(sources, query) {
  const queryTokens = tokenize(query);
  if (queryTokens.size === 0 || !Array.isArray(sources)) return [...(sources ?? [])];
  return sources
    .map((s, index) => ({ s, index, score: scoreSource(s, queryTokens) }))
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .map((e) => e.s);
```

</details>

**依据 3 · 源码核查**：[lib/rrf.js:32-55](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/rrf.js#L32-L55)

当前固定版本复核。按位置累计RRF。

<details>
<summary>查看原文（24行）</summary>

```text
export function rrfFuse(lists, { k = RRF_K } = {}) {
  const kk = Number(k) > 0 ? Number(k) : RRF_K;
  const scores = new Map(); // key -> accumulated score
  const firstSeen = new Map(); // key -> source object (first metadata wins)
  const order = []; // keys in first-appearance order (stable ties)

  for (const list of Array.isArray(lists) ? lists : []) {
    if (!Array.isArray(list)) continue;
    for (let rank = 0; rank < list.length; rank++) {
      const item = list[rank];
      const key = itemKey(item);
      if (!key) continue;
      scores.set(key, (scores.get(key) ?? 0) + 1 / (kk + rank));
      if (!firstSeen.has(key)) {
        firstSeen.set(key, item);
        order.push(key);
      }
    }
  }

  const fused = [...order]
    .sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0))
    .map((key) => firstSeen.get(key));
  return { fused, scores };
```

</details>

**依据 4 · 源码核查**：[lib/cache.js:36-45](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/cache.js#L36-L45)

当前固定版本复核。缓存键具体维度。

<details>
<summary>查看原文（10行）</summary>

```text
export function cacheKeyFor({ query, filters, maxResults, backends, mode }) {
  const backendSet = Array.isArray(backends) ? [...backends].sort().join(",") : "";
  const canonical = JSON.stringify({
    q: typeof query === "string" ? query : "",
    f: filters ?? {},
    n: Number(maxResults) || 0,
    b: backendSet,
    m: typeof mode === "string" ? mode : "",
  });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 32);
```

</details>

**依据 5 · 源码核查**：[lib/provider.js:239-268](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L239-L268)

当前固定版本复核。查缓存发生在候选选择之前。

<details>
<summary>查看原文（30行）</summary>

```text
      const cacheEnabled = opts.cacheEnabled === true && cache;
      let cacheKey = null;
      if (cacheEnabled) {
        cacheKey = cacheKeyFor({ query: effReq.query, filters, maxResults, backends: opts.enabledBackends, mode: cacheMode });
        const hit = cache.get(cacheKey);
        if (hit && Array.isArray(hit.value?.sources) && hit.value.sources.length > 0) {
          // Defense in depth: the fresh path drops non-http(s) schemes before
          // merge; a tampered cache file must not bypass that whitelist.
          const safeSources = hit.value.sources.filter(
            (src) => src && typeof src.url === "string" && /^https?:\/\//i.test(src.url),
          );
          if (safeSources.length === 0) {
            // whole entry poisoned or filtered empty -> treat as a miss
            cacheKey = null;
          } else {
          let hitContent = typeof hit.value.content === "string" ? hit.value.content : undefined;
          const cacheNote = `[websearch cache] cache hit, age ${hit.age}s`;
          hitContent = hitContent === undefined ? cacheNote : hitContent + "\n\n" + cacheNote;
          history?.record({
            query: request?.query,
            time: Date.now(),
            resultCount: hit.value.sources.length,
            backendsOk: 0,
            backendsTotal: 0,
          });
          return {
            sources: safeSources,
            ...(hitContent !== undefined ? { content: hitContent } : {}),
            truncated: hit.value.truncated === true,
          };
```

</details>

**依据 6 · 源码核查**：[lib/provider.js:60-81](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L60-L81)

当前固定版本复核。全局按id健康。

<details>
<summary>查看原文（22行）</summary>

```text
// Module-level per-backend health telemetry (id -> entry), updated on every
// backend completion during a real search. Purely passive: nothing writes here
// outside search(), so the read-only /api/unified-search/health route can
// report the LAST known reachability without firing probes or burning quota.
// Entry shape: { ok: boolean, at: ms, ms: duration, count?: number,
//                error?: string (already truncated to 80), lastOkAt: ms|null }
const latestBackendHealth = new Map();

/** Read-only access for the health route (never mutate the returned map). */
export function getLatestBackendHealth() {
  return latestBackendHealth;
}

function recordBackendHealth(id, entry, breakerCfg) {
  const prev = latestBackendHealth.get(id);
  const breaker = foldBreaker(prev, entry.ok === true, entry.at, breakerCfg ?? undefined);
  latestBackendHealth.set(id, {
    ...entry,
    lastOkAt: entry.ok === true ? entry.at : (prev && prev.lastOkAt) || null,
    failCount: breaker.failCount,
    cooledUntil: breaker.cooledUntil,
  });
```

</details>

**依据 7 · 源码核查**：[lib/history.js:56-82](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/history.js#L56-L82)

当前固定版本复核。本地记录与上限。

<details>
<summary>查看原文（27行）</summary>

```text
  function atomicWriteAll(list) {
    mkdirSync(dir, { recursive: true });
    const f = file();
    const tmp = `${f}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(list, null, 2), "utf8");
    renameSync(tmp, f);
  }

  return {
    /** Append one search (best-effort; fs errors are swallowed). Newest first. */
    record(entry) {
      writeChain = writeChain.then(() => {
        try {
          const list = readAll();
          list.unshift(toPublicEntry(entry));
          if (list.length > cap) list.length = cap;
          atomicWriteAll(list);
        } catch {
          // history write failures are non-fatal by design
        }
      });
      return writeChain;
    },

    /** Read the current history, newest first (defensive copy). */
    list() {
      return readAll().slice(0, cap).map(toPublicEntry);
```

</details>

**依据 8 · 源码核查**：[lib/index.js:447-450](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/index.js#L447-L450)

当前固定版本复核。关闭仅阻止新记录。

```text
    history: {
      record: (entry) => {
        if (resolveOptions(ctx, current()).historyEnabled !== true) return;
        historyStore.record(entry);
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 容错与隐私入口实现到了哪一步？

**研究主题**：工程质量与复用

#### 完整回答

provider将解析、排序、过滤、缓存、历史、熔断和失败标签拆分；limiter使用Promise.resolve().then(fn)使同步异常也走finally释放位，避免旧式计数泄漏。HTTP(S)源白名单在新结果和缓存命中各检查一次，内部超时归为provider失败而不伪称用户取消。故障测试阅读显示用伪后端校验冷却跳过、错误计数与原因标签，这验证的是可检查分支设计，不是实际检索质量或11服务连通效果；本次未执行测试。

历史API当前调用trust.rejectionFor而不是同文件保留的旧isTrustedApiRequest，前者优先宿主connection admission，异常503拒绝，无服务才结构性回环/来源检查，不能仅看旧函数断言绕过宿主登录。历史clear直接unlink，不串在record的writeChain内，排队记录可以清除后又写回；查询删除收据不代表绝对持久删除。后端timeout靠AbortSignal合作，Promise.allSettled必须等实际promise完成，若后端/传输不响应abort，不能把计时器当强制截止。浏览器设置与全部egress/传输链本次未穷尽，不作完整安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/provider.js:97-121](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L97-L121)

当前固定版本复核。同步异常释放limiter。

<details>
<summary>查看原文（25行）</summary>

```text
export function createLimiter(concurrency) {
  const queue = [];
  let running = 0;
  
  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      process();
      
      function process() {
        while (running < concurrency && queue.length > 0) {
          const { fn, resolve, reject } = queue.shift();
          running++;
          // 2.8.2（P1）：必须 .then(fn) 而非 Promise.resolve(fn())——后者先执行
          // fn()，同步抛出（如 runBackend 的 baseURL 校验在创建 timeout 之前 throw）
          // 会逃出本函数：running 已 ++ 却永不 --（finally 没挂上），leaked 计数
          // ≥ concurrency 后所有后续任务永久排队，且 timeoutId 未创建 → 超时也救不了
          // （实测全挂起 exit=13）。.then(fn) 把同步抛出转为 rejection 落进 finally。
          Promise.resolve().then(fn).then(resolve).catch(reject).finally(() => {
            running--;
            process();
          });
        }
      }
    });
```

</details>

**依据 2 · 源码核查**：[lib/provider.js:333-379](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L333-L379)

当前固定版本复核。协作abort与等待全部settled。

<details>
<summary>查看原文（47行）</summary>

```text
          const controller = new AbortController();
          const mergedSignal = signal
            ? AbortSignal.any([signal, controller.signal])
            : controller.signal;
          const effectiveTimeoutMs = effectiveBackendTimeoutMs(id, backendTimeoutMs);
          const timeoutId = setTimeout(() => controller.abort(), effectiveTimeoutMs);
          return backend
            .search(variantReq, mergedSignal, beOpts, hooks)
            .then(
              (value) => {
                telemetry.push({ id, ok: true, ms: Date.now() - startedAtMs, count: value?.sources?.length ?? 0 });
                recordBackendHealth(id, { ok: true, at: Date.now(), ms: Date.now() - startedAtMs, count: value?.sources?.length ?? 0 }, breakerCfg);
                return value;
              },
              (err) => {
                // Timeout classification happens BEFORE telemetry/health are
                // recorded (route6 P6): backends surface an internal timeout
                // as their own abort-flavored error ("unified search aborted",
                // raw AbortError, …), so the old code recorded that text in
                // the telemetry line and health payload even though the final
                // thrown error said "timed out after Nms" — the two disagreed
                // and "(unified search aborted)" read as if the USER cancelled.
                const timedOut = controller.signal.aborted && !(signal && signal.aborted);
                const reason = timedOut
                  ? `backend "${id}" timed out after ${effectiveTimeoutMs}ms`
                  : String(err instanceof Error ? err.message : err);
                const msg = reason.slice(0, 80);
                telemetry.push({ id, ok: false, ms: Date.now() - startedAtMs, error: msg });
                recordBackendHealth(id, { ok: false, at: Date.now(), ms: Date.now() - startedAtMs, error: msg }, breakerCfg);
                throw timedOut
                  ? new WebError(reason, "WEB_PROVIDER_ERROR", { cause: err instanceof Error ? err : undefined })
                  : err;
              },
            )
            .finally(() => clearTimeout(timeoutId));
        };

        const results = await Promise.allSettled(
          eligible.map(({ id, backend, beOpts }) => {
            const hooks = {
              recordRequest: (req) => recordBackendRequest(ctx, id, req),
              recordOutcome: (out) => recordBackendOutcome(ctx, id, out),
            };
            return limit(() => runBackend({ id, backend, beOpts, hooks }));
          }),
        );
        throwIfSearchAborted(signal);
```

</details>

**依据 3 · 源码核查**：[tests/v286-failures.test.js:40-83](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/tests/v286-failures.test.js#L40-L83)

当前固定版本复核。冷却和错误汇总mock测试。

<details>
<summary>查看原文（44行）</summary>

```text
test("all-fail error: cooled-skipped backends are named and >4 reasons collapse to '+N more'", async () => {
  // Seed a cooled backend (as if 3 prior failures tripped the breaker).
  const health = getLatestBackendHealth();
  health.set("cooledA", { ok: false, at: Date.now(), ms: 100, error: "prior failure", failCount: 3, cooledUntil: Date.now() + 60_000 });

  const failing = (id) => ({
    id,
    requiresCredential: false,
    available: () => true,
    async search() { throw new WebError("reason for " + id, "WEB_PROVIDER_ERROR"); },
  });
  const backends = {
    cooledA: failing("cooledA"),
    boom1: failing("boom1"),
    boom2: failing("boom2"),
    boom3: failing("boom3"),
    boom4: failing("boom4"),
    boom5: failing("boom5"),
  };
  const provider = createUnifiedSearchProvider({
    ctx: {},
    resolveOptions: () => ({
      enabledBackends: Object.keys(backends),
      numResults: 4,
      backends: {},
      ctx: {},
      breakerEnabled: true,
    }),
    backends,
  });
  try {
    await assert.rejects(
      provider.search({ query: "route6 cooled probe", maxResults: 4 }, undefined),
      (err) => {
        assert.equal(err.code, "WEB_PROVIDER_ERROR");
        assert.match(err.message, /all enabled backends failed \(5\)/, "5 attempted failures counted");
        assert.match(err.message, /cooled-skipped: cooledA ⏸cooled/, "cooled backend named");
        assert.match(err.message, /\+1 more/, "5th failure collapsed into a marker");
        assert.match(err.message, /boom1: reason for boom1/, "first reasons still enumerated");
        return true;
      },
    );
  } finally {
    health.delete("cooledA");
```

</details>

**依据 4 · 源码核查**：[lib/history.js:65-91](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/history.js#L65-L91)

当前固定版本复核。record队列与clear不共队列。

<details>
<summary>查看原文（27行）</summary>

```text
    /** Append one search (best-effort; fs errors are swallowed). Newest first. */
    record(entry) {
      writeChain = writeChain.then(() => {
        try {
          const list = readAll();
          list.unshift(toPublicEntry(entry));
          if (list.length > cap) list.length = cap;
          atomicWriteAll(list);
        } catch {
          // history write failures are non-fatal by design
        }
      });
      return writeChain;
    },

    /** Read the current history, newest first (defensive copy). */
    list() {
      return readAll().slice(0, cap).map(toPublicEntry);
    },

    /** Empty the history (removes the file; best-effort). */
    clear() {
      try {
        if (existsSync(file())) unlinkSync(file());
      } catch {
        // nothing to do
      }
```

</details>

**依据 5 · 源码核查**：[lib/history.js:150-161](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/history.js#L150-L161)

当前固定版本复核。实际route用rejectionFor。

<details>
<summary>查看原文（12行）</summary>

```text
export function registerHistoryRoutes(ws, { getStore, getBackendHealth, getConnection }) {
  if (!ws || typeof ws.register !== "function") return;
  const send = (res, code, body) => {
    res.writeHead(code, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  const guarded = (handler) => (req, res) => {
    const rejection = rejectionFor(req, typeof getConnection === "function" ? getConnection() : undefined);
    if (rejection !== undefined) {
      send(res, rejection, { ok: false, error: rejection === 503 ? "admission unavailable" : "untrusted request" });
      return;
    }
```

</details>

**依据 6 · 源码核查**：[lib/trust.js:82-119](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/trust.js#L82-L119)

当前固定版本复核。宿主admission优先及异常拒绝。

<details>
<summary>查看原文（38行）</summary>

```text
export function rejectionFor(req, connection, onRejection) {
  let decision
  try {
    // Hosts before dsh 0.1.7 publish the same decision under the older name
    // `requestRejection` (issue #89): `admit` is undefined there, and the
    // service *exists*, so an empty read must fall through to that method —
    // treating it as a fault turned every request into 503 admission
    // unavailable. The return value is a bare status on that spelling and an
    // `{rejection}` envelope on `admit`.
    const admit = connection?.admit
    if (typeof admit === 'function') {
      const admission = admit.call(connection, req)
      const status = admission && typeof admission === 'object' ? admission.rejection : undefined
      if (status === undefined) return undefined
      decision = { status, source: 'connection', reason: 'host-rejected' }
    } else {
      const reject = connection?.requestRejection
      if (typeof reject === 'function') {
        const status = reject.call(connection, req)
        if (status === undefined) return undefined
        decision = { status, source: 'connection', reason: 'host-rejected' }
      }
    }
  } catch {
    // Never bypass browser authentication when a mounted Host service fails.
    decision = { status: 503, source: 'connection', reason: 'admission-error' }
  }
  if (decision === undefined) {
    const reason = structuralReason(req)
    if (reason === undefined) return undefined
    decision = { status: 403, source: 'structural', reason }
  }
  try {
    onRejection?.(decision)
  } catch {
    // Diagnostics are observational; a logger cannot change the HTTP decision.
  }
  return decision.status
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 多后端的首次、持续与恢复成本如何估计？

**研究主题**：效果与总成本

#### 完整回答

首次要确认ctx.web选择unified、宿主peer兼容、准许查询发送的服务和需要的key；公共实例无key仍需网络/服务许可，不能照搬README价格。持续调用数约为变体数乘参与后端数，deepCoverage还会提高结果抓取，多查询变体顺序执行，单变体等所有后端settled，因此并发不等最快一项返回。DDG/SearXNG有效单后端上限分别8秒/5秒，其他30秒默认；限并发队列和变体数量会增加整体等待。

缓存可减少相同策略重复请求，熔断可暂时跳过失败后端，但没有统一总预算或费用账单；多模型后端还可能有自己的生成及服务费用。人工仍需读原文、检查去重误合并、与已知答案比较遗漏。恢复成本包括换公共实例、重新认证、调预算、清缓存/历史并确认没有写回；实际召回提升、可信来源比例、现金和模型总token节省未知，不填写假定收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/provider.js:44-52](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L44-L52)

当前固定版本复核。特定后端超时上限。

```text
const BACKEND_TIMEOUT_OVERRIDES_MS = {
  ddg: 8000,
  searxng: 5000,
};

/** Effective per-backend timeout = min(override ?? ∞, global). Exported for tests. */
export function effectiveBackendTimeoutMs(id, backendTimeoutMs) {
  const override = BACKEND_TIMEOUT_OVERRIDES_MS[id];
  return Number.isFinite(override) ? Math.min(override, backendTimeoutMs) : backendTimeoutMs;
```

**依据 2 · 源码核查**：[lib/provider.js:224-230](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L224-L230)

当前固定版本复核。覆盖/多查询带来的扩展。

```text
      // v2.8.0 coverage / multiQuery gates (both default OFF; arXiv:2404.01037
      // warns blind multi-query degrades, so the gate is deliberately strict).
      const coverage = opts.deepCoverage === true;
      // Per-backend widening: fetch more per backend, dedupe down afterwards.
      const backendMaxResults = coverage ? Math.ceil(maxResults * 1.5) : maxResults;
      const multi = opts.multiQueryEnabled === true && isComplexQuery(effReq.query);
      const variants = multi ? deriveSubQueries(effReq.query) : [effReq.query];
```

**依据 3 · 源码核查**：[lib/provider.js:384-418](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L384-L418)

当前固定版本复核。变体顺序且内部扇出。

<details>
<summary>查看原文（35行）</summary>

```text
      // Fan out per variant (sequential — the limiter already parallelizes
      // backends within a variant), dedupe/rank each list, then fuse.
      const perVariant = [];
      const allTelemetry = [];
      const allFailures = [];
      let hardError = null;
      for (const variantQuery of variants) {
        const variantReq = {
          ...effReq,
          query: variantQuery,
          maxResults: backendMaxResults,
          ...(coverage ? { deepCoverage: true } : {}),
        };
        const fold = await fanoutVariant(variantReq);
        allTelemetry.push(...fold.telemetry);
        allFailures.push(...fold.failures);
        if (fold.hardError !== null && hardError === null) hardError = fold.hardError;
        // Caller-cancellation check (hard abort fires before we yield results).
        if (signal?.aborted === true || fold.hardAborted) {
          throw searchAborted(signal);
        }
        // PHASE 2 dedupe / PHASE 3 rerank (per variant list, pre-fusion).
        const strategy = opts.dedupStrategy === "url+title" ? "url+title" : "url";
        const deduped = dedupeSources(fold.collected, strategy);
        const ordered = opts.rerank === true ? rerankSources(deduped, variantQuery) : deduped;
        perVariant.push({ query: variantQuery, ordered, mergedContent: fold.mergedContent });
      }

      // PHASE 4 fuse: multi-query mode fuses the per-variant ranked lists with
      // RRF (k=60); single-query mode keeps the historical behavior (the one
      // list, unchanged ordering).
      const orderedLists = perVariant.filter((v) => v.ordered.length > 0).map((v) => v.ordered);
      const ordered = multi
        ? rrfFuse(orderedLists).fused
        : (orderedLists[0] ?? []);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:431-437](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/index.js#L431-L437)

当前固定版本复核。缓存历史磁盘位置。

```text
  const storeDir = resolveStoreDir();
  const searchCache = createSearchCache({
    dir: path.join(storeDir, "results"),
    ttlMs: () => resolveOptions(ctx, current()).cacheTtlS * 1000,
    maxEntries: CACHE_DEFAULTS.maxEntries,
  });
  const historyStore = createHistoryStore({ dir: storeDir, maxEntries: HISTORY_MAX_ENTRIES });
```

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 如何采用，哪些方向值得继续探讨？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议非敏感公开查询、小后端集合且缓存/历史策略明确后试用，先保持multiQuery和deepCoverage关闭，选定可接受接收方，再比较单一provider和聚合结果。对于机密查询、严格安全搜索或必须实时更换端点的流程，应先关缓存/历史并清旧数据，备用SearXNG按主端点同样审阅；不要只靠设置保存就假定缓存策略立即生效。停止条件包括错误合并大小写路径、过滤不符、端点变更仍命旧缓存或清历史后写回。

可进一步研究完整策略指纹缓存、可追溯合并来源和预算约束扇出，把排序/去重/安全过滤/端点模型与身份版本纳入失效，合并保留所有原始URL证据链；查询计划在总费用/等待预算中自适应选路线。基线是当前固定扇出及单后端，固定测试集含大小写路径、同标题异文、safeSearch切换、端点切换和成功空+失败混合；比较查全、错误合并、费用与人工复核量。它是待验证假设，不能把更多结果等同更准，也不能把已有RRF算新算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cache.js:36-45](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/cache.js#L36-L45)

当前固定版本复核。当前策略指纹不全。

<details>
<summary>查看原文（10行）</summary>

```text
export function cacheKeyFor({ query, filters, maxResults, backends, mode }) {
  const backendSet = Array.isArray(backends) ? [...backends].sort().join(",") : "";
  const canonical = JSON.stringify({
    q: typeof query === "string" ? query : "",
    f: filters ?? {},
    n: Number(maxResults) || 0,
    b: backendSet,
    m: typeof mode === "string" ? mode : "",
  });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 32);
```

</details>

**依据 2 · 源码核查**：[lib/util/rank.js:57-76](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/util/rank.js#L57-L76)

当前固定版本复核。合并丢失独立来源的具体机制。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const s of sources ?? []) {
    if (!s || typeof s.url !== "string" || s.url.length === 0) continue;
    const key = s.url.toLowerCase();
    const existing = byUrl.get(key);
    if (existing) {
      if (!existing.title && s.title) existing.title = s.title;
      if (!existing.snippet && s.snippet) existing.snippet = s.snippet;
      if (!existing.publishedAt && s.publishedAt) existing.publishedAt = s.publishedAt;
      continue;
    }

    if (strategy === "url+title" && typeof s.title === "string" && s.title.length > 0) {
      const tokens = tokenize(s.title);
      const dupOf = keptTitles.find((k) => tokenSimilarity(k.tokens, tokens) >= TITLE_DUP_THRESHOLD);
      if (dupOf) {
        // Same story from another outlet: enrich the kept entry with any
        // fields the mirror carries and the original lacks.
        if (!dupOf.source.title && s.title) dupOf.source.title = s.title;
        if (!dupOf.source.snippet && s.snippet) dupOf.source.snippet = s.snippet;
        if (!dupOf.source.publishedAt && s.publishedAt) dupOf.source.publishedAt = s.publishedAt;
```

</details>

**依据 3 · 源码核查**：[lib/provider.js:476-520](https://github.com/240xu/dsh-websearch/blob/da42e44a0f54913e132c5219174a3b6f267188fc/lib/provider.js#L476-L520)

当前固定版本复核。成功空+失败混合的判据。

<details>
<summary>查看原文（45行）</summary>

```text
      // 2.8.2（P1）：零结果 ≠ 全部失败。所有后端成功但确实 0 条命中（冷僻查询/
      // 过滤后为空）时，原实现无条件落入下面的 throw，模型端拿到
      // `all enabled backends failed (0) - `（detail 空、计数自相矛盾），且丢弃已
      // 拿到的 mergedContent（如 Tavily 直答）。成功即空 → 正常返回空结果。
      if (allFailures.length === 0) {
        let emptyContent = perVariant.find((v) => v.mergedContent !== undefined)?.mergedContent;
        if (opts.resultHeader !== false && emptyContent !== undefined) {
          const header = resultHeader(typeof request?.query === "string" && /[\u4e00-\u9fff]/.test(request.query) ? "zh" : "en");
          emptyContent = header + "\n\n" + emptyContent;
        }
        history?.record({
          query: request?.query,
          time: Date.now(),
          resultCount: 0,
          backendsOk: allTelemetry.filter((t) => t.ok).length,
          backendsTotal: allTelemetry.length,
        });
        if (cacheKey && cache) cache.set(cacheKey, { sources: [], content: emptyContent, truncated: false });
        return {
          sources: [],
          ...(emptyContent !== undefined ? { content: emptyContent } : {}),
          truncated: false,
        };
      }

      // All attempted backends failed - synthesize one meaningful error that
      // names each backend's own reason so the caller (model or user) can act.
      // Reasons beyond MAX_FAILURE_DETAILS collapse into "+N more"; backends
      // that never ran (breaker cooldown) are named explicitly — without the
      // note "(N)" reads as "N enabled" when it means "N attempted" (route6).
      const detail = allFailures.slice(0, MAX_FAILURE_DETAILS)
        .map((f) => f.id + ": " + String(f.err instanceof Error ? f.err.message : f.err).slice(0, 120))
        .join("; ") + (allFailures.length > MAX_FAILURE_DETAILS ? `; +${allFailures.length - MAX_FAILURE_DETAILS} more` : "");
      const allKeyMissing =
        allFailures.length > 0 &&
        allFailures.every((f) => f.err instanceof WebError && (f.err.code === "WEB_PROVIDER_UNAVAILABLE" || f.err.code === "WEB_PROVIDER_CREDENTIAL_MISSING"));
      const hint = allKeyMissing
        ? " (every enabled backend is missing its API key - add keys in Settings > Web Search, or enable a keyless backend)"
        : "";
      const cooledNote = cooled.size > 0
        ? " (cooled-skipped: " + [...cooled].map(([cid, centry]) => cid + " " + (cooledAnnotation(centry, Date.now()) || "⏸cooled")).join(", ") + ")"
        : "";
      throw new WebError(
        `unified search: all enabled backends failed (${allFailures.length}) - ${detail}` + cooledNote + hint,
        "WEB_PROVIDER_ERROR",
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
