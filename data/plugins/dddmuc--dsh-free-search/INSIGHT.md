# DSH Free Search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[11b4b8c](https://github.com/DDDMUC/dsh-free-search/tree/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5)

<!-- BEGIN META -->
[![GitHub ★ 1,069](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C069&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DDDMUC/dsh-free-search) [![npm 30d 110,276](https://img.shields.io/static/v1?label=npm+30d&message=110%2C276&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-search)
<!-- END META -->

> **功能**：为 DSH 提供多引擎网页搜索、可配置回退与分层网页提取。

> **亮点**：把引擎选择、失败分流和实际来源放进同一个 DSH 搜索接口，便于单源失败时继续定位文档，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：并发预算到期不能证明供应商停止计量。直连的地址校验也未自动应用到浏览器及外部提取，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 什么时候多引擎比单一 DSH 搜索供应商有用？](#detail-section-11)
  - [Q02 · 顺序回退与 Multi 并发怎样失败或超时？](#detail-section-12)
  - [Q03 · 提取 URL 的直连防护能否覆盖浏览器和外部抓取？](#detail-section-13)
  - [Q04 · 怎样验证检索有效，何时应切回单引擎？](#detail-section-14)
  - [Q05 · 按请求显示完整供应商轨迹能否减少错误归因？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合常用 DSH 查跨语言公开文档，且需要核对来源的开发者，见 [Q01](#research-q01)。

保留一个熟悉的宿主 provider，失败时手工换搜索源并阅读原文。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索 provider | 顺序或并发查询多个引擎 | 失败可停，需核对当前 provider |
| 网页提取 | 从 URL 获取内容 | 直连和其他层的网络边界不同 |
| 插件设置 | 调整引擎和提取选项 | 需相应宿主界面服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、Node 20 与 settings | 加载及配置所需 | 注册 provider 及运行时选择 | 需核对是否仍使用原 provider |
| 可达搜索供应商 | 查询必需 | 取得公开文档来源 | 限流、认证或超时进入失败分支 |
| 系统浏览器和外部 Key | 对应提取层可选 | 渲染或外部提取 | 未配置则跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制 profile 并限制引擎和层 | 明确目标为公开文档 |
| 执行 | 用已知答案题组检索 | 核对实际引擎和原文 |
| 退出 | 请求或结果出界时恢复原 provider | 手工核对原文 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和可选凭据 | 配置允许范围 | 工时未知 |
| 持续 | 多次外部请求、模型和缓存 | 查出处及失败路由 | 单位合格回答费用未知 |
| 恢复 | 查询重做或切换来源 | 复核配置和请求实际状态 | 截止不等于请求停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源搜索 | 顺序回退、并发与结果来源 | 质量提升及稳定性 |
| 提取 | 直连、浏览器和第三方路径 | 各层的实际网络行为 |

> **思考**：并发预算到期不能证明供应商停止计量。直连的地址校验也未自动应用到浏览器及外部提取，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把引擎选择、失败分流和实际来源放进同一个 DSH 搜索接口，便于单源失败时继续定位文档，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

回退分类及显示实际引擎有助定位。并发截止和请求终止应分别审视，直连和浏览器的网络边界也不同，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

并发预算到期不能证明供应商停止计量。直连的地址校验也未自动应用到浏览器及外部提取，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

关闭用不到的提取层，在独立 profile 从公开文档、一个允许的引擎开始。记录实际来源和请求数，出界就恢复原选择，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持可配置路由、回退与部分结果。供应商可用、页面质量、费用和运行网络边界需分别验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/index.js、package.json、lib/fetch_provider.js、lib/ssrf.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对 provider、顺序和并发路由、代表提取路径。未安装或访问任何引擎，未逐个审计供应商与研究工具。
- 下一步：用限定公开文档题组比较单源与回退，并以隔离端点检查超时后的请求和网络路径。

**分析版本**

- **仓库**：[DDDMUC/dsh-free-search](https://github.com/DDDMUC/dsh-free-search)
- **版本号**：0.9.43（[固定提交 11b4b8c](https://github.com/DDDMUC/dsh-free-search/tree/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

增加逐次尝试与终态轨迹，验证用户能否更快识别失败来源并避免无效重试，见 [Q05](#research-q05)。

用限定公开文档题组比较单源与回退，并以隔离端点检查超时后的请求和网络路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1521 | — | — | 27866 |
| .js | source | 60 | 15944 | 13394 | 2064 | — |
| .mjs | source | 63 | 6330 | 5269 | 661 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/DDDMUC/dsh-free-search/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定多引擎如何接管 DSH 搜索，失败、并发和抓取条件怎样影响文档检索。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么时候多引擎比单一 DSH 搜索供应商有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常需要在 DSH 查中文与英文官方文档的开发者，遇到单搜索源失效时，可以在同一个调用入口借助候选引擎和回退。实际挂载同时注册搜索和提取 provider，搜索设置为空或仍为官方默认时尝试修改宿主设置，已显式选其他 provider 则记录提示而不替换。因而安装成功不等于当前搜索使用它。合格任务应得到能打开且支持回答的官方链接，来源增加只代表候选增加，质量还需按原文核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-32](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/README.md#L21-L32)

作者定位与目标摩擦。

<details>
<summary>查看原文（12行）</summary>

```text
### 谁需要它

如果你：

- 没有（或不想）配置 DeepSeek 官方 key，用第三方模型供应商发现无法搜索
- 虽然配置了官 key，但用的明明是第三方模型供应商，结果 DeepSeek 账户却依旧扣费

这一切都是因为 dsh 默认的搜索 provider 依赖 DeepSeek 官方 API key（`DEEPSEEK_API_KEY`）。没有配置官 key，内置搜索就会失败；配置了官 key，即使用第三方模型供应商，搜索时也会使用官方渠道，产生隐形扣费。

这个插件就是来解决这些问题的：它提供多个免费引擎 + 自动回退，让 DSH 彻底摆脱 DeepSeek 官方 key 的依赖。

### 特性
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:15-33](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/cordis.patch.yml#L15-L33)

不静态写搜索选择，改走运行时。

<details>
<summary>查看原文（19行）</summary>

```text
# NOTE (2026-10, issue #51): this bundle does NOT touch `web.searchProvider`.
# The plugin takes the search provider over at runtime instead — when the field
# is unset or still the shipped default (`deepseek-official`) it points it at its
# own provider id (`ddg`); when another provider was chosen explicitly it leaves
# it alone and only warns.
#
# A static `- id: web  config: searchProvider: ddg` used to live here. It was
# removed because it created a dangling reference: a patch replaces the whole
# row config, so rows that came from a *disabled* or skipped plugin left
# `searchProvider: ddg` behind while nothing registered `ddg` — every web search
# then failed with `configured web provider "ddg" is not registered`. Leaving the
# base default (`deepseek-official`) in place means a disabled plugin degrades to
# the official provider instead of breaking search outright.
- insert:
    - id: web-search-free
      name: dsh-free-search
      config:
        disabledEngines: []
        bingMarket: zh-CN
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2943-2957](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2943-L2957)

实际注册搜索与提取 provider。

<details>
<summary>查看原文（15行）</summary>

```text
  registerOnce(() => ctx.web.registerSearchProvider(provider), provider, "search provider");

  // web_fetch 质量链接管：注册 fs-quality-fetch（直连 → exa contents → firecrawl → crawl4ai），
  // 未设置 fetchProviderId、或仍是出厂默认 http 时接管；已被显式指向其他 provider 时不抢占。
  // 与 web_search 的接管规则同构：运行时兜底，不依赖 bundle patch 是否落地。
  const fetchProvider = createFetchProvider({
    resolveApiKey,
    logger,
    // #92：web_fetch 不经过 searchOnce，所以这里按当前配置现算，而不是复用上次搜索留下的值。
    acceptLanguage: () => acceptLanguageFor(current()),
    browserEnabled: () => current().browserFetch !== false,
    prefer: () => (current().fetchPrefer === "firecrawl" ? "firecrawl" : "exa"),
    allowedCidrs: () => current().allowFakeIpCidrs ?? [],
  });
  registerOnce(() => ctx.web.registerFetchProvider(fetchProvider), fetchProvider, "fetch provider");
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2988-3016](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2988-L3016)

运行时选择及设置服务缺失分支。

<details>
<summary>查看原文（29行）</summary>

```text
    //  - 已被显式指向其他 provider：不抢占，只警告并给出切换用的 YAML。
    // 这样即使用户把插件当普通依赖手工安装（bundle patch 未生效）、或 profile patch
    // 整体覆盖 config 抹掉了 searchProvider，搜索也不会静默退回官方导致"余额不足"。
    const searchSelection = providerSelection(ctx.web, "searchProvider");
    if (!searchSelection.current || searchSelection.current === OFFICIAL_SEARCH_PROVIDER_ID) {
      takeOverOps(ctx.web, "searchProvider", provider.id, ops);
      logOnce(
        logger,
        "info",
        searchSelection.current === undefined || searchSelection.current === null
          ? `free-search: web.searchProvider was unset, taking over as "${provider.id}"`
          : `free-search: taking over from the default provider "${searchSelection.current}" as "${provider.id}"`
      );
    } else if (searchSelection.current !== provider.id) {
      logOnce(
        logger,
        "warn",
        `free-search: search is served by provider "${searchSelection.current}", not "${provider.id}" — web_search will NOT use this plugin. ` +
          `Add this to the profile's cordis.patch.yml (patch replaces the whole entry config, so keep any other web.* fields):\n` +
          `- id: web\n  config:\n    searchProvider: ${provider.id}\n    fetchProvider: http`
      );
    }

    if (ops.length === 0) return;
    if (typeof sctx.settings?.mutate !== "function") {
      logger.warn("free-search: cannot take over the web providers — the settings service is unavailable");
      return;
    }
    void Promise.resolve(sctx.settings.mutate("web", ops)).catch((error) => {
```

</details>

#### 缺口

- 跨语言的同任务链接召回和可读性无独立对照
  **影响**：无法量化多引擎收益
  **进一步探讨**：使用已知主站、目标版本和发布日期的文档任务比较

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 顺序回退与 Multi 并发怎样失败或超时？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

顺序模式读取用户偏好、禁用项、回退顺序和语言池等配置，Auto 以语言与时间条件编排。遇到失败会分类，调整凭据或冷却，非限流的瞬态失败可重试一次；空结果或错误类别不允许回退时主动停，所有引擎失败会报错。成功结果标实际来源且可缓存，回退结果 TTL 缩短。Multi 先选可用引擎，未显式指定时按配置限制数量，并发等待与整次截止竞争，截止后已有结果可用，其余标超时。该段 Promise.race 只保证返回时间边界，未把截止信号传给各 runEngineTest，不能以已返回断言各供应商都停止计量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2550-2589](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2550-L2589)

配置、偏好及缓存入口。

<details>
<summary>查看原文（40行）</summary>

```text
    async searchOnce(request, signal) {
      // 公共咽喉校验：web_search / advanced_search / raw-search 三条路径都经过这里
      if (request === null || typeof request !== "object" || typeof request.query !== "string" || request.query.trim().length === 0) {
        throw new Error("query is required");
      }
      const cfg = current();
      // #72：本次请求生效的域名黑名单（模块级活动值；各结果咽喉点过滤读取它）
      setActiveBlockedDomains(cfg.blockedDomains);
      // #92：Accept-Language 跟随 lang（显式 bingMarket 优先），不再固定中文
      setActiveAcceptLanguage(acceptLanguageFor(cfg));
      setActiveOutputLanguage(outputLanguage(configLanguage(cfg)));
      const disabledEngines = effectiveDisabledEngines(cfg);
      const fallbackOnSet = new Set(normalizeFallbackOn(cfg.fallbackOn));
      const disabledSet = new Set(disabledEngines);
      const configuredFallbackOrder = Array.isArray(cfg.fallbackOrder) ? cfg.fallbackOrder : [];
      const customFallbackOrder = hasCustomFallbackOrder(configuredFallbackOrder);
      const fallbackOrder = normalizeFallbackOrder(configuredFallbackOrder);
      // 首选引擎：free_search 工具显式指定（request.engine）优先于设置（cfg.provider）
      const preferred =
        typeof request.engine === "string" && (ALL_ENGINES.includes(request.engine) || request.engine === "auto" || request.engine === "multi")
          ? request.engine
          : cfg.provider || autoDefaultProvider;
      // time_range 过滤（仅 advanced_search 工具透传；标准 web_search 无此参数）
      // 保留原始字符串用于 Note 展示；raw-search 桥可能已把 timeRange 解析成对象
      const timeRange = parseTimeRange(request.timeRange);
      const timeRangeLabel = typeof request.timeRange === "string" ? request.timeRange : String(timeRange?.days ?? timeRange?.after ?? "");

      // 缓存 TTL（分钟，0-5 可配置）；cache=false 或 ttl<=0 时完全禁用
      const cacheTtlMs = (Math.min(Math.max(Number(cfg.cacheTtl) ?? 5, 0), 5)) * 60 * 1000;
      const cacheEnabled = cfg.cache !== false && cacheTtlMs > 0;
      const cacheKey = cacheEnabled
        ? buildCacheKey(request.query, request.maxResults, timeRangeLabel, preferred, disabledEngines, fallbackOrder, cfg.blockedDomains, cfg.multiMaxEngines, cfg.multiMinSources)
        : null;
      if (cacheKey !== null) {
        const hit = searchCache.get(cacheKey);
        if (hit && hit.expiresAt > Date.now()) {
          if (signal?.aborted) throw new Error("search aborted");
          searchCache.delete(cacheKey);
          searchCache.set(cacheKey, hit);
          // #72：缓存命中同样过一遍黑名单——首版修复前写入的缓存里可能残留屏蔽域名
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2595-2648](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2595-L2648)

Multi 失败后的降级及顺序候选。

<details>
<summary>查看原文（54行）</summary>

```text
      let multiFailure = null;
      if (preferred === "multi") {
        if (typeof runMultiSearch !== "function") throw new Error("multi search is not initialized");
        try {
          const multi = await runMultiSearch({ query: request.query, maxResults: request.maxResults, timeRange: request.timeRange });
          const providerSources = (multi.sources ?? []).map(({ seenIn, ...source }) => source);
          const cached = { ...multi, sources: providerSources, provider: "multi_search", engine: "multi" };
          if (cacheKey !== null) {
            searchCache.set(cacheKey, { value: cached, expiresAt: Date.now() + cacheTtlMs });
            if (searchCache.size > CACHE_MAX_ENTRIES) {
              const oldest = searchCache.keys().next().value;
              if (oldest !== undefined) searchCache.delete(oldest);
            }
          }
          return { ...cached, _cache: "miss" };
        } catch (error) {
          // Multi 失败不直接让搜索失败：记录原因后回退到普通单引擎链（Note 里会说明）。
          multiFailure = error instanceof Error ? error.message : String(error);
          logger.warn(`free-search: multi search failed (${multiFailure}), falling back to the single-engine chain`);
        }
      }

      let chain;
      let preferredSkippedReason = null;
      if (preferred === "auto") {
        // 语言分池（评审意见 B 恢复）：routeHead = 查询语言对应池；不可用的池引擎在链上自然跳过
        chain = routeEngines(request.query, {
          timeRange: Boolean(timeRange),
          disabledEngines,
          allowedEngines: cfg.allowedEngines,
          fallbackOrder: customFallbackOrder ? fallbackOrder : [],
          zhPool: Array.isArray(cfg.zhPool) ? cfg.zhPool : undefined,
          enPool: Array.isArray(cfg.enPool) ? cfg.enPool : undefined,
        });
      } else {
        const enabledOrder = enabledEngines(disabledEngines, fallbackOrder, cfg.allowedEngines);
        if (disabledSet.has(preferred)) preferredSkippedReason = "disabled";
        if (timeRange) {
          const timeEngines = enabledOrder.filter((engine) => TIME_ENGINES.includes(engine));
          const preferredFirst = [preferred].filter((engine) => !disabledSet.has(engine) && TIME_ENGINES.includes(engine));
          const otherTime = timeEngines.filter((engine) => engine !== preferred);
          const noTime = enabledOrder.filter((engine) => !TIME_ENGINES.includes(engine) && engine !== preferred);
          chain = [...preferredFirst, ...otherTime, ...noTime];
          if (!disabledSet.has(preferred) && !TIME_ENGINES.includes(preferred)) preferredSkippedReason = "time-filter";
        } else {
          const preferredFirst = disabledSet.has(preferred) ? [] : [preferred];
          const others = enabledOrder.filter((engine) => engine !== preferred && !EXPLICIT_ONLY_ENGINES.includes(engine));
          chain = [...preferredFirst, ...others];
        }
      }
      const degoogReady = Array.isArray(cfg.degoogInstances) && cfg.degoogInstances.some((entry) => String(entry ?? "").trim() !== "");
      // degoog 是自建实例：没配实例时不进自动链（显式选择仍会给出明确报错）
      chain = [...new Set(chain)].filter((engine) => !disabledSet.has(engine) && (engine !== "degoog" || degoogReady || engine === preferred));
      if (chain.length === 0) throw new Error("all search engines are disabled");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2719-2755](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2719-L2755)

成功输出供应商、回退原因和 TTL。

<details>
<summary>查看原文（37行）</summary>

```text
          if (result.sources.length > 0) {
            usedEngine = engine;
            clearCooldown(engine);
            // 统一清洗 snippet：去登录/付费墙/订阅噪音，折叠空白（有值的才处理，保持 lossless JSON）
            result.sources = result.sources.map((s) =>
              s.snippet ? { ...s, snippet: cleanSnippet(s.snippet, snippetCap(engine)) } : s
            );
            // 用了非首选引擎时，在结果里附上准确提示（区分"不支持时间过滤被跳过"与"真实失败"）。
            // provider=auto 时 preferred 不是引擎而是路由模式：命中的引擎由 provider 字段体现，
            // 不能再套用 X-failed 句式（否则每次 auto 搜索都会附带一条假失败提示）。
            if (engine !== preferred && preferred !== "auto") {
              if (preferredSkippedReason === "disabled") {
                result.content = `Note: ${preferred} is disabled by configuration, using ${engine}.`;
              } else if (preferredSkippedReason === "time-filter") {
                result.content = `Note: ${preferred} does not support time filtering (timeRange=${timeRangeLabel}), using ${engine}.`;
              } else if (preferredFailure) {
                const label = FAILURE_CLASS_LABELS[preferredFailureClass] ?? FAILURE_CLASS_LABELS.unknown;
                result.content = `Note: ${preferred} ${label} (${preferredFailure}), using ${engine}.`;
              } else {
                result.content = `Note: ${preferred} unavailable or failed, using ${engine}.`;
              }
            }
            // 写入缓存（只缓存成功结果，失败走 throw 天然不缓存）
            const cached = { ...result, provider: engine, engine: engine };
            if (cacheKey !== null) {
              // fallback 条目（实际引擎≠首选）用配置 TTL 的 1/5，首选成功保持完整 TTL
              const entryTtlMs = engine !== preferred ? Math.max(cacheTtlMs / 5, 1000) : cacheTtlMs;
              searchCache.set(cacheKey, {
                value: cached,
                expiresAt: Date.now() + entryTtlMs,
              });
              if (searchCache.size > CACHE_MAX_ENTRIES) {
                const oldest = searchCache.keys().next().value;
                if (oldest !== undefined) searchCache.delete(oldest);
              }
            }
            return { ...cached, _cache: "miss" };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2757-2794](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2757-L2794)

空结果、瞬态重试、冷却及失败结束。

<details>
<summary>查看原文（38行）</summary>

```text
          lastError = new Error(`engine "${engine}" returned 0 results`);
          if (engine === preferred) { preferredFailure = "returned 0 results"; preferredFailureClass = "invalid-response"; }
          if (!fallbackOnSet.has("invalid-response")) {
            blockedFailure = { engine, failure: { class: "invalid-response", message: "returned 0 results" } };
            logger.warn('free-search: ' + engine + ' returned 0 results and "invalid-response" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: ${engine} returned 0 results, trying next engine`);
        } catch (error) {
          lastError = error;
          const failure = classifyFailure(error);
          const message = redactSecrets(failure.message, environmentSecrets());
          if (engine === preferred) { preferredFailure = message; preferredFailureClass = failure.class; }
          const keyStillUsable = coolKeysForEngine(engine, failure.class, failure.message, failure.rateLimited);
          if (!keyStillUsable) applyFailureCooldown(engine, failure.class, failure.rateLimited, failure.message);
          // transient（超时/5xx/网络）：同引擎重试一次再回退，避免一次抖动丢掉好引擎；
          // 限流（rateLimited）不重试——短窗内再发必再撞，已设 60s 冷却
          if (failure.class === "transient" && !failure.rateLimited && !retriedEngines.has(engine)) {
            retriedEngines.add(engine);
            logger.warn(`free-search: engine "${engine}" failed [transient] (${message}), retrying once`);
            chain.splice(qi + 1, 0, engine);
            continue;
          }
          if (!fallbackOnSet.has(failure.class)) {
            blockedFailure = { engine, failure: { ...failure, message } };
            logger.warn('free-search: engine "' + engine + '" failed [' + failure.class + '] (' + message + ') and "' + failure.class + '" is not in fallbackOn, stopping');
            break;
          }
          logger.warn(`free-search: engine "${engine}" failed [${failure.class}] (${message}), trying next engine`);
        }
      }
      if (blockedFailure) {
        throw new Error(
          'search stopped after "' + blockedFailure.engine + '" failed: ' + blockedFailure.failure.message +
            ' — the failure class "' + blockedFailure.failure.class + '" is not enabled in fallbackOn, so no other engine was tried'
        );
      }
      throw lastError ?? new Error("all search engines failed");
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3323-3359](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L3323-L3359)

并发范围、整次预算和部分结果。

<details>
<summary>查看原文（37行）</summary>

```text
    const { eligible, missing: missingKeys } = explicitEngines
      ? { eligible: targetEngines, missing: [] }
      : partitionByCredentials(targetEngines, (engine) => availability.get(engine) !== false);

    // #69 §1：并发上限（天花板，不是配额）。仅在未显式指定 engines 时对语言池生效——
    // 调用方点名要哪几个引擎时尊重原意，不再用配置上限二次裁剪。
    const cfgMulti = current();
    const selectedEngines = explicitEngines
      ? targetEngines
      : selectEngines(eligible, cfgMulti.multiMaxEngines);
    const minSources = explicitEngines ? 1 : resolveMinSources(cfgMulti.multiMinSources, selectedEngines.length);

    const enginesUsed = [];
    const enginesEmpty = []; // 没报错但一条结果都没返回（与 failed 区分：它是"成功地什么都没给"）
    const failedEngines = [];
    // 缺凭据的引擎不再占用一次请求，但仍要出现在备注里，让用户看得见它为什么没跑
    const skipped = missingKeys.slice();
    const attemptedEngines = [];
    // #69 §3：整次 multi 也有总预算——并发扇出与后面的串行补跑都不允许无限拖长。
    // 到点时**已返回的引擎照常入账**（部分结果优先），未返回的记为 timeout。
    const multiDeadlineAt = Date.now() + SEARCH_BUDGET_MS;
    const outcomes = [];
    const runEngine = async (engine) => {
      attemptedEngines.push(engine);
      try {
        outcomes.push({ engine, res: await runEngineTest(engine, q, timeRange, limit) });
      } catch (error) {
        outcomes.push({ engine, res: { ok: false, error: error instanceof Error ? error.message : String(error) } });
      }
    };
    await Promise.race([
      Promise.all(selectedEngines.map(runEngine)),
      new Promise((resolve) => setTimeout(resolve, Math.max(0, multiDeadlineAt - Date.now()))),
    ]);
    const settledEngines = new Set(outcomes.map((o) => o.engine));
    for (const engine of selectedEngines) {
      if (!settledEngines.has(engine)) failedEngines.push(`${engine} [timeout] (search budget exceeded)`);
```

</details>

#### 缺口

- 不同供应商在整次预算后是否继续收取请求费用未知
  **影响**：前端超时不能用于推断实际费用
  **进一步探讨**：用测试端点记录并发调用开始、结束与返回，核对预算前后的调用次数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提取 URL 的直连防护能否覆盖浏览器和外部抓取？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

提取先要求 HTTPS 并验证初始地址，直连用受限 DNS 查询拒绝私网。若直连内容不达标，可进入无头浏览器再到外部提取供应商。浏览器使用独立临时配置，以 --no-sandbox 启动并拿原始 URL，调用处没有把直连的安全 lookup 交给浏览器。外部供应商使用各自凭据及边界。源码只支持分别评估各层，不能以直连防护推断浏览器重定向和子资源都受同样约束。用于试用的 profile 应明确限制目标为公开文档，并关闭不需要的浏览器抓取。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:58-66](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/package.json#L58-L66)

声明 Node 版本与宿主 peer。

```text
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-ui-commands": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-renderer": "^0.1.7-rc.1 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-settings": "^0.1.7-rc.1 || ^0.2.0-rc.1",
```

**依据 2 · 源码核查**：[lib/fetch_provider.js:309-345](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/fetch_provider.js#L309-L345)

初始 URL、直连查询与浏览器交替。

<details>
<summary>查看原文（37行）</summary>

```text
  return {
    id: "fs-quality-fetch",
    /** 廉价本地可用性检查（seam 契约要求，禁止网络调用）。 */
    available() { return true; },
    async fetch(request, signal) {
      const url = String(request?.url || "");
      if (!/^https:\/\//i.test(url)) throw new Error(`fs-quality-fetch: only https URLs are supported (got "${url.slice(0, 60)}")`);
      // SSRF guard: never fetch loopback / private / metadata addresses, and use a
      // lookup that re-checks every redirect hop. Explicitly allowed CIDRs cover
      // transparent-proxy fake-ip ranges (Clash/mihomo 198.18.0.0/15).
      const allowed = allowedCidrs();
      await validateUrl(url, { allowedCidrs: allowed });
      const errors = [];

      // T1：直连（文本类内容；二进制交给后层——exa 取正文，PDF 等仍由 firecrawl 处理）
      try {
        const r = await httpsGetFollow(url, { headers: browserishHeaders(acceptLanguage()), signal, lookup: makeSafeLookup(allowed) });
        if (r.status < 400 && TEXTUAL.test(r.contentType) && r.text.length >= T1_MIN_CHARS) {
          return { url: r.url, statusCode: r.status, body: { kind: "html", content: stripLoneSurrogates(r.text) }, truncated: false };
        }
        if (r.status >= 400) errors.push(`direct HTTP ${r.status}`);
        else errors.push(`direct: ${r.contentType || "unknown type"} ${r.text.length}B`);
      } catch (e) { errors.push(`direct: ${e.message}`); }

      // T1.5：系统浏览器无头渲染（执行 JS 过挑战，抓直连拿不到的页面；无浏览器或设置里关掉时跳过）
      const browserPath = findSystemBrowser();
      if (browserEnabled() && browserPath) {
        try {
          const html = await browserDumpDom(browserPath, url, { signal });
          if (html && html.length >= T1_MIN_CHARS && !/403 Forbidden|\bcaptcha\b/i.test(html.slice(0, 3000))) {
            return { url, statusCode: 200, body: { kind: "html", content: stripLoneSurrogates(html) }, truncated: false };
          }
          errors.push(html ? `browser: short or challenge page (${html.length}B)` : "browser: no output (timeout or launch failure)");
        } catch (e) {
          errors.push(`browser: ${e.message}`);
        }
      }
```

</details>

**依据 3 · 源码核查**：[lib/fetch_provider.js:47-71](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/fetch_provider.js#L47-L71)

浏览器实际命令和参数。

<details>
<summary>查看原文（25行）</summary>

```text
function browserDumpDom(browserPath, url, { timeoutMs = 25000, signal } = {}) {
  return new Promise((resolve) => {
    // 独立 user-data-dir：避免与用户正在运行的浏览器实例抢同一 profile（共享 profile 时无输出/立即退出）
    let tmpDir;
    let child;
    try {
      tmpDir = mkdtempSync(join(tmpdir(), "dshfs-browser-"));
      child = spawn(browserPath, [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-sandbox",
        // 抑制崩溃上报/组件更新/账号同步：Windows 实测这些会在 tmp profile 下反复报错
        // （Crashpad settings.dat 写入失败、get_updates failed）并偶发导致退出码异常/无输出
        "--disable-breakpad",
        "--disable-crashpad",
        "--disable-component-update",
        "--disable-sync",
        `--user-data-dir=${tmpDir}`,
        "--dump-dom",
        "--virtual-time-budget=10000",
        url,
        // POSIX 下让浏览器自立进程组：killTree 才能整组杀（渲染子进程随组一起走），
        // 也不会被宿主的 Ctrl+C 误伤（浏览器生命周期由本函数自己管）。
      ], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true, detached: process.platform !== "win32" });
```

</details>

**依据 4 · 源码核查**：[lib/ssrf.js:116-136](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/ssrf.js#L116-L136)

直接 DNS 地址检查。

<details>
<summary>查看原文（21行）</summary>

```text
/** dns.lookup replacement that refuses to connect to private addresses (redirects included). */
export function makeSafeLookup(allowedCidrs = []) {
  const allowedList = buildAllowedList(allowedCidrs);
  return function lookup(hostname, options, callback) {
    const host = bareHost(hostname);
    dns.lookup(host, { ...options, all: true }, (error, addresses) => {
      if (error) {
        callback(error);
        return;
      }
      const list = Array.isArray(addresses) ? addresses : [];
      const blocked = list.find((entry) => !isPublicAddress(entry.address, { allowedList }));
      if (blocked) {
        callback(new Error(`SSRF blocked: ${host} resolves to private address ${blocked.address}`));
        return;
      }
      if (options?.all) {
        callback(null, list);
        return;
      }
      callback(null, list[0]?.address, list[0]?.family);
```

</details>

**依据 5 · 源码核查**：[lib/fetch_provider.js:347-366](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/fetch_provider.js#L347-L366)

外部供应商的 Key 条件。

<details>
<summary>查看原文（20行）</summary>

```text
      // T2/T3：exa 与 firecrawl 的先后顺序可在设置页切换；crawl4ai 固定最后。
      const exaTier = async () => {
        const exaKey = await resolveApiKey("EXA_API_KEY", "exaApiKey").catch(() => undefined);
        if (!exaKey) return null;
        try {
          const text = await callExa(url, exaKey, signal);
          if (text.trim().length >= T1_MIN_CHARS) return { url, statusCode: 200, body: { kind: "text", content: stripLoneSurrogates(text) }, truncated: false };
          errors.push("exa: short content");
        } catch (e) { errors.push(`exa: ${e.message}`); }
        return null;
      };
      const firecrawlTier = async () => {
        const firecrawlKey = await resolveApiKey("FIRECRAWL_API_KEY", "firecrawlApiKey").catch(() => undefined);
        if (!firecrawlKey) return null;
        try {
          const md = await callFirecrawl(url, firecrawlKey, signal);
          if (md.trim().length >= T1_MIN_CHARS) return { url, statusCode: 200, body: { kind: "text", content: stripLoneSurrogates(md) }, truncated: false };
          errors.push("firecrawl: short content");
        } catch (e) { errors.push(`firecrawl: ${e.message}`); }
        return null;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2948-2956](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2948-L2956)

浏览器路径可按配置控制。

```text
  const fetchProvider = createFetchProvider({
    resolveApiKey,
    logger,
    // #92：web_fetch 不经过 searchOnce，所以这里按当前配置现算，而不是复用上次搜索留下的值。
    acceptLanguage: () => acceptLanguageFor(current()),
    browserEnabled: () => current().browserFetch !== false,
    prefer: () => (current().fetchPrefer === "firecrawl" ? "firecrawl" : "exa"),
    allowedCidrs: () => current().allowFakeIpCidrs ?? [],
  });
```

#### 缺口

- 没有验证浏览器路径的重定向、子资源或部署网络策略
  **影响**：不能确认各层的内网访问边界一致
  **进一步探讨**：在隔离网络以可控页面记录重定向和子资源访问

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证检索有效，何时应切回单引擎？

**研究主题**：效果与总成本、采用判断

#### 完整回答

在独立 profile 先固定一组已知答案的公开文档问题，从一个允许的引擎开始，再开启有限回退。逐条核对结果链接、版本和出处，记录一次合格回答经过几个供应商、用了多少人工复查及返回时间。并发搜索可能发出多个请求，有凭据的抓取与可选重排也增加资源，固定材料没有当前价格与费用实测。日志和结果标实际供应商有助于诊断。若出现与允许范围不符的请求、来源不支持结论、回退反复失败或请求数不可控，就恢复原 provider 选择并手工核对。README 说明会写 profile，因此卸载后仍应核对设置，而不是只看插件列表。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:212-239](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/README.md#L212-L239)

作者说明重启与接管落盘。

<details>
<summary>查看原文（28行）</summary>

````text
### 安装

需要 **DSH 0.2.1-rc.2 或更新的 0.2.x**；更早的 0.1.x 宿主不满足 `engines.dsh`，插件管理器会拒绝安装。

```sh
git clone https://github.com/DDDMUC/dsh-free-search.git
dsh plugin --profile web add /path/to/dsh-free-search
```

然后重启：

```sh
dsh web
```

#### 接管行为与验证

插件加载后**自动接管搜索**：

- `web.searchProvider` 未设置，或仍是 DSH 出厂默认的官方搜索 `deepseek-official` 时，自动切换为本插件的 provider（id 固定为 `ddg`）；
- 如果（你或别的插件）已显式选择其他 provider，本插件不抢占，只在启动日志输出 WARN 与切换用的 YAML。

**接管会写进 profile（DSH 0.2.x）**：从 `0.2.0-rc.2` 起 provider 选择存放在 config 的 volatile ref 里，只能经 `settings.mutate("web", …)` 写入，落盘结果就是 `profiles/<profile>/cordis.patch.yml` 多出：

```yaml
- id: web
  config:
    searchProvider: ddg
````

</details>

**依据 2 · 源码核查**：[lib/index.js:2726-2748](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2726-L2748)

返回实际引擎和回退原因。

<details>
<summary>查看原文（23行）</summary>

```text
            // 用了非首选引擎时，在结果里附上准确提示（区分"不支持时间过滤被跳过"与"真实失败"）。
            // provider=auto 时 preferred 不是引擎而是路由模式：命中的引擎由 provider 字段体现，
            // 不能再套用 X-failed 句式（否则每次 auto 搜索都会附带一条假失败提示）。
            if (engine !== preferred && preferred !== "auto") {
              if (preferredSkippedReason === "disabled") {
                result.content = `Note: ${preferred} is disabled by configuration, using ${engine}.`;
              } else if (preferredSkippedReason === "time-filter") {
                result.content = `Note: ${preferred} does not support time filtering (timeRange=${timeRangeLabel}), using ${engine}.`;
              } else if (preferredFailure) {
                const label = FAILURE_CLASS_LABELS[preferredFailureClass] ?? FAILURE_CLASS_LABELS.unknown;
                result.content = `Note: ${preferred} ${label} (${preferredFailure}), using ${engine}.`;
              } else {
                result.content = `Note: ${preferred} unavailable or failed, using ${engine}.`;
              }
            }
            // 写入缓存（只缓存成功结果，失败走 throw 天然不缓存）
            const cached = { ...result, provider: engine, engine: engine };
            if (cacheKey !== null) {
              // fallback 条目（实际引擎≠首选）用配置 TTL 的 1/5，首选成功保持完整 TTL
              const entryTtlMs = engine !== preferred ? Math.max(cacheTtlMs / 5, 1000) : cacheTtlMs;
              searchCache.set(cacheKey, {
                value: cached,
                expiresAt: Date.now() + entryTtlMs,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3327-3359](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L3327-L3359)

并发成本的直接来源。

<details>
<summary>查看原文（33行）</summary>

```text
    // #69 §1：并发上限（天花板，不是配额）。仅在未显式指定 engines 时对语言池生效——
    // 调用方点名要哪几个引擎时尊重原意，不再用配置上限二次裁剪。
    const cfgMulti = current();
    const selectedEngines = explicitEngines
      ? targetEngines
      : selectEngines(eligible, cfgMulti.multiMaxEngines);
    const minSources = explicitEngines ? 1 : resolveMinSources(cfgMulti.multiMinSources, selectedEngines.length);

    const enginesUsed = [];
    const enginesEmpty = []; // 没报错但一条结果都没返回（与 failed 区分：它是"成功地什么都没给"）
    const failedEngines = [];
    // 缺凭据的引擎不再占用一次请求，但仍要出现在备注里，让用户看得见它为什么没跑
    const skipped = missingKeys.slice();
    const attemptedEngines = [];
    // #69 §3：整次 multi 也有总预算——并发扇出与后面的串行补跑都不允许无限拖长。
    // 到点时**已返回的引擎照常入账**（部分结果优先），未返回的记为 timeout。
    const multiDeadlineAt = Date.now() + SEARCH_BUDGET_MS;
    const outcomes = [];
    const runEngine = async (engine) => {
      attemptedEngines.push(engine);
      try {
        outcomes.push({ engine, res: await runEngineTest(engine, q, timeRange, limit) });
      } catch (error) {
        outcomes.push({ engine, res: { ok: false, error: error instanceof Error ? error.message : String(error) } });
      }
    };
    await Promise.race([
      Promise.all(selectedEngines.map(runEngine)),
      new Promise((resolve) => setTimeout(resolve, Math.max(0, multiDeadlineAt - Date.now()))),
    ]);
    const settledEngines = new Set(outcomes.map((o) => o.engine));
    for (const engine of selectedEngines) {
      if (!settledEngines.has(engine)) failedEngines.push(`${engine} [timeout] (search budget exceeded)`);
```

</details>

**依据 4 · 作者声明**：[README.md:78-89](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/README.md#L78-L89)

作者说明分层抓取和研究工具边界。

<details>
<summary>查看原文（12行）</summary>

```text
#### 抓取与工具

- **网页抓取（web_fetch）** —— 让 agent 抓取网页内容（官方 `dsh-web-fetch-http` provider，纯 JS，零额外依赖），可自动接管 `web.fetchProvider` 为插件的直连 → 浏览器渲染 → exa / firecrawl → crawl4ai 质量链。T1.5 浏览器渲染可在设置页关闭，exa 与 firecrawl 的先后顺序也可切换；私网、回环和云元数据地址一律拒绝（SSRF 防护）。Clash / mihomo TUN 的 fake-ip 网段（常见 198.18.0.0/15）可在「额外允许的网段」里显式放行，否则系统 DNS 返回的占位地址会被当成私网拒绝。

<img src="https://raw.githubusercontent.com/DDDMUC/dsh-free-search/master/assets/ui-fetch.png" alt="抓取与平台：web_fetch 接管、Key 存储位置与平台搜索开关" width="100%" />
<sub>▲ 抓取：自动接管 web_fetch、Key 存储位置与平台搜索开关</sub>

- **平台搜索（platform_search）** —— 搜 GitHub / V2EX / B站 / Reddit / Hacker News / Stack Overflow / 维基百科 / npm / YouTube / Vimeo / 掘金 / 豆瓣 / Qiita（公开 API 或免 key 抓取，零依赖）；X (Twitter) 经本地 Grok Build CLI（需 SuperGrok / X Premium 登录）。
- **垂直领域直查（domain_search）** —— 41 个免 key 垂直源直查：包/版本（PyPI、crates、GitHub releases、endoflife…）、学术（arXiv、Crossref、OpenAlex、Semantic Scholar、PubMed、dblp、Zenodo…）、安全（NVD、OSV、CISA KEV）、金融（SEC EDGAR、IMF、World Bank、CFETS、Yahoo Finance、CoinGecko…）、法律（US Federal Register、US CourtListener、openlegaldata、UK legislation）、新闻（Google News、GDELT）等。
- **视频搜索（video_search）** —— 跨站找视频：Bing Videos + DuckDuckGo Videos（免 key，失败互相回退），返回视频链接、标题与来源/时长等元信息。
- **一次调用完成研究（research）** —— 多引擎并发搜索 → 候选重排 → 分层抓取正文 → 段落选窗 → 带出处的 Markdown 证据包；模型组件（重排/嵌入/决策模型）全部可选，缺失或失败时静默回退规则路径；输出附带证据质量闸门（high / medium / low 与结论上限），证据不足时明确提示先核验再下结论。
- **检索正文缓存（cache_search）** —— 全文检索 `research` 抓过的正文（`node:sqlite` 持久缓存，存储 7 天；`node:sqlite` 不可用时自动降级为 no-op，免 flag 需 ≥ 22.13，22.5–22.12 需 `--experimental-sqlite`）。
```

</details>

#### 缺口

- 未有固定宿主的实际收益、费用和退出验证
  **影响**：无法给每份合格回答的成本结论
  **进一步探讨**：用同一题组记录结果质量、路由次数、费用与恢复检查

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按请求显示完整供应商轨迹能否减少错误归因？

**研究主题**：新假设与验证

#### 完整回答

当前输出已有实际引擎和回退解释，可尝试补充每个候选的跳过、发出、超时和结果四种可区分状态，并独立记录预算到期后是否仍在执行。新增价值是用户能定位是质量不足、凭据跳过还是预算截断，也可发现应当核查的并发成本。用含有已知链接的查询，在限流与超时条件比较当前提示和完整轨迹，观察错误切换、人工定位时间与额外输出量。若定位无改善或日志负担明显提高，就不扩大。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2726-2738](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L2726-L2738)

当前已有回退说明。

<details>
<summary>查看原文（13行）</summary>

```text
            // 用了非首选引擎时，在结果里附上准确提示（区分"不支持时间过滤被跳过"与"真实失败"）。
            // provider=auto 时 preferred 不是引擎而是路由模式：命中的引擎由 provider 字段体现，
            // 不能再套用 X-failed 句式（否则每次 auto 搜索都会附带一条假失败提示）。
            if (engine !== preferred && preferred !== "auto") {
              if (preferredSkippedReason === "disabled") {
                result.content = `Note: ${preferred} is disabled by configuration, using ${engine}.`;
              } else if (preferredSkippedReason === "time-filter") {
                result.content = `Note: ${preferred} does not support time filtering (timeRange=${timeRangeLabel}), using ${engine}.`;
              } else if (preferredFailure) {
                const label = FAILURE_CLASS_LABELS[preferredFailureClass] ?? FAILURE_CLASS_LABELS.unknown;
                result.content = `Note: ${preferred} ${label} (${preferredFailure}), using ${engine}.`;
              } else {
                result.content = `Note: ${preferred} unavailable or failed, using ${engine}.`;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3323-3359](https://github.com/DDDMUC/dsh-free-search/blob/11b4b8cc7d19cb1e5b3c5e2ad98ab5f3291572a5/lib/index.js#L3323-L3359)

并发里有凭据跳过及未完成引擎。

<details>
<summary>查看原文（37行）</summary>

```text
    const { eligible, missing: missingKeys } = explicitEngines
      ? { eligible: targetEngines, missing: [] }
      : partitionByCredentials(targetEngines, (engine) => availability.get(engine) !== false);

    // #69 §1：并发上限（天花板，不是配额）。仅在未显式指定 engines 时对语言池生效——
    // 调用方点名要哪几个引擎时尊重原意，不再用配置上限二次裁剪。
    const cfgMulti = current();
    const selectedEngines = explicitEngines
      ? targetEngines
      : selectEngines(eligible, cfgMulti.multiMaxEngines);
    const minSources = explicitEngines ? 1 : resolveMinSources(cfgMulti.multiMinSources, selectedEngines.length);

    const enginesUsed = [];
    const enginesEmpty = []; // 没报错但一条结果都没返回（与 failed 区分：它是"成功地什么都没给"）
    const failedEngines = [];
    // 缺凭据的引擎不再占用一次请求，但仍要出现在备注里，让用户看得见它为什么没跑
    const skipped = missingKeys.slice();
    const attemptedEngines = [];
    // #69 §3：整次 multi 也有总预算——并发扇出与后面的串行补跑都不允许无限拖长。
    // 到点时**已返回的引擎照常入账**（部分结果优先），未返回的记为 timeout。
    const multiDeadlineAt = Date.now() + SEARCH_BUDGET_MS;
    const outcomes = [];
    const runEngine = async (engine) => {
      attemptedEngines.push(engine);
      try {
        outcomes.push({ engine, res: await runEngineTest(engine, q, timeRange, limit) });
      } catch (error) {
        outcomes.push({ engine, res: { ok: false, error: error instanceof Error ? error.message : String(error) } });
      }
    };
    await Promise.race([
      Promise.all(selectedEngines.map(runEngine)),
      new Promise((resolve) => setTimeout(resolve, Math.max(0, multiDeadlineAt - Date.now()))),
    ]);
    const settledEngines = new Set(outcomes.map((o) => o.engine));
    for (const engine of selectedEngines) {
      if (!settledEngines.has(engine)) failedEngines.push(`${engine} [timeout] (search budget exceeded)`);
```

</details>

#### 缺口

- 预算到期后能否稳定拿到各外部调用终态未知
  **影响**：可能无法补齐完整轨迹
  **进一步探讨**：对受控引擎先验证状态事件和关联 ID

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
